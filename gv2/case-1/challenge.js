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
//# sourceMappingURL=data:application/json;base64,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LFlBRHhEO0FBRW9CLHlCQUFlLGFBRm5DO0FBR29CLG9DQUEwQix3QkFIOUM7QUFJb0IsdUJBQWEsS0FBSyxlQUp0QztBQUtvQiw4QkFBb0IsS0FBSyxzQkFMN0MsR0FORjtRQVlFLG9CQUFDLG1CQUFELElBQXFCLGVBQWUsYUFBcEM7QUFDb0IscUJBQVcsU0FEL0I7QUFFb0IsMEJBQWdCLEtBQUssa0JBRnpDO0FBR29CLHdCQUFjLEtBQUssZ0JBSHZDO0FBWkYsT0FERjtBQW1CRDs7OztFQTNOMEIsTUFBTSxTOztBQUE3QixjLENBRUcsUyxHQUFZO0FBQ2pCLGFBQVcsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUF4QyxFQUFnRCxVQUQxQztBQUVqQixpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0I7QUFDbkMsV0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFESztBQUVuQyxtQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFGRDtBQUduQyxnQkFBWSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFIQTtBQUluQyxrQkFBYyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFKRjtBQUtuQyxtQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsQ0FBd0IsTUFBTSxTQUFOLENBQWdCLE1BQXhDO0FBTG9CLEdBQXRCLEVBTVosVUFSYztBQVNqQixpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFUckI7QUFVakIsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBVnJCO0FBV2pCLHNCQUFvQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUI7QUFYeEIsQzs7O0FBNE5yQiIsImZpbGUiOiJjYXNlLTEvY2hhbGxlbmdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDYXNlIDEgQ2hhbGxlbmdlc1xuICpcbiAqIFRoZSBjb2RlIGluIHRoaXMgbW9kdWxlIHdhcyB3cml0dGVuIHRvIHN1cHBvcnQgYSByZWNyZWF0aW9uIG9mIHRoZSBjaGFsbGVuZ2VzXG4gKiBmcm9tIENhc2UgMSBpbiBHZW5pdmVyc2UuIFRoZSBjaGFsbGVuZ2VzIGFyZTpcbiAqICBDaGFsbGVuZ2UgMDogTWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiBhIHZpc2libGUgdGVzdCBkcmFrZSB0byB0aGF0IG9mIGEgdGFyZ2V0IGRyYWtlXG4gKiAgICAgICAgICAgICAgIChUaGlzIGNoYWxsZW5nZSBpcyBub3QgaW4gR2VuaXZlcnNlIGJ1dCBpdCB3YXMgZGVlbWVkIGEgdXNlZnVsIGFkZGl0aW9uLilcbiAqICBDaGFsbGVuZ2UgMTogTWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiBhIGhpZGRlbiB0ZXN0IGRyYWtlIHRvIHRoYXQgb2YgYSB0YXJnZXQgZHJha2VcbiAqICBDaGFsbGVuZ2UgMjogTWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiB0aHJlZSBoaWRkZW4gdGVzdCBkcmFrZXMgdG8gdGFyZ2V0IGRyYWtlc1xuICovXG4vKiBnbG9iYWwgRHJha2VHZW5vbWVDb2x1bW4gKi9cbi8vaW1wb3J0IERyYWtlR2Vub21lQ29sdW1uIGZyb20gJy4uL2pzL3BhcmVudC1nZW5vbWUtY29sdW1uJztcblxuLypcbiAqIExlZnQgY29sdW1uIGNvbnRhaW5zIHRhcmdldCBkcmFrZSBhbmQgdHJpYWwvZ29hbCBmZWVkYmFjayB2aWV3c1xuICovXG5jbGFzcyBDYXNlMUNoYWxsZW5nZUxlZnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGFyZ2V0RHJha2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBtb3ZlQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICByZXF1aXJlZE1vdmVDb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHRyaWFsSW5kZXg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICB0cmlhbENvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHRhcmdldERyYWtlLCBtb3ZlQ291bnQsIHJlcXVpcmVkTW92ZUNvdW50LCB0cmlhbEluZGV4LCB0cmlhbENvdW50IH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsZWZ0LWNvbHVtbicgY2xhc3NOYW1lPSdjb2x1bW4nPlxuICAgICAgICA8ZGl2IGlkPSd0YXJnZXQtZHJha2UtbGFiZWwnIGNsYXNzTmFtZT0nY29sdW1uLWxhYmVsJz5UYXJnZXQgRHJha2U8L2Rpdj5cblxuICAgICAgICA8R2VuaUJsb2Nrcy5PcmdhbmlzbUdsb3dWaWV3IGlkPSd0YXJnZXQtZHJha2UnIGNsYXNzTmFtZT0nZHJha2UtaW1hZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmc9e3RhcmdldERyYWtlfSBjb2xvcj0nI0ZGRkZBQScgc2l6ZT17MjAwfS8+XG5cbiAgICAgICAgPEdlbmlCbG9ja3MuRmVlZGJhY2tWaWV3IGlkPSd0cmlhbC1mZWVkYmFjaycgY2xhc3NOYW1lPSdmZWVkYmFjay12aWV3J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtbXCJUUklBTFwiLCBgJHt0cmlhbEluZGV4fSBvZiAke3RyaWFsQ291bnR9YF19Lz5cblxuICAgICAgICA8R2VuaUJsb2Nrcy5GZWVkYmFja1ZpZXcgaWQ9J2dvYWwtZmVlZGJhY2snIGNsYXNzTmFtZT0nZmVlZGJhY2stdmlldydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17W2BHT0FMIGlzICR7cmVxdWlyZWRNb3ZlQ291bnR9IE1PVkVTYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgWW91ciBtb3ZlczogJHttb3ZlQ291bnR9YF19Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLypcbiAqIENlbnRlciBjb2x1bW4gY29udGFpbnMgeW91ciBkcmFrZSwgc2V4IGNoYW5nZSBidXR0b25zLCBhbmQgY3VycmVudGx5XG4gKiBjb250YWlucyB0aGUgdXNlciBhbGVydCBlbGVtZW50cywgYWx0aG91Z2ggdGhhdCdzIGxpa2VseSB0byBjaGFuZ2UuXG4gKi9cbmNsYXNzIENhc2UxQ2hhbGxlbmdlQ2VudGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNleExhYmVsczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZykuaXNSZXF1aXJlZCxcbiAgICB5b3VyRHJha2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB5b3VyRHJha2VTZXg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBpc0RyYWtlSGlkZGVuOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHNob3dEcmFrZUZvckNvbmZpcm1hdGlvbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvblNleENoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvbkFsZXJ0QnV0dG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtb2stYnV0dG9uXCIpLm9uY2xpY2sgPSB0aGlzLnByb3BzLm9uQWxlcnRCdXR0b25DbGljaztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXRyeS1idXR0b25cIikub25jbGljayA9IHRoaXMucHJvcHMub25BbGVydEJ1dHRvbkNsaWNrO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgc2V4TGFiZWxzLCB5b3VyRHJha2UsIHlvdXJEcmFrZVNleCxcbiAgICAgICAgICAgIGlzRHJha2VIaWRkZW4sIHNob3dEcmFrZUZvckNvbmZpcm1hdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nY2VudGVyLWNvbHVtbicgY2xhc3NOYW1lPSdjb2x1bW4nPlxuICAgICAgICA8ZGl2IGlkPVwieW91ci1kcmFrZS1sYWJlbFwiIGNsYXNzTmFtZT1cImNvbHVtbi1sYWJlbFwiPllvdXIgRHJha2U8L2Rpdj5cblxuICAgICAgICA8R2VuaUJsb2Nrcy5RdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXdcbiAgICAgICAgICAgIGlkPSd5b3VyLWRyYWtlJyBjbGFzc05hbWU9J2RyYWtlLWltYWdlJ1xuICAgICAgICAgICAgb3JnPXt5b3VyRHJha2V9IGNvbG9yPScjRkZGRkFBJyBzaXplPXsyMDB9XG4gICAgICAgICAgICBoaWRkZW49e2lzRHJha2VIaWRkZW4gJiYgIXNob3dEcmFrZUZvckNvbmZpcm1hdGlvbn0vPlxuXG4gICAgICAgIDxkaXYgaWQ9XCJjaGFuZ2Utc2V4LWJ1dHRvbnNcIiBjbGFzc05hbWU9XCJuby1sYWJlbFwiPjwvZGl2PlxuICAgICAgICA8R2VuaUJsb2Nrcy5DaGFuZ2VTZXhCdXR0b25zXG4gICAgICAgICAgICBpZD0nY2hhbmdlLXNleC1idXR0b25zJyBjbGFzc05hbWU9J25vLWxhYmVsJ1xuICAgICAgICAgICAgc2V4PXtzZXhMYWJlbHNbeW91ckRyYWtlU2V4XX1cbiAgICAgICAgICAgIHNwZWNpZXM9XCJEcmFrZVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy5vblNleENoYW5nZX0vPlxuXG4gICAgICAgIDxkaXYgaWQ9XCJhbGVydC13cmFwcGVyXCI+XG4gICAgICAgICAgPGgzIGlkPVwiYWxlcnQtdGl0bGVcIj48L2gzPlxuICAgICAgICAgIDxkaXYgaWQ9XCJhbGVydC1tZXNzYWdlXCI+PC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImFsZXJ0LXRyeS1idXR0b25cIj5UcnkgQWdhaW48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiYWxlcnQtb2stYnV0dG9uXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxuLypcbiAqIFJpZ2h0IGNvbHVtbiBjb250YWlucyB0aGUgZHJha2UgZ2Vub21lIGFuZCB0aGUgXCJDaGVjayBEcmFrZVwiIGJ1dHRvblxuICovXG5jbGFzcyBDYXNlMUNoYWxsZW5nZVJpZ2h0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGhpZGRlbkFsbGVsZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWQsXG4gICAgeW91ckRyYWtlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb25BbGxlbGVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25DaGVja0RyYWtlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBoaWRkZW5BbGxlbGVzLCB5b3VyRHJha2UgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFrZUdlbm9tZUNvbHVtbiBpZD0ncmlnaHQtY29sdW1uJyBpZFByZWZpeD0neW91cicgY29sdW1uTGFiZWw9XCJDaHJvbW9zb21lIENvbnRyb2xcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHJha2U9e3lvdXJEcmFrZX0gc2hvd0RyYWtlPXtmYWxzZX0gZWRpdGFibGU9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7bWFyZ2luVG9wOiA1MCwgdG9wOiA1MH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXt0aGlzLnByb3BzLm9uQWxsZWxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25JRD0ndGVzdC1kcmFrZS1idXR0b24nIGJ1dHRvbkxhYmVsPVwiQ2hlY2sgRHJha2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkJ1dHRvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2hlY2tEcmFrZX0vPlxuICAgICk7XG4gIH1cbn1cblxuLypcbiAqIFRoZSBDYXNlMUNoYWxsZW5nZSBjb21wb25lbnQgY29vcmRpbmF0ZXMgdGhlIGVmZm9ydHMgb2YgdGhlIENhc2UxQ2hhbGxlbmdlTGVmdCxcbiAqIENhc2UxQ2hhbGxlbmdlQ2VudGVyLCBhbmQgQ2FzZTFDaGFsbGVuZ2VSaWdodCBjb21wb25lbnRzIGFuZCBtYW5hZ2VzIHRoZVxuICogdGhlIGNoYWxsZW5nZSBzdGF0ZS4gSXQsIGluIHR1cm4sIHdpbGwgZXZlbnR1YWxseSBiZSBtYW5hZ2VkIChhbG9uZyB3aXRoIHRoZVxuICogQ2FzZTFQbGF5Z3JvdW5kIGNvbXBvbmVudCkgYnkgdGhlIENhc2UxIGNvbXBvbmVudC5cbiAqL1xuY2xhc3MgQ2FzZTFDaGFsbGVuZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2V4TGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKS5pc1JlcXVpcmVkLFxuICAgIGNoYWxsZW5nZVNwZWM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaXNEcmFrZUhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIHRyaWFsQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGRyYWtlQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZylcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIGN1cnJDaGFsbGVuZ2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsYXN0Q2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25BZHZhbmNlQ2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtb3ZlQ291bnQ6IDAsXG4gICAgICByZXF1aXJlZE1vdmVDb3VudDogMCxcbiAgICAgIHRyaWFsSW5kZXg6IDEsXG4gICAgICBzaG93RHJha2VGb3JDb25maXJtYXRpb246IGZhbHNlLFxuICAgICAgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzOiB7fVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5yZXNldENoYWxsZW5nZSgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jdXJyQ2hhbGxlbmdlICE9PSBuZXh0UHJvcHMuY3VyckNoYWxsZW5nZSkge1xuICAgICAgdGhpcy5yZXNldENoYWxsZW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0RHJha2VzKCkge1xuICAgIGNvbnN0IHsgZHJha2VBbGxlbGVzIH0gPSB0aGlzLnByb3BzLmNoYWxsZW5nZVNwZWM7XG4gICAgbGV0IHJlcXVpcmVkTW92ZUNvdW50ID0gMCxcbiAgICAgICAgdGFyZ2V0RHJha2VTZXgsIHRhcmdldERyYWtlLFxuICAgICAgICB5b3VyRHJha2VTZXgsIHlvdXJEcmFrZTtcbiAgICAvLyByZWdlbmVyYXRlIGlmIHdlIGdlbmVyYXRlIGRyYWtlcyB0aGF0IGFyZSB0b28gY2xvc2UgdG8gZWFjaCBvdGhlclxuICAgIHdoaWxlIChyZXF1aXJlZE1vdmVDb3VudCA8IDMpIHtcbiAgICAgIHRhcmdldERyYWtlU2V4ID0gTWF0aC5mbG9vcigyICogTWF0aC5yYW5kb20oKSk7XG4gICAgICB0YXJnZXREcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWtlQWxsZWxlcywgdGFyZ2V0RHJha2VTZXgpO1xuICAgICAgeW91ckRyYWtlU2V4ID0gTWF0aC5mbG9vcigyICogTWF0aC5yYW5kb20oKSk7XG4gICAgICB5b3VyRHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJha2VBbGxlbGVzLCB5b3VyRHJha2VTZXgpO1xuICAgICAgLy8gYWRkIG9uZSBmb3IgY2xpY2tpbmcgdGhlIFwiQ2hlY2sgRHJha2VcIiBidXR0b25cbiAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlck9mQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoeW91ckRyYWtlLCB0YXJnZXREcmFrZSkgKyAxO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgdGFyZ2V0RHJha2VTZXgsIHRhcmdldERyYWtlLFxuICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2VTZXgsIHlvdXJEcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZUNvdW50OiAwLCByZXF1aXJlZE1vdmVDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uOiBmYWxzZSB9KTtcbiAgfVxuXG4gIHJlc2V0Q2hhbGxlbmdlID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyB0cmlhbEluZGV4OiAxIH0pO1xuICAgIHRoaXMucmVzZXREcmFrZXMoKTtcbiAgfVxuXG4gIGFkdmFuY2VNb3ZlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBtb3ZlQ291bnQ6ICsrdGhpcy5zdGF0ZS5tb3ZlQ291bnQgfSk7XG4gIH1cblxuICBjb250aW51ZVRyaWFsID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93RHJha2VGb3JDb25maXJtYXRpb246IGZhbHNlIH0pO1xuICB9XG5cbiAgcmVzZXRUcmlhbCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdHJpYWxJbmRleDogKyt0aGlzLnN0YXRlLnRyaWFsSW5kZXggfSk7XG4gICAgdGhpcy5yZXNldERyYWtlcygpO1xuICB9XG5cbiAgYWR2YW5jZVRyaWFsID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgY3VyckNoYWxsZW5nZSwgbGFzdENoYWxsZW5nZSB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICB7IHRyaWFsQ291bnQgfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlYyxcbiAgICAgICAgICB7IHRyaWFsSW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHRyaWFsSW5kZXggPCB0cmlhbENvdW50KSB7XG4gICAgICB0aGlzLnNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgICAgICB0aXRsZTogXCJHb29kIHdvcmshXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIG1hdGNoZXMgdGhlIHRhcmdldCBkcmFrZS5cIixcbiAgICAgICAgICAgIG9rQnV0dG9uOiBcIk9LXCIsXG4gICAgICAgICAgICBva0NhbGxiYWNrOiB0aGlzLnJlc2V0VHJpYWxcbiAgICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyB1c2VyIGhhcyBjb21wbGV0ZWQgYSBjaGFsbGVuZ2VcbiAgICAgIGlmIChjdXJyQ2hhbGxlbmdlIDwgbGFzdENoYWxsZW5nZSkge1xuICAgICAgICAvLyB1c2VyIGhhcyBjb21wbGV0ZWQgYSBjaGFsbGVuZ2Ugb3RoZXIgdGhhbiB0aGUgbGFzdFxuICAgICAgICB0aGlzLnNob3dBbGVydCh0cnVlLCB7IFxuICAgICAgICAgICAgICB0aXRsZTogXCJHb29kIHdvcmshXCIsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICAgICAgICAgICAgICBva0J1dHRvbjogXCJOZXh0IENoYWxsZW5nZVwiLFxuICAgICAgICAgICAgICBva0NhbGxiYWNrOiB0aGlzLnByb3BzLm9uQWR2YW5jZUNoYWxsZW5nZSxcbiAgICAgICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiLFxuICAgICAgICAgICAgICB0cnlDYWxsYmFjazogdGhpcy5yZXNldENoYWxsZW5nZVxuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gdXNlciBoYXMgY29tcGxldGVkIHRoZSBsYXN0IGNoYWxsZW5nZVxuICAgICAgICB0aGlzLnNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkNvbmdyYXR1bGF0aW9ucyFcIixcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3UndmUgY29tcGxldGVkIGFsbCB0aGUgdHJpYWxzIGluIHRoaXMgY2hhbGxlbmdlLlwiLFxuICAgICAgICAgICAgICBva0J1dHRvbjogXCJHbyBiYWNrIHRvIHRoZSBDYXNlIExvZ1wiLFxuICAgICAgICAgICAgICBva0NhbGxiYWNrOiB0aGlzLnByb3BzLm9uQWR2YW5jZUNoYWxsZW5nZSxcbiAgICAgICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiLFxuICAgICAgICAgICAgICB0cnlDYWxsYmFjazogdGhpcy5yZXNldENoYWxsZW5nZVxuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2V4Q2hhbmdlID0gKGlTZXgpID0+IHtcbiAgICBsZXQgeyB5b3VyRHJha2UsIHlvdXJEcmFrZVNleCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBhbGxlbGVzIGxvc3Qgd2hlbiBzd2l0Y2hpbmcgdG8gbWFsZSBhbmQgYmFja1xuICAgIGNvbnN0IHsgc2V4TGFiZWxzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIHsgZHJha2VBbGxlbGVzIH0gPSB0aGlzLnByb3BzLmNoYWxsZW5nZVNwZWMsXG4gICAgICAgICAgYWxsZWxlU3RyaW5nID0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLmZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUFsbGVsZVN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlLmdlbmV0aWNzLCB5b3VyRHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksIGRyYWtlQWxsZWxlcyk7XG4gICAgeW91ckRyYWtlU2V4ID0gc2V4TGFiZWxzLmluZGV4T2YoaVNleCk7XG4gICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgYWxsZWxlU3RyaW5nLCB5b3VyRHJha2VTZXgpO1xuICAgIHRoaXMuYWR2YW5jZU1vdmUoKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgeW91ckRyYWtlLCB5b3VyRHJha2VTZXggfSk7XG4gIH1cblxuICBoYW5kbGVBbGxlbGVDaGFuZ2UgPSAoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSkgPT4ge1xuICAgIGxldCB7IHlvdXJEcmFrZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICB5b3VyRHJha2UuZ2VuZXRpY3MuZ2Vub3R5cGUucmVwbGFjZUFsbGVsZUNocm9tTmFtZShjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICB5b3VyRHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvdXJEcmFrZS5nZXRBbGxlbGVTdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2Uuc2V4KTtcbiAgICB0aGlzLmFkdmFuY2VNb3ZlKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHlvdXJEcmFrZSB9KTtcbiAgfVxuXG4gIGhhbmRsZUNoZWNrRHJha2UgPSAoKSA9PiB7XG4gICAgY29uc3QgeyB5b3VyRHJha2UsIHRhcmdldERyYWtlIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgLy8gQ2hlY2tpbmcgdGhlIGFuc3dlciBjb3VudHMgYXMgYSBtb3ZlXG4gICAgdGhpcy5hZHZhbmNlTW92ZSgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93RHJha2VGb3JDb25maXJtYXRpb246IHRydWUgfSk7XG5cbiAgICBpZiAoMCA9PT0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLm51bWJlck9mQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoeW91ckRyYWtlLCB0YXJnZXREcmFrZSkpIHtcbiAgICAgIC8vIGNoZWNrZWQgZHJha2UgaXMgY29ycmVjdFxuICAgICAgdGhpcy5hZHZhbmNlVHJpYWwoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBjaGVja2VkIGRyYWtlIGlzIG5vdCBjb3JyZWN0XG4gICAgICB0aGlzLnNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgICAgICB0aXRsZTogXCJUaGF0J3Mgbm90IHRoZSBkcmFrZSFcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgZG9lc24ndCBtYXRjaCB0aGUgdGFyZ2V0IGRyYWtlLlxcblBsZWFzZSB0cnkgYWdhaW4uXCIsXG4gICAgICAgICAgICB0cnlCdXR0b246IFwiVHJ5IEFnYWluXCIsXG4gICAgICAgICAgICB0cnlDYWxsYmFjazogdGhpcy5jb250aW51ZVRyaWFsXG4gICAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0FsZXJ0KGlTaG93LCBpT3B0aW9ucykge1xuICAgIGNvbnN0IGRpc3BsYXlNb2RlID0gaVNob3cgPyAnYmxvY2snIDogJ25vbmUnLFxuICAgICAgICAgIG9rQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsZXJ0LW9rLWJ1dHRvbicpLFxuICAgICAgICAgIHRyeUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGVydC10cnktYnV0dG9uJyk7XG4gICAgbGV0IHsgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChpU2hvdykge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10aXRsZVwiKS5pbm5lckhUTUwgPSBpT3B0aW9ucy50aXRsZSB8fCBcIlwiO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1tZXNzYWdlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLm1lc3NhZ2UgfHwgXCJcIjtcbiAgICAgIG9rQnV0dG9uLmlubmVySFRNTCA9IGlPcHRpb25zLm9rQnV0dG9uIHx8IFwiXCI7XG4gICAgICBva0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gaU9wdGlvbnMub2tCdXR0b24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgb2tCdXR0b24uZGF0YXNldC5va0NhbGxiYWNrID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCAnJztcbiAgICAgIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyc1tva0J1dHRvbi5pZF0gPSBpT3B0aW9ucy5va0NhbGxiYWNrIHx8IG51bGw7XG4gICAgICB0cnlCdXR0b24uaW5uZXJIVE1MID0gaU9wdGlvbnMudHJ5QnV0dG9uIHx8IFwiXCI7XG4gICAgICB0cnlCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlPcHRpb25zLnRyeUJ1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnNbdHJ5QnV0dG9uLmlkXSA9IGlPcHRpb25zLnRyeUNhbGxiYWNrIHx8IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzW29rQnV0dG9uLmlkXSA9IG51bGw7XG4gICAgICBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnNbdHJ5QnV0dG9uLmlkXSA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnMgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5TW9kZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXdyYXBwZXJcIikuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlNb2RlO1xuICB9XG5cbiAgaGFuZGxlQWxlcnRCdXR0b25DbGljayA9IChldnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXRJRCA9IGV2dC50YXJnZXQuaWQsXG4gICAgICAgICAgeyBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgY2xpZW50Q2xpY2tIYW5kbGVyID0gYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzW3RhcmdldElEXTtcbiAgICB0aGlzLnNob3dBbGVydChmYWxzZSk7XG4gICAgaWYgKGNsaWVudENsaWNrSGFuZGxlcilcbiAgICAgIGNsaWVudENsaWNrSGFuZGxlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGlkZGVuQWxsZWxlcywgaXNEcmFrZUhpZGRlbiwgdHJpYWxDb3VudCB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjLFxuICAgICAgICAgIHsgdGFyZ2V0RHJha2UsIHlvdXJEcmFrZSwgeW91ckRyYWtlU2V4LCBzaG93RHJha2VGb3JDb25maXJtYXRpb24sXG4gICAgICAgICAgICBtb3ZlQ291bnQsIHJlcXVpcmVkTW92ZUNvdW50LCB0cmlhbEluZGV4IH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdjaGFsbGVuZ2VzLXdyYXBwZXInPlxuICAgICAgICA8Q2FzZTFDaGFsbGVuZ2VMZWZ0IHRhcmdldERyYWtlPXt0YXJnZXREcmFrZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlQ291bnQ9e21vdmVDb3VudH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZE1vdmVDb3VudD17cmVxdWlyZWRNb3ZlQ291bnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpYWxJbmRleD17dHJpYWxJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlhbENvdW50PXt0cmlhbENvdW50fS8+XG4gICAgICAgIDxDYXNlMUNoYWxsZW5nZUNlbnRlciBzZXhMYWJlbHM9e3RoaXMucHJvcHMuc2V4TGFiZWxzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvdXJEcmFrZT17eW91ckRyYWtlfSB5b3VyRHJha2VTZXg9e3lvdXJEcmFrZVNleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RyYWtlSGlkZGVuPXtpc0RyYWtlSGlkZGVufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dEcmFrZUZvckNvbmZpcm1hdGlvbj17c2hvd0RyYWtlRm9yQ29uZmlybWF0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V4Q2hhbmdlPXt0aGlzLmhhbmRsZVNleENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsZXJ0QnV0dG9uQ2xpY2s9e3RoaXMuaGFuZGxlQWxlcnRCdXR0b25DbGlja30vPlxuICAgICAgICA8Q2FzZTFDaGFsbGVuZ2VSaWdodCBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvdXJEcmFrZT17eW91ckRyYWtlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXt0aGlzLmhhbmRsZUFsbGVsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoZWNrRHJha2U9e3RoaXMuaGFuZGxlQ2hlY2tEcmFrZX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5DYXNlMUNoYWxsZW5nZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
