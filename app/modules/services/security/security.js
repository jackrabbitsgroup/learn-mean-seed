/**
@todo
- modularize out site specific stuff??

There's both generic and site specific authorizations in this file so to re-use for other sites, search for `site-specific` in the file and update/remove all those parts accordingly.

@module SecurityMod

@toc
0. securityList (site-specific)
1. authorize
2. preCheck (site-specific)
2.5. checkAuthString (site-specific)
3. parseLogic
5. formRpcMethod
4. entryPoint
6. init
*/

'use strict';

var lodash = require('lodash');
var Q = require('q');
var async = require('async');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

// Require any necessary controllers here
var UserMod =require(pathParts.controllers+'user/user.js');
var AuthMod = require(pathParts.controllers+'auth/auth.js');

var db;		//Will be set in the init function
var self;

function SecurityMod(options)
{
	self =this;
}

var auth_string_map = {};	//Each auth string we check will return true or false. The results will be remembered here.	

/**
Holds authorization objects for every route. Site-specific. Format: {'[routeName]': {[AuthObject]} }.
To specify that a route requires no authentication, assign the empty object {} to it or leave the route out of the list entirely. I recommend creating a placeholder entry with an empty object, but commenting it out.
@toc 0.
	Authorizations include:
	super_admin		(authorized for everything)
	self			(User is performing an operation on themself)
	session			(All calls that require any authorization require a valid session. Use this for calls that require ONLY a valid session, to distinguish them from calls that require nothing.)
	
@example
var securityList =
{
	'Event.eventInvite': {'$or': ['coordinator', 'invitee']},
	'Event.eventRSVP': {'$and': ['self', {'$or': ['public_event', 'invitee', 'coordinator'] } ] },
};
*/
var securityList =
{
//	'placeholder' : {'$and': ['placeholder1', 'placeholder2']}
	// 'Auth.create': {},
	// 'Auth.login': {},
	// 'Auth.logout': {},
	// 'Auth.checkLogin': {},
	// 'Auth.forgotPassword': {},
	// 'Auth.resetPassword': {},
	// 'Auth.changePassword': {},
	// 'User.search': {},
	// 'User.read': {},
	'User.update': 'self',
	'User.delete1': 'self'
};

/**
Checks if a call is authorized.
@toc 1.
@method authorize
@param {Object} params
	@param {String} route Name of the route that was called.
	@param {Object} data The data given when the route was called.
		@param {Object} [authorize = false] Boolean. If we are working with the test db and this flag is not true, skip authentication.
		@param {Object} authority_keys Holds authorization information
			@param {String} user_id Id of the user responsible for the call.
			@param {String} sess_id Id of the user's current session.
*/
function authorize(params)
{
	var deferred = Q.defer();
	params.auths_obj = securityList[params.route];
	console.log(params.route + " ");
	if(params.auths_obj === undefined)
	{
		console.log("No authorizations specified for route " + params.route);
		deferred.resolve(true);
	}
	//Allow skipping authentication on the test database
	else if(global.environment == 'test' && params.data.authorize !== true)
	{
		deferred.resolve(true);
	}
	else
	{
		
		auth_string_map = {};	//Each auth string we check will return true or false. The results will be remembered here.	
		
		preCheck(params, function(ret)
		{
			if(ret.go !== false)
			{
				params.other = ret.other;	//Place any additional info needed in all or most of the authorization checks here (ex: info from a database query, so you don't have to perform the query with every check). This is purely for efficiency and convenience.
				
				parseLogic(params, function(authorized)
				{
					if(authorized)
					{
						deferred.resolve(authorized);
					}
					else
					{
						deferred.reject(authorized);
					}
				});
			}
			else if(ret.authorized)
			{
				deferred.resolve(ret.authorized);
			}
			else
			{
				deferred.reject(ret.authorized);
			}
		});
	}
	return deferred.promise;
}

/**
@toc 2.
Performs any and all overarching tasks that should occur before checking all authorizations individually. This is where site-specific code goes. One main purpose of this is to avoid having to do multiple database lookups for the SAME information.
@method preCheck

@param {Object} params
	@param {Object} auths_obj Holds authorization strings to check. Uses mongodb '$and', '$or', '$not' logical syntax. Should be either an auth string or an object with exactly one of '$and', '$or', or '$not' defined.
	@param {String} route Name of the route that was called, in case any routes require additional special treatment.
	@param {Object} data The data given when the route was called.
		@param {Object} authority_keys Holds authorization information
			@param {String} user_id Id of the user responsible for the call.
			@param {String} sess_id Id of the user's current session.
@param {Function} callback Callback function. Should receive the 'ret' object as input.

@return {Object} ret
	@param {Boolean} go False iff the rest of the authorization checks should be skipped.
	@param {Boolean} authorized True iff this call is authorized. Irrelevant if ret.go is not false.
	@param {Object} other Holds any additional information, such as results from database queries, that should be made available to the rest of the authorization checks. This exists for your convenience and efficiency; it is not strictly necessary.
*/
function preCheck(params, callback)
{
	var ret = {'go': true, 'authorized': false, 'other': {} };
	
	// console.log('security.preCheck params.data: '+JSON.stringify(params.data));
	//error if authority_keys don't exist
	if(params.data.authority_keys ===undefined || params.data.authority_keys.user_id ===undefined || params.data.authority_keys.sess_id ===undefined) {
		console.log('Error: authority keys undefined');
		ret.go = false;
		ret.authorized = false;
		callback(ret);
	}
	else {		//have the authority_keys, so check them
		var user_promise = UserMod.read(db, {'_id': params.data.authority_keys.user_id, 'fields': {} }, {});
		user_promise.then(
			function(ret1)
			{
				//Check session
				if(ret1.result.sess_id == params.data.authority_keys.sess_id)
				{
					if((typeof params.auths_obj == 'string' && params.auths_obj == 'session') || ret1.result.super_admin === 1)
					{
						//If only a valid session is required, or if the user making the call is a super admin, we're done.
						ret.go = false;
						ret.authorized = true;
						callback(ret);
					}
					else
					{
						ret.go = true;
						ret.other.user = ret1.result;		//Save this user object, making it available to checkAuthString
						
						//if have common database data that will likely be used elsewhere, can look this up now too. Otherwise just return/callback now.
						callback(ret);
					}
				}
				else
				{
					//Invalid session, authentication failed.
					console.log('Session Invalid!');
					ret.go = false;
					ret.authorized = false;
					callback(ret);
				}
			},
			function(err)
			{
				console.log('Error reading user with id: ' + params.data.authority_keys.user_id);
				console.log(err);
				ret.go = false;
				ret.authorized = false;
				callback(ret);
			}
		);
	}
}

/**
@toc 2.5.
Checks a given authorization string.
Site-specific
@method checkAuthString

@param {Object} params
	@param {String} auth_string A string designating what authority to check for.
	@param {Object} data The data given when the route was called.
		@param {Object} authority_keys Holds session authorization information
			@param {String} user_id Id of the user responsible for the call.
			@param {String} sess_id Id of the user's current session.
	@param {Object} other
		@param {Object} user The user object, from database, of the user responsible for the call.
		@param {Object} event The event object associated with the call, if applicable.
	@param {String} route Name of the route that was called. Included in case any routes require special treatment.
@param {Function} callback Callback function. Called with the return info specified below.

@return {Object} ret
	@param {Boolean} authorized True iff this authorization checks out.
	
*/
function checkAuthString(params, callback)
{
	var ret = {'authorized': false};
	var ii;
	
	if(params.auth_string == 'self')
	{
		if(params.other.user._id == params.data.user_id)
		{
			ret.authorized = true;
		}
		else
		{
			ret.authorized = false;
		}
		callback(ret);
	}
	else if(params.auth_string == 'super_admin')
	{
		//We wouldn't have made it this far if the user was a super admin. Thus, this check fails.
		ret.authorized = false;
		callback(ret);
	}
	else
	{
		//We should never reach this point. There's an error somewhere if we do.
		console.log('Error in Security Module - unrecognized authorization string: ' + params.auth_string);
		ret.authorized = false;
		callback(ret);
	}
}

/**
@toc 3.
Takes an authorization object using mongodb logical syntax. Parses and checks. Returns a boolean.
@method parseLogic

@param params {Object}
	@param {Object} auths_obj Either an auth string or an object with exactly one of '$and', '$or', or '$not' defined, using mongodb syntax. Nesting is allowed.
	@param {String} route Name of the route that was called, in case any routes require additional special treatment.
	@param {Object} data The data given when the route was called.
	@param {Object} other Holds any additional information. This may vary from site to site. Typical things to place here might include the database user object for the user responsible for the call.
@param callback {Function} A callback function. Receives a boolean as input: true iff the call is authorized, false otherwise.
*/

function parseLogic(params, callback)
{
	var ii;
	var authorized;
	var auths_obj = params.auths_obj;
	
	//auths_obj should either be an auth string, or have exactly one of '$and', '$or', or '$not' defined. Nothing else makes sense.
	if(typeof auths_obj == 'string' && auths_obj.length > 0)
	{
		if(auth_string_map[auths_obj] === undefined)		//If we haven't checked this authorization yet, check it now.
		{
			auth_string_map[auths_obj] = 'defined';			//Define it immediately, to prevent double-checking
			checkAuthString({'auth_string': auths_obj, 'route': params.route, 'data': params.data, 'other': params.other}, function(ret)
			{
				auth_string_map[auths_obj] = ret.authorized;
				callback(ret.authorized);
			});
		}
		else
		{
			callback(auth_string_map[auths_obj]);
		}
	}
	else if(auths_obj.$and !== undefined)
	{
		authorized = true;
		async.forEach(auths_obj.$and,
			function(auth_obj, callback2)
			{
				//Only continue if the '$and' has not yet been proven false.
				if(authorized)
				{
					parseLogic({'auths_obj': auth_obj, 'route': params.route, 'data': params.data, 'other': params.other}, function(authorized1)
					{
						if(!authorized1)
						{
							authorized = false;		//If a single part of the 'and' is false, the whole thing is false. This also stops the loop.
						}
						callback2(false);
					});
				}
				else
				{
					callback2(false);
				}
			},
			function(err)
			{
				callback(authorized);
			}
		);
	}
	else if(auths_obj.$or !== undefined)
	{
		authorized = false;
		async.forEach(auths_obj.$or,
			function(auth_obj, callback2)
			{
				//Only continue if the '$or' has not yet been proven true.
				if(!authorized)
				{
					parseLogic({'auths_obj': auth_obj, 'route': params.route, 'data': params.data, 'other': params.other}, function(authorized1)
					{
						if(authorized1)
						{
							authorized = true;		//If a single part of the 'or' is true, the whole thing is true. This also stops the loop.
						}
						callback2(false);
					});
				}
				else
				{
					callback2(false);
				}
			},
			function(err)
			{
				callback(authorized);
			}
		);
	}
	else if(auths_obj.$not !== undefined)
	{
		parseLogic({'auths_obj': auths_obj.$not, 'route': params.route, 'data': params.data, 'other': params.other}, function(authorized1)
		{
			callback(!authorized1);
		});
	}
	else	//We should only reach this point if no authorization is required at all.
	{
		callback(true);
	}
}

/**
Takes a url and rpcMethod. If the rpcMethod is undefined, it is formed by parsing the url (ex. 'api/auth/login' generates 'Auth.login' rpcMethod)
@toc 5.
@param {String} url ex: '/api/auth/login'
@param {String} rpcMethod (typically undefined)
@param {Object} params
@return {String} rpcMethod (now ensured to be defined and accurate)
*/
function formRpcMethod(url, rpcMethod, params) {
	if(rpcMethod ===undefined) {
		var lastSlash =url.lastIndexOf('/');
		var urlPart =url.slice(0, lastSlash);
		var method1 =url.slice((lastSlash+1), url.length);
		var secondEndSlash =urlPart.lastIndexOf('/');
		var namespace =urlPart.slice((secondEndSlash+1), urlPart.length);
		namespace =namespace.charAt(0).toUpperCase() + namespace.slice(1);		//capitalize first letter
		rpcMethod =namespace+'.'+method1;
		console.log(rpcMethod+' '+namespace+' '+method1);
	}
	return rpcMethod;
}

/**
Handles any all pre-processing prior to actual authorization. This where authorization calls enter the module, from express's app.all()
@toc 4.
@method entryPoint
@param {Object} req
@param {Object} res
@param {Function} next
	
*/
function entryPoint(req, res, next)
{	
	var params = {};
	var data;
	//to handle both with and without rpc method set directly, need to check for it (and possibly form it)
	var url =req._parsedUrl.pathname;
	params.route =formRpcMethod(url, params.route, {});
	if(req.body.method ===undefined) {
		req.body.method =params.route;
	}
	
	if(req.body.rpc !==undefined) {
		data = JSON.parse(req.body.rpc);
		params.route = data.method;
		params.data = data.params;
	}
	else if(req.body.method !==undefined && req.body.params !==undefined) {
		params.route = req.body.method;
		params.data = req.body.params;
	}
	if(typeof(params.data) =='string') {
		params.data =JSON.parse(params.data);
	}

	var promise = authorize(params);
	promise.then(function(authorized)
	{
		next();
	}, function(err)
	{
		console.log('Authentication failed');
		res.send(401, { status: 'Authentication Failed' });
	});
}

/**
Initializes the security module and returns the entryPoint function, to be used by app.all.
In particular, this function ensures that the database is defined locally.
@toc 6.
@method init
@param {Object} params
	@param {Object} db	The database object.
@return {Function} entryPoint
	
*/
SecurityMod.prototype.init = function(params)
{
	db = params.db;
	return entryPoint;
};


module.exports = new SecurityMod({});