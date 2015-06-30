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
    .controller('DevicesMasterCtrl', DevicesMasterCtrl);

  DevicesMasterCtrl.$inject = ['$log', '$rootScope', '$scope', '$ionicModal', 'DSVendor', 'DSDeviceClass', 'DSDevice', 'appModalService'];

  function DevicesMasterCtrl($log, $rootScope, $scope, $ionicModal, DSVendor, DSDeviceClass, DSDevice, appModalService) {
    
    var vm = this;
    var addModal = {};

    // $scope methods
    $scope.refresh = refresh;

    // Public methods
    vm.addDevice = addDevice;


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
          devices.forEach(function(device) {
            device.name = (device.name === 'Name') ? device.deviceClass.name : device.name;
          });

          vm.configured = devices;
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
      appModalService
        .show('app/components/devices/add/devices-add-modal.html', 'DevicesAddCtrl as devicesAdd', {})
        .then(function(data) {
          if(data !== undefined) {
            if(data.httpCreate) {
              DSDevice
                .add(data.device.deviceClassId, data.device.deviceData)
                .then(function(device) {
                  _loadViewData(true);
                })
                .catch(function(error) {
                  $log.error(error);
                });
            } else {
              DSDevice.inject(data.device);
              _loadViewData(true);
            }
          }
        }, function(error) {
          $log.error(error);
        });
    }


    _init();

  }

}());