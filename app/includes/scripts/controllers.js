'use strict';

/* These controller functions are setup in such a way that there is 1 controller per screen/page. 
 * Their purpose is to contain all the logic for the page such as: 
 * 1) Getting, setting and saving data.
 * 2) What happens on pages events like: button clicks, dropdown selections, etc.
 *   However all visual effects, DOM manipulations, and plugins should be done using angularjs directives.
 *   If you're not sure as to what is going on in most of this file you should consider reading this articles:
 *   1) http://blog.artlogic.com/2013/03/06/angularjs-for-jquery-developers/ 
 *   2) http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html#controllers-and-scope


/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 */
$app.controller('HomeCrtl', function ($scope, plus) {
  // defaulting the time on Angular's model variable.
  $scope.time = Date.now();

  setInterval(function(){
    $scope.time = new Date().getTime();
    if(!$scope.$$phase) $scope.$apply();
  }, 1000);
  
});
