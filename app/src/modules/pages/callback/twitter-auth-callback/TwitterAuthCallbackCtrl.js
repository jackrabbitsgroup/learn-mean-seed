/**
*/

'use strict';

angular.module('myApp').controller('TwitterAuthCallbackCtrl', ['$scope', 'appHttp', 'UserModel', '$rootScope', '$routeParams', 
function($scope, appHttp, UserModel, $rootScope, $routeParams) {

	function init(params) {
		if($routeParams.oauth_token !==undefined && $routeParams.oauth_verifier !==undefined) {
			twitterAccessToken({});
		}
		else {
			alert('missing required URL params');
		}
	}
	
	function twitterAccessToken(params) {
		var vals ={
			oauth_verifier: $routeParams.oauth_verifier
		};
		appHttp.go({}, {url:'twitter/accessToken', data:vals}, {}, {})
		.then(function(response) {
			var user =response.result.user;
			UserModel.save(user);
			$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
		});
	}
	
	init({});
}]);