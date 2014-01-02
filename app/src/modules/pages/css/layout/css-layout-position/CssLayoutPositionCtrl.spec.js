'use strict';

describe('CssLayoutPositionCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssLayoutPositionCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});