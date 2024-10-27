import {db} from '../db/db.js';
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
    throw Error('error reading file');
  }
};

(async () => {
  try {
    // TODO replace cluster0 with your db name
    await db.connect('Cluster520Web2024', 'fossilFuel');
    const fossilData = await readData('./db/fossilFuelCo2.json');
    const temperatureData = await readData('./db/globalLandTemperature.json');
    const num = await db.createMany(fossilData);
    await db.changeCollection('CO2');
    const num2 = await db.createMany(temperatureData);
    console.log(`Inserted ${num} fossil data`);
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