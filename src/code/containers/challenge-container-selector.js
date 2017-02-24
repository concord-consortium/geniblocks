import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateToCurrentRoute, navigateToChallenge } from '../actions';
import ChallengeContainer from './challenge-container';
import FVChallengeContainer from './fv-challenge-container';

function hasChangedRouteParams(props) {
  const { level: currLevel, case: currCase, challenge: currChallenge, routeParams } = props,
        currLevelStr = String(currLevel + 1),
        currCaseStr = String(currCase + 1),
        currChallengeStr = String(currChallenge + 1);
  return (routeParams.case && routeParams.challenge && routeParams.level &&
        ((routeParams.case !== currCaseStr) || (routeParams.challenge !== currChallengeStr) || (routeParams.level !== currLevelStr)));
}

function mapContainerNameToContainer(containerName) {
  switch (containerName) {
    case 'FVContainer':
      return FVChallengeContainer;
    default:
      return ChallengeContainer;
  }
}

class ChallengeContainerSelector extends Component {

  static propTypes = {
    authoring: PropTypes.array.isRequired,
    level: PropTypes.number.isRequired,
    case: PropTypes.number.isRequired,
    challenge: PropTypes.number.isRequired,
    routeParams: PropTypes.shape({
      level: PropTypes.string,
      case: PropTypes.string,
      challenge: PropTypes.string
    }),
    navigateToChallenge: PropTypes.func,
    navigateToCurrentRoute: PropTypes.func
  }

  componentWillMount() {
    const { routeParams, navigateToCurrentRoute, navigateToChallenge } = this.props;
    if (hasChangedRouteParams(this.props)) {
      navigateToCurrentRoute(routeParams.level-1, routeParams.case-1, routeParams.challenge-1);
    } else {
      navigateToChallenge(0, 0, 0);
    }
  }

  componentWillReceiveProps(newProps) {
    const { routeParams, navigateToCurrentRoute } = newProps;
    if (hasChangedRouteParams(newProps)) {
      navigateToCurrentRoute(routeParams.level-1, routeParams.case-1, routeParams.challenge-1);
    }
  }

  render() {
    const { authoring, level: currLevel, case: currCase, challenge: currChallenge, ...otherProps } = this.props,
          casesInLevel = authoring[currLevel],
          challengesInCase = casesInLevel[currCase],
          authoredChallenge = challengesInCase[currChallenge],
          containerName = authoredChallenge.container,
          ContainerClass = mapContainerNameToContainer(containerName);
    return (
      <ContainerClass {...otherProps} />
    );
  }
}

function mapStateToProps (state) {
  return {
    authoring: state.authoring,
    level: state.level,
    case: state.case,
    challenge: state.challenge
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToChallenge: (level, _case, challenge) => dispatch(navigateToChallenge(level, _case, challenge)),
    navigateToCurrentRoute: (level, _case, challenge) => dispatch(navigateToCurrentRoute(level, _case, challenge))
  };
}

const ConnectedChallengeContainerSelector = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainerSelector);
export default ConnectedChallengeContainerSelector;
