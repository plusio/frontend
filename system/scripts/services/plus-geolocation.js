// http://jsfiddle.net/4BVVQ/2/
$app.factory('geolocation', ['$q', '$rootScope', function($q, $rootScope) {
    return function() {
        var d = $q.defer();
        setTimeout(function () {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            $rootScope.$apply(function () {
                                d.resolve(position);
                            });
                        },
                        function (error) {
                            d.reject(error);
                        }
                    );
                }
                else {
                    d.reject('location services not allowed');
                }
            }
            catch (err) {
                d.reject(err);
            }
        }, 1000);
        return d.promise;
    };}]);