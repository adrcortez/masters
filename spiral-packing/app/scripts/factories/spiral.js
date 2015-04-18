'use strict';

angular
    .module('spiralApp')
    .factory('Spiral', function (epsilon, Shape, Path, Point2, Vector2, Circle, Color, Gradient) {

        // Constants
        var NUM_SEGMENTS = 20;


        // Define the constructor
        function Spiral (sweep, width, theta, omega, x, y) {

            // Call the parent constructor
            Shape.call(this);

            this.sweep = sweep || 0;
            this.width = width || 0;
            this.theta = theta || 0;
            this.omega = omega || 1;
            this.center = new Point2(x, y);

            this.parent = null;
            this.children = [];
        }


        // Extend the parent
        Spiral.prototype = Object.create(Shape.prototype);
        Spiral.prototype.constructor = Spiral;


        // Add the instance methods
        angular.extend(Spiral.prototype, {

            equals: function (s) {

                if (!s) {
                    return false;
                }

                return (
                    this.sweep === s.sweep &&
                    this.width === s.width &&
                    this.theta === s.theta &&
                    this.omega === s.omega &&
                    this.center.equals(s.center)
                );
            },

            clone: function () {
                return new Spiral(
                    this.sweep, this.width, this.theta,
                    this.omega, this.center);
            },

            getRadius: function (x, y) {

                // Get the edge of the spiral in the
                // direction of the given point
                var p = this.getEdgePoint(x, y);

                // The distance between the edge point
                // and the spiral center is the radius
                // of the circle in the direction of x, y
                return this.center.getDistance(p);
            },

            contains: function (x, y) {

                // The point to check
                var p = new Point2(x, y);

                // Get the point on the edge of the spiral
                // in the direction of the given point
                var e = this.getEdgePoint(x, y);

                // If the point is beyond the edge point, as
                // determined by the distance to the spiral's center,
                // it is not within this spiral
                var d1 = this.center.getSquaredDistance(e);
                var d2 = this.center.getSquaredDistance(p);
                return d1 >= d2;
            },

            intersects: function (s) {

                // If the radii separation is negative then the
                // spirals intersect
                return this.getDistance(s) < epsilon;
            },

            getDistance: function (s) {

                if (!s) {
                    return Infinity;
                }

                // Get the radius of this spiral in the direction of s
                var r0 = this.getRadius(s.center.x, s.center.y);

                // Get the radius of s in the direction of this spiral
                var r1 = s.getRadius(this.center.x, this.center.y);

                // Get the distance between the spiral centers
                var d = this.center.getDistance(s.center);

                // Return the separation between the spiral radii
                return d - (r0 + r1);
            },

            getDistanceToPoint: function (p) {
                if (!p) {
                    return Infinity;
                }

                var p0 = this.getEdgePoint(p.x, p.y);
                return p.getDistance(p0);
            },


            getPoint: function (t) {
                var center = this.center,
                    theta = this.theta,
                    radius = this.width * t,
                    angle = 2 * Math.PI * this.omega * t;

                var x = center.x + radius * Math.cos(theta + angle),
                    y = center.y + radius * Math.sin(theta + angle);

                var point = new Point2(x, y);
                point.color = this.color;

                return point;
            },

            getTerminalPoint: function () {
                var t = this.sweep;
                return this.getPoint(t);
            },

            getEdgePoint: function (x, y) {

                // Determine the points needed to calculate the
                // the point on the edge of the spiral
                var c = this.center,
                    u = this.getTerminalPoint(),
                    p = new Point2(x, y);

                // The vectors used to determine the angle
                var vcu = new Vector2(c, u),
                    vcp = new Vector2(c, p);

                // Get the possible edge points
                var phi = vcu.angle(vcp),
                    t = Math.abs(phi / (2*Math.PI)),
                    t1 = this.sweep - t,
                    t2 = (this.sweep - 1) + t;

                var p1 = this.getPoint(t1),
                    p2 = this.getPoint(t2);

                // Return the point closest to the given point
                var sd1 = p.getSquaredDistance(p1);
                var sd2 = p.getSquaredDistance(p2);
                return sd1 < sd2 ? p1 : p2;
            },

            shouldClip: function (t) {

                // We should only clip points on the outer edge
                // of the spiral
                if (t > this.sweep || t < this.sweep - 1) {
                    return false;
                }

                // Get the point at t
                var p = this.getPoint(t);

                // Check the clipping condition for the parent
                var clip = this.parent && this.parent.contains(p.x, p.y);

                // Check the clipping conditions for each child
                clip = clip || _.some(this.children, function (child) {
                    return child.contains(p.x, p.y);
                });

                return clip;
            },

            getPath: function () {

                var path = new Path(),
                    tdelta = 1 / NUM_SEGMENTS;

                // Break the path into multiple curves
                for (var t = 0; t <= this.sweep; t += tdelta) {

                    var tmin = t,
                        tmax = Math.min(t + tdelta, this.sweep) + 0.005,
                        tmid = (tmin + tmax) / 2;

                    // Get the points the bezier curve should go through
                    var p0 = this.getPoint(tmin),
                        p1 = this.getPoint(tmid),
                        p2 = this.getPoint(tmax);

                    // Calculate the control point
                    var cx = 2*p1.x - p0.x/2 - p2.x/2,
                        cy = 2*p1.y - p0.y/2 - p2.y/2,
                        control = new Point2(cx, cy);

                    // Add the curve
                    path.moveTo(p0);
                    path.bezierTo(p2, control);
                }

                return path;
            },


            getPathSegment: function (t0, t1, t2, t3) {

                // Get the four boundary points of the
                // path segement
                var p0 = this.getPoint(t0),
                    p1 = this.getPoint(t1),
                    p2 = this.getPoint(t2),
                    p3 = this.getPoint(t3);

                // Determine the control point needed for the
                // outer curve of the segment
                var q1 = (t0 + t1) / 2,
                    i1 = this.getPoint(q1),
                    c1 = Path.getControlPoint(p0, i1, p1);

                // Determine the control point needed for the
                // inner curve of the segment
                var q2 = (t2 + t3) / 2,
                    i2 = this.getPoint(q2),
                    c2 = Path.getControlPoint(p2, i2, p3);

                // The SVG path for the segment
                var path = new Path()
                    .moveTo(p0).bezierTo(p1, c1)
                    .lineTo(p2).bezierTo(p3, c2)
                    .close();


                // TODO: Use the spirals color list
                var n = Math.ceil(this.sweep * NUM_SEGMENTS),
                    i = Math.floor(t0 * NUM_SEGMENTS),
                    colors = Color.split(n + 1, ['#0000ff', '#0000ff', '#ffff00', '#ff0000']);

                // Determine the fill for the path segment
                var color1 = colors[i],
                    color2 = colors[i + 1],
                    mx0 = (p0.x + p3.x) / 2,
                    my0 = (p0.y + p3.y) / 2,
                    mx1 = (p1.x + p2.x) / 2,
                    my1 = (p1.y + p2.y) / 2,
                    gradient = new Gradient(color1, color2, mx0, my0, mx1, my1);

                // Set the path fill
                path.setFill(gradient);

                // Return the SVG path
                return path;
            },

            getPaths: function () {

                var paths = [],
                    numPaths = this.sweep * NUM_SEGMENTS;

                for (var i = 0; i < numPaths; i++) {

                    var tmin = i / NUM_SEGMENTS,
                        tmax = (i + 1) / NUM_SEGMENTS;

                    var t0 = Math.max(tmin, 0),
                        t1 = Math.min(tmax, this.sweep) + 0.005,
                        t2 = Math.max(t1 - 1, 0),
                        t3 = Math.max(t0 - 1, 0);

                    var path = this.getPathSegment(t0, t1, t2, t3);
                    paths.push(path);
                }

                return paths;
            }
        });


        // Return the constructor
        return Spiral;
    });
