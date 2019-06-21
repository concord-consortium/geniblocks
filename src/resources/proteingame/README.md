# Geniventure Protein Games
#### A collaboration between [The Concord Consortium](https://concord.org) and [FableVision Studios](https://www.fablevisionstudios.com)

## Develop

```npm run dev``` runs a local server so you can run the game in a browser.

Open your browser and enter `localhost:3000` into the address bar to launch the game with no URL parameters.

Use `localhost:3000/debug.html` for a page of links for launching the game with URL parameters that correspond to the Geniventure challenges.

This will start a watch process, so you can change the source and the process will recompile and refresh the browser.

## Build

```npm run deploy``` will build, optimize and minimize the compiled bundle.

Currently, the Protein Games build is independent of the Geniventure build. The Protein Games build products must be checked in to the repository so that they are deployed as part of the Geniventure deployment.

## Deploy

The Protein Games are deployed as part of the Geniventure project to https://geniventure.concord.org.

- Production
  - https://geniventure.concord.org/resources/proteingame/
  - https://geniventure.concord.org/resources/proteingame/debug.html for testing
- Master branch
  - https://geniventure.concord.org/branch/master/resources/proteingame/
  - https://geniventure.concord.org/branch/master/resources/proteingame/debug.html for testing

Geniventure supports a `gameBase` URL parameter for specifying the URL of the protein games to launch.

## Original Phaser-ES6-Webpack starter project ReadMe is reproduced below.

# Phaser + ES6 + Webpack.
#### A bootstrap project to create games with Phaser + ES6 + Webpack.

![Phaser+ES6+Webpack](https://raw.githubusercontent.com/lean/phaser-es6-webpack/master/assets/images/phaser-es6-webpack.jpg)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## Features
- ESLINT with JavaScript Standard Style configuration
- Next generation of Javascript
- Webpack ready
- Multiple browser testing
- WebFont Loader


# Setup
To use this bootstrap you’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/lean/phaser-es6-webpack.git```

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies:

Navigate to the cloned repo’s directory.

Run:

```npm install```

## 4. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Credits
Big thanks to this great repos:

https://github.com/belohlavek/phaser-es6-boilerplate

https://github.com/cstuncsik/phaser-es6-demo
