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
            var defaultColors = ['#000000'];

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
                return (colors && colors.length) ? colors : defaultColors;
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
        '$rootScope',
        '$settings',
        'Circle',
        'Point2',
        'Line',
        'Spiral',
        'primaryColors',
        'secondaryColors',
        'tertiaryColors',

        function ($rootScope, $settings, Circle, Point2, Line, Spiral, primaryColors, secondaryColors, tertiaryColors) {

            var seeds = [];
            var spirals = [];

            var boundary = null;
            var boundaryArea = 0;
            var packedArea = 0;
            var selected = null;
            var balance = null;
            var colorHarmony = null;


            function getConnectedSet (S) {

                var a = [];
                angular.forEach(S.children, function (s) {
                    var subset = getConnectedSet(s);
                    a.push.apply(a, subset);
                });

                return [S].concat(a);
            }

            function update() {

                // Update the list of spirals. Recursively traverse the
                // connected sets to get the actual spirals, starting with
                // the seed spirals
                spirals = [];
                angular.forEach(seeds, function (seed) {
                    var set = getConnectedSet(seed);
                    spirals.push.apply(spirals, set);
                });

                // Recalculate the balance/harmony
                calculateBalance();
                calculateColorHarmony();

                $rootScope.$broadcast('$spirals.changed');
            }


            function getBoundarySpirals () {

                if (!boundary) { return []; }

                var spirals = [];
                angular.forEach(boundary.getLines(), function (line) {
                    var m = line.getLength() - 1;

                    for (var i = 0; i <= m; i++) {
                        var t = i / m,
                            p = line.getPoint(t),
                            s = new Spiral(100, 0.005, 0, 1, p.x, p.y);

                        spirals.push(s);
                    }
                });

                return spirals;
            }

            function getAllSpirals () {

                // First, get the boundary lines represented as tiny spirals
                var boundarySpirals = getBoundarySpirals();

                // Add the list of user placed spirals and return
                return boundarySpirals.concat(spirals);
            };

            function getIntersected (S, SP) {

                // Get all of the spirals, including those making up the
                // boundary shape
                var allSpirals = getAllSpirals();

                // Return the neighboring spirals that intersect S
                return _(allSpirals)
                    .filter(function (s) { return !s.equals(SP) })
                    .filter(function (s) { return s.intersects(S); })
                    .sortBy(function (s) { return s.getDistance(S); })
                    .value();
            }

            function doesIntersect (S, SP) {

                // Return true if any of the neighboring spirals
                // intersects S
                var intersected = getIntersected (S, SP);
                return intersected && intersected.length > 0;
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


            function calculateCentroid () {

                if (!spirals || !spirals.length) {
                    return;
                }

                var cx = 0, cy = 0;
                angular.forEach(spirals, function (s) {
                    cx += s.center.x;
                    cy += s.center.y;
                });

                cx /= spirals.length;
                cy /= spirals.length;

                return { x: cx, y: cy };
            };

            function calculateBalance () {

                // Get the centroid of the packed area
                var centroid = calculateCentroid();
                if (!centroid) { return; }

                var left = 0, right = 0,
                    top = 0, bottom = 0;

                angular.forEach(spirals, function (s) {
                    var area = s.getArea();

                    // Left/right balance
                    if (s.center.x < centroid.x) { left += area; }
                    else if (s.center.x > centroid.x) { right += area; }
                    else { left += area/2; right += area/2; }

                    // Top/bottom balance (inverse y-coordinate system)
                    if (s.center.y < centroid.y) { top += area; }
                    else if (s.center.y > centroid.y) { bottom += area; }
                    else { top += area/2; bottom += area/2; }
                });

                var vbalance = (right - left) / packedArea,
                    hbalance = (top - bottom) / packedArea;

                balance = {
                    vertical: vbalance,
                    horizontal: hbalance
                };
            }

            function calculateColorHarmony () {

                // No spirals to calculate the harmony for
                if (!spirals || !spirals.length) {
                    colorHarmony = null;
                    return;
                }

                function getColors () {
                    var colors = {};

                    angular.forEach(spirals, function (s) {
                        angular.forEach(s.colors, function (c) {
                            colors[c] = null;
                        });
                    });

                    return Object.keys(colors);
                }

                function deltaE (c1, c2) {
                    var rgb1 = tinycolor(c1).toRgb(),
                        rgb2 = tinycolor(c2).toRgb();

                    var r1 = rgb1.r, g1 = rgb1.g, b1 = rgb1.b,
                        r2 = rgb2.r, g2 = rgb2.g, b2 = rgb2.b;

                    var lab1 = colorConvert.rgb2labRaw([r1, g1, b1]),
                        lab2 = colorConvert.rgb2labRaw([r2, g2, b2]);

                    var l1 = lab1[0], a1 = lab1[1], b1 = lab1[2],
                        l2 = lab2[0], a2 = lab2[1], b2 = lab2[2];

                    var dl = l2 - l1,
                        da = a2 - a1,
                        db = b2 - b1;

                    return Math.sqrt(dl*dl + da*da + db*db);
                }

                function calculateMinDifference (color, colors) {
                    var diff = Infinity;
                    angular.forEach(colors, function (c) {
                        var dE = deltaE(color, c);
                        diff = Math.min(diff, dE);
                    });
                    return diff;
                }

                function groupDifference (colors, group) {
                    var totalDiff = 0;
                    angular.forEach(colors, function (c1) {
                        var min = calculateMinDifference(c1, group);
                        totalDiff += min;
                    });
                    return totalDiff / colors.length;
                }

                function schemeDifference (colors, scheme) {

                    // The first color is the primary color
                    var primary = colors[0];

                    var hsv = tinycolor(primary).toHsv(),
                        scheme = Please.make_scheme(hsv, { scheme_type: scheme, format: 'hex' });

                    var totalDiff = 0;
                    angular.forEach(colors, function (c1) {
                        var min = calculateMinDifference(c1, scheme);
                        totalDiff += min;
                    });

                    return totalDiff / colors.length;
                }

                // Get the unique set of colors
                var colors = getColors();

                // No colors to calculate the harmony for
                if (!colors || !colors.length) {
                    colorHarmony = null;
                    return;
                }

                // Only one color is harmonious
                if (colors.length === 1) {
                    colorHarmony = 1;
                    return;
                }

                // Get the difference from the different color schemes
                var primary = groupDifference(colors, primaryColors),
                    secondary = groupDifference(colors, secondaryColors),
                    tertiary = groupDifference(colors, tertiaryColors);

                // Get the difference from the different color schemes
                var complementary = schemeDifference(colors, 'complementary'),
                    split = schemeDifference(colors, 'split-complementary'),
                    triadic = schemeDifference(colors, 'triadic'),
                    double = schemeDifference(colors, 'double-complementary'),
                    monochromatic = schemeDifference(colors, 'monochromatic'),
                    analogous = schemeDifference(colors, 'analogous');

                // Determine the minimum difference from what are considered
                // harmonious colors sets
                var minDifference = Math.min(
                    primary, secondary, tertiary,
                    complementary, split, triadic,
                    double, monochromatic, analogous);

                // Calculate the color harmony as a percentage
                colorHarmony = (176.884921022 - minDifference) / 176.884921022;
            }

        	this.get = function () {
                return spirals;
            };

            this.remove = function (spiral) {

                // No spiral specified
                if (!spiral) { return; }


                // Seed spiral removed
                if (!spiral.parent) {
                    _.remove(seeds, function (s) {
                        return s.equals(spiral);
                    });
                }

                // Child spiral removed
                else {
                    _.remove(spiral.parent.children, function (s) {
                        return s.equals(spiral);
                    });
                }

                packedArea -= spiral.getArea();
                update();
            };


            // Boundary shape functions
            this.getBoundary = function () {
                return boundary;
            };

            this.setBoundary = function (polygon) {
                boundary = polygon;
                boundaryArea = polygon.getArea();
            };

            this.clearBoundary = function () {
                boundary = null;
            };


            // Area/porosity functions
            this.getBoundaryArea = function () {
                return boundary ? boundaryArea : Infinity;
            };

            this.getPackedArea = function () {
                return packedArea;
            };

            this.getPorosity = function () {
                var ab = this.getBoundaryArea(),
                    ap = this.getPackedArea();
                return (ab - ap) / ab;
            };

            this.getBalance = function () {
                return balance;
            };

            this.getColorHarmony = function () {
                return colorHarmony;
            };



            // this.seed = function (sweep, width, theta, omega, x, y) {
            this.seed = function (x, y) {

                // Get the values from the settings
                var T = $settings.getSweep(),
                    w = $settings.getWidth(),
                    t = $settings.getTheta(),
                    o = $settings.getOmega();
                //
                // var T = sweep, w = width, t = theta, o = omega;

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

                if (isValid(s0) && isValid(s1)) {
                    return [s0, s1];
                }

                // Add the seed spirals if they are valid
                // if (isValid(s0) && isValid(s1)) {
                //     seeds.push(s0);
                //     seeds.push(s1);
                //
                //     packedArea += s0.getArea();
                //     packedArea += s1.getArea();
                //     update();
                // }
            };

            this.addSeeds = function (s0, s1) {
                if (!isValid(s0) || !isValid(s1)) {
                    return;
                }

                // Set the spiral colors/effects
                s0.colors = $settings.getColors();
                s1.colors = $settings.getColors();
                s0.isFlat = $settings.isFlat();
                s1.isFlat = $settings.isFlat();

                seeds.push(s0);
                seeds.push(s1);

                packedArea += s0.getArea();
                packedArea += s1.getArea();

                update();
            };


            this.branch = function (x, y, SP) {
                console.clear();

                function getBoundedDisc (S, SP, S1) {

                    var xs = S.center.x,  ys = S.center.y,
                        xp = SP.center.x, yp = SP.center.y,
                        x1 = S1.center.x, y1 = S1.center.y;

                    var rp = SP.getRadius(xs, ys),
                        r1 = S1.getRadius(xs, ys);

                    var v = SP.getEdgePoint(xs, ys);

                    var cs = new Circle(0, xs, ys),
                        cp = new Circle(rp, xp, yp),
                        c1 = new Circle(r1, x1, y1),
                        cv = new Circle(0, v.x, v.y),
                        c = cs.fit(cp, c1, cv);

                    // console.log('r =', c.radius, 'x =', c.center.x, 'y =', c.center.y);
                    return c;
                }

                function getMaximallyBoundedDisc (S, SP) {

                    var minc = null;
                    angular.forEach(spirals, function (s) {
                        var c = getBoundedDisc(S, SP, s);
                        minc = (!minc || c.radius < minc.radius) ? c : minc;
                    });

                    return minc;
                }

                // Gets the spirals that restrict the placement the most
                function getBoundingSpirals (S) {

                    // Get all of the spirals, including those making up the
                    // boundary shape
                    var allSpirals = getAllSpirals();

                    // Return the two bounding spirals
                    return _(allSpirals)
                        .filter(function (s) { return !s.equals(S) && !s.equals(SP); })
                        .sortBy(function (s) { return S.center.getDistance(s.center); })
                        .value();
                }

                // Perform some final operations on the spiral to return
                function finalize (s) {

                    // Set the spiral colors/effects
                    s.colors = $settings.getColors();
                    s.isFlat = $settings.isFlat();

                    // Set relationship references
                    SP.addChild(s);

                    packedArea += s.getArea();
                    update();
                }


                // Get the values from the settings
                var sweep = $settings.getSweep(),
                    omega = $settings.getOmega();

                // Use the opposite of the parent orientation for the child
                // if set to alternating orientation
                omega = $settings.shouldAlternate() ? -SP.omega : omega;


                // The starting position can not be inside of
                // the parent spiral
                if (SP.contains(x, y)) {
                    console.error('The position can not be inside of SP');
                    return;
                }

                // Determine the width of S based on the specified
                // location, the maximum width being the width of the parent.
                var u = new Point2(x, y),
                    v = SP.getEdgePoint(x, y),
                    d = u.getDistance(v),
                    r = d / (sweep - 1),
                    w = Math.min(r, SP.width);

                // Construct S, the child spiral
                var S = new Spiral(sweep, w, 0, omega, x, y);

                // Make sure the spiral is tangent to the parent
                // and in the correct orientation to start
                S = S.fit(SP);


                // Get the bounding spirals
                var bounding = getBoundingSpirals(S, SP);
                console.log(bounding);

                // Get the intersected spirals
                var intersected = getIntersected(S, SP);

                var S1, S2, S3;

                // No neighbors intersected
                if (!intersected || !intersected.length) {
                    console.log('INTERSECT 0');
                    return finalize(S);
                }

                // Two neighbors intersected
                // else if (intersected.length > 1) {
                    console.log('INTERSECT 2');

                    // The bounding spirals
                    S1 = bounding[0];
                    S2 = bounding[1];

                    // Fit a spiral S3 to S1 and S2 branching from SP
                    S3 = S.fit(SP, S1, S2);

                    // While S3 intersects existing (non-parent) spirals
                    var i = 0;
                    while (doesIntersect(S3, SP)) {
                        console.log('w = ' + S3.width, 'x = ' + S3.center.x, 'y = ' + S3.center.y);

                        if (i > 150) {
                            debugger;
                            break;
                        }

                        // Let S4 be the spiral with the biggest
                        // intersection with S3
                        var S4 = getIntersected(S3, SP)[0];

                        // Let S5 be the spiral fitted to S1 and S4
                        var S5 = S3.fit(SP, S1, S4);

                        // Let S6 be the spiral fitted to S2 and S4
                        var S6 = S3.fit(SP, S2, S4);

                        // Select S5 or S6 with the smallest width
                        // and let this be the new S3
                        var S7 = (S5.width <= S6.width) ? S5 : S6;

                        // If this increases the width of S3, go to Step 5.
                        if (S7.width > S3.width) {
                            console.log('WHOMP WHOMP');
                            console.log(S7.width, S3.width);
                            debugger;
                            break;
                        }

                        // Let the new S1,S2 be S1,S4 or S2,S4 depending
                        // on whether S5 or S6 was selected.
                        S1 = (S5.width < S6.width) ? S1 : S2
                        S2 = S4;

                        // Fit a spiral S3 to S1 and S2
                        S3 = S7.fit(SP, S1, S2);
                        i++;
                    }

                    if (isValid(S3, SP)) {
                        return finalize(S3);
                    }
                // }

                // console.log('INTERSECT 1');
                // S1 = (intersected.length > 1) ? bounding[0] : intersected[0];
                // S2 = S.fit(SP, S1);

                // if (isValid(S2, SP)) {
                    // return finalize(S2);
                // }

                // S2 = S.clone();
                // for (var i = 0; i < 500; i++) {
                //
                //     var intersected = getIntersected(S2, SP);
                //     if (!intersected || !intersected.length) {
                //         break;
                //     }
                //
                //     var S1 = intersected[0];
                //     var c = getBoundedDisc(S2, SP, S1);
                //
                //     // c.radius = c.radius - (S1.getRadius(c.center.x, c.center.y) - r1)
                //
                //     // Adjust the phase angle for the fitted spiral
                //     // to ensure the terminal point lies on the line
                //     // between the centers of SP and S.
                //     // var dx = SP.center.x - S2.center.x,
                //     //     dy = SP.center.y - S2.center.y,
                //     //     theta = Math.atan2(dy, dx);
                //
                //     // Fit S
                //     S2.width = c.radius / (S2.sweep - 1);
                //     S2.center = new Point2(c.center.x, c.center.y);
                //     S2 = S2.fit(SP);
                //
                //     var rs =
                // }
                //
                // return finalize(S2);
            };
        }
    ]);
