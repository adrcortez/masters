'use strict';

angular.module('spiralApp')

    .factory('Point2', function () {

        // Define the constructor.
        function Point2 (x, y) {
            this.x = x || 0;
            this.y = y || 0;
            this.color = null;
        }


        // Instance methods
        Point2.prototype = {

            getSquaredDistance: function (p) {
                var dx = p.x - this.x;
                var dy = p.y - this.y;
                return dx*dx + dy*dy;
            },

            getDistance: function (p) {
                var d = this.getSquaredDistance(p);
                return Math.sqrt(d);
            },

            equals: function (p) {
                return this.x === p.x && this.y === p.y;
            },

            toString: function () {
                return '(' + this.x + ', ' + this.y + ')';
            }
        };


        Point2.copy = function (p) {
            return p ? new Point2(p.x, p.y) : null;
        };


        // Return constructor
        return Point2;
    })


    .factory('Vector2', function (Point2) {

        // Define the constructor.
        function Vector2 (p0, p1) {
            this.p0 = p0 || new Point2();
            this.p1 = p1 || new Point2();
        }


        // Instance methods
        Vector2.prototype = {

            dx: function () {
                return this.p1.x - this.p0.x;
            },

            dy: function () {
                return this.p1.y - this.p0.y;
            },

            slope: function () {
                var dx = this.dx();
                var dy = this.dy();
                return dx / dy;
            },

            direction: function () {
                return this.slope() >= 0 ? 1 : -1;
            },

            magnitude: function () {
                var dx = this.dx();
                var dy = this.dy();
                return Math.sqrt(dx*dx + dy*dy);
            },

            dotProduct: function (v) {
                var px = this.dx() * v.dx();
                var py = this.dy() * v.dy();
                return px + py;
            },

            normalize: function () {
                var dx = this.dx(),
                    dy = this.dy(),
                    m = this.magnitude();

                // Get the coordinates of the unit vector
                var x = dx / m,
                    y = dy / m;

                // Return the normalized (unit) vector
                return new Vector2(ORIGIN, new Point2(x, y));
            },

            angle: function (v) {

                // Normalize the vectors
                var v1 = this.normalize(),
                    v2 = (v || UNIT_X).normalize();

                // Calculate the angle between the normalized vectors
                var dp = v1.dotProduct(v2),
                    m0 = v1.magnitude(),
                    m1 = v2.magnitude(),
                    angle = Math.acos(dp / (m0 * m1)) || 0;

                // Inverse coordinate system, if y2 is greater
                // than y1 it is actually below y1, so the angle
                // would be positive (clockwise)
                return (v2.p1.y >= v1.p1.y) ? angle : -angle;
            }
        };

        var ORIGIN = new Point2(0, 0),
            UNIT_X = new Vector2(ORIGIN, new Point2(1, 0)),
            UNIT_Y = new Vector2(ORIGIN, new Point2(0, 1));

        // Return constructor
        return Vector2;
    });
