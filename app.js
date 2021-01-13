const express = require('express');
const app = express()
const morgan = require('morgan'); // http request logger middleware
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bookRoomRoutes = require('./api/routes/bookRoom');
const addRoomRoutes = require('./api/routes/addRoom');

// connect with MongoDB
mongoose.connect(
    'mongodb+srv://2getherGuest:login@123@cluster0.o8qqp.mongodb.net/booking?retryWrites=true&w=majority',
    {  
        useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false, useCreateIndex: true
    }
    ).then(() => {
        console.log('database start')
    }).catch(err => {
        console.log(err);
    });
    

app.use(morgan('dev')); // logger
app.use(bodyParser.urlencoded({ extended: false })); // body parser
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // allow access to all(*) clients
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested_With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); //not to block the next requests.
});
// CORS end

// routes handling requests
app.use('/addRoom', addRoomRoutes); // sets up as a middleware
app.use('/bookRoom', bookRoomRoutes);
// /Routes handling requests end

// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); // not to block the next requests
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
// error handling end

//export
module.exports = app;

// for express application as a request handler
