'use strict';

describe('AngScopeCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngScopeCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});