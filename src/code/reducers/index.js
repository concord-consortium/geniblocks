import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import { loadStateFromAuthoring, loadNextTrial, loadHome, loadStateFromRemediation } from './helpers/load-state-from-authoring';
import urlParams from '../utilities/url-params';

// reducers
import routing from './routing';
import moves from './moves';
import modalDialog from './modal-dialog';
import userDrakeHidden from './user-drake-hidden';
import parentDrakeHidden from './parent-drake-hidden';
import gametes from '../modules/gametes';
import drakes from './drakes';
import baskets from './baskets';
import notifications from '../modules/notifications';
import { remediation, remediationHistory, STARTED_REMEDIATION } from '../modules/remediation';
import trialSuccess from './trial-success';
import challengeErrors from './challenge-errors';
import gems from './gems';
import tutorials from '../modules/tutorials';

function initialState() {
  return Immutable({
            template: null,
            userChangeableGenes: [],
            visibleGenes: [],
            hiddenAlleles: [],
            hiddenParent: null,
            trial: 0,
            routeSpec: null,
            challenges: 1,
            errors: 0,
            correct: 0,
            challengeErrors: 0,
            gems: [],
            authoring: window.GV2Authoring,
            endMissionUrl: urlParams.start,
            connectionState: "online"
          });
}

export default function reducer(state, action) {
  if (!state) state = initialState();

  state = state.merge({
    routing: routing(state.routing, action),
    moves: moves(state.moves, action),
    modalDialog: modalDialog(state.modalDialog, action),
    userDrakeHidden: userDrakeHidden(state.userDrakeHidden, action),
    hiddenParent: parentDrakeHidden(state.hiddenParent, action),
    gametes: gametes(state.gametes, action),
    drakes: drakes(state.drakes, state.gametes, action),
    baskets: baskets(state.baskets, action),
    notifications: notifications(state.notifications, action),
    remediation: remediation(state.remediation, action),
    remediationHistory: remediationHistory(state.remediationHistory, state.routeSpec, action),
    trialSuccess: trialSuccess(state.trialSuccess, action),
    tutorials: tutorials(state.tutorials, action)
  });

  // these reducers act on the state that has already been changed by the
  // above reducers
  state = state.merge({
    challengeErrors: challengeErrors(state.challengeErrors, state.moves, state.goalMoves, action)
  });
  state = state.merge({
    gems: gems(state.gems, state.challengeErrors, state.routeSpec, action)
  });

  switch(action.type) {
    case actionTypes.AUTHORING_CHANGED:
      return state.set('authoring', action.authoring);

    case actionTypes.EGG_REJECTED: {
      return state.merge({
        errors: state.errors + 1
      });
    }
    case actionTypes.EGG_ACCEPTED: {
      return state.merge({
        correct: state.correct + 1
      });
    }

    case actionTypes.ENTERED_CHALLENGE_FROM_ROOM: {
      return state.merge({
        showingRoom: false
      });
    }

    case actionTypes.ADVANCED_TRIAL: {
      if (state.trialSuccess){
        if (state.trial < state.numTrials - 1) {
          return loadNextTrial(state, action.authoring);
        }
      }
      return state;
    }
    case actionTypes.NAVIGATED_HOME: {
      state = state.merge({
        routeSpec: null
      });
      return loadHome(state, state.authoring, action.showMissionEndDialog);
    }
    case actionTypes.NAVIGATED: {
      //TODO: it would be nice to merge this with the "routing" reducer into a module which controls the state's routeSpec
      const { level, mission, challenge } = action;
      state = state.merge({
        routeSpec: {level, mission, challenge},
        trial: 0
      });
      return loadStateFromAuthoring(state, state.authoring);
    }
    case actionTypes.NAVIGATED_PAGE:
      window.location = action.url;
      return state;
    case STARTED_REMEDIATION:
      return loadStateFromRemediation(state, state.remediation, state.authoring);
    case actionTypes.DRAKE_SUBMITTED:
      if (action.selected) {
        state = state.merge({
          submitted: action.selected
        });
      }
      return state;
    case actionTypes.CONNECTION_STATE_CHANGED:
      return state.merge({
        connectionState: action.connectionState
      });
    default:
      return state;
  }
}
