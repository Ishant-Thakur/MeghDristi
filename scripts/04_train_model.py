"""
Day 2 — Train model (v4: weather-only ML + explicit seasonal multiplier).

CHANGES FROM v3 — the ablation in v3 showed calendar features (month,
day_of_year) alone scored HIGHER (0.775 AUC) than the full feature set
(0.723), while weather-only scored just 0.635. That means the model was
mostly learning "which weeks of monsoon season" rather than real
atmospheric risk — a shortcut, not genuine signal.

Fix: the ML model now trains on WEATHER FEATURES ONLY (no month/
day_of_year) — its only job is "given today's atmospheric conditions,
how risky are they." Seasonal risk is instead computed as an EXPLICIT,
transparent multiplier derived directly from your positive_events.csv
month distribution (with Laplace smoothing), applied on top of the
weather-only probability. This keeps calendar effects honest and
visible instead of buried inside an opaque model score, and lets you
show judges exactly which part is learned vs which part is a documented
seasonal prior.

  final_risk_score = weather_only_ml_probability * seasonal_multiplier[month]

With only ~29 underlying positive events, DO NOT report a bare accuracy
number to judges. Report the cross-validated confusion matrix + ROC-AUC,
say explicitly how many EVENTS (not rows) you trained on, and be clear
that snapshot rows from the same event were never split across folds.
"""

import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.metrics import (
    confusion_matrix, classification_report, roc_auc_score,
    precision_recall_curve, f1_score,
)
from model_classes import build_rf, build_logreg, build_xgb, build_ensemble

# Weather-only — month/day_of_year deliberately excluded from the ML
# model (see module docstring). Handled instead via SEASONAL_MULTIPLIERS.
FEATURE_COLS = [
    "humidity_spike_3h", "humidity_spike_6h", "humidity_max",
    "pressure_drop_3h", "pressure_drop_6h",
    "precip_rate_max_mm_hr", "precip_total_mm", "precip_acceleration",
    "cloud_cover_max_pct", "wind_gust_max_ms",
    "humidity_pressure_interaction",
    "elevation_m",
]

MONSOON_MONTHS = [6, 7, 8, 9]  # Jun-Sep — matches 02_generate_negative_samples.py
N_FOLDS = 5
RANDOM_STATE = 42


def compute_seasonal_multipliers(events_path="data/positive_events.csv"):
    """
    Derive an EXPLICIT, auditable seasonal risk multiplier per month from
    your own labeled events — not a black-box learned weight.

    multiplier[month] = (smoothed share of positive events in that month)
                         / (uniform share = 1 / n_monsoon_months)

    Laplace (+1) smoothing avoids a hard zero for a month with no recorded
    events (e.g. September) — a total absence in a 29-event sample is weak
    evidence of zero risk, not proof of it. Months outside Jun-Sep (e.g.
    the one May event) get a fixed conservative multiplier since they're
    outside the core monsoon window this project is scoped to.
    """
    events = pd.read_csv(events_path, parse_dates=["date"])
    month_counts = events["date"].dt.month.value_counts()

    n_months = len(MONSOON_MONTHS)
    total = sum(month_counts.get(m, 0) for m in MONSOON_MONTHS)
    uniform_share = 1.0 / n_months

    OUTSIDE_MONSOON_MULTIPLIER = 0.5  # conservative default for months outside Jun-Sep

    multipliers = {}
    for m in MONSOON_MONTHS:
        smoothed_share = (month_counts.get(m, 0) + 1) / (total + n_months)  # +1 Laplace smoothing
        raw_multiplier = round(smoothed_share / uniform_share, 3)
        # Floor at the outside-monsoon baseline: a month INSIDE the monsoon
        # window with zero recorded events (small-sample artifact, e.g. Sep
        # in a 29-event dataset) should never score as "safer" than a month
        # entirely outside monsoon season — that would be backwards.
        multipliers[m] = max(raw_multiplier, OUTSIDE_MONSOON_MULTIPLIER)

    for m in range(1, 13):
        if m not in multipliers:
            multipliers[m] = OUTSIDE_MONSOON_MULTIPLIER

    print("Seasonal multipliers (derived from data/positive_events.csv month distribution):")
    for m in MONSOON_MONTHS:
        print(f"  Month {m}: {multipliers[m]}x  ({month_counts.get(m, 0)} of {total} events, Laplace-smoothed)")
    print(f"  All other months: {OUTSIDE_MONSOON_MULTIPLIER}x (outside core monsoon window)")

    return multipliers


def grouped_oof_probabilities(model_builder, X, y, groups, n_folds=N_FOLDS):
    sgkf = StratifiedGroupKFold(n_splits=n_folds, shuffle=True, random_state=RANDOM_STATE)
    oof = np.zeros(len(y))
    for train_idx, test_idx in sgkf.split(X, y, groups=groups):
        model = model_builder()
        model.fit(X.iloc[train_idx], y.iloc[train_idx])
        oof[test_idx] = model.predict_proba(X.iloc[test_idx])[:, 1]
    return oof


def pick_recall_favoring_threshold(y_true, y_proba, min_recall=0.7):
    precision, recall, thresholds = precision_recall_curve(y_true, y_proba)
    candidates = [
        (thr, r, p) for thr, r, p in zip(thresholds, recall[:-1], precision[:-1])
        if r >= min_recall
    ]
    if candidates:
        best = max(candidates, key=lambda c: c[2])
        return best[0]
    grid = np.linspace(0.05, 0.95, 19)
    f1s = [f1_score(y_true, (y_proba >= t).astype(int), zero_division=0) for t in grid]
    return grid[int(np.argmax(f1s))]


def report(name, y, y_proba):
    print(f"\n{'='*60}\n{name}\n{'='*60}")
    try:
        auc = roc_auc_score(y, y_proba)
        print(f"ROC-AUC (grouped cross-validated): {auc:.3f}")
    except ValueError:
        print("ROC-AUC undefined.")

    y_pred_default = (y_proba >= 0.5).astype(int)
    print("\n--- At default 0.5 threshold ---")
    print(confusion_matrix(y, y_pred_default))
    print(classification_report(y, y_pred_default, zero_division=0))

    threshold = pick_recall_favoring_threshold(y.values, y_proba, min_recall=0.7)
    y_pred_tuned = (y_proba >= threshold).astype(int)
    print(f"--- At recall-favoring threshold ({threshold:.3f}) ---")
    print(confusion_matrix(y, y_pred_tuned))
    print(classification_report(y, y_pred_tuned, zero_division=0))
    return threshold


def main():
    df = pd.read_csv("data/training_dataset.csv")
    df = df.dropna(subset=FEATURE_COLS + ["month"])

    X = df[FEATURE_COLS]
    y = df["label"].astype(int)
    groups = df["event_id"]
    months = df["month"]

    n_events = df["event_id"].nunique()
    n_pos_events = df[df["label"] == 1]["event_id"].nunique()
    n_neg_events = df[df["label"] == 0]["event_id"].nunique()
    print(f"Training on {len(df)} snapshot rows from {n_events} unique events "
          f"({n_pos_events} positive cloudburst events, {n_neg_events} negative days).")
    print("Cross-validation is GROUPED by event_id — no event's snapshots are ever split across train/test.")
    print("Model features are WEATHER-ONLY — month/day_of_year handled separately as an explicit multiplier.\n")

    # --- RandomForest ---
    rf_proba = grouped_oof_probabilities(build_rf, X, y, groups)
    rf_auc = roc_auc_score(y, rf_proba)
    rf_threshold = report("RandomForest (300 trees, max_depth=6) — weather-only", y, rf_proba)

    # --- Logistic Regression ---
    lr_proba = grouped_oof_probabilities(build_logreg, X, y, groups)
    lr_auc = roc_auc_score(y, lr_proba)
    lr_threshold = report("Logistic Regression (C=0.1, regularized) — weather-only", y, lr_proba)

    # --- XGBoost ---
    xgb_proba = grouped_oof_probabilities(build_xgb, X, y, groups)
    xgb_auc = roc_auc_score(y, xgb_proba)
    xgb_threshold = report("XGBoost (200 trees, max_depth=3, regularized) — weather-only", y, xgb_proba)

    # --- Ensemble average of all three (uses the SAME out-of-fold probabilities
    #     already computed above, per-fold — this is a fair comparison, not
    #     re-fit on different data) ---
    ensemble_proba = (rf_proba + lr_proba + xgb_proba) / 3.0
    ensemble_auc = roc_auc_score(y, ensemble_proba)
    ensemble_threshold = report("Ensemble (average of RF + LogReg + XGBoost) — weather-only", y, ensemble_proba)

    print(f"\n{'='*60}\nMODEL COMPARISON (weather-only)\n{'='*60}")
    print(f"RandomForest ROC-AUC:       {rf_auc:.3f}")
    print(f"LogisticRegression ROC-AUC: {lr_auc:.3f}")
    print(f"XGBoost ROC-AUC:            {xgb_auc:.3f}")
    print(f"Ensemble (average) ROC-AUC: {ensemble_auc:.3f}")

    candidates = {
        "RandomForest": (rf_auc, rf_threshold, build_rf, rf_proba),
        "LogisticRegression": (lr_auc, lr_threshold, build_logreg, lr_proba),
        "XGBoost": (xgb_auc, xgb_threshold, build_xgb, xgb_proba),
        "Ensemble": (ensemble_auc, ensemble_threshold, build_ensemble, ensemble_proba),
    }
    winner = max(candidates, key=lambda name: candidates[name][0])
    winner_threshold = candidates[winner][1]
    winner_proba = candidates[winner][3]
    print(f"-> Better on cross-validated ROC-AUC: {winner}")
    print("(Report all four to judges — it shows you tested for overfitting, not just picked one model.)")

    # --- Ablation: is elevation_m carrying real signal or a location shortcut? ---
    # With events now spread across many more districts, elevation varies more
    # between event locations than before — worth checking whether the model
    # is learning "what kind of place this is" rather than atmospheric conditions.
    print(f"\n{'='*60}\nABLATION: with vs without elevation_m\n{'='*60}")
    cols_with_elev = FEATURE_COLS
    cols_without_elev = [c for c in FEATURE_COLS if c != "elevation_m"]

    proba_with = grouped_oof_probabilities(build_rf, X[cols_with_elev], y, groups)
    auc_with = roc_auc_score(y, proba_with)
    proba_without = grouped_oof_probabilities(build_rf, X[cols_without_elev], y, groups)
    auc_without = roc_auc_score(y, proba_without)

    print(f"RandomForest WITH elevation_m:    ROC-AUC {auc_with:.3f}")
    print(f"RandomForest WITHOUT elevation_m: ROC-AUC {auc_without:.3f}")
    drop = auc_with - auc_without
    if abs(drop) < 0.02:
        print(f"-> Difference is small ({drop:+.3f}) — elevation is NOT doing much work. "
              "Its high feature-importance ranking is likely because it's a stable per-location "
              "value (low noise) that the trees latch onto, not because it's the real driver.")
    else:
        print(f"-> Difference is meaningful ({drop:+.3f}) — elevation IS contributing real signal "
              "to the model. Disclose this honestly: it could reflect genuine orographic "
              "effects (real meteorology) OR the model partly learning 'which location this "
              "is' rather than 'what the atmosphere is doing right now'. With events "
              "concentrated in specific villages, these two explanations are hard to fully "
              "tell apart from this dataset alone — say so if asked.")

    # --- Explicit seasonal multiplier, computed transparently from real data ---
    print(f"\n{'='*60}\nSEASONAL MULTIPLIER (explicit, not learned)\n{'='*60}")
    seasonal_multipliers = compute_seasonal_multipliers()

    combined_proba = np.clip(
        winner_proba * months.map(seasonal_multipliers).values, 0.0, 1.0
    )
    combined_auc = roc_auc_score(y, combined_proba)
    combined_threshold = report(
        f"COMBINED: {winner} (weather-only) x seasonal multiplier", y, combined_proba
    )
    print(
        f"\nSummary: weather-only {winner} alone = {candidates[winner][0]:.3f} ROC-AUC. "
        f"With the explicit seasonal multiplier on top = {combined_auc:.3f} ROC-AUC. "
        "This recovers most of the seasonal signal WITHOUT hiding it inside a black-box "
        "model — you can show judges the multiplier table directly."
    )

    # --- Fit the winning weather-only model on ALL data for deployment ---
    final_model = candidates[winner][2]()
    final_model.fit(X, y)

    if winner == "LogisticRegression":
        coefs = final_model.named_steps["logisticregression"].coef_[0]
        importances = pd.Series(coefs, index=FEATURE_COLS).sort_values(key=abs, ascending=False)
    elif winner == "Ensemble":
        # Ensemble has no single importances of its own — report its RandomForest
        # sub-model's importances as the interpretable stand-in for slides, and
        # say so explicitly (don't imply it's the ensemble's own attribution).
        importances = pd.Series(final_model.rf.feature_importances_, index=FEATURE_COLS).sort_values(ascending=False)
        print("\n(Feature importances below are from the Ensemble's RandomForest component, "
              "shown as an interpretable stand-in — the ensemble itself has no single "
              "importance vector since it's an average of three different model types.)")
    else:
        importances = pd.Series(final_model.feature_importances_, index=FEATURE_COLS).sort_values(ascending=False)

    print(f"\n=== {winner} feature importances (weather-only, demo slide material) ===")
    print(importances)

    joblib.dump(final_model, "models/cloudburst_risk_model.joblib")
    joblib.dump(
        {
            "threshold": float(combined_threshold),
            "model_type": winner,
            "feature_cols": FEATURE_COLS,  # exact order the model expects — inference must match this
            "seasonal_multipliers": seasonal_multipliers,
            "usage": "final_risk = clip(model.predict_proba(X[feature_cols])[:,1] * seasonal_multipliers[month], 0, 1)",
        },
        "models/decision_threshold.joblib",
    )
    with open("models/seasonal_multipliers.json", "w") as f:
        json.dump(seasonal_multipliers, f, indent=2)
    importances.to_csv("models/feature_importances.csv")

    print(f"\nSaved weather-only {winner} model to models/cloudburst_risk_model.joblib")
    print(f"Saved threshold + seasonal multipliers to models/decision_threshold.joblib")
    print(f"Saved human-readable multiplier table to models/seasonal_multipliers.json")
    print(
        "\nNOTE: the saved model is fit on ALL rows (for deployment) and takes WEATHER "
        "FEATURES ONLY as input. Your backend must apply the seasonal multiplier "
        "afterward using the current month — see the 'usage' field saved in "
        "decision_threshold.joblib. The confusion matrices above come from grouped, "
        "cross-validated out-of-fold predictions — the honest way to report "
        "performance given only ~29 underlying events."
    )


if __name__ == "__main__":
    main()
