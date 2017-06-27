import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { navigateToCurrentRoute, navigateToHome } from '../actions';
import ChallengeContainer from './challenge-container';
import FVChallengeContainer from './fv-challenge-container';
import AuthoringUtils from '../utilities/authoring-utils';

function hasChangedRouteParams(currentRouteSpec, routeParams) {
  if (!currentRouteSpec) {
    return true;
  }
  const { level: currLevel, mission: currMission, challenge: currChallenge } = currentRouteSpec,
        currLevelStr = String(currLevel + 1),
        currMissionStr = String(currMission + 1),
        currChallengeStr = String(currChallenge + 1);
  return (isValidRouteParams(routeParams) &&
        ((routeParams.mission !== currMissionStr) || (routeParams.challenge !== currChallengeStr) || (routeParams.level !== currLevelStr)));
}

function isValidRouteParams(routeParams) {
  return routeParams.mission && routeParams.challenge && routeParams.level;
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
    authoring: PropTypes.object.isRequired,
    currentRouteSpec: PropTypes.shape({
      level: PropTypes.number,
      mission: PropTypes.number,
      challenge: PropTypes.number
    }),
    currentRoom: PropTypes.string,
    // Potentially updated, incoming route parameters
    routeParams: PropTypes.shape({
      level: PropTypes.string,
      mission: PropTypes.string,
      challenge: PropTypes.string,
      challengeId: PropTypes.string
    }),
    navigateToHome: PropTypes.func,
    navigateToCurrentRoute: PropTypes.func
  }

  componentWillMount() {
    const { navigateToCurrentRoute, navigateToHome, authoring } = this.props;
    // the URL's challengeId is only used for initial routing, so prioritize the numeric route params
    let routeParams = this.props.routeParams;
    if (routeParams.challengeId) {
      if (routeParams.challengeId === "home") {
        if (this.props.currentRoom !== "home") {
          navigateToHome();
        }
        return;
      }
      routeParams = AuthoringUtils.challengeIdToRouteParams(authoring, routeParams.challengeId);
    }
    if (isValidRouteParams(routeParams)) {
      if (hasChangedRouteParams(this.props.currentRouteSpec, routeParams)) {
        navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
      }
    } else {
      navigateToHome();
    }
  }

  componentWillReceiveProps(newProps) {
    const { currentRouteSpec, navigateToCurrentRoute, navigateToHome, authoring } = newProps;
    let { routeParams } = newProps;
    if (routeParams.challengeId) {
      if (routeParams.challengeId === "home") {
        if (newProps.currentRoom !== "home") {
          navigateToHome();
        }
        return;
      }
      routeParams = AuthoringUtils.challengeIdToRouteParams(authoring, routeParams.challengeId);
    }
    if (hasChangedRouteParams(currentRouteSpec, routeParams)) {
      navigateToCurrentRoute({level: routeParams.level-1, mission: routeParams.mission-1, challenge: routeParams.challenge-1});
    }
  }

  render() {
    const { authoring, currentRouteSpec, ...otherProps } = this.props;
    let ContainerClass;
    if (currentRouteSpec) {
      const authoredChallenge = AuthoringUtils.getChallengeDefinition(authoring, currentRouteSpec),
            containerName = authoredChallenge.container;
      ContainerClass = mapContainerNameToContainer(containerName);
    } else {
      ContainerClass = FVChallengeContainer;
    }
    return (
      <ContainerClass {...otherProps} />
    );
  }
}

function mapStateToProps (state) {
  return {
    authoring: state.authoring,
    currentRouteSpec: state.routeSpec,
    currentRoom: state.location && state.location.id
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToCurrentRoute: (routeSpec) => dispatch(navigateToCurrentRoute(routeSpec)),
    navigateToHome: () => dispatch(navigateToHome())
  };
}

const DragDropChallengeContainerSelector = DragDropContext(HTML5Backend)(ChallengeContainerSelector),
      ConnectedChallengeContainerSelector = connect(mapStateToProps, mapDispatchToProps)(DragDropChallengeContainerSelector);
export default ConnectedChallengeContainerSelector;
