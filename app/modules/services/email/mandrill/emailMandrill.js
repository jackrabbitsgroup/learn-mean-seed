/**
NOTE: this currently relies on global.cfgJson to exist and be set correctly
Uses config.json email properties (config.email) for configuration
@example config.email
{
    "from": "test@gmail.com",
	"from_name": "Admin",
    "mandrillApiKey": "lk2jlkfjasfd"
}

@fileOverview

@module emailMandrill
@class emailMandrill

@toc
1. send
//private functions
2. setTemplateVars
3. formSignature
4. formTemplateHtml

@dependency
- global.cfgJson variable that has the config, which has an "email" key that's an object with the email configuration
*/

'use strict';

var Q = require('q');

var cfg =global.cfgJson;

var apiKey =cfg.email.mandrillApiKey;
//UPDATE: mandrill official api wasn't working - kept erroring.. so now using node-mandrill instead..
// var Mandrill = require('mandrill').Mandrill(apiKey);		//NOTE: heroku Mandrill documentation is WRONG - it's supposed to be 'mandrill-api', NOT 'mandrill'
// var Mandrill = require('mandrill-api').Mandrill(apiKey);
// var Mandrill = require('mandrill-api');
var mandrill = require('node-mandrill')(apiKey);

var self;
var templateGlobalVars ={};		//will be set in setTemplateVars function

/**
@param {Object} opts
*/
function EmailMandrill(opts) {
	self =this;
	setTemplateVars({});		//init
}

/**
@toc 1.
@method send
@param {Object} opts
	@param {Object} emailParams
		@param {Array} to Array of email objects
			@param {String} email Email address of this person
			@param {String} [name] The name of this person
		@param {String} subject
		@param {String} [from =cfg.email.from]
		@param {String} [from_name =cfg.email.from_name]
		@param {String} [html] The html body (will default to trying to read from a template specified by the template parameter)
	@param {String} [template]
	@param {Object} [templateParams]
@param {Function} callback
@return {Object} (via promise)
	@param {String} msg
	@param {Number} code 0 on success, non-zero error code otherwise
	@param {Boolean|Array} badEmails Array of emails - a shorthand version of badEmailsInfo that just has the 'email' key
	@param {Boolean|Array} badEmailsInfo Boolean false unless there ARE bad emails, in which case this is an array of objects (straight from mandrill return):
		@param {String} email
		@param {String} status
		@param {String} reject_reason
*/
EmailMandrill.prototype.send =function(opts) {
	var deferred = Q.defer();
	var ret ={msg:'EmailMandrill.send: ', code:0, badEmails:false, badEmailsInfo:false};
	
	var ii;
	
	var html;
	// html ="You got an email!";
	if(opts.emailParams.html !==undefined) {
		html =opts.emailParams.html;
	}
	else {
		html =formTemplateHtml(opts.template, opts.templateParams, {});
	}
	
	// console.log('EmailMandrill.send opts.emailParams.from: '+opts.emailParams.from);
	var emailFrom = opts.emailParams.from ? opts.emailParams.from : cfg.email.from;
	// console.log('EmailMandrill.send emailFrom: '+emailFrom);
	var emailFromName = opts.emailParams.from_name ? opts.emailParams.from_name : cfg.email.from_name;
	// console.log('EmailMandrill.send emailFrom: '+emailFrom+' emailFromName: '+emailFromName);
	/*
	//official Mandrill api NOT WORKING..
	// var m = new Mandrill();
	var m = Mandrill();
	m.messages.send({
		key: apiKey,
		async: false,
		message: {
			html: html,
			subject: opts.emailParams.subject,
			from_email: emailFrom,
			from_name: 'Admin',
			// to: [
				// {email: opts.emailParams.to}
			// ]
			to: opts.emailParams.to
		}
	});
	*/
	
	mandrill('/messages/send', {
		message: {
			// to: [{email: opts.emailParams.to}],
			to: opts.emailParams.to,
			from_email: emailFrom,
			from_name: emailFromName,
			subject: opts.emailParams.subject,
			text: html,
			html: html
		}
	}, function(error, response) {
		if (error) {	//uh oh, there was an error
			console.log( JSON.stringify(error) );
			ret.msg+='ERROR: '+JSON.stringify(error);
			ret.code =1;
			deferred.reject(ret);
		}
		else {		//everything's good, lets see what mandrill said
			//go through EACH email and see if any were rejected
			for(ii =0; ii<response.length; ii++) {
				if(response[ii].status =='rejected' || response[ii].status =='invalid') {
					//ensure proper type first
					if(!ret.badEmails) {
						ret.badEmails =[];
					}
					if(!ret.badEmailsInfo) {
						ret.badEmailsInfo =[];
					}
					ret.badEmailsInfo.push(response[ii]);
					ret.badEmails.push(response[ii].email);
					ret.msg+='ERROR: bad message status: '+response.status;
					ret.code =2;
				}
			}
			console.log('Email sent! '+JSON.stringify(response));
			ret.msg +='Email sent! '+JSON.stringify(response);
			deferred.resolve(ret);
		}
	});
	
	return deferred.promise;
};

/**
@toc 2.
@method setTemplateVars
*/
function setTemplateVars(params) {
	var serverConfig =cfg.server;
	var url = serverConfig.domain;
	var port = (serverConfig.port) ? ':' + serverConfig.port : '';
	var path = serverConfig.serverPath;
	templateGlobalVars.publicServerUrl =url + port + path;
}

/**
HTML/text to put at end/bottom of email
@toc 3.
@method formSignature
*/
function formSignature(params) {
	var html ="<br /><br />";
	return html;
}

/**
@toc 4.
@method formTemplateHtml
*/
function formTemplateHtml(template, templateParams, params) {
	var templateHtml ='';
	if(template =='passwordReset') {
		var vars ={
			email: templateParams.email,
			reset_key: templateParams.reset_key,
			config: {
				publicServerUrl: templateGlobalVars.publicServerUrl,
				emailKey: 'email',
				resetKey: 'reset_key',
				resetUrlPath: 'password-reset'
			}
		};
		templateHtml ="Your password reset key is "+vars.reset_key+
		"<br />"+
		"Go to http://"+vars.config.publicServerUrl+vars.config.resetUrlPath+"?"+vars.config.emailKey+"="+vars.email+"&"+vars.config.resetKey+"="+vars.reset_key+" to reset your password."+
		"<br />"+
		"Alternatively, you can just enter the password key inside the app!<br />";
		templateHtml +=formSignature({});
	}
	return templateHtml;
}

module.exports = new EmailMandrill({});