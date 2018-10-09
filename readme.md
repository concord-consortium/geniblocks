# GeniBlocks
[![Build Status](https://travis-ci.org/concord-consortium/geniblocks.svg?branch=master)](https://travis-ci.org/concord-consortium/geniblocks)

This repo contains the React-based `Geniverse-2.0` project, as well as an
independent collection of small, modular React components (`GeniBlocks`)
that can be used as building blocks for other genetics-based applications.

### GeniBlocks components

The `GeniBlocks` components are a collection of "dumb" (mostly) stateless views
that render entirely based on their properties, and output events that an
outside container or application can handle. As such, many of the views
can be written as [Stateless functional components](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components).

Many views take a [Biologica.js](https://github.com/concord-consortium/biologica.js)
organism as a property.

The components are used by `Geniverse-2.0`, but are also built to `/dist` as their
own independent React component library. The examples in `/public/examples` all
use the GeniBlocks library this way.

## Development Setup

    npm install           # or 'yarn'
    bower install
    npm start             # or 'gulp'

or to build without watching:

    gulp clean-and-build  # or its alias 'npm run build'

in a separate shell/console:

    npm run gv2           # or its alias 'live-server public/gv2'

which will launch a browser tab pointing to the GV2 application at `http://localhost:8080/`, or

    npm run examples      # or its alias `live-server public/examples`

which will launch a browser tab pointing to the examples page.

### Deploy Examples to gh-pages

    gulp deploy           # or its alias 'npm run deploy'

For deployment, `yarn` may be preferable to `npm install` for dependency installation
due to its greater predictability.

### Running Geniventure locally

By default, Geniventure will try to fetch the authoring for the activities from the Firebase database.

You can add the url parameter `localAuthoring=x` to the url to load a JSON file stored in `src/resources/authoring` instead of loading the default authoring stored. E.g. http://127.0.0.1:8080/gv2/?localAuthoring=gv-1

The authored activities in the authoring folder should be named `gv-x` for reasonably-up-to-date copies of the official authoring, where x is the version at the root of the Firebase document. Experimental activities can be given other names.

The authoring document can be validated against the schema specified in the [authoring.schema.json](src/resources/authoring/authoring.schema.json) file. Validation can be triggered from the command line with the command

    npm run validate

Visual Studio Code can be configured to [show schema validation errors](https://code.visualstudio.com/docs/languages/json#_mapping-to-a-schema-in-the-workspace) in the editor by configuring a user setting for the project:
```
  // Associate schemas to JSON files in the current project
  "json.schemas": [{
      "fileMatch": ["gv-1.json"],
      "url": "./src/resources/authoring/authoring.schema.json"
  }],
```

### Narrative

The narrative text alone can be exported from the authoring document using

    npm run narrative > narrative.txt

which generates output like the following:
```
Authoring File: src/resources/authoring/gv-1.json
Git Branch: 157825652-export-dialog-text
Export Date: 2018-06-04 14:56:36

*
* Level 1 - "Level 1"
*

*
* Mission 1.1 - "Mission 1.1"
*
  HATCH: "Welcome, Cadet, to our underground hideout! I'm Professor Hatch, director of the Drake Breeder's Guild."
  WEAVER: "And I'm Dr. Weaver, head of Mission Control here in the heart of our subterranean base."
  HATCH: "Here in the Wyvern Republic, our dragons are under attack from the evil Kingdom of Darkwell, and in danger of going extinct! "
  WEAVER: "You are training to be part of an elite team of scientists who will help us bring dragons back from the brink!"
  HATCH: "Time is running out and we need to train you fast! Come with me to the Sim Room. Click your VenturePad to navigate around the base."
```

## Structure

The code is written in ES2015+ and JSX, which is transformed using Babel. We use
browserify to build `geniblocks.js` which exposes the global object `GeniBlocks`.

This project aims to be a lightweight library for consumption by other applications.
Its built products are therefore simply `dist/geniblocks.js` and `dist/geniblocks.css`,
and we do not bundle React or Biologica.js with the library. The `GV2` sample application
is currently built along with the `GeniBlocks` library and is installed into the `/public`
folder along with the other examples as described below. Eventually, it will presumably
become a separate project in its own right but for now it's convenient to keep them together.

Demos and tests are created in `/examples`, and are built into `/public`, along
with duplicates of the built scripts, css, and the vendor libraries (React and
biologica.js), allowing `/public` to be a secondary, stand-alone build product for
development and deployment of demos.

## State Management (Redux)

`GV2` uses [Redux](https://github.com/reactjs/redux) for its state management. Initially, actions were defined in `src/code/actions.js`, reducers in `src/code/reducers/`, etc. More recently, related actions and reducers have been combined into modules in `src/code/modules/` loosely following the [Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux) proposal, with some additional ideas gleaned from [The Anatomy Of A React & Redux Module (Applying The Three Rules)](https://jaysoo.ca/2016/02/28/applying-code-organization-rules-to-concrete-redux-code/).

## Logging and Intelligent Tutoring

The `Geniverse-2.0` application is designed to log its state and relevant user actions to the CC Log Manager. Through a partnership with North Carolina State University (supported by the [GeniGUIDE](https://concord.org/projects/geniguide) project) it is also designed to communicate with an Intelligent Tutoring System (ITS) being developed at NCSU.

## Code Linting

Run `npm run lint` to lint from the command line.

If you are using Sublime, install the `SublimeLinter` and `SublimeLinter-contrib-es6`
packages, using https://packagecontrol.io/

(You will also probably want ES6 syntax highlighting, so install the `Babel` package as well.)

## Code Testing

Run `npm test` to run unit tests from the command line. Unit test code resides in the `test` directory, which loosely parallels the organization of the `src/code` directory.

## Using Redux DevTools

See [https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension).

1. Install Chrome extension from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
2. While in GV2 app, open Developer Console and select "Redux" tab (may need to restart console to see this)
3. Or click the DevTools icon (greenish atom) to open tools in separate window

Now you can see a list of actions and state changes, a history slider, have the ability to export and import state and history, and fire actions directly from the tool panel.

## Protein Game

The Protein Game was produced by FableVision and is added as-is to src/resources/proteingame.

It can be built with

```
cd src/resources/proteingame
npm install
npm run deploy
```

The entire folder needs to be included, because the build process only builds the source into the dist folder, but the static files are outside this.

## Resources

* [GeniBlocks Examples](http://concord-consortium.github.io/geniblocks/examples)
* [GV2 Prototype](http://concord-consortium.github.io/geniblocks/gv2/)
* [Geniverse Demo](http://demo.geniverse.concord.org)
* [Geniverse Lab](https://geniverse-lab.concord.org)
* [Biologica.js](http://github.com/concord-consortium/biologica.js)

## Support

`Geniverse-2.0` and `GeniBlocks` development is supported in part by

* [GeniConnect](https://concord.org/projects/geniconnect)
* [GeniGUIDE](https://concord.org/projects/geniguide)
* [Connected Biology](https://concord.org/projects/connected-biology)

## License

MIT License. See full text at license.md.
