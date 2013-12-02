/**
@module ang-login
@class ang-user-delete

This COMPLETELY removes the user from the database!

// URL GET params
// @param {String} [email] The email of the user to delete (otherwise will default to try to get currently logged in user via UserModel)
NOTE: backend security should prevent user from deleting anyone but himself so the email URL param shouldn't really matter since if not logged in, it should fail anyway.. ALSO, backend doesn't currently support removing by email anyway..
*/

'use strict';

angular.module('myApp').controller('UserDeleteCtrl', ['$scope', '$location', 'appHttp', 'UserModel', '$routeParams', function($scope, $location, appHttp, UserModel, $routeParams) {
	var user =UserModel.load();
	var dataUser =user;
	
	var promise1 =appHttp.go({}, {'url':'user/delete1', data: {user_id:dataUser._id} }, {});
	promise1.then( function(data) {
		//go to logout now to log this user out
		$location.url($scope.appPathLocation+"logout");
	});
}]);