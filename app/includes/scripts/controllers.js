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
$app.controller('HomeCrtl', function ($scope, $routeParams) {
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
      zoom: 3,
      maxZoom: 4,
      tiles : $scope.app.paths.map + "monochrome-green/{z}/{x}/{y}.png"
  };

  // Check if the application had an id set.
  if(!_.isEmpty($scope.app.id)){
    // if there is, get data from plus.io
    $scope.geoData = plus.getGeoBucket(); 

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

  // Watch the geoData object on $scope, so that if it pulls data,
  // it will update the list of markers for leaflet and display the updated results
  $scope.$watch('geoData', function(data){
    if(angular.isDefined(data)){
      angular.forEach(data, function(item){
        $scope.leaflet.markers[item.Key] = {
          lat : item.Latitude,
          lng : item.Longitude,
          message : item.Tag,
          draggable : true
        }
      });
    }
  });
});

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) plus: an angularjs service that is used to connect to the Plus.io REST API and get an array of geospatial json data json.
 */
$app.controller('collectionListController', function($scope, $routeParams, $http, plus) {
 // binds data to the geoData "model" on $scope. The two-way data binding will automatically cause the view (html/css) to be updated once the data returns.
 // Currently no data will return unless an app id is specified in the app's config file (app/config.js).
  	var collection = 'food';
    plus.collection(collection).then(function(data){
    	$scope.collectionData = data;
    });
 
    $.ajax({
		dataType: "jsonp",
		url: sprintf('http://openplusapp.appspot.com/structure/%s/', collection),
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

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) plus: an angularjs service that is used to connect to the Plus.io REST API and get an array of json data.
 */
$app.controller('ListItemController', function($scope, $routeParams, $location, plus) {
    // binds data to the list's "model" on $scope. The two-way data binding will automatically cause the view (html/css) to be updated once the data returns.
    // Currently no data will return unless an app id is specified in the app's config file (app/config.js).

    $scope.listItem = {};

    // Will update once this REST API method is completed.
    var newFoodItem = !(Number($routeParams.id));
    if (newFoodItem == false){
      $scope.listItem = plus.getSingle("food", $routeParams.id);
    }

    // Evaluates whether record is new or existing and performs insert or update appropriately.
    $scope.Save = function(){
        if (newFoodItem){
          plus.add("food", $scope.listItem);
        }
        else {
          plus.update("food", $routeParams.id, $scope.listItem);
        }

        // go back to to list
        $scope.RedirectToList();
    };

    // Deletes existing records only.
    $scope.Delete = function(){
      if(newFoodItem == false){
         plus.delete("food", $routeParams.id);
      }

      // go back to to list
      $scope.RedirectToList();
    };
    $scope.RedirectToList = function(){
      $location.path("/list");
    };
});


$app.controller('phonegapController', function($scope, geolocation, accelerometer, notification){
  var functions = {
    geolocation : function(){
      geolocation.getCurrentPosition(function (position) {
        alert('Latitude: '              + position.coords.latitude          + '\n' +
              'Longitude: '             + position.coords.longitude         + '\n' +
              'Altitude: '              + position.coords.altitude          + '\n' +
              'Accuracy: '              + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: '     + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '               + position.coords.heading           + '\n' +
              'Speed: '                 + position.coords.speed             + '\n' +
              'Timestamp: '             + position.timestamp                + '\n');
      });
    },
    accelerometer : function(){
      accelerometer.getCurrentAcceleration(function (acceleration) {
        alert(acceleration);
      });
    },
    notification : function(){
      var message = 'Alert Message',
          title = 'Alert Title',
          buttonName = 'Alert Button';
      notification.alert(message, alertCallback, title, buttonName);

      function alertCallback() {
        alert('alert completed');
      }
    }
  }


  angular.extend($scope, functions);
});