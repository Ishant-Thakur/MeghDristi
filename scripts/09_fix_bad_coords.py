"""
One-time patch for the 3 events whose geocoded coordinates landed outside
Himachal Pradesh entirely (Andhra Pradesh, Uttar Pradesh, Nigeria) — see
the CHECK/VERIFY MANUALLY warnings 08_build_verified_events.py printed for
EV001, EV007, EV015. This script:

1. Corrects their lat/lon/coord_precision/notes in data/positive_events.csv
2. Removes their (wrong-location) rows from data/training_dataset.csv
3. Re-fetches weather and re-engineers features for just these 3 events
   using the CORRECTED coordinates — reusing the exact same fetch_power /
   fetch_open_meteo / build_snapshots_for_group functions as 06, so the
   re-fetched rows are formula-identical to everything else in your dataset
4. Appends the corrected rows back into data/training_dataset.csv

Run this ONCE, from your project root:
    python scripts/09_fix_bad_coords.py

Then run 04_train_model.py exactly once on the corrected data.
"""

import time
from importlib import import_module

import pandas as pd

fetch_mod = import_module("01_fetch_historical_weather")
feat_mod = import_module("03_feature_engineering")

POSITIVE_EVENTS_PATH = "data/positive_events.csv"
TRAINING_DATASET_PATH = "data/training_dataset.csv"

# Corrected coordinates, sourced from Wikipedia / official HP tourism site:
FIXES = {
    "EV001": {  # was geocoded to Andhra Pradesh (18.340, 83.390)
        "lat": 31.7667, "lon": 78.5833, "coord_precision": "approx",
        "note": "coords corrected: geocoder matched Andhra Pradesh; using nearby "
                 "Pooh, Kinnaur as an approximate stand-in (precise Kanam village "
                 "coordinates not found from available sources)",
    },
    "EV007": {  # was geocoded to Rampur, Uttar Pradesh (28.810, 79.027)
        "lat": 31.45, "lon": 77.63, "coord_precision": "town",
        "note": "coords corrected: geocoder matched Rampur, Uttar Pradesh instead "
                 "of Rampur Bushahr, Shimla district, HP",
    },
    "EV015": {  # was geocoded to Benue State, Nigeria (7.321, 8.469)
        "lat": 31.7667, "lon": 78.5833, "coord_precision": "town",
        "note": "coords corrected: geocoder matched Benue State, Nigeria instead "
                 "of Pooh, Kinnaur, HP",
    },
}


def main():
    # --- 1. Fix positive_events.csv ---
    events = pd.read_csv(POSITIVE_EVENTS_PATH, parse_dates=["date"])
    fixed_rows = {}
    for eid, fix in FIXES.items():
        mask = events["event_id"] == eid
        if mask.sum() != 1:
            print(f"WARNING: expected exactly 1 row for {eid} in {POSITIVE_EVENTS_PATH}, "
                  f"found {mask.sum()} — skipping this event, check manually.")
            continue
        events.loc[mask, "lat"] = fix["lat"]
        events.loc[mask, "lon"] = fix["lon"]
        events.loc[mask, "coord_precision"] = fix["coord_precision"]
        events.loc[mask, "notes"] = events.loc[mask, "notes"].astype(str) + " [" + fix["note"] + "]"
        fixed_rows[eid] = events.loc[mask].iloc[0]
        print(f"Corrected {eid} in positive_events.csv -> ({fix['lat']}, {fix['lon']})")

    events.to_csv(POSITIVE_EVENTS_PATH, index=False)

    if not fixed_rows:
        print("Nothing to fix — check event IDs match what's in positive_events.csv.")
        return

    # --- 2. Remove old (wrong-location) rows from training_dataset.csv ---
    dataset = pd.read_csv(TRAINING_DATASET_PATH)
    before = len(dataset)
    dataset = dataset[~dataset["event_id"].isin(fixed_rows.keys())]
    removed = before - len(dataset)
    print(f"\nRemoved {removed} wrong-location snapshot rows from {TRAINING_DATASET_PATH} "
          f"for events: {list(fixed_rows.keys())}")

    # --- 3. Re-fetch weather with CORRECTED coordinates, same logic as 06 ---
    all_rows = []
    for eid, ev in fixed_rows.items():
        event_dt = ev["date"]
        window_start = event_dt - pd.Timedelta(hours=fetch_mod.LOOKBACK_HOURS)
        window_end = event_dt + pd.Timedelta(hours=fetch_mod.LOOKAHEAD_HOURS)

        print(f"Re-fetching {eid} at corrected coords ({ev['lat']}, {ev['lon']})...")

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
                df["event_id"] = eid
                df["event_date"] = event_dt
                df["district"] = ev["district"]
                df["lat"] = ev["lat"]
                df["lon"] = ev["lon"]
                df["label"] = 1
                all_rows.append(df)

        time.sleep(1)

    if not all_rows:
        print("No raw weather fetched for corrected events — check connectivity. "
              "training_dataset.csv currently has the 3 events REMOVED but not replaced — "
              "re-run this script once connectivity is available.")
        return

    new_raw = pd.concat(all_rows, ignore_index=True)

    # --- 4. Engineer features, identical to 03 / 06 ---
    feature_rows = []
    for _, g in new_raw.groupby("event_id"):
        feature_rows.extend(feat_mod.build_snapshots_for_group(g))
    new_features = pd.DataFrame(feature_rows)

    if new_features.empty:
        print("No snapshots survived filtering for the corrected events — "
              "training_dataset.csv has them REMOVED but not replaced. Check manually.")
        return

    print("Fetching elevation for corrected locations...")
    unique_locs = new_features[["lat", "lon"]].drop_duplicates()
    elev_map = {}
    for _, row in unique_locs.iterrows():
        elev_map[(row["lat"], row["lon"])] = feat_mod.get_elevation(row["lat"], row["lon"])
        time.sleep(0.5)
    new_features["elevation_m"] = new_features.apply(
        lambda r: elev_map.get((r["lat"], r["lon"])), axis=1
    )

    # --- 5. Append corrected rows back in ---
    combined = pd.concat([dataset, new_features], ignore_index=True)
    combined.to_csv(TRAINING_DATASET_PATH, index=False)

    print(f"\nAdded back {len(new_features)} corrected snapshot rows for "
          f"{new_features['event_id'].nunique()} events.")
    print(f"training_dataset.csv: {before} -> {len(combined)} rows "
          f"(should match {before} if all 3 events re-fetched cleanly).")
    print("\nMissing values in corrected rows (sanity check):")
    print(new_features.isna().sum())
    print("\nDone. Now run: python scripts/04_train_model.py")


if __name__ == "__main__":
    main()
