'use strict';

describe('AngDirectivesClickCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngDirectivesClickCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});