'use strict';

angular.module('spiralApp')

    .factory('Path', function (Shape, Point2) {

        // Define the constructor.
        function Path () {

            // Call the parent constructor
            Shape.call(this);

            this.points = [];
            this.path = '';
        }


        // Extend the parent
        Path.prototype = Object.create(Shape.prototype);
        Path.prototype.constructor = Path;


        // Add the instance methods
        angular.extend(Path.prototype, {

            getFirstPoint: function () {
                return this.points[0];
            },

            getLastPoint: function () {
                return this.points[this.points.length - 1];
            },

            moveTo: function (point) {
                this.path += 'M ' + point.x + ' ' + point.y + ' ';
                this.points.push(point);
                return this;
            },

            lineTo: function (point) {
                this.path += 'L ' + point.x + ' ' + point.y + ' ';
                this.points.push(point);
                return this;
            },

            bezierTo: function (point, control) {
                this.path += 'Q ' + control.x + ' ' + control.y + ' ' + point.x   + ' ' + point.y   + ' ';
                this.points.push(point);
                return this;
            },

            close: function () {
                this.path += 'Z ';
                return this;
            },

            toString: function () {
                return this.path;
            }
        });


        // Returns a control point for a quadratic bezier
        // curve that starts at p0, terminates at p2 and
        // goes through p1
        Path.getControlPoint = function (p0, p1, p2) {
            var x = 2*p1.x - p0.x/2 - p2.x/2,
                y = 2*p1.y - p0.y/2 - p2.y/2;

            return new Point2(x, y);
        };


        // Return constructor
        return Path;
    });
