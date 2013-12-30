'use strict';

describe('CssIntroCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssIntroCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});