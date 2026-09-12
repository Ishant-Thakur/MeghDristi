import mongoose from 'mongoose';

const RiskRecordSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
    index: true
  },
  districtId: {
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  elevation_m: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  rawWeather: {
    type: Array,
    default: []
  },
  riskScore: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    required: true
  },
  mlProbability: {
    type: Number
  },
  seasonalMultiplier: {
    type: Number
  },
  featuresUsed: {
    type: Object,
    default: {}
  },
  geminiExplanation: {
    riskLevel: String,
    reasoning: String,
    affectedArea: String,
    recommendedAction: String
  }
}, {
  timestamps: true
});

// Index for efficient 24h history querying
RiskRecordSchema.index({ districtId: 1, timestamp: -1 });

export const RiskRecord = mongoose.model('RiskRecord', RiskRecordSchema);
