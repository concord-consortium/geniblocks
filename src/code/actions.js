import actionTypes from './action-types';
import { ITS_ACTORS, ITS_ACTIONS, ITS_TARGETS } from './its-constants';
import GeneticsUtils from './utilities/genetics-utils';
import AuthoringUtils from './utilities/authoring-utils';

export { actionTypes };

export function startSession(uuid) {
  return {
    type: actionTypes.SESSION_STARTED,
    session: uuid,
    meta: {
      dontLog: ["session"],
      itsLog: {
        actor: ITS_ACTORS.SYSTEM,
        action: ITS_ACTIONS.STARTED,
        target: ITS_TARGETS.SESSION
      }
    }
  };
}

export function changeAuthoring(authoring) {
  return {
    type: actionTypes.AUTHORING_CHANGED,
    authoring,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED,
        target: ITS_TARGETS.AUTHORING
      }
    }
  };
}

export function navigateToChallenge(routeSpec) {
  const {level, mission, challenge} = routeSpec;
  return {
    type: actionTypes.NAVIGATED,
    level,
    mission,
    challenge,
    route: `/${level+1}/${mission+1}/${challenge+1}`,
    meta: {
      logTemplateState: true,
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.NAVIGATED,
        target: ITS_TARGETS.CHALLENGE
      }
    }
  };
}

export function retryCurrentChallenge() {
  return (dispatch, getState) => {
    dispatch(navigateToChallenge(getState().routeSpec));
  };
}

export function retryCurrentMission() {
  return (dispatch, getState) => {
    const { level, mission } = getState().routeSpec;
    dispatch(navigateToChallenge({ level, mission, challenge: 0 }));
  };
}

function navigateToStartPage(url) {
  return {
    type: actionTypes.NAVIGATED_PAGE,
    url,
    meta: {
      logTemplateState: true,
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.NAVIGATED,
        target: ITS_TARGETS.PAGE
      }
    }
  };
}

export function navigateToNextChallenge() {
  return (dispatch, getState) => {
    const { routeSpec, authoring, endMissionUrl } = getState();
    let { level: currentLevel, mission: currentMission, challenge: currentChallenge } = routeSpec,
        nextLevel = routeSpec.level,
        nextMission = routeSpec.mission,
        nextChallenge = currentChallenge+1,
        challengeCountInMission = AuthoringUtils.getChallengeCount(authoring, currentLevel, currentMission);
    if (challengeCountInMission <= nextChallenge) {
      let missionCountInLevel = AuthoringUtils.getMissionCount(authoring, currentLevel);
      // there are not enough challenges...if the next mission exists, navigate to it
      if (currentMission + 1 < missionCountInLevel) {
        nextMission++;
      } else {
        let levelCount = AuthoringUtils.getLevelCount(authoring);
        // otherwise, check if the next level exists
        if (currentLevel + 1 < levelCount) {
          nextLevel++;
        } else {
          // if no next level exists, loop around
          nextLevel = 0;
        }
        nextMission = 0;
      }
      nextChallenge = 0;

      if (endMissionUrl) {
        dispatch(navigateToStartPage(endMissionUrl));
        return;
      }
    }
    dispatch(navigateToChallenge({level: nextLevel, mission: nextMission, challenge: nextChallenge}));
  };
}

/*
 * Called when route params are different from current mission and challenge,
 * so user must have changed them in the address bar.
 * Skips the route change, so just updates current mission and challenge and
 * triggers `loadStateFromAuthoring` in router
 */
export function _navigateToCurrentRoute(routeSpec) {
  const {level, mission, challenge} = routeSpec;
  return {
    type: actionTypes.NAVIGATED,
    level,
    mission,
    challenge,
    skipRouteChange: true,
    meta: {
      logTemplateState: true,
      dontLog: ["skipRouteChange"],
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.NAVIGATED,
        target: ITS_TARGETS.CHALLENGE
      }
    }
  };
}

function restrictToIntegerRange(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(maxValue, Math.trunc(value)));
}

export function navigateToCurrentRoute(routeSpec) {
  const {level, mission, challenge} = routeSpec;
  return (dispatch, getState) => {
    const authoring = getState().authoring,
          levelCount = AuthoringUtils.getLevelCount(authoring),
          nextLevel = restrictToIntegerRange(level, 0, levelCount - 1),
          missionCount = AuthoringUtils.getMissionCount(authoring, nextLevel),
          nextMission = restrictToIntegerRange(mission, 0, missionCount - 1),
          challengeCount = AuthoringUtils.getChallengeCount(authoring, nextLevel, nextMission),
          nextChallenge = restrictToIntegerRange(challenge, 0, challengeCount - 1),
          routeChangeRequired = (level !== nextLevel) || (mission !== nextMission) || (challenge !== nextChallenge);
    // TODO: Ideally, route changes would be handled in their own module (see routing.js)
    if (routeChangeRequired) {
      dispatch(navigateToChallenge({level: nextLevel, mission: nextMission, challenge: nextChallenge}));
    }
    else {
      dispatch(_navigateToCurrentRoute({level: nextLevel, mission: nextMission, challenge: nextChallenge}));
    }
  };
}

export function breed(mother, father, offspringBin, quantity=1, incrementMoves=false) {
  return {
    type: actionTypes.BRED,
    mother,
    father,
    offspringBin,
    quantity,
    incrementMoves
  };
}

export function changeAllele(index, chromosome, side, previousAllele, newAllele, incrementMoves=false) {
 return {
    type: actionTypes.ALLELE_CHANGED,
    index,
    chromosome,
    side,
    previousAllele,
    newAllele,
    incrementMoves,
    meta: {
      logNextState: {
        newAlleles: ["drakes", index, "alleleString"]
      },
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED,
        target: ITS_TARGETS.ALLELE
      }
    }
  };
}

export function changeSex(index, newSex, incrementMoves=false) {
  return{
    type: actionTypes.SEX_CHANGED,
    index,
    newSex,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED,
        target: ITS_TARGETS.SEX
      }
    }
  };
}

export function changeBasketSelection(selectedIndices) {
  return{
    type: actionTypes.BASKET_SELECTION_CHANGED,
    selectedIndices,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED_SELECTION,
        target: ITS_TARGETS.BASKET
      }
    }
  };
}

export function changeDrakeSelection(selectedIndices) {
  return{
    type: actionTypes.DRAKE_SELECTION_CHANGED,
    selectedIndices,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.CHANGED_SELECTION,
        target: ITS_TARGETS.DRAKE
      }
    }
  };
}

function getChallengeScore(state) {
  const { challengeProgress: progress, routeSpec } = state,
        { level, mission, challenge } = routeSpec,
        challengePrefix = `${level}:${mission}:${challenge}`;
  let challengeScore = 0;
  for (let key in progress) {
    if (key.startsWith(challengePrefix)) {
      let trialScore = progress[key];
      if ((trialScore != null) && (trialScore >= 0))
        challengeScore += trialScore;
    }
  }
  return challengeScore;
}

function getEarnedCoinString(state) {
  const challengeScore = getChallengeScore(state),
        scoreIndex = challengeScore >= 2 ? 2 : challengeScore,
        scoreString = ["~ALERT.AWARD_LEVEL_GOLD",
                        "~ALERT.AWARD_LEVEL_SILVER",
                        "~ALERT.AWARD_LEVEL_BRONZE"][scoreIndex];
  return ["~ALERT.NEW_PIECE_OF_COIN", scoreString];
}

function _submitDrake(targetDrakeIndex, userDrakeIndex, correct, state) {
  const incrementMoves = !correct,
        targetDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[targetDrakeIndex]),
        userDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[userDrakeIndex]);

  return {
    type: actionTypes.DRAKE_SUBMITTED,
    species: BioLogica.Species.Drake.name,
    challengeCriteria: {
      sex: targetDrakeOrg.sex,
      phenotype: targetDrakeOrg.phenotype.characteristics
    },
    userSelections: {
      alleles: userDrakeOrg.alleles,
      sex: userDrakeOrg.sex
    },
    correct,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.SUBMITTED,
        target: ITS_TARGETS.ORGANISM
      }
    }
  };
}

export function submitDrake(targetDrakeIndex, userDrakeIndex, correct, incorrectAction) {
  return (dispatch, getState) => {


    const state = getState();
    dispatch(_submitDrake(targetDrakeIndex, userDrakeIndex, correct, state));

    const authoring = state.authoring,
          levelCount = AuthoringUtils.getLevelCount(authoring),
          missionCount = AuthoringUtils.getMissionCount(authoring, state.routeSpec.level),
          challengeCount = AuthoringUtils.getChallengeCount(authoring, state.routeSpec.level, state.routeSpec.mission),
          trials = state.trials,
          trialCount = trials.length;
    let challengeComplete = false,
        missionComplete = false,
        // levelComplete = false,
        allLevelsComplete = false;

    if (correct && state.trial === trialCount - 1) {
      challengeComplete = true;
      if (state.routeSpec.challenge >= challengeCount - 1) {
        missionComplete = true;
        if (state.routeSpec.mission >= missionCount - 1) {
          // levelComplete = true;
          if (state.routeSpec.level >= levelCount - 1)
            allLevelsComplete = true;
        }
      }
    }

    let dialog = {};

    if (correct) {
      if (allLevelsComplete) {
        dialog = {
          message: "~ALERT.TITLE.MISSION_ACCOMPLISHED",
          explanation: "~ALERT.COMPLETE_LAST_MISSION",
          showAward: true
        };
      }
      else if (missionComplete) {
        dialog = {
          message: "~ALERT.TITLE.GOOD_WORK",
          explanation: "~ALERT.COMPLETE_COIN",
          leftButton: {
            label: "~BUTTON.TRY_AGAIN",
            action: "retryCurrentChallenge"
          },
          rightButton: {
            label: "~BUTTON.NEXT_MISSION",
            action: "navigateToNextChallenge"
          },
          showAward: true
        };
      } else if (challengeComplete) {
        dialog = {
          message: "~ALERT.TITLE.GOOD_WORK",
          explanation: getEarnedCoinString(state),
          leftButton: {
            label: "~BUTTON.TRY_AGAIN",
            action: "retryCurrentChallenge"
          },
          rightButton: {
            label: "~BUTTON.NEXT_CHALLENGE",
            action: "navigateToNextChallenge"
          },
          showAward: true
        };
      } else {
        dialog = {
          message: "~ALERT.TITLE.GOOD_WORK",
          explanation: "~ALERT.CORRECT_DRAKE",
          rightButton:{
            label: "~BUTTON.NEXT_TRIAL",
            action: "advanceTrial"
          },
        };
      }
    } else {
      dialog = {
        message: "~ALERT.TITLE.INCORRECT_DRAKE",
        explanation: "~ALERT.INCORRECT_DRAKE",
        rightButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: incorrectAction || "dismissModalDialog"
        },
      };
    }
    dispatch(showModalDialog(dialog));
  };
}

function _rejectEggFromBasket(eggDrakeIndex, basketIndex) {
  return {
    type: actionTypes.EGG_REJECTED,
    eggDrakeIndex,
    basketIndex
  };
}

export function rejectEggFromBasket(args) {
  return (dispatch) => {
    dispatch(_rejectEggFromBasket(args.eggDrakeIndex, args.basketIndex));

    if (args.isChallengeComplete)
      dispatch(showCompleteChallengeDialog());
  };
}

function _acceptEggInBasket(eggDrakeIndex, basketIndex) {
  return {
    type: actionTypes.EGG_ACCEPTED,
    eggDrakeIndex,
    basketIndex
  };
}

export function acceptEggInBasket(args) {
  return (dispatch) => {
    dispatch(_acceptEggInBasket(args.eggDrakeIndex, args.basketIndex));

    if (args.isChallengeComplete)
      dispatch(showCompleteChallengeDialog());
  };
}

function _submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect, state) {
  const incrementMoves = !isCorrect,
        submittedDrake = GeneticsUtils.convertDrakeToOrg(state.drakes[eggDrakeIndex]),
        submittedBasket = state.baskets[basketIndex],
        // Each basket has multiple accepted alleles combinations which, at the time of this writing, all 
        // have the same phenotype. Therefore, we can simply look at the first one
        submittedBasketPhenotypes = GeneticsUtils.convertGeneStringToPhenotype(submittedBasket.alleles[0]),
        drakeCriteria = {
          sex: submittedDrake.sex,
          alleles: submittedDrake.alleles
        },
        basketCriteria = {
          phenotype: submittedBasketPhenotypes
        };
  if (submittedBasket.sex != null) {
    basketCriteria.sex = submittedBasket.sex;
  }
  return {
    type: actionTypes.EGG_SUBMITTED,
    species: BioLogica.Species.Drake.name,
    challengeCriteria: drakeCriteria,
    userSelections: basketCriteria,
    isCorrect,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.SUBMITTED,
        target: ITS_TARGETS.EGG
      }
    }
  };
}

export function submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect, isChallengeComplete) {
  return (dispatch, getState) => {
    dispatch(_submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect, getState()));

    if (isCorrect) {
      dispatch(acceptEggInBasket({eggDrakeIndex, basketIndex, isChallengeComplete}));
    }
    else {
      let dialog = {
        message: "~ALERT.TITLE.EGG_MISMATCH",
        explanation: "~ALERT.EGG_BASKET_MISMATCH",
        rightButton: {
          label: isChallengeComplete ? "~BUTTON.CONTINUE" : "~BUTTON.TRY_ANOTHER_EGG",
          action: "rejectEggFromBasket",
          args: { eggDrakeIndex, basketIndex, isChallengeComplete }
        },
      };
      dispatch(showModalDialog(dialog));
    }
  };
}

export function showCompleteChallengeDialog() {
  return (dispatch, getState) => {
    const state = getState();

    const missionComplete = (AuthoringUtils.getChallengeCount(state.authoring, state.routeSpec.level, state.routeSpec.mission) <= state.routeSpec.challenge + 1);

    let dialog = {};

    if (missionComplete) {
      dialog = {
        message: "~ALERT.TITLE.GOOD_WORK",
        explanation: "~ALERT.COMPLETE_COIN",
        leftButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "retryCurrentChallenge"
        },
        rightButton: {
          label: state.endMissionUrl ? "~BUTTON.END_MISSION" : "~BUTTON.NEXT_MISSION",
          action: "navigateToNextChallenge"
        },
        showAward: true
      };
    }
    else {
      dialog = {
        message: "~ALERT.TITLE.GOOD_WORK",
        explanation: getEarnedCoinString(state),
        leftButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "retryCurrentChallenge"
        },
        rightButton: {
          label: "~BUTTON.NEXT_CHALLENGE",
          action: "navigateToNextChallenge"
        },
        showAward: true
      };
    }

    dispatch(showModalDialog(dialog));
  };
}

export function showModalDialog({message, explanation, rightButton, leftButton, showAward=false, top}) {
  return {
    type: actionTypes.MODAL_DIALOG_SHOWN,
    message,
    explanation,
    rightButton,
    leftButton,
    showAward,
    top
  };
}

export function dismissModalDialog() {
  return{
    type: actionTypes.MODAL_DIALOG_DISMISSED
  };
}

export function advanceTrial() {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_TRIAL,
    authoring,
    meta: {
      logTemplateState: true,
      dontLog: ["authoring"],
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.ADVANCED,
        target: ITS_TARGETS.TRIAL
      }
    }
  };
}


export function completeChallenge() {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.CHALLENGE_COMPLETE,
      score: getChallengeScore(getState()),
      meta: {sound: 'receiveCoin'}
    });
    dispatch(showModalDialog({
      message: "~ALERT.TITLE.GOOD_WORK",
      explanation: getEarnedCoinString(getState()),
      leftButton:{
        label: "~BUTTON.TRY_AGAIN",
        action: "retryCurrentChallenge"
      },
      rightButton:{
        label: "~BUTTON.NEXT_CHALLENGE",
        action: "navigateToNextChallenge"
      },
      showAward: true
    }));
  };
}

export function fertilize(gamete1, gamete2) {
  return {
    type: actionTypes.FERTILIZED,
    gamete1,
    gamete2
  };
}

export function hatch() {
  return {
    type: actionTypes.HATCHED,
    meta: {sound: 'hatchDrake'}
  };
}


function _keepOffspring(index, success, interactionType, shouldKeepSourceDrake) {
  let incrementMoves = !success;
  return {
    type: actionTypes.OFFSPRING_KEPT,
    interactionType,
    index,
    success,
    incrementMoves,
    shouldKeepSourceDrake
  };
}

export function keepOffspring(index, keptDrakesIndices, maxDrakes, shouldKeepSourceDrake) {
  return (dispatch, getState) => {
    const { interactionType, drakes } = getState();

    let offspringOrg = new BioLogica.Organism(BioLogica.Species.Drake, drakes[index].alleleString, drakes[index].sex);

    // Succeed if every kept drake has a different phenotype than the submitted drake
    let success = keptDrakesIndices.every(keptDrakeIndex => {
      let keptDrake = drakes[keptDrakeIndex],
          keptImage = new BioLogica.Organism(BioLogica.Species.Drake, keptDrake.alleleString, keptDrake.sex).getImageName();

      return keptImage !== offspringOrg.getImageName();
    });

    dispatch(_keepOffspring(index, success, interactionType, shouldKeepSourceDrake));

    if (success) {
      // The size of the drakes array has changed since dispatching _keepOffspring
      const { drakes: updatedDrakes } = getState();
      if (updatedDrakes.length === maxDrakes) {
        dispatch(completeChallenge());
      }
    } else {
      dispatch(showModalDialog({
        message: "~ALERT.TITLE.MISTAKE",
        explanation: "~ALERT.DUPLICATE_DRAKE",
        rightButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: shouldKeepSourceDrake ? "dismissModalDialog" : "resetGametes"
        }
      }));
    }
  };
}

