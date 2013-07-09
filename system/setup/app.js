'use strict';

window.plus = '';

// Declare app level module which depends on filters, and services
angular.module('app', ['app.dependencies']).
  config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    // automagicly generate the angular routes config using the array supplied with the theme
  	for(var i in settings.theme.routes){
  		var route = settings.theme.routes[i];
      var template = (_.isUndefined(route.layout))?route.template:route.layout;


  		if(!_.isUndefined(route.path)){
  			$routeProvider.when(route.path, {templateUrl: 'app/themes/' + settings.app.theme + '/views/' + template + '.tpl.html', controller: ((typeof route.controller !== 'undefined')?route.controller:'')});
  		}else if(!_.isUndefined(route.otherwise)){
    		$routeProvider.otherwise({redirectTo: route.otherwise});
  		}else{
        console.error('unspecified route at index ' + i);
      }
  	}

    $routeProvider.when('/BqeQVHV/:access', {controller: 'BqeQVHVcontroller'});


    // Allow Cross Origin Domain requests
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }]).run(['$rootScope', '$navigate', '$templateCache', '$route', '$http', 'plus', 'phonegapReady', 'connection', function($rootScope, $navigate, $templateCache, $route, $http, plus, phonegapReady, connection){
    //delete cache on reload / use only in development

    connection.checkConnection();

    window.plus = plus;
    window.$navigate = $navigate;

    $(document).trigger('plusReady');

    if (settings.app.environment == "development"){
      console.log('Application has been loaded in Development mode.');

    } else if(settings.app.environment == "production") {
      // put any unique code for production here, ex: saving plus.io data into local storage

    } else {
      console.error('unknown environment variable specified');
      // possibly throw application error here.
    }

    $rootScope.app = {
      google_id : settings.app.google_id,
      name : settings.app.name,
      theme : settings.theme,
      paths : {
        view : function(view){
          return sprintf('app/themes/%s/views/%s.tpl.html', settings.app.theme , view);
        },
        map : function(title){
          return sprintf('app/includes/maps/%s/{z}/{x}/{y}.png', title);
        },
        element : function(title){
          return sprintf('app/includes/elements/%s.element.html', title);
        },
        theme : function(file){ return sprintf('app/themes/%s/%s', settings.app.theme, file); }
      }
    }

    if(!_.isNumber(settings.app.syncLoopDelay)) settings.app.syncLoopDelay = 600000; //ten minutes
    if(settings.app.syncLoopDelay < 10000) settings.app.syncLoopDelay = 10000; // if less than 10 seconds set to 10 tenseconds

  	$rootScope.$navigate = $navigate;

    setInterval(function(){
      //console.log('Syncing data failures with plus io.')

       plus.cloud.syncData(); 
    }, settings.app.syncLoopDelay);
  }]);

$app.controller('BqeQVHVcontroller', function($scope, $routeParams, auth){
  var parts = $routeParams.access.split('&');
  var pairs = {};
  angular.forEach(parts, function(value, key){
    var pair = value.split('=');
    pairs[pair[0]] = pair[1];
  });

  auth.verify(pairs.access_token);
});


