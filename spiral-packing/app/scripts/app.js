'use strict';


 angular
    .module('main', [

        // Angular dependencies
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngResize',
        'ngMessages',

        // External dependencies
        'ngMaterial',
        'ng-context-menu',

        // App component dependencies
        'math',
        'colorpicker',
        'svg',

        // Main dependencies
        'main.filters',
        'main.services',
        'main.controllers',
    ])

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
    })


    // Configure the material design theme
    .config(function ($mdThemingProvider) {
        $mdThemingProvider
            .theme('default')
            .backgroundPalette('grey')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    });
