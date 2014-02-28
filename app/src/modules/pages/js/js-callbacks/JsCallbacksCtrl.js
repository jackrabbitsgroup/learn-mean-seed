/**
*/

'use strict';

angular.module('myApp').controller('JsCallbacksCtrl', ['$scope',
function($scope)
{
	var final_answer = 0;

	//Call the async function, and give it a function that tells it what to do next.
	example_asynchronous_function(2, function(answer)
	{
		//This is the callback function. It will be called by the async function when that function is finished.
		//The callback function is almost always written as the last input to the function, though of course it doesn't have to be.
		
		//In this function, we write code to do whatever it is we want to do after the async function completes.
		//Any code that depends on the async function's response, therefore, should be placed in here.
		
		final_answer = answer;
		console.log(final_answer);
	});
	
	console.log(final_answer);		//This line will be executed long before the async function completes, so final_answer will still be zero.
	
	function example_asynchronous_function(num, callback)
	{
		var num1 = 4;
		var num2 = 5;
	
		//Asynchronous part. setTimeout is a built-in Javascript function that takes a function and a number of milliseconds.
		//The function will be executed after it waits that many milliseconds.
		//While setTimeout is waiting, the rest of the code keeps going.
		setTimeout(function()
		{
			$scope.$apply(function()
			{
				var answer = (num + num1) * num2;
				
				callback(answer);		//When we're done doing whatever it is we wanted to do, we call the callback.
			});
		}, 500);
	}
	
	
	//When writing callbacks, we usually create the callback function on the fly as in the example above - 
	//note that the callback function is defined in the arguments list and never given a name (because we don't need one).
	//You can write the callback separately and then simply reference it, of course, as in the example below.
	
	function my_callback_function(answer)
	{
		console.log("my_callback_function's answer: " + answer);
	}
	
	example_asynchronous_function(0, my_callback_function);
	
	//Sandbox start
	
	//Sandbox end
}]);