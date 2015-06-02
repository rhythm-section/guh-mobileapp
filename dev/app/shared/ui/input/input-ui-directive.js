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
    .directive('guhInput', input);

  input.$inject = ['$log', '$http', '$compile', '$timeout', 'DSState', 'libs'];

  function input($log, $http, $compile, $timeout, DSState, libs) {
    var directive = {
      link: inputLink,
      restrict: 'E',
      scope: {
        change: '&?',
        disabled: '=?',
        paramType: '='
      }
    };

    return directive;


    function inputLink(scope, element, attrs) {

      // Initialize
      scope.disabled = (scope.disabled) ? scope.disabled : false;


      // Clean up
      scope.$on('$destroy', function() {
        // Remove only element, scope needed afterwards
        // scope.$destroy();
        element.remove();
      });


      // Check templateUrl and set template
      scope.$watch('paramType', function(newValue, oldValue) {
        var templateUrl = scope.paramType.inputTemplateUrl;

        // Get template
        if(angular.isString(templateUrl)) {
          $http.get(templateUrl).success(function(template) {
            // Replace guhInput-directive with proper HTML input
            element.html(template);
            $compile(element.contents())(scope);
          });
        } else {
          $log.error('guh.directive.guhActionParam', 'TemplateURL is not set.');
        }
      });

    }
  }

}());