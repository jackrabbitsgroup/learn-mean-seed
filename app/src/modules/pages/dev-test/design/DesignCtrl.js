'use strict';

angular.module('myApp').controller('DesignCtrl', ['$scope', function($scope) {

	$scope.colors =[
		{'class':'blue'},
		{'class':'blueDark'},
		{'class':'green'},
		{'class':'red'},
		{'class':'yellow'},
		{'class':'orange'},
		{'class':'pink'},
		{'class':'purple'},
		{'class':'warningText'},
		{'class':'errorText'},
		{'class':'successText'},
		{'class':'infoText'}
	];
}]);