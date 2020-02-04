var gulp        = require('gulp');
var ghPages     = require('gulp-gh-pages');
var del         = require('del');
var config      = require('../config').deploy;
var defaultTasks = require('./default');

var clean = function clean() {
    return del([config.src], { force: true });
};

var cleanAndBuild = gulp.series(clean, defaultTasks.buildAll);

exports.clean = clean;
exports.cleanAndBuild = cleanAndBuild;

exports.deploy = gulp.series(cleanAndBuild, function() {
  return gulp.src(config.src)
    .pipe(ghPages());
});
