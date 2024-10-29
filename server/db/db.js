import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

// If no uri use that as dburl, for ci 
const dbUrl = process.env.ATLAS_URI || 'mongodb://localhost:3005/testdb';
let instance = null;

class DB {
  constructor() {
    //instance is the singleton, defined in outer scope
    if (!instance) {
      instance = this;
      this.mongoClient = null;
      this.db = null;
      this.collection = null;
    }
    return instance;
  }
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

  async changeCollection(collName) {
    if (!instance.db) {
      throw new Error('No database connection. Please connect first.');
    }
    instance.collection = await instance.db.collection(collName);
    console.log('Switched to collection: ' + collName);
  }

  async close() {
    await instance.mongoClient.close();
    instance = null;
  }

  isInstanceNull() {
    return instance === null;
  }

  async readAll() {
    return await instance.collection.find().toArray();
  }

  async createMany(quotes) {
    return await instance.collection.insertMany(quotes);
  }

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
