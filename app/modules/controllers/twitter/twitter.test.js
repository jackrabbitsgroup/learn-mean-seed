/**
Tests for all /api/twitter endpoints

NOTE: "it" blocks with modularized/nested function and async code can be finicky - I don't think nested "it" blocks are allowed BUT need an outer "it" block to ensure the async code gets run (otherwise it will just complete immediately before running any tests). So if and when to use "done" for the it blocks and where to put them is sometimes hard to follow/trace. When in doubt, try an "it" block and if it errors or doesn't complete, try just putting an "expect" there directly - it's likely already in an "it" block..

@toc
public methods
1. Twitter
2. Twitter.run
private methods
3.5. clearData
3. before
4. after
5. go
	6. requestToken
	7. accessToken
*/

'use strict';

var https = require("https");
var request = require('request');
var async = require('async');
var lodash = require('lodash');
var Q = require('q');
var moment = require('moment');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');
var ArrayMod =require(pathParts.services+'array/array.js');

var self, db, api;

//NOTE: make sure to namespace all values to ensure no conflicts with other modules that run asynchronously and may be altering the same data otherwise - leading to odd and very hard to debug errors..
var ns ='twitter_';		//namespace =twitter
var TEST_USERS =[
	{
		email: ns+'t1@email.com',
		first_name: ns+'First',
		last_name: ns+'Last',
		password: ns+'pass'
	}
];

/**
Variable to store variables we need to use in multiple tests (i.e. counters)
@property globals
@type Object
*/
var globals ={
};

module.exports = Twitter;

/**
Main function/object (will be exported)
@toc 1.
@method Twitter
@param {Object} params
	@param {Object} db
	@param {Object} api
	// @param {Object} MongoDBMod
*/
function Twitter(params) {
	db =params.db;
	api =params.api;
	// MongoDBMod =params.MongoDBMod;
	
	self =this;
}

/**
@toc 2.
@method Twitter.run
@param {Object} params
*/
Twitter.prototype.run =function(params) {
	var deferred =Q.defer();
	
	describe('TwitterModule', function() {
		it("should test all twitter goal calls", function(done)
		{
			var promise =before({});
			promise.then(function(ret1) {
				done();
				deferred.resolve(ret1);
			}, function(err) {
				deferred.reject(err);
			});
		});
	});
	
	return deferred.promise;
};

/**
@toc 3.5.
@method clearData
@param {Object} params
@return {Promise} This will ALWAYS resolve (no reject)
*/
function clearData(params) {
	var deferred =Q.defer();
	var ret ={msg: ''};
	
	//drop test data
	var emails =[];
	var ii=0;
	for(ii =0; ii<TEST_USERS.length; ii++) {
		emails[ii] =TEST_USERS[ii].email;
	}
	db.user.remove({email: {$in:emails} }, function(err, numRemoved) {
		if(err) {
			ret.msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1) {
			ret.msg +="db.user.remove Num removed: "+numRemoved;
		}
		else {
			ret.msg +="db.user.remove Removed "+numRemoved;
		}
		
		deferred.resolve(ret);
	
	});
	
	return deferred.promise;
}

/**
@toc 3.
@method before
@param {Object} params
*/
function before(params) {
	var deferred =Q.defer();
	
	var promiseClearData =clearData({})
	.then(function(ret1) {
		console.log('\nTwitter BEFORE: '+ret1.msg);

		var reqObj, params;
		//create users then save _id's for use later
		async.forEach(TEST_USERS, function(user1, aCallback) {
			// params = lodash.clone(user1);
			reqObj =api.httpGo({method:'Auth.create'}, {data:user1}, {});
			request(reqObj, function(error, response, data)
			{
				data =api.parseData(data, {});
				user1._id =data.result.user._id;
				user1.authority_keys = {'user_id': user1._id, 'sess_id': data.result.user.sess_id};
				aCallback(false);
			});
		}, function(err) {
			var promise =go({});
			promise.then(function(ret1) {
				var promiseAfter =after({});
				promiseAfter.then(function(retAfter) {
					deferred.resolve(ret1);
				}, function(err) {
					deferred.reject(err);
				});
			}, function(err) {
				deferred.reject(err);
			});
		});
	});

	return deferred.promise;
}

/**
Do clean up to put database back to original state it was before ran tests (remove test users, etc.)
@toc 4.
@method after
@param {Object} params
*/
function after(params) {
	var deferred =Q.defer();
	
	var promiseClearData =clearData({})
	.then(function(ret1) {
		console.log('\nTwitter AFTER: '+ret1.msg);
		deferred.resolve({});
	});
	
	return deferred.promise;
}

/**
@toc 5.
@method go
@param {Object} params
*/
function go(params) {
	var deferred =Q.defer();
	var reqObj;
	
	/**
	@toc 6.
	@method requestToken
	@param {Object} opts
	*/
	var requestToken =function(opts) {
		var params =
		{
		};
		api.expectRequest({method:'Twitter.requestToken'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data.result;
			expect(data.request_token).toBeDefined();
			expect(data.request_token_secret).toBeDefined();
			
			accessToken({});
		});
	};
	
	
	/**
	@toc 7.
	@method accessToken
	@param {Object} opts
	*/
	var accessToken =function(opts) {
		//can't actually test this without frontend to get the oauth_verifier??
		deferred.resolve({});
	};
	
	requestToken({});		//start all the calls going
	
	return deferred.promise;
}