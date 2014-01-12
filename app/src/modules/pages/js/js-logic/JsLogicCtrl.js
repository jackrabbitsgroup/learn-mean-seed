/**
*/

'use strict';

angular.module('myApp').controller('JsLogicCtrl', ['$scope',
function($scope)
{
	var num1 = 5;
	var num2 = 12;
	var str1 = 'foo';
	var str2 = 'bar';
	var bool1 = true;
	var bool2 = false;
	
	//'If' statements are used to excecute some block of code only if some conditions are met.
	//They take an expression in parentheses, and evaluate if.
	//If the expression is true, the following lines of code (wrapped in curly brackets) are run.
	//Otherwise, those lines are skipped.
	if(str1 == 'foo')	//True
	{
		num1 = 6;
		num2 = 11;
	}
	
	if(str1 == 'hello')	//False
	{
		num2 = 10;		//This line does not get executed
	}
	//num1 === 6, num2 === 11
	
	//You can chain if statements together using 'else':
	if(num1 === 5)		//False
	{
		num2 = 10;
	}
	else if(num1 === 4)	//False
	{
		num2 = 17;
	}
	else if(num1 === 6)	//True
	{
		//You can put as many 'else if's as you like.
		//They will be checked in order until one is found to be true. The rest will be skipped over.
		num2 = 18;
	}
	else
	{
		//You can end with simply 'else', which will be run only if all of the preceding 'if's were false.
		num2 = 19;
	}
	
	//'If' statements operate on booleans - values that are either true or false.
	//Thus, they go hand-in-hand with the logical operators 'and', 'or', and 'not',
	//which operate on booleans to produce a boolean.
	
	//The Javascript symbol for 'and' is &&. It takes two booleans and produces true only if both are true.
	
	if(num1 === 6 && bool2 === false)	//Both true, so the statement is true
	{
		num2 = 20;	//Run
	}
	if(num1 === 6 && bool2 === true)	//The second is false, so the whole statement is false.
	{
		num2 = 21;	//Skipped
	}
	
	//The Javascript symbol for 'or' is ||. It takes two booleans and produces false only if both are false.
	//Said differently, an 'or' is true if at least one of the booleans is true.
	if(bool2 || bool1)	//The second is true, so the whole statement is true
	{
		num2 = 22;	//Run
	}
	if(bool2 || num1 === 7)	//All are false, so the statement is false
	{
		num2 = 23; //Skipped
	}
	
	//Multiple 'or's can be chained together. So can multiple 'and's.
	if(bool2 || num1 === 7 || num1 === 8 || num1 === 6)	//The last is true, so the whole thing is true
	{
		num2 = 24;	//Run
	}
	if(bool1 && bool2 && num1 === 6 && true) //The second is false, so the whole thing is false
	{
		num2 = 25;	//Skipped
	}
	
	//When using 'or's and 'and's together, you need to use parentheses to make it clear what you mean:
	if(false && (true || true))	//False
	{
		num2 = 26;	//Skipped
	}
	if((false && true) || true)	//True
	{
		num2 = 27;	//Run
	}
	
	//The Javascript symbol for 'not' is !. It takes a boolean and produces the opposite.
	if(!false)
	{
		num2 = 28;	//Run
	}
	if(!(true && !false))
	{
		num2 = 29;	//Skipped
	}
	//You can also use '!=' and '!==' when comparing values; these operators are really just shorthand for !(x == y) and !(x === y)
	if(num1 !== 1000)
	{
		num2 = 30;	//Run
	}
	
	
	//In Javascript, every value is either true or false, even if it is not a boolean.
	//Such values are called 'truthy' or 'falsy', because they aren't actually booleans, but can still but used like them.
	//Generally speaking, it is usually a good idea to avoid using non-boolean values this way whenever possible,
	//since 'truthy' and 'falsy' values can become confusing. It's better to be explicit about what you're checking.
	//You should be aware, however, that the number 0 is falsy, and other numbers are truthy.
	//The empty string is falsy; other strings are truthy.
	//The Javascript special values 'undefined' and 'null' are falsy.
	
	if(0 || undefined || null || '')
	{
		num2 = 31;	//Skipped
	}
	
	if(1 && -1 && 'foo')
	{
		num2 = 32;	//Run
	}
}]);