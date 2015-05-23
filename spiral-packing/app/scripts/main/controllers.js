'use strict';

angular.module('main.controllers', [])


    .controller('HeaderCtrl', [
        '$scope',
        '$document',
        '$mdDialog',

        function ($scope, $document, $mdDialog) {

            $scope.showHelp = function ($event) {
                $mdDialog.show({
                    templateUrl: 'templates/modals/help.html',
                    targetEvent: $event,
                    hasBackdrop: true,
                    clickOutsideToClose: true,
                    escapeToClose: true,

                    controller: function ($scope, $mdDialog) {

                        $scope.ok = function () {
                            $mdDialog.hide();
                        };
                    }
                });
            };
        }
    ])

    .controller('SidenavCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        '$settings',
        '$spirals',
        'Rectangle',
        'Triangle',
        'Circle',
        'Polygon',
        'primaryColors',
        'secondaryColors',
        'tertiaryColors',

        function ($rootScope, $scope, $timeout, $settings, $spirals, Rectangle, Triangle, Circle, Polygon, primaryColors, secondaryColors, tertiaryColors) {

            var groups = {
                'primary': primaryColors,
                'secondary': secondaryColors,
                'tertiary': tertiaryColors
            };


            $scope.RECTANGLE = new Polygon()
                .moveTo(200, 200)
                .lineTo(600, 200)
                .lineTo(600, 400)
                .lineTo(200, 400)
                .lineTo(200, 200);

            $scope.TRIANGLE = new Polygon()
                .moveTo(200, 400)
                .lineTo(400, 100)
                .lineTo(600, 400)
                .lineTo(200, 400);

            $scope.STAR = new Polygon()
                .moveTo(400.000, 325.000)
                .lineTo(517.557, 386.803)
                .lineTo(495.106, 255.902)
                .lineTo(590.211, 163.197)
                .lineTo(458.779, 144.098)
                .lineTo(400.000, 25.000)
                .lineTo(341.221, 144.098)
                .lineTo(209.789, 163.197)
                .lineTo(304.894, 255.902)
                .lineTo(282.443, 386.803)
                .lineTo(400.000, 325.000);

            $scope.PSEUDO_TRIANGLE = new Polygon()
                .moveTo(100, 100)
                .curveTo(400,100, 250,175)
                .curveTo(250,500, 275,250)
                .curveTo(100,100, 225,250);

            $scope.RECTANGLE = new Polygon()
                .moveTo(100, 300)
                .curveTo(300, 50, 300, 300)
                .curveTo(500, 300, 300, 300)
                .curveTo(300, 550, 300, 400)
                .curveTo(100, 300, 300, 400);

            function encode(e1, e2, e3) {
                var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var enc1 = e1 >> 2,
                    enc2 = ((e1 & 3) << 4) | (e2 >> 4),
                    enc3 = ((e2 & 15) << 2) | (e3 >> 6),
                    enc4 = e3 & 63;

                return keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }

            function generateDataUri (color) {

                // Convert the color to RGB
                var rgb = tinycolor(color).toRgb();

                // Encode the RGB values
                var enc1 = encode(0, rgb.r, rgb.g),
                    enc2 = encode(rgb.b, 255, 255),
                    encoded = enc1 + enc2;

                return "data:image/gif;base64,R0lGODlhAQABAPAA" + encoded + "/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
            }

            $scope.onChange = function () {

                // Update the settings service when the form values change
                $settings.setSweep($scope.sweep);
                $settings.setWidth($scope.width);
                $settings.setTheta($scope.theta);
                $settings.setOmega($scope.omega);
                $settings.setAlternate($scope.alternate);
                $settings.setFlat($scope.flat);
            };


            $scope.addColor = function (color) {
                $scope.colors.push({
                    hex: color,
                    data: generateDataUri(color)
                });

                // Allow a max of six colors
                $scope.colors = $scope.colors.slice(-6);
            };

            $scope.queryColor = function () {
                return $scope.colors;
            };


            // Boundary shape
            $scope.isSelected = function (polygon) {
                var boundary = $spirals.getBoundary();
                return boundary === polygon;
            };

            $scope.hasBoundary = function () {
                return !!$spirals.getBoundary();
            };

            $scope.clearBoundary = function () {
                $spirals.clearBoundary();
            };

            $scope.setBoundary = function (polygon) {
                $spirals.setBoundary(polygon);
            };

            $scope.expand = function (idx) {
                $scope.expanded = null;
                $timeout(function () {
                    $scope.expanded = idx;
                }, 700);
            };


            // Initilization
            $scope.sweep = $settings.getSweep();
            $scope.width = $settings.getWidth();
            $scope.theta = $settings.getTheta();
            $scope.omega = $settings.getOmega();
            $scope.alternate = $settings.shouldAlternate();
            $scope.flat = $settings.isFlat();

            $scope.colors = [];
            $scope.color = '#FFFFFF';
            $scope.group = 'primary';
            $scope.expanded = 0;


            // Watch for changes in the color selection
            $scope.$watch('colors', function (colors) {

                // Only want the hex values
                var hexColors = [];
                angular.forEach(colors, function (c) {
                    hexColors.push(c.hex);
                });

                // Update the color settings
                $settings.setColors(hexColors);
            }, true);

            $scope.$watch('group', function (group) {
                var colors = groups[group] || [];

                $scope.colors = [];
                angular.forEach(colors, function (c) {
                    $scope.addColor(c);
                });
            });

            $scope.$watch('scheme', function (scheme) {

                if (scheme) {
                    var hsv = tinycolor($scope.color).toHsv();
                    var colors = Please.make_scheme(hsv, {
                    	scheme_type: scheme,
                    	format: 'hex'
                    });

                    $scope.colors = [];
                    angular.forEach(colors, function (c) {
                        $scope.addColor(c);
                    });
                }
            });

            // Listen for when the spiral list is updated
            $rootScope.$on('$spirals.changed', function ($event) {
                $scope.spirals = $spirals.get().reverse();

                // Design metrics
                $scope.balance = $spirals.getBalance();
                $scope.colorHarmony = $spirals.getColorHarmony();

                // Area/porosity metrics
                $scope.boundaryArea = $spirals.getBoundaryArea();
                $scope.packedArea = $spirals.getPackedArea();
                $scope.porosity = $spirals.getPorosity();
            });
        }
    ])


    .controller('MainCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        '$mdDialog',
        '$mouse',
        '$settings',
        '$canvas',
        '$spirals',
        '$math',
        'Line',
        'Polygon',
        'Spiral',


        function ($rootScope, $scope, $timeout, $mdDialog, $mouse, $settings, $canvas, $spirals, $math, Line, Polygon, Spiral) {

            // Image export
            $scope.showExport = function ($event) {

                var modalInstance = $mdDialog.show({
                    templateUrl: 'templates/modals/save.html',
                    targetEvent: $event,
                    hasBackdrop: true,
                    clickOutsideToClose: true,
                    escapeToClose: true,

                    locals: {
                        element: angular.element('#canvas')
                    },

                    controller: function($scope, $mdDialog, $canvas, element) {

                        $scope.ok = function () {

                            // Set the background color of the SVG element
                            var bgColor = 'transparent';

                            // Export the SVG as an image
                            $canvas.export(element, {
                                type: $scope.type,
                                filename: $scope.filename,
                                quality: 1.0,
                                scale: 2.0
                            });

                            $mdDialog.hide();
                        };

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };

                        // Initilization
                        $scope.filename = 'packing';
                        $scope.bgColor = '#fff';
                    }
                });

                // Exporting start
                $scope.exporting = true;

                // Exporting complete
                modalInstance.then(function () {
                    $scope.exporting = false;
                });
            };


            // Settings
            $scope.isFlat = function () {
                return $settings.isFlat();
            };

            $scope.getColors = function () {
                return $settings.getColors();
            };

            $scope.getBoundaryLines = function () {
                var boundary = $spirals.getBoundary();
                return boundary && boundary.getLines();
            };

            // Zoom functions
            $scope.zoomIn = function () {
                var zoom = $scope.zoom + 0.25;
                $scope.zoom = Math.min(zoom, 2.0);
            };

            $scope.zoomOut = function () {
                var zoom = $scope.zoom - 0.25;
                $scope.zoom = Math.max(zoom, 0.5);
            };

            $scope.isZoomInDisabled = function () {
                return $scope.zoom === 2.0;
            };

            $scope.isZoomOutDisabled = function () {
                return $scope.zoom === 0.5;
            };

            // Translate functions
            $scope.pan = function (panX, panY) {
                $timeout(function () {
                    $scope.panX = panX;
                    $scope.panY = panY;
                });
            };


            $scope.reset = function () {
                $scope.seeding = false;
                $scope.branching = false;
                $scope.callback = null;
                $scope.transient = null;
                $scope.selected = null;
            };


            // Debug
            $scope.toggleDebug = function () {
                $scope.debug = !$scope.debug;
            };

            $scope.toggleSeeding = function () {
                $scope.branching = false;
                $scope.seeding = !$scope.seeding;
            };

            $scope.toggleBranching = function () {
                $scope.seeding = false;
                $scope.branching = !$scope.branching;
            };

            $scope.toggleGrid = function () {
                $scope.grid = !$scope.grid;
            };


            // Canvas events
            var to = null;
            $scope.canvasHover = function ($event) {
                // Get the mouse position
                var loc = $mouse.getRelativeLocation($event),
                    x = loc.x,
                    y = loc.y;

                // console.log('hover:', x, y);

                // If there is a callback defined, execute it
                if ($scope.callback) {
                    // Cancel the current hover operation
                    if (to) { $timeout.cancel(to); }

                    // Set the new hover operation
                    to = $timeout(function () {
                        $scope.callback(x, y, true);
                    });
                }
            };

            $scope.canvasClick = function ($event) {

                // Get the click position
                var loc = $mouse.getRelativeLocation($event),
                    x = loc.x,
                    y = loc.y;

                // Adjust for the zoom
                x /= $scope.zoom || 1;
                y /= $scope.zoom || 1;

                // Adjust for panning
                x -= $scope.panX || 0;
                y -= $scope.panY || 0;

                console.log('click:', x, y);

                // If there is a callback defined, execute it
                if ($scope.callback) {
                    $scope.callback(x, y, false);

                    if ($scope.seeding) {
                        $scope.seeding = false;
                        $scope.callback = null;
                        $scope.transient = null;
                    }
                }
            };

            $scope.selected = null;
            $scope.select = function (s, $event) {
                console.log('select');
                $event && $event.stopImmediatePropagation();
                $scope.selected = s;
                $scope.seeding = false;
                $scope.branching = true;
            };

            $scope.hasSelected = function () {
                return !!$scope.selected;
            };

            $scope.isSelected = function (s) {
                return $scope.selected === s;
            };

            $scope.isSeed = function (s) {
                return !s.parent;
            };

            $scope.delete = function () {
                $spirals.remove($scope.selected);
                $scope.selected = null;
            };

            $scope.$watch('seeding', function (value) {
                if(!value) { return; }

                $scope.callback = function (x, y, transient) {
                    var seeds = $spirals.seed(x, y);
                    $scope.transient = seeds;

                    if (!transient) {
                        $spirals.addSeeds(seeds[0], seeds[1]);
                    }
                };
            });

            $scope.$watch('branching', function (value) {
                if(!value) { return; }

                $scope.callback = function (x, y, transient) {
                    if (!$scope.selected || transient) { return; }
                    $spirals.branch(x, y, $scope.selected);
                };
            });


            // Listen for when the spiral list is updated
            $rootScope.$on('$spirals.changed', function ($event) {
                var spirals = $spirals.get();
                spirals.splice().reverse();
                $scope.spirals = spirals;
            });

            $scope.zoom = 1;
            $scope.panX = 0;
            $scope.panY = 0;
            $scope.grid = true;
            $scope.debug = true;
            $scope.spirals = [];


            console.log('MainCtrl');
        }
    ])


    .controller('TestCtrl', [
        '$scope',
        'Circle',
        'Spiral',

        function ($scope, Circle, Spiral) {

            // The test spiral
            $scope.S = new Spiral(3, 20, -Math.PI, 1, 200, 200);

            $scope.test_edge = function () {

                $scope.points = [
                    $scope.S.getEdgePoint($scope.S.center.x, $scope.S.center.y),
                    $scope.S.getEdgePoint(0, 0),
                    $scope.S.getEdgePoint(200, 100),
                    $scope.S.getEdgePoint(300, 200),
                    $scope.S.getEdgePoint(350, 300),
                    $scope.S.getEdgePoint(200, 300)
                ];

                angular.forEach($scope.points, function (p, i) {
                    console.log('p' + i + ':', p.x + ',' + p.y);
                });
            };

            $scope.test_intersect = function () {

                // The intersecting spirals
                $scope.spirals = [
                    new Spiral(3, 20, 0, 1, 300, 200),
                    new Spiral(3, 20, 0, 1, 250, 150),
                    new Spiral(3, 20, 0, 1, 200, 200),
                    new Spiral(3, 20, -Math.PI, 1, 200, 200),
                    new Spiral(3, 20, -Math.PI/2, -1, 200, 105),
                    new Spiral(3, 20, Math.PI/2, 1, 200, 290),
                    new Spiral(3, 20, 5*Math.PI/4, -1, 155, 125),
                ];

                angular.forEach($scope.spirals, function (s, i) {
                    console.log('S' + i + ' N S:', s.intersects($scope.S), s.getDistance($scope.S));
                });
            };

            $scope.test_radius = function () {

                var T = $scope.S.sweep,
                    w = $scope.S.width,
                    x = $scope.S.center.x,
                    y = $scope.S.center.y;

                var r0 = w * (T-1),
                    r1 = $scope.S.getRadius(x, y - 200),
                    r2 = $scope.S.getRadius(x, y + 200);

                $scope.circles = [
                    new Circle(r0, x, y),
                    new Circle(r1, x, y),
                    new Circle(r2, x, y)
                ];
            };


            function getSpiral (x, y, omega) {
                var dx = $scope.S.center.x - x,
                    dy = $scope.S.center.y - y,
                    theta = Math.atan2(dy, dx);

                // Get a spiral branching from S
                var s = new Spiral(3, 20, theta, omega || 1, x, y);
                return s.fit($scope.S);
            }

            $scope.test_fit = function () {
                console.clear();

                var S = $scope.S.clone();

                // The spirals to fit to
                var s1 = getSpiral(350, 50),
                    s2 = getSpiral(350, 350);

                // The spirals to be fitted
                var s3 = getSpiral(200, 50, -1),
                    s4 = getSpiral(200, 350, -1),
                    s5 = getSpiral(350, 200, -1);

                // Fit the spirals
                s3 = s3.fit(S, s1, s2);
                s4 = s4.fit(S, s1, s2);
                s5 = s5.fit(S, s1, s2);

                S.addChild(s1);
                S.addChild(s2);
                S.addChild(s3);
                S.addChild(s4);
                S.addChild(s5);

                $scope.spirals = [
                    S, s1, s2, s3, s4, s5
                ];
            };


            $scope.test_circles = function () {

                var S1 = $scope.S,
                    S2 = getSpiral(350, 50);

                var x = 300,          y = 200,
                    x1 = S1.center.x, y1 = S1.center.y,
                    x2 = S2.center.x, y2 = S2.center.y;

                var v = S1.getEdgePoint(x, y),
                    x3 = v.x, y3 = v.y;

                var r1 = S1.getRadius(x, y),
                    r2 = S2.getRadius(x, y);

                var c1 = new Circle(r1, x1, y1),
                    c2 = new Circle(r2, x2, y2),
                    c3 = new Circle(0, x3, y3);

                var c = new Circle();
                c = c.fit(c1, c2, c3);


                console.log('r = ' + c.radius, 'cx = ' + c.center.x, 'cy = ' + c.center.y);
                $scope.spirals = null;
                $scope.circles = [ c1, c2, c3, c ];
                $scope.points = [
                    { x: x, y: y },
                    { x: x3, y: y3 },
                    c.center
                ];
            };

            $scope.test_bounding = function () {

                function getBoundingRadius (xs, ys, SP, S1) {

                    var xp = SP.center.x, yp = SP.center.y,
                        x1 = S1.center.x, y1 = S1.center.y;

                    var rp = SP.getRadius(xs, ys),
                        // r1 = S1.getRadius(xs, ys);
                        r1 = S1.width * (S1.sweep - 1);

                    var v = SP.getEdgePoint(xs, ys);

                    var cs = new Circle(0, xs, ys),
                        cp = new Circle(rp, xp, yp),
                        c1 = new Circle(r1, x1, y1),
                        cv = new Circle(0, v.x, v.y),
                        c = cs.fit(cp, c1, cv);

                    c.radius = c.radius - (S1.getRadius(c.center.x, c.center.y) - r1);
                    console.log('r =', c.radius, 'x =', c.center.x, 'y =', c.center.y);
                    return c;
                }

                function getMinBoundingDisc (xs, ys, SP, spirals) {

                    var minc = null;

                    angular.forEach(spirals, function (s) {
                        var c = getBoundingRadius(xs, ys, SP, s);
                        minc = (!minc || c.radius < minc.radius) ? c : minc;
                    });

                    return minc;
                }

                var SP = $scope.S.clone(),
                    S1 = getSpiral(350, 50),
                    S2 = getSpiral(350, 350);

                var xs0 = 300, ys0 = 200,
                    xs1 = 300, ys1 = 300,
                    xs2 = 200, ys2 = 300,
                    xs3 = 200, ys3 = 100;


                var c0 = getMinBoundingDisc(xs0, ys0, SP, [S1,S2]),
                    c1 = getMinBoundingDisc(xs1, ys1, SP, [S1,S2]),
                    c2 = getMinBoundingDisc(xs2, ys2, SP, [S1,S2]),
                    c3 = getMinBoundingDisc(xs3, ys3, SP, [S1,S2]);

                $scope.spirals = [ S1, S2 ];
                $scope.points = [
                    { x: xs0, y: ys0 },
                    { x: xs1, y: ys1 },
                    { x: xs2, y: ys2 },
                    { x: xs3, y: ys3 }
                ];

                $scope.circles = [ c0, c1, c2, c3 ];
            };

            $scope.test_bounding2 = function () {

                var SP = $scope.S.clone(),
                    S1 = getSpiral(350, 50),
                    S2 = getSpiral(350, 350);

                var x0 = 300, y0 = 200,
                    x1 = 300, y1 = 300,
                    x2 = 200, y2 = 300,
                    x3 = 200, y3 = 50;

                var s0 = getSpiral(x3, y3);
                s0 = s0.fit(SP, SP, S1);
                console.log(s0);

                $scope.spirals = [ SP, S1, s0 ];
                $scope.points = [
                    { x: x0, y: y0 },
                    // { x: x1, y: y1 },
                    // { x: x2, y: y2 },
                    // { x: x3, y: y3 }
                ];
            };

            console.log('TestCtrl');
        }
    ]);
