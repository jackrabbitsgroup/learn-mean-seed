'use strict';

describe('HtmlImgCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('HtmlImgCtrl', {$scope: scope});
	}));
	
	/*
	it('should do something', function() {
	});
	*/
});