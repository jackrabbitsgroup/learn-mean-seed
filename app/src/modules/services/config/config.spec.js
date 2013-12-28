'use strict';

describe('appConfig', function(){
	var $rootScope ={}, appConfig;

	beforeEach(module('myApp'));
	
	function init(params) {
		inject(function(_$rootScope_, _appConfig_) {
			$rootScope = _$rootScope_;
			appConfig =_appConfig_;
		})
	}
	
	// beforeEach(inject(function(_$rootScope_, _appConfig_) {
		// $rootScope = _$rootScope_;
		// appConfig =_appConfig_;
	// }));

	// afterEach(function() {
	// });

	it('should load data', function() {
		init({});
		var state =appConfig.load('state', {});
	});
	
	it('should save data', function() {
		init({});
		var data ={
			p1: 'yes'
		};
		appConfig.save('state', data);
		var state =appConfig.load('state', {});
		expect(state.p1).toBe(data.p1);
	});
	
	it('should get timezone properly', function() {
		spyOn(Date.prototype, 'getTimezoneOffset').andReturn(420);
		init({});
	});
	
	it('should get timezone properly', function() {
		spyOn(Date.prototype, 'getTimezoneOffset').andReturn(-420);
		init({});
	});
	
	it('should get timezone properly', function() {
		spyOn(Date.prototype, 'getTimezoneOffset').andReturn(0);
		init({});
	});
	
	it('should get timezone properly', function() {
		spyOn(Date.prototype, 'getTimezoneOffset').andReturn(30);
		init({});
	});
	
	it('should get timezone properly', function() {
		spyOn(Date.prototype, 'getTimezoneOffset').andReturn(-660);
		init({});
	});
});

