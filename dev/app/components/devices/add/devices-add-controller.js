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
    .controller('DevicesAddCtrl', DevicesAddCtrl);

  DevicesAddCtrl.$inject = ['$log', '$rootScope', '$scope', 'DSVendor'];

  function DevicesAddCtrl($log, $rootScope, $scope, DSVendor) {
    
    var vm = this;

    // Public methods
    vm.cancel = cancel;
    vm.save = save;
    vm.selectVendor = selectVendor;
    vm.selectDeviceClass = selectDeviceClass;
    vm.discoverDevices = discoverDevices;


    /*
     * Private method: _init()
     */
    function _init() {
      _findAllVendors()
        .then(function(vendors) {
          vm.supportedVendors = vendors;
        });
    }

    /*
     * Private method: _findAllVendors()
     */
    function _findAllVendors() {
      return DSVendor.findAll();
    }

    /*
     * Private method: _findVendorRelations(vendor)
     */
    function _findVendorRelations(vendor) {
      return DSVendor.loadRelations(vendor, ['deviceClasses']);
    }


    /*
     * Public method: cancel()
     */
    function cancel() {
      vm.closeModal();
    }

    /*
     * Public method: save(deviceData)
     */
    function save(deviceData) {
      var deviceData = angular.copy(deviceData);

      if(deviceData) {
        // For discovered devices only
        var discoveryParamTypes = vm.selectedDeviceClass.discoveryParamTypes;

        deviceData.deviceParamTypes = (angular.isArray(discoveryParamTypes) && discoveryParamTypes.length > 0) ? discoveryParamTypes : [];
        
        delete deviceData.description;
        delete deviceData.title;
      } else {
        // For user created devices only
        var deviceData = {};
        
        var paramTypes = vm.selectedDeviceClass.paramTypes;
        deviceData.deviceParamTypes = (angular.isArray(paramTypes) && paramTypes.length > 0) ? paramTypes : []; 
      }

      vm.closeModal({
        deviceClassId: vm.selectedDeviceClass.id,
        deviceData: deviceData
      });
    }

    /*
     * Public method: selectVendor(vendor)
     */
    function selectVendor(vendor) {
      vm.vendor = vendor;

      _findVendorRelations(vendor)
        .then(function(vendor) {
          vm.selectedVendor = vendor;
          vm.supportedDeviceClasses = [];

          // Remove deviceClasses that are auto discovered
          angular.forEach(vendor.deviceClasses, function(deviceClass, index) {
            var createMethod = deviceClass.getCreateMethod();

            if(createMethod.title !== 'Auto') {
              vm.supportedDeviceClasses.push(deviceClass);
            }
          });
          
          // Go to next wizard step
          $rootScope.$broadcast('wizard.next', 'addDeviceWizard');
        });
    }

    /*
     * Public method: selectDeviceClass(deviceClass)
     */
    function selectDeviceClass(deviceClass) {
      $log.log('selectDeviceClass', deviceClass);

      // Reset view
      vm.discoveredDevices = [];
      vm.createMethod = null;
      vm.setupMethod = null;
      vm.discover = false;

      // Set view
      vm.selectedDeviceClass = deviceClass;
      vm.createMethod = deviceClass.getCreateMethod();
      vm.setupMethod = deviceClass.getSetupMethod();

      $log.log('vm.createMethod', vm.createMethod);

      // Go to next wizard step
      $rootScope.$broadcast('wizard.next', 'addDeviceWizard');
    }

    /*
     * Public method: discoverDevices(deviceClass)
     */
    function discoverDevices() {
      vm.discover = false;
      vm.loading = true;

      vm.selectedDeviceClass
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


    _init();

  }

}());