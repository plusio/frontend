$app.directive('tyMenu', function(){
  return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'AEC',
    //the template for the directive.
    template: '<ul class="nav"><li class="{{route.class}}" ng-repeat="route in routes"><a hg-tap="$navigate.go(route.path, \'none\')">{{ route.title }}</a></li></ul>',
    //the controller for the directive
    controller: function($scope, $location) {
      var routes = $scope.app.themes[$scope.app.themenames[0]].routes;
      $scope.routes = [];

      //check for top level routes only
      for(var i in routes){
        var route = routes[i];

        if(_.isUndefined(route.path))
          continue;

        //console.log(route.path);
        var segments = route.path.split('/');

        //if is not a top level route, continue
        if(segments.length > 2 && !_.isEmpty(segments[2]))
          continue;

        if(angular.isUndefined(route.class)) route.class = '';

        if($location.path() == route.path){
          route.class += ' active';
        }else{
          if(angular.isDefined(route.class)){
             route.class = route.class.replace(' active', '');
          }
        }

        
        $scope.routes.push(route);
      }

      $scope.$location = $location;
    },
    replace: true,
    //the link method does the work of setting the directive
    // up, things like bindings, jquery calls, etc are done in here
    link: ''
  }
});