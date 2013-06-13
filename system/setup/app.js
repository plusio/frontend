'use strict';

// Declare app level module which depends on filters, and services
angular.module('app', ['app.dependencies']).
  config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {


    // automagicly generate the angular routes config using the array supplied with the theme
  	for(var i in settings.theme.routes){
  		var route = settings.theme.routes[i];
      var template = (_.isUndefined(route.layout))?route.template:route.layout;


  		if(!_.isUndefined(route.path)){
  			$routeProvider.when(route.path, {templateUrl: 'app/themes/' + settings.app.theme + '/views/' + template + '.tpl.html', controller: ((typeof route.controller !== 'undefined')?route.controller:'')});;
  		}else if(!_.isUndefined(route.otherwise)){
    		$routeProvider.otherwise({redirectTo: route.otherwise});
  		}else{
        console.error('unspecified route at index ' + i);
      }
  	}

    // Allow Cross Origin Domain requests
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }]).run(['$rootScope', '$navigate', '$templateCache', '$route', '$http', '$timeout', 'plus', function($rootScope, $navigate, $templateCache, $route, $http, $timeout, plus){
    //delete cache on reload / use only in development
    if (settings.app.environment == "development"){
      console.log('Application has been loaded in Development mode.');

      // clear the cache on refresh so that template changes will update
      $templateCache.removeAll();

    } else if(settings.app.environment == "production") {
      // put any unique code for production here, ex: saving plus.io data into local storage

    } else {
      console.error('unknown environment variable specified');
      // possibly throw application error here.
    }

    //preload all templates and store them in cache upon first loading the application, I assume for application performance
    angular.forEach($route.routes, function(r) {
      if(_.isUndefined)
      if (r.templateUrl) { 
        $http.get(r.templateUrl, {cache: $templateCache});
      }
    });

    $rootScope.app = settings.app;

    $rootScope.app.paths = {
        image : 'app/includes/images/',
        view : 'app/themes/' + settings.app.theme + '/views/',
        map : 'app/includes/maps/'
    }

    $rootScope.app.theme = settings.theme;
  	$rootScope.$navigate = $navigate;

    setInterval(function(){
      console.log('Syncing data failures with plus io.')

       plus.syncData(); 
    }, settings.app.syncLoopDelay);
  }]);


