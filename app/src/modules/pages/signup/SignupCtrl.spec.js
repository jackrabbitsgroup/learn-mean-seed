'use strict';

describe('SignupCtrl', function(){
	var $ctrl, $scope ={}, $httpBackend;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_) {
		$httpBackend =_$httpBackend_;
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('SignupCtrl', {$scope: $scope});
	}));
	
	it('should have working signup function', function() {
		var callbackCalled =false;
		var user ={
			_id: '2l3kdla',
			sess_id: '82823ka',
			first_name: 'First',
			last_name: 'Last'
		};
		$httpBackend.expectPOST('/api/auth/create').respond({result: {user: user}});
		var vals ={
			first_name: 'First',
			last_name: 'Last',
			email: 'some@email.com',
			password: 'password',
			password_confirm: 'password'
		};
		$scope.signup({vals: vals}, function(params) {
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