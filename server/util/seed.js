import { db } from '../db/db.js';
import * as fs from 'node:fs/promises';
'use strict';

/**
 * Validates if the specified path exists.
 *
 * @param {string} path - The path to validate.
 * @returns {Promise<boolean>} - A promise that resolves to true if the path exists,
 * false otherwise.
 */

async function validatePath(path) {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    console.error(e.message);
    return false;
  }
}

/**
 * Checks if the specified path is a file.
 *
 * @param {string} path - The path to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the path is a file, 
 * false otherwise.
 */
async function isFile(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch (e) {
    console.error(e.message);
    return false;
  }
}

async function readData(path) {
  try {
    if (await validatePath(path) && await isFile(path)) {
      const data = await fs.readFile(path, 'utf-8');
      const dataJson = JSON.parse(data);
      return dataJson;
    }
  } catch (error) {
    throw Error('error reading file : ' + error);
  }
};

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