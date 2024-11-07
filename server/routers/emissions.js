import express from 'express';
import { getEmissionData } from '../controllers/emissionsController.mjs';

const router = express.Router();

// GET /api/temp/:country/:year?
/**
 * Get emissions data from the CO2Emissions collection.
 * if county is a Number and four characters long, will get redirected to the next route instead.
 * @param {String} country - country to query for
 * @param {Number} year? - optional year to query for
 */
router.get('/:country/:year?', (req, res, next) => {
  if(!isNaN(req.params.country) && req.params.country.length === 4){
    console.log('redirect');
    next();
  } else {
    getEmissionData(req, res);
  }
});

/**
 * Get emissions data from the CO2Emissions collection.
 * @param {Number} year -  year to query for
 * @param {String} country? - optional country to query for
 */
router.get('/:year/:country?', getEmissionData);

/**
 * Get all emissions data from the CO2Emissions collection.
 */
router.get('/', getEmissionData);

export default router;