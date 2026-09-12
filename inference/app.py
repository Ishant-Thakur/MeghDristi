"""
Minimal Flask API around risk_model.compute_risk() — this is what your
Node/Express backend calls over HTTP to get a live cloudburst risk score.

Run:
    pip install flask
    python app.py
Then it's listening on http://localhost:5001

Example request from Node (or curl — see README.md for a full example):
    POST http://localhost:5001/predict
    {
      "hourly_readings": [ {"timestamp": "...", "rh_pct": ..., ...}, ... ],
      "current_time": "2025-07-17T14:00:00",
      "lat": 32.15, "lon": 77.15, "elevation_m": 1800
    }
"""

from flask import Flask, request, jsonify
from risk_model import compute_risk

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Request body must be JSON."}), 400

    required = ["hourly_readings", "current_time", "lat", "lon", "elevation_m"]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {missing}"}), 400

    try:
        result = compute_risk(
            hourly_readings=data["hourly_readings"],
            current_time=data["current_time"],
            lat=data["lat"],
            lon=data["lon"],
            elevation_m=data["elevation_m"],
        )
        return jsonify(result)
    except (ValueError, FileNotFoundError) as e:
        # expected/user-facing errors (bad input, missing model file)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # anything unexpected — still return JSON, not an HTML stack trace,
        # so the Node backend can handle it gracefully
        return jsonify({"error": f"Internal error: {e}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
