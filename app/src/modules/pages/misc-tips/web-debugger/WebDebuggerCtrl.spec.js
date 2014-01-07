'use strict';

describe('WebDebuggerCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('WebDebuggerCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});