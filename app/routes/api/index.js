/**
NOTE: search for 'site-specific' in this file to see the places where you'll need to include site specific stuff (i.e. including new controllers).

This requires all the api modules and passes in the database variable to them to be used in backend modules. It also sets up the endpoints for the apis. Basically this is the MAIN ROUTER (for the RPC api).

Exposes and configures API endpoint(s). Is responsible for implementing site-wide authentication. API is configured as a JSON-RPC API conforming to the v2.0 protocol (see JSON-RPC section for implementation details and RPC-compliant module requirements).

Returns an express middleware app. Requires a mongo database connection to be passed in.

For all mounted RPC API endpoints, an interactive help page will be accessible at `/<base>/<endpoint>/help`.

API Module
@module api

@toc
1. Initialize the api route modules
2. Set up the endpoints
3. Set defaults, load the RPC module, and set up the express route for node to route properly
**/

'use strict';

var express = require('express');
var app = express();
var lodash = require('lodash');
var path = require('path');

var rpcMod =require('./rpc');
// var Base =require('./base.js');

var dependency =require('../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

//require api modules - controllers
var pathPart =pathParts.controllers;
var AuthApi = require(pathPart+'auth/auth.api.js');
var UserApi = require(pathPart+'user/user.api.js');
var FollowApi = require(pathPart+'follow/follow.api.js');
//site-specific - require other api files here



/**
API middleware
@method exports
@param cfg {Object} cfg configuration object
@param {Object} server
@param db {Object} db connection object
@return {Object} express app middleware
**/
module.exports = function(cfg, server, db){
	/**
	Initialize the api route modules (pass in the database)
	@toc 1.
	*/
	var authApi = new AuthApi({
		db: db
	});
	var userApi = new UserApi({
		db: db
	});
	var followApi = new FollowApi({
		db: db
	});
	//site-specific - load other api's here

	
	// set up auth middleware
	// app.use( authMod.passport.initialize() );
	// app.use( authMod.passport.session() );

	
	/**
	Set up the endpoints (i.e. '/api/auth')
	@toc 2.
	*/
	var endpoints = {
		'': {
			modules: {
			},
			// @todo: revive this once frontend handles login ok
			//middleware: [ authMod.loginRequired ]
			middleware: []
		},
		auth: {
			modules: {
				auth: authApi
			},
			middleware: []
		},
		user: {
			modules: {
				user: userApi
			},
			middleware: []
		},
		follow: {
			modules: {
				follow: followApi
			},
			middleware: []
		}
		//site-specific - setup other controllers/api's here
	};

	
	/**
	Set defaults, load the RPC module, and set up the express route for node to route properly
	@toc 3.
	*/
	var defaultRpcOpts = {
		mount:          '/api/',
		autoDoc:        false,
		autoDocUrl:     'help',
		autoDocFile:    path.join(__dirname, '/rpc/api-help.html'),
		postVar:        'rpc'
	};

	var rpcOpts = lodash.extend({}, defaultRpcOpts, cfg.rpc, {
		endpoints: endpoints
	});

	// load rpc server
	rpcMod(app, server, rpcOpts, db);

	// claim mount route namespace and 404 invalid requests which don't have routes
	app.all(rpcOpts.mount + '*', function(req, res){
		res.send(404, { status: 404 });
	});

	return app;
};
