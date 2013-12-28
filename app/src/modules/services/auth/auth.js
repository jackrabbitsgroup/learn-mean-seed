/**
@class auth

@toc
0. init
4. samePage
2. saveUrlLocation
3. done		//called AFTER login status is figured out - in case need to do any logic AFTER have login status (and user object filled if logged in)
5. checkAuth
5.1. checkUrlParams
1.5. handleLoginRequest
1.6. preDone
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
			queryParamsObj: false,
			curNavPage: false		//holds the 'page' name used by the nav service (this uniquely identifies the page/view WITHOUT any query params)
		}
	},
	
	inited: false,
	
	/**
	@toc 0.
	@method init
	*/
	init: function(params) {
		if(!this.inited) {
			$rootScope.$on('$routeChangeStart', function(scope, next, current) {
				$rootScope.$broadcast('evtLoadingStart', {});
			});
		}
		this.inited =true;
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
		var skipPages =['login', 'signup', 'user-delete'];
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
	Called before deferred.resolve - this abstracts logic to ONE place for any stuff to do before loading the page
	@toc 3.
	@method done
	*/
	done: function(params) {
		// console.log(JSON.stringify(this.data.urlInfo));
		$rootScope.$broadcast('evtLoadingDone', {});
	},
	
	/**
	Checks if user has privileges to view this page (i.e. logged in, member status)
	@toc 5.
	@method checkAuth
	@param {Object} params
		@param {Object} [auth] Object of objects; each key is an authorization required for this page and has a 'redirect' key inside it that tells which page to send the user to if they do NOT meet this authorization and thus aren't allowed to view this page
			@param {Object} [loggedIn] Add this key to require the user to be logged in to view this page. NOTE: the default redirect page is 'login' so this value does NOT need to be set if you want to just use the default.
			@param {Object} [member] Add this key to require the user to be a member (i.e. not a 'guest' status)
	@param {Object} user User object for checking member status, etc.
	@param {Object} ppNew
		@param {Boolean} loggedIn True if the user is logged in
	@return {Boolean} True if allowed to view this page
	@example
		checkAuth({}, {status:'member'}, {loggedIn:false});
		
		checkAuth(
			{
				auth: {
					loggedIn: {
						exceptionUrlParamsRegex: {
							p1: '.*'		//will match anything so as long as 'p1' URL param is present, will be allowed, even if not logged in
						}
					},		//require user to be logged in to view this page
					//require user to be a member (user.status =='member') to view this page and if NOT, redirect user to 'auth-member' page
					member: {
						redirect: 'auth-member'
					}
				}
			},
			{
				status: 'guest'
			},
			{
				loggedIn:true
			}
		);
	*/
	checkAuth: function(params, user, ppNew) {
		var ret ={valid: true, redirectPage:''};
		if(params.auth !==undefined) {
			//order matters here - check the most stringent first
			if(ret.valid && params.auth.loggedIn !==undefined && !ppNew.loggedIn) {
				//since NOT logged in, not authorized to view this page
				ret.valid =false;
				//search through the exception url params - if a match, ALLOW this page
				if(params.auth.loggedIn.exceptionUrlParamsRegex !==undefined) {		//check regex exceptions as well
					//if exception match found, this page is VALID
					ret.valid =this.checkUrlParams(params.auth.loggedIn.exceptionUrlParamsRegex, {});
				}
				if(!ret.valid) {
					if(params.auth.loggedIn.redirect ===undefined) {
						params.auth.loggedIn.redirect ='login';		//default
					}
					ret.redirectPage =params.auth.loggedIn.redirect;
					$rootScope.$broadcast('changeLayoutEvt', 'login');
					// $location.url(appConfig.dirPaths.appPathLocation+params.auth.loggedIn.redirect);
				}
			}
			if(ret.valid && params.auth.member !==undefined && (!user || user ===undefined || user.status ===undefined || user.status =='guest')) {
				//since a guest (thus NOT a member), not authorized to view this page
				ret.valid =false;
				//search through the exception url params - if a match, ALLOW this page
				if(params.auth.member.exceptionUrlParamsRegex !==undefined) {		//check regex exceptions as well
					//if exception match found, this page is VALID
					ret.valid =this.checkUrlParams(params.auth.member.exceptionUrlParamsRegex, {});
				}
				if(!ret.valid) {
					ret.redirectPage =params.auth.member.redirect;
					// $location.url(appConfig.dirPaths.appPathLocation+params.auth.member.redirect);
				}
			}
		}
		return ret;
	},
	
	/**
	Go through the given url params regular expressions and see if they match the current page's URL params
	@toc 5.1.
	@method checkUrlParams
	@param {Object} urlParamsRegex Key value pairs where the key is a URL param and the regex is the value to match against for that key
	@param {Object} params
	@return {Boolean} True if at least one key/regex value match the current URL params
	*/
	checkUrlParams: function(urlParamsRegex, params) {
		var xx, yy, pattern, regex;
		var foundCount =0;
		var matchCount =0;
		var valid =false;
		for(xx in urlParamsRegex) {
			for(yy in this.data.urlInfo.queryParamsObj) {
				if(xx ==yy) {
					pattern =urlParamsRegex[xx];
					regex =new RegExp(pattern);
					if(this.data.urlInfo.queryParamsObj[yy].match(regex)) {
						matchCount++;
					}
					foundCount++;
				}
			}
		}
		if(matchCount >0) {
			valid =true;
		}
		return valid;
	},
	
	/**
	@toc 1.5
	@method handleLoginRequest
	*/
	handleLoginRequest: function(response, deferred, goTrig, params) {
		var thisObj =this;
		var user =response.result.user;
		UserModel.save(user);
		thisObj.preDone(deferred, goTrig, params, {loggedIn:true, checkRedirectUrl:true});
	},
	
	/**
	Called to handle the deferred.resolve OR deferred.reject as well as first checking authorizations and doing the redirect - basically this abstracts all the common copy/paste code from the various conditions
	@toc 1.6.
	@method preDone
	@param {Object} deferred
	@param {Boolean} goTrig
	@param {Object} params
		@param {Object} [auth] Object of objects; each key is an authorization required for this page and has a 'redirect' key inside it that tells which page to send the user to if they do NOT meet this authorization and thus aren't allowed to view this page
			@param {Object} [loggedIn] Add this key to require the user to be logged in to view this page. NOTE: the default redirect page is 'login' so this value does NOT need to be set if you want to just use the default.
			@param {Object} [member] Add this key to require the user to be a member (i.e. not a 'guest' status)
	@param {Object} ppNew
		@param {Boolean} loggedIn True if the user is logged in / to login the user
		@param {Boolean} checkRedirectUrl True to go to redirect url IF it exists
	@return {Object} (via Promise)
		@param {Boolean} goTrig
		@param {Boolean} valid True if authorized to see the original page
		@param {String} redirectPage The page to go to (if NOT authorized), i.e. 'login'
	*/
	preDone: function(deferred, goTrig, params, ppNew) {
		var thisObj =this;
		var user =UserModel.load();
		var retAuth =thisObj.checkAuth(params, user, {loggedIn:ppNew.loggedIn});
		//add goTrig to be returned by promise too
		retAuth.goTrig =goTrig;
		
		if(!retAuth.valid) {
			if(thisObj.samePage(retAuth.redirectPage, {})) {
				thisObj.done({});
				deferred.resolve(retAuth);
			}
			else {
				deferred.reject(retAuth);
			}
			$location.url(appConfig.dirPaths.appPathLocation+retAuth.redirectPage);
		}
		else {		//valid - authorized
			if(ppNew.loggedIn ===false) {
				//login not required for this page
				thisObj.done({});
				deferred.resolve(retAuth);
			}
			else {
			// else if(ppNew.loggedIn ===true) {
				$rootScope.$broadcast('loginEvt', {'loggedIn':true, 'noRedirect':true, 'user_id':user._id, 'sess_id':user.sess_id});
				if(ppNew.checkRedirectUrl !==undefined && ppNew.checkRedirectUrl && thisObj.data.redirectUrl) {
					$location.url(appConfig.dirPaths.appPathLocation+thisObj.data.redirectUrl);
					var redirectUrlSave =thisObj.data.redirectUrl;
					thisObj.data.redirectUrl =false;		//reset for next time
					$cookieStore.remove('redirectUrl');
					if(thisObj.samePage(redirectUrlSave, {})) {
						thisObj.done({});
						deferred.resolve(retAuth);
					}
					else {
						deferred.reject(retAuth);		//reject since changing pages so will come back here from new page; don't want to load the current page
					}
				}
				else {
					thisObj.done({});
					deferred.resolve(retAuth);
				}
			}
		}
	},
	
	/**
	@toc 1.
	checks if logged in and if not, redirects to login page. Returns a promise otherwise
	Also calls scvNav.updateNav to set the current page for navigation (header and footer)
	@method checkSess
	@param {Object} params
		@param {Object} [auth] Object of objects; each key is an authorization required for this page and has a 'redirect' key inside it that tells which page to send the user to if they do NOT meet this authorization and thus aren't allowed to view this page
			@param {Object} [loggedIn] Add this key to require the user to be logged in to view this page. NOTE: the default redirect page is 'login' so this value does NOT need to be set if you want to just use the default.
			@param {Object} [member] Add this key to require the user to be a member (i.e. not a 'guest' status)
	@return promise (may be blank, just so can defer loading page from routeProvider if need be to first check for auth)
	@example
		//no auth required (ANYONE can view this page)
		appAuth.checkSess({});
		
		//login AND member required
		appAuth.checkSess({
			auth: {
				loggedIn: {},		//require user to be logged in to view this page
				//require user to be a member (user.status =='member') to view this page and if NOT, redirect user to 'auth-member' page
				member: {
					redirect: 'auth-member'
				}
			}
		});
	*/
	checkSess: function(params) {
		var thisObj =this;
		var defaults ={};
		params =angular.extend(defaults, params);
		var deferred = $q.defer();
		var promise1;
		
		this.saveUrlLocation({});		//save current url for future redirects
		
		this.data.urlInfo.curNavPage =appNav.updateNav({'urlInfo':this.data.urlInfo});
		
		var goTrig =true;
		
		//can put encrypted login handling here (i.e. pull user login info from GET params and log in user accordingly)
		
		if(appConfig.state.loggedIn ===false) {
			goTrig =false;
			//check (local)storage
			var promiseStorage =appStorage.read('user', {});
			promiseStorage.then(function(user) {
				UserModel.save(user);
				thisObj.preDone(deferred, goTrig, params, {loggedIn:true, checkRedirectUrl:true});
			}, function(err) {	//check cookies
				var cookieSess =$cookieStore.get('sess_id');
				var cookieUser =$cookieStore.get('user_id');
				if(cookieUser && cookieSess) {		//cookie still thinks logged in - see if can pull user data from back-end to log in user
					goTrig =false;
					
					// promise1 =appHttp.go({method:'Auth.active'}, {data:{'user_id':cookieUser, 'sess_id':cookieSess} }, {});
					promise1 =appHttp.go({}, {url:'auth/active', data:{'user_id':cookieUser, 'sess_id':cookieSess} }, {});
					promise1.then(function(response) {
						thisObj.handleLoginRequest(response, deferred, goTrig, {});
					}, function(response) {
						$cookieStore.remove('sess_id');		//clear cookie to avoid endless loop
						$cookieStore.remove('user_id');		//clear cookie to avoid endless loop
						thisObj.preDone(deferred, goTrig, params, {loggedIn: false});
					});
				}
				else {
					goTrig =true;
					//has to NOT be logged in to get here (see check above)
					// if(appConfig.state.loggedIn ===false) {
						thisObj.preDone(deferred, goTrig, params, {loggedIn: false});
					// }
					// else {
						// thisObj.preDone(deferred, goTrig, params, {loggedIn: true});
					// }
				}
			});
		}
		if(goTrig) {		//no AJAXing, just handle redirect (to login OR home/main) here
			//no way to get here with loggedIn false AND goTrig true?
			// if(appConfig.state.loggedIn ===false) {
				// thisObj.preDone(deferred, goTrig, params, {loggedIn: false});
			// }
			// else {
				thisObj.preDone(deferred, goTrig, params, {loggedIn: true});
			// }
		}
		
		return deferred.promise;
	}

};
inst.init({});
return inst;
}]);