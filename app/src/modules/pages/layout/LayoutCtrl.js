/**
This controller is the main controller set on the <body> tag so is thus the parent controller for all other controllers in the app. So all other controllers inherit $scope properities defined here - notably: $scope.appPath, $scope.appPathLink, $scope.appPathLocation, $scope.appTitle.

It's always available/loaded so any 'global' events that always need to be listened for can be put here (like logging in or logging out). Anything put on $scope is available in ANY other controllers and HTML partials.

There's 3 main div elements on the page: 1. header, 2. content, 3. footer

The "pages" array defines the pages and is used to set the layout and top level classes to apply to a given page using $scope.classes

@module ang-layout
@main ang-layout
@class ang-layout

@toc
1. define 'global' properties that can be used in any other javascript controller / HTML partial
2. $scope.$on('loginEvt',..		//this MUST be declared in THIS controller otherwise (i.e. if put in LoginCtrl) it will ONLY get listened for when on the login page!
3. $scope.$on('changeLayoutEvt',..
*/

'use strict';

angular.module('myApp').controller('LayoutCtrl', ['$scope', 'appConfig', '$location', '$cookieStore', '$rootScope', 'appAuth',
 function($scope, appConfig, $location, $cookieStore, $rootScope, appAuth) {
	/**
	define 'global' properties
	@toc 1.
	*/
	
	/**
	Most common and default use of appPath, which is set from appConfig and is used to allow using absolute paths for ng-include and all other file structure / path references
	@property $scope.appPath
	@type String
	*/
	$scope.appPath =appConfig.dirPaths.appPath;		//so all children can access this without having to set it in each one
	
	/**
	For use in <a ng-href=''> </a> tags in HTML partial files
	@property $scope.appPathLink
	@type String
	*/
	$scope.appPathLink =appConfig.dirPaths.appPathLink;
	
	/**
	For use with $location.url(..) in javascript controller files
	@property $scope.appPathLocation
	@type String
	*/
	$scope.appPathLocation =appConfig.dirPaths.appPathLocation;
	
	/**
	For use with displaying images that are located in the common/img folder (where all images should be) inside <img> tags in the HTML/partial. This is so all children controllers/partials (which is every one since LayoutCtrl is the parent controller to everything) can access this without having to set it in each one.
	@property $scope.appPathImg
	@type String
	@usage <img ng-src='{{appPathImg}}/ie-chrome-logo.png' />		<!-- assumes there's an image file named 'ie-chrome-logo.png' in the common/img folder -->
	*/
	$scope.appPathImg =appConfig.dirPaths.appPath+'src/common/img';
	
	/**
	For use in referencing static files like partials
	@property $scope.staticPath
	@type String
	**/
	$scope.staticPath = appConfig.dirPaths.staticPath;
	
	/**
	For use in referencing pages folders like partials
	@property $scope.pagesFullPath
	@type String
	**/
	$scope.pagesFullPath = appConfig.dirPaths.staticPath+appConfig.dirPaths.pagesPath;
	
	/**
	Stores the title of the application (as set in appConfig) - can be used in (any) HTML partial files or javascript controller files
	@property $scope.appTitle
	@type String
	*/
	$scope.appTitle =appConfig.cfgJson.app.title;

	$scope.ids ={'header':'header', 'content':'content', 'footer':'footer'};
	/**
	Classes that will be applied to <body> tag and ids.content main page div in index.html - can be used to change layout and style based on the current page
	@property $scope.classes
	@type Object
	*/
	$scope.classes ={'loggedIn':'logged-out' , 'layout':'layout-login'};

	/**
	Used to dynamically set the min-height for the main content div element so the footer is always at the bottom of the page
	@property $scope.contentMinHeight
	@type Number
	*/
	$scope.contentMinHeight =0;
	
	

	/**
	Handles post login (or reverse for logout)
	- sets appConfig.state.loggedIn
	- sets $scope.classes.loggedIn
	- sets (or clears for logout) cookies for session and user
	- redirects to the appropriate page if need be
	@toc 2.
	@method $scope.$on('loginEvt',..
	@param {Object} params
		@param {Boolean} [loggedIn] true if logged in
		@param {String} [sess_id] session id
		@param {String} [user_id] user id key
		@param {Boolean} [noRedirect] true to not change/page location
	*/
	$scope.$on('loginEvt', function(evt, params) {
		var appPath1 =appConfig.dirPaths.appPath;
		//strip slashes for matching to ensure no single character mismatch issues
		var locPathMatch =$location.path().replace(/^[//]+/g, '');
		var appPath1Match =appPath1.replace(/^[//]/g, '');
		if(params.loggedIn) {
			$scope.classes.loggedIn ='logged-in';
			appConfig.state.loggedIn =true;
			if(params.sess_id !==undefined) {
				$cookieStore.put('sess_id', params.sess_id);
			}
			if(params.user_id !==undefined) {
				$cookieStore.put('user_id', params.user_id);
			}
			if(params.noRedirect ===undefined || !params.noRedirect || (params.loggedIn && (locPathMatch ==appPath1Match+'login' || locPathMatch ==appPath1Match+'password-reset' || locPathMatch ==appPath1Match+'signup') ) ) {
				var page ='home';
				var redirect =false;
				if(appAuth.data.redirectUrl) {
				//if(0) {
					if(appAuth.data.redirectUrl.indexOf('login') <0 && appAuth.data.redirectUrl.indexOf('password-reset') <0 && appAuth.data.redirectUrl.indexOf('signup') <0) {		//prevent infinite loop //UPDATE: android appends weird stuff in front so can't do exact match..
						page =appAuth.data.redirectUrl;
						redirect =true;
					}
					appAuth.data.redirectUrl =false;		//reset for next time
					$cookieStore.remove('redirectUrl');
				}
				//ensure page refreshes by adding param to end
				var ppAdd ='refresh=1';
				if(page.indexOf('?') >-1) {
					ppAdd ='&'+ppAdd;
				}
				else {
					ppAdd ='?'+ppAdd;
				}
				$location.url(appConfig.dirPaths.appPathLocation+page+ppAdd);
			}
			// else {
				// console.log('LayoutCtrl: no redirect needed');
			// }
		}
		else {
			$scope.classes.loggedIn ='logged-out';
			appConfig.state.loggedIn =false;
			if(params.noRedirect ===undefined || !params.noRedirect || (locPathMatch ==appPath1Match+'login' || locPathMatch ==appPath1Match+'password-reset' || locPathMatch ==appPath1Match+'signup') ) {
				$location.url(appConfig.dirPaths.appPathLocation+"home");
			}
			// else {
				// console.log('LayoutCtrl: no redirect needed');
			// }
		}
	});

	
	/**
	@toc 3.
	@method $scope.$on('changeLayoutEvt',..
	@param {String} classPage Class to give to this page (i.e. 'main', 'product-rec', ..)
	@param {Object} [params]
		@param [classLoggedIn] Class to set $scope.classes.loggedIn to
	*/
	$scope.$on('changeLayoutEvt', function(evt, classPage, params) {
		if(params ===undefined) {
			params ={};
		}
		
		if(classPage) {
			$scope.classes.layout =classPage;
		}
		if(params.classLoggedIn !==undefined) {
			$scope.classes.loggedIn =params.classLoggedIn;
		}
		
		$rootScope.$broadcast('appLayoutResize', {});
	});
	
}]);