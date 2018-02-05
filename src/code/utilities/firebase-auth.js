/* global firebase */
import urlParams from "./url-params";
import jwt from 'jsonwebtoken';

export const initFirebase = new Promise(function (resolve, reject) {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCr8UbzmHqWVuOIQrU2_1_CIIwT-GphnYo",
    authDomain: "gvstaging.firebaseapp.com",
    databaseURL: "https://gvstaging.firebaseio.com",
    projectId: "gvstaging",
    storageBucket: "",
    messagingSenderId: "574673678327"
  };
  firebase.initializeApp(config);

  // communicate with portal for JWT
  // if there is no domain parameter, there is no authentication
  if (!urlParams.domain) {
    //console.log("Not authenticated via portal");
    reject(Error("Not authenticated via portal"));
  } else {
    // send request to portal via domain url parameter
    // for example, https://learn.staging.concord.org/api/v1/jwt/firebase?firebase_app=GVStaging
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
          reject(Error("Failed to fetch JWT", response.error, response.body));
        }
        else {
          let authToken;
          response.json().then(function (jsonData) {
            authToken = jwt.decode(jsonData.token);
            firebase.auth().signInWithCustomToken(jsonData.token).catch(function (error) {
              reject(Error(error));
            });
            resolve(authToken);
          });
        }
      });
  }
});