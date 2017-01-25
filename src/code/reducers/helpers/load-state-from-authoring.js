import templates from '../../templates';

function extractHiddenAlleles(state, authoredChallenge) {
  const authoredHiddenAlleles = authoredChallenge.hiddenAlleles;
  return authoredHiddenAlleles
            ? authoredHiddenAlleles.split(',')
            : state.hiddenAlleles;
}

function processAuthoredBaskets(authoredChallenge, state) {
  const baskets = authoredChallenge && authoredChallenge.baskets;
  return baskets || state.baskets;
}

function processAuthoredDrakes(authoredChallenge, trial, template) {
  // takes authored list of named drakes ("mother", etc) and returns an
  // array specific for this template
  const authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge, trial);

  // turn authored alleles into completely-specified alleleStrings
  let drakes = authoredDrakesArray.map(function(drakeDef) {
    if (!drakeDef) return null;
    let drake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, drakeDef.sex);
    return {
      alleleString: drake.getAlleleString(),
      sex: drake.sex
    };
  });
  return drakes;
}

export function loadStateFromAuthoring(state, authoring, progress={}) {
  let trial = state.trial ? state.trial : 0;

  const challengeArray = authoring[state.case],
        challenges = challengeArray && challengeArray.length,
        authoredChallenge = challengeArray && challengeArray[state.challenge];
  if (!authoredChallenge) return state;

  const templateName = authoredChallenge.template,
        template = templateName && templates[templateName];
  if (!template) return state;

  const challengeType = authoredChallenge.challengeType,
        interactionType = authoredChallenge.interactionType,
        instructions = authoredChallenge.instructions,
        hiddenAlleles = extractHiddenAlleles(state, authoredChallenge),
        baskets = processAuthoredBaskets(authoredChallenge, state),
        showUserDrake = (authoredChallenge.showUserDrake != null) ? authoredChallenge.showUserDrake : false,
        trials = authoredChallenge.targetDrakes,
        drakes = processAuthoredDrakes(authoredChallenge, trial, template);

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
    interactionType,
    instructions,
    showUserDrake,
    hiddenAlleles,
    baskets,
    drakes,
    gametes,
    trial,
    trials,
    challenges,
    correct: 0,
    errors: 0,
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
      hiddenAlleles = extractHiddenAlleles(state, authoredChallenge),
      baskets = authoredChallenge.baskets || state.baskets,
      drakes = processAuthoredDrakes(authoredChallenge, trial, template);

  let goalMoves = null;
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  }

  return state.merge({
    hiddenAlleles,
    baskets,
    drakes,
    trial,
    correct: 0,
    errors: 0,
    moves: 0,
    goalMoves,
    userDrakeHidden: true,
    challengeProgress: progress
  });

}
