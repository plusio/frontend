angular.module('plus.api', [])
  .factory('plusCollection', ['$http', function($http){
  	var baseUrl = 'https://' + app.projectId + '.appspot.com/collection/';
  	var callbackKey = '?callback=JSON_CALLBACK&secret_key=' + app.serverSecret;
    return{
		get: function(collection, filter, callback, error){
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				console.error('Collection must be specified as a string');
				return;
			}
			if(angular.isFunction(filter)){
				if(angular.isFunction(callback))
					error = callback;

				callback = filter;

			}else{
				if(!angular.isFunction(callback)){
					console.error('A Callback is required for get requests');
					return;
				}

				if(angular.isObject(filter) && !angular.isArray(filter)){
					console.log('the filter is an object!');
					//TODO
				}else if(parseInt(filter) && !isNaN(filter)){
					var id = '/' + filter;
				}else{
					console.error('filter is an invalid value');
				}
			}

		  $http.jsonp(baseUrl + collection + (id || '') + callbackKey).success(callback).error(error || function(){});
		},
		add: function(collection, data, callback, error){
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				console.error('Collection must be specified as a string');
				return;
			}

			if(!angular.isDefined(data)){
				console.error('Data is required to be added to the collection.');
				return;
			}

			if(angular.isObject(data) && !angular.isArray(data)){
				if(angular.isDefined(callback) && !angular.isFunction(callback)){
					console.error('Callback must be defined as a function');
					return;
				}

				if(angular.isDefined(error) && !angular.isFunction(error)){
					console.error('Error callback must be defined as a function');
					return;
				}

				if(!angular.isDefined(data.time))
					data.time = new Date().getTime().toString();

				//restrict keys that reserved in Mongo

				$http.post(baseUrl + collection + callbackKey, data, {}).success(callback || function(){}).error(error || function(){});
			}else{
				console.error('Data must be an Object.');
				return;
			}
			
		},
		delete: function(collection, id, callback, error){
			console.log(error);
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				console.error('Collection must be specified as a string');
				return;
			}

			if(!parseInt(id) || isNaN(id)){
				console.error('The id must be a defined as a valid id (integer)');
				return;
			}

			if(angular.isDefined(callback) && !angular.isFunction(callback)){
				console.error('Callback must be defined as a function');
				return;
			}

			if(angular.isDefined(error) && !angular.isFunction(error)){
				console.error('Error callback must be defined as a function');
				return;
			}

			$http.delete(baseUrl + collection + '/' + id + '?secret_key=' + app.serverSecret).success(callback || function(){}).error(error || function(){});
		},
		update: function(collection, id, data, callback, error){
			if(!angular.isDefined(collection) || !angular.isString(collection)){
				console.error('Collection must be specified as a string');
				return;
			}

			if(!parseInt(id) || isNaN(id)){
				console.error('The id must be a defined as a valid id (integer)');
				return;
			}

			if(!angular.isDefined(data)){
				console.error('Data is required to be added to the collection.');
				return;
			}

			if(angular.isObject(data) && !angular.isArray(data)){
				if(angular.isDefined(callback) && !angular.isFunction(callback)){
					console.error('Callback must be a function');
					return;
				}

				if(angular.isDefined(error) && !angular.isFunction(error)){
					console.error('Error callback must be a function');
					return;
				}

				if(!angular.isDefined(data.time))
					data.time = new Date().getTime().toString();

				$http.post(baseUrl + collection + '/' + id + callbackKey, data, {}).success(callback || function(){}).error(error || function(){});
			}else{
				console.error('Data must be an Object.');
				return;
			}
		}
    };
  }]);