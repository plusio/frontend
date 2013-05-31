// http://jsfiddle.net/bY5qe/
$app.directive('plusResize', function ($window) {
    return function (scope) {
        angular.extend(scope, {
            window : {
                width : $window.innerWidth,
                height : $window.innerHeight,
            }
        });

        angular.element(window).bind('resize', function () {
            scope.$apply(function () {
                scope.window.width = window.innerWidth;
                scope.window.height = $window.innerHeight;
            });
        });
        };

    var getWindowWidth = function(){
        return window.innerWidth;
    }
    });