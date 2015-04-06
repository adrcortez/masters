'use strict';

angular.module('spiralApp')

    .controller('HeaderCtrl', function ($scope, $modal) {

        $scope.showHelp = function () {
            $modal.open({
                templateUrl: 'templates/modals/help.html',
                backdrop: true
            });
        };
    });
