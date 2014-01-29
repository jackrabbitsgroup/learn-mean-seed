'use strict';

describe('AngDirectivesRepeatCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngDirectivesRepeatCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});