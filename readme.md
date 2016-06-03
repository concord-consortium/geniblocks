# GeniBlocks

GeniBlocks is a collection of small, modular React components that can be
used as building blocks for genetics-based applications.

As much as possible, the views are designed to be "dumb" stateless views
that render entirely based on their properties, and output events that an
outside container or application can handle. As such, most of the views
can be written as [Stateless functional components](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components).

Many views take a [Biologica.js](https://github.com/concord-consortium/biologica.js)
organism as a property.

## Development Setup

    npm install --global lerna@2.0.0-beta.13      # install lerna globally
    npm install
    bower install
    gulp                  # or its alias 'npm run build:watch'

or to build without watching:

    gulp clean-and-build  # or its alias 'npm run build'

in a separate shell/console:

    npm run examples      # or its alias 'live-server public'

which will launch a browser tab pointing to the examples at http://localhost:8080/, or

    npm run gv2           # or its alias 'live-server public --open=gv2'

which will launch a browser tab pointing to the GV2 prototype at http://localhost:8080/gv2/

### Deploy Examples to gh-pages

    gulp deploy           # or its alias 'npm run deploy'

## Structure

The code is written in ES2015+ and JSX, which is transformed using Babel. We use
browserify to build `geniblocks.js` into the global object `GeniBlocks`.

This project aims to be a lightweight library for consumption by other applications.
Its built products are therefore simply `dist/geniblocks.js` and `dist/geniblocks.css`,
and we do not bundle React or Biologica.js with the library. The `GV2` sample application
is currently built along with the `GeniBlocks` lib and is installed into the `/public`
folder along with the other examples as described below. Eventually, it will presumably
become a separate project in its own right but for now it's convenient to keep them together.

Demos and tests are created in `/examples`, and are built into `/public`, along
with duplicates of the built scripts, css, and the vendor libraries (React and
biologica.js), allowing `/public` to be a secondary, stand-alone build product for
development and deploying demos.

## Code Linting

Run `npm run lint` to lint from the command line.

If you are using Sublime, install the `SublimeLinter` and `SublimeLinter-contrib-es6`
packages, using https://packagecontrol.io/

(You will also probably want ES6 syntax highlighting, so install the `Babel` package as well.)

## Code Testing

Run `npm test` to run unit tests from the command line.

## Resources

* [GeniBlocks Examples](http://concord-consortium.github.io/geniblocks/)
* [GV2 Prototype](http://concord-consortium.github.io/geniblocks/gv2/)
* [Geniverse Demo](http://demo.geniverse.concord.org)
* [Geniverse Lab](https://geniverse-lab.concord.org)
* [Biologica.js](http://github.com/concord-consortium/biologica.js)

## License

MIT License. See full text at license.md.

