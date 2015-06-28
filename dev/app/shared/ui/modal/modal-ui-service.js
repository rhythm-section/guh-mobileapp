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


// Code from: http://forum.ionicframework.com/t/ionic-modal-service-with-extras/15357
(function () {
'use strict';

angular
  .module('guh.ui')
  .factory('appModalService', appModalService);

appModalService.$inject = ['$log', '$ionicModal', '$rootScope', '$q', '$injector', '$controller'];

function appModalService($log, $ionicModal, $rootScope, $q, $injector, $controller) {

    return {
      show: show
    };

    function show(templateUrl, controller, parameters) {
      // Grab the injector and create a new scope
      var deferred = $q.defer();
      var ctrlInstance;
      var modalScope = $rootScope.$new();
      var thisScopeId = modalScope.$id;

      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: modalScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        modalScope.modal = modal;

        modalScope.openModal = function() {
          modalScope.modal.show();
        };

        modalScope.closeModal = function(result) {
          deferred.resolve(result);
          modalScope.modal.hide();
        };

        modalScope.$on('modal.hidden', function(thisModal) {
          if (thisModal.currentScope) {
            var modalScopeId = thisModal.currentScope.$id;
            if (thisScopeId === modalScopeId) {
              deferred.resolve(null);
              _cleanup(thisModal.currentScope);
            }
          }
        });

        // Invoke the controller
        var locals = { '$scope': modalScope, 'parameters': parameters };
        var ctrlEval = _evalController(controller);
        ctrlInstance = $controller(controller, locals);
        if(ctrlEval.isControllerAs) {
          ctrlInstance.openModal = modalScope.openModal;
          ctrlInstance.closeModal = modalScope.closeModal;
        }

        modalScope.modal.show();

      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function _cleanup(scope) {
      scope.$destroy();
      if (scope.modal) {
        scope.modal.remove();
      }
    }

    function _evalController(ctrlName) {
      var result = {
        isControllerAs: false,
        controllerName: '',
        propName: ''
      };
      var fragments = (ctrlName || '').trim().split(/\s+/);
      result.isControllerAs = fragments.length === 3 && (fragments[1] || '').toLowerCase() === 'as';
      if (result.isControllerAs) {
        result.controllerName = fragments[0];
        result.propName = fragments[2];
      } else {
        result.controllerName = ctrlName;
      }

      return result;
    }


}
})();