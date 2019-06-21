#!/usr/bin/env node

/**
 * deploy-authoring.js
 * 
 * Uploads the local authoring document to either the staging or production firebase database.
 *
 * Usage:
 *  -d/--dry-run      report what would be deployed without actually deploying (default: false)
 *  -p/--production   deploy to production database; otherwise staging database (default: false)
 */

const argv = require('minimist')(process.argv.slice(2));
const fbAdmin = require("firebase-admin");

/**
 * A service account key is required to gain admin access to the database.
 * To obtain a service account key,
 * 1. log into the Firebase console
 * 2. navigate to project settings
 * 3. select the Service Accounts tab
 * 4. "Generate new private key" to download a key
 * 5. Rename the key file to `gvstaging-firebase-key.json` or `gvproduction-firebase-key.json`
 * 6. move it into this folder (`./script`). It will be imported below.
 * IMPORTANT: Never commit your private key! It should be ignored by .gitignore.
 */
const isDryRun = argv.d || argv["dry-run"];
const isProduction = argv.p || argv.production;
const keyPath = isProduction
                  ? "./gvproduction-firebase-key.json"
                  : "./gvstaging-firebase-key.json";
const fbKey = require(keyPath);
const fbDatabaseUrl = isProduction
                        ? "https://gvdemo-6f015.firebaseio.com"
                        : "https://gvstaging.firebaseio.com";
const dbVersion = "1";
const authoringKey = "authoring";

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(fbKey),
  databaseURL: fbDatabaseUrl
});
const authoringRef = fbAdmin.database().ref(`/${dbVersion}/${authoringKey}`);

async function readStdinSync() {
  return new Promise(resolve => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    // use timer to detect when there's no input
    let t = setTimeout(() => {
      process.stdin.pause();
      resolve(data);
    }, 1000);
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read())) {
        data += chunk;
      }
      if (t) {
        clearTimeout(t);
        t = null;
      }
    }).on('end', () => {
      if (t) clearTimeout(t);
      resolve(data);
    });
  });
}

async function main() {
  const input = await readStdinSync();
  if (input) {
    if (isDryRun) {
      console.log(input);
      console.log(`dry-run: would have pushed authoring to ${isProduction ? "production" : "staging"} database`);
      process.exit(0);
    }
    else {
      // upload the authoring to firebase
      const parsedAuthoring = JSON.parse(input);
      authoringRef.set(parsedAuthoring, error => {
        if (!error) {
          console.log(`Successfully deployed authoring to ${isProduction ? "production" : "staging"} database!`);
          process.exit(0);
        }
        else {
          console.error("Deploy failed!");
          process.exit(1);
        }
      });
    }
  }
  else {
    console.error("No input received!");
    process.exit(1);
  }
}

main();
