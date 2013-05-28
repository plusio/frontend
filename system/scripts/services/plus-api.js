'use strict';

/* Plus IO Services */


// Demonstrate how to register services
// In this case it is a simple value service.
$app.value('version', '0.1');

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
   $http({method: "jsonp", url: theUrl}).success(function(data) {
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
var serviceDataSendFn = function($http, theUrl, params){
   $http.defaults.useXDomain = true   

   //make the call.
   //console.log('data about to be sent:', params);
   $http.post(theUrl, params).success(function(data) {
     var item = localStorage.getItem(params);
     // delete item if exists
     if (item != undefined || item == "" ){ localStorage.removeItem(params); }
     
     // store item in local storage
     localStorage.setItem(params, JSON.stringify(data));
   }).error(function(){
      //or reject it if there's a problem.
      console.log('an error occurred during save');
   });
};
var serviceDeleteFn = function($http, theUrl, params){
   $http.defaults.useXDomain = true   

   //delete item if exists
   // if (item != undefined || item == "" ){ 
   //    localStorage.removeItem(params);  
   //    console.log('Record deleted from localstorage', params)
   // }

   //make the call.
   $http({method: "delete", url: theUrl}).success(function(data) {     
      console.log('Record Deleted from server', params);
   }).error(function(){
      //or reject it if there's a problem.
      console.log('an error occurred during save');
   });
};


/* Currently we're experiencing some issues with CORS on App Engine but only for browsers. You must disable web security within chrome for these methods to work.
 * 1. Disable xss protection in chrome (allows running angularjs app in file view w/o running server).
 *   OSX Terminal Command: open -a Google\ Chrome --args --disable-web-security
 */


// Gotten from: http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
// plus data service
$app.factory('plus', function($http, $q, $rootScope) { 
   var theUrl = "http://openplusapp.appspot.com/collection/";
   return {
             getList: function(syncKey) {
                // // Check localstorage first before doing REST call
                var data = localStorage.getItem(syncKey);
                if (data != undefined && data != "") { 
                  return JSON.parse(data); 
                }
                else {
                  // No data found, so do REST call and then store data in local storage for later.
                   var updatedUrl = syncKey + "/?callback=JSON_CALLBACK";
                   //console.log('url used to list data:', theUrl + updatedUrl);
                   return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey);
               }
             },    
             getSingle: function(syncKey, id) {
                // Check localstorage first before doing REST call
                var data = localStorage.getItem(syncKey + "_" + id);
                if (data != undefined && data != "") { 
                  return JSON.parse(data); 
                }
                else {
                  // No data found, so do REST call and then store data in local storage for later.
                   var updatedUrl = syncKey + "/" + id + "/?callback=JSON_CALLBACK";
                   //console.log('url used to single record:', theUrl);
                   return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey + "_" + id);
                }
             },                         
             // query: function(syncKey, data) {
             //     var updatedUrl = "/?callback=JSON_CALLBACK".format(syncKey, angular.toJson(data));
             //     return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             // }, 
             add: function(syncKey, data){
                var content = {content: data};
                return serviceDataSendFn($http, theUrl + syncKey + "/", angular.toJson(content));
            },
             update: function (syncKey, id, data){
               return serviceDataSendFn($http, theUrl + syncKey + "/" + id + "/",  angular.toJson(data));
             },
             delete: function (syncKey, id){
                console.log(theUrl + syncKey + "/" + id + "/");
                return serviceDeleteFn($http, theUrl + syncKey + "/" + id + "/", syncKey + "_" + id);
             }                                                                                    
   }
});

// socket service
$app.factory('socket', function($rootScope) {
  var socket = io.connect('http://localhost:1337/'); // server needs to be moved to a proper config property.
  return {
    on: function(eventName, callback) {
      console.log('Glass Event received: ', eventName, callback);

      socket.on(eventName, function() {
        var args = arguments;
        //console.log(args[0].fn);
        //var x = JSON.parse(args[0]);
        $rootScope.socketEventFn = args[0].fn;
        $rootScope.$apply($rootScope.socketEventFn);

        $rootScope.$apply(function() {
          callback.apply(socket, args);
          //callback.apply(args[0].fn);
        });
      });
    },
    emit: function(eventName, data, callback) {
      console.log('Mobile event emitted: ', eventName, data);

      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

// socket service
// $app.factory('sockjs', function($rootScope) {
//  var sockjs_url = 'http://localhost:9999/';
//  var sockjs = new SockJS(sockjs_url); // server needs to be moved to a proper config property.

//  return {
//    onopen: function(callback) {
//      console.log('Glass Event received: ', callback);

//      sockjs.onopen(eventName, function() {
//        console.log('on open called in service.', sockjs.protocol)
//        var args = arguments;
//        //console.log(args[0].fn);
//        //var x = JSON.parse(args[0]);
//        $rootScope.socketEventFn = args[0].fn;
//        $rootScope.$apply($rootScope.socketEventFn);

//        $rootScope.$apply(function() {
//          callback.apply(sockjs, args);
//          //callback.apply(args[0].fn);
//        });
//      });
//    },
//    onmessage: function(data, callback) {
//      console.log('Mobile event emitted: ', data);

//      sockjs.onmessage(data, function() {
//        var args = arguments;
//        $rootScope.$apply(function() {
//          if(callback) {
//            callback.apply(sockjs, args);
//          }
//        });
//      });
//    },
//    onclose: function(data, callback){
//      sockjs.onclose(data, function(){
//        alert('closed');
//      })
//    }
//  };
// });