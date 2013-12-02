'use strict';

describe('AngularForminputBasicCtrl', function(){
	var ctrl, scope ={};
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('AngularForminputBasicCtrl', {$scope: scope});
	}));
	
	/*
	//can't unit test for DOM element existence / text? Have to e2e test instead?
	it('should have "my text" as the input label', function() {
		// var label =$('form .jrg-forminput label');
		// var label =$('form');
		var element =$('body');
		var label =element.find('form .jrg-forminput label');
		expect(label.text()).toEqual('my text');
		
		var ele =$('body');
		expect(ele.text()).toEqual('yes');
		
		expect(scope.text).toEqual('yes sir1');
	});
	*/
	
});