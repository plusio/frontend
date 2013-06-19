$app.directive('plusData', function ($timeout) {
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
      
    },
    //the controller for the directive
    controller: function($scope, plus) {
      if(_.isUndefined($scope.collection)) $scope.collection = {};

      $scope.$watch('apiConfig', function(newVal){
       // console.log(newVal);
        checkValues(newVal);
      }, true);

      function checkValues(values){
        //console.log(values);
        values.offset = (_.isUndefined(values.offset))?'0':values.offset;
        values.limit = (_.isUndefined(values.limit))?'20':values.limit;
        if(!_.isEmpty(values.collection) && !_.isEmpty(values.offset) && !_.isEmpty(values.limit)){
          updateCollection(values);
        }
      }



      function updateCollection(values){
        plus.structure(values.collection).then(function(data){
          angular.extend($scope.collection, {
            structure : data
          });
        });

        plus.collection(values.collection, {limit : values.limit, offset: values.offset}).then(function(data){
          angular.extend($scope.collection, {
            data : data
          });
        });
      }
            
    }
  }
});