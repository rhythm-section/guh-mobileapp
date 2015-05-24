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
            parent: true
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
      computed: {},

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
          });
        } else {
          _addUiData(resource, attrs);
        }
        _mapStates(resource, attrs);
      }

    });

    return DSDeviceClass;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var discoveryParamTypes = attrs.discoveryParamTypes;
      var paramTypes = attrs.paramTypes;
      var stateTypes = attrs.stateTypes;

      // discoveryParamTypes
      angular.forEach(discoveryParamTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType);
      });

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType);
      });

      // stateTypes
      angular.forEach(stateTypes, function(stateType) {
        stateType = modelsHelper.addUiData(stateType);
      });
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
        // Check if current actionType belongs to a stateType
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
      var self = this;
      var discoveryParams = [];

      angular.forEach(self.discoveryParamTypes, function(discoveryParamType, index) {
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
      var self = this;
      var addBasePath = 'app/components/devices/master/pairing-templates/';
      var editBasePath = 'app/components/devices/detail/edit/pairing-templates/';
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
          addTemplate: null,
          ediTemplate: null
        };
      } else {
        $log.error('CreateMethod "' + createMethod + '" not implemented.');
      }

      return createMethodData;
    }

    /*
     * Public method: getSetupMethod()
     */
    function getSetupMethod() {
      var self = this;
      var addBasePath = 'app/components/devices/master/pairing-templates/';
      var editBasePath = 'app/components/devices/detail/edit/pairing-templates/';
      var setupMethodData = {};

      switch(self.setupMethod) {
        case 'SetupMethodJustAdd':
          break;
        case 'SetupMethodDisplayPin':
          setupMethodData = {
            title: 'Display Pin',
            addTemplate: basePath + 'devices-add-setup-display-pin.html',
            editTemplate: basePath + 'devices-edit-setup-display-pin.html'
          };
          break;
        case 'SetupMethodEnterPin':
          setupMethodData = {
            title: 'Enter Pin',
            addTemplate: basePath + 'devices-add-setup-enter-pin.html',
            editTemplate: basePath + 'devices-edit-setup-enter-pin.html'
          };
          break;
        case 'SetupMethodPushButton':
          setupMethodData = {
            title: 'Enter Pin',
            addTemplate: basePath + 'devices-add-setup-push-button.html',
            editTemplate: basePath + 'devices-edit-setup-push-button.html'
          };
          break;
        default:
          $log.error('SetupMethod "' + setupMethod + '" not implemented.');
          break;
      }

      return setupMethodData;
    }


  }

}());