import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducers/';
import { actionTypes, startSession, changeAuthoring } from './actions';

import AuthoringUpload from './containers/authoring-upload';
import ChallengeContainerSelector from "./containers/challenge-container-selector";
import ModalMessageContainer from "./containers/modal-message-container";
import NotificationContainer from "./containers/notification-container";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware from './middleware/its-log';
import routerMiddleware from './middleware/router-history';
import soundsMiddleware from 'redux-sounds';
import thunk from 'redux-thunk';

import io from 'socket.io-client';
import GeneticsUtils from './utilities/genetics-utils';
import urlParams from './utilities/url-params';
import GuideProtocol from './utilities/guide-protocol';
import uuid from 'uuid';

function convertAuthoring(authoring) {
  return GeneticsUtils.convertDashAllelesObjectToABAlleles(authoring,
                          ["alleles", "baseDrake","initialDrakeCombos", "targetDrakeCombos"]);
}

const authoring = require('../resources/authoring/gv2.json');
window.GV2Authoring = convertAuthoring(authoring);

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
const loggingMetadata = {
  applicationName: "GeniStarDev"
};

const guideServer = "wss://guide.intellimedia.ncsu.edu",
      guideProtocol  = "guide-protocol-v2";

const socket = io(`${guideServer}/${guideProtocol}`, {reconnection: false});
socket.on('connect', data =>
  store.dispatch({type: actionTypes.GUIDE_CONNECTED, data})
);
socket.on(GuideProtocol.TutorDialog.Channel, data =>
  store.dispatch({type: actionTypes.GUIDE_MESSAGE_RECEIVED, data: GuideProtocol.TutorDialog.fromJson(data)})
);
socket.on(GuideProtocol.Alert.Channel, (data) =>
  store.dispatch({type: actionTypes.GUIDE_ALERT_RECEIVED, data: GuideProtocol.Alert.fromJson(data)})
);
socket.on('connect_error', data =>
  store.dispatch({type: actionTypes.GUIDE_ERRORED, data})
);

const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const soundsData = {
  hatchDrake: "resources/audio/BabyDragon.mp3",
  receiveCoin: "resources/audio/coin.mp3"
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

const isAuthorUploadRequested = (urlParams.author === "upload");
let isAuthorUploadEnabled = isAuthorUploadRequested;  // e.g. check PRODUCTION flag

function handleCompleteUpload(authoring) {
  store.dispatch(changeAuthoring(convertAuthoring(authoring)));
  isAuthorUploadEnabled = false;
  renderApp();
}

function renderApp() {
  const content = isAuthorUploadEnabled
                    ? <AuthoringUpload isEnabled={isAuthorUploadEnabled}
                                        onCompleteUpload={handleCompleteUpload} />
                    : <div>
                        <Router history={history}>
                          <Route path="/(:level/:case/:challenge)" component={ChallengeContainerSelector} />
                        </Router>
                        <ModalMessageContainer />
                        <NotificationContainer />
                      </div>;
  render(
    <Provider store={store}>
      {content}
    </Provider>
  , document.getElementById("gv"));
}

renderApp();
