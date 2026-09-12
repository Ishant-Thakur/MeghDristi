"""
Live inference module for the cloudburst risk model.

Loads the trained weather-only model + seasonal multiplier bundle and
turns a window of recent hourly weather readings into a single risk
score. This is what your Node/Express backend calls (via the Flask
wrapper in app.py) to get a live number for the digital-twin map.

IMPORTANT: the feature computation here is copy-consistent with
03_feature_engineering.py's engineer_snapshot() logic — same trailing-
window deltas, same handling of missing columns. If you ever change
the feature engineering for training, mirror the change here too, or
the live model will get different-shaped features than it was trained
on and its predictions will be meaningless.
"""

import datetime as dt
import os
import sys

import joblib
import numpy as np
import pandas as pd

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_SCRIPTS_DIR = os.path.join(_THIS_DIR, "..", "scripts")
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)

# Required even though not directly referenced below: if the saved model is
# an EnsembleModel, joblib.load() needs this module importable to unpickle
# it. Do NOT remove this import even if your linter flags it as unused.
import model_classes  # noqa: F401

MODEL_PATH = os.path.join(_THIS_DIR, "..", "models", "cloudburst_risk_model.joblib")
BUNDLE_PATH = os.path.join(_THIS_DIR, "..", "models", "decision_threshold.joblib")

MIN_READINGS_FOR_SNAPSHOT = 4  # matches 03_feature_engineering.py — below this, features are unreliable

# Loaded once at import time — reused across requests, not reloaded per call.
_model = None
_bundle = None


def _load():
    global _model, _bundle
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"No trained model at {MODEL_PATH}. Run scripts/01-04 first to produce it."
            )
        _model = joblib.load(MODEL_PATH)
        _bundle = joblib.load(BUNDLE_PATH)
    return _model, _bundle


def _extract_series(window: pd.DataFrame):
    """Same logic as 03_feature_engineering.py's _extract_series — keep in sync."""
    rh = window["rh_pct"].dropna() if "rh_pct" in window else pd.Series(dtype=float)
    pressure = window["pressure_kpa"].dropna() if "pressure_kpa" in window else pd.Series(dtype=float)
    if pressure.empty and "pressure_hpa" in window:
        pressure = window["pressure_hpa"].dropna() / 10.0
    precip = window["precip_mm"].dropna() if "precip_mm" in window else pd.Series(dtype=float)
    wind = window["wind_ms"].dropna() if "wind_ms" in window else pd.Series(dtype=float)
    if wind.empty and "wind_gust_ms" in window:
        wind = window["wind_gust_ms"].dropna()
    cloud = window["cloud_cover_pct"].dropna() if "cloud_cover_pct" in window else pd.Series(dtype=float)
    return rh, pressure, precip, wind, cloud


def _delta_over_window(series, hours=6):
    """Same logic as 03_feature_engineering.py's _delta_over_window — keep in sync."""
    if len(series) < hours + 1:
        return series.iloc[-1] - series.iloc[0] if len(series) > 1 else 0.0
    return series.iloc[-1] - series.iloc[-(hours + 1)]


def _engineer_live_features(window: pd.DataFrame, elevation_m: float) -> dict:
    """Weather-only feature set — mirrors engineer_snapshot() minus month/day_of_year."""
    rh, pressure, precip, wind, cloud = _extract_series(window)

    humidity_spike_3h = _delta_over_window(rh, 3) if len(rh) else None
    humidity_spike_6h = _delta_over_window(rh, 6) if len(rh) else None
    pressure_drop_3h = -_delta_over_window(pressure, 3) if len(pressure) else None
    pressure_drop_6h = -_delta_over_window(pressure, 6) if len(pressure) else None

    if len(precip) >= 6:
        precip_acceleration = precip.iloc[-3:].sum() - precip.iloc[-6:-3].sum()
    else:
        precip_acceleration = None

    if humidity_spike_6h is not None and pressure_drop_6h is not None:
        humidity_pressure_interaction = humidity_spike_6h * pressure_drop_6h
    else:
        humidity_pressure_interaction = None

    return {
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
        "elevation_m": elevation_m,
    }


def risk_level_from_score(score: float, threshold: float) -> str:
    """
    Simple 3-tier band around the tuned decision threshold. This is a
    straightforward heuristic (low < half-threshold <= moderate < threshold
    <= high), NOT a separately calibrated/validated tier scheme — say so
    if asked how the bands were chosen.
    """
    if score >= threshold:
        return "high"
    elif score >= threshold * 0.5:
        return "moderate"
    return "low"


def compute_risk(hourly_readings: list, current_time, lat: float, lon: float, elevation_m: float) -> dict:
    """
    Main entry point.

    hourly_readings: list of dicts, each with at minimum a "timestamp" key
      (ISO string or datetime) and whichever of these are available:
      rh_pct, pressure_kpa (or pressure_hpa), precip_mm, wind_ms (or
      wind_gust_ms), cloud_cover_pct. Should cover roughly the trailing
      9-24 hours for the spike/drop features to be meaningful — fewer
      than MIN_READINGS_FOR_SNAPSHOT readings will raise an error.
    current_time: the timestamp to score risk AS OF (usually "now") —
      ISO string or datetime. Only readings at or before this time are
      used (matches the causal windowing used in training).
    lat, lon: informational only, included in the response for logging/map
      display; not used by the weather-only model itself.
    elevation_m: elevation at this location in meters. Static per
      district/village — look it up once and cache it in your backend
      rather than calling an elevation API on every request.

    Returns a dict with risk_score (0-1), risk_level (low/moderate/high),
    ml_probability (pre-seasonal-multiplier), seasonal_multiplier, and the
    engineered feature values used (useful for the Gemini narrative layer
    to explain WHY the score is what it is).
    """
    model, bundle = _load()
    feature_cols = bundle["feature_cols"]
    threshold = bundle["threshold"]
    seasonal_multipliers = bundle["seasonal_multipliers"]

    if isinstance(current_time, str):
        current_time = pd.Timestamp(current_time)
    else:
        current_time = pd.Timestamp(current_time)

    df = pd.DataFrame(hourly_readings)
    if "timestamp" not in df.columns:
        raise ValueError("Each item in hourly_readings needs a 'timestamp' field.")
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    window = df[df["timestamp"] <= current_time].sort_values("timestamp")

    if len(window) < MIN_READINGS_FOR_SNAPSHOT:
        raise ValueError(
            f"Only {len(window)} readings at/before current_time — need at least "
            f"{MIN_READINGS_FOR_SNAPSHOT} for a reliable risk score. Send more history."
        )

    features = _engineer_live_features(window, elevation_m)
    X = pd.DataFrame([features])[feature_cols]

    if X.isna().any(axis=None):
        missing_cols = X.columns[X.isna().any()].tolist()
        raise ValueError(
            f"Missing weather variables needed for these features: {missing_cols}. "
            "Check that hourly_readings includes rh_pct, pressure_kpa/pressure_hpa, "
            "precip_mm, wind_ms/wind_gust_ms, and cloud_cover_pct."
        )

    ml_probability = float(model.predict_proba(X)[:, 1][0])

    month = current_time.month
    multiplier = seasonal_multipliers.get(month, 0.5)
    risk_score = float(np.clip(ml_probability * multiplier, 0.0, 1.0))

    return {
        "risk_score": round(risk_score, 4),
        "risk_level": risk_level_from_score(risk_score, threshold),
        "ml_probability": round(ml_probability, 4),
        "seasonal_multiplier": multiplier,
        "model_type": bundle["model_type"],
        "decision_threshold": round(threshold, 4),
        "as_of": current_time.isoformat(),
        "lat": lat,
        "lon": lon,
        "features_used": {k: (round(v, 3) if isinstance(v, (int, float)) else v) for k, v in features.items()},
        "readings_used": len(window),
    }
