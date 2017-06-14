import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateToChallenge,} from '../actions';

const NavigateButton = ({routeSpec, label, onClick}) => {

  function handleClick() {
    onClick(routeSpec);
  }

  return (
    <div className="navigate-button" onClick={handleClick}>
      <div className="button-label navigate-button-label unselectable">
        {label}
      </div>
    </div>
  );
};

NavigateButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  routeSpec: PropTypes.object.isRequired
};

class Navigation extends Component {

  static backgroundClasses = 'navigation-layout'

  render() {
    const { navigateToChallenge } = this.props;

    const handleNavigateButton = function(routeSpec) {
      navigateToChallenge(routeSpec);
    };

    const navigateButton = function(challengeName, level, mission, challenge) {
      return <NavigateButton label={challengeName} 
                             routeSpec={{level: level - 1, mission: mission - 1, challenge: challenge - 1}} 
                             onClick={handleNavigateButton} />;
    };

    return (
      <div className="mission-backdrop navigation-layout">
        <div id="navigation">
          {navigateButton("Mission 1.1.1", 1, 1, 1)}
          {navigateButton("Mission 2.1.1", 2, 1, 1)}
          {navigateButton("Mission 2.1.2", 3, 1, 1)}
          {navigateButton("Mission 2.2.1", 4, 1, 1)}
          {navigateButton("Mission 2.2.2", 5, 1, 1)}
          {navigateButton("Mission 2.3.1", 6, 1, 1)}
          {navigateButton("Mission 2.3.2", 7, 1, 1)}
          {navigateButton("Mission 2.3.3", 8, 1, 1)}
          {navigateButton("Mission 2.3.4", 9, 1, 1)}
          {navigateButton("Mission 4.1.1", 10, 1, 1)}
          {navigateButton("Mission 4.1.2", 11, 1, 1)}
          {navigateButton("Mission 4.1.3", 12, 1, 1)}
          {navigateButton("Mission 4.1.4", 13, 1, 1)}
          {navigateButton("Mission 3.1.1", 14, 1, 1)}
          {navigateButton("Mission 3.1.2", 15, 1, 1)}
          {navigateButton("Mission 4.2.1", 16, 1, 1)}
          {navigateButton("Mission 4.2.1", 17, 1, 1)}
        </div>
      </div>
    );
  }

  static propTypes = {
    navigateToChallenge: PropTypes.func.isRequired
  }
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToChallenge: (routeSpec) => dispatch(navigateToChallenge(routeSpec))
  };
}

const ConnectedNavigation = connect(() => {return {};}, mapDispatchToProps)(Navigation);
export default ConnectedNavigation;
