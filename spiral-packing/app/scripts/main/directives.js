'use strict';


angular.module('svg.directives', [])

	.directive('svgSpiral', [
		'Color',

		function (Color) {
	        return {
	            restrict: 'E',
	            replace: true,
	            templateUrl: 'templates/svg/spiral.html',
				templateNamespace: 'svg',
				scope: {
                    spiral: '='
					colors: '&?',
					flat: '&?'
				},

	            link: function ($scope, element, attrs) {

					// The spiral parameters
                    $scope.sweep = $scope.spiral.sweep;
					$scope.width = $scope.spiral.width;
					$scope.theta = $scope.spiral.theta;
					$scope.omega = $scope.spiral.omega;
					$scope.cx = $scope.spiral.center.x;
					$scope.cy = $scope.spiral.center.y;
					// $scope.sweep = $scope.$eval(attrs.sweep);
					// $scope.width = $scope.$eval(attrs.width);
					// $scope.theta = $scope.$eval(attrs.theta);
					// $scope.omega = $scope.$eval(attrs.omega);
					// $scope.cx = $scope.$eval(attrs.cx);
					// $scope.cy = $scope.$eval(attrs.cy);

					// The spiral is broken up into multiple
					// segments for rendering
					var numSegments = $scope.sweep * 15;

					// The spiral colors
					var colors = angular.copy($scope.colors());

					if (colors && colors.length) {
						// Since the first third of the segments are rather small,
						// duplicate the first color to more evenly apply
						// it to the spiral relative to the other colors
						colors.unshift(colors[0]);


						// Split the color into the necessary number
						// of sub-colors, 1 more than the number of segments
						colors = Color.split(numSegments + 1, colors);
					}


					function getPoint (t) {
						var width = $scope.width,
							theta = $scope.theta,
							omega = $scope.omega,
							cx = $scope.cx,
							cy = $scope.cy;

						var r = width * t,
							a = 2 * Math.PI * omega,
							x = cx + r * Math.cos(theta + a * t),
		                    y = cy + r * Math.sin(theta + a * t);

						return { x: x, y: y };
					}


					function getControlPoint (t0, t1) {

						// The start/end points of the curve
						var p0 = getPoint(t0),
							p1 = getPoint(t1);

						// The mid-point (intersection point)
						var tm = (t0 + t1) / 2,
							pm = getPoint(tm);

						// Caculate the control point
						var x = 2*pm.x - p0.x/2 - p1.x/2,
			                y = 2*pm.y - p0.y/2 - p1.y/2;

						return { x: x, y: y };
					}


					function getSegments () {

						var sweep = $scope.sweep,
							clip = $scope.clipT;

						var tmax = !clip ? sweep : Math.min(sweep, clip);

						// The amount to change at each iteration
						var delta = $scope.sweep / numSegments;

						var segments = [];
						for (var t = 0; t < numSegments; t ++) {

							var t0 = t * delta,
								t1 = Math.min((t + 1) * delta + 0.005, tmax),
								t2 = Math.max(t1 - 1, 0),
								t3 = Math.max(t0 - 1, 0);

							var p0 = getPoint(t0),
								p1 = getPoint(t1),
								p2 = getPoint(t2),
								p3 = getPoint(t3);

							var c1 = getControlPoint(t0, t1),
								c2 = getControlPoint(t2, t3);

							// A segment a series of points
							segments.push([
								p0, c1, p1,
								p2, c2, p3
							]);
						}

						return segments;
					}

					// Set the model properties
					$scope.segments = getSegments();
					$scope.flat = $scope.flat() || false;
					$scope.colors = colors;

					// Watch for attribute changes
					attrs.$observe('sweep', function (value) {
						$scope.sweep = $scope.$eval(value);
					});

					attrs.$observe('width', function (value) {
						$scope.sweep = $scope.$eval(value);
					});

					attrs.$observe('theta', function (value) {
						$scope.sweep = $scope.$eval(value);
					});

					attrs.$observe('omega', function (value) {
						$scope.sweep = $scope.$eval(value);
					});

					attrs.$observe('cx', function (value) {
						$scope.sweep = $scope.$eval(value);
					});

					attrs.$observe('cy', function (value) {
						$scope.sweep = $scope.$eval(value);
					});
	            }
	        };
		}
	]);
