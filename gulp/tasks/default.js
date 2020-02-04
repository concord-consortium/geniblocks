var gulp = require('gulp');
var config = require('../config');
// cwd is required for new/deleted files to be detected (http://stackoverflow.com/a/34346524)
var gazeOptions = { cwd: './' };
var jsTasks = require('./geniblocks-js-task');
var cssTasks = require('./geniblocks-css-task');
var rsrsTasks = require('./geniblocks-rsrc-task');
var examplesTasks = require('./examples-task');
var vendorTasks = require('./vendor-task');

var watch = function() {
  gulp.watch(config.geniblocksJS.watch, gazeOptions, jsTasks.geniJs);
  gulp.watch(config.geniblocksCSS.watch, gazeOptions, cssTasks.geniblocksCss);
  gulp.watch(config.geniverseRsrc.watch, gazeOptions, rsrsTasks.geniverseRsrc);
  gulp.watch(config.examples.watch, gazeOptions, gulp.parallel(examplesTasks.examples, examplesTasks.examplesCss));
  gulp.watch(config.examplesJS.watch, gazeOptions, examplesTasks.examplesJs);
};

var watchFast = function() {
  gulp.watch(config.geniblocksJS.watch, gazeOptions,  jsTasks.geniJsDev);
  gulp.watch(config.geniblocksCSS.watch, gazeOptions, cssTasks.geniblocksCss);
  // while potentially desirable, resource task is too slow/problematic for 'watch-fast'
  //gulp.watch(config.geniverseRsrc.watch, gazeOptions, ['geniverse-rsrc']);
};


var buildAll = gulp.parallel(jsTasks.geniJs, cssTasks.geniblocksCss, rsrsTasks.geniverseRsrc,
                        vendorTasks.vendor, examplesTasks.examples, examplesTasks.examplesCss, examplesTasks.examplesJs);

exports.buildAll = buildAll;

// use `gulp build` to include examples, GeniBlocks standalone, and minified build products
exports.build = gulp.parallel(buildAll, watch);

// use `gulp` for most GV2 development. It will run faster than `gulp build`
exports.default = gulp.parallel(vendorTasks.vendor, rsrsTasks.geniverseRsrc, jsTasks.geniJsDev,
  cssTasks.geniblocksCss, watchFast);
