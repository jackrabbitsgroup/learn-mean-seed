'use strict';

describe('LoginCtrl', function(){
	var $ctrl, $scope ={}, $httpBackend;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_) {
		$httpBackend =_$httpBackend_;
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('LoginCtrl', {$scope: $scope});
	}));
	
	it('should have working login function', function() {
		var callbackCalled =false;
		var user ={
			_id: '2l3kdla',
			sess_id: '82823ka',
			first_name: 'First',
			last_name: 'Last'
		};
		$httpBackend.expectPOST('/api/auth/login').respond({result: {user: user}});
		var vals ={
			email: 'some@email.com',
			password: 'password'
		};
		$scope.login({vals: vals}, function(params) {
			callbackCalled =true;
		});
		
		$scope.$on('loginEvt', function(evt, params) {
			expect(params.loggedIn).toBe(true);
			expect(params.user_id).toBe(user._id);
			expect(params.sess_id).toBe(user.sess_id);
		});
		
		expect(callbackCalled).toBe(false);
		$httpBackend.flush();
		$scope.$digest();
		expect(callbackCalled).toBe(true);
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should have working forgotPass function', function() {
		var callbackCalled =false;
		$httpBackend.expectPOST('/api/auth/forgotPassword').respond({result: true});
		var vals ={
			email: 'some@email.com'
		};
		$scope.forgotPass(vals, function(params) {
			callbackCalled =true;
		});
		
		expect(callbackCalled).toBe(false);
		$httpBackend.flush();
		$scope.$digest();
		expect(callbackCalled).toBe(true);
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});