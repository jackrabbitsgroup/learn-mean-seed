/**
*/

'use strict';

angular.module('myApp').controller('JsOperatorsCtrl', ['$scope',
function($scope)
{
	//Arithmetic operators include +, -, *, /, %; you can find more about these in the Math lesson, but they're pretty self-explanatory.
	
	//Javascript also supports increment and decrement operators, ++ and --, for numbers, as well as shorthand arithmetic operators +=, -=, *=, /=, %=
	var xx = 5;
	var yy = 3;
	
	xx++;		//Equivalent to xx = xx + 1;
	yy--;		//Equivalent to yy = yy - 1;
	
	xx += 5;	//Equivalent to xx = xx + 5;
	xx -= 2;	//Equivalent to xx = xx - 2;
	yy *= 6;	//Equivalent to yy = yy * 6;
	yy /= 3;	//Equivalent to yy = yy / 3;
	xx %= 2;	//Equivalent to xx = xx % 2;
	
	//The + operator can additionally be used on strings, where it works as concatenation:
	
	var str1 = 'foo' + 'bar';	//str1 == 'foobar';
	var str2 = 'Hello ' + str1;	//str2 == 'Hello foobar'
	
	//If you add a string and a number, you'll get a string
	var str3 = str1 + 1234;		//str3 == 'foobar1234';
	
	//The logical operators && (and), || (or), and ! (not) are covered in the Logic lesson.

	//You've already seen most of the comparison operators: ==, ===, !=, !==, >, <, >=, <=
	//All of these operators compare two entities and produce true or false.
	
	//== and === check if two things are the same. === is stronger; it checks value as well as type, and should be used when comparing directly to numbers, booleans, and undefined
	
	xx = 5;
	//xx == '5';	//true
	//xx === '5';	//false
	//xx === 5;		//true
	
	// != and !== are simply the negation of == and ===
	//xx != '5';	//false
	//xx !== '5';	//true
	//xx !== 5;		//false
	
	//<, <=, >, >= are less than, less than or equal to, greater than, and greater than or equal to.
	//They work exactly as you expect with numbers.
	//xx < 5;		//false
	//xx <= 5;		//true
	//xx > 2;		//true
	//xx >= 6;		//false
	
	//These operators can also be used on strings. They compare alphabetically in this case, with 'a' < 'b' < 'c', etc.
	
	//'foo' < 'b';	//false
	//'xyz' > 'ab';	//true
}]);