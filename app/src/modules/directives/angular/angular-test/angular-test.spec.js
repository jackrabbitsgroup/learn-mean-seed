'use strict';

describe('appAngularTest', function() {
	var elm, elmScope, $scope, $compile, $timeout;
	
	beforeEach(module('myApp'));
	
	/**
	@param params
		@param {String} html
	*/
	var createElm =function(params) {
		var html ="<div app-angular-test>"+
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
			'repeater':elm.find('div.angular-test-items'),
			'itemHtml':elm.find('div.angular-test-items div.angular-test-item-html'),
			// 'spanContent':elm.find('span.angular-test-span')
			'spanContent':elm.find('div div span')
		};
		return elements;
	};
	
	beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
		$compile = _$compile_;
		$timeout = _$timeout_;
		$scope = _$rootScope_.$new();
	}));
	
	// afterEach(function() {
	// });
	
	it('should have 2 items in the ng-repeat', function() {
		var eles =createElm({});
		
		// expect(eles.repeater).toBe('yes');
		// expect(elm.html()).toBe('yes');
		// expect(elm.find('div').html()).toBe('yes');
		// expect(elm.find('div:eq(0)').html()).toBe('yes1');
		// expect(elm.querySelector('div')).html()).toBe('yes2');
		// expect(elm.find('div:eq(0) span').length).toBe(2);
		// expect(elm.find('div').html()).toBe('yes');
		// expect(eles.repeater.html()).toBe('yes');
		// expect(eles.repeater.length).toBe(2);
		// expect(eles.repeater).toBe('yes');
		// expect(eles.itemHtml.length).toBe(2);
		// expect(eles.repeater.eq(0).text()).toBe('yes');
		expect(eles.repeater.length).toBe(2);
		expect(elmScope.items.length).toBe(2);
		
		// expect(eles.spanContent.text()).toBe('Span Content Here');
		
		var elm1 =angular.element(elm);
		expect(elm1.html()).toBe('yes2');
		expect(elm1.find('div').html()).toBe('yes3');
		expect(elm1.find('div span').html()).toBe('yes4');
	});
});