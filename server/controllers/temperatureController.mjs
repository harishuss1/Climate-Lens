import { db } from '../db/db.js';

/**
 * Get temperature data from the CountryAverageTemperature collection.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.country - Country name (case-insensitive)
 * @param {string} [req.params.year] - Year (optional; valid range: 2008-2013)
 * @param {Object} res - Express response object
 * @returns Responds with JSON data or an error message
 * 
 * @description
 * This function handles a GET request to retrieve temperature data for a specified country
 * and an optional year. It validates the input parameters and switches the database 
 * collection to 'CountryAverageTemperature' before executing the query. If an invalid 
 * country or year is provided, it returns a 400 error. If the collection switch or 
 * database read fails, it returns a 500 error.
 */
export const getTemperatureData = async (req, res) => {
  const { country, year } = req.params;

  try {
    await db.changeCollection('CountryAverageTemperature');
  } catch (error) {
    console.error('Error switching collection:', error);
    return res.status(500).json({ error: 'Failed to switch collection' });
  }

  let query = {
    Country: { $regex: new RegExp(`^${country}$`, 'i') } 
  };

  if (year) {
    const validYears = ['2008', '2009', '2010', '2011', '2012', '2013'];
    if (!validYears.includes(year)) {
      return res.status(400).json({ error: 'Enter a valid year (2008-2013)' });
    }

    query.dt = new RegExp(`^${year}`);
  }

  try {
    const tempData = await db.readFiltered(query);

    if (!tempData || tempData.length === 0) {
      return res.status(400).json({ error: 'Enter a valid country' });
    }

    res.json(tempData);
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    res.status(500).json({ error: 'Failed to fetch temperature data' });
  }
};
