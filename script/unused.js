#!/usr/bin/env node

/*
 * Script to identify unused templates and challenges.
 * The authoring document can be specified as the first argument.
 * If no authoring document is specified, the default is used.
 */  

const fs = require("fs");
const args = process.argv.slice(2);
const path = args[0] || "src/resources/authoring/gv-1.json";
const schemaPath = "src/resources/authoring/authoring.schema.json";
const fileContents = fs.readFileSync(path);
const schemaContents = fs.readFileSync(schemaPath);
if (!fileContents) {
  console.log(`Error reading authoring file: '${path}'`);
  process.exit(1);
}
if (!schemaContents) {
  console.log(`Error reading schema file: '${schemaPath}'`);
  process.exit(1);
}

let authoring, schema;
try {
  authoring = JSON.parse(fileContents);
}
catch(e) {
  console.log(`Error: '${path}' does not appear to be a valid JSON file`);
  process.exit(1);
}
try {
  schema = JSON.parse(schemaContents);
}
catch(e) {
  console.log(`Error: '${schemaPath}' does not appear to be a valid JSON file`);
  process.exit(1);
}

const { application: { levels }, challenges } = authoring;
if (!levels || !challenges) {
  console.log(`Error: '${path}' does not appear to be a valid authoring file`);
  process.exit(1);
}
const { definitions } = schema;
if (!definitions) {
  console.log(`Error: '${schemaPath}' does not appear to be a valid schema file`);
  process.exit(1);
}
const { template: { enum: templates } } = definitions,
      templateMap = {};
templates.forEach((template) => {
  templateMap[template] = false;
});

const challengeMap = {};
for (let challenge in challenges) {
  challengeMap[challenge] = false;
}

const gitBranch = require('child_process')
                    .execSync(`git branch | grep '* '`)
                    .toString().trim().substr(2);
const dateStr = new Date().toLocaleString()
                    .replace(/-([0-9])(?=[- ])/g, '-0$1');
console.log(`Authoring File: ${path}`);
console.log(`Git Branch: ${gitBranch}`);
console.log(`Export Date: ${dateStr}\n`);

levels.forEach((level) => {
  level.missions.forEach((mission) => {
    mission.challenges.forEach((challenge) => {
      const challengeSpec = challenges[challenge.id],
            template = challengeSpec && challengeSpec.template;
      challengeMap[challenge.id] = true;
      templateMap[template] = true;
    });
  });
});

let unusedTemplateCount = 0;
for (let t in templateMap) {
  if (!templateMap[t]) {
    ++ unusedTemplateCount;
  }
}
if (unusedTemplateCount) {
  console.log(`Unused templates:`);
  for (let t in templateMap) {
    if (!templateMap[t]) {
      console.log(`  ${t}`);
    }
  }
  console.log();
}

let unusedChallengeCount = 0;
for (let c in challengeMap) {
  if (!challengeMap[c]) {
    ++ unusedChallengeCount;
  }
}
if (unusedChallengeCount) {
  console.log(`Unused challenges:`);
  for (let c in challengeMap) {
    if (!challengeMap[c]) {
      console.log(`  ${c}`);
    }
  }  
}
