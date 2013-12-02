/**
@module mongodb

@toc
2. validIdCheck
1. makeIds
3. idsToString
4. objectIdSubArray
*/

'use strict';

var mongodb = require('mongodb');

var self;

function MongoDB(options) {
	self =this;
}

/**
(copied code excerpts from mongodb code to check if it's a valid object id)
https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js#L15
@toc 2.
@method validIdCheck
@return {Boolean} true if valid id
*/
MongoDB.prototype.validIdCheck =function(id, params) {
	// Regular expression that checks for hex value
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
	// Throw an error if it's not a valid setup
	if(id !== null && 'number' != typeof id && (id.length != 12 && id.length != 24)) {
		return false;
		//throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
	}
	return true;
};

/**
Checks and/or converts ids to mongo ids for lookup in collections
@toc 1.
@method makeIds
@param {Object} params - NOTE: one of id or ids is required
	@param {String} [id] The id to ensure is in mongo id format (otherwise it will be converted appropriately)
	@param {Array} [ids] Ids to check/convert into mongo id format
@return {Mixed} Returns same exact format as was passed in; i.e. array of ids OR id but NOW converted/ensured to be in mongo id format for collection lookup
*/
MongoDB.prototype.makeIds =function(params) {
	if(params.ids !==undefined) {
		//if(typeof(params.ids[0]) =='string' && self.validIdCheck(params.ids[0], {})) {		//convert to object ids
		if(1) {
			for(var ii=0; ii<params.ids.length; ii++) {
				if(params.ids[ii].length >0 && typeof(params.ids[ii]) =='string' && self.validIdCheck(params.ids[ii], {})) {
					params.ids[ii] =mongodb.ObjectID(params.ids[ii]);
				}
			}
		}
		return params.ids;
	}
	else if(params.id !==undefined) {
		if(params.id.length >0 && typeof(params.id) =='string' && self.validIdCheck(params.id, {})) {		//convert to object ids
			params.id =mongodb.ObjectID(params.id);
		}
		return params.id;
	}
};

/**
@toc 3.
@method idsToString
@param {Object} params - NOTE: one of id or ids is required
	@param {String} [id] The id to ensure is in string format (otherwise it will be converted appropriately)
	@param {Array} [ids] Ids to check/convert into string format
@return {Mixed} Returns same exact format as was passed in; i.e. array of ids OR id but NOW converted/ensured to be in string format
*/
MongoDB.prototype.idsToString =function(params) {
	if(params.ids !==undefined) {
		//if(typeof(params.ids[0]) !='string' && params.ids[0].toStr !=undefined) {		//convert to object ids
		if(1) {
			for(var ii=0; ii<params.ids.length; ii++) {
				if(typeof(params.ids[ii]) !='string') {
					if(params.ids[ii].str !==undefined) {
						params.ids[ii] =params.ids[ii].str;
					}
					else if(params.ids[ii].toString() !==undefined) {
						params.ids[ii] =params.ids[ii].toString();
					}
				}
			}
		}
		return params.ids;
	}
	else if(params.id !==undefined) {
		if(typeof(params.id) !='string') {		//convert to object ids
			if(params.id.str !==undefined) {
				params.id =params.id.str;
			}
			else if(params.id.toString() !==undefined) {
				params.id =params.id.toString();
			}
		}
		return params.id;
	}
};

/**
Loops through a set of keys to check and makes sure any _id fields are object id's
@toc 4.
@method objectIdSubArray
@param {Object} obj Object to check sub-arrays of
@param {Array} checkKeys array of which keys to check, i.e. ['site', 'training', 'course']
@param {Object} params
@return {Object} obj Same object as passed in, but now with all _id fields converted to object id's
*/
MongoDB.prototype.objectIdSubArray =function(obj, checkKeys, params) {
	var thisObj =this;
	for(var kk=0; kk<checkKeys.length; kk++)
	{
		if(obj[checkKeys[kk]] !==undefined && obj[checkKeys[kk]].length >0)
		{
			for(var ii=0; ii<obj[checkKeys[kk]].length; ii++)
			{
				if(obj[checkKeys[kk]][ii]._id !==undefined)
				{
					obj[checkKeys[kk]][ii]._id =thisObj.makeIds({'id':obj[checkKeys[kk]][ii]._id});
				}
			}
		}
	}
	return obj;
};

module.exports = new MongoDB({});