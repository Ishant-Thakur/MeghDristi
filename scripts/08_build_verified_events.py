"""
Day 3 (cont.) — Turn your confirmed events into new_events_verified.csv,
without hand-looking-up lat/lon for every village (v1).

WHAT YOU STILL HAVE TO DO MANUALLY (no way around this reliably)
Read each candidate cluster's linked article(s) and judge whether it's a
genuine cloudburst, and note the actual event date + a specific village/
town name. That judgment call needs a human — a script can't reliably
tell "cloudburst caused flash flooding, 3 dead" from "cloudburst warning
issued, no damage reported" from "cloudburst of controversy," etc.

WHAT THIS SCRIPT AUTOMATES
Once you've made those calls, you just type date + location + district
per confirmed event into a plain CSV (no coordinates needed). This script
geocodes each location via Open-Meteo's free geocoding API (no API key)
and writes out new_events_verified.csv in the exact schema
06_fetch_weather_snapshots.py expects — including auto-generated
event_ids that won't collide with your existing positive_events.csv.

INPUT
data/confirmed_events.csv — columns: date, location, district
    date:     YYYY-MM-DD, the actual event date (not article publish date)
    location: village/town name, e.g. "Kasol" — be as specific as you can,
              geocoding a well-known village is far more reliable than a
              generic area name
    district: e.g. "Kullu" — used for negative-sampling grouping downstream

OUTPUT
data/new_events_verified.csv — event_id, date, location, district, lat, lon
Ready to feed straight into 06_fetch_weather_snapshots.py.

If geocoding returns an ambiguous or wrong-looking result (e.g. matches a
same-named village in a different state), the row is flagged rather than
silently written — check the printed warnings before trusting the output.

USAGE
    python scripts/08_build_verified_events.py
"""

import time

import pandas as pd
import requests

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
INPUT_PATH = "data/confirmed_events.csv"
OUTPUT_PATH = "data/new_events_verified.csv"
POSITIVE_EVENTS_PATH = "data/positive_events.csv"

# Sanity-check bounding box for Himachal Pradesh (lat, lon). Widen/replace
# this if your project covers other states — it's just a guardrail to catch
# geocoding hits for a same-named village in the wrong part of the country.
EXPECTED_LAT_RANGE = (30.0, 33.5)
EXPECTED_LON_RANGE = (75.5, 79.0)


def geocode(location: str, district: str):
    """
    Returns (lat, lon, matched_name, warning) — warning is None if the
    match looks trustworthy, otherwise a string explaining the concern.
    """
    query = f"{location}, {district}, India"
    try:
        resp = requests.get(GEOCODE_URL, params={"name": location, "count": 5, "language": "en"}, timeout=15)
        resp.raise_for_status()
        results = resp.json().get("results", [])
    except Exception as e:
        return None, None, None, f"geocoding request failed: {e}"

    if not results:
        return None, None, None, "no geocoding match found — check spelling or try a nearby larger town"

    # Prefer a result whose admin1 (state) mentions Himachal, else fall back to first result.
    chosen = None
    for r in results:
        admin1 = (r.get("admin1") or "").lower()
        if "himachal" in admin1:
            chosen = r
            break
    if chosen is None:
        chosen = results[0]

    lat, lon = chosen["latitude"], chosen["longitude"]
    matched_name = f"{chosen.get('name')}, {chosen.get('admin1', '?')}"

    warning = None
    if not (EXPECTED_LAT_RANGE[0] <= lat <= EXPECTED_LAT_RANGE[1]
            and EXPECTED_LON_RANGE[0] <= lon <= EXPECTED_LON_RANGE[1]):
        warning = (f"matched coordinates ({lat:.3f}, {lon:.3f}) fall outside the expected "
                   f"Himachal Pradesh bounding box — likely a same-named place in another "
                   f"state. VERIFY MANUALLY before trusting this row.")
    elif len(results) > 1 and "himachal" not in (results[0].get("admin1") or "").lower():
        warning = (f"multiple geocoding matches for '{location}'; picked '{matched_name}' "
                   f"based on it mentioning Himachal Pradesh — double check this is right.")

    return lat, lon, matched_name, warning


def next_event_id(existing_ids: set, prefix="EV") -> callable:
    """Returns a generator function producing sequential unused event_ids."""
    used_numbers = set()
    for eid in existing_ids:
        if eid.startswith(prefix) and eid[len(prefix):].isdigit():
            used_numbers.add(int(eid[len(prefix):]))
    counter = [max(used_numbers, default=0)]

    def _next():
        counter[0] += 1
        return f"{prefix}{counter[0]:03d}"
    return _next


def main():
    confirmed = pd.read_csv(INPUT_PATH, dtype=str)
    required = {"date", "location", "district"}
    missing = required - set(confirmed.columns)
    if missing:
        raise ValueError(f"{INPUT_PATH} is missing required columns: {missing}")

    try:
        existing_events = pd.read_csv(POSITIVE_EVENTS_PATH, dtype=str)
        existing_ids = set(existing_events["event_id"])
    except FileNotFoundError:
        existing_ids = set()

    id_gen = next_event_id(existing_ids)

    rows = []
    warnings = []
    for _, row in confirmed.iterrows():
        location, district, date = row["location"].strip(), row["district"].strip(), row["date"].strip()
        print(f"Geocoding '{location}, {district}'...")
        lat, lon, matched_name, warning = geocode(location, district)
        time.sleep(1)  # be polite to the free API

        event_id = id_gen()
        if lat is None:
            print(f"  [SKIPPED] {location}: {warning}")
            warnings.append((event_id, location, warning))
            continue

        if warning:
            print(f"  [CHECK] {location} -> {matched_name} ({lat:.3f}, {lon:.3f}): {warning}")
            warnings.append((event_id, location, warning))
        else:
            print(f"  -> {matched_name} ({lat:.3f}, {lon:.3f})")

        rows.append({
            "event_id": event_id,
            "date": date,
            "location": location,
            "district": district,
            "lat": lat,
            "lon": lon,
        })

    if not rows:
        print("\nNo events were successfully geocoded. Nothing written.")
        return

    out_df = pd.DataFrame(rows)
    out_df.to_csv(OUTPUT_PATH, index=False)

    print(f"\nWrote {len(out_df)} events to {OUTPUT_PATH}.")
    if warnings:
        print(f"\n{len(warnings)} row(s) need a manual double-check before you trust the coordinates:")
        for event_id, location, warning in warnings:
            print(f"  {event_id} ({location}): {warning}")
    print(
        "\nNext: spot-check a few lat/lon values against Google Maps if you haven't "
        "already, then run 06_fetch_weather_snapshots.py."
    )


if __name__ == "__main__":
    main()
