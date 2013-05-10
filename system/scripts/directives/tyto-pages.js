$app.directive('tyPage', ['$route', '$http', function($route, $http) {
    return function(scope, elm, attrs) {
    	if(typeof scope.page == 'undefined')
    		scope.page = {};

    	$http.get('app/includes/content/' + $route.current.params.name + '.json').then(function(response) {
			if(response){

            //console.log(response.data.content);
            response.data.content = response.data.content.replace(/(\r\n|\n|\r)/gm,"");
            response.data.content = response.data.content.replace(/\s+/g," ");
            //console.log(response.data.content);

        		angular.extend(scope.page, response.data);
				elm.html(response.data.content);				
			}
   		});
   	}
}]);