'use strict';

var express = require('express');
var router = express.Router();

var config = require('../includes/config');

router.get('/', function(request, response) {
    var context = {
        title: config.brand
    };
    response.render('index.html', context);
});

module.exports = router;
