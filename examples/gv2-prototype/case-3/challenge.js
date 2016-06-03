/**
 * Case 3 Challenges
 *
 * The code in this module was written to support a recreation of the challenges
 * from Case 3 in Geniverse. The challenges are:
 *  Challenge 1: Modify mother drake so as to breed a particular target drake
 *  Challenge 2: Modify father drake so as to breed a pair of target drakes
 */
import DrakeGenomeColumn from '../js/drake-genome-column';

const { MALE, FEMALE } = BioLogica;

/* global ReactDnD, ReactDnDHTML5Backend */
const DragDropContext = ReactDnD.DragDropContext,
      DragDropBackend = ReactDnDHTML5Backend;

/**
 * DragOrganismGlowView - ReactDnD.DragSource for dragging organism from breeding pen.
 */
const _DragOrganismGlowView = ({connectDragSource, ...others}) => {
  return connectDragSource(
    <div>
      <GeniBlocks.GlowBackgroundView ChildComponent={GeniBlocks.OrganismView} {...others} />
    </div>
  );
};

_DragOrganismGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  size: React.PropTypes.number,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

const DragOrganismGlowView = ReactDnD.DragSource(
                          'organism',
                          { // drag source specification
                            beginDrag: function(props) {
                              const { org, id, index } = props;
                              return { org, id, index };
                            }
                          },
                          // collecting function
                          function(connect, monitor) {
                            return {
                              connectDragSource: connect.dragSource(),
                              wrapper: connect.dragPreview(),
                              isDragging: monitor.isDragging()
                            };
                          }
                        )(_DragOrganismGlowView);

/**
 * DropOrganismGlowView - ReactDnD.DropTarget for accepting drops on target drakes.
 */
const _DropOrganismGlowView = ({color, dropColor, connectDropTarget, isOver, canDrop, ...others}) => {
  const glowColor = isOver && canDrop ? dropColor : color;
  return connectDropTarget(
    <div>
      <GeniBlocks.GlowBackgroundView color={glowColor} ChildComponent={GeniBlocks.OrganismView} {...others} />
    </div>
  );
};

_DropOrganismGlowView.propTypes = {
  color: React.PropTypes.string.isRequired,
  dropColor: React.PropTypes.string.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isOver: React.PropTypes.bool.isRequired,
  canDrop: React.PropTypes.bool.isRequired,
  onDrop: React.PropTypes.func.isRequired
};

const DropOrganismGlowView = ReactDnD.DropTarget(
                          'organism',
                          { // drop target specification
                            canDrop: function(props) {
                              return !props.isMatched;
                            },
                            drop: function(props, monitor) {
                              const { org, id } = props,
                                    dropTarget = { org, id };
                              if (props.onDrop)
                                props.onDrop(monitor.getItem(), dropTarget);
                            }
                          },
                          // collecting function
                          function(connect, monitor) {
                            return {
                              connectDropTarget: connect.dropTarget(),
                              isOver: monitor.isOver(),
                              canDrop: monitor.canDrop()
                            };
                          }
                        )(_DropOrganismGlowView);

/**
 * Center panel has target drakes, breedng pen, breed button, etc.
 */
class _Case3Center extends React.Component {

  static propTypes = {
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
  }

  state = {
    selectedIndex: null
  }

  handleSelectionChange = (iSelectedIndex) => {
    this.setState({ selectedIndex: iSelectedIndex });
  }

  handleBreed = () => {
    this.setState({ selectedIndex: null });
    if (this.props.onBreed)
      this.props.onBreed();
  }

  renderTargetDrake(index) {
    const { targetDrakes, targetsMatched, targetDrakeSize,
            glowColor, dropGlowColor, correctGlowColor } = this.props,
          id = `target-drake-${index}`,
          isMatched = targetsMatched.has(id),
          color = isMatched ? correctGlowColor : glowColor;
    return index < targetDrakes.length
            ? <DropOrganismGlowView
                id={id} key={index} className="small-drake-image"
                org={targetDrakes[index]} size={targetDrakeSize}
                color={color} dropColor={dropGlowColor}
                isMatched={isMatched} onDrop={this.props.onDrop} />
            : null;
  }

  render() {
    const { targetDrakes, clutch, clutchSize, requiredMoveCount, moveCount } = this.props,
          targetDrakeCount = targetDrakes.length,
          targetDrakesLabel = targetDrakeCount === 1 ? "Target Drake" : "Target Drakes";
    return (
      <div id="center" className="column">
        <div id="target-drakes-label" className="column-label">{targetDrakesLabel}</div>
        <div id="target-drakes">
          {[0, 1].map(function(index) {
            return this.renderTargetDrake(index);
          }.bind(this))}
        </div>
        <div id="breed-button-and-goal-feedback">
          <GeniBlocks.Button id="breed-button" label="Breed" onClick={this.handleBreed} />
          <GeniBlocks.FeedbackView id="goal-feedback" className="feedback-view"
                                    text={[
                                      `GOAL is ${requiredMoveCount} MOVES`,
                                      `Your moves: ${moveCount}`
                                    ]} />
        </div>
        <GeniBlocks.PenStatsView id="breeding-pen" orgs={clutch} lastClutchSize={clutchSize}
                                  selectedIndex={this.state.selectedIndex}
                                  SelectedOrganismView={DragOrganismGlowView}
                                  onSelectionChange={this.handleSelectionChange}/>
        <div id="alert-wrapper">
          <h3 id="alert-title"></h3>
          <div id="alert-message"></div>
          <button id="alert-try-button">Try Again</button>
          <button id="alert-ok-button">OK</button>
        </div>
      </div>
    );
  }
}
const Case3Center = DragDropContext(DragDropBackend)(_Case3Center);

/**
 * Case 3 combines left column (mother drake), center column (target drakes, breed button,
 * breeding pen), and right column (father drake).
 */
class Case3Challenge extends React.Component {

  static propTypes = {
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
  }

  state = {
    parentDrakes: [],
    targetParentDrake: null,
    targetDrakes: [],
    clutch: [],
    requiredMoveCount: 0,
    moveCount: 0,
    targetsMatched: null,
    alertButtonClickHandlers: {}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currChallenge !== nextProps.currChallenge) {
      this.resetChallenge(nextProps.challengeSpec);
    }
  }

  componentWillMount() {
    this.resetChallenge();
  }

  componentDidMount() {
    const okButton = document.getElementById("alert-ok-button"),
          tryButton = document.getElementById("alert-try-button");
    okButton.onclick = this.handleAlertButtonClick;
    tryButton.onclick = this.handleAlertButtonClick;
  }

  resetChallenge = (challengeSpec) => {
    const { targetDrakeCount, fixedParentSex, editableParentSex,
            initialAlleles, editableAlleles } = challengeSpec || this.props.challengeSpec;
    let parentDrakes = [],
        targetParentDrake,
        targetDrakes = [],
        targetsMatched = new Set,
        clutch = [],
        requiredMoveCount = 0,
        moveCount = 0;
    // regenerate if we generate drakes that are too close to/far from each other
    while ((requiredMoveCount < 3) || (requiredMoveCount > 8)) {
      parentDrakes = [];
      for (let sex = MALE; sex <= FEMALE; ++sex) {
        parentDrakes.push(new BioLogica.Organism(BioLogica.Species.Drake, initialAlleles, sex));
      }
      targetParentDrake = new BioLogica.Organism(BioLogica.Species.Drake, initialAlleles, editableParentSex);
      const targetMother = fixedParentSex === FEMALE ? parentDrakes[FEMALE] : targetParentDrake,
            targetFather = fixedParentSex === MALE ? parentDrakes[MALE] : targetParentDrake;
      targetDrakes = [];
      requiredMoveCount = 0;
      for (let i=0; i<targetDrakeCount; ++i) {
        targetDrakes.push(BioLogica.breed(targetMother, targetFather));
        // We're approximating the combined required move count from the moves required to
        // reach each target offspring independently. Eventually, need a better means of
        // determining the moves required to reach a single parent that can produce all
        // of the necessary target offspring.
        requiredMoveCount = Math.max(requiredMoveCount,
                                      GeniBlocks.GeneticsUtils.
                                        numberOfBreedingMovesToReachDrake(
                                          parentDrakes[MALE], parentDrakes[FEMALE],
                                          editableParentSex === MALE ? editableAlleles : [],
                                          editableParentSex === FEMALE ? editableAlleles : [],
                                          targetDrakes[i]));
      }
    }
    this.setState({ parentDrakes, targetParentDrake, targetDrakes, targetsMatched,
                    clutch, requiredMoveCount, moveCount });
  }

  handleAlleleChange = (sex, chrom, side, prevAllele, newAllele) => {
    let parentDrakes = this.state.parentDrakes.slice(),
        drake = parentDrakes[sex];
    drake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), drake.sex);
    parentDrakes[sex] = drake;
    this.setState({ parentDrakes, clutch: [], moveCount: ++this.state.moveCount });
  }

  handleBreed = () => {
    const { clutchSize } = this.props;
    let { parentDrakes } = this.state,
        clutch = [];
    for (let i = 0; i < clutchSize; ++i) {
      clutch.push(BioLogica.breed(parentDrakes[FEMALE], parentDrakes[MALE]));
    }
    this.setState({ clutch });
  }

  handleDrop = (dragItem, dropTarget) => {
    const { currChallenge, maxChallenge } = this.props;

    if (0 === GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(dragItem.org, dropTarget.org)) {
      this.setState((state) => ({ targetsMatched: new Set(state.targetsMatched).add(dropTarget.id) }));
      if (this.state.targetsMatched.size >= this.state.targetDrakes.length) {
        this.showAlert(true, {
          title: "Good Work!",
          message: "The drake you have created matches the target drake.",
          okButton: currChallenge < maxChallenge ? "Next Challenge" : "Case Log",
          okCallback: this.props.onNextChallenge,
          tryButton: "Try Again",
          tryCallback: this.resetChallenge
        });
      }
      else {
        this.showAlert(true, {
          title: "Good Work!",
          message: "The drake you have created matches the target drake.",
          okButton: "OK"
        });
      }
    }
    else {
      // only incorrect drops count as a move
      this.setState({ moveCount: ++this.state.moveCount });
      this.showAlert(true, {
        title: "That's not the drake!",
        message: "The drake you have created doesn't match the target drake.\nPlease try again.",
        tryButton: "Try Again"
      });
    }
  }

  showAlert(iShow, iOptions) {
    const displayMode = iShow ? 'block' : 'none',
          okButton = document.getElementById("alert-ok-button"),
          tryButton = document.getElementById("alert-try-button");
    let { alertButtonClickHandlers } = this.state;
    if (iShow) {
      document.getElementById("alert-title").innerHTML = iOptions.title || "";
      document.getElementById("alert-message").innerHTML = iOptions.message || "";
      okButton.innerHTML = iOptions.okButton || "";
      okButton.style.display = iOptions.okButton ? 'block' : 'none';
      alertButtonClickHandlers[okButton.id] = iOptions.okCallback || null;
      tryButton.innerHTML = iOptions.tryButton || "";
      tryButton.style.display = iOptions.tryButton ? 'block' : 'none';
      alertButtonClickHandlers[tryButton.id] = iOptions.tryCallback || null;
    }
    else {
      alertButtonClickHandlers[okButton.id] = null;
      alertButtonClickHandlers[tryButton.id] = null;
    }
    this.setState({ alertButtonClickHandlers });
    document.getElementById("alert-wrapper").style.display = displayMode;
  }

  handleAlertButtonClick = (evt) => {
    const { alertButtonClickHandlers } = this.state,
          clientClickHandler = alertButtonClickHandlers[evt.target.id];
    this.showAlert(false);
    if (clientClickHandler)
      clientClickHandler();
  }

  render() {
    const { targetDrakeSize, clutchSize, glowColor, dropGlowColor, correctGlowColor } = this.props,
          { editableParentSex, hiddenAlleles } = this.props.challengeSpec,
          { parentDrakes, targetDrakes, targetsMatched,
            clutch, requiredMoveCount, moveCount } = this.state;

    const handleMotherAlleleChange = function(...args) {
      this.handleAlleleChange(FEMALE, ...args);
    }.bind(this);

    const handleFatherAlleleChange = function(...args) {
      this.handleAlleleChange(MALE, ...args);
    }.bind(this);

    return (
      <div id="challenges-wrapper">
        <DrakeGenomeColumn
              id='left' idPrefix='female' sex='female'
              columnLabel="Female Drake"
              drake={parentDrakes[FEMALE]}
              editable={editableParentSex === FEMALE}
              hiddenAlleles={hiddenAlleles}
              onAlleleChange={handleMotherAlleleChange} />
        <Case3Center
              targetDrakes={targetDrakes} targetDrakeSize={targetDrakeSize}
              targetsMatched={targetsMatched}
              glowColor={glowColor} dropGlowColor={dropGlowColor}
              correctGlowColor={correctGlowColor}
              clutch={clutch} clutchSize={clutchSize}
              onBreed={this.handleBreed}
              onDrop={this.handleDrop}
              requiredMoveCount={requiredMoveCount} moveCount={moveCount} />
        <DrakeGenomeColumn
              id='right' idPrefix='male' sex='male'
              columnLabel="Male Drake"
              drake={parentDrakes[MALE]}
              editable={editableParentSex === MALE}
              hiddenAlleles={hiddenAlleles}
              onAlleleChange={handleFatherAlleleChange} />
      </div>
    );
  }
}

export default Case3Challenge;
