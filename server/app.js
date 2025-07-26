// server/app.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./models/connectDB");
const scoreRoutes = require("./routes/scoreRoutes");
const wordRoutes = require("./routes/wordRoutes");

console.log('app.js loaded MONGO_URI:', process.env.MONGO_URI);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/words', wordRoutes);
app.use('/api/scores', scoreRoutes);

// 404 handler
app.use((req, res) => res.status(404).send("404"));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An unexpected error occurred' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = app;
