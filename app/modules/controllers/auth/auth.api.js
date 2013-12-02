/**
RPC auth endpoints
@module auth
@class authApi

@toc
1. rpcLogin
2. rpcLogout
3. rpcCreateLogin
4. rpcActive
5. rpcForgotPassword
6. rpcResetPassword
7. rpcChangePassword
8. rpcUserImport
9. rpcSocialLogin
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

var sampleUserReturn = {
	_id: "objectid",
	email: "string",
	first_name: "string",
	last_name: "string"
};

var defaults = {
	group: 'auth',
	info: 'Auth API',
	namespace: 'Auth'
};

// var self;
var db;

module.exports = AuthApi;

/**
@param {Object} options
	@param {Object} db
	// @param {Object} Base
	// @param {Object} authMod
	// @param {Object} userMod
*/
function AuthApi(options){
	this.opts = lodash.merge({}, defaults, options||{});
	// Base =this.opts.Base;
	Base.call(this, this.opts);

	db =this.opts.db;
	// this.authMod = this.opts.authMod;
	// this.userMod =this.opts.userMod;
	// self =this;
}

inherits(AuthApi, Base);

AuthApi.prototype.getRpcMethods = function(){
	return {
		login: this.rpcLogin(),
		logout: this.rpcLogout(),
		create: this.rpcCreateLogin(),
		active: this.rpcActive(),
		forgotPassword: this.rpcForgotPassword(),
		resetPassword: this.rpcResetPassword(),
		changePassword: this.rpcChangePassword(),
		userImport: this.rpcUserImport(),
		socialLogin: this.rpcSocialLogin()
	};
};

/**
Returns RPC schema object for Auth.login
@toc 1.
@method rpcLogin
**/
AuthApi.prototype.rpcLogin = function(){
	var self = this;

	return {
		info: 'Log into API',
		params: {
			// data:  {
				email: { required: true, type: 'string', info: "Login email" },
				password: { required: true, type: 'string', info: "Login password" }
			// }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		Logs in user
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =AuthMod.login(db, params, {});
			promise.then(
				function(ret1)
				{
					ret1.user =UserMod.readFilter(ret1.user, {type:'login'});		//only return certain fields (i.e strip out password)

					//@example: var fields ={'tribe': {'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1}, 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
					// var fields ={};
					var fields ={ 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
					var fill_promise = UserMod.fillInfo(db, {'user': ret1.user, 'fields': fields }, {});
					fill_promise.then(
						function(ret2)
						{
							ret1.user = ret2.user;
							out.win(ret1);
						},
						function(err)
						{
							self.handleError(out, err, {});
						}
					);
				},
				function(err)
				{
					self.handleError(out, err, {});
				}
			);
		}
	};
};

/**
Returns RPC schema object for Auth.logout
@toc 2.
@method rpcLogout
**/
AuthApi.prototype.rpcLogout = function(){
	var self = this;

	return {
		info: 'Log out of API',
		params: {
			// data: {
				user_id: { required: true, type: 'string', info: "Id of user to logout" }
			// }
		},
		returns: {
			logout: true
		},
		/**
		Logs out user
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =AuthMod.logout(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
Returns RPC schema object for Auth.createLogin
@toc 3.
@method createLogin
**/
AuthApi.prototype.rpcCreateLogin = function(){
	var self = this;

	return {
		info: 'Create new login',
		params: {
			// data: {
				email:		{ required: true, type: 'string', info: "User email (must be unique)" },
				first_name:	{ required: true, type: 'string', info: "User first name" },
				last_name:	{ required: true, type: 'string', info: "User last name" },
				password:	{ required: true, type: 'string', info: "User password" }
			// }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		Creates a user login account and logs user in if successful
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =AuthMod.create(db, params, {});
			promise.then(function(ret1) {
				ret1.user =UserMod.readFilter(ret1.user, {type:'login'});		//only return certain fields (i.e strip out password)

				//@example: var fields ={'tribe': {'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1}, 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
				// var fields ={};
				var fields ={ 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
				var fill_promise = UserMod.fillInfo(db, {'user': ret1.user, 'fields': fields }, {});
				fill_promise.then(
					function(ret2)
					{
						ret1.user = ret2.user;
						out.win(ret1);
					},
					function(err)
					{
						self.handleError(out, err, {});
					}
				);
			}, function(err) {
				// self.handleError(out.fail);
				self.handleError(out, err, {});
			});
		}
	};
};

/**
Returns RPC schema object for Auth.getLoggedInUser
@toc 4.
@method rpcActive
**/
AuthApi.prototype.rpcActive = function(){
	var self = this;

	return {
		info: 'Get logged in user object',
		params: {
			// data: {
				user_id: { required: true, type: 'string', info: "Id of user to check session for" },
				sess_id: { required: true, type: 'string', info: "Id of user session" }
			// }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		Get logged in user object
		@method method
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =AuthMod.checkLogin(db, params, {});
			promise.then(function(ret1) {
				ret1.user =UserMod.readFilter(ret1.user, {type:'public'});		//only return certain fields (i.e strip out password)
				
				//@example: var fields ={'tribe': {'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1}, 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
				// var fields ={};
				var fields ={ 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
				var fill_promise = UserMod.fillInfo(db, {'user': ret1.user, 'fields': fields }, {});
				fill_promise.then(
					function(ret2)
					{
						ret1.user = ret2.user;
						out.win(ret1);
					},
					function(err)
					{
						self.handleError(out, err, {});
					}
				);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};


/**
Returns RPC schema object for Auth.forgotPassword
@toc 5.
@method rpcForgotPassword
**/
AuthApi.prototype.rpcForgotPassword = function(){
	var self = this;

	return {
		info: 'Handle a password reset request. Sets user.reset_key and sends a reset email.',
		params: {
			// data: {
				email: { required: true, type: 'string', info: "Email of user requesting a reset" }
			// }
		},
		returns: {
			reset: true
		},
		/**
		Generate and send a password reset key when auser forgots password
		@method method
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out) {
			var promise =AuthMod.forgotPassword(db, params, {});
			promise.then(function(ret1) {
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
Returns RPC schema object for Auth.resetPassword
@toc 6.
@method rpcResetPassword
**/
AuthApi.prototype.rpcResetPassword = function(){
	var self = this;

	return {
		info: 'Reset user password provided the email and reset key match.',
		params: {
			// data: {
				email: { required: true, type: 'string', info: "Email of user" },
				password: { required: true, type: 'string', info: "New password" },
				reset_key: { required: true, type: 'string', info: "Reset key" }
			// }
		},
		returns: {
			user: sampleUserReturn
		},
		/**
		Reset user password provided the email and reset key match in the database
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =AuthMod.resetPassword(db, params, {});
			promise.then(function(ret1) {
				ret1.user =UserMod.readFilter(ret1.user, {type:'login'});		//only return certain fields (i.e strip out password)
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 7.
@method rpcChangePassword
**/
AuthApi.prototype.rpcChangePassword = function(){
	var self = this;

	return {
		info: 'Change user password provided the old password is valid.',
		params: {
			user_id: { required: true, type: 'string', info: "Identify user to change password for" },
			current_password: { required: true, type: 'string', info: "The user's current password (to authenticate)" },
			new_password: { required: true, type: 'string', info: "New password to set" }
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
		action: function(params, out){
			var promise =AuthMod.changePassword(db, params, {});
			promise.then(function(ret1) {
				ret1.user =UserMod.readFilter(ret1.user, {type:'public'});		//only return certain fields (i.e strip out password)
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};


/**
@toc 8.
@method rpcUserImport
**/
AuthApi.prototype.rpcUserImport = function(){
	var self = this;

	return {
		info: 'Checks if a user exists. If not, creates a guest user.',

		params: {
			users: { required: true, type: 'array', info: "Array of new user objects. Each object must contain an email, phone, or _id field. May contain other user information." },
			user_id: { required: false, type: 'string', info: "Id of user who is importing. This is used to link/follow these new users." },
			follow: { required: false, type: 'number', info: "1 to have the user_id user follow all the users after being imported." }
		},
		returns: {
			users: 'Array of the new user objects, if successfully created, or the user\'s existing database entry (with at least the _id field), if it\'s already there.'
		},
		
		
		/**
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =AuthMod.usersImport(db, params, {});
			promise.then(function(ret1) {
				ret1.user =UserMod.readFilter(ret1.user, {type:'public'});		//only return certain fields (i.e strip out password)
				out.win(ret1);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};

/**
@toc 8.
@method rpcSocialLogin
**/
AuthApi.prototype.rpcSocialLogin = function(){
	var self = this;

	return {
		info: 'Login via a third party social site. Creates a new user as necessary.',
		params: {
			user: { required: true, type: 'object', info: "User object. Must contain an email, phone, or _id field. May contain other user information." },
			socialData: { required: true, type: 'object', info: "The social data to save - typically a 'token' and 'id'." },
			type: { required: true, type: 'string', info: "A key to save the token under, describing the social site. Ex: 'facebook', 'google', etc." }
		},
		returns: {
			user: 'The new user object, if successfully created, or the user\'s existing database entry (with at least the _id field), if it\'s already there.',
			already_exists: 'Boolean. True iff the user was already in the database.'
		},
		
		/**
		@method action
		@param {Object} params
			@param {Object} data new user params (detailed above)
		@param {Object} out callback object which provides `win` and `fail` functions for handling `success` and `fail` callbacks
			@param {Function} win Success callback
			@param {Function} fail Fail callback
		**/
		action: function(params, out){
			var promise =AuthMod.socialLogin(db, params, {});
			promise.then(function(ret1) {
				ret1.user =UserMod.readFilter(ret1.user, {type:'full'});		//only return certain fields (i.e strip out password)
				// ret1.user =UserMod.readFilter(ret1.user, {type:'login'});		//only return certain fields (i.e strip out password)

				//@example: var fields ={'tribe': {'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1}, 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
				// var fields ={};
				var fields ={ 'follow':{'_id':1, 'email': 1, 'phone': 1, 'first_name': 1, 'last_name': 1} };
				var fill_promise = UserMod.fillInfo(db, {'user': ret1.user, 'fields': fields }, {});
				fill_promise.then(
					function(ret2)
					{
						ret1.user = ret2.user;
						out.win(ret1);
					},
					function(err)
					{
						self.handleError(out, err, {});
					}
				);
			}, function(err) {
				self.handleError(out, err, {});
			});
		}
	};
};