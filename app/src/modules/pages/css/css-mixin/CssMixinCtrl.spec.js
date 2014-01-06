'use strict';

describe('CssMixinCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssMixinCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});