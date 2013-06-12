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
$app.controller('HomeCrtl', function ($scope) {
  // defaulting the time on Angular's model variable.
  $scope.time = Date.now();

  // updating the time based on a javascript interval
  setInterval(function(){
        // this $.apply() function needs to be called on $scope because the setInterval javascript function itself 
        // is not a function that is connected to angular (literally connected, as in not a $scope.DoSomething style function()
        $scope.$apply(function() {
            $scope.time = Date.now();
        });
    }, 5000);
});



/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 */
$app.controller('MapCrtl', function($scope, plus){
  // defaulting the settings on the model on the leaflet directive
  $scope.leaflet = {
    defaults: {
          tileLayer: $scope.app.paths.map("plusdark"),
          maxZoom: 4
    },
    center: { lat: 40.094882122321145, lng: -3.8232421874999996 },
    markers : {},
    path : {
      latlngs : [
        {lat:40.719037, lng:-74.003913},
        {lat:37.775201, lng:-122.419073},
        {lat:25.788042, lng:-80.225409},
        {lat:47.60459, lng:-122.334474},
        {lat:38.89244, lng:-77.032933}
      ],
      weight: 2,
      color: '#3366FF'
    },
    maxbounds: {
      southWest : {
        lat : 0, 
        lng : 0
      },
      northEast : {
        lat : 4096,
        lng : 4096
      }
    }
  };

  // Check if the application had an id set.
  if(!_.isEmpty($scope.app.server_url)){
    // if there is, get data from plus.io
    plus.collection('geo').then(function(data){
      $scope.geoData = data;

      angular.forEach(data, function(item){
        $scope.leaflet.markers[item.id] = {
          lat : item.latitude,
          lng : item.longitude,
          message : item.tag,
          draggable : false
        }
      });
    }); 

  }else{
    // Otherise lets set two example markers so the the map isn't blank
    $scope.leaflet.markers =  {       
      NewYork: {
          lat: 40.719037,
          lng: -74.003913,
          message: "New York",
          focus: false,
          draggable: false
      },
      SanFrancisco: {
          lat:37.775201,
          lng:-122.419073,
          message: "San Francisco",
          focus: false,
          draggable: false
      },
      Miami: {
          lat:25.788042,
          lng:-80.225409,
          message: "Miami",
          focus: false,
          draggable: false
      },
      Seattle: {
          lat:47.60459,
          lng:-122.334474,
          message: "Seattle",
          focus: false,
          draggable: false
      },
      WashingtonDC: {
          lat:38.89244,
          lng:-77.032933,
          message: "Washington, DC",
          focus: true,
          draggable: false
      }
    }
  }
});

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) plus: an angularjs service that is used to connect to the Plus.io REST API and get an array of geospatial json data json.
 */
$app.controller('collectionListController', function($scope, $routeParams, $http, plus) {
 // binds data to the geoData "model" on $scope. The two-way data binding will automatically cause the view (html/css) to be updated once the data returns.
 // Currently no data will return unless an app id is specified in the app's config file (app/config.js).
  	var collection = 'food';
    $scope.collectionData = plus.collection(collection);
    $scope.element = {
      name : 'loop'
    }
 
    $.ajax({
		dataType: "jsonp",
		url: sprintf('http://openplusapp.appspot.com/structure/%s', collection),
		success: function(data){
			$scope.structure = _.difference(data[0], ['id', 'time']);
			$scope.$apply();
		}
	});

    if( $routeParams.id === 'new'){
    	$scope.new = true;
    	$scope.item = {};

    }else if(Number($routeParams.id)){
    	//is a number
    	plus.get(collection, $routeParams.id).then(function(data){
	    		$scope.item = data;
	    	});
    }else if(angular.isDefined($routeParams.id)){
    	//id is set and not valid, go back to the list
    	$scope.$navigate.go('/items', 'none');
    }

    // Evaluates whether record is new or existing and performs insert or update appropriately.
    $scope.submit = function(){
    	console.log($scope.item);
        if ($scope.new){
        	console.log(collection, $scope.item);
          plus.add(collection, $scope.item);
        } else {
        	console.log(collection, $routeParams.id, $scope.item);
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

$app.controller('LoginController', function($scope, $routeParams, auth, plus){
  //alert(auth.isLoggedIn());
  //$scope.authUrl = sprintf('https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=%(client_id)s&scope=%(scope)s&redirect_uri=%(redirect_uri)s', authParams);
  var params = {};

  $scope.user = auth.get();
  console.log(auth.isTokenValid());

  $scope.$on('authUpdated', function(event, data){
    $scope.user = auth.get();
  $scope.user.token = auth.isTokenValid();

    if(!$scope.$$phase){
      $scope.$apply();
    }
  });

  $scope.logout = function(){
    auth.logout();
  }

  $scope.authenticate = function(){
    auth.login();
  }

 });