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
      var dropGlowColor = _props.dropGlowColor;
      var correctGlowColor = _props.correctGlowColor;
      var id = 'target-drake-' + index;
      var isMatched = targetsMatched.has(id);
      var color = isMatched ? correctGlowColor : glowColor;
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
          [0, 1].map(function (index) {
            return this.renderTargetDrake(index);
          }.bind(this))
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
  dropGlowColor: React.PropTypes.string.isRequired,
  correctGlowColor: React.PropTypes.string.isRequired,
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

var Case3Challenge = function (_React$Component2) {
  _inherits(Case3Challenge, _React$Component2);

  function Case3Challenge() {
    var _Object$getPrototypeO2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Case3Challenge);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Case3Challenge)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.state = {
      parentDrakes: [],
      targetParentDrake: null,
      targetDrakes: [],
      clutch: [],
      requiredMoveCount: 0,
      moveCount: 0,
      targetsMatched: null,
      alertButtonClickHandlers: {}
    }, _this2.resetChallenge = function (challengeSpec) {
      var _ref3 = challengeSpec || _this2.props.challengeSpec;

      var targetDrakeCount = _ref3.targetDrakeCount;
      var fixedParentSex = _ref3.fixedParentSex;
      var editableParentSex = _ref3.editableParentSex;
      var initialAlleles = _ref3.initialAlleles;
      var editableAlleles = _ref3.editableAlleles;

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
          parentDrakes.push(new BioLogica.Organism(BioLogica.Species.Drake, initialAlleles, sex));
        }
        targetParentDrake = new BioLogica.Organism(BioLogica.Species.Drake, initialAlleles, editableParentSex);
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
          requiredMoveCount = Math.max(requiredMoveCount, GeniBlocks.GeneticsUtils.numberOfBreedingMovesToReachDrake(parentDrakes[MALE], parentDrakes[FEMALE], editableParentSex === MALE ? editableAlleles : [], editableParentSex === FEMALE ? editableAlleles : [], targetDrakes[i]));
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
      var clutchSize = _this2.props.clutchSize;
      var parentDrakes = _this2.state.parentDrakes;
      var clutch = [];
      for (var i = 0; i < clutchSize; ++i) {
        clutch.push(BioLogica.breed(parentDrakes[FEMALE], parentDrakes[MALE]));
      }
      _this2.setState({ clutch: clutch });
    }, _this2.handleDrop = function (dragItem, dropTarget) {
      var _this2$props = _this2.props;
      var currChallenge = _this2$props.currChallenge;
      var maxChallenge = _this2$props.maxChallenge;

      _this2.setState({ moveCount: ++_this2.state.moveCount });

      if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(dragItem.org, dropTarget.org)) {
        _this2.setState(function (state) {
          return { targetsMatched: new Set(state.targetsMatched).add(dropTarget.id) };
        });
        if (_this2.state.targetsMatched.size >= _this2.state.targetDrakes.length) {
          _this2.showAlert(true, {
            title: "Good Work!",
            message: "The drake you have created matches the target drake.",
            okButton: currChallenge < maxChallenge ? "Next Challenge" : "Case Log",
            okCallback: _this2.props.onNextChallenge,
            tryButton: "Try Again",
            tryCallback: _this2.resetChallenge
          });
        } else {
          _this2.showAlert(true, {
            title: "Good Work!",
            message: "The drake you have created matches the target drake.",
            okButton: "OK"
          });
        }
      } else {
        _this2.showAlert(true, {
          title: "That's not the drake!",
          message: "The drake you have created doesn't match the target drake.\nPlease try again.",
          tryButton: "Try Again"
        });
      }
    }, _this2.handleAlertButtonClick = function (evt) {
      var alertButtonClickHandlers = _this2.state.alertButtonClickHandlers;
      var clientClickHandler = alertButtonClickHandlers[evt.target.id];
      _this2.showAlert(false);
      if (clientClickHandler) clientClickHandler();
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Case3Challenge, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.currChallenge !== nextProps.currChallenge) {
        this.resetChallenge(nextProps.challengeSpec);
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.resetChallenge();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var okButton = document.getElementById("alert-ok-button"),
          tryButton = document.getElementById("alert-try-button");
      okButton.onclick = this.handleAlertButtonClick;
      tryButton.onclick = this.handleAlertButtonClick;
    }
  }, {
    key: 'showAlert',
    value: function showAlert(iShow, iOptions) {
      var displayMode = iShow ? 'block' : 'none',
          okButton = document.getElementById("alert-ok-button"),
          tryButton = document.getElementById("alert-try-button");
      var alertButtonClickHandlers = this.state.alertButtonClickHandlers;

      if (iShow) {
        document.getElementById("alert-title").innerHTML = iOptions.title || "";
        document.getElementById("alert-message").innerHTML = iOptions.message || "";
        okButton.innerHTML = iOptions.okButton || "";
        okButton.style.display = iOptions.okButton ? 'block' : 'none';
        alertButtonClickHandlers[okButton.id] = iOptions.okCallback || null;
        tryButton.innerHTML = iOptions.tryButton || "";
        tryButton.style.display = iOptions.tryButton ? 'block' : 'none';
        alertButtonClickHandlers[tryButton.id] = iOptions.tryCallback || null;
      } else {
        alertButtonClickHandlers[okButton.id] = null;
        alertButtonClickHandlers[tryButton.id] = null;
      }
      this.setState({ alertButtonClickHandlers: alertButtonClickHandlers });
      document.getElementById("alert-wrapper").style.display = displayMode;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var targetDrakeSize = _props3.targetDrakeSize;
      var clutchSize = _props3.clutchSize;
      var glowColor = _props3.glowColor;
      var dropGlowColor = _props3.dropGlowColor;
      var correctGlowColor = _props3.correctGlowColor;
      var _props$challengeSpec = this.props.challengeSpec;
      var editableParentSex = _props$challengeSpec.editableParentSex;
      var hiddenAlleles = _props$challengeSpec.hiddenAlleles;
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
          glowColor: glowColor, dropGlowColor: dropGlowColor,
          correctGlowColor: correctGlowColor,
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

  return Case3Challenge;
}(React.Component);

Case3Challenge.propTypes = {
  currChallenge: React.PropTypes.number.isRequired,
  maxChallenge: React.PropTypes.number.isRequired,
  challengeSpec: React.PropTypes.object.isRequired,
  targetDrakeSize: React.PropTypes.number.isRequired,
  clutchSize: React.PropTypes.number.isRequired,
  glowColor: React.PropTypes.string.isRequired,
  dropGlowColor: React.PropTypes.string.isRequired,
  correctGlowColor: React.PropTypes.string.isRequired,
  incorrectGlowColor: React.PropTypes.string.isRequired,
  onNextChallenge: React.PropTypes.func.isRequired
};


Case3Challenge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2UtMy9jYXNlLTMtY2hhbGxlbmdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUJBV3lCLFM7SUFBakIsSSxjQUFBLEk7SUFBTSxNLGNBQUEsTTs7OztBQUdkLElBQU0sa0JBQWtCLFNBQVMsZUFBakM7SUFDTSxrQkFBa0Isb0JBRHhCOzs7OztBQU1BLElBQU0sd0JBQXdCLFNBQXhCLHFCQUF3QixPQUFvQztBQUFBLE1BQWxDLGlCQUFrQyxRQUFsQyxpQkFBa0M7O0FBQUEsTUFBWixNQUFZOztBQUNoRSxTQUFPLGtCQUNMO0FBQUE7SUFBQTtJQUNFLG9CQUFDLFVBQUQsQ0FBWSxrQkFBWixhQUErQixnQkFBZ0IsV0FBVyxZQUExRCxJQUE0RSxNQUE1RTtBQURGLEdBREssQ0FBUDtBQUtELENBTkQ7O0FBUUEsc0JBQXNCLFNBQXRCLEdBQWtDO0FBQ2hDLFNBQU8sTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBREU7QUFFaEMsUUFBTSxNQUFNLFNBQU4sQ0FBZ0IsTUFGVTtBQUdoQyxxQkFBbUIsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCLFVBSFI7QUFJaEMsY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsQ0FBcUI7QUFKRCxDQUFsQzs7QUFPQSxJQUFNLHVCQUF1QixTQUFTLFVBQVQsQ0FDSCxVQURHLEVBRUgsRTtBQUNFLGFBQVcsbUJBQVMsS0FBVCxFQUFnQjtBQUFBLFFBQ2pCLEdBRGlCLEdBQ0UsS0FERixDQUNqQixHQURpQjtBQUFBLFFBQ1osRUFEWSxHQUNFLEtBREYsQ0FDWixFQURZO0FBQUEsUUFDUixLQURRLEdBQ0UsS0FERixDQUNSLEtBRFE7O0FBRXpCLFdBQU8sRUFBRSxRQUFGLEVBQU8sTUFBUCxFQUFXLFlBQVgsRUFBUDtBQUNEO0FBSkgsQ0FGRzs7QUFTSCxVQUFTLE9BQVQsRUFBa0IsT0FBbEIsRUFBMkI7QUFDekIsU0FBTztBQUNMLHVCQUFtQixRQUFRLFVBQVIs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aEIsQ0FBdUIsVUFKdkI7QUFLakIsY0FBWSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFMbEI7QUFNakIsYUFBVyxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFOakI7QUFPakIsaUJBQWUsTUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFVBUHJCO0FBUWpCLG9CQUFrQixNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFSeEI7QUFTakIsc0JBQW9CLE1BQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixVQVQxQjtBQVVqQixtQkFBaUIsTUFBTSxTQUFOLENBQWdCLElBQWhCLENBQXFCO0FBVnJCLEM7OztBQWtOckIiLCJmaWxlIjoiY2FzZS0zL2Nhc2UtMy1jaGFsbGVuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENhc2UgMyBDaGFsbGVuZ2VzXG4gKlxuICogVGhlIGNvZGUgaW4gdGhpcyBtb2R1bGUgd2FzIHdyaXR0ZW4gdG8gc3VwcG9ydCBhIHJlY3JlYXRpb24gb2YgdGhlIGNoYWxsZW5nZXNcbiAqIGZyb20gQ2FzZSAzIGluIEdlbml2ZXJzZS4gVGhlIGNoYWxsZW5nZXMgYXJlOlxuICogIENoYWxsZW5nZSAxOiBNb2RpZnkgbW90aGVyIGRyYWtlIHNvIGFzIHRvIGJyZWVkIGEgcGFydGljdWxhciB0YXJnZXQgZHJha2VcbiAqICBDaGFsbGVuZ2UgMjogTW9kaWZ5IGZhdGhlciBkcmFrZSBzbyBhcyB0byBicmVlZCBhIHBhaXIgb2YgdGFyZ2V0IGRyYWtlc1xuICovXG4vKiBnbG9iYWwgRHJha2VHZW5vbWVDb2x1bW4gKi9cbi8vaW1wb3J0IERyYWtlR2Vub21lQ29sdW1uIGZyb20gJy4uL2pzL3BhcmVudC1nZW5vbWUtY29sdW1uJztcblxuY29uc3QgeyBNQUxFLCBGRU1BTEUgfSA9IEJpb0xvZ2ljYTtcblxuLyogZ2xvYmFsIFJlYWN0RG5ELCBSZWFjdERuREhUTUw1QmFja2VuZCAqL1xuY29uc3QgRHJhZ0Ryb3BDb250ZXh0ID0gUmVhY3REbkQuRHJhZ0Ryb3BDb250ZXh0LFxuICAgICAgRHJhZ0Ryb3BCYWNrZW5kID0gUmVhY3REbkRIVE1MNUJhY2tlbmQ7XG5cbi8qKlxuICogRHJhZ09yZ2FuaXNtR2xvd1ZpZXcgLSBSZWFjdERuRC5EcmFnU291cmNlIGZvciBkcmFnZ2luZyBvcmdhbmlzbSBmcm9tIGJyZWVkaW5nIHBlbi5cbiAqL1xuY29uc3QgX0RyYWdPcmdhbmlzbUdsb3dWaWV3ID0gKHtjb25uZWN0RHJhZ1NvdXJjZSwgLi4ub3RoZXJzfSkgPT4ge1xuICByZXR1cm4gY29ubmVjdERyYWdTb3VyY2UoXG4gICAgPGRpdj5cbiAgICAgIDxHZW5pQmxvY2tzLkdsb3dCYWNrZ3JvdW5kVmlldyBDaGlsZENvbXBvbmVudD17R2VuaUJsb2Nrcy5PcmdhbmlzbVZpZXd9IHsuLi5vdGhlcnN9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5fRHJhZ09yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBjb25uZWN0RHJhZ1NvdXJjZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaXNEcmFnZ2luZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgRHJhZ09yZ2FuaXNtR2xvd1ZpZXcgPSBSZWFjdERuRC5EcmFnU291cmNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnb3JnYW5pc20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IC8vIGRyYWcgc291cmNlIHNwZWNpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWdpbkRyYWc6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9yZywgaWQsIGluZGV4IH0gPSBwcm9wcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IG9yZywgaWQsIGluZGV4IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xsZWN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGNvbm5lY3QsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdERyYWdTb3VyY2U6IGNvbm5lY3QuZHJhZ1NvdXJjZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlcjogY29ubmVjdC5kcmFnUHJldmlldygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFnZ2luZzogbW9uaXRvci5pc0RyYWdnaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApKF9EcmFnT3JnYW5pc21HbG93Vmlldyk7XG5cbi8qKlxuICogRHJvcE9yZ2FuaXNtR2xvd1ZpZXcgLSBSZWFjdERuRC5Ecm9wVGFyZ2V0IGZvciBhY2NlcHRpbmcgZHJvcHMgb24gdGFyZ2V0IGRyYWtlcy5cbiAqL1xuY29uc3QgX0Ryb3BPcmdhbmlzbUdsb3dWaWV3ID0gKHtjb2xvciwgZHJvcENvbG9yLCBjb25uZWN0RHJvcFRhcmdldCwgaXNPdmVyLCBjYW5Ecm9wLCAuLi5vdGhlcnN9KSA9PiB7XG4gIGNvbnN0IGdsb3dDb2xvciA9IGlzT3ZlciAmJiBjYW5Ecm9wID8gZHJvcENvbG9yIDogY29sb3I7XG4gIHJldHVybiBjb25uZWN0RHJvcFRhcmdldChcbiAgICA8ZGl2PlxuICAgICAgPEdlbmlCbG9ja3MuR2xvd0JhY2tncm91bmRWaWV3IGNvbG9yPXtnbG93Q29sb3J9IENoaWxkQ29tcG9uZW50PXtHZW5pQmxvY2tzLk9yZ2FuaXNtVmlld30gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbl9Ecm9wT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGRyb3BDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjb25uZWN0RHJvcFRhcmdldDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaXNPdmVyOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBjYW5Ecm9wOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICBvbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IERyb3BPcmdhbmlzbUdsb3dWaWV3ID0gUmVhY3REbkQuRHJvcFRhcmdldChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yZ2FuaXNtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyAvLyBkcm9wIHRhcmdldCBzcGVjaWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuRHJvcDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhcHJvcHMuaXNNYXRjaGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcDogZnVuY3Rpb24ocHJvcHMsIG1vbml0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgb3JnLCBpZCB9ID0gcHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcm9wVGFyZ2V0ID0geyBvcmcsIGlkIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMub25Ecm9wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wcy5vbkRyb3AobW9uaXRvci5nZXRJdGVtKCksIGRyb3BUYXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sbGVjdGluZyBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihjb25uZWN0LCBtb25pdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3REcm9wVGFyZ2V0OiBjb25uZWN0LmRyb3BUYXJnZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT3ZlcjogbW9uaXRvci5pc092ZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbkRyb3A6IG1vbml0b3IuY2FuRHJvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKShfRHJvcE9yZ2FuaXNtR2xvd1ZpZXcpO1xuXG4vKipcbiAqIENlbnRlciBwYW5lbCBoYXMgdGFyZ2V0IGRyYWtlcywgYnJlZWRuZyBwZW4sIGJyZWVkIGJ1dHRvbiwgZXRjLlxuICovXG5jbGFzcyBfQ2FzZTNDZW50ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGFyZ2V0RHJha2VzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIHRhcmdldHNNYXRjaGVkOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdGFyZ2V0RHJha2VTaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZ2xvd0NvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgZHJvcEdsb3dDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNvcnJlY3RHbG93Q29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbHV0Y2g6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgY2x1dGNoU2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9uQnJlZWQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVxdWlyZWRNb3ZlQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBtb3ZlQ291bnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvbkRyb3A6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIHNlbGVjdGVkSW5kZXg6IG51bGxcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdGlvbkNoYW5nZSA9IChpU2VsZWN0ZWRJbmRleCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEluZGV4OiBpU2VsZWN0ZWRJbmRleCB9KTtcbiAgfVxuXG4gIGhhbmRsZUJyZWVkID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEluZGV4OiBudWxsIH0pO1xuICAgIGlmICh0aGlzLnByb3BzLm9uQnJlZWQpXG4gICAgICB0aGlzLnByb3BzLm9uQnJlZWQoKTtcbiAgfVxuXG4gIHJlbmRlclRhcmdldERyYWtlKGluZGV4KSB7XG4gICAgY29uc3QgeyB0YXJnZXREcmFrZXMsIHRhcmdldHNNYXRjaGVkLCB0YXJnZXREcmFrZVNpemUsXG4gICAgICAgICAgICBnbG93Q29sb3IsIGRyb3BHbG93Q29sb3IsIGNvcnJlY3RHbG93Q29sb3IgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgaWQgPSBgdGFyZ2V0LWRyYWtlLSR7aW5kZXh9YCxcbiAgICAgICAgICBpc01hdGNoZWQgPSB0YXJnZXRzTWF0Y2hlZC5oYXMoaWQpLFxuICAgICAgICAgIGNvbG9yID0gaXNNYXRjaGVkID8gY29ycmVjdEdsb3dDb2xvciA6IGdsb3dDb2xvcjtcbiAgICByZXR1cm4gaW5kZXggPCB0YXJnZXREcmFrZXMubGVuZ3RoXG4gICAgICAgICAgICA/IDxEcm9wT3JnYW5pc21HbG93Vmlld1xuICAgICAgICAgICAgICAgIGlkPXtpZH0gY2xhc3NOYW1lPVwic21hbGwtZHJha2UtaW1hZ2VcIlxuICAgICAgICAgICAgICAgIG9yZz17dGFyZ2V0RHJha2VzW2luZGV4XX0gc2l6ZT17dGFyZ2V0RHJha2VTaXplfVxuICAgICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn0gZHJvcENvbG9yPXtkcm9wR2xvd0NvbG9yfVxuICAgICAgICAgICAgICAgIGlzTWF0Y2hlZD17aXNNYXRjaGVkfSBvbkRyb3A9e3RoaXMucHJvcHMub25Ecm9wfSAvPlxuICAgICAgICAgICAgOiBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdGFyZ2V0RHJha2VzLCBjbHV0Y2gsIGNsdXRjaFNpemUsIHJlcXVpcmVkTW92ZUNvdW50LCBtb3ZlQ291bnQgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgdGFyZ2V0RHJha2VDb3VudCA9IHRhcmdldERyYWtlcy5sZW5ndGgsXG4gICAgICAgICAgdGFyZ2V0RHJha2VzTGFiZWwgPSB0YXJnZXREcmFrZUNvdW50ID09PSAxID8gXCJUYXJnZXQgRHJha2VcIiA6IFwiVGFyZ2V0IERyYWtlc1wiO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwiY2VudGVyXCIgY2xhc3NOYW1lPVwiY29sdW1uXCI+XG4gICAgICAgIDxkaXYgaWQ9XCJ0YXJnZXQtZHJha2VzLWxhYmVsXCIgY2xhc3NOYW1lPVwiY29sdW1uLWxhYmVsXCI+e3RhcmdldERyYWtlc0xhYmVsfTwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwidGFyZ2V0LWRyYWtlc1wiPlxuICAgICAgICAgIHtbMCwgMV0ubWFwKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJUYXJnZXREcmFrZShpbmRleCk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJicmVlZC1idXR0b24tYW5kLWdvYWwtZmVlZGJhY2tcIj5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5CdXR0b24gaWQ9XCJicmVlZC1idXR0b25cIiBsYWJlbD1cIkJyZWVkXCIgb25DbGljaz17dGhpcy5oYW5kbGVCcmVlZH0gLz5cbiAgICAgICAgICA8R2VuaUJsb2Nrcy5GZWVkYmFja1ZpZXcgaWQ9XCJnb2FsLWZlZWRiYWNrXCIgY2xhc3NOYW1lPVwiZmVlZGJhY2stdmlld1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXtbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBHT0FMIGlzICR7cmVxdWlyZWRNb3ZlQ291bnR9IE1PVkVTYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFlvdXIgbW92ZXM6ICR7bW92ZUNvdW50fWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8R2VuaUJsb2Nrcy5QZW5TdGF0c1ZpZXcgaWQ9XCJicmVlZGluZy1wZW5cIiBvcmdzPXtjbHV0Y2h9IGxhc3RDbHV0Y2hTaXplPXtjbHV0Y2hTaXplfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg9e3RoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZE9yZ2FuaXNtVmlldz17RHJhZ09yZ2FuaXNtR2xvd1ZpZXd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2U9e3RoaXMuaGFuZGxlU2VsZWN0aW9uQ2hhbmdlfS8+XG4gICAgICAgIDxkaXYgaWQ9XCJhbGVydC13cmFwcGVyXCI+XG4gICAgICAgICAgPGgzIGlkPVwiYWxlcnQtdGl0bGVcIj48L2gzPlxuICAgICAgICAgIDxkaXYgaWQ9XCJhbGVydC1tZXNzYWdlXCI+PC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImFsZXJ0LXRyeS1idXR0b25cIj5UcnkgQWdhaW48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiYWxlcnQtb2stYnV0dG9uXCI+T0s8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5jb25zdCBDYXNlM0NlbnRlciA9IERyYWdEcm9wQ29udGV4dChEcmFnRHJvcEJhY2tlbmQpKF9DYXNlM0NlbnRlcik7XG5cbi8qKlxuICogQ2FzZSAzIGNvbWJpbmVzIGxlZnQgY29sdW1uIChtb3RoZXIgZHJha2UpLCBjZW50ZXIgY29sdW1uICh0YXJnZXQgZHJha2VzLCBicmVlZCBidXR0b24sXG4gKiBicmVlZGluZyBwZW4pLCBhbmQgcmlnaHQgY29sdW1uIChmYXRoZXIgZHJha2UpLlxuICovXG5jbGFzcyBDYXNlM0NoYWxsZW5nZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjdXJyQ2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbWF4Q2hhbGxlbmdlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgY2hhbGxlbmdlU3BlYzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRhcmdldERyYWtlU2l6ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGNsdXRjaFNpemU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBnbG93Q29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkcm9wR2xvd0NvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY29ycmVjdEdsb3dDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGluY29ycmVjdEdsb3dDb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG9uTmV4dENoYWxsZW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgcGFyZW50RHJha2VzOiBbXSxcbiAgICB0YXJnZXRQYXJlbnREcmFrZTogbnVsbCxcbiAgICB0YXJnZXREcmFrZXM6IFtdLFxuICAgIGNsdXRjaDogW10sXG4gICAgcmVxdWlyZWRNb3ZlQ291bnQ6IDAsXG4gICAgbW92ZUNvdW50OiAwLFxuICAgIHRhcmdldHNNYXRjaGVkOiBudWxsLFxuICAgIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyczoge31cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY3VyckNoYWxsZW5nZSAhPT0gbmV4dFByb3BzLmN1cnJDaGFsbGVuZ2UpIHtcbiAgICAgIHRoaXMucmVzZXRDaGFsbGVuZ2UobmV4dFByb3BzLmNoYWxsZW5nZVNwZWMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlc2V0Q2hhbGxlbmdlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBva0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtb2stYnV0dG9uXCIpLFxuICAgICAgICAgIHRyeUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtdHJ5LWJ1dHRvblwiKTtcbiAgICBva0J1dHRvbi5vbmNsaWNrID0gdGhpcy5oYW5kbGVBbGVydEJ1dHRvbkNsaWNrO1xuICAgIHRyeUJ1dHRvbi5vbmNsaWNrID0gdGhpcy5oYW5kbGVBbGVydEJ1dHRvbkNsaWNrO1xuICB9XG5cbiAgcmVzZXRDaGFsbGVuZ2UgPSAoY2hhbGxlbmdlU3BlYykgPT4ge1xuICAgIGNvbnN0IHsgdGFyZ2V0RHJha2VDb3VudCwgZml4ZWRQYXJlbnRTZXgsIGVkaXRhYmxlUGFyZW50U2V4LFxuICAgICAgICAgICAgaW5pdGlhbEFsbGVsZXMsIGVkaXRhYmxlQWxsZWxlcyB9ID0gY2hhbGxlbmdlU3BlYyB8fCB0aGlzLnByb3BzLmNoYWxsZW5nZVNwZWM7XG4gICAgbGV0IHBhcmVudERyYWtlcyA9IFtdLFxuICAgICAgICB0YXJnZXRQYXJlbnREcmFrZSxcbiAgICAgICAgdGFyZ2V0RHJha2VzID0gW10sXG4gICAgICAgIHRhcmdldHNNYXRjaGVkID0gbmV3IFNldCxcbiAgICAgICAgY2x1dGNoID0gW10sXG4gICAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gMCxcbiAgICAgICAgbW92ZUNvdW50ID0gMDtcbiAgICAvLyByZWdlbmVyYXRlIGlmIHdlIGdlbmVyYXRlIGRyYWtlcyB0aGF0IGFyZSB0b28gY2xvc2UgdG8vZmFyIGZyb20gZWFjaCBvdGhlclxuICAgIHdoaWxlICgocmVxdWlyZWRNb3ZlQ291bnQgPCA0KSB8fCAocmVxdWlyZWRNb3ZlQ291bnQgPiA4KSkge1xuICAgICAgcGFyZW50RHJha2VzID0gW107XG4gICAgICBmb3IgKGxldCBzZXggPSBNQUxFOyBzZXggPD0gRkVNQUxFOyArK3NleCkge1xuICAgICAgICBwYXJlbnREcmFrZXMucHVzaChuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBpbml0aWFsQWxsZWxlcywgc2V4KSk7XG4gICAgICB9XG4gICAgICB0YXJnZXRQYXJlbnREcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGluaXRpYWxBbGxlbGVzLCBlZGl0YWJsZVBhcmVudFNleCk7XG4gICAgICBjb25zdCB0YXJnZXRNb3RoZXIgPSBmaXhlZFBhcmVudFNleCA9PT0gRkVNQUxFID8gcGFyZW50RHJha2VzW0ZFTUFMRV0gOiB0YXJnZXRQYXJlbnREcmFrZSxcbiAgICAgICAgICAgIHRhcmdldEZhdGhlciA9IGZpeGVkUGFyZW50U2V4ID09PSBNQUxFID8gcGFyZW50RHJha2VzW01BTEVdIDogdGFyZ2V0UGFyZW50RHJha2U7XG4gICAgICB0YXJnZXREcmFrZXMgPSBbXTtcbiAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gMDtcbiAgICAgIGZvciAobGV0IGk9MDsgaTx0YXJnZXREcmFrZUNvdW50OyArK2kpIHtcbiAgICAgICAgdGFyZ2V0RHJha2VzLnB1c2goQmlvTG9naWNhLmJyZWVkKHRhcmdldE1vdGhlciwgdGFyZ2V0RmF0aGVyKSk7XG4gICAgICAgIC8vIFdlJ3JlIGFwcHJveGltYXRpbmcgdGhlIGNvbWJpbmVkIHJlcXVpcmVkIG1vdmUgY291bnQgZnJvbSB0aGUgbW92ZXMgcmVxdWlyZWQgdG9cbiAgICAgICAgLy8gcmVhY2ggZWFjaCB0YXJnZXQgb2Zmc3ByaW5nIGluZGVwZW5kZW50bHkuIEV2ZW50dWFsbHksIG5lZWQgYSBiZXR0ZXIgbWVhbnMgb2ZcbiAgICAgICAgLy8gZGV0ZXJtaW5pbmcgdGhlIG1vdmVzIHJlcXVpcmVkIHRvIHJlYWNoIGEgc2luZ2xlIHBhcmVudCB0aGF0IGNhbiBwcm9kdWNlIGFsbFxuICAgICAgICAvLyBvZiB0aGUgbmVjZXNzYXJ5IHRhcmdldCBvZmZzcHJpbmcuXG4gICAgICAgIHJlcXVpcmVkTW92ZUNvdW50ID0gTWF0aC5tYXgocmVxdWlyZWRNb3ZlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdlbmlCbG9ja3MuR2VuZXRpY3NVdGlscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJPZkJyZWVkaW5nTW92ZXNUb1JlYWNoRHJha2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnREcmFrZXNbTUFMRV0sIHBhcmVudERyYWtlc1tGRU1BTEVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdGFibGVQYXJlbnRTZXggPT09IE1BTEUgPyBlZGl0YWJsZUFsbGVsZXMgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlUGFyZW50U2V4ID09PSBGRU1BTEUgPyBlZGl0YWJsZUFsbGVsZXMgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERyYWtlc1tpXSkpO1xuICAgICAgfVxuICAgICAgLy8gYWRkIG9uZSBmb3IgZHJhZ2dpbmcgYW4gb2Zmc3ByaW5nIHRvIGVhY2ggdGFyZ2V0IGRyYWtlXG4gICAgICByZXF1aXJlZE1vdmVDb3VudCArPSB0YXJnZXREcmFrZUNvdW50O1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgcGFyZW50RHJha2VzLCB0YXJnZXRQYXJlbnREcmFrZSwgdGFyZ2V0RHJha2VzLCB0YXJnZXRzTWF0Y2hlZCxcbiAgICAgICAgICAgICAgICAgICAgY2x1dGNoLCByZXF1aXJlZE1vdmVDb3VudCwgbW92ZUNvdW50IH0pO1xuICB9XG5cbiAgaGFuZGxlQWxsZWxlQ2hhbmdlID0gKHNleCwgY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSkgPT4ge1xuICAgIGxldCBwYXJlbnREcmFrZXMgPSB0aGlzLnN0YXRlLnBhcmVudERyYWtlcy5zbGljZSgpLFxuICAgICAgICBkcmFrZSA9IHBhcmVudERyYWtlc1tzZXhdO1xuICAgIGRyYWtlLmdlbmV0aWNzLmdlbm90eXBlLnJlcGxhY2VBbGxlbGVDaHJvbU5hbWUoY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgZHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBkcmFrZS5nZXRBbGxlbGVTdHJpbmcoKSwgZHJha2Uuc2V4KTtcbiAgICBwYXJlbnREcmFrZXNbc2V4XSA9IGRyYWtlO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYXJlbnREcmFrZXMsIGNsdXRjaDogW10sIG1vdmVDb3VudDogKyt0aGlzLnN0YXRlLm1vdmVDb3VudCB9KTtcbiAgfVxuXG4gIGhhbmRsZUJyZWVkID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgY2x1dGNoU2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgeyBwYXJlbnREcmFrZXMgfSA9IHRoaXMuc3RhdGUsXG4gICAgICAgIGNsdXRjaCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2x1dGNoU2l6ZTsgKytpKSB7XG4gICAgICBjbHV0Y2gucHVzaChCaW9Mb2dpY2EuYnJlZWQocGFyZW50RHJha2VzW0ZFTUFMRV0sIHBhcmVudERyYWtlc1tNQUxFXSkpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgY2x1dGNoIH0pO1xuICB9XG5cbiAgaGFuZGxlRHJvcCA9IChkcmFnSXRlbSwgZHJvcFRhcmdldCkgPT4ge1xuICAgIGNvbnN0IHsgY3VyckNoYWxsZW5nZSwgbWF4Q2hhbGxlbmdlIH0gPSB0aGlzLnByb3BzO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBtb3ZlQ291bnQ6ICsrdGhpcy5zdGF0ZS5tb3ZlQ291bnQgfSk7XG5cbiAgICBpZiAoMCA9PT0gR2VuaUJsb2Nrcy5HZW5ldGljc1V0aWxzLm51bWJlck9mQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoZHJhZ0l0ZW0ub3JnLCBkcm9wVGFyZ2V0Lm9yZykpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiAoeyB0YXJnZXRzTWF0Y2hlZDogbmV3IFNldChzdGF0ZS50YXJnZXRzTWF0Y2hlZCkuYWRkKGRyb3BUYXJnZXQuaWQpIH0pKTtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnRhcmdldHNNYXRjaGVkLnNpemUgPj0gdGhpcy5zdGF0ZS50YXJnZXREcmFrZXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICB0aXRsZTogXCJHb29kIFdvcmshXCIsXG4gICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgb2tCdXR0b246IGN1cnJDaGFsbGVuZ2UgPCBtYXhDaGFsbGVuZ2UgPyBcIk5leHQgQ2hhbGxlbmdlXCIgOiBcIkNhc2UgTG9nXCIsXG4gICAgICAgICAgb2tDYWxsYmFjazogdGhpcy5wcm9wcy5vbk5leHRDaGFsbGVuZ2UsXG4gICAgICAgICAgdHJ5QnV0dG9uOiBcIlRyeSBBZ2FpblwiLFxuICAgICAgICAgIHRyeUNhbGxiYWNrOiB0aGlzLnJlc2V0Q2hhbGxlbmdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvd0FsZXJ0KHRydWUsIHtcbiAgICAgICAgICB0aXRsZTogXCJHb29kIFdvcmshXCIsXG4gICAgICAgICAgbWVzc2FnZTogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBtYXRjaGVzIHRoZSB0YXJnZXQgZHJha2UuXCIsXG4gICAgICAgICAgb2tCdXR0b246IFwiT0tcIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnNob3dBbGVydCh0cnVlLCB7XG4gICAgICAgIHRpdGxlOiBcIlRoYXQncyBub3QgdGhlIGRyYWtlIVwiLFxuICAgICAgICBtZXNzYWdlOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIGRvZXNuJ3QgbWF0Y2ggdGhlIHRhcmdldCBkcmFrZS5cXG5QbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICB0cnlCdXR0b246IFwiVHJ5IEFnYWluXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNob3dBbGVydChpU2hvdywgaU9wdGlvbnMpIHtcbiAgICBjb25zdCBkaXNwbGF5TW9kZSA9IGlTaG93ID8gJ2Jsb2NrJyA6ICdub25lJyxcbiAgICAgICAgICBva0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtb2stYnV0dG9uXCIpLFxuICAgICAgICAgIHRyeUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtdHJ5LWJ1dHRvblwiKTtcbiAgICBsZXQgeyBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnMgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKGlTaG93KSB7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXRpdGxlXCIpLmlubmVySFRNTCA9IGlPcHRpb25zLnRpdGxlIHx8IFwiXCI7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LW1lc3NhZ2VcIikuaW5uZXJIVE1MID0gaU9wdGlvbnMubWVzc2FnZSB8fCBcIlwiO1xuICAgICAgb2tCdXR0b24uaW5uZXJIVE1MID0gaU9wdGlvbnMub2tCdXR0b24gfHwgXCJcIjtcbiAgICAgIG9rQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy5va0J1dHRvbiA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICBhbGVydEJ1dHRvbkNsaWNrSGFuZGxlcnNbb2tCdXR0b24uaWRdID0gaU9wdGlvbnMub2tDYWxsYmFjayB8fCBudWxsO1xuICAgICAgdHJ5QnV0dG9uLmlubmVySFRNTCA9IGlPcHRpb25zLnRyeUJ1dHRvbiB8fCBcIlwiO1xuICAgICAgdHJ5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBpT3B0aW9ucy50cnlCdXR0b24gPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBpT3B0aW9ucy50cnlDYWxsYmFjayB8fCBudWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyc1tva0J1dHRvbi5pZF0gPSBudWxsO1xuICAgICAgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzW3RyeUJ1dHRvbi5pZF0gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtd3JhcHBlclwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheU1vZGU7XG4gIH1cblxuICBoYW5kbGVBbGVydEJ1dHRvbkNsaWNrID0gKGV2dCkgPT4ge1xuICAgIGNvbnN0IHsgYWxlcnRCdXR0b25DbGlja0hhbmRsZXJzIH0gPSB0aGlzLnN0YXRlLFxuICAgICAgICAgIGNsaWVudENsaWNrSGFuZGxlciA9IGFsZXJ0QnV0dG9uQ2xpY2tIYW5kbGVyc1tldnQudGFyZ2V0LmlkXTtcbiAgICB0aGlzLnNob3dBbGVydChmYWxzZSk7XG4gICAgaWYgKGNsaWVudENsaWNrSGFuZGxlcilcbiAgICAgIGNsaWVudENsaWNrSGFuZGxlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdGFyZ2V0RHJha2VTaXplLCBjbHV0Y2hTaXplLCBnbG93Q29sb3IsIGRyb3BHbG93Q29sb3IsIGNvcnJlY3RHbG93Q29sb3IgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgeyBlZGl0YWJsZVBhcmVudFNleCwgaGlkZGVuQWxsZWxlcyB9ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VTcGVjLFxuICAgICAgICAgIHsgcGFyZW50RHJha2VzLCB0YXJnZXREcmFrZXMsIHRhcmdldHNNYXRjaGVkLFxuICAgICAgICAgICAgY2x1dGNoLCByZXF1aXJlZE1vdmVDb3VudCwgbW92ZUNvdW50IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgaGFuZGxlTW90aGVyQWxsZWxlQ2hhbmdlID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgdGhpcy5oYW5kbGVBbGxlbGVDaGFuZ2UoRkVNQUxFLCAuLi5hcmdzKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBjb25zdCBoYW5kbGVGYXRoZXJBbGxlbGVDaGFuZ2UgPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICB0aGlzLmhhbmRsZUFsbGVsZUNoYW5nZShNQUxFLCAuLi5hcmdzKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cImNoYWxsZW5nZXMtd3JhcHBlclwiPlxuICAgICAgICA8RHJha2VHZW5vbWVDb2x1bW5cbiAgICAgICAgICAgICAgaWQ9J2xlZnQnIGlkUHJlZml4PSdmZW1hbGUnIHNleD0nZmVtYWxlJ1xuICAgICAgICAgICAgICBjb2x1bW5MYWJlbD1cIkZlbWFsZSBEcmFrZVwiXG4gICAgICAgICAgICAgIGRyYWtlPXtwYXJlbnREcmFrZXNbRkVNQUxFXX1cbiAgICAgICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlUGFyZW50U2V4ID09PSBGRU1BTEV9XG4gICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtoYW5kbGVNb3RoZXJBbGxlbGVDaGFuZ2V9IC8+XG4gICAgICAgIDxDYXNlM0NlbnRlclxuICAgICAgICAgICAgICB0YXJnZXREcmFrZXM9e3RhcmdldERyYWtlc30gdGFyZ2V0RHJha2VTaXplPXt0YXJnZXREcmFrZVNpemV9XG4gICAgICAgICAgICAgIHRhcmdldHNNYXRjaGVkPXt0YXJnZXRzTWF0Y2hlZH1cbiAgICAgICAgICAgICAgZ2xvd0NvbG9yPXtnbG93Q29sb3J9IGRyb3BHbG93Q29sb3I9e2Ryb3BHbG93Q29sb3J9XG4gICAgICAgICAgICAgIGNvcnJlY3RHbG93Q29sb3I9e2NvcnJlY3RHbG93Q29sb3J9XG4gICAgICAgICAgICAgIGNsdXRjaD17Y2x1dGNofSBjbHV0Y2hTaXplPXtjbHV0Y2hTaXplfVxuICAgICAgICAgICAgICBvbkJyZWVkPXt0aGlzLmhhbmRsZUJyZWVkfVxuICAgICAgICAgICAgICBvbkRyb3A9e3RoaXMuaGFuZGxlRHJvcH1cbiAgICAgICAgICAgICAgcmVxdWlyZWRNb3ZlQ291bnQ9e3JlcXVpcmVkTW92ZUNvdW50fSBtb3ZlQ291bnQ9e21vdmVDb3VudH0gLz5cbiAgICAgICAgPERyYWtlR2Vub21lQ29sdW1uXG4gICAgICAgICAgICAgIGlkPSdyaWdodCcgaWRQcmVmaXg9J21hbGUnIHNleD0nbWFsZSdcbiAgICAgICAgICAgICAgY29sdW1uTGFiZWw9XCJNYWxlIERyYWtlXCJcbiAgICAgICAgICAgICAgZHJha2U9e3BhcmVudERyYWtlc1tNQUxFXX1cbiAgICAgICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlUGFyZW50U2V4ID09PSBNQUxFfVxuICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17aGFuZGxlRmF0aGVyQWxsZWxlQ2hhbmdlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5DYXNlM0NoYWxsZW5nZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
