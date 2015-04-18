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

        function ($scope, $settings) {

            $scope.onChange = function () {

                console.log($scope.alternate);

                // Update the settings service when the form values change
                $settings.setSweep($scope.sweep);
                $settings.setWidth($scope.width);
                $settings.setTheta($scope.theta);
                $settings.setOmega($scope.omega);
                $settings.setAlternate($scope.alternate);
                $settings.setGloss($scope.gloss);
            };

            // Initilization
            $scope.sweep = $settings.getSweep();
            $scope.width = $settings.getWidth();
            $scope.theta = $settings.getTheta();
            $scope.omega = $settings.getOmega();
            $scope.alternate = $settings.shouldAlternate();
            $scope.gloss = $settings.hasGloss();
        }
    ])


    .controller('MainCtrl', [
        '$scope',
        '$mdDialog',
        '$mouse',
        '$settings',
        '$canvas',
        '$spirals',


        function ($scope, $mdDialog, $mouse, $settings, $canvas, $spirals) {

            // Image export
            $scope.showExport = function ($event) {

                var modalInstance = $mdDialog.show({
                    templateUrl: 'templates/modals/save.html',
                    targetEvent: $event,
                    hasBackdrop: true,
                    clickOutsideToClose: true,
                    escapeToClose: true,

                    locals: {
                        element: angular.element('svg')
                    },

                    controller: function($scope, $mdDialog, $canvas, element) {

                        $scope.ok = function () {

                            // Set the background color of the SVG element
                            var bgColor = $scope.bgColor || 'transparent';
                            element.css('background-color', bgColor);

                            // Export the SVG as an image
                            $canvas.export(element, {
                                type: $scope.type,
                                filename: $scope.filename,
                                quality: 1.0,
                                scale: 1.0
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
            $scope.hasGloss = function () {
                return $settings.hasGloss();
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


            // Debug
            $scope.toggleDebug = function () {
                $scope.debug = !$scope.debug;
            };


            $scope.zoom = 1;
            $scope.debug = true;

            // Canvas events
            $scope.canvasClick = function ($event) {

                // Get the click position
                var loc = $mouse.getRelativeLocation($event),
                    x = loc.x,
                    y = loc.y;

                // If there is a callback defined, execute it
                $scope.callback && $scope.callback(x, y);

                $scope.callback = null;
                $scope.seeding = false;
                $scope.branching = false;
            };


            // Spiral functions
            $scope.getSpirals = function () {
                return $spirals.get();
            };

            $scope.seed = function () {
                var sweep = $settings.getSweep(),
                    width = $settings.getWidth(),
                    theta = $settings.getTheta(),
                    omega = $settings.getOmega();

                // Set the canvas click callback to generate
                // the seed spirals
                $scope.callback = function (x, y) {
                    $spirals.seed(sweep, width, theta, omega, x, y);
                };

                $scope.seeding = true;
                $scope.branching = false;
            };
        }
    ]);
