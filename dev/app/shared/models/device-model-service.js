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
    .factory('DSDevice', DSDeviceFactory)
    .run(function(DSDevice) {});

  DSDeviceFactory.$inject = ['$log', 'DS', 'libs', 'app', 'websocketService'];

  function DSDeviceFactory($log, DS, libs, app, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDevice = DS.defineResource({

      // API configuration
      endpoint: 'devices',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'device',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          }
        },
        hasMany: {
          state: {
            localField: 'states',
            foreignKey: 'deviceId'
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        // Websocket
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        
        // API
        executeAction: executeAction,
        remove: remove,
        getEventDescriptor: getEventDescriptor,
        getStateDescriptor: getStateDescriptor
      },

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        if(angular.isArray(attrs)) {
          var arrayOfAttrs = attrs;
          angular.forEach(arrayOfAttrs, function(attrs) {
            _addCustomName(resource, attrs);
          });
        } else {
          _addCustomName(resource, attrs);
        }
      }

    });

    angular.extend(DSDevice, {
      add: add
    });

    return DSDevice;


    /*
     * Private method: _addCustomName()
     */
    function _addCustomName(resource, attrs) {
      var nameParameter = libs._.find(attrs.params, function(param) { return (param.name === 'name'); });
      attrs.name = (nameParameter === undefined) ? 'Name' : nameParameter.value;
    }


    /*
     * Public method: subscribe(deviceId, cb)
     */
    function subscribe(deviceId, cb) {
      return websocketService.subscribe(this.id, cb);
    }

    /*
     * Public method: unsubscribe(deviceId)
     */
    function unsubscribe(deviceId) {
      return websocketService.unsubscribe(this.id);
    }


    /*
     * Public method: add(deviceClassId, deviceData)
     */
    function add(deviceClassId, deviceData) {
      var deviceData = deviceData || {};
      var device = {};

      device.deviceClassId = deviceClassId || '';
      device.deviceDescriptorId = deviceData.id || '';

      device.deviceParams = [];
      angular.forEach(deviceData.deviceParamTypes, function(deviceParamType) {
        var deviceParam = {};

        deviceParam.name = deviceParamType.name;
        deviceParam.value = deviceParamType.value;

        device.deviceParams.push(deviceParam);
      });

      return DSDevice.create({device: device});
    }

    /*
     * Public method: executeAction()
     */
    function executeAction(actionType) {
      var self = this;
      var options = {};

      options.params = actionType.getParams();

      return DS
        .adapters
        .http
        .POST(app.apiUrl + '/devices/' + self.id + '/actions/' + actionType.id + '/execute.json', options);
    }

    /*
     * Public method: remove()
     */
    function remove() {
      var self = this;

      return DSDevice.destroy(self.id);
    }

    /*
     * Public method: getEventDescriptor(eventType)
     */
    function getEventDescriptor(eventType) {
      var self = this;
      var eventDescriptor = {};
      var paramDescriptors = [];

      eventDescriptor.deviceId = self.id;
      eventDescriptor.eventTypeId = eventType.id;

      paramDescriptors = eventType.getParamDescriptors(eventType.paramTypes);
      if(paramDescriptors.length > 0) {
        eventDescriptor.paramDescriptors = paramDescriptors;
      }

      return eventDescriptor;     
    }

    /*
     * Public method: getStateDescriptor(stateType)
     */
    function getStateDescriptor(stateType) {
      var self = this;
      var stateDescriptor = {};

      stateDescriptor.deviceId = self.id;
      stateDescriptor.operator = stateType.operator;
      stateDescriptor.stateTypeId = stateType.id;
      stateDescriptor.value = stateType.value;

      return stateDescriptor;
    }

  }

}());