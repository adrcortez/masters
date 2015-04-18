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
        'ngResize',

        'main'
    ])

    // Configure routes
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
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
