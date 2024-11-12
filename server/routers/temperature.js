import express from 'express';
import { getTemperatureData,
  getAvgTemperatureDataInRange } from '../controllers/temperatureController.mjs';

const router = express.Router();


/**
 * @swagger
 * /api/temp/{country}/{year}:
 *   get:
 *     summary: Get temperature data for a specified country and optional year.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the country (case-insensitive).
 *       - in: path
 *         name: year
 *         required: false
 *         schema:
 *           type: string
 *           example: 2008
 *         description: "Year for the temperature data (valid range: 2008-2013)."
 *     responses:
 *       200:
 *         description: Temperature data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dt:
 *                     type: string
 *                     description: Date in YYYY-MM-DD format.
 *                   AverageTemperature:
 *                     type: number
 *                     format: float
 *                     description: The average temperature.
 *                   Country:
 *                     type: string
 *                     description: The country name.
 *       400:
 *         description: Invalid country or year parameter.
 *       500:
 *         description: Internal server error.
 */

// GET /api/temp/:country/:year?
router.get('/:country/:year?', getTemperatureData);


/**
 * @swagger
 * /api/temp/{country}/{startYear}/{endYear}:
 *   get:
 *     summary: Get average temperature data for a country within a specified range of years.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the country (case-insensitive).
 *       - in: path
 *         name: startYear
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2008
 *         description: "Start year of the range (valid range: 2008-2013)."
 *       - in: path
 *         name: endYear
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2013
 *         description: "End year of the range (valid range: 2008-2013)."
 *     responses:
 *       200:
 *         description: Average temperature data retrieved successfully for the specified range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                     description: Year.
 *                   avgTemperature:
 *                     type: number
 *                     format: float
 *                     description: The average temperature for that year.
 *       400:
 *         description: Invalid year range parameter.
 *       404:
 *         description: No data found for the given country and year range.
 *       500:
 *         description: Internal server error.
 */

// GET /api/temp/range/:country/:startYear/:endYear
router.get('/:country/:startYear/:endYear', getAvgTemperatureDataInRange);

export default router;