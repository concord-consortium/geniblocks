var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var exposify    = require('exposify');
var source      = require('vinyl-source-stream');
var production  = require('../config').production;
var config      = require('../config').geniverseJS;
var beep        = require('beepbeep');
var uglify      = require('gulp-uglify');
var streamify   = require('gulp-streamify');

var errorHandler = function (error) {
  console.log(error.toString());
  beep();
  this.emit('end');
};

gulp.task('geniverse-js-dev', function(){
  var b = browserify({
    debug: !production
  })
  .transform(babelify);
  b.add(config.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniverse.js'))
    .pipe(gulp.dest(config.public));
});

gulp.task('geniverse-js-min', function(){
  var b = browserify({
    debug: !production
  })
  .transform(babelify);
  b.add(config.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniverse.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(config.public));
});

gulp.task('geniverse-js', ['geniverse-js-dev', 'geniverse-js-min']);
