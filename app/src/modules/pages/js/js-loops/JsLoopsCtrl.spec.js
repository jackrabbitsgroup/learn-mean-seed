'use strict';

describe('JsLoopsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsLoopsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});