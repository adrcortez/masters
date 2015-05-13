'use strict';


angular
	.module('svg.services', [])


	.service('$canvas', [
        '$window',
		'$location',
		'$document',
		'$log',
		'$base64',

        function ($window, $location, $document, $log, $base64) {

            var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
            var xmlns = 'http://www.w3.org/2000/xmlns/';

			var shapes = [];
			var boundaryShape = null;


            function getContext (canvas) {
                var ctx = canvas.getContext('2d');
                ctx.translate(0.5, 0.5);
                ctx.imageSmoothingEnabled = true;
                ctx.mozImageSmoothingEnabled = true;
                ctx.oImageSmoothingEnabled = true;
                ctx.webkitImageSmoothingEnabled = true;
                return ctx;
            }

			function isExternal (url) {
		        return url &&
					url.lastIndexOf('http',0) === 0 &&
					url.lastIndexOf($location.host()) === -1;
		    }

			function getStyles (element) {

				var css = '',
					sheets = $document[0].styleSheets;

				angular.forEach(sheets, function (sheet) {

					// Can't load external style sheets
					if (isExternal(sheet.href)) {
		                $log.warn('Cannot include styles: ' + sheet.href);
		                return;
		            }

					// Process each css rule
		            angular.forEach(sheet.cssRules, function (rule) {

						// Skip invalid or blank rules
						if (!rule || !rule.style || !rule.selectorText) {
							return;
						}

						// Skip angular styles
						if (rule.selectorText.indexOf('ng-') > -1 ||
							rule.selectorText.indexOf('ng:') > -1) {
							return;
						}

						var match = null;

                        try {
                            match = element.querySelector(rule.selectorText);
                        } catch (err) {
                            $log.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
                        }

                        if (match) {
                            css += rule.selectorText +
								' { ' + rule.style.cssText + ' }\n';
                        } else if (rule.cssText.match(/^@font-face/)) {
                            css += rule.cssText + '\n';
                        }
		            });
				});

		        return css;
		    }

            function toDataUri (element, options) {

				// Coerce the element into a DOM node
				element = angular.element(element)[0];

				// The image options
                options = options || {};
                options.scale = options.scale || 1;

                var bbox = element.getBoundingClientRect(),
                    width = bbox.width,
                    height = bbox.height;

                // Clone the svg element
                var clone = element.cloneNode(true);
                clone.setAttribute('version', '1.1');
                clone.setAttributeNS(xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
                clone.setAttributeNS(xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
                clone.setAttribute('width', width * options.scale);
                clone.setAttribute('height', height * options.scale);
                clone.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

                // Need to append the cloned content to a div
                var outer = $document[0].createElement('div');
                outer.appendChild(clone);

				// Get the css styles
				var css = getStyles(element),
	            	styles = $document[0].createElement('style');
				styles.setAttribute('type', 'text/css');
	            styles.innerHTML = '<![CDATA[\n' + css + '\n]]>';

				// Append the styles as an SVG definition
	            var defs = $document[0].createElement('defs');
	            defs.appendChild(styles);
	            clone.insertBefore(defs, clone.firstChild);

                // Generate the data-uri
                var svg = doctype + outer.innerHTML,
					unescaped = $window.unescape(encodeURIComponent(svg)),
					base64 = $base64.encode(unescaped);

                return 'data:image/svg+xml;base64,' + base64;
            }

			function convertToContext (element, options, callback) {

				// Get the image data
                var uri = toDataUri(element, options),
                    image = new Image();

                // Convert the image data into a canvas object when loaded
                image.onload = function () {

                    // Create the canvas
                    var canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;

                    // Draw the image to the canvas context
                    var ctx = getContext(canvas);
                    ctx.drawImage(image, 0, 0);

					// Execute the callback, if any
					callback && callback(canvas, ctx);
                };

                // Set the image src to trigger the load event
                image.src = uri;
			}

            this.export = function (element, options) {

				// Coerce the element into a DOM node
				element = angular.element(element)[0];

                // The image options
                options = options || {};
                options.type = options.type || 'png';
                options.filename = options.filename || 'download';
                options.quality = options.quality || 1.0;
                options.scale = options.scale || 1.0;

				// Convert the svg element to a canvas context and
				// trigger the export when it's complete
				convertToContext(element, options, function (canvas) {

					// Generate the download link
					var a = $document[0].createElement('a');
					a.download = options.filename + '.' + options.type;
					a.href = canvas.toDataURL(
						'image/' + options.type, options.quality);

					// Click the download link
					$document[0].body.appendChild(a);
					a.click();
				});
            };

			this.getPixelColor = function (element, x, y, callback) {

				// Convert the svg element to a canvas context and
				// get the color at the specified location when complete
				convertToContext(element, null, function (canvas, ctx) {
					var pixel = ctx.getImageData(x, y, 1, 1);
					callback && callback(pixel.data);
				});
			};

			this.addShape = function (shape) {
				shape && shapes.push(shape);
			};

			this.unshiftShape = function (shape) {
				shape && shapes.unshift(shape);
			};

			this.getShapes = function () {
				return shapes;
			};

			this.getBoundaryShape = function () {
				return boundaryShape;
			};

			this.setBoundaryShape = function (value) {
				boundaryShape = value;
			};
        }
    ]);
