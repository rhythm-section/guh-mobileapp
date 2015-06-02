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


    function colorPickerCompile(tElement, tAttrs) {
      var colorPicker = angular.element(tElement[0].getElementsByClassName('color-picker')[0]);
      var marker = colorPicker.find('div')[0];
      var $marker = angular.element(marker);
      var canvas = colorPicker.find('canvas')[0];
      var context = canvas.getContext('2d');
      var drag = false;

      // Set height and width of canvas
      canvas.setAttribute('height', 288);
      canvas.setAttribute('width', 288);

      var image = new Image();
      image.src = 'assets/img/ui/color-picker.png';

      var _drawImage = function() {
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
      };

      // On load
      image.onload = _drawImage;

      // Link function
      return function(scope, element, tAttrs) {
        var $document = angular.element(document);

        // Get canvas coordinates
        var canvasData = {};
        var currentPosition = {};
        var $canvas = angular.element(canvas);
        canvasData.left = canvas.getBoundingClientRect().left;
        canvasData.top = canvas.getBoundingClientRect().top;
        canvasData.height = $canvas.prop('offsetHeight');
        canvasData.width = $canvas.prop('offsetWidth');

        var theta = Math.atan2(canvasData.top, canvasData.left) * (180 / Math.PI);
        // var showColor = document.getElementById('show-color');

        var _setValue = Input.debounce(function() {
          $log.log('scope.value', scope.value);

          // Execute action
          scope.setValueFn();
        }, 100);

        var _dragMarker = function(event) {
          var x = event.gesture.center.pageX - canvasData.left - (canvasData.width / 2);
          var y = -1 * (event.gesture.center.pageY - canvasData.top - (canvasData.height / 2));
          var theta = Math.atan2(y, x) * (180 / Math.PI);
          var cssDegs = 90 - theta;
          var rotate = 'rotate(' +cssDegs + 'deg)';
          var markerX = marker.getBoundingClientRect().left + (angular.element(marker).prop('offsetWidth') / 2);
          var markerY = marker.getBoundingClientRect().top + (angular.element(marker).prop('offsetHeight') / 2);
          // var markerX = marker.getBoundingClientRect().left + (angular.element(marker).prop('width') / 2);
          // var markerY = marker.getBoundingClientRect().top + (angular.element(marker).prop('height') / 2);

          currentPosition.x = Math.floor(markerX - canvasData.left);
          currentPosition.y = Math.floor(markerY - canvasData.top);

          angular.element(marker).css({
            '-webkit-transform': rotate,
               '-moz-transform': rotate,
                '-ms-transform': rotate,
                   'transform' : rotate
          });

          // Get current pixel
          var imageData = context.getImageData(currentPosition.x, currentPosition.y, 1, 1);
          var pixel = imageData.data;

          // showColor.style.backgroundColor = 'rgba(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', ' + pixel[3] + ')';
          // scope.color = [pixel[0], pixel[1], pixel[2], pixel[3]];
          
          scope.value = pixel[0] + ',' + pixel[1] + ',' + pixel[2];
          $log.log('value', scope.value);
          _setValue();
        }

        scope.onDrag = function(event) {
          _dragMarker(event);
        };
      }

    }

  }

}());