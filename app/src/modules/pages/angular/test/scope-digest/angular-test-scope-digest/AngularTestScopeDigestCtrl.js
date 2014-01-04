/**
*/

'use strict';

angular.module('myApp').controller('AngularTestScopeDigestCtrl', ['$scope', '$q', '$timeout', 
function($scope, $q, $timeout) {

	$scope.promiseVal =false;
	
	/**
	@method $scope.runPromise
	@param {Object} params
		@param {String} type One of 'success' or 'error' for whether to deferred.resolve or deferred.reject
	*/
	$scope.runPromise =function(params) {
		var deferred =$q.defer();
		if(params.type =='success') {
			deferred.resolve(params);
		}
		else {
			deferred.reject(params);
		}
		return deferred.promise;
	};
	
	//call immediately
	//success
	$scope.runPromise({type:'success'})
	.then(function(retSuccess) {
		$scope.promiseVal ='success';
		console.log('success!');
	});
	
	//error
	$timeout(function() {
		$scope.runPromise({type:'error'})
		.then(function(retSuccess) {
			$scope.promiseVal ='success';
			console.log('success!');
		}, function(retErr) {
			$scope.promiseVal ='error';
			console.log('error!');
		});
	}, 1000);
	
}]);