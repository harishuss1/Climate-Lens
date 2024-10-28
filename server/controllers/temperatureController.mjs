import { db } from '../db/db.js';

/**
 * Get temperature data from the CountryAverageTemperature collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
