'use strict';


angular.module('svg.directives', ['RecursionHelper'])

	.directive('svgCanvas', [
		'$canvas',

		function ($canvas) {
	        return {
	            restrict: 'E',
	            replace: true,
				transclude: true,
	            templateUrl: 'templates/svg/canvas.html',
				templateNamespace: 'svg',

	            link: function ($scope, element, attrs, ctrl, transclude) {

					// $scope.getShapes = function () {
					// 	return $canvas.getShapes();
					// };

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


	.directive('svgLine', [

		function () {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'templates/svg/line.html',
				templateNamespace: 'svg',
				scope: {
					start: '=',
					end: '=',
					control: '=?'
				},

	            link: function ($scope, element, attrs) {
				}
			};
		}
	])


	.directive('svgSpiral', [
		'RecursionHelper',
		'Color',

		function (RecursionHelper, Color) {
	        return {
	            restrict: 'E',
	            replace: true,
	            templateUrl: 'templates/svg/spiral.html',
				templateNamespace: 'svg',
				scope: {
					// sweep: '&?',
					// width: '&?',
					// theta: '&?',
					// omega: '&?',
					// cx: '&?',
					// cy: '&?',
					colors: '&?',
					flat: '&?',
					clip: '&?',
					children: '=?',
					spiral: '='
				},

				compile: function (element) {
            		return RecursionHelper.compile(element, function ($scope, element, attrs) {

						// The spiral parameters
						var spiral = $scope.spiral;

						$scope.sweep = spiral.sweep;
						$scope.width = spiral.width;
						$scope.theta = spiral.theta;
						$scope.omega = spiral.omega;
						$scope.cx = spiral.center.x;
						$scope.cy = spiral.center.y;
						$scope.index = spiral.index;


						// The spiral is broken up into multiple
						// segments for rendering
						var numSegments = $scope.sweep * 20;

						// The spiral colors
						// var colors = angular.copy($scope.colors());
						var colors = angular.copy(spiral.colors);

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


						function getSegments (tmin, tmax) {

							tmin = tmin || 0;
							tmax = tmax || $scope.sweep;

							// The amount to change at each iteration
							var delta = 1 / 20;

							var segments = [];
							for (var t = tmin; t < tmax; t += delta) {

								var t0 = t,
									t1 = Math.min(t + delta + 0.005, tmax),
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
						$scope.outerSegments = getSegments($scope.sweep - 1, $scope.sweep);
						$scope.innerSegments = getSegments(0, $scope.sweep - 1);
						$scope.isFlat = spiral.isFlat || false;
						$scope.colors = colors;

						$scope.strokeWidth = $scope.$eval(attrs.strokeWidth);

						$scope.$watch('children.length', function (value) {

							angular.forEach(spiral.children, function (s) {

								// Determine where the child meets the parent
								var t = spiral.getEdgeT(s.center.x, s.center.y);
								var i = Math.floor(20 * t);

								// Determine the parent color where they meet
								var color = colors[i];
								var clrs = angular.copy(s.colors);

								// Make the child end on that color. Add it
								// twice to offset the effects of clipping
								clrs.push(color);
								clrs.push(color);
								s.colors = clrs;
							});

							$scope.children = spiral.children;
						});
		            });
				}
	        };
		}
	]);
