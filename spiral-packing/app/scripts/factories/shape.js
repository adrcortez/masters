'use strict';

angular.module('spiralApp')

    .factory('Shape', function (Color) {

        // Define the constructor
        function Shape () {
            this.setFill(null);
            this.setStroke('#000');
            this.setStrokeWidth(1);
        }


        // Instance methods
        Shape.prototype = {

            getFill: function () {
                return this.fill;
            },

            setFill: function (value) {
                this.fill = (value && typeof value === 'object') ?
                    value : new Color(value);
            },


            getStroke: function () {
                return this.stroke;
            },

            setStroke: function (value) {
                this.stroke = (value && typeof value === 'object') ?
                    value : new Color(value);
            },


            getStrokeWidth: function () {
                return this.strokeWidth;
            },

            setStrokeWidth: function (value) {
                this.strokeWidth = Math.abs(value || 0);
            }
        };


        // Return the constructor
        return Shape;
    });
