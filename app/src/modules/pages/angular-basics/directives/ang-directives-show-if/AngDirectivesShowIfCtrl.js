/**
*/

'use strict';

angular.module('myApp').controller('AngDirectivesShowIfCtrl', ['$scope',
function($scope)
{
	$scope.button1_show = true;
	$scope.counter = 0;
	
	$scope.resetCounter = function()
	{
		$scope.counter = 0;
	};
}]);