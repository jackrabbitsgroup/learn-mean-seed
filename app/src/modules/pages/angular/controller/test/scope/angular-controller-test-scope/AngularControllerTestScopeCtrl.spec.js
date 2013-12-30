'use strict';

describe('AngularControllerTestScopeCtrl', function() {
	var $ctrl, $scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_) {
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('AngularControllerTestScopeCtrl', {$scope: $scope});
	}));
	
	it('should do something', function() {
		expect($scope.testVar).not.toBeDefined();
		// expect($scope.testVar).toBeDefined();
		expect($scope.testVar).toBe('no');
		// expect($scope.testVar).toBe('[Correct Val Here]');
	});
});