'use strict';

describe('appAppalert', function () {
	var elm, scope, $compile, $timeout;
	
	beforeEach(module('ui.bootstrap'));
	beforeEach(module('app'));
	
	/**
	@param params
	*/
	var createElm =function(params) {
		var html ="<div><div app-appalert>"+
		"</div></div>";
		elm =angular.element(html);
		
		
		$compile(elm)(scope);
		scope.$digest();
		scope.$apply();		//NOTE: required otherwise the alert directive won't be compiled!!!! ... wtf?
		var elements ={
			//'alert':elm.find('div.alert'),		//not working.. wtf?
			'alert':elm.find('div').children().find('div'),		//@todo - figure out why .find('div.alert') isn't working...
			'msg': elm.find('span')
		};
		return elements;
	};
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		scope = _$rootScope_.$new();
	}));
	
	afterEach(function() {
		//angular.module('ui.config').value('ui.config', {}); // cleanup
	});
	
	it('should start with only alert class', function() {
		var eles =createElm({});
		expect(eles.alert.hasClass('alert')).toBe(true);
		expect(eles.alert.hasClass('alert-error')).toBe(false);
		expect(eles.alert.hasClass('alert-success')).toBe(false);
	});
	
	it('should show success alert', function() {
		var eles =createElm({});
		//$timeout(function() {
		//scope.$broadcast('evtAppalertAlert', {type:'success', 'msg':'Success!'});
		scope.$emit('evtAppalertAlert', {type:'success', 'msg':'Success!'});
		//scope.$digest();
		scope.$apply();
		
		expect(eles.alert.hasClass('alert-success')).toBe(true);
		expect(eles.msg.text()).toBe('Success!');
		
		//var elmAlert =elm.find('div div.alert');
		//var elmAlert =elm.find('div.app-appalert');
		//var elmAlert =elm.children().children()[0];
		//var elmAlert =elm.children().find('div').toHaveClass('alert');
		//var elmAlert =elm.find('div').children().eq(0);
		// var elmAlert =elm.find('div').children().find('div');		//works
		//var elmAlert =elm.children().children().children();		//works
		//var elmAlert =elm.find('div').find('div').find('div.alert');
		//var elmAlert =elm.find('div div');
		//expect(elmAlert.attr('class')).toBe('class1');
		//expect(elmAlert.hasClass('alert-success')).toBe(true);
		// expect(eles.alert.hasClass('alert-success')).toBe(true);
		//expect(elmAlert.hasClass('alert')).toBe(true);
		//expect(elm.children().hasClass('alert')).toBe(true);
		//expect(elmAlert.length).toBe(1);
		//expect(elm.hasClass('alert-success')).toBe(true);
		// expect(elmAlert.html()).toBe('yes');
		//expect(elm.html()).toBe('yes');
		// expect(elmAlert).not.toBeNull();
		// expect(elmAlert.length).toBe(1);
		// expect(elmAlert.eq(1)).toHaveClass('alert-success');
		//}, 100);
	});
	
	it('should show error alert', function() {
		var eles =createElm({});
		scope.$emit('evtAppalertAlert', {type:'error', 'msg':'Error'});
		scope.$digest();
		//scope.$apply();
		expect(eles.alert.hasClass('alert-error')).toBe(true);
		expect(eles.alert.hasClass('alert-success')).toBe(false);
		expect(eles.msg.text()).toBe('Error');
	});
});	