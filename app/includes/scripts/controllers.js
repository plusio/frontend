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
$app.controller('HomeCrtl', function ($scope, $timeout) {
  // defaulting the time on Angular's model variable.
  $scope.time = Date.now();

  function updateTime(){
    $timeout(function(){
      $scope.time = Date.now();
      updateTime();
    }, 1000);
  }

  updateTime();

});

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) plus: an angularjs service that is used to connect to the Plus.io REST API and get an array of geospatial json data json.
 */
$app.controller('collectionListController', function($scope, $routeParams, $http, plus) {
 // Currently no data will return unless an app id is specified in the app's config file (app/config.js).
    var collection = 'newfood2';

    plus.collection(collection).then(function(data){     
      $scope.collectionData = data;
    });

    plus.structure(collection).then(function(data){
      $scope.structure = _.difference(data[0], ['id', 'time']);
     });

    if( $routeParams.id === 'new'){
    	$scope.new = true;
    	$scope.item = {};

    }else if(Number($routeParams.id)){
    	//is a number
    	plus.get(collection, $routeParams.id).then(function(data){
          // this is necessary to set the id on the record being posted to the server
          data.id = Number($routeParams.id);
	    		$scope.item = data;
	    	});
    }else if(angular.isDefined($routeParams.id)){
    	//id is set and not valid, go back to the list
    	$scope.$navigate.go('/items', 'none');
    }

    // Evaluates whether record is new or existing and performs insert or update appropriately.
    $scope.submit = function(){
        if ($scope.new){ 
          plus.add(collection, $scope.item);
        } else { 
          plus.update(collection, $routeParams.id, $scope.item);
        }

        // go back to to list
        $scope.$navigate.back();
    }

    // Deletes existing records only.
    $scope.delete = function(){
      if(!$scope.new){
         plus.delete(collection, $routeParams.id);
      }

      // go back to to list
      $scope.$navigate.back();
    }
});

$app.controller('phonegapController', function($scope, geolocation, accelerometer, notification){
  var functions = {
    geolocation : function(){
        $scope.position = {};
        clearInterval($scope.interval);
        $scope.interval = setInterval(function(){
          geolocation.getCurrentPosition(function (position) {
              $scope.position = position;
              $scope.$apply();
          });
        }, 500);
    },
    accelerometer : function(){
      $scope.acceleration = {};
      clearInterval($scope.interval);
      $scope.interval = setInterval(function(){
        accelerometer.getCurrentAcceleration(function (acceleration) {
            $scope.acceleration = acceleration;
            $scope.$apply();
        });
      }, 500);
      
    },
    notification : function(){
      var message = 'Alert Message',
          title = 'Alert Title',
          buttonName = 'Alert Button';

      notification.alert(message, alertCallback, title, buttonName);

      function alertCallback() {
        alert('alert completed');
      }
    },
    stopInterval : function(){
      clearInterval($scope.interval);
      $scope.interval = false;
    }
  };

    angular.extend($scope, functions);
});

$app.controller('LoginController', function($scope, $routeParams, auth){

  $scope.logout = function(){
    auth.logout();
  }

  $scope.login = function(){
    auth.login();
  }

 });