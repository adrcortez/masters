'use strict';

angular.module('spiralApp')

    .factory('Spiral', function (epsilon, Path, Point2, Vector2, Circle) {

        // Define the constructor
        function Spiral (sweep, width, theta, omega, center) {
            this.sweep = sweep || 0;
            this.width = width || 0;
            this.theta = theta || 0;
            this.omega = omega || 1;
            this.center = Point2.copy(center);

            this.parent = null;
            this.children = [];

            this.fillColor = null;
            this.strokeColor = null;
        }


        // Instance methods
        Spiral.prototype = {

            getFillColor: function () {
                return this.fillColor || null;
            },

            setFillColor: function (value) {
                this.fillColor = value || null;
            },


            getStrokeColor: function () {
                return this.strokeColor || null;
            },

            setStrokeColor: function (value) {
                this.strokeColor = value || null;
            },


            getStrokeWidth: function () {
                return this.strokeWidth || null;
            },

            setStrokeWidth: function (value) {
                this.strokeWidth = value || null;
            },


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

            getOppositeRadius: function (x, y) {

                // Get the edge of the spiral in the
                // opposite direction of the given point
                var p = this.getOppositeEdgePoint(x, y);

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
                var vcp = new Vector2(c, p),
                    vcu = new Vector2(c, u);

                // Get the possible edge points
                var phi = vcp.angle(vcu),
                    t = phi/(2*Math.PI),
                    t1 = this.sweep - t,
                    t2 = (this.sweep - 1) + t;

                var p1 = this.getPoint(t1),
                    p2 = this.getPoint(t2);

                // Return the point closest to the given point
                var sd1 = p.getSquaredDistance(p1);
                var sd2 = p.getSquaredDistance(p2);
                return sd1 < sd2 ? p1 : p2;
            },

            getOppositeEdgePoint: function (x, y) {

                var dx = this.center.x - x,
                    dy = this.center.y - y,
                    x = this.center.x + dx,
                    y = this.center.y + dy;

                return this.getEdgePoint(x, y);
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

                var path = '';
                var segment = new Path();

                // Start the path
                var delta = 0.01;
                for (var t = 0; t <= this.sweep; t += delta) {
                    var clipped = this.shouldClip(t);

                    if (clipped) {

                        // Keep track of the path segment so far
                        path += segment ? segment.toString() : '';
                        segment = new Path();
                    } else {

                        // Add the point to the current path
                        // or a new path if there is not current
                        var p = this.getPoint(t);
                        segment.addPoint(p);
                    }
                }

                // Make sure the current path segment is added
                path += segment ? segment.toString() : '';

                // Return the path
                return path;
            },

            getPaths: function () {

                var paths = [],
                    rdelta = 0.25,
                    tdelta = 0.01;

                // Break the full path into half-radian segments
                for (var r = 0; r <= this.sweep; r += rdelta) {

                    var tmin = r,
                        tmax = Math.min(r + rdelta, this.sweep) + epsilon;

                    // The current path segment
                    var path = new Path();

                    // Generate the path for this segment
                    for (var t = tmin; t <= tmax; t += tdelta) {

                        // Add the point to the current path segment
                        var p = this.getPoint(t);
                        path.addPoint(p);
                    }

                    // Add this segement to the list of path segments
                    paths.push(path);
                }

                return paths;
            },

            getInnerPaths: function () {

                // Create a spiral that is the same as this spiral
                // offset by 1 radian and with one less half-turn
                var s = this.clone();
                s.theta = this.theta + Math.PI;
                s.sweep = this.sweep - 0.5;

                // The new spiral's path will trace through center of
                // this spiral, effectively becoming the inner path of
                // this spiral
                return s.getPaths();
            },

            getBoundingCircle: function (S, S0, SP) {

                // The maximum radius of the bounding circle
                // for this disc
                var r = this.width * this.sweep;

                // If S is specified, then we can make a better
                // approximation for the bounding circle
                if (S && SP) {

                    var ri = this.getRadius(S.center.x, S.center.y),
                        rsi = this.equals(SP) ?
                            S.width * (S.sweep - 1) :
                            S.getRadius(this.center.x, this.center.y);

                    var rso = S0.width * (S0.sweep - 1),
                        r = ri - (rsi - rso);

                    if (!this.equals(SP)) {
                        console.log('rsi = ' + rsi);
                        console.log('rso = ' + rso);
                        console.log(' ');
                    }
                }

                // Return the circle centered at the spiral center
                var circle = new Circle(r, this.center);
                circle.color = this.color;
                return circle;
            }
        };

        Spiral.copy = function (s) {
            return s ?
                new Spiral(s.sweep, s.width, s.theta, s.omega, s.center) :
                null;
        };


        // Return the constructor
        return Spiral;
    });
