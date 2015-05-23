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

					attrs.$observe('scale', function (scale) {
						$scope.scale = scale;
					});

					attrs.$observe('translateX', function (translateX) {
						console.log(translateX);
						$scope.translateX = translateX;
					});

					attrs.$observe('translateY', function (translateY) {
						console.log(translateY);
						$scope.translateY = translateY;
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
					spiral: '=',
					ngClick: '&?',
					selected: '='
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


						// The spiral is broken up into multiple
						// segments for rendering
						var segmentsPerTurn = 15,
							numSegments = $scope.sweep * segmentsPerTurn;


						// // The spiral colors
						// if (spiral.colors && spiral.colors.length) {
						//
						// 	// Don't modify the original array
						// 	var colors = angular.copy(spiral.colors);
						//
						// 	// Since the first third of the segments are rather small,
						// 	// duplicate the first color to more evenly apply
						// 	// it to the spiral relative to the other colors
						// 	colors.unshift(colors[0]);
						//
						// 	// Split the color into the necessary number
						// 	// of sub-colors, 1 more than the number of segments
						// 	$scope.colors = Color.split(numSegments + 1, colors);
						// }


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


						function getStroke () {

							var tmin = 0,
								tmax = $scope.sweep;

							// The amount to change at each iteration
							var delta = 1 / segmentsPerTurn;

							var segments = [];
							for (var t = tmin; t < tmax; t += delta) {

								var t0 = t,
									t1 = Math.min(t + delta, tmax);

								// Determine if the segment should be clipped.
								// Only happens on outer turn
								var parts = (t0 >= $scope.sweep - 1) ?
									spiral.clip(t0, t1) :
									[{ start: t0, end: t1 }];

								// For each range part returned, create
								// a segment, taking clipping into account
								angular.forEach(parts, function (part) {
									var p0 = getPoint(part.start),
										p1 = getPoint(part.end + 0.005);

									var c1 = getControlPoint(part.start, part.end);

									// A segment a series of points
									segments.push([ p0, c1, p1 ]);
								});
							}

							return segments;
						}

						function getSegments (tmin, tmax) {

							tmin = tmin || 0;
							tmax = tmax || $scope.sweep;

							// The amount to change at each iteration
							var delta = 1 / segmentsPerTurn;

							var segments = [];
							for (var t = tmin; t < tmax; t += delta) {

								var t0 = t,
									t1 = Math.min(t + delta, tmax) + 0.005,
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
						$scope.strokeWidth = $scope.$eval(attrs.strokeWidth) || 1;
						// $scope.stroke = getStroke();


						$scope.onClick = function ($event) {
							var ngClick = $scope.ngClick();
							ngClick && ngClick(spiral, $event);
						}


						// Update the scope
						$scope.$watch('spiral.children.length', function (newLen, oldLen) {

							// Child was added
							if (newLen > oldLen) {

								if ($scope.colors) {
									// The new child spiral
									var s = spiral.children[newLen - 1];

									// Determine where the child meets the parent
									var t = spiral.getEdgeT(s.center.x, s.center.y);
									var i = Math.floor(segmentsPerTurn * t);

									// Determine the parent color where they meet
									var parentColor = $scope.colors[i],
										colors = angular.copy(s.colors);

									console.log(parentColor);

									// Make the child end on that color. Add it
									// twice to offset the effects of clipping
									colors.push(parentColor);
									colors.push(parentColor);
									s.colors = colors;
								}
							}

							// // Update the scope
							$scope.children = spiral.children;
							$scope.stroke = getStroke();
						});

						$scope.$watch('spiral.colors.length', function () {

							// The spiral colors
							if (!spiral.colors || !spiral.colors.length) {
								$scope.colors = null;
							} else {

								// Don't modify the original array
								var colors = angular.copy(spiral.colors);

								// Since the first third of the segments are rather small,
								// duplicate the first color to more evenly apply
								// it to the spiral relative to the other colors
								colors.unshift(colors[0]);

								// Split the color into the necessary number
								// of sub-colors, 1 more than the number of segments
								$scope.colors = Color.split(numSegments + 1, colors);
							}
						});

						$scope.$watch('selected', function (s) {
							$scope.isSelected = s && s.equals(spiral);
						});
		            });
				}
	        };
		}
	]);
