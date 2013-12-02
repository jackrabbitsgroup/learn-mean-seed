/**
@fileOverview
Some additional functions to add to moment.js datetime functions

@module datetime
@class datetime

@dependencies
moment.js - http://momentjs.com/

@toc
//public
1. timestamp
//private
*/

'use strict';

var moment = require('moment');

var self;

/**
@param {Object} opts
*/
function Datetime(opts) {
	self =this;
}

/**
Returns the current datetime (formatted in YYYY-MM-DD HH:mm:ssZ). This ensures consistent timestamp formats (i.e. for saving in the database)
@toc 1.
@method timestamp
@param {Object} [params]
*/
Datetime.prototype.timestamp =function(params) {
	var timestamp =moment(new Date()).format('YYYY-MM-DD HH:mm:ssZ');
	return timestamp;
};

module.exports = new Datetime({});