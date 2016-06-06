var geniblocks = './packages/geniblocks/src',
    bower = './bower_components',
    node = './node_modules',
    examples = './examples',
    gv2 = './gv2',
    pub  = './public',
    dist = './dist';

module.exports = {
  geniblocksJS: {
    watch: [geniblocks + '/code/**/*.*'],
    src: geniblocks + '/code/geniblocks.js',
    public: pub + '/js/',
    dist: dist
  },
  geniblocksCSS: {
    watch: geniblocks + '/stylus/**/*.styl',
    src: [node + '/react-simpletabs/lib/react-simpletabs.css',
          geniblocks + '/stylus/**/*.styl'],
    public: pub + '/css/',
    dist: dist
  },
  geniblocksRsrc: {
    watch: geniblocks + '/resources/**/*.*',
    src: geniblocks + '/resources/**/*.*',
    dest: pub + '/resources'
  },
  examples: {
    watch: [examples + '/**/*.*', '!' + examples + '/**/*.js'],
    src: [examples + '/**/*.*', '!' + examples + '/**/*.js'],
    dest: pub
  },
  examplesJS: {
    watch: examples + '/**/*.js',
    src: examples + '/**/*.js',
    dest: pub
  },
  gv2: {
    watch: [gv2 + '/**/*.*', '!' + gv2 + '/**/*.js', '!' + gv2 + '/**/*.styl'],
    src: [gv2 + '/**/*.*', '!' + gv2 + '/**/*.js', '!' + gv2 + '/**/*.styl'],
    dest: pub + '/gv2'
  },
  gv2CSS: {
    watch: gv2 + '/**/*.styl',
    src: gv2 + '/**/*.styl',
    dest: pub + '/gv2'
  },
  gv2JS: {
    watch: gv2 + '/**/*.js',
    src: gv2 + '/gv2.js',
    dest: pub + '/gv2'
  },
  vendor: {
    src: [ bower + '/*/*.js', bower + '/*/*/*.js', bower + '/*/*/*.css' ],
    dest: pub + '/js/lib/'
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
    src: pub + '/**/*'
  }
};
