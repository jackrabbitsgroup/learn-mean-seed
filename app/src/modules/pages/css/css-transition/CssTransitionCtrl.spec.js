'use strict';

describe('CssTransitionCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssTransitionCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});