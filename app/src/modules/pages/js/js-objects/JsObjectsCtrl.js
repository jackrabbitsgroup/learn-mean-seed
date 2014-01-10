/**
*/

'use strict';

angular.module('myApp').controller('JsObjectsCtrl', ['$scope',
function($scope)
{
	//Objects are created with curly brackets.
	var empty_object = {};	//The empty object is an object with no properties
	
	var obj1 =
	{
		"property1": 0,
		"property2": 'value2',		//Note the comma between each value and the next property name - that's important!
		property3: true				//The quotes may be omitted when creating an an object property, but it's usually good practice to include them.
	};
	
	var obj2 = {'prop1': 1, 'sdasd': 2};	//You don't have to skip lines between properties; that's just for readability.
	
	//Property names can be any alphanumeric string. That means letters and numbers, but nothing else.
	
	//Object properties can be accessed using dot notation. They can be read or changed just like variables.
	// obj1.property1 === 0;
	obj1.property1 = 5;
	// obj1.property1 === 5;
	
	//You can define new properties in the same way. Unsurprisingly, undefined properties have the value undefined:
	//obj2.foo === undefined;
	obj2.foo = 'bar';
	//obj2.foo == 'bar';
	
	//You can remove properties with delete:
	//obj2.sdasd === 2;
	delete obj2.sdasd;
	//obj2.sdasd === undefined;
	
	//If you have the property name stored in a variable, or are creating it on the fly, you can use bracket notation:
	var my_prop = 'prop1';
	obj2[my_prop] = 2;
	
	my_prop = 'property';
	//obj1[my_prop + '1'] === 5;
	//obj1[my_prop + '2'] == 'value2';
	obj1[my_prop + '1'] = 3;
	
	//Objects can be nested.
	obj1.nested_obj = 
	{
		'property1': 1,
		'bar': 'foo'
	};
	
	//Nested object properties are accessed just like regular objects.
	//obj1.nested_obj.property1 === 1;
	obj1.nested_obj.property1 = 5;
	//obj1.nested_obj[my_prop + '1'] === 5;
	
	//There is no limit to the number of times you can nest objects; you can have objects inside of objects inside of objects, as many times as you like.
}]);