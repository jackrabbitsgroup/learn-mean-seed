'use strict';

describe('UserModel', function(){
	var $rootScope ={}, UserModel;

	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _UserModel_) {
		$rootScope = _$rootScope_;
		UserModel =_UserModel_;
	}));

	// afterEach(function() {
	// });

	it('should save and load keys', function() {
		var user ={
			_id: 'id',
			first_name: 'First',
			last_name: 'Last'
		};
		UserModel.save(user, {});
		
		var userRet =UserModel.load();
		expect(userRet._id).toBe(user._id);
		
		//load one key/piece of data
		var userId =UserModel.load('_id', {});
		expect(userId).toBe(user._id);
		
	});
});

