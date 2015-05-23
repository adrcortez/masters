'use strict';


//*** This code is copyright 2011 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
// path:      an SVG <path> element
// threshold: a 'close-enough' limit (ignore subdivisions with area less than this)
// segments:  (optional) how many segments to subdivisions to create at each level
// returns:   a new SVG <polygon> element
function pathToPolygon (path, threshold, segments){
    threshold = threshold || 0.0001;
    segments = segments || 3;

    // Record the distance along the path with the point for later reference
    function ptWithLength (d) {
        var pt = path.getPointAtLength(d);
        pt.d = d;

        return pt;
    }

    // Calculate the area of an polygon represented by an array of points
    function polyArea (points) {
        var p1,p2;
        var len = points.length,
        area = 0;

        for (var i = 0; i < len; i++) {
            p1 = points[i];
            p2 = points[(i - 1 + len) % len]; // Previous point, with wraparound
            area += (p2.x+p1.x) * (p2.y-p1.y);
        }

        return Math.abs(area/2);
    }

    // Create segments evenly spaced between two points on the path.
    // If the area of the result is less than the threshold return the endpoints.
    // Otherwise, keep the intermediary points and subdivide each consecutive pair.
    function subdivide (p1, p2) {
        var step = (p2.d - p1.d) / segments,
            pts = [p1];

        for (var i = 1; i < segments; i++) {
            pts[i] = ptWithLength(p1.d + step*i);
        }

        pts.push(p2);

        if (polyArea(pts) <= threshold) {
            return [p1, p2];
        } else {
            var result = [];
            for (var i=1;i<pts.length;++i){
                var mids = subdivide(pts[i-1], pts[i]);
                mids.pop(); // We'll get the last point as the start of the next pair
                result = result.concat(mids)
            }
            result.push(p2);
            return result;
        }
    }


    var p0 = ptWithLength(0),
        p1 = ptWithLength(path.getTotalLength()),
        points = subdivide(p0, p1);

    for (var i = points.length; i--;) {
        points[i] = [points[i].x, points[i].y];
    }

    var doc  = path.ownerDocument;
    var poly = doc.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttributeNS(null, 'points', points.join(' '));
    return poly;
}



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
            };


            // Return the constructor
            return Line;
        }
    ])


    .factory('Polygon', [
        'Point2',
        'Line',

        function (Point2, Line) {

            // Constructor
            function Polygon () {
                this.current = null;
                this.lines = [];
                this.path = '';
            }


            // Instance methods
            Polygon.prototype = {

                getLines: function () {
                    return this.lines;
                },

                moveTo: function (x, y) {
                    this.path += 'M' + x +',' + y + ' ';
                    this.current = new Point2(x, y);
                    return this;
                },

                lineTo: function (x, y) {
                    var sx = this.current.x,
                        sy = this.current.y;

                    var line = new Line(sx, sy, x, y);
                    this.lines.push(line);

                    this.path += 'L' + x +',' + y + ' ';
                    this.current = new Point2(x, y);
                    return this;
                },

                curveTo: function (x, y, cx, cy) {
                    var sx = this.current.x,
                        sy = this.current.y;

                    var line = new Line(sx, sy, x, y, cx, cy);
                    this.lines.push(line);

                    this.path += 'Q' + cx +',' + cy + ' ' + x + ',' + y + ' ';
                    this.current = new Point2(x, y);
                    return this;
                },

                getArea: function () {

                    var path = document.createElementNS('http://www.w3.org/2000/svg','path');
                    path.setAttributeNS(null, 'd', this.path);

                    // Subdivide the path in to polygon
                    var polygon = pathToPolygon(path),
                        pts = polygon.points,
                        len = pts.numberOfItems;

                    // Total the area of each subdivision
                    var area = 0;
                    for(var i = 0; i < len; i++) {
                        var p1 = pts.getItem(i),
                            p2 = pts.getItem((i - 1 + len) % len);
                        area += (p2.x+p1.x) * (p2.y-p1.y);
                    }

                    // Return the approximated area
                    return Math.abs(area/2);
                }
            };


            // Return the constructor
            return Polygon;
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
