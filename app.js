$app.controller('home', function($scope, plusCollection, plusGeo){
	$scope.addGeoCallback = function(){
		plusGeo.watchPosition(function(pos){
			console.log('watch callback for ' + Math.floor(Math.random() * 100) +1);
		});
	}
});