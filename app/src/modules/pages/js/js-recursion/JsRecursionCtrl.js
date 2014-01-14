/**
*/

'use strict';

angular.module('myApp').controller('JsRecursionCtrl', ['$scope',
function($scope)
{
	//A recursive function has two basic parts: the base case and the reduction step.
	
	//The base case is crucial. It typically handles the simplest case, which all recursive calls should eventually boil down to;
	//without the base case, a recursive function would never stop calling itself.
	
	//The reduction step is where the function calls itself, with adjusted input.
	//Each reduction step should bring you one step closer to the base case; if it doesn't, the algorithm might never complete.
	
	//Here are some examples:
	
	//Takes a nonnegative integer. Computes 1 + 2 + 3 + ... + nn
	function sumToN(nn)
	{
		if(nn <= 0)		//Base case. If nn is 0, we're done. The '<' part protects us from going forever in case we accidentally get a negative number somehow.
		{
			return 0;
		}
		else
		{
			return (nn + sumToN(nn-1));	//Reduction step
		}
	}
	
	//Takes a string. Returns true if it's a palindrome, false otherwise.
	function isPalindrome(str)
	{
		if(str.length <= 1)		//Base case - length 1 or 0 strings are palindromes. 
		{
			return true;
		}
		else if(str.charAt(0) == str.charAt(str.length - 1))	//Check if the first and last characters are the same
		{
			//Reduction step
			var shorter_str = str.slice(1, str.length - 1);	//Chop off the first and last characters
			return isPalindrome(shorter_str);
		}
		else		//First character doesn't match the last character. Can't be a palindrome.
		{
			return false;
		}
	}
	
	//Sometimes, helper functions are useful. In these cases, the 'recursive' function doesn't actually call itself;
	//instead, it creates a recursive helper function and calls that.
	//Helpers are useful if you want to make a variable outside of the recursive function, or if you need to pass in different inputs to the recursive function.
	
	//Here's an exponent function that uses a helper. You could easily make an exponent function without a helper, of course, but not all problems are this simple.
	function exponent(base, power)
	{
		var example_variable;	//I don't actually need a variable like this for this function, but if I did, this variable would be available in each recursive step
		
		var helper = function(pow, result_so_far)
		{
			if(pow <= 0)
			{
				return result_so_far;
			}
			else
			{
				return helper((pow - 1), (result_so_far * base));
			}
		};
		
		return helper(power, 1);
	}
	
	//Now for something a bit more complex.
	//Here's an example from math. The Bisection Method is an algorithm for finding the zero of a continuous function f(x).
	//If we know that f(x) crosses the x-axis exactly once between two points, x = a and x = b, then the bisection method will find the point where it crosses.
	function bisection(ff, aa, bb)
	{
		var epsilon = 0.00001;		//Threshold - determines how close is close enough.
		var f_a = ff(aa);			//value of the function at aa
		var f_b = ff(bb);			//value of the function at bb
		
		if(Math.abs(f_a) < epsilon)			//Base case, part 1: If aa is our zero, we're done.
		{
			return aa;
		}
		else if(Math.abs(f_b) < epsilon)	//Base case, part 2: If bb is our zero, we're done.
		{
			return bb;
		}
		else if((f_a > 0 && f_b > 0) || (f_a < 0 && f_b < 0))
		{
			//Base case part 3 - error checking. If both are positive or both negative, somebody's using this function when they shouldn't be.
			return "ERROR!";
		}
		else						//Reduction step
		{
			var midpoint = (aa + bb) / 2;
			var f_mid = ff(midpoint);
			
			if((f_mid > 0 && f_a < 0) || (f_mid < 0 && f_a > 0))
			{
				//If ff changes sign between aa and the midpoint, our zero is in there somewhere.
				return bisection(ff, aa, midpoint);
			}
			else
			{
				//ff changes sign between bb and the midpoint
				return bisection(ff, midpoint, bb);
			}
		}
	}
	
	//For testing the bisection function. Go ahead, try it out!
	function createParabola(aa, bb, cc)
	{
		return function(xx)
		{
			return (aa * xx * xx) + (bb * xx) + cc;
		};
	}
	var my_parabola = createParabola(2, 0, -10);	//2x^2 - 10. Zeroes should be at approx. +2.236, -2.236.
	var zero = bisection(my_parabola, 0, 20);
	console.log("Bisection zero: " + zero);
	
	//Challenges
	
	//1. Fill in the fibonacci function below to compute the nth Fibonacci number (the Fibonacci numbers are 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...)
	//	Don't worry about efficiency, just make it work.
	
	//2. Rewrite your fibonacci function, smarter, in the efficient_fibonacci function below.
	//	Don't let your algorithm compute the same fibonacci number more than once. Tip: use a helper function.
	
	//3. Fill in the gcd function to compute the greatest common divisor of two positive integers.
	//	Use this fact: If p > q, the gcd of p and q is the same as the gcd of q and (p % q)
	
	//Sandbox start
	
	function fibonacci(nn)
	{
		return 0;
	}
	
	function efficient_fibonacci(nn)
	{
		return 0;
	}
	
	function gcd(pp, qq)
	{
		return 0;
	}
	
	console.log('Fibonacci(10): ' + fibonacci(10));							//55
	console.log('Efficient Fibonacci(10): ' + efficient_fibonacci(10));		//55
	console.log('gcd(8, 12): ' + gcd(8, 12));			//4
	console.log('gcd(4536, 256): ' + gcd(4536, 256));	//8
	console.log('gcd(256, 4536): ' + gcd(256, 4536));	//8
	
	//When you're ready, un-comment the lines below, one at a time, and compare the page's load time.
	//Computing fibonacci(40) or higher will probably cause your browser to crash.
	
	//console.log('Fibonacci(30): ' + fibonacci(30));							//Slows down load time noticeably
	//console.log('Efficient Fibonacci(1000): ' + efficient_fibonacci(1000));	//Lightning-fast
	
	//Sandbox end
}]);