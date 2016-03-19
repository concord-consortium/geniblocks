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
    AnimatedOrganismView = require('./components/animated-organism').default,
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
    GlowBackgroundView = require('./components/glow-background').default,
    OrganismView = require('./components/organism').default,
    OrganismGlowView = require('./components/organism-glow').default,
    PenView = require('./components/pen').default,
    PenStatsView = require('./components/pen-stats').default,
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
exports.AnimatedOrganismView = AnimatedOrganismView;
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
exports.GlowBackgroundView = GlowBackgroundView;
exports.OrganismView = OrganismView;
exports.OrganismGlowView = OrganismGlowView;
exports.PenView = PenView;
exports.PenStatsView = PenStatsView;
exports.QuestionGlowView = QuestionGlowView;
exports.QuestionOrganismGlowView = QuestionOrganismGlowView;
exports.StatsView = StatsView;
exports.
// utilities
GeneticsUtils = GeneticsUtils;

},{"./components/allele":3,"./components/allele-filters":2,"./components/animated-gamete":4,"./components/animated-organism":5,"./components/change-sex-buttons":6,"./components/chromosome":8,"./components/chromosome-image":7,"./components/circular-glow":9,"./components/feedback":10,"./components/fertilizing-gamete":11,"./components/gamete":13,"./components/gamete-pool":12,"./components/gene-label":14,"./components/genome":16,"./components/genome-test":15,"./components/glow-background":17,"./components/organism":19,"./components/organism-glow":18,"./components/pen":21,"./components/pen-stats":20,"./components/question-glow":22,"./components/question-organism-glow":23,"./components/stats":24,"./utilities/genetics-utils":25}],2:[function(require,module,exports){
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

},{"./gamete":13}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnimatedOrganismView = function AnimatedOrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var _ref$initialOpacity = _ref.initialOpacity;
  var initialOpacity = _ref$initialOpacity === undefined ? 1.0 : _ref$initialOpacity;
  var _ref$opacity = _ref.opacity;
  var opacity = _ref$opacity === undefined ? 1.0 : _ref$opacity;
  var _ref$stiffness = _ref.stiffness;
  var stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness;
  var onRest = _ref.onRest;
  var onClick = _ref.onClick;

  var opacityStart = initialOpacity !== undefined ? initialOpacity : opacity !== undefined ? opacity : 1.0;
  var opacityEnd = opacity !== undefined ? opacity : opacityStart;

  if (opacityEnd !== opacityStart) opacityEnd = ReactMotion.spring(opacityEnd, { stiffness: stiffness });

  return React.createElement(
    ReactMotion.Motion,
    { defaultStyle: { opacity: opacityStart }, style: { opacity: opacityEnd }, onRest: onRest },
    function (interpolatedStyle) {
      var tStyle = _extends({}, style, interpolatedStyle);
      return React.createElement(_organism2.default, { org: org, id: id, width: width, style: tStyle, onClick: onClick });
    }
  );
};

AnimatedOrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
  width: React.PropTypes.number,
  style: React.PropTypes.object,
  initialOpacity: React.PropTypes.number,
  opacity: React.PropTypes.number,
  stiffness: React.PropTypes.number,
  onRest: React.PropTypes.func,
  onClick: React.PropTypes.func
};

exports.default = AnimatedOrganismView;

},{"./organism":19}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var alleleChanged = _ref.alleleChanged;
  var _ref$labelsOnRight = _ref.labelsOnRight;
  var labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight;

  var alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      visibleAlleles = filterAlleles(alleles, hiddenAlleles, org.species),
      labels = visibleAlleles.map(function (a) {
    return React.createElement(_geneLabel2.default, { key: a, species: org.species, allele: a, editable: editable,
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
  editable: React.PropTypes.bool,
  alleleChanged: React.PropTypes.func.isRequired,
  labelsOnRight: React.PropTypes.bool
};

exports.default = ChromosomeView;

},{"./chromosome-image":7,"./gene-label":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Uses an SVG circular gradient to implement a fading glow background.
 * Implemented as a stateless functional React component.
 *
 * @param {string} color - the color of the circular gradient "glow"
 * @param {number} size - the diameter of the circular gradient
 * @param {object} style - styles applied to the outer div
 */
var CircularGlowView = function CircularGlowView(_ref) {
  var id = _ref.id;
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;

  var radius = size / 2,
      colorNoHash = color.replace('#', ''),
      gradientID = 'CircularGlowView_' + (id || colorNoHash),
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
  id: React.PropTypes.string,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  style: React.PropTypes.object
};

exports.default = CircularGlowView;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Implements a rectangular text area for providing feedback to users, such as
 * that used in Geniverse's challenges for providing trial and goal feedback.
 * Implemented as a React stateless functional component.
 *
 * @param {string|string[]} text - a single or multiple lines of text to display
 * @param {object} style - inline styles applied to the <div> containing each line of text
 */
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

},{}],11:[function(require,module,exports){
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

},{"./animated-gamete":4}],12:[function(require,module,exports){
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

},{"./animated-gamete":4}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
    "div",
    { className: "select-wrapper" },
    React.createElement(
      "select",
      { value: currentSelection, onChange: onSelectionChange },
      possibleCombos
    )
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

},{"./chromosome-image":7}],16:[function(require,module,exports){
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
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
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
          editable: editable,
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
  alleleChanged: React.PropTypes.func.isRequired,
  editable: React.PropTypes.bool
};

exports.default = GenomeView;

},{"./chromosome":8}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var GlowBackgroundView = function GlowBackgroundView(_ref) {
  var id = _ref.id;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$containerStyle = _ref.containerStyle;
  var containerStyle = _ref$containerStyle === undefined ? {} : _ref$containerStyle;
  var _ref$glowStyle = _ref.glowStyle;
  var glowStyle = _ref$glowStyle === undefined ? {} : _ref$glowStyle;
  var ChildComponent = _ref.ChildComponent;
  var _ref$childStyle = _ref.childStyle;
  var childStyle = _ref$childStyle === undefined ? {} : _ref$childStyle;

  var others = _objectWithoutProperties(_ref, ['id', 'color', 'size', 'containerStyle', 'glowStyle', 'ChildComponent', 'childStyle']);

  var tContainerStyle = _extends({ position: 'relative', width: size, height: size }, containerStyle),
      tGlowStyle = _extends({ position: 'absolute' }, glowStyle),
      tChildStyle = _extends({ position: 'absolute' }, childStyle);

  return React.createElement(
    'div',
    { classNames: 'geniblocks glow-background', style: tContainerStyle },
    React.createElement(_circularGlow2.default, { id: id, color: color, size: size, style: tGlowStyle }),
    React.createElement(ChildComponent, _extends({ id: id, style: tChildStyle, width: size }, others))
  );
};

GlowBackgroundView.propTypes = {
  id: React.PropTypes.string.isRequired,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  containerStyle: React.PropTypes.object,
  glowStyle: React.PropTypes.object,
  ChildComponent: React.PropTypes.func,
  childStyle: React.PropTypes.object
};

exports.default = GlowBackgroundView;

},{"./circular-glow":9}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Represents a BioLogica organism as an image on top of a circular gradient "glow" background.
 * Implemented as a React stateless functional component.
 *
 * @param {BioLogica.Organism} org - the organism to be represented
 * @param {string} color - the color of the circular gradient "glow" background view.
 * @param {number} size
 */
var OrganismGlowView = function OrganismGlowView(_ref) {
  var id = _ref.id;
  var className = _ref.className;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var other = _objectWithoutProperties(_ref, ['id', 'className', 'color', 'size', 'style']);

  var propClass = className,
      containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' },
      orgStyle = _extends({ position: 'absolute' }, style);

  return React.createElement(
    'div',
    { id: id, className: 'geniblocks organism-glow ' + propClass, style: containerStyle },
    React.createElement(_circularGlow2.default, { id: id + '-glow', color: color, size: size, style: glowStyle }),
    React.createElement(_organism2.default, _extends({ id: id + '-organism', width: size, style: orgStyle }, other))
  );
};

OrganismGlowView.propTypes = {
  id: React.PropTypes.string,
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  style: React.PropTypes.object
};

exports.default = OrganismGlowView;

},{"./circular-glow":9,"./organism":19}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onClick = _ref.onClick;

  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url = baseUrl + org.getImageName();

  return React.createElement(
    "div",
    { className: "geniblocks organism", id: id, style: style, onMouseDown: onClick, onClick: onClick },
    React.createElement("img", { src: url, width: width })
  );
};

OrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  id: React.PropTypes.string,
  index: React.PropTypes.number,
  width: React.PropTypes.number,
  style: React.PropTypes.object,
  onClick: React.PropTypes.func
};

exports.default = OrganismView;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pen = require('./pen');

var _pen2 = _interopRequireDefault(_pen);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PenStatsView = function (_React$Component) {
  _inherits(PenStatsView, _React$Component);

  function PenStatsView() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, PenStatsView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PenStatsView)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.render = function () {
      var _this$props = _this.props;
      var orgs = _this$props.orgs;
      var lastClutchSize = _this$props.lastClutchSize;
      var selectedIndex = _this$props.selectedIndex;
      var onSelectionChange = _this$props.onSelectionChange;
      var others = _objectWithoutProperties(_this$props, ['orgs', 'lastClutchSize', 'selectedIndex', 'onSelectionChange']);
      var lastClutch = orgs.slice(-lastClutchSize);

      /* global ReactSimpleTabs */
      return React.createElement(
        ReactSimpleTabs,
        null,
        React.createElement(
          ReactSimpleTabs.Panel,
          { title: 'Breeding Pen', key: 'Breeding Pen' },
          React.createElement(GeniBlocks.PenView, _extends({
            orgs: lastClutch }, others, {
            selectedIndex: selectedIndex,
            onClick: function onClick(evt, iSelectedIndex) {
              if (onSelectionChange) onSelectionChange(iSelectedIndex);
            } }))
        ),
        React.createElement(
          ReactSimpleTabs.Panel,
          { title: 'Stats', key: 'Stats' },
          React.createElement(GeniBlocks.StatsView, { orgs: orgs, lastClutchSize: lastClutchSize })
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return PenStatsView;
}(React.Component);

PenStatsView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  lastClutchSize: React.PropTypes.number.isRequired,
  selectedIndex: React.PropTypes.number,
  onSelectionChange: React.PropTypes.func
};
exports.default = PenStatsView;

},{"./pen":21,"./stats":24}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PenView = function PenView(_ref) {
  var orgs = _ref.orgs;
  var _ref$idPrefix = _ref.idPrefix;
  var idPrefix = _ref$idPrefix === undefined ? 'organism-' : _ref$idPrefix;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 400 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 5 : _ref$columns;
  var _ref$SelectedOrganism = _ref.SelectedOrganismView;
  var SelectedOrganismView = _ref$SelectedOrganism === undefined ? _organism2.default : _ref$SelectedOrganism;
  var selectedIndex = _ref.selectedIndex;
  var onClick = _ref.onClick;


  function handleClick(evt) {
    var index = Number(evt.currentTarget.id.substr(idPrefix.length));
    if (onClick) onClick(evt, index);
  }

  var orgWidth = width / columns,
      orgViews = orgs.map(function (org, index) {
    return index === selectedIndex ? React.createElement(SelectedOrganismView, { org: org, id: idPrefix + index, index: index, key: index,
      color: '#FFFFAA', size: orgWidth, onClick: handleClick }) : React.createElement(_organism2.default, { org: org, id: idPrefix + index, index: index, key: index,
      width: orgWidth, onClick: handleClick });
  });

  return React.createElement(
    'div',
    { className: 'geniblocks pen' },
    orgViews
  );
};

PenView.propTypes = {
  orgs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  idPrefix: React.PropTypes.string,
  width: React.PropTypes.number,
  columns: React.PropTypes.number,
  SelectedOrganismView: React.PropTypes.func,
  selectedIndex: React.PropTypes.number,
  onClick: React.PropTypes.func
};

exports.default = PenView;

},{"./organism":19}],22:[function(require,module,exports){
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
    { className: 'geniblocks question-glow', style: containerStyle },
    React.createElement(_circularGlow2.default, { color: glowColor, size: size, style: glowStyle }),
    React.createElement('div', { className: 'geniblocks question-glow question-mark',
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

},{"./circular-glow":9}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _organismGlow = require('./organism-glow');

var _organismGlow2 = _interopRequireDefault(_organismGlow);

var _questionGlow = require('./question-glow');

var _questionGlow2 = _interopRequireDefault(_questionGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var QuestionOrganismGlowView = function QuestionOrganismGlowView(_ref) {
  var hidden = _ref.hidden;
  var color = _ref.color;
  var size = _ref.size;

  var other = _objectWithoutProperties(_ref, ['hidden', 'color', 'size']);

  var orgView = React.createElement(_organismGlow2.default, _extends({ color: color, size: size }, other)),
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
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number
};

exports.default = QuestionOrganismGlowView;

},{"./organism-glow":18,"./question-glow":22}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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
  }, {
    key: "numberOfBreedingMovesToReachDrake",
    value: function numberOfBreedingMovesToReachDrake(organism1, organism2, changeableAlleles1, changeableAlleles2, targetOrganism) {
      var moves = 0,
          org1Alleles = organism1.getAlleleString().split(',').map(function (a) {
        return a.split(':')[1];
      }),
          org2Alleles = organism2.getAlleleString().split(',').map(function (a) {
        return a.split(':')[1];
      }),
          targetchars = targetOrganism.phenotype.characteristics,
          traitRules = organism1.species.traitRules;

      for (var trait in traitRules) {
        if (traitRules.hasOwnProperty(trait)) {
          var possibleSolutions = traitRules[trait][targetchars[trait]],
              shortestPath = Infinity;
          if (possibleSolutions && possibleSolutions.length) {
            for (var i = 0, ii = possibleSolutions.length; i < ii; i++) {
              var solution = possibleSolutions[i],
                  movesForSolution1 = 0,
                  movesForSolution2 = 0;
              for (var j = 0, jj = solution.length; j < jj; j++) {
                var allele1 = solution[j],
                    allele2 = j % 2 === 0 ? solution[j + 1] : solution[j - 1],
                    solutionMoves = 0;
                if (org1Alleles.indexOf(allele1) === -1) {
                  if (allele1 && (changeableAlleles1.indexOf(allele1) > -1 || changeableAlleles1.indexOf(allele1.toLowerCase()) > -1)) {
                    solutionMoves++;
                  } else {
                    solutionMoves = Infinity;
                  }
                }

                if (org2Alleles.indexOf(allele2) === -1) {
                  if (allele2 && (changeableAlleles2.indexOf(allele2) > -1 || changeableAlleles2.indexOf(allele2.toLowerCase()) > -1)) {
                    solutionMoves++;
                  } else {
                    solutionMoves = Infinity;
                  }
                }

                if (j % 2 === 0) {
                  movesForSolution1 += solutionMoves;
                } else {
                  movesForSolution2 += solutionMoves;
                }
              }
              shortestPath = Math.min(shortestPath, Math.min(movesForSolution1, movesForSolution2));
            }
            moves += shortestPath;
          }
        }
      }

      return moves;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29kZS9hcHAuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVlZGJhY2suanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2ZlcnRpbGl6aW5nLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2VuZS1sYWJlbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLXN0YXRzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0tBOztBQUVFLG9CQUFvQixRQUFRLDZCQUFSLEVBQXVDLE9BQXZDO0lBQ3BCLGFBQWEsUUFBUSxxQkFBUixFQUErQixPQUEvQjtJQUNiLHFCQUFxQixRQUFRLDhCQUFSLEVBQXdDLE9BQXhDO0lBQ3JCLHVCQUF1QixRQUFRLGdDQUFSLEVBQTBDLE9BQTFDO0lBQ3ZCLG1CQUFtQixRQUFRLGlDQUFSLEVBQTJDLE9BQTNDO0lBQ25CLHNCQUFzQixRQUFRLCtCQUFSLEVBQXlDLE9BQXpDO0lBQ3RCLGlCQUFpQixRQUFRLHlCQUFSLEVBQW1DLE9BQW5DO0lBQ2pCLG1CQUFtQixRQUFRLDRCQUFSLEVBQXNDLE9BQXRDO0lBQ25CLGVBQWUsUUFBUSx1QkFBUixFQUFpQyxPQUFqQztJQUNmLHdCQUF3QixRQUFRLGlDQUFSLEVBQTJDLE9BQTNDO0lBQ3hCLGlCQUFpQixRQUFRLDBCQUFSLEVBQW9DLE9BQXBDO0lBQ2pCLGFBQWEsUUFBUSxxQkFBUixFQUErQixPQUEvQjtJQUNiLGdCQUFnQixRQUFRLHlCQUFSLEVBQW1DLE9BQW5DO0lBQ2hCLGlCQUFpQixRQUFRLDBCQUFSLEVBQW9DLE9BQXBDO0lBQ2pCLGFBQWEsUUFBUSxxQkFBUixFQUErQixPQUEvQjtJQUNiLHFCQUFxQixRQUFRLDhCQUFSLEVBQXdDLE9BQXhDO0lBQ3JCLGVBQWUsUUFBUSx1QkFBUixFQUFpQyxPQUFqQztJQUNmLG1CQUFtQixRQUFRLDRCQUFSLEVBQXNDLE9BQXRDO0lBQ25CLFVBQVUsUUFBUSxrQkFBUixFQUE0QixPQUE1QjtJQUNWLGVBQWUsUUFBUSx3QkFBUixFQUFrQyxPQUFsQztJQUNmLG1CQUFtQixRQUFRLDRCQUFSLEVBQXNDLE9BQXRDO0lBQ25CLDJCQUEyQixRQUFRLHFDQUFSLEVBQStDLE9BQS9D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QTJCO2tCQW5NZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICogU2VlIGh0dHBzOi8vbWVkaXVtLmNvbS9Aa2VudGNkb2Rkcy9taXN1bmRlcnN0YW5kaW5nLWVzNi1tb2R1bGVzLXVwZ3JhZGluZy1iYWJlbC10ZWFycy1hbmQtYS1zb2x1dGlvbi1hZDJkNWFiOTNjZTAjLnExdmNrZmZpd1xuICogKEtlbnQgQy4gRG9kZHMsIFwiTWlzdW5kZXJzdGFuZGluZyBFUzYgTW9kdWxlcywgVXBncmFkaW5nIEJhYmVsLCBUZWFycywgYW5kIGEgU29sdXRpb25cIilcbiAqIGZvciBkZXNjcmlwdGlvbiBvZiBzb21lIG9mIHRoZSBkZXRhaWxzIGludm9sdmVkIGluIG1peGluZyBFUzYgZXhwb3J0IHdpdGggcmVxdWlyZSgpLlxuICovXG5jb25zdFxuICAvLyBjb21wb25lbnRzXG4gIEFsbGVsZUZpbHRlcnNWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzJykuZGVmYXVsdCxcbiAgQWxsZWxlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9hbGxlbGUnKS5kZWZhdWx0LFxuICBBbmltYXRlZEdhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlJykuZGVmYXVsdCxcbiAgQW5pbWF0ZWRPcmdhbmlzbVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYW5pbWF0ZWQtb3JnYW5pc20nKS5kZWZhdWx0LFxuICBDaGFuZ2VTZXhCdXR0b25zID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucycpLmRlZmF1bHQsXG4gIENocm9tb3NvbWVJbWFnZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZScpLmRlZmF1bHQsXG4gIENocm9tb3NvbWVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnKS5kZWZhdWx0LFxuICBDaXJjdWxhckdsb3dWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cnKS5kZWZhdWx0LFxuICBGZWVkYmFja1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZmVlZGJhY2snKS5kZWZhdWx0LFxuICBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlJykuZGVmYXVsdCxcbiAgR2FtZXRlUG9vbFZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wnKS5kZWZhdWx0LFxuICBHYW1ldGVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dhbWV0ZScpLmRlZmF1bHQsXG4gIEdlbmVMYWJlbFZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCcpLmRlZmF1bHQsXG4gIEdlbm9tZVRlc3RWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dlbm9tZS10ZXN0JykuZGVmYXVsdCxcbiAgR2Vub21lVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5vbWUnKS5kZWZhdWx0LFxuICBHbG93QmFja2dyb3VuZFZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kJykuZGVmYXVsdCxcbiAgT3JnYW5pc21WaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL29yZ2FuaXNtJykuZGVmYXVsdCxcbiAgT3JnYW5pc21HbG93VmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9vcmdhbmlzbS1nbG93JykuZGVmYXVsdCxcbiAgUGVuVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wZW4nKS5kZWZhdWx0LFxuICBQZW5TdGF0c1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcGVuLXN0YXRzJykuZGVmYXVsdCxcbiAgUXVlc3Rpb25HbG93VmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9xdWVzdGlvbi1nbG93JykuZGVmYXVsdCxcbiAgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cnKS5kZWZhdWx0LFxuICBTdGF0c1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc3RhdHMnKS5kZWZhdWx0LFxuICAvLyB1dGlsaXRpZXNcbiAgR2VuZXRpY3NVdGlscyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJykuZGVmYXVsdDtcblxuZXhwb3J0IHtcbiAgLy8gY29tcG9uZW50c1xuICBBbGxlbGVGaWx0ZXJzVmlldyxcbiAgQWxsZWxlVmlldyxcbiAgQW5pbWF0ZWRHYW1ldGVWaWV3LFxuICBBbmltYXRlZE9yZ2FuaXNtVmlldyxcbiAgQ2hhbmdlU2V4QnV0dG9ucyxcbiAgQ2hyb21vc29tZUltYWdlVmlldyxcbiAgQ2hyb21vc29tZVZpZXcsXG4gIENpcmN1bGFyR2xvd1ZpZXcsXG4gIEZlZWRiYWNrVmlldyxcbiAgRmVydGlsaXppbmdHYW1ldGVWaWV3LFxuICBHYW1ldGVQb29sVmlldyxcbiAgR2FtZXRlVmlldyxcbiAgR2VuZUxhYmVsVmlldyxcbiAgR2Vub21lVGVzdFZpZXcsXG4gIEdlbm9tZVZpZXcsXG4gIEdsb3dCYWNrZ3JvdW5kVmlldyxcbiAgT3JnYW5pc21WaWV3LFxuICBPcmdhbmlzbUdsb3dWaWV3LFxuICBQZW5WaWV3LFxuICBQZW5TdGF0c1ZpZXcsXG4gIFF1ZXN0aW9uR2xvd1ZpZXcsXG4gIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyxcbiAgU3RhdHNWaWV3LFxuICAvLyB1dGlsaXRpZXNcbiAgR2VuZXRpY3NVdGlsc1xufTtcbiIsImNvbnN0IEFsbGVsZUZpbHRlcnNWaWV3ID0gKHtzcGVjaWVzLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNhYmxlZEFsbGVsZXMgPSBbXSwgb25GaWx0ZXJDaGFuZ2V9KSA9PiB7XG4gIGxldCBoaWRkZW5HZW5lcyA9IG5ldyBTZXQsXG4gICAgICBnZW5lSW5wdXRzID0gW107XG5cbiAgZm9yIChjb25zdCBhbGxlbGUgb2YgaGlkZGVuQWxsZWxlcykge1xuICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSk7XG4gICAgaWYgKGdlbmUpXG4gICAgICBoaWRkZW5HZW5lcy5hZGQoZ2VuZS5uYW1lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZ2VuZSBpbiBzcGVjaWVzLmdlbmVMaXN0KSB7XG4gICAgaWYgKCFoaWRkZW5HZW5lcy5oYXMoZ2VuZSkpIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMsXG4gICAgICAgICAgICBhbGxlbGVJdGVtcyA9IGFsbGVsZXMubWFwKGFsbGVsZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV0sXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAhKGRpc2FibGVkQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPj0gMCk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpbkxlZnRcIjogXCI4cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgZ2VuZUlucHV0cy5wdXNoKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmUtYWxsZWxlLWxpc3RcIiBrZXk9e2dlbmV9PnthbGxlbGVJdGVtc308L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIGFsbGVsZSA9IGVsdCAmJiBlbHQudmFsdWUsXG4gICAgICAgICAgaXNDaGVja2VkID0gZWx0ICYmIGVsdC5jaGVja2VkO1xuICAgIGlmIChvbkZpbHRlckNoYW5nZSAmJiBhbGxlbGUpXG4gICAgICBvbkZpbHRlckNoYW5nZShldnQsIGFsbGVsZSwgaXNDaGVja2VkKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZS1maWx0ZXJzXCJcbiAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpblRvcFwiOiBcIjVweFwiLCBcIm1hcmdpbkJvdHRvbVwiOiBcIjVweFwiIH19PlxuICAgICAgeyBnZW5lSW5wdXRzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkFsbGVsZUZpbHRlcnNWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzYWJsZWRBbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgb25GaWx0ZXJDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZUZpbHRlcnNWaWV3O1xuIiwiY29uc3QgQWxsZWxlVmlldyA9ICh7YWxsZWxlLCB0YXJnZXQsIGNvbG9yLCBzaGFwZSwgaG92ZXJpbmd9KSA9PiB7XG4gIGxldCB3aWR0aD0yMSxcbiAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBzdHJva2UgPSB0YXJnZXQgPyBcIiMwMDAwMDBcIiA6IFwibm9uZVwiLFxuICAgICAgZmlsbCA9IGFsbGVsZSA/IGNvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgc3Ryb2tlV2lkdGggPSBob3ZlcmluZyA/IDMgOiAxLFxuICAgICAgc3Ryb2tlRGFzaGFycmF5PSBhbGxlbGUgPyBcIjBcIiA6IFwiMVwiLFxuICAgICAgc3ZnU2hhcGUgPSBudWxsO1xuXG4gIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgIHN2Z1NoYXBlID0gPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMX0gY3g9e3JhZGl1cysxfSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfSBlbHNlIHtcbiAgICBzdmdTaGFwZSA9IDxyZWN0IHdpZHRoPXsocmFkaXVzKjIpfSBoZWlnaHQ9eyhyYWRpdXMqMil9IHg9XCIxXCIgeT1cIjFcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfVxuXG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aCsyfSBoZWlnaHQ9e3dpZHRoKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICB7IHN2Z1NoYXBlIH1cbiAgICAgICAgPHRleHQgeD17cmFkaXVzKzF9IHk9e3JhZGl1cys3fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+e2FsbGVsZX08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlIHRoYXQgYW5pbWF0ZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gW2luaXRpYWxEaXNwbGF5XSAtIGluaXRpYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueF0gLSBpbml0aWFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnldIC0gaW5pdGlhbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnNpemU9MzBdIC0gaW5pdGlhbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5yb3RhdGlvbj0wXSAtIGluaXRpYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5vcGFjaXR5PTFdIC0gaW5pdGlhbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZmluYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBmaW5hbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGZpbmFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIGZpbmFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSBmaW5hbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIGZpbmFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthbmltU3RpZmZuZXNzPTEwMF0gLSBzcHJpbmcgc3RpZmZuZXNzIHVzZWQgdG8gY29udHJvbCBhbmltYXRpb24gc3BlZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uUmVjdCgpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgYXQgcmVzdFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5pbXBvcnQgR2FtZXRlVmlldyBmcm9tICcuL2dhbWV0ZSc7XG5cbmNvbnN0IEFuaW1hdGVkR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgaW5pdGlhbERpc3BsYXksIGRpc3BsYXksIGFuaW1TdGlmZm5lc3M9MTAwLCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrLCBvblJlc3R9KSA9PiB7XG5cbiAgY29uc3QgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBpbml0aWFsID0gaW5pdGlhbERpc3BsYXkgfHwgZGlzcGxheSxcbiAgICAgICAgaW5pdGlhbFNpemUgPSBpbml0aWFsLnNpemUgfHwgMzAsXG4gICAgICAgIGluaXRpYWxSb3RhdGlvbiA9IGluaXRpYWwucm90YXRpb24gIT0gbnVsbCA/IGluaXRpYWwucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWwub3BhY2l0eSAhPSBudWxsID8gaW5pdGlhbC5vcGFjaXR5IDogMS4wLFxuICAgICAgICBmaW5hbFNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIGZpbmFsUm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgZmluYWxPcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzIH07XG4gIC8qIGVzbGludCByZWFjdC9kaXNwbGF5LW5hbWU6MCAqL1xuICByZXR1cm4gKFxuICAgIDxSZWFjdE1vdGlvbi5Nb3Rpb24gZGVmYXVsdFN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGluaXRpYWwueCwgeTogaW5pdGlhbC55LCBzaXplOiBpbml0aWFsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGluaXRpYWxSb3RhdGlvbiwgb3BhY2l0eTogaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBSZWFjdE1vdGlvbi5zcHJpbmcoZGlzcGxheS54LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBSZWFjdE1vdGlvbi5zcHJpbmcoZGlzcGxheS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWxTaXplLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsUm90YXRpb24sIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbE9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PlxuICAgICAgICAgIDxHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9IFxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e2ludGVycG9sYXRlZFN0eWxlfVxuICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9IGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZEdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIGluaXRpYWxEaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAvLyBpbml0aWFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLFxuICBkaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZmluYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICBpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvblJlc3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZEdhbWV0ZVZpZXc7XG4iLCJpbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG5jb25zdCBBbmltYXRlZE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgd2lkdGg9MjAwLCBzdHlsZT17fSwgaW5pdGlhbE9wYWNpdHk9MS4wLCBvcGFjaXR5PTEuMCwgc3RpZmZuZXNzPTYwLCBvblJlc3QsIG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBvcGFjaXR5U3RhcnQgPSBpbml0aWFsT3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICA6IChvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogMS4wKTtcbiAgbGV0ICAgb3BhY2l0eUVuZCA9IG9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG9wYWNpdHkgOiBvcGFjaXR5U3RhcnQ7XG5cbiAgaWYgKG9wYWNpdHlFbmQgIT09IG9wYWNpdHlTdGFydClcbiAgICBvcGFjaXR5RW5kID0gUmVhY3RNb3Rpb24uc3ByaW5nKG9wYWNpdHlFbmQsIHsgc3RpZmZuZXNzOiBzdGlmZm5lc3MgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RNb3Rpb24uTW90aW9uIGRlZmF1bHRTdHlsZT17e29wYWNpdHk6IG9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogb3BhY2l0eUVuZH19IG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+IHtcbiAgICAgICAgICBjb25zdCB0U3R5bGUgPSB7IC4uLnN0eWxlLCAuLi5pbnRlcnBvbGF0ZWRTdHlsZSB9O1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWR9IHdpZHRoPXt3aWR0aH0gc3R5bGU9e3RTdHlsZX0gb25DbGljaz17b25DbGlja30gLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBpbml0aWFsT3BhY2l0eTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgb3BhY2l0eTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgc3RpZmZuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBvblJlc3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRPcmdhbmlzbVZpZXc7XG4iLCIvKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBtYWxlL2ZlbWFsZSBjaGFuZ2UgYnV0dG9uc1xuICogQHBhcmFtIHtzdHJpbmd9IHNleCAtIFsnbWFsZScgfCAnZmVtYWxlJ10gY3VycmVudGx5IHNlbGVjdGVkIGJ1dHRvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25DaGFuZ2UoZXZ0LCBzZXgpIC0gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdXNlIGNsaWNrcyB0byBjaGFuZ2Ugc2V4XG4gKi9cbmNvbnN0IENoYW5nZVNleEJ1dHRvbnMgPSAoe3NleCwgc3BlY2llcywgc2hvd0xhYmVsLCBzdHlsZT17fSwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IGNhcFNleCA9IHNleC5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIHNleC5zdWJzdHIoMSksXG4gICAgICAgIHNlbGVjdGVkU2V4Q2xhc3MgPSBzZXggPT09ICdtYWxlJyA/IFwibWFsZS1zZWxlY3RlZFwiIDogXCJmZW1hbGUtc2VsZWN0ZWRcIixcbiAgICAgICAgQlVUVE9OX0lNQUdFX1dJRFRIID0gMTAwLFxuICAgICAgICBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCA9IEJVVFRPTl9JTUFHRV9XSURUSCAvIDIsXG4gICAgICAgIGltYWdlU3R5bGUgPSBPYmplY3QuYXNzaWduKHN0eWxlLCB7cG9zaXRpb246ICdhYnNvbHV0ZSd9KSxcbiAgICAgICAgbGFiZWwgPSBzaG93TGFiZWwgPyBgJHtjYXBTZXh9ICR7c3BlY2llc31gIDogJycsXG4gICAgICAgIGxhYmVsRWxlbWVudCA9IHNob3dMYWJlbCA/IDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IEJVVFRPTl9JTUFHRV9XSURUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTB9fT57bGFiZWx9PC9kaXY+IDogJyc7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0UmVjdCA9IGV2dC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgY2xpY2tYID0gZXZ0LmNsaWVudFggLSBlbHRSZWN0LmxlZnQ7XG4gICAgaWYgKChzZXggPT09ICdtYWxlJykgIT09IChjbGlja1ggPiBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCkpXG4gICAgICBvbkNoYW5nZShldnQsIHNleCA9PT0gJ21hbGUnID8gJ2ZlbWFsZScgOiAnbWFsZScpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxkaXYgIGNsYXNzTmFtZT17YGdlbmlibG9ja3MgY2hhbmdlLXNleC1idXR0b25zICR7c2VsZWN0ZWRTZXhDbGFzc31gfVxuICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSA+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtsYWJlbEVsZW1lbnR9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaGFuZ2VTZXhCdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgc2V4OiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydtYWxlJywgJ2ZlbWFsZSddKS5pc1JlcXVpcmVkLFxuICBzcGVjaWVzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBzaG93TGFiZWw6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVNleEJ1dHRvbnM7XG4iLCJjb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKCkgPT4ge1xuICBsZXQgd2lkdGg9MjMsXG4gICAgICBoZWlnaHQ9MTI2LFxuICAgICAgc3BsaXQ9NDUsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQsXG4gICAgICBjb2xvciA9IFwiI0ZGOTk5OVwiO1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzJ9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtoZWlnaHQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhzcGxpdC1yYWRpdXMpLShyYWRpdXMrMil9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPVwiMlwiICAgICAgIHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZUltYWdlVmlldztcbiIsImltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuXG5jb25zdCBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcCggYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKCBhID0+IHtcbiAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICB9KTtcbn07XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBlZGl0YWJsZT10cnVlLCBhbGxlbGVDaGFuZ2VkLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgbGFiZWxzICA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXtlZGl0YWJsZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoYSwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICAgICk7XG4gICAgICB9KSxcblxuICAgICAgY29udGFpbmVyQ2xhc3MgPSBcIml0ZW1zXCI7XG5cbiAgaWYgKCFsYWJlbHNPblJpZ2h0KSB7XG4gICAgY29udGFpbmVyQ2xhc3MgKz0gXCIgcnRsXCI7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsc1wiPlxuICAgICAgICAgIHsgbGFiZWxzIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNocm9tb3NvbWVOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpZGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBlZGl0YWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGFsbGVsZUNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxhYmVsc09uUmlnaHQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsIi8qKlxuICogVXNlcyBhbiBTVkcgY2lyY3VsYXIgZ3JhZGllbnQgdG8gaW1wbGVtZW50IGEgZmFkaW5nIGdsb3cgYmFja2dyb3VuZC5cbiAqIEltcGxlbWVudGVkIGFzIGEgc3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIHRoZSBjb2xvciBvZiB0aGUgY2lyY3VsYXIgZ3JhZGllbnQgXCJnbG93XCJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gdGhlIGRpYW1ldGVyIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudFxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gc3R5bGVzIGFwcGxpZWQgdG8gdGhlIG91dGVyIGRpdlxuICovXG5jb25zdCBDaXJjdWxhckdsb3dWaWV3ID0gKHtpZCwgY29sb3IsIHNpemUsIHN0eWxlfSkgPT4ge1xuICBsZXQgcmFkaXVzID0gc2l6ZS8yLFxuICAgICAgY29sb3JOb0hhc2ggPSBjb2xvci5yZXBsYWNlKCcjJywgJycpLFxuICAgICAgZ3JhZGllbnRJRCA9IGBDaXJjdWxhckdsb3dWaWV3XyR7aWQgfHwgY29sb3JOb0hhc2h9YCxcbiAgICAgIGdyYWRpZW50SURVcmwgPSBgdXJsKCMke2dyYWRpZW50SUR9KWA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZXM9XCJnZW5pYmxvY2tzIGdsb3dcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8ZGVmcz5cbiAgICAgICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9e2dyYWRpZW50SUR9PlxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wQ29sb3I9e2NvbG9yfSBzdG9wT3BhY2l0eT1cIjEuMFwiLz5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wQ29sb3I9e2NvbG9yfSBzdG9wT3BhY2l0eT1cIjAuMFwiLz5cbiAgICAgICAgICA8L3JhZGlhbEdyYWRpZW50PlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxjaXJjbGUgZmlsbD17Z3JhZGllbnRJRFVybH0gY3g9e3JhZGl1c30gY3k9e3JhZGl1c30gcj17cmFkaXVzfSAvPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaXJjdWxhckdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiLyoqXG4gKiBJbXBsZW1lbnRzIGEgcmVjdGFuZ3VsYXIgdGV4dCBhcmVhIGZvciBwcm92aWRpbmcgZmVlZGJhY2sgdG8gdXNlcnMsIHN1Y2ggYXNcbiAqIHRoYXQgdXNlZCBpbiBHZW5pdmVyc2UncyBjaGFsbGVuZ2VzIGZvciBwcm92aWRpbmcgdHJpYWwgYW5kIGdvYWwgZmVlZGJhY2suXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdGV4dCAtIGEgc2luZ2xlIG9yIG11bHRpcGxlIGxpbmVzIG9mIHRleHQgdG8gZGlzcGxheVxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gaW5saW5lIHN0eWxlcyBhcHBsaWVkIHRvIHRoZSA8ZGl2PiBjb250YWluaW5nIGVhY2ggbGluZSBvZiB0ZXh0XG4gKi9cbmNvbnN0IEZlZWRiYWNrVmlldyA9ICh7dGV4dCwgc3R5bGU9e319KSA9PiB7XG4gIGNvbnN0IHRUZXh0ID0gQXJyYXkuaXNBcnJheSh0ZXh0KSA/IHRleHQgOiBbdGV4dF0sXG4gICAgICAgIGxpbmVDb3VudCA9IHRUZXh0Lmxlbmd0aCxcbiAgICAgICAgaGVpZ2h0ID0gMjAgKiBsaW5lQ291bnQgKyAyLFxuICAgICAgICBkZWZhdWx0U3R5bGUgPSB7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjODc3ODcxJyxcbiAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGJsYWNrJyxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgIGZvbnRTaXplOiAnMTFwdCcsXG4gICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnXG4gICAgICAgIH0sXG4gICAgICAgIHRTdHlsZSA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdFN0eWxlLCBzdHlsZSksXG4gICAgICAgIHRleHRMaW5lcyA9IHRUZXh0Lm1hcCgoaVRleHQsIGluZGV4KSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2sgdGV4dC1saW5lXCIga2V5PXtpbmRleH0+e2lUZXh0fTwvZGl2Pik7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2tcIiBzdHlsZT17dFN0eWxlfT5cbiAgICAgIHt0ZXh0TGluZXN9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5GZWVkYmFja1ZpZXcucHJvcFR5cGVzID0ge1xuICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpXG4gICAgICAgIF0pLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBGZWVkYmFja1ZpZXc7XG4iLCJpbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgSU5JVElBTF9HQU1FVEVfU0laRSA9IDMwLFxuICAgICAgRklOQUxfR0FNRVRFX1NJWkUgPSAxNDAsXG4gICAgICBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCA9IDAsXG4gICAgICBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDE1MCxcbiAgICAgIEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCA9IDcwLFxuICAgICAgRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YID0gODAsXG4gICAgICBGSU5BTF9aWUdPVEVfWSA9IC0xNTA7XG5cbmV4cG9ydCBjb25zdCBHQU1FVEVfVFlQRSA9IHsgTU9USEVSOiAnbW90aGVyJywgRkFUSEVSOiAnZmF0aGVyJyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdHlwZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsgR0FNRVRFX1RZUEUuTU9USEVSLCBHQU1FVEVfVFlQRS5GQVRIRVIgXSkuaXNSZXF1aXJlZCxcbiAgICBnYW1ldGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGZlcnRpbGl6YXRpb25TdGF0ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFsnbm9uZScsICdmZXJ0aWxpemluZycsICdmZXJ0aWxpemVkJywgJ2NvbXBsZXRlJ10pLmlzUmVxdWlyZWQsXG4gICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gICAgc3JjUmVjdDogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgZHN0UmVjdDogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICAgIG9uUmVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGlkZGVuQWxsZWxlczogW10sXG4gICAgYW5pbVN0aWZmbmVzczogMTAwXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlciA9ICgpID0+IHtcbiAgICBsZXQge2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXMsIGFuaW1TdGlmZm5lc3MsIG9uUmVzdH0gPSB0aGlzLnByb3BzLFxuICAgICAgICB4T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LmxlZnQgLSB0aGlzLnByb3BzLmRzdFJlY3QubGVmdCA6IDAsXG4gICAgICAgIHlPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QudG9wIC0gdGhpcy5wcm9wcy5kc3RSZWN0LnRvcCA6IDAsXG4gICAgICAgIHhSZXN0aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogUkVTVElOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIHhGZXJ0aWxpemluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICBpbml0aWFsLCBmaW5hbDtcblxuICAgIGlmICghZ2FtZXRlIHx8ICFpZCkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnbm9uZScpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUilcbiAgICAgICAgeE9mZnNldCArPSBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWDtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhPZmZzZXQsIHk6IHlPZmZzZXQsIHNpemU6IElOSVRJQUxfR0FNRVRFX1NJWkUgfTtcbiAgICAgIGZpbmFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdmZXJ0aWxpemluZycpIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgb3BhY2l0eTogMS4wIH07XG4gICAgICBmaW5hbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIGZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IEZJTkFMX1pZR09URV9ZLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDAuMCB9O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXtpbml0aWFsfSBkaXNwbGF5PXtmaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc30gb25SZXN0PXtvblJlc3R9IC8+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IEdhbWV0ZVBvb2xWaWV3ID0gKHtnYW1ldGVzLCBoaWRkZW5BbGxlbGVzPVtdLCB3aWR0aD0zMDAsIGhlaWdodD0yMDAsIGFuaW1TdGlmZm5lc3M9NjAsIHNlbGVjdGVkSWQsIGlzR2FtZXRlRGlzYWJsZWQsIG9uR2FtZXRlU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBnYW1ldGVDb3VudCA9IGdhbWV0ZXMubGVuZ3RoLFxuICAgICAgZ2FtZXRlU2l6ZSA9IDMwLFxuICAgICAgbWFyZ2luID0gNSxcbiAgICAgIHNwYWNpbmdEZWZhdWx0ID0gZ2FtZXRlU2l6ZSArIDIgKiBtYXJnaW4sXG4gICAgICB4U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgeVNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIGNvbERlZmF1bHQgPSBNYXRoLmZsb29yKHdpZHRoIC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgcm93RGVmYXVsdCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgZW5hYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRGbGFncyA9IGdhbWV0ZXMubWFwKGcgPT4gaXNHYW1ldGVEaXNhYmxlZChnKSksXG4gICAgICB0b3RhbERpc2FibGVkQ291bnQgPSBkaXNhYmxlZEZsYWdzLnJlZHVjZSgodG90YWwsZmxhZykgPT4gdG90YWwgKyBmbGFnLCAwKSxcbiAgICAgIC8vIGxlYXZlIHJvb20gZm9yIHRoZSBkaXNhYmxlZCBnYW1ldGUgcm93IGlmIHRoZXJlIGFyZSBkaXNhYmxlZCBnYW1ldGVzXG4gICAgICBhdmFpbGFibGVIZWlnaHQgPSBoZWlnaHQgLSAodG90YWxEaXNhYmxlZENvdW50ID8gc3BhY2luZ0RlZmF1bHQgOiAwKSAtIDQgKiBtYXJnaW4sXG4gICAgICAvLyBwYWNrIHRoZSBkaXNhYmxlZCBnYW1ldGVzIGludG8gdGhlIGRpc2FibGVkIHJvd1xuICAgICAgeERpc2FibGVkU3BhY2luZyA9IE1hdGgubWluKHhTcGFjaW5nIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod2lkdGggLSA3ICogbWFyZ2luKSAvIHRvdGFsRGlzYWJsZWRDb3VudCksXG4gICAgICB5RGlzYWJsZWRTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB0b3RhbEVuYWJsZWRDb3VudCA9IGdhbWV0ZUNvdW50IC0gdG90YWxEaXNhYmxlZENvdW50LFxuICAgICAgZ2FtZXRlVmlld3M7XG5cbiAgLy8gc3F1ZWV6ZSBpbiB0byBtYWtlIHJvb20gZm9yIGFkZGl0aW9uYWwgZ2FtZXRlcyBpZiBuZWNlc3NhcnlcbiAgdmFyIGNvbENvdW50ID0gY29sRGVmYXVsdCxcbiAgICAgIHJvd0NvdW50ID0gcm93RGVmYXVsdCAtICh0b3RhbERpc2FibGVkQ291bnQgPiAwKTtcbiAgd2hpbGUgKGNvbENvdW50ICogcm93Q291bnQgPCB0b3RhbEVuYWJsZWRDb3VudCkge1xuICAgIGlmICh5U3BhY2luZyA+IHhTcGFjaW5nKSB7XG4gICAgICB5U3BhY2luZyA9IGF2YWlsYWJsZUhlaWdodCAvICsrcm93Q291bnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeFNwYWNpbmcgPSAod2lkdGggLSA0ICogbWFyZ2luKSAvICsrY29sQ291bnQ7XG4gICAgfVxuICB9XG5cbiAgZ2FtZXRlVmlld3MgPSBnYW1ldGVzLm1hcCgoZ2FtZXRlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBkaXNhYmxlZEZsYWdzW2luZGV4XSxcbiAgICAgICAgICBsYXlvdXRJbmRleCA9IGlzRGlzYWJsZWQgPyBkaXNhYmxlZENvdW50KysgOiBlbmFibGVkQ291bnQrKyxcbiAgICAgICAgICByb3cgPSBpc0Rpc2FibGVkID8gcm93RGVmYXVsdCAtIDEgOiBNYXRoLmZsb29yKGxheW91dEluZGV4IC8gY29sQ291bnQpLFxuICAgICAgICAgIGNvbCA9IGlzRGlzYWJsZWQgPyBsYXlvdXRJbmRleCA6IGxheW91dEluZGV4ICUgY29sQ291bnQsXG4gICAgICAgICAgeSA9IGlzRGlzYWJsZWQgPyByb3cgKiB5RGlzYWJsZWRTcGFjaW5nIDogcm93ICogeVNwYWNpbmcsXG4gICAgICAgICAgeCA9IGlzRGlzYWJsZWQgPyBjb2wgKiB4RGlzYWJsZWRTcGFjaW5nIDogY29sICogeFNwYWNpbmc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpbmRleCArIDF9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXt7IHg6IE1hdGgucm91bmQod2lkdGgvMiksIHk6IC1NYXRoLnJvdW5kKHlTcGFjaW5nKSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5PXt7IHg6IE1hdGgucm91bmQoeCksIHk6IE1hdGgucm91bmQoeSkgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggKyAxID09PSBzZWxlY3RlZElkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkdhbWV0ZVNlbGVjdGVkfSAvPlxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdhbWV0ZS1wb29sXCIgc3R5bGU9e3sgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9fT5cbiAgICAgIHsgZ2FtZXRlVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlUG9vbFZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgc2VsZWN0ZWRJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaXNHYW1ldGVEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9uR2FtZXRlU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVQb29sVmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnYW1ldGUgLSBCaW9sb2dpY2EgZ2FtZXRlIChtYXAgb2YgY2hyb21vc29tZSBuYW1lcyB0byBjaHJvbW9zb21lcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1ldGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IGhpZGRlbkFsbGVsZXMgLSBpbmRpdmlkdWFsIGFsbGVsZXMgb2YgZ2VuZXMgZm9yIHdoaWNoIGFsbCBhbGxlbGVzIHNob3VsZCBiZSBoaWRkZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtib29sZWFufSBbaXNTZWxlY3RlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdzZWxlY3RlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNEaXNhYmxlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdkaXNhYmxlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uQ2xpY2soZXZ0LCBpZCwgcmVjdCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGdhbWV0ZSBpcyBjbGlja2VkXG4gKlxuICogTm90ZTogQXMgdGhpbmdzIHN0YW5kIGN1cnJlbnRseSwgdGhlcmUgaXMgX25vXyBwYXJ0aWN1bGFyIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgZGVmaW5lZFxuICogYnkgdGhpcyB2aWV3LiBUaGUgY2xpZW50IGNhbiBzdHlsZSB0aGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBieSBzdHlsaW5nIHRoZVxuICogJy5nZW5pYmxvY2tzLmdhbWV0ZScgY2xhc3MgaW4gQ1NTLCBlLmcuIGJ5IGFzc2lnbmluZyBhIGJhY2tncm91bmQtaW1hZ2UuXG4gKi9cbmNvbnN0IEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXM9W10sIGRpc3BsYXksIGlzU2VsZWN0ZWQ9ZmFsc2UsIGlzRGlzYWJsZWQ9ZmFsc2UsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICByZWN0ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICghaXNEaXNhYmxlZCkge1xuICAgICAgb25DbGljayhldnQsIGlkLCByZWN0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKSB7XG4gICAgbGV0IHRvb2x0aXAgPSBcIlwiLFxuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzO1xuICAgIC8vIE5vdGU6IGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IGZvciB0aGUgY2FsbGVyIHRvIHBhc3MgaW4gdGhlXG4gICAgLy8gYWxsSGlkZGVuQWxsZWxlcyBhcnJheSByYXRoZXIgdGhhbiBjb21wdXRpbmcgaXQgZWFjaCB0aW1lIGhlcmUuXG4gICAgLy8gQnV0IGlmIHdlIG1vdmVkIGl0IG91dCByaWdodCBub3cgd2UnZCBoYXZlIHRvIGVsaW1pbmF0ZSB0aGUgRVM2IHNwbGF0LlxuICAgIGZ1bmN0aW9uIGNvbmNhdEhpZGRlbkFsbGVsZXMoaVNwZWNpZXMsIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICBhbGxIaWRkZW5BbGxlbGVzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShpU3BlY2llcywgYWxsZWxlKTtcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcy5wdXNoKC4uLmdlbmUuYWxsZWxlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2ggaW4gZ2FtZXRlKSB7XG4gICAgICB2YXIgY2hyb21vc29tZSA9IGdhbWV0ZVtjaF07XG4gICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcyA9PSBudWxsKVxuICAgICAgICBjb25jYXRIaWRkZW5BbGxlbGVzKGNocm9tb3NvbWUuc3BlY2llcywgaGlkZGVuQWxsZWxlcyk7XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBjaHJvbW9zb21lLmFsbGVsZXMpIHtcbiAgICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMuaW5kZXhPZihhbGxlbGUpIDwgMCkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hyb21vc29tZS5zcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgbGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PT0gJ1hZJykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNocm9tb3NvbWUuc2lkZSA9PT0gJ3knID8gJ3knIDogJ3gnO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENsYXNzID0gaXNTZWxlY3RlZCAmJiAhaXNEaXNhYmxlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkQ2xhc3MgPSBpc0Rpc2FibGVkID8gXCJkaXNhYmxlZFwiIDogXCJcIixcbiAgICAgICAgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBjbGFzc2VzID0gYGdlbmlibG9ja3MgZ2FtZXRlICR7c2VsZWN0ZWRDbGFzc30gJHtkaXNhYmxlZENsYXNzfSBncm91cCR7Z3JvdXB9YCxcbiAgICAgICAgc2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgcm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgdHJhbnNmb3JtID0gcm90YXRpb24gPyBgcm90YXRlKCR7cm90YXRpb259ZGVnKWAgOiAnJyxcbiAgICAgICAgb3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICB0b29sdGlwID0gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHRpdGxlPXt0b29sdGlwfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LngsIHRvcDogZGlzcGxheS55LFxuICAgICAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybSwgb3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzcGxheTogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGlzU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVZpZXc7XG4iLCJjb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGxldCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlIG5vbmVkaXRhYmxlXCI+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHsgYWxsZWxlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZVwiPlxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgYWxsZWxlIH0gb25DaGFuZ2U9eyBvbkFsbGVsZUNoYW5nZSB9PlxuICAgICAgICAgIHsgYWxsZWxlT3B0aW9ucyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvbkFsbGVsZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5cbmxldCBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICAgICAgbGV0IGhpZGRlbkdlbmVzID0gaGlkZGVuQWxsZWxlcy5tYXAoIGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gICAgICByZXR1cm4gYWxsZWxlcy5maWx0ZXIoIGEgPT4ge1xuICAgICAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgICAgIHJldHVybiBoaWRkZW5HZW5lcy5pbmRleE9mKGdlbmUpID09PSAtMTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgVGVzdFB1bGxkb3duVmlldyA9ICh7c3BlY2llcywgZ2VuZSwgc2VsZWN0aW9uLCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgICAgIGxldCBhbGxlbGVzID0gZ2VuZS5hbGxlbGVzLFxuICAgICAgICAgIGFsbGVsZU5hbWVzID0gYWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgICBudW1BbGxlbGVzID0gYWxsZWxlTmFtZXMubGVuZ3RoLFxuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zID0gW10sXG4gICAgICAgICAgY3VycmVudFNlbGVjdGlvbiA9IHNlbGVjdGlvbiB8fCBcInBsYWNlaG9sZGVyXCIsXG4gICAgICAgICAgaSwgajtcblxuICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT1cInBsYWNlaG9sZGVyXCIgdmFsdWU9XCJwbGFjZWhvbGRlclwiIGRpc2FibGVkPVwiZGlzYWJsZWRcIj5TZWxlY3QgYSBHZW5vdHlwZTwvb3B0aW9uPik7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1BbGxlbGVzOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gaTsgaiA8IG51bUFsbGVsZXM7IGorKykge1xuICAgICAgICAgIGxldCBrZXkgPSBpICsgXCIgXCIgKyBqLFxuICAgICAgICAgICAgICBzdHJpbmcgPSBhbGxlbGVOYW1lc1tpXSArIFwiIC8gXCIgKyBhbGxlbGVOYW1lc1tqXTtcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtrZXl9PntzdHJpbmd9PC9vcHRpb24+KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdC13cmFwcGVyXCI+XG4gICAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGN1cnJlbnRTZWxlY3Rpb24gfSBvbkNoYW5nZT17IG9uU2VsZWN0aW9uQ2hhbmdlIH0+XG4gICAgICAgICAgICB7IHBvc3NpYmxlQ29tYm9zIH1cbiAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH07XG5cbmNvbnN0IEdlbm9tZVRlc3RWaWV3ID0gKHtvcmcsIGhpZGRlbkFsbGVsZXM9W10sIHNlbGVjdGlvbj17fSwgc2VsZWN0aW9uQ2hhbmdlZH0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBhbGxlbGVzID0gY2hyb21bT2JqZWN0LmtleXMoY2hyb20pWzBdXS5hbGxlbGVzLFxuICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgICBnZW5lcyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUob3JnLnNwZWNpZXMsIGEpKSxcbiAgICAgICAgcHVsbGRvd25zID0gZ2VuZXMubWFwKGcgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8VGVzdFB1bGxkb3duVmlld1xuICAgICAgICAgICAgICBrZXkgICAgICAgPSB7IGcubmFtZSB9XG4gICAgICAgICAgICAgIHNwZWNpZXMgICA9IHsgb3JnLnNwZWNpZXMgfVxuICAgICAgICAgICAgICBnZW5lICAgICAgPSB7IGcgfVxuICAgICAgICAgICAgICBzZWxlY3Rpb24gPSB7IHNlbGVjdGlvbltnLm5hbWVdIH1cbiAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UgPSB7IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZChnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICB9IH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIiBrZXk9e2Nocm9tb3NvbWVOYW1lfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5vbWUtdGVzdC1vcHRpb25zXCI+XG4gICAgICAgICAgeyBwdWxsZG93bnMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lLXRlc3RcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblRlc3RQdWxsZG93blZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGdlbmU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgc2VsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBvblNlbGVjdGlvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuR2Vub21lVGVzdFZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBzZWxlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHNlbGVjdGlvbkNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVRlc3RWaWV3O1xuIiwiaW1wb3J0IENocm9tb3NvbWVWaWV3IGZyb20gJy4vY2hyb21vc29tZSc7XG5cbmNvbnN0IEdlbm9tZVZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcyA9IFtdLCBlZGl0YWJsZT10cnVlLCBhbGxlbGVDaGFuZ2VkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgcGFpcnMucHVzaChcbiAgICAgICAgPENocm9tb3NvbWVWaWV3XG4gICAgICAgICAgb3JnPXtvcmd9XG4gICAgICAgICAga2V5PXtwYWlycy5sZW5ndGggKyAxfVxuICAgICAgICAgIGNocm9tb3NvbWVOYW1lPXtjaHJvbW9zb21lTmFtZX1cbiAgICAgICAgICBzaWRlPXtzaWRlfVxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgbGFiZWxzT25SaWdodD17cGFpcnMubGVuZ3RoPjB9XG4gICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlfVxuICAgICAgICAgIGFsbGVsZUNoYW5nZWQ9e2Z1bmN0aW9uKHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChjaHJvbW9zb21lTmFtZSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICApO1xuICAgIH1cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLXBhaXJcIiBrZXk9e3BhaXJXcmFwcGVycy5sZW5ndGggKyAxfT5cbiAgICAgICAgeyBwYWlycyB9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbm9tZVwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2Vub21lVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIGFsbGVsZUNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVmlldztcbiIsImltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5cbmNvbnN0IEdsb3dCYWNrZ3JvdW5kVmlldyA9ICh7aWQsIGNvbG9yLCBzaXplLCBjb250YWluZXJTdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCBDaGlsZENvbXBvbmVudCwgY2hpbGRTdHlsZT17fSwgLi4ub3RoZXJzfSkgPT4ge1xuICBjb25zdCB0Q29udGFpbmVyU3R5bGUgPSB7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLCAuLi5jb250YWluZXJTdHlsZSB9LFxuICAgICAgICB0R2xvd1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uZ2xvd1N0eWxlIH0sXG4gICAgICAgIHRDaGlsZFN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uY2hpbGRTdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWVzPVwiZ2VuaWJsb2NrcyBnbG93LWJhY2tncm91bmRcIiBzdHlsZT17dENvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGlkPXtpZH0gY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17dEdsb3dTdHlsZX0vPlxuICAgICAgPENoaWxkQ29tcG9uZW50IGlkPXtpZH0gc3R5bGU9e3RDaGlsZFN0eWxlfSB3aWR0aD17c2l6ZX0gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdsb3dCYWNrZ3JvdW5kVmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGNvbnRhaW5lclN0eWxlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBnbG93U3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIENoaWxkQ29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgY2hpbGRTdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2xvd0JhY2tncm91bmRWaWV3O1xuIiwiaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBhcyBhbiBpbWFnZSBvbiB0b3Agb2YgYSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IG9yZyAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kIHZpZXcuXG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICovXG5jb25zdCBPcmdhbmlzbUdsb3dWaWV3ID0gKHtpZCwgY2xhc3NOYW1lLCBjb2xvciwgc2l6ZSwgc3R5bGU9e30sIC4uLm90aGVyfSkgPT4ge1xuICBjb25zdCBwcm9wQ2xhc3MgPSBjbGFzc05hbWUsXG4gICAgICAgIGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgZ2xvd1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJyB9LFxuICAgICAgICBvcmdTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLnN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmdhbmlzbS1nbG93ICR7cHJvcENsYXNzfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17YCR7aWR9LWdsb3dgfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtnbG93U3R5bGV9Lz5cbiAgICAgIDxPcmdhbmlzbVZpZXcgaWQ9e2Ake2lkfS1vcmdhbmlzbWB9IHdpZHRoPXtzaXplfSBzdHlsZT17b3JnU3R5bGV9IHsuLi5vdGhlcn0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtR2xvd1ZpZXc7XG4iLCJjb25zdCBPcmdhbmlzbVZpZXcgPSAoe29yZywgaWQsIHdpZHRoPTIwMCwgc3R5bGU9e30sIG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL2dlbml2ZXJzZS1yZXNvdXJjZXMuY29uY29yZC5vcmcvcmVzb3VyY2VzL2RyYWtlcy9pbWFnZXMvXCIsXG4gICAgICAgIHVybCAgICAgPSBiYXNlVXJsICsgb3JnLmdldEltYWdlTmFtZSgpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIG9yZ2FuaXNtXCIgaWQ9e2lkfSBzdHlsZT17c3R5bGV9IG9uTW91c2VEb3duPXtvbkNsaWNrfSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgIDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5kZXg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCBQZW5WaWV3IGZyb20gJy4vcGVuJztcbmltcG9ydCBTdGF0c1ZpZXcgZnJvbSAnLi9zdGF0cyc7XG5cbmNsYXNzIFBlblN0YXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcmdzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGxhc3RDbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRJbmRleDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHJlbmRlciA9ICgpID0+IHtcbiAgICBjb25zdCB7IG9yZ3MsIGxhc3RDbHV0Y2hTaXplLCBzZWxlY3RlZEluZGV4LCBvblNlbGVjdGlvbkNoYW5nZSwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGxhc3RDbHV0Y2ggPSBvcmdzLnNsaWNlKC1sYXN0Q2x1dGNoU2l6ZSk7XG5cbiAgICAvKiBnbG9iYWwgUmVhY3RTaW1wbGVUYWJzICovXG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWFjdFNpbXBsZVRhYnM+XG4gICAgICAgIDxSZWFjdFNpbXBsZVRhYnMuUGFuZWwgdGl0bGU9XCJCcmVlZGluZyBQZW5cIiBrZXk9XCJCcmVlZGluZyBQZW5cIj5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5QZW5WaWV3XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmdzPXtsYXN0Q2x1dGNofSB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleD17c2VsZWN0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldnQsIGlTZWxlY3RlZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvblNlbGVjdGlvbkNoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShpU2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L1JlYWN0U2ltcGxlVGFicy5QYW5lbD5cbiAgICAgICAgPFJlYWN0U2ltcGxlVGFicy5QYW5lbCB0aXRsZT1cIlN0YXRzXCIga2V5PVwiU3RhdHNcIj5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5TdGF0c1ZpZXcgb3Jncz17b3Jnc30gbGFzdENsdXRjaFNpemU9e2xhc3RDbHV0Y2hTaXplfSAvPlxuICAgICAgICA8L1JlYWN0U2ltcGxlVGFicy5QYW5lbD5cbiAgICAgIDwvUmVhY3RTaW1wbGVUYWJzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVuU3RhdHNWaWV3O1xuIiwiaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgUGVuVmlldyA9ICh7b3JncywgaWRQcmVmaXg9J29yZ2FuaXNtLScsIHdpZHRoPTQwMCwgY29sdW1ucz01LCBTZWxlY3RlZE9yZ2FuaXNtVmlldz1PcmdhbmlzbVZpZXcsIHNlbGVjdGVkSW5kZXgsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoZXZ0LmN1cnJlbnRUYXJnZXQuaWQuc3Vic3RyKGlkUHJlZml4Lmxlbmd0aCkpO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhldnQsIGluZGV4KTtcbiAgfVxuXG4gIGxldCBvcmdXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKChvcmcsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBpbmRleCA9PT0gc2VsZWN0ZWRJbmRleFxuICAgICAgICAgICAgICAgID8gPFNlbGVjdGVkT3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9XCIjRkZGRkFBXCIgc2l6ZT17b3JnV2lkdGh9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfS8+XG4gICAgICAgICAgICAgICAgOiA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD17b3JnV2lkdGh9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfS8+O1xuICAgICAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIFNlbGVjdGVkT3JnYW5pc21WaWV3OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgc2VsZWN0ZWRJbmRleDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBlblZpZXc7XG4iLCJpbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbkdsb3dWaWV3ID0gKHtnbG93Q29sb3IsIHNpemU9MjAwfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJ307XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvd1wiIHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBjb2xvcj17Z2xvd0NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17Z2xvd1N0eWxlfS8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvdyBxdWVzdGlvbi1tYXJrXCJcbiAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246IFwiYWJzb2x1dGVcIiwgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX19PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG4gIC8vIEhUTUwgdGV4dCBub2RlXG4gIC8vPGRpdiBzdHlsZT17dFN0eWxlfT57dGV4dH08L2Rpdj5cblxuICAvLyBTVkcgdGV4dCBub2RlXG4gIC8vPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAvLyAgPHRleHQgeD0nNTAnIHk9JzE3NScgZmlsbD0nIzBEMEQ4Qycgc3R5bGU9e3RTdHlsZX0+XG4gIC8vICAgIHt0ZXh0fVxuICAvLyAgPC90ZXh0PlxuICAvLzwvc3ZnPlxufTtcblxuUXVlc3Rpb25HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGdsb3dDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbkdsb3dWaWV3O1xuIiwiaW1wb3J0IE9yZ2FuaXNtR2xvd1ZpZXcgZnJvbSAnLi9vcmdhbmlzbS1nbG93JztcbmltcG9ydCBRdWVzdGlvbkdsb3dWaWV3IGZyb20gJy4vcXVlc3Rpb24tZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyA9ICh7aGlkZGVuLCBjb2xvciwgc2l6ZSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IG9yZ1ZpZXcgPSA8T3JnYW5pc21HbG93VmlldyBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHsuLi5vdGhlcn0gLz4sXG4gICAgICAgIHF1ZXN0aW9uVmlldyA9IDxRdWVzdGlvbkdsb3dWaWV3IGdsb3dDb2xvcj17Y29sb3J9IHdpZHRoPXtzaXplfSAvPixcbiAgICAgICAgZmluYWxWaWV3ID0gaGlkZGVuID8gcXVlc3Rpb25WaWV3IDogb3JnVmlldztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lcz1cImdlbmlibG9ja3MgcXVlc3Rpb24tb3JnYW5pc20tZ2xvd1wiPlxuICAgICAge2ZpbmFsVmlld31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblF1ZXN0aW9uT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGJyZWVkaW5nIHN0YXRpc3RpY3MgZm9yIGEgc2V0IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXNcbiAqIEBwYXJhbSB7T2JqZWN0W119IG9yZ3MgLSBhcnJheSBvZiBCaW9sb2dpY2Egb3JnYW5pc21zIGZvciB3aGljaCBzdGF0aXN0aWNzIGFyZSB0byBiZSBkaXNwbGF5ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmdzW10ucGhlbm90eXBlIC0gdGhlIHBoZW5vdHlwZSBvZiB0aGUgQmlvbG9naWNhIG9yZ2FuaXNtXG4gKiBAcGFyYW0ge251bWJlcn0gW2xhc3RDbHV0Y2hTaXplPW9yZ3MubGVuZ3RoXSAtIHRoZSBudW1iZXIgb2Ygb3JnYW5pc21zIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IHRoYXQgY29tcHJpc2UgdGhlIG1vc3QgcmVjZW50IGNsdXRjaFxuICovXG5jb25zdCBTdGF0c1ZpZXcgPSAoe29yZ3MsIGxhc3RDbHV0Y2hTaXplfSkgPT4ge1xuXG4gIGxldCB0cmFpdHMgPSBuZXcgTWFwLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGlmIG5vIHNpemUgc3BlY2lmaWVkLCBhc3N1bWUgdGhlcmUncyBvbmx5IG9uZSBjbHV0Y2hcbiAgaWYgKCFsYXN0Q2x1dGNoU2l6ZSkgbGFzdENsdXRjaFNpemUgPSBvcmdzLmxlbmd0aDtcblxuICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gIGZvciAoY29uc3QgW2luZGV4LCBvcmddIG9mIG9yZ3MuZW50cmllcygpKSB7XG4gICAgY29uc3QgY2x1dGNoS2V5ID0gJ2MnICsgb3JnLnNleDtcbiAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIE9iamVjdC5rZXlzKG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSkge1xuICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgIHRyYWl0VmFsdWVzID0gdHJhaXRzLmdldCh0cmFpdCkgfHwgbmV3IE1hcCxcbiAgICAgICAgICB2YWx1ZUNvdW50cyA9IHRyYWl0VmFsdWVzLmdldCh2YWx1ZSkgfHwgbmV3IE1hcDtcbiAgICAgIGlmICghdHJhaXRzLmhhcyh0cmFpdCkpIHRyYWl0cy5zZXQodHJhaXQsIHRyYWl0VmFsdWVzKTtcbiAgICAgIGlmICghdHJhaXRWYWx1ZXMuaGFzKHZhbHVlKSkgdHJhaXRWYWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUNvdW50cyk7XG4gICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICBpZiAoaW5kZXggPj0gb3Jncy5sZW5ndGggLSBsYXN0Q2x1dGNoU2l6ZSlcbiAgICAgICAgdmFsdWVDb3VudHMuc2V0KGNsdXRjaEtleSwgKHZhbHVlQ291bnRzLmdldChjbHV0Y2hLZXkpIHx8IDApICsgMSk7XG4gICAgICB2YWx1ZUNvdW50cy5zZXQob3JnLnNleCwgKHZhbHVlQ291bnRzLmdldChvcmcuc2V4KSB8fCAwKSArIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgY0ZlbWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjVG90YWwgPSBjTWFsZXMgKyBjRmVtYWxlcyxcbiAgICAgICAgICAgIGNQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiBjVG90YWwgLyBsYXN0Q2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiB0VG90YWwgLyBvcmdzLmxlbmd0aCk7XG4gICAgICByb3dzLnB1c2goeyB0cmFpdCwgdHJhaXROdW0sIHZhbHVlLCBjTWFsZXMsIGNGZW1hbGVzLCBjVG90YWwsIGNQY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TWFsZXMsIHRGZW1hbGVzLCB0VG90YWwsIHRQY3QgfSk7XG4gICAgfVxuICAgICsrIHRyYWl0TnVtO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgc3RhdHNcIj5cbiAgICAgIDx0YWJsZSBpZD1cInN0YXRzLXRhYmxlXCIgY2xhc3NOYW1lPXtvcmdzLmxlbmd0aCA+IDAgPyBcImhhcy1kYXRhXCIgOiBcIm5vLWRhdGFcIn0+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+VHJhaXQgVmFsdWU8L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+Q2x1dGNoPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+VG90YWw8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7XG4gICAgICAgICAgcm93cy5tYXAoZnVuY3Rpb24ocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyIGtleT17aW5kZXh9IGNsYXNzTmFtZT17cm93LnRyYWl0TnVtICYgMSA/IFwib2RkLXRyYWl0XCIgOiBcImV2ZW4tdHJhaXRcIn0+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImxhYmVsXCI+e3Jvdy52YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1BjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY0ZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY01hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50UGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50RmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50TWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblN0YXRzVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGxhc3RDbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0c1ZpZXc7XG4iLCIvKipcbiAqIENsYXNzIHByb3ZpZGluZyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgQmlvTG9naWNhIGdlbmV0aWNzIG9wZXJhdGlvbnMuXG4gKiBJbiBzb21lIGNhc2VzIHRoZXNlIGFyZSBhZGFwdGVkIGZyb20gY29ycmVzcG9uZGluZyBjb2RlIGluIEdlbml2ZXJzZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXRpY3NVdGlscyB7XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGFsbGVsZSBzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IG1hcHMgZ2VuZXMgdG8gYWxsZWxlcy5cbiAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBjb21wYXJpc29uIHB1cnBvc2VzLCBmb3IgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHJldHVybiB7b2JqZWN0fSAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3JuOiB7YTpcImhcIiwgYjpcImhcIn0sIGFybW9yOiB7YTpcImFcIiwgYjpcImFcIn0sIC4uLn0gdG8gdXNlIGFzIGRlZmF1bHRzXG4gICAqL1xuICBzdGF0aWMgYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKSB7XG4gICAgbGV0IGdlbmVNYXAgPSB7fSxcbiAgICAgICAgYWxsZWxlU3Vic3RyaW5ncyA9IGFsbGVsZVN0cmluZy5zcGxpdChcIixcIik7XG4gICAgZm9yIChjb25zdCBhbGxlbGVTdWJzdHIgb2YgYWxsZWxlU3Vic3RyaW5ncykge1xuICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTdWJzdHIuc3BsaXQoXCI6XCIpLFxuICAgICAgICAgICAgZ2VuZSA9IGdlbmV0aWNzLmdlbmVGb3JBbGxlbGUoYWxsZWxlKTtcbiAgICAgIGlmIChzaWRlICYmIGFsbGVsZSAmJiBnZW5lKSB7XG4gICAgICAgIGlmICghZ2VuZU1hcFtnZW5lXSkgZ2VuZU1hcFtnZW5lXSA9IHt9O1xuICAgICAgICBnZW5lTWFwW2dlbmVdW3NpZGVdID0gYWxsZWxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2VuZU1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBhbGxlbGUgc3RyaW5nIGFuZCBhIGdlbmUgbWFwIGRlZmluaW5nIGEgc2V0IG9mIGJhc2UgKGRlZmF1bHQpIGFsbGVsZXMsXG4gICAqIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyB3aXRoIG1pc3NpbmcgYWxsZWxlcyByZXBsYWNlZCBieSB0aGVpciBkZWZhdWx0cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge29iamVjdH0gYmFzZUdlbmVNYXAgLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybjoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCkge1xuICAgIGNvbnN0IGRzdEdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZyk7XG4gICAgbGV0ICAgZHN0QWxsZWxlU3RyaW5nID0gYWxsZWxlU3RyaW5nO1xuICAgIGZvciAoY29uc3QgZ2VuZSBpbiBkc3RHZW5lTWFwKSB7XG4gICAgICBjb25zdCBnZW5lVmFsdWUgPSBkc3RHZW5lTWFwW2dlbmVdO1xuICAgICAgaWYgKCFnZW5lVmFsdWUuYSAmJiBiYXNlR2VuZU1hcFtnZW5lXSAmJiBiYXNlR2VuZU1hcFtnZW5lXS5hKSB7XG4gICAgICAgIGRzdEFsbGVsZVN0cmluZyA9IGRzdEFsbGVsZVN0cmluZy5yZXBsYWNlKGBiOiR7Z2VuZVZhbHVlLmJ9YCwgYGE6JHtiYXNlR2VuZU1hcFtnZW5lXS5hfSwkJmApO1xuICAgICAgfVxuICAgICAgaWYgKCFnZW5lVmFsdWUuYiAmJiBiYXNlR2VuZU1hcFtnZW5lXSAmJiBiYXNlR2VuZU1hcFtnZW5lXS5iKSB7XG4gICAgICAgIGRzdEFsbGVsZVN0cmluZyA9IGRzdEFsbGVsZVN0cmluZy5yZXBsYWNlKGBhOiR7Z2VuZVZhbHVlLmF9YCwgYCQmLGI6JHtiYXNlR2VuZU1hcFtnZW5lXS5ifWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZHN0QWxsZWxlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHR3byBhbGxlbGUgc3RyaW5ncywgcmV0dXJucyBhIG5ldyBhbGxlbGUgc3RyaW5nIGluIHdoaWNoIG1pc3NpbmcgYWxsZWxlc1xuICAgKiBpbiB0aGUgZmlyc3QgYXJlIHJlcGxhY2VkIGJ5IGRlZmF1bHRzIHByb3ZpZGVkIGJ5IHRoZSBzZWNvbmQgYWxsZWxlIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZUFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIHVzZSBhcyBkZWZhdWx0c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gdXBkYXRlZCBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIlxuICAgKi9cbiAgc3RhdGljIGZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlQWxsZWxlU3RyaW5nKSB7XG4gICAgY29uc3QgYmFzZUdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGJhc2VBbGxlbGVTdHJpbmcpO1xuICAgIHJldHVybiBHZW5ldGljc1V0aWxzLmZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUdlbmVNYXAoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUdlbmVNYXApO1xuICB9XG5cbiAgc3RhdGljIG51bWJlck9mQnJlZWRpbmdNb3Zlc1RvUmVhY2hEcmFrZShvcmdhbmlzbTEsIG9yZ2FuaXNtMiwgY2hhbmdlYWJsZUFsbGVsZXMxLCBjaGFuZ2VhYmxlQWxsZWxlczIsIHRhcmdldE9yZ2FuaXNtKSB7XG4gICAgdmFyIG1vdmVzID0gMCxcbiAgICAgICAgb3JnMUFsbGVsZXMgPSBvcmdhbmlzbTEuZ2V0QWxsZWxlU3RyaW5nKCkuc3BsaXQoJywnKS5tYXAoYSA9PiBhLnNwbGl0KCc6JylbMV0pLFxuICAgICAgICBvcmcyQWxsZWxlcyA9IG9yZ2FuaXNtMi5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIHRhcmdldGNoYXJzID0gdGFyZ2V0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgdHJhaXRSdWxlcyA9IG9yZ2FuaXNtMS5zcGVjaWVzLnRyYWl0UnVsZXM7XG5cbiAgICBmb3IgKHZhciB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgdmFyIHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Y2hhcnNbdHJhaXRdXSxcbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IEluZmluaXR5O1xuICAgICAgICBpZiAocG9zc2libGVTb2x1dGlvbnMgJiYgcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoOyBpPGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb2x1dGlvbiA9IHBvc3NpYmxlU29sdXRpb25zW2ldLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24xID0gMCxcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamogPSBzb2x1dGlvbi5sZW5ndGg7IGo8amo7IGorKykge1xuICAgICAgICAgICAgICB2YXIgYWxsZWxlMSA9IHNvbHV0aW9uW2pdLFxuICAgICAgICAgICAgICAgICAgYWxsZWxlMiA9IGolMiA9PT0gMCA/IHNvbHV0aW9uW2orMV0gOiBzb2x1dGlvbltqLTFdLFxuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IDA7XG4gICAgICAgICAgICAgIGlmIChvcmcxQWxsZWxlcy5pbmRleE9mKGFsbGVsZTEpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxlbGUxICYmIChjaGFuZ2VhYmxlQWxsZWxlczEuaW5kZXhPZihhbGxlbGUxKSA+IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChvcmcyQWxsZWxlcy5pbmRleE9mKGFsbGVsZTIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxlbGUyICYmIChjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyKSA+IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMyLmluZGV4T2YoYWxsZWxlMi50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGolMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24xICs9IHNvbHV0aW9uTW92ZXM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjIgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gTWF0aC5taW4oc2hvcnRlc3RQYXRoLCBNYXRoLm1pbihtb3Zlc0ZvclNvbHV0aW9uMSwgbW92ZXNGb3JTb2x1dGlvbjIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZXMgKz0gc2hvcnRlc3RQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZXBhcmF0ZSBjaGFuZ2VzLCBpbmNsdWRpbmcgYWxsZWxlIGNoYW5nZXMgYW5kIHNleCBjaGFuZ2VzLFxuICAgKiByZXF1aXJlZCB0byBtYXRjaCB0aGUgcGhlbm90eXBlIG9mIHRoZSAndGVzdE9yZ2FuaXNtJyB0byB0aGF0IG9mIHRoZSAndGFyZ2V0T3JnYW5pc20nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGVzdE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIHRvIHdoaWNoIGNoYW5nZXMgd291bGQgYXBwbHlcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IHRhcmdldE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIHRoYXQgc2VydmVzIGFzIGRlc3RpbmF0aW9uXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSB0aGUgdG90YWwgbnVtYmVyIG9mIGNoYW5nZXMgcmVxdWlyZWQgZm9yIHRoZSBwaGVub3R5cGVzIHRvIG1hdGNoXG4gICAqL1xuICBzdGF0aWMgbnVtYmVyT2ZDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0T3JnYW5pc20sIHRhcmdldE9yZ2FuaXNtKSB7XG4gICAgbGV0IHJlcXVpcmVkQ2hhbmdlQ291bnQgPSBHZW5ldGljc1V0aWxzLm51bWJlck9mQWxsZWxlQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20uZ2VuZXRpY3MuZ2Vub3R5cGUuYWxsQWxsZWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20uc3BlY2llcy50cmFpdFJ1bGVzKTtcbiAgICBpZiAodGVzdE9yZ2FuaXNtLnNleCAhPT0gdGFyZ2V0T3JnYW5pc20uc2V4KVxuICAgICAgKytyZXF1aXJlZENoYW5nZUNvdW50O1xuXG4gICAgcmV0dXJuIHJlcXVpcmVkQ2hhbmdlQ291bnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGFsbGVsZSBjaGFuZ2VzIHJlcXVpcmVkIHRvIG1ha2UgdGhlIHBoZW5vdHlwZSBvZlxuICAgKiB0aGUgb3JnYW5pc20gY2hhcmFjdGVyaXplZCBieSAndGVzdENoYXJhY3RlcnN0aWNzJyBtYXRjaCB0aGF0IG9mIHRoZSBvcmdhbmlzbVxuICAgKiBjaGFyYWN0ZXJpemVkIGJ5ICd0YXJnZXRDaGFyYWN0ZXJpc3RpY3MnLiBBZGFwdGVkIGZyb206XG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvbmNvcmQtY29uc29ydGl1bS9HZW5pdmVyc2UtU3Byb3V0Q29yZS9ibG9iL21hc3Rlci9mcmFtZXdvcmtzL2dlbml2ZXJzZS9jb250cm9sbGVycy9tYXRjaC5qc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gdGVzdENoYXJhY3RlcmlzdGljcyAtIHRoZSBjaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldENoYXJhY3RlcmlzdGljcyAtIHRoZSBjaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHRhcmdldCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0ZXN0QWxsZWxlcyAtIHRoZSBhcnJheSBvZiBhbGxlbGVzIG9mIHRoZSB0ZXN0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0cmFpdFJ1bGVzIC0gdGhlIHRyYWl0UnVsZXMgb2YgdGhlIEJpb0xvZ2ljYS5TcGVjaWVzIG9mIHRoZSBvcmdhbmlzbXNcbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSBudW1iZXIgb2YgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgZm9yIHRoZSBwaGVub3R5cGVzIHRvIG1hdGNoXG4gICAqL1xuICBzdGF0aWMgbnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0Q2hhcmFjdGVyaXN0aWNzLCB0YXJnZXRDaGFyYWN0ZXJpc3RpY3MsIHRlc3RBbGxlbGVzLCB0cmFpdFJ1bGVzKSB7XG4gICAgY29uc3QgYWxsZWxlcyA9IHRlc3RBbGxlbGVzO1xuICAgIGxldCAgIG1vdmVzID0gMDtcblxuICAgIGZvciAoY29uc3QgdHJhaXQgaW4gdHJhaXRSdWxlcykge1xuICAgICAgaWYgKHRyYWl0UnVsZXMuaGFzT3duUHJvcGVydHkodHJhaXQpKSB7XG4gICAgICAgIGlmICh0ZXN0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSAhPT0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSkge1xuICAgICAgICAgIC8vIGZpcnN0IHdlIGhhdmUgdG8gd29yayBvdXQgd2hhdCBhbGxlbGVzIHRoZSBvcmlnaW5hbCBkcmFrZSBoYXMgdGhhdCBjb3JyZXNwb25kIHRvXG4gICAgICAgICAgLy8gdGhlaXIgbm9uLW1hdGNoaW5nIHRyYWl0XG4gICAgICAgICAgY29uc3QgcG9zc2libGVUcmFpdEFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmNvbGxlY3RBbGxBbGxlbGVzRm9yVHJhaXQodHJhaXQsIHRyYWl0UnVsZXMpO1xuICAgICAgICAgIGxldCAgIGNoYXJhY3RlcmlzdGljQWxsZWxlcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFsbGVsZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlVHJhaXRBbGxlbGVzLmluZGV4T2YoYWxsZWxlc1tpXSkgPj0gMCl7XG4gICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljQWxsZWxlcy5wdXNoKGFsbGVsZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBub3cgd29yayBvdXQgdGhlIHNtYWxsZXN0IG51bWJlciBvZiBzdGVwcyB0byBnZXQgZnJvbSB0aGVyZSB0byB0aGUgZGVzaXJlZCBjaGFyYWN0ZXJpc3RpY1xuICAgICAgICAgIGNvbnN0IHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XV07XG4gICAgICAgICAgbGV0ICAgc2hvcnRlc3RQYXRoTGVuZ3RoID0gSW5maW5pdHk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0uc2xpY2UoKSxcbiAgICAgICAgICAgICAgICBwYXRoTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IGNoYXJhY3RlcmlzdGljQWxsZWxlcy5sZW5ndGg7IGogPCBqajsgaisrKXtcbiAgICAgICAgICAgICAgaWYgKHNvbHV0aW9uLmluZGV4T2YoY2hhcmFjdGVyaXN0aWNBbGxlbGVzW2pdKSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGgrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb2x1dGlvbi5zcGxpY2Uoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pLCAxKTsgLy8gYWxyZWFkeSBtYXRjaGVkIHRoaXMgb25lLCBjYW4ndCBtYXRjaCBpdCBhZ2FpblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGhMZW5ndGggPSAocGF0aExlbmd0aCA8IHNob3J0ZXN0UGF0aExlbmd0aCkgPyBwYXRoTGVuZ3RoIDogc2hvcnRlc3RQYXRoTGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vdmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvZXMgdGhyb3VnaCB0aGUgdHJhaXRSdWxlcyB0byBmaW5kIG91dCB3aGF0IHVuaXF1ZSBhbGxlbGVzIGFyZSBhc3NvY2lhdGVkIHdpdGggZWFjaCB0cmFpdFxuICAgKiBlLmcuIEZvciBcInRhaWxcIiBpdCB3aWxsIHJldHVybiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdLiBBZGFwdGVkIGZyb206XG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvbmNvcmQtY29uc29ydGl1bS9HZW5pdmVyc2UtU3Byb3V0Q29yZS9ibG9iL21hc3Rlci9mcmFtZXdvcmtzL2dlbml2ZXJzZS9jb250cm9sbGVycy9tYXRjaC5qc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJhaXQgLSBuYW1lIG9mIHRyYWl0LCBlLmcuIFwidGFpbFwiXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0cmFpdFJ1bGVzIC0gdGhlIHRyYWl0UnVsZXMgb2YgdGhlIEJpb0xvZ2ljYS5TcGVjaWVzIHdob3NlIHRyYWl0cyBhcmUgb2YgaW50ZXJlc3RcbiAgICogQHJldHVybiB7c3RyaW5nW119IC0gYXJyYXkgb2YgYWxsZWxlIHN0cmluZ3MsIGUuZy4gW1wiVFwiLCBcIlRrXCIsIFwidFwiXVxuICAgKi9cbiAgc3RhdGljIF9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdCA9IHt9O1xuICBzdGF0aWMgY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcykge1xuICAgIGlmIChHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0pIHtcbiAgICAgIHJldHVybiBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF07XG4gICAgfVxuXG4gICAgbGV0IGFsbGVsZXNIYXNoID0ge30sXG4gICAgICAgIGFsbGVsZXMgICAgID0gW107XG4gICAgZm9yIChjb25zdCBjaGFyYWN0ZXJpc3RpYyBpbiB0cmFpdFJ1bGVzW3RyYWl0XSl7XG4gICAgICAgIGZvciAoY29uc3QgcG9zc2liaWxlQWxsZWxlc0NvbWJvIGluIHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXSkge1xuICAgICAgICAgIGlmICh0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY10uaGFzT3duUHJvcGVydHkocG9zc2liaWxlQWxsZWxlc0NvbWJvKSl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY11bcG9zc2liaWxlQWxsZWxlc0NvbWJvXS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgIGFsbGVsZXNIYXNoW3RyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dW2ldXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhbGxlbGUgaW4gYWxsZWxlc0hhc2gpe1xuICAgICAgYWxsZWxlcy5wdXNoKGFsbGVsZSk7XG4gICAgfVxuXG4gICAgR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdID0gYWxsZWxlczsgIC8vIHN0b3JlIHNvIHdlIGRvbid0IG5lZWQgdG8gcmVjYWxjdWxhdGUgaXRcbiAgICByZXR1cm4gYWxsZWxlcztcbiAgfVxufVxuIl19
