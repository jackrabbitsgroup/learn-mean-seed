/**
*/

'use strict';

angular.module('myApp').controller('JsIntroCtrl', ['$scope',
function($scope)
{
	//This is a "line comment". Everything after the // until the end of the line is completely ignored by the browser.
	
	/*
		This is a "block comment".
		Everything between the opening tag and the closing tag is completely ignored by the browser.
		Block comments can span multiple lines.
	*/
	
	/*
		When a piece of javascript code is run, each line is executed one at a time, in order.
		A 'line' of code actually ends with a semicolon, not with the end of the line in your text editor.
		Most lines of code only span a single line of text, though,
		and you should always start a new line of code on a new line of text.
		The web browser running the code doesn't care either way,
		but it's messy and hard to read for us humans if you put them on the same line.
		
		There are a few exceptions to the 'ends with a semicolon' rule.
		As a general rule of thumb, if the statement ends with a '}' (like at the end of an 'if' statement or a 'for' loop) you don't need a semicolon.
		Otherwise, you do.
		Storing a function in a variable is an exception to this rule of thumb.
	*/
	
	var click_counter = 0;			//A variable to remember how many times the button has been clicked.
	$scope.click_text = '0 times';	//An Angular $scope variable to hold the text we want to display.
	
	//This is the function that gets called whenever the button is clicked. It's stored as an Angular $scope variable.
	$scope.increment = function()
	{
		click_counter = click_counter + 1;	//Add one to our counter. 'click_counter++;' or 'click_counter += 1;' would also work here.
		
		//Update our text depending on the value of the counter
		if(click_counter === 1)
		{
			$scope.click_text = 'once';
		}
		else if(click_counter === 2)
		{
			$scope.click_text = 'twice';
		}
		else if(click_counter === 3)
		{
			$scope.click_text = 'thrice';
		}
		else
		{
			$scope.click_text = click_counter + ' times';
		}
	};
}]);