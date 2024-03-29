import React, {PropTypes} from 'react';
import classNames from 'classnames';
import AuthoringUtils from '../utilities/authoring-utils';

const VenturePadView = ({title, screen, onClickOutside, onNavigateToChallenge, authoring, roomHighlightRoute}) => {
  let roomMeta = AuthoringUtils.getChallengeMeta(authoring, roomHighlightRoute);
  let handleNavigateToChallenge = () => {
    if (onNavigateToChallenge) {
      onNavigateToChallenge(roomHighlightRoute);
    }
  };
  return (
    <div className="venture-pad-container">
      <div className="venture-pad-backdrop" onClick={onClickOutside}></div>
      <div className="venture-pad-background"></div>
      <div className="venture-pad-overlay"></div>
      <div className="venture-pad-glass">
        <div className="venture-pad-map">
          <div style={onNavigateToChallenge ? {cursor: "pointer"} : null}
               className={classNames("venture-pad-room-highlight", roomMeta && roomMeta.room)} 
               onClick={handleNavigateToChallenge}></div>
        </div>
      </div>
      <div className="venture-pad-screen">
        <div className="venture-pad-title">
          /{title}
        </div>
        <div className="venture-pad-flavor-text">
          {"Geni_retrieve <get> boot_all </get>"}
          <br/>
          {"Scale system flex/accessing drake genetics mainframe..."}
          <br/>
          {"/buffering data..."}
        </div>
        <div className="venture-pad-separator" id="venture-pad-separator-1"></div>
        { screen }
      </div>
    </div>
  );
};

VenturePadView.propTypes = {
  title: PropTypes.string,
  screen: PropTypes.object,
  onClickOutside: PropTypes.func,
  onNavigateToChallenge: PropTypes.func,
  authoring: PropTypes.object,
  roomHighlightRoute: PropTypes.object
};

export default VenturePadView;
