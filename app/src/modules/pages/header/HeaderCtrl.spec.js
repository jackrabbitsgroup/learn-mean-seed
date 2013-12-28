'use strict';

describe('HeaderCtrl', function(){
	var $ctrl, $scope ={}, appNav;
	var createController;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _appNav_) {
		$scope = _$rootScope_.$new();
		appNav =_appNav_;
		createController =function() {
			return $ctrl = _$controller_('HeaderCtrl', {$scope: $scope});
		};
	}));
	
	it('should be called and set nav', function() {
		appNav.updateNav({urlInfo: {page:'home'} });
		createController();
	});
	
	it('should listen for appNavHeaderUpdate event', function() {
		createController();
		var nav ={
			header: undefined
		};
		$scope.$emit('appNavHeaderUpdate', {nav: nav});
		expect($scope.classes.cont).toBe('');
	});
	
	it('should set classes.cont to hidden appropriately', function() {
		createController();
		var nav ={
			header: {
				classes: {
					cont: 'hidden'
				}
			}
		};
		$scope.$emit('appNavHeaderUpdate', {nav: nav});
		expect($scope.classes.cont).toBe(nav.header.classes.cont);
	});
});