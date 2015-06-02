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
    .factory('modelsHelper', modelsHelper);

  modelsHelper.$inject = ['$log', '$q', '$cordovaFile', 'DS', 'DSParamType', 'File', 'app'];

  function modelsHelper($log, $q, $cordovaFile, DS, DSParamType, File, app) {

    var modelsHelper = {
      addUiData: addUiData,
      checkTemplateUrl: checkTemplateUrl,
      getTemplateUrl: getTemplateUrl,
      getUnit: getUnit,
      setBasePath: setBasePath
    };

    return modelsHelper;


    /*
     * Private method: _getInputPath(directiveName, filename)
     */
    function _getInputPath(directiveName, filename) {
      return app.basePaths.ui + directiveName + '/templates/' + filename + app.fileExtensions.html;
    }

    /*
     * Private method: _getActionTemplate(guhType)
     */
    function _getActionTemplate(guhType) {
      var allowedValues = (guhType.allowedValues === undefined) ? null : guhType.allowedValues;
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      var name = (guhType.name === undefined) ? null : guhType.name;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var directiveNameAction = 'action-param';
      var directiveNameInput = 'input';
      var template;

      switch(type) {
        case 'bool':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-toggle-button');
          break;
        case 'int':
        case 'uint':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-slider');
          break;
        case 'double':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-slider');
          break;
        case 'QColor':
          template = _getInputPath(directiveNameAction, directiveNameAction + '-color-picker');
          break;
        case 'QString':
          if(allowedValues) {
            template = _getInputPath(directiveNameInput, directiveNameInput + '-select');
          } else if(inputType) {
            template = _getInputPath(directiveNameInput, directiveNameInput + app.inputTypes[inputType])
          } else {
            template = _getInputPath(directiveNameInput, directiveNameInput + '-text');
          }
          break;
        default:
          template = _getInputPath(directiveNameAction, 'template-not-available');
      }

      return template;
    }

    /*
     * Private method: _getInputTemplate(guhType)
     */
    function _getInputTemplate(guhType) {
      var allowedValues = (guhType.allowedValues === undefined) ? null : guhType.allowedValues;
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      var name = (guhType.name === undefined) ? null : guhType.name;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var directiveName = 'input';
      var template;

      switch(type) {
        case 'bool':
          template = _getInputPath(directiveName, directiveName + '-checkbox');
          break;
        case 'int':
        case 'uint':
          template = _getInputPath(directiveName, directiveName + '-number-integer');
          break;
        case 'double':
          template = _getInputPath(directiveName, directiveName + '-number-decimal');
          break;
        case 'QColor':
          template = _getInputPath(directiveName, directiveName + '-color');
          break;
        case 'QString':
          if(allowedValues) {
            template = _getInputPath(directiveName, directiveName + '-select');
          } else if(inputType) {
            template = _getInputPath(directiveName, directiveName + app.inputTypes[inputType])
          } else {
            template = _getInputPath(directiveName, directiveName + '-text');
          }
          break;
        default:
          template = _getInputPath(directiveName, 'template-not-available');
      }

      return template;
    }

    /*
     * Private method: _getValue(guhType)
     */
    function _getValue(guhType) {
      var type = (guhType.type === undefined) ? null : guhType.type;
      var value;

      switch(type) {
        case 'bool':
          value = guhType.defaultValue || false;
          break;
        case 'int':
        case 'uint':
          value = guhType.defaultValue || 0;
          break;
        case 'double':
          value = guhType.defaultValue || 0.0;
          break;
        case 'QColor':
          value = guhType.defaultValue || '0,0,0';
          break;
        case 'QString':
          value = guhType.defaultValue || '';
          break;
        default:
          value = guhType.defaultValue || undefined;
          break;
      }

      return value;
    }


    /*
     * Public method: addUiData(directiveName, guhType)
     * guhType can be from type ParamType or StateType
     */
    function addUiData(directiveName, guhType) {
      // var templateUrl = '';

      // switch(type) {
      //   case 'bool':
      //     if(angular.isString(name) && (name === 'power' || name === 'state')) {
      //       templateUrl = _getInputPath(directiveName, directiveName + '-toggle-button');
      //     } else {
      //       templateUrl = _getInputPath(directiveName, directiveName + '-checkbox');
      //     }
      //     value = guhType.defaultValue || false;
      //     break;
      //   case 'int':
      //   case 'uint':
      //     if(directiveName === 'param') {
      //       templateUrl = _getInputPath(directiveName, directiveName + '-slider');
      //     } else {
      //       templateUrl = _getInputPath(directiveName, directiveName + '-number-integer');
      //     }
      //     value = guhType.defaultValue || 0;
      //     break;
      //   case 'double':
      //     templateUrl = _getInputPath(directiveName, directiveName + '-number-decimal');
      //     value = guhType.defaultValue || 0.0;
      //     break;
      //   case 'QColor':
      //     templateUrl = _getInputPath(directiveName, directiveName + '-color-picker');
      //     value = guhType.defaultValue || '0,0,0';
      //     break;
      //   case 'QString':
      //     if(allowedValues) {
      //       templateUrl = _getInputPath(directiveName, directiveName + '-select');
      //     } else if(inputType) {
      //       templateUrl = _getInputPath(directiveName, directiveName + app.inputTypes[inputType])
      //     } else {
      //       templateUrl = _getInputPath(directiveName, directiveName + '-text');
      //     }
      //     value = guhType.defaultValue || '';
      //     // break;
      // }

      // guhType.templateUrl = checkTemplateUrl(templateUrl);

      guhType.operator = app.valueOperator.is.operators[0];
      guhType.actionTemplateUrl = _getActionTemplate(guhType);
      guhType.inputTemplateUrl = _getInputTemplate(guhType);
      guhType.value = _getValue(guhType);

      return guhType;
    }

    /*
     * Public method: checkTemplateUrl(templateUrl)
     */
    function checkTemplateUrl(templateUrl) {
      var pathElements = templateUrl.split('/');
      var file = pathElements.pop();
      var path = pathElements.join('/') + '/';

      if(templateUrl !== undefined && templateUrl !== '') {
        var fileExists = $q.when(File.checkFile(path, file))
          .then(function(fileExists) {
            if(fileExists) {
              // $log.log('Template available', templateUrl);
              return templateUrl;
            } else {
              // $log.warn('Template NOT available', templateUrl);
              return path + 'template-not-available.html'; 
            }
          });

        return fileExists;
      } else {
        return path + 'template-not-defined.html';
      }
    }

    /*
     * Public method: getTemplateurl(directiveName, filename)
     */
    function getTemplateUrl(directiveName, filename) {
      var templateUrl = _getInputPath(directiveName, filename);
      return checkTemplateUrl(templateUrl);
    }

    /*
     * Public method: getUnit(name)
     */
    function getUnit(name) {
      // Get value inside Brackets []
      var regExp = /\[([^)]+)\]/;
      var searchUnit = regExp.exec(name);

      if(angular.isArray(searchUnit) && searchUnit.length === 2) {
        return searchUnit[1];
      } else {
        return '';
      }
    }

    /*
     * Public method: setBasePath()
     */
    function setBasePath() {      
      DS
        .defaults
        .basePath = app.apiUrl;
    }

  }

}());