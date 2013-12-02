/**
@fileOverview
Some additional array/object functions that lodash doesn't seem to have..

@module array
@class array

@toc
//public
0. remove
1. findArrayIndex
2. sort2D
3. isArray
4. copy
//private
2.5. subSort2D
*/

'use strict';

var self;

/**
@param {Object} opts
*/
function Array1(opts) {
	self =this;
}

/**
Removes one or more items from an array
// Array Remove - By John Resig (MIT Licensed)
// Remove the second item from the array
ArrayMod.remove(arr1, 1);
// Remove the second-to-last item from the array
ArrayMod.remove(arr1, -2);
// Remove the second and third items from the array
ArrayMod.remove(arr1, 1,2);
// Remove the last and second-to-last items from the array
ArrayMod.remove(arr1, -2,-1);
@toc 0.
@method remove
@param {Array} arr1 The array to remove from
@param {Number} from The index to remove (or remove starting from if removing more than one)
@param {Number} [to] The index to remove up to
@param {Object} [params]
@return {Array} arr1 The new array with the appropriate element(s) removed
*/
Array1.prototype.remove =function(arr1, from, to, params) {
	// console.log('array remove: before: '+JSON.stringify(arr1));
	var rest = arr1.slice((to || from) + 1 || arr1.length);
	arr1.length = from < 0 ? arr1.length + from : from;
	// arr1 =arr1.push.apply(this, rest);
	// arr1.push(rest);
	arr1 =arr1.concat(rest);
	// console.log('array remove: after: '+JSON.stringify(arr1));
	return arr1;
};

/**
Returns the index of an 2D []{} associative array when given the key & value to search for within the array
@toc 1.
@method findArrayIndex
@param {Array} array 2D array []{} to search
@param {String} key Object key to check value against
@param {Mixed} val To match key value against
@param {Object} [params]
	@param {Boolean} oneD True if it's a 1D array
*/
Array1.prototype.findArrayIndex =function(array, key, val, params) {
	var ii;
	//var index =false;		//index can be 0, which evaluates to false
	var index =-1;
	if(params.oneD)
	{
		for(ii=0; ii<array.length; ii++)
		{
			if(array[ii] ==val)
			{
				index =ii;
				break;
			}
		}
	}
	else
	{
		for(ii=0; ii<array.length; ii++)
		{
			if(array[ii][key] ==val)
			{
				index =ii;
				break;
			}
		}
	}
	return index;
};

/**
takes a multidimensional array & array index to sort by and returns the multidimensional array, now sorted by that array index
@toc 2.
@method sort2D
@param {Array} arrayUnsorted 2D array []{} of objects to sort
@param {Number} column Array index to sort by (note first one is 0)
@param {Object} [params]
	@param {String} [order] 'Desc' for reverse order sort
@return {Array} sortedArray input array of objects []{} but now sorted
*/
Array1.prototype.sort2D =function(arrayUnsorted, column, params) {
	var tempArray =[];	//copy calHide array here to sort; then re-copy back into calHide array once sorted
	var array2D =[];
	var ii;
	for(ii =0; ii<arrayUnsorted.length; ii++)
	{
		tempArray[ii] =[];
		tempArray[ii] =arrayUnsorted[ii];
		array2D[ii] =[ii, tempArray[ii][column]];
	}

	array2D =subSort2D(array2D);		//function		- array2D will come out sorted

	var sortedArray =[];
	var counter =0;
	if(params.order !==undefined && params.order =='desc')
	{
		for(ii=(array2D.length-1); ii>=0; ii--)
		{
			sortedArray[counter] =tempArray[array2D[ii][0]];
			counter++;
		}
	}
	else
	{
		for(ii =0; ii<array2D.length; ii++)
		{
			sortedArray[counter] =tempArray[array2D[ii][0]];
			counter++;
		}
	}
	
	return sortedArray;
};

/**
distinguishes between an object/hash (i.e. {'key':'val'}) and (scalar) array (i.e. [1, 2, 3])
@toc 3.
@method isArray
*/
Array1.prototype.isArray =function(array1, params) {
	/*	Cannot detect that a scalar array with an undefined first entry is an array
		if(typeof(array1) !='string' && (array1.length !=undefined && (typeof(array1) !='object' || array1[0] !=undefined || array1.length ===0)))	{		//have to ALSO check not object since it could be an object with a "length" key!... update - typeof is object sometimes for arrays??! so now checking array1[0] too/alternatively..
			return true;
		}
	*/
	if(Object.prototype.toString.apply(array1) === "[object Array]") {
		return true;
	}
	else {
		return false;
	}
};

/**
NOTE: lodash has 'clone' and 'cloneDeep' functions but they only work on objects? or do they work on arrays too? If they work on both, should just use that instead.

By default, arrays/objects are assigned by REFERENCE rather than by value (so var newArray =oldArray means that if you update newArray later, it will update oldArray as well, which can lead to some big problems later). So this function makes a copy by VALUE of an array without these backwards overwriting issues
This is a recursive function so can hog memory/performance easily so set "skip keys" when possible

@todo - copying issue where scalar array is being converted to object..?

@toc 4.
@method copy
@param {Array|Object} array1 Array/object to copy
@param {Object} [params]
	@param {Array} [skipKeys] Array of keys to NOT copy (currently only for associative array - wouldn't make a ton of sense otherwise?)
@return {Array|Object} newArray Array/object that has been copied by value
*/
Array1.prototype.copy =function(array1, params) {
	var newArray, aa;
	if(!array1) {		//to avoid errors if null
		return array1;
	}
	if(!params)
		params ={};
	if(!params.skipKeys || params.skipKeys ===undefined)
		params.skipKeys =[];
	if(typeof(array1) !="object")		//in case it's not an array, just return itself (the value)
		return array1;
	if(this.isArray(array1))
	{
		newArray =[];
		for(aa=0; aa<array1.length; aa++)
		{
			if(array1[aa] && (typeof(array1[aa]) =="object"))
				newArray[aa] =this.copy(array1[aa], params);		//recursive call
			else
				newArray[aa] =array1[aa];
		}
	}
	else		//associative array)
	{
		newArray ={};
		for(aa in array1)
		{
			var goTrig =true;
			for(var ss =0; ss<params.skipKeys.length; ss++)
			{
				if(params.skipKeys[ss] ==aa)
				{
					goTrig =false;
					break;
				}
			}
			if(goTrig)
			{
				if(array1[aa] && (typeof(array1[aa]) =="object"))
					newArray[aa] =this.copy(array1[aa], params);		//recursive call
				else
					newArray[aa] =array1[aa];
			}
		}
	}
	return newArray;
};

/**
@toc 2.5.
array has 2 elements: 1st is an identifier (for use to match later), 2nd gets sorted & keeps it's identifier with it
@return array1
*/
function subSort2D(array1)
{
	var left;
	var right;
	var beg =[];
	var end =[];
	var pivot =[];
	pivot[0] =[];
	pivot[0][0] =[];
	pivot[0][1] =[];
	pivot[1] =[];
	pivot[1][0] =[];
	pivot[1][1] =[];
	var count =0;

	beg[0] =0;
	//end[0] =rosterLength-1;
	//end[0] =array1.length-1;
	end[0] =array1.length;		//CHANGE - not sure why... (array1 doesn't have a blank last index so don't have to subtract 1 anymore...)
	while(count>=0)
	{
		left =beg[count];
		right =end[count]-1;
		if(left <right)
		{
			pivot[0][1] =array1[left][1];
			pivot[0][0] =array1[left][0];
			while(left <right)
			{
				while((array1[right][1] >= pivot[0][1]) && (left <right))
				{
					right--;
				}
				if(left <right)
				{
					array1[left][0] =array1[right][0];
					array1[left][1] =array1[right][1];
					left++;
				}
				while((array1[left][1] <= pivot[0][1]) && (left <right))
				{
					left++;
				}
				if(left <right)
				{
					array1[right][0] =array1[left][0];
					array1[right][1] =array1[left][1];
					right--;
				}
			}
			array1[left][0] =pivot[0][0];
			array1[left][1] =pivot[0][1];
			beg[count+1] =left+1;
			end[count+1] =end[count];
			end[count] =left;
			count++;
		}
		else
		{
			count--;
		}
	}

	//var yes =1;		//dummy
	return array1;
}

module.exports = new Array1({});