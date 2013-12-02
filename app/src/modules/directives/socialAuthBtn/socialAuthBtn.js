/**
NOTE: this directive has http (backend) calls in it! In general this is bad practice but it makes things simpler since most of it is backend calls.

@toc


@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
	@param {String} [buttonText ='Login'] The text to put in both buttons


@usage
partial / html:
<div app-social-auth-btn button-text='Sign Up'></div>

controller / js:

//end: EXAMPLE usage
*/

'use strict';

angular.module('app').directive('appSocialAuthBtn', ['appHttp', 'UserModel', 'appConfig', '$rootScope', 'appSocialAuth',
function (appHttp, UserModel, appConfig, $rootScope, appSocialAuth) {
  return {
		restrict: 'A',
		scope: {
		},

		// replace: true,
		template: function(element, attrs) {
			var defaultAttrs ={
				buttonText: 'Login'
			};
			attrs =angular.extend(defaultAttrs, attrs);
			
			var html ="<div class='social-auth-btn-buttons center margin-t'>"+
				"<div class='social-auth-btn-button-facebook' ng-click='fbLogin()'><i class='fa fa-facebook padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>"+attrs.buttonText+"</div></div>"+
				"<div class='social-auth-btn-button-google' ng-click='googleLogin()'><i class='fa fa-google-plus padding-lr social-auth-btn-button-icon'></i><div class='social-auth-btn-button-text'>"+attrs.buttonText+"</div></div>"+
			"</div>";
			return html;
		},
		
		controller: function($scope, $element, $attrs) {
			/**
			Facebook login handling (in LoginCtrl which is PARENT of LoginFormCtrl and SignupFormCtrl so can use this function for BOTH login and sign up)
			@toc 1.
			@method $scope.fbLogin
			*/
			$scope.fbLogin =function() {
				var promise =appSocialAuth.checkAuthFacebook({});
				promise.then(function(data) {
					var vals ={
						type: 'facebook',
						user: {},
						socialData: {
							id: data.facebook_id,
							token: data.access_token
						}
					};
					if(data.email) {
						vals.user.email =data.email;
					}
					var promise1 =appHttp.go({}, {url:'auth/socialLogin', data:vals}, {}, {});
					promise1.then(function(response) {
						var user =response.result.user;
						UserModel.save(user);
						$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
					});
				}, function(data) {
					var dummy =1;
				});
			};
			
			
			/**
			Google login handling (in LoginCtrl which is PARENT of LoginFormCtrl and SignupFormCtrl so can use this function for BOTH login and sign up)
			@toc 2.
			@method $scope.googleLogin
			*/
			$scope.googleLogin =function() {
				var promise =appSocialAuth.checkAuthGoogle({});
				promise.then(function(data) {
					var vals ={
						type: 'google',
						user: {},
						socialData: {
							id: data.google_id,
							token: data.access_token
						}
					};
					if(data.email) {
						vals.user.email =data.email;
					}
					var promise1 =appHttp.go({}, {url:'auth/socialLogin', data:vals}, {}, {});
					promise1.then(function(response) {
						var user =response.result.user;
						UserModel.save(user);
						$rootScope.$broadcast('loginEvt', {'loggedIn': true, 'sess_id':user.sess_id, 'user_id':user._id});
					});
				}, function(data) {
					var dummy =1;
				});
			};
		}
	};
}]);