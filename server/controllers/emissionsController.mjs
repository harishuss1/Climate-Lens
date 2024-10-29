import { db } from '../db/db.js';

let debugcount = 0;

/**
 * Get emissions data from the CO2Emissions collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEmissionData = async (
  req, res,) => {

  debugcount++;
  console.log(`this has been run ${debugcount} times`);
  const { country, year } = req.params;

  try {
    await db.changeCollection('CO2Emissions');
  } catch (error) {
    console.error('Error switching collection:', error);
    return res.status(500).json({ error: 'Failed to switch collection' });
  }

  const query = {};

  if (country) {
    query.County = new RegExp(`^${country}$`, 'i');
  }

  if (year) {
    const validYears = ['2008', '2009', '2010', '2011', '2012', '2013'];
    if (!validYears.includes(year)) {
      return res.status(400).json({ error: 'Enter a valid year (2008-2013)' });
    }

    query.Year = Number(year);
  }

  try {
    let data = '';
    // test if query is empty
    if(Object.keys(query).length){
      data = await db.readFiltered(query);
    } else {
      data = await db.readAll();
    }
    data = await db.readFiltered(query);
    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'No data was Found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching emission data:', error);
    res.status(500).json({ error: 'Failed to fetch emission data' });
  }

};