'use strict';

describe('HtmlACtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlACtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});