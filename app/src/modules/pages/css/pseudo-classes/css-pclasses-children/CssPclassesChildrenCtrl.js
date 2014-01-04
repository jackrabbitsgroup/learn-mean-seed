/**
*/

'use strict';

angular.module('myApp').controller('CssPclassesChildrenCtrl', ['$scope',
function($scope)
{
	//Create an empty array
	$scope.my_child_elements = [];
	
	//Fill the array with 20 entries
	var ii;
	for(ii = 0; ii < 20; ii++)
	{
		$scope.my_child_elements[ii] = {'element_text': 'Element ' + (ii + 1)};
	}
	
	//Create an empty array
	$scope.challenge_elements = [];
	
	//Fill the array with 10 entries
	for(ii = 0; ii < 10; ii++)
	{
		$scope.challenge_elements[ii] = {'element_text': 'Element ' + (ii + 1)};
	}
}]);