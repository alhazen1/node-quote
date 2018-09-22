const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// helmet config
var helmet = require('helmet');
app.use(helmet({
    noCache: true
}))


// rate limiter
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMS: 60,
    max: 10,
    message: {
        quotes: [{
            quote: "Too many transactions, try again later"
        }],
        "how-to": "www.test.com/api-wiki",
        "bugs": "https://github.com/xxxxxxx/test-api"
    }
});
app.use(limiter);


app.enable('json escape');
//app.set('jsonp callback monkey')

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//CORS stuff
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        //res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next();
});

// db connect
// SCRAM_user pwd is env variable!!!!!
mongoose.connect('mongodb+srv://SCRAM_user:' +
    process.env.MONGO_ATLAS_PW + process.env.DB_CONN, {
        useNewUrlParser: true // old way deprecated
    });

// routes
const restRoutes = require('./rest/routes/quotes');
app.use('/quotes/v1', restRoutes);

//const apiRoutes = require('./api/routes/quotes');
//app.use('/quotes/api', apiRoutes);

// any route not handled above
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
