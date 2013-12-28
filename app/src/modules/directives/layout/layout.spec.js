/**
@todo
- get test coverage up - currently document.getElementById is null from the test so don't get into the if statement for the directive resize function. Also 'window' doesn't exist in test runner? Anyway to simulate window.resize and window in general?
*/

'use strict';

describe('appLayout', function () {
	var elm, elmScope, $scope, $compile, $timeout;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		$scope = _$rootScope_.$new();
	}));
	
	// afterEach(function() {
	// });
	
	/**
	@param params
	*/
	var createElm =function(params) {
		$scope.ids ={
			header: 'header',
			content: 'content',
			footer: 'footer'
		};

		$scope.contentMinHeight =0;
		
		var html ="<div app-layout ids='ids' content-min-height='contentMinHeight'>"+
			"<div id='{{ids.header}}'>header</div>"+
			"<div id='{{ids.content}}'>content</div>"+
			"<div id='{{ids.footer}}'>footer</div>"+
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
			header: elm.find('div')
		};
		return elements;
	};
	
	it('should do an initial resize', function() {
		var eles =createElm({});
	});
	
	it('should listen for appLayoutResize event', function() {
		createElm({});
		$scope.$emit('appLayoutResize', {});
		$scope.$digest();
	});
});	