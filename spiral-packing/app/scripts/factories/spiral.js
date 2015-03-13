'use strict';

angular.module('spiralApp')
    .factory('Spiral', function () {

        // Define the constructor function.
        function Spiral (sweep, width, theta, omega, cx, cy) {
            this.sweep = sweep || 3;
            this.width = width || 5;
            this.theta = theta || 0;
            this.omega = omega || 1;
            this.cx = cx || 0;
            this.cy = cy || 0;
        }


        // Instance methods
        Spiral.prototype = {

            getRadius: function () {
                return this.width * this.sweep;
            },

            branch: function (cx, cy) {

                // The child spiral will have the same number of turns,
        		// width and orientation as the parent to start
        		var sweep = this.sweep;
        		var width = this.width;
        		var omega = this.omega;

        		var end = 2 * Math.PI * sweep;
        		var radius = this.getRadius();

        		var tx = Math.cos(end) * radius + cx;
        		var ty = Math.sin(end) * radius + cy;

        		var px = this.cx;
        		var py = this.cy;

        		var dotp = (tx-cx)*(px-cx) + (ty-cy)*(py-cy);
        		var magt = Math.sqrt((tx-cx)*(tx-cx) + (ty-cy)*(ty-cy));
        		var magp = Math.sqrt((px-cx)*(px-cx) + (py-cy)*(py-cy));

                // console.log('dotp = ' + dotp);
                // console.log('magt = ' + magt);
                // console.log('magp = ' + magp);
                // console.log();

        		var gradient = ((ty-py) / (tx-px)) > 0 ? 1 : -1;
                // console.log('gradient = ' + gradient);

        		// Calculate theta using the dot product and magnitudes
        		var theta = Math.acos(dotp / magt * magp);
        		theta = 180 / Math.PI * gradient * theta;
                // console.log(theta);
                // console.log();

        //		// Rotate the child spiral so that the terminal point is
        //		// on the line from the parent's center to the desired position.
        //		double dy = center.getY() - this.getCenter().getY();
        //		double dx = center.getX() - this.getCenter().getX();
        //		double theta = Math.toDegrees(Math.atan2(dy, dx));

        		// TODO: Adjust the center when needed
                console.log('p = (' + px + ', ' + py + ')');
                console.log('c = (' + cx + ', ' + cy + ')');
                console.log('t = (' + tx + ', ' + ty + ')');
                console.log();

                // Return the child spiral
        		return new Spiral(sweep, width, theta, omega, cx, cy);
            },
        };


        // Return constructor
        return Spiral;
    });
