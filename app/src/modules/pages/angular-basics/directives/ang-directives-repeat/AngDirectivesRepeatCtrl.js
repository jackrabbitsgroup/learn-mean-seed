/**
*/

'use strict';

angular.module('myApp').controller('AngDirectivesRepeatCtrl', ['$scope',
function($scope)
{
	//The array that you want to ng-repeat over needs to be stored in a $scope variable, otherwise the HTML doesn't know it exists.
	$scope.my_array = 
	[
		{
			'text': 'Hello World!',
			'bg_color': '#3399FF'
		},
		{
			'text': 'Example text',
			'bg_color': '#FF6666'
		},
		{
			'text': 'Goodbye World!',
			'bg_color': 'green'
		},
	];
	//Note that the entries in the array are objects {}, not strings or numbers or anything else.
	//This is important; ng-repeat does not work well with non-object entries.
	
	var colors = ['#3399FF', '#FF6666', 'green'];
	
	$scope.example_array =
	[
		{
			'bg_color': colors[0],
			'next_color': colors[1]
		},
		{
			'bg_color': colors[0],
			'next_color': colors[1]
		},
	];
	
	//This function takes an index of an element in $scope.example_array and cycles it to the next color
	$scope.cycleBgColor = function(index)
	{
		var next_color = $scope.example_array[index].next_color;
		
		//Find the index of the next color
		var color_index = colors.indexOf(next_color);
		
		//Set the current color to the next color
		$scope.example_array[index].bg_color = next_color;
		
		//Update the element's next_color
		if((color_index + 1) < colors.length)
		{
			$scope.example_array[index].next_color = colors[color_index + 1];
		}
		else
		{
			//We're at the end of the colors array; wrap around to the start
			$scope.example_array[index].next_color = colors[0];
		}
	};
	
	$scope.addElementToExampleArray = function()
	{
		//Add a new entry to the end of example_array
		$scope.example_array.push({'bg_color': colors[0], 'next_color': colors[1] });
	};
	
	//Sandbox Start
	
	//Sandbox End
	
}]);