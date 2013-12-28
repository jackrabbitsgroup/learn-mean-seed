/**
*/

'use strict';

describe('LogoutCtrl', function(){
	var $ctrl, $scope ={}, $httpBackend, $controller;

	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_) {
		$httpBackend =_$httpBackend_;
		$scope = _$rootScope_.$new();
		
		$controller =_$controller_;		//save for later
		/*
		//now moving this to it blocks to test error response as well
		
		//need to set this BEFORE init the controller since the controller with immediately run the logout http request!
		$httpBackend.expectPOST('/api/auth/logout').respond({result: true});
		
		$ctrl = _$controller_('LogoutCtrl', {$scope: $scope});
		
		//need to do this for the auto-run logout http request
		$httpBackend.flush();
		$scope.$digest();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
		*/
	}));
	
	it('should work with success promise', function() {
		//need to set this BEFORE init the controller since the controller with immediately run the logout http request!
		$httpBackend.expectPOST('/api/auth/logout').respond({result: true});
		
		$ctrl = $controller('LogoutCtrl', {$scope: $scope});
		
		//need to do this for the auto-run logout http request
		$httpBackend.flush();
		$scope.$digest();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	it('should work with error/failure promise', function() {
		//need to set this BEFORE init the controller since the controller with immediately run the logout http request!
		$httpBackend.expectPOST('/api/auth/logout').respond({ error:{code:500, msg:'bad request'} });
		
		$ctrl = $controller('LogoutCtrl', {$scope: $scope});
		
		//need to do this for the auto-run logout http request
		$httpBackend.flush();
		$scope.$digest();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
});