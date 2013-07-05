$app.directive('plusData', function () {
    return {
    restrict: 'EA',
    link : function(scope, element, attrs){
      scope.apiConfig = {};
      
      attrs.$observe('collection', function( newVal ) {
        scope.apiConfig.collection = (_.isString(newVal) && !_.isEmpty(newVal))?newVal : undefined;
      });

      attrs.$observe('offset', function( newVal ) {
        scope.apiConfig.offset = (_.isString(newVal) && !_.isEmpty(newVal))?newVal : undefined;
      });

      attrs.$observe('limit', function( newVal ) {
        scope.apiConfig.limit = (_.isString(newVal) && !_.isEmpty(newVal))?newVal : undefined;
      });

      attrs.$observe('filter', function( newVal ) {
        scope.apiConfig.filter = (_.isString(newVal) && !_.isEmpty(newVal))?newVal : undefined;
      });

      attrs.$observe('value', function( newVal ) {
        scope.apiConfig.value = (_.isString(newVal) && !_.isEmpty(newVal))?newVal : undefined;
      });
      
      
    },
    controller: function($scope, plus) {
      if(_.isUndefined($scope.collection)) $scope.collection = {};

      $scope.$watch('apiConfig', function(newVal){
        checkValues(newVal);
      }, true);

      function checkValues(values){
        values.offset = (_.isUndefined(values.offset))?'0':values.offset;
        values.limit = (_.isUndefined(values.limit))?'20':values.limit;
        values.filter = (_.isUndefined(values.filter))?'':values.filter;
        values.value = (_.isUndefined(values.value))?'':values.value;
        if(!_.isEmpty(values.collection) && !_.isEmpty(values.offset) && !_.isEmpty(values.limit)){
          updateCollection(values);
        }
      }

      function updateCollection(values){
        plus.collection.structure(values.collection).then(function(data){
          $scope.collection.structure = data;
        });

        plus.collection.get(values.collection, {limit : values.limit, offset: values.offset, filter : values.filter, value : values.value}).then(function(data){
          $scope.collection.data = data;
        });
      }
            
    }
  }
});