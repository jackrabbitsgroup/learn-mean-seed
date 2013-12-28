/**
@fileOverview
NOTE: this currently relies on global.cfgJson to exist and be set correctly

NOTE: make sure to include the socket.io client side script on the frontend (i.e. in index.html), i.e. (for grunt templated version)
<%
var cfgJson = grunt.config('cfgJson');
    print('\t<script type="text/javascript" src="http://'+cfgJson.server.domain+':'+cfgJson.server.socketPort+'/socket.io/socket.io.js"></script>\n');
%>

NOTE: use `socket.broadcast.emit` to send to everyone BUT the self (the incoming socket) and `socket.emit` to send to just self (the incoming socket). Use both together to send to EVERYONE (self and all others). `io.sockets.emit` will also send to EVERYONE (in just one call instead of two) BUT may not stay within namespace / `io.of` for a particular channel?
- http://stackoverflow.com/questions/7352164/update-all-clients-using-socket-io
- http://stackoverflow.com/questions/10342681/whats-the-difference-between-io-sockets-emit-and-broadcast
- http://www.scottblaine.com/using-socket-io-broadcast-one-some-sockets/


@usage (from another file)
//include realtime module
var dependency = require('../../../dependency.js');
var pathParts = dependency.buildPaths(__dirname, {});
var RealtimeMod = require(pathParts.services+'realtime/realtime.js');

//init socket
RealtimeMod.initSocket({page: '/tasks'});

//emit event
var realtimePromise = RealtimeMod.emit({page: '/tasks', trigger: 'taskUpdate'}, {data: someData});
realtimePromise.then(function(ret) {
	//do something
});

//end: usage


socket.io: http://socket.io/#how-to-use
tutorial: http://net.tutsplus.com/tutorials/javascript-ajax/real-time-chat-with-nodejs-socket-io-and-expressjs/

@module realtime
@class realtime

@toc
public methods
1. init
	1.1. io.of('/test'..
	1.2. io.on('connection', ...
2. testTriggerEvent
3. emit
4. initSocket

@dependency
- global.cfgJson variable that has the config
*/

'use strict';

var cfg =global.cfgJson;

var io =require('socket.io').listen(cfg.server.socketPort);		// for npm, otherwise use require('./path/to/socket.io')
var Q = require('q');

var dependency =require('../../../dependency.js');
var pathParts =dependency.buildPaths(__dirname, {});

var self;
var db;
var socketMap = {};		//Map to keep track of page-specific sockets (lazy instantiation).

/**
@param {Object} opts
*/
function Realtime(opts) {
	self =this;
}

/**
@toc 1.
@param {Object} opts
	@param {Object} db
*/
Realtime.prototype.init =function(opts) {
	db =opts.db;

	/**
	@toc 1.1.
	*/
	io.of('/test').on('connection', function(socket) {
		console.log("socket connected on '/test' channel");
		socket.emit('connect', { });
		
		socket.on('doStuff', function (data) {
			console.log('doStuff..');
			var ret ={'msg':'', 'valid':1, data: data, dataStringify: 'You sent: '+JSON.stringify(data)};
			socket.broadcast.emit('doStuff', ret);		//emit to everyone else
			socket.emit('doStuff', ret);		//emit to self
			
			self.testTriggerEvent(db, {socket: socket}, {});
		});
	});

	console.log('Realtime inited');
};

/*
Initializes/Gets the socket
@toc 4.
@method initSocket
@param {Object} params
	@param {String} page
 */
Realtime.prototype.initSocket = function(params) {
	var deferred = Q.defer();
	var page = params.page;
	
	if(socketMap[page]) {
		setTimeout(function() {
			deferred.resolve(socketMap[page]);
		}, 0);
	} else {
		io.of(page).on('connection', function(socket) {
			socketMap[page] = socket;
			deferred.resolve(socket);
		});
	}
	return deferred.promise;
};

/**
This will cause an event to be emitted from the backend WITHOUT the frontend initiating anything
@toc 2.
@method testTriggerEvent
@param {Object} data
	@param {Object} socket
@param {Object} params
*/
Realtime.prototype.testTriggerEvent =function(db, data, params) {
	console.log('testTriggerEvent');
	var socket =data.socket;
	// io.of('/test').on('connection', function(socket) {
		// socket.emit('connect: test', { });
		
		var dataToSend ={
			var1: 'yes'
		};
		socket.emit('backendUpdate', dataToSend);
	// });
};

/*
@toc 3.
@method emit
@param {Object} params
	@param {String} page
	@param {String} trigger
@param {Object} data
@returns {Promise}
 */
Realtime.prototype.emit = function(params, data) {
	var deferred = Q.defer();
	var promise = self.initSocket({page: params.page});
	promise.then(function(socket) {
		socket.emit(params.trigger, data);
		deferred.resolve({});
	});
	return deferred.promise;
};

module.exports = new Realtime({});