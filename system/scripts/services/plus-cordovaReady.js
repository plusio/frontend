/*
 * This factory will 'queue' all cordova commands, and will only run them once the 'device ready' cordova event runs.
 * http://briantford.com/blog/angular-phonegap.html
 */
$app.factory('cordovaReady', function() {
  return function (fn) {

    var queue = [];

    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);

    return function () {
      return impl.apply(this, arguments);
    };
  };
});
