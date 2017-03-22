import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { navigateToCurrentRoute, actionTypes as types } from '../../src/code/actions';

describe('navigateToCurrentRoute action', () => {
  const validLevel = 0, validMission = 1, validChallenge = 2,
        invalidLevel = 3, invalidMission = 3, invalidChallenge = 3,
        currentRouteAction = {
          type: types.NAVIGATED,
          level: validLevel,
          mission: validMission,
          challenge: validChallenge,
          skipRouteChange: true,
          meta: {
            logTemplateState: true,
            dontLog: ["skipRouteChange"],
            itsLog: {
              "actor": "USER",
              "action": "NAVIGATED",
              "target": "CHALLENGE"
            }
          }
        },
        challengeAction = {
          type: types.NAVIGATED,
          level: validLevel,
          mission: validMission,
          challenge: validChallenge,
          route: "/1/2/3",
          meta: {
            "itsLog": {
              "actor": "USER",
              "action": "NAVIGATED",
              "target": "CHALLENGE"
            },
            logTemplateState: true
          }
        };

  const dispatch = expect.createSpy();
  const getState = () => ({
    routeSpec: {level: 0, mission: 0, challenge: 0}, 
    authoring: {
      "definitions": {"empty": {}}, 
      "levelHierarchy": [[["empty"],["empty", "empty", "empty"]]] 
    }
  });

  it("should dispatch a navigateToCurrentRoute action when a valid challenge is specified", () => {
    navigateToCurrentRoute({level: validLevel, mission: validMission, challenge: validChallenge})(dispatch, getState);
    expect(dispatch.calls[0].arguments).toEqual([currentRouteAction]);
  });

  it("should dispatch a navigateToChallenge action to the nearest valid challenge" +
      " when an invalid challenge is specified", () => {
    navigateToCurrentRoute({level: invalidLevel, mission: invalidMission, challenge: invalidChallenge})(dispatch, getState);
    expect(dispatch.calls[1].arguments).toEqual([challengeAction]);
  });

  describe('the reducer', () => {
    it('should update the state to match the expected state when we navigate to a valid challenge', () => {
      let defaultState = reducer(undefined, {});
      let initialState = defaultState.merge({
        routeSpec: {level: 0, mission: 0, challenge: 0},
        authoring: {
          "definitions": {
            "test": {
              template: "GenomePlayground",
              "initialDrake": {
                "alleles": "a:T,b:T",
                "sex": 1
              }
            }, "empty": {}},
          "levelHierarchy": 
            [
              [
                [],
                ["empty", "empty", "test"]
              ]
            ]
        }
      });

      let nextState = reducer(initialState, currentRouteAction);

      // By starting with nextState and merging in what we expect, we eliminate
      // all other properties from consideration. This is particularly an issue
      // for challenge navigation, which triggers loadStateFromAuthoring(), which
      // makes a large number of changes to the state that have nothing to do with
      // the navigation action itself. These loadStateFromAuthoring() changes tend
      // to change frequently, at least during these early days of new challenge
      // development. Requiring navigation unit tests to be modified whenever 
      // loadStateFromAuthoring() changes leads to brittle unit tests. If one
      // wanted to unit test the loadStateFromAuthoring() changes, it could be
      // done with a unit test of that function directly.
      expect(nextState).toEqual(nextState.merge({
        routeSpec: {level: 0, mission: 1, challenge: 2},
        template: "GenomePlayground",
        challenges: 3,
        trialSuccess: false,
      }));
    });
  });
});
