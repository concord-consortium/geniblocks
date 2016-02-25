(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GeniBlocks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  OrganismView: require('./components/organism'),
  ChromosomeImageView: require('./components/chromosome-image'),
  ChromosomeView: require('./components/chromosome'),
  GameteView: require('./components/gamete'),
  GametePoolView: require('./components/gamete-pool'),
  GeneLabelView: require('./components/gene-label'),
  GenomeView: require('./components/genome'),
  GenomeTestView: require('./components/genome-test'),
  PenView: require('./components/pen'),
  StatsView: require('./components/stats')
};
module.exports = exports['default'];

},{"./components/chromosome":3,"./components/chromosome-image":2,"./components/gamete":5,"./components/gamete-pool":4,"./components/gene-label":6,"./components/genome":8,"./components/genome-test":7,"./components/organism":9,"./components/pen":10,"./components/stats":11}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./chromosome-image":2,"./gene-label":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameteView = require('./gamete');

var GametePoolView = function GametePoolView(_ref) {
  var gametes = _ref.gametes;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 300 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 4 : _ref$columns;
  var selectedId = _ref.selectedId;
  var onGameteSelected = _ref.onGameteSelected;

  var gameteWidth = width / columns,
      gameteViews = gametes.map(function (gamete, index) {
    return React.createElement(GameteView, { gamete: gamete, width: gameteWidth,
      key: index, id: index + 1, // id === index + 1
      isSelected: index + 1 === selectedId,
      onClick: onGameteSelected });
  });

  return React.createElement(
    "div",
    { className: "geniblocks gamete-pool" },
    gameteViews
  );
};

GametePoolView.propTypes = {
  gametes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  width: React.PropTypes.number,
  columns: React.PropTypes.number,
  selectedId: React.PropTypes.number,
  onGameteSelected: React.PropTypes.func
};

exports["default"] = GametePoolView;
module.exports = exports["default"];

},{"./gamete":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameteView = function GameteView(_ref) {
  var gamete = _ref.gamete;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var isSelected = _ref.isSelected;
  var onClick = _ref.onClick;

  gamete, width;

  function handleClick(evt) {
    onClick(evt, id);
  }

  var classes = "geniblocks gamete " + (isSelected ? "selected" : "") + " " + ('group' + id % 4);
  return React.createElement("div", { className: classes, onClick: handleClick });
};

GameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  width: React.PropTypes.number,
  isSelected: React.PropTypes.bool,
  onClick: React.PropTypes.func
};

exports["default"] = GameteView;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./chromosome-image":2}],8:[function(require,module,exports){
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

},{"./chromosome":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;

  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url = baseUrl + org.getImageName();

  return React.createElement(
    "div",
    { className: "geniblocks organism" },
    React.createElement("img", { src: url, width: width })
  );
};

OrganismView.propTypes = {
  org: React.PropTypes.object.isRequired,
  width: React.PropTypes.number
};

exports["default"] = OrganismView;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
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

},{"./organism":9}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9hcHAuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUtaW1hZ2UuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS1wb29sLmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2dlbmUtbGFiZWwuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS10ZXN0LmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUuanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL29yZ2FuaXNtLmpzIiwiL1VzZXJzL2tzd2Vuc29uL0RldmVsb3BtZW50L2dlbmlzdGFyL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiLCIvVXNlcnMva3N3ZW5zb24vRGV2ZWxvcG1lbnQvZ2VuaXN0YXIvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7cUJDQ2dCO0FBQ2QsY0FBWSxFQUFFLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztBQUM5QyxxQkFBbUIsRUFBRSxPQUFPLENBQUMsK0JBQStCLENBQUM7QUFDN0QsZ0JBQWMsRUFBRSxPQUFPLENBQUMseUJBQXlCLENBQUM7QUFDbEQsWUFBVSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztBQUMxQyxnQkFBYyxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQztBQUNuRCxlQUFhLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQ2pELFlBQVUsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFDMUMsZ0JBQWMsRUFBRSxPQUFPLENBQUMsMEJBQTBCLENBQUM7QUFDbkQsU0FBTyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztBQUNwQyxXQUFTLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixDQUFDO0NBQ3pDOzs7Ozs7Ozs7QUNaRCxJQUFNLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixHQUFTO0FBQ2hDLE1BQUksS0FBSyxHQUFDLEVBQUU7TUFDUixNQUFNLEdBQUMsR0FBRztNQUNWLEtBQUssR0FBQyxFQUFFO01BQ1IsTUFBTSxHQUFHLEtBQUssR0FBQyxDQUFDO01BQ2hCLFVBQVUsR0FBRyxLQUFLLEdBQUMsQ0FBQztNQUNwQixjQUFjLEdBQUcsVUFBVSxHQUFDLENBQUM7TUFDN0IsV0FBVyxHQUFHLE1BQU0sR0FBQyxDQUFDO01BQ3RCLEtBQUssR0FBRyxTQUFTLENBQUM7O0FBRXRCLFNBQ0U7O01BQUssS0FBSyxFQUFFLFVBQVUsQUFBQyxFQUFDLE1BQU0sRUFBRSxXQUFXLEFBQUMsRUFBQyxLQUFLLEVBQUMsNEJBQTRCO0lBQzdFOzs7TUFDRSxnQ0FBUSxDQUFDLEVBQUUsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLE1BQU0sR0FBQyxDQUFDLEFBQUMsRUFBQyxFQUFFLEVBQUUsY0FBYyxBQUFDLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBRSxLQUFLLEFBQUMsR0FBRTtNQUNwRyxnQ0FBUSxDQUFDLEVBQUUsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLEtBQUssR0FBQyxNQUFNLEFBQUMsRUFBQyxFQUFFLEVBQUUsY0FBYyxBQUFDLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBRSxLQUFLLEFBQUMsR0FBRTtNQUN4RyxnQ0FBUSxDQUFDLEVBQUUsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLEtBQUssR0FBQyxNQUFNLEFBQUMsRUFBQyxFQUFFLEVBQUUsY0FBYyxBQUFDLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBRSxLQUFLLEFBQUMsR0FBRTtNQUN4RyxnQ0FBUSxDQUFDLEVBQUUsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLE1BQU0sR0FBQyxNQUFNLEFBQUMsRUFBQyxFQUFFLEVBQUUsY0FBYyxBQUFDLEVBQUMsV0FBVyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBRSxLQUFLLEFBQUMsR0FBRTtNQUN6Ryw4QkFBTSxNQUFNLEVBQUUsQUFBQyxLQUFLLEdBQUMsTUFBTSxJQUFHLE1BQU0sR0FBQyxDQUFDLENBQUEsQUFBQyxBQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxFQUFDLENBQUMsRUFBRSxNQUFNLEdBQUMsQ0FBQyxBQUFDLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxXQUFXLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsSUFBSSxFQUFFLEtBQUssQUFBQyxHQUFFO01BQ3pILDhCQUFNLE1BQU0sRUFBRSxBQUFDLE1BQU0sR0FBQyxNQUFNLElBQUcsS0FBSyxHQUFDLE1BQU0sQ0FBQSxBQUFDLEFBQUMsRUFBQyxL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O0dBQ0osQ0FDTjtDQUNILENBQUM7O0FBRUYsU0FBUyxDQUFDLFNBQVMsR0FBRztBQUNwQixNQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVO0FBQ2hFLGdCQUFjLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0NBQ3ZDLENBQUM7O3FCQUVhLFNBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5leHBvcnQgZGVmYXVsdCAge1xuICBPcmdhbmlzbVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9vcmdhbmlzbScpLFxuICBDaHJvbW9zb21lSW1hZ2VWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZScpLFxuICBDaHJvbW9zb21lVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnKSxcbiAgR2FtZXRlVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL2dhbWV0ZScpLFxuICBHYW1ldGVQb29sVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL2dhbWV0ZS1wb29sJyksXG4gIEdlbmVMYWJlbFZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJyksXG4gIEdlbm9tZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5vbWUnKSxcbiAgR2Vub21lVGVzdFZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5vbWUtdGVzdCcpLFxuICBQZW5WaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvcGVuJyksXG4gIFN0YXRzVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL3N0YXRzJylcbn07XG5cbiIsImNvbnN0IENocm9tb3NvbWVJbWFnZVZpZXcgPSAoKSA9PiB7XG4gIGxldCB3aWR0aD0yMyxcbiAgICAgIGhlaWdodD0xMjYsXG4gICAgICBzcGxpdD00NSxcbiAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBpbWFnZVdpZHRoID0gd2lkdGgrNCxcbiAgICAgIGhhbGZJbWFnZVdpZHRoID0gaW1hZ2VXaWR0aC8yLFxuICAgICAgaW1hZ2VIZWlnaHQgPSBoZWlnaHQrNCxcbiAgICAgIGNvbG9yID0gXCIjRkY5OTk5XCI7XG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXtpbWFnZVdpZHRofSBoZWlnaHQ9e2ltYWdlSGVpZ2h0fSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMn0gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQrcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e2hlaWdodC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKX0gd2lkdGg9e3dpZHRofSB5PXtyYWRpdXMrMn0geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPHJlY3QgaGVpZ2h0PXsoaGVpZ2h0LXJhZGl1cyktKHNwbGl0K3JhZGl1cyl9IHdpZHRoPXt3aWR0aH0geT17c3BsaXQrcmFkaXVzfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT1cIjJcIiAgICAgICB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9e3dpZHRoKzJ9IHkyPXtzcGxpdC1yYWRpdXMrMn0gIHgyPXt3aWR0aCsyfSBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPXt3aWR0aCsyfSB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lSW1hZ2VWaWV3O1xuIiwibGV0IENocm9tb3NvbWVJbWFnZVZpZXcgPSByZXF1aXJlKCcuL2Nocm9tb3NvbWUtaW1hZ2UnKSxcbiAgICBHZW5lTGFiZWxWaWV3ICAgICAgID0gcmVxdWlyZSgnLi9nZW5lLWxhYmVsJyksXG5cbiAgICBmaWx0ZXJBbGxlbGVzID0gZnVuY3Rpb24oYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICAgICAgbGV0IGhpZGRlbkdlbmVzID0gaGlkZGVuQWxsZWxlcy5tYXAoIGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gICAgICByZXR1cm4gYWxsZWxlcy5maWx0ZXIoIGEgPT4ge1xuICAgICAgICBsZXQgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgICAgIHJldHVybiBoaWRkZW5HZW5lcy5pbmRleE9mKGdlbmUpID09PSAtMTtcbiAgICAgIH0pO1xuICAgIH07XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBhbGxlbGVDaGFuZ2VkLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICB2aXNpYmxlQWxsZWxlcyA9IGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgbGFiZWxzICA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChhLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pLFxuXG4gICAgICBjb250YWluZXJDbGFzcyA9IFwiaXRlbXNcIjtcblxuICBpZiAoIWxhYmVsc09uUmlnaHQpIHtcbiAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbnRhaW5lckNsYXNzIH0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2hyb21vc29tZU5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2lkZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gIGFsbGVsZUNoYW5nZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxhYmVsc09uUmlnaHQ6IFJlYWN0LlByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImNvbnN0IEdhbWV0ZVZpZXcgPSByZXF1aXJlKCcuL2dhbWV0ZScpO1xuXG5jb25zdCBHYW1ldGVQb29sVmlldyA9ICh7Z2FtZXRlcywgd2lkdGg9MzAwLCBjb2x1bW5zPTQsIHNlbGVjdGVkSWQsIG9uR2FtZXRlU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBnYW1ldGVXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBnYW1ldGVWaWV3cyA9IGdhbWV0ZXMubWFwKChnYW1ldGUsIGluZGV4KSA9PiBcbiAgICAgICAgKDxHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSB3aWR0aD17Z2FtZXRlV2lkdGh9XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtpbmRleH0gaWQ9e2luZGV4ICsgMX0gLy8gaWQgPT09IGluZGV4ICsgMVxuICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ICsgMSA9PT0gc2VsZWN0ZWRJZH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkdhbWV0ZVNlbGVjdGVkfSAvPikpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdhbWV0ZS1wb29sXCI+XG4gICAgICB7IGdhbWV0ZVZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVBvb2xWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIHNlbGVjdGVkSWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIG9uR2FtZXRlU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVQb29sVmlldztcbiIsImNvbnN0IEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIHdpZHRoPTIwMCwgaXNTZWxlY3RlZCwgb25DbGlja30pID0+IHtcbiAgZ2FtZXRlLCB3aWR0aDtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBvbkNsaWNrKGV2dCwgaWQpO1xuICB9XG5cbiAgY29uc3QgY2xhc3NlcyA9IGBnZW5pYmxvY2tzIGdhbWV0ZSAke2lzU2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifSAkeydncm91cCcgKyAoaWQgJSA0KX1gO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpc1NlbGVjdGVkOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVZpZXc7XG4iLCJjb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGxldCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlIG5vbmVkaXRhYmxlXCI+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHsgYWxsZWxlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZVwiPlxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgYWxsZWxlIH0gb25DaGFuZ2U9eyBvbkFsbGVsZUNoYW5nZSB9PlxuICAgICAgICAgIHsgYWxsZWxlT3B0aW9ucyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvbkFsbGVsZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImxldCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gcmVxdWlyZSgnLi9jaHJvbW9zb21lLWltYWdlJyksXG4gICAgZmlsdGVyQWxsZWxlcyA9IGZ1bmN0aW9uKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIHNwZWNpZXMpIHtcbiAgICAgIGxldCBoaWRkZW5HZW5lcyA9IGhpZGRlbkFsbGVsZXMubWFwKCBhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSkpO1xuICAgICAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKCBhID0+IHtcbiAgICAgICAgbGV0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpO1xuICAgICAgICByZXR1cm4gaGlkZGVuR2VuZXMuaW5kZXhPZihnZW5lKSA9PT0gLTE7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFRlc3RQdWxsZG93blZpZXcgPSAoe3NwZWNpZXMsIGdlbmUsIHNlbGVjdGlvbiwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gICAgICBsZXQgYWxsZWxlcyA9IGdlbmUuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgbnVtQWxsZWxlcyA9IGFsbGVsZU5hbWVzLmxlbmd0aCxcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcyA9IFtdLFxuICAgICAgICAgIGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb24gfHwgXCJwbGFjZWhvbGRlclwiLFxuICAgICAgICAgIGksIGo7XG5cbiAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9XCJwbGFjZWhvbGRlclwiIHZhbHVlPVwicGxhY2Vob2xkZXJcIiBkaXNhYmxlZD1cImRpc2FibGVkXCI+U2VsZWN0IGEgR2Vub3R5cGU8L29wdGlvbj4pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQWxsZWxlczsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IGk7IGogPCBudW1BbGxlbGVzOyBqKyspIHtcbiAgICAgICAgICBsZXQga2V5ID0gaSArIFwiIFwiICsgaixcbiAgICAgICAgICAgICAgc3RyaW5nID0gYWxsZWxlTmFtZXNbaV0gKyBcIiAvIFwiICsgYWxsZWxlTmFtZXNbal07XG4gICAgICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT17a2V5fSB2YWx1ZT17a2V5fT57c3RyaW5nfTwvb3B0aW9uPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGN1cnJlbnRTZWxlY3Rpb24gfSBvbkNoYW5nZT17IG9uU2VsZWN0aW9uQ2hhbmdlIH0+XG4gICAgICAgICAgeyBwb3NzaWJsZUNvbWJvcyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgKTtcbiAgICB9O1xuXG5jb25zdCBHZW5vbWVUZXN0VmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzPVtdLCBzZWxlY3Rpb249e30sIHNlbGVjdGlvbkNoYW5nZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgYWxsZWxlcyA9IGNocm9tW09iamVjdC5rZXlzKGNocm9tKVswXV0uYWxsZWxlcyxcbiAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBmaWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIG9yZy5zcGVjaWVzKSxcbiAgICAgICAgZ2VuZXMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKG9yZy5zcGVjaWVzLCBhKSksXG4gICAgICAgIHB1bGxkb3ducyA9IGdlbmVzLm1hcChnID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRlc3RQdWxsZG93blZpZXdcbiAgICAgICAgICAgICAga2V5ICAgICAgID0geyBnLm5hbWUgfVxuICAgICAgICAgICAgICBzcGVjaWVzICAgPSB7IG9yZy5zcGVjaWVzIH1cbiAgICAgICAgICAgICAgZ2VuZSAgICAgID0geyBnIH1cbiAgICAgICAgICAgICAgc2VsZWN0aW9uID0geyBzZWxlY3Rpb25bZy5uYW1lXSB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlID0geyBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQoZywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgfSB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1zXCI+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2Vub21lLXRlc3Qtb3B0aW9uc1wiPlxuICAgICAgICAgIHsgcHVsbGRvd25zIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbm9tZS10ZXN0XCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5UZXN0UHVsbGRvd25WaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBnZW5lOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHNlbGVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbkdlbm9tZVRlc3RWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgc2VsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBzZWxlY3Rpb25DaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVUZXN0VmlldztcbiIsImxldCBDaHJvbW9zb21lVmlldyA9IHJlcXVpcmUoJy4vY2hyb21vc29tZScpO1xuXG5jb25zdCBHZW5vbWVWaWV3ID0gKHtvcmcsIGhpZGRlbkFsbGVsZXMgPSBbXSwgYWxsZWxlQ2hhbmdlZH0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBwYWlycyA9IFtdO1xuICAgIGZvciAobGV0IHNpZGUgaW4gY2hyb20pIHtcbiAgICAgIHBhaXJzLnB1c2goXG4gICAgICAgIDxDaHJvbW9zb21lVmlld1xuICAgICAgICAgIG9yZz17b3JnfVxuICAgICAgICAgIGtleT17cGFpcnMubGVuZ3RoICsgMX1cbiAgICAgICAgICBjaHJvbW9zb21lTmFtZT17Y2hyb21vc29tZU5hbWV9XG4gICAgICAgICAgc2lkZT17c2lkZX1cbiAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgIGxhYmVsc09uUmlnaHQ9e3BhaXJzLmxlbmd0aD4wfVxuICAgICAgICAgIGFsbGVsZUNoYW5nZWQ9e2Z1bmN0aW9uKHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChjaHJvbW9zb21lTmFtZSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICApO1xuICAgIH1cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYga2V5PXtwYWlyV3JhcHBlcnMubGVuZ3RoICsgMX0+XG4gICAgICAgIHsgcGFpcnMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWVcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdlbm9tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVWaWV3O1xuIiwiY29uc3QgT3JnYW5pc21WaWV3ID0gKHtvcmcsIHdpZHRoPTIwMH0pID0+IHtcbiAgbGV0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgIHVybCAgICAgPSBiYXNlVXJsKyBvcmcuZ2V0SW1hZ2VOYW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIj5cbiAgICAgIDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0vPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbVZpZXc7XG4iLCJsZXQgT3JnYW5pc21WaWV3ID0gcmVxdWlyZSgnLi9vcmdhbmlzbScpO1xuXG5jb25zdCBQZW5WaWV3ID0gKHtvcmdzLCB3aWR0aD00MDAsIGNvbHVtbnM9NX0pID0+IHtcbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZywgaW5kZXgpID0+ICg8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBrZXk9e2luZGV4fSB3aWR0aD17b3JnV2lkdGh9Lz4pKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBwZW5cIj5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUGVuVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBjb2x1bW5zOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQZW5WaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYnJlZWRpbmcgc3RhdGlzdGljcyBmb3IgYSBzZXQgb2YgQmlvbG9naWNhIG9yZ2FuaXNtc1xuICogQHBhcmFtIHtPYmplY3RbXX0gb3JncyAtIGFycmF5IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXMgZm9yIHdoaWNoIHN0YXRpc3RpY3MgYXJlIHRvIGJlIGRpc3BsYXllZFxuICogQHBhcmFtIHtPYmplY3R9IG9yZ3NbXS5waGVub3R5cGUgLSB0aGUgcGhlbm90eXBlIG9mIHRoZSBCaW9sb2dpY2Egb3JnYW5pc21cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGFzdENsdXRjaFNpemU9b3Jncy5sZW5ndGhdIC0gdGhlIG51bWJlciBvZiBvcmdhbmlzbXMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkgdGhhdCBjb21wcmlzZSB0aGUgbW9zdCByZWNlbnQgY2x1dGNoXG4gKi9cbmNvbnN0IFN0YXRzVmlldyA9ICh7b3JncywgbGFzdENsdXRjaFNpemV9KSA9PiB7XG5cbiAgbGV0IHRyYWl0cyA9IG5ldyBNYXAsXG4gICAgICByb3dzID0gW107XG5cbiAgLy8gaWYgbm8gc2l6ZSBzcGVjaWZpZWQsIGFzc3VtZSB0aGVyZSdzIG9ubHkgb25lIGNsdXRjaFxuICBpZiAoIWxhc3RDbHV0Y2hTaXplKSBsYXN0Q2x1dGNoU2l6ZSA9IG9yZ3MubGVuZ3RoO1xuXG4gIC8vIGFjY3VtdWxhdGUgc3RhdHMgZm9yIGVhY2ggdHJhaXQvdmFsdWUgY29tYmluYXRpb25cbiAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3Jncy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBjbHV0Y2hLZXkgPSAnYycgKyBvcmcuc2V4O1xuICAgIGZvciAoY29uc3QgdHJhaXQgb2YgT2JqZWN0LmtleXMob3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MpKSB7XG4gICAgICBsZXQgdmFsdWUgPSBvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljc1t0cmFpdF0sXG4gICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgIHZhbHVlQ291bnRzID0gdHJhaXRWYWx1ZXMuZ2V0KHZhbHVlKSB8fCBuZXcgTWFwO1xuICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgaWYgKCF0cmFpdFZhbHVlcy5oYXModmFsdWUpKSB0cmFpdFZhbHVlcy5zZXQodmFsdWUsIHZhbHVlQ291bnRzKTtcbiAgICAgIC8vIG1vc3QgcmVjZW50IGNsdXRjaCBhc3N1bWVkIHRvIGJlIGF0IGVuZCBvZiBvcmdhbmlzbXMgYXJyYXlcbiAgICAgIGlmIChpbmRleCA+PSBvcmdzLmxlbmd0aCAtIGxhc3RDbHV0Y2hTaXplKVxuICAgICAgICB2YWx1ZUNvdW50cy5zZXQoY2x1dGNoS2V5LCAodmFsdWVDb3VudHMuZ2V0KGNsdXRjaEtleSkgfHwgMCkgKyAxKTtcbiAgICAgIHZhbHVlQ291bnRzLnNldChvcmcuc2V4LCAodmFsdWVDb3VudHMuZ2V0KG9yZy5zZXgpIHx8IDApICsgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYnVpbGQgY3VtdWxhdGl2ZSBzdGF0cyBmb3IgdGFibGUgcm93c1xuICBsZXQgdHJhaXROdW0gPSAwO1xuICBmb3IgKGNvbnN0IFt0cmFpdCwgdmFsdWVzXSBvZiB0cmFpdHMpIHtcbiAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgY291bnRzXSBvZiB2YWx1ZXMpIHtcbiAgICAgIGNvbnN0IGNNYWxlcyA9IGNvdW50cy5nZXQoJ2MnICsgQmlvTG9naWNhLk1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjRmVtYWxlcyA9IGNvdW50cy5nZXQoJ2MnICsgQmlvTG9naWNhLkZFTUFMRSkgfHwgMCxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoIDEwMCAqIGNUb3RhbCAvIGxhc3RDbHV0Y2hTaXplKSxcbiAgICAgICAgICAgIHRNYWxlcyA9IGNvdW50cy5nZXQoQmlvTG9naWNhLk1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0RmVtYWxlcyA9IGNvdW50cy5nZXQoQmlvTG9naWNhLkZFTUFMRSkgfHwgMCxcbiAgICAgICAgICAgIHRUb3RhbCA9IHRNYWxlcyArIHRGZW1hbGVzLFxuICAgICAgICAgICAgdFBjdCA9IE1hdGgucm91bmQoIDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiJdfQ==
