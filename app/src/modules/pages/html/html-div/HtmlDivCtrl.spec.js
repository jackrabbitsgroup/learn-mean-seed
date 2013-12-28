'use strict';

describe('HtmlDivCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlDivCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});