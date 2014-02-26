/**
*/

'use strict';

angular.module('myApp').controller('JsPromisesCtrl', ['$scope', '$q',
function($scope, $q)
{

	var promise = example_promise_function(4);	//Calls the promise-producing function, which returns a promise.
	
	//Now we take that promise and tell it what to do once it's done.
	promise.then(
		function(result_object)
		{
			//The first argument in the .then() is the success function. It will be called if the promise is resolved.
			//The input 'result_object' comes from the input to the .resolve() from the promise-producing function.
			
			//result_object.code === 0;
			//result_object.msg = 'Success!';
			//result_object.answer === 8;		//3 + 1 + 4
			
			//Now we do whatever it is we wanted to do with the output from the promise-producing function
			//This is just an example, so there isn't actually anything we wanted to do, so we'll just log some data to the console.
			console.log(result_object.msg);
			console.log(result_object.answer);
		},
		function(result_object)
		{
			//The first argument in the .then() is the failure function. It will be called if the promise is rejected.
			
			//result_object.code === 1;
			//result_object.msg = 'Error: answer is less than 5';
			
			console.log(result_object.msg);
			console.log(result_object.answer);
		}
	);

	function example_promise_function(num)
	{
		var deferred = $q.defer();
		
		//Though not technically part of promises, a single return object like this one is a strategy we use often in Mean Seed. 
		var ret = {'code': 0, 'msg': '', 'answer': 0};
		
		var example_var1 = 2;
		var example_var2 = 1;
		
		//Asynchronous part. setTimeout is a built-in Javascript function that takes a function and a number of milliseconds.
		//The function will be executed after it waits that many milliseconds.
		//While setTimeout is waiting, the rest of the code keeps going.
		setTimeout(function()
		{
			$scope.$apply(function()
			{
				var answer = example_var1 + example_var2 + num;
				
				//Let's pretend it's an error if answer < 5, just to demonstrate reject vs. resolve
				if(answer < 5)
				{
					//Something went wrong, throw an error.
					ret.code = 1;				//In Mean Seed, we often use a code of 1 to indicate an error. A bit redundant in this case, but there it is.
					ret.msg = 'Error: answer is less than 5';
					ret.answer = answer;
					deferred.reject(ret);		//The argument here will be given to the failure function as input.
				}
				else
				{
					//Async stuff completed successfully!
					ret.code = 0;				//In Mean Seed, we use a code of 0 to indicate success.
					ret.msg = 'Success!';
					ret.answer = answer;
					deferred.resolve(ret);		//The argument here will be given to the success function as input.
				}
			});
		}, 500);
		
		example_var1++;		//This line will be executed long before the timeout finishes!
		
		return deferred.promise;				//Return the promise, so the code that called this function can specify success and failure functions for the promise.
	}
	
	//The last line in any promise-producing function should return the promise.
	//Logically, though, the promise-producing function ends with either a resolve or a reject.
	//Make sure every logic branch in a promise-producing function ends by resolving or rejecting!
	//Otherwise, neither the success or failure function may ever be executed. You might say the promise-producing function didn't keep its promise!
	
	//Sandbox start
	
	//Sandbox end
}]);