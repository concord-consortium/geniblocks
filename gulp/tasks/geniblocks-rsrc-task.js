var gulp              = require('gulp');
var blocksConfig      = require('../config').geniblocksRsrc;
var gvConfig          = require('../config').geniverseRsrc;

// Copy files directly simple
exports.geniblocksRsrc = function geniblocksRsrc() {
  return gulp.src(blocksConfig.src)
    .pipe(gulp.dest(blocksConfig.dest));
};


exports.geniverseRsrc = function geniverseRsrc() {
  gulp.src(gvConfig.index)
    .pipe(gulp.dest(gvConfig.destIndex));

  return gulp.src(gvConfig.src)
    .pipe(gulp.dest(gvConfig.dest));
};

