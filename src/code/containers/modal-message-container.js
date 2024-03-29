import { connect } from 'react-redux';
import ModalAlert from '../components/modal-alert';
import * as actions from '../actions';
import { resetGametes } from '../modules/gametes';
// merge with the other actions
actions.resetGametes = resetGametes;

function mapStateToProps (state) {
  let props = state.modalDialog,
      hasMoreDialog = state.notifications && state.notifications.messages &&
                        state.notifications.messages.length > 1;
  if (props.showAward || props.showMap) {
    props = props.merge({
      gems: state.gems,
      routeSpec: state.routeSpec,
      challengeCount: state.challenges,
      authoring: state.authoring,
      enableContinueButton: !hasMoreDialog
    });
  }
  return {
    ...props
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actionCreator: function (actionName, actionArgs) {
      return () =>
        dispatch(actions[actionName](actionArgs));
    },
    onNavigateToChallenge: (routeSpec) => dispatch(actions.navigateToChallenge(routeSpec)),
    onHideMap: () => dispatch(actions.toggleMap(false))
  };
}

function mergeProps(stateProps, dispatchProps) {
  let props = {...stateProps, ...dispatchProps},
      { leftButton, rightButton } = props;
  if (leftButton && leftButton.action) {
    props.onLeftButtonClick = dispatchProps.actionCreator(leftButton.action, leftButton.args);
  }
  if (rightButton && rightButton.action) {
    props.onRightButtonClick = dispatchProps.actionCreator(rightButton.action, rightButton.args);
  }
  return props;
}

const ModalMessageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalAlert);

export default ModalMessageContainer;
