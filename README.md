# MeghDrishti 🌩️
**An AI-Powered Digital Twin of Himachal Pradesh for Climate Intelligence & Disaster Simulation**

Built for HackDays Solan 2026 (Enkindle Club) — Google Gemini API track
Team: **Retards**

---

## What is this?

MeghDrishti is an interactive Digital Twin of Himachal Pradesh that unifies live weather, terrain, and historical climate data into one explorable environment. Our first working use case on top of that twin is **cloudburst risk analysis** — a machine learning model estimates risk per district in real time, and the Gemini API turns that structured output into a plain-language explanation of *why* a region is at risk.

We are not claiming to replace India's existing weather infrastructure (IMD, ISRO, NDMA). MeghDrishti is an interactive layer on top of open data that makes environmental conditions explorable rather than just reported.

---

## Architecture

```
Open-Meteo (live weather) ──┐
NASA POWER (historical)  ───┤
GADM (district boundaries) ─┘
             │
             ▼
   Node.js + Express backend  ──cron every 15 min──▶  Python/Flask ML service
             │                                              │
             │◀─────────────── risk_score, features_used ───┘
             ▼
   Gemini API (gemini-2.5-flash)
   → plain-language risk explanation (structured JSON output)
             │
             ▼
      MongoDB (stores weather snapshots, risk scores, explanations)
             │
             ▼
   React (Vite) + Leaflet frontend — Digital Twin dashboard
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React-Leaflet, OpenTopoMap tiles, Recharts, TanStack Query |
| Backend | Node.js, Express, MongoDB (Atlas), node-cron |
| ML model | Python, scikit-learn, XGBoost (ensemble: RandomForest + Logistic Regression + XGBoost) |
| ML serving | Flask |
| Generative AI | Google Gemini API (`gemini-2.5-flash`), structured JSON output |
| Data sources | Open-Meteo (live + historical weather), NASA POWER (historical training data), GADM/OpenStreetMap (district geodata) |
| Deployment | Vercel (frontend), Render/Railway (backend + ML service) |

---

## Project structure

```
meghdrishti/
├── frontend/            # React + Vite dashboard and landing page
├── backend/             # Express API + cron job + Gemini integration
├── inference/           # Flask ML inference service
│   ├── app.py
│   └── risk_model.py
├── models/              # Trained model artifacts (.joblib)
├── scripts/             # Training + feature engineering scripts
└── README.md
```

---

## Running it locally

### 1. ML inference service
```bash
cd inference
pip install -r requirements.txt
python app.py
# runs on http://localhost:5001
```
Check it's alive: `curl http://localhost:5001/health`

### 2. Backend
```bash
cd backend
npm install
# create a .env with:
#   MONGODB_URI=...
#   GEMINI_API_KEY=...
#   MODEL_SERVICE_URL=http://localhost:5001
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## API reference

**ML inference service** — `POST http://localhost:5001/predict`
```json
{
  "hourly_readings": [{"timestamp": "...", "rh_pct": 82, "pressure_hpa": 945, "precip_mm": 4.2, "wind_gust_ms": 12, "cloud_cover_pct": 90}],
  "current_time": "2026-09-12T14:00:00",
  "lat": 32.15, "lon": 77.15, "elevation_m": 1800
}
```
Returns `risk_score` (0–1), `risk_level`, `ml_probability`, `seasonal_multiplier`, and `features_used`.

**Backend API**
- `GET /api/districts` — all monitored districts with latest risk + explanation
- `GET /api/districts/:id/risk` — full detail + 24h risk history for one district

---

## Model limitations — read before citing accuracy numbers

The cloudburst risk model is trained on **40 documented HP cloudburst events (2019–2025)** plus ~114 non-event days, with a cross-validated ROC-AUC of **~0.69–0.71**. This is real signal above random guessing, but with this little labeled data for a rare, highly localized event, it should be presented as a **validated proof-of-concept methodology**, not a production-grade early-warning system. Do not report inflated accuracy figures in the pitch or docs — the honest numbers are the credible ones.

---

## Data sources & references

- [Google Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [NASA POWER API](https://power.larc.nasa.gov/docs/services/api/)
- [GADM administrative boundaries](https://gadm.org/download_country.html)
- Kushwaha & Rathi, "Cloudburst prediction in the Indian Himalaya using artificial neural network," *Natural Hazards*, 2025
- Bhan, Paul & Kharbanda, "Cloud bursts in Himachal Pradesh," *Mausam* 55(4), 2004
- IMD nowcasting/modernization materials (Doppler radar network, MHEW-DSS, SACHET)
- [OpenTopoMap](https://opentopomap.org/) (map tiles, CC-BY-SA)

---

## Roadmap
- Landslide risk layer (terrain + rainfall interaction)
- Flood simulation (rainfall → runoff modeling)
- Historical climate comparison view
- Expand Digital Twin coverage beyond Himachal Pradesh

---

## License
Add your chosen license here (MIT recommended for hackathon projects).

## Team
**Retards** — HackDays Solan 2026, JUIT Waknaghat