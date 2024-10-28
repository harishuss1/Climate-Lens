import express from 'express';
import tempRouter from './routers/temperature.js';

//import your route just like the example below
//import  quotes from './routes/quotes.js';

const app = express();

app.use(express.json());

app.use(express.static('../client/dist'));

// uses your route e.g below

app.use('/api/temp', tempRouter);

///other routes

app.use((req, res) => {
  res.status(404).send('invalid path');
});

export default app;