/**
@todo test form submission XHR call?
*/

'use strict';

describe('PasswordResetCtrl', function(){
	var ctrl, scope ={}, $routeParams;

	beforeEach(module('myApp'));
	beforeEach(module('app'));		//all need appConfig for appConfig provider in app.js
	
	/*
	beforeEach(inject(function($rootScope, $controller, $routeParams) {
		$routeParams.email ='test@gmail.com';
		scope = $rootScope.$new();
		ctrl = $controller(PasswordResetCtrl, {$scope: scope});
	}));
	*/
	
	/**
	@param {Object} params
		@param {Object} [routeParams ={}]
	*/
	var doSetup =function(params) {
	//beforeEach(inject(function($rootScope, $controller, _$routeParams_) {
	inject(function($rootScope, $controller, _$routeParams_) {
		$routeParams =_$routeParams_;
		//$routeParams.email ='test@gmail.com';
		/*
		//this does NOT work - apparently have to set keys individually; can't assign the entire object
		if(params.routeParams) {
			$routeParams =params.routeParams;
		}
		*/
		//$routeParams.email ='test@gmail.com';
		if(params.routeParams !=undefined) {
			for(var xx in params.routeParams) {
				$routeParams[xx] =params.routeParams[xx];
			}
		}
		scope = $rootScope.$new();
		ctrl = $controller('PasswordResetCtrl', {$scope: scope});
	//}));
	});
	/*
		beforeEach(inject(function($routeParams) {
			$routeParams.email ='test@gmail.com';
		}));
		*/
	};
	
	describe('route params', function() {
		it('should have empty scope form vals by default', function() {
			doSetup({});
			expect(scope.formVals.email).not.toBeDefined();
			expect(scope.formVals.password_reset_key).not.toBeDefined();
		});
		
		it('should fill email and password reset key if set in route params', function() {
			var routeParams ={'email':'test@gmail.com', 'reset_key':'keo345'};
			doSetup({'routeParams':routeParams});
			//expect($routeParams).toEqual({});
			//$routeParams.email ='test@gmail.com';
			//expect($routeParams.email).toBe('test@gmail.com');
			expect(scope.formVals.email).toBe('test@gmail.com');
			expect(scope.formVals.password_reset_key).toBe('keo345');
		});

	});
	
});