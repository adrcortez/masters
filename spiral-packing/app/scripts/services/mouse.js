'use strict';

angular.module('spiralApp')

    .service('$mouse', function ($window) {

    	// Return a public API for this service.
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
    });
