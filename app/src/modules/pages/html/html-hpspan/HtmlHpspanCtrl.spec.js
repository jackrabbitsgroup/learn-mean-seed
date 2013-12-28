'use strict';

describe('HtmlHpspanCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlHpspanCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});