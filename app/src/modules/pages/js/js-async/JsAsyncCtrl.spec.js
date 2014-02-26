'use strict';

describe('JsAsyncCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsAsyncCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});