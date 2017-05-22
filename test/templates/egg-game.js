import EggGame from '../../src/code/templates/egg-game';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
import reducer from '../../src/code/reducers/';
import { navigateToChallenge } from '../../src/code/actions';
import expect from 'expect';

const basicUnderdefinedInitialState = (template, routeSpec, challenges) => ({
  template,
  routeSpec,
  challenges,
  challengeType: undefined,
  interactionType: undefined,
  goalMoves: null,
  instructions: undefined,
  showUserDrake: false,
  trialSuccess: false
});

describe('authoredDrakesToDrakeArray()', () => {
  it('Egg Game I should create valid parent drakes', () => {
    expect(EggGame.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
            "challengeType": "create-unique",
            "mother":{
              "alleles": "w-W, M-m, fl-, hl-, T-T, h-h, C-C, A1-A1, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 1
            },
            "father": {
              "alleles": "w-W, m-m, T-T, h-h, A1-A1, C-C, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 0
            }
          }, ["alleles"]),
          drakes = EggGame.authoredDrakesToDrakeArray(challenge);
    expect(drakes.length).toBe(2);
    expect(GeneticsUtils.isValidAlleleString(drakes[0].alleles)).toBe(true);
    expect(GeneticsUtils.isValidAlleleString(drakes[1].alleles)).toBe(true);
  });

  it('Egg Game II should create complete parent and target drakes', () => {
    expect(EggGame.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
            "challengeType": "match-target",
            "mother":{
              "alleles": "w-W, M-m, fl-, hl-, T-T, h-h, C-C, A1-A1, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 1
            },
            "father": {
              "alleles": "w-W, m-m, T-T, h-h, A1-A1, C-C, B-B, D-D, rh-rh, Bog-Bog",
              "sex": 0
            },
            "targetDrakes": [{},{},{}]
          }, ["alleles"]),
          drakes = EggGame.authoredDrakesToDrakeArray(challenge),
          targetDrakeCount = challenge.targetDrakes.length;
    expect(drakes).toExist("must return authored drakes array");
    expect(drakes.length).toBeGreaterThanOrEqualTo(2 + targetDrakeCount);
    expect(GeneticsUtils.isCompleteAlleleString(drakes[0].alleles)).toBe(true);
    expect(GeneticsUtils.isCompleteAlleleString(drakes[1].alleles)).toBe(true);
    for (let i = 0; i < targetDrakeCount; ++i) {
      const index = drakes.length - targetDrakeCount + i;
      expect(GeneticsUtils.isCompleteAlleleString(drakes[index].alleles)).toBe(true);
    }
  });
});


describe('loading authored state into template', () => {
  describe('in the EggGame II template', () => {
    let authoring = GeneticsUtils.convertDashAllelesObjectToABAlleles({
      challenges: {
        "test": {
          "template": "EggGame",
          "challengeType": "match-target",
          "mother":{
            "alleles": "W-W, T-T",
            "sex": 1
          },
          "father": {
            "alleles": "w-w, T-T",
            "sex": 1
          },
          "targetDrakes": [{},{},{}]
        },
        "empty": {}},
        "application": {"levels": [{"missions": [{"challenges": [{"id": "empty"}, {"id": "test"}]}]}]}
      }, ["alleles"]);

    let defaultState = reducer(undefined, {});
    let initialState = defaultState.merge({
      routeSpec: {level: 0,mission: 0, challenge: 0},
      authoring: authoring
    });

    let nextState = reducer(initialState, navigateToChallenge({level: 0, mission: 0, challenge: 1}));

    it('should create the correct drake and trial state on initial load', () => {
      const drakes = [
        {
          "alleleString": nextState.drakes[0].alleleString, // we check valid alleles below
          "sex": 1
        },
        {
          "alleleString": nextState.drakes[1].alleleString,
          "sex": 1
        },
        null,
        {
          "alleleString": nextState.drakes[3].alleleString,
          "sex": nextState.drakes[3].sex
        },
        {
          "alleleString": nextState.drakes[4].alleleString,
          "sex": nextState.drakes[4].sex
        },
        {
          "alleleString": nextState.drakes[5].alleleString,
          "sex": nextState.drakes[5].sex
        }
      ];
      expect(nextState).toEqual(initialState
        .merge(basicUnderdefinedInitialState("EggGame", {level: 0, mission: 0, challenge: 1},2))
        .merge({
          "challengeType": "match-target",
          drakes,
          initialDrakes: drakes, 
          "goalMoves": nextState.goalMoves,
          "trials": [ {}, {}, {} ],
          "numTrials": 3,
          "trialOrder": [0,1,2]
        }));
    });

    it('should create drakes of the authored genotype', () => {

      expect(GeneticsUtils.isValidAlleleString(nextState.drakes[0].alleleString)).toBe(true);
      expect(nextState.drakes[0].alleleString.indexOf("a:W,b:W") > -1).toBe(true);

      expect(GeneticsUtils.isValidAlleleString(nextState.drakes[1].alleleString)).toBe(true);
      expect(nextState.drakes[1].alleleString.indexOf("a:w,b:w") > -1).toBe(true);

      // all trial drakes must be T-T
      expect(GeneticsUtils.isValidAlleleString(nextState.drakes[3].alleleString)).toBe(true);
      expect(nextState.drakes[3].alleleString.indexOf("a:T,b:T") > -1).toBe(true);
      expect(nextState.drakes[4].alleleString.indexOf("a:T,b:T") > -1).toBe(true);
      expect(nextState.drakes[5].alleleString.indexOf("a:T,b:T") > -1).toBe(true);
    });
  });
});

