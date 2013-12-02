/**
$http wrapper for making (backend) calls and handling notifications (in addition to making the api/backend request, it ALSO auto handles the UI of displaying a notification on success or failure)

@class http

@toc
1. go
2. formConfig
3. addParams
4. formHost
*/

'use strict';

angular.module('app').factory('appHttp', ['$http', '$q', '$rootScope', '$cookieStore', 'appConfig', '$timeout', 'appStorage',
	function($http, $q, $rootScope, $cookieStore, appConfig, $timeout, appStorage){

	var inst = {
	
		timeoutTrig: false,		//object global timeout trigger so can cancel/clear it before all new calls
		
		/**
		@toc 1.
		Makes the $http call and returns a deferred object (promise) then when call is complete, shows a notification and completes (resolves or rejects) the promise
		@method go
		@param {Object} rpcOpts
			@param {String} [method] The RPC method to use (i.e. 'Auth.login')
		@param {Object} httpOpts $http opts (will be extended off defaults)
			@param {String} [url] i.e. 'auth/active' (will have '/api/' pre-prepended)
			@param {Object} data The data to send back
		@param {Object} [params] additional options
			@param {String} [msgSuccess] Message to alert upon success
			@param {Boolean} [noLoadingScreen] Boolean true to NOT show loading screen
			@param {Number} [maxMilliseconds =7500] How long to allow the call to go (after this, call will fail and error will be returned)
			@param {Boolean} [suppressErrorAlert] True to NOT show the error if the HTTP call errors
		@return deferred.promise
		@example with just success handling
			var promise =appHttp.go({method:'Auth.login'}, {data:$scope.formVals}, {});
			promise.then(function(response) {
				//handle success
			});
		@example with BOTH success and error handling blocks and with full url instead of RPC method
			var promise =appHttp.go({}, {url:'auth/login', data:$scope.formVals}, {});
			promise.then(function(response) {
				//handle success
			}, function(response) {
				//handle error
			});
		**/
		go: function(rpcOpts, httpOpts, params) {
			var self =this;
			var defaults ={
				maxMilliseconds: 7500
				// maxMilliseconds: 50		//TESTING
			};
			params =angular.extend(defaults, params);
			
			if(params.noLoadingScreen ===undefined || !params.noLoadingScreen) {
				$rootScope.$broadcast('evtLoadingStart', {});
			}

			var deferred = $q.defer();
			
			this.formConfig(rpcOpts, httpOpts, params)
			.then(function(httpOpts) {
			
				$http(httpOpts)
				.success(function(response) {
					$timeout.cancel(self.timeoutTrig);
					// response =MobileWrapper.httpParse(response, {});		//handle any mobile native wrapper quirks for malformed responses..
					
					// response.error is only pressent when an error has occurred
					if( response.hasOwnProperty('error') ) {
						if(params.suppressErrorAlert ===undefined || !params.suppressErrorAlert) {
							$rootScope.$broadcast('evtAppalertAlert', {type:'error', msg:response.error.message});
						}
						deferred.reject(response);
					} else {
						if(params.msgSuccess) {		//only alert message if one was passed in
							$rootScope.$broadcast('evtAppalertAlert', {type:'success', msg:params.msgSuccess});
						}
						deferred.resolve(response);
					}
					$rootScope.$broadcast('evtLoadingDone', {});
				})
				.error(function(response, status) {
					$timeout.cancel(self.timeoutTrig);
					var msg ='Error ';
					
					if(status ===0 || !status || !response) {
						msg+=" No server response - try checking your internet connection and trying again. If the problem persists please let us know and we'll look into it!";
					}
					else {
						// response =MobileWrapper.httpParse(response, {});		//handle any mobile native wrapper quirks for malformed responses..
						
						if(response.msg !==undefined) {
							msg+=response.msg+' ';
						}
						else if(status ==401) {
							if(response.status !==undefined) {
								msg+=response.status+'. ';
							}
							msg+=' Try logging out and logging in again to refresh your session if you think you should have access to this content. Note that everytime you log in on another device or browser your session is reset everywhere else for security purposes.';
						}
						else {
							msg+=status+', '+JSON.stringify(response);
						}
					}
					$rootScope.$broadcast('evtAppalertAlert', {type:'error', msg:msg});
					deferred.reject(response);
					$rootScope.$broadcast('evtLoadingDone', {});
				})
				;
				
				//have to do this right before setting it again (previously it was earlier in the function but this is async now so may not cancel properly due to timing unless it's here
				if(self.timeoutTrig) {
					$timeout.cancel(self.timeoutTrig);
				}
				//start timeout going to cancel call if it takes too long
				self.timeoutTrig =$timeout(function() {
					$rootScope.$broadcast('evtAppalertAlert', {type:'error', msg:'Call is taking too long so was canceled; please check your internet connection and try again later'});
					deferred.reject({msg:'call timeout - taking too long'});
					$rootScope.$broadcast('evtLoadingDone', {});
				}, params.maxMilliseconds);
			});
			
			if(!$rootScope.$$phase) {
				$rootScope.$apply();		//AngularJS 1.1.4 fix (otherwise $httpBackend tests give "no pending requests to flush" error and potentially there are other (non-test) issues as well. See: https://github.com/angular/angular.js/issues/2371	https://github.com/angular/angular.js/issues/2431
			}

			// return promise; caller should handle success/error callbacks with `.then()`
			return deferred.promise;
		},
		
		/**
		Forms the final $http opts based off of defaults (for both $http and RPC options). The url is formed by pulling the first part of the RPC method and then prepending '/api/' to it
		@toc 2.
		@method formConfig
		@param {Object} rpcOpts
			@param {String} method The RPC method to use (i.e. 'Auth.login')
		@param {Object} httpOpts $http opts (will be extended off defaults)
			@param {Object} data The data to send back
		@param {Object} [params] additional options
		@return {Object} httpOpts Now updated / complete httpOpts to be used in $http call
		*/
		formConfig: function(rpcOpts, httpOpts, params) {
			var deferred = $q.defer();
			
			if(rpcOpts.method !==undefined) {
				//default url part to be the lowercase version of the first part of the rpc method (i.e. 'Auth.login' means 'auth/' will be the url part)
				httpOpts.url =rpcOpts.method.slice(0, rpcOpts.method.indexOf('.')).toLowerCase()+'/';
			}
			else {
				// httpOpts.url =httpOpts.url+'/';		//ensure ending slash
			}
			
			var defaultHttpOpts ={'method':'POST', 'params':{}, 'data':{}};
			httpOpts =angular.extend(defaultHttpOpts, httpOpts);
			
			//add url api prefix
			// var urlPrefix ='/api/';
			var urlPrefix =this.formHost({})+'api/';
			httpOpts.url =urlPrefix+httpOpts.url;
			
			this.addParams(httpOpts, {})		//add params - should be BEFORE converting to rpc format
			.then(function(httpOpts) {
			
				//make data / params into rpc format
				httpOpts.data = {
					jsonrpc: '2.0',
					id: 1,
					method: rpcOpts.method,
					params: httpOpts.data || httpOpts.params || {}
				};
				// GET requests require that RPC input be placed under rpc namespace
				if( httpOpts.method === 'GET' ) {
					httpOpts.params = {
						rpc: httpOpts.data
					};
				}
				else {		//remove params since these are only used for GET method calls and if left as blank object, it will cause an extra "?" to be appended to the url
					delete httpOpts.params;
				}
				
				deferred.resolve(httpOpts);
			});
			
			return deferred.promise;
		},
		
		/**
		Adds app specific params/data to each call (i.e. security / authority keys for backend authorization)
		@toc 3.
		@method addParams
		@param {Object} httpOpts
		@param {Object} params
		@return {Object} httpOpts Now updated with additional params/data
		*/
		addParams: function(httpOpts, params) {
			var deferred = $q.defer();
			
			var authObj =false;
			
			//required for most calls
			var cookieSess =$cookieStore.get('sess_id');
			var cookieUser =$cookieStore.get('user_id');
			//var sessId =appConfig.load('session_id', {});
			if(cookieSess && cookieUser)
			{
				authObj ={
					'user_id':cookieUser,
					'sess_id':cookieSess
				};
				if(httpOpts.params !==undefined) {
					httpOpts.params.authority_keys =authObj;
				}
				if(httpOpts.data !==undefined) {
					httpOpts.data.authority_keys =authObj;
				}
				deferred.resolve(httpOpts);
			}
			else {
				//try localstorage - some devices (i.e. android 4.2?) don't seem to be working with cookies..
				var promiseStorage =appStorage.read('user', {});
				promiseStorage.then(function(user) {
					authObj ={
						'user_id':user._id,
						'sess_id':user.sess_id
					};
					if(httpOpts.params !==undefined) {
						httpOpts.params.authority_keys =authObj;
					}
					if(httpOpts.data !==undefined) {
						httpOpts.data.authority_keys =authObj;
					}
					deferred.resolve(httpOpts);
				
				}, function(err) {
					deferred.resolve(httpOpts);
				});
			}
			
			return deferred.promise;
		},
		
		/**
		Forms the domain/host for making the HTTP request
		@toc 4.
		@method formHost
		@param {Object} params
		@return {String} host The host, i.e. 'http://localhost:3000/' or 'https://domain1.com/'
		*/
		formHost: function(params) {
			var host ='/';		//default host to nothing (to do a local request)
			//set CORS
			if(parseInt(appConfig.dirPaths.useCorsUrls.all, 10)) {
				$http.defaults.headers.common["X-Requested-With"] = undefined;		//CORS
				host =appConfig.dirPaths.ajaxUrlParts.main;		//not a local request - need to set host
			}
			/*
			//update: this isn't true; could be a local request from a production (non 'localhost') server
			if(appConfig.dirPaths.ajaxUrlParts.main.indexOf('localhost') <0) {		//not a local request - need to set host
				host =appConfig.dirPaths.ajaxUrlParts.main;
			}
			*/

			return host;
		}
	};

	return inst;
}]);