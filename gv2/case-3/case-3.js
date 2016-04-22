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

var MALE = 0,
    FEMALE = 1,
    minChallenge = 1,
    maxChallenge = 2,
    challengeSpecs = {
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
},
    organismAlleles = "a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog",
    hiddenAlleles = ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    changeableAlleles = ['m', 'w', 'fl', 'hl'],
    glowColor = '#FFFFAA',
    dropGlowColor = '#FFFF00',
    matchedColor = '#88FF88',
    targetDrakeSize = 150,
    clutchSize = 20;

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

  function _Case3Center(props) {
    _classCallCheck(this, _Case3Center);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_Case3Center).call(this, props));

    _this.state = {
      selectedIndex: null
    };

    _this.handleSelectionChange = function (iSelectedIndex) {
      _this.setState({ selectedIndex: iSelectedIndex });
    };

    _this.handleBreed = function () {
      _this.setState({ selectedIndex: null });
      if (_this.props.onBreed) _this.props.onBreed();
    };

    document.addEventListener('keydown', function () {
      return enableButtonFocusHighlight();
    });
    return _this;
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
          React.createElement(
            'button',
            { id: 'breed-button',
              onClick: this.handleBreed,
              onMouseOver: suppressButtonFocusHighlight,
              onMouseDown: suppressButtonFocusHighlight },
            'Breed'
          ),
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
    var _Object$getPrototypeO;

    var _temp, _this2, _ret;

    _classCallCheck(this, Case3);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Case3)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this2), _this2.state = {
      parentDrakes: [],
      targetParentDrake: null,
      targetDrakes: [],
      clutch: [],
      requiredMoveCount: 0,
      moveCount: 0,
      targetsMatched: null
    }, _this2.reset = function () {
      var _this2$props$challeng = _this2.props.challenge;
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
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(Case3, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.reset();
    }
  }, {
    key: 'render',
    value: function render() {
      var editableParentSex = this.props.challenge.editableParentSex;
      var _state = this.state;
      var parentDrakes = _state.parentDrakes;
      var targetDrakes = _state.targetDrakes;
      var targetsMatched = _state.targetsMatched;
      var clutch = _state.clutch;
      var requiredMoveCount = _state.requiredMoveCount;
      var moveCount = _state.moveCount;


      var handleMotherAlleleChange = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        this.handleAlleleChange.apply(this, [FEMALE].concat(args));
      }.bind(this);

      var handleFatherAlleleChange = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
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
  challenge: React.PropTypes.object.isRequired
};


function render() {
  ReactDOM.render(React.createElement(Case3, { challenge: challengeSpecs[challenge] }), document.getElementById('wrapper'));
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

// prevent extraneous focus highlight on click while maintaining keyboard accessibility
// see https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
function suppressButtonFocusHighlight(evt) {
  var noFocusHighlight = 'no-focus-highlight';
  if (evt.target.className.indexOf(noFocusHighlight) < 0) evt.target.className += ' ' + noFocusHighlight;
}

function enableButtonFocusHighlight() {
  var button = document.getElementById('breed-button');
  // cf. http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
  if (button && button.className) button.className = button.className.replace(/(?:^|\s)no-focus-highlight(?!\S)/g, '');
}

GeniBlocks.Button.enableButtonFocusHighlightOnKeyDown();

render();
//# sourceMappingURL=data:application/json;base64,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bmdlc1xuICpcbiAqIFRoZSBjb2RlIGluIHRoaXMgbW9kdWxlIHdhcyB3cml0dGVuIHRvIHN1cHBvcnQgYSByZWNyZWF0aW9uIG9mIHRoZSBjaGFsbGVuZ2VzXG4gKiBmcm9tIENhc2UgMyBpbiBHZW5pdmVyc2UuIFRoZSBjaGFsbGVuZ2VzIGFyZTpcbiAqICBDaGFsbGVuZ2UgMTogTW9kaWZ5IG1vdGhlciBkcmFrZSBzbyBhcyB0byBicmVlZCBhIHBhcnRpY3VsYXIgdGFyZ2V0IGRyYWtlXG4gKiAgQ2hhbGxlbmdlIDI6IE1vZGlmeSBmYXRoZXIgZHJha2Ugc28gYXMgdG8gYnJlZWQgYSBwYWlyIG9mIHRhcmdldCBkcmFrZXNcbiAqL1xuLyogZ2xvYmFsIERyYWtlR2Vub21lQ29sdW1uICovXG4vL2ltcG9ydCBEcmFrZUdlbm9tZUNvbHVtbiBmcm9tICcuLi9qcy9wYXJlbnQtZ2Vub21lLWNvbHVtbic7XG5cbmNvbnN0IE1BTEUgPSAwLFxuICAgICAgRkVNQUxFID0gMSxcbiAgICAgIG1pbkNoYWxsZW5nZSA9IDEsXG4gICAgICBtYXhDaGFsbGVuZ2UgPSAyLFxuICAgICAgY2hhbGxlbmdlU3BlY3MgPSB7XG4gICAgICAgICcxJzogeyAgLy8gQ2hhbGxlbmdlIDE6IGZlbWFsZSBpcyBlZGl0YWJsZSwgbWFsZSBpcyBmaXhlZCwgb25lIHRhcmdldCBkcmFrZVxuICAgICAgICAgIHRhcmdldERyYWtlQ291bnQ6IDEsXG4gICAgICAgICAgZml4ZWRQYXJlbnRTZXg6IE1BTEUsXG4gICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXg6IEZFTUFMRVxuICAgICAgICB9LFxuICAgICAgICAnMic6IHsgIC8vIENoYWxsZW5nZSAyOiBtYWxlIGlzIGVkaXRhYmxlLCBmZW1hbGUgaXMgZml4ZWQsIHR3byB0YXJnZXQgZHJha2VzXG4gICAgICAgICAgdGFyZ2V0RHJha2VDb3VudDogMixcbiAgICAgICAgICBmaXhlZFBhcmVudFNleDogRkVNQUxFLFxuICAgICAgICAgIGVkaXRhYmxlUGFyZW50U2V4OiBNQUxFXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcmdhbmlzbUFsbGVsZXMgPSBcImE6aCxiOmgsYTpDLGI6QyxhOmEsYjphLGE6QixiOkIsYTpELGI6RCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLFxuICAgICAgaGlkZGVuQWxsZWxlcyA9IFsndCcsJ3RrJywnaCcsJ2MnLCdhJywnYicsJ2QnLCdib2cnLCdyaCddLFxuICAgICAgY2hhbmdlYWJsZUFsbGVsZXMgPSBbJ20nLCd3JywnZmwnLCdobCddLFxuICAgICAgZ2xvd0NvbG9yID0gJyNGRkZGQUEnLFxuICAgICAgZHJvcEdsb3dDb2xvciA9ICcjRkZGRjAwJyxcbiAgICAgIG1hdGNoZWRDb2xvciA9ICcjODhGRjg4JyxcbiAgICAgIHRhcmdldERyYWtlU2l6ZSA9IDE1MCxcbiAgICAgIGNsdXRjaFNpemUgPSAyMDtcblxuZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZykge1xuICAgIGxldCBwYXJhbXMgPSB7fSwgcXVlcmllcywgdG1wLCBpLCBsO1xuXG4gICAgLy8gU3BsaXQgaW50byBrZXkvdmFsdWUgcGFpcnNcbiAgICBxdWVyaWVzID0gcXVlcnlTdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IG9mIHN0cmluZ3MgaW50byBhbiBvYmplY3RcbiAgICBmb3IgKCBpID0gMCwgbCA9IHF1ZXJpZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICB0bXAgPSBxdWVyaWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIHBhcmFtc1t0bXBbMF1dID0gdG1wWzFdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG59XG5cbi8vIFVSTCBwYXJhbSBpcyB1c2VkIHRvIGNob29zZSBjaGFsbGVuZ2VcbmNvbnN0IHVybFBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcoKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLnN1YnN0cmluZygxKSksXG4gICAgICBjaGFsbGVuZ2VQYXJhbSA9IHVybFBhcmFtcy5jaGFsbGVuZ2UgJiYgTnVtYmVyKHVybFBhcmFtcy5jaGFsbGVuZ2UpLFxuICAgICAgY2hhbGxlbmdlID0gKGNoYWxsZW5nZVBhcmFtID49IG1pbkNoYWxsZW5nZSkgJiYgKGNoYWxsZW5nZVBhcmFtIDw9IG1heENoYWxsZW5nZSkgPyBjaGFsbGVuZ2VQYXJhbSA6IDE7XG5cbiAvKiBnbG9iYWwgUmVhY3REbkQsIFJlYWN0RG5ESFRNTDVCYWNrZW5kICovXG5jb25zdCBEcmFnRHJvcENvbnRleHQgPSBSZWFjdERuRC5EcmFnRHJvcENvbnRleHQsXG4gICAgICBEcmFnRHJvcEJhY2tlbmQgPSBSZWFjdERuREhUTUw1QmFja2VuZDtcblxuLyoqXG4gKiBEcmFnT3JnYW5pc21HbG93VmlldyAtIFJlYWN0RG5ELkRyYWdTb3VyY2UgZm9yIGRyYWdnaW5nIG9yZ2FuaXNtIGZyb20gYnJlZWRpbmcgcGVuLlxuICovXG5jb25zdCBfRHJhZ09yZ2FuaXNtR2xvd1ZpZXcgPSAoe2Nvbm5lY3REcmFnU291cmNlLCAuLi5vdGhlcnN9KSA9PiB7XG4gIHJldHVybiBjb25uZWN0RHJhZ1NvdXJjZShcbiAgICA8ZGl2PlxuICAgICAgPEdlbmlCbG9ja3MuR2xvd0JhY2tncm91bmRWaWV3IENoaWxkQ29tcG9uZW50PXtHZW5pQmxvY2tzLk9yZ2FuaXNtVmlld30gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbl9EcmFnT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGNvbm5lY3REcmFnU291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBEcmFnT3JnYW5pc21HbG93VmlldyA9IFJlYWN0RG5ELkRyYWdTb3VyY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdvcmdhbmlzbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgLy8gZHJhZyBzb3VyY2Ugc3BlY2lmaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luRHJhZzogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JnLCBpZCwgaW5kZXggfSA9IHByb3BzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgb3JnLCBpZCwgaW5kZXggfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbGxlY3RpbmcgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oY29ubmVjdCwgbW9uaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0RHJhZ1NvdXJjZTogY29ubmVjdC5kcmFnU291cmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyOiBjb25uZWN0LmRyYWdQcmV2aWV3KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RyYWdnaW5nOiBtb25pdG9yLmlzRHJhZ2dpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICkoX0RyYWdPcmdhbmlzbUdsb3dWaWV3KTtcblxuLyoqXG4gKiBEcm9wT3JnYW5pc21HbG93VmlldyAtIFJlYWN0RG5ELkRyb3BUYXJnZXQgZm9yIGFjY2VwdGluZyBkcm9wcyBvbiB0YXJnZXQgZHJha2VzLlxuICovXG5jb25zdCBfRHJvcE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2NvbG9yLCBkcm9wQ29sb3IsIGNvbm5lY3REcm9wVGFyZ2V0LCBpc092ZXIsIGNhbkRyb3AsIC4uLm90aGVyc30pID0+IHtcbiAgY29uc3QgZ2xvd0NvbG9yID0gaXNPdmVyICYmIGNhbkRyb3AgPyBkcm9wQ29sb3IgOiBjb2xvcjtcbiAgcmV0dXJuIGNvbm5lY3REcm9wVGFyZ2V0KFxuICAgIDxkaXY+XG4gICAgICA8R2VuaUJsb2Nrcy5HbG93QmFja2dyb3VuZFZpZXcgY29sb3I9e2dsb3dDb2xvcn0gQ2hpbGRDb21wb25lbnQ9e0dlbmlCbG9ja3MuT3JnYW5pc21WaWV3fSB7Li4ub3RoZXJzfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuX0Ryb3BPcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZHJvcENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbm5lY3REcm9wVGFyZ2V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc092ZXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGNhbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIG9uRHJvcDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgRHJvcE9yZ2FuaXNtR2xvd1ZpZXcgPSBSZWFjdERuRC5Ecm9wVGFyZ2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnb3JnYW5pc20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IC8vIGRyb3AgdGFyZ2V0IHNwZWNpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5Ecm9wOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFwcm9wcy5pc01hdGNoZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wOiBmdW5jdGlvbihwcm9wcywgbW9uaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvcmcsIGlkIH0gPSBwcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyb3BUYXJnZXQgPSB7IG9yZywgaWQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5vbkRyb3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzLm9uRHJvcChtb25pdG9yLmdldEl0ZW0oKSwgZHJvcFRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xsZWN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGNvbm5lY3QsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdERyb3BUYXJnZXQ6IGNvbm5lY3QuZHJvcFRhcmdldCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPdmVyOiBtb25pdG9yLmlzT3ZlcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRHJvcDogbW9uaXRvci5jYW5Ecm9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApKF9Ecm9wT3JnYW5pc21HbG93Vmlldyk7XG5cbi8qKlxuICogQ2VudGVyIHBhbmVsIGhhcyB0YXJnZXQgZHJha2VzLCBicmVlZG5nIHBlbiwgYnJlZWQgYnV0dG9uLCBldGMuXG4gKi9cbmNsYXNzIF9DYXNlM0NlbnRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0YXJnZXREcmFrZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgdGFyZ2V0c01hdGNoZWQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0YXJnZXREcmFrZVNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBnbG93Q29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBtYXRjaGVkQ29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbHV0Y2g6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgY2x1dGNoU2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9uQnJlZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVxdWlyZWRNb3ZlQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBtb3ZlQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIHNlbGVjdGVkSW5kZXg6IG51bGxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBlbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpKTtcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdGlvbkNoYW5nZSA9IChpU2VsZWN0ZWRJbmRleCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEluZGV4OiBpU2VsZWN0ZWRJbmRleCB9KTtcbiAgfVxuXG4gIGhhbmRsZUJyZWVkID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEluZGV4OiBudWxsIH0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uQnJlZWQpXG4gICAgICB0aGlzLnByb3BzLm9uQnJlZWQoKTtcbiAgfVxuXG4gIHJlbmRlclRhcmdldERyYWtlKGluZGV4KSB7XG4gICAgY29uc3QgeyB0YXJnZXREcmFrZXMsIHRhcmdldHNNYXRjaGVkLCB0YXJnZXREcmFrZVNpemUsXG4gICAgICAgICAgICBnbG93Q29sb3IsIG1hdGNoZWRDb2xvciB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBpZCA9IGB0YXJnZXQtZHJha2UtJHtpbmRleH1gLFxuICAgICAgICAgIGlzTWF0Y2hlZCA9IHRhcmdldHNNYXRjaGVkLmhhcyhpZCksXG4gICAgICAgICAgY29sb3IgPSBpc01hdGNoZWQgPyBtYXRjaGVkQ29sb3IgOiBnbG93Q29sb3I7XG4gICAgcmV0dXJuIGluZGV4IDwgdGFyZ2V0RHJha2VzLmxlbmd0aFxuICAgICAgICAgICAgPyA8RHJvcE9yZ2FuaXNtR2xvd1ZpZXdcbiAgICAgICAgICAgICAgICBpZD17aWR9IGNsYXNzTmFtZT1cInNtYWxsLWRyYWtlLWltYWdlXCJcbiAgICAgICAgICAgICAgICBvcmc9e3RhcmdldERyYWtlc1tpbmRleF19IHNpemU9e3RhcmdldERyYWtlU2l6ZX1cbiAgICAgICAgICAgICAgICBjb2xvcj17Y29sb3J9IGRyb3BDb2xvcj17ZHJvcEdsb3dDb2xvcn1cbiAgICAgICAgICAgICAgICBpc01hdGNoZWQ9e2lzTWF0Y2hlZH0gb25Ecm9wPXt0aGlzLnByb3BzLm9uRHJvcH0gLz5cbiAgICAgICAgICAgIDogbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHRhcmdldERyYWtlcywgY2x1dGNoLCBjbHV0Y2hTaXplLCByZXF1aXJlZE1vdmVDb3VudCwgbW92ZUNvdW50IH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIHRhcmdldERyYWtlQ291bnQgPSB0YXJnZXREcmFrZXMubGVuZ3RoLFxuICAgICAgICAgIHRhcmdldERyYWtlc0xhYmVsID0gdGFyZ2V0RHJha2VDb3VudCA9PT0gMSA/IFwiVGFyZ2V0IERyYWtlXCIgOiBcIlRhcmdldCBEcmFrZXNcIjtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImNlbnRlclwiIGNsYXNzTmFtZT1cImNvbHVtblwiPlxuICAgICAgICA8ZGl2IGlkPVwidGFyZ2V0LWRyYWtlcy1sYWJlbFwiIGNsYXNzTmFtZT1cImNvbHVtbi1sYWJlbFwiPnt0YXJnZXREcmFrZXNMYWJlbH08L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRhcmdldC1kcmFrZXNcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUYXJnZXREcmFrZSgwKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUYXJnZXREcmFrZSgxKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJicmVlZC1idXR0b24tYW5kLWdvYWwtZmVlZGJhY2tcIj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiYnJlZWQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQnJlZWR9XG4gICAgICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17c3VwcHJlc3NCdXR0b25Gb2N1c0hpZ2hsaWdodH1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtzdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0fSA+XG4gICAgICAgICAgICBCcmVlZFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxHZW5pQmxvY2tzLkZlZWRiYWNrVmlldyBpZD1cImdvYWwtZmVlZGJhY2tcIiBjbGFzc05hbWU9XCJmZWVkYmFjay12aWV3XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYEdPQUwgaXMgJHtyZXF1aXJlZE1vdmVDb3VudH0gTU9WRVNgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgWW91ciBtb3ZlczogJHttb3ZlQ291bnR9YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxHZW5pQmxvY2tzLlBlblN0YXRzVmlldyBpZD1cImJyZWVkaW5nLXBlblwiIG9yZ3M9e2NsdXRjaH0gbGFzdENsdXRjaFNpemU9e2NsdXRjaFNpemV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleD17dGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdGVkT3JnYW5pc21WaWV3PXtEcmFnT3JnYW5pc21HbG93Vmlld31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZT17dGhpcy5oYW5kbGVTZWxlY3Rpb25DaGFuZ2V9Lz5cbiAgICAgICAgPGRpdiBpZD1cImFsZXJ0LXdyYXBwZXJcIj5cbiAgICAgICAgICA8aDMgaWQ9XCJhbGVydC10aXRsZVwiPjwvaDM+XG4gICAgICAgICAgPGRpdiBpZD1cImFsZXJ0LW1lc3NhZ2VcIj48L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiYWxlcnQtdHJ5LWJ1dHRvblwiPlRyeSBBZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJhbGVydC1vay1idXR0b25cIj5PSzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbmNvbnN0IENhc2UzQ2VudGVyID0gRHJhZ0Ryb3BDb250ZXh0KERyYWdEcm9wQmFja2VuZCkoX0Nhc2UzQ2VudGVyKTtcblxuLyoqXG4gKiBDYXNlIDMgY29tYmluZXMgbGVmdCBjb2x1bW4gKG1vdGhlciBkcmFrZSksIGNlbnRlciBjb2x1bW4gKHRhcmdldCBkcmFrZXMsIGJyZWVkIGJ1dHRvbixcbiAqIGJyZWVkaW5nIHBlbiksIGFuZCByaWdodCBjb2x1bW4gKGZhdGhlciBkcmFrZSkuXG4gKi9cbmNsYXNzIENhc2UzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoYWxsZW5nZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBwYXJlbnREcmFrZXM6IFtdLFxuICAgIHRhcmdldFBhcmVudERyYWtlOiBudWxsLFxuICAgIHRhcmdldERyYWtlczogW10sXG4gICAgY2x1dGNoOiBbXSxcbiAgICByZXF1aXJlZE1vdmVDb3VudDogMCxcbiAgICBtb3ZlQ291bnQ6IDAsXG4gICAgdGFyZ2V0c01hdGNoZWQ6IG51bGxcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCA9ICgpID0+IHtcbiAgICBjb25zdCB7IHRhcmdldERyYWtlQ291bnQsIGZpeGVkUGFyZW50U2V4LCBlZGl0YWJsZVBhcmVudFNleCB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2U7XG4gICAgbGV0IHBhcmVudERyYWtlcyA9IFtdLFxuICAgICAgICB0YXJnZXRQYXJlbnREcmFrZSxcbiAgICAgICAgdGFyZ2V0RHJha2VzID0gW10sXG4gICAgICAgIHRhcmdldHNNYXRjaGVkID0gbmV3IFNldCxcbiAgICAgICAgY2x1dGNoID0gW10sXG4gICAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gMCxcbiAgICAgICAgbW92ZUNvdW50ID0gMDtcbiAgICAvLyByZWdlbmVyYXRlIGlmIHdlIGdlbmVyYXRlIGRyYWtlcyB0aGF0IGFyZSB0b28gY2xvc2UgdG8vZmFyIGZyb20gZWFjaCBvdGhlclxuICAgIHdoaWxlICgocmVxdWlyZWRNb3ZlQ291bnQgPCA0KSB8fCAocmVxdWlyZWRNb3ZlQ291bnQgPiA4KSkge1xuICAgICAgcGFyZW50RHJha2VzID0gW107XG4gICAgICBmb3IgKGxldCBzZXggPSBNQUxFOyBzZXggPD0gRkVNQUxFOyArK3NleCkge1xuICAgICAgICBwYXJlbnREcmFrZXMucHVzaChuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBvcmdhbmlzbUFsbGVsZXMsIHNleCkpO1xuICAgICAgfVxuICAgICAgdGFyZ2V0UGFyZW50RHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBvcmdhbmlzbUFsbGVsZXMsIGVkaXRhYmxlUGFyZW50U2V4KTtcbiAgICAgIGNvbnN0IHRhcmdldE1vdGhlciA9IGZpeGVkUGFyZW50U2V4ID09PSBGRU1BTEUgPyBwYXJlbnREcmFrZXNbRkVNQUxFXSA6IHRhcmdldFBhcmVudERyYWtlLFxuICAgICAgICAgICAgdGFyZ2V0RmF0aGVyID0gZml4ZWRQYXJlbnRTZXggPT09IE1BTEUgPyBwYXJlbnREcmFrZXNbTUFMRV0gOiB0YXJnZXRQYXJlbnREcmFrZTtcbiAgICAgIHRhcmdldERyYWtlcyA9IFtdO1xuICAgICAgcmVxdWlyZWRNb3ZlQ291bnQgPSAwO1xuICAgICAgZm9yIChsZXQgaT0wOyBpPHRhcmdldERyYWtlQ291bnQ7ICsraSkge1xuICAgICAgICB0YXJnZXREcmFrZXMucHVzaChCaW9Mb2dpY2EuYnJlZWQodGFyZ2V0TW90aGVyLCB0YXJnZXRGYXRoZXIpKTtcbiAgICAgICAgLy8gV2UncmUgYXBwcm94aW1hdGluZyB0aGUgY29tYmluZWQgcmVxdWlyZWQgbW92ZSBjb3VudCBmcm9tIHRoZSBtb3ZlcyByZXF1aXJlZCB0b1xuICAgICAgICAvLyByZWFjaCBlYWNoIHRhcmdldCBvZmZzcHJpbmcgaW5kZXBlbmRlbnRseS4gRXZlbnR1YWxseSwgbmVlZCBhIGJldHRlciBtZWFucyBvZlxuICAgICAgICAvLyBkZXRlcm1pbmluZyB0aGUgbW92ZXMgcmVxdWlyZWQgdG8gcmVhY2ggYSBzaW5nbGUgcGFyZW50IHRoYXQgY2FuIHByb2R1Y2UgYWxsXG4gICAgICAgIC8vIG9mIHRoZSBuZWNlc3NhcnkgdGFyZ2V0IG9mZnNwcmluZy5cbiAgICAgICAgcmVxdWlyZWRNb3ZlQ291bnQgPSBNYXRoLm1heChyZXF1aXJlZE1vdmVDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlck9mQnJlZWRpbmdNb3Zlc1RvUmVhY2hEcmFrZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudERyYWtlc1tNQUxFXSwgcGFyZW50RHJha2VzW0ZFTUFMRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0YWJsZVBhcmVudFNleCA9PT0gTUFMRSA/IGNoYW5nZWFibGVBbGxlbGVzIDogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0YWJsZVBhcmVudFNleCA9PT0gRkVNQUxFID8gY2hhbmdlYWJsZUFsbGVsZXMgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERyYWtlc1tpXSkpO1xuICAgICAgfVxuICAgICAgLy8gYWRkIG9uZSBmb3IgZHJhZ2dpbmcgYW4gb2Zmc3ByaW5nIHRvIGVhY2ggdGFyZ2V0IGRyYWtlXG4gICAgICByZXF1aXJlZE1vdmVDb3VudCArPSB0YXJnZXREcmFrZUNvdW50O1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgcGFyZW50RHJha2VzLCB0YXJnZXRQYXJlbnREcmFrZSwgdGFyZ2V0RHJha2VzLCB0YXJnZXRzTWF0Y2hlZCxcbiAgICAgICAgICAgICAgICAgICAgY2x1dGNoLCByZXF1aXJlZE1vdmVDb3VudCwgbW92ZUNvdW50IH0pO1xuICB9XG5cbiAgaGFuZGxlQWxsZWxlQ2hhbmdlID0gKHNleCwgY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSkgPT4ge1xuICAgIGxldCBwYXJlbnREcmFrZXMgPSB0aGlzLnN0YXRlLnBhcmVudERyYWtlcy5zbGljZSgpLFxuICAgICAgICBkcmFrZSA9IHBhcmVudERyYWtlc1tzZXhdO1xuICAgIGRyYWtlLmdlbmV0aWNzLmdlbm90eXBlLnJlcGxhY2VBbGxlbGVDaHJvbU5hbWUoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgZHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBkcmFrZS5nZXRBbGxlbGVTdHJpbmcoKSwgZHJha2Uuc2V4KTtcbiAgICBwYXJlbnREcmFrZXNbc2V4XSA9IGRyYWtlO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYXJlbnREcmFrZXMsIGNsdXRjaDogW10sIG1vdmVDb3VudDogKyt0aGlzLnN0YXRlLm1vdmVDb3VudCB9KTtcbiAgfVxuXG4gIGhhbmRsZUJyZWVkID0gKCkgPT4ge1xuICAgIGxldCB7IHBhcmVudERyYWtlcyB9ID0gdGhpcy5zdGF0ZSxcbiAgICAgICAgY2x1dGNoID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbHV0Y2hTaXplOyArK2kpIHtcbiAgICAgIGNsdXRjaC5wdXNoKEJpb0xvZ2ljYS5icmVlZChwYXJlbnREcmFrZXNbRkVNQUxFXSwgcGFyZW50RHJha2VzW01BTEVdKSk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBjbHV0Y2ggfSk7XG4gIH1cblxuICBoYW5kbGVEcm9wID0gKGRyYWdJdGVtLCBkcm9wVGFyZ2V0KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1vdmVDb3VudDogKyt0aGlzLnN0YXRlLm1vdmVDb3VudCB9KTtcblxuICAgIGlmICgwID09PSBHZW5pQmxvY2tzLkdlbmV0aWNzVXRpbHMubnVtYmVyT2ZDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShkcmFnSXRlbS5vcmcsIGRyb3BUYXJnZXQub3JnKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7IHRhcmdldHNNYXRjaGVkOiBuZXcgU2V0KHN0YXRlLnRhcmdldHNNYXRjaGVkKS5hZGQoZHJvcFRhcmdldC5pZCkgfSkpO1xuICAgICAgaWYgKHRoaXMuc3RhdGUudGFyZ2V0c01hdGNoZWQuc2l6ZSA+PSB0aGlzLnN0YXRlLnRhcmdldERyYWtlcy5sZW5ndGgpIHtcbiAgICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICB0aXRsZTogXCJHb29kIFdvcmshXCIsXG4gICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgb2tCdXR0b246IGNoYWxsZW5nZSA8IG1heENoYWxsZW5nZSA/IFwiTmV4dCBDaGFsbGVuZ2VcIiA6IFwiQ2FzZSBMb2dcIixcbiAgICAgICAgICBva0NhbGxiYWNrOiBuZXh0Q2hhbGxlbmdlLFxuICAgICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIixcbiAgICAgICAgICB0cnlDYWxsYmFjazogdGhpcy5yZXNldFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzaG93QWxlcnQodHJ1ZSwge1xuICAgICAgICAgIHRpdGxlOiBcIkdvb2QgV29yayFcIixcbiAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIG1hdGNoZXMgdGhlIHRhcmdldCBkcmFrZS5cIixcbiAgICAgICAgICBva0J1dHRvbjogXCJPS1wiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgIHRpdGxlOiBcIlRoYXQncyBub3QgdGhlIGRyYWtlIVwiLFxuICAgICAgICBtZXNzYWdlOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIGRvZXNuJ3QgbWF0Y2ggdGhlIHRhcmdldCBkcmFrZS5cXG5QbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICB0cnlCdXR0b246IFwiVHJ5IEFnYWluXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGVkaXRhYmxlUGFyZW50U2V4IH0gPSB0aGlzLnByb3BzLmNoYWxsZW5nZSxcbiAgICAgICAgICB7IHBhcmVudERyYWtlcywgdGFyZ2V0RHJha2VzLCB0YXJnZXRzTWF0Y2hlZCxcbiAgICAgICAgICAgIGNsdXRjaCwgcmVxdWlyZWRNb3ZlQ291bnQsIG1vdmVDb3VudCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGhhbmRsZU1vdGhlckFsbGVsZUNoYW5nZSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIHRoaXMuaGFuZGxlQWxsZWxlQ2hhbmdlKEZFTUFMRSwgLi4uYXJncyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgY29uc3QgaGFuZGxlRmF0aGVyQWxsZWxlQ2hhbmdlID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgdGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2UoTUFMRSwgLi4uYXJncyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJjaGFsbGVuZ2VzLXdyYXBwZXJcIj5cbiAgICAgICAgPERyYWtlR2Vub21lQ29sdW1uXG4gICAgICAgICAgICAgIGlkPSdsZWZ0JyBpZFByZWZpeD0nZmVtYWxlJyBzZXg9J2ZlbWFsZSdcbiAgICAgICAgICAgICAgY29sdW1uTGFiZWw9XCJGZW1hbGUgRHJha2VcIlxuICAgICAgICAgICAgICBkcmFrZT17cGFyZW50RHJha2VzW0ZFTUFMRV19XG4gICAgICAgICAgICAgIGVkaXRhYmxlPXtlZGl0YWJsZVBhcmVudFNleCA9PT0gRkVNQUxFfVxuICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17aGFuZGxlTW90aGVyQWxsZWxlQ2hhbmdlfSAvPlxuICAgICAgICA8Q2FzZTNDZW50ZXJcbiAgICAgICAgICAgICAgdGFyZ2V0RHJha2VzPXt0YXJnZXREcmFrZXN9IHRhcmdldERyYWtlU2l6ZT17dGFyZ2V0RHJha2VTaXplfVxuICAgICAgICAgICAgICB0YXJnZXRzTWF0Y2hlZD17dGFyZ2V0c01hdGNoZWR9XG4gICAgICAgICAgICAgIGdsb3dDb2xvcj17Z2xvd0NvbG9yfSBtYXRjaGVkQ29sb3I9e21hdGNoZWRDb2xvcn1cbiAgICAgICAgICAgICAgY2x1dGNoPXtjbHV0Y2h9IGNsdXRjaFNpemU9e2NsdXRjaFNpemV9XG4gICAgICAgICAgICAgIG9uQnJlZWQ9e3RoaXMuaGFuZGxlQnJlZWR9XG4gICAgICAgICAgICAgIG9uRHJvcD17dGhpcy5oYW5kbGVEcm9wfVxuICAgICAgICAgICAgICByZXF1aXJlZE1vdmVDb3VudD17cmVxdWlyZWRNb3ZlQ291bnR9IG1vdmVDb3VudD17bW92ZUNvdW50fSAvPlxuICAgICAgICA8RHJha2VHZW5vbWVDb2x1bW5cbiAgICAgICAgICAgICAgaWQ9J3JpZ2h0JyBpZFByZWZpeD0nbWFsZScgc2V4PSdtYWxlJ1xuICAgICAgICAgICAgICBjb2x1bW5MYWJlbD1cIk1hbGUgRHJha2VcIlxuICAgICAgICAgICAgICBkcmFrZT17cGFyZW50RHJha2VzW01BTEVdfVxuICAgICAgICAgICAgICBlZGl0YWJsZT17ZWRpdGFibGVQYXJlbnRTZXggPT09IE1BTEV9XG4gICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtoYW5kbGVGYXRoZXJBbGxlbGVDaGFuZ2V9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2FzZTMsIHsgY2hhbGxlbmdlOiBjaGFsbGVuZ2VTcGVjc1tjaGFsbGVuZ2VdIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwcGVyJylcbiAgKTtcbn1cblxuZnVuY3Rpb24gbmV4dENoYWxsZW5nZSgpIHtcbiAgbGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgbmV4dFVybDtcbiAgaWYgKGNoYWxsZW5nZSA8IG1heENoYWxsZW5nZSkge1xuICAgIC8vIGFkdmFuY2UgdG8gbmV4dCBjaGFsbGVuZ2VcbiAgICBuZXh0VXJsID0gdXJsLnJlcGxhY2UoYGNoYWxsZW5nZT0ke2NoYWxsZW5nZX1gLCBgY2hhbGxlbmdlPSR7Y2hhbGxlbmdlKzF9YCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gYmFjayB0byBjYXNlIGxvZ1xuICAgIGNvbnN0IGNhc2UzSW5kZXggPSB1cmwuaW5kZXhPZignY2FzZS0zJyk7XG4gICAgbmV4dFVybCA9IHVybC5zdWJzdHIoMCwgY2FzZTNJbmRleCk7XG4gIH1cbiAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXh0VXJsKTtcbn1cblxubGV0IGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVycyA9IHt9O1xuZnVuY3Rpb24gc2hvd0FsZXJ0KGlTaG93LCBpT3B0aW9ucykge1xuICBjb25zdCBkaXNwbGF5TW9kZSA9IGlTaG93ID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgb2tCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW9rLWJ1dHRvblwiKSxcbiAgICAgICAgdHJ5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10cnktYnV0dG9uXCIpO1xuICBpZiAoaVNob3cpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXRpdGxlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLnRpdGxlIHx8IFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1tZXNzYWdlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLm1lc3NhZ2UgfHwgXCJcIjtcbiAgICBva0J1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy5va0J1dHRvbiB8fCBcIlwiO1xuICAgIG9rQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy5va0J1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgb2tCdXR0b24uZGF0YXNldC5va0NhbGxiYWNrID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCAnJztcbiAgICBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbb2tCdXR0b24uaWRdID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCBudWxsO1xuICAgIHRyeUJ1dHRvbi5pbm5lckhUTUwgPSBpT3B0aW9ucy50cnlCdXR0b24gfHwgXCJcIjtcbiAgICB0cnlCdXR0b24uc3R5bGUuZGlzcGxheSA9IGlPcHRpb25zLnRyeUJ1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgYWxlcnRDbGllbnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBpT3B0aW9ucy50cnlDYWxsYmFjayB8fCBudWxsO1xuICAgIG9rQnV0dG9uLm9uY2xpY2sgPSBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcjtcbiAgICB0cnlCdXR0b24ub25jbGljayA9IGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyO1xuICB9XG4gIGVsc2Uge1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1tva0J1dHRvbi5pZF0gPSBudWxsO1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1t0cnlCdXR0b24uaWRdID0gbnVsbDtcbiAgfVxuICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtd3JhcHBlclwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG59XG5cbmZ1bmN0aW9uIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyKGV2dCkge1xuICBjb25zdCBjbGllbnRDbGlja0hhbmRsZXIgPSBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbZXZ0LnRhcmdldC5pZF07XG4gIHNob3dBbGVydChmYWxzZSk7XG4gIGlmIChjbGllbnRDbGlja0hhbmRsZXIpXG4gICAgY2xpZW50Q2xpY2tIYW5kbGVyKCk7XG4gIHJlbmRlcigpO1xufVxuXG4vLyBwcmV2ZW50IGV4dHJhbmVvdXMgZm9jdXMgaGlnaGxpZ2h0IG9uIGNsaWNrIHdoaWxlIG1haW50YWluaW5nIGtleWJvYXJkIGFjY2Vzc2liaWxpdHlcbi8vIHNlZSBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG5mdW5jdGlvbiBzdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0KGV2dCkge1xuICBjb25zdCBub0ZvY3VzSGlnaGxpZ2h0ID0gJ25vLWZvY3VzLWhpZ2hsaWdodCc7XG4gIGlmIChldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKG5vRm9jdXNIaWdobGlnaHQpIDwgMClcbiAgICBldnQudGFyZ2V0LmNsYXNzTmFtZSArPSAnICcgKyBub0ZvY3VzSGlnaGxpZ2h0O1xufVxuXG5mdW5jdGlvbiBlbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpIHtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyZWVkLWJ1dHRvbicpO1xuICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTU5NTEvY2hhbmdlLWFuLWVsZW1lbnRzLWNsYXNzLXdpdGgtamF2YXNjcmlwdFxuICBpZiAoYnV0dG9uICYmIGJ1dHRvbi5jbGFzc05hbWUpXG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9IGJ1dHRvbi5jbGFzc05hbWUucmVwbGFjZSgvKD86XnxcXHMpbm8tZm9jdXMtaGlnaGxpZ2h0KD8hXFxTKS9nICwgJycpO1xufVxuXG5HZW5pQmxvY2tzLkJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpO1xuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
