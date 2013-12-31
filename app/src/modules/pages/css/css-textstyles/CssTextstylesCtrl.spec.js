'use strict';

describe('CssTextstylesCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssTextstylesCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});