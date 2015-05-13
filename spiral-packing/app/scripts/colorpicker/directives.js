'use strict';


angular.module('colorpicker.directives', ['colorpicker.constants', 'colorpicker.templates'])


	.directive('colorPickerImage', [
		'$timeout',

		function ($timeout) {
	        return {
	            restrict: 'A',
	            templateUrl: 'templates/colorpicker/image.html'
	        };
    	}
	])


	.directive('colorPickerArea', [

		function () {
	        return {
	            restrict: 'E',
	            replace: true,
	            templateUrl: 'templates/colorpicker/area.html'
	        };
    	}
	])


    .directive('colorPickerMap', [
		'$filter',
		'$timeout',
		'colormap',

        function ($filter, $timeout, colormap) {
			return {
	            restrict: 'A',
	            replace: true,
	            templateUrl: 'templates/colorpicker/map.html'
			};
        }
    ])


	.directive('colorPicker', [
		'$filter',
		'$timeout',
		'colormap',

        function ($filter, $timeout, colormap) {
			return {
	            restrict: 'E',
	            require: '^ngModel',
	            templateUrl: 'templates/colorpicker/colorpicker.html',

	            link: function ($scope, element, attrs, ngModel) {

					$scope.select = function (color) {
						ngModel.$setViewValue(color);
						ngModel.$render();
					};


					// Initialize mapster asynchronously
					$timeout(function () {

						// Initialize the mapster plugin
						element.find('img').mapster({
							singleSelect: false,
					        noHrefIsMask: false,
					        scaleMap: true,
							mapKey: 'alt',

					        stroke: true,
					        strokeWidth: 2,
							fillOpacity: 0,
					        fillColor: 'ffffff',

					        render_highlight: {
					            strokeColor: 'ffffff',
					            fillOpacity: 0.5
					        },

					        render_select: {
					            strokeColor: '000000',
								stroke: false
					        },

							areas: [
								{
									key: ngModel.$viewValue,
									selected: true
								}
							]
						});
					});


					// Set the model properties
					$scope.name = attrs.name || 'colorpicker';
					$scope.colormap = colormap;
	            }
			};
        }
    ]);
