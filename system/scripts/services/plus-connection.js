/* Phone gap service to detect network connection on mobile device. 
 * This service uses an angular phone gap service created by Brian Ford: http://briantford.com 
 */

'use strict';
$app.factory('connection', ['phonegapReady', function ($rootScope, phonegapReady) {
    var getConnectionType = function() {
          if (angular.isUndefined(navigator.network)) { 
            // probably a desktop machine 
            return true;  
          }

          var networkState = navigator.network.connection.type;
          var states = {};
          states[Connection.UNKNOWN]  = 'Unknown connection';
          states[Connection.ETHERNET] = 'Ethernet connection';
          states[Connection.WIFI]     = 'WiFi connection';
          states[Connection.CELL_2G]  = 'Cell 2G connection';
          states[Connection.CELL_3G]  = 'Cell 3G connection';
          states[Connection.CELL_4G]  = 'Cell 4G connection';
          states[Connection.NONE]     = 'No network connection';

          return states[networkState];
        };
    return {
            checkConnection: function() { 
              getConnectionType(); 
            },
            hasNetworkConnection: function(){
              return (getConnectionType() == 'No network connection');
           }
    };
  }]);