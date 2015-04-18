'use strict';


angular.module('svg.directives', [])

	.directive('svgCanvas', [

		function () {
	        return {
	            restrict: 'E',
	            replace: true,
				transclude: true,
	            templateUrl: 'templates/svg/canvas.html',
				templateNamespace: 'svg',

	            link: function ($scope, element, attrs, ctrl, transclude) {

					attrs.$observe('scale', function() {
						$scope.scale = attrs.scale;
					});

					// Appends the transcluded content into
					// the group element so that transformations like zoom
					// and pan can be applied to all of the content
	                transclude($scope, function (nodes) {
	                    element.find('g').append(nodes);
	                });
	            }
	        };
    	}
	])

	.directive('svgSpiral', [
		'Color',

		function (Color) {
	        return {
	            restrict: 'E',
	            replace: true,
	            templateUrl: 'templates/svg/spiral.html',
				templateNamespace: 'svg',
				scope: {
					sweep: '&?',
					width: '&?',
					theta: '&?',
					omega: '&?',
					cx: '&?',
					cy: '&?',
					colors: '&?',
					gloss: '&?'
				},

	            link: function ($scope, element, attrs) {

					// The spiral parameters
					var sweep = $scope.sweep() || 0,
						width = $scope.width() || 0,
						theta = $scope.theta() || 0,
						omega = $scope.omega() || 1,
						cx = $scope.cx() || 0,
						cy = $scope.cy() || 0;

					// The spiral is broken up into segments for rendering
					var segmentsPerTurn = 20,
					 	numSegments = sweep * segmentsPerTurn,
						numColors = numSegments + 1;

					// Split the colors into sgements
					var colors = Color
						.split(numColors, $scope.colors());


					function getPoint (t) {
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

						var segments = [];

						// The amount to change at each iteration
						var delta = 1 / 20;

						for (var t = 0; t < sweep; t += delta) {

							var t0 = t,
								t1 = Math.min(t + delta + 0.005, sweep),
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
					$scope.gloss = $scope.gloss() || false;
					$scope.colors = colors;
	            }
	        };
		}
	]);
