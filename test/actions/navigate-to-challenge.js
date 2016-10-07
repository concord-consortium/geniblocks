import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { navigateToChallenge, actionTypes as types } from '../../src/code/actions';

describe('navigateToChallenge action', () => {
  it('should create the correct action when we navigate to a challenge', () => {
    const _case = 2,
          challenge = 3;

    let actionObject = navigateToChallenge(_case, challenge);

    expect(actionObject).toEqual({
      type: types.NAVIGATED,
      case: _case,
      challenge,
      route: "/3/4",
      meta: {
        "itsLog": {
          "actor": "USER",
          "action": "NAVIGATED",
          "target": "CHALLENGE"
        },
        logTemplateState: true
      }
    });
  });

  describe('the reducer', () => {
    it('should update the state to match the authored state when we navigate', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        case: 0,
        challenge: 0,
        authoring: [
          [],
          [{}, {}, {
            template: "GenomePlayground",
            "initialDrake": {
              "alleles": "a:T,b:T",
              "sex": 1
            }
          }]
        ]
      });

      let nextState = reducer(initialState, navigateToChallenge(1, 2));

      // by starting with nextState and merging in what we expect,
      // we eliminate all other properties from consideration
      expect(nextState).toEqual(nextState.merge({
        case: 1,
        challenge: 2,
        template: "GenomePlayground",
        challenges: 3,
        trialSuccess: false,
      }));
    });
  });
});
