var plus;

angular.module('plus', []).run(function(plusCollection, plusGeo){
	plus = {
		geo : plusGeo,
		collection : plusCollection
	}
});