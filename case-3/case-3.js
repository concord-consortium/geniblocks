'use strict';

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
      queries = undefined,
      tmp = undefined,
      i = undefined,
      l = undefined;

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
  handleDrop: React.PropTypes.func.isRequired
};

var DropOrganismGlowView = ReactDnD.DropTarget('organism', { // drop target specification
  canDrop: function canDrop(props) {
    return !props.isMatched;
  },
  drop: function drop(props, monitor) {
    var org = props.org;
    var id = props.id;
    var dropTarget = { org: org, id: id };
    if (props.handleDrop) props.handleDrop(monitor.getItem(), dropTarget);
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
 * ParentDrakeColumn - shows mother/father image and genome
 */

var ParentDrakeColumn = function (_React$Component) {
  _inherits(ParentDrakeColumn, _React$Component);

  function ParentDrakeColumn() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, ParentDrakeColumn);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ParentDrakeColumn)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.render = function () {
      var _this$props = _this.props;
      var id = _this$props.id;
      var sex = _this$props.sex;
      var drake = _this$props.drake;
      var isDrakeEditable = _this$props.isDrakeEditable;
      var hiddenAlleles = _this$props.hiddenAlleles;
      var alleleChanged = _this$props.alleleChanged;
      var drakeLabelID = sex + '-drake-label';
      var columnLabel = sex.charAt(0).toUpperCase() + sex.slice(1) + ' Drake';
      var drakeOrgID = sex + '-drake';
      return React.createElement(
        'div',
        { id: id, className: 'column' },
        React.createElement(
          'div',
          { id: drakeLabelID, className: 'column-label' },
          columnLabel
        ),
        React.createElement(GeniBlocks.OrganismGlowView, {
          id: drakeOrgID, className: 'parent-drake', org: drake, color: '#FFFFAA', size: 200 }),
        React.createElement(GeniBlocks.GenomeView, {
          className: 'parent-genome', org: drake, hiddenAlleles: hiddenAlleles,
          editable: isDrakeEditable, alleleChanged: alleleChanged })
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return ParentDrakeColumn;
}(React.Component);

/**
 * Center panel has target drakes, breedng pen, breed button, etc.
 */


ParentDrakeColumn.propTypes = {
  id: React.PropTypes.string.isRequired,
  sex: React.PropTypes.string.isRequired,
  drake: React.PropTypes.object.isRequired,
  isDrakeEditable: React.PropTypes.bool.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  alleleChanged: React.PropTypes.func.isRequired
};

var _Case3Center = function (_React$Component2) {
  _inherits(_Case3Center, _React$Component2);

  function _Case3Center(props) {
    _classCallCheck(this, _Case3Center);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(_Case3Center).call(this, props));

    _this2.state = {
      selectedIndex: null
    };

    _this2.breed = function () {
      _this2.setState({ selectedIndex: null });
      if (_this2.props.handleBreed) _this2.props.handleBreed();
    };

    _this2.renderTargetDrake = function (index) {
      var _this2$props = _this2.props;
      var targetDrakes = _this2$props.targetDrakes;
      var targetsMatched = _this2$props.targetsMatched;
      var targetDrakeSize = _this2$props.targetDrakeSize;
      var glowColor = _this2$props.glowColor;
      var matchedColor = _this2$props.matchedColor;
      var handleDrop = _this2$props.handleDrop;
      var id = 'target-drake-' + index;
      var isMatched = targetsMatched.has(id);
      var color = isMatched ? matchedColor : glowColor;
      return index < targetDrakes.length ? React.createElement(DropOrganismGlowView, {
        id: id, className: 'small-drake-image',
        org: targetDrakes[index], size: targetDrakeSize,
        color: color, dropColor: dropGlowColor,
        isMatched: isMatched, handleDrop: handleDrop }) : null;
    };

    _this2.render = function () {
      var _this2$props2 = _this2.props;
      var targetDrakes = _this2$props2.targetDrakes;
      var clutch = _this2$props2.clutch;
      var clutchSize = _this2$props2.clutchSize;
      var requiredMoveCount = _this2$props2.requiredMoveCount;
      var moveCount = _this2$props2.moveCount;
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
          _this2.renderTargetDrake(0),
          _this2.renderTargetDrake(1)
        ),
        React.createElement(
          'div',
          { id: 'breed-button-and-goal-feedback' },
          React.createElement(
            'button',
            { id: 'breed-button',
              onClick: function onClick() {
                return _this2.breed();
              },
              onMouseOver: suppressButtonFocusHighlight,
              onMouseDown: suppressButtonFocusHighlight },
            'Breed'
          ),
          React.createElement(GeniBlocks.FeedbackView, { id: 'goal-feedback', className: 'feedback-view',
            text: ['GOAL is ' + requiredMoveCount + ' MOVES', 'Your moves: ' + moveCount] })
        ),
        React.createElement(GeniBlocks.PenStatsView, { id: 'breeding-pen', orgs: clutch, lastClutchSize: clutchSize,
          selectedIndex: _this2.state.selectedIndex,
          SelectedOrganismView: DragOrganismGlowView,
          onSelectionChange: function onSelectionChange(iSelectedIndex) {
            _this2.setState({ selectedIndex: iSelectedIndex });
          } }),
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
    };

    document.addEventListener('keydown', function () {
      return enableButtonFocusHighlight();
    });
    return _this2;
  }

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
  handleBreed: React.PropTypes.func.isRequired,
  requiredMoveCount: React.PropTypes.number.isRequired,
  moveCount: React.PropTypes.number.isRequired,
  handleDrop: React.PropTypes.func.isRequired
};

var Case3Center = DragDropContext(DragDropBackend)(_Case3Center);

/**
 * Case 3 combines left column (mother drake), center column (target drakes, breed button,
 * breeding pen), and right column (father drake).
 */

var Case3 = function (_React$Component3) {
  _inherits(Case3, _React$Component3);

  function Case3() {
    var _Object$getPrototypeO2;

    var _temp2, _this3, _ret2;

    _classCallCheck(this, Case3);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Case3)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this3), _initialiseProps.call(_this3), _temp2), _possibleConstructorReturn(_this3, _ret2);
  }

  return Case3;
}(React.Component);

Case3.propTypes = {
  challenge: React.PropTypes.object.isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.state = {
    parentDrakes: [],
    targetParentDrake: null,
    targetDrakes: [],
    clutch: [],
    requiredMoveCount: 0,
    moveCount: 0,
    targetsMatched: null
  };

  this.componentWillMount = function () {
    _this4.reset();
  };

  this.reset = function () {
    var _props$challenge = _this4.props.challenge;
    var targetDrakeCount = _props$challenge.targetDrakeCount;
    var fixedParentSex = _props$challenge.fixedParentSex;
    var editableParentSex = _props$challenge.editableParentSex;

    var parentDrakes = [],
        targetParentDrake = undefined,
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
    _this4.setState({ parentDrakes: parentDrakes, targetParentDrake: targetParentDrake, targetDrakes: targetDrakes, targetsMatched: targetsMatched,
      clutch: clutch, requiredMoveCount: requiredMoveCount, moveCount: moveCount });
  };

  this.alleleChanged = function (sex, chrom, side, prevAllele, newAllele) {
    var parentDrakes = _this4.state.parentDrakes.slice(),
        drake = parentDrakes[sex];
    drake.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
    parentDrakes[sex] = drake;
    _this4.setState({ parentDrakes: parentDrakes, clutch: [], moveCount: ++_this4.state.moveCount });
  };

  this.breed = function () {
    var parentDrakes = _this4.state.parentDrakes;
    var clutch = [];
    for (var i = 0; i < clutchSize; ++i) {
      clutch.push(BioLogica.breed(parentDrakes[FEMALE], parentDrakes[MALE]));
    }
    _this4.setState({ clutch: clutch });
  };

  this.handleDrop = function (dragItem, dropTarget) {
    _this4.setState({ moveCount: ++_this4.state.moveCount });

    if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(dragItem.org, dropTarget.org)) {
      _this4.setState(function (state) {
        return { targetsMatched: new Set(state.targetsMatched).add(dropTarget.id) };
      });
      if (_this4.state.targetsMatched.size >= _this4.state.targetDrakes.length) {
        showAlert(true, {
          title: "Good Work!",
          message: "The drake you have created matches the target drake.",
          okButton: challenge < maxChallenge ? "Next Challenge" : "Case Log",
          okCallback: nextChallenge,
          tryButton: "Try Again",
          tryCallback: function tryCallback() {
            return _this4.reset();
          }
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
  };

  this.render = function () {
    var editableParentSex = _this4.props.challenge.editableParentSex;
    var _state = _this4.state;
    var parentDrakes = _state.parentDrakes;
    var targetDrakes = _state.targetDrakes;
    var targetsMatched = _state.targetsMatched;
    var clutch = _state.clutch;
    var requiredMoveCount = _state.requiredMoveCount;
    var moveCount = _state.moveCount;

    return React.createElement(
      'div',
      { id: 'challenges-wrapper' },
      React.createElement(ParentDrakeColumn, {
        id: 'left', sex: 'female',
        drake: parentDrakes[FEMALE],
        isDrakeEditable: editableParentSex === FEMALE,
        hiddenAlleles: hiddenAlleles,
        alleleChanged: function alleleChanged() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return _this4.alleleChanged.apply(_this4, [FEMALE].concat(args));
        } }),
      React.createElement(Case3Center, {
        targetDrakes: targetDrakes, targetDrakeSize: targetDrakeSize,
        targetsMatched: targetsMatched,
        glowColor: glowColor, matchedColor: matchedColor,
        clutch: clutch, clutchSize: clutchSize,
        handleBreed: function handleBreed() {
          return _this4.breed();
        },
        handleDrop: function handleDrop() {
          return _this4.handleDrop.apply(_this4, arguments);
        },
        requiredMoveCount: requiredMoveCount, moveCount: moveCount }),
      React.createElement(ParentDrakeColumn, {
        id: 'right', sex: 'male',
        drake: parentDrakes[MALE],
        isDrakeEditable: editableParentSex === MALE,
        hiddenAlleles: hiddenAlleles,
        alleleChanged: function alleleChanged() {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return _this4.alleleChanged.apply(_this4, [MALE].concat(args));
        } })
    );
  };
};

function render() {
  ReactDOM.render(React.createElement(Case3, { challenge: challengeSpecs[challenge] }), document.getElementById('wrapper'));
}

function nextChallenge() {
  var url = window.location.href,
      nextUrl = undefined;
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

render();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2UtMy9jYXNlLTMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSxJQUFNLE9BQU8sQ0FBUDtJQUNBLFNBQVMsQ0FBVDtJQUNBLGVBQWUsQ0FBZjtJQUNBLGVBQWUsQ0FBZjtJQUNBLGlCQUFpQjtBQUNmLE9BQUs7QUFDSCxzQkFBa0IsQ0FBbEI7QUFDQSxvQkFBZ0IsSUFBaEI7QUFDQSx1QkFBbUIsTUFBbkI7R0FIRjtBQUtBLE9BQUs7QUFDSCxzQkFBa0IsQ0FBbEI7QUFDQSxvQkFBZ0IsTUFBaEI7QUFDQSx1QkFBbUIsSUFBbkI7R0FIRjtDQU5GO0lBWUEsa0JBQWtCLHVFQUFsQjtJQUNBLGdCQUFnQixDQUFDLEdBQUQsRUFBSyxJQUFMLEVBQVUsR0FBVixFQUFjLEdBQWQsRUFBa0IsR0FBbEIsRUFBc0IsR0FBdEIsRUFBMEIsR0FBMUIsRUFBOEIsS0FBOUIsRUFBb0MsSUFBcEMsQ0FBaEI7SUFDQSxvQkFBb0IsQ0FBQyxHQUFELEVBQUssR0FBTCxFQUFTLElBQVQsRUFBYyxJQUFkLENBQXBCO0lBQ0EsWUFBWSxTQUFaO0lBQ0EsZ0JBQWdCLFNBQWhCO0lBQ0EsZUFBZSxTQUFmO0lBQ0Esa0JBQWtCLEdBQWxCO0lBQ0EsYUFBYSxFQUFiOztBQUVOLFNBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUM7QUFDbkMsTUFBSSxTQUFTLEVBQVQ7TUFBYSxtQkFBakI7TUFBMEIsZUFBMUI7TUFBK0IsYUFBL0I7TUFBa0MsYUFBbEM7OztBQURtQyxTQUluQyxHQUFVLFlBQVksS0FBWixDQUFrQixHQUFsQixDQUFWOzs7QUFKbUMsT0FPN0IsSUFBSSxDQUFKLEVBQU8sSUFBSSxRQUFRLE1BQVIsRUFBZ0IsSUFBSSxDQUFKLEVBQU8sR0FBeEMsRUFBOEM7QUFDMUMsVUFBTSxRQUFRLENBQVIsRUFBVyxLQUFYLENBQWlCLEdBQWpCLENBQU4sQ0FEMEM7QUFFMUMsV0FBTyxJQUFJLENBQUosQ0FBUCxJQUFpQixJQUFJLENBQUosQ0FBakIsQ0FGMEM7R0FBOUM7O0FBS0EsU0FBTyxNQUFQLENBWm1DO0NBQXZDOzs7QUFnQkEsSUFBTSxZQUFZLGlCQUFpQixNQUFDLENBQU8sUUFBUCxDQUFnQixNQUFoQixDQUF3QixTQUF6QixDQUFtQyxDQUFuQyxDQUFqQixDQUFaO0lBQ0EsaUJBQWlCLFVBQVUsU0FBVixJQUF1QixPQUFPLFVBQVUsU0FBVixDQUE5QjtJQUNqQixZQUFZLGNBQUMsSUFBa0IsWUFBbEIsSUFBb0Msa0JBQWtCLFlBQWxCLEdBQWtDLGNBQXZFLEdBQXdGLENBQXhGOzs7QUFHbEIsSUFBTSxrQkFBa0IsU0FBUyxlQUFUO0lBQ2xCLGtCQUFrQixvQkFBbEI7Ozs7O0FBS04sSUFBTSx3QkFBd0IsU0FBeEIscUJBQXdCLE9BQW9DO01BQWxDLDJDQUFrQzs7TUFBWiwrREFBWTs7QUFDaEUsU0FBTyxrQkFDTDs7O0lBQ0Usb0JBQUMsV0FBVyxrQkFBWixhQUErQixnQkFBZ0IsV0FBVyxZQUFYLElBQTZCLE9BQTVFLENBREY7R0FESyxDQUFQLENBRGdFO0NBQXBDOztBQVE5QixzQkFBc0IsU0FBdEIsR0FBa0M7QUFDaEMsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUCxRQUFNLE1BQU0sU0FBTixDQUFnQixNQUFoQjtBQUNOLHFCQUFtQixNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7QUFDbkIsY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7Q0FKZDs7QUFPQSxJQUFNLHVCQUF1QixTQUFTLFVBQVQsQ0FDSCxVQURHLEVBRUg7QUFDRSxhQUFXLG1CQUFTLEtBQVQsRUFBZ0I7UUFDakIsTUFBbUIsTUFBbkIsSUFEaUI7UUFDWixLQUFjLE1BQWQsR0FEWTtRQUNSLFFBQVUsTUFBVixNQURROztBQUV6QixXQUFPLEVBQUUsUUFBRixFQUFPLE1BQVAsRUFBVyxZQUFYLEVBQVAsQ0FGeUI7R0FBaEI7Q0FIVjs7QUFTSCxVQUFTLE9BQVQsRUFBa0IsT0FBbEIsRUFBMkI7QUFDekIsU0FBTztBQUNMLHVCQUFtQixRQUFRLFVBQVIsRUFBbkI7QUFDQSxnQkFBWSxRQUFRLFVBQVIsRUFBWjtHQUZGLENBRHlCO0NBQTNCLENBVEcsQ0FlSCxxQkFmRyxDQUF2Qjs7Ozs7QUFvQk4sSUFBTSx3QkFBd0IsU0FBeEIscUJBQXdCLFFBQXVFO01BQXJFLG9CQUFxRTtNQUE5RCw0QkFBOEQ7TUFBbkQsNENBQW1EO01BQWhDLHNCQUFnQztNQUF4Qix3QkFBd0I7O01BQVosMkdBQVk7O0FBQ25HLE1BQU0sWUFBWSxVQUFVLE9BQVYsR0FBb0IsU0FBcEIsR0FBZ0MsS0FBaEMsQ0FEaUY7QUFFbkcsU0FBTyxrQkFDTDs7O0lBQ0Usb0JBQUMsV0FBVyxrQkFBWixhQUErQixPQUFPLFNBQVAsRUFBa0IsZ0JBQWdCLFdBQVcsWUFBWCxJQUE2QixPQUE5RixDQURGO0dBREssQ0FBUCxDQUZtRztDQUF2RTs7QUFTOUIsc0JBQXNCLFNBQXRCLEdBQWtDO0FBQ2hDLFNBQU8sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ1AsYUFBVyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDWCxxQkFBbUIsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0FBQ25CLFVBQVEsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0FBQ1IsV0FBUyxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7QUFDVCxjQUFZLE1BQU0sU0FBTixDQUFnQixJQUFoQixDQUFxQixVQUFyQjtDQU5kOztBQVNBLElBQU0sdUJBQXVCLFNBQVMsVUFBVCxDQUNILFVBREcsRUFFSDtBQUNFLFdBQVMsaUJBQVMsS0FBVCxFQUFnQjtBQUN2QixXQUFPLENBQUMsTUFBTSxTQUFOLENBRGU7R0FBaEI7QUFHVCxRQUFNLGNBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QjtRQUNyQixNQUFZLE1BQVosSUFEcUI7QUFDdkIsUUFBTyxLQUFPLE1BQVAsRUFBUCxDQUR1QjtBQUV2QixxQkFBYSxFQUFFLFFBQUYsRUFBTyxNQUFQLEVBQWIsQ0FGdUI7QUFHN0IsUUFBSSxNQUFNLFVBQU4sRUFDRixNQUFNLFVBQU4sQ0FBaUIsUUFBUSxPQUFSLEVBQWpCLEVBQW9DLFVBQXBDLEVBREY7R0FISTtDQU5MOztBQWNILFVBQVMsT0FBVCxFQUFrQixPQUFsQixFQUEyQjtBQUN6QixTQUFPO0FBQ0wsdUJBQW1CLFFBQVEsVUFBUixFQUFuQjtBQUNBLFlBQVEsUUFBUSxNQUFSLEVBQVI7QUFDQSxhQUFTLFFBQVEsT0FBUixFQUFUO0dBSEYsQ0FEeUI7Q0FBM0IsQ0FkRyxDQXFCSCxxQkFyQkcsQ0FBdkI7Ozs7OztJQTBCQTs7Ozs7Ozs7Ozs7Ozs7K01BV0osU0FBUyxZQUFNO3dCQUM2RCxNQUFLLEtBQUwsQ0FEN0Q7VUFDTCxvQkFESztVQUNELHNCQURDO1VBQ0ksMEJBREo7VUFDVyw4Q0FEWDtVQUM0QiwwQ0FENUI7QUFDUCxVQUFrRCx5Q0FBbEQsQ0FETztBQUVQLHlCQUFrQixvQkFBbEIsQ0FGTztBQUdQLHdCQUFpQixJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsV0FBZCxLQUE4QixJQUFJLEtBQUosQ0FBVSxDQUFWLENBQTlCLFdBQWpCLENBSE87QUFJUCx1QkFBZ0IsY0FBaEIsQ0FKTztBQUtiLGFBQ0U7O1VBQUssSUFBSSxFQUFKLEVBQVEsV0FBVSxRQUFWLEVBQWI7UUFHRTs7WUFBSyxJQUFJLFlBQUosRUFBa0IsV0FBVSxjQUFWLEVBQXZCO1VBQWlELFdBQWpEO1NBSEY7UUFNRSxvQkFBQyxXQUFXLGdCQUFaO0FBQ0UsY0FBSSxVQUFKLEVBQWdCLFdBQVUsY0FBVixFQUF5QixLQUFLLEtBQUwsRUFBWSxPQUFNLFNBQU4sRUFBZ0IsTUFBTSxHQUFOLEVBRHZFLENBTkY7UUFVRSxvQkFBQyxXQUFXLFVBQVo7QUFDRSxxQkFBVSxlQUFWLEVBQTBCLEtBQUssS0FBTCxFQUFZLGVBQWUsYUFBZjtBQUN0QyxvQkFBVSxlQUFWLEVBQTJCLGVBQWUsYUFBZixFQUY3QixDQVZGO09BREYsQ0FMYTtLQUFOOzs7U0FYTDtFQUEwQixNQUFNLFNBQU47Ozs7Ozs7QUFBMUIsa0JBRUcsWUFBWTtBQUNqQixNQUFJLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNKLE9BQUssTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ0wsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDUCxtQkFBaUIsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBQXJCO0FBQ2pCLGlCQUFlLE1BQU0sU0FBTixDQUFnQixPQUFoQixDQUF3QixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdkM7QUFDQSxpQkFBZSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7OztJQThCYjs7O0FBb0JKLFdBcEJJLFlBb0JKLENBQVksS0FBWixFQUFtQjswQkFwQmYsY0FvQmU7O3dFQXBCZix5QkFxQkksUUFEVzs7V0FKbkIsUUFBUTtBQUNOLHFCQUFlLElBQWY7TUFHaUI7O1dBS25CLFFBQVEsWUFBTTtBQUNaLGFBQUssUUFBTCxDQUFjLEVBQUUsZUFBZSxJQUFmLEVBQWhCLEVBRFk7QUFFWixVQUFJLE9BQUssS0FBTCxDQUFXLFdBQVgsRUFDRixPQUFLLEtBQUwsQ0FBVyxXQUFYLEdBREY7S0FGTSxDQUxXOztXQVduQixvQkFBb0IsVUFBQyxLQUFELEVBQVc7eUJBRW1CLE9BQUssS0FBTCxDQUZuQjtVQUNyQix5Q0FEcUI7VUFDUCw2Q0FETztVQUNTLCtDQURUO1VBRXJCLG1DQUZxQjtVQUVWLHlDQUZVO0FBQ3ZCLFVBQzJCLG9DQUQzQixDQUR1QjtBQUd2QixpQ0FBcUIsS0FBckIsQ0FIdUI7QUFJdkIsc0JBQVksZUFBZSxHQUFmLENBQW1CLEVBQW5CLENBQVosQ0FKdUI7QUFLdkIsa0JBQVEsWUFBWSxZQUFaLEdBQTJCLFNBQTNCLENBTGU7QUFNN0IsYUFBTyxRQUFRLGFBQWEsTUFBYixHQUNMLG9CQUFDLG9CQUFEO0FBQ0UsWUFBSSxFQUFKLEVBQVEsV0FBVSxtQkFBVjtBQUNSLGFBQUssYUFBYSxLQUFiLENBQUwsRUFBMEIsTUFBTSxlQUFOO0FBQzFCLGVBQU8sS0FBUCxFQUFjLFdBQVcsYUFBWDtBQUNkLG1CQUFXLFNBQVgsRUFBc0IsWUFBWSxVQUFaLEVBSnhCLENBREgsR0FNRyxJQU5ILENBTnNCO0tBQVgsQ0FYRDs7V0EwQm5CLFNBQVMsWUFBTTswQkFDOEQsT0FBSyxLQUFMLENBRDlEO1VBQ0wsMENBREs7VUFDUyw4QkFEVDtVQUNpQixzQ0FEakI7VUFDNkIsb0RBRDdCO0FBQ1AsVUFBdUQsbUNBQXZELENBRE87QUFFUCw2QkFBbUIsYUFBYSxNQUFiLENBRlo7QUFHUCw4QkFBb0IscUJBQXFCLENBQXJCLEdBQXlCLGNBQXpCLEdBQTBDLGVBQTFDLENBSGI7QUFJYixhQUNFOztVQUFLLElBQUcsUUFBSCxFQUFZLFdBQVUsUUFBVixFQUFqQjtRQUNFOztZQUFLLElBQUcscUJBQUgsRUFBeUIsV0FBVSxjQUFWLEVBQTlCO1VBQXdELGlCQUF4RDtTQURGO1FBRUU7O1lBQUssSUFBRyxlQUFILEVBQUw7VUFDRyxPQUFLLGlCQUFMLENBQXVCLENBQXZCLENBREg7VUFFRyxPQUFLLGlCQUFMLENBQXVCLENBQXZCLENBRkg7U0FGRjtRQU1FOztZQUFLLElBQUcsZ0NBQUgsRUFBTDtVQUNFOztjQUFRLElBQUcsY0FBSDtBQUNBLHVCQUFTO3VCQUFNLE9BQUssS0FBTDtlQUFOO0FBQ1QsMkJBQWEsNEJBQWI7QUFDQSwyQkFBYSw0QkFBYixFQUhSOztXQURGO1VBT0Usb0JBQUMsV0FBVyxZQUFaLElBQXlCLElBQUcsZUFBSCxFQUFtQixXQUFVLGVBQVY7QUFDbEIsa0JBQU0sY0FDTyw0QkFEUCxtQkFFVyxTQUZYLENBQU4sRUFEMUIsQ0FQRjtTQU5GO1FBbUJFLG9CQUFDLFdBQVcsWUFBWixJQUF5QixJQUFHLGNBQUgsRUFBa0IsTUFBTSxNQUFOLEVBQWMsZ0JBQWdCLFVBQWhCO0FBQy9CLHlCQUFlLE9BQUssS0FBTCxDQUFXLGFBQVg7QUFDZixnQ0FBc0Isb0JBQXRCO0FBQ0EsNkJBQW1CLDJCQUFDLGNBQUQsRUFBb0I7QUFDckMsbUJBQUssUUFBTCxDQUFjLEVBQUUsZUFBZSxjQUFmLEVBQWhCLEVBRHFDO1dBQXBCLEVBSDdDLENBbkJGO1FBeUJFOztZQUFLLElBQUcsZUFBSCxFQUFMO1VBQ0UsNEJBQUksSUFBRyxhQUFILEVBQUosQ0FERjtVQUVFLDZCQUFLLElBQUcsZUFBSCxFQUFMLENBRkY7VUFHRTs7Y0FBUSxJQUFHLGtCQUFILEVBQVI7O1dBSEY7VUFJRTs7Y0FBUSxJQUFHLGlCQUFILEVBQVI7O1dBSkY7U0F6QkY7T0FERixDQUphO0tBQU4sQ0ExQlU7O0FBRWpCLGFBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUM7YUFBTTtLQUFOLENBQXJDLENBRmlCOztHQUFuQjs7U0FwQkk7RUFBcUIsTUFBTSxTQUFOOztBQUFyQixhQUVHLFlBQVk7QUFDakIsZ0JBQWMsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF4QixDQUFnRCxVQUFoRDtBQUNkLGtCQUFnQixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7QUFDaEIsbUJBQWlCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNqQixhQUFXLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNYLGdCQUFjLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQUF2QjtBQUNkLFVBQVEsTUFBTSxTQUFOLENBQWdCLE9BQWhCLENBQXdCLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF4QixDQUFnRCxVQUFoRDtBQUNSLGNBQVksTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ1osZUFBYSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7QUFDYixxQkFBbUIsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ25CLGFBQVcsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCO0FBQ1gsY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckI7OztBQXlFaEIsSUFBTSxjQUFjLGdCQUFnQixlQUFoQixFQUFpQyxZQUFqQyxDQUFkOzs7Ozs7O0lBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFjLE1BQU0sU0FBTjs7QUFBZCxNQUVHLFlBQVk7QUFDakIsYUFBVyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkI7Ozs7OztPQUdiLFFBQVE7QUFDTixrQkFBYyxFQUFkO0FBQ0EsdUJBQW1CLElBQW5CO0FBQ0Esa0JBQWMsRUFBZDtBQUNBLFlBQVEsRUFBUjtBQUNBLHVCQUFtQixDQUFuQjtBQUNBLGVBQVcsQ0FBWDtBQUNBLG9CQUFnQixJQUFoQjs7O09BR0YscUJBQXFCLFlBQU07QUFDekIsV0FBSyxLQUFMLEdBRHlCO0dBQU47O09BSXJCLFFBQVEsWUFBTTsyQkFDb0QsT0FBSyxLQUFMLENBQVcsU0FBWCxDQURwRDtRQUNKLHFEQURJO1FBQ2MsaURBRGQ7UUFDOEIsdURBRDlCOztBQUVaLFFBQUksZUFBZSxFQUFmO1FBQ0EsNkJBREo7UUFFSSxlQUFlLEVBQWY7UUFDQSxpQkFBaUIsSUFBSSxHQUFKLEVBQWpCO1FBQ0EsU0FBUyxFQUFUO1FBQ0Esb0JBQW9CLENBQXBCO1FBQ0EsWUFBWSxDQUFaOztBQVJRLFdBVUwsaUJBQUMsR0FBb0IsQ0FBcEIsSUFBMkIsb0JBQW9CLENBQXBCLEVBQXdCO0FBQ3pELHFCQUFlLEVBQWYsQ0FEeUQ7QUFFekQsV0FBSyxJQUFJLE1BQU0sSUFBTixFQUFZLE9BQU8sTUFBUCxFQUFlLEVBQUUsR0FBRixFQUFPO0FBQ3pDLHFCQUFhLElBQWIsQ0FBa0IsSUFBSSxVQUFVLFFBQVYsQ0FBbUIsVUFBVSxPQUFWLENBQWtCLEtBQWxCLEVBQXlCLGVBQWhELEVBQWlFLEdBQWpFLENBQWxCLEVBRHlDO09BQTNDO0FBR0EsMEJBQW9CLElBQUksVUFBVSxRQUFWLENBQW1CLFVBQVUsT0FBVixDQUFrQixLQUFsQixFQUF5QixlQUFoRCxFQUFpRSxpQkFBakUsQ0FBcEIsQ0FMeUQ7QUFNekQsVUFBTSxlQUFlLG1CQUFtQixNQUFuQixHQUE0QixhQUFhLE1BQWIsQ0FBNUIsR0FBbUQsaUJBQW5EO1VBQ2YsZUFBZSxtQkFBbUIsSUFBbkIsR0FBMEIsYUFBYSxJQUFiLENBQTFCLEdBQStDLGlCQUEvQyxDQVBvQztBQVF6RCxxQkFBZSxFQUFmLENBUnlEO0FBU3pELDBCQUFvQixDQUFwQixDQVR5RDtBQVV6RCxXQUFLLElBQUksSUFBRSxDQUFGLEVBQUssSUFBRSxnQkFBRixFQUFvQixFQUFFLENBQUYsRUFBSztBQUNyQyxxQkFBYSxJQUFiLENBQWtCLFVBQVUsS0FBVixDQUFnQixZQUFoQixFQUE4QixZQUE5QixDQUFsQjs7Ozs7QUFEcUMseUJBTXJDLEdBQW9CLEtBQUssR0FBTCxDQUFTLGlCQUFULEVBQ1UsV0FBVyxhQUFYLENBQ0UsaUNBREYsQ0FFSSxhQUFhLElBQWIsQ0FGSixFQUV3QixhQUFhLE1BQWIsQ0FGeEIsRUFHSSxzQkFBc0IsSUFBdEIsR0FBNkIsaUJBQTdCLEdBQWlELEVBQWpELEVBQ0Esc0JBQXNCLE1BQXRCLEdBQStCLGlCQUEvQixHQUFtRCxFQUFuRCxFQUNBLGFBQWEsQ0FBYixDQUxKLENBRFYsQ0FBcEIsQ0FOcUM7T0FBdkM7O0FBVnlELHVCQXlCekQsSUFBcUIsZ0JBQXJCLENBekJ5RDtLQUEzRDtBQTJCQSxXQUFLLFFBQUwsQ0FBYyxFQUFFLDBCQUFGLEVBQWdCLG9DQUFoQixFQUFtQywwQkFBbkMsRUFBaUQsOEJBQWpEO0FBQ0Usb0JBREYsRUFDVSxvQ0FEVixFQUM2QixvQkFEN0IsRUFBZCxFQXJDWTtHQUFOOztPQXlDUixnQkFBZ0IsVUFBQyxHQUFELEVBQU0sS0FBTixFQUFhLElBQWIsRUFBbUIsVUFBbkIsRUFBK0IsU0FBL0IsRUFBNkM7QUFDM0QsUUFBSSxlQUFlLE9BQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsS0FBeEIsRUFBZjtRQUNBLFFBQVEsYUFBYSxHQUFiLENBQVIsQ0FGdUQ7QUFHM0QsVUFBTSxRQUFOLENBQWUsUUFBZixDQUF3QixXQUF4QixDQUFvQyxLQUFwQyxFQUEyQyxJQUEzQyxFQUFpRCxPQUFqRCxDQUF5RCxZQUF6RCxDQUFzRSxVQUF0RSxFQUFrRixTQUFsRixFQUgyRDtBQUkzRCxZQUFRLElBQUksVUFBVSxRQUFWLENBQW1CLFVBQVUsT0FBVixDQUFrQixLQUFsQixFQUF5QixNQUFNLGVBQU4sRUFBaEQsRUFBeUUsTUFBTSxHQUFOLENBQWpGLENBSjJEO0FBSzNELGlCQUFhLEdBQWIsSUFBb0IsS0FBcEIsQ0FMMkQ7QUFNM0QsV0FBSyxRQUFMLENBQWMsRUFBRSwwQkFBRixFQUFnQixRQUFRLEVBQVIsRUFBWSxXQUFXLEVBQUUsT0FBSyxLQUFMLENBQVcsU0FBWCxFQUF2RCxFQU4yRDtHQUE3Qzs7T0FTaEIsUUFBUSxZQUFNO0FBQ1IsUUFBRSxlQUFpQixPQUFLLEtBQUwsQ0FBakIsWUFBRixDQURRO0FBRVIsaUJBQVMsRUFBVCxDQUZRO0FBR1osU0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksVUFBSixFQUFnQixFQUFFLENBQUYsRUFBSztBQUNuQyxhQUFPLElBQVAsQ0FBWSxVQUFVLEtBQVYsQ0FBZ0IsYUFBYSxNQUFiLENBQWhCLEVBQXNDLGFBQWEsSUFBYixDQUF0QyxDQUFaLEVBRG1DO0tBQXJDO0FBR0EsV0FBSyxRQUFMLENBQWMsRUFBRSxjQUFGLEVBQWQsRUFOWTtHQUFOOztPQVNSLGFBQWEsVUFBQyxRQUFELEVBQVcsVUFBWCxFQUEwQjtBQUNyQyxXQUFLLFFBQUwsQ0FBYyxFQUFFLFdBQVcsRUFBRSxPQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQTdCLEVBRHFDOztBQUdyQyxRQUFJLE1BQU0sV0FBVyxhQUFYLENBQXlCLCtCQUF6QixDQUF5RCxTQUFTLEdBQVQsRUFBYyxXQUFXLEdBQVgsQ0FBN0UsRUFBOEY7QUFDaEcsYUFBSyxRQUFMLENBQWMsVUFBQyxLQUFEO2VBQVksRUFBRSxnQkFBZ0IsSUFBSSxHQUFKLENBQVEsTUFBTSxjQUFOLENBQVIsQ0FBOEIsR0FBOUIsQ0FBa0MsV0FBVyxFQUFYLENBQWxEO09BQWQsQ0FBZCxDQURnRztBQUVoRyxVQUFJLE9BQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsSUFBa0MsT0FBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixNQUF4QixFQUFnQztBQUNwRSxrQkFBVSxJQUFWLEVBQWdCO0FBQ2QsaUJBQU8sWUFBUDtBQUNBLG1CQUFTLHNEQUFUO0FBQ0Esb0JBQVUsWUFBWSxZQUFaLEdBQTJCLGdCQUEzQixHQUE4QyxVQUE5QztBQUNWLHNCQUFZLGFBQVo7QUFDQSxxQkFBVyxXQUFYO0FBQ0EsdUJBQWE7bUJBQU0sT0FBSyxLQUFMO1dBQU47U0FOZixFQURvRTtPQUF0RSxNQVVLO0FBQ0gsa0JBQVUsSUFBVixFQUFnQjtBQUNkLGlCQUFPLFlBQVA7QUFDQSxtQkFBUyxzREFBVDtBQUNBLG9CQUFVLElBQVY7U0FIRixFQURHO09BVkw7S0FGRixNQW9CSztBQUNILGdCQUFVLElBQVYsRUFBZ0I7QUFDZCxlQUFPLHVCQUFQO0FBQ0EsaUJBQVMsK0VBQVQ7QUFDQSxtQkFBVyxXQUFYO09BSEYsRUFERztLQXBCTDtHQUhXOztPQWdDYixTQUFTLFlBQU07QUFDUCxRQUFFLG9CQUFzQixPQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXRCLGlCQUFGLENBRE87aUJBR29DLE9BQUssS0FBTCxDQUhwQztRQUVMLG1DQUZLO1FBRVMsbUNBRlQ7UUFFdUIsdUNBRnZCO1FBR0wsdUJBSEs7UUFHRyw2Q0FISDtRQUdzQiw2QkFIdEI7O0FBSWIsV0FDRTs7UUFBSyxJQUFHLG9CQUFILEVBQUw7TUFDRSxvQkFBQyxpQkFBRDtBQUNNLFlBQUcsTUFBSCxFQUFVLEtBQUksUUFBSjtBQUNWLGVBQU8sYUFBYSxNQUFiLENBQVA7QUFDQSx5QkFBaUIsc0JBQXNCLE1BQXRCO0FBQ2pCLHVCQUFlLGFBQWY7QUFDQSx1QkFBZTs2Q0FBSTs7OztpQkFBUyxPQUFLLGFBQUwsZ0JBQW1CLGVBQVcsS0FBOUI7U0FBYixFQUxyQixDQURGO01BT0Usb0JBQUMsV0FBRDtBQUNNLHNCQUFjLFlBQWQsRUFBNEIsaUJBQWlCLGVBQWpCO0FBQzVCLHdCQUFnQixjQUFoQjtBQUNBLG1CQUFXLFNBQVgsRUFBc0IsY0FBYyxZQUFkO0FBQ3RCLGdCQUFRLE1BQVIsRUFBZ0IsWUFBWSxVQUFaO0FBQ2hCLHFCQUFhO2lCQUFNLE9BQUssS0FBTDtTQUFOO0FBQ2Isb0JBQVk7aUJBQWEsT0FBSyxVQUFMO1NBQWI7QUFDWiwyQkFBbUIsaUJBQW5CLEVBQXNDLFdBQVcsU0FBWCxFQVA1QyxDQVBGO01BZUUsb0JBQUMsaUJBQUQ7QUFDTSxZQUFHLE9BQUgsRUFBVyxLQUFJLE1BQUo7QUFDWCxlQUFPLGFBQWEsSUFBYixDQUFQO0FBQ0EseUJBQWlCLHNCQUFzQixJQUF0QjtBQUNqQix1QkFBZSxhQUFmO0FBQ0EsdUJBQWU7NkNBQUk7Ozs7aUJBQVMsT0FBSyxhQUFMLGdCQUFtQixhQUFTLEtBQTVCO1NBQWIsRUFMckIsQ0FmRjtLQURGLENBSmE7R0FBTjs7O0FBK0JYLFNBQVMsTUFBVCxHQUFrQjtBQUNoQixXQUFTLE1BQVQsQ0FDRSxNQUFNLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsRUFBRSxXQUFXLGVBQWUsU0FBZixDQUFYLEVBQTdCLENBREYsRUFFRSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FGRixFQURnQjtDQUFsQjs7QUFPQSxTQUFTLGFBQVQsR0FBeUI7QUFDdkIsTUFBSSxNQUFNLE9BQU8sUUFBUCxDQUFnQixJQUFoQjtNQUNOLG1CQURKLENBRHVCO0FBR3ZCLE1BQUksWUFBWSxZQUFaLEVBQTBCOztBQUU1QixjQUFVLElBQUksT0FBSixnQkFBeUIsU0FBekIsa0JBQW1ELFlBQVUsQ0FBVixDQUFuRCxDQUFWLENBRjRCO0dBQTlCLE1BSUs7O0FBRUgsUUFBTSxhQUFhLElBQUksT0FBSixDQUFZLFFBQVosQ0FBYixDQUZIO0FBR0gsY0FBVSxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsVUFBZCxDQUFWLENBSEc7R0FKTDtBQVNBLFNBQU8sUUFBUCxDQUFnQixNQUFoQixDQUF1QixPQUF2QixFQVp1QjtDQUF6Qjs7QUFlQSxJQUFJLGlDQUFpQyxFQUFqQztBQUNKLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixRQUExQixFQUFvQztBQUNsQyxNQUFNLGNBQWMsUUFBUSxPQUFSLEdBQWtCLE1BQWxCO01BQ2QsV0FBVyxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLENBQVg7TUFDQSxZQUFZLFNBQVMsY0FBVCxDQUF3QixrQkFBeEIsQ0FBWixDQUg0QjtBQUlsQyxNQUFJLEtBQUosRUFBVztBQUNULGFBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxHQUFtRCxTQUFTLEtBQVQsSUFBa0IsRUFBbEIsQ0FEMUM7QUFFVCxhQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsR0FBcUQsU0FBUyxPQUFULElBQW9CLEVBQXBCLENBRjVDO0FBR1QsYUFBUyxTQUFULEdBQXFCLFNBQVMsUUFBVCxJQUFxQixFQUFyQixDQUhaO0FBSVQsYUFBUyxLQUFULENBQWUsT0FBZixHQUF5QixTQUFTLFFBQVQsR0FBb0IsT0FBcEIsR0FBOEIsTUFBOUIsQ0FKaEI7QUFLVCxhQUFTLE9BQVQsQ0FBaUIsVUFBakIsR0FBOEIsU0FBUyxVQUFULElBQXVCLEVBQXZCLENBTHJCO0FBTVQsbUNBQStCLFNBQVMsRUFBVCxDQUEvQixHQUE4QyxTQUFTLFVBQVQsSUFBdUIsSUFBdkIsQ0FOckM7QUFPVCxjQUFVLFNBQVYsR0FBc0IsU0FBUyxTQUFULElBQXNCLEVBQXRCLENBUGI7QUFRVCxjQUFVLEtBQVYsQ0FBZ0IsT0FBaEIsR0FBMEIsU0FBUyxTQUFULEdBQXFCLE9BQXJCLEdBQStCLE1BQS9CLENBUmpCO0FBU1QsbUNBQStCLFVBQVUsRUFBVixDQUEvQixHQUErQyxTQUFTLFdBQVQsSUFBd0IsSUFBeEIsQ0FUdEM7QUFVVCxhQUFTLE9BQVQsR0FBbUIsdUJBQW5CLENBVlM7QUFXVCxjQUFVLE9BQVYsR0FBb0IsdUJBQXBCLENBWFM7R0FBWCxNQWFLO0FBQ0gsbUNBQStCLFNBQVMsRUFBVCxDQUEvQixHQUE4QyxJQUE5QyxDQURHO0FBRUgsbUNBQStCLFVBQVUsRUFBVixDQUEvQixHQUErQyxJQUEvQyxDQUZHO0dBYkw7O0FBSmtDLFVBc0JsQyxDQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsS0FBekMsQ0FBK0MsT0FBL0MsR0FBeUQsV0FBekQsQ0F0QmtDO0NBQXBDOztBQXlCQSxTQUFTLHVCQUFULENBQWlDLEdBQWpDLEVBQXNDO0FBQ3BDLE1BQU0scUJBQXFCLCtCQUErQixJQUFJLE1BQUosQ0FBVyxFQUFYLENBQXBELENBRDhCO0FBRXBDLFlBQVUsS0FBVixFQUZvQztBQUdwQyxNQUFJLGtCQUFKLEVBQ0UscUJBREY7QUFFQSxXQUxvQztDQUF0Qzs7OztBQVVBLFNBQVMsNEJBQVQsQ0FBc0MsR0FBdEMsRUFBMkM7QUFDekMsTUFBTSxtQkFBbUIsb0JBQW5CLENBRG1DO0FBRXpDLE1BQUksSUFBSSxNQUFKLENBQVcsU0FBWCxDQUFxQixPQUFyQixDQUE2QixnQkFBN0IsSUFBaUQsQ0FBakQsRUFDRixJQUFJLE1BQUosQ0FBVyxTQUFYLElBQXdCLE1BQU0sZ0JBQU4sQ0FEMUI7Q0FGRjs7QUFNQSxTQUFTLDBCQUFULEdBQXNDO0FBQ3BDLE1BQU0sU0FBUyxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBVDs7QUFEOEIsTUFHaEMsVUFBVSxPQUFPLFNBQVAsRUFDWixPQUFPLFNBQVAsR0FBbUIsT0FBTyxTQUFQLENBQWlCLE9BQWpCLENBQXlCLG1DQUF6QixFQUErRCxFQUEvRCxDQUFuQixDQURGO0NBSEY7O0FBT0EiLCJmaWxlIjoiY2FzZS0zL2Nhc2UtMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2FzZSAzIENoYWxsZW5nZXNcbiAqXG4gKiBUaGUgY29kZSBpbiB0aGlzIG1vZHVsZSB3YXMgd3JpdHRlbiB0byBzdXBwb3J0IGEgcmVjcmVhdGlvbiBvZiB0aGUgY2hhbGxlbmdlc1xuICogZnJvbSBDYXNlIDMgaW4gR2VuaXZlcnNlLiBUaGUgY2hhbGxlbmdlcyBhcmU6XG4gKiAgQ2hhbGxlbmdlIDE6IE1vZGlmeSBtb3RoZXIgZHJha2Ugc28gYXMgdG8gYnJlZWQgYSBwYXJ0aWN1bGFyIHRhcmdldCBkcmFrZVxuICogIENoYWxsZW5nZSAyOiBNb2RpZnkgZmF0aGVyIGRyYWtlIHNvIGFzIHRvIGJyZWVkIGEgcGFpciBvZiB0YXJnZXQgZHJha2VzXG4gKi9cbmNvbnN0IE1BTEUgPSAwLFxuICAgICAgRkVNQUxFID0gMSxcbiAgICAgIG1pbkNoYWxsZW5nZSA9IDEsXG4gICAgICBtYXhDaGFsbGVuZ2UgPSAyLFxuICAgICAgY2hhbGxlbmdlU3BlY3MgPSB7XG4gICAgICAgICcxJzogeyAgLy8gQ2hhbGxlbmdlIDE6IGZlbWFsZSBpcyBlZGl0YWJsZSwgbWFsZSBpcyBmaXhlZCwgb25lIHRhcmdldCBkcmFrZVxuICAgICAgICAgIHRhcmdldERyYWtlQ291bnQ6IDEsXG4gICAgICAgICAgZml4ZWRQYXJlbnRTZXg6IE1BTEUsXG4gICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXg6IEZFTUFMRVxuICAgICAgICB9LFxuICAgICAgICAnMic6IHsgIC8vIENoYWxsZW5nZSAyOiBtYWxlIGlzIGVkaXRhYmxlLCBmZW1hbGUgaXMgZml4ZWQsIHR3byB0YXJnZXQgZHJha2VzXG4gICAgICAgICAgdGFyZ2V0RHJha2VDb3VudDogMixcbiAgICAgICAgICBmaXhlZFBhcmVudFNleDogRkVNQUxFLFxuICAgICAgICAgIGVkaXRhYmxlUGFyZW50U2V4OiBNQUxFXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcmdhbmlzbUFsbGVsZXMgPSBcImE6aCxiOmgsYTpDLGI6QyxhOmEsYjphLGE6QixiOkIsYTpELGI6RCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLFxuICAgICAgaGlkZGVuQWxsZWxlcyA9IFsndCcsJ3RrJywnaCcsJ2MnLCdhJywnYicsJ2QnLCdib2cnLCdyaCddLFxuICAgICAgY2hhbmdlYWJsZUFsbGVsZXMgPSBbJ20nLCd3JywnZmwnLCdobCddLFxuICAgICAgZ2xvd0NvbG9yID0gJyNGRkZGQUEnLFxuICAgICAgZHJvcEdsb3dDb2xvciA9ICcjRkZGRjAwJyxcbiAgICAgIG1hdGNoZWRDb2xvciA9ICcjODhGRjg4JyxcbiAgICAgIHRhcmdldERyYWtlU2l6ZSA9IDE1MCxcbiAgICAgIGNsdXRjaFNpemUgPSAyMDtcblxuZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZykge1xuICAgIGxldCBwYXJhbXMgPSB7fSwgcXVlcmllcywgdG1wLCBpLCBsO1xuXG4gICAgLy8gU3BsaXQgaW50byBrZXkvdmFsdWUgcGFpcnNcbiAgICBxdWVyaWVzID0gcXVlcnlTdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgIC8vIENvbnZlcnQgdGhlIGFycmF5IG9mIHN0cmluZ3MgaW50byBhbiBvYmplY3RcbiAgICBmb3IgKCBpID0gMCwgbCA9IHF1ZXJpZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICB0bXAgPSBxdWVyaWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgIHBhcmFtc1t0bXBbMF1dID0gdG1wWzFdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG59XG5cbi8vIFVSTCBwYXJhbSBpcyB1c2VkIHRvIGNob29zZSBjaGFsbGVuZ2VcbmNvbnN0IHVybFBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcoKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLnN1YnN0cmluZygxKSksXG4gICAgICBjaGFsbGVuZ2VQYXJhbSA9IHVybFBhcmFtcy5jaGFsbGVuZ2UgJiYgTnVtYmVyKHVybFBhcmFtcy5jaGFsbGVuZ2UpLFxuICAgICAgY2hhbGxlbmdlID0gKGNoYWxsZW5nZVBhcmFtID49IG1pbkNoYWxsZW5nZSkgJiYgKGNoYWxsZW5nZVBhcmFtIDw9IG1heENoYWxsZW5nZSkgPyBjaGFsbGVuZ2VQYXJhbSA6IDE7XG5cbiAvKiBnbG9iYWwgUmVhY3REbkQsIFJlYWN0RG5ESFRNTDVCYWNrZW5kICovXG5jb25zdCBEcmFnRHJvcENvbnRleHQgPSBSZWFjdERuRC5EcmFnRHJvcENvbnRleHQsXG4gICAgICBEcmFnRHJvcEJhY2tlbmQgPSBSZWFjdERuREhUTUw1QmFja2VuZDtcblxuLyoqXG4gKiBEcmFnT3JnYW5pc21HbG93VmlldyAtIFJlYWN0RG5ELkRyYWdTb3VyY2UgZm9yIGRyYWdnaW5nIG9yZ2FuaXNtIGZyb20gYnJlZWRpbmcgcGVuLlxuICovXG5jb25zdCBfRHJhZ09yZ2FuaXNtR2xvd1ZpZXcgPSAoe2Nvbm5lY3REcmFnU291cmNlLCAuLi5vdGhlcnN9KSA9PiB7XG4gIHJldHVybiBjb25uZWN0RHJhZ1NvdXJjZShcbiAgICA8ZGl2PlxuICAgICAgPEdlbmlCbG9ja3MuR2xvd0JhY2tncm91bmRWaWV3IENoaWxkQ29tcG9uZW50PXtHZW5pQmxvY2tzLk9yZ2FuaXNtVmlld30gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbl9EcmFnT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gIGNvbm5lY3REcmFnU291cmNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0RyYWdnaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBEcmFnT3JnYW5pc21HbG93VmlldyA9IFJlYWN0RG5ELkRyYWdTb3VyY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdvcmdhbmlzbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgLy8gZHJhZyBzb3VyY2Ugc3BlY2lmaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlZ2luRHJhZzogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JnLCBpZCwgaW5kZXggfSA9IHByb3BzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgb3JnLCBpZCwgaW5kZXggfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbGxlY3RpbmcgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oY29ubmVjdCwgbW9uaXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0RHJhZ1NvdXJjZTogY29ubmVjdC5kcmFnU291cmNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RyYWdnaW5nOiBtb25pdG9yLmlzRHJhZ2dpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICkoX0RyYWdPcmdhbmlzbUdsb3dWaWV3KTtcblxuLyoqXG4gKiBEcm9wT3JnYW5pc21HbG93VmlldyAtIFJlYWN0RG5ELkRyb3BUYXJnZXQgZm9yIGFjY2VwdGluZyBkcm9wcyBvbiB0YXJnZXQgZHJha2VzLlxuICovXG5jb25zdCBfRHJvcE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2NvbG9yLCBkcm9wQ29sb3IsIGNvbm5lY3REcm9wVGFyZ2V0LCBpc092ZXIsIGNhbkRyb3AsIC4uLm90aGVyc30pID0+IHtcbiAgY29uc3QgZ2xvd0NvbG9yID0gaXNPdmVyICYmIGNhbkRyb3AgPyBkcm9wQ29sb3IgOiBjb2xvcjtcbiAgcmV0dXJuIGNvbm5lY3REcm9wVGFyZ2V0KFxuICAgIDxkaXY+XG4gICAgICA8R2VuaUJsb2Nrcy5HbG93QmFja2dyb3VuZFZpZXcgY29sb3I9e2dsb3dDb2xvcn0gQ2hpbGRDb21wb25lbnQ9e0dlbmlCbG9ja3MuT3JnYW5pc21WaWV3fSB7Li4ub3RoZXJzfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuX0Ryb3BPcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZHJvcENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbm5lY3REcm9wVGFyZ2V0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc092ZXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGNhbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gIGhhbmRsZURyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IERyb3BPcmdhbmlzbUdsb3dWaWV3ID0gUmVhY3REbkQuRHJvcFRhcmdldChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yZ2FuaXNtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyAvLyBkcm9wIHRhcmdldCBzcGVjaWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRHJvcDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhcHJvcHMuaXNNYXRjaGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcDogZnVuY3Rpb24ocHJvcHMsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JnLCBpZCB9ID0gcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wVGFyZ2V0ID0geyBvcmcsIGlkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMuaGFuZGxlRHJvcClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHMuaGFuZGxlRHJvcChtb25pdG9yLmdldEl0ZW0oKSwgZHJvcFRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xsZWN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGNvbm5lY3QsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdERyb3BUYXJnZXQ6IGNvbm5lY3QuZHJvcFRhcmdldCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPdmVyOiBtb25pdG9yLmlzT3ZlcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRHJvcDogbW9uaXRvci5jYW5Ecm9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApKF9Ecm9wT3JnYW5pc21HbG93Vmlldyk7XG5cbi8qKlxuICogUGFyZW50RHJha2VDb2x1bW4gLSBzaG93cyBtb3RoZXIvZmF0aGVyIGltYWdlIGFuZCBnZW5vbWVcbiAqL1xuY2xhc3MgUGFyZW50RHJha2VDb2x1bW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBzZXg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkcmFrZTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlzRHJha2VFZGl0YWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBhbGxlbGVDaGFuZ2VkOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH1cblxuICByZW5kZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBpZCwgc2V4LCBkcmFrZSwgaXNEcmFrZUVkaXRhYmxlLCBoaWRkZW5BbGxlbGVzLCBhbGxlbGVDaGFuZ2VkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGRyYWtlTGFiZWxJRCA9IGAke3NleH0tZHJha2UtbGFiZWxgLFxuICAgICAgICAgIGNvbHVtbkxhYmVsID0gYCR7c2V4LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc2V4LnNsaWNlKDEpfSBEcmFrZWAsXG4gICAgICAgICAgZHJha2VPcmdJRCA9IGAke3NleH0tZHJha2VgO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPVwiY29sdW1uXCI+XG5cbiAgICAgICAgey8qIHBhcmVudCBkcmFrZSBsYWJlbCAqL31cbiAgICAgICAgPGRpdiBpZD17ZHJha2VMYWJlbElEfSBjbGFzc05hbWU9XCJjb2x1bW4tbGFiZWxcIj57Y29sdW1uTGFiZWx9PC9kaXY+XG5cbiAgICAgICAgey8qIHBhcmVudCBkcmFrZSBpbWFnZSAqL31cbiAgICAgICAgPEdlbmlCbG9ja3MuT3JnYW5pc21HbG93Vmlld1xuICAgICAgICAgIGlkPXtkcmFrZU9yZ0lEfSBjbGFzc05hbWU9J3BhcmVudC1kcmFrZScgb3JnPXtkcmFrZX0gY29sb3I9JyNGRkZGQUEnIHNpemU9ezIwMH0gLz5cblxuICAgICAgICB7LyogcGFyZW50IGRyYWtlIGdlbm9tZSAqL31cbiAgICAgICAgPEdlbmlCbG9ja3MuR2Vub21lVmlld1xuICAgICAgICAgIGNsYXNzTmFtZT0ncGFyZW50LWdlbm9tZScgb3JnPXtkcmFrZX0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBlZGl0YWJsZT17aXNEcmFrZUVkaXRhYmxlfSBhbGxlbGVDaGFuZ2VkPXthbGxlbGVDaGFuZ2VkfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIENlbnRlciBwYW5lbCBoYXMgdGFyZ2V0IGRyYWtlcywgYnJlZWRuZyBwZW4sIGJyZWVkIGJ1dHRvbiwgZXRjLlxuICovXG5jbGFzcyBfQ2FzZTNDZW50ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGFyZ2V0RHJha2VzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIHRhcmdldHNNYXRjaGVkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdGFyZ2V0RHJha2VTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZ2xvd0NvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbWF0Y2hlZENvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2x1dGNoOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGNsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVCcmVlZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXF1aXJlZE1vdmVDb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG1vdmVDb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZURyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIHNlbGVjdGVkSW5kZXg6IG51bGxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBlbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpKTtcbiAgfVxuXG4gIGJyZWVkID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEluZGV4OiBudWxsIH0pO1xuICAgIGlmICh0aGlzLnByb3BzLmhhbmRsZUJyZWVkKVxuICAgICAgdGhpcy5wcm9wcy5oYW5kbGVCcmVlZCgpO1xuICB9XG5cbiAgcmVuZGVyVGFyZ2V0RHJha2UgPSAoaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IHRhcmdldERyYWtlcywgdGFyZ2V0c01hdGNoZWQsIHRhcmdldERyYWtlU2l6ZSxcbiAgICAgICAgICAgIGdsb3dDb2xvciwgbWF0Y2hlZENvbG9yLCBoYW5kbGVEcm9wIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGlkID0gYHRhcmdldC1kcmFrZS0ke2luZGV4fWAsXG4gICAgICAgICAgaXNNYXRjaGVkID0gdGFyZ2V0c01hdGNoZWQuaGFzKGlkKSxcbiAgICAgICAgICBjb2xvciA9IGlzTWF0Y2hlZCA/IG1hdGNoZWRDb2xvciA6IGdsb3dDb2xvcjtcbiAgICByZXR1cm4gaW5kZXggPCB0YXJnZXREcmFrZXMubGVuZ3RoXG4gICAgICAgICAgICA/IDxEcm9wT3JnYW5pc21HbG93Vmlld1xuICAgICAgICAgICAgICAgIGlkPXtpZH0gY2xhc3NOYW1lPVwic21hbGwtZHJha2UtaW1hZ2VcIlxuICAgICAgICAgICAgICAgIG9yZz17dGFyZ2V0RHJha2VzW2luZGV4XX0gc2l6ZT17dGFyZ2V0RHJha2VTaXplfVxuICAgICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn0gZHJvcENvbG9yPXtkcm9wR2xvd0NvbG9yfVxuICAgICAgICAgICAgICAgIGlzTWF0Y2hlZD17aXNNYXRjaGVkfSBoYW5kbGVEcm9wPXtoYW5kbGVEcm9wfSAvPlxuICAgICAgICAgICAgOiBudWxsO1xuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgdGFyZ2V0RHJha2VzLCBjbHV0Y2gsIGNsdXRjaFNpemUsIHJlcXVpcmVkTW92ZUNvdW50LCBtb3ZlQ291bnQgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgdGFyZ2V0RHJha2VDb3VudCA9IHRhcmdldERyYWtlcy5sZW5ndGgsXG4gICAgICAgICAgdGFyZ2V0RHJha2VzTGFiZWwgPSB0YXJnZXREcmFrZUNvdW50ID09PSAxID8gXCJUYXJnZXQgRHJha2VcIiA6IFwiVGFyZ2V0IERyYWtlc1wiO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwiY2VudGVyXCIgY2xhc3NOYW1lPVwiY29sdW1uXCI+XG4gICAgICAgIDxkaXYgaWQ9XCJ0YXJnZXQtZHJha2VzLWxhYmVsXCIgY2xhc3NOYW1lPVwiY29sdW1uLWxhYmVsXCI+e3RhcmdldERyYWtlc0xhYmVsfTwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwidGFyZ2V0LWRyYWtlc1wiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRhcmdldERyYWtlKDApfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclRhcmdldERyYWtlKDEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cImJyZWVkLWJ1dHRvbi1hbmQtZ29hbC1mZWVkYmFja1wiPlxuICAgICAgICAgIDxidXR0b24gaWQ9XCJicmVlZC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5icmVlZCgpIH1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXtzdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0fVxuICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e3N1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHR9ID5cbiAgICAgICAgICAgIEJyZWVkXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPEdlbmlCbG9ja3MuRmVlZGJhY2tWaWV3IGlkPVwiZ29hbC1mZWVkYmFja1wiIGNsYXNzTmFtZT1cImZlZWRiYWNrLXZpZXdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dD17W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgR09BTCBpcyAke3JlcXVpcmVkTW92ZUNvdW50fSBNT1ZFU2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBZb3VyIG1vdmVzOiAke21vdmVDb3VudH1gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEdlbmlCbG9ja3MuUGVuU3RhdHNWaWV3IGlkPVwiYnJlZWRpbmctcGVuXCIgb3Jncz17Y2x1dGNofSBsYXN0Q2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4PXt0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWRPcmdhbmlzbVZpZXc9e0RyYWdPcmdhbmlzbUdsb3dWaWV3fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlPXsoaVNlbGVjdGVkSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEluZGV4OiBpU2VsZWN0ZWRJbmRleCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fS8+XG4gICAgICAgIDxkaXYgaWQ9XCJhbGVydC13cmFwcGVyXCI+XG4gICAgICAgICAgPGgzIGlkPVwiYWxlcnQtdGl0bGVcIj48L2gzPlxuICAgICAgICAgIDxkaXYgaWQ9XCJhbGVydC1tZXNzYWdlXCI+PC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImFsZXJ0LXRyeS1idXR0b25cIj5UcnkgQWdhaW48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiYWxlcnQtb2stYnV0dG9uXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5jb25zdCBDYXNlM0NlbnRlciA9IERyYWdEcm9wQ29udGV4dChEcmFnRHJvcEJhY2tlbmQpKF9DYXNlM0NlbnRlcik7XG5cbi8qKlxuICogQ2FzZSAzIGNvbWJpbmVzIGxlZnQgY29sdW1uIChtb3RoZXIgZHJha2UpLCBjZW50ZXIgY29sdW1uICh0YXJnZXQgZHJha2VzLCBicmVlZCBidXR0b24sXG4gKiBicmVlZGluZyBwZW4pLCBhbmQgcmlnaHQgY29sdW1uIChmYXRoZXIgZHJha2UpLlxuICovXG5jbGFzcyBDYXNlMyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFsbGVuZ2U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgcGFyZW50RHJha2VzOiBbXSxcbiAgICB0YXJnZXRQYXJlbnREcmFrZTogbnVsbCxcbiAgICB0YXJnZXREcmFrZXM6IFtdLFxuICAgIGNsdXRjaDogW10sXG4gICAgcmVxdWlyZWRNb3ZlQ291bnQ6IDAsXG4gICAgbW92ZUNvdW50OiAwLFxuICAgIHRhcmdldHNNYXRjaGVkOiBudWxsXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgPSAoKSA9PiB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQgPSAoKSA9PiB7XG4gICAgY29uc3QgeyB0YXJnZXREcmFrZUNvdW50LCBmaXhlZFBhcmVudFNleCwgZWRpdGFibGVQYXJlbnRTZXggfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlO1xuICAgIGxldCBwYXJlbnREcmFrZXMgPSBbXSxcbiAgICAgICAgdGFyZ2V0UGFyZW50RHJha2UsXG4gICAgICAgIHRhcmdldERyYWtlcyA9IFtdLFxuICAgICAgICB0YXJnZXRzTWF0Y2hlZCA9IG5ldyBTZXQsXG4gICAgICAgIGNsdXRjaCA9IFtdLFxuICAgICAgICByZXF1aXJlZE1vdmVDb3VudCA9IDAsXG4gICAgICAgIG1vdmVDb3VudCA9IDA7XG4gICAgLy8gcmVnZW5lcmF0ZSBpZiB3ZSBnZW5lcmF0ZSBkcmFrZXMgdGhhdCBhcmUgdG9vIGNsb3NlIHRvL2ZhciBmcm9tIGVhY2ggb3RoZXJcbiAgICB3aGlsZSAoKHJlcXVpcmVkTW92ZUNvdW50IDwgNCkgfHwgKHJlcXVpcmVkTW92ZUNvdW50ID4gOCkpIHtcbiAgICAgIHBhcmVudERyYWtlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgc2V4ID0gTUFMRTsgc2V4IDw9IEZFTUFMRTsgKytzZXgpIHtcbiAgICAgICAgcGFyZW50RHJha2VzLnB1c2gobmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgb3JnYW5pc21BbGxlbGVzLCBzZXgpKTtcbiAgICAgIH1cbiAgICAgIHRhcmdldFBhcmVudERyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgb3JnYW5pc21BbGxlbGVzLCBlZGl0YWJsZVBhcmVudFNleCk7XG4gICAgICBjb25zdCB0YXJnZXRNb3RoZXIgPSBmaXhlZFBhcmVudFNleCA9PT0gRkVNQUxFID8gcGFyZW50RHJha2VzW0ZFTUFMRV0gOiB0YXJnZXRQYXJlbnREcmFrZSxcbiAgICAgICAgICAgIHRhcmdldEZhdGhlciA9IGZpeGVkUGFyZW50U2V4ID09PSBNQUxFID8gcGFyZW50RHJha2VzW01BTEVdIDogdGFyZ2V0UGFyZW50RHJha2U7XG4gICAgICB0YXJnZXREcmFrZXMgPSBbXTtcbiAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gMDtcbiAgICAgIGZvciAobGV0IGk9MDsgaTx0YXJnZXREcmFrZUNvdW50OyArK2kpIHtcbiAgICAgICAgdGFyZ2V0RHJha2VzLnB1c2goQmlvTG9naWNhLmJyZWVkKHRhcmdldE1vdGhlciwgdGFyZ2V0RmF0aGVyKSk7XG4gICAgICAgIC8vIFdlJ3JlIGFwcHJveGltYXRpbmcgdGhlIGNvbWJpbmVkIHJlcXVpcmVkIG1vdmUgY291bnQgZnJvbSB0aGUgbW92ZXMgcmVxdWlyZWQgdG9cbiAgICAgICAgLy8gcmVhY2ggZWFjaCB0YXJnZXQgb2Zmc3ByaW5nIGluZGVwZW5kZW50bHkuIEV2ZW50dWFsbHksIG5lZWQgYSBiZXR0ZXIgbWVhbnMgb2ZcbiAgICAgICAgLy8gZGV0ZXJtaW5pbmcgdGhlIG1vdmVzIHJlcXVpcmVkIHRvIHJlYWNoIGEgc2luZ2xlIHBhcmVudCB0aGF0IGNhbiBwcm9kdWNlIGFsbFxuICAgICAgICAvLyBvZiB0aGUgbmVjZXNzYXJ5IHRhcmdldCBvZmZzcHJpbmcuXG4gICAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gTWF0aC5tYXgocmVxdWlyZWRNb3ZlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkJyZWVkaW5nTW92ZXNUb1JlYWNoRHJha2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnREcmFrZXNbTUFMRV0sIHBhcmVudERyYWtlc1tGRU1BTEVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXggPT09IE1BTEUgPyBjaGFuZ2VhYmxlQWxsZWxlcyA6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXggPT09IEZFTUFMRSA/IGNoYW5nZWFibGVBbGxlbGVzIDogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREcmFrZXNbaV0pKTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCBvbmUgZm9yIGRyYWdnaW5nIGFuIG9mZnNwcmluZyB0byBlYWNoIHRhcmdldCBkcmFrZVxuICAgICAgcmVxdWlyZWRNb3ZlQ291bnQgKz0gdGFyZ2V0RHJha2VDb3VudDtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBhcmVudERyYWtlcywgdGFyZ2V0UGFyZW50RHJha2UsIHRhcmdldERyYWtlcywgdGFyZ2V0c01hdGNoZWQsXG4gICAgICAgICAgICAgICAgICAgIGNsdXRjaCwgcmVxdWlyZWRNb3ZlQ291bnQsIG1vdmVDb3VudCB9KTtcbiAgfVxuXG4gIGFsbGVsZUNoYW5nZWQgPSAoc2V4LCBjaHJvbSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKSA9PiB7XG4gICAgbGV0IHBhcmVudERyYWtlcyA9IHRoaXMuc3RhdGUucGFyZW50RHJha2VzLnNsaWNlKCksXG4gICAgICAgIGRyYWtlID0gcGFyZW50RHJha2VzW3NleF07XG4gICAgZHJha2UuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21dW3NpZGVdLmFsbGVsZXMucmVwbGFjZUZpcnN0KHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgZHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBkcmFrZS5nZXRBbGxlbGVTdHJpbmcoKSwgZHJha2Uuc2V4KTtcbiAgICBwYXJlbnREcmFrZXNbc2V4XSA9IGRyYWtlO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYXJlbnREcmFrZXMsIGNsdXRjaDogW10sIG1vdmVDb3VudDogKyt0aGlzLnN0YXRlLm1vdmVDb3VudCB9KTtcbiAgfVxuXG4gIGJyZWVkID0gKCkgPT4ge1xuICAgIGxldCB7IHBhcmVudERyYWtlcyB9ID0gdGhpcy5zdGF0ZSxcbiAgICAgICAgY2x1dGNoID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbHV0Y2hTaXplOyArK2kpIHtcbiAgICAgIGNsdXRjaC5wdXNoKEJpb0xvZ2ljYS5icmVlZChwYXJlbnREcmFrZXNbRkVNQUxFXSwgcGFyZW50RHJha2VzW01BTEVdKSk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBjbHV0Y2ggfSk7XG4gIH1cblxuICBoYW5kbGVEcm9wID0gKGRyYWdJdGVtLCBkcm9wVGFyZ2V0KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1vdmVDb3VudDogKyt0aGlzLnN0YXRlLm1vdmVDb3VudCB9KTtcblxuICAgIGlmICgwID09PSBHZW5pQmxvY2tzLkdlbmV0aWNzVXRpbHMubnVtYmVyT2ZDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShkcmFnSXRlbS5vcmcsIGRyb3BUYXJnZXQub3JnKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+ICh7IHRhcmdldHNNYXRjaGVkOiBuZXcgU2V0KHN0YXRlLnRhcmdldHNNYXRjaGVkKS5hZGQoZHJvcFRhcmdldC5pZCkgfSkpO1xuICAgICAgaWYgKHRoaXMuc3RhdGUudGFyZ2V0c01hdGNoZWQuc2l6ZSA+PSB0aGlzLnN0YXRlLnRhcmdldERyYWtlcy5sZW5ndGgpIHtcbiAgICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICB0aXRsZTogXCJHb29kIFdvcmshXCIsXG4gICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgb2tCdXR0b246IGNoYWxsZW5nZSA8IG1heENoYWxsZW5nZSA/IFwiTmV4dCBDaGFsbGVuZ2VcIiA6IFwiQ2FzZSBMb2dcIixcbiAgICAgICAgICBva0NhbGxiYWNrOiBuZXh0Q2hhbGxlbmdlLFxuICAgICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIixcbiAgICAgICAgICB0cnlDYWxsYmFjazogKCkgPT4gdGhpcy5yZXNldCgpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgICAgdGl0bGU6IFwiR29vZCBXb3JrIVwiLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICAgICAgICAgIG9rQnV0dG9uOiBcIk9LXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgdGl0bGU6IFwiVGhhdCdzIG5vdCB0aGUgZHJha2UhXCIsXG4gICAgICAgIG1lc3NhZ2U6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgZG9lc24ndCBtYXRjaCB0aGUgdGFyZ2V0IGRyYWtlLlxcblBsZWFzZSB0cnkgYWdhaW4uXCIsXG4gICAgICAgIHRyeUJ1dHRvbjogXCJUcnkgQWdhaW5cIlxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgZWRpdGFibGVQYXJlbnRTZXggfSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlLFxuICAgICAgICAgIHsgcGFyZW50RHJha2VzLCB0YXJnZXREcmFrZXMsIHRhcmdldHNNYXRjaGVkLFxuICAgICAgICAgICAgY2x1dGNoLCByZXF1aXJlZE1vdmVDb3VudCwgbW92ZUNvdW50IH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwiY2hhbGxlbmdlcy13cmFwcGVyXCI+XG4gICAgICAgIDxQYXJlbnREcmFrZUNvbHVtblxuICAgICAgICAgICAgICBpZD0nbGVmdCcgc2V4PSdmZW1hbGUnXG4gICAgICAgICAgICAgIGRyYWtlPXtwYXJlbnREcmFrZXNbRkVNQUxFXX1cbiAgICAgICAgICAgICAgaXNEcmFrZUVkaXRhYmxlPXtlZGl0YWJsZVBhcmVudFNleCA9PT0gRkVNQUxFfVxuICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICBhbGxlbGVDaGFuZ2VkPXsoLi4uYXJncykgPT4gdGhpcy5hbGxlbGVDaGFuZ2VkKEZFTUFMRSwgLi4uYXJncyl9IC8+XG4gICAgICAgIDxDYXNlM0NlbnRlclxuICAgICAgICAgICAgICB0YXJnZXREcmFrZXM9e3RhcmdldERyYWtlc30gdGFyZ2V0RHJha2VTaXplPXt0YXJnZXREcmFrZVNpemV9XG4gICAgICAgICAgICAgIHRhcmdldHNNYXRjaGVkPXt0YXJnZXRzTWF0Y2hlZH1cbiAgICAgICAgICAgICAgZ2xvd0NvbG9yPXtnbG93Q29sb3J9IG1hdGNoZWRDb2xvcj17bWF0Y2hlZENvbG9yfVxuICAgICAgICAgICAgICBjbHV0Y2g9e2NsdXRjaH0gY2x1dGNoU2l6ZT17Y2x1dGNoU2l6ZX1cbiAgICAgICAgICAgICAgaGFuZGxlQnJlZWQ9eygpID0+IHRoaXMuYnJlZWQoKX1cbiAgICAgICAgICAgICAgaGFuZGxlRHJvcD17KC4uLmFyZ3MpID0+IHRoaXMuaGFuZGxlRHJvcCguLi5hcmdzKX1cbiAgICAgICAgICAgICAgcmVxdWlyZWRNb3ZlQ291bnQ9e3JlcXVpcmVkTW92ZUNvdW50fSBtb3ZlQ291bnQ9e21vdmVDb3VudH0gLz5cbiAgICAgICAgPFBhcmVudERyYWtlQ29sdW1uXG4gICAgICAgICAgICAgIGlkPSdyaWdodCcgc2V4PSdtYWxlJ1xuICAgICAgICAgICAgICBkcmFrZT17cGFyZW50RHJha2VzW01BTEVdfVxuICAgICAgICAgICAgICBpc0RyYWtlRWRpdGFibGU9e2VkaXRhYmxlUGFyZW50U2V4ID09PSBNQUxFfVxuICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICBhbGxlbGVDaGFuZ2VkPXsoLi4uYXJncykgPT4gdGhpcy5hbGxlbGVDaGFuZ2VkKE1BTEUsIC4uLmFyZ3MpfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENhc2UzLCB7IGNoYWxsZW5nZTogY2hhbGxlbmdlU3BlY3NbY2hhbGxlbmdlXSB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpXG4gICk7XG59XG5cbmZ1bmN0aW9uIG5leHRDaGFsbGVuZ2UoKSB7XG4gIGxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIG5leHRVcmw7XG4gIGlmIChjaGFsbGVuZ2UgPCBtYXhDaGFsbGVuZ2UpIHtcbiAgICAvLyBhZHZhbmNlIHRvIG5leHQgY2hhbGxlbmdlXG4gICAgbmV4dFVybCA9IHVybC5yZXBsYWNlKGBjaGFsbGVuZ2U9JHtjaGFsbGVuZ2V9YCwgYGNoYWxsZW5nZT0ke2NoYWxsZW5nZSsxfWApO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIGJhY2sgdG8gY2FzZSBsb2dcbiAgICBjb25zdCBjYXNlM0luZGV4ID0gdXJsLmluZGV4T2YoJ2Nhc2UtMycpO1xuICAgIG5leHRVcmwgPSB1cmwuc3Vic3RyKDAsIGNhc2UzSW5kZXgpO1xuICB9XG4gIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV4dFVybCk7XG59XG5cbmxldCBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnMgPSB7fTtcbmZ1bmN0aW9uIHNob3dBbGVydChpU2hvdywgaU9wdGlvbnMpIHtcbiAgY29uc3QgZGlzcGxheU1vZGUgPSBpU2hvdyA/ICdibG9jaycgOiAnbm9uZScsXG4gICAgICAgIG9rQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC1vay1idXR0b25cIiksXG4gICAgICAgIHRyeUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtdHJ5LWJ1dHRvblwiKTtcbiAgaWYgKGlTaG93KSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGVydC10aXRsZVwiKS5pbm5lckhUTUwgPSBpT3B0aW9ucy50aXRsZSB8fCBcIlwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtbWVzc2FnZVwiKS5pbm5lckhUTUwgPSBpT3B0aW9ucy5tZXNzYWdlIHx8IFwiXCI7XG4gICAgb2tCdXR0b24uaW5uZXJIVE1MID0gaU9wdGlvbnMub2tCdXR0b24gfHwgXCJcIjtcbiAgICBva0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gaU9wdGlvbnMub2tCdXR0b24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIG9rQnV0dG9uLmRhdGFzZXQub2tDYWxsYmFjayA9IGlPcHRpb25zLm9rQ2FsbGJhY2sgfHwgJyc7XG4gICAgYWxlcnRDbGllbnRCdXR0b25DbGlja0hhbmRsZXJzW29rQnV0dG9uLmlkXSA9IGlPcHRpb25zLm9rQ2FsbGJhY2sgfHwgbnVsbDtcbiAgICB0cnlCdXR0b24uaW5uZXJIVE1MID0gaU9wdGlvbnMudHJ5QnV0dG9uIHx8IFwiXCI7XG4gICAgdHJ5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy50cnlCdXR0b24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIGFsZXJ0Q2xpZW50QnV0dG9uQ2xpY2tIYW5kbGVyc1t0cnlCdXR0b24uaWRdID0gaU9wdGlvbnMudHJ5Q2FsbGJhY2sgfHwgbnVsbDtcbiAgICBva0J1dHRvbi5vbmNsaWNrID0gYWxlcnRCdXR0b25DbGlja0hhbmRsZXI7XG4gICAgdHJ5QnV0dG9uLm9uY2xpY2sgPSBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcjtcbiAgfVxuICBlbHNlIHtcbiAgICBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbb2tCdXR0b24uaWRdID0gbnVsbDtcbiAgICBhbGVydENsaWVudEJ1dHRvbkNsaWNrSGFuZGxlcnNbdHJ5QnV0dG9uLmlkXSA9IG51bGw7XG4gIH1cbiAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlNb2RlO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXdyYXBwZXJcIikuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlNb2RlO1xufVxuXG5mdW5jdGlvbiBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcihldnQpIHtcbiAgY29uc3QgY2xpZW50Q2xpY2tIYW5kbGVyID0gYWxlcnRDbGllbnRCdXR0b25DbGlja0hhbmRsZXJzW2V2dC50YXJnZXQuaWRdO1xuICBzaG93QWxlcnQoZmFsc2UpO1xuICBpZiAoY2xpZW50Q2xpY2tIYW5kbGVyKVxuICAgIGNsaWVudENsaWNrSGFuZGxlcigpO1xuICByZW5kZXIoKTtcbn1cblxuLy8gcHJldmVudCBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodCBvbiBjbGljayB3aGlsZSBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5XG4vLyBzZWUgaHR0cHM6Ly93d3cucGFjaWVsbG9ncm91cC5jb20vYmxvZy8yMDEyLzA0L2hvdy10by1yZW1vdmUtY3NzLW91dGxpbmVzLWluLWFuLWFjY2Vzc2libGUtbWFubmVyL1xuZnVuY3Rpb24gc3VwcHJlc3NCdXR0b25Gb2N1c0hpZ2hsaWdodChldnQpIHtcbiAgY29uc3Qgbm9Gb2N1c0hpZ2hsaWdodCA9ICduby1mb2N1cy1oaWdobGlnaHQnO1xuICBpZiAoZXZ0LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihub0ZvY3VzSGlnaGxpZ2h0KSA8IDApXG4gICAgZXZ0LnRhcmdldC5jbGFzc05hbWUgKz0gJyAnICsgbm9Gb2N1c0hpZ2hsaWdodDtcbn1cblxuZnVuY3Rpb24gZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVlZC1idXR0b24nKTtcbiAgLy8gY2YuIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTk1OTUxL2NoYW5nZS1hbi1lbGVtZW50cy1jbGFzcy13aXRoLWphdmFzY3JpcHRcbiAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lKVxuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBidXR0b24uY2xhc3NOYW1lLnJlcGxhY2UoLyg/Ol58XFxzKW5vLWZvY3VzLWhpZ2hsaWdodCg/IVxcUykvZyAsICcnKTtcbn1cblxucmVuZGVyKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
