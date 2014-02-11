'use strict';

describe('TwitterAuthCallbackCtrl', function(){
	var $ctrl, $scope ={}, $httpBackend, $routeParams, $controller;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _$routeParams_) {
		$httpBackend =_$httpBackend_;
		$routeParams =_$routeParams_;
		$scope = _$rootScope_.$new();
		
		// $ctrl = _$controller_('TwitterAuthCallbackCtrl', {$scope: $scope});		//can't call here since need to set $routeParams FIRST in some tests
		$controller =_$controller_;
	}));
	
	it('should not make backend api twitter accessToken request without proper $routeParams', function() {
		$ctrl = $controller('TwitterAuthCallbackCtrl', {$scope: $scope});
	});
	
	it('should make backend api twitter accessToken request if $routeParams are set properly', function() {
		$routeParams.oauth_token ='oauthToken';
		$routeParams.oauth_verifier ='oauthVerifier';
		
		var user ={
			_id: 'userId',
			sess_id: 'sessId'
		};
		$httpBackend.expectPOST('/api/twitter/accessToken').respond({result: {user: user } });
		
		$ctrl = $controller('TwitterAuthCallbackCtrl', {$scope: $scope});
		
		$httpBackend.flush();
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
});