import templates from '../../templates';

export function loadStateFromAuthoring(state, authoring, progress={}) {
  let trial = state.trial ? state.trial : 0;

  let challenges = authoring[state.case].length;
  let authoredChallenge = authoring[state.case][state.challenge],
      templateName = authoredChallenge.template,
      template = templates[templateName],
      challengeType = authoredChallenge.challengeType,
      showUserDrake = authoredChallenge.showUserDrake != null ? authoredChallenge.showUserDrake : false,
      trials = authoredChallenge.targetDrakes,
      authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge, trial),

      // turn authored alleles into completely-specified alleleStrings
      // (once we have nested arrays this will need to be tweaked)
      drakes = authoredDrakesArray.map(function(drakeDef) {
        if (!drakeDef) return null;
        let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
        return {
          alleleString: drake.getAlleleString(),
          sex: drake.sex
        };
      });

  let goalMoves = null;
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  }

  let gametes = [];
  if (template.initialGametesArray) {
    gametes = template.initialGametesArray();
  }

  return state.merge({
    template: templateName,
    challengeType,
    showUserDrake,
    drakes,
    gametes,
    trial,
    trials,
    challenges,
    moves: 0,
    goalMoves,
    userDrakeHidden: true,
    trialSuccess: false,
    challengeProgress: progress
  });
}

export function loadNextTrial(state, authoring, progress) {
  let trial = state.trial;
  if (state.trialSuccess){
    trial = (state.trial < state.trials.length) ? (trial+1) : 1;
  }

  //let challenges = authoring[state.case].length;
  let authoredChallenge = authoring[state.case][state.challenge],
      templateName = state.template,
      template = templates[templateName],
      authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge, trial),

      // turn authored alleles into completely-specified alleleStrings
      // (once we have nested arrays this will need to be tweaked)
      drakes = authoredDrakesArray.map(function(drakeDef) {
        if (!drakeDef) return null;
        let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
        return {
          alleleString: drake.getAlleleString(),
          sex: drake.sex
        };
      });

  let goalMoves = null;
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  }

  return state.merge({
    drakes: drakes,
    trial,
    moves: 0,
    goalMoves: goalMoves,
    userDrakeHidden: true,
    challengeProgress: progress
  });

}
