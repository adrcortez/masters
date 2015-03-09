'use strict';

angular.module('spiralApp')
    .factory("Spiral", function () {

        // Define the constructor function.
        function Spiral (sweep, width, theta, omega, cx, cy) {
            this.sweep = sweep || 3;
            this.width = width || 5;
            this.theta = theta || 0;
            this.omega = omega || 1;
            this.cx = cx || 0;
            this.cy = cy || 0;
        };


        // Instance methods
        Spiral.prototype = {

            branch: function (spiral, cx, cy) {
                return null;
            },
        };


        // Return constructor
        return Spiral;
    });
