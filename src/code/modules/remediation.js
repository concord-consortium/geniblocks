export const GUIDE_REMEDIATION_REQUESTED = "Guide remediation requested";
export const STARTED_REMEDIATION = "Started remediation";
export const ENDED_REMEDIATION = "Ended remediation";

import { showNotification } from '../actions';
import actionTypes from '../action-types';
import GeneticsUtils from '../utilities/genetics-utils';

/**
 *  reducers
 */

 // *** remediation reducer ***
const initialRemediationState = false;

export function remediation(state = initialRemediationState, action) {
  switch (action.type) {
    case GUIDE_REMEDIATION_REQUESTED:
      if (action.attribute && action.challengeType) {
        return {
          attribute: action.attribute,
          practiceCriteria: action.practiceCriteria,
          challengeType: action.challengeType
        };
      }
      else
        return initialRemediationState;
    case ENDED_REMEDIATION:
    case actionTypes.NAVIGATED:
      return initialRemediationState;
    // otherwise keep the remediation challenge
    default:
      return state;
  }
}

//  *** remediationHistory reducer ***
const initialHistoryState = [];

export function remediationHistory(state = initialHistoryState, routeSpec, action) {
  switch(action.type) {
    case STARTED_REMEDIATION: {
        if (!routeSpec) return state;

        let { level: currLevel, mission: currMission, challenge: currChallenge } = routeSpec;

        // ensure all challenges leading up to this are a real value or 0
        for (let level = 0; level <= currLevel; level++) {
          if (!state[level]) {
            state = state.setIn([level], []);
          }
        }
        for (let mission = 0; mission <= currMission; mission++) {
          if (!state[currLevel][mission]) {
            state = state.setIn([currLevel, mission], []);
          }
        }
        for (let challenge = 0; challenge <= currChallenge; challenge++) {
          if (!(state[currLevel][currMission][challenge])) {
            state = state.setIn([currLevel, currMission, challenge], 0);
          }
        }

        let previous = state[currLevel][currMission][currChallenge];

        state = state.setIn([currLevel, currMission, currChallenge], previous + 1);

        return state;
      }
    case actionTypes.LOAD_SAVED_STATE: {
      if (action.state && action.state.remediationHistory) {
        return action.state.remediationHistory;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}


/**
 * action creators
 */

export function requestRemediation(data) {
  return (dispatch, getState) => {
    if (getState().isRemediation) {
      return;
    }

    dispatch({
      type: GUIDE_REMEDIATION_REQUESTED,
      attribute: data.context.attribute,
      practiceCriteria: data.context.practiceCriteria,
      challengeType: data.context.challengeType
    });

    dispatch({
      type: actionTypes.MODAL_DIALOG_SHOWN,
      mouseShieldOnly: true
    });

    let dialog = {
      message: "~ALERT.START_REMEDIATION",
      closeButton: {
        action: "startRemediation"
      },
      arrowAsCloseButton: true,
      isInterrupt: true
    };
    dispatch(showNotification(dialog));
  };
}

export function startRemediation() {
  return {
    type: STARTED_REMEDIATION
  };
}

export function endRemediation() {
  return {
    type: ENDED_REMEDIATION
  };
}

/**
 * challenge-specific remediation authoring
 */

function getMatchDrakeRemediation(trait, practiceCriteria) {
  const templateName = "FVGenomeChallenge";

  let baseAlleles = "a:W,b:W,a:M,b:M,a:T,b:T,a:H,b:H,a:Hl,b:Hl,a:Fl,b:Fl,a:A1,b:A1,a:C,b:C,a:Bog,b:Bog";
  baseAlleles = baseAlleles.replace(GeneticsUtils.getAllelesForTrait(trait, "dominant"), "");
  let userAlleles = "", targetAlleles = "";
  let userBlackAlleles = "a:b,b:b";
  let userDiluteAlleles = "a:d,b:d";
  let targetBlackAlleles = userBlackAlleles;
  let targetDiluteAlleles = userDiluteAlleles;
  let userNoseAlleles = "a:rh,b:rh";
  let targetNoseAlleles = userNoseAlleles;
  let hiddenAlleles = ['Tk', 'A2'];
  switch(trait) {
    case 'tail':
      userAlleles = "a:T,b:t";
      targetAlleles = "a:Tk,b:t";
      hiddenAlleles = ['A2'];
      break;
    case 'black':
      userDiluteAlleles = targetDiluteAlleles = "a:D,b:D";
      if (practiceCriteria === "SimpleDominant") {
        targetBlackAlleles = "a:B,b:B";
      }
      else {
        userBlackAlleles = "a:B,b:B";
      }
      break;
    case 'dilute':
      // for X-linked traits, randomize homozygous dominant <=> homozygous recessive
      if (Math.round(Math.random())) {
        userDiluteAlleles = "a:D,b:D";
      } else {
        targetDiluteAlleles = "a:D,b:D";
      }
      break;
    case 'nose':
      // for X-linked traits, randomize homozygous dominant <=> homozygous recessive
      if (Math.round(Math.random())) {
        userNoseAlleles = "a:Rh,b:Rh";
      } else {
        targetNoseAlleles = "a:Rh,b:Rh";
      }
      break;
    default:
      if (practiceCriteria === "SimpleDominant") {
        userAlleles   = GeneticsUtils.getAllelesForTrait(trait, "recessive");
        targetAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      } else {
        userAlleles   = GeneticsUtils.getAllelesForTrait(trait, "dominant");
        targetAlleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      }
  }

  let userSex, targetSex;
  switch(trait) {
    case 'sex':
      userSex = Math.round(Math.random());
      targetSex = 1 - userSex;
      break;
    case 'dilute':
    case 'nose':
      userSex = 1;
      targetSex = 0;
      break;
    default:
      userSex = targetSex = Math.round(Math.random());
  }

  // Allele overwriting seems not to work correctly for X-linked alleles,
  // so we have to be careful not to duplicate alleles.
  const allUserAlleles = `${userAlleles ? userAlleles + "," : ""}${userBlackAlleles},${userDiluteAlleles},${userNoseAlleles}`;
  const allTargetAlleles = `${targetAlleles ? targetAlleles + "," : ""}${targetBlackAlleles},${targetDiluteAlleles},${targetNoseAlleles}`;
  const authoring = {
    "challengeType" : "match-target",
    "initialDrake" : [ {
      "alleles" : `${allUserAlleles},${baseAlleles}`, // earlier alleles overwrite later ones
      "sex" : userSex
    } ],
    "targetDrakes" : [ {
      "alleles" : `${allTargetAlleles},${baseAlleles}`,
      "sex" : targetSex
    } ]
  };

  return {
    authoring,
    templateName,
    stateProps: {
      userChangeableGenes: [trait],
      showUserDrake: true,
      visibleGenes: [],
      hiddenAlleles: hiddenAlleles,
      numTargets: 1,
      numTrials: 1,
      trial: 0,
      goalMoves: -1,
      room: "simroom"
    }
  };
}

function getEggSortRemediation(trait, /* practiceCriteria */) {
  const templateName = "FVEggSortGame";

  let dominantLabel, recessiveLabel;
  const domAllele = trait !== "sex" ? GeneticsUtils.dominant(trait) : "";
  const recAllele = trait !== "sex" ? GeneticsUtils.recessive(trait) : "";

  switch (trait) {
    case "horns":
      dominantLabel = "Drakes without horns";
      recessiveLabel = "Drakes with horns";
      break;
    case "black":
      dominantLabel = "Drakes with gray color";
      recessiveLabel = "Drakes with orange color";
      break;
    case "dilute":
      dominantLabel = "Drakes with deep color";
      recessiveLabel = "Drakes with faded color";
      break;
    case "nose":
      dominantLabel = "Drakes with a nose spike";
      recessiveLabel = "Drakes without a nose spike";
      break;
    default:
      dominantLabel = `Drakes with ${GeneticsUtils.commonName(trait)}`;
      recessiveLabel = `Drakes without ${GeneticsUtils.commonName(trait)}`;
  }

  let baskets;
  switch(trait) {
    case 'sex':
      baskets = [{
        "alleles" : [ "" ],
        "label" : "Males",
        "sex" : 0
      }, {
        "alleles" : [ "" ],
        "label" : "Females",
        "sex" : 1
      }];
      break;
    case 'dilute':
    case 'nose':
      // Basket-matching doesn't handle sex-linked traits for ungendered baskets properly,
      // so we cheat by always keying on the first allele and making sure that the first
      // allele is always determinative for the drakes used in remediation.
      baskets = [{
        "alleles": [`a:${domAllele}`],
        "label": dominantLabel
      }, {
        "alleles": [`a:${recAllele}`],
        "label": recessiveLabel
      }];
      break;
    case 'tail':
      baskets = [{
        "alleles": ["a:T", "b:T"],
        "label": "Drakes with a long tail"
      }, {
        "alleles": ["a:Tk,b:Tk", "a:Tk,b:t", "a:t,b:Tk"],
        "label": "Drakes with a kinked tail"
      }, {
        "alleles": ["a:t,b:t"],
        "label": "Drakes with a short tail"
      }];
      break;
    default:
      baskets = [{
        "alleles" : [ `a:${GeneticsUtils.dominant(trait)}`, `b:${GeneticsUtils.dominant(trait)}` ],
        "label" : dominantLabel
      }, {
        "alleles" : [ GeneticsUtils.getAllelesForTrait(trait, "recessive") ],
        "label" : recessiveLabel
      }];
  }

  let baseAlleles = "a:W,b:W,a:M,b:M,a:T,b:T,a:H,b:H,a:Hl,b:Hl,a:Fl,b:Fl,a:A1,b:A1,a:C,b:C,a:b,b:b,a:d,b:d,a:rh,b:rh,a:Bog,b:Bog";
  baseAlleles = baseAlleles.replace(GeneticsUtils.getAllelesForTrait(trait, "dominant"), "");

  let trialGenerator = {
    baseDrake: baseAlleles,
    type: "randomize-order"
  };
  switch(trait) {
    case 'sex':
      trialGenerator.drakes = [
        {
          "alleles" : "",
          "sex" : 0
        },
        {
          "alleles" : "",
          "sex" : 0
        },
        {
          "alleles" : "",
          "sex" : 1
        },
        {
          "alleles" : "",
          "sex" : 1
        }
      ];
      break;
    case 'tail':
      trialGenerator.drakes = [
        {
          "alleles" : "a:T,b:t",
          "sex" : 0
        },
        {
          "alleles" : "a:t,b:Tk",
          "sex" : 0
        },
        {
          "alleles" : "a:Tk,b:T",
          "sex" : 1
        },
        {
          "alleles" : "a:t,b:t",
          "sex" : 1
        }
      ];
      break;
    case 'dilute':
    case 'nose':
      trialGenerator.drakes = [
        {
          "alleles" : `a:${domAllele}`,
          "sex" : 0
        },
        {
          "alleles" : `a:${recAllele}`,
          "sex" : 0
        },
        {
          "alleles" : `a:${domAllele},b:${recAllele}`,
          "sex" : 1
        },
        {
          "alleles" : `a:${recAllele},b:${recAllele}`,
          "sex" : 1
        }
      ];
      break;
    default:
      trialGenerator.drakes = [
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "dominant"),
          "sex" : 1
        },
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "recessive"),
          "sex" : 1
        },
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "heterozygous"),
          "sex" : 1
        },
        {
          "alleles" : GeneticsUtils.getAllelesForTrait(trait, "heterozygous"),
          "sex" : 1
        }
      ];
  }

  const authoring = {
    baskets,
    trialGenerator
  };

  return {
    authoring,
    templateName,
    stateProps: {
      visibleGenes: [trait],
      numTrials: 1,
      trial: 0,
      goalMoves: -1,
      room: "hatchery"
    }
  };
}

function getBreedingRemediation(trait, challengeType, practiceCriteria, previousState) {
  const templateName = "ClutchGame";

  const isSiblings = challengeType === "Siblings";
  let singleParent = true;
  if (!isSiblings && previousState.userChangeableGenes &&
      previousState.userChangeableGenes[0] &&
      previousState.userChangeableGenes[0].mother &&
      previousState.userChangeableGenes[0].mother.length > 0 &&
      previousState.userChangeableGenes[0].father.length > 0) {
    singleParent = false;
  }

  let baseAlleles = "a:W,b:W,a:M,b:M,a:T,b:T,a:H,b:H,a:Hl,b:Hl,a:Fl,b:Fl,a:A1,b:A1,a:C,b:C,a:Bog,b:Bog,a:Rh,b:Rh";
  baseAlleles += trait === "black" ? ",a:B,b:B,a:D,b:D" : ",a:b,b:b,a:d,b:d";
  baseAlleles = baseAlleles.replace(GeneticsUtils.getAllelesForTrait(trait, "dominant") + ",", "");

  let motherAlleles, fatherAlleles, child1Alleles, child2Alleles;
  if (!isSiblings) {
    if (trait === "armor" && practiceCriteria === "Incomplete Dominance") {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      child1Alleles = GeneticsUtils.getAllelesForTrait(trait, singleParent ? "heterozygous" : "dominant");
    } else if (practiceCriteria === "X Linked") {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      child1Alleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
    } else if (trait === "tail") {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, singleParent ? "dominant" : "recessive");
      child1Alleles = "a:Tk,b:t";
    } else {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, singleParent ? "heterozygous" : "dominant");
      child1Alleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
    }
  } else {
    if (trait === "armor" && practiceCriteria === "Incomplete Dominance") {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      child1Alleles = GeneticsUtils.getAllelesForTrait(trait, "heterozygous");
      child2Alleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
    } else if (practiceCriteria === "X Linked") {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      child1Alleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      child2Alleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
    } else if (trait === "tail") {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      fatherAlleles = GeneticsUtils.getAllelesForTrait(trait, "heterozygous");
      child1Alleles = "a:Tk,b:t";
      child2Alleles = "a:t,b:t";
    } else {
      motherAlleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
      fatherAlleles = motherAlleles;
      child1Alleles = GeneticsUtils.getAllelesForTrait(trait, "dominant");
      child2Alleles = GeneticsUtils.getAllelesForTrait(trait, "recessive");
    }
  }

  let hiddenAlleles = ['A2'];

  const targetDrakes = [[{
    "alleles" : `${child1Alleles},${baseAlleles}`,
    "sex" : practiceCriteria === "X Linked" ? 0 : Math.round(Math.random())
  }]];
  if (isSiblings) {
    const sex = targetDrakes[0][0].sex === 0 ? 1 : 0;
    targetDrakes[0].push({
      "alleles" : `${child2Alleles},${baseAlleles}`,
      "sex" : sex
    });
  }

  const authoringChallengeType = isSiblings ? "submit-parents" : "match-target";

  const authoring = {
    "challengeType" : authoringChallengeType,
    "father" : [ {
      "alleles" : `${fatherAlleles},${baseAlleles}`,
      "sex" : 0
    } ],
    "mother" : [ {
      "alleles" : `${motherAlleles},${baseAlleles}`,
      "sex" : 1
    } ],
    "targetDrakes" : targetDrakes
  };

  return {
    authoring,
    templateName,
    stateProps: {
      // userChangeableGenes: [trait],
      userChangeableGenes: [ {
        "father" : singleParent ? [] : [trait],
        "mother" : [trait]
      } ],
      visibleGenes: [trait],
      hiddenAlleles: hiddenAlleles,
      numTargets: isSiblings ? 2 : 1,
      numTrials: 1,
      trial: 0,
      goalMoves: -1,
      room: "breedingbarn",
      challengeType: authoringChallengeType
    }
  };
}

export function getRemediationChallengeProps(challengeType, trait, practiceCriteria, previousState) {
  let challengeProps;
  if (challengeType === "Sim") {
    challengeProps = getMatchDrakeRemediation(trait, practiceCriteria);
  } else if (challengeType === "Hatchery") {
    challengeProps = getEggSortRemediation(trait, practiceCriteria);
  } else if (challengeType === "Breeding" || challengeType === "Siblings") {
    challengeProps = getBreedingRemediation(trait, challengeType, practiceCriteria, previousState);
  }

  if (!challengeProps) {
    return;
  }

  // state props common to all remediation challenges
  const commonStateProps = {
    isRemediation: true,
    correct: 0,
    errors: 0,
    moves: 0,
    userDrakeHidden: true,
    trialSuccess: false,
    showingRoom: false,
    notifications: {
      messages: [{
        text: ["~REMEDIATION.START_SIM", GeneticsUtils.commonName(trait)]
      }],
      closeButton: true
    }
  };

  // merge the state properties that are challenge-specific and common together
  challengeProps.stateProps = {
    ...challengeProps.stateProps,
    ...commonStateProps
  };

  return challengeProps;
 }