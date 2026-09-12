"""
Day 3 (cont.) — Cluster candidate headlines for tractable manual review.

WHY THIS EXISTS
05_scrape_candidate_events.py can easily return 1000+ raw headlines once
you're searching multiple regions x multiple keyword variants x multiple
years. Reading every row individually doesn't scale. But real cloudburst
events tend to get covered by SEVERAL outlets within a day or two of each
other, while noise (metaphorical "cloudburst of criticism" headlines,
unrelated wire stories, etc.) tends to appear as isolated one-offs.

This script groups raw headlines into clusters by (region, date window),
sorts clusters by how much corroborating coverage they have, and applies
a light keyword filter to drop obvious non-weather noise. You then only
need to review ~100-150 CLUSTERS instead of ~1400 individual rows —
picking one representative headline per cluster is usually enough to
decide whether it's worth chasing down further.

THIS STILL DOES NOT AUTO-LABEL ANYTHING. It's a triage step, not a
verification step. Every cluster you keep still needs the same manual
check against IMD bulletins / district reports described in
05_scrape_candidate_events.py before it goes into new_events_verified.csv.

INPUT
data/candidate_events_raw.csv (output of 05_scrape_candidate_events.py)

OUTPUT
data/candidate_events_clustered.csv — one row per cluster, columns:
    cluster_id, region_guess, date_range, n_articles,
    representative_headline, all_headlines, all_links
Sorted by n_articles descending (most-corroborated first), since those
are the highest-confidence leads to check first if you're short on time.

USAGE
    python scripts/07_cluster_candidates.py
"""

import re
from datetime import datetime, timedelta

import pandas as pd

INPUT_PATH = "data/candidate_events_raw.csv"
OUTPUT_PATH = "data/candidate_events_clustered.csv"

# Same region list as 05_scrape_candidate_events.py — used here to tag
# which region a headline is about, based on the search query that found it.
DATE_WINDOW_DAYS = 3  # headlines about the same region within this many
                       # days of each other are treated as one cluster

# Headlines containing these phrases are near-certainly NOT weather events
# (metaphorical usage is common in Indian political/entertainment reporting).
NOISE_PHRASES = [
    "cloudburst of criticism", "cloudburst of emotions", "cloudburst of support",
    "cloudburst of joy", "cloudburst of reactions", "cloudburst of memes",
    "box office", "movie review", "album review", "stock market",
]


def is_noise(headline: str) -> bool:
    lower = headline.lower()
    return any(phrase in lower for phrase in NOISE_PHRASES)


def extract_region(query: str) -> str:
    """
    05's query format is: '"<keyword>" "<region>" <year>' — pull the region
    out of the second quoted segment.
    """
    matches = re.findall(r'"([^"]+)"', query)
    if len(matches) >= 2:
        return matches[1]
    return "unknown"


def parse_date_safe(value: str):
    try:
        return datetime.fromisoformat(value).date()
    except Exception:
        return None


def cluster_rows(df: pd.DataFrame) -> list:
    """
    Greedy clustering: group by region, sort by date, then walk through
    chronologically and start a new cluster whenever the gap since the
    last headline in the current cluster exceeds DATE_WINDOW_DAYS.
    """
    clusters = []
    for region, group in df.groupby("region_guess"):
        group = group.dropna(subset=["parsed_date"]).sort_values("parsed_date")
        if group.empty:
            continue

        current = []
        last_date = None
        for _, row in group.iterrows():
            if last_date is not None and (row["parsed_date"] - last_date).days > DATE_WINDOW_DAYS:
                clusters.append((region, current))
                current = []
            current.append(row)
            last_date = row["parsed_date"]
        if current:
            clusters.append((region, current))
    return clusters


def main():
    df = pd.read_csv(INPUT_PATH)
    before = len(df)

    df = df[~df["headline"].apply(is_noise)].copy()
    print(f"Dropped {before - len(df)} rows matching obvious noise phrases ({len(df)} remain).")

    df["region_guess"] = df["query"].apply(extract_region)
    df["parsed_date"] = df["published_at"].apply(parse_date_safe)

    n_undated = df["parsed_date"].isna().sum()
    if n_undated:
        print(f"Note: {n_undated} rows had an unparseable date and will be excluded from clustering.")

    clusters = cluster_rows(df)

    output_rows = []
    for i, (region, rows) in enumerate(clusters):
        dates = [r["parsed_date"] for r in rows]
        headlines = [r["headline"] for r in rows]
        links = [r["source_link"] for r in rows]
        output_rows.append({
            "cluster_id": f"C{i:04d}",
            "region_guess": region,
            "date_range": f"{min(dates)} to {max(dates)}" if min(dates) != max(dates) else str(min(dates)),
            "n_articles": len(rows),
            "representative_headline": headlines[0],
            "all_headlines": " | ".join(headlines[:8]) + (" | ..." if len(headlines) > 8 else ""),
            "all_links": " | ".join(links[:8]) + (" | ..." if len(links) > 8 else ""),
        })

    out_df = pd.DataFrame(output_rows).sort_values("n_articles", ascending=False)
    out_df.to_csv(OUTPUT_PATH, index=False)

    print(f"\nGrouped {len(df)} headlines into {len(out_df)} clusters.")
    print(f"Saved to {OUTPUT_PATH}, sorted by corroborating-article count (highest first).\n")
    print("Cluster size distribution:")
    print(out_df["n_articles"].value_counts().sort_index(ascending=False).head(10))
    print(
        "\nSUGGESTED TRIAGE ORDER:\n"
        "  1. Start with clusters that have 3+ articles — highest chance of being\n"
        "     real, widely-reported events. Check these first.\n"
        "  2. Clusters with exactly 1-2 articles are still worth a skim, but expect\n"
        "     a lower hit rate — many will be routine heavy-rain stories that used\n"
        "     the word loosely, not confirmed cloudbursts.\n"
        "  3. For each cluster you confirm, open one of its linked articles, verify\n"
        "     the actual event date + a specific village/town name, then add it to\n"
        "     new_events_verified.csv as described earlier."
    )


if __name__ == "__main__":
    main()
