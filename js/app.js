(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GeniBlocks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * See https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.q1vckffiw
 * (Kent C. Dodds, "Misunderstanding ES6 Modules, Upgrading Babel, Tears, and a Solution")
 * for description of some of the details involved in mixing ES6 export with require().
 */
var AlleleFiltersView = require('./components/allele-filters').default,
    AlleleView = require('./components/allele').default,
    AnimatedGameteView = require('./components/animated-gamete').default,
    ChangeSexButtons = require('./components/change-sex-buttons').default,
    ChromosomeImageView = require('./components/chromosome-image').default,
    ChromosomeView = require('./components/chromosome').default,
    CircularGlowView = require('./components/circular-glow').default,
    FeedbackView = require('./components/feedback').default,
    FertilizingGameteView = require('./components/fertilizing-gamete').default,
    GametePoolView = require('./components/gamete-pool').default,
    GameteView = require('./components/gamete').default,
    GeneLabelView = require('./components/gene-label').default,
    GenomeTestView = require('./components/genome-test').default,
    GenomeView = require('./components/genome').default,
    OrganismView = require('./components/organism').default,
    OrganismGlowView = require('./components/organism-glow').default,
    PenView = require('./components/pen').default,
    QuestionGlowView = require('./components/question-glow').default,
    QuestionOrganismGlowView = require('./components/question-organism-glow').default,
    StatsView = require('./components/stats').default;

exports.AlleleFiltersView = AlleleFiltersView;
exports.AlleleView = AlleleView;
exports.AnimatedGameteView = AnimatedGameteView;
exports.ChangeSexButtons = ChangeSexButtons;
exports.ChromosomeImageView = ChromosomeImageView;
exports.ChromosomeView = ChromosomeView;
exports.CircularGlowView = CircularGlowView;
exports.FeedbackView = FeedbackView;
exports.FertilizingGameteView = FertilizingGameteView;
exports.GametePoolView = GametePoolView;
exports.GameteView = GameteView;
exports.GeneLabelView = GeneLabelView;
exports.GenomeTestView = GenomeTestView;
exports.GenomeView = GenomeView;
exports.OrganismView = OrganismView;
exports.OrganismGlowView = OrganismGlowView;
exports.PenView = PenView;
exports.QuestionGlowView = QuestionGlowView;
exports.QuestionOrganismGlowView = QuestionOrganismGlowView;
exports.StatsView = StatsView;

},{"./components/allele":3,"./components/allele-filters":2,"./components/animated-gamete":4,"./components/change-sex-buttons":5,"./components/chromosome":7,"./components/chromosome-image":6,"./components/circular-glow":8,"./components/feedback":9,"./components/fertilizing-gamete":10,"./components/gamete":12,"./components/gamete-pool":11,"./components/gene-label":13,"./components/genome":15,"./components/genome-test":14,"./components/organism":17,"./components/organism-glow":16,"./components/pen":18,"./components/question-glow":19,"./components/question-organism-glow":20,"./components/stats":21}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AlleleFiltersView = function AlleleFiltersView(_ref) {
  var species = _ref.species;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$disabledAlleles = _ref.disabledAlleles;
  var disabledAlleles = _ref$disabledAlleles === undefined ? [] : _ref$disabledAlleles;
  var onFilterChange = _ref.onFilterChange;

  var hiddenGenes = new Set(),
      geneInputs = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = hiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var allele = _step.value;

      var gene = BioLogica.Genetics.getGeneOfAllele(species, allele);
      if (gene) hiddenGenes.add(gene.name);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  for (var gene in species.geneList) {
    if (!hiddenGenes.has(gene)) {
      var alleles = species.geneList[gene].alleles,
          alleleItems = alleles.map(function (allele) {
        var name = species.alleleLabelMap[allele],
            checked = !(disabledAlleles.indexOf(allele) >= 0);
        return React.createElement(
          "label",
          { key: name },
          React.createElement("input", { type: "checkbox", key: name, value: allele,
            style: { "marginLeft": "8px" },
            defaultChecked: checked, onChange: handleChange }),
          name
        );
      });
      geneInputs.push(React.createElement(
        "div",
        { className: "gene-allele-list", key: gene },
        alleleItems
      ));
    }
  }

  function handleChange(evt) {
    var elt = evt.target,
        allele = elt && elt.value,
        isChecked = elt && elt.checked;
    if (onFilterChange && allele) onFilterChange(evt, allele, isChecked);
  }

  return React.createElement(
    "div",
    { className: "geniblocks allele-filters",
      style: { "marginTop": "5px", "marginBottom": "5px" } },
    geneInputs
  );
};

AlleleFiltersView.propTypes = {
  species: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  disabledAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  onFilterChange: React.PropTypes.func.isRequired
};

exports.default = AlleleFiltersView;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AlleleView = function AlleleView(_ref) {
  var allele = _ref.allele;
  var target = _ref.target;
  var color = _ref.color;
  var shape = _ref.shape;
  var hovering = _ref.hovering;

  var width = 21,
      radius = width / 2,
      stroke = target ? "#000000" : "none",
      fill = allele ? color : "white",
      strokeWidth = hovering ? 3 : 1,
      strokeDasharray = allele ? "0" : "1",
      svgShape = null;

  if (shape === "circle") {
    svgShape = React.createElement("circle", { r: radius, cy: radius + 1, cx: radius + 1, strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  } else {
    svgShape = React.createElement("rect", { width: radius * 2, height: radius * 2, x: "1", y: "1", strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  }

  return React.createElement(
    "svg",
    { width: width + 2, height: width + 2, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement(
      "g",
      null,
      svgShape,
      React.createElement(
        "text",
        { x: radius + 1, y: radius + 7, textAnchor: "middle", fill: "white" },
        allele
      )
    )
  );
};

exports.default = AlleleView;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gamete = require('./gamete');

var _gamete2 = _interopRequireDefault(_gamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnimatedGameteView = function AnimatedGameteView(_ref) {
  var gamete = _ref.gamete;
  var id = _ref.id;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var initialDisplay = _ref.initialDisplay;
  var display = _ref.display;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 100 : _ref$animStiffness;
  var _ref$isSelected = _ref.isSelected;
  var isSelected = _ref$isSelected === undefined ? false : _ref$isSelected;
  var _ref$isDisabled = _ref.isDisabled;
  var isDisabled = _ref$isDisabled === undefined ? false : _ref$isDisabled;
  var onClick = _ref.onClick;
  var onRest = _ref.onRest;


  var group = id % 4,
      rotationForGroup = group * 90,
      initial = initialDisplay || display,
      initialSize = initial.size || 30,
      initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
      initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
      finalSize = display.size || 30,
      finalRotation = display.rotation != null ? display.rotation : rotationForGroup,
      finalOpacity = display.opacity != null ? display.opacity : 1.0,
      springConfig = { stiffness: animStiffness };
  /* eslint react/display-name:0 */
  return React.createElement(
    ReactMotion.Motion,
    { defaultStyle: {
        x: initial.x, y: initial.y, size: initialSize,
        rotation: initialRotation, opacity: initialOpacity
      },
      style: {
        x: ReactMotion.spring(display.x, springConfig),
        y: ReactMotion.spring(display.y, springConfig),
        size: ReactMotion.spring(finalSize, springConfig),
        rotation: ReactMotion.spring(finalRotation, springConfig),
        opacity: ReactMotion.spring(finalOpacity, springConfig)
      },
      onRest: onRest },
    function (interpolatedStyle) {
      return React.createElement(_gamete2.default, { gamete: gamete, id: id, hiddenAlleles: hiddenAlleles,
        display: interpolatedStyle,
        isSelected: isSelected, isDisabled: isDisabled, onClick: onClick });
    }
  );
}; /**
    * Stateless functional React component for displaying a Biologica gamete that animates
    *
    * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
    * @param {number} id - the unique id of this gamete
    * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
    * @param {Object} [initialDisplay] - initial display parameters used to represent the gamete
    * @param {number} [initialDisplay.x] - initial location (left) of the gamete
    * @param {number} [initialDisplay.y] - initial location (top) of the gamete
    * @param {number} [initialDisplay.size=30] - initial size (width & height) of the gamete
    * @param {number} [initialDisplay.rotation=0] - initial rotation of the gamete
    * @param {number} [initialDisplay.opacity=1] - initial opacity of the gamete
    * @param {Object} display - final display parameters used to represent the gamete
    * @param {number} display.x - final location (left) of the gamete
    * @param {number} display.y - final location (top) of the gamete
    * @param {number} [display.size=30] - final size (width & height) of the gamete
    * @param {number} [display.rotation=0] - final rotation of the gamete
    * @param {number} [display.opacity=1] - final opacity of the gamete
    * @param {number} [animStiffness=100] - spring stiffness used to control animation speed
    * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
    * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
    * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
    * @param {function} [onRect()] - callback function to be called when the animation is at rest
    *
    * Note: As things stand currently, there is _no_ particular representation of the gamete defined
    * by this view. The client can style the representation of the gamete by styling the
    * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
    */


AnimatedGameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  initialDisplay: React.PropTypes.shape({ // initial display properties
    x: React.PropTypes.number.isRequired, // location (left) of gamete image
    y: React.PropTypes.number.isRequired, // location (top) of gamete image
    size: React.PropTypes.number, // size of gamete image (default: 30)
    rotation: React.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: React.PropTypes.number // opacity of gamete image (default: 1.0)
  }),
  display: React.PropTypes.shape({ // final display properties
    x: React.PropTypes.number.isRequired, // location (left) of gamete image
    y: React.PropTypes.number.isRequired, // location (top) of gamete image
    size: React.PropTypes.number, // size of gamete image (default: 30)
    rotation: React.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: React.PropTypes.number // opacity of gamete image (default: 1.0)
  }).isRequired,
  animStiffness: React.PropTypes.number, // stiffness of spring for animation (default: 100)
  isSelected: React.PropTypes.bool,
  isDisabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onRest: React.PropTypes.func
};

exports.default = AnimatedGameteView;

},{"./gamete":12}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Stateless functional React component for displaying male/female change buttons
 * @param {string} sex - ['male' | 'female'] currently selected button
 * @param {function} onChange(evt, sex) - callback to be called when use clicks to change sex
 */
var ChangeSexButtons = function ChangeSexButtons(_ref) {
  var sex = _ref.sex;
  var species = _ref.species;
  var showLabel = _ref.showLabel;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onChange = _ref.onChange;

  var capSex = sex.substr(0, 1).toUpperCase() + sex.substr(1),
      selectedSexClass = sex === 'male' ? "male-selected" : "female-selected",
      BUTTON_IMAGE_WIDTH = 100,
      BUTTON_IMAGE_MIDPOINT_X = BUTTON_IMAGE_WIDTH / 2,
      imageStyle = Object.assign(style, { position: 'absolute' }),
      label = showLabel ? capSex + " " + species : '',
      labelElement = showLabel ? React.createElement(
    "div",
    { style: { position: 'absolute',
        fontSize: '14pt',
        fontWeight: 'bold',
        color: 'white',
        left: BUTTON_IMAGE_WIDTH,
        whiteSpace: 'nowrap',
        marginLeft: 10 } },
    label
  ) : '';

  function handleClick(evt) {
    var eltRect = evt.target.getBoundingClientRect(),
        clickX = evt.clientX - eltRect.left;
    if (sex === 'male' !== clickX > BUTTON_IMAGE_MIDPOINT_X) onChange(evt, sex === 'male' ? 'female' : 'male');
  }

  return React.createElement(
    "div",
    { style: { position: 'relative' } },
    React.createElement("div", { className: "geniblocks change-sex-buttons " + selectedSexClass,
      style: imageStyle, onClick: handleClick }),
    labelElement
  );
};

ChangeSexButtons.propTypes = {
  sex: React.PropTypes.oneOf(['male', 'female']).isRequired,
  species: React.PropTypes.string,
  showLabel: React.PropTypes.bool,
  style: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired
};

exports.default = ChangeSexButtons;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ChromosomeImageView = function ChromosomeImageView() {
  var width = 23,
      height = 126,
      split = 45,
      radius = width / 2,
      imageWidth = width + 4,
      halfImageWidth = imageWidth / 2,
      imageHeight = height + 4,
      color = "#FF9999";

  return React.createElement(
    "svg",
    { width: imageWidth, height: imageHeight, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement(
      "g",
      null,
      React.createElement("circle", { r: radius, cy: radius + 2, cx: halfImageWidth, strokeWidth: "2", stroke: "#000000", fill: color }),
      React.createElement("circle", { r: radius, cy: split - radius, cx: halfImageWidth, strokeWidth: "2", stroke: "#000000", fill: color }),
      React.createElement("circle", { r: radius, cy: split + radius, cx: halfImageWidth, strokeWidth: "2", stroke: "#000000", fill: color }),
      React.createElement("circle", { r: radius, cy: height - radius, cx: halfImageWidth, strokeWidth: "2", stroke: "#000000", fill: color }),
      React.createElement("rect", { height: split - radius - (radius + 2), width: width, y: radius + 2, x: "2", strokeWidth: "0", stroke: "#000000", fill: color }),
      React.createElement("rect", { height: height - radius - (split + radius), width: width, y: split + radius, x: "2", strokeWidth: "0", stroke: "#000000", fill: color }),
      React.createElement("line", { y1: radius + 2, x1: "2", y2: split - radius + 2, x2: "2", strokeLinecap: "null", strokeLinejoin: "null", strokeWidth: "2", stroke: "#000000", fill: "none" }),
      React.createElement("line", { y1: radius + 2, x1: width + 2, y2: split - radius + 2, x2: width + 2, strokeLinecap: "null", strokeLinejoin: "null", strokeWidth: "2", stroke: "#000000", fill: "none" }),
      React.createElement("line", { y1: split + radius, x1: "2", y2: height - radius, x2: "2", strokeLinecap: "null", strokeLinejoin: "null", strokeWidth: "2", stroke: "#000000", fill: "none" }),
      React.createElement("line", { y1: split + radius, x1: width + 2, y2: height - radius, x2: width + 2, strokeLinecap: "null", strokeLinejoin: "null", strokeWidth: "2", stroke: "#000000", fill: "none" })
    )
  );
};

exports.default = ChromosomeImageView;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _geneLabel = require('./gene-label');

var _geneLabel2 = _interopRequireDefault(_geneLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterAlleles = function filterAlleles(alleles, hiddenAlleles, species) {
  var hiddenGenes = hiddenAlleles.map(function (a) {
    return BioLogica.Genetics.getGeneOfAllele(species, a);
  });
  return alleles.filter(function (a) {
    var gene = BioLogica.Genetics.getGeneOfAllele(species, a);
    return hiddenGenes.indexOf(gene) === -1;
  });
};

var ChromosomeView = function ChromosomeView(_ref) {
  var org = _ref.org;
  var chromosomeName = _ref.chromosomeName;
  var side = _ref.side;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var alleleChanged = _ref.alleleChanged;
  var _ref$labelsOnRight = _ref.labelsOnRight;
  var labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight;

  var alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      visibleAlleles = filterAlleles(alleles, hiddenAlleles, org.species),
      labels = visibleAlleles.map(function (a) {
    return React.createElement(_geneLabel2.default, { key: a, species: org.species, allele: a, editable: true,
      onAlleleChange: function onAlleleChange(event) {
        alleleChanged(a, event.target.value);
      } });
  }),
      containerClass = "items";

  if (!labelsOnRight) {
    containerClass += " rtl";
  }

  return React.createElement(
    'div',
    { className: 'geniblocks chromosome-container' },
    React.createElement(
      'div',
      { className: containerClass },
      React.createElement(_chromosomeImage2.default, null),
      React.createElement(
        'div',
        { className: 'labels' },
        labels
      )
    )
  );
};

ChromosomeView.propTypes = {
  org: React.PropTypes.object.isRequired,
  chromosomeName: React.PropTypes.string.isRequired,
  side: React.PropTypes.string.isRequired,
  hiddenAlleles: React.PropTypes.array,
  alleleChanged: React.PropTypes.func.isRequired,
  labelsOnRight: React.PropTypes.bool
};

exports.default = ChromosomeView;

},{"./chromosome-image":6,"./gene-label":13}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CircularGlowView = function CircularGlowView(_ref) {
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;

  var radius = size / 2,
      colorNoHash = color.replace('#', ''),
      gradientID = 'CircularGlowView_' + colorNoHash,
      gradientIDUrl = 'url(#' + gradientID + ')';

  return React.createElement(
    'div',
    { classNames: 'geniblocks glow', style: style },
    React.createElement(
      'svg',
      { width: size + 2, height: size + 2, xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement(
        'defs',
        null,
        React.createElement(
          'radialGradient',
          { id: gradientID },
          React.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: '1.0' }),
          React.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: '0.0' })
        )
      ),
      React.createElement('circle', { fill: gradientIDUrl, cx: radius, cy: radius, r: radius })
    )
  );
};

CircularGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  style: React.PropTypes.object
};

exports.default = CircularGlowView;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FeedbackView = function FeedbackView(_ref) {
  var text = _ref.text;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var tText = Array.isArray(text) ? text : [text],
      lineCount = tText.length,
      height = 20 * lineCount + 2,
      defaultStyle = {
    width: '100%',
    height: height,
    backgroundColor: '#877871',
    color: 'white',
    opacity: 0.8,
    border: '1px solid black',
    textAlign: 'center',
    fontSize: '11pt',
    fontWeight: 'bold'
  },
      tStyle = Object.assign(defaultStyle, style),
      textLines = tText.map(function (iText, index) {
    return React.createElement(
      'div',
      { className: 'geniblocks feedback text-line', key: index },
      iText
    );
  });

  return React.createElement(
    'div',
    { className: 'geniblocks feedback', style: tStyle },
    textLines
  );
};

FeedbackView.propTypes = {
  text: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]).isRequired,
  style: React.PropTypes.object
};

exports.default = FeedbackView;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GAMETE_TYPE = undefined;

var _animatedGamete = require('./animated-gamete');

var _animatedGamete2 = _interopRequireDefault(_animatedGamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var INITIAL_GAMETE_SIZE = 30,
    FINAL_GAMETE_SIZE = 140,
    RESTING_MOTHER_GAMETE_X = 0,
    RESTING_FATHER_GAMETE_X = 150,
    FERTILIZING_MOTHER_GAMETE_X = 70,
    FERTILIZING_FATHER_GAMETE_X = 80,
    FINAL_ZYGOTE_Y = -150;

var GAMETE_TYPE = exports.GAMETE_TYPE = { MOTHER: 'mother', FATHER: 'father' };

var FertilizingGameteView = function (_React$Component) {
  _inherits(FertilizingGameteView, _React$Component);

  function FertilizingGameteView(props) {
    _classCallCheck(this, FertilizingGameteView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FertilizingGameteView).call(this, props));

    _this.render = function () {
      var _this$props = _this.props;
      var gamete = _this$props.gamete;
      var id = _this$props.id;
      var hiddenAlleles = _this$props.hiddenAlleles;
      var animStiffness = _this$props.animStiffness;
      var onRest = _this$props.onRest;
      var xOffset = _this.props.srcRect ? _this.props.srcRect.left - _this.props.dstRect.left : 0;
      var yOffset = _this.props.srcRect ? _this.props.srcRect.top - _this.props.dstRect.top : 0;
      var xResting = _this.props.type === GAMETE_TYPE.FATHER ? RESTING_FATHER_GAMETE_X : RESTING_MOTHER_GAMETE_X;
      var xFertilizing = _this.props.type === GAMETE_TYPE.FATHER ? FERTILIZING_FATHER_GAMETE_X : FERTILIZING_MOTHER_GAMETE_X;
      var initial = undefined;var final = undefined;

      if (!gamete || !id) return;

      if (_this.props.fertilizationState === 'none') {
        if (_this.props.type === GAMETE_TYPE.FATHER) xOffset += RESTING_FATHER_GAMETE_X;
        initial = { x: xOffset, y: yOffset, size: INITIAL_GAMETE_SIZE };
        final = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE };
      } else if (_this.props.fertilizationState === 'fertilizing') {
        initial = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE, opacity: 1.0 };
        final = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
      } else {
        initial = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
        final = { x: xFertilizing, y: FINAL_ZYGOTE_Y, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 0.0 };
      }

      return React.createElement(_animatedGamete2.default, { gamete: gamete, id: id, hiddenAlleles: hiddenAlleles,
        initialDisplay: initial, display: final,
        animStiffness: animStiffness, onRest: onRest });
    };

    return _this;
  }

  return FertilizingGameteView;
}(React.Component);

FertilizingGameteView.propTypes = {
  type: React.PropTypes.oneOf([GAMETE_TYPE.MOTHER, GAMETE_TYPE.FATHER]).isRequired,
  gamete: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  fertilizationState: React.PropTypes.oneOf(['none', 'fertilizing', 'fertilized', 'complete']).isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  srcRect: React.PropTypes.shape({
    left: React.PropTypes.number.isRequired,
    top: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  }),
  dstRect: React.PropTypes.shape({
    left: React.PropTypes.number.isRequired,
    top: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  }),
  animStiffness: React.PropTypes.number, // stiffness of spring for animation (default: 100)
  onRest: React.PropTypes.func
};
FertilizingGameteView.defaultProps = {
  hiddenAlleles: [],
  animStiffness: 100
};
exports.default = FertilizingGameteView;

},{"./animated-gamete":4}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animatedGamete = require("./animated-gamete");

var _animatedGamete2 = _interopRequireDefault(_animatedGamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GametePoolView = function GametePoolView(_ref) {
  var gametes = _ref.gametes;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 300 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 200 : _ref$height;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 60 : _ref$animStiffness;
  var selectedId = _ref.selectedId;
  var isGameteDisabled = _ref.isGameteDisabled;
  var onGameteSelected = _ref.onGameteSelected;

  var gameteCount = gametes.length,
      gameteSize = 30,
      margin = 5,
      spacingDefault = gameteSize + 2 * margin,
      xSpacing = spacingDefault,
      ySpacing = spacingDefault,
      colDefault = Math.floor(width / spacingDefault),
      rowDefault = Math.floor(height / spacingDefault),
      enabledCount = 0,
      disabledCount = 0,
      disabledFlags = gametes.map(function (g) {
    return isGameteDisabled(g);
  }),
      totalDisabledCount = disabledFlags.reduce(function (total, flag) {
    return total + flag;
  }, 0),

  // leave room for the disabled gamete row if there are disabled gametes
  availableHeight = height - (totalDisabledCount ? spacingDefault : 0) - 4 * margin,

  // pack the disabled gametes into the disabled row
  xDisabledSpacing = Math.min(xSpacing / 2, (width - 7 * margin) / totalDisabledCount),
      yDisabledSpacing = spacingDefault,
      totalEnabledCount = gameteCount - totalDisabledCount,
      gameteViews = undefined;

  // squeeze in to make room for additional gametes if necessary
  var colCount = colDefault,
      rowCount = rowDefault - (totalDisabledCount > 0);
  while (colCount * rowCount < totalEnabledCount) {
    if (ySpacing > xSpacing) {
      ySpacing = availableHeight / ++rowCount;
    } else {
      xSpacing = (width - 4 * margin) / ++colCount;
    }
  }

  gameteViews = gametes.map(function (gamete, index) {
    var isDisabled = disabledFlags[index],
        layoutIndex = isDisabled ? disabledCount++ : enabledCount++,
        row = isDisabled ? rowDefault - 1 : Math.floor(layoutIndex / colCount),
        col = isDisabled ? layoutIndex : layoutIndex % colCount,
        y = isDisabled ? row * yDisabledSpacing : row * ySpacing,
        x = isDisabled ? col * xDisabledSpacing : col * xSpacing;
    return React.createElement(_animatedGamete2.default, { gamete: gamete, id: index + 1, key: index,
      hiddenAlleles: hiddenAlleles,
      initialDisplay: { x: Math.round(width / 2), y: -Math.round(ySpacing) },
      display: { x: Math.round(x), y: Math.round(y) },
      animStiffness: animStiffness,
      isSelected: index + 1 === selectedId,
      isDisabled: isDisabled,
      onClick: onGameteSelected });
  });

  return React.createElement(
    "div",
    { className: "geniblocks gamete-pool", style: { width: width, height: height } },
    gameteViews
  );
};

GametePoolView.propTypes = {
  gametes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  animStiffness: React.PropTypes.number,
  selectedId: React.PropTypes.number,
  isGameteDisabled: React.PropTypes.func,
  onGameteSelected: React.PropTypes.func
};

exports.default = GametePoolView;

},{"./animated-gamete":4}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Stateless functional React component for displaying a Biologica gamete
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} display - display parameters used to represent the gamete
 * @param {number} display.x - location (left) of the gamete
 * @param {number} display.y - location (top) of the gamete
 * @param {number} [display.size=30] - size (width & height) of the gamete
 * @param {number} [display.rotation=0] - rotation of the gamete
 * @param {number} [display.opacity=1] - opacity of the gamete
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
var GameteView = function GameteView(_ref) {
  var gamete = _ref.gamete;
  var id = _ref.id;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var display = _ref.display;
  var _ref$isSelected = _ref.isSelected;
  var isSelected = _ref$isSelected === undefined ? false : _ref$isSelected;
  var _ref$isDisabled = _ref.isDisabled;
  var isDisabled = _ref$isDisabled === undefined ? false : _ref$isDisabled;
  var onClick = _ref.onClick;


  function handleClick(evt) {
    var elt = evt.target,
        rect = elt.getBoundingClientRect();
    if (!isDisabled) {
      onClick(evt, id, rect);
    }
  }

  function buildTooltipForGamete(gamete) {
    var tooltip = "",
        allHiddenAlleles = undefined;
    // Note: it would be more efficient for the caller to pass in the
    // allHiddenAlleles array rather than computing it each time here.
    // But if we moved it out right now we'd have to eliminate the ES6 splat.
    function concatHiddenAlleles(iSpecies, iHiddenAlleles) {
      allHiddenAlleles = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = iHiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _allHiddenAlleles;

          var allele = _step.value;

          var gene = BioLogica.Genetics.getGeneOfAllele(iSpecies, allele);
          (_allHiddenAlleles = allHiddenAlleles).push.apply(_allHiddenAlleles, _toConsumableArray(gene.alleles));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    for (var ch in gamete) {
      var chromosome = gamete[ch];
      if (allHiddenAlleles == null) concatHiddenAlleles(chromosome.species, hiddenAlleles);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = chromosome.alleles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var allele = _step2.value;

          if (allHiddenAlleles.indexOf(allele) < 0) {
            var label = chromosome.species.alleleLabelMap[allele];
            tooltip += (tooltip ? '\n' : '') + ch + ': ' + label;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (ch === 'XY') {
        var value = chromosome.side === 'y' ? 'y' : 'x';
        tooltip += (tooltip ? '\n' : '') + ch + ': ' + value;
      }
    }
    return tooltip;
  }

  var selectedClass = isSelected && !isDisabled ? "selected" : "",
      disabledClass = isDisabled ? "disabled" : "",
      group = id % 4,
      rotationForGroup = group * 90,
      classes = 'geniblocks gamete ' + selectedClass + ' ' + disabledClass + ' group' + group,
      size = display.size || 30,
      rotation = display.rotation != null ? display.rotation : rotationForGroup,
      transform = rotation ? 'rotate(' + rotation + 'deg)' : '',
      opacity = display.opacity != null ? display.opacity : 1.0,
      tooltip = buildTooltipForGamete(gamete);
  return React.createElement('div', { className: classes, title: tooltip,
    style: {
      left: display.x, top: display.y,
      width: size, height: size,
      transform: transform, opacity: opacity
    },
    onClick: handleClick });
};

GameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  display: React.PropTypes.shape({ // display properties
    x: React.PropTypes.number.isRequired, // location (left) of gamete image
    y: React.PropTypes.number.isRequired, // location (top) of gamete image
    size: React.PropTypes.number, // size of gamete image (default: 30)
    rotation: React.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: React.PropTypes.number // opacity of gamete image (default: 1.0)
  }).isRequired,
  isSelected: React.PropTypes.bool,
  isDisabled: React.PropTypes.bool,
  onClick: React.PropTypes.func
};

exports.default = GameteView;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var GeneLabelView = function GeneLabelView(_ref) {
  var species = _ref.species;
  var allele = _ref.allele;
  var editable = _ref.editable;
  var onAlleleChange = _ref.onAlleleChange;

  if (!editable) {
    var alleleName = species.alleleLabelMap[allele];
    return React.createElement(
      "div",
      { className: "geniblocks allele noneditable" },
      React.createElement(
        "span",
        null,
        alleleName
      )
    );
  } else {
    var _ret = function () {
      var alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
          alleleNames = alleles.map(function (a) {
        return species.alleleLabelMap[a];
      }),
          alleleOptions = alleleNames.map(function (name, i) {
        return React.createElement(
          "option",
          { key: name, value: alleles[i] },
          name
        );
      });
      return {
        v: React.createElement(
          "div",
          { className: "geniblocks allele" },
          React.createElement(
            "select",
            { value: allele, onChange: onAlleleChange },
            alleleOptions
          )
        )
      };
    }();

    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
  }
};

GeneLabelView.propTypes = {
  species: React.PropTypes.object.isRequired,
  allele: React.PropTypes.string.isRequired,
  editable: React.PropTypes.bool.isRequired,
  onAlleleChange: React.PropTypes.func.isRequired
};

exports.default = GeneLabelView;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromosomeImage = require("./chromosome-image");

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterAlleles = function filterAlleles(alleles, hiddenAlleles, species) {
  var hiddenGenes = hiddenAlleles.map(function (a) {
    return BioLogica.Genetics.getGeneOfAllele(species, a);
  });
  return alleles.filter(function (a) {
    var gene = BioLogica.Genetics.getGeneOfAllele(species, a);
    return hiddenGenes.indexOf(gene) === -1;
  });
},
    TestPulldownView = function TestPulldownView(_ref) {
  var species = _ref.species;
  var gene = _ref.gene;
  var selection = _ref.selection;
  var onSelectionChange = _ref.onSelectionChange;

  var alleles = gene.alleles,
      alleleNames = alleles.map(function (a) {
    return species.alleleLabelMap[a];
  }),
      numAlleles = alleleNames.length,
      possibleCombos = [],
      currentSelection = selection || "placeholder",
      i = undefined,
      j = undefined;

  possibleCombos.push(React.createElement(
    "option",
    { key: "placeholder", value: "placeholder", disabled: "disabled" },
    "Select a Genotype"
  ));

  for (i = 0; i < numAlleles; i++) {
    for (j = i; j < numAlleles; j++) {
      var key = i + " " + j,
          string = alleleNames[i] + " / " + alleleNames[j];
      possibleCombos.push(React.createElement(
        "option",
        { key: key, value: key },
        string
      ));
    }
  }

  return React.createElement(
    "select",
    { value: currentSelection, onChange: onSelectionChange },
    possibleCombos
  );
};

var GenomeTestView = function GenomeTestView(_ref2) {
  var org = _ref2.org;
  var _ref2$hiddenAlleles = _ref2.hiddenAlleles;
  var hiddenAlleles = _ref2$hiddenAlleles === undefined ? [] : _ref2$hiddenAlleles;
  var _ref2$selection = _ref2.selection;
  var selection = _ref2$selection === undefined ? {} : _ref2$selection;
  var selectionChanged = _ref2.selectionChanged;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          alleles = chrom[Object.keys(chrom)[0]].alleles,
          visibleAlleles = filterAlleles(alleles, hiddenAlleles, org.species),
          genes = visibleAlleles.map(function (a) {
        return BioLogica.Genetics.getGeneOfAllele(org.species, a);
      }),
          pulldowns = genes.map(function (g) {
        return React.createElement(TestPulldownView, {
          key: g.name,
          species: org.species,
          gene: g,
          selection: selection[g.name],
          onSelectionChange: function onSelectionChange(event) {
            selectionChanged(g, event.target.value);
          }
        });
      });

      pairWrappers.push(React.createElement(
        "div",
        { className: "items", key: chromosomeName },
        React.createElement(_chromosomeImage2.default, null),
        React.createElement(_chromosomeImage2.default, null),
        React.createElement(
          "div",
          { className: "genome-test-options" },
          pulldowns
        )
      ));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return React.createElement(
    "div",
    { className: "geniblocks genome-test" },
    pairWrappers
  );
};

TestPulldownView.propTypes = {
  species: React.PropTypes.object.isRequired,
  gene: React.PropTypes.object.isRequired,
  selection: React.PropTypes.string,
  onSelectionChange: React.PropTypes.func.isRequired
};

GenomeTestView.propTypes = {
  org: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.array,
  selection: React.PropTypes.object,
  selectionChanged: React.PropTypes.func.isRequired
};

exports.default = GenomeTestView;

},{"./chromosome-image":6}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromosome = require("./chromosome");

var _chromosome2 = _interopRequireDefault(_chromosome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GenomeView = function GenomeView(_ref) {
  var org = _ref.org;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _alleleChanged = _ref.alleleChanged;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          pairs = [];

      var _loop2 = function _loop2(side) {
        pairs.push(React.createElement(_chromosome2.default, {
          org: org,
          key: pairs.length + 1,
          chromosomeName: chromosomeName,
          side: side,
          hiddenAlleles: hiddenAlleles,
          labelsOnRight: pairs.length > 0,
          alleleChanged: function alleleChanged(prevAllele, newAllele) {
            _alleleChanged(chromosomeName, side, prevAllele, newAllele);
          } }));
      };

      for (var side in chrom) {
        _loop2(side);
      }
      pairWrappers.push(React.createElement(
        "div",
        { className: "geniblocks chromosome-pair", key: pairWrappers.length + 1 },
        pairs
      ));
    };

    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return React.createElement(
    "div",
    { className: "geniblocks genome" },
    pairWrappers
  );
};

GenomeView.propTypes = {
  org: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.array,
  alleleChanged: React.PropTypes.func.isRequired
};

exports.default = GenomeView;

},{"./chromosome":7}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrganismGlowView = function OrganismGlowView(_ref) {
  var org = _ref.org;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$initialStyle = _ref.initialStyle;
  var initialStyle = _ref$initialStyle === undefined ? {} : _ref$initialStyle;
  var _ref$finalStyle = _ref.finalStyle;
  var finalStyle = _ref$finalStyle === undefined ? {} : _ref$finalStyle;
  var _ref$stiffness = _ref.stiffness;
  var stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness;
  var onRest = _ref.onRest;

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' },
      initialOrgStyle = Object.assign(initialStyle, { position: 'absolute' }),
      finalOrgStyle = Object.assign(finalStyle, { position: 'absolute' });

  return React.createElement(
    'div',
    { classNames: 'geniblocks organism-glow', style: containerStyle },
    React.createElement(_circularGlow2.default, { color: color, size: size, style: glowStyle }),
    React.createElement(_organism2.default, { org: org, color: color, width: size,
      initialStyle: initialOrgStyle, finalStyle: finalOrgStyle,
      stiffness: stiffness, onRest: onRest })
  );
};

OrganismGlowView.propTypes = {
  org: React.PropTypes.object,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func
};

exports.default = OrganismGlowView;

},{"./circular-glow":8,"./organism":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$initialStyle = _ref.initialStyle;
  var initialStyle = _ref$initialStyle === undefined ? {} : _ref$initialStyle;
  var _ref$finalStyle = _ref.finalStyle;
  var finalStyle = _ref$finalStyle === undefined ? {} : _ref$finalStyle;
  var _ref$stiffness = _ref.stiffness;
  var stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness;
  var onRest = _ref.onRest;
  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/";
  var url = baseUrl + org.getImageName();
  var iPosition = initialStyle.position;
  var initialMotion = _objectWithoutProperties(initialStyle, ["position"]);
  var fPosition = finalStyle.position;
  var finalMotion = _objectWithoutProperties(finalStyle, ["position"]);
  var position = fPosition || iPosition;
  var initial = Object.assign({ opacity: 1.0 }, initialMotion);
  var final = Object.assign({ opacity: 1.0 }, finalMotion);

  if (final.opacity !== initial.opacity) final.opacity = ReactMotion.spring(final.opacity, { stiffness: stiffness });

  return React.createElement(
    ReactMotion.Motion,
    { defaultStyle: initial, style: final, onRest: onRest },
    function (interpolatedStyle) {
      var style = Object.assign(interpolatedStyle, position ? { position: position } : {});
      return React.createElement(
        "div",
        { className: "geniblocks organism", style: style },
        React.createElement("img", { src: url, width: width })
      );
    }
  );
};

OrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  width: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func
};

exports.default = OrganismView;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _organism = require("./organism");

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PenView = function PenView(_ref) {
  var orgs = _ref.orgs;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 400 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 5 : _ref$columns;

  var orgWidth = width / columns,
      orgViews = orgs.map(function (org, index) {
    return React.createElement(_organism2.default, { org: org, key: index, width: orgWidth });
  });

  return React.createElement(
    "div",
    { className: "geniblocks pen" },
    orgViews
  );
};

PenView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  width: React.PropTypes.number,
  columns: React.PropTypes.number
};

exports.default = PenView;

},{"./organism":17}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestionGlowView = function QuestionGlowView(_ref) {
  var glowColor = _ref.glowColor;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 200 : _ref$size;

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' };

  return React.createElement(
    'div',
    { className: 'geniblocks text-glow', style: containerStyle },
    React.createElement(_circularGlow2.default, { color: glowColor, size: size, style: glowStyle }),
    React.createElement('div', { className: 'geniblocks text-glow question-mark',
      style: { position: "absolute", width: size, height: size } })
  );
  // HTML text node
  //<div style={tStyle}>{text}</div>

  // SVG text node
  //<svg width={size+2} height={size+2} xmlns="http://www.w3.org/2000/svg">
  //  <text x='50' y='175' fill='#0D0D8C' style={tStyle}>
  //    {text}
  //  </text>
  //</svg>
};

QuestionGlowView.propTypes = {
  glowColor: React.PropTypes.string.isRequired,
  size: React.PropTypes.number
};

exports.default = QuestionGlowView;

},{"./circular-glow":8}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _organismGlow = require('./organism-glow');

var _organismGlow2 = _interopRequireDefault(_organismGlow);

var _questionGlow = require('./question-glow');

var _questionGlow2 = _interopRequireDefault(_questionGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestionOrganismGlowView = function QuestionOrganismGlowView(_ref) {
  var hidden = _ref.hidden;
  var org = _ref.org;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$initialStyle = _ref.initialStyle;
  var initialStyle = _ref$initialStyle === undefined ? {} : _ref$initialStyle;
  var _ref$finalStyle = _ref.finalStyle;
  var finalStyle = _ref$finalStyle === undefined ? {} : _ref$finalStyle;
  var _ref$stiffness = _ref.stiffness;
  var stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness;
  var onRest = _ref.onRest;

  var orgView = React.createElement(_organismGlow2.default, { org: org, color: color, size: size,
    initialStyle: initialStyle, finalStyle: finalStyle,
    stiffness: stiffness, onRest: onRest }),
      questionView = React.createElement(_questionGlow2.default, { glowColor: color, width: size }),
      finalView = hidden ? questionView : orgView;

  return React.createElement(
    'div',
    { classNames: 'geniblocks question-organism-glow' },
    finalView
  );
};

QuestionOrganismGlowView.propTypes = {
  hidden: React.PropTypes.bool,
  org: React.PropTypes.object,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  initialStyle: React.PropTypes.object,
  finalStyle: React.PropTypes.object,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func
};

exports.default = QuestionOrganismGlowView;

},{"./organism-glow":16,"./question-glow":19}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Stateless functional React component for displaying breeding statistics for a set of Biologica organisms
 * @param {Object[]} orgs - array of Biologica organisms for which statistics are to be displayed
 * @param {Object} orgs[].phenotype - the phenotype of the Biologica organism
 * @param {number} [lastClutchSize=orgs.length] - the number of organisms at the end of the array that comprise the most recent clutch
 */
var StatsView = function StatsView(_ref) {
  var orgs = _ref.orgs;
  var lastClutchSize = _ref.lastClutchSize;


  var traits = new Map(),
      rows = [];

  // if no size specified, assume there's only one clutch
  if (!lastClutchSize) lastClutchSize = orgs.length;

  // accumulate stats for each trait/value combination
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = orgs.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var index = _step$value[0];
      var org = _step$value[1];

      var clutchKey = 'c' + org.sex;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(org.phenotype.characteristics)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var trait = _step3.value;

          var value = org.phenotype.characteristics[trait],
              traitValues = traits.get(trait) || new Map(),
              valueCounts = traitValues.get(value) || new Map();
          if (!traits.has(trait)) traits.set(trait, traitValues);
          if (!traitValues.has(value)) traitValues.set(value, valueCounts);
          // most recent clutch assumed to be at end of organisms array
          if (index >= orgs.length - lastClutchSize) valueCounts.set(clutchKey, (valueCounts.get(clutchKey) || 0) + 1);
          valueCounts.set(org.sex, (valueCounts.get(org.sex) || 0) + 1);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    // build cumulative stats for table rows
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var traitNum = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = traits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var trait = _step2$value[0];
      var values = _step2$value[1];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = values[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2);

          var value = _step4$value[0];
          var counts = _step4$value[1];

          var cMales = counts.get('c' + BioLogica.MALE) || 0,
              cFemales = counts.get('c' + BioLogica.FEMALE) || 0,
              cTotal = cMales + cFemales,
              cPct = Math.round(100 * cTotal / lastClutchSize),
              tMales = counts.get(BioLogica.MALE) || 0,
              tFemales = counts.get(BioLogica.FEMALE) || 0,
              tTotal = tMales + tFemales,
              tPct = Math.round(100 * tTotal / orgs.length);
          rows.push({ trait: trait, traitNum: traitNum, value: value, cMales: cMales, cFemales: cFemales, cTotal: cTotal, cPct: cPct,
            tMales: tMales, tFemales: tFemales, tTotal: tTotal, tPct: tPct });
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      ++traitNum;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return React.createElement(
    'div',
    { className: 'geniblocks stats' },
    React.createElement(
      'table',
      { id: 'stats-table', className: orgs.length > 0 ? "has-data" : "no-data" },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Trait Value'
          ),
          React.createElement(
            'th',
            { colSpan: '2' },
            'Clutch'
          ),
          React.createElement(
            'th',
            null,
            'F'
          ),
          React.createElement(
            'th',
            null,
            'M'
          ),
          React.createElement(
            'th',
            { colSpan: '2' },
            'Total'
          ),
          React.createElement(
            'th',
            null,
            'F'
          ),
          React.createElement(
            'th',
            null,
            'M'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        rows.map(function (row, index) {
          return React.createElement(
            'tr',
            { key: index, className: row.traitNum & 1 ? "odd-trait" : "even-trait" },
            React.createElement(
              'td',
              { className: 'label' },
              row.value
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cTotal
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cPct,
              '%'
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cFemales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cMales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tTotal
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tPct,
              '%'
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tFemales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tMales
            )
          );
        })
      )
    )
  );
};

StatsView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  lastClutchSize: React.PropTypes.number
};

exports.default = StatsView;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29kZS9hcHAuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaXJjdWxhci1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZWVkYmFjay5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUtcG9vbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUtdGVzdC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9zdGF0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNLQSxJQUNFLG9CQUFvQixRQUFRLDZCQUFSLEVBQXVD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O0FBNEVsQixVQUFVLFNBQVYsR0FBc0I7QUFDcEIsUUFBTSxNQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBd0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXhCLENBQWdELFVBQWhEO0FBQ04sa0JBQWdCLE1BQU0sU0FBTixDQUFnQixNQUFoQjtDQUZsQjs7a0JBS2UiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAqIFNlZSBodHRwczovL21lZGl1bS5jb20vQGtlbnRjZG9kZHMvbWlzdW5kZXJzdGFuZGluZy1lczYtbW9kdWxlcy11cGdyYWRpbmctYmFiZWwtdGVhcnMtYW5kLWEtc29sdXRpb24tYWQyZDVhYjkzY2UwIy5xMXZja2ZmaXdcbiAqIChLZW50IEMuIERvZGRzLCBcIk1pc3VuZGVyc3RhbmRpbmcgRVM2IE1vZHVsZXMsIFVwZ3JhZGluZyBCYWJlbCwgVGVhcnMsIGFuZCBhIFNvbHV0aW9uXCIpXG4gKiBmb3IgZGVzY3JpcHRpb24gb2Ygc29tZSBvZiB0aGUgZGV0YWlscyBpbnZvbHZlZCBpbiBtaXhpbmcgRVM2IGV4cG9ydCB3aXRoIHJlcXVpcmUoKS5cbiAqL1xuY29uc3RcbiAgQWxsZWxlRmlsdGVyc1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMnKS5kZWZhdWx0LFxuICBBbGxlbGVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FsbGVsZScpLmRlZmF1bHQsXG4gIEFuaW1hdGVkR2FtZXRlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9hbmltYXRlZC1nYW1ldGUnKS5kZWZhdWx0LFxuICBDaGFuZ2VTZXhCdXR0b25zID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucycpLmRlZmF1bHQsXG4gIENocm9tb3NvbWVJbWFnZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZScpLmRlZmF1bHQsXG4gIENocm9tb3NvbWVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnKS5kZWZhdWx0LFxuICBDaXJjdWxhckdsb3dWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cnKS5kZWZhdWx0LFxuICBGZWVkYmFja1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZmVlZGJhY2snKS5kZWZhdWx0LFxuICBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlJykuZGVmYXVsdCxcbiAgR2FtZXRlUG9vbFZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wnKS5kZWZhdWx0LFxuICBHYW1ldGVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dhbWV0ZScpLmRlZmF1bHQsXG4gIEdlbmVMYWJlbFZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCcpLmRlZmF1bHQsXG4gIEdlbm9tZVRlc3RWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dlbm9tZS10ZXN0JykuZGVmYXVsdCxcbiAgR2Vub21lVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5vbWUnKS5kZWZhdWx0LFxuICBPcmdhbmlzbVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvb3JnYW5pc20nKS5kZWZhdWx0LFxuICBPcmdhbmlzbUdsb3dWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL29yZ2FuaXNtLWdsb3cnKS5kZWZhdWx0LFxuICBQZW5WaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3BlbicpLmRlZmF1bHQsXG4gIFF1ZXN0aW9uR2xvd1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdycpLmRlZmF1bHQsXG4gIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93JykuZGVmYXVsdCxcbiAgU3RhdHNWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3N0YXRzJykuZGVmYXVsdDtcblxuZXhwb3J0IHtcbiAgQWxsZWxlRmlsdGVyc1ZpZXcsXG4gIEFsbGVsZVZpZXcsXG4gIEFuaW1hdGVkR2FtZXRlVmlldyxcbiAgQ2hhbmdlU2V4QnV0dG9ucyxcbiAgQ2hyb21vc29tZUltYWdlVmlldyxcbiAgQ2hyb21vc29tZVZpZXcsXG4gIENpcmN1bGFyR2xvd1ZpZXcsXG4gIEZlZWRiYWNrVmlldyxcbiAgRmVydGlsaXppbmdHYW1ldGVWaWV3LFxuICBHYW1ldGVQb29sVmlldyxcbiAgR2FtZXRlVmlldyxcbiAgR2VuZUxhYmVsVmlldyxcbiAgR2Vub21lVGVzdFZpZXcsXG4gIEdlbm9tZVZpZXcsXG4gIE9yZ2FuaXNtVmlldyxcbiAgT3JnYW5pc21HbG93VmlldyxcbiAgUGVuVmlldyxcbiAgUXVlc3Rpb25HbG93VmlldyxcbiAgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3LFxuICBTdGF0c1ZpZXdcbn07XG4iLCJjb25zdCBBbGxlbGVGaWx0ZXJzVmlldyA9ICh7c3BlY2llcywgaGlkZGVuQWxsZWxlcz1bXSwgZGlzYWJsZWRBbGxlbGVzID0gW10sIG9uRmlsdGVyQ2hhbmdlfSkgPT4ge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBuZXcgU2V0LFxuICAgICAgZ2VuZUlucHV0cyA9IFtdO1xuXG4gIGZvciAoY29uc3QgYWxsZWxlIG9mIGhpZGRlbkFsbGVsZXMpIHtcbiAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpO1xuICAgIGlmIChnZW5lKVxuICAgICAgaGlkZGVuR2VuZXMuYWRkKGdlbmUubmFtZSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGdlbmUgaW4gc3BlY2llcy5nZW5lTGlzdCkge1xuICAgIGlmICghaGlkZGVuR2VuZXMuaGFzKGdlbmUpKSB7XG4gICAgICBjb25zdCBhbGxlbGVzID0gc3BlY2llcy5nZW5lTGlzdFtnZW5lXS5hbGxlbGVzLFxuICAgICAgICAgICAgYWxsZWxlSXRlbXMgPSBhbGxlbGVzLm1hcChhbGxlbGUgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gIShkaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID49IDApO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5MZWZ0XCI6IFwiOHB4XCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9Lz5cbiAgICAgICAgICAgICAgICAgIHtuYW1lfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIGdlbmVJbnB1dHMucHVzaChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5lLWFsbGVsZS1saXN0XCIga2V5PXtnZW5lfT57YWxsZWxlSXRlbXN9PC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuIFxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICBhbGxlbGUgPSBlbHQgJiYgZWx0LnZhbHVlLFxuICAgICAgICAgIGlzQ2hlY2tlZCA9IGVsdCAmJiBlbHQuY2hlY2tlZDtcbiAgICBpZiAob25GaWx0ZXJDaGFuZ2UgJiYgYWxsZWxlKVxuICAgICAgb25GaWx0ZXJDaGFuZ2UoZXZ0LCBhbGxlbGUsIGlzQ2hlY2tlZCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUtZmlsdGVyc1wiXG4gICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5Ub3BcIjogXCI1cHhcIiwgXCJtYXJnaW5Cb3R0b21cIjogXCI1cHhcIiB9fT5cbiAgICAgIHsgZ2VuZUlucHV0cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5BbGxlbGVGaWx0ZXJzVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc2FibGVkQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIG9uRmlsdGVyQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVGaWx0ZXJzVmlldztcbiIsImNvbnN0IEFsbGVsZVZpZXcgPSAoe2FsbGVsZSwgdGFyZ2V0LCBjb2xvciwgc2hhcGUsIGhvdmVyaW5nfSkgPT4ge1xuICBsZXQgd2lkdGg9MjEsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgc3Ryb2tlID0gdGFyZ2V0ID8gXCIjMDAwMDAwXCIgOiBcIm5vbmVcIixcbiAgICAgIGZpbGwgPSBhbGxlbGUgPyBjb2xvciA6IFwid2hpdGVcIixcbiAgICAgIHN0cm9rZVdpZHRoID0gaG92ZXJpbmcgPyAzIDogMSxcbiAgICAgIHN0cm9rZURhc2hhcnJheT0gYWxsZWxlID8gXCIwXCIgOiBcIjFcIixcbiAgICAgIHN2Z1NoYXBlID0gbnVsbDtcblxuICBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcbiAgICBzdmdTaGFwZSA9IDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzF9IGN4PXtyYWRpdXMrMX0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH0gZWxzZSB7XG4gICAgc3ZnU2hhcGUgPSA8cmVjdCB3aWR0aD17KHJhZGl1cyoyKX0gaGVpZ2h0PXsocmFkaXVzKjIpfSB4PVwiMVwiIHk9XCIxXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH1cblxuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17d2lkdGgrMn0gaGVpZ2h0PXt3aWR0aCsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgeyBzdmdTaGFwZSB9XG4gICAgICAgIDx0ZXh0IHg9e3JhZGl1cysxfSB5PXtyYWRpdXMrN30gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ3aGl0ZVwiPnthbGxlbGV9PC90ZXh0PlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlVmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZSB0aGF0IGFuaW1hdGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IFtpbml0aWFsRGlzcGxheV0gLSBpbml0aWFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnhdIC0gaW5pdGlhbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS55XSAtIGluaXRpYWwgbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5zaXplPTMwXSAtIGluaXRpYWwgc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkucm90YXRpb249MF0gLSBpbml0aWFsIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkub3BhY2l0eT0xXSAtIGluaXRpYWwgb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGZpbmFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gZmluYWwgbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBmaW5hbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBmaW5hbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gZmluYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBmaW5hbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW5pbVN0aWZmbmVzcz0xMDBdIC0gc3ByaW5nIHN0aWZmbmVzcyB1c2VkIHRvIGNvbnRyb2wgYW5pbWF0aW9uIHNwZWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvblJlY3QoKV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGF0IHJlc3RcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuaW1wb3J0IEdhbWV0ZVZpZXcgZnJvbSAnLi9nYW1ldGUnO1xuXG5jb25zdCBBbmltYXRlZEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXM9W10sIGluaXRpYWxEaXNwbGF5LCBkaXNwbGF5LCBhbmltU3RpZmZuZXNzPTEwMCwgaXNTZWxlY3RlZD1mYWxzZSwgaXNEaXNhYmxlZD1mYWxzZSwgb25DbGljaywgb25SZXN0fSkgPT4ge1xuXG4gIGNvbnN0IGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgaW5pdGlhbCA9IGluaXRpYWxEaXNwbGF5IHx8IGRpc3BsYXksXG4gICAgICAgIGluaXRpYWxTaXplID0gaW5pdGlhbC5zaXplIHx8IDMwLFxuICAgICAgICBpbml0aWFsUm90YXRpb24gPSBpbml0aWFsLnJvdGF0aW9uICE9IG51bGwgPyBpbml0aWFsLnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgaW5pdGlhbE9wYWNpdHkgPSBpbml0aWFsLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWwub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgZmluYWxTaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICBmaW5hbFJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGZpbmFsT3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICBzcHJpbmdDb25maWcgPSB7IHN0aWZmbmVzczogYW5pbVN0aWZmbmVzcyB9O1xuICAvKiBlc2xpbnQgcmVhY3QvZGlzcGxheS1uYW1lOjAgKi9cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RNb3Rpb24uTW90aW9uIGRlZmF1bHRTdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBpbml0aWFsLngsIHk6IGluaXRpYWwueSwgc2l6ZTogaW5pdGlhbFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uOiBpbml0aWFsUm90YXRpb24sIG9wYWNpdHk6IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeDogUmVhY3RNb3Rpb24uc3ByaW5nKGRpc3BsYXkueCwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeTogUmVhY3RNb3Rpb24uc3ByaW5nKGRpc3BsYXkueSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsU2l6ZSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbFJvdGF0aW9uLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWxPcGFjaXR5LCBzcHJpbmdDb25maWcpXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT5cbiAgICAgICAgICA8R2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2lkfSBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfSBcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5PXtpbnRlcnBvbGF0ZWRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfSBpc0Rpc2FibGVkPXtpc0Rpc2FibGVkfSBvbkNsaWNrPXtvbkNsaWNrfSAvPlxuICAgICAgfVxuICAgIDwvUmVhY3RNb3Rpb24uTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRHYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICBpbml0aWFsRGlzcGxheTogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHsgLy8gaW5pdGlhbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KSxcbiAgZGlzcGxheTogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGZpbmFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGFuaW1TdGlmZm5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgaXNTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRHYW1ldGVWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgbWFsZS9mZW1hbGUgY2hhbmdlIGJ1dHRvbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXggLSBbJ21hbGUnIHwgJ2ZlbWFsZSddIGN1cnJlbnRseSBzZWxlY3RlZCBidXR0b25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ2hhbmdlKGV2dCwgc2V4KSAtIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHVzZSBjbGlja3MgdG8gY2hhbmdlIHNleFxuICovXG5jb25zdCBDaGFuZ2VTZXhCdXR0b25zID0gKHtzZXgsIHNwZWNpZXMsIHNob3dMYWJlbCwgc3R5bGU9e30sIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCBjYXBTZXggPSBzZXguc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBzZXguc3Vic3RyKDEpLFxuICAgICAgICBzZWxlY3RlZFNleENsYXNzID0gc2V4ID09PSAnbWFsZScgPyBcIm1hbGUtc2VsZWN0ZWRcIiA6IFwiZmVtYWxlLXNlbGVjdGVkXCIsXG4gICAgICAgIEJVVFRPTl9JTUFHRV9XSURUSCA9IDEwMCxcbiAgICAgICAgQlVUVE9OX0lNQUdFX01JRFBPSU5UX1ggPSBCVVRUT05fSU1BR0VfV0lEVEggLyAyLFxuICAgICAgICBpbWFnZVN0eWxlID0gT2JqZWN0LmFzc2lnbihzdHlsZSwge3Bvc2l0aW9uOiAnYWJzb2x1dGUnfSksXG4gICAgICAgIGxhYmVsID0gc2hvd0xhYmVsID8gYCR7Y2FwU2V4fSAke3NwZWNpZXN9YCA6ICcnLFxuICAgICAgICBsYWJlbEVsZW1lbnQgPSBzaG93TGFiZWwgPyA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBCVVRUT05fSU1BR0VfV0lEVEgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwfX0+e2xhYmVsfTwvZGl2PiA6ICcnO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnN0IGVsdFJlY3QgPSBldnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIGNsaWNrWCA9IGV2dC5jbGllbnRYIC0gZWx0UmVjdC5sZWZ0O1xuICAgIGlmICgoc2V4ID09PSAnbWFsZScpICE9PSAoY2xpY2tYID4gQlVUVE9OX0lNQUdFX01JRFBPSU5UX1gpKVxuICAgICAgb25DaGFuZ2UoZXZ0LCBzZXggPT09ICdtYWxlJyA/ICdmZW1hbGUnIDogJ21hbGUnKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICA8ZGl2ICBjbGFzc05hbWU9e2BnZW5pYmxvY2tzIGNoYW5nZS1zZXgtYnV0dG9ucyAke3NlbGVjdGVkU2V4Q2xhc3N9YH1cbiAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30gPlxuICAgICAgPC9kaXY+XG4gICAgICB7bGFiZWxFbGVtZW50fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hhbmdlU2V4QnV0dG9ucy5wcm9wVHlwZXMgPSB7XG4gIHNleDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnbWFsZScsICdmZW1hbGUnXSkuaXNSZXF1aXJlZCxcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgc2hvd0xhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgc3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VTZXhCdXR0b25zO1xuIiwiY29uc3QgQ2hyb21vc29tZUltYWdlVmlldyA9ICgpID0+IHtcbiAgbGV0IHdpZHRoPTIzLFxuICAgICAgaGVpZ2h0PTEyNixcbiAgICAgIHNwbGl0PTQ1LFxuICAgICAgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgIGltYWdlV2lkdGggPSB3aWR0aCs0LFxuICAgICAgaGFsZkltYWdlV2lkdGggPSBpbWFnZVdpZHRoLzIsXG4gICAgICBpbWFnZUhlaWdodCA9IGhlaWdodCs0LFxuICAgICAgY29sb3IgPSBcIiNGRjk5OTlcIjtcblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e2ltYWdlV2lkdGh9IGhlaWdodD17aW1hZ2VIZWlnaHR9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysyfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdCtyYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17aGVpZ2h0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPHJlY3QgaGVpZ2h0PXsoc3BsaXQtcmFkaXVzKS0ocmFkaXVzKzIpfSB3aWR0aD17d2lkdGh9IHk9e3JhZGl1cysyfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhoZWlnaHQtcmFkaXVzKS0oc3BsaXQrcmFkaXVzKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPVwiMlwiICAgICAgIHkyPXtzcGxpdC1yYWRpdXMrMn0gIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT1cIjJcIiAgICAgICB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9e3dpZHRoKzJ9IHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPXt3aWR0aCsyfSBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJpbXBvcnQgQ2hyb21vc29tZUltYWdlVmlldyBmcm9tICcuL2Nocm9tb3NvbWUtaW1hZ2UnO1xuaW1wb3J0IEdlbmVMYWJlbFZpZXcgZnJvbSAnLi9nZW5lLWxhYmVsJztcblxuY29uc3QgZmlsdGVyQWxsZWxlcyA9IGZ1bmN0aW9uKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIHNwZWNpZXMpIHtcbiAgbGV0IGhpZGRlbkdlbmVzID0gaGlkZGVuQWxsZWxlcy5tYXAoIGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gIHJldHVybiBhbGxlbGVzLmZpbHRlciggYSA9PiB7XG4gICAgbGV0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpO1xuICAgIHJldHVybiBoaWRkZW5HZW5lcy5pbmRleE9mKGdlbmUpID09PSAtMTtcbiAgfSk7XG59O1xuXG5jb25zdCBDaHJvbW9zb21lVmlldyA9ICh7b3JnLCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgaGlkZGVuQWxsZWxlcz1bXSwgYWxsZWxlQ2hhbmdlZCwgbGFiZWxzT25SaWdodD10cnVlfSkgPT4ge1xuICBsZXQgYWxsZWxlcyA9IG9yZy5nZXRHZW5vdHlwZSgpLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXVtzaWRlXS5hbGxlbGVzLFxuICAgICAgdmlzaWJsZUFsbGVsZXMgPSBmaWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIG9yZy5zcGVjaWVzKSxcbiAgICAgIGxhYmVscyAgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEdlbmVMYWJlbFZpZXcga2V5PXthfSBzcGVjaWVzPXtvcmcuc3BlY2llc30gYWxsZWxlPXthfSBlZGl0YWJsZT17dHJ1ZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoYSwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICAgICk7XG4gICAgICB9KSxcblxuICAgICAgY29udGFpbmVyQ2xhc3MgPSBcIml0ZW1zXCI7XG5cbiAgaWYgKCFsYWJlbHNPblJpZ2h0KSB7XG4gICAgY29udGFpbmVyQ2xhc3MgKz0gXCIgcnRsXCI7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsc1wiPlxuICAgICAgICAgIHsgbGFiZWxzIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNocm9tb3NvbWVOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpZGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYWJlbHNPblJpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZVZpZXc7XG4iLCJjb25zdCBDaXJjdWxhckdsb3dWaWV3ID0gKHtjb2xvciwgc2l6ZSwgc3R5bGV9KSA9PiB7XG4gIGxldCByYWRpdXMgPSBzaXplLzIsXG4gICAgICBjb2xvck5vSGFzaCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBncmFkaWVudElEID0gYENpcmN1bGFyR2xvd1ZpZXdfJHtjb2xvck5vSGFzaH1gLFxuICAgICAgZ3JhZGllbnRJRFVybCA9IGB1cmwoIyR7Z3JhZGllbnRJRH0pYDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lcz1cImdlbmlibG9ja3MgZ2xvd1wiIHN0eWxlPXtzdHlsZX0+XG4gICAgICA8c3ZnIHdpZHRoPXtzaXplKzJ9IGhlaWdodD17c2l6ZSsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxkZWZzPlxuICAgICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD17Z3JhZGllbnRJRH0+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMS4wXCIvPlxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMC4wXCIvPlxuICAgICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+XG4gICAgICAgIDwvZGVmcz5cbiAgICAgICAgPGNpcmNsZSBmaWxsPXtncmFkaWVudElEVXJsfSBjeD17cmFkaXVzfSBjeT17cmFkaXVzfSByPXtyYWRpdXN9IC8+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNpcmN1bGFyR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2lyY3VsYXJHbG93VmlldztcbiIsImNvbnN0IEZlZWRiYWNrVmlldyA9ICh7dGV4dCwgc3R5bGU9e319KSA9PiB7XG4gIGNvbnN0IHRUZXh0ID0gQXJyYXkuaXNBcnJheSh0ZXh0KSA/IHRleHQgOiBbdGV4dF0sXG4gICAgICAgIGxpbmVDb3VudCA9IHRUZXh0Lmxlbmd0aCxcbiAgICAgICAgaGVpZ2h0ID0gMjAgKiBsaW5lQ291bnQgKyAyLFxuICAgICAgICBkZWZhdWx0U3R5bGUgPSB7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjODc3ODcxJyxcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGJsYWNrJyxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIGZvbnRTaXplOiAnMTFwdCcsXG4gICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnXG4gICAgICAgIH0sXG4gICAgICAgIHRTdHlsZSA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdFN0eWxlLCBzdHlsZSksXG4gICAgICAgIHRleHRMaW5lcyA9IHRUZXh0Lm1hcCgoaVRleHQsIGluZGV4KSA9PiA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2sgdGV4dC1saW5lXCIga2V5PXtpbmRleH0+e2lUZXh0fTwvZGl2Pik7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2tcIiBzdHlsZT17dFN0eWxlfT5cbiAgICAgIHt0ZXh0TGluZXN9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5GZWVkYmFja1ZpZXcucHJvcFR5cGVzID0ge1xuICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpXG4gICAgICAgIF0pLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBGZWVkYmFja1ZpZXc7XG4iLCJpbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgSU5JVElBTF9HQU1FVEVfU0laRSA9IDMwLFxuICAgICAgRklOQUxfR0FNRVRFX1NJWkUgPSAxNDAsXG4gICAgICBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCA9IDAsXG4gICAgICBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDE1MCxcbiAgICAgIEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCA9IDcwLFxuICAgICAgRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YID0gODAsXG4gICAgICBGSU5BTF9aWUdPVEVfWSA9IC0xNTA7XG5cbmV4cG9ydCBjb25zdCBHQU1FVEVfVFlQRSA9IHsgTU9USEVSOiAnbW90aGVyJywgRkFUSEVSOiAnZmF0aGVyJyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdHlwZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsgR0FNRVRFX1RZUEUuTU9USEVSLCBHQU1FVEVfVFlQRS5GQVRIRVIgXSkuaXNSZXF1aXJlZCxcbiAgICBnYW1ldGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGZlcnRpbGl6YXRpb25TdGF0ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnbm9uZScsICdmZXJ0aWxpemluZycsICdmZXJ0aWxpemVkJywgJ2NvbXBsZXRlJ10pLmlzUmVxdWlyZWQsXG4gICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gICAgc3JjUmVjdDogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgZHN0UmVjdDogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICAgIG9uUmVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGlkZGVuQWxsZWxlczogW10sXG4gICAgYW5pbVN0aWZmbmVzczogMTAwXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlciA9ICgpID0+IHtcbiAgICBsZXQge2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXMsIGFuaW1TdGlmZm5lc3MsIG9uUmVzdH0gPSB0aGlzLnByb3BzLFxuICAgICAgICB4T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LmxlZnQgLSB0aGlzLnByb3BzLmRzdFJlY3QubGVmdCA6IDAsXG4gICAgICAgIHlPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QudG9wIC0gdGhpcy5wcm9wcy5kc3RSZWN0LnRvcCA6IDAsXG4gICAgICAgIHhSZXN0aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogUkVTVElOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIHhGZXJ0aWxpemluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICBpbml0aWFsLCBmaW5hbDtcblxuICAgIGlmICghZ2FtZXRlIHx8ICFpZCkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnbm9uZScpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUilcbiAgICAgICAgeE9mZnNldCArPSBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWDtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhPZmZzZXQsIHk6IHlPZmZzZXQsIHNpemU6IElOSVRJQUxfR0FNRVRFX1NJWkUgfTtcbiAgICAgIGZpbmFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdmZXJ0aWxpemluZycpIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgb3BhY2l0eTogMS4wIH07XG4gICAgICBmaW5hbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIGZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IEZJTkFMX1pZR09URV9ZLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDAuMCB9O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXtpbml0aWFsfSBkaXNwbGF5PXtmaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc30gb25SZXN0PXtvblJlc3R9IC8+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IEdhbWV0ZVBvb2xWaWV3ID0gKHtnYW1ldGVzLCBoaWRkZW5BbGxlbGVzPVtdLCB3aWR0aD0zMDAsIGhlaWdodD0yMDAsIGFuaW1TdGlmZm5lc3M9NjAsIHNlbGVjdGVkSWQsIGlzR2FtZXRlRGlzYWJsZWQsIG9uR2FtZXRlU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBnYW1ldGVDb3VudCA9IGdhbWV0ZXMubGVuZ3RoLFxuICAgICAgZ2FtZXRlU2l6ZSA9IDMwLFxuICAgICAgbWFyZ2luID0gNSxcbiAgICAgIHNwYWNpbmdEZWZhdWx0ID0gZ2FtZXRlU2l6ZSArIDIgKiBtYXJnaW4sXG4gICAgICB4U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgeVNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIGNvbERlZmF1bHQgPSBNYXRoLmZsb29yKHdpZHRoIC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgcm93RGVmYXVsdCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgZW5hYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRGbGFncyA9IGdhbWV0ZXMubWFwKGcgPT4gaXNHYW1ldGVEaXNhYmxlZChnKSksXG4gICAgICB0b3RhbERpc2FibGVkQ291bnQgPSBkaXNhYmxlZEZsYWdzLnJlZHVjZSgodG90YWwsZmxhZykgPT4gdG90YWwgKyBmbGFnLCAwKSxcbiAgICAgIC8vIGxlYXZlIHJvb20gZm9yIHRoZSBkaXNhYmxlZCBnYW1ldGUgcm93IGlmIHRoZXJlIGFyZSBkaXNhYmxlZCBnYW1ldGVzXG4gICAgICBhdmFpbGFibGVIZWlnaHQgPSBoZWlnaHQgLSAodG90YWxEaXNhYmxlZENvdW50ID8gc3BhY2luZ0RlZmF1bHQgOiAwKSAtIDQgKiBtYXJnaW4sXG4gICAgICAvLyBwYWNrIHRoZSBkaXNhYmxlZCBnYW1ldGVzIGludG8gdGhlIGRpc2FibGVkIHJvd1xuICAgICAgeERpc2FibGVkU3BhY2luZyA9IE1hdGgubWluKHhTcGFjaW5nIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod2lkdGggLSA3ICogbWFyZ2luKSAvIHRvdGFsRGlzYWJsZWRDb3VudCksXG4gICAgICB5RGlzYWJsZWRTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB0b3RhbEVuYWJsZWRDb3VudCA9IGdhbWV0ZUNvdW50IC0gdG90YWxEaXNhYmxlZENvdW50LFxuICAgICAgZ2FtZXRlVmlld3M7XG5cbiAgLy8gc3F1ZWV6ZSBpbiB0byBtYWtlIHJvb20gZm9yIGFkZGl0aW9uYWwgZ2FtZXRlcyBpZiBuZWNlc3NhcnlcbiAgdmFyIGNvbENvdW50ID0gY29sRGVmYXVsdCxcbiAgICAgIHJvd0NvdW50ID0gcm93RGVmYXVsdCAtICh0b3RhbERpc2FibGVkQ291bnQgPiAwKTtcbiAgd2hpbGUgKGNvbENvdW50ICogcm93Q291bnQgPCB0b3RhbEVuYWJsZWRDb3VudCkge1xuICAgIGlmICh5U3BhY2luZyA+IHhTcGFjaW5nKSB7XG4gICAgICB5U3BhY2luZyA9IGF2YWlsYWJsZUhlaWdodCAvICsrcm93Q291bnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeFNwYWNpbmcgPSAod2lkdGggLSA0ICogbWFyZ2luKSAvICsrY29sQ291bnQ7XG4gICAgfVxuICB9XG5cbiAgZ2FtZXRlVmlld3MgPSBnYW1ldGVzLm1hcCgoZ2FtZXRlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBkaXNhYmxlZEZsYWdzW2luZGV4XSxcbiAgICAgICAgICBsYXlvdXRJbmRleCA9IGlzRGlzYWJsZWQgPyBkaXNhYmxlZENvdW50KysgOiBlbmFibGVkQ291bnQrKyxcbiAgICAgICAgICByb3cgPSBpc0Rpc2FibGVkID8gcm93RGVmYXVsdCAtIDEgOiBNYXRoLmZsb29yKGxheW91dEluZGV4IC8gY29sQ291bnQpLFxuICAgICAgICAgIGNvbCA9IGlzRGlzYWJsZWQgPyBsYXlvdXRJbmRleCA6IGxheW91dEluZGV4ICUgY29sQ291bnQsXG4gICAgICAgICAgeSA9IGlzRGlzYWJsZWQgPyByb3cgKiB5RGlzYWJsZWRTcGFjaW5nIDogcm93ICogeVNwYWNpbmcsXG4gICAgICAgICAgeCA9IGlzRGlzYWJsZWQgPyBjb2wgKiB4RGlzYWJsZWRTcGFjaW5nIDogY29sICogeFNwYWNpbmc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpbmRleCArIDF9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXt7IHg6IE1hdGgucm91bmQod2lkdGgvMiksIHk6IC1NYXRoLnJvdW5kKHlTcGFjaW5nKSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5PXt7IHg6IE1hdGgucm91bmQoeCksIHk6IE1hdGgucm91bmQoeSkgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggKyAxID09PSBzZWxlY3RlZElkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkdhbWV0ZVNlbGVjdGVkfSAvPlxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdhbWV0ZS1wb29sXCIgc3R5bGU9e3sgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9fT5cbiAgICAgIHsgZ2FtZXRlVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlUG9vbFZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgc2VsZWN0ZWRJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaXNHYW1ldGVEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9uR2FtZXRlU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVQb29sVmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnYW1ldGUgLSBCaW9sb2dpY2EgZ2FtZXRlIChtYXAgb2YgY2hyb21vc29tZSBuYW1lcyB0byBjaHJvbW9zb21lcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1ldGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IGhpZGRlbkFsbGVsZXMgLSBpbmRpdmlkdWFsIGFsbGVsZXMgb2YgZ2VuZXMgZm9yIHdoaWNoIGFsbCBhbGxlbGVzIHNob3VsZCBiZSBoaWRkZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtib29sZWFufSBbaXNTZWxlY3RlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdzZWxlY3RlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNEaXNhYmxlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdkaXNhYmxlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uQ2xpY2soZXZ0LCBpZCwgcmVjdCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGdhbWV0ZSBpcyBjbGlja2VkXG4gKlxuICogTm90ZTogQXMgdGhpbmdzIHN0YW5kIGN1cnJlbnRseSwgdGhlcmUgaXMgX25vXyBwYXJ0aWN1bGFyIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgZGVmaW5lZFxuICogYnkgdGhpcyB2aWV3LiBUaGUgY2xpZW50IGNhbiBzdHlsZSB0aGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBieSBzdHlsaW5nIHRoZVxuICogJy5nZW5pYmxvY2tzLmdhbWV0ZScgY2xhc3MgaW4gQ1NTLCBlLmcuIGJ5IGFzc2lnbmluZyBhIGJhY2tncm91bmQtaW1hZ2UuXG4gKi9cbmNvbnN0IEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXM9W10sIGRpc3BsYXksIGlzU2VsZWN0ZWQ9ZmFsc2UsIGlzRGlzYWJsZWQ9ZmFsc2UsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICByZWN0ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICghaXNEaXNhYmxlZCkge1xuICAgICAgb25DbGljayhldnQsIGlkLCByZWN0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKSB7XG4gICAgbGV0IHRvb2x0aXAgPSBcIlwiLFxuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzO1xuICAgIC8vIE5vdGU6IGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IGZvciB0aGUgY2FsbGVyIHRvIHBhc3MgaW4gdGhlXG4gICAgLy8gYWxsSGlkZGVuQWxsZWxlcyBhcnJheSByYXRoZXIgdGhhbiBjb21wdXRpbmcgaXQgZWFjaCB0aW1lIGhlcmUuXG4gICAgLy8gQnV0IGlmIHdlIG1vdmVkIGl0IG91dCByaWdodCBub3cgd2UnZCBoYXZlIHRvIGVsaW1pbmF0ZSB0aGUgRVM2IHNwbGF0LlxuICAgIGZ1bmN0aW9uIGNvbmNhdEhpZGRlbkFsbGVsZXMoaVNwZWNpZXMsIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICBhbGxIaWRkZW5BbGxlbGVzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShpU3BlY2llcywgYWxsZWxlKTtcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcy5wdXNoKC4uLmdlbmUuYWxsZWxlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2ggaW4gZ2FtZXRlKSB7XG4gICAgICB2YXIgY2hyb21vc29tZSA9IGdhbWV0ZVtjaF07XG4gICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcyA9PSBudWxsKVxuICAgICAgICBjb25jYXRIaWRkZW5BbGxlbGVzKGNocm9tb3NvbWUuc3BlY2llcywgaGlkZGVuQWxsZWxlcyk7XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBjaHJvbW9zb21lLmFsbGVsZXMpIHtcbiAgICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMuaW5kZXhPZihhbGxlbGUpIDwgMCkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hyb21vc29tZS5zcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgbGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PT0gJ1hZJykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNocm9tb3NvbWUuc2lkZSA9PT0gJ3knID8gJ3knIDogJ3gnO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENsYXNzID0gaXNTZWxlY3RlZCAmJiAhaXNEaXNhYmxlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkQ2xhc3MgPSBpc0Rpc2FibGVkID8gXCJkaXNhYmxlZFwiIDogXCJcIixcbiAgICAgICAgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBjbGFzc2VzID0gYGdlbmlibG9ja3MgZ2FtZXRlICR7c2VsZWN0ZWRDbGFzc30gJHtkaXNhYmxlZENsYXNzfSBncm91cCR7Z3JvdXB9YCxcbiAgICAgICAgc2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgcm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgdHJhbnNmb3JtID0gcm90YXRpb24gPyBgcm90YXRlKCR7cm90YXRpb259ZGVnKWAgOiAnJyxcbiAgICAgICAgb3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICB0b29sdGlwID0gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHRpdGxlPXt0b29sdGlwfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LngsIHRvcDogZGlzcGxheS55LFxuICAgICAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybSwgb3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzcGxheTogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGlzU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVZpZXc7XG4iLCJjb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGxldCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlIG5vbmVkaXRhYmxlXCI+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHsgYWxsZWxlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZVwiPlxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgYWxsZWxlIH0gb25DaGFuZ2U9eyBvbkFsbGVsZUNoYW5nZSB9PlxuICAgICAgICAgIHsgYWxsZWxlT3B0aW9ucyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvbkFsbGVsZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5cbmxldCBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICAgICAgbGV0IGhpZGRlbkdlbmVzID0gaGlkZGVuQWxsZWxlcy5tYXAoIGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gICAgICByZXR1cm4gYWxsZWxlcy5maWx0ZXIoIGEgPT4ge1xuICAgICAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgICAgIHJldHVybiBoaWRkZW5HZW5lcy5pbmRleE9mKGdlbmUpID09PSAtMTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgVGVzdFB1bGxkb3duVmlldyA9ICh7c3BlY2llcywgZ2VuZSwgc2VsZWN0aW9uLCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgICAgIGxldCBhbGxlbGVzID0gZ2VuZS5hbGxlbGVzLFxuICAgICAgICAgIGFsbGVsZU5hbWVzID0gYWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgICBudW1BbGxlbGVzID0gYWxsZWxlTmFtZXMubGVuZ3RoLFxuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zID0gW10sXG4gICAgICAgICAgY3VycmVudFNlbGVjdGlvbiA9IHNlbGVjdGlvbiB8fCBcInBsYWNlaG9sZGVyXCIsXG4gICAgICAgICAgaSwgajtcblxuICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT1cInBsYWNlaG9sZGVyXCIgdmFsdWU9XCJwbGFjZWhvbGRlclwiIGRpc2FibGVkPVwiZGlzYWJsZWRcIj5TZWxlY3QgYSBHZW5vdHlwZTwvb3B0aW9uPik7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1BbGxlbGVzOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gaTsgaiA8IG51bUFsbGVsZXM7IGorKykge1xuICAgICAgICAgIGxldCBrZXkgPSBpICsgXCIgXCIgKyBqLFxuICAgICAgICAgICAgICBzdHJpbmcgPSBhbGxlbGVOYW1lc1tpXSArIFwiIC8gXCIgKyBhbGxlbGVOYW1lc1tqXTtcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtrZXl9PntzdHJpbmd9PC9vcHRpb24+KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgY3VycmVudFNlbGVjdGlvbiB9IG9uQ2hhbmdlPXsgb25TZWxlY3Rpb25DaGFuZ2UgfT5cbiAgICAgICAgICB7IHBvc3NpYmxlQ29tYm9zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICApO1xuICAgIH07XG5cbmNvbnN0IEdlbm9tZVRlc3RWaWV3ID0gKHtvcmcsIGhpZGRlbkFsbGVsZXM9W10sIHNlbGVjdGlvbj17fSwgc2VsZWN0aW9uQ2hhbmdlZH0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBhbGxlbGVzID0gY2hyb21bT2JqZWN0LmtleXMoY2hyb20pWzBdXS5hbGxlbGVzLFxuICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgICBnZW5lcyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUob3JnLnNwZWNpZXMsIGEpKSxcbiAgICAgICAgcHVsbGRvd25zID0gZ2VuZXMubWFwKGcgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8VGVzdFB1bGxkb3duVmlld1xuICAgICAgICAgICAgICBrZXkgICAgICAgPSB7IGcubmFtZSB9XG4gICAgICAgICAgICAgIHNwZWNpZXMgICA9IHsgb3JnLnNwZWNpZXMgfVxuICAgICAgICAgICAgICBnZW5lICAgICAgPSB7IGcgfVxuICAgICAgICAgICAgICBzZWxlY3Rpb24gPSB7IHNlbGVjdGlvbltnLm5hbWVdIH1cbiAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UgPSB7IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZChnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICB9IH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIiBrZXk9e2Nocm9tb3NvbWVOYW1lfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5vbWUtdGVzdC1vcHRpb25zXCI+XG4gICAgICAgICAgeyBwdWxsZG93bnMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lLXRlc3RcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblRlc3RQdWxsZG93blZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGdlbmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgc2VsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBvblNlbGVjdGlvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuR2Vub21lVGVzdFZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBzZWxlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHNlbGVjdGlvbkNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVRlc3RWaWV3O1xuIiwiaW1wb3J0IENocm9tb3NvbWVWaWV3IGZyb20gJy4vY2hyb21vc29tZSc7XG5cbmNvbnN0IEdlbm9tZVZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcyA9IFtdLCBhbGxlbGVDaGFuZ2VkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgcGFpcnMucHVzaChcbiAgICAgICAgPENocm9tb3NvbWVWaWV3XG4gICAgICAgICAgb3JnPXtvcmd9XG4gICAgICAgICAga2V5PXtwYWlycy5sZW5ndGggKyAxfVxuICAgICAgICAgIGNocm9tb3NvbWVOYW1lPXtjaHJvbW9zb21lTmFtZX1cbiAgICAgICAgICBzaWRlPXtzaWRlfVxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgbGFiZWxzT25SaWdodD17cGFpcnMubGVuZ3RoPjB9XG4gICAgICAgICAgYWxsZWxlQ2hhbmdlZD17ZnVuY3Rpb24ocHJldkFsbGVsZSwgbmV3QWxsZWxlKSB7XG4gICAgICAgICAgICBhbGxlbGVDaGFuZ2VkKGNocm9tb3NvbWVOYW1lLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICk7XG4gICAgfVxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtcGFpclwiIGtleT17cGFpcldyYXBwZXJzLmxlbmd0aCArIDF9PlxuICAgICAgICB7IHBhaXJzIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lXCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgYWxsZWxlQ2hhbmdlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVmlldztcbiIsImltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG5jb25zdCBPcmdhbmlzbUdsb3dWaWV3ID0gKHtvcmcsIGNvbG9yLCBzaXplLCBpbml0aWFsU3R5bGU9e30sIGZpbmFsU3R5bGU9e30sIHN0aWZmbmVzcz02MCwgb25SZXN0fSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJ30sXG4gICAgICAgIGluaXRpYWxPcmdTdHlsZSA9IE9iamVjdC5hc3NpZ24oaW5pdGlhbFN0eWxlLCB7cG9zaXRpb246ICdhYnNvbHV0ZSd9KSxcbiAgICAgICAgZmluYWxPcmdTdHlsZSA9IE9iamVjdC5hc3NpZ24oZmluYWxTdHlsZSwge3Bvc2l0aW9uOiAnYWJzb2x1dGUnfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZXM9XCJnZW5pYmxvY2tzIG9yZ2FuaXNtLWdsb3dcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17Z2xvd1N0eWxlfS8+XG4gICAgICA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBjb2xvcj17Y29sb3J9IHdpZHRoPXtzaXplfVxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsU3R5bGU9e2luaXRpYWxPcmdTdHlsZX0gZmluYWxTdHlsZT17ZmluYWxPcmdTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgc3RpZmZuZXNzPXtzdGlmZm5lc3N9IG9uUmVzdD17b25SZXN0fSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbFN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBmaW5hbFN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBzdGlmZm5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIG9uUmVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtR2xvd1ZpZXc7XG4iLCJjb25zdCBPcmdhbmlzbVZpZXcgPSAoe29yZywgd2lkdGg9MjAwLCBpbml0aWFsU3R5bGU9e30sIGZpbmFsU3R5bGU9e30sIHN0aWZmbmVzcz02MCwgb25SZXN0IH0pID0+IHtcbiAgbGV0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgIHVybCAgICAgPSBiYXNlVXJsICsgb3JnLmdldEltYWdlTmFtZSgpLFxuICAgICAge3Bvc2l0aW9uOmlQb3NpdGlvbiwgLi4uaW5pdGlhbE1vdGlvbn0gPSBpbml0aWFsU3R5bGUsXG4gICAgICB7cG9zaXRpb246ZlBvc2l0aW9uLCAuLi5maW5hbE1vdGlvbn0gPSBmaW5hbFN0eWxlLFxuICAgICAgcG9zaXRpb24gPSBmUG9zaXRpb24gfHwgaVBvc2l0aW9uLFxuICAgICAgaW5pdGlhbCA9IE9iamVjdC5hc3NpZ24oeyBvcGFjaXR5OiAxLjAgfSwgaW5pdGlhbE1vdGlvbiksXG4gICAgICBmaW5hbCA9IE9iamVjdC5hc3NpZ24oeyBvcGFjaXR5OiAxLjAgfSwgZmluYWxNb3Rpb24pO1xuXG4gIGlmIChmaW5hbC5vcGFjaXR5ICE9PSBpbml0aWFsLm9wYWNpdHkpXG4gICAgZmluYWwub3BhY2l0eSA9IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbC5vcGFjaXR5LCB7IHN0aWZmbmVzczogc3RpZmZuZXNzIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPFJlYWN0TW90aW9uLk1vdGlvbiBkZWZhdWx0U3R5bGU9e2luaXRpYWx9IHN0eWxlPXtmaW5hbH0gb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0gT2JqZWN0LmFzc2lnbihpbnRlcnBvbGF0ZWRTdHlsZSwgcG9zaXRpb24gPyB7cG9zaXRpb259IDoge30pO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17dXJsfSB3aWR0aD17d2lkdGh9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L1JlYWN0TW90aW9uLk1vdGlvbj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbFN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBmaW5hbFN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBzdGlmZm5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIG9uUmVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbmNvbnN0IFBlblZpZXcgPSAoe29yZ3MsIHdpZHRoPTQwMCwgY29sdW1ucz01fSkgPT4ge1xuICBsZXQgb3JnV2lkdGggPSB3aWR0aC9jb2x1bW5zLFxuICAgICAgb3JnVmlld3MgPSBvcmdzLm1hcCgob3JnLCBpbmRleCkgPT4gKDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGtleT17aW5kZXh9IHdpZHRoPXtvcmdXaWR0aH0vPikpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHBlblwiPlxuICAgICAgeyBvcmdWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5QZW5WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBlblZpZXc7XG4iLCJpbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbkdsb3dWaWV3ID0gKHtnbG93Q29sb3IsIHNpemU9MjAwfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJ307XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgdGV4dC1nbG93XCIgc3R5bGU9e2NvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGNvbG9yPXtnbG93Q29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtnbG93U3R5bGV9Lz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyB0ZXh0LWdsb3cgcXVlc3Rpb24tbWFya1wiXG4gICAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiBcImFic29sdXRlXCIsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9fT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuICAvLyBIVE1MIHRleHQgbm9kZVxuICAvLzxkaXYgc3R5bGU9e3RTdHlsZX0+e3RleHR9PC9kaXY+XG5cbiAgLy8gU1ZHIHRleHQgbm9kZVxuICAvLzxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgLy8gIDx0ZXh0IHg9JzUwJyB5PScxNzUnIGZpbGw9JyMwRDBEOEMnIHN0eWxlPXt0U3R5bGV9PlxuICAvLyAgICB7dGV4dH1cbiAgLy8gIDwvdGV4dD5cbiAgLy88L3N2Zz5cbn07XG5cblF1ZXN0aW9uR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBnbG93Q29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25HbG93VmlldztcbiIsImltcG9ydCBPcmdhbmlzbUdsb3dWaWV3IGZyb20gJy4vb3JnYW5pc20tZ2xvdyc7XG5pbXBvcnQgUXVlc3Rpb25HbG93VmlldyBmcm9tICcuL3F1ZXN0aW9uLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2hpZGRlbiwgb3JnLCBjb2xvciwgc2l6ZSwgaW5pdGlhbFN0eWxlPXt9LCBmaW5hbFN0eWxlPXt9LCBzdGlmZm5lc3M9NjAsIG9uUmVzdH0pID0+IHtcbiAgY29uc3Qgb3JnVmlldyA9IDxPcmdhbmlzbUdsb3dWaWV3IG9yZz17b3JnfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsU3R5bGU9e2luaXRpYWxTdHlsZX0gZmluYWxTdHlsZT17ZmluYWxTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0aWZmbmVzcz17c3RpZmZuZXNzfSBvblJlc3Q9e29uUmVzdH0gLz4sXG4gICAgICAgIHF1ZXN0aW9uVmlldyA9IDxRdWVzdGlvbkdsb3dWaWV3IGdsb3dDb2xvcj17Y29sb3J9IHdpZHRoPXtzaXplfSAvPixcbiAgICAgICAgZmluYWxWaWV3ID0gaGlkZGVuID8gcXVlc3Rpb25WaWV3IDogb3JnVmlldztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lcz1cImdlbmlibG9ja3MgcXVlc3Rpb24tb3JnYW5pc20tZ2xvd1wiPlxuICAgICAge2ZpbmFsVmlld31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblF1ZXN0aW9uT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbFN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBmaW5hbFN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBzdGlmZm5lc3M6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIG9uUmVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGJyZWVkaW5nIHN0YXRpc3RpY3MgZm9yIGEgc2V0IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXNcbiAqIEBwYXJhbSB7T2JqZWN0W119IG9yZ3MgLSBhcnJheSBvZiBCaW9sb2dpY2Egb3JnYW5pc21zIGZvciB3aGljaCBzdGF0aXN0aWNzIGFyZSB0byBiZSBkaXNwbGF5ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmdzW10ucGhlbm90eXBlIC0gdGhlIHBoZW5vdHlwZSBvZiB0aGUgQmlvbG9naWNhIG9yZ2FuaXNtXG4gKiBAcGFyYW0ge251bWJlcn0gW2xhc3RDbHV0Y2hTaXplPW9yZ3MubGVuZ3RoXSAtIHRoZSBudW1iZXIgb2Ygb3JnYW5pc21zIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IHRoYXQgY29tcHJpc2UgdGhlIG1vc3QgcmVjZW50IGNsdXRjaFxuICovXG5jb25zdCBTdGF0c1ZpZXcgPSAoe29yZ3MsIGxhc3RDbHV0Y2hTaXplfSkgPT4ge1xuXG4gIGxldCB0cmFpdHMgPSBuZXcgTWFwLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGlmIG5vIHNpemUgc3BlY2lmaWVkLCBhc3N1bWUgdGhlcmUncyBvbmx5IG9uZSBjbHV0Y2hcbiAgaWYgKCFsYXN0Q2x1dGNoU2l6ZSkgbGFzdENsdXRjaFNpemUgPSBvcmdzLmxlbmd0aDtcblxuICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gIGZvciAoY29uc3QgW2luZGV4LCBvcmddIG9mIG9yZ3MuZW50cmllcygpKSB7XG4gICAgY29uc3QgY2x1dGNoS2V5ID0gJ2MnICsgb3JnLnNleDtcbiAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIE9iamVjdC5rZXlzKG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSkge1xuICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgIHRyYWl0VmFsdWVzID0gdHJhaXRzLmdldCh0cmFpdCkgfHwgbmV3IE1hcCxcbiAgICAgICAgICB2YWx1ZUNvdW50cyA9IHRyYWl0VmFsdWVzLmdldCh2YWx1ZSkgfHwgbmV3IE1hcDtcbiAgICAgIGlmICghdHJhaXRzLmhhcyh0cmFpdCkpIHRyYWl0cy5zZXQodHJhaXQsIHRyYWl0VmFsdWVzKTtcbiAgICAgIGlmICghdHJhaXRWYWx1ZXMuaGFzKHZhbHVlKSkgdHJhaXRWYWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUNvdW50cyk7XG4gICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICBpZiAoaW5kZXggPj0gb3Jncy5sZW5ndGggLSBsYXN0Q2x1dGNoU2l6ZSlcbiAgICAgICAgdmFsdWVDb3VudHMuc2V0KGNsdXRjaEtleSwgKHZhbHVlQ291bnRzLmdldChjbHV0Y2hLZXkpIHx8IDApICsgMSk7XG4gICAgICB2YWx1ZUNvdW50cy5zZXQob3JnLnNleCwgKHZhbHVlQ291bnRzLmdldChvcmcuc2V4KSB8fCAwKSArIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgY0ZlbWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjVG90YWwgPSBjTWFsZXMgKyBjRmVtYWxlcyxcbiAgICAgICAgICAgIGNQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiBjVG90YWwgLyBsYXN0Q2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiB0VG90YWwgLyBvcmdzLmxlbmd0aCk7XG4gICAgICByb3dzLnB1c2goeyB0cmFpdCwgdHJhaXROdW0sIHZhbHVlLCBjTWFsZXMsIGNGZW1hbGVzLCBjVG90YWwsIGNQY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TWFsZXMsIHRGZW1hbGVzLCB0VG90YWwsIHRQY3QgfSk7XG4gICAgfVxuICAgICsrIHRyYWl0TnVtO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgc3RhdHNcIj5cbiAgICAgIDx0YWJsZSBpZD1cInN0YXRzLXRhYmxlXCIgY2xhc3NOYW1lPXtvcmdzLmxlbmd0aCA+IDAgPyBcImhhcy1kYXRhXCIgOiBcIm5vLWRhdGFcIn0+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+VHJhaXQgVmFsdWU8L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+Q2x1dGNoPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+VG90YWw8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7XG4gICAgICAgICAgcm93cy5tYXAoZnVuY3Rpb24ocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyIGtleT17aW5kZXh9IGNsYXNzTmFtZT17cm93LnRyYWl0TnVtICYgMSA/IFwib2RkLXRyYWl0XCIgOiBcImV2ZW4tdHJhaXRcIn0+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImxhYmVsXCI+e3Jvdy52YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1BjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY0ZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY01hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50UGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50RmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50TWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblN0YXRzVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGxhc3RDbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0c1ZpZXc7XG4iXX0=
