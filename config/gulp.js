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

  // Development folder (source)
  dev: {
    root: dev
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
    }
  },

  sourcemapFiles: [
    'assets/libs/angular/angular.min.js.map',
    'assets/libs/angular-animate/angular-animate.min.js.map',
    'assets/libs/angular-sanitize/angular-sanitize.min.js.map'
  ],

  appFiles: {
    html: 'index.html',
    js: [
      // Components: Filters

      // Components: Services

      // Components: Directives

      // App: General
      'app/app-module.js',
      'app/app-routes.js',
      'app/app-controller.js',

      // App: Dashboard

      // App: Devices

      // App: Rules
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
      'assets/libs/ionic/js/ionic.bundle.min.js',

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
    }
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
      proxy: 'localhost:3000'
    },
    concat: {},
    inject: {
      getConfig: function(src, tag, ext) {
        var config = {
          starttag: '<!-- inject:' + tag + ':' + ext + ' -->',
          read: false,
          addRootSlash: false
        };
        var injectParameters = {
          src: src,
          config: config
        };

        return injectParameters;
      }
    },
    jshint: {

    },
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
    }
  }

};