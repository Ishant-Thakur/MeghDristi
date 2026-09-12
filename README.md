# HP Cloudburst Risk — Dataset + Model Pipeline

Covers Day 1 (dataset) + Day 2 (model) of your plan. Run in order:

```bash
pip install -r requirements.txt
cd scripts
python 01_fetch_historical_weather.py      # pulls NASA POWER + Open-Meteo for each positive event
python 02_generate_negative_samples.py     # pulls the same vars for random non-event monsoon days
python 03_feature_engineering.py           # collapses hourly data -> one engineered row per event, adds elevation
python 04_train_model.py                   # trains RandomForest, prints confusion matrix + feature importances
```

**Run this on a machine with real internet access** (your laptop / Colab) — `power.larc.nasa.gov`
and `open-meteo.com` need to be reachable, which they won't be from a locked-down sandbox.

## What's in `data/positive_events.csv`

29 real, individually-sourced HP cloudburst events (2019–2025), pulled from news archives
(News on Air/Akashvani, Deccan Herald, Tribune India, SANDRP, Wikipedia's 2023 Himalayan floods
page, Drishti IAS, The Logical Indian, Business Standard/Gulf News, Holidify's news roundup).
Columns: `date, district, location, lat, lon, coord_precision, deaths_missing, source, notes`.

**On the "last 10 years starting 2015" ask:** I searched specifically for 2015–2018 HP
cloudburst events and could not find individually-dated, sourced incidents in freely accessible
news archives from that window — HP's cloudburst reporting got much more granular (and much more
frequent) from 2019 onward, which is also when SANDRP started publishing yearly incident
round-ups. For 2015–2018 coverage, your best sources are:
- The NIT Kurukshetra paper (Kushwaha & Rathi, *Natural Hazards*, 2025) — their 31-event dataset
  spans 2004–2019 and is exactly the kind of curated list you'd need; worth emailing the authors
  or checking if the dataset is in their paper's supplementary material.
- Bhan, Paul & Kharbanda, "Cloud bursts in Himachal Pradesh," *Mausam* 55(4), 2004 — historical
  IMD record, may cover earlier events if you can get library/Google Scholar access.
- SANDRP's own site (sandrp.in) has yearly "Cloudburst incidents in HP" posts back through
  2019 — 2015-2018 isn't covered in a single round-up post the way 2019+ is, so you'd need to
  search their site's tag archives page by page.

Given the timeline you're on, I'd suggest **training on the 2019–2025 events as your positive
set** and being upfront that "10 years" in your data-source description means "10 years of
weather data pulled from NASA POWER for both positive and negative samples," not "10 years of
individually labeled positive events" — that's an honest distinction that holds up under judge
questioning.

**Coordinate honesty:** `coord_precision` tells you how good each lat/lon is:
- `town`/`village` — genuinely located at that place
- `subdivision`/`valley`/`approx` — nearest good reference point I could pin, not the literal
  spot the cloudburst hit
- `district_centroid` — only the district was reported, not the location

For a hackathon-credible model this is fine, but say it out loud on your data-quality slide
rather than let judges assume every point is GPS-exact. If you have time, spend 20–30 min on
Google Maps refining the `approx`/`subdivision` rows to closer coordinates — that's the single
highest-leverage cleanup you could do with spare time.

**You should keep pulling more events if you have time** — I stopped at 22 to leave you time for
the model/backend, but the SANDRP 2023 report alone documents 65 HP cloudburst incidents that
year; their site (sandrp.in, search "cloudburst") and the NIT Kurukshetra paper's 31 events
(2004–2019, cited in the plan doc) are the fastest next sources to mine for more positive rows.

## What's NOT implemented (matches the plan's honest scoping)

- **Slope / distance-to-nearest-ridge**: the plan flags this as a real orographic-lift feature,
  but it needs DEM raster analysis (not a simple API call) — left out of `03_feature_engineering.py`
  to keep Day 2 tractable. Elevation alone is included as a cheaper proxy. Add slope later if you
  have a spare hour and want the stronger version.
- District boundary GeoJSON (for the map, not the model) — pull from GADM as the plan describes;
  that's a frontend/Day-3 concern, not part of this dataset/model piece.

## On the ML claim for judges

With ~20-25 positive events, don't say "we predict cloudbursts" — say you compute a real-time
risk score from known cloudburst precursors (humidity spike, pressure drop, precip rate,
orographic proxy), trained/validated against documented HP events, and show the confusion matrix
honestly. `04_train_model.py` prints exactly that.
