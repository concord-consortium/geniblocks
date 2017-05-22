import expect from 'expect';
import GenomeChallenge from '../../src/code/templates/genome-challenge';
import GeneticsUtils from '../../src/code/utilities/genetics-utils';
import reducer from '../../src/code/reducers/';
import { navigateToChallenge } from '../../src/code/actions';

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
  it('Genome Challenge should create valid drakes', () => {
    expect(GenomeChallenge.authoredDrakesToDrakeArray).toExist("must implement authoredDrakesToDrakeArray()");

    const challenge = GeneticsUtils.convertDashAllelesObjectToABAlleles({
            "initialDrake":{
              "alleles": "w-w",
              "sex": 1
            },
            "targetDrakes": [{
              "alleles": "W-W",
              "sex": 1
            }]
          }, ["alleles"]),
          drakes = GenomeChallenge.authoredDrakesToDrakeArray(challenge, 0);
    expect(drakes.length).toBe(2);
    expect(GeneticsUtils.isValidAlleleString(drakes[0].alleles)).toBe(true);
    expect(GeneticsUtils.isValidAlleleString(drakes[1].alleles)).toBe(true);
  });
});

describe('loading authored state into template', () => {
  describe('in the GenomeChallenge template', () => {
    let authoring = GeneticsUtils.convertDashAllelesObjectToABAlleles({
      "challenges": {
        "test": {
          "template": "GenomeChallenge",
          "numTrials": 1,
          "initialDrake":{
            "alleles": "W-w, D-D, Bog-Bog, rh-rh",
            "sex": 0
          },
          "targetDrakes": [{
            "alleles": "W-W",
            "sex": 1
          },
          {
            "alleles": "w-w",
            "sex": 1
          }]
        }, "empty": {}},
      "application": {"levels": [{"missions": [{"challenges": [{"id": "empty"}, {"id": "test"}]}]}]}
    }, ["alleles"]);

    let defaultState = reducer(undefined, {});
    let initialState = defaultState.merge({
      routeSpec: {level: 0, mission: 0, challenge: 0},
      authoring: authoring
    });

    let nextState = reducer(initialState, navigateToChallenge({level: 0, mission: 0, challenge: 1}));

    it('should create the correct drake and trial state on initial load', () => {
      const drakes = [
        {
          "alleleString": nextState.drakes[0].alleleString, // we check valid alleles below
          "secondXAlleles": "b:D,b:Bog,b:rh",
          "sex": 0
        },
        {
          "alleleString": nextState.drakes[1].alleleString,
          "sex": 1
        }
      ];
      expect(nextState).toEqual(initialState
        .merge(basicUnderdefinedInitialState("GenomeChallenge", {level: 0, mission: 0, challenge: 1},2))
        .merge({
          drakes,
          initialDrakes: drakes,
          "goalMoves": nextState.goalMoves,
          "trials": [
            {
              "alleles": "a:W,b:W",
              "sex": 1
            },
            {
              "alleles": "a:w,b:w",
              "sex": 1
            }
          ],
          "numTrials": 1,
          "trialOrder": [0,1]
        }));
    });

    it('should create drakes of the authored genotype', () => {
      expect(GeneticsUtils.isValidAlleleString(nextState.drakes[0].alleleString)).toBe(true);
      expect(nextState.drakes[0].alleleString.indexOf("a:W,b:w") > -1).toBe(true);

      expect(GeneticsUtils.isValidAlleleString(nextState.drakes[1].alleleString)).toBe(true);
      expect(nextState.drakes[1].alleleString.indexOf("a:W,b:W") > -1).toBe(true);
    });
  });

  describe('with linked genes', () => {
    describe('in the GenomeChallenge template', () => {
      let authoring = GeneticsUtils.convertDashAllelesObjectToABAlleles({
      "challenges": {
        "test": {
          "template": "GenomeChallenge",
          "initialDrake": {
            "alleles": "W-w",
            "sex": 1
          },
          "targetDrakes": [{
            "alleles": "W-W",
            "sex": 1
          },
          {
            "alleles": "w-w",
            "sex": 1
          }],
          "linkedGenes": {
            "drakes": [0, 1],
            "genes": "tail, horns"
          }
        }, "empty": {}},
      "application": {"levels": [{"missions": [{"challenges": [{"id": "empty"}, {"id": "test"}]}]}]}
    }, ["alleles"]);

      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {mission: 0, challenge: 0},
        authoring: authoring
      });

      let nextState = reducer(initialState, navigateToChallenge({level: 0, mission: 0, challenge: 1}));

      it('should create drakes with linked genes', () => {
        expect(GeneticsUtils.isValidAlleleString(nextState.drakes[0].alleleString)).toBe(true);
        expect(nextState.drakes[0].alleleString.indexOf("a:W,b:w") > -1).toBe(true);

        expect(GeneticsUtils.isValidAlleleString(nextState.drakes[1].alleleString)).toBe(true);
        expect(nextState.drakes[1].alleleString.indexOf("a:W,b:W") > -1).toBe(true);

        let drake0Def = nextState.drakes[0],
            drake0 = new BioLogica.Organism(BioLogica.Species.Drake, drake0Def.alleleString, drake0Def.sex),
            tailGenotype = drake0.genetics.genotype.getAlleleString(["tail"], drake0.genetics),
            hornsGenotype = drake0.genetics.genotype.getAlleleString(["horns"], drake0.genetics);

        expect(nextState.drakes[1].alleleString.indexOf(tailGenotype) > -1).toBe(true);
        expect(nextState.drakes[1].alleleString.indexOf(hornsGenotype) > -1).toBe(true);
      });
    });
  });

  describe('with randomized trials', () => {
    describe('in the GenomeChallenge template', () => {
      let authoring = GeneticsUtils.convertDashAllelesObjectToABAlleles({
      "challenges": {
        "test": {
          "template": "GenomeChallenge",
          "randomizeTrials": true,
          "initialDrake": {
            "alleles": "W-w",
            "sex": 1
          },
          "targetDrakes": [{}, {}, {}, {}, {}, {}, {}, {}]
        }, "empty": {}},
      "application": {"levels": [{"missions": [{"challenges": [{"id": "empty"}, {"id": "test"}]}]}]}
    }, ["alleles"]);

      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {mission: 0, challenge: 0},
        authoring: authoring
      });

      let nextState = reducer(initialState, navigateToChallenge({level: 0, mission: 0, challenge: 1}));

      it('should create a random ordering of trials', () => {
        expect(nextState.trialOrder.length).toBe(8);
        expect(nextState.trialOrder).toNotEqual([0,1,2,3,4,5,6,7]); // 1/40320 chance that this will fail
      });
    });
  });
});
