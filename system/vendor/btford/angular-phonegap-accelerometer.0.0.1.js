/*
 * angular-phonegap-accelerometer v0.0.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.phonegap.accelerometer',
  ['btford.phonegap.ready']).
  factory('accelerometer', function ($rootScope, phonegapReady) {
    return {
      getCurrentAcceleration: phonegapReady(function (onSuccess, onError) {
        navigator.accelerometer.getCurrentAcceleration(function () {
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
        });
      })
    };
  });