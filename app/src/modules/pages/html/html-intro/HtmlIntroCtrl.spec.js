'use strict';

describe('HtmlIntroCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlIntroCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});