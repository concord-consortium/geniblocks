import React, { Component, PropTypes } from 'react';
import OrganismGlowView from '../components/organism-glow';
import GenomeView from '../components/genome';
import ChangeSexButtons from '../components/change-sex-buttons';
import FeedbackView from '../components/feedback';
import ButtonView from '../components/button';
import GeneticsUtils from '../utilities/genetics-utils';
import { generateTrialDrakes } from '../utilities/trial-generator';

const userDrakeIndex   = 0,
      targetDrakeIndex = 1;

export default class GenomeChallengeTemplate extends Component {

  render() {
    const { drakes, instructions, onChromosomeAlleleChange, onSexChange, onDrakeSubmission,
            userChangeableGenes, visibleGenes, hiddenAlleles, showUserDrake, userDrakeHidden, trial, numTrials } = this.props,
          userDrakeDef = drakes[userDrakeIndex],
          targetDrakeDef = drakes[targetDrakeIndex],
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex),
          targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex);

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
      onChromosomeAlleleChange(userDrakeIndex, chrom, side, prevAllele, newAllele);
    };
    const handleSexChange = function(newSex) {
      onSexChange(userDrakeIndex, newSex);
    };
    const handleSubmit = function() {
      let correct = targetDrake.getImageName() === userDrake.getImageName();
      onDrakeSubmission(targetDrakeIndex, userDrakeIndex, correct);
    };

    const instructionsBanner = instructions
                                ? <div className="instructions-banner">
                                    <div className="instructions-text">{instructions}</div>
                                  </div>
                                : null,
          userDrakeStyle = !showUserDrake && userDrakeHidden ? "hiddenDrake" : "";

    return (
      <div id="genome-challenge">
        {instructionsBanner}
        <div className='column'>
          <div id="target-drake-label" className="column-label">Target Drake</div>
          <OrganismGlowView id="target-drake" org={ targetDrake } />
          <FeedbackView id='trial-feedback' className='feedback-view'
                                text={["TRIAL", `${trial+1} of ${numTrials}`]}/>
          <FeedbackView id='goal-feedback' className='feedback-view'
                                text={[`GOAL is ${this.props.goalMoves} MOVES`,
                                        `Your moves: ${this.props.moves}`]}/>
        </div>
        <div id="center-column" className='column'>
          <div id="your-drake-label" className="column-label">Your Drake</div>
          <OrganismGlowView org={ userDrake } id="your-drake" className={userDrakeStyle} />
          <ChangeSexButtons id="change-sex-buttons" sex={ userDrake.sex } onChange= { handleSexChange } showLabel={false} species="Drake"/>
        </div>
        <div className='column'>
          <div id="your-drake-label" className="column-label">Chromosome Control</div>
          <GenomeView org={ userDrake } onAlleleChange={ handleAlleleChange } userChangeableGenes= { userChangeableGenes } visibleGenes={ visibleGenes } hiddenAlleles={ hiddenAlleles }/>
          <ButtonView label="~BUTTON.CHECK_DRAKE" onClick={ handleSubmit } />
        </div>
      </div>
    );
  }

  static propTypes = {
    instructions: PropTypes.string,
    drakes: PropTypes.array.isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    trial: PropTypes.number.isRequired,
    trials: PropTypes.array.isRequired,
    numTrials: PropTypes.number.isRequired,
    moves: PropTypes.number.isRequired,
    goalMoves: PropTypes.number.isRequired,
    showUserDrake: PropTypes.bool,
    userDrakeHidden: PropTypes.bool.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onDrakeSubmission: PropTypes.func.isRequired
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, trial) {
    if (authoredChallenge.trialGenerator) {
      return generateTrialDrakes(authoredChallenge.trialGenerator, trial);
    } else if (Array.isArray(authoredChallenge.initialDrake)) {
      return [authoredChallenge.initialDrake[trial], authoredChallenge.targetDrakes[trial]];
    } else {
      return [authoredChallenge.initialDrake, authoredChallenge.targetDrakes[trial]];
    }
  }

  static calculateGoalMoves = function(drakesArray) {
    let [initial, target] = drakesArray;
    return GeneticsUtils.numberOfChangesToReachPhenotype(initial, target);
  }

  static logState = function(state) {
    return {
      initialDrake: state.drakes[0],
      targetDrake: state.drakes[1],
      goalMoves: state.goalMoves,
      trials: state.numTrials,
      trial: state.trial
    };
  }
}
