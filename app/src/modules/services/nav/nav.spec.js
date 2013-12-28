/**
NOTE: this ALSO tests nav-config
*/

'use strict';

describe('appNav', function(){
	var $rootScope ={}, appNav, appNavConfig, $window;

	beforeEach( function() {
		//stub / mock $window service to avoid "full page reload" Karma error
		// http://stackoverflow.com/questions/20029474/writing-a-test-for-a-directive-that-does-a-full-page-reload-in-karma
		module( function($provide) {
			$window ={
				history: {
					back: function() {}
				}
			};
			$provide.constant('$window', $window);
		});
		module('myApp')
	});
	
	beforeEach(inject(function(_$rootScope_, _appNav_, _appNavConfig_) {
		$rootScope = _$rootScope_;
		appNav =_appNav_;
		appNavConfig =_appNavConfig_;
	}));

	// afterEach(function() {
	// });

	it('should not init twice', function() {
		appNav.init({});
		
		appNavConfig.init({});
	});
	
	it('should not go back if no history', function() {
		appNav.historyBack({});
	});
	
	it('should use pageToUse for updateNav if set', function() {
		appNav.updateNav({pageToUse: 'login'});
	});
	
	it('should updateNav', function() {
		var page;
		page =appNav.updateNav({urlInfo:{page:'login' } });
		
		//should accept pagesRouteMap params
		var pagesRouteMap ={
			eventviewinfo:{
				url: 'eventview',		//the sanitized version of the url (i.e. no hypens)
				params: {
					page: 'info'
				}
			},
			eventviewnoparams:{
				url: 'eventviewnoparams'		//the sanitized version of the url (i.e. no hypens)
			},
			//will match things like 'test/898' or 'test/yes/no' in case passing in :id or other sub-page parameters in the URL (but NOT in GET query params)
			test:{
				urlRegex: 'test\/'		//the sanitized version of the url (i.e. no hypens)
			}
		};
		appNav.pagesRouteMap =pagesRouteMap;
		
		page =appNav.updateNav({urlInfo:{page:'eventview', queryParamsObj:{'page':'info'} } });
		expect(page).toBe('eventviewinfo');
		
		//no queryParamsObj
		page =appNav.updateNav({urlInfo:{page:'eventview'} });
		expect(page).toBe('eventview');
		
		//no params
		page =appNav.updateNav({urlInfo:{page:'eventviewnoparams' } });
		expect(page).toBe('eventviewnoparams');
		
		//regex testing
		//SHOULD match
		page =appNav.updateNav({urlInfo:{page:'test/1'} });
		expect(page).toBe('test');
		
		//should NOT match
		page =appNav.updateNav({urlInfo:{page:'test1'} });
		expect(page).not.toBe('test');
		
	});
	
	it('should go back in history', function() {
		appNav.updateNav({pageToUse: 'login'});
		appNav.updateNav({pageToUse: 'signup'});
		appNav.historyBack({});
	});
	
	it('should support setting and getting current nav', function() {
		var nav ={
			title: 'my title',
			buttons: {
				left: [
					{
						html: 'left'
					}
				],
				right: [
					{
						html: 'right'
					}
				]
			}
		};
		
		appNav.setNav(nav, {});
		var gotNav =appNav.getNav({});
		expect(gotNav.title).toBe(nav.title);
	});
});

