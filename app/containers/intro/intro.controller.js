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


'use strict';


var controller = function($log, $rootScope, $scope, $timeout, $location, $state, $ionicPlatform, websocketService) {

  var vm = this;
  var zeroconf;

  vm.isReady = false;
  vm.isSearching = false;
  vm.services = {};

  vm.$onInit = $onInit;

  vm.startSearch = startSearch;
  vm.stopSearch = stopSearch;
  vm.connect = connect;


  function $onInit() {
    $ionicPlatform.ready(function() {
      $state.go('app.things');

      // if(window.cordova &&
      //    window.cordova.plugins &&
      //    window.cordova.plugins.zeroconf) {
      //   $scope.$apply(function() {
      //     vm.isReady = true;
      //   });
      // } else {
      //   var ssl = $location.protocol().charAt($location.protocol().length - 1) === 's' ? true : false;
      //   var protocol = ssl ? 'wss' : 'ws';
      //   var host = $location.host();
      //   var port = '4444';

      //   vm.connect(protocol + '://' + host + ':' + port);
      // }
    });
  }


  function startSearch(withTimeout) {
    zeroconf = window.cordova.plugins.zeroconf;

    vm.isSearching = true;

    zeroconf.watch('_http._tcp.local.', function(result) {
      var action = result.action;
      var service = result.service;

      if(action == 'added') {
        var id = angular.isDefined(service.addresses) && angular.isArray(service.addresses) && service.addresses.length === 2 ? service.addresses[1] : undefined;

        if(angular.isDefined(id) &&
           !vm.services.hasOwnProperty(id)) {
          $scope.$apply(function() {
            vm.services[id] = {
              name: service.name,
              host: service.addresses.length === 2 ? service.addresses[0] : undefined,
              port: service.port,
              url: 'ws://' + (service.addresses.length === 2 ? service.addresses[0] : 'localhost') + ':4444'
            };
          });
        }
      }
    });

    if(withTimeout) {
      $timeout(function() {
        zeroconf.unwatch('_http._tcp.local.');
        vm.isSearching = false;
      }, 10000);
    }
  }

  function stopSearch() {
    // zeroconf.unwatch('_http._tcp.local.');
    zeroconf.close();
    zeroconf = null;
    vm.isSearching = false;
  }

  function connect(url) {
    websocketService.connect(url);
  }


  $scope.$on('WebsocketConnected', function(event, data) {
    $log.log('Connected to websocket.', data);
  });

  $scope.$on('InitialHandshake', function(event, data) {
    $log.log('Received initial handshake.', data);
    $state.go('app.things');
  });

};

controller.$inject = ['$log', '$rootScope', '$scope', '$timeout', '$location', '$state', '$ionicPlatform', 'websocketService'];


module.exports = controller;
