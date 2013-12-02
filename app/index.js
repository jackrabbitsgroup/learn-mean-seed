/**
Main application module
Initializes and configures the express app and provides an interface for starting the server. A config file needs to be passed to it's constructor

@module app
@main
**/

'use strict';

var Server = require('./server');

/**
Initializes application and configures server
@method exports
@param configFile {String} configuration JSON file
@return {App} App object
**/
module.exports = function(configFile, dirpath){
	// set NODE_ENV evironment variable
    // @note: this works for both *nix and Windows
    process.env.NODE_ENV = configFile.env;
	
	var run =function(params) {
		// var server  = new Server(configFile);
		var promise  = new Server(configFile);
		promise.then(function(server) {
			server.listen();
		}, function(err) {
			console.log('Error: '+err);
		});
	};

    /**
    App object
    @class App
    **/
    return {
        /**
        Starts server and listens
        @method run
        **/
        run: run
    };
};

