angular.module('plus.api', [])
  .factory('plusCollection', ['$http', function($http){
    return{
		get: function(collection, callback){
		  $http.jsonp('https://' + app.projectId + '.appspot.com/collection/' + collection + '?callback=JSON_CALLBACK&secret_key=' + app.serverSecret).success(callback);
		},
		post: function(collection, data, callback){
			$http.post('https://' + app.projectId + '.appspot.com/collection/' + collection + '?callback=JSON_CALLBACK&secret_key=' + app.serverSecret, data, {}).success(callback);
		},
		delete: function(collection, id, callback){
			$http.delete('https://' + app.projectId + '.appspot.com/collection/' + collection + '/' + id + '?secret_key=' + app.serverSecret).success(callback);
		},
		update: function(collection, id, data, callback){
			$http.post('https://' + app.projectId + '.appspot.com/collection/' + collection + '/' + id + '?callback=JSON_CALLBACK&secret_key=' + app.serverSecret, data, {}).success(callback);
		}
    };
  }]);