'use strict';


angular.module('svg.factories', [])


    .factory('Line', [
        'Point2',

        function (Point2) {

            // Constructor
            function Line (sx, sy, ex, ey, cx, cy) {
                this.start = new Point2(sx, sy);
                this.end = new Point2(ex, ey);

                this.control = angular.isDefined(cx) && angular.isDefined(cy) ?
                    new Point2(cx, cy) : null;
            }


            // Instance methods
            Line.prototype = {

                getPoint: function (t) {

                    // Make sure t is between 0 and 1
                    t = Math.max(t, 0);
                    t = Math.min(t, 1);

                    var x, y;

                    if (this.control) {

                        // Quadratic bezier
                        x = (1-t)*(1-t)*this.start.x + 2*(1-t)*t*this.control.x + t*t*this.end.x;
                        y = (1-t)*(1-t)*this.start.y + 2*(1-t)*t*this.control.y + t*t*this.end.y;
                    } else {

                        // Linear bezier (line)
                        x = (1-t)*this.start.x + t*this.end.x;
                        y = (1-t)*this.start.y + t*this.end.y;
                    }

                    return new Point2(x, y);
                },

                getLength: function () {
                    var dx = this.end.x - this.start.x,
                        dy = this.end.y - this.start.y;

                    return Math.sqrt(dx*dx + dy*dy);
                }

                // // addControlPoint: function (x, y) {
                // //     this.points.splice(-1, 0, new Point2(x, y));
                // // },
                // //
                // // getStartPoint: function () {
                // //     return this.points[0];
                // // },
                // //
                // // getEndPoint: function () {
                // //     return this.points.slice(-1)[0];
                // // },
                // //
                // // getControlPoints: function () {
                // //     return this.points.slice(1, -1);
                // // },
                // //
                // // getLength: function () {
                // //     var s = this.getStartPoint(),
                // //         e = this.getEndPoint(),
                // //         dx = e.x - s.x,
                // //         dy = e.y - s.y;
                // //
                // //     return Math.sqrt(dx*dx + dy*dy);
                // // },
                //
                // getPoint: function (t) {
                //
                //     // Make sure t is between 0 and 1
                //     t = Math.max(t, 0);
                //     t = Math.min(t, 1);
                //
                //     var s = this.getStartPoint(),
                //         e = this.getEndPoint();
                //
                //     var x = (1-t) * s.x + t * e.x,
                //         y = (1-t) * s.y + t * e.y;
                //
                //     var controls = this.getControlPoints(),
                //         n = (controls.length || 0) + 1;
                //
                //     angular.forEach(controls, function (p, i) {
                //         var c = $math.choose(n, i) * $math.pow(1-t, n-i) * $math.pow(t, i);
                //         x += c * p.x;
                //         y += c * p.y;
                //     });
                //
                //     return new Point2(x, y);
                //     //
                //     //     ex = this.end.x,   ey = this.end.y,
                //     //     cx = this.control && this.control.x,
                //     //     cy = this.control && this.control.y,
                //     //     x , y;
                //     //
                //     //
                //     // if (this.control) {
                //     //     var cx = this.control.x, cy = this.control.y;
                //     //
                //     //     x = (1-t)*(1-t)*sx + 2*t*(t-1)*cx + t*t*ex;
                //     //     y = (1-t)*(1-t)*sy + 2*t*(t-1)*cy + t*t*ey;
                //     // } else {
                //     //     x = (1-t)*sx + t*ex;
                //     //     y = (1-t)*sy + t*ey;
                //     // }
                //     //
                //     // return new Point2(x, y);
                // }
            };


            // Return the constructor
            return Line;
        }
    ])


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
