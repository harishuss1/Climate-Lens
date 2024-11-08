import express from 'express';
import tempRouter from './routers/temperature.js';
import emissionRouter from  './routers/emissions.js';


const app = express();

/**
 * Express application setup.
 * 
 * Sets up middleware for JSON parsing, serves static files, and handles routes 
 * for temperature and emissions APIs. 
 * 
 * - Uses `/api/temp` for temperature data
 * - Uses `/api/emissions` for emissions data
 * - Serves static files from the client build directory
 * - Returns 404 for unknown routes
 */

app.use(express.json());

app.use(express.static('../client/dist'));


app.use('/api/temp', tempRouter);
app.use('/api/emissions', emissionRouter);


app.use((req, res) => {
  res.status(404).send('invalid path');
});

export default app;