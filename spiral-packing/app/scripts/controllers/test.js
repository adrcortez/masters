'use strict';

angular.module('spiralApp')

    .controller('TestCtrl', function (
        $scope, epsilon, Point2, Vector2, Circle, Spiral) {

        var PI = Math.PI;

        $scope.colors = [ 'red', 'green', 'blue', 'orange', 'black', 'purple' ];
        $scope.input = {};
        $scope.output = {};


        $scope.test_circles2 = function () {
            var c1 = new Circle(51.03499822597868, new Point2(345, 267)),
                c2 = new Circle(45.10205277727093, new Point2(279.59262274024434, 201.59262274024445)),
                c3 = new Circle(59.522086458890875, new Point2(409.8278359608595, 208.4748703131129)),
                c4 = new Circle(40, new Point2(600, 250)),
                c5 = new Circle(30, new Point2(750, 200));

            c1.color = 'red';
            c2.color = 'green';
            c3.color = 'orange';
            c4.color = 'red';
            c5.color = 'green';

            var c0 = new Circle(40, new Point2(341, 146));
            // c0 = c0.fit(c1, c2, c3);
            c0.color = 'blue';

            var c6 = c4.fit(c4, c5, c5);
            c6.color = 'blue';

            $scope.input = {
                circles: [c1, c2, c3, c4, c5]
            };

            $scope.output = {
                circles: [c0, c6]
            };
        };

        $scope.test_circles = function () {
            console.log('circles');

            var c0 = new Circle(50, new Point2(100, 400)),
                c1 = new Circle(20, new Point2(200, 200)),
                c2 = new Circle(20, new Point2(300, 200)),
                c3 = new Circle(20, new Point2(250, 400)),
                c4 = new Circle(80, new Point2(500, 300)),
                c5 = new Circle(80, new Point2(600, 300)),
                c6 = new Circle(80, new Point2(550, 375));

            c0.color = 'red';
            c1.color = 'green';
            c2.color = 'blue';
            c3.color = 'orange';
            c4.color = 'red';
            c5.color = 'green';
            c6.color = 'blue';

            var r0 = c0.fit(c1),
                r1 = c0.fit(c1, c2),
                r2 = c0.fit(c1, c2, c3),
                r3 = c4.fit(c4, c5, c6);

            var p0 = c0.getEdgePoint(100, 500),
                p1 = c0.getEdgePoint(200, 400),
                p2 = c0.getEdgePoint(150, 350),
                p3 = c0.getEdgePoint(50, 350);

            $scope.input = {
                circles: [c0, c1, c2, c3, c4, c5, c6],
                points: [new Point2(100, 500), new Point2(200, 400),
                         new Point2(150, 350), new Point2(50, 350)]

            };

            $scope.output = {
                circles: [r0, r1, r2, r3],
                points: [p0, p1, p2, p3]
            };
        }

        $scope.test_spirals = function () {
            console.log('spirals');

            var s1 = new Spiral(4, 20, 0, 1, new Point2(200, 150)),
                s2 = new Spiral(4, 20, PI/6, 1, new Point2(400, 100)),
                s3 = new Spiral(3, 30, 0, -1, new Point2(400, 300)),
                s4 = new Spiral(4, 20, -PI/2, 1, new Point2(100, 400));

            s1.color = 'red';
            s2.color = 'green';
            s3.color = 'blue';
            s4.color = 'black';

            var t1 = new Circle(s4.width * s4.sweep, s4.center),
                t2 = new Circle(s4.width * (s4.sweep - 1), s4.center),
                t3 = new Circle(s4.width * (s4.sweep - 0.5), s4.center);
            t1.color = 'orange';
            t2.color = 'blue';
            t3.color = 'red';

            console.log('s1 N s2 = ' + s1.intersects(s2), 'd = ' + s1.getDistance(s2));
            console.log('s1 N s3 = ' + s1.intersects(s3), 'd = ' + s1.getDistance(s3));
            console.log('s2 N s3 = ' + s2.intersects(s3), 'd = ' + s2.getDistance(s3));
            console.log('s3 N s2 = ' + s3.intersects(s2), 'd = ' + s3.getDistance(s2));

            var e1 = s2.getEdgePoint(s3.center.x, s3.center.y),
                e2 = s3.getEdgePoint(s2.center.x, s2.center.y),
                e3 = s2.getEdgePoint(s1.center.x, s1.center.y);

            var c1 = s1.getBoundingCircle(s2),
                c2 = s1.getBoundingCircle(s3),
                c3 = s2.getBoundingCircle(s3),
                c4 = s3.getBoundingCircle(s2);

            $scope.input = {
                spirals: [ s1, s2, s3 ],
                circles: [ t1, t2, t3 ]
            };

            $scope.output = {
                spirals: [s4],
                points: [e1, e2, e3 ],
                circles: [c1, c2, c3, c4 ]
            };
        };

        $scope.test_fit = function () {
            var S0 = new Spiral(3, 20, 0, 1, new Point2(260, 250)),
                SP = new Spiral(3, 20, 5*PI/2, 1, new Point2(225, 375)),
                S1 = new Spiral(3, 20, 5*PI/4, 1, new Point2(200, 250));

            S0.color = 'red';
            SP.color = 'green';

            var S = S0.clone();

            // Adjust the center of the input spiral so that
            // it branches of of the parent
            var v = SP.getEdgePoint(S.center.x, S.center.y),
                r = S.width * (S.sweep - 1),
                c1 = new Circle(r, S.center),
                c2 = new Circle(0, v),
                c0 = Circle.fit1(c1, c2);
            S.center = c0.center;

            var sp = [];
            var i = 0;

            while (S.intersects(S1)) {
                console.log('FIT');
                S = S.fit(SP, S1, null, $scope);

                if (i > 50) {
                    console.log('EXIT');
                    break;
                }
                i++;
                // sp.push(p);
            }

            S.color = 'red';

            $scope.input = {
                spirals: [ SP, S1, S ]
            };

            $scope.output = {
                spirals: [ S0 ],
                circles: [ $scope.c1, $scope.c2, $scope.c3, $scope.c0 ],
                points: [ ]
            };
        };

        $scope.test_fit2 = function () {
            var S0 = new Spiral(3, 20, 0, 1, new Point2(560, 250)),
                SP = new Spiral(3, 20, 5*PI/2, 1, new Point2(525, 375)),
                S1 = new Spiral(3, 20, 5*PI/4, 1, new Point2(500, 250)),
                S2 = new Spiral(3, 20, 7*PI/4, 1, new Point2(625, 250));

            // S2 = null;
            S0.color = 'red';
            SP.color = 'green';

            var S = S0.clone();

            // Adjust the center of the input spiral so that
            // it branches of of the parent
            var v = SP.getEdgePoint(S.center.x, S.center.y),
                r = S.width * (S.sweep - 1),
                c1 = new Circle(r, S.center),
                c2 = new Circle(0, v),
                c0 = Circle.fit1(c1, c2);
            S.center = c0.center;

            var sp = [];
            var i = 0;

            S = S.fit(SP, S1, S2, $scope);
            var S1, S2;

            while (S.intersects(S1) || S.intersects(S2)) {
                console.log('FIT');

                var i1 = S.getDistance(S1);
                var i2 = S.getDistance(S2);
                var S4 = i1 < i2 ? S1 : S2;

                var oldWidth = S.width;

                var S5 = S.fit(SP, S1, S4);
                var S6 = S.fit(SP, S2, S4);
                S = S5.width < S6.width ? S5 : S6;

                if (S.width > oldWidth) {
                    break;
                }

                S1 = (S5.width < S6.width) ? S1 : S2;
                S2 = S4;

                S = S.fit(SP, S1, S2, $scope);

                if (i > 50) {
                    console.log('EXIT');
                    break;
                }
                i++;
                // sp.push(p);
            }

            S.color = 'red';

            $scope.input.spirals =
                $scope.input.spirals.concat([ SP, S1, S2, S ]);

            $scope.output.spirals =
                $scope.output.spirals.concat([ S0 ]),

            $scope.output.circles =
                $scope.output.circles.concat([ $scope.c1, $scope.c2, $scope.c3, $scope.c0 ]);
        };

        console.log('TestCtrl');
    });
