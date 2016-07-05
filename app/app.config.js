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


var controller = require('./app.controller.js');
var templateUrl = require('./app.html');

// console.log('controller', controller);
// console.log('templateUrl', templateUrl);


var config = function($urlRouterProvider, $stateProvider) {
  
  /*
   * URLs
   */

  $urlRouterProvider
    .otherwise('/intro');


  /*
   * States
   */

  $stateProvider.state('intro', {
    url: '/intro',
    template: '<guh-intro></guh-intro>'
  });

  $stateProvider.state('app', {
    abstract: true,
    controller: controller,
    controllerAs: 'app',
    templateUrl: templateUrl
  });

    $stateProvider.state('app.things', {
      url: '/things',
      views: {
        'things': {
          template: '<guh-things></guh-things>'
        }
      }
    });

    $stateProvider.state('app.rules', {
      url: '/rules',
      views: {
        'rules': {
          template: '<guh-rules></guh-rules>'
        }
      }
    });

    $stateProvider.state('app.settings', {
      url: '/settings',
      views: {
        'settings': {
          template: '<guh-settings></guh-settings>'
        }
      }
    });

};

config.$inject = ['$urlRouterProvider', '$stateProvider'];


module.exports = config;
