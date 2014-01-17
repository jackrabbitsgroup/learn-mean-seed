/**
*/

'use strict';

angular.module('myApp').controller('AngScopeCtrl', ['$scope',
function($scope)
{
	$scope.text = "This text is written in this page's Ctrl file. It is stored in a $scope variable; the HTML references this variable, displaying its value.";
	
	$scope.click_count = 0;
	
	//You can still make normal Javascript variables, but you cannot access these from the HTML. That only works with $scope variables.
	//That said, don't make a variable a $scope variable if you don't think you'll need to access it from HTML!
	var class1 = 'blue-bg';
	var text1 = 'bright red';
	
	var class2 = 'red-bg';
	var text2 = 'pale green';
	
	var class3 = 'green-bg';
	var text3 = 'light blue';
	
	$scope.example1 = {};		//$scope variables can be anything that normal variables can be - objects, arrays, numbers, functions, etc.
	$scope.example1.class_name = class1;
	$scope.example1.text = text1;
	
	//This $scope variable holds a function; we can access this value from the html like any other $scope variable, and use it to execute the function.
	//This function changes the value of the $scope variables example1.class_name and example1.text, which causes the div's class and text to change accordingly.
	//Note how this is really, really easy! All you have to do is update your variable in javascript, and the html takes care of itself!
	//Without Angular, this task would be much more difficult and annoying.
	$scope.toggleExample1 = function()
	{
		if($scope.example1.class_name == class1)
		{
			$scope.example1.class_name = class2;
			$scope.example1.text = text2;
		}
		else if($scope.example1.class_name == class2)
		{
			$scope.example1.class_name = class3;
			$scope.example1.text = text3;
		}
		else if($scope.example1.class_name == class3)
		{
			$scope.example1.class_name = class1;
			$scope.example1.text = text1;
		}
	};
	
	//Sandbox Start
	
	$scope.sandboxFunction = function()
	{
	
	};
	
	//Sandbox End
}]);