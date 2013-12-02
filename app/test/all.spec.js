/**
NOTE: search for `site-specific` in this file for all the places that will likely have to be changed (i.e. each time add a new controller's tests)

Runs ALL tests by requiring the various (modularized) test files. It first sets up the common stuff (api helper functions, database connection, any necessary modules are required then pass to the individual test files to avoid having to require inside each test file).

NOTE: "it" blocks with modularized/nested function and async code can be finicky - I don't think nested "it" blocks are allowed BUT need an outer "it" block to ensure the async code gets run (otherwise it will just complete immediately before running any tests). So if and when to use "done" for the it blocks and where to put them is sometimes hard to follow/trace. When in doubt, try an "it" block and if it errors or doesn't complete, try just putting an "expect" there directly - it's likely already in an "it" block..

@toc
1. outer describe & it wrappers and initialize api/db connection
4. clearDB
2. initModules
3. start
*/

'use strict';

var https = require("https");
var request = require('request');
// var async = require('async');
var Q = require('q');

var DBSchema =require('../db_schema.json');

var api =require('./apiTestHelpers.js');

//include modules
var dependency =require('../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

//include/require all individual tests
//site-specific
var AuthTests = require(pathParts.modules+'/controllers/auth/auth.test.js');
var UserTests = require(pathParts.modules+'/controllers/user/user.test.js');
var FollowTests = require(pathParts.modules+'/controllers/follow/follow.test.js');

//run the server in the TEST environment (this also is required for coverage to work / run on all the files)
process.argv.push('config=test');		//add test command line argument
var run =require(pathParts.modules+'/../../run.js');

var db =false;

/**
outer wrapper 'describe' and 'it' blocks to ensure async tests actually run
@toc 1.
*/
describe('all tests', function() {
	it("should test everything", function(done)
	{
	
		//use timeout to give some time for server to start (otherwise will error if try to connect to db / server before it's ready). NOTE: this must be INSIDE the describe / it block otherwise it won't work!
		console.log("waiting for server to be running..");
		setTimeout(function() {
		
		//init api and database connection - then call start after
		var promise =api.init({});
		promise.then(function(ret1) {
			db =ret1.db;
			
			clearDB({}).then(function(ret1) {
				start({});
				done();
			}, function(err) {
				expect('ERROR with clearDB - check the logs above to fix the problem then try again').toBe(false);		//force error
				done();
			});
		}, function(err) {
			// console.log('Error: '+err);
			expect('ERROR - check the logs above to fix the problem then try again').toBe(false);		//force error
			done();
		});
		
		/**
		Clears the db first (to ensure no leftover data from last time, errors, or from frontend E2E tests)
		@toc 4.
		@method clearDB
		*/
		var clearDB =function(params) {
			var deferred =Q.defer();
			
			console.log('clearing out database..');
			
			var promises =[], deferreds =[], ii;
			var dbCollections =[];
			var xx;
			for(xx in DBSchema) {
				dbCollections.push(xx);
			}
			
			for(ii =0; ii<dbCollections.length; ii++) {
				(function(ii) {
					deferreds[ii] =Q.defer();
					
					db[dbCollections[ii]].remove({}, function(err, numRemoved) {
						if(err) {
							console.log('clearDB remove collection: '+dbCollections[ii]+' error ');
							deferreds[ii].reject({});
						}
						else {
							deferreds[ii].resolve({});
						}
					});
					
					promises[ii] =deferreds[ii].promise;
				})(ii);
			}
			
			Q.all(promises).then(function(ret1) {
				deferred.resolve({});
			}, function(err) {
				deferred.reject({});
			});
			
			return deferred.promise;
		};

		/**
		Modules are functions so need to call them with the necessary objects to init them and get an object back
		@toc 2.
		@method initModules
		*/
		var initModules =function(params) {
			//now that have db, set it in modules
			//site-specific
			AuthTests =new AuthTests({db: db, api:api});
			UserTests =new UserTests({db: db, api:api});
			FollowTests =new FollowTests({db: db, api:api});
		};

		/**
		Actually run the individual tests
		@toc 3.
		@method start
		*/
		var start =function(params) {
			initModules({});

			describe('starting tests', function() {
				it('should run start tests', function(done) {
					done();		//not sure why this goes here, but it works this way (and not other ways)..
					
					// var promiseAuth =AuthTests.run({});
					// promiseAuth.then(function(retAuth) {
					// }, function(err) {
						// console.log('err: '+err);
					// });
					
					//site-specific
					var promiseAuth =AuthTests.run({})
					.then(UserTests.run({}))
					.then(FollowTests.run({}))
					.then(function(retFin) {
						console.log('all tests done!');
					}, function(err) {
						console.log('err: '+err);
					});
				});
			});
			
		};
		
		}, 2500);		//end: timeout. NOTE: this time must be LESS than 5000 since that's the auto timeout for jasmine node test runner where it will quit!
	
	});
});