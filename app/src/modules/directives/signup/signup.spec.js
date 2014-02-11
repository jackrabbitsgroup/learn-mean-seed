'use strict';

describe('appSignup', function () {
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
		var html ="<div app-signup>"+
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
	
	it('should call signup function', function() {
		var signupCalled =false;
		var name ={
			first: 'first',
			last: 'last'
		};
		
		var html ="<div app-signup signup='signup'></div>";
		var eles =createElm({html:html});
		
		//should NOT work if signup function not defined
		elmScope.formVals ={
			name: name.first+' '+name.last,
			email: 'test@email.com',
			password: 'password',
			password_confirm: 'password'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		
		$scope.signup =function(params, callback) {
			//should break name into first and last name
			expect(params.vals.name).toBe(undefined);
			expect(params.vals.first_name).toBe(name.first);
			expect(params.vals.last_name).toBe(name.last);
			expect(params.vals.email).toBe(elmScope.formVals.email);
			expect(params.vals.password).toBe(elmScope.formVals.password);
			signupCalled =true;
			callback({});
		};
		
		//should NOT work if passwords do not match
		elmScope.formVals ={
			name: name.first+' '+name.last,
			email: 'test@email.com',
			password: 'password',
			password_confirm: 'NOTpassword'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(signupCalled).toBe(false);
		
		//should NOT work without first and last name
		elmScope.formVals ={
			name: 'firstnameonly',
			email: 'test@email.com',
			password: 'password',
			password_confirm: 'password'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(signupCalled).toBe(false);
		
		//should NOT work if first or last name is too short
		elmScope.formVals ={
			name: 'first l',
			email: 'test@email.com',
			password: 'password',
			password_confirm: 'password'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(signupCalled).toBe(false);
		
		//should NOT be called if invalid formVals (i.e. no email)
		elmScope.formVals ={};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(signupCalled).toBe(false);
		
		//now SHOULD be called
		elmScope.formVals ={
			name: name.first+' '+name.last,
			email: 'test@email.com',
			password: 'password',
			password_confirm: 'password',
			phone_number: '8005551234'
		};
		$scope.$digest();		//need the form to be valid
		elmScope.submitForm({});
		expect(signupCalled).toBe(true);
	});
	
});	