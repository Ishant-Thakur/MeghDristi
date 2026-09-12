import axios from 'axios';

/**
 * Fetch the last 24 hours of hourly weather data from Open-Meteo
 * and transform into the exact hourly_readings schema expected by the Flask model.
 * 
 * Target Schema:
 * [{
 *   timestamp: "2026-09-12T05:00:00Z",
 *   rh_pct: 88.5,
 *   pressure_hpa: 980.2,
 *   precip_mm: 12.4,
 *   wind_gust_ms: 14.2,
 *   cloud_cover_pct: 95.0
 * }, ...]
 */
export async function fetchDistrictWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,surface_pressure,precipitation,cloud_cover,wind_gusts_10m&past_hours=24`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const hourly = response.data?.hourly;

    if (!hourly || !hourly.time || !Array.isArray(hourly.time)) {
      throw new Error(`Invalid Open-Meteo response format for coords [${lat}, ${lon}]`);
    }

    const readings = [];
    const count = hourly.time.length;

    for (let i = 0; i < count; i++) {
      const timeStr = hourly.time[i];
      const rh = parseFloat(hourly.relative_humidity_2m?.[i] ?? 70.0);
      const pressure = parseFloat(hourly.surface_pressure?.[i] ?? 1005.0);
      const precip = parseFloat(hourly.precipitation?.[i] ?? 0.0);
      // Open-Meteo returns wind_gusts_10m in km/h by default; convert to m/s
      const windGustKmh = parseFloat(hourly.wind_gusts_10m?.[i] ?? 15.0);
      const windGustMs = parseFloat((windGustKmh / 3.6).toFixed(2));
      const cloudCover = parseFloat(hourly.cloud_cover?.[i] ?? 50.0);

      readings.push({
        timestamp: new Date(timeStr).toISOString(),
        rh_pct: isNaN(rh) ? 70.0 : rh,
        pressure_hpa: isNaN(pressure) ? 1005.0 : pressure,
        precip_mm: isNaN(precip) ? 0.0 : precip,
        wind_gust_ms: isNaN(windGustMs) ? 4.0 : windGustMs,
        cloud_cover_pct: isNaN(cloudCover) ? 50.0 : cloudCover
      });
    }

    // Sort chronologically
    readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return readings;
  } catch (err) {
    console.error(`[WeatherService] Error fetching weather for [${lat}, ${lon}]:`, err.message);
    throw err;
  }
}
