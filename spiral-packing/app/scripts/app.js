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

        'base64',

        'ui.select',
        'ui.bootstrap',
        'ui.bootstrap.contextMenu'
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
        // var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
        var pattern = /^\s*(https?|ftp|file|blob):|data:image\//;
        $compileProvider.imgSrcSanitizationWhitelist(pattern);
        $compileProvider.aHrefSanitizationWhitelist(pattern);
    });
