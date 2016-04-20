'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Case 5 Certification Challenge
 *
 * The code in this module was written to support a recreation of the certification
 * challenge from Case 5 in Geniverse. The challenge is to choose a set of alleles
 * for the mother drake, breed a clutch of offspring, and then use the results to
 * deduce the alleles of the father drake.
 */
/* global DrakeGenomeColumn */
//import DrakeGenomeColumn from '../js/parent-genome-column';

var kHiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    kFatherAlleles = "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog",
    kInitialMotherAlleles = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
    kClutchSize = 20;

/**
 * Center panel has breed button and breeding pen
 */

var BreedButtonAndPenView = function (_React$Component) {
  _inherits(BreedButtonAndPenView, _React$Component);

  function BreedButtonAndPenView() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, BreedButtonAndPenView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(BreedButtonAndPenView)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.breed = function () {
      _this.setState({ selectedIndex: null });
      if (_this.props.handleBreed) _this.props.handleBreed();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BreedButtonAndPenView, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var clutch = _props.clutch;
      var clutchSize = _props.clutchSize;

      return React.createElement(
        'div',
        { id: 'center', className: 'column' },
        React.createElement(GeniBlocks.Button, { id: 'breed-button', label: 'Breed', onClick: this.breed }),
        React.createElement(GeniBlocks.PenStatsView, { id: 'breeding-pen', orgs: clutch, lastClutchSize: clutchSize })
      );
    }
  }]);

  return BreedButtonAndPenView;
}(React.Component);

/*
 * Right panel has father drake, "Ready to answer" button, and overlay test
 */


BreedButtonAndPenView.propTypes = {
  clutch: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  clutchSize: React.PropTypes.number.isRequired,
  handleBreed: React.PropTypes.func.isRequired
};

var Case5RightColumn = function (_React$Component2) {
  _inherits(Case5RightColumn, _React$Component2);

  function Case5RightColumn() {
    _classCallCheck(this, Case5RightColumn);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Case5RightColumn).apply(this, arguments));
  }

  _createClass(Case5RightColumn, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props2 = this.props;
      var toggleTest = _props2.toggleTest;
      var checkAnswer = _props2.checkAnswer;

      document.getElementsByClassName("toggle-test-button")[0].onclick = toggleTest;
      document.getElementsByClassName("toggle-test-button")[1].onclick = toggleTest;
      document.getElementById("submit-button").onclick = checkAnswer;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var org = _props3.org;
      var hiddenAlleles = _props3.hiddenAlleles;
      var testSelection = _props3.testSelection;
      var handleGeneSelected = _props3.handleGeneSelected;


      return React.createElement(
        'div',
        { id: 'right', className: 'column' },
        React.createElement(
          'div',
          { id: 'father-drake-label', className: 'column-label' },
          'Male Drake'
        ),
        React.createElement(GeniBlocks.OrganismGlowView, { org: org, id: 'father', size: 200, color: '#FFFFAA' }),
        React.createElement(
          'div',
          { id: 'father-genome-unknown' },
          '?'
        ),
        React.createElement(
          'div',
          { id: 'test-wrapper' },
          React.createElement(GeniBlocks.GenomeTestView, { id: 'father-genome-test',
            org: org, hiddenAlleles: hiddenAlleles,
            selection: testSelection,
            selectionChanged: handleGeneSelected }),
          React.createElement(GeniBlocks.Button, { className: 'toggle-test-button', label: 'Return to Lab' }),
          React.createElement(GeniBlocks.Button, { id: 'submit-button', label: 'Submit!' })
        ),
        React.createElement(GeniBlocks.Button, { className: 'toggle-test-button', label: 'Ready to answer' })
      );
    }
  }]);

  return Case5RightColumn;
}(React.Component);

/*
 * Case 5 combines the mother genome (left), breeding area (center), father genome test (right)
 */


Case5RightColumn.propTypes = {
  org: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  testSelection: React.PropTypes.object.isRequired,
  toggleTest: React.PropTypes.func.isRequired,
  handleGeneSelected: React.PropTypes.func.isRequired,
  checkAnswer: React.PropTypes.func.isRequired
};

var Case5 = function (_React$Component3) {
  _inherits(Case5, _React$Component3);

  function Case5(props) {
    _classCallCheck(this, Case5);

    /* eslint-disable react/no-direct-mutation-state */

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Case5).call(this, props));

    _this3.state = {
      mother: null,
      father: null,
      offspring: [],
      clutch: [],
      testSelection: {},
      isShowingTest: false
    };

    _this3.alleleChanged = function (chrom, side, prevAllele, newAllele) {
      var mother = _this3.state.mother;

      mother.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
      mother = new BioLogica.Organism(BioLogica.Species.Drake, mother.getAlleleString(), BioLogica.FEMALE);
      _this3.setState({ mother: mother, offspring: [], clutch: [] });
    };

    _this3.breed = function () {
      var clutchSize = _this3.props.clutchSize;
      var _this3$state = _this3.state;
      var offspring = _this3$state.offspring;
      var clutch = _this3$state.clutch;
      var count = clutchSize;
      clutch = [];
      while (count--) {
        var child = BioLogica.breed(_this3.state.mother, _this3.state.father);
        clutch.push(child);
        offspring.push(child);
      }
      _this3.setState({ offspring: offspring, clutch: clutch });
    };

    _this3.toggleTest = function () {
      var showingTest = _this3.state.showingTest;

      showingTest = !showingTest;
      _this3.setState({ showingTest: showingTest });

      var display = showingTest ? "block" : "none";
      document.getElementById("overlay").style.display = display;
      document.getElementById("test-wrapper").style.display = display;
    };

    _this3.handleGeneSelected = function (gene, newValue) {
      var testSelection = _this3.state.testSelection;

      testSelection[gene.name] = newValue;
      _this3.setState({ testSelection: testSelection });
    };

    _this3.checkAnswer = function () {
      var allSelectedAlleles = [],
          alleleString = _this3.state.father.getAlleleString(),
          alleleStringLength = alleleString.length,
          testAllele = void 0,
          success = true;

      // hard-coded check to see if user has made all four choices
      if (Object.keys(_this3.state.testSelection).length !== 4) {
        alert("First make a selection for all four genes!");
        return;
      }

      var _loop = function _loop(geneName) {
        var alleles = _this3.state.father.species.geneList[geneName].alleles,
            selectedAlleles = _this3.state.testSelection[geneName].split(" ").map(function (num) {
          return alleles[num];
        });
        allSelectedAlleles = allSelectedAlleles.concat(selectedAlleles);
      };

      for (var geneName in _this3.state.testSelection) {
        _loop(geneName);
      }
      while (success && (testAllele = allSelectedAlleles.pop())) {
        alleleString = alleleString.replace(':' + testAllele, "");
        if (alleleString.length === alleleStringLength) {
          success = false;
        }
        alleleStringLength = alleleString.length;
      }
      var message = success ? "That's right!" : "Sorry, that's not right";
      alert(message);
    };

    _this3.state.mother = new BioLogica.Organism(BioLogica.Species.Drake, props.initialMotherAlleles, BioLogica.FEMALE);
    _this3.state.father = new BioLogica.Organism(BioLogica.Species.Drake, props.fatherAlleles, BioLogica.MALE);
    return _this3;
  }

  _createClass(Case5, [{
    key: 'render',
    value: function render() {
      var _props4 = this.props;
      var hiddenAlleles = _props4.hiddenAlleles;
      var clutchSize = _props4.clutchSize;

      return React.createElement(
        'div',
        { className: 'column-wrapper' },
        React.createElement(DrakeGenomeColumn, {
          id: 'left', className: 'column',
          drake: this.state.mother, sex: 'female',
          isDrakeEditable: true,
          hiddenAlleles: hiddenAlleles,
          alleleChanged: this.alleleChanged }),
        React.createElement(BreedButtonAndPenView, { id: 'center', className: 'column',
          clutch: this.state.clutch, clutchSize: clutchSize,
          handleBreed: this.breed }),
        React.createElement(Case5RightColumn, { id: 'right', className: 'column',
          org: this.state.father, hiddenAlleles: hiddenAlleles,
          testSelection: this.state.testSelection,
          toggleTest: this.toggleTest,
          handleGeneSelected: this.handleGeneSelected,
          checkAnswer: this.checkAnswer })
      );
    }
  }]);

  return Case5;
}(React.Component);

/*
 * Global render function
 */


Case5.propTypes = {
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  initialMotherAlleles: React.PropTypes.string.isRequired,
  fatherAlleles: React.PropTypes.string.isRequired,
  clutchSize: React.PropTypes.number
};
Case5.defaultProps = {
  hiddenAlleles: [],
  clutchSize: 20
};
function render() {

  // Render Case5
  ReactDOM.render(React.createElement(Case5, {
    hiddenAlleles: kHiddenAlleles,
    fatherAlleles: kFatherAlleles,
    initialMotherAlleles: kInitialMotherAlleles,
    clutchSize: kClutchSize
  }), document.getElementById('wrapper'));
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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Q2pCLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSx3QkFBc0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ3RCLGlCQUFlLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNmLGNBQVksTUFBTSxTQUFOLENBQWdCLE1BQWhCOztBQU5WLE1BU0csZUFBZTtBQUNwQixpQkFBZSxFQUFmO0FBQ0EsY0FBWSxFQUFaOztBQWtISixTQUFTLE1BQVQsR0FBa0I7OztBQUdoQixXQUFTLE1BQVQsQ0FDRSxNQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7QUFDekIsbUJBQWUsY0FBZjtBQUNBLG1CQUFlLGNBQWY7QUFDQSwwQkFBc0IscUJBQXRCO0FBQ0EsZ0JBQVksV0FBWjtHQUpGLENBREYsRUFPRSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FQRixFQUhnQjtDQUFsQjs7QUFjQSxXQUFXLE1BQVgsQ0FBa0IsbUNBQWxCOztBQUVBIiwiZmlsZSI6ImNhc2UtNS9jYXNlLTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENhc2UgNSBDZXJ0aWZpY2F0aW9uIENoYWxsZW5nZVxuICpcbiAqIFRoZSBjb2RlIGluIHRoaXMgbW9kdWxlIHdhcyB3cml0dGVuIHRvIHN1cHBvcnQgYSByZWNyZWF0aW9uIG9mIHRoZSBjZXJ0aWZpY2F0aW9uXG4gKiBjaGFsbGVuZ2UgZnJvbSBDYXNlIDUgaW4gR2VuaXZlcnNlLiBUaGUgY2hhbGxlbmdlIGlzIHRvIGNob29zZSBhIHNldCBvZiBhbGxlbGVzXG4gKiBmb3IgdGhlIG1vdGhlciBkcmFrZSwgYnJlZWQgYSBjbHV0Y2ggb2Ygb2Zmc3ByaW5nLCBhbmQgdGhlbiB1c2UgdGhlIHJlc3VsdHMgdG9cbiAqIGRlZHVjZSB0aGUgYWxsZWxlcyBvZiB0aGUgZmF0aGVyIGRyYWtlLlxuICovXG4vKiBnbG9iYWwgRHJha2VHZW5vbWVDb2x1bW4gKi9cbi8vaW1wb3J0IERyYWtlR2Vub21lQ29sdW1uIGZyb20gJy4uL2pzL3BhcmVudC1nZW5vbWUtY29sdW1uJztcblxuY29uc3Qga0hpZGRlbkFsbGVsZXMgPSBbJ3QnLCd0aycsJ2gnLCdjJywnYScsJ2InLCdkJywnYm9nJywncmgnXSxcbiAgICAgIGtGYXRoZXJBbGxlbGVzID0gXCJhOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGE6RCxhOlcsYTpmbCxiOmZsLGE6SGwsYTp0LGI6VCxhOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBrSW5pdGlhbE1vdGhlckFsbGVsZXMgPSBcImE6bSxiOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6dyxiOlcsYTpGbCxiOkZsLGE6SGwsYjpobCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLFxuICAgICAga0NsdXRjaFNpemUgPSAyMDtcblxuLyoqXG4gKiBDZW50ZXIgcGFuZWwgaGFzIGJyZWVkIGJ1dHRvbiBhbmQgYnJlZWRpbmcgcGVuXG4gKi9cbmNsYXNzIEJyZWVkQnV0dG9uQW5kUGVuVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbHV0Y2g6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgY2x1dGNoU2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZUJyZWVkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBicmVlZCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRJbmRleDogbnVsbCB9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5oYW5kbGVCcmVlZClcbiAgICAgIHRoaXMucHJvcHMuaGFuZGxlQnJlZWQoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNsdXRjaCwgY2x1dGNoU2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImNlbnRlclwiIGNsYXNzTmFtZT1cImNvbHVtblwiPlxuICAgICAgICA8R2VuaUJsb2Nrcy5CdXR0b24gaWQ9XCJicmVlZC1idXR0b25cIiBsYWJlbD1cIkJyZWVkXCIgb25DbGljaz17dGhpcy5icmVlZH0gLz5cbiAgICAgICAgPEdlbmlCbG9ja3MuUGVuU3RhdHNWaWV3IGlkPVwiYnJlZWRpbmctcGVuXCIgb3Jncz17Y2x1dGNofSBsYXN0Q2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLypcbiAqIFJpZ2h0IHBhbmVsIGhhcyBmYXRoZXIgZHJha2UsIFwiUmVhZHkgdG8gYW5zd2VyXCIgYnV0dG9uLCBhbmQgb3ZlcmxheSB0ZXN0XG4gKi9cbmNsYXNzIENhc2U1UmlnaHRDb2x1bW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZykuaXNSZXF1aXJlZCxcbiAgICB0ZXN0U2VsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9nZ2xlVGVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVHZW5lU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hlY2tBbnN3ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHsgdG9nZ2xlVGVzdCwgY2hlY2tBbnN3ZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRvZ2dsZS10ZXN0LWJ1dHRvblwiKVswXS5vbmNsaWNrID0gdG9nZ2xlVGVzdDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidG9nZ2xlLXRlc3QtYnV0dG9uXCIpWzFdLm9uY2xpY2sgPSB0b2dnbGVUZXN0O1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0LWJ1dHRvblwiKS5vbmNsaWNrID0gY2hlY2tBbnN3ZXI7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvcmcsIGhpZGRlbkFsbGVsZXMsIHRlc3RTZWxlY3Rpb24sIGhhbmRsZUdlbmVTZWxlY3RlZCB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybihcbiAgICAgIDxkaXYgaWQ9J3JpZ2h0JyBjbGFzc05hbWU9J2NvbHVtbic+XG4gICAgICAgIHsvKiBwYXJlbnQgZHJha2UgbGFiZWwgKi99XG4gICAgICAgIDxkaXYgaWQ9J2ZhdGhlci1kcmFrZS1sYWJlbCcgY2xhc3NOYW1lPVwiY29sdW1uLWxhYmVsXCI+TWFsZSBEcmFrZTwvZGl2PlxuXG4gICAgICAgIDxHZW5pQmxvY2tzLk9yZ2FuaXNtR2xvd1ZpZXcgb3JnPXtvcmd9IGlkPSdmYXRoZXInIHNpemU9ezIwMH0gY29sb3I9JyNGRkZGQUEnIC8+XG4gICAgICAgIDxkaXYgaWQ9J2ZhdGhlci1nZW5vbWUtdW5rbm93bic+PzwvZGl2PlxuICAgICAgICA8ZGl2IGlkPSd0ZXN0LXdyYXBwZXInPlxuICAgICAgICAgIDxHZW5pQmxvY2tzLkdlbm9tZVRlc3RWaWV3IGlkPSdmYXRoZXItZ2Vub21lLXRlc3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmc9e29yZ30gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbj17dGVzdFNlbGVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ9e2hhbmRsZUdlbmVTZWxlY3RlZH0gLz5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5CdXR0b24gY2xhc3NOYW1lPSd0b2dnbGUtdGVzdC1idXR0b24nIGxhYmVsPVwiUmV0dXJuIHRvIExhYlwiIC8+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGlkPSdzdWJtaXQtYnV0dG9uJyBsYWJlbD1cIlN1Ym1pdCFcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGNsYXNzTmFtZT0ndG9nZ2xlLXRlc3QtYnV0dG9uJyBsYWJlbD1cIlJlYWR5IHRvIGFuc3dlclwiIC8+XG4gICAgICA8L2Rpdj4pO1xuICB9XG59XG5cbi8qXG4gKiBDYXNlIDUgY29tYmluZXMgdGhlIG1vdGhlciBnZW5vbWUgKGxlZnQpLCBicmVlZGluZyBhcmVhIChjZW50ZXIpLCBmYXRoZXIgZ2Vub21lIHRlc3QgKHJpZ2h0KVxuICovXG5jbGFzcyBDYXNlNSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBpbml0aWFsTW90aGVyQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGZhdGhlckFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhpZGRlbkFsbGVsZXM6IFtdLFxuICAgIGNsdXRjaFNpemU6IDIwXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBtb3RoZXI6IG51bGwsXG4gICAgZmF0aGVyOiBudWxsLFxuICAgIG9mZnNwcmluZzogW10sXG4gICAgY2x1dGNoOiBbXSxcbiAgICB0ZXN0U2VsZWN0aW9uOiB7fSxcbiAgICBpc1Nob3dpbmdUZXN0OiBmYWxzZVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kaXJlY3QtbXV0YXRpb24tc3RhdGUgKi9cbiAgICB0aGlzLnN0YXRlLm1vdGhlciA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIHByb3BzLmluaXRpYWxNb3RoZXJBbGxlbGVzLCBCaW9Mb2dpY2EuRkVNQUxFKTtcbiAgICB0aGlzLnN0YXRlLmZhdGhlciA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIHByb3BzLmZhdGhlckFsbGVsZXMsIEJpb0xvZ2ljYS5NQUxFKTtcbiAgfVxuXG4gIGFsbGVsZUNoYW5nZWQgPSAoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSkgPT4ge1xuICAgIGxldCB7IG1vdGhlciB9ID0gdGhpcy5zdGF0ZTtcbiAgICBtb3RoZXIuZ2VuZXRpY3MuZ2Vub3R5cGUucmVwbGFjZUFsbGVsZUNocm9tTmFtZShjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICBtb3RoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW90aGVyLmdldEFsbGVsZVN0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmlvTG9naWNhLkZFTUFMRSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1vdGhlciwgb2Zmc3ByaW5nOiBbXSwgY2x1dGNoOiBbXSB9KTtcbiAgfVxuXG4gIGJyZWVkID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgY2x1dGNoU2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgICB7IG9mZnNwcmluZywgY2x1dGNoIH0gPSB0aGlzLnN0YXRlLFxuICAgICAgICAgIGNvdW50ID0gY2x1dGNoU2l6ZTtcbiAgICBjbHV0Y2ggPSBbXTtcbiAgICB3aGlsZSAoY291bnQtLSkge1xuICAgICAgdmFyIGNoaWxkID0gQmlvTG9naWNhLmJyZWVkKHRoaXMuc3RhdGUubW90aGVyLCB0aGlzLnN0YXRlLmZhdGhlcik7XG4gICAgICBjbHV0Y2gucHVzaChjaGlsZCk7XG4gICAgICBvZmZzcHJpbmcucHVzaChjaGlsZCk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBvZmZzcHJpbmcsIGNsdXRjaCB9KTtcbiAgfVxuXG4gIHRvZ2dsZVRlc3QgPSAoKSA9PiB7XG4gICAgbGV0IHsgc2hvd2luZ1Rlc3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgc2hvd2luZ1Rlc3QgPSAhc2hvd2luZ1Rlc3Q7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dpbmdUZXN0IH0pO1xuXG4gICAgdmFyIGRpc3BsYXkgPSBzaG93aW5nVGVzdCA/IFwiYmxvY2tcIiA6IFwibm9uZVwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlc3Qtd3JhcHBlclwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgfVxuXG4gIGhhbmRsZUdlbmVTZWxlY3RlZCA9IChnZW5lLCBuZXdWYWx1ZSkgPT4ge1xuICAgIGxldCB7IHRlc3RTZWxlY3Rpb24gfSA9IHRoaXMuc3RhdGU7XG4gICAgdGVzdFNlbGVjdGlvbltnZW5lLm5hbWVdID0gbmV3VmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRlc3RTZWxlY3Rpb24gfSk7XG4gIH1cblxuICBjaGVja0Fuc3dlciA9ICgpID0+IHtcbiAgICBsZXQgYWxsU2VsZWN0ZWRBbGxlbGVzID0gW10sXG4gICAgICAgIGFsbGVsZVN0cmluZyA9IHRoaXMuc3RhdGUuZmF0aGVyLmdldEFsbGVsZVN0cmluZygpLFxuICAgICAgICBhbGxlbGVTdHJpbmdMZW5ndGggPSBhbGxlbGVTdHJpbmcubGVuZ3RoLFxuICAgICAgICB0ZXN0QWxsZWxlLFxuICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcblxuICAgIC8vIGhhcmQtY29kZWQgY2hlY2sgdG8gc2VlIGlmIHVzZXIgaGFzIG1hZGUgYWxsIGZvdXIgY2hvaWNlc1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb24pLmxlbmd0aCAhPT0gNCkge1xuICAgICAgYWxlcnQoXCJGaXJzdCBtYWtlIGEgc2VsZWN0aW9uIGZvciBhbGwgZm91ciBnZW5lcyFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBnZW5lTmFtZSBpbiB0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSB0aGlzLnN0YXRlLmZhdGhlci5zcGVjaWVzLmdlbmVMaXN0W2dlbmVOYW1lXS5hbGxlbGVzLFxuICAgICAgICAgICAgc2VsZWN0ZWRBbGxlbGVzID0gdGhpcy5zdGF0ZS50ZXN0U2VsZWN0aW9uW2dlbmVOYW1lXS5zcGxpdChcIiBcIikubWFwKG51bSA9PiBhbGxlbGVzW251bV0pO1xuICAgICAgYWxsU2VsZWN0ZWRBbGxlbGVzID0gYWxsU2VsZWN0ZWRBbGxlbGVzLmNvbmNhdChzZWxlY3RlZEFsbGVsZXMpO1xuICAgIH1cbiAgICB3aGlsZSAoc3VjY2VzcyAmJiAodGVzdEFsbGVsZSA9IGFsbFNlbGVjdGVkQWxsZWxlcy5wb3AoKSkpIHtcbiAgICAgIGFsbGVsZVN0cmluZyA9IGFsbGVsZVN0cmluZy5yZXBsYWNlKGA6JHt0ZXN0QWxsZWxlfWAsIFwiXCIpO1xuICAgICAgaWYgKGFsbGVsZVN0cmluZy5sZW5ndGggPT09IGFsbGVsZVN0cmluZ0xlbmd0aCkge1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBhbGxlbGVTdHJpbmdMZW5ndGggPSBhbGxlbGVTdHJpbmcubGVuZ3RoO1xuICAgIH1cbiAgICB2YXIgbWVzc2FnZSA9IHN1Y2Nlc3MgPyBcIlRoYXQncyByaWdodCFcIiA6IFwiU29ycnksIHRoYXQncyBub3QgcmlnaHRcIjtcbiAgICBhbGVydChtZXNzYWdlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGhpZGRlbkFsbGVsZXMsIGNsdXRjaFNpemUgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2x1bW4td3JhcHBlcic+XG4gICAgICAgIDxEcmFrZUdlbm9tZUNvbHVtblxuICAgICAgICAgICAgICBpZD0nbGVmdCcgY2xhc3NOYW1lPSdjb2x1bW4nXG4gICAgICAgICAgICAgIGRyYWtlPXt0aGlzLnN0YXRlLm1vdGhlcn0gc2V4PSdmZW1hbGUnXG4gICAgICAgICAgICAgIGlzRHJha2VFZGl0YWJsZT17dHJ1ZX1cbiAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgYWxsZWxlQ2hhbmdlZD17dGhpcy5hbGxlbGVDaGFuZ2VkfSAvPlxuICAgICAgICA8QnJlZWRCdXR0b25BbmRQZW5WaWV3IGlkPSdjZW50ZXInIGNsYXNzTmFtZT0nY29sdW1uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2x1dGNoPXt0aGlzLnN0YXRlLmNsdXRjaH0gY2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUJyZWVkPXt0aGlzLmJyZWVkfS8+XG4gICAgICAgIDxDYXNlNVJpZ2h0Q29sdW1uIGlkPSdyaWdodCcgY2xhc3NOYW1lPSdjb2x1bW4nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcmc9e3RoaXMuc3RhdGUuZmF0aGVyfSBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0U2VsZWN0aW9uPXt0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVRlc3Q9e3RoaXMudG9nZ2xlVGVzdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlR2VuZVNlbGVjdGVkPXt0aGlzLmhhbmRsZUdlbmVTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tBbnN3ZXI9e3RoaXMuY2hlY2tBbnN3ZXJ9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8qXG4gKiBHbG9iYWwgcmVuZGVyIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiBcbiAgLy8gUmVuZGVyIENhc2U1XG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENhc2U1LCB7XG4gICAgICBoaWRkZW5BbGxlbGVzOiBrSGlkZGVuQWxsZWxlcyxcbiAgICAgIGZhdGhlckFsbGVsZXM6IGtGYXRoZXJBbGxlbGVzLFxuICAgICAgaW5pdGlhbE1vdGhlckFsbGVsZXM6IGtJbml0aWFsTW90aGVyQWxsZWxlcyxcbiAgICAgIGNsdXRjaFNpemU6IGtDbHV0Y2hTaXplXG4gICAgfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKVxuICApO1xufVxuXG5HZW5pQmxvY2tzLkJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpO1xuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
