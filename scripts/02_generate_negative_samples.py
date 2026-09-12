"""
Day 1 / Step 2 (cont.) — Generate negative (non-cloudburst) samples.

Pulls the SAME variables, for the SAME set of HP locations, on random
monsoon-season days (Jun-Sep) that were NOT reported cloudburst days,
across a spread of years. Ratio is 3-5x the positive count, per the plan.

Output: data/raw_weather_negative.csv
"""

import random
import time
import datetime as dt
import pandas as pd

from importlib import import_module
fetch_mod = import_module("01_fetch_historical_weather")  # reuse fetch_power / fetch_open_meteo

NEGATIVE_MULTIPLIER = 4  # 4x as many negatives as positives
MONSOON_MONTHS = [6, 7, 8, 9]
# Full 10-year window (2015-2025) even though positive events only go back to 2019 —
# gives the model a wider baseline of "normal monsoon day" weather patterns to discriminate against.
YEARS = list(range(2015, 2026))


def random_monsoon_date(exclude_dates, years=YEARS, months=MONSOON_MONTHS):
    for _ in range(200):  # retry loop to avoid collisions with positive dates
        year = random.choice(years)
        month = random.choice(months)
        day = random.randint(1, 28)
        candidate = dt.datetime(year, month, day)
        # avoid being within 2 days of any known positive event (same district)
        if all(abs((candidate - d).days) > 2 for d in exclude_dates):
            return candidate
    return candidate  # fall back after retries


def main():
    events = pd.read_csv("data/positive_events.csv", parse_dates=["date"])
    n_negatives = len(events) * NEGATIVE_MULTIPLIER

    # sample locations from the same set of monitored districts/points used for positives
    # (keeps terrain/orographic context consistent between positive and negative classes)
    location_pool = events[["district", "lat", "lon"]].drop_duplicates().to_dict("records")

    all_rows = []
    positive_dates_by_district = events.groupby("district")["date"].apply(list).to_dict()

    for i in range(n_negatives):
        loc = random.choice(location_pool)
        exclude = positive_dates_by_district.get(loc["district"], [])
        neg_date = random_monsoon_date(exclude)

        window_start = neg_date - dt.timedelta(hours=fetch_mod.LOOKBACK_HOURS)
        window_end = neg_date + dt.timedelta(hours=fetch_mod.LOOKAHEAD_HOURS)

        print(f"Fetching negative sample {i+1}/{n_negatives}: {loc['district']} on {neg_date.date()}...")

        power_df = fetch_mod.fetch_power(
            loc["lat"], loc["lon"],
            window_start.strftime("%Y%m%d"), window_end.strftime("%Y%m%d"),
        )
        om_df = fetch_mod.fetch_open_meteo(
            loc["lat"], loc["lon"],
            window_start.strftime("%Y-%m-%d"), window_end.strftime("%Y-%m-%d"),
        )

        for df in (power_df, om_df):
            if df is not None:
                df["event_id"] = f"NEG{i:03d}"
                df["event_date"] = neg_date
                df["district"] = loc["district"]
                df["lat"] = loc["lat"]
                df["lon"] = loc["lon"]
                df["label"] = 0  # negative (no reported cloudburst)
                all_rows.append(df)

        time.sleep(1)

    if not all_rows:
        print("No negative data fetched — check connection.")
        return

    combined = pd.concat(all_rows, ignore_index=True)
    combined.to_csv("data/raw_weather_negative.csv", index=False)
    print(f"\nSaved {len(combined)} rows to data/raw_weather_negative.csv")
    print(f"Negative samples fetched: {combined['event_id'].nunique()} / {n_negatives}")


if __name__ == "__main__":
    main()
