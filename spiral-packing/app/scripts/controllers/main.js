'use strict';

/**
 * @ngdoc function
 * @name spiralApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spiralApp
 */
angular.module('spiralApp')
    .controller('SaveModalCtrl', function($scope, $modalInstance, $timeout, svg) {

        $scope.save = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        // Initilization
        $scope.filename = 'packing';
        $scope.dataUri = '';

        // Do the svg to png conversion asynchronously when
        // the modal is shown
        $timeout(function () {

            // Make sure we have a jQuery element
            var element = angular.element(svg);

            // Get the svg dimensions
            var width = element.width();
            var height = element.height();

            // Make sure the exported svg data has absolute dimensions
            // to ensure things don't get cutoff in the exported image
            element.attr('width', width);
            element.attr('height', height);

            // Get the svg as a string
            var str = element[0].outerHTML;

            // Create a canvas to do the svg to png conversion
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            // Create the svg data url
            var blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
            var domURL = window.URL || window.webkitURL;
            var imgsrc = domURL.createObjectURL(blob);

            var img = new Image();
            img.onload = function() {

                // Draw the svg as an image on the canvas context
                var context = canvas.getContext('2d');
                context.drawImage(this, 0, 0);

                // Convert to png
                $scope.dataUri = canvas.toDataURL('image/png');
            };

            // Load the image data
            img.src = imgsrc;
        });
    })
    .controller('MainCtrl', function ($scope, $modal, $base64, Spiral) {

        $scope.saveImage = function () {
            $modal.open({
                templateUrl: 'templates/modals/saveImage.html',
                controller: 'SaveModalCtrl',
                backdrop: true,
                resolve: {
                    svg: function () {
                        return angular.element('#canvas').find('svg');
                    }
                }
            });
        };

        $scope.seed = function () {
            var T = 3.5;
            var w = 25;
            var t = 90;
            var cx = 500;
            var cy = 200;

            // Calculate how the spirals are offset from each other
            var r = t * (Math.PI / 180);
            var d = (T - 0.5) * w;
            var dy = d * Math.sin(r);
            var dx = d * Math.cos(r);

            // Add the seed spirals
            var s1 = new Spiral(T, w, t, -1, cx+dx, cy+dy);
            var s2 = new Spiral(T, w, t-180, -1, cx-dx, cy-dy);
            $scope.spirals = [ s1, s2 ];
        };

        $scope.clear = function ($event) {
            if ($event) {
                $event.stopImmediatePropagation();
            }

            var x = $event.offsetX;
            var y = $event.offsetY;
            console.log(x + ', ' + y);

            $scope.branchArea = null;
        };

        $scope.edit = function (spiral) {
            console.log('edit');
            console.log(spiral);

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/editSpiral.html',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

        $scope.branch = function (spiral) {
            console.log('branch');
            console.log(spiral);

            $scope.branchArea = {
                cx: spiral.cx,
                cy: spiral.cy,
                r1: spiral.getRadius(),
                r2: 2 * spiral.getRadius()
            };

            var child = spiral.branch(spiral.cx + 100, spiral.cy + 100);
            $scope.spirals.push(child);
        };

        // Watch for changes in the number of spirals
        // to compute the image data
        $scope.$watch('spirals.length', function () {
            var svg = angular.element('#canvas').html();
            var base64 = $base64.encode(svg);
            var imgdata = 'data:image/svg+xml;base64,' + base64;
            $scope.imgdata = imgdata;
        });

        // Context menu options
        $scope.menuOptions = [
            ['Edit', function ($itemScope) {
                var spiral = $itemScope.spiral;
                $scope.edit(spiral);
            }],
            null, // Divider
            ['Branch', function ($itemScope) {
                var spiral = $itemScope.spiral;
                $scope.branch(spiral);
            }]
        ];

        // Initialization
        $scope.sweep = $scope.sweep || 3;
        $scope.width = $scope.width || 25;
        $scope.theta = $scope.theta || 0;
        $scope.omega = $scope.omega || 1;
        $scope.spirals = [];

        $scope.branchArea = null;

        // Create the seed spirals
        $scope.seed();
    });
