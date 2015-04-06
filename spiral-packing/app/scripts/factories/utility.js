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
                // Inverse y coordinate system
                return this.p0.y - this.p1.y;
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

            angle: function (v) {
                var dp = this.dotProduct(v);
                var m0 = this.magnitude();
                var m1 = v.magnitude();
                return Math.acos(dp / (m0 * m1)) || 0;
            }
        };


        // Return constructor
        return Vector2;
    })


    .factory('Path', function () {

        // Define the constructor.
        function Path () {
            this.points = [];
            this.color = null;
        }


        // Instance methods
        Path.prototype = {

            addPoint: function (p) {
                this.points.push(p);
            },

            getColor: function () {
                return this.color;
            },

            setColor: function (c) {
                this.color = c || null;
            },

            toString: function () {

                // Return an empty path if no points
                if (this.points.length === 0) {
                    return '';
                }

                // Build the path string
                var str = 'M';
                for (var i = 0; i < this.points.length; i++) {
                    var p = this.points[i];
                    str += p.x + ' ' + p.y + ' ';
                }

                // Ensure an even number of points
                if (this.points.length % 2 === 1) {
                    var p = this.points[this.points.length - 1];
                    str += p.x + ' ' + p.y;
                }

                return str;
            }
        };


        // Return constructor
        return Path;
    });
