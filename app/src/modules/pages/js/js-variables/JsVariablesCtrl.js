/**
*/

'use strict';

angular.module('myApp').controller('JsVariablesCtrl', ['$scope',
function($scope)
{
	//Declare some variables
	var x;	//A variable can be just one letter, but we avoid this in Mean Seed because it's harder to search for with ctrl+F
	var X;	//X is not the same as x. Case matters!
	var xx;
	var yy;
	var answer;
	
	//Declare several variables at once
	var my_var1, my_var2, my_var3, my_var4;
	
	//Declare a variable and initialize it at the same time
	var zz = 0;
	
	//Assign some values to variables
	xx = 1;
	yy = 5;
	my_var1 = 'this is a string';
	my_var2 = [];	//An empty array
	my_var3 = {};	//An empty object
	my_var4 = true;	//A boolean
	
	//Do some math
	
	/*
	xx + yy;		//This line would be perfectly valid, but would do nothing. We would get a value of 6, but it is not assigned to anything and nothing is done with it, and no variables are changed.
	*/
	
	zz = xx + yy;	//Set zz equal to 6
	zz = zz + xx;	//Set zz equal to 7. A variable can be part of its own assignment. Its value won't be changed until after the expression is evaluated, using the old value.
	
	answer = zz * (xx + yy);	//Set answer to 42
	
	//Re-assign xx to a string
	xx = 'some string';	//Now xx is a string, not a number. This is valid in javascript, but not necessarily good coding practice.
	
	//Generally speaking, you should treat each of your variables as if it can only hold one type of data, to make it easier for yourself and others to keep track of.
	//In other words, don't put a string in a variable that was holding a number unless you have a good reason.
	
	//Un-set my_var2 and my_var3
	my_var2 = undefined;	//Undefined is a special value in javascript. It's like a variable whose value cannot be changed.
	my_var3 = null;			//Null is another special value, very similar to undefined
	
	//== is for comparison, not assignment. It returns true if the two things are the same.
	//=== is a stronger comparison. Use it when comparing to undefined, booleans, or numbers (but not for comparing two variables)
	
	//Now our variables are as follows (all of these lines would evaluate to true)
	/*
	x === undefined;
	X === undefined;
	X == x;
	xx == 'some string';
	yy === 5;
	zz === 7;
	answer === 42;
	my_var1 == 'this is a string';
	my_var2 === undefined;
	my_var3 === null;
	my_var4 === true;
	*/
}]);