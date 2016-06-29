export const actionTypes = {
  SESSION_STARTED: "Session started",
  LOADED_CHALLENGE_FROM_AUTHORING: "Loaded challenge from authoring",
  NAVIGATED: "Navigated",
  BRED: "Bred",
  ALLELE_CHANGED: "Allele changed",
  SEX_CHANGED: "Sex changed",
  GAMETE_CHROMOSOME_ADDED: "Gamete chromosome added",
  DRAKE_SUBMITTED: "Drake submitted",
  NAVIGATED_NEXT_CHALLENGE: "Navigated to next challenge",
  MODAL_DIALOG_DISMISSED: "Modal dialog dismissed",
  ADVANCED_TRIAL: "Advanced to next trial",
  ADVANCED_CHALLENGE: "Advanced to next challenge",
  SOCKET_CONNECTED: "Socket connected",
  SOCKET_RECEIVED: "Socket received",
  SOCKET_ERRORED: "Socket errored"
};

export function startSession(uuid) {
  return {
    type: actionTypes.SESSION_STARTED,
    session: uuid
  };
}

export function navigateToChallenge(_case, challenge) {
  return {
    type: actionTypes.NAVIGATED,
    case: _case,
    challenge,
    route: `/${_case+1}/${challenge+1}`
  };
}

export function navigateToNextChallenge() {
  return (dispatch, getState) => {
    const { case: currentCase, challenge: currentChallenge} = getState();
    dispatch(navigateToChallenge(currentCase, currentChallenge+1));
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
    skipRouteChange: true
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
      }
    }
  };
}

export function changeSex(index, newSex, incrementMoves=false) {
  return{
    type: actionTypes.SEX_CHANGED,
    index,
    newSex,
    incrementMoves
  };
}

export function submitDrake(correctPhenotype, submittedPhenotype, correct) {
  let incrementMoves = !correct;
  return{
    type: actionTypes.DRAKE_SUBMITTED,
    correctPhenotype,
    submittedPhenotype,
    correct,
    incrementMoves
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
    authoring
  };
}


export function advanceChallenge() {
  let authoring = window.GV2Authoring;
  return{
    type: actionTypes.ADVANCED_CHALLENGE,
    authoring
  };
}

export function addGameteChromosome(index, number, chromosome) {
  return{
    type: actionTypes.GAMETE_CHROMOSOME_ADDED,
    index,
    number,
    chromosome
  };
}


