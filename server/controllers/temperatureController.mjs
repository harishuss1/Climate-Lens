import { db } from '../db/db.js';
import cache from 'memory-cache';

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
export async function getTemperatureData (req, res) {
  const { country, year } = req.params;

  //check cache
  const cacheKey = `${country}-${year || 'all'}`;
  const cachedData = cache.get(cacheKey);

  if(cachedData){
    return res.json(cachedData);
  }
  
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

    //cache the data
    cache.put(cacheKey, tempData);

    res.json(tempData);
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    res.status(500).json({ error: 'Failed to fetch temperature data' });
  }
};


/**
 * Get average temperature data for a country within a range of years.
 * 
 * @param {Object} req - Express request object
 * @param {string} req.params.country - Country name (case-insensitive)
 * @param {string} req.params.startYear - Start year of the range
 * @param {string} req.params.endYear - End year of the range
 * @param {Object} res - Express response object
 * @returns Responds with JSON data or an error message
 */
export async function getAvgTemperatureDataInRange (req, res) {
  const { country, startYear, endYear } = req.params;

  const validYears = ['2008', '2009', '2010', '2011', '2012', '2013'];
  if (!validYears.includes(startYear) || !validYears.includes(endYear)) {
    return res.status(400).json({ error: 'Enter a valid year range (2008-2013)' });
  }
  const cacheKey = `${country}-${startYear}-${endYear}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    await db.changeCollection('CountryAverageTemperature');
  } catch (error) {
    console.error('Error switching collection:', error);
    return res.status(500).json({ error: 'Failed to switch collection' });
  }

  const query = {
    Country: { $regex: new RegExp(`^${country}$`, 'i') },
    dt: { $gte: `${startYear}-01-01`, $lte: `${endYear}-12-31` }
  };

  try {
    const tempData = await db.readFiltered(query);

    if (!tempData || tempData.length === 0) {
      return res.status(404).json({ error: 'No data found for the given range and country' });
    }

    const avgTempByYear = tempData.reduce((acc, record) => {
      const year = record.dt.split('-')[0];
      if (!acc[year]) {
        acc[year] = { sum: 0, count: 0 };
      }
      acc[year].sum += record.AverageTemperature;
      acc[year].count += 1;
      return acc;
    }, {});

    const result = Object.keys(avgTempByYear).map(year => ({
      year,
      avgTemperature: avgTempByYear[year].sum / avgTempByYear[year].count
    }));

    // Cache the data
    cache.put(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    res.status(500).json({ error: 'Failed to fetch temperature data' });
  }
};

export async function getAllTemperatureSpecificYear  (req, res) {
  const year = req.params.year;

  const validYears = ['2008', '2009', '2010', '2011', '2012', '2013'];
  if (!validYears.includes(year)) {
    return res.status(400).json({ error: 'Enter a valid year (2008-2013)' });
  }

  //check cache
  const cachedData = cache.get(year);
  if(cachedData){
    return res.json(cachedData);
  }

  //query to select dt that starts with specified year
  const query = {
    'dt': new RegExp(`^${year}`)
  };

  try {
    await db.changeCollection('CountryAverageTemperature');
  } catch (error) {
    console.error('Error switching collection:', error);
    return res.status(500).json({ error: 'Failed to switch collection' });
  }

  try {
    const tempData = await db.readFiltered(query);
    if (!tempData || tempData.length === 0) {
      return res.status(400).json({ error: 'No data for the specified year' });
    }
    //cache the data
    cache.put(year, tempData);
    res.json(tempData);
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    res.status(500).json({ error: 'Failed to fetch temperature data' });
  }
  
};