'use strict';


angular.module('math.factories', [])

    // Constants
    .constant('EPSILON', 0.000001)
    .constant('PI',      Math.PI)


    .factory('Point2', [
        function () {

            // Define the constructor.
            function Point2 (x, y) {
                this.x = x || 0;
                this.y = y || 0;
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

                clone: function () {
                    return new Point2(this.x, this.y);
                },

                toString: function () {
                    return '(' + this.x + ', ' + this.y + ')';
                }
            };

            // Return constructor
            return Point2;
        }
    ])


    .factory('Vector2', [
        'Point2',

        function (Point2) {

            // Define the constructor.
            function Vector2 (x1, y1, x2, y2) {
                this.p0 = new Point2(x1, y1);
                this.p1 = new Point2(x2, y2);
            }

            // Instance methods
            Vector2.prototype = {

                dx: function () {
                    return this.p1.x - this.p0.x;
                },

                dy: function () {
                    return this.p1.y - this.p0.y;
                },

                magnitude: function () {
                    var dx = this.dx();
                    var dy = this.dy();
                    return Math.sqrt(dx*dx + dy*dy);
                },

                normalize: function () {
                    var dx = this.dx(),
                        dy = this.dy(),
                        m = this.magnitude();

                    // Get the coordinates of the unit vector
                    var x = dx / m,
                        y = dy / m,
                        p = new Point2(x, y);

                    // Return the normalized (unit) vector
                    return new Vector2(ORIGIN, p);
                },

                dotProduct: function (v) {
                    var px = this.dx() * v.dx();
                    var py = this.dy() * v.dy();
                    return px + py;
                },

                angle: function (v) {

                    // Normalize the vectors
                    var v1 = this.normalize(),
                        v2 = (v || UNIT_X).normalize();

                    // Calculate the angle between the normalized vectors
                    var dp = v1.dotProduct(v2),
                        m0 = v1.magnitude(),
                        m1 = v2.magnitude(),
                        angle = Math.acos(dp / (m0 * m1)) || 0;

                    // Inverse coordinate system, if y2 is greater
                    // than y1 it is actually below y1, so the angle
                    // would be positive (clockwise)
                    return (v2.p1.y >= v1.p1.y) ? angle : -angle;
                }
            };

            // Constants
            var ORIGIN = new Point2(0, 0),
                UNIT_X = new Vector2(ORIGIN, new Point2(1, 0)),
                UNIT_Y = new Vector2(ORIGIN, new Point2(0, 1));

            // Return constructor
            return Vector2;
        }
    ])

    .factory('Circle', [
        'Point2',
        'Vector2',
        'EPSILON',

        function (Point2, Vector2, EPSILON) {

            // Define the constructor
            function Circle (radius, center) {
                this.radius = Math.abs(radius || 0);
                this.center = Point2.copy(center);
            }

            // Add the instance methods
            Circle.prototype = {

                intersects: function (c) {

                    // Two circles intersect iff the distance between their
                    // centers is between the sum and the difference of
                    // their radii
                    //
                    // (r0-r1)^2 <= (x0-x1)^2+(y0-y1)^2 <= (r0+r1)^2
                    var d = this.center.getSquaredDistance(c.center);
                    var a = (this.radius - c.radius)*(this.radius - c.radius);
                    var b = (this.radius + c.radius)*(this.radius + c.radius);
                    return a <= d && d <= b;
                },

                getEdgePoint: function (x, y) {

                    var center = this.center,
                        r = this.radius;

                    var v = new Point2(center.x + r, center.y),
                        u = new Point2(x, y);

                    var v1 = new Vector2(center, v),
                        v2 = new Vector2(center, u),
                        angle = v1.angle(v2);

                    var ex = center.x + r * Math.cos(angle),
                        ey = center.y + r * Math.sin(angle);

                    return new Point2(ex, ey);
                },

                fit: function (c1, c2, c3) {

                    // Position and radius of this circle
                    var x0 = this.center.x, y0 = this.center.y, r0 = this.radius;

                    // The circle parameters that will be determined
                    var r = r0, s = this.center;

                    // Fit a circle tangent to all three specified circles
                    // c1, c2 and c3 as close to c0 as possible
                    if (c1 && c2 && c3) {

                        // Position and radii of the bounding circle(s)
                        var x1 = c1.center.x, y1 = c1.center.y, r1 = c1.radius,
                            x2 = c2.center.x, y2 = c2.center.y, r2 = c2.radius,
                            x3 = c3.center.x, y3 = c3.center.y, r3 = c3.radius;

                        // Solve the system of equations
                        var a = 2 * (x1 - x2),
                            b = 2 * (y1 - y2),
                            c = 2 * (r1 - r2),
                            d = (x1*x1 + y1*y1 - r1*r1) - (x2*x2 + y2*y2 - r2*r2);

                        var i = 2 * (x1 - x3),
                            j = 2 * (y1 - y3),
                            k = 2 * (r1 - r3),
                            l = (x1*x1 + y1*y1 - r1*r1) - (x3*x3 + y3*y3 - r3*r3);

                        var v0 = (a*j - b*i),
                            v1 = (d*j - b*l) / v0 - x1,
                            v2 = (c*j - b*k) / v0,
                            v3 = (a*l - d*i) / v0 - y1,
                            v4 = (c*i - a*k) / v0;

                        var A = v2*v2 + v4*v4 - 1,
                            B = 2 * (v3*v4 - v1*v2 - r1),
                            C = v1*v1 + v3*v3 - r1*r1,
                            D = B*B-4*A*C;

                        // Have to deal with floating point errors
                        D = Math.abs(D) > EPSILON ? D : 0;

                        // Solve the system for r using the quadratic equation,
                        // only interested in the solution yielding the minimum
                        // radius
                        var R1 = (-B + Math.sqrt(D)) / (2*A),
                            R2 = (-B - Math.sqrt(D)) / (2*A);
                            r = (Math.abs(R1) < Math.abs(R2)) ? R1 : R2;

                        // Calculate the center point of the circle
                        var x = ((d*j - b*l) - r*(c*j - b*k)) / v0,
                            y = ((a*l - d*i) - r*(a*k - c*i)) / v0,
                            s = new Point2(x, y);
                    }

                    // Fit this circle tangent to the two specified
                    // circles, c1 and c2 with the same radius as this circle
                    // as close to this circle as possible
                    else if (c1 && c2) {

                        // Position and radii of the bounding circle(s)
                        var x1 = c1.center.x, y1 = c1.center.y, r1 = c1.radius + r0,
                            x2 = c2.center.x, y2 = c2.center.y, r2 = c2.radius + r0,
                            dx = x2 - x1,     dy = y2 - y1;

                        // Determine the circle fitted to c1 and c2 with
                        // the desired radius
                        var d = Math.sqrt(dx*dx + dy*dy),
                            l = (r1*r1 - r2*r2 + d*d) / (2*d),
                            h = r1*r1 - l*l,
                            h = Math.abs(h) > EPSILON ? h : 0,
                            h = Math.sqrt(h);

                        // The system has two solutions
                        var X1 = (l/d)*dx + (h/d)*dy + x1,
                            X2 = (l/d)*dx - (h/d)*dy + x1,
                            Y1 = (l/d)*dy - (h/d)*dx + y1,
                            Y2 = (l/d)*dy + (h/d)*dx + y1;

                        // Choose the solution that is closest to
                        // the center of this circle
                        var p1 = new Point2(X1, Y1),
                            p2 = new Point2(X2, Y2),
                            d1 = this.center.getSquaredDistance(p1),
                            d2 = this.center.getSquaredDistance(p2),
                            s = (d1 < d2) ? p1 : p2;
                    }

                    // Fit a circle tangent to the specified circle c1,
                    // keeping the center on the line connecting this
                    // circle's center with c1's center
                    else if (c1) {

                        // Position and radii of the bounding circle(s)
                        var x1 = c1.center.x,   y1 = c1.center.y,   r1 = c1.radius;

                        var R = this.center.getDistance(c1.center),
                            n = (r0 + r1 - R) / R;

                        // Calculate the new center
                        var x = x0 + n*(x0 - x1),
                            y = y0 + n*(y0 - y1),
                            s = new Point2(x, y);
                    }

                    // Return the fitted circle or this circle if no other
                    // circles were specified
                    return new Circle(r, s);
                },

                clone: function () {
                    return new Circle(this.radius, this.center);
                },

                toString: function () {
                    return this.radius + ',' + this.center.toString();
                }
            };

            // Return constructor
            return Circle;
        }
    ])


    .factory('Spiral', [
        'Point2',
        'Vector2',
        'EPSILON',
        'PI',

        function (Point2, Vector2, EPSILON, PI) {

            // Define the constructor
            function Spiral (sweep, width, theta, omega, x, y) {
                this.sweep = sweep || 0;
                this.width = width || 0;
                this.theta = theta || 0;
                this.omega = omega || 1;
                this.center = new Point2(x, y);
            }

            // Instance methods
            Spiral.prototype = {

                getPoint: function (t) {
                    var center = this.center,
                        radius = this.width * t,
                        angle = this.theta + 2 * PI * this.omega * t;

                    var x = center.x + radius * Math.cos(angle),
                        y = center.y + radius * Math.sin(angle);

                    return new Point2(x, y);
                },

                getTerminalPoint: function () {
                    return this.getPoint(this.sweep);
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
                        t = Math.abs(phi) / (2*PI),
                        t1 = this.sweep - t,
                        t2 = (this.sweep - 1) + t;

                    var p1 = this.getPoint(t1),
                        p2 = this.getPoint(t2);

                    // Return the point closest to the given point
                    var sd1 = p.getSquaredDistance(p1);
                    var sd2 = p.getSquaredDistance(p2);
                    return sd1 < sd2 ? p1 : p2;
                },

                getRadius: function (x, y) {

                    // Get the edge of the spiral in the
                    // direction of the given point
                    var p = this.getEdgePoint(x, y);

                    // The distance between the edge point
                    // and the spiral center is the radius
                    // in the direction of x, y
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

                intersects: function (s) {

                    // If the radii separation is negative then the
                    // spirals intersect
                    return this.getDistance(s) < EPSILON;
                },

                equals: function (s) {
                    return (
                        s &&
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
                }
            };

            // Return the constructor
            return Spiral;
        }
    ]);
