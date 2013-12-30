'use strict';

describe('CssPselectorsHoverCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('CssPselectorsHoverCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});