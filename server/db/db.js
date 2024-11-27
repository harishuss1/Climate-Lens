import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';


const dbUrl = process.env.ATLAS_URI;
let instance = null;

/**
 * @class DB
 * @description Singleton class for managing a MongoDB connection and collections.
 */

class DB {
  constructor() {
    if (!instance) {
      instance = this;
      this.mongoClient = null;
      this.db = null;
      this.collection = null;
    }
    return instance;
  }

  /**
   * @async
   * @method connect
   * @description Establishes a connection to MongoDB
   * @param {string} dbname - The name of the database to connect to.
   * @param {string} collName - The name of the collection to use.
   * @returns {Promise<void>}
   */

  async connect(dbname, collName) {
    if (instance.db) {
      return;
    }
    this.mongoClient = new MongoClient(dbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await instance.mongoClient.connect();
    instance.db = await instance.mongoClient.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.mongoClient.db(dbname).command({ ping: 1 });
    console.log('Successfully connected to MongoDB database ' + dbname);
    instance.collection = await instance.db.collection(collName);
  }

  /**
   * @async
   * @method changeCollection
   * @description Changes the current collection within the connected database.
   * @param {string} collName - The name of the new collection to use.
   * @throws Will throw an error if there is no database connection.
   * @returns {Promise<void>}
   */

  async changeCollection(collName) {
    if (!instance.db) {
      throw new Error('No database connection. Please connect first.');
    }
    instance.collection = await instance.db.collection(collName);
  }

  /**
   * @async
   * @method close
   * @description Closes the MongoDB connection and resets the singleton instance.
   * @returns {Promise<void>}
   */
  async close() {
    await instance.mongoClient.close();
    instance = null;
  }

  /**
   * @async
   * @method readAll
   * @description Retrieves all documents from the current collection.
   * @returns {Promise<Array>} - Returns an array of documents.
   */

  async readAll() {
    return await instance.collection.find().toArray();
  }

  /**
   * @async
   * @method createMany
   * @description Inserts multiple datas into the current collection.
   * @param {Array} quotes - An array of datas to insert.
   * @returns {Promise<Object>} - Returns the result of the insert operation.
   */
  async createMany(datas) {
    return await instance.collection.insertMany(datas);
  }

  /**
   * @async
   * @method readFiltered
   * @description Retrieves documents from the current collection based on a filter query.
   * @param {Object} query - The filter query to match documents.
   * @throws Will throw an error if there is no collection connected or if the read fails.
   * @returns {Promise<Array>} - Returns an array of filtered documents.
   */

  async readFiltered(query) {
    if (!this.collection) {
      throw new Error('No collection connected');
    }
    try {
      const data = await this.collection.find(query).toArray();
      return data;
    } catch (error) {
      console.error('Error reading filtered data:', error);
      throw error;
    }
  }
}
export const db = new DB();
