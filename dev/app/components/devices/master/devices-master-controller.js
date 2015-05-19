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
    .controller('DevicesMasterCtrl', DevicesMasterCtrl);

  DevicesMasterCtrl.$inject = ['$log', '$rootScope', '$scope', '$ionicModal', 'DSVendor', 'DSDeviceClass', 'DSDevice'];

  function DevicesMasterCtrl($log, $rootScope, $scope, $ionicModal, DSVendor, DSDeviceClass, DSDevice) {
    
    var vm = this;
    var addModal = {};

    // $scope methods
    $scope.refresh = refresh;

    // Public methods
    vm.addDevice = addDevice;
    vm.closeDevice = closeDevice;
    vm.saveDevice = saveDevice;

    vm.selectVendor = selectVendor;
    vm.selectDeviceClass = selectDeviceClass;

    vm.discoverDevices = discoverDevices;

    // vm.isItemActive = isItemActive;

    /*
     * Private method: _init()
     */
    function _init() {
      _loadViewData(false);
    }

    /*
     * Private method: _loadViewData(cache)
     */
    function _loadViewData(bypassCache) {
      return _findAllDevices(bypassCache)
        .then(_findDeviceRelations)
        .then(function(devices) {
          vm.configured = devices;

          // Initialize settings modal
          _initModal();
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
          .then(_findDeviceClassRelations);
      });
    }

    /*
     * Private method: _findDeviceClassRelations(devices)
     */
    function _findDeviceClassRelations(device) {
      return DSDeviceClass.loadRelations(device.deviceClass, ['vendor']);
    }

    /*
     * Private method: _initModal()
     */
    function _initModal() {
      $log.log('_initModal');

      // Needed because ionicModal only works with "$scope" but not with "vm" as scope
      $scope.devices = vm;

      // Edit modal
      $ionicModal.fromTemplateUrl('app/components/devices/master/devices-add-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        addModal = modal;
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
     * Public method: refresh()
     */
    function refresh() {
      _loadViewData(true)
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    /*
     * Public method: addDevice()
     */
    function addDevice() {
      // Reset wizard
      $rootScope.$broadcast('wizard.reset');

      // Reset view
      vm.selectedVendor = null;
      vm.selectedDeviceClass = null;

      // Schow modal
      addModal.show();

      _findAllVendors()
        .then(function(vendors) {
          vm.supportedVendors = vendors;
        });
    }

    /*
     * Public method: closeDevice()
     */
    function closeDevice() {
      addModal.hide();
    }

    /*
     * Public method: saveDevice()
     */
    function saveDevice() {
      addModal.hide();
    }

    /*
     * Public method: selectVendor(vendor)
     */
    function selectVendor(vendor) {
      vm.vendor = vendor;

      _findVendorRelations(vendor)
        .then(function(vendor) {
          vm.selectedVendor = vendor;
          vm.supportedDeviceClasses = vendor.deviceClasses;
          
          // Go to next wizard step
          $rootScope.$broadcast('wizard.next');
        });
    }

    /*
     * Public method: selectDeviceClass(deviceClass)
     */
    function selectDeviceClass(deviceClass) {
      // Reset
      vm.discoveredDevices = [];
      vm.createMethod = null;
      vm.setupMethod = null;
      vm.discover = false;

      vm.selectedDeviceClass = deviceClass;

      vm.createMethod = deviceClass.getCreateMethod();
      vm.setupMethod = deviceClass.getSetupMethod();

      // Go to next wizard step
      $rootScope.$broadcast('wizard.next');
    }

    /*
     * Public method: saveDevice(deviceData)
     */
    function saveDevice(deviceData) {
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

      DSDevice
        .add(vm.selectedDeviceClass.id, deviceData)
        .then(function(device) {
          $log.log('device', device);
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

    /* 
     * Public method: isItemActive(item, currentItem)
     */
    // function isItemActive(item, currentItem) {
    //   $log.log('item', item);
    //   $log.log('currentItem', currentItem);
    //   return item === currentItem;
    // }


    /*
     * Event: $destroy
     */
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });


    _init();


  }

}());