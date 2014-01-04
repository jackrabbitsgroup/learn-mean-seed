'use strict';

describe('AngularTestScopeDigestCtrl', function() {
	var $ctrl, $scope ={}, $timeout;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$timeout_) {
		$timeout =_$timeout_;
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('AngularTestScopeDigestCtrl', {$scope: $scope});
	}));
	
	function defaultRuns() {
		//TASK 2: put code in here to be called just like any other function. Then call this function from either a beforeEach OR from individual `it` statements. As always, using functions provides more modular flexibility than hard-coding into beforeEach statements directly (in case there's any `it` statements we do NOT want to run this for)!
	}
	
	beforeEach(function() {
		//TASK 1: put code in here that you want to run before EVERY `it` statement
		
		//TASK 2: call function: defaultRuns(); 
	});
	
	it('should resolve the promise(s) and timeout', function() {
		//should start false
		expect($scope.promiseVal).toBe(false);
		
		//resolve first promise
		$scope.$digest();
		expect($scope.promiseVal).toBe('success');
		
		//flush timeout to get 2nd promise to run. NOTE: do NOT have to run $scope.$digest() again here; $timeout.flush() is good enough.
		$timeout.flush()
		expect($scope.promiseVal).toBe('error');
	});
	
	it('should call runPromise function properly', function() {
		var promiseCalled =false;
		
		//TASK 3: call the $scope.runPromise function, uncomment the `expect(promiseCalled).toBe(true);` line at the bottom and get it to pass.
		
		//uncomment this line after you've written and $digest'ed your promise!
		// expect(promiseCalled).toBe(true);
		//NOTE: due to timing (since our promise here resolves at the same time as the promise in the controller itself, so $scope.promiseVal may be set AFTER our test code runs), we can't really test the $scope.promiseVal directly in this case like we could above. We can only test the resolve'd/reject'd value from the promise itself and/or test that the promise was called.
	});
});