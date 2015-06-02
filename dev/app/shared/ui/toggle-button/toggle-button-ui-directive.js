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
    .directive('guhToggleButton', toggleButton);

  toggleButton.$inject = ['$log', '$http', '$compile', '$timeout', 'DSState', 'libs', 'Input'];

  function toggleButton($log, $http, $compile, $timeout, DSState, libs, Input) {
    var directive = {
      controller: toggleButtonCtrl,
      controllerAs: 'guhToggleButton',
      link: toggleButtonLink,
      restrict: 'E',
      scope: {
        disabled: '=',
        name: '@',
        value: '=',
        setValueFn: '&'
      },
      templateUrl: 'app/shared/ui/toggle-button/toggle-button.html'
    };

    return directive;


    function toggleButtonCtrl($scope, $element) {
      var vm = this;

      vm.toggleValue = toggleValue;

      var _setValue = Input.debounce(function(value) {
        $log.log('changed to', value);

        // Execute action
        $scope.setValueFn(value);
      }, 100);

      function toggleValue(value) {
        // Toggle scope value
        $log.log('$scope.value', $scope.value);
        $scope.value = !$scope.value;
        $log.log('$scope.value', $scope.value);
        
        _setValue(value);
        // $scope.setValueFn(value);

        // Set loading animation
        // $scope.loading = true;

        // $timeout(function() {
        //   $scope.loading = false;
        // }, 2000);

        // Call change function defined in current directive instance
        // $scope
        //   .change()
        //   .then(function() {
        //     $scope.error = false;

        //     // Wait 2 sec. and check if notification was received during this time
        //     $scope.timeout = $timeout(function() {
        //       // TODO: Use code below to refresh state (wait for new endpoint in guh-webserver)
        //       $scope.loading = false;

        //       DSState
        //         .find($scope.state.stateTypeId, { bypassCache: true })
        //         .then(function(state) {
        //           $scope.state = state;
        //           $scope.loading = false;
        //         });
        //     }, 2000);
        //   })
        //   .catch(function(error) {
        //     // Reset value
        //     $scope.model.value = !$scope.model.value;

        //     $scope.error = error;
        //     $scope.loading = false;
        //   });
      }
    }

    function toggleButtonLink(scope, element, attrs) {
      $log.log('toggleButtonLink', scope);

      scope.toggleValue = function(value) {
        $log.log('toggleButtonLink toggleValue');

        // Toggle scope value
        $log.log('scope.value', scope.value);
        scope.value = !scope.value;
        $log.log('scope.value', scope.value);
        
        // Set toggled value
        // $scope.setValueFn({
        //   value: !value
        // });

        scope.setValueFn(value);
      }
    }
  }

}());