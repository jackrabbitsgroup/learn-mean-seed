/**
@class auth

@toc
4. samePage
2. saveUrlLocation
3. done		//called AFTER login status is figured out - in case need to do any logic AFTER have login status (and user object filled if logged in)
1. checkSess
*/

'use strict';

angular.module('app').
factory('appAuth', ['appHttp', 'appConfig', '$cookieStore', '$location', '$rootScope', '$q', 'UserModel', 'jrgString', 'appNav', 'appStorage',
function(appHttp, appConfig, $cookieStore, $location, $rootScope, $q, UserModel, jrgString, appNav, appStorage) {
var inst ={

	data: {
		redirectUrl: false,
		// curUrl: false,
		// curPage: false,
		urlInfo: {
			page: false,
			queryParams: false,
			curNavPage: false		//holds the 'page' name used by the nav service (this uniquely identifies the page/view WITHOUT any query params)
		}
	},
	
	/**
	Just before changing $location.url (to change a page / redirect), need to figure out if we want to deferred.reject (in case going to a DIFFERENT page) or deferred.resolve (if staying on the same page OR 'redirecting' to the same page). Rejecting the promises causes the controller and page NOT to load, and this is good IF we're going to a new page but obviously breaks things if we're staying on the same page so need to resolve if staying on the same page.
	@toc 4.
	@method samePage
	*/
	samePage: function(newUrl, params) {
		if(newUrl.indexOf(this.data.urlInfo.page) >-1) {		//same page (or close enough)
			return true;
		}
		else {
			return false;
		}
	},
	
	/**
	@toc 2.
	saves the current url as this.data.redirectUrl (EXCEPT on login/register pages) to allow redirecting back to that page after login
	@method saveUrlLocation
	*/
	saveUrlLocation: function(params) {
		var skipPages =['login', 'signup'];
		//var curPage =$location.path().replace(appConfig.dirPaths.appPath, '');		//$location doesn't have url & path defined yet??
		// var appPath =window.location.host+appConfig.dirPaths.appPath;
		var appPath =appConfig.dirPaths.appPath;
		var curUrl =$location.$$absUrl;
		// this.curUrl =curUrl;
		var ret1 =jrgString.parseUrl({url: curUrl, rootPath: appPath});
		var curPage =ret1.page;
		var queryParams =ret1.queryParams;
		this.data.urlInfo =angular.extend(this.data.urlInfo, ret1);
		/*
		var pos1 =curUrl.indexOf(appPath);
		var curPage =curUrl.slice((pos1+appPath.length), curUrl.length);
		var posQuery =curPage.indexOf("?");
		var queryParams ='';
		if(posQuery >-1) {
			queryParams =curPage.slice((posQuery), curPage.length);
			curPage =curPage.slice(0, posQuery);
		}
		*/
		var skip =false;
		for(var ii=0; ii<skipPages.length; ii++) {
			if(curPage ==skipPages[ii]) {
				skip =true;
				break;
			}
		}
		if(!skip) {		//save it
			//ensure it has a leading question mark (otherwise will just always redirect the main/default page)
			var queryParamsString =queryParams;
			if(queryParamsString.length >0) {
				queryParamsString ='?'+queryParamsString;
			}
			curPage +=queryParamsString;
			this.data.redirectUrl =curPage;
			$cookieStore.put('redirectUrl', curPage);		//save cookie as well just in case (page refresh, etc.)
		}
		else {		//pull from cookie
			this.data.redirectUrl =$cookieStore.get('redirectUrl');
		}
	},
	
	/**
	@toc 3.
	@method done
	*/
	done: function(params) {
		// console.log(JSON.stringify(this.data.urlInfo));
	},
	
	/**
	@toc 1.
	checks if logged in and if not, redirects to login page. Returns a promise otherwise
	Also calls scvNav.updateNav to set the current page for navigation (header and footer)
	@method checkSess
	@param {Object} params
		@param {Boolean} noLoginRequired True if this page is open even without login (but still want to check login status to provide extra features IF logged in; just don't re-direct to login page if not logged in)
		@param {String} loginPage Path to go to if not logged in (defaults to "login")
	@return promise (may be blank, just so can defer loading page from routeProvider if need be to first check for auth)
	*/
	checkSess: function(params) {
		var thisObj =this;
		var defaults ={'noLoginRequired':false, 'loginPage':'login'};
		params =angular.extend(defaults, params);
		var deferred = $q.defer();
		var promise1;
		
		this.saveUrlLocation({});		//save current url for future redirects
		
		this.data.urlInfo.curNavPage =appNav.updateNav({'urlInfo':this.data.urlInfo});
		
		var goTrig =true;
		if(appConfig.state.loggedIn ===false) {
			// console.log('checking auth');
			goTrig =false;
			//check (local)storage
			var promiseStorage =appStorage.read('user', {});
			promiseStorage.then(function(user) {
				UserModel.save(user);
				$rootScope.$broadcast('loginEvt', {'loggedIn':true, 'noRedirect':true, 'user_id':user._id, 'sess_id':user.sess_id});
				if(thisObj.data.redirectUrl) {
					$location.url(appConfig.dirPaths.appPathLocation+thisObj.data.redirectUrl);
					var redirectUrlSave =thisObj.data.redirectUrl;
					thisObj.data.redirectUrl =false;		//reset for next time
					$cookieStore.remove('redirectUrl');
					if(thisObj.samePage(redirectUrlSave, {})) {
						thisObj.done({});
						deferred.resolve({'goTrig':goTrig});
					}
					else {
						deferred.reject({'goTrig':goTrig});		//reject since changing pages so will come back here from new page; don't want to load the current page
					}
				}
				else {
					thisObj.done({});
					deferred.resolve({'goTrig':goTrig});
				}
			}, function(err) {	//check cookies
				var cookieSess =$cookieStore.get('sess_id');
				var cookieUser =$cookieStore.get('user_id');
				if(cookieUser && cookieSess) {		//cookie still thinks logged in - see if can pull user data from back-end to log in user
					goTrig =false;
					
					// promise1 =appHttp.go({method:'Auth.active'}, {data:{'user_id':cookieUser, 'sess_id':cookieSess} }, {});
					promise1 =appHttp.go({}, {url:'auth/active', data:{'user_id':cookieUser, 'sess_id':cookieSess} }, {});
					promise1.then(function(response) {
						var user =response.result.user;
						UserModel.save(user);
						$rootScope.$broadcast('loginEvt', {'loggedIn':true, 'noRedirect':true, 'user_id':user._id, 'sess_id':user.sess_id});
						if(thisObj.data.redirectUrl) {
							$location.url(appConfig.dirPaths.appPathLocation+thisObj.data.redirectUrl);
							var redirectUrlSave =thisObj.data.redirectUrl;
							thisObj.data.redirectUrl =false;		//reset for next time
							$cookieStore.remove('redirectUrl');
							if(thisObj.samePage(redirectUrlSave, {})) {
								thisObj.done({});
								deferred.resolve({'goTrig':goTrig});
							}
							else {
								deferred.reject({'goTrig':goTrig});		//reject since changing pages so will come back here from new page; don't want to load the current page
							}
						}
						else {
							thisObj.done({});
							deferred.resolve({'goTrig':goTrig});
						}
					}, function(response) {
						$cookieStore.remove('sess_id');		//clear cookie to avoid endless loop
						$cookieStore.remove('user_id');		//clear cookie to avoid endless loop
						if(!params.noLoginRequired) {
							$location.url(appConfig.dirPaths.appPathLocation+params.loginPage);
							if(thisObj.samePage(params.loginPage, {})) {
								thisObj.done({});
								deferred.resolve({'goTrig':goTrig});
							}
							else {
								deferred.reject({'goTrig':goTrig});		//reject since changing pages so will come back here from new page; don't want to load the current page
							}
						}
						else {
							thisObj.done({});
							deferred.resolve({'goTrig':goTrig});
						}
					});
				}
				else {
					goTrig =true;
					if(appConfig.state.loggedIn ===false) {
						if(!params.noLoginRequired) {
							$rootScope.$broadcast('changeLayoutEvt', 'layout-login');
							//thisObj.data.redirectUrl =$location.url();		//save for after login
							$location.url(appConfig.dirPaths.appPathLocation+params.loginPage);
							if(thisObj.samePage(params.loginPage, {})) {
								thisObj.done({});
								deferred.resolve({'goTrig':goTrig});
							}
							else {
								deferred.reject({'goTrig':goTrig});		//reject since changing pages so will come back here from new page; don't want to load the current page
							}
						}
						else {
							thisObj.done({});
							deferred.resolve({'goTrig':goTrig});
						}
					}
					else {
						$rootScope.$broadcast('loginEvt', {'loggedIn':true, 'noRedirect':true});
						thisObj.done({});
						deferred.resolve({'goTrig':goTrig});
					}
				}
			});
		}
		if(goTrig) {		//no AJAXing, just handle redirect (to login OR home/main) here
			if(appConfig.state.loggedIn ===false) {
				if(!params.noLoginRequired) {
					$rootScope.$broadcast('changeLayoutEvt', 'layout-login');
					//thisObj.data.redirectUrl =$location.url();		//save for after login
					$location.url(appConfig.dirPaths.appPathLocation+params.loginPage);
					if(thisObj.samePage(params.loginPage, {})) {
						thisObj.done({});
						deferred.resolve({'goTrig':goTrig});
					}
					else {
						deferred.reject({'goTrig':goTrig});		//reject since changing pages so will come back here from new page; don't want to load the current page
					}
				}
				else {
					thisObj.done({});
					deferred.resolve({'goTrig':goTrig});
				}
			}
			else {
				$rootScope.$broadcast('loginEvt', {'loggedIn':true, 'noRedirect':true});
				thisObj.done({});
				deferred.resolve({'goTrig':goTrig});
			}
		}
		
		return deferred.promise;
	}

};
return inst;
}]);