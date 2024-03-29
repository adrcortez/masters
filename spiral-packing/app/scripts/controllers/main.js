'use strict';

/**
 * @ngdoc function
 * @name spiralApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spiralApp
 */
angular.module('spiralApp')

    .controller('MainCtrl', function ($scope, $window, $modal) {

        // Image export
        $scope.saveImage = function () {

            // Turn off debug when exporting the images
            var debug = $scope.debug;
            $scope.debug = false;

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/save.html',
                backdrop: true,

                resolve: {
                    svg: function () {
                        return angular.element('svg')[0];
                    }
                },

                controller: function($scope, $modalInstance, svg) {

                    $scope.ok = function () {
                        window.saveSvgAsPng(svg, $scope.filename, {scale: 2.0});
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };

                    // Initilization
                    $scope.filename = 'packing';
                }
            });


            modalInstance.result.then(function () {

                // Reset the debug value
                $scope.debug = debug;
            });
        };


        $scope.settings = function () {

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/settings.html',
                backdrop: true,

                controller: function($scope, $modalInstance, $settings) {

                    $scope.ok = function () {
                        $settings.setSweep($scope.sweep);
                        $settings.setWidth($scope.width);
                        $settings.setTheta($scope.theta);
                        $settings.setOmega($scope.omega);
                        $settings.setAlternate($scope.alternate);

                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss();
                    };

                    // Initilization
                    $scope.sweep = $settings.getSweep();
                    $scope.width = $settings.getWidth();
                    $scope.theta = $settings.getTheta();
                    $scope.omega = $settings.getOmega();
                    $scope.alternate = $settings.shouldAlternate();
                }
            });
        };


        // Debug
        $scope.toggleDebug = function () {
            $scope.debug = !$scope.debug;
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


        $scope.zoom = 1;
        $scope.debug = true;
    });
