(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GeniBlocks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  OrganismView: require('./components/organism'),
  ChromosomeImageView: require('./components/chromosome-image'),
  ChromosomeView: require('./components/chromosome'),
  GeneLabelView: require('./components/gene-label'),
  GenomeView: require('./components/genome'),
  GenomeTestView: require('./components/genome-test'),
  PenView: require('./components/pen'),
  StatsView: require('./components/stats')
};
module.exports = exports['default'];

},{"./components/chromosome":3,"./components/chromosome-image":2,"./components/gene-label":4,"./components/genome":6,"./components/genome-test":5,"./components/organism":7,"./components/pen":8,"./components/stats":9}],2:[function(require,module,exports){
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

},{"./chromosome-image":2,"./gene-label":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./chromosome-image":2}],6:[function(require,module,exports){
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

},{"./chromosome":3}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./organism":7}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvYXBwLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsIi9Vc2Vycy9zZmVudHJlc3MvcHJvamVjdHMvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsIi9Vc2Vycy9zZmVudHJlc3MvcHJvamVjdHMvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL3Blbi5qcyIsIi9Vc2Vycy9zZmVudHJlc3MvcHJvamVjdHMvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7cUJDQ2dCO0FBQ2QsY0FBWSxFQUFFLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztBQUM5QyxxQkFBbUIsRUFBRSxPQUFPLENBQUMsK0JBQStCLENBQUM7QUFDN0QsZ0JBQWMsRUFBRSxPQUFPLENBQUMseUJBQXlCLENBQUM7QUFDbEQsZUFBYSxFQUFFLE9BQU8sQ0FBQyx5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RTtBQUM1QixpQkFDRTs7Y0FBSSxHQUFHLEVBQUUsS0FBSyxBQUFDLEVBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxZQUFZLEFBQUM7WUFDdkU7O2dCQUFJLFNBQVMsRUFBQyxPQUFPO2NBQUUsR0FBRyxDQUFDLEtBQUs7YUFBTTtZQUN0Qzs7Z0JBQUksU0FBUyxFQUFDLFNBQVM7Y0FBRSxHQUFHLENBQUMsTUFBTTthQUFNO1lBQ3pDOztnQkFBSSxTQUFTLEVBQUMsU0FBUztjQUFFLEdBQUcsQ0FBQyxJQUFJOzthQUFPO1lBQ3hDOztnQkFBSSxTQUFTLEVBQUMsU0FBUztjQUFFLEdBQUcsQ0FBQyxRQUFRO2FBQU07WUFDM0M7O2dCQUFJLFNBQVMsRUFBQyxTQUFTO2NBQUUsR0FBRyxDQUFDLE1BQU07YUFBTTtZQUN6Qzs7Z0JBQUksU0FBUyxFQUFDLFNBQVM7Y0FBRSxHQUFHLENBQUMsTUFBTTthQUFNO1lBQ3pDOztnQkFBSSxTQUFTLEVBQUMsU0FBUztjQUFFLEdBQUcsQ0FBQyxJQUFJOzthQUFPO1lBQ3hDOztnQkFBSSxTQUFTLEVBQUMsU0FBUztjQUFFLEdBQUcsQ0FBQyxRQUFRO2FBQU07WUFDM0M7O2dCQUFJLFNBQVMsRUFBQyxTQUFTO2NBQUUsR0FBRyxDQUFDLE1BQU07YUFBTTtXQUN0QyxDQUNMO1NBQ0gsQ0FBQztPQUVJO0tBQ0Y7R0FDSixDQUNOO0NBQ0gsQ0FBQzs7QUFFRixTQUFTLENBQUMsU0FBUyxHQUFHO0FBQ3BCLE1BQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVU7QUFDaEUsZ0JBQWMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07Q0FDdkMsQ0FBQzs7cUJBRWEsU0FBUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmV4cG9ydCBkZWZhdWx0ICB7XG4gIE9yZ2FuaXNtVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL29yZ2FuaXNtJyksXG4gIENocm9tb3NvbWVJbWFnZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJyksXG4gIENocm9tb3NvbWVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZScpLFxuICBHZW5lTGFiZWxWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCcpLFxuICBHZW5vbWVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lJyksXG4gIEdlbm9tZVRlc3RWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnKSxcbiAgUGVuVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL3BlbicpLFxuICBTdGF0c1ZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9zdGF0cycpXG59O1xuXG4iLCJjb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKCkgPT4ge1xuICBsZXQgd2lkdGg9MjMsXG4gICAgICBoZWlnaHQ9MTI2LFxuICAgICAgc3BsaXQ9NDUsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQsXG4gICAgICBjb2xvciA9IFwiI0ZGOTk5OVwiO1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzJ9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtoZWlnaHQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhzcGxpdC1yYWRpdXMpLShyYWRpdXMrMil9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPVwiMlwiICAgICAgIHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZUltYWdlVmlldztcbiIsImxldCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gcmVxdWlyZSgnLi9jaHJvbW9zb21lLWltYWdlJyksXG4gICAgR2VuZUxhYmVsVmlldyAgICAgICA9IHJlcXVpcmUoJy4vZ2VuZS1sYWJlbCcpLFxuXG4gICAgZmlsdGVyQWxsZWxlcyA9IGZ1bmN0aW9uKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIHNwZWNpZXMpIHtcbiAgICAgIGxldCBoaWRkZW5HZW5lcyA9IGhpZGRlbkFsbGVsZXMubWFwKCBhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSkpO1xuICAgICAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKCBhID0+IHtcbiAgICAgICAgbGV0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpO1xuICAgICAgICByZXR1cm4gaGlkZGVuR2VuZXMuaW5kZXhPZihnZW5lKSA9PT0gLTE7XG4gICAgICB9KTtcbiAgICB9O1xuXG5jb25zdCBDaHJvbW9zb21lVmlldyA9ICh7b3JnLCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgaGlkZGVuQWxsZWxlcz1bXSwgYWxsZWxlQ2hhbmdlZCwgbGFiZWxzT25SaWdodD10cnVlfSkgPT4ge1xuICBsZXQgYWxsZWxlcyA9IG9yZy5nZXRHZW5vdHlwZSgpLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXVtzaWRlXS5hbGxlbGVzLFxuICAgICAgdmlzaWJsZUFsbGVsZXMgPSBmaWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIG9yZy5zcGVjaWVzKSxcbiAgICAgIGxhYmVscyAgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEdlbmVMYWJlbFZpZXcga2V5PXthfSBzcGVjaWVzPXtvcmcuc3BlY2llc30gYWxsZWxlPXthfSBlZGl0YWJsZT17dHJ1ZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoYSwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICAgICk7XG4gICAgICB9KSxcblxuICAgICAgY29udGFpbmVyQ2xhc3MgPSBcIml0ZW1zXCI7XG5cbiAgaWYgKCFsYWJlbHNPblJpZ2h0KSB7XG4gICAgY29udGFpbmVyQ2xhc3MgKz0gXCIgcnRsXCI7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsc1wiPlxuICAgICAgICAgIHsgbGFiZWxzIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNocm9tb3NvbWVOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpZGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYWJlbHNPblJpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZVZpZXc7XG4iLCJjb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGxldCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlIG5vbmVkaXRhYmxlXCI+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHsgYWxsZWxlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZVwiPlxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgYWxsZWxlIH0gb25DaGFuZ2U9eyBvbkFsbGVsZUNoYW5nZSB9PlxuICAgICAgICAgIHsgYWxsZWxlT3B0aW9ucyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvbkFsbGVsZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImxldCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gcmVxdWlyZSgnLi9jaHJvbW9zb21lLWltYWdlJyksXG4gICAgZmlsdGVyQWxsZWxlcyA9IGZ1bmN0aW9uKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIHNwZWNpZXMpIHtcbiAgICAgIGxldCBoaWRkZW5HZW5lcyA9IGhpZGRlbkFsbGVsZXMubWFwKCBhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSkpO1xuICAgICAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKCBhID0+IHtcbiAgICAgICAgbGV0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpO1xuICAgICAgICByZXR1cm4gaGlkZGVuR2VuZXMuaW5kZXhPZihnZW5lKSA9PT0gLTE7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIFRlc3RQdWxsZG93blZpZXcgPSAoe3NwZWNpZXMsIGdlbmUsIHNlbGVjdGlvbiwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gICAgICBsZXQgYWxsZWxlcyA9IGdlbmUuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgbnVtQWxsZWxlcyA9IGFsbGVsZU5hbWVzLmxlbmd0aCxcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcyA9IFtdLFxuICAgICAgICAgIGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb24gfHwgXCJwbGFjZWhvbGRlclwiLFxuICAgICAgICAgIGksIGo7XG5cbiAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9XCJwbGFjZWhvbGRlclwiIHZhbHVlPVwicGxhY2Vob2xkZXJcIiBkaXNhYmxlZD1cImRpc2FibGVkXCI+U2VsZWN0IGEgR2Vub3R5cGU8L29wdGlvbj4pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQWxsZWxlczsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IGk7IGogPCBudW1BbGxlbGVzOyBqKyspIHtcbiAgICAgICAgICBsZXQga2V5ID0gaSArIFwiIFwiICsgaixcbiAgICAgICAgICAgICAgc3RyaW5nID0gYWxsZWxlTmFtZXNbaV0gKyBcIiAvIFwiICsgYWxsZWxlTmFtZXNbal07XG4gICAgICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT17a2V5fSB2YWx1ZT17a2V5fT57c3RyaW5nfTwvb3B0aW9uPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGN1cnJlbnRTZWxlY3Rpb24gfSBvbkNoYW5nZT17IG9uU2VsZWN0aW9uQ2hhbmdlIH0+XG4gICAgICAgICAgeyBwb3NzaWJsZUNvbWJvcyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgKTtcbiAgICB9O1xuXG5jb25zdCBHZW5vbWVUZXN0VmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzPVtdLCBzZWxlY3Rpb249e30sIHNlbGVjdGlvbkNoYW5nZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgYWxsZWxlcyA9IGNocm9tW09iamVjdC5rZXlzKGNocm9tKVswXV0uYWxsZWxlcyxcbiAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBmaWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIG9yZy5zcGVjaWVzKSxcbiAgICAgICAgZ2VuZXMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKG9yZy5zcGVjaWVzLCBhKSksXG4gICAgICAgIHB1bGxkb3ducyA9IGdlbmVzLm1hcChnID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRlc3RQdWxsZG93blZpZXdcbiAgICAgICAgICAgICAga2V5ICAgICAgID0geyBnLm5hbWUgfVxuICAgICAgICAgICAgICBzcGVjaWVzICAgPSB7IG9yZy5zcGVjaWVzIH1cbiAgICAgICAgICAgICAgZ2VuZSAgICAgID0geyBnIH1cbiAgICAgICAgICAgICAgc2VsZWN0aW9uID0geyBzZWxlY3Rpb25bZy5uYW1lXSB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlID0geyBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQoZywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgfSB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1zXCI+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2Vub21lLXRlc3Qtb3B0aW9uc1wiPlxuICAgICAgICAgIHsgcHVsbGRvd25zIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbm9tZS10ZXN0XCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5UZXN0UHVsbGRvd25WaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBnZW5lOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHNlbGVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbkdlbm9tZVRlc3RWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgc2VsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBzZWxlY3Rpb25DaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVUZXN0VmlldztcbiIsImxldCBDaHJvbW9zb21lVmlldyA9IHJlcXVpcmUoJy4vY2hyb21vc29tZScpO1xuXG5jb25zdCBHZW5vbWVWaWV3ID0gKHtvcmcsIGhpZGRlbkFsbGVsZXMgPSBbXSwgYWxsZWxlQ2hhbmdlZH0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBwYWlycyA9IFtdO1xuICAgIGZvciAobGV0IHNpZGUgaW4gY2hyb20pIHtcbiAgICAgIHBhaXJzLnB1c2goXG4gICAgICAgIDxDaHJvbW9zb21lVmlld1xuICAgICAgICAgIG9yZz17b3JnfVxuICAgICAgICAgIGtleT17cGFpcnMubGVuZ3RoICsgMX1cbiAgICAgICAgICBjaHJvbW9zb21lTmFtZT17Y2hyb21vc29tZU5hbWV9XG4gICAgICAgICAgc2lkZT17c2lkZX1cbiAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgIGxhYmVsc09uUmlnaHQ9e3BhaXJzLmxlbmd0aD4wfVxuICAgICAgICAgIGFsbGVsZUNoYW5nZWQ9e2Z1bmN0aW9uKHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChjaHJvbW9zb21lTmFtZSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgICB9fS8+XG4gICAgICApO1xuICAgIH1cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYga2V5PXtwYWlyV3JhcHBlcnMubGVuZ3RoICsgMX0+XG4gICAgICAgIHsgcGFpcnMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWVcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdlbm9tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVWaWV3O1xuIiwiY29uc3QgT3JnYW5pc21WaWV3ID0gKHtvcmcsIHdpZHRoPTIwMH0pID0+IHtcbiAgbGV0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgIHVybCAgICAgPSBiYXNlVXJsKyBvcmcuZ2V0SW1hZ2VOYW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIj5cbiAgICAgIDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0vPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbVZpZXc7XG4iLCJsZXQgT3JnYW5pc21WaWV3ID0gcmVxdWlyZSgnLi9vcmdhbmlzbScpO1xuXG5jb25zdCBQZW5WaWV3ID0gKHtvcmdzLCB3aWR0aD00MDAsIGNvbHVtbnM9NX0pID0+IHtcbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZywgaW5kZXgpID0+ICg8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBrZXk9e2luZGV4fSB3aWR0aD17b3JnV2lkdGh9Lz4pKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBwZW5cIj5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUGVuVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBjb2x1bW5zOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQZW5WaWV3O1xuIiwiLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYnJlZWRpbmcgc3RhdGlzdGljcyBmb3IgYSBzZXQgb2YgQmlvbG9naWNhIG9yZ2FuaXNtc1xuICogQHBhcmFtIHtPYmplY3RbXX0gb3JncyAtIGFycmF5IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXMgZm9yIHdoaWNoIHN0YXRpc3RpY3MgYXJlIHRvIGJlIGRpc3BsYXllZFxuICogQHBhcmFtIHtPYmplY3R9IG9yZ3NbXS5waGVub3R5cGUgLSB0aGUgcGhlbm90eXBlIG9mIHRoZSBCaW9sb2dpY2Egb3JnYW5pc21cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGFzdENsdXRjaFNpemU9b3Jncy5sZW5ndGhdIC0gdGhlIG51bWJlciBvZiBvcmdhbmlzbXMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkgdGhhdCBjb21wcmlzZSB0aGUgbW9zdCByZWNlbnQgY2x1dGNoXG4gKi9cbmNvbnN0IFN0YXRzVmlldyA9ICh7b3JncywgbGFzdENsdXRjaFNpemV9KSA9PiB7XG5cbiAgbGV0IHRyYWl0cyA9IG5ldyBNYXAsXG4gICAgICByb3dzID0gW107XG5cbiAgLy8gaWYgbm8gc2l6ZSBzcGVjaWZpZWQsIGFzc3VtZSB0aGVyZSdzIG9ubHkgb25lIGNsdXRjaFxuICBpZiAoIWxhc3RDbHV0Y2hTaXplKSBsYXN0Q2x1dGNoU2l6ZSA9IG9yZ3MubGVuZ3RoO1xuXG4gIC8vIGFjY3VtdWxhdGUgc3RhdHMgZm9yIGVhY2ggdHJhaXQvdmFsdWUgY29tYmluYXRpb25cbiAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3Jncy5lbnRyaWVzKCkpIHtcbiAgICBjb25zdCBjbHV0Y2hLZXkgPSAnYycgKyBvcmcuc2V4O1xuICAgIGZvciAoY29uc3QgdHJhaXQgb2YgT2JqZWN0LmtleXMob3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MpKSB7XG4gICAgICBsZXQgdmFsdWUgPSBvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljc1t0cmFpdF0sXG4gICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgIHZhbHVlQ291bnRzID0gdHJhaXRWYWx1ZXMuZ2V0KHZhbHVlKSB8fCBuZXcgTWFwO1xuICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgaWYgKCF0cmFpdFZhbHVlcy5oYXModmFsdWUpKSB0cmFpdFZhbHVlcy5zZXQodmFsdWUsIHZhbHVlQ291bnRzKTtcbiAgICAgIC8vIG1vc3QgcmVjZW50IGNsdXRjaCBhc3N1bWVkIHRvIGJlIGF0IGVuZCBvZiBvcmdhbmlzbXMgYXJyYXlcbiAgICAgIGlmIChpbmRleCA+PSBvcmdzLmxlbmd0aCAtIGxhc3RDbHV0Y2hTaXplKVxuICAgICAgICB2YWx1ZUNvdW50cy5zZXQoY2x1dGNoS2V5LCAodmFsdWVDb3VudHMuZ2V0KGNsdXRjaEtleSkgfHwgMCkgKyAxKTtcbiAgICAgIHZhbHVlQ291bnRzLnNldChvcmcuc2V4LCAodmFsdWVDb3VudHMuZ2V0KG9yZy5zZXgpIHx8IDApICsgMSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYnVpbGQgY3VtdWxhdGl2ZSBzdGF0cyBmb3IgdGFibGUgcm93c1xuICBsZXQgdHJhaXROdW0gPSAwO1xuICBmb3IgKGNvbnN0IFt0cmFpdCwgdmFsdWVzXSBvZiB0cmFpdHMpIHtcbiAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgY291bnRzXSBvZiB2YWx1ZXMpIHtcbiAgICAgIGNvbnN0IGNNYWxlcyA9IGNvdW50cy5nZXQoJ2MnICsgQmlvTG9naWNhLk1BTEUpIHx8IDAsXG4gICAgICAgICAgICBjRmVtYWxlcyA9IGNvdW50cy5nZXQoJ2MnICsgQmlvTG9naWNhLkZFTUFMRSkgfHwgMCxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoIDEwMCAqIGNUb3RhbCAvIGxhc3RDbHV0Y2hTaXplKSxcbiAgICAgICAgICAgIHRNYWxlcyA9IGNvdW50cy5nZXQoQmlvTG9naWNhLk1BTEUpIHx8IDAsXG4gICAgICAgICAgICB0RmVtYWxlcyA9IGNvdW50cy5nZXQoQmlvTG9naWNhLkZFTUFMRSkgfHwgMCxcbiAgICAgICAgICAgIHRUb3RhbCA9IHRNYWxlcyArIHRGZW1hbGVzLFxuICAgICAgICAgICAgdFBjdCA9IE1hdGgucm91bmQoIDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiJdfQ==
