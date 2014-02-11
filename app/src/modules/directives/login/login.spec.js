'use strict';

describe('appLogin', function () {
	var elm, elmScope, $scope, $compile, $timeout, $httpBackend;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _$httpBackend_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		$httpBackend = _$httpBackend_;
		$scope = _$rootScope_.$new();
		
		$httpBackend.expectPOST('/api/twitter/requestToken').respond({result: {} });
	}));
	
	afterEach(function() {
		$httpBackend.flush();		//twitter requestToken
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	/**
	@param params
	*/
	var createElm =function(params) {
		var html ="<div app-login>"+
		"</div>";
		if(params.html) {
			html =params.html;
		}
		// elm =angular.element(html);
		elm =$compile(html)($scope);
		// $scope.$digest();
		$scope.$apply();		//NOTE: required otherwise the alert directive won't be compiled!!!! ... wtf?
		elmScope =elm.isolateScope();
		var elements ={
		};
		return elements;
	};
	
	it('should toggle forgot password visibility', function() {
		var eles =createElm({});
		expect(elmScope.forgotPassVisible).toBe(false);
		elmScope.toggleForgotPass({});
		expect(elmScope.forgotPassVisible).toBe(true);
		elmScope.toggleForgotPass({});
		expect(elmScope.forgotPassVisible).toBe(false);
	});
	
	it('should call forgotPass function', function() {
		var forgotPassCalled =false;
		
		var html ="<div app-login forgot-pass='forgotPass'></div>";
		var eles =createElm({html:html});
		
		//should NOT work if forgotPass function is not defined
		elmScope.formVals ={
			email: 'test@email.com'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.forgotPassDtv({});
		
		$scope.forgotPass =function(params, callback) {
			expect(params.email).toBe(elmScope.formVals.email);
			forgotPassCalled =true;
			callback({});
		};
		
		//should NOT be called if invalid formVals (i.e. no email)
		elmScope.formVals ={};
		$scope.$digest();		//need the form to be valid
		elmScope.forgotPassDtv({});
		expect(forgotPassCalled).toBe(false);
		
		//now SHOULD be called
		elmScope.formVals ={
			email: 'test@email.com'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.forgotPassDtv({});
		expect(forgotPassCalled).toBe(true);
	});
	
	it('should call login function', function() {
		var loginCalled =false;
		
		var html ="<div app-login login='login'></div>";
		var eles =createElm({html:html});
		
		//should NOT work if login function not defined
		elmScope.formVals ={
			email: 'test@email.com',
			password: 'password'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		
		$scope.login =function(params, callback) {
			expect(params.vals.email).toBe(elmScope.formVals.email);
			expect(params.vals.password).toBe(elmScope.formVals.password);
			loginCalled =true;
			callback({});
		};
		
		//should NOT be called if invalid formVals (i.e. no email)
		elmScope.formVals ={};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(loginCalled).toBe(false);
		
		//now SHOULD be called
		elmScope.formVals ={
			email: 'test@email.com',
			password: 'password'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(loginCalled).toBe(true);
	});
	
});	