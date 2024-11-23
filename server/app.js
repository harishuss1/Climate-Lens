import express from 'express';
import tempRouter from './routers/temperature.js';
import emissionRouter from  './routers/emissions.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// app.js
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for climate data visualization',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
var app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add Cache-control to all responses
// app.use(function (req, res, next) {
//   res.set('Cache-control', 'public, max-age=31536000');
//   next();
// });

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

app.use(express.static('../client/dist'));


app.use('/api/temp', tempRouter);
app.use('/api/emissions', emissionRouter);


app.use((req, res) => {
  res.status(404).send('invalid path');
});

export default app;