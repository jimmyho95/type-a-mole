require('dotenv').config();
const express = require("express");
const cors = require ('cors');
const connectDB = require('./models/connectDB');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();
const port = process.env.PORT || 3000;

console.log('serverjs loaded MONGO_URI: ', process.env.MONGO_URI);

connectDB();


app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
    //     res.send("server ready");
    // });
    
app.use('/api/scores', scoreRoutes);


//404 handler
app.use((req, res) => res.status(404).send("404"));

//global error handler
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An unexpected error occured' },
    };

    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
})

//start server
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
