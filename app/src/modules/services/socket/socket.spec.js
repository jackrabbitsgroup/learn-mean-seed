'use strict';

describe('appSocket', function(){
	var $rootScope ={}, appSocket;

	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _appSocket_) {
		$rootScope = _$rootScope_;
		appSocket =_appSocket_;
	}));

	// afterEach(function() {
	// });

	it('should work but not init twice', function() {
		appSocket.init({});
	});
});

