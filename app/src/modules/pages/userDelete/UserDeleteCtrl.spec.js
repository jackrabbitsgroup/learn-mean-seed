'use strict';

describe('UserDeleteCtrl', function(){
	var $ctrl, $scope ={}, $httpBackend, $controller;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_) {
		$httpBackend =_$httpBackend_;
		$scope = _$rootScope_.$new();
		
		$controller =_$controller_;		//save for later
	}));
	
	it('should work with success promise', function() {
		//need to set this BEFORE init the controller since the controller with immediately run the logout http request!
		$httpBackend.expectPOST('/api/user/delete1').respond({result: true});
		
		$ctrl = $controller('UserDeleteCtrl', {$scope: $scope});
		
		//need to do this for the auto-run logout http request
		$httpBackend.flush();
		$scope.$digest();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});