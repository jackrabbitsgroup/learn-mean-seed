/**
*/

'use strict';

angular.module('myApp').controller('AngEventsCtrl', ['$scope',
function($scope)
{
	
}]);

angular.module('myApp').controller('AngEventsParentCtrl', ['$scope',
function($scope)
{
	$scope.parent_count = 1;
	
	$scope.increaseChildCount = function()
	{
		//Trigger the event 'AngEventsIncChildCount' on any child controllers. Pass along the current parent_count value
		$scope.$broadcast('AngEventsIncChildCount', {'number': $scope.parent_count});
	};
	
	//Listen for the event to increase this controller's counter.
	$scope.$on('AngEventsIncParentCount', function(event, params)
	{
		//The first input to an event listener function is always an 'event' object that Angular creates.
		//You'll rarely need to use this event object, but don't forget to set aside an input for it in your function.
		//The additional inputs come from the data passed via the $broadcast or $emit.
		//In Mean Seed, we almost always pass just one input, an object, and simply stuff whatever data we want into this object.
		//In the listener function, we often name this object 'params', but you are of course free to name it whatever you like.
		
		$scope.parent_count += params.number;
	});
}]);

angular.module('myApp').controller('AngEventsChildCtrl', ['$scope', '$rootScope',
function($scope, $rootScope)
{
	$scope.child_count = 1;
	
	$scope.$on('AngEventsIncChildCount', function(event, params)
	{
		$scope.child_count += params.number;
	});
	
	$scope.increaseParentCount = function()
	{
		//Trigger the event 'AngEventsIncParentCount' on any parent controllers. Pass along the current child_count value
		$scope.$emit('AngEventsIncParentCount', {'number': $scope.child_count});
	};
	
	$scope.incrementChildCount = function()
	{
		$scope.child_count++;
	};
	
	$scope.incrementBoth = function()
	{
		//$rootScope.$broadcast will reach events anywhere, even in siblings.
		$rootScope.$broadcast('AngEventsIncrementChildCount', {});
	};
	
	$scope.$on('AngEventsIncrementChildCount', function(event, params)
	{
		$scope.child_count++;
	});
	
	$scope.sandboxFunction = function()
	{
	
	};
}]);