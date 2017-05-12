/*
 * Note: This began as a copy of the (non-FV) EggGame template so that the
 * FableVision version of the template could be developed without breaking
 * the existing EggGame implementations. Once development is complete,
 * we can decide whether to simply retire the non-FV EggGame template, or
 * perhaps find some way for them to share potentially redundant code if
 * there is a desire to keep the old versions around.
 */

import React, { Component, PropTypes } from 'react';
import { assign, clone, cloneDeep, shuffle, range } from 'lodash';
import classNames from 'classnames';
import { motherGametePool, fatherGametePool, gametePoolSelector,
        motherSelectedGameteIndex, fatherSelectedGameteIndex } from '../modules/gametes';
import ParentDrakeView from '../fv-components/parent-drake';
import GenomeView from '../components/genome';
import GametePenView, { getGameteLocation } from '../components/gamete-pen';
import BreedButtonAreaView from '../fv-components/breed-button-area';
import FVStableView from '../fv-components/fv-stable';
import FVGameteImageView from '../fv-components/fv-gamete-image';
import AnimatedComponentView from '../components/animated-component';
import TargetDrakeView from '../fv-components/target-drake';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';
import InteractiveGamete from '../fv-components/interactive-gamete';
import TimerSet from '../utilities/timer-set';
import unscaleProperties from '../utilities/unscale-properties';
import t from '../utilities/translate';

// debugging options to shorten animation/randomization for debugging purposes
// IMPORTANT: remember to set these back to their defaults (e.g. false, false, 0) before committing
const debugSkipIntroGameteAnimation = true,  // set to true to skip intro gamete animation
      debugSkipRandomGameteAnimation = false, // set to true to skip randomized gamete animation
      debugSkipFirstGameteStage = false,      // set to true to skip the one-by-one animation stage
      debugTotalGameteCount = 0;              // non-zero value stops randomization after # gametes

      // Determines (with some random perturbation) the initial time interval in msec for the
      // slot machine animation. Acceleration (delta) is then applied to this base interval.
const slotMachineBaseInterval = 30, // msec
      // The delta applied to the interval on each iteration
      slotMachineIntervalAcceleration = 15, // msec
      // # of high-speed iterations before deceleration begins
      slotMachineInitialIterations = 8,
      // total duration of slot machine animation
      slotMachineAnimationDuration = 2500,  // msec
      // time from beginning of challenge to initial animation
      delayStartShowGametesAnimation = 1000,  // msec
      // pause after slot machine selection of chromosome before showing selection in half-genome
      delayStartAutoSelectChromosome = 500, // msec
      // pause after user selection of chromosome before showing selection in half-genome
      delayStartUserSelectChromosome = 1000,  // msec
      // animation speed used for most animations during early animation stages
      defaultAnimationSpeed = 'fast',
      // animation speed used for most animations during later animation stages
      enhancedAnimationSpeed = 'noWobble',
      // speed of animation of chromosomes from parent genome to half-genome
      selectChromosomesAnimationSpeed = 'medium',
      // wait for animating chromosomes to arrive at half-genome before showing selection and labels
      delayShowSelectedChromosomeLabels = 2000, // msec
      // pause after animating chromosomes to half-genome before animating to gamete
      delayStartMoveChromosomesToGamete = 0,  // msec
      durationFertilizationAnimation = 3000,  // msec
      durationHatchAnimation = 1333;  // msec

function animatedChromosomeImageHOC(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      displayStyle: PropTypes.object,
      yChromosome: PropTypes.bool
    }

    render() {
      const { displayStyle, ...otherProps } = this.props,
            { yChromosome } = this.props,
            defaultWidth = 19,
            defaultHeight = yChromosome ? 62 : 90,
            sizeRatio = displayStyle.size != null ? displayStyle.size : 1,
            width = defaultWidth * sizeRatio,
            height = defaultHeight * sizeRatio;
      return <WrappedComponent width={width} height={height} {...otherProps} />;
    }
  };
}
const AnimatedChromosomeImageView = animatedChromosomeImageHOC(FVChromosomeImageView);

// a "reasonable" lookup function for the two gametes
function lookupGameteChromosomeDOMElement(sex, chromosomeName) {
  let wrapperId = sex === BioLogica.MALE ? "father-gamete-genome" : "mother-gamete-genome",
      wrapper = document.getElementById(wrapperId),
      chromosomePositions = {"1": 0, "2": 1, "XY": 2};
  let genomeWrapper = wrapper.getElementsByClassName("genome")[0];
  return genomeWrapper.querySelectorAll(".fv-chromosome-image")[chromosomePositions[chromosomeName]];
}

function findBothElements(sex, name, el, scale=1){
  let t = lookupGameteChromosomeDOMElement(sex, name);
  let s = el.getElementsByClassName("chromosome-allele-container")[0]; // the image of the alleles inside the chromosome container
  let positions = {
    startPositionRect : unscaleProperties(s.getClientRects()[0], scale),
    targetPositionRect: unscaleProperties(t.getClientRects()[0], scale)
  };
  return positions;
}

var timers = [];
function _setTimeout(fn, delay) {
  timers.push(setTimeout(fn, delay));
}
function clearTimeouts() {
  for (let timer of timers) {
    clearTimeout(timer);
  }
}

var _this,
  animatedComponents = [],
  animatedComponentToRender,
  startDisplay, targetDisplay,
  lastAnimatedComponentId = 0,
  animationTimeline = {},
  mother, father,
  authoredGameteCounts = [0, 0],
  gameteLayoutConstants = [{}, {}],
  authoredDrakes = [],
  challengeDidChange = true,
  ovumTarget, spermTarget,
  animatedOvumView, animatedSpermView,

  motherDrakeStart, motherGameteStart,
  fatherDrakeStart, fatherGameteStart,

  gameteDisplayStyle = { display: "none" },
  chromosomeDisplayStyle = {display: "none"},

  showHatchAnimation = false,
  hatchSoundPlayed = false,
  offsetTopDrake = 130, offsetTopGamete = 160,
  timerSet = null;

function oneOf(array) {
  if (!array || !array.length) return;
  return array[Math.floor(array.length * Math.random())];
}

function initialAnimGametes() {
  // gametes [0,1] represent the highlighted chromosomes in the parent genomes
  // gametes [2,3] represent the highlighted chromosomes in the half-genomes (proto-child)
  return [{}, {}, {}, {}];
}

var animationEvents = {
  showGametes: { id: 0, count: 0, complete: false,
    animate: function() {
      let motherPositions = {
          startPositionRect : motherDrakeStart,
          targetPositionRect: motherGameteStart,
          startSize: 0.3,
          endSize: 0.3
        };

      let fatherPositions = {
        startPositionRect : fatherDrakeStart,
        targetPositionRect: fatherGameteStart,
        startSize: 0.3,
        endSize: 0.3
      };

      let displayStyleContainer = {animated: true, size: 0.3};
      animatedOvumView  = <FVGameteImageView className="ovum" isEgg={true} displayStyle={displayStyleContainer} />;
      animatedSpermView = <FVGameteImageView className="sperm" isEgg={false} displayStyle={displayStyleContainer} />;

      let opacity = {
        start: 1.0,
        end: 1.0
      };

      // hide the static gametes while the animated gametes are visible
      showStaticGametes(false);

      if (!debugSkipIntroGameteAnimation) {
        animateMultipleComponents([animatedOvumView, animatedSpermView],
                                  [motherPositions, fatherPositions],
                                  opacity, defaultAnimationSpeed,
                                  animationEvents.showGametes.id,
                                  animationEvents.showGametes.onFinish);
      }
      else {
        animationEvents.showGametes.onFinish(animationEvents.showGametes.id);
        animationEvents.showGametes.onFinish(animationEvents.showGametes.id);
      }

      _this.setState({animation:"showGametes"});
    },
    onFinish: function() {
      if (++animationEvents.showGametes.count === 2){
        animationEvents.showGametes.complete = true;
        animatedComponents = [];
        animationEvents.moveGametes.animate();
        _this.setState({ animation: 'complete' });
      }
    }
  },
  moveGametes: { id: 1, count: 0, complete: false,
    animate: function() {
      let motherPositions = {
          startPositionRect : motherGameteStart,
          targetPositionRect: ovumTarget,
          startSize: 0.3,
          endSize: 1.0
      };

      let fatherPositions = {
        startPositionRect : fatherGameteStart,
        targetPositionRect: spermTarget,
        startSize: 0.3,
        endSize: 1.0
      };

      let opacity = {
        start: 1.0,
        end: 1.0
      };

      if (!debugSkipIntroGameteAnimation) {
        animateMultipleComponents([animatedOvumView, animatedSpermView],
                                  [motherPositions, fatherPositions],
                                  opacity, defaultAnimationSpeed,
                                  animationEvents.moveGametes.id,
                                  animationEvents.moveGametes.onFinish);
      }
      else {
        animationEvents.moveGametes.onFinish(animationEvents.moveGametes.id);
        animationEvents.moveGametes.onFinish(animationEvents.moveGametes.id);
      }

      _this.setState({animation:"moveGametes"});
    },
    onFinish: function() {
      if (++animationEvents.moveGametes.count === 2){
        animatedComponents = [];
        // show static gametes when move complete
        showStaticGametes(true);
        animationEvents.moveGametes.complete = true;
        animationEvents.selectChromosome.ready = true;
        // show gamete placeholders
        chromosomeDisplayStyle = {};

        // show gamete formation animation for gamete selection challenges
        if (_this.props.interactionType === 'select-gametes')
          animationEvents.randomizeChromosomes.animate();
        else
          _this.setState({ animation: "complete", isIntroComplete: true });
      }
    }
  },
  randomizeChromosomes: { id: 2, stages: [], count: 0, complete: false, ready: false,
    animate: function() {
      let stages = animationEvents.randomizeChromosomes.stages,
          stageIndex = animationEvents.randomizeChromosomes.count,
          // # of high-speed iterations before deceleration begins
          initialIterations = slotMachineInitialIterations,
          gametesCompleted = 0,
          BOTH_SEXES = -1;

      // add a stage which randomizes a single chromosome
      function addChromAnimStage(sex, speed, chromName, sides) {
        let stage = { type: 'chromosome', speed, gameteIndex: gametesCompleted,
                      chroms: [{ sex, name: chromName, sides }] };
        stages.push(stage);
      }

      // add a stage which randomizes one or two entire gametes
      function addGenomeAnimStage(sex, speed) {
        let stage = { type: 'chromosome', speed, chroms: [], gameteIndex: gametesCompleted };
        if ((sex === BioLogica.FEMALE) || (sex === BOTH_SEXES)) {
          stage.chroms.push({ sex: BioLogica.FEMALE, name: '1', sides: ['a', 'b'] });
          stage.chroms.push({ sex: BioLogica.FEMALE, name: '2', sides: ['a', 'b'] });
          stage.chroms.push({ sex: BioLogica.FEMALE, name: 'XY', sides: ['x1', 'x2'] });
        }
        if ((sex === BioLogica.MALE) || (sex === BOTH_SEXES)) {
          stage.chroms.push({ sex: BioLogica.MALE, name: '1', sides: ['a', 'b'] });
          stage.chroms.push({ sex: BioLogica.MALE, name: '2', sides: ['a', 'b'] });
          stage.chroms.push({ sex: BioLogica.MALE, name: 'XY', sides: ['x', 'y'] });
        }
        stages.push(stage);
      }

      // add a stage which animates the chromosomes to the gamete to the pool
      function addGameteAnimStage(sex, speed) {
        stages.push({ type: 'gamete', sex, speed });
      }

      if (!stages.length) {
        if (!debugSkipFirstGameteStage) {
          if (gametesCompleted < authoredGameteCounts[BioLogica.FEMALE]) {
            // randomize mother's chromosomes one at a time
            addChromAnimStage(BioLogica.FEMALE, defaultAnimationSpeed, '1', ['a', 'b']);
            addChromAnimStage(BioLogica.FEMALE, defaultAnimationSpeed, '2', ['a', 'b']);
            addChromAnimStage(BioLogica.FEMALE, defaultAnimationSpeed, 'XY', ['x1', 'x2']);
            addGameteAnimStage(BioLogica.FEMALE, defaultAnimationSpeed);
          }

          if (gametesCompleted < authoredGameteCounts[BioLogica.MALE]) {
            // randomize father's chromosomes one at a time
            addChromAnimStage(BioLogica.MALE, defaultAnimationSpeed, '1', ['a', 'b']);
            addChromAnimStage(BioLogica.MALE, defaultAnimationSpeed, '2', ['a', 'b']);
            addChromAnimStage(BioLogica.MALE, defaultAnimationSpeed, 'XY', ['x', 'y']);
            addGameteAnimStage(BioLogica.MALE, defaultAnimationSpeed);
          }
          ++ gametesCompleted;
        }

        if (!debugTotalGameteCount || (debugTotalGameteCount > gametesCompleted)) {
          if (gametesCompleted < authoredGameteCounts[BioLogica.FEMALE]) {
            // randomize mother's chromosomes simultaneously
            addGenomeAnimStage(BioLogica.FEMALE, enhancedAnimationSpeed);
            addGameteAnimStage(BioLogica.FEMALE, enhancedAnimationSpeed);
          }

          if (gametesCompleted < authoredGameteCounts[BioLogica.MALE]) {
            // randomize father's chromosomes simultaneously
            addGenomeAnimStage(BioLogica.MALE, enhancedAnimationSpeed);
            addGameteAnimStage(BioLogica.MALE, enhancedAnimationSpeed);
          }
          ++ gametesCompleted;
        }

        // randomize the remaining gametes for both parents simultaneously
        const totalGameteCount = debugTotalGameteCount || Math.max.apply(Math, authoredGameteCounts);
        for (gametesCompleted; gametesCompleted < totalGameteCount; ++gametesCompleted) {
          let sexes = BOTH_SEXES;
          if (gametesCompleted >= authoredGameteCounts[BioLogica.MALE])
            sexes = BioLogica.FEMALE;
          else if (gametesCompleted >= authoredGameteCounts[BioLogica.FEMALE])
            sexes = BioLogica.MALE;
          addGenomeAnimStage(sexes, enhancedAnimationSpeed);
          addGameteAnimStage(sexes, enhancedAnimationSpeed);
        }

        stages.push({ type: 'complete' });
      }

      function selectStageChromosomes(speed, chroms) {
        let animatingGametes = cloneDeep(_this.state.animatingGametes) || initialAnimGametes();
        chroms.forEach(({ sex, name }) => {
          let gamete = animatingGametes[sex],
              side = gamete[name];
          if (side) {
            const parentId = sex === BioLogica.FEMALE ? 'mother' : 'father',
                  chromContainerId = `${parentId}-${name}-${side}`,
                  elt = document.getElementById(chromContainerId).parentNode;
            // this will trigger an animation which will call onFinish() when complete,
            // which will trigger the next stage of the animation.
            _this.selectChromosomes(sex, speed, [{name, side, elt}],
                                    animationEvents.randomizeChromosomes.onFinish);
          }
        });
        animatingGametes[2] = clone(animatingGametes[0]);
        animatingGametes[3] = clone(animatingGametes[1]);
        // delay appearance of labels until the chromosomes arrive
        _setTimeout(() => _this.setState({ animatingGametes }), delayShowSelectedChromosomeLabels);
      }

      function toggleAnimatingGameteChromosome(sex, chromName, sides) {
        let animatingGametes = _this.state.animatingGametes || initialAnimGametes(),
            gamete = animatingGametes[sex],
            currSide = gamete[chromName],
            newSide = currSide != null
                        ? (currSide === sides[0] ? sides[1] : sides[0])
                        : oneOf(sides);
        animatingGametes[sex] = assign({}, gamete, { [chromName]: newSide });
         _this.setState({ animatingGametes });
      }

      function setFinalAnimatingGameteChromosome(sex, chromName, gameteIndex) {
        let animatingGametes = _this.state.animatingGametes || initialAnimGametes(),
            gametePool = gametePoolSelector(sex)(_this.props.gametes),
            srcGamete = gametePool && gametePool[gameteIndex],
            side = srcGamete && srcGamete[chromName],
            dstGamete = animatingGametes[sex];
        animatingGametes[sex] = assign({}, dstGamete, { [chromName]: side });
         _this.setState({ animatingGametes });
      }

      function animateStage(stage) {
        timerSet = new TimerSet({ onComplete: function() {
                                    selectStageChromosomes(stage.speed, stage.chroms);
                                  } });
        const baseInterval = slotMachineBaseInterval,
              totalDuration = slotMachineAnimationDuration;
        stage.chroms.forEach(function({ sex, name, sides }) {
          const halfBaseInterval = baseInterval / 2,
                // initial interval is randomizes so timers aren't synchronized
                initialInterval = Math.round(halfBaseInterval + halfBaseInterval * Math.random());
          timerSet.add(function(iteration, options) {
            if ((iteration < initialIterations) || (this.totalInterval < options.totalDuration)) {
              toggleAnimatingGameteChromosome(options.sex, options.name, options.sides);
            }
            else {
              setFinalAnimatingGameteChromosome(options.sex, options.name, options.gameteIndex);
              return false;
            }
          }, { sex, name, sides, gameteIndex: stage.gameteIndex,
                initialInterval, totalDuration,
                // intervals increase with time/iterations to simulate slowing slot machine
                interval: function(iteration, options) {
                  var baseInterval = options.baseInterval || slotMachineBaseInterval,
                      initialInterval = options.initialInterval || baseInterval,
                      intervalAccel = options.interval.accel || slotMachineIntervalAcceleration,
                      interval = iteration >= initialIterations
                                  ? baseInterval + (iteration - initialIterations + 1) * intervalAccel
                                  : initialInterval;
                  return interval;
                } });
        });
        timerSet.start();
      }

      if (stageIndex < stages.length) {
        let stage = stages[stageIndex];
        if (stage.type === 'chromosome') {
          animateStage(stage);
        }
        else if (stage.type === 'gamete') {
          _setTimeout(function() {
            if (stage.sex === BOTH_SEXES) {
              animationEvents.moveChromosomesToGamete.
                animate(BioLogica.MALE, stage.speed, animationEvents.randomizeChromosomes.onFinish);
              animationEvents.moveChromosomesToGamete.
                animate(BioLogica.FEMALE, stage.speed, animationEvents.randomizeChromosomes.onFinish);
            }
            else {
              animationEvents.moveChromosomesToGamete.
                animate(stage.sex, stage.speed, animationEvents.randomizeChromosomes.onFinish);
            }
          }, delayStartMoveChromosomesToGamete);
        }
        else if (stage.type === 'complete') {
          resetAnimationEvents({ showStaticGametes: true, reactState: { isIntroComplete: true } });
          _this.autoSelectSingletonGametes();
        }
      }
      _this.setState({ animation: 'randomizeChromosomes' });
    },
    onFinish: function() {
      animatedComponents = [];
      if (++animationEvents.randomizeChromosomes.count < animationEvents.randomizeChromosomes.stages.length)
        animationEvents.randomizeChromosomes.animate();
      else
        _this.setState({ animation: 'complete' });
    }
  },
  moveChromosomesToGamete: { id: 3, sexes: [], activeCount: 0, complete: false, ready: false,
    animate: function(sex, speed, onFinish) {
      const parentGameteGenomeId = sex === BioLogica.MALE ? 'father-gamete-genome' : 'mother-gamete-genome',
            parentGameteGenomeEl = document.getElementById(parentGameteGenomeId),
            parentGameteChromEls = parentGameteGenomeEl.getElementsByClassName('chromosome-allele-container'),
            parentGameteImageClass = sex === BioLogica.MALE ? 'sperm' : 'ovum',
            parentGameteImageEl = parentGameteGenomeEl.getElementsByClassName(parentGameteImageClass)[0],
            parentGameteDivEl = parentGameteImageEl.getElementsByClassName('gamete-container')[0],
            parentGameteBounds = unscaleProperties(parentGameteDivEl.getBoundingClientRect(), _this.props.scale),
            spermChromOffsets = [{ dx: 49.5, dy: 11 }, { dx: 69.5, dy: 11 }, { dx: 89.5, dy: 11 }],
            ovumChromOffsets = [{ dx: 59.5, dy: 11 }, { dx: 79.5, dy: 11 }, { dx: 99.5, dy: 11 }];

      animationEvents.moveChromosomesToGamete.sexes.push(sex);
      animationEvents.moveChromosomesToGamete.speed = speed;
      animationEvents.moveChromosomesToGamete.onFinishCaller = onFinish;

      function getDstChromBounds(index) {
        const offsets = sex === BioLogica.MALE ? spermChromOffsets : ovumChromOffsets;
        return { left: parentGameteBounds.left + offsets[index].dx,
                  top: parentGameteBounds.top + offsets[index].dy,
                  width: 8, height: 20 };
      }
      let components = [],
          positions = [],
          opacity = { start: 1.0, end: 0.5 };
      for (let i = 0; i < parentGameteChromEls.length; ++i) {
        const parentGameteChromEl = parentGameteChromEls[i],
              srcChromBounds = unscaleProperties(parentGameteChromEl.getBoundingClientRect(), _this.props.scale),
              descriptorComponents = parentGameteChromEl.id.split("-"),
              chromosomeDescriptor = {name: descriptorComponents[1], side: descriptorComponents[2]},
              chromView = <AnimatedChromosomeImageView small={true} empty={false} bold={false} chromosomeDescriptor={chromosomeDescriptor}/>;
        components.push(chromView);
        positions.push({ startPositionRect: srcChromBounds, startSize: 1.0,
                        targetPositionRect: getDstChromBounds(i), endSize: 0.2 });
        ++animationEvents.moveChromosomesToGamete.activeCount;
      }
      if (!debugSkipRandomGameteAnimation) {
        animateMultipleComponents(components, positions, opacity, speed,
                                  animationEvents.moveChromosomesToGamete.id,
                                  animationEvents.moveChromosomesToGamete.onFinish);
      }
      else {
        for (let i = animationEvents.moveChromosomesToGamete.activeCount; i >= 0; --i) {
          animationEvents.moveChromosomesToGamete.onFinish(animationEvents.moveChromosomesToGamete.id);
        }
      }
      let animatingGametes = _this.state.animatingGametes || initialAnimGametes(),
          createdGametes = _this.state.createdGametes || [0, 0];
      if (Object.keys(animatingGametes[2]).length)
        ++ createdGametes[0];
      if (Object.keys(animatingGametes[3]).length)
        ++ createdGametes[1];
      animatingGametes = initialAnimGametes();

      _this.setState({ animation: 'moveChromosomesToGamete', animatingGametes, createdGametes });
    },
    onFinish: function() {
      if (animationEvents.moveChromosomesToGamete.activeCount &&
          (--animationEvents.moveChromosomesToGamete.activeCount === 0)) {
        animatedComponents = [];
        animationEvents.moveChromosomesToGamete.sexes.forEach((sex) => {
          animationEvents.moveGameteToPool.
            animate(sex, animationEvents.moveChromosomesToGamete.speed,
                        animationEvents.moveChromosomesToGamete.onFinishCaller);
        });
        animationEvents.moveChromosomesToGamete.sexes = [];
      }
    }
  },
  moveGameteToPool: { id: 4, sexes: [], complete: false, ready: false,
    animate: function(sex, speed, onFinish) {
      function getGameteLocationInPen(sex, index) {
        let loc = gameteLayoutConstants[sex]
                    ? getGameteLocation(gameteLayoutConstants[sex], index)
                    : { top: BioLogica.MALE ? 14 : 2, left: 3 + 31.125 * index };
        return loc;
      }
      const gameteComponent = sex === BioLogica.MALE ? animatedSpermView : animatedOvumView,
            srcGameteBounds = sex === BioLogica.MALE ? spermTarget : ovumTarget,
            gametePoolId = sex === BioLogica.MALE ? 'father-gamete-pen' : 'mother-gamete-pen',
            gametePoolElt = document.getElementById(gametePoolId),
            gametePoolBounds = unscaleProperties(gametePoolElt.getBoundingClientRect(), _this.props.scale),
            animatingGametesInPools = _this.state.animatingGametesInPools,
            gameteCount = animatingGametesInPools ? animatingGametesInPools[sex] : 0,
            loc = getGameteLocationInPen(sex, gameteCount),
            dstGameteBounds = { top: gametePoolBounds.top + loc.top - 35,
                                left: gametePoolBounds.left + loc.left - 35,
                                width: srcGameteBounds.width / 2,
                                height: srcGameteBounds.height / 2 },
            positions = { startPositionRect: srcGameteBounds, startSize: 1.0,
                          targetPositionRect: dstGameteBounds, endSize: 0.6 },
            opacity = { start: 1.0, end: 1.0 };

      animationEvents.moveGameteToPool.sexes.push(sex);
      animationEvents.moveGameteToPool.onFinishCaller = onFinish;

      if (!debugSkipRandomGameteAnimation) {
        animateMultipleComponents([gameteComponent],
                                  [positions],
                                  opacity, speed,
                                  animationEvents.moveGameteToPool.id,
                                  animationEvents.moveGameteToPool.onFinish);
      }
      else {
        animationEvents.moveGameteToPool.onFinish(animationEvents.moveGameteToPool.id);
      }
      _this.setState({ animation: 'moveGameteToPool' });
    },
    onFinish: function() {
      animatedComponents = [];
      if (animationEvents.moveGameteToPool.sexes) {
        let createdGametes = _this.state.createdGametes || [0, 0],
            animatingGametesInPools = _this.state.animatingGametesInPools || [0, 0];
        animationEvents.moveGameteToPool.sexes.forEach((sex) => {
          animatingGametesInPools[sex] += createdGametes[sex];
          createdGametes[sex] = [];
        });
        if ((animatingGametesInPools[0] >= fatherGametePool(_this.props.gametes).length) &&
            (animatingGametesInPools[1] >= motherGametePool(_this.props.gametes).length)) {
          // all gametes have been animated to their respective pools
          animatingGametesInPools = null;
        }
        _this.setState({ createdGametes, animatingGametesInPools });
      }
      animationEvents.moveGameteToPool.sexes = [];
      animationEvents.moveGameteToPool.onFinishCaller(animationEvents.moveGameteToPool.id);
    }
  },
  selectChromosome: { id: 5, activeCount: 0, complete: false, ready: false,
    animate: function(positions, chromosomeId, speed, onFinish) {
      if (++animationEvents.selectChromosome.activeCount === 1)
        animationEvents.selectChromosome.onFinishCaller = onFinish;

      let opacity = {
        start: 1.0,
        end: 1.0
      };
      let descriptorComponents = chromosomeId.split("-"),
          chromosomeDescriptor = {name: descriptorComponents[1], side: descriptorComponents[2]};
      animatedComponentToRender = <FVChromosomeImageView small={true} empty={false} bold={true} chromosomeDescriptor={chromosomeDescriptor}/>;
      animateMultipleComponents([animatedComponentToRender], [positions], opacity, speed,
                                animationEvents.selectChromosome.id,
                                animationEvents.selectChromosome.onFinish);
      _this.setState({animation:"selectChromosome"});
    },
    onFinish: function() {
      if (animationEvents.selectChromosome.activeCount &&
          (--animationEvents.selectChromosome.activeCount === 0)) {
        if (animationEvents.selectChromosome.onFinishCaller)
          animationEvents.selectChromosome.onFinishCaller(animationEvents.selectChromosome.id);
        else {
          animatedComponents = [];
          _this.setState({animation:"complete"});
        }
      }
    }
  },
  fertilize: { id: 6, inProgress: false, complete: false,
    animate: function(){
      animationEvents.selectChromosome.ready = false;
      animationEvents.fertilize.started = true;

      _setTimeout(animationEvents.fertilize.onFinish, durationFertilizationAnimation);
    },
    onFinish: function() {
      animationEvents.fertilize.complete = true;
      // hide static gametes during fertilization
      showStaticGametes(false);
      if (showHatchAnimation)
        animationEvents.hatch.animate();
      else
        animationEvents.hatch.onFinish();
    }
  },
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
  animationEvents.showGametes.count = 0;
  animationEvents.moveGametes.count = 0;
  animationEvents.randomizeChromosomes.count = 0;
  animationEvents.randomizeChromosomes.stages = [];
  animationEvents.selectChromosome.ready = true;
  animationEvents.selectChromosome.activeCount = 0;
  animationEvents.moveChromosomesToGamete.activeCount = 0;
  animationEvents.fertilize.started = false;
  animationEvents.fertilize.complete = false;
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  showStaticGametes(!!options.showStaticGametes);
  showHatchAnimation = !!options.showHatchAnimation;
  if (options.clearAnimatedComponents) animatedComponents = [];
  if (_this) _this.setState(assign({ animation: 'complete', animatingGametes: null }, options.reactState));
}

function runAnimation(animationEvent, positions, opacity, speed, onFinish){
  startDisplay = {
    startPositionRect: positions.startPositionRect,
    opacity: opacity.start,
    size: positions.startSize
  };
  targetDisplay = {
    targetPositionRect: positions.targetPositionRect,
    opacity: opacity.end,
    size: positions.endSize
  };

  let animationSpeed = speed;
  animationTimeline[lastAnimatedComponentId] = animationEvent;
  animatedComponents.push(
    <AnimatedComponentView key={lastAnimatedComponentId}
      animEvent={animationEvent}
      speed={animationSpeed}
      viewObject={animatedComponentToRender}
      startDisplay={startDisplay}
      targetDisplay={targetDisplay}
      runAnimation={true}
      onRest={onFinish} />);
  lastAnimatedComponentId++;
}

function animateMultipleComponents(componentsToAnimate, positions, opacity, speed, animationEvent, onFinish){
  for (let i = 0; i < componentsToAnimate.length; i++){
    animatedComponentToRender = componentsToAnimate[i];
    runAnimation(animationEvent, positions[i], opacity, speed, onFinish);
  }
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

function isGameteComplete(gamete) {
  return gamete && Object.keys(gamete).length === 3;
}

function areGametesComplete(gametes) {
  const length = gametes && gametes.length;
  return (length >= 2) && isGameteComplete(gametes[0]) && isGameteComplete(gametes[1]);
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

export default class FVEggGame extends Component {

  state = {
    isIntroComplete: false
  }

  static backgroundClasses = 'fv-layout fv-layout-c'

  componentWillMount() {
    _this = this;
    challengeDidChange = true;
    chromosomeDisplayStyle = {display: "none"},
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
          { routeSpec: nextRouteSpec, trial: nextTrial, gametes: nextGametes, showUserDrake, onResetGametes } = nextProps,
          { level: nextLevel, mission: nextMission, challenge: nextChallenge } = nextRouteSpec,
          { currentGametes: nextCurrentGametes } = nextGametes,
          newChallenge = (prevLevel !== nextLevel) || (prevMission !== nextMission) || (prevChallenge !== nextChallenge),
          newTrialInChallenge = !newChallenge && (prevTrial !== nextTrial),
          gametesReset = !areGametesEmpty(prevCurrentGametes) && areGametesEmpty(nextCurrentGametes);

    if (newChallenge || newTrialInChallenge || gametesReset) {
      if (newChallenge) {
        if (!this.freshLoad) {
          location.reload();
        }
        challengeDidChange = true;
        this.setState({ animatingGametes: null, animatingGametesInPools: [0, 0],
                        animation: "complete", isIntroComplete: false });
      }
      resetAnimationEvents({ showStaticGametes: !challengeDidChange,
                            showHatchAnimation: showUserDrake,
                            clearAnimatedComponents: true });
      this.autoSelectSingletonGametes(nextGametes);
      if ((newChallenge || newTrialInChallenge) && onResetGametes) {
        onResetGametes();
        showStaticGametes(true);
      }
    }
  }

  // if there's only one gamete for a parent, select it automatically
  autoSelectSingletonGametes(nextGametes) {
    const gametes = nextGametes || this.props.gametes,
          { onSelectGameteInPool } = this.props;
    [BioLogica.MALE, BioLogica.FEMALE].forEach((sex) => {
      const gameteCount = gametePoolSelector(sex)(gametes).length;
      if ((gameteCount === 1) && (gametes.selectedIndices[sex] !== 0))
        onSelectGameteInPool(sex, 0);
    });
  }

  handleChromosomeSelected = (org, name, side, elt) => {
    // Normally we would avoid querying elements in React- it would be better to determine emptiness from state
    // However, since this element was just clicked on, we can rely on it existing for this call
    if (this.props.interactionType !== 'select-gametes' && !elt.querySelector(".empty"))
      this.selectChromosomes(org.sex, defaultAnimationSpeed, [{name, side, elt }]);
  }

  handleGameteSelected = (poolID, sex, gameteIndex, /*gameteID, gamete*/) => {
    if (!this.state.isIntroComplete) {
      // user selection of a gamete terminates intro animation
      resetAnimationEvents({ showStaticGametes: true,
                            clearAnimatedComponents: true,
                            reactState: { animatingGametesInPools: null,
                                          createdGametes: null,
                                          isIntroComplete: true } });
      chromosomeDisplayStyle = {};
    }
    this.autoSelectSingletonGametes();
    if (gametePoolSelector(sex)(this.props.gametes).length === 1)
      gameteIndex = 0;
    this.props.onSelectGameteInPool(sex, gameteIndex);
  }

  activeSelectionAnimations = 0;

  selectChromosomes(sex, speed, chromEntries, onFinish) {
    this.freshLoad = false;

    // onFinish is only used by animated auto-selection
    const isTriggeredByUser = !onFinish,
          { scale } = this.props;

    function animateChromosomeSelection() {
      chromEntries.forEach((entry) => {
        let positions = findBothElements(sex, entry.name, entry.elt, scale),
            chromosomeId = entry.elt.getElementsByClassName("chromosome-allele-container")[0].id;
        // animate the chromosomes being added
        animationEvents.selectChromosome.animate(positions, chromosomeId,
                                                  selectChromosomesAnimationSpeed,
                                                  onFinish);
      });
    }

    if (animationEvents.selectChromosome.ready) {
      if (isTriggeredByUser) {
        // animating gametes include just-selected chromosomes
        let { currentGametes } = this.props.gametes,
            animatingGametes = (this.state.animatingGametes || currentGametes.asMutable())
                                  .map((gamete, index) => {
                                    let animGamete = assign({}, gamete);
                                    if (index === sex) {
                                      chromEntries.forEach(entry => {
                                        animGamete[entry.name] = entry.side;
                                      });
                                    }
                                    return animGamete;
                                  });
        // selected gametes don't include just-selected chromosomes (no labels)
        // until the animation completes.
        animatingGametes.push(currentGametes[0].asMutable(), currentGametes[1].asMutable());
        ++this.activeSelectionAnimations;
        this.setState({ animatingGametes });
        // delay selection of chromosome until animation arrives
        _setTimeout(() => {
          chromEntries.forEach((entry) => {
            this.props.onGameteChromosomeAdded(sex, entry.name, entry.side);
          });

          let animatingGametes = this.state.animatingGametes;
          if (--this.activeSelectionAnimations === 0) {
            animatingGametes = null;
          }
          else {
            animatingGametes[2] = clone(currentGametes[0]);
            animatingGametes[3] = clone(currentGametes[1]);
          }
          this.setState({ animatingGametes });
        }, delayStartUserSelectChromosome);

        animateChromosomeSelection();
      }
      // auto-selection triggered by animation
      else {
        // delay the initial animation to allow user to see selection state for a beat
        _setTimeout(animateChromosomeSelection, delayStartAutoSelectChromosome);
      }
    }
  }

  render() {
    const { challengeType, interactionType, scale, showUserDrake, trial, drakes, gametes,
            userChangeableGenes, visibleGenes, userDrakeHidden, onChromosomeAlleleChange,
            onFertilize, onHatch, onResetGametes, onKeepOffspring, onDrakeSubmission, moves } = this.props,
          { currentGametes } = gametes,
          { animatingGametes } = this.state,
          firstTargetDrakeIndex = 3, // 0: mother, 1: father, 2: child, 3-5: targets
          targetDrake = drakes[firstTargetDrakeIndex + trial],
          isCreationChallenge = challengeType === 'create-unique',
          isMatchingChallenge = challengeType === 'match-target',
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
    if (drakes[2]) {
      child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
    }

    const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
      onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
    };
    const handleFertilize = function() {
      if (areGametesComplete(currentGametes)) {
        animationEvents.selectChromosome.ready = false;
        animatedComponents = [];
        animationEvents.fertilize.animate();
        onFertilize(0,1);
      }
    };

    const handleHatch = function () {
      if (!hatchSoundPlayed) {
        onHatch();
        hatchSoundPlayed = true;
      }
    };

    const handleSubmit = function () {
      let childImage = child.getImageName(),
          success = false;
      if (challengeType === 'create-unique') {
        let offspringIndices = range(3, drakes.length);
        onKeepOffspring(2, offspringIndices, 8);
      }
      else if (challengeType === 'match-target') {
        const targetDrakeOrg = new BioLogica.Organism(BioLogica.Species.Drake,
                                                      targetDrake.alleleString,
                                                      targetDrake.sex);
        success = (childImage === targetDrakeOrg.getImageName());
        onDrakeSubmission(firstTargetDrakeIndex + trial, 2, success, "resetGametes");
      }
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
          targetDrakeSection = isMatchingChallenge && targetDrakeOrg
                                ? <TargetDrakeView org={targetDrakeOrg} />
                                : null;
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

    let [,,,...keptDrakes] = drakes;
    keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));

    if (isCreationChallenge) {
      penView = <div className='columns bottom'>
                  <FVStableView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20}/>
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
          childGenomeClass = classNames('child', challengeClasses),
          motherGametes = gametesToShowInPool(BioLogica.FEMALE),
          fatherGametes = gametesToShowInPool(BioLogica.MALE);

    function parentGenomeView(sex) {
      const org = sex === BioLogica.FEMALE ? mother : father,
            uniqueProps = sex === BioLogica.FEMALE
                              ? {orgName: 'mother', chromosomes: motherUnselectedChromosomesMap}
                              : {orgName: 'father', chromosomes: fatherUnselectedChromosomesMap};
      return <GenomeView className={parentGenomeClass}  species={org.species} org={org} {...uniqueProps}
                         ChromosomeImageClass={FVChromosomeImageView} small={ true } editable={false} labelEmptyChromosomes={!_this.state.isIntroComplete}
                         userChangeableGenes={ userChangeableGenes } visibleGenes={ visibleGenes } onAlleleChange={ handleAlleleChange } 
                         chromosomeHeight={122} onChromosomeSelected={_this.handleChromosomeSelected} />;
    }

    function parentHalfGenomeView(sex) {
      const uniqueProps = sex === BioLogica.FEMALE
                              ? { orgName: 'targetmother', chromosomes: femaleGameteChromosomeMap }
                              : { orgName: 'targetfather', chromosomes: maleGameteChromosomeMap };
      return <GenomeView className={childGenomeClass} species={mother.species} {...uniqueProps} ChromosomeImageClass={FVChromosomeImageView}
                        editable={false} userChangeableGenes={ userChangeableGenes } visibleGenes={ visibleGenes } chromosomeHeight={122}
                        small={true} displayStyle={chromosomeDisplayStyle} />;
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

    function createGametes() {
      console.log("make gametes");
      _setTimeout( () => {
        // first animation - show gametes
        animationEvents.showGametes.animate();
      }, 0);
      challengeDidChange = false;
    }

    function createGametesButton(isGameteChallenge, challengeDidChange) {
      if (isGameteChallenge && challengeDidChange) {
        // Make a button for the first challenge in a series
        return <div onClick={createGametes} className="gamete-create-button">GENERATE GAMETES</div>;
      } else {
        return null;
      }
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
                                  ovumChromosomes={ovumChromosomes} spermChromosomes={spermChromosomes}
                                  userDrake={child} showUserDrake={showUserDrake} userDrakeHidden={userDrakeHidden}
                                  isHatchingInProgress={animationEvents.hatch.inProgress}
                                  hatchAnimationDuration={durationHatchAnimation}
                                  handleHatchingComplete={animationEvents.hatch.onFinish}
                                  isHatchingComplete={animationEvents.hatch.complete}
                                  onBreed={handleFertilize} />
            {createGametesButton(isSelectingGametes, challengeDidChange)}
            <div className={ gametesClass }>
              <div className='half-genome half-genome-left' id="mother-gamete-genome">
                { ovumView }
                { parentHalfGenomeView(BioLogica.FEMALE) }
              </div>
              <div className='half-genome half-genome-right' id="father-gamete-genome">
                { spermView }
                { parentHalfGenomeView(BioLogica.MALE) }
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

  updateComponentLayout() {
    const { scale } = this.props;

    // now that the DOM is loaded, get the positions of the elements
    mother = unscaleProperties(document.getElementsByClassName("mother")[0].getClientRects()[0], scale);
    father = unscaleProperties(document.getElementsByClassName("father")[0].getClientRects()[0], scale);

    ovumTarget = unscaleProperties(document.getElementsByClassName("ovum")[0].getClientRects()[0], scale);
    spermTarget = unscaleProperties(document.getElementsByClassName("sperm")[0].getClientRects()[0], scale);

    motherDrakeStart = {
      top: mother.top + offsetTopDrake,
      left: mother.left
    };
    motherGameteStart = {
      top: mother.top + offsetTopGamete,
      left: mother.left
    };
    fatherDrakeStart = {
      top: father.top + offsetTopDrake,
      left: father.left
    };
    fatherGameteStart = {
      top: father.top + offsetTopGamete,
      left: father.left
    };

    if (challengeDidChange && (this.props.interactionType !== "select-gametes" || this.props.trial > 0)) {
      // animate the gametes moving from parents after page has rendered
      _setTimeout( () => {
        // first animation - show gametes
        animationEvents.showGametes.animate();
      }, delayStartShowGametesAnimation);
      challengeDidChange = false;
    }
  }

  componentDidMount() {
    this.freshLoad = true;
    this.updateComponentLayout();
  }

  componentDidUpdate() {
    this.updateComponentLayout();
  }

  componentWillUnmount() {
    this.props.onResetGametes();
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
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onSelectGameteInPool: PropTypes.func.isRequired,
    onFertilize: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onResetGametes: PropTypes.func,
    onKeepOffspring: PropTypes.func,
    onDrakeSubmission: PropTypes.func,
    moves: PropTypes.number
  }

  static authoredGametesToGametePools = function(authoredChallenge, drakes, trial) {
    const mother = drakes && drakes[0],
          father = drakes && drakes[1],
          target = drakes && drakes[3 + trial],
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

  static authoredDrakesToDrakeArray = function(authoredChallenge, trial) {
    const mother = new BioLogica.Organism(BioLogica.Species.Drake,
                                          authoredChallenge.mother.alleles,
                                          authoredChallenge.mother.sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake,
                                          authoredChallenge.father.alleles,
                                          authoredChallenge.father.sex),
          // authored specs may be incomplete; these are complete specs
          motherSpec = { alleles: mother.getAlleleString(), sex: mother.sex },
          fatherSpec = { alleles: father.getAlleleString(), sex: father.sex };
    if (authoredChallenge.challengeType === 'create-unique')
      return [motherSpec, fatherSpec];

    // already generated drakes
    if (trial > 0)
      return authoredDrakes;

    // challengeType === 'match-target'
    const targetDrakeCount = authoredChallenge.targetDrakes.length;

    function childDrakesContain(alleles) {
      for (let i = 3; i < authoredDrakes.length; ++i) {
        if (authoredDrakes[i].alleles === alleles)
          return true;
      }
      return false;
    }

    authoredDrakes = [motherSpec, fatherSpec, null];
    for (let i = 0; i < targetDrakeCount; ++i) {
      let child, childAlleles;
      do {
        child = BioLogica.breed(mother, father, false);
        childAlleles = child.getAlleleString();
        // don't generate the same set of alleles twice
      } while (childDrakesContain(childAlleles));

      authoredDrakes.push({ alleles: childAlleles, sex: child.sex });
    }
    return authoredDrakes;
  }

  static calculateGoalMoves = function() {
    // each incorrect submission counts as one move
    // the goal is to have no incorrect submissions
    return 0;
  }

}
