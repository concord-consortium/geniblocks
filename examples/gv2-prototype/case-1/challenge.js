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
import DrakeGenomeColumn from '../js/drake-genome-column';
import EVENT from '../event';
import _ from 'lodash';

/*
 * Left column contains target drake and trial/goal feedback views
 */
class Case1ChallengeLeft extends React.Component {

  static propTypes = {
    targetDrake: React.PropTypes.object.isRequired,
    moveCount: React.PropTypes.number.isRequired,
    requiredMoveCount: React.PropTypes.number.isRequired,
    trialIndex: React.PropTypes.number.isRequired,
    trialCount: React.PropTypes.number.isRequired
  }

  render() {
    const { targetDrake, moveCount, requiredMoveCount, trialIndex, trialCount } = this.props;
    return (
      <div id='left-column' className='column'>
        <div id='target-drake-label' className='column-label'>Target Drake</div>

        <GeniBlocks.OrganismGlowView id='target-drake' className='drake-image'
                                    org={targetDrake} color='#FFFFAA' size={200}/>

        <GeniBlocks.FeedbackView id='trial-feedback' className='feedback-view'
                                text={["TRIAL", `${trialIndex} of ${trialCount}`]}/>

        <GeniBlocks.FeedbackView id='goal-feedback' className='feedback-view'
                                text={[`GOAL is ${requiredMoveCount} MOVES`,
                                        `Your moves: ${moveCount}`]}/>
      </div>
    );
  }
}

/*
 * Center column contains your drake, sex change buttons, and currently
 * contains the user alert elements, although that's likely to change.
 */
class Case1ChallengeCenter extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    yourDrake: React.PropTypes.object.isRequired,
    yourDrakeSex: React.PropTypes.number.isRequired,
    isDrakeHidden: React.PropTypes.bool.isRequired,
    showDrakeForConfirmation: React.PropTypes.bool.isRequired,
    onSexChange: React.PropTypes.func.isRequired,
    onAlertButtonClick: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    document.getElementById("alert-ok-button").onclick = this.props.onAlertButtonClick;
    document.getElementById("alert-try-button").onclick = this.props.onAlertButtonClick;
  }

  render() {
    const { sexLabels, yourDrake, yourDrakeSex,
            isDrakeHidden, showDrakeForConfirmation } = this.props;
    return (
      <div id='center-column' className='column'>
        <div id="your-drake-label" className="column-label">Your Drake</div>

        <GeniBlocks.QuestionOrganismGlowView
            id='your-drake' className='drake-image'
            org={yourDrake} color='#FFFFAA' size={200}
            hidden={isDrakeHidden && !showDrakeForConfirmation}/>

        <div id="change-sex-buttons" className="no-label"></div>
        <GeniBlocks.ChangeSexButtons
            id='change-sex-buttons' className='no-label'
            sex={sexLabels[yourDrakeSex]}
            species="Drake"
            onChange={this.props.onSexChange}/>

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

/*
 * Right column contains the drake genome and the "Check Drake" button
 */
class Case1ChallengeRight extends React.Component {

  static propTypes = {
    hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    yourDrake: React.PropTypes.object.isRequired,
    onAlleleChange: React.PropTypes.func.isRequired,
    onCheckDrake: React.PropTypes.func.isRequired
  }

  render() {
    const { hiddenAlleles, yourDrake } = this.props;
    return (
      <DrakeGenomeColumn id='right-column' idPrefix='your' columnLabel="Chromosome Control" 
                          drake={yourDrake} showDrake={false} editable={true}
                          style={{marginTop: 50, top: 50}}
                          hiddenAlleles={hiddenAlleles}
                          onAlleleChange={this.props.onAlleleChange}
                          buttonID='test-drake-button' buttonLabel="Check Drake"
                          onButtonClick={this.props.onCheckDrake}/>
    );
  }
}

/*
 * The Case1Challenge component coordinates the efforts of the Case1ChallengeLeft,
 * Case1ChallengeCenter, and Case1ChallengeRight components and manages the
 * the challenge state. It, in turn, will eventually be managed (along with the
 * Case1Playground component) by the Case1 component.
 */
class Case1Challenge extends React.Component {

  static propTypes = {
    sexLabels: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    caseSpec: React.PropTypes.shape({
                title: React.PropTypes.string.isRequired,
                path: React.PropTypes.string.isRequired
              }).isRequired,
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
  }

  static contextTypes = {
    logEvent: React.PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = {
      moveCount: 0,
      requiredMoveCount: 0,
      trialIndex: 1,
      showDrakeForConfirmation: false,
      alertButtonClickHandlers: {}
    };
  }

  componentWillMount() {
    this.resetChallenge();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currChallenge !== nextProps.currChallenge) {
      this.resetChallenge();
    }
  }

  resetDrakes(iCallback) {
    const { drakeAlleles } = this.props.challengeSpec;
    let requiredMoveCount = 0,
        targetDrakeSex, targetDrake,
        yourDrakeSex, yourDrake;
    // regenerate if we generate drakes that are too close to each other
    while (requiredMoveCount < 3) {
      targetDrakeSex = Math.floor(2 * Math.random());
      targetDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                            drakeAlleles, targetDrakeSex);
      yourDrakeSex = Math.floor(2 * Math.random());
      yourDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                          drakeAlleles, yourDrakeSex);
      requiredMoveCount = GeniBlocks.GeneticsUtils.
                            numberOfChangesToReachPhenotype(yourDrake, targetDrake);
    }
    this.setState({ targetDrakeSex, targetDrake,
                    yourDrakeSex, yourDrake,
                    moveCount: 0, requiredMoveCount,
                    showDrakeForConfirmation: false },
                  iCallback);
  }

  resetChallenge = () => {
    this.setState({ trialIndex: 1 });
    this.resetDrakes(function() {
      // called after the setState call is complete
      const { logEvent } = this.context,
            { caseSpec, currChallenge } = this.props,
            { targetDrake, yourDrake, requiredMoveCount } = this.state;
      logEvent(EVENT.STARTED_CHALLENGE, {
                title: caseSpec.title,
                route: caseSpec.path,
                case: 1,
                challenge: currChallenge,
                targetSex: targetDrake.sex,
                targetAlleles: targetDrake.getAlleleString(),
                drakeSex: yourDrake.sex,
                drakeAlleles: yourDrake.getAlleleString(),
                requiredMoveCount
              });
    });
  }

  advanceMove() {
    this.setState({ moveCount: ++this.state.moveCount });
  }

  continueTrial = () => {
    this.setState({ showDrakeForConfirmation: false });
  }

  nextTrial = () => {
    this.setState({ trialIndex: ++this.state.trialIndex });
    this.resetDrakes();
  }

  advanceTrial = () => {
    const { currChallenge, lastChallenge } = this.props,
          { trialCount } = this.props.challengeSpec,
          { trialIndex } = this.state;
    if (trialIndex < trialCount) {
      this.showAlert(true, {
            title: "Good work!",
            message: "The drake you have created matches the target drake.",
            okButton: "OK",
            okCallback: this.nextTrial
          });
    }
    else {
      // user has completed a challenge
      if (currChallenge < lastChallenge) {
        // user has completed a challenge other than the last
        this.showAlert(true, { 
              title: "Good work!",
              message: "The drake you have created matches the target drake.",
              okButton: "Next Challenge",
              okCallback: this.handleAdvanceChallenge,
              tryButton: "Try Again",
              tryCallback: this.resetChallenge
            });
      }
      else {
        // user has completed the last challenge
        this.showAlert(true, {
              title: "Congratulations!",
              message: "You've completed all the trials in this challenge.",
              okButton: "Go back to the Case Log",
              okCallback: this.handleAdvanceChallenge,
              tryButton: "Try Again",
              tryCallback: this.resetChallenge
            });
      }
    }
  }

  /*
   * Placeholder for a real scoring algorithm
   */
  computeStars() {
    const { moveCount, requiredMoveCount } = this.state;
    if (moveCount <= requiredMoveCount) return 3;
    if (moveCount <= requiredMoveCount + 2) return 2;
    return 1;
  }

  handleAdvanceChallenge = () => {
    const { logEvent } = this.context,
          { caseSpec, currChallenge } = this.props,
          { moveCount, requiredMoveCount } = this.state;
    logEvent(EVENT.COMPLETED_CHALLENGE, {
              title: caseSpec.title,
              route: caseSpec.path,
              case: 1,
              challenge: currChallenge,
              moveCount,
              requiredMoveCount,
              starsAwarded: this.computeStars()
            });
    this.props.onAdvanceChallenge();
  }

  handleSexChange = (iSex) => {
    let { yourDrake, yourDrakeSex, moveCount, requiredMoveCount } = this.state;
    const { logEvent } = this.context,
          prevDrakeSex = yourDrake.sex,
          prevAlleleString = yourDrake.getAlleleString(),
                          // replace alleles lost when switching to male and back
          { sexLabels } = this.props,
          { drakeAlleles } = this.props.challengeSpec,
          alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(
                          yourDrake.genetics, yourDrake.getAlleleString(), drakeAlleles);
    yourDrakeSex = sexLabels.indexOf(iSex);
    yourDrake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, yourDrakeSex);
    this.advanceMove();
    this.setState({ yourDrake, yourDrakeSex });
    logEvent(EVENT.CHANGED_SEX, {
              drakeId: this.state.trialIndex,
              oldSex: prevDrakeSex,
              newSex: yourDrake.sex,
              oldAlleles: prevAlleleString,
              newAlleles: yourDrake.getAlleleString(),
              moveCount: moveCount + 1, // increment ourselves to avoid setState callback
              requiredMoveCount
            });
  }

  handleAlleleChange = (chrom, side, prevAllele, newAllele) => {
    let { yourDrake, moveCount, requiredMoveCount } = this.state;
    const { logEvent } = this.context,
          prevAlleleString = yourDrake.getAlleleString();
    yourDrake.genetics.genotype.replaceAlleleChromName(chrom, side, prevAllele, newAllele);
    yourDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                        yourDrake.getAlleleString(),
                                        yourDrake.sex);
    this.advanceMove();
    this.setState({ yourDrake });
    logEvent(EVENT.CHANGED_ALLELE, {
              drakeId: this.state.trialIndex,
              chromosome: chrom,
              side: side,
              oldAllele: prevAllele,
              newAllele: newAllele,
              oldAlleles: prevAlleleString,
              newAlleles: yourDrake.getAlleleString(),
              moveCount: moveCount + 1, // increment ourselves to avoid setState callback
              requiredMoveCount
            });
  }

  handleCheckDrake = () => {
    const { logEvent } = this.context,
          { yourDrake, targetDrake, moveCount, requiredMoveCount } = this.state,
          diffCount = GeniBlocks.GeneticsUtils.numberOfChangesToReachPhenotype(
                                                yourDrake, targetDrake),
          isCorrect = (diffCount === 0);

    logEvent(EVENT.DRAKE_SUBMITTED, {
              correctPhenotype: _.cloneDeep(targetDrake.phenotype.characteristics),
              submittedPhenotype: _.cloneDeep(yourDrake.phenotype.characteristics),
              moveCount,
              requiredMoveCount,
              correct: isCorrect
            });

    this.setState({ showDrakeForConfirmation: true });

    if (isCorrect) {
      // checked drake is correct
      this.advanceTrial();
    }
    else {
      // Checking when incorrect counts as a move
      this.advanceMove();
      // checked drake is not correct
      this.showAlert(true, {
            title: "That's not the drake!",
            message: "The drake you have created doesn't match the target drake.\nPlease try again.",
            tryButton: "Try Again",
            tryCallback: this.continueTrial
          });
    }
  }

  showAlert(iShow, iOptions) {
    const displayMode = iShow ? 'block' : 'none',
          okButton = document.getElementById('alert-ok-button'),
          tryButton = document.getElementById('alert-try-button');
    let { alertButtonClickHandlers } = this.state;
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
    }
    else {
      alertButtonClickHandlers[okButton.id] = null;
      alertButtonClickHandlers[tryButton.id] = null;
    }
    this.setState({ alertButtonClickHandlers });
    document.getElementById("overlay").style.display = displayMode;
    document.getElementById("alert-wrapper").style.display = displayMode;
  }

  handleAlertButtonClick = (evt) => {
    const targetID = evt.target.id,
          { alertButtonClickHandlers } = this.state;
    const clientClickHandler = alertButtonClickHandlers[targetID];
    this.showAlert(false);
    if (clientClickHandler)
      clientClickHandler();
  }

  render() {
    const { hiddenAlleles, isDrakeHidden, trialCount } = this.props.challengeSpec,
          { targetDrake, yourDrake, yourDrakeSex, showDrakeForConfirmation,
            moveCount, requiredMoveCount, trialIndex } = this.state;
    return (
      <div id='challenges-wrapper'>
        <Case1ChallengeLeft targetDrake={targetDrake}
                            moveCount={moveCount}
                            requiredMoveCount={requiredMoveCount}
                            trialIndex={trialIndex}
                            trialCount={trialCount}/>
        <Case1ChallengeCenter sexLabels={this.props.sexLabels}
                            yourDrake={yourDrake} yourDrakeSex={yourDrakeSex}
                            isDrakeHidden={isDrakeHidden}
                            showDrakeForConfirmation={showDrakeForConfirmation}
                            onSexChange={this.handleSexChange}
                            onAlertButtonClick={this.handleAlertButtonClick}/>
        <Case1ChallengeRight hiddenAlleles={hiddenAlleles}
                            yourDrake={yourDrake}
                            onAlleleChange={this.handleAlleleChange}
                            onCheckDrake={this.handleCheckDrake}/>
      </div>
    );
  }
}

export default Case1Challenge;
