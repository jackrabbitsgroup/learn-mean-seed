/**
@fileOverview
Sends SMS / text messages
Uses the appropriately installed text/SMS method (i.e. Twilio 3rd party service) to send a text. This is just an abstraction function to pass through the appropriate text to the actual/appropriate module that will actually send the text. This allows keeping the text interface always the same to send an text and this then allows attaching various different text sending methods.

@module texter
@class texter

@toc
*/

'use strict';

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

// include your texting service here
// var TextTwilio =require(pathParts.services+'text/twilio/textTwilio.js');

var self;

/**
@param {Object} opts
*/
function Texter(opts) {
	self =this;
}

/**
@toc 1.
@method send
@param {Object} opts
	@param {Object} textParams
		@param {String} to
		@param {String} text
@return NONE
*/
Texter.prototype.send =function(opts) {
	//call your texting service here
	// TextTwilio.send(opts);
};

module.exports = new Texter({});