/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import EndLevelDialogView from '../fv-components/end-level-dialog';
import React, { PropTypes } from 'react';

class ModalAlert extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    showAward: PropTypes.bool,
    rightButton: PropTypes.shape({
      label: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      onClick: PropTypes.func
    }),
    onLeftButtonClick: PropTypes.func,        // optional click handlers if not defined
    onRightButtonClick: PropTypes.func,       // in button props. (Better for `mapDispatchToProps`)
    gems: PropTypes.array,
    routeSpec: PropTypes.object,
    challengeCount: PropTypes.number
  }

  static defaultProps = {
    show: false,
    challengeAwards: { id:0, progress: [] }
  }

  render() {
    const rightProps = this.props.rightButton || {};

    if (this.props.show) {
      // Only trial-end and next-trial modals are shown
      if (this.props.showAward) {
        return (
          <EndLevelDialogView gems={this.props.gems}
                              routeSpec={this.props.routeSpec}
                              challengeCount={this.props.challengeCount}
                              onNextChallenge={this.props.onRightButtonClick} onTryAgain={this.props.onLeftButtonClick}/>
        );
      } else {
        return <div className="next-trial-button" onClick={rightProps.onClick || this.props.onRightButtonClick}>
                <div className="next-trial-text">Next Trial</div>
               </div>;
      }
    }
    return null;
  }

}

export default ModalAlert;
