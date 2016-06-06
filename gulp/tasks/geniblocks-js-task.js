var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var exposify    = require('exposify');
var source      = require('vinyl-source-stream');
var production  = require('../config').production;
var config      = require('../config').geniblocksJS;
var beep        = require('beepbeep');
var uglify      = require('gulp-uglify');
var streamify   = require('gulp-streamify');

var errorHandler = function (error) {
  console.log(error.toString());
  beep();
  this.emit('end');
};

gulp.task('geniblocks-js-dev', function(){
  var b = browserify({
    debug: !production,
    standalone: 'GeniBlocks'
  })
  .transform(babelify)
  // turn module requires (e.g. require('react')) into global references (e.g. window.React)
  .transform(exposify, {
    expose: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    global: true  // apply to dependencies of dependencies as well
  });
  b.add(config.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniblocks.js'))
    .pipe(gulp.dest(config.public));
});

gulp.task('geniblocks-js-min', function(){
  var b = browserify({
    debug: !production,
    standalone: 'GeniBlocks'
  })
  .transform(babelify)
  // turn module requires (e.g. require('react')) into global references (e.g. window.React)
  .transform(exposify, {
    expose: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    global: true  // apply to dependencies of dependencies as well
  });
  b.add(config.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniblocks.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(config.public));
});

gulp.task('geniblocks-js', ['geniblocks-js-dev', 'geniblocks-js-min']);
