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
    .controller('RulesEditCtrl', RulesEditCtrl);

  RulesEditCtrl.$inject = ['$log', '$scope', 'libs', 'DSRule', 'parameters'];

  function RulesEditCtrl($log, $scope, libs, DSRule, parameters) {

    // Use data that was passed to modal for the view
    var vm = this;
    var currentRule = angular.copy(parameters);

    // Public methods
    vm.cancel = cancel;
    vm.save = save;
    vm.remove = remove;

    /*
     * Private method: _init()
     */
    function _init() {
      vm.id = currentRule.id;
      vm.name = currentRule.name;

      $log.log('vm', vm);
    }


    /*
     * Public method: cancel()
     */
    function cancel() {
      vm.closeModal({
        updated: false,
        removed: false
      });
    }

    /*
     * Public method: save(rule)
     */
    function save(rule) {
      vm.closeModal({
        updated: false,
        removed: false
      });
    }

    /*
     * Public method: remove()
     */
    function remove() {
      currentRule
        .remove()
        .then(function(response) {
          vm.closeModal({
            updated: false,
            removed: true
          });
        })
        .catch(function(error) {
          // TODO: Build general error handler
          $log.error(error);
        });
    }


    _init();

  }

}());