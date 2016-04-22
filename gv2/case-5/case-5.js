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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(BreedButtonAndPenView)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.handleBreed = function () {
      _this.setState({ selectedIndex: null });
      if (_this.props.onBreed) _this.props.onBreed();
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
        React.createElement(GeniBlocks.Button, { id: 'breed-button', label: 'Breed', onClick: this.handleBreed }),
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
  onBreed: React.PropTypes.func.isRequired
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

      document.getElementsByClassName('toggle-test-button')[0].onclick = toggleTest;
      document.getElementsByClassName('toggle-test-button')[1].onclick = toggleTest;
      document.getElementById('submit-button').onclick = checkAnswer;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var org = _props3.org;
      var hiddenAlleles = _props3.hiddenAlleles;
      var testSelection = _props3.testSelection;


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
            onSelectionChange: this.props.onGeneSelected }),
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
  onGeneSelected: React.PropTypes.func.isRequired,
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

    _this3.handleAlleleChange = function (chrom, side, prevAllele, newAllele) {
      var mother = _this3.state.mother;

      mother.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
      mother = new BioLogica.Organism(BioLogica.Species.Drake, mother.getAlleleString(), BioLogica.FEMALE);
      _this3.setState({ mother: mother, offspring: [], clutch: [] });
    };

    _this3.handleBreed = function () {
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
          id: 'left', idPrefix: 'female', className: 'column',
          columnLabel: 'Female Drake',
          drake: this.state.mother, sex: 'female',
          editable: true,
          hiddenAlleles: hiddenAlleles,
          onAlleleChange: this.handleAlleleChange }),
        React.createElement(BreedButtonAndPenView, { id: 'center', className: 'column',
          clutch: this.state.clutch, clutchSize: clutchSize,
          onBreed: this.handleBreed }),
        React.createElement(Case5RightColumn, { id: 'right', className: 'column',
          org: this.state.father, hiddenAlleles: hiddenAlleles,
          testSelection: this.state.testSelection,
          toggleTest: this.toggleTest,
          onGeneSelected: this.handleGeneSelected,
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
//# sourceMappingURL=data:application/json;base64,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RUFBYyxNQUFNLFNBQU47Ozs7Ozs7QUFBZCxNQUVHLFlBQVk7QUFDakIsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF2QztBQUNBLHdCQUFzQixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDdEIsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ2YsY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEI7O0FBTlYsTUFTRyxlQUFlO0FBQ3BCLGlCQUFlLEVBQWY7QUFDQSxjQUFZLEVBQVo7O0FBbUhKLFNBQVMsTUFBVCxHQUFrQjs7O0FBR2hCLFdBQVMsTUFBVCxDQUNFLE1BQU0sYUFBTixDQUFvQixLQUFwQixFQUEyQjtBQUN6QixtQkFBZSxjQUFmO0FBQ0EsbUJBQWUsY0FBZjtBQUNBLDBCQUFzQixxQkFBdEI7QUFDQSxnQkFBWSxXQUFaO0dBSkYsQ0FERixFQU9FLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQVBGLEVBSGdCO0NBQWxCOztBQWNBLFdBQVcsTUFBWCxDQUFrQixtQ0FBbEI7O0FBRUEiLCJmaWxlIjoiY2FzZS01L2Nhc2UtNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2FzZSA1IENlcnRpZmljYXRpb24gQ2hhbGxlbmdlXG4gKlxuICogVGhlIGNvZGUgaW4gdGhpcyBtb2R1bGUgd2FzIHdyaXR0ZW4gdG8gc3VwcG9ydCBhIHJlY3JlYXRpb24gb2YgdGhlIGNlcnRpZmljYXRpb25cbiAqIGNoYWxsZW5nZSBmcm9tIENhc2UgNSBpbiBHZW5pdmVyc2UuIFRoZSBjaGFsbGVuZ2UgaXMgdG8gY2hvb3NlIGEgc2V0IG9mIGFsbGVsZXNcbiAqIGZvciB0aGUgbW90aGVyIGRyYWtlLCBicmVlZCBhIGNsdXRjaCBvZiBvZmZzcHJpbmcsIGFuZCB0aGVuIHVzZSB0aGUgcmVzdWx0cyB0b1xuICogZGVkdWNlIHRoZSBhbGxlbGVzIG9mIHRoZSBmYXRoZXIgZHJha2UuXG4gKi9cbi8qIGdsb2JhbCBEcmFrZUdlbm9tZUNvbHVtbiAqL1xuLy9pbXBvcnQgRHJha2VHZW5vbWVDb2x1bW4gZnJvbSAnLi4vanMvcGFyZW50LWdlbm9tZS1jb2x1bW4nO1xuXG5jb25zdCBrSGlkZGVuQWxsZWxlcyA9IFsndCcsJ3RrJywnaCcsJ2MnLCdhJywnYicsJ2QnLCdib2cnLCdyaCddLFxuICAgICAga0ZhdGhlckFsbGVsZXMgPSBcImE6TSxhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYTpELGE6VyxhOmZsLGI6ZmwsYTpIbCxhOnQsYjpULGE6cmgsYTpCb2csYjpCb2dcIixcbiAgICAgIGtJbml0aWFsTW90aGVyQWxsZWxlcyA9IFwiYTptLGI6TSxhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYjpCLGE6RCxiOkQsYTp3LGI6VyxhOkZsLGI6RmwsYTpIbCxiOmhsLGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBrQ2x1dGNoU2l6ZSA9IDIwO1xuXG4vKipcbiAqIENlbnRlciBwYW5lbCBoYXMgYnJlZWQgYnV0dG9uIGFuZCBicmVlZGluZyBwZW5cbiAqL1xuY2xhc3MgQnJlZWRCdXR0b25BbmRQZW5WaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsdXRjaDogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICBjbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25CcmVlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgaGFuZGxlQnJlZWQgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkSW5kZXg6IG51bGwgfSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25CcmVlZClcbiAgICAgIHRoaXMucHJvcHMub25CcmVlZCgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2x1dGNoLCBjbHV0Y2hTaXplIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdjZW50ZXInIGNsYXNzTmFtZT0nY29sdW1uJz5cbiAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGlkPVwiYnJlZWQtYnV0dG9uXCIgbGFiZWw9XCJCcmVlZFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQnJlZWR9IC8+XG4gICAgICAgIDxHZW5pQmxvY2tzLlBlblN0YXRzVmlldyBpZD1cImJyZWVkaW5nLXBlblwiIG9yZ3M9e2NsdXRjaH0gbGFzdENsdXRjaFNpemU9e2NsdXRjaFNpemV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8qXG4gKiBSaWdodCBwYW5lbCBoYXMgZmF0aGVyIGRyYWtlLCBcIlJlYWR5IHRvIGFuc3dlclwiIGJ1dHRvbiwgYW5kIG92ZXJsYXkgdGVzdFxuICovXG5jbGFzcyBDYXNlNVJpZ2h0Q29sdW1uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9yZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWQsXG4gICAgdGVzdFNlbGVjdGlvbjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvZ2dsZVRlc3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25HZW5lU2VsZWN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hlY2tBbnN3ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHsgdG9nZ2xlVGVzdCwgY2hlY2tBbnN3ZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9nZ2xlLXRlc3QtYnV0dG9uJylbMF0ub25jbGljayA9IHRvZ2dsZVRlc3Q7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9nZ2xlLXRlc3QtYnV0dG9uJylbMV0ub25jbGljayA9IHRvZ2dsZVRlc3Q7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC1idXR0b24nKS5vbmNsaWNrID0gY2hlY2tBbnN3ZXI7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvcmcsIGhpZGRlbkFsbGVsZXMsIHRlc3RTZWxlY3Rpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGlkPSdyaWdodCcgY2xhc3NOYW1lPSdjb2x1bW4nPlxuICAgICAgICB7LyogcGFyZW50IGRyYWtlIGxhYmVsICovfVxuICAgICAgICA8ZGl2IGlkPSdmYXRoZXItZHJha2UtbGFiZWwnIGNsYXNzTmFtZT0nY29sdW1uLWxhYmVsJz5NYWxlIERyYWtlPC9kaXY+XG5cbiAgICAgICAgPEdlbmlCbG9ja3MuT3JnYW5pc21HbG93VmlldyBvcmc9e29yZ30gaWQ9J2ZhdGhlcicgc2l6ZT17MjAwfSBjb2xvcj0nI0ZGRkZBQScgLz5cbiAgICAgICAgPGRpdiBpZD0nZmF0aGVyLWdlbm9tZS11bmtub3duJz4/PC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9J3Rlc3Qtd3JhcHBlcic+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuR2Vub21lVGVzdFZpZXcgaWQ9J2ZhdGhlci1nZW5vbWUtdGVzdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZz17b3JnfSBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uPXt0ZXN0U2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2U9e3RoaXMucHJvcHMub25HZW5lU2VsZWN0ZWR9IC8+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGNsYXNzTmFtZT0ndG9nZ2xlLXRlc3QtYnV0dG9uJyBsYWJlbD1cIlJldHVybiB0byBMYWJcIiAvPlxuICAgICAgICAgIDxHZW5pQmxvY2tzLkJ1dHRvbiBpZD0nc3VibWl0LWJ1dHRvbicgbGFiZWw9XCJTdWJtaXQhXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxHZW5pQmxvY2tzLkJ1dHRvbiBjbGFzc05hbWU9J3RvZ2dsZS10ZXN0LWJ1dHRvbicgbGFiZWw9XCJSZWFkeSB0byBhbnN3ZXJcIiAvPlxuICAgICAgPC9kaXY+KTtcbiAgfVxufVxuXG4vKlxuICogQ2FzZSA1IGNvbWJpbmVzIHRoZSBtb3RoZXIgZ2Vub21lIChsZWZ0KSwgYnJlZWRpbmcgYXJlYSAoY2VudGVyKSwgZmF0aGVyIGdlbm9tZSB0ZXN0IChyaWdodClcbiAqL1xuY2xhc3MgQ2FzZTUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZyksXG4gICAgaW5pdGlhbE1vdGhlckFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBmYXRoZXJBbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2x1dGNoU2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBbXSxcbiAgICBjbHV0Y2hTaXplOiAyMFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgbW90aGVyOiBudWxsLFxuICAgIGZhdGhlcjogbnVsbCxcbiAgICBvZmZzcHJpbmc6IFtdLFxuICAgIGNsdXRjaDogW10sXG4gICAgdGVzdFNlbGVjdGlvbjoge30sXG4gICAgaXNTaG93aW5nVGVzdDogZmFsc2VcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3Qvbm8tZGlyZWN0LW11dGF0aW9uLXN0YXRlICovXG4gICAgdGhpcy5zdGF0ZS5tb3RoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBwcm9wcy5pbml0aWFsTW90aGVyQWxsZWxlcywgQmlvTG9naWNhLkZFTUFMRSk7XG4gICAgdGhpcy5zdGF0ZS5mYXRoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBwcm9wcy5mYXRoZXJBbGxlbGVzLCBCaW9Mb2dpY2EuTUFMRSk7XG4gIH1cblxuICBoYW5kbGVBbGxlbGVDaGFuZ2UgPSAoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSkgPT4ge1xuICAgIGxldCB7IG1vdGhlciB9ID0gdGhpcy5zdGF0ZTtcbiAgICBtb3RoZXIuZ2VuZXRpY3MuZ2Vub3R5cGUucmVwbGFjZUFsbGVsZUNocm9tTmFtZShjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICBtb3RoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW90aGVyLmdldEFsbGVsZVN0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmlvTG9naWNhLkZFTUFMRSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1vdGhlciwgb2Zmc3ByaW5nOiBbXSwgY2x1dGNoOiBbXSB9KTtcbiAgfVxuXG4gIGhhbmRsZUJyZWVkID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgY2x1dGNoU2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgICB7IG9mZnNwcmluZywgY2x1dGNoIH0gPSB0aGlzLnN0YXRlLFxuICAgICAgICAgIGNvdW50ID0gY2x1dGNoU2l6ZTtcbiAgICBjbHV0Y2ggPSBbXTtcbiAgICB3aGlsZSAoY291bnQtLSkge1xuICAgICAgdmFyIGNoaWxkID0gQmlvTG9naWNhLmJyZWVkKHRoaXMuc3RhdGUubW90aGVyLCB0aGlzLnN0YXRlLmZhdGhlcik7XG4gICAgICBjbHV0Y2gucHVzaChjaGlsZCk7XG4gICAgICBvZmZzcHJpbmcucHVzaChjaGlsZCk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBvZmZzcHJpbmcsIGNsdXRjaCB9KTtcbiAgfVxuXG4gIHRvZ2dsZVRlc3QgPSAoKSA9PiB7XG4gICAgbGV0IHsgc2hvd2luZ1Rlc3QgfSA9IHRoaXMuc3RhdGU7XG4gICAgc2hvd2luZ1Rlc3QgPSAhc2hvd2luZ1Rlc3Q7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dpbmdUZXN0IH0pO1xuXG4gICAgdmFyIGRpc3BsYXkgPSBzaG93aW5nVGVzdCA/IFwiYmxvY2tcIiA6IFwibm9uZVwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlc3Qtd3JhcHBlclwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgfVxuXG4gIGhhbmRsZUdlbmVTZWxlY3RlZCA9IChnZW5lLCBuZXdWYWx1ZSkgPT4ge1xuICAgIGxldCB7IHRlc3RTZWxlY3Rpb24gfSA9IHRoaXMuc3RhdGU7XG4gICAgdGVzdFNlbGVjdGlvbltnZW5lLm5hbWVdID0gbmV3VmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRlc3RTZWxlY3Rpb24gfSk7XG4gIH1cblxuICBjaGVja0Fuc3dlciA9ICgpID0+IHtcbiAgICBsZXQgYWxsU2VsZWN0ZWRBbGxlbGVzID0gW10sXG4gICAgICAgIGFsbGVsZVN0cmluZyA9IHRoaXMuc3RhdGUuZmF0aGVyLmdldEFsbGVsZVN0cmluZygpLFxuICAgICAgICBhbGxlbGVTdHJpbmdMZW5ndGggPSBhbGxlbGVTdHJpbmcubGVuZ3RoLFxuICAgICAgICB0ZXN0QWxsZWxlLFxuICAgICAgICBzdWNjZXNzID0gdHJ1ZTtcblxuICAgIC8vIGhhcmQtY29kZWQgY2hlY2sgdG8gc2VlIGlmIHVzZXIgaGFzIG1hZGUgYWxsIGZvdXIgY2hvaWNlc1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb24pLmxlbmd0aCAhPT0gNCkge1xuICAgICAgYWxlcnQoXCJGaXJzdCBtYWtlIGEgc2VsZWN0aW9uIGZvciBhbGwgZm91ciBnZW5lcyFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBnZW5lTmFtZSBpbiB0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSB0aGlzLnN0YXRlLmZhdGhlci5zcGVjaWVzLmdlbmVMaXN0W2dlbmVOYW1lXS5hbGxlbGVzLFxuICAgICAgICAgICAgc2VsZWN0ZWRBbGxlbGVzID0gdGhpcy5zdGF0ZS50ZXN0U2VsZWN0aW9uW2dlbmVOYW1lXS5zcGxpdChcIiBcIikubWFwKG51bSA9PiBhbGxlbGVzW251bV0pO1xuICAgICAgYWxsU2VsZWN0ZWRBbGxlbGVzID0gYWxsU2VsZWN0ZWRBbGxlbGVzLmNvbmNhdChzZWxlY3RlZEFsbGVsZXMpO1xuICAgIH1cbiAgICB3aGlsZSAoc3VjY2VzcyAmJiAodGVzdEFsbGVsZSA9IGFsbFNlbGVjdGVkQWxsZWxlcy5wb3AoKSkpIHtcbiAgICAgIGFsbGVsZVN0cmluZyA9IGFsbGVsZVN0cmluZy5yZXBsYWNlKGA6JHt0ZXN0QWxsZWxlfWAsIFwiXCIpO1xuICAgICAgaWYgKGFsbGVsZVN0cmluZy5sZW5ndGggPT09IGFsbGVsZVN0cmluZ0xlbmd0aCkge1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBhbGxlbGVTdHJpbmdMZW5ndGggPSBhbGxlbGVTdHJpbmcubGVuZ3RoO1xuICAgIH1cbiAgICB2YXIgbWVzc2FnZSA9IHN1Y2Nlc3MgPyBcIlRoYXQncyByaWdodCFcIiA6IFwiU29ycnksIHRoYXQncyBub3QgcmlnaHRcIjtcbiAgICBhbGVydChtZXNzYWdlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGhpZGRlbkFsbGVsZXMsIGNsdXRjaFNpemUgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2x1bW4td3JhcHBlcic+XG4gICAgICAgIDxEcmFrZUdlbm9tZUNvbHVtblxuICAgICAgICAgICAgICBpZD0nbGVmdCcgaWRQcmVmaXg9J2ZlbWFsZScgY2xhc3NOYW1lPSdjb2x1bW4nXG4gICAgICAgICAgICAgIGNvbHVtbkxhYmVsPVwiRmVtYWxlIERyYWtlXCJcbiAgICAgICAgICAgICAgZHJha2U9e3RoaXMuc3RhdGUubW90aGVyfSBzZXg9J2ZlbWFsZSdcbiAgICAgICAgICAgICAgZWRpdGFibGU9e3RydWV9XG4gICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXt0aGlzLmhhbmRsZUFsbGVsZUNoYW5nZX0gLz5cbiAgICAgICAgPEJyZWVkQnV0dG9uQW5kUGVuVmlldyBpZD0nY2VudGVyJyBjbGFzc05hbWU9J2NvbHVtbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsdXRjaD17dGhpcy5zdGF0ZS5jbHV0Y2h9IGNsdXRjaFNpemU9e2NsdXRjaFNpemV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkJyZWVkPXt0aGlzLmhhbmRsZUJyZWVkfS8+XG4gICAgICAgIDxDYXNlNVJpZ2h0Q29sdW1uIGlkPSdyaWdodCcgY2xhc3NOYW1lPSdjb2x1bW4nIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvcmc9e3RoaXMuc3RhdGUuZmF0aGVyfSBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0U2VsZWN0aW9uPXt0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVRlc3Q9e3RoaXMudG9nZ2xlVGVzdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25HZW5lU2VsZWN0ZWQ9e3RoaXMuaGFuZGxlR2VuZVNlbGVjdGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja0Fuc3dlcj17dGhpcy5jaGVja0Fuc3dlcn0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLypcbiAqIEdsb2JhbCByZW5kZXIgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gcmVuZGVyKCkge1xuIFxuICAvLyBSZW5kZXIgQ2FzZTVcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2FzZTUsIHtcbiAgICAgIGhpZGRlbkFsbGVsZXM6IGtIaWRkZW5BbGxlbGVzLFxuICAgICAgZmF0aGVyQWxsZWxlczoga0ZhdGhlckFsbGVsZXMsXG4gICAgICBpbml0aWFsTW90aGVyQWxsZWxlczoga0luaXRpYWxNb3RoZXJBbGxlbGVzLFxuICAgICAgY2x1dGNoU2l6ZToga0NsdXRjaFNpemVcbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpXG4gICk7XG59XG5cbkdlbmlCbG9ja3MuQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCk7XG5cbnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
