/**
@todo - this is currently failing 1 test!! Not sure why or how to fix it..
*/

'use strict';

describe('LogoutCtrl', function(){
	var ctrl, scope ={}, $httpBackend, UserModel, appConfig, appHttp;

	beforeEach(module('myApp'));
	beforeEach(module('app'));
	
	beforeEach(inject(function($rootScope, $controller, $injector, _appHttp_, _UserModel_, _appConfig_) {
		appConfig =_appConfig_;
		appHttp =_appHttp_;
		UserModel =_UserModel_;
		//$httpBackend = _$httpBackend_;
		$httpBackend = $injector.get('$httpBackend');
		
		var success;
		var promise1 = appHttp.go({method:'Auth.logout'}, {}, {});
		promise1.then(function(response) {
			success = response.result;
			//var dummy =1;
		});
		
		$httpBackend.expectPOST('/api/auth/');
		$httpBackend.when('POST', '/api/auth/').respond({result: true});
		
		scope = $rootScope.$new();
		ctrl = $controller('LogoutCtrl', {$scope: scope});
	}));
	
	afterEach(function() {
		// $httpBackend.verifyNoOutstandingExpectation();
		// $httpBackend.verifyNoOutstandingRequest();
	});

	/*
	it('should have user be empty after logout XHR call', function() {
		$httpBackend.flush();
		var user =UserModel.load();
		expect(user).toEqual({});
	});
	*/
	
	/*
	it('should logout a user', function(){
		$httpBackend.expectPOST('/api/auth/');
		$httpBackend.when('POST', '/api/auth/').respond({result: true});

		// var success;
		// var promise1 = appHttp.go({method:'Auth.logout'}, {}, {});
		// promise1.then(function(response) {
			// success = response.result;
		// });

		// $httpBackend.flush();
		// expect(success).toBe(true);
	});
	*/
});


/*
//OLD FILE

'use strict';

describe('LogoutCtrl', function(){
	var ctrl, scope ={}, $httpBackend, UserModel, appConfig, appHttp;

	beforeEach(module('myApp'));
	beforeEach(module('app'));
	
	beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _appHttp_, _UserModel_, _appConfig_) {
		appConfig =_appConfig_;
		appHttp =_appHttp_;
		UserModel =_UserModel_;
		$httpBackend = _$httpBackend_;
		var url =appConfig.dirPaths.ajaxUrl.api+"user/logout";
		var user =false;
		if(0) {
		if(0) {
		var fullUrl =LHttp.query({'method':'jsonp', 'url':url, 'params':{'user':user}, 'ppCustom':{'testMock':true} });
		$httpBackend.expectJSONP(fullUrl);
		}
		else {
		//function copied from angular.js source code parseKeyValue function
		var parseUrlEncoded =function(urlArgsString) {
			if(urlArgsString[0] =='?') {
				urlArgsString =urlArgsString.slice(1,urlArgsString.length);
			}
			var obj = {}, key_value, key;
			var vars =urlArgsString.split('&');
			for(var ii=0; ii<vars.length; ii++) {
				if(vars[ii]) {
					var pair =vars[ii].split('=');
					key = decodeURIComponent(pair[0]);
					if(pair[1] !==undefined) {
						obj[key] = decodeURIComponent(pair[1]);
					}
				}
			}
			return obj;
		}
		var unorderedArgs =function(url, params) {
			return {
				test: function(requestedUrl) {
					// check the base url (i.g. /some/url)
					if (requestedUrl.indexOf(url) !== 0) return false;
					var urlEncodedArgs = requestedUrl.substr(url.length);
					return angular.equals(params, parseUrlEncoded(urlEncodedArgs));
				}
			};
		}
		// var urlParams =LHttp.query({'method':'jsonp', 'url':url, 'params':{'user':user}, 'ppCustom':{'testMock':true} });
		// $httpBackend.expectJSONP(unorderedArgs(url, urlParams)).respond();
		var urlRegExp =LHttp.query({'method':'jsonp', 'url':url, 'params':{'user':user}, 'ppCustom':{'testMock':true} });
		$httpBackend.expectJSONP(urlRegExp).respond();
		}
		}
		
		if(0) {
		var urlRegExp =LHttp.query({'method':'jsonp', 'url':url, 'params':{'user':user}, 'ppCustom':{'testMock':true} });
		$httpBackend.expectJSONP(urlRegExp).respond();
		}
		else {
		$httpBackend.expectPOST('/api/auth/').respond();
		}
		
		scope = $rootScope.$new();
		ctrl = $controller('LogoutCtrl', {$scope: scope});
	}));

	it('should have user be empty after logout XHR call', function() {
		$httpBackend.flush();
		var user =UserModel.load();
		expect(user).toEqual({});
	});
});

*/