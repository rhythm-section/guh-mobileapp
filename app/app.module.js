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


'use strict';


// Vendor libs
require('lodash');
require('core-js/es6/promise');
require('ionic-angular/release/js/ionic.js');
require('angular');
require('angular-animate');
require('angular-sanitize');
require('angular-ui-router');
require('ng-cordova/dist/ng-cordova.js');
require('ionic-angular/release/js/ionic-angular.js');
require('js-data/dist/js-data.js');
require('js-data-angular/dist/js-data-angular.js');

// Guh lib
require('guh-libjs/dist/guh-libjs.js');

// require('ionic-angular/scss/ionic.scss');
require('./app.scss');

var config = require('./app.config.js');

// Container components
var introComponent = require('./containers/intro/intro.component.js');
var thingsComponent = require('./containers/things/things.component.js');
var rulesComponent = require('./containers/rules/rules.component.js');
var settingsComponent = require('./containers/settings/settings.component.js');


angular
  .module('guh', [
    // Vendor libs
    'ionic',
    'ngCordova',

    // Guh lib
    'guh.vendor',
    'guh.utils',
    'guh.api',
    'guh.models'
  ])
  .constant('app', {
    'DATA_LOADED': false
  })
  .config(config)
  .run(['$log', '$ionicPlatform', function($log, $ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window) {
        $log.log('window', window);
      }

      if(window.cordova) {
        $log.log('window.cordova', window.cordova);
      }

      if(window.cordova && window.cordova.plugins) {
        $log.log('window.cordova.plugins', window.cordova.plugins);
      }
    });
  }])
  .component('guhIntro', introComponent)
  .component('guhThings', thingsComponent)
  .component('guhRules', rulesComponent)
  .component('guhSettings', settingsComponent);
