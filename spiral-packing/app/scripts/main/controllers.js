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
        '$scope',
        '$settings',
        'Rectangle',
        'Triangle',
        'Circle',

        function ($scope, $settings, Rectangle, Triangle, Circle) {

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
            };

            $scope.queryColor = function () {
                return $scope.colors;
            };


            $scope.getBoundaryShapes = function () {
                return $settings.getBoundaryShapes();
            };

            $scope.isSelected = function (name) {
                return $scope.shape === name;
            };

            $scope.setBoundaryShape = function (name) {
                console.log(name);
                $scope.shape = name;
            };

            // Initilization
            $scope.sweep = $settings.getSweep();
            $scope.width = $settings.getWidth();
            $scope.theta = $settings.getTheta();
            $scope.omega = $settings.getOmega();
            $scope.alternate = $settings.shouldAlternate();
            $scope.flat = $settings.isFlat();
            $scope.colors = [{
                hex: '#ffffff',
                data: generateDataUri('#ffffff')
            }];


            // Watch for changes in the color selection
            $scope.$watch('colors', function (newValue) {

                // Only want the hex values
                var colors = [];
                angular.forEach(newValue, function (c) {
                    colors.push(c.hex);
                });

                // Update the color settings
                $settings.setColors(colors);
            }, true);

            $scope.$watch('shape', function (newValue) {

                // Get the boundary shape when the name selection changes
                var shapes = $settings.getBoundaryShapes(),
                    shape = shapes[newValue] || null;

                // Update the boundary shape settings
                $settings.setBoundaryShape(shape);
            });
        }
    ])


    .controller('MainCtrl', [
        '$scope',
        '$timeout',
        '$mdDialog',
        '$mouse',
        '$settings',
        '$canvas',
        '$spirals',
        '$math',
        'Line',
        'Spiral',


        function ($scope, $timeout, $mdDialog, $mouse, $settings, $canvas, $spirals, $math, Line, Spiral) {

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
                            element.css('background-color', bgColor);

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


            // Boundary
            // $spirals.addBoundaryLine(200, 200, 600, 200, 400, 100);
            // $spirals.addBoundaryLine(600, 200, 600, 400);
            // $spirals.addBoundaryLine(600, 400, 200, 400);
            // $spirals.addBoundaryLine(200, 400, 200, 200);

            // $spirals.addBoundaryLine(200, 400, 400, 100);
            // $spirals.addBoundaryLine(400, 100, 600, 400);
            // $spirals.addBoundaryLine(600, 400, 200, 400);


            $scope.getBoundaryLines = function () {
                return $spirals.getBoundaryLines();
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



            $scope.reset = function () {
                $scope.seeding = false;
                $scope.parent = null;
                $scope.callback = null;
                $scope.transient = null;
            };


            // Debug
            $scope.toggleDebug = function () {
                $scope.debug = !$scope.debug;
            };

            $scope.toggleSeeding = function () {
                $scope.seeding = !$scope.seeding;
            };

            $scope.toggleGrid = function () {
                $scope.grid = !$scope.grid;
            };


            // Canvas events
            $scope.canvasHover = function ($event) {
                // Get the mouse position
                var loc = $mouse.getRelativeLocation($event),
                    x = loc.x,
                    y = loc.y;

                console.log('hover:', x, y);

                // If there is a callback defined, execute it
                if ($scope.callback) {

                    $timeout(function () {
                        var spirals = $scope.callback(x, y);
                        $scope.transient = spirals;
                    });
                }
            };

            $scope.canvasClick = function ($event) {

                // Get the click position
                var loc = $mouse.getRelativeLocation($event),
                    x = loc.x,
                    y = loc.y;

                console.log('click:', x, y);

                // If there is a callback defined, execute it
                if ($scope.callback) {
                    $scope.callback(x, y);
                }

                $scope.reset();
            };


            // Spiral functions
            $scope.getSpirals = function () {
                return $spirals.all();
            };


            $scope.branch = function (s) {
                $scope.parent = s;
            };

            $scope.delete = function (s) {
                $spirals.remove(s);
            };


            $scope.$watch('seeding', function (seeding) {

                var sweep = $settings.getSweep(),
                    width = $settings.getWidth(),
                    theta = $settings.getTheta(),
                    omega = $settings.getOmega();

                if (seeding) {

                    // Set the canvas click callback to generate
                    // the seed spirals
                    $scope.callback = function (x, y) {
                        var spirals = $spirals.seed(
                            sweep, width, theta, omega, x, y);

                        angular.forEach(spirals, function (s) {
                            s.colors = angular.copy($settings.getColors());
                            s.isFlat = $settings.isFlat();
                            s.isSeed = true;
                            $spirals.add(s);
                        });
                    };
                } else {
                    $scope.callback = null;
                }
            });

            $scope.$watch('parent', function (parent) {

                var sweep = $settings.getSweep(),
                    omega = $settings.getOmega();

                if (parent) {

                    // Use the opposite of the parent orientation for the child
                    // if set to alternating orientation
                    omega = $settings.shouldAlternate() ?
                        -parent.omega : omega;

                    // Set the canvas click callback to generate
                    // the seed spirals
                    $scope.callback = function (x, y) {
                        // console.clear();
                        // console.log(x, y);
                        $scope.S = {x: x, y:y };
                        $scope.BD = $spirals.getBoundingDiscs(x,y,parent);

                        var s = $spirals.branch(parent, sweep, omega, x, y);
                        // console.log(s.center.x, s.center.y);

                        // Set the colors and effects
                        s.colors = angular.copy($settings.getColors());
                        s.isFlat = $settings.isFlat();

                        parent.addChild(s);
                        $spirals.add(s);
                    };
                } else {
                    $scope.callback = null;
                }
            });


            $scope.zoom = 1;
            $scope.grid = true;
            $scope.debug = true;
            $scope.math = $math;
            $scope.S = Spiral;
            $scope.$spirals = $spirals;
        }
    ]);
