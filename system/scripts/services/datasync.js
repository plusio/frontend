/* This service exists in order to store data in local storage for 2 reasons:
 * 1) To allow application to continue functioning when network connectivity is broken
 */
$app.factory('dataSync', function() { 
    var dirtyNewKeyName = "_dirty";
    var dirtyUpdateKeyName = "_dirty";
    var deletedKeyName = "_deleted";   

    // Initialise. If the database doesn't exist, it is created
    var localDb = new localStorageDB("datasync", localStorage);

    // Check if the database was just created. Useful for initial database setup
    if(localDb.isNew()) {
        // create the "configuration" table
        localDb.createTable("localConfiguration", ["key", "value"]);
        localDb.insert("localConfiguration", {key: "needsDataSync", value:"0"});

        // commit the database to localStorage
        // all create/drop/insert/update/delete operations should be committed
        localDb.commit();
    }   

    var createTableIfNotExists = function(syncKey, data){
        if(localDb.tableExists(syncKey) == false){
            // create virtual table with columns representing each property 
            localDb.createTable(syncKey, Object.getOwnPropertyNames(data));
            // persist table creation
            localDb.commit();
        }
    }

   return {
             getDirtyKey: function(syncKey, type){
                switch(type.toLowerCase())
                {
                    case "update": { return syncKey + "_" + dirtyUpdateKeyName; }
                    case "new": { return syncKey + "_" + dirtyNewKeyName; }
                    case "deleted": { return syncKey + "_" + deletedKeyName; }
                    case "config": { return "localConfiguration"; }
                    default:
                    {
                        console.log('Incorrect local storage key type provided.');
                        return type;
                    }
                }
             },
             collection: function(syncKey) {
                // return empty array if nothing found
                return localDb.query(syncKey);
             },    
             get: function(syncKey, id) {
                // return empty array if nothing found
                return localDb.query(syncKey, {id:id});
             },                         
             query: function(syncKey, filter) {
                // return empty array if nothing found
                return localDb.query(syncKey, filter)
             }, 
             add: function(syncKey, data){
             	// Only attempt to store valid json objects
                var isValidJson = angular.isObject(angular.fromJson(angular.toJson(data)));
                if (isValidJson == false) { 
                   console.log("Invalid object passed. Must be json object in order to store.");
                   return;
                }

                // create local storage table if it doesn't already exists
                createTableIfNotExists(syncKey, data);

                // store object for usage later.
                localDb.insert(syncKey, data);

                //persist changes locally
                localDb.commit();
                //localStorage.setItem(syncKey + "_" + Math.random(), angular.toJson(data));
            },
             update: function (syncKey, id, data){
                var dirtyNewTable = getDirtyKey(syncKey, "new");// syncKey + "_" + dirtyNewKeyName;
                var dirtyUpdateTable = getDirtyKey(syncKey, "update"); //syncKey + "_" + dirtyUpdateKeyName;                
                // update local existing records, to keep it up to data. (clean)
                var isValidJson = angular.isObject(angular.fromJson(angular.toJson(data)));
                if (isValidJson == false) { 
                   console.log("Invalid object passed. Must be json object in order to store.");
                   return;
                }

                // create virtual update table if it doesn't exist
                createTableIfNotExists(syncKey, data);
                localDb.update(syncKey, {id:id}, function(row) {
                    row = data;
                    
                    // the update callback function returns to the modified record
                    return row;
                });

                /* This is here in case the user lost network connection and then created a new record, and is now trying to update that record. 
                 * We need to track that so that the update can be persisted to the server later.
                 */
                createTableIfNotExists(dirtyNewTable, data);
                // update local dirty records (records not yet uploaded to server, but now theres another update to same data.)
                localDb.update(dirtyNewTable, {id:id}, function(row) {
                    row = data;
                    
                    // the update callback function returns to the modified record
                    return row;
                }); 
                
                /* This is here in case the user lost network connection and is now trying to update an existing record (already on server). 
                 * We need to track that so that the update can be persisted to the server later.
                 */
                createTableIfNotExists(dirtyUpdateTable, data);
                // update local dirty records (records not yet uploaded to server, but now theres another update to same data.)
                localDb.update(dirtyUpdateTable, {id:id}, function(row) {
                    row = data;
                    
                    // the update callback function returns to the modified record
                    return row;
                });  
                

                // persist changes locally
                localDb.commit();


    //          	// Need to have data pools:
    //          	// 1) Records already existing (stored sync keys arrays)
				// var staleRecords = localStorage.getItem(syncKey);
				// var hasStaleRecords = angular.isArray(staleRecords);
				// // 2) Records queued to be uploaded (stored in 1 array per list (sync key))
				// var dirtyRecords = localStorage.getItem(syncKey + dirtyKeyName);
				// var hasDirtyRecords = angular.isArray(dirtyRecords);

    //             var existignRecord;

    //             // Check first if there is a queued version that needs to be updated.
    //             // If yes, update that first, then copy to existing.
    //             if(hasStaleRecords){
    //             	// find stale record
    //                 $.each(function(i, record){
    //                     if(record.id == id){ 
    //                         existignRecord = angular.fromJson(record); 
    //                     }
    //                     return false; 
    //                 });
    //             	// if exists update it
    //                 if(angular.isDefined(existignRecord)){

    //                 }
    //             }

    //             if(hasDirtyRecords){
    //             	// find dirty record
    //             	// if exists, update it
    //             }
             },
             delete: function (syncKey, id, data){
                var dirtyNewTable = syncKey + "_" + dirtyNewKeyName;
                var dirtyUpdateTable = syncKey + + "_" + dirtyUpdateKeyName;    
                            
                // delete local existing records, to keep it up to data. (clean)
                localDb.deleteRows(syncKey, {id:id});

                /* This is here in case the user lost network connection and then created a new record, and is now trying to delete that record. 
                 * We need to track that so that the update can be persisted to the server later.
                 */
                createTableIfNotExists(dirtyNewTable, data);
                // delete local existing records, to keep it up to data. (clean)
                localDb.deleteRows(dirtyNewTable, {id:id});

                /* This is here in case the user lost network connection and is now trying to update an existing record (already on server). 
                 * We need to track that so that the update can be persisted to the server later.
                 */
                createTableIfNotExists(dirtyUpdateTable, data);
                // delete local existing records, to keep it up to data. (clean)
                localDb.deleteRows(dirtyUpdateTable, {id:id});

                // persist changes locally
                localDb.commit();
                               
    //          	// Need to have data pools:
    //          	// 1) Records queued to be deleted (stored by sync key)
				// var deletedRecords = localStorage.getItem(syncKey + deletedKeyName);
				// var hasDeletedRecords = angular.isArray(deletedRecords);

				// // Not sure I should even load other data pools if the record is meant to be deleted. 
				// // Too tired now. Think thru tomorrow & continue. 
				// if (hasDeletedRecords){

				// }

    //             // 2) Records already existing (stored sync keys arrays)
    //             var staleRecords = localStorage.getItem(syncKey);
    //             var hasStaleRecords = angular.isArray(staleRecords);
    //             // 3) Records queued to be uploaded (stored in 1 array per list (sync key))
    //             var dirtyRecords = localStorage.getItem(syncKey + dirtyKeyName);
    //             var hasDirtyRecords = angular.isArray(dirtyRecords);

    //             // Check first if there is a queued version that needs to be updated.
    //             // If yes, update that first, then copy to existing.
    //             if(hasStaleRecords){
    //             	// find stale record
    //             	// if exists delete it
    //             }

    //             if(hasDirtyRecords){
    //             	// find dirty record
    //             	// if exists, delete it
    //             }
             }                                                                                    
   }
});  