'use strict';

/**
 * @ngdoc overview
 * @name spiralApp
 * @description
 * # spiralApp
 *
 * Main module of the application.
 */
 angular
    .module('spiralApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',

        'ui.select'
    ])
    .config(function ($routeProvider) {

        // Configure routes
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
