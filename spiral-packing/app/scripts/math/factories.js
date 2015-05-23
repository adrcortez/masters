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
                    return new Vector2(0, 0, p.x, p.y);
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
                UNIT_X = new Vector2(0, 0, 1, 0),
                UNIT_Y = new Vector2(0, 0, 0, 1);

            // Return constructor
            return Vector2;
        }
    ])


    .factory('Path', [
        'Point2',
        'Spiral',

        function (Point2, Spiral) {

            // Define the constructor.
            function Path () {
                this.points = [];
            }


            Path.prototype = {

                addPoint: function (x, y) {
                    var p = new Point2(x, y);
                    this.points.push(p);
                },

                getFirstPoint: function () {
                    return this.points[0];
                },

                getLastPoint: function () {
                    return this.points[this.points.length - 1];
                },

                asSpirals: function () {

                    var spirals = [];

                    for (var i = 0; i < this.points.length - 1; i++) {

                        var p1 = this.points[i],
                            p2 = this.points[i+1],
                            dx = p2.x - p1.x,
                            dy = p2.y - p1.y,
                            m = Math.sqrt(dx*dx + dy*dy);

                        for (var t = 0; t <= m; t++) {

                            var x = p1.x + t,
                                y = p1.y + t,
                                s = new Spiral(10, 0.1, 0, 1, x, y);

                            spirals.push(s);
                        }
                    }

                    return spirals;
                }
            };


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
        }
    ])


    .factory('Curve', [

        function () {

            // Define the constructor
            function Curve (sx, sy, ex, ey, mx, my) {
                this.setStartPoint(sx, sy);
                this.setEndPoint(ex, ey);
                this.setMidPoint(mx, my);
            }

            // Add the instance methods
            Curve.prototype = {

                getStartPoint: function () {
                    return { x: this.x1, y: this.y1 };
                },

                setStartPoint: function (x, y) {
                    this.sx = x || 0;
                    this.sy = y || 0;
                },

                getEndPoint: function () {
                    return { x: this.x2, y: this.y2 };
                },

                setEndPoint: function (x, y) {
                    this.ex = x || 0;
                    this.ey = y || 0;
                },

                getMidPoint: function () {
                    return { x: this.mx, y: this.my };
                },

                setMidPoint: function (x, y) {
                    this.mx = x || 0;
                    this.my = y || 0;
                },

                // Caculate the control point needed for the curve definition
                getControlPoint: function () {
                    var x = 2*this.mx - this.sx/2 - this.ex/2,
                        y = 2*this.my - this.sy/2 - this.ey/2;
                    return { x: x, y: y };
                }
            };

            // Return the constructor
            return Curve;
        }
    ])


    .factory('Rectangle', [
        'Point2',
        'Path',

        function (Point2, Path) {

            // Define the constructor
            function Rectangle (x, y, width, height) {
                this.setLocation(x, y);
                this.setWidth(width);
                this.setHeight(height);
            }

            // Add the instance methods
            Rectangle.prototype = {

                getLocation: function () {
                    return this.loc;
                },

                setLocation: function (x, y) {
                    this.loc = new Point2(x, y);
                },

                setWidth: function (width) {
                    this.width = width || 0;
                },

                setHeight: function (height) {
                    this.height = height || 0;
                },

                getArea: function () {
                    return this.width * this.height;
                },

                contains: function (x, y) {
                    var w = this.width,  h = this.height,
                        x1 = this.loc.x, y1 = this.loc.y,
                        x2 = x1 + w,     y2 = y1 + h;

                    return (x >= x1 && x <= x2) && (y >= y1 && y <= y2);
                },

                getPath: function () {

                    var w = this.width,  h = this.height,
                        x1 = this.loc.x, y1 = this.loc.y,
                        x2 = x1 + w,     y2 = y1,
                        x3 = x1 + w,     y3 = y1 + h,
                        x4 = x1,         y4 = y1 + h;

                    return (
                        'M ' + x1 + ' ' + y1 + ' ' +
                        'L ' + x2 + ' ' + y2 + ' ' +
                        'L ' + x3 + ' ' + y3 + ' ' +
                        'L ' + x4 + ' ' + y4 + 'Z'
                    );
                },

                asSpirals: function () {

                    var w = this.width,  h = this.height,
                        x1 = this.loc.x, y1 = this.loc.y,
                        x2 = x1 + w,     y2 = y1,
                        x3 = x1 + w,     y3 = y1 + h,
                        x4 = x1,         y4 = y1 + h;

                    var path = new Path();
                    path.addPoint(x1, y1);
                    path.addPoint(x2, y2);
                    path.addPoint(x3, y3);
                    path.addPoint(x4, y4);

                    return path.asSpirals();
                }
            };

            // Return the constructor
            return Rectangle;
        }
    ])


    .factory('Triangle', [
        'Point2',

        function (Point2) {

            // Define the constructor
            function Triangle (x1, y1, x2, y2, x3, y3) {
                this.setPoint1(x1, y1);
                this.setPoint2(x2, y2);
                this.setPoint3(x3, y3);
            }

            // Add the instance methods
            Triangle.prototype = {

                getPoint1: function () {
                    return this.point1;
                },

                setPoint1: function (x, y) {
                    this.point1 = new Point2(x, y);
                },

                getPoint2: function () {
                    return this.point2;
                },

                setPoint2: function (x, y) {
                    this.point2 = new Point2(x, y);
                },

                getPoint3: function () {
                    return this.point3;
                },

                setPoint3: function (x, y) {
                    this.point3 = new Point2(x, y);
                },

                getArea: function () {
                    var x1 = this.point1.x, y1 = this.point1.y,
                        x2 = this.point2.x, y2 = this.point2.y,
                        x3 = this.point3.x, y3 = this.point3.y;

                    var area = -y2*x3 + y1*(x3-x2) + x1*(y2-y3) + x2*y3;
                    return Math.abs(area);
                },

                contains: function (x, y) {

                    function sign (p1, p2, p3) {
                        var a = (p1.x-p3.x) * (p2.y-p3.y),
                            b = (p2.x-p3.x) * (p1.y-p3.y);
                        return a - b;
                    }

                    var p = new Point2(x, y),
                        b1 = sign(p, this.point1, this.point2) < 0,
                        b2 = sign(p, this.point2, this.point3) < 0,
                        b3 = sign(p, this.point3, this.point1) < 0;

                    return ((b1 == b2) && (b2 == b3));
                },

                getPath: function () {

                    var x1 = this.point1.x, y1 = this.point1.y,
                        x2 = this.point2.x, y2 = this.point2.y,
                        x3 = this.point3.x, y3 = this.point3.y;

                    return (
                        'M ' + x1 + ' ' + y1 + ' ' +
                        'L ' + x2 + ' ' + y2 + ' ' +
                        'L ' + x3 + ' ' + y3 + 'Z'
                    );
                }
            };

            // Return the constructor
            return Triangle;
        }
    ])


    .factory('Circle', [
        'Point2',
        'Vector2',
        'EPSILON',

        function (Point2, Vector2, EPSILON) {

            // Define the constructor
            function Circle (radius, x, y) {
                this.radius = Math.abs(radius || 0);
                this.center = new Point2(x, y);
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
                    var r = r0, x = this.center.x, y = this.center.y;

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

                        // Calculate the center point of the circle
                        r = (Math.abs(R1) < Math.abs(R2)) ? R1 : R2;
                        x = ((d*j - b*l) - r*(c*j - b*k)) / v0;
                        y = ((a*l - d*i) - r*(a*k - c*i)) / v0;
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

                        x = (d1 < d2) ? p1.x : p2.x;
                        y = (d1 < d2) ? p1.y : p2.y;
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
                        x = x0 + n*(x0 - x1);
                        y = y0 + n*(y0 - y1);
                    }

                    // Return the fitted circle or this circle if no other
                    // circles were specified
                    return new Circle(r, x, y);
                },

                getArea: function () {
                    return Math.PI * this.radius * this.radius;
                },

                contains: function (x, y) {

                    var x1 = this.center.x, y1 = this.center.y,
                        dx = x - x1, dy = y - y1,
                        d = Math.sqrt(dx*dx + dy*dy);

                    return d <= this.radius;
                },

                getPath: function () {

                    var r = this.radius, cx = this.center.x, cy = this.center.y;

                    return (
                        'M ' + cx + ' ' + cy + ' ' +
                        'm ' + -r + ', 0 ' +
                        'a ' + r + ',' + r + ' 0 1,1 ' + (r * 2) + ',0 ' +
                        'a ' + r + ',' + r + ' 0 1,1 ' + -(r * 2) + ',0 '
                    );
                },

                clone: function () {
                    return new Circle(this.radius, this.center.x, this.center.y);
                },

                toString: function () {
                    return this.radius + ',' + this.center.toString();
                }
            };

            // Return constructor
            return Circle;
        }
    ])


    .factory('Segment', [
        'Point2',

        function (Point2) {

            function Segment (spiral, t0, t1) {
                this.spiral = spiral;
                this.t0 = t0;
                this.t1 = t1;
            }

            Segment.prototype = {

                getPath: function () {


                    function getControlPoint (t0, t1) {

						// The start/end points of the curve
						var p0 = this.spiral.getPoint(t0),
							p1 = this.spiral.getPoint(t1);

						// The mid-point (intersection point)
						var tm = (t0 + t1) / 2,
							pm = this.spiral.getPoint(tm);

						// Caculate the control point
						var x = 2*pm.x - p0.x/2 - p1.x/2,
			                y = 2*pm.y - p0.y/2 - p1.y/2;

						return new Point2(x, y);
					}

                    var t0 = this.t0,
                        t1 = this.t1,
                        t2 = Math.max(t1 - 1, 0),
                        t3 = Math.max(t0 - 1, 0);

                    var p0 = this.spiral.getPoint(t0),
                        p1 = this.spiral.getPoint(t1),
                        p2 = this.spiral.getPoint(t2),
                        p3 = this.spiral.getPoint(t3);

                    var c1 = getControlPoint.call(this, t0, t1),
                        c2 = getControlPoint.call(this, t2, t3);

                    return (
                        'M ' + p0.x + ' ' + p0.y + ' ' +
                        'Q ' + c1.x + ' ' + c1.y + ' ' + p1.x + ' ' + p1.y + ' ' +
                        'L ' + p2.x + ' ' + p2.y + ' ' +
                        'Q ' + c2.x + ' ' + c2.y + ' ' + p3.x + ' ' + p3.y + 'Z'
                    );
                }
            };

            return Segment;
        }
    ])


    .factory('Spiral', [
        'Point2',
        'Vector2',
        'Circle',
        'EPSILON',
        'PI',

        function (Point2, Vector2, Circle, EPSILON, PI) {

            // Define the constructor
            function Spiral (sweep, width, theta, omega, x, y) {
                this.sweep = sweep || 0;
                this.width = width || 0;
                this.theta = theta || 0;
                this.omega = omega || 1;
                this.center = new Point2(x, y);

                this.parent = null;
                this.children = [];
                this.clips = [];
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

                getEdgeT: function (x, y) {

                    // Determine the points needed to calculate the
                    // the point on the edge of the spiral
                    var c = this.center,
                        u = this.getTerminalPoint(),
                        p = new Point2(x, y);

                    // The vectors used to determine the angle
                    var vcu = new Vector2(c.x, c.y, u.x, u.y),
                        vcp = new Vector2(c.x, c.y, p.x, p.y);

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
                    return sd1 < sd2 ? t1 : t2;
                },

                getEdgePoint: function (x, y) {

                    // Determine the points needed to calculate the
                    // the point on the edge of the spiral
                    var c = this.center,
                        u = this.getTerminalPoint(),
                        p = new Point2(x, y);

                    // The vectors used to determine the angle
                    var vcu = new Vector2(c.x, c.y, u.x, u.y),
                        vcp = new Vector2(c.x, c.y, p.x, p.y);

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
                    return this.getDistance(s) < -EPSILON;
                },


                fit: function (S1, S2, S3) {

                    var S0 = this.clone(),
                        r0 = S0.width * (S0.sweep - 1),
                        c0 = new Circle(r0, S0.center.x, S0.center.y);

                    // If S2 and S3 are the same spiral, then only fit to S2
                    if (S2 && S2.equals(S3)) {
                        S3 = null;
                    }

                    // If S is closer to S3 than S2, swap S2 and S3
                    if (S2 && S3 && S0.getDistance(S2) > S0.getDistance(S3)) {
                        var temp = S2, S2 = S3, S3 = temp;
                    }

                    // Determine the case we are trying to solve
                    var case3 = S0.intersects(S2) && S0.intersects(S3);
                    var case2 = S0.intersects(S2) && !S0.intersects(S3);

                    if (case3) { console.log('CASE III'); }
                    else if (case2) { console.log('CASE II'); }
                    else { console.log('CASE I'); }

                    // The spiral to fit
                    var S = S0.clone();

                    // The change in S's position as it is being fitted
                    var delta = Infinity, threshold = 0.5;

                    // Try to fit the spiral, maxing out at 150 iterations
                    for (var i = 0; i < 150; i++) {

                        // The spiral's position is not changing significantly
                        // anymore, so break
                        if (delta < threshold) {
                            break;
                        }

                        // The inner radius of the fitted spiral
                        var rso = S.width * (S.sweep - 1);

                        var circles = _.map([S1, S2, S3], function (s, i) {
                            if (!s) {
                                return;
                            }

                            // Get the radius of Si in the direction of S. This
                            // is negative because it is in the opposite
                            // direction of rsi.
                            var ri = -s.getRadius(S.center.x, S.center.y);

                            // Get the radius of S in the direction of Si
                            var rsi = s.equals(S1) ?
                                    S.width * (S.sweep - 1) :
                                    S.getRadius(s.center.x, s.center.y);

                            // Determine the radius of the approximating
                            // circle, ci
                            var r = ri - (rsi - rso);
                            return new Circle(r, s.center.x, s.center.y);
                        });

                        // The circle approximations
                        var c1 = circles[0],
                            c2 = circles[1],
                            c3 = circles[2];

                        // Case III: Both spirals intersected
                        if (case3) {
                            c0 = c0.fit(c1, c2, c3);
                        }

                        // Case II: One spiral intersected
                        else if (case2) {
                            c0 = c0.fit(c1, c2);
                        }

                        // Case I: No intersection
                        else {
                            c0 = c0.fit(c1);
                        }

                        // delta is the difference between the new and previous
                        // centers of c0. The previous center of c0 is the same
                        // as the center of S at this point.
                        delta = c0.center.getDistance(S.center);
                        console.log(delta);

                        // // Adjust the phase angle for the fitted spiral
                        // // to ensure the terminal point lies on the line
                        // // between the centers of S1 and S.
                        // var dx = S1.center.x - c0.center.x,
                        //     dy = S1.center.y - c0.center.y,
                        //     theta = Math.atan2(dy, dx);

                        // Update S
                        S.center = new Point2(c0.center.x, c0.center.y);
                        S.width = c0.radius / (S.sweep - 1);
                        // S.theta = theta;
                    }

                    // Adjust the phase angle for the fitted spiral
                    // to ensure the terminal point lies on the line
                    // between the centers of S1 and S.
                    var dx = S1.center.x - c0.center.x,
                        dy = S1.center.y - c0.center.y,
                        theta = Math.atan2(dy, dx);
                    S.theta = theta;

                    return S;
                },

                getParent: function () {
                    return this.parent || null;
                },

                getChildren: function () {
                    return this.children;
                },

                hasChild: function (child) {

                    if (child) {
                        for (var i = 0; i < this.children.length; i++) {
                            if (this.children[i].equals(child)) {
                                return true;
                            };
                        }
                    }

                    return false;
                },

                addChild: function (child) {

                    // No child to add
                    if (!child) {
                        return;
                    }

                    // Add the child (avoid duplicates)
                    child.parent = this;
                    if (!this.hasChild(child)) {
                        this.children.push(child);
                    }

                    // Update the clip boundaries
                    child.clips = child.getClips();
                    this.clips = this.getClips();
                },

                removeChild: function (s) {

                    // Nothing to remove
                    if (!s) { return; }

                    // Get the current children
                    var children = angular.copy(this.getChildren());

                    // Clear the children
                    this.children = [];

                    // Add back each old child, skipping the one to remove
                    angular.forEach(children, function (c) {
                        if (!c.equals(s)) {
                            this.addChild(c);
                        }
                    }, this);
                },

                getClips: function () {
                    // return this.clips;

                    function getParentClip (child) {
                        var T = child.sweep, dt = 0.01;

                        // Get the point where the parent clips this spiral
                        if (child.parent) {
                            for (var t = T - 0.25; t <= T; t += dt) {
                                var p = child.getPoint(t);
                                if (child.parent.contains(p.x, p.y)) {
                                    return { start: t - dt/2, end: T };
                                }
                            }
                        }
                    }

                    function getChildClip (parent, child) {

                        var T = parent.sweep,
                            theta = parent.theta,
                            omega = parent.omega,
                            cx = parent.center.x,
                            cy = parent.center.y;

                        // Determine when the child intersects this spiral
                        var cclip = getParentClip(child);
                        if (!cclip) { return; }

                        // Get the x,y coordinate of the clip
                        var u = child.getPoint(cclip.start);
                        var v = child.getPoint(child.sweep - 1);

                        // Get the t-value for this spiral at that coordinate
                        var t1 = parent.getEdgeT(u.x, u.y),
                            t2 = parent.getEdgeT(v.x, v.y);

                        // Have to handle the spiral orientation
                        return (t1 < t2) ?
                            { start: t1, end: t2 } :
                            { start: t2, end: t1 };
                    }

                    var clips = [];

                    // Add the clip paths created by this spiral's children
                    angular.forEach(this.children, function (child) {
                        var cclip = getChildClip(this, child);
                        cclip && clips.push(cclip);
                    }, this);

                    // Add the clip path created by this spiral's parent
                    var pclip = getParentClip(this);
                    pclip && clips.push(pclip);

                    return clips;
                },

                clip: function (t1, t2) {

                    var clips = this.clips;
                    for (var i = 0; i < clips.length; i++) {

                        var clip = clips[i],
                            clip1 = (t1 > clip.start && t1 < clip.end),
                            clip2 = (t2 > clip.start && t2 < clip.end);

                        // Both t-values are inside clip range
                        if (t1 >= clip.start && t2 <= clip.end) {
                            return;
                        }

                        // Just the start t-value is inside clip range
                        else if (t1 >= clip.start && t1 <= clip.end) {
                            return [{ start: clip.end, end: t2 }];
                        }

                        // Just the end t-value is clipped
                        else if (t2 >= clip.start && t2 <= clip.end) {
                            return [{ start: t1, end: clip.start }];
                        }

                        // The t-values extend beyond both ends of the
                        // clip range, resulting in 2 parts
                        else if (t1 < clip.start && t2 > clip.end) {
                            return [
                                { start: t1, end: clip.start },
                                { start: clip.end, end: t2 }
                            ];
                        }
                    }

                    // No clipping
                    return [ { start: t1, end: t2 }];
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
                        this.omega, this.center.x, this.center.y);
                },

                getArea: function () {

                    var T = this.sweep,
                        w = this.width;

                    return Math.PI*w*w/3 * (Math.pow(T, 3) - Math.pow(T-1, 3));
                }
            };

            // Return the constructor
            return Spiral;
        }
    ]);
