import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';

const initialState = Immutable({
  show: false,
  message: null,
  explanation: null,
  leftButton: null,
  rightButton: null
});

const defaultRightButton = {
  label: "~BUTTON.OK",
  action: "dismissModalDialog"
};

export default function modalDialog(state = initialState, action) {
  switch (action.type) {
    case actionTypes.MODAL_DIALOG_SHOWN:
      return state.merge({
        show: true,
        message: action.message,
        explanation: action.explanation,
        rightButton: action.rightButton || defaultRightButton,
        leftButton: action.leftButton,
        showAward: action.showAward,
        top: action.top
      });
    case actionTypes.SOCKET_RECEIVED:
      if (action.state.message) {
        return state.merge({
          show: true,
          message: "Message from ITS",
          explanation: action.state.message.text,
          rightButton: defaultRightButton
        });
      }
      else
        return state;
    case actionTypes.MODAL_DIALOG_DISMISSED:
      return initialState;
    // Assume for now that all other actions also close dialog
    default:
      return initialState;
  }
}
