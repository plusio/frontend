angular.module('plus.pageTransitions', [])
  .directive('go', ['$rootScope', '$location', '$timeout', '$route', function($rootScope, $location, $timeout, $route) {
  	var defaultTransition = app.pageTransition || 'slide-left';
  	$rootScope.animationClass = defaultTransition;

	return {
		restrict: 'ECA',
		link: function(scope, element, attrs) {
			// check if animation is set and is valid
			var external = attrs.go.substr(0, 4) == 'http'

			// if(!external && angular.isUndefined($route.routes[attrs.go])){
			// 	throw Error(attrs.go + ' is not a registered route, availible routes: ' + Object.keys($route.routes).join(', '));
			// 	return;
			// }

			Hammer(element[0]).on("touch", function() {
			    if(external){
					var ref = window.open(attrs.go, '_system', 'location=yes');
				}else{
					$rootScope.$apply(function(){
						if(angular.isDefined(attrs.animation)){
							if(attrs.animation == 'none'){
								$rootScope.animationClass = '';								
								document.getElementsByTagName('body')[0].style.opacity = 0;
							}else{
								$rootScope.animationClass = attrs.animation;								
							}
						}

						$location.path(attrs.go);

						$timeout(function(){
							//wait for the entering animation to begin then reset
							$rootScope.animationClass = defaultTransition;
						}, 100);
					});
				}
			});
		}
	};
}]);