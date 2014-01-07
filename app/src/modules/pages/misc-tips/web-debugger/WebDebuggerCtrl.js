/**
*/

'use strict';

angular.module('myApp').controller('WebDebuggerCtrl', ['$scope',
function($scope)
{
	console.log("Hello Web Debugger! This text was logged to the console with Javascript's console.log().");
	console.log("Console logging can be a useful debugging tool, since it lets you write messages to yourself or other coders without interfering with your page.");
	console.log("You can also inspect data this way. This is particularly useful with javascript objects, especially if you're not sure what the object looks like!");
	console.log("Take a look at this page's javascript controller file to see how it's done.");
	
	var number = 54;
	console.log(number);
	
	var example_array =
	[
		'blah',
		'some_string',
		42,
		'a',
		'b',
		'c'
	];
	console.log(example_array);
	
	var example_object =
	{
		'foo': 'bar',
		'example_property': 'example_value',
		'nested_object':
		{
			'x': 1,
			'y': 2,
			'z': 3
		},
		'nested_array': example_array
	};
	console.log(example_object);
	
	console.log(example_object.example_property);
	example_object.example_property = 777;
	console.log(example_object.example_property);
	
	
}]);