var fs          = require('fs');
var path        = require('path');
var gulp        = require('gulp');
var gulpSrc     = require('gulp-src-ordered-globs');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var stylus      = require('gulp-stylus');
var concat      = require('gulp-concat');
var beep        = require('beepbeep');
var production  = require('../config').production;
var config      = require('../config').examples;
var configJS    = require('../config').examplesJS;

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// Copy non-JS/CSS files directly
var examples = function() {
  return gulpSrc(config.src.concat(config.jssrc), { base: config.dir })
    .pipe(gulp.dest(config.dest));
};

/*
 * Stylus --> CSS
 */
var examplesCss = function() {
  var folders = getFolders(config.dir);

  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(config.dir, folder, '/**/*.styl'))
      .pipe(stylus({compress: false}))
      .pipe(concat('example.css'))
      .pipe(gulp.dest(path.join(config.dest, folder)));
  });
  return Promise.all(tasks);
};

/*
 * JS (Browserify)
 */
var errorHandler = function (error) {
  console.log(error.toString());
  beep();
  this.emit('end');
};

var examplesJs = function(){
  var tasks = configJS.src.map(function(src) {
    var folderRegEx = new RegExp(escapeRegExp(configJS.dir) + "(.*)\/", "g");
    var folder = folderRegEx.exec(src)[1];
    var filename = /[^\/]*$/.exec(src)[0];
    var b = browserify({
      debug: !production
    })
    .transform(babelify);
    b.add(src);
    return b.bundle()
      .on('error', errorHandler)
      .pipe(source(filename))
      .pipe(gulp.dest(path.join(configJS.dest, folder)));
  });
  return Promise.all(tasks);
};

exports.examples = examples;
exports.examplesCss = examplesCss;
exports.examplesJs = examplesJs;
