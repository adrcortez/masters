'use strict';

angular
	.module('directives.events', [])
    .directive('stopEvent', [

        function ($window) {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {

                    // Bind to the specified event or all events
                    var type = attrs.stopEvent ||
                        'blur focus focusin focusout load resize scroll ' +
                        'unload click dblclick mousedown mouseup mousemove ' +
                        'mouseover mouseout mouseenter mouseleave change ' +
                        'select submit keydown keypress keyup error';

                    // Cancel the desired event(s)
                    element.bind(type, function (e) {
                        e = e || $window.event;

                        // IE9+ and other browsers
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }

                        // < IE9
                        else {
                            e.cancelBubble = true;
                        }
                    });
                }
            };
        }
    ]);
