import axios from 'axios';

const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || 'http://localhost:5001/predict';

/**
 * Predict cloudburst risk for a district via the Flask ML model service.
 * 
 * @param {object} districtConfig - { id, name, lat, lon, elevation_m }
 * @param {Array} hourlyReadings - 24h readings array
 * @returns {Promise<object>} - Model prediction result
 */
export async function predictDistrictRisk(districtConfig, hourlyReadings) {
  const currentTime = new Date().toISOString();

  const payload = {
    lat: parseFloat(districtConfig.lat),
    lon: parseFloat(districtConfig.lon),
    elevation_m: parseFloat(districtConfig.elevation_m),
    current_time: currentTime,
    hourly_readings: hourlyReadings
  };

  try {
    const response = await axios.post(MODEL_SERVICE_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });

    if (response.data && response.data.risk_score !== undefined) {
      return response.data;
    } else {
      throw new Error(response.data?.error || 'Unknown response from model service');
    }
  } catch (err) {
    console.error(`[ModelService] Prediction error for district ${districtConfig.name}:`, err.response?.data || err.message);
    throw err;
  }
}
