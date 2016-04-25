'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Case 3 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 3 in Geniverse. The challenges are:
 *  Challenge 1: Modify mother drake so as to breed a particular target drake
 *  Challenge 2: Modify father drake so as to breed a pair of target drakes
 */
/* global DrakeGenomeColumn */
//import DrakeGenomeColumn from '../js/parent-genome-column';

var _BioLogica = BioLogica;
var MALE = _BioLogica.MALE;
var FEMALE = _BioLogica.FEMALE;
var minChallenge = 1;
var maxChallenge = 2;
var challengeSpecs = {
  '1': { // Challenge 1: female is editable, male is fixed, one target drake
    targetDrakeCount: 1,
    fixedParentSex: MALE,
    editableParentSex: FEMALE
  },
  '2': { // Challenge 2: male is editable, female is fixed, two target drakes
    targetDrakeCount: 2,
    fixedParentSex: FEMALE,
    editableParentSex: MALE
  }
};
var organismAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog";
var hiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'];
var changeableAlleles = ['m', 'w', 'fl', 'hl'];
var glowColor = '#FFFFAA';
var dropGlowColor = '#FFFF00';
var matchedColor = '#88FF88';
var targetDrakeSize = 150;
var clutchSize = 20;

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

// URL param is used to choose challenge
var urlParams = parseQueryString(window.location.search.substring(1)),
    challengeParam = urlParams.challenge && Number(urlParams.challenge),
    challenge = challengeParam >= minChallenge && challengeParam <= maxChallenge ? challengeParam : 1;

/* global ReactDnD, ReactDnDHTML5Backend */
var DragDropContext = ReactDnD.DragDropContext,
    DragDropBackend = ReactDnDHTML5Backend;

/**
 * DragOrganismGlowView - ReactDnD.DragSource for dragging organism from breeding pen.
 */
var _DragOrganismGlowView = function _DragOrganismGlowView(_ref) {
  var connectDragSource = _ref.connectDragSource;

  var others = _objectWithoutProperties(_ref, ['connectDragSource']);

  return connectDragSource(React.createElement(
    'div',
    null,
    React.createElement(GeniBlocks.GlowBackgroundView, _extends({ ChildComponent: GeniBlocks.OrganismView }, others))
  ));
};

_DragOrganismGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

var DragOrganismGlowView = ReactDnD.DragSource('organism', { // drag source specification
  beginDrag: function beginDrag(props) {
    var org = props.org;
    var id = props.id;
    var index = props.index;

    return { org: org, id: id, index: index };
  }
},
// collecting function
function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    wrapper: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
})(_DragOrganismGlowView);

/**
 * DropOrganismGlowView - ReactDnD.DropTarget for accepting drops on target drakes.
 */
var _DropOrganismGlowView = function _DropOrganismGlowView(_ref2) {
  var color = _ref2.color;
  var dropColor = _ref2.dropColor;
  var connectDropTarget = _ref2.connectDropTarget;
  var isOver = _ref2.isOver;
  var canDrop = _ref2.canDrop;

  var others = _objectWithoutProperties(_ref2, ['color', 'dropColor', 'connectDropTarget', 'isOver', 'canDrop']);

  var glowColor = isOver && canDrop ? dropColor : color;
  return connectDropTarget(React.createElement(
    'div',
    null,
    React.createElement(GeniBlocks.GlowBackgroundView, _extends({ color: glowColor, ChildComponent: GeniBlocks.OrganismView }, others))
  ));
};

_DropOrganismGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  dropColor: React.PropTypes.string.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,
  onDrop: React.PropTypes.func.isRequired
};

var DropOrganismGlowView = ReactDnD.DropTarget('organism', { // drop target specification
  canDrop: function canDrop(props) {
    return !props.isMatched;
  },
  drop: function drop(props, monitor) {
    var org = props.org;
    var id = props.id;
    var dropTarget = { org: org, id: id };
    if (props.onDrop) props.onDrop(monitor.getItem(), dropTarget);
  }
},
// collecting function
function (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
})(_DropOrganismGlowView);

/**
 * Center panel has target drakes, breedng pen, breed button, etc.
 */

var _Case3Center = function (_React$Component) {
  _inherits(_Case3Center, _React$Component);

  function _Case3Center() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, _Case3Center);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(_Case3Center)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
      selectedIndex: null
    }, _this.handleSelectionChange = function (iSelectedIndex) {
      _this.setState({ selectedIndex: iSelectedIndex });
    }, _this.handleBreed = function () {
      _this.setState({ selectedIndex: null });
      if (_this.props.onBreed) _this.props.onBreed();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_Case3Center, [{
    key: 'renderTargetDrake',
    value: function renderTargetDrake(index) {
      var _props = this.props;
      var targetDrakes = _props.targetDrakes;
      var targetsMatched = _props.targetsMatched;
      var targetDrakeSize = _props.targetDrakeSize;
      var glowColor = _props.glowColor;
      var matchedColor = _props.matchedColor;
      var id = 'target-drake-' + index;
      var isMatched = targetsMatched.has(id);
      var color = isMatched ? matchedColor : glowColor;
      return index < targetDrakes.length ? React.createElement(DropOrganismGlowView, {
        id: id, className: 'small-drake-image',
        org: targetDrakes[index], size: targetDrakeSize,
        color: color, dropColor: dropGlowColor,
        isMatched: isMatched, onDrop: this.props.onDrop }) : null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var targetDrakes = _props2.targetDrakes;
      var clutch = _props2.clutch;
      var clutchSize = _props2.clutchSize;
      var requiredMoveCount = _props2.requiredMoveCount;
      var moveCount = _props2.moveCount;
      var targetDrakeCount = targetDrakes.length;
      var targetDrakesLabel = targetDrakeCount === 1 ? "Target Drake" : "Target Drakes";
      return React.createElement(
        'div',
        { id: 'center', className: 'column' },
        React.createElement(
          'div',
          { id: 'target-drakes-label', className: 'column-label' },
          targetDrakesLabel
        ),
        React.createElement(
          'div',
          { id: 'target-drakes' },
          this.renderTargetDrake(0),
          this.renderTargetDrake(1)
        ),
        React.createElement(
          'div',
          { id: 'breed-button-and-goal-feedback' },
          React.createElement(GeniBlocks.Button, { id: 'breed-button', label: 'Breed', onClick: this.handleBreed }),
          React.createElement(GeniBlocks.FeedbackView, { id: 'goal-feedback', className: 'feedback-view',
            text: ['GOAL is ' + requiredMoveCount + ' MOVES', 'Your moves: ' + moveCount] })
        ),
        React.createElement(GeniBlocks.PenStatsView, { id: 'breeding-pen', orgs: clutch, lastClutchSize: clutchSize,
          selectedIndex: this.state.selectedIndex,
          SelectedOrganismView: DragOrganismGlowView,
          onSelectionChange: this.handleSelectionChange }),
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

  return _Case3Center;
}(React.Component);

_Case3Center.propTypes = {
  targetDrakes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  targetsMatched: React.PropTypes.object.isRequired,
  targetDrakeSize: React.PropTypes.number.isRequired,
  glowColor: React.PropTypes.string.isRequired,
  matchedColor: React.PropTypes.string.isRequired,
  clutch: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  clutchSize: React.PropTypes.number.isRequired,
  onBreed: React.PropTypes.func.isRequired,
  requiredMoveCount: React.PropTypes.number.isRequired,
  moveCount: React.PropTypes.number.isRequired,
  onDrop: React.PropTypes.func.isRequired
};

var Case3Center = DragDropContext(DragDropBackend)(_Case3Center);

/**
 * Case 3 combines left column (mother drake), center column (target drakes, breed button,
 * breeding pen), and right column (father drake).
 */

var Case3 = function (_React$Component2) {
  _inherits(Case3, _React$Component2);

  function Case3() {
    var _Object$getPrototypeO2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Case3);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Case3)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.state = {
      parentDrakes: [],
      targetParentDrake: null,
      targetDrakes: [],
      clutch: [],
      requiredMoveCount: 0,
      moveCount: 0,
      targetsMatched: null
    }, _this2.reset = function () {
      var _this2$props$challeng = _this2.props.challengeSpec;
      var targetDrakeCount = _this2$props$challeng.targetDrakeCount;
      var fixedParentSex = _this2$props$challeng.fixedParentSex;
      var editableParentSex = _this2$props$challeng.editableParentSex;

      var parentDrakes = [],
          targetParentDrake = void 0,
          targetDrakes = [],
          targetsMatched = new Set(),
          clutch = [],
          requiredMoveCount = 0,
          moveCount = 0;
      // regenerate if we generate drakes that are too close to/far from each other
      while (requiredMoveCount < 4 || requiredMoveCount > 8) {
        parentDrakes = [];
        for (var sex = MALE; sex <= FEMALE; ++sex) {
          parentDrakes.push(new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, sex));
        }
        targetParentDrake = new BioLogica.Organism(BioLogica.Species.Drake, organismAlleles, editableParentSex);
        var targetMother = fixedParentSex === FEMALE ? parentDrakes[FEMALE] : targetParentDrake,
            targetFather = fixedParentSex === MALE ? parentDrakes[MALE] : targetParentDrake;
        targetDrakes = [];
        requiredMoveCount = 0;
        for (var i = 0; i < targetDrakeCount; ++i) {
          targetDrakes.push(BioLogica.breed(targetMother, targetFather));
          // We're approximating the combined required move count from the moves required to
          // reach each target offspring independently. Eventually, need a better means of
          // determining the moves required to reach a single parent that can produce all
          // of the necessary target offspring.
          requiredMoveCount = Math.max(requiredMoveCount, GeniBlocks.GeneticsUtils.numberOfBreedingMovesToReachDrake(parentDrakes[MALE], parentDrakes[FEMALE], editableParentSex === MALE ? changeableAlleles : [], editableParentSex === FEMALE ? changeableAlleles : [], targetDrakes[i]));
        }
        // add one for dragging an offspring to each target drake
        requiredMoveCount += targetDrakeCount;
      }
      _this2.setState({ parentDrakes: parentDrakes, targetParentDrake: targetParentDrake, targetDrakes: targetDrakes, targetsMatched: targetsMatched,
        clutch: clutch, requiredMoveCount: requiredMoveCount, moveCount: moveCount });
    }, _this2.handleAlleleChange = function (sex, chrom, side, prevAllele, newAllele) {
      var parentDrakes = _this2.state.parentDrakes.slice(),
          drake = parentDrakes[sex];
      drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
      drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
      parentDrakes[sex] = drake;
      _this2.setState({ parentDrakes: parentDrakes, clutch: [], moveCount: ++_this2.state.moveCount });
    }, _this2.handleBreed = function () {
      var parentDrakes = _this2.state.parentDrakes;
      var clutch = [];
      for (var i = 0; i < clutchSize; ++i) {
        clutch.push(BioLogica.breed(parentDrakes[FEMALE], parentDrakes[MALE]));
      }
      _this2.setState({ clutch: clutch });
    }, _this2.handleDrop = function (dragItem, dropTarget) {
      _this2.setState({ moveCount: ++_this2.state.moveCount });

      if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(dragItem.org, dropTarget.org)) {
        _this2.setState(function (state) {
          return { targetsMatched: new Set(state.targetsMatched).add(dropTarget.id) };
        });
        if (_this2.state.targetsMatched.size >= _this2.state.targetDrakes.length) {
          showAlert(true, {
            title: "Good Work!",
            message: "The drake you have created matches the target drake.",
            okButton: challenge < maxChallenge ? "Next Challenge" : "Case Log",
            okCallback: nextChallenge,
            tryButton: "Try Again",
            tryCallback: _this2.reset
          });
        } else {
          showAlert(true, {
            title: "Good Work!",
            message: "The drake you have created matches the target drake.",
            okButton: "OK"
          });
        }
      } else {
        showAlert(true, {
          title: "That's not the drake!",
          message: "The drake you have created doesn't match the target drake.\nPlease try again.",
          tryButton: "Try Again"
        });
      }
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Case3, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.reset();
    }
  }, {
    key: 'render',
    value: function render() {
      var editableParentSex = this.props.challengeSpec.editableParentSex;
      var _state = this.state;
      var parentDrakes = _state.parentDrakes;
      var targetDrakes = _state.targetDrakes;
      var targetsMatched = _state.targetsMatched;
      var clutch = _state.clutch;
      var requiredMoveCount = _state.requiredMoveCount;
      var moveCount = _state.moveCount;


      var handleMotherAlleleChange = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        this.handleAlleleChange.apply(this, [FEMALE].concat(args));
      }.bind(this);

      var handleFatherAlleleChange = function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        this.handleAlleleChange.apply(this, [MALE].concat(args));
      }.bind(this);

      return React.createElement(
        'div',
        { id: 'challenges-wrapper' },
        React.createElement(DrakeGenomeColumn, {
          id: 'left', idPrefix: 'female', sex: 'female',
          columnLabel: 'Female Drake',
          drake: parentDrakes[FEMALE],
          editable: editableParentSex === FEMALE,
          hiddenAlleles: hiddenAlleles,
          onAlleleChange: handleMotherAlleleChange }),
        React.createElement(Case3Center, {
          targetDrakes: targetDrakes, targetDrakeSize: targetDrakeSize,
          targetsMatched: targetsMatched,
          glowColor: glowColor, matchedColor: matchedColor,
          clutch: clutch, clutchSize: clutchSize,
          onBreed: this.handleBreed,
          onDrop: this.handleDrop,
          requiredMoveCount: requiredMoveCount, moveCount: moveCount }),
        React.createElement(DrakeGenomeColumn, {
          id: 'right', idPrefix: 'male', sex: 'male',
          columnLabel: 'Male Drake',
          drake: parentDrakes[MALE],
          editable: editableParentSex === MALE,
          hiddenAlleles: hiddenAlleles,
          onAlleleChange: handleFatherAlleleChange })
      );
    }
  }]);

  return Case3;
}(React.Component);

Case3.propTypes = {
  challengeSpec: React.PropTypes.object.isRequired
};


function render() {
  ReactDOM.render(React.createElement(Case3, { challengeSpec: challengeSpecs[challenge] }), document.getElementById('wrapper'));
}

function nextChallenge() {
  var url = window.location.href,
      nextUrl = void 0;
  if (challenge < maxChallenge) {
    // advance to next challenge
    nextUrl = url.replace('challenge=' + challenge, 'challenge=' + (challenge + 1));
  } else {
    // back to case log
    var case3Index = url.indexOf('case-3');
    nextUrl = url.substr(0, case3Index);
  }
  window.location.assign(nextUrl);
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
    okButton.onclick = alertButtonClickHandler;
    tryButton.onclick = alertButtonClickHandler;
  } else {
    alertClientButtonClickHandlers[okButton.id] = null;
    alertClientButtonClickHandlers[tryButton.id] = null;
  }
  //document.getElementById("overlay").style.display = displayMode;
  document.getElementById("alert-wrapper").style.display = displayMode;
}

function alertButtonClickHandler(evt) {
  var clientClickHandler = alertClientButtonClickHandlers[evt.target.id];
  showAlert(false);
  if (clientClickHandler) clientClickHandler();
  render();
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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QUErQixVQUFVLEVBQVYsQ0FBL0IsR0FBK0MsSUFBL0MsQ0FGRztHQWJMOztBQUprQyxVQXNCbEMsQ0FBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLEtBQXpDLENBQStDLE9BQS9DLEdBQXlELFdBQXpELENBdEJrQztDQUFwQzs7QUF5QkEsU0FBUyx1QkFBVCxDQUFpQyxHQUFqQyxFQUFzQztBQUNwQyxNQUFNLHFCQUFxQiwrQkFBK0IsSUFBSSxNQUFKLENBQVcsRUFBWCxDQUFwRCxDQUQ4QjtBQUVwQyxZQUFVLEtBQVYsRUFGb0M7QUFHcEMsTUFBSSxrQkFBSixFQUNFLHFCQURGO0FBRUEsV0FMb0M7Q0FBdEM7O0FBUUEsV0FBVyxNQUFYLENBQWtCLG1DQUFsQjs7QUFFQSIsImZpbGUiOiJjYXNlLTMvY2FzZS0zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDYXNlIDMgQ2hhbGxlbmdlc1xuICpcbiAqIFRoZSBjb2RlIGluIHRoaXMgbW9kdWxlIHdhcyB3cml0dGVuIHRvIHN1cHBvcnQgYSByZWNyZWF0aW9uIG9mIHRoZSBjaGFsbGVuZ2VzXG4gKiBmcm9tIENhc2UgMyBpbiBHZW5pdmVyc2UuIFRoZSBjaGFsbGVuZ2VzIGFyZTpcbiAqICBDaGFsbGVuZ2UgMTogTW9kaWZ5IG1vdGhlciBkcmFrZSBzbyBhcyB0byBicmVlZCBhIHBhcnRpY3VsYXIgdGFyZ2V0IGRyYWtlXG4gKiAgQ2hhbGxlbmdlIDI6IE1vZGlmeSBmYXRoZXIgZHJha2Ugc28gYXMgdG8gYnJlZWQgYSBwYWlyIG9mIHRhcmdldCBkcmFrZXNcbiAqL1xuLyogZ2xvYmFsIERyYWtlR2Vub21lQ29sdW1uICovXG4vL2ltcG9ydCBEcmFrZUdlbm9tZUNvbHVtbiBmcm9tICcuLi9qcy9wYXJlbnQtZ2Vub21lLWNvbHVtbic7XG5cbmNvbnN0IHsgTUFMRSwgRkVNQUxFIH0gPSBCaW9Mb2dpY2EsXG4gICAgICBtaW5DaGFsbGVuZ2UgPSAxLFxuICAgICAgbWF4Q2hhbGxlbmdlID0gMixcbiAgICAgIGNoYWxsZW5nZVNwZWNzID0ge1xuICAgICAgICAnMSc6IHsgIC8vIENoYWxsZW5nZSAxOiBmZW1hbGUgaXMgZWRpdGFibGUsIG1hbGUgaXMgZml4ZWQsIG9uZSB0YXJnZXQgZHJha2VcbiAgICAgICAgICB0YXJnZXREcmFrZUNvdW50OiAxLFxuICAgICAgICAgIGZpeGVkUGFyZW50U2V4OiBNQUxFLFxuICAgICAgICAgIGVkaXRhYmxlUGFyZW50U2V4OiBGRU1BTEVcbiAgICAgICAgfSxcbiAgICAgICAgJzInOiB7ICAvLyBDaGFsbGVuZ2UgMjogbWFsZSBpcyBlZGl0YWJsZSwgZmVtYWxlIGlzIGZpeGVkLCB0d28gdGFyZ2V0IGRyYWtlc1xuICAgICAgICAgIHRhcmdldERyYWtlQ291bnQ6IDIsXG4gICAgICAgICAgZml4ZWRQYXJlbnRTZXg6IEZFTUFMRSxcbiAgICAgICAgICBlZGl0YWJsZVBhcmVudFNleDogTUFMRVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3JnYW5pc21BbGxlbGVzID0gXCJhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYjpCLGE6RCxiOkQsYTpULGI6dCxhOnJoLGI6cmgsYTpCb2csYjpCb2dcIixcbiAgICAgIGhpZGRlbkFsbGVsZXMgPSBbJ3QnLCd0aycsJ2gnLCdjJywnYScsJ2InLCdkJywnYm9nJywncmgnXSxcbiAgICAgIGNoYW5nZWFibGVBbGxlbGVzID0gWydtJywndycsJ2ZsJywnaGwnXSxcbiAgICAgIGdsb3dDb2xvciA9ICcjRkZGRkFBJyxcbiAgICAgIGRyb3BHbG93Q29sb3IgPSAnI0ZGRkYwMCcsXG4gICAgICBtYXRjaGVkQ29sb3IgPSAnIzg4RkY4OCcsXG4gICAgICB0YXJnZXREcmFrZVNpemUgPSAxNTAsXG4gICAgICBjbHV0Y2hTaXplID0gMjA7XG5cbmZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmcpIHtcbiAgICBsZXQgcGFyYW1zID0ge30sIHF1ZXJpZXMsIHRtcCwgaSwgbDtcblxuICAgIC8vIFNwbGl0IGludG8ga2V5L3ZhbHVlIHBhaXJzXG4gICAgcXVlcmllcyA9IHF1ZXJ5U3RyaW5nLnNwbGl0KCcmJyk7XG5cbiAgICAvLyBDb252ZXJ0IHRoZSBhcnJheSBvZiBzdHJpbmdzIGludG8gYW4gb2JqZWN0XG4gICAgZm9yICggaSA9IDAsIGwgPSBxdWVyaWVzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgdG1wID0gcXVlcmllc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICBwYXJhbXNbdG1wWzBdXSA9IHRtcFsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zO1xufVxuXG4vLyBVUkwgcGFyYW0gaXMgdXNlZCB0byBjaG9vc2UgY2hhbGxlbmdlXG5jb25zdCB1cmxQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKCh3aW5kb3cubG9jYXRpb24uc2VhcmNoKS5zdWJzdHJpbmcoMSkpLFxuICAgICAgY2hhbGxlbmdlUGFyYW0gPSB1cmxQYXJhbXMuY2hhbGxlbmdlICYmIE51bWJlcih1cmxQYXJhbXMuY2hhbGxlbmdlKSxcbiAgICAgIGNoYWxsZW5nZSA9IChjaGFsbGVuZ2VQYXJhbSA+PSBtaW5DaGFsbGVuZ2UpICYmIChjaGFsbGVuZ2VQYXJhbSA8PSBtYXhDaGFsbGVuZ2UpID8gY2hhbGxlbmdlUGFyYW0gOiAxO1xuXG4gLyogZ2xvYmFsIFJlYWN0RG5ELCBSZWFjdERuREhUTUw1QmFja2VuZCAqL1xuY29uc3QgRHJhZ0Ryb3BDb250ZXh0ID0gUmVhY3REbkQuRHJhZ0Ryb3BDb250ZXh0LFxuICAgICAgRHJhZ0Ryb3BCYWNrZW5kID0gUmVhY3REbkRIVE1MNUJhY2tlbmQ7XG5cbi8qKlxuICogRHJhZ09yZ2FuaXNtR2xvd1ZpZXcgLSBSZWFjdERuRC5EcmFnU291cmNlIGZvciBkcmFnZ2luZyBvcmdhbmlzbSBmcm9tIGJyZWVkaW5nIHBlbi5cbiAqL1xuY29uc3QgX0RyYWdPcmdhbmlzbUdsb3dWaWV3ID0gKHtjb25uZWN0RHJhZ1NvdXJjZSwgLi4ub3RoZXJzfSkgPT4ge1xuICByZXR1cm4gY29ubmVjdERyYWdTb3VyY2UoXG4gICAgPGRpdj5cbiAgICAgIDxHZW5pQmxvY2tzLkdsb3dCYWNrZ3JvdW5kVmlldyBDaGlsZENvbXBvbmVudD17R2VuaUJsb2Nrcy5PcmdhbmlzbVZpZXd9IHsuLi5vdGhlcnN9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5fRHJhZ09yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBjb25uZWN0RHJhZ1NvdXJjZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaXNEcmFnZ2luZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgRHJhZ09yZ2FuaXNtR2xvd1ZpZXcgPSBSZWFjdERuRC5EcmFnU291cmNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnb3JnYW5pc20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IC8vIGRyYWcgc291cmNlIHNwZWNpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWdpbkRyYWc6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9yZywgaWQsIGluZGV4IH0gPSBwcm9wcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IG9yZywgaWQsIGluZGV4IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xsZWN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGNvbm5lY3QsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdERyYWdTb3VyY2U6IGNvbm5lY3QuZHJhZ1NvdXJjZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlcjogY29ubmVjdC5kcmFnUHJldmlldygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFnZ2luZzogbW9uaXRvci5pc0RyYWdnaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApKF9EcmFnT3JnYW5pc21HbG93Vmlldyk7XG5cbi8qKlxuICogRHJvcE9yZ2FuaXNtR2xvd1ZpZXcgLSBSZWFjdERuRC5Ecm9wVGFyZ2V0IGZvciBhY2NlcHRpbmcgZHJvcHMgb24gdGFyZ2V0IGRyYWtlcy5cbiAqL1xuY29uc3QgX0Ryb3BPcmdhbmlzbUdsb3dWaWV3ID0gKHtjb2xvciwgZHJvcENvbG9yLCBjb25uZWN0RHJvcFRhcmdldCwgaXNPdmVyLCBjYW5Ecm9wLCAuLi5vdGhlcnN9KSA9PiB7XG4gIGNvbnN0IGdsb3dDb2xvciA9IGlzT3ZlciAmJiBjYW5Ecm9wID8gZHJvcENvbG9yIDogY29sb3I7XG4gIHJldHVybiBjb25uZWN0RHJvcFRhcmdldChcbiAgICA8ZGl2PlxuICAgICAgPEdlbmlCbG9ja3MuR2xvd0JhY2tncm91bmRWaWV3IGNvbG9yPXtnbG93Q29sb3J9IENoaWxkQ29tcG9uZW50PXtHZW5pQmxvY2tzLk9yZ2FuaXNtVmlld30gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbl9Ecm9wT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGRyb3BDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjb25uZWN0RHJvcFRhcmdldDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaXNPdmVyOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBjYW5Ecm9wOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IERyb3BPcmdhbmlzbUdsb3dWaWV3ID0gUmVhY3REbkQuRHJvcFRhcmdldChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yZ2FuaXNtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyAvLyBkcm9wIHRhcmdldCBzcGVjaWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRHJvcDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhcHJvcHMuaXNNYXRjaGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcDogZnVuY3Rpb24ocHJvcHMsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JnLCBpZCB9ID0gcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wVGFyZ2V0ID0geyBvcmcsIGlkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMub25Ecm9wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wcy5vbkRyb3AobW9uaXRvci5nZXRJdGVtKCksIGRyb3BUYXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sbGVjdGluZyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihjb25uZWN0LCBtb25pdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3REcm9wVGFyZ2V0OiBjb25uZWN0LmRyb3BUYXJnZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT3ZlcjogbW9uaXRvci5pc092ZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkRyb3A6IG1vbml0b3IuY2FuRHJvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKShfRHJvcE9yZ2FuaXNtR2xvd1ZpZXcpO1xuXG4vKipcbiAqIENlbnRlciBwYW5lbCBoYXMgdGFyZ2V0IGRyYWtlcywgYnJlZWRuZyBwZW4sIGJyZWVkIGJ1dHRvbiwgZXRjLlxuICovXG5jbGFzcyBfQ2FzZTNDZW50ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGFyZ2V0RHJha2VzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIHRhcmdldHNNYXRjaGVkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdGFyZ2V0RHJha2VTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZ2xvd0NvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbWF0Y2hlZENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2x1dGNoOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGNsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvbkJyZWVkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcXVpcmVkTW92ZUNvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbW92ZUNvdW50OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb25Ecm9wOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBzZWxlY3RlZEluZGV4OiBudWxsXG4gIH1cblxuICBoYW5kbGVTZWxlY3Rpb25DaGFuZ2UgPSAoaVNlbGVjdGVkSW5kZXgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRJbmRleDogaVNlbGVjdGVkSW5kZXggfSk7XG4gIH1cblxuICBoYW5kbGVCcmVlZCA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRJbmRleDogbnVsbCB9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkJyZWVkKVxuICAgICAgdGhpcy5wcm9wcy5vbkJyZWVkKCk7XG4gIH1cblxuICByZW5kZXJUYXJnZXREcmFrZShpbmRleCkge1xuICAgIGNvbnN0IHsgdGFyZ2V0RHJha2VzLCB0YXJnZXRzTWF0Y2hlZCwgdGFyZ2V0RHJha2VTaXplLFxuICAgICAgICAgICAgZ2xvd0NvbG9yLCBtYXRjaGVkQ29sb3IgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgaWQgPSBgdGFyZ2V0LWRyYWtlLSR7aW5kZXh9YCxcbiAgICAgICAgICBpc01hdGNoZWQgPSB0YXJnZXRzTWF0Y2hlZC5oYXMoaWQpLFxuICAgICAgICAgIGNvbG9yID0gaXNNYXRjaGVkID8gbWF0Y2hlZENvbG9yIDogZ2xvd0NvbG9yO1xuICAgIHJldHVybiBpbmRleCA8IHRhcmdldERyYWtlcy5sZW5ndGhcbiAgICAgICAgICAgID8gPERyb3BPcmdhbmlzbUdsb3dWaWV3XG4gICAgICAgICAgICAgICAgaWQ9e2lkfSBjbGFzc05hbWU9XCJzbWFsbC1kcmFrZS1pbWFnZVwiXG4gICAgICAgICAgICAgICAgb3JnPXt0YXJnZXREcmFrZXNbaW5kZXhdfSBzaXplPXt0YXJnZXREcmFrZVNpemV9XG4gICAgICAgICAgICAgICAgY29sb3I9e2NvbG9yfSBkcm9wQ29sb3I9e2Ryb3BHbG93Q29sb3J9XG4gICAgICAgICAgICAgICAgaXNNYXRjaGVkPXtpc01hdGNoZWR9IG9uRHJvcD17dGhpcy5wcm9wcy5vbkRyb3B9IC8+XG4gICAgICAgICAgICA6IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0YXJnZXREcmFrZXMsIGNsdXRjaCwgY2x1dGNoU2l6ZSwgcmVxdWlyZWRNb3ZlQ291bnQsIG1vdmVDb3VudCB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICB0YXJnZXREcmFrZUNvdW50ID0gdGFyZ2V0RHJha2VzLmxlbmd0aCxcbiAgICAgICAgICB0YXJnZXREcmFrZXNMYWJlbCA9IHRhcmdldERyYWtlQ291bnQgPT09IDEgPyBcIlRhcmdldCBEcmFrZVwiIDogXCJUYXJnZXQgRHJha2VzXCI7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJjZW50ZXJcIiBjbGFzc05hbWU9XCJjb2x1bW5cIj5cbiAgICAgICAgPGRpdiBpZD1cInRhcmdldC1kcmFrZXMtbGFiZWxcIiBjbGFzc05hbWU9XCJjb2x1bW4tbGFiZWxcIj57dGFyZ2V0RHJha2VzTGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJ0YXJnZXQtZHJha2VzXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyVGFyZ2V0RHJha2UoMCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyVGFyZ2V0RHJha2UoMSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiYnJlZWQtYnV0dG9uLWFuZC1nb2FsLWZlZWRiYWNrXCI+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuQnV0dG9uIGlkPVwiYnJlZWQtYnV0dG9uXCIgbGFiZWw9XCJCcmVlZFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQnJlZWR9IC8+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuRmVlZGJhY2tWaWV3IGlkPVwiZ29hbC1mZWVkYmFja1wiIGNsYXNzTmFtZT1cImZlZWRiYWNrLXZpZXdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgR09BTCBpcyAke3JlcXVpcmVkTW92ZUNvdW50fSBNT1ZFU2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBZb3VyIG1vdmVzOiAke21vdmVDb3VudH1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEdlbmlCbG9ja3MuUGVuU3RhdHNWaWV3IGlkPVwiYnJlZWRpbmctcGVuXCIgb3Jncz17Y2x1dGNofSBsYXN0Q2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4PXt0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWRPcmdhbmlzbVZpZXc9e0RyYWdPcmdhbmlzbUdsb3dWaWV3fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlbGVjdGlvbkNoYW5nZX0vPlxuICAgICAgICA8ZGl2IGlkPVwiYWxlcnQtd3JhcHBlclwiPlxuICAgICAgICAgIDxoMyBpZD1cImFsZXJ0LXRpdGxlXCI+PC9oMz5cbiAgICAgICAgICA8ZGl2IGlkPVwiYWxlcnQtbWVzc2FnZVwiPjwvZGl2PlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJhbGVydC10cnktYnV0dG9uXCI+VHJ5IEFnYWluPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImFsZXJ0LW9rLWJ1dHRvblwiPk9LPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuY29uc3QgQ2FzZTNDZW50ZXIgPSBEcmFnRHJvcENvbnRleHQoRHJhZ0Ryb3BCYWNrZW5kKShfQ2FzZTNDZW50ZXIpO1xuXG4vKipcbiAqIENhc2UgMyBjb21iaW5lcyBsZWZ0IGNvbHVtbiAobW90aGVyIGRyYWtlKSwgY2VudGVyIGNvbHVtbiAodGFyZ2V0IGRyYWtlcywgYnJlZWQgYnV0dG9uLFxuICogYnJlZWRpbmcgcGVuKSwgYW5kIHJpZ2h0IGNvbHVtbiAoZmF0aGVyIGRyYWtlKS5cbiAqL1xuY2xhc3MgQ2FzZTMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hhbGxlbmdlU3BlYzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBwYXJlbnREcmFrZXM6IFtdLFxuICAgIHRhcmdldFBhcmVudERyYWtlOiBudWxsLFxuICAgIHRhcmdldERyYWtlczogW10sXG4gICAgY2x1dGNoOiBbXSxcbiAgICByZXF1aXJlZE1vdmVDb3VudDogMCxcbiAgICBtb3ZlQ291bnQ6IDAsXG4gICAgdGFyZ2V0c01hdGNoZWQ6IG51bGxcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCA9ICgpID0+IHtcbiAgICBjb25zdCB7IHRhcmdldERyYWtlQ291bnQsIGZpeGVkUGFyZW50U2V4LCBlZGl0YWJsZVBhcmVudFNleCB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjO1xuICAgIGxldCBwYXJlbnREcmFrZXMgPSBbXSxcbiAgICAgICAgdGFyZ2V0UGFyZW50RHJha2UsXG4gICAgICAgIHRhcmdldERyYWtlcyA9IFtdLFxuICAgICAgICB0YXJnZXRzTWF0Y2hlZCA9IG5ldyBTZXQsXG4gICAgICAgIGNsdXRjaCA9IFtdLFxuICAgICAgICByZXF1aXJlZE1vdmVDb3VudCA9IDAsXG4gICAgICAgIG1vdmVDb3VudCA9IDA7XG4gICAgLy8gcmVnZW5lcmF0ZSBpZiB3ZSBnZW5lcmF0ZSBkcmFrZXMgdGhhdCBhcmUgdG9vIGNsb3NlIHRvL2ZhciBmcm9tIGVhY2ggb3RoZXJcbiAgICB3aGlsZSAoKHJlcXVpcmVkTW92ZUNvdW50IDwgNCkgfHwgKHJlcXVpcmVkTW92ZUNvdW50ID4gOCkpIHtcbiAgICAgIHBhcmVudERyYWtlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgc2V4ID0gTUFMRTsgc2V4IDw9IEZFTUFMRTsgKytzZXgpIHtcbiAgICAgICAgcGFyZW50RHJha2VzLnB1c2gobmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgb3JnYW5pc21BbGxlbGVzLCBzZXgpKTtcbiAgICAgIH1cbiAgICAgIHRhcmdldFBhcmVudERyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgb3JnYW5pc21BbGxlbGVzLCBlZGl0YWJsZVBhcmVudFNleCk7XG4gICAgICBjb25zdCB0YXJnZXRNb3RoZXIgPSBmaXhlZFBhcmVudFNleCA9PT0gRkVNQUxFID8gcGFyZW50RHJha2VzW0ZFTUFMRV0gOiB0YXJnZXRQYXJlbnREcmFrZSxcbiAgICAgICAgICAgIHRhcmdldEZhdGhlciA9IGZpeGVkUGFyZW50U2V4ID09PSBNQUxFID8gcGFyZW50RHJha2VzW01BTEVdIDogdGFyZ2V0UGFyZW50RHJha2U7XG4gICAgICB0YXJnZXREcmFrZXMgPSBbXTtcbiAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gMDtcbiAgICAgIGZvciAobGV0IGk9MDsgaTx0YXJnZXREcmFrZUNvdW50OyArK2kpIHtcbiAgICAgICAgdGFyZ2V0RHJha2VzLnB1c2goQmlvTG9naWNhLmJyZWVkKHRhcmdldE1vdGhlciwgdGFyZ2V0RmF0aGVyKSk7XG4gICAgICAgIC8vIFdlJ3JlIGFwcHJveGltYXRpbmcgdGhlIGNvbWJpbmVkIHJlcXVpcmVkIG1vdmUgY291bnQgZnJvbSB0aGUgbW92ZXMgcmVxdWlyZWQgdG9cbiAgICAgICAgLy8gcmVhY2ggZWFjaCB0YXJnZXQgb2Zmc3ByaW5nIGluZGVwZW5kZW50bHkuIEV2ZW50dWFsbHksIG5lZWQgYSBiZXR0ZXIgbWVhbnMgb2ZcbiAgICAgICAgLy8gZGV0ZXJtaW5pbmcgdGhlIG1vdmVzIHJlcXVpcmVkIHRvIHJlYWNoIGEgc2luZ2xlIHBhcmVudCB0aGF0IGNhbiBwcm9kdWNlIGFsbFxuICAgICAgICAvLyBvZiB0aGUgbmVjZXNzYXJ5IHRhcmdldCBvZmZzcHJpbmcuXG4gICAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gTWF0aC5tYXgocmVxdWlyZWRNb3ZlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkJyZWVkaW5nTW92ZXNUb1JlYWNoRHJha2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnREcmFrZXNbTUFMRV0sIHBhcmVudERyYWtlc1tGRU1BTEVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXggPT09IE1BTEUgPyBjaGFuZ2VhYmxlQWxsZWxlcyA6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXggPT09IEZFTUFMRSA/IGNoYW5nZWFibGVBbGxlbGVzIDogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREcmFrZXNbaV0pKTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCBvbmUgZm9yIGRyYWdnaW5nIGFuIG9mZnNwcmluZyB0byBlYWNoIHRhcmdldCBkcmFrZVxuICAgICAgcmVxdWlyZWRNb3ZlQ291bnQgKz0gdGFyZ2V0RHJha2VDb3VudDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBhcmVudERyYWtlcywgdGFyZ2V0UGFyZW50RHJha2UsIHRhcmdldERyYWtlcywgdGFyZ2V0c01hdGNoZWQsXG4gICAgICAgICAgICAgICAgICAgIGNsdXRjaCwgcmVxdWlyZWRNb3ZlQ291bnQsIG1vdmVDb3VudCB9KTtcbiAgfVxuXG4gIGhhbmRsZUFsbGVsZUNoYW5nZSA9IChzZXgsIGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpID0+IHtcbiAgICBsZXQgcGFyZW50RHJha2VzID0gdGhpcy5zdGF0ZS5wYXJlbnREcmFrZXMuc2xpY2UoKSxcbiAgICAgICAgZHJha2UgPSBwYXJlbnREcmFrZXNbc2V4XTtcbiAgICBkcmFrZS5nZW5ldGljcy5nZW5vdHlwZS5yZXBsYWNlQWxsZWxlQ2hyb21OYW1lKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgIGRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgZHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksIGRyYWtlLnNleCk7XG4gICAgcGFyZW50RHJha2VzW3NleF0gPSBkcmFrZTtcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFyZW50RHJha2VzLCBjbHV0Y2g6IFtdLCBtb3ZlQ291bnQ6ICsrdGhpcy5zdGF0ZS5tb3ZlQ291bnQgfSk7XG4gIH1cblxuICBoYW5kbGVCcmVlZCA9ICgpID0+IHtcbiAgICBsZXQgeyBwYXJlbnREcmFrZXMgfSA9IHRoaXMuc3RhdGUsXG4gICAgICAgIGNsdXRjaCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2x1dGNoU2l6ZTsgKytpKSB7XG4gICAgICBjbHV0Y2gucHVzaChCaW9Mb2dpY2EuYnJlZWQocGFyZW50RHJha2VzW0ZFTUFMRV0sIHBhcmVudERyYWtlc1tNQUxFXSkpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgY2x1dGNoIH0pO1xuICB9XG5cbiAgaGFuZGxlRHJvcCA9IChkcmFnSXRlbSwgZHJvcFRhcmdldCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBtb3ZlQ291bnQ6ICsrdGhpcy5zdGF0ZS5tb3ZlQ291bnQgfSk7XG5cbiAgICBpZiAoMCA9PT0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLm51bWJlck9mQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoZHJhZ0l0ZW0ub3JnLCBkcm9wVGFyZ2V0Lm9yZykpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiAoeyB0YXJnZXRzTWF0Y2hlZDogbmV3IFNldChzdGF0ZS50YXJnZXRzTWF0Y2hlZCkuYWRkKGRyb3BUYXJnZXQuaWQpIH0pKTtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnRhcmdldHNNYXRjaGVkLnNpemUgPj0gdGhpcy5zdGF0ZS50YXJnZXREcmFrZXMubGVuZ3RoKSB7XG4gICAgICAgIHNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgICAgdGl0bGU6IFwiR29vZCBXb3JrIVwiLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICAgICAgICAgIG9rQnV0dG9uOiBjaGFsbGVuZ2UgPCBtYXhDaGFsbGVuZ2UgPyBcIk5leHQgQ2hhbGxlbmdlXCIgOiBcIkNhc2UgTG9nXCIsXG4gICAgICAgICAgb2tDYWxsYmFjazogbmV4dENoYWxsZW5nZSxcbiAgICAgICAgICB0cnlCdXR0b246IFwiVHJ5IEFnYWluXCIsXG4gICAgICAgICAgdHJ5Q2FsbGJhY2s6IHRoaXMucmVzZXRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICB0aXRsZTogXCJHb29kIFdvcmshXCIsXG4gICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgb2tCdXR0b246IFwiT0tcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzaG93QWxlcnQodHJ1ZSwge1xuICAgICAgICB0aXRsZTogXCJUaGF0J3Mgbm90IHRoZSBkcmFrZSFcIixcbiAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBkb2Vzbid0IG1hdGNoIHRoZSB0YXJnZXQgZHJha2UuXFxuUGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBlZGl0YWJsZVBhcmVudFNleCB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjLFxuICAgICAgICAgIHsgcGFyZW50RHJha2VzLCB0YXJnZXREcmFrZXMsIHRhcmdldHNNYXRjaGVkLFxuICAgICAgICAgICAgY2x1dGNoLCByZXF1aXJlZE1vdmVDb3VudCwgbW92ZUNvdW50IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgaGFuZGxlTW90aGVyQWxsZWxlQ2hhbmdlID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgdGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2UoRkVNQUxFLCAuLi5hcmdzKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBjb25zdCBoYW5kbGVGYXRoZXJBbGxlbGVDaGFuZ2UgPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICB0aGlzLmhhbmRsZUFsbGVsZUNoYW5nZShNQUxFLCAuLi5hcmdzKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImNoYWxsZW5nZXMtd3JhcHBlclwiPlxuICAgICAgICA8RHJha2VHZW5vbWVDb2x1bW5cbiAgICAgICAgICAgICAgaWQ9J2xlZnQnIGlkUHJlZml4PSdmZW1hbGUnIHNleD0nZmVtYWxlJ1xuICAgICAgICAgICAgICBjb2x1bW5MYWJlbD1cIkZlbWFsZSBEcmFrZVwiXG4gICAgICAgICAgICAgIGRyYWtlPXtwYXJlbnREcmFrZXNbRkVNQUxFXX1cbiAgICAgICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlUGFyZW50U2V4ID09PSBGRU1BTEV9XG4gICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtoYW5kbGVNb3RoZXJBbGxlbGVDaGFuZ2V9IC8+XG4gICAgICAgIDxDYXNlM0NlbnRlclxuICAgICAgICAgICAgICB0YXJnZXREcmFrZXM9e3RhcmdldERyYWtlc30gdGFyZ2V0RHJha2VTaXplPXt0YXJnZXREcmFrZVNpemV9XG4gICAgICAgICAgICAgIHRhcmdldHNNYXRjaGVkPXt0YXJnZXRzTWF0Y2hlZH1cbiAgICAgICAgICAgICAgZ2xvd0NvbG9yPXtnbG93Q29sb3J9IG1hdGNoZWRDb2xvcj17bWF0Y2hlZENvbG9yfVxuICAgICAgICAgICAgICBjbHV0Y2g9e2NsdXRjaH0gY2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX1cbiAgICAgICAgICAgICAgb25CcmVlZD17dGhpcy5oYW5kbGVCcmVlZH1cbiAgICAgICAgICAgICAgb25Ecm9wPXt0aGlzLmhhbmRsZURyb3B9XG4gICAgICAgICAgICAgIHJlcXVpcmVkTW92ZUNvdW50PXtyZXF1aXJlZE1vdmVDb3VudH0gbW92ZUNvdW50PXttb3ZlQ291bnR9IC8+XG4gICAgICAgIDxEcmFrZUdlbm9tZUNvbHVtblxuICAgICAgICAgICAgICBpZD0ncmlnaHQnIGlkUHJlZml4PSdtYWxlJyBzZXg9J21hbGUnXG4gICAgICAgICAgICAgIGNvbHVtbkxhYmVsPVwiTWFsZSBEcmFrZVwiXG4gICAgICAgICAgICAgIGRyYWtlPXtwYXJlbnREcmFrZXNbTUFMRV19XG4gICAgICAgICAgICAgIGVkaXRhYmxlPXtlZGl0YWJsZVBhcmVudFNleCA9PT0gTUFMRX1cbiAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2hhbmRsZUZhdGhlckFsbGVsZUNoYW5nZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyKCkge1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDYXNlMywgeyBjaGFsbGVuZ2VTcGVjOiBjaGFsbGVuZ2VTcGVjc1tjaGFsbGVuZ2VdIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJylcbiAgKTtcbn1cblxuZnVuY3Rpb24gbmV4dENoYWxsZW5nZSgpIHtcbiAgbGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgbmV4dFVybDtcbiAgaWYgKGNoYWxsZW5nZSA8IG1heENoYWxsZW5nZSkge1xuICAgIC8vIGFkdmFuY2UgdG8gbmV4dCBjaGFsbGVuZ2VcbiAgICBuZXh0VXJsID0gdXJsLnJlcGxhY2UoYGNoYWxsZW5nZT0ke2NoYWxsZW5nZX1gLCBgY2hhbGxlbmdlPSR7Y2hhbGxlbmdlKzF9YCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gYmFjayB0byBjYXNlIGxvZ1xuICAgIGNvbnN0IGNhc2UzSW5kZXggPSB1cmwuaW5kZXhPZignY2FzZS0zJyk7XG4gICAgbmV4dFVybCA9IHVybC5zdWJzdHIoMCwgY2FzZTNJbmRleCk7XG4gIH1cbiAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXh0VXJsKTtcbn1cblxubGV0IGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVycyA9IHt9O1xuZnVuY3Rpb24gc2hvd0FsZXJ0KGlTaG93LCBpT3B0aW9ucykge1xuICBjb25zdCBkaXNwbGF5TW9kZSA9IGlTaG93ID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgb2tCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW9rLWJ1dHRvblwiKSxcbiAgICAgICAgdHJ5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpO1xuICBpZiAoaVNob3cpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXRpdGxlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLnRpdGxlIHx8IFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1tZXNzYWdlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLm1lc3NhZ2UgfHwgXCJcIjtcbiAgICBva0J1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy5va0J1dHRvbiB8fCBcIlwiO1xuICAgIG9rQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy5va0J1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgb2tCdXR0b24uZGF0YXNldC5va0NhbGxiYWNrID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCAnJztcbiAgICBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbb2tCdXR0b24uaWRdID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCBudWxsO1xuICAgIHRyeUJ1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy50cnlCdXR0b24gfHwgXCJcIjtcbiAgICB0cnlCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlPcHRpb25zLnRyeUJ1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgYWxlcnRDbGllbnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBpT3B0aW9ucy50cnlDYWxsYmFjayB8fCBudWxsO1xuICAgIG9rQnV0dG9uLm9uY2xpY2sgPSBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcjtcbiAgICB0cnlCdXR0b24ub25jbGljayA9IGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyO1xuICB9XG4gIGVsc2Uge1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1tva0J1dHRvbi5pZF0gPSBudWxsO1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1t0cnlCdXR0b24uaWRdID0gbnVsbDtcbiAgfVxuICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtd3JhcHBlclwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG59XG5cbmZ1bmN0aW9uIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyKGV2dCkge1xuICBjb25zdCBjbGllbnRDbGlja0hhbmRsZXIgPSBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbZXZ0LnRhcmdldC5pZF07XG4gIHNob3dBbGVydChmYWxzZSk7XG4gIGlmIChjbGllbnRDbGlja0hhbmRsZXIpXG4gICAgY2xpZW50Q2xpY2tIYW5kbGVyKCk7XG4gIHJlbmRlcigpO1xufVxuXG5HZW5pQmxvY2tzLkJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpO1xuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
