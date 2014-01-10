'use strict';

describe('JsObjectsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsObjectsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});