/**
@fileOverview
Sends emails
Uses the appropriately installed email method (i.e. Nodemailer (default) or Mandrill 3rd party service) to send an email. This is just an abstraction function to pass through the appropriate info to the actual/appropriate module that will actually send the email. This allows keeping the email interface always the same to send an email and this then allows attaching various different email sending methods.

@module emailer
@class emailer

@toc
*/

'use strict';

var Q = require('q');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

//include the appropriate email service here
// var EmailTemplates =require(pathParts.services+'email/emailTemplates/index.js');
var EmailMandrill =require(pathParts.services+'email/mandrill/emailMandrill.js');

var self;

/**
@param {Object} opts
*/
function Emailer(opts) {
	self =this;
}

/**
Uses the appropriately installed email method (i.e. email-templates, Mandrill 3rd party service) to send an email. This is just an abstraction function to pass through the appropriate email to the actual/appropriate module that will actually send the email. This allows keeping the email interface always the same to send an email and this then allows attaching various different email sending methods.
@toc 1.
@method send
@param {Object} opts
	@param {Object} emailParams
		@param {String} to
		@param {String} subject
	@param {String} [template]
	@param {Object} [templateParams]
@param {Function} callback
@return {Object} (via promise)
*/
Emailer.prototype.send =function(opts) {
	var deferred = Q.defer();
	var ret ={code:0, msg:'Emailer.send '};
	
	//call the email service function here
	EmailMandrill.send(opts)
	.then(function(ret1) {
		deferred.resolve(ret1);		//just pass return through
	}, function(retErr) {
		deferred.reject(retErr);		//just pass return through
	});
	// EmailTemplates.sendTemplate(opts.template, opts.emailParams, opts.templateParams, function(err, response) {
		// var dummy =1;
	// });
	
	return deferred.promise;
};

module.exports = new Emailer({});