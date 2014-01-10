/**
*/

'use strict';

angular.module('myApp').controller('JsFunctionsCtrl', ['$scope',
function($scope)
{
	var num1 = 0;
	var num2 = 0;
	var answer;
	
	//Functions are created with the 'function' keyword. Here is a simple named function.
	
	function exampleFunction()
	{
		num1 = 1;	//Because num1 is declared as a variable outside of the function, it can be accessed and altered inside the function.
		
		var num3;	//This is a local variable; it does not exist outside this function.
		
		num3 = num1 + num2;
		
		return num3;
	}
	
	//Creating the function does not execute the code inside the function; you must call the function first. num1 === 0 at this point.

	answer = 2 + exampleFunction();		//Call exampleFunction. The function's code will be run, and its return value will be added to 2 and stored in 'answer'.
	
	//Now num1 === 1, num2 === 0, answer === 3. Out here, num3 is undefined. func1 is also undefined at this point.
	
	//Functions need not be named. Here we create an unnamed function, then store it in the variable func1.
	var func1 = function()
	{
		num1++;
		num2++;
	};		//Ends with a semicolon, since this is an assignment to a variable
	func1();
	
	//The big difference here is that exampleFunction is always a function; you can't change it.
	//Also, exampleFunction could be called from line 28 even if the function declaration was moved to the bottom of the file.
	//func1, on the other hand, is a variable. You can overwrite its value at any time, and it is undefined prior to its assignment.
	
	//Now let's try some inputs:
	function func2(xx, yy)
	{
		return ((xx * 2) + yy);
	}
	answer = func2(4, 3);
	//answer === 11
	
	//Remember, functions are data! Remember f(x) = mx + b from high school algebra?
	//Here's a function that takes m and b as inputs, and returns f(x):
	function createLine(slope, intercept)
	{
		var f_x = function(xx)
		{
			return ((slope * xx) + intercept);
		};
		return f_x;
	}
	
	var line1 = createLine(2, 6);
	var line2 = createLine(1, 0);
	
	num1 = line1(4);	//num1 === 14
	num2 = line2(3);	//num2 === 3
	
	//Functions can be inputs, too. This function takes a line (a function!) like the ones we just made and returns their value at x = 5
	function evalAt5(f_x)
	{
		return f_x(5);
	}
	answer = evalAt5(line1);
	//answer === 16
	
	//Now for a lesson in variable scope.
	function scopeConfusion(num1, line1)
	{
		var answer;
		//This is a local variable. Declaring it here creates a new 'answer' variable, different from the one outside.
		//I no longer have access to the 'answer' variable outside. I cannot read it or change it from here.
		//The same is true for the inputs. In this function, num1 and line1 refer to my inputs, whatever they may be.
		//I no longer have access to the num1 and line1 variables outside.
		
		answer = line1(num1);
		return answer + line2(num2);	//I still have access to line2 and num2 from outside, though, because I haven't overwritten them.
	}
	
	//answer === 16, num1 === 14, num2 === 3
	answer = scopeConfusion(answer, line2);
	//answer === 19, num1 === 14, num2 === 3
	
	
	//Challenges:
		//1. Write a createParabola function that takes three inputs, a, b, and c, and returns the function f(x) = ax^2 + bx + c
		
	//Sandbox
	
	
	
	//End Sandbox
	
	console.log("Answer: " + answer);	//Example console.log syntax. You can use this to output data to the console, to check your work.
	//If you don't know what the console is, check the "/web-debugger" lesson.

}]);