'use strict';

/**
 * @ngdoc function
 * @name spiralApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the spiralApp
 */
angular.module('spiralApp')
    .controller('MainCtrl', function ($scope, Spiral) {

        $scope.seed = function () {
            var T = 3.5;
            var w = 25;
            var t = 90;
            var cx = 500;
            var cy = 400;

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

        $scope.addSpiral = function ($event) {
            if ($event) $event.stopImmediatePropagation();

            var x = $event.offsetX;
            var y = $event.offsetY;
            console.log(x + ", " + y);
        };

        // Initialization
        $scope.sweep = $scope.sweep || 3;
        $scope.width = $scope.width || 25;
        $scope.theta = $scope.theta || 0;
        $scope.omega = $scope.omega || 1;
        $scope.spirals = [];

        // Create the seed spirals
        $scope.seed();
    });
