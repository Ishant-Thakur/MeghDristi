"""
Day 3 — Fetch weather + engineer features for new verified events (v2).

v2 SUPERSEDES the earlier draft. After seeing your real
01_fetch_historical_weather.py and 03_feature_engineering.py, the draft's
hand-rolled formulas didn't match yours in several ways (see CHANGES below).
v2 fixes this by literally IMPORTING and reusing your actual fetch_power /
fetch_open_meteo / build_snapshots_for_group / get_elevation functions —
same trick your own 02_generate_negative_samples.py already uses to reuse
01's fetch functions. This guarantees zero formula drift between your
existing 572 rows and these new ones.

CHANGES FROM THE DRAFT (why the rewrite was necessary)
- Pressure units: your pipeline works in kPa (Open-Meteo hPa / 10 as
  fallback). The draft used Open-Meteo hPa directly, unconverted — that
  would have made pressure_drop values ~10x too large.
- humidity_spike_Nh / pressure_drop_Nh: your pipeline computes a simple
  POINT delta (value now minus value N hours ago, via _delta_over_window),
  not clipped to positive and not a rolling sum. The draft computed a
  rolling-sum-of-positive-diffs — a different quantity.
- precip_acceleration: your pipeline compares sum(last 3h) vs sum(prior
  3h). The draft used the max single-step difference.
- humidity_pressure_interaction: your pipeline multiplies
  humidity_spike_6h * pressure_drop_6h (spikes, not maxima). The draft
  used humidity_max * pressure_drop_6h.
- Row structure: your pipeline takes MULTIPLE causal snapshots per event
  (leads of 0h/3h/6h/9h, using only data up to that point) — this is how
  you turned 29 events into ~90-110 training rows in the first place.
  The draft produced one row per event from the whole day, throwing that
  multiplier away.

SEPARATE, PRE-EXISTING ISSUE (not caused by this script, flagging anyway)
01_fetch_historical_weather.py's Open-Meteo fallback doesn't set
wind_speed_unit="ms", so Open-Meteo defaults to km/h. Any existing row
sourced from the Open-Meteo fallback (i.e. events where NASA POWER failed)
has wind_gust_ms mislabeled as m/s when it's actually km/h. Worth checking
how many of your current 572 rows came from that fallback path — this
script inherits the same behavior for consistency, but you may want to
fix it upstream in 01 for BOTH old and new data at once, rather than
having new rows secretly use different units than old ones.

WHAT THIS SCRIPT DOES
1. Reads data/new_events_verified.csv — columns required:
       event_id, date, location, district, lat, lon
   (your manually verified candidates from 05_scrape_candidate_events.py —
   "district" must match the same district naming you use elsewhere,
   since 02's negative-sampling and downstream grouping key off it.)
2. Appends these to data/positive_events.csv so
   compute_seasonal_multipliers() in 04_train_model.py picks them up.
3. Calls fetch_power / fetch_open_meteo from 01_fetch_historical_weather.py
   for each new event — identical fetch logic, identical lookback/lookahead.
4. Calls build_snapshots_for_group from 03_feature_engineering.py — this
   produces the same 0h/3h/6h/9h causal snapshots with identical formulas.
5. Appends elevation and writes new rows straight into
   data/training_dataset.csv — no separate reconciliation file, no
   manual copy-paste step.

USAGE
    python scripts/06_fetch_weather_snapshots.py
Run this FROM YOUR PROJECT ROOT (same folder as 01_fetch_historical_weather.py
and 03_feature_engineering.py) so the imports below resolve correctly.

AFTER RUNNING
Re-run 04_train_model.py and compare against your current baseline
(RandomForest weather-only 0.635 AUC / combined-with-seasonal 0.668 AUC)
before reporting new numbers anywhere.
"""

import time
from importlib import import_module

import pandas as pd

fetch_mod = import_module("01_fetch_historical_weather")
feat_mod = import_module("03_feature_engineering")

NEW_EVENTS_PATH = "data/new_events_verified.csv"
POSITIVE_EVENTS_PATH = "data/positive_events.csv"
TRAINING_DATASET_PATH = "data/training_dataset.csv"


def main():
    new_events = pd.read_csv(NEW_EVENTS_PATH, parse_dates=["date"])
    required = {"event_id", "date", "location", "district", "lat", "lon"}
    missing = required - set(new_events.columns)
    if missing:
        raise ValueError(f"{NEW_EVENTS_PATH} is missing required columns: {missing}")

    # --- 1. Append to positive_events.csv so seasonal multipliers see them ---
    existing_events = pd.read_csv(POSITIVE_EVENTS_PATH, parse_dates=["date"])
    dupe_ids = set(existing_events["event_id"]) & set(new_events["event_id"])
    if dupe_ids:
        raise ValueError(f"event_id collision with existing positive_events.csv: {dupe_ids}")

    combined_events = pd.concat([existing_events, new_events], ignore_index=True)
    combined_events.to_csv(POSITIVE_EVENTS_PATH, index=False)
    print(f"Appended {len(new_events)} new events to {POSITIVE_EVENTS_PATH} "
          f"({len(existing_events)} -> {len(combined_events)} total).")

    # --- 2. Fetch raw hourly weather — identical to 01_fetch_historical_weather.py ---
    all_rows = []
    for _, ev in new_events.iterrows():
        event_dt = ev["date"]
        window_start = event_dt - pd.Timedelta(hours=fetch_mod.LOOKBACK_HOURS)
        window_end = event_dt + pd.Timedelta(hours=fetch_mod.LOOKAHEAD_HOURS)

        print(f"Fetching {ev['event_id']} ({ev['location']}, {event_dt.date()})...")

        power_df = fetch_mod.fetch_power(
            ev["lat"], ev["lon"],
            window_start.strftime("%Y%m%d"), window_end.strftime("%Y%m%d"),
        )
        om_df = fetch_mod.fetch_open_meteo(
            ev["lat"], ev["lon"],
            window_start.strftime("%Y-%m-%d"), window_end.strftime("%Y-%m-%d"),
        )

        for df in (power_df, om_df):
            if df is not None:
                df["event_id"] = ev["event_id"]
                df["event_date"] = event_dt
                df["district"] = ev["district"]
                df["lat"] = ev["lat"]
                df["lon"] = ev["lon"]
                df["label"] = 1
                all_rows.append(df)

        time.sleep(1)

    if not all_rows:
        print("No raw weather fetched for new events — nothing to add. Check connectivity.")
        return

    new_raw = pd.concat(all_rows, ignore_index=True)

    # --- 3. Engineer snapshot features — identical to 03_feature_engineering.py ---
    feature_rows = []
    for _, g in new_raw.groupby("event_id"):
        feature_rows.extend(feat_mod.build_snapshots_for_group(g))
    new_features = pd.DataFrame(feature_rows)

    if new_features.empty:
        print(
            "No snapshots survived MIN_READINGS_FOR_SNAPSHOT filtering — "
            "likely too little pre-event data was returned for these events. "
            "Nothing added to training_dataset.csv."
        )
        return

    print("Fetching elevation for new locations...")
    unique_locs = new_features[["lat", "lon"]].drop_duplicates()
    elev_map = {}
    for _, row in unique_locs.iterrows():
        elev_map[(row["lat"], row["lon"])] = feat_mod.get_elevation(row["lat"], row["lon"])
        time.sleep(0.5)

    new_features["elevation_m"] = new_features.apply(
        lambda r: elev_map.get((r["lat"], r["lon"])), axis=1
    )

    # --- 4. Append straight into training_dataset.csv ---
    existing_dataset = pd.read_csv(TRAINING_DATASET_PATH)
    combined_dataset = pd.concat([existing_dataset, new_features], ignore_index=True)
    combined_dataset.to_csv(TRAINING_DATASET_PATH, index=False)

    n_new_events = new_features["event_id"].nunique()
    print(
        f"\nAdded {len(new_features)} new snapshot rows from {n_new_events} new events "
        f"to {TRAINING_DATASET_PATH}."
    )
    print(f"Dataset size: {len(existing_dataset)} -> {len(combined_dataset)} rows.")
    print("\nMissing-value counts in the NEW rows only (sanity check before retraining):")
    print(new_features.isna().sum())
    print(
        "\nNext step: re-run 04_train_model.py and compare the new ROC-AUC + confusion "
        "matrices against your current baseline (RandomForest weather-only 0.635 AUC, "
        "combined-with-seasonal 0.668 AUC) before reporting any new numbers."
    )


if __name__ == "__main__":
    main()
