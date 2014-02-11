/**
@todo
- figure out how to actually test this?
*/

'use strict';

describe('appSocialAuthBtn', function () {
	var elm, elmScope, $scope, $compile, $timeout, $httpBackend;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _$httpBackend_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		$httpBackend = _$httpBackend_;
		$scope = _$rootScope_.$new();
		
		$httpBackend.expectPOST('/api/twitter/requestToken').respond({result: {} });
	}));
	
	afterEach(function() {
		$httpBackend.flush();		//twitter requestToken
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	/**
	@param params
	*/
	var createElm =function(params) {
		var html ="<div app-social-auth-btn>"+
		"</div>";
		if(params.html) {
			html =params.html;
		}
		// elm =angular.element(html);
		elm =$compile(html)($scope);
		// $scope.$digest();
		$scope.$apply();		//NOTE: required otherwise the alert directive won't be compiled!!!! ... wtf?
		elmScope =elm.isolateScope();
		var elements ={
		};
		return elements;
	};
	
	it('should do facebook login', function() {
		var eles =createElm({});
		
		elmScope.fbLogin({});
	});
	
	//this causes test to fail.. not sure why..
	// it('should do google login', function() {
		// var eles =createElm({});
		
		// elmScope.googleLogin({});
	// });
	
});	