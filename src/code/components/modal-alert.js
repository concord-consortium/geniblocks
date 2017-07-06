/*
 * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
 */
import EndLevelDialogView from '../fv-components/end-level-dialog';
import NavigationDialogView from '../fv-components/navigation-dialog';
import React, { PropTypes } from 'react';

class ModalAlert extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    showAward: PropTypes.bool,
    showMap: PropTypes.bool,
    rightButton: PropTypes.shape({
      label: React.PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      onClick: PropTypes.func
    }),
    onLeftButtonClick: PropTypes.func,        // optional click handlers if not defined
    onRightButtonClick: PropTypes.func,       // in button props. (Better for `mapDispatchToProps`)
    gems: PropTypes.array,
    routeSpec: PropTypes.object,
    challengeCount: PropTypes.number,
    onNavigateToChallenge: PropTypes.func,
    onHideMap: PropTypes.func,
    authoring: PropTypes.object,
    enableContinueButton: PropTypes.bool
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
                              enableContinueButton={this.props.enableContinueButton}
                              authoring={this.props.authoring}
                              onNextChallenge={this.props.onRightButtonClick} onTryAgain={this.props.onLeftButtonClick}/>
        );
      } else if (this.props.showMap) {
        return <NavigationDialogView authoring={this.props.authoring}
                                     routeSpec={this.props.routeSpec}
                                     gems={this.props.gems}
                                     onNavigateToChallenge={this.props.onNavigateToChallenge}
                                     onHideMap={this.props.onHideMap}/>;
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
