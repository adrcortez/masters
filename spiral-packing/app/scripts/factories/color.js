'use strict';

angular.module('main')

    .factory('Color', function () {

        // Define the constructor.
        function Color (color, offset) {
            this.color = tinycolor(color || 'transparent');
        }


        // Instance methods
        Color.prototype = {

            isGradient: function () {
                return false;
            },

            toRgb: function () {
                return this.color.toRgb();
            },

            toString: function (format) {
                return this.color.toString(format || 'hex');
            }
        };


        Color.split = function (n, colors) {

            // Ensure that n is positive and non-zero integer
            n = (n < 0) ? 1 : n || 1;
            n = Math.ceil(n);

            // Need more than one color to properly split
            if (!colors || colors.length < 2) {
                return colors;
            }

            // The split color list
            var split = [];

            // Loop limits
            var M = colors.length - 1,
                N = n / M;

            for (var i = 0; i < M; i++) {

                // Coerce the colors into Color objects
                var color1 = new Color(colors[i]),
                    color2 = new Color(colors[i+1]);

                // Get the gradient colors as RGB
                var rgb1 = color1.toRgb(),
                    rgb2 = color2.toRgb();

                // Calculate the color deltas
                var dr = rgb2.r - rgb1.r,
                    dg = rgb2.g - rgb1.g,
                    db = rgb2.b - rgb1.b;

                // Split the gradient into parts
                for (var j = 0; j < N ; j++) {

                    // Calculate the first color for this part
                    var r = rgb1.r + (j/N) * dr,
                        g = rgb1.g + (j/N) * dg,
                        b = rgb1.b + (j/N) * db;

                    // Construct the new color
                    var color = new Color({ r: r, g: g, b: b })
                        .toString('hex');

                    split.push(color);
                }
            }

            return split;
        };


        // Return constructor
        return Color;
    })

    .factory('Gradient', function (Color) {

        // Define the constructor.
        function Gradient (color1, color2, x1, y1, x2, y2) {
            this.color1 = new Color(color1);
            this.color2 = new Color(color2);
            this.x1 = x1 || 0; this.y1 = y1 || 0;
            this.x2 = x2 || 1; this.y2 = y2 || 0;
        }


        // Instance methods
        Gradient.prototype = {

            isGradient: function () {
                return true;
            },

            split: function (n) {

                // Ensure that n is positive and non-zero integer
                n = (n < 0) ? 1 : n || 1;
                n = Math.ceil(n);

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
