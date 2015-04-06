'use strict';

angular.module('spiralApp')

    .factory('Color', function () {

        // Define the constructor.
        function Color (color) {
            this.setColor(color);
        }


        // Instance methods
        Color.prototype = {

            toHex: function () {
                return this.color.toHex();
            },

            toRgb: function () {
                return this.color.toRgb()
            },

            setColor: function (value) {
                this.color = tinycolor(value || '#000');
            },

            toString: function (format) {
                return this.color.toString(format || 'hex');
            }
        };


        // Return constructor
        return Color;
    })

    .factory('Gradient', function (Color) {

        // Define the constructor.
        function Gradient (color1, color2, angle) {
            this.setColor1(color1);
            this.setColor2(color2);
            this.setAngle(angle);
        }


        // Instance methods
        Gradient.prototype = {

            getColor1: function () {
                return this.color1;
            },

            setColor1: function (value) {
                this.color1 = new Color(value);
            },


            getColor2: function () {
                return this.color2;
            },

            setColor2: function (value) {
                this.color2 = new Color(value);
            },


            getAngle: function () {
                return this.angle;
            },

            setAngle: function (value) {
                this.angle = value || 0;
            },


            split: function (n) {

                // Ensure that n is positive and non-zero integer
                n = (n < 0) ? 1 : n || 1;
                n = Math.round(n);

                // Get the gradient colors as RGB
                var rgb1 = this.getColor1().toRgb(),
                    rgb2 = this.getColor2().toRgb();

                // Calculate the color deltas
                var dr = rgb2.r - rgb1.r,
                    dg = rgb2.g - rgb1.g,
                    db = rgb2.b - rgb1.b;

                // Split the gradient into parts
                var gradients = [];
                for (var i = 0; i < n; i++) {

                    // Calculate the first color for this part
                    var r1 = rgb1.r + (i/n) * dr,
                        g1 = rgb1.g + (i/n) * dg,
                        b1 = rgb1.b + (i/n) * db;

                    // Calculate the second color for this part
                    var r2 = rgb1.r + ((i+1)/n) * dr,
                        g2 = rgb1.g + ((i+1)/n) * dg,
                        b2 = rgb1.b + ((i+1)/n) * db;

                    // Construct the new partial gradient
                    var color1 = { r: r1, g: g1, b: b1 },
                        color2 = { r: r2, g: g2, b: b2 },
                        gradient = new Gradient(color1, color2, this.angle);

                    // Add this partial gradient to the list
                    gradients.push(gradient);
                }

                return gradients;
            }
        };


        // Return constructor
        return Gradient;
    });
