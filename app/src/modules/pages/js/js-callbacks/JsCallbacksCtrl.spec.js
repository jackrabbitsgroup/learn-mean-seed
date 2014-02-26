'use strict';

describe('JsCallbacksCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsCallbacksCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});