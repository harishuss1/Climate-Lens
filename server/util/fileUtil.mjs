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
  if (await validatePath(path) && await isFile(path)) {
    const data = await fs.readFile(path, 'utf-8');
    const dataJson = JSON.parse(data);
    return dataJson;
  }
  throw new Error('File does not exist or is not a file');
};

export { validatePath, isFile, readData };