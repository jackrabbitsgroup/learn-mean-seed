'use strict';

describe('FooterCtrl', function(){
	var $ctrl, $scope ={}, appNav;
	var createController;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _appNav_) {
		$scope = _$rootScope_.$new();
		appNav =_appNav_;
		createController =function() {
			return $ctrl = _$controller_('FooterCtrl', {$scope: $scope});
		};
	}));
	
	it('should be called and set nav', function() {
		appNav.updateNav({urlInfo: {page:'home'} });
		createController();
	});
	
	it('should listen for appNavFooterUpdate event', function() {
		createController();
		var nav ={
			footer: undefined
		};
		$scope.$emit('appNavFooterUpdate', {nav: nav});
		expect($scope.classes.cont).toBe('');
	});
	
	it('should set classes.cont to hidden appropriately', function() {
		createController();
		var nav ={
			footer: {
				classes: {
					cont: 'hidden'
				}
			}
		};
		$scope.$emit('appNavFooterUpdate', {nav: nav});
		expect($scope.classes.cont).toBe(nav.footer.classes.cont);
	});
});