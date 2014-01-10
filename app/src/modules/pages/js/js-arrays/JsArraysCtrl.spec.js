'use strict';

describe('JsArraysCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsArraysCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});