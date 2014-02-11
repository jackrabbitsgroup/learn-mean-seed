/**
Handles Twitter login / authentication

Unlike g+ & facebook, twitter does NOT support oauth2 or clientside javascript auth.. have to do it on backend and do a redirect (rather than a pop-up, etc.) so it's messier.. LAME!
Docs:
- https://npmjs.org/package/node-twitter-api
- http://stackoverflow.com/questions/800827/twitter-oauth-callbackurl-localhost-development
- https://dev.twitter.com/docs/api/1.1
- https://dev.twitter.com/docs/auth/implementing-sign-twitter


NOTE: this currently relies on global.cfgJson to exist and be set correctly
Uses config.json twitter properties (config.twitter) for configuration
@example config.email
{
    consumerKey: 'your consumer Key',
	consumerSecret: 'your consumer secret',
	callback: 'http://yoururl.tld/something'
}

@module twitter
@class twitter

@toc
public methods
1. requestToken
2. accessToken

private methods
*/

'use strict';

var cfg =global.cfgJson;

/**
@property twitterData Twitter requires these values to be passed to get the access token but because of the redirect (no client side javascript to be able to stay on the same page), we can't keep this / pass through on the frontend so need to save it here to can use it later..)
@type Object
*/
var twitterData ={
	requestToken: false,
	requestTokenSecret: false
};

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
	consumerKey: cfg.twitter.consumerKey,
	consumerSecret: cfg.twitter.consumerSecret,
	callback: cfg.twitter.callback_url
});

var crypto =require('crypto');
var moment = require('moment');
var Q = require('q');
var lodash = require('lodash');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var StringMod =require(pathParts.services+'string/string.js');
var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var AuthMod =require(pathParts.controllers+'auth/auth.js');
var UserMod =require(pathParts.controllers+'user/user.js');

//global values that will be set by passed in objects (to avoid having to require in every file)
// var db;
var self;

var defaults =
{
	
};

/**
@param {Object} options
	// @param {Object} db
*/
function Twitter(options)
{
	this.opts = lodash.merge({}, defaults, options||{});
	self = this;
}

/**
@toc 1.
@method requestToken
@param {Object} data
	// @param {String} callback_url
@param {Object} params
@return {Object} (via Promise)
	@param {String} request_token
	@param {String} request_token_secret
**/
Twitter.prototype.requestToken = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Twitter.requestToken '};
	
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
		if (error) {
			ret.code =1;
			ret.msg +="Error getting OAuth request token : " + error;
			deferred.reject(ret);
		} else {
			//save for later
			twitterData ={
				requestToken: requestToken,
				requestTokenSecret: requestTokenSecret
			};
			
			ret.request_token =requestToken;
			ret.request_token_secret =requestTokenSecret;
			deferred.resolve(ret);
		}
	});

	return deferred.promise;
};

/**
Gets an access token and then uses that info to call auth.socialLogin to signup/login this user. Ideally would also make Twitter REST API calls to get the user's email/phone but that's not accessible via Twitter API so only have id.
@toc 2.
@method accessToken
@param {Object} data
	// @param {String} user_id The id of the user to associate this access token with
	// @param {String} request_token
	// @param {String} request_token_secret
	@param {String} oauth_verifier
@param {Object} params
@return {Object} (via Promise)
	@param {Object} user The existing or created user
	@param {String} access_token
	@param {String} access_token_secret
**/
Twitter.prototype.accessToken = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, err:false, msg:'Twitter.accessToken '};
	
	data.request_token =twitterData.requestToken;
	data.request_token_secret =twitterData.requestTokenSecret;
	
	// console.log('data.request_token: '+data.request_token+' data.request_token_secret: '+data.request_token_secret+' data.oauth_verifier: '+data.oauth_verifier);		//TESTING
	
	twitter.getAccessToken(data.request_token, data.request_token_secret, data.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
		if (error) {
			ret.code =1;
			ret.msg +="Error getting OAuth access token";
			ret.err =error;
			ret.debug =data;
			deferred.reject(ret);
		} else {
		
			// console.log('results: '+JSON.stringify(results));		//TESTING
			//do user import
			var vals ={
				type: 'twitter',
				user: {},
				socialData: {
					id: results.user_id,
					token: accessToken,
					token_secret: accessTokenSecret
				}
			};
			
			AuthMod.socialLogin(db, vals, {})
			.then(function(retLogin) {
				deferred.resolve(retLogin);
			}, function(err) {
				deferred.reject(err);
			});
			
			//Step 4: Verify Credentials belongs here
		}
	});

	return deferred.promise;
};

module.exports = new Twitter({});