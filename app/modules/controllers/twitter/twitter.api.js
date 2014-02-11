/**
RPC twitter endpoints
@module twitter
@class TwitterApi

@toc
1. rpcRequestToken
2. rpcAccessToken
*/

'use strict';

// var passport = require('passport');
var lodash = require('lodash');
var inherits = require('util').inherits;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var Base = require('./base');
// var Base = require('../../../routes/api/base.js');		//can't pass this in since it's used with inherits (which has to be outside the function definition??)
var Base =require(pathParts.routes+'api/base.js');

var TwitterMod = require(pathParts.controllers+'twitter/twitter.js');

var defaults = {
	group: 'twitter',
	info: 'Twitter API',
	namespace: 'Twitter'
};

// var self;
var db;

module.exports = TwitterApi;

/**
@param {Object} options
	@param {Object} db
	// @param {Object} Base
*/
function TwitterApi(options){
	this.opts = lodash.merge({}, defaults, options||{});
	// Base =this.opts.Base;
	Base.call(this, this.opts);

	db =this.opts.db;
	// self =this;
}

inherits(TwitterApi, Base);

TwitterApi.prototype.getRpcMethods = function(){
	return {
		requestToken: this.rpcRequestToken(),
		accessToken: this.rpcAccessToken()
	};
};

/**
@toc 1.
@method rpcRequestToken
**/
TwitterApi.prototype.rpcRequestToken = function(){
	var self = this;

	return {
		info: 'Get Twitter request token for the app',
		params:
		{
			//callback_url: { required: true, type: 'string', info: "The callback url for the Twitter redirect in a later step (step 2)" }
		},
		returns:
		{
			request_token: 'string',
			request_token_secret: 'string'
		},
		/**
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise = TwitterMod.requestToken(db, params, {});
			promise.then(function(ret1)
			{
				out.win(ret1);
				// self.handleError(out, {}, {});		//TESTING
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 2.
@method rpcAccessToken
**/
TwitterApi.prototype.rpcAccessToken = function(){
	var self = this;

	return {
		info: 'Get Twitter access token for the user',
		params:
		{
			// user_id: { required: true, type: 'string', info: "The id of the user to store/associate this access token with" },
			// request_token: { required: true, type: 'string', info: "The request token from earlier (step 1)" },
			// request_token_secret: { required: true, type: 'string', info: "The request token secret from earlier (step 1)" },
			oauth_verifier: { required: true, type: 'string', info: "The value returned from the frontend twitter authentication (step 2)" },
		},
		returns:
		{
			access_token: 'string',
			access_token_secret: 'string'
		},
		/**
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise = TwitterMod.accessToken(db, params, {});
			promise.then(function(ret1)
			{
				out.win(ret1);
				// self.handleError(out, {}, {});		//TESTING
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};