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
    .controller('DevicesEditCtrl', DevicesEditCtrl);

  DevicesEditCtrl.$inject = ['$log', '$scope', 'libs', 'DSDevice', 'parameters'];

  function DevicesEditCtrl($log, $scope, libs, DSDevice, parameters) {

    // Use data that was passed to modal for the view
    var vm = this;
    var currentDevice = angular.copy(parameters);

    // Public methods
    vm.cancel = cancel;
    vm.save = save;
    vm.discoverDevices = discoverDevices;
    vm.remove = remove;

    /*
     * Private method: _init()
     */
    function _init() {
      // Map param values to paramType values
      angular.forEach(currentDevice.deviceClass.paramTypes, function(paramType) {
        var param = libs._.find(currentDevice.params, function(param) { return param.name === paramType.name });
        paramType.value = (param) ? param.value : paramType.value;
      });

      vm.discover = false;
      vm.createMethod = currentDevice.deviceClass.getCreateMethod();
      vm.id = currentDevice.id;
      vm.deviceClass = currentDevice.deviceClass;
      vm.name = currentDevice.name;

      if(vm.createMethod.title === 'Discovery' && vm.deviceClass.discoveryParamTypes.length === 0) {
        vm.discoverDevices();
      }
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
     * Public method: save(device)
     */
    function save(device) {
      var deviceData = angular.copy(device);

      if(deviceData) {
        // For discovered devices only
        var discoveryParamTypes = vm.deviceClass.discoveryParamTypes;

        deviceData.deviceParamTypes = (angular.isArray(discoveryParamTypes) && discoveryParamTypes.length > 0) ? discoveryParamTypes : [];
        
        delete deviceData.description;
        delete deviceData.title;
      } else {
        // For user created devices only
        var deviceData = {};
        
        var paramTypes = [];
        angular.forEach(vm.deviceClass.paramTypes, function(paramType) {
          if(!paramType.readOnly) {
            paramTypes.push(paramType);
          }
        });
        deviceData.deviceParamTypes = (angular.isArray(paramTypes) && paramTypes.length > 0) ? paramTypes : []; 
      }

      DSDevice
        .edit(vm.id, deviceData)
        .then(function() {
          vm.closeModal({
            updated: true,
            removed: false
          });
        })
        .catch(function(error) {
          $log.error(error);
        });
    }

    /*
     * Public method: discoverDevices(deviceClass)
     */
    function discoverDevices() {
      vm.discover = false;
      vm.loading = true;

      vm.deviceClass
        .discover()
        .then(function(discoveredDevices) {
          vm.discover = true;
          vm.loading = false;
          vm.discoveredDevices = discoveredDevices.data;
        })
        .catch(function(error) {
          vm.discover = true;
          vm.loading = false;
          $log.error(error);
        });
    }

    /*
     * Public method: remove()
     */
    function remove() {
      currentDevice
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