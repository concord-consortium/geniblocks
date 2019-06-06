/* global firebase*/
import actionTypes from './action-types';
import { ITS_ACTORS, ITS_ACTIONS, ITS_TARGETS } from './its-constants';
import GeneticsUtils from './utilities/genetics-utils';
import AuthoringUtils from './utilities/authoring-utils';
import ProgressUtils from './utilities/progress-utils';
import { getUserQueryString } from './middleware/state-save';
import { notificationType } from './modules/notifications';
import { endRemediation } from './modules/remediation';
import { getGemFromChallengeErrors } from './reducers/helpers/gems-helper';
import migrate from './migrations';
//import { tutorialActionTypes } from './modules/tutorials';

export { actionTypes };

export const CONNECTION_STATUS = {
  online: "online",
  anonymous: "anonymous",
  disconnected: "disconnected"
};

function _startSession(uuid, itsDBEndpoint) {
  return {
    type: actionTypes.SESSION_STARTED,
    session: uuid,
    itsDBEndpoint,
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

export function startSession(uuid) {
  return (dispatch, getState) => {
    const userQueryString = getUserQueryString();
    const itsDataQuery = userQueryString ? userQueryString + "/itsData" : null;

    dispatch(_startSession(uuid, itsDataQuery));

    if (typeof firebase !== "undefined" && userQueryString) {
      // Attempt to load saved state from firebase
      const db = firebase.database(),
            ref = db.ref(userQueryString + "/state" );

      ref.once("value", function(data) {
        let loadedState = data.val(),
            migratedState = migrate(loadedState);
        if (migratedState) {
          dispatch({
            type: actionTypes.LOAD_SAVED_STATE,
            state: migratedState
          });
        }

        const { location, routeSpec } = getState();
        if (location && location.id === "home") {
          dispatch(navigateToHome());
        } else if (routeSpec) {
          dispatch(navigateToCurrentRoute(routeSpec));
        }
      });
    }

  };
}

export function checkSession(fbConnected) {
  const timeNow = new Date().getTime();
  const timeThen = window.sessionStorage.getItem('lastUpdate');
  const timeDeltaSeconds = (timeNow - timeThen) / 1000;
  // 24 hours
  const sessionExpired = timeDeltaSeconds > 60 * 60 * 24;

  const portalUser = window.sessionStorage.getItem('portalAuth') === "true";
  if (portalUser) {
    // if we never set a session timestamp
    if (!timeThen) return CONNECTION_STATUS.disconnected;
    // if we're truly not connected for read/write to firebase
    if (!fbConnected) return CONNECTION_STATUS.disconnected;
    // if we are connected to firebase but session has been idle for a long time
    if (fbConnected && sessionExpired) {
      // May not have a live session - set status to offline
      // but allow the student to keep playing - if they reconnect they can
      // continue without loss of crystals
      window.sessionStorage.setItem('lastUpdate', timeNow);
      return CONNECTION_STATUS.disconnected;
    } else {
      // Update session time
      window.sessionStorage.setItem('lastUpdate', timeNow);
      return CONNECTION_STATUS.online;
    }
  } else {
    // we're not a portal user
    if (fbConnected) {
      // We can read from firebase, but we're not storing progress crystals
      return CONNECTION_STATUS.anonymous;
    } else {
      return CONNECTION_STATUS.disconnected;
    }
  }
}

export function setConnectionState(connectionState, notify = false) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CONNECTION_STATE_CHANGED,
      connectionState
    });
    if (notify) {
      dispatch(notifyConnectionState(connectionState));
    }

  };
}

export function notifyConnectionState(currentState) {
  return (dispatch) => {
    switch (currentState) {
      case CONNECTION_STATUS.online:
        dispatch(showSystemMessage({
          message: {
            text: "~CONNECTION.CONNECTED",
          }
        }));
        break;
      case CONNECTION_STATUS.anonymous:
        dispatch(showSystemMessage({
          message: {
            text: "~CONNECTION.ANONYMOUS",
          },
          systemMessage: CONNECTION_STATUS.anonymous
        }));
        break;
      case CONNECTION_STATUS.disconnected:
        dispatch(showSystemMessage({
          message: {
            text: "~CONNECTION.DISCONNECTED",
          },
          systemMessage: CONNECTION_STATUS.disconnected
        }));
        break;
    }
  };
}

export function changeAuthoring(authoring) {
  return {
    type: actionTypes.AUTHORING_CHANGED,
    authoring
    // meta: {
    //   itsLog: {
    //     actor: ITS_ACTORS.USER,
    //     action: ITS_ACTIONS.CHANGED,
    //     target: ITS_TARGETS.AUTHORING
    //   }
    // }
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

export function navigateToHome(showMissionEndDialog=false) {
  return {
    type: actionTypes.NAVIGATED_HOME,
    showMissionEndDialog
  };
}

function _retryCurrentChallenge() {
  return {
    type: actionTypes.CHALLENGE_RETRIED
  };
}

export function retryCurrentChallenge() {
  return (dispatch, getState) => {
    dispatch(_retryCurrentChallenge());
    dispatch(navigateToChallenge(getState().routeSpec));
  };
}

export function retryCurrentChallengeWithoutRoomDialog() {
  return (dispatch) => {
    dispatch(endRemediation());
    dispatch(retryCurrentChallenge());
    dispatch(enterChallengeFromRoom());
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

export function continueFromVictory() {
  return (dispatch, getState) => {
    const { routeSpec, authoring, gems } = getState(),
          currentMission = routeSpec.level + "" + routeSpec.mission,
          nextMissionSpec = ProgressUtils.getCurrentChallengeFromGems(authoring, gems),
          nextMission = nextMissionSpec.level + "" + nextMissionSpec.mission;
    if (currentMission !== nextMission) {
      dispatch(navigateToHome(true));
    } else {
      dispatch(navigateToNextChallenge(true));
    }
  };
}

export function navigateToNextChallenge() {
  return (dispatch, getState) => {
    const { routeSpec, authoring, endMissionUrl, gems } = getState();
    let { level: currentLevel, mission: currentMission } = routeSpec,
        { level: nextLevel, mission: nextMission, challenge: nextChallenge } = ProgressUtils.getCurrentChallengeFromGems(authoring, gems);
    if (currentLevel !== nextLevel || currentMission !== nextMission) {
      dispatch(navigateToHome(true));

      if (endMissionUrl) {
        dispatch(navigateToStartPage(endMissionUrl));
      }
      return;
    } else {
      dispatch(navigateToChallenge({level: nextLevel, mission: nextMission, challenge: nextChallenge}));
    }
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
    let state = getState(),
        authoring = state.authoring,
        levelCount = AuthoringUtils.getLevelCount(authoring),
        nextLevel = restrictToIntegerRange(level, 0, levelCount - 1),
        missionCount = AuthoringUtils.getMissionCount(authoring, nextLevel),
        nextMission = restrictToIntegerRange(mission, 0, missionCount - 1),
        challengeCount = AuthoringUtils.getChallengeCount(authoring, nextLevel, nextMission),
        nextChallenge = restrictToIntegerRange(challenge, 0, challengeCount - 1);

    // Prevent students from skipping through missions by re-routing to the next unlocked challenge
    // if (ProgressUtils.isMissionLocked(state.gems, authoring, nextLevel, nextMission)) {
    //   let currentChallengeRoute = ProgressUtils.getCurrentChallengeFromGems(authoring, state.gems);
    //   nextLevel = currentChallengeRoute.level;
    //   nextMission = currentChallengeRoute.mission;
    //   nextChallenge = currentChallengeRoute.challenge;
    // }

    const routeChangeRequired = (level !== nextLevel) || (mission !== nextMission) || (challenge !== nextChallenge);
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
  return (dispatch, getState) => {
    const state = getState();
    const itsTarget = state.template === "ClutchGame" ? ITS_TARGETS.PARENTS : ITS_TARGETS.ALLELE;
    dispatch({
      type: actionTypes.ALLELE_CHANGED,
      index,
      chromosome,
      side,
      previousAllele,
      newAllele,
      incrementMoves,
      meta: {
        itsLog: {
          actor: ITS_ACTORS.USER,
          action: ITS_ACTIONS.CHANGED,
          target: itsTarget
        }
      }
    });
  };
}

export function selectAllele(chromosome, side, previousAllele, newAllele, gene, incrementMoves=false) {
  return {
    type: actionTypes.ALLELE_SELECTED,
    chromosome,
    side,
    previousAllele,
    newAllele,
    gene,
    incrementMoves,
    meta: {
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
    selectedIndices
  };
}

export function changeDrakeSelection(selectedIndices) {
  return{
    type: actionTypes.DRAKE_SELECTION_CHANGED,
    selectedIndices
  };
}

function _submitDrake(targetDrakeIndex, userDrakeIndex, correct, state, motherIndex, fatherIndex) {
  const incrementMoves = !correct,
        targetDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[targetDrakeIndex]),
        userDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[userDrakeIndex]),
        isBredDrake = !isNaN(motherIndex),
        itsAction = state.template === "ClutchGame" ? ITS_ACTIONS.SELECTED : ITS_ACTIONS.SUBMITTED,
        itsTarget = isBredDrake ? ITS_TARGETS.OFFSPRING : ITS_TARGETS.ORGANISM;
  var selected;

  if (isBredDrake) {
    const motherDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[motherIndex]),
          fatherDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[fatherIndex]);
    selected = {
      motherAlleles: motherDrakeOrg.alleles,
      fatherAlleles: fatherDrakeOrg.alleles,
      offspringAlleles: userDrakeOrg.alleles,
      offspringSex: userDrakeOrg.sex === 0 ? "male" : "female"
    };
  } else {
    selected = {
      alleles: userDrakeOrg.alleles,
      sex: userDrakeOrg.sex
    };
  }

  return {
    type: actionTypes.DRAKE_SUBMITTED,
    species: BioLogica.Species.Drake.name,
    target: {
      sex: targetDrakeOrg.sex,
      phenotype: targetDrakeOrg.phenotype.characteristics
    },
    selected,
    correct,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: itsAction,
        target: itsTarget
      }
    }
  };
}

export function submitDrake(targetDrakeIndex, userDrakeIndex, correct, incorrectAction, motherIndex, fatherIndex) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(_submitDrake(targetDrakeIndex, userDrakeIndex, correct, state, motherIndex, fatherIndex));

    const trialCount = state.numTrials,
          challengeComplete = (correct && state.trial === trialCount - 1);

    if (correct) {
      if (challengeComplete) {
        dispatch(showInChallengeCompletionMessage());
      } else {
        dispatch(showNotification({
          message: {
            text: "~ALERT.TITLE.GOOD_WORK",
            type: notificationType.NARRATIVE
          },
          closeButton: {
            action: "advanceTrial"
          }
        }));
        dispatch(showNextTrialButton());
      }
    } else {
      dispatch(showNotification({
        message: "~ALERT.TITLE.INCORRECT_DRAKE",
        closeButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: incorrectAction || "dismissModalDialog"
        }
      }));
    }
  };
}

function _submitParents(motherIndex, fatherIndex, targetDrakeIndices, correct, state) {
  const incrementMoves = !correct,
        motherDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[motherIndex]),
        fatherDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[fatherIndex]),
        targetDrakeOrgs = targetDrakeIndices.map(i =>
          GeneticsUtils.convertDrakeToOrg(state.drakes[i])),
        selected = {
          motherAlleles: motherDrakeOrg.alleles,
          fatherAlleles: fatherDrakeOrg.alleles
        },
        target = targetDrakeOrgs.map(o =>
          ({
            sex: o.sex,
            phenotype: o.phenotype.characteristics
          }));


  return {
    type: actionTypes.DRAKE_SUBMITTED,
    species: BioLogica.Species.Drake.name,
    target,
    selected,
    correct,
    incrementMoves,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.SUBMITTED,
        target: ITS_TARGETS.PARENTS
      }
    }
  };
}

export function submitParents(motherIndex, fatherIndex, targetDrakeIndices, correct) {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(_submitParents(motherIndex, fatherIndex, targetDrakeIndices, correct, state));

    const trialCount = state.numTrials,
          challengeComplete = (correct && state.trial === trialCount - 1);

    if (correct) {
      if (challengeComplete) {
        dispatch(showInChallengeCompletionMessage());
      } else {
        dispatch(showNotification({
          message: {
            text: "~ALERT.TITLE.GOOD_WORK",
            type: notificationType.NARRATIVE
          },
          closeButton: {
            action: "advanceTrial"
          }
        }));
        dispatch(showNextTrialButton());
      }
    } else {
      dispatch(showNotification({
        message: "~ALERT.TITLE.INCORRECT_PARENT",
        closeButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: "dismissModalDialog"
        }
      }));
    }
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
  };
}

function _acceptEggInBasket(eggDrakeIndex, basketIndex) {
  return {
    type: actionTypes.EGG_ACCEPTED,
    eggDrakeIndex,
    basketIndex,
    meta: {sound: 'receiveCoin'}
  };
}

export function acceptEggInBasket(args) {
  return (dispatch) => {
    dispatch(_acceptEggInBasket(args.eggDrakeIndex, args.basketIndex));

    if (args.isChallengeComplete) {
      dispatch(showInChallengeCompletionMessage());
    }
  };
}

function _submitEggForBasket(eggDrakeIndex, basketIndex, isCorrect, state) {
  const incrementMoves = !isCorrect,
        submittedDrake = GeneticsUtils.convertDrakeToOrg(state.drakes[eggDrakeIndex]),
        submittedBasket = state.baskets[basketIndex],
        // if the basket has a sex criterion then use it, otherwise use the drake's sex
        phenotypeSex = submittedBasket.sex != null ? submittedBasket.sex : submittedDrake.sex,
        // Each basket has multiple accepted alleles combinations which, at the time of this writing, all
        // have the same phenotype. Therefore, we can simply look at the first one.
        submittedBasketPhenotypes = GeneticsUtils.convertGeneStringToPhenotype(submittedBasket.alleles[0], phenotypeSex),
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
    target: drakeCriteria,
    selected: basketCriteria,
    correct: isCorrect,
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
    } else {
      dispatch(rejectEggFromBasket({eggDrakeIndex, basketIndex, isChallengeComplete}));
      let dialog = {
        message: "~ALERT.TITLE.EGG_MISMATCH",
      };
      if (isChallengeComplete) {
        dialog.closeButton = {
          action: "showInChallengeCompletionMessage"
        };
      } else {
        dialog.closeButton = {
          action: "dismissModalDialog"
        };
      }
      dispatch(showNotification(dialog));
    }
  };
}

export function showCompleteChallengeDialog() {
  const leftButton = {
      action: "retryCurrentChallenge"
    },
    rightButton = {
      action: "continueFromVictory"
    };
  return {
    type: actionTypes.MODAL_DIALOG_SHOWN,
    rightButton,
    leftButton,
    showAward: true
  };
}

export function showNextTrialButton() {
  const rightButton = {
          action: "advanceTrial"
        };
  return {
    type: actionTypes.MODAL_DIALOG_SHOWN,
    bigButtonText: "~BUTTON.NEXT_TRIAL",
    rightButton,
    showAward: false
  };
}

/**
 *
 * @param {Object} data
 * @param {string} data.message - String of a single message
 * @param {Object | bool} data.closeButton - Object with a {string} label and a {string} action property, naming
 *    an action function, or `true` just to show button to close dialog
 * @param {bool} data.arrowAsCloseButton - `true` to show an arrow that acts as the above close button
 * @param {bool} data.isRaised - `true` to raise button above gems on screen
 * @param {bool} data.isInterrupt - `false` to append to end of existing messages, `true` to clear existing messages
 */
export function showNotification({message, closeButton, arrowAsCloseButton, isRaised, isInterrupt}) {
  const messageObj = typeof message === "string" ? {text: message} : message;
  return showNotifications({
    messages: [messageObj],
    closeButton,
    arrowAsCloseButton,
    isRaised,
    isInterrupt
  });
}

export function showNotifications({ messages, closeButton, arrowAsCloseButton = false, isRaised = false, isInterrupt = false, systemMessage }) {
  const notification = {
    type: actionTypes.NOTIFICATIONS_SHOWN,
    messages,
    arrowAsCloseButton,
    closeButton,
    isRaised,
    isInterrupt
  };
  if (systemMessage) notification.systemMessage = systemMessage;
  return notification;
}

export function showSystemMessage({ message, systemMessage = "green" }) {
  return showNotifications({
    messages: [message],
    closeButton: true,
    isRaised: true,
    isInterrupt: true,
    systemMessage
  });
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

export function showInChallengeCompletionMessage() {
  return (dispatch, getState) => {

    const { isRemediation } = getState();

    if (!isRemediation) {
      dispatch({
        type: actionTypes.CHALLENGE_COMPLETED,
        meta: {sound: 'receiveCoin'}
      });

      dispatch(showNotification({
        message: {
          text: "~ALERT.COMPLETED_CHALLENGE",
          type: notificationType.NARRATIVE
        },
        closeButton: {
          action: "completeChallenge"
        },
        arrowAsCloseButton: true,
        isRaised: true
      }));

      dispatch({
        type: actionTypes.MODAL_DIALOG_SHOWN,
        mouseShieldOnly: true
      });
    } else {
      dispatch(showNotification({
        message: {
          text: "~REMEDIATION.COMPLETED_CHALLENGE"
        },
        closeButton: {
          action: "retryCurrentChallengeWithoutRoomDialog"
        },
        arrowAsCloseButton: true
      }));
    }
  };
}


export function completeChallenge() {
  return (dispatch, getState) => {
    dispatch(showCompleteChallengeDialog());

    const { routeSpec, authoring, challengeErrors } = getState(),
          authoredChallengeMetadata = AuthoringUtils.getChallengeMeta(authoring, routeSpec),
          success = getGemFromChallengeErrors(challengeErrors) < 3,
          dialogOptions = authoredChallengeMetadata && authoredChallengeMetadata.dialog && authoredChallengeMetadata.dialog.end;

    if (dialogOptions) {
      let dialog = success ? dialogOptions.success : dialogOptions.failure,
          messages = dialog.map( (d) => ({type: notificationType.NARRATIVE, ...d}));
      dispatch(showNotifications({
        messages,
        closeButton: {
          action: ""
        }
      }));
    }
  };
}

export function fertilize() {
  return {
    type: actionTypes.FERTILIZED
  };
}

export function breedClutch(clutchSize) {
  return {
    type: actionTypes.CLUTCH_BRED,
    clutchSize,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.BRED,
        target: ITS_TARGETS.CLUTCH
      }
    }
  };
}

export function clearClutch(index) {
  return {
    type: actionTypes.CLUTCH_CLEARED,
    index
  };
}

export function readyToAnswer(ready) {
  return {
    type: actionTypes.READY_TO_ANSWER,
    ready
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
        dispatch(showInChallengeCompletionMessage());
      }
    } else {
      dispatch(showNotification({
        message: "~ALERT.DUPLICATE_DRAKE",
        closeButton: {
          label: "~BUTTON.TRY_AGAIN",
          action: shouldKeepSourceDrake ? "dismissModalDialog" : "resetGametes"
        }
      }));
    }
  };
}

function _winZoomChallenge(stats) {
  return {
    type: actionTypes.ZOOM_CHALLENGE_WON,
    // score currently calculated in zoom template
    challengeErrors: stats.score ? stats.score : 0,
    stats,
    meta: {
      itsLog: {
        actor: ITS_ACTORS.USER,
        action: ITS_ACTIONS.COMPLETED,
        target: ITS_TARGETS.CHALLENGE
      }
    }
  };
}

export function winZoomChallenge(stats) {
  return (dispatch) => {
    dispatch(_winZoomChallenge(stats));

    dispatch(showInChallengeCompletionMessage());
  };
}

export function toggleMap(isVisible) {
  return {
    type: actionTypes.TOGGLE_MAP,
    isVisible: isVisible
  };
}

export function enterChallengeFromRoom() {
  return {
    type: actionTypes.ENTERED_CHALLENGE_FROM_ROOM
  };
}

// no-op, this is just for logging
export function showEasterEgg() {
  return {
    type: actionTypes.VIEWED_EASTER_EGG
  };
}

// re-export any actions needed by the notification-dialog close button
export { startRemediation } from './modules/remediation';