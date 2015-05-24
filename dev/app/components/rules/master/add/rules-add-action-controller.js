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
    .controller('RulesAddActionCtrl', RulesAddActionCtrl);

  RulesAddActionCtrl.$inject = ['$log', '$rootScope', 'DSDevice', 'DSActionType'];

  function RulesAddActionCtrl($log, $rootScope, DSDevice, DSActionType) {

    var vm = this;
    var actionModal = {};

    vm.availableActionDevices = [];

    // Public methods
    vm.selectAction = selectAction;
    vm.cancel = cancel;
    vm.save = save;


    /*
     * Private method: _init()
     */
    function _init() {
      _loadViewData(false);
    }

    /*
     * Private method: _loadViewData(bypassCache)
     */
    function _loadViewData(bypassCache) {
      return _findAllDevices(bypassCache)
        .then(_findDeviceRelations)
        .then(function(devices) {
          vm.availableActionDevices = devices;
          $log.log('devices', devices);
        });;
    }

    /*
     * Private method: _findAllDevices(bypassCache)
     */
    function _findAllDevices(bypassCache) {
      if(bypassCache) {
        return DSDevice.findAll({}, { bypassCache: true });
      }
      
      return DSDevice.findAll();
    }

    /*
     * Private method: _findDeviceRelations()
     */
    function _findDeviceRelations(devices) {
      return angular.forEach(devices, function(device) {
        return DSDevice
          .loadRelations(device, ['deviceClass'])
          .then(_setAvailableItem);
      });
    }

    /*
     * Private method: _setAvailableItem(device)
     */
    function _setAvailableItem(device) {
      var deviceClass = device.deviceClass;

      if(deviceClass.actionTypes.length > 0) {
        $log.log('device with actions', device);
        return device;
      } else {
        $log.log('device without actions', device);
      }
    }


    /*
     * Public method: selectAction(device, type)
     */
    function selectAction(device, type) {
      vm.selectedDevice = angular.copy(device);
      vm.selectedType = angular.copy(type);

      if(DSActionType.is(type) && type.paramTypes.length === 0) {
        vm.save();
      } else {
        $rootScope.$broadcast('wizard.next', 'addActionWizard');
      }
    }

    /*
     * Public method: cancel()
     */
    function cancel() {
      vm.closeModal();
    }

    /*
     * Public method: save(trigger)
     */
    function save() {
      var action = {
        device: vm.selectedDevice,
        action: vm.selectedDevice.getAction(vm.selectedType),
        type: vm.selectedType
      };

      vm.closeModal(action);
    }


    _init();

  }

}());