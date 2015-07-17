'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var path = require('path');

var config = require('./includes/config');

var index = require('./controllers/index');
var hook = require('./controllers/hook');

// Set up Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set up views
app.set('views', path.join(__dirname, 'views'));
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Controllers
app.use('/', index);
app.use('/hook', hook);

// Catch 404s and forward them to the error handler
app.use(function(request, response, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error handler
// The callback needs to have four arguments, even if some are unused, for
// Express to correctly identify it as error middleware.
app.use(function(error, request, response, next) {
    var context = {
        title: error.message + ' | ' + config.brand,
        message: error.message
    };

    response.status(error.status || 500);
    response.render('error.html', context);
});

module.exports = app;
