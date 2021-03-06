/*
 * Note: This began as a copy of the (non-FV) EggSortGame template so that the
 * FableVision version of the template could be developed without breaking
 * the existing EggSortGame implementations. Once development is complete,
 * we can decide whether to simply retire the non-FV EggSortGame template, or
 * perhaps find some way for them to share potentially redundant code if
 * there is a desire to keep the old versions around.
 */

import React, { Component, PropTypes } from 'react';
import { isEqual } from 'lodash';
import compose from 'recompose/compose';
import renameProp from 'recompose/renameProp';
import animateSpring from '../hoc/animate-spring';
import initialElementId from '../hoc/initial-element-id';
import targetElementId from '../hoc/target-element-id';
import tweenOpacity from '../hoc/tween-opacity';
import updateOnResizeScroll from '../hoc/update-on-resize-scroll';
import BasketSetView from '../components/basket-set';
import FVEggClutchView from '../fv-components/fv-egg-clutch';
import { EGG_IMAGE_WIDTH } from '../components/egg';
import EggHatchView from '../components/egg-hatch';
import GenomeView from '../components/genome';
import OrganismView from '../components/organism';
import FVChromosomeImageView from '../fv-components/fv-chromosome-image';
import FVEggHatchView from '../fv-components/fv-egg-hatch';
import { generateTrialDrakes } from '../utilities/trial-generator';
import GeneticsUtils from '../utilities/genetics-utils';
import urlParams from '../utilities/url-params';
import t from '../utilities/translate';

const EGG_IMAGE_WIDTH_MEDIUM = EGG_IMAGE_WIDTH,
      EGG_IMAGE_WIDTH_SMALL = EGG_IMAGE_WIDTH / 3,

      MEDIUM_EGG_ON_BASKET_X_OFFSET = 37,
      MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET = -90,

      SMALL_EGG_ON_BASKET_X_OFFSET = 52,
      SMALL_EGG_ON_BASKET_Y_OFFSET = 10,

      EGG_IN_CLUTCH = 0,
      EGG_IS_ANIMATING = 1,
      EGG_IN_BASKET = 2,
      EGG_IS_HATCHED = 3,
      EGG_IS_FADING = 4,
      EGG_IS_COMPLETE = 5,

      modeCollectInBasket = urlParams.collectInBasket > 0;

let _this,
    lastAnimatedComponentId = 0,

    isSubmittedEggCorrect,
    animatingEgg, animatingEggIndex,
    eggStates = [],
    animatingDrake, targetBasketIndex;

const FastEggHatch = compose(
                        updateOnResizeScroll,
                        initialElementId(),
                        targetElementId(),
                        // set slightly faster stiffness / damping ratio than default, and limit the animation to 500ms
                        animateSpring(115, 18, 600),
                        // animateSpring() generates 'style', but EggHatchView expects 'displayStyle'
                        renameProp('style', 'displayStyle'))(EggHatchView),
      NewEggHatch = compose(
                        updateOnResizeScroll,
                        initialElementId(),
                        renameProp('initialStyle', 'displayStyle'))(FVEggHatchView),
      EggFade = compose(
                        updateOnResizeScroll,
                        initialElementId(),
                        renameProp('initialStyle', 'displayStyle'),
                        tweenOpacity())(OrganismView);

let animationEvents = {
      moveEggToBasket: { id: 0, complete: false, animate: function(egg, eggIndex, basketIndex) {
        // kill any earlier animations still running
        resetAnimationEvents(true);

        if (eggIndex >= 0) {
          animatingEgg = egg;
          animatingEggIndex = eggIndex;
          eggStates[animatingEggIndex] = EGG_IS_ANIMATING;
          animatingDrake = new BioLogica.Organism(BioLogica.Species.Drake, egg.alleles, egg.sex);
          targetBasketIndex = basketIndex;

          const { scale } = _this.props,
                leftOffset = 110,
                topOffset = 75;
          appendAnimation('moveEggToBasket',
            <FastEggHatch
                egg={animatingEgg} organism={animatingDrake} scale={scale}
                initial={{ id: `egg-${animatingEggIndex}` }}
                initialStyle={{ size: EGG_IMAGE_WIDTH, hatchProgress: 0 }}
                target={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset }}
                targetStyle={{ size: EGG_IMAGE_WIDTH_MEDIUM }}
                onRest={function() { animationFinish(animationEvents.moveEggToBasket.id); }}
            />);
        }
      }},
      hatchDrakeInBasket: { id: 1, complete: false, animate: function() {
        const { scale } = _this.props,
              leftOffset = -300,
              topOffset = -28;
        appendAnimation('hatchDrakeInBasket',
          <NewEggHatch
              organism={animatingDrake} scale={scale} duration={500}
              initial={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset }}
              initialStyle={{ position: "fixed", size: EGG_IMAGE_WIDTH_MEDIUM }}
              onEnd={function() { animationFinish(animationEvents.hatchDrakeInBasket.id); }}
          />);
      }},
      fadeDrakeAway: { id: 2, complete: false, animate: function() {
        const { baskets, scale } = _this.props,
              targetBasket = targetBasketIndex >= 0 ? baskets[targetBasketIndex] : null,
              leftOffset = 100,
              topOffset = 97;
        _this.clearSelection();
        resetAnimationEvents(false);

        // click handler forwards to underlying basket; otherwise, the animating view interferes
        // with click handling until the fade is complete.
        function handleClick(evt) {
          _this.handleBasketClick(targetBasketIndex, targetBasket);
          evt.stopPropagation();
        }

        eggStates[animatingEggIndex] = EGG_IS_FADING;
        appendAnimation('fadeDrakeAway',
          <EggFade
              org={animatingDrake} scale={scale}
              initial={{ id: `basket-${targetBasketIndex}`, leftOffset, topOffset }}
              initialStyle={{ position: "fixed", marginLeft: 0, size: EGG_IMAGE_WIDTH_MEDIUM }}
              targetOpacity={0}
              duration={1000}
              width={(EGG_IMAGE_WIDTH_MEDIUM)}
              onClick={handleClick}
              onEnd={function() { animationFinish(animationEvents.fadeDrakeAway.id); }}
          />);
      }},
      settleEggInBasket: { id: 3, complete: false, animate: function() {
        _this.clearSelection();
        resetAnimationEvents(false);

        const initialLeft = MEDIUM_EGG_ON_BASKET_X_OFFSET,
              targetLeft = SMALL_EGG_ON_BASKET_X_OFFSET,
              initialTop = MEDIUM_EGG_ABOVE_BASKET_Y_OFFSET,
              targetTop = SMALL_EGG_ON_BASKET_Y_OFFSET;
        appendAnimation('settleEggInBasket',
          <FastEggHatch
              egg={animatingEgg} organism={animatingDrake} glow={true}
              initial={{ id: `basket-${targetBasketIndex}`, leftOffset: initialLeft, topOffset: initialTop }}
              initialStyle={{ size: EGG_IMAGE_WIDTH_MEDIUM, hatchProgress: 1 }}
              target={{ id: `basket-${targetBasketIndex}`, leftOffset: targetLeft, topOffset: targetTop }}
              targetStyle={{ size: EGG_IMAGE_WIDTH_SMALL, hatchProgress: 0 }}
              onRest={function() { animationFinish(animationEvents.settleEggInBasket.id); }}
          />);
      }}
    };

function resetAnimationEvents(clearEggSequence) {
  if (clearEggSequence) {
    animatingEgg = null;
    animatingEggIndex = null;
    animatingDrake = null;
    targetBasketIndex = null;
  }
  _this.setState({ animation: null, animatedComponents: [] });
}

function appendAnimation(animation, component) {
  const newComponent = React.cloneElement(component, { key: lastAnimatedComponentId++ });
  _this.setState(function(prevState) {
    prevState.animation = animation;
    prevState.animatedComponents.push(newComponent);
  });
}

function animationFinish(evt) {
  switch(evt) {
    case animationEvents.moveEggToBasket.id:
      animationEvents.moveEggToBasket.complete = true;
      eggStates[animatingEggIndex] = EGG_IN_BASKET;
      resetAnimationEvents(false);
      animationEvents.hatchDrakeInBasket.animate(animatingEgg);
      break;
    case animationEvents.hatchDrakeInBasket.id:
      animationEvents.hatchDrakeInBasket.complete = true;
      eggStates[animatingEggIndex] = EGG_IS_HATCHED;
      break;
    case animationEvents.fadeDrakeAway.id:
      animationEvents.fadeDrakeAway.complete = true;
      eggStates[animatingEggIndex] = EGG_IS_COMPLETE;
      resetAnimationEvents(true);
      break;
    case animationEvents.settleEggInBasket.id:
      animationEvents.settleEggInBasket.complete = true;
      eggStates[animatingEggIndex] = EGG_IN_BASKET;
      resetAnimationEvents(true);
      break;
    case animationEvents.returnEggFromBasket.id:
      animationEvents.returnEggFromBasket.complete = true;
      eggStates[animatingEggIndex] = EGG_IN_CLUTCH;
      resetAnimationEvents(true);
      break;
    case animationEvents.hatchDrakeInEgg.id:
      animationEvents.hatchDrakeInEgg.complete = true;
      eggStates[animatingEggIndex] = EGG_IS_HATCHED;
      break;
  }
  _this.setState({animation:"complete"});
}

function isEggCompatibleWithBasket(egg, basket) {
  if (!egg || !basket) return false;
  if ((basket.sex != null) && (egg.sex !== basket.sex))
    return false;
  // one of the basket's allele strings...
  return basket.alleles.some((basketAlleleString) => {
    if (!basketAlleleString) {
      // any alleles are correct (we only cared about sex)
      return true;
    }
    return GeneticsUtils.alleleStringContainsAlleles(egg.alleles, basketAlleleString);
  });
}

export default class FVEggSortGame extends Component {

  static propTypes = {
    routeSpec: PropTypes.object.isRequired,
    trial: PropTypes.number.isRequired,
    drakes: PropTypes.array.isRequired,
    userChangeableGenes: PropTypes.array.isRequired,
    visibleGenes: PropTypes.array.isRequired,
    baskets: PropTypes.array.isRequired,
    correct: PropTypes.number,
    errors: PropTypes.number,
    onChangeBasketSelection: PropTypes.func,
    onChangeDrakeSelection: PropTypes.func,
    onSubmitEggForBasket: PropTypes.func.isRequired
  }

  state = {
    animation: null,
    animatedComponents: [],
    eggs: []
  };

  static backgroundClasses = 'fv-layout fv-layout-d';
  static maxScore = null;

  componentWillMount() {
    _this = this;
    this.createEggsFromDrakes(this.props);
    FVEggSortGame.maxScore = this.props.drakes.length;
    resetAnimationEvents(true);
  }

  componentWillReceiveProps(nextProps) {
    const { routeSpec: prevRouteSpec, correct: prevCorrect, errors: prevErrors } = this.props,
          { level: prevLevel, mission: prevMission, challenge: prevChallenge } = prevRouteSpec,
          { routeSpec: nextRouteSpec, correct: nextCorrect, errors: nextErrors } = nextProps,
          { level: nextLevel, mission: nextMission, challenge: nextChallenge } = nextRouteSpec;
    if ((prevLevel !== nextLevel) || (prevMission !== nextMission) || (prevChallenge !== nextChallenge) ||
        (prevErrors && !nextErrors) || (prevCorrect && !nextCorrect)) {
      resetAnimationEvents(true);
      this.createEggsFromDrakes(nextProps);
      this.clearSelection();
    }
  }

  createEggsFromDrakes(props) {
    eggStates = [];
    const { drakes } = props,
          eggs = drakes.map((child) => {
                    eggStates.push(EGG_IN_CLUTCH);
                    return new BioLogica.Organism(BioLogica.Species.Drake, child.alleleString, child.sex);
                  });
    this.setState({ eggs });
  }

  /*
   * Returns true if a drake is hatched, but has not yet faded away.
   */
  isDrakeHatched() {
    return this.state.animation === "complete" && this.state.animatedComponents.length > 0;
  }

  /*
   * Returns true if an animation is actively playing.
   */
  isAnimating() {
    return this.state.animation !== "complete" && this.state.animatedComponents.length > 0;
  }

  selectedEgg() {
    const { drakes } = this.props,
          { eggs } = this.state,
          eggDrakeIndex = drakes.findIndex((drake) => drake && drake.isSelected),
          eggIndex = eggDrakeIndex != null && eggDrakeIndex >= 0 ? eggDrakeIndex : null,
          egg = eggIndex != null && eggIndex >= 0 ? eggs[eggIndex] : null;
    return { index: eggIndex, egg };
  }

  selectedBaskets() {
    const { baskets } = this.props;
    return baskets.reduce((prev, basket, index) => {
                      if (basket && basket.isSelected)
                        prev.push(index);
                      return prev;
                    }, []);
  }

  clearSelection() {
    this.setBasketSelection([]);
    this.setEggSelection([]);
  }

  setBasketSelection(selectedIndices) {
    const { onChangeBasketSelection } = this.props,
          currSelectedIndices = this.selectedBaskets();
    if (!isEqual(selectedIndices, currSelectedIndices))
      onChangeBasketSelection(selectedIndices);
  }

  selectAllBaskets() {
    const { baskets } = this.props,
          allBaskets = baskets.map((basket, index) => index);
    this.setBasketSelection(allBaskets);
  }

  setEggSelection(selectedIndices) {
    const { onChangeDrakeSelection } = this.props,
          { index: currSelectedIndex } = this.selectedEgg(),
          currSelectedIndices = currSelectedIndex != null ? [currSelectedIndex] : [];
    if (!isEqual(selectedIndices, currSelectedIndices))
      onChangeDrakeSelection(selectedIndices);
  }

  handleBackgroundClick = () => {
    if (!this.isAnimating() && !this.isDrakeHatched()) {
      this.clearSelection();
    }
  }

  handleBasketClick = (basketIndex, basket) => {
    const { onSubmitEggForBasket } = this.props,
          { index: selectedEggIndex, egg: selectedEgg } = this.selectedEgg();
    isSubmittedEggCorrect = selectedEgg && isEggCompatibleWithBasket(selectedEgg, basket);
    if (selectedEgg) {
      animationEvents.moveEggToBasket.animate(selectedEgg, selectedEggIndex, basketIndex);
      // Delay the submit until the egg is finished hatching
      setTimeout(() => {
        const { correct, errors } = this.props,
        { eggs } = this.state,
        eggDrakeIndex = selectedEggIndex,
        isChallengeComplete = correct + errors + 1 >= eggs.length;
        onSubmitEggForBasket(eggDrakeIndex, basketIndex, isSubmittedEggCorrect, isChallengeComplete);
      }, 1000);
    }
    this.setBasketSelection([basketIndex]);
  }

  handleEggClick = (id, index) => {
    if (this.isDrakeHatched()) {
      animationEvents.fadeDrakeAway.animate();
    }
    this.setEggSelection([index]);
    this.selectAllBaskets();
  }

  render() {
    const { userChangeableGenes, visibleGenes, baskets, correct, errors } = this.props,
          { animation, animatedComponents, eggs } = this.state,
          selectedBaskets = this.selectedBaskets(),
          { index: selectedEggIndex, egg: selectedEgg } = this.selectedEgg(),
          animatingEggDrakeIndex = (animatingEggIndex != null) ? animatingEggIndex : null,
          isHatchingDrakeInEgg = (animation === "hatchDrakeInEgg") ||
                                  ((animation === "complete") && (animatingEggIndex != null)),
          showSelectedEggIndex = isHatchingDrakeInEgg ? -1 : selectedEggIndex,
          basketEggs = modeCollectInBasket ? eggs : null,
          displayEggs = eggs.map((egg, index) => {
            return eggStates[index] === EGG_IN_CLUTCH ? egg : null;
          }),
          showInstructions = !selectedEgg && !correct && !errors,
          sectionTitle = showInstructions
                            ? t('~EGG_GAME_3.INSTRUCTIONS_TITLE')
                            : t('~EGG_GAME_3.CHROMOSOMES_TITLE'),
          sectionTitleClasses = 'section-title unselectable' + (showInstructions ? ' instructions' : ' chromosomes'),
          instructionsView = !correct && !errors
                                ? <div>
                                    <div className='instr-heading unselectable'>{t("~EGG_GAME_3.INSTR_HEADING")}</div>
                                    <ul>
                                      <li className='instr-item'>{t("~EGG_GAME_3.INSTR_ITEM1")}</li>
                                      <li className='instr-item'>{t("~EGG_GAME_3.INSTR_ITEM2")}</li>
                                    </ul>
                                  </div>
                                : null,
          genomeView = selectedEgg
                        ? <GenomeView org={selectedEgg} small={true} ChromosomeImageClass={FVChromosomeImageView} userChangeableGenes={userChangeableGenes} visibleGenes={visibleGenes} editable={false} />
                        : null,
          genomeOrInstructionsView = selectedEgg ? genomeView : instructionsView,
          isAnimating = this.isAnimating();

    return (
      <div id="egg-sort-game" onClick={this.handleBackgroundClick}>
        <div id="left-section">
          <div id="baskets">
            <BasketSetView baskets={baskets} selectedIndices={selectedBaskets}
                            eggs={basketEggs} animatingEggIndex={animatingEggDrakeIndex}
                            onClick={isAnimating || this.isDrakeHatched() ? null : this.handleBasketClick}/>
          </div>
        </div>
        <div className="chromomatic-container">
          <div className="chromomatic">
            <div id="right-section">
              <div id="container">
                <div id="background"></div>
                <div className={sectionTitleClasses}>{sectionTitle}</div>
                {genomeOrInstructionsView}
              </div>
            </div>
          </div>
        </div>
        <div id="eggs">
          <FVEggClutchView eggs={displayEggs} selectedIndex={showSelectedEggIndex}
                          onClick={isAnimating ? null : this.handleEggClick} />
        </div>
        {animatedComponents}
      </div>
    );
  }

  componentDidUpdate() {
    _this = this;
  }

  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    if (authoredChallenge.trialGenerator) {
      const drakes = generateTrialDrakes(authoredChallenge.trialGenerator);
      if (drakes.length) FVEggSortGame.maxScore = drakes.length;
      return drakes;
    }
    return [];
  }

}
