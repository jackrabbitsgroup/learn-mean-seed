'use strict';

describe('DocsAngularDirectiveCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('DocsAngularDirectiveCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});