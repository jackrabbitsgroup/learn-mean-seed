/**

@toc


@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
	@param {Function} signup Function to call to sign up new user

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'


@usage
partial / html:
<div app-signup signup='signup'></div>

controller / js:

//end: EXAMPLE usage
*/

'use strict';

angular.module('app').directive('appSignup', ['appConfig', function (appConfig) {
  return {
		restrict: 'A',
		scope: {
			signup: '&'
		},

		// replace: true,
		template: function(element, attrs) {
			var html ="<div class='signup-form center center-margin'>"+
				"<form class='jrg-forminput-form' name='signupForm' ng-submit='submitForm()'>"+
					"<div jrg-forminput placeholder='Name' ng-model='formVals.name' opts='' required ng-minlength='5'></div>"+
					"<div jrg-forminput type='email' placeholder='Email' ng-model='formVals.email' opts='' required></div>"+
					"<div jrg-forminput type='password' placeholder='Password (6+ characters)' label='Password' ng-model='formVals.password' opts='' required ng-minlength='6'></div>"+
					"<div jrg-forminput type='password' placeholder='Password Again' ng-model='formVals.password_confirm' opts='' required></div>"+
					
					"<button class='btn btn-primary jrg-forminput-submit' type='submit' >Sign Up</button>"+
				"</form>"+

				"<div app-social-auth-btn button-text='Sign Up'></div>"+
				
			"</div>"+
			
			"<div class='center margin-tb'>Or <a class='btn-link' ng-href='{{appPathLink}}login'>Login</a></div>";
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
				if($scope.signupForm.$valid) {
					if($scope.formVals.password_confirm !=$scope.formVals.password) {
						$scope.$emit('evtAppalertAlert', {type:'error', msg:'Passwords must match'});
					}
					else if($scope.formVals.name.indexOf(' ') <0) {
						$scope.$emit('evtAppalertAlert', {type:'error', msg:'Must enter a first and last name'});
					}
					else {
						var valid =true;
						$scope.$emit('evtAppalertAlert', {close:true});		//clear existing messages

						var vals ={
							email: $scope.formVals.email,
							password: $scope.formVals.password,
							password_confirm: $scope.formVals.password_confirm
						};
						//break into first & last name
						var minNameLength =2;
						//this isn't good enough since could have more than one space
						// var name =$scope.formVals.name.split(' ');
						// vals.first_name =name[0];
						// vals.last_name =name[1];
						
						var posSpace =$scope.formVals.name.indexOf(' ');		//we already know it has to have at least one space to get this far so don't have to check again here
						//put everything after first space as last name and remove leading and trailing whitespace from both first and last names
						vals.first_name =$scope.formVals.name.slice(0, posSpace).trim();
						vals.last_name =$scope.formVals.name.slice((posSpace+1), $scope.formVals.name.length).trim();
						
						if(vals.first_name.length <minNameLength || vals.last_name.length <minNameLength) {
							$scope.$emit('evtAppalertAlert', {type:'error', msg:'Must enter a first and last name of at least '+minNameLength+' characters each'});
							valid =false;
						}
						
						if($scope.formVals.phone_number) {
							vals.phone ={
								area_code: '',
								number: $scope.formVals.phone_number,
								confirmed: 0,
								primary: 1
							};
						}
						
						if(valid) {
							if($scope.signup !==undefined && $scope.signup() !==undefined && typeof($scope.signup()) =='function') {		//ensure it exists
								var params ={
									vals: vals
								};
								$scope.signup()(params, function() {
								});
							}
						}
					}
				}
			};
		}
	};
}]);