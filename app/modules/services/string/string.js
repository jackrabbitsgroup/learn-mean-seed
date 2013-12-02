/**
@module StringMod

@toc
1. random
2. trim
*/

'use strict';

var lodash = require('lodash');
var self;

function StringMod(options) {
	self =this;
}

/**
Generates a random string
@toc 1.
@method random
@param {String} len Length of string to create
@param {Object} pp
	@param {String} type One of: 'readable' if want only readable chars (i.e. no uppercase "I" and lowercase "l" and number "1", which can look the same); otherwise it uses the full range of characters
*/
StringMod.prototype.random =function(len, pp) {
	var defaults ={'type':'full'};
	lodash.extend(pp, defaults);
	var chars;
	if(pp.type =='full') {
		chars ="abcdefghijkmnopqrstuvwxyz023456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}
	else if(pp.type =='readable') {
		chars ="abcdefghijkmnopqrstuvwxyz023456789";
	}
	var randString ='';
	for(var ii=0; ii<len; ii++) {
		randString+=chars.charAt(Math.floor(Math.random()*chars.length));
	}
	return randString;
};

/**
@toc 2.
@method trim
@param {String} string1 The string to trim
@param {Object} params
*/
StringMod.prototype.trim =function(string1, params) {
	return string1.replace(/^\s+|\s+$/g, "");
};


module.exports = new StringMod({});