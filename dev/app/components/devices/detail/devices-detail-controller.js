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
    .module('guh.devices')
    .controller('DevicesDetailCtrl', DevicesDetailCtrl);

  DevicesDetailCtrl.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$ionicModal', 'libs', 'appModalService', 'DSDeviceClass', 'DSDevice', 'DSState', 'DSActionType', 'modelsHelper'];

  function DevicesDetailCtrl($log, $rootScope, $scope, $state, $stateParams, $ionicModal, libs, appModalService, DSDeviceClass, DSDevice, DSState, DSActionType, modelsHelper) {
    
    var vm = this;
    var currentDevice = {};

    // Public methods
    vm.execute = execute;
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
      var deviceId = $stateParams.deviceId;

      _findDevice(deviceId)
        .then(_findDeviceRelations)
        .then(function(device) {
          currentDevice = device;

          // Check if device has individual name
          var params = currentDevice.params;
          var nameParameter = libs._.find(params, function(param) { return (param.name === 'Name'); });

          // Set view variables
          vm.SetupComplete = currentDevice.SetupComplete;
          vm.actions = [];
          vm.deviceClass = currentDevice.deviceClass;
          vm.deviceClassId = currentDevice.deviceClassId;
          vm.id = currentDevice.id;
          vm.name = currentDevice.name
          vm.params = currentDevice.params;
          vm.states = currentDevice.states;

          // Wait for templateUrl check
          device.deviceClass.templateUrl
            .then(function(fileExists) {
              vm.templateUrl = fileExists;
            })
            .catch(function(error) {
              $log.error('guh.controller.DevicesDetailCtrl', error);
            })
            .finally(function() {
              vm.templateReady = true;
            });

          $log.log('currentDevice.deviceClass.actionTypes', currentDevice.deviceClass.actionTypes);

          // Actions & States
          angular.forEach(currentDevice.deviceClass.actionTypes, function(actionType) {
            var action = {};
            action.actionType = actionType;

            $log.log('actionType', actionType);

            if(actionType.hasState) {  
              var state = libs._.find(currentDevice.states, function(state) { return state.stateTypeId === actionType.id });

              // Add state to action
              action.state = state;

              // Remove state from sates array
              vm.states = libs._.without(vm.states, state);
            }

            vm.actions.push(action);
          });

          // Subscribe to websocket messages
          _subscribeToWebsocket();

          $log.log('vm', vm);
        })
        .catch(function(error) {
          _showError(error);

          $state.go('guh.devices.master');
        });
    }

    /*
     * Private method: _subscribeToWebsocket()
     */
    function _subscribeToWebsocket() {
      currentDevice.subscribe(currentDevice.id, function(message) {
        angular.forEach(currentDevice.states, function(state, index) {
          if(message.params.stateTypeId === state.stateTypeId && message.params.deviceId === vm.id) {
            DSState.inject([{stateTypeId: message.params.stateTypeId, value: message.params.value}]);

            $log.log('Inject value.');

            // TODO: Check why js-data event DS.inject is not working
            $rootScope.$emit('guh.injectState', {stateTypeId: message.params.stateTypeId, value: message.params.value});
          }
        });
      });
    }

    /*
     * Private method: _findDevice(deviceId)
     */
    function _findDevice(deviceId) {
      return DSDevice.find(deviceId);
    }

    /*
     * Private method: _findDeviceRelations(device)
     */
    function _findDeviceRelations(device) {
      return DSDevice
        .loadRelations(device, ['deviceClass', 'states'])
        .then(_findDeviceClassRelations);
    }

    /*
     * Private method: _findeDeviceClassRelations(device)
     */
    function _findDeviceClassRelations(device) {
      return DSDeviceClass
        .loadRelations(device.deviceClass, ['vendor'])
        .then(function(deviceClass) {
          device.deviceClass = deviceClass;
          return device;
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
     * Private method: leaveState()
     */
    function _leaveState() {
      // Unsubscribe websocket connection when leaving this state
      if(DSDevice.is(currentDevice)) {
        currentDevice.unsubscribe(currentDevice.id);
      }
    }


    /*
     * Public method: execute(actionType)
     */
    function execute(actionType) {
      return currentDevice.executeAction(actionType);
    }

    /*
     * Public method: editSettings()
     */
    function editSettings() {
      appModalService
        .show('app/components/devices/edit/devices-edit-modal.html', 'DevicesEditCtrl as devicesEdit', currentDevice)
        .then(function(response) {
          if(response.updated) {
            _loadViewData();
          } else if(response.removed) {
            $state.go('guh.devices.master');
          }
        }, function(error) {
          $log.error(error);
        });
    }

    
    /*
     * Event: $stateChangeStart
     */
    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $scope.$on('$ionicView.afterLeave', function() {
      _leaveState();
    });


    _init();

  }

}());