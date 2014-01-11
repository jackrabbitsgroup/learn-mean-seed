/**
*/

'use strict';

angular.module('myApp').controller('JsArraysCtrl', ['$scope',
function($scope)
{
	//Arrays are created with square brackets.
	var empty_object = [];	//The empty array is an array with no elements (length 0)
	
	//You can create and initialize an array with a comma-separated list
	var arr1 =
	[
		'element0',
		'element1',
		'element2',
		1,
		true,
		42
	];
	
	//You don't have to skip lines between elements, that's just for readability
	var arr2 = ['a', 'b', 'c'];
	
	//You can access array entries by their index, using bracket notation. You can then read or alter them just like variables:
	
	//arr2[0] == 'a';	//Arrays are zero-indexed, meaning the first element is at index 0.
	arr2[0] = 'Aa';
	//arr2[0] == 'Aa';
	
	//You can create new entries this way as well. You can read an array's length using the 'length' property
	//arr2.length === 3;
	arr2[3] = 'd';
	//arr2.length === 4;
	
	//You can skip entries as well, but this does odd things to the length
	arr2[5] = 'f';
	//arr2.length === 6;
	//arr2[4] === undefined;
	
	//Numeric variables can be used to access array entries too
	var index = 1;
	//arr2[index] == 'b';
	
	var numbers = [5, 2, 567, 3];
	
	//arr2[numbers[0]] == 'f';		//Since numbers[0] === 5
	
	//The 'push' method is the easiest way to add an element to the end of an array
	numbers.push(53);
	//numbers[4] === 53;
	
	//Use 'splice' to remove elements at a certain index.
	numbers.splice(1, 2);	//Remove two elements from numbers, starting at index 1
	//now numbers is [5, 3, 53]. You can also add elements this way:
	numbers.splice(2, 0, 67, 333, 20); //Remove 0 elements at index 2, and add in the elements 67, 333, 20
	//now numbers is [5, 3, 67, 333, 20, 53].
	
	//'sort' is a very useful method for sorting array entries. The default sort order is alphabetic and ascending:
	numbers.sort();
	//now numbers is [20, 3, 333, 5, 53, 67]
	//The really cool thing about sort, though, is that you can create your own comparison function:
	
	//Sort in descending numeric order
	numbers.sort(function(a, b)
	{
		//The comparison takes two array entries, a and b
		if(a > b)
		{
			return -1;	//Have the function return a negative number if a should come before b
		}
		else if(a < b)
		{
			return 1;	//Return a positive number if a should come after b
		}
		else
		{
			return 0;	//Return 0 if it doesn't matter which comes first (they are the same)
		}
	});
	
	//Now numbers is [333, 67, 53, 20, 5, 3]
	
	//Use 'indexOf' to check if an entry exists in an array.
	//numbers.indexOf(333) === 0;
	//numbers.indexOf(20) === 3;

	//It will give you the index of the first occurrence of the value. Use 'lastIndexOf' to get the last occurrence.
	numbers.push(67);
	//Now numbers is [333, 67, 53, 20, 5, 3, 67]
	//numbers.indexOf(67) === 1;
	//numbers.lastIndexOf(67) === 6;
	
	//If the value is not in the array, indexOf returns -1
	//numbers.indexOf(4) === -1;
	
	//Remember, array entries can be any type of data, even other arrays:
	var arr3 =
	[
		false,
		{'prop1': 0},
		['a', 'b', 'c'],
		numbers,
		function(a)
		{
			return (a + 5);
		}
	];
	
	//arr3[2][0] == 'a';
	//arr3[3][1] === 67;
	numbers.push( arr3[4](6) );	//This calls the function at arr3[4] with the value 6 as input. The result, 11, is added to numbers.
	
	//Now numbers is [333, 67, 53, 20, 5, 3, 67, 11]
	
	//Beware when setting arrays (or objects) to other variables. This does not copy the array! Changing one will change both:
	var numbers2 = numbers;
	numbers2[0] = 300;
	//Now numbers is [300, 67, 53, 20, 5, 3, 67, 11]
	//arr3[3] is now also [300, 67, 53, 20, 5, 3, 67, 11] - they all point to the same array.
}]);