var gulp       = require('gulp');
var config     = require('../config').geniblocksCSS;
var stylus     = require('gulp-stylus');
var concat     = require('gulp-concat');

gulp.task('geniblocks-css', function() {
  gulp.src(config.src)
    .pipe(stylus({ compress: false}))
    .pipe(concat('geniblocks.css'))
    .pipe(gulp.dest(config.public));

  gulp.src(config.src)
    .pipe(stylus({ compress: true}))
    .pipe(concat('geniblocks.min.css'))
    .pipe(gulp.dest(config.public));
});
