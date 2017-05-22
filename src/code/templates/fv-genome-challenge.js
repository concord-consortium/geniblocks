import React, { PropTypes } from 'react';
import { range } from 'lodash';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';
import EggHatchDrakeView from '../fv-components/egg-hatch-drake';
import AnimatedSprite from '../components/animated-sprite';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import FVStableView from '../fv-components/fv-stable';
import FVChangeSexToggle from '../fv-components/fv-change-sex-toggle';
import GeneticsUtils from '../utilities/genetics-utils';
import { generateTrialDrakes } from '../utilities/trial-generator';
import classNames from 'classnames';
import t from '../utilities/translate';

const userDrakeIndex   = 0,
      targetDrakeIndex = 1;

/*
 * HatchDrakeButton
 */
const HatchDrakeButton = ({label, onClick, disabled}) => {

  function handleClick() {
    onClick();
  }

  return (
    <div className={classNames('hatch-drake-button', {disabled})} onClick={handleClick}>
      <div className="button-label hatch-drake-button-label unselectable">
        {label}
      </div>
    </div>
  );
};

HatchDrakeButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

/*
 * YourDrakeView
 */
class YourDrakeView extends React.Component {

  static propTypes = {
    org: PropTypes.object,
    className: PropTypes.string,
    hatchStarted: PropTypes.bool,
    skipHatchAnimation: PropTypes.bool,
    onHatchComplete: PropTypes.func
  }

  render() {
    const { org, className, hatchStarted, skipHatchAnimation, onHatchComplete } = this.props;
    return (
      <div className='your-drake-surround'>
        <EggHatchDrakeView drake={org} id="your-drake" className={className}
                            hatchStarted={hatchStarted} skipHatchAnimation={skipHatchAnimation}
                            onHatchComplete={onHatchComplete}
                            width={300} />
      </div>
    );
  }
}

/*
 * TargetDrakeView
 */
class TargetDrakeView extends React.Component {

  static propTypes = {
    showIntro: PropTypes.bool,
    org: PropTypes.object,
    decorativeGizmo: PropTypes.bool
  }

  state = {
    introComplete: false
  }

  handleIntroComplete = () => {
    this.setState({ introComplete: true });
  }

  render() {
    const { showIntro, org } = this.props,
          { introComplete } = this.state,
          completeDisplayStyle = { display: showIntro && !introComplete ? 'none' : 'flex' },
          introAnimation = <AnimatedSprite
                              classNames='target-gizmo-animation'
                              frames={5} frameWidth={915} duration={1600}
                              onEnd={this.handleIntroComplete} />,
          // instantiating with {display:none} allows images to preload during animation
          completeView = this.props.decorativeGizmo
                          ? <div className='target-drake-gizmo decorative' style={completeDisplayStyle} />
                          : <div className='target-drake-gizmo' style={completeDisplayStyle}>
                              <div id="target-drake-label">
                                {t('~LABEL.TARGET_DRAKE')}
                              </div>
                              <OrganismView id="target-drake" org={org} width={300} />
                            </div>;
    return (
      <div className='target-drake-view'>
        { showIntro && !introComplete ? introAnimation : null }
        { completeView }
      </div>
    );
  }
}

/*
 * FVGenomeChallenge
 */
export default class FVGenomeChallenge extends React.Component {

  static backgroundClasses = 'fv-layout fv-layout-a'

  state = {
    hatchStarted: false
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showUserDrake && !this.props.userDrakeHidden && nextProps.userDrakeHidden)
      this.setState({ hatchStarted: false });
  }

  render() {
    const { drakes, onChromosomeAlleleChange, onSexChange, onDrakeSubmission, onKeepOffspring, challengeType,
            userChangeableGenes, visibleGenes, hiddenAlleles, showUserDrake } = this.props,
          userDrakeDef = drakes[userDrakeIndex],
          isCreationChallenge = challengeType === 'create-unique',
          isMatchingChallenge = challengeType === 'match-target',
          checkHatchButtonLabel = isMatchingChallenge
                                    ? showUserDrake
                                      ? t('~BUTTON.CHECK_DRAKE')
                                      : t('~BUTTON.HATCH_DRAKE')
                                    : t('~GENOME_CHALLENGE.BUTTON.SAVE_DRAKE'),
          userDrake   = new BioLogica.Organism(BioLogica.Species.Drake, userDrakeDef.alleleString, userDrakeDef.sex),
          this_ = this;

    let targetDrakeDef, targetDrake;
    if (isMatchingChallenge) {
      targetDrakeDef = drakes[targetDrakeIndex];
      targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetDrakeDef.alleleString, targetDrakeDef.sex);
    }

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
    const handleCheckHatchButton = function() {
      if (isMatchingChallenge) {
        if (showUserDrake)
        handleSubmit();
        else
          this_.setState({ hatchStarted: true });
      } else {
        let offspringIndices = range(1, drakes.length);
        onKeepOffspring(0, offspringIndices, 6, true);
      }
    };

    let penView;
    if (isCreationChallenge) {
      let [,...keptDrakes] = drakes;
      keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));
      penView = <div className='columns bottom'>
                  <FVStableView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20}/>
                </div>;
    }

    return (
      <div id="genome-challenge">
        <div className="columns centered">
          <div id='left-column' className='column'>
            <GenomeView small={true} ChromosomeImageClass={FVChromosomeImageView} org={ userDrake } onAlleleChange={ handleAlleleChange } userChangeableGenes= { userChangeableGenes } visibleGenes={ visibleGenes } hiddenAlleles={ hiddenAlleles }/>
            <FVChangeSexToggle id="change-sex-buttons" sex={ userDrake.sex } onChange= { handleSexChange } />
          </div>
          <div id="center-column" className='column'>
            <div className='label-container'>
              <div id="your-drake-label" className="column-label">
                {t('~LABEL.YOUR_DRAKE')}
              </div>
            </div>
            <YourDrakeView org={ userDrake }
                            hatchStarted={this.state.hatchStarted || showUserDrake}
                            skipHatchAnimation={showUserDrake}
                            onHatchComplete={handleSubmit} />
            <HatchDrakeButton label={checkHatchButtonLabel} onClick={ handleCheckHatchButton } />
          </div>
          <div id='right-column' className='column'>
            <TargetDrakeView decorativeGizmo={isCreationChallenge} showIntro={true} org={ targetDrake } />
          </div>
        </div>
        <div className="columns bottom">
          {penView}
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
    trials: PropTypes.array,
    moves: PropTypes.number.isRequired,
    goalMoves: PropTypes.number,
    showUserDrake: PropTypes.bool,
    userDrakeHidden: PropTypes.bool.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onSexChange: PropTypes.func.isRequired,
    onDrakeSubmission: PropTypes.func.isRequired,
    onKeepOffspring: PropTypes.func.isRequired,
    challengeType: PropTypes.string.isRequired
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, trial) {
    if (authoredChallenge.challengeType === 'create-unique') {
      return [authoredChallenge.initialDrake];
    } else if (authoredChallenge.trialGenerator) {
      return generateTrialDrakes(authoredChallenge.trialGenerator, trial);
    } else if (Array.isArray(authoredChallenge.initialDrake)) {
      return [authoredChallenge.initialDrake[trial], authoredChallenge.targetDrakes[trial]];
    } else {
      return [authoredChallenge.initialDrake, authoredChallenge.targetDrakes[trial]];
    }
  }

  static calculateGoalMoves = function(drakesArray) {
    if (drakesArray.length > 1) {
      let [initial, target] = drakesArray;
      return GeneticsUtils.numberOfChangesToReachPhenotype(initial, target);
    } else {
      // Skip goal moves calculation for 'create-unique' challenges
      return null;
    }
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
