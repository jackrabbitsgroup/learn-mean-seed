/**
RPC follow endpoints
@module follow
@class FollowApi

@toc
1. rpcGetUserFollowers
2. rpcGetFollowedUsers
3. rpcFollow
4. rpcUnfollow
5. rpcSearchFollowableUsers
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

var AuthMod = require(pathParts.controllers+'auth/auth.js');
var UserMod = require(pathParts.controllers+'user/user.js');
var FollowMod = require(pathParts.controllers+'follow/follow.js');

var defaults = {
	group: 'follow',
	info: 'Follow API',
	namespace: 'Follow'
};

// var self;
var db;

module.exports = FollowApi;

/**
@param {Object} options
	@param {Object} db
	// @param {Object} Base
	// @param {Object} authMod
	// @param {Object} userMod
	// @param {Object} followMod
*/
function FollowApi(options){
	this.opts = lodash.merge({}, defaults, options||{});
	// Base =this.opts.Base;
	Base.call(this, this.opts);

	db =this.opts.db;
	// this.authMod = this.opts.authMod;
	// this.userMod =this.opts.userMod;
	// self =this;
}

inherits(FollowApi, Base);

FollowApi.prototype.getRpcMethods = function(){
	return {
		getUserFollowers: this.rpcGetUserFollowers(),
		getFollowedUsers: this.rpcGetFollowedUsers(),
		follow: this.rpcFollow(),
		unfollow: this.rpcUnfollow(),
		searchFollowableUsers: this.rpcSearchFollowableUsers()
	};
};

/**
Returns RPC schema object for Follow.getUserFollowers
@toc 1.
@method rpcGetUserFollowers
**/
FollowApi.prototype.rpcGetUserFollowers = function(){
	var self = this;

	return {
		info: 'Get all followers of a given user',
		params:
		{
			user_id: { required: true, type: 'string', info: "Followed user's _id" },
			fields: { type: 'object', info: "Mongo fields query. Specifies what information to return for each follower. Default: {'_id': 1}" }
		},
		returns:
		{
			followed: 'object_id',
			followers: [{'_id': 'object_id'}, {'_id': 'object_id'}]
		},
		/**
		Gets a user's followers
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise = FollowMod.getUserFollowers(db, params, {});
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
Returns RPC schema object for Follow.getFollowedUsers
@toc 2.
@method rpcGetFollowedUsers
**/
FollowApi.prototype.rpcGetFollowedUsers = function()
{
	var self = this;

	return {
		info: 'Get all users that a given user is following',
		params:
		{
			user_id: { required: true, type: 'string', info: "Follower user's _id" },
			fields: { type: 'object', info: "Mongo fields query. Specifies what information to return for each followed. Default: {'_id': 1}" }
		},
		returns:
		{
			follower: 'object_id',
			followed: [{'_id': 'object_id'}, {'_id': 'object_id'}]
		},
		/**
		Gets followed users
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out)
		{
			var promise =FollowMod.getFollowedUsers(db, params, {});
			promise.then(function(ret1)
			{
				out.win(ret1);
			}, function(err)
			{
				self.handleError(out, err, {});
			});
		}
	};
};

/**
Returns RPC schema object for Follow.follow
@toc 3.
@method rpcFollow
**/
FollowApi.prototype.rpcFollow = function()
{
	var self = this;

	return {
		info: 'Cause a user to follow another user(s)',
		params:
		{
			user_id: { required: true, type: 'string', info: "Follower user's _id" },
			followed:	{ required: true, type: 'array', info: "Array of users to follow. Each entry should have an '_id' field." }
		},
		returns:
		{
		},
		/**
		Makes one user follow another user(s).
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =FollowMod.follow(db, params, {});
			promise.then(function(ret1)
			{
				out.win(ret1);
			}, function(err)
			{
				// self.handleError(out.fail);
				self.handleError(out, err, {});
			});
		}
	};
};

/**
Returns RPC schema object for Follow.unfollow
@toc 4.
@method rpcUnfollow
**/
FollowApi.prototype.rpcUnfollow = function()
{
	var self = this;

	return {
		info: 'Cause a user to stop following another user(s)',
		params:
		{
			user_id: { required: true, type: 'string', info: "Follower user's _id" },
			followed:	{ required: true, type: 'array', info: "Array of users to unfollow. Each entry should have an '_id' field." }
		},
		returns:
		{
		},
		/**
		Stop following a user
		@method method
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =FollowMod.unfollow(db, params, {});
			promise.then(function(ret1)
			{
				out.win(ret1);
			}, function(err)
			{
				self.handleError(out, err, {});
			});
		}
	};
};

/**
Returns RPC schema object for Follow.searchFollowableUsers
@toc 5.
@method rpcSearchFollowableUsers
**/
FollowApi.prototype.rpcSearchFollowableUsers = function()
{
	var self = this;

	return {
		info: 'Search users. Filter out already followed users.',
		params:
		{
			user_id: { required: true, type: 'string', info: "Follower user's _id" },
			searchString: { type: 'string', info: "Text to search for" },
			searchFields: { type: 'array', info: "Fields to search searchString within, i.e. ['first_name', 'last_name']" },
			skipIds: { type: 'array', info: "_id fields to skip (will be added to query AFTER they are converted to mongo ids (if necessary))" },
			fields: { type: 'object', info: "Fields to return, i.e. {_id:1, first_name:1, last_name:1}" },
			skip: { type: 'number', info: "Where to start returning from (like a cursor), default =0" },
			limit: { type: 'number', info: "How many to return, default =20" }
		},
		returns:
		{
			'results': "Array of user objects"
		},
		/**
		Search users. Filter out already followed users.
		@method method
		@method action
		@param {Object} params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =FollowMod.searchFollowableUsers(db, params, {});
			promise.then(function(ret1)
			{
				out.win(ret1);
			}, function(err)
			{
				self.handleError(out, err, {});
			});
		}
	};
};