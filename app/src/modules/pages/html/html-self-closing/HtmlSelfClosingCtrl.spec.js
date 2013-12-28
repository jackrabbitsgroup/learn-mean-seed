'use strict';

describe('HtmlSelfClosingCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlSelfClosingCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});