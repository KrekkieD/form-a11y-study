'use strict';

var $express = require('express');
var $upTheTree = require('up-the-tree');

var app = $express();

app.use('/static/', $express.static($upTheTree() + '/bower_components'));
app.use('/', $express.static($upTheTree() + '/client'));

app.listen(8989, function () {
    console.log('localhost:8989');
});
