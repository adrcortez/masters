'use strict';


angular.module('svg.factories', [])


    .factory('Color', [
        function () {

            // Define the constructor.
            function Color (color) {
                this.color = tinycolor(color || 'transparent');
            }

            // Instance methods
            Color.prototype = {

                toRgb: function () {
                    return this.color.toRgb();
                },

                toString: function (fmt) {
                    return this.color.toString(fmt || 'hex');
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
        }
    ]);
