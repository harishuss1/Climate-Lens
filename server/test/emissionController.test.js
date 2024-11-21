import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import emissionRouter from '../routers/emissions.js';
import { db } from '../db/db.js';

const app = express();
app.use('/api/emissions', emissionRouter); 

const exampleData = {
  'Year':'2008',
  'Country':'AFGHANISTAN',
  'Total':'1161',
  'Solid Fuel':'294',
  'Liquid Fuel':'781',
  'Gas Fuel':'81',
  'Cement':'4',
  'Gas Flaring':'',
  'Per Capita':'0.044834513',
  'Bunker fuels (Not in Total)':'41'
};


describe('GET /api/emissions/:country/:year?', () => {
  let stubChangeCollection;
  let stubReadFiltered;
  let stubReadAll;

  beforeEach(() => {
    // Mock the db.changeCollection and db.readFiltered methods
    stubChangeCollection = sinon.stub(db, 'changeCollection');
    stubReadFiltered = sinon.stub(db, 'readFiltered');
    stubReadAll = sinon.stub(db, 'readAll');
  });

  afterEach(() => {
    // Restore the stubbed methods after each test
    sinon.restore();
  });

  /**
   * testing invalid year, should result in an error.
   */
  it('should return a 400 error if an invalid year is provided', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves([]);

    const response = await request(app).get('/api/emissions/9999');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadFiltered.called).to.be.false;
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Enter a valid year (2008-2013)');
  });


  /**
   * testing '/' route.
   */
  it('should return emissions data without year or country input', async () => {
    stubChangeCollection.resolves();
    stubReadAll.resolves(exampleData);

    // Make a GET request with no further input
    const response = await request(app).get('/api/emissions/');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadAll.calledOnce).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(exampleData);
  });

  /**
   * testing '/:country' route.
   */
  it('should return emissions data for a valid country', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves(exampleData);

    // Make a GET request with a valid country
    const response = await request(app).get('/api/emissions/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({ Country: { $regex: /^Afghanistan$/i } })).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(exampleData);
  });

  /**
   * testing '/:country/:year?' route.
   */
  it('should return emissions data for a valid country and year', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves(exampleData);

    // Make a GET request with a valid country and year
    const response = await request(app).get('/api/emissions/Afghanistan/2008');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({
      Country: { $regex: /^Afghanistan$/i },
      Year: Number(2008)
    })).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(exampleData);
  });

  /**
   * testing '/:year' route.
   */
  it('should return emissions data for a valid year', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves(exampleData);

    // Make a GET request with a valid year
    const response = await request(app).get('/api/emissions/2008');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({ Year: Number(2008) })).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(exampleData);
  });

  /**
   * testing '/:year/:country?' route.
   */
  it('should return emissions data for a valid year and country (in that order)', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.resolves(exampleData);

    // Make a GET request with a valid year and country
    const response = await request(app).get('/api/emissions/2008/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({
      Country: { $regex: /^Afghanistan$/i },
      Year: Number(2008)
    })).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(exampleData);
  });

  /**
   * testing that it will return a 500 error if changeCollection fails
   */
  it('should return a 500 error if changeCollection fails', async () => {
    stubChangeCollection.rejects(new Error('Failed to switch collection'));

    // Make a GET request with a valid country
    const response = await request(app).get('/api/emissions/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Failed to switch collection');
  });

  /**
   * testing that it will return a 500 error if readFiltered fails
   */
  it('should return a 500 error if readFiltered fails', async () => {
    stubChangeCollection.resolves();
    stubReadFiltered.rejects(new Error('Failed to fetch emission data'));

    // Make a GET request with a valid country
    const response = await request(app).get('/api/emissions/Afghanistan');

    expect(stubChangeCollection.calledOnceWith('CO2Emissions')).to.be.true;
    expect(stubReadFiltered.calledOnceWith({ Country: { $regex: /^Afghanistan$/i } })).to.be.true;
    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('error', 'Failed to fetch emission data');
  });
});
