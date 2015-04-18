'use strict';

/**
 * @ngdoc function
 * @name spiralApp.controller:CanvasCtrl
 * @description
 * # CanvasCtrl
 * Defines the functions for interacting with the canvas
 * and drawing shapes.
 */
angular.module('spiralApp')
    .controller('CanvasCtrl', function (
        $scope, $filter, $mouse, $modal, $settings, $spirals,
        epsilon, Color, Gradient, Point2, Vector2, Circle, Spiral) {


        $scope.nm = function (t) {

        };

        function weirdFit (S, S1, S2) {

            var v = S1.getEdgePoint(S.center.x, S.center.y);
            var r = S.width * (S.sweep - 1),
                c0 = new Circle(r, S.center);

            var c1 = S1 && S1.getBoundingCircle(S, 1),
                c2 = S2 && S2.getBoundingCircle(S),
                c3 = new Circle(0, v);

            $scope.bc1 = c1;
            $scope.bc2 = c2;
            $scope.bc3 = c3;

            var c0 = Circle.fit(c1, c2, c3);
            // c0 = c0.fit(c1);
            var w = c0.radius / (S.sweep - 1);

            $scope.circles = [];
            $scope.circles.push(c0);

            $scope.points = [];
            $scope.points.push(c0.center);

            // $scope.circles = [];
            // $scope.circles.push(new Circle(S.width * (S.sweep - 1), S.center));
            // $scope.circles.push(new Circle(S.width * S.sweep, S.center));
            // $scope.S = S;

            return new Spiral(S.sweep, w, S.theta, S.omega, c0.center);
        }


        function fit (S0, SP, S2, S3) {

            var S = S0.clone(),
                S1 = SP.clone();

            var r0 = S.width * (S.sweep - 1),
                c0 = new Circle(r0, S.center);

            var i = 0;
            var rso = [0, 0, 0];

            while (true) {

                // Calculate the phase angle for the spiral
                var dx = SP.center.x - c0.center.x,
                    dy = SP.center.y - c0.center.y,
                    theta = Math.atan2(dy, dx);

                S.center = new Point2(c0.center.x, c0.center.y);
                S.width = c0.radius / (S.sweep - 1);
                S.theta = theta;

                // Determine the approximating circles for the
                // bounding spirals
                var circles = _.map([S1, S2, S3], function (s, j) {
                    if (!s) return;

                    var ri = s.getRadius(S.center.x, S.center.y);
                    var rsi = s.equals(SP) ?
                        S.width * (S.sweep - 1) :
                        S.getRadius(s.center.x, s.center.y);

                    var r = ri + rso[j];
                    return new Circle(r, s.center);
                });

                var c1 = circles[0];
                var c2 = circles[1];
                var c3 = circles[2];

                var delta = 0.1;
                var d2 = S2 ? Math.abs(S2.getDistance(S)) : 0;
                var d3 = S3 ? Math.abs(S3.getDistance(S)) : 0;

                // Do the circle fitting
                console.log(rso + ',\twidth = ' + S.width);
                console.log((S2 ? S2.index : 'null') + ', ' + (S3 ? S3.index : 'null'));
                if (S.intersects(S2) && S.intersects(S3)) {
                    console.log('III: ' + [S.getDistance(S2), S.getDistance(S3)]);

                    c0 = c0.fit(c1, c2, c3);
                    rso[1] += delta;
                    rso[2] += delta;
                } else if (S.intersects(S2) && S2.width > epsilon) {
                    console.log('II-S2: ' + [S.getDistance(S2), S.getDistance(S3)]);

                    c0 = c0.fit(c1, c2);
                    rso[1] += delta;
                } else if (S.intersects(S3) && S3.width > epsilon) {
                    console.log('II-S3: ' + [S.getDistance(S2), S.getDistance(S3)]);

                    c0 = c0.fit(c1, c3);
                    rso[2] += delta;
                } else {
                    console.log('I');
                    break;
                }

                console.log(' ');

                $scope.bc0 = c0;
                $scope.bc1 = c1;
                $scope.bc2 = c2;
                $scope.bc3 = c3;

                // if (i > 150) {
                //     console.log('EXIT');
                //     break;
                // }
                i++;
            }

            return S;
        }

        function branch (S0, SP) {

            console.clear();
            $scope.circles = [];
            $scope.points = [];

            var x = S0.center.x,
                y = S0.center.y;

            if (SP.contains(x, y)) {
                return;
            }

            // Adjust the center of S if the width is too large
            var v = SP.getEdgePoint(x, y),
                d = S0.center.getDistance(v),
                r = d / (S0.sweep - 1),
                w = Math.min(r, SP.width),
                m = w * (S0.sweep - 1) / d;

            x = (1-m)*v.x + m*x;
            y = (1-m)*v.y + m*y;

            // Calculate the phase angle for the new spiral
            var dx = SP.center.x - x,
                dy = SP.center.y - y,
                theta = Math.atan2(dy, dx);

            // Construct S, the child spiral
            var S = S0.clone();
            S.width = w;
            S.center = new Point2(x, y);
            S.theta = theta;

            // $scope.points.push(S0.center);
            // $scope.points.push(v);
            $scope.points.push(S.center);
            $scope.S = S;

            var i = 0;
            var S3 = S.clone();

            do {

                console.log(' ');
                console.log('********');
                console.log('MAIN LOOP: ' + i)
                var spirals = _($spirals.get())
                    .filter(function (s) { return !s.equals(SP); })
                    .sortBy(function (s) { return s.getDistance(S3); })
                    .value();

                var oldWidth = S3.width;

                var S1 = spirals[0],
                    S2 = spirals[1];

                S3 = fit(S3, SP, S1, S2);

                if (S3.width > oldWidth) {
                    console.log('WHOMP WHOMP');
                    break;
                }

                if (i > 150) {
                    console.log('POOP');
                    break;
                }
                i++;
            } while ($spirals.intersects(S3, SP));

            // if ($spirals.isValid(S3, SP, S0)) {
                return S3;
            // }

            console.log('INVALID');

            var spirals = _($spirals.get())
                .filter(function (s) { return !s.equals(SP); })
                .sortBy(function (s) { return s.getDistanceToPoint(S.center); })
                .value();

            var v = SP.getEdgePoint(S.center.x, S.center.y),
                S1 = spirals[0],
                S2 = new Spiral(100, 0, 0, 1, v);

            $scope.bc3 = new Circle(0, S2.center);
            return fit(S, SP, S1, S2);
        };


        function seedCallback (x, y) {

            var sweep = $settings.getSweep(),
                width = $settings.getWidth(),
                theta = $settings.getTheta(),
                omega = $settings.getOmega();

            // Generate the seed spirals
            var spirals = $spirals.seed(sweep, width, theta, omega, x, y);

            // Set the fill/stroke for each seed spiral
            angular.forEach(spirals, function (spiral) {
                spiral.setFill($scope.fill);
                spiral.setStroke($scope.stroke);
                spiral.setStrokeWidth($scope.strokeWidth);
            });
        }

        function branchCallback (x, y) {

            var SP = $scope.selected,
                sweep = $settings.getSweep(),
                omega = $settings.getOmega(),
                width = SP.width,
                center = new Point2(x, y);

            // Use the opposite of the parent orientation for the child
            // if set to alternating orientation
            omega = $settings.shouldAlternate() ?
                -SP.omega : omega;

            var S0 = new Spiral(sweep, width, 0, omega, center);

            // Perform the spiral branch
            // var spiral = $spirals.branch(SP, S0, $scope);
            var spiral = branch(S0, SP);
            console.log(spiral);
            if (spiral && spiral.width > 0.05) {

                spiral.index = $spirals.size();

                // Set the fill/stroke for the spiral
                spiral.setFill($scope.fill);
                spiral.setStroke($scope.stroke);
                spiral.setStrokeWidth($scope.strokeWidth);

                $spirals.add(spiral);

                spiral.parent = SP;
                SP.children.push(spiral);
            }
        }


        // Notifications
        $scope.showNotification = function () {
            $scope.hasNotification = true;
        };

        $scope.hideNotification = function () {
            $scope.hasNotification = false;
        };


        // Canvas click handler
        $scope.click = function ($event) {
            // $scope.hideNotification();

            // Only take action in edit mode
            if (!$scope.drawing) {
                return;
            }

            // Get the click position
            var loc = $mouse.getRelativeLocation($event),
                x = loc.x,
                y = loc.y;

            // If there is a callback defined, execute it
            if ($scope.callback) {
                $scope.callback(x, y);
            }
        };


        // Edit mode
        $scope.toggleDrawing = function () {
            $scope.drawing = !$scope.drawing;
        };

        // Spiral functions
        $scope.select = function (spiral) {
            $scope.selected = spiral;
        };

        $scope.isSelected = function (spiral) {
            return $scope.selected && $scope.selected.equals(spiral);
        };

        $scope.toggleSelecting = function () {

            // Clear the selection if we are toggling
            // the selection from on to off
            if ($scope.selecting) {
                $scope.selected = null;
            }

            // Toggle the selection
            $scope.selecting = !$scope.selecting;
        };


        $scope.seed = function () {
            console.log('seed');

            $scope.seeding = true;
            $scope.callback = seedCallback;
        };

        $scope.branch = function () {
            console.log('branch');

            $scope.branching = true;
            $scope.callback = branchCallback;
        };

        $scope.edit = function () {
            console.log('edit');

            $modal.open({
                templateUrl: 'templates/modals/edit.html',
                resolve: { }
            });
        };

        $scope.delete = function () {
            $spirals.remove($scope.selected);
            $scope.selected = null;
        };

        $scope.getSpirals = function () {
            return $spirals.get();
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


        // Listen for when the canvas is resized so that the
        // view box can be adjusted appropriately.
        $scope.resize = function ($event) {
            console.log($event);
            console.log($event.width + ', ' + $event.height);
            $scope.width = $event.width;
            $scope.height = $event.height;
        };


        $scope.$watch('drawing', function () {
            $scope.seeding = false;
            $scope.branching = false;
            $scope.selected = null;
        });

        $scope.$watch('seeding', function (newValue) {

            if (newValue) {

                // Stop any branching
                $scope.branching = false;

                // Clear the selection
                $scope.selected = null;
            }
        });

        $scope.$watch('selected', function (newValue) {

            if (newValue) {

                // Stop any seeding
                $scope.seeding = false;
            }

            if (!newValue) {

                // The selected spiral was deleted, so
                // stop any branching
                $scope.branching = false;
            }
        });


        // $scope.fill = new Gradient('red', 'blue');
        $scope.stroke = new Color('black');
        $scope.strokeWidth = 1;


        // Initialzation
        $scope.zoom = 1.0;
        $scope.width = 0;
        $scope.height = 0;

        console.log('CanvasCtrl');
    });
