'use strict';

describe('AngularIntroCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngularIntroCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});