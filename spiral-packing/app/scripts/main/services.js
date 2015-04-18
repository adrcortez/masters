'use strict';


angular.module('main.services', [])


    .service('$mouse', [
        '$window',

        function ($window) {

        	this.getEvent = function (e) {
                e = (e && e.originalEvent) || e || $window.event;
                return e instanceof MouseEvent ? e : null;
            };

            this.getTarget = function (e) {
                e = this.getEvent(e);
                return e && (e.target || e.srcElement);
            };

        	this.getLocation = function (e) {
                e = this.getEvent(e);
                return e && {
                    x: e.pageX || e.x,
                    y: e.pageY || e.y
                };
    		};

            this.getRelativeLocation = function(e) {
                e = this.getEvent(e);
                return e && {
                    x: e.offsetX || e.layerX || e.pageX || e.x,
                    y: e.offsetY || e.layerY || e.pageY || e.y
                };
    		};
        }
    ])


    .service('$settings', [
        'Color',

        function (Color) {

            var sweep = 3;
            var width = 20;
            var theta = Math.PI / 2;
            var omega = -1;
            var alternate = true;
            var hasGloss = false;

            var gradient = false;
            var fill = new Color('black');


        	this.getSweep = function () {
                return sweep;
            };

            this.setSweep = function (value) {
                sweep = value;
            };


            this.getWidth = function () {
                return width;
            };

            this.setWidth = function (value) {
                width = value;
            };


            this.getTheta = function () {
                return theta;
            };

            this.setTheta = function (value) {
                theta = value;
            };


            this.getOmega = function () {
                return omega;
            };

            this.setOmega = function (value) {
                omega = value;
            };


            this.shouldAlternate = function () {
                return alternate;
            };

            this.setAlternate = function (value) {
                alternate = value || false;
            };


            this.hasGloss = function () {
                return hasGloss;
            };

            this.setGloss = function (value) {
                hasGloss = value || false;
            };


            this.hasGradient = function () {
                return gradient;
            };

            this.setGradient = function (value) {
                gradient = value || false;
            };


            this.getFill = function () {
                return fill;
            };

            this.setFill = function (value) {
                fill = value;
            };
        }
    ])


    .service('$spirals', [
        'Circle',
        'Spiral',

        function (Circle, Spiral) {

            var spirals = [];

            function getNonParents (S, SP) {
                return _.filter(spirals, function (s) {
                    return !s.equals(SP) && !s.equals(S);
                });
            };

            function getIntersected (S, SP) {

                // Get the non-parent spirals
                var nonparents = getNonParents(S, SP);

                // Return the intersected non-parent spirals, sorted by
                // the intersection amount
                return _(nonparents)
                    .filter(function (s) { return s.intersects(S); })
                    .sortBy(function (s) { return s.getDistance(S); })
                    .value();
            };

            function doesIntersect (S, SP) {
                var intersected = getIntersected(S, SP);
                return intersected && intersected.length > 0;
            };

            function isValid (S, SP) {

                // The spiral is invalid or too small
                if (!S || S.width < 1) {
                    return false;
                }

                // Check to see if the spiral intersects any
                // non-parent spirals
                var intersected = getIntersected(S, SP);
                if (intersected && intersected.length > 0) {
                    return false;
                }

                // The spiral is valid
                return true;
                // Calculate the angle difference caused by the fitting
                // var v1 = new Vector2(SP.center, S0.center),
                //     v2 = new Vector2(SP.center, S.center),
                //     angle = 180/Math.PI * v1.angle(v2);
                //
                // // A valid spiral doesn't intersect and has a
                // // low angle difference
                // return (!intersects) && (angle <= 12.5);
            };

        	this.get = function () {
                return spirals;
            };

            this.size = function () {
                return spirals.length || 0;
            };

            // this.add = function (S, SP) {
            //     isValid(S, SP) && spirals.push(S);
            // };

            this.remove = function (spiral) {

                // Remove the selected spiral
                _.remove(spirals, function (s) {
                    return spiral && s.equals(spiral);
                });
            };

            this.seed = function (sweep, width, theta, omega, x, y) {

                var T = sweep, w = width, t = theta, o = omega;

                // Precalculate some stuff
                var x0 = x - w * T * Math.cos(t)/2,
                    y0 = y - w * T * Math.sin(t)/2,
                    p = 2 * Math.PI * o * T;

                // Calculate the center of the spirals
                var x1 = x0 + w * (T-1) * Math.cos(t+p) - w * T * Math.cos(t-p),
                    y1 = y0 + w * (T-1) * Math.sin(t+p) + w * T * Math.sin(t-p);

                // Define the seed spirals
                var s0 = new Spiral(T, w, t, o, x0, y0),
                    s1 = new Spiral(T, w, -t, o, x1, y1);

                // Make sure the seed spirals don't intersect
                // any other spirals
                // var intersects = intersects(_.some(spirals, function (s) {
                //     return s0.intersects(s) || s1.intersects(s);
                // });

                // Add the seed spirals if they are valid
                if (isValid(s0) && isValid(s1)) {
                    spirals.push(s0);
                    spirals.push(s1);
                }
            };
        }
    ]);
