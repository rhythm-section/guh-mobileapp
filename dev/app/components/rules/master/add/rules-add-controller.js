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
    .controller('RulesAddCtrl', RulesAddCtrl);

  RulesAddCtrl.$inject = ['$log', '$scope', '$ionicModal', 'appModalService'];

  function RulesAddCtrl($log, $scope, $ionicModal, appModalService) {

    var vm = this;
    var addTriggerModal = {};
    var addActionModal = {};

    // Public methods
    vm.addTrigger = addTrigger;
    vm.addAction = addAction;


    /*
     * Private method: _init()
     */
    function _init() {}

    /*
     * Private method: _initModaltemplateUrl
     */
    function _initModal(templateUrl) {
      // Needed because ionicModal only works with "$scope" but not with "vm" as scope
      $scope.rules = vm;

      // Edit modal
      return $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }

    
    /*
     * Public method: addTrigger()
     */
    function addTrigger() {
      // Reset wizard

      // Reset view

      // Show modal
      appModalService
        .show('app/components/rules/master/add/rules-add-trigger-modal.html', 'RulesAddTriggerCtrl as rulesAddTrigger', {})
        .then(function(result) {
          $log.log('result', result);
        }, function(error) {
          $log.error(error);
        });
    }

    /*
     * Public method: addAction()
     */
    function addAction() {
      // Reset wizard

      // Reset view

      // Show modal
      appModalService
        .show('app/components/rules/master/add/rules-add-action-modal.html', 'RulesAddActionCtrl as rulesAddAction', {})
        .then(function(result) {
          $log.log('result', result);
        }, function(error) {
          $log.error(error);
        });
    }


    _init();

  }

}());