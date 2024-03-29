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
    .factory('DSActionType', DSActionTypeFactory)
    .run(function(DSActionType) {});

  DSActionTypeFactory.$inject = ['$log', 'DS', 'modelsHelper'];

  function DSActionTypeFactory($log, DS, modelsHelper) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSActionType = DS.defineResource({

      // API configuration
      endpoint: 'action_types',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'actionType',
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
        getParams: getParams,
        getRuleActionParams: getRuleActionParams
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

    return DSActionType;


    /*
     * Private method: _addUiData(resource, attrs)
     */
    function _addUiData(resource, attrs) {
      var paramTypes = attrs.paramTypes;
      var phrase = 'Execute "' + attrs.name + '"';

      // phrase
      if(angular.isArray(paramTypes) && paramTypes.length === 0) {
        attrs.phrase = phrase + '.';
      } else {
        attrs.phrase = phrase + ' with parameters';
      }

      function _handleParamType(paramType) {
        paramType = modelsHelper.addUiData('action', paramType);
        paramType.dependsOnTrigger = false;
      }

      // paramTypes
      angular.forEach(paramTypes, _handleParamType);
    }


    /*
     * Public method: getParams()
     */
    function getParams() {
      /* jshint validthis: true */
      var self = this;
      var params = [];
      var paramTypes = self.paramTypes;

      angular.forEach(paramTypes, function(paramType) {
        params.push({
          name: paramType.name,
          value: paramType.value
        });
      });

      return params;
    }

    /*
     * Public method: getRuleActionParams(actionType, actionParamType, eventParamType)
     */
    function getRuleActionParams(actionType, actionParamType, eventParamType) {
      /* jshint validthis: true */
      var self = this;
      var ruleActionParams = [];
      var paramTypes = self.paramTypes;

      angular.forEach(paramTypes, function(paramType) {
        if(actionParamType !== undefined && eventParamType !== undefined) {
          if(paramType.name === actionParamType.name) {
            ruleActionParams.push({
              name: paramType.name,
              eventParamName: eventParamType.name,
              eventTypeId: eventParamType.eventDescriptor.eventTypeId
            });
          } else {
            ruleActionParams.push({
              name: paramType.name,
              value: paramType.value
            });
          }
        } else {
          ruleActionParams.push({
            name: paramType.name,
            value: paramType.value
          });
        }
      });

      return ruleActionParams;
    }

  }

}());