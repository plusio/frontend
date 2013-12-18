var geo;

angular.module('plus.geo', [])
	.factory('plusGeo', ['$rootScope', function($rootScope){
		if ("geolocation" in navigator) {
			/* geolocation is available */

			var callbacks = [],
				navigatorId,
				idMin = 0,
				idMax = 10;

			function geoSuccess(pos){
				//$scope.pos = pos;
				geo = angular.copy(pos);
				$rootScope.$apply(function(){
					callbacks.forEach(function(cb){
						cb.callback(pos);
					});
				});
				
			}

			function geoFail(err){
				$rootScope.$apply(function(){
					callbacks.forEach(function(cb){
						if(cb.error)
							cb.error(err);
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
				watchPosition : function(callback, error){
					
					var id;

					if(angular.isFunction(callback)){
						if(callbacks.length >= idMax){
							throw Error('Watch Position callbacks are at a maximum of ' + idMax + ', please remove some before adding more');
						}else{
							do{
								id = generateId(idMin, idMax);
							}while(findInArray('id', id, callbacks));

							callbacks.push({id : id, callback : callback});

							if(angular.isDefined(geo))
								callback(geo);
						}
						
					
					}else{
						throw Error('Callback must be defined as a Function');
					}

					if(angular.isFunction(error)){
						findInArray('id', id, callbacks).error = error;
					}


					this.startMonitoring();

					return id;
				},
				clearWatch : function(id, keepMonitoring){
					callbacks.forEach(function(cb, i){
						if(cb.id == id){
							callbacks.splice(i, 1);
						}
					});
					if(callbacks.length == 0 && keepMonitoring != true)
						navigator.geolocation.clearWatch(navigatorId);
				},
				getWatches : function(){
					return callbacks;
				},
				startMonitoring : function(){
					if(angular.isUndefined(navigatorId))
						navigatorId = navigator.geolocation.watchPosition(geoSuccess, geoFail, { enableHighAccuracy: true });

					return navigatorId;
				}

			}
		} else {
			/* geolocation IS NOT available */
			throw Error('Geolocation is NOT available');
		}
		
	}]);