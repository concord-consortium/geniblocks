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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvYXBwLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsIi9Vc2Vycy9zZmVudHJlc3MvcHJvamVjdHMvZ2VuaWJsb2Nrcy9zcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwiL1VzZXJzL3NmZW50cmVzcy9wcm9qZWN0cy9nZW5pYmxvY2tzL3NyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20uanMiLCIvVXNlcnMvc2ZlbnRyZXNzL3Byb2plY3RzL2dlbmlibG9ja3Mvc3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztxQkNDZ0I7QUFDZCxjQUFZLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixDQUFDO0FBQzlDLHFCQUFtQixFQUFFLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQztBQUM3RCxnQkFBYyxFQUFFLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztBQUNsRCxlQUFhLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQ2pELFlBQVUsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7QUFDMUMsU0FBTyxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztDQUNyQzs7Ozs7Ozs7O0FDUkQsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsR0FBUztBQUNoQyxNQUFJLEtBQUssR0FBQyxFQUFFO01BQ1IsTUFBTSxHQUFDLEdBQUc7TUFDVixLQUFLLEdBQUMsRUFBRTtNQUNSLE1BQU0sR0FBRyxLQUFLLEdBQUMsQ0FBQztNQUNoQixVQUFVLEdBQUcsS0FBSyxHQUFDLENBQUM7TUFDcEIsY0FBYyxHQUFHLFVBQVUsR0FBQyxDQUFDO01BQzdCLFdBQVcsR0FBRyxNQUFNLEdBQUMsQ0FBQztNQUN0QixLQUFLLEdBQUcsU0FBUyxDQUFDOztBQUV0QixTQUNFOztNQUFLLEtBQUssRUFBRSxVQUFVLEFBQUMsRUFBQyxNQUFNLEVBQUUsV0FBVyxBQUFDLEVBQUMsS0FBSyxFQUFDLDRCQUE0QjtJQUM3RTs7O01BQ0UsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUMsQ0FBQyxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDcEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDeEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUUsS0FBSyxBQUFDLEdBQUU7TUFDeEcsZ0NBQVEsQ0FBQyxFQUFFLE1BQU0sQUFBQyxFQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUMsTUFBTSxBQUFDLEVBQUMsRUFBRSxFQUFFLGNBQWMsQUFBQyxFQUFDLFdBQVcsRUFBQyxH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QUNILENBQUE7O3FCQUVjLFlBQVk7Ozs7Ozs7OztBQ1gzQixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXpDLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLElBQTRCLEVBQUs7TUFBaEMsSUFBSSxHQUFMLElBQTRCLENBQTNCLElBQUk7bUJBQUwsSUFBNEIsQ0FBckIsS0FBSztNQUFMLEtBQUssOEJBQUMsR0FBRztxQkFBaEIsSUFBNEIsQ0FBVixPQUFPO01BQVAsT0FBTyxnQ0FBQyxDQUFDOztBQUMxQyxNQUFJLFFBQVEsR0FBRyxLQUFLLEdBQUMsT0FBTztNQUN4QixRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUc7V0FBTSxvQkFBQyxZQUFZLElBQUMsR0FBRyxFQUFFLEdBQUcsQUFBQyxFQUFDLEtBQUssRUFBRSxRQUFRLEFBQUMsR0FBRTtHQUFDLENBQUMsQ0FBQzs7QUFFL0UsU0FDRTs7TUFBSyxTQUFTLEVBQUMsZ0JBQWdCO0lBQzNCLFFBQVE7R0FDTixDQUNOO0NBQ0gsQ0FBQTs7cUJBRWMsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmV4cG9ydCBkZWZhdWx0ICB7XG4gIE9yZ2FuaXNtVmlldzogcmVxdWlyZSgnLi9jb21wb25lbnRzL29yZ2FuaXNtJyksXG4gIENocm9tb3NvbWVJbWFnZVZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJyksXG4gIENocm9tb3NvbWVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hyb21vc29tZScpLFxuICBHZW5lTGFiZWxWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCcpLFxuICBHZW5vbWVWaWV3OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ2Vub21lJyksXG4gIFBlblZpZXc6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9wZW4nKVxufVxuXG4iLCJjb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKCkgPT4ge1xuICBsZXQgd2lkdGg9MjMsXG4gICAgICBoZWlnaHQ9MTcwLFxuICAgICAgc3BsaXQ9NTUsXG4gICAgICByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQsXG4gICAgICBjb2xvciA9IFwiI0ZGOTk5OVwiO1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzJ9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtoZWlnaHQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhzcGxpdC1yYWRpdXMpLShyYWRpdXMrMil9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxyZWN0IGhlaWdodD17KGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPVwiMlwiICAgICAgIHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lSW1hZ2VWaWV3O1xuIiwibGV0IENocm9tb3NvbWVJbWFnZVZpZXcgPSByZXF1aXJlKCcuL2Nocm9tb3NvbWUtaW1hZ2UnKSxcbiAgICBHZW5lTGFiZWxWaWV3ICAgICAgID0gcmVxdWlyZSgnLi9nZW5lLWxhYmVsJyk7XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBhbGxlbGVDaGFuZ2VkLCBsYWJlbHNPblJpZ2h0PXRydWV9KSA9PiB7XG4gIGxldCBhbGxlbGVzID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdLmFsbGVsZXMsXG4gICAgICBsYWJlbHMgID0gYWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEdlbmVMYWJlbFZpZXcga2V5PXthfSBzcGVjaWVzPXtvcmcuc3BlY2llc30gYWxsZWxlPXthfSBlZGl0YWJsZT17dHJ1ZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoYSwgZXZlbnQudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pLFxuXG4gICAgICBjb250YWluZXJDbGFzcyA9IFwiaXRlbXNcIjtcblxuICBpZiAoIWxhYmVsc09uUmlnaHQpIHtcbiAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbnRhaW5lckNsYXNzIH0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImNvbnN0IEdlbmVMYWJlbFZpZXcgPSAoe3NwZWNpZXMsIGFsbGVsZSwgZWRpdGFibGUsIG9uQWxsZWxlQ2hhbmdlfSkgPT4ge1xuICBpZiAoIWVkaXRhYmxlKSB7XG4gICAgbGV0IGFsbGVsZU5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUgbm9uZWRpdGFibGVcIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgeyBhbGxlbGVOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgYWxsZWxlcyA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYWxsZWxlKS5hbGxlbGVzLFxuICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgIGFsbGVsZU9wdGlvbnMgPSBhbGxlbGVOYW1lcy5tYXAoKG5hbWUsIGkpID0+ICg8b3B0aW9uIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZXNbaV19PntuYW1lfTwvb3B0aW9uPikpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGVcIj5cbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGFsbGVsZSB9IG9uQ2hhbmdlPXsgb25BbGxlbGVDaGFuZ2UgfT5cbiAgICAgICAgICB7IGFsbGVsZU9wdGlvbnMgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImxldCBDaHJvbW9zb21lVmlldyA9IHJlcXVpcmUoJy4vY2hyb21vc29tZScpO1xuXG5jb25zdCBHZW5vbWVWaWV3ID0gKHtvcmcsIGFsbGVsZUNoYW5nZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBwYWlycy5wdXNoKFxuICAgICAgICA8Q2hyb21vc29tZVZpZXdcbiAgICAgICAgICBvcmc9e29yZ31cbiAgICAgICAgICBjaHJvbW9zb21lTmFtZT17Y2hyb21vc29tZU5hbWV9XG4gICAgICAgICAgc2lkZT17c2lkZX1cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MH1cbiAgICAgICAgICBhbGxlbGVDaGFuZ2VkPXtmdW5jdGlvbihwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgICAgIGFsbGVsZUNoYW5nZWQoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2PlxuICAgICAgICB7IHBhaXJzIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lXCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVZpZXc7XG4iLCJjb25zdCBPcmdhbmlzbVZpZXcgPSAoe29yZywgd2lkdGg9MjAwfSkgPT4ge1xuICBsZXQgYmFzZVVybCA9IFwiaHR0cHM6Ly9nZW5pdmVyc2UtcmVzb3VyY2VzLmNvbmNvcmQub3JnL3Jlc291cmNlcy9kcmFrZXMvaW1hZ2VzL1wiLFxuICAgICAgdXJsICAgICA9IGJhc2VVcmwrIG9yZy5nZXRJbWFnZU5hbWUoKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBvcmdhbmlzbVwiPlxuICAgICAgPGltZyBzcmM9e3VybH0gd2lkdGg9e3dpZHRofS8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtVmlldztcbiIsImxldCBPcmdhbmlzbVZpZXcgPSByZXF1aXJlKCcuL29yZ2FuaXNtJyk7XG5cbmNvbnN0IFBlblZpZXcgPSAoe29yZ3MsIHdpZHRoPTQwMCwgY29sdW1ucz01fSkgPT4ge1xuICBsZXQgb3JnV2lkdGggPSB3aWR0aC9jb2x1bW5zLFxuICAgICAgb3JnVmlld3MgPSBvcmdzLm1hcCgob3JnKSA9PiAoPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gd2lkdGg9e29yZ1dpZHRofS8+KSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiJdfQ==
