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
    .directive('guhSlider', slider);

  slider.$inject = ['$log', '$http', '$compile', '$timeout', 'DSState', 'libs', 'Input'];

  function slider($log, $http, $compile, $timeout, DSState, libs, Input) {
    var directive = {
      controller: sliderCtrl,
      controllerAs: 'guhSlider',
      link: sliderLink,
      restrict: 'E',
      scope: {
        minValue: '@',
        maxValue: '@',
        name: '@',
        setValueFn: '&',
        value: '='
      },
      templateUrl: 'app/shared/ui/slider/slider.html'
    };

    return directive;


    function sliderCtrl($scope, $element) {
      var vm = this;

      vm.change = change;

      var _setValue = Input.debounce(function(value) {
        // Execute action
        $scope.setValueFn(value);
      }, 100);

      function change(value) {
        _setValue(value);
      }
    }

    function sliderLink(scope, element, attrs) {
      $log.log('sliderLink(scope, element, attrs)', scope, element, attrs);
    }
  }

}());