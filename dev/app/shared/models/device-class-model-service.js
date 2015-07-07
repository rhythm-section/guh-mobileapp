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
  "use strict";

  angular
    .module('guh.models')
    .factory('DSDeviceClass', DSDeviceClassFactory)
    .run(function(DSDeviceClass) {});

  DSDeviceClassFactory.$inject = ['$log', 'DS', 'DSHttpAdapter', 'DSState', 'app', 'libs', 'modelsHelper'];

  function DSDeviceClassFactory($log, DS, DSHttpAdapter, DSState, app, libs, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDeviceClass = DS.defineResource({

      // API configuration
      endpoint: 'device_classes',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'deviceClass',
      relations: {
        belongsTo: {
          vendor: {
            localField: 'vendor',
            localKey: 'vendorId',
            // parent: true
          }
        },
        hasMany: {
          actionType: {
            localField: 'actionTypes',
            foreignKey: 'deviceClassId'
          },
          eventType: {
            localField: 'eventTypes',
            foreignKey: 'deviceClassId'
          },
          stateType: {
            localField: 'stateTypes',
            foreignKey: 'deviceClassId'
          }
        }
      },

      // Computed properties
      computed: {
        templateUrl: ['name', _addUiTemplate]
      },

      // Instance methods
      methods: {
        discover: discover,
        getCreateMethod: getCreateMethod,
        getSetupMethod: getSetupMethod
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addUiData(resource, attrs);
            _mapClassType(resource, attrs);
            _mapStates(resource, attrs);
          });
        } else {
          _addUiData(resource, attrs);
          _mapClassType(resource, attrs);
          _mapStates(resource, attrs);
        }
      }

    });

    return DSDeviceClass;


    /*
     * Private method: _getInputPath(filename)
     */
    function _getInputPath(filename) {
      return app.basePaths.devices + 'detail/device-class-templates/' + filename + app.fileExtensions.html;
    }

    /*
     * Private method: _addUiTemplate(name)
     */
    function _addUiTemplate(name) {
      // Example: 'Elro Remote' => 'elro-remote'
      var templateName = name
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '');
      var templateUrl = _getInputPath('device-class-' + templateName);

      return modelsHelper.checkTemplateUrl(templateUrl);
    }

    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var discoveryParamTypes = attrs.discoveryParamTypes;
      var paramTypes = attrs.paramTypes;
      var stateTypes = attrs.stateTypes;

      // discoveryParamTypes
      angular.forEach(discoveryParamTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
      });

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
      });

      // stateTypes
      angular.forEach(stateTypes, function(stateType) {
        stateType = modelsHelper.addUiData('input', stateType);
      });
    }

    /*
     * Private method: _mapClassType(resource, attrs)
     */
    function _mapClassType(resource, attrs) {
      var devServices = [
        'Mock Device',
        'Mock Device (Auto created)'
      ];
      var devices = [
        'Elro Bulb (AB440L)',
        'Elro outdoor socket (AB440WD)',
        'Elro Socket (AB440D)',
        'Elro Socket (AB440S)',
        'Hue Light',
        'Intertechno switch',
        'IR receiver',
        'Kodi',
        'LG Smart Tv',
        'Max! Cube LAN Gateway',
        'Max! Radiator Thermostat',
        'Max! Wall Thermostat',
        'RF Controller (LN-CON-RF20B)',
        'Shutter (RSM900R)',
        'Tune',
        'Unitec switch (48111)',
        'WeMo Switch',
        'WiFi Device'
      ];
      var gateways = [
        'Hue Bridge'
      ];
      var moods = [
        'Mood'
      ];
      var services = [
        'Alarm',
        'Application launcher',
        'Bashscript launcher',
        'Button',
        'Countdown',
        'Custom mail',
        'Google mail',
        'ON/OFF Button',
        'Today',
        'Toggle Button',
        'UDP Commander',
        'Wake On Lan',
        'Weather from OpenWeatherMap',
        'Yahoo mail'
      ];

      attrs.classType = 'device';

      if(libs._.contains(devServices, attrs.name)) {
        attrs.classType = 'dev-service';
      } else if(libs._.contains(moods, attrs.name)) {
        attrs.classType = 'mood';
      } else if(libs._.contains(gateways, attrs.name)) {
        attrs.classType = 'gateway';
      } else if(libs._.contains(services, attrs.name)) {
        attrs.classType = 'service';
      }
    }


    /*
     * Private method: _mapStates(resource, attrs)
     */
    function _mapStates(resource, attrs) {
      var actionTypes = attrs.actionTypes;
      var eventTypes = attrs.eventTypes;
      var stateTypes = attrs.stateTypes;
      var stateIds = libs._.pluck(stateTypes, 'id');

      // Map actionTypes
      angular.forEach(actionTypes, function(actionType) {
        // Check if current actionType belongs to a stateType
        if(libs._.contains(stateIds, actionType.id)) {
          actionType.hasState = true;
        } else {
          actionType.hasState = false;
        }
      });

      // Map eventTypes
      angular.forEach(eventTypes, function(eventType) {
        // Check if current eventType belongs to a stateType
        if(libs._.contains(stateIds, eventType.id)) {
          eventType.hasState = true;
        } else {
          eventType.hasState = false;
        }
      });
    }


    /*
     * Public method: discover()
     */
    function discover() {
      /* jshint validthis: true */
      var self = this;
      var discoveryParams = [];

      angular.forEach(self.discoveryParamTypes, function(discoveryParamType) {
        var discoveryParam = {};

        discoveryParam.name = discoveryParamType.name;
        discoveryParam.value = discoveryParamType.value;

        discoveryParams.push(discoveryParam);
      });

      return DSHttpAdapter.GET(app.apiUrl + '/device_classes/' + self.id + '/discover.json', {
        params: {
          'device_class_id': self.id,
          'discovery_params': angular.toJson(discoveryParams)
        }
      });
    }

    /*
     * Public method: getCreateMethod()
     */
    function getCreateMethod() {
      /* jshint validthis: true */
      var self = this;
      var addBasePath = 'app/components/devices/add/pairing-templates/';
      var editBasePath = 'app/components/devices/edit/pairing-templates/';
      var createMethodData = null;

      if(self.createMethods.indexOf('CreateMethodDiscovery') > -1) {
        createMethodData = {
          title: 'Discovery',
          addTemplate: addBasePath + 'devices-add-create-discovery.html',
          editTemplate: editBasePath + 'devices-edit-create-discovery.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodUser') > -1) {
        createMethodData = {
          title: 'User',
          addTemplate: addBasePath + 'devices-add-create-user.html',
          editTemplate: editBasePath + 'devices-edit-create-user.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodAuto') > -1) {
        createMethodData = {
          title: 'Auto',
          // addTemplate: addBasePath + 'devices-add-create-user.html',
          // editTemplate: editBasePath + 'devices-edit-create-user.html'
          addTemplate: null,
          ediTemplate: null
        };
      } else {
        $log.error('CreateMethod not implemented.');
      }

      // createMethodData.addTemplate = modelsHelper.checkTemplateUrl(createMethodData.addTemplate);

      return createMethodData;
    }

    /*
     * Public method: getSetupMethod()
     */
    function getSetupMethod() {
      /* jshint validthis: true */
      var self = this;
      var addBasePath = 'app/components/devices/add/pairing-templates/';
      var editBasePath = 'app/components/devices/edit/pairing-templates/';
      var setupMethodData = {};

      switch(self.setupMethod) {
        case 'SetupMethodJustAdd':
          setupMethodData = null;
          break;
        case 'SetupMethodDisplayPin':
          setupMethodData = {
            title: 'Display Pin',
            addTemplate: addBasePath + 'devices-add-setup-display-pin.html',
            editTemplate: editBasePath + 'devices-edit-setup-display-pin.html'
          };
          break;
        case 'SetupMethodEnterPin':
          setupMethodData = {
            title: 'Enter Pin',
            addTemplate: addBasePath + 'devices-add-setup-enter-pin.html',
            editTemplate: editBasePath + 'devices-edit-setup-enter-pin.html'
          };
          break;
        case 'SetupMethodPushButton':
          setupMethodData = {
            title: 'Push Button',
            addTemplate: addBasePath + 'devices-add-setup-push-button.html',
            editTemplate: editBasePath + 'devices-edit-setup-push-button.html'
          };
          break;
        default:
          $log.error('SetupMethod not implemented.');
          break;
      }

      return setupMethodData;
    }


  }

}());