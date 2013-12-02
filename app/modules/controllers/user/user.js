/**
NOTE: search for 'site-specific' in this file to see the site-specific stuff in here (i.e. for fillInfo for adding in other data to the user object for one time / initial returns for performance reasons).

User module representing the end-users of the system
@module user
@class user

@toc
1. readFilter
1.5. fillInfo		//site-specific
1.52.fillFollow
2. search
3. update
4. delete1
5. read
6. searchByEmail
7. searchByPhone
9. fixPhoneFormat
*/

'use strict';

var Q = require('q');
var lodash = require('lodash');
var async = require('async');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var StringMod =require(pathParts.services+'string/string.js');
var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');
var CrudMod =require(pathParts.services+'crud/crud.js');
var LookupMod =require(pathParts.services+'lookup/lookup.js');

// var TextMod =require(pathParts.services+'texter/index.js');		//TESTING SMS

var self;

var defaults = {
    // searchFields: ['email', 'first_name', 'last_name'],
    // sort: {
        // first_name: 1,
        // last_name:  1
    // },
    // page: {
        // skip:       0,
        // limit:      25,
        // maxLimit:   51
    // },
    // resetTokenLength: 6,
    // resetTokenChars: 'alphanumeric'
};

var readFilter = {
    'public': {
		'include':['_id', 'email', 'first_name', 'last_name', 'phone']
	},
	'login': {
		'include':['_id', 'email', 'first_name', 'last_name', 'sess_id', 'phone']
	},
	'full': {
		'omit':['password', 'password_reset_key', 'password_salt']
	}
};

/**
User module constructor
@class User
@constructor
@param options {Object} constructor options
**/
function User(options){
    this.opts = lodash.merge({}, defaults, options||{});

	self = this;
}

/**
@toc 1.
@method readFilter
@param {Object} userData user data to filter
@param {Object} params
	@param {String} [type ='public'] Corresponds to readFilter keys (i.e. 'public')
@return {Object} The new user data object, now with just the appropriate fields
*/
User.prototype.readFilter =function(userData, params) {
	var defaults ={
		type:'public'
	};
	params =lodash.extend({}, defaults, params);
	var ii;
	var newObj ={};		//will hold the final, filtered fields
	if(readFilter[params.type].include !==undefined) {
		for(ii =0; ii<readFilter[params.type].include.length; ii++) {
			if(userData[readFilter[params.type].include[ii]] !==undefined) {
				newObj[readFilter[params.type].include[ii]] =userData[readFilter[params.type].include[ii]];
			}
		}
	}
	else if(readFilter[params.type].omit !==undefined) {
		userData._id =userData._id.toString();		//ensure string first, otherwise deep clone copies the other formats
		newObj =lodash.cloneDeep(userData);
		for(ii =0; ii<readFilter[params.type].omit.length; ii++) {
			if(userData[readFilter[params.type].omit[ii]] !==undefined) {
				delete newObj[readFilter[params.type].omit[ii]];
			}
		}
	}
	return newObj;
};

/**
@toc 1.5.
@method fillInfo
@param {Object} data
	@param {Object} user User object to add info to.
	@param {Object} fields Has keys specifying which fields in the user object to add info to. Leave a key undefined to skip that field.
@param {Object} params
@return {Promise}
	@param {Ojbect} ret
		@param {user} The new user data object, now with additional information filled in.
*/
User.prototype.fillInfo =function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.fillInfo ', user: data.user };
	
	if(data.fields === undefined)
	{
		data.fields = {};
	}
	
	async.forEach(Object.keys(data.fields),
		function(key, callback)
		{
			var promise;
			//put if conditions to match keys here
			if(key == 'follow')
			{
				promise = fillFollow(db, data, params);
				promise.then(
					function(ret1)
					{
						ret.user.follow = ret1.follow;
						callback(false);
					},
					function(ret1)
					{
						callback(true);
					}
				);
			}
			else
			{
				ret.msg += "Unmatched key: " + key;
				callback(false);
			}
		},
		function(err)
		{
			if(err)
			{
				deferred.reject(ret);
			}
			else
			{
				deferred.resolve(ret);
			}
		}
	);
	
	return deferred.promise;
};

/**
@toc 1.52.
@method fillFollow
@param {Object} data
	@param {Object} user User object to add info to.
	@param {Object} fields Has keys specifying which fields in the user object to add info to. Leave a key undefined to skip that field.
		@param {Object} follow A mongoDB fields object specifying what user fields to look up for each followed user.
@param {Object} params
@return {Promise}
	@param {Ojbect} ret
		@param {follow} The new follow data object, now with additional information filled in.
*/
function fillFollow(db, data, params)
{
	var FollowMod =require(pathParts.controllers+'follow/follow.js');	//Cannot require at the top of the file (circular dependency)
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.fillFollow ', 'follow': data.user.follow};
	
	var follow_params =
	{
		'user_id': data.user._id,
		'fields': data.fields.follow
	};
	
	var follow_promise = FollowMod.getFollowedUsers(db, follow_params, params);
	follow_promise.then(
		function(ret1)
		{
			ret.follow = ret1.followed;
			deferred.resolve(ret);
		},
		function(ret1)
		{
			ret.msg += ret1.msg;
			deferred.reject(ret);
		}
	);
	
	return deferred.promise;
}

/**
@toc 2.
@method search
@param {Object} data
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
	@param {Object} user
**/
User.prototype.search = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.search '};

	var defaults ={
		'limit':20,
		'fields':{'_id':1, 'first_name':1, 'last_name':1},
		'searchFields':['first_name', 'last_name']
	};
	if(data.fields ===undefined) {
		data.fields = defaults.fields;
	}
	if(data.limit ===undefined) {
		data.limit = defaults.limit;
	}
	if(data.searchFields ===undefined) {
		data.searchFields = defaults.searchFields;
	}

	var query ={};
	var ppSend =CrudMod.setSearchParams(data, query, {});
	
	//if search query has a space in it and have first_name and/or last_name as search fields, replace those with just the first word for first_name and last word(s) for last_name to make a more specific search (i.e. do NOT want to search for a first_name of 'joe bob' and a last_name of 'joe bob' (which will likely return no results) - really want to search for first_name of 'joe' and last_name of 'bob')
	if(data.searchString !==undefined) {
		var indexSpace =data.searchString.indexOf(' ');
		if(indexSpace >-1) {
			var firstName =data.searchString.slice(0, indexSpace);
			var lastName =data.searchString.slice((indexSpace+1), data.searchString.length);
			var ii, xx;
			for(ii =0; ii<ppSend.query.$or.length; ii++) {
				for(xx in ppSend.query.$or[ii]) {
					if(xx =='first_name') {
						if(ppSend.query.$or[ii][xx].$regex !==undefined) {
							ppSend.query.$or[ii][xx].$regex =firstName;
						}
					}
					else if(xx =='last_name') {
						if(ppSend.query.$or[ii][xx].$regex !==undefined) {
							ppSend.query.$or[ii][xx].$regex =lastName;
						}
					}
				}
			}
		}
	}
	
	LookupMod.search(db, 'user', ppSend, function(err, retArray1) {
		deferred.resolve(retArray1);
	});

	return deferred.promise;
};

/**
Updates a user's info
@todo Switch to use CrudMod.save?
@toc 3.
@method update
@param {Object} data
	@param {String} user_id Id of user to update. Other fields are optional and are used for the update
@param {Object} params
@return {Promise}
	@param {Object} user
**/
User.prototype.update = function(db, data, params)
{
	var AuthMod =require(pathParts.controllers+'auth/auth.js');
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.update '};

	var _id =data.user_id;
	delete data.user_id;
	data = AuthMod.formatAlternateContact(data, {});
	ret.user = data;
	delete data._id;			//can't $set _id
	
	data =self.fixPhoneFormat(db, data, params);
	
	db.user.update({_id:MongoDBMod.makeIds({'id':_id}) }, {$set: data}, function(err, valid)
	{
		if(err) {
			ret.msg +='Error: '+err;
			deferred.reject(ret);
		}
		else if (!valid) {
			ret.msg +='Not valid ';
			deferred.reject(ret);
		}
		else {
			ret.msg ='User updated';
			deferred.resolve(ret);
		}
	});

	return deferred.promise;
};

/**
Remove one or more users
@toc 4.
@method delete1
@param {Object} data
	@param {String} [user_id] Id of user to delete. one of '_id' or '_ids' is required
	@param {Array} [_ids] Ids of users to delete (will be converted to mongo object ids if necessary). one of '_id' or '_ids' is required
@param {Object} params
@return {Promise}
	@param {Object} user
**/
User.prototype.delete1 = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.delete1 '};

	data._id = data.user_id;
	delete data.user_id;
	
	var ppSend ={
		'collection':'user'
	};
	CrudMod.delete1(db, data, ppSend, function(ret1) {
		deferred.resolve(ret1);
	});

	return deferred.promise;
};

/**
Reads one or more users
@toc 5.
@method read
@param {Object} data One of '_id' or '_ids' or 'fullQuery' is required
	@param {String} [_id] Id for object to lookup. Will be converted to mongo object id if necessary.
	@param {Array} [_ids] Ids to look up object info on Will be converted to mongo object ids if necessary.
	@param {Object} [fullQuery] Full mongo query to use directly for read
	@param {Array} [fields ={'_id':1, 'first_name':1, 'last_name':1}] Mongo query for which fields in the record to return. Use the empty object {} to get all fields.
		@example {'_id':1, 'first_name':1, 'last_name':1}
	@param {Object} [query] Additional query for lookup (will be added to the id(s) query).
@param {Object} params
@return {Promise}
	@param {Object} user (or users)
**/
User.prototype.read = function(db, data, params) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.read '};

	var ppSend = {
		'collection':'user'
	};
	if(data._ids !==undefined) {		//for bulk read, return less info
		ppSend.defaults = {
			'fields':{'_id':1, 'first_name':1, 'last_name':1}
		};
	}
	else if(data.fields !== undefined)
	{
		ppSend.defaults =
		{
			'fields': data.fields
		};
	}
	else
	{
		ppSend.defaults =
		{
			'fields':{}
		};
	}
	CrudMod.read(db, data, ppSend, function(err, ret1) {
		/*
		//TESTING SMS
		if(ret1.result && ret1.result.phone) {
			TextMod.send({textParams: {to: ret1.result.phone.number, text:'Test Text!'} });
		}
		//end: TESTING SMS
		*/
	
		deferred.resolve(ret1);
	});

	return deferred.promise;
};

/**
Check for a user's existence based on a given email.
@toc 6.
@method read
@param {Object} data
	@param {String} email The email to search for.
	@param {Array} [fields = {}] Mongo query for which fields in the record to return. Default is everything.
		@example {'_id':1, 'first_name':1, 'last_name':1}
@param {Object} params
@return {Promise}
	@param {Object} ret
		@param {Boolean} exists True iff the user already exists.
		@param (Object} user The user object, if it exists. 
**/
User.prototype.searchByEmail = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.searchByEmail ', 'exists': false, 'user': {} };
	
	if(data.fields === undefined)
	{
		data.fields = {};
	}
	var email = data.email.toLowerCase();		//case insensitive
	
	db.user.findOne({'$or': [ {'email': email}, {'emails_all.email': email} ] }, data.fields, function(err, user)
	{
		if(err)
		{
			ret.code = 1;
			ret.msg += "Error: " + err;
			deferred.reject(ret);
		}
		else if(!user)
		{
			ret.code = 0;
			ret.exists = false;
			deferred.resolve(ret);
		}
		else
		{
			ret.code = 0;
			ret.exists = true;
			ret.user = user;
			deferred.resolve(ret);
		}
	});

	return deferred.promise;
};

/**
Check for a user's existence based on a given phone number.
@toc 7.
@method read
@param {Object} data
	@param {String} phone The phone object to search for.  Will be stripped of all non digit characters first for comparison.
	@param {Array} [fields = {}] Mongo query for which fields in the record to return. Default is everything.
		@example {'_id':1, 'first_name':1, 'last_name':1}
@param {Object} params
@return {Promise}
	@param {Object} ret
		@param {Boolean} exists True iff the user already exists.
		@param (Object} user The user object, if it exists. 
**/
User.prototype.searchByPhone = function(db, data, params)
{
	var deferred = Q.defer();
	var ret ={code:0, msg:'User.searchByPhone ', 'exists': false, 'user': {} };
	
	if(data.fields === undefined)
	{
		data.fields = {};
	}
	
	data =self.fixPhoneFormat(db, data, params);
	
	db.user.findOne({'$or': [ {'phone.number': data.phone}, {'phones_all.number': data.phone.number} ] }, data.fields, function(err, user)
	{
		if(err)
		{
			ret.code = 1;
			ret.msg += "Error: " + err;
			deferred.reject(ret);
		}
		else if(!user)
		{
			ret.code = 0;
			ret.exists = false;
			deferred.resolve(ret);
		}
		else
		{
			ret.code = 0;
			ret.exists = true;
			ret.user = user;
			deferred.resolve(ret);
		}
	});

	return deferred.promise;
};

/**
Ensures the phone and phones_all keys are of the proper format (an object with a 'number' field') rather than a string. It also strips all phone numbers of all special characters so there's only digits.
@toc 9.
@method fixPhoneFormat
@param {Object} data
	@param {Object|String} phone Either a string of a phone number or an object with phone.number
	@param {Array} [phones_all] Array of phone objects (or strings)
@return {data} The same data as passed in but now with the proper phone formats for 'phone' and 'phones_all'
**/
User.prototype.fixPhoneFormat = function(db, data, params) {
	//phone
	if(data.phone !==undefined) {
		if(typeof(data.phone) =='string') {		//convert to object
			data.phone ={
				number: data.phone
			};
		}
		
		if(data.phone.number !==undefined) {
			data.phone.number =data.phone.number.replace(/[^\d.]/g, '');		//strip out any non digit characters
			if(data.phone.number.length >10) {		//only take last 10 characters
				if(!data.phone.area_code) {
					data.phone.area_code =data.phone.number.slice(0, data.phone.number.length-10);
				}
				data.phone.number =data.phone.number.slice(data.phone.number.length-10, data.phone.number.length);
			}
			else if(!data.phone.area_code) {
				data.phone.area_code ='1';		//default to US area code
			}
		}
		else {
			data.phone.number ='';
		}
	}
	
	//phones_all
	var ii;
	if(data.phones_all !==undefined) {
		for(ii =0; ii<data.phones_all.length; ii++) {
			if(typeof(data.phones_all[ii]) =='string') {		//convert to object
				data.phones_all[ii] ={
					number: data.phones_all[ii]
				};
			}
			
			if(data.phones_all[ii].number !==undefined) {
				data.phones_all[ii].number =data.phones_all[ii].number.replace(/[^\d.]/g, '');		//strip out any non digit characters
				if(data.phones_all[ii].number.length >10) {		//only take last 10 characters
					if(!data.phones_all[ii].area_code) {
						data.phones_all[ii].area_code =data.phones_all[ii].number.slice(0, data.phones_all[ii].number.length-10);
					}
					data.phones_all[ii].number =data.phones_all[ii].number.slice(data.phones_all[ii].number.length-10, data.phones_all[ii].number.length);
				}
				else if(!data.phones_all[ii].area_code) {
					data.phones_all[ii].area_code ='1';		//default to US area code
				}
			}
			else {
				data.phones_all[ii].number ='';
			}
		}
	}
	
	return data;
};


/**
Module exports
@method exports
@return {User} User constructor
**/
module.exports = new User({});