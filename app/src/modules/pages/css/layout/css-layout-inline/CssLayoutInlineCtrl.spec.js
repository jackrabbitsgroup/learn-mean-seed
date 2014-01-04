'use strict';

describe('CssLayoutInlineCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssLayoutInlineCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});