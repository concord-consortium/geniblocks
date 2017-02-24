import Immutable from 'seamless-immutable';
import actionTypes from '../action-types';
import { loadStateFromAuthoring, loadNextTrial } from './helpers/load-state-from-authoring';
import { updateProgress, setProgressScore } from './helpers/challenge-progress';
import urlParams from '../utilities/url-params';

// reducers
import routing from './routing';
import moves from './moves';
import modalDialog from './modal-dialog';
import userDrakeHidden from './user-drake-hidden';
import gametes, { motherCurrentGamete, fatherCurrentGamete } from '../modules/gametes';
import drakes from './drakes';
import baskets from './baskets';
import notifications from './notifications';

function initialState() {
  return Immutable({
            template: null,
            userChangeableGenes: [],
            visibleGenes: [],
            hiddenAlleles: [],
            trial: 0,
            level: 0,
            case: 0,
            challenge: 0,
            challenges: 1,
            challengeProgress: {},
            errors: 0,
            correct: 0,
            authoring: window.GV2Authoring,
            endCaseUrl: urlParams.start
          });
}

export default function reducer(state, action) {
  if (!state) state = initialState();

  state = state.merge({
    routing: routing(state.routing, action),
    moves: moves(state.moves, action),
    modalDialog: modalDialog(state.modalDialog, action),
    userDrakeHidden: userDrakeHidden(state.userDrakeHidden, action),
    gametes: gametes(state.gametes, action),
    drakes: drakes(state.drakes, action),
    baskets: baskets(state.baskets, action),
    notifications: notifications(state.notifications, action)
  });

  switch(action.type) {
    case actionTypes.AUTHORING_CHANGED:
      return state.set('authoring', action.authoring);
    case actionTypes.CHALLENGE_COMPLETE:{
      let progress = setProgressScore(state, action.score);

      return state.merge({
        challengeProgress: progress
      });
    }
    case actionTypes.FERTILIZED: {
      let chromosomes0 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[0].alleleString, state.drakes[0].sex).getGenotype().chromosomes,
          chromosomes1 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[1].alleleString, state.drakes[1].sex).getGenotype().chromosomes,
          alleleString = "",
          sex = 1;
      for (let name in chromosomes0) {
        let side = motherCurrentGamete(state.gametes)[name];
        let chromosome = chromosomes0[name][side];
        if (chromosome && chromosome.alleles) alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
      }
      for (let name in chromosomes1) {
        let side = fatherCurrentGamete(state.gametes)[name];
        if (side === "y") sex = 0;
        let chromosome = chromosomes1[name][side];
        if (chromosome && chromosome.alleles && chromosome.alleles.length) alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
      }

      return state.setIn(["drakes", 2], {
        alleleString,
        sex
      });
    }

    case actionTypes.OFFSPRING_KEPT: {
      let progress = updateProgress(state, action.success);

      return state.merge({
        trialSuccess: action.correct,
        challengeProgress: progress
      });
    }
    case actionTypes.DRAKE_SUBMITTED: {
      let progress = updateProgress(state, action.correct);

      return state.merge({
        trialSuccess: action.correct,
        challengeProgress: progress
      });
    }
    case actionTypes.EGG_SUBMITTED: {
      let progress = updateProgress(state, action.correct);

      return state.merge({
        success: action.correct,
        challengeProgress: progress
      });
    }
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
    case actionTypes.ADVANCED_TRIAL: {
      if (state.trialSuccess){
        let progress = updateProgress(state, true);
        if (state.trial < state.trials.length - 1) {
          return loadNextTrial(state, action.authoring, progress);
        }
        else {
          return state.merge ({ challengeProgress: progress});
        }
      } else return state;
    }
    case actionTypes.NAVIGATED: {
      state = state.merge({
        level: action.level,
        case: action.case,
        challenge: action.challenge,
        trial: 0
      });
      return loadStateFromAuthoring(state, state.authoring, state.challengeProgress);
    }
    case actionTypes.NAVIGATED_PAGE:
      window.location = action.url;
      return state;
    case actionTypes.ADVANCED_CHALLENGE: {
      let nextChallenge = state.challenge + 1;
      let progress = updateProgress(state, true);
      return loadStateFromAuthoring(state, action.authoring, nextChallenge, progress);
    }

    default:
      return state;
  }
}
