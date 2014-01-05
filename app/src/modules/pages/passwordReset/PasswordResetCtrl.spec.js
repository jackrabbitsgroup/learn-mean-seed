/**
@todo
- better event ($emit) testing - be able to use $scope.$on and test/expect individual params rather than requiring an EXACT match or just expecting that the event got called..
*/

'use strict';

describe('PasswordResetCtrl', function(){
	var $ctrl, $scope ={}, $httpBackend, $timeout, $controller, $routeParams;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _$timeout_, _$routeParams_) {
		$httpBackend =_$httpBackend_;
		$routeParams =_$routeParams_;
		$timeout =_$timeout_;
		// $rootScope =_$rootScope_;
		$scope = _$rootScope_.$new();
		$controller =_$controller_;
	}));
	
	function setup(params) {
		/*
		//this does NOT work - apparently have to set keys individually; can't assign the entire object
		if(params.routeParams) {
			$routeParams =params.routeParams;
		}
		*/
		if(params.routeParams !=undefined) {
			for(var xx in params.routeParams) {
				$routeParams[xx] =params.routeParams[xx];
			}
		}
		
		$ctrl = $controller('PasswordResetCtrl', {$scope: $scope});
	}
	
	it('should have working submitForm function', function() {
		setup({});
		var user ={
			_id: '2l3kdla',
			sess_id: '82823ka',
			first_name: 'First',
			last_name: 'Last'
		};
		$httpBackend.expectPOST('/api/auth/resetPassword').respond({result: {user: user}});
		
		$scope.formVals ={
			email: 'some@email.com',
			password_reset_key: 'kleae',
			password: 'password',
			password_confirm: 'password'
		};
		$scope.$digest();		//validate form - UPDATE: this doesn't work without $compile function (i.e. works for unit testing directives but not controllers.. unless you want to mock out all the template HTML & $compile it too..
		// http://stackoverflow.com/questions/17106201/angularjs-how-to-mock-a-formcontroller-injected-in-scope
		// http://stackoverflow.com/questions/19156613/unit-test-controller-that-depends-on-form-validation-in-angularjs
		//manually make form valid
		$scope.passResetForm ={
			$valid: true
		};
		$scope.submitForm();
		
		// expect($scope.$emit).toHaveBeenCalledWith('evtAppalertAlert', {close:true});
		
		//this works ONLY because it's inside an http request.. otherwise events have timing issues..
		$scope.$on('loginEvt', function(evt, params) {
			expect(params.loggedIn).toBe(true);
			expect(params.user_id).toBe(user._id);
			expect(params.sess_id).toBe(user.sess_id);
		});
		
		$httpBackend.flush();
		$scope.$digest();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should not validate with mis-matching passwords', function() {
		setup({});
		// spyOn($scope, '$emit');		//UPDATE: not necessary! (and in fact if include this, it will 'mock' the $emit event and the $scope.$on below will NOT work.
		
		var errorCalled =false;
		$scope.formVals ={
			email: 'some@email.com',
			password_reset_key: 'kleae',
			password: 'password',
			password_confirm: 'NOTpassword'
		};
		
		//NOTE: this must be defined BEFORE calling $scope.submitForm()!!
		$scope.$on('evtAppalertAlert', function(evt, params) {
			errorCalled =true;
		});
		
		$scope.passResetForm ={
			$valid: true
		};
		$scope.submitForm();
		
		$scope.$digest();
		expect(errorCalled).toBe(true);
		//UPDATE: not needed!
		// expect($scope.$emit).toHaveBeenCalledWith('evtAppalertAlert', {type:'error'});
		// expect($scope.$emit).toHaveBeenCalled();
	});
	
	describe('route params', function() {
		it('should have empty scope form vals by default', function() {
			setup({});
			expect($scope.formVals.email).not.toBeDefined();
			expect($scope.formVals.password_reset_key).not.toBeDefined();
		});
		
		it('should fill email and password reset key if set in route params', function() {
			var routeParams ={'email':'test@gmail.com', 'reset_key':'keo345'};
			setup({'routeParams':routeParams});
			
			expect($scope.formVals.email).toBe('test@gmail.com');
			expect($scope.formVals.password_reset_key).toBe('keo345');
		});

	});
	
});