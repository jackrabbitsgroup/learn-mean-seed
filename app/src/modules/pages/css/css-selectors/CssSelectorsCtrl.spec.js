'use strict';

describe('CssSelectorsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssSelectorsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});