/**

@toc


@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
	@param {Function} login Function to call to log in user
	@param {Function} forgotPass Function to call to reset user's password

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'


@usage
partial / html:
<div app-login forgot-pass='forgotPass' login='login'></div>

controller / js:

//end: EXAMPLE usage
*/

'use strict';

angular.module('app').directive('appLogin', ['appConfig', function (appConfig) {
  return {
		restrict: 'A',
		scope: {
			forgotPass:'&',
			login:'&',
		},

		// replace: true,
		template: function(element, attrs) {
			var html ="<div class='login-form center center-margin'>"+
				"<form class='jrg-forminput-form' name='loginForm' ng-submit='submitForm()'>"+
					"<div jrg-forminput type='email' placeholder='Email' ng-model='formVals.email' opts='' required></div>"+
					"<div ng-hide='forgotPassVisible'>"+
						"<div jrg-forminput type='password' placeholder='Password' ng-model='formVals.password' opts='' required ng-minlength='6'></div>"+
					"</div>"+
					
					"<div class='clearfix' ng-hide='forgotPassVisible'>"+
						"<div class='login-form-forgot-pass btn-link' ng-click='toggleForgotPass({})'>Forgot Password</div>"+
						"<button class='btn btn-primary login-form-button-right jrg-forminput-submit' type='submit' >Login</button>"+
					"</div>"+
					"<div class='clearfix' ng-show='forgotPassVisible'>"+
						"<div class='login-form-forgot-pass btn-link' ng-click='toggleForgotPass({})'>Back to Login</div>"+
						"<div class='jrg-forminput-submit btn btn-primary login-form-button-right' ng-click='forgotPassDtv({})' >Remind Me!</div>"+
					"</div>"+
					
					"<div app-social-auth-btn button-text='Login'></div>"+
					
				"</form>"+

			"</div>"+
			
			"<div class='center margin-tb'><span>Don't have an account with {{appTitle}}?</span> <a class='btn-link' ng-href='{{appPathLink}}signup'>Sign Up</a></div>";
			return html;
		},
		
		controller: function($scope, $element, $attrs) {
			$scope.appTitle =appConfig.info.appTitle;
			$scope.appPathLink =appConfig.dirPaths.appPathLink;
			
			$scope.formVals = {};

			/**
			@method $scope.submitForm
			*/
			$scope.submitForm =function() {
				if($scope.loginForm.$valid) {
					$scope.$emit('evtAppalertAlert', {close:true});		//clear existing messages
					
					if($scope.login !==undefined && $scope.login() !==undefined && typeof($scope.login()) =='function') {		//ensure it exists
						var ppSend ={
							vals: $scope.formVals
						};
						$scope.login()(ppSend, function() {
						});
					}
				}
			};
			
			/**
			@property $scope.forgotPassVisible
			@type Boolean
			*/
			$scope.forgotPassVisible =false;
			
			/**
			@method $scope.forgotPassDtv
			*/
			$scope.forgotPassDtv =function(params) {
				$scope.forgotPassVisible =true;
				//if($scope.loginForm.email.$valid) {		//doesn't work with new form directive..
				if($scope.formVals.email !==undefined && $scope.formVals.email.length >1) {
					if($scope.forgotPass !==undefined && $scope.forgotPass() !==undefined && typeof($scope.forgotPass()) =='function') {		//ensure it exists
						var ppSend ={
							email: $scope.formVals.email
						};
						$scope.forgotPass()(ppSend, function() {
						});
					}
				}
				else {
					$scope.$emit('evtAppalertAlert', {type:'error', msg:'Enter your email above to reset your password'});
				}
			};
			
			/**
			@method $scope.toggleForgotPass
			*/
			$scope.toggleForgotPass =function(params) {
				if($scope.forgotPassVisible) {
					$scope.$emit('evtAppalertAlert', {close:true});		//clear existing messages
				}
				$scope.forgotPassVisible =!$scope.forgotPassVisible;
			};
		}
	};
}]);