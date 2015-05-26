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
    .module('guh.config')
    .constant('libs', {
      '_': window._
    })
    .constant('app', (function() {
      // var httpProtocol = (isCordovaApp || window.location.protocol === 'http:') ? 'http' : 'https';
      // var wsProtocol = (isCordovaApp || window.location.protocol === 'http:') ? 'ws' : 'wss';
      var httpProtocol = 'http';
      var wsProtocol = 'ws';
      var host = 'localhost';
      // var host = '10.0.0.2';
      // var host = '192.168.0.124';
      var port = '3000';

      // @if NODE_ENV = 'DEVELOPMENT'
      var url = '';
      // @endif

      // @if NODE_ENV = 'PRODUCTION'
      var url = httpProtocol + '://' + host + ':' + port;
      // @endif

      // @if NODE_ENV = 'TEST'
      var url = '';
      // @endif

      return {
        // Cordova
        isCordovaApp: !!window.cordova,

        // Network
        httpProtocol: httpProtocol,
        wsProtocol: wsProtocol,
        host: host,
        port: port,

        // API, Websockets
        apiUrl: url + '/api/v1',
        websocketUrl: wsProtocol + '://' + host + ':' + port + '/ws',
        // websocketUrl: wsProtocol + '://localhost' + ':' + port + '/ws',

        // Basepaths
        basePaths: {
          devices: 'app/components/devices/',
          ui: 'app/shared/ui/'
        },

        // File extensions
        fileExtensions: {
          html: '.html'
        },

        // Input types
        inputTypes: {
          InputTypeIPv4Address: '-ipV4',
          InputTypeIPv6Address: '-ipV6',
          InputTypeMacAddress: '-mac',
          InputTypeMail: '-mail',
          InputTypePassword: '-password',
          InputTypeSearch: '-search',
          InputTypeTextLine: '-text',
          InputTypeTextArea: '-textarea',
          InputTypeUrl: '-url'
        },

        // Notification types
        notificationTypes: {
          // Devices
          devices: {
            deviceAdded: 'Devices.DeviceAdded',
            deviceRemoved: 'Devices.DeviceRemoved',
            stateChanged: 'Devices.StateChanged'
          },

          // Rules
          rules: {
            ruleAdded: 'Rules.RuleAdded',
            ruleRemoved: 'Rules.RuleRemoved'
          },

          // Events
          events: {
            eventTriggered: 'Events.EventTriggeres'
          },

          // Log entry
          logging: {
            logEntryAdded: 'Logging.LogEntryAdded'
          }
        },

        // State operators
        stateOperator: {
          StateOperatorAnd: 'StateOperatorAnd',
          StateOperatorOr: 'StateOperatorOr'
        },

        // Value operators
        valueOperator: {
          is: {
            id: 1,
            label: 'is',
            operators: ['ValueOperatorEquals']
          },
          isNot: {
            id: 2,
            label: 'is not',
            operators: ['ValueOperatorNotEquals']
          },
          isGreaterThan: {
            id: 3,
            label: 'is greater than',
            operators: ['ValueOperatorGreater']
          },
          isLessThan: {
            id: 4,
            label: 'is less than',
            operators: ['ValueOperatorLess']
          },
          between: {
            id: 5,
            label: 'is between',
            operators: ['ValueOperatorGreaterOrEqual', 'ValueOperatorLessOrEqual']
          }
        }
      }
    })())

}());