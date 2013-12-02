/**
All non-API related routes (e.g. route to Angular app).
*/

'use strict';

var express = require('express');
var app = module.exports = express();

module.exports = function(cfg){
    var routes = {
        index: function(req, res){
            // check if last part of URL is a file reference by check if it contains a "."
            var isFile = req.params[0].split('/').slice(-1)[0].indexOf('.') !== -1;

            if(isFile){
                // if file, then static middleware couldn't serve it since it doesn't exist
                res.send(404);
            } else {
                // route all requests to Angular app
                res.sendfile(req.app.get('staticFilePath') + '/index.html');
            }
        }
    };

    // wildcard route: redirect all others to the index (HTML5 history)
    app.get(cfg.server.appPath + '*', routes.index);

    return app;
};
