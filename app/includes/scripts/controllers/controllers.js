'use strict';

/* These controller functions are setup in such a way that there is 1 controller per screen/page. 
 * Their purpose is to contain all the logic for the page such as: 
 * 1) Getting, setting and saving data.
 * 2) What happens on pages events like: button clicks, dropdown selections, etc.
 *   However all visual effects, DOM manipulations, and plugins should be done using angularjs directives.
 *   If you're not sure as to what is going on in most of this file you should consider reading this article:
 *   http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html#controllers-and-scope
 */

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
    }
  }

  // Watch the geoData object on $scope, so that if it pulls data,
  // it will update the list of markers for leaflet and display teh updated results
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
 * 2) plus: an angularjs service that is used to connect to the Plus.io REST API and get an array of geospatial data json data.
 */
$app.controller('GeoCrtl', function($scope, plus) {
 // binds data to the geoData "model" on $scope. The two-way data binding will automatically cause the view (html/css) to be updated once the data returns.
 // Currently no data will return unless an app id is specified in the app's config file (app/config.js).
  $scope.geoData = plus.getGeoBucket(); 
});