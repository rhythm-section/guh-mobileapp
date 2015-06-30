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
    .controller('RulesAddTriggerCtrl', RulesAddTriggerCtrl);

  RulesAddTriggerCtrl.$inject = ['$log', '$rootScope', 'DSDevice', 'DSEventType', 'DSStateType', 'app'];

  function RulesAddTriggerCtrl($log, $rootScope, DSDevice, DSEventType, DSStateType, app) {

    var vm = this;
    var triggerModal = {};

    vm.availableTriggerDevices = [];

    // Public methods
    vm.selectTrigger = selectTrigger;
    vm.setOperator = setOperator;
    vm.cancel = cancel;
    vm.save = save;

    /*
     * Private method: _init()
     */
    function _init() {
      _loadViewData(false);

      // Reset view
      vm.isEventType = false;
      vm.isStateType = false;
    }

    /*
     * Private method: _loadViewData(bypassCache)
     */
    function _loadViewData(bypassCache) {
      return _findAllDevices(bypassCache)
        .then(_findDeviceRelations)
        .then(function(devices) {
          vm.availableTriggerDevices = devices;
        });
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

      if(deviceClass.eventTypes.length > 0 || deviceClass.stateTypes.length > 0) {
        return device;
      }
    }

    /*
     * Private method: _getAvailableOperators(type)
     */
    function _getAvailableOperators(type) {
      var availableOperators = null;

      switch(type) {
        case 'bool':
          availableOperators = [
            app.valueOperator.is
          ];
          break;
        case 'QString':
          availableOperators = [
            app.valueOperator.is
          ];
          break;
        case 'int':
        case 'uint':
        case 'double':
          availableOperators = [
            app.valueOperator.is,
            app.valueOperator.isNot,
            app.valueOperator.isGreaterThan,
            app.valueOperator.isLessThan,
            app.valueOperator.between
          ];
          break;
      }

      return availableOperators;
    }


    /*
     * Public method: selectTrigger(device, type)
     */
    function selectTrigger(device, type) {
      vm.selectedDevice = angular.copy(device);
      vm.selectedType = angular.copy(type);
      vm.selectedTypeIs = angular.copy(type);
      vm.selectedTypeFrom = null;
      vm.selectedTypeTo = null;

      vm.availableOperators = _getAvailableOperators(type.type);
      vm.selectedOperator = app.valueOperator.is;

      if(DSEventType.is(type)) {
        vm.isEventType = true;
        vm.isStateType = false;
      }

      if(DSStateType.is(type)) {
        vm.isEventType = false;
        vm.isStateType = true;
      }

      $log.log('type', type);
      if(DSEventType.is(type) && type.paramTypes.length === 0) {
        vm.save();
      } else {
        $rootScope.$broadcast('wizard.next', 'addTriggerWizard');
      }
    }

    /*
     * Public method: setOperator()
     */
    function setOperator() {
      if(vm.selectedOperator === app.valueOperator.between) {
        vm.selectedTypeIs = null;

        vm.selectedTypeFrom = angular.copy(vm.selectedType);
        $log.log('vm.selectedTypeFrom', vm.selectedTypeFrom);
        vm.selectedTypeFrom.operator = app.valueOperator.between.operators[0];

        vm.selectedTypeTo = angular.copy(vm.selectedType);
        $log.log('vm.selectedTypeTo', vm.selectedTypeTo);
        vm.selectedTypeTo.operator = app.valueOperator.between.operators[1];
      } else {
        vm.selectedTypeIs = angular.copy(vm.selectedType);
        $log.log('vm.selectedType', vm.selectedType);
        vm.selectedTypeIs.operator = vm.selectedOperator;

        vm.selectedTypeFrom = null;
        vm.selectedTypeTo = null;
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
      var trigger = {
        device: vm.selectedDevice,
        eventDescriptor: null,
        stateDescriptorIs: null,
        stateDescriptorFrom: null,
        stateDescriptorTo: null,
        type: vm.selectedType
      };

      $log.log('vm.selectedType', vm.selectedType);

      // EventDescriptor
      if(DSEventType.is(vm.selectedType)) {
        trigger.eventDescriptor = vm.selectedDevice.getEventDescriptor(vm.selectedType);
      }

      // StateEvaluator
      if(DSStateType.is(vm.selectedType)) {
        trigger.stateDescriptorIs = (vm.selectedTypeIs) ? vm.selectedDevice.getStateDescriptor(vm.selectedTypeIs) : null;
        trigger.stateDescriptorFrom = (vm.selectedTypeFrom) ? vm.selectedDevice.getStateDescriptor(vm.selectedTypeFrom) : null;
        trigger.stateDescriptorTo = (vm.selectedTypeTo) ? vm.selectedDevice.getStateDescriptor(vm.selectedTypeTo) : null;
      }

      vm.closeModal(trigger);
    }


    _init();

  }

}());