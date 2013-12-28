/**
Configures express server and glues application together.

When initialized this file sets up the following modules:

- Express server
- MongoDB database connection
- JSON-RPC API
- All non-API routes

The Express server configuration uses the following:

- `express.compress()` for static content
- `express.bodyParser()`, `express.query()`, `express.methodOverride()`, and `express.cookieParser()`

Server module
@module server
**/

'use strict';

var express = require('express');
var http    = require('http');
var https   = require('https');
var fs      = require('fs');
var lodash       = require('lodash');
var Q = require('q');

// session store
// var MongoStore  = require('connect-mongo')(express);
// database interface
var mongodb    = require('mongodb');

var Database = require('./database');

var dependency =require('./dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

//site-specific
var RealtimeMod =require(pathParts.services+'realtime/realtime.js');

// CORS support middleware factory
var allowCors = function(domains){
    if(lodash.isString(domains)){
        domains = [ domains ];
    }

    var allowAll = lodash.contains(domains, '*');

    // return CORS middleware bound to domains arg
    return function(req, res, next){
        // @note: can only send a single Access-Control-Allow-Origin header per spec
        //  thus, have to compare incoming origin with list of allowed domains and respond with that origin in header
        var origin = req.get('Origin');
		
		var optionsSent =false;		//can't res.send AND do next() otherwise get an error about headers already being sent so need to set a flag so only send one or the other
		
		// console.log('domains: '+JSON.stringify(domains)+' origin: '+origin);
		var allowedDomain =false;
		// allowedDomain =lodash.contains(domains, origin);		//doesn't work since origin can be 'http://localhost' and then 'localhost' as a domain will NOT be a match. Basically need to account for subdomains, host, etc. in the string
		if(origin !==undefined) {
			var ii;
			for(ii =0; ii<domains.length; ii++) {
				if(origin.indexOf(domains[ii]) >-1) {
					allowedDomain =true;
					break;
				}
			}
		}

        // check if origin is in allowed domains
        if( allowAll || allowedDomain ){
            // send appropriate CORS headers
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            // intercept OPTIONS method for preflight response
            if(req.method === 'OPTIONS'){
				optionsSent =true;
                res.send(200);
            }
        }

		if(!optionsSent) {
			next();
		}
    };
};

module.exports = Server;

/**
Express Server class
@class Server
@constructor
@param cfg {Object} JSON configuration file
**/
function Server(cfg){
	var deferred = Q.defer();
	var thisObj =this;
    this.env = cfg.env;
    this.cfg = cfg;

	// console.log('cfg json: '+JSON.stringify(cfg));
	// Connect to database
	// var db =new Database(cfg.db).db;
    var promise =new Database(cfg.db);
	promise.then(function(db) {
		var expressApp = thisObj.configure(cfg, db);

		// set variables here instead of in configure() so it's clear what our attributes are
		thisObj.app = expressApp.app;
		thisObj.server = expressApp.server;
		thisObj.db = expressApp.db;
		
		//site-specific
		//set up realtime
		RealtimeMod =RealtimeMod.init({db:db});
		
		deferred.resolve(thisObj);
	}, function(err) {
		console.log('error: '+err);
		deferred.reject(err);
	});
	
	return deferred.promise;
}

/**
Configure the express server and all it's components
@method configure
@param cfg {Object} JSON configuration object
**/
Server.prototype.configure = function(cfg, db){
    /** Configuration **/
    var env = cfg.env;

    // create main app/server
    var app = express();
    var server;

    if( cfg.ssl.enabled ){
        server = https.createServer({
            key:    fs.readFileSync(cfg.ssl.key),
            cert:   fs.readFileSync(cfg.ssl.cert)
        });
    } else {
        server = http.createServer(app);
    }

    var staticFilePath = __dirname + cfg.server.staticFilePath;
    // remove trailing slash if present
    if(staticFilePath.substr(-1) === '/'){
        staticFilePath = staticFilePath.substr(0, staticFilePath.length - 1);
    }

    // configure express
    app.configure(function(){
        app.use(express.logger(cfg.logKey));

        // compress static content
        app.use(express.compress());
        app.use(cfg.server.staticPath, express.static(staticFilePath));
        //app.use(express.favicon());

        app.use(express.bodyParser());
        app.use(express.query());
        app.use(express.methodOverride());
        app.use(express.cookieParser(cfg.cookie.secret));

        // allow cors
        if( cfg.cors && cfg.cors.domains ){
            app.use( allowCors(cfg.cors.domains) );
        }

        app.use(app.router);
    });

    // set app settings variables
    app.set('db.database', cfg.db.database);
    app.set('server.port', cfg.server.port);
    app.set('staticFilePath', staticFilePath);

    // set error handling
    if(cfg.env === 'development'){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    } else {
        app.use(express.errorHandler());
    }
	
	// Configure session store
	// var storeOpts = cfg.session.store;
	// storeOpts.mongoose_connection = db;

	// app.use(express.session({
		// secret: cfg.cookie.secret,
		// maxAge: new Date(Date.now() + cfg.session.maxAge),
		// store: new MongoStore(storeOpts)
	// }));

	// load api
	app.use( require('./routes/api')(cfg, server, db) );

	// load routes (must be loaded after API since routes may contain catch-all route)
	app.use( require('./routes')(cfg) );

    return {
        app: app,
        server: server,
        db: db
    };
};

/**
Default listen callback function after server starts listening. Used when nothing passed to listen().
@method defaultListenCallback
@param port {Integer} server port to listen on
@parm env {String} runtime environment (e.g. 'development', 'production')
**/
Server.prototype.defaultListenCallback = function(port, env){
    console.log('Express server listening on port %d in %s mode', port, env);
};

/**
Starts server listening
@method listen
@param [callback] {Function} listen callback function
**/
Server.prototype.listen = function(callback){
    // var port = this.cfg.server.port;
	var port = process.env.PORT || this.cfg.server.port;		//for Heroku to work
    var env = this.env;

    callback = callback || this.defaultListenCallback;

    this.server.listen(port, function(){
        callback(port, env);
    });
};

