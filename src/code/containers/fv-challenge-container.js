import React, { Component, PropTypes } from 'react';
import scaleToFit from '../hoc/scale-to-fit';
import { connect } from 'react-redux';
import classNames from 'classnames';
import templates from '../templates';
import loadImage from 'image-promise';
import LoadingView from '../components/loading';
import BottomHUDView from '../fv-components/bottom-hud';
import TopHUDView from '../fv-components/top-hud';
import NotificationContainer from "./notification-container";
import ModalMessageContainer from "./modal-message-container";
import TutorialView from '../components/tutorial-view';

import preloadImageList from '../preload-images.json';

import { changeAllele, selectAllele, changeSex, submitDrake, submitParents,
        keepOffspring, fertilize, breedClutch, hatch,
        changeBasketSelection, changeDrakeSelection, submitEggForBasket,
        winZoomChallenge, toggleMap, enterChallengeFromRoom, showEasterEgg, readyToAnswer, clearClutch } from '../actions';
import { addGameteChromosome, resetGametes,
        addGametesToPool, selectGameteInPool, resetGametePools } from '../modules/gametes';
import { tutorialNext, tutorialPrevious, tutorialMore, tutorialClosed, restartTutorial } from '../modules/tutorials';

class FVChallengeContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imagesLoaded: false,
      showingEasterEgg: false
    };
  }

  componentDidMount() {
    this.preloadImages(this.props.location.id);
  }

  componentWillUpdate(nextProps) {
    if (this.props.location.id !== nextProps.location.id) {
      this.setState({imagesLoaded: false});
      this.preloadImages(nextProps.location.id);
    }
  }

  preloadImages(roomName) {
    const images = preloadImageList[roomName];
    if (images && images.length) {
      const self = this;

      loadImage(images)
        .then(function (allImgs) {
          console.log(allImgs.length, 'images loaded!', allImgs);
          self.setState({imagesLoaded: true});
        })
        .catch(function (err) {
          console.error('One or more images have failed to load :(');
          console.error(err.errored);
          // load page regardless, we probably have an error in our preloaded images paths
          self.setState({imagesLoaded: true});
        });
      } else {
        this.setState({imagesLoaded: true});
      }
  }

  render() {
    if (!this.state.imagesLoaded) {
      return( <LoadingView /> );
    }

    const { template, style, location, showingRoom, tutorials, isRemediation, ...otherProps } = this.props,
          { challengeType, interactionType, routeSpec, trial, numTrials, correct, challenges, showAward } = this.props;

    const _showEasterEgg = () => {
      this.props.onShowEasterEgg();
      this.setState({showingEasterEgg: true});
    };
    const _hideEasterEgg = () => this.setState({showingEasterEgg: false});

    let bgClasses,
        easterEggClass,
        maxScore,
        goalMoves,
        showChallengeWidgets = false,
        showMoveCounter = true,
        MainView;

    if (showingRoom) {
      bgClasses = classNames('mission-backdrop', 'fv-layout', 'room', location.id),
      easterEggClass = this.state.showingEasterEgg ? 'visible' : 'hidden',

      MainView = (
        <div>
          <div id="enter-challenge-hotspot" className="hotspot" onClick={ this.props.onEnterChallenge }/>
          <div id="sprite-1" className="room-sprite" />
          <div id="sprite-2" className="room-sprite" />
          <div id="sprite-3" className="room-sprite" />
          <div id="easter-egg-trigger" onClick={ _showEasterEgg } />
          <div id="easter-egg" className={easterEggClass} onClick={ _hideEasterEgg }>
            <div id="easter-egg-image"/>
            <div id="close-easter-egg">X</div>
          </div>
        </div>
      );
    } else {
      const Template = templates[template];

      let additionalClassName;
      if (Template.getAdditionalClassNameFromProps) {
        additionalClassName = Template.getAdditionalClassNameFromProps(otherProps);
      }

      bgClasses = classNames('mission-backdrop', Template.backgroundClasses,
                              challengeType, interactionType, isRemediation ? "remediation" : null, additionalClassName);
      maxScore = Template.maxScore;
      goalMoves = this.props.goalMoves;
      showChallengeWidgets = true;

      if (Template.shouldShowMovesCounter) {
        showMoveCounter = Template.shouldShowMovesCounter(challengeType, interactionType);
      }

      const { steps, currentStep, moreVisible, visible } = tutorials;
      const { onTutorialNext, onTutorialPrevious, onTutorialMore, onTutorialClosed } = this.props;

      MainView = (
        <div id="mission-wrapper">
          <Template {...otherProps} />
          <TutorialView  steps={steps} visible={visible} currentStep={currentStep} moreVisible={moreVisible}
            onTutorialNext={onTutorialNext} onTutorialPrevious={onTutorialPrevious} onTutorialMore={onTutorialMore} onTutorialClosed={onTutorialClosed}/>
        </div>
      );
    }

    const showTutorialButton = !showingRoom && this.props.tutorials.steps && this.props.tutorials.steps.length > 0;

    return (
      <div id="challenges" className={bgClasses} style={style}>
        <TopHUDView location={ this.props.location } onToggleMap={this.props.onToggleMap} isDialogComplete={this.props.messages.length <= 1}/>
        { MainView }
        <BottomHUDView routeSpec={routeSpec} numChallenges={challenges} trial={trial + 1} trialCount={numTrials}
          currScore={correct} maxScore={maxScore} currMoves={this.props.moves} showAward={showAward}
          goalMoves={goalMoves} showMoveCounter={showMoveCounter} gems={this.props.gems} showChallengeWidgets={showChallengeWidgets}
          showTutorialButton={showTutorialButton} onRestartTutorial={this.props.onRestartTutorial} isRemediation={isRemediation} />
        <NotificationContainer />
        <ModalMessageContainer />
      </div>
    );
  }

  static propTypes = {
    style: PropTypes.object,
    template: PropTypes.string,
    challengeType: PropTypes.string,
    interactionType: PropTypes.string,
    trial: PropTypes.number,
    trials: PropTypes.array,
    numTrials: PropTypes.number,
    numTargets: PropTypes.number,
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    routeSpec: PropTypes.object,
    correct: PropTypes.number,
    moves: PropTypes.number,
    goalMoves: PropTypes.number,
    gems: PropTypes.array,
    challenges: PropTypes.number,
    showAward: PropTypes.bool,
    onToggleMap: PropTypes.func,
    onEnterChallenge: PropTypes.func,
    location: PropTypes.object,
    showingRoom: PropTypes.bool,
    messages: PropTypes.array,
    tutorials: PropTypes.object,
    showIntroductionAnimations: PropTypes.bool,
    onTutorialNext: PropTypes.func,
    onTutorialPrevious: PropTypes.func,
    onTutorialMore: PropTypes.func,
    onTutorialClosed: PropTypes.func,
    onRestartTutorial: PropTypes.func,
    onShowEasterEgg: PropTypes.func,
    onReadyToAnswer: PropTypes.func,
    isRemediation: PropTypes.bool
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      challengeType: state.challengeType,
      interactionType: state.interactionType,
      instructions: state.instructions,
      showUserDrake: state.showUserDrake,
      drakes: state.drakes,
      gametes: state.gametes,
      userChangeableGenes: state.userChangeableGenes,
      visibleGenes: state.visibleGenes,
      hiddenAlleles: state.hiddenAlleles,
      hiddenParent: state.hiddenParent,
      baskets: state.baskets,
      trial: state.trial,
      trials: state.trials,
      numTrials: state.numTrials,
      numTargets: state.numTargets,
      routeSpec: state.routeSpec,
      correct: state.correct,
      errors: state.errors,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden,
      gems: state.gems,
      challenges: state.challenges,
      showAward: state.modalDialog.showAward,
      zoomUrl: state.zoomUrl,
      zoomScoringMetrics: state.zoomScoringMetrics,
      location: state.location,
      showingRoom: state.showingRoom,
      messages: state.notifications.messages,
      // drag/drop experiment option for enabling custom drag layer rather
      // than HTML5 drag/drop dragImage
      useCustomDragLayer: true,
      tutorials: state.tutorials,
      showIntroductionAnimations: state.showIntroductionAnimations,
      showDrakeColorHint: state.showDrakeColorHint,
      isRemediation: state.isRemediation
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele, incrementMoves=true) =>
      dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, incrementMoves)),
    onChromosomeAlleleSelected: (chrom, side, prevAllele, newAllele, gene, incrementMoves=false) =>
      dispatch(selectAllele(chrom, side, prevAllele, newAllele, gene, incrementMoves)),
    onSexChange: (index, newSex, incrementMoves=true) =>
      dispatch(changeSex(index, newSex, incrementMoves)),
    onDrakeSubmission: (targetDrakeIndex, userDrakeIndex, correct, incorrectAction, motherIndex, fatherIndex) =>
      dispatch(submitDrake(targetDrakeIndex, userDrakeIndex, correct, incorrectAction, motherIndex, fatherIndex)),
    onParentSubmission: (motherIndex, fatherIndex, targetDrakeIndices, success) =>
      dispatch(submitParents(motherIndex, fatherIndex, targetDrakeIndices, success)),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onAddGametesToPool: (index, gametes) => dispatch(addGametesToPool(index, gametes)),
    onSelectGameteInPool: (sex, index) => dispatch(selectGameteInPool(sex, index)),
    onFertilize: () => dispatch(fertilize()),
    onBreedClutch: (clutchSize) => dispatch(breedClutch(clutchSize)),
    onClearClutch: (index) => dispatch(clearClutch(index)),
    onHatch: () => dispatch(hatch()),
    onResetGametes: (incrementMoves) => dispatch(resetGametes(incrementMoves)),
    onResetGametePools: () => dispatch(resetGametePools()),
    onKeepOffspring: (index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake) => dispatch(keepOffspring(index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake)),
    onChangeBasketSelection: (selectedIndices) => dispatch(changeBasketSelection(selectedIndices)),
    onChangeDrakeSelection: (selectedIndices) => dispatch(changeDrakeSelection(selectedIndices)),
    onSubmitEggForBasket: (...args) => dispatch(submitEggForBasket(...args)),
    onWinZoomChallenge: (stats) => dispatch(winZoomChallenge(stats)),
    onToggleMap: (isVisible) => dispatch(toggleMap(isVisible)),
    onEnterChallenge: () => dispatch(enterChallengeFromRoom()),
    onTutorialNext: () => dispatch(tutorialNext()),
    onTutorialPrevious: () => dispatch(tutorialPrevious()),
    onTutorialMore: () => dispatch(tutorialMore()),
    onTutorialClosed: () => dispatch(tutorialClosed()),
    onRestartTutorial: () => dispatch(restartTutorial()),
    onShowEasterEgg: () => dispatch(showEasterEgg()),
    onReadyToAnswer: (ready) => dispatch(readyToAnswer(ready))
  };
}

const containerStyle = { width: '100vw', height: '100vh' },
      dimensionsOptions = { className: 'challenge-container', containerStyle },
      // for Geniventure, content size is determined by the static size of the background image
      // minWidth/minHeight determine the limits below which we stop scaling and allow scrolling
      contentFn = function() { return { width: 1920, height: 1080,
                                        minWidth: 930, minHeight: 465 }; },
      FVScaledContainer = scaleToFit(dimensionsOptions, contentFn)(FVChallengeContainer),
      FVConnectedContainer = connect(mapStateToProps, mapDispatchToProps)(FVScaledContainer);

export default FVConnectedContainer;
