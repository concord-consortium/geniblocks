var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.geniblocksJS.watch,   ['geniblocks-js-dev']);
    gulp.watch(config.geniblocksCSS.watch,  ['geniblocks-css']);
    gulp.watch(config.geniblocksRsrc.watch, ['geniblocks-rsrc']);
    gulp.watch(config.geniverseJS.watch,    ['geniverse-js-dev']);
    gulp.watch(config.geniverseRsrc.watch,  ['geniverse-rsrc']);
    gulp.watch(config.examples.watch,       ['examples', 'examples-css']);
    gulp.watch(config.examplesJS.watch,     ['examples-js']);
});

gulp.task('build-all', ['geniblocks-js', 'geniblocks-css', 'geniblocks-rsrc',
                        'geniverse-js-dev', 'geniverse-rsrc',
                        'vendor', 'examples', 'examples-css', 'examples-js']);

gulp.task('default', ['build-all', 'watch']);
