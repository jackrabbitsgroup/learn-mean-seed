/**
@module ang-login
@class ang-logout

@toc
1. clearData
*/

'use strict';

angular.module('myApp').controller('LogoutCtrl', ['$scope', '$location', '$cookieStore', 'appHttp', 'UserModel', '$rootScope', 'appStorage', function($scope, $location, $cookieStore, appHttp, UserModel, $rootScope, appStorage) {
	var user =UserModel.load();
	var sessId =$cookieStore.get('sess_id');
	
	function init(params) {
		var promise1 =appHttp.go({}, {url: 'auth/logout', data: {user_id:user._id, sess_id:sessId}}, {suppressErrorAlert:true});
		promise1.then( function(data) {
			clearData({});
			$rootScope.$broadcast('loginEvt', {'loggedIn':false});
		}, function(data) {
			clearData({});
			//logout anyway..
			$rootScope.$broadcast('loginEvt', {'loggedIn':false});
		});
	}
	
	/**
	Clear all (user) data - in javascript memory and localStorage. As more frontend / memory data is added, make sure to clear/destroy them here!
	@toc 1.
	@method clearData
	*/
	function clearData(params) {
		$cookieStore.remove('sess_id');
		$cookieStore.remove('user_id');
		UserModel.destroy();
		appStorage.delete1();
		// appStorage.delete1('user');		//the above wasn't working..
	}
	
	init({});
}]);