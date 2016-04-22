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

var kInitialAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
    kHiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    gChallengeSpecs = [{ label: 'challenge-0', isDrakeHidden: false, trialCount: 1,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }, { label: 'challenge-1', isDrakeHidden: true, trialCount: 1,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }, { label: 'challenge-2', isDrakeHidden: true, trialCount: 3,
  drakeAlleles: kInitialAlleles, hiddenAlleles: kHiddenAlleles }],
    gChallengeCount = gChallengeSpecs.length,
    gLastChallenge = gChallengeCount - 1,
    sexLabels = ['male', 'female'];

/*
 * Currently, navigation between challenges is handled by reloading the page with
 * different URL parameters. In a forthcoming refactoring the playgound and the
 * separate challenges will be managed by the Case1 component, which will render
 * the Case1Playground and Case1Challenge components with appropriate properties
 * as required.
 */
function parseQueryString(queryString) {
  var params = {},
      queries = void 0,
      tmp = void 0,
      i = void 0,
      l = void 0;

  // Split into key/value pairs
  queries = queryString.split('&');

  // Convert the array of strings into an object
  for (i = 0, l = queries.length; i < l; i++) {
    tmp = queries[i].split('=');
    params[tmp[0]] = tmp[1];
  }

  return params;
}

var urlParams = parseQueryString(window.location.search.substring(1)),
    challengeParam = urlParams.challenge && Number(urlParams.challenge),
    gChallenge = challengeParam >= 0 && challengeParam < gChallengeCount ? challengeParam : 0,
    gChallengeSpec = gChallengeSpecs[gChallenge];

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
    var _Object$getPrototypeO;

    var _temp, _this2, _ret;

    _classCallCheck(this, Case1ChallengeCenter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Case1ChallengeCenter)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this2), _this2.handleAlertButtonClick = function (evt) {
      var targetID = evt.target.id;
      var clientClickHandler = alertClientButtonClickHandlers[targetID];
      showAlert(false);
      _this2.setState({ showDrakeForConfirmation: false });
      if (clientClickHandler) clientClickHandler();
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(Case1ChallengeCenter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.getElementById("alert-ok-button").onclick = this.handleAlertButtonClick;
      document.getElementById("alert-try-button").onclick = this.handleAlertButtonClick;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
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
  yourDrake: React.PropTypes.object.isRequired,
  yourDrakeSex: React.PropTypes.number.isRequired,
  isDrakeHidden: React.PropTypes.bool.isRequired,
  showDrakeForConfirmation: React.PropTypes.bool.isRequired,
  onSexChange: React.PropTypes.func.isRequired
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

    _this4.advanceTrial = function () {
      var trialCount = _this4.props.challengeSpec.trialCount;
      var trialIndex = _this4.state.trialIndex;

      if (gChallenge >= gLastChallenge) {
        if (trialIndex >= trialCount) {
          showAlert(true, {
            title: "Congratulations!",
            message: "You've completed all the trials in this challenge.",
            okButton: "Go back to the Case Log",
            okCallback: _this4.advanceChallenge,
            tryButton: "Try Again",
            tryCallback: _this4.resetChallenge
          });
          return;
        }
        _this4.setState({ trialIndex: ++_this4.state.trialIndex });
      }
      _this4.resetDrakes();
    };

    _this4.advanceChallenge = function () {
      var url = window.location.href,
          nextUrl = void 0;
      if (gChallenge < gLastChallenge) {
        // advance to next challenge
        nextUrl = url.replace('challenge=' + gChallenge, 'challenge=' + (gChallenge + 1));
      } else {
        // back to case log
        var case1Index = url.indexOf('case-1');
        nextUrl = url.substr(0, case1Index);
      }
      window.location.assign(nextUrl);
    };

    _this4.handleSexChange = function (iSex) {
      var _this4$state = _this4.state;
      var yourDrake = _this4$state.yourDrake;
      var yourDrakeSex = _this4$state.yourDrakeSex;
      // replace alleles lost when switching to male and back

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
        if (gChallenge < gLastChallenge) {
          showAlert(true, {
            title: "Good work!",
            message: "The drake you have created matches the target drake.",
            okButton: "Next Challenge",
            okCallback: _this4.advanceChallenge,
            tryButton: "Try Again",
            tryCallback: _this4.resetChallenge
          });
        } else {
          showAlert(true, {
            title: "Good work!",
            message: "The drake you have created matches the target drake.",
            okButton: "OK",
            okCallback: _this4.advanceTrial
          });
        }
      } else {
        showAlert(true, {
          title: "That's not the drake!",
          message: "The drake you have created doesn't match the target drake.\nPlease try again.",
          tryButton: "Try Again"
        });
        render();
      }
    };

    _this4.state = {
      moveCount: 0,
      requiredMoveCount: 0,
      trialIndex: 1,
      showDrakeForConfirmation: false
    };
    return _this4;
  }

  _createClass(Case1Challenge, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.resetDrakes();
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
        React.createElement(Case1ChallengeCenter, { yourDrake: yourDrake, yourDrakeSex: yourDrakeSex,
          isDrakeHidden: isDrakeHidden,
          showDrakeForConfirmation: showDrakeForConfirmation,
          onSexChange: this.handleSexChange }),
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
  challengeSpec: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    isDrakeHidden: React.PropTypes.bool.isRequired,
    trialCount: React.PropTypes.number.isRequired,
    drakeAlleles: React.PropTypes.string.isRequired,
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string)
  })
};


function render() {

  ReactDOM.render(React.createElement(Case1Challenge, {
    challengeSpec: gChallengeSpec
  }), document.getElementById('wrapper'));
}

var alertClientButtonClickHandlers = {};
function showAlert(iShow, iOptions) {
  var displayMode = iShow ? 'block' : 'none',
      okButton = document.getElementById("alert-ok-button"),
      tryButton = document.getElementById("alert-try-button");
  if (iShow) {
    document.getElementById("alert-title").innerHTML = iOptions.title || "";
    document.getElementById("alert-message").innerHTML = iOptions.message || "";
    okButton.innerHTML = iOptions.okButton || "";
    okButton.style.display = iOptions.okButton ? 'block' : 'none';
    okButton.dataset.okCallback = iOptions.okCallback || '';
    alertClientButtonClickHandlers[okButton.id] = iOptions.okCallback || null;
    tryButton.innerHTML = iOptions.tryButton || "";
    tryButton.style.display = iOptions.tryButton ? 'block' : 'none';
    alertClientButtonClickHandlers[tryButton.id] = iOptions.tryCallback || null;
  } else {
    alertClientButtonClickHandlers[okButton.id] = null;
    alertClientButtonClickHandlers[tryButton.id] = null;
  }
  document.getElementById("overlay").style.display = displayMode;
  document.getElementById("alert-wrapper").style.display = displayMode;
}

render();
//# sourceMappingURL=data:application/json;base64,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cUIsT0FBckIsR0FBK0IsTUFBL0IsQ0FSakI7QUFTVCxtQ0FBK0IsVUFBVSxFQUFWLENBQS9CLEdBQStDLFNBQVMsV0FBVCxJQUF3QixJQUF4QixDQVR0QztHQUFYLE1BV0s7QUFDSCxtQ0FBK0IsU0FBUyxFQUFULENBQS9CLEdBQThDLElBQTlDLENBREc7QUFFSCxtQ0FBK0IsVUFBVSxFQUFWLENBQS9CLEdBQStDLElBQS9DLENBRkc7R0FYTDtBQWVBLFdBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQyxLQUFuQyxDQUF5QyxPQUF6QyxHQUFtRCxXQUFuRCxDQW5Ca0M7QUFvQmxDLFdBQVMsY0FBVCxDQUF3QixlQUF4QixFQUF5QyxLQUF6QyxDQUErQyxPQUEvQyxHQUF5RCxXQUF6RCxDQXBCa0M7Q0FBcEM7O0FBdUJBIiwiZmlsZSI6ImNhc2UtMS9jaGFsbGVuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDYXNlIDEgQ2hhbGxlbmdlc1xuICpcbiAqIFRoZSBjb2RlIGluIHRoaXMgbW9kdWxlIHdhcyB3cml0dGVuIHRvIHN1cHBvcnQgYSByZWNyZWF0aW9uIG9mIHRoZSBjaGFsbGVuZ2VzXG4gKiBmcm9tIENhc2UgMSBpbiBHZW5pdmVyc2UuIFRoZSBjaGFsbGVuZ2VzIGFyZTpcbiAqICBDaGFsbGVuZ2UgMDogTWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiBhIHZpc2libGUgdGVzdCBkcmFrZSB0byB0aGF0IG9mIGEgdGFyZ2V0IGRyYWtlXG4gKiAgICAgICAgICAgICAgIChUaGlzIGNoYWxsZW5nZSBpcyBub3QgaW4gR2VuaXZlcnNlIGJ1dCBpdCB3YXMgZGVlbWVkIGEgdXNlZnVsIGFkZGl0aW9uLilcbiAqICBDaGFsbGVuZ2UgMTogTWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiBhIGhpZGRlbiB0ZXN0IGRyYWtlIHRvIHRoYXQgb2YgYSB0YXJnZXQgZHJha2VcbiAqICBDaGFsbGVuZ2UgMjogTWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiB0aHJlZSBoaWRkZW4gdGVzdCBkcmFrZXMgdG8gdGFyZ2V0IGRyYWtlc1xuICovXG4vKiBnbG9iYWwgRHJha2VHZW5vbWVDb2x1bW4gKi9cbi8vaW1wb3J0IERyYWtlR2Vub21lQ29sdW1uIGZyb20gJy4uL2pzL3BhcmVudC1nZW5vbWUtY29sdW1uJztcblxuY29uc3Qga0luaXRpYWxBbGxlbGVzID0gXCJhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYjpCLGE6RCxiOkQsYTpULGI6dCxhOnJoLGI6cmgsYTpCb2csYjpCb2dcIixcbiAgICAgIGtIaWRkZW5BbGxlbGVzID0gWyd0JywndGsnLCdoJywnYycsJ2EnLCdiJywnZCcsJ2JvZycsJ3JoJ10sXG4gICAgICBnQ2hhbGxlbmdlU3BlY3MgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdjaGFsbGVuZ2UtMCcsIGlzRHJha2VIaWRkZW46IGZhbHNlLCB0cmlhbENvdW50OiAxLFxuICAgICAgICAgIGRyYWtlQWxsZWxlczoga0luaXRpYWxBbGxlbGVzLCBoaWRkZW5BbGxlbGVzOiBrSGlkZGVuQWxsZWxlcyB9LFxuICAgICAgICB7IGxhYmVsOiAnY2hhbGxlbmdlLTEnLCBpc0RyYWtlSGlkZGVuOiB0cnVlLCB0cmlhbENvdW50OiAxLFxuICAgICAgICAgIGRyYWtlQWxsZWxlczoga0luaXRpYWxBbGxlbGVzLCBoaWRkZW5BbGxlbGVzOiBrSGlkZGVuQWxsZWxlcyB9LFxuICAgICAgICB7IGxhYmVsOiAnY2hhbGxlbmdlLTInLCBpc0RyYWtlSGlkZGVuOiB0cnVlLCB0cmlhbENvdW50OiAzLFxuICAgICAgICAgIGRyYWtlQWxsZWxlczoga0luaXRpYWxBbGxlbGVzLCBoaWRkZW5BbGxlbGVzOiBrSGlkZGVuQWxsZWxlcyB9XG4gICAgICBdLFxuICAgICAgZ0NoYWxsZW5nZUNvdW50ID0gZ0NoYWxsZW5nZVNwZWNzLmxlbmd0aCxcbiAgICAgIGdMYXN0Q2hhbGxlbmdlID0gZ0NoYWxsZW5nZUNvdW50IC0gMSxcbiAgICAgIHNleExhYmVscyA9IFsnbWFsZScsICdmZW1hbGUnXTtcblxuLypcbiAqIEN1cnJlbnRseSwgbmF2aWdhdGlvbiBiZXR3ZWVuIGNoYWxsZW5nZXMgaXMgaGFuZGxlZCBieSByZWxvYWRpbmcgdGhlIHBhZ2Ugd2l0aFxuICogZGlmZmVyZW50IFVSTCBwYXJhbWV0ZXJzLiBJbiBhIGZvcnRoY29taW5nIHJlZmFjdG9yaW5nIHRoZSBwbGF5Z291bmQgYW5kIHRoZVxuICogc2VwYXJhdGUgY2hhbGxlbmdlcyB3aWxsIGJlIG1hbmFnZWQgYnkgdGhlIENhc2UxIGNvbXBvbmVudCwgd2hpY2ggd2lsbCByZW5kZXJcbiAqIHRoZSBDYXNlMVBsYXlncm91bmQgYW5kIENhc2UxQ2hhbGxlbmdlIGNvbXBvbmVudHMgd2l0aCBhcHByb3ByaWF0ZSBwcm9wZXJ0aWVzXG4gKiBhcyByZXF1aXJlZC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZykge1xuICAgIGxldCBwYXJhbXMgPSB7fSwgcXVlcmllcywgdG1wLCBpLCBsO1xuXG4gICAgLy8gU3BsaXQgaW50byBrZXkvdmFsdWUgcGFpcnNcbiAgICBxdWVyaWVzID0gcXVlcnlTdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IG9mIHN0cmluZ3MgaW50byBhbiBvYmplY3RcbiAgICBmb3IgKCBpID0gMCwgbCA9IHF1ZXJpZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICB0bXAgPSBxdWVyaWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIHBhcmFtc1t0bXBbMF1dID0gdG1wWzFdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG59XG5cbmxldCB1cmxQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKCh3aW5kb3cubG9jYXRpb24uc2VhcmNoKS5zdWJzdHJpbmcoMSkpLFxuICAgIGNoYWxsZW5nZVBhcmFtID0gdXJsUGFyYW1zLmNoYWxsZW5nZSAmJiBOdW1iZXIodXJsUGFyYW1zLmNoYWxsZW5nZSksXG4gICAgZ0NoYWxsZW5nZSA9IChjaGFsbGVuZ2VQYXJhbSA+PSAwKSAmJiAoY2hhbGxlbmdlUGFyYW0gPCBnQ2hhbGxlbmdlQ291bnQpID8gY2hhbGxlbmdlUGFyYW0gOiAwLFxuICAgIGdDaGFsbGVuZ2VTcGVjID0gZ0NoYWxsZW5nZVNwZWNzW2dDaGFsbGVuZ2VdO1xuXG4vKlxuICogTGVmdCBjb2x1bW4gY29udGFpbnMgdGFyZ2V0IGRyYWtlIGFuZCB0cmlhbC9nb2FsIGZlZWRiYWNrIHZpZXdzXG4gKi9cbmNsYXNzIENhc2UxQ2hhbGxlbmdlTGVmdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0YXJnZXREcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG1vdmVDb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJlcXVpcmVkTW92ZUNvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgdHJpYWxJbmRleDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHRyaWFsQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdGFyZ2V0RHJha2UsIG1vdmVDb3VudCwgcmVxdWlyZWRNb3ZlQ291bnQsIHRyaWFsSW5kZXgsIHRyaWFsQ291bnQgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2xlZnQtY29sdW1uJyBjbGFzc05hbWU9J2NvbHVtbic+XG4gICAgICAgIDxkaXYgaWQ9J3RhcmdldC1kcmFrZS1sYWJlbCcgY2xhc3NOYW1lPSdjb2x1bW4tbGFiZWwnPlRhcmdldCBEcmFrZTwvZGl2PlxuXG4gICAgICAgIDxHZW5pQmxvY2tzLk9yZ2FuaXNtR2xvd1ZpZXcgaWQ9J3RhcmdldC1kcmFrZScgY2xhc3NOYW1lPSdkcmFrZS1pbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZz17dGFyZ2V0RHJha2V9IGNvbG9yPScjRkZGRkFBJyBzaXplPXsyMDB9Lz5cblxuICAgICAgICA8R2VuaUJsb2Nrcy5GZWVkYmFja1ZpZXcgaWQ9J3RyaWFsLWZlZWRiYWNrJyBjbGFzc05hbWU9J2ZlZWRiYWNrLXZpZXcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e1tcIlRSSUFMXCIsIGAke3RyaWFsSW5kZXh9IG9mICR7dHJpYWxDb3VudH1gXX0vPlxuXG4gICAgICAgIDxHZW5pQmxvY2tzLkZlZWRiYWNrVmlldyBpZD0nZ29hbC1mZWVkYmFjaycgY2xhc3NOYW1lPSdmZWVkYmFjay12aWV3J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtbYEdPQUwgaXMgJHtyZXF1aXJlZE1vdmVDb3VudH0gTU9WRVNgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBZb3VyIG1vdmVzOiAke21vdmVDb3VudH1gXX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vKlxuICogQ2VudGVyIGNvbHVtbiBjb250YWlucyB5b3VyIGRyYWtlLCBzZXggY2hhbmdlIGJ1dHRvbnMsIGFuZCBjdXJyZW50bHlcbiAqIGNvbnRhaW5zIHRoZSB1c2VyIGFsZXJ0IGVsZW1lbnRzLCBhbHRob3VnaCB0aGF0J3MgbGlrZWx5IHRvIGNoYW5nZS5cbiAqL1xuY2xhc3MgQ2FzZTFDaGFsbGVuZ2VDZW50ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgeW91ckRyYWtlOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgeW91ckRyYWtlU2V4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgaXNEcmFrZUhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBzaG93RHJha2VGb3JDb25maXJtYXRpb246IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgb25TZXhDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtb2stYnV0dG9uXCIpLm9uY2xpY2sgPSB0aGlzLmhhbmRsZUFsZXJ0QnV0dG9uQ2xpY2s7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpLm9uY2xpY2sgPSB0aGlzLmhhbmRsZUFsZXJ0QnV0dG9uQ2xpY2s7ICAgIFxuICB9XG5cbiAgaGFuZGxlQWxlcnRCdXR0b25DbGljayA9IChldnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXRJRCA9IGV2dC50YXJnZXQuaWQ7XG4gICAgY29uc3QgY2xpZW50Q2xpY2tIYW5kbGVyID0gYWxlcnRDbGllbnRCdXR0b25DbGlja0hhbmRsZXJzW3RhcmdldElEXTtcbiAgICBzaG93QWxlcnQoZmFsc2UpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93RHJha2VGb3JDb25maXJtYXRpb246IGZhbHNlIH0pO1xuICAgIGlmIChjbGllbnRDbGlja0hhbmRsZXIpXG4gICAgICBjbGllbnRDbGlja0hhbmRsZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHlvdXJEcmFrZSwgeW91ckRyYWtlU2V4LCBpc0RyYWtlSGlkZGVuLCBzaG93RHJha2VGb3JDb25maXJtYXRpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2NlbnRlci1jb2x1bW4nIGNsYXNzTmFtZT0nY29sdW1uJz5cbiAgICAgICAgPGRpdiBpZD1cInlvdXItZHJha2UtbGFiZWxcIiBjbGFzc05hbWU9XCJjb2x1bW4tbGFiZWxcIj5Zb3VyIERyYWtlPC9kaXY+XG5cbiAgICAgICAgPEdlbmlCbG9ja3MuUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3XG4gICAgICAgICAgICBpZD0neW91ci1kcmFrZScgY2xhc3NOYW1lPSdkcmFrZS1pbWFnZSdcbiAgICAgICAgICAgIG9yZz17eW91ckRyYWtlfSBjb2xvcj0nI0ZGRkZBQScgc2l6ZT17MjAwfVxuICAgICAgICAgICAgaGlkZGVuPXtpc0RyYWtlSGlkZGVuICYmICFzaG93RHJha2VGb3JDb25maXJtYXRpb259Lz5cblxuICAgICAgICA8ZGl2IGlkPVwiY2hhbmdlLXNleC1idXR0b25zXCIgY2xhc3NOYW1lPVwibm8tbGFiZWxcIj48L2Rpdj5cbiAgICAgICAgPEdlbmlCbG9ja3MuQ2hhbmdlU2V4QnV0dG9uc1xuICAgICAgICAgICAgaWQ9J2NoYW5nZS1zZXgtYnV0dG9ucycgY2xhc3NOYW1lPSduby1sYWJlbCdcbiAgICAgICAgICAgIHNleD17c2V4TGFiZWxzW3lvdXJEcmFrZVNleF19XG4gICAgICAgICAgICBzcGVjaWVzPVwiRHJha2VcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25TZXhDaGFuZ2V9Lz5cblxuICAgICAgICA8ZGl2IGlkPVwiYWxlcnQtd3JhcHBlclwiPlxuICAgICAgICAgIDxoMyBpZD1cImFsZXJ0LXRpdGxlXCI+PC9oMz5cbiAgICAgICAgICA8ZGl2IGlkPVwiYWxlcnQtbWVzc2FnZVwiPjwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJhbGVydC10cnktYnV0dG9uXCI+VHJ5IEFnYWluPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImFsZXJ0LW9rLWJ1dHRvblwiPk9LPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cbi8qXG4gKiBSaWdodCBjb2x1bW4gY29udGFpbnMgdGhlIGRyYWtlIGdlbm9tZSBhbmQgdGhlIFwiQ2hlY2sgRHJha2VcIiBidXR0b25cbiAqL1xuY2xhc3MgQ2FzZTFDaGFsbGVuZ2VSaWdodCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKS5pc1JlcXVpcmVkLFxuICAgIHlvdXJEcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uQWxsZWxlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uQ2hlY2tEcmFrZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGlkZGVuQWxsZWxlcywgeW91ckRyYWtlIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8RHJha2VHZW5vbWVDb2x1bW4gaWQ9J3JpZ2h0LWNvbHVtbicgaWRQcmVmaXg9J3lvdXInIGNvbHVtbkxhYmVsPVwiQ2hyb21vc29tZSBDb250cm9sXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWtlPXt5b3VyRHJha2V9IHNob3dEcmFrZT17ZmFsc2V9IGVkaXRhYmxlPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e21hcmdpblRvcDogNTAsIHRvcDogNTB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5wcm9wcy5vbkFsbGVsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uSUQ9J3Rlc3QtZHJha2UtYnV0dG9uJyBidXR0b25MYWJlbD1cIkNoZWNrIERyYWtlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25CdXR0b25DbGljaz17dGhpcy5wcm9wcy5vbkNoZWNrRHJha2V9Lz5cbiAgICApO1xuICB9XG59XG5cbi8qXG4gKiBUaGUgQ2FzZTFDaGFsbGVuZ2UgY29tcG9uZW50IGNvb3JkaW5hdGVzIHRoZSBlZmZvcnRzIG9mIHRoZSBDYXNlMUNoYWxsZW5nZUxlZnQsXG4gKiBDYXNlMUNoYWxsZW5nZUNlbnRlciwgYW5kIENhc2UxQ2hhbGxlbmdlUmlnaHQgY29tcG9uZW50cyBhbmQgbWFuYWdlcyB0aGVcbiAqIHRoZSBjaGFsbGVuZ2Ugc3RhdGUuIEl0LCBpbiB0dXJuLCB3aWxsIGV2ZW50dWFsbHkgYmUgbWFuYWdlZCAoYWxvbmcgd2l0aCB0aGVcbiAqIENhc2UxUGxheWdyb3VuZCBjb21wb25lbnQpIGJ5IHRoZSBDYXNlMSBjb21wb25lbnQuXG4gKi9cbmNsYXNzIENhc2UxQ2hhbGxlbmdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoYWxsZW5nZVNwZWM6IFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaXNEcmFrZUhpZGRlbjogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIHRyaWFsQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGRyYWtlQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgaGlkZGVuQWxsZWxlczogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLnN0cmluZylcbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92ZUNvdW50OiAwLFxuICAgICAgcmVxdWlyZWRNb3ZlQ291bnQ6IDAsXG4gICAgICB0cmlhbEluZGV4OiAxLFxuICAgICAgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5yZXNldERyYWtlcygpO1xuICB9XG5cbiAgcmVzZXREcmFrZXMoKSB7XG4gICAgY29uc3QgeyBkcmFrZUFsbGVsZXMgfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlYztcbiAgICBsZXQgcmVxdWlyZWRNb3ZlQ291bnQgPSAwLFxuICAgICAgICB0YXJnZXREcmFrZVNleCwgdGFyZ2V0RHJha2UsXG4gICAgICAgIHlvdXJEcmFrZVNleCwgeW91ckRyYWtlO1xuICAgIC8vIHJlZ2VuZXJhdGUgaWYgd2UgZ2VuZXJhdGUgZHJha2VzIHRoYXQgYXJlIHRvbyBjbG9zZSB0byBlYWNoIG90aGVyXG4gICAgd2hpbGUgKHJlcXVpcmVkTW92ZUNvdW50IDwgMykge1xuICAgICAgdGFyZ2V0RHJha2VTZXggPSBNYXRoLmZsb29yKDIgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgIHRhcmdldERyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJha2VBbGxlbGVzLCB0YXJnZXREcmFrZVNleCk7XG4gICAgICB5b3VyRHJha2VTZXggPSBNYXRoLmZsb29yKDIgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgIHlvdXJEcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmFrZUFsbGVsZXMsIHlvdXJEcmFrZVNleCk7XG4gICAgICAvLyBhZGQgb25lIGZvciBjbGlja2luZyB0aGUgXCJDaGVjayBEcmFrZVwiIGJ1dHRvblxuICAgICAgcmVxdWlyZWRNb3ZlQ291bnQgPSBHZW5pQmxvY2tzLkdlbmV0aWNzVXRpbHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh5b3VyRHJha2UsIHRhcmdldERyYWtlKSArIDE7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyB0YXJnZXREcmFrZVNleCwgdGFyZ2V0RHJha2UsXG4gICAgICAgICAgICAgICAgICAgIHlvdXJEcmFrZVNleCwgeW91ckRyYWtlLFxuICAgICAgICAgICAgICAgICAgICBtb3ZlQ291bnQ6IDAsIHJlcXVpcmVkTW92ZUNvdW50LFxuICAgICAgICAgICAgICAgICAgICBzaG93RHJha2VGb3JDb25maXJtYXRpb246IGZhbHNlIH0pO1xuICB9XG5cbiAgcmVzZXRDaGFsbGVuZ2UgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRyaWFsSW5kZXg6IDEgfSk7XG4gICAgdGhpcy5yZXNldERyYWtlcygpO1xuICB9XG5cbiAgYWR2YW5jZU1vdmUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1vdmVDb3VudDogKyt0aGlzLnN0YXRlLm1vdmVDb3VudCB9KTtcbiAgfVxuXG4gIGFkdmFuY2VUcmlhbCA9ICgpID0+IHtcbiAgICBjb25zdCB7IHRyaWFsQ291bnQgfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlU3BlYyxcbiAgICAgICAgICB7IHRyaWFsSW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKGdDaGFsbGVuZ2UgPj0gZ0xhc3RDaGFsbGVuZ2UpIHtcbiAgICAgIGlmICh0cmlhbEluZGV4ID49IHRyaWFsQ291bnQpIHtcbiAgICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ29uZ3JhdHVsYXRpb25zIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdSd2ZSBjb21wbGV0ZWQgYWxsIHRoZSB0cmlhbHMgaW4gdGhpcyBjaGFsbGVuZ2UuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uOiBcIkdvIGJhY2sgdG8gdGhlIENhc2UgTG9nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9rQ2FsbGJhY2s6IHRoaXMuYWR2YW5jZUNoYWxsZW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0cnlDYWxsYmFjazogdGhpcy5yZXNldENoYWxsZW5nZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0cmlhbEluZGV4OiArK3RoaXMuc3RhdGUudHJpYWxJbmRleCB9KTtcbiAgICB9XG4gICAgdGhpcy5yZXNldERyYWtlcygpO1xuICB9XG5cbiAgYWR2YW5jZUNoYWxsZW5nZSA9ICgpID0+IHtcbiAgICBsZXQgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgIG5leHRVcmw7XG4gICAgaWYgKGdDaGFsbGVuZ2UgPCBnTGFzdENoYWxsZW5nZSkge1xuICAgICAgLy8gYWR2YW5jZSB0byBuZXh0IGNoYWxsZW5nZVxuICAgICAgbmV4dFVybCA9IHVybC5yZXBsYWNlKGBjaGFsbGVuZ2U9JHtnQ2hhbGxlbmdlfWAsIGBjaGFsbGVuZ2U9JHtnQ2hhbGxlbmdlKzF9YCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gYmFjayB0byBjYXNlIGxvZ1xuICAgICAgY29uc3QgY2FzZTFJbmRleCA9IHVybC5pbmRleE9mKCdjYXNlLTEnKTtcbiAgICAgIG5leHRVcmwgPSB1cmwuc3Vic3RyKDAsIGNhc2UxSW5kZXgpO1xuICAgIH1cbiAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKG5leHRVcmwpO1xuICB9XG5cbiAgaGFuZGxlU2V4Q2hhbmdlID0gKGlTZXgpID0+IHtcbiAgICBsZXQgeyB5b3VyRHJha2UsIHlvdXJEcmFrZVNleCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBhbGxlbGVzIGxvc3Qgd2hlbiBzd2l0Y2hpbmcgdG8gbWFsZSBhbmQgYmFja1xuICAgIGNvbnN0IHsgZHJha2VBbGxlbGVzIH0gPSB0aGlzLnByb3BzLmNoYWxsZW5nZVNwZWMsXG4gICAgICAgICAgYWxsZWxlU3RyaW5nID0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLmZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUFsbGVsZVN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlLmdlbmV0aWNzLCB5b3VyRHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksIGRyYWtlQWxsZWxlcyk7XG4gICAgeW91ckRyYWtlU2V4ID0gc2V4TGFiZWxzLmluZGV4T2YoaVNleCk7XG4gICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxlbGVTdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlU2V4KTtcbiAgICB0aGlzLmFkdmFuY2VNb3ZlKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHlvdXJEcmFrZSwgeW91ckRyYWtlU2V4IH0pO1xuICB9XG5cbiAgaGFuZGxlQWxsZWxlQ2hhbmdlID0gKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpID0+IHtcbiAgICBsZXQgeyB5b3VyRHJha2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgeW91ckRyYWtlLmdlbmV0aWNzLmdlbm90eXBlLnJlcGxhY2VBbGxlbGVDaHJvbU5hbWUoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgeW91ckRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91ckRyYWtlLnNleCk7XG4gICAgdGhpcy5hZHZhbmNlTW92ZSgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyB5b3VyRHJha2UgfSk7XG4gIH1cblxuICBoYW5kbGVDaGVja0RyYWtlID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgeW91ckRyYWtlLCB0YXJnZXREcmFrZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIC8vIENoZWNraW5nIHRoZSBhbnN3ZXIgY291bnRzIGFzIGEgbW92ZVxuICAgIHRoaXMuYWR2YW5jZU1vdmUoKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0RyYWtlRm9yQ29uZmlybWF0aW9uOiB0cnVlIH0pO1xuXG4gICAgaWYgKDAgPT09IEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5udW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHlvdXJEcmFrZSwgdGFyZ2V0RHJha2UpKSB7XG4gICAgICBpZiAoZ0NoYWxsZW5nZSA8IGdMYXN0Q2hhbGxlbmdlKSB7XG4gICAgICAgIHNob3dBbGVydCh0cnVlLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJHb29kIHdvcmshXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0J1dHRvbjogXCJOZXh0IENoYWxsZW5nZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0NhbGxiYWNrOiB0aGlzLmFkdmFuY2VDaGFsbGVuZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5Q2FsbGJhY2s6IHRoaXMucmVzZXRDaGFsbGVuZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNob3dBbGVydCh0cnVlLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJHb29kIHdvcmshXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0J1dHRvbjogXCJPS1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBva0NhbGxiYWNrOiB0aGlzLmFkdmFuY2VUcmlhbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRoYXQncyBub3QgdGhlIGRyYWtlIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBkb2Vzbid0IG1hdGNoIHRoZSB0YXJnZXQgZHJha2UuXFxuUGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIlxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaGlkZGVuQWxsZWxlcywgaXNEcmFrZUhpZGRlbiwgdHJpYWxDb3VudCB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjLFxuICAgICAgICAgIHsgdGFyZ2V0RHJha2UsIHlvdXJEcmFrZSwgeW91ckRyYWtlU2V4LCBzaG93RHJha2VGb3JDb25maXJtYXRpb24sXG4gICAgICAgICAgICBtb3ZlQ291bnQsIHJlcXVpcmVkTW92ZUNvdW50LCB0cmlhbEluZGV4IH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdjaGFsbGVuZ2VzLXdyYXBwZXInPlxuICAgICAgICA8Q2FzZTFDaGFsbGVuZ2VMZWZ0IHRhcmdldERyYWtlPXt0YXJnZXREcmFrZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlQ291bnQ9e21vdmVDb3VudH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZE1vdmVDb3VudD17cmVxdWlyZWRNb3ZlQ291bnR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpYWxJbmRleD17dHJpYWxJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlhbENvdW50PXt0cmlhbENvdW50fS8+XG4gICAgICAgIDxDYXNlMUNoYWxsZW5nZUNlbnRlciB5b3VyRHJha2U9e3lvdXJEcmFrZX0geW91ckRyYWtlU2V4PXt5b3VyRHJha2VTZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFrZUhpZGRlbj17aXNEcmFrZUhpZGRlbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93RHJha2VGb3JDb25maXJtYXRpb249e3Nob3dEcmFrZUZvckNvbmZpcm1hdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNleENoYW5nZT17dGhpcy5oYW5kbGVTZXhDaGFuZ2V9Lz5cbiAgICAgICAgPENhc2UxQ2hhbGxlbmdlUmlnaHQgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b3VyRHJha2U9e3lvdXJEcmFrZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17dGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGVja0RyYWtlPXt0aGlzLmhhbmRsZUNoZWNrRHJha2V9Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENhc2UxQ2hhbGxlbmdlLCB7XG4gICAgICBjaGFsbGVuZ2VTcGVjOiBnQ2hhbGxlbmdlU3BlY1xuICAgIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJylcbiAgKTtcbn1cblxubGV0IGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVycyA9IHt9O1xuZnVuY3Rpb24gc2hvd0FsZXJ0KGlTaG93LCBpT3B0aW9ucykge1xuICBjb25zdCBkaXNwbGF5TW9kZSA9IGlTaG93ID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgb2tCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW9rLWJ1dHRvblwiKSxcbiAgICAgICAgdHJ5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpO1xuICBpZiAoaVNob3cpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXRpdGxlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLnRpdGxlIHx8IFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1tZXNzYWdlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLm1lc3NhZ2UgfHwgXCJcIjtcbiAgICBva0J1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy5va0J1dHRvbiB8fCBcIlwiO1xuICAgIG9rQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy5va0J1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgb2tCdXR0b24uZGF0YXNldC5va0NhbGxiYWNrID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCAnJztcbiAgICBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbb2tCdXR0b24uaWRdID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCBudWxsO1xuICAgIHRyeUJ1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy50cnlCdXR0b24gfHwgXCJcIjtcbiAgICB0cnlCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlPcHRpb25zLnRyeUJ1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgYWxlcnRDbGllbnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBpT3B0aW9ucy50cnlDYWxsYmFjayB8fCBudWxsO1xuICB9XG4gIGVsc2Uge1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1tva0J1dHRvbi5pZF0gPSBudWxsO1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1t0cnlCdXR0b24uaWRdID0gbnVsbDtcbiAgfVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlNb2RlO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXdyYXBwZXJcIikuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlNb2RlO1xufVxuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
