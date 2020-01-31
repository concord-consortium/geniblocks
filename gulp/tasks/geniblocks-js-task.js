var gulp          = require('gulp');
var browserify    = require('browserify');
var babelify      = require('babelify');
var exposify      = require('exposify');
var source        = require('vinyl-source-stream');
var production    = require('../config').production;
var blocksConfig  = require('../config').geniblocksJS;
var gvConfig      = require('../config').geniverseJS;
var beep          = require('beepbeep');
var uglify        = require('gulp-uglify');
var streamify     = require('gulp-streamify');

var errorHandler = function (error) {
  console.log(error.toString());
  beep();
  this.emit('end');
  process.exit(1);
};

// build stand-alone geniverse application, which pulls in
// geniblocks components through `import`
var geniverseJsDev = function() {
  var b = browserify({
    debug: !production
  })
  .transform(babelify);
  b.add(gvConfig.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniverse.js'))
    .pipe(gulp.dest(gvConfig.public));
};

// build separate, standalone geniblocks library, which can be used
// by other projects
var geniblocksJsDev = function(){
  var b = browserify({
    debug: !production,
    standalone: 'GeniBlocks'
  })
  .transform(babelify)
  // turn module requires (e.g. require('react')) into global references (e.g. window.React)
  .transform(exposify, {
    expose: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    global: true  // apply to dependencies of dependencies as well
  });
  b.add(blocksConfig.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniblocks.js'))
    .pipe(gulp.dest(blocksConfig.public))
    .pipe(gulp.dest(blocksConfig.dist));
};

var geniblocksJsMin = function(){
  var b = browserify({
    debug: !production,
    standalone: 'GeniBlocks'
  })
  .transform(babelify);
  b.add(blocksConfig.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('geniblocks.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(blocksConfig.dist));
};

exports.geniJsDev = geniverseJsDev;
exports.geniJs = gulp.parallel(geniverseJsDev, geniblocksJsDev,
                      geniblocksJsMin);
