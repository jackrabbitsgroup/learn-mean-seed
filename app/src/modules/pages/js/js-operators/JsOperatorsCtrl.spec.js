'use strict';

describe('JsOperatorsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsOperatorsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});