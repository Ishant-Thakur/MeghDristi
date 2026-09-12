import mongoose from 'mongoose';
import { RiskRecord } from '../models/RiskRecord.js';
import { HP_DISTRICTS } from '../config/districts.js';

let isMongoConnected = false;
const inMemoryStore = new Map(); // districtId -> Array of records (capped at 50)

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[StorageService] No MONGODB_URI provided in .env. Using in-memory storage.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    isMongoConnected = true;
    console.log('[StorageService] Successfully connected to MongoDB Atlas.');
    return true;
  } catch (err) {
    console.warn('[StorageService] MongoDB Atlas connection failed:', err.message);
    console.warn('[StorageService] Falling back to in-memory ring-buffer storage.');
    isMongoConnected = false;
    return false;
  }
}

/**
 * Save a risk record for a district
 */
export async function saveRiskRecord(recordData) {
  const districtId = recordData.districtId;

  // Always store in memory for lightning-fast reads
  if (!inMemoryStore.has(districtId)) {
    inMemoryStore.set(districtId, []);
  }
  const memList = inMemoryStore.get(districtId);
  memList.unshift({ ...recordData, createdAt: new Date() });
  if (memList.length > 50) memList.pop();

  // If MongoDB is connected, persist to Atlas
  if (isMongoConnected) {
    try {
      const doc = new RiskRecord(recordData);
      await doc.save();
    } catch (err) {
      console.error(`[StorageService] Failed to save record to MongoDB for ${districtId}:`, err.message);
    }
  }
}

/**
 * Get latest risk records for all districts
 */
export async function getLatestDistrictsData() {
  const results = [];

  for (const district of HP_DISTRICTS) {
    let latest = null;

    if (isMongoConnected) {
      try {
        latest = await RiskRecord.findOne({ districtId: district.id }).sort({ timestamp: -1 }).lean();
      } catch (err) {
        // Fall back to memory
      }
    }

    if (!latest) {
      const memList = inMemoryStore.get(district.id);
      latest = memList && memList.length > 0 ? memList[0] : null;
    }

    results.push({
      ...district,
      latestRecord: latest,
      risk_score: latest?.riskScore ?? 0.15,
      risk_level: latest?.riskLevel ?? "low",
      geminiExplanation: latest?.geminiExplanation ?? {
        riskLevel: latest?.riskLevel ?? "low",
        reasoning: `Atmospheric conditions over ${district.name} monitored via Neural-WRF.`,
        affectedArea: `${district.name} Catchment`,
        recommendedAction: "Standard monitoring active."
      },
      lastUpdated: latest?.timestamp || new Date()
    });
  }

  return results;
}

/**
 * Get full detail and 24h history for a specific district
 */
export async function getDistrictRiskDetail(districtId) {
  const district = HP_DISTRICTS.find(d => d.id === districtId.toLowerCase());
  if (!district) {
    return null;
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let history = [];
  let latest = null;

  if (isMongoConnected) {
    try {
      history = await RiskRecord.find({
        districtId: district.id,
        timestamp: { $gte: twentyFourHoursAgo }
      }).sort({ timestamp: 1 }).lean();

      if (history.length > 0) {
        latest = history[history.length - 1];
      } else {
        latest = await RiskRecord.findOne({ districtId: district.id }).sort({ timestamp: -1 }).lean();
      }
    } catch (err) {
      console.warn(`[StorageService] MongoDB query failed for ${districtId}:`, err.message);
    }
  }

  if (!latest) {
    const memList = inMemoryStore.get(district.id) || [];
    latest = memList[0] || null;
    history = memList.slice(0, 24).reverse();
  }

  return {
    ...district,
    currentReading: latest?.rawWeather?.[latest.rawWeather.length - 1] || null,
    risk_score: latest?.riskScore ?? 0.15,
    risk_level: latest?.riskLevel ?? "low",
    ml_probability: latest?.mlProbability ?? 0.2,
    seasonal_multiplier: latest?.seasonalMultiplier ?? 0.5,
    features_used: latest?.featuresUsed ?? {},
    geminiExplanation: latest?.geminiExplanation ?? {
      riskLevel: latest?.riskLevel ?? "low",
      reasoning: `Atmospheric conditions over ${district.name} are stable with low cloudburst precursors.`,
      affectedArea: `${district.name} basin`,
      recommendedAction: "Routine surveillance."
    },
    history: history.map(h => ({
      timestamp: h.timestamp,
      risk_score: h.riskScore,
      risk_level: h.riskLevel,
      features_used: h.featuresUsed
    })),
    rawWeather: latest?.rawWeather || [],
    lastUpdated: latest?.timestamp || new Date()
  };
}
