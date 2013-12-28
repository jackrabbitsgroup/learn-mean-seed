/**
Wraps angular-socket-io bower component factory (apparently this is the only way to connect on multiple addresses..)
- https://github.com/btford/angular-socket-io

@class socket

@toc
*/

'use strict';

angular.module('app').
factory('appSocket', ['socketFactory', 'appConfig',
function(socketFactory, appConfig) {
var inst ={

	inited: false,
	
	sockets: {
	},
	
	/**
	@toc 1.
	@method init
	*/
	init: function(params) {
		if(!this.inited) {
			this.inited=true;	//set for next time
			this.sockets ={
				test: socketFactory({
					ioSocket: io.connect(appConfig.dirPaths.serverPath+'test')
				})
			};
		}
	}

};
inst.init({});
return inst;
}]);