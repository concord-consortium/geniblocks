export default class AuthoringUtils {
  static getChallengeDefinition(authoring, routeSpec) {
    const challengeId = this.getChallengeId(authoring, routeSpec),
          challenges = authoring.challenges;
    return challengeId && challenges ? authoring.challenges[challengeId] : null;
  }

  static getChallengeId(authoring, routeSpec) {
    if (!routeSpec) {
      return null;
    }
    const levels = authoring.application.levels,
          missions = levels ? levels[routeSpec.level].missions : null,
          challenges = missions ? missions[routeSpec.mission].challenges : null,
          challenge = challenges ? challenges[routeSpec.challenge] : null;
    return challenge ? challenge.id : null;
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
}
