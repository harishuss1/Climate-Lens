import { db } from '../db/db.js';
import {readData} from './fileUtil.mjs';
'use strict';

(async () => {
  try {
    // TODO replace cluster0 with your db name
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