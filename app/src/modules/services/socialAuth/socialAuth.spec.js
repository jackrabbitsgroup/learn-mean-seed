//@todo
'use strict';

describe('appSocialAuth', function(){
	var ctrl, scope ={}, $httpBackend, appHttp, appAuth, appConfig, UserModel;

    beforeEach(module('app'));
	
	beforeEach(inject(function($rootScope, $controller, $injector, _appHttp_, _appAuth_, _appConfig_, _UserModel_) {
		appHttp =_appHttp_;
		appAuth =_appAuth_;
		appConfig =_appConfig_;
		UserModel =_UserModel_;
		$httpBackend = $injector.get('$httpBackend');
		
		scope = $rootScope.$new();
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

});

