'use strict';

describe('DocsAngularCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('DocsAngularCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});