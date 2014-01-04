'use strict';

describe('CssPclassesChildrenCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssPclassesChildrenCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});