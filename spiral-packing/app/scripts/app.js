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

        'ui.select',
        'ui.bootstrap',
        'uiSwitch',
        'colorpicker.module'
    ])

    // Constants
    .constant('epsilon', 0.00001)

    // Configure routes
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'TestCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

    // Configure the whitelist for image sources and anchor hrefs
    // to allow download of data urls
    .config(function ($compileProvider) {
        var pattern = /^\s*(https?|ftp|file|blob):|data:image\//;
        $compileProvider.imgSrcSanitizationWhitelist(pattern);
        $compileProvider.aHrefSanitizationWhitelist(pattern);
    });
