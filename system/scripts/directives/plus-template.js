$app.directive('plusTemplate', function(){
  return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'AEC',
    template: '<ng-include src="path" autoscroll="false"></ng-include>',
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
      }
    },
    replace: false,
    //the link method does the work of setting the directive up, things like bindings, jquery calls, etc are done in here
    link: '',
    transclude : true
  }
});