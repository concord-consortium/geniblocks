import actionTypes from './action-types';
import { ITS_ACTORS, ITS_ACTIONS, ITS_TARGETS } from './its-constants';

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

export function navigateToChallenge(level, _case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
    level,
    case: _case,
    challenge,
    route: `/${level+1}/${_case+1}/${challenge+1}`,
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
    const { level: currentLevel, case: currentCase, challenge: currentChallenge } = getState();
    dispatch(navigateToChallenge(currentLevel, currentCase, currentChallenge));
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
    const { level: currentLevel, case: currentCase, challenge: currentChallenge,
            authoring, endCaseUrl } = getState();
    let nextLevel = currentLevel,
        nextCase = currentCase,
        nextChallenge = currentChallenge+1,
        challengeCountInCase = authoring[currentLevel][currentCase].length;
    if (challengeCountInCase <= nextChallenge) {
      // there are not enough challenges...if the next case exists, navigate to it
      if (authoring[currentLevel][currentCase+1]) {
        nextCase++;
      } else {   
        // otherwise, check if the next level exists
        if (authoring[currentLevel+1]) {
          nextLevel++;
        } else {
          // if no next level exists, loop around
          nextLevel = 0;
        }
        nextCase = 0;
      }
      nextChallenge = 0;

      if (endCaseUrl) {
        dispatch(navigateToStartPage(endCaseUrl));
        return;
      }
    }
    dispatch(navigateToChallenge(nextLevel, nextCase, nextChallenge));
  };
}

/*
 * Called when route params are different from current case and challenge,
 * so user must have changed them in the address bar.
 * Skips the route change, so just updates current case and challenge and
 * triggers `loadStateFromAuthoring` in router
 */
export function _navigateToCurrentRoute(level, _case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
    level,
    case: _case,
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

export function navigateToCurrentRoute(level, _case, challenge) {
  return (dispatch, getState) => {
    const { authoring: levels } = getState(),
          levelCount = levels.length,
          nextLevel = restrictToIntegerRange(level, 0, levelCount - 1),
          caseCount = levels[nextLevel].length,
          nextCase = restrictToIntegerRange(_case, 0, caseCount - 1),
          challengeCount = levels[nextLevel][nextCase].length,
          nextChallenge = restrictToIntegerRange(challenge, 0, challengeCount - 1),
          routeChangeRequired = (level !== nextLevel) || (_case !== nextCase) || (challenge !== nextChallenge);
    if (routeChangeRequired) {
      dispatch(navigateToChallenge(nextLevel, nextCase, nextChallenge));
    }
    else {
      dispatch(_navigateToCurrentRoute(nextLevel, nextCase, nextChallenge));
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
  const { challengeProgress: progress, case: case_, challenge } = state,
        challengePrefix = `${case_}:${challenge}`;
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

function _submitDrake(correctPhenotype, submittedPhenotype, correct) {
  let incrementMoves = !correct;
  return{
    type: actionTypes.DRAKE_SUBMITTED,
    correctPhenotype,
    submittedPhenotype,
    correct,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.SUBMITTED,
        target: ITS_TARGETS.DRAKE
      }
    }
  };
}

export function submitDrake(correctPhenotype, submittedPhenotype, correct, incorrectAction) {
  return (dispatch, getState) => {
    dispatch(_submitDrake(correctPhenotype, submittedPhenotype, correct));

    const state = getState();
    let challengeComplete = false,
        caseComplete = false;

    if (correct && state.trial === state.trials.length-1) {
      challengeComplete = true;
      if (state.authoring[state.case].length <= state.challenge+1) {
        caseComplete = true;
      }
    }

    let dialog = {};

    if (correct) {
      if (caseComplete) {
        dialog = {
          message: "~ALERT.TITLE.GOOD_WORK",
          explanation: "~ALERT.COMPLETE_COIN",
          leftButton: {
            label: "~BUTTON.TRY_AGAIN",
            action: "retryCurrentChallenge"
          },
          rightButton: {
            label: "~BUTTON.NEXT_CASE",
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
          top: "475px"
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
        top: "475px"
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

function _submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect) {
  let incrementMoves = !isCorrect;
  return{
    type: actionTypes.EGG_SUBMITTED,
    eggDrakeIndex,
    basketIndex,
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
  return (dispatch) => {
    dispatch(_submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect));

    let dialog = {};

    if (isCorrect) {
      dialog = {
        message: "~ALERT.TITLE.GOOD_WORK",
        explanation: "~ALERT.EGG_BASKET_MATCH",
        rightButton:{
          label: "~BUTTON.CONTINUE",
          action: "acceptEggInBasket",
          args: { eggDrakeIndex, basketIndex, isChallengeComplete }
        },
        top: "475px"
      };
    }
    else {
      dialog = {
        message: "~ALERT.TITLE.EGG_MISMATCH",
        explanation: "~ALERT.EGG_BASKET_MISMATCH",
        rightButton: {
          label: isChallengeComplete ? "~BUTTON.CONTINUE" : "~BUTTON.TRY_ANOTHER_EGG",
          action: "rejectEggFromBasket",
          args: { eggDrakeIndex, basketIndex, isChallengeComplete }
        },
        top: "475px"
      };
    }
    setTimeout(function() {
      dispatch(showModalDialog(dialog));
    }, 4000);
  };
}

export function showCompleteChallengeDialog() {
  return (dispatch, getState) => {
    const state = getState();

    const caseComplete = (state.authoring[state.case].length <= state.challenge + 1);

    let dialog = {};

    if (caseComplete) {
      dialog = {
        message: "~ALERT.TITLE.GOOD_WORK",
        explanation: "~ALERT.COMPLETE_COIN",
        leftButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "retryCurrentChallenge"
        },
        rightButton: {
          label: state.endCaseUrl ? "~BUTTON.END_CASE" : "~BUTTON.NEXT_CASE",
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


export function advanceChallenge() {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_CHALLENGE,
    authoring,
    meta: {
      logTemplateState: true,
      dontLog: ["authoring"],
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.ADVANCED,
        target: ITS_TARGETS.CHALLENGE
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

