'use strict';

describe('TestCtrl', function(){
	var $ctrl, $scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_) {
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('TestCtrl', {$scope: $scope});
	}));
	
	it('should be called', function() {
	});
});