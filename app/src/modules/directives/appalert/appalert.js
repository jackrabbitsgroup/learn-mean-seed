/**
Wrapper for angular-ui-bootstrap alert directive that makes a position fixed alert at the top of the page and handles a fade close of the alert

Display an alert by broadcasting/emitting an event called 'evtAppalertAlert' with options as defined below on the $rootScope.$on('evtAppalertAlert',..

//TOC


scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html)

attrs


EXAMPLE usage:
partial / html:
<div app-appalert></div>

controller / js:
//NOTE: $scope.$emit can likely be used in place of $rootScope.$broadcast
//display a success alert
$rootScope.$broadcast('evtAppalertAlert', {type:'success', msg:'Success!'});

//display an error alert
$scope.$emit('evtAppalertAlert', {type:'error', msg:'Error!'});

//close the alert
$rootScope.$broadcast('evtAppalertAlert', {close:true});

//end: EXAMPLE usage
*/

'use strict';

angular.module('app').directive('appAppalert', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
  return {
		restrict: 'A',
		//transclude: true,
		scope: {
		},

		template: "<div class='app-appalert {{alert.classes}}'>"+
			"<alert type='alert.type' close='closeAlert({})'>{{alert.msg}}</alert>"+
		"</div>",
		
		controller: function($scope, $element, $attrs) {
			/**
			App wide position fixed notification / alert display
			@property $scope.alert
			@type {Object}
				@param {String} type Alert type - one of: 'success' (green colored), 'error' (red), 'info' (blue), or blank '' for the default yellow color
				@param {String} msg Text to display in alert
				@param {Boolean} hidden True to hide alert
			*/
			$scope.alert ={
				type: '',
				msg: 'msg here!',
				classes: 'hidden'
			};
			/**
			Timeout variable for being able to cancel timeouts in case show new alert before old one is done hiding
			@property {Object} timeoutAlert
				@param {Mixed} hiding
				@param {Mixed} hidden
			*/
			var timeoutAlert ={
				hiding: false,
				hidden: false
			};
			
			/**
			Closes (hides) the app wide alert bar
			@method $scope.closeAlert
			@param {Object} [opts]
			*/
			$scope.closeAlert =function(opts) {
				closeAlert({});
			};
			
			/**
			@method closeAlert
			*/
			function closeAlert(opts) {
				resetAlert({});
				hideAlert({noAnimate: true});
			}
			
			/**
			@method hideAlert
			@param {Object} [opts ={}]
				@param {Boolean} noAnimate True to immediately close
				@param {Number} [delay=2000] How many milliseconds to wait before auto closing the alert
			*/
			function hideAlert(opts) {
				var hidingTime =1250;		//hardcoded should match (or just be around .25s under) what's set in fade transition css in appalert.less on .app-appalert class
				var defaults ={
					delay: 2000
				};
				opts =angular.extend(defaults, opts);
				
				if(opts.noAnimate) {		//close immediately
					$scope.alert.classes ='hidden';
				}
				else {
					//use timeouts to start animation hiding
					timeoutAlert.hiding =$timeout(function() {
						$scope.alert.classes ='hiding';
						timeoutAlert.hidden =$timeout(function() {
							$scope.alert.classes ='hidden';
						}, hidingTime);
					}, opts.delay);
				}
			}
			
			/**
			@method resetAlert
			*/
			function resetAlert(opts) {
				$timeout.cancel(timeoutAlert.hiding);
				$timeout.cancel(timeoutAlert.hidden);
			}
			
			/**
			@method showAlert
			@param {Object} opts
				@param {Number} [delay=2000] How many milliseconds to wait before auto closing the alert
			*/
			function showAlert(opts) {
				resetAlert({});
				$scope.alert.classes ='';
				hideAlert(opts);
			}
			
			/**
			@method $scope.$on('evtAppalertAlert',..
			@param {Object} opts
				@param {String} [type =''] Alert type - one of: 'success' (green colored), 'error' (red), 'info' (blue), or blank '' for the default yellow color
				@param {Boolean} [close =false] True to close the alert rather than display it
				@param {String} msg String of what to display in the alert
				@param {Number} [delay=2000] How many milliseconds to wait before auto closing the alert
			*/
			$rootScope.$on('evtAppalertAlert', function(evt, opts) {
				if(opts.close || !opts.msg) {		//close alert
					closeAlert({});
				}
				else {		//set type, message and show alert
					$scope.alert.type =opts.type || '';
					$scope.alert.msg =opts.msg;
					showAlert(opts);
				}
			});
		}
	};
}]);