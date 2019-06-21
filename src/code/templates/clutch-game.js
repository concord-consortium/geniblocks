import React, { Component, PropTypes } from 'react';
import { assign } from 'lodash';
import classNames from 'classnames';
import ParentDrakeView from '../fv-components/parent-drake';
import GenomeView from '../components/genome';
import BreedButtonAreaView from '../fv-components/breed-button-area';
import ClutchView from '../components/clutch-view';
import OrganismView from '../components/organism';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';
import ButtonView from '../fv-components/button';
import t from '../utilities/translate';

import GeneticsUtils from '../utilities/genetics-utils';

const durationHatchAnimation = 1333;  // msec

const smallClutchSize = 8, largeClutchSize = 12;

var timers = [];
function clearTimeouts() {
  for (let timer of timers) {
    clearTimeout(timer);
  }
}

var _this,
  animatedComponents = [],

  hatchSoundPlayed = false,
  timerSet = null;

var animationEvents = {
  hatch: { id: 7, inProgress: false, complete: false,
    animate: function() {
      animationEvents.hatch.inProgress = true;
      animationEvents.hatch.complete = false;
      hatchSoundPlayed = false;
      _this.setState({hatchStarted:true});
    },
    onFinish: function() {
      animationEvents.hatch.complete = true;
      _this.setState({animation:"complete"});
    }
  }

};

/**
  @param {Object}   options
  @param {boolean}  options.clearAnimatedComponents - whether to clear the animatedComponents array (default: false)
  @param {Object}   options.reactState - React state to set (default: { animation: 'complete' })
 */
function resetAnimationEvents(options = {}){
  if (timerSet) timerSet.reset();
  clearTimeouts();
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  if (options.clearAnimatedComponents) animatedComponents = [];
  if (_this) _this.setState(assign({ animation: 'complete' }, options.reactState));
}

export default class ClutchGame extends Component {

  static backgroundClasses = 'fv-layout fv-layout-h'

  componentWillMount() {
    _this = this;
    resetAnimationEvents({ showHatchAnimation: true,
                          clearAnimatedComponents: true,
                          reactState: {
                            animation: "complete"
                          } });
  }

  componentWillReceiveProps(nextProps) {
    const { routeSpec: prevRouteSpec, trial: prevTrial } = this.props,
          { level: prevLevel, mission: prevMission, challenge: prevChallenge } = prevRouteSpec,
          { routeSpec: nextRouteSpec, trial: nextTrial } = nextProps,
          { level: nextLevel, mission: nextMission, challenge: nextChallenge } = nextRouteSpec,
          newChallenge = (prevLevel !== nextLevel) || (prevMission !== nextMission) || (prevChallenge !== nextChallenge),
          newTrialInChallenge = !newChallenge && (prevTrial !== nextTrial);

    if (newChallenge || newTrialInChallenge ) {
      if (newChallenge) {
        this.setState({ animation: "complete" });
      }
      resetAnimationEvents({ showHatchAnimation: true,
                            clearAnimatedComponents: true });
    }
  }

  render() {
    const { scale, challengeType, drakes, hiddenAlleles, hiddenParent, trial, numTargets,
      userChangeableGenes, visibleGenes, onChromosomeAlleleChange, onChromosomeAlleleSelected,
      onBreedClutch, onClearClutch, onHatch, onDrakeSubmission, onParentSubmission, onReadyToAnswer } = this.props,
      // 0: mother, 1: father, 2...n: target, n+1...: children
      mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
      father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex),
      targetDrakes = drakes.slice(2, 2 + numTargets),
      isSubmitParents = challengeType === "submit-parents",
      isTestCross = challengeType === "test-cross",
      child = null;

    const handleAlleleChange = function (chrom, side, prevAllele, newAllele, orgName) {
      const index = orgName === "mother" ? 0 : 1;

      if (isTestCross) {
        const isHiddenParent = hiddenParent && ((hiddenParent.sex === BioLogica.FEMALE && orgName === "mother") || (hiddenParent.sex === BioLogica.MALE && orgName === "father"));
        if (!isHiddenParent) {
          onClearClutch(2);
          onChromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, false);
        } else {
          let gene = BioLogica.Genetics.getGeneOfAllele(BioLogica.Species.Drake, newAllele).name;
          onChromosomeAlleleSelected(chrom, side, prevAllele, newAllele, gene, false);
        }
      }
      else {
        onChromosomeAlleleChange(index, chrom, side, prevAllele, newAllele, true);
      }
    };

    const handleFertilize = function () {
        animatedComponents = [];
        if (isTestCross) {
          if (hiddenParent && hiddenParent.hiddenGenotype) onBreedClutch(largeClutchSize);
        } else {
          onBreedClutch(smallClutchSize);
        }
    };
    const handleReadyToAnswer = function () {
      onReadyToAnswer(true);
    };

    const handleSubmitParentGenotype = function () {
      if (hiddenParent.selectedAlleles) {
        const parent = hiddenParent.sex === BioLogica.FEMALE ? mother : father,
          filteredParentAlleles = GeneticsUtils.filterVisibleAlleles(parent.getGenotype().allAlleles, userChangeableGenes, visibleGenes, parent.species);
        let userAlleles = [];
        for (let chromosome of ["1", "2", "XY"]) {
          for (let side of ["a", "b", "x", "y", "x1", "x2"]) {
            if (hiddenParent.selectedAlleles[chromosome] && hiddenParent.selectedAlleles[chromosome][side]) {
              userAlleles = userAlleles.concat(Object.values(hiddenParent.selectedAlleles[chromosome][side]));
            }
          }
        }
        let parentDrakeAlleleArray = filteredParentAlleles.map(t => t.allele);
        let matched = [], unmatched = [];

        // check through all changeable alleles, see if all the parent alleles are matched with the user submission
        for (let i = 0; i < parentDrakeAlleleArray.length; i++) {
          let matchIndex = userAlleles.indexOf(parentDrakeAlleleArray[i]);
          if (matchIndex > -1) {
            // found a match
            matched.push(parentDrakeAlleleArray[i]);
            userAlleles.splice(matchIndex, 1);
          } else {
            unmatched.push(parentDrakeAlleleArray[i]);
          }
        }
        let success = unmatched.length === 0;
        onDrakeSubmission(2, 2, success, null, 0, 1);
      }
    };
    const handleSaveAndClose = function () {
      onReadyToAnswer(false);
    };

    const handleHatch = function () {
      if (!hatchSoundPlayed) {
        onHatch();
        hatchSoundPlayed = true;
      }
    };

    const handleSubmit = function (index, id, child) {
      const childImage = child.getImageName(),
        selectedDrakeIndex = index + 3,
        targetDrakeOrg = new BioLogica.Organism(BioLogica.Species.Drake,
          targetDrakes[0].alleleString,
          targetDrakes[0].sex),
        success = (childImage === targetDrakeOrg.getImageName());

      onDrakeSubmission(2, selectedDrakeIndex, success, null, 0, 1);
    };

    const handleSubmitParents = function () {
      const movesToMakeAllOffspring = targetDrakes.reduce((sum, t) => {
        const targetDrake = new BioLogica.Organism(BioLogica.Species.Drake,
          t.alleleString, t.sex);
        return sum + BioLogica.Organism.numberOfBreedingMovesToReachOrganism(
          mother,
          father,
          [],
          [],
          targetDrake
        );
      }, 0);
      const success = movesToMakeAllOffspring === 0;
      const targetDrakeArray = Array(numTargets).fill().map((e, i) => i + 2);  // [2, ... n]
      onParentSubmission(0, 1, targetDrakeArray, success);
    };

    const targetSize = isSubmitParents ? 210 : 170;
    const targetText = isSubmitParents ? t("~TARGET.OFFSPRING") : t("~TARGET.TARGET_DRAKE");
    const targetDrakeViews = targetDrakes.map((d,idx) => {
      const org = new BioLogica.Organism(BioLogica.Species.Drake,
        d.alleleString,
        d.sex);
      return <OrganismView org={org} width={targetSize} key={idx} />;
    });

    const targetDrakeSection = (!isTestCross && <div className='geniblocks target-drake-container'>
      <div className='drakes'>
        {targetDrakeViews}
      </div>
      <div className="target-drake-text">{targetText}</div>
    </div>
    );

    if (child && animationEvents.hatch.complete) {
      handleHatch();
    }
    let startIndex = isTestCross ? 1 : 2;
    let clutchDrakes = drakes.slice(startIndex + numTargets);
    clutchDrakes = clutchDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));
    const clickDrake = !isSubmitParents ? handleSubmit : null;
    let penView = (isTestCross ? <ClutchView orgs={clutchDrakes} pageSize={isTestCross ? largeClutchSize : smallClutchSize} /> : <ClutchView orgs={clutchDrakes} width={250} onClick={clickDrake} />);

    const motherClassNames = classNames('parent', 'mother'),
          fatherClassNames = classNames('parent', 'father');

    function parentGenomeView(sex) {
      let parentChangeableGenes;
      // Changeable genes are either of the form ["wings, legs"] or [{mother: ["wings"], father:[]}, {mother: [], father: ["wings"]}]
      if (userChangeableGenes[0].mother) {
        parentChangeableGenes = sex === BioLogica.FEMALE ? userChangeableGenes[trial].mother : userChangeableGenes[trial].father;
      } else {
        parentChangeableGenes = userChangeableGenes;
      }

      const isHiddenParent = isTestCross && hiddenParent && (hiddenParent.sex === sex);
      const org = sex === BioLogica.FEMALE ? mother : father,
            uniqueProps = sex === BioLogica.FEMALE
                              ? { orgName: 'mother', className: motherClassNames, isHiddenParent }
          : { orgName: 'father', className: fatherClassNames, isHiddenParent };

      let submitButtonStyle = isHiddenParent && hiddenParent.selectedAlleles ? classNames('test-cross-submit-button', 'geniblocks', 'fv-button') : classNames('test-cross-submit-button', 'geniblocks', 'fv-button', 'disabled');
      let view = isHiddenParent && hiddenParent.hiddenGenotype ?
        <div id="test-cross-guess">
          {testCross}
        </div> :
        <div id="genome-container">
          <GenomeView species={org.species} org={org} {...uniqueProps} editable={parentChangeableGenes.length > 0}
                         ChromosomeImageClass={FVChromosomeImageView} small={ true } hiddenAlleles={hiddenAlleles}
                         userChangeableGenes={ parentChangeableGenes } visibleGenes={ visibleGenes } onAlleleChange={ handleAlleleChange }
            chromosomeHeight={122} defaultUnknown={isHiddenParent} selectedAlleles={isHiddenParent ? hiddenParent.selectedAlleles : null}
          />
          {isHiddenParent &&
            <div>
              <div className='geniblocks test-cross-submit-button-surround'>
                <div className={submitButtonStyle} onClick={handleSubmitParentGenotype}>
                  <div className="button-label unselectable">{t("~BUTTON.SUBMIT")}</div>
                </div>
            </div>
            <div className='geniblocks test-cross-save-button-surround'>
                <div className={classNames('test-cross-save-button', 'geniblocks', 'fv-button')} onClick={handleSaveAndClose}>
                  <div className="button-label unselectable">{t("~BUTTON.SAVE_AND_CLOSE")}</div>
                </div>
              </div>
            </div>}
        </div>;
      return view;
    }
    function parentColumnView(sex) {
      let columnClass = 'column ' + (sex === BioLogica.FEMALE ? 'mother' : 'father');
      return (
        <div className={columnClass}>
          {parentImageView(sex)}
          {parentGenomeView(sex)}
        </div>
      );
    }
    function parentImageView(sex) {
      const org = sex === BioLogica.FEMALE ? mother : father,
        parentName = sex === BioLogica.FEMALE ? "mother" : "father",
        isHiddenParent = isTestCross && hiddenParent && hiddenParent.sex === sex,
        hiddenImage = isHiddenParent ? hiddenParent.hiddenImage : false;
      return <ParentDrakeView className={parentName} org={org} width={parentSize} hidden={hiddenImage} />;
    }

    const bottomButtons = isSubmitParents ?
      (
        <div id="bottom-buttons">
          <ButtonView
            text={t("~BUTTON.SUBMIT_PARENTS")}
            styleName="submit-parents-button"
            onClick={handleSubmitParents} />
        </div>
      ) : null;

    const parentSize = isSubmitParents ? 280 : 250;

    const testCross = isTestCross ?
      (
        <div id="test-cross-buttons">
          <div className="geniblocks ready-to-answer-button-area">
            <div className='geniblocks ready-to-answer-button-surround'>
              {drakes.length > 3 &&
                <div className={classNames('ready-to-answer-button', 'geniblocks', 'fv-button')} onClick={handleReadyToAnswer}>
                  <div className="button-label unselectable">{t("~BUTTON.READY_TO_ANSWER")}</div>
                </div>
              }
              {drakes.length <= 3 &&
                <div className={classNames('ready-to-answer-button', 'geniblocks', 'fv-button', 'disabled')}>
                  <div className="button-label unselectable">{t("~BUTTON.READY_TO_ANSWER")}</div>
                </div>
              }
            </div>
          </div>
        </div>

      ) : null;
    let breedEnabled = true;
    if (isTestCross && hiddenParent) {
      breedEnabled = hiddenParent.hiddenGenotype;
    }

    return (
      <div id="breeding-game">
        <div className="columns centered">
          {parentColumnView(BioLogica.FEMALE)}
          <div className='column center-column'>
            {targetDrakeSection}
            {penView}
            <BreedButtonAreaView  scale={scale} isBreedButtonEnabled={breedEnabled}
                                  isHatchingInProgress={false}
                                  hatchAnimationDuration={durationHatchAnimation}
                                  handleHatchingComplete={animationEvents.hatch.onFinish}
                                  isHatchingComplete={false}
                                  onBreed={handleFertilize} />
          </div>
          {parentColumnView(BioLogica.MALE)}
        </div>

        {bottomButtons}
        {animatedComponents}
      </div>
    );
  }

  componentWillUnmount() {
    _this = null;
    resetAnimationEvents();
  }

  static propTypes = {
    routeSpec: PropTypes.object.isRequired,
    challengeType: PropTypes.string.isRequired,
    scale: PropTypes.number,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    numTargets: PropTypes.number,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array,
    hiddenParent: PropTypes.object,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onChromosomeAlleleSelected: PropTypes.func,
    onBreedClutch: PropTypes.func.isRequired,
    onClearClutch: PropTypes.func,
    onHatch: PropTypes.func,
    onDrakeSubmission: PropTypes.func,
    onParentSubmission: PropTypes.func,
    onReadyToAnswer: PropTypes.func
  }

  static authoredDrakesToDrakeArray = function (authoredChallenge, authoredTrialNumber) {
    // allow for multiple targets
    if (authoredChallenge.challengeType === "submit-parents" &&
      Array.isArray(authoredChallenge.targetDrakes[authoredTrialNumber])) {
      return [authoredChallenge.mother[authoredTrialNumber],
      authoredChallenge.father[authoredTrialNumber]]
        .concat(authoredChallenge.targetDrakes[authoredTrialNumber]);
    } else if (authoredChallenge.challengeType === "test-cross") {
      const motherIdx = Math.floor(Math.random() * authoredChallenge.mother.length),
        fatherIdx = Math.floor(Math.random() * authoredChallenge.father.length);

      let authoredDrakes = [
        authoredChallenge.mother[motherIdx],
        authoredChallenge.father[fatherIdx]
      ];
      return authoredDrakes;
    }

    return [authoredChallenge.mother[authoredTrialNumber],
      authoredChallenge.father[authoredTrialNumber]]
        .concat(authoredChallenge.targetDrakes[authoredTrialNumber]);
  }

  static getNumTargets = function(authoredChallenge, authoredTrialNumber) {
    if (authoredChallenge.challengeType === "submit-parents") {
      if (authoredChallenge.targetDrakes[authoredTrialNumber].randomMatched) {
        return authoredChallenge.targetDrakes[authoredTrialNumber].randomMatched[0].length;
      }
      return authoredChallenge.targetDrakes[authoredTrialNumber].length;
    }
    return 1;
  }
  static shouldShowMovesCounter = function(challengeType) {
    return challengeType !== "test-cross";
  }
  static getHiddenParent = function(authoredChallenge) {
    if (authoredChallenge.challengeType === "test-cross") {
      if (authoredChallenge.hiddenParent) {
        return authoredChallenge.hiddenParent;
      }
    }
    return undefined;
  }
  static getAdditionalClassNameFromProps = function(props) {
    if (props.userChangeableGenes) {
      const trial = props.trial || 0;
      if (props.userChangeableGenes[trial].mother && props.userChangeableGenes[0].mother.length === 0) {
        return "fixed-mother";
      }
      if (props.userChangeableGenes[trial].father && props.userChangeableGenes[0].father.length === 0) {
        return "fixed-father";
      }
    }
  }

}
