/**
*/

'use strict';

angular.module('myApp').controller('SocketioCtrl', ['$scope', 'appSocket',
function($scope, appSocket) {

	$scope.socketData =[];
	
	$scope.formVals ={
	};
	
	// var serverPath = appConfig.dirPaths.serverPath+'test';
	// var socket = io.connect(serverPath);
	var socket =appSocket.sockets.test;
	
	socket.on('connect', function() {
		console.log('socket connected on channel: test');
	});
		
	/**
	@param {Object} data
		@param {Object} data The original / raw passed in data
	*/
	socket.on('doStuff', function(data) {
		console.log('socket.on event: doStuff');
		//add new data to BEGINNING of array
		$scope.socketData =[data.data].concat($scope.socketData);
	});
	
	$scope.addMessage =function(params) {
		socket.emit('doStuff', {msg: $scope.formVals.socketMsg});
		$scope.formVals.socketMsg ='';		//reset
	};
	
}]);