'use strict';

angular.module('myApp').controller('TestCtrl', ['$scope', '$timeout', 'appHttp', 'UserModel', '$location', function($scope, $timeout, appHttp, UserModel, $location) {
	
	$scope.user =UserModel.load();
	
	$scope.swipeIt =function(evt, direction, params) {
		console.log('swipe: '+direction);
	};
	
	$scope.tapIt =function(evt, params) {
		console.log('tap');
	};
}]);