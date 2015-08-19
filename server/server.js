'use strict';

var $url = require('url');
var $fs = require('fs');

var $express = require('express');
var $upTheTree = require('up-the-tree');

var app = $express();

app.use(function (req, res, next) {

    var url = $url.parse(req.url, true);
    if (url.pathname === '/' || url.pathname === '/index.html') {

        var angularVersion = url.query.ng || '1.4.4';

        var body = $fs.readFileSync($upTheTree() + '/client/index.html').toString();
        res.end(body.replace('%ANGULAR_CDN_URL%', '//cdnjs.cloudflare.com/ajax/libs/angular.js/' + angularVersion + '/angular.js'));

    }
    else {
        next();
    }

});
app.use('/static/', $express.static($upTheTree() + '/bower_components'));
app.use('/', $express.static($upTheTree() + '/client'));

app.listen(process.env.VCAP_APP_PORT || 8989, function () {
    console.log('localhost:8989');
});
