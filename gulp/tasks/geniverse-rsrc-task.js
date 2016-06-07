var gulp              = require('gulp');
var config            = require('../config').geniverseRsrc;

// Copy files directly simple
gulp.task('geniverse-rsrc', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
