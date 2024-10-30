import { db } from '../db/db.js';
import {readData} from './fileUtil.mjs';
'use strict';

/**
 * Seeds the database with CO2 emissions and temperature data.
 * 
 * The script connects to the MongoDB database, reads data from JSON files,
 * and inserts the data into the respective collections in the database.
 *
 * @async
 * @function
 * @throws {Error} Will throw an error if the database connection or file reading fails.
 */

(async () => {
  try {

    await db.connect('Cluster520Web2024', 'CO2Emissions');
    const co2EmissionsData = await readData('./data/fossilFuelCo2.json');
    const temperatureData = await readData('./data/globalLandTemperature.json');
    const num = await db.createMany(co2EmissionsData);
    await db.changeCollection('CountryAverageTemperature');
    const num2 = await db.createMany(temperatureData);
    console.log(`Inserted ${num} CO2Emissions data`);
    console.log(`Inserted ${num2} temperature data`);
  } catch (e) {
    console.error('could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();