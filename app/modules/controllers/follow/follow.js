/**
Handles user following

@module follow
@class follow

@toc
public methods
1. getUserFollowers
2. getFollowedUsers
3. follow
4. unfollow
5. searchFollowableUsers

private methods
*/

'use strict';

var crypto =require('crypto');
var moment = require('moment');
var Q = require('q');
var lodash = require('lodash');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var StringMod =require(pathParts.services+'string/string.js');
var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');
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
	// @param {Object} userMod
	// @param {Object} AuthMod
	// @param {Object} StringMod
	// @param {Object} MongoDBMod
*/
function Follow(options)
{
	this.opts = lodash.merge({}, defaults, options||{});
	self = this;
}

/**
Gets a user's followers
@toc 1.
@method getUserFollowers
@param {Object} data
	@param {String} user_id Followed user's _id
	@param {Object} [fields = {'_id': 1}] Mongo fields query. Specifies what information to return for each follower.
@param {Object} params
@return {Promise}
	@param {String} followed Followed user's _id
	@param {Array} followers Array of followers of the given user. Each follower object has fields as determined by the 'fields' parameter.
**/
Follow.prototype.getUserFollowers = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Follow.getUserFollowers ', 'followers': [], 'followed': data.user_id};
	var ii;
	
	var defaults =
	{
		'fields':{'_id':1}
	};
	
	if(data.fields === undefined)
	{
		data.fields = defaults.fields;
	}
	
	//Find users with a 'follow' array that includes the given user's id.
	db.user.find({'follow': { '$elemMatch': { 'user_id': data.user_id } } }, data.fields).toArray(function(err, followers)
	{
		if(err)
		{
			ret.code = 1;
			ret.msg += 'Error finding followers';
			deferred.reject(ret);
		}
		else
		{
			ret.code = 0;
			for(ii = 0; ii < followers.length; ii++)
			{
				followers[ii] = UserMod.readFilter(followers[ii], {type:'full'});	//Cut out password fields if present
			}
			ret.followers = followers;
			deferred.resolve(ret);
		}
	});

	return deferred.promise;
};

/**
Get all users that a given user is following
@toc 2.
@method getFollowedUsers
@param {Object} data
	@param {String} user_id Follower user's _id
	@param {Object} [fields = {'_id': 1}] Mongo fields query. Specifies what information to return for each followed user.
@param {Object} params
@return {Promise}
	@param {String} follower Follower user's _id
	@param {Array} followed Array of followed users of the given user. Each followed object has fields as determined by the 'fields' parameter.
**/
Follow.prototype.getFollowedUsers = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Follow.getFollowedUsers ', 'follower': data.user_id, 'followed': []};
	var ii;
	var defaults =
	{
		'fields':{'_id':1}
	};
	
	var basic_only = false;
	if(data.fields === undefined)
	{
		data.fields = defaults.fields;
		basic_only = true;			//Flags that we're only returning the _id's. This means we can skip a bunch of logic later.
	}
	
	db.user.findOne({_id:MongoDBMod.makeIds({'id':data.user_id}) }, function(err, user)
	{
		if(err)
		{
			ret.code = 1;
			ret.msg += 'Error, could not find follower user';
			deferred.reject(ret);
		}
		else if(user.follow === undefined || user.follow.length < 1)	//If no followed users, we're done
		{
			deferred.resolve(ret);
		}
		else if(basic_only === true)
		{
			for(ii = 0; ii < user.follow.length; ii++)
			{
				ret.followed.push({'_id': user.follow[ii].user_id, 'timestamp': user.follow[ii].timestamp});
			}
			deferred.resolve(ret);
		}
		else
		{
			//Form array of followed user _ids
			var followed_ids = [];
			for(ii = 0; ii < user.follow.length; ii++)
			{
				followed_ids.push(user.follow[ii].user_id);
			}
			
			var read_data =
			{
				'_ids': followed_ids,
				'fields': data.fields
			};
			
			var read_promise = UserMod.read(db, read_data, params);
			read_promise.then(function(ret1)
			{
				ret.msg += ret1.msg;
				ret.code = 0;
				for(ii = 0; ii < ret1.results.length; ii++)
				{
					ret1.results[ii] = UserMod.readFilter(ret1.results[ii], {type:'full'});	//Cut out password fields if present
				}
				ret.followed = ret1.results;
				deferred.resolve(ret);
			}, function(err)
			{
				ret.msg += err.msg;
				ret.code = 1;
				deferred.reject(ret);
			});
		}
	});
	
	return deferred.promise;
};

/**
Cause a user to follow another user(s). If the user is already following, the timestamp will be updated.
@toc 3.
@method follow
@param {Object} data
	@param {String} user_id The id of the follower user
	@param {Array} followed Array of users to follow. Each entry should have an '_id' field.
@param {Object} params
@return {Promise}
**/
Follow.prototype.follow = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Follow.follow '};
	var obj_id = MongoDBMod.makeIds({'id': data.user_id});
	db.user.findOne({'_id': obj_id }, function(err, user)
	{
		if(err)
		{
			ret.msg += 'Error: '+err;
			deferred.reject(ret);
		}
		else if(!user)
		{
			ret.msg +='Invalid user ';
			deferred.reject(ret);
		}
		else
		{
			var timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			
			if(user.follow === undefined)
			{
				user.follow = [];
			}
			
			//Add to followed users array. Don't add an _id that's already there. Don't even assume that the given array has no duplicates.
			//If the _id is already there, consider this an update for the timestamp.
			var ii;
			for(ii = 0; ii < data.followed.length; ii++)
			{
				var jj;
				var found = false;
				for(jj = 0; jj < user.follow.length; jj++)
				{
					if(data.followed[ii]._id == user.follow[jj].user_id)
					{
						found = true;
						//Update timestamp
						user.follow[jj].timestamp = timestamp;
						jj = user.follow.length;	//Stop looping
					}
				}
				if(found === false)
				{
					user.follow.push({'user_id': data.followed[ii]._id, 'timestamp': timestamp});
				}
			}
			
			//Now user.follow is updated. Save it to the database.
			db.user.update({'_id': obj_id }, {'$set': {'follow': user.follow} }, {'safe': true}, function(err2, user_new)
			{
				if(err)
				{
					ret.msg += 'Error: ' + err2;
					ret.code = 1;
					deferred.reject(ret);
				}
				else
				{
					ret.code = 0;
					deferred.resolve(ret);
				}
			});
		}
	});
	
	return deferred.promise;
};

/**
Cause a user to stop following another user(s)
@toc 3.
@method unfollow
@param {Object} data
	@param {String} user_id The id of the follower user
	@param {Array} followed Array of users to unfollow. Each entry should have an '_id' field.
@param {Object} params
@return {Promise}
**/
Follow.prototype.unfollow = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Follow.unfollow '};
	var obj_id = MongoDBMod.makeIds({'id': data.user_id});
	
	db.user.findOne({'_id': obj_id }, function(err, user)
	{
		if(err)
		{
			ret.msg += 'Error: '+err;
			deferred.reject(ret);
		}
		else if(!user)
		{
			ret.msg +='Invalid user ';
			deferred.reject(ret);
		}
		else if(user.follow === undefined || user.follow.length < 1)	//Nothing to unfollow, we're done
		{
			ret.code = 0;
			ret.msg += 'No users currently followed ';
			deferred.resolve(ret);
		}
		else
		{
			//Remove from followed users array.
			var ii;
			for(ii = 0; ii < data.followed.length; ii++)
			{
				var jj;
				for(jj = 0; jj < user.follow.length; jj++)
				{
					if(data.followed[ii]._id == user.follow[jj].user_id)
					{
						user.follow.splice(jj, 1);
						jj = user.follow.length;	//Stop looping
					}
				}
			}
			
			//Now user.follow is updated. Save it to the database.
			db.user.update({'_id': obj_id }, {'$set': {'follow': user.follow} }, {'safe': true}, function(err2, user_new)
			{
				if(err)
				{
					ret.msg += 'Error: ' + err2;
					ret.code = 1;
					deferred.reject(ret);
				}
				else
				{
					ret.code = 0;
					deferred.resolve(ret);
				}
			});
		}
	});
	
	return deferred.promise;
};

/**
Search users. Filter out users that are already followed.
@toc 3.
@method searchFollowableUsers
@param {Object} data
	@param {String} user_id The id of the follower user
	@param {String} [searchString] Text to search for
	@param {Array} [searchFields =['first_name', 'last_name']] Fields to search searchString within
		@example ['first_name', 'last_name']
	@param {Array} [skipIds] _id fields to skip (will be added to query AFTER they are converted to mongo ids (if necessary))
		@example ['324234', '328sakd23', '23lkjafl83']
	@param {Object} [fields ={_id:1, first_name:1, last_name:1}] Fields to return
		@example {_id:1, first_name:1, last_name:1}
	@param {Number} [skip =0] Where to start returning from (like a cursor)
	@param {Number} [limit =20] How many to return
@param {Object} params
@return {Promise}
**/
Follow.prototype.searchFollowableUsers = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'Follow.searchFollowableUsers ', 'results': []};
	var obj_id = MongoDBMod.makeIds({'id': data.user_id});
	var ii;
	
	db.user.findOne({'_id': obj_id }, function(err, user)
	{
		if(err)
		{
			ret.code = 1;
			ret.msg += 'Error: '+err;
			deferred.reject(ret);
		}
		else if(!user)
		{
			ret.code = 1;
			ret.msg +='Invalid user ';
			deferred.reject(ret);
		}
		else
		{
			if(data.skipIds === undefined)
			{
				data.skipIds = [];
			}
			if(user.follow !== undefined && user.follow.length > 0)
			{
				for(ii = 0; ii < user.follow.length; ii++)
				{
					data.skipIds.push(user.follow[ii].user_id);
				}
			}
			
			data.skipIds.push(data.user_id);
			
			var search_promise = UserMod.search(db, data, params);
			search_promise.then(
				function(ret1)
				{
					ret.code = 0;
					ret.results = ret1.results;
					deferred.resolve(ret);
				},
				function(ret1)
				{
					ret.code = 1;
					deferred.reject(ret);
				}
			);
		}
	});
	
	return deferred.promise;
};


module.exports = new Follow({});