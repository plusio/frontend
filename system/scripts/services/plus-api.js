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




/* Currently we're experiencing some issues with CORS on App Engine but only for browsers. You must disable web security within chrome for these methods to work.
 * 1. Disable xss protection in chrome (allows running angularjs app in file view w/o running server).
 *   OSX Terminal Command: open -a Google\ Chrome --args --disable-web-security
 */


// Gotten from: http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
// plus data service
$app.factory('plus', function($http, $q, $rootScope, dataSync) { 
    var theUrl = settings.app.server_url;

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
    var serviceDataSendFn = function($http, theUrl, params, syncKey){
       $http.defaults.useXDomain = true   

       //make the call.
       $http.post(theUrl, params).success(function(data) {
          console.log('record saved')
       }).error(function(){
          //or reject it if there's a problem.
          console.log('an error occurred during save');

          // store item in local storage
          if (syncKey){
            dataSync.add(syncKey, params); // how do I specify create vs update?
            dataSync.update(dataSync.getDirtyKey('', "config"), {needsSync:'1'});
          }
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

          // store item in local storage
          if (syncKey){
            dataSync.add(syncKey, params); // how do I specify that this is a delete?
            dataSync.update(dataSync.getDirtyKey('', "config"), {needsSync:'1'});
          }
       });
    };

      // private function to sync creates/updates
    var syncDataCreateUpdate = function(entity, state){
        var dirtyNewKeyName = "_dirty";
        var dirtyUpdateKeyName = "_dirty";

        switch(angular.lowercase(state))
        {
          case "add":
          {
            // Find new records that need to be created thru rest api
            var newData = localDb.query(entity + dirtyNewKeyName);
            if (angular.isArray(newData) && newData.length > 0){
              // loop thru each new record & send to rest api to create
              $.each(newData, function(j, record){
                  console.log('record is being sent to rest-api from localstorage');
                  this.add(entity, record, true).then(function(){
                  // success
                  console.log('record successfully added to rest api. delete from local storage.');
                  localDb.delete(record);
                }, function(){
                  // error
                  console.log('record failed while trying to be added to rest api. keep in local storage.');
                })
              });  
            }
          }          
          case "update":
          {
            // Find existing records that need to be updated thru rest api
            var existingData = localDb.query(entity + dirtyUpdateKeyName);
            if (angular.isArray(existingData) && existingData.length > 0){
              // loop thru each new record & send to rest api to create
              $.each(existingData, function(j, record){
                this.add(entity, record).then(function(){
                  // success
                  console.log('record successfully added to rest api. delete from local storage.');
                }, function(){
                  // error
                  console.log('record failed while trying to be added to rest api. keep in local storage.');
                })
              });  
            }  
          }
          default:
          {
            console.log('recieved invalid data state while attempting to sync data');
          }
        } 
    };

    // private function to sync deletes
    var syncDataDelete = function(entity){
        // Find new records that were queued to be created, but are now being deleted.
        var newData = localDb.query(entity + dirtyNewKeyName);
        if (angular.isArray(newData) && newData.length > 0){
          // loop thru each new record & send to rest api to create
          $.each(newData, function(j, record){
            this.delete(entity, record);
          });  
        }

        // Find existing records that were queued to be updated, but are now being deleted.
        var existingData = localDb.query(entity + dirtyUpdateKeyName);
        if (angular.isArray(existingData) && existingData.length > 0){
          // loop thru each new record & send to rest api to create
          $.each(existingData, function(j, record){
            this.delete(entity, record);
          });  
        }   
    };

   return {
             syncData: function(){
              // Get all the rest based entities that the application uses
              var restEntities = settings.app.restEntities;
              var localDb = new localStorageDB("datasync", localStorage);
              var localConfig = localDb.query("localConfiguration", {key:"needsDataSync"}); 
              if (localConfig.length <= 0){
                console.log('Need Data Sync configuration value is missing.');
                return;
              }

              // Check if the sync service claims that records are ready to be uploaded to service
              var needsDataSync = localConfig[0];
              if (needsDataSync == "1" && angular.isArray(restEntities) && restEntities.length > 0){
                // loop thru each rest entity (data collection) & look for dirty records
                $.each(restEntities, function(i, entity){
                  // perform all adds for this entity
                  syncDataCreateUpdate(entity, "add");

                  // perform all updates for this entity
                  syncDataCreateUpdate(entity, "update");

                  // perform all deletes for this entity
                  syncDataDelete(entity);
                });

                // var data = localDb.query(syncKey);
                // if (angular.isArray(data)) { 
                //   return angular.fromJson(data); 
                // }
              }
             },    
             structure: function(syncKey){
                var updatedUrl = "https://openplusapp.appspot.com/structure/" + syncKey + "/?callback=JSON_CALLBACK";
                return serviceDataPullFn($http, $q, updatedUrl, syncKey);
             },       
             collection: function(syncKey) {
                var updatedUrl = syncKey + "/?callback=JSON_CALLBACK";
                return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey);
             },    
             get: function(syncKey, id) {
                var updatedUrl = syncKey + "/" + id + "/?callback=JSON_CALLBACK";
                return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey + "_" + id, syncKey);
             },                         
             query: function(syncKey, data) {
                return; 

                // incomplete. look into filter by url or by sent json data. 
                // var updatedUrl = syncKey + "/?callback=JSON_CALLBACK";// angular.toJson(data));
                // return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey);
             }, 
             limit: function(syncKey, limit, offset){
                var updatedUrl = syncKey + "/" + limit + "/" + offset + "/?callback=JSON_CALLBACK";
                return serviceDataPullFn($http, $q, theUrl + updatedUrl, syncKey);
             },
             add: function(syncKey, data, isSyncing){
                var content = {content: data};
                console.log(angular.toJson(content));
                // var restData = { 
                //                   theUrl :  theUrl + syncKey + "/",
                //                   content : angular.toJson(data),
                //                   isSyncing:isSyncing,
                //                   syncKey:syncKey
                //                 }
                var promisedData = serviceDataSendFn($http, theUrl + syncKey + "/", angular.toJson(content), syncKey, isSyncing);
                
                // sync all data.
                this.syncData();

                return promisedData;
             },
             update: function (syncKey, id, data){
               return serviceDataSendFn($http, theUrl + syncKey + "/" + id + "/",  angular.toJson(data), syncKey, isSyncing);
             },
             delete: function (syncKey, id){
                console.log(theUrl + syncKey + "/" + id + "/");
                return serviceDeleteFn($http, theUrl + syncKey + "/" + id + "/", syncKey + "_" + id);
             }                                                                                    
   }
});