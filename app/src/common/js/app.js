/**
@toc
1. setup - whitelist, appPath, html5Mode
2. generic / common routes
3. site-specific routes
4. catch-all 'otherwise' route

Declare app level module which depends on filters, and services.

Also handles setting HTML5 mode and handling routing (optionally checking login state first)

HTML5 mode true (for modern browsers) means no "#" in the url. HTML5 mode false (IE <10 and Android <4) has a "#/" in the url as a fallback for older browsers that don't support HTML5 History

The "resolve" block in the routes allows calling functions (that return a $q deferred promise) that will be executed BEFORE routing to the appropriate page/controller (this is often used for checking logged in state and updating routing accordingly - i.e. don't allow accessing pages that require login if the user isn't currently logged in)
@module ang-app
*/

'use strict';

//combine all jackrabbitsgroup modules into 'jrg' module for easy reference later (including in test specs)
angular.module('jrg', [
		//services
		'jackrabbitsgroup.angular-string',
		'jackrabbitsgroup.angular-array',
		'jackrabbitsgroup.angular-facebook-auth',
		'jackrabbitsgroup.angular-google-auth',
		//directives
		'jackrabbitsgroup.angular-forminput'
	]
);

//declare some other modules so can group sets of services & directives together for easy reference elsewhere
angular.module('models', []);
angular.module('app', [
	'models'		//so don't have to actually use/include 'models' anywhere, just use 'app' instead
]);

angular.module('myApp', [
'ngRoute', 'ngSanitize', 'ngTouch', 'ngAnimate', 'ngCookies',		//additional angular modules
'hmTouchEvents',		//hammer swipe / touch
'ui.bootstrap',
'jrg',
'app'		//local / app specific directives and services (anything that can be used across apps should be added to an external (bower) directive or service library)
]).
config(['$routeProvider', '$locationProvider', 'appConfigProvider', '$compileProvider', function($routeProvider, $locationProvider, appConfigProvider, $compileProvider) {
	/**
	setup - whitelist, appPath, html5Mode
	@toc 1.
	*/
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|content|geo|http?):/);		//otherwise ng-href links don't work on Android within TriggerIO: http://stackoverflow.com/questions/16130902/angular-js-and-trigger-io-cant-follow-a-link-on-android-that-works-on-ios		//UPDATE: Angular 1.2.0 no longer has urlSanitizationWhitelist; it's been renamed to aHrefSanitizationWhitelist and may no longer even be necessary: http://stackoverflow.com/questions/15105910/angular-ng-view-routing-not-working-in-phonegap
	
	var appPath =appConfigProvider.dirPaths.appPath;
	var staticPath = appConfigProvider.dirPaths.staticPath;

	//handle browsers with no html5 history api (AND Android <3 which checks as true but doesn't really fully support it..)
	var appPathRoute =appPath;
	var html5History =!!(window.history && window.history.pushState);		//actual check
	//android / browser sniffer 2nd check
	var ua = navigator.userAgent;
	if(typeof(globalPhoneGap) !="undefined" && globalPhoneGap ===true) {
		html5History =false;
	}
	else if( ua.indexOf("Android") >= 0 )
	{
		var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
		if (androidversion < 3)
		{
			html5History =false;
		}
	}
	// html5History =false;		//TESTING		//update: TriggerIO does NOT seem to work with html5 history so have to disable it..
	if(html5History) {
		$locationProvider.html5Mode(true);		//un comment this to use HTML5 History API (better BUT note that server must be configured to auto-redirect all requests to /index.html since this will create url paths that don't actually exist file-wise so I default it to off for initial testing / setup until server is configured properly to handle this)
	}
	else {		//update for route matching and forming
		appPathRoute ='/';
		appConfigProvider.dirPaths.appPathLink =appConfigProvider.dirPaths.appPathLink+"#/";
		appConfigProvider.dirPaths.appPathLocation ='';
	}
	
	var pagesPath =staticPath+'modules/pages/';

	
	/**
	Generic / common routes
	@toc 2.
	*/
	/*
	$routeProvider.when(appPathRoute+'home', {templateUrl: pagesPath+'home/home.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({'noLoginRequired':true});
			}
		}
	});
	*/
	$routeProvider.when(appPathRoute+'home', {redirectTo: appPathRoute+'test'});
	
	$routeProvider.when(appPathRoute+'login', {templateUrl: pagesPath+'login/login.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({'noLoginRequired':true});
			}
		}
	});
	$routeProvider.when(appPathRoute+'signup', {templateUrl: pagesPath+'signup/signup.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({'noLoginRequired':true});
			}
		}
	});
	$routeProvider.when(appPathRoute+'logout', {templateUrl: pagesPath+'logout/logout.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({'noLoginRequired':true});
			}
		}
	});
	$routeProvider.when(appPathRoute+'user-delete', {templateUrl: pagesPath+'userDelete/user-delete.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({'noLoginRequired':true});
			}
		}
	});
		
	$routeProvider.when(appPathRoute+'password-reset', {templateUrl: pagesPath+'passwordReset/password-reset.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({'noLoginRequired':true});
			}
		}
	});
	
	// $routeProvider.when(appPathRoute+'test', {templateUrl: pagesPath+'test/test.html'});
	$routeProvider.when(appPathRoute+'test', {templateUrl: pagesPath+'test/test.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
	
	$routeProvider.when(appPathRoute+'design', {templateUrl: pagesPath+'design/design.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});

	
	/**
	site-specific routes
	@toc 3.
	*/
	
	//yeoman generated routes here - DO NOT DELETE THIS COMMENT AS IT IS USED BY YEOMAN TO GENERATE A NEW ROUTE!
	//end: yeoman generated routes here - DO NOT DELETE THIS COMMENT AS IT IS USED BY YEOMAN TO GENERATE A NEW ROUTE!
	

	/**
	catch-all 'otherwise' route
	@toc 4.
	*/
	$routeProvider.otherwise({redirectTo: appPathRoute+'home'});
	
}]);