'use strict';

describe('JsMathCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('JsMathCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});