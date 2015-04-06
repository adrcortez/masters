'use strict';

angular.module('spiralApp')

    .service('$settings', function () {

        var sweep = 3;
        var width = 20;
        var theta = Math.PI / 2;
        var omega = -1;
        var alternate = true;
        var gradient = false;

    	// Return a public API for this service.
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


        this.hasGradient = function () {
            return gradient;
        };

        this.setGradient = function (value) {
            gradient = value || false;
        };
    });
