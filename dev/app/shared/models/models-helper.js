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

  modelsHelper.$inject = ['$log', 'DS', 'app'];

  function modelsHelper($log, DS, app) {

    var modelsHelper = {
      addUiData: addUiData,
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
      var basePathElements = templateUrl.split('/');
      basePathElements.pop();
      var basePath = basePathElements.join('/') + '/';

      if(templateUrl !== undefined && templateUrl !== '') {  
        var request = new XMLHttpRequest();

        request.open('HEAD', templateUrl, false);
        request.send();

        if(request.status === 200) {
          return templateUrl;
        } else {
          return basePath + 'input-not-available.html';
        }
      } else {
        return basePath + 'input-not-defined.html';
      }
    }


    /*
     * Public method: addUiData(paramType)
     */
    function addUiData(paramType) {
      var templateUrl = '';

      var allowedValues = (paramType.allowedValues === undefined) ? [] : paramType.allowedValues;
      var inputType = (paramType.inputType === undefined) ? null : paramType.inputType;
      var type = (paramType.type === undefined) ? null : paramType.type;

      switch(type) {
        case 'bool':
          templateUrl = _getInputPath('input-checkbox');
          break;
        case 'int':
        case 'uint':
          templateUrl = _getInputPath('input-number-integer');
          break;
        case 'double':
          templateUrl = _getInputPath('input-number-decimal');
          break;
        case 'QString':
          if(angular.isArray(allowedValues)) {
            templateUrl = _getInputPath('input-select');
          } else if(inputType) {
            $log.log('app.inputTypes', app.inputTypes);
            $log.log('app.inputTypes[inputType]', app.inputTypes[inputType]);
            templateUrl = _getInputPath(app.inputTypes[inputType])
          } else {
            templateUrl = _getInputPath('input-text');
          }
      }

      paramType.templateUrl = _checkTemplateUrl(templateUrl);
      paramType.value = paramType.defaultValue;

      return paramType;
    }

    /*
     * Public method: setBasePath()
     */
    function setBasePath() {
      $log.log('Set models base path', app.apiUrl);
      
      DS
        .defaults
        .basePath = app.apiUrl;
    }

  }

}());