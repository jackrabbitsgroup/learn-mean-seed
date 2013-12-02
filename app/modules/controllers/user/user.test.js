/**
Tests for all /api/user endpoints

NOTE: "it" blocks with modularized/nested function and async code can be finicky - I don't think nested "it" blocks are allowed BUT need an outer "it" block to ensure the async code gets run (otherwise it will just complete immediately before running any tests). So if and when to use "done" for the it blocks and where to put them is sometimes hard to follow/trace. When in doubt, try an "it" block and if it errors or doesn't complete, try just putting an "expect" there directly - it's likely already in an "it" block..

@toc
public methods
1. User
2. User.run
private methods
3. before
4. after
5. go
	6. update
	7. read
	8. search
	9. delete1
*/

'use strict';

var https = require("https");
var request = require('request');
var async = require('async');
var lodash = require('lodash');
var Q = require('q');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var self, db, api;

//NOTE: make sure to namespace all values to ensure no conflicts with other modules that run asynchronously and may be altering the same users / data otherwise - leading to odd and very hard to debug errors..
var TEST_USERS =[
	{
		email: 'user_test@example.com',
		first_name: 'user_Joe',
		last_name: 'user_Shmoe',
		password: 'user_test'
	},
	{
		email: 'user_example@test.com',
		first_name: 'user_Jane',
		last_name: 'user_Doe',
		password: 'user_test'
	},
	{
		email: 'user_foo@bar.com',
		first_name: 'user_Foo',
		last_name: 'user_Bar',
		password: 'user_test'
	},
	{
		email: 'user_qwerty@asdf.com',
		first_name: 'user_Mike',
		last_name: 'user_Ike',
		password: 'user_test'
	},
	{
		email: 'user_lala@hoho.com',
		first_name: 'user_Bill',
		last_name: 'user_Ted',
		password: 'user_test'
	}
];
var testUser = TEST_USERS[2];

module.exports = User;

/**
Main function/object (will be exported)
@toc 1.
@method User
@param {Object} params
	@param {Object} db
	@param {Object} api
	// @param {Object} MongoDBMod
*/
function User(params) {
	db =params.db;
	api =params.api;
	// MongoDBMod =params.MongoDBMod;
	
	self =this;
}

/**
@toc 2.
@method User.run
@param {Object} params
*/
User.prototype.run =function(params) {
	var deferred =Q.defer();
	
	describe('UserModule', function() {
		it("should test all user calls", function(done)
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
@toc 3.
@method before
@param {Object} params
*/
function before(params) {
	var deferred =Q.defer();

	var msg ='';
	//drop test user(s)
	var emails =[];
	var ii=0;
	for(ii =0; ii<TEST_USERS.length; ii++) {
		emails[ii] =TEST_USERS[ii].email;
	}
	db.user.remove({email: {$in:emails} }, function(err, numRemoved) {
		if(err) {
			msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1) {
			msg +="db.user.remove Num removed: "+numRemoved;
		}
		else {
			msg +="db.user.remove Removed "+numRemoved;
		}
		console.log('\nUser BEFORE: '+msg);
		
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
Do clean up to put database back to original state it was before ran tests (remove test user(s), etc.)
@toc 4.
@method after
@param {Object} params
*/
function after(params) {
	var deferred =Q.defer();
	var msg ='';
	//drop test user(s)
	var emails =[];
	var ii=0;
	for(ii =0; ii<TEST_USERS.length; ii++) {
		emails[ii] =TEST_USERS[ii].email;
	}
	db.user.remove({email: {$in:emails} }, function(err, numRemoved) {
		if(err) {
			msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1) {
			msg +="db.user.remove Num removed: "+numRemoved;
		}
		else {
			msg +="db.user.remove Removed "+numRemoved;
		}
		console.log('\nUser AFTER: '+msg);
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
	@method update
	@param {Object} opts
	*/
	var update =function(opts) {
		var params =
		{
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': testUser.authority_keys,
			user_id: testUser._id,
			first_name: 'user_newname'
		};
		api.expectRequest({method:'User.update'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data;
			read({'newFirstName':params.first_name});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 7.
	@method read
	@param {Object} opts
		@param {String} newFirstName The user's updated first name (will check it here to complete the 'update' test)
	*/
	var read =function(opts) {
		var params ={
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': testUser.authority_keys,
			_id: testUser._id
		};
		api.expectRequest({method:'User.read'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data;
			expect(data.result.result).toBeDefined();
			expect(data.result.result.first_name).toBe(opts.newFirstName);
			expect(data.result.result.last_name).toBe(testUser.last_name);
			
			search({});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 8.
	@method search
	@param {Object} opts
	*/
	var search =function(opts) {
		// it('should return all users with no search query entered', function() {
		var params ={
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': testUser.authority_keys
		};
		api.expectRequest({method:'User.search'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data;
			expect(data.result.results.length).toBe(TEST_USERS.length);
			
			// it('should return the matched set of users with a search', function() {
			var params ={
				searchString: 'jOe',		//should be case-insensitive
				searchFields: ['first_name']
			};
			api.expectRequest({method:'User.search'}, {data:params}, {}, {})
			.then(function(res) {
				var data =res.data;
				expect(data.result.results.length).toBe(1);
				
				var params ={
					searchString: 'test',
					searchFields: ['email']
				};
				api.expectRequest({method:'User.search'}, {data:params}, {}, {})
				.then(function(res) {
					var data =res.data;
					expect(data.result.results.length).toBe(2);
							
					delete1({});		//go to next function/test in sequence
				});
			});
		});
	};
	
	/**
	@toc 9.
	@method delete1
	@param {Object} opts
	*/
	var delete1 =function(opts) {
		var params ={};
		// it('should delete a user', function() {
		params ={
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': TEST_USERS[0].authority_keys,
			user_id: TEST_USERS[0]._id
		};
		api.expectRequest({method:'User.delete1'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data;
			
			params ={
			};
			api.expectRequest({method:'User.search'}, {data:params}, {}, {})
			.then(function(res) {
				var data =res.data;
				expect(data.result.results.length).toBe((TEST_USERS.length-1));		//should be 1 less now that deleted one
				
				// it('should delete multiple users', function() {
				params ={
					_ids: [TEST_USERS[1]._id, TEST_USERS[2]._id]
				};
				api.expectRequest({method:'User.delete1'}, {data:params}, {}, {})
				.then(function(res) {
					var data =res.data;
				
					params ={
					};
					
					/*
					reqObj =api.httpGo({method:'User.search'}, {data:params}, {});
					request(reqObj, function(error, response, data)
					{
						expect(error).toBeFalsy();
						if(!error) {
							expect(response.statusCode).toEqual(200);
							if(response.statusCode ==200) {
								data =api.parseData(data, {});
								expect(data.result.results.length).toBe((TEST_USERS.length-1-2));		//should be 1 less now that deleted one
								
								deferred.resolve({});
							}
						}
					});
					*/
					//new way that abstracts common request stuff & expect statements
					api.expectRequest({method:'User.search'}, {data:params}, {}, {})
					.then(function(res) {
						var data =res.data;
						expect(data.result.results.length).toBe((TEST_USERS.length-1-2));		//should be 1 less now that deleted one
						
						deferred.resolve({});
					});
					
				});
			
			});
		});
	};
	
	update({});		//start all the calls going
	
	return deferred.promise;
}