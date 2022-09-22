// Swagger
const swaggerUI = require('swagger-ui-express')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config({path: 'config/config.env'})
require('./config/database')

var app = express({path: './.env'});

//imports
const productRoute = require('./routes/product');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order')
const errorMiddleware = require('./middlewares/error');

// Swagger
const swaggerDocument = require("./modules/documentation/swaggerWriter");
var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument,options));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
//routes
app.use('/api', productRoute);
app.use('/api', userRoute);
app.use('/api', orderRoute);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));

});

// error handler
app.use(errorMiddleware);

//Un handled promise rejection
module.exports = app;
