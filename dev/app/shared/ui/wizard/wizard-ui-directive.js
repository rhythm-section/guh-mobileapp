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

/*
 * Wizard directive highly influenced by ionic-wizard from arielfaur
 * https://github.com/arielfaur/ionic-wizard
 */
(function(){
  "use strict";

  angular
    .module('guh.ui')
    .directive('guhWizard', wizard);

  wizard.$inject = ['$log', '$rootScope', '$ionicSlideBoxDelegate'];

  function wizard($log, $rootScope, $ionicSlideBoxDelegate) {
    var directive = {
      controller: wizardCtrl,
      controllerAs: 'guhWizard',
      link: wizardLink,
      restrict: 'A'
    };

    return directive;


    function wizardCtrl($scope, $element) {
      var vm = this;
      var conditions = [];

      vm.addCondition = addCondition;
      vm.isValidStep = isValidStep;

      function addCondition(condition) {
        conditions.push(condition);
      }

      function isValidStep(index) {
        return angular.isDefined(conditions[index]) ? $scope.$eval(conditions[index]) : true;
      }
    }

    function wizardLink(scope, element, attrs, wizardCtrl) {
      var currentIndex = 0;

      element.css('height', '100%');

      $ionicSlideBoxDelegate.enableSlide(false);

      scope.$on('wizard.prev', function(event) {
        $ionicSlideBoxDelegate.previous();
      });
      
      scope.$on('wizard.next', function(event) {
        if(wizardCtrl.isValidStep(currentIndex)) {
          $ionicSlideBoxDelegate.next();
        } else {
          $rootScope.$broadcast('wizard.stepFailed', { index: currentIndex });
        }
      });

      scope.$on('wizard.reset', function(event, index) {
        currentIndex = 0;
        $ionicSlideBoxDelegate.slide(currentIndex);
      });

      scope.$on('slideBox.slideChanged', function(event, index) {
        currentIndex = index;
      });
    }
  }

}());