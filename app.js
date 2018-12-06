var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
require('dotenv').config();
var authRouter = require('./api/routes/authorizedRoutes');
var anonymousRouter = require('./api/routes/anonymousRoutes');
var authenticate = require('./api/middleware/authenticate');
var app = express();

require('./infrastructure/database'); // to connect to db
require('./infrastructure/databaseSeed'); // if we dont have any data in db then seed it


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/auth', authenticate, authRouter);
app.use('/anonymous', anonymousRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({errors: err, message: err.message});
    next(err);
});
   
module.exports = app;
