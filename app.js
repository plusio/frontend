$app.controller('home', function($scope, plusCollection, plusGeo){
	$scope.id = 0;
	$scope.theIds = [];
	$scope.addGeoCallback = function(){

		var x = Math.floor(Math.random() * 100) +1;
		$scope.theIds.push(plusGeo.watchPosition(function(){
			console.log('watch callback for ' + x);
		}));
	}

	$scope.removeCallback = function(){
		plusGeo.clearWatch($scope.id);
	}
});
