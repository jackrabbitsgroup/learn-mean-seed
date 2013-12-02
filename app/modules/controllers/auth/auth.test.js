/**
Tests for all /api/auth endpoints

NOTE: "it" blocks with modularized/nested function and async code can be finicky - I don't think nested "it" blocks are allowed BUT need an outer "it" block to ensure the async code gets run (otherwise it will just complete immediately before running any tests). So if and when to use "done" for the it blocks and where to put them is sometimes hard to follow/trace. When in doubt, try an "it" block and if it errors or doesn't complete, try just putting an "expect" there directly - it's likely already in an "it" block..

@toc
public methods
1. Auth
2. Auth.run
private methods
3. before
4. after
5. go
	6. create
	7. checkLogin
	8. logout
	9. login
	10. forgotPassword
	11. resetPassword
	12. changePassword
	13. socialLogin
*/

'use strict';

var https = require("https");
var request = require('request');
// var async = require('async');
var lodash = require('lodash');
var Q = require('q');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var self, db, api;

//NOTE: make sure to namespace all values to ensure no conflicts with other modules that run asynchronously and may be altering the same users / data otherwise - leading to odd and very hard to debug errors..
var TEST_USERS =[
	{
		email: 'auth_test@example.com',
		first_name: 'auth_Joe',
		last_name: 'auth_Shmoe',
		password: 'auth_test'
	},
	{
		email: 'auth_example@test.com',
		first_name: 'auth_Jane',
		last_name: 'auth_Doe',
		password: 'auth_test'
	},
	{
		email: 'auth_foo@bar.com',
		first_name: 'auth_Foo',
		last_name: 'auth_Bar',
		password: 'auth_test'
	},
	{
		email: 'auth_qwerty@asdf.com',
		first_name: 'auth_Mike',
		last_name: 'auth_Ike',
		password: 'auth_test'
	},
	{
		email: 'auth_lala@hoho.com',
		first_name: 'auth_Bill',
		last_name: 'auth_Ted',
		password: 'auth_test'
	}
];
var testUser =TEST_USERS[0];
var testUser1 =TEST_USERS[1];

module.exports = Auth;

/**
Main function/object (will be exported)
@toc 1.
@method Auth
@param {Object} params
	@param {Object} db
	@param {Object} api
	// @param {Object} MongoDBMod
*/
function Auth(params) {
	db =params.db;
	api =params.api;
	// MongoDBMod =params.MongoDBMod;
	
	self =this;
}

/**
@toc 2.
@method Auth.run
@param {Object} params
*/
Auth.prototype.run =function(params) {
	var deferred =Q.defer();
	
	describe('AuthModule', function() {
		it("should test all auth calls", function(done)
		{
			var promise =before({});
			promise.then(function(ret1) {
				// console.log('before');
				// expect('authModuleBefore').toBe(true);
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
	
	// describe('AuthModuleBefore', function() {
	// it("should do AuthModBefore", function(done) {

	var msg ='';
	//drop test user(s)
	db.user.remove({email: {$in:[testUser.email, testUser1.email]} }, function(err, numRemoved) {
		if(err) {
			msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1) {
			msg +="db.user.remove Num removed: "+numRemoved;
		}
		else {
			msg +="db.user.remove Removed "+numRemoved;
		}
		console.log('\nAuth BEFORE: '+msg);
		
		// done();
		// deferred.resolve({});
		
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

	// });
	// });
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
	db.user.remove({email: {$in:[testUser.email, testUser1.email]} }, function(err, numRemoved) {
		if(err) {
			msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1) {
			msg +="db.user.remove Num removed: "+numRemoved;
		}
		else {
			msg +="db.user.remove Removed "+numRemoved;
		}
		console.log('\nAuth AFTER: '+msg);
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
	@method create
	@param {Object} opts
	*/
	var create =function(opts) {
		describe('auth create', function() {
			// it('should run AuthModule go', function(done) {
			// done();
			var params = lodash.clone(testUser);
			// test that email is cast to lower case on save
			params.email = params.email.toUpperCase();

			api.expectRequest({method:'Auth.create'}, {data:params}, {}, {})
			.then(function(res) {
				var data =res.data;
				
				expect(data.result.user).toBeDefined();
				expect(data.result.user.first_name).toBe(params.first_name);
				expect(data.result.user.email).toBe(params.email.toLowerCase());
				checkLogin({'user':data.result.user});		//go to next function/test in sequence
				// done();
				// deferred.resolve({});
				// });
				// });
			});
					
			// deferred.resolve({});
			// });
		});
	};
	
	/**
	@toc 7.
	@method checkLogin
	@param {Object} opts
		@param {Object} user
			@param {String} _id
			@param {String} sess_id
	*/
	var checkLogin =function(opts) {
		api.expectRequest({method:'Auth.active'}, {data:{'user_id':opts.user._id, 'sess_id':opts.user.sess_id}}, {}, {})
		.then(function(res) {
			var data =res.data;
			expect(data.result.user).toBeDefined();
			expect(data.result.user.first_name).toBe(opts.user.first_name);
			expect(data.result.user.email).toBe(opts.user.email.toLowerCase());
			logout({'user':data.result.user});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 8.
	@method logout
	@param {Object} opts
		@param {Object} user
			@param {String} _id
	*/
	var logout =function(opts) {
		api.expectRequest({method:'Auth.logout'}, {data:{'user_id':opts.user._id}}, {}, {})
		.then(function(res) {
			var data =res.data;
			login({'user':opts.user});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 9.
	@method login
	@param {Object} opts
		@param {Object} user
			@param {String} _id
	*/
	var login =function(opts) {
		var params = lodash.clone(testUser);
		api.expectRequest({method:'Auth.login'}, {data:params}, {}, {})
		.then(function(res) {
			var data =res.data;
			expect(data.result.user).toBeDefined();
			expect(data.result.user._id).toBe(opts.user._id);
			forgotPassword({});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 10.
	@method forgotPassword
	@param {Object} opts
		// @param {Object} user
			// @param {String} _id
	*/
	var forgotPassword =function(opts) {
		api.expectRequest({method:'Auth.forgotPassword'}, {data:{email:testUser.email} }, {}, {})
		.then(function(res) {
			var data =res.data;
			expect(data.result).toBeDefined();
			resetPassword({});		//go to next function/test in sequence
		});
	};
	
	/**
	@toc 11.
	@method resetPassword
	@param {Object} opts
		// @param {Object} user
			// @param {String} _id
	*/
	var resetPassword =function(opts) {
		db.user.findOne({email: testUser.email}, function(err, user) {
			expect(err).toBeFalsy();
			expect(user).toBeDefined();
			var params ={
				email: testUser.email,
				reset_key: user.password_reset_key,
				password: 'auth_newpass'
			};
			var userId =MongoDBMod.idsToString({'id':user._id});
			// var userId =user._id;
			api.expectRequest({method:'Auth.resetPassword'}, {data:params }, {}, {})
			.then(function(res) {
				var data =res.data;
				expect(data.result.user).toBeDefined();
				expect(data.result.user._id).toBe(userId);
				
				//test login with new password
				api.expectRequest({method:'Auth.login'}, {data:{email:testUser.email, password:params.password} }, {}, {})
				.then(function(res) {
					var data =res.data;
					expect(data.result.user).toBeDefined();
					expect(data.result.user._id).toBe(userId);
					
					user.password =params.password;
					changePassword({user: user});
				});
			});
		});
	};
	
	/**
	@toc 12.
	@method changePassword
	@param {Object} opts
		@param {Object} user
			@param {String} _id
			@param {String} password
	*/
	var changePassword =function(opts) {
		var userId =MongoDBMod.idsToString({'id':opts.user._id});
		var params ={
			user_id: userId,
			current_password:opts.user.password,
			new_password: 'auth_changepass'
		};
		
		api.expectRequest({method:'Auth.changePassword'}, {data:params }, {}, {})
		.then(function(res) {
			var data =res.data;
			// expect(data.result.user).toBeDefined();
			// expect(data.result.user._id).toBe(userId);
			
			//test login with new password
			api.expectRequest({method:'Auth.login'}, {data:{email:testUser.email, password:params.new_password} }, {}, {})
			.then(function(res) {
				var data =res.data;
				expect(data.result.user).toBeDefined();
				expect(data.result.user._id).toBe(userId);

				socialLogin();
			});
		});
	};
	
	var socialLogin =function()
	{
		var params =
		{
			'user': testUser1,
			'socialData': {
				'token':'blahblah'
			},
			'type': 'test_type'
		};
		api.expectRequest({method:'Auth.socialLogin'}, {data:params }, {}, {})
		.then(function(res)
		{
			var data =res.data.result;
			expect(data.already_exists).toEqual(false);
			expect(data.user.social.test_type).toBeDefined();
			expect(data.user.social.test_type).toEqual(params.socialData);
			deferred.resolve();
		});
	};
	
	create({});		//start all the calls going
	
	return deferred.promise;
}