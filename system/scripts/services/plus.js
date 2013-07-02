'use strict';

$app.factory('plus', function(plusCollection, auth) { 
    var plus = {};
    plus.ui = {}; // need to add ui service (dialog, etc)
    plus.collection = plusCollection;
    plus.auth = auth;

    return plus;
});