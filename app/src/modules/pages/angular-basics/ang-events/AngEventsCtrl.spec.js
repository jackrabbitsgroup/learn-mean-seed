'use strict';

describe('AngEventsCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngEventsCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});