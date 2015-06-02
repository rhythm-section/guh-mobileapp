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
      // compile: colorPickerCompile,
      link: colorPickerLink,
      restrict: 'E',
      scope: {
        name: '@',
        setValueFn: '&',
        value: '='
      },
      templateUrl: 'app/shared/ui/color-picker/color-picker.html'
    };

    return directive;


    /*
     * Compile method: colorPickerLink(scope, element, attrs)
     */
    function colorPickerLink(scope, element, attrs) {

    }

    // /*
    //  * Compile method: colorPickerCompile(tElement, tAttrs)
    //  */
    // function colorPickerCompile(tElement, tAttrs) {

    //   var colorPicker = angular.element(tElement[0].getElementsByClassName('color-picker')[0]);
    //   var marker = colorPicker.find('div')[0];
    //   var $marker = angular.element(marker);
    //   var canvas = colorPicker.find('canvas')[0];
    //   var $canvas = angular.element(canvas);
    //   var context = canvas.getContext('2d');



    //   $log.log('colorPickerCompile', colorPicker, canvas, context);

    //   /*
    //    * Private method: _buildColorPalette()
    //    */
    //   function _buildColorPalette() {
    //     $log.log('context', context);

    //     var gradient = context.createLinearGradient(0, 0, $canvas.prop('width'), 0);

    //     // Create color gradient
    //     gradient.addColorStop(0,    'rgb(255,   0,   0)');
    //     gradient.addColorStop(0.15, 'rgb(255,   0, 255)');
    //     gradient.addColorStop(0.33, 'rgb(0,     0, 255)');
    //     gradient.addColorStop(0.49, 'rgb(0,   255, 255)');
    //     gradient.addColorStop(0.67, 'rgb(0,   255,   0)');
    //     gradient.addColorStop(0.84, 'rgb(255, 255,   0)');
    //     gradient.addColorStop(1,    'rgb(255,   0,   0)');

    //     $log.log('canvas', canvas);
    //     $log.log('context', context);
    //     $log.log('width', $canvas.prop('width'));
    //     $log.log('height', $canvas.prop('height'));

    //     // Apply gradient to canvas
    //     context.fillStyle = gradient;
    //     context.fillRect(0, 0, $canvas.prop('width'), $canvas.prop('height'));

    //     $log.log('context', context);
    //     // context.fill();
    //     // context.stroke();
    //     // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    //   }

    //   _buildColorPalette();

    //   /*
    //    * Link function
    //    */
    //   return function(scope, element, tAttrs) {

    //     function _dragMarker(event) {
    //       // $log.log('drag', event);

    //       // var markerX = marker.getBoundingClientRect().left + ($marker.prop('offsetWidth') / 2);
    //       // var markerY = marker.getBoundingClientRect().top + ($marker.prop('offsetHeight') / 2);

    //       var markerX = event.gesture.center.pageX;
    //       var markerY = event.gesture.center.pageY;
    //       var move = 'translate(' +markerX + 'px,' +markerY + 'px)';
    //       // var rotate = 'rotate(' +cssDegs + 'deg)';

    //       $log.log(move, marker.getBoundingClientRect().left, marker.getBoundingClientRect().top, $marker.prop('offsetWidth'), $marker.prop('offsetHeight'));

    //       $marker.css({
    //         '-webkit-transform': move,
    //            '-moz-transform': move,
    //             '-ms-transform': move,
    //                 'transform': move
    //       });
    //     }

    //     scope.onDrag = function(event) {
    //       // $log.log('onDrag');
    //       _dragMarker(event);
    //     };

    //   }

    // }

  }

}());