/**
NOTE: this expects / depends on angular-socket-io mock file to be included for the tests
*/

'use strict';

describe('SocketioCtrl', function(){
	var $ctrl, $scope ={}, mockIoSocket, socket, $timeout, appSocket;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _socketFactory_, _$timeout_, _appSocket_) {
		appSocket =_appSocket_;
		$timeout =_$timeout_;
		$scope = _$rootScope_.$new();
		$ctrl = _$controller_('SocketioCtrl', {$scope: $scope});
		/*
		mockIoSocket =io.connect();
		socket =_socketFactory_({
			ioSocket: mockIoSocket
		});
		*/
		socket =appSocket.sockets.test;
	}));
	
	it('should listen for connect', function() {
		socket.emit('connect', {});
		$timeout.flush();		//this actually makes the socket go
	});
	
	it('should send a message', function() {
		expect($scope.socketData.length).toBe(0);
		$scope.formVals.socketMsg ='message';
		$scope.addMessage({});
		$timeout.flush();		//this actually makes the socket go
		
		expect($scope.socketData.length).toBe(1);
	});
});