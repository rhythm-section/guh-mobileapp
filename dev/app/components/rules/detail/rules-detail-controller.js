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
    .module('guh.devices')
    .controller('RulesDetailCtrl', RulesDetailCtrl);

  RulesDetailCtrl.$inject = ['$log', '$scope', '$state', '$stateParams', '$ionicModal', 'appModalService', 'DSRule', 'DSActionType', 'DSEventType', 'DSStateType'];

  function RulesDetailCtrl($log, $scope, $state, $stateParams, $ionicModal, appModalService, DSRule, DSActionType, DSEventType, DSStateType) {
    
    var vm = this;
    var currentRule = {};

    // Public methods
    vm.editSettings = editSettings;


    /*
     * Private method: _init()
     */
    function _init() {
      _loadViewData();
    }

    /*
     * Private method: _loadViewData()
     */
    function _loadViewData() {
      var ruleId = $stateParams.ruleId;

      return DSRule
        .find(ruleId)
        .then(function(rule) {
          currentRule = rule;
          $log.log('rule', rule);

          vm.name = rule.name;
          vm.id = rule.id;
          vm.enabled = rule.enabled;

          // Events
          vm.events = [];
          angular.forEach(rule.eventDescriptors, function(eventDescriptor) {
            DSEventType
              .find(eventDescriptor.eventTypeId)
              .then(function(eventType) {
                $log.log('eventDescriptor', eventDescriptor);
                $log.log('eventType', eventType);

                vm.events.push(eventType);
              })
              .catch(function(error) {
                $log.error(error);
              });
          });

          // States
          vm.states = [];
          if(rule.stateEvaluator.stateDescriptor.stateTypeID !== "") {
            $log.log('stateDescriptor', rule.stateEvaluator.stateDescriptor);
            $log.log('stateTypeId', rule.stateEvaluator.stateDescriptor.stateTypeID);

            DSStateType
              .find(rule.stateEvaluator.stateDescriptor.stateTypeID)
              .then(function(stateType) {
                $log.log('stateDescriptor', rule.stateEvaluator.stateDescriptor);
                $log.log('stateType', stateType);

                vm.states.push(stateType);
              })
              .catch(function(error) {
                $log.error(error);
              });
          }

          if(rule.stateEvaluator.childEvaluators) {
            angular.forEach(rule.stateEvaluator.childEvaluators, function(childEvaluator) {
              $log.log('stateDescriptor', childEvaluator.stateDescriptor);
              DSStateType
                .find(childEvaluator.stateDescriptor.stateTypeID)
                .then(function(stateType) {
                  $log.log('stateDescriptor', childEvaluator.stateDescriptor);
                  $log.log('stateType', stateType);

                  vm.states.push(stateType);
                })
                .catch(function(error) {
                  $log.error(error);
                });
            });
          }

          // Enter Actions
          vm.actions = [];
          angular.forEach(rule.actions, function(action) {
            DSActionType
              .find(action.actionTypeId)
              .then(function(actionType) {
                $log.log('action', action);
                $log.log('actionType', actionType);

                vm.actions.push(actionType);
              })
              .catch(function(error) {
                $log.error(error);
              });
          });

          // Exit Actions
          vm.exitActions = [];
          angular.forEach(rule.exitActions, function(action) {
            DSActionType
              .find(action.actionTypeId)
              .then(function(actionType) {
                $log.log('action', action);
                $log.log('actionType', actionType);

                vm.exitActions.push(actionType);
              })
              .catch(function(error) {
                $log.error(error);
              });
          });
        })
        .catch(function(error) {
          _showError(error);
        });
    }

    /*
     * Private method: _showError(error)
     */
    function _showError(error) {
      if(angular.isObject(error.data)) {
        $log.error(error.data.errorMessage);
      }
    }


    /*
     * Public method: editSettings()
     */
    function editSettings() {
      appModalService
        .show('app/components/rules/edit/rules-edit-modal.html', 'RulesEditCtrl as rulesEdit', currentRule)
        .then(function(response) {
          if(response.updated) {
            _loadViewData();
          } else if(response.removed) {
            $state.go('guh.rules.master');
          }
        }, function(error) {
          $log.error(error);
        });
    }


    _init();

  }

}());