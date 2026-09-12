"""
Day 2 — Feature engineering (v2: windowed multi-snapshot).

CHANGE FROM v1: instead of collapsing each event's entire pre-event window
into ONE row, this takes several hourly "snapshots" leading up to each
event (e.g. 9h, 6h, 3h, 0h before) and engineers features causally at each
snapshot (only using data up to and including that snapshot time — no
future leakage). This turns 29 positive events into ~90-110 positive
training rows using data you already fetched, without inventing any new
incidents.

IMPORTANT: every snapshot keeps the original event_id. 04_train_model.py
MUST group cross-validation folds by event_id (StratifiedGroupKFold), or
snapshots from the same event can end up in both train and test, which
would inflate scores dishonestly.

Output: data/training_dataset.csv (one row per snapshot, ready for
04_train_model.py)
"""

import time
import requests
import pandas as pd

ELEVATION_URL = "https://api.open-meteo.com/v1/elevation"

# Hours BEFORE the event/sample date to take a snapshot at. 0 = right at
# the reported event time. Matches the 24h lookback window fetched in
# script 01, with room to spare for the 6h trailing calculations.
SNAPSHOT_LEADS_HOURS = [0, 3, 6, 9]
MIN_READINGS_FOR_SNAPSHOT = 4  # skip a snapshot if too little trailing data


def get_elevation(lat, lon, max_retries=3):
    for attempt in range(max_retries):
        try:
            resp = requests.get(ELEVATION_URL, params={"latitude": lat, "longitude": lon}, timeout=15)
            resp.raise_for_status()
            return resp.json()["elevation"][0]
        except Exception as e:
            print(f"  elevation attempt {attempt+1} failed: {e}")
            time.sleep(1)
    return None


def _extract_series(window: pd.DataFrame):
    rh = window["rh_pct"].dropna() if "rh_pct" in window else pd.Series(dtype=float)
    pressure = window["pressure_kpa"].dropna() if "pressure_kpa" in window else pd.Series(dtype=float)
    if pressure.empty and "pressure_hpa" in window:
        pressure = window["pressure_hpa"].dropna() / 10.0  # hPa -> kPa
    precip = window["precip_mm"].dropna() if "precip_mm" in window else pd.Series(dtype=float)
    wind = window["wind_ms"].dropna() if "wind_ms" in window else pd.Series(dtype=float)
    if wind.empty and "wind_gust_ms" in window:
        wind = window["wind_gust_ms"].dropna()
    cloud = window["cloud_cover_pct"].dropna() if "cloud_cover_pct" in window else pd.Series(dtype=float)
    return rh, pressure, precip, wind, cloud


def _delta_over_window(series, hours=6):
    if len(series) < hours + 1:
        return series.iloc[-1] - series.iloc[0] if len(series) > 1 else 0.0
    return series.iloc[-1] - series.iloc[-(hours + 1)]


def engineer_snapshot(event_id, district, lat, lon, label, snapshot_time, lead_hours, window: pd.DataFrame) -> dict:
    rh, pressure, precip, wind, cloud = _extract_series(window)

    humidity_spike_3h = _delta_over_window(rh, 3) if len(rh) else None
    humidity_spike_6h = _delta_over_window(rh, 6) if len(rh) else None
    pressure_drop_3h = -_delta_over_window(pressure, 3) if len(pressure) else None
    pressure_drop_6h = -_delta_over_window(pressure, 6) if len(pressure) else None

    # precip acceleration: is rainfall intensifying in the last 3h vs the
    # 3h before that, rather than just "how much rain fell overall"
    if len(precip) >= 6:
        precip_recent_3h = precip.iloc[-3:].sum()
        precip_prior_3h = precip.iloc[-6:-3].sum()
        precip_acceleration = precip_recent_3h - precip_prior_3h
    else:
        precip_acceleration = None

    # moisture-pumping-in-as-pressure-collapses interaction — physically,
    # cloudbursts are associated with BOTH happening together, not either alone
    if humidity_spike_6h is not None and pressure_drop_6h is not None:
        humidity_pressure_interaction = humidity_spike_6h * pressure_drop_6h
    else:
        humidity_pressure_interaction = None

    return {
        "snapshot_id": f"{event_id}_L{lead_hours}",
        "event_id": event_id,  # KEEP for grouped CV — never split an event across folds
        "district": district,
        "lat": lat,
        "lon": lon,
        "label": label,
        "lead_hours": lead_hours,
        "month": pd.to_datetime(snapshot_time).month,
        "day_of_year": pd.to_datetime(snapshot_time).dayofyear,
        "humidity_spike_3h": humidity_spike_3h,
        "humidity_spike_6h": humidity_spike_6h,
        "humidity_max": rh.max() if len(rh) else None,
        "pressure_drop_3h": pressure_drop_3h,
        "pressure_drop_6h": pressure_drop_6h,
        "precip_rate_max_mm_hr": precip.max() if len(precip) else None,
        "precip_total_mm": precip.sum() if len(precip) else None,
        "precip_acceleration": precip_acceleration,
        "cloud_cover_max_pct": cloud.max() if len(cloud) else None,
        "wind_gust_max_ms": wind.max() if len(wind) else None,
        "humidity_pressure_interaction": humidity_pressure_interaction,
    }


def build_snapshots_for_group(group: pd.DataFrame) -> list:
    group = group.sort_values("timestamp")
    event_id = group["event_id"].iloc[0]
    district = group["district"].iloc[0]
    lat = group["lat"].iloc[0]
    lon = group["lon"].iloc[0]
    label = group["label"].iloc[0]
    event_date = pd.to_datetime(group["event_date"].iloc[0])

    rows = []
    for lead in SNAPSHOT_LEADS_HOURS:
        snapshot_time = event_date - pd.Timedelta(hours=lead)
        # causal filter: only data up to and including this snapshot time
        window = group[group["timestamp"] <= snapshot_time]
        if len(window) < MIN_READINGS_FOR_SNAPSHOT:
            continue
        rows.append(engineer_snapshot(event_id, district, lat, lon, label, snapshot_time, lead, window))
    return rows


def main():
    pos = pd.read_csv("data/raw_weather_positive.csv", parse_dates=["timestamp", "event_date"])
    neg = pd.read_csv("data/raw_weather_negative.csv", parse_dates=["timestamp", "event_date"])
    raw = pd.concat([pos, neg], ignore_index=True)

    feature_rows = []
    for _, g in raw.groupby("event_id"):
        feature_rows.extend(build_snapshots_for_group(g))
    features_df = pd.DataFrame(feature_rows)

    # static terrain features — one elevation lookup per unique lat/lon pair
    print("Fetching elevation for unique locations...")
    unique_locs = features_df[["lat", "lon"]].drop_duplicates()
    elev_map = {}
    for _, row in unique_locs.iterrows():
        key = (row["lat"], row["lon"])
        elev_map[key] = get_elevation(row["lat"], row["lon"])
        time.sleep(0.5)

    features_df["elevation_m"] = features_df.apply(
        lambda r: elev_map.get((r["lat"], r["lon"])), axis=1
    )

    features_df.to_csv("data/training_dataset.csv", index=False)
    n_events = features_df["event_id"].nunique()
    print(f"\nSaved {len(features_df)} snapshot rows (from {n_events} unique events) to data/training_dataset.csv")
    print(f"Positive rows: {(features_df['label']==1).sum()} (from {features_df[features_df['label']==1]['event_id'].nunique()} events)")
    print(f"Negative rows: {(features_df['label']==0).sum()} (from {features_df[features_df['label']==0]['event_id'].nunique()} events)")
    print("\nMissing-value counts per column:")
    print(features_df.isna().sum())


if __name__ == "__main__":
    main()
