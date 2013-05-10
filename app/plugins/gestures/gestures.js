'use strict';

angular.module('angular-gestures', []);

/**
 * Inspired by AngularJS' implementation of "click dblclick mousedown..."
 * 
 * This ties in the Hammer 1.0.0 events to attributes like:
 * 
 * hm-tap="add_something()" hm-swipe="remove_something()"
 * 
 * and also has support for Hammer options with:
 * 
 * hm-tap-opts="{hold: false}"
 * 
 * or any other of the "hm-event" listed underneath.
 */
var HGESTURES = {
    hgDoubleTap : 'doubletap',
    hgDragStart : 'dragstart',
    hgDrag : 'drag',
    hgDragUp : 'dragup',
    hgDragDown : 'dragdown',
    hgDragLeft : 'dragleft',
    hgDragRight : 'dragright',
    hgDragEnd : 'dragend',
    hgHold : 'hold',
    hgPinch : 'pinch',
    hgPinchIn : 'pinchin',
    hgPinchOut : 'pinchout',
    hgRelease : 'release',
    hgRotate : 'rotate',
    hgSwipe : 'swipe',
    hgSwipeUp : 'swipeup',
    hgSwipeDown : 'swipedown',
    hgSwipeLeft : 'swipeleft',
    hgSwipeRight : 'swiperight',
    hgTap : 'tap',
    hgTouch : 'touch',
    hgTransformStart : 'transformstart',
    hgTransform : 'transform',
    hgTransforEnd : 'transformend'
};

var VERBOSE = false;

angular.forEach(HGESTURES, function(eventName, directiveName) {
    $app.directive(
            directiveName,
            ['$parse', '$log', function($parse, $log) {
                return function(scope, element, attr) {
                    attr.$observe(directiveName, function(value) {
                        var fn = $parse(value);
                        var opts = $parse(attr[directiveName + 'Opts'])
                        (scope, {});
                        new Hammer(element[0], opts).on(eventName,
                                function(event) {
                                    if (VERBOSE) {
                                        $log.log('angular-gestures: %s',
                                                eventName);
                                    }
                                    scope.$apply(function() {
                                        fn(scope, { $event : event });
                                    });
                                });
                    });
                };
            }]);
});