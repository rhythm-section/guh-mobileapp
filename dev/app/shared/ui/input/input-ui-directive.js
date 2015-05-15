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
      controller: inputCtrl,
      controllerAs: 'guhInput',
      link: inputLink,
      restrict: 'E',
      scope: {
        change: '&',
        model: '=',
        state: '=?'
      }
    };

    return directive;


    function inputCtrl($scope, $element) {
      var vm = this;

      vm.change = change;

      function change(value) {
        // Toggle value
        $scope.model.value = !$scope.model.value;

        // Set loading animation
        $scope.loading = true;

        // Call change function defined in current directive instance
        $scope
          .change()
          .then(function() {
            $scope.error = false;

            // Wait 3 sec. and check if notification was received during this time
            $scope.timeout = $timeout(function() {
              // TODO: Use code below to refresh state (wait for new endpoint in guh-webserver)
              $scope.loading = false;

              // DSState
              //   .find($scope.state.stateTypeId, { bypassCache: true })
              //   .then(function(state) {
              //     $scope.state = state;
              //     $scope.loading = false;
              //   });
            }, 3000);
          })
          .catch(function(error) {
            // Reset value
            $scope.model.value = !$scope.model.value;

            $scope.error = error;
            $scope.loading = false;
          });
      }
    }

    function inputLink(scope, element, attributes) {
      // Initialize with current value
      if(angular.isObject(scope.state)) {
        scope.model.value = scope.state.value;
        scope.loading = false;
        scope.error = false;
        scope.timeout = false;
      }

      scope.$on('$destroy', function() {
        // Remove only element, scope needed afterwards
        element.remove();
      });

      scope.$watch('model', function(newValue, oldValue) {
        var templateUrl = scope.model.templateUrl;

        $http.get(templateUrl).success(function(template) {
          // Replace guhInput-directive with proper HTML input
          element.html(template);
          $compile(element.contents())(scope);
        });
      });

      scope.$watch('state.value', function(newValue, oldValue) {
        if(scope.timeout) {
          $timeout.cancel(scope.timeout);
        }

        if(scope.loading) {
          scope.loading = false;
        }
      });
    }
  }

}());