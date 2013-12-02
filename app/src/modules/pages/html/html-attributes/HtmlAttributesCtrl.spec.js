'use strict';

describe('HtmlAttributesCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlAttributesCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});