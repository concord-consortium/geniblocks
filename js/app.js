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
    ChromosomeImageView = require('./components/chromosome-image').default,
    ChromosomeView = require('./components/chromosome').default,
    FertilizingGameteView = require('./components/fertilizing-gamete').default,
    GametePoolView = require('./components/gamete-pool').default,
    GameteView = require('./components/gamete').default,
    GeneLabelView = require('./components/gene-label').default,
    GenomeTestView = require('./components/genome-test').default,
    GenomeView = require('./components/genome').default,
    OrganismView = require('./components/organism').default,
    PenView = require('./components/pen').default,
    StatsView = require('./components/stats').default;

exports.AlleleFiltersView = AlleleFiltersView;
exports.AlleleView = AlleleView;
exports.AnimatedGameteView = AnimatedGameteView;
exports.ChromosomeImageView = ChromosomeImageView;
exports.ChromosomeView = ChromosomeView;
exports.FertilizingGameteView = FertilizingGameteView;
exports.GametePoolView = GametePoolView;
exports.GameteView = GameteView;
exports.GeneLabelView = GeneLabelView;
exports.GenomeTestView = GenomeTestView;
exports.GenomeView = GenomeView;
exports.OrganismView = OrganismView;
exports.PenView = PenView;
exports.StatsView = StatsView;

},{"./components/allele":3,"./components/allele-filters":2,"./components/animated-gamete":4,"./components/chromosome":6,"./components/chromosome-image":5,"./components/fertilizing-gamete":7,"./components/gamete":9,"./components/gamete-pool":8,"./components/gene-label":10,"./components/genome":12,"./components/genome-test":11,"./components/organism":13,"./components/pen":14,"./components/stats":15}],2:[function(require,module,exports){
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

},{"./gamete":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./chromosome-image":5,"./gene-label":10}],7:[function(require,module,exports){
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

},{"./animated-gamete":4}],8:[function(require,module,exports){
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

},{"./animated-gamete":4}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./chromosome-image":5}],12:[function(require,module,exports){
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
        { key: pairWrappers.length + 1 },
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

},{"./chromosome":6}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$initialStyle = _ref.initialStyle;
  var initialStyle = _ref$initialStyle === undefined ? {} : _ref$initialStyle;
  var _ref$finalStyle = _ref.finalStyle;
  var finalStyle = _ref$finalStyle === undefined ? {} : _ref$finalStyle;
  var onRest = _ref.onRest;

  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url = baseUrl + org.getImageName(),
      initialOpacity = initialStyle && (initialStyle.opacity != null ? initialStyle.opacity : 1.0),
      finalOpacity = finalStyle && (finalStyle.opacity != null ? finalStyle.opacity : 1.0);

  /* eslint react/display-name:0 */
  return React.createElement(
    ReactMotion.Motion,
    { defaultStyle: { opacity: initialOpacity },
      style: { opacity: ReactMotion.spring(finalOpacity, { stiffness: 60 }) },
      onRest: onRest },
    function (interpolatedStyle) {
      return React.createElement(
        "div",
        { className: "geniblocks organism", style: interpolatedStyle },
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
  onRest: React.PropTypes.func
};

exports.default = OrganismView;

},{}],14:[function(require,module,exports){
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

},{"./organism":13}],15:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29kZS9hcHAuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUtcG9vbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUtdGVzdC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9zdGF0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNLQSxJQUNFLG9CQUFvQixRQUFRLDZCQUFSLEVBQXVDLE9BQXZDO0lBQ3BCLGFBQWEsUUFBUSxxQkFBUixFQUErQixPQUEvQjtJQUNiLHFCQUFxQixRQUFRLDhCQUFSLEVBQXdDLE9BQXhDO0lBQ3JCLHNCQUFzQixRQUFRLCtCQUFSLEVBQXlDLE9BQXpDO0lBQ3RCLGlCQUFpQixRQUFRLHlCQUFSLEVBQW1DLE9BQW5DO0lBQ2pCLHdCQUF3QixRQUFRLGlDQUFSLEVBQTJDLE9BQTNDO0lBQ3hCLGlCQUFpQixRQUFRLDBCQUFSLEVBQW9DLE9BQXBDO0lBQ2pCLGFBQWEsUUFBUSxxQkFBUixFQUErQixPQUEvQjtJQUNiLGdCQUFnQixRQUFRLHlCQUFSLEVBQW1DLE9BQW5DO0lBQ2hCLGlCQUFpQixRQUFRLDBCQUFSLEVBQW9DLE9BQXBDO0lBQ2pCLGFBQWEsUUFBUSxxQkFBUixFQUErQixPQUEvQjtJQUNiLGVBQWUsUUFBUSx1QkFBUixFQUFpQyxPQUFqQztJQUNmLFVBQVUsUUFBUSxrQkFBUixFQUE0QixPQUE1QjtJQUNWLFlBQVksUUFBUSxvQkFBUixFQUE4QixPQUE5Qjs7UUFHWjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOzs7Ozs7OztBQ25DRixJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsT0FBdUU7TUFBckUsdUJBQXFFO2dDQUE1RCxjQUE0RDtNQUE1RCxtREFBYyx3QkFBOEM7a0NBQTFDLGdCQUEwQztNQUExQyx1REFBa0IsMEJBQXdCO01BQXBCLHFDQUFvQjs7QUFDL0YsTUFBSSxjQUFjLElBQUksR0FBSixFQUFkO01BQ0EsYUFBYSxFQUFiLENBRjJGOzs7Ozs7O0FBSS9GLHlCQUFxQix1Q0FBckIsb0dBQW9DO1VBQXpCLHFCQUF5Qjs7QUFDbEMsVUFBTSxPQUFPLFVBQVUsUUFBVixDQUFtQixlQUFuQixDQUFtQyxPQUFuQyxFQUE0QyxNQUE1QyxDQUFQLENBRDRCO0FBRWxDLFVBQUksSUFBSixFQUNFLFlBQVksR0FBWixDQUFnQixLQUFLLElBQUwsQ0FBaEIsQ0FERjtLQUZGOzs7Ozs7Ozs7Ozs7OztHQUorRjs7QUFVL0YsT0FBSyxJQUFNLElBQU4sSUFBYyxRQUFRLFFBQVIsRUFBa0I7QUFDbkMsUUFBSSxDQUFDLFlBQVksR0FBWixDQUFnQixJQUFoQixDQUFELEVBQXdCO0FBQzFCLFVBQU0sVUFBVSxRQUFRLFFBQVIsQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkI7VUFDVixjQUFjLFFBQVEsR0FBUixDQUFZLGtCQUFVO0FBQ2xDLFlBQU0sT0FBTyxRQUFRLGNBQVIsQ0FBdUIsTUFBdkIsQ0FBUDtZQUNBLFVBQVUsRUFBRSxnQkFBZ0IsT0FBaEIsQ0FBd0IsTUFBeEIsS0FBbUMsQ0FBbkMsQ0FBRixDQUZrQjtBQUdsQyxlQUNFOztZQUFPLEtBQUssSUFBTCxFQUFQO1VBQ0UsK0JBQU8sTUFBSyxVQUFMLEVBQWdCLEtBQUssSUFBTCxFQUFXLE9BQU8sTUFBUDtBQUMxQixtQkFBTyxFQUFFLGNBQWMsS0FBZCxFQUFUO0FBQ0EsNEJBQWdCLE9BQWhCLEVBQXlCLFVBQVUsWUFBVixFQUZqQyxDQURGO1VBSUcsSUFKSDtTQURGLENBSGtDO09BQVYsQ0FBMUIsQ0FGb0I7QUFjMUIsaUJBQVcsSUFBWCxDQUNFOztVQUFLLFdBQVUsa0JBQVYsRUFBNkIsS0FBSyxJQUFMLEVBQWxDO1FBQThDLFdBQTlDO09BREYsRUFkMEI7S0FBNUI7R0FERjs7QUFxQkEsV0FBUyxZQUFULENBQXNCLEdBQXRCLEVBQTJCO0FBQ3pCLFFBQU0sTUFBTSxJQUFJLE1BQUo7UUFDTixTQUFTLE9BQU8sSUFBSSxLQUFKO1FBQ2hCLFlBQVksT0FBTyxJQUFJLE9BQUosQ0FIQTtBQUl6QixRQUFJLGtCQUFrQixNQUFsQixFQUNGLGVBQWUsR0FBZixFQUFvQixNQUFwQixFQUE0QixTQUE1QixFQURGO0dBSkY7O0FBUUEsU0FDRTs7TUFBSyxXQUFVLDJCQUFWO0FBQ0MsYUFBTyxFQUFFLGFBQWEsS0FBYixFQUFvQixnQkFBZ0IsS0FBaEIsRUFBN0IsRUFETjtJQUVJLFVBRko7R0FERixDQXZDK0Y7Q0FBdkU7O0FBK0MxQixrQkFBa0IsU0FBbEIsR0FBOEI7QUFDNUIsV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDVCxpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBd0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXZDO0FBQ0EsbUJBQWlCLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBekM7QUFDQSxrQkFBZ0IsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0NBSmxCOztrQkFPZTs7Ozs7Ozs7QUN0RGYsSUFBTSxhQUFhLFNBQWIsVUFBYSxPQUE4QztNQUE1QyxxQkFBNEM7TUFBcEMscUJBQW9DO01BQTVCLG1CQUE0QjtNQUFyQixtQkFBcUI7TUFBZCx5QkFBYzs7QUFDL0QsTUFBSSxRQUFNLEVBQU47TUFDQSxTQUFTLFFBQU0sQ0FBTjtNQUNULFNBQVMsU0FBUyxTQUFULEdBQXFCLE1BQXJCO01BQ1QsT0FBTyxTQUFTLEtBQVQsR0FBaUIsT0FBakI7TUFDUCxjQUFjLFdBQVcsQ0FBWCxHQUFlLENBQWY7TUFDZCxrQkFBaUIsU0FBUyxHQUFULEdBQWUsR0FBZjtNQUNqQixXQUFXLElBQVgsQ0FQMkQ7O0FBUy9ELE1BQUksVUFBVSxRQUFWLEVBQW9CO0FBQ3RCLGVBQVcsZ0NBQVEsR0FBRyxNQUFILEVBQVcsSUFBSSxTQUFPLENBQVAsRUFBVSxJQUFJLFNBQU8sQ0FBUCxFQUFVLGFBQWEsV0FBYixFQUEwQixRQUFRLE1BQVIsRUFBZ0IsaUJBQWlCLGVBQWpCLEVBQWtDLE1BQU0sSUFBTixFQUEzSCxDQUFYLENBRHNCO0dBQXhCLE1BRU87QUFDTCxlQUFXLDhCQUFNLE9BQVEsU0FBTyxDQUFQLEVBQVcsUUFBUyxTQUFPLENBQVAsRUFBVyxHQUFFLEdBQUYsRUFBTSxHQUFFLEdBQUYsRUFBTSxhQUFhLFdBQWIsRUFBMEIsUUFBUSxNQUFSLEVBQWdCLGlCQUFpQixlQUFqQixFQUFrQyxNQUFNLElBQU4sRUFBckksQ0FBWCxDQURLO0dBRlA7O0FBT0EsU0FDRTs7TUFBSyxPQUFPLFFBQU0sQ0FBTixFQUFTLFFBQVEsUUFBTSxDQUFOLEVBQVMsT0FBTSw0QkFBTixFQUF0QztJQUNFOzs7TUFDSSxRQURKO01BRUU7O1VBQU0sR0FBRyxTQUFPLENBQVAsRUFBVSxHQUFHLFNBQU8sQ0FBUCxFQUFVLFlBQVcsUUFBWCxFQUFvQixNQUFLLE9BQUwsRUFBcEQ7UUFBa0UsTUFBbEU7T0FGRjtLQURGO0dBREYsQ0FoQitEO0NBQTlDOztrQkEwQko7Ozs7Ozs7Ozs7Ozs7OztBQ0lmLElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixPQUFxSTtNQUFuSSxxQkFBbUk7TUFBM0gsYUFBMkg7Z0NBQXZILGNBQXVIO01BQXZILG1EQUFjLHdCQUF5RztNQUFyRyxxQ0FBcUc7TUFBckYsdUJBQXFGO2dDQUE1RSxjQUE0RTtNQUE1RSxtREFBYyx5QkFBOEQ7NkJBQXpELFdBQXlEO01BQXpELDZDQUFXLHdCQUE4Qzs2QkFBdkMsV0FBdUM7TUFBdkMsNkNBQVcsd0JBQTRCO01BQXJCLHVCQUFxQjtNQUFaLHFCQUFZOzs7QUFFOUosTUFBTSxRQUFRLEtBQUssQ0FBTDtNQUNSLG1CQUFtQixRQUFRLEVBQVI7TUFDbkIsVUFBVSxrQkFBa0IsT0FBbEI7TUFDVixjQUFjLFFBQVEsSUFBUixJQUFnQixFQUFoQjtNQUNkLGtCQUFrQixRQUFRLFFBQVIsSUFBb0IsSUFBcEIsR0FBMkIsUUFBUSxRQUFSLEdBQW1CLGdCQUE5QztNQUNsQixpQkFBaUIsUUFBUSxPQUFSLElBQW1CLElBQW5CLEdBQTBCLFFBQVEsT0FBUixHQUFrQixHQUE1QztNQUNqQixZQUFZLFFBQVEsSUFBUixJQUFnQixFQUFoQjtNQUNaLGdCQUFnQixRQUFRLFFBQVIsSUFBb0IsSUFBcEIsR0FBMkIsUUFBUSxRQUFSLEdBQW1CLGdCQUE5QztNQUNoQixlQUFlLFFBQVEsT0FBUixJQUFtQixJQUFuQixHQUEwQixRQUFRLE9BQVIsR0FBa0IsR0FBNUM7TUFDZixlQUFlLEVBQUUsV0FBVyxhQUFYLEVBQWpCOztBQVh3SixTQWM1SjtBQUFDLGdCQUFZLE1BQWI7TUFBb0IsY0FBYztBQUNaLFdBQUcsUUFBUSxDQUFSLEVBQVcsR0FBRyxRQUFRLENBQVIsRUFBVyxNQUFNLFdBQU47QUFDNUIsa0JBQVUsZUFBVixFQUEyQixTQUFTLGNBQVQ7T0FGN0I7QUFJQSxhQUFPO0FBQ0wsV0FBRyxZQUFZLE1BQVosQ0FBbUIsUUFBUSxDQUFSLEVBQVcsWUFBOUIsQ0FBSDtBQUNBLFdBQUcsWUFBWSxNQUFaLENBQW1CLFFBQVEsQ0FBUixFQUFXLFlBQTlCLENBQUg7QUFDQSxjQUFNLFlBQVksTUFBWixDQUFtQixTQUFuQixFQUE4QixZQUE5QixDQUFOO0FBQ0Esa0JBQVUsWUFBWSxNQUFaLENBQW1CLGFBQW5CLEVBQWtDLFlBQWxDLENBQVY7QUFDQSxpQkFBUyxZQUFZLE1BQVosQ0FBbUIsWUFBbkIsRUFBaUMsWUFBakMsQ0FBVDtPQUxGO0FBT0EsY0FBUSxNQUFSLEVBWHBCO0lBYUk7YUFDRSx3Q0FBWSxRQUFRLE1BQVIsRUFBZ0IsSUFBSSxFQUFKLEVBQVEsZUFBZSxhQUFmO0FBQ3hCLGlCQUFTLGlCQUFUO0FBQ0Esb0JBQVksVUFBWixFQUF3QixZQUFZLFVBQVosRUFBd0IsU0FBUyxPQUFULEVBRjVEO0tBREY7R0FkTixDQWI4SjtDQUFySTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0MzQixtQkFBbUIsU0FBbkIsR0FBK0I7QUFDN0IsVUFBUSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUixNQUFJLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNKLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSxrQkFBZ0IsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCO0FBQ3BDLE9BQUcsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ0gsT0FBRyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDSCxVQUFNLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNOLGNBQVUsTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ1YsYUFBUyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFMMkIsR0FBdEIsQ0FBaEI7QUFPQSxXQUFTLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQjtBQUM3QixPQUFHLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNILE9BQUcsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ0gsVUFBTSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDTixjQUFVLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNWLGFBQVMsTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBTG9CLEdBQXRCLEVBTU4sVUFOTTtBQU9ULGlCQUFlLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNmLGNBQVksTUFBTSxTQUFOLENBQWdCLElBQWhCO0FBQ1osY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEI7QUFDWixXQUFTLE1BQU0sU0FBTixDQUFnQixJQUFoQjtBQUNULFVBQVEsTUFBTSxTQUFOLENBQWdCLElBQWhCO0NBdEJWOztrQkF5QmU7Ozs7Ozs7O0FDM0ZmLElBQU0sc0JBQXNCLFNBQXRCLG1CQUFzQixHQUFNO0FBQ2hDLE1BQUksUUFBTSxFQUFOO01BQ0EsU0FBTyxHQUFQO01BQ0EsUUFBTSxFQUFOO01BQ0EsU0FBUyxRQUFNLENBQU47TUFDVCxhQUFhLFFBQU0sQ0FBTjtNQUNiLGlCQUFpQixhQUFXLENBQVg7TUFDakIsY0FBYyxTQUFPLENBQVA7TUFDZCxRQUFRLFNBQVIsQ0FSNEI7O0FBVWhDLFNBQ0U7O01BQUssT0FBTyxVQUFQLEVBQW1CLFFBQVEsV0FBUixFQUFxQixPQUFNLDRCQUFOLEVBQTdDO0lBQ0U7OztNQUNFLGdDQUFRLEdBQUcsTUFBSCxFQUFXLElBQUksU0FBTyxDQUFQLEVBQVUsSUFBSSxjQUFKLEVBQW9CLGFBQVksR0FBWixFQUFnQixRQUFPLFNBQVAsRUFBaUIsTUFBTSxLQUFOLEVBQXRGLENBREY7TUFFRSxnQ0FBUSxHQUFHLE1BQUgsRUFBVyxJQUFJLFFBQU0sTUFBTixFQUFjLElBQUksY0FBSixFQUFvQixhQUFZLEdBQVosRUFBZ0IsUUFBTyxTQUFQLEVBQWlCLE1BQU0sS0FBTixFQUExRixDQUZGO01BR0UsZ0NBQVEsR0FBRyxNQUFILEVBQVcsSUFBSSxRQUFNLE1BQU4sRUFBYyxJQUFJLGNBQUosRUFBb0IsYUFBWSxHQUFaLEVBQWdCLFFBQU8sU0FBUCxFQUFpQixNQUFNLEtBQU4sRUFBMUYsQ0FIRjtNQUlFLGdDQUFRLEdBQUcsTUFBSCxFQUFXLElBQUksU0FBTyxNQUFQLEVBQWUsSUFBSSxjQUFKLEVBQW9CLGFBQVksR0FBWixFQUFnQixRQUFPLFNBQVAsRUFBaUIsTUFBTSxLQUFOLEVBQTNGLENBSkY7TUFLRSw4QkFBTSxRQUFRLEtBQUMsR0FBTSxNQUFOLElBQWUsU0FBTyxDQUFQLENBQWhCLEVBQTJCLE9BQU8sS0FBUCxFQUFjLEdBQUcsU0FBTyxDQUFQLEVBQVUsR0FBRSxHQUFGLEVBQU0sYUFBWSxHQUFaLEVBQWdCLFFBQU8sU0FBUCxFQUFpQixNQUFNLEtBQU4sRUFBM0csQ0FMRjtNQU1FLDhCQUFNLFFBQVEsTUFBQyxHQUFPLE1BQVAsSUFBZ0IsUUFBTSxNQUFOLENBQWpCLEVBQWdDLE9BQU8sS0FBUCxFQUFjLEdBQUcsUUFBTSxNQUFOLEVBQWMsR0FBRSxHQUFGLEVBQU0sYUFBWSxHQUFaLEVBQWdCLFFBQU8sU0FBUCxFQUFpQixNQUFNLEtBQU4sRUFBcEgsQ0FORjtNQU9FLDhCQUFNLElBQUksU0FBTyxDQUFQLEVBQWMsSUFBRyxHQUFILEVBQWEsSUFBSSxRQUFNLE1BQU4sR0FBYSxDQUFiLEVBQWlCLElBQUcsR0FBSCxFQUFhLGVBQWMsTUFBZCxFQUFxQixnQkFBZSxNQUFmLEVBQXNCLGFBQVksR0FBWixFQUFnQixRQUFPLFNBQVAsRUFBaUIsTUFBSyxNQUFMLEVBQW5KLENBUEY7TUFRRSw4QkFBTSxJQUFJLFNBQU8sQ0FBUCxFQUFjLElBQUksUUFBTSxDQUFOLEVBQVMsSUFBSSxRQUFNLE1BQU4sR0FBYSxDQUFiLEVBQWlCLElBQUksUUFBTSxDQUFOLEVBQVMsZUFBYyxNQUFkLEVBQXFCLGdCQUFlLE1BQWYsRUFBc0IsYUFBWSxHQUFaLEVBQWdCLFFBQU8sU0FBUCxFQUFpQixNQUFLLE1BQUwsRUFBbkosQ0FSRjtNQVNFLDhCQUFNLElBQUksUUFBTSxNQUFOLEVBQWMsSUFBRyxHQUFILEVBQWEsSUFBSSxTQUFPLE1BQVAsRUFBaUIsSUFBRyxHQUFILEVBQWEsZUFBYyxNQUFkLEVBQXFCLGdCQUFlLE1BQWYsRUFBc0IsYUFBWSxHQUFaLEVBQWdCLFFBQU8sU0FBUCxFQUFpQixNQUFLLE1BQUwsRUFBbkosQ0FURjtNQVVFLDhCQUFNLElBQUksUUFBTSxNQUFOLEVBQWMsSUFBSSxRQUFNLENBQU4sRUFBUyxJQUFJLFNBQU8sTUFBUCxFQUFpQixJQUFJLFFBQU0sQ0FBTixFQUFTLGVBQWMsTUFBZCxFQUFxQixnQkFBZSxNQUFmLEVBQXNCLGFBQVksR0FBWixFQUFnQixRQUFPLFNBQVAsRUFBaUIsTUFBSyxNQUFMLEVBQW5KLENBVkY7S0FERjtHQURGLENBVmdDO0NBQU47O2tCQTRCYjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCZixJQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFTLE9BQVQsRUFBa0IsYUFBbEIsRUFBaUMsT0FBakMsRUFBMEM7QUFDOUQsTUFBSSxjQUFjLGNBQWMsR0FBZCxDQUFtQjtXQUFLLFVBQVUsUUFBVixDQUFtQixlQUFuQixDQUFtQyxPQUFuQyxFQUE0QyxDQUE1QztHQUFMLENBQWpDLENBRDBEO0FBRTlELFNBQU8sUUFBUSxNQUFSLENBQWdCLGFBQUs7QUFDMUIsUUFBSSxPQUFPLFVBQVUsUUFBVixDQUFtQixlQUFuQixDQUFtQyxPQUFuQyxFQUE0QyxDQUE1QyxDQUFQLENBRHNCO0FBRTFCLFdBQU8sWUFBWSxPQUFaLENBQW9CLElBQXBCLE1BQThCLENBQUMsQ0FBRCxDQUZYO0dBQUwsQ0FBdkIsQ0FGOEQ7Q0FBMUM7O0FBUXRCLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLE9BQXNGO01BQXBGLGVBQW9GO01BQS9FLHFDQUErRTtNQUEvRCxpQkFBK0Q7Z0NBQXpELGNBQXlEO01BQXpELG1EQUFjLHdCQUEyQztNQUF2QyxtQ0FBdUM7Z0NBQXhCLGNBQXdCO01BQXhCLG1EQUFjLDBCQUFVOztBQUMzRyxNQUFJLFVBQVUsSUFBSSxXQUFKLEdBQWtCLFdBQWxCLENBQThCLGNBQTlCLEVBQThDLElBQTlDLEVBQW9ELE9BQXBEO01BQ1YsaUJBQWlCLGNBQWMsT0FBZCxFQUF1QixhQUF2QixFQUFzQyxJQUFJLE9BQUosQ0FBdkQ7TUFDQSxTQUFVLGVBQWUsR0FBZixDQUFtQixhQUFLO0FBQ2hDLFdBQ0UsMkNBQWUsS0FBSyxDQUFMLEVBQVEsU0FBUyxJQUFJLE9BQUosRUFBYSxRQUFRLENBQVIsRUFBVyxVQUFVLElBQVY7QUFDeEQsc0JBQWdCLHdCQUFTLEtBQVQsRUFBZ0I7QUFDOUIsc0JBQWMsQ0FBZCxFQUFpQixNQUFNLE1BQU4sQ0FBYSxLQUFiLENBQWpCLENBRDhCO09BQWhCLEVBRGhCLENBREYsQ0FEZ0M7R0FBTCxDQUE3QjtNQVNBLGlCQUFpQixPQUFqQixDQVp1Rzs7QUFjM0csTUFBSSxDQUFDLGFBQUQsRUFBZ0I7QUFDbEIsc0JBQWtCLE1BQWxCLENBRGtCO0dBQXBCOztBQUlBLFNBQ0U7O01BQUssV0FBVSxpQ0FBVixFQUFMO0lBQ0U7O1FBQUssV0FBWSxjQUFaLEVBQUw7TUFDRSxvREFERjtNQUVFOztVQUFLLFdBQVUsUUFBVixFQUFMO1FBQ0ksTUFESjtPQUZGO0tBREY7R0FERixDQWxCMkc7Q0FBdEY7O0FBOEJ2QixlQUFlLFNBQWYsR0FBMkI7QUFDekIsT0FBSyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDTCxrQkFBZ0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ2hCLFFBQU0sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ04saUJBQWUsTUFBTSxTQUFOLENBQWdCLEtBQWhCO0FBQ2YsaUJBQWUsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0FBQ2YsaUJBQWUsTUFBTSxTQUFOLENBQWdCLElBQWhCO0NBTmpCOztrQkFTZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hEZixJQUFNLHNCQUFzQixFQUF0QjtJQUNBLG9CQUFvQixHQUFwQjtJQUNBLDBCQUEwQixDQUExQjtJQUNBLDBCQUEwQixHQUExQjtJQUNBLDhCQUE4QixFQUE5QjtJQUNBLDhCQUE4QixFQUE5QjtJQUNBLGlCQUFpQixDQUFDLEdBQUQ7O0FBRWhCLElBQU0sb0NBQWMsRUFBRSxRQUFRLFFBQVIsRUFBa0IsUUFBUSxRQUFSLEVBQWxDOztJQUVROzs7QUE2Qm5CLFdBN0JtQixxQkE2Qm5CLENBQVksS0FBWixFQUFtQjswQkE3QkEsdUJBNkJBOzt1RUE3QkEsa0NBOEJYLFFBRFc7O1VBSW5CLFNBQVMsWUFBTTt3QkFDNEMsTUFBSyxLQUFMLENBRDVDO1VBQ1IsNEJBRFE7VUFDQSxvQkFEQTtVQUNJLDBDQURKO1VBQ21CLDBDQURuQjtBQUNULFVBQTJDLDJCQUEzQyxDQURTO0FBRVQsb0JBQVUsTUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixNQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLElBQW5CLEdBQTBCLE1BQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsSUFBbkIsR0FBMEIsQ0FBekUsQ0FGRDtBQUdULG9CQUFVLE1BQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsTUFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixHQUFuQixHQUF5QixNQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQW5CLEdBQXlCLENBQXZFLENBSEQ7QUFJVCxxQkFBVyxNQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLFlBQVksTUFBWixHQUFxQix1QkFBekMsR0FDeUMsdUJBRHpDLENBSkY7QUFNVCx5QkFBZSxNQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLFlBQVksTUFBWixHQUFxQiwyQkFBekMsR0FDeUMsMkJBRHpDLENBTk47QUFRVCw4QkFSUyxJQVFBLGtCQVJBOztBQVViLFVBQUksQ0FBQyxNQUFELElBQVcsQ0FBQyxFQUFELEVBQUssT0FBcEI7O0FBRUEsVUFBSSxNQUFLLEtBQUwsQ0FBVyxrQkFBWCxLQUFrQyxNQUFsQyxFQUEwQztBQUM1QyxZQUFJLE1BQUssS0FBTCxDQUFXLElBQVgsS0FBb0IsWUFBWSxNQUFaLEVBQ3RCLFdBQVcsdUJBQVgsQ0FERjtBQUVBLGtCQUFVLEVBQUUsR0FBRyxPQUFILEVBQVksR0FBRyxPQUFILEVBQVksTUFBTSxtQkFBTixFQUFwQyxDQUg0QztBQUk1QyxnQkFBUSxFQUFFLEdBQUcsUUFBSCxFQUFhLEdBQUcsQ0FBSCxFQUFNLE1BQU0saUJBQU4sRUFBN0IsQ0FKNEM7T0FBOUMsTUFNSyxJQUFJLE1BQUssS0FBTCxDQUFXLGtCQUFYLEtBQWtDLGFBQWxDLEVBQWlEO0FBQ3hELGtCQUFVLEVBQUUsR0FBRyxRQUFILEVBQWEsR0FBRyxDQUFILEVBQU0sTUFBTSxpQkFBTixFQUF5QixTQUFTLEdBQVQsRUFBeEQsQ0FEd0Q7QUFFeEQsZ0JBQVEsRUFBRSxHQUFHLFlBQUgsRUFBaUIsR0FBRyxDQUFILEVBQU0sTUFBTSxpQkFBTixFQUF5QixVQUFVLENBQVYsRUFBYSxTQUFTLEdBQVQsRUFBdkUsQ0FGd0Q7T0FBckQsTUFJQTtBQUNILGtCQUFVLEVBQUUsR0FBRyxZQUFILEVBQWlCLEdBQUcsQ0FBSCxFQUFNLE1BQU0saUJBQU4sRUFBeUIsVUFBVSxDQUFWLEVBQWEsU0FBUyxHQUFULEVBQXpFLENBREc7QUFFSCxnQkFBUSxFQUFFLEdBQUcsWUFBSCxFQUFpQixHQUFHLGNBQUgsRUFBbUIsTUFBTSxpQkFBTixFQUF5QixVQUFVLENBQVYsRUFBYSxTQUFTLEdBQVQsRUFBcEYsQ0FGRztPQUpBOztBQVNMLGFBQ0UsZ0RBQW9CLFFBQVEsTUFBUixFQUFnQixJQUFJLEVBQUosRUFBUSxlQUFlLGFBQWY7QUFDeEIsd0JBQWdCLE9BQWhCLEVBQXlCLFNBQVMsS0FBVDtBQUN6Qix1QkFBZSxhQUFmLEVBQThCLFFBQVEsTUFBUixFQUZsRCxDQURGLENBM0JhO0tBQU4sQ0FKVTs7O0dBQW5COztTQTdCbUI7RUFBOEIsTUFBTSxTQUFOOztBQUE5QixzQkFFWixZQUFZO0FBQ2pCLFFBQU0sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLENBQUUsWUFBWSxNQUFaLEVBQW9CLFlBQVksTUFBWixDQUE1QyxFQUFrRSxVQUFsRTtBQUNOLFVBQVEsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ1IsTUFBSSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDSixzQkFBb0IsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLENBQUMsTUFBRCxFQUFTLGFBQVQsRUFBd0IsWUFBeEIsRUFBc0MsVUFBdEMsQ0FBdEIsRUFBeUUsVUFBekU7QUFDcEIsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF2QztBQUNBLFdBQVMsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCO0FBQzdCLFVBQU0sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ04sU0FBSyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDTCxXQUFPLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNQLFlBQVEsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0dBSkQsQ0FBVDtBQU1BLFdBQVMsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCO0FBQzdCLFVBQU0sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ04sU0FBSyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDTCxXQUFPLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNQLFlBQVEsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0dBSkQsQ0FBVDtBQU1BLGlCQUFlLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNmLFVBQVEsTUFBTSxTQUFOLENBQWdCLElBQWhCOztBQXJCUyxzQkF3QlosZUFBZTtBQUNwQixpQkFBZSxFQUFmO0FBQ0EsaUJBQWUsR0FBZjs7a0JBMUJpQjs7Ozs7Ozs7Ozs7Ozs7O0FDVnJCLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLE9BQTBIO01BQXhILHVCQUF3SDtnQ0FBL0csY0FBK0c7TUFBL0csbURBQWMsd0JBQWlHO3dCQUE3RixNQUE2RjtNQUE3RixtQ0FBTSxpQkFBdUY7eUJBQWxGLE9BQWtGO01BQWxGLHFDQUFPLGtCQUEyRTtnQ0FBdEUsY0FBc0U7TUFBdEUsbURBQWMsd0JBQXdEO01BQXBELDZCQUFvRDtNQUF4Qyx5Q0FBd0M7TUFBdEIseUNBQXNCOztBQUMvSSxNQUFJLGNBQWMsUUFBUSxNQUFSO01BQ2QsYUFBYSxFQUFiO01BQ0EsU0FBUyxDQUFUO01BQ0EsaUJBQWlCLGFBQWEsSUFBSSxNQUFKO01BQzlCLFdBQVcsY0FBWDtNQUNBLFdBQVcsY0FBWDtNQUNBLGFBQWEsS0FBSyxLQUFMLENBQVcsUUFBUSxjQUFSLENBQXhCO01BQ0EsYUFBYSxLQUFLLEtBQUwsQ0FBVyxTQUFTLGNBQVQsQ0FBeEI7TUFDQSxlQUFlLENBQWY7TUFDQSxnQkFBZ0IsQ0FBaEI7TUFDQSxnQkFBZ0IsUUFBUSxHQUFSLENBQVk7V0FBSyxpQkFBaUIsQ0FBakI7R0FBTCxDQUE1QjtNQUNBLHFCQUFxQixjQUFjLE1BQWQsQ0FBcUIsVUFBQyxLQUFELEVBQU8sSUFBUDtXQUFnQixRQUFRLElBQVI7R0FBaEIsRUFBOEIsQ0FBbkQsQ0FBckI7OztBQUVBLG9CQUFrQixVQUFVLHFCQUFxQixjQUFyQixHQUFzQyxDQUF0QyxDQUFWLEdBQXFELElBQUksTUFBSjs7O0FBRXZFLHFCQUFtQixLQUFLLEdBQUwsQ0FBUyxXQUFXLENBQVgsRUFDQSxDQUFDLFFBQVEsSUFBSSxNQUFKLENBQVQsR0FBdUIsa0JBQXZCLENBRDVCO01BRUEsbUJBQW1CLGNBQW5CO01BQ0Esb0JBQW9CLGNBQWMsa0JBQWQ7TUFDcEIsdUJBbkJKOzs7QUFEK0ksTUF1QjNJLFdBQVcsVUFBWDtNQUNBLFdBQVcsY0FBYyxxQkFBcUIsQ0FBckIsQ0FBZCxDQXhCZ0k7QUF5Qi9JLFNBQU8sV0FBVyxRQUFYLEdBQXNCLGlCQUF0QixFQUF5QztBQUM5QyxRQUFJLFdBQVcsUUFBWCxFQUFxQjtBQUN2QixpQkFBVyxrQkFBa0IsRUFBRSxRQUFGLENBRE47S0FBekIsTUFHSztBQUNILGlCQUFXLENBQUMsUUFBUSxJQUFJLE1BQUosQ0FBVCxHQUF1QixFQUFFLFFBQUYsQ0FEL0I7S0FITDtHQURGOztBQVNBLGdCQUFjLFFBQVEsR0FBUixDQUFZLFVBQUMsTUFBRCxFQUFTLEtBQVQsRUFBbUI7QUFDM0MsUUFBTSxhQUFhLGNBQWMsS0FBZCxDQUFiO1FBQ0EsY0FBYyxhQUFhLGVBQWIsR0FBK0IsY0FBL0I7UUFDZCxNQUFNLGFBQWEsYUFBYSxDQUFiLEdBQWlCLEtBQUssS0FBTCxDQUFXLGNBQWMsUUFBZCxDQUF6QztRQUNOLE1BQU0sYUFBYSxXQUFiLEdBQTJCLGNBQWMsUUFBZDtRQUNqQyxJQUFJLGFBQWEsTUFBTSxnQkFBTixHQUF5QixNQUFNLFFBQU47UUFDMUMsSUFBSSxhQUFhLE1BQU0sZ0JBQU4sR0FBeUIsTUFBTSxRQUFOLENBTkw7QUFPM0MsV0FDRSxnREFBb0IsUUFBUSxNQUFSLEVBQWdCLElBQUksUUFBUSxDQUFSLEVBQVcsS0FBSyxLQUFMO0FBQy9CLHFCQUFlLGFBQWY7QUFDQSxzQkFBZ0IsRUFBRSxHQUFHLEtBQUssS0FBTCxDQUFXLFFBQU0sQ0FBTixDQUFkLEVBQXdCLEdBQUcsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQUQsRUFBN0M7QUFDQSxlQUFTLEVBQUUsR0FBRyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQUgsRUFBa0IsR0FBRyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQUgsRUFBN0I7QUFDQSxxQkFBZSxhQUFmO0FBQ0Esa0JBQVksUUFBUSxDQUFSLEtBQWMsVUFBZDtBQUNaLGtCQUFZLFVBQVo7QUFDQSxlQUFTLGdCQUFULEVBUHBCLENBREYsQ0FQMkM7R0FBbkIsQ0FBMUIsQ0FsQytJOztBQXFEL0ksU0FDRTs7TUFBSyxXQUFVLHdCQUFWLEVBQW1DLE9BQU8sRUFBRSxPQUFPLEtBQVAsRUFBYyxRQUFRLE1BQVIsRUFBdkIsRUFBeEM7SUFDSSxXQURKO0dBREYsQ0FyRCtJO0NBQTFIOztBQTREdkIsZUFBZSxTQUFmLEdBQTJCO0FBQ3pCLFdBQVMsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF4QixDQUFnRCxVQUFoRDtBQUNULGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSxTQUFPLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNQLFVBQVEsTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ1IsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ2YsY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDWixvQkFBa0IsTUFBTSxTQUFOLENBQWdCLElBQWhCO0FBQ2xCLG9CQUFrQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEI7Q0FScEI7O2tCQVdlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckRmLElBQU0sYUFBYSxTQUFiLFVBQWEsT0FBMEY7TUFBeEYscUJBQXdGO01BQWhGLGFBQWdGO2dDQUE1RSxjQUE0RTtNQUE1RSxtREFBYyx3QkFBOEQ7TUFBMUQsdUJBQTBEOzZCQUFqRCxXQUFpRDtNQUFqRCw2Q0FBVyx3QkFBc0M7NkJBQS9CLFdBQStCO01BQS9CLDZDQUFXLHdCQUFvQjtNQUFiLHVCQUFhOzs7QUFFM0csV0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCLFFBQU0sTUFBTSxJQUFJLE1BQUo7UUFDTixPQUFPLElBQUkscUJBQUosRUFBUCxDQUZrQjtBQUd4QixRQUFJLENBQUMsVUFBRCxFQUFhO0FBQ2YsY0FBUSxHQUFSLEVBQWEsRUFBYixFQUFpQixJQUFqQixFQURlO0tBQWpCO0dBSEY7O0FBUUEsV0FBUyxxQkFBVCxDQUErQixNQUEvQixFQUF1QztBQUNyQyxRQUFJLFVBQVUsRUFBVjtRQUNBLDRCQURKOzs7O0FBRHFDLGFBTTVCLG1CQUFULENBQTZCLFFBQTdCLEVBQXVDLGNBQXZDLEVBQXVEO0FBQ3JELHlCQUFtQixFQUFuQixDQURxRDs7Ozs7O0FBRXJELDZCQUFxQix3Q0FBckIsb0dBQXFDOzs7Y0FBMUIscUJBQTBCOztBQUNuQyxjQUFNLE9BQU8sVUFBVSxRQUFWLENBQW1CLGVBQW5CLENBQW1DLFFBQW5DLEVBQTZDLE1BQTdDLENBQVAsQ0FENkI7QUFFbkMsaURBQWlCLElBQWpCLDZDQUF5QixLQUFLLE9BQUwsQ0FBekIsRUFGbUM7U0FBckM7Ozs7Ozs7Ozs7Ozs7O09BRnFEO0tBQXZEO0FBT0EsU0FBSyxJQUFNLEVBQU4sSUFBWSxNQUFqQixFQUF5QjtBQUN2QixVQUFJLGFBQWEsT0FBTyxFQUFQLENBQWIsQ0FEbUI7QUFFdkIsVUFBSSxvQkFBb0IsSUFBcEIsRUFDRixvQkFBb0IsV0FBVyxPQUFYLEVBQW9CLGFBQXhDLEVBREY7NENBRnVCOzs7OztBQUl2Qiw4QkFBcUIsV0FBVyxPQUFYLDJCQUFyQix3R0FBeUM7Y0FBOUIsc0JBQThCOztBQUN2QyxjQUFJLGlCQUFpQixPQUFqQixDQUF5QixNQUF6QixJQUFtQyxDQUFuQyxFQUFzQztBQUN4QyxnQkFBTSxRQUFRLFdBQVcsT0FBWCxDQUFtQixjQUFuQixDQUFrQyxNQUFsQyxDQUFSLENBRGtDO0FBRXhDLHVCQUFXLENBQUMsVUFBVSxJQUFWLEdBQWlCLEVBQWpCLENBQUQsR0FBd0IsRUFBeEIsR0FBNkIsSUFBN0IsR0FBb0MsS0FBcEMsQ0FGNkI7V0FBMUM7U0FERjs7Ozs7Ozs7Ozs7Ozs7T0FKdUI7O0FBVXZCLFVBQUksT0FBTyxJQUFQLEVBQWE7QUFDZixZQUFNLFFBQVEsV0FBVyxJQUFYLEtBQW9CLEdBQXBCLEdBQTBCLEdBQTFCLEdBQWdDLEdBQWhDLENBREM7QUFFZixtQkFBVyxDQUFDLFVBQVUsSUFBVixHQUFpQixFQUFqQixDQUFELEdBQXdCLEVBQXhCLEdBQTZCLElBQTdCLEdBQW9DLEtBQXBDLENBRkk7T0FBakI7S0FWRjtBQWVBLFdBQU8sT0FBUCxDQTVCcUM7R0FBdkM7O0FBK0JBLE1BQU0sZ0JBQWdCLGNBQWMsQ0FBQyxVQUFELEdBQWMsVUFBNUIsR0FBeUMsRUFBekM7TUFDaEIsZ0JBQWdCLGFBQWEsVUFBYixHQUEwQixFQUExQjtNQUNoQixRQUFRLEtBQUssQ0FBTDtNQUNSLG1CQUFtQixRQUFRLEVBQVI7TUFDbkIsaUNBQStCLHNCQUFpQiwyQkFBc0IsS0FBdEU7TUFDQSxPQUFPLFFBQVEsSUFBUixJQUFnQixFQUFoQjtNQUNQLFdBQVcsUUFBUSxRQUFSLElBQW9CLElBQXBCLEdBQTJCLFFBQVEsUUFBUixHQUFtQixnQkFBOUM7TUFDWCxZQUFZLHVCQUFxQixpQkFBckIsR0FBc0MsRUFBdEM7TUFDWixVQUFVLFFBQVEsT0FBUixJQUFtQixJQUFuQixHQUEwQixRQUFRLE9BQVIsR0FBa0IsR0FBNUM7TUFDVixVQUFVLHNCQUFzQixNQUF0QixDQUFWLENBbERxRztBQW1EM0csU0FDRSw2QkFBSyxXQUFXLE9BQVgsRUFBb0IsT0FBTyxPQUFQO0FBQ25CLFdBQU87QUFDTCxZQUFNLFFBQVEsQ0FBUixFQUFXLEtBQUssUUFBUSxDQUFSO0FBQ3RCLGFBQU8sSUFBUCxFQUFhLFFBQVEsSUFBUjtBQUNiLDBCQUhLLEVBR00sZ0JBSE47S0FBUDtBQUtBLGFBQVMsV0FBVCxFQU5OLENBREYsQ0FuRDJHO0NBQTFGOztBQStEbkIsV0FBVyxTQUFYLEdBQXVCO0FBQ3JCLFVBQVEsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ1IsTUFBSSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDSixpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBd0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXZDO0FBQ0EsV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0I7QUFDN0IsT0FBRyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDSCxPQUFHLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNILFVBQU0sTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ04sY0FBVSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDVixhQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUxvQixHQUF0QixFQU1OLFVBTk07QUFPVCxjQUFZLE1BQU0sU0FBTixDQUFnQixJQUFoQjtBQUNaLGNBQVksTUFBTSxTQUFOLENBQWdCLElBQWhCO0FBQ1osV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEI7Q0FiWDs7a0JBZ0JlOzs7Ozs7Ozs7OztBQ25HZixJQUFNLGdCQUFnQixTQUFoQixhQUFnQixPQUFpRDtNQUEvQyx1QkFBK0M7TUFBdEMscUJBQXNDO01BQTlCLHlCQUE4QjtNQUFwQixxQ0FBb0I7O0FBQ3JFLE1BQUksQ0FBQyxRQUFELEVBQVc7QUFDYixRQUFJLGFBQWEsUUFBUSxjQUFSLENBQXVCLE1BQXZCLENBQWIsQ0FEUztBQUViLFdBQ0U7O1FBQUssV0FBVSwrQkFBVixFQUFMO01BQ0U7OztRQUNJLFVBREo7T0FERjtLQURGLENBRmE7R0FBZixNQVNPOztBQUNMLFVBQUksVUFBVSxVQUFVLFFBQVYsQ0FBbUIsZUFBbkIsQ0FBbUMsT0FBbkMsRUFBNEMsTUFBNUMsRUFBb0QsT0FBcEQ7VUFDVixjQUFjLFFBQVEsR0FBUixDQUFZO2VBQUssUUFBUSxjQUFSLENBQXVCLENBQXZCO09BQUwsQ0FBMUI7VUFDQSxnQkFBZ0IsWUFBWSxHQUFaLENBQWdCLFVBQUMsSUFBRCxFQUFPLENBQVA7ZUFBYzs7WUFBUSxLQUFLLElBQUwsRUFBVyxPQUFPLFFBQVEsQ0FBUixDQUFQLEVBQW5CO1VBQXVDLElBQXZDOztPQUFkLENBQWhDO0FBQ0o7V0FDRTs7WUFBSyxXQUFVLG1CQUFWLEVBQUw7VUFDRTs7Y0FBUSxPQUFRLE1BQVIsRUFBaUIsVUFBVyxjQUFYLEVBQXpCO1lBQ0ksYUFESjtXQURGOztPQURGO1FBSks7OztHQVRQO0NBRG9COztBQXdCdEIsY0FBYyxTQUFkLEdBQTBCO0FBQ3hCLFdBQVMsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ1QsVUFBUSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUixZQUFVLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFyQjtBQUNWLGtCQUFnQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7Q0FKbEI7O2tCQU9lOzs7Ozs7Ozs7Ozs7Ozs7QUM3QmYsSUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBUyxPQUFULEVBQWtCLGFBQWxCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ3hELE1BQUksY0FBYyxjQUFjLEdBQWQsQ0FBbUI7V0FBSyxVQUFVLFFBQVYsQ0FBbUIsZUFBbkIsQ0FBbUMsT0FBbkMsRUFBNEMsQ0FBNUM7R0FBTCxDQUFqQyxDQURvRDtBQUV4RCxTQUFPLFFBQVEsTUFBUixDQUFnQixhQUFLO0FBQzFCLFFBQUksT0FBTyxVQUFVLFFBQVYsQ0FBbUIsZUFBbkIsQ0FBbUMsT0FBbkMsRUFBNEMsQ0FBNUMsQ0FBUCxDQURzQjtBQUUxQixXQUFPLFlBQVksT0FBWixDQUFvQixJQUFwQixNQUE4QixDQUFDLENBQUQsQ0FGWDtHQUFMLENBQXZCLENBRndEO0NBQTFDO0lBT2hCLG1CQUFtQixTQUFuQixnQkFBbUIsT0FBbUQ7TUFBakQsdUJBQWlEO01BQXhDLGlCQUF3QztNQUFsQywyQkFBa0M7TUFBdkIsMkNBQXVCOztBQUNwRSxNQUFJLFVBQVUsS0FBSyxPQUFMO01BQ1YsY0FBYyxRQUFRLEdBQVIsQ0FBWTtXQUFLLFFBQVEsY0FBUixDQUF1QixDQUF2QjtHQUFMLENBQTFCO01BQ0EsYUFBYSxZQUFZLE1BQVo7TUFDYixpQkFBaUIsRUFBakI7TUFDQSxtQkFBbUIsYUFBYSxhQUFiO01BQ25CLGFBTEo7TUFLTyxhQUxQLENBRG9FOztBQVFwRSxpQkFBZSxJQUFmLENBQW9COztNQUFRLEtBQUksYUFBSixFQUFrQixPQUFNLGFBQU4sRUFBb0IsVUFBUyxVQUFULEVBQTlDOztHQUFwQixFQVJvRTs7QUFVcEUsT0FBSyxJQUFJLENBQUosRUFBTyxJQUFJLFVBQUosRUFBZ0IsR0FBNUIsRUFBaUM7QUFDL0IsU0FBSyxJQUFJLENBQUosRUFBTyxJQUFJLFVBQUosRUFBZ0IsR0FBNUIsRUFBaUM7QUFDL0IsVUFBSSxNQUFNLElBQUksR0FBSixHQUFVLENBQVY7VUFDTixTQUFTLFlBQVksQ0FBWixJQUFpQixLQUFqQixHQUF5QixZQUFZLENBQVosQ0FBekIsQ0FGa0I7QUFHL0IscUJBQWUsSUFBZixDQUFvQjs7VUFBUSxLQUFLLEdBQUwsRUFBVSxPQUFPLEdBQVAsRUFBbEI7UUFBK0IsTUFBL0I7T0FBcEIsRUFIK0I7S0FBakM7R0FERjs7QUFRQSxTQUNFOztNQUFRLE9BQVEsZ0JBQVIsRUFBMkIsVUFBVyxpQkFBWCxFQUFuQztJQUNJLGNBREo7R0FERixDQWxCb0U7Q0FBbkQ7O0FBeUJ2QixJQUFNLGlCQUFpQixTQUFqQixjQUFpQixRQUE2RDtNQUEzRCxnQkFBMkQ7a0NBQXRELGNBQXNEO01BQXRELG9EQUFjLHlCQUF3Qzs4QkFBcEMsVUFBb0M7TUFBcEMsNENBQVUscUJBQTBCO01BQXRCLDBDQUFzQjs7QUFDbEYsTUFBSSxlQUFlLEVBQWYsQ0FEOEU7Ozs7OztBQUVsRix5QkFBMkIsSUFBSSxPQUFKLENBQVksZUFBWiwwQkFBM0Isb0dBQXdEO1VBQS9DLDZCQUErQzs7QUFDdEQsVUFBSSxRQUFRLElBQUksUUFBSixDQUFhLFFBQWIsQ0FBc0IsV0FBdEIsQ0FBa0MsY0FBbEMsQ0FBUjtVQUNBLFVBQVUsTUFBTSxPQUFPLElBQVAsQ0FBWSxLQUFaLEVBQW1CLENBQW5CLENBQU4sRUFBNkIsT0FBN0I7VUFDVixpQkFBaUIsY0FBYyxPQUFkLEVBQXVCLGFBQXZCLEVBQXNDLElBQUksT0FBSixDQUF2RDtVQUNBLFFBQVEsZUFBZSxHQUFmLENBQW1CO2VBQUssVUFBVSxRQUFWLENBQW1CLGVBQW5CLENBQW1DLElBQUksT0FBSixFQUFhLENBQWhEO09BQUwsQ0FBM0I7VUFDQSxZQUFZLE1BQU0sR0FBTixDQUFVLGFBQUs7QUFDekIsZUFDRSxvQkFBQyxnQkFBRDtBQUNFLGVBQWMsRUFBRSxJQUFGO0FBQ2QsbUJBQWMsSUFBSSxPQUFKO0FBQ2QsZ0JBQWMsQ0FBZDtBQUNBLHFCQUFjLFVBQVUsRUFBRSxJQUFGLENBQXhCO0FBQ0EsNkJBQXNCLDJCQUFTLEtBQVQsRUFBZ0I7QUFDcEMsNkJBQWlCLENBQWpCLEVBQW9CLE1BQU0sTUFBTixDQUFhLEtBQWIsQ0FBcEIsQ0FEb0M7V0FBaEI7U0FMeEIsQ0FERixDQUR5QjtPQUFMLENBQXRCLENBTGtEOztBQW1CdEQsbUJBQWEsSUFBYixDQUNFOztVQUFLLFdBQVUsT0FBVixFQUFrQixLQUFLLGNBQUwsRUFBdkI7UUFDRSxvREFERjtRQUVFLG9EQUZGO1FBR0U7O1lBQUssV0FBVSxxQkFBVixFQUFMO1VBQ0ksU0FESjtTQUhGO09BREYsRUFuQnNEO0tBQXhEOzs7Ozs7Ozs7Ozs7OztHQUZrRjs7QUErQmxGLFNBQ0U7O01BQUssV0FBVSx3QkFBVixFQUFMO0lBQ0ksWUFESjtHQURGLENBL0JrRjtDQUE3RDs7QUFzQ3ZCLGlCQUFpQixTQUFqQixHQUE2QjtBQUMzQixXQUFTLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNULFFBQU0sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ04sYUFBVyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDWCxxQkFBbUIsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0NBSnJCOztBQU9BLGVBQWUsU0FBZixHQUEyQjtBQUN6QixPQUFLLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNMLGlCQUFlLE1BQU0sU0FBTixDQUFnQixLQUFoQjtBQUNmLGFBQVcsTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ1gsb0JBQWtCLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFyQjtDQUpwQjs7a0JBT2U7Ozs7Ozs7Ozs7Ozs7OztBQ3BGZixJQUFNLGFBQWEsU0FBYixVQUFhLE9BQThDO01BQTVDLGVBQTRDO2dDQUF2QyxjQUF1QztNQUF2QyxtREFBZ0Isd0JBQXVCO01BQW5CLG9DQUFtQjs7QUFDL0QsTUFBSSxlQUFlLEVBQWYsQ0FEMkQ7Ozs7Ozs7VUFFdEQ7O0FBQ1AsVUFBSSxRQUFRLElBQUksUUFBSixDQUFhLFFBQWIsQ0FBc0IsV0FBdEIsQ0FBa0MsY0FBbEMsQ0FBUjtVQUNBLFFBQVEsRUFBUjs7bUNBQ0s7QUFDUCxjQUFNLElBQU4sQ0FDRTtBQUNFLGVBQUssR0FBTDtBQUNBLGVBQUssTUFBTSxNQUFOLEdBQWUsQ0FBZjtBQUNMLDBCQUFnQixjQUFoQjtBQUNBLGdCQUFNLElBQU47QUFDQSx5QkFBZSxhQUFmO0FBQ0EseUJBQWUsTUFBTSxNQUFOLEdBQWEsQ0FBYjtBQUNmLHlCQUFlLHVCQUFTLFVBQVQsRUFBcUIsU0FBckIsRUFBZ0M7QUFDN0MsMkJBQWMsY0FBZCxFQUE4QixJQUE5QixFQUFvQyxVQUFwQyxFQUFnRCxTQUFoRCxFQUQ2QztXQUFoQyxFQVBqQixDQURGOzs7QUFERixXQUFLLElBQUksSUFBSixJQUFZLEtBQWpCLEVBQXdCO2VBQWYsTUFBZTtPQUF4QjtBQWNBLG1CQUFhLElBQWIsQ0FDRTs7VUFBSyxLQUFLLGFBQWEsTUFBYixHQUFzQixDQUF0QixFQUFWO1FBQ0ksS0FESjtPQURGOzs7QUFqQkYseUJBQTJCLElBQUksT0FBSixDQUFZLGVBQVosMEJBQTNCLG9HQUF3RDs7S0FBeEQ7Ozs7Ozs7Ozs7Ozs7O0dBRitEOztBQXlCL0QsU0FDRTs7TUFBSyxXQUFVLG1CQUFWLEVBQUw7SUFDSSxZQURKO0dBREYsQ0F6QitEO0NBQTlDOztBQWdDbkIsV0FBVyxTQUFYLEdBQXVCO0FBQ3JCLE9BQUssTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ0wsaUJBQWUsTUFBTSxTQUFOLENBQWdCLEtBQWhCO0FBQ2YsaUJBQWUsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0NBSGpCOztrQkFNZTs7Ozs7Ozs7QUN4Q2YsSUFBTSxlQUFlLFNBQWYsWUFBZSxPQUErRDtNQUE3RCxlQUE2RDt3QkFBeEQsTUFBd0Q7TUFBeEQsbUNBQU0saUJBQWtEOytCQUE3QyxhQUE2QztNQUE3QyxpREFBYSx1QkFBZ0M7NkJBQTVCLFdBQTRCO01BQTVCLDZDQUFXLHFCQUFpQjtNQUFiLHFCQUFhOztBQUNsRixNQUFJLFVBQVUsa0VBQVY7TUFDQSxNQUFVLFVBQVMsSUFBSSxZQUFKLEVBQVQ7TUFDVixpQkFBaUIsaUJBQWlCLGFBQWEsT0FBYixJQUF3QixJQUF4QixHQUErQixhQUFhLE9BQWIsR0FBdUIsR0FBdEQsQ0FBakI7TUFDakIsZUFBZSxlQUFlLFdBQVcsT0FBWCxJQUFzQixJQUF0QixHQUE2QixXQUFXLE9BQVgsR0FBcUIsR0FBbEQsQ0FBZjs7O0FBSitELFNBUWhGO0FBQUMsZ0JBQVksTUFBYjtNQUFvQixjQUFjLEVBQUUsU0FBUyxjQUFULEVBQWhCO0FBQ0EsYUFBTyxFQUFFLFNBQVMsWUFBWSxNQUFaLENBQW1CLFlBQW5CLEVBQWlDLEVBQUUsV0FBVyxFQUFYLEVBQW5DLENBQVQsRUFBVDtBQUNBLGNBQVEsTUFBUixFQUZwQjtJQUlJO2FBQ0U7O1VBQUssV0FBVSxxQkFBVixFQUFnQyxPQUFPLGlCQUFQLEVBQXJDO1FBQ0UsNkJBQUssS0FBSyxHQUFMLEVBQVUsT0FBTyxLQUFQLEVBQWYsQ0FERjs7S0FERjtHQUxOLENBUGtGO0NBQS9EOztBQXFCckIsYUFBYSxTQUFiLEdBQXlCO0FBQ3ZCLE9BQUssTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ0wsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDUCxnQkFBYyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7QUFDZCxjQUFZLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNaLFVBQVEsTUFBTSxTQUFOLENBQWdCLElBQWhCO0NBTFY7O2tCQVFlOzs7Ozs7Ozs7Ozs7Ozs7QUMzQmYsSUFBTSxVQUFVLFNBQVYsT0FBVSxPQUFrQztNQUFoQyxpQkFBZ0M7d0JBQTFCLE1BQTBCO01BQTFCLG1DQUFNLGlCQUFvQjswQkFBZixRQUFlO01BQWYsdUNBQVEsaUJBQU87O0FBQ2hELE1BQUksV0FBVyxRQUFNLE9BQU47TUFDWCxXQUFXLEtBQUssR0FBTCxDQUFTLFVBQUMsR0FBRCxFQUFNLEtBQU47V0FBaUIsMENBQWMsS0FBSyxHQUFMLEVBQVUsS0FBSyxLQUFMLEVBQVksT0FBTyxRQUFQLEVBQXBDO0dBQWpCLENBQXBCLENBRjRDOztBQUloRCxTQUNFOztNQUFLLFdBQVUsZ0JBQVYsRUFBTDtJQUNJLFFBREo7R0FERixDQUpnRDtDQUFsQzs7QUFXaEIsUUFBUSxTQUFSLEdBQW9CO0FBQ2xCLFFBQU0sTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF4QixDQUFnRCxVQUFoRDtBQUNOLFNBQU8sTUFBTSxTQUFOLENBQWdCLE1BQWhCO0FBQ1AsV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7Q0FIWDs7a0JBTWU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYmYsSUFBTSxZQUFZLFNBQVosU0FBWSxPQUE0QjtNQUExQixpQkFBMEI7TUFBcEIscUNBQW9COzs7QUFFNUMsTUFBSSxTQUFTLElBQUksR0FBSixFQUFUO01BQ0EsT0FBTyxFQUFQOzs7QUFId0MsTUFNeEMsQ0FBQyxjQUFELEVBQWlCLGlCQUFpQixLQUFLLE1BQUwsQ0FBdEM7OztBQU40Qzs7Ozs7QUFTNUMseUJBQTJCLEtBQUssT0FBTCw0QkFBM0Isb0dBQTJDOzs7VUFBL0IsdUJBQStCO1VBQXhCLHFCQUF3Qjs7QUFDekMsVUFBTSxZQUFZLE1BQU0sSUFBSSxHQUFKLENBRGlCOzs7Ozs7QUFFekMsOEJBQW9CLE9BQU8sSUFBUCxDQUFZLElBQUksU0FBSixDQUFjLGVBQWQsNEJBQWhDLHdHQUFnRTtjQUFyRCxxQkFBcUQ7O0FBQzlELGNBQUksUUFBUSxJQUFJLFNBQUosQ0FBYyxlQUFkLENBQThCLEtBQTlCLENBQVI7Y0FDQSxjQUFjLE9BQU8sR0FBUCxDQUFXLEtBQVgsS0FBcUIsSUFBSSxHQUFKLEVBQXJCO2NBQ2QsY0FBYyxZQUFZLEdBQVosQ0FBZ0IsS0FBaEIsS0FBMEIsSUFBSSxHQUFKLEVBQTFCLENBSDRDO0FBSTlELGNBQUksQ0FBQyxPQUFPLEdBQVAsQ0FBVyxLQUFYLENBQUQsRUFBb0IsT0FBTyxHQUFQLENBQVcsS0FBWCxFQUFrQixXQUFsQixFQUF4QjtBQUNBLGNBQUksQ0FBQyxZQUFZLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBRCxFQUF5QixZQUFZLEdBQVosQ0FBZ0IsS0FBaEIsRUFBdUIsV0FBdkIsRUFBN0I7O0FBTDhELGNBTzFELFNBQVMsS0FBSyxNQUFMLEdBQWMsY0FBZCxFQUNYLFlBQVksR0FBWixDQUFnQixTQUFoQixFQUEyQixDQUFDLFlBQVksR0FBWixDQUFnQixTQUFoQixLQUE4QixDQUE5QixDQUFELEdBQW9DLENBQXBDLENBQTNCLENBREY7QUFFQSxzQkFBWSxHQUFaLENBQWdCLElBQUksR0FBSixFQUFTLENBQUMsWUFBWSxHQUFaLENBQWdCLElBQUksR0FBSixDQUFoQixJQUE0QixDQUE1QixDQUFELEdBQWtDLENBQWxDLENBQXpCLENBVDhEO1NBQWhFOzs7Ozs7Ozs7Ozs7OztPQUZ5QztLQUEzQzs7Ozs7Ozs7Ozs7Ozs7OztHQVQ0Qzs7QUF5QjVDLE1BQUksV0FBVyxDQUFYLENBekJ3Qzs7Ozs7O0FBMEI1QywwQkFBOEIsaUNBQTlCLHdHQUFzQzs7O1VBQTFCLHdCQUEwQjtVQUFuQix5QkFBbUI7Ozs7OztBQUNwQyw4QkFBOEIsaUNBQTlCLHdHQUFzQzs7O2NBQTFCLHdCQUEwQjtjQUFuQix5QkFBbUI7O0FBQ3BDLGNBQU0sU0FBUyxPQUFPLEdBQVAsQ0FBVyxNQUFNLFVBQVUsSUFBVixDQUFqQixJQUFvQyxDQUFwQztjQUNULFdBQVcsT0FBTyxHQUFQLENBQVcsTUFBTSxVQUFVLE1BQVYsQ0FBakIsSUFBc0MsQ0FBdEM7Y0FDWCxTQUFTLFNBQVMsUUFBVDtjQUNULE9BQU8sS0FBSyxLQUFMLENBQVksTUFBTSxNQUFOLEdBQWUsY0FBZixDQUFuQjtjQUNBLFNBQVMsT0FBTyxHQUFQLENBQVcsVUFBVSxJQUFWLENBQVgsSUFBOEIsQ0FBOUI7Y0FDVCxXQUFXLE9BQU8sR0FBUCxDQUFXLFVBQVUsTUFBVixDQUFYLElBQWdDLENBQWhDO2NBQ1gsU0FBUyxTQUFTLFFBQVQ7Y0FDVCxPQUFPLEtBQUssS0FBTCxDQUFZLE1BQU0sTUFBTixHQUFlLEtBQUssTUFBTCxDQUFsQyxDQVI4QjtBQVNwQyxlQUFLLElBQUwsQ0FBVSxFQUFFLFlBQUYsRUFBUyxrQkFBVCxFQUFtQixZQUFuQixFQUEwQixjQUExQixFQUFrQyxrQkFBbEMsRUFBNEMsY0FBNUMsRUFBb0QsVUFBcEQ7QUFDMEIsMEJBRDFCLEVBQ2tDLGtCQURsQyxFQUM0QyxjQUQ1QyxFQUNvRCxVQURwRCxFQUFWLEVBVG9DO1NBQXRDOzs7Ozs7Ozs7Ozs7OztPQURvQzs7QUFhcEMsUUFBRyxRQUFILENBYm9DO0tBQXRDOzs7Ozs7Ozs7Ozs7OztHQTFCNEM7O0FBMEM1QyxTQUNFOztNQUFLLFdBQVUsa0JBQVYsRUFBTDtJQUNFOztRQUFPLElBQUcsYUFBSCxFQUFpQixXQUFXLEtBQUssTUFBTCxHQUFjLENBQWQsR0FBa0IsVUFBbEIsR0FBK0IsU0FBL0IsRUFBbkM7TUFDRTs7O1FBQ0U7OztVQUNFOzs7O1dBREY7VUFFRTs7Y0FBSSxTQUFRLEdBQVIsRUFBSjs7V0FGRjtVQUU2Qjs7OztXQUY3QjtVQUV1Qzs7OztXQUZ2QztVQUdFOztjQUFJLFNBQVEsR0FBUixFQUFKOztXQUhGO1VBRzRCOzs7O1dBSDVCO1VBR3NDOzs7O1dBSHRDO1NBREY7T0FERjtNQVFFOzs7UUFFRSxLQUFLLEdBQUwsQ0FBUyxVQUFTLEdBQVQsRUFBYyxLQUFkLEVBQXFCO0FBQzVCLGlCQUNFOztjQUFJLEtBQUssS0FBTCxFQUFZLFdBQVcsSUFBSSxRQUFKLEdBQWUsQ0FBZixHQUFtQixXQUFuQixHQUFpQyxZQUFqQyxFQUEzQjtZQUNFOztnQkFBSSxXQUFVLE9BQVYsRUFBSjtjQUF1QixJQUFJLEtBQUo7YUFEekI7WUFFRTs7Z0JBQUksV0FBVSxTQUFWLEVBQUo7Y0FBeUIsSUFBSSxNQUFKO2FBRjNCO1lBR0U7O2dCQUFJLFdBQVUsU0FBVixFQUFKO2NBQXlCLElBQUksSUFBSjtpQkFBekI7YUFIRjtZQUlFOztnQkFBSSxXQUFVLFNBQVYsRUFBSjtjQUF5QixJQUFJLFFBQUo7YUFKM0I7WUFLRTs7Z0JBQUksV0FBVSxTQUFWLEVBQUo7Y0FBeUIsSUFBSSxNQUFKO2FBTDNCO1lBTUU7O2dCQUFJLFdBQVUsU0FBVixFQUFKO2NBQXlCLElBQUksTUFBSjthQU4zQjtZQU9FOztnQkFBSSxXQUFVLFNBQVYsRUFBSjtjQUF5QixJQUFJLElBQUo7aUJBQXpCO2FBUEY7WUFRRTs7Z0JBQUksV0FBVSxTQUFWLEVBQUo7Y0FBeUIsSUFBSSxRQUFKO2FBUjNCO1lBU0U7O2dCQUFJLFdBQVUsU0FBVixFQUFKO2NBQXlCLElBQUksTUFBSjthQVQzQjtXQURGLENBRDRCO1NBQXJCLENBRlg7T0FSRjtLQURGO0dBREYsQ0ExQzRDO0NBQTVCOztBQTRFbEIsVUFBVSxTQUFWLEdBQXNCO0FBQ3BCLFFBQU0sTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF4QixDQUFnRCxVQUFoRDtBQUNOLGtCQUFnQixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7Q0FGbEI7O2tCQUtlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBTZWUgaHR0cHM6Ly9tZWRpdW0uY29tL0BrZW50Y2RvZGRzL21pc3VuZGVyc3RhbmRpbmctZXM2LW1vZHVsZXMtdXBncmFkaW5nLWJhYmVsLXRlYXJzLWFuZC1hLXNvbHV0aW9uLWFkMmQ1YWI5M2NlMCMucTF2Y2tmZml3XG4gKiAoS2VudCBDLiBEb2RkcywgXCJNaXN1bmRlcnN0YW5kaW5nIEVTNiBNb2R1bGVzLCBVcGdyYWRpbmcgQmFiZWwsIFRlYXJzLCBhbmQgYSBTb2x1dGlvblwiKVxuICogZm9yIGRlc2NyaXB0aW9uIG9mIHNvbWUgb2YgdGhlIGRldGFpbHMgaW52b2x2ZWQgaW4gbWl4aW5nIEVTNiBleHBvcnQgd2l0aCByZXF1aXJlKCkuXG4gKi9cbmNvbnN0XG4gIEFsbGVsZUZpbHRlcnNWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzJykuZGVmYXVsdCxcbiAgQWxsZWxlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9hbGxlbGUnKS5kZWZhdWx0LFxuICBBbmltYXRlZEdhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlJykuZGVmYXVsdCxcbiAgQ2hyb21vc29tZUltYWdlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJykuZGVmYXVsdCxcbiAgQ2hyb21vc29tZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZScpLmRlZmF1bHQsXG4gIEZlcnRpbGl6aW5nR2FtZXRlVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUnKS5kZWZhdWx0LFxuICBHYW1ldGVQb29sVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nYW1ldGUtcG9vbCcpLmRlZmF1bHQsXG4gIEdhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2FtZXRlJykuZGVmYXVsdCxcbiAgR2VuZUxhYmVsVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJykuZGVmYXVsdCxcbiAgR2Vub21lVGVzdFZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnKS5kZWZhdWx0LFxuICBHZW5vbWVWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dlbm9tZScpLmRlZmF1bHQsXG4gIE9yZ2FuaXNtVmlldyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9vcmdhbmlzbScpLmRlZmF1bHQsXG4gIFBlblZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcGVuJykuZGVmYXVsdCxcbiAgU3RhdHNWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3N0YXRzJykuZGVmYXVsdDtcblxuZXhwb3J0IHtcbiAgQWxsZWxlRmlsdGVyc1ZpZXcsXG4gIEFsbGVsZVZpZXcsXG4gIEFuaW1hdGVkR2FtZXRlVmlldyxcbiAgQ2hyb21vc29tZUltYWdlVmlldyxcbiAgQ2hyb21vc29tZVZpZXcsXG4gIEZlcnRpbGl6aW5nR2FtZXRlVmlldyxcbiAgR2FtZXRlUG9vbFZpZXcsXG4gIEdhbWV0ZVZpZXcsXG4gIEdlbmVMYWJlbFZpZXcsXG4gIEdlbm9tZVRlc3RWaWV3LFxuICBHZW5vbWVWaWV3LFxuICBPcmdhbmlzbVZpZXcsXG4gIFBlblZpZXcsXG4gIFN0YXRzVmlld1xufTtcbiIsImNvbnN0IEFsbGVsZUZpbHRlcnNWaWV3ID0gKHtzcGVjaWVzLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNhYmxlZEFsbGVsZXMgPSBbXSwgb25GaWx0ZXJDaGFuZ2V9KSA9PiB7XG4gIGxldCBoaWRkZW5HZW5lcyA9IG5ldyBTZXQsXG4gICAgICBnZW5lSW5wdXRzID0gW107XG5cbiAgZm9yIChjb25zdCBhbGxlbGUgb2YgaGlkZGVuQWxsZWxlcykge1xuICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSk7XG4gICAgaWYgKGdlbmUpXG4gICAgICBoaWRkZW5HZW5lcy5hZGQoZ2VuZS5uYW1lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZ2VuZSBpbiBzcGVjaWVzLmdlbmVMaXN0KSB7XG4gICAgaWYgKCFoaWRkZW5HZW5lcy5oYXMoZ2VuZSkpIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMsXG4gICAgICAgICAgICBhbGxlbGVJdGVtcyA9IGFsbGVsZXMubWFwKGFsbGVsZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV0sXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAhKGRpc2FibGVkQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPj0gMCk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpbkxlZnRcIjogXCI4cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgZ2VuZUlucHV0cy5wdXNoKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmUtYWxsZWxlLWxpc3RcIiBrZXk9e2dlbmV9PnthbGxlbGVJdGVtc308L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIGFsbGVsZSA9IGVsdCAmJiBlbHQudmFsdWUsXG4gICAgICAgICAgaXNDaGVja2VkID0gZWx0ICYmIGVsdC5jaGVja2VkO1xuICAgIGlmIChvbkZpbHRlckNoYW5nZSAmJiBhbGxlbGUpXG4gICAgICBvbkZpbHRlckNoYW5nZShldnQsIGFsbGVsZSwgaXNDaGVja2VkKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZS1maWx0ZXJzXCJcbiAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpblRvcFwiOiBcIjVweFwiLCBcIm1hcmdpbkJvdHRvbVwiOiBcIjVweFwiIH19PlxuICAgICAgeyBnZW5lSW5wdXRzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkFsbGVsZUZpbHRlcnNWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzYWJsZWRBbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgb25GaWx0ZXJDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZUZpbHRlcnNWaWV3O1xuIiwiY29uc3QgQWxsZWxlVmlldyA9ICh7YWxsZWxlLCB0YXJnZXQsIGNvbG9yLCBzaGFwZSwgaG92ZXJpbmd9KSA9PiB7XG4gIGxldCB3aWR0aD0yMSxcbiAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBzdHJva2UgPSB0YXJnZXQgPyBcIiMwMDAwMDBcIiA6IFwibm9uZVwiLFxuICAgICAgZmlsbCA9IGFsbGVsZSA/IGNvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgc3Ryb2tlV2lkdGggPSBob3ZlcmluZyA/IDMgOiAxLFxuICAgICAgc3Ryb2tlRGFzaGFycmF5PSBhbGxlbGUgPyBcIjBcIiA6IFwiMVwiLFxuICAgICAgc3ZnU2hhcGUgPSBudWxsO1xuXG4gIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgIHN2Z1NoYXBlID0gPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMX0gY3g9e3JhZGl1cysxfSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfSBlbHNlIHtcbiAgICBzdmdTaGFwZSA9IDxyZWN0IHdpZHRoPXsocmFkaXVzKjIpfSBoZWlnaHQ9eyhyYWRpdXMqMil9IHg9XCIxXCIgeT1cIjFcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfVxuXG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aCsyfSBoZWlnaHQ9e3dpZHRoKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICB7IHN2Z1NoYXBlIH1cbiAgICAgICAgPHRleHQgeD17cmFkaXVzKzF9IHk9e3JhZGl1cys3fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+e2FsbGVsZX08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlIHRoYXQgYW5pbWF0ZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gW2luaXRpYWxEaXNwbGF5XSAtIGluaXRpYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueF0gLSBpbml0aWFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnldIC0gaW5pdGlhbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnNpemU9MzBdIC0gaW5pdGlhbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5yb3RhdGlvbj0wXSAtIGluaXRpYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5vcGFjaXR5PTFdIC0gaW5pdGlhbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZmluYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBmaW5hbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGZpbmFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIGZpbmFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSBmaW5hbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIGZpbmFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthbmltU3RpZmZuZXNzPTEwMF0gLSBzcHJpbmcgc3RpZmZuZXNzIHVzZWQgdG8gY29udHJvbCBhbmltYXRpb24gc3BlZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uUmVjdCgpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgYXQgcmVzdFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5pbXBvcnQgR2FtZXRlVmlldyBmcm9tICcuL2dhbWV0ZSc7XG5cbmNvbnN0IEFuaW1hdGVkR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgaW5pdGlhbERpc3BsYXksIGRpc3BsYXksIGFuaW1TdGlmZm5lc3M9MTAwLCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrLCBvblJlc3R9KSA9PiB7XG5cbiAgY29uc3QgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBpbml0aWFsID0gaW5pdGlhbERpc3BsYXkgfHwgZGlzcGxheSxcbiAgICAgICAgaW5pdGlhbFNpemUgPSBpbml0aWFsLnNpemUgfHwgMzAsXG4gICAgICAgIGluaXRpYWxSb3RhdGlvbiA9IGluaXRpYWwucm90YXRpb24gIT0gbnVsbCA/IGluaXRpYWwucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWwub3BhY2l0eSAhPSBudWxsID8gaW5pdGlhbC5vcGFjaXR5IDogMS4wLFxuICAgICAgICBmaW5hbFNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIGZpbmFsUm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgZmluYWxPcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzIH07XG4gIC8qIGVzbGludCByZWFjdC9kaXNwbGF5LW5hbWU6MCAqL1xuICByZXR1cm4gKFxuICAgIDxSZWFjdE1vdGlvbi5Nb3Rpb24gZGVmYXVsdFN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGluaXRpYWwueCwgeTogaW5pdGlhbC55LCBzaXplOiBpbml0aWFsU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGluaXRpYWxSb3RhdGlvbiwgb3BhY2l0eTogaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBSZWFjdE1vdGlvbi5zcHJpbmcoZGlzcGxheS54LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBSZWFjdE1vdGlvbi5zcHJpbmcoZGlzcGxheS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWxTaXplLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsUm90YXRpb24sIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbE9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PlxuICAgICAgICAgIDxHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9IFxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e2ludGVycG9sYXRlZFN0eWxlfVxuICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9IGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZEdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIGluaXRpYWxEaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAvLyBpbml0aWFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLFxuICBkaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZmluYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICBpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvblJlc3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZEdhbWV0ZVZpZXc7XG4iLCJjb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKCkgPT4ge1xuICBsZXQgd2lkdGg9MjMsXG4gICAgICBoZWlnaHQ9MTI2LFxuICAgICAgc3BsaXQ9NDUsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQsXG4gICAgICBjb2xvciA9IFwiI0ZGOTk5OVwiO1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzJ9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtoZWlnaHQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhzcGxpdC1yYWRpdXMpLShyYWRpdXMrMil9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPVwiMlwiICAgICAgIHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZUltYWdlVmlldztcbiIsImltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuXG5jb25zdCBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcCggYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKCBhID0+IHtcbiAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICB9KTtcbn07XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBhbGxlbGVDaGFuZ2VkLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgbGFiZWxzICA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChhLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pLFxuXG4gICAgICBjb250YWluZXJDbGFzcyA9IFwiaXRlbXNcIjtcblxuICBpZiAoIWxhYmVsc09uUmlnaHQpIHtcbiAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbnRhaW5lckNsYXNzIH0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2hyb21vc29tZU5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2lkZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIGFsbGVsZUNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxhYmVsc09uUmlnaHQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBJTklUSUFMX0dBTUVURV9TSVpFID0gMzAsXG4gICAgICBGSU5BTF9HQU1FVEVfU0laRSA9IDE0MCxcbiAgICAgIFJFU1RJTkdfTU9USEVSX0dBTUVURV9YID0gMCxcbiAgICAgIFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YID0gMTUwLFxuICAgICAgRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YID0gNzAsXG4gICAgICBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1ggPSA4MCxcbiAgICAgIEZJTkFMX1pZR09URV9ZID0gLTE1MDtcblxuZXhwb3J0IGNvbnN0IEdBTUVURV9UWVBFID0geyBNT1RIRVI6ICdtb3RoZXInLCBGQVRIRVI6ICdmYXRoZXInIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWyBHQU1FVEVfVFlQRS5NT1RIRVIsIEdBTUVURV9UWVBFLkZBVEhFUiBdKS5pc1JlcXVpcmVkLFxuICAgIGdhbWV0ZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZmVydGlsaXphdGlvblN0YXRlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoWydub25lJywgJ2ZlcnRpbGl6aW5nJywgJ2ZlcnRpbGl6ZWQnLCAnY29tcGxldGUnXSkuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBzcmNSZWN0OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBkc3RSZWN0OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBhbmltU3RpZmZuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gICAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBbXSxcbiAgICBhbmltU3RpZmZuZXNzOiAxMDBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGxldCB7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcywgYW5pbVN0aWZmbmVzcywgb25SZXN0fSA9IHRoaXMucHJvcHMsXG4gICAgICAgIHhPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QubGVmdCAtIHRoaXMucHJvcHMuZHN0UmVjdC5sZWZ0IDogMCxcbiAgICAgICAgeU9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC50b3AgLSB0aGlzLnByb3BzLmRzdFJlY3QudG9wIDogMCxcbiAgICAgICAgeFJlc3RpbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgeEZlcnRpbGl6aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIGluaXRpYWwsIGZpbmFsO1xuXG4gICAgaWYgKCFnYW1ldGUgfHwgIWlkKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdub25lJykge1xuICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSKVxuICAgICAgICB4T2Zmc2V0ICs9IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YO1xuICAgICAgaW5pdGlhbCA9IHsgeDogeE9mZnNldCwgeTogeU9mZnNldCwgc2l6ZTogSU5JVElBTF9HQU1FVEVfU0laRSB9O1xuICAgICAgZmluYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSB9O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnByb3BzLmZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ2ZlcnRpbGl6aW5nJykge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIGZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgZmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogRklOQUxfWllHT1RFX1ksIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMC4wIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpZH0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e2luaXRpYWx9IGRpc3BsYXk9e2ZpbmFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfSBvblJlc3Q9e29uUmVzdH0gLz5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgR2FtZXRlUG9vbFZpZXcgPSAoe2dhbWV0ZXMsIGhpZGRlbkFsbGVsZXM9W10sIHdpZHRoPTMwMCwgaGVpZ2h0PTIwMCwgYW5pbVN0aWZmbmVzcz02MCwgc2VsZWN0ZWRJZCwgaXNHYW1ldGVEaXNhYmxlZCwgb25HYW1ldGVTZWxlY3RlZH0pID0+IHtcbiAgbGV0IGdhbWV0ZUNvdW50ID0gZ2FtZXRlcy5sZW5ndGgsXG4gICAgICBnYW1ldGVTaXplID0gMzAsXG4gICAgICBtYXJnaW4gPSA1LFxuICAgICAgc3BhY2luZ0RlZmF1bHQgPSBnYW1ldGVTaXplICsgMiAqIG1hcmdpbixcbiAgICAgIHhTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB5U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgY29sRGVmYXVsdCA9IE1hdGguZmxvb3Iod2lkdGggLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICByb3dEZWZhdWx0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICBlbmFibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZEZsYWdzID0gZ2FtZXRlcy5tYXAoZyA9PiBpc0dhbWV0ZURpc2FibGVkKGcpKSxcbiAgICAgIHRvdGFsRGlzYWJsZWRDb3VudCA9IGRpc2FibGVkRmxhZ3MucmVkdWNlKCh0b3RhbCxmbGFnKSA9PiB0b3RhbCArIGZsYWcsIDApLFxuICAgICAgLy8gbGVhdmUgcm9vbSBmb3IgdGhlIGRpc2FibGVkIGdhbWV0ZSByb3cgaWYgdGhlcmUgYXJlIGRpc2FibGVkIGdhbWV0ZXNcbiAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGhlaWdodCAtICh0b3RhbERpc2FibGVkQ291bnQgPyBzcGFjaW5nRGVmYXVsdCA6IDApIC0gNCAqIG1hcmdpbixcbiAgICAgIC8vIHBhY2sgdGhlIGRpc2FibGVkIGdhbWV0ZXMgaW50byB0aGUgZGlzYWJsZWQgcm93XG4gICAgICB4RGlzYWJsZWRTcGFjaW5nID0gTWF0aC5taW4oeFNwYWNpbmcgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aWR0aCAtIDcgKiBtYXJnaW4pIC8gdG90YWxEaXNhYmxlZENvdW50KSxcbiAgICAgIHlEaXNhYmxlZFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHRvdGFsRW5hYmxlZENvdW50ID0gZ2FtZXRlQ291bnQgLSB0b3RhbERpc2FibGVkQ291bnQsXG4gICAgICBnYW1ldGVWaWV3cztcblxuICAvLyBzcXVlZXplIGluIHRvIG1ha2Ugcm9vbSBmb3IgYWRkaXRpb25hbCBnYW1ldGVzIGlmIG5lY2Vzc2FyeVxuICB2YXIgY29sQ291bnQgPSBjb2xEZWZhdWx0LFxuICAgICAgcm93Q291bnQgPSByb3dEZWZhdWx0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA+IDApO1xuICB3aGlsZSAoY29sQ291bnQgKiByb3dDb3VudCA8IHRvdGFsRW5hYmxlZENvdW50KSB7XG4gICAgaWYgKHlTcGFjaW5nID4geFNwYWNpbmcpIHtcbiAgICAgIHlTcGFjaW5nID0gYXZhaWxhYmxlSGVpZ2h0IC8gKytyb3dDb3VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB4U3BhY2luZyA9ICh3aWR0aCAtIDQgKiBtYXJnaW4pIC8gKytjb2xDb3VudDtcbiAgICB9XG4gIH1cblxuICBnYW1ldGVWaWV3cyA9IGdhbWV0ZXMubWFwKChnYW1ldGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkRmxhZ3NbaW5kZXhdLFxuICAgICAgICAgIGxheW91dEluZGV4ID0gaXNEaXNhYmxlZCA/IGRpc2FibGVkQ291bnQrKyA6IGVuYWJsZWRDb3VudCsrLFxuICAgICAgICAgIHJvdyA9IGlzRGlzYWJsZWQgPyByb3dEZWZhdWx0IC0gMSA6IE1hdGguZmxvb3IobGF5b3V0SW5kZXggLyBjb2xDb3VudCksXG4gICAgICAgICAgY29sID0gaXNEaXNhYmxlZCA/IGxheW91dEluZGV4IDogbGF5b3V0SW5kZXggJSBjb2xDb3VudCxcbiAgICAgICAgICB5ID0gaXNEaXNhYmxlZCA/IHJvdyAqIHlEaXNhYmxlZFNwYWNpbmcgOiByb3cgKiB5U3BhY2luZyxcbiAgICAgICAgICB4ID0gaXNEaXNhYmxlZCA/IGNvbCAqIHhEaXNhYmxlZFNwYWNpbmcgOiBjb2wgKiB4U3BhY2luZztcbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2luZGV4ICsgMX0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh3aWR0aC8yKSwgeTogLU1hdGgucm91bmQoeVNwYWNpbmcpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpbmRleCArIDEgPT09IHNlbGVjdGVkSWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uR2FtZXRlU2VsZWN0ZWR9IC8+XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2FtZXRlLXBvb2xcIiBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH19PlxuICAgICAgeyBnYW1ldGVWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVQb29sVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBhbmltU3RpZmZuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBzZWxlY3RlZElkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpc0dhbWV0ZURpc2FibGVkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgb25HYW1ldGVTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVBvb2xWaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgZGlzcGxheSwgaXNTZWxlY3RlZD1mYWxzZSwgaXNEaXNhYmxlZD1mYWxzZSwgb25DbGlja30pID0+IHtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIHJlY3QgPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKCFpc0Rpc2FibGVkKSB7XG4gICAgICBvbkNsaWNrKGV2dCwgaWQsIHJlY3QpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpIHtcbiAgICBsZXQgdG9vbHRpcCA9IFwiXCIsXG4gICAgICAgIGFsbEhpZGRlbkFsbGVsZXM7XG4gICAgLy8gTm90ZTogaXQgd291bGQgYmUgbW9yZSBlZmZpY2llbnQgZm9yIHRoZSBjYWxsZXIgdG8gcGFzcyBpbiB0aGVcbiAgICAvLyBhbGxIaWRkZW5BbGxlbGVzIGFycmF5IHJhdGhlciB0aGFuIGNvbXB1dGluZyBpdCBlYWNoIHRpbWUgaGVyZS5cbiAgICAvLyBCdXQgaWYgd2UgbW92ZWQgaXQgb3V0IHJpZ2h0IG5vdyB3ZSdkIGhhdmUgdG8gZWxpbWluYXRlIHRoZSBFUzYgc3BsYXQuXG4gICAgZnVuY3Rpb24gY29uY2F0SGlkZGVuQWxsZWxlcyhpU3BlY2llcywgaUhpZGRlbkFsbGVsZXMpIHtcbiAgICAgIGFsbEhpZGRlbkFsbGVsZXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKGlTcGVjaWVzLCBhbGxlbGUpO1xuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzLnB1c2goLi4uZ2VuZS5hbGxlbGVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBjaCBpbiBnYW1ldGUpIHtcbiAgICAgIHZhciBjaHJvbW9zb21lID0gZ2FtZXRlW2NoXTtcbiAgICAgIGlmIChhbGxIaWRkZW5BbGxlbGVzID09IG51bGwpXG4gICAgICAgIGNvbmNhdEhpZGRlbkFsbGVsZXMoY2hyb21vc29tZS5zcGVjaWVzLCBoaWRkZW5BbGxlbGVzKTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIGNocm9tb3NvbWUuYWxsZWxlcykge1xuICAgICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPCAwKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBjaHJvbW9zb21lLnNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyBsYWJlbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoID09PSAnWFknKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY2hyb21vc29tZS5zaWRlID09PSAneScgPyAneScgOiAneCc7XG4gICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9vbHRpcDtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkQ2xhc3MgPSBpc1NlbGVjdGVkICYmICFpc0Rpc2FibGVkID8gXCJzZWxlY3RlZFwiIDogXCJcIixcbiAgICAgICAgZGlzYWJsZWRDbGFzcyA9IGlzRGlzYWJsZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiLFxuICAgICAgICBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGNsYXNzZXMgPSBgZ2VuaWJsb2NrcyBnYW1ldGUgJHtzZWxlY3RlZENsYXNzfSAke2Rpc2FibGVkQ2xhc3N9IGdyb3VwJHtncm91cH1gLFxuICAgICAgICBzaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICByb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICB0cmFuc2Zvcm0gPSByb3RhdGlvbiA/IGByb3RhdGUoJHtyb3RhdGlvbn1kZWcpYCA6ICcnLFxuICAgICAgICBvcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHRvb2x0aXAgPSBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gdGl0bGU9e3Rvb2x0aXB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkueCwgdG9wOiBkaXNwbGF5LnksXG4gICAgICAgICAgICB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgdHJhbnNmb3JtLCBvcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNwbGF5OiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgaXNTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlVmlldztcbiIsImNvbnN0IEdlbmVMYWJlbFZpZXcgPSAoe3NwZWNpZXMsIGFsbGVsZSwgZWRpdGFibGUsIG9uQWxsZWxlQ2hhbmdlfSkgPT4ge1xuICBpZiAoIWVkaXRhYmxlKSB7XG4gICAgbGV0IGFsbGVsZU5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUgbm9uZWRpdGFibGVcIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgeyBhbGxlbGVOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgYWxsZWxlcyA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYWxsZWxlKS5hbGxlbGVzLFxuICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgIGFsbGVsZU9wdGlvbnMgPSBhbGxlbGVOYW1lcy5tYXAoKG5hbWUsIGkpID0+ICg8b3B0aW9uIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZXNbaV19PntuYW1lfTwvb3B0aW9uPikpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlXCI+XG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBhbGxlbGUgfSBvbkNoYW5nZT17IG9uQWxsZWxlQ2hhbmdlIH0+XG4gICAgICAgICAgeyBhbGxlbGVPcHRpb25zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5HZW5lTGFiZWxWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBhbGxlbGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZWRpdGFibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5lTGFiZWxWaWV3O1xuIiwiaW1wb3J0IENocm9tb3NvbWVJbWFnZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lLWltYWdlJztcblxubGV0IGZpbHRlckFsbGVsZXMgPSBmdW5jdGlvbihhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBzcGVjaWVzKSB7XG4gICAgICBsZXQgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcCggYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgICAgIHJldHVybiBhbGxlbGVzLmZpbHRlciggYSA9PiB7XG4gICAgICAgIGxldCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKTtcbiAgICAgICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBUZXN0UHVsbGRvd25WaWV3ID0gKHtzcGVjaWVzLCBnZW5lLCBzZWxlY3Rpb24sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICAgICAgbGV0IGFsbGVsZXMgPSBnZW5lLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIG51bUFsbGVsZXMgPSBhbGxlbGVOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgcG9zc2libGVDb21ib3MgPSBbXSxcbiAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uIHx8IFwicGxhY2Vob2xkZXJcIixcbiAgICAgICAgICBpLCBqO1xuXG4gICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PVwicGxhY2Vob2xkZXJcIiB2YWx1ZT1cInBsYWNlaG9sZGVyXCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNlbGVjdCBhIEdlbm90eXBlPC9vcHRpb24+KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG51bUFsbGVsZXM7IGkrKykge1xuICAgICAgICBmb3IgKGogPSBpOyBqIDwgbnVtQWxsZWxlczsgaisrKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGkgKyBcIiBcIiArIGosXG4gICAgICAgICAgICAgIHN0cmluZyA9IGFsbGVsZU5hbWVzW2ldICsgXCIgLyBcIiArIGFsbGVsZU5hbWVzW2pdO1xuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2tleX0+e3N0cmluZ308L29wdGlvbj4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBjdXJyZW50U2VsZWN0aW9uIH0gb25DaGFuZ2U9eyBvblNlbGVjdGlvbkNoYW5nZSB9PlxuICAgICAgICAgIHsgcG9zc2libGVDb21ib3MgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICk7XG4gICAgfTtcblxuY29uc3QgR2Vub21lVGVzdFZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcz1bXSwgc2VsZWN0aW9uPXt9LCBzZWxlY3Rpb25DaGFuZ2VkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIGFsbGVsZXMgPSBjaHJvbVtPYmplY3Qua2V5cyhjaHJvbSlbMF1dLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBvcmcuc3BlY2llcyksXG4gICAgICAgIGdlbmVzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYSkpLFxuICAgICAgICBwdWxsZG93bnMgPSBnZW5lcy5tYXAoZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXN0UHVsbGRvd25WaWV3XG4gICAgICAgICAgICAgIGtleSAgICAgICA9IHsgZy5uYW1lIH1cbiAgICAgICAgICAgICAgc3BlY2llcyAgID0geyBvcmcuc3BlY2llcyB9XG4gICAgICAgICAgICAgIGdlbmUgICAgICA9IHsgZyB9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbiA9IHsgc2VsZWN0aW9uW2cubmFtZV0gfVxuICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZSA9IHsgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkKGcsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiIGtleT17Y2hyb21vc29tZU5hbWV9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbm9tZS10ZXN0LW9wdGlvbnNcIj5cbiAgICAgICAgICB7IHB1bGxkb3ducyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWUtdGVzdFwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuVGVzdFB1bGxkb3duVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZ2VuZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5HZW5vbWVUZXN0Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIHNlbGVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgc2VsZWN0aW9uQ2hhbmdlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVGVzdFZpZXc7XG4iLCJpbXBvcnQgQ2hyb21vc29tZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lJztcblxuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzID0gW10sIGFsbGVsZUNoYW5nZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBwYWlycy5wdXNoKFxuICAgICAgICA8Q2hyb21vc29tZVZpZXdcbiAgICAgICAgICBvcmc9e29yZ31cbiAgICAgICAgICBrZXk9e3BhaXJzLmxlbmd0aCArIDF9XG4gICAgICAgICAgY2hyb21vc29tZU5hbWU9e2Nocm9tb3NvbWVOYW1lfVxuICAgICAgICAgIHNpZGU9e3NpZGV9XG4gICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MH1cbiAgICAgICAgICBhbGxlbGVDaGFuZ2VkPXtmdW5jdGlvbihwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGtleT17cGFpcldyYXBwZXJzLmxlbmd0aCArIDF9PlxuICAgICAgICB7IHBhaXJzIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lXCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgYWxsZWxlQ2hhbmdlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVmlldztcbiIsImNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCB3aWR0aD0yMDAsIGluaXRpYWxTdHlsZT17fSwgZmluYWxTdHlsZT17fSwgb25SZXN0IH0pID0+IHtcbiAgbGV0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgIHVybCAgICAgPSBiYXNlVXJsKyBvcmcuZ2V0SW1hZ2VOYW1lKCksXG4gICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWxTdHlsZSAmJiAoaW5pdGlhbFN0eWxlLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWxTdHlsZS5vcGFjaXR5IDogMS4wKSxcbiAgICAgIGZpbmFsT3BhY2l0eSA9IGZpbmFsU3R5bGUgJiYgKGZpbmFsU3R5bGUub3BhY2l0eSAhPSBudWxsID8gZmluYWxTdHlsZS5vcGFjaXR5IDogMS4wKTtcblxuICAvKiBlc2xpbnQgcmVhY3QvZGlzcGxheS1uYW1lOjAgKi9cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RNb3Rpb24uTW90aW9uIGRlZmF1bHRTdHlsZT17eyBvcGFjaXR5OiBpbml0aWFsT3BhY2l0eSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsT3BhY2l0eSwgeyBzdGlmZm5lc3M6IDYwIH0pIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiBcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIiBzdHlsZT17aW50ZXJwb2xhdGVkU3R5bGV9PlxuICAgICAgICAgICAgPGltZyBzcmM9e3VybH0gd2lkdGg9e3dpZHRofS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5PcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxTdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgZmluYWxTdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgUGVuVmlldyA9ICh7b3Jncywgd2lkdGg9NDAwLCBjb2x1bW5zPTV9KSA9PiB7XG4gIGxldCBvcmdXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKChvcmcsIGluZGV4KSA9PiAoPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30ga2V5PXtpbmRleH0gd2lkdGg9e29yZ1dpZHRofS8+KSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgY29sdW1uczogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGJyZWVkaW5nIHN0YXRpc3RpY3MgZm9yIGEgc2V0IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXNcbiAqIEBwYXJhbSB7T2JqZWN0W119IG9yZ3MgLSBhcnJheSBvZiBCaW9sb2dpY2Egb3JnYW5pc21zIGZvciB3aGljaCBzdGF0aXN0aWNzIGFyZSB0byBiZSBkaXNwbGF5ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmdzW10ucGhlbm90eXBlIC0gdGhlIHBoZW5vdHlwZSBvZiB0aGUgQmlvbG9naWNhIG9yZ2FuaXNtXG4gKiBAcGFyYW0ge251bWJlcn0gW2xhc3RDbHV0Y2hTaXplPW9yZ3MubGVuZ3RoXSAtIHRoZSBudW1iZXIgb2Ygb3JnYW5pc21zIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IHRoYXQgY29tcHJpc2UgdGhlIG1vc3QgcmVjZW50IGNsdXRjaFxuICovXG5jb25zdCBTdGF0c1ZpZXcgPSAoe29yZ3MsIGxhc3RDbHV0Y2hTaXplfSkgPT4ge1xuXG4gIGxldCB0cmFpdHMgPSBuZXcgTWFwLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGlmIG5vIHNpemUgc3BlY2lmaWVkLCBhc3N1bWUgdGhlcmUncyBvbmx5IG9uZSBjbHV0Y2hcbiAgaWYgKCFsYXN0Q2x1dGNoU2l6ZSkgbGFzdENsdXRjaFNpemUgPSBvcmdzLmxlbmd0aDtcblxuICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gIGZvciAoY29uc3QgW2luZGV4LCBvcmddIG9mIG9yZ3MuZW50cmllcygpKSB7XG4gICAgY29uc3QgY2x1dGNoS2V5ID0gJ2MnICsgb3JnLnNleDtcbiAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIE9iamVjdC5rZXlzKG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSkge1xuICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgIHRyYWl0VmFsdWVzID0gdHJhaXRzLmdldCh0cmFpdCkgfHwgbmV3IE1hcCxcbiAgICAgICAgICB2YWx1ZUNvdW50cyA9IHRyYWl0VmFsdWVzLmdldCh2YWx1ZSkgfHwgbmV3IE1hcDtcbiAgICAgIGlmICghdHJhaXRzLmhhcyh0cmFpdCkpIHRyYWl0cy5zZXQodHJhaXQsIHRyYWl0VmFsdWVzKTtcbiAgICAgIGlmICghdHJhaXRWYWx1ZXMuaGFzKHZhbHVlKSkgdHJhaXRWYWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUNvdW50cyk7XG4gICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICBpZiAoaW5kZXggPj0gb3Jncy5sZW5ndGggLSBsYXN0Q2x1dGNoU2l6ZSlcbiAgICAgICAgdmFsdWVDb3VudHMuc2V0KGNsdXRjaEtleSwgKHZhbHVlQ291bnRzLmdldChjbHV0Y2hLZXkpIHx8IDApICsgMSk7XG4gICAgICB2YWx1ZUNvdW50cy5zZXQob3JnLnNleCwgKHZhbHVlQ291bnRzLmdldChvcmcuc2V4KSB8fCAwKSArIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgY0ZlbWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjVG90YWwgPSBjTWFsZXMgKyBjRmVtYWxlcyxcbiAgICAgICAgICAgIGNQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiBjVG90YWwgLyBsYXN0Q2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiB0VG90YWwgLyBvcmdzLmxlbmd0aCk7XG4gICAgICByb3dzLnB1c2goeyB0cmFpdCwgdHJhaXROdW0sIHZhbHVlLCBjTWFsZXMsIGNGZW1hbGVzLCBjVG90YWwsIGNQY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TWFsZXMsIHRGZW1hbGVzLCB0VG90YWwsIHRQY3QgfSk7XG4gICAgfVxuICAgICsrIHRyYWl0TnVtO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgc3RhdHNcIj5cbiAgICAgIDx0YWJsZSBpZD1cInN0YXRzLXRhYmxlXCIgY2xhc3NOYW1lPXtvcmdzLmxlbmd0aCA+IDAgPyBcImhhcy1kYXRhXCIgOiBcIm5vLWRhdGFcIn0+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+VHJhaXQgVmFsdWU8L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+Q2x1dGNoPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+VG90YWw8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7XG4gICAgICAgICAgcm93cy5tYXAoZnVuY3Rpb24ocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyIGtleT17aW5kZXh9IGNsYXNzTmFtZT17cm93LnRyYWl0TnVtICYgMSA/IFwib2RkLXRyYWl0XCIgOiBcImV2ZW4tdHJhaXRcIn0+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImxhYmVsXCI+e3Jvdy52YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1BjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY0ZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY01hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50UGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50RmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50TWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblN0YXRzVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGxhc3RDbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0c1ZpZXc7XG4iXX0=
