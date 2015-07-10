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
    .factory('DSEventType', DSEventTypeFactory)
    .run(function(DSEventType) {});

  DSEventTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSEventTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSEventType = DS.defineResource({

      // API configuration
      endpoint: 'event_types',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'eventType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId',
            parent: true
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        getParamDescriptors: getParamDescriptors
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
      }

    });

    return DSEventType;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var paramTypes = attrs.paramTypes;
      var phrase = 'When ' + attrs.name;

      // phrase
      if(angular.isArray(paramTypes) && paramTypes.length === 0) {
        attrs.phrase = phrase + ' is detected';
      } else {
        attrs.phrase = phrase + ' is detcted and parameters are';
      }

      // unit
      attrs.unit = modelsHelper.getUnit(attrs.name);

      // paramTypes
      angular.forEach(paramTypes, function(paramType) {
        paramType = modelsHelper.addUiData('input', paramType);
      });
    }


    /*
     * Public method: getParamDescriptors(paramTypes)
     */
    function getParamDescriptors(paramTypes) {
      var paramDescriptors = [];

      angular.forEach(paramTypes, function(paramType) {
        paramDescriptors.push({
          name: paramType.name,
          operator: paramType.operator,
          value: paramType.value
        });
      });

      return paramDescriptors;
    }

  }

}());