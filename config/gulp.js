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

// Require needed node modules
var path = require('path');

// Root folders
var config = './config';
var dev = './dev';
var tmp = './.tmp';
var build =  './www';
var bower = './bower_components';
var node = './node_modules';
var dest = tmp;

// Bourbon module for gulp-sass settings
var bourbon = require('node-bourbon');

module.exports = {

  // Configuration folder
  config: {
    root: config
  },

  // Development folder (source)
  dev: {
    root: dev,
    config: dev + '/app/config/'
  },

  // Build folder (destination 1)
  build: {
    index: build + '/index.html',
    root: build,
    app: build + '/app',
    assets: {
      root: build + '/assets',
      css: build + '/assets/css',
      ionicJS: build + '/assets/libs/ionic/js',
      libs: build + '/assets/libs'
    },
    config: build + '/app/config'
  },

  sourcemapFiles: [
    'assets/libs/angular/angular.js',
    'assets/libs/angular/angular.min.js.map',

    'assets/libs/angular-animate/angular-animate.js',
    'assets/libs/angular-animate/angular-animate.min.js.map',

    'assets/libs/angular-sanitize/angular-sanitize.js',
    'assets/libs/angular-sanitize/angular-sanitize.min.js.map'
  ],

  appFiles: {
    appConfigPreprocess: 'app/config/app-config-preprocess.js',
    html: [
      '**/*.html',
      '!index-preprocess.html'
    ],
    index: 'index.html',
    indexPreprocess: 'index-preprocess.html',
    js: [
      // App: General
      'app/app-module.js',
      'app/app-routes.js',
      'app/app-controller.js',

      // Config
      'app/**/config-module.js',
      '!app/**/app-config-preprocess.js',
      'app/**/app-config.js',

      // Shared: Filters

      // Shared: Utils
      'app/**/utils-module.js',
      'app/**/*-util-service.js',

      // Shared: API
      'app/**/api-module.js',
      'app/**/*-api-service.js',

      // Shared: Models
      'app/**/models-module.js',
      'app/**/models-helper.js',
      'app/**/*-model-service.js',

      // Shared: UI
      'app/**/ui-module.js',
      'app/**/*-ui-directive.js',
      'app/**/*-ui-service.js',

      // Components: Dashboard
      'app/**/dashboard-module.js',
      'app/**/dashboard-controller.js',

      // Components: Devices
      'app/**/devices-module.js',
      'app/**/devices-*-controller.js',

      // Components: Rules
      'app/**/rules-module.js',
      'app/**/rules-*-controller.js'
    ],
    scss: 'app/app.scss'
  },

  configFiles: {
    jshint: config + '/jshint.js'
  },

  libFiles: {
    css: [
      // Ionic
      'assets/libs/ionic/css/ionic.min.css'
    ],
    js: [
      // Ionic-Bundle: Concatenation of ionic.js, angular, angular-animate, angular-sanitize, angular-ui-router, ionic-angular
      // 'assets/libs/ionic/js/ionic.bundle.min.js',

      // Cordova plugins with angular services (ngCordova)
      // 'assets/libs/ngCordova/dist/ng-cordova.min.js',

      // Ionic Wizard: https://github.com/arielfaur/ionic-wizard
      'assets/libs/ionic-wizard/dist/ion-wizard.js',

      // Underscore
      'assets/libs/underscore/underscore-min.js',

      // Reconnecting websocket
      'assets/libs/reconnectingWebsocket/reconnecting-websocket.min.js',

      // JS-Data
      'assets/libs/js-data/dist/js-data.min.js',
      'assets/libs/js-data-angular/dist/js-data-angular.min.js',
    ]
  },

  // Temporary folder for development (destination 2)
  // If build and tmp the same, change to "tmp: build"
  tmp: {
    index: tmp + '/index.html',
    root: tmp,
    app: tmp + '/app',
    assets: {
      root: tmp + '/assets',
      css: tmp + '/assets/css',
      ionicJS: tmp + '/assets/libs/ionic/js',
      libs: tmp + '/assets/libs'
    },
    config: tmp + '/app/config'
  },

  // Bower components
  bower: {
    root: bower
  },

  // Node modules
  node: {
    root: node
  },

  pluginSettings: {
    browserSync: {
      open: false,
      port: 1234,
      proxy: 'localhost:3000',
      reloadDelay: 500
    },
    concat: {},
    environment: {
      development: {
        context: {
          NODE_ENV: 'DEVELOPMENT',
          DEBUG: true
        }
      },
      production: {
        context: {
          NODE_ENV: 'PRODUCTION'
        }
      },
      test: {
        context: {
          DEBUG: true,
          NODE_ENV: 'TEST'
        }
      }
    },
    inject: {
      getConfig: function(src, tag, ext) {
        var config = {
          addRootSlash: false,
          relative: true,
          starttag: '<!-- inject:' + tag + ':' + ext + ' -->'
        };
        var injectParameters = {
          src: src,
          config: config
        };

        return injectParameters;
      }
    },
    jshint: {},
    markup: {
      src: dev + '/index.html'
    },
    minifyCss: {},
    rename: {
      suffix: '.min'
    },
    revAll: {
      transformFilename: function (file, hash) {
        var ext = path.extname(file.path);
        return path.basename(file.path, ext) + '-' + hash.substr(0, 8) + ext; // 3410c.filename.ext
      }
    },
    sass: {
      errLogToConsole: true,
      includePaths: bourbon.includePaths
    },
    scripts: {},
    size: {
      showFiles: true
    },
    streamQueue: {
      objectMode: true
    },
    uglify: {
      mangle: false
    }
  }

};