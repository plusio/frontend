'use strict';
/*
 * In this theme controllers file, we can create controllers as we wold normally but the view has a very specific purpose and the developer 
 * won't need to code anything for this view so we can have custom functionality packaged with the theme.
 */


/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) geolocation: The geo location service will get and return the user's current location
 * 3) $http: This is angular service to  post and get data from external sources
 */

$app.controller('mapController', function($scope, geolocation, $http){
  // defaulting the settings on the model on the leaflet directive

  // function to update Leaflet model once we have gotten the user's location.
  // This is assigned to a fuction so that we can change the message if we cannot reverse geocode the Lat/Lng
  function updateData(latlng, message){
    var newData = {
        markers : {
          currentLocation : {
            lat : latlng.lat,
            lng : latlng.lng,
            focus : true,
            message : message
          }
        },
        center : {
          lat: latlng.lat,
          lng: latlng.lng,
          zoom: 4
        }
      };

    angular.extend($scope.leaflet, newData);
  }

  //get user's position the .then() is the callback function for when the service returns data
  geolocation().then(function(data){
    var latlng = { lat : data.coords.latitude, lng : data.coords.longitude };

    //Limited to 25,000 requests a day
    $http.get(sprintf('http://maps.googleapis.com/maps/api/geocode/json?latlng=%(lat)s,%(lng)s&sensor=true', latlng)).success(function(data){
      var address = data.results[0].formatted_address;
      if(_.isEmpty(address)){
        updateData(latlng, 'You are here');
      }else{
        updateData(latlng, address);
      }
    }).error(function(error){
      updateData(latlng, 'You are here');
    });
  });

  //set Map defaults
  $scope.leaflet = {
    defaults: {
      tileLayer: $scope.app.paths.map("plusdark"),
      maxZoom: 4
    },
    center: {lat :0, lng:0},
    markers : {}
  };

});