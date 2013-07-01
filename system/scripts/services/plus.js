'use strict';

$app.factory('plus', function(plusCloud, auth) { 
    var plus = {};
    plus.ui = {}; // need to add ui service (dialog, etc)
    plus.cloud = plusCloud;
    plus.auth = auth;

    return plus;
});