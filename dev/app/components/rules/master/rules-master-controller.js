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
  'use strict';

  angular
    .module('guh.rules')
    .controller('RulesMasterCtrl', RulesMasterCtrl);

  RulesMasterCtrl.$inject = ['$log', '$rootScope', '$scope', '$ionicModal', 'DSRule'];

  function RulesMasterCtrl($log, $rootScope, $scope, $ionicModal, DSRule) {

    var vm = this;
    var addModal = {};

    // $scope methods
    $scope.refresh = refresh;

    // Public methods
    vm.addRule = addRule;
    vm.closeRule = closeRule;


    /*
     * Private method: _init()
     */
    function _init() {
      _loadViewData();
    }

    /*
     * Private method: _loadViewData(bypassCache)
     */
    function _loadViewData(bypassCache) {
      return _findAllRules(bypassCache)
        .then(function(rules) {
          vm.configured = rules;
        });
    }

    /*
     * Private method: _findAllRules(bypassCache)
     */
    function _findAllRules(bypassCache) {
      if(bypassCache) {
        return DSRule.findAll({}, { bypassCache: true });
      }
      
      return DSRule.findAll();
    }

    /*
     * Private method: _initModal()
     */
    function _initModal() {
      // Needed because ionicModal only works with "$scope" but not with "vm" as scope
      $scope.rules = vm;

      // Edit modal
      return $ionicModal.fromTemplateUrl('app/components/rules/master/rules-add-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }


    /*
     * Public method: refresh()
     */
    function refresh() {
      _loadViewData(true)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    /*
     * Public method: addRule()
     */
    function addRule() {
      // Reset wizard
      $rootScope.$broadcast('wizard.reset');

      // Reset view


      // Schow modal
      _initModal().then(function(modal) {
        $log.log('Modal initialized', modal);
        addModal = modal;
        addModal.show();
      });

      // _findAllVendors()
      //   .then(function(vendors) {
      //     vm.supportedVendors = vendors;
      //   });
    }

    /*
     * Public method: closeRule()
     */
    function closeRule() {
      addModal
        .hide()
        .then(function() {
          addModal
            .remove()
            .then(function() {
              $log.log('Modal removed');
            })
            .catch(function(error) {
              $log.error('Cannot destroy modal', error)
            });
        });
    }


    _init();

  }

}());