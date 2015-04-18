'use strict';


angular.module('spiralApp')
    .controller('SpiralCtrl', [
        '$scope',
        'Point2',
        'Path',
        'Spiral',

        function ($scope, Point2, Path, Spiral) {

            $scope.getPoint = function (t) {
                return spiral.getPoint(t);
            };

            $scope.spiral = new Spiral(
                $scope.sweep, $scope.width,
                $scope.theta, $scope.omega,
                $scope.cx, $scope.cy);

            console.log('ctrl');
        }
    ]);
