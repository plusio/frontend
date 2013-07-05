'use strict';

/* Variables:
 * 1) $scope: use this variable to set data in the user interface.
 * 2) plus: use this for all Plus.io provided functionality.
 */
$app.controller('HomeCrtl', function ($scope, plus) {
  // defaulting the time on Angular's model variable.
  $scope.time = Date.now();

  setInterval(function(){
  	$scope.$apply(function(){
    	$scope.time = new Date().getTime();
  	});
  }, 1000);
  
});
