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

  DevicesDetailCtrl.$inject = ['$log', '$rootScope', '$scope', '$stateParams', '$ionicModal', 'libs', 'DSDeviceClass', 'DSDevice', 'DSState'];

  function DevicesDetailCtrl($log, $rootScope, $scope, $stateParams, $ionicModal, libs, DSDeviceClass, DSDevice, DSState) {
    
    var vm = this;
    var currentDevice = {};
    var editModal = {};

    // Public methods
    vm.execute = execute;
    vm.editSettings = editSettings;
    vm.closeSettings = closeSettings;
    vm.saveSettings = saveSettings;


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

          $log.log('currentDevice', currentDevice);

          // Check if device has individual name
          var params = currentDevice.params;
          var nameParameter = libs._.find(params, function(param) { return (param.name === 'Name'); });

          // Set view variables
          vm.SetupComplete = currentDevice.SetupComplete;
          vm.deviceClass = currentDevice.deviceClass;
          vm.deviceClassId = currentDevice.deviceClassId;
          vm.id = currentDevice.id;
          vm.name = currentDevice.name
          vm.params = (currentDevice.userSettings.name === currentDevice.name) ? currentDevice.params : libs._.without(params, nameParameter);
          vm.states = currentDevice.states;
          vm.userSettings = currentDevice.userSettings;

          // Needed because ionicModal only works with "$scope" but not with "vm" as scope
          $scope.device = vm;

          // Edit modal
          $ionicModal.fromTemplateUrl('app/components/devices/detail/devices-edit-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            editModal = modal;
          });

          // Subscribe to websocket messages
          currentDevice.subscribe(currentDevice.id, function(message) {
            $log.log('new message', message);

            if(message.notification === 'Devices.StateChanged') {
              angular.forEach(currentDevice.states, function(state, index) {
                if(message.params.stateTypeId === state.stateTypeId && message.params.deviceId === vm.id) {
                  DSState.inject([{stateTypeId: message.params.stateTypeId, value: message.params.value}]);
                }
              });
            }
          });
        })
        .catch(_showError);
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
      currentDevice.unsubscribe(currentDevice.id);
    }


    /*
     * Public method: execute(actionType)
     */
    function execute(actionType) {
      currentDevice.executeAction(actionType);
    }

    /*
     * Public method: editSettings()
     */
    function editSettings() {
      editModal.show();
    }

    /*
     * Public method: closeSettings()
     */
    function closeSettings() {
      $log.log('Close modal');
      editModal.hide();
    }

    /*
     * Public method: saveSettings()
     */
    function saveSettings() {
      $log.log('Save settings and close modal');
      editModal.hide();
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