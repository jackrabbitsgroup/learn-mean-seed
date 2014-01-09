'use strict';

describe('JsIntroCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsIntroCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});