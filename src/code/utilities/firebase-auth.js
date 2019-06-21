/* global firebase */
import urlParams, { updateUrlParameter } from "./url-params";
import jwt from 'jsonwebtoken';

export const initFirebase = new Promise(function (resolve, reject) {
  // Initialize Firebase
  const configStaging = {
    apiKey: "AIzaSyCr8UbzmHqWVuOIQrU2_1_CIIwT-GphnYo",
    authDomain: "gvstaging.firebaseapp.com",
    databaseURL: "https://gvstaging.firebaseio.com",
    projectId: "gvstaging",
    storageBucket: "",
    messagingSenderId: "574673678327"
  };

  const configLive = {
    apiKey: "AIzaSyCQyZqErr-WsvaZzATcmOgxxv1wcrNQXIo",
    authDomain: "gvdemo-6f015.firebaseapp.com",
    databaseURL: "https://gvdemo-6f015.firebaseio.com",
    projectId: "gvdemo",
    storageBucket: "",
    messagingSenderId: "574673678327"
  };

  const config = window.location.href.indexOf('/branch/staging') > -1 ? configStaging : configLive;

  if (window.firebase !== undefined) {
    firebase.initializeApp(config);
    const timeNow = new Date().getTime();
    window.sessionStorage.setItem('lastUpdate', timeNow);
  // communicate with portal for JWT
  // if there is no domain parameter, there is no authentication
  if (!urlParams.domain) {
    reject("Not authenticated via portal");
  } else if (!urlParams.token) {
    let token = window.sessionStorage.getItem('jwToken');
    if (!token) {
      reject("No token for database access");
    }
    else {
      // firebase.auth().signInWithCustomToken(token).catch(function (error) {
      //   reject(Error(error));
      // });
      resolve(_userAuth(token));
    }
  } else {
    // send request to portal via domain url parameter
    let jwtUrl = urlParams.domain + "api/v1/jwt/firebase?firebase_app=" + config.projectId;

    let jwtInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${urlParams.token}`
      }
    };

    fetch(jwtUrl, jwtInit)
      .then(function (response) {
        if (!response.ok) {
          // token didn't work, try local session
          let token = window.sessionStorage.getItem('jwToken');
          if (!token) {
            reject("Failed to fetch JWT", response.error, response.body);
          }
          else {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
              firebase.auth().signInWithCustomToken(token).catch(function (error) {
                reject(error);
              });
            });
            window.sessionStorage.setItem('jwToken', token);
            resolve(_userAuth(token));
          }
        }
        else {
          // we have a token that was accepted
          response.json().then(function (jsonData) {
            firebase.auth().signInWithCustomToken(jsonData.token).catch(function (error) {
              reject(error);
            });
            window.sessionStorage.setItem('jwToken', jsonData.token);
            updateUrlParameter("token");
            resolve(_userAuth(jsonData.token));
          });
        }
      });
    }
  } else {
    console.log("Firebase is OFFLINE");
    resolve(_userAuth());
  }
});

let _cachedAuth;
export const userAuth = () => {
  if (_cachedAuth) {
    return _cachedAuth;
  }
  else {
    let token = window.sessionStorage.getItem('jwToken');
    return _userAuth(token);
  }
};

function _userAuth(token){
  const params = urlParams ? urlParams : {};
  if (token) {
    let authToken = (jwt.decode(token));
    _cachedAuth = {
      user_id: authToken.claims.user_id,
      class_info_url: authToken.class_info_url,
      fb_class_info_url: convertUrlToFirebaseKey(authToken.class_info_url),
      externalId: authToken.externalId,
      returnUrl: authToken.returnUrl,
      domain: params.domain,
      domain_uid: params.domain_uid,
      fb_user_id_url: convertUrlToFirebaseKey(params.domain) + params.domain_uid
    };
  } else {
    _cachedAuth = {
      user_id: params.baseUser || "gv2-user",
      class_info_url: params.class_info_url,
      externalId: params.externalId,
      returnUrl: params.returnUrl,
      domain: params.domain,
      domain_uid: params.domain_uid
    };
  }
  return _cachedAuth;
}
const connectionMonitor = () => {
  if (window.firebase) {
    const connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function (snap) {
      if (snap.val() === true) {
        console.log("Firebase connected");
        window.fbConnected = true;
      } else {
        console.log("Firebase not connected");
        window.fbConnected = false;
      }
    });
    return connectedRef;
  } else return;
};
connectionMonitor();

export const fbConnected = () => {
  return window.fbConnected;
};

export function getFBClassId() {
  if (!_cachedAuth) {
    _cachedAuth = userAuth();
  }
  if (_cachedAuth && _cachedAuth.fb_class_info_url) return _cachedAuth.fb_class_info_url;
  return convertUrlToFirebaseKey(_cachedAuth.class_info_url);
}

export function getFBUserId() {
  if (!_cachedAuth) {
    _cachedAuth = userAuth();
  }
  if (_cachedAuth && _cachedAuth.fb_user_id_url) return _cachedAuth.fb_user_id_url;
  return convertUrlToFirebaseKey(_cachedAuth.domain) + _cachedAuth.domain_uid;
}

function convertUrlToFirebaseKey(url) {
  if (!url) {
    return null;
  }
  // Convert invalid Firebase characters (inluding periods) to their ASCII equivalents
  return encodeURIComponent(url).replace(/\./g, "%2E");
}
