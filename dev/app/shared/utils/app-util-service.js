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
    .module('guh.utils')
    .factory('AppInit', AppInitFactory);

  AppInitFactory.$inject = ['$log', '$q', '$timeout', '$ionicPlatform', '$cordovaSplashscreen', 'app'];

  function AppInitFactory($log, $q, $timeout, $ionicPlatform, $cordovaSplashscreen, app) {
    
    var AppInit = {
      hideSplashscreen: hideSplashscreen
    };

    return AppInit;


    /*
     * Public method: hideSplashscreen()
     */
    function hideSplashscreen() {
      var deferred = $q.defer();
       
      /* jshint -W117: https://jslinterrors.com/a-was-used-before-it-was-defined */
      ionic.Platform.ready(function() {
        $log.log('Ionic is ready.');

        if(app.isCordovaApp) {
          $log.log('This app runs on cordova.');

          $timeout(function() {
            $cordovaSplashscreen.hide();
            deferred.resolve();
          }, 500);
        } else {
          $log.log('This app runs in the browser.');

          deferred.resolve();
        }
      });

      return deferred.promise;
    }
  }

}());