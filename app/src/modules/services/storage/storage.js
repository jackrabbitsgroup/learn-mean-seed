/**
@module storage
@class storage

@toc
1. save
2. read
3. delete1
4. removeOne

@dependencies
lawnchair.io
*/

'use strict';

angular.module('app').
factory('appStorage', ['$q',
function($q) {
var inst ={

	data: {
		user: false
	},
	keys: [],		//lawnchair keys doesn't seem to work..
	
	/**
	NOTE: the documentation on lawnchair wasn't very clear to me - if you don't set a 'key' it sets a unique id for you (but then I'm not sure how to clear/retrieve it later..) but if you do, it still saves BOTH the key and value.. So I had to only return obj.value for the read/get later..
	@toc 1.
	@method save
	*/
	save: function(key, val, params) {
		var self =this;
		new Lawnchair(function() {
			if(self.keys.indexOf(key) <0) {
				self.keys.push(key);
			}
			this.save({key:key, value:val});
		});
	},
	
	/**
	@toc 2.
	@method read
	*/
	read: function(key, params) {
		var deferred =$q.defer();
		new Lawnchair(function() {
			var self =this;
			this.exists(key, function(exists) {
				if(exists) {
					// console.log('storage exists: '+key);
					self.get(key, function(obj) {
						deferred.resolve(obj.value);		//have to pass back just the 'value' subkey..
					});
				}
				else {
					// console.log('storage does NOT exist: '+key);
					deferred.reject({});
				}
			});
		});
		return deferred.promise;
	},
	
	/**
	@toc 3.
	@method delete1
	@param {String} key The key to remove OR null to remove everything
	@return promise
	*/
	delete1: function(key, params) {
		var deferred =$q.defer();
		var self =this;
		new Lawnchair(function() {
			if(key ===undefined || !key) {		//remove all
				// this.nuke();		//bug - apparently nuke doesn't work..
				var ii;
				//doesn't work either.. lawnchair seems to have some serious bugs...
				// this.keys( function(keys) {
					// for(ii=0; ii<keys.length; ii++) {
						// this.remove(keys[ii]);
					// }
				// });
				var promises =[];
				for(ii=0; ii<self.keys.length; ii++) {
					promises[ii] =self.removeOne(self.keys[ii], {});
					// this.remove(self.keys[ii]);
				}
				if(promises.length >0) {
					//no way to get to reject/error promise since removeOne ALWAYS resolves
					$q.all(promises).then(function(ret1) {
						deferred.resolve({});
					});
				}
				else {
					deferred.resolve({});
				}
			}
			else {
				var promise1 =self.removeOne(key, {});
				//no way to get to reject/error promise since removeOne ALWAYS resolves
				promise1.then(function(ret1) {
					deferred.resolve({});
				});
			}
		});
		return deferred.promise;
	},
	
	/**
	@toc 4.
	@method removeOne
	@return promise
	*/
	removeOne: function(key, params) {
		var deferred =$q.defer();
		new Lawnchair(function() {
			this.remove(key, function() {
				deferred.resolve({});
			});
		});
		return deferred.promise;
	}

};
return inst;
}]);