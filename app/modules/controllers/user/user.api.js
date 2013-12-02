/**
RPC user endpoints
@module user
@class userApi

@toc
1. rpcSearch
2. rpcRead
3. rpcUpdate
4. rpcDelete
*/

'use strict';

var lodash = require('lodash');
var inherits = require('util').inherits;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// var Base = require('./base');
// var Base = require('../../../routes/api/base.js');		//can't pass this in since it's used with inherits (which has to be outside the function definition??)
var Base =require(pathParts.routes+'api/base.js');

var UserMod = require(pathParts.controllers+'user/user.js');

var sampleUserReturn = {
	_id: "objectid",
	email: "string",
	first_name: "string",
	last_name: "string"
};

var defaults = {
	group: 'user',
	info: 'User API',
	namespace: 'User'
};

var db;

module.exports = UserApi;

/**
@param {Object} options
	@param {Object} db
	// @param {Object} Base
	// @param {Object} userMod
*/
function UserApi(options){
	this.opts = lodash.extend({}, defaults, options||{});
	Base.call(this, this.opts);
	
	db =this.opts.db;
	// this.userMod = this.opts.userMod;
}

inherits(UserApi, Base);

UserApi.prototype.getRpcMethods = function(){
	return {
		search: this.rpcSearch(),
		read: this.rpcRead(),
		update: this.rpcUpdate(),
		delete1: this.rpcDelete()
	};
};

/**
@toc 1.
@method rpcSearch
**/
UserApi.prototype.rpcSearch = function(){
	var self = this;

	return {
		info: 'Search users',
		params: {
			searchString: { type: 'string', info: "Text to search for" },
			searchFields: { type: 'array', info: "Fields to search searchString within, i.e. ['first_name', 'last_name']" },
			skipIds: { type: 'array', info: "_id fields to skip (will be added to query AFTER they are converted to mongo ids (if necessary))" },
			fields: { type: 'object', info: "Fields to return, i.e. {_id:1, first_name:1, last_name:1}" },
			skip: { type: 'number', info: "Where to start returning from (like a cursor), default =0" },
			limit: { type: 'number', info: "How many to return, default =20" }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =UserMod.search(db, params, {});
			promise.then(function(ret1) {
				// ret1.user =UserMod.readFilter(ret1.user, {type:'login'});		//only return certain fields (i.e strip out password)
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 2.
@method rpcRead
**/
UserApi.prototype.rpcRead = function(){
	var self = this;

	return {
		info: 'Read one or more users',
		params: {
			_id: { type: 'string', info: "Id for object to lookup. Will be converted to mongo object id if necessary." },
			_ids: { type: 'array', info: "Ids to look up object info on Will be converted to mongo object ids if necessary." },
			fullQuery: { type: 'object', info: "Full mongo query to use directly for read" },
			fields: { type: 'object', info: "Mongo query for which fields in the record to return. Use the empty object {} to get all fields." },
			query: { type: 'object', info: "Additional query for lookup (will be added to the id(s) query)." }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =UserMod.read(db, params, {});
			promise.then(function(ret1) {
				//strip out some fields (i.e. password)
				if(ret1.result !==undefined) {
					ret1.result =UserMod.readFilter(ret1.result, {type:'full'});		//only return certain fields (i.e strip out password)
				}
				else if(ret1.results !==undefined) {
					var ii;
					for(ii =0; ii<ret1.results.length; ii++) {
						ret1.results[ii] =UserMod.readFilter(ret1.results[ii], {type:'full'});		//only return certain fields (i.e strip out password)
					}
				}
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 3.
@method rpcUpdate
**/
UserApi.prototype.rpcUpdate = function(){
	var self = this;

	return {
		info: 'Update a user',
		params: {
			user_id: { type: 'string', info: "Id for user to update. Will be converted to mongo object id if necessary. All other parameters are optional and are the fields that will be updated" }
			// fields: { type: 'mixed', info: "The fields / data to update" }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =UserMod.update(db, params, {});
			promise.then(function(ret1) {
				// ret1.user =UserMod.readFilter(ret1.user, {type:'login'});		//only return certain fields (i.e strip out password)
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 4.
@method rpcDelete
**/
UserApi.prototype.rpcDelete = function(){
	var self = this;

	return {
		info: 'Removes one or more users',
		params: {
			user_id: { type: 'string', info: "Id for object to delete. Will be converted to mongo object id if necessary." },
			_ids: { type: 'array', info: "Ids of objects to delete. Will be converted to mongo object ids if necessary." }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =UserMod.delete1(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};