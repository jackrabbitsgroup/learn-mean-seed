/**
@todo
- remove hardcoding of expectGET requests (needs exact matching..??)
*/

'use strict';

describe('appHttp', function(){
	var $rootScope ={}, $httpBackend, appHttp, $timeout, appConfig, $cookieStore, appStorage;

	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _appHttp_, _$httpBackend_, _$timeout_, _appConfig_, _$cookieStore_, _appStorage_) {
		$cookieStore =_$cookieStore_;
		appConfig =_appConfig_;
		$timeout =_$timeout_;
		$httpBackend =_$httpBackend_;
		appStorage =_appStorage_;
		appHttp =_appHttp_;
		$rootScope = _$rootScope_;
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should login a user', function() {
		// $httpBackend.expectPOST('/api/auth/');
		// $httpBackend.when('POST', '/api/auth/').respond({result: true});
		// $httpBackend.when('POST', '/api/auth/').respond({ error:{code:500, msg:'bad request'} });
		$httpBackend.expectPOST('/api/auth/login').respond({result: true});
		// scope.$apply();

		var user;
		var loginVals ={
			email: 't@t.com',
			password: 'testing'
		};
		// var promise1 =appHttp.go({method:'Auth.login'}, {data:loginVals}, {});
		var promise1 =appHttp.go({}, {url:'auth/login', data:loginVals}, {});
		promise1.then(function(response) {
			user =response.result;
		});
		
		/*
		//@todo - can events be tested??
		var evt =false;
		scope.$on('evtAppalertAlert', function(evt, opts) {
			evt =true;
		});
		*/

		$httpBackend.flush();
		// $rootScope.$apply();
		$rootScope.$digest();
		expect(user).toBe(true);
		//expect(user).not.toBeDefined();
		//expect(evt).toBe(true);
	});
	
	it('should work without any logged in user (neither cookies nor local storage)', function() {
		$cookieStore.remove('sess_id');
		$cookieStore.remove('user_id');
		appStorage.delete1('user');
		
		$httpBackend.expectPOST('/api/dummy').respond({result:true});
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		
		$httpBackend.flush();
		$rootScope.$digest();
	});
	
	it('should send authorization if have them in cookies', function() {
		$cookieStore.put('sess_id', 'sessId');
		$cookieStore.put('user_id', 'userId');
		
		$httpBackend.expectPOST('/api/dummy').respond({result:true});
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		
		$httpBackend.flush();
		$rootScope.$digest();
	});
	
	it('should support rpcMethod instead of url', function() {
		$httpBackend.expectPOST('/api/auth/').respond({result: true});
		var promise1 =appHttp.go({method:'Auth.login'}, {data:{}}, {});
		$rootScope.$digest();
		$httpBackend.flush();
		expect(1).toBe(1);
	});
	
	it('should auto timeout if taking too long', function() {
		var promise1;
		$httpBackend.expectPOST('/api/dummy').respond({result: true});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {noLoadingScreen:true});
		
		$httpBackend.expectPOST('/api/dummy').respond({result: true});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		
		$timeout.flush();
		
		$httpBackend.flush();
	});
	
	/*
	it('should cancel timeout if a new call starts before the other finishes', function() {
		var promise1;
		$httpBackend.expectPOST('/api/dummy').respond({result: true});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {noLoadingScreen:true});
		
		$httpBackend.expectPOST('/api/dummy').respond({result: true});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		
		appHttp.timeoutTrigs
		$httpBackend.flush();
		// $httpBackend.flush();
	});
	*/
	
	it('should handle GET requests', function() {
		var promise1;
		// var getString ='/api/dummy?rpc=%7B%22jsonrpc%22:%222.0%22,%22id%22:1,%22params%22:%7B%22authority_keys%22:%7B%22user_id%22:%22id%22%7D%7D%7D';		//hardcoded!!
		var getString ='/api/dummy?rpc=%7B%22jsonrpc%22:%222.0%22,%22id%22:1,%22params%22:%7B%7D%7D';		//hardcoded!!
		$httpBackend.expectGET(getString).respond({result: true});
		// $httpBackend.when('GET', '/api/dummy').respond({result: true});
		promise1 =appHttp.go({}, {method:'GET', url:'dummy', params:{}}, {});
		
		$httpBackend.flush();
		expect(1).toBe(1);
	});
	
	it('should support CORS', function() {
		var promise1;
		appConfig.dirPaths.useCorsUrls.all =1;
		$httpBackend.expectPOST(appConfig.dirPaths.ajaxUrlParts.main+'api/dummy').respond({result: true});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		$httpBackend.flush();
	});
	
	it('should not show/emit loading event if noLoadingScreen param is set', function() {
		// spyOn($rootScope, '$broadcast');
		var loadingCalled =false;
		$httpBackend.expectPOST('/api/dummy').respond({result: true});
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, {noLoadingScreen:true});
		// promise1.then(function(response) {
		// });
		
		expect(loadingCalled).toBe(false);
		$rootScope.$on('evtLoadingDone', function(evt, params) {
			// console.log('evtLoadingDone called');
			loadingCalled =true;
		});
		
		$httpBackend.flush();
		$rootScope.$digest();
		// expect($rootScope.$broadcast).
		expect(loadingCalled).toBe(false);
		
		//loading SHOULD be called if no noLoadingScreen
		$httpBackend.expectPOST('/api/dummy').respond({result: true});
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		$httpBackend.flush();
		$rootScope.$digest();
		expect(loadingCalled).toBe(true);
	});
	
	it('should handle error object in response', function() {
		var errorCalled =false;
		$httpBackend.expectPOST('/api/dummy').respond({error: {msg: 'error!'} });
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		
		expect(errorCalled).toBe(false);
		
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
	});
	
	it('should handle error (i.e. 500) return', function() {
		var errorCalled =false;
		$httpBackend.expectPOST('/api/dummy').respond(500, {});
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		
		expect(errorCalled).toBe(false);
		
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
		
		//should handle 0 status too
		errorCalled =false;		//reset
		$httpBackend.expectPOST('/api/dummy').respond(0, {});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {noLoadingScreen:true});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
		
		//should handle 401 status too
		errorCalled =false;		//reset
		$httpBackend.expectPOST('/api/dummy').respond(401, {noLoadingScreen:false});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
		
		//should handle 401 status with message too
		errorCalled =false;		//reset
		$httpBackend.expectPOST('/api/dummy').respond(401, {status:'401'});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
		
		//should handle all other status codes with a message
		errorCalled =false;		//reset
		$httpBackend.expectPOST('/api/dummy').respond(10, {msg:'error msg'});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
		
		//should handle all other status codes WITHOUT a message
		errorCalled =false;		//reset
		$httpBackend.expectPOST('/api/dummy').respond(10, {});
		promise1 =appHttp.go({}, {url:'dummy', data:{}}, {});
		promise1.then(function(ret) {
		}, function(err) {
			errorCalled =true;
		});
		$httpBackend.flush();
		$rootScope.$digest();
		expect(errorCalled).toBe(true);
	});
	
	it('should support custom success message', function() {
		var successCalled =false;
		$httpBackend.expectPOST('/api/dummy').respond({result:true});
		var params ={
			msgSuccess: 'success!'
		};
		var promise1 =appHttp.go({}, {url:'dummy', data:{}}, params);
		// promise1.then(function(ret) {
		// }, function(err) {
		// });
		
		expect(successCalled).toBe(false);
		$rootScope.$on('evtAppalertAlert', function(evt, params1) {
			expect(params1.msg).toBe(params.msgSuccess);
			successCalled =true;
		});
		
		$httpBackend.flush();
		$rootScope.$digest();
		expect(successCalled).toBe(true);
	});
});

