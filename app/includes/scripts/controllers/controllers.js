'use strict';

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


$app.controller('MapCrtl', function($scope){
  // defaulting the settings on the model on the leaflet directive
  $scope.leaflet = {
      center: { lat: 40.094882122321145, lng: -3.8232421874999996 },
      marker: { lat: 40.094882122321145, lng: -3.8232421874999996 },
      manyMarkers : {
        Madrid: {
            lat: 40.095,
            lng: -3.823,
            message: "Madrid, not draggable",
            focus: true,
            draggable: false
        },
        Madrid2: {
            lat: 60.095,
            lng: -30.823,
            message: "Drag me to your position",
            focus: true,
            draggable: true
        }
      },
      message: "Drag me to your node position",
      zoom: 3,
      maxZoom: 4,
      minZoom: 0,
      tiles : $scope.app.paths.map + "monochrome-green/{z}/{x}/{y}.png"
  };
});

$app.controller('GeoCrtl', function($scope, plus) {

  $scope.geoData = plus.getGeoBucket(); 
  
});