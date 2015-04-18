'use strict';

angular.module('spiralApp')

    .factory('Circle', function (epsilon, Shape, Point2, Vector2) {

        // Define the constructor
        function Circle (radius, center) {

            // Call the parent constructor
            Shape.call(this);

            this.radius = Math.abs(radius || 0);
            this.center = Point2.copy(center);
        }


        // Extend the parent
        Circle.prototype = Object.create(Shape.prototype);
        Circle.prototype.constructor = Circle;


        // Add the instance methods
        angular.extend(Circle.prototype, {

            clone: function () {
                return new Circle(this.radius, this.center);
            },

            toString: function () {
                return this.center.toString() + ' ' + this.radius;
            },

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

                var x0 = this.center.x,
                    y0 = this.center.y,
                    r = this.radius;

                var v = new Point2(x0 + r, y0),
                    u = new Point2(x, y),
                    v1 = new Vector2(this.center, v),
                    v2 = new Vector2(this.center, u),
                    angle = v1.angle(v2);

                var X = x0 + r*Math.cos(angle),
                    Y = y0 + r*Math.sin(angle);

                return new Point2(X, Y);
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
                    D = Math.abs(D) > epsilon ? D : 0;

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
                        h = Math.abs(h) > epsilon ? h : 0,
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
            }
        });


        // Return constructor
        return Circle;
    });
