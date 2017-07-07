import React, {PropTypes} from 'react';
import t from '../utilities/translate';
import GemSetView from './gem-set';
import VenturePadView from './venture-pad';
import AuthoringUtils from '../utilities/authoring-utils';

export default class NavigationDialogView extends React.Component {

  static propTypes = {
    routeSpec: PropTypes.object,
    authoring: PropTypes.object,
    gems: PropTypes.array,
    onNavigateToChallenge: PropTypes.func,
    onHideMap: PropTypes.func
  }

  constructor(props) {
    super(props);
    let level = props.routeSpec && props.routeSpec.level;

    if (typeof level !== "number") {
      level = AuthoringUtils.getCurrentMissionFromGems(props.authoring, props.gems).level;
    }

    this.state = {
      level: level
    };
  }

  render() {
    let {gems, onNavigateToChallenge, onHideMap, authoring} = this.props,
        currChallengeRoute = AuthoringUtils.getCurrentChallengeInLevelFromGems(authoring, gems, this.state.level),
        isCurrLevel = this.state.level === currChallengeRoute.level;

    let gemSets = [];

    for (let mission = 0; mission < AuthoringUtils.getMissionCount(authoring, this.state.level); mission++) {
      let isCurrMission = isCurrLevel && mission === currChallengeRoute.mission;
      gemSets.push(<div id={"gem-label-" + mission} className="gem-set-label" key={"label-" + mission}>
                     {"Mission " + (this.state.level + 1) + "." + (mission + 1) + ":"}
                   </div>);
      gemSets.push(<GemSetView level={this.state.level} mission={mission} challenge={isCurrMission ? currChallengeRoute.challenge : null}
                               challengeCount={AuthoringUtils.getChallengeCount(authoring, this.state.level, mission)}
                               gems={gems} key={"gem-set-" + mission}
                               onNavigateToChallenge={onNavigateToChallenge} />);
    }

    let handlePageBackward = () => {
      this.setState({level: Math.max(this.state.level - 1, 0)});
    };

    let handlePageForward = () => {
      const numLevels = AuthoringUtils.getLevelCount(authoring);
      this.setState({level: Math.min(this.state.level + 1, numLevels - 1)});
    };

    let levelNavigation = (
      <div className="level-indicator">
        <div className="level-title">{t("~LEVEL_INDICATOR.LEVEL_LABEL")}</div>
        <div className="level-navigation">
          <div id="prev-level-button" className="level-nav-button" onClick={handlePageBackward}></div>
          <div className="level-label">{this.state.level + 1}</div>
          <div id="next-level-button" className="level-nav-button" onClick={handlePageForward}></div>
        </div>
      </div>
    );

    let screen = (
      <div className="navigation-dialog">
        {levelNavigation}
        {gemSets}
      </div>
    );

    return <VenturePadView title={t("~VENTURE.MAP")} screen={screen} onClickOutside={onHideMap} onNavigateToChallenge={onNavigateToChallenge}
                           authoring={authoring} roomHighlightRoute={currChallengeRoute}></VenturePadView>;
  }
}

