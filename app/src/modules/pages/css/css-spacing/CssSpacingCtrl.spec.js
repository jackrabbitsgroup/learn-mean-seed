'use strict';

describe('CssSpacingCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssSpacingCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});