'use strict';

describe('CssLayoutFlexboxCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssLayoutFlexboxCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});