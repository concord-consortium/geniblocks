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

function handleCompleteCase() {
  var url = window.location.href;
  // back to case log
  var case5Index = url.indexOf('case-5'),
      nextUrl = url.substr(0, case5Index);
  window.location.assign(nextUrl);
}

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
      var onCheckAnswer = _props2.onCheckAnswer;

      document.getElementsByClassName('toggle-test-button')[0].onclick = toggleTest;
      document.getElementsByClassName('toggle-test-button')[1].onclick = toggleTest;
      document.getElementById('submit-button').onclick = onCheckAnswer;
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
  onCheckAnswer: React.PropTypes.func.isRequired
};

var Case5 = function (_React$Component3) {
  _inherits(Case5, _React$Component3);

  function Case5() {
    var _Object$getPrototypeO2;

    var _temp2, _this3, _ret2;

    _classCallCheck(this, Case5);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Case5)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this3), _this3.state = {
      mother: null,
      father: null,
      offspring: [],
      clutch: [],
      testSelection: {},
      showingTest: false
    }, _this3.resetChallenge = function () {
      if (_this3.state.showingTest) _this3.toggleTest();

      var _this3$props = _this3.props;
      var initialMotherAlleles = _this3$props.initialMotherAlleles;
      var fatherAlleles = _this3$props.fatherAlleles;

      _this3.setState({
        mother: new BioLogica.Organism(BioLogica.Species.Drake, initialMotherAlleles, BioLogica.FEMALE),
        father: new BioLogica.Organism(BioLogica.Species.Drake, fatherAlleles, BioLogica.MALE),
        offspring: [],
        clutch: [],
        testSelection: {},
        showingTest: false,
        userState: Case5.userStates.NORMAL
      });
    }, _this3.handleAlleleChange = function (chrom, side, prevAllele, newAllele) {
      var mother = _this3.state.mother;

      mother.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
      mother = new BioLogica.Organism(BioLogica.Species.Drake, mother.getAlleleString(), BioLogica.FEMALE);
      _this3.setState({ mother: mother, offspring: [], clutch: [] });
    }, _this3.handleBreed = function () {
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
    }, _this3.toggleTest = function () {
      var showingTest = _this3.state.showingTest;

      showingTest = !showingTest;
      _this3.setState({ showingTest: showingTest });

      var display = showingTest ? "block" : "none";
      document.getElementById("overlay").style.display = display;
      document.getElementById("test-wrapper").style.display = display;
    }, _this3.handleGeneSelected = function (gene, newValue) {
      var testSelection = _this3.state.testSelection;

      testSelection[gene.name] = newValue;
      _this3.setState({ testSelection: testSelection });
    }, _this3.handleCheckAnswer = function () {
      var allSelectedAlleles = [],
          alleleString = _this3.state.father.getAlleleString(),
          alleleStringLength = alleleString.length,
          testAllele = void 0,
          success = true;

      // hard-coded check to see if user has made all four choices
      if (Object.keys(_this3.state.testSelection).length !== 4) {
        _this3.setState({ userState: Case5.userStates.ALERT_INCOMPLETE });
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
      var userState = success ? Case5.userStates.ALERT_CORRECT : Case5.userStates.ALERT_INCORRECT;
      _this3.setState({ userState: userState });
    }, _this3.handleCloseAlert = function () {
      _this3.setState({ userState: Case5.userStates.NORMAL });
    }, _temp2), _possibleConstructorReturn(_this3, _ret2);
  }

  _createClass(Case5, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.resetChallenge();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props;
      var hiddenAlleles = _props4.hiddenAlleles;
      var clutchSize = _props4.clutchSize;

      var showAlert = void 0,
          message = void 0,
          leftButton = {},
          rightButton = {};
      switch (this.state.userState) {
        case Case5.userStates.ALERT_INCOMPLETE:
          showAlert = true;
          message = "First make a selection for all four genes!";
          leftButton = null;
          rightButton.label = "OK";
          rightButton.onClick = this.handleCloseAlert;
          break;
        case Case5.userStates.ALERT_INCORRECT:
          showAlert = true;
          message = "Sorry, that's not correct";
          leftButton = null;
          rightButton.label = "Try Again";
          rightButton.onClick = this.handleCloseAlert;
          break;
        case Case5.userStates.ALERT_CORRECT:
          showAlert = true;
          message = "That's correct!";
          leftButton.label = "Try Again";
          leftButton.onClick = this.resetChallenge;
          rightButton.label = "Case Log";
          rightButton.onClick = this.props.onCompleteCase;
          break;
      }
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
          onCheckAnswer: this.handleCheckAnswer }),
        React.createElement(GeniBlocks.ModalAlert, {
          show: showAlert, message: message,
          leftButton: leftButton, rightButton: rightButton })
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
  clutchSize: React.PropTypes.number,
  onCompleteCase: React.PropTypes.func.isRequired
};
Case5.defaultProps = {
  hiddenAlleles: [],
  clutchSize: 20
};
Case5.userStates = {
  NORMAL: 'normal',
  ALERT_INCOMPLETE: 'alert-incomplete',
  ALERT_CORRECT: 'alert-correct',
  ALERT_INCORRECT: 'alert-incorrect'
};
function render() {

  // Render Case5
  ReactDOM.render(React.createElement(Case5, {
    hiddenAlleles: kHiddenAlleles,
    fatherAlleles: kFatherAlleles,
    initialMotherAlleles: kInitialMotherAlleles,
    clutchSize: kClutchSize,
    onCompleteCase: handleCompleteCase
  }), document.getElementById('wrapper'));
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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LENBQ0UsTUFBTSxhQUFOLENBQW9CLEtBQXBCLEVBQTJCO0FBQ3pCLG1CQUFlLGNBRFU7QUFFekIsbUJBQWUsY0FGVTtBQUd6QiwwQkFBc0IscUJBSEc7QUFJekIsZ0JBQVksV0FKYTtBQUt6QixvQkFBZ0I7QUFMUyxHQUEzQixDQURGLEVBUUUsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBUkY7QUFVRDs7QUFFRCxXQUFXLE1BQVgsQ0FBa0IsbUNBQWxCOztBQUVBIiwiZmlsZSI6ImNhc2UtNS9jYXNlLTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENhc2UgNSBDZXJ0aWZpY2F0aW9uIENoYWxsZW5nZVxuICpcbiAqIFRoZSBjb2RlIGluIHRoaXMgbW9kdWxlIHdhcyB3cml0dGVuIHRvIHN1cHBvcnQgYSByZWNyZWF0aW9uIG9mIHRoZSBjZXJ0aWZpY2F0aW9uXG4gKiBjaGFsbGVuZ2UgZnJvbSBDYXNlIDUgaW4gR2VuaXZlcnNlLiBUaGUgY2hhbGxlbmdlIGlzIHRvIGNob29zZSBhIHNldCBvZiBhbGxlbGVzXG4gKiBmb3IgdGhlIG1vdGhlciBkcmFrZSwgYnJlZWQgYSBjbHV0Y2ggb2Ygb2Zmc3ByaW5nLCBhbmQgdGhlbiB1c2UgdGhlIHJlc3VsdHMgdG9cbiAqIGRlZHVjZSB0aGUgYWxsZWxlcyBvZiB0aGUgZmF0aGVyIGRyYWtlLlxuICovXG4vKiBnbG9iYWwgRHJha2VHZW5vbWVDb2x1bW4gKi9cbi8vaW1wb3J0IERyYWtlR2Vub21lQ29sdW1uIGZyb20gJy4uL2pzL3BhcmVudC1nZW5vbWUtY29sdW1uJztcblxuY29uc3Qga0hpZGRlbkFsbGVsZXMgPSBbJ3QnLCd0aycsJ2gnLCdjJywnYScsJ2InLCdkJywnYm9nJywncmgnXSxcbiAgICAgIGtGYXRoZXJBbGxlbGVzID0gXCJhOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGE6RCxhOlcsYTpmbCxiOmZsLGE6SGwsYTp0LGI6VCxhOnJoLGE6Qm9nLGI6Qm9nXCIsXG4gICAgICBrSW5pdGlhbE1vdGhlckFsbGVsZXMgPSBcImE6bSxiOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6dyxiOlcsYTpGbCxiOkZsLGE6SGwsYjpobCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLFxuICAgICAga0NsdXRjaFNpemUgPSAyMDtcblxuZnVuY3Rpb24gaGFuZGxlQ29tcGxldGVDYXNlKCkge1xuICBsZXQgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIC8vIGJhY2sgdG8gY2FzZSBsb2dcbiAgY29uc3QgY2FzZTVJbmRleCA9IHVybC5pbmRleE9mKCdjYXNlLTUnKSxcbiAgICAgICAgbmV4dFVybCA9IHVybC5zdWJzdHIoMCwgY2FzZTVJbmRleCk7XG4gIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV4dFVybCk7XG59XG5cbi8qKlxuICogQ2VudGVyIHBhbmVsIGhhcyBicmVlZCBidXR0b24gYW5kIGJyZWVkaW5nIHBlblxuICovXG5jbGFzcyBCcmVlZEJ1dHRvbkFuZFBlblZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2x1dGNoOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGNsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvbkJyZWVkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBoYW5kbGVCcmVlZCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRJbmRleDogbnVsbCB9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkJyZWVkKVxuICAgICAgdGhpcy5wcm9wcy5vbkJyZWVkKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjbHV0Y2gsIGNsdXRjaFNpemUgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2NlbnRlcicgY2xhc3NOYW1lPSdjb2x1bW4nPlxuICAgICAgICA8R2VuaUJsb2Nrcy5CdXR0b24gaWQ9XCJicmVlZC1idXR0b25cIiBsYWJlbD1cIkJyZWVkXCIgb25DbGljaz17dGhpcy5oYW5kbGVCcmVlZH0gLz5cbiAgICAgICAgPEdlbmlCbG9ja3MuUGVuU3RhdHNWaWV3IGlkPVwiYnJlZWRpbmctcGVuXCIgb3Jncz17Y2x1dGNofSBsYXN0Q2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLypcbiAqIFJpZ2h0IHBhbmVsIGhhcyBmYXRoZXIgZHJha2UsIFwiUmVhZHkgdG8gYW5zd2VyXCIgYnV0dG9uLCBhbmQgb3ZlcmxheSB0ZXN0XG4gKi9cbmNsYXNzIENhc2U1UmlnaHRDb2x1bW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3JnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZykuaXNSZXF1aXJlZCxcbiAgICB0ZXN0U2VsZWN0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9nZ2xlVGVzdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkdlbmVTZWxlY3RlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkNoZWNrQW5zd2VyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7IHRvZ2dsZVRlc3QsIG9uQ2hlY2tBbnN3ZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9nZ2xlLXRlc3QtYnV0dG9uJylbMF0ub25jbGljayA9IHRvZ2dsZVRlc3Q7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9nZ2xlLXRlc3QtYnV0dG9uJylbMV0ub25jbGljayA9IHRvZ2dsZVRlc3Q7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC1idXR0b24nKS5vbmNsaWNrID0gb25DaGVja0Fuc3dlcjtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG9yZywgaGlkZGVuQWxsZWxlcywgdGVzdFNlbGVjdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybihcbiAgICAgIDxkaXYgaWQ9J3JpZ2h0JyBjbGFzc05hbWU9J2NvbHVtbic+XG4gICAgICAgIHsvKiBwYXJlbnQgZHJha2UgbGFiZWwgKi99XG4gICAgICAgIDxkaXYgaWQ9J2ZhdGhlci1kcmFrZS1sYWJlbCcgY2xhc3NOYW1lPSdjb2x1bW4tbGFiZWwnPk1hbGUgRHJha2U8L2Rpdj5cblxuICAgICAgICA8R2VuaUJsb2Nrcy5PcmdhbmlzbUdsb3dWaWV3IG9yZz17b3JnfSBpZD0nZmF0aGVyJyBzaXplPXsyMDB9IGNvbG9yPScjRkZGRkFBJyAvPlxuICAgICAgICA8ZGl2IGlkPSdmYXRoZXItZ2Vub21lLXVua25vd24nPj88L2Rpdj5cbiAgICAgICAgPGRpdiBpZD0ndGVzdC13cmFwcGVyJz5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5HZW5vbWVUZXN0VmlldyBpZD0nZmF0aGVyLWdlbm9tZS10ZXN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnPXtvcmd9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb249e3Rlc3RTZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZT17dGhpcy5wcm9wcy5vbkdlbmVTZWxlY3RlZH0gLz5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5CdXR0b24gY2xhc3NOYW1lPSd0b2dnbGUtdGVzdC1idXR0b24nIGxhYmVsPVwiUmV0dXJuIHRvIExhYlwiIC8+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGlkPSdzdWJtaXQtYnV0dG9uJyBsYWJlbD1cIlN1Ym1pdCFcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGNsYXNzTmFtZT0ndG9nZ2xlLXRlc3QtYnV0dG9uJyBsYWJlbD1cIlJlYWR5IHRvIGFuc3dlclwiIC8+XG4gICAgICA8L2Rpdj4pO1xuICB9XG59XG5cbi8qXG4gKiBDYXNlIDUgY29tYmluZXMgdGhlIG1vdGhlciBnZW5vbWUgKGxlZnQpLCBicmVlZGluZyBhcmVhIChjZW50ZXIpLCBmYXRoZXIgZ2Vub21lIHRlc3QgKHJpZ2h0KVxuICovXG5jbGFzcyBDYXNlNSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBpbml0aWFsTW90aGVyQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGZhdGhlckFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbHV0Y2hTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG9uQ29tcGxldGVDYXNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhpZGRlbkFsbGVsZXM6IFtdLFxuICAgIGNsdXRjaFNpemU6IDIwXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBtb3RoZXI6IG51bGwsXG4gICAgZmF0aGVyOiBudWxsLFxuICAgIG9mZnNwcmluZzogW10sXG4gICAgY2x1dGNoOiBbXSxcbiAgICB0ZXN0U2VsZWN0aW9uOiB7fSxcbiAgICBzaG93aW5nVGVzdDogZmFsc2VcbiAgfVxuXG4gIHN0YXRpYyB1c2VyU3RhdGVzID0ge1xuICAgIE5PUk1BTDogJ25vcm1hbCcsXG4gICAgQUxFUlRfSU5DT01QTEVURTogJ2FsZXJ0LWluY29tcGxldGUnLFxuICAgIEFMRVJUX0NPUlJFQ1Q6ICdhbGVydC1jb3JyZWN0JyxcbiAgICBBTEVSVF9JTkNPUlJFQ1Q6ICdhbGVydC1pbmNvcnJlY3QnXG4gIH1cblxuICByZXNldENoYWxsZW5nZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93aW5nVGVzdClcbiAgICAgIHRoaXMudG9nZ2xlVGVzdCgpO1xuXG4gICAgY29uc3QgeyBpbml0aWFsTW90aGVyQWxsZWxlcywgZmF0aGVyQWxsZWxlcyB9ID0gdGhpcy5wcm9wcztcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vdGhlcjogbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgaW5pdGlhbE1vdGhlckFsbGVsZXMsIEJpb0xvZ2ljYS5GRU1BTEUpLFxuICAgICAgZmF0aGVyOiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBmYXRoZXJBbGxlbGVzLCBCaW9Mb2dpY2EuTUFMRSksXG4gICAgICBvZmZzcHJpbmc6IFtdLFxuICAgICAgY2x1dGNoOiBbXSxcbiAgICAgIHRlc3RTZWxlY3Rpb246IHt9LFxuICAgICAgc2hvd2luZ1Rlc3Q6IGZhbHNlLFxuICAgICAgdXNlclN0YXRlOiBDYXNlNS51c2VyU3RhdGVzLk5PUk1BTFxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMucmVzZXRDaGFsbGVuZ2UoKTtcbiAgfVxuXG4gIGhhbmRsZUFsbGVsZUNoYW5nZSA9IChjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKSA9PiB7XG4gICAgbGV0IHsgbW90aGVyIH0gPSB0aGlzLnN0YXRlO1xuICAgIG1vdGhlci5nZW5ldGljcy5nZW5vdHlwZS5yZXBsYWNlQWxsZWxlQ2hyb21OYW1lKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgIG1vdGhlciA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3RoZXIuZ2V0QWxsZWxlU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCaW9Mb2dpY2EuRkVNQUxFKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgbW90aGVyLCBvZmZzcHJpbmc6IFtdLCBjbHV0Y2g6IFtdIH0pO1xuICB9XG5cbiAgaGFuZGxlQnJlZWQgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBjbHV0Y2hTaXplIH0gPSB0aGlzLnByb3BzO1xuICAgIGxldCAgIHsgb2Zmc3ByaW5nLCBjbHV0Y2ggfSA9IHRoaXMuc3RhdGUsXG4gICAgICAgICAgY291bnQgPSBjbHV0Y2hTaXplO1xuICAgIGNsdXRjaCA9IFtdO1xuICAgIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICB2YXIgY2hpbGQgPSBCaW9Mb2dpY2EuYnJlZWQodGhpcy5zdGF0ZS5tb3RoZXIsIHRoaXMuc3RhdGUuZmF0aGVyKTtcbiAgICAgIGNsdXRjaC5wdXNoKGNoaWxkKTtcbiAgICAgIG9mZnNwcmluZy5wdXNoKGNoaWxkKTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG9mZnNwcmluZywgY2x1dGNoIH0pO1xuICB9XG5cbiAgdG9nZ2xlVGVzdCA9ICgpID0+IHtcbiAgICBsZXQgeyBzaG93aW5nVGVzdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBzaG93aW5nVGVzdCA9ICFzaG93aW5nVGVzdDtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd2luZ1Rlc3QgfSk7XG5cbiAgICB2YXIgZGlzcGxheSA9IHNob3dpbmdUZXN0ID8gXCJibG9ja1wiIDogXCJub25lXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVzdC13cmFwcGVyXCIpLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICB9XG5cbiAgaGFuZGxlR2VuZVNlbGVjdGVkID0gKGdlbmUsIG5ld1ZhbHVlKSA9PiB7XG4gICAgbGV0IHsgdGVzdFNlbGVjdGlvbiB9ID0gdGhpcy5zdGF0ZTtcbiAgICB0ZXN0U2VsZWN0aW9uW2dlbmUubmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHsgdGVzdFNlbGVjdGlvbiB9KTtcbiAgfVxuXG4gIGhhbmRsZUNoZWNrQW5zd2VyID0gKCkgPT4ge1xuICAgIGxldCBhbGxTZWxlY3RlZEFsbGVsZXMgPSBbXSxcbiAgICAgICAgYWxsZWxlU3RyaW5nID0gdGhpcy5zdGF0ZS5mYXRoZXIuZ2V0QWxsZWxlU3RyaW5nKCksXG4gICAgICAgIGFsbGVsZVN0cmluZ0xlbmd0aCA9IGFsbGVsZVN0cmluZy5sZW5ndGgsXG4gICAgICAgIHRlc3RBbGxlbGUsXG4gICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgLy8gaGFyZC1jb2RlZCBjaGVjayB0byBzZWUgaWYgdXNlciBoYXMgbWFkZSBhbGwgZm91ciBjaG9pY2VzXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc3RhdGUudGVzdFNlbGVjdGlvbikubGVuZ3RoICE9PSA0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdXNlclN0YXRlOiBDYXNlNS51c2VyU3RhdGVzLkFMRVJUX0lOQ09NUExFVEUgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBnZW5lTmFtZSBpbiB0aGlzLnN0YXRlLnRlc3RTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSB0aGlzLnN0YXRlLmZhdGhlci5zcGVjaWVzLmdlbmVMaXN0W2dlbmVOYW1lXS5hbGxlbGVzLFxuICAgICAgICAgICAgc2VsZWN0ZWRBbGxlbGVzID0gdGhpcy5zdGF0ZS50ZXN0U2VsZWN0aW9uW2dlbmVOYW1lXS5zcGxpdChcIiBcIikubWFwKG51bSA9PiBhbGxlbGVzW251bV0pO1xuICAgICAgYWxsU2VsZWN0ZWRBbGxlbGVzID0gYWxsU2VsZWN0ZWRBbGxlbGVzLmNvbmNhdChzZWxlY3RlZEFsbGVsZXMpO1xuICAgIH1cbiAgICB3aGlsZSAoc3VjY2VzcyAmJiAodGVzdEFsbGVsZSA9IGFsbFNlbGVjdGVkQWxsZWxlcy5wb3AoKSkpIHtcbiAgICAgIGFsbGVsZVN0cmluZyA9IGFsbGVsZVN0cmluZy5yZXBsYWNlKGA6JHt0ZXN0QWxsZWxlfWAsIFwiXCIpO1xuICAgICAgaWYgKGFsbGVsZVN0cmluZy5sZW5ndGggPT09IGFsbGVsZVN0cmluZ0xlbmd0aCkge1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBhbGxlbGVTdHJpbmdMZW5ndGggPSBhbGxlbGVTdHJpbmcubGVuZ3RoO1xuICAgIH1cbiAgICBjb25zdCB1c2VyU3RhdGUgPSBzdWNjZXNzID8gQ2FzZTUudXNlclN0YXRlcy5BTEVSVF9DT1JSRUNUXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IENhc2U1LnVzZXJTdGF0ZXMuQUxFUlRfSU5DT1JSRUNUO1xuICAgIHRoaXMuc2V0U3RhdGUoeyB1c2VyU3RhdGUgfSk7XG4gIH1cblxuICBoYW5kbGVDbG9zZUFsZXJ0ID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyB1c2VyU3RhdGU6IENhc2U1LnVzZXJTdGF0ZXMuTk9STUFMIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGlkZGVuQWxsZWxlcywgY2x1dGNoU2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgc2hvd0FsZXJ0LCBtZXNzYWdlLCBsZWZ0QnV0dG9uID0ge30sIHJpZ2h0QnV0dG9uID0ge307XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLnVzZXJTdGF0ZSkge1xuICAgICAgY2FzZSBDYXNlNS51c2VyU3RhdGVzLkFMRVJUX0lOQ09NUExFVEU6XG4gICAgICAgIHNob3dBbGVydCA9IHRydWU7XG4gICAgICAgIG1lc3NhZ2UgPSBcIkZpcnN0IG1ha2UgYSBzZWxlY3Rpb24gZm9yIGFsbCBmb3VyIGdlbmVzIVwiO1xuICAgICAgICBsZWZ0QnV0dG9uID0gbnVsbDtcbiAgICAgICAgcmlnaHRCdXR0b24ubGFiZWwgPSBcIk9LXCI7XG4gICAgICAgIHJpZ2h0QnV0dG9uLm9uQ2xpY2sgPSB0aGlzLmhhbmRsZUNsb3NlQWxlcnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDYXNlNS51c2VyU3RhdGVzLkFMRVJUX0lOQ09SUkVDVDpcbiAgICAgICAgc2hvd0FsZXJ0ID0gdHJ1ZTtcbiAgICAgICAgbWVzc2FnZSA9IFwiU29ycnksIHRoYXQncyBub3QgY29ycmVjdFwiO1xuICAgICAgICBsZWZ0QnV0dG9uID0gbnVsbDtcbiAgICAgICAgcmlnaHRCdXR0b24ubGFiZWwgPSBcIlRyeSBBZ2FpblwiO1xuICAgICAgICByaWdodEJ1dHRvbi5vbkNsaWNrID0gdGhpcy5oYW5kbGVDbG9zZUFsZXJ0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ2FzZTUudXNlclN0YXRlcy5BTEVSVF9DT1JSRUNUOlxuICAgICAgICBzaG93QWxlcnQgPSB0cnVlO1xuICAgICAgICBtZXNzYWdlID0gXCJUaGF0J3MgY29ycmVjdCFcIjtcbiAgICAgICAgbGVmdEJ1dHRvbi5sYWJlbCA9IFwiVHJ5IEFnYWluXCI7XG4gICAgICAgIGxlZnRCdXR0b24ub25DbGljayA9IHRoaXMucmVzZXRDaGFsbGVuZ2U7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmxhYmVsID0gXCJDYXNlIExvZ1wiO1xuICAgICAgICByaWdodEJ1dHRvbi5vbkNsaWNrID0gdGhpcy5wcm9wcy5vbkNvbXBsZXRlQ2FzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sdW1uLXdyYXBwZXInPlxuICAgICAgICA8RHJha2VHZW5vbWVDb2x1bW5cbiAgICAgICAgICAgICAgaWQ9J2xlZnQnIGlkUHJlZml4PSdmZW1hbGUnIGNsYXNzTmFtZT0nY29sdW1uJ1xuICAgICAgICAgICAgICBjb2x1bW5MYWJlbD1cIkZlbWFsZSBEcmFrZVwiXG4gICAgICAgICAgICAgIGRyYWtlPXt0aGlzLnN0YXRlLm1vdGhlcn0gc2V4PSdmZW1hbGUnXG4gICAgICAgICAgICAgIGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2V9IC8+XG4gICAgICAgIDxCcmVlZEJ1dHRvbkFuZFBlblZpZXcgaWQ9J2NlbnRlcicgY2xhc3NOYW1lPSdjb2x1bW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHV0Y2g9e3RoaXMuc3RhdGUuY2x1dGNofSBjbHV0Y2hTaXplPXtjbHV0Y2hTaXplfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CcmVlZD17dGhpcy5oYW5kbGVCcmVlZH0vPlxuICAgICAgICA8Q2FzZTVSaWdodENvbHVtbiBpZD0ncmlnaHQnIGNsYXNzTmFtZT0nY29sdW1uJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnPXt0aGlzLnN0YXRlLmZhdGhlcn0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdFNlbGVjdGlvbj17dGhpcy5zdGF0ZS50ZXN0U2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVUZXN0PXt0aGlzLnRvZ2dsZVRlc3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uR2VuZVNlbGVjdGVkPXt0aGlzLmhhbmRsZUdlbmVTZWxlY3RlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGVja0Fuc3dlcj17dGhpcy5oYW5kbGVDaGVja0Fuc3dlcn0gLz5cbiAgICAgICAgPEdlbmlCbG9ja3MuTW9kYWxBbGVydFxuICAgICAgICAgICAgICBzaG93PXtzaG93QWxlcnR9IG1lc3NhZ2U9e21lc3NhZ2V9XG4gICAgICAgICAgICAgIGxlZnRCdXR0b249e2xlZnRCdXR0b259IHJpZ2h0QnV0dG9uPXtyaWdodEJ1dHRvbn0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vKlxuICogR2xvYmFsIHJlbmRlciBmdW5jdGlvblxuICovXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gXG4gIC8vIFJlbmRlciBDYXNlNVxuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDYXNlNSwge1xuICAgICAgaGlkZGVuQWxsZWxlczoga0hpZGRlbkFsbGVsZXMsXG4gICAgICBmYXRoZXJBbGxlbGVzOiBrRmF0aGVyQWxsZWxlcyxcbiAgICAgIGluaXRpYWxNb3RoZXJBbGxlbGVzOiBrSW5pdGlhbE1vdGhlckFsbGVsZXMsXG4gICAgICBjbHV0Y2hTaXplOiBrQ2x1dGNoU2l6ZSxcbiAgICAgIG9uQ29tcGxldGVDYXNlOiBoYW5kbGVDb21wbGV0ZUNhc2VcbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpXG4gICk7XG59XG5cbkdlbmlCbG9ja3MuQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCk7XG5cbnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
