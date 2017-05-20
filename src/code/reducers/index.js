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
import notifications from '../modules/notifications';

function initialState() {
  return Immutable({
            template: null,
            userChangeableGenes: [],
            visibleGenes: [],
            hiddenAlleles: [],
            trial: 0,
            routeSpec: null,
            challenges: 1,
            challengeProgress: {},
            errors: 0,
            correct: 0,
            authoring: window.GV2Authoring,
            endMissionUrl: urlParams.start
          });
}

function fertilize(state) {
  let chromosomes0 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[0].alleleString, state.drakes[0].sex).getGenotype().chromosomes,
      chromosomes1 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[1].alleleString, state.drakes[1].sex).getGenotype().chromosomes,
      alleleString = "",
      sex = 1,
      side, chromosome, name;
  for (name in chromosomes0) {
    side = motherCurrentGamete(state.gametes)[name];
    chromosome = chromosomes0[name][side];
    if (chromosome && chromosome.alleles) alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
  }
  for (name in chromosomes1) {
    side = fatherCurrentGamete(state.gametes)[name];
    if (side === "y") sex = 0;
    chromosome = chromosomes1[name][side];
    if (chromosome && chromosome.alleles && chromosome.alleles.length) alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
  }

  return state.setIn(["drakes", 2], {
    alleleString,
    sex
  });
}

function breedClutch(state, clutchSize) {
  let chromosomes0 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[0].alleleString, state.drakes[0].sex).getGenotype().chromosomes,
      chromosomes1 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[1].alleleString, state.drakes[1].sex).getGenotype().chromosomes,
      newState = state,
      sex, alleleString, name, sides, side, chromosome;

  for (let i = 0; i < clutchSize; i++) {
    sex = 1;
    alleleString = "";

    for (name in chromosomes0) {
      sides = Object.keys(chromosomes0[name]);
      side = sides[Math.trunc(2 * Math.random())];
      chromosome = chromosomes0[name][side];
      if (chromosome && chromosome.alleles) alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
    }
    for (name in chromosomes1) {
      sides = Object.keys(chromosomes1[name]);
      side = sides[Math.trunc(2 * Math.random())];
      if (side === "y") sex = 0;
      chromosome = chromosomes1[name][side];
      if (chromosome && chromosome.alleles && chromosome.alleles.length) alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
    }

    newState =  newState.setIn(["drakes", newState.drakes.length], {
                  alleleString,
                  sex
                 });
  }

  return newState;
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
    case actionTypes.FERTILIZED:
      return fertilize(state);

    case actionTypes.CLUTCH_BRED: 
      return breedClutch(state, action.clutchSize);

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
      //TODO: it would be nice to merge this with the "routing" reducer into a module which controls the state's routeSpec
      const { level, mission, challenge } = action;
      state = state.merge({
        routeSpec: {level, mission, challenge},
        trial: 0
      });
      return loadStateFromAuthoring(state, state.authoring, state.challengeProgress);
    }
    case actionTypes.NAVIGATED_PAGE:
      window.location = action.url;
      return state;

    default:
      return state;
  }
}
