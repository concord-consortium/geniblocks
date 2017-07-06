import React, {PropTypes} from 'react';
import t from '../utilities/translate';
import GemSetView, {GemView} from './gem-set';
import { getChallengeGem } from '../reducers/helpers/gems-helper';
import VenturePadView from './venture-pad';
import AuthoringUtils from '../utilities/authoring-utils';

const EndLevelDialogView = ({gems, routeSpec, challengeCount, enableContinueButton, authoring, onNextChallenge, onTryAgain}) => {
  let getGemDisplayName = (gem) => {
    let gemName = t("~VENTURE.AWARD_FIRST");
    if (gem === 1) gemName = t("~VENTURE.AWARD_SECOND");
    if (gem === 2) gemName = t("~VENTURE.AWARD_THIRD");
    if (gem >= 3) gemName = t("~VENTURE.AWARD_NONE");
    return gemName;
  };

  let handleContinueClick = () => {
    if (enableContinueButton) {
      onNextChallenge();
    }
  };

  let handleTryAgainClick = () => {
    if (enableContinueButton) {
      onTryAgain();
    }
  };

  let level = routeSpec.level,
      mission = routeSpec.mission,
      challenge = routeSpec.challenge,
      currentScore = getChallengeGem(level, mission, challenge, gems),
      currChallengeMeta = AuthoringUtils.getChallengeMeta(authoring, routeSpec),
      endLevelButtonClass = "end-level-navigation-buttons" + (enableContinueButton ? "" : " disabled");


  let screen = (
    <div>
      <div className="you-earned-text">
        {t("~VENTURE.YOU_EARNED")}:
      </div>
      <div className="gem-info">
        <div className="gem-win-box">
          <GemView gem={currentScore}/>
          <div className="gem-won-text">
            {getGemDisplayName(currentScore)}
          </div>
        </div>
        <GemSetView level={level} mission={mission} challenge={challenge} challengeCount={challengeCount} gems={gems}/>
      </div>
      <div className="venture-pad-separator" id="end-level-separator-2"></div>
      <div className={endLevelButtonClass}>
        <div className="try-again-button-container">
          <div className="try-again-button" onClick={handleTryAgainClick}></div>
          <div className="try-again-text">
            {t("~BUTTON.TRY_AGAIN")}
          </div>
        </div>
        <div className="continue-button-container">
          {t("~BUTTON.CONTINUE")}
          <div className="continue-button" onClick={handleContinueClick}></div>
        </div>
      </div>
    </div>
  );

  return <VenturePadView title={t("~VENTURE.END_LEVEL")} screen={screen} room={currChallengeMeta && currChallengeMeta.room}/>;
};

EndLevelDialogView.propTypes = {
  gems: PropTypes.array,
  routeSpec: PropTypes.object,
  challengeCount: PropTypes.number,
  onNextChallenge: PropTypes.func,
  onTryAgain: PropTypes.func,
  authoring: PropTypes.object,
  enableContinueButton: PropTypes.bool
};

export default EndLevelDialogView;
