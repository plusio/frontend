'use strict';

/* Cross Origin Domain requests do not work on App Engine for desktop browsers. You must disable web security within chrome for these methods to work. */
$app.factory('plusCollection', function($http, $q, $rootScope, dataSync, connection) {
    var secretKey = settings.app.server_secret;
    var collectionUrl = settings.app.server_url + "collection/";
    var structureUrl = settings.app.server_url + "structure";
    var isSyncing =  settings.app.data_sync;  
    var hasNetworkConnection = connection.hasNetworkConnection();  

    var serviceDataPullFn = function($http, $q, collectionUrl, params){
       $http.defaults.useXDomain = true
       
       var deferred = $q.defer();
       $http({method: "jsonp", url: collectionUrl, cache:true}).success(function(data) {
         deferred.resolve(data);
       }).error(function(err){
          console.log('an error has occurred while getting data.', err);
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

       var deferred = $q.defer();
       $http.post(collectionUrl, params).success(function(data) {
         deferred.resolve(data);

       }).error(function(){
          console.log('an error occurred during save');

          // store item in local storage
          if (isSyncing){
            console.log('running syncing code.');

            var syncKeyName = dataSync.getDirtyKey(syncKey, mode);
            if ( mode == "new") { dataSync.add(syncKeyName, theOriginalParams); } 
            else { dataSync.update(syncKeyName, theOriginalParams); }
           
            dataSync.setNeedDataSync(true);
          }

          deferred.reject();
       });

       //return the promise that work will be done (kinda like a data-IOU)
       return deferred.promise;
    };    
    var serviceDeleteFn = function($http, $q, collectionUrl, id, syncKey){
     $http.defaults.useXDomain = true; 
      var theSyncKey = syncKey;  
      var theId = id;

      var deferred = $q.defer();
      $http({method: "delete", url: collectionUrl}).success(function(data) {     
         deferred.resolve(data);
        }).error(function(){

          // store item in local storage
          if (isSyncing){
            var syncKeyName = dataSync.getDirtyKey(theSyncKey, "delete");
            dataSync.delete(syncKeyName, theId); 

            dataSync.setNeedDataSync(true);
          }

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
                syncKey = (_.isUndefined(syncKey))?'':'/'+syncKey;
                var updatedUrl = syncKey + "?callback=JSON_CALLBACK&secret_key="+secretKey;
                return serviceDataPullFn($http, $q, structureUrl + updatedUrl, syncKey);
             },         
             get: function(syncKey, id) {
                if(_.isNumber(id) && !_.isNaN(id)){
                    // if the id is an integer, use it as an id and get one item
                    var updatedUrl = syncKey + "/" + id + "?callback=JSON_CALLBACK&secret_key="+secretKey;
                    return serviceDataPullFn($http, $q, collectionUrl + updatedUrl, syncKey + "_" + id, syncKey);  
                }else{
                    var params = id;
                    var limit="20"; var offset="0"; var filter=""; var value="";
                    if(angular.isObject(params)) {
                        limit = params.hasOwnProperty('limit') ? params.limit : 20;
                        offset = params.hasOwnProperty('offset') ? params.offset : 0;
                        filter = params.hasOwnProperty('filter') ? "&filter=" + params.filter : "";
                        value = params.hasOwnProperty('value') ? "&value=" + params.value : "";
                    }

                    var updatedUrl = syncKey + "?limit=" + limit + "&offset=" + offset + filter + value + "&callback=JSON_CALLBACK&secret_key="+secretKey;  
                    return serviceDataPullFn($http, $q, collectionUrl + updatedUrl, syncKey);
                }
                
             },                         
             add: function(syncKey, data){
                return addFn(syncKey + "?secret_key="+secretKey, data);
             },
             update: function (syncKey, id, data){
               var content = _.omit(data, ['id']);
               return serviceDataSendFn($http, $q, collectionUrl + syncKey + "/" + id + "?secret_key="+secretKey,  angular.toJson(content));
             },
             delete: function (syncKey, id){
                return serviceDeleteFn($http, $q, collectionUrl + syncKey + "/" + id + "?secret_key="+secretKey, syncKey + "_" + id);
             }                                                                                    
   }
});