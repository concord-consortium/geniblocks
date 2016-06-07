var gulp   = require('gulp');
var examples = require('../config').vendorExamples;
var geniverse = require('../config').vendorGeniverse;

// copy files directly simple
gulp.task('vendor', function() {
  gulp.src(examples.src)
    .pipe(gulp.dest(examples.dest));

  return gulp.src(geniverse.src)
    .pipe(gulp.dest(geniverse.dest));
});
