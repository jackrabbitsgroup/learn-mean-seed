'use strict';

describe('appAuth', function(){
	var $rootScope ={}, $httpBackend, appAuth, $cookieStore, UserModel, appHttp, appConfig, appStorage, $location;
	
	function formLocationAbsUrl(urlPart, params) {
		return 'http://server/'+urlPart;
	}

	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$httpBackend_, _appAuth_, _$cookieStore_, _UserModel_, _appHttp_, _appConfig_, _appStorage_, _$location_) {
		appHttp =_appHttp_;
		appStorage =_appStorage_;
		appConfig =_appConfig_;
		$cookieStore =_$cookieStore_;
		UserModel =_UserModel_;
		$httpBackend = _$httpBackend_;
		$rootScope = _$rootScope_;
		$location =_$location_;
		appAuth =_appAuth_;
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should not init twice', function() {
		appAuth.init({});
	});
	
	it('should broadcast loading event on routeChange', function() {
		var loadingCalled =false;
		$rootScope.$on('evtLoadingStart', function(evt, params) {
			loadingCalled =true;
		});
		$rootScope.$broadcast('$routeChangeStart', {}, false, false);
		expect(loadingCalled).toBe(true);
	});
	
	it('should check auth if set', function() {
		var user;
		
		$location.$$absUrl =formLocationAbsUrl('somepage?p1=yes', {});
		
		//logged in required but not logged in
		appConfig.state.loggedIn =false;		//ensure not logged in
		appAuth.checkSess({
			auth: {
				loggedIn: {}
			}
		})
		.then(function(ret) {
		}, function(ret) {
			expect(ret.valid).toBe(false);
		});
		$rootScope.$digest();
		
		//logged in required but not logged in BUT exception url page
		$location.$$absUrl =formLocationAbsUrl('somepage?p2=no&p1=yes', {});
		appConfig.state.loggedIn =false;		//ensure not logged in
		appAuth.checkSess({
			auth: {
				loggedIn: {
					exceptionUrlParamsRegex: {
						p1: '.*'		//will match anything so as long as 'p1' URL param is present, will be allowed, even if not logged in
					}
				}
			}
		})
		.then(function(ret) {
			expect(ret.valid).toBe(true);
		}, function(ret) {
		});
		$rootScope.$digest();
		
		//logged in required but not logged in and no matching exception url params
		$location.$$absUrl =formLocationAbsUrl('somepage?p2=no&p1=yes', {});
		appConfig.state.loggedIn =false;		//ensure not logged in
		appAuth.checkSess({
			auth: {
				loggedIn: {
					redirect: 'test',
					exceptionUrlParamsRegex: {
						p1: 'nope'		//will match anything so as long as 'p1' URL param is present, will be allowed, even if not logged in
					}
				}
			}
		})
		.then(function(ret) {
		}, function(ret) {
			expect(ret.valid).toBe(false);
		});
		$rootScope.$digest();
		
		//logged in required and logged in
		appConfig.state.loggedIn =true;
		appAuth.checkSess({
			auth: {
				loggedIn: {}
			}
		})
		.then(function(ret) {
			expect(ret.valid).toBe(true);
		}, function(ret) {
		});
		$rootScope.$digest();
		
		//member required but NOT a member
		UserModel.destroy({});		//ensure no user
		appAuth.checkSess({
			auth: {
				member: {
					redirect: 'auth-member'
				}
			}
		})
		.then(function(ret) {
		}, function(ret) {
			expect(ret.valid).toBe(false);
		});
		$rootScope.$digest();
		
		//member required but NOT a member BUT exception url params
		$location.$$absUrl =formLocationAbsUrl('somepage?p2=no&p1=yes', {});
		UserModel.destroy({});		//ensure no user
		appAuth.checkSess({
			auth: {
				member: {
					redirect: 'auth-member',
					exceptionUrlParamsRegex: {
						p1: 'yes'		//will match anything so as long as 'p1' URL param is present, will be allowed, even if not logged in
					}
				}
			}
		})
		.then(function(ret) {
			expect(ret.valid).toBe(true);
		}, function(ret) {
		});
		$rootScope.$digest();
		
		//member required but NOT a member and NO matching exception url params
		$location.$$absUrl =formLocationAbsUrl('somepage?p2=no&p1=yes', {});
		UserModel.destroy({});		//ensure no user
		appAuth.checkSess({
			auth: {
				member: {
					redirect: 'auth-member',
					exceptionUrlParamsRegex: {
						p1: 'yes1'		//will match anything so as long as 'p1' URL param is present, will be allowed, even if not logged in
					}
				}
			}
		})
		.then(function(ret) {
		}, function(ret) {
			expect(ret.valid).toBe(false);
		});
		$rootScope.$digest();
		
		//member required and a member
		user ={
			status: 'member'
		};
		UserModel.save(user);
		appAuth.checkSess({
			auth: {
				member: {
					redirect: 'auth-member'
				}
			}
		})
		.then(function(ret) {
			expect(ret.valid).toBe(true);
		}, function(ret) {
		});
		$rootScope.$digest();
	});
	
	it('should check auth if set but should resolve if on same page already', function() {
		$location.$$absUrl =$location.$$absUrl =formLocationAbsUrl('auth-member', {});
		
		//member required but NOT a member BUT already on the redirect page
		// appAuth.data.urlInfo.page ='auth-member';		//doesn't work; gets overwritten
		
		appStorage.delete1('user', {});		//ensure no user
		UserModel.destroy({});		//ensure no user
		appAuth.checkSess({
			auth: {
				member: {
					redirect: 'auth-member'
				}
			}
		})
		.then(function(ret) {
			expect(ret.valid).toBe(false);
		}, function(ret) {
		});
		$rootScope.$digest();
	});
	
	it('should not save url for skip pages', function() {
		$location.$$absUrl =$location.$$absUrl =formLocationAbsUrl('signup', {});
		appAuth.checkSess({});
		$rootScope.$digest();
	});
	
	it('should not check login status backend api if cookie is not set', function() {
		var user ={
			_id: '2382aca',
			email: 'test@gmail.com'
		};
		appConfig.state.loggedIn =false;
		var promiseStorage =appStorage.delete1();		//ensure no local storage
		promiseStorage.then(function(ret1) {
			$cookieStore.remove('user_id');
			$cookieStore.remove('sess_id');
			
			var promise1 =appAuth.checkSess({});
			promise1.then(function(response) {
				expect(response.goTrig).toBe(true);
			});
			
			//get deferred to resolve
			// $rootScope.$apply();
			$rootScope.$digest();
		});
	});

	it('should not check login status backend api if already logged in', function() {
		var user ={
			_id: '2382aca',
			email: 'test@gmail.com',
			sess_id: '38asdflke'
		};
		appConfig.state.loggedIn =true;
		$cookieStore.put('user_id', user._id);
		$cookieStore.put('sess_id', user.sess_id);
		
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(true);
		});
		
		//get deferred to resolve
		// $rootScope.$apply();
		$rootScope.$digest();
	});
	
	it('should use appStorage if user is set', function() {
		var user ={
			_id: '2382aca',
			email: 'test@gmail.com',
			sess_id: '38asdflke'
		};
		appStorage.save('user', user, {});
		appConfig.state.loggedIn =false;
		
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(false);
		});
		
		//get deferred to resolve
		$rootScope.$digest();
	});
	
	it('should use appStorage if user is set AND use redirect url', function() {
		var user ={
			_id: '2382aca',
			email: 'test@gmail.com',
			sess_id: '38asdflke'
		};
		appStorage.save('user', user, {});
		
		appConfig.state.loggedIn =false;
		
		//start with non-skip page to get redirectUrl to be saved in cookie
		$location.$$absUrl =$location.$$absUrl =formLocationAbsUrl('pre-redirect-page', {});
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(false);
		});
		
		//start with skip page to get redirectUrl to pulled from cookie
		$location.$$absUrl =$location.$$absUrl =formLocationAbsUrl('login', {});
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(false);
		});
		
		//get deferred to resolve
		$rootScope.$digest();
		
		$location.$$absUrl =$location.$$absUrl =formLocationAbsUrl('redirect-page', {});
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(false);
		});
		
		//get deferred to resolve
		$rootScope.$digest();
	});
	
	it('should use backend API if NOT logged in, NO storage, but cookie IS set', function() {
		var user ={
			_id: 'user1',
			email: 'test1@gmail.com',
			sess_id: 'sess1'
		};
		
		$httpBackend.expectPOST('/api/auth/active').respond({result: {user: user} });
		
		$cookieStore.put('user_id', user._id);
		$cookieStore.put('sess_id', user.sess_id);
		
		appConfig.state.loggedIn =false;
		
		// appStorage.delete1();		//not working?!?
		appStorage.delete1('user', {});
		$rootScope.$digest();
		
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(false);
			//check to ensure user is saved properly in UserModel
			var userLoad =UserModel.load();
			expect(userLoad._id).toBeTruthy();
		});
		
		//get deferred to resolve
		$rootScope.$digest();
		$httpBackend.flush();
	});
	
	it('should use backend API if NOT logged in, NO storage, but cookie IS set AND clear cookies if backend error', function() {
		var user ={
			_id: 'user1',
			email: 'test1@gmail.com',
			sess_id: 'sess1'
		};
		
		$httpBackend.expectPOST('/api/auth/active').respond(500, {});
		
		$cookieStore.put('user_id', user._id);
		$cookieStore.put('sess_id', user.sess_id);
		
		appConfig.state.loggedIn =false;
		
		// appStorage.delete1();		//not working?!?
		appStorage.delete1('user', {});
		$rootScope.$digest();
		
		var promise1 =appAuth.checkSess({});
		promise1.then(function(response) {
			expect(response.goTrig).toBe(false);
			//check to ensure user is NOT in UserModel
			// var userLoad =UserModel.load();
			// expect(userLoad._id).toBeFalsy();
			
			//ensure cookies were cleared
			var cookieSess =$cookieStore.get('sess_id');
			var cookieUser =$cookieStore.get('user_id');
			expect(cookieSess).not.toBeTruthy();
			expect(cookieUser).not.toBeTruthy();
		});
		
		//get deferred to resolve
		$rootScope.$digest();
		$httpBackend.flush();
	});
});

