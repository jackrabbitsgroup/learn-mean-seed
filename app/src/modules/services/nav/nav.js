/**
Uses nav-config.js to set the objects / nav list (see there for more info / documentation).

Sets up the header and footer navigation buttons / displays.

@module nav
@class nav

@toc
1. init
2. initPaths
3. initComponents
4. initPages
5. updateNav
5.1. broadcastNavUpdates
5.2. updateRouteChangeCounter
5.3. extendNav
6. getNav
6.5. setNav
7. getPageFromRoute
8. historyBack

*/

'use strict';

angular.module('app').
factory('appNav', ['$rootScope', 'jrgArray', 'appNavConfig', function($rootScope, jrgArray, appNavConfig) {
var selfGlobal;		//set to be able to reference THIS function/service even if the 'this' keyword is for something else - i.e. for historyBack overwriting from appNavConfig

var inst ={

	inited: false,		//trigger that will be set after this first time this is run
	initTrigs: {
		routeChange: false		//used to skip the first time so don't go back out of the app on history.back
	},
	pathRoot: false,		//appConfig.dirPaths.staticPath will be prepended
	paths: {},		//holds file paths for various things, specifically templates (HTML template files) and appPathLink. See initPaths function for more info.
	
	historyCounter: 0,		//will increment on each route change (so can avoid going "back" outside of app)
	
	components :{},		//will hold parts of pages for use later

	pages :{},		//will hold all the navigation page objects for defining the nav (header and footer)

	/**
	@property curPage Will hold the current navigation object/page
	@type Object
	*/
	curPage: false,
	/**
	@property curPageKey Will hold the key for the the current navigation/page (i.e. 'login')
	@type String
	*/
	curPageKey: false,
	
	//For all the pages where the url route is not the same as the pages key
	pagesRouteMap: {
	},
	
	/**
	@toc 1.
	@method init
	*/
	init: function(params) {
		selfGlobal =this;
		if(!this.inited) {		//only init once
			var self =this;
			this.initPaths(params);
			this.initComponents({});
			this.initPages(params);
			
			this.inited =true;		//set for next time
		}
	},
	
	/**
	@toc 2.
	@method initPaths
	*/
	initPaths: function(params) {
		this.pathRoot =appNavConfig.pathRoot;
		this.paths =appNavConfig.paths;
	},
	
	/**
	@toc 3.
	@method initComponents
	*/
	initComponents: function(params) {
		appNavConfig.historyBack =this.historyBack;		//overwrite to make it point to THIS function
		
		this.components =appNavConfig.components;
		
	},
	
	/**
	NOTE: need to COPY / deep clone the components otherwise they'll overwrite backwards (copying arrays/objects by reference instead of by value)
	@toc 4.
	@method initPages
	*/
	initPages: function(params) {
		this.pages =appNavConfig.pages;
		this.pagesRouteMap =appNavConfig.pagesRouteMap;
	},
	
	/**
	@toc 5.
	@method updateNav
	@param {Object} params
		@param {Object} urlInfo Holds parsed URL info
			@param {String} page i.e. 'login'
			@param {String} queryParams i.e. 'yes=1&no=2'
			@param {Object} queryParamsObj Object of parsed URL GET query params (i.e. {yes:'1', no:'2'})
			@param {String} pageToUse The actual nav page key - this will skip any url checks and just use this given page. This MUST exactly match a this.pages nav item (i.e. 'eventviewinfo')!
	@return {String} unique identifier for this page
	*/
	updateNav: function(params) {
		var self =this;
		var curPage;
		if(params.pageToUse) {
			curPage =params.pageToUse;
		}
		else {
			// console.log(params.urlInfo);
			curPage =this.getPageFromRoute(params.urlInfo.page, {queryParamsObj: params.urlInfo.queryParamsObj});
		}
		// console.log('updateNav: curPage: '+curPage);
		this.curPageKey =curPage;		//save
		this.curPage =this.pages[curPage];		//save
		
		this.broadcastNavUpdates({});
		this.updateRouteChangeCounter({});
		
		//return a unique identifier for this page/view/nav (that takes into account the URL/query params)
		var pageToReturn =curPage;
		if(curPage =='defaultPage') {		//if no nav defined for this page/URL params combination, just use the page (without query params)
			pageToReturn =params.urlInfo.page;
		}
		return pageToReturn;
	},
	
	/**
	@toc 5.1.
	@method broadcastNavUpdates
	*/
	broadcastNavUpdates: function(params) {
		$rootScope.$broadcast('appNavHeaderUpdate', {nav: this.curPage});		//update header
		$rootScope.$broadcast('appNavFooterUpdate', {nav: this.curPage});		//update footer
		var layoutClass ='layout-'+this.curPageKey;
		$rootScope.$broadcast('changeLayoutEvt', layoutClass);		//update content class
	},
	
	/**
	@toc 5.2.
	@method updateRouteChangeCounter
	*/
	updateRouteChangeCounter: function(params) {
		if(this.initTrigs.routeChange) {		//if already inited (not the FIRST one)
			this.historyCounter++;		//increment on each page change
		}
		else {
			this.initTrigs.routeChange =true;		//set for next time
		}
	},
	
	/**
	@toc 5.3.
	@method extendNav
	*/
	extendNav: function(newNavParts, params) {
		this.curPage =angular.extend(this.curPage, newNavParts);
		this.broadcastNavUpdates({});
		this.updateRouteChangeCounter({});
	},
	
	/**
	@toc 6.
	@method getNav
	*/
	getNav: function(params) {
		return jrgArray.copy(this.curPage, {});		//must return COPY otherwise changes will overwrite objects here!
	},
	
	/**
	@toc 6.5.
	@method setNav
	*/
	setNav: function(newPage, params) {
		this.curPage =newPage;
		this.broadcastNavUpdates({});
		this.updateRouteChangeCounter({});
	},
	
	/**
	@toc 7.
	@method getPageFromRoute
	@param {String} urlPage i.e. 'login' or 'tribe-members'
	@param {Object} [params]
		@param {Object} queryParamsObj Object of parsed URL GET query params (i.e. {page:'yes'}) to check against in ADDITION to checking the url
	*/
	getPageFromRoute: function(urlPage, params) {
		var page =false;
		var regex;
		if(params.queryParamsObj ===undefined) {
			params.queryParamsObj ={};
		}
		var urlPageSanitized =urlPage.replace(/[-_]/g, '').toLowerCase();		//remove special characters (dashes and underscores) in route for matching
		if(this.pages[urlPage] !==undefined || this.pages[urlPageSanitized] !==undefined) {		//check keys directly
			// page =urlPage;
			page =urlPageSanitized;
		}
		if(!page) {		//check map
			var xx, qq, matchAll;
			for(xx in this.pagesRouteMap) {
				if(this.pagesRouteMap[xx].urlRegex !==undefined) {		//regex match
					regex = new RegExp(this.pagesRouteMap[xx].urlRegex, '');
					if(urlPageSanitized.match(regex)) {
						page =xx;
					}
				}
				if(!page && this.pagesRouteMap[xx].url ==urlPageSanitized) {		//match
					//check url params too
					if(this.pagesRouteMap[xx].params !==undefined) {
						matchAll =true;
						for(qq in this.pagesRouteMap[xx].params) {
							if(params.queryParamsObj[qq] ===undefined || params.queryParamsObj[qq] !==this.pagesRouteMap[xx].params[qq]) {
								matchAll =false;
								break;
							}
						}
						if(matchAll) {
							page =xx;
							break;
						}
					}
					else {		//no params to check
						page =xx;
						break;
					}
				}
			}
		}
		if(!page) {		//fail safe - use default nav page
			page ='defaultPage';
		}
		return page;
	},
	
	/**
	@toc 8.
	@method historyBack
	*/
	historyBack: function(params) {
		var self =selfGlobal;		//can't use 'this' keyword since that refers to appNavConfig where the button components were originally declared
		// console.log('historyCounter: '+self.historyCounter);
		if(self.historyCounter >0) {
			history.back();
			self.historyCounter =self.historyCounter -2;		//have to subtract 2 since going back will cause a route change that will increment the counter again
		}
	}
};
inst.init({});
return inst;
}]);