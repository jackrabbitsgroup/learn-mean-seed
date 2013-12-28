/**
Keeps the footer at the bottom by using (window) resize event and setting the content element min-height to the total height minus the header and footer height

@toc
1. window.onresize
	1.1. $rootScope.$on('appLayoutResize',..
2. resize


@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
	@param {Object} ids
		@param {String} header
		@param {String} content
		@param {String} footer
	@param {Number} contentMinHeight
	@param {Object} [opts]

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'


@usage
partial / html:
<div app-layout ids='ids' content-min-height='contentMinHeight'></div>

controller / js:
$scope.ids ={
	header: 'header',
	content: 'content',
	footer: 'footer'
};

$scope.contentMinHeight =0;

//end: EXAMPLE usage
*/

'use strict';

angular.module('app').directive('appLayout', ['$rootScope', function ($rootScope) {
  return {
		restrict: 'A',
		scope: {
			ids: '=',
			contentMinHeight: '=',
			opts: '=?'
		},
		transclude: true,
		
		template: function(element, attrs) {
			var html ="<div ng-transclude>"+
			"</div>";
			return html;
		},
		
		controller: function($scope, $element, $attrs) {
			/**
			ensure footer is always below scroll line (i.e. on each resize)
			@toc 1.
			*/
			window.onresize =function() {
				resize({'otherHeightEleIds':[$scope.ids.header, $scope.ids.content, $scope.ids.footer], 'minHeightEleId':$scope.ids.content});
			};
			/*
			var evtName ="resizeFooterEvt";
			libResize.addCallback('footerResize', {'evtName':evtName, 'args':[]}, {});

			$rootScope.$on(evtName, function(evt) {
				resize({'otherHeightEleIds':[$scope.ids.header, $scope.ids.content, $scope.ids.footer], 'minHeightEleId':$scope.ids.content});
			});
			*/
			
			/**
			@toc 1.1.
			@method $rootScope.$on('appLayoutResize',..
			*/
			$rootScope.$on('appLayoutResize', function(evt, params) {
				resize({'otherHeightEleIds':[$scope.ids.header, $scope.ids.content, $scope.ids.footer], 'minHeightEleId':$scope.ids.content});
			});

			/**
			@toc 2.
			@method resize
			@param {Object} params
				@param {Array} otherHeightEleIds other ids on page that's used to figure out height / where top of footer should be
					NOTE: if footer id is removed from this list, then footer will start just below scroll line (which may be preferable in some cases, especially for taller footers)
				@param {String} minHeightEleId id of which element to set min-height to - to ensure footer is also below scroll line
			*/
			function resize(params) {
				if(document.getElementById(params.minHeightEleId)) {	//only run if page has loaded and elements exist
					var totHeight =window.innerHeight;
					var nonFooterHeight =0;
					for(var ii=0; ii<params.otherHeightEleIds.length; ii++)
					{
						var curId =params.otherHeightEleIds[ii];
						if(curId !=params.minHeightEleId && document.getElementById(curId)) {
							nonFooterHeight +=document.getElementById(curId).offsetHeight;
						}
					}
					//account for padding/margin of content element
					var ele =document.getElementById(params.minHeightEleId);
					//http://stackoverflow.com/questions/14275304/how-to-get-margin-value-of-a-div-in-original-javascript
					var style = ele.currentStyle || window.getComputedStyle(ele);
					var marginPaddingHeight =parseInt(style.marginTop,10) +parseInt(style.marginBottom,10) +parseInt(style.borderTopWidth,10) +parseInt(style.borderBottomWidth,10) +parseInt(style.paddingTop,10) +parseInt(style.paddingBottom,10);
					
					$scope.contentMinHeight =totHeight-nonFooterHeight -marginPaddingHeight;
					document.getElementById(params.minHeightEleId).style.minHeight =$scope.contentMinHeight+"px";
					$scope.$broadcast('footerResize', $scope.contentMinHeight);		//broadcast in case any children elements want to set the min-height to this as well (since height 100% isn't really working... too tall sometimes..)
				}
			}

			//init
			resize({'otherHeightEleIds':[$scope.ids.header, $scope.ids.content, $scope.ids.footer], 'minHeightEleId':$scope.ids.content});		//init min-height
		}
	};
}]);