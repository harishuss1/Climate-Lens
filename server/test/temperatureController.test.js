import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import tempRouter from '../routers/temperature.js';
import { db } from '../db/db.js';

const app = express();
app.use(express.json());
app.use('/api/temp', tempRouter); 


/**
 * Test suite for GET /api/temp/:country/:year? endpoint.
 */
describe('GET /api/temp/:country/:year?', () => {
  let stubChangeCollection;
  let stubReadFiltered;

  /**
   * Set up stubs for db.changeCollection and db.readFiltered methods before each test.
   */
  beforeEach(() => {
    // Mock the db.changeCollection and db.readFiltered methods
    stubChangeCollection = sinon.stub(db, 'changeCollection');
    stubReadFiltered = sinon.stub(db, 'readFiltered');
  });

  /**
   * Restore the stubs after each test.
   */
  afterEach(() => {
    // Restore the stubbed methods after each test
    sinon.restore();
  });

  /**
   * Test case for an invalid country.
   * Expected outcome: Returns a 400 error with 'Enter a valid country' message.
   */
  it('should return a 400 error if an invalid country is provided', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves([]);

    const response = await request(app).get('/api/temp/InvalidCountry');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({ Country: { $regex: /^InvalidCountry$/i }})).to.be.true;
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Enter a valid country');
  });


  /**
   * Test case for a valid country.
   * Expected outcome: Returns temperature data for the specified country.
   */
  it('should return temperature data for a valid country', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves([{ dt: '2008-03-01',
      AverageTemperature: 13.506, Country: 'Afghanistan' }]);

    // Make a GET request with a valid country
    const response = await request(app).get('/api/temp/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({ Country: { $regex: /^Afghanistan$/i } })).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([{ dt: '2008-03-01',
      AverageTemperature: 13.506, Country: 'Afghanistan' }]);
  });


  /**
   * Test case for a valid country and year.
   * Expected outcome: Returns temperature data for the specified country and year.
   */
  it('should return temperature data for a valid country and year', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves([{ dt: '2008-03-01',
      AverageTemperature: 13.506, Country: 'Afghanistan' }]);

    // Make a GET request with a valid country and year
    const response = await request(app).get('/api/temp/Afghanistan/2008');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({
      Country: { $regex: /^Afghanistan$/i },
      dt: /^2008/
    })).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([{ dt: '2008-03-01',
      AverageTemperature: 13.506, Country: 'Afghanistan' }]);
  });


  /**
   * Test case for failing changeCollection.
   * Expected outcome: Returns a 500 error with 'Failed to switch collection' message.
   */
  it('should return a 500 error if changeCollection fails', async () => {
    stubChangeCollection.rejects(new Error('Failed to switch collection'));

    // Make a GET request with a valid country
    const response = await request(app).get('/api/temp/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Failed to switch collection');
  });


  /**
   * Test case for failing readFiltered.
   * Expected outcome: Returns a 500 error with 'Failed to fetch temperature data' message.
   */
  it('should return a 500 error if readFiltered fails', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.rejects(new Error('Failed to fetch temperature data'));

    // Make a GET request with a valid country
    const response = await request(app).get('/api/temp/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({ Country: { $regex: /^Afghanistan$/i } })).to.be.true;
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Failed to fetch temperature data');
  });
});

describe('GET /api/temp/:country/:startYear/:endYear', () => {
  let stubChangeCollection;
  let stubReadFiltered;

  beforeEach(() => {
    stubChangeCollection = sinon.stub(db, 'changeCollection');
    stubReadFiltered = sinon.stub(db, 'readFiltered');
  });

  afterEach(() => {
    // Restore the stubbed methods after each test
    sinon.restore();
  });

  /**
   * Test case for valid country and valid year range.
   * Expected outcome: Returns average temperature data for each year in the specified range.
   */
  it('should return average temperature data for each year in the specified range', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves([
      { dt: '2008-03-01', AverageTemperature: 13.506, Country: 'Afghanistan' },
      { dt: '2008-07-01', AverageTemperature: 20.123, Country: 'Afghanistan' },
      { dt: '2009-05-01', AverageTemperature: 15.123, Country: 'Afghanistan' }
    ]);

    const response = await request(app).get('/api/temp/Afghanistan/2008/2009');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({
      Country: { $regex: /^Afghanistan$/i },
      dt: { $gte: '2008-01-01', $lte: '2009-12-31' }
    })).to.be.true;

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([
      { year: '2008', avgTemperature: (13.506 + 20.123) / 2 },
      { year: '2009', avgTemperature: 15.123 }
    ]);
  });

  /**
   * Test case for a valid country but no data in the specified range.
   * Expected outcome: Returns a 404 error with message 
   * "No data found for the given range and country".
   */
  it('should return a 404 error if no data is found for the specified range', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves([]);

    const response = await request(app).get('/api/temp/Afghanistan/2008/2009');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({
      Country: { $regex: /^Afghanistan$/i },
      dt: { $gte: '2008-01-01', $lte: '2009-12-31' }
    })).to.be.true;

    expect(response.status).to.equal(404);
    // eslint-disable-next-line max-len
    expect(response.body).to.have.property('error', 'No data found for the given range and country');
  });

  /**
   * Test case when changeCollection fails.
   * Expected outcome: Returns a 500 error with message "Failed to switch collection".
   */
  it('should return a 500 error if changeCollection fails', async () => {
    stubChangeCollection.rejects(new Error('Failed to switch collection'));

    const response = await request(app).get('/api/temp/Afghanistan/2008/2009');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Failed to switch collection');
  });

  /**
   * Test case when readFiltered fails.
   * Expected outcome: Returns a 500 error with message "Failed to fetch temperature data".
   */
  it('should return a 500 error if readFiltered fails', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.rejects(new Error('Failed to fetch temperature data'));

    const response = await request(app).get('/api/temp/Afghanistan/2008/2009');

    expect(stubChangeCollection.calledOnceWith('CountryAverageTemperature')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({
      Country: { $regex: /^Afghanistan$/i },
      dt: { $gte: '2008-01-01', $lte: '2009-12-31' }
    })).to.be.true;
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Failed to fetch temperature data');
  });
});