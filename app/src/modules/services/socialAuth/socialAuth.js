/**
@class socialAuth

@toc
//1. data
//2. checkAuthGoogle
//3. checkAuthFacebook
*/

'use strict';

angular.module('app').
factory('appSocialAuth', ['appHttp', 'appConfig', '$rootScope', '$q', 'jrgGoogleAuth', 'jrgFacebookAuth', 'UserModel', '$timeout',
function(appHttp, appConfig, $rootScope, $q, jrgGoogleAuth, jrgFacebookAuth, UserModel, $timeout) {
var inst ={

	/**
	@toc 1.
	*/
	data: {
		google: {
			access_token: false,
			google_id: false
		},
		facebook: {
			access_token: false,
			facebook_id: false
		}
	},
	
	/**
	Wraps jrgGoogleAuth service to check if user is already authenticated by google and if not, authenticate them. Either way, return a promise with the google authentication information upon completion
	@toc 2.
	@method checkAuthGoogle
	@param {Object} opts
	@return {Object} (via promise)
		@param {String} access_token google token for authenticated user
		@param {String} google_id Authenticated user's google id
		@param {String} [email] authenticated user's email address (not guaranteed to exist)
	@example
		var promise =appSocialAuth.checkAuthGoogle({});
		promise.then(function(data) {
			//do stuff here
		}, function(data) {
			//handle error here
		});
	*/
	checkAuthGoogle: function(opts) {
		var thisObj =this;
		var deferred =$q.defer();
		if(this.data.google.access_token) {		//if already authenticated, just return
			deferred.resolve(thisObj.data.google);
		}
		else {		//have to authenticate
			//initialize google auth with client id
			//jrgGoogleAuth.init({'client_id':appConfig.cfgJson.google.clientId, 'scope':'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'});
			jrgGoogleAuth.init({'client_id':appConfig.cfgJson.google.clientId, 'scopeHelp':['login', 'email', 'contacts'] });
			
			//handle actual google login
			var evtGoogleLogin ="evtGoogleLogin";
			jrgGoogleAuth.login({'extraInfo':{'user_id':true, 'emails':true}, 'callback':{'evtName':evtGoogleLogin, 'args':[]} });
			
			/**
			@toc
			@method $scope.$on(evtGoogleLogin,..
			@param {Object} googleInfo
				@param {Object} token
					@param {String} access_token
				@param {Object} extraInfo
					@param {String} user_id
					@param {String} emailPrimary
			*/
			$rootScope.$on(evtGoogleLogin, function(evt, googleInfo) {
				var vals ={
					'google_id':googleInfo.extraInfo.user_id,
					'access_token':googleInfo.token.access_token
				};
				if(googleInfo.extraInfo.emailPrimary) {
					vals.email =googleInfo.extraInfo.emailPrimary;
				}
				thisObj.data.google =vals;
				deferred.resolve(thisObj.data.google);
			});
		}
		
		return deferred.promise;
	},
	
	/**
	Wraps jrgFacebookAuth service to check if user is already authenticated by facebook and if not, authenticate them. Either way, return a promise with the facebook authentication information upon completion
	@toc 3.
	@method checkAuthFacebook
	@param {Object} opts
	@return {Object} (via promise)
		@param {String} access_token facebook token for authenticated user
		@param {String} facebook_id Authenticated user's facebook id
		@param {String} [email] authenticated user's email address (not guaranteed to exist)
	@example
		var promise =appSocialAuth.checkAuthFacebook({});
		promise.then(function(data) {
			//do stuff here
		}, function(data) {
			//handle error here
		});
	*/
	checkAuthFacebook: function(opts) {
		var thisObj =this;
		var deferred =$q.defer();
		if(this.data.facebook.access_token) {		//if already authenticated, just return
			deferred.resolve(thisObj.data.facebook);
		}
		else {		//have to authenticate
			//initialize facebook auth with app id
			jrgFacebookAuth.init({'fbAppId':appConfig.cfgJson.facebook.appId, 'fbPerms':appConfig.cfgJson.facebook.scope});
			
			//$timeout(function() {
				//handle actual facebook login
				var evtFBLogin ="evtFBLogin";
				jrgFacebookAuth.login({'callback':{'evtName':evtFBLogin, 'args':[]} });
				
				/**
				@toc
				@method $rootScope.$on(evtFBLogin,..
				@param {Object} fbCookie
					@param {String} accessToken
					@param {String} userID
				*/
				$rootScope.$on(evtFBLogin, function(evt, fbCookie) {
					//get facebook email
					FB.api('/me', function(response) {
						//alert(response.name);
						var vals ={'facebook_id':fbCookie.userID, 'access_token':fbCookie.accessToken, 'email':response.email};
						thisObj.data.facebook =vals;
						deferred.resolve(thisObj.data.facebook);
						//get back into angular world since this happens after FB.api call
						if(!$rootScope.$$phase) {
							$rootScope.$apply();
						}
					});
				});
			//}, 100);
		}
		
		return deferred.promise;
	}

};
return inst;
}]);