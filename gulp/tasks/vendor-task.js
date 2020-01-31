var gulp   = require('gulp');
var examplesConfig = require('../config').vendorExamples;
var gvConfig       = require('../config').vendorGeniverse;

// copy files directly simple
exports.vendor = function vendor() {
  gulp.src(gvConfig.src)
    .pipe(gulp.dest(gvConfig.dest));

  return gulp.src(examplesConfig.src)
    .pipe(gulp.dest(examplesConfig.dest));
};
