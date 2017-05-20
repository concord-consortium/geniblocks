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

    let missionNum = 1;

    const handleNavigateButton = function(routeSpec) {
      navigateToChallenge(routeSpec);
    };

    const navigateButton = function(level, mission, challenge) {
      return <NavigateButton label={"Level " + missionNum++} 
                             routeSpec={{level: level - 1, mission: mission - 1, challenge: challenge - 1}} 
                             onClick={handleNavigateButton} />;
    };

    return (
      <div className="mission-backdrop navigation-layout">
        <div id="navigation">
          {navigateButton(1, 1, 1)}
          {navigateButton(2, 1, 1)}
          {navigateButton(3, 1, 1)}
          {navigateButton(4, 1, 1)}
          {navigateButton(5, 1, 1)}
          {navigateButton(6, 1, 1)}
          {navigateButton(7, 1, 1)}
          {navigateButton(8, 1, 1)}
          {navigateButton(9, 1, 1)}
          {navigateButton(10, 1, 1)}
          {navigateButton(11, 1, 1)}
          {navigateButton(12, 1, 1)}
          {navigateButton(13, 1, 1)}
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
