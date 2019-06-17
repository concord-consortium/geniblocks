/* global firebase */
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducers/';
import { startSession, changeAuthoring } from './actions';

import AuthoringUpload from './containers/authoring-upload';
import Navigation from "./containers/navigation";
import ChallengeContainerSelector from "./containers/challenge-container-selector";

import loggerMiddleware from './middleware/gv-log';
import itsMiddleware, { initializeITSSocket } from './middleware/its-log';
import routerMiddleware from './middleware/router-history';
import stateSaveMiddleware, {authoringVersionNumber} from './middleware/state-save';
import soundsMiddleware from 'redux-sounds';
import thunk from 'redux-thunk';

import GeneticsUtils from './utilities/genetics-utils';
import urlParams from './utilities/url-params';
import uuid from 'uuid';
import { initFirebase, userAuth } from "./utilities/firebase-auth";

// trivial check for Windows as part of user agent string
if (navigator.userAgent.indexOf('Windows') >= 0)
  document.body.className += ' os-windows';

let store, history;

initFirebase.then(function (auth) {
  window.sessionStorage.setItem('portalAuth', true);
  postAuthInitialization(auth);
}, function(err){
    console.log(err);
    window.sessionStorage.setItem('portalAuth', false);
    postAuthInitialization(userAuth());
});

const ITSServers = {
  ncsuProduction: {
    url: "wss://guide.intellimedia.ncsu.edu:/guide-protocol",
    path: "/v3/socket.io"
  },
  ncsuStaging: {
    url: "wss://imediadev.csc.ncsu.edu:/guide-protocol",
    path: "/guide/v3/socket.io"
  },
  ccProduction: {
    url: "wss://geniventure-its.herokuapp.com:/guide-protocol",
    path: "/socket.io"
  },
  ccStaging: {
    url: "wss://geniventure-its-staging.herokuapp.com:/guide-protocol",
    path: "/socket.io"
  }
};
// default to CC's staging ITS server and NCSU's production ITS server for now
ITSServers.staging = ITSServers.ccStaging;
ITSServers.production = ITSServers.ncsuProduction;
ITSServers.ncsu = ITSServers.ncsuProduction;
ITSServers.cc = ITSServers.ccProduction;

const postAuthInitialization = function (auth) {
  store = configureStore();
  const isStagingBranch = window.location.host.indexOf('/branch/staging') >= 0;
  const isLocalhost = (window.location.host.indexOf('localhost') >= 0) ||
                      (window.location.host.indexOf('127.0.0.1') >= 0);
  const instance = urlParams.itsInstance ||
                    (isStagingBranch || isLocalhost ? "staging" : "production");
  const ITSServer = urlParams.itsUrl && urlParams.itsPath
                      ? { url: urlParams.itsUrl, path: urlParams.itsPath }
                      : ITSServers[instance];

  initializeITSSocket(ITSServer.url, ITSServer.path, store);

  // generate pseudo-random sessionID
  const sessionID = uuid.v4();
  loggingMetadata.userName = auth.domain_uid;
  loggingMetadata.classInfo = auth.class_info_url;
  loggingMetadata.studentId = auth.domain_uid;
  loggingMetadata.externalId = auth.externalId;
  loggingMetadata.returnUrl = auth.returnUrl;
  // start the session before syncing history, which triggers navigation
  store.dispatch(startSession(sessionID));
  history = syncHistoryWithStore(hashHistory, store);

  loadAuthoring();
};

function convertAuthoring(authoring) {
  return GeneticsUtils.convertDashAllelesObjectToABAlleles(authoring,
                          ["alleles", "baseDrake","initialDrakeCombos", "targetDrakeCombos"]);
}

// TODO: session ID and application name could be passed in via a container
// use placeholder ID for duration of session and hard-coded name for now.
let loggingMetadata = {
  applicationName: "GeniStarDev"
};

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
    itsMiddleware(loggingMetadata),
    routerMiddleware(hashHistory),
    stateSaveMiddleware(),
    loadedSoundsMiddleware
  )(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState, window.devToolsExtension && window.devToolsExtension());
}

const isAuthorUploadRequested = (urlParams.author === "upload");
let isAuthorUploadEnabled = isAuthorUploadRequested;  // e.g. check PRODUCTION flag

function loadAuthoring() {
  const localAuthoring = urlParams.localAuthoring || false;
  if (localAuthoring) {
    const url = `resources/authoring/${localAuthoring}.json`;
    fetch(url)
      .then(response => response.json())
      .then(handleAuthoringLoad, () => alert(`Cannot load ${url}`));
  } else {
    const db = firebase.database(),
          ref = db.ref(authoringVersionNumber + "/authoring");

    ref.once("value", function(authoringData) {
      handleAuthoringLoad(authoringData.val());
    });
  }
}

function handleCompleteUpload(authoring) {
  store.dispatch(changeAuthoring(convertAuthoring(authoring)));
  isAuthorUploadEnabled = false;
  renderApp();
}

function handleAuthoringLoad(authoring) {
  let convertedAuthoring = convertAuthoring(authoring);
  window.GV2Authoring = convertedAuthoring;
  store.dispatch(changeAuthoring(convertedAuthoring));
  renderApp();
}

function renderApp() {
  const content = isAuthorUploadEnabled
                    ? <AuthoringUpload isEnabled={isAuthorUploadEnabled}
                                        onCompleteUpload={handleCompleteUpload} />
                    : <div>
                        <Router history={history}>
                          <Route path="/navigation" component={Navigation} />
                          <Route path="/(:level/:mission/:challenge)" component={ChallengeContainerSelector} />
                          <Route path="/(:challengeId)" component={ChallengeContainerSelector} />
                        </Router>
                      </div>;
  render(
    <Provider store={store}>
      {content}
    </Provider>
  , document.getElementById("gv"));
}