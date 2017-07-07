import { scoreValues } from '../reducers/helpers/gems-helper';

export default class AuthoringUtils {
  static getChallengeDefinition(authoring, routeSpec) {
    const challengeId = this.getChallengeId(authoring, routeSpec),
          challenges = authoring.challenges;
    return challengeId && challenges ? authoring.challenges[challengeId] : null;
  }

  static getChallengeMeta(authoring, routeSpec) {
    if (!routeSpec) {
      return null;
    }
    const levels = authoring.application.levels,
          missions = levels ? levels[routeSpec.level].missions : null,
          challenges = missions ? missions[routeSpec.mission].challenges : null,
          challengeMeta = challenges ? challenges[routeSpec.challenge] : null;
    return challengeMeta;
  }

  static getChallengeId(authoring, routeSpec) {
    let meta = this.getChallengeMeta(authoring, routeSpec);
    return meta ? meta.id : null;
  }

  static getLevelCount(authoring) {
    const levels = authoring.application.levels;
    return levels ? levels.length : null;
  }

  static getMissionCount(authoring, level) {
    const levels = authoring.application.levels,
          missions = levels ? levels[level].missions : null;
    return missions ? missions.length : null;
  }

  static getChallengeCount(authoring, level, mission) {
    const levels = authoring.application.levels,
          missions = levels ? levels[level].missions : null,
          challenges = missions ? missions[mission].challenges : null;
    return challenges.length;
  }

  static challengeIdToRouteParams(authoring, targetChallengeId) {
    if (!authoring || !targetChallengeId) {
      return null;
    }

    let routeSpec = null;
    authoring.application.levels.forEach((level, levelIndex) => {
      level.missions.forEach((mission, missionIndex) => {
        mission.challenges.forEach((challenge, challengeIndex) => {
          if (challenge.id === targetChallengeId) {
            routeSpec = {level: String(levelIndex + 1), mission: String(missionIndex + 1), challenge: String(challengeIndex + 1)};
          }
        });
      });
    });
    return routeSpec;
  }

  static getPreviousMission(authoring, level, mission) {
    if (mission > 0) {
      return {
        level,
        mission: mission - 1
      };
    } else if (level > 0) {
      return {
        level: level - 1,
        mission: authoring.application.levels[level - 1].missions.length - 1
      };
    } else {
      return null;
    }
  }

  /**
   * Returns an object representing the current level+mission the user is on,
   * and whether the user has completed at least one challenge in the mission.
   */
  static getCurrentMissionFromGems(authoring, gems) {
    for (let i = 0, ii = authoring.application.levels.length; i < ii; i++) {
      let level = authoring.application.levels[i];
      for (let j = 0, jj = level.missions.length; j < jj; j++) {
        let mission = level.missions[j];
        for (let k = 0, kk = mission.challenges.length; k < kk; k++) {
          if (gems[i] && gems[i][j] && !isNaN(gems[i][j][k])) {
            continue;
          } else {
            return {
              level: i,
              mission: j,
              started: k > 0
            };
          }
        }
      }
    }
  }

  /**
   * Returns an object representing the current mission and challenge the user is on in the given level,
   * by finding the first challenge which is failed or incomplete. If all challenges are complete,
   * returns the first challenge instead.
   */
  static getCurrentChallengeInLevelFromGems(authoring, gems, levelNum) {
    let level = authoring.application.levels[levelNum];
    for (let j = 0, jj = level.missions.length; j < jj; j++) {
      let mission = level.missions[j];
      for (let k = 0, kk = mission.challenges.length; k < kk; k++) {
        if (gems[levelNum] && gems[levelNum][j] && !isNaN(gems[levelNum][j][k]) && gems[levelNum][j][k] !== scoreValues.NONE) {
          continue;
        } else {
          return {
            level: levelNum,
            mission: j,
            challenge: k
          };
        }
      }
    }
    // All challenges are complete
    return {
      level: levelNum,
      mission: 0,
      challenge: 0
    };
  }
}
