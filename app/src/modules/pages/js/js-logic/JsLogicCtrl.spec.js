'use strict';

describe('JsLogicCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsLogicCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});