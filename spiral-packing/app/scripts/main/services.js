'use strict';


angular.module('main.services', [])


    .service('$mouse', [
        '$window',

        function ($window) {

        	this.getEvent = function (e) {
                e = (e && e.originalEvent) || e || $window.event;
                return e instanceof MouseEvent ? e : null;
            };

            this.getTarget = function (e) {
                e = this.getEvent(e);
                return e && (e.target || e.srcElement);
            };

        	this.getLocation = function (e) {
                e = this.getEvent(e);
                return e && {
                    x: e.pageX || e.x,
                    y: e.pageY || e.y
                };
    		};

            this.getRelativeLocation = function(e) {
                e = this.getEvent(e);
                return e && {
                    x: e.offsetX || e.layerX || e.pageX || e.x,
                    y: e.offsetY || e.layerY || e.pageY || e.y
                };
    		};
        }
    ])

    .service('$settings', [
        'Rectangle',
        'Triangle',
        'Circle',

        function (Rectangle, Triangle, Circle) {

            var sweep = 3;
            var width = 10;
            var theta = Math.PI / 2;
            var omega = -1;
            var alternate = true;
            var isFlat = true;
            var colors = [];
            var boundaryShape = null;

            var boundaryShapes = {
                'rectangle': new Rectangle(50, 50, 400, 300),
                'triangle': new Triangle(150, 500, 650, 500, 400, 50),
                'circle': new Circle(200, 300, 300)
            };


        	this.getSweep = function () {
                return sweep;
            };

            this.setSweep = function (value) {
                sweep = value;
            };


            this.getWidth = function () {
                return width;
            };

            this.setWidth = function (value) {
                width = value;
            };


            this.getTheta = function () {
                return theta;
            };

            this.setTheta = function (value) {
                theta = value;
            };


            this.getOmega = function () {
                return omega;
            };

            this.setOmega = function (value) {
                omega = value;
            };


            this.shouldAlternate = function () {
                return alternate;
            };

            this.setAlternate = function (value) {
                alternate = value || false;
            };


            this.isFlat = function () {
                return isFlat;
            };

            this.setFlat = function (value) {
                isFlat = value || false;
            };


            this.getColors = function () {
                return colors;
            };

            this.setColors = function (value) {
                colors = value || [];
            };


            this.getBoundaryShapes = function () {
                return boundaryShapes;
            };

            this.getBoundaryShape = function () {
                return boundaryShape;
            };

            this.setBoundaryShape = function (value) {
                boundaryShape = value;
            };
        }
    ])

    .service('$spirals', [
        'Circle',
        'Point2',
        'Line',
        'Spiral',

        function (Circle, Point2, Line, Spiral) {

            var spirals = [];
            var boundaries = [];


            function getBoundarySpirals () {

                var spirals = [];

                angular.forEach(boundaries, function (line) {
                    var m = line.getLength() - 1;

                    for (var i = 0; i <= m; i++) {
                        var t = i / m,
                            p = line.getPoint(t),
                            s = new Spiral(10, 0.05, 0, 1, p.x, p.y);

                        spirals.push(s);
                    }
                });

                return spirals;
            };

            function getAllSpirals () {

                // First, get the boundary lines represented as tiny spirals
                var allSpirals = getBoundarySpirals();

                // Then add in the actual sprials
                allSpirals.push.apply(allSpirals, spirals);

                return allSpirals;
            };

            function getBoundingRadius (S, SP, S1) {

                var xs = S.center.x,  ys = S.center.y,
                    xp = SP.center.x, yp = SP.center.y,
                    x1 = S1.center.x, y1 = S1.center.y;

                var rp = SP.getRadius(xs, ys),
                    r1 = S1.getRadius(xs, ys);

                // var a = Math.sqrt(m*m + 1),
                //     b = 2 * (m*yp - m*y1 - m*m*xp - x1),
                //     c = m*m*xp*xp + 2*m*xp*(y1-yp) + x1*x1 + (yp-y1)*(yp-y1),
                //     d = (rp-r1) + a*xp;
                // var m = (ys - yp) / (xs - xp),
                    // n = Math.sqrt(m*m + 1),
                    // dx = x1 - xp,
                    // dy = y1 - yp,
                    // dr = r1 - rp;

                // var x = (d*d - c) / (b - 2*d*a),
                //     r = a*(x - xp) - rp;
                // var a = (x1*x1) + (m*xp + dy) * (m*xp + dy),
                //     b = 2 * (dx + m*dy + n*dr);
                //
                // var x = a / b,
                //     r = n * (x - xp) - rp;

                // var a = (dx*dx + dy*dy) + (rp*rp - r1*r1),
                //     b = 2 * (dx + m*dy) / Math.sqrt(m*m + 1),
                //     c = 2 * (r1 - rp);
                //
                // var R1 = (a - b*rp) / (c + b),
                //     R2 = (a + b*rp) / (c - b);

                var m = (ys - yp) / (xs - xp),
                    dx = (xp - x1),
                    dy = (yp - y1);

                var a = (x1*x1 + y1*y1 - r1*r1) - (xp*xp + yp*yp - rp*rp),
                    b = 2 * (dx + m*dy) * (1 + rp/Math.sqrt(m*m+1)),
                    c = 2 * dy * (yp - m*xp),
                    d = 2 * ((r1 - rp) - (dx + m*dy)/Math.sqrt(m*m+1));

                var r = (a + b + c) / d;    
                // var r = R1 > 0 ? R1 : R2;
                // var r = Math.abs(R1);

                console.log('spiral:', S1.index, 'r= ', r);
                return r;
            };

            this.getBoundingDiscs = function (x, y, SP) {
                var S = { center: { x:x, y:y }};

                var xs = S.center.x,  ys = S.center.y,
                    xp = SP.center.x, yp = SP.center.y,
                    rp = SP.getRadius(xs, ys);

                var m = (ys - yp) / (xs - xp);

                var allSpirals = getAllSpirals();
                return _(allSpirals)
                    .filter(function (s) { return !s.equals(SP); })
                    .map(function (s) {
                        var R = getBoundingRadius(S, SP, s),
                            X = xp + (R + rp) / Math.sqrt(m*m + 1),
                            Y = yp + m *(R + rp) / Math.sqrt(m*m + 1);

                        return { x:X, y:Y, r:R };
                    })
                    .value();
            };


            function getBoundingSpirals (S, SP) {
                var allSpirals = getAllSpirals();
                return _(allSpirals)
                    .filter(function (s) { return !s.equals(SP) && !s.equals(S); })
                    .sortBy(function (s) { return getBoundingRadius(S, SP, s); })
                    .take(2)
                    .value();
            };

            function getNeighbors (S, SP) {

                // Get all of the spirals, including those making up the
                // boundary shape
                var allSpirals = getAllSpirals();

                // Return the non-parent spirals, sorted by the
                // intersection amount
                return _(allSpirals)
                    .filter(function (s) { return !s.equals(SP) && !s.equals(S); })
                    .filter(function (s) { return s.intersects(S); })
                    .sortBy(function (s) { return s.getDistance(S); })
                    .value();
            };

            function doesIntersect (S, SP) {

                // Return true if any of the neighboring spirals
                // intersects S
                var neighbors = getNeighbors(S, SP);
                return _.some(neighbors, function (s) {
                    return s.intersects(S);
                });
            };

            function isValid (S, SP) {

                // The spiral is valid iff its width is not too small
                // and it does not intersect any other spirals
                return S && !doesIntersect(S, SP);

                // Calculate the angle difference caused by the fitting
                // var v1 = new Vector2(SP.center, S0.center),
                //     v2 = new Vector2(SP.center, S.center),
                //     angle = 180/Math.PI * v1.angle(v2);
                //
                // // A valid spiral doesn't intersect and has a
                // // low angle difference
                // return (!intersects) && (angle <= 12.5);
            };

        	this.all = function () {
                return spirals;
            };

            this.get = function (idx) {
                return spirals[idx];
            };

            this.size = function () {
                return spirals.length || 0;
            };

            this.add = function (S) {
                if (S) {
                    S.index = this.size();
                    spirals.push(S);
                }
            };


            this.getBoundaryLines = function () {
                return boundaries || [];
            };

            this.addBoundaryLine = function (sx, sy, ex, ey, cx, cy) {
                var line = new Line(sx, sy, ex, ey, cx, cy)
                boundaries = boundaries || [];
                boundaries.push(line);
            };


            this.remove = function (spiral) {

                // Remove the selected spiral
                _.remove(spirals, function (s) {
                    return s.equals(spiral);
                });

                // Remove all child references
                _.each(spirals, function (s) {
                    _.remove(s.children, function (c) {
                        return c.equals(spiral);
                    });
                });
            };

            this.seed = function (sweep, width, theta, omega, x, y) {

                var T = sweep, w = width, t = theta, o = omega;

                // Precalculate some stuff
                var x0 = x - w * T * Math.cos(t)/2,
                    y0 = y - w * T * Math.sin(t)/2,
                    p = 2 * Math.PI * o * T;

                // Calculate the center of the spirals
                var x1 = x0 + w * (T-1) * Math.cos(t+p) - w * T * Math.cos(t-p),
                    y1 = y0 + w * (T-1) * Math.sin(t+p) + w * T * Math.sin(t-p);

                // Define the seed spirals
                var s0 = new Spiral(T, w, t, o, x0, y0),
                    s1 = new Spiral(T, w, -t, o, x1, y1);

                // Add the seed spirals if they are valid
                if (isValid(s0) && isValid(s1)) {
                    return [s0, s1];
                }
            };


            this.branch = function (SP, sweep, omega, x, y) {

                // The starting position can not be inside of
                // the parent spiral
                if (SP.contains(x, y)) {
                    return;
                }

                // Adjust the center of S if the width is too large
                var u = new Point2(x, y),
                    v = SP.getEdgePoint(x, y),
                    d = u.getDistance(v),
                    r = d / (sweep - 1),
                    w = Math.min(r, SP.width),
                    m = w * (sweep - 1) / d;

                x = (1-m)*v.x + m*x;
                y = (1-m)*v.y + m*y;

                // Calculate the phase angle for the new spiral
                var dx = SP.center.x - x,
                    dy = SP.center.y - y,
                    theta = Math.atan2(dy, dx);

                // Construct S, the child spiral
                var S = new Spiral(sweep, w, theta, omega, x, y);

                // Try to fit the spiral
                var S3 = S.clone();
                S3.index = S.index;
                var i = 0;

                while (true) {

                    // No need to do the fitting if the spiral
                    // doesn't intersect any other spirals
                    if (!doesIntersect(S3, SP)) {
                        break;
                    }

                    var neighbors = getNeighbors(S3, SP);
                    var oldWidth = S3.width;

                    var b = getBoundingSpirals(S3, SP);
                    // console.log(b);

                    var S1 = neighbors[0],
                        S2 = neighbors[1];

                    S3 = S3.fit(SP, S1, S2);

                    if (S3.width > oldWidth) {
                        console.log('WHOMP WHOMP');
                        break;
                    }

                    if (i > 150) {
                        console.log('OH NO');
                        break;
                    }
                    i++;
                }

                // if (isValid(S3, SP)) {
                    return S3;
                // }

                // console.log('INVALID');
                //
                // var spirals = _($spirals.get())
                //     .filter(function (s) { return !s.equals(SP); })
                //     .sortBy(function (s) { return s.getDistanceToPoint(S.center); })
                //     .value();
                //
                // var v = SP.getEdgePoint(S.center.x, S.center.y),
                //     S1 = spirals[0],
                //     S2 = new Spiral(100, 0, 0, 1, v);
                //
                // $scope.bc3 = new Circle(0, S2.center);
                // return fit(S, SP, S1, S2);
            };
        }
    ]);
