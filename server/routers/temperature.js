import express from 'express';
import { getTemperatureData } from '../controllers/temperatureController.mjs';

const router = express.Router();

// GET /api/temp/:country?/:year?
router.get('/:country?/:year?', getTemperatureData);

export default router;