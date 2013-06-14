/* Directives */
/*
  The purpose of directives is essentially teach html "new tricks". 
  Most jquery style effects, DOM manipulation, any interactions with js plugins on html belongs in this file.
  Attempting other approaches will often be unnecessarily frustrating otherwise.
  For further help on directives take a long at these articles:
  1) http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html#directives
  2) http://blog.artlogic.com/2013/03/06/angularjs-for-jquery-developers/
*/

/*
  This is a data bound menu that automatically reads from the routes from the application selected theme creates a navigation menu.
*/

$app.directive('plusMenu', function(){
  return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'AEC',
    //the template (html content) for the directive.
    template: '<ul class="nav"><li class="{{route.class}}" ng-repeat="route in routes"><a hm-tap="$navigate.go(route.path, \'none\')">{{ route.title }}</a></li></ul>',
    //the controller for the directive
    controller: function($scope, $location) {
      var routes = settings.theme.routes;
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