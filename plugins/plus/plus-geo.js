var geo;

angular.module('plus.geo', [])
	.factory('plusGeo', ['$rootScope', function($rootScope){
		if ("geolocation" in navigator) {
			/* geolocation is available */

			var callbacks = [],
				navigatorId,
				idMin = 0,
				idMax = 10;

			function updateGeo(pos){
				//$scope.pos = pos;
				geo = angular.copy(pos);
				$rootScope.$apply(function(){
					callbacks.forEach(function(cb){
						cb.callback(pos);
					});
				});
				
			}

			function generateId(min, max){
				return Math.floor(Math.random() * (max - min + 1) + min);
			}

			function findInArray(key, value, arr){
				foundItem = false;
				arr.forEach(function(item){
					if(item[key] == value)
						foundItem = item;
				});

				if(foundItem)
					return foundItem;

				return false;
			}

			return {
				watchPosition : function(callback){
					// PASS IN ERROR CALLBACK, AND OPTIONS
					var id;

					if(angular.isFunction(callback)){
						if(callbacks.length == idMax){
							console.error('Watch Position callbacks are at a maximum of ' + idMax + ', please remove some before adding more');
						}else{
							do{
								id = generateId(idMin, idMax);
							}while(findInArray('id', id, callbacks));

							callbacks.push({id : id, callback : callback});

							if(angular.isDefined(geo))
								callback(geo);
						}
						
					
					}


					if(angular.isUndefined(navigatorId))
						navigatorId = navigator.geolocation.watchPosition(updateGeo);

					return id;
				},
				clearWatch : function(id){
					callbacks.forEach(function(cb, i){
						if(cb.id === id){
							callbacks.splice(i, 1);
						}
					});
				}
			}
		} else {
			/* geolocation IS NOT available */
			console.error('Geolocation is NOT available');
		}
		
	}]);