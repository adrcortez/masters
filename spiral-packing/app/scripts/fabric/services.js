'use strict';


angular.module('fabric.services', [])


    .service('$fabric', [
        '$window',

        function ($window) {

            // Return the global fabric object
            return $window.fabric;
        }
    ]);
