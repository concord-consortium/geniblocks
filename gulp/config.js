var geniblocks = './packages/geniblocks/src',
    geniverse = './packages/geniverse-react/src',
    bower = './bower_components',
    node = './node_modules',
    examples = './examples',
    gv2 = './gv2',
    publicExamples  = './public/examples',
    publicGeniverse  = './public/geniverse';

module.exports = {
  geniblocksJS: {
    watch: [geniblocks + '/code/**/*.*'],
    src: geniblocks + '/code/geniblocks.js',
    public: publicExamples + '/js/'
  },
  geniblocksCSS: {
    watch: geniblocks + '/stylus/**/*.styl',
    src: [node + '/react-simpletabs/lib/react-simpletabs.css',
          geniblocks + '/stylus/**/*.styl'],
    public: publicExamples + '/css/'
  },
  geniblocksRsrc: {
    watch: geniblocks + '/resources/**/*.*',
    src: geniblocks + '/resources/**/*.*',
    dest: publicExamples + '/resources'
  },
  geniverseJS: {
    watch: [geniverse + '/code/**/*.*'],
    src: geniverse + '/code/gv.js',
    public: publicGeniverse + '/js/'
  },
  geniverseRsrc: {
    watch: geniverse + '/resources/**/*.*',
    src: geniverse + '/resources/**/*.*',
    dest: publicGeniverse
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
  vendorExamples: {
    src: [ bower + '/*/*.js', bower + '/*/*/*.js', bower + '/*/*/*.css' ],
    dest: publicExamples + '/js/lib/'
  },
  vendorGeniverse: {
    src: [ bower + '/biologica.js/dist/*.js' ],
    dest: publicGeniverse + '/js/lib/'
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
