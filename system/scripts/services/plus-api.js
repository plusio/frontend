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
    var isSyncing = true; // TODO: add to config file.
    var serviceDataPullFn = function($http, $q, theUrl, params){
       $http.defaults.useXDomain = true
       
       //create our deferred object.
       var deferred = $q.defer();

       //make the call.
       $http({method: "jsonp", url: theUrl, cache:true}).success(function(data) {
          //when data is returned resolve the deferment.
         deferred.resolve(data);

         //store data in localstorage using the passed in parameter as the key
       }).error(function(err){
          console.log('an error has occurred while getting data.', err);

          //or reject it if there's a problem.
          deferred.reject();
       });

       //return the promise that work will be done (kinda like a data-IOU)
       return deferred.promise;
    };
    var serviceDataSendFn = function($http, $q, theUrl, params, syncKey, mode){
       $http.defaults.useXDomain = true;   
       var theParams = params;
       var theSyncKey = syncKey;

       //create our deferred object.
       var deferred = $q.defer();

       //make the call.
       $http.post(theUrl, params).success(function(data) {
         //when data is returned resolve the deferment.
         deferred.resolve(data);

       }).error(function(){
          //or reject it if there's a problem.
          console.log('an error occurred during save');

          // store item in local storage
          if (isSyncing){
            console.log('running syncing code.');

            var syncKeyName = dataSync.getDirtyKey(syncKey, mode);
            if (mode == "new") { dataSync.add(syncKeyName, theParams); } 
            else { dataSync.update(syncKeyName, theParams); }
           
            dataSync.setNeedDataSync(true);
          }

          //or reject it if there's a problem.
          deferred.reject();
       });

       //return the promise that work will be done (kinda like a data-IOU)
       return deferred.promise;
    };    
    var serviceDeleteFn = function($http, $q, theUrl, id, syncKey){
     $http.defaults.useXDomain = true; 
      var theSyncKey = syncKey;  
      var theId = id;

     //create our deferred object.
     var deferred = $q.defer();

     //make the call.
     $http({method: "delete", url: theUrl}).success(function(data) {     
       //when data is returned resolve the deferment.
       deferred.resolve(data);
     }).error(function(){
        //or reject it if there's a problem.
        console.log('an error occurred during delete');

        // store item in local storage
        if (isSyncing){
          console.log('running syncing code.');

          var syncKeyName = dataSync.getDirtyKey(theSyncKey, "delete");
          dataSync.delete(syncKeyName, theId); 

          dataSync.setNeedDataSync(true);
        }

        //or reject it if there's a problem.
        deferred.reject();
     });


   //return the promise that work will be done (kinda like a data-IOU)
   return deferred.promise;
};

      // private function to sync creates/updates
    var syncDataCreateUpdate = function(entity, state, localDb, restService){
        switch(angular.lowercase(state))
        {
          case "add":
          {
            // Find new records that need to be created thru rest api
            var tableName = dataSync.getDirtyKey(entity, "new");
            var newTableExists = localDb.tableExists(tableName)
            if (newTableExists){
              var newData = localDb.query(tableName);
              if (angular.isArray(newData) && newData.length > 0){
                console.log('plus service', restService);

                // loop thru each new record & send to rest api to create
                angular.forEach(newData, function(record, j){
                    console.log('record is being sent to rest-api from localstorage');
                    restService.add(entity, record, true).then(function(){
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
          }          
          case "update":
          {
            var tableName = dataSync.getDirtyKey(entity, "new");
            var updateTableExists = localDb.tableExists(tableName)
            if (updateTableExists){
              // Find existing records that need to be updated thru rest api
              var existingData = localDb.query(dataSync.getDirtyKey(entity, "update"));
              if (angular.isArray(existingData) && existingData.length > 0){
                // loop thru each new record & send to rest api to create
                angular.forEach(existingData, function(record, j){
                  plus.add(entity, record).then(function(){
                    // success
                    console.log('record successfully added to rest api. delete from local storage.');
                  }, function(){
                    // error
                    console.log('record failed while trying to be added to rest api. keep in local storage.');
                  })
                });  
              }  
             }
          }
          default:
          {
            console.log('recieved invalid data state while attempting to sync data');
          }
        } 
    };

    // private function to sync deletes
    var syncDataDelete = function(entity, localDb, restService){
        // Find new records that were queued to be created, but are now being deleted.
        var tableName = dataSync.getDirtyKey(entity, "delete");
        var updateTableExists = localDb.tableExists(tableName)
        if (updateTableExists){
          var newData = localDb.query(dataSync.getDirtyKey(entity, "delete"));
          if (angular.isArray(newData) && newData.length > 0){
            // loop thru each new record & send to rest api to create
            angular.forEach(newData, function(record, j){
              restService.delete(entity, record);
            });  
          }

          // Find existing records that were queued to be updated, but are now being deleted.
          var existingData = localDb.query(entity + dirtyUpdateKeyName);
          if (angular.isArray(existingData) && existingData.length > 0){
            // loop thru each new record & send to rest api to create
            angular.forEach(existingData, function(record, j){
              restService.delete(entity, record);
            });  
          } 
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
              var needsDataSync = localConfig[0].value;
              if (needsDataSync == "1" && angular.isArray(restEntities) && restEntities.length > 0){
                // loop thru each rest entity (data collection) & look for dirty records
                angular.forEach(restEntities, function(entity, iterator){
                  console.log('syncing add for: ', entity);
                  // perform all adds for this entity
                  syncDataCreateUpdate(entity, "add", localDb, this);
                  
                  // console.log('syncing updates for: ', entity);
                  // // perform all updates for this entity
                  // syncDataCreateUpdate(entity, "update", localDb);
                
                  // syncDataDelete(entity, localDb);
                  // // perform all deletes for this entity
                  // console.log('syncing deletes for: ', entity);
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
                if (isSyncing == undefined){ isSyncing = true; }
                var content = {content: data};
                // var restData = { 
                //   url :  theUrl + syncKey + "/",
                //   content : angular.toJson(data),
                //   isSyncing:isSyncing,
                //   syncKey:syncKey
                // };
                var promisedData = serviceDataSendFn($http, $q, theUrl + syncKey + "/", angular.toJson(content), syncKey, "new");
                
                // sync all data.
                this.syncData();

                return promisedData;
             },
             update: function (syncKey, id, data){
               if (isSyncing == undefined){ isSyncing = true; }
               // var restData = { 
               //    url :  theUrl + syncKey + "/",
               //    content : angular.toJson(data),
               //    isSyncing:isSyncing,
               //    syncKey:syncKey
               //  };

                var promisedData = serviceDataSendFn($http, $q, theUrl + syncKey + "/" + id + "/",  angular.toJson(data), syncKey, "update");
                
                // sync all data.
                this.syncData();
                return promisedData;
             },
             delete: function (syncKey, id){
                if (isSyncing == undefined){ isSyncing = true; }
                // var restData = { 
                //   url :  theUrl + syncKey + "/" + id + "/",
                //   isSyncing:isSyncing,
                //   syncKey:syncKey + "_" + id
                // };

                //return serviceDeleteFn($http, $q, restData);
                var promisedData = serviceDeleteFn($http, $q, theUrl + syncKey + "/" + id + "/", id, syncKey);

                this.syncData();
                return promisedData;
             }                                                                                    
   }
});