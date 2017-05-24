import React, { Component, PropTypes } from 'react';
import { assign, clone, shuffle } from 'lodash';
import classNames from 'classnames';
import { gametePoolSelector, motherSelectedGameteIndex, fatherSelectedGameteIndex } from '../modules/gametes';
import ParentDrakeView from '../fv-components/parent-drake';
import GenomeView from '../components/genome';
import GametePenView from '../components/gamete-pen';
import BreedButtonAreaView from '../fv-components/breed-button-area';
import ClutchView from '../components/clutch-view';
import OrganismView from '../components/organism';
import FVGameteImageView from '../fv-components/fv-gamete-image';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';
import InteractiveGamete from '../fv-components/interactive-gamete';
import t from '../utilities/translate';

      // Determines (with some random perturbation) the initial time interval in msec for the
      // slot machine animation. Acceleration (delta) is then applied to this base interval.
const durationHatchAnimation = 1333;  // msec

var timers = [];
function clearTimeouts() {
  for (let timer of timers) {
    clearTimeout(timer);
  }
}

var _this,
  animatedComponents = [],
  authoredGameteCounts = [0, 0],
  changeableDrakeType = "",
  gameteLayoutConstants = [{}, {}],
  challengeDidChange = true,

  gameteDisplayStyle = { display: "none" },

  hatchSoundPlayed = false,
  timerSet = null;

function oneOf(array) {
  if (!array || !array.length) return;
  return array[Math.floor(array.length * Math.random())];
}

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
  @param {boolean}  options.showStaticGametes - whether to show or hide the static gamete images (default: false)
  @param {boolean}  options.showHatchAnimation - whether to show the hatch animation (default: false)
  @param {boolean}  options.clearAnimatedComponents - whether to clear the animatedComponents array (default: false)
  @param {Object}   options.reactState - React state to set (default: { animation: 'complete', animatingGametes: null })
 */
function resetAnimationEvents(options = {}){
  if (timerSet) timerSet.reset();
  clearTimeouts();
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  showStaticGametes(!!options.showStaticGametes);
  if (options.clearAnimatedComponents) animatedComponents = [];
  if (_this) _this.setState(assign({ animation: 'complete', animatingGametes: null }, options.reactState));
}

function areGametesEmpty(gametes) {
  const length = gametes && gametes.length;
  for (let i = 0; i < length; ++i) {
    let gamete = gametes[i];
    if (gamete && Object.keys(gamete).length)
      return false;
  }
  return true;
}

function showStaticGametes(show) {
  gameteDisplayStyle = show ? {} : { display: "none" };
}

function randomGamete(sex) {
  return {
    '1': oneOf(['a', 'b']),
    '2': oneOf(['a', 'b']),
    'XY': sex ? oneOf(['x1', 'x2']) : oneOf(['x', 'y'])
  };
}

function findCompatibleGametes(mother, father, child) {
  const childDrake = new BioLogica.Organism(BioLogica.Species.Drake, child.alleleString, child.sex),
        motherDrake = new BioLogica.Organism(BioLogica.Species.Drake, mother.alleleString, mother.sex),
        fatherDrake = new BioLogica.Organism(BioLogica.Species.Drake, father.alleleString, father.sex),
        motherChromosomes = motherDrake.getGenotype().chromosomes,
        fatherChromosomes = fatherDrake.getGenotype().chromosomes;

  function isMatchForChild(fatherGamete, motherGamete) {
    let   alleleString = "";
    for (let name in motherChromosomes) {
      let side = motherGamete[name];
      let chromosome = motherChromosomes[name][side];
      if (chromosome && chromosome.alleles && chromosome.alleles.length)
        alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
    }
    for (let name in fatherChromosomes) {
      let side = fatherGamete[name];
      let chromosome = fatherChromosomes[name][side];
      if (chromosome && chromosome.alleles && chromosome.alleles.length)
        alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
    }
    const candidate = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, child.sex);
    return candidate.getImageName() === childDrake.getImageName();
  }

  // shuffle so we don't preferentially choose one side over the other (e.g. 'a' over 'b')
  const fatherc1Alleles = shuffle(['a', 'b']),
        fatherc2Alleles = shuffle(['a', 'b']),
        fatherXYAllele = child.sex ? 'x' : 'y',
        motherc1Alleles = shuffle(['a', 'b']),
        motherc2Alleles = shuffle(['a', 'b']),
        motherXYAlleles = shuffle(['x1', 'x2']);

  // loop through possible allele combinations until we find a match
  // max to consider is 32 combinations (2^5) because we know the sex
  for (let fc1 of fatherc1Alleles) {
    for (let fc2 of fatherc2Alleles) {
      const fatherGamete = { '1': fc1, '2': fc2, 'XY': fatherXYAllele };
      for (let mc1 of motherc1Alleles) {
        for (let mc2 of motherc2Alleles) {
          for (let mxy of motherXYAlleles) {
            const motherGamete = { '1': mc1, '2': mc2, 'XY': mxy };
            if (isMatchForChild(fatherGamete, motherGamete))
              return [fatherGamete, motherGamete];
          }
        }
      }
    }
  }

  return null;
}

export default class ClutchGame extends Component {

  state = {
    isIntroComplete: false
  }

  static backgroundClasses = 'fv-layout fv-layout-c layout-b'

  componentWillMount() {
    _this = this;
    challengeDidChange = true;
    resetAnimationEvents({ showStaticGametes: false,
                          showHatchAnimation: this.props.showUserDrake,
                          clearAnimatedComponents: true,
                          reactState: {
                            animatingGametes: null, animatingGametesInPools: [0, 0],
                            animation: "complete", isIntroComplete: false
                          } });
  }

  componentWillReceiveProps(nextProps) {
    const { routeSpec: prevRouteSpec, trial: prevTrial, gametes: prevGametes } = this.props,
          { level: prevLevel, mission: prevMission, challenge: prevChallenge } = prevRouteSpec,
          { currentGametes: prevCurrentGametes } = prevGametes,
          { routeSpec: nextRouteSpec, trial: nextTrial, gametes: nextGametes, showUserDrake } = nextProps,
          { level: nextLevel, mission: nextMission, challenge: nextChallenge } = nextRouteSpec,
          { currentGametes: nextCurrentGametes } = nextGametes,
          newChallenge = (prevLevel !== nextLevel) || (prevMission !== nextMission) || (prevChallenge !== nextChallenge),
          newTrialInChallenge = !newChallenge && (prevTrial !== nextTrial),
          gametesReset = !areGametesEmpty(prevCurrentGametes) && areGametesEmpty(nextCurrentGametes);

    if (newChallenge || newTrialInChallenge || gametesReset) {
      if (newChallenge) {
        challengeDidChange = true;
        this.setState({ animatingGametes: null, animatingGametesInPools: [0, 0],
                        animation: "complete", isIntroComplete: false });
      }
      resetAnimationEvents({ showStaticGametes: !challengeDidChange,
                            showHatchAnimation: showUserDrake,
                            clearAnimatedComponents: true });
    }
  }

  activeSelectionAnimations = 0;

  render() {
    const { interactionType, scale, showUserDrake, drakes, gametes, hiddenAlleles,
            userChangeableGenes, visibleGenes, userDrakeHidden, onChromosomeAlleleChange,
            onBreedClutch, onHatch, onResetGametes, onDrakeSubmission, moves } = this.props,
          { currentGametes } = gametes,
          { animatingGametes } = this.state,
          targetDrake = drakes[2], // 0: mother, 1: father, 2: target, 3...: children
          isCreationChallenge = true,
          isMatchingChallenge = true,
          isSelectingGametes = interactionType === 'select-gametes',
          isSelectingChromosomes = !isSelectingGametes,
          challengeClasses = {
                                'creation': isCreationChallenge,
                                'matching': isMatchingChallenge,
                                'select-chromosomes': isSelectingChromosomes,
                                'select-gametes': isSelectingGametes
                              },
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

    let child = null;

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele, orgName) {
      let index = orgName === "mother" ? 0 : 1;
      onChromosomeAlleleChange(index, chrom, side, prevAllele, newAllele);
    };
    const handleFertilize = function() {
      animatedComponents = [];
      onBreedClutch(8);
    };

    const handleHatch = function () {
      if (!hatchSoundPlayed) {
        onHatch();
        hatchSoundPlayed = true;
      }
    };

    const handleSubmit = function (index, id, child) {
      let childImage = child.getImageName(),
          success = false;

      const targetDrakeOrg = new BioLogica.Organism(BioLogica.Species.Drake,
                                                    targetDrake.alleleString,
                                                    targetDrake.sex);
      success = (childImage === targetDrakeOrg.getImageName());
      onDrakeSubmission(2, index, success);
    };
    const handleReset = function() {
      if (moves >= 1) {
        // Treat reset and submit the same after a mistake has been made
        handleSubmit();
        return;
      }
      resetAnimationEvents({ showStaticGametes: true, showHatchAnimation: showUserDrake });
      onResetGametes(true);
    };

    function getUnselectedChromosomesMap(chromosomes, selectedChromosomes) {
      let unselectedChromosomes = {};
      Object.keys(chromosomes).forEach(chromosomeName => {
        let chromosomePair = chromosomes[chromosomeName];
        if (!unselectedChromosomes[chromosomeName]) {
          // Initialize the chromosome pair if it does not exist
          unselectedChromosomes[chromosomeName] = {};
        }
        Object.keys(chromosomePair).forEach(chromosomeSide => {
          let chromosome = chromosomePair[chromosomeSide];
          if (selectedChromosomes[chromosomeName] === chromosomeSide) {
            // Set selected chromosomes to null
            unselectedChromosomes[chromosomeName][chromosomeSide] = null;
          } else {
            // Copy over unselected chromosomes
            unselectedChromosomes[chromosomeName][chromosomeSide] = chromosome;
          }
        });
      });
      return unselectedChromosomes;
    }

    function getGameteChromosomeMap(parent, gamete, side) {
      var parentChromosomes = parent && parent.getGenotype().chromosomes;
      let chromName, chromMap = {};
      for (chromName in parentChromosomes) {
        const chromSide = gamete[chromName];
        chromMap[chromName] = { [side]: chromSide ? parentChromosomes[chromName][chromSide] : null };
      }
      return chromMap;
    }

    function getChromosomesFromMap(chromosomeMap, side) {
      return [chromosomeMap[1] && chromosomeMap[1][side],
              chromosomeMap[2] && chromosomeMap[2][side],
              chromosomeMap.XY && chromosomeMap.XY[side]];
    }

    const gametesClass = classNames('gametes', { 'unfertilized': !drakes[2] });

    const targetDrakeOrg = targetDrake && targetDrake.alleleString
                              ? new BioLogica.Organism(BioLogica.Species.Drake,
                                                        targetDrake.alleleString,
                                                        targetDrake.sex)
                              : null,
          targetDrakeSection = <div className='geniblocks target-drake-container'>
                                 <OrganismView org={targetDrakeOrg} width={170}/>
                                 <div className="target-drake-text">Target Drake</div>
                               </div>;
    let offspringButtons, offspringButtonsVisible = false,
        ovumView, spermView, penView;
    if (child && animationEvents.hatch.complete) {
      if (showUserDrake)
        handleHatch();
      offspringButtonsVisible = true;
    }
    const saveOrSubmitTitle = isCreationChallenge ? t("~BUTTON.SAVE_DRAKE") : t("~BUTTON.SUBMIT"),
          tryAgainOrResetTitle = isCreationChallenge ? t("~BUTTON.TRY_AGAIN") : t("~BUTTON.RESET");
    function disableDrag() { return false; }
    offspringButtons = (
      <div className={classNames('offspring-buttons', {hidden: !offspringButtonsVisible})} key={2}>
        <a className='submit-button gb-img-button' onDragStart={disableDrag} onClick={ handleSubmit } key={3}>
          <div>{ saveOrSubmitTitle }</div>
        </a>
        <a className='reset-button gb-img-button' onDragStart={disableDrag} onClick={ handleReset } key={4}>
          <div>{ tryAgainOrResetTitle }</div>
        </a>
      </div>
    );
    const motherSelectedChromosomes = animatingGametes ? animatingGametes[1] : currentGametes[1],
          fatherSelectedChromosomes = animatingGametes ? animatingGametes[0] : currentGametes[0],
          motherUnselectedChromosomesMap = getUnselectedChromosomesMap(mother.genetics.genotype.chromosomes, motherSelectedChromosomes),
          fatherUnselectedChromosomesMap = getUnselectedChromosomesMap(father.genetics.genotype.chromosomes, fatherSelectedChromosomes),
          motherBaseChromosomes = animatingGametes ? animatingGametes[3] : currentGametes[1],
          fatherBaseChromosomes = animatingGametes ? animatingGametes[2] : currentGametes[0],
          femaleGameteChromosomeMap = getGameteChromosomeMap(mother, motherBaseChromosomes, 'a'),
          maleGameteChromosomeMap = getGameteChromosomeMap(father, fatherBaseChromosomes, 'b'),
          ovumChromosomes = getChromosomesFromMap(femaleGameteChromosomeMap, 'a'),
          spermChromosomes = getChromosomesFromMap(maleGameteChromosomeMap, 'b'),
          ovumClasses = classNames('ovum', challengeClasses),
          spermClasses = classNames('sperm', challengeClasses);

    ovumView  = <FVGameteImageView className={ovumClasses}  isEgg={true}  chromosomes={ovumChromosomes} displayStyle={gameteDisplayStyle} />;
    spermView = <FVGameteImageView className={spermClasses} isEgg={false} chromosomes={spermChromosomes} displayStyle={gameteDisplayStyle} />;

    let keptDrakes = drakes.slice(3);
    keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));

    if (isCreationChallenge) {
      penView = <div className='columns bottom'>
                  <ClutchView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20} onClick={handleSubmit}/>
                </div>;
    }

    function gametesToShowInPool(sex) {
      const parentGametes = gametePoolSelector(sex)(_this.props.gametes);
      if (_this.state.animatingGametesInPools) {
        // if we're animating gametes into the pool, just show the number
        // that have been animated so far.
        const gameteCount = _this.state.animatingGametesInPools[sex];
        return parentGametes.slice(0, gameteCount);
      }
      return parentGametes;
    }

    const parentGenomeClass = classNames('parent', challengeClasses),
          motherGametes = gametesToShowInPool(BioLogica.FEMALE),
          fatherGametes = gametesToShowInPool(BioLogica.MALE);

    function parentGenomeView(sex) {
      const org = sex === BioLogica.FEMALE ? mother : father,
            uniqueProps = sex === BioLogica.FEMALE
                              ? { orgName: 'mother', 
                                  chromosomes: motherUnselectedChromosomesMap, 
                                  editable: changeableDrakeType === "mother" || changeableDrakeType === "all"}
                              : { orgName: 'father', 
                                  chromosomes: fatherUnselectedChromosomesMap,
                                  editable: changeableDrakeType === "father" || changeableDrakeType === "all"};
      return <GenomeView className={parentGenomeClass}  species={org.species} org={org} {...uniqueProps}
                         ChromosomeImageClass={FVChromosomeImageView} small={ true } hiddenAlleles={hiddenAlleles}
                         userChangeableGenes={ visibleGenes } visibleGenes={ userChangeableGenes } onAlleleChange={ handleAlleleChange } 
                         chromosomeHeight={122} />;
    }

    function parentGametePen(sex) {
      if (!isSelectingGametes) return null;
      const uniqueProps = sex === BioLogica.FEMALE
                              ? { id: 'mother-gamete-pen', idPrefix: 'mother-gamete-',
                                  gametes: motherGametes,
                                  selectedIndex: motherSelectedGameteIndex(gametes) }
                              : { id: 'father-gamete-pen', idPrefix: 'father-gamete-',
                                  gametes: fatherGametes,
                                  selectedIndex: fatherSelectedGameteIndex(gametes) };
      return <GametePenView {...uniqueProps} columns={1} sex={sex}
                            rows={authoredGameteCounts[sex]} containerHeight={250} containerWidth={48}
                            showChromosomes='selected' GameteImageClass={InteractiveGamete}
                            onClick={_this.handleGameteSelected}
                            onReportLayoutConstants={function(layout) {
                                                        gameteLayoutConstants[sex] = clone(layout);
                                                      }}  />;
    }

    return (
      <div className={classNames("", {matching: isMatchingChallenge})} id="egg-game">
        <div className="columns centered">
          <div className='column'>
            <ParentDrakeView className="mother" org={ mother } />
            { parentGenomeView(BioLogica.FEMALE) }
            { parentGametePen(BioLogica.FEMALE) }
          </div>
          <div className='egg column'>
            {offspringButtons}
            <BreedButtonAreaView challengeClasses={classNames(challengeClasses)} scale={scale}
                                  isBreedButtonEnabled={true}
                                  showUserDrake={showUserDrake} userDrakeHidden={userDrakeHidden}
                                  isHatchingInProgress={false}
                                  hatchAnimationDuration={durationHatchAnimation}
                                  handleHatchingComplete={animationEvents.hatch.onFinish}
                                  isHatchingComplete={false}
                                  onBreed={handleFertilize} />
            <div className={ gametesClass }>
              <div className='half-genome half-genome-left' id="mother-gamete-genome">
                { ovumView }
              </div>
              <div className='half-genome half-genome-right' id="father-gamete-genome">
                { spermView }
              </div>
            </div>
          </div>
          <div className='column'>
            <ParentDrakeView className="father" org={ father } />
            { parentGenomeView(BioLogica.MALE) }
            { parentGametePen(BioLogica.MALE) }
          </div>
        </div>
        {penView}
        {targetDrakeSection}
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
    interactionType: PropTypes.string,
    scale: PropTypes.number,
    showUserDrake: PropTypes.bool.isRequired,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    gametes: PropTypes.shape({
              currentGametes: PropTypes.array
            }).isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    userDrakeHidden: PropTypes.bool,
    hiddenAlleles: PropTypes.array,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onSelectGameteInPool: PropTypes.func.isRequired,
    onBreedClutch: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onResetGametes: PropTypes.func,
    onKeepOffspring: PropTypes.func,
    onDrakeSubmission: PropTypes.func,
    moves: PropTypes.number
  }

  static authoredGametesToGametePools = function(authoredChallenge, drakes, trial) {
    const mother = drakes && drakes[0],
          father = drakes && drakes[1],
          target = drakes && drakes[2],
          matchingGametes = target && findCompatibleGametes(mother, father, target),
          fatherPool = [],
          motherPool = [],
          gameteCounts = authoredChallenge && authoredChallenge.gameteCounts,
          motherGameteCount = gameteCountForTrial(BioLogica.FEMALE, trial),
          fatherGameteCount = gameteCountForTrial(BioLogica.MALE, trial);

    function gameteCountForTrial(sex, trial) {
      if (!gameteCounts) return 0;
      const hasPerTrialGameteCounts = Array.isArray(gameteCounts) && Array.isArray(gameteCounts[0]);
      return hasPerTrialGameteCounts ? gameteCounts[trial][sex] : gameteCounts[sex];
    }

    authoredGameteCounts = [fatherGameteCount, motherGameteCount];

    for (let i = 0; i < motherGameteCount; ++i) {
      motherPool.push((i === 0) && matchingGametes
                        ? matchingGametes[1]
                        : randomGamete(BioLogica.FEMALE));
    }
    for (let i = 0; i < fatherGameteCount; ++i) {
      fatherPool.push((i === 0) && matchingGametes
                        ? matchingGametes[0]
                        : randomGamete(BioLogica.MALE));
    }

    return [shuffle(fatherPool), shuffle(motherPool)];
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge, trial, unscrambledTrialNumber) {
    const changeableDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                                   authoredChallenge.changeableDrakes[trial].alleles,
                                                   BioLogica.FEMALE),
          staticDrake = new BioLogica.Organism(BioLogica.Species.Drake,
                                               authoredChallenge.staticDrakes[trial].alleles,
                                               BioLogica.FEMALE);
    changeableDrakeType = authoredChallenge.changeableDrakeType[unscrambledTrialNumber];
    let fatherSpec, motherSpec;
    if (changeableDrakeType === "mother") {
      motherSpec = { alleles: changeableDrake.getAlleleString(), sex: BioLogica.FEMALE };
      fatherSpec = { alleles: staticDrake.getAlleleString(), sex: BioLogica.MALE };
    } else {
      motherSpec = { alleles: staticDrake.getAlleleString(), sex: BioLogica.FEMALE };
      fatherSpec = { alleles: changeableDrake.getAlleleString(), sex: BioLogica.MALE };
    }
    return [motherSpec, fatherSpec, authoredChallenge.targetDrakes[trial]];
  }

  static calculateGoalMoves = function() {
    // each incorrect submission counts as one move
    // the goal is to have no incorrect submissions
    return 0;
  }

}
