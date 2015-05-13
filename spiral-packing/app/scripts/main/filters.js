'use strict';


angular.module('main.filters', [])

    .filter('capitalize', function() {
        return function (input) {
            if (!input) {
                return input;
            }

            var words = input.split(' ');
            var result = [];

            words.forEach(function(word) {
                var str = word.charAt(0).toUpperCase();
                str += word.slice(1).toLowerCase();
                result.push(str);
            });

            return result.join(' ');
        };
    })


    .filter('reverse', function() {
        return function (items) {
            return items.slice().reverse();
        };
    });
