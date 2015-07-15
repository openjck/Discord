'use strict';

var path = require('path');

var express = require('express');

var hook = require('./hook');
var config = require('./config');
var logger = require('./logger');

var port = process.env.PORT || config.port;

var app = express();
app.use(express.static(path.join(__dirname, 'build/www')));
app.post('/hook', hook.handle);
app.listen(port);

logger.info('Listening at port:', port);
