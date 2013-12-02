/**
*/

'use strict';

angular.module('myApp').controller('LoginCtrl', ['$scope', 'appHttp', '$location', 'UserModel', '$rootScope', function($scope, appHttp, $location, UserModel, $rootScope) {
	
	/**
	@method $scope.login
	@param {Object} params
		@param {Object} vals The form input values to login with
	@param {Function} callback
	*/
	$scope.login =function(params, callback) {
		var promise1 =appHttp.go({}, {url:'auth/login', data:params.vals}, {});
		promise1.then(function(response) {
			var user =response.result.user;
			UserModel.save(user);
			$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
			callback({});
		});
	};
	
	/**
	@method $scope.forgotPass
	@param {Object} params
		@param {String} email
	@param {Function} callback
	*/
	$scope.forgotPass =function(params, callback) {
		var promise =appHttp.go({}, {url:'auth/forgotPassword', data: {email:params.email} }, {});
		promise.then(function(response) {
			$location.url($scope.appPathLocation+"password-reset");
			callback({});
		});
	};
}]);