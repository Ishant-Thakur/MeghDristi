"""
Day 3 — Find candidate cloudburst events via news search (v1).

WHAT THIS DOES
Your model is bottlenecked by having only 29 labeled positive events.
This script searches Google News RSS (no API key required) for reports
of cloudbursts / flash floods in your region across the years your
project covers, and dumps CANDIDATES to a CSV for you to manually
verify before adding them to data/positive_events.csv.

WHAT THIS DELIBERATELY DOES NOT DO
It does NOT auto-label events as positive. News headlines are noisy:
- a headline date is the PUBLISH date, which can lag the actual event
  by 1-3 days (especially for remote/hill areas)
- "cloudburst" is used loosely in Indian media for anything from a
  genuine cloudburst to a bad thunderstorm
- duplicate coverage of the same event across outlets will look like
  multiple "events"
Every row here is a LEAD, not ground truth. You (or someone who knows
the region) should check each one against IMD bulletins / district
disaster management reports before trusting the date, and before it
goes anywhere near positive_events.csv.

OUTPUT
data/candidate_events_raw.csv with columns:
  query, published_at, headline, source_link
Deduplicated by link. Sorted by published_at.

USAGE
    python scripts/05_scrape_candidate_events.py

Edit REGIONS and YEARS below to match your project's actual scope —
defaults are set for Himachal Pradesh monsoon cloudbursts, matching
the Jun-Sep MONSOON_MONTHS window used in 04_train_model.py.
"""

import csv
import time
import urllib.parse
from datetime import datetime

import feedparser

# --- EDIT THESE to match your project's actual geographic scope ---
REGIONS = [
    "Himachal Pradesh",
    "Kullu",
    "Mandi",
    "Shimla",
    "Kinnaur",
    "Chamba",
    "Kangra",
    "Sirmaur",
    "Lahaul Spiti",
]

# Search terms — "cloudburst" is the direct term; "flash flood" and
# "cloud burst" (two words) catch variant phrasing/translation.
KEYWORDS = ["cloudburst", "cloud burst", "flash flood"]

# Restrict to your monsoon years of interest. Google News RSS doesn't
# support a hard date-range filter in the free query string, so we
# search "<keyword> <region> <year>" per year and rely on the year
# token to narrow results, then double check the pubDate afterward.
YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025]

REQUEST_DELAY_SECONDS = 1.5  # be polite to Google's servers
OUTPUT_PATH = "data/candidate_events_raw.csv"


def build_query(keyword: str, region: str, year: int) -> str:
    return f'"{keyword}" "{region}" {year}'


def search_google_news_rss(query: str):
    """
    Google News RSS search — no API key required.
    Returns a list of (published_at, headline, link) tuples.
    """
    encoded = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={encoded}&hl=en-IN&gl=IN&ceid=IN:en"
    feed = feedparser.parse(url)

    results = []
    for entry in feed.entries:
        headline = entry.get("title", "").strip()
        link = entry.get("link", "").strip()
        published = entry.get("published", "")
        try:
            # feedparser gives RFC 822 dates; normalize to ISO date
            dt = datetime(*entry.published_parsed[:6])
            published_iso = dt.date().isoformat()
        except Exception:
            published_iso = published  # fall back to raw string

        if headline and link:
            results.append((published_iso, headline, link))
    return results


def main():
    rows = []
    seen_links = set()

    total_queries = len(KEYWORDS) * len(REGIONS) * len(YEARS)
    done = 0

    print(f"Running {total_queries} searches across {len(REGIONS)} regions, "
          f"{len(KEYWORDS)} keyword variants, {len(YEARS)} years.\n"
          f"This will take roughly {total_queries * REQUEST_DELAY_SECONDS / 60:.1f} minutes.\n")

    for year in YEARS:
        for region in REGIONS:
            for keyword in KEYWORDS:
                query = build_query(keyword, region, year)
                try:
                    hits = search_google_news_rss(query)
                except Exception as e:
                    print(f"  [skip] query failed: {query!r} ({e})")
                    hits = []

                new_hits = 0
                for published_at, headline, link in hits:
                    if link in seen_links:
                        continue
                    seen_links.add(link)
                    rows.append({
                        "query": query,
                        "published_at": published_at,
                        "headline": headline,
                        "source_link": link,
                    })
                    new_hits += 1

                done += 1
                if new_hits:
                    print(f"[{done}/{total_queries}] {query!r} -> {new_hits} new")
                time.sleep(REQUEST_DELAY_SECONDS)

    rows.sort(key=lambda r: r["published_at"])

    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["query", "published_at", "headline", "source_link"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nSaved {len(rows)} deduplicated candidate headlines to {OUTPUT_PATH}")
    print(
        "\nNEXT STEP (do not skip this): open the CSV and manually review each row.\n"
        "For each plausible cloudburst/flash-flood mention:\n"
        "  1. Confirm it's a genuine cloudburst, not routine heavy rain, using the\n"
        "     linked article and/or IMD district bulletins for that date.\n"
        "  2. Note the ACTUAL event date (may be 1-3 days before publish date).\n"
        "  3. Identify a specific location (village/town) so you can look up lat/lon.\n"
        "Then build a verified CSV with columns: event_id, date, location, lat, lon\n"
        "— that file is the input to 06_fetch_weather_snapshots.py."
    )


if __name__ == "__main__":
    main()
