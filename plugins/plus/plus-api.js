angular.module('plus.api', [])
  .factory('plusCollection', ['$http', function($http){
  	var baseUrl = 'https://' + app.projectId + '.appspot.com/collection/';
  	var baseStructureUrl = 'https://' + app.projectId + '.appspot.com/structure';
  	var callbackKey = '?callback=JSON_CALLBACK&secret_key=' + app.serverSecret;
    return{
		get: function(collection, filter, callback, error){
			var defaultParams = '&offset=' + 0 + '&limit=' +  20,
				filteredParams;

			if(!angular.isDefined(collection) || !angular.isString(collection)){
				throw Error('Collection must be specified as a string');
				return;
			}
			if(angular.isFunction(filter)){
				if(angular.isFunction(callback))
					error = callback;

				callback = filter;

			}else{
				if(!angular.isFunction(callback)){
					throw Error('A Callback is required for get requests');
					return;
				}

				if(angular.isObject(filter) && !angular.isArray(filter)){
					if(parseInt(filter.offset) && !isNaN(filter.offset) && parseInt(filter.offset) >= 0){
						console.log(filter.offset);
						filteredParams = '&offset=' + filter.offset;
					}else{
						if(filter.offset)
							throw Error('The offset must be a positive integer, defaulting to zero');
						filteredParams = '&offset=0';
					}

					if(parseInt(filter.limit) && !isNaN(filter.limit) && parseInt(filter.limit) >= 0){
						filteredParams += '&limit=' + parseInt(filter.limit);
					}else if(filter.limit == -1){
						/*
						// the api requires that the limit is specified with offset so we default to 1 Billion items
						// God help you if you're requesting more than that at one
						*/

						filteredParams += '&limit=1000000000';
					}else{
						if(filter.limit)
							throw Error('The limit must be a positive integer or -1 for no limit, defaulting to 20');
						filteredParams+= '&limit=20';
					}

					delete filter.offset; delete filter.limit;
					var keys = Object.keys(filter);

					if(keys.length > 1){
						console.log('The api only supports filtering by one column currently. (using the first filter : ' + keys[0] + ')')
					}

					if(keys.length >= 1){
						filteredParams += '&filter=' + keys[0] + '&value=' + filter[keys[0]];
					}

				}else if(parseInt(filter) && !isNaN(filter)){
					var id = '/' + filter;
				}else{
					throw Error('filter is an invalid value');
				}
			}

			

			$http.jsonp(baseUrl + collection + (id || '') + callbackKey + (filteredParams || defaultParams)).success(callback).error(error || function(){});
		},
		add: function(collection, data, callback, error){
			var restrictedKeys = ['id', 'ID', 'Id', 'iD', 'offset', 'limit','all','app','copy','delete','entity','entity_type','fields','from_entity','get','gql','instance_properties','is_saved','key','key_name','kind','parent','parent_key','properties','put','setdefault','to_xml','update'];
			var startWithBlacklist = ['_'];
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				throw Error('Collection must be specified as a string');
				return;
			}

			if(!angular.isDefined(data)){
				throw Error('Data is required to be added to the collection.');
				return;
			}

			if(angular.isObject(data) && !angular.isArray(data)){
				if(angular.isDefined(callback) && !angular.isFunction(callback)){
					throw Error('Callback must be defined as a function');
					return;
				}

				if(angular.isDefined(error) && !angular.isFunction(error)){
					throw Error('Error callback must be defined as a function');
					return;
				}

				if(!angular.isDefined(data.time))
					data.time = new Date().getTime().toString();

				var keys = Object.keys(data);

				keys.forEach(function(i){
					if (i.substring(0, 6) == "_") {
					    // ...
					}
				});

				var errMsgs = [];

				keys.forEach(function(i){
					if(restrictedKeys.indexOf(i) >= 0){
						errMsgs.push(i + ' is a Restricted Key or is disallowed in Google App Engine.');
					}
					if(startWithBlacklist.indexOf(i.substring(0,1)) >= 0){
						errMsgs.push(i + ' Starts with an illegal character');
					}
				});

				if(errMsgs.length){
					errMsgs.forEach(function(i){
						throw Error(i);
					});
					return;
				}					

				$http.post(baseUrl + collection + callbackKey, data, {}).success(callback || function(){}).error(error || function(){});
			}else{
				throw Error('Data must be an Object.');
				return;
			}
			
		},
		delete: function(collection, id, callback, error){
			console.log(error);
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				throw Error('Collection must be specified as a string');
				return;
			}

			if(!parseInt(id) || isNaN(id)){
				throw Error('The id must be a defined as a valid id (integer)');
				return;
			}

			if(angular.isDefined(callback) && !angular.isFunction(callback)){
				throw Error('Callback must be defined as a function');
				return;
			}

			if(angular.isDefined(error) && !angular.isFunction(error)){
				throw Error('Error callback must be defined as a function');
				return;
			}

			$http.delete(baseUrl + collection + '/' + id + '?secret_key=' + app.serverSecret).success(callback || function(){}).error(error || function(){});
		},
		update: function(collection, id, data, callback, error){
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				throw Error('Collection must be specified as a string');
				return;
			}

			if(!parseInt(id) || isNaN(id)){
				throw Error('The id must be a defined as a valid id (integer)');
				return;
			}

			if(!angular.isDefined(data)){
				throw Error('Data is required to be added to the collection.');
				return;
			}

			if(angular.isObject(data) && !angular.isArray(data)){
				if(angular.isDefined(callback) && !angular.isFunction(callback)){
					throw Error('Callback must be a function');
					return;
				}

				if(angular.isDefined(error) && !angular.isFunction(error)){
					throw Error('Error callback must be a function');
					return;
				}

				// if(!angular.isDefined(data.time))
				// 	data.time = new Date().getTime().toString();

				$http.post(baseUrl + collection + '/' + id + callbackKey, data, {}).success(callback || function(){}).error(error || function(){});
			}else{
				throw Error('Data must be an Object.');
				return;
			}
		},
		structure: function(collection, callback, error){
			if(angular.isFunction(collection)){
				error = callback;
				callback = collection;
				collection = '';
			}else{
				collection = '/' + collection;
			}

			if(angular.isDefined(collection) && !angular.isString(collection)){
				throw Error('Collection must be specified as a string');
				return;
			}

			if(!angular.isFunction(callback)){
				throw Error('A Callback is required for get requests');
				return;
			}

			if(!angular.isFunction(error) && angular.isDefined(error)){
				throw Error('A Callback must be a function');
				return;
			}

			$http.jsonp(baseStructureUrl + collection + callbackKey).success(callback).error(error || function(){});

		}
    };
  }])

.directive('plusData', function () {
    return {
    restrict: 'EA',
    link : function(scope, element, attrs){
      scope.apiConfig = {};
      
      attrs.$observe('collection', function( newVal ) {
        scope.apiConfig.collection = (angular.isString(newVal) && newVal !== '')?newVal : undefined;
      });

      attrs.$observe('offset', function( newVal ) {
        scope.apiConfig.offset = (angular.isString(newVal) && newVal !== '')?newVal : undefined;
      });

      attrs.$observe('limit', function( newVal ) {
        scope.apiConfig.limit = (angular.isString(newVal) && newVal !== '')?newVal : undefined;
      });

      attrs.$observe('filter', function( newVal ) {
        scope.apiConfig.filter = (angular.isString(newVal) && newVal !== '')?newVal : undefined;
      });

      attrs.$observe('value', function( newVal ) {
        scope.apiConfig.value = (angular.isString(newVal) && newVal !== '')?newVal : undefined;
      });
      
      
    },
    controller: function($scope, plusCollection) {
      if(angular.isUndefined($scope.collection)) $scope.collection = {};

      $scope.$watch('apiConfig', function(newVal){
        checkValues(newVal);
      }, true);

      function checkValues(values){
        values.offset = (angular.isUndefined(values.offset))?0:values.offset;
        values.limit = (angular.isUndefined(values.limit))?20:values.limit;
        values.filter = (angular.isUndefined(values.filter))?'':values.filter;
        values.value = (angular.isUndefined(values.value))?'':values.value;
        if(values.collection !== '' && values.offset !== '' && values.limit !== ''){
          updateCollection(values);
        }
      }

      function updateCollection(values){
        plusCollection.structure(values.collection, function(data){
          $scope.collection.structure = data;
        });

		var opts= {
			limit : values.limit,
			offset : values.offset
		}

		if(values.filter)
			opts[values.filter] = values.value

		console.log(opts);

        plusCollection.get(values.collection, opts, function(data){
          $scope.collection.data = data;
        });
      }
            
    }
  }
});