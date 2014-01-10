'use strict';

describe('JsFunctionsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsFunctionsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});