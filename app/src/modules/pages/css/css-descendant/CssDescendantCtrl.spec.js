'use strict';

describe('CssDescendantCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssDescendantCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});