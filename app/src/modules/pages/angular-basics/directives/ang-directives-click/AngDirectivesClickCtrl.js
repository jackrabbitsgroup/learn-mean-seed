/**
*/

'use strict';

angular.module('myApp').controller('AngDirectivesClickCtrl', ['$scope',
function($scope)
{
	$scope.count1 = 0;
	$scope.count2 = 0;
	
	var count3 = 0;
	
	$scope.incrementFunction = function()
	{
		$scope.count1 -= 1;
		$scope.count2 += 1;
		
		//You can use non-scope variables in a function called by a click event; it's only in the HTML file that non-scope variables don't exist.
		count3++;
	};
	
	//Sandbox start
	
	//Sandbox end
}]);