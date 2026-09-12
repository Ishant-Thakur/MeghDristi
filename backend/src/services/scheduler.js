import cron from 'node-cron';
import { HP_DISTRICTS } from '../config/districts.js';
import { fetchDistrictWeather } from './weatherService.js';
import { predictDistrictRisk } from './modelService.js';
import { generateGeminiExplanation } from './geminiService.js';
import { saveRiskRecord } from './storageService.js';

let isJobRunning = false;

/**
 * Execute the weather fetch -> ML prediction -> Gemini narrative -> MongoDB storage pipeline
 * for all configured districts.
 */
export async function runPredictionJob() {
  if (isJobRunning) {
    console.log('[Scheduler] Prediction job is already in progress. Skipping duplicate tick.');
    return;
  }

  isJobRunning = true;
  const startTime = Date.now();
  console.log(`[Scheduler] 🚀 Starting automated cloudburst risk pipeline for ${HP_DISTRICTS.length} districts...`);

  let successCount = 0;
  let errorCount = 0;

  for (const district of HP_DISTRICTS) {
    try {
      console.log(`[Scheduler] Processing district: ${district.name} (${district.code})...`);

      // 1. Fetch 24h hourly weather from Open-Meteo
      const hourlyReadings = await fetchDistrictWeather(district.lat, district.lon);

      // 2. Call Flask ML prediction model
      const prediction = await predictDistrictRisk(district, hourlyReadings);

      // 3. Generate Gemini explanation
      const geminiExplanation = await generateGeminiExplanation(district, prediction);

      // 4. Store in MongoDB
      const record = {
        district: district.name,
        districtId: district.id,
        coordinates: { lat: district.lat, lon: district.lon },
        elevation_m: district.elevation_m,
        timestamp: new Date(prediction.as_of || Date.now()),
        rawWeather: hourlyReadings,
        riskScore: prediction.risk_score,
        riskLevel: prediction.risk_level,
        mlProbability: prediction.ml_probability,
        seasonalMultiplier: prediction.seasonal_multiplier,
        featuresUsed: prediction.features_used,
        geminiExplanation: geminiExplanation
      };

      await saveRiskRecord(record);
      successCount++;
      console.log(`[Scheduler] ✅ ${district.name} updated: Risk ${(prediction.risk_score * 100).toFixed(1)}% [${prediction.risk_level.toUpperCase()}]`);
    } catch (err) {
      errorCount++;
      console.error(`[Scheduler] ❌ Error processing district ${district.name}:`, err.message);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Scheduler] 🏁 Pipeline finished in ${durationSec}s. Success: ${successCount}, Errors: ${errorCount}`);
  isJobRunning = false;
}

/**
 * Start the 15-minute cron schedule and trigger an immediate run on boot.
 */
export function startScheduler() {
  // Cron schedule: every 15 minutes (0, 15, 30, 45)
  cron.schedule('*/15 * * * *', () => {
    console.log('[Scheduler] Cron tick triggered (15 min interval).');
    runPredictionJob().catch(err => console.error('[Scheduler] Cron job error:', err));
  });

  console.log('[Scheduler] Node-cron initialized (every 15 minutes).');

  // Immediate first run on boot (don't wait 15 min)
  setTimeout(() => {
    console.log('[Scheduler] Executing immediate initial prediction job on startup...');
    runPredictionJob().catch(err => console.error('[Scheduler] Initial run error:', err));
  }, 1000);
}
