$app.directive('plusTemplate', function(){
  return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'AEC',
    //the template for the directive.
    template: '<ng-include src="path" autoscroll="false"></ng-include>',
    //the controller for the directive
    controller: function($scope, $location) {
      var routes = settings.theme.routes;

      for(var i in routes){
        var route = routes[i];

        if(_.isUndefined(route.path))
          continue;

        var pathSegments = $location.path().split('/');
        var routeSegments = route.path.split('/');

        if(pathSegments.length !== routeSegments.length)
          continue;

        for(var i in pathSegments){
          if(_.isEmpty(pathSegments[i]) || routeSegments[i].search(':') >= 0){
            continue;
          }

          if(pathSegments[i] !== routeSegments[i]){
            continue;
          }
          $scope.path = $scope.app.paths.view(route.template);
          return true;
        };


        //console.log(route.path, $location.path(), route.path == $location.path());

        // if(route.path == $location.path()){
        //   $scope.path = $scope.app.paths.view + route.template + '.tpl.html';
        //   return true;
        // }
      }
      //console.log($location.path())
    },
    replace: false,
    //the link method does the work of setting the directive
    // up, things like bindings, jquery calls, etc are done in here
    link: '',
    transclude : true
  }
});