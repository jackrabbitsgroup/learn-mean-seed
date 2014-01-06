/**
*/

'use strict';

angular.module('myApp').controller('CssTransitionCtrl', ['$scope',
function($scope)
{
	$scope.click_class = 'original';
	
	$scope.changeClass = function()
	{
		if($scope.click_class == 'original')
		{
			$scope.click_class = 'clicked-once';
		}
		else if($scope.click_class == 'clicked-once')
		{
			$scope.click_class = 'clicked-twice';
		}
		else
		{
			$scope.click_class = 'original';
		}
	};
}]);