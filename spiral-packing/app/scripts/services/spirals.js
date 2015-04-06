'use strict';

angular.module('spiralApp')

    .service('$spirals', function (epsilon, Point2, Vector2, Circle, Spiral) {

        var spirals = [];

    	// Return a public API for this service.
    	this.get = function () {
            return spirals;
        };

        this.size = function () {
            return spirals.length || 0;
        };

        this.add = function (spiral) {

            // If a valid spiral is specified and it isn't too small
            if (!spiral || spirals.width < 1) {
                return;
            }

            // Make sure the spiral doesn't intersect an other non-parent spiral
            // var intersects = _.some(spirals, function (s) {
            //     return spiral.parent
            // });
            //
            spirals.push(spiral);
        };

        this.remove = function (spiral) {

            // Remove the selected spiral
            _.remove(spirals, function (s) {
                return spiral && s.equals(spiral);
            });
        };

        this.getNonParents = function (S, SP) {
            return _.filter(spirals, function (s) {
                return !s.equals(SP) && !s.equals(S);
            });
        };

        this.getIntersected = function (S, SP) {

            // Get the non-parent spirals
            var nonparents = this.getNonParents(S, SP);

            // Return the intersected non-parent spirals, sorted by
            // the intersection amount
            return _(nonparents)
                .filter(function (s) { return s.intersects(S); })
                .sortBy(function (s) { return s.getDistance(S); })
                .value();
        };

        this.getBoundingSpirals = function (S, SP, $scope) {

            // Sort the spirals by their bounding radii
            return _(spirals)
                .filter(function (s) { return !s.equals(SP); })
                .sortBy(function (s) {

                    var x = s.center.x,
                        y = s.center.y;

                    // Approximate the parent as a disc
                    var r0 = SP.getRadius(S.center.x, S.center.y),
                        c0 = new Circle(r0, SP.center);
                    c0.color = 'black';

                    // Approximate this spiral as a disc
                    var r1 = s.getRadius(S.center.x, S.center.y),
                        c1 = new Circle(r1, s.center);
                    c1.color = 'black';

                    // Get the edge point of the parent (SP) in the direction
                    // of S and create a disc here with radius 0. Fitting a circle
                    // to s, SP and this zero-radius disc will yield a disc with
                    // it's center on the line connecting the center of SP and S
                    // that touches this s and SP (approximated as discs)
                    var v = SP.getEdgePoint(S.center.x, S.center.y),
                        c2 = new Circle(0, v);
                    c2.color = 'black';

                    // $scope.circles = $scope.circles || [];
                    // $scope.circles.push(c0);
                    // $scope.circles.push(c1);
                    // $scope.circles.push(c2);
                    //
                    // $scope.points = $scope.points || [];
                    // $scope.points.push(c0.center);
                    // $scope.points.push(c1.center);
                    // $scope.points.push(c2.center);

                    // Determine the bounding disc radius. If the
                    // radius is invalid,
                    var d = c0.fit(c0, c1, c2),
                        r = d ? d.radius : Infinity,
                        r = Math.abs(r) < epsilon ? Infinity : r;

                    // if (d) {
                    //     d.color = 'orange';
                    //     $scope.circles.push(d);
                    //     $scope.points.push(d.center);
                    // }

                    // Sort by the radius of the fitted disc
                    // console.log('(x, y, r) = ' + x + ', ' + y + ', ' + r);
                    return r;
                })
                .value();
        };

        this.intersects = function (S, SP) {
            var intersected = this.getIntersected(S, SP);
            return intersected && intersected.length > 0;
        };

        this.seed = function (sweep, width, theta, omega, x, y) {

            var T = sweep, w = width, t = theta, o = omega;

            // Precalculate some stuff
            var x0 = x - w * T * Math.cos(t)/2,
                y0 = y - w * T * Math.sin(t)/2,
                p = 2 * Math.PI * o * T;

            // Calculate the center of the spirals
            var x1 = x0 + w * (T-1) * Math.cos(t+p) - w * T * Math.cos(t-p),
                y1 = y0 + w * (T-1) * Math.sin(t+p) + w * T * Math.sin(t-p),
                c0 = new Point2(x0, y0),
                c1 = new Point2(x1, y1);

            // Define the seed spirals
            var s0 = new Spiral(T, w, t, o, c0),
                s1 = new Spiral(T, w, -t, o, c1);

            // Make sure the seed spirals don't intersect
            // any other spirals
            var intersects = _.some(spirals, function (s) {
                return s0.intersects(s) || s1.intersects(s);
            });

            // Return the seed spirals if they don't intersect
            if (!intersects) {
                this.add(s0);
                this.add(s1);
            }
        };

        this.isValid = function (S, SP, S0) {

            // Check to see if the spiral intersects any non-parent spirals
            var intersects = this.intersects(S, SP);

            // Calculate the angle difference caused by the fitting
            var v1 = new Vector2(SP.center, S0.center),
                v2 = new Vector2(SP.center, S.center),
                angle = 180/Math.PI * v1.angle(v2);

            return (!intersects) && (angle <= 12.5);
        };

        this.branch = function (SP, S0, $scope) {

            // No parent specified
            if (!SP || !S0) {
                return;
            }

            var x = S0.center.x,
                y = S0.center.y,
                sweep = S0.sweep;

            // The specified point can't be inside the parent spiral
            if (SP.contains(x, y)) {
                return;
            }

            // Determine the child width based on the given number of turns
            // and the distance from the parent spiral to x, y
            var v = SP.getEdgePoint(x, y),
                c = new Point2(x, y),
                r = v.getDistance(c),
                width = r / (sweep - 1);

            // Adjust x, y if the calculated width is too large,
            // making sure to keep the direction of x, y the same
            width = Math.min(width, SP.width);
            var m = (width * (sweep - 1) / r);
            x = m*x - (m - 1)*v.x;
            y = m*y + (1 - m)*v.y;

            // Adjust the center of the input spiral so that
            // it branches of of the parent
            // var v = SP.getEdgePoint(x, y),
            //     r = S0.width * (S0.sweep - 1),
            //     c1 = new Circle(r, S0.center),
            //     c2 = new Circle(0, v),
            //     c0 = Circle.fit1(c1, c2);


            // Calculate the phase angle for the new spiral
            var dx = SP.center.x - x,
                dy = SP.center.y - y,
                theta = Math.atan2(dy, dx);

            // The spiral
            var S = new Spiral(sweep, S0.width, theta, S0.omega);
            S.center = new Point2(x, y);
            S.parent = SP;

            var intersected = this.getIntersected(S);
            var S1, S2, S3;

            // If S doesn't intersect any spirals, return it
            if (!intersected || !intersected.length) {
                console.log('NO INTERSECT');
                return S;
            }

            // S intersects exactly one spiral

            // if (intersected.length === 1) {
            //
            //     S1 = intersected[0],
            //     S2 = S.fit(SP, S1, null, $scope);
            //
            //     // If S2 is a valid solution, return it
            //     // if (this.isValid(S2, SP, S0)) {
            //         return S2;
            //     // }
            // }

            var S2 = S.clone();
            var P = null;
            var i = 0;

            while (true) {

                var intersected = this.getIntersected(S2);
                if (!intersected || !intersected.length) {
                    break;
                }

                P = S2.clone();
                var S1 = intersected[0];

                var v = SP.getEdgePoint(x, y),
                    cp = SP.getBoundingCircle(S2, S0, SP),
                    c1 = S1.getBoundingCircle(S2, S0, SP),
                    c2 = new Circle(0, cp.getEdgePoint(x, y)),
                    c0 = new Circle(S.width * (S2.sweep - 1), S2.center);

                c0 = c0.fit(cp, c1, c2);
                S2.width = c0.radius / (S2.sweep - 1);
                S2.center = c0.center;

                // Adjust the center of the input spiral so that
                // it branches off of the parent
                var r = S2.width * (S2.sweep - 1),
                    d1 = new Circle(r, S2.center),
                    d2 = new Circle(0, v),
                    d0 = d1.fit(d2);
                S2.center = d0.center;

                console.log(S2.width);

                if (i > 1) {
                    console.log('EXIT');
                    break;
                }
                i++;
            }

            $scope.S = P;
            $scope.bc1 = cp;
            $scope.bc2 = c1;
            $scope.bc3 = c2;

            $scope.circles = [ c0 ];
            $scope.points = [ new Point2(x,y) ];


            // Return the branched spiral
            return S2;
        };
    });
