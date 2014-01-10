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
'btford.socket-io',
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
	// $routeProvider.when(appPathRoute+'home', {redirectTo: appPathRoute+'dev-test/test'});
	
	$routeProvider.when(appPathRoute+'login', {templateUrl: pagesPath+'login/login.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	$routeProvider.when(appPathRoute+'signup', {templateUrl: pagesPath+'signup/signup.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	$routeProvider.when(appPathRoute+'logout', {templateUrl: pagesPath+'logout/logout.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	$routeProvider.when(appPathRoute+'user-delete', {templateUrl: pagesPath+'userDelete/user-delete.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
		
	$routeProvider.when(appPathRoute+'password-reset', {templateUrl: pagesPath+'passwordReset/password-reset.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	
	//dev-test
	// $routeProvider.when(appPathRoute+'test', {templateUrl: pagesPath+'test/test.html'});
	$routeProvider.when(appPathRoute+'dev-test/test', {templateUrl: pagesPath+'dev-test/test/test.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	
	$routeProvider.when(appPathRoute+'dev-test/design', {templateUrl: pagesPath+'dev-test/design/design.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	$routeProvider.when(appPathRoute+'dev-test/socketio', {templateUrl: pagesPath+'dev-test/socketio/socketio.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});

	
	/**
	site-specific routes
	@toc 3.
	*/
	
	//yeoman generated routes here - DO NOT DELETE THIS COMMENT AS IT IS USED BY YEOMAN TO GENERATE A NEW ROUTE!
	$routeProvider.when(appPathRoute+'angular-forminput-basic', {templateUrl: pagesPath+'angular/directive/use/forminput/angular-forminput-basic/angular-forminput-basic.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'docs-angular', {templateUrl: pagesPath+'docs/angular/docs-angular/docs-angular.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'docs-angular-directive', {templateUrl: pagesPath+'docs/angular/docs-angular-directive/docs-angular-directive.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'toc', {templateUrl: pagesPath+'toc/toc/toc.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
	$routeProvider.when(appPathRoute+'html-attributes', {templateUrl: pagesPath+'html/html-attributes/html-attributes.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-intro', {templateUrl: pagesPath+'html/html-intro/html-intro.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-div', {templateUrl: pagesPath+'html/html-div/html-div.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-img', {templateUrl: pagesPath+'html/html-img/html-img.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-self-closing', {templateUrl: pagesPath+'html/html-self-closing/html-self-closing.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-br', {templateUrl: pagesPath+'html/html-br/html-br.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-input', {templateUrl: pagesPath+'html/html-input/html-input.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-a', {templateUrl: pagesPath+'html/html-a/html-a.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'html-hpspan', {templateUrl: pagesPath+'html/html-hpspan/html-hpspan.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'docs-testing', {templateUrl: pagesPath+'docs/testing/docs-testing/docs-testing.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'angular-controller-test-scope', {templateUrl: pagesPath+'angular/controller/test/scope/angular-controller-test-scope/angular-controller-test-scope.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'docs-testing-jasmine', {templateUrl: pagesPath+'docs/testing/docs-testing-jasmine/docs-testing-jasmine.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-intro', {templateUrl: pagesPath+'css/css-intro/css-intro.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-transition', {templateUrl: pagesPath+'css/css-transition/css-transition.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-selectors', {templateUrl: pagesPath+'css/css-selectors/css-selectors.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-textstyles', {templateUrl: pagesPath+'css/css-textstyles/css-textstyles.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-spacing', {templateUrl: pagesPath+'css/css-spacing/css-spacing.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-colors', {templateUrl: pagesPath+'css/css-colors/css-colors.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'docs-getting-started', {templateUrl: pagesPath+'docs/getting-started/docs-getting-started/docs-getting-started.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-layout-position', {templateUrl: pagesPath+'css/layout/css-layout-position/css-layout-position.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-pclasses-hover', {templateUrl: pagesPath+'css/pseudo-classes/css-pclasses-hover/css-pclasses-hover.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-descendant', {templateUrl: pagesPath+'css/css-descendant/css-descendant.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-pclasses-children', {templateUrl: pagesPath+'css/pseudo-classes/css-pclasses-children/css-pclasses-children.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-layout-float', {templateUrl: pagesPath+'css/layout/css-layout-float/css-layout-float.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-layout-inline', {templateUrl: pagesPath+'css/layout/css-layout-inline/css-layout-inline.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-layout-flexbox', {templateUrl: pagesPath+'css/layout/css-layout-flexbox/css-layout-flexbox.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'angular-test-scope-digest', {templateUrl: pagesPath+'angular/test/scope-digest/angular-test-scope-digest/angular-test-scope-digest.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'angular-test-scope-on', {templateUrl: pagesPath+'angular/test/scope-on/angular-test-scope-on/angular-test-scope-on.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-vendor-prefix', {templateUrl: pagesPath+'css/css-vendor-prefix/css-vendor-prefix.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'css-mixin', {templateUrl: pagesPath+'css/css-mixin/css-mixin.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'angular-test-element-find', {templateUrl: pagesPath+'angular/test/angular-test-element-find/angular-test-element-find.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({});
			}
		}
	});
$routeProvider.when(appPathRoute+'web-debugger', {templateUrl: pagesPath+'misc-tips/web-debugger/web-debugger.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-intro', {templateUrl: pagesPath+'js/js-intro/js-intro.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-variables', {templateUrl: pagesPath+'js/js-variables/js-variables.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-functions', {templateUrl: pagesPath+'js/js-functions/js-functions.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-arrays', {templateUrl: pagesPath+'js/js-arrays/js-arrays.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-objects', {templateUrl: pagesPath+'js/js-objects/js-objects.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-operators', {templateUrl: pagesPath+'js/js-operators/js-operators.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-logic', {templateUrl: pagesPath+'js/js-logic/js-logic.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-loops', {templateUrl: pagesPath+'js/js-loops/js-loops.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
$routeProvider.when(appPathRoute+'js-math', {templateUrl: pagesPath+'js/js-math/js-math.html',
		resolve: {
			auth: function(appAuth) {
				return appAuth.checkSess({noLoginRequired:true});
			}
		}
	});
//end: yeoman generated routes here - DO NOT DELETE THIS COMMENT AS IT IS USED BY YEOMAN TO GENERATE A NEW ROUTE!
	

	/**
	catch-all 'otherwise' route
	@toc 4.
	*/
	$routeProvider.otherwise({redirectTo: appPathRoute+'toc'});
	
}]);