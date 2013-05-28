/*
 * This geolocation service will use cordova geolocation api to get the user's location
 * http://briantford.com/blog/angular-phonegap.html
 */
// $app.factory('geolocation', function ($rootScope, cordovaReady) {
//   return {
//     getCurrentPosition: cordovaReady(function (onSuccess, onError, options) {
//       navigator.geolocation.getCurrentPosition(function () {
//         var that = this,
//           args = arguments;

//         if (onSuccess) {
//           $rootScope.$apply(function () {
//             onSuccess.apply(that, args);
//           });
//         }
//       }, function () {
//         var that = this,
//           args = arguments;

//         if (onError) {
//           $rootScope.$apply(function () {
//             onError.apply(that, args);
//           });
//         }
//       },
//       options);
//     })
//   };
// });

$app.factory('geolocation', function ($rootScope, cordovaReady) {
  return {
    getCurrentPosition: function (onSuccess, onError, options) {
      navigator.geolocation.getCurrentPosition(function () {
        var that = this,
          args = arguments;

        if (onSuccess) {
          $rootScope.$apply(function () {
            onSuccess.apply(that, args);
          });
        }
      }, function () {
        var that = this,
          args = arguments;

        if (onError) {
          $rootScope.$apply(function () {
            onError.apply(that, args);
          });
        }
      },
      options);
    }
  };
});