'use strict';

describe('AngDirectivesIntroCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngDirectivesIntroCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});