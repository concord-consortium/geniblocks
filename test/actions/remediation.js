import expect from 'expect';
import reducer from '../../src/code/reducers/';
import { requestRemediation, GUIDE_REMEDIATION_REQUESTED, STARTED_REMEDIATION, ENDED_REMEDIATION } from '../../src/code/modules/remediation';
describe('Remediation', () => {

  describe('the action creator', () => {

    describe('when not currently in remediation', () => {
      const dispatch = expect.createSpy();
      const getState = () => ({
        isRemediation: false
      });

      it('should create the remediation action when remediation is requested by the ITS', () => {
        requestRemediation({
          context: {
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          }
        })(dispatch, getState);

        expect(dispatch.calls[0].arguments).toEqual([{
          type: GUIDE_REMEDIATION_REQUESTED,
          challengeType: "Sim",
          attribute: "wings",
          practiceCriteria: "SimpleDominant"
        }]);
      });

      it('should then create the modal click screen action', () => {
        expect(dispatch.calls[1].arguments).toEqual([{
          type: "Modal dialog shown",
          mouseShieldOnly: true
        }]);
      });

      it('should then create the remediation notification action', () => {
        expect(dispatch.calls[2].arguments).toEqual([{
          type: "Notifications shown",
          messages: [
            {
              "text": "~ALERT.START_REMEDIATION"
            }
          ],
          closeButton: {
            action: "startRemediation"
          },
          arrowAsCloseButton: true,
          isInterrupt: true,
          isRaised: false
        }]);
      });

    });

    describe('when in remediation', () => {
      const dispatch = expect.createSpy();
      const getState = () => ({
        isRemediation: true
      });

      it('should not create any actions when remediation is requested by the ITS', () => {

        requestRemediation({
          context: {
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          }
        })(dispatch, getState);

        expect(dispatch.calls.length).toBe(0);
      });
    });
  });

  describe('the remediation reducer', () => {

    let defaultState = reducer(undefined, {});
    let nextState;

    describe('on receiving GUIDE remediation request', () => {

      it('should set the remediation challenge in the state', () => {

        nextState = reducer(defaultState, {
          type: GUIDE_REMEDIATION_REQUESTED,
          challengeType: "Sim",
          attribute: "wings",
          practiceCriteria: "SimpleDominant"
        });

        expect(nextState).toEqual(defaultState.merge({
          remediation: {
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          }
        }));
      });

      describe('and then receiving remediation ended action', () => {

        it('should set the remediation to be false in the state', () => {

          nextState = reducer(defaultState, {
            type: ENDED_REMEDIATION
          });

          expect(nextState).toEqual(defaultState.merge({
            remediation: false
          }));
        });

      });
    });
  });

  describe('loading the remediation challenges', () => {

    const basicRemediationState = {
      isRemediation: true,
      showingRoom: false,
      numTrials: 1,
      goalMoves: -1
    };

    describe('with the Sim challengeType', () => {
      describe('and the wings attribute requested', () => {
        describe('and the SimpleDominant practiceCriteria', () => {
          const defaultState = reducer(undefined, {});
          const remediationRequestedState = reducer(defaultState, {
            type: GUIDE_REMEDIATION_REQUESTED,
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleDominant"
          });

          it ('should load the right challenge', () => {
            const nextState = reducer(remediationRequestedState, {
              type: STARTED_REMEDIATION
            });

            expect(nextState).toEqual(remediationRequestedState
              .merge(basicRemediationState)
              .merge({
                template: "FVGenomeChallenge",
                room: "simroom",
                location: {
                  id: "simroom",
                  name: "Bonus Challenge"
                },
                drakes: nextState.drakes,     // will test drakes below
                hiddenAlleles: [
                  "Tk",
                  "A2"
                ],
                userChangeableGenes: [
                  "wings"
                ],
                numTargets: 1,
                showUserDrake: true,
                notifications: {
                  closeButton: true,
                  messages: [
                    {
                      text: [
                        "~REMEDIATION.START_SIM",
                        "wings"
                      ]
                    }
                  ]
                }
              })
            );

            expect(nextState.drakes.length).toBe(2);
            expect(nextState.drakes[0].alleleString.indexOf('a:w,b:w')).toBeGreaterThan(-1);
            expect(nextState.drakes[1].alleleString.indexOf('a:W,b:W')).toBeGreaterThan(-1);
          });
        });
        describe('and the SimpleRecessive practiceCriteria', () => {
          const defaultState = reducer(undefined, {});
          const remediationRequestedState = reducer(defaultState, {
            type: GUIDE_REMEDIATION_REQUESTED,
            challengeType: "Sim",
            attribute: "wings",
            practiceCriteria: "SimpleRecessive"
          });

          it ('should load the right challenge', () => {
            const nextState = reducer(remediationRequestedState, {
              type: STARTED_REMEDIATION
            });

            expect(nextState.drakes.length).toBe(2);
            expect(nextState.drakes[0].alleleString.indexOf('a:W,b:W')).toBeGreaterThan(-1);
            expect(nextState.drakes[1].alleleString.indexOf('a:w,b:w')).toBeGreaterThan(-1);
          });
        });
      });
      describe('and the hindlimbs attribute requested', () => {
        describe('and the SimpleDominant practiceCriteria', () => {
          const defaultState = reducer(undefined, {});
          const remediationRequestedState = reducer(defaultState, {
            type: GUIDE_REMEDIATION_REQUESTED,
            challengeType: "Sim",
            attribute: "hindlimbs",
            practiceCriteria: "SimpleDominant"
          });

          it ('should load the right challenge', () => {
            const nextState = reducer(remediationRequestedState, {
              type: STARTED_REMEDIATION
            });

            expect(nextState).toEqual(remediationRequestedState
              .merge(basicRemediationState)
              .merge({
                template: "FVGenomeChallenge",
                room: "simroom",
                location: {
                  id: "simroom",
                  name: "Bonus Challenge"
                },
                drakes: nextState.drakes,     // will test drakes below
                hiddenAlleles: [
                  "Tk",
                  "A2"
                ],
                userChangeableGenes: [
                  "hindlimbs"
                ],
                numTargets: 1,
                showUserDrake: true,
                notifications: {
                  closeButton: true,
                  messages: [
                    {
                      text: [
                        "~REMEDIATION.START_SIM",
                        "legs"
                      ]
                    }
                  ]
                }
              })
            );

            expect(nextState.drakes.length).toBe(2);
            expect(nextState.drakes[0].alleleString.indexOf('a:hl,b:hl')).toBeGreaterThan(-1);
            expect(nextState.drakes[1].alleleString.indexOf('a:Hl,b:Hl')).toBeGreaterThan(-1);
          });
        });
      });
    });

    describe('with the Hatchery challengeType', () => {
      describe('and the forelimbs attribute requested', () => {
        const defaultState = reducer(undefined, {});
        const remediationRequestedState = reducer(defaultState, {
          type: GUIDE_REMEDIATION_REQUESTED,
          challengeType: "Hatchery",
          attribute: "forelimbs"
        });

        it ('should load the right challenge', () => {
          const nextState = reducer(remediationRequestedState, {
            type: STARTED_REMEDIATION
          });

          expect(nextState).toEqual(remediationRequestedState
            .merge(basicRemediationState)
            .merge({
              template: "FVEggSortGame",
              room: "hatchery",
              location: {
                id: "hatchery",
                name: "Bonus Challenge"
              },
              drakes: nextState.drakes,     // will test drakes below
              baskets: [
                {
                  alleles: [
                    "a:Fl",
                    "b:Fl"
                  ],
                  label: "Drakes with arms"
                },
                {
                  alleles: [
                    "a:fl,b:fl"
                  ],
                  label: "Drakes without arms"
                }
              ],
              hiddenAlleles: [],
              visibleGenes: [
                "forelimbs"
              ],
              notifications: {
                closeButton: true,
                messages: [
                  {
                    text: [
                      "~REMEDIATION.START_SIM",
                      "arms"
                    ]
                  }
                ]
              }
            })
          );

          expect(nextState.drakes.length).toBe(4);

          const homoDomDrakes = nextState.drakes.filter(d => d.alleleString.indexOf('a:Fl,b:Fl') > -1);
          const homoRecDrakes = nextState.drakes.filter(d => d.alleleString.indexOf('a:fl,b:fl') > -1);
          const heteroDrakes = nextState.drakes.filter(d =>
            d.alleleString.indexOf('a:Fl,b:fl') > -1 || d.alleleString.indexOf('a:fl,b:Fl') > -1
          );

          expect(homoDomDrakes.length).toBe(1);
          expect(homoRecDrakes.length).toBe(1);
          expect(heteroDrakes.length).toBe(2);
        });
      });
    });
  });

  describe('the remediationHistory reducer', () => {

    const defaultState = reducer(undefined, {});
    const routeState = defaultState.set('routeSpec', {level: 1, mission: 1, challenge: 2});
    const remediationRequestedState = reducer(routeState, {
      type: GUIDE_REMEDIATION_REQUESTED,
      challengeType: "Sim",
      attribute: "wings",
      practiceCriteria: "SimpleDominant"
    });

    it ('should increment remediation in the history when remediation started', () => {
      const firstRemediationState = reducer(remediationRequestedState, {
        type: STARTED_REMEDIATION
      });

      expect(firstRemediationState.remediationHistory).toEqual([
        [],
        [                 // level 1
          [],
          [               // mission 1
            0, 0, 1       // challenge 3
          ]
        ]
      ]);

      const secondRemediationState = reducer(firstRemediationState, {
        type: STARTED_REMEDIATION
      });

      expect(secondRemediationState.remediationHistory).toEqual([
        [],
        [                 // level 1
          [],
          [               // mission 1
            0, 0, 2       // challenge 3
          ]
        ]
      ]);


      const nextRouteState = secondRemediationState.set('routeSpec', {level: 0, mission: 0, challenge: 1});

      const thirdRemediationState = reducer(nextRouteState, {
        type: STARTED_REMEDIATION
      });

      expect(thirdRemediationState.remediationHistory).toEqual([
        [                 // level 0
          [               // mission 0
            0, 1          // challenge 1
          ]
        ],
        [
          [],
          [
            0, 0, 2
          ]
        ]
      ]);
    });
  });
});
