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
var
// components
AlleleFiltersView = require('./components/allele-filters').default,
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
    StatsView = require('./components/stats').default,

// utilities
GeneticsUtils = require('./utilities/genetics-utils').default;

exports.
// components
AlleleFiltersView = AlleleFiltersView;
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
exports.
// utilities
GeneticsUtils = GeneticsUtils;

},{"./components/allele":3,"./components/allele-filters":2,"./components/animated-gamete":4,"./components/change-sex-buttons":5,"./components/chromosome":7,"./components/chromosome-image":6,"./components/circular-glow":8,"./components/feedback":9,"./components/fertilizing-gamete":10,"./components/gamete":12,"./components/gamete-pool":11,"./components/gene-label":13,"./components/genome":15,"./components/genome-test":14,"./components/organism":17,"./components/organism-glow":16,"./components/pen":18,"./components/question-glow":19,"./components/question-organism-glow":20,"./components/stats":21,"./utilities/genetics-utils":22}],2:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class providing utility functions for BioLogica genetics operations.
 * In some cases these are adapted from corresponding code in Geniverse.
 */

var GeneticsUtils = function () {
  function GeneticsUtils() {
    _classCallCheck(this, GeneticsUtils);
  }

  _createClass(GeneticsUtils, null, [{
    key: "buildGeneMapFromAlleleString",


    /**
     * Converts an allele string to a JavaScript object that maps genes to alleles.
     * This can be useful for comparison purposes, for instance.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @return {object} - gene map of form { horn: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...} to use as defaults
     */
    value: function buildGeneMapFromAlleleString(genetics, alleleString) {
      var geneMap = {},
          alleleSubstrings = alleleString.split(",");
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = alleleSubstrings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var alleleSubstr = _step.value;

          var _alleleSubstr$split = alleleSubstr.split(":");

          var _alleleSubstr$split2 = _slicedToArray(_alleleSubstr$split, 2);

          var side = _alleleSubstr$split2[0];
          var allele = _alleleSubstr$split2[1];
          var gene = genetics.geneForAllele(allele);
          if (side && allele && gene) {
            if (!geneMap[gene]) geneMap[gene] = {};
            geneMap[gene][side] = allele;
          }
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

      return geneMap;
    }

    /**
     * Given an allele string and a gene map defining a set of base (default) alleles,
     * returns a new allele string with missing alleles replaced by their defaults.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @param {object} baseGeneMap - gene map of form { horn: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
     * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
     */

  }, {
    key: "fillInMissingAllelesFromGeneMap",
    value: function fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap) {
      var dstGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, alleleString);
      var dstAlleleString = alleleString;
      for (var gene in dstGeneMap) {
        var geneValue = dstGeneMap[gene];
        if (!geneValue.a && baseGeneMap[gene] && baseGeneMap[gene].a) {
          dstAlleleString = dstAlleleString.replace("b:" + geneValue.b, "a:" + baseGeneMap[gene].a + ",$&");
        }
        if (!geneValue.b && baseGeneMap[gene] && baseGeneMap[gene].b) {
          dstAlleleString = dstAlleleString.replace("a:" + geneValue.a, "$&,b:" + baseGeneMap[gene].b);
        }
      }
      return dstAlleleString;
    }

    /**
     * Given two allele strings, returns a new allele string in which missing alleles
     * in the first are replaced by defaults provided by the second allele string.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @param {string} baseAlleleString - allele string of form "a:h,b:h,a:a,b:a..." to use as defaults
     * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
     */

  }, {
    key: "fillInMissingAllelesFromAlleleString",
    value: function fillInMissingAllelesFromAlleleString(genetics, alleleString, baseAlleleString) {
      var baseGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, baseAlleleString);
      return GeneticsUtils.fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap);
    }

    /**
     * Returns the number of separate changes, including allele changes and sex changes,
     * required to match the phenotype of the 'testOrganism' to that of the 'targetOrganism'.
     *
     * @param {BioLogica.Organism} testOrganism - the organism to which changes would apply
     * @param {BioLogica.Organism} targetOrganism - the organism that serves as destination
     * @return {number} - the total number of changes required for the phenotypes to match
     */

  }, {
    key: "numberOfChangesToReachPhenotype",
    value: function numberOfChangesToReachPhenotype(testOrganism, targetOrganism) {
      var requiredChangeCount = GeneticsUtils.numberOfAlleleChangesToReachPhenotype(testOrganism.phenotype.characteristics, targetOrganism.phenotype.characteristics, testOrganism.genetics.genotype.allAlleles, testOrganism.species.traitRules);
      if (testOrganism.sex !== targetOrganism.sex) ++requiredChangeCount;

      return requiredChangeCount;
    }

    /**
     * Returns the number of separate allele changes required to make the phenotype of
     * the organism characterized by 'testCharacterstics' match that of the organism
     * characterized by 'targetCharacteristics'. Adapted from:
     * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
     *
     * @param {object} testCharacteristics - the characteristics of the test organism
     * @param {object} targetCharacteristics - the characteristics of the target organism
     * @param {string[]} testAlleles - the array of alleles of the test organism
     * @param {object} traitRules - the traitRules of the BioLogica.Species of the organisms
     * @return {number} - the number of allele changes required for the phenotypes to match
     */

  }, {
    key: "numberOfAlleleChangesToReachPhenotype",
    value: function numberOfAlleleChangesToReachPhenotype(testCharacteristics, targetCharacteristics, testAlleles, traitRules) {
      var alleles = testAlleles;
      var moves = 0;

      for (var trait in traitRules) {
        if (traitRules.hasOwnProperty(trait)) {
          if (testCharacteristics[trait] !== targetCharacteristics[trait]) {
            // first we have to work out what alleles the original drake has that correspond to
            // their non-matching trait
            var possibleTraitAlleles = GeneticsUtils.collectAllAllelesForTrait(trait, traitRules);
            var characteristicAlleles = [];
            for (var i = 0, ii = alleles.length; i < ii; i++) {
              if (possibleTraitAlleles.indexOf(alleles[i]) >= 0) {
                characteristicAlleles.push(alleles[i]);
              }
            }
            // now work out the smallest number of steps to get from there to the desired characteristic
            var possibleSolutions = traitRules[trait][targetCharacteristics[trait]];
            var shortestPathLength = Infinity;
            for (var i = 0, ii = possibleSolutions.length; i < ii; i++) {
              var solution = possibleSolutions[i].slice(),
                  pathLength = 0;
              for (var j = 0, jj = characteristicAlleles.length; j < jj; j++) {
                if (solution.indexOf(characteristicAlleles[j]) === -1) {
                  pathLength++;
                } else {
                  solution.splice(solution.indexOf(characteristicAlleles[j]), 1); // already matched this one, can't match it again
                }
              }
              shortestPathLength = pathLength < shortestPathLength ? pathLength : shortestPathLength;
            }
            moves += shortestPathLength;
          }
        }
      }
      return moves;
    }

    /**
     * Goes through the traitRules to find out what unique alleles are associated with each trait
     * e.g. For "tail" it will return ["T", "Tk", "t"]. Adapted from:
     * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
     *
     * @param {string} trait - name of trait, e.g. "tail"
     * @param {object} traitRules - the traitRules of the BioLogica.Species whose traits are of interest
     * @return {string[]} - array of allele strings, e.g. ["T", "Tk", "t"]
     */

  }, {
    key: "collectAllAllelesForTrait",
    value: function collectAllAllelesForTrait(trait, traitRules) {
      if (GeneticsUtils._possibleAllelesForTrait[trait]) {
        return GeneticsUtils._possibleAllelesForTrait[trait];
      }

      var allelesHash = {},
          alleles = [];
      for (var characteristic in traitRules[trait]) {
        for (var possibileAllelesCombo in traitRules[trait][characteristic]) {
          if (traitRules[trait][characteristic].hasOwnProperty(possibileAllelesCombo)) {
            for (var i = 0, ii = traitRules[trait][characteristic][possibileAllelesCombo].length; i < ii; i++) {
              allelesHash[traitRules[trait][characteristic][possibileAllelesCombo][i]] = 1;
            }
          }
        }
      }

      for (var allele in allelesHash) {
        alleles.push(allele);
      }

      GeneticsUtils._possibleAllelesForTrait[trait] = alleles; // store so we don't need to recalculate it
      return alleles;
    }
  }]);

  return GeneticsUtils;
}();

GeneticsUtils._possibleAllelesForTrait = {};
exports.default = GeneticsUtils;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29kZS9hcHAuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaXJjdWxhci1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZWVkYmFjay5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUtcG9vbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUtdGVzdC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9zdGF0cy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9nZW5ldGljcy11dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7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QUFkLENBQXVDLEtBQXZDLElBQWdELE9BQWhEO0FBckJrRCxhQXNCM0MsT0FBUCxDQXRCa0Q7Ozs7U0E5SWpDOzs7Y0E2SVosMkJBQTJCO2tCQTdJZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogU2VlIGh0dHBzOi8vbWVkaXVtLmNvbS9Aa2VudGNkb2Rkcy9taXN1bmRlcnN0YW5kaW5nLWVzNi1tb2R1bGVzLXVwZ3JhZGluZy1iYWJlbC10ZWFycy1hbmQtYS1zb2x1dGlvbi1hZDJkNWFiOTNjZTAjLnExdmNrZmZpd1xuICogKEtlbnQgQy4gRG9kZHMsIFwiTWlzdW5kZXJzdGFuZGluZyBFUzYgTW9kdWxlcywgVXBncmFkaW5nIEJhYmVsLCBUZWFycywgYW5kIGEgU29sdXRpb25cIilcbiAqIGZvciBkZXNjcmlwdGlvbiBvZiBzb21lIG9mIHRoZSBkZXRhaWxzIGludm9sdmVkIGluIG1peGluZyBFUzYgZXhwb3J0IHdpdGggcmVxdWlyZSgpLlxuICovXG5jb25zdFxuICAvLyBjb21wb25lbnRzXG4gIEFsbGVsZUZpbHRlcnNWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzJykuZGVmYXVsdCxcbiAgQWxsZWxlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9hbGxlbGUnKS5kZWZhdWx0LFxuICBBbmltYXRlZEdhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlJykuZGVmYXVsdCxcbiAgQ2hhbmdlU2V4QnV0dG9ucyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaGFuZ2Utc2V4LWJ1dHRvbnMnKS5kZWZhdWx0LFxuICBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUtaW1hZ2UnKS5kZWZhdWx0LFxuICBDaHJvbW9zb21lVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaHJvbW9zb21lJykuZGVmYXVsdCxcbiAgQ2lyY3VsYXJHbG93VmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaXJjdWxhci1nbG93JykuZGVmYXVsdCxcbiAgRmVlZGJhY2tWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2ZlZWRiYWNrJykuZGVmYXVsdCxcbiAgRmVydGlsaXppbmdHYW1ldGVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2ZlcnRpbGl6aW5nLWdhbWV0ZScpLmRlZmF1bHQsXG4gIEdhbWV0ZVBvb2xWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dhbWV0ZS1wb29sJykuZGVmYXVsdCxcbiAgR2FtZXRlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nYW1ldGUnKS5kZWZhdWx0LFxuICBHZW5lTGFiZWxWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dlbmUtbGFiZWwnKS5kZWZhdWx0LFxuICBHZW5vbWVUZXN0VmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5vbWUtdGVzdCcpLmRlZmF1bHQsXG4gIEdlbm9tZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lJykuZGVmYXVsdCxcbiAgT3JnYW5pc21WaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL29yZ2FuaXNtJykuZGVmYXVsdCxcbiAgT3JnYW5pc21HbG93VmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9vcmdhbmlzbS1nbG93JykuZGVmYXVsdCxcbiAgUGVuVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wZW4nKS5kZWZhdWx0LFxuICBRdWVzdGlvbkdsb3dWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3F1ZXN0aW9uLWdsb3cnKS5kZWZhdWx0LFxuICBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcXVlc3Rpb24tb3JnYW5pc20tZ2xvdycpLmRlZmF1bHQsXG4gIFN0YXRzVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9zdGF0cycpLmRlZmF1bHQsXG4gIC8vIHV0aWxpdGllc1xuICBHZW5ldGljc1V0aWxzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnKS5kZWZhdWx0O1xuXG5leHBvcnQge1xuICAvLyBjb21wb25lbnRzXG4gIEFsbGVsZUZpbHRlcnNWaWV3LFxuICBBbGxlbGVWaWV3LFxuICBBbmltYXRlZEdhbWV0ZVZpZXcsXG4gIENoYW5nZVNleEJ1dHRvbnMsXG4gIENocm9tb3NvbWVJbWFnZVZpZXcsXG4gIENocm9tb3NvbWVWaWV3LFxuICBDaXJjdWxhckdsb3dWaWV3LFxuICBGZWVkYmFja1ZpZXcsXG4gIEZlcnRpbGl6aW5nR2FtZXRlVmlldyxcbiAgR2FtZXRlUG9vbFZpZXcsXG4gIEdhbWV0ZVZpZXcsXG4gIEdlbmVMYWJlbFZpZXcsXG4gIEdlbm9tZVRlc3RWaWV3LFxuICBHZW5vbWVWaWV3LFxuICBPcmdhbmlzbVZpZXcsXG4gIE9yZ2FuaXNtR2xvd1ZpZXcsXG4gIFBlblZpZXcsXG4gIFF1ZXN0aW9uR2xvd1ZpZXcsXG4gIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyxcbiAgU3RhdHNWaWV3LFxuICAvLyB1dGlsaXRpZXNcbiAgR2VuZXRpY3NVdGlsc1xufTtcbiIsImNvbnN0IEFsbGVsZUZpbHRlcnNWaWV3ID0gKHtzcGVjaWVzLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNhYmxlZEFsbGVsZXMgPSBbXSwgb25GaWx0ZXJDaGFuZ2V9KSA9PiB7XG4gIGxldCBoaWRkZW5HZW5lcyA9IG5ldyBTZXQsXG4gICAgICBnZW5lSW5wdXRzID0gW107XG5cbiAgZm9yIChjb25zdCBhbGxlbGUgb2YgaGlkZGVuQWxsZWxlcykge1xuICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSk7XG4gICAgaWYgKGdlbmUpXG4gICAgICBoaWRkZW5HZW5lcy5hZGQoZ2VuZS5uYW1lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZ2VuZSBpbiBzcGVjaWVzLmdlbmVMaXN0KSB7XG4gICAgaWYgKCFoaWRkZW5HZW5lcy5oYXMoZ2VuZSkpIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMsXG4gICAgICAgICAgICBhbGxlbGVJdGVtcyA9IGFsbGVsZXMubWFwKGFsbGVsZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV0sXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAhKGRpc2FibGVkQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPj0gMCk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpbkxlZnRcIjogXCI4cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgZ2VuZUlucHV0cy5wdXNoKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmUtYWxsZWxlLWxpc3RcIiBrZXk9e2dlbmV9PnthbGxlbGVJdGVtc308L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIGFsbGVsZSA9IGVsdCAmJiBlbHQudmFsdWUsXG4gICAgICAgICAgaXNDaGVja2VkID0gZWx0ICYmIGVsdC5jaGVja2VkO1xuICAgIGlmIChvbkZpbHRlckNoYW5nZSAmJiBhbGxlbGUpXG4gICAgICBvbkZpbHRlckNoYW5nZShldnQsIGFsbGVsZSwgaXNDaGVja2VkKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZS1maWx0ZXJzXCJcbiAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpblRvcFwiOiBcIjVweFwiLCBcIm1hcmdpbkJvdHRvbVwiOiBcIjVweFwiIH19PlxuICAgICAgeyBnZW5lSW5wdXRzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkFsbGVsZUZpbHRlcnNWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzYWJsZWRBbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgb25GaWx0ZXJDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZUZpbHRlcnNWaWV3O1xuIiwiY29uc3QgQWxsZWxlVmlldyA9ICh7YWxsZWxlLCB0YXJnZXQsIGNvbG9yLCBzaGFwZSwgaG92ZXJpbmd9KSA9PiB7XG4gIGxldCB3aWR0aD0yMSxcbiAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBzdHJva2UgPSB0YXJnZXQgPyBcIiMwMDAwMDBcIiA6IFwibm9uZVwiLFxuICAgICAgZmlsbCA9IGFsbGVsZSA/IGNvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgc3Ryb2tlV2lkdGggPSBob3ZlcmluZyA/IDMgOiAxLFxuICAgICAgc3Ryb2tlRGFzaGFycmF5PSBhbGxlbGUgPyBcIjBcIiA6IFwiMVwiLFxuICAgICAgc3ZnU2hhcGUgPSBudWxsO1xuXG4gIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgIHN2Z1NoYXBlID0gPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMX0gY3g9e3JhZGl1cysxfSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfSBlbHNlIHtcbiAgICBzdmdTaGFwZSA9IDxyZWN0IHdpZHRoPXsocmFkaXVzKjIpfSBoZWlnaHQ9eyhyYWRpdXMqMil9IHg9XCIxXCIgeT1cIjFcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfVxuXG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aCsyfSBoZWlnaHQ9e3dpZHRoKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICB7IHN2Z1NoYXBlIH1cbiAgICAgICAgPHRleHQgeD17cmFkaXVzKzF9IHk9e3JhZGl1cys3fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+e2FsbGVsZX08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlIHRoYXQgYW5pbWF0ZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gW2luaXRpYWxEaXNwbGF5XSAtIGluaXRpYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueF0gLSBpbml0aWFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnldIC0gaW5pdGlhbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnNpemU9MzBdIC0gaW5pdGlhbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5yb3RhdGlvbj0wXSAtIGluaXRpYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5vcGFjaXR5PTFdIC0gaW5pdGlhbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZmluYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBmaW5hbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGZpbmFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIGZpbmFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSBmaW5hbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIGZpbmFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthbmltU3RpZmZuZXNzPTEwMF0gLSBzcHJpbmcgc3RpZmZuZXNzIHVzZWQgdG8gY29udHJvbCBhbmltYXRpb24gc3BlZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uUmVjdCgpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgYXQgcmVzdFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5pbXBvcnQgR2FtZXRlVmlldyBmcm9tICcuL2dhbWV0ZSc7XG5cbmNvbnN0IEFuaW1hdGVkR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgaW5pdGlhbERpc3BsYXksIGRpc3BsYXksIGFuaW1TdGlmZm5lc3M9MTAwLCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrLCBvblJlc3R9KSA9PiB7XG5cbiAgY29uc3QgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBpbml0aWFsID0gaW5pdGlhbERpc3BsYXkgfHwgZGlzcGxheSxcbiAgICAgICAgaW5pdGlhbFNpemUgPSBpbml0aWFsLnNpemUgfHwgMzAsXG4gICAgICAgIGluaXRpYWxSb3RhdGlvbiA9IGluaXRpYWwucm90YXRpb24gIT0gbnVsbCA/IGluaXRpYWwucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWwub3BhY2l0eSAhPSBudWxsID8gaW5pdGlhbC5vcGFjaXR5IDogMS4wLFxuICAgICAgICBmaW5hbFNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIGZpbmFsUm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgZmluYWxPcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzIH07XG4gIC8qIGVzbGludCByZWFjdC9kaXNwbGF5LW5hbWU6MCAqL1xuICByZXR1cm4gKFxuICAgIDxSZWFjdE1vdGlvbi5Nb3Rpb24gZGVmYXVsdFN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGluaXRpYWwueCwgeTogaW5pdGlhbC55LCBzaXplOiBpbml0aWFsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGluaXRpYWxSb3RhdGlvbiwgb3BhY2l0eTogaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBSZWFjdE1vdGlvbi5zcHJpbmcoZGlzcGxheS54LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBSZWFjdE1vdGlvbi5zcHJpbmcoZGlzcGxheS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWxTaXplLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsUm90YXRpb24sIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbE9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PlxuICAgICAgICAgIDxHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9IFxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e2ludGVycG9sYXRlZFN0eWxlfVxuICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9IGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZEdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIGluaXRpYWxEaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAvLyBpbml0aWFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLFxuICBkaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZmluYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICBpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvblJlc3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZEdhbWV0ZVZpZXc7XG4iLCIvKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBtYWxlL2ZlbWFsZSBjaGFuZ2UgYnV0dG9uc1xuICogQHBhcmFtIHtzdHJpbmd9IHNleCAtIFsnbWFsZScgfCAnZmVtYWxlJ10gY3VycmVudGx5IHNlbGVjdGVkIGJ1dHRvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25DaGFuZ2UoZXZ0LCBzZXgpIC0gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdXNlIGNsaWNrcyB0byBjaGFuZ2Ugc2V4XG4gKi9cbmNvbnN0IENoYW5nZVNleEJ1dHRvbnMgPSAoe3NleCwgc3BlY2llcywgc2hvd0xhYmVsLCBzdHlsZT17fSwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IGNhcFNleCA9IHNleC5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIHNleC5zdWJzdHIoMSksXG4gICAgICAgIHNlbGVjdGVkU2V4Q2xhc3MgPSBzZXggPT09ICdtYWxlJyA/IFwibWFsZS1zZWxlY3RlZFwiIDogXCJmZW1hbGUtc2VsZWN0ZWRcIixcbiAgICAgICAgQlVUVE9OX0lNQUdFX1dJRFRIID0gMTAwLFxuICAgICAgICBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCA9IEJVVFRPTl9JTUFHRV9XSURUSCAvIDIsXG4gICAgICAgIGltYWdlU3R5bGUgPSBPYmplY3QuYXNzaWduKHN0eWxlLCB7cG9zaXRpb246ICdhYnNvbHV0ZSd9KSxcbiAgICAgICAgbGFiZWwgPSBzaG93TGFiZWwgPyBgJHtjYXBTZXh9ICR7c3BlY2llc31gIDogJycsXG4gICAgICAgIGxhYmVsRWxlbWVudCA9IHNob3dMYWJlbCA/IDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IEJVVFRPTl9JTUFHRV9XSURUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTB9fT57bGFiZWx9PC9kaXY+IDogJyc7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0UmVjdCA9IGV2dC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgY2xpY2tYID0gZXZ0LmNsaWVudFggLSBlbHRSZWN0LmxlZnQ7XG4gICAgaWYgKChzZXggPT09ICdtYWxlJykgIT09IChjbGlja1ggPiBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCkpXG4gICAgICBvbkNoYW5nZShldnQsIHNleCA9PT0gJ21hbGUnID8gJ2ZlbWFsZScgOiAnbWFsZScpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxkaXYgIGNsYXNzTmFtZT17YGdlbmlibG9ja3MgY2hhbmdlLXNleC1idXR0b25zICR7c2VsZWN0ZWRTZXhDbGFzc31gfVxuICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSA+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtsYWJlbEVsZW1lbnR9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaGFuZ2VTZXhCdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgc2V4OiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydtYWxlJywgJ2ZlbWFsZSddKS5pc1JlcXVpcmVkLFxuICBzcGVjaWVzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBzaG93TGFiZWw6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVNleEJ1dHRvbnM7XG4iLCJjb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKCkgPT4ge1xuICBsZXQgd2lkdGg9MjMsXG4gICAgICBoZWlnaHQ9MTI2LFxuICAgICAgc3BsaXQ9NDUsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQsXG4gICAgICBjb2xvciA9IFwiI0ZGOTk5OVwiO1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzJ9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtoZWlnaHQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhzcGxpdC1yYWRpdXMpLShyYWRpdXMrMil9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPVwiMlwiICAgICAgIHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZUltYWdlVmlldztcbiIsImltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuXG5jb25zdCBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcCggYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKCBhID0+IHtcbiAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICB9KTtcbn07XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBhbGxlbGVDaGFuZ2VkLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgbGFiZWxzICA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChhLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pLFxuXG4gICAgICBjb250YWluZXJDbGFzcyA9IFwiaXRlbXNcIjtcblxuICBpZiAoIWxhYmVsc09uUmlnaHQpIHtcbiAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbnRhaW5lckNsYXNzIH0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2hyb21vc29tZU5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2lkZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIGFsbGVsZUNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxhYmVsc09uUmlnaHQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImNvbnN0IENpcmN1bGFyR2xvd1ZpZXcgPSAoe2NvbG9yLCBzaXplLCBzdHlsZX0pID0+IHtcbiAgbGV0IHJhZGl1cyA9IHNpemUvMixcbiAgICAgIGNvbG9yTm9IYXNoID0gY29sb3IucmVwbGFjZSgnIycsICcnKSxcbiAgICAgIGdyYWRpZW50SUQgPSBgQ2lyY3VsYXJHbG93Vmlld18ke2NvbG9yTm9IYXNofWAsXG4gICAgICBncmFkaWVudElEVXJsID0gYHVybCgjJHtncmFkaWVudElEfSlgO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWVzPVwiZ2VuaWJsb2NrcyBnbG93XCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPXtncmFkaWVudElEfT5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIxLjBcIi8+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjBcIi8+XG4gICAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8Y2lyY2xlIGZpbGw9e2dyYWRpZW50SURVcmx9IGN4PXtyYWRpdXN9IGN5PXtyYWRpdXN9IHI9e3JhZGl1c30gLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2lyY3VsYXJHbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiY29uc3QgRmVlZGJhY2tWaWV3ID0gKHt0ZXh0LCBzdHlsZT17fX0pID0+IHtcbiAgY29uc3QgdFRleHQgPSBBcnJheS5pc0FycmF5KHRleHQpID8gdGV4dCA6IFt0ZXh0XSxcbiAgICAgICAgbGluZUNvdW50ID0gdFRleHQubGVuZ3RoLFxuICAgICAgICBoZWlnaHQgPSAyMCAqIGxpbmVDb3VudCArIDIsXG4gICAgICAgIGRlZmF1bHRTdHlsZSA9IHtcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyM4Nzc4NzEnLFxuICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgYmxhY2snLFxuICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgZm9udFNpemU6ICcxMXB0JyxcbiAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCdcbiAgICAgICAgfSxcbiAgICAgICAgdFN0eWxlID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0U3R5bGUsIHN0eWxlKSxcbiAgICAgICAgdGV4dExpbmVzID0gdFRleHQubWFwKChpVGV4dCwgaW5kZXgpID0+IDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjayB0ZXh0LWxpbmVcIiBrZXk9e2luZGV4fT57aVRleHR9PC9kaXY+KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFja1wiIHN0eWxlPXt0U3R5bGV9PlxuICAgICAge3RleHRMaW5lc31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkZlZWRiYWNrVmlldy5wcm9wVHlwZXMgPSB7XG4gIHRleHQ6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZylcbiAgICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgc3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZlZWRiYWNrVmlldztcbiIsImltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBJTklUSUFMX0dBTUVURV9TSVpFID0gMzAsXG4gICAgICBGSU5BTF9HQU1FVEVfU0laRSA9IDE0MCxcbiAgICAgIFJFU1RJTkdfTU9USEVSX0dBTUVURV9YID0gMCxcbiAgICAgIFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YID0gMTUwLFxuICAgICAgRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YID0gNzAsXG4gICAgICBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1ggPSA4MCxcbiAgICAgIEZJTkFMX1pZR09URV9ZID0gLTE1MDtcblxuZXhwb3J0IGNvbnN0IEdBTUVURV9UWVBFID0geyBNT1RIRVI6ICdtb3RoZXInLCBGQVRIRVI6ICdmYXRoZXInIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWyBHQU1FVEVfVFlQRS5NT1RIRVIsIEdBTUVURV9UWVBFLkZBVEhFUiBdKS5pc1JlcXVpcmVkLFxuICAgIGdhbWV0ZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZmVydGlsaXphdGlvblN0YXRlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydub25lJywgJ2ZlcnRpbGl6aW5nJywgJ2ZlcnRpbGl6ZWQnLCAnY29tcGxldGUnXSkuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBzcmNSZWN0OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBkc3RSZWN0OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBhbmltU3RpZmZuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gICAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBbXSxcbiAgICBhbmltU3RpZmZuZXNzOiAxMDBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGxldCB7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcywgYW5pbVN0aWZmbmVzcywgb25SZXN0fSA9IHRoaXMucHJvcHMsXG4gICAgICAgIHhPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QubGVmdCAtIHRoaXMucHJvcHMuZHN0UmVjdC5sZWZ0IDogMCxcbiAgICAgICAgeU9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC50b3AgLSB0aGlzLnByb3BzLmRzdFJlY3QudG9wIDogMCxcbiAgICAgICAgeFJlc3RpbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgeEZlcnRpbGl6aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIGluaXRpYWwsIGZpbmFsO1xuXG4gICAgaWYgKCFnYW1ldGUgfHwgIWlkKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdub25lJykge1xuICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSKVxuICAgICAgICB4T2Zmc2V0ICs9IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YO1xuICAgICAgaW5pdGlhbCA9IHsgeDogeE9mZnNldCwgeTogeU9mZnNldCwgc2l6ZTogSU5JVElBTF9HQU1FVEVfU0laRSB9O1xuICAgICAgZmluYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSB9O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnByb3BzLmZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ2ZlcnRpbGl6aW5nJykge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIGZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgZmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogRklOQUxfWllHT1RFX1ksIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMC4wIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpZH0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e2luaXRpYWx9IGRpc3BsYXk9e2ZpbmFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfSBvblJlc3Q9e29uUmVzdH0gLz5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgR2FtZXRlUG9vbFZpZXcgPSAoe2dhbWV0ZXMsIGhpZGRlbkFsbGVsZXM9W10sIHdpZHRoPTMwMCwgaGVpZ2h0PTIwMCwgYW5pbVN0aWZmbmVzcz02MCwgc2VsZWN0ZWRJZCwgaXNHYW1ldGVEaXNhYmxlZCwgb25HYW1ldGVTZWxlY3RlZH0pID0+IHtcbiAgbGV0IGdhbWV0ZUNvdW50ID0gZ2FtZXRlcy5sZW5ndGgsXG4gICAgICBnYW1ldGVTaXplID0gMzAsXG4gICAgICBtYXJnaW4gPSA1LFxuICAgICAgc3BhY2luZ0RlZmF1bHQgPSBnYW1ldGVTaXplICsgMiAqIG1hcmdpbixcbiAgICAgIHhTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB5U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgY29sRGVmYXVsdCA9IE1hdGguZmxvb3Iod2lkdGggLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICByb3dEZWZhdWx0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICBlbmFibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZEZsYWdzID0gZ2FtZXRlcy5tYXAoZyA9PiBpc0dhbWV0ZURpc2FibGVkKGcpKSxcbiAgICAgIHRvdGFsRGlzYWJsZWRDb3VudCA9IGRpc2FibGVkRmxhZ3MucmVkdWNlKCh0b3RhbCxmbGFnKSA9PiB0b3RhbCArIGZsYWcsIDApLFxuICAgICAgLy8gbGVhdmUgcm9vbSBmb3IgdGhlIGRpc2FibGVkIGdhbWV0ZSByb3cgaWYgdGhlcmUgYXJlIGRpc2FibGVkIGdhbWV0ZXNcbiAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGhlaWdodCAtICh0b3RhbERpc2FibGVkQ291bnQgPyBzcGFjaW5nRGVmYXVsdCA6IDApIC0gNCAqIG1hcmdpbixcbiAgICAgIC8vIHBhY2sgdGhlIGRpc2FibGVkIGdhbWV0ZXMgaW50byB0aGUgZGlzYWJsZWQgcm93XG4gICAgICB4RGlzYWJsZWRTcGFjaW5nID0gTWF0aC5taW4oeFNwYWNpbmcgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aWR0aCAtIDcgKiBtYXJnaW4pIC8gdG90YWxEaXNhYmxlZENvdW50KSxcbiAgICAgIHlEaXNhYmxlZFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHRvdGFsRW5hYmxlZENvdW50ID0gZ2FtZXRlQ291bnQgLSB0b3RhbERpc2FibGVkQ291bnQsXG4gICAgICBnYW1ldGVWaWV3cztcblxuICAvLyBzcXVlZXplIGluIHRvIG1ha2Ugcm9vbSBmb3IgYWRkaXRpb25hbCBnYW1ldGVzIGlmIG5lY2Vzc2FyeVxuICB2YXIgY29sQ291bnQgPSBjb2xEZWZhdWx0LFxuICAgICAgcm93Q291bnQgPSByb3dEZWZhdWx0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA+IDApO1xuICB3aGlsZSAoY29sQ291bnQgKiByb3dDb3VudCA8IHRvdGFsRW5hYmxlZENvdW50KSB7XG4gICAgaWYgKHlTcGFjaW5nID4geFNwYWNpbmcpIHtcbiAgICAgIHlTcGFjaW5nID0gYXZhaWxhYmxlSGVpZ2h0IC8gKytyb3dDb3VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB4U3BhY2luZyA9ICh3aWR0aCAtIDQgKiBtYXJnaW4pIC8gKytjb2xDb3VudDtcbiAgICB9XG4gIH1cblxuICBnYW1ldGVWaWV3cyA9IGdhbWV0ZXMubWFwKChnYW1ldGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkRmxhZ3NbaW5kZXhdLFxuICAgICAgICAgIGxheW91dEluZGV4ID0gaXNEaXNhYmxlZCA/IGRpc2FibGVkQ291bnQrKyA6IGVuYWJsZWRDb3VudCsrLFxuICAgICAgICAgIHJvdyA9IGlzRGlzYWJsZWQgPyByb3dEZWZhdWx0IC0gMSA6IE1hdGguZmxvb3IobGF5b3V0SW5kZXggLyBjb2xDb3VudCksXG4gICAgICAgICAgY29sID0gaXNEaXNhYmxlZCA/IGxheW91dEluZGV4IDogbGF5b3V0SW5kZXggJSBjb2xDb3VudCxcbiAgICAgICAgICB5ID0gaXNEaXNhYmxlZCA/IHJvdyAqIHlEaXNhYmxlZFNwYWNpbmcgOiByb3cgKiB5U3BhY2luZyxcbiAgICAgICAgICB4ID0gaXNEaXNhYmxlZCA/IGNvbCAqIHhEaXNhYmxlZFNwYWNpbmcgOiBjb2wgKiB4U3BhY2luZztcbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2luZGV4ICsgMX0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh3aWR0aC8yKSwgeTogLU1hdGgucm91bmQoeVNwYWNpbmcpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpbmRleCArIDEgPT09IHNlbGVjdGVkSWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uR2FtZXRlU2VsZWN0ZWR9IC8+XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2FtZXRlLXBvb2xcIiBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH19PlxuICAgICAgeyBnYW1ldGVWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVQb29sVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBhbmltU3RpZmZuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBzZWxlY3RlZElkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpc0dhbWV0ZURpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgb25HYW1ldGVTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVBvb2xWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgZGlzcGxheSwgaXNTZWxlY3RlZD1mYWxzZSwgaXNEaXNhYmxlZD1mYWxzZSwgb25DbGlja30pID0+IHtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIHJlY3QgPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKCFpc0Rpc2FibGVkKSB7XG4gICAgICBvbkNsaWNrKGV2dCwgaWQsIHJlY3QpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpIHtcbiAgICBsZXQgdG9vbHRpcCA9IFwiXCIsXG4gICAgICAgIGFsbEhpZGRlbkFsbGVsZXM7XG4gICAgLy8gTm90ZTogaXQgd291bGQgYmUgbW9yZSBlZmZpY2llbnQgZm9yIHRoZSBjYWxsZXIgdG8gcGFzcyBpbiB0aGVcbiAgICAvLyBhbGxIaWRkZW5BbGxlbGVzIGFycmF5IHJhdGhlciB0aGFuIGNvbXB1dGluZyBpdCBlYWNoIHRpbWUgaGVyZS5cbiAgICAvLyBCdXQgaWYgd2UgbW92ZWQgaXQgb3V0IHJpZ2h0IG5vdyB3ZSdkIGhhdmUgdG8gZWxpbWluYXRlIHRoZSBFUzYgc3BsYXQuXG4gICAgZnVuY3Rpb24gY29uY2F0SGlkZGVuQWxsZWxlcyhpU3BlY2llcywgaUhpZGRlbkFsbGVsZXMpIHtcbiAgICAgIGFsbEhpZGRlbkFsbGVsZXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKGlTcGVjaWVzLCBhbGxlbGUpO1xuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzLnB1c2goLi4uZ2VuZS5hbGxlbGVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBjaCBpbiBnYW1ldGUpIHtcbiAgICAgIHZhciBjaHJvbW9zb21lID0gZ2FtZXRlW2NoXTtcbiAgICAgIGlmIChhbGxIaWRkZW5BbGxlbGVzID09IG51bGwpXG4gICAgICAgIGNvbmNhdEhpZGRlbkFsbGVsZXMoY2hyb21vc29tZS5zcGVjaWVzLCBoaWRkZW5BbGxlbGVzKTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIGNocm9tb3NvbWUuYWxsZWxlcykge1xuICAgICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPCAwKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBjaHJvbW9zb21lLnNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyBsYWJlbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoID09PSAnWFknKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY2hyb21vc29tZS5zaWRlID09PSAneScgPyAneScgOiAneCc7XG4gICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9vbHRpcDtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkQ2xhc3MgPSBpc1NlbGVjdGVkICYmICFpc0Rpc2FibGVkID8gXCJzZWxlY3RlZFwiIDogXCJcIixcbiAgICAgICAgZGlzYWJsZWRDbGFzcyA9IGlzRGlzYWJsZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiLFxuICAgICAgICBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGNsYXNzZXMgPSBgZ2VuaWJsb2NrcyBnYW1ldGUgJHtzZWxlY3RlZENsYXNzfSAke2Rpc2FibGVkQ2xhc3N9IGdyb3VwJHtncm91cH1gLFxuICAgICAgICBzaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICByb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICB0cmFuc2Zvcm0gPSByb3RhdGlvbiA/IGByb3RhdGUoJHtyb3RhdGlvbn1kZWcpYCA6ICcnLFxuICAgICAgICBvcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHRvb2x0aXAgPSBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gdGl0bGU9e3Rvb2x0aXB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkueCwgdG9wOiBkaXNwbGF5LnksXG4gICAgICAgICAgICB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgdHJhbnNmb3JtLCBvcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgaXNTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlVmlldztcbiIsImNvbnN0IEdlbmVMYWJlbFZpZXcgPSAoe3NwZWNpZXMsIGFsbGVsZSwgZWRpdGFibGUsIG9uQWxsZWxlQ2hhbmdlfSkgPT4ge1xuICBpZiAoIWVkaXRhYmxlKSB7XG4gICAgbGV0IGFsbGVsZU5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUgbm9uZWRpdGFibGVcIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgeyBhbGxlbGVOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgYWxsZWxlcyA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYWxsZWxlKS5hbGxlbGVzLFxuICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgIGFsbGVsZU9wdGlvbnMgPSBhbGxlbGVOYW1lcy5tYXAoKG5hbWUsIGkpID0+ICg8b3B0aW9uIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZXNbaV19PntuYW1lfTwvb3B0aW9uPikpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlXCI+XG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBhbGxlbGUgfSBvbkNoYW5nZT17IG9uQWxsZWxlQ2hhbmdlIH0+XG4gICAgICAgICAgeyBhbGxlbGVPcHRpb25zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5HZW5lTGFiZWxWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBhbGxlbGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZWRpdGFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5lTGFiZWxWaWV3O1xuIiwiaW1wb3J0IENocm9tb3NvbWVJbWFnZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lLWltYWdlJztcblxubGV0IGZpbHRlckFsbGVsZXMgPSBmdW5jdGlvbihhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBzcGVjaWVzKSB7XG4gICAgICBsZXQgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcCggYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgICAgIHJldHVybiBhbGxlbGVzLmZpbHRlciggYSA9PiB7XG4gICAgICAgIGxldCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKTtcbiAgICAgICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBUZXN0UHVsbGRvd25WaWV3ID0gKHtzcGVjaWVzLCBnZW5lLCBzZWxlY3Rpb24sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICAgICAgbGV0IGFsbGVsZXMgPSBnZW5lLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIG51bUFsbGVsZXMgPSBhbGxlbGVOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgcG9zc2libGVDb21ib3MgPSBbXSxcbiAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uIHx8IFwicGxhY2Vob2xkZXJcIixcbiAgICAgICAgICBpLCBqO1xuXG4gICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PVwicGxhY2Vob2xkZXJcIiB2YWx1ZT1cInBsYWNlaG9sZGVyXCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNlbGVjdCBhIEdlbm90eXBlPC9vcHRpb24+KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG51bUFsbGVsZXM7IGkrKykge1xuICAgICAgICBmb3IgKGogPSBpOyBqIDwgbnVtQWxsZWxlczsgaisrKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGkgKyBcIiBcIiArIGosXG4gICAgICAgICAgICAgIHN0cmluZyA9IGFsbGVsZU5hbWVzW2ldICsgXCIgLyBcIiArIGFsbGVsZU5hbWVzW2pdO1xuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2tleX0+e3N0cmluZ308L29wdGlvbj4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBjdXJyZW50U2VsZWN0aW9uIH0gb25DaGFuZ2U9eyBvblNlbGVjdGlvbkNoYW5nZSB9PlxuICAgICAgICAgIHsgcG9zc2libGVDb21ib3MgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICk7XG4gICAgfTtcblxuY29uc3QgR2Vub21lVGVzdFZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcz1bXSwgc2VsZWN0aW9uPXt9LCBzZWxlY3Rpb25DaGFuZ2VkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIGFsbGVsZXMgPSBjaHJvbVtPYmplY3Qua2V5cyhjaHJvbSlbMF1dLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBvcmcuc3BlY2llcyksXG4gICAgICAgIGdlbmVzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYSkpLFxuICAgICAgICBwdWxsZG93bnMgPSBnZW5lcy5tYXAoZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXN0UHVsbGRvd25WaWV3XG4gICAgICAgICAgICAgIGtleSAgICAgICA9IHsgZy5uYW1lIH1cbiAgICAgICAgICAgICAgc3BlY2llcyAgID0geyBvcmcuc3BlY2llcyB9XG4gICAgICAgICAgICAgIGdlbmUgICAgICA9IHsgZyB9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbiA9IHsgc2VsZWN0aW9uW2cubmFtZV0gfVxuICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZSA9IHsgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkKGcsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiIGtleT17Y2hyb21vc29tZU5hbWV9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbm9tZS10ZXN0LW9wdGlvbnNcIj5cbiAgICAgICAgICB7IHB1bGxkb3ducyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWUtdGVzdFwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuVGVzdFB1bGxkb3duVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZ2VuZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5HZW5vbWVUZXN0Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIHNlbGVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgc2VsZWN0aW9uQ2hhbmdlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVGVzdFZpZXc7XG4iLCJpbXBvcnQgQ2hyb21vc29tZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lJztcblxuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzID0gW10sIGFsbGVsZUNoYW5nZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBwYWlycy5wdXNoKFxuICAgICAgICA8Q2hyb21vc29tZVZpZXdcbiAgICAgICAgICBvcmc9e29yZ31cbiAgICAgICAgICBrZXk9e3BhaXJzLmxlbmd0aCArIDF9XG4gICAgICAgICAgY2hyb21vc29tZU5hbWU9e2Nocm9tb3NvbWVOYW1lfVxuICAgICAgICAgIHNpZGU9e3NpZGV9XG4gICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MH1cbiAgICAgICAgICBhbGxlbGVDaGFuZ2VkPXtmdW5jdGlvbihwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1wYWlyXCIga2V5PXtwYWlyV3JhcHBlcnMubGVuZ3RoICsgMX0+XG4gICAgICAgIHsgcGFpcnMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWVcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdlbm9tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVWaWV3O1xuIiwiaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbmNvbnN0IE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe29yZywgY29sb3IsIHNpemUsIGluaXRpYWxTdHlsZT17fSwgZmluYWxTdHlsZT17fSwgc3RpZmZuZXNzPTYwLCBvblJlc3R9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgZ2xvd1N0eWxlID0ge3Bvc2l0aW9uOiAnYWJzb2x1dGUnfSxcbiAgICAgICAgaW5pdGlhbE9yZ1N0eWxlID0gT2JqZWN0LmFzc2lnbihpbml0aWFsU3R5bGUsIHtwb3NpdGlvbjogJ2Fic29sdXRlJ30pLFxuICAgICAgICBmaW5hbE9yZ1N0eWxlID0gT2JqZWN0LmFzc2lnbihmaW5hbFN0eWxlLCB7cG9zaXRpb246ICdhYnNvbHV0ZSd9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lcz1cImdlbmlibG9ja3Mgb3JnYW5pc20tZ2xvd1wiIHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtnbG93U3R5bGV9Lz5cbiAgICAgIDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGNvbG9yPXtjb2xvcn0gd2lkdGg9e3NpemV9XG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxTdHlsZT17aW5pdGlhbE9yZ1N0eWxlfSBmaW5hbFN0eWxlPXtmaW5hbE9yZ1N0eWxlfVxuICAgICAgICAgICAgICAgICAgICBzdGlmZm5lc3M9e3N0aWZmbmVzc30gb25SZXN0PXtvblJlc3R9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5PcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpbml0aWFsU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIGZpbmFsU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21HbG93VmlldztcbiIsImNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCB3aWR0aD0yMDAsIGluaXRpYWxTdHlsZT17fSwgZmluYWxTdHlsZT17fSwgc3RpZmZuZXNzPTYwLCBvblJlc3QgfSkgPT4ge1xuICBsZXQgYmFzZVVybCA9IFwiaHR0cHM6Ly9nZW5pdmVyc2UtcmVzb3VyY2VzLmNvbmNvcmQub3JnL3Jlc291cmNlcy9kcmFrZXMvaW1hZ2VzL1wiLFxuICAgICAgdXJsICAgICA9IGJhc2VVcmwgKyBvcmcuZ2V0SW1hZ2VOYW1lKCksXG4gICAgICB7cG9zaXRpb246aVBvc2l0aW9uLCAuLi5pbml0aWFsTW90aW9ufSA9IGluaXRpYWxTdHlsZSxcbiAgICAgIHtwb3NpdGlvbjpmUG9zaXRpb24sIC4uLmZpbmFsTW90aW9ufSA9IGZpbmFsU3R5bGUsXG4gICAgICBwb3NpdGlvbiA9IGZQb3NpdGlvbiB8fCBpUG9zaXRpb24sXG4gICAgICBpbml0aWFsID0gT2JqZWN0LmFzc2lnbih7IG9wYWNpdHk6IDEuMCB9LCBpbml0aWFsTW90aW9uKSxcbiAgICAgIGZpbmFsID0gT2JqZWN0LmFzc2lnbih7IG9wYWNpdHk6IDEuMCB9LCBmaW5hbE1vdGlvbik7XG5cbiAgaWYgKGZpbmFsLm9wYWNpdHkgIT09IGluaXRpYWwub3BhY2l0eSlcbiAgICBmaW5hbC5vcGFjaXR5ID0gUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsLm9wYWNpdHksIHsgc3RpZmZuZXNzOiBzdGlmZm5lc3MgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RNb3Rpb24uTW90aW9uIGRlZmF1bHRTdHlsZT17aW5pdGlhbH0gc3R5bGU9e2ZpbmFsfSBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBPYmplY3QuYXNzaWduKGludGVycG9sYXRlZFN0eWxlLCBwb3NpdGlvbiA/IHtwb3NpdGlvbn0gOiB7fSk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBvcmdhbmlzbVwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIDwvUmVhY3RNb3Rpb24uTW90aW9uPlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpbml0aWFsU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIGZpbmFsU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgUGVuVmlldyA9ICh7b3Jncywgd2lkdGg9NDAwLCBjb2x1bW5zPTV9KSA9PiB7XG4gIGxldCBvcmdXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKChvcmcsIGluZGV4KSA9PiAoPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30ga2V5PXtpbmRleH0gd2lkdGg9e29yZ1dpZHRofS8+KSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgY29sdW1uczogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsImltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uR2xvd1ZpZXcgPSAoe2dsb3dDb2xvciwgc2l6ZT0yMDB9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgZ2xvd1N0eWxlID0ge3Bvc2l0aW9uOiAnYWJzb2x1dGUnfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyB0ZXh0LWdsb3dcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgY29sb3I9e2dsb3dDb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e2dsb3dTdHlsZX0vPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHRleHQtZ2xvdyBxdWVzdGlvbi1tYXJrXCJcbiAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246IFwiYWJzb2x1dGVcIiwgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX19PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG4gIC8vIEhUTUwgdGV4dCBub2RlXG4gIC8vPGRpdiBzdHlsZT17dFN0eWxlfT57dGV4dH08L2Rpdj5cblxuICAvLyBTVkcgdGV4dCBub2RlXG4gIC8vPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAvLyAgPHRleHQgeD0nNTAnIHk9JzE3NScgZmlsbD0nIzBEMEQ4Qycgc3R5bGU9e3RTdHlsZX0+XG4gIC8vICAgIHt0ZXh0fVxuICAvLyAgPC90ZXh0PlxuICAvLzwvc3ZnPlxufTtcblxuUXVlc3Rpb25HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGdsb3dDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbkdsb3dWaWV3O1xuIiwiaW1wb3J0IE9yZ2FuaXNtR2xvd1ZpZXcgZnJvbSAnLi9vcmdhbmlzbS1nbG93JztcbmltcG9ydCBRdWVzdGlvbkdsb3dWaWV3IGZyb20gJy4vcXVlc3Rpb24tZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyA9ICh7aGlkZGVuLCBvcmcsIGNvbG9yLCBzaXplLCBpbml0aWFsU3R5bGU9e30sIGZpbmFsU3R5bGU9e30sIHN0aWZmbmVzcz02MCwgb25SZXN0fSkgPT4ge1xuICBjb25zdCBvcmdWaWV3ID0gPE9yZ2FuaXNtR2xvd1ZpZXcgb3JnPXtvcmd9IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxTdHlsZT17aW5pdGlhbFN0eWxlfSBmaW5hbFN0eWxlPXtmaW5hbFN0eWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RpZmZuZXNzPXtzdGlmZm5lc3N9IG9uUmVzdD17b25SZXN0fSAvPixcbiAgICAgICAgcXVlc3Rpb25WaWV3ID0gPFF1ZXN0aW9uR2xvd1ZpZXcgZ2xvd0NvbG9yPXtjb2xvcn0gd2lkdGg9e3NpemV9IC8+LFxuICAgICAgICBmaW5hbFZpZXcgPSBoaWRkZW4gPyBxdWVzdGlvblZpZXcgOiBvcmdWaWV3O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWVzPVwiZ2VuaWJsb2NrcyBxdWVzdGlvbi1vcmdhbmlzbS1nbG93XCI+XG4gICAgICB7ZmluYWxWaWV3fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaGlkZGVuOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpbml0aWFsU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIGZpbmFsU3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYnJlZWRpbmcgc3RhdGlzdGljcyBmb3IgYSBzZXQgb2YgQmlvbG9naWNhIG9yZ2FuaXNtc1xuICogQHBhcmFtIHtPYmplY3RbXX0gb3JncyAtIGFycmF5IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXMgZm9yIHdoaWNoIHN0YXRpc3RpY3MgYXJlIHRvIGJlIGRpc3BsYXllZFxuICogQHBhcmFtIHtPYmplY3R9IG9yZ3NbXS5waGVub3R5cGUgLSB0aGUgcGhlbm90eXBlIG9mIHRoZSBCaW9sb2dpY2Egb3JnYW5pc21cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGFzdENsdXRjaFNpemU9b3Jncy5sZW5ndGhdIC0gdGhlIG51bWJlciBvZiBvcmdhbmlzbXMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkgdGhhdCBjb21wcmlzZSB0aGUgbW9zdCByZWNlbnQgY2x1dGNoXG4gKi9cbmNvbnN0IFN0YXRzVmlldyA9ICh7b3JncywgbGFzdENsdXRjaFNpemV9KSA9PiB7XG5cbiAgbGV0IHRyYWl0cyA9IG5ldyBNYXAsXG4gICAgICByb3dzID0gW107XG5cbiAgLy8gaWYgbm8gc2l6ZSBzcGVjaWZpZWQsIGFzc3VtZSB0aGVyZSdzIG9ubHkgb25lIGNsdXRjaFxuICBpZiAoIWxhc3RDbHV0Y2hTaXplKSBsYXN0Q2x1dGNoU2l6ZSA9IG9yZ3MubGVuZ3RoO1xuXG4gIC8vIGFjY3VtdWxhdGUgc3RhdHMgZm9yIGVhY2ggdHJhaXQvdmFsdWUgY29tYmluYXRpb25cbiAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3Jncy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBjbHV0Y2hLZXkgPSAnYycgKyBvcmcuc2V4O1xuICAgIGZvciAoY29uc3QgdHJhaXQgb2YgT2JqZWN0LmtleXMob3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MpKSB7XG4gICAgICBsZXQgdmFsdWUgPSBvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljc1t0cmFpdF0sXG4gICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgIHZhbHVlQ291bnRzID0gdHJhaXRWYWx1ZXMuZ2V0KHZhbHVlKSB8fCBuZXcgTWFwO1xuICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgaWYgKCF0cmFpdFZhbHVlcy5oYXModmFsdWUpKSB0cmFpdFZhbHVlcy5zZXQodmFsdWUsIHZhbHVlQ291bnRzKTtcbiAgICAgIC8vIG1vc3QgcmVjZW50IGNsdXRjaCBhc3N1bWVkIHRvIGJlIGF0IGVuZCBvZiBvcmdhbmlzbXMgYXJyYXlcbiAgICAgIGlmIChpbmRleCA+PSBvcmdzLmxlbmd0aCAtIGxhc3RDbHV0Y2hTaXplKVxuICAgICAgICB2YWx1ZUNvdW50cy5zZXQoY2x1dGNoS2V5LCAodmFsdWVDb3VudHMuZ2V0KGNsdXRjaEtleSkgfHwgMCkgKyAxKTtcbiAgICAgIHZhbHVlQ291bnRzLnNldChvcmcuc2V4LCAodmFsdWVDb3VudHMuZ2V0KG9yZy5zZXgpIHx8IDApICsgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYnVpbGQgY3VtdWxhdGl2ZSBzdGF0cyBmb3IgdGFibGUgcm93c1xuICBsZXQgdHJhaXROdW0gPSAwO1xuICBmb3IgKGNvbnN0IFt0cmFpdCwgdmFsdWVzXSBvZiB0cmFpdHMpIHtcbiAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgY291bnRzXSBvZiB2YWx1ZXMpIHtcbiAgICAgIGNvbnN0IGNNYWxlcyA9IGNvdW50cy5nZXQoJ2MnICsgQmlvTG9naWNhLk1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjRmVtYWxlcyA9IGNvdW50cy5nZXQoJ2MnICsgQmlvTG9naWNhLkZFTUFMRSkgfHwgMCxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoIDEwMCAqIGNUb3RhbCAvIGxhc3RDbHV0Y2hTaXplKSxcbiAgICAgICAgICAgIHRNYWxlcyA9IGNvdW50cy5nZXQoQmlvTG9naWNhLk1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0RmVtYWxlcyA9IGNvdW50cy5nZXQoQmlvTG9naWNhLkZFTUFMRSkgfHwgMCxcbiAgICAgICAgICAgIHRUb3RhbCA9IHRNYWxlcyArIHRGZW1hbGVzLFxuICAgICAgICAgICAgdFBjdCA9IE1hdGgucm91bmQoIDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiIsIi8qKlxuICogQ2xhc3MgcHJvdmlkaW5nIHV0aWxpdHkgZnVuY3Rpb25zIGZvciBCaW9Mb2dpY2EgZ2VuZXRpY3Mgb3BlcmF0aW9ucy5cbiAqIEluIHNvbWUgY2FzZXMgdGhlc2UgYXJlIGFkYXB0ZWQgZnJvbSBjb3JyZXNwb25kaW5nIGNvZGUgaW4gR2VuaXZlcnNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5ldGljc1V0aWxzIHtcblxuICAvKipcbiAgICogQ29udmVydHMgYW4gYWxsZWxlIHN0cmluZyB0byBhIEphdmFTY3JpcHQgb2JqZWN0IHRoYXQgbWFwcyBnZW5lcyB0byBhbGxlbGVzLlxuICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgZm9yIGNvbXBhcmlzb24gcHVycG9zZXMsIGZvciBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gZ2VuZSBtYXAgb2YgZm9ybSB7IGhvcm46IHthOlwiaFwiLCBiOlwiaFwifSwgYXJtb3I6IHthOlwiYVwiLCBiOlwiYVwifSwgLi4ufSB0byB1c2UgYXMgZGVmYXVsdHNcbiAgICovXG4gIHN0YXRpYyBidWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcpIHtcbiAgICBsZXQgZ2VuZU1hcCA9IHt9LFxuICAgICAgICBhbGxlbGVTdWJzdHJpbmdzID0gYWxsZWxlU3RyaW5nLnNwbGl0KFwiLFwiKTtcbiAgICBmb3IgKGNvbnN0IGFsbGVsZVN1YnN0ciBvZiBhbGxlbGVTdWJzdHJpbmdzKSB7XG4gICAgICBjb25zdCBbc2lkZSwgYWxsZWxlXSA9IGFsbGVsZVN1YnN0ci5zcGxpdChcIjpcIiksXG4gICAgICAgICAgICBnZW5lID0gZ2VuZXRpY3MuZ2VuZUZvckFsbGVsZShhbGxlbGUpO1xuICAgICAgaWYgKHNpZGUgJiYgYWxsZWxlICYmIGdlbmUpIHtcbiAgICAgICAgaWYgKCFnZW5lTWFwW2dlbmVdKSBnZW5lTWFwW2dlbmVdID0ge307XG4gICAgICAgIGdlbmVNYXBbZ2VuZV1bc2lkZV0gPSBhbGxlbGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnZW5lTWFwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGFuIGFsbGVsZSBzdHJpbmcgYW5kIGEgZ2VuZSBtYXAgZGVmaW5pbmcgYSBzZXQgb2YgYmFzZSAoZGVmYXVsdCkgYWxsZWxlcyxcbiAgICogcmV0dXJucyBhIG5ldyBhbGxlbGUgc3RyaW5nIHdpdGggbWlzc2luZyBhbGxlbGVzIHJlcGxhY2VkIGJ5IHRoZWlyIGRlZmF1bHRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBiYXNlR2VuZU1hcCAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3JuOiB7YTpcImhcIiwgYjpcImhcIn0sIGFybW9yOiB7YTpcImFcIiwgYjpcImFcIn0sIC4uLn1cbiAgICogQHJldHVybiB7c3RyaW5nfSAtIHVwZGF0ZWQgYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCJcbiAgICovXG4gIHN0YXRpYyBmaWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21HZW5lTWFwKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VHZW5lTWFwKSB7XG4gICAgY29uc3QgZHN0R2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKTtcbiAgICBsZXQgICBkc3RBbGxlbGVTdHJpbmcgPSBhbGxlbGVTdHJpbmc7XG4gICAgZm9yIChjb25zdCBnZW5lIGluIGRzdEdlbmVNYXApIHtcbiAgICAgIGNvbnN0IGdlbmVWYWx1ZSA9IGRzdEdlbmVNYXBbZ2VuZV07XG4gICAgICBpZiAoIWdlbmVWYWx1ZS5hICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmEpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGI6JHtnZW5lVmFsdWUuYn1gLCBgYToke2Jhc2VHZW5lTWFwW2dlbmVdLmF9LCQmYCk7XG4gICAgICB9XG4gICAgICBpZiAoIWdlbmVWYWx1ZS5iICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmIpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGE6JHtnZW5lVmFsdWUuYX1gLCBgJCYsYjoke2Jhc2VHZW5lTWFwW2dlbmVdLmJ9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkc3RBbGxlbGVTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdHdvIGFsbGVsZSBzdHJpbmdzLCByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgaW4gd2hpY2ggbWlzc2luZyBhbGxlbGVzXG4gICAqIGluIHRoZSBmaXJzdCBhcmUgcmVwbGFjZWQgYnkgZGVmYXVsdHMgcHJvdmlkZWQgYnkgdGhlIHNlY29uZCBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlQWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gdXNlIGFzIGRlZmF1bHRzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VBbGxlbGVTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlR2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYmFzZUFsbGVsZVN0cmluZyk7XG4gICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGNoYW5nZXMsIGluY2x1ZGluZyBhbGxlbGUgY2hhbmdlcyBhbmQgc2V4IGNoYW5nZXMsXG4gICAqIHJlcXVpcmVkIHRvIG1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhlICd0ZXN0T3JnYW5pc20nIHRvIHRoYXQgb2YgdGhlICd0YXJnZXRPcmdhbmlzbScuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0ZXN0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gd2hpY2ggY2hhbmdlcyB3b3VsZCBhcHBseVxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGFyZ2V0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdGhhdCBzZXJ2ZXMgYXMgZGVzdGluYXRpb25cbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RPcmdhbmlzbSwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICBsZXQgcmVxdWlyZWRDaGFuZ2VDb3VudCA9IEdlbmV0aWNzVXRpbHMubnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5nZW5ldGljcy5nZW5vdHlwZS5hbGxBbGxlbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5zcGVjaWVzLnRyYWl0UnVsZXMpO1xuICAgIGlmICh0ZXN0T3JnYW5pc20uc2V4ICE9PSB0YXJnZXRPcmdhbmlzbS5zZXgpXG4gICAgICArK3JlcXVpcmVkQ2hhbmdlQ291bnQ7XG5cbiAgICByZXR1cm4gcmVxdWlyZWRDaGFuZ2VDb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgdG8gbWFrZSB0aGUgcGhlbm90eXBlIG9mXG4gICAqIHRoZSBvcmdhbmlzbSBjaGFyYWN0ZXJpemVkIGJ5ICd0ZXN0Q2hhcmFjdGVyc3RpY3MnIG1hdGNoIHRoYXQgb2YgdGhlIG9yZ2FuaXNtXG4gICAqIGNoYXJhY3Rlcml6ZWQgYnkgJ3RhcmdldENoYXJhY3RlcmlzdGljcycuIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0ZXN0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGFyZ2V0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRlc3RBbGxlbGVzIC0gdGhlIGFycmF5IG9mIGFsbGVsZXMgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgb2YgdGhlIG9yZ2FuaXNtc1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIG51bWJlciBvZiBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RDaGFyYWN0ZXJpc3RpY3MsIHRhcmdldENoYXJhY3RlcmlzdGljcywgdGVzdEFsbGVsZXMsIHRyYWl0UnVsZXMpIHtcbiAgICBjb25zdCBhbGxlbGVzID0gdGVzdEFsbGVsZXM7XG4gICAgbGV0ICAgbW92ZXMgPSAwO1xuXG4gICAgZm9yIChjb25zdCB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgaWYgKHRlc3RDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdICE9PSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdKSB7XG4gICAgICAgICAgLy8gZmlyc3Qgd2UgaGF2ZSB0byB3b3JrIG91dCB3aGF0IGFsbGVsZXMgdGhlIG9yaWdpbmFsIGRyYWtlIGhhcyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICAgICAgICAvLyB0aGVpciBub24tbWF0Y2hpbmcgdHJhaXRcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVRyYWl0QWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcyk7XG4gICAgICAgICAgbGV0ICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVUcmFpdEFsbGVsZXMuaW5kZXhPZihhbGxlbGVzW2ldKSA+PSAwKXtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzLnB1c2goYWxsZWxlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyB3b3JrIG91dCB0aGUgc21hbGxlc3QgbnVtYmVyIG9mIHN0ZXBzIHRvIGdldCBmcm9tIHRoZXJlIHRvIHRoZSBkZXNpcmVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAgICAgY29uc3QgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdXTtcbiAgICAgICAgICBsZXQgICBzaG9ydGVzdFBhdGhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gY2hhcmFjdGVyaXN0aWNBbGxlbGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspe1xuICAgICAgICAgICAgICBpZiAoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uLnNwbGljZShzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSksIDEpOyAvLyBhbHJlYWR5IG1hdGNoZWQgdGhpcyBvbmUsIGNhbid0IG1hdGNoIGl0IGFnYWluXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IChwYXRoTGVuZ3RoIDwgc2hvcnRlc3RQYXRoTGVuZ3RoKSA/IHBhdGhMZW5ndGggOiBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogR29lcyB0aHJvdWdoIHRoZSB0cmFpdFJ1bGVzIHRvIGZpbmQgb3V0IHdoYXQgdW5pcXVlIGFsbGVsZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHRyYWl0XG4gICAqIGUuZy4gRm9yIFwidGFpbFwiIGl0IHdpbGwgcmV0dXJuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl0uIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFpdCAtIG5hbWUgb2YgdHJhaXQsIGUuZy4gXCJ0YWlsXCJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgd2hvc2UgdHJhaXRzIGFyZSBvZiBpbnRlcmVzdFxuICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSBhcnJheSBvZiBhbGxlbGUgc3RyaW5ncywgZS5nLiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdXG4gICAqL1xuICBzdGF0aWMgX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0ID0ge307XG4gIHN0YXRpYyBjb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKSB7XG4gICAgaWYgKEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSkge1xuICAgICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XTtcbiAgICB9XG5cbiAgICBsZXQgYWxsZWxlc0hhc2ggPSB7fSxcbiAgICAgICAgYWxsZWxlcyAgICAgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNoYXJhY3RlcmlzdGljIGluIHRyYWl0UnVsZXNbdHJhaXRdKXtcbiAgICAgICAgZm9yIChjb25zdCBwb3NzaWJpbGVBbGxlbGVzQ29tYm8gaW4gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdKSB7XG4gICAgICAgICAgaWYgKHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXS5oYXNPd25Qcm9wZXJ0eShwb3NzaWJpbGVBbGxlbGVzQ29tYm8pKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgYWxsZWxlc0hhc2hbdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib11baV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGFsbGVsZSBpbiBhbGxlbGVzSGFzaCl7XG4gICAgICBhbGxlbGVzLnB1c2goYWxsZWxlKTtcbiAgICB9XG5cbiAgICBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0gPSBhbGxlbGVzOyAgLy8gc3RvcmUgc28gd2UgZG9uJ3QgbmVlZCB0byByZWNhbGN1bGF0ZSBpdFxuICAgIHJldHVybiBhbGxlbGVzO1xuICB9XG59XG4iXX0=
