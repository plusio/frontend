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

var serviceDataPullFn = function($http, $q, theUrl){
   // $http.defaults.useXDomain = true
   //create our deferred object.
   var deferred = $q.defer();
   // $http.defaults.useXDomain = true;
   //make the call.
   $http.jsonp(theUrl).success(function(data) {
      //when data is returned resolve the deferment.
      deferred.resolve(data);
   }).error(function(){
      //or reject it if there's a problem.
      deferred.reject();
   });

   //return the promise that work will be done (kinda like a data-IOU)
   return deferred.promise;
};

// Gotten from: http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
// plus data service
$app.factory('plus', function($http, $q, $rootScope) { // look into whether using rootScope on a service has negative impact on performance (memory)
   // if ($rootScope.app.id == undefined){
   //      console.log('app id not loaded');
   // }

   var theUrl = "http://api.plus.io/{0}/".format($rootScope.app.id);
   return {
             getBucket: function(bucketName) {
              var updatedUrl = "GetBucket{0}?callback=JSON_CALLBACK".format(bucketName);
               console.log('url used to get bucket data:', theUrl);
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             },
             getBucketFilter: function(bucketName, filter) {
               var updatedUrl = "GetBucketFilter/{0}/{1}?callback=JSON_CALLBACK".format(bucketName, filter);
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             }, 
             getBucketItem: function(bucketName, item) {
               var updatedUrl = "GetBucketItem/{0}/{1}?callback=JSON_CALLBACK".format(bucketName, item);
               console.log(theUrl + updatedUrl);
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             },                          
             getTags: function() {
               //'http://api.plus.io/' + app_id + '/GetTags?sig='+crypt+'&callback=',
               var updatedUrl = "GetTags?callback=JSON_CALLBACK";
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             },
             getGeoBucket: function() {
               var updatedUrl = "GetGeoBucket?callback=JSON_CALLBACK";
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             }, 
             getGeoItem: function(item) {
               var updatedUrl = "GetGeoItem/{0}?callback=JSON_CALLBACK".format(item);
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             },
             getUserByEmail: function(email){
               var updatedUrl = "GetUserByEmail/{0}?callback=JSON_CALLBACK".format(email);
               console.log(theUrl + updatedUrl);
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             },
             getUserById : function(id){
               var updatedUrl = "GetUserById/{0}?callback=JSON_CALLBACK".format(id);
               console.log(theUrl + updatedUrl);
               return serviceDataPullFn($http, $q, theUrl + updatedUrl);
             },
             addGeoItem: function (tag,latitude,longitude,meta){
                $.post('http://api.plus.io/addGeoItem', {"id":app_id,"key":secret_key,"tag":tag,"long":longitude,"lat":latitude,"metadata":meta}, function(data) {});
             },
             addItem: function (bucket,content){
                $.post('http://api.plus.io/addItem', {"id":app_id,"key":secret_key,"bucket":bucket,"content":content}, 
                        function(data) {  console.log("data sent to plus.io", data); 
                });
             },
             updateItem: function (item,bucket,content){
                $.post('http://api.plus.io/updateItem', {"id":app_id,"item":item,"bucket":bucket,"content":content}, 
                        function(data) { 
                            console.log("data sent to plus.io", data); 
                        });
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
// 	var sockjs_url = 'http://localhost:9999/';
// 	var sockjs = new SockJS(sockjs_url); // server needs to be moved to a proper config property.

// 	return {
// 		onopen: function(callback) {
// 			console.log('Glass Event received: ', callback);

// 			sockjs.onopen(eventName, function() {
// 				console.log('on open called in service.', sockjs.protocol)
// 				var args = arguments;
// 				//console.log(args[0].fn);
// 				//var x = JSON.parse(args[0]);
// 				$rootScope.socketEventFn = args[0].fn;
// 				$rootScope.$apply($rootScope.socketEventFn);

// 				$rootScope.$apply(function() {
// 					callback.apply(sockjs, args);
// 					//callback.apply(args[0].fn);
// 				});
// 			});
// 		},
// 		onmessage: function(data, callback) {
// 			console.log('Mobile event emitted: ', data);

// 			sockjs.onmessage(data, function() {
// 				var args = arguments;
// 				$rootScope.$apply(function() {
// 					if(callback) {
// 						callback.apply(sockjs, args);
// 					}
// 				});
// 			});
// 		},
// 		onclose: function(data, callback){
// 			sockjs.onclose(data, function(){
// 				alert('closed');
// 			})
// 		}
// 	};
// });