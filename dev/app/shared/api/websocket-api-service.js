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
    .module('guh.api')
    .factory('websocketService', websocketService);

  websocketService.$inject = ['$log', '$rootScope', 'libs', 'app'];

  function websocketService($log, $rootScope, libs, app) {

    var websocketService = {
      // Data
      ws: null,
      callbacks: {},

      // Methods
      close: close,
      connect: connect,
      reconnect: reconnect,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };

    return websocketService;


    /*
     * Public method: close()
     */
    function close() {
      if(websocketService.ws) {
        websocketService.ws = null;
      }
    }

    /*
     * Public method: connect()
     */
    function connect() {
      $log.log('Connect to websocket.');

      if(websocketService.ws) {
        return;
      }

      var ws = new WebSocket(app.websocketUrl);

      ws.onopen = function(event) {
        $log.log('Successfully connected with websocket.', event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnected', 'Successful connected to guh.');
        });
      };

      ws.onclose = function(event) {
        $log.log('Closed websocket connection.', event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionLost', 'The app has lost the connection to guh. Please check if you are connected to your network and if guh is running correctly.');
        });
      };

      ws.onerror = function() {
        $log.error('There was an error with the websocket connection.');

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionError', 'There was an error connecting to guh.');
        });
      };

      ws.onmessage = function(message) {
        var data = angular.fromJson(message.data);

        if(data.notification === app.notificationTypes.devices.stateChanged) {
          $log.log('Device state changed.', data);

          // Execute callback-function with right ID
          if(libs._.has(websocketService.callbacks, data.params.deviceId)) {
            var cb = websocketService.callbacks[data.params.deviceId];
            cb(data);
          }
        } else {
          $log.warn('Type of notification not handled:' + data.notification);
        }
      };

      websocketService.ws = ws;
    }

    /*
     * Public method: reconnect()
     */
    function reconnect() {
      websocketService.close();
      websocketService.connect();
    }

    /*
     * Public method: subscribe(id, cb)
     */
    function subscribe(id, cb) {
      $log.log('Subscribe to websocket.');

      if(!websocketService.ws) {
        websocketService.connect();
      }

      websocketService.callbacks[id] = cb;
    }

    /*
     * Public method: unsubscribe(id)
     */
    function unsubscribe(id) {
      $log.log('Unsubscribe from websocket.', id);
      delete websocketService.callbacks[id];
    }

  }

}());