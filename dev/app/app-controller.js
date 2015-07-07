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
    .module('guh')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = ['$log', '$scope', '$timeout', '$ionicModal', '$ionicLoading', '$state', 'app', 'firstStart', 'websocketService', 'modelsHelper'];

  function AppCtrl($log, $scope, $timeout, $ionicModal, $ionicLoading, $state, app, firstStart, websocketService, modelsHelper) {

    var vm = this;
    var editModal = {};


    // Public methods
    vm.editSettings = editSettings;
    vm.closeSettings = closeSettings;
    vm.saveSettings = saveSettings;


    /*
     * Private method: _init()
     */
    function _init() {
      vm.host = app.host;

      // Needed because ionicModal only works with "$scope" but not with "vm" as scope
      $scope.app = vm;

      // Edit modal
      $ionicModal.fromTemplateUrl('app/app-edit-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        editModal = modal;

        // If on intro page show editModal
        if(firstStart) {
          firstStart = false;
          editModal.show();
        }
      });
    }


    /*
     * Public method: editSettings()
     */
    function editSettings() {
      editModal.show();
    }

    /*
     * Public method: closeSettings()
     */
    function closeSettings() {
      editModal.hide();
    }

    /*
     * Public method: saveSettings()
     */
    function saveSettings() {
      var oldHost = app.host;

      // Save IP setting
      app.host = vm.host;

      // Set new WebSocket url
      app.websocketUrl = app.wsProtocol + '://' + app.host + ':' + app.port + '/ws';

      // Reconnect websocket to new address
      websocketService.reconnect();

      // Show popup during reconnect
      $ionicLoading.show({
        template: 'Check connection to host "' + app.host + '"...'
      });

      // Hide popup and lose connection if reconnection fails (after 5s)
      $timeout(function() {
        app.host = oldHost;
        app.websocketUrl = app.wsProtocol + '://' + app.host + ':' + app.port + '/ws';
        vm.host = app.host;

        $ionicLoading.hide();
        websocketService.close();  
      }, 5000);
      
      // If connection is sucessful
      /* jshint unused:false */
      $scope.$on('WebsocketConnected', function(event, args) {
        // Set new API url
        app.apiUrl = (app.apiUrl === '/api/v1') ? '/api/v1' : app.httpProtocol + '://' + app.host + ':' + app.port + '/api/v1';
        modelsHelper.setBasePath();

        // Hide popup and modal
        $ionicLoading.hide();
        editModal.hide();
      });
    }


    _init();

  }

}());