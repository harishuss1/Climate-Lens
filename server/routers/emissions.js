import express from 'express';
import { getEmissionData } from '../controllers/emissionsController.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/emissions/{country}/{year}:
 *   get:
 *     summary: Get CO2 emissions data for a specified country and optional year.
 *     description: If the country is a 4-digit number, it redirects to another route.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Country name (or 4-digit numeric code).
 *       - in: path
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2008
 *         description: "Optional year to query for (valid range: 2008-2013)."
 *     responses:
 *       200:
 *         description: Emission data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Year:
 *                     type: string
 *                     description: The year of the data.
 *                   Country:
 *                     type: string
 *                     description: The country name.
 *                   Total:
 *                     type: integer
 *                     description: Total CO2 emissions in metric tons.
 *                   Solid Fuel:
 *                     type: integer
 *                     description: CO2 emissions from solid fuel.
 *                   Liquid Fuel:
 *                     type: integer
 *                     description: CO2 emissions from liquid fuel.
 *                   Gas Fuel:
 *                     type: integer
 *                     description: CO2 emissions from gas fuel.
 *                   Cement:
 *                     type: integer
 *                     description: CO2 emissions from cement production.
 *                   Gas Flaring:
 *                     type: string
 *                     description: CO2 emissions from gas flaring (if available).
 *                   Per Capita:
 *                     type: number
 *                     format: float
 *                     description: CO2 emissions per capita.
 *                   Bunker fuels (Not in Total):
 *                     type: integer
 *                     description: CO2 emissions from bunker fuels not included in total emissions.
 *       400:
 *         description: Invalid country or year parameter.
 *       500:
 *         description: Internal server error.
 */

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
 * @swagger
 * /api/emissions/{year}/{country}:
 *   get:
 *     summary: Get CO2 emissions data for a specified year and optional country.
 *     description: Fetches CO2 emissions data for a specific year and optional country.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *           example: 2008
 *         description: "The year to query for (valid range: 2008-2013)."
 *       - in: path
 *         name: country
 *         required: false
 *         schema:
 *           type: string
 *           example: 'Canada'
 *         description: The country to query for (optional).
 *     responses:
 *       200:
 *         description: Emission data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Year:
 *                     type: string
 *                     description: The year of the data.
 *                   Country:
 *                     type: string
 *                     description: The country name.
 *                   Total:
 *                     type: integer
 *                     description: Total CO2 emissions in metric tons.
 *                   Solid Fuel:
 *                     type: integer
 *                     description: CO2 emissions from solid fuel.
 *                   Liquid Fuel:
 *                     type: integer
 *                     description: CO2 emissions from liquid fuel.
 *                   Gas Fuel:
 *                     type: integer
 *                     description: CO2 emissions from gas fuel.
 *                   Cement:
 *                     type: integer
 *                     description: CO2 emissions from cement production.
 *                   Gas Flaring:
 *                     type: string
 *                     description: CO2 emissions from gas flaring (if available).
 *                   Per Capita:
 *                     type: number
 *                     format: float
 *                     description: CO2 emissions per capita.
 *                   Bunker fuels (Not in Total):
 *                     type: integer
 *                     description: CO2 emissions from bunker fuels not included in total emissions.
 *       400:
 *         description: Invalid year or country parameter.
 *       500:
 *         description: Internal server error.
 */

/**
 * Get emissions data from the CO2Emissions collection.
 * @param {Number} year -  year to query for
 * @param {String} country? - optional country to query for
 */
router.get('/:year/:country?', getEmissionData);




/**
 * @swagger
 * /api/emissions:
 *   get:
 *     summary: Get all CO2 emissions data.
 *     description: Retrieve all available CO2 emissions data from the database.
 *     responses:
 *       200:
 *         description: Emission data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Year:
 *                     type: string
 *                     description: The year of the data.
 *                   Country:
 *                     type: string
 *                     description: The country name.
 *                   Total:
 *                     type: integer
 *                     description: Total CO2 emissions in metric tons.
 *                   Solid Fuel:
 *                     type: integer
 *                     description: CO2 emissions from solid fuel.
 *                   Liquid Fuel:
 *                     type: integer
 *                     description: CO2 emissions from liquid fuel.
 *                   Gas Fuel:
 *                     type: integer
 *                     description: CO2 emissions from gas fuel.
 *                   Cement:
 *                     type: integer
 *                     description: CO2 emissions from cement production.
 *                   Gas Flaring:
 *                     type: string
 *                     description: CO2 emissions from gas flaring (if available).
 *                   Per Capita:
 *                     type: number
 *                     format: float
 *                     description: CO2 emissions per capita.
 *                   Bunker fuels (Not in Total):
 *                     type: integer
 *                     description: CO2 emissions from bunker fuels not included in total emissions.
 *       500:
 *         description: Internal server error.
 */

/**
 * Get all emissions data from the CO2Emissions collection.
 */
router.get('/', getEmissionData);

export default router;