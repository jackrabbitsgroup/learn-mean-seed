angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.alert"]);
angular.module("ui.bootstrap.tpls", ["template/alert/alert.html"]);
angular.module("ui.bootstrap.alert", []).directive('alert', function () {
  return {
    restrict:'EA',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    },
    link: function(scope, iElement, iAttrs, controller) {
      scope.closeable = "close" in iAttrs;
    }
  };
});

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache){
  $templateCache.put("template/alert/alert.html",
    "<div class='alert' ng-class='type && \"alert-\" + type'>" +
    "    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>" +
    "    <div ng-transclude></div>" +
    "</div>" +
    "");
}]);
