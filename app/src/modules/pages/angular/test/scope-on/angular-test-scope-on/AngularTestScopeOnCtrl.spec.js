'use strict';

describe('AngularTestScopeOnCtrl', function() {
	var $ctrl, $scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_) {
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('AngularTestScopeOnCtrl', {$scope: $scope});
	}));
	
	it('should broadcast evtBroadcast event', function() {
		var onCalled =false;
		$scope.$on('evtBroadcast', function(evt, params) {
			expect(params.p1).toBe('broadcast1');
			expect(params.p2).toBe('broadcast2');
			onCalled =true;
		});
		
		//should start false
		expect(onCalled).toBe(false);
		
		$scope.doBroadcast({});
		expect(onCalled).toBe(true);
	});
	
	//TASK 1: add an 'it' block test here for testing 'evtEmit'
	
	it('should listen for evtOn event', function() {
		var params ={
			p1: 'on1',
			p3: 'on3'
		};
		//should start false
		expect($scope.onCalled).toBe(false);
		
		$scope.$broadcast('evtOn', params);
		expect($scope.onParams.p1).toBe(params.p1);
		
		//TASK 2: add an 'expect' to test the value of the $scope.onParams.p3
		
		expect($scope.onCalled).toBe(true);
	});
});