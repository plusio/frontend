'use strict';

/* Plus IO Services */

/* Cross Origin Domain requests do not work on App Engine for desktop browsers. You must disable web security within chrome for these methods to work.
 * 1. Disable xss protection in chrome (allows running angularjs app in file view w/o running server).
 *   OSX Terminal Command: open -a Google\ Chrome --args --disable-web-security
 */

// Gotten from: http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html
// plus data service
$app.factory('plusCloud', function($http, $q, $rootScope, dataSync, connection) { 
    var collectionUrl = settings.app.server_url + "collection/";
    var structureUrl = settings.app.server_url + "structure/";
    var isSyncing =  settings.app.data_sync;  
    var hasNetworkConnection = connection.hasNetworkConnection();  

    var serviceDataPullFn = function($http, $q, collectionUrl, params){
       $http.defaults.useXDomain = true
       
       //create our deferred object.
       var deferred = $q.defer();

       //make the call.
       $http({method: "jsonp", url: collectionUrl, cache:true}).success(function(data) {
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
    var serviceDataSendFn = function($http, $q, collectionUrl, params, originalParams, syncKey, mode){
       $http.defaults.useXDomain = true;   
       var theParams = params;
       var theSyncKey = syncKey;
       var theOriginalParams = originalParams;

       //create our deferred object.
       var deferred = $q.defer();

       //make the call.
       $http.post(collectionUrl, params).success(function(data) {
         //when data is returned resolve the deferment.
         deferred.resolve(data);

       }).error(function(){
          //or reject it if there's a problem.
          console.log('an error occurred during save');

          // store item in local storage
          if (isSyncing){
            console.log('running syncing code.');

            var syncKeyName = dataSync.getDirtyKey(syncKey, mode);
            if ( mode == "new") { dataSync.add(syncKeyName, theOriginalParams); } 
            else { dataSync.update(syncKeyName, theOriginalParams); }
           
            dataSync.setNeedDataSync(true);
          }

          //or reject it if there's a problem.
          deferred.reject();
       });

       //return the promise that work will be done (kinda like a data-IOU)
       return deferred.promise;
    };    
    var serviceDeleteFn = function($http, $q, collectionUrl, id, syncKey){
     $http.defaults.useXDomain = true; 
      var theSyncKey = syncKey;  
      var theId = id;

      //create our deferred object.
      var deferred = $q.defer();

      //make the call.
      console.log('the delete url:', collectionUrl);
      $http({method: "delete", url: collectionUrl}).success(function(data) {     
         //when data is returned resolve the deferment.
         deferred.resolve(data);

         // remove item from local storage delete queue.
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

    var addFn = function(syncKey, data){
        var content = _.omit(data, ['id', 'ID']);   
        content.time = (new Date()).getTime().toString();
        return serviceDataSendFn($http, $q, collectionUrl + syncKey, angular.toJson(content), data, syncKey, "new");;
    }
    var deleteFn = function (syncKey, id){
        return serviceDeleteFn($http, $q, collectionUrl + syncKey + "/" + id, id, syncKey);;
    } 
    var updateFn = function (syncKey, id, data){
        var content = _.omit(data, ['id', 'ID']);
        //content.time = (new Date()).getTime().toString(); time should be the created date, and we don't want to assume they want/need a modified time.
        return serviceDataSendFn($http, $q, collectionUrl + syncKey + "/" + id,  angular.toJson(content), data, syncKey, "update");;
    }

    // private function to sync creates/updates
    var syncDataCreateUpdate = function(entity, state, localDb){
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
                // loop thru each new record & send to rest api to create
                angular.forEach(newData, function(record, j){
                    console.log('record is being sent to rest-api from localstorage');
                    addFn(entity, record).then(function(){
                    // success
                    console.log('record successfully added to rest api. delete from local storage.');
                    localDb.deleteRows(tableName, record);
                    localDb.commit();
                    //dataSync.removeFromQueue(tableName, record);
                  }, function(){
                    // error
                    console.log('record failed while trying to be added to rest api. keep in local storage.');
                  });
                });  
              }
            }
            break;
          }          
          case "update":
          {
            var tableName = dataSync.getDirtyKey(entity, "update");
            var updateTableExists = localDb.tableExists(tableName)
            if (updateTableExists){
              // Find existing records that need to be updated thru rest api
              var existingData = localDb.query(dataSync.getDirtyKey(entity, "update"));
              if (angular.isArray(existingData) && existingData.length > 0){
                // loop thru each new record & send to rest api to create
                angular.forEach(existingData, function(record, j){
                  updateFn(entity, record.id, record).then(function(){
                    // success
                    console.log('record successfully added to rest api. delete from local storage.');
                    localDb.deleteRows(tableName, record);
                    localDb.commit();
                  }, function(){
                    // error
                    console.log('record failed while trying to be added to rest api. keep in local storage.');
                  })
                });  
              }  
             }
             break;
          }
          default:
          {
            console.log('recieved invalid data state while attempting to sync data');
            break;
          }
        } 
    };

    // private function to sync deletes
    var syncDataDelete = function(entity, localDb){
        // Find new records that were queued to be created, but are now being deleted.
        var tableName = dataSync.getDirtyKey(entity, "delete");
        var updateTableExists = localDb.tableExists(tableName)
        if (updateTableExists){
          var newData = localDb.query(tableName);
          if (angular.isArray(newData) && newData.length > 0){
            // loop thru each new record & send to rest api to create
            angular.forEach(newData, function(record, j){
              deleteFn(entity, record.id).then(function(){
                // success
                console.log('record successfully added to rest api. delete from local storage.');
                localDb.deleteRows(tableName, record);
                localDb.commit();
                //dataSync.removeFromQueue(tableName, record);
              }, function(){
                // error
                console.log('record failed while trying to be added to rest api. keep in local storage.');
              });
            });  
          }
        }  
    };       

   return {
             syncData: function(){
              // Get all the rest based entities that the application uses
              var restEntities = settings.app.restEntities;
              var localDb = new localStorageDB("datasync", localStorage);

              // Check if the sync service claims that records are ready to be uploaded to service
              var needsDataSync = localStorage.getItem("needsDataSync"); //localConfig[0].value;
              var readyToSync = ((hasNetworkConnection) && (needsDataSync == "1") && (angular.isArray(restEntities)) && (restEntities.length > 0))
              if (readyToSync){
                // loop thru each rest entity (data collection) & look for dirty records
                angular.forEach(restEntities, function(entity, iterator){
                  console.log('syncing add for: ', entity);
                  // perform all adds for this entity
                  syncDataCreateUpdate(entity, "add", localDb);
                  
                  console.log('syncing updates for: ', entity);
                  // perform all updates for this entity
                  syncDataCreateUpdate(entity, "update", localDb);
                
                  // perform all deletes for this entity
                  console.log('syncing deletes for: ', entity);                
                  syncDataDelete(entity, localDb);
                });
              }
             },     
             structure: function(syncKey){
                var updatedUrl = syncKey + "?callback=JSON_CALLBACK";
                return serviceDataPullFn($http, $q, structureUrl + updatedUrl, syncKey);
             },       
             collection: function(syncKey, params) {
                var limit="20"; var offset="0"; var filter=""; var value="";
                if(angular.isObject(params)) {
                    limit = params.hasOwnProperty('limit') ? params.limit : 20;
                    offset = params.hasOwnProperty('offset') ? params.offset : 0;
                    filter = params.hasOwnProperty('filter') ? "&filter=" + params.filter : "";
                    value = params.hasOwnProperty('value') ? "&value=" + params.value : "";
                }

                var updatedUrl = syncKey + "?limit=" + limit + "&offset=" + offset + filter + value + "&callback=JSON_CALLBACK";  
                return serviceDataPullFn($http, $q, collectionUrl + updatedUrl, syncKey);
             },    
             get: function(syncKey, id) {
                var updatedUrl = syncKey + "/" + id + "?callback=JSON_CALLBACK";
                return serviceDataPullFn($http, $q, collectionUrl + updatedUrl, syncKey + "_" + id, syncKey);
             },                         
             add: function(syncKey, data){
                return addFn(syncKey, data);
             },
             update: function (syncKey, id, data){
               var content = _.omit(data, ['id']);
               return serviceDataSendFn($http, $q, collectionUrl + syncKey + "/" + id,  angular.toJson(content));
             },
             delete: function (syncKey, id){
                return serviceDeleteFn($http, $q, collectionUrl + syncKey + "/" + id, syncKey + "_" + id);
             }                                                                                    
   }
});