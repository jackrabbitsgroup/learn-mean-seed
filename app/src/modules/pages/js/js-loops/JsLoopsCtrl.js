/**
*/

'use strict';

angular.module('myApp').controller('JsLoopsCtrl', ['$scope',
function($scope)
{
	//Javascript supports several types of loops.
	//The 'for' loop is by far the most important for web developers, as it is well-suited for about 99% of your looping needs.
	
	//Here is an example.
	
	var ii;
	var my_array = [];
	
	for(ii = 0; ii < 5; ii++)
	{
		my_array.push(ii);
	}
	//When the loop is complete, my_array will be [0, 1, 2, 3, 4]
	
	//The loop works like this:
	// 1) ii = 0; (the code up to the first semicolon) is executed. This is this loop's initialization step; the code placed here is run exactly once, before the loop begins.
	// 2) ii < 5; (the code up to the second semicolon) is executed. If the result is false, the loop is over. If true, proceed to step 3.
	// 3) The code inside the { } (in this case, my_array.push(ii);) is executed.
	// 4) ii++; (the code after the second semicolon) is executed.
	// 5) Go to step 2.
	
	//A common use of 'for' loops is to iterate over every entry in an array, like this:
	
	for(ii = 0; ii < my_array.length; ii++)
	{
		if(ii !== 1)
		{
			my_array[ii] += 5;	//Add 5 to every entry (except the second) in the array
		}
	}
	//When the loop is complete, my_array will be [5, 1, 7, 8, 9]
	
	//There is a second type of 'for' loop, used with objects. The syntax is a bit simpler.
	var my_object = {'prop1': 1, 'prop2': 2, 'prop3': 40 };
	
	var xx;
	for(xx in my_object)
	{
		my_object[xx] += 2;
	}
	//When the loop is complete, my_object will be {'prop1': 3, 'prop2': 4; 'prop3': 42 }
	
	//This loop is run once for every property in my_object. The variable xx will hold the current property name ('prop1', 'prop2', or 'prop3', in this case.)
	//Looping over objects does not have a set order. 'prop2' may be the first, second, or third value set to xx here.
	
	//The other type of loop you should be aware of is the 'while' loop.
	//Every (non-object) 'for' loop can be written as a 'while' loop, and every 'while' loop can be written as a 'for' loop.
	
	//Here's the same 'for' loop as before, written as a while loop
	ii = 0;
	while(ii < my_array.length)
	{
		if(ii !== 1)
		{
			my_array[ii] += 5;
		}
		
		ii++;
	}
	//The loop is simple:
	// 1) Run the code in parentheses. If false, stop looping. If true, go to step 2.
	// 2) Run the code in { }.
	// 3) Go to step 1.
	
	//There is also a 'do-while' loop:
	ii = 0;
	do
	{
		if(ii !== 1)
		{
			my_array[ii] += 5;
		}
		
		ii++;
	} while(ii < my_array.length);
	
	//The only difference between 'do-while' and 'while' is that 'do-while' starts at the 'while' loop's step 2,
	//meaning that the code in { } will always be run at least once.
	
	
	//Beware of infinite loops! Always make sure that your loop gets closer to finishing with each step.
	//If you forget to increment ii, for example, or if you make a mistake with the stop condition,
	//your loop will never complete, and your web page will never finish loading!
}]);