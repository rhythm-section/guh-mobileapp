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

/*
 * Configuration
 */

// Require needed node modules
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: [
    'browser-sync',
    'del',
    'gulp-*',
    'main-bower-files',
    'run-sequence',
    'streamqueue',
    'yargs'
  ]
});

// Require config module
var config = require('./config/gulp');

// Parsing arguments passed to gulp command
var args = plugins
  .yargs
  .alias('b', 'build')
  .alias('e', 'emulate')
  .alias('r', 'run')
  .alias('s', 'serve')
  .default('build', false)
  .default('port', 3000)
  .argv;

// Helper variables (depending on passed gulp arguments)
var production = !!(args.build || args.emulate || args.run);
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var defaultPlatform = 'ios';
var dest = config.tmp;
var browserSync = plugins.browserSync.create();

// Change destination folder depending on mode (development, production)
if(production) {
  dest = config.build;
}

// If emulate or run are used without specifing a platform, use iOS as default
if(emulate === true) {
  emulate = defaultPlatform;
  plugins.util.log(plugins.util.colors.cyan('Default platform (' + emulate + ') for "ionic emulate" is used.'));
}

if(run === true) {
  run = defaultPlatform;
  plugins.util.log(plugins.util.colors.cyan('Default platform (' + run + ') for "ionic run" is used.'));
}

/*
 * Helper methods
 */

var onError = function (error) {
  if(production) {
    throw error;
  } else {
    plugins.util.beep();
    plugins.util.log(plugins.util.colors.red(error));
  }
};


/*
 * Tasks
 */

/* Clean
 * Remove dest folder. */
gulp.task('clean', function(done) {
  plugins.del([config.tmp.root, config.build.root], done);
});

/* Sourcemaps
 * Copy angular sourcemap files */
gulp.task('sourcemaps', function(done) {
  gulp
    .src(config.sourcemapFiles, { cwd: dest.root })
    .pipe(gulp.dest(dest.assets.ionicJS))
    .on('end', done);
});

/* Bower
 * Copy bower dependencies to dest folder. */
gulp.task('bower', function(done) {
  gulp
    .src(plugins.mainBowerFiles({ checkExistence: true }), { base: config.bower.root })
    .pipe(gulp.dest(dest.assets.libs))
    .on('end', done);
});

/* Markup
 * Copy HTML files. */
gulp.task('markup', function() {
  return gulp
    .src(config.appFiles.html, { cwd: config.dev.root })
    .pipe(gulp.dest(dest.root))
    .pipe(browserSync.reload({stream: true}));
});

/* Styles
 * Process SCSS files, minify CSS files and revisioning. Add sourcemaps to processed and minified styles. */
gulp.task('styles', function() {
  // Revisions for cached files
  var revAll = new plugins.revAll(config.pluginSettings.revAll);

  return gulp
    .src(config.appFiles.scss, { cwd: config.dev.root })

    // Better error handling when using watch tasks (not for production builds)
    .pipe(plugins.plumber({ errorHandler: onError }))

    // Create sourcemaps (only for production builds)
    .pipe(plugins.if(production, plugins.sourcemaps.init()))

      // Preprocess SCSS
      .pipe(plugins.sass(config.pluginSettings.sass))
      .pipe(plugins.size(config.pluginSettings.size))

      // Minify CSS (only for production builds)
      .pipe(plugins.if(production, plugins.minifyCss(config.pluginSettings.minifyCss)))
      .pipe(plugins.if(production, plugins.size(config.pluginSettings.size)))
      .pipe(plugins.if(production, plugins.rename(config.pluginSettings.rename)))

    .pipe(plugins.if(production, plugins.sourcemaps.write('/')))
    .pipe(plugins.if(production, revAll.revision()))
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(dest.assets.css))
    .pipe(browserSync.reload({stream: true}));
});

/* Scripts
 * Concatenate, minify and revisioning JS files. Add sourcemaps to minified scripts. */
gulp.task('scripts', function() {
  // Revisions for cached files
  var revAll = new plugins.revAll(config.pluginSettings.revAll);

  return gulp
    .src(config.appFiles.js, { cwd: config.dev.root })

    // Better error handling when using watch tasks (not for production builds)
    .pipe(plugins.plumber({ errorHandler: onError }))

    // Show jshint information
    .pipe(plugins.jshint(config.configFiles.jshint))
    .pipe(plugins.jshint.reporter('jshint-stylish'))

    // Create sourcemaps (only for production builds)
    .pipe(plugins.if(production, plugins.sourcemaps.init()))
      
      // Concatenate JS
      .pipe(plugins.if(production, plugins.concat('app.js', config.pluginSettings.concat)))
      .pipe(plugins.if(production, plugins.size(config.pluginSettings.size)))

      // Minify JS (only for production builds)
      .pipe(plugins.if(production, plugins.uglify()))
      .pipe(plugins.if(production, plugins.size(config.pluginSettings.size)))
      .pipe(plugins.if(production, plugins.rename(config.pluginSettings.rename)))

    .pipe(plugins.if(production, plugins.sourcemaps.write('/')))
    .pipe(plugins.if(production, revAll.revision()))
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(dest.app))
    .pipe(browserSync.reload({stream: true}));
});

/* Inject server
 * Inject server dependency */
gulp.task('injectServer', function(done) {
  // Server html config
  gulp
    .src(config.appFiles.index, { cwd: dest.root })
    .pipe(
      plugins
        .inject(gulp.src('../config/server.html', { cwd: dest.root }), {
          starttag: '<!-- inject:server:html -->',
          transform: function (filePath, file) {
            // return file contents as string 
            return file.contents.toString('utf8')
          }
        }))
    .pipe(gulp.dest(dest.root))
    .on('end', done);
});

/* Inject
 * Inject all dependencies into index.html */
gulp.task('inject', ['markup'], function(done) {
  // Make stream to preserve order of lib scripts
  var libScriptsStream = gulp.src(config.libFiles.js, { cwd: dest.root, read: false });
  var libScriptsStreamQueue = plugins.streamqueue(config.pluginSettings.streamQueue, libScriptsStream);
  var libScriptsConfig = config.pluginSettings.inject.getConfig(libScriptsStreamQueue, 'libs', 'js');

  // Lib css config
  var libStylesConfig = config.pluginSettings.inject.getConfig(config.libFiles.css, 'libs', 'css');

  // App css config
  var appStylesConfig = config.pluginSettings.inject.getConfig('assets/css/app*.css', 'app', 'css');

  if(production) {
    // App js config
    var appScriptsConfig = config.pluginSettings.inject.getConfig('app/app.min-*.js', 'app', 'js');

    gulp.src(config.appFiles.index, { cwd: dest.root })

      // Add lib files
      .pipe(plugins.inject(gulp.src(libStylesConfig.src, { cwd: dest.root, read: false }), libStylesConfig.config))
      .pipe(plugins.inject(libScriptsConfig.src, libScriptsConfig.config))

      // Add app files
      .pipe(plugins.inject(gulp.src(appStylesConfig.src, { cwd: dest.root, read: false }), appStylesConfig.config))
      .pipe(plugins.inject(gulp.src(appScriptsConfig.src, { cwd: dest.root, read: false }), appScriptsConfig.config))

      .pipe(gulp.dest(dest.root))
      .on('end', done);
  } else {
    var appScriptsStream = gulp.src(config.appFiles.js, { cwd: dest.root + '/**', read: false });
    var appScriptsStreamQueue = plugins.streamqueue(config.pluginSettings.streamQueue, appScriptsStream);
    var appScriptsConfig = config.pluginSettings.inject.getConfig(appScriptsStreamQueue, 'app', 'js');

    gulp.src(config.appFiles.index, { cwd: dest.root })

      // Add lib files
      .pipe(plugins.inject(gulp.src(libStylesConfig.src, { cwd: dest.root, read: false }), libStylesConfig.config))
      .pipe(plugins.inject(libScriptsConfig.src, libScriptsConfig.config))

      // Add app files
      .pipe(plugins.inject(gulp.src(appStylesConfig.src, { cwd: dest.root, read: false }), appStylesConfig.config))
      .pipe(plugins.inject(appScriptsConfig.src, appScriptsConfig.config))

      .pipe(gulp.dest(dest.root))
      .on('end', done);
  }
});

/* No-op
 * Empty function */
gulp.task('noop', function(done) {
  plugins
    .util
    .noop()
    .on('end', done);
});

/* BrowserSync
 * Start development server and watch changed files */
gulp.task('server', function(done) {
  browserSync
    .init(config.pluginSettings.browserSync);

  // Watch for file changes
  gulp.watch(['./dev/index.html', './dev/app/**/*.html'], ['inject']);
  gulp.watch('./dev/app/**/*.js', ['scripts']);
  gulp.watch('./dev/app/**/*.scss', ['styles']);
});

/* Default
 * Determine order of tasks */
gulp.task('default', function(done) {
  plugins.runSequence(
      'clean',
      [
        'bower',
        'styles',
        'scripts'
      ],
      'sourcemaps',
      production ? 'noop' : 'injectServer',
      'inject',
      production ? 'noop' : 'server',
      done
    );
});


