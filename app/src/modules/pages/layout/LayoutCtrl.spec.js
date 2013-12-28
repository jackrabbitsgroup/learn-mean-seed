'use strict';

describe('LayoutCtrl', function(){
	var $ctrl, $scope ={}, $timeout, appAuth, $location;
	var createController;
	
	beforeEach(module('myApp'));
	
	beforeEach(inject(function(_$rootScope_, _$controller_, _$timeout_, _appAuth_, _$location_) {
		appAuth =_appAuth_;
		$location =_$location_;
		$timeout =_$timeout_;
		$scope = _$rootScope_.$new();
		createController =function() {
			return $ctrl = _$controller_('LayoutCtrl', {$scope: $scope});
		};
	}));
	
	it('should be called', function() {
		createController();
	});
	
	it('should listen for a changeLayoutEvt event', function() {
		createController();
		$scope.$emit('changeLayoutEvt', false);
		
		$scope.$emit('changeLayoutEvt', false, {});
		
		$scope.$emit('changeLayoutEvt', 'class-page', {'classLoggedIn':'class-logged-in'});
	});
	
	it('should listen for a loginEvt event', function() {
		createController();
		$scope.$emit('loginEvt', {});
		
		$scope.$emit('loginEvt', {loggedIn:true, noRedirect:true});
		
		$scope.$emit('loginEvt', {loggedIn:true, user_id:'userId', sess_id:'sessId'});
		
		$scope.$emit('loginEvt', {noRedirect:true});
		
		//should redirect if redirectUrl set
		appAuth.data ={
			redirectUrl: 'home?yes=1'
		};
		$scope.$emit('loginEvt', {loggedIn:true});
		
		//should treat login, signup & password-reset redirect url as special
		appAuth.data ={
			redirectUrl: 'login'
		};
		$scope.$emit('loginEvt', {loggedIn:true});
		
		$location.url('signup');
		appAuth.data ={
			redirectUrl: 'password-reset'
		};
		$scope.$emit('loginEvt', {noRedirect:true});
	});
});