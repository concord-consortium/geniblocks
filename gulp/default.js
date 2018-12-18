var gulp = require('gulp');
var config = require('./config');
var del         = require('del');

// cwd is required for new/deleted files to be detected (http://stackoverflow.com/a/34346524)
var gazeOptions = { cwd: './' };

var HubRegistry = require('gulp-hub');

/* load some files into the registry */
var hub = new HubRegistry(['./tasks/*.js']);

/* tell gulp to use the tasks just loaded */
gulp.registry(hub);

gulp.task('watch', function() {
  gulp.watch(config.geniblocksJS.watch, gazeOptions, gulp.series('geni-js'));
  gulp.watch(config.geniblocksCSS.watch, gazeOptions, gulp.series('geniblocks-css'));
  gulp.watch(config.geniverseRsrc.watch, gazeOptions, gulp.series('geniverse-rsrc'));
  gulp.watch(config.examples.watch, gazeOptions, gulp.parallel('examples', 'examples-css'));
  gulp.watch(config.examplesJS.watch, gazeOptions, gulp.series('examples-js'));
});

gulp.task('watch-fast', function() {
  gulp.watch(config.geniblocksJS.watch, gazeOptions,  gulp.series('geniverse-js-dev'));
  gulp.watch(config.geniblocksCSS.watch, gazeOptions, gulp.series('geniblocks-css'));
  // while potentially desirable, resource task is too slow/problematic for 'watch-fast'
  //gulp.watch(config.geniverseRsrc.watch, gazeOptions, ['geniverse-rsrc']);
});

gulp.task('build-all', gulp.parallel('geni-js', 'geniblocks-css', 'geniverse-rsrc',
                        'vendor', 'examples', 'examples-css', 'examples-js'));

gulp.task('clean', function(done) {
  // del([config.deploy.src], { force: true });
  done();
});

gulp.task('clean-and-build', gulp.series('clean', 'build-all'));

// use `gulp` for most GV2 development. It will run faster than `gulp build`
gulp.task('default', gulp.parallel('vendor', 'geniverse-rsrc', 'geniverse-js-dev', 'geniblocks-css', 'watch-fast'));

// use `gulp build` to include examples, GeniBlocks standalone, and minified build products
gulp.task('build', gulp.series('build-all', 'watch'));

gulp.task('deploy', gulp.series('clean-and-build'), function() {
return gulp.src(config.deploy.src)
  .pipe(ghPages());
});

