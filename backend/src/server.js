import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initDatabase, getLatestDistrictsData, getDistrictRiskDetail } from './services/storageService.js';
import { startScheduler, runPredictionJob } from './services/scheduler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'meghdrishti-backend',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/districts
 * Returns array of all 8 HP districts with coordinates, elevation, latest risk score, risk level, and Gemini explanation.
 */
app.get('/api/districts', async (req, res) => {
  try {
    const districts = await getLatestDistrictsData();
    res.json(districts);
  } catch (err) {
    console.error('[Server] Error fetching districts:', err);
    res.status(500).json({ error: 'Failed to fetch districts data', details: err.message });
  }
});

/**
 * GET /api/districts/:id/risk
 * Returns full detail for one district: current reading, 24h history of scores, features used, and Gemini explanation.
 */
app.get('/api/districts/:id/risk', async (req, res) => {
  const { id } = req.params;
  try {
    const districtDetail = await getDistrictRiskDetail(id);
    if (!districtDetail) {
      return res.status(404).json({ error: `District with id '${id}' not found.` });
    }
    res.json(districtDetail);
  } catch (err) {
    console.error(`[Server] Error fetching risk detail for ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch district risk details', details: err.message });
  }
});

/**
 * POST /api/refresh
 * Manually triggers a real-time refresh cycle across all districts.
 */
app.post('/api/refresh', async (req, res) => {
  try {
    runPredictionJob().catch(e => console.error('[Server] Refresh job error:', e));
    res.json({ message: 'Prediction refresh triggered successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger refresh', details: err.message });
  }
});

// Start Express server and initialize database & scheduler
async function bootstrap() {
  console.log('[Server] Initializing MeghDrishti backend service...');
  
  // 1. Listen on port immediately
  app.listen(PORT, () => {
    console.log(`[Server] 🏔️ MeghDrishti backend listening on http://localhost:${PORT}`);
    console.log(`[Server] Endpoints:`);
    console.log(`  - GET  http://localhost:${PORT}/api/districts`);
    console.log(`  - GET  http://localhost:${PORT}/api/districts/:id/risk`);
    console.log(`  - POST http://localhost:${PORT}/api/refresh`);
    console.log(`  - GET  http://localhost:${PORT}/api/health`);
  });

  // 2. Connect to MongoDB asynchronously in background
  initDatabase().then(() => {
    // 3. Start 15-minute cron scheduler + immediate startup job
    startScheduler();
  }).catch(err => {
    console.warn('[Server] DB init error, starting scheduler with memory store:', err.message);
    startScheduler();
  });
}

bootstrap();
