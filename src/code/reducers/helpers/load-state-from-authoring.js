import templates from '../../templates';
import GeneticsUtils from '../../utilities/genetics-utils';
import { range, shuffle, assign } from 'lodash';
import AuthoringUtils from '../../utilities/authoring-utils';
import ProgressUtils from '../../utilities/progress-utils';
import { notificationType } from '../../modules/notifications';
import { getRemediationChallengeProps } from '../../modules/remediation';

let randomSelection;

/**
 * Tolerant splitter into a list of strings.
 * @param list - null, "one, two" or ["one", "two"]
 * returns ["one", "two"]
 */
function split(list) {
  if (list && list.split) return list.split(",").map(item => item.trim());
  if (Array.isArray(list)) return list;
  return [];
}

function templateFromAuthoredChallenge(authoredChallenge) {
  const templateName = authoredChallenge.template,
        template = templateName && templates[templateName];
  return template;
}

function trialFromState(state) {
  return state.trial || 0;
}

function processAuthoredBaskets(authoredChallenge, state) {
  const baskets = authoredChallenge && authoredChallenge.baskets;
  return baskets || state.baskets;
}

function processAuthoredGametes(authoredChallenge, drakes, state) {
  const template = templateFromAuthoredChallenge(authoredChallenge),
        trial = trialFromState(state),
        parentPools = template.authoredGametesToGametePools &&
                        template.authoredGametesToGametePools(authoredChallenge, drakes, trial);
  return parentPools
            ? state.gametes.merge({ parentPools })
            : state.gametes;
}

function numberOfMoves(testDrake, targetAlleles, targetSex) {
  const testSex = testDrake.sex,
        testAlleles = testDrake.getAlleleString(),
        targetDrake = new BioLogica.Organism(BioLogica.Species.Drake, targetAlleles, targetSex);
  let secondXAlleles = null;
  if ((testSex === BioLogica.MALE) && (targetSex === BioLogica.FEMALE)) {
    const testFemale = new BioLogica.Organism(BioLogica.Species.Drake, testAlleles, BioLogica.FEMALE);
    secondXAlleles = GeneticsUtils.computeExtraAlleles(testFemale, testDrake);
  }
  return BioLogica.Phenotype.numberOfChangesToReachPhenotype(
                              testDrake, targetDrake, BioLogica.Species.Drake, secondXAlleles);
}

function randomizeAllelesForOneGene(alleles, gene) {
  const allelesOfGene = BioLogica.Species.Drake.geneList[gene].alleles,
        randomAllele = () => {
          return allelesOfGene[Math.floor(Math.random() * allelesOfGene.length)];
        },
        regex = new RegExp(`(a|b):(${allelesOfGene.join('|')})(,|$)`, 'g');
  return alleles.replace(regex, `$1:${randomAllele()}$3`);
}

function processAuthoredDrakes(authoredChallenge, authoredTrialNumber, template, trialNumber) {
  // takes authored list of named drakes ("mother", etc) and returns an
  // array specific for this template
  const authoredDrakesArray = template.authoredDrakesToDrakeArray(authoredChallenge, authoredTrialNumber, trialNumber);
  let   alleleString = null,
        linkedGeneDrake = null;

  // instead of a drake, we have an array of drakes, and we are expected to randomly select one and keep
  // that same index across all the named drakes
  if (authoredDrakesArray && authoredDrakesArray[0] && authoredDrakesArray[0].randomMatched) {
    randomSelection = Math.floor(Math.random() * authoredDrakesArray[0].randomMatched.length);
  }

  // turn authored alleles into completely-specified alleleStrings
  // we do it with a for-loop instead of a map so we can unroll nested arrays
  let drakes = [];
  for (let i = 0; i < authoredDrakesArray.length; i++) {
    let drakeDef = authoredDrakesArray[i];
    if (!drakeDef) {
      drakes.push(null);
      continue;
    }
    if (drakeDef.randomMatched) {
      drakeDef = drakeDef.randomMatched[randomSelection];
    }
    if (Array.isArray(drakeDef)) {
      // unroll in place
      authoredDrakesArray.splice(i, 1, ...drakeDef);
      drakeDef = drakeDef[0];
    }
    // Keep the drake as female until the end, so no sex-linked information is lost for linked drakes
    let femaleDrake = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleles, BioLogica.FEMALE);
    const actualDrakeSex = drakeDef.sex != null
                            ? drakeDef.sex
                            : Math.round(Math.random());

    /*
     * Synchronize the linkedGenes
     */
    alleleString = femaleDrake.getAlleleString();
    const { linkedGenes } = authoredChallenge;
    if (linkedGenes) {
      let linkedGenesDef = linkedGenes;
      if (Array.isArray(linkedGenes)) {
        linkedGenesDef = linkedGenes[authoredTrialNumber];
      }
      if (i === linkedGenesDef.drakes[0]) {
        // the source of the linkedGenes should have all alleles, including sex-linked ones
        linkedGeneDrake = femaleDrake;
      } else if (linkedGenesDef.drakes.indexOf(i)) {
        let genes = split(linkedGenesDef.genes);
        for (let gene of genes) {
          let copyIntoGenes = femaleDrake.genetics.genotype.getAlleleString([gene], femaleDrake.genetics);
          let masterGenes = linkedGeneDrake.genetics.genotype.getAlleleString([gene], femaleDrake.genetics);
          alleleString = alleleString.replace(copyIntoGenes, masterGenes);
        }
      }

      /*
       * Guarantee minimum number of moves
       */
      const { linkedGenes: { minChanges }, userChangeableGenes } = authoredChallenge;
      if ((i > 0) && minChanges && userChangeableGenes) {
        const userGenes = split(userChangeableGenes);
        while (numberOfMoves(linkedGeneDrake, alleleString, actualDrakeSex) < minChanges) {
          // randomize the alleles of one gene at a time until the criterion is met
          const randomGene = userGenes[Math.floor(Math.random() * userGenes.length)];
          alleleString = randomizeAllelesForOneGene(alleleString, randomGene);
        }
      }
    }
    const actualDrake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, actualDrakeSex);

    let secondXAlleles = null;
    if (actualDrake.sex === BioLogica.MALE) {
      // Store any sex-linked alleles from the authoring document which would be lost because the drake is male
      let fixedFemaleDrake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, BioLogica.FEMALE);
      secondXAlleles = GeneticsUtils.computeExtraAlleles(fixedFemaleDrake, actualDrake);
    }

    drakes.push(assign({}, secondXAlleles ? {secondXAlleles: secondXAlleles} : null, {
      alleleString: actualDrake.getAlleleString(),
      sex: actualDrake.sex,
    }));

  }
  return drakes;
}

function getNumTargets(authoredChallenge, authoredTrialNumber, template) {
  return template.getNumTargets ? template.getNumTargets(authoredChallenge, authoredTrialNumber) : 1;
}

function getHiddenParent(authoredChallenge, authoredTrialNumber, template) {
  return template.getHiddenParent ? template.getHiddenParent(authoredChallenge, authoredTrialNumber) : undefined;

}

// Returns an array [0...len], optionally shuffled
function createTrialOrder(trial, trials, currentTrialOrder, doShuffle) {
  if (trial > 0)
    return currentTrialOrder;
  if (!trials)
    return [0];
  if (doShuffle)
    return shuffle( range(trials.length) );
  return range(trials.length);
}

export function loadStateFromAuthoring(state, authoring) {
  let trial = state.trial ? state.trial : 0;
  randomSelection = null;

  const challenges = AuthoringUtils.getChallengeCount(authoring, state.routeSpec.level, state.routeSpec.mission),
        authoredChallenge = AuthoringUtils.getChallengeDefinition(authoring, state.routeSpec),
        authoredChallengeMetadata = AuthoringUtils.getChallengeMeta(authoring, state.routeSpec);
  if (!authoredChallenge) return state;

  const templateName = authoredChallenge.template,
        template = templateName && templates[templateName];
  if (!template) return state;

  let userChangeableGenes = authoredChallenge.userChangeableGenes;
  // Changeable genes are either authored in the form "wings, legs" or [{mother: "wings", father:""}, {mother: "", father: "wings"}]
  if (typeof userChangeableGenes === "object") {
    let userChangeableGenesByTrial = [];
    for (let trial = 0; trial < userChangeableGenes.length; trial++) {
      userChangeableGenesByTrial.push({
        mother: split(userChangeableGenes[trial].mother),
        father: split(userChangeableGenes[trial].father)
      });
    }
    userChangeableGenes = userChangeableGenesByTrial;
  } else {
    userChangeableGenes = split(userChangeableGenes);
  }

  const challengeType = authoredChallenge.challengeType,
        interactionType = authoredChallenge.interactionType,
        instructions = authoredChallenge.instructions,
        visibleGenes = split(authoredChallenge.visibleGenes),
        hiddenAlleles = split(authoredChallenge.hiddenAlleles),
        baskets = processAuthoredBaskets(authoredChallenge, state),
        showUserDrake = (authoredChallenge.showUserDrake != null) ? authoredChallenge.showUserDrake : false,
        trials = authoredChallenge.targetDrakes,
        numTrials = authoredChallenge.numTrials || (trials ? trials.length : 1),
        trialOrder = createTrialOrder(trial, trials, state.trialOrder, authoredChallenge.randomizeTrials),
        drakes = processAuthoredDrakes(authoredChallenge, trialOrder[trial], template, trial),
        gametes = processAuthoredGametes(authoredChallenge, drakes, state),
        numTargets = getNumTargets(authoredChallenge, trialOrder[trial], template),
        hiddenParent = getHiddenParent(authoredChallenge, trialOrder[trial], template),
        zoomUrl = authoredChallenge.zoomUrl,
        zoomScoringMetrics = authoredChallenge.scoreMetrics,
        room = authoredChallengeMetadata.room || "simroom",
        roomInfo = (authoring && authoring.rooms) ? authoring.rooms[room] : {},
        location = {id: room, ...roomInfo},
        showingRoom = trial === 0,
        dialog = authoredChallengeMetadata.dialog && authoredChallengeMetadata.dialog.start,
        showIntroductionAnimations = authoredChallenge.showIntroductionAnimations,
        showDrakeColorHint = authoredChallenge.showDrakeColorHint;

  let goalMoves = null;
  if (template.calculateGoalMoves) {
    goalMoves = template.calculateGoalMoves(drakes);
  } else if (authoredChallenge.goalMoves) {
    if (Array.isArray(authoredChallenge.goalMoves[trial]) && randomSelection !== null) {
      goalMoves = authoredChallenge.goalMoves[trial][randomSelection];
    } else {
      goalMoves = authoredChallenge.goalMoves[trial];
    }
  } else {
    goalMoves = -1;
  }

  let messages = [],
      closeButton = null;
  if (showingRoom && dialog) {
    messages = dialog.map( (d) => ({type: notificationType.NARRATIVE, ...d}));
    closeButton = {action: "enterChallengeFromRoom"};
  }

  let authoredState = {
    template: templateName,
    challengeType,
    interactionType,
    instructions,
    showUserDrake,
    userChangeableGenes,
    visibleGenes,
    hiddenAlleles,
    baskets,
    gametes,
    drakes,
    numTargets,
    hiddenParent,
    trial,
    trials,
    numTrials,
    trialOrder,
    challenges,
    correct: 0,
    errors: 0,
    moves: 0,
    goalMoves,
    userDrakeHidden: true,
    trialSuccess: false,
    isRemediation: false,
    initialDrakes: [...drakes],
    zoomUrl,
    zoomScoringMetrics,
    location,
    showingRoom,
    notifications: {
      messages,
      closeButton
    },
    showIntroductionAnimations,
    showDrakeColorHint
  };
  // remove all undefined or null keys
  Object.keys(authoredState).forEach((key) => (authoredState[key] == null) && delete authoredState[key]);
  return state.merge(authoredState);
}

export function loadStateFromRemediation(state, remediation, authoring) {
  // get authoring props specific to challengeType
  const {challengeType, attribute, practiceCriteria} = remediation;
  const remediationChallengeProps = getRemediationChallengeProps(challengeType, attribute, practiceCriteria, state);

  if (!remediationChallengeProps) {
    // bail
    return loadStateFromAuthoring(state, state.authoring);
  }

  const template = templates[remediationChallengeProps.templateName];
  const drakes = processAuthoredDrakes(remediationChallengeProps.authoring, 0, template, 0);
  const baskets = processAuthoredBaskets(remediationChallengeProps.authoring, state);

  const roomInfo = (authoring && authoring.rooms) ? authoring.rooms[remediationChallengeProps.stateProps.room] : {};
  const location = {id: remediationChallengeProps.stateProps.room, ...roomInfo, name: "Bonus Challenge"};

  let remediationState = {
    template: remediationChallengeProps.templateName,
    drakes,
    baskets,
    location,
    ...remediationChallengeProps.stateProps
  };

  // remove all undefined or null keys
  Object.keys(remediationState).forEach((key) => (remediationState[key] == null) && delete remediationState[key]);
  return state.merge(remediationState);
}

export function loadHome(state, authoring, showMissionEndDialog) {
  let room = "home",
      roomInfo = (authoring && authoring.rooms) ? authoring.rooms[room] : {},
      location = {id: room, ...roomInfo},
      { level, mission } = ProgressUtils.getCurrentChallengeFromGems(authoring, state.gems),
      missionStarted = ProgressUtils.isMissionStarted(state.gems, level, mission),
      dialogDefs = authoring.application.levels[level].missions[mission].dialog,
      messages = [];

  if (dialogDefs) {
    let whichDialog = missionStarted ? "middle" : "start",
        dialog = dialogDefs[whichDialog];

    if (!missionStarted && showMissionEndDialog) {
      let previousMission = AuthoringUtils.getPreviousMission(authoring, level, mission);
      if (previousMission) {
        let endDialog = authoring.application.levels[previousMission.level].missions[previousMission.mission].dialog["end"] || [];
        dialog = endDialog.concat(dialog);
      }
    }

    messages = dialog.map( (d) => ({type: notificationType.NARRATIVE, ...d}));
  }

  let authoredState = {
    location,
    showingRoom: true,
    notifications: {
      messages,
      closeButton: false
    }
  };

  // remove all undefined or null keys
  Object.keys(authoredState).forEach((key) => (authoredState[key] == null) && delete authoredState[key]);

  return state.merge(authoredState);
}

export function loadNextTrial(state, authoring) {
  let trial = state.trial;
  if (state.trialSuccess){
    trial = (state.trial < state.numTrials) ? (trial+1) : 0;
  }
  let nextState = state.merge({
    trial: trial
  });

  return  loadStateFromAuthoring(nextState, authoring);
}
