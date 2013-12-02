/**
@module lookup
@class lookup

@toc
1. search
2. searchResults
*/

'use strict';

var self;

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

/**
@param {Object} opts
	// @param {Object} MongoDBMod
*/
function Lookup(opts) {
	// MongoDBMod =opts.MongoDBMod;
	self =this;
}

/**
@toc 1.
@method search
@param {Object} params
	@param {Object} query Full mongo query for what to query / search by
		@example {type: data.type, cost:{'$gte':data.priceMin, '$lte':data.priceMax} }
	OPTIONAL
	@param {Array} [skipIds] _id fields to skip (will be added to query AFTER they are converted to mongo ids (if necessary))
		@example ['324234', '328sakd23', '23lkjafl83']
	@param {Array} [fields] fields to return (default to all fields (no filtering))
		@example {_id:1, name:1, name_display:1, headline:1, header:1, date_edited:1}
	@param {Number} [skip =0] Where to start returning from (like a cursor)
	@param {Number} [limit =20] How many to return
	@param {Boolean} [skipIdsNotObjectIds =false] True to NOT convert these to mongo ids
	@param {Array} [sort] Fields to sort by; 1 for ascending order, -1 for descending
		@example {'name':1, 'date_created':-1}
@return
	@param {Object} error
	@param {Object} retArray
		@param {String} msg
		@param {Number} code
		@param {Number} valid
		@param {Array} results array [] of arrays {}; each has the fields specified by the "fields" param (or all fields if none is set)
*/
Lookup.prototype.search =function(db, collection, params, callback) {
	var thisObj =this;
	var retArray ={'code':0, 'valid':0, 'msg':'', 'results':false};
	//defaults
	var limit =20;
	//end: defaults
	/*
	//apparently can't pass in an array []..
	var fullQuery =[];
	var queryIndex =0;
	if(params.query !=undefined) {
		fullQuery[queryIndex] =params.query;
	}
	if(params.skipIds !=undefined && params.skipIds.length >0) {
		if(params.skipIdsNotObjectIds ==undefined || !params.skipIdsNotObjectIds) {
			var ids =MongoDBMod.makeIds({'ids':params.skipIds});
			fullQuery[queryIndex]['_id'] ={$nin:ids};
		}
		else {
			fullQuery[queryIndex]['_id'] ={$nin:params.skipIds};
		}
	}
	if(params.fields !=undefined) {
		fullQuery.push(params.fields);
	}
	*/
	var fullQuery ={'query':{}, 'fields':false};
	if(params.query !==undefined) {
		fullQuery.query =params.query;
	}
	if(params.skipIds !==undefined && params.skipIds.length >0) {
		if(params.skipIdsNotObjectIds ===undefined || !params.skipIdsNotObjectIds) {
		//if(0) {
			var ids =MongoDBMod.makeIds({'ids':params.skipIds});
			fullQuery.query._id ={$nin:ids};
		}
		else {
			fullQuery.query._id ={$nin:params.skipIds};
		}
	}
	if(params.fields !==undefined) {
		fullQuery.fields =params.fields;
	}

	if(params.limit !==undefined) {
		limit =params.limit;
	}
	retArray.fullQuery =fullQuery;
	retArray.collection =collection;
	
	//monogdb-native
	var queryOpts ={
		'limit':limit
	};
	retArray.msg +='limit ';
	if(fullQuery.fields) {
		queryOpts.fields =fullQuery.fields;
		retArray.msg +='fields ';
	}
	if(params.skip !==undefined && params.skip >0) {
		queryOpts.skip =params.skip;
		retArray.msg +='skip ';
	}
	if(params.sort) {
		queryOpts.sort =params.sort;
		retArray.msg +='sort ';
	}
	db[collection].find(fullQuery.query, queryOpts).toArray(function(err, docs) {
		thisObj.searchResults(err, docs, retArray, params, callback);
	});
};

/**
@toc 1.5.
@method searchResults
*/
Lookup.prototype.searchResults =function(err, records, retArray, params, callback) {
	if(err) {
		retArray.code =1;
		callback(true, retArray);
	}
	else if(!records) {
		retArray.code =2;
		callback(true, retArray);
	}
	else {
		retArray.valid =1;
		retArray.results =records;
		callback(false, retArray);
	}
};

module.exports = new Lookup({});