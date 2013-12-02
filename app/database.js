'use strict';

/**
Returns a mongoose database connection. Configuration options should be passed in.

@usage
var opts = {
    host: 'localhost',
    port: 27017,
    database: 'project'
};

var db = require('./database')(opts);


Database module
@module database
**/

var mongodb = require('mongodb');
var async =require('async');
var Q = require('q');
var DBSchema =require('./db_schema.json');

/**
Initialize database connection using mongodb-native
@method exports
@return {Database} Database constructor
**/
module.exports = Database;

/**
Initialize database connection using mongoose
@class Database
@constructor
@param {Object} opts options object
	@param {String} [host] MongoDB host (e.g. 'localhost')
	@param {Number} [port] MongoDB port (e.g. 27017)
	@param {String} [database] MongoDB database name
	@param {String} [fullURI] A full url (i.e. for use with connecting to MongoHQ or MongoLab or other 3rd party hosted database). One of 'fullURI' OR 'host', 'port' and 'database' are required.
@property db {mongodb Connection}
**/
function Database(opts) {
	var thisObj =this;
	var deferred = Q.defer();
	//support connecting either with a full url db string OR a combination of database/host/port
	if(opts.fullURI !==undefined && opts.fullURI && opts.fullURI.length >0) {		//connect by full URL string (for 3rd party / remote database connections)
		new mongodb.Db.connect(opts.fullURI, function(err, db1) {
			if(err) {
				var errMsg ='[error] db connection: '+err;
				console.error.bind(console, errMsg);
				deferred.reject(errMsg);
			}
			else {
				console.log('[success] connected to db at '+opts.fullURI);
				var promise =thisObj.formCollections(db1, DBSchema, {});
				promise.then(function(dbCol) {
					// deferred.resolve(db1);
					deferred.resolve(dbCol);
				}, function(err) {
					deferred.reject(err);
				});
			}
		});
	}
	else {			//connect by database/host/port combination (for local database connections)
		var mongoserver =new mongodb.Server(opts.host, opts.port, {});
		var db_connector =new mongodb.Db(opts.database, mongoserver, {w:1});
		db_connector.open(function(err, db1) {
			if(err) {
				var errMsg ='[error] db connection: '+err;
				console.error.bind(console, errMsg);
				deferred.reject(errMsg);
			}
			else {
				console.log('[success] connected to db at %s:%s/%s', opts.host, opts.port, opts.database);
				var promise =thisObj.formCollections(db1, DBSchema, {});
				promise.then(function(dbCol) {
					// deferred.resolve(db1);
					deferred.resolve(dbCol);
				}, function(err) {
					deferred.reject(err);
				});
			}
		});
	}
	
	return deferred.promise;
}

/**
@method formCollections
@param {Object} db
@param {Object} dbSchema The schema (only the collections matter - expected to be an object where the keys are the collection names)
	@example
	{
		"user":
		{
			"_id":"{ObjectId} ObjectId('123l4k234l')"
			//user fields can be described here too but aren't necessary
		},
		"collection2":
		{
			"_id":"{ObjectId} ObjectId('123l4k234l')"
		}
	}
@param {Object} params
@return {Promise}
	@param {Object} dbCol Has all collections on it for doing queries just like with mongo command line, i.e. "dbCol.user.find..."
*/
Database.prototype.formCollections =function(db, dbSchema, params) {
	var deferred = Q.defer();
	var collections =[];
	var dbCol ={};
	var ii, xx;
	//use global config db schema file to form collections array
	var counter =0;
	for(xx in dbSchema) {
		collections[counter] =xx;
		counter++;
	}
	
	async.forEach(collections, function(curCol, aCallback) {
		db.createCollection(curCol, function(err, collection1){
			if(err) {
				console.log('Error: '+err);
				aCallback(true);
			}
			else {
				dbCol[collection1.collectionName] =collection1;
				aCallback(false);
			}
		});
	}, function(err) {
		if(err) {
			deferred.reject(err);
		}
		else {
			deferred.resolve(dbCol);
		}
	});
	
	return deferred.promise;
};

