/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
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
    .directive('guhActionParam', actionParam);

  actionParam.$inject = ['$log', '$rootScope', '$http', '$compile'];

  function actionParam($log, $rootScope, $http, $compile) {
    var directive = {
      controller: actionParamCtrl,
      controllerAs: 'guhActionParam',
      link: actionParamLink,
      restrict: 'E',
      scope: {
        actionState: '=?',
        change: '&?',
        disabled: '=?',
        paramType: '='
      }
    };

    return directive;


    /*
     * Controller method: actionParamCtrl($scope, $element)
     */
    function actionParamCtrl($scope, $element) {}


    /*
     * Link method: actionParamLink(scope, element, attrs)
     */
    function actionParamLink(scope, element, attrs) {

      // Initialization
      if(angular.isObject(scope.actionState) && angular.isObject(scope.actionState.state)) {
        scope.paramType.value = scope.actionState.state.value;
      }


      // Clean up
      scope.$on('$destroy', function() {
        // Remove only element, scope needed afterwards
        // scope.$destroy();
        element.remove();
      });


      // Check templateUrl and set template
      scope.$watch('paramType', function(newValue, oldValue) {
        var templateUrl = scope.paramType.actionTemplateUrl;

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


      // Event: guh.injectState
      $rootScope.$on('guh.injectState', function(event, state) {
        if(scope.actionState.state && scope.actionState.state.stateTypeId === state.stateTypeId) {
          scope.paramType.value = state.value;
          $log.log('Inject value', scope.paramType.value, state.value);
        }
      });

    }
  }

}());