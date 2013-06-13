/* This service exists in order to store data in local storage for 2 reasons:
 * 1) To allow application to continue functioning when network connectivity is broken
 */
$app.factory('dataSync', function() { 
    // Initialise. If the database doesn't exist, it is created
    var localDb = new localStorageDB("datasync", localStorage);

    var createLocalConfigTable = function(){
        var localConfigTableName = "localConfiguration";
        if (localDb.tableExists(localConfigTableName) == false){
            localDb.createTable(localConfigTableName, ["prop", "val"]);
            localDb.insert(localConfigTableName, {prop: "needsDataSync", val:"0"});

            // commit the database to localStorage
            localDb.commit();
        }
    }
    var createTableIfNotExists = function(syncKey, data){
        if(localDb.tableExists(syncKey) == false){
            // create virtual table with columns representing each property 
            localDb.createTable(syncKey, Object.getOwnPropertyNames(data));
            // persist table creation
            localDb.commit();
        }
    }

    // Check if the database was just created. Useful for initial database setup
    if(localDb.isNew()) {
        // create the "configuration" table
        createLocalConfigTable();
    }   

   return {  
             // removeFromQueue: function(syncKey, data) {
             //    var db = this.getPersistanceDatabase();
             //    db.deleteRows(syncKey, data);
             //    db.commit();

             //    // var records = db.query(syncKey, data);
             //    // if (records.length > 0){
             //    //     angular.forEach(newData, function(record, j){
             //    //         db.deleteRows
             //    //     });
             //    // }
             // },  
             getPersistanceDatabase: function (){
                createLocalConfigTable();
                return new localStorageDB("datasync", localStorage);
             },
             setNeedDataSync: function(val){
                var intVal = 0; 
                if (val){ intVal = 1};
                localStorage.setItem("needsDataSync", intVal);
                // var db = this.getPersistanceDatabase();
                // var config = {prop: "needsDataSync", val: intVal};
                // var x = db.query("localConfiguration", {prop: "needsDataSync"});
                // db.deleteRows("localConfiguration", {prop: "needsDataSync"});
                // db.commit();

                // db.insert("localConfiguration", config);

                // // db.update("localConfiguration", {ID: x.ID}, function(row) {
                // //     row.value = config.val;
                // //     console.log('updating config', config);
                    
                // //     // the update callback function returns to the modified record
                // //     return row;
                // // });
                // db.commit();
                
                // console.log('local config value:', x);
             },
             getDirtyKey: function(syncKey, type){
                var dirtyNewKeyName = "_dirtyNew";
                var dirtyUpdateKeyName = "_dirtyUpdate";
                var deletedKeyName = "_dirtyDeleted"; 

                switch(type.toLowerCase())
                {
                    case "update": { return syncKey + dirtyUpdateKeyName; }
                    case "new": { return syncKey + dirtyNewKeyName; }
                    case "delete": { return syncKey + deletedKeyName; }
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
                var theData = angular.fromJson(data);
                var isValidJson = angular.isObject(theData);
                if (isValidJson == false) { 
                   console.log("Invalid object passed. Must be json object in order to store.");
                   return;
                }

                // create local storage table if it doesn't already exists
                createTableIfNotExists(syncKey, theData);

                // store object for usage later.
                localDb.insert(syncKey, theData);

                //persist changes locally
                localDb.commit();
                //localStorage.setItem(syncKey + "_" + Math.random(), angular.toJson(data));
            },
             update: function (syncKey, data){
                //var dirtyNewTable = this.getDirtyKey(syncKey, "new");// syncKey + "_" + dirtyNewKeyName;
                //var dirtyUpdateTable = this.getDirtyKey(syncKey, "update"); //syncKey + "_" + dirtyUpdateKeyName;                
                
                // Only attempt to store valid json objects
                var theData = angular.fromJson(data);
                var isValidJson = angular.isObject(theData);
                if (isValidJson == false) { 
                   console.log("Invalid object passed. Must be json object in order to store.");
                   return;
                }

                // create virtual update table if it doesn't exist
                createTableIfNotExists(syncKey, theData);
                localDb.insertOrUpdate(syncKey, {id:theData.id}, theData);

                // localDb.update(syncKey, {id:theData.id}, function(row) {
                //     row = theData;
                    
                //     // the update callback function returns to the modified record
                //     return row;
                // });

                /* This is here in case the user lost network connection and then created a new record, and is now trying to update that record. 
                 * We need to track that so that the update can be persisted to the server later.
                 */
                // createTableIfNotExists(dirtyNewTable, theData);
                // // update local dirty records (records not yet uploaded to server, but now theres another update to same data.)
                // localDb.update(dirtyNewTable, {id:theData.id}, function(row) {
                //     row = theData;
                    
                //     // the update callback function returns to the modified record
                //     return row;
                // }); 
                
                /* This is here in case the user lost network connection and is now trying to update an existing record (already on server). 
                 * We need to track that so that the update can be persisted to the server later.
                 */
                // createTableIfNotExists(dirtyUpdateTable, theData);
                // // update local dirty records (records not yet uploaded to server, but now theres another update to same data.)
                // localDb.update(dirtyUpdateTable, {id:theData.id}, function(row) {
                //     row = theData;
                    
                //     // the update callback function returns to the modified record
                //     return row;
                // });  
                

                // persist changes locally
                localDb.commit();
             },
             delete: function (syncKey, id){
                //var dirtyNewTable = syncKey + "_" + dirtyNewKeyName;
                //var dirtyUpdateTable = syncKey + + "_" + dirtyUpdateKeyName;    
                            
                // delete local existing records, to keep it up to data. (clean)

                if (angular.isObject(id)){
                    // Not sure why this is happening yet, 
                    // but on re-running (due to continued failed connections), the id turns into an object and then can't be found so it continues to re-insert.
                    return;
                }

                // create virtual 'delete' table if it doesn't exist
                createTableIfNotExists(syncKey, {id:0});
                var recordExists = (localDb.query(syncKey, {id:id}).length > 0);
                if (recordExists == false){
                    console.log('adding record to delete queue: ', id);
                    localDb.insert(syncKey, {id:id});

                    /* This is here in case the user lost network connection and then created a new record, and is now trying to delete that record. 
                     * We need to track that so that the update can be persisted to the server later.
                     */
                    // createTableIfNotExists(dirtyNewTable, data);
                    // delete local existing records, to keep it up to data. (clean)
                    // localDb.deleteRows(dirtyNewTable, {id:id});

                    /* This is here in case the user lost network connection and is now trying to update an existing record (already on server). 
                     * We need to track that so that the update can be persisted to the server later.
                     */
                    // createTableIfNotExists(dirtyUpdateTable, data);
                    // delete local existing records, to keep it up to data. (clean)
                    // localDb.deleteRows(dirtyUpdateTable, {id:id});

                    // persist changes locally
                    localDb.commit(); 
                }                        
             }                                                                                    
   }
});  