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

  modelsHelper.$inject = ['$log', '$cordovaFile', 'DS', 'DSParamType', 'File', 'app'];

  function modelsHelper($log, $cordovaFile, DS, DSParamType, File, app) {

    var modelsHelper = {
      addUiData: addUiData,
      getTemplateUrl: getTemplateUrl,
      setBasePath: setBasePath
    };

    return modelsHelper;


    /*
     * Private method: _getInputPath(filename)
     */
    function _getInputPath(filename) {
      return app.basePaths.ui + 'input/templates/' + filename + app.fileExtensions.html;
    }

    /*
     * Private method: _checkTemplateUrl(templateUrl)
     */
    function _checkTemplateUrl(templateUrl) {
      var pathElements = templateUrl.split('/');
      var file = pathElements.pop();
      var path = pathElements.join('/') + '/';

      if(templateUrl !== undefined && templateUrl !== '') {
        if(File.checkFile(path, file)) {
          return templateUrl;
        } else {
          return path + 'input-not-available.html'; 
        }
      } else {
        return path + 'input-not-defined.html';
      }
    }


    /*
     * Public method: addUiData(paramType)
     */
    function addUiData(paramType) {
      var templateUrl = '';

      var allowedValues = (paramType.allowedValues === undefined) ? null : paramType.allowedValues;
      var inputType = (paramType.inputType === undefined) ? null : paramType.inputType;
      var name = (paramType.name === undefined) ? null : paramType.name;
      var type = (paramType.type === undefined) ? null : paramType.type;
      var value = null;

      switch(type) {
        case 'bool':
          if(angular.isString(name) && name === 'power') {
            templateUrl = _getInputPath('input-toggle-button');
          } else {
            templateUrl = _getInputPath('input-checkbox');
          }
          value = paramType.defaultValue || false;
          break;
        case 'int':
        case 'uint':
          templateUrl = _getInputPath('input-number-integer');
          value = paramType.defaultValue || 0;
          break;
        case 'double':
          templateUrl = _getInputPath('input-number-decimal');
          value = paramType.defaultValue || 0.0;
          break;
        case 'QString':
          if(allowedValues) {
            templateUrl = _getInputPath('input-select');
          } else if(inputType) {
            $log.log('inputType', inputType, app.inputTypes[inputType]);
            templateUrl = _getInputPath(app.inputTypes[inputType])
          } else {
            templateUrl = _getInputPath('input-text');
          }
          value = paramType.defaultValue || '';
      }

      paramType.templateUrl = _checkTemplateUrl(templateUrl);
      paramType.value = value;

      return paramType;
    }

    /*
     * Public method: getTemplateurl(filename)
     */
    function getTemplateUrl(filename) {
      var templateUrl = _getInputPath(filename);
      return _checkTemplateUrl(templateUrl);
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