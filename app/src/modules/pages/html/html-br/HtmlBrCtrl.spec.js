'use strict';

describe('HtmlBrCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlBrCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});