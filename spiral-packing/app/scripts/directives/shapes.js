'use strict';

/**
 * @ngdoc function
 * @name shapes.directive:spiral
 * @description
 * # Spiral
 * Directive to draw spirals using SVG paths.
 */
angular.module('spiralApp')

// Shapes (where shapes are drawn)
.directive('shapes', [
    function () {
        return  {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            transclude: true,
            templateUrl: 'template/shapes/shapes.html',
            templateNamespace: 'svg',

            link: function ($scope, element, attrs, ngModel, transclude) {

                // Removes the ng-transclude div when inserting the
                // transcluded content. This should happen after
                // any scope modifications to make sure they are passed
                // down to any child scopes.
                transclude($scope, function (clone) {
                    element.append(clone);
                });
            }
        };
    }
])

// Spiral
.directive('spiral', [
    function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'template/shapes/spiral.html',
            templateNamespace: 'svg',

            link: function ($scope, element, attrs) {

                // Spiral parameters / defaults
                var sweep = $scope.$eval(attrs.sweep) || 3;
                var width = $scope.$eval(attrs.width) || 5;
                var theta = $scope.$eval(attrs.theta) || 0;
                var omega = $scope.$eval(attrs.omega) || 1;
                var cx = $scope.$eval(attrs.cx) || 0;
                var cy = $scope.$eval(attrs.cy) || 0;

                var points = [];
                var path = 'M' + cx + ' ' + cy + ' S ';
                var radians = theta * (Math.PI / 180);
                var delta = Math.PI / 360;

                for (var t = 0; t <= sweep; t += delta) {
                    var d = 2 * Math.PI * omega * t;
                    var x = cx + width * t * Math.cos(radians + d);
                    var y = cy + width * t * Math.sin(radians + d);
                    points.push({ x: x, y: y });
                }

                // Ensure the path has an even number of points
                if (points.length % 2 === 1) {
                    var last = points[points.length - 1];
                    points.push(last);
                }

                // Build the path string
                angular.forEach(points, function (p) {
                    path += p.x + ' ' + p.y + ' ';
                });

                // Bind the path to draw
                $scope.path = path.trim();
            }
        };
    }
]);


// Templates
angular.module('spiralApp')
.run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/shapes/shapes.html',
        '<svg class="shapes" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '   <div ng-transclude></div>\n' +
        '</svg>\n' +
        '');
}])
.run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/shapes/spiral.html',
        '<path class="spiral" ng-attr-d="{{ path }}">\n' +
        '</path>\n' +
        '');
}]);
