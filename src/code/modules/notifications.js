import Immutable from 'seamless-immutable';
import { GAMETES_RESET, GAMETE_POOLS_RESET } from '../modules/gametes';
import { LOCATION_CHANGE } from 'react-router-redux';
import actionTypes from '../action-types';
import t from '../utilities/translate';

export const GUIDE_CONNECTED = "Guide connected";
export const GUIDE_HINT_RECEIVED = "Guide hint received";
export const GUIDE_ALERT_RECEIVED = "Guide alert received";
export const GUIDE_ERRORED = "Guide errored";
export const ADVANCE_NOTIFICATIONS = "Advance notifications";
export const CLOSE_NOTIFICATIONS = "Close notifications";

export const notificationType = {
  NARRATIVE: "narrative"
};

const initialState = {
  messages: Immutable([]),
  closeButton: null
};

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case GUIDE_HINT_RECEIVED:
      if (state.messages[0] && state.messages[0].type === notificationType.NARRATIVE) {
        console.log(`%c Not showing ITS Message due to narrative`, `color: #f99a00`);
        return state;
      }

      if (action.data && action.data.context) {
        const currentText = state.messages.length > 0 ? state.messages[0].text + " " : "";

        const newMessage = {
          text: currentText + action.data.context.hintDialog
        };

        if (action.data.context.attribute) {
          newMessage.trait = action.data.context.attribute;
        }

        return Object.assign({}, state, { messages: [newMessage] });
      }
      else
        return state;

    case actionTypes.NOTIFICATIONS_SHOWN: {
      const translatedMessages = action.messages.map(message => {
        return Object.assign({}, message, {text: t(message.text)});
      });
      const allMessages = action.isInterrupt ?
        translatedMessages :
        state.messages.concat(translatedMessages);
      return {
        messages: allMessages,
        closeButton: action.closeButton,
        arrowAsCloseButton: action.arrowAsCloseButton,
        isRaised: action.isRaised
      };
    }
    case ADVANCE_NOTIFICATIONS:
      return Object.assign({}, state, {messages: state.messages.length > 1 ? state.messages.slice(1, state.length) : initialState});
    case CLOSE_NOTIFICATIONS:
      return initialState;
    // actions which don't clear the guide message
    case GAMETES_RESET:
    case GAMETE_POOLS_RESET:
    case GUIDE_CONNECTED:
    case GUIDE_ALERT_RECEIVED:
    case actionTypes.MODAL_DIALOG_SHOWN:
    case actionTypes.MODAL_DIALOG_DISMISSED:
    case actionTypes.VIEWED_EASTER_EGG:
    case LOCATION_CHANGE:
      return state;
    // For now, clear all messages every time the user does anything else
    default:
      return initialState;
  }
}

export function advanceNotifications() {
  return {
    type: ADVANCE_NOTIFICATIONS
  };
}

export function closeNotifications() {
  return {
    type: CLOSE_NOTIFICATIONS
  };
}
