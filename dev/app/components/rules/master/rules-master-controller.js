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

  RulesMasterCtrl.$inject = ['$log', '$rootScope', '$scope', '$ionicModal', 'DSRule', 'appModalService'];

  function RulesMasterCtrl($log, $rootScope, $scope, $ionicModal, DSRule, appModalService) {

    var vm = this;
    var addModal = {};

    // $scope methods
    $scope.refresh = refresh;

    // Public methods
    vm.addRule = addRule;

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
      // $rootScope.$broadcast('wizard.reset');

      // Reset view

      appModalService
        .show('app/components/rules/master/add/rules-add-modal.html', 'RulesAddCtrl as rulesAdd', {})
        .then(function(result) {
          $log.log('result', result);
        }, function(error) {
          $log.error(error);
        });
    }


    _init();

  }

}());