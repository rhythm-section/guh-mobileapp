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

  DevicesDetailCtrl.$inject = ['$log', '$stateParams', 'libs', 'DSDevice'];

  function DevicesDetailCtrl($log, $stateParams, libs, DSDevice) {
    
    var vm = this;


    /*
     * Private method: _init()
     */
    function _init() {
      var deviceId = $stateParams.deviceId;

      _findDevice(deviceId)
        .then(_findDeviceRelations)
        .then(function(device) {
          $log.log(device);

          // Check if device has individual name
          var params = device.params;
          var nameParameter = libs._.find(params, function(param) { return (param.name === 'Name'); });

          // Set view variables
          vm.SetupComplete = device.SetupComplete;
          vm.deviceClass = device.deviceClass;
          vm.deviceClassId = device.deviceClassId;
          vm.id = device.id;
          vm.name = device.name
          vm.params = (device.userSettings.name === device.name) ? device.params : libs._.without(params, nameParameter);
          vm.states = device.states;
          vm.userSettings = device.userSettings;
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
      return DSDevice.loadRelations(device, ['deviceClass', 'states']);
    }

    /*
     * Private method: _showError(error)
     */
    function _showError(error) {
      $log.error(error.data.errorMessage);
    }


    _init();

  }

}());