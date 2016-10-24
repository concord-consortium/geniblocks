(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GeniBlocks = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

/**
 * document.activeElement
 */
exports['default'] = activeElement;

var _ownerDocument = require('./ownerDocument');

var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

function activeElement() {
  var doc = arguments[0] === undefined ? document : arguments[0];

  try {
    return doc.activeElement;
  } catch (e) {}
}

module.exports = exports['default'];
},{"./ownerDocument":8,"./util/babelHelpers.js":14}],2:[function(require,module,exports){
'use strict';
var hasClass = require('./hasClass');

module.exports = function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!hasClass(element)) element.className = element.className + ' ' + className;
};
},{"./hasClass":3}],3:[function(require,module,exports){
'use strict';
module.exports = function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return (' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1;
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
  addClass: require('./addClass'),
  removeClass: require('./removeClass'),
  hasClass: require('./hasClass')
};
},{"./addClass":2,"./hasClass":3,"./removeClass":5}],5:[function(require,module,exports){
'use strict';

module.exports = function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
};
},{}],6:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var off = function off() {};

if (canUseDOM) {

  off = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.removeEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.detachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = off;
},{"../util/inDOM":19}],7:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var on = function on() {};

if (canUseDOM) {
  on = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.addEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.attachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = on;
},{"../util/inDOM":19}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = ownerDocument;

function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

module.exports = exports["default"];
},{}],9:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');

var contains = (function () {
  var root = canUseDOM && document.documentElement;

  return root && root.contains ? function (context, node) {
    return context.contains(node);
  } : root && root.compareDocumentPosition ? function (context, node) {
    return context === node || !!(context.compareDocumentPosition(node) & 16);
  } : function (context, node) {
    if (node) do {
      if (node === context) return true;
    } while (node = node.parentNode);

    return false;
  };
})();

module.exports = contains;
},{"../util/inDOM":19}],10:[function(require,module,exports){
'use strict';

module.exports = function getWindow(node) {
  return node === node.window ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
};
},{}],11:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var _utilCamelizeStyle = require('../util/camelizeStyle');

var _utilCamelizeStyle2 = babelHelpers.interopRequireDefault(_utilCamelizeStyle);

var rposition = /^(top|right|bottom|left)$/;
var rnumnonpx = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;

module.exports = function _getComputedStyle(node) {
  if (!node) throw new TypeError('No Element passed to `getComputedStyle()`');
  var doc = node.ownerDocument;

  return 'defaultView' in doc ? doc.defaultView.opener ? node.ownerDocument.defaultView.getComputedStyle(node, null) : window.getComputedStyle(node, null) : { //ie 8 "magic" from: https://github.com/jquery/jquery/blob/1.11-stable/src/css/curCSS.js#L72
    getPropertyValue: function getPropertyValue(prop) {
      var style = node.style;

      prop = (0, _utilCamelizeStyle2['default'])(prop);

      if (prop == 'float') prop = 'styleFloat';

      var current = node.currentStyle[prop] || null;

      if (current == null && style && style[prop]) current = style[prop];

      if (rnumnonpx.test(current) && !rposition.test(prop)) {
        // Remember the original values
        var left = style.left;
        var runStyle = node.runtimeStyle;
        var rsLeft = runStyle && runStyle.left;

        // Put in the new values to get a computed value out
        if (rsLeft) runStyle.left = node.currentStyle.left;

        style.left = prop === 'fontSize' ? '1em' : current;
        current = style.pixelLeft + 'px';

        // Revert the changed values
        style.left = left;
        if (rsLeft) runStyle.left = rsLeft;
      }

      return current;
    }
  };
};
},{"../util/babelHelpers.js":14,"../util/camelizeStyle":16}],12:[function(require,module,exports){
'use strict';

var camelize = require('../util/camelizeStyle'),
    hyphenate = require('../util/hyphenateStyle'),
    _getComputedStyle = require('./getComputedStyle'),
    removeStyle = require('./removeStyle');

var has = Object.prototype.hasOwnProperty;

module.exports = function style(node, property, value) {
  var css = '',
      props = property;

  if (typeof property === 'string') {

    if (value === undefined) return node.style[camelize(property)] || _getComputedStyle(node).getPropertyValue(hyphenate(property));else (props = {})[property] = value;
  }

  for (var key in props) if (has.call(props, key)) {
    !props[key] && props[key] !== 0 ? removeStyle(node, hyphenate(key)) : css += hyphenate(key) + ':' + props[key] + ';';
  }

  node.style.cssText += ';' + css;
};
},{"../util/camelizeStyle":16,"../util/hyphenateStyle":18,"./getComputedStyle":11,"./removeStyle":13}],13:[function(require,module,exports){
'use strict';

module.exports = function removeStyle(node, key) {
  return 'removeProperty' in node.style ? node.style.removeProperty(key) : node.style.removeAttribute(key);
};
},{}],14:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports === "object") {
    factory(exports);
  } else {
    factory(root.babelHelpers = {});
  }
})(this, function (global) {
  var babelHelpers = global;

  babelHelpers.interopRequireDefault = function (obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
})
},{}],15:[function(require,module,exports){
"use strict";

var rHyphen = /-(.)/g;

module.exports = function camelize(string) {
  return string.replace(rHyphen, function (_, chr) {
    return chr.toUpperCase();
  });
};
},{}],16:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/camelizeStyleName.js
 */

'use strict';
var camelize = require('./camelize');
var msPattern = /^-ms-/;

module.exports = function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
};
},{"./camelize":15}],17:[function(require,module,exports){
'use strict';

var rUpper = /([A-Z])/g;

module.exports = function hyphenate(string) {
  return string.replace(rUpper, '-$1').toLowerCase();
};
},{}],18:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/hyphenateStyleName.js
 */

"use strict";

var hyphenate = require("./hyphenate");
var msPattern = /^ms-/;

module.exports = function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
};
},{"./hyphenate":17}],19:[function(require,module,exports){
'use strict';
module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
},{}],20:[function(require,module,exports){
'use strict';

var canUseDOM = require('./inDOM');

var size;

module.exports = function (recalc) {
  if (!size || recalc) {
    if (canUseDOM) {
      var scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return size;
};
},{"./inDOM":19}],21:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))

},{"_process":22}],22:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],23:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function() {
  root.requestAnimationFrame = raf
  root.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"performance-now":21}],24:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var msPerFrame = 1000 / 60;

var Motion = _react2['default'].createClass({
  displayName: 'Motion',

  propTypes: {
    // TOOD: warn against putting a config in here
    defaultStyle: _react.PropTypes.objectOf(_react.PropTypes.number),
    style: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object])).isRequired,
    children: _react.PropTypes.func.isRequired,
    onRest: _react.PropTypes.func
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyle = _props.defaultStyle;
    var style = _props.style;

    var currentStyle = defaultStyle || _stripStyle2['default'](style);
    var currentVelocity = _mapToZero2['default'](currentStyle);
    return {
      currentStyle: currentStyle,
      currentVelocity: currentVelocity,
      lastIdealStyle: currentStyle,
      lastIdealVelocity: currentVelocity
    };
  },

  wasAnimating: false,
  animationID: null,
  prevTime: 0,
  accumulatedTime: 0,
  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400
  unreadPropStyle: null,
  // after checking for unreadPropStyle != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)
  clearUnreadPropStyle: function clearUnreadPropStyle(destStyle) {
    var dirty = false;
    var _state = this.state;
    var currentStyle = _state.currentStyle;
    var currentVelocity = _state.currentVelocity;
    var lastIdealStyle = _state.lastIdealStyle;
    var lastIdealVelocity = _state.lastIdealVelocity;

    for (var key in destStyle) {
      if (!destStyle.hasOwnProperty(key)) {
        continue;
      }

      var styleValue = destStyle[key];
      if (typeof styleValue === 'number') {
        if (!dirty) {
          dirty = true;
          currentStyle = _extends({}, currentStyle);
          currentVelocity = _extends({}, currentVelocity);
          lastIdealStyle = _extends({}, lastIdealStyle);
          lastIdealVelocity = _extends({}, lastIdealVelocity);
        }

        currentStyle[key] = styleValue;
        currentVelocity[key] = 0;
        lastIdealStyle[key] = styleValue;
        lastIdealVelocity[key] = 0;
      }
    }

    if (dirty) {
      this.setState({ currentStyle: currentStyle, currentVelocity: currentVelocity, lastIdealStyle: lastIdealStyle, lastIdealVelocity: lastIdealVelocity });
    }
  },

  startAnimationIfNecessary: function startAnimationIfNecessary() {
    var _this = this;

    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function () {
      // check if we need to animate in the first place
      var propsStyle = _this.props.style;
      if (_shouldStopAnimation2['default'](_this.state.currentStyle, propsStyle, _this.state.currentVelocity)) {
        if (_this.wasAnimating && _this.props.onRest) {
          _this.props.onRest();
        }

        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.wasAnimating = false;
        _this.accumulatedTime = 0;
        return;
      }

      _this.wasAnimating = true;

      var currentTime = _performanceNow2['default']();
      var timeDelta = currentTime - _this.prevTime;
      _this.prevTime = currentTime;
      _this.accumulatedTime = _this.accumulatedTime + timeDelta;
      // more than 10 frames? prolly switched browser tab. Restart
      if (_this.accumulatedTime > msPerFrame * 10) {
        _this.accumulatedTime = 0;
      }

      if (_this.accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.startAnimationIfNecessary();
        return;
      }

      var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
      var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

      var newLastIdealStyle = {};
      var newLastIdealVelocity = {};
      var newCurrentStyle = {};
      var newCurrentVelocity = {};

      for (var key in propsStyle) {
        if (!propsStyle.hasOwnProperty(key)) {
          continue;
        }

        var styleValue = propsStyle[key];
        if (typeof styleValue === 'number') {
          newCurrentStyle[key] = styleValue;
          newCurrentVelocity[key] = 0;
          newLastIdealStyle[key] = styleValue;
          newLastIdealVelocity[key] = 0;
        } else {
          var newLastIdealStyleValue = _this.state.lastIdealStyle[key];
          var newLastIdealVelocityValue = _this.state.lastIdealVelocity[key];
          for (var i = 0; i < framesToCatchUp; i++) {
            var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            newLastIdealStyleValue = _stepper[0];
            newLastIdealVelocityValue = _stepper[1];
          }

          var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

          var nextIdealX = _stepper2[0];
          var nextIdealV = _stepper2[1];

          newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
          newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
          newLastIdealStyle[key] = newLastIdealStyleValue;
          newLastIdealVelocity[key] = newLastIdealVelocityValue;
        }
      }

      _this.animationID = null;
      // the amount we're looped over above
      _this.accumulatedTime -= framesToCatchUp * msPerFrame;

      _this.setState({
        currentStyle: newCurrentStyle,
        currentVelocity: newCurrentVelocity,
        lastIdealStyle: newLastIdealStyle,
        lastIdealVelocity: newLastIdealVelocity
      });

      _this.unreadPropStyle = null;

      _this.startAnimationIfNecessary();
    });
  },

  componentDidMount: function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.unreadPropStyle != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyle);
    }

    this.unreadPropStyle = props.style;
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  },

  render: function render() {
    var renderedChildren = this.props.children(this.state.currentStyle);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  }
});

exports['default'] = Motion;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapToZero":27,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],25:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var msPerFrame = 1000 / 60;

function shouldStopAnimationAll(currentStyles, styles, currentVelocities) {
  for (var i = 0; i < currentStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], styles[i], currentVelocities[i])) {
      return false;
    }
  }
  return true;
}

var StaggeredMotion = _react2['default'].createClass({
  displayName: 'StaggeredMotion',

  propTypes: {
    // TOOD: warn against putting a config in here
    defaultStyles: _react.PropTypes.arrayOf(_react.PropTypes.objectOf(_react.PropTypes.number)),
    styles: _react.PropTypes.func.isRequired,
    children: _react.PropTypes.func.isRequired
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;

    var currentStyles = defaultStyles || styles().map(_stripStyle2['default']);
    var currentVelocities = currentStyles.map(function (currentStyle) {
      return _mapToZero2['default'](currentStyle);
    });
    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: currentStyles,
      lastIdealVelocities: currentVelocities
    };
  },

  animationID: null,
  prevTime: 0,
  accumulatedTime: 0,
  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400
  unreadPropStyles: null,
  // after checking for unreadPropStyles != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)
  clearUnreadPropStyle: function clearUnreadPropStyle(unreadPropStyles) {
    var _state = this.state;
    var currentStyles = _state.currentStyles;
    var currentVelocities = _state.currentVelocities;
    var lastIdealStyles = _state.lastIdealStyles;
    var lastIdealVelocities = _state.lastIdealVelocities;

    var someDirty = false;
    for (var i = 0; i < unreadPropStyles.length; i++) {
      var unreadPropStyle = unreadPropStyles[i];
      var dirty = false;

      for (var key in unreadPropStyle) {
        if (!unreadPropStyle.hasOwnProperty(key)) {
          continue;
        }

        var styleValue = unreadPropStyle[key];
        if (typeof styleValue === 'number') {
          if (!dirty) {
            dirty = true;
            someDirty = true;
            currentStyles[i] = _extends({}, currentStyles[i]);
            currentVelocities[i] = _extends({}, currentVelocities[i]);
            lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
            lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
          }
          currentStyles[i][key] = styleValue;
          currentVelocities[i][key] = 0;
          lastIdealStyles[i][key] = styleValue;
          lastIdealVelocities[i][key] = 0;
        }
      }
    }

    if (someDirty) {
      this.setState({ currentStyles: currentStyles, currentVelocities: currentVelocities, lastIdealStyles: lastIdealStyles, lastIdealVelocities: lastIdealVelocities });
    }
  },

  startAnimationIfNecessary: function startAnimationIfNecessary() {
    var _this = this;

    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function () {
      var destStyles = _this.props.styles(_this.state.lastIdealStyles);

      // check if we need to animate in the first place
      if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities)) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.accumulatedTime = 0;
        return;
      }

      var currentTime = _performanceNow2['default']();
      var timeDelta = currentTime - _this.prevTime;
      _this.prevTime = currentTime;
      _this.accumulatedTime = _this.accumulatedTime + timeDelta;
      // more than 10 frames? prolly switched browser tab. Restart
      if (_this.accumulatedTime > msPerFrame * 10) {
        _this.accumulatedTime = 0;
      }

      if (_this.accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.startAnimationIfNecessary();
        return;
      }

      var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
      var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

      var newLastIdealStyles = [];
      var newLastIdealVelocities = [];
      var newCurrentStyles = [];
      var newCurrentVelocities = [];

      for (var i = 0; i < destStyles.length; i++) {
        var destStyle = destStyles[i];
        var newCurrentStyle = {};
        var newCurrentVelocity = {};
        var newLastIdealStyle = {};
        var newLastIdealVelocity = {};

        for (var key in destStyle) {
          if (!destStyle.hasOwnProperty(key)) {
            continue;
          }

          var styleValue = destStyle[key];
          if (typeof styleValue === 'number') {
            newCurrentStyle[key] = styleValue;
            newCurrentVelocity[key] = 0;
            newLastIdealStyle[key] = styleValue;
            newLastIdealVelocity[key] = 0;
          } else {
            var newLastIdealStyleValue = _this.state.lastIdealStyles[i][key];
            var newLastIdealVelocityValue = _this.state.lastIdealVelocities[i][key];
            for (var j = 0; j < framesToCatchUp; j++) {
              var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              newLastIdealStyleValue = _stepper[0];
              newLastIdealVelocityValue = _stepper[1];
            }

            var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            var nextIdealX = _stepper2[0];
            var nextIdealV = _stepper2[1];

            newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
            newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
            newLastIdealStyle[key] = newLastIdealStyleValue;
            newLastIdealVelocity[key] = newLastIdealVelocityValue;
          }
        }

        newCurrentStyles[i] = newCurrentStyle;
        newCurrentVelocities[i] = newCurrentVelocity;
        newLastIdealStyles[i] = newLastIdealStyle;
        newLastIdealVelocities[i] = newLastIdealVelocity;
      }

      _this.animationID = null;
      // the amount we're looped over above
      _this.accumulatedTime -= framesToCatchUp * msPerFrame;

      _this.setState({
        currentStyles: newCurrentStyles,
        currentVelocities: newCurrentVelocities,
        lastIdealStyles: newLastIdealStyles,
        lastIdealVelocities: newLastIdealVelocities
      });

      _this.unreadPropStyles = null;

      _this.startAnimationIfNecessary();
    });
  },

  componentDidMount: function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.unreadPropStyles != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    this.unreadPropStyles = props.styles(this.state.lastIdealStyles);
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  },

  render: function render() {
    var renderedChildren = this.props.children(this.state.currentStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  }
});

exports['default'] = StaggeredMotion;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapToZero":27,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],26:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _mergeDiff = require('./mergeDiff');

var _mergeDiff2 = _interopRequireDefault(_mergeDiff);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var msPerFrame = 1000 / 60;

// the children function & (potential) styles function asks as param an
// Array<TransitionPlainStyle>, where each TransitionPlainStyle is of the format
// {key: string, data?: any, style: PlainStyle}. However, the way we keep
// internal states doesn't contain such a data structure (check the state and
// TransitionMotionState). So when children function and others ask for such
// data we need to generate them on the fly by combining mergedPropsStyles and
// currentStyles/lastIdealStyles
function rehydrateStyles(mergedPropsStyles, unreadPropStyles, plainStyles) {
  if (unreadPropStyles == null) {
    // $FlowFixMe
    return mergedPropsStyles.map(function (mergedPropsStyle, i) {
      return {
        key: mergedPropsStyle.key,
        data: mergedPropsStyle.data,
        style: plainStyles[i]
      };
    });
  }
  return mergedPropsStyles.map(function (mergedPropsStyle, i) {
    // $FlowFixMe
    for (var j = 0; j < unreadPropStyles.length; j++) {
      // $FlowFixMe
      if (unreadPropStyles[j].key === mergedPropsStyle.key) {
        return {
          // $FlowFixMe
          key: unreadPropStyles[j].key,
          data: unreadPropStyles[j].data,
          style: plainStyles[i]
        };
      }
    }
    // $FlowFixMe
    return { key: mergedPropsStyle.key, data: mergedPropsStyle.data, style: plainStyles[i] };
  });
}

function shouldStopAnimationAll(currentStyles, destStyles, currentVelocities, mergedPropsStyles) {
  if (mergedPropsStyles.length !== destStyles.length) {
    return false;
  }

  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (mergedPropsStyles[i].key !== destStyles[i].key) {
      return false;
    }
  }

  // we have the invariant that mergedPropsStyles and
  // currentStyles/currentVelocities/last* are synced in terms of cells, see
  // mergeAndSync comment for more info
  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], destStyles[i].style, currentVelocities[i])) {
      return false;
    }
  }

  return true;
}

// core key merging logic

// things to do: say previously merged style is {a, b}, dest style (prop) is {b,
// c}, previous current (interpolating) style is {a, b}
// **invariant**: current[i] corresponds to merged[i] in terms of key

// steps:
// turn merged style into {a?, b, c}
//    add c, value of c is destStyles.c
//    maybe remove a, aka call willLeave(a), then merged is either {b, c} or {a, b, c}
// turn current (interpolating) style from {a, b} into {a?, b, c}
//    maybe remove a
//    certainly add c, value of c is willEnter(c)
// loop over merged and construct new current
// dest doesn't change, that's owner's
function mergeAndSync(willEnter, willLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldLastIdealStyles, oldLastIdealVelocities) {
  var newMergedPropsStyles = _mergeDiff2['default'](oldMergedPropsStyles, destStyles, function (oldIndex, oldMergedPropsStyle) {
    var leavingStyle = willLeave(oldMergedPropsStyle);
    if (leavingStyle == null) {
      return null;
    }
    if (_shouldStopAnimation2['default'](oldCurrentStyles[oldIndex], leavingStyle, oldCurrentVelocities[oldIndex])) {
      return null;
    }
    return { key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data, style: leavingStyle };
  });

  var newCurrentStyles = [];
  var newCurrentVelocities = [];
  var newLastIdealStyles = [];
  var newLastIdealVelocities = [];
  for (var i = 0; i < newMergedPropsStyles.length; i++) {
    var newMergedPropsStyleCell = newMergedPropsStyles[i];
    var foundOldIndex = null;
    for (var j = 0; j < oldMergedPropsStyles.length; j++) {
      if (oldMergedPropsStyles[j].key === newMergedPropsStyleCell.key) {
        foundOldIndex = j;
        break;
      }
    }
    // TODO: key search code
    if (foundOldIndex == null) {
      var plainStyle = willEnter(newMergedPropsStyleCell);
      newCurrentStyles[i] = plainStyle;
      newLastIdealStyles[i] = plainStyle;

      // $FlowFixMe
      var velocity = _mapToZero2['default'](newMergedPropsStyleCell.style);
      newCurrentVelocities[i] = velocity;
      newLastIdealVelocities[i] = velocity;
    } else {
      newCurrentStyles[i] = oldCurrentStyles[foundOldIndex];
      newLastIdealStyles[i] = oldLastIdealStyles[foundOldIndex];
      newCurrentVelocities[i] = oldCurrentVelocities[foundOldIndex];
      newLastIdealVelocities[i] = oldLastIdealVelocities[foundOldIndex];
    }
  }

  return [newMergedPropsStyles, newCurrentStyles, newCurrentVelocities, newLastIdealStyles, newLastIdealVelocities];
}

var TransitionMotion = _react2['default'].createClass({
  displayName: 'TransitionMotion',

  propTypes: {
    defaultStyles: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      key: _react.PropTypes.string.isRequired,
      data: _react.PropTypes.any,
      style: _react.PropTypes.objectOf(_react.PropTypes.number).isRequired
    })),
    styles: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.arrayOf(_react.PropTypes.shape({
      key: _react.PropTypes.string.isRequired,
      data: _react.PropTypes.any,
      style: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object])).isRequired
    }))]).isRequired,
    children: _react.PropTypes.func.isRequired,
    willLeave: _react.PropTypes.func,
    willEnter: _react.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      willEnter: function willEnter(styleThatEntered) {
        return _stripStyle2['default'](styleThatEntered.style);
      },
      // recall: returning null makes the current unmounting TransitionStyle
      // disappear immediately
      willLeave: function willLeave() {
        return null;
      }
    };
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;
    var willEnter = _props.willEnter;
    var willLeave = _props.willLeave;

    var destStyles = typeof styles === 'function' ? styles(defaultStyles) : styles;

    // this is special. for the first time around, we don't have a comparison
    // between last (no last) and current merged props. we'll compute last so:
    // say default is {a, b} and styles (dest style) is {b, c}, we'll
    // fabricate last as {a, b}
    var oldMergedPropsStyles = undefined;
    if (defaultStyles == null) {
      oldMergedPropsStyles = destStyles;
    } else {
      // $FlowFixMe
      oldMergedPropsStyles = defaultStyles.map(function (defaultStyleCell) {
        // TODO: key search code
        for (var i = 0; i < destStyles.length; i++) {
          if (destStyles[i].key === defaultStyleCell.key) {
            return destStyles[i];
          }
        }
        return defaultStyleCell;
      });
    }
    var oldCurrentStyles = defaultStyles == null ? destStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    });
    var oldCurrentVelocities = defaultStyles == null ? destStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    });

    var _mergeAndSync = mergeAndSync(
    // $FlowFixMe
    willEnter,
    // $FlowFixMe
    willLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldCurrentStyles, // oldLastIdealStyles really
    oldCurrentVelocities);

    var mergedPropsStyles = _mergeAndSync[0];
    var currentStyles = _mergeAndSync[1];
    var currentVelocities = _mergeAndSync[2];
    var lastIdealStyles = _mergeAndSync[3];
    var lastIdealVelocities = _mergeAndSync[4];
    // oldLastIdealVelocities really

    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: lastIdealStyles,
      lastIdealVelocities: lastIdealVelocities,
      mergedPropsStyles: mergedPropsStyles
    };
  },

  animationID: null,
  prevTime: 0,
  accumulatedTime: 0,
  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400
  unreadPropStyles: null,
  // after checking for unreadPropStyles != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)
  clearUnreadPropStyle: function clearUnreadPropStyle(unreadPropStyles) {
    var _mergeAndSync2 = mergeAndSync(
    // $FlowFixMe
    this.props.willEnter,
    // $FlowFixMe
    this.props.willLeave, this.state.mergedPropsStyles, unreadPropStyles, this.state.currentStyles, this.state.currentVelocities, this.state.lastIdealStyles, this.state.lastIdealVelocities);

    var mergedPropsStyles = _mergeAndSync2[0];
    var currentStyles = _mergeAndSync2[1];
    var currentVelocities = _mergeAndSync2[2];
    var lastIdealStyles = _mergeAndSync2[3];
    var lastIdealVelocities = _mergeAndSync2[4];

    for (var i = 0; i < unreadPropStyles.length; i++) {
      var unreadPropStyle = unreadPropStyles[i].style;
      var dirty = false;

      for (var key in unreadPropStyle) {
        if (!unreadPropStyle.hasOwnProperty(key)) {
          continue;
        }

        var styleValue = unreadPropStyle[key];
        if (typeof styleValue === 'number') {
          if (!dirty) {
            dirty = true;
            currentStyles[i] = _extends({}, currentStyles[i]);
            currentVelocities[i] = _extends({}, currentVelocities[i]);
            lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
            lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
            mergedPropsStyles[i] = {
              key: mergedPropsStyles[i].key,
              data: mergedPropsStyles[i].data,
              style: _extends({}, mergedPropsStyles[i].style)
            };
          }
          currentStyles[i][key] = styleValue;
          currentVelocities[i][key] = 0;
          lastIdealStyles[i][key] = styleValue;
          lastIdealVelocities[i][key] = 0;
          mergedPropsStyles[i].style[key] = styleValue;
        }
      }
    }

    // unlike the other 2 components, we can't detect staleness and optionally
    // opt out of setState here. each style object's data might contain new
    // stuff we're not/cannot compare
    this.setState({
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      mergedPropsStyles: mergedPropsStyles,
      lastIdealStyles: lastIdealStyles,
      lastIdealVelocities: lastIdealVelocities
    });
  },

  startAnimationIfNecessary: function startAnimationIfNecessary() {
    var _this = this;

    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function () {
      var propStyles = _this.props.styles;
      var destStyles = typeof propStyles === 'function' ? propStyles(rehydrateStyles(_this.state.mergedPropsStyles, _this.unreadPropStyles, _this.state.lastIdealStyles)) : propStyles;

      // check if we need to animate in the first place
      if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities, _this.state.mergedPropsStyles)) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.accumulatedTime = 0;
        return;
      }

      var currentTime = _performanceNow2['default']();
      var timeDelta = currentTime - _this.prevTime;
      _this.prevTime = currentTime;
      _this.accumulatedTime = _this.accumulatedTime + timeDelta;
      // more than 10 frames? prolly switched browser tab. Restart
      if (_this.accumulatedTime > msPerFrame * 10) {
        _this.accumulatedTime = 0;
      }

      if (_this.accumulatedTime === 0) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.startAnimationIfNecessary();
        return;
      }

      var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
      var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

      var _mergeAndSync3 = mergeAndSync(
      // $FlowFixMe
      _this.props.willEnter,
      // $FlowFixMe
      _this.props.willLeave, _this.state.mergedPropsStyles, destStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

      var newMergedPropsStyles = _mergeAndSync3[0];
      var newCurrentStyles = _mergeAndSync3[1];
      var newCurrentVelocities = _mergeAndSync3[2];
      var newLastIdealStyles = _mergeAndSync3[3];
      var newLastIdealVelocities = _mergeAndSync3[4];

      for (var i = 0; i < newMergedPropsStyles.length; i++) {
        var newMergedPropsStyle = newMergedPropsStyles[i].style;
        var newCurrentStyle = {};
        var newCurrentVelocity = {};
        var newLastIdealStyle = {};
        var newLastIdealVelocity = {};

        for (var key in newMergedPropsStyle) {
          if (!newMergedPropsStyle.hasOwnProperty(key)) {
            continue;
          }

          var styleValue = newMergedPropsStyle[key];
          if (typeof styleValue === 'number') {
            newCurrentStyle[key] = styleValue;
            newCurrentVelocity[key] = 0;
            newLastIdealStyle[key] = styleValue;
            newLastIdealVelocity[key] = 0;
          } else {
            var newLastIdealStyleValue = newLastIdealStyles[i][key];
            var newLastIdealVelocityValue = newLastIdealVelocities[i][key];
            for (var j = 0; j < framesToCatchUp; j++) {
              var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              newLastIdealStyleValue = _stepper[0];
              newLastIdealVelocityValue = _stepper[1];
            }

            var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            var nextIdealX = _stepper2[0];
            var nextIdealV = _stepper2[1];

            newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
            newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
            newLastIdealStyle[key] = newLastIdealStyleValue;
            newLastIdealVelocity[key] = newLastIdealVelocityValue;
          }
        }

        newLastIdealStyles[i] = newLastIdealStyle;
        newLastIdealVelocities[i] = newLastIdealVelocity;
        newCurrentStyles[i] = newCurrentStyle;
        newCurrentVelocities[i] = newCurrentVelocity;
      }

      _this.animationID = null;
      // the amount we're looped over above
      _this.accumulatedTime -= framesToCatchUp * msPerFrame;

      _this.setState({
        currentStyles: newCurrentStyles,
        currentVelocities: newCurrentVelocities,
        lastIdealStyles: newLastIdealStyles,
        lastIdealVelocities: newLastIdealVelocities,
        mergedPropsStyles: newMergedPropsStyles
      });

      _this.unreadPropStyles = null;

      _this.startAnimationIfNecessary();
    });
  },

  componentDidMount: function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (this.unreadPropStyles) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    if (typeof props.styles === 'function') {
      // $FlowFixMe
      this.unreadPropStyles = props.styles(rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.lastIdealStyles));
    } else {
      this.unreadPropStyles = props.styles;
    }

    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  },

  render: function render() {
    var hydratedStyles = rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.currentStyles);
    var renderedChildren = this.props.children(hydratedStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  }
});

exports['default'] = TransitionMotion;
module.exports = exports['default'];

// list of styles, each containing interpolating values. Part of what's passed
// to children function. Notice that this is
// Array<ActualInterpolatingStyleObject>, without the wrapper that is {key: ...,
// data: ... style: ActualInterpolatingStyleObject}. Only mergedPropsStyles
// contains the key & data info (so that we only have a single source of truth
// for these, and to save space). Check the comment for `rehydrateStyles` to
// see how we regenerate the entirety of what's passed to children function

// the array that keeps track of currently rendered stuff! Including stuff
// that you've unmounted but that's still animating. This is where it lives
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapToZero":27,"./mergeDiff":28,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],27:[function(require,module,exports){


// currently used to initiate the velocity style object to 0
'use strict';

exports.__esModule = true;
exports['default'] = mapToZero;

function mapToZero(obj) {
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = 0;
    }
  }
  return ret;
}

module.exports = exports['default'];
},{}],28:[function(require,module,exports){


// core keys merging algorithm. If previous render's keys are [a, b], and the
// next render's [c, b, d], what's the final merged keys and ordering?

// - c and a must both be before b
// - b before d
// - ordering between a and c ambiguous

// this reduces to merging two partially ordered lists (e.g. lists where not
// every item has a definite ordering, like comparing a and c above). For the
// ambiguous ordering we deterministically choose to place the next render's
// item after the previous'; so c after a

// this is called a topological sorting. Except the existing algorithms don't
// work well with js bc of the amount of allocation, and isn't optimized for our
// current use-case bc the runtime is linear in terms of edges (see wiki for
// meaning), which is huge when two lists have many common elements
'use strict';

exports.__esModule = true;
exports['default'] = mergeDiff;

function mergeDiff(prev, next, onRemove) {
  // bookkeeping for easier access of a key's index below. This is 2 allocations +
  // potentially triggering chrome hash map mode for objs (so it might be faster

  var prevKeyIndex = {};
  for (var i = 0; i < prev.length; i++) {
    prevKeyIndex[prev[i].key] = i;
  }
  var nextKeyIndex = {};
  for (var i = 0; i < next.length; i++) {
    nextKeyIndex[next[i].key] = i;
  }

  // first, an overly elaborate way of merging prev and next, eliminating
  // duplicates (in terms of keys). If there's dupe, keep the item in next).
  // This way of writing it saves allocations
  var ret = [];
  for (var i = 0; i < next.length; i++) {
    ret[i] = next[i];
  }
  for (var i = 0; i < prev.length; i++) {
    if (!nextKeyIndex.hasOwnProperty(prev[i].key)) {
      // this is called my TM's `mergeAndSync`, which calls willLeave. We don't
      // merge in keys that the user desires to kill
      var fill = onRemove(i, prev[i]);
      if (fill != null) {
        ret.push(fill);
      }
    }
  }

  // now all the items all present. Core sorting logic to have the right order
  return ret.sort(function (a, b) {
    var nextOrderA = nextKeyIndex[a.key];
    var nextOrderB = nextKeyIndex[b.key];
    var prevOrderA = prevKeyIndex[a.key];
    var prevOrderB = prevKeyIndex[b.key];

    if (nextOrderA != null && nextOrderB != null) {
      // both keys in next
      return nextKeyIndex[a.key] - nextKeyIndex[b.key];
    } else if (prevOrderA != null && prevOrderB != null) {
      // both keys in prev
      return prevKeyIndex[a.key] - prevKeyIndex[b.key];
    } else if (nextOrderA != null) {
      // key a in next, key b in prev

      // how to determine the order between a and b? We find a "pivot" (term
      // abuse), a key present in both prev and next, that is sandwiched between
      // a and b. In the context of our above example, if we're comparing a and
      // d, b's (the only) pivot
      for (var i = 0; i < next.length; i++) {
        var pivot = next[i].key;
        if (!prevKeyIndex.hasOwnProperty(pivot)) {
          continue;
        }

        if (nextOrderA < nextKeyIndex[pivot] && prevOrderB > prevKeyIndex[pivot]) {
          return -1;
        } else if (nextOrderA > nextKeyIndex[pivot] && prevOrderB < prevKeyIndex[pivot]) {
          return 1;
        }
      }
      // pluggable. default to: next bigger than prev
      return 1;
    }
    // prevOrderA, nextOrderB
    for (var i = 0; i < next.length; i++) {
      var pivot = next[i].key;
      if (!prevKeyIndex.hasOwnProperty(pivot)) {
        continue;
      }
      if (nextOrderB < nextKeyIndex[pivot] && prevOrderA > prevKeyIndex[pivot]) {
        return 1;
      } else if (nextOrderB > nextKeyIndex[pivot] && prevOrderA < prevKeyIndex[pivot]) {
        return -1;
      }
    }
    // pluggable. default to: next bigger than prev
    return -1;
  });
}

module.exports = exports['default'];
// to loop through and find a key's index each time), but I no longer care
},{}],29:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = {
  noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 }
};
module.exports = exports["default"];
},{}],30:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _Motion = require('./Motion');

exports.Motion = _interopRequire(_Motion);

var _StaggeredMotion = require('./StaggeredMotion');

exports.StaggeredMotion = _interopRequire(_StaggeredMotion);

var _TransitionMotion = require('./TransitionMotion');

exports.TransitionMotion = _interopRequire(_TransitionMotion);

var _spring = require('./spring');

exports.spring = _interopRequire(_spring);

var _presets = require('./presets');

exports.presets = _interopRequire(_presets);

// deprecated, dummy warning function

var _reorderKeys = require('./reorderKeys');

exports.reorderKeys = _interopRequire(_reorderKeys);
},{"./Motion":24,"./StaggeredMotion":25,"./TransitionMotion":26,"./presets":29,"./reorderKeys":31,"./spring":33}],31:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = reorderKeys;

var hasWarned = false;

function reorderKeys() {
  if (process.env.NODE_ENV === 'development') {
    if (!hasWarned) {
      hasWarned = true;
      console.error('`reorderKeys` has been removed, since it is no longer needed for TransitionMotion\'s new styles array API.');
    }
  }
}

module.exports = exports['default'];
}).call(this,require('_process'))

},{"_process":22}],32:[function(require,module,exports){


// usage assumption: currentStyle values have already been rendered but it says
// nothing of whether currentStyle is stale (see unreadPropStyle)
'use strict';

exports.__esModule = true;
exports['default'] = shouldStopAnimation;

function shouldStopAnimation(currentStyle, style, currentVelocity) {
  for (var key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }

    if (currentVelocity[key] !== 0) {
      return false;
    }

    var styleValue = typeof style[key] === 'number' ? style[key] : style[key].val;
    // stepper will have already taken care of rounding precision errors, so
    // won't have such thing as 0.9999 !=== 1
    if (currentStyle[key] !== styleValue) {
      return false;
    }
  }

  return true;
}

module.exports = exports['default'];
},{}],33:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = spring;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _presets = require('./presets');

var _presets2 = _interopRequireDefault(_presets);

var defaultConfig = _extends({}, _presets2['default'].noWobble, {
  precision: 0.01
});

function spring(val, config) {
  return _extends({}, defaultConfig, config, { val: val });
}

module.exports = exports['default'];
},{"./presets":29}],34:[function(require,module,exports){


// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
"use strict";

exports.__esModule = true;
exports["default"] = stepper;

var reusedTuple = [];

function stepper(secondPerFrame, x, v, destX, k, b, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  var Fspring = -k * (x - destX);

  // Damping, in kg / s
  var Fdamper = -b * v;

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  var a = Fspring + Fdamper;

  var newV = v + a * secondPerFrame;
  var newX = x + newV * secondPerFrame;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newX;
  reusedTuple[1] = newV;
  return reusedTuple;
}

module.exports = exports["default"];
// array reference around.
},{}],35:[function(require,module,exports){

// turn {x: {val: 1, stiffness: 1, damping: 2}, y: 2} generated by
// `{x: spring(1, {stiffness: 1, damping: 2}), y: 2}` into {x: 1, y: 2}

'use strict';

exports.__esModule = true;
exports['default'] = stripStyle;

function stripStyle(style) {
  var ret = {};
  for (var key in style) {
    if (!style.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = typeof style[key] === 'number' ? style[key] : style[key].val;
  }
  return ret;
}

module.exports = exports['default'];
},{}],36:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*eslint-disable react/prop-types */


var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

var _elementType = require('react-prop-types/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _ModalManager = require('./ModalManager');

var _ModalManager2 = _interopRequireDefault(_ModalManager);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _addEventListener = require('./utils/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _addFocusListener = require('./utils/addFocusListener');

var _addFocusListener2 = _interopRequireDefault(_addFocusListener);

var _inDOM = require('dom-helpers/util/inDOM');

var _inDOM2 = _interopRequireDefault(_inDOM);

var _activeElement = require('dom-helpers/activeElement');

var _activeElement2 = _interopRequireDefault(_activeElement);

var _contains = require('dom-helpers/query/contains');

var _contains2 = _interopRequireDefault(_contains);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modalManager = new _ModalManager2.default();

/**
 * Love them or hate them, `<Modal/>` provides a solid foundation for creating dialogs, lightboxes, or whatever else.
 * The Modal component renders its `children` node in front of a backdrop component.
 *
 * The Modal offers a few helpful features over using just a `<Portal/>` component and some styles:
 *
 * - Manages dialog stacking when one-at-a-time just isn't enough.
 * - Creates a backdrop, for disabling interaction below the modal.
 * - It properly manages focus; moving to the modal content, and keeping it there until the modal is closed.
 * - It disables scrolling of the page content while open.
 * - Adds the appropriate ARIA roles are automatically.
 * - Easily pluggable animations via a `<Transition/>` component.
 *
 * Note that, in the same way the backdrop element prevents users from clicking or interacting
 * with the page content underneath the Modal, Screen readers also need to be signaled to not to
 * interact with page content while the Modal is open. To do this, we use a common technique of applying
 * the `aria-hidden='true'` attribute to the non-Modal elements in the Modal `container`. This means that for
 * a Modal to be truly modal, it should have a `container` that is _outside_ your app's
 * React hierarchy (such as the default: document.body).
 */
var Modal = _react2.default.createClass({
  displayName: 'Modal',


  propTypes: _extends({}, _Portal2.default.propTypes, {

    /**
     * Set the visibility of the Modal
     */
    show: _react2.default.PropTypes.bool,

    /**
     * A Node, Component instance, or function that returns either. The Modal is appended to it's container element.
     *
     * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
     * page content can be placed behind a virtual backdrop as well as a visual one.
     */
    container: _react2.default.PropTypes.oneOfType([_componentOrElement2.default, _react2.default.PropTypes.func]),

    /**
     * A callback fired when the Modal is opening.
     */
    onShow: _react2.default.PropTypes.func,

    /**
     * A callback fired when either the backdrop is clicked, or the escape key is pressed.
     *
     * The `onHide` callback only signals intent from the Modal,
     * you must actually set the `show` prop to `false` for the Modal to close.
     */
    onHide: _react2.default.PropTypes.func,

    /**
     * Include a backdrop component.
     */
    backdrop: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.oneOf(['static'])]),

    /**
     * A callback fired when the escape key, if specified in `keyboard`, is pressed.
     */
    onEscapeKeyUp: _react2.default.PropTypes.func,

    /**
     * A callback fired when the backdrop, if specified, is clicked.
     */
    onBackdropClick: _react2.default.PropTypes.func,

    /**
     * A style object for the backdrop component.
     */
    backdropStyle: _react2.default.PropTypes.object,

    /**
     * A css class or classes for the backdrop component.
     */
    backdropClassName: _react2.default.PropTypes.string,

    /**
     * A css class or set of classes applied to the modal container when the modal is open,
     * and removed when it is closed.
     */
    containerClassName: _react2.default.PropTypes.string,

    /**
     * Close the modal when escape key is pressed
     */
    keyboard: _react2.default.PropTypes.bool,

    /**
     * A `<Transition/>` component to use for the dialog and backdrop components.
     */
    transition: _elementType2.default,

    /**
     * The `timeout` of the dialog transition if specified. This number is used to ensure that
     * transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    dialogTransitionTimeout: _react2.default.PropTypes.number,

    /**
     * The `timeout` of the backdrop transition if specified. This number is used to
     * ensure that transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    backdropTransitionTimeout: _react2.default.PropTypes.number,

    /**
     * When `true` The modal will automatically shift focus to itself when it opens, and
     * replace it to the last focused element when it closes. This also
     * works correctly with any Modal children that have the `autoFocus` prop.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    autoFocus: _react2.default.PropTypes.bool,

    /**
     * When `true` The modal will prevent focus from leaving the Modal while open.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    enforceFocus: _react2.default.PropTypes.bool,

    /**
     * Callback fired before the Modal transitions in
     */
    onEnter: _react2.default.PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition in
     */
    onEntering: _react2.default.PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning in
     */
    onEntered: _react2.default.PropTypes.func,

    /**
     * Callback fired right before the Modal transitions out
     */
    onExit: _react2.default.PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition out
     */
    onExiting: _react2.default.PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning out
     */
    onExited: _react2.default.PropTypes.func

  }),

  getDefaultProps: function getDefaultProps() {
    var noop = function noop() {};

    return {
      show: false,
      backdrop: true,
      keyboard: true,
      autoFocus: true,
      enforceFocus: true,
      onHide: noop
    };
  },
  getInitialState: function getInitialState() {
    return { exited: !this.props.show };
  },
  render: function render() {
    var _props = this.props;
    var show = _props.show;
    var container = _props.container;
    var children = _props.children;
    var Transition = _props.transition;
    var backdrop = _props.backdrop;
    var dialogTransitionTimeout = _props.dialogTransitionTimeout;
    var className = _props.className;
    var style = _props.style;
    var onExit = _props.onExit;
    var onExiting = _props.onExiting;
    var onEnter = _props.onEnter;
    var onEntering = _props.onEntering;
    var onEntered = _props.onEntered;


    var dialog = _react2.default.Children.only(children);

    var mountModal = show || Transition && !this.state.exited;
    if (!mountModal) {
      return null;
    }

    var _dialog$props = dialog.props;
    var role = _dialog$props.role;
    var tabIndex = _dialog$props.tabIndex;


    if (role === undefined || tabIndex === undefined) {
      dialog = (0, _react.cloneElement)(dialog, {
        role: role === undefined ? 'document' : role,
        tabIndex: tabIndex == null ? '-1' : tabIndex
      });
    }

    if (Transition) {
      dialog = _react2.default.createElement(
        Transition,
        {
          transitionAppear: true,
          unmountOnExit: true,
          'in': show,
          timeout: dialogTransitionTimeout,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.handleHidden,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered
        },
        dialog
      );
    }

    return _react2.default.createElement(
      _Portal2.default,
      {
        ref: this.setMountNode,
        container: container
      },
      _react2.default.createElement(
        'div',
        {
          ref: 'modal',
          role: role || 'dialog',
          style: style,
          className: className
        },
        backdrop && this.renderBackdrop(),
        dialog
      )
    );
  },
  renderBackdrop: function renderBackdrop() {
    var _props2 = this.props;
    var Transition = _props2.transition;
    var backdropTransitionTimeout = _props2.backdropTransitionTimeout;


    var backdrop = _react2.default.createElement('div', { ref: 'backdrop',
      style: this.props.backdropStyle,
      className: this.props.backdropClassName,
      onClick: this.handleBackdropClick
    });

    if (Transition) {
      backdrop = _react2.default.createElement(
        Transition,
        { transitionAppear: true,
          'in': this.props.show,
          timeout: backdropTransitionTimeout
        },
        backdrop
      );
    }

    return backdrop;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  },
  componentWillUpdate: function componentWillUpdate(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.checkForFocus();
    }
  },
  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this.onShow();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    var transition = this.props.transition;


    if (prevProps.show && !this.props.show && !transition) {
      // Otherwise handleHidden will call this.
      this.onHide();
    } else if (!prevProps.show && this.props.show) {
      this.onShow();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    var _props3 = this.props;
    var show = _props3.show;
    var transition = _props3.transition;


    if (show || transition && !this.state.exited) {
      this.onHide();
    }
  },
  onShow: function onShow() {
    var doc = (0, _ownerDocument2.default)(this);
    var container = (0, _getContainer2.default)(this.props.container, doc.body);

    modalManager.add(this, container, this.props.containerClassName);

    this._onDocumentKeyupListener = (0, _addEventListener2.default)(doc, 'keyup', this.handleDocumentKeyUp);

    this._onFocusinListener = (0, _addFocusListener2.default)(this.enforceFocus);

    this.focus();

    if (this.props.onShow) {
      this.props.onShow();
    }
  },
  onHide: function onHide() {
    modalManager.remove(this);

    this._onDocumentKeyupListener.remove();

    this._onFocusinListener.remove();

    this.restoreLastFocus();
  },
  setMountNode: function setMountNode(ref) {
    this.mountNode = ref ? ref.getMountNode() : ref;
  },
  handleHidden: function handleHidden() {
    this.setState({ exited: true });
    this.onHide();

    if (this.props.onExited) {
      var _props4;

      (_props4 = this.props).onExited.apply(_props4, arguments);
    }
  },
  handleBackdropClick: function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (this.props.onBackdropClick) {
      this.props.onBackdropClick(e);
    }

    if (this.props.backdrop === true) {
      this.props.onHide();
    }
  },
  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
    if (this.props.keyboard && e.keyCode === 27 && this.isTopModal()) {
      if (this.props.onEscapeKeyUp) {
        this.props.onEscapeKeyUp(e);
      }
      this.props.onHide();
    }
  },
  checkForFocus: function checkForFocus() {
    if (_inDOM2.default) {
      this.lastFocus = (0, _activeElement2.default)();
    }
  },
  focus: function focus() {
    var autoFocus = this.props.autoFocus;
    var modalContent = this.getDialogElement();
    var current = (0, _activeElement2.default)((0, _ownerDocument2.default)(this));
    var focusInModal = current && (0, _contains2.default)(modalContent, current);

    if (modalContent && autoFocus && !focusInModal) {
      this.lastFocus = current;

      if (!modalContent.hasAttribute('tabIndex')) {
        modalContent.setAttribute('tabIndex', -1);
        (0, _warning2.default)(false, 'The modal content node does not accept focus. ' + 'For the benefit of assistive technologies, the tabIndex of the node is being set to "-1".');
      }

      modalContent.focus();
    }
  },
  restoreLastFocus: function restoreLastFocus() {
    // Support: <=IE11 doesn't support `focus()` on svg elements (RB: #917)
    if (this.lastFocus && this.lastFocus.focus) {
      this.lastFocus.focus();
      this.lastFocus = null;
    }
  },
  enforceFocus: function enforceFocus() {
    var enforceFocus = this.props.enforceFocus;


    if (!enforceFocus || !this.isMounted() || !this.isTopModal()) {
      return;
    }

    var active = (0, _activeElement2.default)((0, _ownerDocument2.default)(this));
    var modal = this.getDialogElement();

    if (modal && modal !== active && !(0, _contains2.default)(modal, active)) {
      modal.focus();
    }
  },


  //instead of a ref, which might conflict with one the parent applied.
  getDialogElement: function getDialogElement() {
    var node = this.refs.modal;
    return node && node.lastChild;
  },
  isTopModal: function isTopModal() {
    return modalManager.isTopModal(this);
  }
});

Modal.manager = modalManager;

exports.default = Modal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ModalManager":37,"./Portal":38,"./utils/addEventListener":39,"./utils/addFocusListener":40,"./utils/getContainer":41,"./utils/ownerDocument":44,"dom-helpers/activeElement":1,"dom-helpers/query/contains":9,"dom-helpers/util/inDOM":19,"react-prop-types/lib/componentOrElement":45,"react-prop-types/lib/elementType":46,"warning":49}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _style = require('dom-helpers/style');

var _style2 = _interopRequireDefault(_style);

var _class = require('dom-helpers/class');

var _class2 = _interopRequireDefault(_class);

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _isOverflowing = require('./utils/isOverflowing');

var _isOverflowing2 = _interopRequireDefault(_isOverflowing);

var _manageAriaHidden = require('./utils/manageAriaHidden');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function findIndexOf(arr, cb) {
  var idx = -1;
  arr.some(function (d, i) {
    if (cb(d, i)) {
      idx = i;
      return true;
    }
  });
  return idx;
}

function findContainer(data, modal) {
  return findIndexOf(data, function (d) {
    return d.modals.indexOf(modal) !== -1;
  });
}

/**
 * Proper state managment for containers and the modals in those containers.
 *
 * @internal Used by the Modal to ensure proper styling of containers.
 */

var ModalManager = function () {
  function ModalManager() {
    var hideSiblingNodes = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    _classCallCheck(this, ModalManager);

    this.hideSiblingNodes = hideSiblingNodes;
    this.modals = [];
    this.containers = [];
    this.data = [];
  }

  _createClass(ModalManager, [{
    key: 'add',
    value: function add(modal, container, className) {
      var modalIdx = this.modals.indexOf(modal);
      var containerIdx = this.containers.indexOf(container);

      if (modalIdx !== -1) {
        return modalIdx;
      }

      modalIdx = this.modals.length;
      this.modals.push(modal);

      if (this.hideSiblingNodes) {
        (0, _manageAriaHidden.hideSiblings)(container, modal.mountNode);
      }

      if (containerIdx !== -1) {
        this.data[containerIdx].modals.push(modal);
        return modalIdx;
      }

      var data = {
        modals: [modal],
        //right now only the first modal of a container will have its classes applied
        classes: className ? className.split(/\s+/) : [],
        //we are only interested in the actual `style` here becasue we will override it
        style: {
          overflow: container.style.overflow,
          paddingRight: container.style.paddingRight
        }
      };

      var style = { overflow: 'hidden' };

      data.overflowing = (0, _isOverflowing2.default)(container);

      if (data.overflowing) {
        // use computed style, here to get the real padding
        // to add our scrollbar width
        style.paddingRight = parseInt((0, _style2.default)(container, 'paddingRight') || 0, 10) + (0, _scrollbarSize2.default)() + 'px';
      }

      (0, _style2.default)(container, style);

      data.classes.forEach(_class2.default.addClass.bind(null, container));

      this.containers.push(container);
      this.data.push(data);

      return modalIdx;
    }
  }, {
    key: 'remove',
    value: function remove(modal) {
      var modalIdx = this.modals.indexOf(modal);

      if (modalIdx === -1) {
        return;
      }

      var containerIdx = findContainer(this.data, modal);
      var data = this.data[containerIdx];
      var container = this.containers[containerIdx];

      data.modals.splice(data.modals.indexOf(modal), 1);

      this.modals.splice(modalIdx, 1);

      // if that was the last modal in a container,
      // clean up the container stylinhg.
      if (data.modals.length === 0) {
        Object.keys(data.style).forEach(function (key) {
          return container.style[key] = data.style[key];
        });

        data.classes.forEach(_class2.default.removeClass.bind(null, container));

        if (this.hideSiblingNodes) {
          (0, _manageAriaHidden.showSiblings)(container, modal.mountNode);
        }
        this.containers.splice(containerIdx, 1);
        this.data.splice(containerIdx, 1);
      } else if (this.hideSiblingNodes) {
        //otherwise make sure the next top modal is visible to a SR
        (0, _manageAriaHidden.ariaHidden)(false, data.modals[data.modals.length - 1].mountNode);
      }
    }
  }, {
    key: 'isTopModal',
    value: function isTopModal(modal) {
      return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
    }
  }]);

  return ModalManager;
}();

exports.default = ModalManager;
module.exports = exports['default'];
},{"./utils/isOverflowing":42,"./utils/manageAriaHidden":43,"dom-helpers/class":4,"dom-helpers/style":12,"dom-helpers/util/scrollbarSize":20}],38:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentOrElement = require('react-prop-types/lib/componentOrElement');

var _componentOrElement2 = _interopRequireDefault(_componentOrElement);

var _ownerDocument = require('./utils/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _getContainer = require('./utils/getContainer');

var _getContainer2 = _interopRequireDefault(_getContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The `<Portal/>` component renders its children into a new "subtree" outside of current component hierarchy.
 * You can think of it as a declarative `appendChild()`, or jQuery's `$.fn.appendTo()`.
 * The children of `<Portal/>` component will be appended to the `container` specified.
 */
var Portal = _react2.default.createClass({

  displayName: 'Portal',

  propTypes: {
    /**
     * A Node, Component instance, or function that returns either. The `container` will have the Portal children
     * appended to it.
     */
    container: _react2.default.PropTypes.oneOfType([_componentOrElement2.default, _react2.default.PropTypes.func])
  },

  componentDidMount: function componentDidMount() {
    this._renderOverlay();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._renderOverlay();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this._overlayTarget && nextProps.container !== this.props.container) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._portalContainerNode = (0, _getContainer2.default)(nextProps.container, (0, _ownerDocument2.default)(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this._unrenderOverlay();
    this._unmountOverlayTarget();
  },
  _mountOverlayTarget: function _mountOverlayTarget() {
    if (!this._overlayTarget) {
      this._overlayTarget = document.createElement('div');
      this._portalContainerNode = (0, _getContainer2.default)(this.props.container, (0, _ownerDocument2.default)(this).body);
      this._portalContainerNode.appendChild(this._overlayTarget);
    }
  },
  _unmountOverlayTarget: function _unmountOverlayTarget() {
    if (this._overlayTarget) {
      this._portalContainerNode.removeChild(this._overlayTarget);
      this._overlayTarget = null;
    }
    this._portalContainerNode = null;
  },
  _renderOverlay: function _renderOverlay() {

    var overlay = !this.props.children ? null : _react2.default.Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this._mountOverlayTarget();
      this._overlayInstance = _reactDom2.default.unstable_renderSubtreeIntoContainer(this, overlay, this._overlayTarget);
    } else {
      // Unrender if the component is null for transitions to null
      this._unrenderOverlay();
      this._unmountOverlayTarget();
    }
  },
  _unrenderOverlay: function _unrenderOverlay() {
    if (this._overlayTarget) {
      _reactDom2.default.unmountComponentAtNode(this._overlayTarget);
      this._overlayInstance = null;
    }
  },
  render: function render() {
    return null;
  },
  getMountNode: function getMountNode() {
    return this._overlayTarget;
  },
  getOverlayDOMNode: function getOverlayDOMNode() {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
    }

    if (this._overlayInstance) {
      if (this._overlayInstance.getWrappedDOMNode) {
        return this._overlayInstance.getWrappedDOMNode();
      } else {
        return _reactDom2.default.findDOMNode(this._overlayInstance);
      }
    }

    return null;
  }
});

exports.default = Portal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/getContainer":41,"./utils/ownerDocument":44,"react-prop-types/lib/componentOrElement":45}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (node, event, handler) {
  (0, _on2.default)(node, event, handler);
  return {
    remove: function remove() {
      (0, _off2.default)(node, event, handler);
    }
  };
};

var _on = require('dom-helpers/events/on');

var _on2 = _interopRequireDefault(_on);

var _off = require('dom-helpers/events/off');

var _off2 = _interopRequireDefault(_off);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
},{"dom-helpers/events/off":6,"dom-helpers/events/on":7}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addFocusListener;
/**
 * Firefox doesn't have a focusin event so using capture is easiest way to get bubbling
 * IE8 can't do addEventListener, but does have onfocusin, so we use that in ie8
 *
 * We only allow one Listener at a time to avoid stack overflows
 */
function addFocusListener(handler) {
  var useFocusin = !document.addEventListener;
  var remove = void 0;

  if (useFocusin) {
    document.attachEvent('onfocusin', handler);
    remove = function remove() {
      return document.detachEvent('onfocusin', handler);
    };
  } else {
    document.addEventListener('focus', handler, true);
    remove = function remove() {
      return document.removeEventListener('focus', handler, true);
    };
  }

  return { remove: remove };
}
module.exports = exports['default'];
},{}],41:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getContainer;

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getContainer(container, defaultContainer) {
  container = typeof container === 'function' ? container() : container;
  return _reactDom2.default.findDOMNode(container) || defaultContainer;
}
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isOverflowing;

var _isWindow = require('dom-helpers/query/isWindow');

var _isWindow2 = _interopRequireDefault(_isWindow);

var _ownerDocument = require('dom-helpers/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBody(node) {
  return node && node.tagName.toLowerCase() === 'body';
}

function bodyIsOverflowing(node) {
  var doc = (0, _ownerDocument2.default)(node);
  var win = (0, _isWindow2.default)(doc);
  var fullWidth = win.innerWidth;

  // Support: ie8, no innerWidth
  if (!fullWidth) {
    var documentElementRect = doc.documentElement.getBoundingClientRect();
    fullWidth = documentElementRect.right - Math.abs(documentElementRect.left);
  }

  return doc.body.clientWidth < fullWidth;
}

function isOverflowing(container) {
  var win = (0, _isWindow2.default)(container);

  return win || isBody(container) ? bodyIsOverflowing(container) : container.scrollHeight > container.clientHeight;
}
module.exports = exports['default'];
},{"dom-helpers/ownerDocument":8,"dom-helpers/query/isWindow":10}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ariaHidden = ariaHidden;
exports.hideSiblings = hideSiblings;
exports.showSiblings = showSiblings;

var BLACKLIST = ['template', 'script', 'style'];

var isHidable = function isHidable(_ref) {
  var nodeType = _ref.nodeType;
  var tagName = _ref.tagName;
  return nodeType === 1 && BLACKLIST.indexOf(tagName.toLowerCase()) === -1;
};

var siblings = function siblings(container, mount, cb) {
  mount = [].concat(mount);

  [].forEach.call(container.children, function (node) {
    if (mount.indexOf(node) === -1 && isHidable(node)) {
      cb(node);
    }
  });
};

function ariaHidden(show, node) {
  if (!node) {
    return;
  }
  if (show) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
}

function hideSiblings(container, mountNode) {
  siblings(container, mountNode, function (node) {
    return ariaHidden(true, node);
  });
}

function showSiblings(container, mountNode) {
  siblings(container, mountNode, function (node) {
    return ariaHidden(false, node);
  });
}
},{}],44:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (componentOrElement) {
  return (0, _ownerDocument2.default)(_reactDom2.default.findDOMNode(componentOrElement));
};

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ownerDocument = require('dom-helpers/ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"dom-helpers/ownerDocument":8}],45:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _createChainableTypeChecker = require('./utils/createChainableTypeChecker');

var _createChainableTypeChecker2 = _interopRequireDefault(_createChainableTypeChecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(props, propName, componentName, location, propFullName) {
  var propValue = props[propName];
  var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);

  if (_react2.default.isValidElement(propValue)) {
    return new Error('Invalid ' + location + ' `' + propFullName + '` of type ReactElement ' + ('supplied to `' + componentName + '`, expected a ReactComponent or a ') + 'DOMElement. You can usually obtain a ReactComponent or DOMElement ' + 'from a ReactElement by attaching a ref to it.');
  }

  if ((propType !== 'object' || typeof propValue.render !== 'function') && propValue.nodeType !== 1) {
    return new Error('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected a ReactComponent or a ') + 'DOMElement.');
  }

  return null;
}

exports.default = (0, _createChainableTypeChecker2.default)(validate);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/createChainableTypeChecker":47}],46:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _createChainableTypeChecker = require('./utils/createChainableTypeChecker');

var _createChainableTypeChecker2 = _interopRequireDefault(_createChainableTypeChecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function elementType(props, propName, componentName, location, propFullName) {
  var propValue = props[propName];
  var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);

  if (_react2.default.isValidElement(propValue)) {
    return new Error('Invalid ' + location + ' `' + propFullName + '` of type ReactElement ' + ('supplied to `' + componentName + '`, expected an element type (a string ') + 'or a ReactClass).');
  }

  if (propType !== 'function' && propType !== 'string') {
    return new Error('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected an element type (a string ') + 'or a ReactClass).');
  }

  return null;
}

exports.default = (0, _createChainableTypeChecker2.default)(elementType);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/createChainableTypeChecker":47}],47:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = createChainableTypeChecker;
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// Mostly taken from ReactPropTypes.

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    var componentNameSafe = componentName || '<<anonymous>>';
    var propFullNameSafe = propFullName || propName;

    if (props[propName] == null) {
      if (isRequired) {
        return new Error('Required ' + location + ' `' + propFullNameSafe + '` was not specified ' + ('in `' + componentNameSafe + '`.'));
      }

      return null;
    }

    for (var _len = arguments.length, args = Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
      args[_key - 6] = arguments[_key];
    }

    return validate.apply(undefined, [props, propName, componentNameSafe, location, propFullNameSafe].concat(args));
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}
},{}],48:[function(require,module,exports){
(function (global){
/*!
 * 
 *  React Simpletabs - Just a simple tabs component built with React
 *  @version v0.7.0
 *  @link https://github.com/pedronauck/react-simpletabs
 *  @license MIT
 *  @author Pedro Nauck (https://github.com/pedronauck)
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactSimpleTabs"] = factory((typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null));
	else
		root["ReactSimpleTabs"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1);
	var classNames = __webpack_require__(2);

	if (true) {
	  __webpack_require__(3);
	}

	var Tabs = React.createClass({
	  displayName: 'Tabs',
	  propTypes: {
	    className: React.PropTypes.oneOfType([
	      React.PropTypes.array,
	      React.PropTypes.string,
	      React.PropTypes.object
	    ]),
	    tabActive: React.PropTypes.number,
	    onMount: React.PropTypes.func,
	    onBeforeChange: React.PropTypes.func,
	    onAfterChange: React.PropTypes.func,
	    children: React.PropTypes.oneOfType([
	      React.PropTypes.array,
	      React.PropTypes.element
	    ]).isRequired
	  },
	  getDefaultProps:function () {
	    return { tabActive: 1 };
	  },
	  getInitialState:function () {
	    return {
	      tabActive: this.props.tabActive
	    };
	  },
	  componentDidMount:function() {
	    var index = this.state.tabActive;
	    var $selectedPanel = this.refs['tab-panel'];
	    var $selectedMenu = this.refs[("tab-menu-" + index)];

	    if (this.props.onMount) {
	      this.props.onMount(index, $selectedPanel, $selectedMenu);
	    }
	  },
	  componentWillReceiveProps: function(newProps){
	    if(newProps.tabActive && newProps.tabActive !== this.props.tabActive){
	      this.setState({tabActive: newProps.tabActive});
	    }
	  },
	  render:function () {
	    var className = classNames('tabs', this.props.className);
	    return (
	      React.createElement("div", {className: className}, 
	        this._getMenuItems(), 
	        this._getSelectedPanel()
	      )
	    );
	  },
	  setActive:function(index, e) {
	    e.preventDefault();

	    var onAfterChange = this.props.onAfterChange;
	    var onBeforeChange = this.props.onBeforeChange;
	    var $selectedPanel = this.refs['tab-panel'];
	    var $selectedTabMenu = this.refs[("tab-menu-" + index)];

	    if (onBeforeChange) {
	      var cancel = onBeforeChange(index, $selectedPanel, $selectedTabMenu);
	      if(cancel === false){ return }
	    }

	    this.setState({ tabActive: index }, function()  {
	      if (onAfterChange) {
	        onAfterChange(index, $selectedPanel, $selectedTabMenu);
	      }
	    });
	  },
	  _getMenuItems:function () {
	    if (!this.props.children) {
	      throw new Error('Tabs must contain at least one Tabs.Panel');
	    }

	    if (!Array.isArray(this.props.children)) {
	      this.props.children = [this.props.children];
	    }

	    var $menuItems = this.props.children
	      .map(function($panel)  {return typeof $panel === 'function' ? $panel() : $panel;})
	      .filter(function($panel)  {return $panel;})
	      .map(function($panel, index)  {
	        var ref = ("tab-menu-" + (index + 1));
	        var title = $panel.props.title;
	        var classes = classNames(
	          'tabs-menu-item',
	          this.state.tabActive === (index + 1) && 'is-active'
	        );

	        return (
	          React.createElement("li", {ref: ref, key: index, className: classes}, 
	            React.createElement("a", {onClick: this.setActive.bind(this, index + 1)}, 
	              title
	            )
	          )
	        );
	      }.bind(this));

	    return (
	      React.createElement("nav", {className: "tabs-navigation"}, 
	        React.createElement("ul", {className: "tabs-menu"}, $menuItems)
	      )
	    );
	  },
	  _getSelectedPanel:function () {
	    var index = this.state.tabActive - 1;
	    var $panel = this.props.children[index];

	    return (
	      React.createElement("article", {ref: "tab-panel", className: "tab-panel"}, 
	        $panel
	      )
	    );
	  }
	});

	Tabs.Panel = React.createClass({
	  displayName: 'Panel',
	  propTypes: {
	    title: React.PropTypes.string.isRequired,
	    children: React.PropTypes.oneOfType([
	      React.PropTypes.array,
	      React.PropTypes.element
	    ]).isRequired
	  },
	  render:function () {
	    return React.createElement("div", null, this.props.children);
	  }
	});

	module.exports = Tabs;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */function classNames() {
		var classes = '';
		var arg;

		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}

			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}

	// safely export classNames in case the script is included directly on a page
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],49:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":22}],50:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlleleFiltersView = function AlleleFiltersView(_ref) {
  var species = _ref.species;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$disabledAlleles = _ref.disabledAlleles;
  var disabledAlleles = _ref$disabledAlleles === undefined ? [] : _ref$disabledAlleles;
  var onFilterChange = _ref.onFilterChange;

  var hiddenGenes = new Set(),
      geneInputs = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = hiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var allele = _step.value;

      var _gene = BioLogica.Genetics.getGeneOfAllele(species, allele);
      if (_gene) hiddenGenes.add(_gene.name);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  for (var gene in species.geneList) {
    if (!hiddenGenes.has(gene)) {
      var alleles = species.geneList[gene].alleles,
          alleleItems = alleles.map(function (allele) {
        var name = species.alleleLabelMap[allele],
            checked = !(disabledAlleles.indexOf(allele) >= 0);
        return _react2.default.createElement(
          "label",
          { key: name },
          _react2.default.createElement("input", { type: "checkbox", key: name, value: allele,
            style: { "marginLeft": "8px" },
            defaultChecked: checked, onChange: handleChange }),
          name
        );
      });
      geneInputs.push(_react2.default.createElement(
        "div",
        { className: "gene-allele-list", key: gene },
        alleleItems
      ));
    }
  }

  function handleChange(evt) {
    var elt = evt.target,
        allele = elt && elt.value,
        isChecked = elt && elt.checked;
    if (onFilterChange && allele) onFilterChange(evt, allele, isChecked);
  }

  return _react2.default.createElement(
    "div",
    { className: "geniblocks allele-filters",
      style: { "marginTop": "5px", "marginBottom": "5px" } },
    geneInputs
  );
};

AlleleFiltersView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  disabledAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  onFilterChange: _react.PropTypes.func.isRequired
};

exports.default = AlleleFiltersView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],51:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlleleView = function AlleleView(_ref) {
  var allele = _ref.allele;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 21 : _ref$width;
  var target = _ref.target;
  var color = _ref.color;
  var shape = _ref.shape;
  var hovering = _ref.hovering;

  var radius = width / 2,
      stroke = target ? "#000000" : "none",
      fill = allele ? color : "white",
      strokeWidth = hovering ? 3 : 1,
      strokeDasharray = allele ? "0" : "1",
      svgShape = null;

  if (shape === "circle") {
    svgShape = _react2.default.createElement("circle", { r: radius, cy: radius + 1, cx: radius + 1, strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  } else {
    svgShape = _react2.default.createElement("rect", { width: radius * 2, height: radius * 2, x: "1", y: "1", strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  }

  return _react2.default.createElement(
    "svg",
    { width: width + 2, height: width + 2, xmlns: "http://www.w3.org/2000/svg" },
    _react2.default.createElement(
      "g",
      null,
      svgShape,
      _react2.default.createElement(
        "text",
        { x: radius + 1, y: radius + 7, textAnchor: "middle", fill: "white" },
        allele
      )
    )
  );
};

AlleleView.propTypes = {
  allele: _react.PropTypes.string,
  width: _react.PropTypes.number,
  target: _react.PropTypes.bool,
  color: _react.PropTypes.string,
  shape: _react.PropTypes.string,
  hovering: _react.PropTypes.bool
};

exports.default = AlleleView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],52:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _gamete = require('./gamete');

var _gamete2 = _interopRequireDefault(_gamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Stateless functional React component for displaying a Biologica gamete that animates
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} [initialDisplay] - initial display parameters used to represent the gamete
 * @param {number} [initialDisplay.x] - initial location (left) of the gamete
 * @param {number} [initialDisplay.y] - initial location (top) of the gamete
 * @param {number} [initialDisplay.size=30] - initial size (width & height) of the gamete
 * @param {number} [initialDisplay.rotation=0] - initial rotation of the gamete
 * @param {number} [initialDisplay.opacity=1] - initial opacity of the gamete
 * @param {Object} display - final display parameters used to represent the gamete
 * @param {number} display.x - final location (left) of the gamete
 * @param {number} display.y - final location (top) of the gamete
 * @param {number} [display.size=30] - final size (width & height) of the gamete
 * @param {number} [display.rotation=0] - final rotation of the gamete
 * @param {number} [display.opacity=1] - final opacity of the gamete
 * @param {number} [animStiffness=100] - spring stiffness used to control animation speed
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 * @param {function} [onRect()] - callback function to be called when the animation is at rest
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
var AnimatedGameteView = function AnimatedGameteView(_ref) {
  var id = _ref.id;
  var initialDisplay = _ref.initialDisplay;
  var display = _ref.display;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 100 : _ref$animStiffness;
  var onRest = _ref.onRest;

  var others = _objectWithoutProperties(_ref, ['id', 'initialDisplay', 'display', 'animStiffness', 'onRest']);

  var group = id % 4,
      rotationForGroup = group * 90,
      initial = initialDisplay || display,
      initialSize = initial.size || 30,
      initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
      initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
      finalSize = display.size || 30,
      finalRotation = display.rotation != null ? display.rotation : rotationForGroup,
      finalOpacity = display.opacity != null ? display.opacity : 1.0,
      springConfig = { stiffness: animStiffness };
  return _react2.default.createElement(
    _reactMotion.Motion,
    { className: 'geniblocks animated-gamete',
      defaultStyle: {
        x: initial.x, y: initial.y, size: initialSize,
        rotation: initialRotation, opacity: initialOpacity
      },
      style: {
        x: (0, _reactMotion.spring)(display.x, springConfig),
        y: (0, _reactMotion.spring)(display.y, springConfig),
        size: (0, _reactMotion.spring)(finalSize, springConfig),
        rotation: (0, _reactMotion.spring)(finalRotation, springConfig),
        opacity: (0, _reactMotion.spring)(finalOpacity, springConfig)
      },
      onRest: onRest },
    function (interpolatedStyle) {
      return _react2.default.createElement(_gamete2.default, _extends({ id: id, display: interpolatedStyle }, others));
    }
  );
};

AnimatedGameteView.propTypes = {
  gamete: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.number.isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  initialDisplay: _react.PropTypes.shape({ // initial display properties
    x: _react.PropTypes.number.isRequired, // location (left) of gamete image
    y: _react.PropTypes.number.isRequired, // location (top) of gamete image
    size: _react.PropTypes.number, // size of gamete image (default: 30)
    rotation: _react.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: _react.PropTypes.number // opacity of gamete image (default: 1.0)
  }),
  display: _react.PropTypes.shape({ // final display properties
    x: _react.PropTypes.number.isRequired, // location (left) of gamete image
    y: _react.PropTypes.number.isRequired, // location (top) of gamete image
    size: _react.PropTypes.number, // size of gamete image (default: 30)
    rotation: _react.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: _react.PropTypes.number // opacity of gamete image (default: 1.0)
  }).isRequired,
  animStiffness: _react.PropTypes.number, // stiffness of spring for animation (default: 100)
  isSelected: _react.PropTypes.bool,
  isDisabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  onRest: _react.PropTypes.func
};

exports.default = AnimatedGameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./gamete":65,"react-motion":30}],53:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnimatedOrganismView = function AnimatedOrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var _ref$initialOpacity = _ref.initialOpacity;
  var initialOpacity = _ref$initialOpacity === undefined ? 1.0 : _ref$initialOpacity;
  var _ref$opacity = _ref.opacity;
  var opacity = _ref$opacity === undefined ? 1.0 : _ref$opacity;
  var _ref$stiffness = _ref.stiffness;
  var stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness;
  var onRest = _ref.onRest;
  var onClick = _ref.onClick;

  var opacityStart = initialOpacity !== undefined ? initialOpacity : opacity !== undefined ? opacity : 1.0;
  var opacityEnd = opacity !== undefined ? opacity : opacityStart;

  if (opacityEnd !== opacityStart) opacityEnd = (0, _reactMotion.spring)(opacityEnd, { stiffness: stiffness });

  return _react2.default.createElement(
    _reactMotion.Motion,
    { className: 'geniblocks animated-organism-view',
      defaultStyle: { opacity: opacityStart }, style: { opacity: opacityEnd }, onRest: onRest },
    function (interpolatedStyle) {
      var tStyle = _extends({}, style, interpolatedStyle);
      return _react2.default.createElement(_organism2.default, { org: org, id: id, width: width, style: tStyle, onClick: onClick });
    }
  );
};

AnimatedOrganismView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string,
  width: _react.PropTypes.number,
  style: _react.PropTypes.object,
  initialOpacity: _react.PropTypes.number,
  opacity: _react.PropTypes.number,
  stiffness: _react.PropTypes.number,
  onRest: _react.PropTypes.func,
  onClick: _react.PropTypes.func
};

exports.default = AnimatedOrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism":73,"react-motion":30}],54:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _eggClutch = require('./egg-clutch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EGG_IMAGE_WIDTH_SMALL = _eggClutch.EGG_IMAGE_WIDTH / 3;

var BasketView = function (_React$Component) {
  _inherits(BasketView, _React$Component);

  function BasketView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BasketView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BasketView.__proto__ || Object.getPrototypeOf(BasketView)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (evt) {
      var _this$props = _this.props;
      var basket = _this$props.basket;
      var index = _this$props.index;
      var onClick = _this$props.onClick;

      if (onClick) onClick(index, basket);
      evt.stopPropagation();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BasketView, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var basket = _props.basket;
      var id = _props.id;
      var eggs = _props.eggs;
      var isSelected = _props.isSelected;
      var classes = 'basket' + (isSelected ? ' selected' : '');

      function eggsDiv() {
        if (!eggs || !eggs.length) return null;
        var eggViews = eggs.map(function (egg, index) {
          return _react2.default.createElement(_eggClutch.EggView, { egg: egg, key: 'basket-egg-' + index, isSelected: true,
            displayStyle: { size: EGG_IMAGE_WIDTH_SMALL } });
        });
        return _react2.default.createElement(
          'div',
          { className: 'basket-eggs', style: { position: 'absolute', display: 'flex',
              justifyContent: 'center',
              left: 30, top: 10, width: 70 } },
          eggViews
        );
      }

      return _react2.default.createElement(
        'div',
        { className: classes, id: id, key: id, style: { position: 'relative' }, onClick: this.handleClick },
        _react2.default.createElement('div', { className: 'basket-image', ref: 'domNode' }),
        eggsDiv(),
        _react2.default.createElement(
          'div',
          { className: 'basket-label unselectable' },
          basket.label
        )
      );
    }
  }]);

  return BasketView;
}(_react2.default.Component);

BasketView.propTypes = {
  basket: _react.PropTypes.shape({
    label: _react.PropTypes.string,
    alleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
    sex: _react.PropTypes.number
  }),
  id: _react.PropTypes.string,
  index: _react.PropTypes.number,
  eggs: _react.PropTypes.arrayOf(_react.PropTypes.object),
  isSelected: _react.PropTypes.bool,
  onClick: _react.PropTypes.func
};


var BasketSetView = function BasketSetView(_ref2) {
  var baskets = _ref2.baskets;
  var _ref2$idPrefix = _ref2.idPrefix;
  var idPrefix = _ref2$idPrefix === undefined ? 'basket-' : _ref2$idPrefix;
  var _ref2$selectedIndices = _ref2.selectedIndices;
  var selectedIndices = _ref2$selectedIndices === undefined ? [] : _ref2$selectedIndices;
  var eggs = _ref2.eggs;
  var eggIndexOffset = _ref2.eggIndexOffset;
  var animatingEggIndex = _ref2.animatingEggIndex;
  var onClick = _ref2.onClick;


  var basketViews = baskets.map(function (basket, index) {
    var id = '' + idPrefix + index,
        isSelected = selectedIndices.indexOf(index) >= 0;
    var eggIndices = basket && basket.eggs || [],
        displayEggs = [];
    eggIndices.forEach(function (eggDrakeIndex) {
      var eggIndex = eggDrakeIndex - eggIndexOffset;
      if (eggDrakeIndex === animatingEggIndex) return;
      if (eggs && eggs[eggIndex]) displayEggs.push(eggs[eggIndex]);
    });
    return _react2.default.createElement(BasketView, { basket: basket, id: id, key: id, index: index, eggs: displayEggs,
      isSelected: isSelected, onClick: onClick });
  });

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks basket-set' },
    basketViews
  );
};

BasketSetView.propTypes = {
  baskets: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  idPrefix: _react.PropTypes.string,
  selectedIndices: _react.PropTypes.arrayOf(_react.PropTypes.number),
  eggs: _react.PropTypes.arrayOf(_react.PropTypes.object),
  eggIndexOffset: _react.PropTypes.number,
  animatingEggIndex: _react.PropTypes.number,
  onClick: _react.PropTypes.func
};

exports.default = BasketSetView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./egg-clutch":61}],55:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _translate = require('../utilities/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This component is a very thin wrapper around a standard button designed to prevent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * extraneous focus highlighting added by browsers when clicking on a button while
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * maintaining keyboard accessibility. See
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * for details. The upshot is that we use mouse events on the button to disable the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * focus highlight -- mousing/clicking on a push button should not be used as an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * incidator that the user would like to keyboard-interact with that button, which
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * is what focusing a clicked button implies.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * IMPORTANT: To maintain accessibility, there must be code somewhere to reenable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the focus highlight when appropriate. This can be done for 'keydown' by calling
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Button.enableButtonFocusHighlightOnKeyDown() during application/page initialization,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * or by adding your own event handler that calls Button.enableButtonFocusHighlight().
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Button = function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Button);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Button.__proto__ || Object.getPrototypeOf(Button)).call.apply(_ref, [this].concat(args))), _this), _this.suppressButtonFocusHighlight = function () {
      var noFocusHighlight = 'no-focus-highlight',
          button = _this.refs.button;
      if (button && button.className.indexOf(noFocusHighlight) < 0) button.className += ' ' + noFocusHighlight;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var className = _props.className;
      var label = _props.label;
      var others = _objectWithoutProperties(_props, ['className', 'label']);
      var classes = (className ? className + ' ' : '') + 'gb-button';

      var handleMouseEvent = function handleMouseEvent() {
        return _this2.suppressButtonFocusHighlight();
      };

      return _react2.default.createElement(
        'button',
        _extends({ className: classes, ref: 'button' }, others, {
          onMouseEnter: handleMouseEvent,
          onMouseDown: handleMouseEvent }),
        (0, _translate2.default)(label)
      );
    }
  }], [{
    key: 'enableButtonFocusHighlightOnKeyDown',


    // Installs a keydown handler on the document which will enable button focus highlighting.
    // Should be called once during application initialization.
    value: function enableButtonFocusHighlightOnKeyDown() {
      document.addEventListener('keydown', function () {
        return Button.enableButtonFocusHighlight();
      });
    }

    // Enables button focus highlighting; designed to be called from the keydown handler above
    // but available separately for implementations that require it.

  }, {
    key: 'enableButtonFocusHighlight',
    value: function enableButtonFocusHighlight() {
      var buttons = document.querySelectorAll('.gb-button'),
          count = buttons.length;
      // cf. https://developer.mozilla.org/en-US/docs/Web/API/NodeList#Example
      for (var i = 0; i < count; ++i) {
        var button = buttons[i];
        if (button && button.className) {
          // cf. http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
          button.className = button.className.replace(/(?:^|\s)no-focus-highlight(?!\S)/g, '');
        }
      }
    }

    // prevent extraneous focus highlight on click while maintaining keyboard accessibility
    // see https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/

  }]);

  return Button;
}(_react2.default.Component);

Button.propTypes = {
  className: _react.PropTypes.string,
  label: _react2.default.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array])
};
exports.default = Button;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/translate":83}],56:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChallengeAwardView = function (_React$Component) {
  _inherits(ChallengeAwardView, _React$Component);

  function ChallengeAwardView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ChallengeAwardView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ChallengeAwardView.__proto__ || Object.getPrototypeOf(ChallengeAwardView)).call.apply(_ref, [this].concat(args))), _this), _this.addAwardImage = function (progressImages, pieces, pieceNum, score, pieceStyle) {
      var awardLevel = _this.getAwardStyle(score);
      if (score > -1) {
        var pieceName = 'coin piece pieces' + pieces + ' piece' + pieceNum + ' ' + pieceStyle + ' ' + awardLevel;
        progressImages.push(_react2.default.createElement('div', { key: pieceNum, className: pieceName }));
      }
      return progressImages;
    }, _this.getAwardStyle = function (score) {
      var awardLevel = "gold";
      if (score === 1) awardLevel = "silver";
      if (score >= 2) awardLevel = "bronze";
      return awardLevel;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ChallengeAwardView, [{
    key: 'render',
    value: function render() {
      var caseId = 0,
          challengeId = 0,
          challengeCount = 0,
          progress = [],
          challengeBackgroundImage = void 0,
          progressImages = [];

      if (this.props.challengeAwards.challengeId != null) {
        caseId = this.props.challengeAwards.caseId, challengeId = this.props.challengeAwards.challengeId, challengeCount = this.props.challengeAwards.challengeCount;
        progress = this.props.challengeAwards.progress;
        challengeBackgroundImage = _react2.default.createElement('div', { className: 'coin background' });
      } else return null;

      if (!progress || progress === []) return null;

      var size = this.props.size || 256;
      var sizeStyle = {
        width: size + "px",
        height: size + "px"
      };

      var pieceKey = caseId + ":";
      var challengeScore = {};

      for (var i = 0; i < challengeCount; i++) {
        for (var key in progress) {
          if (key.startsWith(pieceKey + i)) {
            var score = progress[key];
            if (challengeScore[i] == null) {
              challengeScore[i] = score;
            } else {
              challengeScore[i] += score;
            }
          }
        }
      }
      var pieceNum = challengeId + 1;
      var currentPieceStyle = 'coin piece pieces' + challengeCount + ' piece' + pieceNum + ' single ' + this.getAwardStyle(challengeScore[challengeId]);

      for (var challenge in challengeScore) {
        pieceNum = parseInt(challenge) + 1;
        progressImages = this.addAwardImage(progressImages, challengeCount, pieceNum, challengeScore[challenge], "whole");
      }

      var singlePieceOpacityStart = 1,
          singlePieceOpacityEnd = 0,
          style = {},
          onRest = void 0;
      singlePieceOpacityEnd = (0, _reactMotion.spring)(singlePieceOpacityEnd, { stiffness: 30, damping: 20 });

      return _react2.default.createElement(
        'div',
        { className: 'geniblocks challenge-award', style: sizeStyle },
        challengeBackgroundImage,
        progressImages,
        _react2.default.createElement(
          _reactMotion.Motion,
          { className: 'geniblocks animated-coin-view',
            defaultStyle: { opacity: singlePieceOpacityStart }, style: { opacity: singlePieceOpacityEnd }, onRest: onRest },
          function (interpolatedStyle) {
            var tStyle = _extends({}, style, interpolatedStyle);
            return _react2.default.createElement('div', { key: pieceNum, style: tStyle, className: currentPieceStyle });
          }
        )
      );
    }
  }]);

  return ChallengeAwardView;
}(_react2.default.Component);

ChallengeAwardView.propTypes = {
  challengeAwards: _react.PropTypes.object,
  size: _react.PropTypes.number,
  coinParts: _react.PropTypes.number
};
ChallengeAwardView.defaultProps = {
  challengeAwards: { "caseId": 0, "challengeId": 0, "challengeCount": 0, "progress": [] },
  size: 256,
  coinParts: 3
};
exports.default = ChallengeAwardView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"react-motion":30}],57:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stateless functional React component for displaying male/female change buttons
 * The appearance of the buttons is currently entirely controlled via external CSS.
 * @param {string} sex - ['male' | 'female'] currently selected button
 * @param {function} onChange(evt, sex) - callback to be called when use clicks to change sex
 */
var ChangeSexButtons = function ChangeSexButtons(_ref) {
  var id = _ref.id;
  var sex = _ref.sex;
  var species = _ref.species;
  var showLabel = _ref.showLabel;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onChange = _ref.onChange;

  var capSex = sex === BioLogica.MALE ? 'Male' : 'Female',
      selectedSexClass = sex === BioLogica.MALE ? 'male-selected' : 'female-selected',
      BUTTON_IMAGE_WIDTH = 100,
      BUTTON_IMAGE_MIDPOINT_X = BUTTON_IMAGE_WIDTH / 2,
      imageStyle = _extends({ position: 'absolute' }, style),
      label = showLabel ? capSex + ' ' + species : '',
      labelElement = showLabel ? _react2.default.createElement(
    'div',
    { style: { position: 'absolute',
        fontSize: '14pt',
        fontWeight: 'bold',
        color: 'white',
        left: BUTTON_IMAGE_WIDTH,
        whiteSpace: 'nowrap',
        marginLeft: 10 } },
    label
  ) : '';

  function handleClick(evt) {
    var eltRect = evt.target.getBoundingClientRect(),
        clickX = evt.clientX - eltRect.left;

    if (sex === BioLogica.FEMALE && clickX > BUTTON_IMAGE_MIDPOINT_X) {
      // user clicked on Right (male) icon while female was selected
      onChange(BioLogica.MALE);
    } else if (sex === BioLogica.MALE && clickX < BUTTON_IMAGE_MIDPOINT_X) {
      // user clicked on Left (female) icon while male was selected
      onChange(BioLogica.FEMALE);
    }
  }

  return _react2.default.createElement(
    'div',
    { id: id, style: { position: 'relative' } },
    _react2.default.createElement('div', { className: 'geniblocks change-sex-buttons ' + selectedSexClass,
      style: imageStyle, onClick: handleClick }),
    labelElement
  );
};

ChangeSexButtons.propTypes = {
  id: _react.PropTypes.string,
  sex: _react.PropTypes.oneOf([BioLogica.MALE, BioLogica.FEMALE]),
  species: _react.PropTypes.string,
  showLabel: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  onChange: _react.PropTypes.func.isRequired
};

exports.default = ChangeSexButtons;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],58:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  normal: {
    width: 23,
    height: 120,
    split: 45
  },
  small: {
    width: 19,
    height: 90,
    split: 34
  }
};

var defaultsY = {
  normal: {
    width: 23,
    height: 75,
    split: 38
  },
  small: {
    width: 19,
    height: 62,
    split: 32
  }
};

var ChromosomeImageView = function ChromosomeImageView(_ref) {
  var width = _ref.width;
  var height = _ref.height;
  var _ref$split = _ref.split;
  var split = _ref$split === undefined ? 45 : _ref$split;
  var _ref$color = _ref.color;
  var color = _ref$color === undefined ? '#FF9999' : _ref$color;
  var _ref$small = _ref.small;
  var small = _ref$small === undefined ? false : _ref$small;
  var _ref$bold = _ref.bold;
  var bold = _ref$bold === undefined ? false : _ref$bold;
  var _ref$empty = _ref.empty;
  var empty = _ref$empty === undefined ? false : _ref$empty;
  var _ref$yChromosome = _ref.yChromosome;
  var yChromosome = _ref$yChromosome === undefined ? false : _ref$yChromosome;
  var animationStyling = _ref.animationStyling;

  if (!width || !height) {
    var defaultDims = yChromosome ? defaultsY : defaults;

    var _ref2 = small ? defaultDims.small : defaultDims.normal;

    width = _ref2.width;
    height = _ref2.height;
    split = _ref2.split;
  }

  var radius = width / 2,
      imageWidth = width + 4,
      halfImageWidth = imageWidth / 2,
      imageHeight = height + 4;

  var strokeWidth = width < 10 ? 1 : 2;

  if (bold) {
    color = '#FF6666';
    strokeWidth = 3;
  }
  if (empty) {
    color = '#FFF';
    strokeWidth = 1;
  }
  var positionStyling = {};
  if (animationStyling) {
    positionStyling = {
      position: 'fixed', left: animationStyling.x, top: animationStyling.y, opacity: animationStyling.opacity
    };
  }
  return _react2.default.createElement(
    'div',
    { className: 'chromosome-image', style: positionStyling },
    _react2.default.createElement(
      'svg',
      { width: imageWidth, height: imageHeight, xmlns: 'http://www.w3.org/2000/svg' },
      _react2.default.createElement(
        'g',
        null,
        _react2.default.createElement('circle', { r: radius, cy: radius + 2, cx: halfImageWidth, strokeWidth: strokeWidth, stroke: '#000000', fill: color }),
        _react2.default.createElement('circle', { r: radius, cy: split - radius, cx: halfImageWidth, strokeWidth: strokeWidth, stroke: '#000000', fill: color }),
        _react2.default.createElement('circle', { r: radius, cy: split + radius, cx: halfImageWidth, strokeWidth: strokeWidth, stroke: '#000000', fill: color }),
        _react2.default.createElement('circle', { r: radius, cy: height - radius, cx: halfImageWidth, strokeWidth: strokeWidth, stroke: '#000000', fill: color }),
        _react2.default.createElement('rect', { height: split - radius - (radius + 2), width: width, y: radius + 2, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
        _react2.default.createElement('rect', { height: height - radius - (split + radius), width: width, y: split + radius, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
        _react2.default.createElement('line', { y1: radius + 2, x1: '2', y2: split - radius + 2, x2: '2', strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: strokeWidth, stroke: '#000000', fill: 'none' }),
        _react2.default.createElement('line', { y1: radius + 2, x1: width + 2, y2: split - radius + 2, x2: width + 2, strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: strokeWidth, stroke: '#000000', fill: 'none' }),
        _react2.default.createElement('line', { y1: split + radius, x1: '2', y2: height - radius, x2: '2', strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: strokeWidth, stroke: '#000000', fill: 'none' }),
        _react2.default.createElement('line', { y1: split + radius, x1: width + 2, y2: height - radius, x2: width + 2, strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: strokeWidth, stroke: '#000000', fill: 'none' })
      )
    )
  );
};

ChromosomeImageView.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  split: _react.PropTypes.number,
  color: _react.PropTypes.string,
  small: _react.PropTypes.bool,
  bold: _react.PropTypes.bool,
  empty: _react.PropTypes.bool,
  yChromosome: _react.PropTypes.bool,
  animationStyling: _react.PropTypes.shape({
    x: _react.PropTypes.number,
    y: _react.PropTypes.number,
    opacity: _react.PropTypes.number
  })
};

exports.default = ChromosomeImageView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],59:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _geneLabel = require('./gene-label');

var _geneLabel2 = _interopRequireDefault(_geneLabel);

var _allele = require('./allele');

var _allele2 = _interopRequireDefault(_allele);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * View of a single chromosome, with optional labels, pulldowns, and embedded alleles.
 *
 * Defined EITHER using a Biologica Chromosome object, OR with a Biologica organism,
 * chromosome name and side.
 */

var ChromosomeView = function ChromosomeView(_ref) {
  var chromosome = _ref.chromosome;
  var org = _ref.org;
  var chromosomeName = _ref.chromosomeName;
  var side = _ref.side;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$small = _ref.small;
  var small = _ref$small === undefined ? false : _ref$small;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var _ref$selected = _ref.selected;
  var selected = _ref$selected === undefined ? false : _ref$selected;
  var _onAlleleChange = _ref.onAlleleChange;
  var onChromosomeSelected = _ref.onChromosomeSelected;
  var _ref$showLabels = _ref.showLabels;
  var showLabels = _ref$showLabels === undefined ? true : _ref$showLabels;
  var _ref$showAlleles = _ref.showAlleles;
  var showAlleles = _ref$showAlleles === undefined ? false : _ref$showAlleles;
  var _ref$labelsOnRight = _ref.labelsOnRight;
  var labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight;
  var orgName = _ref.orgName;
  var _ref$displayStyle = _ref.displayStyle;
  var displayStyle = _ref$displayStyle === undefined ? {} : _ref$displayStyle;

  var containerClass = "items",
      empty = false,
      yChromosome = false,
      labelsContainer,
      allelesContainer,
      chromId;

  if (org && chromosomeName && side) {
    chromosome = org.getGenotype().chromosomes[chromosomeName][side];
  }

  if (chromosome) {
    var alleles = chromosome.alleles,
        visibleAlleles = _geneticsUtils2.default.filterAlleles(alleles, hiddenAlleles, chromosome.species);

    if (showLabels) {
      var labels = visibleAlleles.map(function (a) {
        return _react2.default.createElement(_geneLabel2.default, { key: a, species: chromosome.species, allele: a, editable: editable,
          onAlleleChange: function onAlleleChange(event) {
            _onAlleleChange(a, event.target.value);
          } });
      });

      labelsContainer = _react2.default.createElement(
        'div',
        { className: 'labels' },
        labels
      );

      if (!labelsOnRight) {
        containerClass += " rtl";
      }
    }

    if (showAlleles) {
      var alleleSymbols = visibleAlleles.map(function (a) {
        return _react2.default.createElement(_allele2.default, { key: a, allele: a });
      });

      allelesContainer = _react2.default.createElement(
        'div',
        { className: 'alleles' },
        alleleSymbols
      );
    }

    if (chromosome.side === "y") {
      yChromosome = true;
    }

    chromId = orgName + chromosome.chromosome + chromosome.side;
  } else {
    chromId = orgName;
    empty = true;
  }
  var handleSelect = function handleSelect(evt) {
    if (onChromosomeSelected) {
      onChromosomeSelected(evt.currentTarget);
    }
  };

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks chromosome-container', onClick: handleSelect },
    _react2.default.createElement(
      'div',
      { className: containerClass },
      _react2.default.createElement(
        'div',
        { className: 'chromosome-allele-container', id: chromId, style: displayStyle },
        _react2.default.createElement(_chromosomeImage2.default, { small: small, empty: empty, bold: selected, yChromosome: yChromosome }),
        allelesContainer
      ),
      labelsContainer
    )
  );
};

ChromosomeView.propTypes = {
  org: _react.PropTypes.object,
  chromosomeName: _react.PropTypes.string,
  side: _react.PropTypes.string,
  chromosome: _react.PropTypes.object,
  hiddenAlleles: _react.PropTypes.array,
  small: _react.PropTypes.bool,
  editable: _react.PropTypes.bool,
  selected: _react.PropTypes.bool,
  showLabels: _react.PropTypes.bool,
  showAlleles: _react.PropTypes.bool,
  labelsOnRight: _react.PropTypes.bool,
  displayStyle: _react.PropTypes.object,
  onAlleleChange: _react.PropTypes.func,
  onChromosomeSelected: _react.PropTypes.func,
  orgName: _react.PropTypes.string
};

exports.default = ChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":80,"./allele":51,"./chromosome-image":58,"./gene-label":66}],60:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Uses an SVG circular gradient to implement a fading glow background.
 * Implemented as a stateless functional React component.
 *
 * @param {string} color - the color of the circular gradient "glow"
 * @param {number} size - the diameter of the circular gradient
 * @param {object} style - styles applied to the outer div
 */
var CircularGlowView = function CircularGlowView(_ref) {
  var id = _ref.id;
  var color = _ref.color;
  var size = _ref.size;
  var style = _ref.style;

  var radius = size / 2,
      colorNoHash = color.replace('#', ''),
      gradientID = 'CircularGlowView_' + (id || colorNoHash),
      gradientIDUrl = 'url(#' + gradientID + ')';

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks circular-glow', style: style },
    _react2.default.createElement(
      'svg',
      { width: size + 2, height: size + 2, xmlns: 'http://www.w3.org/2000/svg' },
      _react2.default.createElement(
        'defs',
        null,
        _react2.default.createElement(
          'radialGradient',
          { id: gradientID },
          _react2.default.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: '1.0' }),
          _react2.default.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: '0.0' })
        )
      ),
      _react2.default.createElement('circle', { fill: gradientIDUrl, cx: radius, cy: radius, r: radius })
    )
  );
};

CircularGlowView.propTypes = {
  id: _react.PropTypes.string,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number.isRequired,
  style: _react.PropTypes.object
};

exports.default = CircularGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],61:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EggView = exports.EGG_IMAGE_HEIGHT = exports.EGG_IMAGE_WIDTH = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// image specified as CSS background-image, but size constants required in JavaScript
var EGG_IMAGE_WIDTH = exports.EGG_IMAGE_WIDTH = 75,
    EGG_IMAGE_HEIGHT = exports.EGG_IMAGE_HEIGHT = 109;

var EggView = exports.EggView = function (_React$Component) {
  _inherits(EggView, _React$Component);

  function EggView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, EggView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EggView.__proto__ || Object.getPrototypeOf(EggView)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (evt) {
      var _this$props = _this.props;
      var egg = _this$props.egg;
      var id = _this$props.id;
      var index = _this$props.index;
      var onClick = _this$props.onClick;

      if (onClick) onClick(id, index, egg);
      evt.stopPropagation();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(EggView, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var egg = _props.egg;
      var id = _props.id;
      var displayStyle = _props.displayStyle;
      var isSelected = _props.isSelected;
      var eggStyle = Object.assign({ flexShrink: 0 }, displayStyle);
      var isHidden = egg == null;
      var classes = 'clutch-egg' + (isSelected ? ' selected' : '') + (isHidden ? ' hidden' : '');
      if (displayStyle && displayStyle.size != null) {
        eggStyle.width = displayStyle.size;
        eggStyle.height = eggStyle.width * (EGG_IMAGE_HEIGHT / EGG_IMAGE_WIDTH);
      }
      return _react2.default.createElement('div', { id: id, className: classes, key: id, ref: 'domNode', style: eggStyle, onClick: this.handleClick });
    }
  }]);

  return EggView;
}(_react2.default.Component);

EggView.propTypes = {
  egg: _react.PropTypes.object,
  id: _react.PropTypes.string,
  index: _react.PropTypes.number,
  isSelected: _react.PropTypes.bool,
  displayStyle: _react.PropTypes.object,
  onClick: _react.PropTypes.func
};


var EggClutchView = function EggClutchView(_ref2) {
  var eggs = _ref2.eggs;
  var _ref2$idPrefix = _ref2.idPrefix;
  var idPrefix = _ref2$idPrefix === undefined ? 'egg-' : _ref2$idPrefix;
  var selectedIndex = _ref2.selectedIndex;
  var onClick = _ref2.onClick;


  var ODD_EGG_MARGIN = 8,
      EVEN_EGG_MARGIN = 35;
  var orgViews = void 0;

  function eggViewForIndex(egg, index, margin) {
    var id = '' + idPrefix + index,
        visibilityStyle = egg && egg.basket == null ? {} : { visibility: 'hidden' },
        eggStyle = Object.assign({ marginLeft: margin, marginRight: margin }, visibilityStyle);
    return _react2.default.createElement(EggView, { egg: egg, id: id, key: id, index: index, displayStyle: eggStyle,
      isSelected: index === selectedIndex, onClick: onClick });
  }

  // even number of eggs
  if (eggs.length % 2 === 0) {
    orgViews = eggs.map(function (egg, index) {
      return eggViewForIndex(egg, index, EVEN_EGG_MARGIN);
    });
  } else {
    orgViews = eggs.reduce(function (prev, egg, index) {
      prev.push(eggViewForIndex(egg, index, ODD_EGG_MARGIN));
      // for flex layout purposes, with odd numbers of items
      // we add spacer items between the eggs
      var spacerID = '' + idPrefix + index + '-spacer',
          spacerStyle = { marginLeft: ODD_EGG_MARGIN, marginRight: ODD_EGG_MARGIN,
        visibility: 'hidden' };
      prev.push(_react2.default.createElement(EggView, { egg: null, key: spacerID, displayStyle: spacerStyle }));
      return prev;
    }, []);
  }

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks egg-clutch' },
    orgViews
  );
};

EggClutchView.propTypes = {
  eggs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  idPrefix: _react.PropTypes.string,
  selectedIndex: _react.PropTypes.number,
  onClick: _react.PropTypes.func
};

exports.default = EggClutchView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],62:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Implements a rectangular text area for providing feedback to users, such as
 * that used in Geniverse's challenges for providing trial and goal feedback.
 * Implemented as a React stateless functional component.
 *
 * @param {string|string[]} text - a single or multiple lines of text to display
 * @param {object} style - inline styles applied to the <div> containing each line of text
 */
var FeedbackView = function FeedbackView(_ref) {
  var text = _ref.text;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var tText = Array.isArray(text) ? text : [text],
      lineCount = tText.length,
      height = 20 * lineCount + 2,
      defaultStyle = _extends({ height: height }, style),
      textLines = tText.map(function (iText, index) {
    return _react2.default.createElement(
      "div",
      { className: "geniblocks feedback text-line", key: index },
      iText
    );
  });

  return _react2.default.createElement(
    "div",
    { className: "geniblocks feedback-view", style: defaultStyle },
    textLines
  );
};

FeedbackView.propTypes = {
  text: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]).isRequired,
  style: _react.PropTypes.object
};

exports.default = FeedbackView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],63:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GAMETE_TYPE = undefined;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _animatedGamete = require('./animated-gamete');

var _animatedGamete2 = _interopRequireDefault(_animatedGamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var INITIAL_GAMETE_SIZE = 30,
    FINAL_GAMETE_SIZE = 140,
    RESTING_MOTHER_GAMETE_X = 0,
    RESTING_FATHER_GAMETE_X = 150,
    FERTILIZING_MOTHER_GAMETE_X = 70,
    FERTILIZING_FATHER_GAMETE_X = 80,
    FINAL_ZYGOTE_Y = -150;

var GAMETE_TYPE = exports.GAMETE_TYPE = { MOTHER: 'mother', FATHER: 'father' };

var FertilizingGameteView = function (_React$Component) {
  _inherits(FertilizingGameteView, _React$Component);

  function FertilizingGameteView(props) {
    _classCallCheck(this, FertilizingGameteView);

    var _this = _possibleConstructorReturn(this, (FertilizingGameteView.__proto__ || Object.getPrototypeOf(FertilizingGameteView)).call(this, props));

    _this.render = function () {
      var _this$props = _this.props;
      var gamete = _this$props.gamete;
      var id = _this$props.id;
      var hiddenAlleles = _this$props.hiddenAlleles;
      var animStiffness = _this$props.animStiffness;
      var onRest = _this$props.onRest;
      var xOffset = _this.props.srcRect ? _this.props.srcRect.left - _this.props.dstRect.left : 0;
      var yOffset = _this.props.srcRect ? _this.props.srcRect.top - _this.props.dstRect.top : 0;
      var xResting = _this.props.type === GAMETE_TYPE.FATHER ? RESTING_FATHER_GAMETE_X : RESTING_MOTHER_GAMETE_X;
      var xFertilizing = _this.props.type === GAMETE_TYPE.FATHER ? FERTILIZING_FATHER_GAMETE_X : FERTILIZING_MOTHER_GAMETE_X;
      var initial = void 0;var tFinal = void 0;

      if (!gamete || id == null) return;

      if (_this.props.fertilizationState === 'none') {
        if (_this.props.type === GAMETE_TYPE.FATHER) xOffset += RESTING_FATHER_GAMETE_X;
        initial = { x: xOffset, y: yOffset, size: INITIAL_GAMETE_SIZE };
        tFinal = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE };
      } else if (_this.props.fertilizationState === 'fertilizing') {
        initial = { x: xResting, y: 0, size: FINAL_GAMETE_SIZE, opacity: 1.0 };
        tFinal = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
      } else {
        initial = { x: xFertilizing, y: 0, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 1.0 };
        tFinal = { x: xFertilizing, y: FINAL_ZYGOTE_Y, size: FINAL_GAMETE_SIZE, rotation: 0, opacity: 0.0 };
      }

      return _react2.default.createElement(_animatedGamete2.default, { gamete: gamete, id: id, hiddenAlleles: hiddenAlleles,
        initialDisplay: initial, display: tFinal,
        animStiffness: animStiffness, onRest: onRest });
    };

    return _this;
  }

  return FertilizingGameteView;
}(_react2.default.Component);

FertilizingGameteView.propTypes = {
  type: _react.PropTypes.oneOf([GAMETE_TYPE.MOTHER, GAMETE_TYPE.FATHER]).isRequired,
  gamete: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.number.isRequired,
  fertilizationState: _react.PropTypes.oneOf(['none', 'fertilizing', 'fertilized', 'complete']).isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  srcRect: _react.PropTypes.shape({
    left: _react.PropTypes.number.isRequired,
    top: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }),
  dstRect: _react.PropTypes.shape({
    left: _react.PropTypes.number.isRequired,
    top: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired
  }),
  animStiffness: _react.PropTypes.number, // stiffness of spring for animation (default: 100)
  onRest: _react.PropTypes.func
};
FertilizingGameteView.defaultProps = {
  hiddenAlleles: [],
  animStiffness: 100
};
exports.default = FertilizingGameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./animated-gamete":52}],64:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _animatedGamete = require('./animated-gamete');

var _animatedGamete2 = _interopRequireDefault(_animatedGamete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GametePoolView = function GametePoolView(_ref) {
  var gametes = _ref.gametes;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 300 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 200 : _ref$height;
  var _ref$animStiffness = _ref.animStiffness;
  var animStiffness = _ref$animStiffness === undefined ? 60 : _ref$animStiffness;
  var selectedId = _ref.selectedId;
  var isGameteDisabled = _ref.isGameteDisabled;
  var onGameteSelected = _ref.onGameteSelected;

  var gameteCount = gametes.length,
      gameteSize = 30,
      margin = 5,
      spacingDefault = gameteSize + 2 * margin,
      xSpacing = spacingDefault,
      ySpacing = spacingDefault,
      colDefault = Math.floor(width / spacingDefault),
      rowDefault = Math.floor(height / spacingDefault),
      enabledCount = 0,
      disabledCount = 0,
      disabledFlags = isGameteDisabled ? gametes.map(function (g) {
    return isGameteDisabled(g);
  }) : [],
      totalDisabledCount = disabledFlags.reduce(function (total, flag) {
    return total + flag;
  }, 0),

  // leave room for the disabled gamete row if there are disabled gametes
  availableHeight = height - (totalDisabledCount ? spacingDefault : 0) - 4 * margin,

  // pack the disabled gametes into the disabled row
  xDisabledSpacing = Math.min(xSpacing / 2, (width - 7 * margin) / totalDisabledCount),
      yDisabledSpacing = spacingDefault,
      totalEnabledCount = gameteCount - totalDisabledCount,
      gameteViews = void 0;

  // squeeze in to make room for additional gametes if necessary
  var colCount = colDefault,
      rowCount = rowDefault - (totalDisabledCount > 0);
  while (colCount * rowCount < totalEnabledCount) {
    if (ySpacing > xSpacing) {
      ySpacing = availableHeight / ++rowCount;
    } else {
      xSpacing = (width - 4 * margin) / ++colCount;
    }
  }

  gameteViews = gametes.map(function (gamete, index) {
    var isDisabled = disabledFlags[index],
        layoutIndex = isDisabled ? disabledCount++ : enabledCount++,
        row = isDisabled ? rowDefault - 1 : Math.floor(layoutIndex / colCount),
        col = isDisabled ? layoutIndex : layoutIndex % colCount,
        y = isDisabled ? row * yDisabledSpacing : row * ySpacing,
        x = isDisabled ? col * xDisabledSpacing : col * xSpacing;
    return _react2.default.createElement(_animatedGamete2.default, { gamete: gamete, id: index + 1, key: index,
      hiddenAlleles: hiddenAlleles,
      initialDisplay: { x: Math.round(width / 2), y: -Math.round(ySpacing) },
      display: { x: Math.round(x), y: Math.round(y) },
      animStiffness: animStiffness,
      isSelected: index + 1 === selectedId,
      isDisabled: isDisabled,
      onClick: onGameteSelected });
  });

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks gamete-pool', style: { width: width, height: height } },
    gameteViews
  );
};

GametePoolView.propTypes = {
  gametes: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  animStiffness: _react.PropTypes.number,
  selectedId: _react.PropTypes.number,
  isGameteDisabled: _react.PropTypes.func,
  onGameteSelected: _react.PropTypes.func
};

exports.default = GametePoolView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./animated-gamete":52}],65:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Stateless functional React component for displaying a Biologica gamete
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} hiddenAlleles - individual alleles of genes for which all alleles should be hidden
 * @param {Object} display - display parameters used to represent the gamete
 * @param {number} display.x - location (left) of the gamete
 * @param {number} display.y - location (top) of the gamete
 * @param {number} [display.size=30] - size (width & height) of the gamete
 * @param {number} [display.rotation=0] - rotation of the gamete
 * @param {number} [display.opacity=1] - opacity of the gamete
 * @param {boolean} [isSelected=false] - whether the gamete should have the 'selected' class applied
 * @param {boolean} [isDisabled=false] - whether the gamete should have the 'disabled' class applied
 * @param {function} [onClick(evt, id, rect)] - callback function to be called when the gamete is clicked
 *
 * Note: As things stand currently, there is _no_ particular representation of the gamete defined
 * by this view. The client can style the representation of the gamete by styling the
 * '.geniblocks.gamete' class in CSS, e.g. by assigning a background-image.
 */
var GameteView = function GameteView(_ref) {
  var gamete = _ref.gamete;
  var id = _ref.id;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var display = _ref.display;
  var _ref$isSelected = _ref.isSelected;
  var isSelected = _ref$isSelected === undefined ? false : _ref$isSelected;
  var _ref$isDisabled = _ref.isDisabled;
  var isDisabled = _ref$isDisabled === undefined ? false : _ref$isDisabled;
  var onClick = _ref.onClick;


  function handleClick(evt) {
    var elt = evt.target,
        rect = elt.getBoundingClientRect();
    if (!isDisabled && onClick) {
      onClick(evt, id, rect);
    }
  }

  function buildTooltipForGamete(gamete) {
    var tooltip = "",
        allHiddenAlleles = void 0;
    // Note: it would be more efficient for the caller to pass in the
    // allHiddenAlleles array rather than computing it each time here.
    // But if we moved it out right now we'd have to eliminate the ES6 splat.
    function concatHiddenAlleles(iSpecies, iHiddenAlleles) {
      allHiddenAlleles = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = iHiddenAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _allHiddenAlleles;

          var allele = _step.value;

          var gene = BioLogica.Genetics.getGeneOfAllele(iSpecies, allele);
          (_allHiddenAlleles = allHiddenAlleles).push.apply(_allHiddenAlleles, _toConsumableArray(gene.alleles));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    for (var ch in gamete) {
      var chromosome = gamete[ch];
      if (allHiddenAlleles == null) concatHiddenAlleles(chromosome.species, hiddenAlleles);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = chromosome.alleles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var allele = _step2.value;

          if (allHiddenAlleles.indexOf(allele) < 0) {
            var label = chromosome.species.alleleLabelMap[allele];
            tooltip += (tooltip ? '\n' : '') + ch + ': ' + label;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (ch === 'XY') {
        var value = chromosome.side === 'y' ? 'y' : 'x';
        tooltip += (tooltip ? '\n' : '') + ch + ': ' + value;
      }
    }
    return tooltip;
  }

  var selectedClass = isSelected && !isDisabled ? "selected" : "",
      disabledClass = isDisabled ? "disabled" : "",
      group = id % 4,
      rotationForGroup = group * 90,
      classes = 'geniblocks gamete ' + selectedClass + ' ' + disabledClass + ' group' + group,
      size = display.size || 30,
      rotation = display.rotation != null ? display.rotation : rotationForGroup,
      transform = rotation ? 'rotate(' + rotation + 'deg)' : '',
      opacity = display.opacity != null ? display.opacity : 1.0,
      tooltip = buildTooltipForGamete(gamete);
  return _react2.default.createElement('div', { className: classes, title: tooltip,
    style: {
      left: display.x, top: display.y,
      width: size, height: size,
      transform: transform, opacity: opacity
    },
    onClick: handleClick });
};

GameteView.propTypes = {
  gamete: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.number.isRequired,
  hiddenAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  display: _react.PropTypes.shape({ // display properties
    x: _react.PropTypes.number.isRequired, // location (left) of gamete image
    y: _react.PropTypes.number.isRequired, // location (top) of gamete image
    size: _react.PropTypes.number, // size of gamete image (default: 30)
    rotation: _react.PropTypes.number, // rotation (deg) of gamete image (default: 0|90|180|270)
    opacity: _react.PropTypes.number // opacity of gamete image (default: 1.0)
  }).isRequired,
  isSelected: _react.PropTypes.bool,
  isDisabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func
};

exports.default = GameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],66:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GeneLabelView = function GeneLabelView(_ref) {
  var species = _ref.species;
  var allele = _ref.allele;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? false : _ref$editable;
  var onAlleleChange = _ref.onAlleleChange;

  if (!editable) {
    var alleleName = species.alleleLabelMap[allele];
    return _react2.default.createElement(
      "div",
      { className: "geniblocks gene-label allele noneditable" },
      _react2.default.createElement(
        "span",
        null,
        alleleName
      )
    );
  } else {
    var _ret = function () {
      var alleles = BioLogica.Genetics.getGeneOfAllele(species, allele).alleles,
          alleleNames = alleles.map(function (a) {
        return species.alleleLabelMap[a];
      }),
          alleleOptions = alleleNames.map(function (name, i) {
        return _react2.default.createElement(
          "option",
          { key: name, value: alleles[i] },
          name
        );
      });
      return {
        v: _react2.default.createElement(
          "div",
          { className: "geniblocks gene-label allele editable" },
          _react2.default.createElement(
            "select",
            { value: allele, onChange: onAlleleChange },
            alleleOptions
          )
        )
      };
    }();

    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
  }
};

GeneLabelView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  allele: _react.PropTypes.string.isRequired,
  editable: _react.PropTypes.bool,
  onAlleleChange: _react.PropTypes.func
};

exports.default = GeneLabelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],67:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestPulldownView = function TestPulldownView(_ref) {
  var species = _ref.species;
  var gene = _ref.gene;
  var selection = _ref.selection;
  var onSelectionChange = _ref.onSelectionChange;

  var alleles = gene.alleles,
      alleleNames = alleles.map(function (a) {
    return species.alleleLabelMap[a];
  }),
      numAlleles = alleleNames.length,
      possibleCombos = [],
      currentSelection = selection || "placeholder",
      i = void 0,
      j = void 0;

  possibleCombos.push(_react2.default.createElement(
    'option',
    { key: 'placeholder', value: 'placeholder', disabled: 'disabled' },
    'Select a Genotype'
  ));

  for (i = 0; i < numAlleles; i++) {
    for (j = i; j < numAlleles; j++) {
      var key = i + " " + j,
          string = alleleNames[i] + " / " + alleleNames[j];
      possibleCombos.push(_react2.default.createElement(
        'option',
        { key: key, value: key },
        string
      ));
    }
  }

  return _react2.default.createElement(
    'div',
    { className: 'select-wrapper' },
    _react2.default.createElement(
      'select',
      { value: currentSelection, onChange: onSelectionChange },
      possibleCombos
    )
  );
};

var GenomeTestView = function GenomeTestView(_ref2) {
  var org = _ref2.org;
  var _ref2$hiddenAlleles = _ref2.hiddenAlleles;
  var hiddenAlleles = _ref2$hiddenAlleles === undefined ? [] : _ref2$hiddenAlleles;
  var _ref2$selection = _ref2.selection;
  var selection = _ref2$selection === undefined ? {} : _ref2$selection;
  var _onSelectionChange = _ref2.onSelectionChange;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          alleles = chrom[Object.keys(chrom)[0]].alleles,
          visibleAlleles = _geneticsUtils2.default.filterAlleles(alleles, hiddenAlleles, org.species),
          genes = visibleAlleles.map(function (a) {
        return BioLogica.Genetics.getGeneOfAllele(org.species, a);
      }),
          pulldowns = genes.map(function (g) {
        return _react2.default.createElement(TestPulldownView, {
          key: g.name,
          species: org.species,
          gene: g,
          selection: selection[g.name],
          onSelectionChange: function onSelectionChange(event) {
            _onSelectionChange(g, event.target.value);
          }
        });
      });

      pairWrappers.push(_react2.default.createElement(
        'div',
        { className: 'items', key: chromosomeName },
        _react2.default.createElement(_chromosomeImage2.default, null),
        _react2.default.createElement(_chromosomeImage2.default, null),
        _react2.default.createElement(
          'div',
          { className: 'genome-test-options' },
          pulldowns
        )
      ));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks genome-test' },
    pairWrappers
  );
};

TestPulldownView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  gene: _react.PropTypes.object.isRequired,
  selection: _react.PropTypes.string,
  onSelectionChange: _react.PropTypes.func.isRequired
};

GenomeTestView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  hiddenAlleles: _react.PropTypes.array,
  selection: _react.PropTypes.object,
  onSelectionChange: _react.PropTypes.func.isRequired
};

exports.default = GenomeTestView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":80,"./chromosome-image":58}],68:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _chromosome = require('./chromosome');

var _chromosome2 = _interopRequireDefault(_chromosome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * View of the set of chromosomes of an organism, ordered as matched pairs.
 *
 * Usually defined by passing in a Biologica Organism, but may also be defined by
 * passing in a map of Biologica Chromosomes and a Biologica Species.
 */
var GenomeView = function GenomeView(_ref) {
  var org = _ref.org;
  var _ref$className = _ref.className;
  var className = _ref$className === undefined ? "" : _ref$className;
  var chromosomes = _ref.chromosomes;
  var species = _ref.species;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var _ref$showLabels = _ref.showLabels;
  var showLabels = _ref$showLabels === undefined ? true : _ref$showLabels;
  var _ref$showAlleles = _ref.showAlleles;
  var showAlleles = _ref$showAlleles === undefined ? false : _ref$showAlleles;
  var _ref$selectedChromoso = _ref.selectedChromosomes;
  var selectedChromosomes = _ref$selectedChromoso === undefined ? {} : _ref$selectedChromoso;
  var _ref$small = _ref.small;
  var small = _ref$small === undefined ? false : _ref$small;
  var orgName = _ref.orgName;
  var displayStyle = _ref.displayStyle;
  var _onAlleleChange = _ref.onAlleleChange;
  var _onChromosomeSelected = _ref.onChromosomeSelected;

  var pairWrappers = [];
  if (org) {
    chromosomes = org.genetics.genotype.chromosomes;
    species = org.species;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var chromosomeName = _step.value;

      var chrom = chromosomes[chromosomeName],
          pairs = [];

      var _loop2 = function _loop2(side) {
        var chromosome = chrom[side];
        pairs.push(_react2.default.createElement(_chromosome2.default, {
          chromosome: chromosome,
          key: pairs.length + 1,
          hiddenAlleles: hiddenAlleles,
          labelsOnRight: pairs.length > 0 || side === "b",
          editable: editable,
          selected: selectedChromosomes[chromosomeName] === side,
          showLabels: showLabels,
          showAlleles: showAlleles,
          small: small,
          orgName: orgName,
          displayStyle: displayStyle,
          onAlleleChange: function onAlleleChange(prevAllele, newAllele) {
            _onAlleleChange(chromosomeName, side, prevAllele, newAllele);
          },
          onChromosomeSelected: function onChromosomeSelected(el) {
            if (_onChromosomeSelected) _onChromosomeSelected(org, chromosomeName, side, el);
          } }));
      };

      for (var side in chrom) {
        _loop2(side);
      }
      pairWrappers.push(_react2.default.createElement(
        'div',
        { className: 'geniblocks chromosome-pair', key: pairWrappers.length + 1 },
        pairs
      ));
    };

    for (var _iterator = species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var classes = "geniblocks genome" + (className ? " " + className : "");
  return _react2.default.createElement(
    'div',
    { className: classes },
    pairWrappers
  );
};

GenomeView.propTypes = {
  org: _react.PropTypes.object,
  className: _react.PropTypes.string,
  chromosomes: _react.PropTypes.object,
  species: _react.PropTypes.object,
  hiddenAlleles: _react.PropTypes.array,
  onAlleleChange: _react.PropTypes.func,
  editable: _react.PropTypes.bool,
  showLabels: _react.PropTypes.bool,
  showAlleles: _react.PropTypes.bool,
  selectedChromosomes: _react.PropTypes.object,
  small: _react.PropTypes.bool,
  displayStyle: _react.PropTypes.object,
  onChromosomeSelected: _react.PropTypes.func,
  orgName: _react.PropTypes.string
};

exports.default = GenomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./chromosome":59}],69:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var GlowBackgroundView = function GlowBackgroundView(_ref) {
  var id = _ref.id;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$containerStyle = _ref.containerStyle;
  var containerStyle = _ref$containerStyle === undefined ? {} : _ref$containerStyle;
  var _ref$glowStyle = _ref.glowStyle;
  var glowStyle = _ref$glowStyle === undefined ? {} : _ref$glowStyle;
  var ChildComponent = _ref.ChildComponent;
  var _ref$childStyle = _ref.childStyle;
  var childStyle = _ref$childStyle === undefined ? {} : _ref$childStyle;

  var others = _objectWithoutProperties(_ref, ['id', 'color', 'size', 'containerStyle', 'glowStyle', 'ChildComponent', 'childStyle']);

  var tContainerStyle = _extends({ position: 'relative', width: size, height: size }, containerStyle),
      tGlowStyle = _extends({ position: 'absolute' }, glowStyle),
      tChildStyle = _extends({ position: 'absolute' }, childStyle);

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks glow-background', style: tContainerStyle },
    _react2.default.createElement(_circularGlow2.default, { id: 'glow-' + id, color: color, size: size, style: tGlowStyle }),
    _react2.default.createElement(ChildComponent, _extends({ id: 'child-' + id, style: tChildStyle, width: size }, others))
  );
};

GlowBackgroundView.propTypes = {
  id: _react.PropTypes.string.isRequired,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number.isRequired,
  containerStyle: _react.PropTypes.object,
  glowStyle: _react.PropTypes.object,
  ChildComponent: _react.PropTypes.func.isRequired,
  childStyle: _react.PropTypes.object
};

exports.default = GlowBackgroundView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":60}],70:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * Based on ReactOverlays demo at http://react-bootstrap.github.io/react-overlays/examples/#modals
                                                                                                                                                                                                                                                                   */


var _Modal = require('react-overlays/lib/Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _challengeAward = require('./challenge-award');

var _challengeAward2 = _interopRequireDefault(_challengeAward);

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _translate = require('../utilities/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

var backdropStyle = _extends({}, modalStyle, {
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.1
});

var dialogStyle = function dialogStyle() {
  var top = arguments.length <= 0 || arguments[0] === undefined ? "50%" : arguments[0];

  // we use some pseudo random coords so nested modals
  // don't sit right on top of each other.
  var left = 50;
  return {
    position: 'absolute',
    width: 385,
    top: top, left: left + '%',
    transform: 'translate(-50%, -' + left + '%)',
    backgroundImage: 'url(resources/images/parchment.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'border-box',
    boxShadow: '0 10px 5px rgba(0,0,0,.5)',
    padding: 20,
    outline: 'none'
  };
};

var ModalAlert = function (_React$Component) {
  _inherits(ModalAlert, _React$Component);

  function ModalAlert() {
    _classCallCheck(this, ModalAlert);

    return _possibleConstructorReturn(this, (ModalAlert.__proto__ || Object.getPrototypeOf(ModalAlert)).apply(this, arguments));
  }

  _createClass(ModalAlert, [{
    key: 'render',
    value: function render() {
      /* eslint react/jsx-handler-names: 0 */
      var leftProps = this.props.leftButton || {},
          leftButton = leftProps.label ? _react2.default.createElement(_button2.default, { label: leftProps.label || "",
        className: 'alert-button',
        onClick: leftProps.onClick || this.props.onLeftButtonClick }) : null,
          rightProps = this.props.rightButton || {},
          rightButton = _react2.default.createElement(_button2.default, { label: rightProps.label || "",
        className: 'alert-button',
        onClick: rightProps.onClick || this.props.onRightButtonClick });
      var awardView, explanationView;

      if (this.props.challengeAwards) {
        awardView = _react2.default.createElement(_challengeAward2.default, { challengeAwards: this.props.challengeAwards });
      }
      if (this.props.explanation) {
        explanationView = _react2.default.createElement(
          'p',
          null,
          (0, _translate2.default)(this.props.explanation)
        );
      }
      return _react2.default.createElement(
        _Modal2.default,
        { 'aria-labelledby': 'modal-label',
          style: modalStyle,
          backdropStyle: backdropStyle,
          show: this.props.show,
          onHide: this.props.onHide },
        _react2.default.createElement(
          'div',
          { style: dialogStyle(this.props.top) },
          _react2.default.createElement(
            'h4',
            { id: 'modal-label' },
            (0, _translate2.default)(this.props.message)
          ),
          awardView,
          explanationView,
          leftButton,
          ' ',
          rightButton
        )
      );
    }
  }]);

  return ModalAlert;
}(_react2.default.Component);

ModalAlert.propTypes = {
  show: _react.PropTypes.bool,
  message: _react2.default.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array]),
  explanation: _react2.default.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array]),
  leftButton: _react.PropTypes.shape({
    label: _react2.default.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array]),
    onClick: _react.PropTypes.func
  }),
  rightButton: _react.PropTypes.shape({
    label: _react2.default.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.array]),
    onClick: _react.PropTypes.func
  }),
  onHide: _react.PropTypes.func,
  onLeftButtonClick: _react.PropTypes.func, // optional click handlers if not defined
  onRightButtonClick: _react.PropTypes.func, // in button props. (Better for `mapDispatchToProps`)
  challengeAwards: _react.PropTypes.object,
  top: _react.PropTypes.string
};
ModalAlert.defaultProps = {
  show: false,
  challengeAwards: { id: 0, progress: [] }
};
exports.default = ModalAlert;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/translate":83,"./button":55,"./challenge-award":56,"react-overlays/lib/Modal":36}],71:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Presents either a BioLogica organism or a simple number within a square border.
 * Designed to be used as trial feedback indicating the number of trials successfully
 * completed, for instance.
 *
 * @param {string} id - a unique id for CSS purposes
 * @param {string} className - CSS class to be applied
 * @param {number} ordinal - the numeric value to be represented if no organism specified
 * @param {BioLogica.Organism} organism - the organism to be represented
 * @param {number} size - the width and height of the view
 */
var OrdinalOrganismView = function OrdinalOrganismView(_ref) {
  var id = _ref.id;
  var className = _ref.className;
  var ordinal = _ref.ordinal;
  var organism = _ref.organism;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 32 : _ref$size;

  var other = _objectWithoutProperties(_ref, ['id', 'className', 'ordinal', 'organism', 'size']);

  var containerStyle = { width: size, height: size },
      orgView = organism != null ? _react2.default.createElement(_organism2.default, _extends({ id: id + '-organism', org: organism, width: size }, other)) : _react2.default.createElement(
    'div',
    { className: 'ordinal' },
    ordinal
  );

  return _react2.default.createElement(
    'div',
    { id: id, className: 'geniblocks ordinal-organism ' + className, style: containerStyle },
    orgView
  );
};

OrdinalOrganismView.propTypes = {
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  ordinal: _react.PropTypes.number,
  organism: _react.PropTypes.object,
  size: _react.PropTypes.number
};

exports.default = OrdinalOrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism":73}],72:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Represents a BioLogica organism as an image on top of a circular gradient "glow" background.
 * Implemented as a React stateless functional component.
 *
 * @param {BioLogica.Organism} org - the organism to be represented
 * @param {string} color - the color of the circular gradient "glow" background view.
 * @param {number} size
 */
var OrganismGlowView = function OrganismGlowView(_ref) {
  var _ref$id = _ref.id;
  var id = _ref$id === undefined ? 'org-glow' : _ref$id;
  var _ref$className = _ref.className;
  var className = _ref$className === undefined ? '' : _ref$className;
  var _ref$color = _ref.color;
  var color = _ref$color === undefined ? "#FFFFAA" : _ref$color;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 200 : _ref$size;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var _ref$glowStyle = _ref.glowStyle;
  var glowStyle = _ref$glowStyle === undefined ? {} : _ref$glowStyle;

  var other = _objectWithoutProperties(_ref, ['id', 'className', 'color', 'size', 'style', 'glowStyle']);

  var containerStyle = { position: 'relative', width: size, height: size },
      localGlowStyle = _extends({ position: 'absolute' }, glowStyle),
      orgStyle = _extends({ position: 'absolute' }, style);

  return _react2.default.createElement(
    'div',
    { id: id, className: 'geniblocks organism-glow ' + className, style: containerStyle },
    _react2.default.createElement(_circularGlow2.default, { id: id + '-glow', color: color, size: size, style: localGlowStyle }),
    _react2.default.createElement(_organism2.default, _extends({ id: id + '-organism', width: size, style: orgStyle }, other))
  );
};

OrganismGlowView.propTypes = {
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  color: _react.PropTypes.string,
  size: _react.PropTypes.number,
  style: _react.PropTypes.object,
  glowStyle: _react.PropTypes.object
};

exports.default = OrganismGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":60,"./organism":73}],73:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$className = _ref.className;
  var className = _ref$className === undefined ? "" : _ref$className;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$flipped = _ref.flipped;
  var flipped = _ref$flipped === undefined ? false : _ref$flipped;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onClick = _ref.onClick;
  var wrapper = _ref.wrapper;

  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url = org ? baseUrl + org.getImageName() : null,

  // The goal here was to have the onMouseDown handler select the organism,
  // so that mousedown-drag will both select the organism and begin the
  // drag. This works on Chrome and Safari, but on Firefox it disables
  // dragging. Disabling the onMouseDown handler means that Firefox users
  // must click to select and then click to drag, but at least they can
  // drag. The right solution is probably to allow organisms to be dragged
  // whether or not they're selected and then hopefully the onMouseDown
  // handler will work as expected. Otherwise, it may be necessary to
  // select the organism (if it isn't already selected) in beginDrag.
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0,
      handleMouseDown = isFirefox ? undefined : handleClick,
      divWrapper = wrapper || function (elt) {
    return elt;
  };

  var classes = "geniblocks organism" + (className ? " " + className : "");
  if (flipped) {
    classes += " flipped";
  }

  function handleClick() {
    if (onClick) onClick(id, org);
  }

  return divWrapper(_react2.default.createElement(
    "div",
    { className: classes, id: id, style: style,
      onMouseDown: onClick ? handleMouseDown : null,
      onClick: onClick ? handleClick : null },
    url ? _react2.default.createElement("img", { src: url, width: width }) : null
  ));
};

OrganismView.propTypes = {
  org: _react.PropTypes.object,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  width: _react.PropTypes.number,
  style: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  wrapper: _react.PropTypes.func
};

exports.default = OrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],74:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _pen = require('./pen');

var _pen2 = _interopRequireDefault(_pen);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

var _reactSimpletabs = require('react-simpletabs');

var _reactSimpletabs2 = _interopRequireDefault(_reactSimpletabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PenStatsView = function (_React$Component) {
  _inherits(PenStatsView, _React$Component);

  function PenStatsView() {
    _classCallCheck(this, PenStatsView);

    return _possibleConstructorReturn(this, (PenStatsView.__proto__ || Object.getPrototypeOf(PenStatsView)).apply(this, arguments));
  }

  _createClass(PenStatsView, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var orgs = _props.orgs;
      var lastClutchSize = _props.lastClutchSize;
      var selectedIndex = _props.selectedIndex;
      var onSelectionChange = _props.onSelectionChange;
      var others = _objectWithoutProperties(_props, ['orgs', 'lastClutchSize', 'selectedIndex', 'onSelectionChange']);
      var lastClutch = orgs.slice(-lastClutchSize);

      return _react2.default.createElement(
        _reactSimpletabs2.default,
        null,
        _react2.default.createElement(
          _reactSimpletabs2.default.Panel,
          { title: 'Breeding Pen', key: 'Breeding Pen' },
          _react2.default.createElement(_pen2.default, _extends({ orgs: lastClutch }, others, {
            selectedIndex: selectedIndex,
            onClick: function onClick(iSelectedIndex) {
              if (onSelectionChange) onSelectionChange(iSelectedIndex);
            } }))
        ),
        _react2.default.createElement(
          _reactSimpletabs2.default.Panel,
          { title: 'Stats', key: 'Stats' },
          _react2.default.createElement(_stats2.default, { orgs: orgs, lastClutchSize: lastClutchSize })
        )
      );
    }
  }]);

  return PenStatsView;
}(_react2.default.Component);

PenStatsView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  lastClutchSize: _react.PropTypes.number.isRequired,
  selectedIndex: _react.PropTypes.number,
  onSelectionChange: _react.PropTypes.func
};
exports.default = PenStatsView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./pen":75,"./stats":78,"react-simpletabs":48}],75:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {number} rows - Option number of rows. If defined, it will be fixed at that. Otherwise, it
 *                        will default to 1 when there are no orgs, and grows as more rows are needed.
 * @param {number} tightenRows - If given, will shrink the vertical height of the pen by this amount
 *                        per row, crowding the org images as needed.
 */
var PenView = function PenView(_ref) {
  var orgs = _ref.orgs;
  var _ref$idPrefix = _ref.idPrefix;
  var idPrefix = _ref$idPrefix === undefined ? 'organism-' : _ref$idPrefix;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 400 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 5 : _ref$columns;
  var rows = _ref.rows;
  var _ref$tightenRows = _ref.tightenRows;
  var tightenRows = _ref$tightenRows === undefined ? 0 : _ref$tightenRows;
  var _ref$tightenColumns = _ref.tightenColumns;
  var tightenColumns = _ref$tightenColumns === undefined ? 0 : _ref$tightenColumns;
  var _ref$SelectedOrganism = _ref.SelectedOrganismView;
  var SelectedOrganismView = _ref$SelectedOrganism === undefined ? _organism2.default : _ref$SelectedOrganism;
  var selectedIndex = _ref.selectedIndex;
  var onClick = _ref.onClick;


  function handleClick(id, org) {
    var prefixIndex = id.indexOf(idPrefix),
        index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  var orgStyle = {
    margin: -tightenRows / 2 + 'px ' + -tightenColumns / 2 + 'px'
  };

  var orgWidth = width / columns,
      orgViews = orgs.map(function (org, index) {
    return index === selectedIndex ? _react2.default.createElement(SelectedOrganismView, { org: org, id: idPrefix + index, index: index, key: index,
      color: '#FFFFAA', size: orgWidth, style: orgStyle, onClick: handleClick }) : _react2.default.createElement(_organism2.default, { org: org, id: idPrefix + index, index: index, key: index,
      width: orgWidth, style: orgStyle, onClick: handleClick });
  });

  rows = rows || Math.ceil(orgViews.length / columns) || 1;

  var height = orgWidth * rows;

  width = width - tightenColumns * columns;
  height = height - tightenRows * rows;

  var style = { width: width, height: height };

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks pen', style: style },
    orgViews
  );
};

PenView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  idPrefix: _react.PropTypes.string,
  width: _react.PropTypes.number,
  columns: _react.PropTypes.number,
  rows: _react.PropTypes.number,
  tightenColumns: _react.PropTypes.number,
  tightenRows: _react.PropTypes.number,
  SelectedOrganismView: _react.PropTypes.func,
  selectedIndex: _react.PropTypes.number,
  onClick: _react.PropTypes.func
};

exports.default = PenView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism":73}],76:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestionGlowView = function QuestionGlowView(_ref) {
  var glowColor = _ref.glowColor;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 200 : _ref$size;

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' };

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks question-glow', style: containerStyle },
    _react2.default.createElement(_circularGlow2.default, { color: glowColor, size: size, style: glowStyle }),
    _react2.default.createElement('div', { className: 'geniblocks question-glow question-mark',
      style: { position: "absolute", width: size, height: size } })
  );
  // HTML text node
  //<div style={tStyle}>{text}</div>

  // SVG text node
  //<svg width={size+2} height={size+2} xmlns="http://www.w3.org/2000/svg">
  //  <text x='50' y='175' fill='#0D0D8C' style={tStyle}>
  //    {text}
  //  </text>
  //</svg>
};

QuestionGlowView.propTypes = {
  glowColor: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number
};

exports.default = QuestionGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":60}],77:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _organismGlow = require('./organism-glow');

var _organismGlow2 = _interopRequireDefault(_organismGlow);

var _questionGlow = require('./question-glow');

var _questionGlow2 = _interopRequireDefault(_questionGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var QuestionOrganismGlowView = function QuestionOrganismGlowView(_ref) {
  var hidden = _ref.hidden;
  var color = _ref.color;
  var size = _ref.size;

  var other = _objectWithoutProperties(_ref, ['hidden', 'color', 'size']);

  var orgView = _react2.default.createElement(_organismGlow2.default, _extends({ color: color, size: size }, other)),
      questionView = _react2.default.createElement(_questionGlow2.default, { glowColor: color, width: size }),
      finalView = hidden ? questionView : orgView;

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks question-organism-glow' },
    finalView
  );
};

QuestionOrganismGlowView.propTypes = {
  hidden: _react.PropTypes.bool,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number
};

exports.default = QuestionOrganismGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism-glow":72,"./question-glow":76}],78:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stateless functional React component for displaying breeding statistics for a set of Biologica organisms
 * @param {Object[]} orgs - array of Biologica organisms for which statistics are to be displayed
 * @param {Object} orgs[].phenotype - the phenotype of the Biologica organism
 * @param {number} [lastClutchSize=orgs.length] - the number of organisms at the end of the array that comprise the most recent clutch
 */
var StatsView = function StatsView(_ref) {
  var orgs = _ref.orgs;
  var lastClutchSize = _ref.lastClutchSize;


  var traits = _geneticsUtils2.default.computeTraitCountsForOrganisms(orgs, lastClutchSize),
      clutchSize = lastClutchSize || orgs.length,
      rows = [];

  // build cumulative stats for table rows
  var traitNum = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = traits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var trait = _step$value[0];
      var values = _step$value[1];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2);

          var value = _step2$value[0];
          var counts = _step2$value[1];

          var cMales = counts.clutch[BioLogica.MALE],
              cFemales = counts.clutch[BioLogica.FEMALE],
              cTotal = cMales + cFemales,
              cPct = Math.round(100 * cTotal / clutchSize),
              tMales = counts.total[BioLogica.MALE],
              tFemales = counts.total[BioLogica.FEMALE],
              tTotal = tMales + tFemales,
              tPct = Math.round(100 * tTotal / orgs.length);
          rows.push({ trait: trait, traitNum: traitNum, value: value, cMales: cMales, cFemales: cFemales, cTotal: cTotal, cPct: cPct,
            tMales: tMales, tFemales: tFemales, tTotal: tTotal, tPct: tPct });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ++traitNum;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks stats' },
    _react2.default.createElement(
      'table',
      { id: 'stats-table', className: orgs.length > 0 ? "has-data" : "no-data" },
      _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            null,
            'Trait Value'
          ),
          _react2.default.createElement(
            'th',
            { colSpan: '2' },
            'Clutch'
          ),
          _react2.default.createElement(
            'th',
            null,
            'F'
          ),
          _react2.default.createElement(
            'th',
            null,
            'M'
          ),
          _react2.default.createElement(
            'th',
            { colSpan: '2' },
            'Total'
          ),
          _react2.default.createElement(
            'th',
            null,
            'F'
          ),
          _react2.default.createElement(
            'th',
            null,
            'M'
          )
        )
      ),
      _react2.default.createElement(
        'tbody',
        null,
        rows.map(function (row, index) {
          return _react2.default.createElement(
            'tr',
            { key: index, className: row.traitNum & 1 ? "odd-trait" : "even-trait",
              'data-trait-value': row.value },
            _react2.default.createElement(
              'td',
              { className: 'label' },
              row.value
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.cTotal
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.cPct,
              '%'
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.cFemales
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.cMales
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.tTotal
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.tPct,
              '%'
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.tFemales
            ),
            _react2.default.createElement(
              'td',
              { className: 'numeric' },
              row.tMales
            )
          );
        })
      )
    )
  );
};

StatsView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  lastClutchSize: _react.PropTypes.number
};

exports.default = StatsView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":80}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alleleFilters = require('./components/allele-filters');

Object.defineProperty(exports, 'AlleleFiltersView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_alleleFilters).default;
  }
});

var _allele = require('./components/allele');

Object.defineProperty(exports, 'AlleleView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_allele).default;
  }
});

var _animatedGamete = require('./components/animated-gamete');

Object.defineProperty(exports, 'AnimatedGameteView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_animatedGamete).default;
  }
});

var _animatedOrganism = require('./components/animated-organism');

Object.defineProperty(exports, 'AnimatedOrganismView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_animatedOrganism).default;
  }
});

var _basketSet = require('./components/basket-set');

Object.defineProperty(exports, 'BasketSetView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_basketSet).default;
  }
});

var _button = require('./components/button');

Object.defineProperty(exports, 'Button', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_button).default;
  }
});

var _changeSexButtons = require('./components/change-sex-buttons');

Object.defineProperty(exports, 'ChangeSexButtons', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_changeSexButtons).default;
  }
});

var _chromosomeImage = require('./components/chromosome-image');

Object.defineProperty(exports, 'ChromosomeImageView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chromosomeImage).default;
  }
});

var _chromosome = require('./components/chromosome');

Object.defineProperty(exports, 'ChromosomeView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chromosome).default;
  }
});

var _circularGlow = require('./components/circular-glow');

Object.defineProperty(exports, 'CircularGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_circularGlow).default;
  }
});

var _eggClutch = require('./components/egg-clutch');

Object.defineProperty(exports, 'EggClutchView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_eggClutch).default;
  }
});

var _feedback = require('./components/feedback');

Object.defineProperty(exports, 'FeedbackView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_feedback).default;
  }
});

var _fertilizingGamete = require('./components/fertilizing-gamete');

Object.defineProperty(exports, 'FertilizingGameteView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fertilizingGamete).default;
  }
});

var _gametePool = require('./components/gamete-pool');

Object.defineProperty(exports, 'GametePoolView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_gametePool).default;
  }
});

var _gamete = require('./components/gamete');

Object.defineProperty(exports, 'GameteView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_gamete).default;
  }
});

var _geneLabel = require('./components/gene-label');

Object.defineProperty(exports, 'GeneLabelView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geneLabel).default;
  }
});

var _genomeTest = require('./components/genome-test');

Object.defineProperty(exports, 'GenomeTestView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_genomeTest).default;
  }
});

var _genome = require('./components/genome');

Object.defineProperty(exports, 'GenomeView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_genome).default;
  }
});

var _glowBackground = require('./components/glow-background');

Object.defineProperty(exports, 'GlowBackgroundView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_glowBackground).default;
  }
});

var _modalAlert = require('./components/modal-alert');

Object.defineProperty(exports, 'ModalAlert', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_modalAlert).default;
  }
});

var _ordinalOrganism = require('./components/ordinal-organism');

Object.defineProperty(exports, 'OrdinalOrganismView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ordinalOrganism).default;
  }
});

var _organism = require('./components/organism');

Object.defineProperty(exports, 'OrganismView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_organism).default;
  }
});

var _organismGlow = require('./components/organism-glow');

Object.defineProperty(exports, 'OrganismGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_organismGlow).default;
  }
});

var _pen = require('./components/pen');

Object.defineProperty(exports, 'PenView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pen).default;
  }
});

var _penStats = require('./components/pen-stats');

Object.defineProperty(exports, 'PenStatsView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_penStats).default;
  }
});

var _questionGlow = require('./components/question-glow');

Object.defineProperty(exports, 'QuestionGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_questionGlow).default;
  }
});

var _questionOrganismGlow = require('./components/question-organism-glow');

Object.defineProperty(exports, 'QuestionOrganismGlowView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_questionOrganismGlow).default;
  }
});

var _stats = require('./components/stats');

Object.defineProperty(exports, 'StatsView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stats).default;
  }
});

var _challengeAward = require('./components/challenge-award');

Object.defineProperty(exports, 'ChallengeAwardView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_challengeAward).default;
  }
});

var _geneticsUtils = require('./utilities/genetics-utils');

Object.defineProperty(exports, 'GeneticsUtils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geneticsUtils).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./components/allele":51,"./components/allele-filters":50,"./components/animated-gamete":52,"./components/animated-organism":53,"./components/basket-set":54,"./components/button":55,"./components/challenge-award":56,"./components/change-sex-buttons":57,"./components/chromosome":59,"./components/chromosome-image":58,"./components/circular-glow":60,"./components/egg-clutch":61,"./components/feedback":62,"./components/fertilizing-gamete":63,"./components/gamete":65,"./components/gamete-pool":64,"./components/gene-label":66,"./components/genome":68,"./components/genome-test":67,"./components/glow-background":69,"./components/modal-alert":70,"./components/ordinal-organism":71,"./components/organism":73,"./components/organism-glow":72,"./components/pen":75,"./components/pen-stats":74,"./components/question-glow":76,"./components/question-organism-glow":77,"./components/stats":78,"./utilities/genetics-utils":80}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class providing utility functions for BioLogica genetics operations.
 * In some cases these are adapted from corresponding code in Geniverse.
 */
var GeneticsUtils = function () {
  function GeneticsUtils() {
    _classCallCheck(this, GeneticsUtils);
  }

  _createClass(GeneticsUtils, null, [{
    key: "ensureValidOrganism",
    value: function ensureValidOrganism(orgOrDef) {
      var species = arguments.length <= 1 || arguments[1] === undefined ? BioLogica.Species.Drake : arguments[1];

      if (orgOrDef.getAlleleString) {
        return orgOrDef;
      }
      return new BioLogica.Organism(species, orgOrDef.alleleString, orgOrDef.sex);
    }

    /**
     * Filters out hidden alleles from an original list of alleles
     *
     * @param {string[]} alleles - the set of alleles to be filtered
     * @param {string[]} hiddenAlleles - the alleles identifying the hidden genes
     * @param {BioLogica.species} species - the species that defines the genotype
     * @return {string[]} - the filtered alleles
     */

  }, {
    key: "filterAlleles",
    value: function filterAlleles(alleles, hiddenAlleles, species) {
      var hiddenGenes = hiddenAlleles.map(function (a) {
        return BioLogica.Genetics.getGeneOfAllele(species, a);
      });
      return alleles.filter(function (a) {
        var gene = BioLogica.Genetics.getGeneOfAllele(species, a);
        return hiddenGenes.indexOf(gene) === -1;
      });
    }

    /**
     * Compute a map of traits -> traitValues -> traitCounts.
     *
     * @param {BioLogica.Organism[]} organisms - the set of organisms to compute stats for
     * @param {number} clutchSize - the last 'clutchSize' organisms are assumed to be the last clutch
     * @return {Map} - e.g. { "tail": { "long tail": { "clutch": [9, 11], "total": [53, 47] }}}
     */

  }, {
    key: "computeTraitCountsForOrganisms",
    value: function computeTraitCountsForOrganisms(organisms, lastClutchSize) {
      var traits = new Map(),
          clutchSize = lastClutchSize || organisms.length;

      // accumulate stats for each trait/value combination
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = organisms.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var index = _step$value[0];
          var org = _step$value[1];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.keys(org.phenotype.characteristics)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var trait = _step2.value;

              var value = org.phenotype.characteristics[trait],
                  traitValues = traits.get(trait) || new Map(),
                  valueCounts = traitValues.get(value) || { clutch: [0, 0], total: [0, 0] };
              if (!traits.has(trait)) traits.set(trait, traitValues);
              if (!traitValues.has(value)) traitValues.set(value, valueCounts);
              // most recent clutch assumed to be at end of organisms array
              if (index >= organisms.length - clutchSize) ++valueCounts.clutch[org.sex];
              ++valueCounts.total[org.sex];
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return traits;
    }

    /**
     * Converts an allele string to a JavaScript object that maps genes to alleles.
     * This can be useful for comparison purposes, for instance.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @return {object} - gene map of form { horns: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
     */

  }, {
    key: "buildGeneMapFromAlleleString",
    value: function buildGeneMapFromAlleleString(genetics, alleleString) {
      var geneMap = {},
          alleleSubstrings = alleleString.split(",");
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = alleleSubstrings[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var alleleSubstr = _step3.value;

          var _alleleSubstr$split = alleleSubstr.split(":");

          var _alleleSubstr$split2 = _slicedToArray(_alleleSubstr$split, 2);

          var side = _alleleSubstr$split2[0];
          var allele = _alleleSubstr$split2[1];
          var gene = genetics.geneForAllele(allele);
          if (side && allele && gene) {
            if (!geneMap[gene]) geneMap[gene] = {};
            geneMap[gene][side] = allele;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return geneMap;
    }

    /**
     * Given an allele string and a gene map defining a set of base (default) alleles,
     * returns a new allele string with missing alleles replaced by their defaults.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @param {object} baseGeneMap - gene map of form { horn: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
     * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
     */

  }, {
    key: "fillInMissingAllelesFromGeneMap",
    value: function fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap) {
      var dstGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, alleleString);
      var dstAlleleString = alleleString;
      for (var gene in dstGeneMap) {
        var geneValue = dstGeneMap[gene];
        // replace a missing 'a' side allele with the default if appropriate
        if (!geneValue.a && baseGeneMap[gene] && baseGeneMap[gene].a) {
          dstAlleleString = dstAlleleString.replace("b:" + geneValue.b, "a:" + baseGeneMap[gene].a + ",$&");
        }
        // replace a missing 'b' side allele with the default if appropriate
        if (!geneValue.b && baseGeneMap[gene] && baseGeneMap[gene].b) {
          dstAlleleString = dstAlleleString.replace("a:" + geneValue.a, "$&,b:" + baseGeneMap[gene].b);
        }
      }
      return dstAlleleString;
    }

    /**
     * Given two allele strings, returns a new allele string in which missing alleles
     * in the first are replaced by defaults provided by the second allele string.
     *
     * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
     * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
     * @param {string} baseAlleleString - allele string of form "a:h,b:h,a:a,b:a..." to use as defaults
     * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
     */

  }, {
    key: "fillInMissingAllelesFromAlleleString",
    value: function fillInMissingAllelesFromAlleleString(genetics, alleleString, baseAlleleString) {
      var baseGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, baseAlleleString);
      return GeneticsUtils.fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap);
    }
  }, {
    key: "numberOfBreedingMovesToReachDrake",
    value: function numberOfBreedingMovesToReachDrake(organism1, organism2, changeableAlleles1, changeableAlleles2, targetOrganism) {
      var moves = 0,
          org1Alleles = organism1.getAlleleString().split(',').map(function (a) {
        return a.split(':')[1];
      }),
          org2Alleles = organism2.getAlleleString().split(',').map(function (a) {
        return a.split(':')[1];
      }),
          targetchars = targetOrganism.phenotype.characteristics,
          traitRules = organism1.species.traitRules;

      for (var trait in traitRules) {
        if (traitRules.hasOwnProperty(trait)) {
          var possibleSolutions = traitRules[trait][targetchars[trait]],
              shortestPath = Infinity;
          if (possibleSolutions && possibleSolutions.length) {
            for (var i = 0, ii = possibleSolutions.length; i < ii; i++) {
              var solution = possibleSolutions[i],
                  movesForSolution1 = 0,
                  movesForSolution2 = 0;
              for (var j = 0, jj = solution.length; j < jj; j++) {
                var allele1 = solution[j],
                    allele2 = j % 2 === 0 ? solution[j + 1] : solution[j - 1],
                    solutionMoves = 0;
                if (org1Alleles.indexOf(allele1) === -1) {
                  if (allele1 && (changeableAlleles1.indexOf(allele1) > -1 || changeableAlleles1.indexOf(allele1.toLowerCase()) > -1)) {
                    solutionMoves++;
                  } else {
                    solutionMoves = Infinity;
                  }
                }

                if (org2Alleles.indexOf(allele2) === -1) {
                  if (allele2 && (changeableAlleles2.indexOf(allele2) > -1 || changeableAlleles2.indexOf(allele2.toLowerCase()) > -1)) {
                    solutionMoves++;
                  } else {
                    solutionMoves = Infinity;
                  }
                }

                if (j % 2 === 0) {
                  movesForSolution1 += solutionMoves;
                } else {
                  movesForSolution2 += solutionMoves;
                }
              }
              shortestPath = Math.min(shortestPath, Math.min(movesForSolution1, movesForSolution2));
            }
            moves += shortestPath;
          }
        }
      }

      return moves;
    }

    /**
     * Returns the number of separate changes, including allele changes and sex changes,
     * required to match the phenotype of the 'testOrganism' to that of the 'targetOrganism'.
     *
     * @param {BioLogica.Organism} testOrganism - the organism to which changes would apply
     * @param {BioLogica.Organism} targetOrganism - the organism that serves as destination
     * @return {number} - the total number of changes required for the phenotypes to match
     */

  }, {
    key: "numberOfChangesToReachPhenotype",
    value: function numberOfChangesToReachPhenotype(testOrganism, targetOrganism) {
      testOrganism = this.ensureValidOrganism(testOrganism);
      targetOrganism = this.ensureValidOrganism(targetOrganism);

      var requiredChangeCount = GeneticsUtils.numberOfAlleleChangesToReachPhenotype(testOrganism.phenotype.characteristics, targetOrganism.phenotype.characteristics, testOrganism.genetics.genotype.allAlleles, testOrganism.species.traitRules);
      if (testOrganism.sex !== targetOrganism.sex) ++requiredChangeCount;

      return requiredChangeCount;
    }

    /**
     * Returns the number of separate allele changes required to make the phenotype of
     * the organism characterized by 'testCharacterstics' match that of the organism
     * characterized by 'targetCharacteristics'. Adapted from:
     * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
     *
     * @param {object} testCharacteristics - the characteristics of the test organism
     * @param {object} targetCharacteristics - the characteristics of the target organism
     * @param {string[]} testAlleles - the array of alleles of the test organism
     * @param {object} traitRules - the traitRules of the BioLogica.Species of the organisms
     * @return {number} - the number of allele changes required for the phenotypes to match
     */

  }, {
    key: "numberOfAlleleChangesToReachPhenotype",
    value: function numberOfAlleleChangesToReachPhenotype(testCharacteristics, targetCharacteristics, testAlleles, traitRules) {
      var alleles = testAlleles;
      var moves = 0;

      for (var trait in traitRules) {
        if (traitRules.hasOwnProperty(trait)) {
          if (testCharacteristics[trait] !== targetCharacteristics[trait]) {
            // first we have to work out what alleles the original drake has that correspond to
            // their non-matching trait
            var possibleTraitAlleles = GeneticsUtils.collectAllAllelesForTrait(trait, traitRules);
            var characteristicAlleles = [];
            for (var i = 0, ii = alleles.length; i < ii; i++) {
              if (possibleTraitAlleles.indexOf(alleles[i]) >= 0) {
                characteristicAlleles.push(alleles[i]);
              }
            }
            // now work out the smallest number of steps to get from there to the desired characteristic
            var possibleSolutions = traitRules[trait][targetCharacteristics[trait]];
            var shortestPathLength = Infinity;
            for (var _i = 0, _ii = possibleSolutions.length; _i < _ii; _i++) {
              var solution = possibleSolutions[_i].slice(),
                  pathLength = 0;
              for (var j = 0, jj = characteristicAlleles.length; j < jj; j++) {
                if (solution.indexOf(characteristicAlleles[j]) === -1) {
                  pathLength++;
                } else {
                  solution.splice(solution.indexOf(characteristicAlleles[j]), 1); // already matched this one, can't match it again
                }
              }
              shortestPathLength = pathLength < shortestPathLength ? pathLength : shortestPathLength;
            }
            moves += shortestPathLength;
          }
        }
      }
      return moves;
    }

    /**
     * Goes through the traitRules to find out what unique alleles are associated with each trait
     * e.g. For "tail" it will return ["T", "Tk", "t"]. Adapted from:
     * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
     *
     * @param {string} trait - name of trait, e.g. "tail"
     * @param {object} traitRules - the traitRules of the BioLogica.Species whose traits are of interest
     * @return {string[]} - array of allele strings, e.g. ["T", "Tk", "t"]
     */

  }, {
    key: "collectAllAllelesForTrait",
    value: function collectAllAllelesForTrait(trait, traitRules) {
      if (GeneticsUtils._possibleAllelesForTrait[trait]) {
        return GeneticsUtils._possibleAllelesForTrait[trait];
      }

      var allelesHash = {},
          alleles = [];
      for (var characteristic in traitRules[trait]) {
        for (var possibileAllelesCombo in traitRules[trait][characteristic]) {
          if (traitRules[trait][characteristic].hasOwnProperty(possibileAllelesCombo)) {
            for (var i = 0, ii = traitRules[trait][characteristic][possibileAllelesCombo].length; i < ii; i++) {
              allelesHash[traitRules[trait][characteristic][possibileAllelesCombo][i]] = 1;
            }
          }
        }
      }

      for (var allele in allelesHash) {
        alleles.push(allele);
      }

      GeneticsUtils._possibleAllelesForTrait[trait] = alleles; // store so we don't need to recalculate it
      return alleles;
    }
  }]);

  return GeneticsUtils;
}();

GeneticsUtils._possibleAllelesForTrait = {};
exports.default = GeneticsUtils;

},{}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  // Challenge instructions
  "~EGG_GAME_3.CHROMOSOMES_TITLE": "Chromosomes",
  "~EGG_GAME_3.INSTRUCTIONS_TITLE": "Instructions",
  "~EGG_GAME_3.INSTR_HEADING": "Sort these eggs!",
  "~EGG_GAME_3.INSTR_ITEM1": "Scope an egg to see a baby's chromosomes.",
  "~EGG_GAME_3.INSTR_ITEM2": "Click the correct basket for the egg.",

  // Challenge popup alerts
  "~ALERT.TITLE.GOOD_WORK": "Good work!",
  "~ALERT.TITLE.INCORRECT_DRAKE": "That's not the drake!",
  "~ALERT.TITLE.EGG_MISMATCH": "That egg doesn't belong!",
  "~ALERT.TITLE.MISTAKE": "Uh oh!",
  "~ALERT.NEW_PIECE_OF_COIN": "You earned a piece of a coin!",
  "~ALERT.COMPLETE_COIN": "You have found all the pieces of this coin!",
  "~ALERT.CORRECT_DRAKE": "The drake you have created matches the target drake.",
  "~ALERT.INCORRECT_DRAKE": "The drake you have created doesn't match the target drake.\n\
                            Please try again.",
  "~ALERT.EGG_BASKET_MATCH": "The egg you have selected belongs in that basket.",
  "~ALERT.EGG_BASKET_MISMATCH": "The egg you have selected doesn't belong in that basket.",
  "~ALERT.DUPLICATE_DRAKE": "You already have a drake that looks just like that!",

  // Challenge buttons
  "~BUTTON.OK": "OK",
  "~BUTTON.TRY_AGAIN": "Try again",
  "~BUTTON.TRY_ANOTHER_EGG": "Try another egg!",
  "~BUTTON.CONTINUE": "Continue",
  "~BUTTON.NEXT_TRIAL": "Next trial",
  "~BUTTON.NEXT_CHALLENGE": "Next challenge",
  "~BUTTON.NEXT_CASE": "Next case",
  "~BUTTON.PLAYGROUND_MOVE_FORWARD": "Bring It On!",
  "~BUTTON.CHECK_DRAKE": "Check Drake",
  "~BUTTON.SAVE_DRAKE": "Save this",
  "~BUTTON.SUBMIT": "Submit",
  "~BUTTON.RESET": "Reset",
  "~BUTTON.FERTILIZE_DISABLED": "Fertilize",
  "~BUTTON.FERTILIZE": "Fertilize ❤️",

  // Messages from ITS
  "~ITS.GREETING": "Hi there user!"
};

},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enUs = require('./en-us');

var _enUs2 = _interopRequireDefault(_enUs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  en_us: _enUs2.default
};

},{"./en-us":81}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = translate;

var _lang = require("./lang");

var _lang2 = _interopRequireDefault(_lang);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultLang = "en_us",
    varRegExp = /\$\{\s*(\d+)\s*\}/g,
    error = "** TRANSLATION ERROR **";

var translateString = function translateString(key, lang) {
  return _lang2.default[lang] && _lang2.default[lang][key] || key;
};

/**
 * Translates strings if they exist in the language file. Otherwise, passes back
 * string unchanged.
 * You can also pass an array of strings, where the first is the main text, and
 * the others are variables to be placed in the string:
 *   ["Good ${0}, ${1}", "evening", "User"]
 * will return "Good evening, User". Each string in the array may optionally be
 * in the language file:
 *   ["~TIME_SENSITIVE_GREETING", "~TIME.EVENING", "User"]
 */
function translate(key) {
  var lang = arguments.length <= 1 || arguments[1] === undefined ? defaultLang : arguments[1];

  if (typeof key === "string") {
    return translateString(key, lang);
  } else if (Array.isArray(key)) {
    var translation = translateString(key[0], lang);
    return translation.replace(varRegExp, function (match, id) {
      return key[++id] ? translateString(key[id], lang) : error;
    });
  }
  console.log("Could not translate: ", key);
  return error;
}

},{"./lang":82}]},{},[79])(79)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL3V0aWxzL2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXNpbXBsZXRhYnMvZGlzdC9yZWFjdC1zaW1wbGV0YWJzLmpzIiwibm9kZV9tb2R1bGVzL3dhcm5pbmcvYnJvd3Nlci5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYmFza2V0LXNldC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYnV0dG9uLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaGFsbGVuZ2UtYXdhcmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZWdnLWNsdXRjaC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVlZGJhY2suanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2ZlcnRpbGl6aW5nLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2VuZS1sYWJlbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9tb2RhbC1hbGVydC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JkaW5hbC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3Blbi1zdGF0cy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9zdGF0cy5qcyIsInNyYy9jb2RlL2dlbmlibG9ja3MuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvbGFuZy9lbi11cy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9sYW5nL2luZGV4LmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL3RyYW5zbGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDclFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM1REE7Ozs7OztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixPQUF1RTtBQUFBLE1BQXJFLE9BQXFFLFFBQXJFLE9BQXFFO0FBQUEsZ0NBQTVELGFBQTREO0FBQUEsTUFBNUQsYUFBNEQsc0NBQTlDLEVBQThDO0FBQUEsa0NBQTFDLGVBQTBDO0FBQUEsTUFBMUMsZUFBMEMsd0NBQXhCLEVBQXdCO0FBQUEsTUFBcEIsY0FBb0IsUUFBcEIsY0FBb0I7O0FBQy9GLE1BQUksY0FBYyxJQUFJLEdBQUosRUFBbEI7QUFBQSxNQUNJLGFBQWEsRUFEakI7O0FBRCtGO0FBQUE7QUFBQTs7QUFBQTtBQUkvRix5QkFBcUIsYUFBckIsOEhBQW9DO0FBQUEsVUFBekIsTUFBeUI7O0FBQ2xDLFVBQU0sUUFBTyxVQUFVLFFBQVYsQ0FBbUIsZUFBbkIsQ0FBbUMsT0FBbkMsRUFBNEMsTUFBNUMsQ0FBYjtBQUNBLFVBQUksS0FBSixFQUNFLFlBQVksR0FBWixDQUFnQixNQUFLLElBQXJCO0FBQ0g7QUFSOEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFVL0YsT0FBSyxJQUFNLElBQVgsSUFBbUIsUUFBUSxRQUEzQixFQUFxQztBQUNuQyxRQUFJLENBQUMsWUFBWSxHQUFaLENBQWdCLElBQWhCLENBQUwsRUFBNEI7QUFDMUIsVUFBTSxVQUFVLFFBQVEsUUFBUixDQUFpQixJQUFqQixFQUF1QixPQUF2QztBQUFBLFVBQ00sY0FBYyxRQUFRLEdBQVIsQ0FBWSxrQkFBVTtBQUNsQyxZQUFNLE9BQU8sUUFBUSxjQUFSLENBQXVCLE1BQXZCLENBQWI7QUFBQSxZQUNNLFVBQVUsRUFBRSxnQkFBZ0IsT0FBaEIsQ0FBd0IsTUFBeEIsS0FBbUMsQ0FBckMsQ0FEaEI7QUFFQSxlQUNFO0FBQUE7QUFBQSxZQUFPLEtBQUssSUFBWjtBQUNFLG1EQUFPLE1BQUssVUFBWixFQUF1QixLQUFLLElBQTVCLEVBQWtDLE9BQU8sTUFBekM7QUFDUSxtQkFBTyxFQUFFLGNBQWMsS0FBaEIsRUFEZjtBQUVRLDRCQUFnQixPQUZ4QixFQUVpQyxVQUFVLFlBRjNDLEdBREY7QUFJRztBQUpILFNBREY7QUFRRCxPQVhhLENBRHBCO0FBYUEsaUJBQVcsSUFBWCxDQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsa0JBQWYsRUFBa0MsS0FBSyxJQUF2QztBQUE4QztBQUE5QyxPQURGO0FBR0Q7QUFDRjs7QUFFRCxXQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDekIsUUFBTSxNQUFNLElBQUksTUFBaEI7QUFBQSxRQUNNLFNBQVMsT0FBTyxJQUFJLEtBRDFCO0FBQUEsUUFFTSxZQUFZLE9BQU8sSUFBSSxPQUY3QjtBQUdBLFFBQUksa0JBQWtCLE1BQXRCLEVBQ0UsZUFBZSxHQUFmLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCO0FBQ0g7O0FBRUQsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLDJCQUFmO0FBQ00sYUFBTyxFQUFFLGFBQWEsS0FBZixFQUFzQixnQkFBZ0IsS0FBdEMsRUFEYjtBQUVJO0FBRkosR0FERjtBQU1ELENBN0NEOztBQStDQSxrQkFBa0IsU0FBbEIsR0FBOEI7QUFDNUIsV0FBUyxpQkFBVSxNQUFWLENBQWlCLFVBREU7QUFFNUIsaUJBQWUsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixDQUZhO0FBRzVCLG1CQUFpQixpQkFBVSxPQUFWLENBQWtCLGlCQUFVLE1BQTVCLENBSFc7QUFJNUIsa0JBQWdCLGlCQUFVLElBQVYsQ0FBZTtBQUpILENBQTlCOztrQkFPZSxpQjs7Ozs7Ozs7Ozs7O0FDeERmOzs7Ozs7QUFFQSxJQUFNLGFBQWEsU0FBYixVQUFhLE9BQXdEO0FBQUEsTUFBdEQsTUFBc0QsUUFBdEQsTUFBc0Q7QUFBQSx3QkFBOUMsS0FBOEM7QUFBQSxNQUE5QyxLQUE4Qyw4QkFBeEMsRUFBd0M7QUFBQSxNQUFwQyxNQUFvQyxRQUFwQyxNQUFvQztBQUFBLE1BQTVCLEtBQTRCLFFBQTVCLEtBQTRCO0FBQUEsTUFBckIsS0FBcUIsUUFBckIsS0FBcUI7QUFBQSxNQUFkLFFBQWMsUUFBZCxRQUFjOztBQUN6RSxNQUFJLFNBQVMsUUFBTSxDQUFuQjtBQUFBLE1BQ0ksU0FBUyxTQUFTLFNBQVQsR0FBcUIsTUFEbEM7QUFBQSxNQUVJLE9BQU8sU0FBUyxLQUFULEdBQWlCLE9BRjVCO0FBQUEsTUFHSSxjQUFjLFdBQVcsQ0FBWCxHQUFlLENBSGpDO0FBQUEsTUFJSSxrQkFBaUIsU0FBUyxHQUFULEdBQWUsR0FKcEM7QUFBQSxNQUtJLFdBQVcsSUFMZjs7QUFPQSxNQUFJLFVBQVUsUUFBZCxFQUF3QjtBQUN0QixlQUFXLDBDQUFRLEdBQUcsTUFBWCxFQUFtQixJQUFJLFNBQU8sQ0FBOUIsRUFBaUMsSUFBSSxTQUFPLENBQTVDLEVBQStDLGFBQWEsV0FBNUQsRUFBeUUsUUFBUSxNQUFqRixFQUF5RixpQkFBaUIsZUFBMUcsRUFBMkgsTUFBTSxJQUFqSSxHQUFYO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsZUFBVyx3Q0FBTSxPQUFRLFNBQU8sQ0FBckIsRUFBeUIsUUFBUyxTQUFPLENBQXpDLEVBQTZDLEdBQUUsR0FBL0MsRUFBbUQsR0FBRSxHQUFyRCxFQUF5RCxhQUFhLFdBQXRFLEVBQW1GLFFBQVEsTUFBM0YsRUFBbUcsaUJBQWlCLGVBQXBILEVBQXFJLE1BQU0sSUFBM0ksR0FBWDtBQUNEOztBQUdELFNBQ0U7QUFBQTtBQUFBLE1BQUssT0FBTyxRQUFNLENBQWxCLEVBQXFCLFFBQVEsUUFBTSxDQUFuQyxFQUFzQyxPQUFNLDRCQUE1QztBQUNFO0FBQUE7QUFBQTtBQUNJLGNBREo7QUFFRTtBQUFBO0FBQUEsVUFBTSxHQUFHLFNBQU8sQ0FBaEIsRUFBbUIsR0FBRyxTQUFPLENBQTdCLEVBQWdDLFlBQVcsUUFBM0MsRUFBb0QsTUFBSyxPQUF6RDtBQUFrRTtBQUFsRTtBQUZGO0FBREYsR0FERjtBQVFELENBdkJEOztBQXlCQSxXQUFXLFNBQVgsR0FBdUI7QUFDckIsVUFBUSxpQkFBVSxNQURHO0FBRXJCLFNBQU8saUJBQVUsTUFGSTtBQUdyQixVQUFRLGlCQUFVLElBSEc7QUFJckIsU0FBTyxpQkFBVSxNQUpJO0FBS3JCLFNBQU8saUJBQVUsTUFMSTtBQU1yQixZQUFVLGlCQUFVO0FBTkMsQ0FBdkI7O2tCQVNlLFU7Ozs7Ozs7Ozs7Ozs7O0FDcENmOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLE9BQXlFO0FBQUEsTUFBdkUsRUFBdUUsUUFBdkUsRUFBdUU7QUFBQSxNQUFuRSxjQUFtRSxRQUFuRSxjQUFtRTtBQUFBLE1BQW5ELE9BQW1ELFFBQW5ELE9BQW1EO0FBQUEsZ0NBQTFDLGFBQTBDO0FBQUEsTUFBMUMsYUFBMEMsc0NBQTVCLEdBQTRCO0FBQUEsTUFBdkIsTUFBdUIsUUFBdkIsTUFBdUI7O0FBQUEsTUFBWixNQUFZOztBQUVsRyxNQUFNLFFBQVEsS0FBSyxDQUFuQjtBQUFBLE1BQ00sbUJBQW1CLFFBQVEsRUFEakM7QUFBQSxNQUVNLFVBQVUsa0JBQWtCLE9BRmxDO0FBQUEsTUFHTSxjQUFjLFFBQVEsSUFBUixJQUFnQixFQUhwQztBQUFBLE1BSU0sa0JBQWtCLFFBQVEsUUFBUixJQUFvQixJQUFwQixHQUEyQixRQUFRLFFBQW5DLEdBQThDLGdCQUp0RTtBQUFBLE1BS00saUJBQWlCLFFBQVEsT0FBUixJQUFtQixJQUFuQixHQUEwQixRQUFRLE9BQWxDLEdBQTRDLEdBTG5FO0FBQUEsTUFNTSxZQUFZLFFBQVEsSUFBUixJQUFnQixFQU5sQztBQUFBLE1BT00sZ0JBQWdCLFFBQVEsUUFBUixJQUFvQixJQUFwQixHQUEyQixRQUFRLFFBQW5DLEdBQThDLGdCQVBwRTtBQUFBLE1BUU0sZUFBZSxRQUFRLE9BQVIsSUFBbUIsSUFBbkIsR0FBMEIsUUFBUSxPQUFsQyxHQUE0QyxHQVJqRTtBQUFBLE1BU00sZUFBZSxFQUFFLFdBQVcsYUFBYixFQVRyQjtBQVVBLFNBQ0U7QUFBQTtBQUFBLE1BQVEsV0FBVSw0QkFBbEI7QUFDTSxvQkFBYztBQUNaLFdBQUcsUUFBUSxDQURDLEVBQ0UsR0FBRyxRQUFRLENBRGIsRUFDZ0IsTUFBTSxXQUR0QjtBQUVaLGtCQUFVLGVBRkUsRUFFZSxTQUFTO0FBRnhCLE9BRHBCO0FBS00sYUFBTztBQUNMLFdBQUcseUJBQU8sUUFBUSxDQUFmLEVBQWtCLFlBQWxCLENBREU7QUFFTCxXQUFHLHlCQUFPLFFBQVEsQ0FBZixFQUFrQixZQUFsQixDQUZFO0FBR0wsY0FBTSx5QkFBTyxTQUFQLEVBQWtCLFlBQWxCLENBSEQ7QUFJTCxrQkFBVSx5QkFBTyxhQUFQLEVBQXNCLFlBQXRCLENBSkw7QUFLTCxpQkFBUyx5QkFBTyxZQUFQLEVBQXFCLFlBQXJCO0FBTEosT0FMYjtBQVlNLGNBQVEsTUFaZDtBQWNJO0FBQUEsYUFDRSwyREFBWSxJQUFJLEVBQWhCLEVBQW9CLFNBQVMsaUJBQTdCLElBQW9ELE1BQXBELEVBREY7QUFBQTtBQWRKLEdBREY7QUFvQkQsQ0FoQ0Q7O0FBa0NBLG1CQUFtQixTQUFuQixHQUErQjtBQUM3QixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUFESTtBQUU3QixNQUFJLGlCQUFVLE1BQVYsQ0FBaUIsVUFGUTtBQUc3QixpQkFBZSxpQkFBVSxPQUFWLENBQWtCLGlCQUFVLE1BQTVCLENBSGM7QUFJN0Isa0JBQWdCLGlCQUFVLEtBQVYsQ0FBZ0IsRUFBRTtBQUNoQyxPQUFHLGlCQUFVLE1BQVYsQ0FBaUIsVUFEVSxFQUNFO0FBQ2hDLE9BQUcsaUJBQVUsTUFBVixDQUFpQixVQUZVLEVBRUU7QUFDaEMsVUFBTSxpQkFBVSxNQUhjLEVBR0U7QUFDaEMsY0FBVSxpQkFBVSxNQUpVLEVBSUU7QUFDaEMsYUFBUyxpQkFBVSxNQUxXLENBS0U7QUFMRixHQUFoQixDQUphO0FBVzdCLFdBQVMsaUJBQVUsS0FBVixDQUFnQixFQUFTO0FBQ2hDLE9BQUcsaUJBQVUsTUFBVixDQUFpQixVQURHLEVBQ1M7QUFDaEMsT0FBRyxpQkFBVSxNQUFWLENBQWlCLFVBRkcsRUFFUztBQUNoQyxVQUFNLGlCQUFVLE1BSE8sRUFHUztBQUNoQyxjQUFVLGlCQUFVLE1BSkcsRUFJUztBQUNoQyxhQUFTLGlCQUFVLE1BTEksQ0FLUztBQUxULEdBQWhCLEVBTU4sVUFqQjBCO0FBa0I3QixpQkFBZSxpQkFBVSxNQWxCSSxFQWtCSztBQUNsQyxjQUFZLGlCQUFVLElBbkJPO0FBb0I3QixjQUFZLGlCQUFVLElBcEJPO0FBcUI3QixXQUFTLGlCQUFVLElBckJVO0FBc0I3QixVQUFRLGlCQUFVO0FBdEJXLENBQS9COztrQkF5QmUsa0I7Ozs7Ozs7Ozs7Ozs7O0FDM0ZmOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU0sdUJBQXVCLFNBQXZCLG9CQUF1QixPQUFxRztBQUFBLE1BQW5HLEdBQW1HLFFBQW5HLEdBQW1HO0FBQUEsTUFBOUYsRUFBOEYsUUFBOUYsRUFBOEY7QUFBQSx3QkFBMUYsS0FBMEY7QUFBQSxNQUExRixLQUEwRiw4QkFBcEYsR0FBb0Y7QUFBQSx3QkFBL0UsS0FBK0U7QUFBQSxNQUEvRSxLQUErRSw4QkFBekUsRUFBeUU7QUFBQSxpQ0FBckUsY0FBcUU7QUFBQSxNQUFyRSxjQUFxRSx1Q0FBdEQsR0FBc0Q7QUFBQSwwQkFBakQsT0FBaUQ7QUFBQSxNQUFqRCxPQUFpRCxnQ0FBekMsR0FBeUM7QUFBQSw0QkFBcEMsU0FBb0M7QUFBQSxNQUFwQyxTQUFvQyxrQ0FBMUIsRUFBMEI7QUFBQSxNQUF0QixNQUFzQixRQUF0QixNQUFzQjtBQUFBLE1BQWQsT0FBYyxRQUFkLE9BQWM7O0FBQ2hJLE1BQU0sZUFBZSxtQkFBbUIsU0FBbkIsR0FDRyxjQURILEdBRUksWUFBWSxTQUFaLEdBQXdCLE9BQXhCLEdBQWtDLEdBRjNEO0FBR0EsTUFBTSxhQUFhLFlBQVksU0FBWixHQUF3QixPQUF4QixHQUFrQyxZQUFyRDs7QUFFQSxNQUFJLGVBQWUsWUFBbkIsRUFDRSxhQUFhLHlCQUFPLFVBQVAsRUFBbUIsRUFBRSxXQUFXLFNBQWIsRUFBbkIsQ0FBYjs7QUFFRixTQUNFO0FBQUE7QUFBQSxNQUFRLFdBQVUsbUNBQWxCO0FBQ1Esb0JBQWMsRUFBQyxTQUFTLFlBQVYsRUFEdEIsRUFDK0MsT0FBTyxFQUFDLFNBQVMsVUFBVixFQUR0RCxFQUM2RSxRQUFRLE1BRHJGO0FBR0ksaUNBQXFCO0FBQ25CLFVBQU0sc0JBQWMsS0FBZCxFQUF3QixpQkFBeEIsQ0FBTjtBQUNBLGFBQ0Usb0RBQWMsS0FBSyxHQUFuQixFQUF3QixJQUFJLEVBQTVCLEVBQWdDLE9BQU8sS0FBdkMsRUFBOEMsT0FBTyxNQUFyRCxFQUE2RCxTQUFTLE9BQXRFLEdBREY7QUFHRDtBQVJMLEdBREY7QUFhRCxDQXRCRDs7QUF3QkEscUJBQXFCLFNBQXJCLEdBQWlDO0FBQy9CLE9BQUssaUJBQVUsTUFBVixDQUFpQixVQURTO0FBRS9CLE1BQUksaUJBQVUsTUFGaUI7QUFHL0IsU0FBTyxpQkFBVSxNQUhjO0FBSS9CLFNBQU8saUJBQVUsTUFKYztBQUsvQixrQkFBZ0IsaUJBQVUsTUFMSztBQU0vQixXQUFTLGlCQUFVLE1BTlk7QUFPL0IsYUFBVyxpQkFBVSxNQVBVO0FBUS9CLFVBQVEsaUJBQVUsSUFSYTtBQVMvQixXQUFTLGlCQUFVO0FBVFksQ0FBakM7O2tCQVllLG9COzs7Ozs7Ozs7Ozs7OztBQ3hDZjs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTSx3QkFBd0IsNkJBQWtCLENBQWhEOztJQUVNLFU7Ozs7Ozs7Ozs7Ozs7OzhMQWVKLFcsR0FBYyxVQUFDLEdBQUQsRUFBUztBQUFBLHdCQUNjLE1BQUssS0FEbkI7QUFBQSxVQUNiLE1BRGEsZUFDYixNQURhO0FBQUEsVUFDTCxLQURLLGVBQ0wsS0FESztBQUFBLFVBQ0UsT0FERixlQUNFLE9BREY7O0FBRXJCLFVBQUksT0FBSixFQUNFLFFBQVEsS0FBUixFQUFlLE1BQWY7QUFDRixVQUFJLGVBQUo7QUFDRCxLOzs7Ozs2QkFFUTtBQUFBLG1CQUNrQyxLQUFLLEtBRHZDO0FBQUEsVUFDQyxNQURELFVBQ0MsTUFERDtBQUFBLFVBQ1MsRUFEVCxVQUNTLEVBRFQ7QUFBQSxVQUNhLElBRGIsVUFDYSxJQURiO0FBQ0QsVUFBb0IsVUFBcEIsVUFBb0IsVUFBcEI7QUFDQSxvQkFBVSxZQUFZLGFBQWEsV0FBYixHQUEyQixFQUF2QyxDQUFWOztBQUVOLGVBQVMsT0FBVCxHQUFtQjtBQUNqQixZQUFJLENBQUMsSUFBRCxJQUFTLENBQUMsS0FBSyxNQUFuQixFQUEyQixPQUFPLElBQVA7QUFDM0IsWUFBSSxXQUFXLEtBQUssR0FBTCxDQUFTLFVBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUI7QUFDM0MsaUJBQ0Usb0RBQVMsS0FBSyxHQUFkLEVBQW1CLHFCQUFtQixLQUF0QyxFQUErQyxZQUFZLElBQTNEO0FBQ2tCLDBCQUFjLEVBQUMsTUFBTSxxQkFBUCxFQURoQyxHQURGO0FBSUQsU0FMYyxDQUFmO0FBTUEsZUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWYsRUFBNkIsT0FBTyxFQUFFLFVBQVUsVUFBWixFQUF3QixTQUFTLE1BQWpDO0FBQ0UsOEJBQWdCLFFBRGxCO0FBRUUsb0JBQU0sRUFGUixFQUVZLEtBQUssRUFGakIsRUFFcUIsT0FBTyxFQUY1QixFQUFwQztBQUdHO0FBSEgsU0FERjtBQU9EOztBQUVELGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVyxPQUFoQixFQUF5QixJQUFJLEVBQTdCLEVBQWlDLEtBQUssRUFBdEMsRUFBMEMsT0FBTyxFQUFFLFVBQVUsVUFBWixFQUFqRCxFQUEyRSxTQUFTLEtBQUssV0FBekY7QUFDRSwrQ0FBSyxXQUFVLGNBQWYsRUFBOEIsS0FBSSxTQUFsQyxHQURGO0FBRUcsaUJBRkg7QUFHRTtBQUFBO0FBQUEsWUFBSyxXQUFVLDJCQUFmO0FBQTRDLGlCQUFPO0FBQW5EO0FBSEYsT0FERjtBQU9EOzs7O0VBbERzQixnQkFBTSxTOztBQUF6QixVLENBRUcsUyxHQUFZO0FBQ2pCLFVBQVEsaUJBQVUsS0FBVixDQUFnQjtBQUN0QixXQUFPLGlCQUFVLE1BREs7QUFFdEIsYUFBUyxpQkFBVSxPQUFWLENBQWtCLGlCQUFVLE1BQTVCLENBRmE7QUFHdEIsU0FBSyxpQkFBVTtBQUhPLEdBQWhCLENBRFM7QUFNakIsTUFBSSxpQkFBVSxNQU5HO0FBT2pCLFNBQU8saUJBQVUsTUFQQTtBQVFqQixRQUFNLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsQ0FSVztBQVNqQixjQUFZLGlCQUFVLElBVEw7QUFVakIsV0FBUyxpQkFBVTtBQVZGLEM7OztBQW1EckIsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsUUFDd0Q7QUFBQSxNQUR0RCxPQUNzRCxTQUR0RCxPQUNzRDtBQUFBLDZCQUQ3QyxRQUM2QztBQUFBLE1BRDdDLFFBQzZDLGtDQURwQyxTQUNvQztBQUFBLG9DQUR6QixlQUN5QjtBQUFBLE1BRHpCLGVBQ3lCLHlDQURULEVBQ1M7QUFBQSxNQUF0RCxJQUFzRCxTQUF0RCxJQUFzRDtBQUFBLE1BQWhELGNBQWdELFNBQWhELGNBQWdEO0FBQUEsTUFBaEMsaUJBQWdDLFNBQWhDLGlCQUFnQztBQUFBLE1BQWIsT0FBYSxTQUFiLE9BQWE7OztBQUU1RSxNQUFJLGNBQWMsUUFBUSxHQUFSLENBQVksVUFBQyxNQUFELEVBQVMsS0FBVCxFQUFtQjtBQUMzQyxRQUFNLFVBQVEsUUFBUixHQUFtQixLQUF6QjtBQUFBLFFBQ00sYUFBYSxnQkFBZ0IsT0FBaEIsQ0FBd0IsS0FBeEIsS0FBa0MsQ0FEckQ7QUFFQSxRQUFJLGFBQWMsVUFBVSxPQUFPLElBQWxCLElBQTJCLEVBQTVDO0FBQUEsUUFDSSxjQUFjLEVBRGxCO0FBRUksZUFBVyxPQUFYLENBQW1CLFVBQUMsYUFBRCxFQUFtQjtBQUNwQyxVQUFNLFdBQVcsZ0JBQWdCLGNBQWpDO0FBQ0EsVUFBSSxrQkFBa0IsaUJBQXRCLEVBQXlDO0FBQ3pDLFVBQUksUUFBUSxLQUFLLFFBQUwsQ0FBWixFQUNFLFlBQVksSUFBWixDQUFpQixLQUFLLFFBQUwsQ0FBakI7QUFDSCxLQUxEO0FBTUosV0FBTyw4QkFBQyxVQUFELElBQVksUUFBUSxNQUFwQixFQUE0QixJQUFJLEVBQWhDLEVBQW9DLEtBQUssRUFBekMsRUFBNkMsT0FBTyxLQUFwRCxFQUEyRCxNQUFNLFdBQWpFO0FBQ1Msa0JBQVksVUFEckIsRUFDaUMsU0FBUyxPQUQxQyxHQUFQO0FBRUQsR0FiYSxDQUFsQjs7QUFlQSxTQUNFO0FBQUE7QUFBQSxNQUFLLFdBQVUsdUJBQWY7QUFDSTtBQURKLEdBREY7QUFLRCxDQXZCRDs7QUF5QkEsY0FBYyxTQUFkLEdBQTBCO0FBQ3hCLFdBQVMsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixFQUFvQyxVQURyQjtBQUV4QixZQUFVLGlCQUFVLE1BRkk7QUFHeEIsbUJBQWlCLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsQ0FITztBQUl4QixRQUFNLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsQ0FKa0I7QUFLeEIsa0JBQWdCLGlCQUFVLE1BTEY7QUFNeEIscUJBQW1CLGlCQUFVLE1BTkw7QUFPeEIsV0FBUyxpQkFBVTtBQVBLLENBQTFCOztrQkFVZSxhOzs7Ozs7Ozs7Ozs7Ozs7O0FDL0VmOzs7O0FBQ0E7Ozs7Ozs7Ozs7OzsrZUFmQTs7Ozs7Ozs7Ozs7Ozs7OztJQWlCTSxNOzs7Ozs7Ozs7Ozs7OztzTEE4QkosNEIsR0FBK0IsWUFBTTtBQUNuQyxVQUFNLG1CQUFtQixvQkFBekI7QUFBQSxVQUNNLFNBQVMsTUFBSyxJQUFMLENBQVUsTUFEekI7QUFFQSxVQUFJLFVBQVUsT0FBTyxTQUFQLENBQWlCLE9BQWpCLENBQXlCLGdCQUF6QixJQUE2QyxDQUEzRCxFQUNFLE9BQU8sU0FBUCxJQUFvQixNQUFNLGdCQUExQjtBQUNILEs7Ozs7OzZCQUVRO0FBQUE7O0FBQUEsbUJBQ2lDLEtBQUssS0FEdEM7QUFBQSxVQUNDLFNBREQsVUFDQyxTQUREO0FBQUEsVUFDWSxLQURaLFVBQ1ksS0FEWjtBQUNELFVBQXVCLE1BQXZCO0FBQ0Esb0JBQVUsQ0FBQyxZQUFZLFlBQVksR0FBeEIsR0FBOEIsRUFBL0IsSUFBcUMsV0FBL0M7O0FBRU4sVUFBTSxtQkFBbUIsU0FBbkIsZ0JBQW1CO0FBQUEsZUFBTSxPQUFLLDRCQUFMLEVBQU47QUFBQSxPQUF6Qjs7QUFFQSxhQUNFO0FBQUE7QUFBQSxtQkFBUSxXQUFXLE9BQW5CLEVBQTRCLEtBQUksUUFBaEMsSUFBNkMsTUFBN0M7QUFDUSx3QkFBYyxnQkFEdEI7QUFFUSx1QkFBYSxnQkFGckI7QUFHRyxpQ0FBRSxLQUFGO0FBSEgsT0FERjtBQU9EOzs7OztBQTNDRDtBQUNBOzBEQUM2QztBQUMzQyxlQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDO0FBQUEsZUFBTSxPQUFPLDBCQUFQLEVBQU47QUFBQSxPQUFyQztBQUNEOztBQUVEO0FBQ0E7Ozs7aURBQ29DO0FBQ2xDLFVBQU0sVUFBVSxTQUFTLGdCQUFULENBQTBCLFlBQTFCLENBQWhCO0FBQUEsVUFDTSxRQUFRLFFBQVEsTUFEdEI7QUFFQTtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFwQixFQUEyQixFQUFFLENBQTdCLEVBQWdDO0FBQzlCLFlBQU0sU0FBUyxRQUFRLENBQVIsQ0FBZjtBQUNBLFlBQUksVUFBVSxPQUFPLFNBQXJCLEVBQWdDO0FBQzlCO0FBQ0EsaUJBQU8sU0FBUCxHQUFtQixPQUFPLFNBQVAsQ0FBaUIsT0FBakIsQ0FBeUIsbUNBQXpCLEVBQStELEVBQS9ELENBQW5CO0FBQ0Q7QUFDRjtBQUNGOztBQUVEO0FBQ0E7Ozs7O0VBN0JtQixnQkFBTSxTOztBQUFyQixNLENBRUcsUyxHQUFZO0FBQ2pCLGFBQVcsaUJBQVUsTUFESjtBQUVqQixTQUFPLGdCQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsQ0FBMEIsQ0FBQyxpQkFBVSxNQUFYLEVBQW1CLGlCQUFVLEtBQTdCLENBQTFCO0FBRlUsQztrQkFtRE4sTTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFZjs7OztBQUNBOzs7Ozs7Ozs7O0lBRU0sa0I7Ozs7Ozs7Ozs7Ozs7OzhNQWNKLGEsR0FBZ0IsVUFBQyxjQUFELEVBQWlCLE1BQWpCLEVBQXlCLFFBQXpCLEVBQW1DLEtBQW5DLEVBQTBDLFVBQTFDLEVBQXlEO0FBQ3ZFLFVBQUksYUFBYSxNQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBakI7QUFDQSxVQUFJLFFBQVEsQ0FBQyxDQUFiLEVBQWU7QUFDYixZQUFJLGtDQUFnQyxNQUFoQyxjQUErQyxRQUEvQyxTQUEyRCxVQUEzRCxTQUF5RSxVQUE3RTtBQUNBLHVCQUFlLElBQWYsQ0FBb0IsdUNBQUssS0FBSyxRQUFWLEVBQW9CLFdBQVcsU0FBL0IsR0FBcEI7QUFDRDtBQUNELGFBQU8sY0FBUDtBQUNELEssUUFFRCxhLEdBQWdCLFVBQUMsS0FBRCxFQUFXO0FBQ3pCLFVBQUksYUFBYSxNQUFqQjtBQUNBLFVBQUksVUFBVSxDQUFkLEVBQWlCLGFBQWEsUUFBYjtBQUNqQixVQUFJLFNBQVMsQ0FBYixFQUFnQixhQUFhLFFBQWI7QUFDaEIsYUFBTyxVQUFQO0FBQ0QsSzs7Ozs7NkJBRVE7QUFDUCxVQUFJLFNBQVMsQ0FBYjtBQUFBLFVBQWdCLGNBQWMsQ0FBOUI7QUFBQSxVQUFpQyxpQkFBaUIsQ0FBbEQ7QUFBQSxVQUFxRCxXQUFXLEVBQWhFO0FBQUEsVUFBb0UsaUNBQXBFO0FBQUEsVUFBOEYsaUJBQWlCLEVBQS9HOztBQUVBLFVBQUksS0FBSyxLQUFMLENBQVcsZUFBWCxDQUEyQixXQUEzQixJQUEwQyxJQUE5QyxFQUFvRDtBQUNsRCxpQkFBUyxLQUFLLEtBQUwsQ0FBVyxlQUFYLENBQTJCLE1BQXBDLEVBQ0EsY0FBYyxLQUFLLEtBQUwsQ0FBVyxlQUFYLENBQTJCLFdBRHpDLEVBRUEsaUJBQWlCLEtBQUssS0FBTCxDQUFXLGVBQVgsQ0FBMkIsY0FGNUM7QUFHQSxtQkFBVyxLQUFLLEtBQUwsQ0FBVyxlQUFYLENBQTJCLFFBQXRDO0FBQ0EsbUNBQTJCLHVDQUFLLFdBQVUsaUJBQWYsR0FBM0I7QUFDRCxPQU5ELE1BTU8sT0FBTyxJQUFQOztBQUVQLFVBQUksQ0FBQyxRQUFELElBQWEsYUFBYSxFQUE5QixFQUNFLE9BQU8sSUFBUDs7QUFFRixVQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxJQUFtQixHQUE5QjtBQUNBLFVBQUksWUFBWTtBQUNkLGVBQU8sT0FBTyxJQURBO0FBRWQsZ0JBQVEsT0FBTztBQUZELE9BQWhCOztBQUtBLFVBQUksV0FBVyxTQUFTLEdBQXhCO0FBQ0EsVUFBSSxpQkFBaUIsRUFBckI7O0FBRUEsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGNBQXBCLEVBQW9DLEdBQXBDLEVBQXdDO0FBQ3RDLGFBQUssSUFBSSxHQUFULElBQWdCLFFBQWhCLEVBQXlCO0FBQ3ZCLGNBQUksSUFBSSxVQUFKLENBQWUsV0FBVyxDQUExQixDQUFKLEVBQWlDO0FBQy9CLGdCQUFNLFFBQVEsU0FBUyxHQUFULENBQWQ7QUFDQSxnQkFBSSxlQUFlLENBQWYsS0FBcUIsSUFBekIsRUFBK0I7QUFDNUIsNkJBQWUsQ0FBZixJQUFvQixLQUFwQjtBQUNGLGFBRkQsTUFFTztBQUNMLDZCQUFlLENBQWYsS0FBcUIsS0FBckI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNELFVBQUksV0FBVyxjQUFjLENBQTdCO0FBQ0EsVUFBSSwwQ0FBd0MsY0FBeEMsY0FBK0QsUUFBL0QsZ0JBQWtGLEtBQUssYUFBTCxDQUFtQixlQUFlLFdBQWYsQ0FBbkIsQ0FBdEY7O0FBRUEsV0FBSyxJQUFJLFNBQVQsSUFBc0IsY0FBdEIsRUFBcUM7QUFDbkMsbUJBQVcsU0FBUyxTQUFULElBQXNCLENBQWpDO0FBQ0EseUJBQWlCLEtBQUssYUFBTCxDQUFtQixjQUFuQixFQUFtQyxjQUFuQyxFQUFtRCxRQUFuRCxFQUE2RCxlQUFlLFNBQWYsQ0FBN0QsRUFBd0YsT0FBeEYsQ0FBakI7QUFDRDs7QUFFRCxVQUFJLDBCQUEwQixDQUE5QjtBQUFBLFVBQWlDLHdCQUF3QixDQUF6RDtBQUFBLFVBQTRELFFBQVEsRUFBcEU7QUFBQSxVQUF3RSxlQUF4RTtBQUNBLDhCQUF3Qix5QkFBTyxxQkFBUCxFQUE4QixFQUFFLFdBQVcsRUFBYixFQUFpQixTQUFRLEVBQXpCLEVBQTlCLENBQXhCOztBQUVBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSw0QkFBZixFQUE0QyxPQUFPLFNBQW5EO0FBQ0csZ0NBREg7QUFFRyxzQkFGSDtBQUdFO0FBQUE7QUFBQSxZQUFRLFdBQVUsK0JBQWxCO0FBQ0ksMEJBQWMsRUFBQyxTQUFTLHVCQUFWLEVBRGxCLEVBQ3NELE9BQU8sRUFBQyxTQUFTLHFCQUFWLEVBRDdELEVBQytGLFFBQVEsTUFEdkc7QUFHTSx1Q0FBcUI7QUFDbkIsZ0JBQU0sc0JBQWMsS0FBZCxFQUF3QixpQkFBeEIsQ0FBTjtBQUNBLG1CQUNFLHVDQUFLLEtBQUssUUFBVixFQUFvQixPQUFPLE1BQTNCLEVBQW1DLFdBQVcsaUJBQTlDLEdBREY7QUFHRDtBQVJQO0FBSEYsT0FERjtBQWlCRDs7OztFQTdGOEIsZ0JBQU0sUzs7QUFBakMsa0IsQ0FFRyxTLEdBQVk7QUFDakIsbUJBQWlCLGlCQUFVLE1BRFY7QUFFakIsUUFBTSxpQkFBVSxNQUZDO0FBR2pCLGFBQVcsaUJBQVU7QUFISixDO0FBRmYsa0IsQ0FRRyxZLEdBQWU7QUFDbkIsbUJBQWlCLEVBQUMsVUFBUyxDQUFWLEVBQWEsZUFBYyxDQUEzQixFQUE4QixrQkFBaUIsQ0FBL0MsRUFBa0QsWUFBVyxFQUE3RCxFQURFO0FBRW5CLFFBQU0sR0FGYTtBQUduQixhQUFXO0FBSFEsQztrQkF3RlQsa0I7Ozs7Ozs7Ozs7Ozs7O0FDbkdmOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTSxtQkFBbUIsU0FBbkIsZ0JBQW1CLE9BQXVEO0FBQUEsTUFBckQsRUFBcUQsUUFBckQsRUFBcUQ7QUFBQSxNQUFqRCxHQUFpRCxRQUFqRCxHQUFpRDtBQUFBLE1BQTVDLE9BQTRDLFFBQTVDLE9BQTRDO0FBQUEsTUFBbkMsU0FBbUMsUUFBbkMsU0FBbUM7QUFBQSx3QkFBeEIsS0FBd0I7QUFBQSxNQUF4QixLQUF3Qiw4QkFBbEIsRUFBa0I7QUFBQSxNQUFkLFFBQWMsUUFBZCxRQUFjOztBQUM5RSxNQUFNLFNBQVMsUUFBUSxVQUFVLElBQWxCLEdBQXlCLE1BQXpCLEdBQWtDLFFBQWpEO0FBQUEsTUFDTSxtQkFBbUIsUUFBUSxVQUFVLElBQWxCLEdBQXlCLGVBQXpCLEdBQTJDLGlCQURwRTtBQUFBLE1BRU0scUJBQXFCLEdBRjNCO0FBQUEsTUFHTSwwQkFBMEIscUJBQXFCLENBSHJEO0FBQUEsTUFJTSx3QkFBZSxVQUFVLFVBQXpCLElBQXdDLEtBQXhDLENBSk47QUFBQSxNQUtNLFFBQVEsWUFBZSxNQUFmLFNBQXlCLE9BQXpCLEdBQXFDLEVBTG5EO0FBQUEsTUFNTSxlQUFlLFlBQVk7QUFBQTtBQUFBLE1BQUssT0FBTyxFQUFDLFVBQVUsVUFBWDtBQUNDLGtCQUFVLE1BRFg7QUFFQyxvQkFBWSxNQUZiO0FBR0MsZUFBTyxPQUhSO0FBSUMsY0FBTSxrQkFKUDtBQUtDLG9CQUFZLFFBTGI7QUFNQyxvQkFBWSxFQU5iLEVBQVo7QUFNK0I7QUFOL0IsR0FBWixHQU0wRCxFQVovRTs7QUFjQSxXQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFDeEIsUUFBTSxVQUFVLElBQUksTUFBSixDQUFXLHFCQUFYLEVBQWhCO0FBQUEsUUFDTSxTQUFTLElBQUksT0FBSixHQUFjLFFBQVEsSUFEckM7O0FBR0EsUUFBSSxRQUFRLFVBQVUsTUFBbEIsSUFBNEIsU0FBUyx1QkFBekMsRUFBaUU7QUFBRTtBQUNqRSxlQUFTLFVBQVUsSUFBbkI7QUFDRCxLQUZELE1BR0ssSUFBSSxRQUFRLFVBQVUsSUFBbEIsSUFBMEIsU0FBUyx1QkFBdkMsRUFBK0Q7QUFBRTtBQUNwRSxlQUFTLFVBQVUsTUFBbkI7QUFDRDtBQUNGOztBQUVELFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBSSxFQUFULEVBQWEsT0FBTyxFQUFDLFVBQVUsVUFBWCxFQUFwQjtBQUNFLDJDQUFNLDhDQUE0QyxnQkFBbEQ7QUFDTSxhQUFPLFVBRGIsRUFDeUIsU0FBUyxXQURsQyxHQURGO0FBSUc7QUFKSCxHQURGO0FBUUQsQ0FuQ0Q7O0FBcUNBLGlCQUFpQixTQUFqQixHQUE2QjtBQUMzQixNQUFJLGlCQUFVLE1BRGE7QUFFM0IsT0FBSyxpQkFBVSxLQUFWLENBQWdCLENBQUMsVUFBVSxJQUFYLEVBQWlCLFVBQVUsTUFBM0IsQ0FBaEIsQ0FGc0I7QUFHM0IsV0FBUyxpQkFBVSxNQUhRO0FBSTNCLGFBQVcsaUJBQVUsSUFKTTtBQUszQixTQUFPLGlCQUFVLE1BTFU7QUFNM0IsWUFBVSxpQkFBVSxJQUFWLENBQWU7QUFORSxDQUE3Qjs7a0JBU2UsZ0I7Ozs7Ozs7Ozs7OztBQ3REZjs7Ozs7O0FBRUEsSUFBTSxXQUFXO0FBQ2YsVUFBUTtBQUNOLFdBQU8sRUFERDtBQUVOLFlBQVEsR0FGRjtBQUdOLFdBQU87QUFIRCxHQURPO0FBTWYsU0FBTztBQUNMLFdBQU8sRUFERjtBQUVMLFlBQVEsRUFGSDtBQUdMLFdBQU87QUFIRjtBQU5RLENBQWpCOztBQWFBLElBQU0sWUFBWTtBQUNoQixVQUFRO0FBQ04sV0FBTyxFQUREO0FBRU4sWUFBUSxFQUZGO0FBR04sV0FBTztBQUhELEdBRFE7QUFNaEIsU0FBTztBQUNMLFdBQU8sRUFERjtBQUVMLFlBQVEsRUFGSDtBQUdMLFdBQU87QUFIRjtBQU5TLENBQWxCOztBQWFBLElBQU0sc0JBQXNCLFNBQXRCLG1CQUFzQixPQUEySDtBQUFBLE1BQXpILEtBQXlILFFBQXpILEtBQXlIO0FBQUEsTUFBbEgsTUFBa0gsUUFBbEgsTUFBa0g7QUFBQSx3QkFBMUcsS0FBMEc7QUFBQSxNQUExRyxLQUEwRyw4QkFBcEcsRUFBb0c7QUFBQSx3QkFBaEcsS0FBZ0c7QUFBQSxNQUFoRyxLQUFnRyw4QkFBMUYsU0FBMEY7QUFBQSx3QkFBL0UsS0FBK0U7QUFBQSxNQUEvRSxLQUErRSw4QkFBekUsS0FBeUU7QUFBQSx1QkFBbEUsSUFBa0U7QUFBQSxNQUFsRSxJQUFrRSw2QkFBN0QsS0FBNkQ7QUFBQSx3QkFBdEQsS0FBc0Q7QUFBQSxNQUF0RCxLQUFzRCw4QkFBaEQsS0FBZ0Q7QUFBQSw4QkFBekMsV0FBeUM7QUFBQSxNQUF6QyxXQUF5QyxvQ0FBN0IsS0FBNkI7QUFBQSxNQUF0QixnQkFBc0IsUUFBdEIsZ0JBQXNCOztBQUNySixNQUFJLENBQUMsS0FBRCxJQUFVLENBQUMsTUFBZixFQUF1QjtBQUNyQixRQUFJLGNBQWMsY0FBYyxTQUFkLEdBQTBCLFFBQTVDOztBQURxQixnQkFFSyxRQUFRLFlBQVksS0FBcEIsR0FBNEIsWUFBWSxNQUY3Qzs7QUFFbkIsU0FGbUIsU0FFbkIsS0FGbUI7QUFFWixVQUZZLFNBRVosTUFGWTtBQUVKLFNBRkksU0FFSixLQUZJO0FBR3RCOztBQUVELE1BQU0sU0FBUyxRQUFNLENBQXJCO0FBQUEsTUFDTSxhQUFhLFFBQU0sQ0FEekI7QUFBQSxNQUVNLGlCQUFpQixhQUFXLENBRmxDO0FBQUEsTUFHTSxjQUFjLFNBQU8sQ0FIM0I7O0FBS0EsTUFBSSxjQUFjLFFBQVEsRUFBUixHQUFhLENBQWIsR0FBaUIsQ0FBbkM7O0FBRUEsTUFBSSxJQUFKLEVBQVU7QUFDUixZQUFRLFNBQVI7QUFDQSxrQkFBYyxDQUFkO0FBQ0Q7QUFDRCxNQUFJLEtBQUosRUFBVztBQUNULFlBQVEsTUFBUjtBQUNBLGtCQUFjLENBQWQ7QUFDRDtBQUNELE1BQUksa0JBQWtCLEVBQXRCO0FBQ0EsTUFBSSxnQkFBSixFQUFxQjtBQUNuQixzQkFBa0I7QUFDaEIsZ0JBQVUsT0FETSxFQUNHLE1BQU0saUJBQWlCLENBRDFCLEVBQzZCLEtBQUssaUJBQWlCLENBRG5ELEVBQ3NELFNBQVMsaUJBQWlCO0FBRGhGLEtBQWxCO0FBR0Q7QUFDRCxTQUNFO0FBQUE7QUFBQSxNQUFLLFdBQVUsa0JBQWYsRUFBa0MsT0FBTyxlQUF6QztBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU8sVUFBWixFQUF3QixRQUFRLFdBQWhDLEVBQTZDLE9BQU0sNEJBQW5EO0FBQ0U7QUFBQTtBQUFBO0FBQ0Usa0RBQVEsR0FBRyxNQUFYLEVBQW1CLElBQUksU0FBTyxDQUE5QixFQUFpQyxJQUFJLGNBQXJDLEVBQXFELGFBQWEsV0FBbEUsRUFBK0UsUUFBTyxTQUF0RixFQUFnRyxNQUFNLEtBQXRHLEdBREY7QUFFRSxrREFBUSxHQUFHLE1BQVgsRUFBbUIsSUFBSSxRQUFNLE1BQTdCLEVBQXFDLElBQUksY0FBekMsRUFBeUQsYUFBYSxXQUF0RSxFQUFtRixRQUFPLFNBQTFGLEVBQW9HLE1BQU0sS0FBMUcsR0FGRjtBQUdFLGtEQUFRLEdBQUcsTUFBWCxFQUFtQixJQUFJLFFBQU0sTUFBN0IsRUFBcUMsSUFBSSxjQUF6QyxFQUF5RCxhQUFhLFdBQXRFLEVBQW1GLFFBQU8sU0FBMUYsRUFBb0csTUFBTSxLQUExRyxHQUhGO0FBSUUsa0RBQVEsR0FBRyxNQUFYLEVBQW1CLElBQUksU0FBTyxNQUE5QixFQUFzQyxJQUFJLGNBQTFDLEVBQTBELGFBQWEsV0FBdkUsRUFBb0YsUUFBTyxTQUEzRixFQUFxRyxNQUFNLEtBQTNHLEdBSkY7QUFLRSxnREFBTSxRQUFTLFFBQU0sTUFBUCxJQUFnQixTQUFPLENBQXZCLENBQWQsRUFBeUMsT0FBTyxLQUFoRCxFQUF1RCxHQUFHLFNBQU8sQ0FBakUsRUFBb0UsR0FBRSxHQUF0RSxFQUEwRSxhQUFZLEdBQXRGLEVBQTBGLFFBQU8sU0FBakcsRUFBMkcsTUFBTSxLQUFqSCxHQUxGO0FBTUUsZ0RBQU0sUUFBUyxTQUFPLE1BQVIsSUFBaUIsUUFBTSxNQUF2QixDQUFkLEVBQThDLE9BQU8sS0FBckQsRUFBNEQsR0FBRyxRQUFNLE1BQXJFLEVBQTZFLEdBQUUsR0FBL0UsRUFBbUYsYUFBWSxHQUEvRixFQUFtRyxRQUFPLFNBQTFHLEVBQW9ILE1BQU0sS0FBMUgsR0FORjtBQU9FLGdEQUFNLElBQUksU0FBTyxDQUFqQixFQUF3QixJQUFHLEdBQTNCLEVBQXFDLElBQUksUUFBTSxNQUFOLEdBQWEsQ0FBdEQsRUFBMEQsSUFBRyxHQUE3RCxFQUF1RSxlQUFjLE1BQXJGLEVBQTRGLGdCQUFlLE1BQTNHLEVBQWtILGFBQWEsV0FBL0gsRUFBNEksUUFBTyxTQUFuSixFQUE2SixNQUFLLE1BQWxLLEdBUEY7QUFRRSxnREFBTSxJQUFJLFNBQU8sQ0FBakIsRUFBd0IsSUFBSSxRQUFNLENBQWxDLEVBQXFDLElBQUksUUFBTSxNQUFOLEdBQWEsQ0FBdEQsRUFBMEQsSUFBSSxRQUFNLENBQXBFLEVBQXVFLGVBQWMsTUFBckYsRUFBNEYsZ0JBQWUsTUFBM0csRUFBa0gsYUFBYSxXQUEvSCxFQUE0SSxRQUFPLFNBQW5KLEVBQTZKLE1BQUssTUFBbEssR0FSRjtBQVNFLGdEQUFNLElBQUksUUFBTSxNQUFoQixFQUF3QixJQUFHLEdBQTNCLEVBQXFDLElBQUksU0FBTyxNQUFoRCxFQUEwRCxJQUFHLEdBQTdELEVBQXVFLGVBQWMsTUFBckYsRUFBNEYsZ0JBQWUsTUFBM0csRUFBa0gsYUFBYSxXQUEvSCxFQUE0SSxRQUFPLFNBQW5KLEVBQTZKLE1BQUssTUFBbEssR0FURjtBQVVFLGdEQUFNLElBQUksUUFBTSxNQUFoQixFQUF3QixJQUFJLFFBQU0sQ0FBbEMsRUFBcUMsSUFBSSxTQUFPLE1BQWhELEVBQTBELElBQUksUUFBTSxDQUFwRSxFQUF1RSxlQUFjLE1BQXJGLEVBQTRGLGdCQUFlLE1BQTNHLEVBQWtILGFBQWEsV0FBL0gsRUFBNEksUUFBTyxTQUFuSixFQUE2SixNQUFLLE1BQWxLO0FBVkY7QUFERjtBQURGLEdBREY7QUFrQkQsQ0E3Q0Q7O0FBK0NBLG9CQUFvQixTQUFwQixHQUFnQztBQUM5QixTQUFPLGlCQUFVLE1BRGE7QUFFOUIsVUFBUSxpQkFBVSxNQUZZO0FBRzlCLFNBQU8saUJBQVUsTUFIYTtBQUk5QixTQUFPLGlCQUFVLE1BSmE7QUFLOUIsU0FBTyxpQkFBVSxJQUxhO0FBTTlCLFFBQU0saUJBQVUsSUFOYztBQU85QixTQUFPLGlCQUFVLElBUGE7QUFROUIsZUFBYSxpQkFBVSxJQVJPO0FBUzlCLG9CQUFrQixpQkFBVSxLQUFWLENBQWdCO0FBQ2QsT0FBRyxpQkFBVSxNQURDO0FBRWQsT0FBRyxpQkFBVSxNQUZDO0FBR2QsYUFBUyxpQkFBVTtBQUhMLEdBQWhCO0FBVFksQ0FBaEM7O2tCQWdCZSxtQjs7Ozs7Ozs7Ozs7O0FDM0ZmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUNBOzs7Ozs7O0FBT0EsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsT0FBbVA7QUFBQSxNQUFqUCxVQUFpUCxRQUFqUCxVQUFpUDtBQUFBLE1BQXJPLEdBQXFPLFFBQXJPLEdBQXFPO0FBQUEsTUFBaE8sY0FBZ08sUUFBaE8sY0FBZ087QUFBQSxNQUFoTixJQUFnTixRQUFoTixJQUFnTjtBQUFBLGdDQUExTSxhQUEwTTtBQUFBLE1BQTFNLGFBQTBNLHNDQUExTCxFQUEwTDtBQUFBLHdCQUF0TCxLQUFzTDtBQUFBLE1BQXRMLEtBQXNMLDhCQUE5SyxLQUE4SztBQUFBLDJCQUF2SyxRQUF1SztBQUFBLE1BQXZLLFFBQXVLLGlDQUE1SixJQUE0SjtBQUFBLDJCQUF0SixRQUFzSjtBQUFBLE1BQXRKLFFBQXNKLGlDQUEzSSxLQUEySTtBQUFBLE1BQXBJLGVBQW9JLFFBQXBJLGNBQW9JO0FBQUEsTUFBcEgsb0JBQW9ILFFBQXBILG9CQUFvSDtBQUFBLDZCQUE5RixVQUE4RjtBQUFBLE1BQTlGLFVBQThGLG1DQUFqRixJQUFpRjtBQUFBLDhCQUEzRSxXQUEyRTtBQUFBLE1BQTNFLFdBQTJFLG9DQUE3RCxLQUE2RDtBQUFBLGdDQUF0RCxhQUFzRDtBQUFBLE1BQXRELGFBQXNELHNDQUF0QyxJQUFzQztBQUFBLE1BQWhDLE9BQWdDLFFBQWhDLE9BQWdDO0FBQUEsK0JBQXZCLFlBQXVCO0FBQUEsTUFBdkIsWUFBdUIscUNBQVIsRUFBUTs7QUFDeFEsTUFBSSxpQkFBaUIsT0FBckI7QUFBQSxNQUNJLFFBQVEsS0FEWjtBQUFBLE1BRUksY0FBYyxLQUZsQjtBQUFBLE1BR0ksZUFISjtBQUFBLE1BR3FCLGdCQUhyQjtBQUFBLE1BR3VDLE9BSHZDOztBQUtBLE1BQUksT0FBTyxjQUFQLElBQXlCLElBQTdCLEVBQW1DO0FBQ2pDLGlCQUFhLElBQUksV0FBSixHQUFrQixXQUFsQixDQUE4QixjQUE5QixFQUE4QyxJQUE5QyxDQUFiO0FBQ0Q7O0FBRUQsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsUUFBSSxVQUFVLFdBQVcsT0FBekI7QUFBQSxRQUNJLGlCQUFpQix3QkFBYyxhQUFkLENBQTRCLE9BQTVCLEVBQXFDLGFBQXJDLEVBQW9ELFdBQVcsT0FBL0QsQ0FEckI7O0FBR0EsUUFBSSxVQUFKLEVBQWdCO0FBQ2QsVUFBSSxTQUFTLGVBQWUsR0FBZixDQUFtQixhQUFLO0FBQ25DLGVBQ0UscURBQWUsS0FBSyxDQUFwQixFQUF1QixTQUFTLFdBQVcsT0FBM0MsRUFBb0QsUUFBUSxDQUE1RCxFQUErRCxVQUFVLFFBQXpFO0FBQ0EsMEJBQWdCLHdCQUFTLEtBQVQsRUFBZ0I7QUFDOUIsNEJBQWUsQ0FBZixFQUFrQixNQUFNLE1BQU4sQ0FBYSxLQUEvQjtBQUNELFdBSEQsR0FERjtBQU1ELE9BUFksQ0FBYjs7QUFTQSx3QkFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDSTtBQURKLE9BREY7O0FBTUEsVUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEIsMEJBQWtCLE1BQWxCO0FBQ0Q7QUFDRjs7QUFFRCxRQUFJLFdBQUosRUFBaUI7QUFDZixVQUFJLGdCQUFnQixlQUFlLEdBQWYsQ0FBbUIsYUFBSztBQUMxQyxlQUNFLGtEQUFZLEtBQUssQ0FBakIsRUFBb0IsUUFBUSxDQUE1QixHQURGO0FBR0QsT0FKbUIsQ0FBcEI7O0FBTUEseUJBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxTQUFmO0FBQ0k7QUFESixPQURGO0FBS0Q7O0FBRUQsUUFBSSxXQUFXLElBQVgsS0FBb0IsR0FBeEIsRUFBNkI7QUFDM0Isb0JBQWMsSUFBZDtBQUNEOztBQUVELGNBQVUsVUFBVSxXQUFXLFVBQXJCLEdBQWtDLFdBQVcsSUFBdkQ7QUFDRCxHQTVDRCxNQTRDTztBQUNMLGNBQVUsT0FBVjtBQUNBLFlBQVEsSUFBUjtBQUNEO0FBQ0QsTUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFTLEdBQVQsRUFBYztBQUNqQyxRQUFJLG9CQUFKLEVBQTBCO0FBQ3hCLDJCQUFxQixJQUFJLGFBQXpCO0FBQ0Q7QUFDRixHQUpEOztBQU1BLFNBQ0U7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZixFQUFpRCxTQUFVLFlBQTNEO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBWSxjQUFqQjtBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsNkJBQWYsRUFBNkMsSUFBSSxPQUFqRCxFQUEwRCxPQUFPLFlBQWpFO0FBQ0UsbUVBQXFCLE9BQU8sS0FBNUIsRUFBbUMsT0FBTyxLQUExQyxFQUFpRCxNQUFNLFFBQXZELEVBQWlFLGFBQWEsV0FBOUUsR0FERjtBQUVJO0FBRkosT0FERjtBQUtJO0FBTEo7QUFERixHQURGO0FBV0QsQ0EzRUQ7O0FBNkVBLGVBQWUsU0FBZixHQUEyQjtBQUN6QixPQUFLLGlCQUFVLE1BRFU7QUFFekIsa0JBQWdCLGlCQUFVLE1BRkQ7QUFHekIsUUFBTSxpQkFBVSxNQUhTO0FBSXpCLGNBQVksaUJBQVUsTUFKRztBQUt6QixpQkFBZSxpQkFBVSxLQUxBO0FBTXpCLFNBQU8saUJBQVUsSUFOUTtBQU96QixZQUFVLGlCQUFVLElBUEs7QUFRekIsWUFBVSxpQkFBVSxJQVJLO0FBU3pCLGNBQVksaUJBQVUsSUFURztBQVV6QixlQUFhLGlCQUFVLElBVkU7QUFXekIsaUJBQWUsaUJBQVUsSUFYQTtBQVl6QixnQkFBYyxpQkFBVSxNQVpDO0FBYXpCLGtCQUFnQixpQkFBVSxJQWJEO0FBY3pCLHdCQUFzQixpQkFBVSxJQWRQO0FBZXpCLFdBQVMsaUJBQVU7QUFmTSxDQUEzQjs7a0JBa0JlLGM7Ozs7Ozs7Ozs7OztBQzNHZjs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBTSxtQkFBbUIsU0FBbkIsZ0JBQW1CLE9BQThCO0FBQUEsTUFBNUIsRUFBNEIsUUFBNUIsRUFBNEI7QUFBQSxNQUF4QixLQUF3QixRQUF4QixLQUF3QjtBQUFBLE1BQWpCLElBQWlCLFFBQWpCLElBQWlCO0FBQUEsTUFBWCxLQUFXLFFBQVgsS0FBVzs7QUFDckQsTUFBSSxTQUFTLE9BQUssQ0FBbEI7QUFBQSxNQUNJLGNBQWMsTUFBTSxPQUFOLENBQWMsR0FBZCxFQUFtQixFQUFuQixDQURsQjtBQUFBLE1BRUksb0NBQWlDLE1BQU0sV0FBdkMsQ0FGSjtBQUFBLE1BR0ksMEJBQXdCLFVBQXhCLE1BSEo7O0FBS0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLDBCQUFmLEVBQTBDLE9BQU8sS0FBakQ7QUFDRTtBQUFBO0FBQUEsUUFBSyxPQUFPLE9BQUssQ0FBakIsRUFBb0IsUUFBUSxPQUFLLENBQWpDLEVBQW9DLE9BQU0sNEJBQTFDO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQWdCLElBQUksVUFBcEI7QUFDRSxrREFBTSxRQUFPLElBQWIsRUFBa0IsV0FBVyxLQUE3QixFQUFvQyxhQUFZLEtBQWhELEdBREY7QUFFRSxrREFBTSxRQUFPLE1BQWIsRUFBb0IsV0FBVyxLQUEvQixFQUFzQyxhQUFZLEtBQWxEO0FBRkY7QUFERixPQURGO0FBT0UsZ0RBQVEsTUFBTSxhQUFkLEVBQTZCLElBQUksTUFBakMsRUFBeUMsSUFBSSxNQUE3QyxFQUFxRCxHQUFHLE1BQXhEO0FBUEY7QUFERixHQURGO0FBYUQsQ0FuQkQ7O0FBcUJBLGlCQUFpQixTQUFqQixHQUE2QjtBQUMzQixNQUFJLGlCQUFVLE1BRGE7QUFFM0IsU0FBTyxpQkFBVSxNQUFWLENBQWlCLFVBRkc7QUFHM0IsUUFBTSxpQkFBVSxNQUFWLENBQWlCLFVBSEk7QUFJM0IsU0FBTyxpQkFBVTtBQUpVLENBQTdCOztrQkFPZSxnQjs7Ozs7Ozs7Ozs7Ozs7O0FDdENmOzs7Ozs7Ozs7Ozs7QUFFQTtBQUNPLElBQU8sNENBQWtCLEVBQXpCO0FBQUEsSUFDTyw4Q0FBbUIsR0FEMUI7O0lBR00sTyxXQUFBLE87Ozs7Ozs7Ozs7Ozs7O3dMQVdYLFcsR0FBYyxVQUFDLEdBQUQsRUFBUztBQUFBLHdCQUNlLE1BQUssS0FEcEI7QUFBQSxVQUNiLEdBRGEsZUFDYixHQURhO0FBQUEsVUFDUixFQURRLGVBQ1IsRUFEUTtBQUFBLFVBQ0osS0FESSxlQUNKLEtBREk7QUFBQSxVQUNHLE9BREgsZUFDRyxPQURIOztBQUVyQixVQUFJLE9BQUosRUFDRSxRQUFRLEVBQVIsRUFBWSxLQUFaLEVBQW1CLEdBQW5CO0FBQ0YsVUFBSSxlQUFKO0FBQ0QsSzs7Ozs7NkJBRVE7QUFBQSxtQkFDdUMsS0FBSyxLQUQ1QztBQUFBLFVBQ0MsR0FERCxVQUNDLEdBREQ7QUFBQSxVQUNNLEVBRE4sVUFDTSxFQUROO0FBQUEsVUFDVSxZQURWLFVBQ1UsWUFEVjtBQUNELFVBQXlCLFVBQXpCLFVBQXlCLFVBQXpCO0FBQ0EscUJBQVcsT0FBTyxNQUFQLENBQWMsRUFBRSxZQUFZLENBQWQsRUFBZCxFQUFpQyxZQUFqQyxDQUFYO0FBQ0EscUJBQVksT0FBTyxJQUFuQjtBQUNBLG9CQUFVLGdCQUFnQixhQUFhLFdBQWIsR0FBMkIsRUFBM0MsS0FDZ0IsV0FBVyxTQUFYLEdBQXVCLEVBRHZDLENBQVY7QUFFTixVQUFJLGdCQUFpQixhQUFhLElBQWIsSUFBcUIsSUFBMUMsRUFBaUQ7QUFDL0MsaUJBQVMsS0FBVCxHQUFpQixhQUFhLElBQTlCO0FBQ0EsaUJBQVMsTUFBVCxHQUFrQixTQUFTLEtBQVQsSUFBa0IsbUJBQW1CLGVBQXJDLENBQWxCO0FBQ0Q7QUFDRCxhQUNFLHVDQUFLLElBQUksRUFBVCxFQUFhLFdBQVcsT0FBeEIsRUFBaUMsS0FBSyxFQUF0QyxFQUEwQyxLQUFJLFNBQTlDLEVBQXdELE9BQU8sUUFBL0QsRUFBeUUsU0FBUyxLQUFLLFdBQXZGLEdBREY7QUFHRDs7OztFQS9CMEIsZ0JBQU0sUzs7QUFBdEIsTyxDQUVKLFMsR0FBWTtBQUNqQixPQUFLLGlCQUFVLE1BREU7QUFFakIsTUFBSSxpQkFBVSxNQUZHO0FBR2pCLFNBQU8saUJBQVUsTUFIQTtBQUlqQixjQUFZLGlCQUFVLElBSkw7QUFLakIsZ0JBQWMsaUJBQVUsTUFMUDtBQU1qQixXQUFTLGlCQUFVO0FBTkYsQzs7O0FBZ0NyQixJQUFNLGdCQUFnQixTQUFoQixhQUFnQixRQUFxRDtBQUFBLE1BQW5ELElBQW1ELFNBQW5ELElBQW1EO0FBQUEsNkJBQTdDLFFBQTZDO0FBQUEsTUFBN0MsUUFBNkMsa0NBQXBDLE1BQW9DO0FBQUEsTUFBNUIsYUFBNEIsU0FBNUIsYUFBNEI7QUFBQSxNQUFiLE9BQWEsU0FBYixPQUFhOzs7QUFFekUsTUFBTSxpQkFBaUIsQ0FBdkI7QUFBQSxNQUNNLGtCQUFrQixFQUR4QjtBQUVBLE1BQUksaUJBQUo7O0FBRUEsV0FBUyxlQUFULENBQXlCLEdBQXpCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLEVBQTZDO0FBQzNDLFFBQU0sVUFBUSxRQUFSLEdBQW1CLEtBQXpCO0FBQUEsUUFDTSxrQkFBa0IsT0FBUSxJQUFJLE1BQUosSUFBYyxJQUF0QixHQUE4QixFQUE5QixHQUFtQyxFQUFFLFlBQVksUUFBZCxFQUQzRDtBQUFBLFFBRU0sV0FBVyxPQUFPLE1BQVAsQ0FBYyxFQUFFLFlBQVksTUFBZCxFQUFzQixhQUFhLE1BQW5DLEVBQWQsRUFBMkQsZUFBM0QsQ0FGakI7QUFHQSxXQUFPLDhCQUFDLE9BQUQsSUFBUyxLQUFLLEdBQWQsRUFBbUIsSUFBSSxFQUF2QixFQUEyQixLQUFLLEVBQWhDLEVBQW9DLE9BQU8sS0FBM0MsRUFBa0QsY0FBYyxRQUFoRTtBQUNTLGtCQUFZLFVBQVUsYUFEL0IsRUFDOEMsU0FBUyxPQUR2RCxHQUFQO0FBRUQ7O0FBRUQ7QUFDQSxNQUFJLEtBQUssTUFBTCxHQUFjLENBQWQsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsZUFBVyxLQUFLLEdBQUwsQ0FBUyxVQUFDLEdBQUQsRUFBTSxLQUFOO0FBQUEsYUFBZ0IsZ0JBQWdCLEdBQWhCLEVBQXFCLEtBQXJCLEVBQTRCLGVBQTVCLENBQWhCO0FBQUEsS0FBVCxDQUFYO0FBQ0QsR0FGRCxNQUlLO0FBQ0gsZUFBVyxLQUFLLE1BQUwsQ0FBWSxVQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksS0FBWixFQUFzQjtBQUMzQyxXQUFLLElBQUwsQ0FBVSxnQkFBZ0IsR0FBaEIsRUFBcUIsS0FBckIsRUFBNEIsY0FBNUIsQ0FBVjtBQUNBO0FBQ0E7QUFDQSxVQUFNLGdCQUFjLFFBQWQsR0FBeUIsS0FBekIsWUFBTjtBQUFBLFVBQ00sY0FBYyxFQUFFLFlBQVksY0FBZCxFQUE4QixhQUFhLGNBQTNDO0FBQ0Usb0JBQVksUUFEZCxFQURwQjtBQUdBLFdBQUssSUFBTCxDQUFVLDhCQUFDLE9BQUQsSUFBUyxLQUFLLElBQWQsRUFBb0IsS0FBSyxRQUF6QixFQUFtQyxjQUFjLFdBQWpELEdBQVY7QUFDQSxhQUFPLElBQVA7QUFDRCxLQVRVLEVBU1IsRUFUUSxDQUFYO0FBVUQ7O0FBRUQsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLHVCQUFmO0FBQ0k7QUFESixHQURGO0FBS0QsQ0FyQ0Q7O0FBdUNBLGNBQWMsU0FBZCxHQUEwQjtBQUN4QixRQUFNLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsRUFBb0MsVUFEbEI7QUFFeEIsWUFBVSxpQkFBVSxNQUZJO0FBR3hCLGlCQUFlLGlCQUFVLE1BSEQ7QUFJeEIsV0FBUyxpQkFBVTtBQUpLLENBQTFCOztrQkFPZSxhOzs7Ozs7Ozs7Ozs7OztBQ3RGZjs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxPQUFzQjtBQUFBLE1BQXBCLElBQW9CLFFBQXBCLElBQW9CO0FBQUEsd0JBQWQsS0FBYztBQUFBLE1BQWQsS0FBYyw4QkFBUixFQUFROztBQUN6QyxNQUFNLFFBQVEsTUFBTSxPQUFOLENBQWMsSUFBZCxJQUFzQixJQUF0QixHQUE2QixDQUFDLElBQUQsQ0FBM0M7QUFBQSxNQUNNLFlBQVksTUFBTSxNQUR4QjtBQUFBLE1BRU0sU0FBUyxLQUFLLFNBQUwsR0FBaUIsQ0FGaEM7QUFBQSxNQUdNLDBCQUFpQixRQUFRLE1BQXpCLElBQW9DLEtBQXBDLENBSE47QUFBQSxNQUlNLFlBQVksTUFBTSxHQUFOLENBQVUsVUFBQyxLQUFELEVBQVEsS0FBUjtBQUFBLFdBQ1I7QUFBQTtBQUFBLFFBQUssV0FBVSwrQkFBZixFQUErQyxLQUFLLEtBQXBEO0FBQTREO0FBQTVELEtBRFE7QUFBQSxHQUFWLENBSmxCOztBQU9BLFNBQ0U7QUFBQTtBQUFBLE1BQUssV0FBVSwwQkFBZixFQUEwQyxPQUFPLFlBQWpEO0FBQ0c7QUFESCxHQURGO0FBS0QsQ0FiRDs7QUFlQSxhQUFhLFNBQWIsR0FBeUI7QUFDdkIsUUFBTSxpQkFBVSxTQUFWLENBQW9CLENBQ2xCLGlCQUFVLE1BRFEsRUFFbEIsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixDQUZrQixDQUFwQixFQUdHLFVBSmM7QUFLdkIsU0FBTyxpQkFBVTtBQUxNLENBQXpCOztrQkFRZSxZOzs7Ozs7Ozs7Ozs7O0FDakNmOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sc0JBQXNCLEVBQTVCO0FBQUEsSUFDTSxvQkFBb0IsR0FEMUI7QUFBQSxJQUVNLDBCQUEwQixDQUZoQztBQUFBLElBR00sMEJBQTBCLEdBSGhDO0FBQUEsSUFJTSw4QkFBOEIsRUFKcEM7QUFBQSxJQUtNLDhCQUE4QixFQUxwQztBQUFBLElBTU0saUJBQWlCLENBQUMsR0FOeEI7O0FBUU8sSUFBTSxvQ0FBYyxFQUFFLFFBQVEsUUFBVixFQUFvQixRQUFRLFFBQTVCLEVBQXBCOztJQUVjLHFCOzs7QUE2Qm5CLGlDQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw4SUFDWCxLQURXOztBQUFBLFVBSW5CLE1BSm1CLEdBSVYsWUFBTTtBQUFBLHdCQUM0QyxNQUFLLEtBRGpEO0FBQUEsVUFDUixNQURRLGVBQ1IsTUFEUTtBQUFBLFVBQ0EsRUFEQSxlQUNBLEVBREE7QUFBQSxVQUNJLGFBREosZUFDSSxhQURKO0FBQUEsVUFDbUIsYUFEbkIsZUFDbUIsYUFEbkI7QUFDVCxVQUEyQyxNQUEzQyxlQUEyQyxNQUEzQztBQUNBLG9CQUFVLE1BQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsTUFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixJQUFuQixHQUEwQixNQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLElBQWxFLEdBQXlFLENBQW5GO0FBQ0Esb0JBQVUsTUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixNQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQW5CLEdBQXlCLE1BQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBakUsR0FBdUUsQ0FBakY7QUFDQSxxQkFBVyxNQUFLLEtBQUwsQ0FBVyxJQUFYLEtBQW9CLFlBQVksTUFBaEMsR0FBeUMsdUJBQXpDLEdBQ3lDLHVCQURwRDtBQUVBLHlCQUFlLE1BQUssS0FBTCxDQUFXLElBQVgsS0FBb0IsWUFBWSxNQUFoQyxHQUF5QywyQkFBekMsR0FDeUMsMkJBRHhEO0FBRUEsMkJBQVM7O0FBRWIsVUFBSSxDQUFDLE1BQUQsSUFBWSxNQUFNLElBQXRCLEVBQTZCOztBQUU3QixVQUFJLE1BQUssS0FBTCxDQUFXLGtCQUFYLEtBQWtDLE1BQXRDLEVBQThDO0FBQzVDLFlBQUksTUFBSyxLQUFMLENBQVcsSUFBWCxLQUFvQixZQUFZLE1BQXBDLEVBQ0UsV0FBVyx1QkFBWDtBQUNGLGtCQUFVLEVBQUUsR0FBRyxPQUFMLEVBQWMsR0FBRyxPQUFqQixFQUEwQixNQUFNLG1CQUFoQyxFQUFWO0FBQ0EsaUJBQVMsRUFBRSxHQUFHLFFBQUwsRUFBZSxHQUFHLENBQWxCLEVBQXFCLE1BQU0saUJBQTNCLEVBQVQ7QUFDRCxPQUxELE1BTUssSUFBSSxNQUFLLEtBQUwsQ0FBVyxrQkFBWCxLQUFrQyxhQUF0QyxFQUFxRDtBQUN4RCxrQkFBVSxFQUFFLEdBQUcsUUFBTCxFQUFlLEdBQUcsQ0FBbEIsRUFBcUIsTUFBTSxpQkFBM0IsRUFBOEMsU0FBUyxHQUF2RCxFQUFWO0FBQ0EsaUJBQVMsRUFBRSxHQUFHLFlBQUwsRUFBbUIsR0FBRyxDQUF0QixFQUF5QixNQUFNLGlCQUEvQixFQUFrRCxVQUFVLENBQTVELEVBQStELFNBQVMsR0FBeEUsRUFBVDtBQUNELE9BSEksTUFJQTtBQUNILGtCQUFVLEVBQUUsR0FBRyxZQUFMLEVBQW1CLEdBQUcsQ0FBdEIsRUFBeUIsTUFBTSxpQkFBL0IsRUFBa0QsVUFBVSxDQUE1RCxFQUErRCxTQUFTLEdBQXhFLEVBQVY7QUFDQSxpQkFBUyxFQUFFLEdBQUcsWUFBTCxFQUFtQixHQUFHLGNBQXRCLEVBQXNDLE1BQU0saUJBQTVDLEVBQStELFVBQVUsQ0FBekUsRUFBNEUsU0FBUyxHQUFyRixFQUFUO0FBQ0Q7O0FBRUQsYUFDRSwwREFBb0IsUUFBUSxNQUE1QixFQUFvQyxJQUFJLEVBQXhDLEVBQTRDLGVBQWUsYUFBM0Q7QUFDb0Isd0JBQWdCLE9BRHBDLEVBQzZDLFNBQVMsTUFEdEQ7QUFFb0IsdUJBQWUsYUFGbkMsRUFFa0QsUUFBUSxNQUYxRCxHQURGO0FBS0QsS0FwQ2tCOztBQUFBO0FBRWxCOzs7RUEvQmdELGdCQUFNLFM7O0FBQXBDLHFCLENBRVosUyxHQUFZO0FBQ2pCLFFBQU0saUJBQVUsS0FBVixDQUFnQixDQUFFLFlBQVksTUFBZCxFQUFzQixZQUFZLE1BQWxDLENBQWhCLEVBQTRELFVBRGpEO0FBRWpCLFVBQVEsaUJBQVUsTUFBVixDQUFpQixVQUZSO0FBR2pCLE1BQUksaUJBQVUsTUFBVixDQUFpQixVQUhKO0FBSWpCLHNCQUFvQixpQkFBVSxLQUFWLENBQWdCLENBQUMsTUFBRCxFQUFTLGFBQVQsRUFBd0IsWUFBeEIsRUFBc0MsVUFBdEMsQ0FBaEIsRUFBbUUsVUFKdEU7QUFLakIsaUJBQWUsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixDQUxFO0FBTWpCLFdBQVMsaUJBQVUsS0FBVixDQUFnQjtBQUN2QixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFEQTtBQUV2QixTQUFLLGlCQUFVLE1BQVYsQ0FBaUIsVUFGQztBQUd2QixXQUFPLGlCQUFVLE1BQVYsQ0FBaUIsVUFIRDtBQUl2QixZQUFRLGlCQUFVLE1BQVYsQ0FBaUI7QUFKRixHQUFoQixDQU5RO0FBWWpCLFdBQVMsaUJBQVUsS0FBVixDQUFnQjtBQUN2QixVQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFEQTtBQUV2QixTQUFLLGlCQUFVLE1BQVYsQ0FBaUIsVUFGQztBQUd2QixXQUFPLGlCQUFVLE1BQVYsQ0FBaUIsVUFIRDtBQUl2QixZQUFRLGlCQUFVLE1BQVYsQ0FBaUI7QUFKRixHQUFoQixDQVpRO0FBa0JqQixpQkFBZSxpQkFBVSxNQWxCUixFQWtCaUI7QUFDbEMsVUFBUSxpQkFBVTtBQW5CRCxDO0FBRkEscUIsQ0F3QlosWSxHQUFlO0FBQ3BCLGlCQUFlLEVBREs7QUFFcEIsaUJBQWU7QUFGSyxDO2tCQXhCSCxxQjs7Ozs7Ozs7Ozs7O0FDYnJCOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLE9BQTBIO0FBQUEsTUFBeEgsT0FBd0gsUUFBeEgsT0FBd0g7QUFBQSxnQ0FBL0csYUFBK0c7QUFBQSxNQUEvRyxhQUErRyxzQ0FBakcsRUFBaUc7QUFBQSx3QkFBN0YsS0FBNkY7QUFBQSxNQUE3RixLQUE2Riw4QkFBdkYsR0FBdUY7QUFBQSx5QkFBbEYsTUFBa0Y7QUFBQSxNQUFsRixNQUFrRiwrQkFBM0UsR0FBMkU7QUFBQSxnQ0FBdEUsYUFBc0U7QUFBQSxNQUF0RSxhQUFzRSxzQ0FBeEQsRUFBd0Q7QUFBQSxNQUFwRCxVQUFvRCxRQUFwRCxVQUFvRDtBQUFBLE1BQXhDLGdCQUF3QyxRQUF4QyxnQkFBd0M7QUFBQSxNQUF0QixnQkFBc0IsUUFBdEIsZ0JBQXNCOztBQUMvSSxNQUFJLGNBQWMsUUFBUSxNQUExQjtBQUFBLE1BQ0ksYUFBYSxFQURqQjtBQUFBLE1BRUksU0FBUyxDQUZiO0FBQUEsTUFHSSxpQkFBaUIsYUFBYSxJQUFJLE1BSHRDO0FBQUEsTUFJSSxXQUFXLGNBSmY7QUFBQSxNQUtJLFdBQVcsY0FMZjtBQUFBLE1BTUksYUFBYSxLQUFLLEtBQUwsQ0FBVyxRQUFRLGNBQW5CLENBTmpCO0FBQUEsTUFPSSxhQUFhLEtBQUssS0FBTCxDQUFXLFNBQVMsY0FBcEIsQ0FQakI7QUFBQSxNQVFJLGVBQWUsQ0FSbkI7QUFBQSxNQVNJLGdCQUFnQixDQVRwQjtBQUFBLE1BVUksZ0JBQWdCLG1CQUFtQixRQUFRLEdBQVIsQ0FBWTtBQUFBLFdBQUssaUJBQWlCLENBQWpCLENBQUw7QUFBQSxHQUFaLENBQW5CLEdBQTJELEVBVi9FO0FBQUEsTUFXSSxxQkFBcUIsY0FBYyxNQUFkLENBQXFCLFVBQUMsS0FBRCxFQUFPLElBQVA7QUFBQSxXQUFnQixRQUFRLElBQXhCO0FBQUEsR0FBckIsRUFBbUQsQ0FBbkQsQ0FYekI7O0FBWUk7QUFDQSxvQkFBa0IsVUFBVSxxQkFBcUIsY0FBckIsR0FBc0MsQ0FBaEQsSUFBcUQsSUFBSSxNQWIvRTs7QUFjSTtBQUNBLHFCQUFtQixLQUFLLEdBQUwsQ0FBUyxXQUFXLENBQXBCLEVBQ1MsQ0FBQyxRQUFRLElBQUksTUFBYixJQUF1QixrQkFEaEMsQ0FmdkI7QUFBQSxNQWlCSSxtQkFBbUIsY0FqQnZCO0FBQUEsTUFrQkksb0JBQW9CLGNBQWMsa0JBbEJ0QztBQUFBLE1BbUJJLG9CQW5CSjs7QUFxQkE7QUFDQSxNQUFJLFdBQVcsVUFBZjtBQUFBLE1BQ0ksV0FBVyxjQUFjLHFCQUFxQixDQUFuQyxDQURmO0FBRUEsU0FBTyxXQUFXLFFBQVgsR0FBc0IsaUJBQTdCLEVBQWdEO0FBQzlDLFFBQUksV0FBVyxRQUFmLEVBQXlCO0FBQ3ZCLGlCQUFXLGtCQUFrQixFQUFFLFFBQS9CO0FBQ0QsS0FGRCxNQUdLO0FBQ0gsaUJBQVcsQ0FBQyxRQUFRLElBQUksTUFBYixJQUF1QixFQUFFLFFBQXBDO0FBQ0Q7QUFDRjs7QUFFRCxnQkFBYyxRQUFRLEdBQVIsQ0FBWSxVQUFDLE1BQUQsRUFBUyxLQUFULEVBQW1CO0FBQzNDLFFBQU0sYUFBYSxjQUFjLEtBQWQsQ0FBbkI7QUFBQSxRQUNNLGNBQWMsYUFBYSxlQUFiLEdBQStCLGNBRG5EO0FBQUEsUUFFTSxNQUFNLGFBQWEsYUFBYSxDQUExQixHQUE4QixLQUFLLEtBQUwsQ0FBVyxjQUFjLFFBQXpCLENBRjFDO0FBQUEsUUFHTSxNQUFNLGFBQWEsV0FBYixHQUEyQixjQUFjLFFBSHJEO0FBQUEsUUFJTSxJQUFJLGFBQWEsTUFBTSxnQkFBbkIsR0FBc0MsTUFBTSxRQUp0RDtBQUFBLFFBS00sSUFBSSxhQUFhLE1BQU0sZ0JBQW5CLEdBQXNDLE1BQU0sUUFMdEQ7QUFNQSxXQUNFLDBEQUFvQixRQUFRLE1BQTVCLEVBQW9DLElBQUksUUFBUSxDQUFoRCxFQUFtRCxLQUFLLEtBQXhEO0FBQ29CLHFCQUFlLGFBRG5DO0FBRW9CLHNCQUFnQixFQUFFLEdBQUcsS0FBSyxLQUFMLENBQVcsUUFBTSxDQUFqQixDQUFMLEVBQTBCLEdBQUcsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQTlCLEVBRnBDO0FBR29CLGVBQVMsRUFBRSxHQUFHLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBTCxFQUFvQixHQUFHLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBdkIsRUFIN0I7QUFJb0IscUJBQWUsYUFKbkM7QUFLb0Isa0JBQVksUUFBUSxDQUFSLEtBQWMsVUFMOUM7QUFNb0Isa0JBQVksVUFOaEM7QUFPb0IsZUFBUyxnQkFQN0IsR0FERjtBQVVELEdBakJhLENBQWQ7O0FBbUJBLFNBQ0U7QUFBQTtBQUFBLE1BQUssV0FBVSx3QkFBZixFQUF3QyxPQUFPLEVBQUUsT0FBTyxLQUFULEVBQWdCLFFBQVEsTUFBeEIsRUFBL0M7QUFDSTtBQURKLEdBREY7QUFLRCxDQTFERDs7QUE0REEsZUFBZSxTQUFmLEdBQTJCO0FBQ3pCLFdBQVMsaUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixFQUFvQyxVQURwQjtBQUV6QixpQkFBZSxpQkFBVSxPQUFWLENBQWtCLGlCQUFVLE1BQTVCLENBRlU7QUFHekIsU0FBTyxpQkFBVSxNQUhRO0FBSXpCLFVBQVEsaUJBQVUsTUFKTztBQUt6QixpQkFBZSxpQkFBVSxNQUxBO0FBTXpCLGNBQVksaUJBQVUsTUFORztBQU96QixvQkFBa0IsaUJBQVUsSUFQSDtBQVF6QixvQkFBa0IsaUJBQVU7QUFSSCxDQUEzQjs7a0JBV2UsYzs7Ozs7Ozs7Ozs7O0FDMUVmOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxJQUFNLGFBQWEsU0FBYixVQUFhLE9BQTBGO0FBQUEsTUFBeEYsTUFBd0YsUUFBeEYsTUFBd0Y7QUFBQSxNQUFoRixFQUFnRixRQUFoRixFQUFnRjtBQUFBLGdDQUE1RSxhQUE0RTtBQUFBLE1BQTVFLGFBQTRFLHNDQUE5RCxFQUE4RDtBQUFBLE1BQTFELE9BQTBELFFBQTFELE9BQTBEO0FBQUEsNkJBQWpELFVBQWlEO0FBQUEsTUFBakQsVUFBaUQsbUNBQXRDLEtBQXNDO0FBQUEsNkJBQS9CLFVBQStCO0FBQUEsTUFBL0IsVUFBK0IsbUNBQXBCLEtBQW9CO0FBQUEsTUFBYixPQUFhLFFBQWIsT0FBYTs7O0FBRTNHLFdBQVMsV0FBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN4QixRQUFNLE1BQU0sSUFBSSxNQUFoQjtBQUFBLFFBQ00sT0FBTyxJQUFJLHFCQUFKLEVBRGI7QUFFQSxRQUFJLENBQUMsVUFBRCxJQUFlLE9BQW5CLEVBQTRCO0FBQzFCLGNBQVEsR0FBUixFQUFhLEVBQWIsRUFBaUIsSUFBakI7QUFDRDtBQUNGOztBQUVELFdBQVMscUJBQVQsQ0FBK0IsTUFBL0IsRUFBdUM7QUFDckMsUUFBSSxVQUFVLEVBQWQ7QUFBQSxRQUNJLHlCQURKO0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBUyxtQkFBVCxDQUE2QixRQUE3QixFQUF1QyxjQUF2QyxFQUF1RDtBQUNyRCx5QkFBbUIsRUFBbkI7QUFEcUQ7QUFBQTtBQUFBOztBQUFBO0FBRXJELDZCQUFxQixjQUFyQiw4SEFBcUM7QUFBQTs7QUFBQSxjQUExQixNQUEwQjs7QUFDbkMsY0FBTSxPQUFPLFVBQVUsUUFBVixDQUFtQixlQUFuQixDQUFtQyxRQUFuQyxFQUE2QyxNQUE3QyxDQUFiO0FBQ0EsaURBQWlCLElBQWpCLDZDQUF5QixLQUFLLE9BQTlCO0FBQ0Q7QUFMb0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU10RDtBQUNELFNBQUssSUFBTSxFQUFYLElBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZCLFVBQUksYUFBYSxPQUFPLEVBQVAsQ0FBakI7QUFDQSxVQUFJLG9CQUFvQixJQUF4QixFQUNFLG9CQUFvQixXQUFXLE9BQS9CLEVBQXdDLGFBQXhDO0FBSHFCO0FBQUE7QUFBQTs7QUFBQTtBQUl2Qiw4QkFBcUIsV0FBVyxPQUFoQyxtSUFBeUM7QUFBQSxjQUE5QixNQUE4Qjs7QUFDdkMsY0FBSSxpQkFBaUIsT0FBakIsQ0FBeUIsTUFBekIsSUFBbUMsQ0FBdkMsRUFBMEM7QUFDeEMsZ0JBQU0sUUFBUSxXQUFXLE9BQVgsQ0FBbUIsY0FBbkIsQ0FBa0MsTUFBbEMsQ0FBZDtBQUNBLHVCQUFXLENBQUMsVUFBVSxJQUFWLEdBQWlCLEVBQWxCLElBQXdCLEVBQXhCLEdBQTZCLElBQTdCLEdBQW9DLEtBQS9DO0FBQ0Q7QUFDRjtBQVRzQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVV2QixVQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUNmLFlBQU0sUUFBUSxXQUFXLElBQVgsS0FBb0IsR0FBcEIsR0FBMEIsR0FBMUIsR0FBZ0MsR0FBOUM7QUFDQSxtQkFBVyxDQUFDLFVBQVUsSUFBVixHQUFpQixFQUFsQixJQUF3QixFQUF4QixHQUE2QixJQUE3QixHQUFvQyxLQUEvQztBQUNEO0FBQ0Y7QUFDRCxXQUFPLE9BQVA7QUFDRDs7QUFFRCxNQUFNLGdCQUFnQixjQUFjLENBQUMsVUFBZixHQUE0QixVQUE1QixHQUF5QyxFQUEvRDtBQUFBLE1BQ00sZ0JBQWdCLGFBQWEsVUFBYixHQUEwQixFQURoRDtBQUFBLE1BRU0sUUFBUSxLQUFLLENBRm5CO0FBQUEsTUFHTSxtQkFBbUIsUUFBUSxFQUhqQztBQUFBLE1BSU0saUNBQStCLGFBQS9CLFNBQWdELGFBQWhELGNBQXNFLEtBSjVFO0FBQUEsTUFLTSxPQUFPLFFBQVEsSUFBUixJQUFnQixFQUw3QjtBQUFBLE1BTU0sV0FBVyxRQUFRLFFBQVIsSUFBb0IsSUFBcEIsR0FBMkIsUUFBUSxRQUFuQyxHQUE4QyxnQkFOL0Q7QUFBQSxNQU9NLFlBQVksdUJBQXFCLFFBQXJCLFlBQXNDLEVBUHhEO0FBQUEsTUFRTSxVQUFVLFFBQVEsT0FBUixJQUFtQixJQUFuQixHQUEwQixRQUFRLE9BQWxDLEdBQTRDLEdBUjVEO0FBQUEsTUFTTSxVQUFVLHNCQUFzQixNQUF0QixDQVRoQjtBQVVBLFNBQ0UsdUNBQUssV0FBVyxPQUFoQixFQUF5QixPQUFPLE9BQWhDO0FBQ00sV0FBTztBQUNMLFlBQU0sUUFBUSxDQURULEVBQ1ksS0FBSyxRQUFRLENBRHpCO0FBRUwsYUFBTyxJQUZGLEVBRVEsUUFBUSxJQUZoQjtBQUdMLDBCQUhLLEVBR007QUFITixLQURiO0FBTU0sYUFBUyxXQU5mLEdBREY7QUFVRCxDQTdERDs7QUErREEsV0FBVyxTQUFYLEdBQXVCO0FBQ3JCLFVBQVEsaUJBQVUsTUFBVixDQUFpQixVQURKO0FBRXJCLE1BQUksaUJBQVUsTUFBVixDQUFpQixVQUZBO0FBR3JCLGlCQUFlLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsQ0FITTtBQUlyQixXQUFTLGlCQUFVLEtBQVYsQ0FBZ0IsRUFBUztBQUNoQyxPQUFHLGlCQUFVLE1BQVYsQ0FBaUIsVUFERyxFQUNTO0FBQ2hDLE9BQUcsaUJBQVUsTUFBVixDQUFpQixVQUZHLEVBRVM7QUFDaEMsVUFBTSxpQkFBVSxNQUhPLEVBR1M7QUFDaEMsY0FBVSxpQkFBVSxNQUpHLEVBSVM7QUFDaEMsYUFBUyxpQkFBVSxNQUxJLENBS1M7QUFMVCxHQUFoQixFQU1OLFVBVmtCO0FBV3JCLGNBQVksaUJBQVUsSUFYRDtBQVlyQixjQUFZLGlCQUFVLElBWkQ7QUFhckIsV0FBUyxpQkFBVTtBQWJFLENBQXZCOztrQkFnQmUsVTs7Ozs7Ozs7Ozs7Ozs7QUNyR2Y7Ozs7OztBQUVBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLE9BQXVEO0FBQUEsTUFBckQsT0FBcUQsUUFBckQsT0FBcUQ7QUFBQSxNQUE1QyxNQUE0QyxRQUE1QyxNQUE0QztBQUFBLDJCQUFwQyxRQUFvQztBQUFBLE1BQXBDLFFBQW9DLGlDQUEzQixLQUEyQjtBQUFBLE1BQXBCLGNBQW9CLFFBQXBCLGNBQW9COztBQUMzRSxNQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsUUFBTSxhQUFhLFFBQVEsY0FBUixDQUF1QixNQUF2QixDQUFuQjtBQUNBLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSwwQ0FBZjtBQUNFO0FBQUE7QUFBQTtBQUNJO0FBREo7QUFERixLQURGO0FBT0QsR0FURCxNQVNPO0FBQUE7QUFDTCxVQUFNLFVBQVUsVUFBVSxRQUFWLENBQW1CLGVBQW5CLENBQW1DLE9BQW5DLEVBQTRDLE1BQTVDLEVBQW9ELE9BQXBFO0FBQUEsVUFDTSxjQUFjLFFBQVEsR0FBUixDQUFZO0FBQUEsZUFBSyxRQUFRLGNBQVIsQ0FBdUIsQ0FBdkIsQ0FBTDtBQUFBLE9BQVosQ0FEcEI7QUFBQSxVQUVNLGdCQUFnQixZQUFZLEdBQVosQ0FBZ0IsVUFBQyxJQUFELEVBQU8sQ0FBUDtBQUFBLGVBQ2Q7QUFBQTtBQUFBLFlBQVEsS0FBSyxJQUFiLEVBQW1CLE9BQU8sUUFBUSxDQUFSLENBQTFCO0FBQXVDO0FBQXZDLFNBRGM7QUFBQSxPQUFoQixDQUZ0QjtBQUtBO0FBQUEsV0FDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLHVDQUFmO0FBQ0U7QUFBQTtBQUFBLGNBQVEsT0FBUSxNQUFoQixFQUF5QixVQUFXLGNBQXBDO0FBQ0k7QUFESjtBQURGO0FBREY7QUFOSzs7QUFBQTtBQWFOO0FBQ0YsQ0F4QkQ7O0FBMEJBLGNBQWMsU0FBZCxHQUEwQjtBQUN4QixXQUFTLGlCQUFVLE1BQVYsQ0FBaUIsVUFERjtBQUV4QixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUFGRDtBQUd4QixZQUFVLGlCQUFVLElBSEk7QUFJeEIsa0JBQWdCLGlCQUFVO0FBSkYsQ0FBMUI7O2tCQU9lLGE7Ozs7Ozs7Ozs7OztBQ25DZjs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksbUJBQW1CLFNBQW5CLGdCQUFtQixPQUFtRDtBQUFBLE1BQWpELE9BQWlELFFBQWpELE9BQWlEO0FBQUEsTUFBeEMsSUFBd0MsUUFBeEMsSUFBd0M7QUFBQSxNQUFsQyxTQUFrQyxRQUFsQyxTQUFrQztBQUFBLE1BQXZCLGlCQUF1QixRQUF2QixpQkFBdUI7O0FBQ3BFLE1BQUksVUFBVSxLQUFLLE9BQW5CO0FBQUEsTUFDSSxjQUFjLFFBQVEsR0FBUixDQUFZO0FBQUEsV0FBSyxRQUFRLGNBQVIsQ0FBdUIsQ0FBdkIsQ0FBTDtBQUFBLEdBQVosQ0FEbEI7QUFBQSxNQUVJLGFBQWEsWUFBWSxNQUY3QjtBQUFBLE1BR0ksaUJBQWlCLEVBSHJCO0FBQUEsTUFJSSxtQkFBbUIsYUFBYSxhQUpwQztBQUFBLE1BS0ksVUFMSjtBQUFBLE1BS08sVUFMUDs7QUFPQSxpQkFBZSxJQUFmLENBQW9CO0FBQUE7QUFBQSxNQUFRLEtBQUksYUFBWixFQUEwQixPQUFNLGFBQWhDLEVBQThDLFVBQVMsVUFBdkQ7QUFBQTtBQUFBLEdBQXBCOztBQUVBLE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxVQUFoQixFQUE0QixHQUE1QixFQUFpQztBQUMvQixTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksVUFBaEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsVUFBSSxNQUFNLElBQUksR0FBSixHQUFVLENBQXBCO0FBQUEsVUFDSSxTQUFTLFlBQVksQ0FBWixJQUFpQixLQUFqQixHQUF5QixZQUFZLENBQVosQ0FEdEM7QUFFQSxxQkFBZSxJQUFmLENBQW9CO0FBQUE7QUFBQSxVQUFRLEtBQUssR0FBYixFQUFrQixPQUFPLEdBQXpCO0FBQStCO0FBQS9CLE9BQXBCO0FBQ0Q7QUFDRjs7QUFFRCxTQUNFO0FBQUE7QUFBQSxNQUFLLFdBQVUsZ0JBQWY7QUFDRTtBQUFBO0FBQUEsUUFBUSxPQUFRLGdCQUFoQixFQUFtQyxVQUFXLGlCQUE5QztBQUNJO0FBREo7QUFERixHQURGO0FBT0QsQ0F6Qkw7O0FBMkJBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLFFBQThEO0FBQUEsTUFBNUQsR0FBNEQsU0FBNUQsR0FBNEQ7QUFBQSxrQ0FBdkQsYUFBdUQ7QUFBQSxNQUF2RCxhQUF1RCx1Q0FBekMsRUFBeUM7QUFBQSw4QkFBckMsU0FBcUM7QUFBQSxNQUFyQyxTQUFxQyxtQ0FBM0IsRUFBMkI7QUFBQSxNQUF2QixrQkFBdUIsU0FBdkIsaUJBQXVCOztBQUNuRixNQUFJLGVBQWUsRUFBbkI7QUFEbUY7QUFBQTtBQUFBOztBQUFBO0FBRW5GLHlCQUEyQixJQUFJLE9BQUosQ0FBWSxlQUF2Qyw4SEFBd0Q7QUFBQSxVQUEvQyxjQUErQzs7QUFDdEQsVUFBSSxRQUFRLElBQUksUUFBSixDQUFhLFFBQWIsQ0FBc0IsV0FBdEIsQ0FBa0MsY0FBbEMsQ0FBWjtBQUFBLFVBQ0ksVUFBVSxNQUFNLE9BQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsQ0FBbkIsQ0FBTixFQUE2QixPQUQzQztBQUFBLFVBRUksaUJBQWlCLHdCQUFjLGFBQWQsQ0FBNEIsT0FBNUIsRUFBcUMsYUFBckMsRUFBb0QsSUFBSSxPQUF4RCxDQUZyQjtBQUFBLFVBR0ksUUFBUSxlQUFlLEdBQWYsQ0FBbUI7QUFBQSxlQUFLLFVBQVUsUUFBVixDQUFtQixlQUFuQixDQUFtQyxJQUFJLE9BQXZDLEVBQWdELENBQWhELENBQUw7QUFBQSxPQUFuQixDQUhaO0FBQUEsVUFJSSxZQUFZLE1BQU0sR0FBTixDQUFVLGFBQUs7QUFDekIsZUFDRSw4QkFBQyxnQkFBRDtBQUNFLGVBQWMsRUFBRSxJQURsQjtBQUVFLG1CQUFjLElBQUksT0FGcEI7QUFHRSxnQkFBYyxDQUhoQjtBQUlFLHFCQUFjLFVBQVUsRUFBRSxJQUFaLENBSmhCO0FBS0UsNkJBQXNCLDJCQUFTLEtBQVQsRUFBZ0I7QUFDcEMsK0JBQWtCLENBQWxCLEVBQXFCLE1BQU0sTUFBTixDQUFhLEtBQWxDO0FBQ0Q7QUFQSCxVQURGO0FBV0QsT0FaVyxDQUpoQjs7QUFrQkEsbUJBQWEsSUFBYixDQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsT0FBZixFQUF1QixLQUFLLGNBQTVCO0FBQ0Usc0VBREY7QUFFRSxzRUFGRjtBQUdFO0FBQUE7QUFBQSxZQUFLLFdBQVUscUJBQWY7QUFDSTtBQURKO0FBSEYsT0FERjtBQVNEO0FBOUJrRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQStCbkYsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLHdCQUFmO0FBQ0k7QUFESixHQURGO0FBS0QsQ0FwQ0Q7O0FBc0NBLGlCQUFpQixTQUFqQixHQUE2QjtBQUMzQixXQUFTLGlCQUFVLE1BQVYsQ0FBaUIsVUFEQztBQUUzQixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFGSTtBQUczQixhQUFXLGlCQUFVLE1BSE07QUFJM0IscUJBQW1CLGlCQUFVLElBQVYsQ0FBZTtBQUpQLENBQTdCOztBQU9BLGVBQWUsU0FBZixHQUEyQjtBQUN6QixPQUFLLGlCQUFVLE1BQVYsQ0FBaUIsVUFERztBQUV6QixpQkFBZSxpQkFBVSxLQUZBO0FBR3pCLGFBQVcsaUJBQVUsTUFISTtBQUl6QixxQkFBbUIsaUJBQVUsSUFBVixDQUFlO0FBSlQsQ0FBM0I7O2tCQU9lLGM7Ozs7Ozs7Ozs7OztBQ25GZjs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxPQUF3TjtBQUFBLE1BQXROLEdBQXNOLFFBQXROLEdBQXNOO0FBQUEsNEJBQWpOLFNBQWlOO0FBQUEsTUFBak4sU0FBaU4sa0NBQXZNLEVBQXVNO0FBQUEsTUFBbk0sV0FBbU0sUUFBbk0sV0FBbU07QUFBQSxNQUF0TCxPQUFzTCxRQUF0TCxPQUFzTDtBQUFBLGdDQUE3SyxhQUE2SztBQUFBLE1BQTdLLGFBQTZLLHNDQUE3SixFQUE2SjtBQUFBLDJCQUF6SixRQUF5SjtBQUFBLE1BQXpKLFFBQXlKLGlDQUFoSixJQUFnSjtBQUFBLDZCQUExSSxVQUEwSTtBQUFBLE1BQTFJLFVBQTBJLG1DQUEvSCxJQUErSDtBQUFBLDhCQUF6SCxXQUF5SDtBQUFBLE1BQXpILFdBQXlILG9DQUE3RyxLQUE2RztBQUFBLG1DQUF0RyxtQkFBc0c7QUFBQSxNQUF0RyxtQkFBc0cseUNBQWxGLEVBQWtGO0FBQUEsd0JBQTlFLEtBQThFO0FBQUEsTUFBOUUsS0FBOEUsOEJBQXhFLEtBQXdFO0FBQUEsTUFBakUsT0FBaUUsUUFBakUsT0FBaUU7QUFBQSxNQUF4RCxZQUF3RCxRQUF4RCxZQUF3RDtBQUFBLE1BQTFDLGVBQTBDLFFBQTFDLGNBQTBDO0FBQUEsTUFBMUIscUJBQTBCLFFBQTFCLG9CQUEwQjs7QUFDek8sTUFBSSxlQUFlLEVBQW5CO0FBQ0EsTUFBSSxHQUFKLEVBQVM7QUFDUCxrQkFBYyxJQUFJLFFBQUosQ0FBYSxRQUFiLENBQXNCLFdBQXBDO0FBQ0EsY0FBVSxJQUFJLE9BQWQ7QUFDRDtBQUx3TztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLFVBTWhPLGNBTmdPOztBQU92TyxVQUFJLFFBQVEsWUFBWSxjQUFaLENBQVo7QUFBQSxVQUNJLFFBQVEsRUFEWjs7QUFQdU8sbUNBUzlOLElBVDhOO0FBVXJPLFlBQUksYUFBYSxNQUFNLElBQU4sQ0FBakI7QUFDQSxjQUFNLElBQU4sQ0FDRTtBQUNFLHNCQUFZLFVBRGQ7QUFFRSxlQUFLLE1BQU0sTUFBTixHQUFlLENBRnRCO0FBR0UseUJBQWUsYUFIakI7QUFJRSx5QkFBZSxNQUFNLE1BQU4sR0FBYSxDQUFiLElBQWtCLFNBQU8sR0FKMUM7QUFLRSxvQkFBVSxRQUxaO0FBTUUsb0JBQVUsb0JBQW9CLGNBQXBCLE1BQXdDLElBTnBEO0FBT0Usc0JBQVksVUFQZDtBQVFFLHVCQUFhLFdBUmY7QUFTRSxpQkFBTyxLQVRUO0FBVUUsbUJBQVMsT0FWWDtBQVdFLHdCQUFjLFlBWGhCO0FBWUUsMEJBQWdCLHdCQUFTLFVBQVQsRUFBcUIsU0FBckIsRUFBZ0M7QUFDOUMsNEJBQWUsY0FBZixFQUErQixJQUEvQixFQUFxQyxVQUFyQyxFQUFpRCxTQUFqRDtBQUNELFdBZEg7QUFlRSxnQ0FBc0IsOEJBQVMsRUFBVCxFQUFZO0FBQ2hDLGdCQUFJLHFCQUFKLEVBQ0Usc0JBQXFCLEdBQXJCLEVBQTBCLGNBQTFCLEVBQTBDLElBQTFDLEVBQWdELEVBQWhEO0FBQ0gsV0FsQkgsR0FERjtBQVhxTzs7QUFTdk8sV0FBSyxJQUFJLElBQVQsSUFBaUIsS0FBakIsRUFBd0I7QUFBQSxlQUFmLElBQWU7QUF1QnZCO0FBQ0QsbUJBQWEsSUFBYixDQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsNEJBQWYsRUFBNEMsS0FBSyxhQUFhLE1BQWIsR0FBc0IsQ0FBdkU7QUFDSTtBQURKLE9BREY7QUFqQ3VPOztBQU16Tyx5QkFBMkIsUUFBUSxlQUFuQyw4SEFBb0Q7QUFBQTtBQWdDbkQ7QUF0Q3dPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBdUN6TyxNQUFNLFVBQVUsdUJBQXVCLFlBQVksTUFBTSxTQUFsQixHQUE4QixFQUFyRCxDQUFoQjtBQUNBLFNBQ0U7QUFBQTtBQUFBLE1BQUssV0FBVyxPQUFoQjtBQUNJO0FBREosR0FERjtBQUtELENBN0NEOztBQStDQSxXQUFXLFNBQVgsR0FBdUI7QUFDckIsT0FBSyxpQkFBVSxNQURNO0FBRXJCLGFBQVcsaUJBQVUsTUFGQTtBQUdyQixlQUFhLGlCQUFVLE1BSEY7QUFJckIsV0FBUyxpQkFBVSxNQUpFO0FBS3JCLGlCQUFlLGlCQUFVLEtBTEo7QUFNckIsa0JBQWdCLGlCQUFVLElBTkw7QUFPckIsWUFBVSxpQkFBVSxJQVBDO0FBUXJCLGNBQVksaUJBQVUsSUFSRDtBQVNyQixlQUFhLGlCQUFVLElBVEY7QUFVckIsdUJBQXFCLGlCQUFVLE1BVlY7QUFXckIsU0FBTyxpQkFBVSxJQVhJO0FBWXJCLGdCQUFjLGlCQUFVLE1BWkg7QUFhckIsd0JBQXNCLGlCQUFVLElBYlg7QUFjckIsV0FBUyxpQkFBVTtBQWRFLENBQXZCOztrQkFpQmUsVTs7Ozs7Ozs7Ozs7Ozs7QUN6RWY7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLHFCQUFxQixTQUFyQixrQkFBcUIsT0FBa0c7QUFBQSxNQUFoRyxFQUFnRyxRQUFoRyxFQUFnRztBQUFBLE1BQTVGLEtBQTRGLFFBQTVGLEtBQTRGO0FBQUEsTUFBckYsSUFBcUYsUUFBckYsSUFBcUY7QUFBQSxpQ0FBL0UsY0FBK0U7QUFBQSxNQUEvRSxjQUErRSx1Q0FBaEUsRUFBZ0U7QUFBQSw0QkFBNUQsU0FBNEQ7QUFBQSxNQUE1RCxTQUE0RCxrQ0FBbEQsRUFBa0Q7QUFBQSxNQUE5QyxjQUE4QyxRQUE5QyxjQUE4QztBQUFBLDZCQUE5QixVQUE4QjtBQUFBLE1BQTlCLFVBQThCLG1DQUFuQixFQUFtQjs7QUFBQSxNQUFaLE1BQVk7O0FBQzNILE1BQU0sNkJBQW9CLFVBQVUsVUFBOUIsRUFBMEMsT0FBTyxJQUFqRCxFQUF1RCxRQUFRLElBQS9ELElBQXdFLGNBQXhFLENBQU47QUFBQSxNQUNNLHdCQUFlLFVBQVUsVUFBekIsSUFBd0MsU0FBeEMsQ0FETjtBQUFBLE1BRU0seUJBQWdCLFVBQVUsVUFBMUIsSUFBeUMsVUFBekMsQ0FGTjs7QUFJQSxTQUNFO0FBQUE7QUFBQSxNQUFLLFdBQVUsNEJBQWYsRUFBNEMsT0FBTyxlQUFuRDtBQUNFLDREQUFrQixJQUFJLFVBQVEsRUFBOUIsRUFBa0MsT0FBTyxLQUF6QyxFQUFnRCxNQUFNLElBQXRELEVBQTRELE9BQU8sVUFBbkUsR0FERjtBQUVFLGtDQUFDLGNBQUQsYUFBZ0IsSUFBSSxXQUFTLEVBQTdCLEVBQWlDLE9BQU8sV0FBeEMsRUFBcUQsT0FBTyxJQUE1RCxJQUFzRSxNQUF0RTtBQUZGLEdBREY7QUFNRCxDQVhEOztBQWFBLG1CQUFtQixTQUFuQixHQUErQjtBQUM3QixNQUFJLGlCQUFVLE1BQVYsQ0FBaUIsVUFEUTtBQUU3QixTQUFPLGlCQUFVLE1BQVYsQ0FBaUIsVUFGSztBQUc3QixRQUFNLGlCQUFVLE1BQVYsQ0FBaUIsVUFITTtBQUk3QixrQkFBZ0IsaUJBQVUsTUFKRztBQUs3QixhQUFXLGlCQUFVLE1BTFE7QUFNN0Isa0JBQWdCLGlCQUFVLElBQVYsQ0FBZSxVQU5GO0FBTzdCLGNBQVksaUJBQVU7QUFQTyxDQUEvQjs7a0JBVWUsa0I7Ozs7Ozs7Ozs7Ozs7O2tRQzFCZjs7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGFBQWE7QUFDakIsWUFBVSxPQURPO0FBRWpCLFVBQVEsSUFGUztBQUdqQixPQUFLLENBSFksRUFHVCxRQUFRLENBSEMsRUFHRSxNQUFNLENBSFIsRUFHVyxPQUFPO0FBSGxCLENBQW5COztBQU1BLElBQU0sNkJBQ0QsVUFEQztBQUVKLFVBQVEsTUFGSjtBQUdKLG1CQUFpQixNQUhiO0FBSUosV0FBUztBQUpMLEVBQU47O0FBT0EsSUFBTSxjQUFjLFNBQWQsV0FBYyxHQUFvQjtBQUFBLE1BQVgsR0FBVyx5REFBUCxLQUFPOztBQUN0QztBQUNBO0FBQ0EsTUFBSSxPQUFPLEVBQVg7QUFDQSxTQUFPO0FBQ0wsY0FBVSxVQURMO0FBRUwsV0FBTyxHQUZGO0FBR0wsU0FBSyxHQUhBLEVBR0ssTUFBTSxPQUFPLEdBSGxCO0FBSUwscUNBQStCLElBQS9CLE9BSks7QUFLTCxxQkFBaUIscUNBTFo7QUFNTCxzQkFBa0IsV0FOYjtBQU9MLHNCQUFrQixZQVBiO0FBUUwsZUFBVywyQkFSTjtBQVNMLGFBQVMsRUFUSjtBQVVMLGFBQVM7QUFWSixHQUFQO0FBWUQsQ0FoQkQ7O0lBbUJNLFU7Ozs7Ozs7Ozs7OzZCQTBCSztBQUNQO0FBQ0EsVUFBTSxZQUFZLEtBQUssS0FBTCxDQUFXLFVBQVgsSUFBeUIsRUFBM0M7QUFBQSxVQUNNLGFBQWEsVUFBVSxLQUFWLEdBQ0csa0RBQVEsT0FBTyxVQUFVLEtBQVYsSUFBbUIsRUFBbEM7QUFDUSxtQkFBVSxjQURsQjtBQUVRLGlCQUFTLFVBQVUsT0FBVixJQUFxQixLQUFLLEtBQUwsQ0FBVyxpQkFGakQsR0FESCxHQUlHLElBTHRCO0FBQUEsVUFNTSxhQUFhLEtBQUssS0FBTCxDQUFXLFdBQVgsSUFBMEIsRUFON0M7QUFBQSxVQU9NLGNBQWMsa0RBQVEsT0FBTyxXQUFXLEtBQVgsSUFBb0IsRUFBbkM7QUFDUSxtQkFBVSxjQURsQjtBQUVRLGlCQUFTLFdBQVcsT0FBWCxJQUFzQixLQUFLLEtBQUwsQ0FBVyxrQkFGbEQsR0FQcEI7QUFVQSxVQUFJLFNBQUosRUFBZSxlQUFmOztBQUVBLFVBQUksS0FBSyxLQUFMLENBQVcsZUFBZixFQUErQjtBQUM3QixvQkFBWSwwREFBb0IsaUJBQWlCLEtBQUssS0FBTCxDQUFXLGVBQWhELEdBQVo7QUFDRDtBQUNELFVBQUksS0FBSyxLQUFMLENBQVcsV0FBZixFQUE0QjtBQUMxQiwwQkFBa0I7QUFBQTtBQUFBO0FBQUksbUNBQUUsS0FBSyxLQUFMLENBQVcsV0FBYjtBQUFKLFNBQWxCO0FBQ0Q7QUFDRCxhQUNFO0FBQUE7QUFBQSxVQUFRLG1CQUFnQixhQUF4QjtBQUNRLGlCQUFPLFVBRGY7QUFFUSx5QkFBZSxhQUZ2QjtBQUdRLGdCQUFNLEtBQUssS0FBTCxDQUFXLElBSHpCO0FBSVEsa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFKM0I7QUFLRTtBQUFBO0FBQUEsWUFBSyxPQUFPLFlBQVksS0FBSyxLQUFMLENBQVcsR0FBdkIsQ0FBWjtBQUNFO0FBQUE7QUFBQSxjQUFJLElBQUcsYUFBUDtBQUFzQixxQ0FBRSxLQUFLLEtBQUwsQ0FBVyxPQUFiO0FBQXRCLFdBREY7QUFFRyxtQkFGSDtBQUdHLHlCQUhIO0FBSUcsb0JBSkg7QUFBQTtBQUlnQjtBQUpoQjtBQUxGLE9BREY7QUFjRDs7OztFQTVEc0IsZ0JBQU0sUzs7QUFBekIsVSxDQUVHLFMsR0FBWTtBQUNqQixRQUFNLGlCQUFVLElBREM7QUFFakIsV0FBUyxnQkFBTSxTQUFOLENBQWdCLFNBQWhCLENBQTBCLENBQUMsaUJBQVUsTUFBWCxFQUFtQixpQkFBVSxLQUE3QixDQUExQixDQUZRO0FBR2pCLGVBQWEsZ0JBQU0sU0FBTixDQUFnQixTQUFoQixDQUEwQixDQUFDLGlCQUFVLE1BQVgsRUFBbUIsaUJBQVUsS0FBN0IsQ0FBMUIsQ0FISTtBQUlqQixjQUFZLGlCQUFVLEtBQVYsQ0FBZ0I7QUFDMUIsV0FBTyxnQkFBTSxTQUFOLENBQWdCLFNBQWhCLENBQTBCLENBQUMsaUJBQVUsTUFBWCxFQUFtQixpQkFBVSxLQUE3QixDQUExQixDQURtQjtBQUUxQixhQUFTLGlCQUFVO0FBRk8sR0FBaEIsQ0FKSztBQVFqQixlQUFhLGlCQUFVLEtBQVYsQ0FBZ0I7QUFDM0IsV0FBTyxnQkFBTSxTQUFOLENBQWdCLFNBQWhCLENBQTBCLENBQUMsaUJBQVUsTUFBWCxFQUFtQixpQkFBVSxLQUE3QixDQUExQixDQURvQjtBQUUzQixhQUFTLGlCQUFVO0FBRlEsR0FBaEIsQ0FSSTtBQVlqQixVQUFRLGlCQUFVLElBWkQ7QUFhakIscUJBQW1CLGlCQUFVLElBYlosRUFheUI7QUFDMUMsc0JBQW9CLGlCQUFVLElBZGIsRUFjeUI7QUFDMUMsbUJBQWlCLGlCQUFVLE1BZlY7QUFnQmpCLE9BQUssaUJBQVU7QUFoQkUsQztBQUZmLFUsQ0FxQkcsWSxHQUFlO0FBQ3BCLFFBQU0sS0FEYztBQUVwQixtQkFBaUIsRUFBRSxJQUFHLENBQUwsRUFBUSxVQUFVLEVBQWxCO0FBRkcsQztrQkEwQ1QsVTs7Ozs7Ozs7Ozs7Ozs7QUN4R2Y7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxJQUFNLHNCQUFzQixTQUF0QixtQkFBc0IsT0FBMkQ7QUFBQSxNQUF6RCxFQUF5RCxRQUF6RCxFQUF5RDtBQUFBLE1BQXJELFNBQXFELFFBQXJELFNBQXFEO0FBQUEsTUFBMUMsT0FBMEMsUUFBMUMsT0FBMEM7QUFBQSxNQUFqQyxRQUFpQyxRQUFqQyxRQUFpQztBQUFBLHVCQUF2QixJQUF1QjtBQUFBLE1BQXZCLElBQXVCLDZCQUFsQixFQUFrQjs7QUFBQSxNQUFYLEtBQVc7O0FBQ3JGLE1BQU0saUJBQWlCLEVBQUUsT0FBTyxJQUFULEVBQWUsUUFBUSxJQUF2QixFQUF2QjtBQUFBLE1BQ00sVUFBVSxZQUFZLElBQVosR0FDSSw2REFBYyxJQUFPLEVBQVAsY0FBZCxFQUFvQyxLQUFLLFFBQXpDLEVBQW1ELE9BQU8sSUFBMUQsSUFBb0UsS0FBcEUsRUFESixHQUVJO0FBQUE7QUFBQSxNQUFLLFdBQVUsU0FBZjtBQUNHO0FBREgsR0FIcEI7O0FBT0EsU0FDRTtBQUFBO0FBQUEsTUFBSyxJQUFJLEVBQVQsRUFBYSw0Q0FBMEMsU0FBdkQsRUFBb0UsT0FBTyxjQUEzRTtBQUNJO0FBREosR0FERjtBQUtELENBYkQ7O0FBZUEsb0JBQW9CLFNBQXBCLEdBQWdDO0FBQzlCLE1BQUksaUJBQVUsTUFEZ0I7QUFFOUIsYUFBVyxpQkFBVSxNQUZTO0FBRzlCLFdBQVMsaUJBQVUsTUFIVztBQUk5QixZQUFVLGlCQUFVLE1BSlU7QUFLOUIsUUFBTSxpQkFBVTtBQUxjLENBQWhDOztrQkFRZSxtQjs7Ozs7Ozs7Ozs7Ozs7QUNyQ2Y7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7OztBQVFBLElBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixPQUFnRztBQUFBLHFCQUE5RixFQUE4RjtBQUFBLE1BQTlGLEVBQThGLDJCQUEzRixVQUEyRjtBQUFBLDRCQUEvRSxTQUErRTtBQUFBLE1BQS9FLFNBQStFLGtDQUFyRSxFQUFxRTtBQUFBLHdCQUFqRSxLQUFpRTtBQUFBLE1BQWpFLEtBQWlFLDhCQUEzRCxTQUEyRDtBQUFBLHVCQUFoRCxJQUFnRDtBQUFBLE1BQWhELElBQWdELDZCQUEzQyxHQUEyQztBQUFBLHdCQUF0QyxLQUFzQztBQUFBLE1BQXRDLEtBQXNDLDhCQUFoQyxFQUFnQztBQUFBLDRCQUE1QixTQUE0QjtBQUFBLE1BQTVCLFNBQTRCLGtDQUFsQixFQUFrQjs7QUFBQSxNQUFYLEtBQVc7O0FBQ3ZILE1BQU0saUJBQWlCLEVBQUMsVUFBVSxVQUFYLEVBQXVCLE9BQU8sSUFBOUIsRUFBb0MsUUFBUSxJQUE1QyxFQUF2QjtBQUFBLE1BQ00sNEJBQW1CLFVBQVUsVUFBN0IsSUFBNEMsU0FBNUMsQ0FETjtBQUFBLE1BRU0sc0JBQWEsVUFBVSxVQUF2QixJQUFzQyxLQUF0QyxDQUZOOztBQUlBLFNBQ0U7QUFBQTtBQUFBLE1BQUssSUFBSSxFQUFULEVBQWEseUNBQXVDLFNBQXBELEVBQWlFLE9BQU8sY0FBeEU7QUFDRSw0REFBa0IsSUFBTyxFQUFQLFVBQWxCLEVBQW9DLE9BQU8sS0FBM0MsRUFBa0QsTUFBTSxJQUF4RCxFQUE4RCxPQUFPLGNBQXJFLEdBREY7QUFFRSxpRUFBYyxJQUFPLEVBQVAsY0FBZCxFQUFvQyxPQUFPLElBQTNDLEVBQWlELE9BQU8sUUFBeEQsSUFBc0UsS0FBdEU7QUFGRixHQURGO0FBTUQsQ0FYRDs7QUFhQSxpQkFBaUIsU0FBakIsR0FBNkI7QUFDM0IsTUFBSSxpQkFBVSxNQURhO0FBRTNCLGFBQVcsaUJBQVUsTUFGTTtBQUczQixTQUFPLGlCQUFVLE1BSFU7QUFJM0IsUUFBTSxpQkFBVSxNQUpXO0FBSzNCLFNBQU8saUJBQVUsTUFMVTtBQU0zQixhQUFXLGlCQUFVO0FBTk0sQ0FBN0I7O2tCQVNlLGdCOzs7Ozs7Ozs7Ozs7QUNsQ2Y7Ozs7OztBQUVBLElBQU0sZUFBZSxTQUFmLFlBQWUsT0FBb0Y7QUFBQSxNQUFsRixHQUFrRixRQUFsRixHQUFrRjtBQUFBLE1BQTdFLEVBQTZFLFFBQTdFLEVBQTZFO0FBQUEsNEJBQXpFLFNBQXlFO0FBQUEsTUFBekUsU0FBeUUsa0NBQS9ELEVBQStEO0FBQUEsd0JBQTNELEtBQTJEO0FBQUEsTUFBM0QsS0FBMkQsOEJBQXJELEdBQXFEO0FBQUEsMEJBQWhELE9BQWdEO0FBQUEsTUFBaEQsT0FBZ0QsZ0NBQXhDLEtBQXdDO0FBQUEsd0JBQWpDLEtBQWlDO0FBQUEsTUFBakMsS0FBaUMsOEJBQTNCLEVBQTJCO0FBQUEsTUFBdkIsT0FBdUIsUUFBdkIsT0FBdUI7QUFBQSxNQUFkLE9BQWMsUUFBZCxPQUFjOztBQUN2RyxNQUFNLFVBQVUsa0VBQWhCO0FBQUEsTUFDTSxNQUFVLE1BQU0sVUFBVSxJQUFJLFlBQUosRUFBaEIsR0FBcUMsSUFEckQ7O0FBRU07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxVQUFVLFNBQVYsQ0FBb0IsV0FBcEIsR0FBa0MsT0FBbEMsQ0FBMEMsU0FBMUMsS0FBd0QsQ0FYM0U7QUFBQSxNQVlNLGtCQUFrQixZQUFZLFNBQVosR0FBd0IsV0FaaEQ7QUFBQSxNQWFNLGFBQWEsV0FBVyxVQUFTLEdBQVQsRUFBYztBQUFFLFdBQU8sR0FBUDtBQUFhLEdBYjNEOztBQWVBLE1BQUksVUFBVSx5QkFBeUIsWUFBWSxNQUFNLFNBQWxCLEdBQThCLEVBQXZELENBQWQ7QUFDQSxNQUFJLE9BQUosRUFBYTtBQUNYLGVBQVcsVUFBWDtBQUNEOztBQUVELFdBQVMsV0FBVCxHQUF1QjtBQUNyQixRQUFJLE9BQUosRUFBYSxRQUFRLEVBQVIsRUFBWSxHQUFaO0FBQ2Q7O0FBRUQsU0FBTyxXQUNMO0FBQUE7QUFBQSxNQUFLLFdBQVcsT0FBaEIsRUFBeUIsSUFBSSxFQUE3QixFQUFpQyxPQUFPLEtBQXhDO0FBQ00sbUJBQWEsVUFBVSxlQUFWLEdBQTRCLElBRC9DO0FBRU0sZUFBUyxVQUFVLFdBQVYsR0FBd0IsSUFGdkM7QUFHRyxVQUFNLHVDQUFLLEtBQUssR0FBVixFQUFlLE9BQU8sS0FBdEIsR0FBTixHQUF3QztBQUgzQyxHQURLLENBQVA7QUFPRCxDQWhDRDs7QUFrQ0EsYUFBYSxTQUFiLEdBQXlCO0FBQ3ZCLE9BQUssaUJBQVUsTUFEUTtBQUV2QixNQUFJLGlCQUFVLE1BRlM7QUFHdkIsYUFBVyxpQkFBVSxNQUhFO0FBSXZCLFNBQU8saUJBQVUsTUFKTTtBQUt2QixTQUFPLGlCQUFVLE1BTE07QUFNdkIsV0FBUyxpQkFBVSxJQU5JO0FBT3ZCLFdBQVMsaUJBQVU7QUFQSSxDQUF6Qjs7a0JBVWUsWTs7Ozs7Ozs7Ozs7Ozs7OztBQzlDZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7SUFFTSxZOzs7Ozs7Ozs7Ozs2QkFTSztBQUFBLG1CQUN1RSxLQUFLLEtBRDVFO0FBQUEsVUFDQyxJQURELFVBQ0MsSUFERDtBQUFBLFVBQ08sY0FEUCxVQUNPLGNBRFA7QUFBQSxVQUN1QixhQUR2QixVQUN1QixhQUR2QjtBQUFBLFVBQ3NDLGlCQUR0QyxVQUNzQyxpQkFEdEM7QUFDRCxVQUE2RCxNQUE3RDtBQUNBLHVCQUFhLEtBQUssS0FBTCxDQUFXLENBQUMsY0FBWixDQUFiOztBQUVOLGFBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQSxvQ0FBTSxLQUFOO0FBQUEsWUFBWSxPQUFNLGNBQWxCLEVBQWlDLEtBQUksY0FBckM7QUFDRSxrRUFBUyxNQUFNLFVBQWYsSUFBK0IsTUFBL0I7QUFDUSwyQkFBZSxhQUR2QjtBQUVRLHFCQUFTLGlCQUFTLGNBQVQsRUFBeUI7QUFDaEMsa0JBQUksaUJBQUosRUFDRSxrQkFBa0IsY0FBbEI7QUFDSCxhQUxUO0FBREYsU0FERjtBQVNFO0FBQUEsb0NBQU0sS0FBTjtBQUFBLFlBQVksT0FBTSxPQUFsQixFQUEwQixLQUFJLE9BQTlCO0FBQ0UsMkRBQVcsTUFBTSxJQUFqQixFQUF1QixnQkFBZ0IsY0FBdkM7QUFERjtBQVRGLE9BREY7QUFlRDs7OztFQTVCd0IsZ0JBQU0sUzs7QUFBM0IsWSxDQUVHLFMsR0FBWTtBQUNqQixRQUFNLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsRUFBb0MsVUFEekI7QUFFakIsa0JBQWdCLGlCQUFVLE1BQVYsQ0FBaUIsVUFGaEI7QUFHakIsaUJBQWUsaUJBQVUsTUFIUjtBQUlqQixxQkFBbUIsaUJBQVU7QUFKWixDO2tCQTZCTixZOzs7Ozs7Ozs7Ozs7QUNwQ2Y7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7OztBQU1BLElBQU0sVUFBVSxTQUFWLE9BQVUsT0FBMEo7QUFBQSxNQUF4SixJQUF3SixRQUF4SixJQUF3SjtBQUFBLDJCQUFsSixRQUFrSjtBQUFBLE1BQWxKLFFBQWtKLGlDQUF6SSxXQUF5STtBQUFBLHdCQUE1SCxLQUE0SDtBQUFBLE1BQTVILEtBQTRILDhCQUF0SCxHQUFzSDtBQUFBLDBCQUFqSCxPQUFpSDtBQUFBLE1BQWpILE9BQWlILGdDQUF6RyxDQUF5RztBQUFBLE1BQXRHLElBQXNHLFFBQXRHLElBQXNHO0FBQUEsOEJBQWhHLFdBQWdHO0FBQUEsTUFBaEcsV0FBZ0csb0NBQXBGLENBQW9GO0FBQUEsaUNBQWpGLGNBQWlGO0FBQUEsTUFBakYsY0FBaUYsdUNBQWxFLENBQWtFO0FBQUEsbUNBQS9ELG9CQUErRDtBQUFBLE1BQS9ELG9CQUErRDtBQUFBLE1BQTVCLGFBQTRCLFFBQTVCLGFBQTRCO0FBQUEsTUFBYixPQUFhLFFBQWIsT0FBYTs7O0FBRXhLLFdBQVMsV0FBVCxDQUFxQixFQUFyQixFQUF5QixHQUF6QixFQUE4QjtBQUM1QixRQUFNLGNBQWMsR0FBRyxPQUFILENBQVcsUUFBWCxDQUFwQjtBQUFBLFFBQ00sUUFBUSxPQUFPLEdBQUcsTUFBSCxDQUFVLGNBQWMsU0FBUyxNQUFqQyxDQUFQLENBRGQ7QUFFQSxRQUFJLE9BQUosRUFBYSxRQUFRLEtBQVIsRUFBZSxFQUFmLEVBQW1CLEdBQW5CO0FBQ2Q7O0FBRUQsTUFBSSxXQUFXO0FBQ2IsWUFBVyxDQUFDLFdBQUQsR0FBYSxDQUF4QixXQUErQixDQUFDLGNBQUQsR0FBZ0IsQ0FBL0M7QUFEYSxHQUFmOztBQUlBLE1BQUksV0FBVyxRQUFNLE9BQXJCO0FBQUEsTUFDSSxXQUFXLEtBQUssR0FBTCxDQUFTLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDbEMsV0FBTyxVQUFVLGFBQVYsR0FDRyw4QkFBQyxvQkFBRCxJQUFzQixLQUFLLEdBQTNCLEVBQWdDLElBQUksV0FBVyxLQUEvQyxFQUFzRCxPQUFPLEtBQTdELEVBQW9FLEtBQUssS0FBekU7QUFDa0IsYUFBTSxTQUR4QixFQUNrQyxNQUFNLFFBRHhDLEVBQ2tELE9BQU8sUUFEekQsRUFDbUUsU0FBUyxXQUQ1RSxHQURILEdBR0csb0RBQWMsS0FBSyxHQUFuQixFQUF3QixJQUFJLFdBQVcsS0FBdkMsRUFBOEMsT0FBTyxLQUFyRCxFQUE0RCxLQUFLLEtBQWpFO0FBQ2MsYUFBTyxRQURyQixFQUMrQixPQUFPLFFBRHRDLEVBQ2dELFNBQVMsV0FEekQsR0FIVjtBQUtELEdBTlUsQ0FEZjs7QUFTQSxTQUFPLFFBQVEsS0FBSyxJQUFMLENBQVUsU0FBUyxNQUFULEdBQWtCLE9BQTVCLENBQVIsSUFBZ0QsQ0FBdkQ7O0FBRUEsTUFBSSxTQUFTLFdBQVcsSUFBeEI7O0FBRUEsVUFBUyxRQUFVLGlCQUFpQixPQUFwQztBQUNBLFdBQVMsU0FBVSxjQUFjLElBQWpDOztBQUVBLE1BQUksUUFBUSxFQUFFLFlBQUYsRUFBUyxjQUFULEVBQVo7O0FBRUEsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLGdCQUFmLEVBQWdDLE9BQU8sS0FBdkM7QUFDSTtBQURKLEdBREY7QUFLRCxDQW5DRDs7QUFxQ0EsUUFBUSxTQUFSLEdBQW9CO0FBQ2xCLFFBQU0saUJBQVUsT0FBVixDQUFrQixpQkFBVSxNQUE1QixFQUFvQyxVQUR4QjtBQUVsQixZQUFVLGlCQUFVLE1BRkY7QUFHbEIsU0FBTyxpQkFBVSxNQUhDO0FBSWxCLFdBQVMsaUJBQVUsTUFKRDtBQUtsQixRQUFNLGlCQUFVLE1BTEU7QUFNbEIsa0JBQWdCLGlCQUFVLE1BTlI7QUFPbEIsZUFBYSxpQkFBVSxNQVBMO0FBUWxCLHdCQUFzQixpQkFBVSxJQVJkO0FBU2xCLGlCQUFlLGlCQUFVLE1BVFA7QUFVbEIsV0FBUyxpQkFBVTtBQVZELENBQXBCOztrQkFhZSxPOzs7Ozs7Ozs7Ozs7QUMzRGY7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxtQkFBbUIsU0FBbkIsZ0JBQW1CLE9BQTJCO0FBQUEsTUFBekIsU0FBeUIsUUFBekIsU0FBeUI7QUFBQSx1QkFBZCxJQUFjO0FBQUEsTUFBZCxJQUFjLDZCQUFULEdBQVM7O0FBQ2xELE1BQU0saUJBQWlCLEVBQUMsVUFBVSxVQUFYLEVBQXVCLE9BQU8sSUFBOUIsRUFBb0MsUUFBUSxJQUE1QyxFQUF2QjtBQUFBLE1BQ00sWUFBWSxFQUFDLFVBQVUsVUFBWCxFQURsQjs7QUFHQSxTQUNFO0FBQUE7QUFBQSxNQUFLLFdBQVUsMEJBQWYsRUFBMEMsT0FBTyxjQUFqRDtBQUNFLDREQUFrQixPQUFPLFNBQXpCLEVBQW9DLE1BQU0sSUFBMUMsRUFBZ0QsT0FBTyxTQUF2RCxHQURGO0FBRUUsMkNBQUssV0FBVSx3Q0FBZjtBQUNNLGFBQU8sRUFBQyxVQUFVLFVBQVgsRUFBdUIsT0FBTyxJQUE5QixFQUFvQyxRQUFRLElBQTVDLEVBRGI7QUFGRixHQURGO0FBUUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxDQXJCRDs7QUF1QkEsaUJBQWlCLFNBQWpCLEdBQTZCO0FBQzNCLGFBQVcsaUJBQVUsTUFBVixDQUFpQixVQUREO0FBRTNCLFFBQU0saUJBQVU7QUFGVyxDQUE3Qjs7a0JBS2UsZ0I7Ozs7Ozs7Ozs7Ozs7O0FDL0JmOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixTQUEzQix3QkFBMkIsT0FBcUM7QUFBQSxNQUFuQyxNQUFtQyxRQUFuQyxNQUFtQztBQUFBLE1BQTNCLEtBQTJCLFFBQTNCLEtBQTJCO0FBQUEsTUFBcEIsSUFBb0IsUUFBcEIsSUFBb0I7O0FBQUEsTUFBWCxLQUFXOztBQUNwRSxNQUFNLFVBQVUsaUVBQWtCLE9BQU8sS0FBekIsRUFBZ0MsTUFBTSxJQUF0QyxJQUFnRCxLQUFoRCxFQUFoQjtBQUFBLE1BQ00sZUFBZSx3REFBa0IsV0FBVyxLQUE3QixFQUFvQyxPQUFPLElBQTNDLEdBRHJCO0FBQUEsTUFFTSxZQUFZLFNBQVMsWUFBVCxHQUF3QixPQUYxQzs7QUFJQSxTQUNFO0FBQUE7QUFBQSxNQUFLLFdBQVUsbUNBQWY7QUFDRztBQURILEdBREY7QUFLRCxDQVZEOztBQVlBLHlCQUF5QixTQUF6QixHQUFxQztBQUNuQyxVQUFRLGlCQUFVLElBRGlCO0FBRW5DLFNBQU8saUJBQVUsTUFBVixDQUFpQixVQUZXO0FBR25DLFFBQU0saUJBQVU7QUFIbUIsQ0FBckM7O2tCQU1lLHdCOzs7Ozs7Ozs7Ozs7OztBQ3RCZjs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTSxZQUFZLFNBQVosU0FBWSxPQUE0QjtBQUFBLE1BQTFCLElBQTBCLFFBQTFCLElBQTBCO0FBQUEsTUFBcEIsY0FBb0IsUUFBcEIsY0FBb0I7OztBQUU1QyxNQUFJLFNBQVMsd0JBQWMsOEJBQWQsQ0FBNkMsSUFBN0MsRUFBbUQsY0FBbkQsQ0FBYjtBQUFBLE1BQ0ksYUFBYSxrQkFBa0IsS0FBSyxNQUR4QztBQUFBLE1BRUksT0FBTyxFQUZYOztBQUlBO0FBQ0EsTUFBSSxXQUFXLENBQWY7QUFQNEM7QUFBQTtBQUFBOztBQUFBO0FBUTVDLHlCQUE4QixNQUE5Qiw4SEFBc0M7QUFBQTs7QUFBQSxVQUExQixLQUEwQjtBQUFBLFVBQW5CLE1BQW1CO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BDLDhCQUE4QixNQUE5QixtSUFBc0M7QUFBQTs7QUFBQSxjQUExQixLQUEwQjtBQUFBLGNBQW5CLE1BQW1COztBQUNwQyxjQUFNLFNBQVMsT0FBTyxNQUFQLENBQWMsVUFBVSxJQUF4QixDQUFmO0FBQUEsY0FDTSxXQUFXLE9BQU8sTUFBUCxDQUFjLFVBQVUsTUFBeEIsQ0FEakI7QUFBQSxjQUVNLFNBQVMsU0FBUyxRQUZ4QjtBQUFBLGNBR00sT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFNLE1BQU4sR0FBZSxVQUExQixDQUhiO0FBQUEsY0FJTSxTQUFTLE9BQU8sS0FBUCxDQUFhLFVBQVUsSUFBdkIsQ0FKZjtBQUFBLGNBS00sV0FBVyxPQUFPLEtBQVAsQ0FBYSxVQUFVLE1BQXZCLENBTGpCO0FBQUEsY0FNTSxTQUFTLFNBQVMsUUFOeEI7QUFBQSxjQU9NLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBTSxNQUFOLEdBQWUsS0FBSyxNQUEvQixDQVBiO0FBUUEsZUFBSyxJQUFMLENBQVUsRUFBRSxZQUFGLEVBQVMsa0JBQVQsRUFBbUIsWUFBbkIsRUFBMEIsY0FBMUIsRUFBa0Msa0JBQWxDLEVBQTRDLGNBQTVDLEVBQW9ELFVBQXBEO0FBQzBCLDBCQUQxQixFQUNrQyxrQkFEbEMsRUFDNEMsY0FENUMsRUFDb0QsVUFEcEQsRUFBVjtBQUVEO0FBWm1DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBYXBDLFFBQUcsUUFBSDtBQUNEO0FBdEIyQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQXdCNUMsU0FDRTtBQUFBO0FBQUEsTUFBSyxXQUFVLGtCQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQU8sSUFBRyxhQUFWLEVBQXdCLFdBQVcsS0FBSyxNQUFMLEdBQWMsQ0FBZCxHQUFrQixVQUFsQixHQUErQixTQUFsRTtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFJLFNBQVEsR0FBWjtBQUFBO0FBQUEsV0FGRjtBQUU2QjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRjdCO0FBRXVDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FGdkM7QUFHRTtBQUFBO0FBQUEsY0FBSSxTQUFRLEdBQVo7QUFBQTtBQUFBLFdBSEY7QUFHNEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUg1QjtBQUdzQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSHRDO0FBREYsT0FERjtBQVFFO0FBQUE7QUFBQTtBQUVFLGFBQUssR0FBTCxDQUFTLFVBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUI7QUFDNUIsaUJBQ0U7QUFBQTtBQUFBLGNBQUksS0FBSyxLQUFULEVBQWdCLFdBQVcsSUFBSSxRQUFKLEdBQWUsQ0FBZixHQUFtQixXQUFuQixHQUFpQyxZQUE1RDtBQUNnQixrQ0FBa0IsSUFBSSxLQUR0QztBQUVFO0FBQUE7QUFBQSxnQkFBSSxXQUFVLE9BQWQ7QUFBdUIsa0JBQUk7QUFBM0IsYUFGRjtBQUdFO0FBQUE7QUFBQSxnQkFBSSxXQUFVLFNBQWQ7QUFBeUIsa0JBQUk7QUFBN0IsYUFIRjtBQUlFO0FBQUE7QUFBQSxnQkFBSSxXQUFVLFNBQWQ7QUFBeUIsa0JBQUksSUFBN0I7QUFBQTtBQUFBLGFBSkY7QUFLRTtBQUFBO0FBQUEsZ0JBQUksV0FBVSxTQUFkO0FBQXlCLGtCQUFJO0FBQTdCLGFBTEY7QUFNRTtBQUFBO0FBQUEsZ0JBQUksV0FBVSxTQUFkO0FBQXlCLGtCQUFJO0FBQTdCLGFBTkY7QUFPRTtBQUFBO0FBQUEsZ0JBQUksV0FBVSxTQUFkO0FBQXlCLGtCQUFJO0FBQTdCLGFBUEY7QUFRRTtBQUFBO0FBQUEsZ0JBQUksV0FBVSxTQUFkO0FBQXlCLGtCQUFJLElBQTdCO0FBQUE7QUFBQSxhQVJGO0FBU0U7QUFBQTtBQUFBLGdCQUFJLFdBQVUsU0FBZDtBQUF5QixrQkFBSTtBQUE3QixhQVRGO0FBVUU7QUFBQTtBQUFBLGdCQUFJLFdBQVUsU0FBZDtBQUF5QixrQkFBSTtBQUE3QjtBQVZGLFdBREY7QUFjRCxTQWZEO0FBRkY7QUFSRjtBQURGLEdBREY7QUFpQ0QsQ0F6REQ7O0FBMkRBLFVBQVUsU0FBVixHQUFzQjtBQUNwQixRQUFNLGlCQUFVLE9BQVYsQ0FBa0IsaUJBQVUsTUFBNUIsRUFBb0MsVUFEdEI7QUFFcEIsa0JBQWdCLGlCQUFVO0FBRk4sQ0FBdEI7O2tCQUtlLFM7Ozs7Ozs7Ozs7Ozs7Ozs7a0RDbEVOLE87Ozs7Ozs7OzsyQ0FDQSxPOzs7Ozs7Ozs7bURBQ0EsTzs7Ozs7Ozs7O3FEQUNBLE87Ozs7Ozs7Ozs4Q0FDQSxPOzs7Ozs7Ozs7MkNBQ0EsTzs7Ozs7Ozs7O3FEQUNBLE87Ozs7Ozs7OztvREFDQSxPOzs7Ozs7Ozs7K0NBQ0EsTzs7Ozs7Ozs7O2lEQUNBLE87Ozs7Ozs7Ozs4Q0FDQSxPOzs7Ozs7Ozs7NkNBQ0EsTzs7Ozs7Ozs7O3NEQUNBLE87Ozs7Ozs7OzsrQ0FDQSxPOzs7Ozs7Ozs7MkNBQ0EsTzs7Ozs7Ozs7OzhDQUNBLE87Ozs7Ozs7OzsrQ0FDQSxPOzs7Ozs7Ozs7MkNBQ0EsTzs7Ozs7Ozs7O21EQUNBLE87Ozs7Ozs7OzsrQ0FDQSxPOzs7Ozs7Ozs7b0RBQ0EsTzs7Ozs7Ozs7OzZDQUNBLE87Ozs7Ozs7OztpREFDQSxPOzs7Ozs7Ozs7d0NBQ0EsTzs7Ozs7Ozs7OzZDQUNBLE87Ozs7Ozs7OztpREFDQSxPOzs7Ozs7Ozs7eURBQ0EsTzs7Ozs7Ozs7OzBDQUNBLE87Ozs7Ozs7OzttREFDQSxPOzs7Ozs7Ozs7a0RBR0EsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDVDs7OztJQUlxQixhOzs7Ozs7O3dDQUVRLFEsRUFBMkM7QUFBQSxVQUFqQyxPQUFpQyx5REFBekIsVUFBVSxPQUFWLENBQWtCLEtBQU87O0FBQ3BFLFVBQUksU0FBUyxlQUFiLEVBQThCO0FBQzVCLGVBQU8sUUFBUDtBQUNEO0FBQ0QsYUFBTyxJQUFJLFVBQVUsUUFBZCxDQUF1QixPQUF2QixFQUFnQyxTQUFTLFlBQXpDLEVBQXVELFNBQVMsR0FBaEUsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztrQ0FRcUIsTyxFQUFTLGEsRUFBZSxPLEVBQVM7QUFDcEQsVUFBTSxjQUFjLGNBQWMsR0FBZCxDQUFrQjtBQUFBLGVBQUssVUFBVSxRQUFWLENBQW1CLGVBQW5CLENBQW1DLE9BQW5DLEVBQTRDLENBQTVDLENBQUw7QUFBQSxPQUFsQixDQUFwQjtBQUNBLGFBQU8sUUFBUSxNQUFSLENBQWUsYUFBSztBQUN6QixZQUFNLE9BQU8sVUFBVSxRQUFWLENBQW1CLGVBQW5CLENBQW1DLE9BQW5DLEVBQTRDLENBQTVDLENBQWI7QUFDQSxlQUFPLFlBQVksT0FBWixDQUFvQixJQUFwQixNQUE4QixDQUFDLENBQXRDO0FBQ0QsT0FITSxDQUFQO0FBSUQ7O0FBRUQ7Ozs7Ozs7Ozs7bURBT3NDLFMsRUFBVyxjLEVBQWdCO0FBQy9ELFVBQUksU0FBUyxJQUFJLEdBQUosRUFBYjtBQUFBLFVBQ0ksYUFBYSxrQkFBa0IsVUFBVSxNQUQ3Qzs7QUFHQTtBQUorRDtBQUFBO0FBQUE7O0FBQUE7QUFLL0QsNkJBQTJCLFVBQVUsT0FBVixFQUEzQiw4SEFBZ0Q7QUFBQTs7QUFBQSxjQUFwQyxLQUFvQztBQUFBLGNBQTdCLEdBQTZCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQzlDLGtDQUFvQixPQUFPLElBQVAsQ0FBWSxJQUFJLFNBQUosQ0FBYyxlQUExQixDQUFwQixtSUFBZ0U7QUFBQSxrQkFBckQsS0FBcUQ7O0FBQzlELGtCQUFJLFFBQVEsSUFBSSxTQUFKLENBQWMsZUFBZCxDQUE4QixLQUE5QixDQUFaO0FBQUEsa0JBQ0ksY0FBYyxPQUFPLEdBQVAsQ0FBVyxLQUFYLEtBQXFCLElBQUksR0FBSixFQUR2QztBQUFBLGtCQUVJLGNBQWMsWUFBWSxHQUFaLENBQWdCLEtBQWhCLEtBQTBCLEVBQUUsUUFBUSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVYsRUFBa0IsT0FBTyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLEVBRjVDO0FBR0Esa0JBQUksQ0FBQyxPQUFPLEdBQVAsQ0FBVyxLQUFYLENBQUwsRUFBd0IsT0FBTyxHQUFQLENBQVcsS0FBWCxFQUFrQixXQUFsQjtBQUN4QixrQkFBSSxDQUFDLFlBQVksR0FBWixDQUFnQixLQUFoQixDQUFMLEVBQTZCLFlBQVksR0FBWixDQUFnQixLQUFoQixFQUF1QixXQUF2QjtBQUM3QjtBQUNBLGtCQUFJLFNBQVMsVUFBVSxNQUFWLEdBQW1CLFVBQWhDLEVBQ0UsRUFBRyxZQUFZLE1BQVosQ0FBbUIsSUFBSSxHQUF2QixDQUFIO0FBQ0YsZ0JBQUcsWUFBWSxLQUFaLENBQWtCLElBQUksR0FBdEIsQ0FBSDtBQUNEO0FBWDZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZL0M7QUFqQjhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBa0IvRCxhQUFPLE1BQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7aURBUW9DLFEsRUFBVSxZLEVBQWM7QUFDMUQsVUFBSSxVQUFVLEVBQWQ7QUFBQSxVQUNJLG1CQUFtQixhQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FEdkI7QUFEMEQ7QUFBQTtBQUFBOztBQUFBO0FBRzFELDhCQUEyQixnQkFBM0IsbUlBQTZDO0FBQUEsY0FBbEMsWUFBa0M7O0FBQUEsb0NBQ3BCLGFBQWEsS0FBYixDQUFtQixHQUFuQixDQURvQjs7QUFBQTs7QUFBQSxjQUNwQyxJQURvQztBQUNyQyxjQUFPLE1BQVA7QUFDQSxxQkFBTyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBUDtBQUNOLGNBQUksUUFBUSxNQUFSLElBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGdCQUFJLENBQUMsUUFBUSxJQUFSLENBQUwsRUFBb0IsUUFBUSxJQUFSLElBQWdCLEVBQWhCO0FBQ3BCLG9CQUFRLElBQVIsRUFBYyxJQUFkLElBQXNCLE1BQXRCO0FBQ0Q7QUFDRjtBQVZ5RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVcxRCxhQUFPLE9BQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O29EQVN1QyxRLEVBQVUsWSxFQUFjLFcsRUFBYTtBQUMxRSxVQUFNLGFBQWEsY0FBYyw0QkFBZCxDQUEyQyxRQUEzQyxFQUFxRCxZQUFyRCxDQUFuQjtBQUNBLFVBQU0sa0JBQWtCLFlBQXhCO0FBQ0EsV0FBSyxJQUFNLElBQVgsSUFBbUIsVUFBbkIsRUFBK0I7QUFDN0IsWUFBTSxZQUFZLFdBQVcsSUFBWCxDQUFsQjtBQUNBO0FBQ0EsWUFBSSxDQUFDLFVBQVUsQ0FBWCxJQUFnQixZQUFZLElBQVosQ0FBaEIsSUFBcUMsWUFBWSxJQUFaLEVBQWtCLENBQTNELEVBQThEO0FBQzVELDRCQUFrQixnQkFBZ0IsT0FBaEIsUUFBNkIsVUFBVSxDQUF2QyxTQUFpRCxZQUFZLElBQVosRUFBa0IsQ0FBbkUsU0FBbEI7QUFDRDtBQUNEO0FBQ0EsWUFBSSxDQUFDLFVBQVUsQ0FBWCxJQUFnQixZQUFZLElBQVosQ0FBaEIsSUFBcUMsWUFBWSxJQUFaLEVBQWtCLENBQTNELEVBQThEO0FBQzVELDRCQUFrQixnQkFBZ0IsT0FBaEIsUUFBNkIsVUFBVSxDQUF2QyxZQUFvRCxZQUFZLElBQVosRUFBa0IsQ0FBdEUsQ0FBbEI7QUFDRDtBQUNGO0FBQ0QsYUFBTyxlQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5REFTNEMsUSxFQUFVLFksRUFBYyxnQixFQUFrQjtBQUNwRixVQUFNLGNBQWMsY0FBYyw0QkFBZCxDQUEyQyxRQUEzQyxFQUFxRCxnQkFBckQsQ0FBcEI7QUFDQSxhQUFPLGNBQWMsK0JBQWQsQ0FBOEMsUUFBOUMsRUFBd0QsWUFBeEQsRUFBc0UsV0FBdEUsQ0FBUDtBQUNEOzs7c0RBRXdDLFMsRUFBVyxTLEVBQVcsa0IsRUFBb0Isa0IsRUFBb0IsYyxFQUFnQjtBQUNySCxVQUFJLFFBQVEsQ0FBWjtBQUFBLFVBQ0ksY0FBYyxVQUFVLGVBQVYsR0FBNEIsS0FBNUIsQ0FBa0MsR0FBbEMsRUFBdUMsR0FBdkMsQ0FBMkM7QUFBQSxlQUFLLEVBQUUsS0FBRixDQUFRLEdBQVIsRUFBYSxDQUFiLENBQUw7QUFBQSxPQUEzQyxDQURsQjtBQUFBLFVBRUksY0FBYyxVQUFVLGVBQVYsR0FBNEIsS0FBNUIsQ0FBa0MsR0FBbEMsRUFBdUMsR0FBdkMsQ0FBMkM7QUFBQSxlQUFLLEVBQUUsS0FBRixDQUFRLEdBQVIsRUFBYSxDQUFiLENBQUw7QUFBQSxPQUEzQyxDQUZsQjtBQUFBLFVBR0ksY0FBYyxlQUFlLFNBQWYsQ0FBeUIsZUFIM0M7QUFBQSxVQUlJLGFBQWEsVUFBVSxPQUFWLENBQWtCLFVBSm5DOztBQU1BLFdBQUssSUFBSSxLQUFULElBQWtCLFVBQWxCLEVBQThCO0FBQzVCLFlBQUksV0FBVyxjQUFYLENBQTBCLEtBQTFCLENBQUosRUFBc0M7QUFDcEMsY0FBSSxvQkFBb0IsV0FBVyxLQUFYLEVBQWtCLFlBQVksS0FBWixDQUFsQixDQUF4QjtBQUFBLGNBQ0ksZUFBZSxRQURuQjtBQUVBLGNBQUkscUJBQXFCLGtCQUFrQixNQUEzQyxFQUFtRDtBQUNqRCxpQkFBSyxJQUFJLElBQUksQ0FBUixFQUFXLEtBQUssa0JBQWtCLE1BQXZDLEVBQStDLElBQUUsRUFBakQsRUFBcUQsR0FBckQsRUFBMEQ7QUFDeEQsa0JBQUksV0FBVyxrQkFBa0IsQ0FBbEIsQ0FBZjtBQUFBLGtCQUNJLG9CQUFvQixDQUR4QjtBQUFBLGtCQUVJLG9CQUFvQixDQUZ4QjtBQUdBLG1CQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxTQUFTLE1BQTlCLEVBQXNDLElBQUUsRUFBeEMsRUFBNEMsR0FBNUMsRUFBaUQ7QUFDL0Msb0JBQUksVUFBVSxTQUFTLENBQVQsQ0FBZDtBQUFBLG9CQUNJLFVBQVUsSUFBRSxDQUFGLEtBQVEsQ0FBUixHQUFZLFNBQVMsSUFBRSxDQUFYLENBQVosR0FBNEIsU0FBUyxJQUFFLENBQVgsQ0FEMUM7QUFBQSxvQkFFSSxnQkFBZ0IsQ0FGcEI7QUFHQSxvQkFBSSxZQUFZLE9BQVosQ0FBb0IsT0FBcEIsTUFBaUMsQ0FBQyxDQUF0QyxFQUF5QztBQUN2QyxzQkFBSSxZQUFZLG1CQUFtQixPQUFuQixDQUEyQixPQUEzQixJQUFzQyxDQUFDLENBQXZDLElBQ1osbUJBQW1CLE9BQW5CLENBQTJCLFFBQVEsV0FBUixFQUEzQixJQUFvRCxDQUFDLENBRHJELENBQUosRUFDNkQ7QUFDM0Q7QUFDRCxtQkFIRCxNQUdPO0FBQ0wsb0NBQWdCLFFBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxvQkFBSSxZQUFZLE9BQVosQ0FBb0IsT0FBcEIsTUFBaUMsQ0FBQyxDQUF0QyxFQUF5QztBQUN2QyxzQkFBSSxZQUFZLG1CQUFtQixPQUFuQixDQUEyQixPQUEzQixJQUFzQyxDQUFDLENBQXZDLElBQ1YsbUJBQW1CLE9BQW5CLENBQTJCLFFBQVEsV0FBUixFQUEzQixJQUFvRCxDQUFDLENBRHZELENBQUosRUFDK0Q7QUFDN0Q7QUFDRCxtQkFIRCxNQUdPO0FBQ0wsb0NBQWdCLFFBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxvQkFBSSxJQUFFLENBQUYsS0FBUSxDQUFaLEVBQWU7QUFDYix1Q0FBcUIsYUFBckI7QUFDRCxpQkFGRCxNQUVPO0FBQ0wsdUNBQXFCLGFBQXJCO0FBQ0Q7QUFDRjtBQUNELDZCQUFlLEtBQUssR0FBTCxDQUFTLFlBQVQsRUFBdUIsS0FBSyxHQUFMLENBQVMsaUJBQVQsRUFBNEIsaUJBQTVCLENBQXZCLENBQWY7QUFDRDtBQUNELHFCQUFTLFlBQVQ7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O29EQVF1QyxZLEVBQWMsYyxFQUFnQjtBQUNuRSxxQkFBZSxLQUFLLG1CQUFMLENBQXlCLFlBQXpCLENBQWY7QUFDQSx1QkFBaUIsS0FBSyxtQkFBTCxDQUF5QixjQUF6QixDQUFqQjs7QUFFQSxVQUFJLHNCQUFzQixjQUFjLHFDQUFkLENBQ2dCLGFBQWEsU0FBYixDQUF1QixlQUR2QyxFQUVnQixlQUFlLFNBQWYsQ0FBeUIsZUFGekMsRUFHZ0IsYUFBYSxRQUFiLENBQXNCLFFBQXRCLENBQStCLFVBSC9DLEVBSWdCLGFBQWEsT0FBYixDQUFxQixVQUpyQyxDQUExQjtBQUtBLFVBQUksYUFBYSxHQUFiLEtBQXFCLGVBQWUsR0FBeEMsRUFDRSxFQUFFLG1CQUFGOztBQUVGLGFBQU8sbUJBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzBEQVk2QyxtQixFQUFxQixxQixFQUF1QixXLEVBQWEsVSxFQUFZO0FBQ2hILFVBQU0sVUFBVSxXQUFoQjtBQUNBLFVBQU0sUUFBUSxDQUFkOztBQUVBLFdBQUssSUFBTSxLQUFYLElBQW9CLFVBQXBCLEVBQWdDO0FBQzlCLFlBQUksV0FBVyxjQUFYLENBQTBCLEtBQTFCLENBQUosRUFBc0M7QUFDcEMsY0FBSSxvQkFBb0IsS0FBcEIsTUFBK0Isc0JBQXNCLEtBQXRCLENBQW5DLEVBQWlFO0FBQy9EO0FBQ0E7QUFDQSxnQkFBTSx1QkFBdUIsY0FBYyx5QkFBZCxDQUF3QyxLQUF4QyxFQUErQyxVQUEvQyxDQUE3QjtBQUNBLGdCQUFNLHdCQUF3QixFQUE5QjtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxRQUFRLE1BQTdCLEVBQXFDLElBQUksRUFBekMsRUFBNkMsR0FBN0MsRUFBa0Q7QUFDaEQsa0JBQUkscUJBQXFCLE9BQXJCLENBQTZCLFFBQVEsQ0FBUixDQUE3QixLQUE0QyxDQUFoRCxFQUFrRDtBQUNoRCxzQ0FBc0IsSUFBdEIsQ0FBMkIsUUFBUSxDQUFSLENBQTNCO0FBQ0Q7QUFDRjtBQUNEO0FBQ0EsZ0JBQU0sb0JBQW9CLFdBQVcsS0FBWCxFQUFrQixzQkFBc0IsS0FBdEIsQ0FBbEIsQ0FBMUI7QUFDQSxnQkFBTSxxQkFBcUIsUUFBM0I7QUFDQSxpQkFBSyxJQUFJLEtBQUksQ0FBUixFQUFXLE1BQUssa0JBQWtCLE1BQXZDLEVBQStDLEtBQUksR0FBbkQsRUFBdUQsSUFBdkQsRUFBNEQ7QUFDMUQsa0JBQUksV0FBVyxrQkFBa0IsRUFBbEIsRUFBcUIsS0FBckIsRUFBZjtBQUFBLGtCQUNJLGFBQWEsQ0FEakI7QUFFQSxtQkFBSyxJQUFJLElBQUksQ0FBUixFQUFXLEtBQUssc0JBQXNCLE1BQTNDLEVBQW1ELElBQUksRUFBdkQsRUFBMkQsR0FBM0QsRUFBK0Q7QUFDN0Qsb0JBQUksU0FBUyxPQUFULENBQWlCLHNCQUFzQixDQUF0QixDQUFqQixNQUErQyxDQUFDLENBQXBELEVBQXNEO0FBQ3BEO0FBQ0QsaUJBRkQsTUFFTztBQUNMLDJCQUFTLE1BQVQsQ0FBZ0IsU0FBUyxPQUFULENBQWlCLHNCQUFzQixDQUF0QixDQUFqQixDQUFoQixFQUE0RCxDQUE1RCxFQURLLENBQzJEO0FBQ2pFO0FBQ0Y7QUFDRCxtQ0FBc0IsYUFBYSxrQkFBZCxHQUFvQyxVQUFwQyxHQUFpRCxrQkFBdEU7QUFDRDtBQUNELHFCQUFTLGtCQUFUO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs4Q0FVaUMsSyxFQUFPLFUsRUFBWTtBQUNsRCxVQUFJLGNBQWMsd0JBQWQsQ0FBdUMsS0FBdkMsQ0FBSixFQUFtRDtBQUNqRCxlQUFPLGNBQWMsd0JBQWQsQ0FBdUMsS0FBdkMsQ0FBUDtBQUNEOztBQUVELFVBQUksY0FBYyxFQUFsQjtBQUFBLFVBQ0ksVUFBYyxFQURsQjtBQUVBLFdBQUssSUFBTSxjQUFYLElBQTZCLFdBQVcsS0FBWCxDQUE3QixFQUErQztBQUMzQyxhQUFLLElBQU0scUJBQVgsSUFBb0MsV0FBVyxLQUFYLEVBQWtCLGNBQWxCLENBQXBDLEVBQXVFO0FBQ3JFLGNBQUksV0FBVyxLQUFYLEVBQWtCLGNBQWxCLEVBQWtDLGNBQWxDLENBQWlELHFCQUFqRCxDQUFKLEVBQTRFO0FBQzFFLGlCQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSyxXQUFXLEtBQVgsRUFBa0IsY0FBbEIsRUFBa0MscUJBQWxDLEVBQXlELE1BQTlFLEVBQXNGLElBQUksRUFBMUYsRUFBOEYsR0FBOUYsRUFBbUc7QUFDakcsMEJBQVksV0FBVyxLQUFYLEVBQWtCLGNBQWxCLEVBQWtDLHFCQUFsQyxFQUF5RCxDQUF6RCxDQUFaLElBQTJFLENBQTNFO0FBQ0Q7QUFDRjtBQUNGO0FBQ0o7O0FBRUQsV0FBSyxJQUFNLE1BQVgsSUFBcUIsV0FBckIsRUFBaUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLE1BQWI7QUFDRDs7QUFFRCxvQkFBYyx3QkFBZCxDQUF1QyxLQUF2QyxJQUFnRCxPQUFoRCxDQXJCa0QsQ0FxQlE7QUFDMUQsYUFBTyxPQUFQO0FBQ0Q7Ozs7OztBQW5Sa0IsYSxDQTJQWix3QixHQUEyQixFO2tCQTNQZixhOzs7Ozs7OztrQkNKTjtBQUNiO0FBQ0EsbUNBQWlDLGFBRnBCO0FBR2Isb0NBQWtDLGNBSHJCO0FBSWIsK0JBQTZCLGtCQUpoQjtBQUtiLDZCQUEyQiwyQ0FMZDtBQU1iLDZCQUEyQix1Q0FOZDs7QUFRYjtBQUNBLDRCQUEwQixZQVRiO0FBVWIsa0NBQWdDLHVCQVZuQjtBQVdiLCtCQUE2QiwwQkFYaEI7QUFZYiwwQkFBd0IsUUFaWDtBQWFiLDhCQUE0QiwrQkFiZjtBQWNiLDBCQUF3Qiw2Q0FkWDtBQWViLDBCQUF3QixzREFmWDtBQWdCYiw0QkFBMEI7OENBaEJiO0FBa0JiLDZCQUEyQixtREFsQmQ7QUFtQmIsZ0NBQThCLDBEQW5CakI7QUFvQmIsNEJBQTBCLHFEQXBCYjs7QUFzQmI7QUFDQSxnQkFBYyxJQXZCRDtBQXdCYix1QkFBcUIsV0F4QlI7QUF5QmIsNkJBQTJCLGtCQXpCZDtBQTBCYixzQkFBb0IsVUExQlA7QUEyQmIsd0JBQXNCLFlBM0JUO0FBNEJiLDRCQUEwQixnQkE1QmI7QUE2QmIsdUJBQXFCLFdBN0JSO0FBOEJiLHFDQUFtQyxjQTlCdEI7QUErQmIseUJBQXVCLGFBL0JWO0FBZ0NiLHdCQUFzQixXQWhDVDtBQWlDYixvQkFBa0IsUUFqQ0w7QUFrQ2IsbUJBQWlCLE9BbENKO0FBbUNiLGdDQUE4QixXQW5DakI7QUFvQ2IsdUJBQXFCLGNBcENSOztBQXNDYjtBQUNBLG1CQUFpQjtBQXZDSixDOzs7Ozs7Ozs7QUNBZjs7Ozs7O2tCQUVlO0FBQ2I7QUFEYSxDOzs7Ozs7OztrQkNnQlMsUzs7QUFsQnhCOzs7Ozs7QUFFQSxJQUFNLGNBQWMsT0FBcEI7QUFBQSxJQUNNLFlBQVksb0JBRGxCO0FBQUEsSUFFTSxRQUFRLHlCQUZkOztBQUlBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsR0FBRCxFQUFNLElBQU47QUFBQSxTQUFlLGVBQWEsSUFBYixLQUFzQixlQUFhLElBQWIsRUFBbUIsR0FBbkIsQ0FBdEIsSUFBaUQsR0FBaEU7QUFBQSxDQUF4Qjs7QUFFQTs7Ozs7Ozs7OztBQVVlLFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUEwQztBQUFBLE1BQWxCLElBQWtCLHlEQUFiLFdBQWE7O0FBQ3ZELE1BQUksT0FBTyxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0IsV0FBTyxnQkFBZ0IsR0FBaEIsRUFBcUIsSUFBckIsQ0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUM3QixRQUFJLGNBQWMsZ0JBQWdCLElBQUksQ0FBSixDQUFoQixFQUF3QixJQUF4QixDQUFsQjtBQUNBLFdBQU8sWUFBWSxPQUFaLENBQW9CLFNBQXBCLEVBQStCLFVBQUMsS0FBRCxFQUFRLEVBQVI7QUFBQSxhQUNwQyxJQUFJLEVBQUUsRUFBTixJQUFZLGdCQUFnQixJQUFJLEVBQUosQ0FBaEIsRUFBeUIsSUFBekIsQ0FBWixHQUE2QyxLQURUO0FBQUEsS0FBL0IsQ0FBUDtBQUVEO0FBQ0QsVUFBUSxHQUFSLENBQVksdUJBQVosRUFBcUMsR0FBckM7QUFDQSxTQUFPLEtBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYWJlbEhlbHBlcnMgPSByZXF1aXJlKCcuL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKlxyXG4gKiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gYWN0aXZlRWxlbWVudDtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gYWN0aXZlRWxlbWVudCgpIHtcbiAgdmFyIGRvYyA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMF07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcbnZhciBoYXNDbGFzcyA9IHJlcXVpcmUoJy4vaGFzQ2xhc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtlbHNlIGlmICghaGFzQ2xhc3MoZWxlbWVudCkpIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgcmV0dXJuICEhY2xhc3NOYW1lICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7ZWxzZSByZXR1cm4gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIGNsYXNzTmFtZSArICcgJykgIT09IC0xO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRDbGFzczogcmVxdWlyZSgnLi9hZGRDbGFzcycpLFxuICByZW1vdmVDbGFzczogcmVxdWlyZSgnLi9yZW1vdmVDbGFzcycpLFxuICBoYXNDbGFzczogcmVxdWlyZSgnLi9oYXNDbGFzcycpXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtlbHNlIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NOYW1lICsgJyg/OlxcXFxzfCQpJywgJ2cnKSwgJyQxJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvZmYgPSBmdW5jdGlvbiBvZmYoKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuXG4gIG9mZiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmY7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvbiA9IGZ1bmN0aW9uIG9uKCkge307XG5cbmlmIChjYW5Vc2VET00pIHtcbiAgb24gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICByZXR1cm4gbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfTtlbHNlIGlmIChkb2N1bWVudC5hdHRhY2hFdmVudCkgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBub2RlLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG93bmVyRG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIG93bmVyRG9jdW1lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcblxudmFyIGNvbnRhaW5zID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJvb3QgPSBjYW5Vc2VET00gJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMgPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0LmNvbnRhaW5zKG5vZGUpO1xuICB9IDogcm9vdCAmJiByb290LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dCA9PT0gbm9kZSB8fCAhIShjb250ZXh0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGUpICYgMTYpO1xuICB9IDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICBpZiAobm9kZSkgZG8ge1xuICAgICAgaWYgKG5vZGUgPT09IGNvbnRleHQpIHJldHVybiB0cnVlO1xuICAgIH0gd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IG5vZGUud2luZG93ID8gbm9kZSA6IG5vZGUubm9kZVR5cGUgPT09IDkgPyBub2RlLmRlZmF1bHRWaWV3IHx8IG5vZGUucGFyZW50V2luZG93IDogZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4uL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbnZhciBfdXRpbENhbWVsaXplU3R5bGUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZTIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsQ2FtZWxpemVTdHlsZSk7XG5cbnZhciBycG9zaXRpb24gPSAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC87XG52YXIgcm51bW5vbnB4ID0gL14oWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpKSg/IXB4KVthLXolXSskL2k7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2dldENvbXB1dGVkU3R5bGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIEVsZW1lbnQgcGFzc2VkIHRvIGBnZXRDb21wdXRlZFN0eWxlKClgJyk7XG4gIHZhciBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgcmV0dXJuICdkZWZhdWx0VmlldycgaW4gZG9jID8gZG9jLmRlZmF1bHRWaWV3Lm9wZW5lciA/IG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB7IC8vaWUgOCBcIm1hZ2ljXCIgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8xLjExLXN0YWJsZS9zcmMvY3NzL2N1ckNTUy5qcyNMNzJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlKHByb3ApIHtcbiAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG5cbiAgICAgIHByb3AgPSAoMCwgX3V0aWxDYW1lbGl6ZVN0eWxlMlsnZGVmYXVsdCddKShwcm9wKTtcblxuICAgICAgaWYgKHByb3AgPT0gJ2Zsb2F0JykgcHJvcCA9ICdzdHlsZUZsb2F0JztcblxuICAgICAgdmFyIGN1cnJlbnQgPSBub2RlLmN1cnJlbnRTdHlsZVtwcm9wXSB8fCBudWxsO1xuXG4gICAgICBpZiAoY3VycmVudCA9PSBudWxsICYmIHN0eWxlICYmIHN0eWxlW3Byb3BdKSBjdXJyZW50ID0gc3R5bGVbcHJvcF07XG5cbiAgICAgIGlmIChybnVtbm9ucHgudGVzdChjdXJyZW50KSAmJiAhcnBvc2l0aW9uLnRlc3QocHJvcCkpIHtcbiAgICAgICAgLy8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xuICAgICAgICB2YXIgbGVmdCA9IHN0eWxlLmxlZnQ7XG4gICAgICAgIHZhciBydW5TdHlsZSA9IG5vZGUucnVudGltZVN0eWxlO1xuICAgICAgICB2YXIgcnNMZWZ0ID0gcnVuU3R5bGUgJiYgcnVuU3R5bGUubGVmdDtcblxuICAgICAgICAvLyBQdXQgaW4gdGhlIG5ldyB2YWx1ZXMgdG8gZ2V0IGEgY29tcHV0ZWQgdmFsdWUgb3V0XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSBub2RlLmN1cnJlbnRTdHlsZS5sZWZ0O1xuXG4gICAgICAgIHN0eWxlLmxlZnQgPSBwcm9wID09PSAnZm9udFNpemUnID8gJzFlbScgOiBjdXJyZW50O1xuICAgICAgICBjdXJyZW50ID0gc3R5bGUucGl4ZWxMZWZ0ICsgJ3B4JztcblxuICAgICAgICAvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG4gICAgICAgIHN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgICAgICBpZiAocnNMZWZ0KSBydW5TdHlsZS5sZWZ0ID0gcnNMZWZ0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi4vdXRpbC9jYW1lbGl6ZVN0eWxlJyksXG4gICAgaHlwaGVuYXRlID0gcmVxdWlyZSgnLi4vdXRpbC9oeXBoZW5hdGVTdHlsZScpLFxuICAgIF9nZXRDb21wdXRlZFN0eWxlID0gcmVxdWlyZSgnLi9nZXRDb21wdXRlZFN0eWxlJyksXG4gICAgcmVtb3ZlU3R5bGUgPSByZXF1aXJlKCcuL3JlbW92ZVN0eWxlJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlKG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICB2YXIgY3NzID0gJycsXG4gICAgICBwcm9wcyA9IHByb3BlcnR5O1xuXG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vZGUuc3R5bGVbY2FtZWxpemUocHJvcGVydHkpXSB8fCBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5nZXRQcm9wZXJ0eVZhbHVlKGh5cGhlbmF0ZShwcm9wZXJ0eSkpO2Vsc2UgKHByb3BzID0ge30pW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSBpZiAoaGFzLmNhbGwocHJvcHMsIGtleSkpIHtcbiAgICAhcHJvcHNba2V5XSAmJiBwcm9wc1trZXldICE9PSAwID8gcmVtb3ZlU3R5bGUobm9kZSwgaHlwaGVuYXRlKGtleSkpIDogY3NzICs9IGh5cGhlbmF0ZShrZXkpICsgJzonICsgcHJvcHNba2V5XSArICc7JztcbiAgfVxuXG4gIG5vZGUuc3R5bGUuY3NzVGV4dCArPSAnOycgKyBjc3M7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVTdHlsZShub2RlLCBrZXkpIHtcbiAgcmV0dXJuICdyZW1vdmVQcm9wZXJ0eScgaW4gbm9kZS5zdHlsZSA/IG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KSA6IG5vZGUuc3R5bGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59OyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW1wiZXhwb3J0c1wiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2Uge1xuICAgIGZhY3Rvcnkocm9vdC5iYWJlbEhlbHBlcnMgPSB7fSk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIGJhYmVsSGVscGVycyA9IGdsb2JhbDtcblxuICBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICBcImRlZmF1bHRcIjogb2JqXG4gICAgfTtcbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHJIeXBoZW4gPSAvLSguKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uockh5cGhlbiwgZnVuY3Rpb24gKF8sIGNocikge1xuICAgIHJldHVybiBjaHIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59OyIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yYWViOGEyYTZiZWIwMDYxN2E0MjE3ZjdmODI4NDkyNGZhMmFkODE5L3NyYy92ZW5kb3IvY29yZS9jYW1lbGl6ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi9jYW1lbGl6ZScpO1xudmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBjYW1lbGl6ZShzdHJpbmcucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJVcHBlciA9IC8oW0EtWl0pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoclVwcGVyLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2h5cGhlbmF0ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoeXBoZW5hdGUgPSByZXF1aXJlKFwiLi9oeXBoZW5hdGVcIik7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCBcIi1tcy1cIik7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuL2luRE9NJyk7XG5cbnZhciBzaXplO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNhbGMpIHtcbiAgaWYgKCFzaXplIHx8IHJlY2FsYykge1xuICAgIGlmIChjYW5Vc2VET00pIHtcbiAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgIHNpemUgPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNpemU7XG59OyIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgdmFyIGdldE5hbm9TZWNvbmRzLCBocnRpbWUsIGxvYWRUaW1lO1xuXG4gIGlmICgodHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsKSAmJiBwZXJmb3JtYW5jZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwpICYmIHByb2Nlc3MuaHJ0aW1lKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoZ2V0TmFub1NlY29uZHMoKSAtIGxvYWRUaW1lKSAvIDFlNjtcbiAgICB9O1xuICAgIGhydGltZSA9IHByb2Nlc3MuaHJ0aW1lO1xuICAgIGdldE5hbm9TZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaHI7XG4gICAgICBociA9IGhydGltZSgpO1xuICAgICAgcmV0dXJuIGhyWzBdICogMWU5ICsgaHJbMV07XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IGdldE5hbm9TZWNvbmRzKCk7XG4gIH0gZWxzZSBpZiAoRGF0ZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG4gICwgcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93XG4gICwgdmVuZG9ycyA9IFsnbW96JywgJ3dlYmtpdCddXG4gICwgc3VmZml4ID0gJ0FuaW1hdGlvbkZyYW1lJ1xuICAsIHJhZiA9IHJvb3RbJ3JlcXVlc3QnICsgc3VmZml4XVxuICAsIGNhZiA9IHJvb3RbJ2NhbmNlbCcgKyBzdWZmaXhdIHx8IHJvb3RbJ2NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxuXG5mb3IodmFyIGkgPSAwOyAhcmFmICYmIGkgPCB2ZW5kb3JzLmxlbmd0aDsgaSsrKSB7XG4gIHJhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgY2FmID0gcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbCcgKyBzdWZmaXhdXG4gICAgICB8fCByb290W3ZlbmRvcnNbaV0gKyAnQ2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG59XG5cbi8vIFNvbWUgdmVyc2lvbnMgb2YgRkYgaGF2ZSByQUYgYnV0IG5vdCBjQUZcbmlmKCFyYWYgfHwgIWNhZikge1xuICB2YXIgbGFzdCA9IDBcbiAgICAsIGlkID0gMFxuICAgICwgcXVldWUgPSBbXVxuICAgICwgZnJhbWVEdXJhdGlvbiA9IDEwMDAgLyA2MFxuXG4gIHJhZiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgX25vdyA9IG5vdygpXG4gICAgICAgICwgbmV4dCA9IE1hdGgubWF4KDAsIGZyYW1lRHVyYXRpb24gLSAoX25vdyAtIGxhc3QpKVxuICAgICAgbGFzdCA9IG5leHQgKyBfbm93XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3AgPSBxdWV1ZS5zbGljZSgwKVxuICAgICAgICAvLyBDbGVhciBxdWV1ZSBoZXJlIHRvIHByZXZlbnRcbiAgICAgICAgLy8gY2FsbGJhY2tzIGZyb20gYXBwZW5kaW5nIGxpc3RlbmVyc1xuICAgICAgICAvLyB0byB0aGUgY3VycmVudCBmcmFtZSdzIHF1ZXVlXG4gICAgICAgIHF1ZXVlLmxlbmd0aCA9IDBcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoIWNwW2ldLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICBjcFtpXS5jYWxsYmFjayhsYXN0KVxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGUgfSwgMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIE1hdGgucm91bmQobmV4dCkpXG4gICAgfVxuICAgIHF1ZXVlLnB1c2goe1xuICAgICAgaGFuZGxlOiArK2lkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY2FuY2VsbGVkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIGlkXG4gIH1cblxuICBjYWYgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKHF1ZXVlW2ldLmhhbmRsZSA9PT0gaGFuZGxlKSB7XG4gICAgICAgIHF1ZXVlW2ldLmNhbmNlbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbikge1xuICAvLyBXcmFwIGluIGEgbmV3IGZ1bmN0aW9uIHRvIHByZXZlbnRcbiAgLy8gYGNhbmNlbGAgcG90ZW50aWFsbHkgYmVpbmcgYXNzaWduZWRcbiAgLy8gdG8gdGhlIG5hdGl2ZSByQUYgZnVuY3Rpb25cbiAgcmV0dXJuIHJhZi5jYWxsKHJvb3QsIGZuKVxufVxubW9kdWxlLmV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gIGNhZi5hcHBseShyb290LCBhcmd1bWVudHMpXG59XG5tb2R1bGUuZXhwb3J0cy5wb2x5ZmlsbCA9IGZ1bmN0aW9uKCkge1xuICByb290LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJhZlxuICByb290LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FmXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG52YXIgTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFRPT0Q6IHdhcm4gYWdhaW5zdCBwdXR0aW5nIGEgY29uZmlnIGluIGhlcmVcbiAgICBkZWZhdWx0U3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpLFxuICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLm51bWJlciwgX3JlYWN0LlByb3BUeXBlcy5vYmplY3RdKSkuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25SZXN0OiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgZGVmYXVsdFN0eWxlID0gX3Byb3BzLmRlZmF1bHRTdHlsZTtcbiAgICB2YXIgc3R5bGUgPSBfcHJvcHMuc3R5bGU7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlID0gZGVmYXVsdFN0eWxlIHx8IF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHN0eWxlKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXR5ID0gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGU6IGN1cnJlbnRTdHlsZSxcbiAgICAgIGN1cnJlbnRWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5LFxuICAgICAgbGFzdElkZWFsU3R5bGU6IGN1cnJlbnRTdHlsZSxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXR5OiBjdXJyZW50VmVsb2NpdHlcbiAgICB9O1xuICB9LFxuXG4gIHdhc0FuaW1hdGluZzogZmFsc2UsXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZTogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZSAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUoZGVzdFN0eWxlKSB7XG4gICAgdmFyIGRpcnR5ID0gZmFsc2U7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IF9zdGF0ZS5jdXJyZW50U3R5bGU7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9zdGF0ZS5jdXJyZW50VmVsb2NpdHk7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlID0gX3N0YXRlLmxhc3RJZGVhbFN0eWxlO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0eSA9IF9zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0eTtcblxuICAgIGZvciAodmFyIGtleSBpbiBkZXN0U3R5bGUpIHtcbiAgICAgIGlmICghZGVzdFN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdHlsZVZhbHVlID0gZGVzdFN0eWxlW2tleV07XG4gICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgY3VycmVudFN0eWxlID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZSk7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXR5ID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0eSk7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGUgPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGUpO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5ID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgY3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICBsYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgbGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpcnR5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsIGN1cnJlbnRWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5LCBsYXN0SWRlYWxTdHlsZTogbGFzdElkZWFsU3R5bGUsIGxhc3RJZGVhbFZlbG9jaXR5OiBsYXN0SWRlYWxWZWxvY2l0eSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICB2YXIgcHJvcHNTdHlsZSA9IF90aGlzLnByb3BzLnN0eWxlO1xuICAgICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSwgcHJvcHNTdHlsZSwgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXR5KSkge1xuICAgICAgICBpZiAoX3RoaXMud2FzQW5pbWF0aW5nICYmIF90aGlzLnByb3BzLm9uUmVzdCkge1xuICAgICAgICAgIF90aGlzLnByb3BzLm9uUmVzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLndhc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzLndhc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5ID0ge307XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1N0eWxlKSB7XG4gICAgICAgIGlmICghcHJvcHNTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZVtrZXldO1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdHlba2V5XTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lc1RvQ2F0Y2hVcDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgIHZhciBuZXh0SWRlYWxWID0gX3N0ZXBwZXIyWzFdO1xuXG4gICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgLy8gdGhlIGFtb3VudCB3ZSdyZSBsb29wZWQgb3ZlciBhYm92ZVxuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC09IGZyYW1lc1RvQ2F0Y2hVcCAqIG1zUGVyRnJhbWU7XG5cbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFN0eWxlOiBuZXdDdXJyZW50U3R5bGUsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eTogbmV3Q3VycmVudFZlbG9jaXR5LFxuICAgICAgICBsYXN0SWRlYWxTdHlsZTogbmV3TGFzdElkZWFsU3R5bGUsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5OiBuZXdMYXN0SWRlYWxWZWxvY2l0eVxuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZSA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCkge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnVucmVhZFByb3BTdHlsZSA9IHByb3BzLnN0eWxlO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUuY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BlcmZvcm1hbmNlTm93KTtcblxudmFyIF9yYWYgPSByZXF1aXJlKCdyYWYnKTtcblxudmFyIF9yYWYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmFmKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9zaG91bGRTdG9wQW5pbWF0aW9uJyk7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaG91bGRTdG9wQW5pbWF0aW9uKTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIG1zUGVyRnJhbWUgPSAxMDAwIC8gNjA7XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgc3R5bGVzLCBjdXJyZW50VmVsb2NpdGllcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIV9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZXNbaV0sIHN0eWxlc1tpXSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG52YXIgU3RhZ2dlcmVkTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTdGFnZ2VyZWRNb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFRPT0Q6IHdhcm4gYWdhaW5zdCBwdXR0aW5nIGEgY29uZmlnIGluIGhlcmVcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm51bWJlcikpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZXMgPSBfcHJvcHMuZGVmYXVsdFN0eWxlcztcbiAgICB2YXIgc3R5bGVzID0gX3Byb3BzLnN0eWxlcztcblxuICAgIHZhciBjdXJyZW50U3R5bGVzID0gZGVmYXVsdFN0eWxlcyB8fCBzdHlsZXMoKS5tYXAoX3N0cmlwU3R5bGUyWydkZWZhdWx0J10pO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IGN1cnJlbnRTdHlsZXMubWFwKGZ1bmN0aW9uIChjdXJyZW50U3R5bGUpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllc1xuICAgIH07XG4gIH0sXG5cbiAgYW5pbWF0aW9uSUQ6IG51bGwsXG4gIHByZXZUaW1lOiAwLFxuICBhY2N1bXVsYXRlZFRpbWU6IDAsXG4gIC8vIGl0J3MgcG9zc2libGUgdGhhdCBjdXJyZW50U3R5bGUncyB2YWx1ZSBpcyBzdGFsZTogaWYgcHJvcHMgaXMgaW1tZWRpYXRlbHlcbiAgLy8gY2hhbmdlZCBmcm9tIDAgdG8gNDAwIHRvIHNwcmluZygwKSBhZ2FpbiwgdGhlIGFzeW5jIGN1cnJlbnRTdHlsZSBpcyBzdGlsbFxuICAvLyBhdCAwIChkaWRuJ3QgaGF2ZSB0aW1lIHRvIHRpY2sgYW5kIGludGVycG9sYXRlIGV2ZW4gb25jZSkuIElmIHdlIG5haXZlbHlcbiAgLy8gY29tcGFyZSBjdXJyZW50U3R5bGUgd2l0aCBkZXN0VmFsIGl0J2xsIGJlIDAgPT09IDAgKG5vIGFuaW1hdGlvbiwgc3RvcCkuXG4gIC8vIEluIHJlYWxpdHkgY3VycmVudFN0eWxlIHNob3VsZCBiZSA0MDBcbiAgdW5yZWFkUHJvcFN0eWxlczogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKHVucmVhZFByb3BTdHlsZXMpIHtcbiAgICB2YXIgX3N0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9zdGF0ZS5jdXJyZW50U3R5bGVzO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9zdGF0ZS5jdXJyZW50VmVsb2NpdGllcztcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX3N0YXRlLmxhc3RJZGVhbFN0eWxlcztcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzO1xuXG4gICAgdmFyIHNvbWVEaXJ0eSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV07XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIXVucmVhZFByb3BTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgc29tZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsVmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc29tZURpcnR5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFN0eWxlczogY3VycmVudFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLCBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcywgbGFzdElkZWFsVmVsb2NpdGllczogbGFzdElkZWFsVmVsb2NpdGllcyB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGVzdFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcyhfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcykpIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXN0U3R5bGUgPSBkZXN0U3R5bGVzW2ldO1xuICAgICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBkZXN0U3R5bGUpIHtcbiAgICAgICAgICBpZiAoIWRlc3RTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzW2ldW2tleV07XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZnJhbWVzVG9DYXRjaFVwOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG5ld0N1cnJlbnRTdHlsZTtcbiAgICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBuZXdDdXJyZW50VmVsb2NpdHk7XG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZXM6IG5ld0N1cnJlbnRTdHlsZXMsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBuZXdDdXJyZW50VmVsb2NpdGllcyxcbiAgICAgICAgbGFzdElkZWFsU3R5bGVzOiBuZXdMYXN0SWRlYWxTdHlsZXMsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCkge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlcyk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gcHJvcHMuc3R5bGVzKHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gU3RhZ2dlcmVkTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX21lcmdlRGlmZiA9IHJlcXVpcmUoJy4vbWVyZ2VEaWZmJyk7XG5cbnZhciBfbWVyZ2VEaWZmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lcmdlRGlmZik7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG4vLyB0aGUgY2hpbGRyZW4gZnVuY3Rpb24gJiAocG90ZW50aWFsKSBzdHlsZXMgZnVuY3Rpb24gYXNrcyBhcyBwYXJhbSBhblxuLy8gQXJyYXk8VHJhbnNpdGlvblBsYWluU3R5bGU+LCB3aGVyZSBlYWNoIFRyYW5zaXRpb25QbGFpblN0eWxlIGlzIG9mIHRoZSBmb3JtYXRcbi8vIHtrZXk6IHN0cmluZywgZGF0YT86IGFueSwgc3R5bGU6IFBsYWluU3R5bGV9LiBIb3dldmVyLCB0aGUgd2F5IHdlIGtlZXBcbi8vIGludGVybmFsIHN0YXRlcyBkb2Vzbid0IGNvbnRhaW4gc3VjaCBhIGRhdGEgc3RydWN0dXJlIChjaGVjayB0aGUgc3RhdGUgYW5kXG4vLyBUcmFuc2l0aW9uTW90aW9uU3RhdGUpLiBTbyB3aGVuIGNoaWxkcmVuIGZ1bmN0aW9uIGFuZCBvdGhlcnMgYXNrIGZvciBzdWNoXG4vLyBkYXRhIHdlIG5lZWQgdG8gZ2VuZXJhdGUgdGhlbSBvbiB0aGUgZmx5IGJ5IGNvbWJpbmluZyBtZXJnZWRQcm9wc1N0eWxlcyBhbmRcbi8vIGN1cnJlbnRTdHlsZXMvbGFzdElkZWFsU3R5bGVzXG5mdW5jdGlvbiByZWh5ZHJhdGVTdHlsZXMobWVyZ2VkUHJvcHNTdHlsZXMsIHVucmVhZFByb3BTdHlsZXMsIHBsYWluU3R5bGVzKSB7XG4gIGlmICh1bnJlYWRQcm9wU3R5bGVzID09IG51bGwpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuIG1lcmdlZFByb3BzU3R5bGVzLm1hcChmdW5jdGlvbiAobWVyZ2VkUHJvcHNTdHlsZSwgaSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSxcbiAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLFxuICAgICAgICBzdHlsZTogcGxhaW5TdHlsZXNbaV1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZFByb3BzU3R5bGVzLm1hcChmdW5jdGlvbiAobWVyZ2VkUHJvcHNTdHlsZSwgaSkge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGlmICh1bnJlYWRQcm9wU3R5bGVzW2pdLmtleSA9PT0gbWVyZ2VkUHJvcHNTdHlsZS5rZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAga2V5OiB1bnJlYWRQcm9wU3R5bGVzW2pdLmtleSxcbiAgICAgICAgICBkYXRhOiB1bnJlYWRQcm9wU3R5bGVzW2pdLmRhdGEsXG4gICAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIC8vICRGbG93Rml4TWVcbiAgICByZXR1cm4geyBrZXk6IG1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBwbGFpblN0eWxlc1tpXSB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChjdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBjdXJyZW50VmVsb2NpdGllcywgbWVyZ2VkUHJvcHNTdHlsZXMpIHtcbiAgaWYgKG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aCAhPT0gZGVzdFN0eWxlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSAhPT0gZGVzdFN0eWxlc1tpXS5rZXkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyB3ZSBoYXZlIHRoZSBpbnZhcmlhbnQgdGhhdCBtZXJnZWRQcm9wc1N0eWxlcyBhbmRcbiAgLy8gY3VycmVudFN0eWxlcy9jdXJyZW50VmVsb2NpdGllcy9sYXN0KiBhcmUgc3luY2VkIGluIHRlcm1zIG9mIGNlbGxzLCBzZWVcbiAgLy8gbWVyZ2VBbmRTeW5jIGNvbW1lbnQgZm9yIG1vcmUgaW5mb1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBkZXN0U3R5bGVzW2ldLnN0eWxlLCBjdXJyZW50VmVsb2NpdGllc1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gY29yZSBrZXkgbWVyZ2luZyBsb2dpY1xuXG4vLyB0aGluZ3MgdG8gZG86IHNheSBwcmV2aW91c2x5IG1lcmdlZCBzdHlsZSBpcyB7YSwgYn0sIGRlc3Qgc3R5bGUgKHByb3ApIGlzIHtiLFxuLy8gY30sIHByZXZpb3VzIGN1cnJlbnQgKGludGVycG9sYXRpbmcpIHN0eWxlIGlzIHthLCBifVxuLy8gKippbnZhcmlhbnQqKjogY3VycmVudFtpXSBjb3JyZXNwb25kcyB0byBtZXJnZWRbaV0gaW4gdGVybXMgb2Yga2V5XG5cbi8vIHN0ZXBzOlxuLy8gdHVybiBtZXJnZWQgc3R5bGUgaW50byB7YT8sIGIsIGN9XG4vLyAgICBhZGQgYywgdmFsdWUgb2YgYyBpcyBkZXN0U3R5bGVzLmNcbi8vICAgIG1heWJlIHJlbW92ZSBhLCBha2EgY2FsbCB3aWxsTGVhdmUoYSksIHRoZW4gbWVyZ2VkIGlzIGVpdGhlciB7YiwgY30gb3Ige2EsIGIsIGN9XG4vLyB0dXJuIGN1cnJlbnQgKGludGVycG9sYXRpbmcpIHN0eWxlIGZyb20ge2EsIGJ9IGludG8ge2E/LCBiLCBjfVxuLy8gICAgbWF5YmUgcmVtb3ZlIGFcbi8vICAgIGNlcnRhaW5seSBhZGQgYywgdmFsdWUgb2YgYyBpcyB3aWxsRW50ZXIoYylcbi8vIGxvb3Agb3ZlciBtZXJnZWQgYW5kIGNvbnN0cnVjdCBuZXcgY3VycmVudFxuLy8gZGVzdCBkb2Vzbid0IGNoYW5nZSwgdGhhdCdzIG93bmVyJ3NcbmZ1bmN0aW9uIG1lcmdlQW5kU3luYyh3aWxsRW50ZXIsIHdpbGxMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRMYXN0SWRlYWxTdHlsZXMsIG9sZExhc3RJZGVhbFZlbG9jaXRpZXMpIHtcbiAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlRGlmZjJbJ2RlZmF1bHQnXShvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgZnVuY3Rpb24gKG9sZEluZGV4LCBvbGRNZXJnZWRQcm9wc1N0eWxlKSB7XG4gICAgdmFyIGxlYXZpbmdTdHlsZSA9IHdpbGxMZWF2ZShvbGRNZXJnZWRQcm9wc1N0eWxlKTtcbiAgICBpZiAobGVhdmluZ1N0eWxlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10ob2xkQ3VycmVudFN0eWxlc1tvbGRJbmRleF0sIGxlYXZpbmdTdHlsZSwgb2xkQ3VycmVudFZlbG9jaXRpZXNbb2xkSW5kZXhdKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7IGtleTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5rZXksIGRhdGE6IG9sZE1lcmdlZFByb3BzU3R5bGUuZGF0YSwgc3R5bGU6IGxlYXZpbmdTdHlsZSB9O1xuICB9KTtcblxuICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IFtdO1xuICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdGllcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld01lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVDZWxsID0gbmV3TWVyZ2VkUHJvcHNTdHlsZXNbaV07XG4gICAgdmFyIGZvdW5kT2xkSW5kZXggPSBudWxsO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChvbGRNZXJnZWRQcm9wc1N0eWxlc1tqXS5rZXkgPT09IG5ld01lcmdlZFByb3BzU3R5bGVDZWxsLmtleSkge1xuICAgICAgICBmb3VuZE9sZEluZGV4ID0gajtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE86IGtleSBzZWFyY2ggY29kZVxuICAgIGlmIChmb3VuZE9sZEluZGV4ID09IG51bGwpIHtcbiAgICAgIHZhciBwbGFpblN0eWxlID0gd2lsbEVudGVyKG5ld01lcmdlZFByb3BzU3R5bGVDZWxsKTtcbiAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBwbGFpblN0eWxlO1xuICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcblxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgdmFyIHZlbG9jaXR5ID0gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5zdHlsZSk7XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IHZlbG9jaXR5O1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IHZlbG9jaXR5O1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gb2xkQ3VycmVudFN0eWxlc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG9sZExhc3RJZGVhbFN0eWxlc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gb2xkQ3VycmVudFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gb2xkTGFzdElkZWFsVmVsb2NpdGllc1tmb3VuZE9sZEluZGV4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW25ld01lcmdlZFByb3BzU3R5bGVzLCBuZXdDdXJyZW50U3R5bGVzLCBuZXdDdXJyZW50VmVsb2NpdGllcywgbmV3TGFzdElkZWFsU3R5bGVzLCBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXTtcbn1cblxudmFyIFRyYW5zaXRpb25Nb3Rpb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RyYW5zaXRpb25Nb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIGRlZmF1bHRTdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihfcmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGtleTogX3JlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGE6IF9yZWFjdC5Qcm9wVHlwZXMuYW55LFxuICAgICAgc3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgc3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5mdW5jLCBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLm51bWJlciwgX3JlYWN0LlByb3BUeXBlcy5vYmplY3RdKSkuaXNSZXF1aXJlZFxuICAgIH0pKV0pLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHdpbGxMZWF2ZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHdpbGxFbnRlcjogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpbGxFbnRlcjogZnVuY3Rpb24gd2lsbEVudGVyKHN0eWxlVGhhdEVudGVyZWQpIHtcbiAgICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHN0eWxlVGhhdEVudGVyZWQuc3R5bGUpO1xuICAgICAgfSxcbiAgICAgIC8vIHJlY2FsbDogcmV0dXJuaW5nIG51bGwgbWFrZXMgdGhlIGN1cnJlbnQgdW5tb3VudGluZyBUcmFuc2l0aW9uU3R5bGVcbiAgICAgIC8vIGRpc2FwcGVhciBpbW1lZGlhdGVseVxuICAgICAgd2lsbExlYXZlOiBmdW5jdGlvbiB3aWxsTGVhdmUoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZXMgPSBfcHJvcHMuZGVmYXVsdFN0eWxlcztcbiAgICB2YXIgc3R5bGVzID0gX3Byb3BzLnN0eWxlcztcbiAgICB2YXIgd2lsbEVudGVyID0gX3Byb3BzLndpbGxFbnRlcjtcbiAgICB2YXIgd2lsbExlYXZlID0gX3Byb3BzLndpbGxMZWF2ZTtcblxuICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHN0eWxlcyA9PT0gJ2Z1bmN0aW9uJyA/IHN0eWxlcyhkZWZhdWx0U3R5bGVzKSA6IHN0eWxlcztcblxuICAgIC8vIHRoaXMgaXMgc3BlY2lhbC4gZm9yIHRoZSBmaXJzdCB0aW1lIGFyb3VuZCwgd2UgZG9uJ3QgaGF2ZSBhIGNvbXBhcmlzb25cbiAgICAvLyBiZXR3ZWVuIGxhc3QgKG5vIGxhc3QpIGFuZCBjdXJyZW50IG1lcmdlZCBwcm9wcy4gd2UnbGwgY29tcHV0ZSBsYXN0IHNvOlxuICAgIC8vIHNheSBkZWZhdWx0IGlzIHthLCBifSBhbmQgc3R5bGVzIChkZXN0IHN0eWxlKSBpcyB7YiwgY30sIHdlJ2xsXG4gICAgLy8gZmFicmljYXRlIGxhc3QgYXMge2EsIGJ9XG4gICAgdmFyIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gdW5kZWZpbmVkO1xuICAgIGlmIChkZWZhdWx0U3R5bGVzID09IG51bGwpIHtcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVzdFN0eWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgb2xkTWVyZ2VkUHJvcHNTdHlsZXMgPSBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAoZGVmYXVsdFN0eWxlQ2VsbCkge1xuICAgICAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRlc3RTdHlsZXNbaV0ua2V5ID09PSBkZWZhdWx0U3R5bGVDZWxsLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlc3RTdHlsZXNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0U3R5bGVDZWxsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBvbGRDdXJyZW50U3R5bGVzID0gZGVmYXVsdFN0eWxlcyA9PSBudWxsID8gZGVzdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSk7XG4gICAgdmFyIG9sZEN1cnJlbnRWZWxvY2l0aWVzID0gZGVmYXVsdFN0eWxlcyA9PSBudWxsID8gZGVzdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pIDogZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuXG4gICAgdmFyIF9tZXJnZUFuZFN5bmMgPSBtZXJnZUFuZFN5bmMoXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHdpbGxFbnRlcixcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgd2lsbExlYXZlLCBvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgb2xkQ3VycmVudFN0eWxlcywgb2xkQ3VycmVudFZlbG9jaXRpZXMsIG9sZEN1cnJlbnRTdHlsZXMsIC8vIG9sZExhc3RJZGVhbFN0eWxlcyByZWFsbHlcbiAgICBvbGRDdXJyZW50VmVsb2NpdGllcyk7XG5cbiAgICB2YXIgbWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzBdO1xuICAgIHZhciBjdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luY1sxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jWzJdO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzNdO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1s0XTtcbiAgICAvLyBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzIHJlYWxseVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMsXG4gICAgICBtZXJnZWRQcm9wc1N0eWxlczogbWVyZ2VkUHJvcHNTdHlsZXNcbiAgICB9O1xuICB9LFxuXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9tZXJnZUFuZFN5bmMyID0gbWVyZ2VBbmRTeW5jKFxuICAgIC8vICRGbG93Rml4TWVcbiAgICB0aGlzLnByb3BzLndpbGxFbnRlcixcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy5wcm9wcy53aWxsTGVhdmUsIHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHVucmVhZFByb3BTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcyk7XG5cbiAgICB2YXIgbWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlswXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMyWzFdO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMyWzJdO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlszXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMyWzRdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdW5yZWFkUHJvcFN0eWxlID0gdW5yZWFkUHJvcFN0eWxlc1tpXS5zdHlsZTtcbiAgICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gdW5yZWFkUHJvcFN0eWxlKSB7XG4gICAgICAgIGlmICghdW5yZWFkUHJvcFN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHlsZVZhbHVlID0gdW5yZWFkUHJvcFN0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0gPSB7XG4gICAgICAgICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0ua2V5LFxuICAgICAgICAgICAgICBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlc1tpXS5kYXRhLFxuICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoe30sIG1lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVubGlrZSB0aGUgb3RoZXIgMiBjb21wb25lbnRzLCB3ZSBjYW4ndCBkZXRlY3Qgc3RhbGVuZXNzIGFuZCBvcHRpb25hbGx5XG4gICAgLy8gb3B0IG91dCBvZiBzZXRTdGF0ZSBoZXJlLiBlYWNoIHN0eWxlIG9iamVjdCdzIGRhdGEgbWlnaHQgY29udGFpbiBuZXdcbiAgICAvLyBzdHVmZiB3ZSdyZSBub3QvY2Fubm90IGNvbXBhcmVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBtZXJnZWRQcm9wc1N0eWxlczogbWVyZ2VkUHJvcHNTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXNcbiAgICB9KTtcbiAgfSxcblxuICBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5OiBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBUT0RPOiB3aGVuIGNvbmZpZyBpcyB7YTogMTB9IGFuZCBkZXN0IGlzIHthOiAxMH0gZG8gd2UgcmFmIG9uY2UgYW5kXG4gICAgLy8gY2FsbCBjYj8gTm8sIG90aGVyd2lzZSBhY2NpZGVudGFsIHBhcmVudCByZXJlbmRlciBjYXVzZXMgY2IgdHJpZ2dlclxuICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBfcmFmMlsnZGVmYXVsdCddKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwcm9wU3R5bGVzID0gX3RoaXMucHJvcHMuc3R5bGVzO1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSB0eXBlb2YgcHJvcFN0eWxlcyA9PT0gJ2Z1bmN0aW9uJyA/IHByb3BTdHlsZXMocmVoeWRyYXRlU3R5bGVzKF90aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCBfdGhpcy51bnJlYWRQcm9wU3R5bGVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKSA6IHByb3BTdHlsZXM7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYW5pbWF0ZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgIGlmIChzaG91bGRTdG9wQW5pbWF0aW9uQWxsKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcykpIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIF9tZXJnZUFuZFN5bmMzID0gbWVyZ2VBbmRTeW5jKFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgX3RoaXMucHJvcHMud2lsbEVudGVyLFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgX3RoaXMucHJvcHMud2lsbExlYXZlLCBfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcyk7XG5cbiAgICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzBdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1sxXTtcbiAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMzWzJdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzNdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1s0XTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZSA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlO1xuICAgICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBuZXdNZXJnZWRQcm9wc1N0eWxlKSB7XG4gICAgICAgICAgaWYgKCFuZXdNZXJnZWRQcm9wc1N0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdHlsZVZhbHVlID0gbmV3TWVyZ2VkUHJvcHNTdHlsZVtrZXldO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gbmV3TGFzdElkZWFsU3R5bGVzW2ldW2tleV07XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZnJhbWVzVG9DYXRjaFVwOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gbmV3TGFzdElkZWFsU3R5bGU7XG4gICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eTtcbiAgICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG5ld0N1cnJlbnRTdHlsZTtcbiAgICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBuZXdDdXJyZW50VmVsb2NpdHk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZXM6IG5ld0N1cnJlbnRTdHlsZXMsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBuZXdDdXJyZW50VmVsb2NpdGllcyxcbiAgICAgICAgbGFzdElkZWFsU3R5bGVzOiBuZXdMYXN0SWRlYWxTdHlsZXMsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMsXG4gICAgICAgIG1lcmdlZFByb3BzU3R5bGVzOiBuZXdNZXJnZWRQcm9wc1N0eWxlc1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZXMgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlcykge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlcyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9wcy5zdHlsZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHByb3BzLnN0eWxlcyhyZWh5ZHJhdGVTdHlsZXModGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdGhpcy51bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBwcm9wcy5zdHlsZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaHlkcmF0ZWRTdHlsZXMgPSByZWh5ZHJhdGVTdHlsZXModGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdGhpcy51bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMpO1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbihoeWRyYXRlZFN0eWxlcyk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBUcmFuc2l0aW9uTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8vIGxpc3Qgb2Ygc3R5bGVzLCBlYWNoIGNvbnRhaW5pbmcgaW50ZXJwb2xhdGluZyB2YWx1ZXMuIFBhcnQgb2Ygd2hhdCdzIHBhc3NlZFxuLy8gdG8gY2hpbGRyZW4gZnVuY3Rpb24uIE5vdGljZSB0aGF0IHRoaXMgaXNcbi8vIEFycmF5PEFjdHVhbEludGVycG9sYXRpbmdTdHlsZU9iamVjdD4sIHdpdGhvdXQgdGhlIHdyYXBwZXIgdGhhdCBpcyB7a2V5OiAuLi4sXG4vLyBkYXRhOiAuLi4gc3R5bGU6IEFjdHVhbEludGVycG9sYXRpbmdTdHlsZU9iamVjdH0uIE9ubHkgbWVyZ2VkUHJvcHNTdHlsZXNcbi8vIGNvbnRhaW5zIHRoZSBrZXkgJiBkYXRhIGluZm8gKHNvIHRoYXQgd2Ugb25seSBoYXZlIGEgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxuLy8gZm9yIHRoZXNlLCBhbmQgdG8gc2F2ZSBzcGFjZSkuIENoZWNrIHRoZSBjb21tZW50IGZvciBgcmVoeWRyYXRlU3R5bGVzYCB0b1xuLy8gc2VlIGhvdyB3ZSByZWdlbmVyYXRlIHRoZSBlbnRpcmV0eSBvZiB3aGF0J3MgcGFzc2VkIHRvIGNoaWxkcmVuIGZ1bmN0aW9uXG5cbi8vIHRoZSBhcnJheSB0aGF0IGtlZXBzIHRyYWNrIG9mIGN1cnJlbnRseSByZW5kZXJlZCBzdHVmZiEgSW5jbHVkaW5nIHN0dWZmXG4vLyB0aGF0IHlvdSd2ZSB1bm1vdW50ZWQgYnV0IHRoYXQncyBzdGlsbCBhbmltYXRpbmcuIFRoaXMgaXMgd2hlcmUgaXQgbGl2ZXMiLCJcblxuLy8gY3VycmVudGx5IHVzZWQgdG8gaW5pdGlhdGUgdGhlIHZlbG9jaXR5IHN0eWxlIG9iamVjdCB0byAwXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYXBUb1plcm87XG5cbmZ1bmN0aW9uIG1hcFRvWmVybyhvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyBjb3JlIGtleXMgbWVyZ2luZyBhbGdvcml0aG0uIElmIHByZXZpb3VzIHJlbmRlcidzIGtleXMgYXJlIFthLCBiXSwgYW5kIHRoZVxuLy8gbmV4dCByZW5kZXIncyBbYywgYiwgZF0sIHdoYXQncyB0aGUgZmluYWwgbWVyZ2VkIGtleXMgYW5kIG9yZGVyaW5nP1xuXG4vLyAtIGMgYW5kIGEgbXVzdCBib3RoIGJlIGJlZm9yZSBiXG4vLyAtIGIgYmVmb3JlIGRcbi8vIC0gb3JkZXJpbmcgYmV0d2VlbiBhIGFuZCBjIGFtYmlndW91c1xuXG4vLyB0aGlzIHJlZHVjZXMgdG8gbWVyZ2luZyB0d28gcGFydGlhbGx5IG9yZGVyZWQgbGlzdHMgKGUuZy4gbGlzdHMgd2hlcmUgbm90XG4vLyBldmVyeSBpdGVtIGhhcyBhIGRlZmluaXRlIG9yZGVyaW5nLCBsaWtlIGNvbXBhcmluZyBhIGFuZCBjIGFib3ZlKS4gRm9yIHRoZVxuLy8gYW1iaWd1b3VzIG9yZGVyaW5nIHdlIGRldGVybWluaXN0aWNhbGx5IGNob29zZSB0byBwbGFjZSB0aGUgbmV4dCByZW5kZXInc1xuLy8gaXRlbSBhZnRlciB0aGUgcHJldmlvdXMnOyBzbyBjIGFmdGVyIGFcblxuLy8gdGhpcyBpcyBjYWxsZWQgYSB0b3BvbG9naWNhbCBzb3J0aW5nLiBFeGNlcHQgdGhlIGV4aXN0aW5nIGFsZ29yaXRobXMgZG9uJ3Rcbi8vIHdvcmsgd2VsbCB3aXRoIGpzIGJjIG9mIHRoZSBhbW91bnQgb2YgYWxsb2NhdGlvbiwgYW5kIGlzbid0IG9wdGltaXplZCBmb3Igb3VyXG4vLyBjdXJyZW50IHVzZS1jYXNlIGJjIHRoZSBydW50aW1lIGlzIGxpbmVhciBpbiB0ZXJtcyBvZiBlZGdlcyAoc2VlIHdpa2kgZm9yXG4vLyBtZWFuaW5nKSwgd2hpY2ggaXMgaHVnZSB3aGVuIHR3byBsaXN0cyBoYXZlIG1hbnkgY29tbW9uIGVsZW1lbnRzXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtZXJnZURpZmY7XG5cbmZ1bmN0aW9uIG1lcmdlRGlmZihwcmV2LCBuZXh0LCBvblJlbW92ZSkge1xuICAvLyBib29ra2VlcGluZyBmb3IgZWFzaWVyIGFjY2VzcyBvZiBhIGtleSdzIGluZGV4IGJlbG93LiBUaGlzIGlzIDIgYWxsb2NhdGlvbnMgK1xuICAvLyBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIGNocm9tZSBoYXNoIG1hcCBtb2RlIGZvciBvYmpzIChzbyBpdCBtaWdodCBiZSBmYXN0ZXJcblxuICB2YXIgcHJldktleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldi5sZW5ndGg7IGkrKykge1xuICAgIHByZXZLZXlJbmRleFtwcmV2W2ldLmtleV0gPSBpO1xuICB9XG4gIHZhciBuZXh0S2V5SW5kZXggPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbmV4dEtleUluZGV4W25leHRbaV0ua2V5XSA9IGk7XG4gIH1cblxuICAvLyBmaXJzdCwgYW4gb3Zlcmx5IGVsYWJvcmF0ZSB3YXkgb2YgbWVyZ2luZyBwcmV2IGFuZCBuZXh0LCBlbGltaW5hdGluZ1xuICAvLyBkdXBsaWNhdGVzIChpbiB0ZXJtcyBvZiBrZXlzKS4gSWYgdGhlcmUncyBkdXBlLCBrZWVwIHRoZSBpdGVtIGluIG5leHQpLlxuICAvLyBUaGlzIHdheSBvZiB3cml0aW5nIGl0IHNhdmVzIGFsbG9jYXRpb25zXG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgcmV0W2ldID0gbmV4dFtpXTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIW5leHRLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwcmV2W2ldLmtleSkpIHtcbiAgICAgIC8vIHRoaXMgaXMgY2FsbGVkIG15IFRNJ3MgYG1lcmdlQW5kU3luY2AsIHdoaWNoIGNhbGxzIHdpbGxMZWF2ZS4gV2UgZG9uJ3RcbiAgICAgIC8vIG1lcmdlIGluIGtleXMgdGhhdCB0aGUgdXNlciBkZXNpcmVzIHRvIGtpbGxcbiAgICAgIHZhciBmaWxsID0gb25SZW1vdmUoaSwgcHJldltpXSk7XG4gICAgICBpZiAoZmlsbCAhPSBudWxsKSB7XG4gICAgICAgIHJldC5wdXNoKGZpbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyBhbGwgdGhlIGl0ZW1zIGFsbCBwcmVzZW50LiBDb3JlIHNvcnRpbmcgbG9naWMgdG8gaGF2ZSB0aGUgcmlnaHQgb3JkZXJcbiAgcmV0dXJuIHJldC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgdmFyIG5leHRPcmRlckEgPSBuZXh0S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBuZXh0T3JkZXJCID0gbmV4dEtleUluZGV4W2Iua2V5XTtcbiAgICB2YXIgcHJldk9yZGVyQSA9IHByZXZLZXlJbmRleFthLmtleV07XG4gICAgdmFyIHByZXZPcmRlckIgPSBwcmV2S2V5SW5kZXhbYi5rZXldO1xuXG4gICAgaWYgKG5leHRPcmRlckEgIT0gbnVsbCAmJiBuZXh0T3JkZXJCICE9IG51bGwpIHtcbiAgICAgIC8vIGJvdGgga2V5cyBpbiBuZXh0XG4gICAgICByZXR1cm4gbmV4dEtleUluZGV4W2Eua2V5XSAtIG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgfSBlbHNlIGlmIChwcmV2T3JkZXJBICE9IG51bGwgJiYgcHJldk9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gcHJldlxuICAgICAgcmV0dXJuIHByZXZLZXlJbmRleFthLmtleV0gLSBwcmV2S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAobmV4dE9yZGVyQSAhPSBudWxsKSB7XG4gICAgICAvLyBrZXkgYSBpbiBuZXh0LCBrZXkgYiBpbiBwcmV2XG5cbiAgICAgIC8vIGhvdyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIGJldHdlZW4gYSBhbmQgYj8gV2UgZmluZCBhIFwicGl2b3RcIiAodGVybVxuICAgICAgLy8gYWJ1c2UpLCBhIGtleSBwcmVzZW50IGluIGJvdGggcHJldiBhbmQgbmV4dCwgdGhhdCBpcyBzYW5kd2ljaGVkIGJldHdlZW5cbiAgICAgIC8vIGEgYW5kIGIuIEluIHRoZSBjb250ZXh0IG9mIG91ciBhYm92ZSBleGFtcGxlLCBpZiB3ZSdyZSBjb21wYXJpbmcgYSBhbmRcbiAgICAgIC8vIGQsIGIncyAodGhlIG9ubHkpIHBpdm90XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpdm90ID0gbmV4dFtpXS5rZXk7XG4gICAgICAgIGlmICghcHJldktleUluZGV4Lmhhc093blByb3BlcnR5KHBpdm90KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRPcmRlckEgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckIgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgPiBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckIgPCBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgLy8gcHJldk9yZGVyQSwgbmV4dE9yZGVyQlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBpdm90ID0gbmV4dFtpXS5rZXk7XG4gICAgICBpZiAoIXByZXZLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwaXZvdCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAobmV4dE9yZGVyQiA8IG5leHRLZXlJbmRleFtwaXZvdF0gJiYgcHJldk9yZGVyQSA+IHByZXZLZXlJbmRleFtwaXZvdF0pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2UgaWYgKG5leHRPcmRlckIgPiBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPCBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcGx1Z2dhYmxlLiBkZWZhdWx0IHRvOiBuZXh0IGJpZ2dlciB0aGFuIHByZXZcbiAgICByZXR1cm4gLTE7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIHRvIGxvb3AgdGhyb3VnaCBhbmQgZmluZCBhIGtleSdzIGluZGV4IGVhY2ggdGltZSksIGJ1dCBJIG5vIGxvbmdlciBjYXJlIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcbiAgbm9Xb2JibGU6IHsgc3RpZmZuZXNzOiAxNzAsIGRhbXBpbmc6IDI2IH0sIC8vIHRoZSBkZWZhdWx0LCBpZiBub3RoaW5nIHByb3ZpZGVkXG4gIGdlbnRsZTogeyBzdGlmZm5lc3M6IDEyMCwgZGFtcGluZzogMTQgfSxcbiAgd29iYmx5OiB7IHN0aWZmbmVzczogMTgwLCBkYW1waW5nOiAxMiB9LFxuICBzdGlmZjogeyBzdGlmZm5lc3M6IDIxMCwgZGFtcGluZzogMjAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmUob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbJ2RlZmF1bHQnXSA6IG9iajsgfVxuXG52YXIgX01vdGlvbiA9IHJlcXVpcmUoJy4vTW90aW9uJyk7XG5cbmV4cG9ydHMuTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9Nb3Rpb24pO1xuXG52YXIgX1N0YWdnZXJlZE1vdGlvbiA9IHJlcXVpcmUoJy4vU3RhZ2dlcmVkTW90aW9uJyk7XG5cbmV4cG9ydHMuU3RhZ2dlcmVkTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9TdGFnZ2VyZWRNb3Rpb24pO1xuXG52YXIgX1RyYW5zaXRpb25Nb3Rpb24gPSByZXF1aXJlKCcuL1RyYW5zaXRpb25Nb3Rpb24nKTtcblxuZXhwb3J0cy5UcmFuc2l0aW9uTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9UcmFuc2l0aW9uTW90aW9uKTtcblxudmFyIF9zcHJpbmcgPSByZXF1aXJlKCcuL3NwcmluZycpO1xuXG5leHBvcnRzLnNwcmluZyA9IF9pbnRlcm9wUmVxdWlyZShfc3ByaW5nKTtcblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbmV4cG9ydHMucHJlc2V0cyA9IF9pbnRlcm9wUmVxdWlyZShfcHJlc2V0cyk7XG5cbi8vIGRlcHJlY2F0ZWQsIGR1bW15IHdhcm5pbmcgZnVuY3Rpb25cblxudmFyIF9yZW9yZGVyS2V5cyA9IHJlcXVpcmUoJy4vcmVvcmRlcktleXMnKTtcblxuZXhwb3J0cy5yZW9yZGVyS2V5cyA9IF9pbnRlcm9wUmVxdWlyZShfcmVvcmRlcktleXMpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJlb3JkZXJLZXlzO1xuXG52YXIgaGFzV2FybmVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHJlb3JkZXJLZXlzKCkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBpZiAoIWhhc1dhcm5lZCkge1xuICAgICAgaGFzV2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ByZW9yZGVyS2V5c2AgaGFzIGJlZW4gcmVtb3ZlZCwgc2luY2UgaXQgaXMgbm8gbG9uZ2VyIG5lZWRlZCBmb3IgVHJhbnNpdGlvbk1vdGlvblxcJ3MgbmV3IHN0eWxlcyBhcnJheSBBUEkuJyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyB1c2FnZSBhc3N1bXB0aW9uOiBjdXJyZW50U3R5bGUgdmFsdWVzIGhhdmUgYWxyZWFkeSBiZWVuIHJlbmRlcmVkIGJ1dCBpdCBzYXlzXG4vLyBub3RoaW5nIG9mIHdoZXRoZXIgY3VycmVudFN0eWxlIGlzIHN0YWxlIChzZWUgdW5yZWFkUHJvcFN0eWxlKVxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc2hvdWxkU3RvcEFuaW1hdGlvbjtcblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbihjdXJyZW50U3R5bGUsIHN0eWxlLCBjdXJyZW50VmVsb2NpdHkpIHtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFZlbG9jaXR5W2tleV0gIT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc3R5bGVWYWx1ZSA9IHR5cGVvZiBzdHlsZVtrZXldID09PSAnbnVtYmVyJyA/IHN0eWxlW2tleV0gOiBzdHlsZVtrZXldLnZhbDtcbiAgICAvLyBzdGVwcGVyIHdpbGwgaGF2ZSBhbHJlYWR5IHRha2VuIGNhcmUgb2Ygcm91bmRpbmcgcHJlY2lzaW9uIGVycm9ycywgc29cbiAgICAvLyB3b24ndCBoYXZlIHN1Y2ggdGhpbmcgYXMgMC45OTk5ICE9PT0gMVxuICAgIGlmIChjdXJyZW50U3R5bGVba2V5XSAhPT0gc3R5bGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNwcmluZztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3ByZXNldHMgPSByZXF1aXJlKCcuL3ByZXNldHMnKTtcblxudmFyIF9wcmVzZXRzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZXNldHMpO1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IF9leHRlbmRzKHt9LCBfcHJlc2V0czJbJ2RlZmF1bHQnXS5ub1dvYmJsZSwge1xuICBwcmVjaXNpb246IDAuMDFcbn0pO1xuXG5mdW5jdGlvbiBzcHJpbmcodmFsLCBjb25maWcpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcsIHsgdmFsOiB2YWwgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyBzdGVwcGVyIGlzIHVzZWQgYSBsb3QuIFNhdmVzIGFsbG9jYXRpb24gdG8gcmV0dXJuIHRoZSBzYW1lIGFycmF5IHdyYXBwZXIuXG4vLyBUaGlzIGlzIGZpbmUgYW5kIGRhbmdlci1mcmVlIGFnYWluc3QgbXV0YXRpb25zIGJlY2F1c2UgdGhlIGNhbGxzaXRlXG4vLyBpbW1lZGlhdGVseSBkZXN0cnVjdHVyZXMgaXQgYW5kIGdldHMgdGhlIG51bWJlcnMgaW5zaWRlIHdpdGhvdXQgcGFzc2luZyB0aGVcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBzdGVwcGVyO1xuXG52YXIgcmV1c2VkVHVwbGUgPSBbXTtcblxuZnVuY3Rpb24gc3RlcHBlcihzZWNvbmRQZXJGcmFtZSwgeCwgdiwgZGVzdFgsIGssIGIsIHByZWNpc2lvbikge1xuICAvLyBTcHJpbmcgc3RpZmZuZXNzLCBpbiBrZyAvIHNeMlxuXG4gIC8vIGZvciBhbmltYXRpb25zLCBkZXN0WCBpcyByZWFsbHkgc3ByaW5nIGxlbmd0aCAoc3ByaW5nIGF0IHJlc3QpLiBpbml0aWFsXG4gIC8vIHBvc2l0aW9uIGlzIGNvbnNpZGVyZWQgYXMgdGhlIHN0cmV0Y2hlZC9jb21wcmVzc2VkIHBvc2l0aW9uIG9mIGEgc3ByaW5nXG4gIHZhciBGc3ByaW5nID0gLWsgKiAoeCAtIGRlc3RYKTtcblxuICAvLyBEYW1waW5nLCBpbiBrZyAvIHNcbiAgdmFyIEZkYW1wZXIgPSAtYiAqIHY7XG5cbiAgLy8gdXN1YWxseSB3ZSBwdXQgbWFzcyBoZXJlLCBidXQgZm9yIGFuaW1hdGlvbiBwdXJwb3Nlcywgc3BlY2lmeWluZyBtYXNzIGlzIGFcbiAgLy8gYml0IHJlZHVuZGFudC4geW91IGNvdWxkIHNpbXBseSBhZGp1c3QgayBhbmQgYiBhY2NvcmRpbmdseVxuICAvLyBsZXQgYSA9IChGc3ByaW5nICsgRmRhbXBlcikgLyBtYXNzO1xuICB2YXIgYSA9IEZzcHJpbmcgKyBGZGFtcGVyO1xuXG4gIHZhciBuZXdWID0gdiArIGEgKiBzZWNvbmRQZXJGcmFtZTtcbiAgdmFyIG5ld1ggPSB4ICsgbmV3ViAqIHNlY29uZFBlckZyYW1lO1xuXG4gIGlmIChNYXRoLmFicyhuZXdWKSA8IHByZWNpc2lvbiAmJiBNYXRoLmFicyhuZXdYIC0gZGVzdFgpIDwgcHJlY2lzaW9uKSB7XG4gICAgcmV1c2VkVHVwbGVbMF0gPSBkZXN0WDtcbiAgICByZXVzZWRUdXBsZVsxXSA9IDA7XG4gICAgcmV0dXJuIHJldXNlZFR1cGxlO1xuICB9XG5cbiAgcmV1c2VkVHVwbGVbMF0gPSBuZXdYO1xuICByZXVzZWRUdXBsZVsxXSA9IG5ld1Y7XG4gIHJldHVybiByZXVzZWRUdXBsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbi8vIGFycmF5IHJlZmVyZW5jZSBhcm91bmQuIiwiXG4vLyB0dXJuIHt4OiB7dmFsOiAxLCBzdGlmZm5lc3M6IDEsIGRhbXBpbmc6IDJ9LCB5OiAyfSBnZW5lcmF0ZWQgYnlcbi8vIGB7eDogc3ByaW5nKDEsIHtzdGlmZm5lc3M6IDEsIGRhbXBpbmc6IDJ9KSwgeTogMn1gIGludG8ge3g6IDEsIHk6IDJ9XG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN0cmlwU3R5bGU7XG5cbmZ1bmN0aW9uIHN0cmlwU3R5bGUoc3R5bGUpIHtcbiAgdmFyIHJldCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICBpZiAoIXN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IHR5cGVvZiBzdHlsZVtrZXldID09PSAnbnVtYmVyJyA/IHN0eWxlW2tleV0gOiBzdHlsZVtrZXldLnZhbDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qZXNsaW50LWRpc2FibGUgcmVhY3QvcHJvcC10eXBlcyAqL1xuXG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudCA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL2NvbXBvbmVudE9yRWxlbWVudCcpO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb25lbnRPckVsZW1lbnQpO1xuXG52YXIgX2VsZW1lbnRUeXBlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvZWxlbWVudFR5cGUnKTtcblxudmFyIF9lbGVtZW50VHlwZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lbGVtZW50VHlwZSk7XG5cbnZhciBfUG9ydGFsID0gcmVxdWlyZSgnLi9Qb3J0YWwnKTtcblxudmFyIF9Qb3J0YWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUG9ydGFsKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIgPSByZXF1aXJlKCcuL01vZGFsTWFuYWdlcicpO1xuXG52YXIgX01vZGFsTWFuYWdlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Nb2RhbE1hbmFnZXIpO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG52YXIgX2FkZEV2ZW50TGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEV2ZW50TGlzdGVuZXInKTtcblxudmFyIF9hZGRFdmVudExpc3RlbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FkZEV2ZW50TGlzdGVuZXIpO1xuXG52YXIgX2FkZEZvY3VzTGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEZvY3VzTGlzdGVuZXInKTtcblxudmFyIF9hZGRGb2N1c0xpc3RlbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FkZEZvY3VzTGlzdGVuZXIpO1xuXG52YXIgX2luRE9NID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9pbkRPTScpO1xuXG52YXIgX2luRE9NMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luRE9NKTtcblxudmFyIF9hY3RpdmVFbGVtZW50ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudCcpO1xuXG52YXIgX2FjdGl2ZUVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWN0aXZlRWxlbWVudCk7XG5cbnZhciBfY29udGFpbnMgPSByZXF1aXJlKCdkb20taGVscGVycy9xdWVyeS9jb250YWlucycpO1xuXG52YXIgX2NvbnRhaW5zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbnRhaW5zKTtcblxudmFyIF9nZXRDb250YWluZXIgPSByZXF1aXJlKCcuL3V0aWxzL2dldENvbnRhaW5lcicpO1xuXG52YXIgX2dldENvbnRhaW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRDb250YWluZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgbW9kYWxNYW5hZ2VyID0gbmV3IF9Nb2RhbE1hbmFnZXIyLmRlZmF1bHQoKTtcblxuLyoqXG4gKiBMb3ZlIHRoZW0gb3IgaGF0ZSB0aGVtLCBgPE1vZGFsLz5gIHByb3ZpZGVzIGEgc29saWQgZm91bmRhdGlvbiBmb3IgY3JlYXRpbmcgZGlhbG9ncywgbGlnaHRib3hlcywgb3Igd2hhdGV2ZXIgZWxzZS5cbiAqIFRoZSBNb2RhbCBjb21wb25lbnQgcmVuZGVycyBpdHMgYGNoaWxkcmVuYCBub2RlIGluIGZyb250IG9mIGEgYmFja2Ryb3AgY29tcG9uZW50LlxuICpcbiAqIFRoZSBNb2RhbCBvZmZlcnMgYSBmZXcgaGVscGZ1bCBmZWF0dXJlcyBvdmVyIHVzaW5nIGp1c3QgYSBgPFBvcnRhbC8+YCBjb21wb25lbnQgYW5kIHNvbWUgc3R5bGVzOlxuICpcbiAqIC0gTWFuYWdlcyBkaWFsb2cgc3RhY2tpbmcgd2hlbiBvbmUtYXQtYS10aW1lIGp1c3QgaXNuJ3QgZW5vdWdoLlxuICogLSBDcmVhdGVzIGEgYmFja2Ryb3AsIGZvciBkaXNhYmxpbmcgaW50ZXJhY3Rpb24gYmVsb3cgdGhlIG1vZGFsLlxuICogLSBJdCBwcm9wZXJseSBtYW5hZ2VzIGZvY3VzOyBtb3ZpbmcgdG8gdGhlIG1vZGFsIGNvbnRlbnQsIGFuZCBrZWVwaW5nIGl0IHRoZXJlIHVudGlsIHRoZSBtb2RhbCBpcyBjbG9zZWQuXG4gKiAtIEl0IGRpc2FibGVzIHNjcm9sbGluZyBvZiB0aGUgcGFnZSBjb250ZW50IHdoaWxlIG9wZW4uXG4gKiAtIEFkZHMgdGhlIGFwcHJvcHJpYXRlIEFSSUEgcm9sZXMgYXJlIGF1dG9tYXRpY2FsbHkuXG4gKiAtIEVhc2lseSBwbHVnZ2FibGUgYW5pbWF0aW9ucyB2aWEgYSBgPFRyYW5zaXRpb24vPmAgY29tcG9uZW50LlxuICpcbiAqIE5vdGUgdGhhdCwgaW4gdGhlIHNhbWUgd2F5IHRoZSBiYWNrZHJvcCBlbGVtZW50IHByZXZlbnRzIHVzZXJzIGZyb20gY2xpY2tpbmcgb3IgaW50ZXJhY3RpbmdcbiAqIHdpdGggdGhlIHBhZ2UgY29udGVudCB1bmRlcm5lYXRoIHRoZSBNb2RhbCwgU2NyZWVuIHJlYWRlcnMgYWxzbyBuZWVkIHRvIGJlIHNpZ25hbGVkIHRvIG5vdCB0b1xuICogaW50ZXJhY3Qgd2l0aCBwYWdlIGNvbnRlbnQgd2hpbGUgdGhlIE1vZGFsIGlzIG9wZW4uIFRvIGRvIHRoaXMsIHdlIHVzZSBhIGNvbW1vbiB0ZWNobmlxdWUgb2YgYXBwbHlpbmdcbiAqIHRoZSBgYXJpYS1oaWRkZW49J3RydWUnYCBhdHRyaWJ1dGUgdG8gdGhlIG5vbi1Nb2RhbCBlbGVtZW50cyBpbiB0aGUgTW9kYWwgYGNvbnRhaW5lcmAuIFRoaXMgbWVhbnMgdGhhdCBmb3JcbiAqIGEgTW9kYWwgdG8gYmUgdHJ1bHkgbW9kYWwsIGl0IHNob3VsZCBoYXZlIGEgYGNvbnRhaW5lcmAgdGhhdCBpcyBfb3V0c2lkZV8geW91ciBhcHAnc1xuICogUmVhY3QgaGllcmFyY2h5IChzdWNoIGFzIHRoZSBkZWZhdWx0OiBkb2N1bWVudC5ib2R5KS5cbiAqL1xudmFyIE1vZGFsID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNb2RhbCcsXG5cblxuICBwcm9wVHlwZXM6IF9leHRlbmRzKHt9LCBfUG9ydGFsMi5kZWZhdWx0LnByb3BUeXBlcywge1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBNb2RhbFxuICAgICAqL1xuICAgIHNob3c6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIEEgTm9kZSwgQ29tcG9uZW50IGluc3RhbmNlLCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWl0aGVyLiBUaGUgTW9kYWwgaXMgYXBwZW5kZWQgdG8gaXQncyBjb250YWluZXIgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEZvciB0aGUgc2FrZSBvZiBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCB0aGUgY29udGFpbmVyIHNob3VsZCB1c3VhbGx5IGJlIHRoZSBkb2N1bWVudCBib2R5LCBzbyB0aGF0IHRoZSByZXN0IG9mIHRoZVxuICAgICAqIHBhZ2UgY29udGVudCBjYW4gYmUgcGxhY2VkIGJlaGluZCBhIHZpcnR1YWwgYmFja2Ryb3AgYXMgd2VsbCBhcyBhIHZpc3VhbCBvbmUuXG4gICAgICovXG4gICAgY29udGFpbmVyOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mVHlwZShbX2NvbXBvbmVudE9yRWxlbWVudDIuZGVmYXVsdCwgX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jXSksXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIE1vZGFsIGlzIG9wZW5pbmcuXG4gICAgICovXG4gICAgb25TaG93OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gZWl0aGVyIHRoZSBiYWNrZHJvcCBpcyBjbGlja2VkLCBvciB0aGUgZXNjYXBlIGtleSBpcyBwcmVzc2VkLlxuICAgICAqXG4gICAgICogVGhlIGBvbkhpZGVgIGNhbGxiYWNrIG9ubHkgc2lnbmFscyBpbnRlbnQgZnJvbSB0aGUgTW9kYWwsXG4gICAgICogeW91IG11c3QgYWN0dWFsbHkgc2V0IHRoZSBgc2hvd2AgcHJvcCB0byBgZmFsc2VgIGZvciB0aGUgTW9kYWwgdG8gY2xvc2UuXG4gICAgICovXG4gICAgb25IaWRlOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBJbmNsdWRlIGEgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLCBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mKFsnc3RhdGljJ10pXSksXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGVzY2FwZSBrZXksIGlmIHNwZWNpZmllZCBpbiBga2V5Ym9hcmRgLCBpcyBwcmVzc2VkLlxuICAgICAqL1xuICAgIG9uRXNjYXBlS2V5VXA6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgZmlyZWQgd2hlbiB0aGUgYmFja2Ryb3AsIGlmIHNwZWNpZmllZCwgaXMgY2xpY2tlZC5cbiAgICAgKi9cbiAgICBvbkJhY2tkcm9wQ2xpY2s6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgc3R5bGUgb2JqZWN0IGZvciB0aGUgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wU3R5bGU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3IgY2xhc3NlcyBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcENsYXNzTmFtZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBBIGNzcyBjbGFzcyBvciBzZXQgb2YgY2xhc3NlcyBhcHBsaWVkIHRvIHRoZSBtb2RhbCBjb250YWluZXIgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbixcbiAgICAgKiBhbmQgcmVtb3ZlZCB3aGVuIGl0IGlzIGNsb3NlZC5cbiAgICAgKi9cbiAgICBjb250YWluZXJDbGFzc05hbWU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIG1vZGFsIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkXG4gICAgICovXG4gICAga2V5Ym9hcmQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIEEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudCB0byB1c2UgZm9yIHRoZSBkaWFsb2cgYW5kIGJhY2tkcm9wIGNvbXBvbmVudHMuXG4gICAgICovXG4gICAgdHJhbnNpdGlvbjogX2VsZW1lbnRUeXBlMi5kZWZhdWx0LFxuXG4gICAgLyoqXG4gICAgICogVGhlIGB0aW1lb3V0YCBvZiB0aGUgZGlhbG9nIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0XG4gICAgICogdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8qKlxuICAgICAqIFRoZSBgdGltZW91dGAgb2YgdGhlIGJhY2tkcm9wIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvXG4gICAgICogZW5zdXJlIHRoYXQgdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBgdHJ1ZWAgVGhlIG1vZGFsIHdpbGwgYXV0b21hdGljYWxseSBzaGlmdCBmb2N1cyB0byBpdHNlbGYgd2hlbiBpdCBvcGVucywgYW5kXG4gICAgICogcmVwbGFjZSBpdCB0byB0aGUgbGFzdCBmb2N1c2VkIGVsZW1lbnQgd2hlbiBpdCBjbG9zZXMuIFRoaXMgYWxzb1xuICAgICAqIHdvcmtzIGNvcnJlY3RseSB3aXRoIGFueSBNb2RhbCBjaGlsZHJlbiB0aGF0IGhhdmUgdGhlIGBhdXRvRm9jdXNgIHByb3AuXG4gICAgICpcbiAgICAgKiBHZW5lcmFsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgc2V0IHRvIGBmYWxzZWAgYXMgaXQgbWFrZXMgdGhlIE1vZGFsIGxlc3NcbiAgICAgKiBhY2Nlc3NpYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGxpa2Ugc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgYXV0b0ZvY3VzOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGB0cnVlYCBUaGUgbW9kYWwgd2lsbCBwcmV2ZW50IGZvY3VzIGZyb20gbGVhdmluZyB0aGUgTW9kYWwgd2hpbGUgb3Blbi5cbiAgICAgKlxuICAgICAqIEdlbmVyYWxseSB0aGlzIHNob3VsZCBuZXZlciBiZSBzZXQgdG8gYGZhbHNlYCBhcyBpdCBtYWtlcyB0aGUgTW9kYWwgbGVzc1xuICAgICAqIGFjY2Vzc2libGUgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgbGlrZSBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBlbmZvcmNlRm9jdXM6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGJlZm9yZSB0aGUgTW9kYWwgdHJhbnNpdGlvbnMgaW5cbiAgICAgKi9cbiAgICBvbkVudGVyOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhcyB0aGUgTW9kYWwgYmVnaW5zIHRvIHRyYW5zaXRpb24gaW5cbiAgICAgKi9cbiAgICBvbkVudGVyaW5nOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgTW9kYWwgZmluaXNoZXMgdHJhbnNpdGlvbmluZyBpblxuICAgICAqL1xuICAgIG9uRW50ZXJlZDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSBNb2RhbCB0cmFuc2l0aW9ucyBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFzIHRoZSBNb2RhbCBiZWdpbnMgdG8gdHJhbnNpdGlvbiBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXRpbmc6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBNb2RhbCBmaW5pc2hlcyB0cmFuc2l0aW9uaW5nIG91dFxuICAgICAqL1xuICAgIG9uRXhpdGVkOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmNcblxuICB9KSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICBhdXRvRm9jdXM6IHRydWUsXG4gICAgICBlbmZvcmNlRm9jdXM6IHRydWUsXG4gICAgICBvbkhpZGU6IG5vb3BcbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBleGl0ZWQ6ICF0aGlzLnByb3BzLnNob3cgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHNob3cgPSBfcHJvcHMuc2hvdztcbiAgICB2YXIgY29udGFpbmVyID0gX3Byb3BzLmNvbnRhaW5lcjtcbiAgICB2YXIgY2hpbGRyZW4gPSBfcHJvcHMuY2hpbGRyZW47XG4gICAgdmFyIFRyYW5zaXRpb24gPSBfcHJvcHMudHJhbnNpdGlvbjtcbiAgICB2YXIgYmFja2Ryb3AgPSBfcHJvcHMuYmFja2Ryb3A7XG4gICAgdmFyIGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0ID0gX3Byb3BzLmRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0O1xuICAgIHZhciBjbGFzc05hbWUgPSBfcHJvcHMuY2xhc3NOYW1lO1xuICAgIHZhciBzdHlsZSA9IF9wcm9wcy5zdHlsZTtcbiAgICB2YXIgb25FeGl0ID0gX3Byb3BzLm9uRXhpdDtcbiAgICB2YXIgb25FeGl0aW5nID0gX3Byb3BzLm9uRXhpdGluZztcbiAgICB2YXIgb25FbnRlciA9IF9wcm9wcy5vbkVudGVyO1xuICAgIHZhciBvbkVudGVyaW5nID0gX3Byb3BzLm9uRW50ZXJpbmc7XG4gICAgdmFyIG9uRW50ZXJlZCA9IF9wcm9wcy5vbkVudGVyZWQ7XG5cblxuICAgIHZhciBkaWFsb2cgPSBfcmVhY3QyLmRlZmF1bHQuQ2hpbGRyZW4ub25seShjaGlsZHJlbik7XG5cbiAgICB2YXIgbW91bnRNb2RhbCA9IHNob3cgfHwgVHJhbnNpdGlvbiAmJiAhdGhpcy5zdGF0ZS5leGl0ZWQ7XG4gICAgaWYgKCFtb3VudE1vZGFsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgX2RpYWxvZyRwcm9wcyA9IGRpYWxvZy5wcm9wcztcbiAgICB2YXIgcm9sZSA9IF9kaWFsb2ckcHJvcHMucm9sZTtcbiAgICB2YXIgdGFiSW5kZXggPSBfZGlhbG9nJHByb3BzLnRhYkluZGV4O1xuXG5cbiAgICBpZiAocm9sZSA9PT0gdW5kZWZpbmVkIHx8IHRhYkluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRpYWxvZyA9ICgwLCBfcmVhY3QuY2xvbmVFbGVtZW50KShkaWFsb2csIHtcbiAgICAgICAgcm9sZTogcm9sZSA9PT0gdW5kZWZpbmVkID8gJ2RvY3VtZW50JyA6IHJvbGUsXG4gICAgICAgIHRhYkluZGV4OiB0YWJJbmRleCA9PSBudWxsID8gJy0xJyA6IHRhYkluZGV4XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoVHJhbnNpdGlvbikge1xuICAgICAgZGlhbG9nID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFRyYW5zaXRpb24sXG4gICAgICAgIHtcbiAgICAgICAgICB0cmFuc2l0aW9uQXBwZWFyOiB0cnVlLFxuICAgICAgICAgIHVubW91bnRPbkV4aXQ6IHRydWUsXG4gICAgICAgICAgJ2luJzogc2hvdyxcbiAgICAgICAgICB0aW1lb3V0OiBkaWFsb2dUcmFuc2l0aW9uVGltZW91dCxcbiAgICAgICAgICBvbkV4aXQ6IG9uRXhpdCxcbiAgICAgICAgICBvbkV4aXRpbmc6IG9uRXhpdGluZyxcbiAgICAgICAgICBvbkV4aXRlZDogdGhpcy5oYW5kbGVIaWRkZW4sXG4gICAgICAgICAgb25FbnRlcjogb25FbnRlcixcbiAgICAgICAgICBvbkVudGVyaW5nOiBvbkVudGVyaW5nLFxuICAgICAgICAgIG9uRW50ZXJlZDogb25FbnRlcmVkXG4gICAgICAgIH0sXG4gICAgICAgIGRpYWxvZ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBfUG9ydGFsMi5kZWZhdWx0LFxuICAgICAge1xuICAgICAgICByZWY6IHRoaXMuc2V0TW91bnROb2RlLFxuICAgICAgICBjb250YWluZXI6IGNvbnRhaW5lclxuICAgICAgfSxcbiAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIHJlZjogJ21vZGFsJyxcbiAgICAgICAgICByb2xlOiByb2xlIHx8ICdkaWFsb2cnLFxuICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZVxuICAgICAgICB9LFxuICAgICAgICBiYWNrZHJvcCAmJiB0aGlzLnJlbmRlckJhY2tkcm9wKCksXG4gICAgICAgIGRpYWxvZ1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHJlbmRlckJhY2tkcm9wOiBmdW5jdGlvbiByZW5kZXJCYWNrZHJvcCgpIHtcbiAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgdmFyIFRyYW5zaXRpb24gPSBfcHJvcHMyLnRyYW5zaXRpb247XG4gICAgdmFyIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQgPSBfcHJvcHMyLmJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ7XG5cblxuICAgIHZhciBiYWNrZHJvcCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHJlZjogJ2JhY2tkcm9wJyxcbiAgICAgIHN0eWxlOiB0aGlzLnByb3BzLmJhY2tkcm9wU3R5bGUsXG4gICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuYmFja2Ryb3BDbGFzc05hbWUsXG4gICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZUJhY2tkcm9wQ2xpY2tcbiAgICB9KTtcblxuICAgIGlmIChUcmFuc2l0aW9uKSB7XG4gICAgICBiYWNrZHJvcCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBUcmFuc2l0aW9uLFxuICAgICAgICB7IHRyYW5zaXRpb25BcHBlYXI6IHRydWUsXG4gICAgICAgICAgJ2luJzogdGhpcy5wcm9wcy5zaG93LFxuICAgICAgICAgIHRpbWVvdXQ6IGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXRcbiAgICAgICAgfSxcbiAgICAgICAgYmFja2Ryb3BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhY2tkcm9wO1xuICB9LFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogZmFsc2UgfSk7XG4gICAgfSBlbHNlIGlmICghbmV4dFByb3BzLnRyYW5zaXRpb24pIHtcbiAgICAgIC8vIE90aGVyd2lzZSBsZXQgaGFuZGxlSGlkZGVuIHRha2UgY2FyZSBvZiBtYXJraW5nIGV4aXRlZC5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IHRydWUgfSk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgIGlmICghdGhpcy5wcm9wcy5zaG93ICYmIG5leHRQcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLmNoZWNrRm9yRm9jdXMoKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgdmFyIHRyYW5zaXRpb24gPSB0aGlzLnByb3BzLnRyYW5zaXRpb247XG5cblxuICAgIGlmIChwcmV2UHJvcHMuc2hvdyAmJiAhdGhpcy5wcm9wcy5zaG93ICYmICF0cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgaGFuZGxlSGlkZGVuIHdpbGwgY2FsbCB0aGlzLlxuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2UgaWYgKCFwcmV2UHJvcHMuc2hvdyAmJiB0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdmFyIF9wcm9wczMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBzaG93ID0gX3Byb3BzMy5zaG93O1xuICAgIHZhciB0cmFuc2l0aW9uID0gX3Byb3BzMy50cmFuc2l0aW9uO1xuXG5cbiAgICBpZiAoc2hvdyB8fCB0cmFuc2l0aW9uICYmICF0aGlzLnN0YXRlLmV4aXRlZCkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIG9uU2hvdzogZnVuY3Rpb24gb25TaG93KCkge1xuICAgIHZhciBkb2MgPSAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpO1xuICAgIHZhciBjb250YWluZXIgPSAoMCwgX2dldENvbnRhaW5lcjIuZGVmYXVsdCkodGhpcy5wcm9wcy5jb250YWluZXIsIGRvYy5ib2R5KTtcblxuICAgIG1vZGFsTWFuYWdlci5hZGQodGhpcywgY29udGFpbmVyLCB0aGlzLnByb3BzLmNvbnRhaW5lckNsYXNzTmFtZSk7XG5cbiAgICB0aGlzLl9vbkRvY3VtZW50S2V5dXBMaXN0ZW5lciA9ICgwLCBfYWRkRXZlbnRMaXN0ZW5lcjIuZGVmYXVsdCkoZG9jLCAna2V5dXAnLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5VXApO1xuXG4gICAgdGhpcy5fb25Gb2N1c2luTGlzdGVuZXIgPSAoMCwgX2FkZEZvY3VzTGlzdGVuZXIyLmRlZmF1bHQpKHRoaXMuZW5mb3JjZUZvY3VzKTtcblxuICAgIHRoaXMuZm9jdXMoKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uU2hvdykge1xuICAgICAgdGhpcy5wcm9wcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIG9uSGlkZTogZnVuY3Rpb24gb25IaWRlKCkge1xuICAgIG1vZGFsTWFuYWdlci5yZW1vdmUodGhpcyk7XG5cbiAgICB0aGlzLl9vbkRvY3VtZW50S2V5dXBMaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMuX29uRm9jdXNpbkxpc3RlbmVyLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5yZXN0b3JlTGFzdEZvY3VzKCk7XG4gIH0sXG4gIHNldE1vdW50Tm9kZTogZnVuY3Rpb24gc2V0TW91bnROb2RlKHJlZikge1xuICAgIHRoaXMubW91bnROb2RlID0gcmVmID8gcmVmLmdldE1vdW50Tm9kZSgpIDogcmVmO1xuICB9LFxuICBoYW5kbGVIaWRkZW46IGZ1bmN0aW9uIGhhbmRsZUhpZGRlbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiB0cnVlIH0pO1xuICAgIHRoaXMub25IaWRlKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkV4aXRlZCkge1xuICAgICAgdmFyIF9wcm9wczQ7XG5cbiAgICAgIChfcHJvcHM0ID0gdGhpcy5wcm9wcykub25FeGl0ZWQuYXBwbHkoX3Byb3BzNCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZUJhY2tkcm9wQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUJhY2tkcm9wQ2xpY2soZSkge1xuICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25CYWNrZHJvcENsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljayhlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5iYWNrZHJvcCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZURvY3VtZW50S2V5VXA6IGZ1bmN0aW9uIGhhbmRsZURvY3VtZW50S2V5VXAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmtleWJvYXJkICYmIGUua2V5Q29kZSA9PT0gMjcgJiYgdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm9uRXNjYXBlS2V5VXApIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkVzY2FwZUtleVVwKGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIGNoZWNrRm9yRm9jdXM6IGZ1bmN0aW9uIGNoZWNrRm9yRm9jdXMoKSB7XG4gICAgaWYgKF9pbkRPTTIuZGVmYXVsdCkge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSAoMCwgX2FjdGl2ZUVsZW1lbnQyLmRlZmF1bHQpKCk7XG4gICAgfVxuICB9LFxuICBmb2N1czogZnVuY3Rpb24gZm9jdXMoKSB7XG4gICAgdmFyIGF1dG9Gb2N1cyA9IHRoaXMucHJvcHMuYXV0b0ZvY3VzO1xuICAgIHZhciBtb2RhbENvbnRlbnQgPSB0aGlzLmdldERpYWxvZ0VsZW1lbnQoKTtcbiAgICB2YXIgY3VycmVudCA9ICgwLCBfYWN0aXZlRWxlbWVudDIuZGVmYXVsdCkoKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKSk7XG4gICAgdmFyIGZvY3VzSW5Nb2RhbCA9IGN1cnJlbnQgJiYgKDAsIF9jb250YWluczIuZGVmYXVsdCkobW9kYWxDb250ZW50LCBjdXJyZW50KTtcblxuICAgIGlmIChtb2RhbENvbnRlbnQgJiYgYXV0b0ZvY3VzICYmICFmb2N1c0luTW9kYWwpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gY3VycmVudDtcblxuICAgICAgaWYgKCFtb2RhbENvbnRlbnQuaGFzQXR0cmlidXRlKCd0YWJJbmRleCcpKSB7XG4gICAgICAgIG1vZGFsQ29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgLTEpO1xuICAgICAgICAoMCwgX3dhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCAnVGhlIG1vZGFsIGNvbnRlbnQgbm9kZSBkb2VzIG5vdCBhY2NlcHQgZm9jdXMuICcgKyAnRm9yIHRoZSBiZW5lZml0IG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSB0YWJJbmRleCBvZiB0aGUgbm9kZSBpcyBiZWluZyBzZXQgdG8gXCItMVwiLicpO1xuICAgICAgfVxuXG4gICAgICBtb2RhbENvbnRlbnQuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG4gIHJlc3RvcmVMYXN0Rm9jdXM6IGZ1bmN0aW9uIHJlc3RvcmVMYXN0Rm9jdXMoKSB7XG4gICAgLy8gU3VwcG9ydDogPD1JRTExIGRvZXNuJ3Qgc3VwcG9ydCBgZm9jdXMoKWAgb24gc3ZnIGVsZW1lbnRzIChSQjogIzkxNylcbiAgICBpZiAodGhpcy5sYXN0Rm9jdXMgJiYgdGhpcy5sYXN0Rm9jdXMuZm9jdXMpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzLmZvY3VzKCk7XG4gICAgICB0aGlzLmxhc3RGb2N1cyA9IG51bGw7XG4gICAgfVxuICB9LFxuICBlbmZvcmNlRm9jdXM6IGZ1bmN0aW9uIGVuZm9yY2VGb2N1cygpIHtcbiAgICB2YXIgZW5mb3JjZUZvY3VzID0gdGhpcy5wcm9wcy5lbmZvcmNlRm9jdXM7XG5cblxuICAgIGlmICghZW5mb3JjZUZvY3VzIHx8ICF0aGlzLmlzTW91bnRlZCgpIHx8ICF0aGlzLmlzVG9wTW9kYWwoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhY3RpdmUgPSAoMCwgX2FjdGl2ZUVsZW1lbnQyLmRlZmF1bHQpKCgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykpO1xuICAgIHZhciBtb2RhbCA9IHRoaXMuZ2V0RGlhbG9nRWxlbWVudCgpO1xuXG4gICAgaWYgKG1vZGFsICYmIG1vZGFsICE9PSBhY3RpdmUgJiYgISgwLCBfY29udGFpbnMyLmRlZmF1bHQpKG1vZGFsLCBhY3RpdmUpKSB7XG4gICAgICBtb2RhbC5mb2N1cygpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8vaW5zdGVhZCBvZiBhIHJlZiwgd2hpY2ggbWlnaHQgY29uZmxpY3Qgd2l0aCBvbmUgdGhlIHBhcmVudCBhcHBsaWVkLlxuICBnZXREaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBnZXREaWFsb2dFbGVtZW50KCkge1xuICAgIHZhciBub2RlID0gdGhpcy5yZWZzLm1vZGFsO1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubGFzdENoaWxkO1xuICB9LFxuICBpc1RvcE1vZGFsOiBmdW5jdGlvbiBpc1RvcE1vZGFsKCkge1xuICAgIHJldHVybiBtb2RhbE1hbmFnZXIuaXNUb3BNb2RhbCh0aGlzKTtcbiAgfVxufSk7XG5cbk1vZGFsLm1hbmFnZXIgPSBtb2RhbE1hbmFnZXI7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE1vZGFsO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3N0eWxlID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvc3R5bGUnKTtcblxudmFyIF9zdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHlsZSk7XG5cbnZhciBfY2xhc3MgPSByZXF1aXJlKCdkb20taGVscGVycy9jbGFzcycpO1xuXG52YXIgX2NsYXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzKTtcblxudmFyIF9zY3JvbGxiYXJTaXplID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9zY3JvbGxiYXJTaXplJyk7XG5cbnZhciBfc2Nyb2xsYmFyU2l6ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxiYXJTaXplKTtcblxudmFyIF9pc092ZXJmbG93aW5nID0gcmVxdWlyZSgnLi91dGlscy9pc092ZXJmbG93aW5nJyk7XG5cbnZhciBfaXNPdmVyZmxvd2luZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc092ZXJmbG93aW5nKTtcblxudmFyIF9tYW5hZ2VBcmlhSGlkZGVuID0gcmVxdWlyZSgnLi91dGlscy9tYW5hZ2VBcmlhSGlkZGVuJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIGZpbmRJbmRleE9mKGFyciwgY2IpIHtcbiAgdmFyIGlkeCA9IC0xO1xuICBhcnIuc29tZShmdW5jdGlvbiAoZCwgaSkge1xuICAgIGlmIChjYihkLCBpKSkge1xuICAgICAgaWR4ID0gaTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBpZHg7XG59XG5cbmZ1bmN0aW9uIGZpbmRDb250YWluZXIoZGF0YSwgbW9kYWwpIHtcbiAgcmV0dXJuIGZpbmRJbmRleE9mKGRhdGEsIGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQubW9kYWxzLmluZGV4T2YobW9kYWwpICE9PSAtMTtcbiAgfSk7XG59XG5cbi8qKlxuICogUHJvcGVyIHN0YXRlIG1hbmFnbWVudCBmb3IgY29udGFpbmVycyBhbmQgdGhlIG1vZGFscyBpbiB0aG9zZSBjb250YWluZXJzLlxuICpcbiAqIEBpbnRlcm5hbCBVc2VkIGJ5IHRoZSBNb2RhbCB0byBlbnN1cmUgcHJvcGVyIHN0eWxpbmcgb2YgY29udGFpbmVycy5cbiAqL1xuXG52YXIgTW9kYWxNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNb2RhbE1hbmFnZXIoKSB7XG4gICAgdmFyIGhpZGVTaWJsaW5nTm9kZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0cnVlIDogYXJndW1lbnRzWzBdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZGFsTWFuYWdlcik7XG5cbiAgICB0aGlzLmhpZGVTaWJsaW5nTm9kZXMgPSBoaWRlU2libGluZ05vZGVzO1xuICAgIHRoaXMubW9kYWxzID0gW107XG4gICAgdGhpcy5jb250YWluZXJzID0gW107XG4gICAgdGhpcy5kYXRhID0gW107XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTW9kYWxNYW5hZ2VyLCBbe1xuICAgIGtleTogJ2FkZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChtb2RhbCwgY29udGFpbmVyLCBjbGFzc05hbWUpIHtcbiAgICAgIHZhciBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmluZGV4T2YobW9kYWwpO1xuICAgICAgdmFyIGNvbnRhaW5lcklkeCA9IHRoaXMuY29udGFpbmVycy5pbmRleE9mKGNvbnRhaW5lcik7XG5cbiAgICAgIGlmIChtb2RhbElkeCAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIG1vZGFsSWR4O1xuICAgICAgfVxuXG4gICAgICBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmxlbmd0aDtcbiAgICAgIHRoaXMubW9kYWxzLnB1c2gobW9kYWwpO1xuXG4gICAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgICgwLCBfbWFuYWdlQXJpYUhpZGRlbi5oaWRlU2libGluZ3MpKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRhaW5lcklkeCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5kYXRhW2NvbnRhaW5lcklkeF0ubW9kYWxzLnB1c2gobW9kYWwpO1xuICAgICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBtb2RhbHM6IFttb2RhbF0sXG4gICAgICAgIC8vcmlnaHQgbm93IG9ubHkgdGhlIGZpcnN0IG1vZGFsIG9mIGEgY29udGFpbmVyIHdpbGwgaGF2ZSBpdHMgY2xhc3NlcyBhcHBsaWVkXG4gICAgICAgIGNsYXNzZXM6IGNsYXNzTmFtZSA/IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pIDogW10sXG4gICAgICAgIC8vd2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgYWN0dWFsIGBzdHlsZWAgaGVyZSBiZWNhc3VlIHdlIHdpbGwgb3ZlcnJpZGUgaXRcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBvdmVyZmxvdzogY29udGFpbmVyLnN0eWxlLm92ZXJmbG93LFxuICAgICAgICAgIHBhZGRpbmdSaWdodDogY29udGFpbmVyLnN0eWxlLnBhZGRpbmdSaWdodFxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgc3R5bGUgPSB7IG92ZXJmbG93OiAnaGlkZGVuJyB9O1xuXG4gICAgICBkYXRhLm92ZXJmbG93aW5nID0gKDAsIF9pc092ZXJmbG93aW5nMi5kZWZhdWx0KShjb250YWluZXIpO1xuXG4gICAgICBpZiAoZGF0YS5vdmVyZmxvd2luZykge1xuICAgICAgICAvLyB1c2UgY29tcHV0ZWQgc3R5bGUsIGhlcmUgdG8gZ2V0IHRoZSByZWFsIHBhZGRpbmdcbiAgICAgICAgLy8gdG8gYWRkIG91ciBzY3JvbGxiYXIgd2lkdGhcbiAgICAgICAgc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFyc2VJbnQoKDAsIF9zdHlsZTIuZGVmYXVsdCkoY29udGFpbmVyLCAncGFkZGluZ1JpZ2h0JykgfHwgMCwgMTApICsgKDAsIF9zY3JvbGxiYXJTaXplMi5kZWZhdWx0KSgpICsgJ3B4JztcbiAgICAgIH1cblxuICAgICAgKDAsIF9zdHlsZTIuZGVmYXVsdCkoY29udGFpbmVyLCBzdHlsZSk7XG5cbiAgICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKF9jbGFzczIuZGVmYXVsdC5hZGRDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgICB0aGlzLmNvbnRhaW5lcnMucHVzaChjb250YWluZXIpO1xuICAgICAgdGhpcy5kYXRhLnB1c2goZGF0YSk7XG5cbiAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZW1vdmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUobW9kYWwpIHtcbiAgICAgIHZhciBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmluZGV4T2YobW9kYWwpO1xuXG4gICAgICBpZiAobW9kYWxJZHggPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRhaW5lcklkeCA9IGZpbmRDb250YWluZXIodGhpcy5kYXRhLCBtb2RhbCk7XG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YVtjb250YWluZXJJZHhdO1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZHhdO1xuXG4gICAgICBkYXRhLm1vZGFscy5zcGxpY2UoZGF0YS5tb2RhbHMuaW5kZXhPZihtb2RhbCksIDEpO1xuXG4gICAgICB0aGlzLm1vZGFscy5zcGxpY2UobW9kYWxJZHgsIDEpO1xuXG4gICAgICAvLyBpZiB0aGF0IHdhcyB0aGUgbGFzdCBtb2RhbCBpbiBhIGNvbnRhaW5lcixcbiAgICAgIC8vIGNsZWFuIHVwIHRoZSBjb250YWluZXIgc3R5bGluaGcuXG4gICAgICBpZiAoZGF0YS5tb2RhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEuc3R5bGUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBjb250YWluZXIuc3R5bGVba2V5XSA9IGRhdGEuc3R5bGVba2V5XTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2NsYXNzMi5kZWZhdWx0LnJlbW92ZUNsYXNzLmJpbmQobnVsbCwgY29udGFpbmVyKSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgICAgICgwLCBfbWFuYWdlQXJpYUhpZGRlbi5zaG93U2libGluZ3MpKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lcnMuc3BsaWNlKGNvbnRhaW5lcklkeCwgMSk7XG4gICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgIC8vb3RoZXJ3aXNlIG1ha2Ugc3VyZSB0aGUgbmV4dCB0b3AgbW9kYWwgaXMgdmlzaWJsZSB0byBhIFNSXG4gICAgICAgICgwLCBfbWFuYWdlQXJpYUhpZGRlbi5hcmlhSGlkZGVuKShmYWxzZSwgZGF0YS5tb2RhbHNbZGF0YS5tb2RhbHMubGVuZ3RoIC0gMV0ubW91bnROb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdpc1RvcE1vZGFsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNUb3BNb2RhbChtb2RhbCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5tb2RhbHMubGVuZ3RoICYmIHRoaXMubW9kYWxzW3RoaXMubW9kYWxzLmxlbmd0aCAtIDFdID09PSBtb2RhbDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTW9kYWxNYW5hZ2VyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBNb2RhbE1hbmFnZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3RET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0RE9NJ10gOiBudWxsKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfY29tcG9uZW50T3JFbGVtZW50ID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50Jyk7XG5cbnZhciBfY29tcG9uZW50T3JFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbXBvbmVudE9yRWxlbWVudCk7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vdXRpbHMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX293bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3duZXJEb2N1bWVudCk7XG5cbnZhciBfZ2V0Q29udGFpbmVyID0gcmVxdWlyZSgnLi91dGlscy9nZXRDb250YWluZXInKTtcblxudmFyIF9nZXRDb250YWluZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0Q29udGFpbmVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBUaGUgYDxQb3J0YWwvPmAgY29tcG9uZW50IHJlbmRlcnMgaXRzIGNoaWxkcmVuIGludG8gYSBuZXcgXCJzdWJ0cmVlXCIgb3V0c2lkZSBvZiBjdXJyZW50IGNvbXBvbmVudCBoaWVyYXJjaHkuXG4gKiBZb3UgY2FuIHRoaW5rIG9mIGl0IGFzIGEgZGVjbGFyYXRpdmUgYGFwcGVuZENoaWxkKClgLCBvciBqUXVlcnkncyBgJC5mbi5hcHBlbmRUbygpYC5cbiAqIFRoZSBjaGlsZHJlbiBvZiBgPFBvcnRhbC8+YCBjb21wb25lbnQgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgYGNvbnRhaW5lcmAgc3BlY2lmaWVkLlxuICovXG52YXIgUG9ydGFsID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUNsYXNzKHtcblxuICBkaXNwbGF5TmFtZTogJ1BvcnRhbCcsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqXG4gICAgICogQSBOb2RlLCBDb21wb25lbnQgaW5zdGFuY2UsIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBlaXRoZXIuIFRoZSBgY29udGFpbmVyYCB3aWxsIGhhdmUgdGhlIFBvcnRhbCBjaGlsZHJlblxuICAgICAqIGFwcGVuZGVkIHRvIGl0LlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19jb21wb25lbnRPckVsZW1lbnQyLmRlZmF1bHQsIF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuY10pXG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fcmVuZGVyT3ZlcmxheSgpO1xuICB9LFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLl9vdmVybGF5VGFyZ2V0ICYmIG5leHRQcm9wcy5jb250YWluZXIgIT09IHRoaXMucHJvcHMuY29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLnJlbW92ZUNoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9ICgwLCBfZ2V0Q29udGFpbmVyMi5kZWZhdWx0KShuZXh0UHJvcHMuY29udGFpbmVyLCAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpLmJvZHkpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICB0aGlzLl91bm1vdW50T3ZlcmxheVRhcmdldCgpO1xuICB9LFxuICBfbW91bnRPdmVybGF5VGFyZ2V0OiBmdW5jdGlvbiBfbW91bnRPdmVybGF5VGFyZ2V0KCkge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgdGhpcy5fb3ZlcmxheVRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9ICgwLCBfZ2V0Q29udGFpbmVyMi5kZWZhdWx0KSh0aGlzLnByb3BzLmNvbnRhaW5lciwgKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKS5ib2R5KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfVxuICB9LFxuICBfdW5tb3VudE92ZXJsYXlUYXJnZXQ6IGZ1bmN0aW9uIF91bm1vdW50T3ZlcmxheVRhcmdldCgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX292ZXJsYXlUYXJnZXQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gbnVsbDtcbiAgfSxcbiAgX3JlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF9yZW5kZXJPdmVybGF5KCkge1xuXG4gICAgdmFyIG92ZXJsYXkgPSAhdGhpcy5wcm9wcy5jaGlsZHJlbiA/IG51bGwgOiBfcmVhY3QyLmRlZmF1bHQuQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblxuICAgIC8vIFNhdmUgcmVmZXJlbmNlIGZvciBmdXR1cmUgYWNjZXNzLlxuICAgIGlmIChvdmVybGF5ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlJbnN0YW5jZSA9IF9yZWFjdERvbTIuZGVmYXVsdC51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcih0aGlzLCBvdmVybGF5LCB0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVW5yZW5kZXIgaWYgdGhlIGNvbXBvbmVudCBpcyBudWxsIGZvciB0cmFuc2l0aW9ucyB0byBudWxsXG4gICAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX3VubW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gICAgfVxuICB9LFxuICBfdW5yZW5kZXJPdmVybGF5OiBmdW5jdGlvbiBfdW5yZW5kZXJPdmVybGF5KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5VGFyZ2V0KSB7XG4gICAgICBfcmVhY3REb20yLmRlZmF1bHQudW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX292ZXJsYXlJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgZ2V0TW91bnROb2RlOiBmdW5jdGlvbiBnZXRNb3VudE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlUYXJnZXQ7XG4gIH0sXG4gIGdldE92ZXJsYXlET01Ob2RlOiBmdW5jdGlvbiBnZXRPdmVybGF5RE9NTm9kZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0T3ZlcmxheURPTU5vZGUoKTogQSBjb21wb25lbnQgbXVzdCBiZSBtb3VudGVkIHRvIGhhdmUgYSBET00gbm9kZS4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheUluc3RhbmNlKSB7XG4gICAgICBpZiAodGhpcy5fb3ZlcmxheUluc3RhbmNlLmdldFdyYXBwZWRET01Ob2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5SW5zdGFuY2UuZ2V0V3JhcHBlZERPTU5vZGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUodGhpcy5fb3ZlcmxheUluc3RhbmNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFBvcnRhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50LCBoYW5kbGVyKSB7XG4gICgwLCBfb24yLmRlZmF1bHQpKG5vZGUsIGV2ZW50LCBoYW5kbGVyKTtcbiAgcmV0dXJuIHtcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICgwLCBfb2ZmMi5kZWZhdWx0KShub2RlLCBldmVudCwgaGFuZGxlcik7XG4gICAgfVxuICB9O1xufTtcblxudmFyIF9vbiA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2V2ZW50cy9vbicpO1xuXG52YXIgX29uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29uKTtcblxudmFyIF9vZmYgPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb2ZmJyk7XG5cbnZhciBfb2ZmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29mZik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGFkZEZvY3VzTGlzdGVuZXI7XG4vKipcbiAqIEZpcmVmb3ggZG9lc24ndCBoYXZlIGEgZm9jdXNpbiBldmVudCBzbyB1c2luZyBjYXB0dXJlIGlzIGVhc2llc3Qgd2F5IHRvIGdldCBidWJibGluZ1xuICogSUU4IGNhbid0IGRvIGFkZEV2ZW50TGlzdGVuZXIsIGJ1dCBkb2VzIGhhdmUgb25mb2N1c2luLCBzbyB3ZSB1c2UgdGhhdCBpbiBpZThcbiAqXG4gKiBXZSBvbmx5IGFsbG93IG9uZSBMaXN0ZW5lciBhdCBhIHRpbWUgdG8gYXZvaWQgc3RhY2sgb3ZlcmZsb3dzXG4gKi9cbmZ1bmN0aW9uIGFkZEZvY3VzTGlzdGVuZXIoaGFuZGxlcikge1xuICB2YXIgdXNlRm9jdXNpbiA9ICFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyO1xuICB2YXIgcmVtb3ZlID0gdm9pZCAwO1xuXG4gIGlmICh1c2VGb2N1c2luKSB7XG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29uZm9jdXNpbicsIGhhbmRsZXIpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kZXRhY2hFdmVudCgnb25mb2N1c2luJywgaGFuZGxlcik7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4geyByZW1vdmU6IHJlbW92ZSB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0Q29udGFpbmVyO1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIoY29udGFpbmVyLCBkZWZhdWx0Q29udGFpbmVyKSB7XG4gIGNvbnRhaW5lciA9IHR5cGVvZiBjb250YWluZXIgPT09ICdmdW5jdGlvbicgPyBjb250YWluZXIoKSA6IGNvbnRhaW5lcjtcbiAgcmV0dXJuIF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZShjb250YWluZXIpIHx8IGRlZmF1bHRDb250YWluZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBpc092ZXJmbG93aW5nO1xuXG52YXIgX2lzV2luZG93ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvcXVlcnkvaXNXaW5kb3cnKTtcblxudmFyIF9pc1dpbmRvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1dpbmRvdyk7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBpc0JvZHkobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2JvZHknO1xufVxuXG5mdW5jdGlvbiBib2R5SXNPdmVyZmxvd2luZyhub2RlKSB7XG4gIHZhciBkb2MgPSAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKG5vZGUpO1xuICB2YXIgd2luID0gKDAsIF9pc1dpbmRvdzIuZGVmYXVsdCkoZG9jKTtcbiAgdmFyIGZ1bGxXaWR0aCA9IHdpbi5pbm5lcldpZHRoO1xuXG4gIC8vIFN1cHBvcnQ6IGllOCwgbm8gaW5uZXJXaWR0aFxuICBpZiAoIWZ1bGxXaWR0aCkge1xuICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBmdWxsV2lkdGggPSBkb2N1bWVudEVsZW1lbnRSZWN0LnJpZ2h0IC0gTWF0aC5hYnMoZG9jdW1lbnRFbGVtZW50UmVjdC5sZWZ0KTtcbiAgfVxuXG4gIHJldHVybiBkb2MuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaWR0aDtcbn1cblxuZnVuY3Rpb24gaXNPdmVyZmxvd2luZyhjb250YWluZXIpIHtcbiAgdmFyIHdpbiA9ICgwLCBfaXNXaW5kb3cyLmRlZmF1bHQpKGNvbnRhaW5lcik7XG5cbiAgcmV0dXJuIHdpbiB8fCBpc0JvZHkoY29udGFpbmVyKSA/IGJvZHlJc092ZXJmbG93aW5nKGNvbnRhaW5lcikgOiBjb250YWluZXIuc2Nyb2xsSGVpZ2h0ID4gY29udGFpbmVyLmNsaWVudEhlaWdodDtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYXJpYUhpZGRlbiA9IGFyaWFIaWRkZW47XG5leHBvcnRzLmhpZGVTaWJsaW5ncyA9IGhpZGVTaWJsaW5ncztcbmV4cG9ydHMuc2hvd1NpYmxpbmdzID0gc2hvd1NpYmxpbmdzO1xuXG52YXIgQkxBQ0tMSVNUID0gWyd0ZW1wbGF0ZScsICdzY3JpcHQnLCAnc3R5bGUnXTtcblxudmFyIGlzSGlkYWJsZSA9IGZ1bmN0aW9uIGlzSGlkYWJsZShfcmVmKSB7XG4gIHZhciBub2RlVHlwZSA9IF9yZWYubm9kZVR5cGU7XG4gIHZhciB0YWdOYW1lID0gX3JlZi50YWdOYW1lO1xuICByZXR1cm4gbm9kZVR5cGUgPT09IDEgJiYgQkxBQ0tMSVNULmluZGV4T2YodGFnTmFtZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTE7XG59O1xuXG52YXIgc2libGluZ3MgPSBmdW5jdGlvbiBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50LCBjYikge1xuICBtb3VudCA9IFtdLmNvbmNhdChtb3VudCk7XG5cbiAgW10uZm9yRWFjaC5jYWxsKGNvbnRhaW5lci5jaGlsZHJlbiwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAobW91bnQuaW5kZXhPZihub2RlKSA9PT0gLTEgJiYgaXNIaWRhYmxlKG5vZGUpKSB7XG4gICAgICBjYihub2RlKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gYXJpYUhpZGRlbihzaG93LCBub2RlKSB7XG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoc2hvdykge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGlkZVNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlKSB7XG4gIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBhcmlhSGlkZGVuKHRydWUsIG5vZGUpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd1NpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlKSB7XG4gIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBhcmlhSGlkZGVuKGZhbHNlLCBub2RlKTtcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoY29tcG9uZW50T3JFbGVtZW50KSB7XG4gIHJldHVybiAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZShjb21wb25lbnRPckVsZW1lbnQpKTtcbn07XG5cbnZhciBfcmVhY3REb20gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3RET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0RE9NJ10gOiBudWxsKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyID0gcmVxdWlyZSgnLi91dGlscy9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcicpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHByb3BWYWx1ZSk7XG5cbiAgaWYgKF9yZWFjdDIuZGVmYXVsdC5pc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBSZWFjdEVsZW1lbnQgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3RDb21wb25lbnQgb3IgYSAnKSArICdET01FbGVtZW50LiBZb3UgY2FuIHVzdWFsbHkgb2J0YWluIGEgUmVhY3RDb21wb25lbnQgb3IgRE9NRWxlbWVudCAnICsgJ2Zyb20gYSBSZWFjdEVsZW1lbnQgYnkgYXR0YWNoaW5nIGEgcmVmIHRvIGl0LicpO1xuICB9XG5cbiAgaWYgKChwcm9wVHlwZSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHByb3BWYWx1ZS5yZW5kZXIgIT09ICdmdW5jdGlvbicpICYmIHByb3BWYWx1ZS5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3RDb21wb25lbnQgb3IgYSAnKSArICdET01FbGVtZW50LicpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIyLmRlZmF1bHQpKHZhbGlkYXRlKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyID0gcmVxdWlyZSgnLi91dGlscy9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcicpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZWxlbWVudFR5cGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHByb3BWYWx1ZSk7XG5cbiAgaWYgKF9yZWFjdDIuZGVmYXVsdC5pc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBSZWFjdEVsZW1lbnQgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGVsZW1lbnQgdHlwZSAoYSBzdHJpbmcgJykgKyAnb3IgYSBSZWFjdENsYXNzKS4nKTtcbiAgfVxuXG4gIGlmIChwcm9wVHlwZSAhPT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBlbGVtZW50IHR5cGUgKGEgc3RyaW5nICcpICsgJ29yIGEgUmVhY3RDbGFzcykuJyk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIuZGVmYXVsdCkoZWxlbWVudFR5cGUpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuLy8gTW9zdGx5IHRha2VuIGZyb20gUmVhY3RQcm9wVHlwZXMuXG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50TmFtZVNhZmUgPSBjb21wb25lbnROYW1lIHx8ICc8PGFub255bW91cz4+JztcbiAgICB2YXIgcHJvcEZ1bGxOYW1lU2FmZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmVxdWlyZWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZVNhZmUgKyAnYCB3YXMgbm90IHNwZWNpZmllZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWVTYWZlICsgJ2AuJykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiA2ID8gX2xlbiAtIDYgOiAwKSwgX2tleSA9IDY7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDZdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0ZS5hcHBseSh1bmRlZmluZWQsIFtwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWVTYWZlLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lU2FmZV0uY29uY2F0KGFyZ3MpKTtcbiAgfVxuXG4gIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbn0iLCIvKiFcbiAqIFxuICogIFJlYWN0IFNpbXBsZXRhYnMgLSBKdXN0IGEgc2ltcGxlIHRhYnMgY29tcG9uZW50IGJ1aWx0IHdpdGggUmVhY3RcbiAqICBAdmVyc2lvbiB2MC43LjBcbiAqICBAbGluayBodHRwczovL2dpdGh1Yi5jb20vcGVkcm9uYXVjay9yZWFjdC1zaW1wbGV0YWJzXG4gKiAgQGxpY2Vuc2UgTUlUXG4gKiAgQGF1dGhvciBQZWRybyBOYXVjayAoaHR0cHM6Ly9naXRodWIuY29tL3BlZHJvbmF1Y2spXG4gKiBcbiAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJyZWFjdFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXykge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyoqIEBqc3ggUmVhY3QuRE9NICovJ3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBjbGFzc05hbWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblxuXHRpZiAodHJ1ZSkge1xuXHQgIF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdH1cblxuXHR2YXIgVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ICBkaXNwbGF5TmFtZTogJ1RhYnMnLFxuXHQgIHByb3BUeXBlczoge1xuXHQgICAgY2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cdCAgICBdKSxcblx0ICAgIHRhYkFjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0ICAgIG9uTW91bnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25CZWZvcmVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25BZnRlckNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmVsZW1lbnRcblx0ICAgIF0pLmlzUmVxdWlyZWRcblx0ICB9LFxuXHQgIGdldERlZmF1bHRQcm9wczpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4geyB0YWJBY3RpdmU6IDEgfTtcblx0ICB9LFxuXHQgIGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB0YWJBY3RpdmU6IHRoaXMucHJvcHMudGFiQWN0aXZlXG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgY29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgaW5kZXggPSB0aGlzLnN0YXRlLnRhYkFjdGl2ZTtcblx0ICAgIHZhciAkc2VsZWN0ZWRQYW5lbCA9IHRoaXMucmVmc1sndGFiLXBhbmVsJ107XG5cdCAgICB2YXIgJHNlbGVjdGVkTWVudSA9IHRoaXMucmVmc1soXCJ0YWItbWVudS1cIiArIGluZGV4KV07XG5cblx0ICAgIGlmICh0aGlzLnByb3BzLm9uTW91bnQpIHtcblx0ICAgICAgdGhpcy5wcm9wcy5vbk1vdW50KGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkTWVudSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdCAgICBpZihuZXdQcm9wcy50YWJBY3RpdmUgJiYgbmV3UHJvcHMudGFiQWN0aXZlICE9PSB0aGlzLnByb3BzLnRhYkFjdGl2ZSl7XG5cdCAgICAgIHRoaXMuc2V0U3RhdGUoe3RhYkFjdGl2ZTogbmV3UHJvcHMudGFiQWN0aXZlfSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ3RhYnMnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIFxuXHQgICAgICAgIHRoaXMuX2dldE1lbnVJdGVtcygpLCBcblx0ICAgICAgICB0aGlzLl9nZXRTZWxlY3RlZFBhbmVsKClcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9LFxuXHQgIHNldEFjdGl2ZTpmdW5jdGlvbihpbmRleCwgZSkge1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCAgICB2YXIgb25BZnRlckNoYW5nZSA9IHRoaXMucHJvcHMub25BZnRlckNoYW5nZTtcblx0ICAgIHZhciBvbkJlZm9yZUNoYW5nZSA9IHRoaXMucHJvcHMub25CZWZvcmVDaGFuZ2U7XG5cdCAgICB2YXIgJHNlbGVjdGVkUGFuZWwgPSB0aGlzLnJlZnNbJ3RhYi1wYW5lbCddO1xuXHQgICAgdmFyICRzZWxlY3RlZFRhYk1lbnUgPSB0aGlzLnJlZnNbKFwidGFiLW1lbnUtXCIgKyBpbmRleCldO1xuXG5cdCAgICBpZiAob25CZWZvcmVDaGFuZ2UpIHtcblx0ICAgICAgdmFyIGNhbmNlbCA9IG9uQmVmb3JlQ2hhbmdlKGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkVGFiTWVudSk7XG5cdCAgICAgIGlmKGNhbmNlbCA9PT0gZmFsc2UpeyByZXR1cm4gfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNldFN0YXRlKHsgdGFiQWN0aXZlOiBpbmRleCB9LCBmdW5jdGlvbigpICB7XG5cdCAgICAgIGlmIChvbkFmdGVyQ2hhbmdlKSB7XG5cdCAgICAgICAgb25BZnRlckNoYW5nZShpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZFRhYk1lbnUpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIF9nZXRNZW51SXRlbXM6ZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVGFicyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIFRhYnMuUGFuZWwnKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuY2hpbGRyZW4pKSB7XG5cdCAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4gPSBbdGhpcy5wcm9wcy5jaGlsZHJlbl07XG5cdCAgICB9XG5cblx0ICAgIHZhciAkbWVudUl0ZW1zID0gdGhpcy5wcm9wcy5jaGlsZHJlblxuXHQgICAgICAubWFwKGZ1bmN0aW9uKCRwYW5lbCkgIHtyZXR1cm4gdHlwZW9mICRwYW5lbCA9PT0gJ2Z1bmN0aW9uJyA/ICRwYW5lbCgpIDogJHBhbmVsO30pXG5cdCAgICAgIC5maWx0ZXIoZnVuY3Rpb24oJHBhbmVsKSAge3JldHVybiAkcGFuZWw7fSlcblx0ICAgICAgLm1hcChmdW5jdGlvbigkcGFuZWwsIGluZGV4KSAge1xuXHQgICAgICAgIHZhciByZWYgPSAoXCJ0YWItbWVudS1cIiArIChpbmRleCArIDEpKTtcblx0ICAgICAgICB2YXIgdGl0bGUgPSAkcGFuZWwucHJvcHMudGl0bGU7XG5cdCAgICAgICAgdmFyIGNsYXNzZXMgPSBjbGFzc05hbWVzKFxuXHQgICAgICAgICAgJ3RhYnMtbWVudS1pdGVtJyxcblx0ICAgICAgICAgIHRoaXMuc3RhdGUudGFiQWN0aXZlID09PSAoaW5kZXggKyAxKSAmJiAnaXMtYWN0aXZlJ1xuXHQgICAgICAgICk7XG5cblx0ICAgICAgICByZXR1cm4gKFxuXHQgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtyZWY6IHJlZiwga2V5OiBpbmRleCwgY2xhc3NOYW1lOiBjbGFzc2VzfSwgXG5cdCAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNldEFjdGl2ZS5iaW5kKHRoaXMsIGluZGV4ICsgMSl9LCBcblx0ICAgICAgICAgICAgICB0aXRsZVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgICApXG5cdCAgICAgICAgKTtcblx0ICAgICAgfS5iaW5kKHRoaXMpKTtcblxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCB7Y2xhc3NOYW1lOiBcInRhYnMtbmF2aWdhdGlvblwifSwgXG5cdCAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwidGFicy1tZW51XCJ9LCAkbWVudUl0ZW1zKVxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH0sXG5cdCAgX2dldFNlbGVjdGVkUGFuZWw6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS50YWJBY3RpdmUgLSAxO1xuXHQgICAgdmFyICRwYW5lbCA9IHRoaXMucHJvcHMuY2hpbGRyZW5baW5kZXhdO1xuXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXJ0aWNsZVwiLCB7cmVmOiBcInRhYi1wYW5lbFwiLCBjbGFzc05hbWU6IFwidGFiLXBhbmVsXCJ9LCBcblx0ICAgICAgICAkcGFuZWxcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9XG5cdH0pO1xuXG5cdFRhYnMuUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdCAgZGlzcGxheU5hbWU6ICdQYW5lbCcsXG5cdCAgcHJvcFR5cGVzOiB7XG5cdCAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXHQgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5lbGVtZW50XG5cdCAgICBdKS5pc1JlcXVpcmVkXG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdCAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX187XG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiogQGpzeCBSZWFjdC5ET00gKi9mdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cdFx0dmFyIGFyZztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCdzdHJpbmcnID09PSB0eXBlb2YgYXJnIHx8ICdudW1iZXInID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmICghYXJnLmhhc093blByb3BlcnR5KGtleSkgfHwgIWFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0Ly8gc2FmZWx5IGV4cG9ydCBjbGFzc05hbWVzIGluIGNhc2UgdGhlIHNjcmlwdCBpcyBpbmNsdWRlZCBkaXJlY3RseSBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9XG5cblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEFsbGVsZUZpbHRlcnNWaWV3ID0gKHtzcGVjaWVzLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNhYmxlZEFsbGVsZXMgPSBbXSwgb25GaWx0ZXJDaGFuZ2V9KSA9PiB7XG4gIGxldCBoaWRkZW5HZW5lcyA9IG5ldyBTZXQsXG4gICAgICBnZW5lSW5wdXRzID0gW107XG5cbiAgZm9yIChjb25zdCBhbGxlbGUgb2YgaGlkZGVuQWxsZWxlcykge1xuICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSk7XG4gICAgaWYgKGdlbmUpXG4gICAgICBoaWRkZW5HZW5lcy5hZGQoZ2VuZS5uYW1lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZ2VuZSBpbiBzcGVjaWVzLmdlbmVMaXN0KSB7XG4gICAgaWYgKCFoaWRkZW5HZW5lcy5oYXMoZ2VuZSkpIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMsXG4gICAgICAgICAgICBhbGxlbGVJdGVtcyA9IGFsbGVsZXMubWFwKGFsbGVsZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV0sXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAhKGRpc2FibGVkQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPj0gMCk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpbkxlZnRcIjogXCI4cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgZ2VuZUlucHV0cy5wdXNoKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmUtYWxsZWxlLWxpc3RcIiBrZXk9e2dlbmV9PnthbGxlbGVJdGVtc308L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgYWxsZWxlID0gZWx0ICYmIGVsdC52YWx1ZSxcbiAgICAgICAgICBpc0NoZWNrZWQgPSBlbHQgJiYgZWx0LmNoZWNrZWQ7XG4gICAgaWYgKG9uRmlsdGVyQ2hhbmdlICYmIGFsbGVsZSlcbiAgICAgIG9uRmlsdGVyQ2hhbmdlKGV2dCwgYWxsZWxlLCBpc0NoZWNrZWQpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlLWZpbHRlcnNcIlxuICAgICAgICAgIHN0eWxlPXt7IFwibWFyZ2luVG9wXCI6IFwiNXB4XCIsIFwibWFyZ2luQm90dG9tXCI6IFwiNXB4XCIgfX0+XG4gICAgICB7IGdlbmVJbnB1dHMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQWxsZWxlRmlsdGVyc1ZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNhYmxlZEFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBvbkZpbHRlckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlRmlsdGVyc1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQWxsZWxlVmlldyA9ICh7YWxsZWxlLCB3aWR0aD0yMSwgdGFyZ2V0LCBjb2xvciwgc2hhcGUsIGhvdmVyaW5nfSkgPT4ge1xuICBsZXQgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgIHN0cm9rZSA9IHRhcmdldCA/IFwiIzAwMDAwMFwiIDogXCJub25lXCIsXG4gICAgICBmaWxsID0gYWxsZWxlID8gY29sb3IgOiBcIndoaXRlXCIsXG4gICAgICBzdHJva2VXaWR0aCA9IGhvdmVyaW5nID8gMyA6IDEsXG4gICAgICBzdHJva2VEYXNoYXJyYXk9IGFsbGVsZSA/IFwiMFwiIDogXCIxXCIsXG4gICAgICBzdmdTaGFwZSA9IG51bGw7XG5cbiAgaWYgKHNoYXBlID09PSBcImNpcmNsZVwiKSB7XG4gICAgc3ZnU2hhcGUgPSA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysxfSBjeD17cmFkaXVzKzF9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPXtzdHJva2V9IHN0cm9rZURhc2hhcnJheT17c3Ryb2tlRGFzaGFycmF5fSBmaWxsPXtmaWxsfS8+O1xuICB9IGVsc2Uge1xuICAgIHN2Z1NoYXBlID0gPHJlY3Qgd2lkdGg9eyhyYWRpdXMqMil9IGhlaWdodD17KHJhZGl1cyoyKX0geD1cIjFcIiB5PVwiMVwiIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPXtzdHJva2V9IHN0cm9rZURhc2hhcnJheT17c3Ryb2tlRGFzaGFycmF5fSBmaWxsPXtmaWxsfS8+O1xuICB9XG5cblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e3dpZHRoKzJ9IGhlaWdodD17d2lkdGgrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIHsgc3ZnU2hhcGUgfVxuICAgICAgICA8dGV4dCB4PXtyYWRpdXMrMX0geT17cmFkaXVzKzd9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBmaWxsPVwid2hpdGVcIj57YWxsZWxlfTwvdGV4dD5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbkFsbGVsZVZpZXcucHJvcFR5cGVzID0ge1xuICBhbGxlbGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0YXJnZXQ6IFByb3BUeXBlcy5ib29sLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2hhcGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGhvdmVyaW5nOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcbmltcG9ydCBHYW1ldGVWaWV3IGZyb20gJy4vZ2FtZXRlJztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlIHRoYXQgYW5pbWF0ZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gW2luaXRpYWxEaXNwbGF5XSAtIGluaXRpYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueF0gLSBpbml0aWFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnldIC0gaW5pdGlhbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnNpemU9MzBdIC0gaW5pdGlhbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5yb3RhdGlvbj0wXSAtIGluaXRpYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5vcGFjaXR5PTFdIC0gaW5pdGlhbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZmluYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBmaW5hbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGZpbmFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIGZpbmFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSBmaW5hbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIGZpbmFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthbmltU3RpZmZuZXNzPTEwMF0gLSBzcHJpbmcgc3RpZmZuZXNzIHVzZWQgdG8gY29udHJvbCBhbmltYXRpb24gc3BlZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uUmVjdCgpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgYXQgcmVzdFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5jb25zdCBBbmltYXRlZEdhbWV0ZVZpZXcgPSAoe2lkLCBpbml0aWFsRGlzcGxheSwgZGlzcGxheSwgYW5pbVN0aWZmbmVzcz0xMDAsIG9uUmVzdCwgLi4ub3RoZXJzfSkgPT4ge1xuXG4gIGNvbnN0IGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgaW5pdGlhbCA9IGluaXRpYWxEaXNwbGF5IHx8IGRpc3BsYXksXG4gICAgICAgIGluaXRpYWxTaXplID0gaW5pdGlhbC5zaXplIHx8IDMwLFxuICAgICAgICBpbml0aWFsUm90YXRpb24gPSBpbml0aWFsLnJvdGF0aW9uICE9IG51bGwgPyBpbml0aWFsLnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgaW5pdGlhbE9wYWNpdHkgPSBpbml0aWFsLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWwub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgZmluYWxTaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICBmaW5hbFJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGZpbmFsT3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICBzcHJpbmdDb25maWcgPSB7IHN0aWZmbmVzczogYW5pbVN0aWZmbmVzcyB9O1xuICByZXR1cm4gKFxuICAgIDxNb3Rpb24gY2xhc3NOYW1lPSdnZW5pYmxvY2tzIGFuaW1hdGVkLWdhbWV0ZSdcbiAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tcbiAgICAgICAgICAgIHg6IGluaXRpYWwueCwgeTogaW5pdGlhbC55LCBzaXplOiBpbml0aWFsU2l6ZSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiBpbml0aWFsUm90YXRpb24sIG9wYWNpdHk6IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgeDogc3ByaW5nKGRpc3BsYXkueCwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHk6IHNwcmluZyhkaXNwbGF5LnksIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICBzaXplOiBzcHJpbmcoZmluYWxTaXplLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgcm90YXRpb246IHNwcmluZyhmaW5hbFJvdGF0aW9uLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgb3BhY2l0eTogc3ByaW5nKGZpbmFsT3BhY2l0eSwgc3ByaW5nQ29uZmlnKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT5cbiAgICAgICAgICA8R2FtZXRlVmlldyBpZD17aWR9IGRpc3BsYXk9e2ludGVycG9sYXRlZFN0eWxlfSB7Li4ub3RoZXJzfSAvPlxuICAgICAgfVxuICAgIDwvTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRHYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBpbml0aWFsRGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgLy8gaW5pdGlhbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KSxcbiAgZGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGZpbmFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXN0OiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRHYW1ldGVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01vdGlvbiwgc3ByaW5nfSBmcm9tICdyZWFjdC1tb3Rpb24nO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgQW5pbWF0ZWRPcmdhbmlzbVZpZXcgPSAoe29yZywgaWQsIHdpZHRoPTIwMCwgc3R5bGU9e30sIGluaXRpYWxPcGFjaXR5PTEuMCwgb3BhY2l0eT0xLjAsIHN0aWZmbmVzcz02MCwgb25SZXN0LCBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgb3BhY2l0eVN0YXJ0ID0gaW5pdGlhbE9wYWNpdHkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBpbml0aWFsT3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAob3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gb3BhY2l0eSA6IDEuMCk7XG4gIGxldCAgIG9wYWNpdHlFbmQgPSBvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogb3BhY2l0eVN0YXJ0O1xuXG4gIGlmIChvcGFjaXR5RW5kICE9PSBvcGFjaXR5U3RhcnQpXG4gICAgb3BhY2l0eUVuZCA9IHNwcmluZyhvcGFjaXR5RW5kLCB7IHN0aWZmbmVzczogc3RpZmZuZXNzIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtb3JnYW5pc20tdmlldydcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZT17e29wYWNpdHk6IG9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogb3BhY2l0eUVuZH19IG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+IHtcbiAgICAgICAgICBjb25zdCB0U3R5bGUgPSB7IC4uLnN0eWxlLCAuLi5pbnRlcnBvbGF0ZWRTdHlsZSB9O1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWR9IHdpZHRoPXt3aWR0aH0gc3R5bGU9e3RTdHlsZX0gb25DbGljaz17b25DbGlja30gLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgPC9Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpbml0aWFsT3BhY2l0eTogUHJvcFR5cGVzLm51bWJlcixcbiAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlcixcbiAgc3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRPcmdhbmlzbVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEVnZ1ZpZXcsIEVHR19JTUFHRV9XSURUSCB9IGZyb20gJy4vZWdnLWNsdXRjaCc7XG5cbmNvbnN0IEVHR19JTUFHRV9XSURUSF9TTUFMTCA9IEVHR19JTUFHRV9XSURUSCAvIDM7XG5cbmNsYXNzIEJhc2tldFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYmFza2V0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBhbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICAgIHNleDogUHJvcFR5cGVzLm51bWJlclxuICAgIH0pLFxuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgY29uc3QgeyBiYXNrZXQsIGluZGV4LCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhpbmRleCwgYmFza2V0KTtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBiYXNrZXQsIGlkLCBlZ2dzLCBpc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAnYmFza2V0JyArIChpc1NlbGVjdGVkID8gJyBzZWxlY3RlZCcgOiAnJyk7XG5cbiAgICBmdW5jdGlvbiBlZ2dzRGl2KCkge1xuICAgICAgaWYgKCFlZ2dzIHx8ICFlZ2dzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgICBsZXQgZWdnVmlld3MgPSBlZ2dzLm1hcChmdW5jdGlvbihlZ2csIGluZGV4KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEVnZ1ZpZXcgZWdnPXtlZ2d9IGtleT17YGJhc2tldC1lZ2ctJHtpbmRleH1gfSBpc1NlbGVjdGVkPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlTdHlsZT17e3NpemU6IEVHR19JTUFHRV9XSURUSF9TTUFMTH19IC8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXNrZXQtZWdncycgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMzAsIHRvcDogMTAsIHdpZHRoOiA3MCB9fT5cbiAgICAgICAgICB7ZWdnVmlld3N9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IGlkPXtpZH0ga2V5PXtpZH0gc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXNrZXQtaW1hZ2UnIHJlZj0nZG9tTm9kZSc+PC9kaXY+XG4gICAgICAgIHtlZ2dzRGl2KCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXNrZXQtbGFiZWwgdW5zZWxlY3RhYmxlJz57YmFza2V0LmxhYmVsfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBCYXNrZXRTZXRWaWV3ID0gKHtiYXNrZXRzLCBpZFByZWZpeD0nYmFza2V0LScsIHNlbGVjdGVkSW5kaWNlcz1bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVnZ3MsIGVnZ0luZGV4T2Zmc2V0LCBhbmltYXRpbmdFZ2dJbmRleCwgb25DbGlja30pID0+IHtcblxuICBsZXQgYmFza2V0Vmlld3MgPSBiYXNrZXRzLm1hcCgoYmFza2V0LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IGAke2lkUHJlZml4fSR7aW5kZXh9YCxcbiAgICAgICAgICAgICAgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kaWNlcy5pbmRleE9mKGluZGV4KSA+PSAwO1xuICAgICAgICBsZXQgZWdnSW5kaWNlcyA9IChiYXNrZXQgJiYgYmFza2V0LmVnZ3MpIHx8IFtdLFxuICAgICAgICAgICAgZGlzcGxheUVnZ3MgPSBbXTtcbiAgICAgICAgICAgIGVnZ0luZGljZXMuZm9yRWFjaCgoZWdnRHJha2VJbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlZ2dJbmRleCA9IGVnZ0RyYWtlSW5kZXggLSBlZ2dJbmRleE9mZnNldDtcbiAgICAgICAgICAgICAgaWYgKGVnZ0RyYWtlSW5kZXggPT09IGFuaW1hdGluZ0VnZ0luZGV4KSByZXR1cm47XG4gICAgICAgICAgICAgIGlmIChlZ2dzICYmIGVnZ3NbZWdnSW5kZXhdKVxuICAgICAgICAgICAgICAgIGRpc3BsYXlFZ2dzLnB1c2goZWdnc1tlZ2dJbmRleF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiA8QmFza2V0VmlldyBiYXNrZXQ9e2Jhc2tldH0gaWQ9e2lkfSBrZXk9e2lkfSBpbmRleD17aW5kZXh9IGVnZ3M9e2Rpc3BsYXlFZ2dzfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aXNTZWxlY3RlZH0gb25DbGljaz17b25DbGlja30gLz47XG4gICAgICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBiYXNrZXQtc2V0XCI+XG4gICAgICB7IGJhc2tldFZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkJhc2tldFNldFZpZXcucHJvcFR5cGVzID0ge1xuICBiYXNrZXRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2VsZWN0ZWRJbmRpY2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgZWdnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gIGVnZ0luZGV4T2Zmc2V0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBhbmltYXRpbmdFZ2dJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2tldFNldFZpZXc7XG4iLCIvKlxuICogVGhpcyBjb21wb25lbnQgaXMgYSB2ZXJ5IHRoaW4gd3JhcHBlciBhcm91bmQgYSBzdGFuZGFyZCBidXR0b24gZGVzaWduZWQgdG8gcHJldmVudFxuICogZXh0cmFuZW91cyBmb2N1cyBoaWdobGlnaHRpbmcgYWRkZWQgYnkgYnJvd3NlcnMgd2hlbiBjbGlja2luZyBvbiBhIGJ1dHRvbiB3aGlsZVxuICogbWFpbnRhaW5pbmcga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eS4gU2VlXG4gKiBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gKiBmb3IgZGV0YWlscy4gVGhlIHVwc2hvdCBpcyB0aGF0IHdlIHVzZSBtb3VzZSBldmVudHMgb24gdGhlIGJ1dHRvbiB0byBkaXNhYmxlIHRoZVxuICogZm9jdXMgaGlnaGxpZ2h0IC0tIG1vdXNpbmcvY2xpY2tpbmcgb24gYSBwdXNoIGJ1dHRvbiBzaG91bGQgbm90IGJlIHVzZWQgYXMgYW5cbiAqIGluY2lkYXRvciB0aGF0IHRoZSB1c2VyIHdvdWxkIGxpa2UgdG8ga2V5Ym9hcmQtaW50ZXJhY3Qgd2l0aCB0aGF0IGJ1dHRvbiwgd2hpY2hcbiAqIGlzIHdoYXQgZm9jdXNpbmcgYSBjbGlja2VkIGJ1dHRvbiBpbXBsaWVzLlxuICogSU1QT1JUQU5UOiBUbyBtYWludGFpbiBhY2Nlc3NpYmlsaXR5LCB0aGVyZSBtdXN0IGJlIGNvZGUgc29tZXdoZXJlIHRvIHJlZW5hYmxlXG4gKiB0aGUgZm9jdXMgaGlnaGxpZ2h0IHdoZW4gYXBwcm9wcmlhdGUuIFRoaXMgY2FuIGJlIGRvbmUgZm9yICdrZXlkb3duJyBieSBjYWxsaW5nXG4gKiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHRPbktleURvd24oKSBkdXJpbmcgYXBwbGljYXRpb24vcGFnZSBpbml0aWFsaXphdGlvbixcbiAqIG9yIGJ5IGFkZGluZyB5b3VyIG93biBldmVudCBoYW5kbGVyIHRoYXQgY2FsbHMgQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0KCkuXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHQgZnJvbSAnLi4vdXRpbGl0aWVzL3RyYW5zbGF0ZSc7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pXG4gIH1cblxuICAvLyBJbnN0YWxscyBhIGtleWRvd24gaGFuZGxlciBvbiB0aGUgZG9jdW1lbnQgd2hpY2ggd2lsbCBlbmFibGUgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZy5cbiAgLy8gU2hvdWxkIGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBpbml0aWFsaXphdGlvbi5cbiAgc3RhdGljIGVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSk7XG4gIH1cblxuICAvLyBFbmFibGVzIGJ1dHRvbiBmb2N1cyBoaWdobGlnaHRpbmc7IGRlc2lnbmVkIHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBrZXlkb3duIGhhbmRsZXIgYWJvdmVcbiAgLy8gYnV0IGF2YWlsYWJsZSBzZXBhcmF0ZWx5IGZvciBpbXBsZW1lbnRhdGlvbnMgdGhhdCByZXF1aXJlIGl0LlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYi1idXR0b24nKSxcbiAgICAgICAgICBjb3VudCA9IGJ1dHRvbnMubGVuZ3RoO1xuICAgIC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZUxpc3QjRXhhbXBsZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGlmIChidXR0b24gJiYgYnV0dG9uLmNsYXNzTmFtZSkge1xuICAgICAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTU5NTEvY2hhbmdlLWFuLWVsZW1lbnRzLWNsYXNzLXdpdGgtamF2YXNjcmlwdFxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC8oPzpefFxccyluby1mb2N1cy1oaWdobGlnaHQoPyFcXFMpL2cgLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcHJldmVudCBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodCBvbiBjbGljayB3aGlsZSBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5XG4gIC8vIHNlZSBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gIHN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm9Gb2N1c0hpZ2hsaWdodCA9ICduby1mb2N1cy1oaWdobGlnaHQnLFxuICAgICAgICAgIGJ1dHRvbiA9IHRoaXMucmVmcy5idXR0b247XG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lLmluZGV4T2Yobm9Gb2N1c0hpZ2hsaWdodCkgPCAwKVxuICAgICAgYnV0dG9uLmNsYXNzTmFtZSArPSAnICcgKyBub0ZvY3VzSGlnaGxpZ2h0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBsYWJlbCwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAoY2xhc3NOYW1lID8gY2xhc3NOYW1lICsgJyAnIDogJycpICsgJ2diLWJ1dHRvbic7XG5cbiAgICBjb25zdCBoYW5kbGVNb3VzZUV2ZW50ID0gKCkgPT4gdGhpcy5zdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2NsYXNzZXN9IHJlZj0nYnV0dG9uJyB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2hhbmRsZU1vdXNlRXZlbnR9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVNb3VzZUV2ZW50fT5cbiAgICAgICAge3QobGFiZWwpfVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5cbmNsYXNzIENoYWxsZW5nZUF3YXJkVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBjb2luUGFydHM6IFByb3BUeXBlcy5udW1iZXJcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICBjaGFsbGVuZ2VBd2FyZHM6IHtcImNhc2VJZFwiOjAsIFwiY2hhbGxlbmdlSWRcIjowLCBcImNoYWxsZW5nZUNvdW50XCI6MCwgXCJwcm9ncmVzc1wiOltdfSxcbiAgICAgc2l6ZTogMjU2LFxuICAgICBjb2luUGFydHM6IDNcbiAgfTtcblxuICBhZGRBd2FyZEltYWdlID0gKHByb2dyZXNzSW1hZ2VzLCBwaWVjZXMsIHBpZWNlTnVtLCBzY29yZSwgcGllY2VTdHlsZSkgPT4ge1xuICAgIGxldCBhd2FyZExldmVsID0gdGhpcy5nZXRBd2FyZFN0eWxlKHNjb3JlKTtcbiAgICBpZiAoc2NvcmUgPiAtMSl7XG4gICAgICBsZXQgcGllY2VOYW1lID0gYGNvaW4gcGllY2UgcGllY2VzJHtwaWVjZXN9IHBpZWNlJHtwaWVjZU51bX0gJHtwaWVjZVN0eWxlfSAke2F3YXJkTGV2ZWx9YDtcbiAgICAgIHByb2dyZXNzSW1hZ2VzLnB1c2goPGRpdiBrZXk9e3BpZWNlTnVtfSBjbGFzc05hbWU9e3BpZWNlTmFtZX0gLz4pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZ3Jlc3NJbWFnZXM7XG4gIH07XG5cbiAgZ2V0QXdhcmRTdHlsZSA9IChzY29yZSkgPT4ge1xuICAgIGxldCBhd2FyZExldmVsID0gXCJnb2xkXCI7XG4gICAgaWYgKHNjb3JlID09PSAxKSBhd2FyZExldmVsID0gXCJzaWx2ZXJcIjtcbiAgICBpZiAoc2NvcmUgPj0gMikgYXdhcmRMZXZlbCA9IFwiYnJvbnplXCI7XG4gICAgcmV0dXJuIGF3YXJkTGV2ZWw7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBjYXNlSWQgPSAwLCBjaGFsbGVuZ2VJZCA9IDAsIGNoYWxsZW5nZUNvdW50ID0gMCwgcHJvZ3Jlc3MgPSBbXSwgY2hhbGxlbmdlQmFja2dyb3VuZEltYWdlLCBwcm9ncmVzc0ltYWdlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUlkICE9IG51bGwpIHtcbiAgICAgIGNhc2VJZCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNhc2VJZCxcbiAgICAgIGNoYWxsZW5nZUlkID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMuY2hhbGxlbmdlSWQsXG4gICAgICBjaGFsbGVuZ2VDb3VudCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUNvdW50O1xuICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5wcm9ncmVzcztcbiAgICAgIGNoYWxsZW5nZUJhY2tncm91bmRJbWFnZSA9IDxkaXYgY2xhc3NOYW1lPVwiY29pbiBiYWNrZ3JvdW5kXCIgLz47XG4gICAgfSBlbHNlIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFwcm9ncmVzcyB8fCBwcm9ncmVzcyA9PT0gW10pXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGxldCBzaXplID0gdGhpcy5wcm9wcy5zaXplIHx8IDI1NjtcbiAgICBsZXQgc2l6ZVN0eWxlID0ge1xuICAgICAgd2lkdGg6IHNpemUgKyBcInB4XCIsXG4gICAgICBoZWlnaHQ6IHNpemUgKyBcInB4XCJcbiAgICB9O1xuXG4gICAgbGV0IHBpZWNlS2V5ID0gY2FzZUlkICsgXCI6XCI7XG4gICAgbGV0IGNoYWxsZW5nZVNjb3JlID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYWxsZW5nZUNvdW50OyBpKyspe1xuICAgICAgZm9yICh2YXIga2V5IGluIHByb2dyZXNzKXtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKHBpZWNlS2V5ICsgaSkpe1xuICAgICAgICAgIGNvbnN0IHNjb3JlID0gcHJvZ3Jlc3Nba2V5XTtcbiAgICAgICAgICBpZiAoY2hhbGxlbmdlU2NvcmVbaV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgIGNoYWxsZW5nZVNjb3JlW2ldID0gc2NvcmU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoYWxsZW5nZVNjb3JlW2ldICs9IHNjb3JlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgcGllY2VOdW0gPSBjaGFsbGVuZ2VJZCArIDE7XG4gICAgbGV0IGN1cnJlbnRQaWVjZVN0eWxlID0gYGNvaW4gcGllY2UgcGllY2VzJHtjaGFsbGVuZ2VDb3VudH0gcGllY2Uke3BpZWNlTnVtfSBzaW5nbGUgJHt0aGlzLmdldEF3YXJkU3R5bGUoY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlSWRdKX1gO1xuXG4gICAgZm9yICh2YXIgY2hhbGxlbmdlIGluIGNoYWxsZW5nZVNjb3JlKXtcbiAgICAgIHBpZWNlTnVtID0gcGFyc2VJbnQoY2hhbGxlbmdlKSArIDE7XG4gICAgICBwcm9ncmVzc0ltYWdlcyA9IHRoaXMuYWRkQXdhcmRJbWFnZShwcm9ncmVzc0ltYWdlcywgY2hhbGxlbmdlQ291bnQsIHBpZWNlTnVtLCBjaGFsbGVuZ2VTY29yZVtjaGFsbGVuZ2VdLCBcIndob2xlXCIpO1xuICAgIH1cblxuICAgIGxldCBzaW5nbGVQaWVjZU9wYWNpdHlTdGFydCA9IDEsIHNpbmdsZVBpZWNlT3BhY2l0eUVuZCA9IDAsIHN0eWxlID0ge30sIG9uUmVzdDtcbiAgICBzaW5nbGVQaWVjZU9wYWNpdHlFbmQgPSBzcHJpbmcoc2luZ2xlUGllY2VPcGFjaXR5RW5kLCB7IHN0aWZmbmVzczogMzAsIGRhbXBpbmc6MjAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNoYWxsZW5nZS1hd2FyZFwiIHN0eWxlPXtzaXplU3R5bGV9ID5cbiAgICAgICAge2NoYWxsZW5nZUJhY2tncm91bmRJbWFnZX1cbiAgICAgICAge3Byb2dyZXNzSW1hZ2VzfVxuICAgICAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1jb2luLXZpZXcnXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tvcGFjaXR5OiBzaW5nbGVQaWVjZU9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogc2luZ2xlUGllY2VPcGFjaXR5RW5kfX0gb25SZXN0PXtvblJlc3R9ID5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRTdHlsZSA9IHsgLi4uc3R5bGUsIC4uLmludGVycG9sYXRlZFN0eWxlIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwaWVjZU51bX0gc3R5bGU9e3RTdHlsZX0gY2xhc3NOYW1lPXtjdXJyZW50UGllY2VTdHlsZX0gLz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIDwvTW90aW9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFsbGVuZ2VBd2FyZFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgbWFsZS9mZW1hbGUgY2hhbmdlIGJ1dHRvbnNcbiAqIFRoZSBhcHBlYXJhbmNlIG9mIHRoZSBidXR0b25zIGlzIGN1cnJlbnRseSBlbnRpcmVseSBjb250cm9sbGVkIHZpYSBleHRlcm5hbCBDU1MuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2V4IC0gWydtYWxlJyB8ICdmZW1hbGUnXSBjdXJyZW50bHkgc2VsZWN0ZWQgYnV0dG9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNoYW5nZShldnQsIHNleCkgLSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB1c2UgY2xpY2tzIHRvIGNoYW5nZSBzZXhcbiAqL1xuY29uc3QgQ2hhbmdlU2V4QnV0dG9ucyA9ICh7aWQsIHNleCwgc3BlY2llcywgc2hvd0xhYmVsLCBzdHlsZT17fSwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IGNhcFNleCA9IHNleCA9PT0gQmlvTG9naWNhLk1BTEUgPyAnTWFsZScgOiAnRmVtYWxlJyxcbiAgICAgICAgc2VsZWN0ZWRTZXhDbGFzcyA9IHNleCA9PT0gQmlvTG9naWNhLk1BTEUgPyAnbWFsZS1zZWxlY3RlZCcgOiAnZmVtYWxlLXNlbGVjdGVkJyxcbiAgICAgICAgQlVUVE9OX0lNQUdFX1dJRFRIID0gMTAwLFxuICAgICAgICBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCA9IEJVVFRPTl9JTUFHRV9XSURUSCAvIDIsXG4gICAgICAgIGltYWdlU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9LFxuICAgICAgICBsYWJlbCA9IHNob3dMYWJlbCA/IGAke2NhcFNleH0gJHtzcGVjaWVzfWAgOiAnJyxcbiAgICAgICAgbGFiZWxFbGVtZW50ID0gc2hvd0xhYmVsID8gPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogQlVUVE9OX0lNQUdFX1dJRFRILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMH19PntsYWJlbH08L2Rpdj4gOiAnJztcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHRSZWN0ID0gZXZ0LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICBjbGlja1ggPSBldnQuY2xpZW50WCAtIGVsdFJlY3QubGVmdDtcblxuICAgIGlmIChzZXggPT09IEJpb0xvZ2ljYS5GRU1BTEUgJiYgY2xpY2tYID4gQlVUVE9OX0lNQUdFX01JRFBPSU5UX1gpeyAvLyB1c2VyIGNsaWNrZWQgb24gUmlnaHQgKG1hbGUpIGljb24gd2hpbGUgZmVtYWxlIHdhcyBzZWxlY3RlZFxuICAgICAgb25DaGFuZ2UoQmlvTG9naWNhLk1BTEUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzZXggPT09IEJpb0xvZ2ljYS5NQUxFICYmIGNsaWNrWCA8IEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YKXsgLy8gdXNlciBjbGlja2VkIG9uIExlZnQgKGZlbWFsZSkgaWNvbiB3aGlsZSBtYWxlIHdhcyBzZWxlY3RlZFxuICAgICAgb25DaGFuZ2UoQmlvTG9naWNhLkZFTUFMRSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgPGRpdiAgY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBjaGFuZ2Utc2V4LWJ1dHRvbnMgJHtzZWxlY3RlZFNleENsYXNzfWB9XG4gICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9ID5cbiAgICAgIDwvZGl2PlxuICAgICAge2xhYmVsRWxlbWVudH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNoYW5nZVNleEJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2V4OiBQcm9wVHlwZXMub25lT2YoW0Jpb0xvZ2ljYS5NQUxFLCBCaW9Mb2dpY2EuRkVNQUxFXSksXG4gIHNwZWNpZXM6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNob3dMYWJlbDogUHJvcFR5cGVzLmJvb2wsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhbmdlU2V4QnV0dG9ucztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgd2lkdGg6IDIzLFxuICAgIGhlaWdodDogMTIwLFxuICAgIHNwbGl0OiA0NVxuICB9LFxuICBzbWFsbDoge1xuICAgIHdpZHRoOiAxOSxcbiAgICBoZWlnaHQ6IDkwLFxuICAgIHNwbGl0OiAzNFxuICB9XG59O1xuXG5jb25zdCBkZWZhdWx0c1kgPSB7XG4gIG5vcm1hbDoge1xuICAgIHdpZHRoOiAyMyxcbiAgICBoZWlnaHQ6IDc1LFxuICAgIHNwbGl0OiAzOFxuICB9LFxuICBzbWFsbDoge1xuICAgIHdpZHRoOiAxOSxcbiAgICBoZWlnaHQ6IDYyLFxuICAgIHNwbGl0OiAzMlxuICB9XG59O1xuXG5jb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKHt3aWR0aCwgaGVpZ2h0LCBzcGxpdD00NSwgY29sb3I9JyNGRjk5OTknLCBzbWFsbD1mYWxzZSwgYm9sZD1mYWxzZSwgZW1wdHk9ZmFsc2UsIHlDaHJvbW9zb21lPWZhbHNlLCBhbmltYXRpb25TdHlsaW5nfSkgPT4ge1xuICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpIHtcbiAgICBsZXQgZGVmYXVsdERpbXMgPSB5Q2hyb21vc29tZSA/IGRlZmF1bHRzWSA6IGRlZmF1bHRzO1xuICAgICh7d2lkdGgsIGhlaWdodCwgc3BsaXR9ID0gc21hbGwgPyBkZWZhdWx0RGltcy5zbWFsbCA6IGRlZmF1bHREaW1zLm5vcm1hbCk7XG4gIH1cblxuICBjb25zdCByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgICBpbWFnZVdpZHRoID0gd2lkdGgrNCxcbiAgICAgICAgaGFsZkltYWdlV2lkdGggPSBpbWFnZVdpZHRoLzIsXG4gICAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQ7XG5cbiAgbGV0IHN0cm9rZVdpZHRoID0gd2lkdGggPCAxMCA/IDEgOiAyO1xuXG4gIGlmIChib2xkKSB7XG4gICAgY29sb3IgPSAnI0ZGNjY2Nic7XG4gICAgc3Ryb2tlV2lkdGggPSAzO1xuICB9XG4gIGlmIChlbXB0eSkge1xuICAgIGNvbG9yID0gJyNGRkYnO1xuICAgIHN0cm9rZVdpZHRoID0gMTtcbiAgfVxuICBsZXQgcG9zaXRpb25TdHlsaW5nID0ge307XG4gIGlmIChhbmltYXRpb25TdHlsaW5nKXtcbiAgICBwb3NpdGlvblN0eWxpbmcgPSB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgbGVmdDogYW5pbWF0aW9uU3R5bGluZy54LCB0b3A6IGFuaW1hdGlvblN0eWxpbmcueSwgb3BhY2l0eTogYW5pbWF0aW9uU3R5bGluZy5vcGFjaXR5XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hyb21vc29tZS1pbWFnZVwiIHN0eWxlPXtwb3NpdGlvblN0eWxpbmd9PlxuICAgICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysyfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17aGVpZ2h0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD17KHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKX0gd2lkdGg9e3dpZHRofSB5PXtyYWRpdXMrMn0geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8cmVjdCBoZWlnaHQ9eyhoZWlnaHQtcmFkaXVzKS0oc3BsaXQrcmFkaXVzKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZUltYWdlVmlldy5wcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNwbGl0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc21hbGw6IFByb3BUeXBlcy5ib29sLFxuICBib2xkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZW1wdHk6IFByb3BUeXBlcy5ib29sLFxuICB5Q2hyb21vc29tZTogUHJvcFR5cGVzLmJvb2wsXG4gIGFuaW1hdGlvblN0eWxpbmc6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgICAgICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuaW1wb3J0IEFsbGVsZVZpZXcgZnJvbSAnLi9hbGxlbGUnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcbi8qKlxuICogVmlldyBvZiBhIHNpbmdsZSBjaHJvbW9zb21lLCB3aXRoIG9wdGlvbmFsIGxhYmVscywgcHVsbGRvd25zLCBhbmQgZW1iZWRkZWQgYWxsZWxlcy5cbiAqXG4gKiBEZWZpbmVkIEVJVEhFUiB1c2luZyBhIEJpb2xvZ2ljYSBDaHJvbW9zb21lIG9iamVjdCwgT1Igd2l0aCBhIEJpb2xvZ2ljYSBvcmdhbmlzbSxcbiAqIGNocm9tb3NvbWUgbmFtZSBhbmQgc2lkZS5cbiAqL1xuXG5jb25zdCBDaHJvbW9zb21lVmlldyA9ICh7Y2hyb21vc29tZSwgb3JnLCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgaGlkZGVuQWxsZWxlcyA9IFtdLCBzbWFsbCA9IGZhbHNlLCBlZGl0YWJsZSA9IHRydWUsIHNlbGVjdGVkID0gZmFsc2UsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZCwgc2hvd0xhYmVscyA9IHRydWUsIHNob3dBbGxlbGVzID0gZmFsc2UsIGxhYmVsc09uUmlnaHQgPSB0cnVlLCBvcmdOYW1lLCBkaXNwbGF5U3R5bGUgPSB7fX0pID0+IHtcbiAgdmFyIGNvbnRhaW5lckNsYXNzID0gXCJpdGVtc1wiLFxuICAgICAgZW1wdHkgPSBmYWxzZSxcbiAgICAgIHlDaHJvbW9zb21lID0gZmFsc2UsXG4gICAgICBsYWJlbHNDb250YWluZXIsIGFsbGVsZXNDb250YWluZXIsIGNocm9tSWQ7XG5cbiAgaWYgKG9yZyAmJiBjaHJvbW9zb21lTmFtZSAmJiBzaWRlKSB7XG4gICAgY2hyb21vc29tZSA9IG9yZy5nZXRHZW5vdHlwZSgpLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXVtzaWRlXTtcbiAgfVxuXG4gIGlmIChjaHJvbW9zb21lKSB7XG4gICAgbGV0IGFsbGVsZXMgPSBjaHJvbW9zb21lLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5maWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIGNocm9tb3NvbWUuc3BlY2llcyk7XG5cbiAgICBpZiAoc2hvd0xhYmVscykge1xuICAgICAgbGV0IGxhYmVscyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e2Nocm9tb3NvbWUuc3BlY2llc30gYWxsZWxlPXthfSBlZGl0YWJsZT17ZWRpdGFibGV9XG4gICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBvbkFsbGVsZUNoYW5nZShhLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBsYWJlbHNDb250YWluZXIgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG5cbiAgICAgIGlmICghbGFiZWxzT25SaWdodCkge1xuICAgICAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2hvd0FsbGVsZXMpIHtcbiAgICAgIGxldCBhbGxlbGVTeW1ib2xzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBbGxlbGVWaWV3IGtleT17YX0gYWxsZWxlPXthfSAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGFsbGVsZXNDb250YWluZXIgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxsZWxlc1wiPlxuICAgICAgICAgIHsgYWxsZWxlU3ltYm9scyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoY2hyb21vc29tZS5zaWRlID09PSBcInlcIikge1xuICAgICAgeUNocm9tb3NvbWUgPSB0cnVlO1xuICAgIH1cblxuICAgIGNocm9tSWQgPSBvcmdOYW1lICsgY2hyb21vc29tZS5jaHJvbW9zb21lICsgY2hyb21vc29tZS5zaWRlO1xuICB9IGVsc2Uge1xuICAgIGNocm9tSWQgPSBvcmdOYW1lO1xuICAgIGVtcHR5ID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBoYW5kbGVTZWxlY3QgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAob25DaHJvbW9zb21lU2VsZWN0ZWQpIHtcbiAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1jb250YWluZXJcIiBvbkNsaWNrPXsgaGFuZGxlU2VsZWN0IH0gPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNocm9tb3NvbWUtYWxsZWxlLWNvbnRhaW5lclwiIGlkPXtjaHJvbUlkfSBzdHlsZT17ZGlzcGxheVN0eWxlfT5cbiAgICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyBzbWFsbD17c21hbGx9IGVtcHR5PXtlbXB0eX0gYm9sZD17c2VsZWN0ZWR9IHlDaHJvbW9zb21lPXt5Q2hyb21vc29tZX0vPlxuICAgICAgICAgIHsgYWxsZWxlc0NvbnRhaW5lciB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7IGxhYmVsc0NvbnRhaW5lciB9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjaHJvbW9zb21lTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2lkZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2hyb21vc29tZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBzbWFsbDogUHJvcFR5cGVzLmJvb2wsXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBzaG93TGFiZWxzOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0FsbGVsZXM6IFByb3BUeXBlcy5ib29sLFxuICBsYWJlbHNPblJpZ2h0OiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2hyb21vc29tZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb3JnTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBVc2VzIGFuIFNWRyBjaXJjdWxhciBncmFkaWVudCB0byBpbXBsZW1lbnQgYSBmYWRpbmcgZ2xvdyBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIlxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgZGlhbWV0ZXIgb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBzdHlsZXMgYXBwbGllZCB0byB0aGUgb3V0ZXIgZGl2XG4gKi9cbmNvbnN0IENpcmN1bGFyR2xvd1ZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgc3R5bGV9KSA9PiB7XG4gIGxldCByYWRpdXMgPSBzaXplLzIsXG4gICAgICBjb2xvck5vSGFzaCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBncmFkaWVudElEID0gYENpcmN1bGFyR2xvd1ZpZXdfJHtpZCB8fCBjb2xvck5vSGFzaH1gLFxuICAgICAgZ3JhZGllbnRJRFVybCA9IGB1cmwoIyR7Z3JhZGllbnRJRH0pYDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaXJjdWxhci1nbG93XCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPXtncmFkaWVudElEfT5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIxLjBcIi8+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjBcIi8+XG4gICAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8Y2lyY2xlIGZpbGw9e2dyYWRpZW50SURVcmx9IGN4PXtyYWRpdXN9IGN5PXtyYWRpdXN9IHI9e3JhZGl1c30gLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2lyY3VsYXJHbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8vIGltYWdlIHNwZWNpZmllZCBhcyBDU1MgYmFja2dyb3VuZC1pbWFnZSwgYnV0IHNpemUgY29uc3RhbnRzIHJlcXVpcmVkIGluIEphdmFTY3JpcHRcbmV4cG9ydCBjb25zdCAgRUdHX0lNQUdFX1dJRFRIID0gNzUsXG4gICAgICAgICAgICAgIEVHR19JTUFHRV9IRUlHSFQgPSAxMDk7XG5cbmV4cG9ydCBjbGFzcyBFZ2dWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVnZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNwbGF5U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBoYW5kbGVDbGljayA9IChldnQpID0+IHtcbiAgICBjb25zdCB7IGVnZywgaWQsIGluZGV4LCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhpZCwgaW5kZXgsIGVnZyk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZWdnLCBpZCwgZGlzcGxheVN0eWxlLCBpc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGVnZ1N0eWxlID0gT2JqZWN0LmFzc2lnbih7IGZsZXhTaHJpbms6IDAgfSwgZGlzcGxheVN0eWxlKSxcbiAgICAgICAgICBpc0hpZGRlbiA9IChlZ2cgPT0gbnVsbCksXG4gICAgICAgICAgY2xhc3NlcyA9ICdjbHV0Y2gtZWdnJyArIChpc1NlbGVjdGVkID8gJyBzZWxlY3RlZCcgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKGlzSGlkZGVuID8gJyBoaWRkZW4nIDogJycpO1xuICAgIGlmIChkaXNwbGF5U3R5bGUgJiYgKGRpc3BsYXlTdHlsZS5zaXplICE9IG51bGwpKSB7XG4gICAgICBlZ2dTdHlsZS53aWR0aCA9IGRpc3BsYXlTdHlsZS5zaXplO1xuICAgICAgZWdnU3R5bGUuaGVpZ2h0ID0gZWdnU3R5bGUud2lkdGggKiAoRUdHX0lNQUdFX0hFSUdIVCAvIEVHR19JTUFHRV9XSURUSCk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtjbGFzc2VzfSBrZXk9e2lkfSByZWY9J2RvbU5vZGUnIHN0eWxlPXtlZ2dTdHlsZX0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30gLz5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IEVnZ0NsdXRjaFZpZXcgPSAoe2VnZ3MsIGlkUHJlZml4PSdlZ2ctJywgc2VsZWN0ZWRJbmRleCwgb25DbGlja30pID0+IHtcblxuICBjb25zdCBPRERfRUdHX01BUkdJTiA9IDgsXG4gICAgICAgIEVWRU5fRUdHX01BUkdJTiA9IDM1O1xuICBsZXQgb3JnVmlld3M7XG5cbiAgZnVuY3Rpb24gZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIG1hcmdpbikge1xuICAgIGNvbnN0IGlkID0gYCR7aWRQcmVmaXh9JHtpbmRleH1gLFxuICAgICAgICAgIHZpc2liaWxpdHlTdHlsZSA9IGVnZyAmJiAoZWdnLmJhc2tldCA9PSBudWxsKSA/IHt9IDogeyB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9LFxuICAgICAgICAgIGVnZ1N0eWxlID0gT2JqZWN0LmFzc2lnbih7IG1hcmdpbkxlZnQ6IG1hcmdpbiwgbWFyZ2luUmlnaHQ6IG1hcmdpbiB9LCB2aXNpYmlsaXR5U3R5bGUpO1xuICAgIHJldHVybiA8RWdnVmlldyBlZ2c9e2VnZ30gaWQ9e2lkfSBrZXk9e2lkfSBpbmRleD17aW5kZXh9IGRpc3BsYXlTdHlsZT17ZWdnU3R5bGV9XG4gICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ID09PSBzZWxlY3RlZEluZGV4fSBvbkNsaWNrPXtvbkNsaWNrfSAvPjtcbiAgfVxuXG4gIC8vIGV2ZW4gbnVtYmVyIG9mIGVnZ3NcbiAgaWYgKGVnZ3MubGVuZ3RoICUgMiA9PT0gMCkge1xuICAgIG9yZ1ZpZXdzID0gZWdncy5tYXAoKGVnZywgaW5kZXgpID0+IGVnZ1ZpZXdGb3JJbmRleChlZ2csIGluZGV4LCBFVkVOX0VHR19NQVJHSU4pKTtcbiAgfVxuXG4gIGVsc2Uge1xuICAgIG9yZ1ZpZXdzID0gZWdncy5yZWR1Y2UoKHByZXYsIGVnZywgaW5kZXgpID0+IHtcbiAgICAgIHByZXYucHVzaChlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgT0REX0VHR19NQVJHSU4pKTtcbiAgICAgIC8vIGZvciBmbGV4IGxheW91dCBwdXJwb3Nlcywgd2l0aCBvZGQgbnVtYmVycyBvZiBpdGVtc1xuICAgICAgLy8gd2UgYWRkIHNwYWNlciBpdGVtcyBiZXR3ZWVuIHRoZSBlZ2dzXG4gICAgICBjb25zdCBzcGFjZXJJRCA9IGAke2lkUHJlZml4fSR7aW5kZXh9LXNwYWNlcmAsXG4gICAgICAgICAgICBzcGFjZXJTdHlsZSA9IHsgbWFyZ2luTGVmdDogT0REX0VHR19NQVJHSU4sIG1hcmdpblJpZ2h0OiBPRERfRUdHX01BUkdJTixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9O1xuICAgICAgcHJldi5wdXNoKDxFZ2dWaWV3IGVnZz17bnVsbH0ga2V5PXtzcGFjZXJJRH0gZGlzcGxheVN0eWxlPXtzcGFjZXJTdHlsZX0gLz4pO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZWdnLWNsdXRjaFwiPlxuICAgICAgeyBvcmdWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5FZ2dDbHV0Y2hWaWV3LnByb3BUeXBlcyA9IHtcbiAgZWdnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaWRQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFZ2dDbHV0Y2hWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogSW1wbGVtZW50cyBhIHJlY3Rhbmd1bGFyIHRleHQgYXJlYSBmb3IgcHJvdmlkaW5nIGZlZWRiYWNrIHRvIHVzZXJzLCBzdWNoIGFzXG4gKiB0aGF0IHVzZWQgaW4gR2VuaXZlcnNlJ3MgY2hhbGxlbmdlcyBmb3IgcHJvdmlkaW5nIHRyaWFsIGFuZCBnb2FsIGZlZWRiYWNrLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHRleHQgLSBhIHNpbmdsZSBvciBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIGlubGluZSBzdHlsZXMgYXBwbGllZCB0byB0aGUgPGRpdj4gY29udGFpbmluZyBlYWNoIGxpbmUgb2YgdGV4dFxuICovXG5jb25zdCBGZWVkYmFja1ZpZXcgPSAoe3RleHQsIHN0eWxlPXt9fSkgPT4ge1xuICBjb25zdCB0VGV4dCA9IEFycmF5LmlzQXJyYXkodGV4dCkgPyB0ZXh0IDogW3RleHRdLFxuICAgICAgICBsaW5lQ291bnQgPSB0VGV4dC5sZW5ndGgsXG4gICAgICAgIGhlaWdodCA9IDIwICogbGluZUNvdW50ICsgMixcbiAgICAgICAgZGVmYXVsdFN0eWxlID0geyBoZWlnaHQ6IGhlaWdodCwgLi4uc3R5bGUgfSxcbiAgICAgICAgdGV4dExpbmVzID0gdFRleHQubWFwKChpVGV4dCwgaW5kZXgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZlZWRiYWNrIHRleHQtbGluZVwiIGtleT17aW5kZXh9PntpVGV4dH08L2Rpdj4pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZlZWRiYWNrLXZpZXdcIiBzdHlsZT17ZGVmYXVsdFN0eWxlfT5cbiAgICAgIHt0ZXh0TGluZXN9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5GZWVkYmFja1ZpZXcucHJvcFR5cGVzID0ge1xuICB0ZXh0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpXG4gICAgICAgIF0pLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBGZWVkYmFja1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBJTklUSUFMX0dBTUVURV9TSVpFID0gMzAsXG4gICAgICBGSU5BTF9HQU1FVEVfU0laRSA9IDE0MCxcbiAgICAgIFJFU1RJTkdfTU9USEVSX0dBTUVURV9YID0gMCxcbiAgICAgIFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YID0gMTUwLFxuICAgICAgRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YID0gNzAsXG4gICAgICBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1ggPSA4MCxcbiAgICAgIEZJTkFMX1pZR09URV9ZID0gLTE1MDtcblxuZXhwb3J0IGNvbnN0IEdBTUVURV9UWVBFID0geyBNT1RIRVI6ICdtb3RoZXInLCBGQVRIRVI6ICdmYXRoZXInIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWyBHQU1FVEVfVFlQRS5NT1RIRVIsIEdBTUVURV9UWVBFLkZBVEhFUiBdKS5pc1JlcXVpcmVkLFxuICAgIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZmVydGlsaXphdGlvblN0YXRlOiBQcm9wVHlwZXMub25lT2YoWydub25lJywgJ2ZlcnRpbGl6aW5nJywgJ2ZlcnRpbGl6ZWQnLCAnY29tcGxldGUnXSkuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBzcmNSZWN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBkc3RSZWN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gICAgb25SZXN0OiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBbXSxcbiAgICBhbmltU3RpZmZuZXNzOiAxMDBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGxldCB7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcywgYW5pbVN0aWZmbmVzcywgb25SZXN0fSA9IHRoaXMucHJvcHMsXG4gICAgICAgIHhPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QubGVmdCAtIHRoaXMucHJvcHMuZHN0UmVjdC5sZWZ0IDogMCxcbiAgICAgICAgeU9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC50b3AgLSB0aGlzLnByb3BzLmRzdFJlY3QudG9wIDogMCxcbiAgICAgICAgeFJlc3RpbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgeEZlcnRpbGl6aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIGluaXRpYWwsIHRGaW5hbDtcblxuICAgIGlmICghZ2FtZXRlIHx8IChpZCA9PSBudWxsKSkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnbm9uZScpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUilcbiAgICAgICAgeE9mZnNldCArPSBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWDtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhPZmZzZXQsIHk6IHlPZmZzZXQsIHNpemU6IElOSVRJQUxfR0FNRVRFX1NJWkUgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnZmVydGlsaXppbmcnKSB7XG4gICAgICBpbml0aWFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IEZJTkFMX1pZR09URV9ZLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDAuMCB9O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXtpbml0aWFsfSBkaXNwbGF5PXt0RmluYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1TdGlmZm5lc3M9e2FuaW1TdGlmZm5lc3N9IG9uUmVzdD17b25SZXN0fSAvPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IEdhbWV0ZVBvb2xWaWV3ID0gKHtnYW1ldGVzLCBoaWRkZW5BbGxlbGVzPVtdLCB3aWR0aD0zMDAsIGhlaWdodD0yMDAsIGFuaW1TdGlmZm5lc3M9NjAsIHNlbGVjdGVkSWQsIGlzR2FtZXRlRGlzYWJsZWQsIG9uR2FtZXRlU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBnYW1ldGVDb3VudCA9IGdhbWV0ZXMubGVuZ3RoLFxuICAgICAgZ2FtZXRlU2l6ZSA9IDMwLFxuICAgICAgbWFyZ2luID0gNSxcbiAgICAgIHNwYWNpbmdEZWZhdWx0ID0gZ2FtZXRlU2l6ZSArIDIgKiBtYXJnaW4sXG4gICAgICB4U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgeVNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIGNvbERlZmF1bHQgPSBNYXRoLmZsb29yKHdpZHRoIC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgcm93RGVmYXVsdCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgZW5hYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRGbGFncyA9IGlzR2FtZXRlRGlzYWJsZWQgPyBnYW1ldGVzLm1hcChnID0+IGlzR2FtZXRlRGlzYWJsZWQoZykpIDogW10sXG4gICAgICB0b3RhbERpc2FibGVkQ291bnQgPSBkaXNhYmxlZEZsYWdzLnJlZHVjZSgodG90YWwsZmxhZykgPT4gdG90YWwgKyBmbGFnLCAwKSxcbiAgICAgIC8vIGxlYXZlIHJvb20gZm9yIHRoZSBkaXNhYmxlZCBnYW1ldGUgcm93IGlmIHRoZXJlIGFyZSBkaXNhYmxlZCBnYW1ldGVzXG4gICAgICBhdmFpbGFibGVIZWlnaHQgPSBoZWlnaHQgLSAodG90YWxEaXNhYmxlZENvdW50ID8gc3BhY2luZ0RlZmF1bHQgOiAwKSAtIDQgKiBtYXJnaW4sXG4gICAgICAvLyBwYWNrIHRoZSBkaXNhYmxlZCBnYW1ldGVzIGludG8gdGhlIGRpc2FibGVkIHJvd1xuICAgICAgeERpc2FibGVkU3BhY2luZyA9IE1hdGgubWluKHhTcGFjaW5nIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod2lkdGggLSA3ICogbWFyZ2luKSAvIHRvdGFsRGlzYWJsZWRDb3VudCksXG4gICAgICB5RGlzYWJsZWRTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB0b3RhbEVuYWJsZWRDb3VudCA9IGdhbWV0ZUNvdW50IC0gdG90YWxEaXNhYmxlZENvdW50LFxuICAgICAgZ2FtZXRlVmlld3M7XG5cbiAgLy8gc3F1ZWV6ZSBpbiB0byBtYWtlIHJvb20gZm9yIGFkZGl0aW9uYWwgZ2FtZXRlcyBpZiBuZWNlc3NhcnlcbiAgdmFyIGNvbENvdW50ID0gY29sRGVmYXVsdCxcbiAgICAgIHJvd0NvdW50ID0gcm93RGVmYXVsdCAtICh0b3RhbERpc2FibGVkQ291bnQgPiAwKTtcbiAgd2hpbGUgKGNvbENvdW50ICogcm93Q291bnQgPCB0b3RhbEVuYWJsZWRDb3VudCkge1xuICAgIGlmICh5U3BhY2luZyA+IHhTcGFjaW5nKSB7XG4gICAgICB5U3BhY2luZyA9IGF2YWlsYWJsZUhlaWdodCAvICsrcm93Q291bnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeFNwYWNpbmcgPSAod2lkdGggLSA0ICogbWFyZ2luKSAvICsrY29sQ291bnQ7XG4gICAgfVxuICB9XG5cbiAgZ2FtZXRlVmlld3MgPSBnYW1ldGVzLm1hcCgoZ2FtZXRlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBkaXNhYmxlZEZsYWdzW2luZGV4XSxcbiAgICAgICAgICBsYXlvdXRJbmRleCA9IGlzRGlzYWJsZWQgPyBkaXNhYmxlZENvdW50KysgOiBlbmFibGVkQ291bnQrKyxcbiAgICAgICAgICByb3cgPSBpc0Rpc2FibGVkID8gcm93RGVmYXVsdCAtIDEgOiBNYXRoLmZsb29yKGxheW91dEluZGV4IC8gY29sQ291bnQpLFxuICAgICAgICAgIGNvbCA9IGlzRGlzYWJsZWQgPyBsYXlvdXRJbmRleCA6IGxheW91dEluZGV4ICUgY29sQ291bnQsXG4gICAgICAgICAgeSA9IGlzRGlzYWJsZWQgPyByb3cgKiB5RGlzYWJsZWRTcGFjaW5nIDogcm93ICogeVNwYWNpbmcsXG4gICAgICAgICAgeCA9IGlzRGlzYWJsZWQgPyBjb2wgKiB4RGlzYWJsZWRTcGFjaW5nIDogY29sICogeFNwYWNpbmc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpbmRleCArIDF9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXt7IHg6IE1hdGgucm91bmQod2lkdGgvMiksIHk6IC1NYXRoLnJvdW5kKHlTcGFjaW5nKSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5PXt7IHg6IE1hdGgucm91bmQoeCksIHk6IE1hdGgucm91bmQoeSkgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggKyAxID09PSBzZWxlY3RlZElkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkdhbWV0ZVNlbGVjdGVkfSAvPlxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdhbWV0ZS1wb29sXCIgc3R5bGU9e3sgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9fT5cbiAgICAgIHsgZ2FtZXRlVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlUG9vbFZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgYW5pbVN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlcixcbiAgc2VsZWN0ZWRJZDogUHJvcFR5cGVzLm51bWJlcixcbiAgaXNHYW1ldGVEaXNhYmxlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uR2FtZXRlU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVQb29sVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBhIEJpb2xvZ2ljYSBnYW1ldGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gaW5kaXZpZHVhbCBhbGxlbGVzIG9mIGdlbmVzIGZvciB3aGljaCBhbGwgYWxsZWxlcyBzaG91bGQgYmUgaGlkZGVuXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5jb25zdCBHYW1ldGVWaWV3ID0gKHtnYW1ldGUsIGlkLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNwbGF5LCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgcmVjdCA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoIWlzRGlzYWJsZWQgJiYgb25DbGljaykge1xuICAgICAgb25DbGljayhldnQsIGlkLCByZWN0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKSB7XG4gICAgbGV0IHRvb2x0aXAgPSBcIlwiLFxuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzO1xuICAgIC8vIE5vdGU6IGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IGZvciB0aGUgY2FsbGVyIHRvIHBhc3MgaW4gdGhlXG4gICAgLy8gYWxsSGlkZGVuQWxsZWxlcyBhcnJheSByYXRoZXIgdGhhbiBjb21wdXRpbmcgaXQgZWFjaCB0aW1lIGhlcmUuXG4gICAgLy8gQnV0IGlmIHdlIG1vdmVkIGl0IG91dCByaWdodCBub3cgd2UnZCBoYXZlIHRvIGVsaW1pbmF0ZSB0aGUgRVM2IHNwbGF0LlxuICAgIGZ1bmN0aW9uIGNvbmNhdEhpZGRlbkFsbGVsZXMoaVNwZWNpZXMsIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICBhbGxIaWRkZW5BbGxlbGVzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShpU3BlY2llcywgYWxsZWxlKTtcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcy5wdXNoKC4uLmdlbmUuYWxsZWxlcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgY2ggaW4gZ2FtZXRlKSB7XG4gICAgICB2YXIgY2hyb21vc29tZSA9IGdhbWV0ZVtjaF07XG4gICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcyA9PSBudWxsKVxuICAgICAgICBjb25jYXRIaWRkZW5BbGxlbGVzKGNocm9tb3NvbWUuc3BlY2llcywgaGlkZGVuQWxsZWxlcyk7XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBjaHJvbW9zb21lLmFsbGVsZXMpIHtcbiAgICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMuaW5kZXhPZihhbGxlbGUpIDwgMCkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gY2hyb21vc29tZS5zcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgbGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PT0gJ1hZJykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNocm9tb3NvbWUuc2lkZSA9PT0gJ3knID8gJ3knIDogJ3gnO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENsYXNzID0gaXNTZWxlY3RlZCAmJiAhaXNEaXNhYmxlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkQ2xhc3MgPSBpc0Rpc2FibGVkID8gXCJkaXNhYmxlZFwiIDogXCJcIixcbiAgICAgICAgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBjbGFzc2VzID0gYGdlbmlibG9ja3MgZ2FtZXRlICR7c2VsZWN0ZWRDbGFzc30gJHtkaXNhYmxlZENsYXNzfSBncm91cCR7Z3JvdXB9YCxcbiAgICAgICAgc2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgcm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgdHJhbnNmb3JtID0gcm90YXRpb24gPyBgcm90YXRlKCR7cm90YXRpb259ZGVnKWAgOiAnJyxcbiAgICAgICAgb3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICB0b29sdGlwID0gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHRpdGxlPXt0b29sdGlwfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LngsIHRvcDogZGlzcGxheS55LFxuICAgICAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybSwgb3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgR2VuZUxhYmVsVmlldyA9ICh7c3BlY2llcywgYWxsZWxlLCBlZGl0YWJsZT1mYWxzZSwgb25BbGxlbGVDaGFuZ2V9KSA9PiB7XG4gIGlmICghZWRpdGFibGUpIHtcbiAgICBjb25zdCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2VuZS1sYWJlbCBhbGxlbGUgbm9uZWRpdGFibGVcIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgeyBhbGxlbGVOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhbGxlbGVzID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIGFsbGVsZU9wdGlvbnMgPSBhbGxlbGVOYW1lcy5tYXAoKG5hbWUsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZXNbaV19PntuYW1lfTwvb3B0aW9uPilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbmUtbGFiZWwgYWxsZWxlIGVkaXRhYmxlXCI+XG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBhbGxlbGUgfSBvbkNoYW5nZT17IG9uQWxsZWxlQ2hhbmdlIH0+XG4gICAgICAgICAgeyBhbGxlbGVPcHRpb25zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5HZW5lTGFiZWxWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBhbGxlbGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZWRpdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVMYWJlbFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG5sZXQgVGVzdFB1bGxkb3duVmlldyA9ICh7c3BlY2llcywgZ2VuZSwgc2VsZWN0aW9uLCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgICAgIGxldCBhbGxlbGVzID0gZ2VuZS5hbGxlbGVzLFxuICAgICAgICAgIGFsbGVsZU5hbWVzID0gYWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgICBudW1BbGxlbGVzID0gYWxsZWxlTmFtZXMubGVuZ3RoLFxuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zID0gW10sXG4gICAgICAgICAgY3VycmVudFNlbGVjdGlvbiA9IHNlbGVjdGlvbiB8fCBcInBsYWNlaG9sZGVyXCIsXG4gICAgICAgICAgaSwgajtcblxuICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT1cInBsYWNlaG9sZGVyXCIgdmFsdWU9XCJwbGFjZWhvbGRlclwiIGRpc2FibGVkPVwiZGlzYWJsZWRcIj5TZWxlY3QgYSBHZW5vdHlwZTwvb3B0aW9uPik7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1BbGxlbGVzOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gaTsgaiA8IG51bUFsbGVsZXM7IGorKykge1xuICAgICAgICAgIGxldCBrZXkgPSBpICsgXCIgXCIgKyBqLFxuICAgICAgICAgICAgICBzdHJpbmcgPSBhbGxlbGVOYW1lc1tpXSArIFwiIC8gXCIgKyBhbGxlbGVOYW1lc1tqXTtcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtrZXl9PntzdHJpbmd9PC9vcHRpb24+KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdC13cmFwcGVyXCI+XG4gICAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGN1cnJlbnRTZWxlY3Rpb24gfSBvbkNoYW5nZT17IG9uU2VsZWN0aW9uQ2hhbmdlIH0+XG4gICAgICAgICAgICB7IHBvc3NpYmxlQ29tYm9zIH1cbiAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH07XG5cbmNvbnN0IEdlbm9tZVRlc3RWaWV3ID0gKHtvcmcsIGhpZGRlbkFsbGVsZXM9W10sIHNlbGVjdGlvbj17fSwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgYWxsZWxlcyA9IGNocm9tW09iamVjdC5rZXlzKGNocm9tKVswXV0uYWxsZWxlcyxcbiAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgICBnZW5lcyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUob3JnLnNwZWNpZXMsIGEpKSxcbiAgICAgICAgcHVsbGRvd25zID0gZ2VuZXMubWFwKGcgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8VGVzdFB1bGxkb3duVmlld1xuICAgICAgICAgICAgICBrZXkgICAgICAgPSB7IGcubmFtZSB9XG4gICAgICAgICAgICAgIHNwZWNpZXMgICA9IHsgb3JnLnNwZWNpZXMgfVxuICAgICAgICAgICAgICBnZW5lICAgICAgPSB7IGcgfVxuICAgICAgICAgICAgICBzZWxlY3Rpb24gPSB7IHNlbGVjdGlvbltnLm5hbWVdIH1cbiAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UgPSB7IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UoZywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgfSB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1zXCIga2V5PXtjaHJvbW9zb21lTmFtZX0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2Vub21lLXRlc3Qtb3B0aW9uc1wiPlxuICAgICAgICAgIHsgcHVsbGRvd25zIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbm9tZS10ZXN0XCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5UZXN0UHVsbGRvd25WaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBnZW5lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHNlbGVjdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbkdlbm9tZVRlc3RWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgc2VsZWN0aW9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVGVzdFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lVmlldyBmcm9tICcuL2Nocm9tb3NvbWUnO1xuXG4vKipcbiAqIFZpZXcgb2YgdGhlIHNldCBvZiBjaHJvbW9zb21lcyBvZiBhbiBvcmdhbmlzbSwgb3JkZXJlZCBhcyBtYXRjaGVkIHBhaXJzLlxuICpcbiAqIFVzdWFsbHkgZGVmaW5lZCBieSBwYXNzaW5nIGluIGEgQmlvbG9naWNhIE9yZ2FuaXNtLCBidXQgbWF5IGFsc28gYmUgZGVmaW5lZCBieVxuICogcGFzc2luZyBpbiBhIG1hcCBvZiBCaW9sb2dpY2EgQ2hyb21vc29tZXMgYW5kIGEgQmlvbG9naWNhIFNwZWNpZXMuXG4gKi9cbmNvbnN0IEdlbm9tZVZpZXcgPSAoe29yZywgY2xhc3NOYW1lPVwiXCIsIGNocm9tb3NvbWVzLCBzcGVjaWVzLCBoaWRkZW5BbGxlbGVzID0gW10sIGVkaXRhYmxlPXRydWUsIHNob3dMYWJlbHM9dHJ1ZSwgc2hvd0FsbGVsZXM9ZmFsc2UsIHNlbGVjdGVkQ2hyb21vc29tZXM9e30sIHNtYWxsPWZhbHNlLCBvcmdOYW1lLCBkaXNwbGF5U3R5bGUsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZH0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBpZiAob3JnKSB7XG4gICAgY2hyb21vc29tZXMgPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXM7XG4gICAgc3BlY2llcyA9IG9yZy5zcGVjaWVzO1xuICB9XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIHNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBwYWlycyA9IFtdO1xuICAgIGZvciAobGV0IHNpZGUgaW4gY2hyb20pIHtcbiAgICAgIGxldCBjaHJvbW9zb21lID0gY2hyb21bc2lkZV07XG4gICAgICBwYWlycy5wdXNoKFxuICAgICAgICA8Q2hyb21vc29tZVZpZXdcbiAgICAgICAgICBjaHJvbW9zb21lPXtjaHJvbW9zb21lfVxuICAgICAgICAgIGtleT17cGFpcnMubGVuZ3RoICsgMX1cbiAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgIGxhYmVsc09uUmlnaHQ9e3BhaXJzLmxlbmd0aD4wIHx8IHNpZGU9PT1cImJcIn1cbiAgICAgICAgICBlZGl0YWJsZT17ZWRpdGFibGV9XG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdID09PSBzaWRlfVxuICAgICAgICAgIHNob3dMYWJlbHM9e3Nob3dMYWJlbHN9XG4gICAgICAgICAgc2hvd0FsbGVsZXM9e3Nob3dBbGxlbGVzfVxuICAgICAgICAgIHNtYWxsPXtzbWFsbH1cbiAgICAgICAgICBvcmdOYW1lPXtvcmdOYW1lfVxuICAgICAgICAgIGRpc3BsYXlTdHlsZT17ZGlzcGxheVN0eWxlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlKGNocm9tb3NvbWVOYW1lLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25DaHJvbW9zb21lU2VsZWN0ZWQ9e2Z1bmN0aW9uKGVsKXtcbiAgICAgICAgICAgIGlmIChvbkNocm9tb3NvbWVTZWxlY3RlZClcbiAgICAgICAgICAgICAgb25DaHJvbW9zb21lU2VsZWN0ZWQob3JnLCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgZWwpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICk7XG4gICAgfVxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtcGFpclwiIGtleT17cGFpcldyYXBwZXJzLmxlbmd0aCArIDF9PlxuICAgICAgICB7IHBhaXJzIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgY29uc3QgY2xhc3NlcyA9IFwiZ2VuaWJsb2NrcyBnZW5vbWVcIiArIChjbGFzc05hbWUgPyBcIiBcIiArIGNsYXNzTmFtZSA6IFwiXCIpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfT5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdlbm9tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2hyb21vc29tZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dMYWJlbHM6IFByb3BUeXBlcy5ib29sLFxuICBzaG93QWxsZWxlczogUHJvcFR5cGVzLmJvb2wsXG4gIHNlbGVjdGVkQ2hyb21vc29tZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHNtYWxsOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNocm9tb3NvbWVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZ05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5cbmNvbnN0IEdsb3dCYWNrZ3JvdW5kVmlldyA9ICh7aWQsIGNvbG9yLCBzaXplLCBjb250YWluZXJTdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCBDaGlsZENvbXBvbmVudCwgY2hpbGRTdHlsZT17fSwgLi4ub3RoZXJzfSkgPT4ge1xuICBjb25zdCB0Q29udGFpbmVyU3R5bGUgPSB7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLCAuLi5jb250YWluZXJTdHlsZSB9LFxuICAgICAgICB0R2xvd1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uZ2xvd1N0eWxlIH0sXG4gICAgICAgIHRDaGlsZFN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uY2hpbGRTdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdsb3ctYmFja2dyb3VuZFwiIHN0eWxlPXt0Q29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgaWQ9eydnbG93LScraWR9IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e3RHbG93U3R5bGV9Lz5cbiAgICAgIDxDaGlsZENvbXBvbmVudCBpZD17J2NoaWxkLScraWR9IHN0eWxlPXt0Q2hpbGRTdHlsZX0gd2lkdGg9e3NpemV9IHsuLi5vdGhlcnN9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HbG93QmFja2dyb3VuZFZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGNvbnRhaW5lclN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBnbG93U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIENoaWxkQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBjaGlsZFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbG93QmFja2dyb3VuZFZpZXc7XG4iLCIvKlxuICogQmFzZWQgb24gUmVhY3RPdmVybGF5cyBkZW1vIGF0IGh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL3JlYWN0LW92ZXJsYXlzL2V4YW1wbGVzLyNtb2RhbHNcbiAqL1xuaW1wb3J0IE1vZGFsIGZyb20gJ3JlYWN0LW92ZXJsYXlzL2xpYi9Nb2RhbCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCBDaGFsbGVuZ2VBd2FyZFZpZXcgZnJvbSAnLi9jaGFsbGVuZ2UtYXdhcmQnO1xuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0IGZyb20gJy4uL3V0aWxpdGllcy90cmFuc2xhdGUnO1xuXG5jb25zdCBtb2RhbFN0eWxlID0ge1xuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiAxMDQwLFxuICB0b3A6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDBcbn07XG5cbmNvbnN0IGJhY2tkcm9wU3R5bGUgPSB7XG4gIC4uLm1vZGFsU3R5bGUsXG4gIHpJbmRleDogJ2F1dG8nLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJyxcbiAgb3BhY2l0eTogMC4xXG59O1xuXG5jb25zdCBkaWFsb2dTdHlsZSA9IGZ1bmN0aW9uKHRvcD1cIjUwJVwiKSB7XG4gIC8vIHdlIHVzZSBzb21lIHBzZXVkbyByYW5kb20gY29vcmRzIHNvIG5lc3RlZCBtb2RhbHNcbiAgLy8gZG9uJ3Qgc2l0IHJpZ2h0IG9uIHRvcCBvZiBlYWNoIG90aGVyLlxuICBsZXQgbGVmdCA9IDUwO1xuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAzODUsXG4gICAgdG9wOiB0b3AsIGxlZnQ6IGxlZnQgKyAnJScsXG4gICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC0ke2xlZnR9JSlgLFxuICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChyZXNvdXJjZXMvaW1hZ2VzL3BhcmNobWVudC5qcGcpJyxcbiAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcbiAgICBiYWNrZ3JvdW5kT3JpZ2luOiAnYm9yZGVyLWJveCcsXG4gICAgYm94U2hhZG93OiAnMCAxMHB4IDVweCByZ2JhKDAsMCwwLC41KScsXG4gICAgcGFkZGluZzogMjAsXG4gICAgb3V0bGluZTogJ25vbmUnXG4gIH07XG59O1xuXG5cbmNsYXNzIE1vZGFsQWxlcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2hvdzogUHJvcFR5cGVzLmJvb2wsXG4gICAgbWVzc2FnZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSksXG4gICAgZXhwbGFuYXRpb246IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgIGxlZnRCdXR0b246IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSksXG4gICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0pLFxuICAgIHJpZ2h0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICBvbkhpZGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uTGVmdEJ1dHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG9wdGlvbmFsIGNsaWNrIGhhbmRsZXJzIGlmIG5vdCBkZWZpbmVkXG4gICAgb25SaWdodEJ1dHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgLy8gaW4gYnV0dG9uIHByb3BzLiAoQmV0dGVyIGZvciBgbWFwRGlzcGF0Y2hUb1Byb3BzYClcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdG9wOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNob3c6IGZhbHNlLFxuICAgIGNoYWxsZW5nZUF3YXJkczogeyBpZDowLCBwcm9ncmVzczogW10gfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8qIGVzbGludCByZWFjdC9qc3gtaGFuZGxlci1uYW1lczogMCAqL1xuICAgIGNvbnN0IGxlZnRQcm9wcyA9IHRoaXMucHJvcHMubGVmdEJ1dHRvbiB8fCB7fSxcbiAgICAgICAgICBsZWZ0QnV0dG9uID0gbGVmdFByb3BzLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxCdXR0b24gbGFiZWw9e2xlZnRQcm9wcy5sYWJlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFsZXJ0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17bGVmdFByb3BzLm9uQ2xpY2sgfHwgdGhpcy5wcm9wcy5vbkxlZnRCdXR0b25DbGlja30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIHJpZ2h0UHJvcHMgPSB0aGlzLnByb3BzLnJpZ2h0QnV0dG9uIHx8IHt9LFxuICAgICAgICAgIHJpZ2h0QnV0dG9uID0gPEJ1dHRvbiBsYWJlbD17cmlnaHRQcm9wcy5sYWJlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhbGVydC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtyaWdodFByb3BzLm9uQ2xpY2sgfHwgdGhpcy5wcm9wcy5vblJpZ2h0QnV0dG9uQ2xpY2t9Lz47XG4gICAgdmFyIGF3YXJkVmlldywgZXhwbGFuYXRpb25WaWV3O1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzKXtcbiAgICAgIGF3YXJkVmlldyA9IDxDaGFsbGVuZ2VBd2FyZFZpZXcgY2hhbGxlbmdlQXdhcmRzPXt0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkc30gLz47XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLmV4cGxhbmF0aW9uKSB7XG4gICAgICBleHBsYW5hdGlvblZpZXcgPSA8cD57dCh0aGlzLnByb3BzLmV4cGxhbmF0aW9uKX08L3A+O1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPE1vZGFsICBhcmlhLWxhYmVsbGVkYnk9J21vZGFsLWxhYmVsJ1xuICAgICAgICAgICAgICBzdHlsZT17bW9kYWxTdHlsZX1cbiAgICAgICAgICAgICAgYmFja2Ryb3BTdHlsZT17YmFja2Ryb3BTdHlsZX1cbiAgICAgICAgICAgICAgc2hvdz17dGhpcy5wcm9wcy5zaG93fVxuICAgICAgICAgICAgICBvbkhpZGU9e3RoaXMucHJvcHMub25IaWRlfSA+XG4gICAgICAgIDxkaXYgc3R5bGU9e2RpYWxvZ1N0eWxlKHRoaXMucHJvcHMudG9wKX0gPlxuICAgICAgICAgIDxoNCBpZD0nbW9kYWwtbGFiZWwnPnt0KHRoaXMucHJvcHMubWVzc2FnZSl9PC9oND5cbiAgICAgICAgICB7YXdhcmRWaWV3fVxuICAgICAgICAgIHtleHBsYW5hdGlvblZpZXd9XG4gICAgICAgICAge2xlZnRCdXR0b259IHtyaWdodEJ1dHRvbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L01vZGFsPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kYWxBbGVydDtcblxuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG4vKipcbiAqIFByZXNlbnRzIGVpdGhlciBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBvciBhIHNpbXBsZSBudW1iZXIgd2l0aGluIGEgc3F1YXJlIGJvcmRlci5cbiAqIERlc2lnbmVkIHRvIGJlIHVzZWQgYXMgdHJpYWwgZmVlZGJhY2sgaW5kaWNhdGluZyB0aGUgbnVtYmVyIG9mIHRyaWFscyBzdWNjZXNzZnVsbHlcbiAqIGNvbXBsZXRlZCwgZm9yIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIGEgdW5pcXVlIGlkIGZvciBDU1MgcHVycG9zZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgLSBDU1MgY2xhc3MgdG8gYmUgYXBwbGllZFxuICogQHBhcmFtIHtudW1iZXJ9IG9yZGluYWwgLSB0aGUgbnVtZXJpYyB2YWx1ZSB0byBiZSByZXByZXNlbnRlZCBpZiBubyBvcmdhbmlzbSBzcGVjaWZpZWRcbiAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSBvcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdmlld1xuICovXG5jb25zdCBPcmRpbmFsT3JnYW5pc21WaWV3ID0gKHtpZCwgY2xhc3NOYW1lLCBvcmRpbmFsLCBvcmdhbmlzbSwgc2l6ZT0zMiwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0geyB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplIH0sXG4gICAgICAgIG9yZ1ZpZXcgPSBvcmdhbmlzbSAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgID8gPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gb3JnPXtvcmdhbmlzbX0gd2lkdGg9e3NpemV9IHsuLi5vdGhlcn0gLz5cbiAgICAgICAgICAgICAgICAgICAgOiA8ZGl2IGNsYXNzTmFtZT0nb3JkaW5hbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7b3JkaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj47XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmRpbmFsLW9yZ2FuaXNtICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICB7IG9yZ1ZpZXcgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JkaW5hbE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9yZGluYWw6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9yZ2FuaXNtOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmRpbmFsT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQmlvTG9naWNhIG9yZ2FuaXNtIGFzIGFuIGltYWdlIG9uIHRvcCBvZiBhIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQuXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gb3JnIC0gdGhlIG9yZ2FuaXNtIHRvIGJlIHJlcHJlc2VudGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB0aGUgY29sb3Igb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQgdmlldy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gKi9cbmNvbnN0IE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2lkPSdvcmctZ2xvdycsIGNsYXNzTmFtZT0nJywgY29sb3I9XCIjRkZGRkFBXCIsIHNpemU9MjAwLCBzdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBsb2NhbEdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmdsb3dTdHlsZSB9LFxuICAgICAgICBvcmdTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLnN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmdhbmlzbS1nbG93ICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17YCR7aWR9LWdsb3dgfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtsb2NhbEdsb3dTdHlsZX0vPlxuICAgICAgPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gd2lkdGg9e3NpemV9IHN0eWxlPXtvcmdTdHlsZX0gey4uLm90aGVyfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2xvd1N0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgY2xhc3NOYW1lPVwiXCIsIHdpZHRoPTIwMCwgZmxpcHBlZD1mYWxzZSwgc3R5bGU9e30sIG9uQ2xpY2ssIHdyYXBwZXIgfSkgPT4ge1xuICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL2dlbml2ZXJzZS1yZXNvdXJjZXMuY29uY29yZC5vcmcvcmVzb3VyY2VzL2RyYWtlcy9pbWFnZXMvXCIsXG4gICAgICAgIHVybCAgICAgPSBvcmcgPyBiYXNlVXJsICsgb3JnLmdldEltYWdlTmFtZSgpIDogbnVsbCxcbiAgICAgICAgLy8gVGhlIGdvYWwgaGVyZSB3YXMgdG8gaGF2ZSB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBzZWxlY3QgdGhlIG9yZ2FuaXNtLFxuICAgICAgICAvLyBzbyB0aGF0IG1vdXNlZG93bi1kcmFnIHdpbGwgYm90aCBzZWxlY3QgdGhlIG9yZ2FuaXNtIGFuZCBiZWdpbiB0aGVcbiAgICAgICAgLy8gZHJhZy4gVGhpcyB3b3JrcyBvbiBDaHJvbWUgYW5kIFNhZmFyaSwgYnV0IG9uIEZpcmVmb3ggaXQgZGlzYWJsZXNcbiAgICAgICAgLy8gZHJhZ2dpbmcuIERpc2FibGluZyB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBtZWFucyB0aGF0IEZpcmVmb3ggdXNlcnNcbiAgICAgICAgLy8gbXVzdCBjbGljayB0byBzZWxlY3QgYW5kIHRoZW4gY2xpY2sgdG8gZHJhZywgYnV0IGF0IGxlYXN0IHRoZXkgY2FuXG4gICAgICAgIC8vIGRyYWcuIFRoZSByaWdodCBzb2x1dGlvbiBpcyBwcm9iYWJseSB0byBhbGxvdyBvcmdhbmlzbXMgdG8gYmUgZHJhZ2dlZFxuICAgICAgICAvLyB3aGV0aGVyIG9yIG5vdCB0aGV5J3JlIHNlbGVjdGVkIGFuZCB0aGVuIGhvcGVmdWxseSB0aGUgb25Nb3VzZURvd25cbiAgICAgICAgLy8gaGFuZGxlciB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQuIE90aGVyd2lzZSwgaXQgbWF5IGJlIG5lY2Vzc2FyeSB0b1xuICAgICAgICAvLyBzZWxlY3QgdGhlIG9yZ2FuaXNtIChpZiBpdCBpc24ndCBhbHJlYWR5IHNlbGVjdGVkKSBpbiBiZWdpbkRyYWcuXG4gICAgICAgIGlzRmlyZWZveCA9IChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID49IDApLFxuICAgICAgICBoYW5kbGVNb3VzZURvd24gPSBpc0ZpcmVmb3ggPyB1bmRlZmluZWQgOiBoYW5kbGVDbGljayxcbiAgICAgICAgZGl2V3JhcHBlciA9IHdyYXBwZXIgfHwgZnVuY3Rpb24oZWx0KSB7IHJldHVybiBlbHQ7IH07XG5cbiAgbGV0IGNsYXNzZXMgPSBcImdlbmlibG9ja3Mgb3JnYW5pc21cIiArIChjbGFzc05hbWUgPyBcIiBcIiArIGNsYXNzTmFtZSA6IFwiXCIpO1xuICBpZiAoZmxpcHBlZCkge1xuICAgIGNsYXNzZXMgKz0gXCIgZmxpcHBlZFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaWQsIG9yZyk7XG4gIH1cblxuICByZXR1cm4gZGl2V3JhcHBlcihcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gaWQ9e2lkfSBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgb25Nb3VzZURvd249e29uQ2xpY2sgPyBoYW5kbGVNb3VzZURvd24gOiBudWxsfVxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2sgPyBoYW5kbGVDbGljayA6IG51bGx9PlxuICAgICAge3VybCA/IDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0gLz4gOiBudWxsfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICB3cmFwcGVyOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUGVuVmlldyBmcm9tICcuL3Blbic7XG5pbXBvcnQgU3RhdHNWaWV3IGZyb20gJy4vc3RhdHMnO1xuaW1wb3J0IFRhYnMgZnJvbSAncmVhY3Qtc2ltcGxldGFicyc7XG5cbmNsYXNzIFBlblN0YXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGxhc3RDbHV0Y2hTaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG9yZ3MsIGxhc3RDbHV0Y2hTaXplLCBzZWxlY3RlZEluZGV4LCBvblNlbGVjdGlvbkNoYW5nZSwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGxhc3RDbHV0Y2ggPSBvcmdzLnNsaWNlKC1sYXN0Q2x1dGNoU2l6ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRhYnM+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiQnJlZWRpbmcgUGVuXCIga2V5PVwiQnJlZWRpbmcgUGVuXCI+XG4gICAgICAgICAgPFBlblZpZXcgb3Jncz17bGFzdENsdXRjaH0gey4uLm90aGVyc31cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg9e3NlbGVjdGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtmdW5jdGlvbihpU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob25TZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UoaVNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgICA8VGFicy5QYW5lbCB0aXRsZT1cIlN0YXRzXCIga2V5PVwiU3RhdHNcIj5cbiAgICAgICAgICA8U3RhdHNWaWV3IG9yZ3M9e29yZ3N9IGxhc3RDbHV0Y2hTaXplPXtsYXN0Q2x1dGNoU2l6ZX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVuU3RhdHNWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dzIC0gT3B0aW9uIG51bWJlciBvZiByb3dzLiBJZiBkZWZpbmVkLCBpdCB3aWxsIGJlIGZpeGVkIGF0IHRoYXQuIE90aGVyd2lzZSwgaXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCBkZWZhdWx0IHRvIDEgd2hlbiB0aGVyZSBhcmUgbm8gb3JncywgYW5kIGdyb3dzIGFzIG1vcmUgcm93cyBhcmUgbmVlZGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IHRpZ2h0ZW5Sb3dzIC0gSWYgZ2l2ZW4sIHdpbGwgc2hyaW5rIHRoZSB2ZXJ0aWNhbCBoZWlnaHQgb2YgdGhlIHBlbiBieSB0aGlzIGFtb3VudFxuICogICAgICAgICAgICAgICAgICAgICAgICBwZXIgcm93LCBjcm93ZGluZyB0aGUgb3JnIGltYWdlcyBhcyBuZWVkZWQuXG4gKi9cbmNvbnN0IFBlblZpZXcgPSAoe29yZ3MsIGlkUHJlZml4PSdvcmdhbmlzbS0nLCB3aWR0aD00MDAsIGNvbHVtbnM9NSwgcm93cywgdGlnaHRlblJvd3M9MCwgdGlnaHRlbkNvbHVtbnM9MCwgU2VsZWN0ZWRPcmdhbmlzbVZpZXc9T3JnYW5pc21WaWV3LCBzZWxlY3RlZEluZGV4LCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGlkLCBvcmcpIHtcbiAgICBjb25zdCBwcmVmaXhJbmRleCA9IGlkLmluZGV4T2YoaWRQcmVmaXgpLFxuICAgICAgICAgIGluZGV4ID0gTnVtYmVyKGlkLnN1YnN0cihwcmVmaXhJbmRleCArIGlkUHJlZml4Lmxlbmd0aCkpO1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGluZGV4LCBpZCwgb3JnKTtcbiAgfVxuXG4gIGxldCBvcmdTdHlsZSA9IHtcbiAgICBtYXJnaW46IGAkey10aWdodGVuUm93cy8yfXB4ICR7LXRpZ2h0ZW5Db2x1bW5zLzJ9cHhgXG4gIH07XG5cbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZywgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09PSBzZWxlY3RlZEluZGV4XG4gICAgICAgICAgICAgICAgPyA8U2VsZWN0ZWRPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZFByZWZpeCArIGluZGV4fSBpbmRleD17aW5kZXh9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cIiNGRkZGQUFcIiBzaXplPXtvcmdXaWR0aH0gc3R5bGU9e29yZ1N0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30vPlxuICAgICAgICAgICAgICAgIDogPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkUHJlZml4ICsgaW5kZXh9IGluZGV4PXtpbmRleH0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e29yZ1dpZHRofSBzdHlsZT17b3JnU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSAvPjtcbiAgICAgIH0pO1xuXG4gIHJvd3MgPSByb3dzIHx8IE1hdGguY2VpbChvcmdWaWV3cy5sZW5ndGggLyBjb2x1bW5zKSB8fCAxO1xuXG4gIGxldCBoZWlnaHQgPSBvcmdXaWR0aCAqIHJvd3M7XG5cbiAgd2lkdGggID0gd2lkdGggIC0gKHRpZ2h0ZW5Db2x1bW5zICogY29sdW1ucyk7XG4gIGhlaWdodCA9IGhlaWdodCAtICh0aWdodGVuUm93cyAqIHJvd3MpO1xuXG4gIGxldCBzdHlsZSA9IHsgd2lkdGgsIGhlaWdodCB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHBlblwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIHJvd3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRpZ2h0ZW5Db2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0aWdodGVuUm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgU2VsZWN0ZWRPcmdhbmlzbVZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcblxuY29uc3QgUXVlc3Rpb25HbG93VmlldyA9ICh7Z2xvd0NvbG9yLCBzaXplPTIwMH0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBnbG93U3R5bGUgPSB7cG9zaXRpb246ICdhYnNvbHV0ZSd9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3dcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgY29sb3I9e2dsb3dDb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e2dsb3dTdHlsZX0vPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3cgcXVlc3Rpb24tbWFya1wiXG4gICAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiBcImFic29sdXRlXCIsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9fT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuICAvLyBIVE1MIHRleHQgbm9kZVxuICAvLzxkaXYgc3R5bGU9e3RTdHlsZX0+e3RleHR9PC9kaXY+XG5cbiAgLy8gU1ZHIHRleHQgbm9kZVxuICAvLzxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgLy8gIDx0ZXh0IHg9JzUwJyB5PScxNzUnIGZpbGw9JyMwRDBEOEMnIHN0eWxlPXt0U3R5bGV9PlxuICAvLyAgICB7dGV4dH1cbiAgLy8gIDwvdGV4dD5cbiAgLy88L3N2Zz5cbn07XG5cblF1ZXN0aW9uR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBnbG93Q29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtR2xvd1ZpZXcgZnJvbSAnLi9vcmdhbmlzbS1nbG93JztcbmltcG9ydCBRdWVzdGlvbkdsb3dWaWV3IGZyb20gJy4vcXVlc3Rpb24tZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyA9ICh7aGlkZGVuLCBjb2xvciwgc2l6ZSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IG9yZ1ZpZXcgPSA8T3JnYW5pc21HbG93VmlldyBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHsuLi5vdGhlcn0gLz4sXG4gICAgICAgIHF1ZXN0aW9uVmlldyA9IDxRdWVzdGlvbkdsb3dWaWV3IGdsb3dDb2xvcj17Y29sb3J9IHdpZHRoPXtzaXplfSAvPixcbiAgICAgICAgZmluYWxWaWV3ID0gaGlkZGVuID8gcXVlc3Rpb25WaWV3IDogb3JnVmlldztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBxdWVzdGlvbi1vcmdhbmlzbS1nbG93XCI+XG4gICAgICB7ZmluYWxWaWV3fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaGlkZGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBicmVlZGluZyBzdGF0aXN0aWNzIGZvciBhIHNldCBvZiBCaW9sb2dpY2Egb3JnYW5pc21zXG4gKiBAcGFyYW0ge09iamVjdFtdfSBvcmdzIC0gYXJyYXkgb2YgQmlvbG9naWNhIG9yZ2FuaXNtcyBmb3Igd2hpY2ggc3RhdGlzdGljcyBhcmUgdG8gYmUgZGlzcGxheWVkXG4gKiBAcGFyYW0ge09iamVjdH0gb3Jnc1tdLnBoZW5vdHlwZSAtIHRoZSBwaGVub3R5cGUgb2YgdGhlIEJpb2xvZ2ljYSBvcmdhbmlzbVxuICogQHBhcmFtIHtudW1iZXJ9IFtsYXN0Q2x1dGNoU2l6ZT1vcmdzLmxlbmd0aF0gLSB0aGUgbnVtYmVyIG9mIG9yZ2FuaXNtcyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSB0aGF0IGNvbXByaXNlIHRoZSBtb3N0IHJlY2VudCBjbHV0Y2hcbiAqL1xuY29uc3QgU3RhdHNWaWV3ID0gKHtvcmdzLCBsYXN0Q2x1dGNoU2l6ZX0pID0+IHtcblxuICBsZXQgdHJhaXRzID0gR2VuZXRpY3NVdGlscy5jb21wdXRlVHJhaXRDb3VudHNGb3JPcmdhbmlzbXMob3JncywgbGFzdENsdXRjaFNpemUpLFxuICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ3MubGVuZ3RoLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuY2x1dGNoW0Jpb0xvZ2ljYS5NQUxFXSxcbiAgICAgICAgICAgIGNGZW1hbGVzID0gY291bnRzLmNsdXRjaFtCaW9Mb2dpY2EuRkVNQUxFXSxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoMTAwICogY1RvdGFsIC8gY2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLk1BTEVdLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLkZFTUFMRV0sXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10cmFpdC12YWx1ZT17cm93LnZhbHVlfT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiIsIi8qXG4gKiBTZWUgaHR0cHM6Ly9tZWRpdW0uY29tL0BrZW50Y2RvZGRzL21pc3VuZGVyc3RhbmRpbmctZXM2LW1vZHVsZXMtdXBncmFkaW5nLWJhYmVsLXRlYXJzLWFuZC1hLXNvbHV0aW9uLWFkMmQ1YWI5M2NlMCMucTF2Y2tmZml3XG4gKiAoS2VudCBDLiBEb2RkcywgXCJNaXN1bmRlcnN0YW5kaW5nIEVTNiBNb2R1bGVzLCBVcGdyYWRpbmcgQmFiZWwsIFRlYXJzLCBhbmQgYSBTb2x1dGlvblwiKVxuICogZm9yIGRlc2NyaXB0aW9uIG9mIHNvbWUgb2YgdGhlIGRldGFpbHMgaW52b2x2ZWQgaW4gbWl4aW5nIEVTNiBleHBvcnQgd2l0aCByZXF1aXJlKCkuXG4gKi9cblxuLy8gY29tcG9uZW50c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVGaWx0ZXJzVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbGxlbGUtZmlsdGVycyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFsbGVsZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQW5pbWF0ZWRHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLW9yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmFza2V0U2V0VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9iYXNrZXQtc2V0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoYW5nZVNleEJ1dHRvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZUltYWdlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENpcmN1bGFyR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVnZ0NsdXRjaFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZWdnLWNsdXRjaCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlZWRiYWNrVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZWVkYmFjayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVQb29sVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nYW1ldGUtcG9vbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VuZUxhYmVsVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVGVzdFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5vbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdsb3dCYWNrZ3JvdW5kVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb2RhbEFsZXJ0IH0gZnJvbSAnLi9jb21wb25lbnRzL21vZGFsLWFsZXJ0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JkaW5hbE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmRpbmFsLW9yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL29yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9wZW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQZW5TdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuLXN0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdHMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFsbGVuZ2VBd2FyZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbGxlbmdlLWF3YXJkJztcblxuLy8gdXRpbGl0aWVzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmV0aWNzVXRpbHMgfSBmcm9tICcuL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG4iLCIvKipcbiAqIENsYXNzIHByb3ZpZGluZyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgQmlvTG9naWNhIGdlbmV0aWNzIG9wZXJhdGlvbnMuXG4gKiBJbiBzb21lIGNhc2VzIHRoZXNlIGFyZSBhZGFwdGVkIGZyb20gY29ycmVzcG9uZGluZyBjb2RlIGluIEdlbml2ZXJzZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXRpY3NVdGlscyB7XG5cbiAgc3RhdGljIGVuc3VyZVZhbGlkT3JnYW5pc20ob3JnT3JEZWYsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAob3JnT3JEZWYuZ2V0QWxsZWxlU3RyaW5nKSB7XG4gICAgICByZXR1cm4gb3JnT3JEZWY7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKHNwZWNpZXMsIG9yZ09yRGVmLmFsbGVsZVN0cmluZywgb3JnT3JEZWYuc2V4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXJzIG91dCBoaWRkZW4gYWxsZWxlcyBmcm9tIGFuIG9yaWdpbmFsIGxpc3Qgb2YgYWxsZWxlc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhbGxlbGVzIC0gdGhlIHNldCBvZiBhbGxlbGVzIHRvIGJlIGZpbHRlcmVkXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGhpZGRlbkFsbGVsZXMgLSB0aGUgYWxsZWxlcyBpZGVudGlmeWluZyB0aGUgaGlkZGVuIGdlbmVzXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLnNwZWNpZXN9IHNwZWNpZXMgLSB0aGUgc3BlY2llcyB0aGF0IGRlZmluZXMgdGhlIGdlbm90eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ1tdfSAtIHRoZSBmaWx0ZXJlZCBhbGxlbGVzXG4gICAqL1xuICBzdGF0aWMgZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBzcGVjaWVzKSB7XG4gICAgY29uc3QgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcChhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSkpO1xuICAgIHJldHVybiBhbGxlbGVzLmZpbHRlcihhID0+IHtcbiAgICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpO1xuICAgICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgYSBtYXAgb2YgdHJhaXRzIC0+IHRyYWl0VmFsdWVzIC0+IHRyYWl0Q291bnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbVtdfSBvcmdhbmlzbXMgLSB0aGUgc2V0IG9mIG9yZ2FuaXNtcyB0byBjb21wdXRlIHN0YXRzIGZvclxuICAgKiBAcGFyYW0ge251bWJlcn0gY2x1dGNoU2l6ZSAtIHRoZSBsYXN0ICdjbHV0Y2hTaXplJyBvcmdhbmlzbXMgYXJlIGFzc3VtZWQgdG8gYmUgdGhlIGxhc3QgY2x1dGNoXG4gICAqIEByZXR1cm4ge01hcH0gLSBlLmcuIHsgXCJ0YWlsXCI6IHsgXCJsb25nIHRhaWxcIjogeyBcImNsdXRjaFwiOiBbOSwgMTFdLCBcInRvdGFsXCI6IFs1MywgNDddIH19fVxuICAgKi9cbiAgc3RhdGljIGNvbXB1dGVUcmFpdENvdW50c0Zvck9yZ2FuaXNtcyhvcmdhbmlzbXMsIGxhc3RDbHV0Y2hTaXplKSB7XG4gICAgbGV0IHRyYWl0cyA9IG5ldyBNYXAsXG4gICAgICAgIGNsdXRjaFNpemUgPSBsYXN0Q2x1dGNoU2l6ZSB8fCBvcmdhbmlzbXMubGVuZ3RoO1xuXG4gICAgLy8gYWNjdW11bGF0ZSBzdGF0cyBmb3IgZWFjaCB0cmFpdC92YWx1ZSBjb21iaW5hdGlvblxuICAgIGZvciAoY29uc3QgW2luZGV4LCBvcmddIG9mIG9yZ2FuaXNtcy5lbnRyaWVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgdHJhaXQgb2YgT2JqZWN0LmtleXMob3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzW3RyYWl0XSxcbiAgICAgICAgICAgIHRyYWl0VmFsdWVzID0gdHJhaXRzLmdldCh0cmFpdCkgfHwgbmV3IE1hcCxcbiAgICAgICAgICAgIHZhbHVlQ291bnRzID0gdHJhaXRWYWx1ZXMuZ2V0KHZhbHVlKSB8fCB7IGNsdXRjaDogWzAsIDBdLCB0b3RhbDogWzAsIDBdIH07XG4gICAgICAgIGlmICghdHJhaXRzLmhhcyh0cmFpdCkpIHRyYWl0cy5zZXQodHJhaXQsIHRyYWl0VmFsdWVzKTtcbiAgICAgICAgaWYgKCF0cmFpdFZhbHVlcy5oYXModmFsdWUpKSB0cmFpdFZhbHVlcy5zZXQodmFsdWUsIHZhbHVlQ291bnRzKTtcbiAgICAgICAgLy8gbW9zdCByZWNlbnQgY2x1dGNoIGFzc3VtZWQgdG8gYmUgYXQgZW5kIG9mIG9yZ2FuaXNtcyBhcnJheVxuICAgICAgICBpZiAoaW5kZXggPj0gb3JnYW5pc21zLmxlbmd0aCAtIGNsdXRjaFNpemUpXG4gICAgICAgICAgKysgdmFsdWVDb3VudHMuY2x1dGNoW29yZy5zZXhdO1xuICAgICAgICArKyB2YWx1ZUNvdW50cy50b3RhbFtvcmcuc2V4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRyYWl0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbiBhbGxlbGUgc3RyaW5nIHRvIGEgSmF2YVNjcmlwdCBvYmplY3QgdGhhdCBtYXBzIGdlbmVzIHRvIGFsbGVsZXMuXG4gICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCBmb3IgY29tcGFyaXNvbiBwdXJwb3NlcywgZm9yIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEByZXR1cm4ge29iamVjdH0gLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybnM6IHthOlwiaFwiLCBiOlwiaFwifSwgYXJtb3I6IHthOlwiYVwiLCBiOlwiYVwifSwgLi4ufVxuICAgKi9cbiAgc3RhdGljIGJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZykge1xuICAgIGxldCBnZW5lTWFwID0ge30sXG4gICAgICAgIGFsbGVsZVN1YnN0cmluZ3MgPSBhbGxlbGVTdHJpbmcuc3BsaXQoXCIsXCIpO1xuICAgIGZvciAoY29uc3QgYWxsZWxlU3Vic3RyIG9mIGFsbGVsZVN1YnN0cmluZ3MpIHtcbiAgICAgIGNvbnN0IFtzaWRlLCBhbGxlbGVdID0gYWxsZWxlU3Vic3RyLnNwbGl0KFwiOlwiKSxcbiAgICAgICAgICAgIGdlbmUgPSBnZW5ldGljcy5nZW5lRm9yQWxsZWxlKGFsbGVsZSk7XG4gICAgICBpZiAoc2lkZSAmJiBhbGxlbGUgJiYgZ2VuZSkge1xuICAgICAgICBpZiAoIWdlbmVNYXBbZ2VuZV0pIGdlbmVNYXBbZ2VuZV0gPSB7fTtcbiAgICAgICAgZ2VuZU1hcFtnZW5lXVtzaWRlXSA9IGFsbGVsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdlbmVNYXA7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYW4gYWxsZWxlIHN0cmluZyBhbmQgYSBnZW5lIG1hcCBkZWZpbmluZyBhIHNldCBvZiBiYXNlIChkZWZhdWx0KSBhbGxlbGVzLFxuICAgKiByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgd2l0aCBtaXNzaW5nIGFsbGVsZXMgcmVwbGFjZWQgYnkgdGhlaXIgZGVmYXVsdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHBhcmFtIHtvYmplY3R9IGJhc2VHZW5lTWFwIC0gZ2VuZSBtYXAgb2YgZm9ybSB7IGhvcm46IHthOlwiaFwiLCBiOlwiaFwifSwgYXJtb3I6IHthOlwiYVwiLCBiOlwiYVwifSwgLi4ufVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gdXBkYXRlZCBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIlxuICAgKi9cbiAgc3RhdGljIGZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUdlbmVNYXAoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUdlbmVNYXApIHtcbiAgICBjb25zdCBkc3RHZW5lTWFwID0gR2VuZXRpY3NVdGlscy5idWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcpO1xuICAgIGxldCAgIGRzdEFsbGVsZVN0cmluZyA9IGFsbGVsZVN0cmluZztcbiAgICBmb3IgKGNvbnN0IGdlbmUgaW4gZHN0R2VuZU1hcCkge1xuICAgICAgY29uc3QgZ2VuZVZhbHVlID0gZHN0R2VuZU1hcFtnZW5lXTtcbiAgICAgIC8vIHJlcGxhY2UgYSBtaXNzaW5nICdhJyBzaWRlIGFsbGVsZSB3aXRoIHRoZSBkZWZhdWx0IGlmIGFwcHJvcHJpYXRlXG4gICAgICBpZiAoIWdlbmVWYWx1ZS5hICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmEpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGI6JHtnZW5lVmFsdWUuYn1gLCBgYToke2Jhc2VHZW5lTWFwW2dlbmVdLmF9LCQmYCk7XG4gICAgICB9XG4gICAgICAvLyByZXBsYWNlIGEgbWlzc2luZyAnYicgc2lkZSBhbGxlbGUgd2l0aCB0aGUgZGVmYXVsdCBpZiBhcHByb3ByaWF0ZVxuICAgICAgaWYgKCFnZW5lVmFsdWUuYiAmJiBiYXNlR2VuZU1hcFtnZW5lXSAmJiBiYXNlR2VuZU1hcFtnZW5lXS5iKSB7XG4gICAgICAgIGRzdEFsbGVsZVN0cmluZyA9IGRzdEFsbGVsZVN0cmluZy5yZXBsYWNlKGBhOiR7Z2VuZVZhbHVlLmF9YCwgYCQmLGI6JHtiYXNlR2VuZU1hcFtnZW5lXS5ifWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZHN0QWxsZWxlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHR3byBhbGxlbGUgc3RyaW5ncywgcmV0dXJucyBhIG5ldyBhbGxlbGUgc3RyaW5nIGluIHdoaWNoIG1pc3NpbmcgYWxsZWxlc1xuICAgKiBpbiB0aGUgZmlyc3QgYXJlIHJlcGxhY2VkIGJ5IGRlZmF1bHRzIHByb3ZpZGVkIGJ5IHRoZSBzZWNvbmQgYWxsZWxlIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZUFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIHVzZSBhcyBkZWZhdWx0c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gdXBkYXRlZCBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIlxuICAgKi9cbiAgc3RhdGljIGZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlQWxsZWxlU3RyaW5nKSB7XG4gICAgY29uc3QgYmFzZUdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGJhc2VBbGxlbGVTdHJpbmcpO1xuICAgIHJldHVybiBHZW5ldGljc1V0aWxzLmZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUdlbmVNYXAoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUdlbmVNYXApO1xuICB9XG5cbiAgc3RhdGljIG51bWJlck9mQnJlZWRpbmdNb3Zlc1RvUmVhY2hEcmFrZShvcmdhbmlzbTEsIG9yZ2FuaXNtMiwgY2hhbmdlYWJsZUFsbGVsZXMxLCBjaGFuZ2VhYmxlQWxsZWxlczIsIHRhcmdldE9yZ2FuaXNtKSB7XG4gICAgdmFyIG1vdmVzID0gMCxcbiAgICAgICAgb3JnMUFsbGVsZXMgPSBvcmdhbmlzbTEuZ2V0QWxsZWxlU3RyaW5nKCkuc3BsaXQoJywnKS5tYXAoYSA9PiBhLnNwbGl0KCc6JylbMV0pLFxuICAgICAgICBvcmcyQWxsZWxlcyA9IG9yZ2FuaXNtMi5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIHRhcmdldGNoYXJzID0gdGFyZ2V0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgdHJhaXRSdWxlcyA9IG9yZ2FuaXNtMS5zcGVjaWVzLnRyYWl0UnVsZXM7XG5cbiAgICBmb3IgKHZhciB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgdmFyIHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Y2hhcnNbdHJhaXRdXSxcbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IEluZmluaXR5O1xuICAgICAgICBpZiAocG9zc2libGVTb2x1dGlvbnMgJiYgcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoOyBpPGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb2x1dGlvbiA9IHBvc3NpYmxlU29sdXRpb25zW2ldLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24xID0gMCxcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamogPSBzb2x1dGlvbi5sZW5ndGg7IGo8amo7IGorKykge1xuICAgICAgICAgICAgICB2YXIgYWxsZWxlMSA9IHNvbHV0aW9uW2pdLFxuICAgICAgICAgICAgICAgICAgYWxsZWxlMiA9IGolMiA9PT0gMCA/IHNvbHV0aW9uW2orMV0gOiBzb2x1dGlvbltqLTFdLFxuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IDA7XG4gICAgICAgICAgICAgIGlmIChvcmcxQWxsZWxlcy5pbmRleE9mKGFsbGVsZTEpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxlbGUxICYmIChjaGFuZ2VhYmxlQWxsZWxlczEuaW5kZXhPZihhbGxlbGUxKSA+IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChvcmcyQWxsZWxlcy5pbmRleE9mKGFsbGVsZTIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxlbGUyICYmIChjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyKSA+IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMyLmluZGV4T2YoYWxsZWxlMi50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGolMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24xICs9IHNvbHV0aW9uTW92ZXM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjIgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gTWF0aC5taW4oc2hvcnRlc3RQYXRoLCBNYXRoLm1pbihtb3Zlc0ZvclNvbHV0aW9uMSwgbW92ZXNGb3JTb2x1dGlvbjIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZXMgKz0gc2hvcnRlc3RQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZXBhcmF0ZSBjaGFuZ2VzLCBpbmNsdWRpbmcgYWxsZWxlIGNoYW5nZXMgYW5kIHNleCBjaGFuZ2VzLFxuICAgKiByZXF1aXJlZCB0byBtYXRjaCB0aGUgcGhlbm90eXBlIG9mIHRoZSAndGVzdE9yZ2FuaXNtJyB0byB0aGF0IG9mIHRoZSAndGFyZ2V0T3JnYW5pc20nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGVzdE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIHRvIHdoaWNoIGNoYW5nZXMgd291bGQgYXBwbHlcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IHRhcmdldE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIHRoYXQgc2VydmVzIGFzIGRlc3RpbmF0aW9uXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSB0aGUgdG90YWwgbnVtYmVyIG9mIGNoYW5nZXMgcmVxdWlyZWQgZm9yIHRoZSBwaGVub3R5cGVzIHRvIG1hdGNoXG4gICAqL1xuICBzdGF0aWMgbnVtYmVyT2ZDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0T3JnYW5pc20sIHRhcmdldE9yZ2FuaXNtKSB7XG4gICAgdGVzdE9yZ2FuaXNtID0gdGhpcy5lbnN1cmVWYWxpZE9yZ2FuaXNtKHRlc3RPcmdhbmlzbSk7XG4gICAgdGFyZ2V0T3JnYW5pc20gPSB0aGlzLmVuc3VyZVZhbGlkT3JnYW5pc20odGFyZ2V0T3JnYW5pc20pO1xuXG4gICAgbGV0IHJlcXVpcmVkQ2hhbmdlQ291bnQgPSBHZW5ldGljc1V0aWxzLm51bWJlck9mQWxsZWxlQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20uZ2VuZXRpY3MuZ2Vub3R5cGUuYWxsQWxsZWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20uc3BlY2llcy50cmFpdFJ1bGVzKTtcbiAgICBpZiAodGVzdE9yZ2FuaXNtLnNleCAhPT0gdGFyZ2V0T3JnYW5pc20uc2V4KVxuICAgICAgKytyZXF1aXJlZENoYW5nZUNvdW50O1xuXG4gICAgcmV0dXJuIHJlcXVpcmVkQ2hhbmdlQ291bnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGFsbGVsZSBjaGFuZ2VzIHJlcXVpcmVkIHRvIG1ha2UgdGhlIHBoZW5vdHlwZSBvZlxuICAgKiB0aGUgb3JnYW5pc20gY2hhcmFjdGVyaXplZCBieSAndGVzdENoYXJhY3RlcnN0aWNzJyBtYXRjaCB0aGF0IG9mIHRoZSBvcmdhbmlzbVxuICAgKiBjaGFyYWN0ZXJpemVkIGJ5ICd0YXJnZXRDaGFyYWN0ZXJpc3RpY3MnLiBBZGFwdGVkIGZyb206XG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvbmNvcmQtY29uc29ydGl1bS9HZW5pdmVyc2UtU3Byb3V0Q29yZS9ibG9iL21hc3Rlci9mcmFtZXdvcmtzL2dlbml2ZXJzZS9jb250cm9sbGVycy9tYXRjaC5qc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gdGVzdENoYXJhY3RlcmlzdGljcyAtIHRoZSBjaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldENoYXJhY3RlcmlzdGljcyAtIHRoZSBjaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHRhcmdldCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0ZXN0QWxsZWxlcyAtIHRoZSBhcnJheSBvZiBhbGxlbGVzIG9mIHRoZSB0ZXN0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0cmFpdFJ1bGVzIC0gdGhlIHRyYWl0UnVsZXMgb2YgdGhlIEJpb0xvZ2ljYS5TcGVjaWVzIG9mIHRoZSBvcmdhbmlzbXNcbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSBudW1iZXIgb2YgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgZm9yIHRoZSBwaGVub3R5cGVzIHRvIG1hdGNoXG4gICAqL1xuICBzdGF0aWMgbnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0Q2hhcmFjdGVyaXN0aWNzLCB0YXJnZXRDaGFyYWN0ZXJpc3RpY3MsIHRlc3RBbGxlbGVzLCB0cmFpdFJ1bGVzKSB7XG4gICAgY29uc3QgYWxsZWxlcyA9IHRlc3RBbGxlbGVzO1xuICAgIGxldCAgIG1vdmVzID0gMDtcblxuICAgIGZvciAoY29uc3QgdHJhaXQgaW4gdHJhaXRSdWxlcykge1xuICAgICAgaWYgKHRyYWl0UnVsZXMuaGFzT3duUHJvcGVydHkodHJhaXQpKSB7XG4gICAgICAgIGlmICh0ZXN0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSAhPT0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSkge1xuICAgICAgICAgIC8vIGZpcnN0IHdlIGhhdmUgdG8gd29yayBvdXQgd2hhdCBhbGxlbGVzIHRoZSBvcmlnaW5hbCBkcmFrZSBoYXMgdGhhdCBjb3JyZXNwb25kIHRvXG4gICAgICAgICAgLy8gdGhlaXIgbm9uLW1hdGNoaW5nIHRyYWl0XG4gICAgICAgICAgY29uc3QgcG9zc2libGVUcmFpdEFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmNvbGxlY3RBbGxBbGxlbGVzRm9yVHJhaXQodHJhaXQsIHRyYWl0UnVsZXMpO1xuICAgICAgICAgIGxldCAgIGNoYXJhY3RlcmlzdGljQWxsZWxlcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFsbGVsZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlVHJhaXRBbGxlbGVzLmluZGV4T2YoYWxsZWxlc1tpXSkgPj0gMCl7XG4gICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljQWxsZWxlcy5wdXNoKGFsbGVsZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBub3cgd29yayBvdXQgdGhlIHNtYWxsZXN0IG51bWJlciBvZiBzdGVwcyB0byBnZXQgZnJvbSB0aGVyZSB0byB0aGUgZGVzaXJlZCBjaGFyYWN0ZXJpc3RpY1xuICAgICAgICAgIGNvbnN0IHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XV07XG4gICAgICAgICAgbGV0ICAgc2hvcnRlc3RQYXRoTGVuZ3RoID0gSW5maW5pdHk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0uc2xpY2UoKSxcbiAgICAgICAgICAgICAgICBwYXRoTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IGNoYXJhY3RlcmlzdGljQWxsZWxlcy5sZW5ndGg7IGogPCBqajsgaisrKXtcbiAgICAgICAgICAgICAgaWYgKHNvbHV0aW9uLmluZGV4T2YoY2hhcmFjdGVyaXN0aWNBbGxlbGVzW2pdKSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGgrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb2x1dGlvbi5zcGxpY2Uoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pLCAxKTsgLy8gYWxyZWFkeSBtYXRjaGVkIHRoaXMgb25lLCBjYW4ndCBtYXRjaCBpdCBhZ2FpblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGhMZW5ndGggPSAocGF0aExlbmd0aCA8IHNob3J0ZXN0UGF0aExlbmd0aCkgPyBwYXRoTGVuZ3RoIDogc2hvcnRlc3RQYXRoTGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vdmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvZXMgdGhyb3VnaCB0aGUgdHJhaXRSdWxlcyB0byBmaW5kIG91dCB3aGF0IHVuaXF1ZSBhbGxlbGVzIGFyZSBhc3NvY2lhdGVkIHdpdGggZWFjaCB0cmFpdFxuICAgKiBlLmcuIEZvciBcInRhaWxcIiBpdCB3aWxsIHJldHVybiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdLiBBZGFwdGVkIGZyb206XG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvbmNvcmQtY29uc29ydGl1bS9HZW5pdmVyc2UtU3Byb3V0Q29yZS9ibG9iL21hc3Rlci9mcmFtZXdvcmtzL2dlbml2ZXJzZS9jb250cm9sbGVycy9tYXRjaC5qc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJhaXQgLSBuYW1lIG9mIHRyYWl0LCBlLmcuIFwidGFpbFwiXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0cmFpdFJ1bGVzIC0gdGhlIHRyYWl0UnVsZXMgb2YgdGhlIEJpb0xvZ2ljYS5TcGVjaWVzIHdob3NlIHRyYWl0cyBhcmUgb2YgaW50ZXJlc3RcbiAgICogQHJldHVybiB7c3RyaW5nW119IC0gYXJyYXkgb2YgYWxsZWxlIHN0cmluZ3MsIGUuZy4gW1wiVFwiLCBcIlRrXCIsIFwidFwiXVxuICAgKi9cbiAgc3RhdGljIF9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdCA9IHt9O1xuICBzdGF0aWMgY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcykge1xuICAgIGlmIChHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0pIHtcbiAgICAgIHJldHVybiBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF07XG4gICAgfVxuXG4gICAgbGV0IGFsbGVsZXNIYXNoID0ge30sXG4gICAgICAgIGFsbGVsZXMgICAgID0gW107XG4gICAgZm9yIChjb25zdCBjaGFyYWN0ZXJpc3RpYyBpbiB0cmFpdFJ1bGVzW3RyYWl0XSl7XG4gICAgICAgIGZvciAoY29uc3QgcG9zc2liaWxlQWxsZWxlc0NvbWJvIGluIHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXSkge1xuICAgICAgICAgIGlmICh0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY10uaGFzT3duUHJvcGVydHkocG9zc2liaWxlQWxsZWxlc0NvbWJvKSl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY11bcG9zc2liaWxlQWxsZWxlc0NvbWJvXS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgIGFsbGVsZXNIYXNoW3RyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dW2ldXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhbGxlbGUgaW4gYWxsZWxlc0hhc2gpe1xuICAgICAgYWxsZWxlcy5wdXNoKGFsbGVsZSk7XG4gICAgfVxuXG4gICAgR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdID0gYWxsZWxlczsgIC8vIHN0b3JlIHNvIHdlIGRvbid0IG5lZWQgdG8gcmVjYWxjdWxhdGUgaXRcbiAgICByZXR1cm4gYWxsZWxlcztcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAvLyBDaGFsbGVuZ2UgaW5zdHJ1Y3Rpb25zXG4gIFwifkVHR19HQU1FXzMuQ0hST01PU09NRVNfVElUTEVcIjogXCJDaHJvbW9zb21lc1wiLFxuICBcIn5FR0dfR0FNRV8zLklOU1RSVUNUSU9OU19USVRMRVwiOiBcIkluc3RydWN0aW9uc1wiLFxuICBcIn5FR0dfR0FNRV8zLklOU1RSX0hFQURJTkdcIjogXCJTb3J0IHRoZXNlIGVnZ3MhXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSVRFTTFcIjogXCJTY29wZSBhbiBlZ2cgdG8gc2VlIGEgYmFieSdzIGNocm9tb3NvbWVzLlwiLFxuICBcIn5FR0dfR0FNRV8zLklOU1RSX0lURU0yXCI6IFwiQ2xpY2sgdGhlIGNvcnJlY3QgYmFza2V0IGZvciB0aGUgZWdnLlwiLFxuXG4gIC8vIENoYWxsZW5nZSBwb3B1cCBhbGVydHNcbiAgXCJ+QUxFUlQuVElUTEUuR09PRF9XT1JLXCI6IFwiR29vZCB3b3JrIVwiLFxuICBcIn5BTEVSVC5USVRMRS5JTkNPUlJFQ1RfRFJBS0VcIjogXCJUaGF0J3Mgbm90IHRoZSBkcmFrZSFcIixcbiAgXCJ+QUxFUlQuVElUTEUuRUdHX01JU01BVENIXCI6IFwiVGhhdCBlZ2cgZG9lc24ndCBiZWxvbmchXCIsXG4gIFwifkFMRVJULlRJVExFLk1JU1RBS0VcIjogXCJVaCBvaCFcIixcbiAgXCJ+QUxFUlQuTkVXX1BJRUNFX09GX0NPSU5cIjogXCJZb3UgZWFybmVkIGEgcGllY2Ugb2YgYSBjb2luIVwiLFxuICBcIn5BTEVSVC5DT01QTEVURV9DT0lOXCI6IFwiWW91IGhhdmUgZm91bmQgYWxsIHRoZSBwaWVjZXMgb2YgdGhpcyBjb2luIVwiLFxuICBcIn5BTEVSVC5DT1JSRUNUX0RSQUtFXCI6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICBcIn5BTEVSVC5JTkNPUlJFQ1RfRFJBS0VcIjogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBkb2Vzbid0IG1hdGNoIHRoZSB0YXJnZXQgZHJha2UuXFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBiZWxvbmdzIGluIHRoYXQgYmFza2V0LlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01JU01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBkb2Vzbid0IGJlbG9uZyBpbiB0aGF0IGJhc2tldC5cIixcbiAgXCJ+QUxFUlQuRFVQTElDQVRFX0RSQUtFXCI6IFwiWW91IGFscmVhZHkgaGF2ZSBhIGRyYWtlIHRoYXQgbG9va3MganVzdCBsaWtlIHRoYXQhXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIGJ1dHRvbnNcbiAgXCJ+QlVUVE9OLk9LXCI6IFwiT0tcIixcbiAgXCJ+QlVUVE9OLlRSWV9BR0FJTlwiOiBcIlRyeSBhZ2FpblwiLFxuICBcIn5CVVRUT04uVFJZX0FOT1RIRVJfRUdHXCI6IFwiVHJ5IGFub3RoZXIgZWdnIVwiLFxuICBcIn5CVVRUT04uQ09OVElOVUVcIjogXCJDb250aW51ZVwiLFxuICBcIn5CVVRUT04uTkVYVF9UUklBTFwiOiBcIk5leHQgdHJpYWxcIixcbiAgXCJ+QlVUVE9OLk5FWFRfQ0hBTExFTkdFXCI6IFwiTmV4dCBjaGFsbGVuZ2VcIixcbiAgXCJ+QlVUVE9OLk5FWFRfQ0FTRVwiOiBcIk5leHQgY2FzZVwiLFxuICBcIn5CVVRUT04uUExBWUdST1VORF9NT1ZFX0ZPUldBUkRcIjogXCJCcmluZyBJdCBPbiFcIixcbiAgXCJ+QlVUVE9OLkNIRUNLX0RSQUtFXCI6IFwiQ2hlY2sgRHJha2VcIixcbiAgXCJ+QlVUVE9OLlNBVkVfRFJBS0VcIjogXCJTYXZlIHRoaXNcIixcbiAgXCJ+QlVUVE9OLlNVQk1JVFwiOiBcIlN1Ym1pdFwiLFxuICBcIn5CVVRUT04uUkVTRVRcIjogXCJSZXNldFwiLFxuICBcIn5CVVRUT04uRkVSVElMSVpFX0RJU0FCTEVEXCI6IFwiRmVydGlsaXplXCIsXG4gIFwifkJVVFRPTi5GRVJUSUxJWkVcIjogXCJGZXJ0aWxpemUg4p2k77iPXCIsXG5cbiAgLy8gTWVzc2FnZXMgZnJvbSBJVFNcbiAgXCJ+SVRTLkdSRUVUSU5HXCI6IFwiSGkgdGhlcmUgdXNlciFcIlxufTtcbiIsImltcG9ydCBlbl91cyBmcm9tICcuL2VuLXVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBlbl91c1xufTtcbiIsImltcG9ydCB0cmFuc2xhdGlvbnMgZnJvbSAnLi9sYW5nJztcblxuY29uc3QgZGVmYXVsdExhbmcgPSBcImVuX3VzXCIsXG4gICAgICB2YXJSZWdFeHAgPSAvXFwkXFx7XFxzKihcXGQrKVxccypcXH0vZyxcbiAgICAgIGVycm9yID0gXCIqKiBUUkFOU0xBVElPTiBFUlJPUiAqKlwiO1xuXG5jb25zdCB0cmFuc2xhdGVTdHJpbmcgPSAoa2V5LCBsYW5nKSA9PiB0cmFuc2xhdGlvbnNbbGFuZ10gJiYgdHJhbnNsYXRpb25zW2xhbmddW2tleV0gfHwga2V5O1xuXG4vKipcbiAqIFRyYW5zbGF0ZXMgc3RyaW5ncyBpZiB0aGV5IGV4aXN0IGluIHRoZSBsYW5ndWFnZSBmaWxlLiBPdGhlcndpc2UsIHBhc3NlcyBiYWNrXG4gKiBzdHJpbmcgdW5jaGFuZ2VkLlxuICogWW91IGNhbiBhbHNvIHBhc3MgYW4gYXJyYXkgb2Ygc3RyaW5ncywgd2hlcmUgdGhlIGZpcnN0IGlzIHRoZSBtYWluIHRleHQsIGFuZFxuICogdGhlIG90aGVycyBhcmUgdmFyaWFibGVzIHRvIGJlIHBsYWNlZCBpbiB0aGUgc3RyaW5nOlxuICogICBbXCJHb29kICR7MH0sICR7MX1cIiwgXCJldmVuaW5nXCIsIFwiVXNlclwiXVxuICogd2lsbCByZXR1cm4gXCJHb29kIGV2ZW5pbmcsIFVzZXJcIi4gRWFjaCBzdHJpbmcgaW4gdGhlIGFycmF5IG1heSBvcHRpb25hbGx5IGJlXG4gKiBpbiB0aGUgbGFuZ3VhZ2UgZmlsZTpcbiAqICAgW1wiflRJTUVfU0VOU0lUSVZFX0dSRUVUSU5HXCIsIFwiflRJTUUuRVZFTklOR1wiLCBcIlVzZXJcIl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNsYXRlKGtleSwgbGFuZz1kZWZhdWx0TGFuZykge1xuICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiB0cmFuc2xhdGVTdHJpbmcoa2V5LCBsYW5nKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICBsZXQgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGVTdHJpbmcoa2V5WzBdLCBsYW5nKTtcbiAgICByZXR1cm4gdHJhbnNsYXRpb24ucmVwbGFjZSh2YXJSZWdFeHAsIChtYXRjaCwgaWQpID0+XG4gICAgICBrZXlbKytpZF0gPyB0cmFuc2xhdGVTdHJpbmcoa2V5W2lkXSwgbGFuZykgOiBlcnJvcik7XG4gIH1cbiAgY29uc29sZS5sb2coXCJDb3VsZCBub3QgdHJhbnNsYXRlOiBcIiwga2V5KTtcbiAgcmV0dXJuIGVycm9yO1xufVxuIl19
