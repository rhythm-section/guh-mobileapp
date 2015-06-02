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
    .module('guh.utils')
    .factory('File', FileFactory);

  FileFactory.$inject = ['$log', '$q', '$cordovaSplashscreen', '$cordovaFile', 'app'];

  function FileFactory($log, $q, $cordovaSplashscreen, $cordovaFile, app) {
    
    var File = {
      checkFile: checkFile
    };

    return File;


    /*
     * Public method: checkFile(path, file)
     */
    function checkFile(path, file) {
      // $log.log('checkFile', path, file);

      if(ionic.Platform.isWebView()) {
        if(app.isCordovaApp) {

          // iOS, Android
          var checkFile = $cordovaFile
            .checkFile(cordova.file.applicationDirectory + '/www/' + path, file)
            .then(function() {
              return true;
            })
            .catch(function(error) {
              // Error codes: http://ngcordova.com/docs/plugins/file/
              if(error.code === 1) {
                // Error: File does not exist
                return false;
              } else {
                $log.error('guh.factory.File', error);
                return false;
              }
            });

          return checkFile;

        } else {

          // Ionic View App
          $log.warn('Can\'t check if file exists inside Ionic View app');
          return true;

        }
      } else {

        // Browser
        var request = new XMLHttpRequest();

        request.open('HEAD', path + file, false);
        request.send();

        if(request.status === 200) {
          return true;
        } else {
          return false;
        }

      }
    }
  }

}());