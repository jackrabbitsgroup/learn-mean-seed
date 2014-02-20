/**
*/

'use strict';

angular.module('myApp').controller('AngScopeInheritanceCtrl', ['$scope',
function($scope)
{
	
}]);

angular.module('myApp').controller('AngScopeInheritanceParentCtrl', ['$scope',
function($scope)
{
	$scope.parent_count = 0;
	
	//This $scope function is defined on the parent controller, so it can change the parent's variable with no problems,
	//even if you call it from the child controller.
	$scope.incrementParentCount = function()
	{
		$scope.parent_count++;
	};
}]);

angular.module('myApp').controller('AngScopeInheritanceChildCtrl', ['$scope',
function($scope)
{
	$scope.child_count = 0;
	
	$scope.incrementChildCount = function()
	{
		$scope.child_count++;
	};
	
	//This $scope function is defined on the child, but attempts to adjust the parent's counter directly.
	//Calling this function will cause a desynchronization of the child's version of $scope.parent_count and the parent's.
	$scope.incrementBoth = function()
	{
		$scope.child_count++;
		$scope.parent_count++;
	};
}]);