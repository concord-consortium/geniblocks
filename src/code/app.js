import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducers/';
import { actionTypes, startSession, navigateToChallenge } from './actions';

import ChallengeContainer from "./containers/challenge-container";
import ModalMessageContainer from "./containers/modal-message-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';
import routerMiddleware from './middleware/router-history';
import soundsMiddleware from 'redux-sounds';
import thunk from 'redux-thunk';

import io from 'socket.io-client';

import uuid from 'uuid';

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
const loggingMetadata = {
  applicationName: "GeniStarDev"
};

const guideServer = "wss://guide.intellimedia.ncsu.edu";
const guideProtocol = "guide-protocol-v2";

const socket = io(guideServer + "/" + guideProtocol, { reconnection: true });

socket.on('connect', state =>
  store.dispatch({type: actionTypes.SOCKET_CONNECTED, state})
);
// socket.on('message', state =>
//   store.dispatch({ type: actionTypes.SOCKET_RECEIVED, state });
// );
socket.on('tutorAction', receivedData => {
    let state = JSON.parse(receivedData).tutorAction;
    store.dispatch({ type: actionTypes.SOCKET_RECEIVED, state });
  }
);

socket.on('connect_error', state=>
  store.dispatch({type: actionTypes.SOCKET_ERRORED, state})
);

const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const soundsData = {
  hatchDrake: "/resources/audio/BabyDragon.mp3",
  receiveCoin: "/resources/audio/coin.mp3"
};
// Pre-load middleware with our sounds.
const loadedSoundsMiddleware = soundsMiddleware(soundsData);

const createStoreWithMiddleware =
  applyMiddleware(
    thunk,
    loggerMiddleware(loggingMetadata),
    itsMiddleware(socket, loggingMetadata),
    routerMiddleware(hashHistory),
    loadedSoundsMiddleware
  )(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const store = configureStore();

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(startSession(uuid.v4()));

render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path="/(:case/:challenge)" component={ChallengeContainer} />
      </Router>
      <ModalMessageContainer />
    </div>
  </Provider>
, document.getElementById("gv"));


