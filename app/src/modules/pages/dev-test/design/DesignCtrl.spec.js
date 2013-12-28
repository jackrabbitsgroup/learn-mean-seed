'use strict';

describe('DesignCtrl', function(){
	var $ctrl, $scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_) {
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('DesignCtrl', {$scope: $scope});
	}));
	
	it('should have a colors array', function() {
		expect($scope.colors).toBeDefined();
	});
});