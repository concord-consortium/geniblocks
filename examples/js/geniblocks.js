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
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

'use strict';

function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};

},{}],22:[function(require,module,exports){
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

},{"_process":23}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"performance-now":22}],25:[function(require,module,exports){
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
      if (!Object.prototype.hasOwnProperty.call(destStyle, key)) {
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
    this.animationID = _raf2['default'](function (timestamp) {
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

      var currentTime = timestamp || _performanceNow2['default']();
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
        if (!Object.prototype.hasOwnProperty.call(propsStyle, key)) {
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

},{"./mapToZero":28,"./shouldStopAnimation":33,"./stepper":35,"./stripStyle":36,"performance-now":22,"raf":24}],26:[function(require,module,exports){
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
        if (!Object.prototype.hasOwnProperty.call(unreadPropStyle, key)) {
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
    this.animationID = _raf2['default'](function (timestamp) {
      var destStyles = _this.props.styles(_this.state.lastIdealStyles);

      // check if we need to animate in the first place
      if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities)) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.accumulatedTime = 0;
        return;
      }

      var currentTime = timestamp || _performanceNow2['default']();
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
          if (!Object.prototype.hasOwnProperty.call(destStyle, key)) {
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

},{"./mapToZero":28,"./shouldStopAnimation":33,"./stepper":35,"./stripStyle":36,"performance-now":22,"raf":24}],27:[function(require,module,exports){
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
  // Copy the value to a `const` so that Flow understands that the const won't
  // change and will be non-nullable in the callback below.
  var cUnreadPropStyles = unreadPropStyles;
  if (cUnreadPropStyles == null) {
    return mergedPropsStyles.map(function (mergedPropsStyle, i) {
      return {
        key: mergedPropsStyle.key,
        data: mergedPropsStyle.data,
        style: plainStyles[i]
      };
    });
  }
  return mergedPropsStyles.map(function (mergedPropsStyle, i) {
    for (var j = 0; j < cUnreadPropStyles.length; j++) {
      if (cUnreadPropStyles[j].key === mergedPropsStyle.key) {
        return {
          key: cUnreadPropStyles[j].key,
          data: cUnreadPropStyles[j].data,
          style: plainStyles[i]
        };
      }
    }
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
function mergeAndSync(willEnter, willLeave, didLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldLastIdealStyles, oldLastIdealVelocities) {
  var newMergedPropsStyles = _mergeDiff2['default'](oldMergedPropsStyles, destStyles, function (oldIndex, oldMergedPropsStyle) {
    var leavingStyle = willLeave(oldMergedPropsStyle);
    if (leavingStyle == null) {
      didLeave({ key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data });
      return null;
    }
    if (_shouldStopAnimation2['default'](oldCurrentStyles[oldIndex], leavingStyle, oldCurrentVelocities[oldIndex])) {
      didLeave({ key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data });
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
    willEnter: _react.PropTypes.func,
    willLeave: _react.PropTypes.func,
    didLeave: _react.PropTypes.func
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
      },
      didLeave: function didLeave() {}
    };
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;
    var willEnter = _props.willEnter;
    var willLeave = _props.willLeave;
    var didLeave = _props.didLeave;

    var destStyles = typeof styles === 'function' ? styles(defaultStyles) : styles;

    // this is special. for the first time around, we don't have a comparison
    // between last (no last) and current merged props. we'll compute last so:
    // say default is {a, b} and styles (dest style) is {b, c}, we'll
    // fabricate last as {a, b}
    var oldMergedPropsStyles = undefined;
    if (defaultStyles == null) {
      oldMergedPropsStyles = destStyles;
    } else {
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
    // Because this is an old-style React.createClass component, Flow doesn't
    // understand that the willEnter and willLeave props have default values
    // and will always be present.
    willEnter, willLeave, didLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldCurrentStyles, // oldLastIdealStyles really
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

  unmounting: false,
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
    var _mergeAndSync2 = mergeAndSync(this.props.willEnter, this.props.willLeave, this.props.didLeave, this.state.mergedPropsStyles, unreadPropStyles, this.state.currentStyles, this.state.currentVelocities, this.state.lastIdealStyles, this.state.lastIdealVelocities);

    var mergedPropsStyles = _mergeAndSync2[0];
    var currentStyles = _mergeAndSync2[1];
    var currentVelocities = _mergeAndSync2[2];
    var lastIdealStyles = _mergeAndSync2[3];
    var lastIdealVelocities = _mergeAndSync2[4];

    for (var i = 0; i < unreadPropStyles.length; i++) {
      var unreadPropStyle = unreadPropStyles[i].style;
      var dirty = false;

      for (var key in unreadPropStyle) {
        if (!Object.prototype.hasOwnProperty.call(unreadPropStyle, key)) {
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

    if (this.unmounting) {
      return;
    }
    // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
    // call cb? No, otherwise accidental parent rerender causes cb trigger
    this.animationID = _raf2['default'](function (timestamp) {
      var propStyles = _this.props.styles;
      var destStyles = typeof propStyles === 'function' ? propStyles(rehydrateStyles(_this.state.mergedPropsStyles, _this.unreadPropStyles, _this.state.lastIdealStyles)) : propStyles;

      // check if we need to animate in the first place
      if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities, _this.state.mergedPropsStyles)) {
        // no need to cancel animationID here; shouldn't have any in flight
        _this.animationID = null;
        _this.accumulatedTime = 0;
        return;
      }

      var currentTime = timestamp || _performanceNow2['default']();
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

      var _mergeAndSync3 = mergeAndSync(_this.props.willEnter, _this.props.willLeave, _this.props.didLeave, _this.state.mergedPropsStyles, destStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

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
          if (!Object.prototype.hasOwnProperty.call(newMergedPropsStyle, key)) {
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

    var styles = props.styles;
    if (typeof styles === 'function') {
      this.unreadPropStyles = styles(rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.lastIdealStyles));
    } else {
      this.unreadPropStyles = styles;
    }

    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.unmounting = true;
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

},{"./mapToZero":28,"./mergeDiff":29,"./shouldStopAnimation":33,"./stepper":35,"./stripStyle":36,"performance-now":22,"raf":24}],28:[function(require,module,exports){


// currently used to initiate the velocity style object to 0
'use strict';

exports.__esModule = true;
exports['default'] = mapToZero;

function mapToZero(obj) {
  var ret = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ret[key] = 0;
    }
  }
  return ret;
}

module.exports = exports['default'];
},{}],29:[function(require,module,exports){


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
    if (!Object.prototype.hasOwnProperty.call(nextKeyIndex, prev[i].key)) {
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
        if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
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
      if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
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
},{}],30:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = {
  noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 }
};
module.exports = exports["default"];
},{}],31:[function(require,module,exports){
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
},{"./Motion":25,"./StaggeredMotion":26,"./TransitionMotion":27,"./presets":30,"./reorderKeys":32,"./spring":34}],32:[function(require,module,exports){
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

},{"_process":23}],33:[function(require,module,exports){


// usage assumption: currentStyle values have already been rendered but it says
// nothing of whether currentStyle is stale (see unreadPropStyle)
'use strict';

exports.__esModule = true;
exports['default'] = shouldStopAnimation;

function shouldStopAnimation(currentStyle, style, currentVelocity) {
  for (var key in style) {
    if (!Object.prototype.hasOwnProperty.call(style, key)) {
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
},{}],34:[function(require,module,exports){
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
},{"./presets":30}],35:[function(require,module,exports){


// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
"use strict";

exports.__esModule = true;
exports["default"] = stepper;

var reusedTuple = [0, 0];

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
},{}],36:[function(require,module,exports){

// turn {x: {val: 1, stiffness: 1, damping: 2}, y: 2} generated by
// `{x: spring(1, {stiffness: 1, damping: 2}), y: 2}` into {x: 1, y: 2}

'use strict';

exports.__esModule = true;
exports['default'] = stripStyle;

function stripStyle(style) {
  var ret = {};
  for (var key in style) {
    if (!Object.prototype.hasOwnProperty.call(style, key)) {
      continue;
    }
    ret[key] = typeof style[key] === 'number' ? style[key] : style[key].val;
  }
  return ret;
}

module.exports = exports['default'];
},{}],37:[function(require,module,exports){
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
     * A function that returns a backdrop component. Useful for custom
     * backdrop rendering.
     *
     * ```js
     *  renderBackdrop={props => <MyBackdrop {...props} />}
     * ```
     */
    renderBackdrop: _react2.default.PropTypes.func,

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
    onExited: _react2.default.PropTypes.func,

    /**
     * A ModalManager instance used to track and manage the state of open
     * Modals. Useful when customizing how modals interact within a container
     */
    manager: _react2.default.PropTypes.object.isRequired
  }),

  getDefaultProps: function getDefaultProps() {
    var noop = function noop() {};

    return {
      show: false,
      backdrop: true,
      keyboard: true,
      autoFocus: true,
      enforceFocus: true,
      onHide: noop,
      manager: modalManager,
      renderBackdrop: function renderBackdrop(props) {
        return _react2.default.createElement('div', props);
      }
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
    var _this = this;

    var _props2 = this.props;
    var backdropStyle = _props2.backdropStyle;
    var backdropClassName = _props2.backdropClassName;
    var renderBackdrop = _props2.renderBackdrop;
    var Transition = _props2.transition;
    var backdropTransitionTimeout = _props2.backdropTransitionTimeout;


    var backdropRef = function backdropRef(ref) {
      return _this.backdrop = ref;
    };

    var backdrop = _react2.default.createElement('div', {
      ref: backdropRef,
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
        renderBackdrop({
          ref: backdropRef,
          style: backdropStyle,
          className: backdropClassName,
          onClick: this.handleBackdropClick
        })
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

    this.props.manager.add(this, container, this.props.containerClassName);

    this._onDocumentKeyupListener = (0, _addEventListener2.default)(doc, 'keyup', this.handleDocumentKeyUp);

    this._onFocusinListener = (0, _addFocusListener2.default)(this.enforceFocus);

    this.focus();

    if (this.props.onShow) {
      this.props.onShow();
    }
  },
  onHide: function onHide() {
    this.props.manager.remove(this);

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
    return this.props.manager.isTopModal(this);
  }
});

Modal.Manager = _ModalManager2.default;

exports.default = Modal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ModalManager":38,"./Portal":39,"./utils/addEventListener":40,"./utils/addFocusListener":41,"./utils/getContainer":42,"./utils/ownerDocument":45,"dom-helpers/activeElement":1,"dom-helpers/query/contains":9,"dom-helpers/util/inDOM":19,"react-prop-types/lib/componentOrElement":46,"react-prop-types/lib/elementType":47,"warning":50}],38:[function(require,module,exports){
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

function setContainerStyle(state, container) {
  var style = { overflow: 'hidden' };

  // we are only interested in the actual `style` here
  // becasue we will override it
  state.style = {
    overflow: container.style.overflow,
    paddingRight: container.style.paddingRight
  };

  if (state.overflowing) {
    // use computed style, here to get the real padding
    // to add our scrollbar width
    style.paddingRight = parseInt((0, _style2.default)(container, 'paddingRight') || 0, 10) + (0, _scrollbarSize2.default)() + 'px';
  }

  (0, _style2.default)(container, style);
}

function removeContainerStyle(_ref, container) {
  var style = _ref.style;


  Object.keys(style).forEach(function (key) {
    return container.style[key] = style[key];
  });
}
/**
 * Proper state managment for containers and the modals in those containers.
 *
 * @internal Used by the Modal to ensure proper styling of containers.
 */

var ModalManager = function () {
  function ModalManager() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref2$hideSiblingNode = _ref2.hideSiblingNodes;
    var hideSiblingNodes = _ref2$hideSiblingNode === undefined ? true : _ref2$hideSiblingNode;
    var _ref2$handleContainer = _ref2.handleContainerOverflow;
    var handleContainerOverflow = _ref2$handleContainer === undefined ? true : _ref2$handleContainer;

    _classCallCheck(this, ModalManager);

    this.hideSiblingNodes = hideSiblingNodes;
    this.handleContainerOverflow = handleContainerOverflow;
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

        overflowing: (0, _isOverflowing2.default)(container)
      };

      if (this.handleContainerOverflow) {
        setContainerStyle(data, container);
      }

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
      // clean up the container
      if (data.modals.length === 0) {
        data.classes.forEach(_class2.default.removeClass.bind(null, container));

        if (this.handleContainerOverflow) {
          removeContainerStyle(data, container);
        }

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
},{"./utils/isOverflowing":43,"./utils/manageAriaHidden":44,"dom-helpers/class":4,"dom-helpers/style":12,"dom-helpers/util/scrollbarSize":20}],39:[function(require,module,exports){
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
      return _reactDom2.default.findDOMNode(this._overlayInstance);
    }

    return null;
  }
});

exports.default = Portal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/getContainer":42,"./utils/ownerDocument":45,"react-prop-types/lib/componentOrElement":46}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (node, event, handler, capture) {
  (0, _on2.default)(node, event, handler, capture);

  return {
    remove: function remove() {
      (0, _off2.default)(node, event, handler, capture);
    }
  };
};

var _on = require('dom-helpers/events/on');

var _on2 = _interopRequireDefault(_on);

var _off = require('dom-helpers/events/off');

var _off2 = _interopRequireDefault(_off);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
},{"dom-helpers/events/off":6,"dom-helpers/events/on":7}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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
},{"dom-helpers/ownerDocument":8,"dom-helpers/query/isWindow":10}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
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

},{"dom-helpers/ownerDocument":8}],46:[function(require,module,exports){
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

},{"./utils/createChainableTypeChecker":48}],47:[function(require,module,exports){
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

},{"./utils/createChainableTypeChecker":48}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{"_process":23}],51:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlleleFiltersView = function AlleleFiltersView(_ref) {
  var species = _ref.species,
      _ref$visibleGenes = _ref.visibleGenes,
      visibleGenes = _ref$visibleGenes === undefined ? [] : _ref$visibleGenes,
      _ref$disabledAlleles = _ref.disabledAlleles,
      disabledAlleles = _ref$disabledAlleles === undefined ? [] : _ref$disabledAlleles,
      onFilterChange = _ref.onFilterChange;

  var geneInputs = [],
      allVisible = visibleGenes.length === 0;

  for (var gene in species.geneList) {
    if (allVisible || visibleGenes.indexOf(gene) > -1) {
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
  visibleGenes: _react.PropTypes.arrayOf(_react.PropTypes.string),
  disabledAlleles: _react.PropTypes.arrayOf(_react.PropTypes.string),
  onFilterChange: _react.PropTypes.func.isRequired
};

exports.default = AlleleFiltersView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],52:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlleleView = function AlleleView(_ref) {
  var allele = _ref.allele,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 21 : _ref$width,
      target = _ref.target,
      color = _ref.color,
      shape = _ref.shape,
      hovering = _ref.hovering;

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

},{}],53:[function(require,module,exports){
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
 * @param {string[]} visibleGenes - genes which should be visible
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
  var id = _ref.id,
      initialDisplay = _ref.initialDisplay,
      display = _ref.display,
      _ref$animStiffness = _ref.animStiffness,
      animStiffness = _ref$animStiffness === undefined ? 100 : _ref$animStiffness,
      onRest = _ref.onRest,
      others = _objectWithoutProperties(_ref, ['id', 'initialDisplay', 'display', 'animStiffness', 'onRest']);

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
  visibleGenes: _react.PropTypes.arrayOf(_react.PropTypes.string),
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

},{"./gamete":66,"react-motion":31}],54:[function(require,module,exports){
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
  var org = _ref.org,
      id = _ref.id,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 200 : _ref$width,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      _ref$initialOpacity = _ref.initialOpacity,
      initialOpacity = _ref$initialOpacity === undefined ? 1.0 : _ref$initialOpacity,
      _ref$opacity = _ref.opacity,
      opacity = _ref$opacity === undefined ? 1.0 : _ref$opacity,
      _ref$stiffness = _ref.stiffness,
      stiffness = _ref$stiffness === undefined ? 60 : _ref$stiffness,
      onRest = _ref.onRest,
      onClick = _ref.onClick;

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

},{"./organism":74,"react-motion":31}],55:[function(require,module,exports){
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
      var _this$props = _this.props,
          basket = _this$props.basket,
          index = _this$props.index,
          onClick = _this$props.onClick;

      if (onClick) onClick(index, basket);
      evt.stopPropagation();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BasketView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          basket = _props.basket,
          id = _props.id,
          eggs = _props.eggs,
          isSelected = _props.isSelected,
          classes = 'basket' + (isSelected ? ' selected' : '');


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
  var baskets = _ref2.baskets,
      _ref2$idPrefix = _ref2.idPrefix,
      idPrefix = _ref2$idPrefix === undefined ? 'basket-' : _ref2$idPrefix,
      _ref2$selectedIndices = _ref2.selectedIndices,
      selectedIndices = _ref2$selectedIndices === undefined ? [] : _ref2$selectedIndices,
      eggs = _ref2.eggs,
      animatingEggIndex = _ref2.animatingEggIndex,
      onClick = _ref2.onClick;


  var basketViews = baskets.map(function (basket, index) {
    var id = '' + idPrefix + index,
        isSelected = selectedIndices.indexOf(index) >= 0;
    var eggIndices = basket && basket.eggs || [],
        displayEggs = [];
    eggIndices.forEach(function (eggDrakeIndex) {
      var eggIndex = eggDrakeIndex;
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
  animatingEggIndex: _react.PropTypes.number,
  onClick: _react.PropTypes.func
};

exports.default = BasketSetView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./egg-clutch":62}],56:[function(require,module,exports){
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

      var _props = this.props,
          className = _props.className,
          label = _props.label,
          others = _objectWithoutProperties(_props, ['className', 'label']),
          classes = (className ? className + ' ' : '') + 'gb-button';

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

},{"../utilities/translate":84}],57:[function(require,module,exports){
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
      var level = 0,
          mission = 0,
          challenge = 0,
          challengeCount = 0,
          progress = [],
          challengeBackgroundImage = void 0,
          progressImages = [];

      if (this.props.challengeAwards.routeSpec != null) {
        level = this.props.challengeAwards.routeSpec.level, mission = this.props.challengeAwards.routeSpec.mission, challenge = this.props.challengeAwards.routeSpec.challenge, challengeCount = this.props.challengeAwards.challengeCount;
        progress = this.props.challengeAwards.progress;
        challengeBackgroundImage = _react2.default.createElement('div', { className: 'coin background' });
      } else return null;

      if (!progress || progress === []) return null;

      var size = this.props.size || 256;
      var sizeStyle = {
        width: size + "px",
        height: size + "px"
      };

      var pieceKey = level + ":" + mission + ":";
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
      var pieceNum = challenge + 1;
      var currentPieceStyle = 'coin piece pieces' + challengeCount + ' piece' + pieceNum + ' single ' + this.getAwardStyle(challengeScore[challenge]);

      for (var challengeNum in challengeScore) {
        pieceNum = parseInt(challengeNum) + 1;
        progressImages = this.addAwardImage(progressImages, challengeCount, pieceNum, challengeScore[challengeNum], "whole");
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
  challengeAwards: { routeSpec: { "level": 0, "mission": 0, "challenge": 0 }, "challengeCount": 0, "progress": [] },
  size: 256,
  coinParts: 3
};
exports.default = ChallengeAwardView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"react-motion":31}],58:[function(require,module,exports){
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
  var id = _ref.id,
      sex = _ref.sex,
      species = _ref.species,
      showLabel = _ref.showLabel,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      onChange = _ref.onChange;

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

},{}],59:[function(require,module,exports){
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
  var width = _ref.width,
      height = _ref.height,
      _ref$split = _ref.split,
      split = _ref$split === undefined ? 45 : _ref$split,
      _ref$color = _ref.color,
      color = _ref$color === undefined ? '#FF9999' : _ref$color,
      _ref$small = _ref.small,
      small = _ref$small === undefined ? false : _ref$small,
      _ref$bold = _ref.bold,
      bold = _ref$bold === undefined ? false : _ref$bold,
      _ref$empty = _ref.empty,
      empty = _ref$empty === undefined ? false : _ref$empty,
      _ref$yChromosome = _ref.yChromosome,
      yChromosome = _ref$yChromosome === undefined ? false : _ref$yChromosome,
      animationStyling = _ref.animationStyling;

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
        _react2.default.createElement('rect', { height: Math.max(0, split - radius - (radius + 2)), width: width, y: radius + 2, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
        _react2.default.createElement('rect', { height: Math.max(0, height - radius - (split + radius)), width: width, y: split + radius, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
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

},{}],60:[function(require,module,exports){
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
  var chromosome = _ref.chromosome,
      org = _ref.org,
      _ref$ChromosomeImageC = _ref.ChromosomeImageClass,
      ChromosomeImageClass = _ref$ChromosomeImageC === undefined ? _chromosomeImage2.default : _ref$ChromosomeImageC,
      chromosomeName = _ref.chromosomeName,
      side = _ref.side,
      _ref$userChangeableGe = _ref.userChangeableGenes,
      userChangeableGenes = _ref$userChangeableGe === undefined ? [] : _ref$userChangeableGe,
      _ref$visibleGenes = _ref.visibleGenes,
      visibleGenes = _ref$visibleGenes === undefined ? [] : _ref$visibleGenes,
      _ref$hiddenAlleles = _ref.hiddenAlleles,
      hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles,
      _ref$small = _ref.small,
      small = _ref$small === undefined ? false : _ref$small,
      _ref$editable = _ref.editable,
      editable = _ref$editable === undefined ? true : _ref$editable,
      _ref$selected = _ref.selected,
      selected = _ref$selected === undefined ? false : _ref$selected,
      _onAlleleChange = _ref.onAlleleChange,
      onChromosomeSelected = _ref.onChromosomeSelected,
      _ref$showLabels = _ref.showLabels,
      showLabels = _ref$showLabels === undefined ? true : _ref$showLabels,
      _ref$showAlleles = _ref.showAlleles,
      showAlleles = _ref$showAlleles === undefined ? false : _ref$showAlleles,
      _ref$labelsOnRight = _ref.labelsOnRight,
      labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight,
      orgName = _ref.orgName,
      _ref$displayStyle = _ref.displayStyle,
      displayStyle = _ref$displayStyle === undefined ? {} : _ref$displayStyle;


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
        visibleAlleles = _geneticsUtils2.default.filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, chromosome.species);

    if (showLabels) {
      var labels = visibleAlleles.map(function (a) {
        if (ChromosomeImageClass === _chromosomeImage2.default) {
          return _react2.default.createElement(_geneLabel2.default, { key: a.allele, species: chromosome.species, allele: a.allele, editable: editable && a.editable,
            hiddenAlleles: hiddenAlleles,
            onAlleleChange: function onAlleleChange(event) {
              _onAlleleChange(a.allele, event.target.value);
            } });
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'geniblocks fv-gene-label allele noneditable', key: a.allele },
            chromosome.species.alleleLabelMap[a.allele]
          );
        }
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
        return _react2.default.createElement(_allele2.default, { key: a.allele, allele: a.allele });
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
        _react2.default.createElement(ChromosomeImageClass, { small: small, empty: empty, bold: selected, yChromosome: yChromosome }),
        allelesContainer
      ),
      labelsContainer
    )
  );
};

ChromosomeView.propTypes = {
  ChromosomeImageClass: _react.PropTypes.func,
  org: _react.PropTypes.object,
  chromosomeName: _react.PropTypes.string,
  side: _react.PropTypes.string,
  chromosome: _react.PropTypes.object,
  userChangeableGenes: _react.PropTypes.array,
  visibleGenes: _react.PropTypes.array,
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

},{"../utilities/genetics-utils":81,"./allele":52,"./chromosome-image":59,"./gene-label":67}],61:[function(require,module,exports){
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
  var id = _ref.id,
      color = _ref.color,
      size = _ref.size,
      style = _ref.style;

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

},{}],62:[function(require,module,exports){
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
      var _this$props = _this.props,
          egg = _this$props.egg,
          id = _this$props.id,
          index = _this$props.index,
          onClick = _this$props.onClick;

      if (onClick) onClick(id, index, egg);
      evt.stopPropagation();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(EggView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          egg = _props.egg,
          id = _props.id,
          displayStyle = _props.displayStyle,
          isSelected = _props.isSelected,
          eggStyle = Object.assign({ flexShrink: 0 }, displayStyle),
          isHidden = egg == null,
          classes = 'clutch-egg' + (isSelected ? ' selected' : '') + (isHidden ? ' hidden' : '');

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
  var eggs = _ref2.eggs,
      _ref2$idPrefix = _ref2.idPrefix,
      idPrefix = _ref2$idPrefix === undefined ? 'egg-' : _ref2$idPrefix,
      selectedIndex = _ref2.selectedIndex,
      onClick = _ref2.onClick;


  var ODD_EGG_MARGIN = 8,
      EVEN_EGG_MARGIN = 0;
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
    orgViews = eggs.reduce(function (prev, egg, index) {
      // for flex layout purposes, with odd numbers of items
      // we add spacer items between the eggs
      var spacerID = '' + idPrefix + index + '-spacer',
          spacerStyle = { marginLeft: EVEN_EGG_MARGIN, marginRight: EVEN_EGG_MARGIN,
        visibility: 'hidden' },
          spacer = _react2.default.createElement(EggView, { egg: null, key: spacerID, displayStyle: spacerStyle });
      if (index < eggs.length / 2) prev.push(spacer);
      prev.push(eggViewForIndex(egg, index, EVEN_EGG_MARGIN));
      if (index >= eggs.length / 2) prev.push(spacer);
      return prev;
    }, []);
    //orgViews = eggs.map((egg, index) => eggViewForIndex(egg, index, EVEN_EGG_MARGIN));
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

},{}],63:[function(require,module,exports){
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
  var text = _ref.text,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style;

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

},{}],64:[function(require,module,exports){
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
      var _this$props = _this.props,
          gamete = _this$props.gamete,
          id = _this$props.id,
          visibleGenes = _this$props.visibleGenes,
          animStiffness = _this$props.animStiffness,
          onRest = _this$props.onRest,
          xOffset = _this.props.srcRect ? _this.props.srcRect.left - _this.props.dstRect.left : 0,
          yOffset = _this.props.srcRect ? _this.props.srcRect.top - _this.props.dstRect.top : 0,
          xResting = _this.props.type === GAMETE_TYPE.FATHER ? RESTING_FATHER_GAMETE_X : RESTING_MOTHER_GAMETE_X,
          xFertilizing = _this.props.type === GAMETE_TYPE.FATHER ? FERTILIZING_FATHER_GAMETE_X : FERTILIZING_MOTHER_GAMETE_X,
          initial = void 0,
          tFinal = void 0;


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

      return _react2.default.createElement(_animatedGamete2.default, { gamete: gamete, id: id, visibleGenes: visibleGenes,
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
  visibleGenes: _react.PropTypes.arrayOf(_react.PropTypes.string),
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
  visibleGenes: [],
  animStiffness: 100
};
exports.default = FertilizingGameteView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./animated-gamete":53}],65:[function(require,module,exports){
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
  var gametes = _ref.gametes,
      _ref$visibleGenes = _ref.visibleGenes,
      visibleGenes = _ref$visibleGenes === undefined ? [] : _ref$visibleGenes,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 300 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 200 : _ref$height,
      _ref$animStiffness = _ref.animStiffness,
      animStiffness = _ref$animStiffness === undefined ? 60 : _ref$animStiffness,
      selectedId = _ref.selectedId,
      isGameteDisabled = _ref.isGameteDisabled,
      onGameteSelected = _ref.onGameteSelected;

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
      visibleGenes: visibleGenes,
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
  visibleGenes: _react.PropTypes.arrayOf(_react.PropTypes.string),
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  animStiffness: _react.PropTypes.number,
  selectedId: _react.PropTypes.number,
  isGameteDisabled: _react.PropTypes.func,
  onGameteSelected: _react.PropTypes.func
};

exports.default = GametePoolView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./animated-gamete":53}],66:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Stateless functional React component for displaying a Biologica gamete
 *
 * @param {Object} gamete - Biologica gamete (map of chromosome names to chromosomes)
 * @param {number} id - the unique id of this gamete
 * @param {string[]} visibleGenes - genes which should be visible
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
  var gamete = _ref.gamete,
      id = _ref.id,
      _ref$visibleGenes = _ref.visibleGenes,
      visibleGenes = _ref$visibleGenes === undefined ? [] : _ref$visibleGenes,
      display = _ref.display,
      _ref$isSelected = _ref.isSelected,
      isSelected = _ref$isSelected === undefined ? false : _ref$isSelected,
      _ref$isDisabled = _ref.isDisabled,
      isDisabled = _ref$isDisabled === undefined ? false : _ref$isDisabled,
      onClick = _ref.onClick;


  function handleClick(evt) {
    var elt = evt.target,
        rect = elt.getBoundingClientRect();
    if (!isDisabled && onClick) {
      onClick(evt, id, rect);
    }
  }

  function buildTooltipForGamete(gamete) {
    var tooltip = "";

    for (var ch in gamete) {
      var chromosome = gamete[ch],
          visibleAlleles = _geneticsUtils2.default.filterVisibleAlleles(chromosome.alleles, [], visibleGenes, chromosome.species);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = visibleAlleles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var allele = _step.value;

          var label = chromosome.species.alleleLabelMap[allele.allele];
          tooltip += (tooltip ? '\n' : '') + ch + ': ' + label;
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
  visibleGenes: _react.PropTypes.arrayOf(_react.PropTypes.string),
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

},{"../utilities/genetics-utils":81}],67:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GeneLabelView = function GeneLabelView(_ref) {
  var species = _ref.species,
      allele = _ref.allele,
      _ref$editable = _ref.editable,
      editable = _ref$editable === undefined ? false : _ref$editable,
      _ref$hiddenAlleles = _ref.hiddenAlleles,
      hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles,
      onAlleleChange = _ref.onAlleleChange;

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
          visibleAlleles = alleles.filter(function (a) {
        return hiddenAlleles.indexOf(a) === -1;
      }),
          alleleNames = visibleAlleles.map(function (a) {
        return species.alleleLabelMap[a];
      }),
          alleleOptions = alleleNames.map(function (name, i) {
        return _react2.default.createElement(
          "option",
          { key: name, value: visibleAlleles[i] },
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
  hiddenAlleles: _react.PropTypes.array,
  onAlleleChange: _react.PropTypes.func
};

exports.default = GeneLabelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],68:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestPulldownView = function TestPulldownView(_ref) {
  var species = _ref.species,
      gene = _ref.gene,
      selection = _ref.selection,
      onSelectionChange = _ref.onSelectionChange;

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
  var org = _ref2.org,
      _ref2$userChangeableG = _ref2.userChangeableGenes,
      userChangeableGenes = _ref2$userChangeableG === undefined ? [] : _ref2$userChangeableG,
      _ref2$selection = _ref2.selection,
      selection = _ref2$selection === undefined ? {} : _ref2$selection,
      _onSelectionChange = _ref2.onSelectionChange;

  var pairWrappers = [],
      allVisible = userChangeableGenes.length === 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          alleles = chrom[Object.keys(chrom)[0]].alleles,
          genes = alleles.map(function (a) {
        return BioLogica.Genetics.getGeneOfAllele(org.species, a);
      }).filter(function (g) {
        return allVisible || userChangeableGenes.indexOf(g.name) > -1;
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
  userChangeableGenes: _react.PropTypes.array,
  selection: _react.PropTypes.object,
  onSelectionChange: _react.PropTypes.func.isRequired
};

exports.default = GenomeTestView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./chromosome-image":59}],69:[function(require,module,exports){
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
  var org = _ref.org,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      ChromosomeImageClass = _ref.ChromosomeImageClass,
      chromosomes = _ref.chromosomes,
      species = _ref.species,
      _ref$userChangeableGe = _ref.userChangeableGenes,
      userChangeableGenes = _ref$userChangeableGe === undefined ? [] : _ref$userChangeableGe,
      _ref$visibleGenes = _ref.visibleGenes,
      visibleGenes = _ref$visibleGenes === undefined ? [] : _ref$visibleGenes,
      _ref$hiddenAlleles = _ref.hiddenAlleles,
      hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles,
      _ref$editable = _ref.editable,
      editable = _ref$editable === undefined ? true : _ref$editable,
      _ref$showLabels = _ref.showLabels,
      showLabels = _ref$showLabels === undefined ? true : _ref$showLabels,
      _ref$showAlleles = _ref.showAlleles,
      showAlleles = _ref$showAlleles === undefined ? false : _ref$showAlleles,
      _ref$selectedChromoso = _ref.selectedChromosomes,
      selectedChromosomes = _ref$selectedChromoso === undefined ? {} : _ref$selectedChromoso,
      _ref$small = _ref.small,
      small = _ref$small === undefined ? false : _ref$small,
      orgName = _ref.orgName,
      displayStyle = _ref.displayStyle,
      _onAlleleChange = _ref.onAlleleChange,
      _onChromosomeSelected = _ref.onChromosomeSelected;

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
          ChromosomeImageClass: ChromosomeImageClass,
          chromosome: chromosome,
          key: pairs.length + 1,
          userChangeableGenes: userChangeableGenes,
          visibleGenes: visibleGenes,
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
  ChromosomeImageClass: _react.PropTypes.func,
  chromosomes: _react.PropTypes.object,
  species: _react.PropTypes.object,
  userChangeableGenes: _react.PropTypes.array,
  visibleGenes: _react.PropTypes.array,
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

},{"./chromosome":60}],70:[function(require,module,exports){
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
  var id = _ref.id,
      color = _ref.color,
      size = _ref.size,
      _ref$containerStyle = _ref.containerStyle,
      containerStyle = _ref$containerStyle === undefined ? {} : _ref$containerStyle,
      _ref$glowStyle = _ref.glowStyle,
      glowStyle = _ref$glowStyle === undefined ? {} : _ref$glowStyle,
      ChildComponent = _ref.ChildComponent,
      _ref$childStyle = _ref.childStyle,
      childStyle = _ref$childStyle === undefined ? {} : _ref$childStyle,
      others = _objectWithoutProperties(_ref, ['id', 'color', 'size', 'containerStyle', 'glowStyle', 'ChildComponent', 'childStyle']);

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

},{"./circular-glow":61}],71:[function(require,module,exports){
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
  var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "50%";

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
    paddingBottom: '15px',
    paddingLeft: '15px',
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

},{"../utilities/translate":84,"./button":56,"./challenge-award":57,"react-overlays/lib/Modal":37}],72:[function(require,module,exports){
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
  var id = _ref.id,
      className = _ref.className,
      ordinal = _ref.ordinal,
      organism = _ref.organism,
      _ref$size = _ref.size,
      size = _ref$size === undefined ? 32 : _ref$size,
      other = _objectWithoutProperties(_ref, ['id', 'className', 'ordinal', 'organism', 'size']);

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

},{"./organism":74}],73:[function(require,module,exports){
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
  var _ref$id = _ref.id,
      id = _ref$id === undefined ? 'org-glow' : _ref$id,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className,
      _ref$color = _ref.color,
      color = _ref$color === undefined ? "#FFFFAA" : _ref$color,
      _ref$size = _ref.size,
      size = _ref$size === undefined ? 200 : _ref$size,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      _ref$glowStyle = _ref.glowStyle,
      glowStyle = _ref$glowStyle === undefined ? {} : _ref$glowStyle,
      other = _objectWithoutProperties(_ref, ['id', 'className', 'color', 'size', 'style', 'glowStyle']);

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

},{"./circular-glow":61,"./organism":74}],74:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrganismView = function OrganismView(_ref) {
  var org = _ref.org,
      id = _ref.id,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 200 : _ref$width,
      _ref$flipped = _ref.flipped,
      flipped = _ref$flipped === undefined ? false : _ref$flipped,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      onClick = _ref.onClick,
      wrapper = _ref.wrapper;

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
  height: _react.PropTypes.number,
  style: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  wrapper: _react.PropTypes.func
};

exports.default = OrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],75:[function(require,module,exports){
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
      var _props = this.props,
          orgs = _props.orgs,
          lastClutchSize = _props.lastClutchSize,
          selectedIndex = _props.selectedIndex,
          onSelectionChange = _props.onSelectionChange,
          others = _objectWithoutProperties(_props, ['orgs', 'lastClutchSize', 'selectedIndex', 'onSelectionChange']),
          lastClutch = orgs.slice(-lastClutchSize);

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

},{"./pen":76,"./stats":79,"react-simpletabs":49}],76:[function(require,module,exports){
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
  var orgs = _ref.orgs,
      _ref$idPrefix = _ref.idPrefix,
      idPrefix = _ref$idPrefix === undefined ? 'organism-' : _ref$idPrefix,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 400 : _ref$width,
      _ref$columns = _ref.columns,
      columns = _ref$columns === undefined ? 5 : _ref$columns,
      rows = _ref.rows,
      _ref$tightenRows = _ref.tightenRows,
      tightenRows = _ref$tightenRows === undefined ? 0 : _ref$tightenRows,
      _ref$tightenColumns = _ref.tightenColumns,
      tightenColumns = _ref$tightenColumns === undefined ? 0 : _ref$tightenColumns,
      _ref$SelectedOrganism = _ref.SelectedOrganismView,
      SelectedOrganismView = _ref$SelectedOrganism === undefined ? _organism2.default : _ref$SelectedOrganism,
      selectedIndex = _ref.selectedIndex,
      onClick = _ref.onClick;


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

},{"./organism":74}],77:[function(require,module,exports){
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
  var glowColor = _ref.glowColor,
      _ref$size = _ref.size,
      size = _ref$size === undefined ? 200 : _ref$size;

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

},{"./circular-glow":61}],78:[function(require,module,exports){
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
  var hidden = _ref.hidden,
      color = _ref.color,
      size = _ref.size,
      other = _objectWithoutProperties(_ref, ['hidden', 'color', 'size']);

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

},{"./organism-glow":73,"./question-glow":77}],79:[function(require,module,exports){
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
  var orgs = _ref.orgs,
      lastClutchSize = _ref.lastClutchSize;


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
      var _step$value = _slicedToArray(_step.value, 2),
          trait = _step$value[0],
          values = _step$value[1];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              value = _step2$value[0],
              counts = _step2$value[1];

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

},{"../utilities/genetics-utils":81}],80:[function(require,module,exports){
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

/*
 * See https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.q1vckffiw
 * (Kent C. Dodds, "Misunderstanding ES6 Modules, Upgrading Babel, Tears, and a Solution")
 * for description of some of the details involved in mixing ES6 export with require().
 */

// Polyfill, modifying the global Object
require('es6-object-assign').polyfill();

// components

},{"./components/allele":52,"./components/allele-filters":51,"./components/animated-gamete":53,"./components/animated-organism":54,"./components/basket-set":55,"./components/button":56,"./components/challenge-award":57,"./components/change-sex-buttons":58,"./components/chromosome":60,"./components/chromosome-image":59,"./components/circular-glow":61,"./components/egg-clutch":62,"./components/feedback":63,"./components/fertilizing-gamete":64,"./components/gamete":66,"./components/gamete-pool":65,"./components/gene-label":67,"./components/genome":69,"./components/genome-test":68,"./components/glow-background":70,"./components/modal-alert":71,"./components/ordinal-organism":72,"./components/organism":74,"./components/organism-glow":73,"./components/pen":76,"./components/pen-stats":75,"./components/question-glow":77,"./components/question-organism-glow":78,"./components/stats":79,"./utilities/genetics-utils":81,"es6-object-assign":21}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    key: 'convertDashAllelesToABAlleles',


    /**
     * Converts allele strings in the new dash form (e.g. "W-w, T-, -a") to the original
     * BioLogica a:b: form (e.g. "a:W,b:w,a:T,b:a")
     *
     * @param {string}  dashAlleleString - the allele string to be converted
     * @returns {string}  the converted allele string
     */
    value: function convertDashAllelesToABAlleles(dashAlleleString) {
      if (!dashAlleleString || dashAlleleString.indexOf(':') >= 0 || dashAlleleString.indexOf('-') < 0) return dashAlleleString;
      var dashAlleles = dashAlleleString.split(',');
      return dashAlleles.reduce(function (prev, pair) {
        var alleles = pair.trim().split('-');
        if (alleles[0]) prev += (prev ? ',' : '') + 'a:' + alleles[0].trim();
        if (alleles[1]) prev += (prev ? ',' : '') + 'b:' + alleles[1].trim();
        return prev;
      }, "");
    }

    /**
     * Converts allele strings in the new dash form (e.g. "W-w, T-, -a") to the original
     * BioLogica a:b: form (e.g. "a:W,b:w,a:T,b:a") within objects and arrays.
     *
     * Recurses through nested objects/arrays converting dash allele strings in properties
     * whose names are white-listed in the propNames argument.
     *
     * @param {object}  object - the object to be converted
     * @returns {object}  the same object is returned with the specified fields modified
     */

  }, {
    key: 'convertDashAllelesObjectToABAlleles',
    value: function convertDashAllelesObjectToABAlleles(object, propNames) {
      if (!object || !propNames || propNames.length == null) return object;

      function convertValue(key, value) {
        if (!value) return value;
        switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
          case 'string':
            return !key || propNames.indexOf(key) >= 0 ? GeneticsUtils.convertDashAllelesToABAlleles(value) : value;
          case 'object':
            if (Array.isArray(value)) {
              // note that the key for strings in arrays is the key for the array
              return value.map(function (item) {
                return convertValue(key, item);
              });
            } else {
              for (var objKey in value) {
                value[objKey] = convertValue(objKey, value[objKey]);
              }
            }
            return value;
          default:
            return value;
        }
      }

      return convertValue(null, object);
    }
  }, {
    key: 'ensureValidOrganism',
    value: function ensureValidOrganism(orgOrDef) {
      var species = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BioLogica.Species.Drake;

      if (orgOrDef.getAlleleString) {
        return orgOrDef;
      }
      return new BioLogica.Organism(species, orgOrDef.alleleString, orgOrDef.sex);
    }

    /**
     * Returns true if the specified alleles are present in the allele string.
     *
     * @param {string}  alleleString - organism allele string
     * @param (string)  alleles - alleles to match against the organism alleles
     * @returns {boolean} true if the alleles are present in the alleleString, false otherwise
     */

  }, {
    key: 'alleleStringContainsAlleles',
    value: function alleleStringContainsAlleles(alleleString, alleles) {
      // empty strings don't match
      if (!alleleString || !alleles) return false;
      // must match every one of the alleles ...
      return alleles.split(',').every(function (allele) {
        // ... to the alleles of the alleleString
        return alleleString.search(allele + '(,|$)') >= 0;
      });
    }

    /**
     * Returns true if the specified allele string contains only valid alleles
     *
     * @param {string}  alleleString - the allele string (in a:b: form) to be validated
     * @param {object}  [species] - the species whose genome is used to determine completeness
     * @returns         true if the allele string is valid, false otherwise
     */

  }, {
    key: 'isValidAlleleString',
    value: function isValidAlleleString(alleleString) {
      var species = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BioLogica.Species.Drake;

      if (!species || !alleleString) return false;
      var alleleToGeneMap = Object.keys(species.geneList).reduce(function (prev, gene) {
        species.geneList[gene].alleles.forEach(function (allele) {
          prev[allele] = gene;
        });
        return prev;
      }, {});
      return alleleString.split(',').every(function (alleleSide) {
        var _alleleSide$split = alleleSide.split(':'),
            _alleleSide$split2 = _slicedToArray(_alleleSide$split, 2),
            side = _alleleSide$split2[0],
            allele = _alleleSide$split2[1];

        return (side.trim() === 'a' || side.trim() === 'b') && alleleToGeneMap[allele.trim()] != null;
      });
    }

    /**
     * Returns true if the specified allele string completely specifies all alleles
     *
     * To be complete, every gene must be specified with a valid allele for each
     * side (except sex-linked genes, which need only be on one side), and no
     * invalid alleles or genes can be specified.
     *
     * @param {string}  alleleString - the allele string (in a:b: form) to be validated
     * @param {object}  [species] - the species whose genome is used to determine completeness
     * @returns         true if the allele string is complete, false otherwise
     */

  }, {
    key: 'isCompleteAlleleString',
    value: function isCompleteAlleleString(alleleString) {
      var species = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : BioLogica.Species.Drake;

      if (!species || !alleleString) return false;
      var kUnknownGene = "__UNKNOWN__",
          alleleToGeneMap = Object.keys(species.geneList).reduce(function (prev, gene) {
        species.geneList[gene].alleles.forEach(function (allele) {
          prev[allele] = gene;
        });
        return prev;
      }, {}),
          speciesGeneCount = Object.keys(species.geneList).length,
          geneSideMap = alleleString.split(',').reduce(function (prev, alleleSide) {
        var _alleleSide$split3 = alleleSide.split(':'),
            _alleleSide$split4 = _slicedToArray(_alleleSide$split3, 2),
            side = _alleleSide$split4[0],
            allele = _alleleSide$split4[1];

        var gene = alleleToGeneMap[allele.trim()];
        if (!gene) gene = kUnknownGene;
        var geneEntry = prev[gene];
        if (!geneEntry) geneEntry = prev[gene] = { a: 0, b: 0 };
        ++geneEntry[side.trim()];
        return prev;
      }, {}),
          alleleStringGeneCount = Object.keys(geneSideMap).length,
          isEveryGeneComplete = Object.keys(geneSideMap).every(function (gene) {
        var geneEntry = geneSideMap[gene],
            isXYGene = species.chromosomeGeneMap.XY.some(function (allele) {
          return gene === alleleToGeneMap[allele];
        });
        return geneEntry && geneEntry.a === 1 && geneEntry.b === 1 || isXYGene && geneEntry.a + geneEntry.b >= 1 && geneEntry.a + geneEntry.b <= 2;
      });
      // must have the correct number of genes, all genes must be complete, and no unknown genes
      return speciesGeneCount === alleleStringGeneCount && isEveryGeneComplete && geneSideMap[kUnknownGene] == null;
    }

    /**
     * Filters out hidden alleles, given a list of changeable and visible genes.
     * Returns array of objects with the allele and the editability
     *
     * @param {string[]} alleles - the set of alleles to be filtered
     * @param {string[]} userChangeableGenes - genes that the user can edit (if the template allows)
     * @param {string[]} visibleGenes - genes that the user can view (already includes the above list)
     * @param {BioLogica.species} species - the species that defines the genotype
     * @return {obj[]} - the filtered alleles, where each is an object with a name and whether it is editable
     */

  }, {
    key: 'filterVisibleAlleles',
    value: function filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, species) {
      var showAll = userChangeableGenes.length + visibleGenes.length === 0;
      return alleles.filter(function (a) {
        if (showAll) return true;

        var gene = BioLogica.Genetics.getGeneOfAllele(species, a),
            geneName = gene ? gene.name : null;
        return userChangeableGenes.indexOf(geneName) > -1 || visibleGenes.indexOf(geneName) > -1;
      }).map(function (a) {
        return {
          allele: a,
          editable: userChangeableGenes.indexOf(BioLogica.Genetics.getGeneOfAllele(species, a).name) > -1
        };
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
    key: 'computeTraitCountsForOrganisms',
    value: function computeTraitCountsForOrganisms(organisms, lastClutchSize) {
      var traits = new Map(),
          clutchSize = lastClutchSize || organisms.length;

      // accumulate stats for each trait/value combination
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = organisms.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              index = _step$value[0],
              org = _step$value[1];

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
    key: 'buildGeneMapFromAlleleString',
    value: function buildGeneMapFromAlleleString(genetics, alleleString) {
      var geneMap = {},
          alleleSubstrings = alleleString.split(",");
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = alleleSubstrings[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var alleleSubstr = _step3.value;

          var _alleleSubstr$split = alleleSubstr.split(":"),
              _alleleSubstr$split2 = _slicedToArray(_alleleSubstr$split, 2),
              side = _alleleSubstr$split2[0],
              allele = _alleleSubstr$split2[1],
              gene = genetics.geneForAllele(allele);

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
    key: 'fillInMissingAllelesFromGeneMap',
    value: function fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap) {
      var dstGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, alleleString);
      var dstAlleleString = alleleString;
      for (var gene in dstGeneMap) {
        var geneValue = dstGeneMap[gene];
        // replace a missing 'a' side allele with the default if appropriate
        if (!geneValue.a && baseGeneMap[gene] && baseGeneMap[gene].a) {
          dstAlleleString = dstAlleleString.replace('b:' + geneValue.b, 'a:' + baseGeneMap[gene].a + ',$&');
        }
        // replace a missing 'b' side allele with the default if appropriate
        if (!geneValue.b && baseGeneMap[gene] && baseGeneMap[gene].b) {
          dstAlleleString = dstAlleleString.replace('a:' + geneValue.a, '$&,b:' + baseGeneMap[gene].b);
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
    key: 'fillInMissingAllelesFromAlleleString',
    value: function fillInMissingAllelesFromAlleleString(genetics, alleleString, baseAlleleString) {
      var baseGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, baseAlleleString);
      return GeneticsUtils.fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap);
    }
  }, {
    key: 'numberOfBreedingMovesToReachDrake',
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
    key: 'numberOfChangesToReachPhenotype',
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
    key: 'numberOfAlleleChangesToReachPhenotype',
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
     * Returns a string containing the alleles present in the fully specified organism, but not in
     * the partially specified organism. For example, if a female and male organism are given, the returned string
     * will represent the sex-linked chromosomes that the male organism lacks.
     *
     * @param {object} fullySpecifiedOrganism - the organism containing the extra alleles
     * @param {object} partiallySpecifiedOrganism - the organism lacking the extra alleles
     * @return {string} - a comma-separated string representing the extra alleles, e.g. "b:D,b:Bog,b:rh"
     */

  }, {
    key: 'computeExtraAlleles',
    value: function computeExtraAlleles(fullySpecifiedOrganism, partiallySpecifiedOrganism) {
      var fullAlleles = fullySpecifiedOrganism.getAlleleString().split(",");
      var partialAlleles = partiallySpecifiedOrganism.getAlleleString().split(",");
      var extraAlleles = fullAlleles.filter(function (allele) {
        return partialAlleles.indexOf(allele) === -1;
      });
      return extraAlleles.join(",");
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
    key: 'collectAllAllelesForTrait',
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

    /**
     * Converts a Drake object into a Biologica organism.
     *
     * @param {object} drake - the drake to convert
     * @param {BioLogica.Organism} the drake as an Organism
     */

  }, {
    key: 'convertDrakeToOrg',
    value: function convertDrakeToOrg(drake) {
      return new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
    }
  }]);

  return GeneticsUtils;
}();

GeneticsUtils._possibleAllelesForTrait = {};
exports.default = GeneticsUtils;

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  // Challenge instructions
  "~FV_EGG_GAME.BREED_BUTTON": "BREED",

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
  "~ALERT.NEW_PIECE_OF_COIN": "You earned a ${0} piece of the coin!",
  "~ALERT.AWARD_LEVEL_GOLD": "gold",
  "~ALERT.AWARD_LEVEL_SILVER": "silver",
  "~ALERT.AWARD_LEVEL_BRONZE": "bronze",
  "~ALERT.COMPLETE_COIN": "You have earned all the pieces of this coin!",
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
  "~BUTTON.END_MISSION": "End mission",
  "~BUTTON.NEXT_MISSION": "Next mission",
  "~BUTTON.PLAYGROUND_MOVE_FORWARD": "Bring It On!",
  "~BUTTON.CHECK_DRAKE": "Check Drake",
  "~BUTTON.SAVE_DRAKE": "Save this",
  "~BUTTON.SUBMIT": "Submit",
  "~BUTTON.RESET": "Reset",
  "~BUTTON.FERTILIZE_DISABLED": "Make a baby",
  "~BUTTON.FERTILIZE": "Make a baby! ❤️",

  // Messages from ITS
  "~ITS.GREETING": "Hi there user!"
};

},{}],83:[function(require,module,exports){
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

},{"./en-us":82}],84:[function(require,module,exports){
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
  var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLang;

  if (typeof key === "string") {
    return translateString(key, lang);
  } else if (Array.isArray(key)) {
    var translation = translateString(key[0], lang);
    return translation.replace(varRegExp, function (match, id) {
      return key[++id] ? translateString(key[id], lang) : error;
    });
  } else if (key != null) {
    console.log("Could not translate: ", key);
  }
  return error;
}

},{"./lang":83}]},{},[80])(80)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9lczYtb2JqZWN0LWFzc2lnbi9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGVyZm9ybWFuY2Utbm93L2xpYi9wZXJmb3JtYW5jZS1ub3cuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JhZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL01vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL1N0YWdnZXJlZE1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL1RyYW5zaXRpb25Nb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9tYXBUb1plcm8uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9tZXJnZURpZmYuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9wcmVzZXRzLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvcmVhY3QtbW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvcmVvcmRlcktleXMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zaG91bGRTdG9wQW5pbWF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3ByaW5nLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RlcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3N0cmlwU3R5bGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi9Nb2RhbE1hbmFnZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL1BvcnRhbC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvdXRpbHMvYWRkRXZlbnRMaXN0ZW5lci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvdXRpbHMvYWRkRm9jdXNMaXN0ZW5lci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvdXRpbHMvZ2V0Q29udGFpbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9pc092ZXJmbG93aW5nLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9tYW5hZ2VBcmlhSGlkZGVuLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2NvbXBvbmVudE9yRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1wcm9wLXR5cGVzL2xpYi9lbGVtZW50VHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1wcm9wLXR5cGVzL2xpYi91dGlscy9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1zaW1wbGV0YWJzL2Rpc3QvcmVhY3Qtc2ltcGxldGFicy5qcyIsIm5vZGVfbW9kdWxlcy93YXJuaW5nL2Jyb3dzZXIuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2Jhc2tldC1zZXQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2J1dHRvbi5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hhbGxlbmdlLWF3YXJkLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaGFuZ2Utc2V4LWJ1dHRvbnMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUtaW1hZ2UuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2VnZy1jbHV0Y2guanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2ZlZWRiYWNrLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS1wb29sLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbmUtbGFiZWwuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS10ZXN0LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dsb3ctYmFja2dyb3VuZC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvbW9kYWwtYWxlcnQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL29yZGluYWwtb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL29yZ2FuaXNtLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL29yZ2FuaXNtLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9wZW4tc3RhdHMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3Blbi5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcXVlc3Rpb24tb3JnYW5pc20tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvc3RhdHMuanMiLCJzcmMvY29kZS9nZW5pYmxvY2tzLmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzLmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL2xhbmcvZW4tdXMuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvbGFuZy9pbmRleC5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy90cmFuc2xhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2poQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzVEQTs7Ozs7O0FBRUEsSUFBTSxv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YyxPQUFwQjtBQUFBLElBQ00sWUFBWSxvQkFEbEI7QUFBQSxJQUVNLFFBQVEseUJBRmQ7O0FBSUEsSUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxHQUFELEVBQU0sSUFBTjtBQUFBLFNBQWUsZUFBYSxJQUFiLEtBQXNCLGVBQWEsSUFBYixFQUFtQixHQUFuQixDQUF0QixJQUFpRCxHQUFoRTtBQUFBLENBQXhCOztBQUVBOzs7Ozs7Ozs7O0FBVWUsU0FBUyxTQUFULENBQW1CLEdBQW5CLEVBQTBDO0FBQUEsTUFBbEIsSUFBa0IsdUVBQWIsV0FBYTs7QUFDdkQsTUFBSSxPQUFPLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUMzQixXQUFPLGdCQUFnQixHQUFoQixFQUFxQixJQUFyQixDQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUksTUFBTSxPQUFOLENBQWMsR0FBZCxDQUFKLEVBQXdCO0FBQzdCLFFBQUksY0FBYyxnQkFBZ0IsSUFBSSxDQUFKLENBQWhCLEVBQXdCLElBQXhCLENBQWxCO0FBQ0EsV0FBTyxZQUFZLE9BQVosQ0FBb0IsU0FBcEIsRUFBK0IsVUFBQyxLQUFELEVBQVEsRUFBUjtBQUFBLGFBQ3BDLElBQUksRUFBRSxFQUFOLElBQVksZ0JBQWdCLElBQUksRUFBSixDQUFoQixFQUF5QixJQUF6QixDQUFaLEdBQTZDLEtBRFQ7QUFBQSxLQUEvQixDQUFQO0FBRUQsR0FKTSxNQUlBLElBQUksT0FBTyxJQUFYLEVBQWlCO0FBQ3RCLFlBQVEsR0FBUixDQUFZLHVCQUFaLEVBQXFDLEdBQXJDO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYWJlbEhlbHBlcnMgPSByZXF1aXJlKCcuL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKlxyXG4gKiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gYWN0aXZlRWxlbWVudDtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gYWN0aXZlRWxlbWVudCgpIHtcbiAgdmFyIGRvYyA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMF07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcbnZhciBoYXNDbGFzcyA9IHJlcXVpcmUoJy4vaGFzQ2xhc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtlbHNlIGlmICghaGFzQ2xhc3MoZWxlbWVudCkpIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgcmV0dXJuICEhY2xhc3NOYW1lICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7ZWxzZSByZXR1cm4gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIGNsYXNzTmFtZSArICcgJykgIT09IC0xO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRDbGFzczogcmVxdWlyZSgnLi9hZGRDbGFzcycpLFxuICByZW1vdmVDbGFzczogcmVxdWlyZSgnLi9yZW1vdmVDbGFzcycpLFxuICBoYXNDbGFzczogcmVxdWlyZSgnLi9oYXNDbGFzcycpXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtlbHNlIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NOYW1lICsgJyg/OlxcXFxzfCQpJywgJ2cnKSwgJyQxJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvZmYgPSBmdW5jdGlvbiBvZmYoKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuXG4gIG9mZiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmY7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvbiA9IGZ1bmN0aW9uIG9uKCkge307XG5cbmlmIChjYW5Vc2VET00pIHtcbiAgb24gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICByZXR1cm4gbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfTtlbHNlIGlmIChkb2N1bWVudC5hdHRhY2hFdmVudCkgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBub2RlLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG93bmVyRG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIG93bmVyRG9jdW1lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcblxudmFyIGNvbnRhaW5zID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJvb3QgPSBjYW5Vc2VET00gJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMgPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0LmNvbnRhaW5zKG5vZGUpO1xuICB9IDogcm9vdCAmJiByb290LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dCA9PT0gbm9kZSB8fCAhIShjb250ZXh0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGUpICYgMTYpO1xuICB9IDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICBpZiAobm9kZSkgZG8ge1xuICAgICAgaWYgKG5vZGUgPT09IGNvbnRleHQpIHJldHVybiB0cnVlO1xuICAgIH0gd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IG5vZGUud2luZG93ID8gbm9kZSA6IG5vZGUubm9kZVR5cGUgPT09IDkgPyBub2RlLmRlZmF1bHRWaWV3IHx8IG5vZGUucGFyZW50V2luZG93IDogZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4uL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbnZhciBfdXRpbENhbWVsaXplU3R5bGUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZTIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsQ2FtZWxpemVTdHlsZSk7XG5cbnZhciBycG9zaXRpb24gPSAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC87XG52YXIgcm51bW5vbnB4ID0gL14oWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpKSg/IXB4KVthLXolXSskL2k7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2dldENvbXB1dGVkU3R5bGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIEVsZW1lbnQgcGFzc2VkIHRvIGBnZXRDb21wdXRlZFN0eWxlKClgJyk7XG4gIHZhciBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgcmV0dXJuICdkZWZhdWx0VmlldycgaW4gZG9jID8gZG9jLmRlZmF1bHRWaWV3Lm9wZW5lciA/IG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB7IC8vaWUgOCBcIm1hZ2ljXCIgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8xLjExLXN0YWJsZS9zcmMvY3NzL2N1ckNTUy5qcyNMNzJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlKHByb3ApIHtcbiAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG5cbiAgICAgIHByb3AgPSAoMCwgX3V0aWxDYW1lbGl6ZVN0eWxlMlsnZGVmYXVsdCddKShwcm9wKTtcblxuICAgICAgaWYgKHByb3AgPT0gJ2Zsb2F0JykgcHJvcCA9ICdzdHlsZUZsb2F0JztcblxuICAgICAgdmFyIGN1cnJlbnQgPSBub2RlLmN1cnJlbnRTdHlsZVtwcm9wXSB8fCBudWxsO1xuXG4gICAgICBpZiAoY3VycmVudCA9PSBudWxsICYmIHN0eWxlICYmIHN0eWxlW3Byb3BdKSBjdXJyZW50ID0gc3R5bGVbcHJvcF07XG5cbiAgICAgIGlmIChybnVtbm9ucHgudGVzdChjdXJyZW50KSAmJiAhcnBvc2l0aW9uLnRlc3QocHJvcCkpIHtcbiAgICAgICAgLy8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xuICAgICAgICB2YXIgbGVmdCA9IHN0eWxlLmxlZnQ7XG4gICAgICAgIHZhciBydW5TdHlsZSA9IG5vZGUucnVudGltZVN0eWxlO1xuICAgICAgICB2YXIgcnNMZWZ0ID0gcnVuU3R5bGUgJiYgcnVuU3R5bGUubGVmdDtcblxuICAgICAgICAvLyBQdXQgaW4gdGhlIG5ldyB2YWx1ZXMgdG8gZ2V0IGEgY29tcHV0ZWQgdmFsdWUgb3V0XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSBub2RlLmN1cnJlbnRTdHlsZS5sZWZ0O1xuXG4gICAgICAgIHN0eWxlLmxlZnQgPSBwcm9wID09PSAnZm9udFNpemUnID8gJzFlbScgOiBjdXJyZW50O1xuICAgICAgICBjdXJyZW50ID0gc3R5bGUucGl4ZWxMZWZ0ICsgJ3B4JztcblxuICAgICAgICAvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG4gICAgICAgIHN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgICAgICBpZiAocnNMZWZ0KSBydW5TdHlsZS5sZWZ0ID0gcnNMZWZ0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi4vdXRpbC9jYW1lbGl6ZVN0eWxlJyksXG4gICAgaHlwaGVuYXRlID0gcmVxdWlyZSgnLi4vdXRpbC9oeXBoZW5hdGVTdHlsZScpLFxuICAgIF9nZXRDb21wdXRlZFN0eWxlID0gcmVxdWlyZSgnLi9nZXRDb21wdXRlZFN0eWxlJyksXG4gICAgcmVtb3ZlU3R5bGUgPSByZXF1aXJlKCcuL3JlbW92ZVN0eWxlJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlKG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICB2YXIgY3NzID0gJycsXG4gICAgICBwcm9wcyA9IHByb3BlcnR5O1xuXG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vZGUuc3R5bGVbY2FtZWxpemUocHJvcGVydHkpXSB8fCBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5nZXRQcm9wZXJ0eVZhbHVlKGh5cGhlbmF0ZShwcm9wZXJ0eSkpO2Vsc2UgKHByb3BzID0ge30pW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSBpZiAoaGFzLmNhbGwocHJvcHMsIGtleSkpIHtcbiAgICAhcHJvcHNba2V5XSAmJiBwcm9wc1trZXldICE9PSAwID8gcmVtb3ZlU3R5bGUobm9kZSwgaHlwaGVuYXRlKGtleSkpIDogY3NzICs9IGh5cGhlbmF0ZShrZXkpICsgJzonICsgcHJvcHNba2V5XSArICc7JztcbiAgfVxuXG4gIG5vZGUuc3R5bGUuY3NzVGV4dCArPSAnOycgKyBjc3M7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVTdHlsZShub2RlLCBrZXkpIHtcbiAgcmV0dXJuICdyZW1vdmVQcm9wZXJ0eScgaW4gbm9kZS5zdHlsZSA/IG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KSA6IG5vZGUuc3R5bGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59OyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW1wiZXhwb3J0c1wiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2Uge1xuICAgIGZhY3Rvcnkocm9vdC5iYWJlbEhlbHBlcnMgPSB7fSk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIGJhYmVsSGVscGVycyA9IGdsb2JhbDtcblxuICBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICBcImRlZmF1bHRcIjogb2JqXG4gICAgfTtcbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHJIeXBoZW4gPSAvLSguKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uockh5cGhlbiwgZnVuY3Rpb24gKF8sIGNocikge1xuICAgIHJldHVybiBjaHIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59OyIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yYWViOGEyYTZiZWIwMDYxN2E0MjE3ZjdmODI4NDkyNGZhMmFkODE5L3NyYy92ZW5kb3IvY29yZS9jYW1lbGl6ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi9jYW1lbGl6ZScpO1xudmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBjYW1lbGl6ZShzdHJpbmcucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJVcHBlciA9IC8oW0EtWl0pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoclVwcGVyLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2h5cGhlbmF0ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoeXBoZW5hdGUgPSByZXF1aXJlKFwiLi9oeXBoZW5hdGVcIik7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCBcIi1tcy1cIik7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuL2luRE9NJyk7XG5cbnZhciBzaXplO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNhbGMpIHtcbiAgaWYgKCFzaXplIHx8IHJlY2FsYykge1xuICAgIGlmIChjYW5Vc2VET00pIHtcbiAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgIHNpemUgPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNpemU7XG59OyIsIi8qKlxuICogQ29kZSByZWZhY3RvcmVkIGZyb20gTW96aWxsYSBEZXZlbG9wZXIgTmV0d29yazpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3QnKTtcbiAgfVxuXG4gIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgZm9yICh2YXIgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xuICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufVxuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogYXNzaWduXG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2lnbjogYXNzaWduLFxuICBwb2x5ZmlsbDogcG9seWZpbGxcbn07XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNy4xXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIHJvb3QgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSByb290WydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSByb290WydjYW5jZWwnICsgc3VmZml4XSB8fCByb290WydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cblxuZm9yKHZhciBpID0gMDsgIXJhZiAmJiBpIDwgdmVuZG9ycy5sZW5ndGg7IGkrKykge1xuICByYWYgPSByb290W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdDYW5jZWwnICsgc3VmZml4XVxuICAgICAgfHwgcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgdmFyIGxhc3QgPSAwXG4gICAgLCBpZCA9IDBcbiAgICAsIHF1ZXVlID0gW11cbiAgICAsIGZyYW1lRHVyYXRpb24gPSAxMDAwIC8gNjBcblxuICByYWYgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKVxuICAgICAgICAsIG5leHQgPSBNYXRoLm1heCgwLCBmcmFtZUR1cmF0aW9uIC0gKF9ub3cgLSBsYXN0KSlcbiAgICAgIGxhc3QgPSBuZXh0ICsgX25vd1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNwID0gcXVldWUuc2xpY2UoMClcbiAgICAgICAgLy8gQ2xlYXIgcXVldWUgaGVyZSB0byBwcmV2ZW50XG4gICAgICAgIC8vIGNhbGxiYWNrcyBmcm9tIGFwcGVuZGluZyBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgZnJhbWUncyBxdWV1ZVxuICAgICAgICBxdWV1ZS5sZW5ndGggPSAwXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmKCFjcFtpXS5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgY3BbaV0uY2FsbGJhY2sobGFzdClcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBNYXRoLnJvdW5kKG5leHQpKVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKHtcbiAgICAgIGhhbmRsZTogKytpZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNhbmNlbGxlZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiBpZFxuICB9XG5cbiAgY2FmID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihxdWV1ZVtpXS5oYW5kbGUgPT09IGhhbmRsZSkge1xuICAgICAgICBxdWV1ZVtpXS5jYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4pIHtcbiAgLy8gV3JhcCBpbiBhIG5ldyBmdW5jdGlvbiB0byBwcmV2ZW50XG4gIC8vIGBjYW5jZWxgIHBvdGVudGlhbGx5IGJlaW5nIGFzc2lnbmVkXG4gIC8vIHRvIHRoZSBuYXRpdmUgckFGIGZ1bmN0aW9uXG4gIHJldHVybiByYWYuY2FsbChyb290LCBmbilcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkocm9vdCwgYXJndW1lbnRzKVxufVxubW9kdWxlLmV4cG9ydHMucG9seWZpbGwgPSBmdW5jdGlvbigpIHtcbiAgcm9vdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByYWZcbiAgcm9vdC5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhZlxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxudmFyIE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKSxcbiAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uUmVzdDogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZSA9IF9wcm9wcy5kZWZhdWx0U3R5bGU7XG4gICAgdmFyIHN0eWxlID0gX3Byb3BzLnN0eWxlO1xuXG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IGRlZmF1bHRTdHlsZSB8fCBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZSk7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10oY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSxcbiAgICAgIGxhc3RJZGVhbFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5XG4gICAgfTtcbiAgfSxcblxuICB3YXNBbmltYXRpbmc6IGZhbHNlLFxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGU6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKGRlc3RTdHlsZSkge1xuICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuICAgIHZhciBfc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBjdXJyZW50U3R5bGUgPSBfc3RhdGUuY3VycmVudFN0eWxlO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdHkgPSBfc3RhdGUuY3VycmVudFZlbG9jaXR5O1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZSA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdHkgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdHk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXN0U3R5bGUsIGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdHlsZVZhbHVlID0gZGVzdFN0eWxlW2tleV07XG4gICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgY3VycmVudFN0eWxlID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZSk7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXR5ID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0eSk7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGUgPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGUpO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5ID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgY3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICBsYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgbGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpcnR5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsIGN1cnJlbnRWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5LCBsYXN0SWRlYWxTdHlsZTogbGFzdElkZWFsU3R5bGUsIGxhc3RJZGVhbFZlbG9jaXR5OiBsYXN0SWRlYWxWZWxvY2l0eSB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAodGltZXN0YW1wKSB7XG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICB2YXIgcHJvcHNTdHlsZSA9IF90aGlzLnByb3BzLnN0eWxlO1xuICAgICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSwgcHJvcHNTdHlsZSwgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXR5KSkge1xuICAgICAgICBpZiAoX3RoaXMud2FzQW5pbWF0aW5nICYmIF90aGlzLnByb3BzLm9uUmVzdCkge1xuICAgICAgICAgIF90aGlzLnByb3BzLm9uUmVzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLndhc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzLndhc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IHRpbWVzdGFtcCB8fCBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIF90aGlzLnByZXZUaW1lO1xuICAgICAgX3RoaXMucHJldlRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IF90aGlzLmFjY3VtdWxhdGVkVGltZSArIHRpbWVEZWx0YTtcbiAgICAgIC8vIG1vcmUgdGhhbiAxMCBmcmFtZXM/IHByb2xseSBzd2l0Y2hlZCBicm93c2VyIHRhYi4gUmVzdGFydFxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA+IG1zUGVyRnJhbWUgKiAxMCkge1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID09PSAwKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRGcmFtZUNvbXBsZXRpb24gPSAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKSAqIG1zUGVyRnJhbWUpIC8gbXNQZXJGcmFtZTtcbiAgICAgIHZhciBmcmFtZXNUb0NhdGNoVXAgPSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpO1xuXG4gICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGUgPSB7fTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0eSA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNTdHlsZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwcm9wc1N0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZVtrZXldO1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdHlba2V5XTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZyYW1lc1RvQ2F0Y2hVcDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgIHZhciBuZXh0SWRlYWxWID0gX3N0ZXBwZXIyWzFdO1xuXG4gICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgLy8gdGhlIGFtb3VudCB3ZSdyZSBsb29wZWQgb3ZlciBhYm92ZVxuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC09IGZyYW1lc1RvQ2F0Y2hVcCAqIG1zUGVyRnJhbWU7XG5cbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFN0eWxlOiBuZXdDdXJyZW50U3R5bGUsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eTogbmV3Q3VycmVudFZlbG9jaXR5LFxuICAgICAgICBsYXN0SWRlYWxTdHlsZTogbmV3TGFzdElkZWFsU3R5bGUsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5OiBuZXdMYXN0SWRlYWxWZWxvY2l0eVxuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZSA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCkge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlKTtcbiAgICB9XG5cbiAgICB0aGlzLnVucmVhZFByb3BTdHlsZSA9IHByb3BzLnN0eWxlO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUuY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BlcmZvcm1hbmNlTm93KTtcblxudmFyIF9yYWYgPSByZXF1aXJlKCdyYWYnKTtcblxudmFyIF9yYWYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmFmKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9zaG91bGRTdG9wQW5pbWF0aW9uJyk7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaG91bGRTdG9wQW5pbWF0aW9uKTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIG1zUGVyRnJhbWUgPSAxMDAwIC8gNjA7XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgc3R5bGVzLCBjdXJyZW50VmVsb2NpdGllcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIV9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZXNbaV0sIHN0eWxlc1tpXSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG52YXIgU3RhZ2dlcmVkTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTdGFnZ2VyZWRNb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFRPT0Q6IHdhcm4gYWdhaW5zdCBwdXR0aW5nIGEgY29uZmlnIGluIGhlcmVcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm51bWJlcikpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZXMgPSBfcHJvcHMuZGVmYXVsdFN0eWxlcztcbiAgICB2YXIgc3R5bGVzID0gX3Byb3BzLnN0eWxlcztcblxuICAgIHZhciBjdXJyZW50U3R5bGVzID0gZGVmYXVsdFN0eWxlcyB8fCBzdHlsZXMoKS5tYXAoX3N0cmlwU3R5bGUyWydkZWZhdWx0J10pO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IGN1cnJlbnRTdHlsZXMubWFwKGZ1bmN0aW9uIChjdXJyZW50U3R5bGUpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllc1xuICAgIH07XG4gIH0sXG5cbiAgYW5pbWF0aW9uSUQ6IG51bGwsXG4gIHByZXZUaW1lOiAwLFxuICBhY2N1bXVsYXRlZFRpbWU6IDAsXG4gIC8vIGl0J3MgcG9zc2libGUgdGhhdCBjdXJyZW50U3R5bGUncyB2YWx1ZSBpcyBzdGFsZTogaWYgcHJvcHMgaXMgaW1tZWRpYXRlbHlcbiAgLy8gY2hhbmdlZCBmcm9tIDAgdG8gNDAwIHRvIHNwcmluZygwKSBhZ2FpbiwgdGhlIGFzeW5jIGN1cnJlbnRTdHlsZSBpcyBzdGlsbFxuICAvLyBhdCAwIChkaWRuJ3QgaGF2ZSB0aW1lIHRvIHRpY2sgYW5kIGludGVycG9sYXRlIGV2ZW4gb25jZSkuIElmIHdlIG5haXZlbHlcbiAgLy8gY29tcGFyZSBjdXJyZW50U3R5bGUgd2l0aCBkZXN0VmFsIGl0J2xsIGJlIDAgPT09IDAgKG5vIGFuaW1hdGlvbiwgc3RvcCkuXG4gIC8vIEluIHJlYWxpdHkgY3VycmVudFN0eWxlIHNob3VsZCBiZSA0MDBcbiAgdW5yZWFkUHJvcFN0eWxlczogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKHVucmVhZFByb3BTdHlsZXMpIHtcbiAgICB2YXIgX3N0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9zdGF0ZS5jdXJyZW50U3R5bGVzO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9zdGF0ZS5jdXJyZW50VmVsb2NpdGllcztcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX3N0YXRlLmxhc3RJZGVhbFN0eWxlcztcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzO1xuXG4gICAgdmFyIHNvbWVEaXJ0eSA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV07XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh1bnJlYWRQcm9wU3R5bGUsIGtleSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHlsZVZhbHVlID0gdW5yZWFkUHJvcFN0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBzb21lRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgY3VycmVudFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxTdHlsZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzb21lRGlydHkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLCBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsIGxhc3RJZGVhbFN0eWxlczogbGFzdElkZWFsU3R5bGVzLCBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzIH0pO1xuICAgIH1cbiAgfSxcblxuICBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5OiBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBUT0RPOiB3aGVuIGNvbmZpZyBpcyB7YTogMTB9IGFuZCBkZXN0IGlzIHthOiAxMH0gZG8gd2UgcmFmIG9uY2UgYW5kXG4gICAgLy8gY2FsbCBjYj8gTm8sIG90aGVyd2lzZSBhY2NpZGVudGFsIHBhcmVudCByZXJlbmRlciBjYXVzZXMgY2IgdHJpZ2dlclxuICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBfcmFmMlsnZGVmYXVsdCddKGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAgIHZhciBkZXN0U3R5bGVzID0gX3RoaXMucHJvcHMuc3R5bGVzKF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcyk7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYW5pbWF0ZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgIGlmIChzaG91bGRTdG9wQW5pbWF0aW9uQWxsKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzKSkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSB0aW1lc3RhbXAgfHwgX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXN0U3R5bGUgPSBkZXN0U3R5bGVzW2ldO1xuICAgICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBkZXN0U3R5bGUpIHtcbiAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkZXN0U3R5bGUsIGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdHlsZVZhbHVlID0gZGVzdFN0eWxlW2tleV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllc1tpXVtrZXldO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBmcmFtZXNUb0NhdGNoVXA7IGorKykge1xuICAgICAgICAgICAgICB2YXIgX3N0ZXBwZXIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3N0ZXBwZXJbMF07XG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfc3RlcHBlclsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9zdGVwcGVyMiA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsWCA9IF9zdGVwcGVyMlswXTtcbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxWID0gX3N0ZXBwZXIyWzFdO1xuXG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgKyAobmV4dElkZWFsWCAtIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSArIChuZXh0SWRlYWxWIC0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gbmV3Q3VycmVudFN0eWxlO1xuICAgICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IG5ld0N1cnJlbnRWZWxvY2l0eTtcbiAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gbmV3TGFzdElkZWFsU3R5bGU7XG4gICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgLy8gdGhlIGFtb3VudCB3ZSdyZSBsb29wZWQgb3ZlciBhYm92ZVxuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC09IGZyYW1lc1RvQ2F0Y2hVcCAqIG1zUGVyRnJhbWU7XG5cbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFN0eWxlczogbmV3Q3VycmVudFN0eWxlcyxcbiAgICAgICAgY3VycmVudFZlbG9jaXRpZXM6IG5ld0N1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgICBsYXN0SWRlYWxTdHlsZXM6IG5ld0xhc3RJZGVhbFN0eWxlcyxcbiAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogbmV3TGFzdElkZWFsVmVsb2NpdGllc1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZXMgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlcyAhPSBudWxsKSB7XG4gICAgICAvLyBwcmV2aW91cyBwcm9wcyBoYXZlbid0IGhhZCB0aGUgY2hhbmNlIHRvIGJlIHNldCB5ZXQ7IHNldCB0aGVtIGhlcmVcbiAgICAgIHRoaXMuY2xlYXJVbnJlYWRQcm9wU3R5bGUodGhpcy51bnJlYWRQcm9wU3R5bGVzKTtcbiAgICB9XG5cbiAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBwcm9wcy5zdHlsZXModGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUuY3VycmVudFN0eWxlcyk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTdGFnZ2VyZWRNb3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfbWVyZ2VEaWZmID0gcmVxdWlyZSgnLi9tZXJnZURpZmYnKTtcblxudmFyIF9tZXJnZURpZmYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVyZ2VEaWZmKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BlcmZvcm1hbmNlTm93KTtcblxudmFyIF9yYWYgPSByZXF1aXJlKCdyYWYnKTtcblxudmFyIF9yYWYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmFmKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9zaG91bGRTdG9wQW5pbWF0aW9uJyk7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaG91bGRTdG9wQW5pbWF0aW9uKTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIG1zUGVyRnJhbWUgPSAxMDAwIC8gNjA7XG5cbi8vIHRoZSBjaGlsZHJlbiBmdW5jdGlvbiAmIChwb3RlbnRpYWwpIHN0eWxlcyBmdW5jdGlvbiBhc2tzIGFzIHBhcmFtIGFuXG4vLyBBcnJheTxUcmFuc2l0aW9uUGxhaW5TdHlsZT4sIHdoZXJlIGVhY2ggVHJhbnNpdGlvblBsYWluU3R5bGUgaXMgb2YgdGhlIGZvcm1hdFxuLy8ge2tleTogc3RyaW5nLCBkYXRhPzogYW55LCBzdHlsZTogUGxhaW5TdHlsZX0uIEhvd2V2ZXIsIHRoZSB3YXkgd2Uga2VlcFxuLy8gaW50ZXJuYWwgc3RhdGVzIGRvZXNuJ3QgY29udGFpbiBzdWNoIGEgZGF0YSBzdHJ1Y3R1cmUgKGNoZWNrIHRoZSBzdGF0ZSBhbmRcbi8vIFRyYW5zaXRpb25Nb3Rpb25TdGF0ZSkuIFNvIHdoZW4gY2hpbGRyZW4gZnVuY3Rpb24gYW5kIG90aGVycyBhc2sgZm9yIHN1Y2hcbi8vIGRhdGEgd2UgbmVlZCB0byBnZW5lcmF0ZSB0aGVtIG9uIHRoZSBmbHkgYnkgY29tYmluaW5nIG1lcmdlZFByb3BzU3R5bGVzIGFuZFxuLy8gY3VycmVudFN0eWxlcy9sYXN0SWRlYWxTdHlsZXNcbmZ1bmN0aW9uIHJlaHlkcmF0ZVN0eWxlcyhtZXJnZWRQcm9wc1N0eWxlcywgdW5yZWFkUHJvcFN0eWxlcywgcGxhaW5TdHlsZXMpIHtcbiAgLy8gQ29weSB0aGUgdmFsdWUgdG8gYSBgY29uc3RgIHNvIHRoYXQgRmxvdyB1bmRlcnN0YW5kcyB0aGF0IHRoZSBjb25zdCB3b24ndFxuICAvLyBjaGFuZ2UgYW5kIHdpbGwgYmUgbm9uLW51bGxhYmxlIGluIHRoZSBjYWxsYmFjayBiZWxvdy5cbiAgdmFyIGNVbnJlYWRQcm9wU3R5bGVzID0gdW5yZWFkUHJvcFN0eWxlcztcbiAgaWYgKGNVbnJlYWRQcm9wU3R5bGVzID09IG51bGwpIHtcbiAgICByZXR1cm4gbWVyZ2VkUHJvcHNTdHlsZXMubWFwKGZ1bmN0aW9uIChtZXJnZWRQcm9wc1N0eWxlLCBpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IG1lcmdlZFByb3BzU3R5bGUua2V5LFxuICAgICAgICBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlLmRhdGEsXG4gICAgICAgIHN0eWxlOiBwbGFpblN0eWxlc1tpXVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkUHJvcHNTdHlsZXMubWFwKGZ1bmN0aW9uIChtZXJnZWRQcm9wc1N0eWxlLCBpKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBjVW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGNVbnJlYWRQcm9wU3R5bGVzW2pdLmtleSA9PT0gbWVyZ2VkUHJvcHNTdHlsZS5rZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IGNVbnJlYWRQcm9wU3R5bGVzW2pdLmtleSxcbiAgICAgICAgICBkYXRhOiBjVW5yZWFkUHJvcFN0eWxlc1tqXS5kYXRhLFxuICAgICAgICAgIHN0eWxlOiBwbGFpblN0eWxlc1tpXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IG1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBwbGFpblN0eWxlc1tpXSB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChjdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBjdXJyZW50VmVsb2NpdGllcywgbWVyZ2VkUHJvcHNTdHlsZXMpIHtcbiAgaWYgKG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aCAhPT0gZGVzdFN0eWxlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSAhPT0gZGVzdFN0eWxlc1tpXS5rZXkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyB3ZSBoYXZlIHRoZSBpbnZhcmlhbnQgdGhhdCBtZXJnZWRQcm9wc1N0eWxlcyBhbmRcbiAgLy8gY3VycmVudFN0eWxlcy9jdXJyZW50VmVsb2NpdGllcy9sYXN0KiBhcmUgc3luY2VkIGluIHRlcm1zIG9mIGNlbGxzLCBzZWVcbiAgLy8gbWVyZ2VBbmRTeW5jIGNvbW1lbnQgZm9yIG1vcmUgaW5mb1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBkZXN0U3R5bGVzW2ldLnN0eWxlLCBjdXJyZW50VmVsb2NpdGllc1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gY29yZSBrZXkgbWVyZ2luZyBsb2dpY1xuXG4vLyB0aGluZ3MgdG8gZG86IHNheSBwcmV2aW91c2x5IG1lcmdlZCBzdHlsZSBpcyB7YSwgYn0sIGRlc3Qgc3R5bGUgKHByb3ApIGlzIHtiLFxuLy8gY30sIHByZXZpb3VzIGN1cnJlbnQgKGludGVycG9sYXRpbmcpIHN0eWxlIGlzIHthLCBifVxuLy8gKippbnZhcmlhbnQqKjogY3VycmVudFtpXSBjb3JyZXNwb25kcyB0byBtZXJnZWRbaV0gaW4gdGVybXMgb2Yga2V5XG5cbi8vIHN0ZXBzOlxuLy8gdHVybiBtZXJnZWQgc3R5bGUgaW50byB7YT8sIGIsIGN9XG4vLyAgICBhZGQgYywgdmFsdWUgb2YgYyBpcyBkZXN0U3R5bGVzLmNcbi8vICAgIG1heWJlIHJlbW92ZSBhLCBha2EgY2FsbCB3aWxsTGVhdmUoYSksIHRoZW4gbWVyZ2VkIGlzIGVpdGhlciB7YiwgY30gb3Ige2EsIGIsIGN9XG4vLyB0dXJuIGN1cnJlbnQgKGludGVycG9sYXRpbmcpIHN0eWxlIGZyb20ge2EsIGJ9IGludG8ge2E/LCBiLCBjfVxuLy8gICAgbWF5YmUgcmVtb3ZlIGFcbi8vICAgIGNlcnRhaW5seSBhZGQgYywgdmFsdWUgb2YgYyBpcyB3aWxsRW50ZXIoYylcbi8vIGxvb3Agb3ZlciBtZXJnZWQgYW5kIGNvbnN0cnVjdCBuZXcgY3VycmVudFxuLy8gZGVzdCBkb2Vzbid0IGNoYW5nZSwgdGhhdCdzIG93bmVyJ3NcbmZ1bmN0aW9uIG1lcmdlQW5kU3luYyh3aWxsRW50ZXIsIHdpbGxMZWF2ZSwgZGlkTGVhdmUsIG9sZE1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBvbGRDdXJyZW50U3R5bGVzLCBvbGRDdXJyZW50VmVsb2NpdGllcywgb2xkTGFzdElkZWFsU3R5bGVzLCBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzKSB7XG4gIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZURpZmYyWydkZWZhdWx0J10ob2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIGZ1bmN0aW9uIChvbGRJbmRleCwgb2xkTWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgIHZhciBsZWF2aW5nU3R5bGUgPSB3aWxsTGVhdmUob2xkTWVyZ2VkUHJvcHNTdHlsZSk7XG4gICAgaWYgKGxlYXZpbmdTdHlsZSA9PSBudWxsKSB7XG4gICAgICBkaWRMZWF2ZSh7IGtleTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5rZXksIGRhdGE6IG9sZE1lcmdlZFByb3BzU3R5bGUuZGF0YSB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10ob2xkQ3VycmVudFN0eWxlc1tvbGRJbmRleF0sIGxlYXZpbmdTdHlsZSwgb2xkQ3VycmVudFZlbG9jaXRpZXNbb2xkSW5kZXhdKSkge1xuICAgICAgZGlkTGVhdmUoeyBrZXk6IG9sZE1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBvbGRNZXJnZWRQcm9wc1N0eWxlLmRhdGEgfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHsga2V5OiBvbGRNZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5kYXRhLCBzdHlsZTogbGVhdmluZ1N0eWxlIH07XG4gIH0pO1xuXG4gIHZhciBuZXdDdXJyZW50U3R5bGVzID0gW107XG4gIHZhciBuZXdDdXJyZW50VmVsb2NpdGllcyA9IFtdO1xuICB2YXIgbmV3TGFzdElkZWFsU3R5bGVzID0gW107XG4gIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3TWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwgPSBuZXdNZXJnZWRQcm9wc1N0eWxlc1tpXTtcbiAgICB2YXIgZm91bmRPbGRJbmRleCA9IG51bGw7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBvbGRNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKG9sZE1lcmdlZFByb3BzU3R5bGVzW2pdLmtleSA9PT0gbmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwua2V5KSB7XG4gICAgICAgIGZvdW5kT2xkSW5kZXggPSBqO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVE9ETzoga2V5IHNlYXJjaCBjb2RlXG4gICAgaWYgKGZvdW5kT2xkSW5kZXggPT0gbnVsbCkge1xuICAgICAgdmFyIHBsYWluU3R5bGUgPSB3aWxsRW50ZXIobmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwpO1xuICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IHBsYWluU3R5bGU7XG4gICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBwbGFpblN0eWxlO1xuXG4gICAgICB2YXIgdmVsb2NpdHkgPSBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKG5ld01lcmdlZFByb3BzU3R5bGVDZWxsLnN0eWxlKTtcbiAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gdmVsb2NpdHk7XG4gICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gdmVsb2NpdHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBvbGRDdXJyZW50U3R5bGVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gb2xkTGFzdElkZWFsU3R5bGVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBvbGRDdXJyZW50VmVsb2NpdGllc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbbmV3TWVyZ2VkUHJvcHNTdHlsZXMsIG5ld0N1cnJlbnRTdHlsZXMsIG5ld0N1cnJlbnRWZWxvY2l0aWVzLCBuZXdMYXN0SWRlYWxTdHlsZXMsIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNdO1xufVxuXG52YXIgVHJhbnNpdGlvbk1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVHJhbnNpdGlvbk1vdGlvbicsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVmYXVsdFN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAga2V5OiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGF0YTogX3JlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZFxuICAgIH0pKSxcbiAgICBzdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLmZ1bmMsIF9yZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihfcmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGtleTogX3JlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGE6IF9yZWFjdC5Qcm9wVHlwZXMuYW55LFxuICAgICAgc3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdF0pKS5pc1JlcXVpcmVkXG4gICAgfSkpXSkuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgd2lsbEVudGVyOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgd2lsbExlYXZlOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGlkTGVhdmU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWxsRW50ZXI6IGZ1bmN0aW9uIHdpbGxFbnRlcihzdHlsZVRoYXRFbnRlcmVkKSB7XG4gICAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZVRoYXRFbnRlcmVkLnN0eWxlKTtcbiAgICAgIH0sXG4gICAgICAvLyByZWNhbGw6IHJldHVybmluZyBudWxsIG1ha2VzIHRoZSBjdXJyZW50IHVubW91bnRpbmcgVHJhbnNpdGlvblN0eWxlXG4gICAgICAvLyBkaXNhcHBlYXIgaW1tZWRpYXRlbHlcbiAgICAgIHdpbGxMZWF2ZTogZnVuY3Rpb24gd2lsbExlYXZlKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICBkaWRMZWF2ZTogZnVuY3Rpb24gZGlkTGVhdmUoKSB7fVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZXMgPSBfcHJvcHMuZGVmYXVsdFN0eWxlcztcbiAgICB2YXIgc3R5bGVzID0gX3Byb3BzLnN0eWxlcztcbiAgICB2YXIgd2lsbEVudGVyID0gX3Byb3BzLndpbGxFbnRlcjtcbiAgICB2YXIgd2lsbExlYXZlID0gX3Byb3BzLndpbGxMZWF2ZTtcbiAgICB2YXIgZGlkTGVhdmUgPSBfcHJvcHMuZGlkTGVhdmU7XG5cbiAgICB2YXIgZGVzdFN0eWxlcyA9IHR5cGVvZiBzdHlsZXMgPT09ICdmdW5jdGlvbicgPyBzdHlsZXMoZGVmYXVsdFN0eWxlcykgOiBzdHlsZXM7XG5cbiAgICAvLyB0aGlzIGlzIHNwZWNpYWwuIGZvciB0aGUgZmlyc3QgdGltZSBhcm91bmQsIHdlIGRvbid0IGhhdmUgYSBjb21wYXJpc29uXG4gICAgLy8gYmV0d2VlbiBsYXN0IChubyBsYXN0KSBhbmQgY3VycmVudCBtZXJnZWQgcHJvcHMuIHdlJ2xsIGNvbXB1dGUgbGFzdCBzbzpcbiAgICAvLyBzYXkgZGVmYXVsdCBpcyB7YSwgYn0gYW5kIHN0eWxlcyAoZGVzdCBzdHlsZSkgaXMge2IsIGN9LCB3ZSdsbFxuICAgIC8vIGZhYnJpY2F0ZSBsYXN0IGFzIHthLCBifVxuICAgIHZhciBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZGVmYXVsdFN0eWxlcyA9PSBudWxsKSB7XG4gICAgICBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IGRlc3RTdHlsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKGRlZmF1bHRTdHlsZUNlbGwpIHtcbiAgICAgICAgLy8gVE9ETzoga2V5IHNlYXJjaCBjb2RlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChkZXN0U3R5bGVzW2ldLmtleSA9PT0gZGVmYXVsdFN0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0U3R5bGVzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFN0eWxlQ2VsbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgb2xkQ3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSkgOiBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuICAgIHZhciBvbGRDdXJyZW50VmVsb2NpdGllcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KTtcblxuICAgIHZhciBfbWVyZ2VBbmRTeW5jID0gbWVyZ2VBbmRTeW5jKFxuICAgIC8vIEJlY2F1c2UgdGhpcyBpcyBhbiBvbGQtc3R5bGUgUmVhY3QuY3JlYXRlQ2xhc3MgY29tcG9uZW50LCBGbG93IGRvZXNuJ3RcbiAgICAvLyB1bmRlcnN0YW5kIHRoYXQgdGhlIHdpbGxFbnRlciBhbmQgd2lsbExlYXZlIHByb3BzIGhhdmUgZGVmYXVsdCB2YWx1ZXNcbiAgICAvLyBhbmQgd2lsbCBhbHdheXMgYmUgcHJlc2VudC5cbiAgICB3aWxsRW50ZXIsIHdpbGxMZWF2ZSwgZGlkTGVhdmUsIG9sZE1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBvbGRDdXJyZW50U3R5bGVzLCBvbGRDdXJyZW50VmVsb2NpdGllcywgb2xkQ3VycmVudFN0eWxlcywgLy8gb2xkTGFzdElkZWFsU3R5bGVzIHJlYWxseVxuICAgIG9sZEN1cnJlbnRWZWxvY2l0aWVzKTtcblxuICAgIHZhciBtZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZUFuZFN5bmNbMF07XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzFdO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmNbMl07XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlcyA9IF9tZXJnZUFuZFN5bmNbM107XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jWzRdO1xuICAgIC8vIG9sZExhc3RJZGVhbFZlbG9jaXRpZXMgcmVhbGx5XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFN0eWxlczogY3VycmVudFN0eWxlcyxcbiAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcyxcbiAgICAgIGxhc3RJZGVhbFN0eWxlczogbGFzdElkZWFsU3R5bGVzLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogbGFzdElkZWFsVmVsb2NpdGllcyxcbiAgICAgIG1lcmdlZFByb3BzU3R5bGVzOiBtZXJnZWRQcm9wc1N0eWxlc1xuICAgIH07XG4gIH0sXG5cbiAgdW5tb3VudGluZzogZmFsc2UsXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9tZXJnZUFuZFN5bmMyID0gbWVyZ2VBbmRTeW5jKHRoaXMucHJvcHMud2lsbEVudGVyLCB0aGlzLnByb3BzLndpbGxMZWF2ZSwgdGhpcy5wcm9wcy5kaWRMZWF2ZSwgdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzKTtcblxuICAgIHZhciBtZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZUFuZFN5bmMyWzBdO1xuICAgIHZhciBjdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luYzJbMV07XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzJbMl07XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMyWzNdO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzJbNF07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1bnJlYWRQcm9wU3R5bGUgPSB1bnJlYWRQcm9wU3R5bGVzW2ldLnN0eWxlO1xuICAgICAgdmFyIGRpcnR5ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB1bnJlYWRQcm9wU3R5bGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodW5yZWFkUHJvcFN0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgY3VycmVudFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxTdHlsZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIG1lcmdlZFByb3BzU3R5bGVzW2ldID0ge1xuICAgICAgICAgICAgICBrZXk6IG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSxcbiAgICAgICAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0uZGF0YSxcbiAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0uc3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bmxpa2UgdGhlIG90aGVyIDIgY29tcG9uZW50cywgd2UgY2FuJ3QgZGV0ZWN0IHN0YWxlbmVzcyBhbmQgb3B0aW9uYWxseVxuICAgIC8vIG9wdCBvdXQgb2Ygc2V0U3RhdGUgaGVyZS4gZWFjaCBzdHlsZSBvYmplY3QncyBkYXRhIG1pZ2h0IGNvbnRhaW4gbmV3XG4gICAgLy8gc3R1ZmYgd2UncmUgbm90L2Nhbm5vdCBjb21wYXJlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgfSk7XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMudW5tb3VudGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUT0RPOiB3aGVuIGNvbmZpZyBpcyB7YTogMTB9IGFuZCBkZXN0IGlzIHthOiAxMH0gZG8gd2UgcmFmIG9uY2UgYW5kXG4gICAgLy8gY2FsbCBjYj8gTm8sIG90aGVyd2lzZSBhY2NpZGVudGFsIHBhcmVudCByZXJlbmRlciBjYXVzZXMgY2IgdHJpZ2dlclxuICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBfcmFmMlsnZGVmYXVsdCddKGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAgIHZhciBwcm9wU3R5bGVzID0gX3RoaXMucHJvcHMuc3R5bGVzO1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSB0eXBlb2YgcHJvcFN0eWxlcyA9PT0gJ2Z1bmN0aW9uJyA/IHByb3BTdHlsZXMocmVoeWRyYXRlU3R5bGVzKF90aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCBfdGhpcy51bnJlYWRQcm9wU3R5bGVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKSA6IHByb3BTdHlsZXM7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYW5pbWF0ZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgIGlmIChzaG91bGRTdG9wQW5pbWF0aW9uQWxsKF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcykpIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gdGltZXN0YW1wIHx8IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBfbWVyZ2VBbmRTeW5jMyA9IG1lcmdlQW5kU3luYyhfdGhpcy5wcm9wcy53aWxsRW50ZXIsIF90aGlzLnByb3BzLndpbGxMZWF2ZSwgX3RoaXMucHJvcHMuZGlkTGVhdmUsIF90aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzKTtcblxuICAgICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luYzNbMF07XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzFdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzNbMl07XG4gICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luYzNbM107XG4gICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMzWzRdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld01lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlID0gbmV3TWVyZ2VkUHJvcHNTdHlsZXNbaV0uc3R5bGU7XG4gICAgICAgIHZhciBuZXdDdXJyZW50U3R5bGUgPSB7fTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0eSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGUgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5ID0ge307XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG5ld01lcmdlZFByb3BzU3R5bGUpIHtcbiAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuZXdNZXJnZWRQcm9wc1N0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IG5ld01lcmdlZFByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IG5ld0xhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgICBtZXJnZWRQcm9wc1N0eWxlczogbmV3TWVyZ2VkUHJvcHNTdHlsZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIHZhciBzdHlsZXMgPSBwcm9wcy5zdHlsZXM7XG4gICAgaWYgKHR5cGVvZiBzdHlsZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHN0eWxlcyhyZWh5ZHJhdGVTdHlsZXModGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdGhpcy51bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBzdHlsZXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnVubW91bnRpbmcgPSB0cnVlO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBoeWRyYXRlZFN0eWxlcyA9IHJlaHlkcmF0ZVN0eWxlcyh0aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCB0aGlzLnVucmVhZFByb3BTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFN0eWxlcyk7XG4gICAgdmFyIHJlbmRlcmVkQ2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuKGh5ZHJhdGVkU3R5bGVzKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFRyYW5zaXRpb25Nb3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxuLy8gbGlzdCBvZiBzdHlsZXMsIGVhY2ggY29udGFpbmluZyBpbnRlcnBvbGF0aW5nIHZhbHVlcy4gUGFydCBvZiB3aGF0J3MgcGFzc2VkXG4vLyB0byBjaGlsZHJlbiBmdW5jdGlvbi4gTm90aWNlIHRoYXQgdGhpcyBpc1xuLy8gQXJyYXk8QWN0dWFsSW50ZXJwb2xhdGluZ1N0eWxlT2JqZWN0Piwgd2l0aG91dCB0aGUgd3JhcHBlciB0aGF0IGlzIHtrZXk6IC4uLixcbi8vIGRhdGE6IC4uLiBzdHlsZTogQWN0dWFsSW50ZXJwb2xhdGluZ1N0eWxlT2JqZWN0fS4gT25seSBtZXJnZWRQcm9wc1N0eWxlc1xuLy8gY29udGFpbnMgdGhlIGtleSAmIGRhdGEgaW5mbyAoc28gdGhhdCB3ZSBvbmx5IGhhdmUgYSBzaW5nbGUgc291cmNlIG9mIHRydXRoXG4vLyBmb3IgdGhlc2UsIGFuZCB0byBzYXZlIHNwYWNlKS4gQ2hlY2sgdGhlIGNvbW1lbnQgZm9yIGByZWh5ZHJhdGVTdHlsZXNgIHRvXG4vLyBzZWUgaG93IHdlIHJlZ2VuZXJhdGUgdGhlIGVudGlyZXR5IG9mIHdoYXQncyBwYXNzZWQgdG8gY2hpbGRyZW4gZnVuY3Rpb25cblxuLy8gdGhlIGFycmF5IHRoYXQga2VlcHMgdHJhY2sgb2YgY3VycmVudGx5IHJlbmRlcmVkIHN0dWZmISBJbmNsdWRpbmcgc3R1ZmZcbi8vIHRoYXQgeW91J3ZlIHVubW91bnRlZCBidXQgdGhhdCdzIHN0aWxsIGFuaW1hdGluZy4gVGhpcyBpcyB3aGVyZSBpdCBsaXZlcyIsIlxuXG4vLyBjdXJyZW50bHkgdXNlZCB0byBpbml0aWF0ZSB0aGUgdmVsb2NpdHkgc3R5bGUgb2JqZWN0IHRvIDBcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IG1hcFRvWmVybztcblxuZnVuY3Rpb24gbWFwVG9aZXJvKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgcmV0W2tleV0gPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gY29yZSBrZXlzIG1lcmdpbmcgYWxnb3JpdGhtLiBJZiBwcmV2aW91cyByZW5kZXIncyBrZXlzIGFyZSBbYSwgYl0sIGFuZCB0aGVcbi8vIG5leHQgcmVuZGVyJ3MgW2MsIGIsIGRdLCB3aGF0J3MgdGhlIGZpbmFsIG1lcmdlZCBrZXlzIGFuZCBvcmRlcmluZz9cblxuLy8gLSBjIGFuZCBhIG11c3QgYm90aCBiZSBiZWZvcmUgYlxuLy8gLSBiIGJlZm9yZSBkXG4vLyAtIG9yZGVyaW5nIGJldHdlZW4gYSBhbmQgYyBhbWJpZ3VvdXNcblxuLy8gdGhpcyByZWR1Y2VzIHRvIG1lcmdpbmcgdHdvIHBhcnRpYWxseSBvcmRlcmVkIGxpc3RzIChlLmcuIGxpc3RzIHdoZXJlIG5vdFxuLy8gZXZlcnkgaXRlbSBoYXMgYSBkZWZpbml0ZSBvcmRlcmluZywgbGlrZSBjb21wYXJpbmcgYSBhbmQgYyBhYm92ZSkuIEZvciB0aGVcbi8vIGFtYmlndW91cyBvcmRlcmluZyB3ZSBkZXRlcm1pbmlzdGljYWxseSBjaG9vc2UgdG8gcGxhY2UgdGhlIG5leHQgcmVuZGVyJ3Ncbi8vIGl0ZW0gYWZ0ZXIgdGhlIHByZXZpb3VzJzsgc28gYyBhZnRlciBhXG5cbi8vIHRoaXMgaXMgY2FsbGVkIGEgdG9wb2xvZ2ljYWwgc29ydGluZy4gRXhjZXB0IHRoZSBleGlzdGluZyBhbGdvcml0aG1zIGRvbid0XG4vLyB3b3JrIHdlbGwgd2l0aCBqcyBiYyBvZiB0aGUgYW1vdW50IG9mIGFsbG9jYXRpb24sIGFuZCBpc24ndCBvcHRpbWl6ZWQgZm9yIG91clxuLy8gY3VycmVudCB1c2UtY2FzZSBiYyB0aGUgcnVudGltZSBpcyBsaW5lYXIgaW4gdGVybXMgb2YgZWRnZXMgKHNlZSB3aWtpIGZvclxuLy8gbWVhbmluZyksIHdoaWNoIGlzIGh1Z2Ugd2hlbiB0d28gbGlzdHMgaGF2ZSBtYW55IGNvbW1vbiBlbGVtZW50c1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWVyZ2VEaWZmO1xuXG5mdW5jdGlvbiBtZXJnZURpZmYocHJldiwgbmV4dCwgb25SZW1vdmUpIHtcbiAgLy8gYm9va2tlZXBpbmcgZm9yIGVhc2llciBhY2Nlc3Mgb2YgYSBrZXkncyBpbmRleCBiZWxvdy4gVGhpcyBpcyAyIGFsbG9jYXRpb25zICtcbiAgLy8gcG90ZW50aWFsbHkgdHJpZ2dlcmluZyBjaHJvbWUgaGFzaCBtYXAgbW9kZSBmb3Igb2JqcyAoc28gaXQgbWlnaHQgYmUgZmFzdGVyXG5cbiAgdmFyIHByZXZLZXlJbmRleCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBwcmV2S2V5SW5kZXhbcHJldltpXS5rZXldID0gaTtcbiAgfVxuICB2YXIgbmV4dEtleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIG5leHRLZXlJbmRleFtuZXh0W2ldLmtleV0gPSBpO1xuICB9XG5cbiAgLy8gZmlyc3QsIGFuIG92ZXJseSBlbGFib3JhdGUgd2F5IG9mIG1lcmdpbmcgcHJldiBhbmQgbmV4dCwgZWxpbWluYXRpbmdcbiAgLy8gZHVwbGljYXRlcyAoaW4gdGVybXMgb2Yga2V5cykuIElmIHRoZXJlJ3MgZHVwZSwga2VlcCB0aGUgaXRlbSBpbiBuZXh0KS5cbiAgLy8gVGhpcyB3YXkgb2Ygd3JpdGluZyBpdCBzYXZlcyBhbGxvY2F0aW9uc1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIHJldFtpXSA9IG5leHRbaV07XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV4dEtleUluZGV4LCBwcmV2W2ldLmtleSkpIHtcbiAgICAgIC8vIHRoaXMgaXMgY2FsbGVkIG15IFRNJ3MgYG1lcmdlQW5kU3luY2AsIHdoaWNoIGNhbGxzIHdpbGxMZWF2ZS4gV2UgZG9uJ3RcbiAgICAgIC8vIG1lcmdlIGluIGtleXMgdGhhdCB0aGUgdXNlciBkZXNpcmVzIHRvIGtpbGxcbiAgICAgIHZhciBmaWxsID0gb25SZW1vdmUoaSwgcHJldltpXSk7XG4gICAgICBpZiAoZmlsbCAhPSBudWxsKSB7XG4gICAgICAgIHJldC5wdXNoKGZpbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyBhbGwgdGhlIGl0ZW1zIGFsbCBwcmVzZW50LiBDb3JlIHNvcnRpbmcgbG9naWMgdG8gaGF2ZSB0aGUgcmlnaHQgb3JkZXJcbiAgcmV0dXJuIHJldC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgdmFyIG5leHRPcmRlckEgPSBuZXh0S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBuZXh0T3JkZXJCID0gbmV4dEtleUluZGV4W2Iua2V5XTtcbiAgICB2YXIgcHJldk9yZGVyQSA9IHByZXZLZXlJbmRleFthLmtleV07XG4gICAgdmFyIHByZXZPcmRlckIgPSBwcmV2S2V5SW5kZXhbYi5rZXldO1xuXG4gICAgaWYgKG5leHRPcmRlckEgIT0gbnVsbCAmJiBuZXh0T3JkZXJCICE9IG51bGwpIHtcbiAgICAgIC8vIGJvdGgga2V5cyBpbiBuZXh0XG4gICAgICByZXR1cm4gbmV4dEtleUluZGV4W2Eua2V5XSAtIG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgfSBlbHNlIGlmIChwcmV2T3JkZXJBICE9IG51bGwgJiYgcHJldk9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gcHJldlxuICAgICAgcmV0dXJuIHByZXZLZXlJbmRleFthLmtleV0gLSBwcmV2S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAobmV4dE9yZGVyQSAhPSBudWxsKSB7XG4gICAgICAvLyBrZXkgYSBpbiBuZXh0LCBrZXkgYiBpbiBwcmV2XG5cbiAgICAgIC8vIGhvdyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIGJldHdlZW4gYSBhbmQgYj8gV2UgZmluZCBhIFwicGl2b3RcIiAodGVybVxuICAgICAgLy8gYWJ1c2UpLCBhIGtleSBwcmVzZW50IGluIGJvdGggcHJldiBhbmQgbmV4dCwgdGhhdCBpcyBzYW5kd2ljaGVkIGJldHdlZW5cbiAgICAgIC8vIGEgYW5kIGIuIEluIHRoZSBjb250ZXh0IG9mIG91ciBhYm92ZSBleGFtcGxlLCBpZiB3ZSdyZSBjb21wYXJpbmcgYSBhbmRcbiAgICAgIC8vIGQsIGIncyAodGhlIG9ubHkpIHBpdm90XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpdm90ID0gbmV4dFtpXS5rZXk7XG4gICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHByZXZLZXlJbmRleCwgcGl2b3QpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV4dE9yZGVyQSA8IG5leHRLZXlJbmRleFtwaXZvdF0gJiYgcHJldk9yZGVyQiA+IHByZXZLZXlJbmRleFtwaXZvdF0pIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAobmV4dE9yZGVyQSA+IG5leHRLZXlJbmRleFtwaXZvdF0gJiYgcHJldk9yZGVyQiA8IHByZXZLZXlJbmRleFtwaXZvdF0pIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gcGx1Z2dhYmxlLiBkZWZhdWx0IHRvOiBuZXh0IGJpZ2dlciB0aGFuIHByZXZcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICAvLyBwcmV2T3JkZXJBLCBuZXh0T3JkZXJCXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGl2b3QgPSBuZXh0W2ldLmtleTtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHByZXZLZXlJbmRleCwgcGl2b3QpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRPcmRlckIgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJCID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJBIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgcmV0dXJuIC0xO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyB0byBsb29wIHRocm91Z2ggYW5kIGZpbmQgYSBrZXkncyBpbmRleCBlYWNoIHRpbWUpLCBidXQgSSBubyBsb25nZXIgY2FyZSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIG5vV29iYmxlOiB7IHN0aWZmbmVzczogMTcwLCBkYW1waW5nOiAyNiB9LCAvLyB0aGUgZGVmYXVsdCwgaWYgbm90aGluZyBwcm92aWRlZFxuICBnZW50bGU6IHsgc3RpZmZuZXNzOiAxMjAsIGRhbXBpbmc6IDE0IH0sXG4gIHdvYmJseTogeyBzdGlmZm5lc3M6IDE4MCwgZGFtcGluZzogMTIgfSxcbiAgc3RpZmY6IHsgc3RpZmZuZXNzOiAyMTAsIGRhbXBpbmc6IDIwIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqWydkZWZhdWx0J10gOiBvYmo7IH1cblxudmFyIF9Nb3Rpb24gPSByZXF1aXJlKCcuL01vdGlvbicpO1xuXG5leHBvcnRzLk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfTW90aW9uKTtcblxudmFyIF9TdGFnZ2VyZWRNb3Rpb24gPSByZXF1aXJlKCcuL1N0YWdnZXJlZE1vdGlvbicpO1xuXG5leHBvcnRzLlN0YWdnZXJlZE1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfU3RhZ2dlcmVkTW90aW9uKTtcblxudmFyIF9UcmFuc2l0aW9uTW90aW9uID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9uTW90aW9uJyk7XG5cbmV4cG9ydHMuVHJhbnNpdGlvbk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfVHJhbnNpdGlvbk1vdGlvbik7XG5cbnZhciBfc3ByaW5nID0gcmVxdWlyZSgnLi9zcHJpbmcnKTtcblxuZXhwb3J0cy5zcHJpbmcgPSBfaW50ZXJvcFJlcXVpcmUoX3NwcmluZyk7XG5cbnZhciBfcHJlc2V0cyA9IHJlcXVpcmUoJy4vcHJlc2V0cycpO1xuXG5leHBvcnRzLnByZXNldHMgPSBfaW50ZXJvcFJlcXVpcmUoX3ByZXNldHMpO1xuXG4vLyBkZXByZWNhdGVkLCBkdW1teSB3YXJuaW5nIGZ1bmN0aW9uXG5cbnZhciBfcmVvcmRlcktleXMgPSByZXF1aXJlKCcuL3Jlb3JkZXJLZXlzJyk7XG5cbmV4cG9ydHMucmVvcmRlcktleXMgPSBfaW50ZXJvcFJlcXVpcmUoX3Jlb3JkZXJLZXlzKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSByZW9yZGVyS2V5cztcblxudmFyIGhhc1dhcm5lZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiByZW9yZGVyS2V5cygpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgaWYgKCFoYXNXYXJuZWQpIHtcbiAgICAgIGhhc1dhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCdgcmVvcmRlcktleXNgIGhhcyBiZWVuIHJlbW92ZWQsIHNpbmNlIGl0IGlzIG5vIGxvbmdlciBuZWVkZWQgZm9yIFRyYW5zaXRpb25Nb3Rpb25cXCdzIG5ldyBzdHlsZXMgYXJyYXkgQVBJLicpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gdXNhZ2UgYXNzdW1wdGlvbjogY3VycmVudFN0eWxlIHZhbHVlcyBoYXZlIGFscmVhZHkgYmVlbiByZW5kZXJlZCBidXQgaXQgc2F5c1xuLy8gbm90aGluZyBvZiB3aGV0aGVyIGN1cnJlbnRTdHlsZSBpcyBzdGFsZSAoc2VlIHVucmVhZFByb3BTdHlsZSlcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNob3VsZFN0b3BBbmltYXRpb247XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb24oY3VycmVudFN0eWxlLCBzdHlsZSwgY3VycmVudFZlbG9jaXR5KSB7XG4gIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0eWxlLCBrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFZlbG9jaXR5W2tleV0gIT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc3R5bGVWYWx1ZSA9IHR5cGVvZiBzdHlsZVtrZXldID09PSAnbnVtYmVyJyA/IHN0eWxlW2tleV0gOiBzdHlsZVtrZXldLnZhbDtcbiAgICAvLyBzdGVwcGVyIHdpbGwgaGF2ZSBhbHJlYWR5IHRha2VuIGNhcmUgb2Ygcm91bmRpbmcgcHJlY2lzaW9uIGVycm9ycywgc29cbiAgICAvLyB3b24ndCBoYXZlIHN1Y2ggdGhpbmcgYXMgMC45OTk5ICE9PT0gMVxuICAgIGlmIChjdXJyZW50U3R5bGVba2V5XSAhPT0gc3R5bGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNwcmluZztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3ByZXNldHMgPSByZXF1aXJlKCcuL3ByZXNldHMnKTtcblxudmFyIF9wcmVzZXRzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZXNldHMpO1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IF9leHRlbmRzKHt9LCBfcHJlc2V0czJbJ2RlZmF1bHQnXS5ub1dvYmJsZSwge1xuICBwcmVjaXNpb246IDAuMDFcbn0pO1xuXG5mdW5jdGlvbiBzcHJpbmcodmFsLCBjb25maWcpIHtcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcsIHsgdmFsOiB2YWwgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyBzdGVwcGVyIGlzIHVzZWQgYSBsb3QuIFNhdmVzIGFsbG9jYXRpb24gdG8gcmV0dXJuIHRoZSBzYW1lIGFycmF5IHdyYXBwZXIuXG4vLyBUaGlzIGlzIGZpbmUgYW5kIGRhbmdlci1mcmVlIGFnYWluc3QgbXV0YXRpb25zIGJlY2F1c2UgdGhlIGNhbGxzaXRlXG4vLyBpbW1lZGlhdGVseSBkZXN0cnVjdHVyZXMgaXQgYW5kIGdldHMgdGhlIG51bWJlcnMgaW5zaWRlIHdpdGhvdXQgcGFzc2luZyB0aGVcblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBzdGVwcGVyO1xuXG52YXIgcmV1c2VkVHVwbGUgPSBbMCwgMF07XG5cbmZ1bmN0aW9uIHN0ZXBwZXIoc2Vjb25kUGVyRnJhbWUsIHgsIHYsIGRlc3RYLCBrLCBiLCBwcmVjaXNpb24pIHtcbiAgLy8gU3ByaW5nIHN0aWZmbmVzcywgaW4ga2cgLyBzXjJcblxuICAvLyBmb3IgYW5pbWF0aW9ucywgZGVzdFggaXMgcmVhbGx5IHNwcmluZyBsZW5ndGggKHNwcmluZyBhdCByZXN0KS4gaW5pdGlhbFxuICAvLyBwb3NpdGlvbiBpcyBjb25zaWRlcmVkIGFzIHRoZSBzdHJldGNoZWQvY29tcHJlc3NlZCBwb3NpdGlvbiBvZiBhIHNwcmluZ1xuICB2YXIgRnNwcmluZyA9IC1rICogKHggLSBkZXN0WCk7XG5cbiAgLy8gRGFtcGluZywgaW4ga2cgLyBzXG4gIHZhciBGZGFtcGVyID0gLWIgKiB2O1xuXG4gIC8vIHVzdWFsbHkgd2UgcHV0IG1hc3MgaGVyZSwgYnV0IGZvciBhbmltYXRpb24gcHVycG9zZXMsIHNwZWNpZnlpbmcgbWFzcyBpcyBhXG4gIC8vIGJpdCByZWR1bmRhbnQuIHlvdSBjb3VsZCBzaW1wbHkgYWRqdXN0IGsgYW5kIGIgYWNjb3JkaW5nbHlcbiAgLy8gbGV0IGEgPSAoRnNwcmluZyArIEZkYW1wZXIpIC8gbWFzcztcbiAgdmFyIGEgPSBGc3ByaW5nICsgRmRhbXBlcjtcblxuICB2YXIgbmV3ViA9IHYgKyBhICogc2Vjb25kUGVyRnJhbWU7XG4gIHZhciBuZXdYID0geCArIG5ld1YgKiBzZWNvbmRQZXJGcmFtZTtcblxuICBpZiAoTWF0aC5hYnMobmV3VikgPCBwcmVjaXNpb24gJiYgTWF0aC5hYnMobmV3WCAtIGRlc3RYKSA8IHByZWNpc2lvbikge1xuICAgIHJldXNlZFR1cGxlWzBdID0gZGVzdFg7XG4gICAgcmV1c2VkVHVwbGVbMV0gPSAwO1xuICAgIHJldHVybiByZXVzZWRUdXBsZTtcbiAgfVxuXG4gIHJldXNlZFR1cGxlWzBdID0gbmV3WDtcbiAgcmV1c2VkVHVwbGVbMV0gPSBuZXdWO1xuICByZXR1cm4gcmV1c2VkVHVwbGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG4vLyBhcnJheSByZWZlcmVuY2UgYXJvdW5kLiIsIlxuLy8gdHVybiB7eDoge3ZhbDogMSwgc3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSwgeTogMn0gZ2VuZXJhdGVkIGJ5XG4vLyBge3g6IHNwcmluZygxLCB7c3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSksIHk6IDJ9YCBpbnRvIHt4OiAxLCB5OiAyfVxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzdHJpcFN0eWxlO1xuXG5mdW5jdGlvbiBzdHJpcFN0eWxlKHN0eWxlKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3R5bGUsIGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IHR5cGVvZiBzdHlsZVtrZXldID09PSAnbnVtYmVyJyA/IHN0eWxlW2tleV0gOiBzdHlsZVtrZXldLnZhbDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IC8qZXNsaW50LWRpc2FibGUgcmVhY3QvcHJvcC10eXBlcyAqL1xuXG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfd2FybmluZyA9IHJlcXVpcmUoJ3dhcm5pbmcnKTtcblxudmFyIF93YXJuaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dhcm5pbmcpO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudCA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL2NvbXBvbmVudE9yRWxlbWVudCcpO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb25lbnRPckVsZW1lbnQpO1xuXG52YXIgX2VsZW1lbnRUeXBlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvZWxlbWVudFR5cGUnKTtcblxudmFyIF9lbGVtZW50VHlwZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lbGVtZW50VHlwZSk7XG5cbnZhciBfUG9ydGFsID0gcmVxdWlyZSgnLi9Qb3J0YWwnKTtcblxudmFyIF9Qb3J0YWwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUG9ydGFsKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIgPSByZXF1aXJlKCcuL01vZGFsTWFuYWdlcicpO1xuXG52YXIgX01vZGFsTWFuYWdlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Nb2RhbE1hbmFnZXIpO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG52YXIgX2FkZEV2ZW50TGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEV2ZW50TGlzdGVuZXInKTtcblxudmFyIF9hZGRFdmVudExpc3RlbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FkZEV2ZW50TGlzdGVuZXIpO1xuXG52YXIgX2FkZEZvY3VzTGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEZvY3VzTGlzdGVuZXInKTtcblxudmFyIF9hZGRGb2N1c0xpc3RlbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FkZEZvY3VzTGlzdGVuZXIpO1xuXG52YXIgX2luRE9NID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9pbkRPTScpO1xuXG52YXIgX2luRE9NMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luRE9NKTtcblxudmFyIF9hY3RpdmVFbGVtZW50ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudCcpO1xuXG52YXIgX2FjdGl2ZUVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWN0aXZlRWxlbWVudCk7XG5cbnZhciBfY29udGFpbnMgPSByZXF1aXJlKCdkb20taGVscGVycy9xdWVyeS9jb250YWlucycpO1xuXG52YXIgX2NvbnRhaW5zMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbnRhaW5zKTtcblxudmFyIF9nZXRDb250YWluZXIgPSByZXF1aXJlKCcuL3V0aWxzL2dldENvbnRhaW5lcicpO1xuXG52YXIgX2dldENvbnRhaW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRDb250YWluZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgbW9kYWxNYW5hZ2VyID0gbmV3IF9Nb2RhbE1hbmFnZXIyLmRlZmF1bHQoKTtcblxuLyoqXG4gKiBMb3ZlIHRoZW0gb3IgaGF0ZSB0aGVtLCBgPE1vZGFsLz5gIHByb3ZpZGVzIGEgc29saWQgZm91bmRhdGlvbiBmb3IgY3JlYXRpbmcgZGlhbG9ncywgbGlnaHRib3hlcywgb3Igd2hhdGV2ZXIgZWxzZS5cbiAqIFRoZSBNb2RhbCBjb21wb25lbnQgcmVuZGVycyBpdHMgYGNoaWxkcmVuYCBub2RlIGluIGZyb250IG9mIGEgYmFja2Ryb3AgY29tcG9uZW50LlxuICpcbiAqIFRoZSBNb2RhbCBvZmZlcnMgYSBmZXcgaGVscGZ1bCBmZWF0dXJlcyBvdmVyIHVzaW5nIGp1c3QgYSBgPFBvcnRhbC8+YCBjb21wb25lbnQgYW5kIHNvbWUgc3R5bGVzOlxuICpcbiAqIC0gTWFuYWdlcyBkaWFsb2cgc3RhY2tpbmcgd2hlbiBvbmUtYXQtYS10aW1lIGp1c3QgaXNuJ3QgZW5vdWdoLlxuICogLSBDcmVhdGVzIGEgYmFja2Ryb3AsIGZvciBkaXNhYmxpbmcgaW50ZXJhY3Rpb24gYmVsb3cgdGhlIG1vZGFsLlxuICogLSBJdCBwcm9wZXJseSBtYW5hZ2VzIGZvY3VzOyBtb3ZpbmcgdG8gdGhlIG1vZGFsIGNvbnRlbnQsIGFuZCBrZWVwaW5nIGl0IHRoZXJlIHVudGlsIHRoZSBtb2RhbCBpcyBjbG9zZWQuXG4gKiAtIEl0IGRpc2FibGVzIHNjcm9sbGluZyBvZiB0aGUgcGFnZSBjb250ZW50IHdoaWxlIG9wZW4uXG4gKiAtIEFkZHMgdGhlIGFwcHJvcHJpYXRlIEFSSUEgcm9sZXMgYXJlIGF1dG9tYXRpY2FsbHkuXG4gKiAtIEVhc2lseSBwbHVnZ2FibGUgYW5pbWF0aW9ucyB2aWEgYSBgPFRyYW5zaXRpb24vPmAgY29tcG9uZW50LlxuICpcbiAqIE5vdGUgdGhhdCwgaW4gdGhlIHNhbWUgd2F5IHRoZSBiYWNrZHJvcCBlbGVtZW50IHByZXZlbnRzIHVzZXJzIGZyb20gY2xpY2tpbmcgb3IgaW50ZXJhY3RpbmdcbiAqIHdpdGggdGhlIHBhZ2UgY29udGVudCB1bmRlcm5lYXRoIHRoZSBNb2RhbCwgU2NyZWVuIHJlYWRlcnMgYWxzbyBuZWVkIHRvIGJlIHNpZ25hbGVkIHRvIG5vdCB0b1xuICogaW50ZXJhY3Qgd2l0aCBwYWdlIGNvbnRlbnQgd2hpbGUgdGhlIE1vZGFsIGlzIG9wZW4uIFRvIGRvIHRoaXMsIHdlIHVzZSBhIGNvbW1vbiB0ZWNobmlxdWUgb2YgYXBwbHlpbmdcbiAqIHRoZSBgYXJpYS1oaWRkZW49J3RydWUnYCBhdHRyaWJ1dGUgdG8gdGhlIG5vbi1Nb2RhbCBlbGVtZW50cyBpbiB0aGUgTW9kYWwgYGNvbnRhaW5lcmAuIFRoaXMgbWVhbnMgdGhhdCBmb3JcbiAqIGEgTW9kYWwgdG8gYmUgdHJ1bHkgbW9kYWwsIGl0IHNob3VsZCBoYXZlIGEgYGNvbnRhaW5lcmAgdGhhdCBpcyBfb3V0c2lkZV8geW91ciBhcHAnc1xuICogUmVhY3QgaGllcmFyY2h5IChzdWNoIGFzIHRoZSBkZWZhdWx0OiBkb2N1bWVudC5ib2R5KS5cbiAqL1xudmFyIE1vZGFsID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNb2RhbCcsXG5cblxuICBwcm9wVHlwZXM6IF9leHRlbmRzKHt9LCBfUG9ydGFsMi5kZWZhdWx0LnByb3BUeXBlcywge1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBNb2RhbFxuICAgICAqL1xuICAgIHNob3c6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIEEgTm9kZSwgQ29tcG9uZW50IGluc3RhbmNlLCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWl0aGVyLiBUaGUgTW9kYWwgaXMgYXBwZW5kZWQgdG8gaXQncyBjb250YWluZXIgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEZvciB0aGUgc2FrZSBvZiBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCB0aGUgY29udGFpbmVyIHNob3VsZCB1c3VhbGx5IGJlIHRoZSBkb2N1bWVudCBib2R5LCBzbyB0aGF0IHRoZSByZXN0IG9mIHRoZVxuICAgICAqIHBhZ2UgY29udGVudCBjYW4gYmUgcGxhY2VkIGJlaGluZCBhIHZpcnR1YWwgYmFja2Ryb3AgYXMgd2VsbCBhcyBhIHZpc3VhbCBvbmUuXG4gICAgICovXG4gICAgY29udGFpbmVyOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mVHlwZShbX2NvbXBvbmVudE9yRWxlbWVudDIuZGVmYXVsdCwgX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jXSksXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIE1vZGFsIGlzIG9wZW5pbmcuXG4gICAgICovXG4gICAgb25TaG93OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gZWl0aGVyIHRoZSBiYWNrZHJvcCBpcyBjbGlja2VkLCBvciB0aGUgZXNjYXBlIGtleSBpcyBwcmVzc2VkLlxuICAgICAqXG4gICAgICogVGhlIGBvbkhpZGVgIGNhbGxiYWNrIG9ubHkgc2lnbmFscyBpbnRlbnQgZnJvbSB0aGUgTW9kYWwsXG4gICAgICogeW91IG11c3QgYWN0dWFsbHkgc2V0IHRoZSBgc2hvd2AgcHJvcCB0byBgZmFsc2VgIGZvciB0aGUgTW9kYWwgdG8gY2xvc2UuXG4gICAgICovXG4gICAgb25IaWRlOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBJbmNsdWRlIGEgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLCBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mKFsnc3RhdGljJ10pXSksXG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGJhY2tkcm9wIGNvbXBvbmVudC4gVXNlZnVsIGZvciBjdXN0b21cbiAgICAgKiBiYWNrZHJvcCByZW5kZXJpbmcuXG4gICAgICpcbiAgICAgKiBgYGBqc1xuICAgICAqICByZW5kZXJCYWNrZHJvcD17cHJvcHMgPT4gPE15QmFja2Ryb3Agey4uLnByb3BzfSAvPn1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICByZW5kZXJCYWNrZHJvcDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBlc2NhcGUga2V5LCBpZiBzcGVjaWZpZWQgaW4gYGtleWJvYXJkYCwgaXMgcHJlc3NlZC5cbiAgICAgKi9cbiAgICBvbkVzY2FwZUtleVVwOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGJhY2tkcm9wLCBpZiBzcGVjaWZpZWQsIGlzIGNsaWNrZWQuXG4gICAgICovXG4gICAgb25CYWNrZHJvcENsaWNrOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIHN0eWxlIG9iamVjdCBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcFN0eWxlOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8qKlxuICAgICAqIEEgY3NzIGNsYXNzIG9yIGNsYXNzZXMgZm9yIHRoZSBiYWNrZHJvcCBjb21wb25lbnQuXG4gICAgICovXG4gICAgYmFja2Ryb3BDbGFzc05hbWU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3Igc2V0IG9mIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgbW9kYWwgY29udGFpbmVyIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4sXG4gICAgICogYW5kIHJlbW92ZWQgd2hlbiBpdCBpcyBjbG9zZWQuXG4gICAgICovXG4gICAgY29udGFpbmVyQ2xhc3NOYW1lOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZFxuICAgICAqL1xuICAgIGtleWJvYXJkOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIGA8VHJhbnNpdGlvbi8+YCBjb21wb25lbnQgdG8gdXNlIGZvciB0aGUgZGlhbG9nIGFuZCBiYWNrZHJvcCBjb21wb25lbnRzLlxuICAgICAqL1xuICAgIHRyYW5zaXRpb246IF9lbGVtZW50VHlwZTIuZGVmYXVsdCxcblxuICAgIC8qKlxuICAgICAqIFRoZSBgdGltZW91dGAgb2YgdGhlIGRpYWxvZyB0cmFuc2l0aW9uIGlmIHNwZWNpZmllZC4gVGhpcyBudW1iZXIgaXMgdXNlZCB0byBlbnN1cmUgdGhhdFxuICAgICAqIHRyYW5zaXRpb24gY2FsbGJhY2tzIGFyZSBhbHdheXMgZmlyZWQsIGV2ZW4gaWYgYnJvd3NlciB0cmFuc2l0aW9uIGV2ZW50cyBhcmUgY2FuY2VsZWQuXG4gICAgICpcbiAgICAgKiBTZWUgdGhlIFRyYW5zaXRpb24gYHRpbWVvdXRgIHByb3AgZm9yIG1vcmUgaW5mb21hdGlvbi5cbiAgICAgKi9cbiAgICBkaWFsb2dUcmFuc2l0aW9uVGltZW91dDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYHRpbWVvdXRgIG9mIHRoZSBiYWNrZHJvcCB0cmFuc2l0aW9uIGlmIHNwZWNpZmllZC4gVGhpcyBudW1iZXIgaXMgdXNlZCB0b1xuICAgICAqIGVuc3VyZSB0aGF0IHRyYW5zaXRpb24gY2FsbGJhY2tzIGFyZSBhbHdheXMgZmlyZWQsIGV2ZW4gaWYgYnJvd3NlciB0cmFuc2l0aW9uIGV2ZW50cyBhcmUgY2FuY2VsZWQuXG4gICAgICpcbiAgICAgKiBTZWUgdGhlIFRyYW5zaXRpb24gYHRpbWVvdXRgIHByb3AgZm9yIG1vcmUgaW5mb21hdGlvbi5cbiAgICAgKi9cbiAgICBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYHRydWVgIFRoZSBtb2RhbCB3aWxsIGF1dG9tYXRpY2FsbHkgc2hpZnQgZm9jdXMgdG8gaXRzZWxmIHdoZW4gaXQgb3BlbnMsIGFuZFxuICAgICAqIHJlcGxhY2UgaXQgdG8gdGhlIGxhc3QgZm9jdXNlZCBlbGVtZW50IHdoZW4gaXQgY2xvc2VzLiBUaGlzIGFsc29cbiAgICAgKiB3b3JrcyBjb3JyZWN0bHkgd2l0aCBhbnkgTW9kYWwgY2hpbGRyZW4gdGhhdCBoYXZlIHRoZSBgYXV0b0ZvY3VzYCBwcm9wLlxuICAgICAqXG4gICAgICogR2VuZXJhbGx5IHRoaXMgc2hvdWxkIG5ldmVyIGJlIHNldCB0byBgZmFsc2VgIGFzIGl0IG1ha2VzIHRoZSBNb2RhbCBsZXNzXG4gICAgICogYWNjZXNzaWJsZSB0byBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCBsaWtlIHNjcmVlbiByZWFkZXJzLlxuICAgICAqL1xuICAgIGF1dG9Gb2N1czogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBgdHJ1ZWAgVGhlIG1vZGFsIHdpbGwgcHJldmVudCBmb2N1cyBmcm9tIGxlYXZpbmcgdGhlIE1vZGFsIHdoaWxlIG9wZW4uXG4gICAgICpcbiAgICAgKiBHZW5lcmFsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgc2V0IHRvIGBmYWxzZWAgYXMgaXQgbWFrZXMgdGhlIE1vZGFsIGxlc3NcbiAgICAgKiBhY2Nlc3NpYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGxpa2Ugc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgZW5mb3JjZUZvY3VzOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBiZWZvcmUgdGhlIE1vZGFsIHRyYW5zaXRpb25zIGluXG4gICAgICovXG4gICAgb25FbnRlcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYXMgdGhlIE1vZGFsIGJlZ2lucyB0byB0cmFuc2l0aW9uIGluXG4gICAgICovXG4gICAgb25FbnRlcmluZzogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYWZ0ZXIgdGhlIE1vZGFsIGZpbmlzaGVzIHRyYW5zaXRpb25pbmcgaW5cbiAgICAgKi9cbiAgICBvbkVudGVyZWQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIHJpZ2h0IGJlZm9yZSB0aGUgTW9kYWwgdHJhbnNpdGlvbnMgb3V0XG4gICAgICovXG4gICAgb25FeGl0OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhcyB0aGUgTW9kYWwgYmVnaW5zIHRvIHRyYW5zaXRpb24gb3V0XG4gICAgICovXG4gICAgb25FeGl0aW5nOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgTW9kYWwgZmluaXNoZXMgdHJhbnNpdGlvbmluZyBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXRlZDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBNb2RhbE1hbmFnZXIgaW5zdGFuY2UgdXNlZCB0byB0cmFjayBhbmQgbWFuYWdlIHRoZSBzdGF0ZSBvZiBvcGVuXG4gICAgICogTW9kYWxzLiBVc2VmdWwgd2hlbiBjdXN0b21pemluZyBob3cgbW9kYWxzIGludGVyYWN0IHdpdGhpbiBhIGNvbnRhaW5lclxuICAgICAqL1xuICAgIG1hbmFnZXI6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgfSksXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2hvdzogZmFsc2UsXG4gICAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgYXV0b0ZvY3VzOiB0cnVlLFxuICAgICAgZW5mb3JjZUZvY3VzOiB0cnVlLFxuICAgICAgb25IaWRlOiBub29wLFxuICAgICAgbWFuYWdlcjogbW9kYWxNYW5hZ2VyLFxuICAgICAgcmVuZGVyQmFja2Ryb3A6IGZ1bmN0aW9uIHJlbmRlckJhY2tkcm9wKHByb3BzKSB7XG4gICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgcHJvcHMpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGV4aXRlZDogIXRoaXMucHJvcHMuc2hvdyB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgc2hvdyA9IF9wcm9wcy5zaG93O1xuICAgIHZhciBjb250YWluZXIgPSBfcHJvcHMuY29udGFpbmVyO1xuICAgIHZhciBjaGlsZHJlbiA9IF9wcm9wcy5jaGlsZHJlbjtcbiAgICB2YXIgVHJhbnNpdGlvbiA9IF9wcm9wcy50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcCA9IF9wcm9wcy5iYWNrZHJvcDtcbiAgICB2YXIgZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQgPSBfcHJvcHMuZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQ7XG4gICAgdmFyIGNsYXNzTmFtZSA9IF9wcm9wcy5jbGFzc05hbWU7XG4gICAgdmFyIHN0eWxlID0gX3Byb3BzLnN0eWxlO1xuICAgIHZhciBvbkV4aXQgPSBfcHJvcHMub25FeGl0O1xuICAgIHZhciBvbkV4aXRpbmcgPSBfcHJvcHMub25FeGl0aW5nO1xuICAgIHZhciBvbkVudGVyID0gX3Byb3BzLm9uRW50ZXI7XG4gICAgdmFyIG9uRW50ZXJpbmcgPSBfcHJvcHMub25FbnRlcmluZztcbiAgICB2YXIgb25FbnRlcmVkID0gX3Byb3BzLm9uRW50ZXJlZDtcblxuXG4gICAgdmFyIGRpYWxvZyA9IF9yZWFjdDIuZGVmYXVsdC5DaGlsZHJlbi5vbmx5KGNoaWxkcmVuKTtcblxuICAgIHZhciBtb3VudE1vZGFsID0gc2hvdyB8fCBUcmFuc2l0aW9uICYmICF0aGlzLnN0YXRlLmV4aXRlZDtcbiAgICBpZiAoIW1vdW50TW9kYWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBfZGlhbG9nJHByb3BzID0gZGlhbG9nLnByb3BzO1xuICAgIHZhciByb2xlID0gX2RpYWxvZyRwcm9wcy5yb2xlO1xuICAgIHZhciB0YWJJbmRleCA9IF9kaWFsb2ckcHJvcHMudGFiSW5kZXg7XG5cblxuICAgIGlmIChyb2xlID09PSB1bmRlZmluZWQgfHwgdGFiSW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGlhbG9nID0gKDAsIF9yZWFjdC5jbG9uZUVsZW1lbnQpKGRpYWxvZywge1xuICAgICAgICByb2xlOiByb2xlID09PSB1bmRlZmluZWQgPyAnZG9jdW1lbnQnIDogcm9sZSxcbiAgICAgICAgdGFiSW5kZXg6IHRhYkluZGV4ID09IG51bGwgPyAnLTEnIDogdGFiSW5kZXhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChUcmFuc2l0aW9uKSB7XG4gICAgICBkaWFsb2cgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgVHJhbnNpdGlvbixcbiAgICAgICAge1xuICAgICAgICAgIHRyYW5zaXRpb25BcHBlYXI6IHRydWUsXG4gICAgICAgICAgdW5tb3VudE9uRXhpdDogdHJ1ZSxcbiAgICAgICAgICAnaW4nOiBzaG93LFxuICAgICAgICAgIHRpbWVvdXQ6IGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0LFxuICAgICAgICAgIG9uRXhpdDogb25FeGl0LFxuICAgICAgICAgIG9uRXhpdGluZzogb25FeGl0aW5nLFxuICAgICAgICAgIG9uRXhpdGVkOiB0aGlzLmhhbmRsZUhpZGRlbixcbiAgICAgICAgICBvbkVudGVyOiBvbkVudGVyLFxuICAgICAgICAgIG9uRW50ZXJpbmc6IG9uRW50ZXJpbmcsXG4gICAgICAgICAgb25FbnRlcmVkOiBvbkVudGVyZWRcbiAgICAgICAgfSxcbiAgICAgICAgZGlhbG9nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgIF9Qb3J0YWwyLmRlZmF1bHQsXG4gICAgICB7XG4gICAgICAgIHJlZjogdGhpcy5zZXRNb3VudE5vZGUsXG4gICAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyXG4gICAgICB9LFxuICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgcmVmOiAnbW9kYWwnLFxuICAgICAgICAgIHJvbGU6IHJvbGUgfHwgJ2RpYWxvZycsXG4gICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lXG4gICAgICAgIH0sXG4gICAgICAgIGJhY2tkcm9wICYmIHRoaXMucmVuZGVyQmFja2Ryb3AoKSxcbiAgICAgICAgZGlhbG9nXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyQmFja2Ryb3A6IGZ1bmN0aW9uIHJlbmRlckJhY2tkcm9wKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGJhY2tkcm9wU3R5bGUgPSBfcHJvcHMyLmJhY2tkcm9wU3R5bGU7XG4gICAgdmFyIGJhY2tkcm9wQ2xhc3NOYW1lID0gX3Byb3BzMi5iYWNrZHJvcENsYXNzTmFtZTtcbiAgICB2YXIgcmVuZGVyQmFja2Ryb3AgPSBfcHJvcHMyLnJlbmRlckJhY2tkcm9wO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzMi50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0ID0gX3Byb3BzMi5iYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0O1xuXG5cbiAgICB2YXIgYmFja2Ryb3BSZWYgPSBmdW5jdGlvbiBiYWNrZHJvcFJlZihyZWYpIHtcbiAgICAgIHJldHVybiBfdGhpcy5iYWNrZHJvcCA9IHJlZjtcbiAgICB9O1xuXG4gICAgdmFyIGJhY2tkcm9wID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgIHJlZjogYmFja2Ryb3BSZWYsXG4gICAgICBzdHlsZTogdGhpcy5wcm9wcy5iYWNrZHJvcFN0eWxlLFxuICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmJhY2tkcm9wQ2xhc3NOYW1lLFxuICAgICAgb25DbGljazogdGhpcy5oYW5kbGVCYWNrZHJvcENsaWNrXG4gICAgfSk7XG5cbiAgICBpZiAoVHJhbnNpdGlvbikge1xuICAgICAgYmFja2Ryb3AgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgVHJhbnNpdGlvbixcbiAgICAgICAgeyB0cmFuc2l0aW9uQXBwZWFyOiB0cnVlLFxuICAgICAgICAgICdpbic6IHRoaXMucHJvcHMuc2hvdyxcbiAgICAgICAgICB0aW1lb3V0OiBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlckJhY2tkcm9wKHtcbiAgICAgICAgICByZWY6IGJhY2tkcm9wUmVmLFxuICAgICAgICAgIHN0eWxlOiBiYWNrZHJvcFN0eWxlLFxuICAgICAgICAgIGNsYXNzTmFtZTogYmFja2Ryb3BDbGFzc05hbWUsXG4gICAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVCYWNrZHJvcENsaWNrXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBiYWNrZHJvcDtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IGZhbHNlIH0pO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy50cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgbGV0IGhhbmRsZUhpZGRlbiB0YWtlIGNhcmUgb2YgbWFya2luZyBleGl0ZWQuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiB0cnVlIH0pO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2hvdyAmJiBuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5jaGVja0ZvckZvY3VzKCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcy5wcm9wcy50cmFuc2l0aW9uO1xuXG5cbiAgICBpZiAocHJldlByb3BzLnNob3cgJiYgIXRoaXMucHJvcHMuc2hvdyAmJiAhdHJhbnNpdGlvbikge1xuICAgICAgLy8gT3RoZXJ3aXNlIGhhbmRsZUhpZGRlbiB3aWxsIGNhbGwgdGhpcy5cbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIGlmICghcHJldlByb3BzLnNob3cgJiYgdGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHZhciBfcHJvcHMzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgc2hvdyA9IF9wcm9wczMuc2hvdztcbiAgICB2YXIgdHJhbnNpdGlvbiA9IF9wcm9wczMudHJhbnNpdGlvbjtcblxuXG4gICAgaWYgKHNob3cgfHwgdHJhbnNpdGlvbiAmJiAhdGhpcy5zdGF0ZS5leGl0ZWQpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygpIHtcbiAgICB2YXIgZG9jID0gKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKTtcbiAgICB2YXIgY29udGFpbmVyID0gKDAsIF9nZXRDb250YWluZXIyLmRlZmF1bHQpKHRoaXMucHJvcHMuY29udGFpbmVyLCBkb2MuYm9keSk7XG5cbiAgICB0aGlzLnByb3BzLm1hbmFnZXIuYWRkKHRoaXMsIGNvbnRhaW5lciwgdGhpcy5wcm9wcy5jb250YWluZXJDbGFzc05hbWUpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIgPSAoMCwgX2FkZEV2ZW50TGlzdGVuZXIyLmRlZmF1bHQpKGRvYywgJ2tleXVwJywgdGhpcy5oYW5kbGVEb2N1bWVudEtleVVwKTtcblxuICAgIHRoaXMuX29uRm9jdXNpbkxpc3RlbmVyID0gKDAsIF9hZGRGb2N1c0xpc3RlbmVyMi5kZWZhdWx0KSh0aGlzLmVuZm9yY2VGb2N1cyk7XG5cbiAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblNob3cpIHtcbiAgICAgIHRoaXMucHJvcHMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHtcbiAgICB0aGlzLnByb3BzLm1hbmFnZXIucmVtb3ZlKHRoaXMpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMucmVzdG9yZUxhc3RGb2N1cygpO1xuICB9LFxuICBzZXRNb3VudE5vZGU6IGZ1bmN0aW9uIHNldE1vdW50Tm9kZShyZWYpIHtcbiAgICB0aGlzLm1vdW50Tm9kZSA9IHJlZiA/IHJlZi5nZXRNb3VudE5vZGUoKSA6IHJlZjtcbiAgfSxcbiAgaGFuZGxlSGlkZGVuOiBmdW5jdGlvbiBoYW5kbGVIaWRkZW4oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogdHJ1ZSB9KTtcbiAgICB0aGlzLm9uSGlkZSgpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25FeGl0ZWQpIHtcbiAgICAgIHZhciBfcHJvcHM0O1xuXG4gICAgICAoX3Byb3BzNCA9IHRoaXMucHJvcHMpLm9uRXhpdGVkLmFwcGx5KF9wcm9wczQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVCYWNrZHJvcENsaWNrOiBmdW5jdGlvbiBoYW5kbGVCYWNrZHJvcENsaWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5vbkJhY2tkcm9wQ2xpY2soZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYmFja2Ryb3AgPT09IHRydWUpIHtcbiAgICAgIHRoaXMucHJvcHMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVEb2N1bWVudEtleVVwOiBmdW5jdGlvbiBoYW5kbGVEb2N1bWVudEtleVVwKGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5rZXlib2FyZCAmJiBlLmtleUNvZGUgPT09IDI3ICYmIHRoaXMuaXNUb3BNb2RhbCgpKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkVzY2FwZUtleVVwKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25Fc2NhcGVLZXlVcChlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuICBjaGVja0ZvckZvY3VzOiBmdW5jdGlvbiBjaGVja0ZvckZvY3VzKCkge1xuICAgIGlmIChfaW5ET00yLmRlZmF1bHQpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gKDAsIF9hY3RpdmVFbGVtZW50Mi5kZWZhdWx0KSgpO1xuICAgIH1cbiAgfSxcbiAgZm9jdXM6IGZ1bmN0aW9uIGZvY3VzKCkge1xuICAgIHZhciBhdXRvRm9jdXMgPSB0aGlzLnByb3BzLmF1dG9Gb2N1cztcbiAgICB2YXIgbW9kYWxDb250ZW50ID0gdGhpcy5nZXREaWFsb2dFbGVtZW50KCk7XG4gICAgdmFyIGN1cnJlbnQgPSAoMCwgX2FjdGl2ZUVsZW1lbnQyLmRlZmF1bHQpKCgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykpO1xuICAgIHZhciBmb2N1c0luTW9kYWwgPSBjdXJyZW50ICYmICgwLCBfY29udGFpbnMyLmRlZmF1bHQpKG1vZGFsQ29udGVudCwgY3VycmVudCk7XG5cbiAgICBpZiAobW9kYWxDb250ZW50ICYmIGF1dG9Gb2N1cyAmJiAhZm9jdXNJbk1vZGFsKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cyA9IGN1cnJlbnQ7XG5cbiAgICAgIGlmICghbW9kYWxDb250ZW50Lmhhc0F0dHJpYnV0ZSgndGFiSW5kZXgnKSkge1xuICAgICAgICBtb2RhbENvbnRlbnQuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsIC0xKTtcbiAgICAgICAgKDAsIF93YXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ1RoZSBtb2RhbCBjb250ZW50IG5vZGUgZG9lcyBub3QgYWNjZXB0IGZvY3VzLiAnICsgJ0ZvciB0aGUgYmVuZWZpdCBvZiBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCB0aGUgdGFiSW5kZXggb2YgdGhlIG5vZGUgaXMgYmVpbmcgc2V0IHRvIFwiLTFcIi4nKTtcbiAgICAgIH1cblxuICAgICAgbW9kYWxDb250ZW50LmZvY3VzKCk7XG4gICAgfVxuICB9LFxuICByZXN0b3JlTGFzdEZvY3VzOiBmdW5jdGlvbiByZXN0b3JlTGFzdEZvY3VzKCkge1xuICAgIC8vIFN1cHBvcnQ6IDw9SUUxMSBkb2Vzbid0IHN1cHBvcnQgYGZvY3VzKClgIG9uIHN2ZyBlbGVtZW50cyAoUkI6ICM5MTcpXG4gICAgaWYgKHRoaXMubGFzdEZvY3VzICYmIHRoaXMubGFzdEZvY3VzLmZvY3VzKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cy5mb2N1cygpO1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgZW5mb3JjZUZvY3VzOiBmdW5jdGlvbiBlbmZvcmNlRm9jdXMoKSB7XG4gICAgdmFyIGVuZm9yY2VGb2N1cyA9IHRoaXMucHJvcHMuZW5mb3JjZUZvY3VzO1xuXG5cbiAgICBpZiAoIWVuZm9yY2VGb2N1cyB8fCAhdGhpcy5pc01vdW50ZWQoKSB8fCAhdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWN0aXZlID0gKDAsIF9hY3RpdmVFbGVtZW50Mi5kZWZhdWx0KSgoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpKTtcbiAgICB2YXIgbW9kYWwgPSB0aGlzLmdldERpYWxvZ0VsZW1lbnQoKTtcblxuICAgIGlmIChtb2RhbCAmJiBtb2RhbCAhPT0gYWN0aXZlICYmICEoMCwgX2NvbnRhaW5zMi5kZWZhdWx0KShtb2RhbCwgYWN0aXZlKSkge1xuICAgICAgbW9kYWwuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cblxuICAvL2luc3RlYWQgb2YgYSByZWYsIHdoaWNoIG1pZ2h0IGNvbmZsaWN0IHdpdGggb25lIHRoZSBwYXJlbnQgYXBwbGllZC5cbiAgZ2V0RGlhbG9nRWxlbWVudDogZnVuY3Rpb24gZ2V0RGlhbG9nRWxlbWVudCgpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMucmVmcy5tb2RhbDtcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLmxhc3RDaGlsZDtcbiAgfSxcbiAgaXNUb3BNb2RhbDogZnVuY3Rpb24gaXNUb3BNb2RhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tYW5hZ2VyLmlzVG9wTW9kYWwodGhpcyk7XG4gIH1cbn0pO1xuXG5Nb2RhbC5NYW5hZ2VyID0gX01vZGFsTWFuYWdlcjIuZGVmYXVsdDtcblxuZXhwb3J0cy5kZWZhdWx0ID0gTW9kYWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfc3R5bGUgPSByZXF1aXJlKCdkb20taGVscGVycy9zdHlsZScpO1xuXG52YXIgX3N0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0eWxlKTtcblxudmFyIF9jbGFzcyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2NsYXNzJyk7XG5cbnZhciBfY2xhc3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3MpO1xuXG52YXIgX3Njcm9sbGJhclNpemUgPSByZXF1aXJlKCdkb20taGVscGVycy91dGlsL3Njcm9sbGJhclNpemUnKTtcblxudmFyIF9zY3JvbGxiYXJTaXplMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Njcm9sbGJhclNpemUpO1xuXG52YXIgX2lzT3ZlcmZsb3dpbmcgPSByZXF1aXJlKCcuL3V0aWxzL2lzT3ZlcmZsb3dpbmcnKTtcblxudmFyIF9pc092ZXJmbG93aW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzT3ZlcmZsb3dpbmcpO1xuXG52YXIgX21hbmFnZUFyaWFIaWRkZW4gPSByZXF1aXJlKCcuL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gZmluZEluZGV4T2YoYXJyLCBjYikge1xuICB2YXIgaWR4ID0gLTE7XG4gIGFyci5zb21lKGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgaWYgKGNiKGQsIGkpKSB7XG4gICAgICBpZHggPSBpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGlkeDtcbn1cblxuZnVuY3Rpb24gZmluZENvbnRhaW5lcihkYXRhLCBtb2RhbCkge1xuICByZXR1cm4gZmluZEluZGV4T2YoZGF0YSwgZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gZC5tb2RhbHMuaW5kZXhPZihtb2RhbCkgIT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0Q29udGFpbmVyU3R5bGUoc3RhdGUsIGNvbnRhaW5lcikge1xuICB2YXIgc3R5bGUgPSB7IG92ZXJmbG93OiAnaGlkZGVuJyB9O1xuXG4gIC8vIHdlIGFyZSBvbmx5IGludGVyZXN0ZWQgaW4gdGhlIGFjdHVhbCBgc3R5bGVgIGhlcmVcbiAgLy8gYmVjYXN1ZSB3ZSB3aWxsIG92ZXJyaWRlIGl0XG4gIHN0YXRlLnN0eWxlID0ge1xuICAgIG92ZXJmbG93OiBjb250YWluZXIuc3R5bGUub3ZlcmZsb3csXG4gICAgcGFkZGluZ1JpZ2h0OiBjb250YWluZXIuc3R5bGUucGFkZGluZ1JpZ2h0XG4gIH07XG5cbiAgaWYgKHN0YXRlLm92ZXJmbG93aW5nKSB7XG4gICAgLy8gdXNlIGNvbXB1dGVkIHN0eWxlLCBoZXJlIHRvIGdldCB0aGUgcmVhbCBwYWRkaW5nXG4gICAgLy8gdG8gYWRkIG91ciBzY3JvbGxiYXIgd2lkdGhcbiAgICBzdHlsZS5wYWRkaW5nUmlnaHQgPSBwYXJzZUludCgoMCwgX3N0eWxlMi5kZWZhdWx0KShjb250YWluZXIsICdwYWRkaW5nUmlnaHQnKSB8fCAwLCAxMCkgKyAoMCwgX3Njcm9sbGJhclNpemUyLmRlZmF1bHQpKCkgKyAncHgnO1xuICB9XG5cbiAgKDAsIF9zdHlsZTIuZGVmYXVsdCkoY29udGFpbmVyLCBzdHlsZSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvbnRhaW5lclN0eWxlKF9yZWYsIGNvbnRhaW5lcikge1xuICB2YXIgc3R5bGUgPSBfcmVmLnN0eWxlO1xuXG5cbiAgT2JqZWN0LmtleXMoc3R5bGUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBjb250YWluZXIuc3R5bGVba2V5XSA9IHN0eWxlW2tleV07XG4gIH0pO1xufVxuLyoqXG4gKiBQcm9wZXIgc3RhdGUgbWFuYWdtZW50IGZvciBjb250YWluZXJzIGFuZCB0aGUgbW9kYWxzIGluIHRob3NlIGNvbnRhaW5lcnMuXG4gKlxuICogQGludGVybmFsIFVzZWQgYnkgdGhlIE1vZGFsIHRvIGVuc3VyZSBwcm9wZXIgc3R5bGluZyBvZiBjb250YWluZXJzLlxuICovXG5cbnZhciBNb2RhbE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1vZGFsTWFuYWdlcigpIHtcbiAgICB2YXIgX3JlZjIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgdmFyIF9yZWYyJGhpZGVTaWJsaW5nTm9kZSA9IF9yZWYyLmhpZGVTaWJsaW5nTm9kZXM7XG4gICAgdmFyIGhpZGVTaWJsaW5nTm9kZXMgPSBfcmVmMiRoaWRlU2libGluZ05vZGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfcmVmMiRoaWRlU2libGluZ05vZGU7XG4gICAgdmFyIF9yZWYyJGhhbmRsZUNvbnRhaW5lciA9IF9yZWYyLmhhbmRsZUNvbnRhaW5lck92ZXJmbG93O1xuICAgIHZhciBoYW5kbGVDb250YWluZXJPdmVyZmxvdyA9IF9yZWYyJGhhbmRsZUNvbnRhaW5lciA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9yZWYyJGhhbmRsZUNvbnRhaW5lcjtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNb2RhbE1hbmFnZXIpO1xuXG4gICAgdGhpcy5oaWRlU2libGluZ05vZGVzID0gaGlkZVNpYmxpbmdOb2RlcztcbiAgICB0aGlzLmhhbmRsZUNvbnRhaW5lck92ZXJmbG93ID0gaGFuZGxlQ29udGFpbmVyT3ZlcmZsb3c7XG4gICAgdGhpcy5tb2RhbHMgPSBbXTtcbiAgICB0aGlzLmNvbnRhaW5lcnMgPSBbXTtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhNb2RhbE1hbmFnZXIsIFt7XG4gICAga2V5OiAnYWRkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKG1vZGFsLCBjb250YWluZXIsIGNsYXNzTmFtZSkge1xuICAgICAgdmFyIG1vZGFsSWR4ID0gdGhpcy5tb2RhbHMuaW5kZXhPZihtb2RhbCk7XG4gICAgICB2YXIgY29udGFpbmVySWR4ID0gdGhpcy5jb250YWluZXJzLmluZGV4T2YoY29udGFpbmVyKTtcblxuICAgICAgaWYgKG1vZGFsSWR4ICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgICB9XG5cbiAgICAgIG1vZGFsSWR4ID0gdGhpcy5tb2RhbHMubGVuZ3RoO1xuICAgICAgdGhpcy5tb2RhbHMucHVzaChtb2RhbCk7XG5cbiAgICAgIGlmICh0aGlzLmhpZGVTaWJsaW5nTm9kZXMpIHtcbiAgICAgICAgKDAsIF9tYW5hZ2VBcmlhSGlkZGVuLmhpZGVTaWJsaW5ncykoY29udGFpbmVyLCBtb2RhbC5tb3VudE5vZGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGFpbmVySWR4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLmRhdGFbY29udGFpbmVySWR4XS5tb2RhbHMucHVzaChtb2RhbCk7XG4gICAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIG1vZGFsczogW21vZGFsXSxcbiAgICAgICAgLy9yaWdodCBub3cgb25seSB0aGUgZmlyc3QgbW9kYWwgb2YgYSBjb250YWluZXIgd2lsbCBoYXZlIGl0cyBjbGFzc2VzIGFwcGxpZWRcbiAgICAgICAgY2xhc3NlczogY2xhc3NOYW1lID8gY2xhc3NOYW1lLnNwbGl0KC9cXHMrLykgOiBbXSxcblxuICAgICAgICBvdmVyZmxvd2luZzogKDAsIF9pc092ZXJmbG93aW5nMi5kZWZhdWx0KShjb250YWluZXIpXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5oYW5kbGVDb250YWluZXJPdmVyZmxvdykge1xuICAgICAgICBzZXRDb250YWluZXJTdHlsZShkYXRhLCBjb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaChfY2xhc3MyLmRlZmF1bHQuYWRkQ2xhc3MuYmluZChudWxsLCBjb250YWluZXIpKTtcblxuICAgICAgdGhpcy5jb250YWluZXJzLnB1c2goY29udGFpbmVyKTtcbiAgICAgIHRoaXMuZGF0YS5wdXNoKGRhdGEpO1xuXG4gICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVtb3ZlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKG1vZGFsKSB7XG4gICAgICB2YXIgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5pbmRleE9mKG1vZGFsKTtcblxuICAgICAgaWYgKG1vZGFsSWR4ID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250YWluZXJJZHggPSBmaW5kQ29udGFpbmVyKHRoaXMuZGF0YSwgbW9kYWwpO1xuICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGFbY29udGFpbmVySWR4XTtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbY29udGFpbmVySWR4XTtcblxuICAgICAgZGF0YS5tb2RhbHMuc3BsaWNlKGRhdGEubW9kYWxzLmluZGV4T2YobW9kYWwpLCAxKTtcblxuICAgICAgdGhpcy5tb2RhbHMuc3BsaWNlKG1vZGFsSWR4LCAxKTtcblxuICAgICAgLy8gaWYgdGhhdCB3YXMgdGhlIGxhc3QgbW9kYWwgaW4gYSBjb250YWluZXIsXG4gICAgICAvLyBjbGVhbiB1cCB0aGUgY29udGFpbmVyXG4gICAgICBpZiAoZGF0YS5tb2RhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKF9jbGFzczIuZGVmYXVsdC5yZW1vdmVDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgICAgIGlmICh0aGlzLmhhbmRsZUNvbnRhaW5lck92ZXJmbG93KSB7XG4gICAgICAgICAgcmVtb3ZlQ29udGFpbmVyU3R5bGUoZGF0YSwgY29udGFpbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZGVTaWJsaW5nTm9kZXMpIHtcbiAgICAgICAgICAoMCwgX21hbmFnZUFyaWFIaWRkZW4uc2hvd1NpYmxpbmdzKShjb250YWluZXIsIG1vZGFsLm1vdW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJzLnNwbGljZShjb250YWluZXJJZHgsIDEpO1xuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGNvbnRhaW5lcklkeCwgMSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgICAvL290aGVyd2lzZSBtYWtlIHN1cmUgdGhlIG5leHQgdG9wIG1vZGFsIGlzIHZpc2libGUgdG8gYSBTUlxuICAgICAgICAoMCwgX21hbmFnZUFyaWFIaWRkZW4uYXJpYUhpZGRlbikoZmFsc2UsIGRhdGEubW9kYWxzW2RhdGEubW9kYWxzLmxlbmd0aCAtIDFdLm1vdW50Tm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaXNUb3BNb2RhbCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzVG9wTW9kYWwobW9kYWwpIHtcbiAgICAgIHJldHVybiAhIXRoaXMubW9kYWxzLmxlbmd0aCAmJiB0aGlzLm1vZGFsc1t0aGlzLm1vZGFscy5sZW5ndGggLSAxXSA9PT0gbW9kYWw7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1vZGFsTWFuYWdlcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gTW9kYWxNYW5hZ2VyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudCA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL2NvbXBvbmVudE9yRWxlbWVudCcpO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb25lbnRPckVsZW1lbnQpO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG52YXIgX2dldENvbnRhaW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvZ2V0Q29udGFpbmVyJyk7XG5cbnZhciBfZ2V0Q29udGFpbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldENvbnRhaW5lcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogVGhlIGA8UG9ydGFsLz5gIGNvbXBvbmVudCByZW5kZXJzIGl0cyBjaGlsZHJlbiBpbnRvIGEgbmV3IFwic3VidHJlZVwiIG91dHNpZGUgb2YgY3VycmVudCBjb21wb25lbnQgaGllcmFyY2h5LlxuICogWW91IGNhbiB0aGluayBvZiBpdCBhcyBhIGRlY2xhcmF0aXZlIGBhcHBlbmRDaGlsZCgpYCwgb3IgalF1ZXJ5J3MgYCQuZm4uYXBwZW5kVG8oKWAuXG4gKiBUaGUgY2hpbGRyZW4gb2YgYDxQb3J0YWwvPmAgY29tcG9uZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIGBjb250YWluZXJgIHNwZWNpZmllZC5cbiAqL1xudmFyIFBvcnRhbCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG5cbiAgZGlzcGxheU5hbWU6ICdQb3J0YWwnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8qKlxuICAgICAqIEEgTm9kZSwgQ29tcG9uZW50IGluc3RhbmNlLCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWl0aGVyLiBUaGUgYGNvbnRhaW5lcmAgd2lsbCBoYXZlIHRoZSBQb3J0YWwgY2hpbGRyZW5cbiAgICAgKiBhcHBlbmRlZCB0byBpdC5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfY29tcG9uZW50T3JFbGVtZW50Mi5kZWZhdWx0LCBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmNdKVxuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZW5kZXJPdmVybGF5KCk7XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCAmJiBuZXh0UHJvcHMuY29udGFpbmVyICE9PSB0aGlzLnByb3BzLmNvbnRhaW5lcikge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSAoMCwgX2dldENvbnRhaW5lcjIuZGVmYXVsdCkobmV4dFByb3BzLmNvbnRhaW5lciwgKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKS5ib2R5KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fdW5yZW5kZXJPdmVybGF5KCk7XG4gICAgdGhpcy5fdW5tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgfSxcbiAgX21vdW50T3ZlcmxheVRhcmdldDogZnVuY3Rpb24gX21vdW50T3ZlcmxheVRhcmdldCgpIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlUYXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSAoMCwgX2dldENvbnRhaW5lcjIuZGVmYXVsdCkodGhpcy5wcm9wcy5jb250YWluZXIsICgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykuYm9keSk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLmFwcGVuZENoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgIH1cbiAgfSxcbiAgX3VubW91bnRPdmVybGF5VGFyZ2V0OiBmdW5jdGlvbiBfdW5tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9IG51bGw7XG4gIH0sXG4gIF9yZW5kZXJPdmVybGF5OiBmdW5jdGlvbiBfcmVuZGVyT3ZlcmxheSgpIHtcblxuICAgIHZhciBvdmVybGF5ID0gIXRoaXMucHJvcHMuY2hpbGRyZW4gPyBudWxsIDogX3JlYWN0Mi5kZWZhdWx0LkNoaWxkcmVuLm9ubHkodGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cbiAgICAvLyBTYXZlIHJlZmVyZW5jZSBmb3IgZnV0dXJlIGFjY2Vzcy5cbiAgICBpZiAob3ZlcmxheSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fbW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gICAgICB0aGlzLl9vdmVybGF5SW5zdGFuY2UgPSBfcmVhY3REb20yLmRlZmF1bHQudW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIodGhpcywgb3ZlcmxheSwgdGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVucmVuZGVyIGlmIHRoZSBjb21wb25lbnQgaXMgbnVsbCBmb3IgdHJhbnNpdGlvbnMgdG8gbnVsbFxuICAgICAgdGhpcy5fdW5yZW5kZXJPdmVybGF5KCk7XG4gICAgICB0aGlzLl91bm1vdW50T3ZlcmxheVRhcmdldCgpO1xuICAgIH1cbiAgfSxcbiAgX3VucmVuZGVyT3ZlcmxheTogZnVuY3Rpb24gX3VucmVuZGVyT3ZlcmxheSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgX3JlYWN0RG9tMi5kZWZhdWx0LnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5SW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGdldE1vdW50Tm9kZTogZnVuY3Rpb24gZ2V0TW91bnROb2RlKCkge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5VGFyZ2V0O1xuICB9LFxuICBnZXRPdmVybGF5RE9NTm9kZTogZnVuY3Rpb24gZ2V0T3ZlcmxheURPTU5vZGUoKSB7XG4gICAgaWYgKCF0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE92ZXJsYXlET01Ob2RlKCk6IEEgY29tcG9uZW50IG11c3QgYmUgbW91bnRlZCB0byBoYXZlIGEgRE9NIG5vZGUuJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZSh0aGlzLl9vdmVybGF5SW5zdGFuY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUG9ydGFsO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgKDAsIF9vbjIuZGVmYXVsdCkobm9kZSwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpO1xuXG4gIHJldHVybiB7XG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAoMCwgX29mZjIuZGVmYXVsdCkobm9kZSwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpO1xuICAgIH1cbiAgfTtcbn07XG5cbnZhciBfb24gPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb24nKTtcblxudmFyIF9vbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vbik7XG5cbnZhciBfb2ZmID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvZXZlbnRzL29mZicpO1xuXG52YXIgX29mZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vZmYpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBhZGRGb2N1c0xpc3RlbmVyO1xuLyoqXG4gKiBGaXJlZm94IGRvZXNuJ3QgaGF2ZSBhIGZvY3VzaW4gZXZlbnQgc28gdXNpbmcgY2FwdHVyZSBpcyBlYXNpZXN0IHdheSB0byBnZXQgYnViYmxpbmdcbiAqIElFOCBjYW4ndCBkbyBhZGRFdmVudExpc3RlbmVyLCBidXQgZG9lcyBoYXZlIG9uZm9jdXNpbiwgc28gd2UgdXNlIHRoYXQgaW4gaWU4XG4gKlxuICogV2Ugb25seSBhbGxvdyBvbmUgTGlzdGVuZXIgYXQgYSB0aW1lIHRvIGF2b2lkIHN0YWNrIG92ZXJmbG93c1xuICovXG5mdW5jdGlvbiBhZGRGb2N1c0xpc3RlbmVyKGhhbmRsZXIpIHtcbiAgdmFyIHVzZUZvY3VzaW4gPSAhZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcjtcbiAgdmFyIHJlbW92ZSA9IHZvaWQgMDtcblxuICBpZiAodXNlRm9jdXNpbikge1xuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KCdvbmZvY3VzaW4nLCBoYW5kbGVyKTtcbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZGV0YWNoRXZlbnQoJ29uZm9jdXNpbicsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVyLCB0cnVlKTtcbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVyLCB0cnVlKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsgcmVtb3ZlOiByZW1vdmUgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGdldENvbnRhaW5lcjtcblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyKGNvbnRhaW5lciwgZGVmYXVsdENvbnRhaW5lcikge1xuICBjb250YWluZXIgPSB0eXBlb2YgY29udGFpbmVyID09PSAnZnVuY3Rpb24nID8gY29udGFpbmVyKCkgOiBjb250YWluZXI7XG4gIHJldHVybiBfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUoY29udGFpbmVyKSB8fCBkZWZhdWx0Q29udGFpbmVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaXNPdmVyZmxvd2luZztcblxudmFyIF9pc1dpbmRvdyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93Jyk7XG5cbnZhciBfaXNXaW5kb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNXaW5kb3cpO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gaXNCb2R5KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdib2R5Jztcbn1cblxuZnVuY3Rpb24gYm9keUlzT3ZlcmZsb3dpbmcobm9kZSkge1xuICB2YXIgZG9jID0gKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KShub2RlKTtcbiAgdmFyIHdpbiA9ICgwLCBfaXNXaW5kb3cyLmRlZmF1bHQpKGRvYyk7XG4gIHZhciBmdWxsV2lkdGggPSB3aW4uaW5uZXJXaWR0aDtcblxuICAvLyBTdXBwb3J0OiBpZTgsIG5vIGlubmVyV2lkdGhcbiAgaWYgKCFmdWxsV2lkdGgpIHtcbiAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgZnVsbFdpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdCk7XG4gIH1cblxuICByZXR1cm4gZG9jLmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2lkdGg7XG59XG5cbmZ1bmN0aW9uIGlzT3ZlcmZsb3dpbmcoY29udGFpbmVyKSB7XG4gIHZhciB3aW4gPSAoMCwgX2lzV2luZG93Mi5kZWZhdWx0KShjb250YWluZXIpO1xuXG4gIHJldHVybiB3aW4gfHwgaXNCb2R5KGNvbnRhaW5lcikgPyBib2R5SXNPdmVyZmxvd2luZyhjb250YWluZXIpIDogY29udGFpbmVyLnNjcm9sbEhlaWdodCA+IGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmFyaWFIaWRkZW4gPSBhcmlhSGlkZGVuO1xuZXhwb3J0cy5oaWRlU2libGluZ3MgPSBoaWRlU2libGluZ3M7XG5leHBvcnRzLnNob3dTaWJsaW5ncyA9IHNob3dTaWJsaW5ncztcblxudmFyIEJMQUNLTElTVCA9IFsndGVtcGxhdGUnLCAnc2NyaXB0JywgJ3N0eWxlJ107XG5cbnZhciBpc0hpZGFibGUgPSBmdW5jdGlvbiBpc0hpZGFibGUoX3JlZikge1xuICB2YXIgbm9kZVR5cGUgPSBfcmVmLm5vZGVUeXBlO1xuICB2YXIgdGFnTmFtZSA9IF9yZWYudGFnTmFtZTtcbiAgcmV0dXJuIG5vZGVUeXBlID09PSAxICYmIEJMQUNLTElTVC5pbmRleE9mKHRhZ05hbWUudG9Mb3dlckNhc2UoKSkgPT09IC0xO1xufTtcblxudmFyIHNpYmxpbmdzID0gZnVuY3Rpb24gc2libGluZ3MoY29udGFpbmVyLCBtb3VudCwgY2IpIHtcbiAgbW91bnQgPSBbXS5jb25jYXQobW91bnQpO1xuXG4gIFtdLmZvckVhY2guY2FsbChjb250YWluZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG1vdW50LmluZGV4T2Yobm9kZSkgPT09IC0xICYmIGlzSGlkYWJsZShub2RlKSkge1xuICAgICAgY2Iobm9kZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGFyaWFIaWRkZW4oc2hvdywgbm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHNob3cpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhpZGVTaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSkge1xuICBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gYXJpYUhpZGRlbih0cnVlLCBub2RlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dTaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSkge1xuICBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gYXJpYUhpZGRlbihmYWxzZSwgbm9kZSk7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGNvbXBvbmVudE9yRWxlbWVudCkge1xuICByZXR1cm4gKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KShfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUoY29tcG9uZW50T3JFbGVtZW50KSk7XG59O1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciA9IHJlcXVpcmUoJy4vdXRpbHMvY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXInKTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwcm9wVmFsdWUpO1xuXG4gIGlmIChfcmVhY3QyLmRlZmF1bHQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgUmVhY3RFbGVtZW50ICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Q29tcG9uZW50IG9yIGEgJykgKyAnRE9NRWxlbWVudC4gWW91IGNhbiB1c3VhbGx5IG9idGFpbiBhIFJlYWN0Q29tcG9uZW50IG9yIERPTUVsZW1lbnQgJyArICdmcm9tIGEgUmVhY3RFbGVtZW50IGJ5IGF0dGFjaGluZyBhIHJlZiB0byBpdC4nKTtcbiAgfVxuXG4gIGlmICgocHJvcFR5cGUgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBwcm9wVmFsdWUucmVuZGVyICE9PSAnZnVuY3Rpb24nKSAmJiBwcm9wVmFsdWUubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Q29tcG9uZW50IG9yIGEgJykgKyAnRE9NRWxlbWVudC4nKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMi5kZWZhdWx0KSh2YWxpZGF0ZSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciA9IHJlcXVpcmUoJy4vdXRpbHMvY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXInKTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGVsZW1lbnRUeXBlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwcm9wVmFsdWUpO1xuXG4gIGlmIChfcmVhY3QyLmRlZmF1bHQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgUmVhY3RFbGVtZW50ICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBlbGVtZW50IHR5cGUgKGEgc3RyaW5nICcpICsgJ29yIGEgUmVhY3RDbGFzcykuJyk7XG4gIH1cblxuICBpZiAocHJvcFR5cGUgIT09ICdmdW5jdGlvbicgJiYgcHJvcFR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gZWxlbWVudCB0eXBlIChhIHN0cmluZyAnKSArICdvciBhIFJlYWN0Q2xhc3MpLicpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIyLmRlZmF1bHQpKGVsZW1lbnRUeXBlKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbi8vIE1vc3RseSB0YWtlbiBmcm9tIFJlYWN0UHJvcFR5cGVzLlxuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgdmFyIGNvbXBvbmVudE5hbWVTYWZlID0gY29tcG9uZW50TmFtZSB8fCAnPDxhbm9ueW1vdXM+Pic7XG4gICAgdmFyIHByb3BGdWxsTmFtZVNhZmUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1JlcXVpcmVkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWVTYWZlICsgJ2Agd2FzIG5vdCBzcGVjaWZpZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lU2FmZSArICdgLicpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gNiA/IF9sZW4gLSA2IDogMCksIF9rZXkgPSA2OyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSA2XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdGUuYXBwbHkodW5kZWZpbmVkLCBbcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lU2FmZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZVNhZmVdLmNvbmNhdChhcmdzKSk7XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59IiwiLyohXG4gKiBcbiAqICBSZWFjdCBTaW1wbGV0YWJzIC0gSnVzdCBhIHNpbXBsZSB0YWJzIGNvbXBvbmVudCBidWlsdCB3aXRoIFJlYWN0XG4gKiAgQHZlcnNpb24gdjAuNy4wXG4gKiAgQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3BlZHJvbmF1Y2svcmVhY3Qtc2ltcGxldGFic1xuICogIEBsaWNlbnNlIE1JVFxuICogIEBhdXRob3IgUGVkcm8gTmF1Y2sgKGh0dHBzOi8vZ2l0aHViLmNvbS9wZWRyb25hdWNrKVxuICogXG4gKi9cbihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCkpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wicmVhY3RcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiUmVhY3RTaW1wbGVUYWJzXCJdID0gZmFjdG9yeSgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiUmVhY3RTaW1wbGVUYWJzXCJdID0gZmFjdG9yeShyb290W1wiUmVhY3RcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX18pIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qKiBAanN4IFJlYWN0LkRPTSAqLyd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHR2YXIgY2xhc3NOYW1lcyA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cblx0aWYgKHRydWUpIHtcblx0ICBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXHR9XG5cblx0dmFyIFRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdCAgZGlzcGxheU5hbWU6ICdUYWJzJyxcblx0ICBwcm9wVHlwZXM6IHtcblx0ICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuXHQgICAgXSksXG5cdCAgICB0YWJBY3RpdmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCAgICBvbk1vdW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIG9uQmVmb3JlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIG9uQWZ0ZXJDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5lbGVtZW50XG5cdCAgICBdKS5pc1JlcXVpcmVkXG5cdCAgfSxcblx0ICBnZXREZWZhdWx0UHJvcHM6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHsgdGFiQWN0aXZlOiAxIH07XG5cdCAgfSxcblx0ICBnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgdGFiQWN0aXZlOiB0aGlzLnByb3BzLnRhYkFjdGl2ZVxuXHQgICAgfTtcblx0ICB9LFxuXHQgIGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xuXHQgICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS50YWJBY3RpdmU7XG5cdCAgICB2YXIgJHNlbGVjdGVkUGFuZWwgPSB0aGlzLnJlZnNbJ3RhYi1wYW5lbCddO1xuXHQgICAgdmFyICRzZWxlY3RlZE1lbnUgPSB0aGlzLnJlZnNbKFwidGFiLW1lbnUtXCIgKyBpbmRleCldO1xuXG5cdCAgICBpZiAodGhpcy5wcm9wcy5vbk1vdW50KSB7XG5cdCAgICAgIHRoaXMucHJvcHMub25Nb3VudChpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZE1lbnUpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV3UHJvcHMpe1xuXHQgICAgaWYobmV3UHJvcHMudGFiQWN0aXZlICYmIG5ld1Byb3BzLnRhYkFjdGl2ZSAhPT0gdGhpcy5wcm9wcy50YWJBY3RpdmUpe1xuXHQgICAgICB0aGlzLnNldFN0YXRlKHt0YWJBY3RpdmU6IG5ld1Byb3BzLnRhYkFjdGl2ZX0pO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgcmVuZGVyOmZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCd0YWJzJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWV9LCBcblx0ICAgICAgICB0aGlzLl9nZXRNZW51SXRlbXMoKSwgXG5cdCAgICAgICAgdGhpcy5fZ2V0U2VsZWN0ZWRQYW5lbCgpXG5cdCAgICAgIClcblx0ICAgICk7XG5cdCAgfSxcblx0ICBzZXRBY3RpdmU6ZnVuY3Rpb24oaW5kZXgsIGUpIHtcblx0ICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXHQgICAgdmFyIG9uQWZ0ZXJDaGFuZ2UgPSB0aGlzLnByb3BzLm9uQWZ0ZXJDaGFuZ2U7XG5cdCAgICB2YXIgb25CZWZvcmVDaGFuZ2UgPSB0aGlzLnByb3BzLm9uQmVmb3JlQ2hhbmdlO1xuXHQgICAgdmFyICRzZWxlY3RlZFBhbmVsID0gdGhpcy5yZWZzWyd0YWItcGFuZWwnXTtcblx0ICAgIHZhciAkc2VsZWN0ZWRUYWJNZW51ID0gdGhpcy5yZWZzWyhcInRhYi1tZW51LVwiICsgaW5kZXgpXTtcblxuXHQgICAgaWYgKG9uQmVmb3JlQ2hhbmdlKSB7XG5cdCAgICAgIHZhciBjYW5jZWwgPSBvbkJlZm9yZUNoYW5nZShpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZFRhYk1lbnUpO1xuXHQgICAgICBpZihjYW5jZWwgPT09IGZhbHNlKXsgcmV0dXJuIH1cblx0ICAgIH1cblxuXHQgICAgdGhpcy5zZXRTdGF0ZSh7IHRhYkFjdGl2ZTogaW5kZXggfSwgZnVuY3Rpb24oKSAge1xuXHQgICAgICBpZiAob25BZnRlckNoYW5nZSkge1xuXHQgICAgICAgIG9uQWZ0ZXJDaGFuZ2UoaW5kZXgsICRzZWxlY3RlZFBhbmVsLCAkc2VsZWN0ZWRUYWJNZW51KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBfZ2V0TWVudUl0ZW1zOmZ1bmN0aW9uICgpIHtcblx0ICAgIGlmICghdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBUYWJzLlBhbmVsJyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKSkge1xuXHQgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuID0gW3RoaXMucHJvcHMuY2hpbGRyZW5dO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgJG1lbnVJdGVtcyA9IHRoaXMucHJvcHMuY2hpbGRyZW5cblx0ICAgICAgLm1hcChmdW5jdGlvbigkcGFuZWwpICB7cmV0dXJuIHR5cGVvZiAkcGFuZWwgPT09ICdmdW5jdGlvbicgPyAkcGFuZWwoKSA6ICRwYW5lbDt9KVxuXHQgICAgICAuZmlsdGVyKGZ1bmN0aW9uKCRwYW5lbCkgIHtyZXR1cm4gJHBhbmVsO30pXG5cdCAgICAgIC5tYXAoZnVuY3Rpb24oJHBhbmVsLCBpbmRleCkgIHtcblx0ICAgICAgICB2YXIgcmVmID0gKFwidGFiLW1lbnUtXCIgKyAoaW5kZXggKyAxKSk7XG5cdCAgICAgICAgdmFyIHRpdGxlID0gJHBhbmVsLnByb3BzLnRpdGxlO1xuXHQgICAgICAgIHZhciBjbGFzc2VzID0gY2xhc3NOYW1lcyhcblx0ICAgICAgICAgICd0YWJzLW1lbnUtaXRlbScsXG5cdCAgICAgICAgICB0aGlzLnN0YXRlLnRhYkFjdGl2ZSA9PT0gKGluZGV4ICsgMSkgJiYgJ2lzLWFjdGl2ZSdcblx0ICAgICAgICApO1xuXG5cdCAgICAgICAgcmV0dXJuIChcblx0ICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7cmVmOiByZWYsIGtleTogaW5kZXgsIGNsYXNzTmFtZTogY2xhc3Nlc30sIFxuXHQgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zZXRBY3RpdmUuYmluZCh0aGlzLCBpbmRleCArIDEpfSwgXG5cdCAgICAgICAgICAgICAgdGl0bGVcblx0ICAgICAgICAgICAgKVxuXHQgICAgICAgICAgKVxuXHQgICAgICAgICk7XG5cdCAgICAgIH0uYmluZCh0aGlzKSk7XG5cblx0ICAgIHJldHVybiAoXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwge2NsYXNzTmFtZTogXCJ0YWJzLW5hdmlnYXRpb25cIn0sIFxuXHQgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcInRhYnMtbWVudVwifSwgJG1lbnVJdGVtcylcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9LFxuXHQgIF9nZXRTZWxlY3RlZFBhbmVsOmZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBpbmRleCA9IHRoaXMuc3RhdGUudGFiQWN0aXZlIC0gMTtcblx0ICAgIHZhciAkcGFuZWwgPSB0aGlzLnByb3BzLmNoaWxkcmVuW2luZGV4XTtcblxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFydGljbGVcIiwge3JlZjogXCJ0YWItcGFuZWxcIiwgY2xhc3NOYW1lOiBcInRhYi1wYW5lbFwifSwgXG5cdCAgICAgICAgJHBhbmVsXG5cdCAgICAgIClcblx0ICAgICk7XG5cdCAgfVxuXHR9KTtcblxuXHRUYWJzLlBhbmVsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHQgIGRpc3BsYXlOYW1lOiAnUGFuZWwnLFxuXHQgIHByb3BUeXBlczoge1xuXHQgICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblx0ICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuZWxlbWVudFxuXHQgICAgXSkuaXNSZXF1aXJlZFxuXHQgIH0sXG5cdCAgcmVuZGVyOmZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXHQgIH1cblx0fSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBUYWJzO1xuXG5cbi8qKiovIH0sXG4vKiAxICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMV9fO1xuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyoqIEBqc3ggUmVhY3QuRE9NICovZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXHRcdHZhciBhcmc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0YXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZyB8fCAnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHRcdH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8ICFhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdC8vIHNhZmVseSBleHBvcnQgY2xhc3NOYW1lcyBpbiBjYXNlIHRoZSBzY3JpcHQgaXMgaW5jbHVkZWQgZGlyZWN0bHkgb24gYSBwYWdlXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fVxuXG5cbi8qKiovIH0sXG4vKiAzICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgd2FybmluZyA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhcmdzKSB7XG4gICAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gPiAyID8gbGVuIC0gMiA6IDApO1xuICAgIGZvciAodmFyIGtleSA9IDI7IGtleSA8IGxlbjsga2V5KyspIHtcbiAgICAgIGFyZ3Nba2V5IC0gMl0gPSBhcmd1bWVudHNba2V5XTtcbiAgICB9XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICtcbiAgICAgICAgJ21lc3NhZ2UgYXJndW1lbnQnXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQubGVuZ3RoIDwgMTAgfHwgKC9eW3NcXFddKiQvKS50ZXN0KGZvcm1hdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSB3YXJuaW5nIGZvcm1hdCBzaG91bGQgYmUgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzICcgK1xuICAgICAgICAnd2FybmluZy4gUGxlYXNlLCB1c2UgYSBtb3JlIGRlc2NyaXB0aXZlIGZvcm1hdCB0aGFuOiAnICsgZm9ybWF0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgICAgfSk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH0gY2F0Y2goeCkge31cbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBBbGxlbGVGaWx0ZXJzVmlldyA9ICh7c3BlY2llcywgdmlzaWJsZUdlbmVzPVtdLCBkaXNhYmxlZEFsbGVsZXM9W10sIG9uRmlsdGVyQ2hhbmdlfSkgPT4ge1xuICBsZXQgZ2VuZUlucHV0cyA9IFtdLFxuICAgICAgYWxsVmlzaWJsZSA9IHZpc2libGVHZW5lcy5sZW5ndGggPT09IDA7XG5cbiAgZm9yIChjb25zdCBnZW5lIGluIHNwZWNpZXMuZ2VuZUxpc3QpIHtcbiAgICBpZiAoYWxsVmlzaWJsZSB8fCB2aXNpYmxlR2VuZXMuaW5kZXhPZihnZW5lKSA+IC0xKSB7XG4gICAgICBjb25zdCBhbGxlbGVzID0gc3BlY2llcy5nZW5lTGlzdFtnZW5lXS5hbGxlbGVzLFxuICAgICAgICAgICAgYWxsZWxlSXRlbXMgPSBhbGxlbGVzLm1hcChhbGxlbGUgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gIShkaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID49IDApO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5MZWZ0XCI6IFwiOHB4XCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9Lz5cbiAgICAgICAgICAgICAgICAgIHtuYW1lfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIGdlbmVJbnB1dHMucHVzaChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5lLWFsbGVsZS1saXN0XCIga2V5PXtnZW5lfT57YWxsZWxlSXRlbXN9PC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIGFsbGVsZSA9IGVsdCAmJiBlbHQudmFsdWUsXG4gICAgICAgICAgaXNDaGVja2VkID0gZWx0ICYmIGVsdC5jaGVja2VkO1xuICAgIGlmIChvbkZpbHRlckNoYW5nZSAmJiBhbGxlbGUpXG4gICAgICBvbkZpbHRlckNoYW5nZShldnQsIGFsbGVsZSwgaXNDaGVja2VkKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZS1maWx0ZXJzXCJcbiAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpblRvcFwiOiBcIjVweFwiLCBcIm1hcmdpbkJvdHRvbVwiOiBcIjVweFwiIH19PlxuICAgICAgeyBnZW5lSW5wdXRzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkFsbGVsZUZpbHRlcnNWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB2aXNpYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNhYmxlZEFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBvbkZpbHRlckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlRmlsdGVyc1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQWxsZWxlVmlldyA9ICh7YWxsZWxlLCB3aWR0aD0yMSwgdGFyZ2V0LCBjb2xvciwgc2hhcGUsIGhvdmVyaW5nfSkgPT4ge1xuICBsZXQgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgIHN0cm9rZSA9IHRhcmdldCA/IFwiIzAwMDAwMFwiIDogXCJub25lXCIsXG4gICAgICBmaWxsID0gYWxsZWxlID8gY29sb3IgOiBcIndoaXRlXCIsXG4gICAgICBzdHJva2VXaWR0aCA9IGhvdmVyaW5nID8gMyA6IDEsXG4gICAgICBzdHJva2VEYXNoYXJyYXk9IGFsbGVsZSA/IFwiMFwiIDogXCIxXCIsXG4gICAgICBzdmdTaGFwZSA9IG51bGw7XG5cbiAgaWYgKHNoYXBlID09PSBcImNpcmNsZVwiKSB7XG4gICAgc3ZnU2hhcGUgPSA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysxfSBjeD17cmFkaXVzKzF9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPXtzdHJva2V9IHN0cm9rZURhc2hhcnJheT17c3Ryb2tlRGFzaGFycmF5fSBmaWxsPXtmaWxsfS8+O1xuICB9IGVsc2Uge1xuICAgIHN2Z1NoYXBlID0gPHJlY3Qgd2lkdGg9eyhyYWRpdXMqMil9IGhlaWdodD17KHJhZGl1cyoyKX0geD1cIjFcIiB5PVwiMVwiIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPXtzdHJva2V9IHN0cm9rZURhc2hhcnJheT17c3Ryb2tlRGFzaGFycmF5fSBmaWxsPXtmaWxsfS8+O1xuICB9XG5cblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e3dpZHRoKzJ9IGhlaWdodD17d2lkdGgrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIHsgc3ZnU2hhcGUgfVxuICAgICAgICA8dGV4dCB4PXtyYWRpdXMrMX0geT17cmFkaXVzKzd9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBmaWxsPVwid2hpdGVcIj57YWxsZWxlfTwvdGV4dD5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbkFsbGVsZVZpZXcucHJvcFR5cGVzID0ge1xuICBhbGxlbGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0YXJnZXQ6IFByb3BUeXBlcy5ib29sLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2hhcGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGhvdmVyaW5nOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcbmltcG9ydCBHYW1ldGVWaWV3IGZyb20gJy4vZ2FtZXRlJztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlIHRoYXQgYW5pbWF0ZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB2aXNpYmxlR2VuZXMgLSBnZW5lcyB3aGljaCBzaG91bGQgYmUgdmlzaWJsZVxuICogQHBhcmFtIHtPYmplY3R9IFtpbml0aWFsRGlzcGxheV0gLSBpbml0aWFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnhdIC0gaW5pdGlhbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS55XSAtIGluaXRpYWwgbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5zaXplPTMwXSAtIGluaXRpYWwgc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkucm90YXRpb249MF0gLSBpbml0aWFsIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkub3BhY2l0eT0xXSAtIGluaXRpYWwgb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGZpbmFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gZmluYWwgbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBmaW5hbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBmaW5hbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gZmluYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBmaW5hbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW5pbVN0aWZmbmVzcz0xMDBdIC0gc3ByaW5nIHN0aWZmbmVzcyB1c2VkIHRvIGNvbnRyb2wgYW5pbWF0aW9uIHNwZWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvblJlY3QoKV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGF0IHJlc3RcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgQW5pbWF0ZWRHYW1ldGVWaWV3ID0gKHtpZCwgaW5pdGlhbERpc3BsYXksIGRpc3BsYXksIGFuaW1TdGlmZm5lc3M9MTAwLCBvblJlc3QsIC4uLm90aGVyc30pID0+IHtcblxuICBjb25zdCBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGluaXRpYWwgPSBpbml0aWFsRGlzcGxheSB8fCBkaXNwbGF5LFxuICAgICAgICBpbml0aWFsU2l6ZSA9IGluaXRpYWwuc2l6ZSB8fCAzMCxcbiAgICAgICAgaW5pdGlhbFJvdGF0aW9uID0gaW5pdGlhbC5yb3RhdGlvbiAhPSBudWxsID8gaW5pdGlhbC5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGluaXRpYWxPcGFjaXR5ID0gaW5pdGlhbC5vcGFjaXR5ICE9IG51bGwgPyBpbml0aWFsLm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIGZpbmFsU2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgZmluYWxSb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBmaW5hbE9wYWNpdHkgPSBkaXNwbGF5Lm9wYWNpdHkgIT0gbnVsbCA/IGRpc3BsYXkub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgc3ByaW5nQ29uZmlnID0geyBzdGlmZm5lc3M6IGFuaW1TdGlmZm5lc3MgfTtcbiAgcmV0dXJuIChcbiAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1nYW1ldGUnXG4gICAgICAgICAgZGVmYXVsdFN0eWxlPXt7XG4gICAgICAgICAgICB4OiBpbml0aWFsLngsIHk6IGluaXRpYWwueSwgc2l6ZTogaW5pdGlhbFNpemUsXG4gICAgICAgICAgICByb3RhdGlvbjogaW5pdGlhbFJvdGF0aW9uLCBvcGFjaXR5OiBpbml0aWFsT3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHg6IHNwcmluZyhkaXNwbGF5LngsIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICB5OiBzcHJpbmcoZGlzcGxheS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgc2l6ZTogc3ByaW5nKGZpbmFsU2l6ZSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiBzcHJpbmcoZmluYWxSb3RhdGlvbiwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIG9wYWNpdHk6IHNwcmluZyhmaW5hbE9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+XG4gICAgICAgICAgPEdhbWV0ZVZpZXcgaWQ9e2lkfSBkaXNwbGF5PXtpbnRlcnBvbGF0ZWRTdHlsZX0gey4uLm90aGVyc30gLz5cbiAgICAgIH1cbiAgICA8L01vdGlvbj5cbiAgKTtcbn07XG5cbkFuaW1hdGVkR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB2aXNpYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBpbml0aWFsRGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgLy8gaW5pdGlhbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KSxcbiAgZGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGZpbmFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXN0OiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRHYW1ldGVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01vdGlvbiwgc3ByaW5nfSBmcm9tICdyZWFjdC1tb3Rpb24nO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgQW5pbWF0ZWRPcmdhbmlzbVZpZXcgPSAoe29yZywgaWQsIHdpZHRoPTIwMCwgc3R5bGU9e30sIGluaXRpYWxPcGFjaXR5PTEuMCwgb3BhY2l0eT0xLjAsIHN0aWZmbmVzcz02MCwgb25SZXN0LCBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgb3BhY2l0eVN0YXJ0ID0gaW5pdGlhbE9wYWNpdHkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBpbml0aWFsT3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAob3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gb3BhY2l0eSA6IDEuMCk7XG4gIGxldCAgIG9wYWNpdHlFbmQgPSBvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogb3BhY2l0eVN0YXJ0O1xuXG4gIGlmIChvcGFjaXR5RW5kICE9PSBvcGFjaXR5U3RhcnQpXG4gICAgb3BhY2l0eUVuZCA9IHNwcmluZyhvcGFjaXR5RW5kLCB7IHN0aWZmbmVzczogc3RpZmZuZXNzIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtb3JnYW5pc20tdmlldydcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZT17e29wYWNpdHk6IG9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogb3BhY2l0eUVuZH19IG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+IHtcbiAgICAgICAgICBjb25zdCB0U3R5bGUgPSB7IC4uLnN0eWxlLCAuLi5pbnRlcnBvbGF0ZWRTdHlsZSB9O1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWR9IHdpZHRoPXt3aWR0aH0gc3R5bGU9e3RTdHlsZX0gb25DbGljaz17b25DbGlja30gLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgPC9Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpbml0aWFsT3BhY2l0eTogUHJvcFR5cGVzLm51bWJlcixcbiAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlcixcbiAgc3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0ZWRPcmdhbmlzbVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEVnZ1ZpZXcsIEVHR19JTUFHRV9XSURUSCB9IGZyb20gJy4vZWdnLWNsdXRjaCc7XG5cbmNvbnN0IEVHR19JTUFHRV9XSURUSF9TTUFMTCA9IEVHR19JTUFHRV9XSURUSCAvIDM7XG5cbmNsYXNzIEJhc2tldFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYmFza2V0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBhbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICAgIHNleDogUHJvcFR5cGVzLm51bWJlclxuICAgIH0pLFxuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgY29uc3QgeyBiYXNrZXQsIGluZGV4LCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhpbmRleCwgYmFza2V0KTtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBiYXNrZXQsIGlkLCBlZ2dzLCBpc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAnYmFza2V0JyArIChpc1NlbGVjdGVkID8gJyBzZWxlY3RlZCcgOiAnJyk7XG5cbiAgICBmdW5jdGlvbiBlZ2dzRGl2KCkge1xuICAgICAgaWYgKCFlZ2dzIHx8ICFlZ2dzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gICAgICBsZXQgZWdnVmlld3MgPSBlZ2dzLm1hcChmdW5jdGlvbihlZ2csIGluZGV4KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEVnZ1ZpZXcgZWdnPXtlZ2d9IGtleT17YGJhc2tldC1lZ2ctJHtpbmRleH1gfSBpc1NlbGVjdGVkPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlTdHlsZT17e3NpemU6IEVHR19JTUFHRV9XSURUSF9TTUFMTH19IC8+XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXNrZXQtZWdncycgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMzAsIHRvcDogMTAsIHdpZHRoOiA3MCB9fT5cbiAgICAgICAgICB7ZWdnVmlld3N9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IGlkPXtpZH0ga2V5PXtpZH0gc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXNrZXQtaW1hZ2UnIHJlZj0nZG9tTm9kZSc+PC9kaXY+XG4gICAgICAgIHtlZ2dzRGl2KCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdiYXNrZXQtbGFiZWwgdW5zZWxlY3RhYmxlJz57YmFza2V0LmxhYmVsfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBCYXNrZXRTZXRWaWV3ID0gKHtiYXNrZXRzLCBpZFByZWZpeD0nYmFza2V0LScsIHNlbGVjdGVkSW5kaWNlcz1bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVnZ3MsIGFuaW1hdGluZ0VnZ0luZGV4LCBvbkNsaWNrfSkgPT4ge1xuXG4gIGxldCBiYXNrZXRWaWV3cyA9IGJhc2tldHMubWFwKChiYXNrZXQsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlkID0gYCR7aWRQcmVmaXh9JHtpbmRleH1gLFxuICAgICAgICAgICAgICBpc1NlbGVjdGVkID0gc2VsZWN0ZWRJbmRpY2VzLmluZGV4T2YoaW5kZXgpID49IDA7XG4gICAgICAgIGxldCBlZ2dJbmRpY2VzID0gKGJhc2tldCAmJiBiYXNrZXQuZWdncykgfHwgW10sXG4gICAgICAgICAgICBkaXNwbGF5RWdncyA9IFtdO1xuICAgICAgICAgICAgZWdnSW5kaWNlcy5mb3JFYWNoKChlZ2dEcmFrZUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVnZ0luZGV4ID0gZWdnRHJha2VJbmRleDtcbiAgICAgICAgICAgICAgaWYgKGVnZ0RyYWtlSW5kZXggPT09IGFuaW1hdGluZ0VnZ0luZGV4KSByZXR1cm47XG4gICAgICAgICAgICAgIGlmIChlZ2dzICYmIGVnZ3NbZWdnSW5kZXhdKVxuICAgICAgICAgICAgICAgIGRpc3BsYXlFZ2dzLnB1c2goZWdnc1tlZ2dJbmRleF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiA8QmFza2V0VmlldyBiYXNrZXQ9e2Jhc2tldH0gaWQ9e2lkfSBrZXk9e2lkfSBpbmRleD17aW5kZXh9IGVnZ3M9e2Rpc3BsYXlFZ2dzfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aXNTZWxlY3RlZH0gb25DbGljaz17b25DbGlja30gLz47XG4gICAgICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBiYXNrZXQtc2V0XCI+XG4gICAgICB7IGJhc2tldFZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkJhc2tldFNldFZpZXcucHJvcFR5cGVzID0ge1xuICBiYXNrZXRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2VsZWN0ZWRJbmRpY2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSxcbiAgZWdnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCksXG4gIGFuaW1hdGluZ0VnZ0luZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQmFza2V0U2V0VmlldztcbiIsIi8qXG4gKiBUaGlzIGNvbXBvbmVudCBpcyBhIHZlcnkgdGhpbiB3cmFwcGVyIGFyb3VuZCBhIHN0YW5kYXJkIGJ1dHRvbiBkZXNpZ25lZCB0byBwcmV2ZW50XG4gKiBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodGluZyBhZGRlZCBieSBicm93c2VycyB3aGVuIGNsaWNraW5nIG9uIGEgYnV0dG9uIHdoaWxlXG4gKiBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5LiBTZWVcbiAqIGh0dHBzOi8vd3d3LnBhY2llbGxvZ3JvdXAuY29tL2Jsb2cvMjAxMi8wNC9ob3ctdG8tcmVtb3ZlLWNzcy1vdXRsaW5lcy1pbi1hbi1hY2Nlc3NpYmxlLW1hbm5lci9cbiAqIGZvciBkZXRhaWxzLiBUaGUgdXBzaG90IGlzIHRoYXQgd2UgdXNlIG1vdXNlIGV2ZW50cyBvbiB0aGUgYnV0dG9uIHRvIGRpc2FibGUgdGhlXG4gKiBmb2N1cyBoaWdobGlnaHQgLS0gbW91c2luZy9jbGlja2luZyBvbiBhIHB1c2ggYnV0dG9uIHNob3VsZCBub3QgYmUgdXNlZCBhcyBhblxuICogaW5jaWRhdG9yIHRoYXQgdGhlIHVzZXIgd291bGQgbGlrZSB0byBrZXlib2FyZC1pbnRlcmFjdCB3aXRoIHRoYXQgYnV0dG9uLCB3aGljaFxuICogaXMgd2hhdCBmb2N1c2luZyBhIGNsaWNrZWQgYnV0dG9uIGltcGxpZXMuXG4gKiBJTVBPUlRBTlQ6IFRvIG1haW50YWluIGFjY2Vzc2liaWxpdHksIHRoZXJlIG11c3QgYmUgY29kZSBzb21ld2hlcmUgdG8gcmVlbmFibGVcbiAqIHRoZSBmb2N1cyBoaWdobGlnaHQgd2hlbiBhcHByb3ByaWF0ZS4gVGhpcyBjYW4gYmUgZG9uZSBmb3IgJ2tleWRvd24nIGJ5IGNhbGxpbmdcbiAqIEJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpIGR1cmluZyBhcHBsaWNhdGlvbi9wYWdlIGluaXRpYWxpemF0aW9uLFxuICogb3IgYnkgYWRkaW5nIHlvdXIgb3duIGV2ZW50IGhhbmRsZXIgdGhhdCBjYWxscyBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKS5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdCBmcm9tICcuLi91dGlsaXRpZXMvdHJhbnNsYXRlJztcblxuY2xhc3MgQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSlcbiAgfVxuXG4gIC8vIEluc3RhbGxzIGEga2V5ZG93biBoYW5kbGVyIG9uIHRoZSBkb2N1bWVudCB3aGljaCB3aWxsIGVuYWJsZSBidXR0b24gZm9jdXMgaGlnaGxpZ2h0aW5nLlxuICAvLyBTaG91bGQgYmUgY2FsbGVkIG9uY2UgZHVyaW5nIGFwcGxpY2F0aW9uIGluaXRpYWxpemF0aW9uLlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHRPbktleURvd24oKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsICgpID0+IEJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpKTtcbiAgfVxuXG4gIC8vIEVuYWJsZXMgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZzsgZGVzaWduZWQgdG8gYmUgY2FsbGVkIGZyb20gdGhlIGtleWRvd24gaGFuZGxlciBhYm92ZVxuICAvLyBidXQgYXZhaWxhYmxlIHNlcGFyYXRlbHkgZm9yIGltcGxlbWVudGF0aW9ucyB0aGF0IHJlcXVpcmUgaXQuXG4gIHN0YXRpYyBlbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodCgpIHtcbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdiLWJ1dHRvbicpLFxuICAgICAgICAgIGNvdW50ID0gYnV0dG9ucy5sZW5ndGg7XG4gICAgLy8gY2YuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlTGlzdCNFeGFtcGxlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICBjb25zdCBidXR0b24gPSBidXR0b25zW2ldO1xuICAgICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lKSB7XG4gICAgICAgIC8vIGNmLiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5NTk1MS9jaGFuZ2UtYW4tZWxlbWVudHMtY2xhc3Mtd2l0aC1qYXZhc2NyaXB0XG4gICAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSBidXR0b24uY2xhc3NOYW1lLnJlcGxhY2UoLyg/Ol58XFxzKW5vLWZvY3VzLWhpZ2hsaWdodCg/IVxcUykvZyAsICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBwcmV2ZW50IGV4dHJhbmVvdXMgZm9jdXMgaGlnaGxpZ2h0IG9uIGNsaWNrIHdoaWxlIG1haW50YWluaW5nIGtleWJvYXJkIGFjY2Vzc2liaWxpdHlcbiAgLy8gc2VlIGh0dHBzOi8vd3d3LnBhY2llbGxvZ3JvdXAuY29tL2Jsb2cvMjAxMi8wNC9ob3ctdG8tcmVtb3ZlLWNzcy1vdXRsaW5lcy1pbi1hbi1hY2Nlc3NpYmxlLW1hbm5lci9cbiAgc3VwcHJlc3NCdXR0b25Gb2N1c0hpZ2hsaWdodCA9ICgpID0+IHtcbiAgICBjb25zdCBub0ZvY3VzSGlnaGxpZ2h0ID0gJ25vLWZvY3VzLWhpZ2hsaWdodCcsXG4gICAgICAgICAgYnV0dG9uID0gdGhpcy5yZWZzLmJ1dHRvbjtcbiAgICBpZiAoYnV0dG9uICYmIGJ1dHRvbi5jbGFzc05hbWUuaW5kZXhPZihub0ZvY3VzSGlnaGxpZ2h0KSA8IDApXG4gICAgICBidXR0b24uY2xhc3NOYW1lICs9ICcgJyArIG5vRm9jdXNIaWdobGlnaHQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjbGFzc05hbWUsIGxhYmVsLCAuLi5vdGhlcnMgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgY2xhc3NlcyA9IChjbGFzc05hbWUgPyBjbGFzc05hbWUgKyAnICcgOiAnJykgKyAnZ2ItYnV0dG9uJztcblxuICAgIGNvbnN0IGhhbmRsZU1vdXNlRXZlbnQgPSAoKSA9PiB0aGlzLnN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT17Y2xhc3Nlc30gcmVmPSdidXR0b24nIHsuLi5vdGhlcnN9XG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17aGFuZGxlTW91c2VFdmVudH1cbiAgICAgICAgICAgICAgb25Nb3VzZURvd249e2hhbmRsZU1vdXNlRXZlbnR9PlxuICAgICAgICB7dChsYWJlbCl9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjtcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcblxuY2xhc3MgQ2hhbGxlbmdlQXdhcmRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNoYWxsZW5nZUF3YXJkczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGNvaW5QYXJ0czogUHJvcFR5cGVzLm51bWJlclxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgIGNoYWxsZW5nZUF3YXJkczoge3JvdXRlU3BlYzoge1wibGV2ZWxcIjogMCwgXCJtaXNzaW9uXCI6MCwgXCJjaGFsbGVuZ2VcIjowfSwgXCJjaGFsbGVuZ2VDb3VudFwiOjAsIFwicHJvZ3Jlc3NcIjpbXX0sXG4gICAgIHNpemU6IDI1NixcbiAgICAgY29pblBhcnRzOiAzXG4gIH07XG5cbiAgYWRkQXdhcmRJbWFnZSA9IChwcm9ncmVzc0ltYWdlcywgcGllY2VzLCBwaWVjZU51bSwgc2NvcmUsIHBpZWNlU3R5bGUpID0+IHtcbiAgICBsZXQgYXdhcmRMZXZlbCA9IHRoaXMuZ2V0QXdhcmRTdHlsZShzY29yZSk7XG4gICAgaWYgKHNjb3JlID4gLTEpe1xuICAgICAgbGV0IHBpZWNlTmFtZSA9IGBjb2luIHBpZWNlIHBpZWNlcyR7cGllY2VzfSBwaWVjZSR7cGllY2VOdW19ICR7cGllY2VTdHlsZX0gJHthd2FyZExldmVsfWA7XG4gICAgICBwcm9ncmVzc0ltYWdlcy5wdXNoKDxkaXYga2V5PXtwaWVjZU51bX0gY2xhc3NOYW1lPXtwaWVjZU5hbWV9IC8+KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2dyZXNzSW1hZ2VzO1xuICB9O1xuXG4gIGdldEF3YXJkU3R5bGUgPSAoc2NvcmUpID0+IHtcbiAgICBsZXQgYXdhcmRMZXZlbCA9IFwiZ29sZFwiO1xuICAgIGlmIChzY29yZSA9PT0gMSkgYXdhcmRMZXZlbCA9IFwic2lsdmVyXCI7XG4gICAgaWYgKHNjb3JlID49IDIpIGF3YXJkTGV2ZWwgPSBcImJyb256ZVwiO1xuICAgIHJldHVybiBhd2FyZExldmVsO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbGV2ZWwgPSAwLCBtaXNzaW9uID0gMCwgY2hhbGxlbmdlID0gMCwgY2hhbGxlbmdlQ291bnQgPSAwLCBwcm9ncmVzcyA9IFtdLCBjaGFsbGVuZ2VCYWNrZ3JvdW5kSW1hZ2UsIHByb2dyZXNzSW1hZ2VzID0gW107XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMucm91dGVTcGVjICE9IG51bGwpIHtcbiAgICAgIGxldmVsID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMucm91dGVTcGVjLmxldmVsLFxuICAgICAgbWlzc2lvbiA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYy5taXNzaW9uLFxuICAgICAgY2hhbGxlbmdlID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMucm91dGVTcGVjLmNoYWxsZW5nZSxcbiAgICAgIGNoYWxsZW5nZUNvdW50ID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMuY2hhbGxlbmdlQ291bnQ7XG4gICAgICBwcm9ncmVzcyA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnByb2dyZXNzO1xuICAgICAgY2hhbGxlbmdlQmFja2dyb3VuZEltYWdlID0gPGRpdiBjbGFzc05hbWU9XCJjb2luIGJhY2tncm91bmRcIiAvPjtcbiAgICB9IGVsc2UgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoIXByb2dyZXNzIHx8IHByb2dyZXNzID09PSBbXSlcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgbGV0IHNpemUgPSB0aGlzLnByb3BzLnNpemUgfHwgMjU2O1xuICAgIGxldCBzaXplU3R5bGUgPSB7XG4gICAgICB3aWR0aDogc2l6ZSArIFwicHhcIixcbiAgICAgIGhlaWdodDogc2l6ZSArIFwicHhcIlxuICAgIH07XG5cbiAgICBsZXQgcGllY2VLZXkgPSBsZXZlbCArIFwiOlwiICsgbWlzc2lvbiArIFwiOlwiO1xuICAgIGxldCBjaGFsbGVuZ2VTY29yZSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFsbGVuZ2VDb3VudDsgaSsrKXtcbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9ncmVzcyl7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwaWVjZUtleSArIGkpKXtcbiAgICAgICAgICBjb25zdCBzY29yZSA9IHByb2dyZXNzW2tleV07XG4gICAgICAgICAgaWYgKGNoYWxsZW5nZVNjb3JlW2ldID09IG51bGwpIHtcbiAgICAgICAgICAgICBjaGFsbGVuZ2VTY29yZVtpXSA9IHNjb3JlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGFsbGVuZ2VTY29yZVtpXSArPSBzY29yZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IHBpZWNlTnVtID0gY2hhbGxlbmdlICsgMTtcbiAgICBsZXQgY3VycmVudFBpZWNlU3R5bGUgPSBgY29pbiBwaWVjZSBwaWVjZXMke2NoYWxsZW5nZUNvdW50fSBwaWVjZSR7cGllY2VOdW19IHNpbmdsZSAke3RoaXMuZ2V0QXdhcmRTdHlsZShjaGFsbGVuZ2VTY29yZVtjaGFsbGVuZ2VdKX1gO1xuXG4gICAgZm9yICh2YXIgY2hhbGxlbmdlTnVtIGluIGNoYWxsZW5nZVNjb3JlKXtcbiAgICAgIHBpZWNlTnVtID0gcGFyc2VJbnQoY2hhbGxlbmdlTnVtKSArIDE7XG4gICAgICBwcm9ncmVzc0ltYWdlcyA9IHRoaXMuYWRkQXdhcmRJbWFnZShwcm9ncmVzc0ltYWdlcywgY2hhbGxlbmdlQ291bnQsIHBpZWNlTnVtLCBjaGFsbGVuZ2VTY29yZVtjaGFsbGVuZ2VOdW1dLCBcIndob2xlXCIpO1xuICAgIH1cblxuICAgIGxldCBzaW5nbGVQaWVjZU9wYWNpdHlTdGFydCA9IDEsIHNpbmdsZVBpZWNlT3BhY2l0eUVuZCA9IDAsIHN0eWxlID0ge30sIG9uUmVzdDtcbiAgICBzaW5nbGVQaWVjZU9wYWNpdHlFbmQgPSBzcHJpbmcoc2luZ2xlUGllY2VPcGFjaXR5RW5kLCB7IHN0aWZmbmVzczogMzAsIGRhbXBpbmc6MjAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNoYWxsZW5nZS1hd2FyZFwiIHN0eWxlPXtzaXplU3R5bGV9ID5cbiAgICAgICAge2NoYWxsZW5nZUJhY2tncm91bmRJbWFnZX1cbiAgICAgICAge3Byb2dyZXNzSW1hZ2VzfVxuICAgICAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1jb2luLXZpZXcnXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tvcGFjaXR5OiBzaW5nbGVQaWVjZU9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogc2luZ2xlUGllY2VPcGFjaXR5RW5kfX0gb25SZXN0PXtvblJlc3R9ID5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRTdHlsZSA9IHsgLi4uc3R5bGUsIC4uLmludGVycG9sYXRlZFN0eWxlIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwaWVjZU51bX0gc3R5bGU9e3RTdHlsZX0gY2xhc3NOYW1lPXtjdXJyZW50UGllY2VTdHlsZX0gLz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIDwvTW90aW9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFsbGVuZ2VBd2FyZFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgbWFsZS9mZW1hbGUgY2hhbmdlIGJ1dHRvbnNcbiAqIFRoZSBhcHBlYXJhbmNlIG9mIHRoZSBidXR0b25zIGlzIGN1cnJlbnRseSBlbnRpcmVseSBjb250cm9sbGVkIHZpYSBleHRlcm5hbCBDU1MuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2V4IC0gWydtYWxlJyB8ICdmZW1hbGUnXSBjdXJyZW50bHkgc2VsZWN0ZWQgYnV0dG9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNoYW5nZShldnQsIHNleCkgLSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB1c2UgY2xpY2tzIHRvIGNoYW5nZSBzZXhcbiAqL1xuY29uc3QgQ2hhbmdlU2V4QnV0dG9ucyA9ICh7aWQsIHNleCwgc3BlY2llcywgc2hvd0xhYmVsLCBzdHlsZT17fSwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IGNhcFNleCA9IHNleCA9PT0gQmlvTG9naWNhLk1BTEUgPyAnTWFsZScgOiAnRmVtYWxlJyxcbiAgICAgICAgc2VsZWN0ZWRTZXhDbGFzcyA9IHNleCA9PT0gQmlvTG9naWNhLk1BTEUgPyAnbWFsZS1zZWxlY3RlZCcgOiAnZmVtYWxlLXNlbGVjdGVkJyxcbiAgICAgICAgQlVUVE9OX0lNQUdFX1dJRFRIID0gMTAwLFxuICAgICAgICBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCA9IEJVVFRPTl9JTUFHRV9XSURUSCAvIDIsXG4gICAgICAgIGltYWdlU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9LFxuICAgICAgICBsYWJlbCA9IHNob3dMYWJlbCA/IGAke2NhcFNleH0gJHtzcGVjaWVzfWAgOiAnJyxcbiAgICAgICAgbGFiZWxFbGVtZW50ID0gc2hvd0xhYmVsID8gPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogQlVUVE9OX0lNQUdFX1dJRFRILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMH19PntsYWJlbH08L2Rpdj4gOiAnJztcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHRSZWN0ID0gZXZ0LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICBjbGlja1ggPSBldnQuY2xpZW50WCAtIGVsdFJlY3QubGVmdDtcblxuICAgIGlmIChzZXggPT09IEJpb0xvZ2ljYS5GRU1BTEUgJiYgY2xpY2tYID4gQlVUVE9OX0lNQUdFX01JRFBPSU5UX1gpeyAvLyB1c2VyIGNsaWNrZWQgb24gUmlnaHQgKG1hbGUpIGljb24gd2hpbGUgZmVtYWxlIHdhcyBzZWxlY3RlZFxuICAgICAgb25DaGFuZ2UoQmlvTG9naWNhLk1BTEUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzZXggPT09IEJpb0xvZ2ljYS5NQUxFICYmIGNsaWNrWCA8IEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YKXsgLy8gdXNlciBjbGlja2VkIG9uIExlZnQgKGZlbWFsZSkgaWNvbiB3aGlsZSBtYWxlIHdhcyBzZWxlY3RlZFxuICAgICAgb25DaGFuZ2UoQmlvTG9naWNhLkZFTUFMRSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgPGRpdiAgY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBjaGFuZ2Utc2V4LWJ1dHRvbnMgJHtzZWxlY3RlZFNleENsYXNzfWB9XG4gICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9ID5cbiAgICAgIDwvZGl2PlxuICAgICAge2xhYmVsRWxlbWVudH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNoYW5nZVNleEJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2V4OiBQcm9wVHlwZXMub25lT2YoW0Jpb0xvZ2ljYS5NQUxFLCBCaW9Mb2dpY2EuRkVNQUxFXSksXG4gIHNwZWNpZXM6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNob3dMYWJlbDogUHJvcFR5cGVzLmJvb2wsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhbmdlU2V4QnV0dG9ucztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgd2lkdGg6IDIzLFxuICAgIGhlaWdodDogMTIwLFxuICAgIHNwbGl0OiA0NVxuICB9LFxuICBzbWFsbDoge1xuICAgIHdpZHRoOiAxOSxcbiAgICBoZWlnaHQ6IDkwLFxuICAgIHNwbGl0OiAzNFxuICB9XG59O1xuXG5jb25zdCBkZWZhdWx0c1kgPSB7XG4gIG5vcm1hbDoge1xuICAgIHdpZHRoOiAyMyxcbiAgICBoZWlnaHQ6IDc1LFxuICAgIHNwbGl0OiAzOFxuICB9LFxuICBzbWFsbDoge1xuICAgIHdpZHRoOiAxOSxcbiAgICBoZWlnaHQ6IDYyLFxuICAgIHNwbGl0OiAzMlxuICB9XG59O1xuXG5jb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKHt3aWR0aCwgaGVpZ2h0LCBzcGxpdD00NSwgY29sb3I9JyNGRjk5OTknLCBzbWFsbD1mYWxzZSwgYm9sZD1mYWxzZSwgZW1wdHk9ZmFsc2UsIHlDaHJvbW9zb21lPWZhbHNlLCBhbmltYXRpb25TdHlsaW5nfSkgPT4ge1xuICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpIHtcbiAgICBsZXQgZGVmYXVsdERpbXMgPSB5Q2hyb21vc29tZSA/IGRlZmF1bHRzWSA6IGRlZmF1bHRzO1xuICAgICh7d2lkdGgsIGhlaWdodCwgc3BsaXR9ID0gc21hbGwgPyBkZWZhdWx0RGltcy5zbWFsbCA6IGRlZmF1bHREaW1zLm5vcm1hbCk7XG4gIH1cblxuICBjb25zdCByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgICBpbWFnZVdpZHRoID0gd2lkdGgrNCxcbiAgICAgICAgaGFsZkltYWdlV2lkdGggPSBpbWFnZVdpZHRoLzIsXG4gICAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQ7XG5cbiAgbGV0IHN0cm9rZVdpZHRoID0gd2lkdGggPCAxMCA/IDEgOiAyO1xuXG4gIGlmIChib2xkKSB7XG4gICAgY29sb3IgPSAnI0ZGNjY2Nic7XG4gICAgc3Ryb2tlV2lkdGggPSAzO1xuICB9XG4gIGlmIChlbXB0eSkge1xuICAgIGNvbG9yID0gJyNGRkYnO1xuICAgIHN0cm9rZVdpZHRoID0gMTtcbiAgfVxuICBsZXQgcG9zaXRpb25TdHlsaW5nID0ge307XG4gIGlmIChhbmltYXRpb25TdHlsaW5nKXtcbiAgICBwb3NpdGlvblN0eWxpbmcgPSB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgbGVmdDogYW5pbWF0aW9uU3R5bGluZy54LCB0b3A6IGFuaW1hdGlvblN0eWxpbmcueSwgb3BhY2l0eTogYW5pbWF0aW9uU3R5bGluZy5vcGFjaXR5XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hyb21vc29tZS1pbWFnZVwiIHN0eWxlPXtwb3NpdGlvblN0eWxpbmd9PlxuICAgICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysyfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17aGVpZ2h0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD17TWF0aC5tYXgoMCwgKHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKSl9IHdpZHRoPXt3aWR0aH0geT17cmFkaXVzKzJ9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPHJlY3QgaGVpZ2h0PXtNYXRoLm1heCgwLCAoaGVpZ2h0LXJhZGl1cyktKHNwbGl0K3JhZGl1cykpfSB3aWR0aD17d2lkdGh9IHk9e3NwbGl0K3JhZGl1c30geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT1cIjJcIiAgICAgICB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPXt3aWR0aCsyfSB5Mj17c3BsaXQtcmFkaXVzKzJ9ICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT1cIjJcIiAgICAgICB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICAgIDxsaW5lIHkxPXtzcGxpdCtyYWRpdXN9IHgxPXt3aWR0aCsyfSB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj17d2lkdGgrMn0gc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaHJvbW9zb21lSW1hZ2VWaWV3LnByb3BUeXBlcyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3BsaXQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzbWFsbDogUHJvcFR5cGVzLmJvb2wsXG4gIGJvbGQ6IFByb3BUeXBlcy5ib29sLFxuICBlbXB0eTogUHJvcFR5cGVzLmJvb2wsXG4gIHlDaHJvbW9zb21lOiBQcm9wVHlwZXMuYm9vbCxcbiAgYW5pbWF0aW9uU3R5bGluZzogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgICAgICAgICAgICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlclxuICAgICAgICAgICAgICAgICAgICB9KVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZUltYWdlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENocm9tb3NvbWVJbWFnZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lLWltYWdlJztcbmltcG9ydCBHZW5lTGFiZWxWaWV3IGZyb20gJy4vZ2VuZS1sYWJlbCc7XG5pbXBvcnQgQWxsZWxlVmlldyBmcm9tICcuL2FsbGVsZSc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuLyoqXG4gKiBWaWV3IG9mIGEgc2luZ2xlIGNocm9tb3NvbWUsIHdpdGggb3B0aW9uYWwgbGFiZWxzLCBwdWxsZG93bnMsIGFuZCBlbWJlZGRlZCBhbGxlbGVzLlxuICpcbiAqIERlZmluZWQgRUlUSEVSIHVzaW5nIGEgQmlvbG9naWNhIENocm9tb3NvbWUgb2JqZWN0LCBPUiB3aXRoIGEgQmlvbG9naWNhIG9yZ2FuaXNtLFxuICogY2hyb21vc29tZSBuYW1lIGFuZCBzaWRlLlxuICovXG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtjaHJvbW9zb21lLCBvcmcsIENocm9tb3NvbWVJbWFnZUNsYXNzPUNocm9tb3NvbWVJbWFnZVZpZXcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCB1c2VyQ2hhbmdlYWJsZUdlbmVzID0gW10sIHZpc2libGVHZW5lcyA9IFtdLCBoaWRkZW5BbGxlbGVzID0gW10sIHNtYWxsID0gZmFsc2UsIGVkaXRhYmxlID0gdHJ1ZSwgc2VsZWN0ZWQgPSBmYWxzZSwgb25BbGxlbGVDaGFuZ2UsIG9uQ2hyb21vc29tZVNlbGVjdGVkLCBzaG93TGFiZWxzID0gdHJ1ZSwgc2hvd0FsbGVsZXMgPSBmYWxzZSwgbGFiZWxzT25SaWdodCA9IHRydWUsIG9yZ05hbWUsIGRpc3BsYXlTdHlsZSA9IHt9fSkgPT4ge1xuXG4gIHZhciBjb250YWluZXJDbGFzcyA9IFwiaXRlbXNcIixcbiAgICAgIGVtcHR5ID0gZmFsc2UsXG4gICAgICB5Q2hyb21vc29tZSA9IGZhbHNlLFxuICAgICAgbGFiZWxzQ29udGFpbmVyLCBhbGxlbGVzQ29udGFpbmVyLCBjaHJvbUlkO1xuXG4gIGlmIChvcmcgJiYgY2hyb21vc29tZU5hbWUgJiYgc2lkZSkge1xuICAgIGNocm9tb3NvbWUgPSBvcmcuZ2V0R2Vub3R5cGUoKS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV1bc2lkZV07XG4gIH1cblxuICBpZiAoY2hyb21vc29tZSkge1xuICAgIGxldCBhbGxlbGVzID0gY2hyb21vc29tZS5hbGxlbGVzLFxuICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuZmlsdGVyVmlzaWJsZUFsbGVsZXMoYWxsZWxlcywgdXNlckNoYW5nZWFibGVHZW5lcywgdmlzaWJsZUdlbmVzLCBjaHJvbW9zb21lLnNwZWNpZXMpO1xuXG4gICAgaWYgKHNob3dMYWJlbHMpIHtcbiAgICAgIGxldCBsYWJlbHMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIGlmIChDaHJvbW9zb21lSW1hZ2VDbGFzcyA9PT0gQ2hyb21vc29tZUltYWdlVmlldykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEdlbmVMYWJlbFZpZXcga2V5PXthLmFsbGVsZX0gc3BlY2llcz17Y2hyb21vc29tZS5zcGVjaWVzfSBhbGxlbGU9e2EuYWxsZWxlfSBlZGl0YWJsZT17ZWRpdGFibGUgJiYgYS5lZGl0YWJsZX1cbiAgICAgICAgICBoaWRkZW5BbGxlbGVzPXsgaGlkZGVuQWxsZWxlcyB9XG4gICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBvbkFsbGVsZUNoYW5nZShhLmFsbGVsZSwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB9fS8+KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZ2LWdlbmUtbGFiZWwgYWxsZWxlIG5vbmVkaXRhYmxlXCIga2V5PXthLmFsbGVsZX0+XG4gICAgICAgICAgICAgIHtjaHJvbW9zb21lLnNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYS5hbGxlbGVdfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGxhYmVsc0NvbnRhaW5lciA9IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYWJlbHNcIj5cbiAgICAgICAgICB7IGxhYmVscyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcblxuICAgICAgaWYgKCFsYWJlbHNPblJpZ2h0KSB7XG4gICAgICAgIGNvbnRhaW5lckNsYXNzICs9IFwiIHJ0bFwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG93QWxsZWxlcykge1xuICAgICAgbGV0IGFsbGVsZVN5bWJvbHMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEFsbGVsZVZpZXcga2V5PXthLmFsbGVsZX0gYWxsZWxlPXthLmFsbGVsZX0gLz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBhbGxlbGVzQ29udGFpbmVyID0gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFsbGVsZXNcIj5cbiAgICAgICAgICB7IGFsbGVsZVN5bWJvbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGNocm9tb3NvbWUuc2lkZSA9PT0gXCJ5XCIpIHtcbiAgICAgIHlDaHJvbW9zb21lID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjaHJvbUlkID0gb3JnTmFtZSArIGNocm9tb3NvbWUuY2hyb21vc29tZSArIGNocm9tb3NvbWUuc2lkZTtcbiAgfSBlbHNlIHtcbiAgICBjaHJvbUlkID0gb3JnTmFtZTtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH1cbiAgY29uc3QgaGFuZGxlU2VsZWN0ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKG9uQ2hyb21vc29tZVNlbGVjdGVkKSB7XG4gICAgICBvbkNocm9tb3NvbWVTZWxlY3RlZChldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCIgb25DbGljaz17IGhhbmRsZVNlbGVjdCB9ID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29udGFpbmVyQ2xhc3MgfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaHJvbW9zb21lLWFsbGVsZS1jb250YWluZXJcIiBpZD17Y2hyb21JZH0gc3R5bGU9e2Rpc3BsYXlTdHlsZX0+XG4gICAgICAgICAgPENocm9tb3NvbWVJbWFnZUNsYXNzIHNtYWxsPXtzbWFsbH0gZW1wdHk9e2VtcHR5fSBib2xkPXtzZWxlY3RlZH0geUNocm9tb3NvbWU9e3lDaHJvbW9zb21lfS8+XG4gICAgICAgICAgeyBhbGxlbGVzQ29udGFpbmVyIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsgbGFiZWxzQ29udGFpbmVyIH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBDaHJvbW9zb21lSW1hZ2VDbGFzczogUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgY2hyb21vc29tZU5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNpZGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNocm9tb3NvbWU6IFByb3BUeXBlcy5vYmplY3QsXG4gIHVzZXJDaGFuZ2VhYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgc21hbGw6IFByb3BUeXBlcy5ib29sLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHNlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0xhYmVsczogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dBbGxlbGVzOiBQcm9wVHlwZXMuYm9vbCxcbiAgbGFiZWxzT25SaWdodDogUHJvcFR5cGVzLmJvb2wsXG4gIGRpc3BsYXlTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNocm9tb3NvbWVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZ05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogVXNlcyBhbiBTVkcgY2lyY3VsYXIgZ3JhZGllbnQgdG8gaW1wbGVtZW50IGEgZmFkaW5nIGdsb3cgYmFja2dyb3VuZC5cbiAqIEltcGxlbWVudGVkIGFzIGEgc3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIHRoZSBjb2xvciBvZiB0aGUgY2lyY3VsYXIgZ3JhZGllbnQgXCJnbG93XCJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gdGhlIGRpYW1ldGVyIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudFxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gc3R5bGVzIGFwcGxpZWQgdG8gdGhlIG91dGVyIGRpdlxuICovXG5jb25zdCBDaXJjdWxhckdsb3dWaWV3ID0gKHtpZCwgY29sb3IsIHNpemUsIHN0eWxlfSkgPT4ge1xuICBsZXQgcmFkaXVzID0gc2l6ZS8yLFxuICAgICAgY29sb3JOb0hhc2ggPSBjb2xvci5yZXBsYWNlKCcjJywgJycpLFxuICAgICAgZ3JhZGllbnRJRCA9IGBDaXJjdWxhckdsb3dWaWV3XyR7aWQgfHwgY29sb3JOb0hhc2h9YCxcbiAgICAgIGdyYWRpZW50SURVcmwgPSBgdXJsKCMke2dyYWRpZW50SUR9KWA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2lyY3VsYXItZ2xvd1wiIHN0eWxlPXtzdHlsZX0+XG4gICAgICA8c3ZnIHdpZHRoPXtzaXplKzJ9IGhlaWdodD17c2l6ZSsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxkZWZzPlxuICAgICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD17Z3JhZGllbnRJRH0+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMS4wXCIvPlxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMC4wXCIvPlxuICAgICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+XG4gICAgICAgIDwvZGVmcz5cbiAgICAgICAgPGNpcmNsZSBmaWxsPXtncmFkaWVudElEVXJsfSBjeD17cmFkaXVzfSBjeT17cmFkaXVzfSByPXtyYWRpdXN9IC8+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNpcmN1bGFyR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2lyY3VsYXJHbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vLyBpbWFnZSBzcGVjaWZpZWQgYXMgQ1NTIGJhY2tncm91bmQtaW1hZ2UsIGJ1dCBzaXplIGNvbnN0YW50cyByZXF1aXJlZCBpbiBKYXZhU2NyaXB0XG5leHBvcnQgY29uc3QgIEVHR19JTUFHRV9XSURUSCA9IDc1LFxuICAgICAgICAgICAgICBFR0dfSU1BR0VfSEVJR0hUID0gMTA5O1xuXG5leHBvcnQgY2xhc3MgRWdnVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlZ2c6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgaW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgY29uc3QgeyBlZ2csIGlkLCBpbmRleCwgb25DbGljayB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAob25DbGljaylcbiAgICAgIG9uQ2xpY2soaWQsIGluZGV4LCBlZ2cpO1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGVnZywgaWQsIGRpc3BsYXlTdHlsZSwgaXNTZWxlY3RlZCB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBlZ2dTdHlsZSA9IE9iamVjdC5hc3NpZ24oeyBmbGV4U2hyaW5rOiAwIH0sIGRpc3BsYXlTdHlsZSksXG4gICAgICAgICAgaXNIaWRkZW4gPSAoZWdnID09IG51bGwpLFxuICAgICAgICAgIGNsYXNzZXMgPSAnY2x1dGNoLWVnZycgKyAoaXNTZWxlY3RlZCA/ICcgc2VsZWN0ZWQnIDogJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChpc0hpZGRlbiA/ICcgaGlkZGVuJyA6ICcnKTtcbiAgICBpZiAoZGlzcGxheVN0eWxlICYmIChkaXNwbGF5U3R5bGUuc2l6ZSAhPSBudWxsKSkge1xuICAgICAgZWdnU3R5bGUud2lkdGggPSBkaXNwbGF5U3R5bGUuc2l6ZTtcbiAgICAgIGVnZ1N0eWxlLmhlaWdodCA9IGVnZ1N0eWxlLndpZHRoICogKEVHR19JTUFHRV9IRUlHSFQgLyBFR0dfSU1BR0VfV0lEVEgpO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT17Y2xhc3Nlc30ga2V5PXtpZH0gcmVmPSdkb21Ob2RlJyBzdHlsZT17ZWdnU3R5bGV9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9IC8+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBFZ2dDbHV0Y2hWaWV3ID0gKHtlZ2dzLCBpZFByZWZpeD0nZWdnLScsIHNlbGVjdGVkSW5kZXgsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgY29uc3QgT0REX0VHR19NQVJHSU4gPSA4LFxuICAgICAgICBFVkVOX0VHR19NQVJHSU4gPSAwO1xuICBsZXQgb3JnVmlld3M7XG5cbiAgZnVuY3Rpb24gZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIG1hcmdpbikge1xuICAgIGNvbnN0IGlkID0gYCR7aWRQcmVmaXh9JHtpbmRleH1gLFxuICAgICAgICAgIHZpc2liaWxpdHlTdHlsZSA9IGVnZyAmJiAoZWdnLmJhc2tldCA9PSBudWxsKSA/IHt9IDogeyB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9LFxuICAgICAgICAgIGVnZ1N0eWxlID0gT2JqZWN0LmFzc2lnbih7IG1hcmdpbkxlZnQ6IG1hcmdpbiwgbWFyZ2luUmlnaHQ6IG1hcmdpbiB9LCB2aXNpYmlsaXR5U3R5bGUpO1xuICAgIHJldHVybiA8RWdnVmlldyBlZ2c9e2VnZ30gaWQ9e2lkfSBrZXk9e2lkfSBpbmRleD17aW5kZXh9IGRpc3BsYXlTdHlsZT17ZWdnU3R5bGV9XG4gICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ID09PSBzZWxlY3RlZEluZGV4fSBvbkNsaWNrPXtvbkNsaWNrfSAvPjtcbiAgfVxuXG4gIC8vIGV2ZW4gbnVtYmVyIG9mIGVnZ3NcbiAgaWYgKGVnZ3MubGVuZ3RoICUgMiA9PT0gMCkge1xuICAgIG9yZ1ZpZXdzID0gZWdncy5yZWR1Y2UoKHByZXYsIGVnZywgaW5kZXgpID0+IHtcbiAgICAgIC8vIGZvciBmbGV4IGxheW91dCBwdXJwb3Nlcywgd2l0aCBvZGQgbnVtYmVycyBvZiBpdGVtc1xuICAgICAgLy8gd2UgYWRkIHNwYWNlciBpdGVtcyBiZXR3ZWVuIHRoZSBlZ2dzXG4gICAgICBjb25zdCBzcGFjZXJJRCA9IGAke2lkUHJlZml4fSR7aW5kZXh9LXNwYWNlcmAsXG4gICAgICAgICAgICBzcGFjZXJTdHlsZSA9IHsgbWFyZ2luTGVmdDogRVZFTl9FR0dfTUFSR0lOLCBtYXJnaW5SaWdodDogRVZFTl9FR0dfTUFSR0lOLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nIH0sXG4gICAgICAgICAgICBzcGFjZXIgPSA8RWdnVmlldyBlZ2c9e251bGx9IGtleT17c3BhY2VySUR9IGRpc3BsYXlTdHlsZT17c3BhY2VyU3R5bGV9IC8+O1xuICAgICAgaWYgKGluZGV4IDwgZWdncy5sZW5ndGgvMilcbiAgICAgICAgcHJldi5wdXNoKHNwYWNlcik7XG4gICAgICBwcmV2LnB1c2goZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIEVWRU5fRUdHX01BUkdJTikpO1xuICAgICAgaWYgKGluZGV4ID49IGVnZ3MubGVuZ3RoLzIpXG4gICAgICAgIHByZXYucHVzaChzcGFjZXIpO1xuICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwgW10pO1xuICAgIC8vb3JnVmlld3MgPSBlZ2dzLm1hcCgoZWdnLCBpbmRleCkgPT4gZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIEVWRU5fRUdHX01BUkdJTikpO1xuICB9XG5cbiAgZWxzZSB7XG4gICAgb3JnVmlld3MgPSBlZ2dzLnJlZHVjZSgocHJldiwgZWdnLCBpbmRleCkgPT4ge1xuICAgICAgcHJldi5wdXNoKGVnZ1ZpZXdGb3JJbmRleChlZ2csIGluZGV4LCBPRERfRUdHX01BUkdJTikpO1xuICAgICAgLy8gZm9yIGZsZXggbGF5b3V0IHB1cnBvc2VzLCB3aXRoIG9kZCBudW1iZXJzIG9mIGl0ZW1zXG4gICAgICAvLyB3ZSBhZGQgc3BhY2VyIGl0ZW1zIGJldHdlZW4gdGhlIGVnZ3NcbiAgICAgIGNvbnN0IHNwYWNlcklEID0gYCR7aWRQcmVmaXh9JHtpbmRleH0tc3BhY2VyYCxcbiAgICAgICAgICAgIHNwYWNlclN0eWxlID0geyBtYXJnaW5MZWZ0OiBPRERfRUdHX01BUkdJTiwgbWFyZ2luUmlnaHQ6IE9ERF9FR0dfTUFSR0lOLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nIH07XG4gICAgICBwcmV2LnB1c2goPEVnZ1ZpZXcgZWdnPXtudWxsfSBrZXk9e3NwYWNlcklEfSBkaXNwbGF5U3R5bGU9e3NwYWNlclN0eWxlfSAvPik7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9LCBbXSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBlZ2ctY2x1dGNoXCI+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkVnZ0NsdXRjaFZpZXcucHJvcFR5cGVzID0ge1xuICBlZ2dzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVnZ0NsdXRjaFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIGEgcmVjdGFuZ3VsYXIgdGV4dCBhcmVhIGZvciBwcm92aWRpbmcgZmVlZGJhY2sgdG8gdXNlcnMsIHN1Y2ggYXNcbiAqIHRoYXQgdXNlZCBpbiBHZW5pdmVyc2UncyBjaGFsbGVuZ2VzIGZvciBwcm92aWRpbmcgdHJpYWwgYW5kIGdvYWwgZmVlZGJhY2suXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdGV4dCAtIGEgc2luZ2xlIG9yIG11bHRpcGxlIGxpbmVzIG9mIHRleHQgdG8gZGlzcGxheVxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gaW5saW5lIHN0eWxlcyBhcHBsaWVkIHRvIHRoZSA8ZGl2PiBjb250YWluaW5nIGVhY2ggbGluZSBvZiB0ZXh0XG4gKi9cbmNvbnN0IEZlZWRiYWNrVmlldyA9ICh7dGV4dCwgc3R5bGU9e319KSA9PiB7XG4gIGNvbnN0IHRUZXh0ID0gQXJyYXkuaXNBcnJheSh0ZXh0KSA/IHRleHQgOiBbdGV4dF0sXG4gICAgICAgIGxpbmVDb3VudCA9IHRUZXh0Lmxlbmd0aCxcbiAgICAgICAgaGVpZ2h0ID0gMjAgKiBsaW5lQ291bnQgKyAyLFxuICAgICAgICBkZWZhdWx0U3R5bGUgPSB7IGhlaWdodDogaGVpZ2h0LCAuLi5zdHlsZSB9LFxuICAgICAgICB0ZXh0TGluZXMgPSB0VGV4dC5tYXAoKGlUZXh0LCBpbmRleCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2sgdGV4dC1saW5lXCIga2V5PXtpbmRleH0+e2lUZXh0fTwvZGl2Pik7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2stdmlld1wiIHN0eWxlPXtkZWZhdWx0U3R5bGV9PlxuICAgICAge3RleHRMaW5lc31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkZlZWRiYWNrVmlldy5wcm9wVHlwZXMgPSB7XG4gIHRleHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZlZWRiYWNrVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IElOSVRJQUxfR0FNRVRFX1NJWkUgPSAzMCxcbiAgICAgIEZJTkFMX0dBTUVURV9TSVpFID0gMTQwLFxuICAgICAgUkVTVElOR19NT1RIRVJfR0FNRVRFX1ggPSAwLFxuICAgICAgUkVTVElOR19GQVRIRVJfR0FNRVRFX1ggPSAxNTAsXG4gICAgICBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1ggPSA3MCxcbiAgICAgIEZFUlRJTElaSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDgwLFxuICAgICAgRklOQUxfWllHT1RFX1kgPSAtMTUwO1xuXG5leHBvcnQgY29uc3QgR0FNRVRFX1RZUEUgPSB7IE1PVEhFUjogJ21vdGhlcicsIEZBVEhFUjogJ2ZhdGhlcicgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVydGlsaXppbmdHYW1ldGVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHR5cGU6IFByb3BUeXBlcy5vbmVPZihbIEdBTUVURV9UWVBFLk1PVEhFUiwgR0FNRVRFX1RZUEUuRkFUSEVSIF0pLmlzUmVxdWlyZWQsXG4gICAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBmZXJ0aWxpemF0aW9uU3RhdGU6IFByb3BUeXBlcy5vbmVPZihbJ25vbmUnLCAnZmVydGlsaXppbmcnLCAnZmVydGlsaXplZCcsICdjb21wbGV0ZSddKS5pc1JlcXVpcmVkLFxuICAgIHZpc2libGVHZW5lczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgc3JjUmVjdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgZHN0UmVjdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgYW5pbVN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICAgIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdmlzaWJsZUdlbmVzOiBbXSxcbiAgICBhbmltU3RpZmZuZXNzOiAxMDBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGxldCB7Z2FtZXRlLCBpZCwgdmlzaWJsZUdlbmVzLCBhbmltU3RpZmZuZXNzLCBvblJlc3R9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgeE9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC5sZWZ0IC0gdGhpcy5wcm9wcy5kc3RSZWN0LmxlZnQgOiAwLFxuICAgICAgICB5T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LnRvcCAtIHRoaXMucHJvcHMuZHN0UmVjdC50b3AgOiAwLFxuICAgICAgICB4UmVzdGluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gUkVTVElOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFJFU1RJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICB4RmVydGlsaXppbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IEZFUlRJTElaSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgaW5pdGlhbCwgdEZpbmFsO1xuXG4gICAgaWYgKCFnYW1ldGUgfHwgKGlkID09IG51bGwpKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdub25lJykge1xuICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSKVxuICAgICAgICB4T2Zmc2V0ICs9IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YO1xuICAgICAgaW5pdGlhbCA9IHsgeDogeE9mZnNldCwgeTogeU9mZnNldCwgc2l6ZTogSU5JVElBTF9HQU1FVEVfU0laRSB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdmZXJ0aWxpemluZycpIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgb3BhY2l0eTogMS4wIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbml0aWFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogRklOQUxfWllHT1RFX1ksIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMC4wIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpZH0gdmlzaWJsZUdlbmVzPXt2aXNpYmxlR2VuZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXtpbml0aWFsfSBkaXNwbGF5PXt0RmluYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1TdGlmZm5lc3M9e2FuaW1TdGlmZm5lc3N9IG9uUmVzdD17b25SZXN0fSAvPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IEdhbWV0ZVBvb2xWaWV3ID0gKHtnYW1ldGVzLCB2aXNpYmxlR2VuZXM9W10sIHdpZHRoPTMwMCwgaGVpZ2h0PTIwMCwgYW5pbVN0aWZmbmVzcz02MCwgc2VsZWN0ZWRJZCwgaXNHYW1ldGVEaXNhYmxlZCwgb25HYW1ldGVTZWxlY3RlZH0pID0+IHtcbiAgbGV0IGdhbWV0ZUNvdW50ID0gZ2FtZXRlcy5sZW5ndGgsXG4gICAgICBnYW1ldGVTaXplID0gMzAsXG4gICAgICBtYXJnaW4gPSA1LFxuICAgICAgc3BhY2luZ0RlZmF1bHQgPSBnYW1ldGVTaXplICsgMiAqIG1hcmdpbixcbiAgICAgIHhTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB5U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgY29sRGVmYXVsdCA9IE1hdGguZmxvb3Iod2lkdGggLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICByb3dEZWZhdWx0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICBlbmFibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZEZsYWdzID0gaXNHYW1ldGVEaXNhYmxlZCA/IGdhbWV0ZXMubWFwKGcgPT4gaXNHYW1ldGVEaXNhYmxlZChnKSkgOiBbXSxcbiAgICAgIHRvdGFsRGlzYWJsZWRDb3VudCA9IGRpc2FibGVkRmxhZ3MucmVkdWNlKCh0b3RhbCxmbGFnKSA9PiB0b3RhbCArIGZsYWcsIDApLFxuICAgICAgLy8gbGVhdmUgcm9vbSBmb3IgdGhlIGRpc2FibGVkIGdhbWV0ZSByb3cgaWYgdGhlcmUgYXJlIGRpc2FibGVkIGdhbWV0ZXNcbiAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGhlaWdodCAtICh0b3RhbERpc2FibGVkQ291bnQgPyBzcGFjaW5nRGVmYXVsdCA6IDApIC0gNCAqIG1hcmdpbixcbiAgICAgIC8vIHBhY2sgdGhlIGRpc2FibGVkIGdhbWV0ZXMgaW50byB0aGUgZGlzYWJsZWQgcm93XG4gICAgICB4RGlzYWJsZWRTcGFjaW5nID0gTWF0aC5taW4oeFNwYWNpbmcgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aWR0aCAtIDcgKiBtYXJnaW4pIC8gdG90YWxEaXNhYmxlZENvdW50KSxcbiAgICAgIHlEaXNhYmxlZFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHRvdGFsRW5hYmxlZENvdW50ID0gZ2FtZXRlQ291bnQgLSB0b3RhbERpc2FibGVkQ291bnQsXG4gICAgICBnYW1ldGVWaWV3cztcblxuICAvLyBzcXVlZXplIGluIHRvIG1ha2Ugcm9vbSBmb3IgYWRkaXRpb25hbCBnYW1ldGVzIGlmIG5lY2Vzc2FyeVxuICB2YXIgY29sQ291bnQgPSBjb2xEZWZhdWx0LFxuICAgICAgcm93Q291bnQgPSByb3dEZWZhdWx0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA+IDApO1xuICB3aGlsZSAoY29sQ291bnQgKiByb3dDb3VudCA8IHRvdGFsRW5hYmxlZENvdW50KSB7XG4gICAgaWYgKHlTcGFjaW5nID4geFNwYWNpbmcpIHtcbiAgICAgIHlTcGFjaW5nID0gYXZhaWxhYmxlSGVpZ2h0IC8gKytyb3dDb3VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB4U3BhY2luZyA9ICh3aWR0aCAtIDQgKiBtYXJnaW4pIC8gKytjb2xDb3VudDtcbiAgICB9XG4gIH1cblxuICBnYW1ldGVWaWV3cyA9IGdhbWV0ZXMubWFwKChnYW1ldGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkRmxhZ3NbaW5kZXhdLFxuICAgICAgICAgIGxheW91dEluZGV4ID0gaXNEaXNhYmxlZCA/IGRpc2FibGVkQ291bnQrKyA6IGVuYWJsZWRDb3VudCsrLFxuICAgICAgICAgIHJvdyA9IGlzRGlzYWJsZWQgPyByb3dEZWZhdWx0IC0gMSA6IE1hdGguZmxvb3IobGF5b3V0SW5kZXggLyBjb2xDb3VudCksXG4gICAgICAgICAgY29sID0gaXNEaXNhYmxlZCA/IGxheW91dEluZGV4IDogbGF5b3V0SW5kZXggJSBjb2xDb3VudCxcbiAgICAgICAgICB5ID0gaXNEaXNhYmxlZCA/IHJvdyAqIHlEaXNhYmxlZFNwYWNpbmcgOiByb3cgKiB5U3BhY2luZyxcbiAgICAgICAgICB4ID0gaXNEaXNhYmxlZCA/IGNvbCAqIHhEaXNhYmxlZFNwYWNpbmcgOiBjb2wgKiB4U3BhY2luZztcbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2luZGV4ICsgMX0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZUdlbmVzPXt2aXNpYmxlR2VuZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXt7IHg6IE1hdGgucm91bmQod2lkdGgvMiksIHk6IC1NYXRoLnJvdW5kKHlTcGFjaW5nKSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5PXt7IHg6IE1hdGgucm91bmQoeCksIHk6IE1hdGgucm91bmQoeSkgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggKyAxID09PSBzZWxlY3RlZElkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkdhbWV0ZVNlbGVjdGVkfSAvPlxuICAgICk7XG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdhbWV0ZS1wb29sXCIgc3R5bGU9e3sgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9fT5cbiAgICAgIHsgZ2FtZXRlVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlUG9vbFZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICB2aXNpYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzZWxlY3RlZElkOiBQcm9wVHlwZXMubnVtYmVyLFxuICBpc0dhbWV0ZURpc2FibGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25HYW1ldGVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVBvb2xWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBhIEJpb2xvZ2ljYSBnYW1ldGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ2FtZXRlIC0gQmlvbG9naWNhIGdhbWV0ZSAobWFwIG9mIGNocm9tb3NvbWUgbmFtZXMgdG8gY2hyb21vc29tZXMpXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgdW5pcXVlIGlkIG9mIHRoaXMgZ2FtZXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB2aXNpYmxlR2VuZXMgLSBnZW5lcyB3aGljaCBzaG91bGQgYmUgdmlzaWJsZVxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgdmlzaWJsZUdlbmVzPVtdLCBkaXNwbGF5LCBpc1NlbGVjdGVkPWZhbHNlLCBpc0Rpc2FibGVkPWZhbHNlLCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgcmVjdCA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoIWlzRGlzYWJsZWQgJiYgb25DbGljaykge1xuICAgICAgb25DbGljayhldnQsIGlkLCByZWN0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKSB7XG4gICAgbGV0IHRvb2x0aXAgPSBcIlwiO1xuXG4gICAgZm9yIChjb25zdCBjaCBpbiBnYW1ldGUpIHtcbiAgICAgIHZhciBjaHJvbW9zb21lID0gZ2FtZXRlW2NoXSxcbiAgICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuZmlsdGVyVmlzaWJsZUFsbGVsZXMoY2hyb21vc29tZS5hbGxlbGVzLCBbXSwgdmlzaWJsZUdlbmVzLCBjaHJvbW9zb21lLnNwZWNpZXMpO1xuICAgICAgZm9yIChjb25zdCBhbGxlbGUgb2YgdmlzaWJsZUFsbGVsZXMpIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBjaHJvbW9zb21lLnNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlLmFsbGVsZV07XG4gICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIGxhYmVsO1xuICAgICAgfVxuICAgICAgaWYgKGNoID09PSAnWFknKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY2hyb21vc29tZS5zaWRlID09PSAneScgPyAneScgOiAneCc7XG4gICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9vbHRpcDtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkQ2xhc3MgPSBpc1NlbGVjdGVkICYmICFpc0Rpc2FibGVkID8gXCJzZWxlY3RlZFwiIDogXCJcIixcbiAgICAgICAgZGlzYWJsZWRDbGFzcyA9IGlzRGlzYWJsZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiLFxuICAgICAgICBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGNsYXNzZXMgPSBgZ2VuaWJsb2NrcyBnYW1ldGUgJHtzZWxlY3RlZENsYXNzfSAke2Rpc2FibGVkQ2xhc3N9IGdyb3VwJHtncm91cH1gLFxuICAgICAgICBzaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICByb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICB0cmFuc2Zvcm0gPSByb3RhdGlvbiA/IGByb3RhdGUoJHtyb3RhdGlvbn1kZWcpYCA6ICcnLFxuICAgICAgICBvcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHRvb2x0aXAgPSBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gdGl0bGU9e3Rvb2x0aXB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkueCwgdG9wOiBkaXNwbGF5LnksXG4gICAgICAgICAgICB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgdHJhbnNmb3JtLCBvcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHZpc2libGVHZW5lczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7ICAgICAgICAvLyBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KS5pc1JlcXVpcmVkLFxuICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEdlbmVMYWJlbFZpZXcgPSAoe3NwZWNpZXMsIGFsbGVsZSwgZWRpdGFibGU9ZmFsc2UsIGhpZGRlbkFsbGVsZXM9W10sIG9uQWxsZWxlQ2hhbmdlfSkgPT4ge1xuICBpZiAoIWVkaXRhYmxlKSB7XG4gICAgY29uc3QgYWxsZWxlTmFtZSA9IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbmUtbGFiZWwgYWxsZWxlIG5vbmVkaXRhYmxlXCI+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHsgYWxsZWxlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYWxsZWxlcyA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYWxsZWxlKS5hbGxlbGVzLFxuICAgICAgICAgIHZpc2libGVBbGxlbGVzID0gYWxsZWxlcy5maWx0ZXIoYSA9PiBoaWRkZW5BbGxlbGVzLmluZGV4T2YoYSkgPT09IC0xKSxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIGFsbGVsZU9wdGlvbnMgPSBhbGxlbGVOYW1lcy5tYXAoKG5hbWUsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17bmFtZX0gdmFsdWU9e3Zpc2libGVBbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5lLWxhYmVsIGFsbGVsZSBlZGl0YWJsZVwiPlxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgYWxsZWxlIH0gb25DaGFuZ2U9eyBvbkFsbGVsZUNoYW5nZSB9PlxuICAgICAgICAgIHsgYWxsZWxlT3B0aW9ucyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVMYWJlbFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5cbmxldCBUZXN0UHVsbGRvd25WaWV3ID0gKHtzcGVjaWVzLCBnZW5lLCBzZWxlY3Rpb24sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICAgICAgbGV0IGFsbGVsZXMgPSBnZW5lLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIG51bUFsbGVsZXMgPSBhbGxlbGVOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgcG9zc2libGVDb21ib3MgPSBbXSxcbiAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uIHx8IFwicGxhY2Vob2xkZXJcIixcbiAgICAgICAgICBpLCBqO1xuXG4gICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PVwicGxhY2Vob2xkZXJcIiB2YWx1ZT1cInBsYWNlaG9sZGVyXCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNlbGVjdCBhIEdlbm90eXBlPC9vcHRpb24+KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG51bUFsbGVsZXM7IGkrKykge1xuICAgICAgICBmb3IgKGogPSBpOyBqIDwgbnVtQWxsZWxlczsgaisrKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGkgKyBcIiBcIiArIGosXG4gICAgICAgICAgICAgIHN0cmluZyA9IGFsbGVsZU5hbWVzW2ldICsgXCIgLyBcIiArIGFsbGVsZU5hbWVzW2pdO1xuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2tleX0+e3N0cmluZ308L29wdGlvbj4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0LXdyYXBwZXJcIj5cbiAgICAgICAgICA8c2VsZWN0IHZhbHVlPXsgY3VycmVudFNlbGVjdGlvbiB9IG9uQ2hhbmdlPXsgb25TZWxlY3Rpb25DaGFuZ2UgfT5cbiAgICAgICAgICAgIHsgcG9zc2libGVDb21ib3MgfVxuICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfTtcblxuY29uc3QgR2Vub21lVGVzdFZpZXcgPSAoe29yZywgdXNlckNoYW5nZWFibGVHZW5lcz1bXSwgc2VsZWN0aW9uPXt9LCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdLFxuICAgICAgYWxsVmlzaWJsZSA9IHVzZXJDaGFuZ2VhYmxlR2VuZXMubGVuZ3RoID09PSAwO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBhbGxlbGVzID0gY2hyb21bT2JqZWN0LmtleXMoY2hyb20pWzBdXS5hbGxlbGVzLFxuICAgICAgICBnZW5lcyA9IGFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGcgPT4gYWxsVmlzaWJsZSB8fCB1c2VyQ2hhbmdlYWJsZUdlbmVzLmluZGV4T2YoZy5uYW1lKSA+IC0xKSxcbiAgICAgICAgcHVsbGRvd25zID0gZ2VuZXMubWFwKGcgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8VGVzdFB1bGxkb3duVmlld1xuICAgICAgICAgICAgICBrZXkgICAgICAgPSB7IGcubmFtZSB9XG4gICAgICAgICAgICAgIHNwZWNpZXMgICA9IHsgb3JnLnNwZWNpZXMgfVxuICAgICAgICAgICAgICBnZW5lICAgICAgPSB7IGcgfVxuICAgICAgICAgICAgICBzZWxlY3Rpb24gPSB7IHNlbGVjdGlvbltnLm5hbWVdIH1cbiAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UgPSB7IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UoZywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgfSB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW1zXCIga2V5PXtjaHJvbW9zb21lTmFtZX0+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2Vub21lLXRlc3Qtb3B0aW9uc1wiPlxuICAgICAgICAgIHsgcHVsbGRvd25zIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbm9tZS10ZXN0XCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5UZXN0UHVsbGRvd25WaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBnZW5lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHNlbGVjdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbkdlbm9tZVRlc3RWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHVzZXJDaGFuZ2VhYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgc2VsZWN0aW9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVGVzdFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lVmlldyBmcm9tICcuL2Nocm9tb3NvbWUnO1xuXG4vKipcbiAqIFZpZXcgb2YgdGhlIHNldCBvZiBjaHJvbW9zb21lcyBvZiBhbiBvcmdhbmlzbSwgb3JkZXJlZCBhcyBtYXRjaGVkIHBhaXJzLlxuICpcbiAqIFVzdWFsbHkgZGVmaW5lZCBieSBwYXNzaW5nIGluIGEgQmlvbG9naWNhIE9yZ2FuaXNtLCBidXQgbWF5IGFsc28gYmUgZGVmaW5lZCBieVxuICogcGFzc2luZyBpbiBhIG1hcCBvZiBCaW9sb2dpY2EgQ2hyb21vc29tZXMgYW5kIGEgQmlvbG9naWNhIFNwZWNpZXMuXG4gKi9cbmNvbnN0IEdlbm9tZVZpZXcgPSAoe29yZywgY2xhc3NOYW1lPVwiXCIsIENocm9tb3NvbWVJbWFnZUNsYXNzLCBjaHJvbW9zb21lcywgc3BlY2llcywgdXNlckNoYW5nZWFibGVHZW5lcz1bXSwgdmlzaWJsZUdlbmVzPVtdLCBoaWRkZW5BbGxlbGVzPVtdLCBlZGl0YWJsZT10cnVlLCBzaG93TGFiZWxzPXRydWUsIHNob3dBbGxlbGVzPWZhbHNlLCBzZWxlY3RlZENocm9tb3NvbWVzPXt9LCBzbWFsbD1mYWxzZSwgb3JnTmFtZSwgZGlzcGxheVN0eWxlLCBvbkFsbGVsZUNoYW5nZSwgb25DaHJvbW9zb21lU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgaWYgKG9yZykge1xuICAgIGNocm9tb3NvbWVzID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzO1xuICAgIHNwZWNpZXMgPSBvcmcuc3BlY2llcztcbiAgfVxuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBzcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IGNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBsZXQgY2hyb21vc29tZSA9IGNocm9tW3NpZGVdO1xuICAgICAgcGFpcnMucHVzaChcbiAgICAgICAgPENocm9tb3NvbWVWaWV3XG4gICAgICAgICAgQ2hyb21vc29tZUltYWdlQ2xhc3M9e0Nocm9tb3NvbWVJbWFnZUNsYXNzfVxuICAgICAgICAgIGNocm9tb3NvbWU9e2Nocm9tb3NvbWV9XG4gICAgICAgICAga2V5PXtwYWlycy5sZW5ndGggKyAxfVxuICAgICAgICAgIHVzZXJDaGFuZ2VhYmxlR2VuZXM9e3VzZXJDaGFuZ2VhYmxlR2VuZXN9XG4gICAgICAgICAgdmlzaWJsZUdlbmVzPXt2aXNpYmxlR2VuZXN9XG4gICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MCB8fCBzaWRlPT09XCJiXCJ9XG4gICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlfVxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSA9PT0gc2lkZX1cbiAgICAgICAgICBzaG93TGFiZWxzPXtzaG93TGFiZWxzfVxuICAgICAgICAgIHNob3dBbGxlbGVzPXtzaG93QWxsZWxlc31cbiAgICAgICAgICBzbWFsbD17c21hbGx9XG4gICAgICAgICAgb3JnTmFtZT17b3JnTmFtZX1cbiAgICAgICAgICBkaXNwbGF5U3R5bGU9e2Rpc3BsYXlTdHlsZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24ocHJldkFsbGVsZSwgbmV3QWxsZWxlKSB7XG4gICAgICAgICAgICBvbkFsbGVsZUNoYW5nZShjaHJvbW9zb21lTmFtZSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkPXtmdW5jdGlvbihlbCl7XG4gICAgICAgICAgICBpZiAob25DaHJvbW9zb21lU2VsZWN0ZWQpXG4gICAgICAgICAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkKG9yZywgY2hyb21vc29tZU5hbWUsIHNpZGUsIGVsKTtcbiAgICAgICAgICB9fS8+XG4gICAgICApO1xuICAgIH1cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLXBhaXJcIiBrZXk9e3BhaXJXcmFwcGVycy5sZW5ndGggKyAxfT5cbiAgICAgICAgeyBwYWlycyB9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIGNvbnN0IGNsYXNzZXMgPSBcImdlbmlibG9ja3MgZ2Vub21lXCIgKyAoY2xhc3NOYW1lID8gXCIgXCIgKyBjbGFzc05hbWUgOiBcIlwiKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIENocm9tb3NvbWVJbWFnZUNsYXNzOiBQcm9wVHlwZXMuZnVuYyxcbiAgY2hyb21vc29tZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHVzZXJDaGFuZ2VhYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dMYWJlbHM6IFByb3BUeXBlcy5ib29sLFxuICBzaG93QWxsZWxlczogUHJvcFR5cGVzLmJvb2wsXG4gIHNlbGVjdGVkQ2hyb21vc29tZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHNtYWxsOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNocm9tb3NvbWVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZ05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5cbmNvbnN0IEdsb3dCYWNrZ3JvdW5kVmlldyA9ICh7aWQsIGNvbG9yLCBzaXplLCBjb250YWluZXJTdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCBDaGlsZENvbXBvbmVudCwgY2hpbGRTdHlsZT17fSwgLi4ub3RoZXJzfSkgPT4ge1xuICBjb25zdCB0Q29udGFpbmVyU3R5bGUgPSB7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLCAuLi5jb250YWluZXJTdHlsZSB9LFxuICAgICAgICB0R2xvd1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uZ2xvd1N0eWxlIH0sXG4gICAgICAgIHRDaGlsZFN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uY2hpbGRTdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdsb3ctYmFja2dyb3VuZFwiIHN0eWxlPXt0Q29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgaWQ9eydnbG93LScraWR9IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e3RHbG93U3R5bGV9Lz5cbiAgICAgIDxDaGlsZENvbXBvbmVudCBpZD17J2NoaWxkLScraWR9IHN0eWxlPXt0Q2hpbGRTdHlsZX0gd2lkdGg9e3NpemV9IHsuLi5vdGhlcnN9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HbG93QmFja2dyb3VuZFZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGNvbnRhaW5lclN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBnbG93U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIENoaWxkQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBjaGlsZFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbG93QmFja2dyb3VuZFZpZXc7XG4iLCIvKlxuICogQmFzZWQgb24gUmVhY3RPdmVybGF5cyBkZW1vIGF0IGh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL3JlYWN0LW92ZXJsYXlzL2V4YW1wbGVzLyNtb2RhbHNcbiAqL1xuaW1wb3J0IE1vZGFsIGZyb20gJ3JlYWN0LW92ZXJsYXlzL2xpYi9Nb2RhbCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCBDaGFsbGVuZ2VBd2FyZFZpZXcgZnJvbSAnLi9jaGFsbGVuZ2UtYXdhcmQnO1xuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0IGZyb20gJy4uL3V0aWxpdGllcy90cmFuc2xhdGUnO1xuXG5jb25zdCBtb2RhbFN0eWxlID0ge1xuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiAxMDQwLFxuICB0b3A6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDBcbn07XG5cbmNvbnN0IGJhY2tkcm9wU3R5bGUgPSB7XG4gIC4uLm1vZGFsU3R5bGUsXG4gIHpJbmRleDogJ2F1dG8nLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJyxcbiAgb3BhY2l0eTogMC4xXG59O1xuXG5jb25zdCBkaWFsb2dTdHlsZSA9IGZ1bmN0aW9uKHRvcD1cIjUwJVwiKSB7XG4gIC8vIHdlIHVzZSBzb21lIHBzZXVkbyByYW5kb20gY29vcmRzIHNvIG5lc3RlZCBtb2RhbHNcbiAgLy8gZG9uJ3Qgc2l0IHJpZ2h0IG9uIHRvcCBvZiBlYWNoIG90aGVyLlxuICBsZXQgbGVmdCA9IDUwO1xuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAzODUsXG4gICAgdG9wOiB0b3AsIGxlZnQ6IGxlZnQgKyAnJScsXG4gICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC0ke2xlZnR9JSlgLFxuICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChyZXNvdXJjZXMvaW1hZ2VzL3BhcmNobWVudC5qcGcpJyxcbiAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcbiAgICBiYWNrZ3JvdW5kT3JpZ2luOiAnYm9yZGVyLWJveCcsXG4gICAgYm94U2hhZG93OiAnMCAxMHB4IDVweCByZ2JhKDAsMCwwLC41KScsXG4gICAgcGFkZGluZ0JvdHRvbTogJzE1cHgnLFxuICAgIHBhZGRpbmdMZWZ0OiAnMTVweCcsXG4gICAgb3V0bGluZTogJ25vbmUnXG4gIH07XG59O1xuXG5cbmNsYXNzIE1vZGFsQWxlcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2hvdzogUHJvcFR5cGVzLmJvb2wsXG4gICAgbWVzc2FnZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSksXG4gICAgZXhwbGFuYXRpb246IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgIGxlZnRCdXR0b246IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSksXG4gICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0pLFxuICAgIHJpZ2h0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICBvbkhpZGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uTGVmdEJ1dHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG9wdGlvbmFsIGNsaWNrIGhhbmRsZXJzIGlmIG5vdCBkZWZpbmVkXG4gICAgb25SaWdodEJ1dHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgLy8gaW4gYnV0dG9uIHByb3BzLiAoQmV0dGVyIGZvciBgbWFwRGlzcGF0Y2hUb1Byb3BzYClcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdG9wOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNob3c6IGZhbHNlLFxuICAgIGNoYWxsZW5nZUF3YXJkczogeyBpZDowLCBwcm9ncmVzczogW10gfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8qIGVzbGludCByZWFjdC9qc3gtaGFuZGxlci1uYW1lczogMCAqL1xuICAgIGNvbnN0IGxlZnRQcm9wcyA9IHRoaXMucHJvcHMubGVmdEJ1dHRvbiB8fCB7fSxcbiAgICAgICAgICBsZWZ0QnV0dG9uID0gbGVmdFByb3BzLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxCdXR0b24gbGFiZWw9e2xlZnRQcm9wcy5sYWJlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFsZXJ0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17bGVmdFByb3BzLm9uQ2xpY2sgfHwgdGhpcy5wcm9wcy5vbkxlZnRCdXR0b25DbGlja30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIHJpZ2h0UHJvcHMgPSB0aGlzLnByb3BzLnJpZ2h0QnV0dG9uIHx8IHt9LFxuICAgICAgICAgIHJpZ2h0QnV0dG9uID0gPEJ1dHRvbiBsYWJlbD17cmlnaHRQcm9wcy5sYWJlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhbGVydC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtyaWdodFByb3BzLm9uQ2xpY2sgfHwgdGhpcy5wcm9wcy5vblJpZ2h0QnV0dG9uQ2xpY2t9Lz47XG4gICAgdmFyIGF3YXJkVmlldywgZXhwbGFuYXRpb25WaWV3O1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzKXtcbiAgICAgIGF3YXJkVmlldyA9IDxDaGFsbGVuZ2VBd2FyZFZpZXcgY2hhbGxlbmdlQXdhcmRzPXt0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkc30gLz47XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLmV4cGxhbmF0aW9uKSB7XG4gICAgICBleHBsYW5hdGlvblZpZXcgPSA8cD57dCh0aGlzLnByb3BzLmV4cGxhbmF0aW9uKX08L3A+O1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPE1vZGFsICBhcmlhLWxhYmVsbGVkYnk9J21vZGFsLWxhYmVsJ1xuICAgICAgICAgICAgICBzdHlsZT17bW9kYWxTdHlsZX1cbiAgICAgICAgICAgICAgYmFja2Ryb3BTdHlsZT17YmFja2Ryb3BTdHlsZX1cbiAgICAgICAgICAgICAgc2hvdz17dGhpcy5wcm9wcy5zaG93fVxuICAgICAgICAgICAgICBvbkhpZGU9e3RoaXMucHJvcHMub25IaWRlfSA+XG4gICAgICAgIDxkaXYgc3R5bGU9e2RpYWxvZ1N0eWxlKHRoaXMucHJvcHMudG9wKX0gPlxuICAgICAgICAgIDxoNCBpZD0nbW9kYWwtbGFiZWwnPnt0KHRoaXMucHJvcHMubWVzc2FnZSl9PC9oND5cbiAgICAgICAgICB7YXdhcmRWaWV3fVxuICAgICAgICAgIHtleHBsYW5hdGlvblZpZXd9XG4gICAgICAgICAge2xlZnRCdXR0b259IHtyaWdodEJ1dHRvbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L01vZGFsPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kYWxBbGVydDtcblxuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG4vKipcbiAqIFByZXNlbnRzIGVpdGhlciBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBvciBhIHNpbXBsZSBudW1iZXIgd2l0aGluIGEgc3F1YXJlIGJvcmRlci5cbiAqIERlc2lnbmVkIHRvIGJlIHVzZWQgYXMgdHJpYWwgZmVlZGJhY2sgaW5kaWNhdGluZyB0aGUgbnVtYmVyIG9mIHRyaWFscyBzdWNjZXNzZnVsbHlcbiAqIGNvbXBsZXRlZCwgZm9yIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIGEgdW5pcXVlIGlkIGZvciBDU1MgcHVycG9zZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgLSBDU1MgY2xhc3MgdG8gYmUgYXBwbGllZFxuICogQHBhcmFtIHtudW1iZXJ9IG9yZGluYWwgLSB0aGUgbnVtZXJpYyB2YWx1ZSB0byBiZSByZXByZXNlbnRlZCBpZiBubyBvcmdhbmlzbSBzcGVjaWZpZWRcbiAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSBvcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdmlld1xuICovXG5jb25zdCBPcmRpbmFsT3JnYW5pc21WaWV3ID0gKHtpZCwgY2xhc3NOYW1lLCBvcmRpbmFsLCBvcmdhbmlzbSwgc2l6ZT0zMiwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0geyB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplIH0sXG4gICAgICAgIG9yZ1ZpZXcgPSBvcmdhbmlzbSAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgID8gPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gb3JnPXtvcmdhbmlzbX0gd2lkdGg9e3NpemV9IHsuLi5vdGhlcn0gLz5cbiAgICAgICAgICAgICAgICAgICAgOiA8ZGl2IGNsYXNzTmFtZT0nb3JkaW5hbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7b3JkaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj47XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmRpbmFsLW9yZ2FuaXNtICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICB7IG9yZ1ZpZXcgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JkaW5hbE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9yZGluYWw6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9yZ2FuaXNtOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmRpbmFsT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQmlvTG9naWNhIG9yZ2FuaXNtIGFzIGFuIGltYWdlIG9uIHRvcCBvZiBhIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQuXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gb3JnIC0gdGhlIG9yZ2FuaXNtIHRvIGJlIHJlcHJlc2VudGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB0aGUgY29sb3Igb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQgdmlldy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gKi9cbmNvbnN0IE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2lkPSdvcmctZ2xvdycsIGNsYXNzTmFtZT0nJywgY29sb3I9XCIjRkZGRkFBXCIsIHNpemU9MjAwLCBzdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBsb2NhbEdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmdsb3dTdHlsZSB9LFxuICAgICAgICBvcmdTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLnN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmdhbmlzbS1nbG93ICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17YCR7aWR9LWdsb3dgfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtsb2NhbEdsb3dTdHlsZX0vPlxuICAgICAgPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gd2lkdGg9e3NpemV9IHN0eWxlPXtvcmdTdHlsZX0gey4uLm90aGVyfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2xvd1N0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgY2xhc3NOYW1lPVwiXCIsIHdpZHRoPTIwMCwgZmxpcHBlZD1mYWxzZSwgc3R5bGU9e30sIG9uQ2xpY2ssIHdyYXBwZXIgfSkgPT4ge1xuICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL2dlbml2ZXJzZS1yZXNvdXJjZXMuY29uY29yZC5vcmcvcmVzb3VyY2VzL2RyYWtlcy9pbWFnZXMvXCIsXG4gICAgICAgIHVybCAgICAgPSBvcmcgPyBiYXNlVXJsICsgb3JnLmdldEltYWdlTmFtZSgpIDogbnVsbCxcbiAgICAgICAgLy8gVGhlIGdvYWwgaGVyZSB3YXMgdG8gaGF2ZSB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBzZWxlY3QgdGhlIG9yZ2FuaXNtLFxuICAgICAgICAvLyBzbyB0aGF0IG1vdXNlZG93bi1kcmFnIHdpbGwgYm90aCBzZWxlY3QgdGhlIG9yZ2FuaXNtIGFuZCBiZWdpbiB0aGVcbiAgICAgICAgLy8gZHJhZy4gVGhpcyB3b3JrcyBvbiBDaHJvbWUgYW5kIFNhZmFyaSwgYnV0IG9uIEZpcmVmb3ggaXQgZGlzYWJsZXNcbiAgICAgICAgLy8gZHJhZ2dpbmcuIERpc2FibGluZyB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBtZWFucyB0aGF0IEZpcmVmb3ggdXNlcnNcbiAgICAgICAgLy8gbXVzdCBjbGljayB0byBzZWxlY3QgYW5kIHRoZW4gY2xpY2sgdG8gZHJhZywgYnV0IGF0IGxlYXN0IHRoZXkgY2FuXG4gICAgICAgIC8vIGRyYWcuIFRoZSByaWdodCBzb2x1dGlvbiBpcyBwcm9iYWJseSB0byBhbGxvdyBvcmdhbmlzbXMgdG8gYmUgZHJhZ2dlZFxuICAgICAgICAvLyB3aGV0aGVyIG9yIG5vdCB0aGV5J3JlIHNlbGVjdGVkIGFuZCB0aGVuIGhvcGVmdWxseSB0aGUgb25Nb3VzZURvd25cbiAgICAgICAgLy8gaGFuZGxlciB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQuIE90aGVyd2lzZSwgaXQgbWF5IGJlIG5lY2Vzc2FyeSB0b1xuICAgICAgICAvLyBzZWxlY3QgdGhlIG9yZ2FuaXNtIChpZiBpdCBpc24ndCBhbHJlYWR5IHNlbGVjdGVkKSBpbiBiZWdpbkRyYWcuXG4gICAgICAgIGlzRmlyZWZveCA9IChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID49IDApLFxuICAgICAgICBoYW5kbGVNb3VzZURvd24gPSBpc0ZpcmVmb3ggPyB1bmRlZmluZWQgOiBoYW5kbGVDbGljayxcbiAgICAgICAgZGl2V3JhcHBlciA9IHdyYXBwZXIgfHwgZnVuY3Rpb24oZWx0KSB7IHJldHVybiBlbHQ7IH07XG5cbiAgbGV0IGNsYXNzZXMgPSBcImdlbmlibG9ja3Mgb3JnYW5pc21cIiArIChjbGFzc05hbWUgPyBcIiBcIiArIGNsYXNzTmFtZSA6IFwiXCIpO1xuICBpZiAoZmxpcHBlZCkge1xuICAgIGNsYXNzZXMgKz0gXCIgZmxpcHBlZFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaWQsIG9yZyk7XG4gIH1cblxuICByZXR1cm4gZGl2V3JhcHBlcihcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gaWQ9e2lkfSBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgb25Nb3VzZURvd249e29uQ2xpY2sgPyBoYW5kbGVNb3VzZURvd24gOiBudWxsfVxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2sgPyBoYW5kbGVDbGljayA6IG51bGx9PlxuICAgICAge3VybCA/IDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0gLz4gOiBudWxsfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIHdyYXBwZXI6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQZW5WaWV3IGZyb20gJy4vcGVuJztcbmltcG9ydCBTdGF0c1ZpZXcgZnJvbSAnLi9zdGF0cyc7XG5pbXBvcnQgVGFicyBmcm9tICdyZWFjdC1zaW1wbGV0YWJzJztcblxuY2xhc3MgUGVuU3RhdHNWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgb3JncywgbGFzdENsdXRjaFNpemUsIHNlbGVjdGVkSW5kZXgsIG9uU2VsZWN0aW9uQ2hhbmdlLCAuLi5vdGhlcnMgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgbGFzdENsdXRjaCA9IG9yZ3Muc2xpY2UoLWxhc3RDbHV0Y2hTaXplKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8VGFicz5cbiAgICAgICAgPFRhYnMuUGFuZWwgdGl0bGU9XCJCcmVlZGluZyBQZW5cIiBrZXk9XCJCcmVlZGluZyBQZW5cIj5cbiAgICAgICAgICA8UGVuVmlldyBvcmdzPXtsYXN0Q2x1dGNofSB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleD17c2VsZWN0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Z1bmN0aW9uKGlTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvblNlbGVjdGlvbkNoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShpU2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L1RhYnMuUGFuZWw+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiU3RhdHNcIiBrZXk9XCJTdGF0c1wiPlxuICAgICAgICAgIDxTdGF0c1ZpZXcgb3Jncz17b3Jnc30gbGFzdENsdXRjaFNpemU9e2xhc3RDbHV0Y2hTaXplfSAvPlxuICAgICAgICA8L1RhYnMuUGFuZWw+XG4gICAgICA8L1RhYnM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQZW5TdGF0c1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHJvd3MgLSBPcHRpb24gbnVtYmVyIG9mIHJvd3MuIElmIGRlZmluZWQsIGl0IHdpbGwgYmUgZml4ZWQgYXQgdGhhdC4gT3RoZXJ3aXNlLCBpdFxuICogICAgICAgICAgICAgICAgICAgICAgICB3aWxsIGRlZmF1bHQgdG8gMSB3aGVuIHRoZXJlIGFyZSBubyBvcmdzLCBhbmQgZ3Jvd3MgYXMgbW9yZSByb3dzIGFyZSBuZWVkZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gdGlnaHRlblJvd3MgLSBJZiBnaXZlbiwgd2lsbCBzaHJpbmsgdGhlIHZlcnRpY2FsIGhlaWdodCBvZiB0aGUgcGVuIGJ5IHRoaXMgYW1vdW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgIHBlciByb3csIGNyb3dkaW5nIHRoZSBvcmcgaW1hZ2VzIGFzIG5lZWRlZC5cbiAqL1xuY29uc3QgUGVuVmlldyA9ICh7b3JncywgaWRQcmVmaXg9J29yZ2FuaXNtLScsIHdpZHRoPTQwMCwgY29sdW1ucz01LCByb3dzLCB0aWdodGVuUm93cz0wLCB0aWdodGVuQ29sdW1ucz0wLCBTZWxlY3RlZE9yZ2FuaXNtVmlldz1PcmdhbmlzbVZpZXcsIHNlbGVjdGVkSW5kZXgsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soaWQsIG9yZykge1xuICAgIGNvbnN0IHByZWZpeEluZGV4ID0gaWQuaW5kZXhPZihpZFByZWZpeCksXG4gICAgICAgICAgaW5kZXggPSBOdW1iZXIoaWQuc3Vic3RyKHByZWZpeEluZGV4ICsgaWRQcmVmaXgubGVuZ3RoKSk7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaW5kZXgsIGlkLCBvcmcpO1xuICB9XG5cbiAgbGV0IG9yZ1N0eWxlID0ge1xuICAgIG1hcmdpbjogYCR7LXRpZ2h0ZW5Sb3dzLzJ9cHggJHstdGlnaHRlbkNvbHVtbnMvMn1weGBcbiAgfTtcblxuICBsZXQgb3JnV2lkdGggPSB3aWR0aC9jb2x1bW5zLFxuICAgICAgb3JnVmlld3MgPSBvcmdzLm1hcCgob3JnLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gaW5kZXggPT09IHNlbGVjdGVkSW5kZXhcbiAgICAgICAgICAgICAgICA/IDxTZWxlY3RlZE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkUHJlZml4ICsgaW5kZXh9IGluZGV4PXtpbmRleH0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPVwiI0ZGRkZBQVwiIHNpemU9e29yZ1dpZHRofSBzdHlsZT17b3JnU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfS8+XG4gICAgICAgICAgICAgICAgOiA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD17b3JnV2lkdGh9IHN0eWxlPXtvcmdTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+O1xuICAgICAgfSk7XG5cbiAgcm93cyA9IHJvd3MgfHwgTWF0aC5jZWlsKG9yZ1ZpZXdzLmxlbmd0aCAvIGNvbHVtbnMpIHx8IDE7XG5cbiAgbGV0IGhlaWdodCA9IG9yZ1dpZHRoICogcm93cztcblxuICB3aWR0aCAgPSB3aWR0aCAgLSAodGlnaHRlbkNvbHVtbnMgKiBjb2x1bW5zKTtcbiAgaGVpZ2h0ID0gaGVpZ2h0IC0gKHRpZ2h0ZW5Sb3dzICogcm93cyk7XG5cbiAgbGV0IHN0eWxlID0geyB3aWR0aCwgaGVpZ2h0IH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUGVuVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgcm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgdGlnaHRlbkNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRpZ2h0ZW5Sb3dzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBTZWxlY3RlZE9yZ2FuaXNtVmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQZW5WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbkdsb3dWaWV3ID0gKHtnbG93Q29sb3IsIHNpemU9MjAwfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJ307XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvd1wiIHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBjb2xvcj17Z2xvd0NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17Z2xvd1N0eWxlfS8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvdyBxdWVzdGlvbi1tYXJrXCJcbiAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246IFwiYWJzb2x1dGVcIiwgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX19PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG4gIC8vIEhUTUwgdGV4dCBub2RlXG4gIC8vPGRpdiBzdHlsZT17dFN0eWxlfT57dGV4dH08L2Rpdj5cblxuICAvLyBTVkcgdGV4dCBub2RlXG4gIC8vPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAvLyAgPHRleHQgeD0nNTAnIHk9JzE3NScgZmlsbD0nIzBEMEQ4Qycgc3R5bGU9e3RTdHlsZX0+XG4gIC8vICAgIHt0ZXh0fVxuICAvLyAgPC90ZXh0PlxuICAvLzwvc3ZnPlxufTtcblxuUXVlc3Rpb25HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGdsb3dDb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbkdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21HbG93VmlldyBmcm9tICcuL29yZ2FuaXNtLWdsb3cnO1xuaW1wb3J0IFF1ZXN0aW9uR2xvd1ZpZXcgZnJvbSAnLi9xdWVzdGlvbi1nbG93JztcblxuY29uc3QgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3ID0gKHtoaWRkZW4sIGNvbG9yLCBzaXplLCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3Qgb3JnVmlldyA9IDxPcmdhbmlzbUdsb3dWaWV3IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gey4uLm90aGVyfSAvPixcbiAgICAgICAgcXVlc3Rpb25WaWV3ID0gPFF1ZXN0aW9uR2xvd1ZpZXcgZ2xvd0NvbG9yPXtjb2xvcn0gd2lkdGg9e3NpemV9IC8+LFxuICAgICAgICBmaW5hbFZpZXcgPSBoaWRkZW4gPyBxdWVzdGlvblZpZXcgOiBvcmdWaWV3O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLW9yZ2FuaXNtLWdsb3dcIj5cbiAgICAgIHtmaW5hbFZpZXd9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5RdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBoaWRkZW46IFByb3BUeXBlcy5ib29sLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHZW5ldGljc1V0aWxzIGZyb20gJy4uL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGJyZWVkaW5nIHN0YXRpc3RpY3MgZm9yIGEgc2V0IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXNcbiAqIEBwYXJhbSB7T2JqZWN0W119IG9yZ3MgLSBhcnJheSBvZiBCaW9sb2dpY2Egb3JnYW5pc21zIGZvciB3aGljaCBzdGF0aXN0aWNzIGFyZSB0byBiZSBkaXNwbGF5ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmdzW10ucGhlbm90eXBlIC0gdGhlIHBoZW5vdHlwZSBvZiB0aGUgQmlvbG9naWNhIG9yZ2FuaXNtXG4gKiBAcGFyYW0ge251bWJlcn0gW2xhc3RDbHV0Y2hTaXplPW9yZ3MubGVuZ3RoXSAtIHRoZSBudW1iZXIgb2Ygb3JnYW5pc21zIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IHRoYXQgY29tcHJpc2UgdGhlIG1vc3QgcmVjZW50IGNsdXRjaFxuICovXG5jb25zdCBTdGF0c1ZpZXcgPSAoe29yZ3MsIGxhc3RDbHV0Y2hTaXplfSkgPT4ge1xuXG4gIGxldCB0cmFpdHMgPSBHZW5ldGljc1V0aWxzLmNvbXB1dGVUcmFpdENvdW50c0Zvck9yZ2FuaXNtcyhvcmdzLCBsYXN0Q2x1dGNoU2l6ZSksXG4gICAgICBjbHV0Y2hTaXplID0gbGFzdENsdXRjaFNpemUgfHwgb3Jncy5sZW5ndGgsXG4gICAgICByb3dzID0gW107XG5cbiAgLy8gYnVpbGQgY3VtdWxhdGl2ZSBzdGF0cyBmb3IgdGFibGUgcm93c1xuICBsZXQgdHJhaXROdW0gPSAwO1xuICBmb3IgKGNvbnN0IFt0cmFpdCwgdmFsdWVzXSBvZiB0cmFpdHMpIHtcbiAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgY291bnRzXSBvZiB2YWx1ZXMpIHtcbiAgICAgIGNvbnN0IGNNYWxlcyA9IGNvdW50cy5jbHV0Y2hbQmlvTG9naWNhLk1BTEVdLFxuICAgICAgICAgICAgY0ZlbWFsZXMgPSBjb3VudHMuY2x1dGNoW0Jpb0xvZ2ljYS5GRU1BTEVdLFxuICAgICAgICAgICAgY1RvdGFsID0gY01hbGVzICsgY0ZlbWFsZXMsXG4gICAgICAgICAgICBjUGN0ID0gTWF0aC5yb3VuZCgxMDAgKiBjVG90YWwgLyBjbHV0Y2hTaXplKSxcbiAgICAgICAgICAgIHRNYWxlcyA9IGNvdW50cy50b3RhbFtCaW9Mb2dpY2EuTUFMRV0sXG4gICAgICAgICAgICB0RmVtYWxlcyA9IGNvdW50cy50b3RhbFtCaW9Mb2dpY2EuRkVNQUxFXSxcbiAgICAgICAgICAgIHRUb3RhbCA9IHRNYWxlcyArIHRGZW1hbGVzLFxuICAgICAgICAgICAgdFBjdCA9IE1hdGgucm91bmQoMTAwICogdFRvdGFsIC8gb3Jncy5sZW5ndGgpO1xuICAgICAgcm93cy5wdXNoKHsgdHJhaXQsIHRyYWl0TnVtLCB2YWx1ZSwgY01hbGVzLCBjRmVtYWxlcywgY1RvdGFsLCBjUGN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdE1hbGVzLCB0RmVtYWxlcywgdFRvdGFsLCB0UGN0IH0pO1xuICAgIH1cbiAgICArKyB0cmFpdE51bTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHN0YXRzXCI+XG4gICAgICA8dGFibGUgaWQ9XCJzdGF0cy10YWJsZVwiIGNsYXNzTmFtZT17b3Jncy5sZW5ndGggPiAwID8gXCJoYXMtZGF0YVwiIDogXCJuby1kYXRhXCJ9PlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRoPlRyYWl0IFZhbHVlPC90aD5cbiAgICAgICAgICAgIDx0aCBjb2xTcGFuPVwiMlwiPkNsdXRjaDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICAgIDx0aCBjb2xTcGFuPVwiMlwiPlRvdGFsPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge1xuICAgICAgICAgIHJvd3MubWFwKGZ1bmN0aW9uKHJvdywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDx0ciBrZXk9e2luZGV4fSBjbGFzc05hbWU9e3Jvdy50cmFpdE51bSAmIDEgPyBcIm9kZC10cmFpdFwiIDogXCJldmVuLXRyYWl0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRyYWl0LXZhbHVlPXtyb3cudmFsdWV9PlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJsYWJlbFwiPntyb3cudmFsdWV9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1RvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNNYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50VG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFBjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudEZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudE1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5TdGF0c1ZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBsYXN0Q2x1dGNoU2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3RhdHNWaWV3O1xuIiwiLypcbiAqIFNlZSBodHRwczovL21lZGl1bS5jb20vQGtlbnRjZG9kZHMvbWlzdW5kZXJzdGFuZGluZy1lczYtbW9kdWxlcy11cGdyYWRpbmctYmFiZWwtdGVhcnMtYW5kLWEtc29sdXRpb24tYWQyZDVhYjkzY2UwIy5xMXZja2ZmaXdcbiAqIChLZW50IEMuIERvZGRzLCBcIk1pc3VuZGVyc3RhbmRpbmcgRVM2IE1vZHVsZXMsIFVwZ3JhZGluZyBCYWJlbCwgVGVhcnMsIGFuZCBhIFNvbHV0aW9uXCIpXG4gKiBmb3IgZGVzY3JpcHRpb24gb2Ygc29tZSBvZiB0aGUgZGV0YWlscyBpbnZvbHZlZCBpbiBtaXhpbmcgRVM2IGV4cG9ydCB3aXRoIHJlcXVpcmUoKS5cbiAqL1xuXG4vLyBQb2x5ZmlsbCwgbW9kaWZ5aW5nIHRoZSBnbG9iYWwgT2JqZWN0XG5yZXF1aXJlKCdlczYtb2JqZWN0LWFzc2lnbicpLnBvbHlmaWxsKCk7XG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWxsZWxlRmlsdGVyc1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FsbGVsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbmltYXRlZE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJhc2tldFNldFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYmFza2V0LXNldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFuZ2VTZXhCdXR0b25zIH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVJbWFnZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaXJjdWxhckdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFZ2dDbHV0Y2hWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2VnZy1jbHV0Y2gnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZWVkYmFja1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVlZGJhY2snO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2FtZXRlUG9vbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmVMYWJlbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbm9tZVRlc3RWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZS10ZXN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5vbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHbG93QmFja2dyb3VuZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTW9kYWxBbGVydCB9IGZyb20gJy4vY29tcG9uZW50cy9tb2RhbC1hbGVydCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZGluYWxPcmdhbmlzbVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JkaW5hbC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBlblZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3Blbi1zdGF0cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hhbGxlbmdlQXdhcmRWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYWxsZW5nZS1hd2FyZCc7XG5cbi8vIHV0aWxpdGllc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5ldGljc1V0aWxzIH0gZnJvbSAnLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuIiwiLyoqXG4gKiBDbGFzcyBwcm92aWRpbmcgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIEJpb0xvZ2ljYSBnZW5ldGljcyBvcGVyYXRpb25zLlxuICogSW4gc29tZSBjYXNlcyB0aGVzZSBhcmUgYWRhcHRlZCBmcm9tIGNvcnJlc3BvbmRpbmcgY29kZSBpbiBHZW5pdmVyc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmV0aWNzVXRpbHMge1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbGxlbGUgc3RyaW5ncyBpbiB0aGUgbmV3IGRhc2ggZm9ybSAoZS5nLiBcIlctdywgVC0sIC1hXCIpIHRvIHRoZSBvcmlnaW5hbFxuICAgKiBCaW9Mb2dpY2EgYTpiOiBmb3JtIChlLmcuIFwiYTpXLGI6dyxhOlQsYjphXCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgZGFzaEFsbGVsZVN0cmluZyAtIHRoZSBhbGxlbGUgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAgdGhlIGNvbnZlcnRlZCBhbGxlbGUgc3RyaW5nXG4gICAqL1xuICBzdGF0aWMgY29udmVydERhc2hBbGxlbGVzVG9BQkFsbGVsZXMoZGFzaEFsbGVsZVN0cmluZykge1xuICAgIGlmICghZGFzaEFsbGVsZVN0cmluZyB8fCAoZGFzaEFsbGVsZVN0cmluZy5pbmRleE9mKCc6JykgPj0gMCkgfHwgKGRhc2hBbGxlbGVTdHJpbmcuaW5kZXhPZignLScpIDwgMCkpXG4gICAgICByZXR1cm4gZGFzaEFsbGVsZVN0cmluZztcbiAgICBjb25zdCBkYXNoQWxsZWxlcyA9IGRhc2hBbGxlbGVTdHJpbmcuc3BsaXQoJywnKTtcbiAgICByZXR1cm4gZGFzaEFsbGVsZXMucmVkdWNlKChwcmV2LCBwYWlyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxlbGVzID0gcGFpci50cmltKCkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxlbGVzWzBdKSBwcmV2ICs9IGAke3ByZXYgPyAnLCcgOiAnJ31hOiR7YWxsZWxlc1swXS50cmltKCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxlbGVzWzFdKSBwcmV2ICs9IGAke3ByZXYgPyAnLCcgOiAnJ31iOiR7YWxsZWxlc1sxXS50cmltKCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFsbGVsZSBzdHJpbmdzIGluIHRoZSBuZXcgZGFzaCBmb3JtIChlLmcuIFwiVy13LCBULSwgLWFcIikgdG8gdGhlIG9yaWdpbmFsXG4gICAqIEJpb0xvZ2ljYSBhOmI6IGZvcm0gKGUuZy4gXCJhOlcsYjp3LGE6VCxiOmFcIikgd2l0aGluIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICpcbiAgICogUmVjdXJzZXMgdGhyb3VnaCBuZXN0ZWQgb2JqZWN0cy9hcnJheXMgY29udmVydGluZyBkYXNoIGFsbGVsZSBzdHJpbmdzIGluIHByb3BlcnRpZXNcbiAgICogd2hvc2UgbmFtZXMgYXJlIHdoaXRlLWxpc3RlZCBpbiB0aGUgcHJvcE5hbWVzIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gIG9iamVjdCAtIHRoZSBvYmplY3QgdG8gYmUgY29udmVydGVkXG4gICAqIEByZXR1cm5zIHtvYmplY3R9ICB0aGUgc2FtZSBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGZpZWxkcyBtb2RpZmllZFxuICAgKi9cbiAgc3RhdGljIGNvbnZlcnREYXNoQWxsZWxlc09iamVjdFRvQUJBbGxlbGVzKG9iamVjdCwgcHJvcE5hbWVzKSB7XG4gICAgaWYgKCFvYmplY3QgfHwgIXByb3BOYW1lcyB8fCAocHJvcE5hbWVzLmxlbmd0aCA9PSBudWxsKSkgcmV0dXJuIG9iamVjdDtcblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG4gICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHJldHVybiAoIWtleSB8fCAocHJvcE5hbWVzLmluZGV4T2Yoa2V5KSA+PSAwKSlcbiAgICAgICAgICAgICAgICAgICAgPyBHZW5ldGljc1V0aWxzLmNvbnZlcnREYXNoQWxsZWxlc1RvQUJBbGxlbGVzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gbm90ZSB0aGF0IHRoZSBrZXkgZm9yIHN0cmluZ3MgaW4gYXJyYXlzIGlzIHRoZSBrZXkgZm9yIHRoZSBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLm1hcCgoaXRlbSkgPT4gY29udmVydFZhbHVlKGtleSwgaXRlbSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IG9iaktleSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICB2YWx1ZVtvYmpLZXldID0gY29udmVydFZhbHVlKG9iaktleSwgdmFsdWVbb2JqS2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRWYWx1ZShudWxsLCBvYmplY3QpO1xuICB9XG5cbiAgc3RhdGljIGVuc3VyZVZhbGlkT3JnYW5pc20ob3JnT3JEZWYsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAob3JnT3JEZWYuZ2V0QWxsZWxlU3RyaW5nKSB7XG4gICAgICByZXR1cm4gb3JnT3JEZWY7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKHNwZWNpZXMsIG9yZ09yRGVmLmFsbGVsZVN0cmluZywgb3JnT3JEZWYuc2V4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBhbGxlbGVzIGFyZSBwcmVzZW50IGluIHRoZSBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gIGFsbGVsZVN0cmluZyAtIG9yZ2FuaXNtIGFsbGVsZSBzdHJpbmdcbiAgICogQHBhcmFtIChzdHJpbmcpICBhbGxlbGVzIC0gYWxsZWxlcyB0byBtYXRjaCBhZ2FpbnN0IHRoZSBvcmdhbmlzbSBhbGxlbGVzXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBhbGxlbGVzIGFyZSBwcmVzZW50IGluIHRoZSBhbGxlbGVTdHJpbmcsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGFsbGVsZVN0cmluZ0NvbnRhaW5zQWxsZWxlcyhhbGxlbGVTdHJpbmcsIGFsbGVsZXMpIHtcbiAgICAvLyBlbXB0eSBzdHJpbmdzIGRvbid0IG1hdGNoXG4gICAgaWYgKCFhbGxlbGVTdHJpbmcgfHwgIWFsbGVsZXMpIHJldHVybiBmYWxzZTtcbiAgICAvLyBtdXN0IG1hdGNoIGV2ZXJ5IG9uZSBvZiB0aGUgYWxsZWxlcyAuLi5cbiAgICByZXR1cm4gYWxsZWxlcy5zcGxpdCgnLCcpLmV2ZXJ5KChhbGxlbGUpID0+IHtcbiAgICAgIC8vIC4uLiB0byB0aGUgYWxsZWxlcyBvZiB0aGUgYWxsZWxlU3RyaW5nXG4gICAgICByZXR1cm4gYWxsZWxlU3RyaW5nLnNlYXJjaChgJHthbGxlbGV9KCx8JClgKSA+PSAwO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGFsbGVsZSBzdHJpbmcgY29udGFpbnMgb25seSB2YWxpZCBhbGxlbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgKGluIGE6YjogZm9ybSkgdG8gYmUgdmFsaWRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgW3NwZWNpZXNdIC0gdGhlIHNwZWNpZXMgd2hvc2UgZ2Vub21lIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGNvbXBsZXRlbmVzc1xuICAgKiBAcmV0dXJucyAgICAgICAgIHRydWUgaWYgdGhlIGFsbGVsZSBzdHJpbmcgaXMgdmFsaWQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzVmFsaWRBbGxlbGVTdHJpbmcoYWxsZWxlU3RyaW5nLCBzcGVjaWVzPUJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlKSB7XG4gICAgaWYgKCFzcGVjaWVzIHx8ICFhbGxlbGVTdHJpbmcpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBhbGxlbGVUb0dlbmVNYXAgPSBPYmplY3Qua2V5cyhzcGVjaWVzLmdlbmVMaXN0KS5yZWR1Y2UoKHByZXYsIGdlbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNpZXMuZ2VuZUxpc3RbZ2VuZV0uYWxsZWxlcy5mb3JFYWNoKChhbGxlbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlthbGxlbGVdID0gZ2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge30pO1xuICAgIHJldHVybiBhbGxlbGVTdHJpbmcuc3BsaXQoJywnKS5ldmVyeSgoYWxsZWxlU2lkZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTaWRlLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgICByZXR1cm4gKChzaWRlLnRyaW0oKSA9PT0gJ2EnKSB8fCAoc2lkZS50cmltKCkgPT09ICdiJykpICYmXG4gICAgICAgICAgICAgICAgICAgIChhbGxlbGVUb0dlbmVNYXBbYWxsZWxlLnRyaW0oKV0gIT0gbnVsbCk7XG4gICAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgYWxsZWxlIHN0cmluZyBjb21wbGV0ZWx5IHNwZWNpZmllcyBhbGwgYWxsZWxlc1xuICAgKlxuICAgKiBUbyBiZSBjb21wbGV0ZSwgZXZlcnkgZ2VuZSBtdXN0IGJlIHNwZWNpZmllZCB3aXRoIGEgdmFsaWQgYWxsZWxlIGZvciBlYWNoXG4gICAqIHNpZGUgKGV4Y2VwdCBzZXgtbGlua2VkIGdlbmVzLCB3aGljaCBuZWVkIG9ubHkgYmUgb24gb25lIHNpZGUpLCBhbmQgbm9cbiAgICogaW52YWxpZCBhbGxlbGVzIG9yIGdlbmVzIGNhbiBiZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgKGluIGE6YjogZm9ybSkgdG8gYmUgdmFsaWRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgW3NwZWNpZXNdIC0gdGhlIHNwZWNpZXMgd2hvc2UgZ2Vub21lIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGNvbXBsZXRlbmVzc1xuICAgKiBAcmV0dXJucyAgICAgICAgIHRydWUgaWYgdGhlIGFsbGVsZSBzdHJpbmcgaXMgY29tcGxldGUsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzQ29tcGxldGVBbGxlbGVTdHJpbmcoYWxsZWxlU3RyaW5nLCBzcGVjaWVzPUJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlKSB7XG4gICAgaWYgKCFzcGVjaWVzIHx8ICFhbGxlbGVTdHJpbmcpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBrVW5rbm93bkdlbmUgPSBcIl9fVU5LTk9XTl9fXCIsXG4gICAgICAgICAgYWxsZWxlVG9HZW5lTWFwID0gT2JqZWN0LmtleXMoc3BlY2llcy5nZW5lTGlzdCkucmVkdWNlKChwcmV2LCBnZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMuZm9yRWFjaCgoYWxsZWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZbYWxsZWxlXSA9IGdlbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KSxcbiAgICAgICAgICBzcGVjaWVzR2VuZUNvdW50ID0gT2JqZWN0LmtleXMoc3BlY2llcy5nZW5lTGlzdCkubGVuZ3RoLFxuICAgICAgICAgIGdlbmVTaWRlTWFwID0gYWxsZWxlU3RyaW5nLnNwbGl0KCcsJykucmVkdWNlKChwcmV2LCBhbGxlbGVTaWRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzaWRlLCBhbGxlbGVdID0gYWxsZWxlU2lkZS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZ2VuZSA9IGFsbGVsZVRvR2VuZU1hcFthbGxlbGUudHJpbSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lKSBnZW5lID0ga1Vua25vd25HZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZ2VuZUVudHJ5ID0gcHJldltnZW5lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lRW50cnkpIGdlbmVFbnRyeSA9IHByZXZbZ2VuZV0gPSB7IGE6IDAsIGI6IDAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKysgZ2VuZUVudHJ5W3NpZGUudHJpbSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSksXG4gICAgICAgICAgYWxsZWxlU3RyaW5nR2VuZUNvdW50ID0gT2JqZWN0LmtleXMoZ2VuZVNpZGVNYXApLmxlbmd0aCxcbiAgICAgICAgICBpc0V2ZXJ5R2VuZUNvbXBsZXRlID0gT2JqZWN0LmtleXMoZ2VuZVNpZGVNYXApLmV2ZXJ5KChnZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZUVudHJ5ID0gZ2VuZVNpZGVNYXBbZ2VuZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNYWUdlbmUgPSBzcGVjaWVzLmNocm9tb3NvbWVHZW5lTWFwLlhZLnNvbWUoKGFsbGVsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lID09PSBhbGxlbGVUb0dlbmVNYXBbYWxsZWxlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVFbnRyeSAmJiAoKGdlbmVFbnRyeS5hID09PSAxKSAmJiAoZ2VuZUVudHJ5LmIgPT09IDEpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlzWFlHZW5lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZW5lRW50cnkuYSArIGdlbmVFbnRyeS5iID49IDEpICYmIChnZW5lRW50cnkuYSArIGdlbmVFbnRyeS5iIDw9IDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gbXVzdCBoYXZlIHRoZSBjb3JyZWN0IG51bWJlciBvZiBnZW5lcywgYWxsIGdlbmVzIG11c3QgYmUgY29tcGxldGUsIGFuZCBubyB1bmtub3duIGdlbmVzXG4gICAgcmV0dXJuIChzcGVjaWVzR2VuZUNvdW50ID09PSBhbGxlbGVTdHJpbmdHZW5lQ291bnQpICYmIGlzRXZlcnlHZW5lQ29tcGxldGUgJiZcbiAgICAgICAgICAgIChnZW5lU2lkZU1hcFtrVW5rbm93bkdlbmVdID09IG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgb3V0IGhpZGRlbiBhbGxlbGVzLCBnaXZlbiBhIGxpc3Qgb2YgY2hhbmdlYWJsZSBhbmQgdmlzaWJsZSBnZW5lcy5cbiAgICogUmV0dXJucyBhcnJheSBvZiBvYmplY3RzIHdpdGggdGhlIGFsbGVsZSBhbmQgdGhlIGVkaXRhYmlsaXR5XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFsbGVsZXMgLSB0aGUgc2V0IG9mIGFsbGVsZXMgdG8gYmUgZmlsdGVyZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdXNlckNoYW5nZWFibGVHZW5lcyAtIGdlbmVzIHRoYXQgdGhlIHVzZXIgY2FuIGVkaXQgKGlmIHRoZSB0ZW1wbGF0ZSBhbGxvd3MpXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHZpc2libGVHZW5lcyAtIGdlbmVzIHRoYXQgdGhlIHVzZXIgY2FuIHZpZXcgKGFscmVhZHkgaW5jbHVkZXMgdGhlIGFib3ZlIGxpc3QpXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLnNwZWNpZXN9IHNwZWNpZXMgLSB0aGUgc3BlY2llcyB0aGF0IGRlZmluZXMgdGhlIGdlbm90eXBlXG4gICAqIEByZXR1cm4ge29ialtdfSAtIHRoZSBmaWx0ZXJlZCBhbGxlbGVzLCB3aGVyZSBlYWNoIGlzIGFuIG9iamVjdCB3aXRoIGEgbmFtZSBhbmQgd2hldGhlciBpdCBpcyBlZGl0YWJsZVxuICAgKi9cbiAgc3RhdGljIGZpbHRlclZpc2libGVBbGxlbGVzKGFsbGVsZXMsIHVzZXJDaGFuZ2VhYmxlR2VuZXMsIHZpc2libGVHZW5lcywgc3BlY2llcykge1xuICAgIGxldCBzaG93QWxsID0gdXNlckNoYW5nZWFibGVHZW5lcy5sZW5ndGggKyB2aXNpYmxlR2VuZXMubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBhbGxlbGVzLmZpbHRlcihhID0+IHtcbiAgICAgIGlmIChzaG93QWxsKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSksXG4gICAgICAgICAgICBnZW5lTmFtZSA9IGdlbmUgPyBnZW5lLm5hbWUgOiBudWxsO1xuICAgICAgcmV0dXJuIHVzZXJDaGFuZ2VhYmxlR2VuZXMuaW5kZXhPZihnZW5lTmFtZSkgPiAtMSB8fCB2aXNpYmxlR2VuZXMuaW5kZXhPZihnZW5lTmFtZSkgPiAtMTtcbiAgICB9KS5tYXAoYSA9PiAoe1xuICAgICAgYWxsZWxlOiBhLFxuICAgICAgZWRpdGFibGU6IHVzZXJDaGFuZ2VhYmxlR2VuZXMuaW5kZXhPZihCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpLm5hbWUpID4gLTFcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZSBhIG1hcCBvZiB0cmFpdHMgLT4gdHJhaXRWYWx1ZXMgLT4gdHJhaXRDb3VudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtW119IG9yZ2FuaXNtcyAtIHRoZSBzZXQgb2Ygb3JnYW5pc21zIHRvIGNvbXB1dGUgc3RhdHMgZm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjbHV0Y2hTaXplIC0gdGhlIGxhc3QgJ2NsdXRjaFNpemUnIG9yZ2FuaXNtcyBhcmUgYXNzdW1lZCB0byBiZSB0aGUgbGFzdCBjbHV0Y2hcbiAgICogQHJldHVybiB7TWFwfSAtIGUuZy4geyBcInRhaWxcIjogeyBcImxvbmcgdGFpbFwiOiB7IFwiY2x1dGNoXCI6IFs5LCAxMV0sIFwidG90YWxcIjogWzUzLCA0N10gfX19XG4gICAqL1xuICBzdGF0aWMgY29tcHV0ZVRyYWl0Q291bnRzRm9yT3JnYW5pc21zKG9yZ2FuaXNtcywgbGFzdENsdXRjaFNpemUpIHtcbiAgICBsZXQgdHJhaXRzID0gbmV3IE1hcCxcbiAgICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ2FuaXNtcy5sZW5ndGg7XG5cbiAgICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gICAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3JnYW5pc21zLmVudHJpZXMoKSkge1xuICAgICAgZm9yIChjb25zdCB0cmFpdCBvZiBPYmplY3Qua2V5cyhvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcykpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgICAgdmFsdWVDb3VudHMgPSB0cmFpdFZhbHVlcy5nZXQodmFsdWUpIHx8IHsgY2x1dGNoOiBbMCwgMF0sIHRvdGFsOiBbMCwgMF0gfTtcbiAgICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgICBpZiAoIXRyYWl0VmFsdWVzLmhhcyh2YWx1ZSkpIHRyYWl0VmFsdWVzLnNldCh2YWx1ZSwgdmFsdWVDb3VudHMpO1xuICAgICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICAgIGlmIChpbmRleCA+PSBvcmdhbmlzbXMubGVuZ3RoIC0gY2x1dGNoU2l6ZSlcbiAgICAgICAgICArKyB2YWx1ZUNvdW50cy5jbHV0Y2hbb3JnLnNleF07XG4gICAgICAgICsrIHZhbHVlQ291bnRzLnRvdGFsW29yZy5zZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhaXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGFsbGVsZSBzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IG1hcHMgZ2VuZXMgdG8gYWxsZWxlcy5cbiAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBjb21wYXJpc29uIHB1cnBvc2VzLCBmb3IgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHJldHVybiB7b2JqZWN0fSAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3Juczoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqL1xuICBzdGF0aWMgYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKSB7XG4gICAgbGV0IGdlbmVNYXAgPSB7fSxcbiAgICAgICAgYWxsZWxlU3Vic3RyaW5ncyA9IGFsbGVsZVN0cmluZy5zcGxpdChcIixcIik7XG4gICAgZm9yIChjb25zdCBhbGxlbGVTdWJzdHIgb2YgYWxsZWxlU3Vic3RyaW5ncykge1xuICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTdWJzdHIuc3BsaXQoXCI6XCIpLFxuICAgICAgICAgICAgZ2VuZSA9IGdlbmV0aWNzLmdlbmVGb3JBbGxlbGUoYWxsZWxlKTtcbiAgICAgIGlmIChzaWRlICYmIGFsbGVsZSAmJiBnZW5lKSB7XG4gICAgICAgIGlmICghZ2VuZU1hcFtnZW5lXSkgZ2VuZU1hcFtnZW5lXSA9IHt9O1xuICAgICAgICBnZW5lTWFwW2dlbmVdW3NpZGVdID0gYWxsZWxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2VuZU1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBhbGxlbGUgc3RyaW5nIGFuZCBhIGdlbmUgbWFwIGRlZmluaW5nIGEgc2V0IG9mIGJhc2UgKGRlZmF1bHQpIGFsbGVsZXMsXG4gICAqIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyB3aXRoIG1pc3NpbmcgYWxsZWxlcyByZXBsYWNlZCBieSB0aGVpciBkZWZhdWx0cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge29iamVjdH0gYmFzZUdlbmVNYXAgLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybjoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCkge1xuICAgIGNvbnN0IGRzdEdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZyk7XG4gICAgbGV0ICAgZHN0QWxsZWxlU3RyaW5nID0gYWxsZWxlU3RyaW5nO1xuICAgIGZvciAoY29uc3QgZ2VuZSBpbiBkc3RHZW5lTWFwKSB7XG4gICAgICBjb25zdCBnZW5lVmFsdWUgPSBkc3RHZW5lTWFwW2dlbmVdO1xuICAgICAgLy8gcmVwbGFjZSBhIG1pc3NpbmcgJ2EnIHNpZGUgYWxsZWxlIHdpdGggdGhlIGRlZmF1bHQgaWYgYXBwcm9wcmlhdGVcbiAgICAgIGlmICghZ2VuZVZhbHVlLmEgJiYgYmFzZUdlbmVNYXBbZ2VuZV0gJiYgYmFzZUdlbmVNYXBbZ2VuZV0uYSkge1xuICAgICAgICBkc3RBbGxlbGVTdHJpbmcgPSBkc3RBbGxlbGVTdHJpbmcucmVwbGFjZShgYjoke2dlbmVWYWx1ZS5ifWAsIGBhOiR7YmFzZUdlbmVNYXBbZ2VuZV0uYX0sJCZgKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlcGxhY2UgYSBtaXNzaW5nICdiJyBzaWRlIGFsbGVsZSB3aXRoIHRoZSBkZWZhdWx0IGlmIGFwcHJvcHJpYXRlXG4gICAgICBpZiAoIWdlbmVWYWx1ZS5iICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmIpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGE6JHtnZW5lVmFsdWUuYX1gLCBgJCYsYjoke2Jhc2VHZW5lTWFwW2dlbmVdLmJ9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkc3RBbGxlbGVTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdHdvIGFsbGVsZSBzdHJpbmdzLCByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgaW4gd2hpY2ggbWlzc2luZyBhbGxlbGVzXG4gICAqIGluIHRoZSBmaXJzdCBhcmUgcmVwbGFjZWQgYnkgZGVmYXVsdHMgcHJvdmlkZWQgYnkgdGhlIHNlY29uZCBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlQWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gdXNlIGFzIGRlZmF1bHRzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VBbGxlbGVTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlR2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYmFzZUFsbGVsZVN0cmluZyk7XG4gICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCk7XG4gIH1cblxuICBzdGF0aWMgbnVtYmVyT2ZCcmVlZGluZ01vdmVzVG9SZWFjaERyYWtlKG9yZ2FuaXNtMSwgb3JnYW5pc20yLCBjaGFuZ2VhYmxlQWxsZWxlczEsIGNoYW5nZWFibGVBbGxlbGVzMiwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB2YXIgbW92ZXMgPSAwLFxuICAgICAgICBvcmcxQWxsZWxlcyA9IG9yZ2FuaXNtMS5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIG9yZzJBbGxlbGVzID0gb3JnYW5pc20yLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KCcsJykubWFwKGEgPT4gYS5zcGxpdCgnOicpWzFdKSxcbiAgICAgICAgdGFyZ2V0Y2hhcnMgPSB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICB0cmFpdFJ1bGVzID0gb3JnYW5pc20xLnNwZWNpZXMudHJhaXRSdWxlcztcblxuICAgIGZvciAodmFyIHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICAgIGlmICh0cmFpdFJ1bGVzLmhhc093blByb3BlcnR5KHRyYWl0KSkge1xuICAgICAgICB2YXIgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRjaGFyc1t0cmFpdF1dLFxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gSW5maW5pdHk7XG4gICAgICAgIGlmIChwb3NzaWJsZVNvbHV0aW9ucyAmJiBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGk8aWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0sXG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgPSAwLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24yID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHNvbHV0aW9uLmxlbmd0aDsgajxqajsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBhbGxlbGUxID0gc29sdXRpb25bal0sXG4gICAgICAgICAgICAgICAgICBhbGxlbGUyID0gaiUyID09PSAwID8gc29sdXRpb25baisxXSA6IHNvbHV0aW9uW2otMV0sXG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gMDtcbiAgICAgICAgICAgICAgaWYgKG9yZzFBbGxlbGVzLmluZGV4T2YoYWxsZWxlMSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTEgJiYgKGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMxLmluZGV4T2YoYWxsZWxlMS50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG9yZzJBbGxlbGVzLmluZGV4T2YoYWxsZWxlMikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTIgJiYgKGNoYW5nZWFibGVBbGxlbGVzMi5pbmRleE9mKGFsbGVsZTIpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoaiUyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiArPSBzb2x1dGlvbk1vdmVzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGggPSBNYXRoLm1pbihzaG9ydGVzdFBhdGgsIE1hdGgubWluKG1vdmVzRm9yU29sdXRpb24xLCBtb3Zlc0ZvclNvbHV0aW9uMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGNoYW5nZXMsIGluY2x1ZGluZyBhbGxlbGUgY2hhbmdlcyBhbmQgc2V4IGNoYW5nZXMsXG4gICAqIHJlcXVpcmVkIHRvIG1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhlICd0ZXN0T3JnYW5pc20nIHRvIHRoYXQgb2YgdGhlICd0YXJnZXRPcmdhbmlzbScuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0ZXN0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gd2hpY2ggY2hhbmdlcyB3b3VsZCBhcHBseVxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGFyZ2V0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdGhhdCBzZXJ2ZXMgYXMgZGVzdGluYXRpb25cbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RPcmdhbmlzbSwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB0ZXN0T3JnYW5pc20gPSB0aGlzLmVuc3VyZVZhbGlkT3JnYW5pc20odGVzdE9yZ2FuaXNtKTtcbiAgICB0YXJnZXRPcmdhbmlzbSA9IHRoaXMuZW5zdXJlVmFsaWRPcmdhbmlzbSh0YXJnZXRPcmdhbmlzbSk7XG5cbiAgICBsZXQgcmVxdWlyZWRDaGFuZ2VDb3VudCA9IEdlbmV0aWNzVXRpbHMubnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5nZW5ldGljcy5nZW5vdHlwZS5hbGxBbGxlbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5zcGVjaWVzLnRyYWl0UnVsZXMpO1xuICAgIGlmICh0ZXN0T3JnYW5pc20uc2V4ICE9PSB0YXJnZXRPcmdhbmlzbS5zZXgpXG4gICAgICArK3JlcXVpcmVkQ2hhbmdlQ291bnQ7XG5cbiAgICByZXR1cm4gcmVxdWlyZWRDaGFuZ2VDb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgdG8gbWFrZSB0aGUgcGhlbm90eXBlIG9mXG4gICAqIHRoZSBvcmdhbmlzbSBjaGFyYWN0ZXJpemVkIGJ5ICd0ZXN0Q2hhcmFjdGVyc3RpY3MnIG1hdGNoIHRoYXQgb2YgdGhlIG9yZ2FuaXNtXG4gICAqIGNoYXJhY3Rlcml6ZWQgYnkgJ3RhcmdldENoYXJhY3RlcmlzdGljcycuIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0ZXN0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGFyZ2V0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRlc3RBbGxlbGVzIC0gdGhlIGFycmF5IG9mIGFsbGVsZXMgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgb2YgdGhlIG9yZ2FuaXNtc1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIG51bWJlciBvZiBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RDaGFyYWN0ZXJpc3RpY3MsIHRhcmdldENoYXJhY3RlcmlzdGljcywgdGVzdEFsbGVsZXMsIHRyYWl0UnVsZXMpIHtcbiAgICBjb25zdCBhbGxlbGVzID0gdGVzdEFsbGVsZXM7XG4gICAgbGV0ICAgbW92ZXMgPSAwO1xuXG4gICAgZm9yIChjb25zdCB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgaWYgKHRlc3RDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdICE9PSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdKSB7XG4gICAgICAgICAgLy8gZmlyc3Qgd2UgaGF2ZSB0byB3b3JrIG91dCB3aGF0IGFsbGVsZXMgdGhlIG9yaWdpbmFsIGRyYWtlIGhhcyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICAgICAgICAvLyB0aGVpciBub24tbWF0Y2hpbmcgdHJhaXRcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVRyYWl0QWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcyk7XG4gICAgICAgICAgbGV0ICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVUcmFpdEFsbGVsZXMuaW5kZXhPZihhbGxlbGVzW2ldKSA+PSAwKXtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzLnB1c2goYWxsZWxlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyB3b3JrIG91dCB0aGUgc21hbGxlc3QgbnVtYmVyIG9mIHN0ZXBzIHRvIGdldCBmcm9tIHRoZXJlIHRvIHRoZSBkZXNpcmVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAgICAgY29uc3QgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdXTtcbiAgICAgICAgICBsZXQgICBzaG9ydGVzdFBhdGhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gY2hhcmFjdGVyaXN0aWNBbGxlbGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspe1xuICAgICAgICAgICAgICBpZiAoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uLnNwbGljZShzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSksIDEpOyAvLyBhbHJlYWR5IG1hdGNoZWQgdGhpcyBvbmUsIGNhbid0IG1hdGNoIGl0IGFnYWluXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IChwYXRoTGVuZ3RoIDwgc2hvcnRlc3RQYXRoTGVuZ3RoKSA/IHBhdGhMZW5ndGggOiBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSBhbGxlbGVzIHByZXNlbnQgaW4gdGhlIGZ1bGx5IHNwZWNpZmllZCBvcmdhbmlzbSwgYnV0IG5vdCBpblxuICAgKiB0aGUgcGFydGlhbGx5IHNwZWNpZmllZCBvcmdhbmlzbS4gRm9yIGV4YW1wbGUsIGlmIGEgZmVtYWxlIGFuZCBtYWxlIG9yZ2FuaXNtIGFyZSBnaXZlbiwgdGhlIHJldHVybmVkIHN0cmluZ1xuICAgKiB3aWxsIHJlcHJlc2VudCB0aGUgc2V4LWxpbmtlZCBjaHJvbW9zb21lcyB0aGF0IHRoZSBtYWxlIG9yZ2FuaXNtIGxhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZnVsbHlTcGVjaWZpZWRPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSBjb250YWluaW5nIHRoZSBleHRyYSBhbGxlbGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsbHlTcGVjaWZpZWRPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSBsYWNraW5nIHRoZSBleHRyYSBhbGxlbGVzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBleHRyYSBhbGxlbGVzLCBlLmcuIFwiYjpELGI6Qm9nLGI6cmhcIlxuICAgKi9cbiAgc3RhdGljIGNvbXB1dGVFeHRyYUFsbGVsZXMoZnVsbHlTcGVjaWZpZWRPcmdhbmlzbSwgcGFydGlhbGx5U3BlY2lmaWVkT3JnYW5pc20pIHtcbiAgICBsZXQgZnVsbEFsbGVsZXMgPSBmdWxseVNwZWNpZmllZE9yZ2FuaXNtLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KFwiLFwiKTtcbiAgICBsZXQgcGFydGlhbEFsbGVsZXMgPSBwYXJ0aWFsbHlTcGVjaWZpZWRPcmdhbmlzbS5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdChcIixcIik7XG4gICAgbGV0IGV4dHJhQWxsZWxlcyA9IGZ1bGxBbGxlbGVzLmZpbHRlcihmdW5jdGlvbihhbGxlbGUpIHsgcmV0dXJuIHBhcnRpYWxBbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA9PT0gLTE7IH0pO1xuICAgIHJldHVybiBleHRyYUFsbGVsZXMuam9pbihcIixcIik7XG4gIH1cblxuICAvKipcbiAgICogR29lcyB0aHJvdWdoIHRoZSB0cmFpdFJ1bGVzIHRvIGZpbmQgb3V0IHdoYXQgdW5pcXVlIGFsbGVsZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHRyYWl0XG4gICAqIGUuZy4gRm9yIFwidGFpbFwiIGl0IHdpbGwgcmV0dXJuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl0uIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFpdCAtIG5hbWUgb2YgdHJhaXQsIGUuZy4gXCJ0YWlsXCJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgd2hvc2UgdHJhaXRzIGFyZSBvZiBpbnRlcmVzdFxuICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSBhcnJheSBvZiBhbGxlbGUgc3RyaW5ncywgZS5nLiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdXG4gICAqL1xuICBzdGF0aWMgX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0ID0ge307XG4gIHN0YXRpYyBjb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKSB7XG4gICAgaWYgKEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSkge1xuICAgICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XTtcbiAgICB9XG5cbiAgICBsZXQgYWxsZWxlc0hhc2ggPSB7fSxcbiAgICAgICAgYWxsZWxlcyAgICAgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNoYXJhY3RlcmlzdGljIGluIHRyYWl0UnVsZXNbdHJhaXRdKXtcbiAgICAgICAgZm9yIChjb25zdCBwb3NzaWJpbGVBbGxlbGVzQ29tYm8gaW4gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdKSB7XG4gICAgICAgICAgaWYgKHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXS5oYXNPd25Qcm9wZXJ0eShwb3NzaWJpbGVBbGxlbGVzQ29tYm8pKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgYWxsZWxlc0hhc2hbdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib11baV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGFsbGVsZSBpbiBhbGxlbGVzSGFzaCl7XG4gICAgICBhbGxlbGVzLnB1c2goYWxsZWxlKTtcbiAgICB9XG5cbiAgICBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0gPSBhbGxlbGVzOyAgLy8gc3RvcmUgc28gd2UgZG9uJ3QgbmVlZCB0byByZWNhbGN1bGF0ZSBpdFxuICAgIHJldHVybiBhbGxlbGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgRHJha2Ugb2JqZWN0IGludG8gYSBCaW9sb2dpY2Egb3JnYW5pc20uXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkcmFrZSAtIHRoZSBkcmFrZSB0byBjb252ZXJ0XG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0aGUgZHJha2UgYXMgYW4gT3JnYW5pc21cbiAgICovXG4gIHN0YXRpYyBjb252ZXJ0RHJha2VUb09yZyhkcmFrZSkge1xuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBkcmFrZS5hbGxlbGVTdHJpbmcsIGRyYWtlLnNleCk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gQ2hhbGxlbmdlIGluc3RydWN0aW9uc1xuICBcIn5GVl9FR0dfR0FNRS5CUkVFRF9CVVRUT05cIjogXCJCUkVFRFwiLFxuXG4gIC8vIENoYWxsZW5nZSBpbnN0cnVjdGlvbnNcbiAgXCJ+RUdHX0dBTUVfMy5DSFJPTU9TT01FU19USVRMRVwiOiBcIkNocm9tb3NvbWVzXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJVQ1RJT05TX1RJVExFXCI6IFwiSW5zdHJ1Y3Rpb25zXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSEVBRElOR1wiOiBcIlNvcnQgdGhlc2UgZWdncyFcIixcbiAgXCJ+RUdHX0dBTUVfMy5JTlNUUl9JVEVNMVwiOiBcIlNjb3BlIGFuIGVnZyB0byBzZWUgYSBiYWJ5J3MgY2hyb21vc29tZXMuXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSVRFTTJcIjogXCJDbGljayB0aGUgY29ycmVjdCBiYXNrZXQgZm9yIHRoZSBlZ2cuXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIHBvcHVwIGFsZXJ0c1xuICBcIn5BTEVSVC5USVRMRS5HT09EX1dPUktcIjogXCJHb29kIHdvcmshXCIsXG4gIFwifkFMRVJULlRJVExFLklOQ09SUkVDVF9EUkFLRVwiOiBcIlRoYXQncyBub3QgdGhlIGRyYWtlIVwiLFxuICBcIn5BTEVSVC5USVRMRS5FR0dfTUlTTUFUQ0hcIjogXCJUaGF0IGVnZyBkb2Vzbid0IGJlbG9uZyFcIixcbiAgXCJ+QUxFUlQuVElUTEUuTUlTVEFLRVwiOiBcIlVoIG9oIVwiLFxuICBcIn5BTEVSVC5ORVdfUElFQ0VfT0ZfQ09JTlwiOiBcIllvdSBlYXJuZWQgYSAkezB9IHBpZWNlIG9mIHRoZSBjb2luIVwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9HT0xEXCI6IFwiZ29sZFwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9TSUxWRVJcIjogXCJzaWx2ZXJcIixcbiAgXCJ+QUxFUlQuQVdBUkRfTEVWRUxfQlJPTlpFXCI6IFwiYnJvbnplXCIsXG4gIFwifkFMRVJULkNPTVBMRVRFX0NPSU5cIjogXCJZb3UgaGF2ZSBlYXJuZWQgYWxsIHRoZSBwaWVjZXMgb2YgdGhpcyBjb2luIVwiLFxuICBcIn5BTEVSVC5DT1JSRUNUX0RSQUtFXCI6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICBcIn5BTEVSVC5JTkNPUlJFQ1RfRFJBS0VcIjogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBkb2Vzbid0IG1hdGNoIHRoZSB0YXJnZXQgZHJha2UuXFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBiZWxvbmdzIGluIHRoYXQgYmFza2V0LlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01JU01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBkb2Vzbid0IGJlbG9uZyBpbiB0aGF0IGJhc2tldC5cIixcbiAgXCJ+QUxFUlQuRFVQTElDQVRFX0RSQUtFXCI6IFwiWW91IGFscmVhZHkgaGF2ZSBhIGRyYWtlIHRoYXQgbG9va3MganVzdCBsaWtlIHRoYXQhXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIGJ1dHRvbnNcbiAgXCJ+QlVUVE9OLk9LXCI6IFwiT0tcIixcbiAgXCJ+QlVUVE9OLlRSWV9BR0FJTlwiOiBcIlRyeSBhZ2FpblwiLFxuICBcIn5CVVRUT04uVFJZX0FOT1RIRVJfRUdHXCI6IFwiVHJ5IGFub3RoZXIgZWdnIVwiLFxuICBcIn5CVVRUT04uQ09OVElOVUVcIjogXCJDb250aW51ZVwiLFxuICBcIn5CVVRUT04uTkVYVF9UUklBTFwiOiBcIk5leHQgdHJpYWxcIixcbiAgXCJ+QlVUVE9OLk5FWFRfQ0hBTExFTkdFXCI6IFwiTmV4dCBjaGFsbGVuZ2VcIixcbiAgXCJ+QlVUVE9OLkVORF9NSVNTSU9OXCI6IFwiRW5kIG1pc3Npb25cIixcbiAgXCJ+QlVUVE9OLk5FWFRfTUlTU0lPTlwiOiBcIk5leHQgbWlzc2lvblwiLFxuICBcIn5CVVRUT04uUExBWUdST1VORF9NT1ZFX0ZPUldBUkRcIjogXCJCcmluZyBJdCBPbiFcIixcbiAgXCJ+QlVUVE9OLkNIRUNLX0RSQUtFXCI6IFwiQ2hlY2sgRHJha2VcIixcbiAgXCJ+QlVUVE9OLlNBVkVfRFJBS0VcIjogXCJTYXZlIHRoaXNcIixcbiAgXCJ+QlVUVE9OLlNVQk1JVFwiOiBcIlN1Ym1pdFwiLFxuICBcIn5CVVRUT04uUkVTRVRcIjogXCJSZXNldFwiLFxuICBcIn5CVVRUT04uRkVSVElMSVpFX0RJU0FCTEVEXCI6IFwiTWFrZSBhIGJhYnlcIixcbiAgXCJ+QlVUVE9OLkZFUlRJTElaRVwiOiBcIk1ha2UgYSBiYWJ5ISDinaTvuI9cIixcblxuICAvLyBNZXNzYWdlcyBmcm9tIElUU1xuICBcIn5JVFMuR1JFRVRJTkdcIjogXCJIaSB0aGVyZSB1c2VyIVwiXG59O1xuIiwiaW1wb3J0IGVuX3VzIGZyb20gJy4vZW4tdXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGVuX3VzXG59O1xuIiwiaW1wb3J0IHRyYW5zbGF0aW9ucyBmcm9tICcuL2xhbmcnO1xuXG5jb25zdCBkZWZhdWx0TGFuZyA9IFwiZW5fdXNcIixcbiAgICAgIHZhclJlZ0V4cCA9IC9cXCRcXHtcXHMqKFxcZCspXFxzKlxcfS9nLFxuICAgICAgZXJyb3IgPSBcIioqIFRSQU5TTEFUSU9OIEVSUk9SICoqXCI7XG5cbmNvbnN0IHRyYW5zbGF0ZVN0cmluZyA9IChrZXksIGxhbmcpID0+IHRyYW5zbGF0aW9uc1tsYW5nXSAmJiB0cmFuc2xhdGlvbnNbbGFuZ11ba2V5XSB8fCBrZXk7XG5cbi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIGlmIHRoZXkgZXhpc3QgaW4gdGhlIGxhbmd1YWdlIGZpbGUuIE90aGVyd2lzZSwgcGFzc2VzIGJhY2tcbiAqIHN0cmluZyB1bmNoYW5nZWQuXG4gKiBZb3UgY2FuIGFsc28gcGFzcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB3aGVyZSB0aGUgZmlyc3QgaXMgdGhlIG1haW4gdGV4dCwgYW5kXG4gKiB0aGUgb3RoZXJzIGFyZSB2YXJpYWJsZXMgdG8gYmUgcGxhY2VkIGluIHRoZSBzdHJpbmc6XG4gKiAgIFtcIkdvb2QgJHswfSwgJHsxfVwiLCBcImV2ZW5pbmdcIiwgXCJVc2VyXCJdXG4gKiB3aWxsIHJldHVybiBcIkdvb2QgZXZlbmluZywgVXNlclwiLiBFYWNoIHN0cmluZyBpbiB0aGUgYXJyYXkgbWF5IG9wdGlvbmFsbHkgYmVcbiAqIGluIHRoZSBsYW5ndWFnZSBmaWxlOlxuICogICBbXCJ+VElNRV9TRU5TSVRJVkVfR1JFRVRJTkdcIiwgXCJ+VElNRS5FVkVOSU5HXCIsIFwiVXNlclwiXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2xhdGUoa2V5LCBsYW5nPWRlZmF1bHRMYW5nKSB7XG4gIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIHRyYW5zbGF0ZVN0cmluZyhrZXksIGxhbmcpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgIGxldCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0ZVN0cmluZyhrZXlbMF0sIGxhbmcpO1xuICAgIHJldHVybiB0cmFuc2xhdGlvbi5yZXBsYWNlKHZhclJlZ0V4cCwgKG1hdGNoLCBpZCkgPT5cbiAgICAgIGtleVsrK2lkXSA/IHRyYW5zbGF0ZVN0cmluZyhrZXlbaWRdLCBsYW5nKSA6IGVycm9yKTtcbiAgfSBlbHNlIGlmIChrZXkgIT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IHRyYW5zbGF0ZTogXCIsIGtleSk7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuIl19
