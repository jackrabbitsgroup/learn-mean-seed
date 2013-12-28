/*
//0. init
//0.5. destroy
//1. save
//2. load
*/

'use strict';

angular.module('models').
factory('UserModel', ['appStorage', function(appStorage){
var inst ={

	data: {},

	//0.
	init: function(params)
	{
		this.data ={'_id':false};
	},

	//0.5.
	destroy: function(params)
	{
		this.data ={};
	},

	//1.
	/*
	@param data =array of user info to update
	*/
	save: function(data, params)
	{
		this.data =angular.extend(this.data, data);
		appStorage.save('user', this.data, {});
	},

	//2.
	load: function(key, params)
	{
		if(!key || key =='all') {
			return this.data;
		}
		else {
			return this.data[key];
		}
	}

};
	inst.init();
return inst;
}]);