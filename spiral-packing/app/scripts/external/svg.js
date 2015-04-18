'use strict';

(function () {
    var out$ = window;
    var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    function isExternal(url) {
        return url && url.lastIndexOf('http',0) === 0 && url.lastIndexOf(window.location.host) === -1;
    }

    function inlineImages(el, callback) {
        var images = el.querySelectorAll('image');
        var left = images.length;
        if (left === 0) {
            callback();
        }

        var f = function (image) {
            var href = image.getAttribute('xlink:href');
            if (href) {
                if (isExternal(href.value)) {
                    console.warn('Cannot render embedded images linking to external hosts: ' + href.value);
                    return;
                }
            }

            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image();

            href = href || image.getAttribute('href');
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                image.setAttribute('xlink:href', canvas.toDataURL('image/png'));
                left--;

                if (left === 0) {
                    callback();
                }
            };

            img.onerror = function () {
                console.log('Could not load '+href);
                left--;
                if (left === 0) {
                    callback();
                }
            };

            img.src = href;

        };

        for (var i = 0; i < images.length; i++) {
            f(images[i]);
        }
    }

    function styles (el, selectorRemap) {
        var css = '';
        var sheets = document.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
            if (isExternal(sheets[i].href)) {
                console.warn('Cannot include styles from other hosts: '+sheets[i].href);
                continue;
            }

            var rules = sheets[i].cssRules;
            if (rules !== null) {
                for (var j = 0; j < rules.length; j++) {
                    var rule = rules[j];

                    if (typeof(rule.style) !== 'undefined') {
                        var match = null;

                        try {
                            match = el.querySelector(rule.selectorText);
                        } catch(err) {
                            console.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
                        }

                        if (match) {
                            var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
                            css += selector + ' { ' + rule.style.cssText + ' }\n';
                        } else if (rule.cssText.match(/^@font-face/)) {
                            css += rule.cssText + '\n';
                        }
                    }
                }
            }
        }

        return css;
    }

    out$.svgAsDataUri = function(el, options, cb) {
        options = options || {};
        options.scale = options.scale || 1;
        var xmlns = 'http://www.w3.org/2000/xmlns/';

        inlineImages(el, function() {
            var outer = document.createElement('div'),
                clone = el.cloneNode(true),
                width, height, svg;

            if(el.tagName === 'svg') {
                width = parseInt(clone.getAttribute('width') || clone.style.width || out$.getComputedStyle(el).getPropertyValue('width'));
                height = parseInt(clone.getAttribute('height') || clone.style.height || out$.getComputedStyle(el).getPropertyValue('height'));
            } else {
                var box = el.getBBox();
                width = box.x + box.width;
                height = box.y + box.height;
                clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));

                svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
                svg.appendChild(clone);
                clone = svg;
            }

            if (el.getBoundingClientRect) {
                var bbox = el.getBoundingClientRect();
                width = bbox.width;
                height = bbox.height;
            }

            clone.setAttribute('version', '1.1');
            clone.setAttributeNS(xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
            clone.setAttributeNS(xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            clone.setAttribute('width', width * options.scale);
            clone.setAttribute('height', height * options.scale);
            clone.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
            outer.appendChild(clone);

            var css = styles(el, options.selectorRemap);
            var s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            s.innerHTML = '<![CDATA[\n' + css + '\n]]>';

            var defs = document.createElement('defs');
            defs.appendChild(s);
            clone.insertBefore(defs, clone.firstChild);

            svg = doctype + outer.innerHTML;
            var uri = 'data:image/svg+xml;base64,' + window.btoa(window.unescape(encodeURIComponent(svg)));

            if (cb) {
                cb(uri);
            }
        });
    };

    out$.saveSvgAsPng = function (el, name, options) {
        options = options || {};
        out$.svgAsDataUri(el, options, function (uri) {
            var image = new Image();

            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;

                var context = canvas.getContext('2d');
                context.translate(0.5, 0.5);
                context.imageSmoothingEnabled       = true
                context.mozImageSmoothingEnabled    = true
                context.oImageSmoothingEnabled      = true
                context.webkitImageSmoothingEnabled = true

                context.drawImage(image, 0, 0, image.width, image.height);

                var a = document.createElement('a');
                a.download = name;
                a.href = canvas.toDataURL('image/png', 1.0);
                document.body.appendChild(a);
                a.click();
            };

            image.src = uri;
        });
    };
})();
