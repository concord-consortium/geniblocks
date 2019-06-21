#!/usr/bin/env node

/*
 * Script to export the list of challenges and corresponding templates.
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

const { application: { levels }, challenges } = authoring;
if (!levels || !challenges) {
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

  level.missions.forEach((mission, missionIndex) => {

    mission.challenges.forEach((challenge, challengeIndex) => {
      const challengeSpec = challenges[challenge.id],
            template = challengeSpec && challengeSpec.template,
            challengeType = challengeSpec && challengeSpec.challengeType,
            typeStr = challengeType ? `: ${challengeType}` : "",
            interactionType = challengeSpec && challengeSpec.interactionType,
            interactionStr = interactionType ? `: ${interactionType}` : "";
      console.log(`Challenge ${levelIndex+1}.${missionIndex+1}.${challengeIndex+1} - [${template}${typeStr}${interactionStr}] '${challenge.id}'`);
    });
    console.log(``);
  });
});
