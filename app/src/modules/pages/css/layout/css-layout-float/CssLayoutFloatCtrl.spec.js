'use strict';

describe('CssLayoutFloatCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssLayoutFloatCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});