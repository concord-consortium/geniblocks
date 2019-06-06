#!/usr/bin/env node

/*
 * Script to export the narrative text from an authoring document.
 * The authoring document can be specified as the first argument.
 * If no authoring document is specified, the default is used.
 */  

const fs = require("fs");
const args = process.argv.slice(2);
const path = args[0] || "src/resources/authoring/gv-1.json";
const fileContents = fs.readFileSync(path);
if (!fileContents) {
  console.log(`Error reading authoring file: '${path}'`);
  process.exit(1);
}

let authoring;
try {
  authoring = JSON.parse(fileContents);
}
catch(e) {
  console.log(`Error: '${path}' does not appear to be a valid JSON file`);
  process.exit(1);
}

const { application: { levels } } = authoring;
if (!levels) {
  console.log(`Error: '${path}' does not appear to be a valid authoring file`);
  process.exit(1);
}

const gitBranch = require('child_process')
                    .execSync(`git branch | grep '* '`)
                    .toString().trim().substr(2);
const dateStr = new Date().toLocaleString()
                    .replace(/-([0-9])(?=[- ])/g, '-0$1');
console.log(`Authoring File: ${path}`);
console.log(`Git Branch: ${gitBranch}`);
console.log(`Export Date: ${dateStr}\n`);

levels.forEach((level, levelIndex) => {
  console.log(`*`);
  console.log(`* Level ${levelIndex+1} - "${level.name}"`);
  console.log(`*\n`);

  level.missions.forEach((mission, missionIndex) => {
    console.log(`*`);
    console.log(`* Mission ${levelIndex+1}.${missionIndex+1} - "${mission.name}"`);
    console.log(`*`);  

    (mission.dialog.start || []).forEach(d => {
      console.log(`  ${d.character}: "${d.text}"`);
    });
    console.log(``);
    mission.challenges.forEach((challenge, challengeIndex) => {
      console.log(`  *`);
      console.log(`  * Challenge ${levelIndex+1}.${missionIndex+1}.${challengeIndex+1} - "${challenge.name}"`);
      console.log(`  *`);  

      (challenge.dialog.start || []).forEach(d => {
        console.log(`    ${d.character}: "${d.text}"`);
      });
      console.log(``);
      for (let ending in challenge.dialog.end || {}) {
        console.log(`    ${ending}:`);
        (challenge.dialog.end[ending] || []).forEach(d => {
          console.log(`    ${d.character}: "${d.text}"`);
        });
        console.log(``);
      }
    });
    if (mission.dialog.middle) {
      console.log(`  middle/home:`);
      (mission.dialog.middle || []).forEach(d => {
        console.log(`  ${d.character}: "${d.text}"`);
      });
    }
    console.log(``);
    if (mission.dialog.end) {
      console.log(`  end:`);
      (mission.dialog.end || []).forEach(d => {
        console.log(`  ${d.character}: "${d.text}"`);
      });
    }
    console.log(``);
  });
});
