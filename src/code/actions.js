export const actionTypes = {
  SESSION_STARTED: "Session started",
  LOADED_CHALLENGE_FROM_AUTHORING: "Loaded challenge from authoring",
  NAVIGATED: "Navigated",
  CHALLENGE_COMPLETE: "Challenge completed",
  BRED: "Bred",
  ALLELE_CHANGED: "Allele changed",
  SEX_CHANGED: "Sex changed",
  GAMETE_CHROMOSOME_ADDED: "Gamete chromosome added",
  FERTILIZED: "Fertilized",
  HATCHED: "Hatched",
  EGG_PLACED: "Egg placed",
  OFFSPRING_KEPT: "Offspring kept",
  DRAKE_SUBMITTED: "Drake submitted",
  GAMETES_RESET: "Gametes reset",
  NAVIGATED_NEXT_CHALLENGE: "Navigated to next challenge",
  MODAL_DIALOG_SHOWN: "Modal dialog shown",
  MODAL_DIALOG_DISMISSED: "Modal dialog dismissed",
  ADVANCED_TRIAL: "Advanced to next trial",
  ADVANCED_CHALLENGE: "Advanced to next challenge",
  SOCKET_CONNECTED: "Socket connected",
  SOCKET_RECEIVED: "Socket received",
  SOCKET_ERRORED: "Socket errored"
};

const ITS_ACTORS = {
  SYSTEM: "SYSTEM",
  USER: "USER"
};

const ITS_ACTIONS = {
  STARTED: "STARTED",
  NAVIGATED: "NAVIGATED",
  ADVANCED: "ADVANCED",
  CHANGED: "CHANGED",
  SUBMITTED: "SUBMITTED",
  PLACED: "PLACED"
};

const ITS_TARGETS = {
  SESSION: "SESSION",
  CHALLENGE: "CHALLENGE",
  TRIAL: "TRIAL",
  ALLELE: "ALLELE",
  SEX: "SEX",
  EGG: "EGG",
  DRAKE: "DRAKE"
};

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

export function navigateToChallenge(_case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
    case: _case,
    challenge,
    route: `/${_case+1}/${challenge+1}`,
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
    const { case: currentCase, challenge: currentChallenge } = getState();
    dispatch(navigateToChallenge(currentCase, currentChallenge));
  };
}

export function navigateToNextChallenge() {
  return (dispatch, getState) => {
    const { case: currentCase, challenge: currentChallenge, authoring} = getState();
    let nextCase = currentCase,
        nextChallenge = currentChallenge+1,
        challengeCountInCase = authoring[currentCase].length;
    if (challengeCountInCase <= nextChallenge) {
      // if the next case exists, navigate to it
      if (authoring[currentCase+1])
        nextCase++;
      // otherwise, circle back to the beginning
      else
        nextCase = 0;
      nextChallenge = 0;
    }
    dispatch(navigateToChallenge(nextCase, nextChallenge));
  };
}

/*
 * Called when route params are different from current case and challenge,
 * so user must have changed them in the address bar.
 * Skips the route change, so just updates current case and challenge and
 * triggers `loadStateFromAuthoring` in router
 */
export function navigateToCurrentRoute(_case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
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
          explanation: "~ALERT.NEW_PIECE_OF_COIN",
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

function _putEggInBasket(egg, basket, isCorrect) {
  let incrementMoves = !isCorrect;
  return{
    type: actionTypes.EGG_PLACED,
    egg,
    basket,
    isCorrect,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.PLACED,
        target: ITS_TARGETS.EGG
      }
    }
  };
}

export function putEggInBasket(egg, basket, isCorrect, isChallengeComplete) {
  return (dispatch, getState) => {
    dispatch(_putEggInBasket(egg, basket, isCorrect));

    const state = getState();
    let caseComplete = false;

    if (isChallengeComplete) {
      if (state.authoring[state.case].length <= state.challenge+1) {
        caseComplete = true;
      }
    }

    let dialog = {};

    if (isCorrect) {
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
      } else if (isChallengeComplete) {
        dialog = {
          message: "~ALERT.TITLE.GOOD_WORK",
          explanation: "~ALERT.NEW_PIECE_OF_COIN",
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
          explanation: "~ALERT.EGG_BASKET_MATCH",
          rightButton:{
            label: "~BUTTON.CONTINUE",
            action: "dismissModalDialog"
          },
          top: "475px"
        };
      }
    } else {
      dialog = {
        message: "~ALERT.TITLE.EGG_MISMATCH",
        explanation: "~ALERT.EGG_BASKET_MISMATCH",
        rightButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "dismissModalDialog"
        },
        top: "475px"
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
  return (dispatch) => {
    dispatch({
      type: actionTypes.CHALLENGE_COMPLETE,
      meta: {sound: 'receiveCoin'}
    });
    dispatch(showModalDialog({
      message: "~ALERT.TITLE.GOOD_WORK",
      explanation: "~ALERT.NEW_PIECE_OF_COIN",
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

export function addGameteChromosome(index, name, side) {
  return{
    type: actionTypes.GAMETE_CHROMOSOME_ADDED,
    index,
    name,
    side
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


function _keepOffspring(index, success) {
  return {
    type: actionTypes.OFFSPRING_KEPT,
    index,
    success
  };
}

export function keepOffspring(index, success, maxDrakes) {
    return (dispatch, getState) => {
    dispatch(_keepOffspring(index, success));

    if (success) {
      const { drakes } = getState();
      if (drakes.length === maxDrakes) {
        dispatch(completeChallenge());
      }
    } else {
      dispatch(showModalDialog({
        message: "~ALERT.TITLE.MISTAKE",
        explanation: "~ALERT.DUPLICATE_DRAKE",
        rightButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "resetGametes"
        }
      }));
    }
  };
}

export function resetGametes() {
  return {
    type: actionTypes.GAMETES_RESET
  };
}
