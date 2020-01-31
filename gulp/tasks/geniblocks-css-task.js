var gulp       = require('gulp');
var config     = require('../config').geniblocksCSS;
var stylus     = require('gulp-stylus');
var concat     = require('gulp-concat');

exports.geniblocksCss = function geniblocksCss() {
  gulp.src(config.src)
    .pipe(stylus({ compress: false}))
    .pipe(concat('geniblocks.css'))
    .pipe(gulp.dest(config.public))
    .pipe(gulp.dest(config.publicGV))
    .pipe(gulp.dest(config.dist));

  return gulp.src(config.src)
    .pipe(stylus({ compress: true}))
    .pipe(concat('geniblocks.min.css'))
    .pipe(gulp.dest(config.dist));
};
