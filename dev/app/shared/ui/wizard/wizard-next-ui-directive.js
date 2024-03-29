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

/*
 * Wizard directive highly influenced by ionic-wizard from arielfaur
 * https://github.com/arielfaur/ionic-wizard
 */
(function(){
  "use strict";

  angular
    .module('guh.ui')
    .directive('guhWizardNext', wizardNext);

  wizardNext.$inject = ['$log', '$rootScope', '$ionicSlideBoxDelegate', 'libs'];

  function wizardNext($log, $rootScope, $ionicSlideBoxDelegate, libs) {
    var directive = {
      link: wizardNextLink,
      restrict: 'A',
      scope: {
        delegateHandle: '@guhWizardNext'
      }
    };

    return directive;


    function wizardNextLink(scope, element, attrs) {
      element.on('click', function() {
        $rootScope.$broadcast('wizard.next', scope.delegateHandle);
      });

      scope.$on('slideBox.slideChanged', function(event, index) {
        var delegateInstance = $ionicSlideBoxDelegate.$getByHandle(scope.delegateHandle);
        var delegateHandles = libs._.pluck(delegateInstance._instances, '$$delegateHandle');
        var wizardId = libs._.indexOf(delegateHandles, scope.delegateHandle);

        element.toggleClass('ng-hide', index === delegateInstance._instances[wizardId].slidesCount() - 1);
        // element.toggleClass('ng-hide', index === $ionicSlideBoxDelegate.$getByHandle(scope.delegateHandle).slidesCount() - 1);
      });
    }
  }

}());