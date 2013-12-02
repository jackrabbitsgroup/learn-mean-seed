/**
@fileOverview

@module crud
@class crud

@toc
//1. setSearchParams
//2. save (create, update)
//3. read
//4. delete1
//5. saveSubArray (create, update)
//5.1. subArrayCreate
//6. deleteSubArray
*/

'use strict';

var mongodb = require('mongodb');
var lodash = require('lodash');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var MongoDBMod =require(pathParts.services+'mongodb/mongodb.js');

var self;

/**
@param {Object} opts
	// @param {Object} MongoDBMod
*/
function Crud(opts) {
	// MongoDBMod =opts.MongoDBMod;
	self =this;
}

/**
Forms a query for the 'search' operation.
@toc 1.
@method setSearchParams
@param {Object} data
	@param {String} [searchString] Text to search for in the specified searchFields. If empty or undefined, returns everything.
	@param {Array} [searchFields] Array [] of schema fields in which to search for searchString.
	@param {Array} [skipIds] Array [] of _id fields to skip. Records with an _id in this array will NOT be returned.
	@param {Object} [fields] Array {} of fields to return. The returned records will have only these fields defined; other fields will be stripped away. Use an empty array {} to return all fields.
	@param {Number} [skip] Positive Integer. Specifies where to start returning from (like a cursor). The first [skip] records found will not be returned.
	@param {Number} [limit] Positive Integer. Use to limit the number of records returned.
*/
Crud.prototype.setSearchParams =function(data, query, params) {
	if(data.searchString) {
		var regex =data.searchString;
		if(query.$or ===undefined) {
			query.$or =[];
		}
		//json parse issue where an array of length one is a string rather than an array?
		if(typeof(data.searchFields) =='string') {
			data.searchFields =[data.searchFields];
		}
		for(var ii=0; ii<data.searchFields.length; ii++) {
			var curIndex =query.$or.length;
			query.$or[curIndex] ={};		//can't define a variable key in the definition so define first then stuff
			query.$or[curIndex][data.searchFields[ii]] ={'$regex': regex, '$options': 'i'};
			//query['$or'][curIndex] ={ 'name_display': {'$regex': regex, '$options': 'i'} };
		}
	}
	var ppSend ={
		'query':query,
		'fields':data.fields,
		'limit':data.limit
	};
	if(data.skipIds) {
		ppSend.skipIds =data.skipIds;
	}
	if(data.skip) {
		ppSend.skip =data.skip;
	}
	return ppSend;
};

/**
Creates a new record in the collection if _id is absent. If _id field is present, performs an update with $set, so only specified fields are changed and the rest are left untouched.
@toc 2.
@method save
@param {Object} data A partial or complete database record to save.
@param {Object} params
	@param {String} collection Name of mongo collection to operate on.
*/
Crud.prototype.save =function(db, data, params, callback)
{
	var ret ={'code':0, 'msg':'Crud.save ', 'result':false};
	if(data._id !==undefined)		//update
	{
		var idSave =data._id;
		delete data._id;		//for $set update
		db[params.collection].update({_id:MongoDBMod.makeIds({'id':idSave}) }, {$set:data}, {'safe':true}, function(err, result)
		{
			if(err)
			{
				ret.code =1;
				ret.msg +="db."+params.collection+"update Error: "+err;
			}
			else if(!result)
			{
				ret.code =2;
				ret.msg +="db."+params.collection+"update No result";
			}
			else
			{
				ret.msg = 4;
			}
			callback(ret.code, ret);
		});
	}
	else		//create
	{
		db[params.collection].insert(data, {safe: true}, function(err, record)
		{
			if(err)
			{
				ret.code =1;
				ret.msg +="db."+params.collection+".insert Error: "+err;
			}
			else if(!record)
			{
				ret.code =2;
				ret.msg +="db."+params.collection+".insert No record";
			}
			else
			{
				ret.result =record[0];		//insert returns an array of items, even if there's only 1
			}
			callback(ret.code, ret);
		});
	}
};

/**
Read: Takes an _id, or an array of _ids, or fullQuery. Returns the record(s) with the id. 
NOTE: there are "fullQuery" and "query" parameters to do more complicated queries but this function is primarily aimed at looking up objects by "_id". If you're doing a search on fields other than "_id" try using the lookup module's "search" function instead.
@toc 3.
@method read
@param {Object} data One of '_id' or '_ids' or 'fullQuery' is required
	@param {String} [_id] Id for object to lookup. Will be converted to mongo object id if necessary.
	@param {Array} [_ids] Ids to look up object info on Will be converted to mongo object ids if necessary.
	@param {Object} [fullQuery] Full mongo query to use directly for read
	@param {Array} [fields] Mongo query for which fields in the record to return. Use the empty object {} to get all fields.
		@example {'_id':1, 'name':1}
		@default {'_id':1, 'name':1}
	@param {Object} [query] Additional query for lookup
@param {Object} params
	@param {Object} [defaults] Legacy support for double defaults (these will be extended/over-written by 'data'). This second set of defaults mimics the structure of data (i.e. there are 'fullQuery', 'fields', and 'query' keys) and is used to allow defaults per collection to be passed in here and over-written by (frontend) fields and queries. A better / less confusing way to do this is to add a function that merges the frontend data and the collection defaults OUTSIDE this function.
	@param {String} collection Name of mongo collection to operate on.
	
@return
	@param {Boolean} error True (or at least truthy) iff there was an error.
	@param {Object} retArray Holds return information.
		@param {String} msg A message code.
		@param {Number} code Number. A numeric status code.
		@param {Array} results Array [] of records {} from the database. Which fields are returned depends on the data.field parameter.
		@param {Object} result If '_id' was used so that only one record is returned, it will be here.
		
@usage
	//read one user
	var db =[db object];
	var data1 =
	{
		_id: 23kdasfk,
		fields:{'_id':1, 'name':1, 'description':1}
	};
	crud.read(db, data1, {'collection':'user'}, callback);
		
*/
Crud.prototype.read =function(db, data, params, callback) {
	var retArray ={'code':0, 'msg':'Crud.read ', 'results':false};
	//@todo - update / get new extend function that can not overwrite blank/empty (for data.fields)
	// var fieldsSave =global.LArray.copyArray(data.fields, {});
	// data =global.LArray.extend(params.defaults, data, {});
	var fieldsSave =lodash.cloneDeep(data.fields);
	data =lodash.extend({}, params.defaults, data);
	//copy over data.fields that's passed in (if it is) - want to preserve empty array
	if(fieldsSave !==undefined) {
		data.fields =fieldsSave;
	}
	
	var query ={};
	if(data.query) {
		query =data.query;
	}
	if(data.fullQuery !==undefined) {
		query =data.fullQuery;
		db[params.collection].find(query, data.fields).toArray(function(err, records) {
			if(err) {
				retArray.code =1;
				retArray.msg +="Error: "+err;
				callback(retArray.code, retArray);
			}
			else if(!records) {
				retArray.code =2;
				retArray.msg +="fullQuery - No results. query was: "+JSON.stringify(query);
				callback(retArray.code, retArray);
			}
			else {
				retArray.results =records;
				callback(false, retArray);
			}
		});
	}
	else if(data._id !==undefined)
	{
		data._id =MongoDBMod.makeIds({'id':data._id});
		query._id =data._id;
		db[params.collection].findOne(query, data.fields, function(err, record)
		{
			if(err)
			{
				retArray.code =1;
				retArray.msg +="Error: "+err;
				callback(retArray.code, retArray);
			}
			else if(!record)
			{
				retArray.code =2;
				retArray.msg +="_id no result; invalid _id. query was: "+JSON.stringify(query);
				callback(retArray.code, retArray);
			}
			else
			{
				retArray.result =record;
				callback(false, retArray);
			}
		});
	}
	else if(data._ids !==undefined)
	{
		data._ids =MongoDBMod.makeIds({'ids':data._ids});
        console.log(data._ids[0]);
		query._id ={$in:data._ids};
		db[params.collection].find(query, data.fields).toArray(function(err, records) {
			if(err)
			{
				retArray.code =1;
				retArray.msg +="Error: "+err;
				callback(retArray.code, retArray);
			}
			else if(!records)
			{
				retArray.code =2;
				retArray.msg +="_ids no results. Invalid _ids. query was: "+JSON.stringify(query);
				callback(retArray.code, retArray);
			}
			else
			{
				retArray.results =records;
				callback(false, retArray);
			}
		});
	}
	else
	{
		retArray.msg +='One of _id OR _ids OR fullQuery must be supplied';
		callback(true, retArray);
	}
};

/**
Takes an _id, or an array of _ids. Removes the corresponding records from the database.
@toc 4.
@method delete1
@param {Object} data
	@param {String} [_id] Id of object to delete. One of '_id' or '_ids' is required
	@param {Array} [_ids] Ids to delete (will be converted to mongo object ids if necessary). One of '_id' or '_ids' is required
@param {Object} params
	@param {String} collection Name of mongo collection to operate on.
*/
Crud.prototype.delete1 =function(db, data, params, callback) {
	var ret ={'code':0, 'msg':'Crud.delete1 '};
	var query ={};
	if(data._id !==undefined && data._id.toString().length >1) {
		data._id =MongoDBMod.makeIds({'id':data._id});
		db[params.collection].remove({_id:data._id}, function(err, numRemoved) {
			if(err) {
				ret.code =1;
				ret.msg +="db."+params.collection+".remove Error: "+err;
			}
			else if(numRemoved <1) {
				ret.code =2;
				ret.msg +="db."+params.collection+".remove Num removed: "+numRemoved;
			}
			else {
				ret.msg +="db."+params.collection+".remove Removed "+numRemoved;
			}
			callback(ret.code, ret);
		});
	}
	else if(data._ids !==undefined) {
		data._ids =MongoDBMod.makeIds({'ids':data._ids});
		query._id ={$in:data._ids};
		db[params.collection].remove({_id:{$in:data._ids}}, function(err, numRemoved) {
			if(err) {
				ret.code =1;
				ret.msg +="db."+params.collection+".remove Error: "+err;
			}
			else if(numRemoved !=data._ids.length) {
				ret.code =2;
				ret.msg +="db."+params.collection+".remove Num removed "+numRemoved+" not equal to num ids "+data._ids.length;
			}
			else {
				ret.msg +="db."+params.collection+".remove Removed "+numRemoved;
			}
			callback(ret.code, ret);
		});
	}
	else {
		ret.msg ='One of _id OR _ids must be supplied';
		callback(true, ret);
	}
};

/**
Updates an item in an array inside of a record, or adds via $push if not present. Assumes that items in the sub-array have unique _id fields. NOTE: you can update as many fields as you want (even outside the subArray on the main object/document) BUT you can only have ONE positional operator update per $set query.
@toc 5.
@method saveSubArray
@param {Object} data
	@param {Object} main Holds id of outer collection item to use
		@param {String} _id
	@param {Object} subObj Info to be saved.
		@param {String} _id
	@param {Object} [setObj] Any additional values to set on the root/main object
	@param {Object} [updateQuery] Any additional queries to run updates on (i.e. {$inc: {field1: 1}} )
@param {Object} params
	@param {String} collection Name of mongo collection to operate on.
	@param {String} subKey Name of the array to edit or $push to. If nested in another array, include the positional operator '$'**.
		@example 'site' OR 'test.question' OR 'training.$.completed'
	@param {Boolean} [subKeysNoObjectId] True if subObj _id should NOT be an Object Id
@usage
	//create/update a user.site object (the 'site' field/key of a 'user' collection)
	var db =[db object];
	var data1 =
	{
		main:{
			_id: 132332
		},
		subObj:{
			_id: 3823k,
			field1: 'val1',
			field2: 'val2'
		}
	};
	crud.saveSubArray(db, data1, {'collection':'user', 'subKey':'site'}, callback);
*/
//**Note: MongoDB currently cannot handle multiple positional operators. You cannot update an item inside an array that is inside another array.
//However, you can $push to an array inside another array, because this requires only one positional operator.
Crud.prototype.saveSubArray =function(db, data, params, callback)
{
	var thisObj =this;
	var ret ={'code':0, 'msg':'Crud.saveSubArray '};
	var mainId =MongoDBMod.makeIds({'id':data.main._id});
	
	if(data.subObj._id ===undefined)		//it's a create
	{
		thisObj.subArrayCreate(db, data, params, callback);
	}
	else		//have to see if array item with this id already exists or not
	{
		var subObjId;
		if(params.subKeysNoObjectId ===undefined || !params.subKeysNoObjectId) {
			subObjId =MongoDBMod.makeIds({'id':data.subObj._id});
		}
		else {
			subObjId =data.subObj._id;
		}
		var subKeyId =params.subKey+'._id';
		
		subKeyId = subKeyId.replace('.$.', '.');		//Don't need positional operator for the query.
		
		//Using ".findOne({'_id':mainId, subKeyId:subObjId}, ..." fails because it will try to find something with a property named subKeyId
		//Must form the query separately
		var query = {'_id':mainId};
		query[subKeyId] = subObjId;
		db[params.collection].findOne(query, function(err, record)
		{
			if(err) 
			{
				ret.code =1;
				ret.msg +="db."+params.collection+".findOne Error: "+err;
				callback(ret.code, ret);
			}

			else if(!record)		//create / $push new
			{
				ret.msg +="db."+params.collection+".findOne !record - creating new ";
				thisObj.subArrayCreate(db, data, params, callback);
			}
			else			//update existing
			{
				//ret.msg +='db[params.collection].findOne update existing ';
				var setKey =params.subKey;
				var subIdSave =data.subObj._id;
				delete data.subObj._id;
				var setQuery ={};
				if(data.setObj !==undefined) {
					setQuery =data.setObj;
				}
				var updateQuery ={};
				if(data.updateQuery !==undefined) {
					updateQuery =data.updateQuery;
				}
				//ret.msg +='data.subObj: '+JSON.stringify(data.subObj)+' ';
				for(var xx in data.subObj)
				{
					var key1 =params.subKey+'.$.'+xx;
					setQuery[key1] =data.subObj[xx];
				}
				//ret.msg +='query: '+JSON.stringify(query)+' setQuery: '+JSON.stringify(setQuery)+' ';
				updateQuery.$set =setQuery;
				// db[params.collection].update(query, {'$set':setQuery}, {'safe':true}, function(err, num_modified)
				// console.log('collection: '+params.collection+' query: '+JSON.stringify(query)+' updateQuery: '+JSON.stringify(updateQuery));
				db[params.collection].update(query, updateQuery, {'safe':true}, function(err, num_modified)
				{
					if(err)
					{
						ret.code =1;
						ret.msg +="db."+params.collection+".update Error: "+err;
					}
					callback(ret.code, ret);
				});
			}
		});
	}
};

/**
$Pushes a given item to a given record's given sub-array. Creates an _id for the new item if it does not have one.
@toc 5.1.
@method subArrayCreate
@param {Object} data
	@param {Object} main Holds id of outer collection item to use
		@param {String} _id
	@param {Object} subObj Info to be saved.
		@param {String} _id
	@param {Object} [setObj] Any additional values to set on the root/main object
	@param {Object} [updateQuery] Any additional queries to run updates on (i.e. {$inc: {field1: 1}} )
	@param {Object} [secondary] key-value params for additional query paramters to get to even further nested arrays
		@example {'course._id':'382923', 'course.completed._id':'302044'}
@param {Object} params
	@param {String} collection Name of mongo collection to operate on.
	@param {String} subKey Name of the array to edit or $push to. If nested in another array, include the positional operator '$'.
		@example 'site' OR 'test.question'
	@param {Boolean} [subKeysNoObjectId] True if subObj _id AND secondary keys should NOT be Object Ids
@return
	@param {Object}
		@param {String} msg A message code.
		@param {Number} code Number. A numeric status code.
		@param {String} _id Id of the item newly added to the sub-array. (Included for backwards compatability)
		@param {Object} result The newly added item
			@param {String} _id Id of the item newly added to the sub-array.
*/
Crud.prototype.subArrayCreate =function(db, data, params, callback)
{
	var ret ={'code':0, 'msg':'Crud.subArrayCreate ', 'result': false};
	var mainId =MongoDBMod.makeIds({'id':data.main._id});
	
	var subObjId;
	if(data.subObj._id ===undefined)
	{
		subObjId =new mongodb.ObjectID();
	}
	else
	{
		if(params.subKeysNoObjectId ===undefined || !params.subKeysNoObjectId) {
			subObjId =MongoDBMod.makeIds({'id':data.subObj._id});
		}
		else {
			subObjId =data.subObj._id;
		}
	}
	
	var pushItem = data.subObj;
	pushItem._id = subObjId;
	ret._id = subObjId;
	ret.result = pushItem;
	
	var pushObj ={};
	pushObj[params.subKey] =pushItem;
	var query ={'_id':mainId};
	if(data.secondary !==undefined)
	{
		for(var xx in data.secondary)
		{
			if(params.subKeysNoObjectId ===undefined || !params.subKeysNoObjectId) {
				query[xx] =MongoDBMod.makeIds({'id':data.secondary[xx]});
			}
			else {
				query[xx] =data.secondary[xx];
			}
		}
	}
	
	var updateQuery ={};
	if(data.updateQuery !==undefined) {
		updateQuery =data.updateQuery;
	}
	if(data.setObj !==undefined) {
		updateQuery.$set =data.setObj;
	}
	updateQuery.$push =pushObj;
	
	// console.log('collection: '+params.collection+' query: '+JSON.stringify(query)+' updateQuery: '+JSON.stringify(updateQuery));
	db[params.collection].update(query, updateQuery, {'safe':true}, function(err, valid)
	{
		if(err)
		{
			ret.code =1;
			ret.msg +='db'+[params.collection]+'.update Error: '+err;
		}
		else if(!valid)
		{
			ret.code =2;
			ret.msg +='db'+[params.collection]+'.update Invalid mainId: '+mainId+' query: '+JSON.stringify(query)+' pushObj: '+JSON.stringify(pushObj);
		}
		else {
			ret.msg +='db'+[params.collection]+'.update VALID mainId: '+mainId+' query: '+JSON.stringify(query)+' pushObj: '+JSON.stringify(pushObj);
		}
		callback(ret.code, ret);
	});
};

/**
Removes (via $pull) an item from an array inside of a collection object
@toc 6.
@method deleteSubArray
@param {Object} data
	@param {Object} main Holds id of outer collection item to use
		@param {String} _id
	@param {Object} subObj Holds _id of item to be removed
		@param {String} _id
	@param {Object} [secondary] key-value params for additional query paramters to get to even further nested arrays
		@example {'course._id':'382923', 'course.completed._id':'302044'}
@param {Object} params
	@param {String} collection Name of mongo collection to operate on.
	@param {String} subKey Name of the array to $pull from. If nested in another array, include the positional operator '$'**.
		@example 'site' OR 'test.question' OR 'training.$.completed
	@param {Boolean} [subKeysNoObjectId] True if subObj _id AND secondary keys should NOT be Object Ids
@usage
	//delete a user.site object (the 'site' field/key of a 'user' collection)
	var db =[db object];
	var data1 =
	{
		main:{
			_id: 132332
		},
		subObj:{
			_id: 3823k
		}
	};
	crud.deleteSubArray(db, data1, {'collection':'user', 'subKey':'site'}, callback);
*/
//**Note: MongoDB currently cannot handle multiple positional operators.
//You can $pull from an array inside another array, but you can't $pull from any deeper arrays.

Crud.prototype.deleteSubArray =function(db, data, params, callback)
{
	var ret ={'code':0, 'msg':'Crud.deleteSubArray '};
	
	var mainId =MongoDBMod.makeIds({'id':data.main._id});
	var subObjId;
	if(params.subKeysNoObjectId ===undefined || !params.subKeysNoObjectId) {
		subObjId =MongoDBMod.makeIds({'id':data.subObj._id});
	}
	else {
		subObjId =data.subObj._id;
	}
	
	var pullObj ={};
	pullObj[params.subKey] ={'_id':subObjId};
	var query ={'_id':mainId};
	
	if(data.secondary !==undefined)
	{
		for(var xx in data.secondary)
		{
			if(params.subKeysNoObjectId ===undefined || !params.subKeysNoObjectId) {
				query[xx] =MongoDBMod.makeIds({'id':data.secondary[xx]});
			}
			else {
				query[xx] =data.secondary[xx];
			}
		}
	}
	ret.msg +='params.collection: '+params.collection+' query: '+JSON.stringify(query)+' pullObj: '+JSON.stringify(pullObj)+' ';
	db[params.collection].update(query, {'$pull':pullObj}, {'safe':true}, function(err, valid)
	{
		if(err)
		{
			ret.code =1;
			ret.msg +="db."+params.collection+".update Error: "+err;
		}
		else if(!valid)
		{
			ret.code =2;
			ret.msg +="db."+params.collection+".update Invalid";
		}
		callback(ret.code, ret);
	});
};

module.exports = new Crud({});