'use strict';

/* Plus IO Services */

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : 'undefined'//match
      ;
    });
  };
}

var serviceDataPullFn = function($http, $q, theUrl, params){
   $http.defaults.useXDomain = true
   
   //create our deferred object.
   var deferred = $q.defer();

   //make the call.
   $http({method: "jsonp", url: theUrl, cache:true}).success(function(data) {
      //when data is returned resolve the deferment.
     deferred.resolve(data);

     //store data in localstorage using the passed in parameter as the key
     //console.log('deferred data is now stored in localStorage with this data:', data);
     //localStorage.setItem(params, JSON.stringify(data));
   }).error(function(err){
      console.log('an error has occurred while getting data.', err);

      //or reject it if there's a problem.
      deferred.reject();
   });

   //return the promise that work will be done (kinda like a data-IOU)
   return deferred.promise;
};
var serviceDataSendFn = function($http, $q, theUrl, params){
   $http.defaults.useXDomain = true;   

   //create our deferred object.
   var deferred = $q.defer();

   //make the call.
   $http.post(theUrl, params).success(function(data) {
     //when data is returned resolve the deferment.
     deferred.resolve(data);

   }).error(function(){
      //or reject it if there's a problem.
      console.log('an error occurred during save');

      //or reject it if there's a problem.
      deferred.reject();
   });

   //return the promise that work will be done (kinda like a data-IOU)
   return deferred.promise;
};
var serviceDeleteFn = function($http, $q, theUrl, params){
   $http.defaults.useXDomain = true;   

   //create our deferred object.
   var deferred = $q.defer();

   //make the call.
   $http({method: "delete", url: theUrl}).success(function(data) {     
     //when data is returned resolve the deferment.
     deferred.resolve(data);
   }).error(function(){
      //or reject it if there's a problem.
      console.log('an error occurred during delete');

      //or reject it if there's a problem.
      deferred.reject();
   });


   //return the promise that work will be done (kinda like a data-IOU)
   return deferred.promise;
};


/* Currently we're experiencing some issues with CORS on App Engine but only for browsers. You must disable web security within chrome for these methods to work.
 * 1. Disable xss protection in chrome (allows running angularjs app in file view w/o running server).
 *   OSX Terminal Command: open -a Google\ Chrome --args --disable-web-security
 */


// Gotten from: http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
// plus data service
$app.factory('plus', function($http, $q, $rootScope) { 
   var theUrl = settings.app.server_url;
   return {
             collection: function(syncKey) {
                // // Check localstorage first before doing REST call
                var data = localStorage.getItem(syncKey);
                if (data != undefined && data != "") { 
                  return angular.fromJson(data); 
                }
                else {
                  // No data found, so do REST call and then store data in local storage for later.
                   var updatedUrl = syncKey + "?callback=JSON_CALLBACK";
                   //console.log('url used to list data:', theUrl + updatedUrl);
                   return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey);
               }
             },    
             get: function(syncKey, id) {
                // Check localstorage first before doing REST call
                var data = localStorage.getItem(syncKey + "_" + id);
                if (data != undefined && data != "") { 
                  return angular.fromJson(data); 
                }
                else {
                  // No data found, so do REST call and then store data in local storage for later.
                   var updatedUrl = syncKey + "/" + id + "?callback=JSON_CALLBACK";
                   //console.log('url used to single record:', theUrl);
                   return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey + "_" + id);
                }
             },                         
             // query: function(syncKey, data) {
             //     var updatedUrl = "?callback=JSON_CALLBACK".format(syncKey, angular.toJson(data));
             //     return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             // }, 
             add: function(syncKey, data){
                var content = {content: _.omit(data, ['id'])};
                return serviceDataSendFn($http, $q, theUrl + syncKey + "/", angular.toJson(content));
            },
             update: function (syncKey, id, data){
               var content = _.omit(data, ['id']);
               return serviceDataSendFn($http, $q, theUrl + syncKey + "/" + id + "/",  angular.toJson(content));
             },
             delete: function (syncKey, id){
                console.log(theUrl + syncKey + "/" + id + "/");
                return serviceDeleteFn($http, $q, theUrl + syncKey + "/" + id + "/", syncKey + "_" + id);
             }                                                                                    
   }
});