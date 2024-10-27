import express from 'express';
//import your route just like the example below
//import  quotes from './routes/quotes.js';

const app = express();

app.use(express.json());
app.use(express.static('../client/dist'));

// uses your route e.g below
// app.use('/', quotes);

///other routes

app.use((req, res) => {
  res.status(404).send('invalid path');
});

export default app;