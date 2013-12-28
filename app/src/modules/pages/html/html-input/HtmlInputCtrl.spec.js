'use strict';

describe('HtmlInputCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlInputCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});