'use strict';

describe('AngScopeInheritanceCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngScopeInheritanceCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});