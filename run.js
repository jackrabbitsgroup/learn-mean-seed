/**
Main entry point for starting the server application. Call from the command line to start the application:
`node run.js`
Alternate usage:
`node run.js config=test`
*/

'use strict';

var fs = require('fs');

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

var dirpath = __dirname;
var app = require('./app')(cfg, dirpath);

app.run();
