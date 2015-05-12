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

  DSDeviceClassFactory.$inject = ['$log', 'DS', 'DSState', 'libs', 'modelsHelper'];

  function DSDeviceClassFactory($log, DS, DSState, libs, modelsHelper) {
    
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
      computed: {},

      // Instance methods
      methods: {},

      // Lifecycle hooks
      afterInject: function(resource, attrs) {
        _addUiData(resource, attrs);
        _mapStatesToActions(resource, attrs);
      }

    });

    return DSDeviceClass;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {     
      angular.forEach(attrs.paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData(paramType);
      });
    }

    /*
     * Private method: _mapStatesToActions(resource, attrs)
     */
    function _mapStatesToActions(resource, attrs) {
      var actionTypes = attrs.actionTypes;
      var stateTypes = attrs.stateTypes;
      var stateIds = libs._.pluck(stateTypes, 'id');

      angular.forEach(actionTypes, function(actionType) {
        // Check if current actionType belongs to a stateType
        if(libs._.contains(stateIds, actionType.id)) {
          actionType.hasState = true;
        } else {
          actionType.hasState = false;
        }
      });
    }

  }

}());