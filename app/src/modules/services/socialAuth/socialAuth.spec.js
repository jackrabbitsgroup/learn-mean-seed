/**
@todo
- figure out how to make google auth not break karma coverage..
- figure out timing / how to get the appSocialAuth data to be/stay set for 2nd call..
*/

'use strict';

describe('appSocialAuth', function(){
	var $rootScope ={}, appSocialAuth, $timeout;

    beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _appSocialAuth_, _$timeout_) {
		appSocialAuth =_appSocialAuth_;
		$rootScope =_$rootScope_;
		$timeout =_$timeout_;
	}));

	afterEach(function() {
		// $httpBackend.verifyNoOutstandingExpectation();
		// $httpBackend.verifyNoOutstandingRequest();
	});
	
	/*
	//doesn't work - breaks karma coverage..
	it('should do google auth', function() {
		var googleInfo ={
			token: {
				access_token: 'accessToken'
			},
			extraInfo: {
				user_id: 'userId',
				emailPrimary: 'emailPrimary'
			}
		};
		appSocialAuth.checkAuthGoogle({});
		//hardcoded event name - must match what's set in service
		$rootScope.$broadcast('evtGoogleLogin', googleInfo);
		$rootScope.$digest();
		
		//should resolve immediately if already authenticated
		appSocialAuth.checkAuthGoogle({});
		$rootScope.$digest();
	});
	*/
	
	it('should do facebooko auth', function() {
		var fbInfo ={
			accessToken: 'accessToken',
			userID: 'facebookId'
		};
		
		appSocialAuth.checkAuthFacebook({}).
		then(function(ret) {
			/*
			//still has data not set..
			console.log('resolved');
			//should resolve immediately if already authenticated
			appSocialAuth.checkAuthFacebook({});
			$rootScope.$digest();
			*/
		});
		$rootScope.$digest();
		//hardcoded event name - must match what's set in service
		$rootScope.$broadcast('evtFBLogin', fbInfo);
		$rootScope.$digest();
		
		/*
		//doesn't work - can't get data to be set..
		$timeout(function() {
		//should resolve immediately if already authenticated
		appSocialAuth.checkAuthFacebook({});
		$rootScope.$digest();
		}, 500);
		$timeout.flush();
		*/
	});

});

