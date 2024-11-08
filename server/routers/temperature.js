import express from 'express';
import { getTemperatureData,
  getAvgTemperatureDataInRange } from '../controllers/temperatureController.mjs';

const router = express.Router();

// GET /api/temp/:country/:year?
router.get('/:country/:year?', getTemperatureData);

// GET /api/temp/range/:country/:startYear/:endYear
router.get('/:country/:startYear/:endYear', getAvgTemperatureDataInRange);

export default router;