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
      getUnit: getUnit,
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
     * Public method: addUiData(guhType)
     */
    function addUiData(guhType) {
      var templateUrl = '';

      var allowedValues = (guhType.allowedValues === undefined) ? null : guhType.allowedValues;
      var inputType = (guhType.inputType === undefined) ? null : guhType.inputType;
      var name = (guhType.name === undefined) ? null : guhType.name;
      var type = (guhType.type === undefined) ? null : guhType.type;
      var value = null;

      switch(type) {
        case 'bool':
          if(angular.isString(name) && name === 'power') {
            templateUrl = _getInputPath('input-toggle-button');
          } else {
            templateUrl = _getInputPath('input-checkbox');
          }
          value = guhType.defaultValue || false;
          break;
        case 'int':
        case 'uint':
          templateUrl = _getInputPath('input-number-integer');
          value = guhType.defaultValue || 0;
          break;
        case 'double':
          templateUrl = _getInputPath('input-number-decimal');
          value = guhType.defaultValue || 0.0;
          break;
        case 'QString':
          if(allowedValues) {
            templateUrl = _getInputPath('input-select');
          } else if(inputType) {
            templateUrl = _getInputPath(app.inputTypes[inputType])
          } else {
            templateUrl = _getInputPath('input-text');
          }
          value = guhType.defaultValue || '';
      }

      guhType.operator = app.valueOperator.is.operators[0];
      guhType.templateUrl = _checkTemplateUrl(templateUrl);
      guhType.value = value;

      return guhType;
    }

    /*
     * Public method: getTemplateurl(filename)
     */
    function getTemplateUrl(filename) {
      var templateUrl = _getInputPath(filename);
      return _checkTemplateUrl(templateUrl);
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