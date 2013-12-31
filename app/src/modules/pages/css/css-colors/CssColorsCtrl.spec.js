'use strict';

describe('CssColorsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssColorsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});