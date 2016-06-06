var geniblocks = './packages/geniblocks/src',
    bower = './bower_components',
    node = './node_modules',
    examples = './examples',
    gv2 = './gv2',
    publicExamples  = './public/examples',
    dist = './dist';

module.exports = {
  geniblocksJS: {
    watch: [geniblocks + '/code/**/*.*'],
    src: geniblocks + '/code/geniblocks.js',
    public: publicExamples + '/js/',
    dist: dist
  },
  geniblocksCSS: {
    watch: geniblocks + '/stylus/**/*.styl',
    src: [node + '/react-simpletabs/lib/react-simpletabs.css',
          geniblocks + '/stylus/**/*.styl'],
    public: publicExamples + '/css/',
    dist: dist
  },
  geniblocksRsrc: {
    watch: geniblocks + '/resources/**/*.*',
    src: geniblocks + '/resources/**/*.*',
    dest: publicExamples + '/resources'
  },
  examples: {
    watch: [examples + '/**/*.*', '!' + examples + '/**/*.js', '!' + examples + '/**/*.styl'],
    src: [examples + '/**/*.*', '!' + examples + '/**/*.js', '!' + examples + '/**/*.styl'],
    jssrc: [examples + '/experiments/**/*.js'],
    dir: examples,
    dest: publicExamples
  },
  examplesJS: {
    watch: examples + '/**/*.js',
    src: [examples + '/gv2-prototype/gv2.js'],
    dir: examples,
    dest: publicExamples
  },
  vendor: {
    src: [ bower + '/*/*.js', bower + '/*/*/*.js', bower + '/*/*/*.css' ],
    dest: publicExamples + '/js/lib/'
  },
  trim: {
    examples: {
      src: [examples + '/**/*.html', examples + '/**/*.json'],
      dest: examples
    },
    code: {
      src: geniblocks + '/code/**/*.*',
      dest: geniblocks + '/code/'
    },
    stylus: {
      src: geniblocks + '/stylus/**/*.*',
      dest: geniblocks + '/stylus/'
    }
  },
  deploy: {
    src: publicExamples + '/**/*'
  }
};
