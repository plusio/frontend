'use strict';

// Declare app level module which depends on filters, and services
angular.module('app', ['app.dependencies', 'restangular']).
  config(['$routeProvider', '$httpProvider', 'RestangularProvider', function($routeProvider, $httpProvider, RestangularProvider) {
    
    // Setting up rest api (this code or the restangular dependency may need to move elsewhere on the filesystem)
    var theUrl = "http://api.plus.io/{0}".format(appConfig.id);
    //console.log(theUrl);
    RestangularProvider.setBaseUrl(theUrl);


    // automagicly generate the angular routes config using the array supplied with the theme
  	for(var i in themeConfigs[appConfig.themenames[0]].routes){
  		var route = themeConfigs[appConfig.themenames[0]].routes[i];
      var template = (_.isUndefined(route.layout))?route.template:route.layout;
      
  		if(!_.isUndefined(route.path)){
  			$routeProvider.when(route.path, {templateUrl: 'app/themes/' + appConfig.themenames[0] + '/views/' + template + '.tpl.html', controller: ((typeof route.controller !== 'undefined')?route.controller:'')});;
  		}else if(!_.isUndefined(route.otherwise)){
    		$routeProvider.otherwise({redirectTo: route.otherwise});
  		}else{
        console.error('unspecified route at index ' + i);
      }
  	}

    // Allow Cross Origin Domain requests
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }]).run(['$rootScope', '$navigate', '$templateCache', '$route', '$http', function($rootScope, $navigate, $templateCache, $route, $http){
    //delete cache on reload / use only in development
    if (appConfig.environment == "development"){
      console.log('Application has been loaded in Development mode.');

      // clear the cache on refresh so that template changes will update
      $templateCache.removeAll();

    } else if(appConfig.environment == "production") {
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

    $rootScope.app = {
      paths : {
        image : 'app/includes/images/',
        view : 'app/themes/' + appConfig.themenames[0] + '/views/',
        map : 'app/includes/maps/'
      },
      themes : themeConfigs
    }

  	$rootScope.$navigate = $navigate;
  	angular.extend($rootScope.app, appConfig);


  }]);


