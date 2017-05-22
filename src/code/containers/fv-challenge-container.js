import React, { Component, PropTypes } from 'react';
import scaleToFit from '../hoc/scale-to-fit';
import { connect } from 'react-redux';
import classNames from 'classnames';
import templates from '../templates';
import BottomHUDView from '../fv-components/bottom-hud';
import TopHUDView from '../fv-components/top-hud';
import { changeAllele, changeSex, submitDrake, navigateToNextChallenge,
        keepOffspring, fertilize, hatch, completeChallenge,
        changeBasketSelection, changeDrakeSelection, submitEggForBasket } from '../actions';
import { addGameteChromosome, resetGametes,
        addGametesToPool, selectGameteInPool, resetGametePools } from '../modules/gametes';

class FVChallengeContainer extends Component {

  render() {
    const { template, style, ...otherProps } = this.props,
          { challengeType, interactionType, routeSpec, trial, numTrials, correct } = this.props;

    if (!template) return null;

    const Template = templates[this.props.template],
          bgClasses = classNames('mission-backdrop', Template.backgroundClasses,
                                  challengeType, interactionType),
          maxScore = Template.maxScore;

    return (
      <div id="challenges" className={bgClasses} style={style}>
        // TODO: put location names in the authoring document
        <TopHUDView location={"Hatchery"} />
        <div id="mission-wrapper">
          <Template {...otherProps} />
        </div>
        <BottomHUDView level={routeSpec.level + 1} trial={trial + 1} trialCount={numTrials}
                       currScore={correct} maxScore={maxScore}/>
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
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    routeSpec: PropTypes.object,
    correct: PropTypes.number
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
      baskets: state.baskets,
      trial: state.trial,
      trials: state.trials,
      numTrials: state.numTrials,
      routeSpec: state.routeSpec,
      correct: state.correct,
      errors: state.errors,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden,
      // drag/drop experiment option for enabling custom drag layer rather
      // than HTML5 drag/drop dragImage
      useCustomDragLayer: true
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele, incrementMoves=true) =>
      dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, incrementMoves)),
    onSexChange: (index, newSex, incrementMoves=true) =>
      dispatch(changeSex(index, newSex, incrementMoves)),
    onDrakeSubmission: (targetDrakeIndex, userDrakeIndex, correct, incorrectAction) =>
      dispatch(submitDrake(targetDrakeIndex, userDrakeIndex, correct, incorrectAction)),
    onNavigateNextChallenge: () => dispatch(navigateToNextChallenge()),
    onCompleteChallenge: () => dispatch(completeChallenge()),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onAddGametesToPool: (index, gametes) => dispatch(addGametesToPool(index, gametes)),
    onSelectGameteInPool: (sex, index) => dispatch(selectGameteInPool(sex, index)),
    onFertilize: (gamete1, gamete2) => dispatch(fertilize(gamete1, gamete2)),
    onHatch: () => dispatch(hatch()),
    onResetGametes: (incrementMoves) => dispatch(resetGametes(incrementMoves)),
    onResetGametePools: () => dispatch(resetGametePools()),
    onKeepOffspring: (index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake) => dispatch(keepOffspring(index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake)),
    onChangeBasketSelection: (selectedIndices) => dispatch(changeBasketSelection(selectedIndices)),
    onChangeDrakeSelection: (selectedIndices) => dispatch(changeDrakeSelection(selectedIndices)),
    onSubmitEggForBasket: (...args) => dispatch(submitEggForBasket(...args))
  };
}

const containerStyle = { width: '100vw', height: '100vh' },
      dimensionsOptions = { className: 'challenge-container', containerStyle },
      // for Geniventure, content size is determined by the static size of the background image
      // minWidth/minHeight determine the limits below which we stop scaling and allow scrolling
      contentFn = function() { return { width: 1920, height: 1080,
                                        minWidth: 1200, minHeight: 600 }; },
      FVScaledContainer = scaleToFit(dimensionsOptions, contentFn)(FVChallengeContainer),
      FVConnectedContainer = connect(mapStateToProps, mapDispatchToProps)(FVScaledContainer);

export default FVConnectedContainer;
