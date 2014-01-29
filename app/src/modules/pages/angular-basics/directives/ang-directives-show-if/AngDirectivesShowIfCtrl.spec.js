'use strict';

describe('AngDirectivesShowIfCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngDirectivesShowIfCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});