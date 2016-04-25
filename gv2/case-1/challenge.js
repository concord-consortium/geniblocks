'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Case 1 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 1 in Geniverse. The challenges are:
 *  Challenge 0: Match the phenotype of a visible test drake to that of a target drake
 *               (This challenge is not in Geniverse but it was deemed a useful addition.)
 *  Challenge 1: Match the phenotype of a hidden test drake to that of a target drake
 *  Challenge 2: Match the phenotype of three hidden test drakes to target drakes
 */
/* global DrakeGenomeColumn */
//import DrakeGenomeColumn from '../js/parent-genome-column';

/*
 * Left column contains target drake and trial/goal feedback views
 */

var Case1ChallengeLeft = function (_React$Component) {
  _inherits(Case1ChallengeLeft, _React$Component);

  function Case1ChallengeLeft() {
    _classCallCheck(this, Case1ChallengeLeft);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Case1ChallengeLeft).apply(this, arguments));
  }

  _createClass(Case1ChallengeLeft, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var targetDrake = _props.targetDrake;
      var moveCount = _props.moveCount;
      var requiredMoveCount = _props.requiredMoveCount;
      var trialIndex = _props.trialIndex;
      var trialCount = _props.trialCount;

      return React.createElement(
        'div',
        { id: 'left-column', className: 'column' },
        React.createElement(
          'div',
          { id: 'target-drake-label', className: 'column-label' },
          'Target Drake'
        ),
        React.createElement(GeniBlocks.OrganismGlowView, { id: 'target-drake', className: 'drake-image',
          org: targetDrake, color: '#FFFFAA', size: 200 }),
        React.createElement(GeniBlocks.FeedbackView, { id: 'trial-feedback', className: 'feedback-view',
          text: ["TRIAL", trialIndex + ' of ' + trialCount] }),
        React.createElement(GeniBlocks.FeedbackView, { id: 'goal-feedback', className: 'feedback-view',
          text: ['GOAL is ' + requiredMoveCount + ' MOVES', 'Your moves: ' + moveCount] })
      );
    }
  }]);

  return Case1ChallengeLeft;
}(React.Component);

/*
 * Center column contains your drake, sex change buttons, and currently
 * contains the user alert elements, although that's likely to change.
 */


Case1ChallengeLeft.propTypes = {
  targetDrake: React.PropTypes.object.isRequired,
  moveCount: React.PropTypes.number.isRequired,
  requiredMoveCount: React.PropTypes.number.isRequired,
  trialIndex: React.PropTypes.number.isRequired,
  trialCount: React.PropTypes.number.isRequired
};

var Case1ChallengeCenter = function (_React$Component2) {
  _inherits(Case1ChallengeCenter, _React$Component2);

  function Case1ChallengeCenter() {
    _classCallCheck(this, Case1ChallengeCenter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Case1ChallengeCenter).apply(this, arguments));
  }

  _createClass(Case1ChallengeCenter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.getElementById("alert-ok-button").onclick = this.props.onAlertButtonClick;
      document.getElementById("alert-try-button").onclick = this.props.onAlertButtonClick;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var sexLabels = _props2.sexLabels;
      var yourDrake = _props2.yourDrake;
      var yourDrakeSex = _props2.yourDrakeSex;
      var isDrakeHidden = _props2.isDrakeHidden;
      var showDrakeForConfirmation = _props2.showDrakeForConfirmation;

      return React.createElement(
        'div',
        { id: 'center-column', className: 'column' },
        React.createElement(
          'div',
          { id: 'your-drake-label', className: 'column-label' },
          'Your Drake'
        ),
        React.createElement(GeniBlocks.QuestionOrganismGlowView, {
          id: 'your-drake', className: 'drake-image',
          org: yourDrake, color: '#FFFFAA', size: 200,
          hidden: isDrakeHidden && !showDrakeForConfirmation }),
        React.createElement('div', { id: 'change-sex-buttons', className: 'no-label' }),
        React.createElement(GeniBlocks.ChangeSexButtons, {
          id: 'change-sex-buttons', className: 'no-label',
          sex: sexLabels[yourDrakeSex],
          species: 'Drake',
          onChange: this.props.onSexChange }),
        React.createElement(
          'div',
          { id: 'alert-wrapper' },
          React.createElement('h3', { id: 'alert-title' }),
          React.createElement('div', { id: 'alert-message' }),
          React.createElement(
            'button',
            { id: 'alert-try-button' },
            'Try Again'
          ),
          React.createElement(
            'button',
            { id: 'alert-ok-button' },
            'OK'
          )
        )
      );
    }
  }]);

  return Case1ChallengeCenter;
}(React.Component);

/*
 * Right column contains the drake genome and the "Check Drake" button
 */


Case1ChallengeCenter.propTypes = {
  sexLabels: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  yourDrake: React.PropTypes.object.isRequired,
  yourDrakeSex: React.PropTypes.number.isRequired,
  isDrakeHidden: React.PropTypes.bool.isRequired,
  showDrakeForConfirmation: React.PropTypes.bool.isRequired,
  onSexChange: React.PropTypes.func.isRequired,
  onAlertButtonClick: React.PropTypes.func.isRequired
};

var Case1ChallengeRight = function (_React$Component3) {
  _inherits(Case1ChallengeRight, _React$Component3);

  function Case1ChallengeRight() {
    _classCallCheck(this, Case1ChallengeRight);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Case1ChallengeRight).apply(this, arguments));
  }

  _createClass(Case1ChallengeRight, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var hiddenAlleles = _props3.hiddenAlleles;
      var yourDrake = _props3.yourDrake;

      return React.createElement(DrakeGenomeColumn, { id: 'right-column', idPrefix: 'your', columnLabel: 'Chromosome Control',
        drake: yourDrake, showDrake: false, editable: true,
        style: { marginTop: 50, top: 50 },
        hiddenAlleles: hiddenAlleles,
        onAlleleChange: this.props.onAlleleChange,
        buttonID: 'test-drake-button', buttonLabel: 'Check Drake',
        onButtonClick: this.props.onCheckDrake });
    }
  }]);

  return Case1ChallengeRight;
}(React.Component);

/*
 * The Case1Challenge component coordinates the efforts of the Case1ChallengeLeft,
 * Case1ChallengeCenter, and Case1ChallengeRight components and manages the
 * the challenge state. It, in turn, will eventually be managed (along with the
 * Case1Playground component) by the Case1 component.
 */


Case1ChallengeRight.propTypes = {
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  yourDrake: React.PropTypes.object.isRequired,
  onAlleleChange: React.PropTypes.func.isRequired,
  onCheckDrake: React.PropTypes.func.isRequired
};

var Case1Challenge = function (_React$Component4) {
  _inherits(Case1Challenge, _React$Component4);

  function Case1Challenge() {
    _classCallCheck(this, Case1Challenge);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Case1Challenge).call(this));

    _this4.resetChallenge = function () {
      _this4.setState({ trialIndex: 1 });
      _this4.resetDrakes();
    };

    _this4.continueTrial = function () {
      _this4.setState({ showDrakeForConfirmation: false });
    };

    _this4.resetTrial = function () {
      _this4.setState({ trialIndex: ++_this4.state.trialIndex });
      _this4.resetDrakes();
    };

    _this4.advanceTrial = function () {
      var _this4$props = _this4.props;
      var currChallenge = _this4$props.currChallenge;
      var lastChallenge = _this4$props.lastChallenge;
      var trialCount = _this4.props.challengeSpec.trialCount;
      var trialIndex = _this4.state.trialIndex;

      if (trialIndex < trialCount) {
        _this4.showAlert(true, {
          title: "Good work!",
          message: "The drake you have created matches the target drake.",
          okButton: "OK",
          okCallback: _this4.resetTrial
        });
      } else {
        // user has completed a challenge
        if (currChallenge < lastChallenge) {
          // user has completed a challenge other than the last
          _this4.showAlert(true, {
            title: "Good work!",
            message: "The drake you have created matches the target drake.",
            okButton: "Next Challenge",
            okCallback: _this4.props.onAdvanceChallenge,
            tryButton: "Try Again",
            tryCallback: _this4.resetChallenge
          });
        } else {
          // user has completed the last challenge
          _this4.showAlert(true, {
            title: "Congratulations!",
            message: "You've completed all the trials in this challenge.",
            okButton: "Go back to the Case Log",
            okCallback: _this4.props.onAdvanceChallenge,
            tryButton: "Try Again",
            tryCallback: _this4.resetChallenge
          });
        }
      }
    };

    _this4.handleSexChange = function (iSex) {
      var _this4$state = _this4.state;
      var yourDrake = _this4$state.yourDrake;
      var yourDrakeSex = _this4$state.yourDrakeSex;
      // replace alleles lost when switching to male and back

      var sexLabels = _this4.props.sexLabels;
      var drakeAlleles = _this4.props.challengeSpec.drakeAlleles;
      var alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(yourDrake.genetics, yourDrake.getAlleleString(), drakeAlleles);
      yourDrakeSex = sexLabels.indexOf(iSex);
      yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, yourDrakeSex);
      _this4.advanceMove();
      _this4.setState({ yourDrake: yourDrake, yourDrakeSex: yourDrakeSex });
    };

    _this4.handleAlleleChange = function (chrom, side, prevAllele, newAllele) {
      var yourDrake = _this4.state.yourDrake;

      yourDrake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
      yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, yourDrake.getAlleleString(), yourDrake.sex);
      _this4.advanceMove();
      _this4.setState({ yourDrake: yourDrake });
    };

    _this4.handleCheckDrake = function () {
      var _this4$state2 = _this4.state;
      var yourDrake = _this4$state2.yourDrake;
      var targetDrake = _this4$state2.targetDrake;

      // Checking the answer counts as a move

      _this4.advanceMove();
      _this4.setState({ showDrakeForConfirmation: true });

      if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(yourDrake, targetDrake)) {
        // checked drake is correct
        _this4.advanceTrial();
      } else {
        // checked drake is not correct
        _this4.showAlert(true, {
          title: "That's not the drake!",
          message: "The drake you have created doesn't match the target drake.\nPlease try again.",
          tryButton: "Try Again",
          tryCallback: _this4.continueTrial
        });
      }
    };

    _this4.handleAlertButtonClick = function (evt) {
      var targetID = evt.target.id;
      var alertButtonClickHandlers = _this4.state.alertButtonClickHandlers;

      var clientClickHandler = alertButtonClickHandlers[targetID];
      _this4.showAlert(false);
      if (clientClickHandler) clientClickHandler();
    };

    _this4.state = {
      moveCount: 0,
      requiredMoveCount: 0,
      trialIndex: 1,
      showDrakeForConfirmation: false,
      alertButtonClickHandlers: {}
    };
    return _this4;
  }

  _createClass(Case1Challenge, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.resetChallenge();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.currChallenge !== nextProps.currChallenge) {
        this.resetChallenge();
      }
    }
  }, {
    key: 'resetDrakes',
    value: function resetDrakes() {
      var drakeAlleles = this.props.challengeSpec.drakeAlleles;

      var requiredMoveCount = 0,
          targetDrakeSex = void 0,
          targetDrake = void 0,
          yourDrakeSex = void 0,
          yourDrake = void 0;
      // regenerate if we generate drakes that are too close to each other
      while (requiredMoveCount < 3) {
        targetDrakeSex = Math.floor(2 * Math.random());
        targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, drakeAlleles, targetDrakeSex);
        yourDrakeSex = Math.floor(2 * Math.random());
        yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, drakeAlleles, yourDrakeSex);
        // add one for clicking the "Check Drake" button
        requiredMoveCount = GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(yourDrake, targetDrake) + 1;
      }
      this.setState({ targetDrakeSex: targetDrakeSex, targetDrake: targetDrake,
        yourDrakeSex: yourDrakeSex, yourDrake: yourDrake,
        moveCount: 0, requiredMoveCount: requiredMoveCount,
        showDrakeForConfirmation: false });
    }
  }, {
    key: 'advanceMove',
    value: function advanceMove() {
      this.setState({ moveCount: ++this.state.moveCount });
    }
  }, {
    key: 'showAlert',
    value: function showAlert(iShow, iOptions) {
      var displayMode = iShow ? 'block' : 'none',
          okButton = document.getElementById('alert-ok-button'),
          tryButton = document.getElementById('alert-try-button');
      var alertButtonClickHandlers = this.state.alertButtonClickHandlers;

      if (iShow) {
        document.getElementById("alert-title").innerHTML = iOptions.title || "";
        document.getElementById("alert-message").innerHTML = iOptions.message || "";
        okButton.innerHTML = iOptions.okButton || "";
        okButton.style.display = iOptions.okButton ? 'block' : 'none';
        okButton.dataset.okCallback = iOptions.okCallback || '';
        alertButtonClickHandlers[okButton.id] = iOptions.okCallback || null;
        tryButton.innerHTML = iOptions.tryButton || "";
        tryButton.style.display = iOptions.tryButton ? 'block' : 'none';
        alertButtonClickHandlers[tryButton.id] = iOptions.tryCallback || null;
      } else {
        alertButtonClickHandlers[okButton.id] = null;
        alertButtonClickHandlers[tryButton.id] = null;
      }
      this.setState({ alertButtonClickHandlers: alertButtonClickHandlers });
      document.getElementById("overlay").style.display = displayMode;
      document.getElementById("alert-wrapper").style.display = displayMode;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$challengeSpec = this.props.challengeSpec;
      var hiddenAlleles = _props$challengeSpec.hiddenAlleles;
      var isDrakeHidden = _props$challengeSpec.isDrakeHidden;
      var trialCount = _props$challengeSpec.trialCount;
      var _state = this.state;
      var targetDrake = _state.targetDrake;
      var yourDrake = _state.yourDrake;
      var yourDrakeSex = _state.yourDrakeSex;
      var showDrakeForConfirmation = _state.showDrakeForConfirmation;
      var moveCount = _state.moveCount;
      var requiredMoveCount = _state.requiredMoveCount;
      var trialIndex = _state.trialIndex;

      return React.createElement(
        'div',
        { id: 'challenges-wrapper' },
        React.createElement(Case1ChallengeLeft, { targetDrake: targetDrake,
          moveCount: moveCount,
          requiredMoveCount: requiredMoveCount,
          trialIndex: trialIndex,
          trialCount: trialCount }),
        React.createElement(Case1ChallengeCenter, { sexLabels: this.props.sexLabels,
          yourDrake: yourDrake, yourDrakeSex: yourDrakeSex,
          isDrakeHidden: isDrakeHidden,
          showDrakeForConfirmation: showDrakeForConfirmation,
          onSexChange: this.handleSexChange,
          onAlertButtonClick: this.handleAlertButtonClick }),
        React.createElement(Case1ChallengeRight, { hiddenAlleles: hiddenAlleles,
          yourDrake: yourDrake,
          onAlleleChange: this.handleAlleleChange,
          onCheckDrake: this.handleCheckDrake })
      );
    }
  }]);

  return Case1Challenge;
}(React.Component);

Case1Challenge.propTypes = {
  sexLabels: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  challengeSpec: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    isDrakeHidden: React.PropTypes.bool.isRequired,
    trialCount: React.PropTypes.number.isRequired,
    drakeAlleles: React.PropTypes.string.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string)
  }).isRequired,
  currChallenge: React.PropTypes.number.isRequired,
  lastChallenge: React.PropTypes.number.isRequired,
  onAdvanceChallenge: React.PropTypes.func.isRequired
};


Case1Challenge;
//# sourceMappingURL=data:application/json;base64,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TUFBaEIsQ0FBeEIsQ0FBZ0QsVUFBaEQ7QUFDWCxpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0I7QUFDbkMsV0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUCxtQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7QUFDZixnQkFBWSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDWixrQkFBYyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDZCxtQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBd0IsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXZDO0dBTGEsRUFNWixVQU5ZO0FBT2YsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ2YsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ2Ysc0JBQW9CLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFyQjs7OztBQWlOeEIiLCJmaWxlIjoiY2FzZS0xL2NoYWxsZW5nZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2FzZSAxIENoYWxsZW5nZXNcbiAqXG4gKiBUaGUgY29kZSBpbiB0aGlzIG1vZHVsZSB3YXMgd3JpdHRlbiB0byBzdXBwb3J0IGEgcmVjcmVhdGlvbiBvZiB0aGUgY2hhbGxlbmdlc1xuICogZnJvbSBDYXNlIDEgaW4gR2VuaXZlcnNlLiBUaGUgY2hhbGxlbmdlcyBhcmU6XG4gKiAgQ2hhbGxlbmdlIDA6IE1hdGNoIHRoZSBwaGVub3R5cGUgb2YgYSB2aXNpYmxlIHRlc3QgZHJha2UgdG8gdGhhdCBvZiBhIHRhcmdldCBkcmFrZVxuICogICAgICAgICAgICAgICAoVGhpcyBjaGFsbGVuZ2UgaXMgbm90IGluIEdlbml2ZXJzZSBidXQgaXQgd2FzIGRlZW1lZCBhIHVzZWZ1bCBhZGRpdGlvbi4pXG4gKiAgQ2hhbGxlbmdlIDE6IE1hdGNoIHRoZSBwaGVub3R5cGUgb2YgYSBoaWRkZW4gdGVzdCBkcmFrZSB0byB0aGF0IG9mIGEgdGFyZ2V0IGRyYWtlXG4gKiAgQ2hhbGxlbmdlIDI6IE1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhyZWUgaGlkZGVuIHRlc3QgZHJha2VzIHRvIHRhcmdldCBkcmFrZXNcbiAqL1xuLyogZ2xvYmFsIERyYWtlR2Vub21lQ29sdW1uICovXG4vL2ltcG9ydCBEcmFrZUdlbm9tZUNvbHVtbiBmcm9tICcuLi9qcy9wYXJlbnQtZ2Vub21lLWNvbHVtbic7XG5cbi8qXG4gKiBMZWZ0IGNvbHVtbiBjb250YWlucyB0YXJnZXQgZHJha2UgYW5kIHRyaWFsL2dvYWwgZmVlZGJhY2sgdmlld3NcbiAqL1xuY2xhc3MgQ2FzZTFDaGFsbGVuZ2VMZWZ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRhcmdldERyYWtlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbW92ZUNvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmVxdWlyZWRNb3ZlQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB0cmlhbEluZGV4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgdHJpYWxDb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0YXJnZXREcmFrZSwgbW92ZUNvdW50LCByZXF1aXJlZE1vdmVDb3VudCwgdHJpYWxJbmRleCwgdHJpYWxDb3VudCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nbGVmdC1jb2x1bW4nIGNsYXNzTmFtZT0nY29sdW1uJz5cbiAgICAgICAgPGRpdiBpZD0ndGFyZ2V0LWRyYWtlLWxhYmVsJyBjbGFzc05hbWU9J2NvbHVtbi1sYWJlbCc+VGFyZ2V0IERyYWtlPC9kaXY+XG5cbiAgICAgICAgPEdlbmlCbG9ja3MuT3JnYW5pc21HbG93VmlldyBpZD0ndGFyZ2V0LWRyYWtlJyBjbGFzc05hbWU9J2RyYWtlLWltYWdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnPXt0YXJnZXREcmFrZX0gY29sb3I9JyNGRkZGQUEnIHNpemU9ezIwMH0vPlxuXG4gICAgICAgIDxHZW5pQmxvY2tzLkZlZWRiYWNrVmlldyBpZD0ndHJpYWwtZmVlZGJhY2snIGNsYXNzTmFtZT0nZmVlZGJhY2stdmlldydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17W1wiVFJJQUxcIiwgYCR7dHJpYWxJbmRleH0gb2YgJHt0cmlhbENvdW50fWBdfS8+XG5cbiAgICAgICAgPEdlbmlCbG9ja3MuRmVlZGJhY2tWaWV3IGlkPSdnb2FsLWZlZWRiYWNrJyBjbGFzc05hbWU9J2ZlZWRiYWNrLXZpZXcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e1tgR09BTCBpcyAke3JlcXVpcmVkTW92ZUNvdW50fSBNT1ZFU2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFlvdXIgbW92ZXM6ICR7bW92ZUNvdW50fWBdfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbi8qXG4gKiBDZW50ZXIgY29sdW1uIGNvbnRhaW5zIHlvdXIgZHJha2UsIHNleCBjaGFuZ2UgYnV0dG9ucywgYW5kIGN1cnJlbnRseVxuICogY29udGFpbnMgdGhlIHVzZXIgYWxlcnQgZWxlbWVudHMsIGFsdGhvdWdoIHRoYXQncyBsaWtlbHkgdG8gY2hhbmdlLlxuICovXG5jbGFzcyBDYXNlMUNoYWxsZW5nZUNlbnRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBzZXhMYWJlbHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWQsXG4gICAgeW91ckRyYWtlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgeW91ckRyYWtlU2V4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaXNEcmFrZUhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzaG93RHJha2VGb3JDb25maXJtYXRpb246IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25TZXhDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25BbGVydEJ1dHRvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW9rLWJ1dHRvblwiKS5vbmNsaWNrID0gdGhpcy5wcm9wcy5vbkFsZXJ0QnV0dG9uQ2xpY2s7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpLm9uY2xpY2sgPSB0aGlzLnByb3BzLm9uQWxlcnRCdXR0b25DbGljaztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHNleExhYmVscywgeW91ckRyYWtlLCB5b3VyRHJha2VTZXgsXG4gICAgICAgICAgICBpc0RyYWtlSGlkZGVuLCBzaG93RHJha2VGb3JDb25maXJtYXRpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2NlbnRlci1jb2x1bW4nIGNsYXNzTmFtZT0nY29sdW1uJz5cbiAgICAgICAgPGRpdiBpZD1cInlvdXItZHJha2UtbGFiZWxcIiBjbGFzc05hbWU9XCJjb2x1bW4tbGFiZWxcIj5Zb3VyIERyYWtlPC9kaXY+XG5cbiAgICAgICAgPEdlbmlCbG9ja3MuUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3XG4gICAgICAgICAgICBpZD0neW91ci1kcmFrZScgY2xhc3NOYW1lPSdkcmFrZS1pbWFnZSdcbiAgICAgICAgICAgIG9yZz17eW91ckRyYWtlfSBjb2xvcj0nI0ZGRkZBQScgc2l6ZT17MjAwfVxuICAgICAgICAgICAgaGlkZGVuPXtpc0RyYWtlSGlkZGVuICYmICFzaG93RHJha2VGb3JDb25maXJtYXRpb259Lz5cblxuICAgICAgICA8ZGl2IGlkPVwiY2hhbmdlLXNleC1idXR0b25zXCIgY2xhc3NOYW1lPVwibm8tbGFiZWxcIj48L2Rpdj5cbiAgICAgICAgPEdlbmlCbG9ja3MuQ2hhbmdlU2V4QnV0dG9uc1xuICAgICAgICAgICAgaWQ9J2NoYW5nZS1zZXgtYnV0dG9ucycgY2xhc3NOYW1lPSduby1sYWJlbCdcbiAgICAgICAgICAgIHNleD17c2V4TGFiZWxzW3lvdXJEcmFrZVNleF19XG4gICAgICAgICAgICBzcGVjaWVzPVwiRHJha2VcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25TZXhDaGFuZ2V9Lz5cblxuICAgICAgICA8ZGl2IGlkPVwiYWxlcnQtd3JhcHBlclwiPlxuICAgICAgICAgIDxoMyBpZD1cImFsZXJ0LXRpdGxlXCI+PC9oMz5cbiAgICAgICAgICA8ZGl2IGlkPVwiYWxlcnQtbWVzc2FnZVwiPjwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJhbGVydC10cnktYnV0dG9uXCI+VHJ5IEFnYWluPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImFsZXJ0LW9rLWJ1dHRvblwiPk9LPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cbi8qXG4gKiBSaWdodCBjb2x1bW4gY29udGFpbnMgdGhlIGRyYWtlIGdlbm9tZSBhbmQgdGhlIFwiQ2hlY2sgRHJha2VcIiBidXR0b25cbiAqL1xuY2xhc3MgQ2FzZTFDaGFsbGVuZ2VSaWdodCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKS5pc1JlcXVpcmVkLFxuICAgIHlvdXJEcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uQ2hlY2tEcmFrZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGlkZGVuQWxsZWxlcywgeW91ckRyYWtlIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8RHJha2VHZW5vbWVDb2x1bW4gaWQ9J3JpZ2h0LWNvbHVtbicgaWRQcmVmaXg9J3lvdXInIGNvbHVtbkxhYmVsPVwiQ2hyb21vc29tZSBDb250cm9sXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWtlPXt5b3VyRHJha2V9IHNob3dEcmFrZT17ZmFsc2V9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpblRvcDogNTAsIHRvcDogNTB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5wcm9wcy5vbkFsbGVsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uSUQ9J3Rlc3QtZHJha2UtYnV0dG9uJyBidXR0b25MYWJlbD1cIkNoZWNrIERyYWtlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25CdXR0b25DbGljaz17dGhpcy5wcm9wcy5vbkNoZWNrRHJha2V9Lz5cbiAgICApO1xuICB9XG59XG5cbi8qXG4gKiBUaGUgQ2FzZTFDaGFsbGVuZ2UgY29tcG9uZW50IGNvb3JkaW5hdGVzIHRoZSBlZmZvcnRzIG9mIHRoZSBDYXNlMUNoYWxsZW5nZUxlZnQsXG4gKiBDYXNlMUNoYWxsZW5nZUNlbnRlciwgYW5kIENhc2UxQ2hhbGxlbmdlUmlnaHQgY29tcG9uZW50cyBhbmQgbWFuYWdlcyB0aGVcbiAqIHRoZSBjaGFsbGVuZ2Ugc3RhdGUuIEl0LCBpbiB0dXJuLCB3aWxsIGV2ZW50dWFsbHkgYmUgbWFuYWdlZCAoYWxvbmcgd2l0aCB0aGVcbiAqIENhc2UxUGxheWdyb3VuZCBjb21wb25lbnQpIGJ5IHRoZSBDYXNlMSBjb21wb25lbnQuXG4gKi9cbmNsYXNzIENhc2UxQ2hhbGxlbmdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNleExhYmVsczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZykuaXNSZXF1aXJlZCxcbiAgICBjaGFsbGVuZ2VTcGVjOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGlzRHJha2VIaWRkZW46IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICB0cmlhbENvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBkcmFrZUFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBjdXJyQ2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbGFzdENoYWxsZW5nZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9uQWR2YW5jZUNoYWxsZW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92ZUNvdW50OiAwLFxuICAgICAgcmVxdWlyZWRNb3ZlQ291bnQ6IDAsXG4gICAgICB0cmlhbEluZGV4OiAxLFxuICAgICAgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uOiBmYWxzZSxcbiAgICAgIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyczoge31cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMucmVzZXRDaGFsbGVuZ2UoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY3VyckNoYWxsZW5nZSAhPT0gbmV4dFByb3BzLmN1cnJDaGFsbGVuZ2UpIHtcbiAgICAgIHRoaXMucmVzZXRDaGFsbGVuZ2UoKTtcbiAgICB9XG4gIH1cblxuICByZXNldERyYWtlcygpIHtcbiAgICBjb25zdCB7IGRyYWtlQWxsZWxlcyB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjO1xuICAgIGxldCByZXF1aXJlZE1vdmVDb3VudCA9IDAsXG4gICAgICAgIHRhcmdldERyYWtlU2V4LCB0YXJnZXREcmFrZSxcbiAgICAgICAgeW91ckRyYWtlU2V4LCB5b3VyRHJha2U7XG4gICAgLy8gcmVnZW5lcmF0ZSBpZiB3ZSBnZW5lcmF0ZSBkcmFrZXMgdGhhdCBhcmUgdG9vIGNsb3NlIHRvIGVhY2ggb3RoZXJcbiAgICB3aGlsZSAocmVxdWlyZWRNb3ZlQ291bnQgPCAzKSB7XG4gICAgICB0YXJnZXREcmFrZVNleCA9IE1hdGguZmxvb3IoMiAqIE1hdGgucmFuZG9tKCkpO1xuICAgICAgdGFyZ2V0RHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmFrZUFsbGVsZXMsIHRhcmdldERyYWtlU2V4KTtcbiAgICAgIHlvdXJEcmFrZVNleCA9IE1hdGguZmxvb3IoMiAqIE1hdGgucmFuZG9tKCkpO1xuICAgICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWtlQWxsZWxlcywgeW91ckRyYWtlU2V4KTtcbiAgICAgIC8vIGFkZCBvbmUgZm9yIGNsaWNraW5nIHRoZSBcIkNoZWNrIERyYWtlXCIgYnV0dG9uXG4gICAgICByZXF1aXJlZE1vdmVDb3VudCA9IEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHlvdXJEcmFrZSwgdGFyZ2V0RHJha2UpICsgMTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRhcmdldERyYWtlU2V4LCB0YXJnZXREcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlU2V4LCB5b3VyRHJha2UsXG4gICAgICAgICAgICAgICAgICAgIG1vdmVDb3VudDogMCwgcmVxdWlyZWRNb3ZlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgIHNob3dEcmFrZUZvckNvbmZpcm1hdGlvbjogZmFsc2UgfSk7XG4gIH1cblxuICByZXNldENoYWxsZW5nZSA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdHJpYWxJbmRleDogMSB9KTtcbiAgICB0aGlzLnJlc2V0RHJha2VzKCk7XG4gIH1cblxuICBhZHZhbmNlTW92ZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbW92ZUNvdW50OiArK3RoaXMuc3RhdGUubW92ZUNvdW50IH0pO1xuICB9XG5cbiAgY29udGludWVUcmlhbCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uOiBmYWxzZSB9KTtcbiAgfVxuXG4gIHJlc2V0VHJpYWwgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRyaWFsSW5kZXg6ICsrdGhpcy5zdGF0ZS50cmlhbEluZGV4IH0pO1xuICAgIHRoaXMucmVzZXREcmFrZXMoKTtcbiAgfVxuXG4gIGFkdmFuY2VUcmlhbCA9ICgpID0+IHtcbiAgICBjb25zdCB7IGN1cnJDaGFsbGVuZ2UsIGxhc3RDaGFsbGVuZ2UgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgeyB0cmlhbENvdW50IH0gPSB0aGlzLnByb3BzLmNoYWxsZW5nZVNwZWMsXG4gICAgICAgICAgeyB0cmlhbEluZGV4IH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICh0cmlhbEluZGV4IDwgdHJpYWxDb3VudCkge1xuICAgICAgdGhpcy5zaG93QWxlcnQodHJ1ZSwge1xuICAgICAgICAgICAgdGl0bGU6IFwiR29vZCB3b3JrIVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgICBva0J1dHRvbjogXCJPS1wiLFxuICAgICAgICAgICAgb2tDYWxsYmFjazogdGhpcy5yZXNldFRyaWFsXG4gICAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gdXNlciBoYXMgY29tcGxldGVkIGEgY2hhbGxlbmdlXG4gICAgICBpZiAoY3VyckNoYWxsZW5nZSA8IGxhc3RDaGFsbGVuZ2UpIHtcbiAgICAgICAgLy8gdXNlciBoYXMgY29tcGxldGVkIGEgY2hhbGxlbmdlIG90aGVyIHRoYW4gdGhlIGxhc3RcbiAgICAgICAgdGhpcy5zaG93QWxlcnQodHJ1ZSwgeyBcbiAgICAgICAgICAgICAgdGl0bGU6IFwiR29vZCB3b3JrIVwiLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIG1hdGNoZXMgdGhlIHRhcmdldCBkcmFrZS5cIixcbiAgICAgICAgICAgICAgb2tCdXR0b246IFwiTmV4dCBDaGFsbGVuZ2VcIixcbiAgICAgICAgICAgICAgb2tDYWxsYmFjazogdGhpcy5wcm9wcy5vbkFkdmFuY2VDaGFsbGVuZ2UsXG4gICAgICAgICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIixcbiAgICAgICAgICAgICAgdHJ5Q2FsbGJhY2s6IHRoaXMucmVzZXRDaGFsbGVuZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIHVzZXIgaGFzIGNvbXBsZXRlZCB0aGUgbGFzdCBjaGFsbGVuZ2VcbiAgICAgICAgdGhpcy5zaG93QWxlcnQodHJ1ZSwge1xuICAgICAgICAgICAgICB0aXRsZTogXCJDb25ncmF0dWxhdGlvbnMhXCIsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91J3ZlIGNvbXBsZXRlZCBhbGwgdGhlIHRyaWFscyBpbiB0aGlzIGNoYWxsZW5nZS5cIixcbiAgICAgICAgICAgICAgb2tCdXR0b246IFwiR28gYmFjayB0byB0aGUgQ2FzZSBMb2dcIixcbiAgICAgICAgICAgICAgb2tDYWxsYmFjazogdGhpcy5wcm9wcy5vbkFkdmFuY2VDaGFsbGVuZ2UsXG4gICAgICAgICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIixcbiAgICAgICAgICAgICAgdHJ5Q2FsbGJhY2s6IHRoaXMucmVzZXRDaGFsbGVuZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVNleENoYW5nZSA9IChpU2V4KSA9PiB7XG4gICAgbGV0IHsgeW91ckRyYWtlLCB5b3VyRHJha2VTZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgYWxsZWxlcyBsb3N0IHdoZW4gc3dpdGNoaW5nIHRvIG1hbGUgYW5kIGJhY2tcbiAgICBjb25zdCB7IHNleExhYmVscyB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICB7IGRyYWtlQWxsZWxlcyB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjLFxuICAgICAgICAgIGFsbGVsZVN0cmluZyA9IEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5maWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21BbGxlbGVTdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHlvdXJEcmFrZS5nZW5ldGljcywgeW91ckRyYWtlLmdldEFsbGVsZVN0cmluZygpLCBkcmFrZUFsbGVsZXMpO1xuICAgIHlvdXJEcmFrZVNleCA9IHNleExhYmVscy5pbmRleE9mKGlTZXgpO1xuICAgIHlvdXJEcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGFsbGVsZVN0cmluZywgeW91ckRyYWtlU2V4KTtcbiAgICB0aGlzLmFkdmFuY2VNb3ZlKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHlvdXJEcmFrZSwgeW91ckRyYWtlU2V4IH0pO1xuICB9XG5cbiAgaGFuZGxlQWxsZWxlQ2hhbmdlID0gKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpID0+IHtcbiAgICBsZXQgeyB5b3VyRHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgeW91ckRyYWtlLmdlbmV0aWNzLmdlbm90eXBlLnJlcGxhY2VBbGxlbGVDaHJvbU5hbWUoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlLnNleCk7XG4gICAgdGhpcy5hZHZhbmNlTW92ZSgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyB5b3VyRHJha2UgfSk7XG4gIH1cblxuICBoYW5kbGVDaGVja0RyYWtlID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgeW91ckRyYWtlLCB0YXJnZXREcmFrZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIC8vIENoZWNraW5nIHRoZSBhbnN3ZXIgY291bnRzIGFzIGEgbW92ZVxuICAgIHRoaXMuYWR2YW5jZU1vdmUoKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uOiB0cnVlIH0pO1xuXG4gICAgaWYgKDAgPT09IEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5udW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHlvdXJEcmFrZSwgdGFyZ2V0RHJha2UpKSB7XG4gICAgICAvLyBjaGVja2VkIGRyYWtlIGlzIGNvcnJlY3RcbiAgICAgIHRoaXMuYWR2YW5jZVRyaWFsKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gY2hlY2tlZCBkcmFrZSBpcyBub3QgY29ycmVjdFxuICAgICAgdGhpcy5zaG93QWxlcnQodHJ1ZSwge1xuICAgICAgICAgICAgdGl0bGU6IFwiVGhhdCdzIG5vdCB0aGUgZHJha2UhXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIGRvZXNuJ3QgbWF0Y2ggdGhlIHRhcmdldCBkcmFrZS5cXG5QbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiLFxuICAgICAgICAgICAgdHJ5Q2FsbGJhY2s6IHRoaXMuY29udGludWVUcmlhbFxuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNob3dBbGVydChpU2hvdywgaU9wdGlvbnMpIHtcbiAgICBjb25zdCBkaXNwbGF5TW9kZSA9IGlTaG93ID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgICBva0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGVydC1vay1idXR0b24nKSxcbiAgICAgICAgICB0cnlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxlcnQtdHJ5LWJ1dHRvbicpO1xuICAgIGxldCB7IGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVycyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoaVNob3cpIHtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtdGl0bGVcIikuaW5uZXJIVE1MID0gaU9wdGlvbnMudGl0bGUgfHwgXCJcIjtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtbWVzc2FnZVwiKS5pbm5lckhUTUwgPSBpT3B0aW9ucy5tZXNzYWdlIHx8IFwiXCI7XG4gICAgICBva0J1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy5va0J1dHRvbiB8fCBcIlwiO1xuICAgICAgb2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlPcHRpb25zLm9rQnV0dG9uID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgIG9rQnV0dG9uLmRhdGFzZXQub2tDYWxsYmFjayA9IGlPcHRpb25zLm9rQ2FsbGJhY2sgfHwgJyc7XG4gICAgICBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnNbb2tCdXR0b24uaWRdID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCBudWxsO1xuICAgICAgdHJ5QnV0dG9uLmlubmVySFRNTCA9IGlPcHRpb25zLnRyeUJ1dHRvbiB8fCBcIlwiO1xuICAgICAgdHJ5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy50cnlCdXR0b24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBpT3B0aW9ucy50cnlDYWxsYmFjayB8fCBudWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyc1tva0J1dHRvbi5pZF0gPSBudWxsO1xuICAgICAgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC13cmFwcGVyXCIpLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5TW9kZTtcbiAgfVxuXG4gIGhhbmRsZUFsZXJ0QnV0dG9uQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0SUQgPSBldnQudGFyZ2V0LmlkLFxuICAgICAgICAgIHsgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGNsaWVudENsaWNrSGFuZGxlciA9IGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyc1t0YXJnZXRJRF07XG4gICAgdGhpcy5zaG93QWxlcnQoZmFsc2UpO1xuICAgIGlmIChjbGllbnRDbGlja0hhbmRsZXIpXG4gICAgICBjbGllbnRDbGlja0hhbmRsZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGhpZGRlbkFsbGVsZXMsIGlzRHJha2VIaWRkZW4sIHRyaWFsQ291bnQgfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlYyxcbiAgICAgICAgICB7IHRhcmdldERyYWtlLCB5b3VyRHJha2UsIHlvdXJEcmFrZVNleCwgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uLFxuICAgICAgICAgICAgbW92ZUNvdW50LCByZXF1aXJlZE1vdmVDb3VudCwgdHJpYWxJbmRleCB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nY2hhbGxlbmdlcy13cmFwcGVyJz5cbiAgICAgICAgPENhc2UxQ2hhbGxlbmdlTGVmdCB0YXJnZXREcmFrZT17dGFyZ2V0RHJha2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUNvdW50PXttb3ZlQ291bnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRNb3ZlQ291bnQ9e3JlcXVpcmVkTW92ZUNvdW50fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWFsSW5kZXg9e3RyaWFsSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpYWxDb3VudD17dHJpYWxDb3VudH0vPlxuICAgICAgICA8Q2FzZTFDaGFsbGVuZ2VDZW50ZXIgc2V4TGFiZWxzPXt0aGlzLnByb3BzLnNleExhYmVsc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2U9e3lvdXJEcmFrZX0geW91ckRyYWtlU2V4PXt5b3VyRHJha2VTZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFrZUhpZGRlbj17aXNEcmFrZUhpZGRlbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93RHJha2VGb3JDb25maXJtYXRpb249e3Nob3dEcmFrZUZvckNvbmZpcm1hdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNleENoYW5nZT17dGhpcy5oYW5kbGVTZXhDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BbGVydEJ1dHRvbkNsaWNrPXt0aGlzLmhhbmRsZUFsZXJ0QnV0dG9uQ2xpY2t9Lz5cbiAgICAgICAgPENhc2UxQ2hhbGxlbmdlUmlnaHQgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2U9e3lvdXJEcmFrZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGVja0RyYWtlPXt0aGlzLmhhbmRsZUNoZWNrRHJha2V9Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQ2FzZTFDaGFsbGVuZ2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
