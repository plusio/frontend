/* This service exists in order to store data in local storage updates to rest based data in the effect network connection breaks down */
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
    if(localDb.isNew()) { createLocalConfigTable(); }   

   return {  
             getPersistanceDatabase: function (){
                createLocalConfigTable();
                return new localStorageDB("datasync", localStorage);
             },
             setNeedDataSync: function(val){
                var intVal = 0; 
                if (val){ intVal = 1};
                localStorage.setItem("needsDataSync", intVal);
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
            },
             update: function (syncKey, data){
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

                // persist changes locally
                localDb.commit();
             },
             delete: function (syncKey, id){
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

                    // persist changes locally
                    localDb.commit(); 
                }                        
             }                                                                                    
   }
});  