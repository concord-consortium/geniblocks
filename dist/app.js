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
  PenView: require('./components/pen')
};
module.exports = exports['default'];

},{"./components/chromosome":3,"./components/chromosome-image":2,"./components/gene-label":4,"./components/genome":5,"./components/organism":6,"./components/pen":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ChromosomeImageView = function ChromosomeImageView() {
  var width = 23,
      height = 170,
      split = 55,
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
    GeneLabelView = require('./gene-label');

var ChromosomeView = function ChromosomeView(_ref) {
  var org = _ref.org;
  var chromosomeName = _ref.chromosomeName;
  var side = _ref.side;
  var alleleChanged = _ref.alleleChanged;
  var _ref$labelsOnRight = _ref.labelsOnRight;
  var labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight;

  var alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      labels = alleles.map(function (a) {
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
      var alleles = BioLogica.Genetics.getGeneOfAllele(org.species, allele).alleles,
          alleleNames = alleles.map(function (a) {
        return org.species.alleleLabelMap[a];
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

exports["default"] = GeneLabelView;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ChromosomeView = require('./chromosome');

var GenomeView = function GenomeView(_ref) {
  var org = _ref.org;
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
          chromosomeName: chromosomeName,
          side: side,
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
        null,
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

exports["default"] = GenomeView;
module.exports = exports["default"];

},{"./chromosome":3}],6:[function(require,module,exports){
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

exports["default"] = OrganismView;
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
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
      orgViews = orgs.map(function (org) {
    return React.createElement(OrganismView, { org: org, width: orgWidth });
  });

  return React.createElement(
    "div",
    { className: "geniblocks pen" },
    orgViews
  );
};

exports["default"] = PenView;
module.exports = exports["default"];

},{"./organism":6}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvYXBwLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsIi9Vc2Vycy9zZmVudHJlc3MvcHJvamVjdHMvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20uanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztxQkNDZ0I7QUFDZCxjQUFZLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixDQUFDO0FBQzlDLHFCQUFtQixFQUFFLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQztBQUM3RCxnQkFBYyxFQUFFLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztBQUNsRCxlQUFhLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQ2pELFlBQVUsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFDMUMsU0FBTyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztDQUNyQzs7Ozs7Ozs7O0FDUkQsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsR0FBUztBQUNoQyxNQUFJLEtBQUssR0FBQyxFQUFFO01BQ1IsTUFBTSxHQUFDLEdBQUc7TUFDVixLQUFLLEdBQUMsRUFBRTtNQUNSLE1BQU0sR0FBRyxLQUFLLEdBQUMsQ0FBQztNQUNoQixVQUFVLEdBQUcsS0FBSyxHQUFDLENBQUM7TUFDcEIsY0FBYyxHQUFHLFVBQVUsR0FBQyxDQUFDO01BQzdCLFdBQVcsR0FBRyxNQUFNLEdBQUMsQ0FBQztNQUN0QixLQUFLLEdBQUcsU0FBUyxDQUFDOztBQUV0QixTQUNFOztNQUFLLEtBQUssRUFBRSxVQUFVLEFBQUMsRUFBQyxNQUFNLEVBQUUsV0FBVyxBQUFDLEVBQUMsS0FBSyxFQUFDLDRCQUE0QjtJQUM3RTs7O01BQ0UsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUMsQ0FBQyxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDcEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDeEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDeEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxH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QUMsR0FBRTtHQUMxQixDQUNOO0NBQ0gsQ0FBQTs7cUJBRWMsWUFBWTs7Ozs7Ozs7O0FDWDNCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFekMsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksSUFBNEIsRUFBSztNQUFoQyxJQUFJLEdBQUwsSUFBNEIsQ0FBM0IsSUFBSTttQkFBTCxJQUE0QixDQUFyQixLQUFLO01BQUwsS0FBSyw4QkFBQyxHQUFHO3FCQUFoQixJQUE0QixDQUFWLE9BQU87TUFBUCxPQUFPLGdDQUFDLENBQUM7O0FBQzFDLE1BQUksUUFBUSxHQUFHLEtBQUssR0FBQyxPQUFPO01BQ3hCLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRztXQUFNLG9CQUFDLFlBQVksSUFBQyxHQUFHLEVBQUUsR0FBRyxBQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsQUFBQyxHQUFFO0dBQUMsQ0FBQyxDQUFDOztBQUUvRSxTQUNFOztNQUFLLFNBQVMsRUFBQyxnQkFBZ0I7SUFDM0IsUUFBUTtHQUNOLENBQ047Q0FDSCxDQUFBOztxQkFFYyxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuZXhwb3J0IGRlZmF1bHQgIHtcbiAgT3JnYW5pc21WaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvb3JnYW5pc20nKSxcbiAgQ2hyb21vc29tZUltYWdlVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUtaW1hZ2UnKSxcbiAgQ2hyb21vc29tZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaHJvbW9zb21lJyksXG4gIEdlbmVMYWJlbFZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJyksXG4gIEdlbm9tZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nZW5vbWUnKSxcbiAgUGVuVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL3BlbicpXG59XG5cbiIsImNvbnN0IENocm9tb3NvbWVJbWFnZVZpZXcgPSAoKSA9PiB7XG4gIGxldCB3aWR0aD0yMyxcbiAgICAgIGhlaWdodD0xNzAsXG4gICAgICBzcGxpdD01NSxcbiAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBpbWFnZVdpZHRoID0gd2lkdGgrNCxcbiAgICAgIGhhbGZJbWFnZVdpZHRoID0gaW1hZ2VXaWR0aC8yLFxuICAgICAgaW1hZ2VIZWlnaHQgPSBoZWlnaHQrNCxcbiAgICAgIGNvbG9yID0gXCIjRkY5OTk5XCI7XG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXtpbWFnZVdpZHRofSBoZWlnaHQ9e2ltYWdlSGVpZ2h0fSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMn0gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQrcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e2hlaWdodC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKX0gd2lkdGg9e3dpZHRofSB5PXtyYWRpdXMrMn0geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPHJlY3QgaGVpZ2h0PXsoaGVpZ2h0LXJhZGl1cyktKHNwbGl0K3JhZGl1cyl9IHdpZHRoPXt3aWR0aH0geT17c3BsaXQrcmFkaXVzfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT1cIjJcIiAgICAgICB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9e3dpZHRoKzJ9IHkyPXtzcGxpdC1yYWRpdXMrMn0gIHgyPXt3aWR0aCsyfSBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPXt3aWR0aCsyfSB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJsZXQgQ2hyb21vc29tZUltYWdlVmlldyA9IHJlcXVpcmUoJy4vY2hyb21vc29tZS1pbWFnZScpLFxuICAgIEdlbmVMYWJlbFZpZXcgICAgICAgPSByZXF1aXJlKCcuL2dlbmUtbGFiZWwnKTtcblxuY29uc3QgQ2hyb21vc29tZVZpZXcgPSAoe29yZywgY2hyb21vc29tZU5hbWUsIHNpZGUsIGFsbGVsZUNoYW5nZWQsIGxhYmVsc09uUmlnaHQ9dHJ1ZX0pID0+IHtcbiAgbGV0IGFsbGVsZXMgPSBvcmcuZ2V0R2Vub3R5cGUoKS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV1bc2lkZV0uYWxsZWxlcyxcbiAgICAgIGxhYmVscyAgPSBhbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZChhLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgfX0vPlxuICAgICAgICApO1xuICAgICAgfSksXG5cbiAgICAgIGNvbnRhaW5lckNsYXNzID0gXCJpdGVtc1wiO1xuXG4gIGlmICghbGFiZWxzT25SaWdodCkge1xuICAgIGNvbnRhaW5lckNsYXNzICs9IFwiIHJ0bFwiO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29udGFpbmVyQ2xhc3MgfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYWJlbHNcIj5cbiAgICAgICAgICB7IGxhYmVscyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVWaWV3O1xuIiwiY29uc3QgR2VuZUxhYmVsVmlldyA9ICh7c3BlY2llcywgYWxsZWxlLCBlZGl0YWJsZSwgb25BbGxlbGVDaGFuZ2V9KSA9PiB7XG4gIGlmICghZWRpdGFibGUpIHtcbiAgICBsZXQgYWxsZWxlTmFtZSA9IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZSBub25lZGl0YWJsZVwiPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7IGFsbGVsZU5hbWUgfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxldCBhbGxlbGVzID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYWxsZWxlKS5hbGxlbGVzLFxuICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gb3JnLnNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlXCI+XG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBhbGxlbGUgfSBvbkNoYW5nZT17IG9uQWxsZWxlQ2hhbmdlIH0+XG4gICAgICAgICAgeyBhbGxlbGVPcHRpb25zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVMYWJlbFZpZXc7XG4iLCJsZXQgQ2hyb21vc29tZVZpZXcgPSByZXF1aXJlKCcuL2Nocm9tb3NvbWUnKTtcblxuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBhbGxlbGVDaGFuZ2VkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgcGFpcnMucHVzaChcbiAgICAgICAgPENocm9tb3NvbWVWaWV3XG4gICAgICAgICAgb3JnPXtvcmd9XG4gICAgICAgICAgY2hyb21vc29tZU5hbWU9e2Nocm9tb3NvbWVOYW1lfVxuICAgICAgICAgIHNpZGU9e3NpZGV9XG4gICAgICAgICAgbGFiZWxzT25SaWdodD17cGFpcnMubGVuZ3RoPjB9XG4gICAgICAgICAgYWxsZWxlQ2hhbmdlZD17ZnVuY3Rpb24ocHJldkFsbGVsZSwgbmV3QWxsZWxlKSB7XG4gICAgICAgICAgICBhbGxlbGVDaGFuZ2VkKGNocm9tb3NvbWVOYW1lLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICk7XG4gICAgfVxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdj5cbiAgICAgICAgeyBwYWlycyB9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbm9tZVwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVWaWV3O1xuIiwiY29uc3QgT3JnYW5pc21WaWV3ID0gKHtvcmcsIHdpZHRoPTIwMH0pID0+IHtcbiAgbGV0IGJhc2VVcmwgPSBcImh0dHBzOi8vZ2VuaXZlcnNlLXJlc291cmNlcy5jb25jb3JkLm9yZy9yZXNvdXJjZXMvZHJha2VzL2ltYWdlcy9cIixcbiAgICAgIHVybCAgICAgPSBiYXNlVXJsKyBvcmcuZ2V0SW1hZ2VOYW1lKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIj5cbiAgICAgIDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0vPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbVZpZXc7XG4iLCJsZXQgT3JnYW5pc21WaWV3ID0gcmVxdWlyZSgnLi9vcmdhbmlzbScpO1xuXG5jb25zdCBQZW5WaWV3ID0gKHtvcmdzLCB3aWR0aD00MDAsIGNvbHVtbnM9NX0pID0+IHtcbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZykgPT4gKDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IHdpZHRoPXtvcmdXaWR0aH0vPikpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHBlblwiPlxuICAgICAgeyBvcmdWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBlblZpZXc7XG4iXX0=
