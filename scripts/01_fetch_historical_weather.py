"""
Day 1 / Step 2 — Pull historical hourly weather for each labeled event.

For every row in data/positive_events.csv, this fetches a window of hourly
weather (temp, RH, pressure, precip, wind) around the event date from:
  1. NASA POWER (primary — matches the Kushwaha & Rathi 2025 methodology)
  2. Open-Meteo Historical (cross-check / backup if POWER is slow or missing a var)

Output: data/raw_weather_positive.csv (one row per hour per event, tagged
with event_id so you can later window it down to the pre-event hours).

Run this from a machine with internet access (VS Code locally, or Colab).
NASA POWER and Open-Meteo both work without an API key.
"""

import time
import datetime as dt
import pandas as pd
import requests

POWER_URL = "https://power.larc.nasa.gov/api/temporal/hourly/point"
OPEN_METEO_URL = "https://archive-api.open-meteo.com/v1/archive"

# How many hours BEFORE the reported event time to pull, so you can compute
# "humidity spike over last 3-6h" / "pressure drop over last 3-6h" style features.
LOOKBACK_HOURS = 24
LOOKAHEAD_HOURS = 3  # a little padding after, in case the reported date is off by a few hours


def fetch_power(lat, lon, start_date, end_date, max_retries=3):
    """NASA POWER hourly point data. Dates as YYYYMMDD strings."""
    params = {
        "parameters": "T2M,RH2M,PS,PRECTOTCORR,WS10M",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "start": start_date,
        "end": end_date,
        "format": "JSON",
    }
    for attempt in range(max_retries):
        try:
            resp = requests.get(POWER_URL, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            params_data = data["properties"]["parameter"]
            records = []
            for ts in params_data["T2M"].keys():
                # ts format: YYYYMMDDHH
                timestamp = dt.datetime.strptime(ts, "%Y%m%d%H")
                records.append({
                    "timestamp": timestamp,
                    "temp_c": params_data["T2M"].get(ts),
                    "rh_pct": params_data["RH2M"].get(ts),
                    "pressure_kpa": params_data["PS"].get(ts),
                    "precip_mm": params_data["PRECTOTCORR"].get(ts),
                    "wind_ms": params_data["WS10M"].get(ts),
                    "source": "nasa_power",
                })
            return pd.DataFrame(records)
        except Exception as e:
            print(f"  POWER attempt {attempt+1} failed: {e}")
            time.sleep(2)
    return None


def fetch_open_meteo(lat, lon, start_date, end_date, max_retries=3):
    """Open-Meteo historical archive, as a cross-check / fallback. Dates as YYYY-MM-DD."""
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "temperature_2m,relative_humidity_2m,surface_pressure,precipitation,cloud_cover,wind_gusts_10m",
        "timezone": "Asia/Kolkata",
    }
    for attempt in range(max_retries):
        try:
            resp = requests.get(OPEN_METEO_URL, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            hourly = data["hourly"]
            df = pd.DataFrame({
                "timestamp": pd.to_datetime(hourly["time"]),
                "temp_c": hourly["temperature_2m"],
                "rh_pct": hourly["relative_humidity_2m"],
                "pressure_hpa": hourly["surface_pressure"],
                "precip_mm": hourly["precipitation"],
                "cloud_cover_pct": hourly["cloud_cover"],
                "wind_gust_ms": hourly["wind_gusts_10m"],
            })
            df["source"] = "open_meteo"
            return df
        except Exception as e:
            print(f"  Open-Meteo attempt {attempt+1} failed: {e}")
            time.sleep(2)
    return None


def main():
    events = pd.read_csv("data/positive_events.csv", parse_dates=["date"])
    all_rows = []

    for _, ev in events.iterrows():
        event_dt = ev["date"]
        window_start = event_dt - dt.timedelta(hours=LOOKBACK_HOURS)
        window_end = event_dt + dt.timedelta(hours=LOOKAHEAD_HOURS)

        start_str_power = window_start.strftime("%Y%m%d")
        end_str_power = window_end.strftime("%Y%m%d")
        start_str_om = window_start.strftime("%Y-%m-%d")
        end_str_om = window_end.strftime("%Y-%m-%d")

        print(f"Fetching {ev['event_id']} ({ev['location']}, {ev['date'].date()})...")

        power_df = fetch_power(ev["lat"], ev["lon"], start_str_power, end_str_power)
        om_df = fetch_open_meteo(ev["lat"], ev["lon"], start_str_om, end_str_om)

        for df in (power_df, om_df):
            if df is not None:
                df["event_id"] = ev["event_id"]
                df["event_date"] = event_dt
                df["district"] = ev["district"]
                df["lat"] = ev["lat"]
                df["lon"] = ev["lon"]
                df["label"] = 1  # positive (cloudburst) event
                all_rows.append(df)

        time.sleep(1)  # be polite to free APIs

    if not all_rows:
        print("No data fetched — check your internet connection / API availability.")
        return

    combined = pd.concat(all_rows, ignore_index=True)
    combined.to_csv("data/raw_weather_positive.csv", index=False)
    print(f"\nSaved {len(combined)} rows to data/raw_weather_positive.csv")
    print(f"Events fetched: {combined['event_id'].nunique()} / {len(events)}")


if __name__ == "__main__":
    main()
