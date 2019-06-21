import React, {PropTypes} from 'react';
import LevelIndicatorView from './level-indicator';
import CountView from './counter';
import GemSetView from './gem-set';
import t from '../utilities/translate';
import ConnectionStateView from './connection-state';

const gemColors = {
  2: "blue",
  1: "yellow",
  0: "red",
  [-1]: "black"
};

const BottomHUDView = React.createClass({

  propTypes: {
    routeSpec: PropTypes.object,
    trial: PropTypes.number,
    trialCount: PropTypes.number,
    currScore: PropTypes.number,
    maxScore: PropTypes.number,
    currMoves: PropTypes.number,
    goalMoves: PropTypes.number,
    showMoveCounter: PropTypes.bool,
    gems: PropTypes.array,
    numChallenges: PropTypes.number,
    showAward: PropTypes.bool,
    showChallengeWidgets: PropTypes.bool,
    showTutorialButton: PropTypes.bool,
    onRestartTutorial: PropTypes.func,
    isRemediation: PropTypes.bool,
    connectionState: PropTypes.string,
    onNotifyConnectionState: PropTypes.func
  },

  render() {
    let {routeSpec, trial, trialCount, currScore, maxScore, currMoves, goalMoves, showMoveCounter, numChallenges,
      gems, showTutorialButton, onRestartTutorial, isRemediation, connectionState} = this.props,
        scoreView = maxScore ?
          <CountView
            countTitleText={t('~COUNTER.SCORE_LABEL')}
            className={'score-count'}
            currCount={currScore}
            maxCount={maxScore} /> : null,
        movesRemaining = (goalMoves + 2) - currMoves,
        movesRemainingShown = movesRemaining >= 0 ? movesRemaining : null,
        label =  movesRemaining >= 0 ? '~COUNTER.MOVES_LABEL' : '~COUNTER.TOO_MANY_MOVES',
        possibleGem = Math.max(-1, Math.min(2, movesRemaining)),
        color = gemColors[possibleGem],
        movesView = (showMoveCounter && goalMoves > -1) ?
          <CountView
            countTitleText={t(label)}
            className={`moves-count ${color}`}
            currCount={movesRemainingShown} /> : null,
        trialsView = trialCount > 1 ? <CountView countTitleText={t('~COUNTER.TRIAL_LABEL')} className={'trial-count'} currCount={trial} maxCount={trialCount} /> : null,
        showRouteWidgets = routeSpec !== null && !isRemediation,
        routeWidgets, challengeWidgets, tutorialWidgets;

    if (showRouteWidgets) {
      let missionScreen = (
        <div className="mission-screen">
          <div className="mission-label mission-label-text">MISSION</div>
          <div className="mission-label mission-label-value">{routeSpec.mission + 1}</div>
        </div>
      );

      routeWidgets = (
        <div>
          <LevelIndicatorView level={routeSpec.level + 1} />
          {missionScreen}
          <GemSetView level={routeSpec.level} mission={routeSpec.mission} challenge={routeSpec.challenge} challengeCount={numChallenges} gems={gems}/>
        </div>
      );
    }

    if (this.props.showChallengeWidgets) {
      challengeWidgets = (
        <div>
          {trialsView}
          {scoreView}
          {movesView}
        </div>
      );
    }
    if (showTutorialButton) {
      tutorialWidgets = (
        <div className="tutorial-activate">
          <div className="tutorial-icon" onClick={onRestartTutorial} />
        </div>
      );
    }

    return (
      <div id='fv-bottom-hud' className='fv-hud fv-bottom-hud' >
        <ConnectionStateView connectionState={connectionState} onNotifyConnectionState={this.props.onNotifyConnectionState}/>
        { routeWidgets }
        {challengeWidgets}
        {tutorialWidgets}
      </div>
    );
  }
});

export default BottomHUDView;
