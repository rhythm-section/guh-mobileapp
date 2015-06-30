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
  'use strict';

  angular
    .module('guh.rules')
    .controller('RulesAddCtrl', RulesAddCtrl);

  RulesAddCtrl.$inject = ['$log', '$scope', '$ionicModal', 'app', 'appModalService'];

  function RulesAddCtrl($log, $scope, $ionicModal, app, appModalService) {

    var vm = this;
    var addTriggerModal = {};
    var addActionModal = {};

    // Public methods
    vm.addTrigger = addTrigger;
    vm.addAction = addAction;
    vm.save = save;


    /*
     * Private method: _init()
     */
    function _init() {
      // Reset view
      vm.addedTrigger = [];
      vm.addedEnterActions = [];
      vm.addedExitActions = [];
      vm.rule = {
        actions: [],
        enabled: false,
        eventDescriptors: [],
        exitActions: [],
        name: 'Name',
        stateEvaluator: {}
      };
    }

    /*
     * Private method: _updateEventDescriptors(eventDescriptor)
     */
    function _updateEventDescriptors(eventDescriptor) {
      vm.rule.eventDescriptors.push(eventDescriptor);
    }

    /*
     * Private method: _updateStateEvaluator(trigger)
     */
    function _updateStateEvaluator(stateDescriptor) {
      var childEvaluator = {
        operator: app.stateOperator.StateOperatorAnd,
        stateDescriptor: stateDescriptor
      };

      if(vm.rule.stateEvaluator.childEvaluators) {
        vm.rule.stateEvaluator.childEvaluators.push(childEvaluator);
      } else {
        vm.rule.stateEvaluator = childEvaluator;
        vm.rule.stateEvaluator.childEvaluators = [];
      }
    }

    /*
     * Private method: _updateActions(action, actionType)
     */
    function _updateActions(action, actionType) {
      switch(actionType) {
        case 'EnterAction':
          vm.addedEnterActions.push(action);
          vm.rule.actions.push(action.action);
          break;
        case 'ExitAction':
          vm.addedExitActions.push(action);
          vm.rule.exitActions.push(action.action);
          break;
        default:
          break;
      }
    }

    
    /*
     * Public method: addTrigger()
     */
    function addTrigger() {
      // Show modal
      appModalService
        .show('app/components/rules/add/rules-add-trigger-modal.html', 'RulesAddTriggerCtrl as rulesAddTrigger', {})
        .then(function(trigger) {
          if(trigger !== undefined) {
            vm.addedTrigger.push(trigger);

            // EventDescriptor
            if(trigger.eventDescriptor) {
              _updateEventDescriptors(trigger.eventDescriptor);
            }

            // StateDescriptor(s)
            if(trigger.stateDescriptorIs) {
              _updateStateEvaluator(trigger.stateDescriptorIs);
            } else if(trigger.stateDescriptorFrom && trigger.stateDescriptorTo) {
              _updateStateEvaluator(trigger.stateDescriptorFrom);
              _updateStateEvaluator(trigger.stateDescriptorTo);
            }
          }

          $log.log('vm.rule', vm.rule);
        }, function(error) {
          $log.error(error);
        });
    }

    /*
     * Public method: addAction(actionType)
     */
    function addAction(actionType) {
      // Show modal
      appModalService
        .show('app/components/rules/add/rules-add-action-modal.html', 'RulesAddActionCtrl as rulesAddAction', vm.addedTrigger)
        .then(function(action) {
          if(action !== undefined) {
            _updateActions(action, actionType);       
          }
        }, function(error) {
          $log.error(error);
        });
    }

    /*
     * Public method: save()
     */
    function save() {
      // exitActions
      if(vm.rule.eventDescriptors.length >= 1) {
        delete vm.rule.exitActions;
      }

      // eventDescriptor or eventDescriptorList
      if(vm.rule.eventDescriptors.length > 1) {
        vm.rule.eventDescriptorList = vm.rule.eventDescriptors;
      } else if(vm.rule.eventDescriptors.length === 1) {
        vm.rule.eventDescriptor = vm.rule.eventDescriptors[0];
      }

      delete vm.rule.eventDescriptors;

      $log.log('vm.rule', vm.rule);

      vm.closeModal(vm.rule);
    }


    _init();

  }

}());