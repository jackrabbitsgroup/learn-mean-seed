/**
Continuous Integration script to run AFTER grunt / CI is run (will either be success or failure and may want to notify/send emails and update things accordingly)
Call from the command line/a shell process to start:
`node ci.js`
Command line arguments:
@param {String} build One of 'failed' or 'worked' (success), i.e. `node ci.js build=failed`
@param {String} [config] Which config to use, i.e. `node ci.js config=test`

@usage
Update the following git hook files accordingly:
1. `.git/hooks/build-failed` add: `node ci.js build=failed`
2. `.git/hooks/build-worked` add: `node ci.js build=worked`

@toc
1. Get appropriate config
2. worked
3. failed
5. parseGitLog
6. sendFailureEmails
7. gitReset
7.1. gitTag
7.2. gitWorkingCommit
8. buildCode
9. stopServer
4. Start server and call appropriate function (worked or failed)
*/

'use strict';

var fs = require('fs');
var Q = require('q');
var moment =require('moment');

var exec = require('child_process').exec		//use this for commands we don't need to output to the command line with user interaction
var spawnCommand =require('./spawn_command');		//for normalizing child_process.spawn across operating systems

//NOTE: some requires must happen AFTER global cfg property is set!

//some "globals" to use across multiple functions
var tagWorkedSuffix ='-worked';
var emailInfo ={
	noWorkingRollbackCommit: false
};


/**
Get appropriate config json file (using command line arguments if present)
@toc 1.
*/
//check for any command line arguments
var args =process.argv.splice(2);
var argsObj ={};
var obj1, xx;
args.forEach(function (val, index, array) {
	if(val.indexOf('=') >-1) {
		obj1 =val.split('=');
		// console.log('yes'+obj1[0]+" "+obj1[1]);
		argsObj[obj1[0]] =obj1[1];
	}
	// console.log(index + ': ' + val);
});
// for(xx in argsObj) {
	// console.log(xx+': '+argsObj[xx]);
// }

var env = 'normal';
var configFile = './app/configs/config.json';

//check to see if config_environment file exists and use it to load the appropriate config.json file if it does
var configFileEnv ='./config_environment.json';
if(fs.existsSync(configFileEnv)) {
	var cfgJsonEnv =require(configFileEnv);
	if(cfgJsonEnv && cfgJsonEnv !==undefined && cfgJsonEnv.environment !==undefined && cfgJsonEnv.environment.length >0) {
		configFile ='./app/configs/config-'+cfgJsonEnv.environment+'.json';
	}
}

//see if command line args for (test) config file
if(argsObj.config !==undefined) {
	if(argsObj.config =='test') {
		//insert a '.test' at the end of the config as the test config naming convention
		configFile =configFile.slice(0, configFile.lastIndexOf('.'))+'.test'+configFile.slice(configFile.lastIndexOf('.'), configFile.length);
		// configFile ='./app/test/config.json';
		env = 'test';
	}
	else {
		configFile ='./app/configs/config-'+argsObj.config+'.json';
	}
}
console.log('configFile: '+configFile);
var cfg =require(configFile);

//save on global object for use throughout the app. Globals are generally bad practice but without doing this, would have to include the above code for checking command line arguments for which config file to use in EVERY file that needed the config (using 'require'). Or could pass the config information through to each successive function/file that needs it by calling an initializing function or specific function with the config info BUT that just seems to pass the problem down the line.. This doesn't seem like a better solution. 
global.cfgJson =cfg;
global.environment = env;

//NOW require other files that depend on config
var dependency =require('./app/dependency.js');		//hardcoded
var pathParts =dependency.buildPaths(__dirname, {});

var Emailer =require(pathParts.services+'emailer/index.js');



//now that have the config JSON file, do the failed/worked follow up
/**
@toc 2.
@method worked
*/
function worked(params) {
	//tag the current commit so we can reset/revert to it later (need to TRACK working commits since resetting back to the last commit will NOT work if the last commit ALSO failed!)
	gitTag({}, function(ret1) {
		stopServer({});		//must still do this so CI task completes!
	});
}

/**
On failure, do 3 things:
A. Git rollback (to last commit) AND re-run grunt and restart server accordingly - basically re-call the git push webhook but with older (working) code
B. email / notify people (at least the author of the bad commit/push and also any emails/people from the config ci.emails_failed array)
@toc 3.
@method failed
*/
function failed(params) {
	//A. Git rollback & rebuild
	/*
	var command ='git';
	var args =['log', '--sparse'];
	var cmd =spawnCommand(command, args);
	cmd.on('exit', function(code) {
		console.log('child process exited with code: '+code);
		console.log("command run and done: "+command+" args: "+args);
	});
	*/
	var cmd =exec('git log --sparse', {}, function(err, stdout, stderr) {
		if(err) {
			console.log('err: command: '+command+' '+err);
		}
		console.log('stderr: '+stderr);
		// console.log('stdout: '+stdout);
		var logInfo =parseGitLog(stdout, {});
		console.log(logInfo.commit+' '+logInfo.authorEmail);
		
		//git reset / revert
		gitReset({}, function(retGit) {
			buildCode({}, function(retBuild) {
				//B. email / notify people
				sendFailureEmails({authorEmail:logInfo.authorEmail, commit:logInfo.commit, author:logInfo.author})
				.then(function(retEmail) {
					stopServer({});
				}, function(retErr) {
					stopServer({});
				});
			});
		});
	});
}

/**
@toc 5.
@method parseGitLog
@return {Object}
	@param {String} commit
	@param {String authorEmail
	@param {String} author
*/
function parseGitLog(stdout, params) {
	var ret ={
		commit: '',
		authorEmail: '',
		author: ''
	};
	// stdout =stdout.toString();		//so newline chars will show up, etc.
	// var lines =stdout.split('\n');
	console.log(stdout);
	var searches ={
		commit: 'commit ',
		author: 'Author: ',
		authorEmail: '<'
	};
	var indexCommit =stdout.indexOf(searches.commit);
	var lineEnd =stdout.indexOf('\n', indexCommit);
	var commit =stdout.slice((indexCommit+searches.commit.length), lineEnd);
	var indexAuthor =stdout.indexOf(searches.author);
	var lineEnd =stdout.indexOf('\n', indexAuthor);
	var author =stdout.slice((indexAuthor+searches.author.length), lineEnd);
	// console.log(author);
	var indexAuthorEmail =stdout.indexOf(searches.authorEmail, indexAuthor);
	var indexAuthorEmailEnd =stdout.indexOf('>', indexAuthorEmail);
	var authorEmail =stdout.slice((indexAuthorEmail+searches.authorEmail.length), indexAuthorEmailEnd);
	// console.log('\n\ncommit: '+commit+' authorEmail: '+authorEmail);
	ret.commit =commit;
	ret.authorEmail =authorEmail;
	ret.author =author;
	
	return ret;
}

/**
@toc 6.
@method sendFailureEmails
@param {Object} params
	@param {String} authorEmail
	@param {String} commit
	@param {String} author
@return {Object} (via promise)
	@param {String} msg
	@param {Number} code
*/
function sendFailureEmails(params) {
	var deferred = Q.defer();
	var ret ={msg:'', code:0};
	
	var to =[
		{
			email: params.authorEmail
		}
	];
	var ii;
	if(cfg.ci.emails_failed !==undefined) {
		for(ii =0; ii<cfg.ci.emails_failed.length; ii++) {
			if(cfg.ci.emails_failed[ii] !==params.authorEmail) {		//don't double email the author of the commit/push
				to.push({
					email: cfg.ci.emails_failed[ii]
				});
			}
		}
	}

	var html ="";
	if(emailInfo.noWorkingRollbackCommit) {
		html +="Build failed and NO KNOWN LAST WORKING COMMIT, CANNOT ROLLBACK. PUSH A VALID COMMIT IMMEDIATELY as the site is likely currently broken!<br />";
	}
	else {
		html +="Build failed, auto rolled back to previous commit<br />";
	}
	html +=
	"Go to http://"+cfg.server.domain+":"+cfg.ci.server.portCiServer.toString()+"/ to see build/error info<br />"+
	"FIX ASAP (make sure to run grunt to ensure the build completes locally BEFORE pushing!) and re-push!<br />"+
	"<br />"+
	"Author: "+params.author+", email: "+params.authorEmail+"<br />"+		//the email isn't displayed so use author AND authorEmail..
	"Commit: "+params.commit+"<br />"+
	"Server: http://"+cfg.server.domain+":"+cfg.server.port.toString()+"/"+"<br />"+
	"";
	
	if(Emailer){
		var emailParams = {
			to: to,
			subject: 'CI failure: '+cfg.app.name,
			html: html
		};
		Emailer.send({emailParams: emailParams})
		.then(function(retEmail) {
			deferred.resolve(ret);
		}, function(retErr) {
			deferred.reject(ret);
		});
	} else {
		console.log("WARNING: Email not sent because emailer is not configured");
	}
	
	return deferred.promise;
}

/**
Does a hard reset (destroys permanently) the most recent commit
@toc 7.
@method gitReset
*/
function gitReset(params, callback) {
	gitWorkingCommit({}, function(retTag) {
		if(retTag.commit) {
			var command ='git';
			// var args =['reset', '--hard', 'HEAD~1'];		//this does NOT work - the past commit could ALSO be bad!
			var args =['reset', '--hard', retTag.commit];
			var cmd =spawnCommand(command, args);
			cmd.on('exit', function(code) {
				console.log('child process exited with code: '+code);
				console.log("command run and done: "+command+" args: "+args);
				callback({});
			});
		}
		else {
			emailInfo.noWorkingRollbackCommit =true;
			console.log('ERROR: NO KNOWN LAST WORKING COMMIT, CANNOT ROLLBACK. PUSH A VALID COMMIT IMMEDIATELY!');
			callback({});
		}
	});
}

/**
Tags the current commit with a timestamp and tagWorkedSuffix
@toc 7.1.
@method gitTag
*/
function gitTag(params, callback) {
	var tagName =moment().format('YYYY-MM-DD-HH-mm-ss')+tagWorkedSuffix;
	var command ='git';
	var args =['tag', tagName];
	var cmd =spawnCommand(command, args);
	cmd.on('exit', function(code) {
		console.log('child process exited with code: '+code);
		console.log("command run and done: "+command+" args: "+args);
		callback({});
	});
}

/**
Gets the last WORKING commit SHA (by tag using tagWorkedSuffix)
@toc 7.2.
@method gitWorkingCommit
@return {Object} (via callback)
	@param {Number} code
	@param {String} msg
	@param {String} commit
*/
function gitWorkingCommit(params, callback) {
	var ret ={code:0, msg:'', commit:false};
	
	var lastWorkingTag =false;
	//get tags sorted by creation date (so we can get the most recent WORKING commit)
	//http://stackoverflow.com/questions/6900328/git-command-to-show-all-lightweight-tags-creation-dates
	var command;
	command ='git log --tags --simplify-by-decoration --pretty="format:%ai %d"';
	var cmd =exec(command, {}, function(err, stdout, stderr) {
		if(err) {
			console.log('err: command: '+command+' '+err);
		}
		console.log('stderr: '+stderr);
		//output is in form: '2013-11-20 14:04:15 -0800 (HEAD, tag1, tag2)'
		var index1 =stdout.indexOf(tagWorkedSuffix);
		if(index1 >-1) {
			var beg =stdout.lastIndexOf('(', index1);
			var end =stdout.indexOf(')', index1);
			var str =stdout.slice((beg+1), end);
			// console.log('str: '+str);
			var tags =str.split(', ');
			var ii;
			for(ii =0; ii<tags.length; ii++) {
				if(tags[ii].indexOf(tagWorkedSuffix) >-1) {
					lastWorkingTag =tags[ii];
					break;
				}
			}
			console.log('lastWorkingTag: '+lastWorkingTag);
		}
		
		if(lastWorkingTag) {
			//use tag to get commit SHA
			command ='git show-ref --tags '+lastWorkingTag;
			var cmd =exec(command, {}, function(err, stdout, stderr) {
				if(err) {
					console.log('err: command: '+command+' '+err);
				}
				console.log('stderr: '+stderr);
				
				//stdout is of format: '9asldf2lkjrlrqkjfljk3 regs/tags/tag1'
				ret.commit =stdout.slice(0, stdout.indexOf(' '));
				callback(ret);
			});
		}
		else {
			ret.code =1;
			callback(ret);
		}
	});
}

/**
(re)build code (i.e. run grunt) - typically used after doing the git reset
@toc 8.
@method buildCode
*/
function buildCode(params, callback) {
	var command ='grunt';
	var args =['q', '--type=prod'];		//NOTE: just doing grunt q since ASSUMING this (the previous commit) was good so do NOT need to re-run tests, etc.
	var cmd =spawnCommand(command, args);
	cmd.on('exit', function(code) {
		console.log('child process exited with code: '+code);
		console.log("command run and done: "+command+" args: "+args);
		callback({});
	});
}

/**
shut down server, return control to command line
@toc 9.
@method stopServer
*/
function stopServer(params) {
	console.log('stopping sever, app: '+app);
	// app.close();		//does NOT work and pervents the process exit from working!?
	process.exit(0);
}



/**
Start server and call appropriate function (worked or failed)
@toc 4.
*/
var build =false;
if(argsObj.build !==undefined) {
	build =argsObj.build;
}
// console.log('build: '+build);

var express = require('express');
var app = express();

var port =cfg.ci.server.port;
var host =cfg.server.domain;
var serverPath ='/';
	
// app.configure(function(){
// });

app.listen(port);

console.log('Server running at http://'+host+':'+port.toString()+'/');

//call the appropriate function based on the build (failed or worked)
if(build) {
	if(build =='worked') {
		worked({});
	}
	else if(build =='failed') {
		failed({});
	}
}
