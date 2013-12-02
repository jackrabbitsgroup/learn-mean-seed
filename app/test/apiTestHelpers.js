/**
Common helper functions getting the database connection and for making the http requests to test the api calls

@toc
1. init
5. initDB
6. checkServer
2. httpGo
3. formHost
4. parseData
7. expectRequest
*/

'use strict';

var lodash = require('lodash');
var Q = require('q');
var request = require('request');
var fs = require('fs');

var Database = require('../database.js');
var db =false;

//find the config to use and THEN add '.test' to it to ensure it's a test config - should NOT connect to the live database to do tests (both for data safety and because search and other api calls won't test properly with existing data)
// var configFile = '../configs/config.json';		//doesn't work with fs.exists.. need __dirname apparently..
var configFile =__dirname+'/../configs/config.json';

//check to see if config_environment file exists and use it to load the appropriate config.json file if it does
var configFileEnv =__dirname+'/../../config_environment.json';		//need __dirname or it won't work for fs.exists (does work for require() though)
if(fs.existsSync(configFileEnv)) {
	// console.log('configFileEnv: '+configFileEnv+' DOES exist');
	var cfgJsonEnv =require(configFileEnv);
	if(cfgJsonEnv && cfgJsonEnv !==undefined && cfgJsonEnv.environment !==undefined && cfgJsonEnv.environment.length >0) {
		configFile ='../configs/config-'+cfgJsonEnv.environment+'.json';
	}
}
// else {
	// console.log('configFileEnv: '+configFileEnv+' does NOT exist');
// }

//insert a '.test' at the end of the config as the test config naming convention
configFile =configFile.slice(0, configFile.lastIndexOf('.'))+'.test'+configFile.slice(configFile.lastIndexOf('.'), configFile.length);

var cfg = require(configFile);
console.log('TEST configFile: '+configFile);

var inst ={

	inited: false,
	
	/**
	Open database connection and return db object (via promise)
	@toc 1.
	@method init
	*/
	init: function(params) {
		var deferred =Q.defer();
		var thisObj =this;
		if(!thisObj.inited) {
			//only complete when ALL promises are done
			Q.all([
				thisObj.initDB({}),
				thisObj.checkServer({})
			]).then(function(ret1) {
				// console.log('init resolve');
				deferred.resolve({db: db});
			}, function(err) {
				// console.log('init reject');
				deferred.reject(err);
			});
			
			/*
			//this runs all promises but resolves BEFORE the 2nd one is done..??
			thisObj.initDB({})		//init db
			.then(thisObj.checkServer({}))		//check server (make sure testing server is running so http requests work)
			.then(function(ret1) {
				console.log('init resolve');
				deferred.resolve({db: db});
			}, function(err) {
				console.log('init reject');
				deferred.reject(err);
			});
			*/
			
			thisObj.inited =true;		//set for next time
		}
		else {
			deferred.resolve({db: db});
		}
		return deferred.promise;
	},
	
	/**
	@toc 5.
	@method initDB
	*/
	initDB: function(params) {
		var deferred =Q.defer();
		
		//get database connection
		var promise =new Database({
			"host": cfg.db.host,
			"port": cfg.db.port,
			"database": cfg.db.database
		});
		promise.then(function(db1) {
			db =db1;		//sets the object global variable (which can then be returned later)
			deferred.resolve({db: db});
		}, function(err) {
			console.log('Error getting database connection');
			deferred.reject(err);
		});
			
		return deferred.promise;
	},
	
	/**
	Ensure the test server (which connects to the test database) is running - otherwise http requests will fail and tests will not work. It's important to connect to a test database otherwise can't test things like searching where number of results could be anything if there are existing users, etc. Want to wipe the testing database clean before each test to ensure accurate results and tests.
	@toc 6.
	@method checkServer
	*/
	checkServer: function(params) {
		var deferred =Q.defer();
		var self =this;
		//make a request (the method / endpoint doesn't really matter - just testing to ensure a response comes back)
		var reqObj =self.httpGo({method:'User.search'}, {data:{}}, {});
		request(reqObj, function(error, response, data)
		{
			if(error || response.statusCode !=200) {
				console.log('\n------------------\n[ERROR]\nRun `node run.js config=test`\nServer not connected. Ensure you have a node server running with the `config=test` command line option so this server connects to the TEST database - the same one used here for the tests. Do NOT connect to the live database for doing tests!\n------------------\n');
				deferred.reject({});
			}
			else {
				// console.log('checkingServer success!');
				deferred.resolve({});
			}
		});
		return deferred.promise;
	},
	
	/**
	Mimics frontend appHttp service for making an api call
	@toc 2.
	@method httpGo
	@param {Object} rpcOpts
		@param {String} method The RPC method to use (i.e. 'Auth.login')
	@param {Object} httpOpts $http opts (will be extended off defaults)
		@param {Object} data The data to send back
	@param {Object} [params] additional options
		@param {String} [msgSuccess] Message to alert upon success
	@return deferred.promise
	@example httpGo({method:'Auth.login'}, {data:{email:'t@t.com'}}, {});
	**/
	httpGo: function(rpcOpts, httpOpts, params) {
		var thisObj =this;
		//default url part to be the lowercase version of the first part of the rpc method (i.e. 'Auth.login' means 'auth/' will be the url part)
		var urlDefault =rpcOpts.method.slice(0, rpcOpts.method.indexOf('.')).toLowerCase()+'/';
		
		var defaultHttpOpts ={'method':'POST', 'params':{}, 'data':{}, 'url':urlDefault};
		httpOpts =lodash.extend({}, defaultHttpOpts, httpOpts);
		
		//add url api prefix
		var urlPrefix ='/api/';
		httpOpts.url =urlPrefix+httpOpts.url;
		
		//make data / params into rpc format
		httpOpts.data = {
			jsonrpc: '2.0',
			id: 1,
			method: rpcOpts.method,
			params: httpOpts.data || httpOpts.params || {}
		};
		// GET requests require that RPC input be placed under rpc namespace
		if( httpOpts.method === 'GET' ) {
			httpOpts.params = {
				rpc: httpOpts.data
			};
		}
		else {		//remove params since these are only used for GET method calls and if left as blank object, it will cause an extra "?" to be appended to the url
			delete httpOpts.params;
		}

		var hostUrlPrefix =thisObj.formHost({});
		var fullUrl =hostUrlPrefix+httpOpts.url;
		var reqObj ={
			'url':fullUrl,
			'method':httpOpts.method
			// 'headers':{'Content-Type':'application/x-www-form-urlencoded'},		//required or it won't work!..
		};
		if(httpOpts.method =='POST') {
			//reqObj.body =JSON.stringify(httpOpts.data);
			reqObj.json =httpOpts.data;		//this isn't super well documented / no examples, but you can just stuff json directly for POST calls
		}

		return reqObj;
	},
	
	/**
	Form full host for urll since connecting to server (even though it should be the same server, it's still treated as a remove server for the http request so need the full url including server/domain)
	@toc 3.
	@method formHost
	*/
	formHost: function(params) {
		var host1 ="http://"+cfg.server.domain;
		if(cfg.server.port) {
			host1+=":"+cfg.server.port;
		}
		// host1+="/api";
		// host1+="/";
		// console.log('host1: '+host1);
		return host1;
	},
	
	/**
	Parses http request response data to JSON
	@toc 4.
	@method parseData
	*/
	parseData: function(data, params) {
		var retData;
		// console.log(data);
		// console.log("------------");
		if(typeof(data) =='string') {
			retData =JSON.parse(data);
		}
		else {
			retData =data;
		}
		return retData;
	},
	
	/**
	@toc 7.
	@method expectRequest
	@return {Promise}
	*/
	expectRequest: function(httpGoRpc, httpGoHttp, httpGoParams, params) {
		var deferred =Q.defer();
		var self =this;
		var reqObj =self.httpGo(httpGoRpc, httpGoHttp, httpGoParams);
		request(reqObj, function(error, response, data)
		{
			expect(error).toBeFalsy();
			if(!error) {
				expect(response.statusCode).toEqual(200);
				if(response.statusCode ==200) {
					data =self.parseData(data, {});
					deferred.resolve({data: data});
				}
			}
		});
		return deferred.promise;
	}

};
module.exports =inst;