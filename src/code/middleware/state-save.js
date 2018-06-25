/* globals firebase */

/**
 Our current user state:

  {
    state: < saveable state (i.e. gems) >,
    stateVersion: n,
    stateMeta: {
      lastActionTime: t
      currentChallenge: {l, m, c}
    },
    itsData: < set by ITS >
  }
 */

import actionTypes from '../action-types';
import progressUtils from '../utilities/progress-utils';
import { getFBClassId, getFBUserId } from "../utilities/firebase-auth";
import { currentStateVersion } from '../migrations';

export const authoringVersionNumber = 1;
let userQueryString = getUserQueryString();

export default () => store => next => action => {
  let prevState = store.getState(),
      result = next(action),
    nextState = store.getState();
  // try to update user state path if it's missing
  if (!userQueryString) userQueryString = getUserQueryString();
  // If we have a FB query string, update timestamp on every action,
  // and update savable state (gems) if they have changed
  if (userQueryString) {
    let time = firebase.database.ServerValue.TIMESTAMP,
        currentChallenge = getCurrentChallenge(nextState),
        stateMeta = {
          lastActionTime: time,
          currentChallenge
        },
        userDataUpdate = {stateMeta: stateMeta};

    // Store updated gems if they have changed
    if (action.type !== actionTypes.LOAD_SAVED_STATE &&
          (JSON.stringify(prevState.gems) !== JSON.stringify(nextState.gems) ||
           JSON.stringify(prevState.remediationHistory) !== JSON.stringify(nextState.remediationHistory))) {
      let {gems, remediationHistory} = nextState;
      userDataUpdate.state = {
        gems,
        remediationHistory,
        stateVersion: currentStateVersion
      };
    }
    firebase.database().ref(userQueryString).update(userDataUpdate, onComplete);
  }

  return result;
};

const onComplete = function(error) {
  if (error) {
    console.logError(error);
    return error;
  } else {
    return;
  }
};

const getCurrentChallenge = function(nextState) {
  const {routeSpec, authoring, gems} = nextState;
  if (!authoring) {
    return null;
  } else if (routeSpec && routeSpec.level !== undefined) {
    return {
      level: routeSpec.level,
      mission: routeSpec.mission,
      challenge: routeSpec.challenge
    };
  } else {
    return progressUtils.getCurrentChallengeFromGems(authoring, gems);
  }
};

export function getUserQueryString() {
  const classId = getFBClassId(),
        userId = getFBUserId();

  return (classId && userId) ? authoringVersionNumber + "/userState/" + classId + "/" + userId : null;
}