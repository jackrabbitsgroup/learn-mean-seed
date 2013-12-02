'use strict';

describe('TocCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('TocCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});