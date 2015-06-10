/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (c) 2015 guh                                                              *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function(){
  "use strict";

  angular
    .module('guh.ui')
    .directive('guhColorPicker', colorPicker);

  colorPicker.$inject = ['$log', '$http', '$compile', '$timeout', 'DSState', 'libs', 'Input'];

  function colorPicker($log, $http, $compile, $timeout, DSState, libs, Input) {

    var directive = {
      compile: colorPickerCompile,
      restrict: 'E',
      scope: {
        minValue: '@',
        maxValue: '@',
        name: '@',
        setValueFn: '&',
        value: '='
      },
      templateUrl: 'app/shared/ui/color-picker/color-picker.html'
    };

    return directive;


    function _getRadFromDeg(deg) {
      return (Math.PI / 180) * deg;
    }

    function _getDegFromRad(rad) {
      return (180 / Math.PI) * rad;
    }

    function _getDegFromTheta(theta) {
      return 90 - theta;
    }

    function _getHslFromHex(hex) {
      var fail = false;
      var rgb = [];

      hex = hex.replace(/#/, '');

      for(var i = 0; i < 6; i+=2) {
        rgb.push(parseInt(hex.substr(i, 2), 16));
        fail = fail || rgb[rgb.length - 1].toString() === 'NaN';
      }

      return fail ? '0, 100%, 50%' : _getHslFromRgb.apply(null, rgb);
    }

    function componentToHex(c) {
      var hex = parseInt(c).toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    }

    function _getHexFromRgb(rgb) {
      var rgbArray = rgb.split(',');
      return '#' + componentToHex(rgbArray[0]) + componentToHex(rgbArray[1]) + componentToHex(rgbArray[2]);
    }

    function _getHslFromRgb(r, g, b) {
        var rr, gg, bb,
            r = r / 255,
            g = g / 255,
            b = b / 255,
            h, s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function(c){
                return (v - c) / 6 / diff + 1 / 2;
            };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            }else if (g === v) {
                h = (1 / 3) + rr - bb;
            }else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    function _drawColorCircle(ctx, colorWheel) {
      var sx = colorWheel.boundingBox.height / 2;
      var sy = colorWheel.boundingBox.width / 2;

      var pieSize = 1;  // Size of the pie-triangle's smallest side.
      var arcStep = pieSize * 1 / (Math.max(sx, sy));
      var currentAngle =  0;
      var twoPi = (2 * Math.PI);

      while(currentAngle < twoPi) {
        var hue = Math.floor(360 * (currentAngle + Math.PI / 2) / twoPi);

        ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
        ctx.beginPath();
        ctx.moveTo(colorWheel.boundingBox.x, colorWheel.boundingBox.y);
        ctx.lineTo(colorWheel.boundingBox.x + sx * Math.cos(currentAngle), colorWheel.boundingBox.y + sy * Math.sin(currentAngle));
        currentAngle += arcStep;
        ctx.lineTo(colorWheel.boundingBox.x + sx * Math.cos(currentAngle + 0.02), colorWheel.boundingBox.y + sy * Math.sin(currentAngle + 0.02));
        ctx.closePath();
        ctx.fill();
      }
    }

    function _clipWheel(ctx, colorWheel) {
      var innerRadius = colorWheel.radius - colorWheel.thickness;
      var strokeWidth = 4;

      ctx.moveTo(colorWheel.boundingBox.x, colorWheel.boundingBox.y);
      ctx.arc(colorWheel.boundingBox.x, colorWheel.boundingBox.y, colorWheel.radius - strokeWidth, _getRadFromDeg(0), _getRadFromDeg(360), false);
      ctx.arc(colorWheel.boundingBox.x, colorWheel.boundingBox.y, innerRadius, _getRadFromDeg(0), _getRadFromDeg(360), true);
    }

    function _drawStroke(ctx, colorWheel) {
      var innerRadius = colorWheel.radius - colorWheel.thickness;
      var strokeWidth = 4;

      // Style
      ctx.strokeStyle = "hsl(174, 53%, 73%)";

      // Outer
      ctx.beginPath();
      ctx.arc(colorWheel.boundingBox.x, colorWheel.boundingBox.y, colorWheel.radius - strokeWidth, _getRadFromDeg(0), _getRadFromDeg(360), false);
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      // Inner
      ctx.beginPath();
      ctx.arc(colorWheel.boundingBox.x, colorWheel.boundingBox.y, innerRadius, _getRadFromDeg(0), _getRadFromDeg(360), false);
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    function _dragMarker(markerContainer, eventX, eventY, marker) {
      var $markerContainer = angular.element(markerContainer);
      var $marker = angular.element(marker);
      var x = eventX - markerContainer.getBoundingClientRect().left - $markerContainer.prop('offsetWidth') / 2;
      var y = -1 * (eventY - markerContainer.getBoundingClientRect().top - $markerContainer.prop('offsetHeight') / 2);
      var theta = Math.atan2(y, x) * (180 / Math.PI);
      var angle = _getDegFromTheta(theta);

      _moveToAngle(marker, angle);
    }

    function _getCurrentColor(canvas, marker, markerContainer) {
      var $marker = angular.element(marker);
      var $markerContainer = angular.element(markerContainer);
      var padding = 1;

      var colorPosition = {
        x: Math.floor(marker.getBoundingClientRect().left) - markerContainer.getBoundingClientRect().left + $marker.prop('offsetWidth') / 2,
        y: Math.floor(marker.getBoundingClientRect().top) - markerContainer.getBoundingClientRect().top + $marker.prop('offsetHeight') / 2
      };

      if(canvas.getContext){
        var ctx = canvas.getContext('2d');

        // Get current pixel
        var imageData = ctx.getImageData(colorPosition.x, colorPosition.y, 1, 1);
        var pixel = imageData.data;

        // var showColor = document.getElementById('show-color');
        // angular.element(showColor).css({
        //   'background-color': 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')'
        // });

        // var colorPositionElement = document.getElementById('color-position');
        // angular.element(colorPositionElement).css({
        //   'left': colorPosition.x + 'px',
        //   'top': colorPosition.y + 'px'
        // });
      }

      return pixel[0] + ',' + pixel[1] + ',' + pixel[2];
    }

    function _moveToAngle(marker, angle) {
      var $marker = angular.element(marker);
      var rotate = 'rotate(' +angle + 'deg)';

      $marker.css({
        '-webkit-transform': rotate,
           '-moz-transform': rotate,
            '-ms-transform': rotate,
                'transform': rotate
      });
    }

    function colorPickerCompile(tElement, tAttrs) {

      var canvasContainer = tElement[0].getElementsByClassName('color')[0];
      var $canvasContainer = angular.element(canvasContainer);
      var canvas = $canvasContainer.find('canvas')[0];
      var canvasHeight = $canvasContainer.prop('offsetHeight');
      var canvasWidth = $canvasContainer.prop('offsetWidth');
      var marker = $canvasContainer.find('div')[0];
      var colorWheel = {
        boundingBox: {
          height: canvasHeight,
          width: canvasWidth,
          x: Math.floor(canvasWidth / 2),
          y: Math.floor(canvasHeight / 2)
        },
        thickness: 52,
        radius: Math.floor(canvasWidth / 2)
      };

      if(canvas.getContext){
        var ctx = canvas.getContext('2d');

        // Set height & width of canvas
        canvas.height = colorWheel.boundingBox.height;
        canvas.width = colorWheel.boundingBox.width;

        ctx.save();
        _clipWheel(ctx, colorWheel);
        ctx.clip();
        _drawColorCircle(ctx, colorWheel);
        ctx.restore();

        _drawStroke(ctx, colorWheel);
      }

      function _init(canvas, marker, canvasContainer, colorHex) {
        var colorHsl = _getHslFromHex(colorHex);
        var twoPi = 2 * Math.PI;
        var hue = colorHsl.h;
        var angle = hue * twoPi / 360;

        _moveToAngle(marker, _getDegFromRad(angle));

        $timeout(function() {
          _getCurrentColor(canvas, marker, canvasContainer);
        }, 100);
      }


      // Link function
      return function(scope, element, tAttrs) {
        var $marker = angular.element(marker);

        $log.log('colorPickerLink', scope);

        // Initialize with state color
        var color = '';
        if(scope.value) {
          color = scope.value;
        } else {
          color = 'ffe200';
        }

        _init(canvas, marker, canvasContainer, color);

        $marker.css({
          '-webkit-transform-origin': '26px ' + canvasWidth / 2 + 'px',
             '-moz-transform-origin': '26px ' + canvasWidth / 2 + 'px',
              '-ms-transform-origin': '26px ' + canvasWidth / 2 + 'px',
                  'transform-origin': '26px ' + canvasWidth / 2 + 'px'
        });

        var _setValue = Input.debounce(function() {
          // Execute action
          scope.setValueFn();
        }, 100);

        scope.onDrag = function(event) {
          // Influenced by
          // JSFiddle: http://jsfiddle.net/sandeeprajoria/x5APH/11/
          // SO: http://stackoverflow.com/questions/10149057/how-to-grab-and-drag-an-element-around-a-circle
          _dragMarker(
            canvasContainer,
            event.gesture.center.pageX,
            event.gesture.center.pageY,
            marker
          );

          var currentColor = _getCurrentColor(
            canvas,
            marker,
            canvasContainer
          );

          scope.value = _getHexFromRgb(currentColor);

          _setValue();

        };
      }

    }

  }

}());