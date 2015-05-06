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
    .module('guh')
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider'];

  function config($urlRouterProvider, $stateProvider) {

    $urlRouterProvider
      .otherwise('/dashboard');

    // App
    $stateProvider.state('guh', {
      abstract: true,
      controller: 'AppCtrl as app',
      resolve: {
        initialData: function($q, DSVendor, DSDeviceClass, DSDevice, DSRule, AppInit) {
          function _findAllVendors() {
            return DSVendor.findAll();
          }

          function _findAllDeviceClasses() {
            return DSDeviceClass.findAll();
          }

          function _findDeviceClassRelations(deviceClasses) {
            return angular.forEach(deviceClasses, function(deviceClass) {
              return DSDeviceClass.loadRelations(deviceClass, ['actionTypes', 'eventTypes', 'stateTypes']);
            });
          }

          function _findAllDevices() {
            return DSDevice.findAll();
          }

          function _findDeviceRelations(devices) {
            return angular.forEach(devices, function(device) {
              return DSDevice.loadRelations(device, ['actionTypes', 'states']);
            });
          }

          function _findAllRules() {
            return DSRule.findAll();
          }

          return $q
            .all([
              _findAllVendors(),
              _findAllDeviceClasses()
                .then(_findDeviceClassRelations),
              _findAllDevices()
                .then(_findDeviceRelations),
              _findAllRules()
            ])
            .then(function(data) {
              var initialData = {};
              
              initialData.vendors = data[0];
              initialData.deviceClasses = data[1];
              initialData.devices = data[2];
              initialData.rules = data[3];

              AppInit.hideSplashscreen();

              return initialData;
            })
            .catch(function(error) {
              return error;
            });
        }
      },
      templateUrl: 'app/app.html'
    });

    // Dashboard
    $stateProvider.state('guh.dashboard', {
      url: '/dashboard',
      views: {
        dashboard: {
          controller: 'DashboardCtrl as dashboard',
          templateUrl: 'app/components/dashboard/dashboard.html'
        }
      }
    });

    // Devices
    $stateProvider.state('guh.devices', {
      abstract: true,
      url: '/devices',
      views: {
        devices: {
          template: '<ion-nav-view></ion-nav-view>'
        }
      }
    });
    $stateProvider.state('guh.devices.master', {
      controller: 'DevicesMasterCtrl as devices',
      url: '',
      templateUrl: 'app/components/devices/master/devices-master.html'
    });
    $stateProvider.state('guh.devices.detail', {
      controller: 'DevicesDetailCtrl as device',
      url: '/:deviceId',
      templateUrl: 'app/components/devices/detail/devices-detail.html'
    });

    // Rules
    $stateProvider.state('guh.rules', {
      abstract: true,
      url: '/rules',
      views: {
        rules: {
          template: '<ion-nav-view></ion-nav-view>'
        }
      }
    });
    $stateProvider.state('guh.rules.master', {
      controller: 'RulesMasterCtrl as rules',
      url: '',
      templateUrl: 'app/components/rules/master/rules-master.html'
    });
    $stateProvider.state('guh.rules.detail', {
      controller: 'RulesDetailCtrl as rule',
      url: '/:ruleId',
      templateUrl: 'app/components/rules/detail/rules-detail.html'
    });
    
  }

}());