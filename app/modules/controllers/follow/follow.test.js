/**
Tests for all /api/follow endpoints

NOTE: "it" blocks with modularized/nested function and async code can be finicky - I don't think nested "it" blocks are allowed BUT need an outer "it" block to ensure the async code gets run (otherwise it will just complete immediately before running any tests). So if and when to use "done" for the it blocks and where to put them is sometimes hard to follow/trace. When in doubt, try an "it" block and if it errors or doesn't complete, try just putting an "expect" there directly - it's likely already in an "it" block..

@toc
public methods
1. Follow
2. Follow.run
private methods
3. before
4. after
5. go
	6. follow
	7. getFollowedUsers
	8. getUserFollowers
	9. searchFollowableUsers
	10. unfollow
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
		email: 'follow_test@example.com',
		first_name: 'follow_Joe',
		last_name: 'follow_Shmoe',
		password: 'test'
	},
	{
		email: 'follow_example@test.com',
		first_name: 'follow_Jane',
		last_name: 'follow_Doe',
		password: 'test'
	},
	{
		email: 'follow_foo@bar.com',
		first_name: 'follow_Foo',
		last_name: 'follow_Bar',
		password: 'test'
	},
	{
		email: 'follow_qwerty@asdf.com',
		first_name: 'follow_Mike',
		last_name: 'follow_Ike',
		password: 'test'
	},
	{
		email: 'follow_lala@hoho.com',
		first_name: 'follow_Bill',
		last_name: 'follow_Ted',
		password: 'test'
	}
];
var testUser =TEST_USERS[0];

module.exports = Follow;

/**
Main function/object (will be exported)
@toc 1.
@method Follow
@param {Object} params
	@param {Object} db
	@param {Object} api
	// @param {Object} MongoDBMod
*/
function Follow(params)
{
	db =params.db;
	api =params.api;
	// MongoDBMod =params.MongoDBMod;
	
	self =this;
}

/**
@toc 2.
@method Follow.run
@param {Object} params
*/
Follow.prototype.run =function(params)
{
	var deferred =Q.defer();
	
	describe('FollowModule', function()
	{
		it("should test all follow calls", function(done)
		{
			var promise =before({});
			promise.then(function(ret1)
			{
				done();
				deferred.resolve(ret1);
			}, function(err)
			{
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
function before(params)
{
	var deferred =Q.defer();
	var msg ='';
	
	//drop test user(s)
	var emails = [];
	var ii;
	for(ii = 0; ii < TEST_USERS.length; ii++)
	{
		emails.push(TEST_USERS[ii].email);
	}

	db.user.remove({'email': {'$in':emails} }, function(err, numRemoved)
	{
		if(err)
		{
			msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1) {
			msg +="db.user.remove Num removed: "+numRemoved;
		}
		else {
			msg +="db.user.remove Removed "+numRemoved;
		}
		console.log('\nFollow BEFORE: '+msg);
		
		//Populate db with test users
		async.forEach(TEST_USERS, function(user1, aCallback)
		{
			var reqObj =api.httpGo({method:'Auth.create'}, {data:user1}, {});
			request(reqObj, function(error, response, data)
			{
				data =api.parseData(data, {});
				user1._id =data.result.user._id;	//Save _id to TEST_USERS array
				user1.authority_keys = {'user_id': user1._id, 'sess_id': data.result.user.sess_id};
				aCallback(false);
			});
		}, function(err)
		{
			var promise =go({});
			promise.then(function(ret1)
			{
				var promiseAfter =after({});
				promiseAfter.then(function(retAfter)
				{
					deferred.resolve(ret1);
				}, function(err)
				{
					deferred.reject(err);
				});
				
				deferred.resolve(ret1);
			}, function(err)
			{
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
function after(params)
{
	var deferred =Q.defer();
	var msg ='';
	
	//drop test user(s)
	var emails = [];
	var ii;
	for(ii = 0; ii < TEST_USERS.length; ii++)
	{
		emails.push(TEST_USERS[ii].email);
	}
	db.user.remove({'email': {'$in':emails} }, function(err, numRemoved)
	{
		if(err)
		{
			msg +="db.user.remove Error: "+err;
		}
		else if(numRemoved <1)
		{
			msg +="db.user.remove Num removed: "+numRemoved;
		}
		else
		{
			msg +="db.user.remove Removed "+numRemoved;
		}
		console.log('\nFollow AFTER: '+msg);
		deferred.resolve({});
	});
	return deferred.promise;
}

/**
@toc 5.
@method go
@param {Object} params
*/
function go(params)
{
	var deferred =Q.defer();
	var reqObj;
	
	/**
	@toc 6.
	@method follow
	@param {Object} opts
	*/
	var follow =function(opts)
	{
		//Make user 0 follow users 1, 2, and 3. The rest of the follow tests assume this.
		var follow_params =
		{
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': TEST_USERS[0].authority_keys,
			'user_id': TEST_USERS[0]._id,
			'followed': [{'_id': TEST_USERS[1]._id}, {'_id': TEST_USERS[2]._id}, {'_id': TEST_USERS[3]._id}]
		};
		api.expectRequest({method:'Follow.follow'}, {'data':follow_params}, {}, {}).then(function(res)
		{
			//var data =res.data;
			//Nothing to expect here. Go to next test.
			getFollowedUsers({});
		});
	};
	
	/**
	@toc 7.
	@method getFollowedUsers
	@param {Object} opts
	*/
	var getFollowedUsers =function(opts)
	{
		var follow_params =
		{
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': TEST_USERS[0].authority_keys,
			'user_id': TEST_USERS[0]._id,
			'fields': {'_id': 1, 'email': 1}
		};
		
		api.expectRequest({method:'Follow.getFollowedUsers'}, {'data':follow_params}, {}, {}).then(function(res)
		{
			var data =res.data.result;
			expect(data.follower).toEqual(TEST_USERS[0]._id);
			expect(data.followed.length).toEqual(3);
			expect(data.followed[0].first_name).not.toBeDefined();		//We didn't ask for first_name
			expect(data.followed[0].email).toBeDefined();
			
			var emails = [data.followed[0].email, data.followed[1].email, data.followed[2].email];
			expect(emails.indexOf(TEST_USERS[1].email)).not.toEqual(-1);
			expect(emails.indexOf(TEST_USERS[2].email)).not.toEqual(-1);
			expect(emails.indexOf(TEST_USERS[3].email)).not.toEqual(-1);
			
			getUserFollowers({});	//Go to next test
		});
	};
	
	/**
	@toc 8.
	@method getUserFollowers
	@param {Object} opts
	*/
	var getUserFollowers =function(opts)
	{
		var follow_params =
		{
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': TEST_USERS[1].authority_keys,
			'user_id': TEST_USERS[1]._id,
			'fields': {'_id': 1, 'email': 1}
		};
		
		api.expectRequest({method:'Follow.getUserFollowers'}, {'data':follow_params}, {}, {}).then(function(res)
		{
			var data =res.data.result;
			expect(data.followed).toEqual(TEST_USERS[1]._id);
			expect(data.followers.length).toEqual(1);
			expect(data.followers[0].first_name).not.toBeDefined();		//We didn't ask for first_name
			expect(data.followers[0].email).toEqual(TEST_USERS[0].email);
			
			searchFollowableUsers({});	//Go to next test
		});
	};
	
	/**
	@toc 9.
	@method searchFollowableUsers
	@param {Object} opts
	*/
	var searchFollowableUsers =function(opts)
	{
		var follow_params =
		{
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': TEST_USERS[0].authority_keys,
			'user_id': TEST_USERS[0]._id,
			'searchString': 'follow',
			'searchFields': ['first_name']
		};
		
		api.expectRequest({method:'Follow.searchFollowableUsers'}, {'data':follow_params}, {}, {}).then(function(res)
		{
			var data =res.data.result;
			expect(data.results.length).toEqual(1);						//Only 1 unfollowed user
			expect(data.results[0]._id).toEqual(TEST_USERS[4]._id);
			
			unfollow({});	//Go to next test
		});
	};
	
	/**
	@toc 10.
	@method unfollow
	@param {Object} opts
	*/
	var unfollow =function(opts)
	{
		var follow_params =
		{
			'authorize': true,		//Tell security module to go through checks even though this is the test DB
			'authority_keys': TEST_USERS[0].authority_keys,
			'user_id': TEST_USERS[0]._id,
			'followed': [{'_id': TEST_USERS[1]._id}, {'_id': TEST_USERS[2]._id}]
		};
		
		api.expectRequest({method:'Follow.unfollow'}, {'data':follow_params}, {}, {}).then(function(res)
		{
			//Lookup followed users again. Only one should remain.
			var follow_params =
			{
				'user_id': TEST_USERS[0]._id,
				'fields': {'_id': 1, 'email': 1}
			};
			api.expectRequest({method:'Follow.getFollowedUsers'}, {'data':follow_params}, {}, {}).then(function(res)
			{
				var data =res.data.result;
				expect(data.followed.length).toEqual(1);
				expect(data.followed[0].email).toEqual(TEST_USERS[3].email);
				deferred.resolve({});	//Finished
			});
		});
	};
	
	follow();		//start all the calls going
	
	return deferred.promise;
}