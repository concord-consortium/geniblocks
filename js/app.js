(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GeniBlocks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  AlleleFiltersView: require('./components/allele-filters'),
  OrganismView: require('./components/organism'),
  ChromosomeImageView: require('./components/chromosome-image'),
  ChromosomeView: require('./components/chromosome'),
  AlleleView: require('./components/allele'),
  GameteView: require('./components/gamete'),
  GametePoolView: require('./components/gamete-pool'),
  GeneLabelView: require('./components/gene-label'),
  GenomeView: require('./components/genome'),
  GenomeTestView: require('./components/genome-test'),
  PenView: require('./components/pen'),
  StatsView: require('./components/stats')
};
module.exports = exports['default'];

},{"./components/allele":3,"./components/allele-filters":2,"./components/chromosome":5,"./components/chromosome-image":4,"./components/gamete":7,"./components/gamete-pool":6,"./components/gene-label":8,"./components/genome":10,"./components/genome-test":9,"./components/organism":11,"./components/pen":12,"./components/stats":13}],2:[function(require,module,exports){
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
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
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

exports["default"] = AlleleFiltersView;
module.exports = exports["default"];

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

exports["default"] = AlleleView;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
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

exports["default"] = ChromosomeImageView;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var ChromosomeImageView = require('./chromosome-image'),
    GeneLabelView = require('./gene-label'),
    filterAlleles = function filterAlleles(alleles, hiddenAlleles, species) {
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
    return React.createElement(GeneLabelView, { key: a, species: org.species, allele: a, editable: true,
      onAlleleChange: function (event) {
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
      React.createElement(ChromosomeImageView, null),
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

exports['default'] = ChromosomeView;
module.exports = exports['default'];

},{"./chromosome-image":4,"./gene-label":8}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameteView = require('./gamete');

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
    return React.createElement(GameteView, { gamete: gamete,
      hiddenAlleles: hiddenAlleles,
      location: { initial: { x: Math.round(width / 2), y: -Math.round(ySpacing) },
        final: { x: Math.round(x), y: Math.round(y) } },
      key: index, id: index + 1,
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

exports["default"] = GametePoolView;
module.exports = exports["default"];

},{"./gamete":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var GameteView = function GameteView(_ref) {
  var gamete = _ref.gamete;
  var id = _ref.id;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var location = _ref.location;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 60 : _ref$animStiffness;
  var _ref$isSelected = _ref.isSelected;
  var isSelected = _ref$isSelected === undefined ? false : _ref$isSelected;
  var _ref$isDisabled = _ref.isDisabled;
  var isDisabled = _ref$isDisabled === undefined ? false : _ref$isDisabled;
  var onClick = _ref.onClick;
  var onRest = _ref.onRest;

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
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
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
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
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
      initial = location.initial || location.final,
      initialSize = initial.size || 30,
      initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
      initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
      final = location.final,
      finalSize = final.size || 30,
      finalRotation = final.rotation != null ? final.rotation : rotationForGroup,
      finalOpacity = final.opacity != null ? final.opacity : 1.0,
      springConfig = { stiffness: animStiffness },
      tooltip = buildTooltipForGamete(gamete);
  /* eslint react/display-name:0 */
  return React.createElement(
    ReactMotion.Motion,
    { defaultStyle: { left: initial.x, top: initial.y,
        width: initialSize, height: initialSize,
        rotation: initialRotation,
        opacity: initialOpacity },
      style: { left: ReactMotion.spring(final.x, springConfig),
        top: ReactMotion.spring(final.y, springConfig),
        width: ReactMotion.spring(finalSize, springConfig),
        height: ReactMotion.spring(finalSize, springConfig),
        rotation: ReactMotion.spring(finalRotation, springConfig),
        opacity: ReactMotion.spring(finalOpacity, springConfig) },
      onRest: onRest },
    function (interpolatedStyle) {
      var rotation = interpolatedStyle.rotation;

      var style = _objectWithoutProperties(interpolatedStyle, ['rotation']);

      style.transform = 'rotate(' + rotation + 'deg)';
      return React.createElement('div', { className: classes, title: tooltip, style: style, onClick: handleClick });
    }
  );
};

GameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  id: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  animStiffness: React.PropTypes.number,
  isSelected: React.PropTypes.bool,
  isDisabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onRest: React.PropTypes.func
};

exports['default'] = GameteView;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    var _ret = (function () {
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
    })();

    if (typeof _ret === "object") return _ret.v;
  }
};

GeneLabelView.propTypes = {
  species: React.PropTypes.object.isRequired,
  allele: React.PropTypes.string.isRequired,
  editable: React.PropTypes.bool.isRequired,
  onAlleleChange: React.PropTypes.func.isRequired
};

exports["default"] = GeneLabelView;
module.exports = exports["default"];

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ChromosomeImageView = require('./chromosome-image'),
    filterAlleles = function filterAlleles(alleles, hiddenAlleles, species) {
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
          onSelectionChange: function (event) {
            selectionChanged(g, event.target.value);
          }
        });
      });

      pairWrappers.push(React.createElement(
        "div",
        { className: "items" },
        React.createElement(ChromosomeImageView, null),
        React.createElement(ChromosomeImageView, null),
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
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
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

exports["default"] = GenomeTestView;
module.exports = exports["default"];

},{"./chromosome-image":4}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ChromosomeView = require('./chromosome');

var GenomeView = function GenomeView(_ref) {
  var org = _ref.org;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var alleleChanged = _ref.alleleChanged;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function () {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          pairs = [];

      var _loop2 = function (side) {
        pairs.push(React.createElement(ChromosomeView, {
          org: org,
          key: pairs.length + 1,
          chromosomeName: chromosomeName,
          side: side,
          hiddenAlleles: hiddenAlleles,
          labelsOnRight: pairs.length > 0,
          alleleChanged: function (prevAllele, newAllele) {
            alleleChanged(chromosomeName, side, prevAllele, newAllele);
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
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
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

exports["default"] = GenomeView;
module.exports = exports["default"];

},{"./chromosome":5}],11:[function(require,module,exports){
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

exports["default"] = OrganismView;
module.exports = exports["default"];

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OrganismView = require('./organism');

var PenView = function PenView(_ref) {
  var orgs = _ref.orgs;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 400 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 5 : _ref$columns;

  var orgWidth = width / columns,
      orgViews = orgs.map(function (org, index) {
    return React.createElement(OrganismView, { org: org, key: index, width: orgWidth });
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

exports["default"] = PenView;
module.exports = exports["default"];

},{"./organism":11}],13:[function(require,module,exports){
/**
 * Stateless functional React component for displaying breeding statistics for a set of Biologica organisms
 * @param {Object[]} orgs - array of Biologica organisms for which statistics are to be displayed
 * @param {Object} orgs[].phenotype - the phenotype of the Biologica organism
 * @param {number} [lastClutchSize=orgs.length] - the number of organisms at the end of the array that comprise the most recent clutch
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

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
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
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
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
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
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
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
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
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

exports['default'] = StatsView;
module.exports = exports['default'];

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9hcHAuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUtaW1hZ2UuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS1wb29sLmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2dlbmUtbGFiZWwuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS10ZXN0LmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL29yZ2FuaXNtLmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7cUJDQ2dCO0FBQ2QsbUJBQWlCLEVBQUUsT0FBTyxDQUFDLDZCQUE2QixDQUFDO0FBQ3pELGNBQVksRUFBRSxPQUFPLENBQUMsdUJBQXVCLENBQUM7QUFDOUMscUJBQW1CLEVBQUUsT0FBTyxDQUFDLCtCQUErQixDQUFDO0FBQzdELGdCQUFjLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQ2xELFlBQVUsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFDMUMsWUFBVSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztBQUMxQyxnQkFBYyxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQztBQUNuRCxlQUFhLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQ2pELFlBQVUsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFDMUMsZ0JBQWMsRUFBRSxPQUFPLENBQUMsMEJBQTBCLENBQUM7QUFDbkQsU0FBTyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUNwQyxXQUFTLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0NBQ3pDOzs7Ozs7Ozs7QUNkRCxJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLElBQWlFLEVBQUs7TUFBckUsT0FBTyxHQUFSLElBQWlFLENBQWhFLE9BQU87MkJBQVIsSUFBaUUsQ0FBdkQsYUFBYTtNQUFiLGFBQWEsc0NBQUMsRUFBRTs2QkFBMUIsSUFBaUUsQ0FBckMsZUFBZTtNQUFmLGVB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QVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDeEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDeEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDekcsOEJBQU0sTUFBTSxFQUFFLEFBQUMsS0FBSyxHQUFDLE1BQU0sSUFBRyxNQUFNLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQUFBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEFBQUMsRUFBQyxDQUFDLEVBQUUsTUFBTSxHQUFDLENBQUMsQUFBQyxFQUFDLENBQUMsRUFBQyxHQUFHLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBRSxLQUFLLEFBQUMsR0FBRTtNQUN6SCw4QkFBTSxNQUFNLEVBQUUsQUFBQyxNQUFNLEdBQUMsTUFBTSxJQUFHLEtBQUssR0FBQyxNQUFNLENBQUEsQUFBQyxBQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxFQUFDLENBQUMsRUFBRSxLQUFLLEdBQUMsTUFBTSxBQUFDLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxXQUFXLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsSUFBSSxFQUFFLEtBQUssQUFBQyxHQUFFO01BQ2xJLDhCQUFNLEVBQUUsRUFBRSxNQUFNLEdBQUMsQ0FBQyxBQUFDLEVBQUssRUFBRSxFQUFDLEdBQUcsRUFBTyxFQUFFLEVBQUUsS0FBSyxHQUFDLE1BQU0sR0FBQyxDQUFDLEFBQUMsRUFBRSxFQUFFLEVBQUMsR0FBRyxFQUFPLGFBQWEsRUFBQyxNQUFNLEVBQUMsY0FBYyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsSUFBSSxFQUFDLE1BQU0sR0FBRTtNQUNoSyw4QkFBTSxFQUFFLEVBQUUsTUFBTSxHQUFDLENBQUMsQUFBQyxFQUFLLEVBQUUsRUFBRSxLQUFLLEdBQUMsQ0FBQyxBQUFDLEVBQUMsRUFBRSxFQUFFLEtBQUssR0FBQyxNQUFNLEdBQUMsQ0FBQyxBQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssR0FBQyxDQUFDLEFBQUMsRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxNQUFNLEdBQUU7TUFDaEssOEJBQU0sRUFBRSxFQUFFLEtBQUssR0FBQyxNQUFNLEFBQUMsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFPLEVBQUUsRUFBRSxNQUFNLEdBQUMsTUFBTSxBQUFDLEVBQUcsRUFBRSxFQUFDLEdBQUcsRUFBTyxhQUFhLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxNQUFNLEdBQUU7TUFDaEssOEJBQU0sRUFBRSxFQUFFLEtBQUssR0FBQyxNQUFNLEFBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxHQUFDLENBQUMsQUFBQyxFQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUMsTUFBTSxBQUFDLEVBQUcsRUFBRSxFQUFFLEtBQUssR0FBQyxDQUFDLEFBQUMsRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxNQUFNLEdBQUU7S0FDOUo7R0FDQSxDQUNOO0NBQ0gsQ0FBQzs7cUJBRWEsbUJBQW1COzs7Ozs7Ozs7QUM1QmxDLElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0lBQ25ELGFBQWEsR0FBUyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBRTdDLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUU7QUFDeEQsTUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7V0FBSSxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0FBQzFGLFNBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsRUFBSTtBQUMxQixRQUFJLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsV0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0dBQ3pDLENBQUMsQ0FBQztDQUNKLENBQUM7O0FBRU4sSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLElBQWdGLEVBQUs7TUFBcEYsR0FBRyxHQUFKLElBQWdGLENBQS9FLEdBQUc7TUFBRSxjQUFjLEdBQXBCLElBQWdGLENBQTFFLGNBQWM7TUFBRSxJQUFJLEdBQTFCLElBQWdGLENBQTFELElBQUk7MkJBQTFCLElBQWdGLENBQXBELGFBQWE7TUFBYixhQUFhLHNDQUFDLEVBQUU7TUFBRSxhQUFhLEdBQTNELElBQWdGLENBQWxDLGFBQWE7MkJBQTNELElBQWdGLENBQW5CLGFBQWE7TUFBYixhQUFhLHNDQUFDLElBQUk7O0FBQ3JHLE1BQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTztNQUNyRSxjQUFjLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQztNQUNuRSxNQUFNLEdBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUNoQyxXQUNFLG9CQUFDLGFBQWEsSUFBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEFBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQUFBQztBQUN2RSxvQkFBYyxFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQzlCLHFCQUFhLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdEMsQUFBQyxHQUFFLENBQ0o7R0FDSCxDQUFDO01BRUYsY0FBYyxHQUFHLE9BQU8sQ0FBQzs7QUFFN0IsTUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNsQixrQkFBYyxJQUFJLE1BQU0sQ0FBQztHQUMxQjs7QUFFRCxTQUNFOztNQUFLLFNBQVMsRUFBQyxpQ0FBaUM7SUFDOUM7O1FBQUssU0FBUyxFQUFHLGNBQWMsQUFBRTtNQUMvQixvQkFBQyxtQkFBbUIsT0FBRztNQUN2Qjs7VUFBSyxTQUFTLEVBQUMsUUFBUTtRQUNuQixNQUFNO09BQ0o7S0FDRjtHQUNGLENBQ047Q0FDSCxDQUFDOztBQUVGLGNBQWMsQ0FBQyxTQUFTLEdBQUc7QUFDekIsS0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDdEMsZ0JBQWMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ2pELE1BQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3ZDLGVBQWEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUs7QUFDcEMsZUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDOUMsZUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtDQUNwQyxDQUFDOztxQkFFYSxjQUFjOzs7Ozs7Ozs7QUNsRDdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFdkMsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLElBQW9ILEVBQUs7TUFBeEgsT0FBTyxHQUFSLElBQW9ILENBQW5ILE9BQU87MkJBQVIsSUFBb0gsQ0FBMUcsYUFBYTtNQUFiLGFBQWEsc0NBQUMsRUFBRTttQkFBMUIsSUFBb0gsQ0FBeEYsS0FBSztNQUFMLEtBQUssOEJBQUMsR0FBRztvQkFBckMsSUFBb0gsQ0FBN0UsTUFBTTtNQUFOLE1BQU0sK0JBQUMsR0FBRzsyQkFBakQsSUFBb0gsQ0FBakUsYUFBYTtNQUFiLGFBQWEsc0NBQUMsRUFBRTtNQUFFLFVBQVUsR0FBL0UsSUFBb0gsQ0FBL0MsVUFBVTtNQUFFLGdCQUFnQixHQUFqRyxJQUFvSCxDQUFuQyxnQkFBZ0I7TUFBRSxnQkFBZ0IsR0FBbkgsSUFBb0gsQ0FBakIsZ0JBQWdCOztBQUN6SSxNQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTTtNQUM1QixVQUFVLEdBQUcsRUFBRTtNQUNmLE1BQU0sR0FBRyxDQUFDO01BQ1YsY0FBYyxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsTUFBTTtNQUN4QyxRQUFRLEdBQUcsY0FBYztNQUN6QixRQUFRLEdBQUcsY0FBYztNQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDO01BQy9DLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7TUFDaEQsWUFBWSxHQUFHLENBQUM7TUFDaEIsYUFBYSxHQUFHLENBQUM7TUFDakIsYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1dBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBQztNQUNyRCxrQkFBa0IsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFDLElBQUk7V0FBSyxLQUFLLEdBQUcsSUFBSTtHQUFBLEVBQUUsQ0FBQyxDQUFDOzs7QUFFMUUsaUJBQWUsR0FBRyxNQUFNLElBQUksa0JBQWtCLEdBQUcsY0FBYyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU07OztBQUVqRixrQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQ1osQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQSxHQUFJLGtCQUFrQixDQUFDO01BQ3RFLGdCQUFnQixHQUFHLGNBQWM7TUFDakMsaUJBQWlCLEdBQUcsV0FBVyxHQUFHLGtCQUFrQjtNQUNwRCxXQUFXLFlBQUEsQ0FBQzs7O0FBR2hCLE1BQUksUUFBUSxHQUFHLFVBQVU7TUFDckIsUUFBUSxHQUFHLFVBQVUsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3JELFNBQU8sUUFBUSxHQUFHLFFBQVEsR0FBRyxpQkFBaUIsRUFBRTtBQUM5QyxRQUFJLFFBQVEsR0FBRyxRQUFRLEVBQUU7QUFDdkIsY0FBUSxHQUFHLGVBQWUsR0FBRyxFQUFFLFFBQVEsQ0FBQztLQUN6QyxNQUNJO0FBQ0gsY0FBUSxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUEsR0FBSSxFQUFFLFFBQVEsQ0FBQztLQUM5QztHQUNGOztBQUVELGFBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUssRUFBSztBQUMzQyxRQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQ2pDLFdBQVcsR0FBRyxVQUFVLEdBQUcsYUFBYSxFQUFFLEdBQUcsWUFBWSxFQUFFO1FBQzNELEdBQUcsR0FBRyxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDdEUsR0FBRyxHQUFHLFVBQVUsR0FBRyxXQUFXLEdBQUcsV0FBVyxHQUFHLFFBQVE7UUFDdkQsQ0FBQyxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLFFBQVE7UUFDeEQsQ0FBQyxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUMvRCxXQUNFLG9CQUFDLFVBQVUsSUFBQyxNQUFNLEVBQUUsTUFBTSxBQUFDO0FBQ2YsbUJBQWEsRUFBRSxhQUFhLEFBQUM7QUFDN0IsY0FBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDN0QsYUFBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxBQUFDO0FBQzVELFNBQUcsRUFBRSxLQUFLLEFBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsQUFBQztBQUMxQixtQkFBYSxFQUFFLGFBQWEsQUFBQztBQUM3QixnQkFBVSxFQUFFLEtBQUssR0FBRyxDQUFDLEtBQUssVUFBVSxBQUFDO0FBQ3JDLGdCQUFVLEVBQUUsVUFBVSxBQUFDO0FBQ3ZCLGFBQU8sRUFBRSxnQkFBZ0IsQUFBQyxHQUFHLENBQ3pDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILFNBQ0U7O01BQUssU0FBUyxFQUFDLHdCQUF3QixFQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxBQUFDO0lBQzVFLFdBQVc7R0FDVCxDQUNOO0NBQ0gsQ0FBQzs7QUFFRixjQUFjLENBQUMsU0FBUyxHQUFHO0FBQ3pCLFNBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVU7QUFDbkUsZUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQzlELE9BQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDN0IsUUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUM5QixlQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQ3JDLFlBQVUsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDbEMsa0JBQWdCLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ3RDLGtCQUFnQixFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtDQUN2QyxDQUFDOztxQkFFYSxjQUFjOzs7Ozs7Ozs7Ozs7OztBQzFFN0IsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksSUFBK0csRUFBSztNQUFuSCxNQUFNLEdBQVAsSUFBK0csQ0FBOUcsTUFBTTtNQUFFLEVBQUUsR0FBWCxJQUErRyxDQUF0RyxFQUFFOzJCQUFYLElBQStHLENBQWxHLGFBQWE7TUFBYixhQUFhLHNDQUFDLEVBQUU7TUFBRSxRQUFRLEdBQXZDLElBQStHLENBQWhGLFFBQVE7MkJBQXZDLElBQStHLENBQXRFLGFBQWE7TUFBYixhQUFhLHNDQUFDLEVBQUU7d0JBQXpELElBQStHLENBQXBELFVBQVU7TUFBVixVQUFVLG1DQUFDLEtBQUs7d0JBQTNFLElBQStHLENBQWxDLFVBQVU7TUFBVixVQUFVLG1DQUFDLEtBQUs7TUFBRSxPQUFPLEdBQXRHLElBQStHLENBQWhCLE9BQU87TUFBRSxNQUFNLEdBQTlHLElBQStHLENBQVAsTUFBTTs7QUFFaEksV0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3hCLFFBQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNO1FBQ2hCLElBQUksR0FBRyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN6QyxRQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsYUFBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDeEI7R0FDRjs7QUFFRCxXQUFTLHFCQUFxQixDQUFDLE1BQU0sRUFBRTtBQUNyQyxRQUFJLE9BQU8sR0FBRyxFQUFFO1FBQ1osZ0JBQWdCLFlBQUEsQ0FBQzs7OztBQUlyQixhQUFTLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUU7QUFDckQsc0JBQWdCLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDdEIsNkJBQXFCLGNBQWMsOEhBQUU7OztjQUExQixNQUFNOztBQUNmLGNBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSwrQkFBQSxnQkFBZ0IsRUFBQyxJQUFJLE1BQUEsdUNBQUksSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDO1NBQ3hDOzs7Ozs7Ozs7Ozs7Ozs7S0FDRjtBQUNELFNBQUssSUFBTSxFQUFFLElBQUksTUFBTSxFQUFFO0FBQ3ZCLFVBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM1QixVQUFJLGdCQUFnQixJQUFJLElBQUksRUFDMUIsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQzs7Ozs7O0FBQ3pELDhCQUFxQixVQUFVLENBQUMsT0FBTyxtSUFBRTtjQUE5QixNQUFNOztBQUNmLGNBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN4QyxnQkFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEQsbUJBQU8sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7V0FDdEQ7U0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELFVBQUksRUFBRSxLQUFLLElBQUksRUFBRTtBQUNmLFlBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDbEQsZUFBTyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztPQUN0RDtLQUNGO0FBQ0QsV0FBTyxPQUFPLENBQUM7R0FDaEI7O0FBRUQsTUFBTSxhQUFhLEdBQUcsVUFBVSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQzNELGFBQWEsR0FBRyxVQUFVLEdBQUcsVUFBVSxHQUFHLEVBQUU7TUFDNUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ2QsZ0JBQWdCLEdBQUcsS0FBSyxHQUFHLEVBQUU7TUFDN0IsT0FBTywwQkFBd0IsYUFBYSxTQUFJLGFBQWEsY0FBUyxLQUFLLEFBQUU7TUFDN0UsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLEtBQUs7TUFDNUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRTtNQUNoQyxlQUFlLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxnQkFBZ0I7TUFDaEYsY0FBYyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRztNQUNoRSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUs7TUFDdEIsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRTtNQUM1QixhQUFhLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxnQkFBZ0I7TUFDMUUsWUFBWSxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRztNQUMxRCxZQUFZLEdBQUcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFO01BQzNDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFOUMsU0FDRTtBQUFDLGVBQVcsQ0FBQyxNQUFNO01BQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLGFBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVc7QUFDdkMsZ0JBQVEsRUFBRSxlQUFlO0FBQ3pCLGVBQU8sRUFBRSxjQUFjLEVBQUUsQUFBQztBQUMxQyxXQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztBQUMvQyxXQUFHLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztBQUM5QyxhQUFLLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0FBQ2xELGNBQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7QUFDbkQsZ0JBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUM7QUFDekQsZUFBTyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxFQUFFLEFBQUM7QUFDbEUsWUFBTSxFQUFFLE1BQU0sQUFBQztJQUUvQixVQUFBLGlCQUFpQixFQUFJO1VBQ2IsUUFBUSxHQUFlLGlCQUFpQixDQUF4QyxRQUFROztVQUFLLEtBQUssNEJBQUssaUJBQWlCOztBQUM5QyxXQUFLLENBQUMsU0FBUyxlQUFhLFFBQVEsU0FBTSxDQUFDO0FBQzNDLGFBQ0UsNkJBQUssU0FBUyxFQUFFLE9BQU8sQUFBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEFBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsQUFBQyxHQUN0RSxDQUNOO0tBQ0g7R0FFZ0IsQ0FDckI7Q0FDSCxDQUFDOztBQUVGLFVBQVUsQ0FBQyxTQUFTLEdBQUc7QUFDckIsUUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDekMsZUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQzlELElBQUUsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3JDLFVBQVEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQzNDLGVBQWEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDckMsWUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtBQUNoQyxZQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0FBQ2hDLFNBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7QUFDN0IsUUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtDQUM3QixDQUFDOztxQkFFYSxVQUFVOzs7Ozs7Ozs7QUMvRnpCLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxJQUEyQyxFQUFLO01BQS9DLE9BQU8sR0FBUixJQUEyQyxDQUExQyxPQUFPO01BQUUsTUFBTSxHQUFoQixJQUEyQyxDQUFqQyxNQUFNO01BQUUsUUFBUSxHQUExQixJQUEyQyxDQUF6QixRQUFRO01BQUUsY0FBYyxHQUExQyxJQUEyQyxDQUFmLGNBQWM7O0FBQy9ELE1BQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixRQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELFdBQ0U7O1FBQUssU0FBUyxFQUFDLCtCQUErQjtNQUM1Qzs7O1FBQ0ksVUFBVTtPQUNQO0tBQ0gsQ0FDTjtHQUNILE1BQU07O0FBQ0wsVUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU87VUFDckUsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDO1VBQ3pELGFBQWEsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUM7ZUFBTTs7WUFBUSxHQUFHLEVBQUUsSUFBSSxBQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQUFBQztVQUFFLElBQUk7U0FBVTtPQUFDLENBQUMsQ0FBQztBQUMxRztXQUNFOztZQUFLLFNBQVMsRUFBQyxtQkFBbUI7VUFDaEM7O2NBQVEsS0FBSyxFQUFHLE1BQU0sQUFBRSxFQUFDLFFBQVEsRUFBRyxjQUFjLEFBQUU7WUFDaEQsYUFBYTtXQUNSO1NBQ0w7UUFDTjs7OztHQUNIO0NBQ0YsQ0FBQzs7QUFFRixhQUFhLENBQUMsU0FBUyxHQUFHO0FBQ3hCLFNBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQzFDLFFBQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3pDLFVBQVEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVO0FBQ3pDLGdCQUFjLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVTtDQUNoRCxDQUFDOztxQkFFYSxhQUFhOzs7Ozs7Ozs7QUMvQjVCLElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0lBQ25ELGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUU7QUFDeEQsTUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBRSxVQUFBLENBQUM7V0FBSSxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0FBQzFGLFNBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBRSxVQUFBLENBQUMsRUFBSTtBQUMxQixRQUFJLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsV0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0dBQ3pDLENBQUMsQ0FBQztDQUNKO0lBQ0QsZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksSUFBNkMsRUFBSztNQUFqRCxPQUFPLEdBQVIsSUFBNkMsQ0FBNUMsT0FBTztNQUFFLElBQUksR0FBZCxJQUE2QyxDQUFuQyxJQUFJO01BQUUsU0FBUyxHQUF6QixJQUE2QyxDQUE3QixTQUFTO01BQUUsaUJBQWlCLEdBQTVDLElBQTZDLENBQWxCLGlCQUFpQjs7QUFDOUQsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87TUFDdEIsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1dBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDO01BQ3pELFVBQVUsR0FBRyxXQUFXLENBQUMsTUFBTTtNQUMvQixjQUFjLEdBQUcsRUFBRTtNQUNuQixnQkFBZ0IsR0FBRyxTQUFTLElBQUksYUFBYTtNQUM3QyxDQUFDLFlBQUE7TUFBRSxDQUFDLFlBQUEsQ0FBQzs7QUFFVCxnQkFBYyxDQUFDLElBQUksQ0FBQzs7TUFBUSxHQUFHLEVBQUMsYUFBYSxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMsUUFBUSxFQUFDLFVBQVU7O0dBQTJCLENBQUMsQ0FBQzs7QUFFbEgsT0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsU0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsVUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1VBQ2pCLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxvQkFBYyxDQUFDLElBQUksQ0FBQzs7VUFBUSxHQUFHLEVBQUUsR0FBRyxBQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsQUFBQztRQUFFLE1BQU07T0FBVSxDQUFDLENBQUM7S0FDdEU7R0FDRjs7QUFFRCxTQUNFOztNQUFRLEtBQUssRUFBRyxnQkFBZ0IsQUFBRSxFQUFDLFFBQVEsRUFBRyxpQkFBaUIsQUFBRTtJQUM3RCxjQUFjO0dBQ1QsQ0FDVDtDQUNILENBQUM7O0FBRU4sSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLEtBQXVELEVBQUs7TUFBM0QsR0FBRyxHQUFKLEtBQXVELENBQXRELEdBQUc7NEJBQUosS0FBdUQsQ0FBakQsYUFBYTtNQUFiLGFBQWEsdUNBQUMsRUFBRTt3QkFBdEIsS0FBdUQsQ0FBL0IsU0FBUztNQUFULFNBQVMsbUNBQUMsRUFBRTtNQUFFLGdCQUFnQixHQUF0RCxLQUF1RCxDQUFqQixnQkFBZ0I7O0FBQzVFLE1BQUksWUFBWSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBQ3RCLHlCQUEyQixHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsOEhBQUU7VUFBL0MsY0FBYzs7QUFDckIsVUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQztVQUN6RCxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1VBQzlDLGNBQWMsR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQ25FLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztlQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO09BQUEsQ0FBQztVQUNuRixTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUN6QixlQUNFLG9CQUFDLGdCQUFnQjtBQUNmLGFBQUcsRUFBVyxDQUFDLENBQUMsSUFBSSxBQUFFO0FBQ3RCLGlCQUFPLEVBQU8sR0FBRyxDQUFDLE9BQU8sQUFBRTtBQUMzQixjQUFJLEVBQVUsQ0FBQyxBQUFFO0FBQ2pCLG1CQUFTLEVBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQUFBRTtBQUNqQywyQkFBaUIsRUFBSyxVQUFTLEtBQUssRUFBRTtBQUNwQyw0QkFBZ0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUN6QyxBQUFFO1VBQ0gsQ0FDRjtPQUNILENBQUMsQ0FBQzs7QUFFUCxrQkFBWSxDQUFDLElBQUksQ0FDZjs7VUFBSyxTQUFTLEVBQUMsT0FBTztRQUNwQixvQkFBQyxtQkFBbUIsT0FBRztRQUN2QixvQkFBQyxtQkFBbUIsT0FBRztRQUN2Qjs7WUFBSyxTQUFTLEVBQUMscUJBQXFCO1VBQ2hDLFNBQVM7U0FDUDtPQUNGLENBQ1AsQ0FBQztLQUNIOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsU0FDRTs7TUFBSyxTQUFTLEVBQUMsd0JBQXdCO0lBQ25DLFlBQVk7R0FDVixDQUNOO0NBQ0gsQ0FBQzs7QUFFRixnQkFBZ0IsQ0FBQyxTQUFTLEdBQUc7QUFDM0IsU0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDMUMsTUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDdkMsV0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNqQyxtQkFBaUIsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVO0NBQ25ELENBQUM7O0FBRUYsY0FBYyxDQUFDLFNBQVMsR0FBRztBQUN6QixLQUFHLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN0QyxlQUFhLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLO0FBQ3BDLFdBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDakMsa0JBQWdCLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVTtDQUNsRCxDQUFDOztxQkFFYSxjQUFjOzs7Ozs7Ozs7QUNyRjdCLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFN0MsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksSUFBd0MsRUFBSztNQUE1QyxHQUFHLEdBQUosSUFBd0MsQ0FBdkMsR0FBRzsyQkFBSixJQUF3QyxDQUFsQyxhQUFhO01BQWIsYUFBYSxzQ0FBRyxFQUFFO01BQUUsYUFBYSxHQUF2QyxJQUF3QyxDQUFkLGFBQWE7O0FBQ3pELE1BQUksWUFBWSxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztVQUNiLGNBQWM7O0FBQ3JCLFVBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUM7VUFDekQsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7NkJBQ04sSUFBSTtBQUNYLGFBQUssQ0FBQyxJQUFJLENBQ1Isb0JBQUMsY0FBYztBQUNiLGFBQUcsRUFBRSxHQUFHLEFBQUM7QUFDVCxhQUFHLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEFBQUM7QUFDdEIsd0JBQWMsRUFBRSxjQUFjLEFBQUM7QUFDL0IsY0FBSSxFQUFFLElBQUksQUFBQztBQUNYLHVCQUFhLEVBQUUsYUFBYSxBQUFDO0FBQzdCLHVCQUFhLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLEFBQUM7QUFDOUIsdUJBQWEsRUFBRSxVQUFTLFVBQVUsRUFBRSxTQUFTLEVBQUU7QUFDN0MseUJBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztXQUM1RCxBQUFDLEdBQUUsQ0FDUCxDQUFDOzs7QUFaSixXQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtlQUFmLElBQUk7T0FhWjtBQUNELGtCQUFZLENBQUMsSUFBSSxDQUNmOztVQUFLLEdBQUcsRUFBRSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQUFBQztRQUM5QixLQUFLO09BQ0gsQ0FDUCxDQUFDOzs7QUFyQkoseUJBQTJCLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSw4SEFBRTs7S0FzQnZEOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsU0FDRTs7TUFBSyxTQUFTLEVBQUMsbUJBQW1CO0lBQzlCLFlBQVk7R0FDVixDQUNOO0NBQ0gsQ0FBQzs7QUFFRixVQUFVLENBQUMsU0FBUyxHQUFHO0FBQ3JCLEtBQUcsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3RDLGVBQWEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUs7QUFDcEMsZUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7Q0FDL0MsQ0FBQzs7cUJBRWEsVUFBVTs7Ozs7Ozs7O0FDeEN6QixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxJQUF5RCxFQUFLO01BQTdELEdBQUcsR0FBSixJQUF5RCxDQUF4RCxHQUFHO21CQUFKLElBQXlELENBQW5ELEtBQUs7TUFBTCxLQUFLLDhCQUFDLEdBQUc7MEJBQWYsSUFBeUQsQ0FBeEMsWUFBWTtNQUFaLFlBQVkscUNBQUMsRUFBRTt3QkFBaEMsSUFBeUQsQ0FBdkIsVUFBVTtNQUFWLFVBQVUsbUNBQUMsRUFBRTtNQUFFLE1BQU0sR0FBdkQsSUFBeUQsQ0FBUixNQUFNOztBQUMzRSxNQUFJLE9BQU8sR0FBRyxrRUFBa0U7TUFDNUUsR0FBRyxHQUFPLE9BQU8sR0FBRSxHQUFHLENBQUMsWUFBWSxFQUFFO01BQ3JDLGNBQWMsR0FBRyxZQUFZLEtBQUssWUFBWSxDQUFDLE9BQU8sSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUEsQUFBQztNQUM1RixZQUFZLEdBQUcsVUFBVSxLQUFLLFVBQVUsQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQzs7O0FBR3pGLFNBQ0U7QUFBQyxlQUFXLENBQUMsTUFBTTtNQUFDLFlBQVksRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQUFBQztBQUMxQyxXQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxBQUFDO0FBQ3hFLFlBQU0sRUFBRSxNQUFNLEFBQUM7SUFFL0IsVUFBQSxpQkFBaUI7YUFDZjs7VUFBSyxTQUFTLEVBQUMscUJBQXFCLEVBQUMsS0FBSyxFQUFFLGlCQUFpQixBQUFDO1FBQzVELDZCQUFLLEdBQUcsRUFBRSxHQUFHLEFBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEdBQUU7T0FDMUI7S0FBQTtHQUVTLENBQ3JCO0NBQ0gsQ0FBQzs7QUFFRixZQUFZLENBQUMsU0FBUyxHQUFHO0FBQ3ZCLEtBQUcsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3RDLE9BQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDN0IsY0FBWSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUNwQyxZQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQ2xDLFFBQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7Q0FDN0IsQ0FBQzs7cUJBRWEsWUFBWTs7Ozs7Ozs7O0FDN0IzQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXpDLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLElBQTRCLEVBQUs7TUFBaEMsSUFBSSxHQUFMLElBQTRCLENBQTNCLElBQUk7bUJBQUwsSUFBNEIsQ0FBckIsS0FBSztNQUFMLEtBQUssOEJBQUMsR0FBRztxQkFBaEIsSUFBNEIsQ0FBVixPQUFPO01BQVAsT0FBTyxnQ0FBQyxDQUFDOztBQUMxQyxNQUFJLFFBQVEsR0FBRyxLQUFLLEdBQUMsT0FBTztNQUN4QixRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBRSxLQUFLO1dBQU0sb0JBQUMsWUFBWSxJQUFDLEdBQUcsRUFBRSxHQUFHLEFBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxBQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsQUFBQyxHQUFFO0dBQUMsQ0FBQyxDQUFDOztBQUVsRyxTQUNFOztNQUFLLFNBQVMsRUFBQyxnQkFBZ0I7SUFDM0IsUUFBUTtHQUNOLENBQ047Q0FDSCxDQUFDOztBQUVGLE9BQU8sQ0FBQyxTQUFTLEdBQUc7QUFDbEIsTUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVTtBQUNoRSxPQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLFNBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07Q0FDaEMsQ0FBQzs7cUJBRWEsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYnRCLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLElBQXNCLEVBQUs7TUFBMUIsSUFBSSxHQUFMLElBQXNCLENBQXJCLElBQUk7TUFBRSxjQUFjLEdBQXJCLElBQXNCLENBQWYsY0FBYzs7QUFFdEMsTUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUE7TUFDaEIsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7O0FBR2QsTUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7QUFHbEQseUJBQTJCLElBQUksQ0FBQyxPQUFPLEVBQUUsOEhBQUU7OztVQUEvQixLQUFLO1VBQUUsR0FBRzs7QUFDcEIsVUFBTSxTQUFTLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7Ozs7OztBQUNoQyw4QkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxtSUFBRTtjQUFyRCxLQUFLOztBQUNkLGNBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztjQUM1QyxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBQTtjQUMxQyxXQUFXLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBQSxDQUFDO0FBQ3BELGNBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVqRSxjQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsRUFDdkMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLHFCQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQztTQUMvRDs7Ozs7Ozs7Ozs7Ozs7O0tBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBQ2pCLDBCQUE4QixNQUFNLG1JQUFFOzs7VUFBMUIsS0FBSztVQUFFLE1BQU07Ozs7OztBQUN2Qiw4QkFBOEIsTUFBTSxtSUFBRTs7O2NBQTFCLEtBQUs7Y0FBRSxNQUFNOztBQUN2QixjQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztjQUM5QyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Y0FDbEQsTUFBTSxHQUFHLE1BQU0sR0FBRyxRQUFRO2NBQzFCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLEdBQUcsR0FBRyxNQUFNLEdBQUcsY0FBYyxDQUFDO2NBQ2pELE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2NBQ3hDLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2NBQzVDLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUTtjQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxjQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsSUFBSSxFQUFKLElBQUk7QUFDOUIsa0JBQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZFOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsUUFBRyxRQUFRLENBQUM7S0FDYjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFNBQ0U7O01BQUssU0FBUyxFQUFDLGtCQUFrQjtJQUMvQjs7UUFBTyxFQUFFLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxVQUFVLEdBQUcsU0FBUyxBQUFDO01BQzFFOzs7UUFDRTs7O1VBQ0U7Ozs7V0FBb0I7VUFDcEI7O2NBQUksT0FBTyxFQUFDLEdBQUc7O1dBQVk7VUFBQTs7OztXQUFVO1VBQUE7Ozs7V0FBVTtVQUMvQzs7Y0FBSSxPQUFPLEVBQUMsR0FBRzs7V0FBVztVQUFBOzs7O1dBQVU7VUFBQTs7OztXQUFVO1NBQzNDO09BQ0M7TUFDUjs7O1FBRUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDNUIsaUJBQ0U7O2NBQUksR0FBRyxFQUFFLEtBQUssQUFBQyxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxXQUFXLEdBQUcsWUFBWSxBQUFDO1lBQ3ZFOztnQkFBSSxTQUFTLEVBQUMsT0FBTztjQUFFLEdBQUcsQ0FBQyxLQUFLO2FBQU07WUFDdEM7O2dCQUFJLFNBQVMsRUFBQyxTQUFTO2NBQUUsR0FBRyxDQUFDLE1BQU07YUFBTTtZQUN6Qzs7Z0JBQUksU0FBUyxFQUFDLFNBQVM7Y0FBRSxHQUFHLENBQUMsSUFBSTs7YUFBTztZQUN4Qzs7Z0JBQUksU0FBUyxFQUFDLFNBQVM7Y0FBRSxHQUFHLENBQUMsUUFBUTthQUFNO1lBQzNDOztnQkFBSSxTQUFTLEVBQUMsU0FBUztjQUFFLEdBQUcsQ0FBQyxNQUFNO2FBQU07WUFDekM7O2dCQUFJLFNBQVMsRUFBQyxTQUFTO2NBQUUsR0FBRyxDQUFDLE1BQU07YUFBTTtZQUN6Qzs7Z0JBQUksU0FBUyxFQUFDLFNBQVM7Y0FBRSxHQUFHLENBQUMsSUFBSTs7YUFBTztZQUN4Qzs7Z0JBQUksU0FBUyxFQUFDLFNBQVM7Y0FBRSxHQUFHLENBQUMsUUFBUTthQUFNO1lBQzNDOztnQkFBSSxTQUFTLEVBQUMsU0FBUztjQUFFLEdBQUcsQ0FBQyxNQUFNO2FBQU07V0FDdEMsQ0FDTDtTQUNILENBQUM7T0FFSTtLQUNGO0dBQ0osQ0FDTjtDQUNILENBQUM7O0FBRUYsU0FBUyxDQUFDLFNBQVMsR0FBRztBQUNwQixNQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVO0FBQ2hFLGdCQUFjLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0NBQ3ZDLENBQUM7O3FCQUVhLFNBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5leHBvcnQgZGVmYXVsdCAge1xuICBBbGxlbGVGaWx0ZXJzVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzJyksXG4gIE9yZ2FuaXNtVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL29yZ2FuaXNtJyksXG4gIENocm9tb3NvbWVJbWFnZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJyksXG4gIENocm9tb3NvbWVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZScpLFxuICBBbGxlbGVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWxsZWxlJyksXG4gIEdhbWV0ZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nYW1ldGUnKSxcbiAgR2FtZXRlUG9vbFZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nYW1ldGUtcG9vbCcpLFxuICBHZW5lTGFiZWxWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCcpLFxuICBHZW5vbWVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lJyksXG4gIEdlbm9tZVRlc3RWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnKSxcbiAgUGVuVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL3BlbicpLFxuICBTdGF0c1ZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9zdGF0cycpXG59O1xuXG4iLCJjb25zdCBBbGxlbGVGaWx0ZXJzVmlldyA9ICh7c3BlY2llcywgaGlkZGVuQWxsZWxlcz1bXSwgZGlzYWJsZWRBbGxlbGVzID0gW10sIG9uRmlsdGVyQ2hhbmdlfSkgPT4ge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBuZXcgU2V0LFxuICAgICAgZ2VuZUlucHV0cyA9IFtdO1xuXG4gIGZvciAoY29uc3QgYWxsZWxlIG9mIGhpZGRlbkFsbGVsZXMpIHtcbiAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpO1xuICAgIGlmIChnZW5lKVxuICAgICAgaGlkZGVuR2VuZXMuYWRkKGdlbmUubmFtZSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGdlbmUgaW4gc3BlY2llcy5nZW5lTGlzdCkge1xuICAgIGlmICghaGlkZGVuR2VuZXMuaGFzKGdlbmUpKSB7XG4gICAgICBjb25zdCBhbGxlbGVzID0gc3BlY2llcy5nZW5lTGlzdFtnZW5lXS5hbGxlbGVzLFxuICAgICAgICAgICAgYWxsZWxlSXRlbXMgPSBhbGxlbGVzLm1hcChhbGxlbGUgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gIShkaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID49IDApO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5MZWZ0XCI6IFwiOHB4XCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9Lz5cbiAgICAgICAgICAgICAgICAgIHtuYW1lfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIGdlbmVJbnB1dHMucHVzaChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5lLWFsbGVsZS1saXN0XCIga2V5PXtnZW5lfT57YWxsZWxlSXRlbXN9PC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuIFxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICBhbGxlbGUgPSBlbHQgJiYgZWx0LnZhbHVlLFxuICAgICAgICAgIGlzQ2hlY2tlZCA9IGVsdCAmJiBlbHQuY2hlY2tlZDtcbiAgICBpZiAob25GaWx0ZXJDaGFuZ2UgJiYgYWxsZWxlKVxuICAgICAgb25GaWx0ZXJDaGFuZ2UoZXZ0LCBhbGxlbGUsIGlzQ2hlY2tlZCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUtZmlsdGVyc1wiXG4gICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5Ub3BcIjogXCI1cHhcIiwgXCJtYXJnaW5Cb3R0b21cIjogXCI1cHhcIiB9fT5cbiAgICAgIHsgZ2VuZUlucHV0cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5BbGxlbGVGaWx0ZXJzVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc2FibGVkQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gIG9uRmlsdGVyQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVGaWx0ZXJzVmlldztcbiIsImNvbnN0IEFsbGVsZVZpZXcgPSAoe2FsbGVsZSwgdGFyZ2V0LCBjb2xvciwgc2hhcGUsIGhvdmVyaW5nfSkgPT4ge1xuICBsZXQgd2lkdGg9MjEsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgc3Ryb2tlID0gdGFyZ2V0ID8gXCIjMDAwMDAwXCIgOiBcIm5vbmVcIixcbiAgICAgIGZpbGwgPSBhbGxlbGUgPyBjb2xvciA6IFwid2hpdGVcIixcbiAgICAgIHN0cm9rZVdpZHRoID0gaG92ZXJpbmcgPyAzIDogMSxcbiAgICAgIHN0cm9rZURhc2hhcnJheT0gYWxsZWxlID8gXCIwXCIgOiBcIjFcIixcbiAgICAgIHN2Z1NoYXBlID0gbnVsbDtcblxuICBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcbiAgICBzdmdTaGFwZSA9IDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzF9IGN4PXtyYWRpdXMrMX0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH0gZWxzZSB7XG4gICAgc3ZnU2hhcGUgPSA8cmVjdCB3aWR0aD17KHJhZGl1cyoyKX0gaGVpZ2h0PXsocmFkaXVzKjIpfSB4PVwiMVwiIHk9XCIxXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH1cblxuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17d2lkdGgrMn0gaGVpZ2h0PXt3aWR0aCsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgeyBzdmdTaGFwZSB9XG4gICAgICAgIDx0ZXh0IHg9e3JhZGl1cysxfSB5PXtyYWRpdXMrN30gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ3aGl0ZVwiPnthbGxlbGV9PC90ZXh0PlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlVmlldztcbiIsImNvbnN0IENocm9tb3NvbWVJbWFnZVZpZXcgPSAoKSA9PiB7XG4gIGxldCB3aWR0aD0yMyxcbiAgICAgIGhlaWdodD0xMjYsXG4gICAgICBzcGxpdD00NSxcbiAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBpbWFnZVdpZHRoID0gd2lkdGgrNCxcbiAgICAgIGhhbGZJbWFnZVdpZHRoID0gaW1hZ2VXaWR0aC8yLFxuICAgICAgaW1hZ2VIZWlnaHQgPSBoZWlnaHQrNCxcbiAgICAgIGNvbG9yID0gXCIjRkY5OTk5XCI7XG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXtpbWFnZVdpZHRofSBoZWlnaHQ9e2ltYWdlSGVpZ2h0fSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMn0gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQrcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e2hlaWdodC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKX0gd2lkdGg9e3dpZHRofSB5PXtyYWRpdXMrMn0geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPHJlY3QgaGVpZ2h0PXsoaGVpZ2h0LXJhZGl1cyktKHNwbGl0K3JhZGl1cyl9IHdpZHRoPXt3aWR0aH0geT17c3BsaXQrcmFkaXVzfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT1cIjJcIiAgICAgICB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9e3dpZHRoKzJ9IHkyPXtzcGxpdC1yYWRpdXMrMn0gIHgyPXt3aWR0aCsyfSBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPXt3aWR0aCsyfSB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lSW1hZ2VWaWV3O1xuIiwibGV0IENocm9tb3NvbWVJbWFnZVZpZXcgPSByZXF1aXJlKCcuL2Nocm9tb3NvbWUtaW1hZ2UnKSxcbiAgICBHZW5lTGFiZWxWaWV3ICAgICAgID0gcmVxdWlyZSgnLi9nZW5lLWxhYmVsJyksXG5cbiAgICBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICAgICAgbGV0IGhpZGRlbkdlbmVzID0gaGlkZGVuQWxsZWxlcy5tYXAoIGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gICAgICByZXR1cm4gYWxsZWxlcy5maWx0ZXIoIGEgPT4ge1xuICAgICAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgICAgIHJldHVybiBoaWRkZW5HZW5lcy5pbmRleE9mKGdlbmUpID09PSAtMTtcbiAgICAgIH0pO1xuICAgIH07XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBhbGxlbGVDaGFuZ2VkLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgbGFiZWxzICA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChhLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pLFxuXG4gICAgICBjb250YWluZXJDbGFzcyA9IFwiaXRlbXNcIjtcblxuICBpZiAoIWxhYmVsc09uUmlnaHQpIHtcbiAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbnRhaW5lckNsYXNzIH0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2hyb21vc29tZU5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2lkZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIGFsbGVsZUNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxhYmVsc09uUmlnaHQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImNvbnN0IEdhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2dhbWV0ZScpO1xuXG5jb25zdCBHYW1ldGVQb29sVmlldyA9ICh7Z2FtZXRlcywgaGlkZGVuQWxsZWxlcz1bXSwgd2lkdGg9MzAwLCBoZWlnaHQ9MjAwLCBhbmltU3RpZmZuZXNzPTYwLCBzZWxlY3RlZElkLCBpc0dhbWV0ZURpc2FibGVkLCBvbkdhbWV0ZVNlbGVjdGVkfSkgPT4ge1xuICBsZXQgZ2FtZXRlQ291bnQgPSBnYW1ldGVzLmxlbmd0aCxcbiAgICAgIGdhbWV0ZVNpemUgPSAzMCxcbiAgICAgIG1hcmdpbiA9IDUsXG4gICAgICBzcGFjaW5nRGVmYXVsdCA9IGdhbWV0ZVNpemUgKyAyICogbWFyZ2luLFxuICAgICAgeFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHlTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICBjb2xEZWZhdWx0ID0gTWF0aC5mbG9vcih3aWR0aCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIHJvd0RlZmF1bHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIGVuYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkRmxhZ3MgPSBnYW1ldGVzLm1hcChnID0+IGlzR2FtZXRlRGlzYWJsZWQoZykpLFxuICAgICAgdG90YWxEaXNhYmxlZENvdW50ID0gZGlzYWJsZWRGbGFncy5yZWR1Y2UoKHRvdGFsLGZsYWcpID0+IHRvdGFsICsgZmxhZywgMCksXG4gICAgICAvLyBsZWF2ZSByb29tIGZvciB0aGUgZGlzYWJsZWQgZ2FtZXRlIHJvdyBpZiB0aGVyZSBhcmUgZGlzYWJsZWQgZ2FtZXRlc1xuICAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gaGVpZ2h0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA/IHNwYWNpbmdEZWZhdWx0IDogMCkgLSA0ICogbWFyZ2luLFxuICAgICAgLy8gcGFjayB0aGUgZGlzYWJsZWQgZ2FtZXRlcyBpbnRvIHRoZSBkaXNhYmxlZCByb3dcbiAgICAgIHhEaXNhYmxlZFNwYWNpbmcgPSBNYXRoLm1pbih4U3BhY2luZyAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpZHRoIC0gNyAqIG1hcmdpbikgLyB0b3RhbERpc2FibGVkQ291bnQpLFxuICAgICAgeURpc2FibGVkU3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgdG90YWxFbmFibGVkQ291bnQgPSBnYW1ldGVDb3VudCAtIHRvdGFsRGlzYWJsZWRDb3VudCxcbiAgICAgIGdhbWV0ZVZpZXdzO1xuXG4gIC8vIHNxdWVlemUgaW4gdG8gbWFrZSByb29tIGZvciBhZGRpdGlvbmFsIGdhbWV0ZXMgaWYgbmVjZXNzYXJ5XG4gIHZhciBjb2xDb3VudCA9IGNvbERlZmF1bHQsXG4gICAgICByb3dDb3VudCA9IHJvd0RlZmF1bHQgLSAodG90YWxEaXNhYmxlZENvdW50ID4gMCk7XG4gIHdoaWxlIChjb2xDb3VudCAqIHJvd0NvdW50IDwgdG90YWxFbmFibGVkQ291bnQpIHtcbiAgICBpZiAoeVNwYWNpbmcgPiB4U3BhY2luZykge1xuICAgICAgeVNwYWNpbmcgPSBhdmFpbGFibGVIZWlnaHQgLyArK3Jvd0NvdW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHhTcGFjaW5nID0gKHdpZHRoIC0gNCAqIG1hcmdpbikgLyArK2NvbENvdW50O1xuICAgIH1cbiAgfVxuXG4gIGdhbWV0ZVZpZXdzID0gZ2FtZXRlcy5tYXAoKGdhbWV0ZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gZGlzYWJsZWRGbGFnc1tpbmRleF0sXG4gICAgICAgICAgbGF5b3V0SW5kZXggPSBpc0Rpc2FibGVkID8gZGlzYWJsZWRDb3VudCsrIDogZW5hYmxlZENvdW50KyssXG4gICAgICAgICAgcm93ID0gaXNEaXNhYmxlZCA/IHJvd0RlZmF1bHQgLSAxIDogTWF0aC5mbG9vcihsYXlvdXRJbmRleCAvIGNvbENvdW50KSxcbiAgICAgICAgICBjb2wgPSBpc0Rpc2FibGVkID8gbGF5b3V0SW5kZXggOiBsYXlvdXRJbmRleCAlIGNvbENvdW50LFxuICAgICAgICAgIHkgPSBpc0Rpc2FibGVkID8gcm93ICogeURpc2FibGVkU3BhY2luZyA6IHJvdyAqIHlTcGFjaW5nLFxuICAgICAgICAgIHggPSBpc0Rpc2FibGVkID8gY29sICogeERpc2FibGVkU3BhY2luZyA6IGNvbCAqIHhTcGFjaW5nO1xuICAgIHJldHVybiAoXG4gICAgICA8R2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX1cbiAgICAgICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICBsb2NhdGlvbj17eyBpbml0aWFsOiB7IHg6IE1hdGgucm91bmQod2lkdGgvMiksIHk6IC1NYXRoLnJvdW5kKHlTcGFjaW5nKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWw6IHsgeDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KSB9IH19XG4gICAgICAgICAgICAgICAgICBrZXk9e2luZGV4fSBpZD17aW5kZXggKyAxfVxuICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc31cbiAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ICsgMSA9PT0gc2VsZWN0ZWRJZH1cbiAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkdhbWV0ZVNlbGVjdGVkfSAvPlxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdhbWV0ZS1wb29sXCIgc3R5bGU9e3sgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9fT5cbiAgICAgIHsgZ2FtZXRlVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlUG9vbFZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgYW5pbVN0aWZmbmVzczogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgc2VsZWN0ZWRJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgaXNHYW1ldGVEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9uR2FtZXRlU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVQb29sVmlldztcbiIsImNvbnN0IEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXM9W10sIGxvY2F0aW9uLCBhbmltU3RpZmZuZXNzPTYwLCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrLCBvblJlc3R9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICByZWN0ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICghaXNEaXNhYmxlZCkge1xuICAgICAgb25DbGljayhldnQsIGlkLCByZWN0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKSB7XG4gICAgbGV0IHRvb2x0aXAgPSBcIlwiLFxuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzO1xuICAgIC8vIE5vdGU6IGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IGZvciB0aGUgY2FsbGVyIHRvIHBhc3MgaW4gdGhlXG4gICAgLy8gYWxsSGlkZGVuQWxsZWxlcyBhcnJheSByYXRoZXIgdGhhbiBjb21wdXRpbmcgaXQgZWFjaCB0aW1lIGhlcmUuXG4gICAgLy8gQnV0IGlmIHdlIG1vdmVkIGl0IG91dCByaWdodCBub3cgd2UnZCBoYXZlIHRvIGVsaW1pbmF0ZSB0aGUgRVM2IHNwbGF0LlxuICAgIGZ1bmN0aW9uIGNvbmNhdEhpZGRlbkFsbGVsZXMoaVNwZWNpZXMsIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICBhbGxIaWRkZW5BbGxlbGVzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShpU3BlY2llcywgYWxsZWxlKTtcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcy5wdXNoKC4uLmdlbmUuYWxsZWxlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2ggaW4gZ2FtZXRlKSB7XG4gICAgICB2YXIgY2hyb21vc29tZSA9IGdhbWV0ZVtjaF07XG4gICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcyA9PSBudWxsKVxuICAgICAgICBjb25jYXRIaWRkZW5BbGxlbGVzKGNocm9tb3NvbWUuc3BlY2llcywgaGlkZGVuQWxsZWxlcyk7XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBjaHJvbW9zb21lLmFsbGVsZXMpIHtcbiAgICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMuaW5kZXhPZihhbGxlbGUpIDwgMCkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hyb21vc29tZS5zcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgbGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PT0gJ1hZJykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNocm9tb3NvbWUuc2lkZSA9PT0gJ3knID8gJ3knIDogJ3gnO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENsYXNzID0gaXNTZWxlY3RlZCAmJiAhaXNEaXNhYmxlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkQ2xhc3MgPSBpc0Rpc2FibGVkID8gXCJkaXNhYmxlZFwiIDogXCJcIixcbiAgICAgICAgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBjbGFzc2VzID0gYGdlbmlibG9ja3MgZ2FtZXRlICR7c2VsZWN0ZWRDbGFzc30gJHtkaXNhYmxlZENsYXNzfSBncm91cCR7Z3JvdXB9YCxcbiAgICAgICAgaW5pdGlhbCA9IGxvY2F0aW9uLmluaXRpYWwgfHwgbG9jYXRpb24uZmluYWwsXG4gICAgICAgIGluaXRpYWxTaXplID0gaW5pdGlhbC5zaXplIHx8IDMwLFxuICAgICAgICBpbml0aWFsUm90YXRpb24gPSBpbml0aWFsLnJvdGF0aW9uICE9IG51bGwgPyBpbml0aWFsLnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgaW5pdGlhbE9wYWNpdHkgPSBpbml0aWFsLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWwub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgZmluYWwgPSBsb2NhdGlvbi5maW5hbCxcbiAgICAgICAgZmluYWxTaXplID0gZmluYWwuc2l6ZSB8fCAzMCxcbiAgICAgICAgZmluYWxSb3RhdGlvbiA9IGZpbmFsLnJvdGF0aW9uICE9IG51bGwgPyBmaW5hbC5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGZpbmFsT3BhY2l0eSA9IGZpbmFsLm9wYWNpdHkgIT0gbnVsbCA/IGZpbmFsLm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzIH0sXG4gICAgICAgIHRvb2x0aXAgPSBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKTtcbiAgLyogZXNsaW50IHJlYWN0L2Rpc3BsYXktbmFtZTowICovXG4gIHJldHVybiAoXG4gICAgPFJlYWN0TW90aW9uLk1vdGlvbiBkZWZhdWx0U3R5bGU9e3sgbGVmdDogaW5pdGlhbC54LCB0b3A6IGluaXRpYWwueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogaW5pdGlhbFNpemUsIGhlaWdodDogaW5pdGlhbFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGluaXRpYWxSb3RhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBpbml0aWFsT3BhY2l0eSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tsZWZ0OiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWwueCwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWwueSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbFNpemUsIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsU2l6ZSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IFJlYWN0TW90aW9uLnNwcmluZyhmaW5hbFJvdGF0aW9uLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBSZWFjdE1vdGlvbi5zcHJpbmcoZmluYWxPcGFjaXR5LCBzcHJpbmdDb25maWcpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgdmFyIHsgcm90YXRpb24sIC4uLnN0eWxlIH0gPSBpbnRlcnBvbGF0ZWRTdHlsZTtcbiAgICAgICAgICBzdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7cm90YXRpb259ZGVnKWA7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB0aXRsZT17dG9vbHRpcH0gc3R5bGU9e3N0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5HYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICBpZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsb2NhdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBhbmltU3RpZmZuZXNzOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvblJlc3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVWaWV3O1xuIiwiY29uc3QgR2VuZUxhYmVsVmlldyA9ICh7c3BlY2llcywgYWxsZWxlLCBlZGl0YWJsZSwgb25BbGxlbGVDaGFuZ2V9KSA9PiB7XG4gIGlmICghZWRpdGFibGUpIHtcbiAgICBsZXQgYWxsZWxlTmFtZSA9IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZSBub25lZGl0YWJsZVwiPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7IGFsbGVsZU5hbWUgfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxldCBhbGxlbGVzID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpLmFsbGVsZXMsXG4gICAgICAgIGFsbGVsZU5hbWVzID0gYWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgYWxsZWxlT3B0aW9ucyA9IGFsbGVsZU5hbWVzLm1hcCgobmFtZSwgaSkgPT4gKDxvcHRpb24ga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlc1tpXX0+e25hbWV9PC9vcHRpb24+KSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGVcIj5cbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGFsbGVsZSB9IG9uQ2hhbmdlPXsgb25BbGxlbGVDaGFuZ2UgfT5cbiAgICAgICAgICB7IGFsbGVsZU9wdGlvbnMgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbkdlbmVMYWJlbFZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGFsbGVsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBlZGl0YWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgb25BbGxlbGVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVMYWJlbFZpZXc7XG4iLCJsZXQgQ2hyb21vc29tZUltYWdlVmlldyA9IHJlcXVpcmUoJy4vY2hyb21vc29tZS1pbWFnZScpLFxuICAgIGZpbHRlckFsbGVsZXMgPSBmdW5jdGlvbihhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBzcGVjaWVzKSB7XG4gICAgICBsZXQgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcCggYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgICAgIHJldHVybiBhbGxlbGVzLmZpbHRlciggYSA9PiB7XG4gICAgICAgIGxldCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKTtcbiAgICAgICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBUZXN0UHVsbGRvd25WaWV3ID0gKHtzcGVjaWVzLCBnZW5lLCBzZWxlY3Rpb24sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICAgICAgbGV0IGFsbGVsZXMgPSBnZW5lLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIG51bUFsbGVsZXMgPSBhbGxlbGVOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgcG9zc2libGVDb21ib3MgPSBbXSxcbiAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uIHx8IFwicGxhY2Vob2xkZXJcIixcbiAgICAgICAgICBpLCBqO1xuXG4gICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PVwicGxhY2Vob2xkZXJcIiB2YWx1ZT1cInBsYWNlaG9sZGVyXCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNlbGVjdCBhIEdlbm90eXBlPC9vcHRpb24+KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG51bUFsbGVsZXM7IGkrKykge1xuICAgICAgICBmb3IgKGogPSBpOyBqIDwgbnVtQWxsZWxlczsgaisrKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGkgKyBcIiBcIiArIGosXG4gICAgICAgICAgICAgIHN0cmluZyA9IGFsbGVsZU5hbWVzW2ldICsgXCIgLyBcIiArIGFsbGVsZU5hbWVzW2pdO1xuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2tleX0+e3N0cmluZ308L29wdGlvbj4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBjdXJyZW50U2VsZWN0aW9uIH0gb25DaGFuZ2U9eyBvblNlbGVjdGlvbkNoYW5nZSB9PlxuICAgICAgICAgIHsgcG9zc2libGVDb21ib3MgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICk7XG4gICAgfTtcblxuY29uc3QgR2Vub21lVGVzdFZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcz1bXSwgc2VsZWN0aW9uPXt9LCBzZWxlY3Rpb25DaGFuZ2VkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIGFsbGVsZXMgPSBjaHJvbVtPYmplY3Qua2V5cyhjaHJvbSlbMF1dLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBvcmcuc3BlY2llcyksXG4gICAgICAgIGdlbmVzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYSkpLFxuICAgICAgICBwdWxsZG93bnMgPSBnZW5lcy5tYXAoZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXN0UHVsbGRvd25WaWV3XG4gICAgICAgICAgICAgIGtleSAgICAgICA9IHsgZy5uYW1lIH1cbiAgICAgICAgICAgICAgc3BlY2llcyAgID0geyBvcmcuc3BlY2llcyB9XG4gICAgICAgICAgICAgIGdlbmUgICAgICA9IHsgZyB9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbiA9IHsgc2VsZWN0aW9uW2cubmFtZV0gfVxuICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZSA9IHsgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkKGcsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbm9tZS10ZXN0LW9wdGlvbnNcIj5cbiAgICAgICAgICB7IHB1bGxkb3ducyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWUtdGVzdFwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuVGVzdFB1bGxkb3duVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZ2VuZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3Rpb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5HZW5vbWVUZXN0Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIHNlbGVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgc2VsZWN0aW9uQ2hhbmdlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVGVzdFZpZXc7XG4iLCJsZXQgQ2hyb21vc29tZVZpZXcgPSByZXF1aXJlKCcuL2Nocm9tb3NvbWUnKTtcblxuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzID0gW10sIGFsbGVsZUNoYW5nZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBwYWlycy5wdXNoKFxuICAgICAgICA8Q2hyb21vc29tZVZpZXdcbiAgICAgICAgICBvcmc9e29yZ31cbiAgICAgICAgICBrZXk9e3BhaXJzLmxlbmd0aCArIDF9XG4gICAgICAgICAgY2hyb21vc29tZU5hbWU9e2Nocm9tb3NvbWVOYW1lfVxuICAgICAgICAgIHNpZGU9e3NpZGV9XG4gICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MH1cbiAgICAgICAgICBhbGxlbGVDaGFuZ2VkPXtmdW5jdGlvbihwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGtleT17cGFpcldyYXBwZXJzLmxlbmd0aCArIDF9PlxuICAgICAgICB7IHBhaXJzIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lXCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgYWxsZWxlQ2hhbmdlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVmlldztcbiIsImNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCB3aWR0aD0yMDAsIGluaXRpYWxTdHlsZT17fSwgZmluYWxTdHlsZT17fSwgb25SZXN0IH0pID0+IHtcbiAgbGV0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgIHVybCAgICAgPSBiYXNlVXJsKyBvcmcuZ2V0SW1hZ2VOYW1lKCksXG4gICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWxTdHlsZSAmJiAoaW5pdGlhbFN0eWxlLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWxTdHlsZS5vcGFjaXR5IDogMS4wKSxcbiAgICAgIGZpbmFsT3BhY2l0eSA9IGZpbmFsU3R5bGUgJiYgKGZpbmFsU3R5bGUub3BhY2l0eSAhPSBudWxsID8gZmluYWxTdHlsZS5vcGFjaXR5IDogMS4wKTtcblxuICAvKiBlc2xpbnQgcmVhY3QvZGlzcGxheS1uYW1lOjAgKi9cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RNb3Rpb24uTW90aW9uIGRlZmF1bHRTdHlsZT17eyBvcGFjaXR5OiBpbml0aWFsT3BhY2l0eSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogUmVhY3RNb3Rpb24uc3ByaW5nKGZpbmFsT3BhY2l0eSwgeyBzdGlmZm5lc3M6IDYwIH0pIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiBcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIiBzdHlsZT17aW50ZXJwb2xhdGVkU3R5bGV9PlxuICAgICAgICAgICAgPGltZyBzcmM9e3VybH0gd2lkdGg9e3dpZHRofS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICB9XG4gICAgPC9SZWFjdE1vdGlvbi5Nb3Rpb24+XG4gICk7XG59O1xuXG5PcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxTdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgZmluYWxTdHlsZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgb25SZXN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwibGV0IE9yZ2FuaXNtVmlldyA9IHJlcXVpcmUoJy4vb3JnYW5pc20nKTtcblxuY29uc3QgUGVuVmlldyA9ICh7b3Jncywgd2lkdGg9NDAwLCBjb2x1bW5zPTV9KSA9PiB7XG4gIGxldCBvcmdXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKChvcmcsIGluZGV4KSA9PiAoPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30ga2V5PXtpbmRleH0gd2lkdGg9e29yZ1dpZHRofS8+KSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgY29sdW1uczogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsIi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGJyZWVkaW5nIHN0YXRpc3RpY3MgZm9yIGEgc2V0IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXNcbiAqIEBwYXJhbSB7T2JqZWN0W119IG9yZ3MgLSBhcnJheSBvZiBCaW9sb2dpY2Egb3JnYW5pc21zIGZvciB3aGljaCBzdGF0aXN0aWNzIGFyZSB0byBiZSBkaXNwbGF5ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmdzW10ucGhlbm90eXBlIC0gdGhlIHBoZW5vdHlwZSBvZiB0aGUgQmlvbG9naWNhIG9yZ2FuaXNtXG4gKiBAcGFyYW0ge251bWJlcn0gW2xhc3RDbHV0Y2hTaXplPW9yZ3MubGVuZ3RoXSAtIHRoZSBudW1iZXIgb2Ygb3JnYW5pc21zIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IHRoYXQgY29tcHJpc2UgdGhlIG1vc3QgcmVjZW50IGNsdXRjaFxuICovXG5jb25zdCBTdGF0c1ZpZXcgPSAoe29yZ3MsIGxhc3RDbHV0Y2hTaXplfSkgPT4ge1xuXG4gIGxldCB0cmFpdHMgPSBuZXcgTWFwLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGlmIG5vIHNpemUgc3BlY2lmaWVkLCBhc3N1bWUgdGhlcmUncyBvbmx5IG9uZSBjbHV0Y2hcbiAgaWYgKCFsYXN0Q2x1dGNoU2l6ZSkgbGFzdENsdXRjaFNpemUgPSBvcmdzLmxlbmd0aDtcblxuICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gIGZvciAoY29uc3QgW2luZGV4LCBvcmddIG9mIG9yZ3MuZW50cmllcygpKSB7XG4gICAgY29uc3QgY2x1dGNoS2V5ID0gJ2MnICsgb3JnLnNleDtcbiAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIE9iamVjdC5rZXlzKG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSkge1xuICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgIHRyYWl0VmFsdWVzID0gdHJhaXRzLmdldCh0cmFpdCkgfHwgbmV3IE1hcCxcbiAgICAgICAgICB2YWx1ZUNvdW50cyA9IHRyYWl0VmFsdWVzLmdldCh2YWx1ZSkgfHwgbmV3IE1hcDtcbiAgICAgIGlmICghdHJhaXRzLmhhcyh0cmFpdCkpIHRyYWl0cy5zZXQodHJhaXQsIHRyYWl0VmFsdWVzKTtcbiAgICAgIGlmICghdHJhaXRWYWx1ZXMuaGFzKHZhbHVlKSkgdHJhaXRWYWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUNvdW50cyk7XG4gICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICBpZiAoaW5kZXggPj0gb3Jncy5sZW5ndGggLSBsYXN0Q2x1dGNoU2l6ZSlcbiAgICAgICAgdmFsdWVDb3VudHMuc2V0KGNsdXRjaEtleSwgKHZhbHVlQ291bnRzLmdldChjbHV0Y2hLZXkpIHx8IDApICsgMSk7XG4gICAgICB2YWx1ZUNvdW50cy5zZXQob3JnLnNleCwgKHZhbHVlQ291bnRzLmdldChvcmcuc2V4KSB8fCAwKSArIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgY0ZlbWFsZXMgPSBjb3VudHMuZ2V0KCdjJyArIEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjVG90YWwgPSBjTWFsZXMgKyBjRmVtYWxlcyxcbiAgICAgICAgICAgIGNQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiBjVG90YWwgLyBsYXN0Q2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5NQUxFKSB8fCAwLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMuZ2V0KEJpb0xvZ2ljYS5GRU1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKCAxMDAgKiB0VG90YWwgLyBvcmdzLmxlbmd0aCk7XG4gICAgICByb3dzLnB1c2goeyB0cmFpdCwgdHJhaXROdW0sIHZhbHVlLCBjTWFsZXMsIGNGZW1hbGVzLCBjVG90YWwsIGNQY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TWFsZXMsIHRGZW1hbGVzLCB0VG90YWwsIHRQY3QgfSk7XG4gICAgfVxuICAgICsrIHRyYWl0TnVtO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgc3RhdHNcIj5cbiAgICAgIDx0YWJsZSBpZD1cInN0YXRzLXRhYmxlXCIgY2xhc3NOYW1lPXtvcmdzLmxlbmd0aCA+IDAgPyBcImhhcy1kYXRhXCIgOiBcIm5vLWRhdGFcIn0+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+VHJhaXQgVmFsdWU8L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+Q2x1dGNoPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+VG90YWw8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7XG4gICAgICAgICAgcm93cy5tYXAoZnVuY3Rpb24ocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyIGtleT17aW5kZXh9IGNsYXNzTmFtZT17cm93LnRyYWl0TnVtICYgMSA/IFwib2RkLXRyYWl0XCIgOiBcImV2ZW4tdHJhaXRcIn0+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImxhYmVsXCI+e3Jvdy52YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1BjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY0ZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY01hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50UGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50RmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50TWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblN0YXRzVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGxhc3RDbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0c1ZpZXc7XG4iXX0=
