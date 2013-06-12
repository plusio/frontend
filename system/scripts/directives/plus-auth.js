$app.directive('loggedIn', function () {
    return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'AE',
    //the controller for the directive
    controller: function($scope, auth) {
      $scope.user = auth.get();


      $scope.$on('authUpdated', function(event, data){
        $scope.user = auth.get();

        if(!$scope.$$phase){
          $scope.$apply();
        }
      });
    },
    link : function(scope, element){
        scope.$watch('user', function(newVal){
            if(newVal.loggedIn){
                element.show();
            }else{
                element.hide();
            }
        });

    }
  }
});

$app.directive('loggedOut', function () {
    return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'AE',
    //the controller for the directive
    controller: function($scope, auth) {
      $scope.user = auth.get();


      $scope.$on('authUpdated', function(event, data){
        $scope.user = auth.get();

        if(!$scope.$$phase){
          $scope.$apply();
        }
      });
    },
    link : function(scope, element){
        scope.$watch('user', function(newVal){
            if(!newVal.loggedIn){
                element.show();
            }else{
                element.hide();
            }
        });

    }
  }
});