/**
@todo
- figure out how to actually test / get coverage here.. not getting into the 'resolve' for routes and don't know how to test the config..

http://stackoverflow.com/questions/15990102/angularjs-route-unit-testing
*/

'use strict';

describe('app routes', function(){
	var $rootScope ={}, $httpBackend, $location, appConfig;
	var pathLoc;
	// var globalPhoneGap =true;
	
	beforeEach(function() {
		//not seeming to do anything..
		// var navigator ={
			// userAgent: ' Android '
		// };
		// module =angular.module('myApp');
		module('myApp');
		
		inject(function(_$rootScope_, _$httpBackend_, _$location_, _appConfig_) {
			$httpBackend =_$httpBackend_;
			$location =_$location_;
			appConfig =_appConfig_;
			$rootScope =_$rootScope_;
			
			pathLoc =appConfig.dirPaths.appPathLocation;
		});
		
	});
	
	it('should work', function() {
	});
	
	/*
	it('should have functioning routes', function() {
		$location.url(pathLoc+'home');
		$rootScope.$digest();
		$location.url(pathLoc+'login');
		$rootScope.$digest();
	});
	*/
	
	/*
	it('should not use html5History with phonegap', function() {
		globalPhoneGap =true;
		$location.url(pathLoc+'home');
	});
	*/
});