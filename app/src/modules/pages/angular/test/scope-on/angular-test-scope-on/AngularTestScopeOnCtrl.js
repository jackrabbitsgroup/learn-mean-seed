/**
*/

'use strict';

angular.module('myApp').controller('AngularTestScopeOnCtrl', ['$scope',
function($scope) {
	$scope.onCalled =false;
	$scope.onParams =false;
	
	$scope.doBroadcast =function(params) {
		$scope.$broadcast('evtBroadcast', {p1: 'broadcast1', p2: 'broadcast2'});
	};
	
	$scope.doEmit =function(params) {
		$scope.$emit('evtEmit', {p1: 'emit1', p2: 'emit2'});
	};
	
	$scope.$on('evtOn', function(evt, params) {
		$scope.onCalled =true;
		$scope.onParams =params;
	});
}]);