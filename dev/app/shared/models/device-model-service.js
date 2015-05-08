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

  DSDeviceFactory.$inject = ['$log', 'DS', 'libs', 'websocketService'];

  function DSDeviceFactory($log, DS, libs, websocketService) {
    
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
      computed: {
        userSettings: ['name', 'params', _getUserSettings]
      },

      // Instance methods
      methods: {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        executeAction: executeAction
      }

    });

    return DSDevice;


    /*
     * Private method: _getUserSettings()
     */
    function _getUserSettings(name, params) {
      var nameParameter = libs._.find(params, function(param) { return (param.name === 'Name'); });
      var userSettings = {
        name: (nameParameter === undefined) ? 'Name' : nameParameter.value
      };

      return userSettings;
    }


    /*
     * Public method: subscribe(deviceId, cb)
     */
    function subscribe(deviceId, cb) {
      // $log.log('subscribe device', deviceId);
      return websocketService.subscribe(this.id, cb);
    }

    /*
     * Public method: unsubscribe(deviceId)
     */
    function unsubscribe(deviceId) {
      $log.log('unsubscribe device', deviceId);
      return websocketService.unsubscribe(this.id);
    }

    /*
     * Public method: executeAction()
     */
    function executeAction(actionType) {
      var self = this;
      var options = {};

      options.params = actionType.getParams();

      $log.log('actionType', actionType);
      $log.log('options', options);

      return DS
        .adapters
        .http
        .POST('api/v1/devices/' + self.id + '/actions/' + actionType.id + '/execute.json', options);
    }

  }

}());