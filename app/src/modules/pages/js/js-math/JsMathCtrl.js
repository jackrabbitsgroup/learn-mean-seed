/**
*/

'use strict';

angular.module('myApp').controller('JsMathCtrl', ['$scope',
function($scope)
{
	var num1;
	var num2;
	var num3;
	
	//The basic operations are addition (+), subtraction (-), multiplication (*), and division (/). Modulus (%) is also provided for integers.
	//Standard order of operations applies (multiplcation before addition, etc.) and you can use parentheses to specify the order as well,
	//just as in normal mathematics
	
	num1 = 1 + 2 * 3;			// 7
	num2 = 10 / 4;				// 2.5
	num3 = (7 - 4) * (5 + 3);	// 24
	
	//Modulus gives the remainder after division
	num1 = 10 % 3;				// 1
	num2 = 11 % 3;				// 2
	
	//The Math object is provided by Javascript for more advanced operations.
	//It also holds useful mathematical constants like pi and e.
	
	num1 = Math.PI;				// 3.14 (approx.)
	num2 = Math.sqrt(25);		// 5
	num3 = Math.exp(4);			// e^4 (the exponential)
	
	num1 = Math.pow(2, 5);		// 32 (2 * 2 * 2 * 2 * 2)
	num2 = Math.random();		// A random number between 0 and 1
	num3 = Math.sin(3);			// Returns sin(3), where 3 is in radians (not degrees)
	
	num1 = Math.floor(4.7);		// 4 (rounds down to nearest integer)
	num2 = Math.ceil(4.3);		// 5 (rounds up to nearest integer)
	num3 = Math.round(4.5);		// 5 (rounds to nearest integer)
	
	num1 = Math.abs(-1);		// 1 (absolute value)
}]);