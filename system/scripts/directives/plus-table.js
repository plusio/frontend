$app.directive('plusTable', function(){
  return {
    // restrict to an attribute (A = attribute, C = class, M = comment)
    restrict: 'A',
    template: '<table style="width: 100%;"><tr><th ng-repeat="head in headers">{{head}}</th></tr><tr ng-repeat="row in rows | filter:search"><td ng-repeat="data in row">{{data}}</td></tr></table>',
    controller: function($scope) {
      
    },
    replace: true,
    //the link method does the work of setting the directive up, things like bindings, jquery calls, etc are done in here
    link: function(scope, elem, attrs) {

      scope.predicate = '';
      scope.reverse = false;
      scope.theFilter = 'search';
      var cols = scope.$eval(attrs.cols);

      scope.$watch(attrs.tyTable, function (value) {

        scope.rows = [];
        scope.headers = [];

        for(var i in value){
          var row = value[i];

          scope.rows[i] = [];

          for(var r in row){
            if(_.isArray(cols) && !_.contains(cols, r)){
              console.log('array', cols, r, _.contains(cols, r));
              continue;
            }

            if(_.isObject(cols) && !_.isArray(cols) && _.isUndefined(cols[r]))
              continue;

            if(i == 0){
                if(_.isUndefined(cols[r])){
                  scope.headers.push(r);
                }else{
                  scope.headers.push(cols[r]);
                }
            }

            scope.rows[i].push(row[r]);
          }
        }
      });
    }
  }
});