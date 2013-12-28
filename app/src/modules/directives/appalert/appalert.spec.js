'use strict';

describe('appAppalert', function () {
	var elm, elmScope, $scope, $compile, $timeout;
	
	beforeEach(module('ui.bootstrap'));
	beforeEach(module('app'));
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		// $scope = _$rootScope_;
		$scope = _$rootScope_.$new();
	}));
	
	// afterEach(function() {
	// });
	
	/**
	@param params
	*/
	var createElm =function(params) {
		var html ="<div app-appalert>"+
		"</div>";
		// elm =angular.element(html);
		elm =$compile(html)($scope);
		// $scope.$digest();
		$scope.$apply();		//NOTE: required otherwise the alert directive won't be compiled!!!! ... wtf?
		elmScope =elm.isolateScope();
		var elements ={
			//'alert':elm.find('div.alert'),		//not working.. wtf?
			'alert':elm.find('div').find('div'),		//@todo - figure out why .find('div.alert') isn't working...
			'msg': elm.find('span')
		};
		return elements;
	};
	
	it('should have a closeAlert function', function() {
		var eles =createElm({});
		expect(elmScope).toBeDefined();
		expect(elmScope.closeAlert).toEqual(jasmine.any(Function));
	});
	
	it('should start with only alert class', function() {
		var eles =createElm({});
		expect(eles.alert.hasClass('alert')).toBe(true);
		expect(eles.alert.hasClass('alert-error')).toBe(false);
		expect(eles.alert.hasClass('alert-success')).toBe(false);
	});

	it('should show success alert', function() {
		var eles =createElm({});
		$scope.$emit('evtAppalertAlert', {type:'success', 'msg':'Success!'});
		$scope.$digest();
		
		expect(eles.alert.hasClass('alert-success')).toBe(true);
		expect(eles.msg.text()).toBe('Success!');
	});
	
	it('should show error alert', function() {
		var eles =createElm({});
		$scope.$emit('evtAppalertAlert', {type:'error', 'msg':'Error'});
		$scope.$digest();
		expect(eles.alert.hasClass('alert-error')).toBe(true);
		expect(eles.alert.hasClass('alert-success')).toBe(false);
		expect(eles.msg.text()).toBe('Error');
	});
	
	it('should show yellow alert by default if no type set', function() {
		var eles =createElm({});
		$scope.$emit('evtAppalertAlert', {'msg':'Default'});
		$scope.$digest();
		expect(eles.alert.hasClass('alert-error')).toBe(false);
		expect(eles.alert.hasClass('alert-success')).toBe(false);
	});
	
	it('should close alert immediately (no delay) by clicking "x" and calling closeAlert', function() {
		var eles =createElm({});
		//show alert first
		$scope.$emit('evtAppalertAlert', {'msg':'Default'});
		$scope.$digest();
		//close alert
		elmScope.closeAlert({});
		$scope.$digest();
		//need timeout otherwise it doesn't work..
		$timeout(function() {
			expect(eles.alert.hasClass('hidden')).toBe(true);
		}, 50);
	});
	
	it('should close alert by emitting event', function() {
		var eles =createElm({});
		//show alert first
		$scope.$emit('evtAppalertAlert', {'msg':'Default'});
		$scope.$digest();
		//close alert
		$scope.$emit('evtAppalertAlert', {'close':true});
		$scope.$digest();
		//need brief timeout to allow it to update (though it should be near immediate)
		$timeout(function() {
			expect(eles.alert.hasClass('hidden')).toBe(true);
		}, 50);
	});
	
	it('should hide alert automatically after given duration', function() {
		var eles =createElm({});
		var delay =750;
		$scope.$emit('evtAppalertAlert', {'msg':'Default', 'delay':delay});
		$scope.$digest();
		
		//show NOT be hidden before time is up	//not sure if this is actually working - can't test this since $timeout is mocked for unit tests? it just fires when you run $timeout.flush()? - http://stackoverflow.com/questions/19484940/how-does-timeout-work-in-angular-tests-running-in-karma
		$timeout(function() {
			expect(eles.alert.hasClass('hidden')).toBe(false);
		}, (delay/2));

		$timeout.flush();		//need this for the $timeout's to actually run..
		$timeout.flush();
		//SHOULD be hidden after time is up
		$timeout(function() {
			expect(eles.alert.hasClass('hiding')).toBe(true);
			expect(eles.alert.hasClass('hidden')).toBe(true);
		}, delay);
	});
	
});	