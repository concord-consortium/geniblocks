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
  var animatingEggIndex = _ref2.animatingEggIndex;
  var onClick = _ref2.onClick;


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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
      var species = arguments.length <= 1 || arguments[1] === undefined ? BioLogica.Species.Drake : arguments[1];

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
      var species = arguments.length <= 1 || arguments[1] === undefined ? BioLogica.Species.Drake : arguments[1];

      if (!species || !alleleString) return false;
      var alleleToGeneMap = Object.keys(species.geneList).reduce(function (prev, gene) {
        species.geneList[gene].alleles.forEach(function (allele) {
          prev[allele] = gene;
        });
        return prev;
      }, {});
      return alleleString.split(',').every(function (alleleSide) {
        var _alleleSide$split = alleleSide.split(':');

        var _alleleSide$split2 = _slicedToArray(_alleleSide$split, 2);

        var side = _alleleSide$split2[0];
        var allele = _alleleSide$split2[1];

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
      var species = arguments.length <= 1 || arguments[1] === undefined ? BioLogica.Species.Drake : arguments[1];

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
        var _alleleSide$split3 = alleleSide.split(':');

        var _alleleSide$split4 = _slicedToArray(_alleleSide$split3, 2);

        var side = _alleleSide$split4[0];
        var allele = _alleleSide$split4[1];

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
     * Filters out hidden alleles from an original list of alleles
     *
     * @param {string[]} alleles - the set of alleles to be filtered
     * @param {string[]} hiddenAlleles - the alleles identifying the hidden genes
     * @param {BioLogica.species} species - the species that defines the genotype
     * @return {string[]} - the filtered alleles
     */

  }, {
    key: 'filterAlleles',
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
  "~BUTTON.END_CASE": "End case",
  "~BUTTON.NEXT_CASE": "Next case",
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
  } else if (key != null) {
    console.log("Could not translate: ", key);
  }
  return error;
}

},{"./lang":82}]},{},[79])(79)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL3V0aWxzL2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXNpbXBsZXRhYnMvZGlzdC9yZWFjdC1zaW1wbGV0YWJzLmpzIiwibm9kZV9tb2R1bGVzL3dhcm5pbmcvYnJvd3Nlci5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYmFza2V0LXNldC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYnV0dG9uLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaGFsbGVuZ2UtYXdhcmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZWdnLWNsdXRjaC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVlZGJhY2suanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2ZlcnRpbGl6aW5nLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2VuZS1sYWJlbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9tb2RhbC1hbGVydC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JkaW5hbC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3Blbi1zdGF0cy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9zdGF0cy5qcyIsInNyYy9jb2RlL2dlbmlibG9ja3MuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvbGFuZy9lbi11cy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9sYW5nL2luZGV4LmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL3RyYW5zbGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDclFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Ozs7OztBQVVlLFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUEwQztBQUFBLE1BQWxCLElBQWtCLHlEQUFiLFdBQWE7O0FBQ3ZELE1BQUksT0FBTyxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0IsV0FBTyxnQkFBZ0IsR0FBaEIsRUFBcUIsSUFBckIsQ0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUM3QixRQUFJLGNBQWMsZ0JBQWdCLElBQUksQ0FBSixDQUFoQixFQUF3QixJQUF4QixDQUFsQjtBQUNBLFdBQU8sWUFBWSxPQUFaLENBQW9CLFNBQXBCLEVBQStCLFVBQUMsS0FBRCxFQUFRLEVBQVI7QUFBQSxhQUNwQyxJQUFJLEVBQUUsRUFBTixJQUFZLGdCQUFnQixJQUFJLEVBQUosQ0FBaEIsRUFBeUIsSUFBekIsQ0FBWixHQUE2QyxLQURUO0FBQUEsS0FBL0IsQ0FBUDtBQUVELEdBSk0sTUFJQSxJQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUN0QixZQUFRLEdBQVIsQ0FBWSx1QkFBWixFQUFxQyxHQUFyQztBQUNEO0FBQ0QsU0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFiZWxIZWxwZXJzID0gcmVxdWlyZSgnLi91dGlsL2JhYmVsSGVscGVycy5qcycpO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG4vKipcclxuICogZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxyXG4gKi9cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGFjdGl2ZUVsZW1lbnQ7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX293bmVyRG9jdW1lbnQyID0gYmFiZWxIZWxwZXJzLmludGVyb3BSZXF1aXJlRGVmYXVsdChfb3duZXJEb2N1bWVudCk7XG5cbmZ1bmN0aW9uIGFjdGl2ZUVsZW1lbnQoKSB7XG4gIHZhciBkb2MgPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IGRvY3VtZW50IDogYXJndW1lbnRzWzBdO1xuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGRvYy5hY3RpdmVFbGVtZW50O1xuICB9IGNhdGNoIChlKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG52YXIgaGFzQ2xhc3MgPSByZXF1aXJlKCcuL2hhc0NsYXNzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7ZWxzZSBpZiAoIWhhc0NsYXNzKGVsZW1lbnQpKSBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnICsgY2xhc3NOYW1lO1xufTsiLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHJldHVybiAhIWNsYXNzTmFtZSAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO2Vsc2UgcmV0dXJuICgnICcgKyBlbGVtZW50LmNsYXNzTmFtZSArICcgJykuaW5kZXhPZignICcgKyBjbGFzc05hbWUgKyAnICcpICE9PSAtMTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkQ2xhc3M6IHJlcXVpcmUoJy4vYWRkQ2xhc3MnKSxcbiAgcmVtb3ZlQ2xhc3M6IHJlcXVpcmUoJy4vcmVtb3ZlQ2xhc3MnKSxcbiAgaGFzQ2xhc3M6IHJlcXVpcmUoJy4vaGFzQ2xhc3MnKVxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7ZWxzZSBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXHMpJyArIGNsYXNzTmFtZSArICcoPzpcXFxcc3wkKScsICdnJyksICckMScpLnJlcGxhY2UoL1xccysvZywgJyAnKS5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuLi91dGlsL2luRE9NJyk7XG52YXIgb2ZmID0gZnVuY3Rpb24gb2ZmKCkge307XG5cbmlmIChjYW5Vc2VET00pIHtcblxuICBvZmYgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICByZXR1cm4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfTtlbHNlIGlmIChkb2N1bWVudC5hdHRhY2hFdmVudCkgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBub2RlLmRldGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2ZmOyIsIid1c2Ugc3RyaWN0JztcbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuLi91dGlsL2luRE9NJyk7XG52YXIgb24gPSBmdW5jdGlvbiBvbigpIHt9O1xuXG5pZiAoY2FuVXNlRE9NKSB7XG4gIG9uID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAgICAgcmV0dXJuIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUgfHwgZmFsc2UpO1xuICAgIH07ZWxzZSBpZiAoZG9jdW1lbnQuYXR0YWNoRXZlbnQpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICByZXR1cm4gbm9kZS5hdHRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB9O1xuICB9KSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9uOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBvd25lckRvY3VtZW50O1xuXG5mdW5jdGlvbiBvd25lckRvY3VtZW50KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiYgbm9kZS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuLi91dGlsL2luRE9NJyk7XG5cbnZhciBjb250YWlucyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciByb290ID0gY2FuVXNlRE9NICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICByZXR1cm4gcm9vdCAmJiByb290LmNvbnRhaW5zID8gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dC5jb250YWlucyhub2RlKTtcbiAgfSA6IHJvb3QgJiYgcm9vdC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgcmV0dXJuIGNvbnRleHQgPT09IG5vZGUgfHwgISEoY29udGV4dC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihub2RlKSAmIDE2KTtcbiAgfSA6IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgaWYgKG5vZGUpIGRvIHtcbiAgICAgIGlmIChub2RlID09PSBjb250ZXh0KSByZXR1cm4gdHJ1ZTtcbiAgICB9IHdoaWxlIChub2RlID0gbm9kZS5wYXJlbnROb2RlKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFdpbmRvdyhub2RlKSB7XG4gIHJldHVybiBub2RlID09PSBub2RlLndpbmRvdyA/IG5vZGUgOiBub2RlLm5vZGVUeXBlID09PSA5ID8gbm9kZS5kZWZhdWx0VmlldyB8fCBub2RlLnBhcmVudFdpbmRvdyA6IGZhbHNlO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYWJlbEhlbHBlcnMgPSByZXF1aXJlKCcuLi91dGlsL2JhYmVsSGVscGVycy5qcycpO1xuXG52YXIgX3V0aWxDYW1lbGl6ZVN0eWxlID0gcmVxdWlyZSgnLi4vdXRpbC9jYW1lbGl6ZVN0eWxlJyk7XG5cbnZhciBfdXRpbENhbWVsaXplU3R5bGUyID0gYmFiZWxIZWxwZXJzLmludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbENhbWVsaXplU3R5bGUpO1xuXG52YXIgcnBvc2l0aW9uID0gL14odG9wfHJpZ2h0fGJvdHRvbXxsZWZ0KSQvO1xudmFyIHJudW1ub25weCA9IC9eKFsrLV0/KD86XFxkKlxcLnwpXFxkKyg/OltlRV1bKy1dP1xcZCt8KSkoPyFweClbYS16JV0rJC9pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9nZXRDb21wdXRlZFN0eWxlKG5vZGUpIHtcbiAgaWYgKCFub2RlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdObyBFbGVtZW50IHBhc3NlZCB0byBgZ2V0Q29tcHV0ZWRTdHlsZSgpYCcpO1xuICB2YXIgZG9jID0gbm9kZS5vd25lckRvY3VtZW50O1xuXG4gIHJldHVybiAnZGVmYXVsdFZpZXcnIGluIGRvYyA/IGRvYy5kZWZhdWx0Vmlldy5vcGVuZXIgPyBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKSA6IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpIDogeyAvL2llIDggXCJtYWdpY1wiIGZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvMS4xMS1zdGFibGUvc3JjL2Nzcy9jdXJDU1MuanMjTDcyXG4gICAgZ2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24gZ2V0UHJvcGVydHlWYWx1ZShwcm9wKSB7XG4gICAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlO1xuXG4gICAgICBwcm9wID0gKDAsIF91dGlsQ2FtZWxpemVTdHlsZTJbJ2RlZmF1bHQnXSkocHJvcCk7XG5cbiAgICAgIGlmIChwcm9wID09ICdmbG9hdCcpIHByb3AgPSAnc3R5bGVGbG9hdCc7XG5cbiAgICAgIHZhciBjdXJyZW50ID0gbm9kZS5jdXJyZW50U3R5bGVbcHJvcF0gfHwgbnVsbDtcblxuICAgICAgaWYgKGN1cnJlbnQgPT0gbnVsbCAmJiBzdHlsZSAmJiBzdHlsZVtwcm9wXSkgY3VycmVudCA9IHN0eWxlW3Byb3BdO1xuXG4gICAgICBpZiAocm51bW5vbnB4LnRlc3QoY3VycmVudCkgJiYgIXJwb3NpdGlvbi50ZXN0KHByb3ApKSB7XG4gICAgICAgIC8vIFJlbWVtYmVyIHRoZSBvcmlnaW5hbCB2YWx1ZXNcbiAgICAgICAgdmFyIGxlZnQgPSBzdHlsZS5sZWZ0O1xuICAgICAgICB2YXIgcnVuU3R5bGUgPSBub2RlLnJ1bnRpbWVTdHlsZTtcbiAgICAgICAgdmFyIHJzTGVmdCA9IHJ1blN0eWxlICYmIHJ1blN0eWxlLmxlZnQ7XG5cbiAgICAgICAgLy8gUHV0IGluIHRoZSBuZXcgdmFsdWVzIHRvIGdldCBhIGNvbXB1dGVkIHZhbHVlIG91dFxuICAgICAgICBpZiAocnNMZWZ0KSBydW5TdHlsZS5sZWZ0ID0gbm9kZS5jdXJyZW50U3R5bGUubGVmdDtcblxuICAgICAgICBzdHlsZS5sZWZ0ID0gcHJvcCA9PT0gJ2ZvbnRTaXplJyA/ICcxZW0nIDogY3VycmVudDtcbiAgICAgICAgY3VycmVudCA9IHN0eWxlLnBpeGVsTGVmdCArICdweCc7XG5cbiAgICAgICAgLy8gUmV2ZXJ0IHRoZSBjaGFuZ2VkIHZhbHVlc1xuICAgICAgICBzdHlsZS5sZWZ0ID0gbGVmdDtcbiAgICAgICAgaWYgKHJzTGVmdCkgcnVuU3R5bGUubGVmdCA9IHJzTGVmdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW1lbGl6ZSA9IHJlcXVpcmUoJy4uL3V0aWwvY2FtZWxpemVTdHlsZScpLFxuICAgIGh5cGhlbmF0ZSA9IHJlcXVpcmUoJy4uL3V0aWwvaHlwaGVuYXRlU3R5bGUnKSxcbiAgICBfZ2V0Q29tcHV0ZWRTdHlsZSA9IHJlcXVpcmUoJy4vZ2V0Q29tcHV0ZWRTdHlsZScpLFxuICAgIHJlbW92ZVN0eWxlID0gcmVxdWlyZSgnLi9yZW1vdmVTdHlsZScpO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHlsZShub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgdmFyIGNzcyA9ICcnLFxuICAgICAgcHJvcHMgPSBwcm9wZXJ0eTtcblxuICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnc3RyaW5nJykge1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBub2RlLnN0eWxlW2NhbWVsaXplKHByb3BlcnR5KV0gfHwgX2dldENvbXB1dGVkU3R5bGUobm9kZSkuZ2V0UHJvcGVydHlWYWx1ZShoeXBoZW5hdGUocHJvcGVydHkpKTtlbHNlIChwcm9wcyA9IHt9KVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBwcm9wcykgaWYgKGhhcy5jYWxsKHByb3BzLCBrZXkpKSB7XG4gICAgIXByb3BzW2tleV0gJiYgcHJvcHNba2V5XSAhPT0gMCA/IHJlbW92ZVN0eWxlKG5vZGUsIGh5cGhlbmF0ZShrZXkpKSA6IGNzcyArPSBoeXBoZW5hdGUoa2V5KSArICc6JyArIHByb3BzW2tleV0gKyAnOyc7XG4gIH1cblxuICBub2RlLnN0eWxlLmNzc1RleHQgKz0gJzsnICsgY3NzO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVtb3ZlU3R5bGUobm9kZSwga2V5KSB7XG4gIHJldHVybiAncmVtb3ZlUHJvcGVydHknIGluIG5vZGUuc3R5bGUgPyBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KGtleSkgOiBub2RlLnN0eWxlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xufTsiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtcImV4cG9ydHNcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZmFjdG9yeShleHBvcnRzKTtcbiAgfSBlbHNlIHtcbiAgICBmYWN0b3J5KHJvb3QuYmFiZWxIZWxwZXJzID0ge30pO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIHZhciBiYWJlbEhlbHBlcnMgPSBnbG9iYWw7XG5cbiAgYmFiZWxIZWxwZXJzLmludGVyb3BSZXF1aXJlRGVmYXVsdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgICAgXCJkZWZhdWx0XCI6IG9ialxuICAgIH07XG4gIH07XG5cbiAgYmFiZWxIZWxwZXJzLl9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcbn0pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBySHlwaGVuID0gLy0oLikvZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYW1lbGl6ZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHJIeXBoZW4sIGZ1bmN0aW9uIChfLCBjaHIpIHtcbiAgICByZXR1cm4gY2hyLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufTsiLCIvKipcclxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvMmFlYjhhMmE2YmViMDA2MTdhNDIxN2Y3ZjgyODQ5MjRmYTJhZDgxOS9zcmMvdmVuZG9yL2NvcmUvY2FtZWxpemVTdHlsZU5hbWUuanNcclxuICovXG5cbid1c2Ugc3RyaWN0JztcbnZhciBjYW1lbGl6ZSA9IHJlcXVpcmUoJy4vY2FtZWxpemUnKTtcbnZhciBtc1BhdHRlcm4gPSAvXi1tcy0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplU3R5bGVOYW1lKHN0cmluZykge1xuICByZXR1cm4gY2FtZWxpemUoc3RyaW5nLnJlcGxhY2UobXNQYXR0ZXJuLCAnbXMtJykpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciByVXBwZXIgPSAvKFtBLVpdKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh5cGhlbmF0ZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHJVcHBlciwgJy0kMScpLnRvTG93ZXJDYXNlKCk7XG59OyIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yYWViOGEyYTZiZWIwMDYxN2E0MjE3ZjdmODI4NDkyNGZhMmFkODE5L3NyYy92ZW5kb3IvY29yZS9oeXBoZW5hdGVTdHlsZU5hbWUuanNcclxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaHlwaGVuYXRlID0gcmVxdWlyZShcIi4vaHlwaGVuYXRlXCIpO1xudmFyIG1zUGF0dGVybiA9IC9ebXMtLztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoeXBoZW5hdGVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBoeXBoZW5hdGUoc3RyaW5nKS5yZXBsYWNlKG1zUGF0dGVybiwgXCItbXMtXCIpO1xufTsiLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9ICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCAmJiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi9pbkRPTScpO1xuXG52YXIgc2l6ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVjYWxjKSB7XG4gIGlmICghc2l6ZSB8fCByZWNhbGMpIHtcbiAgICBpZiAoY2FuVXNlRE9NKSB7XG4gICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgIHNjcm9sbERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUudG9wID0gJy05OTk5cHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLndpZHRoID0gJzUwcHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLmhlaWdodCA9ICc1MHB4JztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG4gICAgICBzaXplID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzaXplO1xufTsiLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNy4xXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIHJvb3QgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSByb290WydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSByb290WydjYW5jZWwnICsgc3VmZml4XSB8fCByb290WydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cblxuZm9yKHZhciBpID0gMDsgIXJhZiAmJiBpIDwgdmVuZG9ycy5sZW5ndGg7IGkrKykge1xuICByYWYgPSByb290W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdDYW5jZWwnICsgc3VmZml4XVxuICAgICAgfHwgcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgdmFyIGxhc3QgPSAwXG4gICAgLCBpZCA9IDBcbiAgICAsIHF1ZXVlID0gW11cbiAgICAsIGZyYW1lRHVyYXRpb24gPSAxMDAwIC8gNjBcblxuICByYWYgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKVxuICAgICAgICAsIG5leHQgPSBNYXRoLm1heCgwLCBmcmFtZUR1cmF0aW9uIC0gKF9ub3cgLSBsYXN0KSlcbiAgICAgIGxhc3QgPSBuZXh0ICsgX25vd1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNwID0gcXVldWUuc2xpY2UoMClcbiAgICAgICAgLy8gQ2xlYXIgcXVldWUgaGVyZSB0byBwcmV2ZW50XG4gICAgICAgIC8vIGNhbGxiYWNrcyBmcm9tIGFwcGVuZGluZyBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgZnJhbWUncyBxdWV1ZVxuICAgICAgICBxdWV1ZS5sZW5ndGggPSAwXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmKCFjcFtpXS5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgY3BbaV0uY2FsbGJhY2sobGFzdClcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBNYXRoLnJvdW5kKG5leHQpKVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKHtcbiAgICAgIGhhbmRsZTogKytpZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNhbmNlbGxlZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiBpZFxuICB9XG5cbiAgY2FmID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihxdWV1ZVtpXS5oYW5kbGUgPT09IGhhbmRsZSkge1xuICAgICAgICBxdWV1ZVtpXS5jYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4pIHtcbiAgLy8gV3JhcCBpbiBhIG5ldyBmdW5jdGlvbiB0byBwcmV2ZW50XG4gIC8vIGBjYW5jZWxgIHBvdGVudGlhbGx5IGJlaW5nIGFzc2lnbmVkXG4gIC8vIHRvIHRoZSBuYXRpdmUgckFGIGZ1bmN0aW9uXG4gIHJldHVybiByYWYuY2FsbChyb290LCBmbilcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkocm9vdCwgYXJndW1lbnRzKVxufVxubW9kdWxlLmV4cG9ydHMucG9seWZpbGwgPSBmdW5jdGlvbigpIHtcbiAgcm9vdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByYWZcbiAgcm9vdC5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhZlxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxudmFyIE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKSxcbiAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uUmVzdDogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZSA9IF9wcm9wcy5kZWZhdWx0U3R5bGU7XG4gICAgdmFyIHN0eWxlID0gX3Byb3BzLnN0eWxlO1xuXG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IGRlZmF1bHRTdHlsZSB8fCBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZSk7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10oY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSxcbiAgICAgIGxhc3RJZGVhbFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5XG4gICAgfTtcbiAgfSxcblxuICB3YXNBbmltYXRpbmc6IGZhbHNlLFxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGU6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKGRlc3RTdHlsZSkge1xuICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuICAgIHZhciBfc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBjdXJyZW50U3R5bGUgPSBfc3RhdGUuY3VycmVudFN0eWxlO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdHkgPSBfc3RhdGUuY3VycmVudFZlbG9jaXR5O1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZSA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdHkgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdHk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICBpZiAoIWRlc3RTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnRTdHlsZSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGUpO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdHkpO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlKTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgbGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZTogY3VycmVudFN0eWxlLCBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSwgbGFzdElkZWFsU3R5bGU6IGxhc3RJZGVhbFN0eWxlLCBsYXN0SWRlYWxWZWxvY2l0eTogbGFzdElkZWFsVmVsb2NpdHkgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgdmFyIHByb3BzU3R5bGUgPSBfdGhpcy5wcm9wcy5zdHlsZTtcbiAgICAgIGlmIChfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGUsIHByb3BzU3R5bGUsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0eSkpIHtcbiAgICAgICAgaWYgKF90aGlzLndhc0FuaW1hdGluZyAmJiBfdGhpcy5wcm9wcy5vblJlc3QpIHtcbiAgICAgICAgICBfdGhpcy5wcm9wcy5vblJlc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIF90aGlzLnByZXZUaW1lO1xuICAgICAgX3RoaXMucHJldlRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IF90aGlzLmFjY3VtdWxhdGVkVGltZSArIHRpbWVEZWx0YTtcbiAgICAgIC8vIG1vcmUgdGhhbiAxMCBmcmFtZXM/IHByb2xseSBzd2l0Y2hlZCBicm93c2VyIHRhYi4gUmVzdGFydFxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA+IG1zUGVyRnJhbWUgKiAxMCkge1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID09PSAwKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRGcmFtZUNvbXBsZXRpb24gPSAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKSAqIG1zUGVyRnJhbWUpIC8gbXNQZXJGcmFtZTtcbiAgICAgIHZhciBmcmFtZXNUb0NhdGNoVXAgPSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpO1xuXG4gICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGUgPSB7fTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0eSA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNTdHlsZSkge1xuICAgICAgICBpZiAoIXByb3BzU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBwcm9wc1N0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVba2V5XTtcbiAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXR5W2tleV07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZXNUb0NhdGNoVXA7IGkrKykge1xuICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfc3RlcHBlclsxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICB2YXIgbmV4dElkZWFsWCA9IF9zdGVwcGVyMlswXTtcbiAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSArIChuZXh0SWRlYWxWIC0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZTogbmV3Q3VycmVudFN0eWxlLFxuICAgICAgICBjdXJyZW50VmVsb2NpdHk6IG5ld0N1cnJlbnRWZWxvY2l0eSxcbiAgICAgICAgbGFzdElkZWFsU3R5bGU6IG5ld0xhc3RJZGVhbFN0eWxlLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eTogbmV3TGFzdElkZWFsVmVsb2NpdHlcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZSk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBwcm9wcy5zdHlsZTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG5mdW5jdGlvbiBzaG91bGRTdG9wQW5pbWF0aW9uQWxsKGN1cnJlbnRTdHlsZXMsIHN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBzdHlsZXNbaV0sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFN0YWdnZXJlZE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU3RhZ2dlcmVkTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpKSxcbiAgICBzdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgfHwgc3R5bGVzKCkubWFwKF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBjdXJyZW50U3R5bGVzLm1hcChmdW5jdGlvbiAoY3VycmVudFN0eWxlKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXNcbiAgICB9O1xuICB9LFxuXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfc3RhdGUuY3VycmVudFN0eWxlcztcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfc3RhdGUuY3VycmVudFZlbG9jaXRpZXM7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlcyA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZXM7XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcztcblxuICAgIHZhciBzb21lRGlydHkgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1bnJlYWRQcm9wU3R5bGUgPSB1bnJlYWRQcm9wU3R5bGVzW2ldO1xuICAgICAgdmFyIGRpcnR5ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB1bnJlYWRQcm9wU3R5bGUpIHtcbiAgICAgICAgaWYgKCF1bnJlYWRQcm9wU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSB1bnJlYWRQcm9wU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNvbWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNvbWVEaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcywgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSBfdGhpcy5wcm9wcy5zdHlsZXMoX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcblxuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgaWYgKHNob3VsZFN0b3BBbmltYXRpb25BbGwoX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzdFN0eWxlID0gZGVzdFN0eWxlc1tpXTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICAgICAgaWYgKCFkZXN0U3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBkZXN0U3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBuZXdMYXN0SWRlYWxTdHlsZTtcbiAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudW5yZWFkUHJvcFN0eWxlcyA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGVzICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHByb3BzLnN0eWxlcyh0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcyk7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4odGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFN0YWdnZXJlZE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9tZXJnZURpZmYgPSByZXF1aXJlKCcuL21lcmdlRGlmZicpO1xuXG52YXIgX21lcmdlRGlmZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZXJnZURpZmYpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxuLy8gdGhlIGNoaWxkcmVuIGZ1bmN0aW9uICYgKHBvdGVudGlhbCkgc3R5bGVzIGZ1bmN0aW9uIGFza3MgYXMgcGFyYW0gYW5cbi8vIEFycmF5PFRyYW5zaXRpb25QbGFpblN0eWxlPiwgd2hlcmUgZWFjaCBUcmFuc2l0aW9uUGxhaW5TdHlsZSBpcyBvZiB0aGUgZm9ybWF0XG4vLyB7a2V5OiBzdHJpbmcsIGRhdGE/OiBhbnksIHN0eWxlOiBQbGFpblN0eWxlfS4gSG93ZXZlciwgdGhlIHdheSB3ZSBrZWVwXG4vLyBpbnRlcm5hbCBzdGF0ZXMgZG9lc24ndCBjb250YWluIHN1Y2ggYSBkYXRhIHN0cnVjdHVyZSAoY2hlY2sgdGhlIHN0YXRlIGFuZFxuLy8gVHJhbnNpdGlvbk1vdGlvblN0YXRlKS4gU28gd2hlbiBjaGlsZHJlbiBmdW5jdGlvbiBhbmQgb3RoZXJzIGFzayBmb3Igc3VjaFxuLy8gZGF0YSB3ZSBuZWVkIHRvIGdlbmVyYXRlIHRoZW0gb24gdGhlIGZseSBieSBjb21iaW5pbmcgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4vLyBjdXJyZW50U3R5bGVzL2xhc3RJZGVhbFN0eWxlc1xuZnVuY3Rpb24gcmVoeWRyYXRlU3R5bGVzKG1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCBwbGFpblN0eWxlcykge1xuICBpZiAodW5yZWFkUHJvcFN0eWxlcyA9PSBudWxsKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZS5rZXksXG4gICAgICAgIGRhdGE6IG1lcmdlZFByb3BzU3R5bGUuZGF0YSxcbiAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBpZiAodW5yZWFkUHJvcFN0eWxlc1tqXS5rZXkgPT09IG1lcmdlZFByb3BzU3R5bGUua2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICAgIGtleTogdW5yZWFkUHJvcFN0eWxlc1tqXS5rZXksXG4gICAgICAgICAgZGF0YTogdW5yZWFkUHJvcFN0eWxlc1tqXS5kYXRhLFxuICAgICAgICAgIHN0eWxlOiBwbGFpblN0eWxlc1tpXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuIHsga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLCBzdHlsZTogcGxhaW5TdHlsZXNbaV0gfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMsIG1lcmdlZFByb3BzU3R5bGVzKSB7XG4gIGlmIChtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGggIT09IGRlc3RTdHlsZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtZXJnZWRQcm9wc1N0eWxlc1tpXS5rZXkgIT09IGRlc3RTdHlsZXNbaV0ua2V5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gd2UgaGF2ZSB0aGUgaW52YXJpYW50IHRoYXQgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4gIC8vIGN1cnJlbnRTdHlsZXMvY3VycmVudFZlbG9jaXRpZXMvbGFzdCogYXJlIHN5bmNlZCBpbiB0ZXJtcyBvZiBjZWxscywgc2VlXG4gIC8vIG1lcmdlQW5kU3luYyBjb21tZW50IGZvciBtb3JlIGluZm9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10oY3VycmVudFN0eWxlc1tpXSwgZGVzdFN0eWxlc1tpXS5zdHlsZSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvcmUga2V5IG1lcmdpbmcgbG9naWNcblxuLy8gdGhpbmdzIHRvIGRvOiBzYXkgcHJldmlvdXNseSBtZXJnZWQgc3R5bGUgaXMge2EsIGJ9LCBkZXN0IHN0eWxlIChwcm9wKSBpcyB7Yixcbi8vIGN9LCBwcmV2aW91cyBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBpcyB7YSwgYn1cbi8vICoqaW52YXJpYW50Kio6IGN1cnJlbnRbaV0gY29ycmVzcG9uZHMgdG8gbWVyZ2VkW2ldIGluIHRlcm1zIG9mIGtleVxuXG4vLyBzdGVwczpcbi8vIHR1cm4gbWVyZ2VkIHN0eWxlIGludG8ge2E/LCBiLCBjfVxuLy8gICAgYWRkIGMsIHZhbHVlIG9mIGMgaXMgZGVzdFN0eWxlcy5jXG4vLyAgICBtYXliZSByZW1vdmUgYSwgYWthIGNhbGwgd2lsbExlYXZlKGEpLCB0aGVuIG1lcmdlZCBpcyBlaXRoZXIge2IsIGN9IG9yIHthLCBiLCBjfVxuLy8gdHVybiBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBmcm9tIHthLCBifSBpbnRvIHthPywgYiwgY31cbi8vICAgIG1heWJlIHJlbW92ZSBhXG4vLyAgICBjZXJ0YWlubHkgYWRkIGMsIHZhbHVlIG9mIGMgaXMgd2lsbEVudGVyKGMpXG4vLyBsb29wIG92ZXIgbWVyZ2VkIGFuZCBjb25zdHJ1Y3QgbmV3IGN1cnJlbnRcbi8vIGRlc3QgZG9lc24ndCBjaGFuZ2UsIHRoYXQncyBvd25lcidzXG5mdW5jdGlvbiBtZXJnZUFuZFN5bmMod2lsbEVudGVyLCB3aWxsTGVhdmUsIG9sZE1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBvbGRDdXJyZW50U3R5bGVzLCBvbGRDdXJyZW50VmVsb2NpdGllcywgb2xkTGFzdElkZWFsU3R5bGVzLCBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzKSB7XG4gIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZURpZmYyWydkZWZhdWx0J10ob2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIGZ1bmN0aW9uIChvbGRJbmRleCwgb2xkTWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgIHZhciBsZWF2aW5nU3R5bGUgPSB3aWxsTGVhdmUob2xkTWVyZ2VkUHJvcHNTdHlsZSk7XG4gICAgaWYgKGxlYXZpbmdTdHlsZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKG9sZEN1cnJlbnRTdHlsZXNbb2xkSW5kZXhdLCBsZWF2aW5nU3R5bGUsIG9sZEN1cnJlbnRWZWxvY2l0aWVzW29sZEluZGV4XSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IG9sZE1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBvbGRNZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBsZWF2aW5nU3R5bGUgfTtcbiAgfSk7XG5cbiAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG4gIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldO1xuICAgIHZhciBmb3VuZE9sZEluZGV4ID0gbnVsbDtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9sZE1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAob2xkTWVyZ2VkUHJvcHNTdHlsZXNbal0ua2V5ID09PSBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgZm91bmRPbGRJbmRleCA9IGo7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICBpZiAoZm91bmRPbGRJbmRleCA9PSBudWxsKSB7XG4gICAgICB2YXIgcGxhaW5TdHlsZSA9IHdpbGxFbnRlcihuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCk7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IHBsYWluU3R5bGU7XG5cbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHZhciB2ZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10obmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwuc3R5bGUpO1xuICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG9sZEN1cnJlbnRTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBvbGRMYXN0SWRlYWxTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IG9sZEN1cnJlbnRWZWxvY2l0aWVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG9sZExhc3RJZGVhbFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtuZXdNZXJnZWRQcm9wc1N0eWxlcywgbmV3Q3VycmVudFN0eWxlcywgbmV3Q3VycmVudFZlbG9jaXRpZXMsIG5ld0xhc3RJZGVhbFN0eWxlcywgbmV3TGFzdElkZWFsVmVsb2NpdGllc107XG59XG5cbnZhciBUcmFuc2l0aW9uTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUcmFuc2l0aW9uTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdC5Qcm9wVHlwZXMuZnVuYywgX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAga2V5OiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGF0YTogX3JlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWRcbiAgICB9KSldKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB3aWxsTGVhdmU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB3aWxsRW50ZXI6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWxsRW50ZXI6IGZ1bmN0aW9uIHdpbGxFbnRlcihzdHlsZVRoYXRFbnRlcmVkKSB7XG4gICAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZVRoYXRFbnRlcmVkLnN0eWxlKTtcbiAgICAgIH0sXG4gICAgICAvLyByZWNhbGw6IHJldHVybmluZyBudWxsIG1ha2VzIHRoZSBjdXJyZW50IHVubW91bnRpbmcgVHJhbnNpdGlvblN0eWxlXG4gICAgICAvLyBkaXNhcHBlYXIgaW1tZWRpYXRlbHlcbiAgICAgIHdpbGxMZWF2ZTogZnVuY3Rpb24gd2lsbExlYXZlKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG4gICAgdmFyIHdpbGxFbnRlciA9IF9wcm9wcy53aWxsRW50ZXI7XG4gICAgdmFyIHdpbGxMZWF2ZSA9IF9wcm9wcy53aWxsTGVhdmU7XG5cbiAgICB2YXIgZGVzdFN0eWxlcyA9IHR5cGVvZiBzdHlsZXMgPT09ICdmdW5jdGlvbicgPyBzdHlsZXMoZGVmYXVsdFN0eWxlcykgOiBzdHlsZXM7XG5cbiAgICAvLyB0aGlzIGlzIHNwZWNpYWwuIGZvciB0aGUgZmlyc3QgdGltZSBhcm91bmQsIHdlIGRvbid0IGhhdmUgYSBjb21wYXJpc29uXG4gICAgLy8gYmV0d2VlbiBsYXN0IChubyBsYXN0KSBhbmQgY3VycmVudCBtZXJnZWQgcHJvcHMuIHdlJ2xsIGNvbXB1dGUgbGFzdCBzbzpcbiAgICAvLyBzYXkgZGVmYXVsdCBpcyB7YSwgYn0gYW5kIHN0eWxlcyAoZGVzdCBzdHlsZSkgaXMge2IsIGN9LCB3ZSdsbFxuICAgIC8vIGZhYnJpY2F0ZSBsYXN0IGFzIHthLCBifVxuICAgIHZhciBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZGVmYXVsdFN0eWxlcyA9PSBudWxsKSB7XG4gICAgICBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IGRlc3RTdHlsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKGRlZmF1bHRTdHlsZUNlbGwpIHtcbiAgICAgICAgLy8gVE9ETzoga2V5IHNlYXJjaCBjb2RlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChkZXN0U3R5bGVzW2ldLmtleSA9PT0gZGVmYXVsdFN0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0U3R5bGVzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFN0eWxlQ2VsbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgb2xkQ3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSkgOiBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuICAgIHZhciBvbGRDdXJyZW50VmVsb2NpdGllcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KTtcblxuICAgIHZhciBfbWVyZ2VBbmRTeW5jID0gbWVyZ2VBbmRTeW5jKFxuICAgIC8vICRGbG93Rml4TWVcbiAgICB3aWxsRW50ZXIsXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHdpbGxMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRDdXJyZW50U3R5bGVzLCAvLyBvbGRMYXN0SWRlYWxTdHlsZXMgcmVhbGx5XG4gICAgb2xkQ3VycmVudFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luY1swXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmNbMV07XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1syXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luY1szXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmNbNF07XG4gICAgLy8gb2xkTGFzdElkZWFsVmVsb2NpdGllcyByZWFsbHlcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzXG4gICAgfTtcbiAgfSxcblxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGVzOiBudWxsLFxuICAvLyBhZnRlciBjaGVja2luZyBmb3IgdW5yZWFkUHJvcFN0eWxlcyAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUodW5yZWFkUHJvcFN0eWxlcykge1xuICAgIHZhciBfbWVyZ2VBbmRTeW5jMiA9IG1lcmdlQW5kU3luYyhcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy5wcm9wcy53aWxsRW50ZXIsXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHRoaXMucHJvcHMud2lsbExlYXZlLCB0aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luYzJbMF07XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlsxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMlsyXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luYzJbM107XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMls0XTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV0uc3R5bGU7XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIXVucmVhZFByb3BTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgY3VycmVudFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxTdHlsZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIG1lcmdlZFByb3BzU3R5bGVzW2ldID0ge1xuICAgICAgICAgICAgICBrZXk6IG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSxcbiAgICAgICAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0uZGF0YSxcbiAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0uc3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bmxpa2UgdGhlIG90aGVyIDIgY29tcG9uZW50cywgd2UgY2FuJ3QgZGV0ZWN0IHN0YWxlbmVzcyBhbmQgb3B0aW9uYWxseVxuICAgIC8vIG9wdCBvdXQgb2Ygc2V0U3RhdGUgaGVyZS4gZWFjaCBzdHlsZSBvYmplY3QncyBkYXRhIG1pZ2h0IGNvbnRhaW4gbmV3XG4gICAgLy8gc3R1ZmYgd2UncmUgbm90L2Nhbm5vdCBjb21wYXJlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgfSk7XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcHJvcFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcztcbiAgICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHByb3BTdHlsZXMgPT09ICdmdW5jdGlvbicgPyBwcm9wU3R5bGVzKHJlaHlkcmF0ZVN0eWxlcyhfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgX3RoaXMudW5yZWFkUHJvcFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKSkgOiBwcm9wU3R5bGVzO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBfbWVyZ2VBbmRTeW5jMyA9IG1lcmdlQW5kU3luYyhcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIF90aGlzLnByb3BzLndpbGxFbnRlcixcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIF90aGlzLnByb3BzLndpbGxMZWF2ZSwgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1swXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luYzNbMV07XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1syXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1szXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzNbNF07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3TWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGUgPSBuZXdNZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3TWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgICAgICAgIGlmICghbmV3TWVyZ2VkUHJvcHNTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IG5ld01lcmdlZFByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IG5ld0xhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgICBtZXJnZWRQcm9wc1N0eWxlczogbmV3TWVyZ2VkUHJvcHNTdHlsZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcHMuc3R5bGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBwcm9wcy5zdHlsZXMocmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gcHJvcHMuc3R5bGVzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGh5ZHJhdGVkU3R5bGVzID0gcmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4oaHlkcmF0ZWRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVHJhbnNpdGlvbk1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vLyBsaXN0IG9mIHN0eWxlcywgZWFjaCBjb250YWluaW5nIGludGVycG9sYXRpbmcgdmFsdWVzLiBQYXJ0IG9mIHdoYXQncyBwYXNzZWRcbi8vIHRvIGNoaWxkcmVuIGZ1bmN0aW9uLiBOb3RpY2UgdGhhdCB0aGlzIGlzXG4vLyBBcnJheTxBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3Q+LCB3aXRob3V0IHRoZSB3cmFwcGVyIHRoYXQgaXMge2tleTogLi4uLFxuLy8gZGF0YTogLi4uIHN0eWxlOiBBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3R9LiBPbmx5IG1lcmdlZFByb3BzU3R5bGVzXG4vLyBjb250YWlucyB0aGUga2V5ICYgZGF0YSBpbmZvIChzbyB0aGF0IHdlIG9ubHkgaGF2ZSBhIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcbi8vIGZvciB0aGVzZSwgYW5kIHRvIHNhdmUgc3BhY2UpLiBDaGVjayB0aGUgY29tbWVudCBmb3IgYHJlaHlkcmF0ZVN0eWxlc2AgdG9cbi8vIHNlZSBob3cgd2UgcmVnZW5lcmF0ZSB0aGUgZW50aXJldHkgb2Ygd2hhdCdzIHBhc3NlZCB0byBjaGlsZHJlbiBmdW5jdGlvblxuXG4vLyB0aGUgYXJyYXkgdGhhdCBrZWVwcyB0cmFjayBvZiBjdXJyZW50bHkgcmVuZGVyZWQgc3R1ZmYhIEluY2x1ZGluZyBzdHVmZlxuLy8gdGhhdCB5b3UndmUgdW5tb3VudGVkIGJ1dCB0aGF0J3Mgc3RpbGwgYW5pbWF0aW5nLiBUaGlzIGlzIHdoZXJlIGl0IGxpdmVzIiwiXG5cbi8vIGN1cnJlbnRseSB1c2VkIHRvIGluaXRpYXRlIHRoZSB2ZWxvY2l0eSBzdHlsZSBvYmplY3QgdG8gMFxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWFwVG9aZXJvO1xuXG5mdW5jdGlvbiBtYXBUb1plcm8ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0W2tleV0gPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gY29yZSBrZXlzIG1lcmdpbmcgYWxnb3JpdGhtLiBJZiBwcmV2aW91cyByZW5kZXIncyBrZXlzIGFyZSBbYSwgYl0sIGFuZCB0aGVcbi8vIG5leHQgcmVuZGVyJ3MgW2MsIGIsIGRdLCB3aGF0J3MgdGhlIGZpbmFsIG1lcmdlZCBrZXlzIGFuZCBvcmRlcmluZz9cblxuLy8gLSBjIGFuZCBhIG11c3QgYm90aCBiZSBiZWZvcmUgYlxuLy8gLSBiIGJlZm9yZSBkXG4vLyAtIG9yZGVyaW5nIGJldHdlZW4gYSBhbmQgYyBhbWJpZ3VvdXNcblxuLy8gdGhpcyByZWR1Y2VzIHRvIG1lcmdpbmcgdHdvIHBhcnRpYWxseSBvcmRlcmVkIGxpc3RzIChlLmcuIGxpc3RzIHdoZXJlIG5vdFxuLy8gZXZlcnkgaXRlbSBoYXMgYSBkZWZpbml0ZSBvcmRlcmluZywgbGlrZSBjb21wYXJpbmcgYSBhbmQgYyBhYm92ZSkuIEZvciB0aGVcbi8vIGFtYmlndW91cyBvcmRlcmluZyB3ZSBkZXRlcm1pbmlzdGljYWxseSBjaG9vc2UgdG8gcGxhY2UgdGhlIG5leHQgcmVuZGVyJ3Ncbi8vIGl0ZW0gYWZ0ZXIgdGhlIHByZXZpb3VzJzsgc28gYyBhZnRlciBhXG5cbi8vIHRoaXMgaXMgY2FsbGVkIGEgdG9wb2xvZ2ljYWwgc29ydGluZy4gRXhjZXB0IHRoZSBleGlzdGluZyBhbGdvcml0aG1zIGRvbid0XG4vLyB3b3JrIHdlbGwgd2l0aCBqcyBiYyBvZiB0aGUgYW1vdW50IG9mIGFsbG9jYXRpb24sIGFuZCBpc24ndCBvcHRpbWl6ZWQgZm9yIG91clxuLy8gY3VycmVudCB1c2UtY2FzZSBiYyB0aGUgcnVudGltZSBpcyBsaW5lYXIgaW4gdGVybXMgb2YgZWRnZXMgKHNlZSB3aWtpIGZvclxuLy8gbWVhbmluZyksIHdoaWNoIGlzIGh1Z2Ugd2hlbiB0d28gbGlzdHMgaGF2ZSBtYW55IGNvbW1vbiBlbGVtZW50c1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWVyZ2VEaWZmO1xuXG5mdW5jdGlvbiBtZXJnZURpZmYocHJldiwgbmV4dCwgb25SZW1vdmUpIHtcbiAgLy8gYm9va2tlZXBpbmcgZm9yIGVhc2llciBhY2Nlc3Mgb2YgYSBrZXkncyBpbmRleCBiZWxvdy4gVGhpcyBpcyAyIGFsbG9jYXRpb25zICtcbiAgLy8gcG90ZW50aWFsbHkgdHJpZ2dlcmluZyBjaHJvbWUgaGFzaCBtYXAgbW9kZSBmb3Igb2JqcyAoc28gaXQgbWlnaHQgYmUgZmFzdGVyXG5cbiAgdmFyIHByZXZLZXlJbmRleCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBwcmV2S2V5SW5kZXhbcHJldltpXS5rZXldID0gaTtcbiAgfVxuICB2YXIgbmV4dEtleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIG5leHRLZXlJbmRleFtuZXh0W2ldLmtleV0gPSBpO1xuICB9XG5cbiAgLy8gZmlyc3QsIGFuIG92ZXJseSBlbGFib3JhdGUgd2F5IG9mIG1lcmdpbmcgcHJldiBhbmQgbmV4dCwgZWxpbWluYXRpbmdcbiAgLy8gZHVwbGljYXRlcyAoaW4gdGVybXMgb2Yga2V5cykuIElmIHRoZXJlJ3MgZHVwZSwga2VlcCB0aGUgaXRlbSBpbiBuZXh0KS5cbiAgLy8gVGhpcyB3YXkgb2Ygd3JpdGluZyBpdCBzYXZlcyBhbGxvY2F0aW9uc1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIHJldFtpXSA9IG5leHRbaV07XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFuZXh0S2V5SW5kZXguaGFzT3duUHJvcGVydHkocHJldltpXS5rZXkpKSB7XG4gICAgICAvLyB0aGlzIGlzIGNhbGxlZCBteSBUTSdzIGBtZXJnZUFuZFN5bmNgLCB3aGljaCBjYWxscyB3aWxsTGVhdmUuIFdlIGRvbid0XG4gICAgICAvLyBtZXJnZSBpbiBrZXlzIHRoYXQgdGhlIHVzZXIgZGVzaXJlcyB0byBraWxsXG4gICAgICB2YXIgZmlsbCA9IG9uUmVtb3ZlKGksIHByZXZbaV0pO1xuICAgICAgaWYgKGZpbGwgIT0gbnVsbCkge1xuICAgICAgICByZXQucHVzaChmaWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgYWxsIHRoZSBpdGVtcyBhbGwgcHJlc2VudC4gQ29yZSBzb3J0aW5nIGxvZ2ljIHRvIGhhdmUgdGhlIHJpZ2h0IG9yZGVyXG4gIHJldHVybiByZXQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHZhciBuZXh0T3JkZXJBID0gbmV4dEtleUluZGV4W2Eua2V5XTtcbiAgICB2YXIgbmV4dE9yZGVyQiA9IG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgdmFyIHByZXZPcmRlckEgPSBwcmV2S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBwcmV2T3JkZXJCID0gcHJldktleUluZGV4W2Iua2V5XTtcblxuICAgIGlmIChuZXh0T3JkZXJBICE9IG51bGwgJiYgbmV4dE9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gbmV4dFxuICAgICAgcmV0dXJuIG5leHRLZXlJbmRleFthLmtleV0gLSBuZXh0S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAocHJldk9yZGVyQSAhPSBudWxsICYmIHByZXZPcmRlckIgIT0gbnVsbCkge1xuICAgICAgLy8gYm90aCBrZXlzIGluIHByZXZcbiAgICAgIHJldHVybiBwcmV2S2V5SW5kZXhbYS5rZXldIC0gcHJldktleUluZGV4W2Iua2V5XTtcbiAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgIT0gbnVsbCkge1xuICAgICAgLy8ga2V5IGEgaW4gbmV4dCwga2V5IGIgaW4gcHJldlxuXG4gICAgICAvLyBob3cgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBiZXR3ZWVuIGEgYW5kIGI/IFdlIGZpbmQgYSBcInBpdm90XCIgKHRlcm1cbiAgICAgIC8vIGFidXNlKSwgYSBrZXkgcHJlc2VudCBpbiBib3RoIHByZXYgYW5kIG5leHQsIHRoYXQgaXMgc2FuZHdpY2hlZCBiZXR3ZWVuXG4gICAgICAvLyBhIGFuZCBiLiBJbiB0aGUgY29udGV4dCBvZiBvdXIgYWJvdmUgZXhhbXBsZSwgaWYgd2UncmUgY29tcGFyaW5nIGEgYW5kXG4gICAgICAvLyBkLCBiJ3MgKHRoZSBvbmx5KSBwaXZvdFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgICBpZiAoIXByZXZLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwaXZvdCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0T3JkZXJBIDwgbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCID4gcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJBID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBwbHVnZ2FibGUuIGRlZmF1bHQgdG86IG5leHQgYmlnZ2VyIHRoYW4gcHJldlxuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8vIHByZXZPcmRlckEsIG5leHRPcmRlckJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgaWYgKCFwcmV2S2V5SW5kZXguaGFzT3duUHJvcGVydHkocGl2b3QpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRPcmRlckIgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJCID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJBIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgcmV0dXJuIC0xO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyB0byBsb29wIHRocm91Z2ggYW5kIGZpbmQgYSBrZXkncyBpbmRleCBlYWNoIHRpbWUpLCBidXQgSSBubyBsb25nZXIgY2FyZSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIG5vV29iYmxlOiB7IHN0aWZmbmVzczogMTcwLCBkYW1waW5nOiAyNiB9LCAvLyB0aGUgZGVmYXVsdCwgaWYgbm90aGluZyBwcm92aWRlZFxuICBnZW50bGU6IHsgc3RpZmZuZXNzOiAxMjAsIGRhbXBpbmc6IDE0IH0sXG4gIHdvYmJseTogeyBzdGlmZm5lc3M6IDE4MCwgZGFtcGluZzogMTIgfSxcbiAgc3RpZmY6IHsgc3RpZmZuZXNzOiAyMTAsIGRhbXBpbmc6IDIwIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqWydkZWZhdWx0J10gOiBvYmo7IH1cblxudmFyIF9Nb3Rpb24gPSByZXF1aXJlKCcuL01vdGlvbicpO1xuXG5leHBvcnRzLk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfTW90aW9uKTtcblxudmFyIF9TdGFnZ2VyZWRNb3Rpb24gPSByZXF1aXJlKCcuL1N0YWdnZXJlZE1vdGlvbicpO1xuXG5leHBvcnRzLlN0YWdnZXJlZE1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfU3RhZ2dlcmVkTW90aW9uKTtcblxudmFyIF9UcmFuc2l0aW9uTW90aW9uID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9uTW90aW9uJyk7XG5cbmV4cG9ydHMuVHJhbnNpdGlvbk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfVHJhbnNpdGlvbk1vdGlvbik7XG5cbnZhciBfc3ByaW5nID0gcmVxdWlyZSgnLi9zcHJpbmcnKTtcblxuZXhwb3J0cy5zcHJpbmcgPSBfaW50ZXJvcFJlcXVpcmUoX3NwcmluZyk7XG5cbnZhciBfcHJlc2V0cyA9IHJlcXVpcmUoJy4vcHJlc2V0cycpO1xuXG5leHBvcnRzLnByZXNldHMgPSBfaW50ZXJvcFJlcXVpcmUoX3ByZXNldHMpO1xuXG4vLyBkZXByZWNhdGVkLCBkdW1teSB3YXJuaW5nIGZ1bmN0aW9uXG5cbnZhciBfcmVvcmRlcktleXMgPSByZXF1aXJlKCcuL3Jlb3JkZXJLZXlzJyk7XG5cbmV4cG9ydHMucmVvcmRlcktleXMgPSBfaW50ZXJvcFJlcXVpcmUoX3Jlb3JkZXJLZXlzKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSByZW9yZGVyS2V5cztcblxudmFyIGhhc1dhcm5lZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiByZW9yZGVyS2V5cygpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgaWYgKCFoYXNXYXJuZWQpIHtcbiAgICAgIGhhc1dhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCdgcmVvcmRlcktleXNgIGhhcyBiZWVuIHJlbW92ZWQsIHNpbmNlIGl0IGlzIG5vIGxvbmdlciBuZWVkZWQgZm9yIFRyYW5zaXRpb25Nb3Rpb25cXCdzIG5ldyBzdHlsZXMgYXJyYXkgQVBJLicpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gdXNhZ2UgYXNzdW1wdGlvbjogY3VycmVudFN0eWxlIHZhbHVlcyBoYXZlIGFscmVhZHkgYmVlbiByZW5kZXJlZCBidXQgaXQgc2F5c1xuLy8gbm90aGluZyBvZiB3aGV0aGVyIGN1cnJlbnRTdHlsZSBpcyBzdGFsZSAoc2VlIHVucmVhZFByb3BTdHlsZSlcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNob3VsZFN0b3BBbmltYXRpb247XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb24oY3VycmVudFN0eWxlLCBzdHlsZSwgY3VycmVudFZlbG9jaXR5KSB7XG4gIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIGlmICghc3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRWZWxvY2l0eVtrZXldICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlVmFsdWUgPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gICAgLy8gc3RlcHBlciB3aWxsIGhhdmUgYWxyZWFkeSB0YWtlbiBjYXJlIG9mIHJvdW5kaW5nIHByZWNpc2lvbiBlcnJvcnMsIHNvXG4gICAgLy8gd29uJ3QgaGF2ZSBzdWNoIHRoaW5nIGFzIDAuOTk5OSAhPT09IDFcbiAgICBpZiAoY3VycmVudFN0eWxlW2tleV0gIT09IHN0eWxlVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBzcHJpbmc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbnZhciBfcHJlc2V0czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVzZXRzKTtcblxudmFyIGRlZmF1bHRDb25maWcgPSBfZXh0ZW5kcyh7fSwgX3ByZXNldHMyWydkZWZhdWx0J10ubm9Xb2JibGUsIHtcbiAgcHJlY2lzaW9uOiAwLjAxXG59KTtcblxuZnVuY3Rpb24gc3ByaW5nKHZhbCwgY29uZmlnKSB7XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnLCB7IHZhbDogdmFsIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gc3RlcHBlciBpcyB1c2VkIGEgbG90LiBTYXZlcyBhbGxvY2F0aW9uIHRvIHJldHVybiB0aGUgc2FtZSBhcnJheSB3cmFwcGVyLlxuLy8gVGhpcyBpcyBmaW5lIGFuZCBkYW5nZXItZnJlZSBhZ2FpbnN0IG11dGF0aW9ucyBiZWNhdXNlIHRoZSBjYWxsc2l0ZVxuLy8gaW1tZWRpYXRlbHkgZGVzdHJ1Y3R1cmVzIGl0IGFuZCBnZXRzIHRoZSBudW1iZXJzIGluc2lkZSB3aXRob3V0IHBhc3NpbmcgdGhlXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc3RlcHBlcjtcblxudmFyIHJldXNlZFR1cGxlID0gW107XG5cbmZ1bmN0aW9uIHN0ZXBwZXIoc2Vjb25kUGVyRnJhbWUsIHgsIHYsIGRlc3RYLCBrLCBiLCBwcmVjaXNpb24pIHtcbiAgLy8gU3ByaW5nIHN0aWZmbmVzcywgaW4ga2cgLyBzXjJcblxuICAvLyBmb3IgYW5pbWF0aW9ucywgZGVzdFggaXMgcmVhbGx5IHNwcmluZyBsZW5ndGggKHNwcmluZyBhdCByZXN0KS4gaW5pdGlhbFxuICAvLyBwb3NpdGlvbiBpcyBjb25zaWRlcmVkIGFzIHRoZSBzdHJldGNoZWQvY29tcHJlc3NlZCBwb3NpdGlvbiBvZiBhIHNwcmluZ1xuICB2YXIgRnNwcmluZyA9IC1rICogKHggLSBkZXN0WCk7XG5cbiAgLy8gRGFtcGluZywgaW4ga2cgLyBzXG4gIHZhciBGZGFtcGVyID0gLWIgKiB2O1xuXG4gIC8vIHVzdWFsbHkgd2UgcHV0IG1hc3MgaGVyZSwgYnV0IGZvciBhbmltYXRpb24gcHVycG9zZXMsIHNwZWNpZnlpbmcgbWFzcyBpcyBhXG4gIC8vIGJpdCByZWR1bmRhbnQuIHlvdSBjb3VsZCBzaW1wbHkgYWRqdXN0IGsgYW5kIGIgYWNjb3JkaW5nbHlcbiAgLy8gbGV0IGEgPSAoRnNwcmluZyArIEZkYW1wZXIpIC8gbWFzcztcbiAgdmFyIGEgPSBGc3ByaW5nICsgRmRhbXBlcjtcblxuICB2YXIgbmV3ViA9IHYgKyBhICogc2Vjb25kUGVyRnJhbWU7XG4gIHZhciBuZXdYID0geCArIG5ld1YgKiBzZWNvbmRQZXJGcmFtZTtcblxuICBpZiAoTWF0aC5hYnMobmV3VikgPCBwcmVjaXNpb24gJiYgTWF0aC5hYnMobmV3WCAtIGRlc3RYKSA8IHByZWNpc2lvbikge1xuICAgIHJldXNlZFR1cGxlWzBdID0gZGVzdFg7XG4gICAgcmV1c2VkVHVwbGVbMV0gPSAwO1xuICAgIHJldHVybiByZXVzZWRUdXBsZTtcbiAgfVxuXG4gIHJldXNlZFR1cGxlWzBdID0gbmV3WDtcbiAgcmV1c2VkVHVwbGVbMV0gPSBuZXdWO1xuICByZXR1cm4gcmV1c2VkVHVwbGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG4vLyBhcnJheSByZWZlcmVuY2UgYXJvdW5kLiIsIlxuLy8gdHVybiB7eDoge3ZhbDogMSwgc3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSwgeTogMn0gZ2VuZXJhdGVkIGJ5XG4vLyBge3g6IHNwcmluZygxLCB7c3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSksIHk6IDJ9YCBpbnRvIHt4OiAxLCB5OiAyfVxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzdHJpcFN0eWxlO1xuXG5mdW5jdGlvbiBzdHJpcFN0eWxlKHN0eWxlKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyAvKmVzbGludC1kaXNhYmxlIHJlYWN0L3Byb3AtdHlwZXMgKi9cblxuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxudmFyIF9jb21wb25lbnRPckVsZW1lbnQgPSByZXF1aXJlKCdyZWFjdC1wcm9wLXR5cGVzL2xpYi9jb21wb25lbnRPckVsZW1lbnQnKTtcblxudmFyIF9jb21wb25lbnRPckVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9uZW50T3JFbGVtZW50KTtcblxudmFyIF9lbGVtZW50VHlwZSA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlJyk7XG5cbnZhciBfZWxlbWVudFR5cGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudFR5cGUpO1xuXG52YXIgX1BvcnRhbCA9IHJlcXVpcmUoJy4vUG9ydGFsJyk7XG5cbnZhciBfUG9ydGFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BvcnRhbCk7XG5cbnZhciBfTW9kYWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9Nb2RhbE1hbmFnZXInKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTW9kYWxNYW5hZ2VyKTtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi91dGlscy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxudmFyIF9hZGRFdmVudExpc3RlbmVyID0gcmVxdWlyZSgnLi91dGlscy9hZGRFdmVudExpc3RlbmVyJyk7XG5cbnZhciBfYWRkRXZlbnRMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hZGRFdmVudExpc3RlbmVyKTtcblxudmFyIF9hZGRGb2N1c0xpc3RlbmVyID0gcmVxdWlyZSgnLi91dGlscy9hZGRGb2N1c0xpc3RlbmVyJyk7XG5cbnZhciBfYWRkRm9jdXNMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hZGRGb2N1c0xpc3RlbmVyKTtcblxudmFyIF9pbkRPTSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3V0aWwvaW5ET00nKTtcblxudmFyIF9pbkRPTTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbkRPTSk7XG5cbnZhciBfYWN0aXZlRWxlbWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2FjdGl2ZUVsZW1lbnQnKTtcblxudmFyIF9hY3RpdmVFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FjdGl2ZUVsZW1lbnQpO1xuXG52YXIgX2NvbnRhaW5zID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvcXVlcnkvY29udGFpbnMnKTtcblxudmFyIF9jb250YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb250YWlucyk7XG5cbnZhciBfZ2V0Q29udGFpbmVyID0gcmVxdWlyZSgnLi91dGlscy9nZXRDb250YWluZXInKTtcblxudmFyIF9nZXRDb250YWluZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0Q29udGFpbmVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIG1vZGFsTWFuYWdlciA9IG5ldyBfTW9kYWxNYW5hZ2VyMi5kZWZhdWx0KCk7XG5cbi8qKlxuICogTG92ZSB0aGVtIG9yIGhhdGUgdGhlbSwgYDxNb2RhbC8+YCBwcm92aWRlcyBhIHNvbGlkIGZvdW5kYXRpb24gZm9yIGNyZWF0aW5nIGRpYWxvZ3MsIGxpZ2h0Ym94ZXMsIG9yIHdoYXRldmVyIGVsc2UuXG4gKiBUaGUgTW9kYWwgY29tcG9uZW50IHJlbmRlcnMgaXRzIGBjaGlsZHJlbmAgbm9kZSBpbiBmcm9udCBvZiBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAqXG4gKiBUaGUgTW9kYWwgb2ZmZXJzIGEgZmV3IGhlbHBmdWwgZmVhdHVyZXMgb3ZlciB1c2luZyBqdXN0IGEgYDxQb3J0YWwvPmAgY29tcG9uZW50IGFuZCBzb21lIHN0eWxlczpcbiAqXG4gKiAtIE1hbmFnZXMgZGlhbG9nIHN0YWNraW5nIHdoZW4gb25lLWF0LWEtdGltZSBqdXN0IGlzbid0IGVub3VnaC5cbiAqIC0gQ3JlYXRlcyBhIGJhY2tkcm9wLCBmb3IgZGlzYWJsaW5nIGludGVyYWN0aW9uIGJlbG93IHRoZSBtb2RhbC5cbiAqIC0gSXQgcHJvcGVybHkgbWFuYWdlcyBmb2N1czsgbW92aW5nIHRvIHRoZSBtb2RhbCBjb250ZW50LCBhbmQga2VlcGluZyBpdCB0aGVyZSB1bnRpbCB0aGUgbW9kYWwgaXMgY2xvc2VkLlxuICogLSBJdCBkaXNhYmxlcyBzY3JvbGxpbmcgb2YgdGhlIHBhZ2UgY29udGVudCB3aGlsZSBvcGVuLlxuICogLSBBZGRzIHRoZSBhcHByb3ByaWF0ZSBBUklBIHJvbGVzIGFyZSBhdXRvbWF0aWNhbGx5LlxuICogLSBFYXNpbHkgcGx1Z2dhYmxlIGFuaW1hdGlvbnMgdmlhIGEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudC5cbiAqXG4gKiBOb3RlIHRoYXQsIGluIHRoZSBzYW1lIHdheSB0aGUgYmFja2Ryb3AgZWxlbWVudCBwcmV2ZW50cyB1c2VycyBmcm9tIGNsaWNraW5nIG9yIGludGVyYWN0aW5nXG4gKiB3aXRoIHRoZSBwYWdlIGNvbnRlbnQgdW5kZXJuZWF0aCB0aGUgTW9kYWwsIFNjcmVlbiByZWFkZXJzIGFsc28gbmVlZCB0byBiZSBzaWduYWxlZCB0byBub3QgdG9cbiAqIGludGVyYWN0IHdpdGggcGFnZSBjb250ZW50IHdoaWxlIHRoZSBNb2RhbCBpcyBvcGVuLiBUbyBkbyB0aGlzLCB3ZSB1c2UgYSBjb21tb24gdGVjaG5pcXVlIG9mIGFwcGx5aW5nXG4gKiB0aGUgYGFyaWEtaGlkZGVuPSd0cnVlJ2AgYXR0cmlidXRlIHRvIHRoZSBub24tTW9kYWwgZWxlbWVudHMgaW4gdGhlIE1vZGFsIGBjb250YWluZXJgLiBUaGlzIG1lYW5zIHRoYXQgZm9yXG4gKiBhIE1vZGFsIHRvIGJlIHRydWx5IG1vZGFsLCBpdCBzaG91bGQgaGF2ZSBhIGBjb250YWluZXJgIHRoYXQgaXMgX291dHNpZGVfIHlvdXIgYXBwJ3NcbiAqIFJlYWN0IGhpZXJhcmNoeSAoc3VjaCBhcyB0aGUgZGVmYXVsdDogZG9jdW1lbnQuYm9keSkuXG4gKi9cbnZhciBNb2RhbCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW9kYWwnLFxuXG5cbiAgcHJvcFR5cGVzOiBfZXh0ZW5kcyh7fSwgX1BvcnRhbDIuZGVmYXVsdC5wcm9wVHlwZXMsIHtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgTW9kYWxcbiAgICAgKi9cbiAgICBzaG93OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIE5vZGUsIENvbXBvbmVudCBpbnN0YW5jZSwgb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGVpdGhlci4gVGhlIE1vZGFsIGlzIGFwcGVuZGVkIHRvIGl0J3MgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBGb3IgdGhlIHNha2Ugb2YgYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgdGhlIGNvbnRhaW5lciBzaG91bGQgdXN1YWxseSBiZSB0aGUgZG9jdW1lbnQgYm9keSwgc28gdGhhdCB0aGUgcmVzdCBvZiB0aGVcbiAgICAgKiBwYWdlIGNvbnRlbnQgY2FuIGJlIHBsYWNlZCBiZWhpbmQgYSB2aXJ0dWFsIGJhY2tkcm9wIGFzIHdlbGwgYXMgYSB2aXN1YWwgb25lLlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19jb21wb25lbnRPckVsZW1lbnQyLmRlZmF1bHQsIF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuY10pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBNb2RhbCBpcyBvcGVuaW5nLlxuICAgICAqL1xuICAgIG9uU2hvdzogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIGVpdGhlciB0aGUgYmFja2Ryb3AgaXMgY2xpY2tlZCwgb3IgdGhlIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAgICAgKlxuICAgICAqIFRoZSBgb25IaWRlYCBjYWxsYmFjayBvbmx5IHNpZ25hbHMgaW50ZW50IGZyb20gdGhlIE1vZGFsLFxuICAgICAqIHlvdSBtdXN0IGFjdHVhbGx5IHNldCB0aGUgYHNob3dgIHByb3AgdG8gYGZhbHNlYCBmb3IgdGhlIE1vZGFsIHRvIGNsb3NlLlxuICAgICAqL1xuICAgIG9uSGlkZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogSW5jbHVkZSBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCwgX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZihbJ3N0YXRpYyddKV0pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBlc2NhcGUga2V5LCBpZiBzcGVjaWZpZWQgaW4gYGtleWJvYXJkYCwgaXMgcHJlc3NlZC5cbiAgICAgKi9cbiAgICBvbkVzY2FwZUtleVVwOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGJhY2tkcm9wLCBpZiBzcGVjaWZpZWQsIGlzIGNsaWNrZWQuXG4gICAgICovXG4gICAgb25CYWNrZHJvcENsaWNrOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIHN0eWxlIG9iamVjdCBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcFN0eWxlOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8qKlxuICAgICAqIEEgY3NzIGNsYXNzIG9yIGNsYXNzZXMgZm9yIHRoZSBiYWNrZHJvcCBjb21wb25lbnQuXG4gICAgICovXG4gICAgYmFja2Ryb3BDbGFzc05hbWU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3Igc2V0IG9mIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgbW9kYWwgY29udGFpbmVyIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4sXG4gICAgICogYW5kIHJlbW92ZWQgd2hlbiBpdCBpcyBjbG9zZWQuXG4gICAgICovXG4gICAgY29udGFpbmVyQ2xhc3NOYW1lOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZFxuICAgICAqL1xuICAgIGtleWJvYXJkOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIGA8VHJhbnNpdGlvbi8+YCBjb21wb25lbnQgdG8gdXNlIGZvciB0aGUgZGlhbG9nIGFuZCBiYWNrZHJvcCBjb21wb25lbnRzLlxuICAgICAqL1xuICAgIHRyYW5zaXRpb246IF9lbGVtZW50VHlwZTIuZGVmYXVsdCxcblxuICAgIC8qKlxuICAgICAqIFRoZSBgdGltZW91dGAgb2YgdGhlIGRpYWxvZyB0cmFuc2l0aW9uIGlmIHNwZWNpZmllZC4gVGhpcyBudW1iZXIgaXMgdXNlZCB0byBlbnN1cmUgdGhhdFxuICAgICAqIHRyYW5zaXRpb24gY2FsbGJhY2tzIGFyZSBhbHdheXMgZmlyZWQsIGV2ZW4gaWYgYnJvd3NlciB0cmFuc2l0aW9uIGV2ZW50cyBhcmUgY2FuY2VsZWQuXG4gICAgICpcbiAgICAgKiBTZWUgdGhlIFRyYW5zaXRpb24gYHRpbWVvdXRgIHByb3AgZm9yIG1vcmUgaW5mb21hdGlvbi5cbiAgICAgKi9cbiAgICBkaWFsb2dUcmFuc2l0aW9uVGltZW91dDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYHRpbWVvdXRgIG9mIHRoZSBiYWNrZHJvcCB0cmFuc2l0aW9uIGlmIHNwZWNpZmllZC4gVGhpcyBudW1iZXIgaXMgdXNlZCB0b1xuICAgICAqIGVuc3VyZSB0aGF0IHRyYW5zaXRpb24gY2FsbGJhY2tzIGFyZSBhbHdheXMgZmlyZWQsIGV2ZW4gaWYgYnJvd3NlciB0cmFuc2l0aW9uIGV2ZW50cyBhcmUgY2FuY2VsZWQuXG4gICAgICpcbiAgICAgKiBTZWUgdGhlIFRyYW5zaXRpb24gYHRpbWVvdXRgIHByb3AgZm9yIG1vcmUgaW5mb21hdGlvbi5cbiAgICAgKi9cbiAgICBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYHRydWVgIFRoZSBtb2RhbCB3aWxsIGF1dG9tYXRpY2FsbHkgc2hpZnQgZm9jdXMgdG8gaXRzZWxmIHdoZW4gaXQgb3BlbnMsIGFuZFxuICAgICAqIHJlcGxhY2UgaXQgdG8gdGhlIGxhc3QgZm9jdXNlZCBlbGVtZW50IHdoZW4gaXQgY2xvc2VzLiBUaGlzIGFsc29cbiAgICAgKiB3b3JrcyBjb3JyZWN0bHkgd2l0aCBhbnkgTW9kYWwgY2hpbGRyZW4gdGhhdCBoYXZlIHRoZSBgYXV0b0ZvY3VzYCBwcm9wLlxuICAgICAqXG4gICAgICogR2VuZXJhbGx5IHRoaXMgc2hvdWxkIG5ldmVyIGJlIHNldCB0byBgZmFsc2VgIGFzIGl0IG1ha2VzIHRoZSBNb2RhbCBsZXNzXG4gICAgICogYWNjZXNzaWJsZSB0byBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCBsaWtlIHNjcmVlbiByZWFkZXJzLlxuICAgICAqL1xuICAgIGF1dG9Gb2N1czogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBgdHJ1ZWAgVGhlIG1vZGFsIHdpbGwgcHJldmVudCBmb2N1cyBmcm9tIGxlYXZpbmcgdGhlIE1vZGFsIHdoaWxlIG9wZW4uXG4gICAgICpcbiAgICAgKiBHZW5lcmFsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgc2V0IHRvIGBmYWxzZWAgYXMgaXQgbWFrZXMgdGhlIE1vZGFsIGxlc3NcbiAgICAgKiBhY2Nlc3NpYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGxpa2Ugc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgZW5mb3JjZUZvY3VzOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBiZWZvcmUgdGhlIE1vZGFsIHRyYW5zaXRpb25zIGluXG4gICAgICovXG4gICAgb25FbnRlcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYXMgdGhlIE1vZGFsIGJlZ2lucyB0byB0cmFuc2l0aW9uIGluXG4gICAgICovXG4gICAgb25FbnRlcmluZzogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYWZ0ZXIgdGhlIE1vZGFsIGZpbmlzaGVzIHRyYW5zaXRpb25pbmcgaW5cbiAgICAgKi9cbiAgICBvbkVudGVyZWQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIHJpZ2h0IGJlZm9yZSB0aGUgTW9kYWwgdHJhbnNpdGlvbnMgb3V0XG4gICAgICovXG4gICAgb25FeGl0OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhcyB0aGUgTW9kYWwgYmVnaW5zIHRvIHRyYW5zaXRpb24gb3V0XG4gICAgICovXG4gICAgb25FeGl0aW5nOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgTW9kYWwgZmluaXNoZXMgdHJhbnNpdGlvbmluZyBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXRlZDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jXG5cbiAgfSksXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2hvdzogZmFsc2UsXG4gICAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgYXV0b0ZvY3VzOiB0cnVlLFxuICAgICAgZW5mb3JjZUZvY3VzOiB0cnVlLFxuICAgICAgb25IaWRlOiBub29wXG4gICAgfTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHsgZXhpdGVkOiAhdGhpcy5wcm9wcy5zaG93IH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBzaG93ID0gX3Byb3BzLnNob3c7XG4gICAgdmFyIGNvbnRhaW5lciA9IF9wcm9wcy5jb250YWluZXI7XG4gICAgdmFyIGNoaWxkcmVuID0gX3Byb3BzLmNoaWxkcmVuO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzLnRyYW5zaXRpb247XG4gICAgdmFyIGJhY2tkcm9wID0gX3Byb3BzLmJhY2tkcm9wO1xuICAgIHZhciBkaWFsb2dUcmFuc2l0aW9uVGltZW91dCA9IF9wcm9wcy5kaWFsb2dUcmFuc2l0aW9uVGltZW91dDtcbiAgICB2YXIgY2xhc3NOYW1lID0gX3Byb3BzLmNsYXNzTmFtZTtcbiAgICB2YXIgc3R5bGUgPSBfcHJvcHMuc3R5bGU7XG4gICAgdmFyIG9uRXhpdCA9IF9wcm9wcy5vbkV4aXQ7XG4gICAgdmFyIG9uRXhpdGluZyA9IF9wcm9wcy5vbkV4aXRpbmc7XG4gICAgdmFyIG9uRW50ZXIgPSBfcHJvcHMub25FbnRlcjtcbiAgICB2YXIgb25FbnRlcmluZyA9IF9wcm9wcy5vbkVudGVyaW5nO1xuICAgIHZhciBvbkVudGVyZWQgPSBfcHJvcHMub25FbnRlcmVkO1xuXG5cbiAgICB2YXIgZGlhbG9nID0gX3JlYWN0Mi5kZWZhdWx0LkNoaWxkcmVuLm9ubHkoY2hpbGRyZW4pO1xuXG4gICAgdmFyIG1vdW50TW9kYWwgPSBzaG93IHx8IFRyYW5zaXRpb24gJiYgIXRoaXMuc3RhdGUuZXhpdGVkO1xuICAgIGlmICghbW91bnRNb2RhbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIF9kaWFsb2ckcHJvcHMgPSBkaWFsb2cucHJvcHM7XG4gICAgdmFyIHJvbGUgPSBfZGlhbG9nJHByb3BzLnJvbGU7XG4gICAgdmFyIHRhYkluZGV4ID0gX2RpYWxvZyRwcm9wcy50YWJJbmRleDtcblxuXG4gICAgaWYgKHJvbGUgPT09IHVuZGVmaW5lZCB8fCB0YWJJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkaWFsb2cgPSAoMCwgX3JlYWN0LmNsb25lRWxlbWVudCkoZGlhbG9nLCB7XG4gICAgICAgIHJvbGU6IHJvbGUgPT09IHVuZGVmaW5lZCA/ICdkb2N1bWVudCcgOiByb2xlLFxuICAgICAgICB0YWJJbmRleDogdGFiSW5kZXggPT0gbnVsbCA/ICctMScgOiB0YWJJbmRleFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKFRyYW5zaXRpb24pIHtcbiAgICAgIGRpYWxvZyA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBUcmFuc2l0aW9uLFxuICAgICAgICB7XG4gICAgICAgICAgdHJhbnNpdGlvbkFwcGVhcjogdHJ1ZSxcbiAgICAgICAgICB1bm1vdW50T25FeGl0OiB0cnVlLFxuICAgICAgICAgICdpbic6IHNob3csXG4gICAgICAgICAgdGltZW91dDogZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQsXG4gICAgICAgICAgb25FeGl0OiBvbkV4aXQsXG4gICAgICAgICAgb25FeGl0aW5nOiBvbkV4aXRpbmcsXG4gICAgICAgICAgb25FeGl0ZWQ6IHRoaXMuaGFuZGxlSGlkZGVuLFxuICAgICAgICAgIG9uRW50ZXI6IG9uRW50ZXIsXG4gICAgICAgICAgb25FbnRlcmluZzogb25FbnRlcmluZyxcbiAgICAgICAgICBvbkVudGVyZWQ6IG9uRW50ZXJlZFxuICAgICAgICB9LFxuICAgICAgICBkaWFsb2dcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgX1BvcnRhbDIuZGVmYXVsdCxcbiAgICAgIHtcbiAgICAgICAgcmVmOiB0aGlzLnNldE1vdW50Tm9kZSxcbiAgICAgICAgY29udGFpbmVyOiBjb250YWluZXJcbiAgICAgIH0sXG4gICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICByZWY6ICdtb2RhbCcsXG4gICAgICAgICAgcm9sZTogcm9sZSB8fCAnZGlhbG9nJyxcbiAgICAgICAgICBzdHlsZTogc3R5bGUsXG4gICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWVcbiAgICAgICAgfSxcbiAgICAgICAgYmFja2Ryb3AgJiYgdGhpcy5yZW5kZXJCYWNrZHJvcCgpLFxuICAgICAgICBkaWFsb2dcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXJCYWNrZHJvcDogZnVuY3Rpb24gcmVuZGVyQmFja2Ryb3AoKSB7XG4gICAgdmFyIF9wcm9wczIgPSB0aGlzLnByb3BzO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzMi50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0ID0gX3Byb3BzMi5iYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0O1xuXG5cbiAgICB2YXIgYmFja2Ryb3AgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgeyByZWY6ICdiYWNrZHJvcCcsXG4gICAgICBzdHlsZTogdGhpcy5wcm9wcy5iYWNrZHJvcFN0eWxlLFxuICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmJhY2tkcm9wQ2xhc3NOYW1lLFxuICAgICAgb25DbGljazogdGhpcy5oYW5kbGVCYWNrZHJvcENsaWNrXG4gICAgfSk7XG5cbiAgICBpZiAoVHJhbnNpdGlvbikge1xuICAgICAgYmFja2Ryb3AgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgVHJhbnNpdGlvbixcbiAgICAgICAgeyB0cmFuc2l0aW9uQXBwZWFyOiB0cnVlLFxuICAgICAgICAgICdpbic6IHRoaXMucHJvcHMuc2hvdyxcbiAgICAgICAgICB0aW1lb3V0OiBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0XG4gICAgICAgIH0sXG4gICAgICAgIGJhY2tkcm9wXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBiYWNrZHJvcDtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IGZhbHNlIH0pO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy50cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgbGV0IGhhbmRsZUhpZGRlbiB0YWtlIGNhcmUgb2YgbWFya2luZyBleGl0ZWQuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiB0cnVlIH0pO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2hvdyAmJiBuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5jaGVja0ZvckZvY3VzKCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcy5wcm9wcy50cmFuc2l0aW9uO1xuXG5cbiAgICBpZiAocHJldlByb3BzLnNob3cgJiYgIXRoaXMucHJvcHMuc2hvdyAmJiAhdHJhbnNpdGlvbikge1xuICAgICAgLy8gT3RoZXJ3aXNlIGhhbmRsZUhpZGRlbiB3aWxsIGNhbGwgdGhpcy5cbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIGlmICghcHJldlByb3BzLnNob3cgJiYgdGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHZhciBfcHJvcHMzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgc2hvdyA9IF9wcm9wczMuc2hvdztcbiAgICB2YXIgdHJhbnNpdGlvbiA9IF9wcm9wczMudHJhbnNpdGlvbjtcblxuXG4gICAgaWYgKHNob3cgfHwgdHJhbnNpdGlvbiAmJiAhdGhpcy5zdGF0ZS5leGl0ZWQpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygpIHtcbiAgICB2YXIgZG9jID0gKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKTtcbiAgICB2YXIgY29udGFpbmVyID0gKDAsIF9nZXRDb250YWluZXIyLmRlZmF1bHQpKHRoaXMucHJvcHMuY29udGFpbmVyLCBkb2MuYm9keSk7XG5cbiAgICBtb2RhbE1hbmFnZXIuYWRkKHRoaXMsIGNvbnRhaW5lciwgdGhpcy5wcm9wcy5jb250YWluZXJDbGFzc05hbWUpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIgPSAoMCwgX2FkZEV2ZW50TGlzdGVuZXIyLmRlZmF1bHQpKGRvYywgJ2tleXVwJywgdGhpcy5oYW5kbGVEb2N1bWVudEtleVVwKTtcblxuICAgIHRoaXMuX29uRm9jdXNpbkxpc3RlbmVyID0gKDAsIF9hZGRGb2N1c0xpc3RlbmVyMi5kZWZhdWx0KSh0aGlzLmVuZm9yY2VGb2N1cyk7XG5cbiAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblNob3cpIHtcbiAgICAgIHRoaXMucHJvcHMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHtcbiAgICBtb2RhbE1hbmFnZXIucmVtb3ZlKHRoaXMpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMucmVzdG9yZUxhc3RGb2N1cygpO1xuICB9LFxuICBzZXRNb3VudE5vZGU6IGZ1bmN0aW9uIHNldE1vdW50Tm9kZShyZWYpIHtcbiAgICB0aGlzLm1vdW50Tm9kZSA9IHJlZiA/IHJlZi5nZXRNb3VudE5vZGUoKSA6IHJlZjtcbiAgfSxcbiAgaGFuZGxlSGlkZGVuOiBmdW5jdGlvbiBoYW5kbGVIaWRkZW4oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogdHJ1ZSB9KTtcbiAgICB0aGlzLm9uSGlkZSgpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25FeGl0ZWQpIHtcbiAgICAgIHZhciBfcHJvcHM0O1xuXG4gICAgICAoX3Byb3BzNCA9IHRoaXMucHJvcHMpLm9uRXhpdGVkLmFwcGx5KF9wcm9wczQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVCYWNrZHJvcENsaWNrOiBmdW5jdGlvbiBoYW5kbGVCYWNrZHJvcENsaWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5vbkJhY2tkcm9wQ2xpY2soZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYmFja2Ryb3AgPT09IHRydWUpIHtcbiAgICAgIHRoaXMucHJvcHMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVEb2N1bWVudEtleVVwOiBmdW5jdGlvbiBoYW5kbGVEb2N1bWVudEtleVVwKGUpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5rZXlib2FyZCAmJiBlLmtleUNvZGUgPT09IDI3ICYmIHRoaXMuaXNUb3BNb2RhbCgpKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkVzY2FwZUtleVVwKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25Fc2NhcGVLZXlVcChlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuICBjaGVja0ZvckZvY3VzOiBmdW5jdGlvbiBjaGVja0ZvckZvY3VzKCkge1xuICAgIGlmIChfaW5ET00yLmRlZmF1bHQpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gKDAsIF9hY3RpdmVFbGVtZW50Mi5kZWZhdWx0KSgpO1xuICAgIH1cbiAgfSxcbiAgZm9jdXM6IGZ1bmN0aW9uIGZvY3VzKCkge1xuICAgIHZhciBhdXRvRm9jdXMgPSB0aGlzLnByb3BzLmF1dG9Gb2N1cztcbiAgICB2YXIgbW9kYWxDb250ZW50ID0gdGhpcy5nZXREaWFsb2dFbGVtZW50KCk7XG4gICAgdmFyIGN1cnJlbnQgPSAoMCwgX2FjdGl2ZUVsZW1lbnQyLmRlZmF1bHQpKCgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykpO1xuICAgIHZhciBmb2N1c0luTW9kYWwgPSBjdXJyZW50ICYmICgwLCBfY29udGFpbnMyLmRlZmF1bHQpKG1vZGFsQ29udGVudCwgY3VycmVudCk7XG5cbiAgICBpZiAobW9kYWxDb250ZW50ICYmIGF1dG9Gb2N1cyAmJiAhZm9jdXNJbk1vZGFsKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cyA9IGN1cnJlbnQ7XG5cbiAgICAgIGlmICghbW9kYWxDb250ZW50Lmhhc0F0dHJpYnV0ZSgndGFiSW5kZXgnKSkge1xuICAgICAgICBtb2RhbENvbnRlbnQuc2V0QXR0cmlidXRlKCd0YWJJbmRleCcsIC0xKTtcbiAgICAgICAgKDAsIF93YXJuaW5nMi5kZWZhdWx0KShmYWxzZSwgJ1RoZSBtb2RhbCBjb250ZW50IG5vZGUgZG9lcyBub3QgYWNjZXB0IGZvY3VzLiAnICsgJ0ZvciB0aGUgYmVuZWZpdCBvZiBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCB0aGUgdGFiSW5kZXggb2YgdGhlIG5vZGUgaXMgYmVpbmcgc2V0IHRvIFwiLTFcIi4nKTtcbiAgICAgIH1cblxuICAgICAgbW9kYWxDb250ZW50LmZvY3VzKCk7XG4gICAgfVxuICB9LFxuICByZXN0b3JlTGFzdEZvY3VzOiBmdW5jdGlvbiByZXN0b3JlTGFzdEZvY3VzKCkge1xuICAgIC8vIFN1cHBvcnQ6IDw9SUUxMSBkb2Vzbid0IHN1cHBvcnQgYGZvY3VzKClgIG9uIHN2ZyBlbGVtZW50cyAoUkI6ICM5MTcpXG4gICAgaWYgKHRoaXMubGFzdEZvY3VzICYmIHRoaXMubGFzdEZvY3VzLmZvY3VzKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cy5mb2N1cygpO1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgZW5mb3JjZUZvY3VzOiBmdW5jdGlvbiBlbmZvcmNlRm9jdXMoKSB7XG4gICAgdmFyIGVuZm9yY2VGb2N1cyA9IHRoaXMucHJvcHMuZW5mb3JjZUZvY3VzO1xuXG5cbiAgICBpZiAoIWVuZm9yY2VGb2N1cyB8fCAhdGhpcy5pc01vdW50ZWQoKSB8fCAhdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWN0aXZlID0gKDAsIF9hY3RpdmVFbGVtZW50Mi5kZWZhdWx0KSgoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpKTtcbiAgICB2YXIgbW9kYWwgPSB0aGlzLmdldERpYWxvZ0VsZW1lbnQoKTtcblxuICAgIGlmIChtb2RhbCAmJiBtb2RhbCAhPT0gYWN0aXZlICYmICEoMCwgX2NvbnRhaW5zMi5kZWZhdWx0KShtb2RhbCwgYWN0aXZlKSkge1xuICAgICAgbW9kYWwuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cblxuICAvL2luc3RlYWQgb2YgYSByZWYsIHdoaWNoIG1pZ2h0IGNvbmZsaWN0IHdpdGggb25lIHRoZSBwYXJlbnQgYXBwbGllZC5cbiAgZ2V0RGlhbG9nRWxlbWVudDogZnVuY3Rpb24gZ2V0RGlhbG9nRWxlbWVudCgpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMucmVmcy5tb2RhbDtcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLmxhc3RDaGlsZDtcbiAgfSxcbiAgaXNUb3BNb2RhbDogZnVuY3Rpb24gaXNUb3BNb2RhbCgpIHtcbiAgICByZXR1cm4gbW9kYWxNYW5hZ2VyLmlzVG9wTW9kYWwodGhpcyk7XG4gIH1cbn0pO1xuXG5Nb2RhbC5tYW5hZ2VyID0gbW9kYWxNYW5hZ2VyO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBNb2RhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9zdHlsZSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3N0eWxlJyk7XG5cbnZhciBfc3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3R5bGUpO1xuXG52YXIgX2NsYXNzID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvY2xhc3MnKTtcblxudmFyIF9jbGFzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzcyk7XG5cbnZhciBfc2Nyb2xsYmFyU2l6ZSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZScpO1xuXG52YXIgX3Njcm9sbGJhclNpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsYmFyU2l6ZSk7XG5cbnZhciBfaXNPdmVyZmxvd2luZyA9IHJlcXVpcmUoJy4vdXRpbHMvaXNPdmVyZmxvd2luZycpO1xuXG52YXIgX2lzT3ZlcmZsb3dpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNPdmVyZmxvd2luZyk7XG5cbnZhciBfbWFuYWdlQXJpYUhpZGRlbiA9IHJlcXVpcmUoJy4vdXRpbHMvbWFuYWdlQXJpYUhpZGRlbicpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBmaW5kSW5kZXhPZihhcnIsIGNiKSB7XG4gIHZhciBpZHggPSAtMTtcbiAgYXJyLnNvbWUoZnVuY3Rpb24gKGQsIGkpIHtcbiAgICBpZiAoY2IoZCwgaSkpIHtcbiAgICAgIGlkeCA9IGk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gaWR4O1xufVxuXG5mdW5jdGlvbiBmaW5kQ29udGFpbmVyKGRhdGEsIG1vZGFsKSB7XG4gIHJldHVybiBmaW5kSW5kZXhPZihkYXRhLCBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkLm1vZGFscy5pbmRleE9mKG1vZGFsKSAhPT0gLTE7XG4gIH0pO1xufVxuXG4vKipcbiAqIFByb3BlciBzdGF0ZSBtYW5hZ21lbnQgZm9yIGNvbnRhaW5lcnMgYW5kIHRoZSBtb2RhbHMgaW4gdGhvc2UgY29udGFpbmVycy5cbiAqXG4gKiBAaW50ZXJuYWwgVXNlZCBieSB0aGUgTW9kYWwgdG8gZW5zdXJlIHByb3BlciBzdHlsaW5nIG9mIGNvbnRhaW5lcnMuXG4gKi9cblxudmFyIE1vZGFsTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTW9kYWxNYW5hZ2VyKCkge1xuICAgIHZhciBoaWRlU2libGluZ05vZGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1swXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNb2RhbE1hbmFnZXIpO1xuXG4gICAgdGhpcy5oaWRlU2libGluZ05vZGVzID0gaGlkZVNpYmxpbmdOb2RlcztcbiAgICB0aGlzLm1vZGFscyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IFtdO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1vZGFsTWFuYWdlciwgW3tcbiAgICBrZXk6ICdhZGQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQobW9kYWwsIGNvbnRhaW5lciwgY2xhc3NOYW1lKSB7XG4gICAgICB2YXIgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5pbmRleE9mKG1vZGFsKTtcbiAgICAgIHZhciBjb250YWluZXJJZHggPSB0aGlzLmNvbnRhaW5lcnMuaW5kZXhPZihjb250YWluZXIpO1xuXG4gICAgICBpZiAobW9kYWxJZHggIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICAgIH1cblxuICAgICAgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5sZW5ndGg7XG4gICAgICB0aGlzLm1vZGFscy5wdXNoKG1vZGFsKTtcblxuICAgICAgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgICAoMCwgX21hbmFnZUFyaWFIaWRkZW4uaGlkZVNpYmxpbmdzKShjb250YWluZXIsIG1vZGFsLm1vdW50Tm9kZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250YWluZXJJZHggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuZGF0YVtjb250YWluZXJJZHhdLm1vZGFscy5wdXNoKG1vZGFsKTtcbiAgICAgICAgcmV0dXJuIG1vZGFsSWR4O1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbW9kYWxzOiBbbW9kYWxdLFxuICAgICAgICAvL3JpZ2h0IG5vdyBvbmx5IHRoZSBmaXJzdCBtb2RhbCBvZiBhIGNvbnRhaW5lciB3aWxsIGhhdmUgaXRzIGNsYXNzZXMgYXBwbGllZFxuICAgICAgICBjbGFzc2VzOiBjbGFzc05hbWUgPyBjbGFzc05hbWUuc3BsaXQoL1xccysvKSA6IFtdLFxuICAgICAgICAvL3dlIGFyZSBvbmx5IGludGVyZXN0ZWQgaW4gdGhlIGFjdHVhbCBgc3R5bGVgIGhlcmUgYmVjYXN1ZSB3ZSB3aWxsIG92ZXJyaWRlIGl0XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgb3ZlcmZsb3c6IGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvdyxcbiAgICAgICAgICBwYWRkaW5nUmlnaHQ6IGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nUmlnaHRcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHN0eWxlID0geyBvdmVyZmxvdzogJ2hpZGRlbicgfTtcblxuICAgICAgZGF0YS5vdmVyZmxvd2luZyA9ICgwLCBfaXNPdmVyZmxvd2luZzIuZGVmYXVsdCkoY29udGFpbmVyKTtcblxuICAgICAgaWYgKGRhdGEub3ZlcmZsb3dpbmcpIHtcbiAgICAgICAgLy8gdXNlIGNvbXB1dGVkIHN0eWxlLCBoZXJlIHRvIGdldCB0aGUgcmVhbCBwYWRkaW5nXG4gICAgICAgIC8vIHRvIGFkZCBvdXIgc2Nyb2xsYmFyIHdpZHRoXG4gICAgICAgIHN0eWxlLnBhZGRpbmdSaWdodCA9IHBhcnNlSW50KCgwLCBfc3R5bGUyLmRlZmF1bHQpKGNvbnRhaW5lciwgJ3BhZGRpbmdSaWdodCcpIHx8IDAsIDEwKSArICgwLCBfc2Nyb2xsYmFyU2l6ZTIuZGVmYXVsdCkoKSArICdweCc7XG4gICAgICB9XG5cbiAgICAgICgwLCBfc3R5bGUyLmRlZmF1bHQpKGNvbnRhaW5lciwgc3R5bGUpO1xuXG4gICAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaChfY2xhc3MyLmRlZmF1bHQuYWRkQ2xhc3MuYmluZChudWxsLCBjb250YWluZXIpKTtcblxuICAgICAgdGhpcy5jb250YWluZXJzLnB1c2goY29udGFpbmVyKTtcbiAgICAgIHRoaXMuZGF0YS5wdXNoKGRhdGEpO1xuXG4gICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVtb3ZlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKG1vZGFsKSB7XG4gICAgICB2YXIgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5pbmRleE9mKG1vZGFsKTtcblxuICAgICAgaWYgKG1vZGFsSWR4ID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250YWluZXJJZHggPSBmaW5kQ29udGFpbmVyKHRoaXMuZGF0YSwgbW9kYWwpO1xuICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGFbY29udGFpbmVySWR4XTtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbY29udGFpbmVySWR4XTtcblxuICAgICAgZGF0YS5tb2RhbHMuc3BsaWNlKGRhdGEubW9kYWxzLmluZGV4T2YobW9kYWwpLCAxKTtcblxuICAgICAgdGhpcy5tb2RhbHMuc3BsaWNlKG1vZGFsSWR4LCAxKTtcblxuICAgICAgLy8gaWYgdGhhdCB3YXMgdGhlIGxhc3QgbW9kYWwgaW4gYSBjb250YWluZXIsXG4gICAgICAvLyBjbGVhbiB1cCB0aGUgY29udGFpbmVyIHN0eWxpbmhnLlxuICAgICAgaWYgKGRhdGEubW9kYWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLnN0eWxlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gY29udGFpbmVyLnN0eWxlW2tleV0gPSBkYXRhLnN0eWxlW2tleV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKF9jbGFzczIuZGVmYXVsdC5yZW1vdmVDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgICAgIGlmICh0aGlzLmhpZGVTaWJsaW5nTm9kZXMpIHtcbiAgICAgICAgICAoMCwgX21hbmFnZUFyaWFIaWRkZW4uc2hvd1NpYmxpbmdzKShjb250YWluZXIsIG1vZGFsLm1vdW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJzLnNwbGljZShjb250YWluZXJJZHgsIDEpO1xuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKGNvbnRhaW5lcklkeCwgMSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgICAvL290aGVyd2lzZSBtYWtlIHN1cmUgdGhlIG5leHQgdG9wIG1vZGFsIGlzIHZpc2libGUgdG8gYSBTUlxuICAgICAgICAoMCwgX21hbmFnZUFyaWFIaWRkZW4uYXJpYUhpZGRlbikoZmFsc2UsIGRhdGEubW9kYWxzW2RhdGEubW9kYWxzLmxlbmd0aCAtIDFdLm1vdW50Tm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaXNUb3BNb2RhbCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzVG9wTW9kYWwobW9kYWwpIHtcbiAgICAgIHJldHVybiAhIXRoaXMubW9kYWxzLmxlbmd0aCAmJiB0aGlzLm1vZGFsc1t0aGlzLm1vZGFscy5sZW5ndGggLSAxXSA9PT0gbW9kYWw7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1vZGFsTWFuYWdlcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gTW9kYWxNYW5hZ2VyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudCA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL2NvbXBvbmVudE9yRWxlbWVudCcpO1xuXG52YXIgX2NvbXBvbmVudE9yRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb25lbnRPckVsZW1lbnQpO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG52YXIgX2dldENvbnRhaW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvZ2V0Q29udGFpbmVyJyk7XG5cbnZhciBfZ2V0Q29udGFpbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldENvbnRhaW5lcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogVGhlIGA8UG9ydGFsLz5gIGNvbXBvbmVudCByZW5kZXJzIGl0cyBjaGlsZHJlbiBpbnRvIGEgbmV3IFwic3VidHJlZVwiIG91dHNpZGUgb2YgY3VycmVudCBjb21wb25lbnQgaGllcmFyY2h5LlxuICogWW91IGNhbiB0aGluayBvZiBpdCBhcyBhIGRlY2xhcmF0aXZlIGBhcHBlbmRDaGlsZCgpYCwgb3IgalF1ZXJ5J3MgYCQuZm4uYXBwZW5kVG8oKWAuXG4gKiBUaGUgY2hpbGRyZW4gb2YgYDxQb3J0YWwvPmAgY29tcG9uZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIGBjb250YWluZXJgIHNwZWNpZmllZC5cbiAqL1xudmFyIFBvcnRhbCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG5cbiAgZGlzcGxheU5hbWU6ICdQb3J0YWwnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8qKlxuICAgICAqIEEgTm9kZSwgQ29tcG9uZW50IGluc3RhbmNlLCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWl0aGVyLiBUaGUgYGNvbnRhaW5lcmAgd2lsbCBoYXZlIHRoZSBQb3J0YWwgY2hpbGRyZW5cbiAgICAgKiBhcHBlbmRlZCB0byBpdC5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfY29tcG9uZW50T3JFbGVtZW50Mi5kZWZhdWx0LCBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmNdKVxuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9yZW5kZXJPdmVybGF5KCk7XG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCAmJiBuZXh0UHJvcHMuY29udGFpbmVyICE9PSB0aGlzLnByb3BzLmNvbnRhaW5lcikge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSAoMCwgX2dldENvbnRhaW5lcjIuZGVmYXVsdCkobmV4dFByb3BzLmNvbnRhaW5lciwgKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKS5ib2R5KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fdW5yZW5kZXJPdmVybGF5KCk7XG4gICAgdGhpcy5fdW5tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgfSxcbiAgX21vdW50T3ZlcmxheVRhcmdldDogZnVuY3Rpb24gX21vdW50T3ZlcmxheVRhcmdldCgpIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlUYXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSAoMCwgX2dldENvbnRhaW5lcjIuZGVmYXVsdCkodGhpcy5wcm9wcy5jb250YWluZXIsICgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykuYm9keSk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLmFwcGVuZENoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgIH1cbiAgfSxcbiAgX3VubW91bnRPdmVybGF5VGFyZ2V0OiBmdW5jdGlvbiBfdW5tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9IG51bGw7XG4gIH0sXG4gIF9yZW5kZXJPdmVybGF5OiBmdW5jdGlvbiBfcmVuZGVyT3ZlcmxheSgpIHtcblxuICAgIHZhciBvdmVybGF5ID0gIXRoaXMucHJvcHMuY2hpbGRyZW4gPyBudWxsIDogX3JlYWN0Mi5kZWZhdWx0LkNoaWxkcmVuLm9ubHkodGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cbiAgICAvLyBTYXZlIHJlZmVyZW5jZSBmb3IgZnV0dXJlIGFjY2Vzcy5cbiAgICBpZiAob3ZlcmxheSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fbW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gICAgICB0aGlzLl9vdmVybGF5SW5zdGFuY2UgPSBfcmVhY3REb20yLmRlZmF1bHQudW5zdGFibGVfcmVuZGVyU3VidHJlZUludG9Db250YWluZXIodGhpcywgb3ZlcmxheSwgdGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVucmVuZGVyIGlmIHRoZSBjb21wb25lbnQgaXMgbnVsbCBmb3IgdHJhbnNpdGlvbnMgdG8gbnVsbFxuICAgICAgdGhpcy5fdW5yZW5kZXJPdmVybGF5KCk7XG4gICAgICB0aGlzLl91bm1vdW50T3ZlcmxheVRhcmdldCgpO1xuICAgIH1cbiAgfSxcbiAgX3VucmVuZGVyT3ZlcmxheTogZnVuY3Rpb24gX3VucmVuZGVyT3ZlcmxheSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgX3JlYWN0RG9tMi5kZWZhdWx0LnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5SW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGdldE1vdW50Tm9kZTogZnVuY3Rpb24gZ2V0TW91bnROb2RlKCkge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5VGFyZ2V0O1xuICB9LFxuICBnZXRPdmVybGF5RE9NTm9kZTogZnVuY3Rpb24gZ2V0T3ZlcmxheURPTU5vZGUoKSB7XG4gICAgaWYgKCF0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE92ZXJsYXlET01Ob2RlKCk6IEEgY29tcG9uZW50IG11c3QgYmUgbW91bnRlZCB0byBoYXZlIGEgRE9NIG5vZGUuJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlJbnN0YW5jZSkge1xuICAgICAgaWYgKHRoaXMuX292ZXJsYXlJbnN0YW5jZS5nZXRXcmFwcGVkRE9NTm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheUluc3RhbmNlLmdldFdyYXBwZWRET01Ob2RlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX3JlYWN0RG9tMi5kZWZhdWx0LmZpbmRET01Ob2RlKHRoaXMuX292ZXJsYXlJbnN0YW5jZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQb3J0YWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChub2RlLCBldmVudCwgaGFuZGxlcikge1xuICAoMCwgX29uMi5kZWZhdWx0KShub2RlLCBldmVudCwgaGFuZGxlcik7XG4gIHJldHVybiB7XG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAoMCwgX29mZjIuZGVmYXVsdCkobm9kZSwgZXZlbnQsIGhhbmRsZXIpO1xuICAgIH1cbiAgfTtcbn07XG5cbnZhciBfb24gPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb24nKTtcblxudmFyIF9vbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vbik7XG5cbnZhciBfb2ZmID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvZXZlbnRzL29mZicpO1xuXG52YXIgX29mZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vZmYpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBhZGRGb2N1c0xpc3RlbmVyO1xuLyoqXG4gKiBGaXJlZm94IGRvZXNuJ3QgaGF2ZSBhIGZvY3VzaW4gZXZlbnQgc28gdXNpbmcgY2FwdHVyZSBpcyBlYXNpZXN0IHdheSB0byBnZXQgYnViYmxpbmdcbiAqIElFOCBjYW4ndCBkbyBhZGRFdmVudExpc3RlbmVyLCBidXQgZG9lcyBoYXZlIG9uZm9jdXNpbiwgc28gd2UgdXNlIHRoYXQgaW4gaWU4XG4gKlxuICogV2Ugb25seSBhbGxvdyBvbmUgTGlzdGVuZXIgYXQgYSB0aW1lIHRvIGF2b2lkIHN0YWNrIG92ZXJmbG93c1xuICovXG5mdW5jdGlvbiBhZGRGb2N1c0xpc3RlbmVyKGhhbmRsZXIpIHtcbiAgdmFyIHVzZUZvY3VzaW4gPSAhZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcjtcbiAgdmFyIHJlbW92ZSA9IHZvaWQgMDtcblxuICBpZiAodXNlRm9jdXNpbikge1xuICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KCdvbmZvY3VzaW4nLCBoYW5kbGVyKTtcbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZGV0YWNoRXZlbnQoJ29uZm9jdXNpbicsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVyLCB0cnVlKTtcbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVyLCB0cnVlKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsgcmVtb3ZlOiByZW1vdmUgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGdldENvbnRhaW5lcjtcblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyKGNvbnRhaW5lciwgZGVmYXVsdENvbnRhaW5lcikge1xuICBjb250YWluZXIgPSB0eXBlb2YgY29udGFpbmVyID09PSAnZnVuY3Rpb24nID8gY29udGFpbmVyKCkgOiBjb250YWluZXI7XG4gIHJldHVybiBfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUoY29udGFpbmVyKSB8fCBkZWZhdWx0Q29udGFpbmVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaXNPdmVyZmxvd2luZztcblxudmFyIF9pc1dpbmRvdyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93Jyk7XG5cbnZhciBfaXNXaW5kb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNXaW5kb3cpO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gaXNCb2R5KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiYgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdib2R5Jztcbn1cblxuZnVuY3Rpb24gYm9keUlzT3ZlcmZsb3dpbmcobm9kZSkge1xuICB2YXIgZG9jID0gKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KShub2RlKTtcbiAgdmFyIHdpbiA9ICgwLCBfaXNXaW5kb3cyLmRlZmF1bHQpKGRvYyk7XG4gIHZhciBmdWxsV2lkdGggPSB3aW4uaW5uZXJXaWR0aDtcblxuICAvLyBTdXBwb3J0OiBpZTgsIG5vIGlubmVyV2lkdGhcbiAgaWYgKCFmdWxsV2lkdGgpIHtcbiAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgZnVsbFdpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdCk7XG4gIH1cblxuICByZXR1cm4gZG9jLmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2lkdGg7XG59XG5cbmZ1bmN0aW9uIGlzT3ZlcmZsb3dpbmcoY29udGFpbmVyKSB7XG4gIHZhciB3aW4gPSAoMCwgX2lzV2luZG93Mi5kZWZhdWx0KShjb250YWluZXIpO1xuXG4gIHJldHVybiB3aW4gfHwgaXNCb2R5KGNvbnRhaW5lcikgPyBib2R5SXNPdmVyZmxvd2luZyhjb250YWluZXIpIDogY29udGFpbmVyLnNjcm9sbEhlaWdodCA+IGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmFyaWFIaWRkZW4gPSBhcmlhSGlkZGVuO1xuZXhwb3J0cy5oaWRlU2libGluZ3MgPSBoaWRlU2libGluZ3M7XG5leHBvcnRzLnNob3dTaWJsaW5ncyA9IHNob3dTaWJsaW5ncztcblxudmFyIEJMQUNLTElTVCA9IFsndGVtcGxhdGUnLCAnc2NyaXB0JywgJ3N0eWxlJ107XG5cbnZhciBpc0hpZGFibGUgPSBmdW5jdGlvbiBpc0hpZGFibGUoX3JlZikge1xuICB2YXIgbm9kZVR5cGUgPSBfcmVmLm5vZGVUeXBlO1xuICB2YXIgdGFnTmFtZSA9IF9yZWYudGFnTmFtZTtcbiAgcmV0dXJuIG5vZGVUeXBlID09PSAxICYmIEJMQUNLTElTVC5pbmRleE9mKHRhZ05hbWUudG9Mb3dlckNhc2UoKSkgPT09IC0xO1xufTtcblxudmFyIHNpYmxpbmdzID0gZnVuY3Rpb24gc2libGluZ3MoY29udGFpbmVyLCBtb3VudCwgY2IpIHtcbiAgbW91bnQgPSBbXS5jb25jYXQobW91bnQpO1xuXG4gIFtdLmZvckVhY2guY2FsbChjb250YWluZXIuY2hpbGRyZW4sIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG1vdW50LmluZGV4T2Yobm9kZSkgPT09IC0xICYmIGlzSGlkYWJsZShub2RlKSkge1xuICAgICAgY2Iobm9kZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGFyaWFIaWRkZW4oc2hvdywgbm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHNob3cpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhpZGVTaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSkge1xuICBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gYXJpYUhpZGRlbih0cnVlLCBub2RlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dTaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSkge1xuICBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50Tm9kZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gYXJpYUhpZGRlbihmYWxzZSwgbm9kZSk7XG4gIH0pO1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGNvbXBvbmVudE9yRWxlbWVudCkge1xuICByZXR1cm4gKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KShfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUoY29tcG9uZW50T3JFbGVtZW50KSk7XG59O1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciA9IHJlcXVpcmUoJy4vdXRpbHMvY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXInKTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwcm9wVmFsdWUpO1xuXG4gIGlmIChfcmVhY3QyLmRlZmF1bHQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgUmVhY3RFbGVtZW50ICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Q29tcG9uZW50IG9yIGEgJykgKyAnRE9NRWxlbWVudC4gWW91IGNhbiB1c3VhbGx5IG9idGFpbiBhIFJlYWN0Q29tcG9uZW50IG9yIERPTUVsZW1lbnQgJyArICdmcm9tIGEgUmVhY3RFbGVtZW50IGJ5IGF0dGFjaGluZyBhIHJlZiB0byBpdC4nKTtcbiAgfVxuXG4gIGlmICgocHJvcFR5cGUgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBwcm9wVmFsdWUucmVuZGVyICE9PSAnZnVuY3Rpb24nKSAmJiBwcm9wVmFsdWUubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Q29tcG9uZW50IG9yIGEgJykgKyAnRE9NRWxlbWVudC4nKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMi5kZWZhdWx0KSh2YWxpZGF0ZSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlciA9IHJlcXVpcmUoJy4vdXRpbHMvY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXInKTtcblxudmFyIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGVsZW1lbnRUeXBlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwcm9wVmFsdWUpO1xuXG4gIGlmIChfcmVhY3QyLmRlZmF1bHQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgUmVhY3RFbGVtZW50ICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBlbGVtZW50IHR5cGUgKGEgc3RyaW5nICcpICsgJ29yIGEgUmVhY3RDbGFzcykuJyk7XG4gIH1cblxuICBpZiAocHJvcFR5cGUgIT09ICdmdW5jdGlvbicgJiYgcHJvcFR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gZWxlbWVudCB0eXBlIChhIHN0cmluZyAnKSArICdvciBhIFJlYWN0Q2xhc3MpLicpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIyLmRlZmF1bHQpKGVsZW1lbnRUeXBlKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbi8vIE1vc3RseSB0YWtlbiBmcm9tIFJlYWN0UHJvcFR5cGVzLlxuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgdmFyIGNvbXBvbmVudE5hbWVTYWZlID0gY29tcG9uZW50TmFtZSB8fCAnPDxhbm9ueW1vdXM+Pic7XG4gICAgdmFyIHByb3BGdWxsTmFtZVNhZmUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1JlcXVpcmVkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWVTYWZlICsgJ2Agd2FzIG5vdCBzcGVjaWZpZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lU2FmZSArICdgLicpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gNiA/IF9sZW4gLSA2IDogMCksIF9rZXkgPSA2OyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSA2XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdGUuYXBwbHkodW5kZWZpbmVkLCBbcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lU2FmZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZVNhZmVdLmNvbmNhdChhcmdzKSk7XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59IiwiLyohXG4gKiBcbiAqICBSZWFjdCBTaW1wbGV0YWJzIC0gSnVzdCBhIHNpbXBsZSB0YWJzIGNvbXBvbmVudCBidWlsdCB3aXRoIFJlYWN0XG4gKiAgQHZlcnNpb24gdjAuNy4wXG4gKiAgQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3BlZHJvbmF1Y2svcmVhY3Qtc2ltcGxldGFic1xuICogIEBsaWNlbnNlIE1JVFxuICogIEBhdXRob3IgUGVkcm8gTmF1Y2sgKGh0dHBzOi8vZ2l0aHViLmNvbS9wZWRyb25hdWNrKVxuICogXG4gKi9cbihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCkpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wicmVhY3RcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiUmVhY3RTaW1wbGVUYWJzXCJdID0gZmFjdG9yeSgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiUmVhY3RTaW1wbGVUYWJzXCJdID0gZmFjdG9yeShyb290W1wiUmVhY3RcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX18pIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qKiBAanN4IFJlYWN0LkRPTSAqLyd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmVhY3QgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xuXHR2YXIgY2xhc3NOYW1lcyA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XG5cblx0aWYgKHRydWUpIHtcblx0ICBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xuXHR9XG5cblx0dmFyIFRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdCAgZGlzcGxheU5hbWU6ICdUYWJzJyxcblx0ICBwcm9wVHlwZXM6IHtcblx0ICAgIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuXHQgICAgXSksXG5cdCAgICB0YWJBY3RpdmU6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG5cdCAgICBvbk1vdW50OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIG9uQmVmb3JlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIG9uQWZ0ZXJDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5lbGVtZW50XG5cdCAgICBdKS5pc1JlcXVpcmVkXG5cdCAgfSxcblx0ICBnZXREZWZhdWx0UHJvcHM6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHsgdGFiQWN0aXZlOiAxIH07XG5cdCAgfSxcblx0ICBnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIHtcblx0ICAgICAgdGFiQWN0aXZlOiB0aGlzLnByb3BzLnRhYkFjdGl2ZVxuXHQgICAgfTtcblx0ICB9LFxuXHQgIGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xuXHQgICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS50YWJBY3RpdmU7XG5cdCAgICB2YXIgJHNlbGVjdGVkUGFuZWwgPSB0aGlzLnJlZnNbJ3RhYi1wYW5lbCddO1xuXHQgICAgdmFyICRzZWxlY3RlZE1lbnUgPSB0aGlzLnJlZnNbKFwidGFiLW1lbnUtXCIgKyBpbmRleCldO1xuXG5cdCAgICBpZiAodGhpcy5wcm9wcy5vbk1vdW50KSB7XG5cdCAgICAgIHRoaXMucHJvcHMub25Nb3VudChpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZE1lbnUpO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV3UHJvcHMpe1xuXHQgICAgaWYobmV3UHJvcHMudGFiQWN0aXZlICYmIG5ld1Byb3BzLnRhYkFjdGl2ZSAhPT0gdGhpcy5wcm9wcy50YWJBY3RpdmUpe1xuXHQgICAgICB0aGlzLnNldFN0YXRlKHt0YWJBY3RpdmU6IG5ld1Byb3BzLnRhYkFjdGl2ZX0pO1xuXHQgICAgfVxuXHQgIH0sXG5cdCAgcmVuZGVyOmZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzKCd0YWJzJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpO1xuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBjbGFzc05hbWV9LCBcblx0ICAgICAgICB0aGlzLl9nZXRNZW51SXRlbXMoKSwgXG5cdCAgICAgICAgdGhpcy5fZ2V0U2VsZWN0ZWRQYW5lbCgpXG5cdCAgICAgIClcblx0ICAgICk7XG5cdCAgfSxcblx0ICBzZXRBY3RpdmU6ZnVuY3Rpb24oaW5kZXgsIGUpIHtcblx0ICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXHQgICAgdmFyIG9uQWZ0ZXJDaGFuZ2UgPSB0aGlzLnByb3BzLm9uQWZ0ZXJDaGFuZ2U7XG5cdCAgICB2YXIgb25CZWZvcmVDaGFuZ2UgPSB0aGlzLnByb3BzLm9uQmVmb3JlQ2hhbmdlO1xuXHQgICAgdmFyICRzZWxlY3RlZFBhbmVsID0gdGhpcy5yZWZzWyd0YWItcGFuZWwnXTtcblx0ICAgIHZhciAkc2VsZWN0ZWRUYWJNZW51ID0gdGhpcy5yZWZzWyhcInRhYi1tZW51LVwiICsgaW5kZXgpXTtcblxuXHQgICAgaWYgKG9uQmVmb3JlQ2hhbmdlKSB7XG5cdCAgICAgIHZhciBjYW5jZWwgPSBvbkJlZm9yZUNoYW5nZShpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZFRhYk1lbnUpO1xuXHQgICAgICBpZihjYW5jZWwgPT09IGZhbHNlKXsgcmV0dXJuIH1cblx0ICAgIH1cblxuXHQgICAgdGhpcy5zZXRTdGF0ZSh7IHRhYkFjdGl2ZTogaW5kZXggfSwgZnVuY3Rpb24oKSAge1xuXHQgICAgICBpZiAob25BZnRlckNoYW5nZSkge1xuXHQgICAgICAgIG9uQWZ0ZXJDaGFuZ2UoaW5kZXgsICRzZWxlY3RlZFBhbmVsLCAkc2VsZWN0ZWRUYWJNZW51KTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfSxcblx0ICBfZ2V0TWVudUl0ZW1zOmZ1bmN0aW9uICgpIHtcblx0ICAgIGlmICghdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBUYWJzLlBhbmVsJyk7XG5cdCAgICB9XG5cblx0ICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKSkge1xuXHQgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuID0gW3RoaXMucHJvcHMuY2hpbGRyZW5dO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgJG1lbnVJdGVtcyA9IHRoaXMucHJvcHMuY2hpbGRyZW5cblx0ICAgICAgLm1hcChmdW5jdGlvbigkcGFuZWwpICB7cmV0dXJuIHR5cGVvZiAkcGFuZWwgPT09ICdmdW5jdGlvbicgPyAkcGFuZWwoKSA6ICRwYW5lbDt9KVxuXHQgICAgICAuZmlsdGVyKGZ1bmN0aW9uKCRwYW5lbCkgIHtyZXR1cm4gJHBhbmVsO30pXG5cdCAgICAgIC5tYXAoZnVuY3Rpb24oJHBhbmVsLCBpbmRleCkgIHtcblx0ICAgICAgICB2YXIgcmVmID0gKFwidGFiLW1lbnUtXCIgKyAoaW5kZXggKyAxKSk7XG5cdCAgICAgICAgdmFyIHRpdGxlID0gJHBhbmVsLnByb3BzLnRpdGxlO1xuXHQgICAgICAgIHZhciBjbGFzc2VzID0gY2xhc3NOYW1lcyhcblx0ICAgICAgICAgICd0YWJzLW1lbnUtaXRlbScsXG5cdCAgICAgICAgICB0aGlzLnN0YXRlLnRhYkFjdGl2ZSA9PT0gKGluZGV4ICsgMSkgJiYgJ2lzLWFjdGl2ZSdcblx0ICAgICAgICApO1xuXG5cdCAgICAgICAgcmV0dXJuIChcblx0ICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7cmVmOiByZWYsIGtleTogaW5kZXgsIGNsYXNzTmFtZTogY2xhc3Nlc30sIFxuXHQgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zZXRBY3RpdmUuYmluZCh0aGlzLCBpbmRleCArIDEpfSwgXG5cdCAgICAgICAgICAgICAgdGl0bGVcblx0ICAgICAgICAgICAgKVxuXHQgICAgICAgICAgKVxuXHQgICAgICAgICk7XG5cdCAgICAgIH0uYmluZCh0aGlzKSk7XG5cblx0ICAgIHJldHVybiAoXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwge2NsYXNzTmFtZTogXCJ0YWJzLW5hdmlnYXRpb25cIn0sIFxuXHQgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcInRhYnMtbWVudVwifSwgJG1lbnVJdGVtcylcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9LFxuXHQgIF9nZXRTZWxlY3RlZFBhbmVsOmZ1bmN0aW9uICgpIHtcblx0ICAgIHZhciBpbmRleCA9IHRoaXMuc3RhdGUudGFiQWN0aXZlIC0gMTtcblx0ICAgIHZhciAkcGFuZWwgPSB0aGlzLnByb3BzLmNoaWxkcmVuW2luZGV4XTtcblxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFydGljbGVcIiwge3JlZjogXCJ0YWItcGFuZWxcIiwgY2xhc3NOYW1lOiBcInRhYi1wYW5lbFwifSwgXG5cdCAgICAgICAgJHBhbmVsXG5cdCAgICAgIClcblx0ICAgICk7XG5cdCAgfVxuXHR9KTtcblxuXHRUYWJzLlBhbmVsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHQgIGRpc3BsYXlOYW1lOiAnUGFuZWwnLFxuXHQgIHByb3BUeXBlczoge1xuXHQgICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblx0ICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuZWxlbWVudFxuXHQgICAgXSkuaXNSZXF1aXJlZFxuXHQgIH0sXG5cdCAgcmVuZGVyOmZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXHQgIH1cblx0fSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBUYWJzO1xuXG5cbi8qKiovIH0sXG4vKiAxICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMV9fO1xuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyoqIEBqc3ggUmVhY3QuRE9NICovZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXHRcdHZhciBhcmc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0YXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZyB8fCAnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHRcdH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKCdvYmplY3QnID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8ICFhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdC8vIHNhZmVseSBleHBvcnQgY2xhc3NOYW1lcyBpbiBjYXNlIHRoZSBzY3JpcHQgaXMgaW5jbHVkZWQgZGlyZWN0bHkgb24gYSBwYWdlXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fVxuXG5cbi8qKiovIH0sXG4vKiAzICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgd2FybmluZyA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhcmdzKSB7XG4gICAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gPiAyID8gbGVuIC0gMiA6IDApO1xuICAgIGZvciAodmFyIGtleSA9IDI7IGtleSA8IGxlbjsga2V5KyspIHtcbiAgICAgIGFyZ3Nba2V5IC0gMl0gPSBhcmd1bWVudHNba2V5XTtcbiAgICB9XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICtcbiAgICAgICAgJ21lc3NhZ2UgYXJndW1lbnQnXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQubGVuZ3RoIDwgMTAgfHwgKC9eW3NcXFddKiQvKS50ZXN0KGZvcm1hdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSB3YXJuaW5nIGZvcm1hdCBzaG91bGQgYmUgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzICcgK1xuICAgICAgICAnd2FybmluZy4gUGxlYXNlLCB1c2UgYSBtb3JlIGRlc2NyaXB0aXZlIGZvcm1hdCB0aGFuOiAnICsgZm9ybWF0XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgICAgfSk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH0gY2F0Y2goeCkge31cbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2FybmluZztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBBbGxlbGVGaWx0ZXJzVmlldyA9ICh7c3BlY2llcywgaGlkZGVuQWxsZWxlcz1bXSwgZGlzYWJsZWRBbGxlbGVzID0gW10sIG9uRmlsdGVyQ2hhbmdlfSkgPT4ge1xuICBsZXQgaGlkZGVuR2VuZXMgPSBuZXcgU2V0LFxuICAgICAgZ2VuZUlucHV0cyA9IFtdO1xuXG4gIGZvciAoY29uc3QgYWxsZWxlIG9mIGhpZGRlbkFsbGVsZXMpIHtcbiAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpO1xuICAgIGlmIChnZW5lKVxuICAgICAgaGlkZGVuR2VuZXMuYWRkKGdlbmUubmFtZSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGdlbmUgaW4gc3BlY2llcy5nZW5lTGlzdCkge1xuICAgIGlmICghaGlkZGVuR2VuZXMuaGFzKGdlbmUpKSB7XG4gICAgICBjb25zdCBhbGxlbGVzID0gc3BlY2llcy5nZW5lTGlzdFtnZW5lXS5hbGxlbGVzLFxuICAgICAgICAgICAgYWxsZWxlSXRlbXMgPSBhbGxlbGVzLm1hcChhbGxlbGUgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gIShkaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID49IDApO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsYWJlbCBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5MZWZ0XCI6IFwiOHB4XCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e2NoZWNrZWR9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9Lz5cbiAgICAgICAgICAgICAgICAgIHtuYW1lfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIGdlbmVJbnB1dHMucHVzaChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5lLWFsbGVsZS1saXN0XCIga2V5PXtnZW5lfT57YWxsZWxlSXRlbXN9PC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIGFsbGVsZSA9IGVsdCAmJiBlbHQudmFsdWUsXG4gICAgICAgICAgaXNDaGVja2VkID0gZWx0ICYmIGVsdC5jaGVja2VkO1xuICAgIGlmIChvbkZpbHRlckNoYW5nZSAmJiBhbGxlbGUpXG4gICAgICBvbkZpbHRlckNoYW5nZShldnQsIGFsbGVsZSwgaXNDaGVja2VkKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGFsbGVsZS1maWx0ZXJzXCJcbiAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpblRvcFwiOiBcIjVweFwiLCBcIm1hcmdpbkJvdHRvbVwiOiBcIjVweFwiIH19PlxuICAgICAgeyBnZW5lSW5wdXRzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkFsbGVsZUZpbHRlcnNWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzYWJsZWRBbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgb25GaWx0ZXJDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZUZpbHRlcnNWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEFsbGVsZVZpZXcgPSAoe2FsbGVsZSwgd2lkdGg9MjEsIHRhcmdldCwgY29sb3IsIHNoYXBlLCBob3ZlcmluZ30pID0+IHtcbiAgbGV0IHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBzdHJva2UgPSB0YXJnZXQgPyBcIiMwMDAwMDBcIiA6IFwibm9uZVwiLFxuICAgICAgZmlsbCA9IGFsbGVsZSA/IGNvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgc3Ryb2tlV2lkdGggPSBob3ZlcmluZyA/IDMgOiAxLFxuICAgICAgc3Ryb2tlRGFzaGFycmF5PSBhbGxlbGUgPyBcIjBcIiA6IFwiMVwiLFxuICAgICAgc3ZnU2hhcGUgPSBudWxsO1xuXG4gIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgIHN2Z1NoYXBlID0gPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMX0gY3g9e3JhZGl1cysxfSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfSBlbHNlIHtcbiAgICBzdmdTaGFwZSA9IDxyZWN0IHdpZHRoPXsocmFkaXVzKjIpfSBoZWlnaHQ9eyhyYWRpdXMqMil9IHg9XCIxXCIgeT1cIjFcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfVxuXG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aCsyfSBoZWlnaHQ9e3dpZHRoKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICB7IHN2Z1NoYXBlIH1cbiAgICAgICAgPHRleHQgeD17cmFkaXVzKzF9IHk9e3JhZGl1cys3fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+e2FsbGVsZX08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5BbGxlbGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgYWxsZWxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgdGFyZ2V0OiBQcm9wVHlwZXMuYm9vbCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNoYXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBob3ZlcmluZzogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5pbXBvcnQgR2FtZXRlVmlldyBmcm9tICcuL2dhbWV0ZSc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZSB0aGF0IGFuaW1hdGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IFtpbml0aWFsRGlzcGxheV0gLSBpbml0aWFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnhdIC0gaW5pdGlhbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS55XSAtIGluaXRpYWwgbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5zaXplPTMwXSAtIGluaXRpYWwgc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkucm90YXRpb249MF0gLSBpbml0aWFsIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkub3BhY2l0eT0xXSAtIGluaXRpYWwgb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGZpbmFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gZmluYWwgbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBmaW5hbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBmaW5hbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gZmluYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBmaW5hbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW5pbVN0aWZmbmVzcz0xMDBdIC0gc3ByaW5nIHN0aWZmbmVzcyB1c2VkIHRvIGNvbnRyb2wgYW5pbWF0aW9uIHNwZWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvblJlY3QoKV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGF0IHJlc3RcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgQW5pbWF0ZWRHYW1ldGVWaWV3ID0gKHtpZCwgaW5pdGlhbERpc3BsYXksIGRpc3BsYXksIGFuaW1TdGlmZm5lc3M9MTAwLCBvblJlc3QsIC4uLm90aGVyc30pID0+IHtcblxuICBjb25zdCBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGluaXRpYWwgPSBpbml0aWFsRGlzcGxheSB8fCBkaXNwbGF5LFxuICAgICAgICBpbml0aWFsU2l6ZSA9IGluaXRpYWwuc2l6ZSB8fCAzMCxcbiAgICAgICAgaW5pdGlhbFJvdGF0aW9uID0gaW5pdGlhbC5yb3RhdGlvbiAhPSBudWxsID8gaW5pdGlhbC5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGluaXRpYWxPcGFjaXR5ID0gaW5pdGlhbC5vcGFjaXR5ICE9IG51bGwgPyBpbml0aWFsLm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIGZpbmFsU2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgZmluYWxSb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBmaW5hbE9wYWNpdHkgPSBkaXNwbGF5Lm9wYWNpdHkgIT0gbnVsbCA/IGRpc3BsYXkub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgc3ByaW5nQ29uZmlnID0geyBzdGlmZm5lc3M6IGFuaW1TdGlmZm5lc3MgfTtcbiAgcmV0dXJuIChcbiAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1nYW1ldGUnXG4gICAgICAgICAgZGVmYXVsdFN0eWxlPXt7XG4gICAgICAgICAgICB4OiBpbml0aWFsLngsIHk6IGluaXRpYWwueSwgc2l6ZTogaW5pdGlhbFNpemUsXG4gICAgICAgICAgICByb3RhdGlvbjogaW5pdGlhbFJvdGF0aW9uLCBvcGFjaXR5OiBpbml0aWFsT3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHg6IHNwcmluZyhkaXNwbGF5LngsIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICB5OiBzcHJpbmcoZGlzcGxheS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgc2l6ZTogc3ByaW5nKGZpbmFsU2l6ZSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiBzcHJpbmcoZmluYWxSb3RhdGlvbiwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIG9wYWNpdHk6IHNwcmluZyhmaW5hbE9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+XG4gICAgICAgICAgPEdhbWV0ZVZpZXcgaWQ9e2lkfSBkaXNwbGF5PXtpbnRlcnBvbGF0ZWRTdHlsZX0gey4uLm90aGVyc30gLz5cbiAgICAgIH1cbiAgICA8L01vdGlvbj5cbiAgKTtcbn07XG5cbkFuaW1hdGVkR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgaW5pdGlhbERpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7IC8vIGluaXRpYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSksXG4gIGRpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7ICAgICAgICAvLyBmaW5hbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KS5pc1JlcXVpcmVkLFxuICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVkR2FtZXRlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbmNvbnN0IEFuaW1hdGVkT3JnYW5pc21WaWV3ID0gKHtvcmcsIGlkLCB3aWR0aD0yMDAsIHN0eWxlPXt9LCBpbml0aWFsT3BhY2l0eT0xLjAsIG9wYWNpdHk9MS4wLCBzdGlmZm5lc3M9NjAsIG9uUmVzdCwgb25DbGljayB9KSA9PiB7XG4gIGNvbnN0IG9wYWNpdHlTdGFydCA9IGluaXRpYWxPcGFjaXR5ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKG9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG9wYWNpdHkgOiAxLjApO1xuICBsZXQgICBvcGFjaXR5RW5kID0gb3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gb3BhY2l0eSA6IG9wYWNpdHlTdGFydDtcblxuICBpZiAob3BhY2l0eUVuZCAhPT0gb3BhY2l0eVN0YXJ0KVxuICAgIG9wYWNpdHlFbmQgPSBzcHJpbmcob3BhY2l0eUVuZCwgeyBzdGlmZm5lc3M6IHN0aWZmbmVzcyB9KTtcblxuICByZXR1cm4gKFxuICAgIDxNb3Rpb24gY2xhc3NOYW1lPSdnZW5pYmxvY2tzIGFuaW1hdGVkLW9yZ2FuaXNtLXZpZXcnXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tvcGFjaXR5OiBvcGFjaXR5U3RhcnR9fSBzdHlsZT17e29wYWNpdHk6IG9wYWNpdHlFbmR9fSBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgY29uc3QgdFN0eWxlID0geyAuLi5zdHlsZSwgLi4uaW50ZXJwb2xhdGVkU3R5bGUgfTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkfSB3aWR0aD17d2lkdGh9IHN0eWxlPXt0U3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIDwvTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRPcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgaW5pdGlhbE9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlcixcbiAgb25SZXN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVkT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBFZ2dWaWV3LCBFR0dfSU1BR0VfV0lEVEggfSBmcm9tICcuL2VnZy1jbHV0Y2gnO1xuXG5jb25zdCBFR0dfSU1BR0VfV0lEVEhfU01BTEwgPSBFR0dfSU1BR0VfV0lEVEggLyAzO1xuXG5jbGFzcyBCYXNrZXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJhc2tldDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgYWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgICBzZXg6IFByb3BUeXBlcy5udW1iZXJcbiAgICB9KSxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBlZ2dzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIGhhbmRsZUNsaWNrID0gKGV2dCkgPT4ge1xuICAgIGNvbnN0IHsgYmFza2V0LCBpbmRleCwgb25DbGljayB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAob25DbGljaylcbiAgICAgIG9uQ2xpY2soaW5kZXgsIGJhc2tldCk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgYmFza2V0LCBpZCwgZWdncywgaXNTZWxlY3RlZCB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBjbGFzc2VzID0gJ2Jhc2tldCcgKyAoaXNTZWxlY3RlZCA/ICcgc2VsZWN0ZWQnIDogJycpO1xuXG4gICAgZnVuY3Rpb24gZWdnc0RpdigpIHtcbiAgICAgIGlmICghZWdncyB8fCAhZWdncy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgICAgbGV0IGVnZ1ZpZXdzID0gZWdncy5tYXAoZnVuY3Rpb24oZWdnLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxFZ2dWaWV3IGVnZz17ZWdnfSBrZXk9e2BiYXNrZXQtZWdnLSR7aW5kZXh9YH0gaXNTZWxlY3RlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3R5bGU9e3tzaXplOiBFR0dfSU1BR0VfV0lEVEhfU01BTEx9fSAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWVnZ3MnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDMwLCB0b3A6IDEwLCB3aWR0aDogNzAgfX0+XG4gICAgICAgICAge2VnZ1ZpZXdzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSBpZD17aWR9IGtleT17aWR9IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWltYWdlJyByZWY9J2RvbU5vZGUnPjwvZGl2PlxuICAgICAgICB7ZWdnc0RpdigpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWxhYmVsIHVuc2VsZWN0YWJsZSc+e2Jhc2tldC5sYWJlbH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgQmFza2V0U2V0VmlldyA9ICh7YmFza2V0cywgaWRQcmVmaXg9J2Jhc2tldC0nLCBzZWxlY3RlZEluZGljZXM9W10sXG4gICAgICAgICAgICAgICAgICAgICAgICBlZ2dzLCBhbmltYXRpbmdFZ2dJbmRleCwgb25DbGlja30pID0+IHtcblxuICBsZXQgYmFza2V0Vmlld3MgPSBiYXNrZXRzLm1hcCgoYmFza2V0LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IGAke2lkUHJlZml4fSR7aW5kZXh9YCxcbiAgICAgICAgICAgICAgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kaWNlcy5pbmRleE9mKGluZGV4KSA+PSAwO1xuICAgICAgICBsZXQgZWdnSW5kaWNlcyA9IChiYXNrZXQgJiYgYmFza2V0LmVnZ3MpIHx8IFtdLFxuICAgICAgICAgICAgZGlzcGxheUVnZ3MgPSBbXTtcbiAgICAgICAgICAgIGVnZ0luZGljZXMuZm9yRWFjaCgoZWdnRHJha2VJbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlZ2dJbmRleCA9IGVnZ0RyYWtlSW5kZXg7XG4gICAgICAgICAgICAgIGlmIChlZ2dEcmFrZUluZGV4ID09PSBhbmltYXRpbmdFZ2dJbmRleCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoZWdncyAmJiBlZ2dzW2VnZ0luZGV4XSlcbiAgICAgICAgICAgICAgICBkaXNwbGF5RWdncy5wdXNoKGVnZ3NbZWdnSW5kZXhdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gPEJhc2tldFZpZXcgYmFza2V0PXtiYXNrZXR9IGlkPXtpZH0ga2V5PXtpZH0gaW5kZXg9e2luZGV4fSBlZ2dzPXtkaXNwbGF5RWdnc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+O1xuICAgICAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYmFza2V0LXNldFwiPlxuICAgICAgeyBiYXNrZXRWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5CYXNrZXRTZXRWaWV3LnByb3BUeXBlcyA9IHtcbiAgYmFza2V0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaWRQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNlbGVjdGVkSW5kaWNlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICBhbmltYXRpbmdFZ2dJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2tldFNldFZpZXc7XG4iLCIvKlxuICogVGhpcyBjb21wb25lbnQgaXMgYSB2ZXJ5IHRoaW4gd3JhcHBlciBhcm91bmQgYSBzdGFuZGFyZCBidXR0b24gZGVzaWduZWQgdG8gcHJldmVudFxuICogZXh0cmFuZW91cyBmb2N1cyBoaWdobGlnaHRpbmcgYWRkZWQgYnkgYnJvd3NlcnMgd2hlbiBjbGlja2luZyBvbiBhIGJ1dHRvbiB3aGlsZVxuICogbWFpbnRhaW5pbmcga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eS4gU2VlXG4gKiBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gKiBmb3IgZGV0YWlscy4gVGhlIHVwc2hvdCBpcyB0aGF0IHdlIHVzZSBtb3VzZSBldmVudHMgb24gdGhlIGJ1dHRvbiB0byBkaXNhYmxlIHRoZVxuICogZm9jdXMgaGlnaGxpZ2h0IC0tIG1vdXNpbmcvY2xpY2tpbmcgb24gYSBwdXNoIGJ1dHRvbiBzaG91bGQgbm90IGJlIHVzZWQgYXMgYW5cbiAqIGluY2lkYXRvciB0aGF0IHRoZSB1c2VyIHdvdWxkIGxpa2UgdG8ga2V5Ym9hcmQtaW50ZXJhY3Qgd2l0aCB0aGF0IGJ1dHRvbiwgd2hpY2hcbiAqIGlzIHdoYXQgZm9jdXNpbmcgYSBjbGlja2VkIGJ1dHRvbiBpbXBsaWVzLlxuICogSU1QT1JUQU5UOiBUbyBtYWludGFpbiBhY2Nlc3NpYmlsaXR5LCB0aGVyZSBtdXN0IGJlIGNvZGUgc29tZXdoZXJlIHRvIHJlZW5hYmxlXG4gKiB0aGUgZm9jdXMgaGlnaGxpZ2h0IHdoZW4gYXBwcm9wcmlhdGUuIFRoaXMgY2FuIGJlIGRvbmUgZm9yICdrZXlkb3duJyBieSBjYWxsaW5nXG4gKiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHRPbktleURvd24oKSBkdXJpbmcgYXBwbGljYXRpb24vcGFnZSBpbml0aWFsaXphdGlvbixcbiAqIG9yIGJ5IGFkZGluZyB5b3VyIG93biBldmVudCBoYW5kbGVyIHRoYXQgY2FsbHMgQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0KCkuXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHQgZnJvbSAnLi4vdXRpbGl0aWVzL3RyYW5zbGF0ZSc7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pXG4gIH1cblxuICAvLyBJbnN0YWxscyBhIGtleWRvd24gaGFuZGxlciBvbiB0aGUgZG9jdW1lbnQgd2hpY2ggd2lsbCBlbmFibGUgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZy5cbiAgLy8gU2hvdWxkIGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBpbml0aWFsaXphdGlvbi5cbiAgc3RhdGljIGVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSk7XG4gIH1cblxuICAvLyBFbmFibGVzIGJ1dHRvbiBmb2N1cyBoaWdobGlnaHRpbmc7IGRlc2lnbmVkIHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBrZXlkb3duIGhhbmRsZXIgYWJvdmVcbiAgLy8gYnV0IGF2YWlsYWJsZSBzZXBhcmF0ZWx5IGZvciBpbXBsZW1lbnRhdGlvbnMgdGhhdCByZXF1aXJlIGl0LlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYi1idXR0b24nKSxcbiAgICAgICAgICBjb3VudCA9IGJ1dHRvbnMubGVuZ3RoO1xuICAgIC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZUxpc3QjRXhhbXBsZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGlmIChidXR0b24gJiYgYnV0dG9uLmNsYXNzTmFtZSkge1xuICAgICAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTU5NTEvY2hhbmdlLWFuLWVsZW1lbnRzLWNsYXNzLXdpdGgtamF2YXNjcmlwdFxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC8oPzpefFxccyluby1mb2N1cy1oaWdobGlnaHQoPyFcXFMpL2cgLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcHJldmVudCBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodCBvbiBjbGljayB3aGlsZSBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5XG4gIC8vIHNlZSBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gIHN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm9Gb2N1c0hpZ2hsaWdodCA9ICduby1mb2N1cy1oaWdobGlnaHQnLFxuICAgICAgICAgIGJ1dHRvbiA9IHRoaXMucmVmcy5idXR0b247XG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lLmluZGV4T2Yobm9Gb2N1c0hpZ2hsaWdodCkgPCAwKVxuICAgICAgYnV0dG9uLmNsYXNzTmFtZSArPSAnICcgKyBub0ZvY3VzSGlnaGxpZ2h0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBsYWJlbCwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAoY2xhc3NOYW1lID8gY2xhc3NOYW1lICsgJyAnIDogJycpICsgJ2diLWJ1dHRvbic7XG5cbiAgICBjb25zdCBoYW5kbGVNb3VzZUV2ZW50ID0gKCkgPT4gdGhpcy5zdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2NsYXNzZXN9IHJlZj0nYnV0dG9uJyB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2hhbmRsZU1vdXNlRXZlbnR9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVNb3VzZUV2ZW50fT5cbiAgICAgICAge3QobGFiZWwpfVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5cbmNsYXNzIENoYWxsZW5nZUF3YXJkVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBjb2luUGFydHM6IFByb3BUeXBlcy5udW1iZXJcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICBjaGFsbGVuZ2VBd2FyZHM6IHtcImNhc2VJZFwiOjAsIFwiY2hhbGxlbmdlSWRcIjowLCBcImNoYWxsZW5nZUNvdW50XCI6MCwgXCJwcm9ncmVzc1wiOltdfSxcbiAgICAgc2l6ZTogMjU2LFxuICAgICBjb2luUGFydHM6IDNcbiAgfTtcblxuICBhZGRBd2FyZEltYWdlID0gKHByb2dyZXNzSW1hZ2VzLCBwaWVjZXMsIHBpZWNlTnVtLCBzY29yZSwgcGllY2VTdHlsZSkgPT4ge1xuICAgIGxldCBhd2FyZExldmVsID0gdGhpcy5nZXRBd2FyZFN0eWxlKHNjb3JlKTtcbiAgICBpZiAoc2NvcmUgPiAtMSl7XG4gICAgICBsZXQgcGllY2VOYW1lID0gYGNvaW4gcGllY2UgcGllY2VzJHtwaWVjZXN9IHBpZWNlJHtwaWVjZU51bX0gJHtwaWVjZVN0eWxlfSAke2F3YXJkTGV2ZWx9YDtcbiAgICAgIHByb2dyZXNzSW1hZ2VzLnB1c2goPGRpdiBrZXk9e3BpZWNlTnVtfSBjbGFzc05hbWU9e3BpZWNlTmFtZX0gLz4pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZ3Jlc3NJbWFnZXM7XG4gIH07XG5cbiAgZ2V0QXdhcmRTdHlsZSA9IChzY29yZSkgPT4ge1xuICAgIGxldCBhd2FyZExldmVsID0gXCJnb2xkXCI7XG4gICAgaWYgKHNjb3JlID09PSAxKSBhd2FyZExldmVsID0gXCJzaWx2ZXJcIjtcbiAgICBpZiAoc2NvcmUgPj0gMikgYXdhcmRMZXZlbCA9IFwiYnJvbnplXCI7XG4gICAgcmV0dXJuIGF3YXJkTGV2ZWw7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBjYXNlSWQgPSAwLCBjaGFsbGVuZ2VJZCA9IDAsIGNoYWxsZW5nZUNvdW50ID0gMCwgcHJvZ3Jlc3MgPSBbXSwgY2hhbGxlbmdlQmFja2dyb3VuZEltYWdlLCBwcm9ncmVzc0ltYWdlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUlkICE9IG51bGwpIHtcbiAgICAgIGNhc2VJZCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNhc2VJZCxcbiAgICAgIGNoYWxsZW5nZUlkID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMuY2hhbGxlbmdlSWQsXG4gICAgICBjaGFsbGVuZ2VDb3VudCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUNvdW50O1xuICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5wcm9ncmVzcztcbiAgICAgIGNoYWxsZW5nZUJhY2tncm91bmRJbWFnZSA9IDxkaXYgY2xhc3NOYW1lPVwiY29pbiBiYWNrZ3JvdW5kXCIgLz47XG4gICAgfSBlbHNlIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFwcm9ncmVzcyB8fCBwcm9ncmVzcyA9PT0gW10pXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGxldCBzaXplID0gdGhpcy5wcm9wcy5zaXplIHx8IDI1NjtcbiAgICBsZXQgc2l6ZVN0eWxlID0ge1xuICAgICAgd2lkdGg6IHNpemUgKyBcInB4XCIsXG4gICAgICBoZWlnaHQ6IHNpemUgKyBcInB4XCJcbiAgICB9O1xuXG4gICAgbGV0IHBpZWNlS2V5ID0gY2FzZUlkICsgXCI6XCI7XG4gICAgbGV0IGNoYWxsZW5nZVNjb3JlID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYWxsZW5nZUNvdW50OyBpKyspe1xuICAgICAgZm9yICh2YXIga2V5IGluIHByb2dyZXNzKXtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKHBpZWNlS2V5ICsgaSkpe1xuICAgICAgICAgIGNvbnN0IHNjb3JlID0gcHJvZ3Jlc3Nba2V5XTtcbiAgICAgICAgICBpZiAoY2hhbGxlbmdlU2NvcmVbaV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgIGNoYWxsZW5nZVNjb3JlW2ldID0gc2NvcmU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoYWxsZW5nZVNjb3JlW2ldICs9IHNjb3JlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgcGllY2VOdW0gPSBjaGFsbGVuZ2VJZCArIDE7XG4gICAgbGV0IGN1cnJlbnRQaWVjZVN0eWxlID0gYGNvaW4gcGllY2UgcGllY2VzJHtjaGFsbGVuZ2VDb3VudH0gcGllY2Uke3BpZWNlTnVtfSBzaW5nbGUgJHt0aGlzLmdldEF3YXJkU3R5bGUoY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlSWRdKX1gO1xuXG4gICAgZm9yICh2YXIgY2hhbGxlbmdlIGluIGNoYWxsZW5nZVNjb3JlKXtcbiAgICAgIHBpZWNlTnVtID0gcGFyc2VJbnQoY2hhbGxlbmdlKSArIDE7XG4gICAgICBwcm9ncmVzc0ltYWdlcyA9IHRoaXMuYWRkQXdhcmRJbWFnZShwcm9ncmVzc0ltYWdlcywgY2hhbGxlbmdlQ291bnQsIHBpZWNlTnVtLCBjaGFsbGVuZ2VTY29yZVtjaGFsbGVuZ2VdLCBcIndob2xlXCIpO1xuICAgIH1cblxuICAgIGxldCBzaW5nbGVQaWVjZU9wYWNpdHlTdGFydCA9IDEsIHNpbmdsZVBpZWNlT3BhY2l0eUVuZCA9IDAsIHN0eWxlID0ge30sIG9uUmVzdDtcbiAgICBzaW5nbGVQaWVjZU9wYWNpdHlFbmQgPSBzcHJpbmcoc2luZ2xlUGllY2VPcGFjaXR5RW5kLCB7IHN0aWZmbmVzczogMzAsIGRhbXBpbmc6MjAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNoYWxsZW5nZS1hd2FyZFwiIHN0eWxlPXtzaXplU3R5bGV9ID5cbiAgICAgICAge2NoYWxsZW5nZUJhY2tncm91bmRJbWFnZX1cbiAgICAgICAge3Byb2dyZXNzSW1hZ2VzfVxuICAgICAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1jb2luLXZpZXcnXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tvcGFjaXR5OiBzaW5nbGVQaWVjZU9wYWNpdHlTdGFydH19IHN0eWxlPXt7b3BhY2l0eTogc2luZ2xlUGllY2VPcGFjaXR5RW5kfX0gb25SZXN0PXtvblJlc3R9ID5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRTdHlsZSA9IHsgLi4uc3R5bGUsIC4uLmludGVycG9sYXRlZFN0eWxlIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwaWVjZU51bX0gc3R5bGU9e3RTdHlsZX0gY2xhc3NOYW1lPXtjdXJyZW50UGllY2VTdHlsZX0gLz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIDwvTW90aW9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFsbGVuZ2VBd2FyZFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgbWFsZS9mZW1hbGUgY2hhbmdlIGJ1dHRvbnNcbiAqIFRoZSBhcHBlYXJhbmNlIG9mIHRoZSBidXR0b25zIGlzIGN1cnJlbnRseSBlbnRpcmVseSBjb250cm9sbGVkIHZpYSBleHRlcm5hbCBDU1MuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2V4IC0gWydtYWxlJyB8ICdmZW1hbGUnXSBjdXJyZW50bHkgc2VsZWN0ZWQgYnV0dG9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNoYW5nZShldnQsIHNleCkgLSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB1c2UgY2xpY2tzIHRvIGNoYW5nZSBzZXhcbiAqL1xuY29uc3QgQ2hhbmdlU2V4QnV0dG9ucyA9ICh7aWQsIHNleCwgc3BlY2llcywgc2hvd0xhYmVsLCBzdHlsZT17fSwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IGNhcFNleCA9IHNleCA9PT0gQmlvTG9naWNhLk1BTEUgPyAnTWFsZScgOiAnRmVtYWxlJyxcbiAgICAgICAgc2VsZWN0ZWRTZXhDbGFzcyA9IHNleCA9PT0gQmlvTG9naWNhLk1BTEUgPyAnbWFsZS1zZWxlY3RlZCcgOiAnZmVtYWxlLXNlbGVjdGVkJyxcbiAgICAgICAgQlVUVE9OX0lNQUdFX1dJRFRIID0gMTAwLFxuICAgICAgICBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCA9IEJVVFRPTl9JTUFHRV9XSURUSCAvIDIsXG4gICAgICAgIGltYWdlU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9LFxuICAgICAgICBsYWJlbCA9IHNob3dMYWJlbCA/IGAke2NhcFNleH0gJHtzcGVjaWVzfWAgOiAnJyxcbiAgICAgICAgbGFiZWxFbGVtZW50ID0gc2hvd0xhYmVsID8gPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogQlVUVE9OX0lNQUdFX1dJRFRILFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMH19PntsYWJlbH08L2Rpdj4gOiAnJztcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHRSZWN0ID0gZXZ0LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICBjbGlja1ggPSBldnQuY2xpZW50WCAtIGVsdFJlY3QubGVmdDtcblxuICAgIGlmIChzZXggPT09IEJpb0xvZ2ljYS5GRU1BTEUgJiYgY2xpY2tYID4gQlVUVE9OX0lNQUdFX01JRFBPSU5UX1gpeyAvLyB1c2VyIGNsaWNrZWQgb24gUmlnaHQgKG1hbGUpIGljb24gd2hpbGUgZmVtYWxlIHdhcyBzZWxlY3RlZFxuICAgICAgb25DaGFuZ2UoQmlvTG9naWNhLk1BTEUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzZXggPT09IEJpb0xvZ2ljYS5NQUxFICYmIGNsaWNrWCA8IEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YKXsgLy8gdXNlciBjbGlja2VkIG9uIExlZnQgKGZlbWFsZSkgaWNvbiB3aGlsZSBtYWxlIHdhcyBzZWxlY3RlZFxuICAgICAgb25DaGFuZ2UoQmlvTG9naWNhLkZFTUFMRSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgPGRpdiAgY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBjaGFuZ2Utc2V4LWJ1dHRvbnMgJHtzZWxlY3RlZFNleENsYXNzfWB9XG4gICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9ID5cbiAgICAgIDwvZGl2PlxuICAgICAge2xhYmVsRWxlbWVudH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNoYW5nZVNleEJ1dHRvbnMucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2V4OiBQcm9wVHlwZXMub25lT2YoW0Jpb0xvZ2ljYS5NQUxFLCBCaW9Mb2dpY2EuRkVNQUxFXSksXG4gIHNwZWNpZXM6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNob3dMYWJlbDogUHJvcFR5cGVzLmJvb2wsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhbmdlU2V4QnV0dG9ucztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbm9ybWFsOiB7XG4gICAgd2lkdGg6IDIzLFxuICAgIGhlaWdodDogMTIwLFxuICAgIHNwbGl0OiA0NVxuICB9LFxuICBzbWFsbDoge1xuICAgIHdpZHRoOiAxOSxcbiAgICBoZWlnaHQ6IDkwLFxuICAgIHNwbGl0OiAzNFxuICB9XG59O1xuXG5jb25zdCBkZWZhdWx0c1kgPSB7XG4gIG5vcm1hbDoge1xuICAgIHdpZHRoOiAyMyxcbiAgICBoZWlnaHQ6IDc1LFxuICAgIHNwbGl0OiAzOFxuICB9LFxuICBzbWFsbDoge1xuICAgIHdpZHRoOiAxOSxcbiAgICBoZWlnaHQ6IDYyLFxuICAgIHNwbGl0OiAzMlxuICB9XG59O1xuXG5jb25zdCBDaHJvbW9zb21lSW1hZ2VWaWV3ID0gKHt3aWR0aCwgaGVpZ2h0LCBzcGxpdD00NSwgY29sb3I9JyNGRjk5OTknLCBzbWFsbD1mYWxzZSwgYm9sZD1mYWxzZSwgZW1wdHk9ZmFsc2UsIHlDaHJvbW9zb21lPWZhbHNlLCBhbmltYXRpb25TdHlsaW5nfSkgPT4ge1xuICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpIHtcbiAgICBsZXQgZGVmYXVsdERpbXMgPSB5Q2hyb21vc29tZSA/IGRlZmF1bHRzWSA6IGRlZmF1bHRzO1xuICAgICh7d2lkdGgsIGhlaWdodCwgc3BsaXR9ID0gc21hbGwgPyBkZWZhdWx0RGltcy5zbWFsbCA6IGRlZmF1bHREaW1zLm5vcm1hbCk7XG4gIH1cblxuICBjb25zdCByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgICBpbWFnZVdpZHRoID0gd2lkdGgrNCxcbiAgICAgICAgaGFsZkltYWdlV2lkdGggPSBpbWFnZVdpZHRoLzIsXG4gICAgICAgIGltYWdlSGVpZ2h0ID0gaGVpZ2h0KzQ7XG5cbiAgbGV0IHN0cm9rZVdpZHRoID0gd2lkdGggPCAxMCA/IDEgOiAyO1xuXG4gIGlmIChib2xkKSB7XG4gICAgY29sb3IgPSAnI0ZGNjY2Nic7XG4gICAgc3Ryb2tlV2lkdGggPSAzO1xuICB9XG4gIGlmIChlbXB0eSkge1xuICAgIGNvbG9yID0gJyNGRkYnO1xuICAgIHN0cm9rZVdpZHRoID0gMTtcbiAgfVxuICBsZXQgcG9zaXRpb25TdHlsaW5nID0ge307XG4gIGlmIChhbmltYXRpb25TdHlsaW5nKXtcbiAgICBwb3NpdGlvblN0eWxpbmcgPSB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgbGVmdDogYW5pbWF0aW9uU3R5bGluZy54LCB0b3A6IGFuaW1hdGlvblN0eWxpbmcueSwgb3BhY2l0eTogYW5pbWF0aW9uU3R5bGluZy5vcGFjaXR5XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hyb21vc29tZS1pbWFnZVwiIHN0eWxlPXtwb3NpdGlvblN0eWxpbmd9PlxuICAgICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysyfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17aGVpZ2h0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD17KHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKX0gd2lkdGg9e3dpZHRofSB5PXtyYWRpdXMrMn0geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8cmVjdCBoZWlnaHQ9eyhoZWlnaHQtcmFkaXVzKS0oc3BsaXQrcmFkaXVzKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZUltYWdlVmlldy5wcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNwbGl0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc21hbGw6IFByb3BUeXBlcy5ib29sLFxuICBib2xkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZW1wdHk6IFByb3BUeXBlcy5ib29sLFxuICB5Q2hyb21vc29tZTogUHJvcFR5cGVzLmJvb2wsXG4gIGFuaW1hdGlvblN0eWxpbmc6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgICAgICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuaW1wb3J0IEFsbGVsZVZpZXcgZnJvbSAnLi9hbGxlbGUnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcbi8qKlxuICogVmlldyBvZiBhIHNpbmdsZSBjaHJvbW9zb21lLCB3aXRoIG9wdGlvbmFsIGxhYmVscywgcHVsbGRvd25zLCBhbmQgZW1iZWRkZWQgYWxsZWxlcy5cbiAqXG4gKiBEZWZpbmVkIEVJVEhFUiB1c2luZyBhIEJpb2xvZ2ljYSBDaHJvbW9zb21lIG9iamVjdCwgT1Igd2l0aCBhIEJpb2xvZ2ljYSBvcmdhbmlzbSxcbiAqIGNocm9tb3NvbWUgbmFtZSBhbmQgc2lkZS5cbiAqL1xuXG5jb25zdCBDaHJvbW9zb21lVmlldyA9ICh7Y2hyb21vc29tZSwgb3JnLCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgaGlkZGVuQWxsZWxlcyA9IFtdLCBzbWFsbCA9IGZhbHNlLCBlZGl0YWJsZSA9IHRydWUsIHNlbGVjdGVkID0gZmFsc2UsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZCwgc2hvd0xhYmVscyA9IHRydWUsIHNob3dBbGxlbGVzID0gZmFsc2UsIGxhYmVsc09uUmlnaHQgPSB0cnVlLCBvcmdOYW1lLCBkaXNwbGF5U3R5bGUgPSB7fX0pID0+IHtcbiAgdmFyIGNvbnRhaW5lckNsYXNzID0gXCJpdGVtc1wiLFxuICAgICAgZW1wdHkgPSBmYWxzZSxcbiAgICAgIHlDaHJvbW9zb21lID0gZmFsc2UsXG4gICAgICBsYWJlbHNDb250YWluZXIsIGFsbGVsZXNDb250YWluZXIsIGNocm9tSWQ7XG5cbiAgaWYgKG9yZyAmJiBjaHJvbW9zb21lTmFtZSAmJiBzaWRlKSB7XG4gICAgY2hyb21vc29tZSA9IG9yZy5nZXRHZW5vdHlwZSgpLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXVtzaWRlXTtcbiAgfVxuXG4gIGlmIChjaHJvbW9zb21lKSB7XG4gICAgbGV0IGFsbGVsZXMgPSBjaHJvbW9zb21lLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5maWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIGNocm9tb3NvbWUuc3BlY2llcyk7XG5cbiAgICBpZiAoc2hvd0xhYmVscykge1xuICAgICAgbGV0IGxhYmVscyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e2Nocm9tb3NvbWUuc3BlY2llc30gYWxsZWxlPXthfSBlZGl0YWJsZT17ZWRpdGFibGV9XG4gICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBvbkFsbGVsZUNoYW5nZShhLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBsYWJlbHNDb250YWluZXIgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG5cbiAgICAgIGlmICghbGFiZWxzT25SaWdodCkge1xuICAgICAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2hvd0FsbGVsZXMpIHtcbiAgICAgIGxldCBhbGxlbGVTeW1ib2xzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBbGxlbGVWaWV3IGtleT17YX0gYWxsZWxlPXthfSAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGFsbGVsZXNDb250YWluZXIgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxsZWxlc1wiPlxuICAgICAgICAgIHsgYWxsZWxlU3ltYm9scyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoY2hyb21vc29tZS5zaWRlID09PSBcInlcIikge1xuICAgICAgeUNocm9tb3NvbWUgPSB0cnVlO1xuICAgIH1cblxuICAgIGNocm9tSWQgPSBvcmdOYW1lICsgY2hyb21vc29tZS5jaHJvbW9zb21lICsgY2hyb21vc29tZS5zaWRlO1xuICB9IGVsc2Uge1xuICAgIGNocm9tSWQgPSBvcmdOYW1lO1xuICAgIGVtcHR5ID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBoYW5kbGVTZWxlY3QgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAob25DaHJvbW9zb21lU2VsZWN0ZWQpIHtcbiAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1jb250YWluZXJcIiBvbkNsaWNrPXsgaGFuZGxlU2VsZWN0IH0gPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNocm9tb3NvbWUtYWxsZWxlLWNvbnRhaW5lclwiIGlkPXtjaHJvbUlkfSBzdHlsZT17ZGlzcGxheVN0eWxlfT5cbiAgICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyBzbWFsbD17c21hbGx9IGVtcHR5PXtlbXB0eX0gYm9sZD17c2VsZWN0ZWR9IHlDaHJvbW9zb21lPXt5Q2hyb21vc29tZX0vPlxuICAgICAgICAgIHsgYWxsZWxlc0NvbnRhaW5lciB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7IGxhYmVsc0NvbnRhaW5lciB9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjaHJvbW9zb21lTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2lkZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2hyb21vc29tZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBzbWFsbDogUHJvcFR5cGVzLmJvb2wsXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBzaG93TGFiZWxzOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0FsbGVsZXM6IFByb3BUeXBlcy5ib29sLFxuICBsYWJlbHNPblJpZ2h0OiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2hyb21vc29tZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb3JnTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBVc2VzIGFuIFNWRyBjaXJjdWxhciBncmFkaWVudCB0byBpbXBsZW1lbnQgYSBmYWRpbmcgZ2xvdyBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIlxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgZGlhbWV0ZXIgb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBzdHlsZXMgYXBwbGllZCB0byB0aGUgb3V0ZXIgZGl2XG4gKi9cbmNvbnN0IENpcmN1bGFyR2xvd1ZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgc3R5bGV9KSA9PiB7XG4gIGxldCByYWRpdXMgPSBzaXplLzIsXG4gICAgICBjb2xvck5vSGFzaCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBncmFkaWVudElEID0gYENpcmN1bGFyR2xvd1ZpZXdfJHtpZCB8fCBjb2xvck5vSGFzaH1gLFxuICAgICAgZ3JhZGllbnRJRFVybCA9IGB1cmwoIyR7Z3JhZGllbnRJRH0pYDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaXJjdWxhci1nbG93XCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPXtncmFkaWVudElEfT5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIxLjBcIi8+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjBcIi8+XG4gICAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8Y2lyY2xlIGZpbGw9e2dyYWRpZW50SURVcmx9IGN4PXtyYWRpdXN9IGN5PXtyYWRpdXN9IHI9e3JhZGl1c30gLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2lyY3VsYXJHbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8vIGltYWdlIHNwZWNpZmllZCBhcyBDU1MgYmFja2dyb3VuZC1pbWFnZSwgYnV0IHNpemUgY29uc3RhbnRzIHJlcXVpcmVkIGluIEphdmFTY3JpcHRcbmV4cG9ydCBjb25zdCAgRUdHX0lNQUdFX1dJRFRIID0gNzUsXG4gICAgICAgICAgICAgIEVHR19JTUFHRV9IRUlHSFQgPSAxMDk7XG5cbmV4cG9ydCBjbGFzcyBFZ2dWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVnZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNwbGF5U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBoYW5kbGVDbGljayA9IChldnQpID0+IHtcbiAgICBjb25zdCB7IGVnZywgaWQsIGluZGV4LCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhpZCwgaW5kZXgsIGVnZyk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZWdnLCBpZCwgZGlzcGxheVN0eWxlLCBpc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGVnZ1N0eWxlID0gT2JqZWN0LmFzc2lnbih7IGZsZXhTaHJpbms6IDAgfSwgZGlzcGxheVN0eWxlKSxcbiAgICAgICAgICBpc0hpZGRlbiA9IChlZ2cgPT0gbnVsbCksXG4gICAgICAgICAgY2xhc3NlcyA9ICdjbHV0Y2gtZWdnJyArIChpc1NlbGVjdGVkID8gJyBzZWxlY3RlZCcgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKGlzSGlkZGVuID8gJyBoaWRkZW4nIDogJycpO1xuICAgIGlmIChkaXNwbGF5U3R5bGUgJiYgKGRpc3BsYXlTdHlsZS5zaXplICE9IG51bGwpKSB7XG4gICAgICBlZ2dTdHlsZS53aWR0aCA9IGRpc3BsYXlTdHlsZS5zaXplO1xuICAgICAgZWdnU3R5bGUuaGVpZ2h0ID0gZWdnU3R5bGUud2lkdGggKiAoRUdHX0lNQUdFX0hFSUdIVCAvIEVHR19JTUFHRV9XSURUSCk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtjbGFzc2VzfSBrZXk9e2lkfSByZWY9J2RvbU5vZGUnIHN0eWxlPXtlZ2dTdHlsZX0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30gLz5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IEVnZ0NsdXRjaFZpZXcgPSAoe2VnZ3MsIGlkUHJlZml4PSdlZ2ctJywgc2VsZWN0ZWRJbmRleCwgb25DbGlja30pID0+IHtcblxuICBjb25zdCBPRERfRUdHX01BUkdJTiA9IDgsXG4gICAgICAgIEVWRU5fRUdHX01BUkdJTiA9IDA7XG4gIGxldCBvcmdWaWV3cztcblxuICBmdW5jdGlvbiBlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgbWFyZ2luKSB7XG4gICAgY29uc3QgaWQgPSBgJHtpZFByZWZpeH0ke2luZGV4fWAsXG4gICAgICAgICAgdmlzaWJpbGl0eVN0eWxlID0gZWdnICYmIChlZ2cuYmFza2V0ID09IG51bGwpID8ge30gOiB7IHZpc2liaWxpdHk6ICdoaWRkZW4nIH0sXG4gICAgICAgICAgZWdnU3R5bGUgPSBPYmplY3QuYXNzaWduKHsgbWFyZ2luTGVmdDogbWFyZ2luLCBtYXJnaW5SaWdodDogbWFyZ2luIH0sIHZpc2liaWxpdHlTdHlsZSk7XG4gICAgcmV0dXJuIDxFZ2dWaWV3IGVnZz17ZWdnfSBpZD17aWR9IGtleT17aWR9IGluZGV4PXtpbmRleH0gZGlzcGxheVN0eWxlPXtlZ2dTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggPT09IHNlbGVjdGVkSW5kZXh9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+O1xuICB9XG5cbiAgLy8gZXZlbiBudW1iZXIgb2YgZWdnc1xuICBpZiAoZWdncy5sZW5ndGggJSAyID09PSAwKSB7XG4gICAgb3JnVmlld3MgPSBlZ2dzLnJlZHVjZSgocHJldiwgZWdnLCBpbmRleCkgPT4ge1xuICAgICAgLy8gZm9yIGZsZXggbGF5b3V0IHB1cnBvc2VzLCB3aXRoIG9kZCBudW1iZXJzIG9mIGl0ZW1zXG4gICAgICAvLyB3ZSBhZGQgc3BhY2VyIGl0ZW1zIGJldHdlZW4gdGhlIGVnZ3NcbiAgICAgIGNvbnN0IHNwYWNlcklEID0gYCR7aWRQcmVmaXh9JHtpbmRleH0tc3BhY2VyYCxcbiAgICAgICAgICAgIHNwYWNlclN0eWxlID0geyBtYXJnaW5MZWZ0OiBFVkVOX0VHR19NQVJHSU4sIG1hcmdpblJpZ2h0OiBFVkVOX0VHR19NQVJHSU4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicgfSxcbiAgICAgICAgICAgIHNwYWNlciA9IDxFZ2dWaWV3IGVnZz17bnVsbH0ga2V5PXtzcGFjZXJJRH0gZGlzcGxheVN0eWxlPXtzcGFjZXJTdHlsZX0gLz47XG4gICAgICBpZiAoaW5kZXggPCBlZ2dzLmxlbmd0aC8yKVxuICAgICAgICBwcmV2LnB1c2goc3BhY2VyKTtcbiAgICAgIHByZXYucHVzaChlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgRVZFTl9FR0dfTUFSR0lOKSk7XG4gICAgICBpZiAoaW5kZXggPj0gZWdncy5sZW5ndGgvMilcbiAgICAgICAgcHJldi5wdXNoKHNwYWNlcik7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9LCBbXSk7XG4gICAgLy9vcmdWaWV3cyA9IGVnZ3MubWFwKChlZ2csIGluZGV4KSA9PiBlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgRVZFTl9FR0dfTUFSR0lOKSk7XG4gIH1cblxuICBlbHNlIHtcbiAgICBvcmdWaWV3cyA9IGVnZ3MucmVkdWNlKChwcmV2LCBlZ2csIGluZGV4KSA9PiB7XG4gICAgICBwcmV2LnB1c2goZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIE9ERF9FR0dfTUFSR0lOKSk7XG4gICAgICAvLyBmb3IgZmxleCBsYXlvdXQgcHVycG9zZXMsIHdpdGggb2RkIG51bWJlcnMgb2YgaXRlbXNcbiAgICAgIC8vIHdlIGFkZCBzcGFjZXIgaXRlbXMgYmV0d2VlbiB0aGUgZWdnc1xuICAgICAgY29uc3Qgc3BhY2VySUQgPSBgJHtpZFByZWZpeH0ke2luZGV4fS1zcGFjZXJgLFxuICAgICAgICAgICAgc3BhY2VyU3R5bGUgPSB7IG1hcmdpbkxlZnQ6IE9ERF9FR0dfTUFSR0lOLCBtYXJnaW5SaWdodDogT0REX0VHR19NQVJHSU4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicgfTtcbiAgICAgIHByZXYucHVzaCg8RWdnVmlldyBlZ2c9e251bGx9IGtleT17c3BhY2VySUR9IGRpc3BsYXlTdHlsZT17c3BhY2VyU3R5bGV9IC8+KTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGVnZy1jbHV0Y2hcIj5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuRWdnQ2x1dGNoVmlldy5wcm9wVHlwZXMgPSB7XG4gIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWdnQ2x1dGNoVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgYSByZWN0YW5ndWxhciB0ZXh0IGFyZWEgZm9yIHByb3ZpZGluZyBmZWVkYmFjayB0byB1c2Vycywgc3VjaCBhc1xuICogdGhhdCB1c2VkIGluIEdlbml2ZXJzZSdzIGNoYWxsZW5nZXMgZm9yIHByb3ZpZGluZyB0cmlhbCBhbmQgZ29hbCBmZWVkYmFjay5cbiAqIEltcGxlbWVudGVkIGFzIGEgUmVhY3Qgc3RhdGVsZXNzIGZ1bmN0aW9uYWwgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSB0ZXh0IC0gYSBzaW5nbGUgb3IgbXVsdGlwbGUgbGluZXMgb2YgdGV4dCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBpbmxpbmUgc3R5bGVzIGFwcGxpZWQgdG8gdGhlIDxkaXY+IGNvbnRhaW5pbmcgZWFjaCBsaW5lIG9mIHRleHRcbiAqL1xuY29uc3QgRmVlZGJhY2tWaWV3ID0gKHt0ZXh0LCBzdHlsZT17fX0pID0+IHtcbiAgY29uc3QgdFRleHQgPSBBcnJheS5pc0FycmF5KHRleHQpID8gdGV4dCA6IFt0ZXh0XSxcbiAgICAgICAgbGluZUNvdW50ID0gdFRleHQubGVuZ3RoLFxuICAgICAgICBoZWlnaHQgPSAyMCAqIGxpbmVDb3VudCArIDIsXG4gICAgICAgIGRlZmF1bHRTdHlsZSA9IHsgaGVpZ2h0OiBoZWlnaHQsIC4uLnN0eWxlIH0sXG4gICAgICAgIHRleHRMaW5lcyA9IHRUZXh0Lm1hcCgoaVRleHQsIGluZGV4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjayB0ZXh0LWxpbmVcIiBrZXk9e2luZGV4fT57aVRleHR9PC9kaXY+KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjay12aWV3XCIgc3R5bGU9e2RlZmF1bHRTdHlsZX0+XG4gICAgICB7dGV4dExpbmVzfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuRmVlZGJhY2tWaWV3LnByb3BUeXBlcyA9IHtcbiAgdGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICAgICAgICBdKS5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmVlZGJhY2tWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgSU5JVElBTF9HQU1FVEVfU0laRSA9IDMwLFxuICAgICAgRklOQUxfR0FNRVRFX1NJWkUgPSAxNDAsXG4gICAgICBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCA9IDAsXG4gICAgICBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDE1MCxcbiAgICAgIEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCA9IDcwLFxuICAgICAgRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YID0gODAsXG4gICAgICBGSU5BTF9aWUdPVEVfWSA9IC0xNTA7XG5cbmV4cG9ydCBjb25zdCBHQU1FVEVfVFlQRSA9IHsgTU9USEVSOiAnbW90aGVyJywgRkFUSEVSOiAnZmF0aGVyJyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdHlwZTogUHJvcFR5cGVzLm9uZU9mKFsgR0FNRVRFX1RZUEUuTU9USEVSLCBHQU1FVEVfVFlQRS5GQVRIRVIgXSkuaXNSZXF1aXJlZCxcbiAgICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGZlcnRpbGl6YXRpb25TdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFsnbm9uZScsICdmZXJ0aWxpemluZycsICdmZXJ0aWxpemVkJywgJ2NvbXBsZXRlJ10pLmlzUmVxdWlyZWQsXG4gICAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgc3JjUmVjdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgZHN0UmVjdDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxlZnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHRvcDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gICAgfSksXG4gICAgYW5pbVN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICAgIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaGlkZGVuQWxsZWxlczogW10sXG4gICAgYW5pbVN0aWZmbmVzczogMTAwXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlciA9ICgpID0+IHtcbiAgICBsZXQge2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXMsIGFuaW1TdGlmZm5lc3MsIG9uUmVzdH0gPSB0aGlzLnByb3BzLFxuICAgICAgICB4T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LmxlZnQgLSB0aGlzLnByb3BzLmRzdFJlY3QubGVmdCA6IDAsXG4gICAgICAgIHlPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QudG9wIC0gdGhpcy5wcm9wcy5kc3RSZWN0LnRvcCA6IDAsXG4gICAgICAgIHhSZXN0aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogUkVTVElOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIHhGZXJ0aWxpemluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICBpbml0aWFsLCB0RmluYWw7XG5cbiAgICBpZiAoIWdhbWV0ZSB8fCAoaWQgPT0gbnVsbCkpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnByb3BzLmZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ25vbmUnKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIpXG4gICAgICAgIHhPZmZzZXQgKz0gUkVTVElOR19GQVRIRVJfR0FNRVRFX1g7XG4gICAgICBpbml0aWFsID0geyB4OiB4T2Zmc2V0LCB5OiB5T2Zmc2V0LCBzaXplOiBJTklUSUFMX0dBTUVURV9TSVpFIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSB9O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnByb3BzLmZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ2ZlcnRpbGl6aW5nJykge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiBGSU5BTF9aWUdPVEVfWSwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAwLjAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2lkfSBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsRGlzcGxheT17aW5pdGlhbH0gZGlzcGxheT17dEZpbmFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfSBvblJlc3Q9e29uUmVzdH0gLz5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBHYW1ldGVQb29sVmlldyA9ICh7Z2FtZXRlcywgaGlkZGVuQWxsZWxlcz1bXSwgd2lkdGg9MzAwLCBoZWlnaHQ9MjAwLCBhbmltU3RpZmZuZXNzPTYwLCBzZWxlY3RlZElkLCBpc0dhbWV0ZURpc2FibGVkLCBvbkdhbWV0ZVNlbGVjdGVkfSkgPT4ge1xuICBsZXQgZ2FtZXRlQ291bnQgPSBnYW1ldGVzLmxlbmd0aCxcbiAgICAgIGdhbWV0ZVNpemUgPSAzMCxcbiAgICAgIG1hcmdpbiA9IDUsXG4gICAgICBzcGFjaW5nRGVmYXVsdCA9IGdhbWV0ZVNpemUgKyAyICogbWFyZ2luLFxuICAgICAgeFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHlTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICBjb2xEZWZhdWx0ID0gTWF0aC5mbG9vcih3aWR0aCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIHJvd0RlZmF1bHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIGVuYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkRmxhZ3MgPSBpc0dhbWV0ZURpc2FibGVkID8gZ2FtZXRlcy5tYXAoZyA9PiBpc0dhbWV0ZURpc2FibGVkKGcpKSA6IFtdLFxuICAgICAgdG90YWxEaXNhYmxlZENvdW50ID0gZGlzYWJsZWRGbGFncy5yZWR1Y2UoKHRvdGFsLGZsYWcpID0+IHRvdGFsICsgZmxhZywgMCksXG4gICAgICAvLyBsZWF2ZSByb29tIGZvciB0aGUgZGlzYWJsZWQgZ2FtZXRlIHJvdyBpZiB0aGVyZSBhcmUgZGlzYWJsZWQgZ2FtZXRlc1xuICAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gaGVpZ2h0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA/IHNwYWNpbmdEZWZhdWx0IDogMCkgLSA0ICogbWFyZ2luLFxuICAgICAgLy8gcGFjayB0aGUgZGlzYWJsZWQgZ2FtZXRlcyBpbnRvIHRoZSBkaXNhYmxlZCByb3dcbiAgICAgIHhEaXNhYmxlZFNwYWNpbmcgPSBNYXRoLm1pbih4U3BhY2luZyAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpZHRoIC0gNyAqIG1hcmdpbikgLyB0b3RhbERpc2FibGVkQ291bnQpLFxuICAgICAgeURpc2FibGVkU3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgdG90YWxFbmFibGVkQ291bnQgPSBnYW1ldGVDb3VudCAtIHRvdGFsRGlzYWJsZWRDb3VudCxcbiAgICAgIGdhbWV0ZVZpZXdzO1xuXG4gIC8vIHNxdWVlemUgaW4gdG8gbWFrZSByb29tIGZvciBhZGRpdGlvbmFsIGdhbWV0ZXMgaWYgbmVjZXNzYXJ5XG4gIHZhciBjb2xDb3VudCA9IGNvbERlZmF1bHQsXG4gICAgICByb3dDb3VudCA9IHJvd0RlZmF1bHQgLSAodG90YWxEaXNhYmxlZENvdW50ID4gMCk7XG4gIHdoaWxlIChjb2xDb3VudCAqIHJvd0NvdW50IDwgdG90YWxFbmFibGVkQ291bnQpIHtcbiAgICBpZiAoeVNwYWNpbmcgPiB4U3BhY2luZykge1xuICAgICAgeVNwYWNpbmcgPSBhdmFpbGFibGVIZWlnaHQgLyArK3Jvd0NvdW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHhTcGFjaW5nID0gKHdpZHRoIC0gNCAqIG1hcmdpbikgLyArK2NvbENvdW50O1xuICAgIH1cbiAgfVxuXG4gIGdhbWV0ZVZpZXdzID0gZ2FtZXRlcy5tYXAoKGdhbWV0ZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gZGlzYWJsZWRGbGFnc1tpbmRleF0sXG4gICAgICAgICAgbGF5b3V0SW5kZXggPSBpc0Rpc2FibGVkID8gZGlzYWJsZWRDb3VudCsrIDogZW5hYmxlZENvdW50KyssXG4gICAgICAgICAgcm93ID0gaXNEaXNhYmxlZCA/IHJvd0RlZmF1bHQgLSAxIDogTWF0aC5mbG9vcihsYXlvdXRJbmRleCAvIGNvbENvdW50KSxcbiAgICAgICAgICBjb2wgPSBpc0Rpc2FibGVkID8gbGF5b3V0SW5kZXggOiBsYXlvdXRJbmRleCAlIGNvbENvdW50LFxuICAgICAgICAgIHkgPSBpc0Rpc2FibGVkID8gcm93ICogeURpc2FibGVkU3BhY2luZyA6IHJvdyAqIHlTcGFjaW5nLFxuICAgICAgICAgIHggPSBpc0Rpc2FibGVkID8gY29sICogeERpc2FibGVkU3BhY2luZyA6IGNvbCAqIHhTcGFjaW5nO1xuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aW5kZXggKyAxfSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsRGlzcGxheT17eyB4OiBNYXRoLnJvdW5kKHdpZHRoLzIpLCB5OiAtTWF0aC5yb3VuZCh5U3BhY2luZykgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT17eyB4OiBNYXRoLnJvdW5kKHgpLCB5OiBNYXRoLnJvdW5kKHkpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1TdGlmZm5lc3M9e2FuaW1TdGlmZm5lc3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ICsgMSA9PT0gc2VsZWN0ZWRJZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25HYW1ldGVTZWxlY3RlZH0gLz5cbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnYW1ldGUtcG9vbFwiIHN0eWxlPXt7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfX0+XG4gICAgICB7IGdhbWV0ZVZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVBvb2xWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNlbGVjdGVkSWQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzR2FtZXRlRGlzYWJsZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvbkdhbWV0ZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlUG9vbFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgZGlzcGxheSwgaXNTZWxlY3RlZD1mYWxzZSwgaXNEaXNhYmxlZD1mYWxzZSwgb25DbGlja30pID0+IHtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIHJlY3QgPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKCFpc0Rpc2FibGVkICYmIG9uQ2xpY2spIHtcbiAgICAgIG9uQ2xpY2soZXZ0LCBpZCwgcmVjdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSkge1xuICAgIGxldCB0b29sdGlwID0gXCJcIixcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcztcbiAgICAvLyBOb3RlOiBpdCB3b3VsZCBiZSBtb3JlIGVmZmljaWVudCBmb3IgdGhlIGNhbGxlciB0byBwYXNzIGluIHRoZVxuICAgIC8vIGFsbEhpZGRlbkFsbGVsZXMgYXJyYXkgcmF0aGVyIHRoYW4gY29tcHV0aW5nIGl0IGVhY2ggdGltZSBoZXJlLlxuICAgIC8vIEJ1dCBpZiB3ZSBtb3ZlZCBpdCBvdXQgcmlnaHQgbm93IHdlJ2QgaGF2ZSB0byBlbGltaW5hdGUgdGhlIEVTNiBzcGxhdC5cbiAgICBmdW5jdGlvbiBjb25jYXRIaWRkZW5BbGxlbGVzKGlTcGVjaWVzLCBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgYWxsSGlkZGVuQWxsZWxlcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCBhbGxlbGUgb2YgaUhpZGRlbkFsbGVsZXMpIHtcbiAgICAgICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoaVNwZWNpZXMsIGFsbGVsZSk7XG4gICAgICAgIGFsbEhpZGRlbkFsbGVsZXMucHVzaCguLi5nZW5lLmFsbGVsZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGNoIGluIGdhbWV0ZSkge1xuICAgICAgdmFyIGNocm9tb3NvbWUgPSBnYW1ldGVbY2hdO1xuICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMgPT0gbnVsbClcbiAgICAgICAgY29uY2F0SGlkZGVuQWxsZWxlcyhjaHJvbW9zb21lLnNwZWNpZXMsIGhpZGRlbkFsbGVsZXMpO1xuICAgICAgZm9yIChjb25zdCBhbGxlbGUgb2YgY2hyb21vc29tZS5hbGxlbGVzKSB7XG4gICAgICAgIGlmIChhbGxIaWRkZW5BbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA8IDApIHtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IGNocm9tb3NvbWUuc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIGxhYmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2ggPT09ICdYWScpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjaHJvbW9zb21lLnNpZGUgPT09ICd5JyA/ICd5JyA6ICd4JztcbiAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b29sdGlwO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWRDbGFzcyA9IGlzU2VsZWN0ZWQgJiYgIWlzRGlzYWJsZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwiLFxuICAgICAgICBkaXNhYmxlZENsYXNzID0gaXNEaXNhYmxlZCA/IFwiZGlzYWJsZWRcIiA6IFwiXCIsXG4gICAgICAgIGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgY2xhc3NlcyA9IGBnZW5pYmxvY2tzIGdhbWV0ZSAke3NlbGVjdGVkQ2xhc3N9ICR7ZGlzYWJsZWRDbGFzc30gZ3JvdXAke2dyb3VwfWAsXG4gICAgICAgIHNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIHJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIHRyYW5zZm9ybSA9IHJvdGF0aW9uID8gYHJvdGF0ZSgke3JvdGF0aW9ufWRlZylgIDogJycsXG4gICAgICAgIG9wYWNpdHkgPSBkaXNwbGF5Lm9wYWNpdHkgIT0gbnVsbCA/IGRpc3BsYXkub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgdG9vbHRpcCA9IGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB0aXRsZT17dG9vbHRpcH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgbGVmdDogZGlzcGxheS54LCB0b3A6IGRpc3BsYXkueSxcbiAgICAgICAgICAgIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICB0cmFuc2Zvcm0sIG9wYWNpdHlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7ICAgICAgICAvLyBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KS5pc1JlcXVpcmVkLFxuICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEdlbmVMYWJlbFZpZXcgPSAoe3NwZWNpZXMsIGFsbGVsZSwgZWRpdGFibGU9ZmFsc2UsIG9uQWxsZWxlQ2hhbmdlfSkgPT4ge1xuICBpZiAoIWVkaXRhYmxlKSB7XG4gICAgY29uc3QgYWxsZWxlTmFtZSA9IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbmUtbGFiZWwgYWxsZWxlIG5vbmVkaXRhYmxlXCI+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHsgYWxsZWxlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYWxsZWxlcyA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYWxsZWxlKS5hbGxlbGVzLFxuICAgICAgICAgIGFsbGVsZU5hbWVzID0gYWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGVzW2ldfT57bmFtZX08L29wdGlvbj4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5lLWxhYmVsIGFsbGVsZSBlZGl0YWJsZVwiPlxuICAgICAgICA8c2VsZWN0IHZhbHVlPXsgYWxsZWxlIH0gb25DaGFuZ2U9eyBvbkFsbGVsZUNoYW5nZSB9PlxuICAgICAgICAgIHsgYWxsZWxlT3B0aW9ucyB9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5lTGFiZWxWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZUltYWdlVmlldyBmcm9tICcuL2Nocm9tb3NvbWUtaW1hZ2UnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcblxubGV0IFRlc3RQdWxsZG93blZpZXcgPSAoe3NwZWNpZXMsIGdlbmUsIHNlbGVjdGlvbiwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gICAgICBsZXQgYWxsZWxlcyA9IGdlbmUuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgbnVtQWxsZWxlcyA9IGFsbGVsZU5hbWVzLmxlbmd0aCxcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcyA9IFtdLFxuICAgICAgICAgIGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb24gfHwgXCJwbGFjZWhvbGRlclwiLFxuICAgICAgICAgIGksIGo7XG5cbiAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9XCJwbGFjZWhvbGRlclwiIHZhbHVlPVwicGxhY2Vob2xkZXJcIiBkaXNhYmxlZD1cImRpc2FibGVkXCI+U2VsZWN0IGEgR2Vub3R5cGU8L29wdGlvbj4pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQWxsZWxlczsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IGk7IGogPCBudW1BbGxlbGVzOyBqKyspIHtcbiAgICAgICAgICBsZXQga2V5ID0gaSArIFwiIFwiICsgaixcbiAgICAgICAgICAgICAgc3RyaW5nID0gYWxsZWxlTmFtZXNbaV0gKyBcIiAvIFwiICsgYWxsZWxlTmFtZXNbal07XG4gICAgICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT17a2V5fSB2YWx1ZT17a2V5fT57c3RyaW5nfTwvb3B0aW9uPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Qtd3JhcHBlclwiPlxuICAgICAgICAgIDxzZWxlY3QgdmFsdWU9eyBjdXJyZW50U2VsZWN0aW9uIH0gb25DaGFuZ2U9eyBvblNlbGVjdGlvbkNoYW5nZSB9PlxuICAgICAgICAgICAgeyBwb3NzaWJsZUNvbWJvcyB9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9O1xuXG5jb25zdCBHZW5vbWVUZXN0VmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzPVtdLCBzZWxlY3Rpb249e30sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIGFsbGVsZXMgPSBjaHJvbVtPYmplY3Qua2V5cyhjaHJvbSlbMF1dLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5maWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIG9yZy5zcGVjaWVzKSxcbiAgICAgICAgZ2VuZXMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKG9yZy5zcGVjaWVzLCBhKSksXG4gICAgICAgIHB1bGxkb3ducyA9IGdlbmVzLm1hcChnID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRlc3RQdWxsZG93blZpZXdcbiAgICAgICAgICAgICAga2V5ICAgICAgID0geyBnLm5hbWUgfVxuICAgICAgICAgICAgICBzcGVjaWVzICAgPSB7IG9yZy5zcGVjaWVzIH1cbiAgICAgICAgICAgICAgZ2VuZSAgICAgID0geyBnIH1cbiAgICAgICAgICAgICAgc2VsZWN0aW9uID0geyBzZWxlY3Rpb25bZy5uYW1lXSB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlID0geyBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlKGcsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiIGtleT17Y2hyb21vc29tZU5hbWV9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbm9tZS10ZXN0LW9wdGlvbnNcIj5cbiAgICAgICAgICB7IHB1bGxkb3ducyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWUtdGVzdFwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuVGVzdFB1bGxkb3duVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZ2VuZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3Rpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5HZW5vbWVUZXN0Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIHNlbGVjdGlvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVRlc3RWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lJztcblxuLyoqXG4gKiBWaWV3IG9mIHRoZSBzZXQgb2YgY2hyb21vc29tZXMgb2YgYW4gb3JnYW5pc20sIG9yZGVyZWQgYXMgbWF0Y2hlZCBwYWlycy5cbiAqXG4gKiBVc3VhbGx5IGRlZmluZWQgYnkgcGFzc2luZyBpbiBhIEJpb2xvZ2ljYSBPcmdhbmlzbSwgYnV0IG1heSBhbHNvIGJlIGRlZmluZWQgYnlcbiAqIHBhc3NpbmcgaW4gYSBtYXAgb2YgQmlvbG9naWNhIENocm9tb3NvbWVzIGFuZCBhIEJpb2xvZ2ljYSBTcGVjaWVzLlxuICovXG5jb25zdCBHZW5vbWVWaWV3ID0gKHtvcmcsIGNsYXNzTmFtZT1cIlwiLCBjaHJvbW9zb21lcywgc3BlY2llcywgaGlkZGVuQWxsZWxlcyA9IFtdLCBlZGl0YWJsZT10cnVlLCBzaG93TGFiZWxzPXRydWUsIHNob3dBbGxlbGVzPWZhbHNlLCBzZWxlY3RlZENocm9tb3NvbWVzPXt9LCBzbWFsbD1mYWxzZSwgb3JnTmFtZSwgZGlzcGxheVN0eWxlLCBvbkFsbGVsZUNoYW5nZSwgb25DaHJvbW9zb21lU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXTtcbiAgaWYgKG9yZykge1xuICAgIGNocm9tb3NvbWVzID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzO1xuICAgIHNwZWNpZXMgPSBvcmcuc3BlY2llcztcbiAgfVxuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBzcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IGNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgcGFpcnMgPSBbXTtcbiAgICBmb3IgKGxldCBzaWRlIGluIGNocm9tKSB7XG4gICAgICBsZXQgY2hyb21vc29tZSA9IGNocm9tW3NpZGVdO1xuICAgICAgcGFpcnMucHVzaChcbiAgICAgICAgPENocm9tb3NvbWVWaWV3XG4gICAgICAgICAgY2hyb21vc29tZT17Y2hyb21vc29tZX1cbiAgICAgICAgICBrZXk9e3BhaXJzLmxlbmd0aCArIDF9XG4gICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICBsYWJlbHNPblJpZ2h0PXtwYWlycy5sZW5ndGg+MCB8fCBzaWRlPT09XCJiXCJ9XG4gICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlfVxuICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZENocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSA9PT0gc2lkZX1cbiAgICAgICAgICBzaG93TGFiZWxzPXtzaG93TGFiZWxzfVxuICAgICAgICAgIHNob3dBbGxlbGVzPXtzaG93QWxsZWxlc31cbiAgICAgICAgICBzbWFsbD17c21hbGx9XG4gICAgICAgICAgb3JnTmFtZT17b3JnTmFtZX1cbiAgICAgICAgICBkaXNwbGF5U3R5bGU9e2Rpc3BsYXlTdHlsZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24ocHJldkFsbGVsZSwgbmV3QWxsZWxlKSB7XG4gICAgICAgICAgICBvbkFsbGVsZUNoYW5nZShjaHJvbW9zb21lTmFtZSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkPXtmdW5jdGlvbihlbCl7XG4gICAgICAgICAgICBpZiAob25DaHJvbW9zb21lU2VsZWN0ZWQpXG4gICAgICAgICAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkKG9yZywgY2hyb21vc29tZU5hbWUsIHNpZGUsIGVsKTtcbiAgICAgICAgICB9fS8+XG4gICAgICApO1xuICAgIH1cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLXBhaXJcIiBrZXk9e3BhaXJXcmFwcGVycy5sZW5ndGggKyAxfT5cbiAgICAgICAgeyBwYWlycyB9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIGNvbnN0IGNsYXNzZXMgPSBcImdlbmlibG9ja3MgZ2Vub21lXCIgKyAoY2xhc3NOYW1lID8gXCIgXCIgKyBjbGFzc05hbWUgOiBcIlwiKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNocm9tb3NvbWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgZWRpdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBzaG93TGFiZWxzOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0FsbGVsZXM6IFByb3BUeXBlcy5ib29sLFxuICBzZWxlY3RlZENocm9tb3NvbWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzbWFsbDogUHJvcFR5cGVzLmJvb2wsXG4gIGRpc3BsYXlTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaHJvbW9zb21lU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvcmdOYW1lOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBHbG93QmFja2dyb3VuZFZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgY29udGFpbmVyU3R5bGU9e30sIGdsb3dTdHlsZT17fSwgQ2hpbGRDb21wb25lbnQsIGNoaWxkU3R5bGU9e30sIC4uLm90aGVyc30pID0+IHtcbiAgY29uc3QgdENvbnRhaW5lclN0eWxlID0geyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSwgLi4uY29udGFpbmVyU3R5bGUgfSxcbiAgICAgICAgdEdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmdsb3dTdHlsZSB9LFxuICAgICAgICB0Q2hpbGRTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmNoaWxkU3R5bGUgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnbG93LWJhY2tncm91bmRcIiBzdHlsZT17dENvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGlkPXsnZ2xvdy0nK2lkfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXt0R2xvd1N0eWxlfS8+XG4gICAgICA8Q2hpbGRDb21wb25lbnQgaWQ9eydjaGlsZC0nK2lkfSBzdHlsZT17dENoaWxkU3R5bGV9IHdpZHRoPXtzaXplfSB7Li4ub3RoZXJzfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2xvd0JhY2tncm91bmRWaWV3LnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBjb250YWluZXJTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2xvd1N0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBDaGlsZENvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgY2hpbGRTdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2xvd0JhY2tncm91bmRWaWV3O1xuIiwiLypcbiAqIEJhc2VkIG9uIFJlYWN0T3ZlcmxheXMgZGVtbyBhdCBodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9yZWFjdC1vdmVybGF5cy9leGFtcGxlcy8jbW9kYWxzXG4gKi9cbmltcG9ydCBNb2RhbCBmcm9tICdyZWFjdC1vdmVybGF5cy9saWIvTW9kYWwnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQgQ2hhbGxlbmdlQXdhcmRWaWV3IGZyb20gJy4vY2hhbGxlbmdlLWF3YXJkJztcbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdCBmcm9tICcuLi91dGlsaXRpZXMvdHJhbnNsYXRlJztcblxuY29uc3QgbW9kYWxTdHlsZSA9IHtcbiAgcG9zaXRpb246ICdmaXhlZCcsXG4gIHpJbmRleDogMTA0MCxcbiAgdG9wOiAwLCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwXG59O1xuXG5jb25zdCBiYWNrZHJvcFN0eWxlID0ge1xuICAuLi5tb2RhbFN0eWxlLFxuICB6SW5kZXg6ICdhdXRvJyxcbiAgYmFja2dyb3VuZENvbG9yOiAnIzAwMCcsXG4gIG9wYWNpdHk6IDAuMVxufTtcblxuY29uc3QgZGlhbG9nU3R5bGUgPSBmdW5jdGlvbih0b3A9XCI1MCVcIikge1xuICAvLyB3ZSB1c2Ugc29tZSBwc2V1ZG8gcmFuZG9tIGNvb3JkcyBzbyBuZXN0ZWQgbW9kYWxzXG4gIC8vIGRvbid0IHNpdCByaWdodCBvbiB0b3Agb2YgZWFjaCBvdGhlci5cbiAgbGV0IGxlZnQgPSA1MDtcbiAgcmV0dXJuIHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogMzg1LFxuICAgIHRvcDogdG9wLCBsZWZ0OiBsZWZ0ICsgJyUnLFxuICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAtJHtsZWZ0fSUpYCxcbiAgICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwocmVzb3VyY2VzL2ltYWdlcy9wYXJjaG1lbnQuanBnKScsXG4gICAgYmFja2dyb3VuZFJlcGVhdDogJ25vLXJlcGVhdCcsXG4gICAgYmFja2dyb3VuZE9yaWdpbjogJ2JvcmRlci1ib3gnLFxuICAgIGJveFNoYWRvdzogJzAgMTBweCA1cHggcmdiYSgwLDAsMCwuNSknLFxuICAgIHBhZGRpbmc6IDIwLFxuICAgIG91dGxpbmU6ICdub25lJ1xuICB9O1xufTtcblxuXG5jbGFzcyBNb2RhbEFsZXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNob3c6IFByb3BUeXBlcy5ib29sLFxuICAgIG1lc3NhZ2U6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgIGV4cGxhbmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuYXJyYXldKSxcbiAgICBsZWZ0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICByaWdodEJ1dHRvbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuYXJyYXldKSxcbiAgICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG4gICAgfSksXG4gICAgb25IaWRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkxlZnRCdXR0b25DbGljazogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyBvcHRpb25hbCBjbGljayBoYW5kbGVycyBpZiBub3QgZGVmaW5lZFxuICAgIG9uUmlnaHRCdXR0b25DbGljazogUHJvcFR5cGVzLmZ1bmMsICAgICAgIC8vIGluIGJ1dHRvbiBwcm9wcy4gKEJldHRlciBmb3IgYG1hcERpc3BhdGNoVG9Qcm9wc2ApXG4gICAgY2hhbGxlbmdlQXdhcmRzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHRvcDogUHJvcFR5cGVzLnN0cmluZ1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzaG93OiBmYWxzZSxcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IHsgaWQ6MCwgcHJvZ3Jlc3M6IFtdIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvKiBlc2xpbnQgcmVhY3QvanN4LWhhbmRsZXItbmFtZXM6IDAgKi9cbiAgICBjb25zdCBsZWZ0UHJvcHMgPSB0aGlzLnByb3BzLmxlZnRCdXR0b24gfHwge30sXG4gICAgICAgICAgbGVmdEJ1dHRvbiA9IGxlZnRQcm9wcy5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgPyA8QnV0dG9uIGxhYmVsPXtsZWZ0UHJvcHMubGFiZWwgfHwgXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhbGVydC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2xlZnRQcm9wcy5vbkNsaWNrIHx8IHRoaXMucHJvcHMub25MZWZ0QnV0dG9uQ2xpY2t9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICByaWdodFByb3BzID0gdGhpcy5wcm9wcy5yaWdodEJ1dHRvbiB8fCB7fSxcbiAgICAgICAgICByaWdodEJ1dHRvbiA9IDxCdXR0b24gbGFiZWw9e3JpZ2h0UHJvcHMubGFiZWwgfHwgXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWxlcnQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17cmlnaHRQcm9wcy5vbkNsaWNrIHx8IHRoaXMucHJvcHMub25SaWdodEJ1dHRvbkNsaWNrfS8+O1xuICAgIHZhciBhd2FyZFZpZXcsIGV4cGxhbmF0aW9uVmlldztcblxuICAgIGlmICh0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcyl7XG4gICAgICBhd2FyZFZpZXcgPSA8Q2hhbGxlbmdlQXdhcmRWaWV3IGNoYWxsZW5nZUF3YXJkcz17dGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHN9IC8+O1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5leHBsYW5hdGlvbikge1xuICAgICAgZXhwbGFuYXRpb25WaWV3ID0gPHA+e3QodGhpcy5wcm9wcy5leHBsYW5hdGlvbil9PC9wPjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxNb2RhbCAgYXJpYS1sYWJlbGxlZGJ5PSdtb2RhbC1sYWJlbCdcbiAgICAgICAgICAgICAgc3R5bGU9e21vZGFsU3R5bGV9XG4gICAgICAgICAgICAgIGJhY2tkcm9wU3R5bGU9e2JhY2tkcm9wU3R5bGV9XG4gICAgICAgICAgICAgIHNob3c9e3RoaXMucHJvcHMuc2hvd31cbiAgICAgICAgICAgICAgb25IaWRlPXt0aGlzLnByb3BzLm9uSGlkZX0gPlxuICAgICAgICA8ZGl2IHN0eWxlPXtkaWFsb2dTdHlsZSh0aGlzLnByb3BzLnRvcCl9ID5cbiAgICAgICAgICA8aDQgaWQ9J21vZGFsLWxhYmVsJz57dCh0aGlzLnByb3BzLm1lc3NhZ2UpfTwvaDQ+XG4gICAgICAgICAge2F3YXJkVmlld31cbiAgICAgICAgICB7ZXhwbGFuYXRpb25WaWV3fVxuICAgICAgICAgIHtsZWZ0QnV0dG9ufSB7cmlnaHRCdXR0b259XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Nb2RhbD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsQWxlcnQ7XG5cbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBQcmVzZW50cyBlaXRoZXIgYSBCaW9Mb2dpY2Egb3JnYW5pc20gb3IgYSBzaW1wbGUgbnVtYmVyIHdpdGhpbiBhIHNxdWFyZSBib3JkZXIuXG4gKiBEZXNpZ25lZCB0byBiZSB1c2VkIGFzIHRyaWFsIGZlZWRiYWNrIGluZGljYXRpbmcgdGhlIG51bWJlciBvZiB0cmlhbHMgc3VjY2Vzc2Z1bGx5XG4gKiBjb21wbGV0ZWQsIGZvciBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBhIHVuaXF1ZSBpZCBmb3IgQ1NTIHB1cnBvc2VzXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gQ1NTIGNsYXNzIHRvIGJlIGFwcGxpZWRcbiAqIEBwYXJhbSB7bnVtYmVyfSBvcmRpbmFsIC0gdGhlIG51bWVyaWMgdmFsdWUgdG8gYmUgcmVwcmVzZW50ZWQgaWYgbm8gb3JnYW5pc20gc3BlY2lmaWVkXG4gKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gb3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gYmUgcmVwcmVzZW50ZWRcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHZpZXdcbiAqL1xuY29uc3QgT3JkaW5hbE9yZ2FuaXNtVmlldyA9ICh7aWQsIGNsYXNzTmFtZSwgb3JkaW5hbCwgb3JnYW5pc20sIHNpemU9MzIsIC4uLm90aGVyfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHsgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSB9LFxuICAgICAgICBvcmdWaWV3ID0gb3JnYW5pc20gIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICA/IDxPcmdhbmlzbVZpZXcgaWQ9e2Ake2lkfS1vcmdhbmlzbWB9IG9yZz17b3JnYW5pc219IHdpZHRoPXtzaXplfSB7Li4ub3RoZXJ9IC8+XG4gICAgICAgICAgICAgICAgICAgIDogPGRpdiBjbGFzc05hbWU9J29yZGluYWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAge29yZGluYWx9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT17YGdlbmlibG9ja3Mgb3JkaW5hbC1vcmdhbmlzbSAke2NsYXNzTmFtZX1gfSBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgeyBvcmdWaWV3IH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZGluYWxPcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvcmRpbmFsOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvcmdhbmlzbTogUHJvcFR5cGVzLm9iamVjdCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JkaW5hbE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBhcyBhbiBpbWFnZSBvbiB0b3Agb2YgYSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IG9yZyAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kIHZpZXcuXG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICovXG5jb25zdCBPcmdhbmlzbUdsb3dWaWV3ID0gKHtpZD0nb3JnLWdsb3cnLCBjbGFzc05hbWU9JycsIGNvbG9yPVwiI0ZGRkZBQVwiLCBzaXplPTIwMCwgc3R5bGU9e30sIGdsb3dTdHlsZT17fSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgbG9jYWxHbG93U3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5nbG93U3R5bGUgfSxcbiAgICAgICAgb3JnU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT17YGdlbmlibG9ja3Mgb3JnYW5pc20tZ2xvdyAke2NsYXNzTmFtZX1gfSBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgaWQ9e2Ake2lkfS1nbG93YH0gY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17bG9jYWxHbG93U3R5bGV9Lz5cbiAgICAgIDxPcmdhbmlzbVZpZXcgaWQ9e2Ake2lkfS1vcmdhbmlzbWB9IHdpZHRoPXtzaXplfSBzdHlsZT17b3JnU3R5bGV9IHsuLi5vdGhlcn0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGdsb3dTdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBPcmdhbmlzbVZpZXcgPSAoe29yZywgaWQsIGNsYXNzTmFtZT1cIlwiLCB3aWR0aD0yMDAsIGZsaXBwZWQ9ZmFsc2UsIHN0eWxlPXt9LCBvbkNsaWNrLCB3cmFwcGVyIH0pID0+IHtcbiAgY29uc3QgYmFzZVVybCA9IFwiaHR0cHM6Ly9nZW5pdmVyc2UtcmVzb3VyY2VzLmNvbmNvcmQub3JnL3Jlc291cmNlcy9kcmFrZXMvaW1hZ2VzL1wiLFxuICAgICAgICB1cmwgICAgID0gb3JnID8gYmFzZVVybCArIG9yZy5nZXRJbWFnZU5hbWUoKSA6IG51bGwsXG4gICAgICAgIC8vIFRoZSBnb2FsIGhlcmUgd2FzIHRvIGhhdmUgdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgc2VsZWN0IHRoZSBvcmdhbmlzbSxcbiAgICAgICAgLy8gc28gdGhhdCBtb3VzZWRvd24tZHJhZyB3aWxsIGJvdGggc2VsZWN0IHRoZSBvcmdhbmlzbSBhbmQgYmVnaW4gdGhlXG4gICAgICAgIC8vIGRyYWcuIFRoaXMgd29ya3Mgb24gQ2hyb21lIGFuZCBTYWZhcmksIGJ1dCBvbiBGaXJlZm94IGl0IGRpc2FibGVzXG4gICAgICAgIC8vIGRyYWdnaW5nLiBEaXNhYmxpbmcgdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgbWVhbnMgdGhhdCBGaXJlZm94IHVzZXJzXG4gICAgICAgIC8vIG11c3QgY2xpY2sgdG8gc2VsZWN0IGFuZCB0aGVuIGNsaWNrIHRvIGRyYWcsIGJ1dCBhdCBsZWFzdCB0aGV5IGNhblxuICAgICAgICAvLyBkcmFnLiBUaGUgcmlnaHQgc29sdXRpb24gaXMgcHJvYmFibHkgdG8gYWxsb3cgb3JnYW5pc21zIHRvIGJlIGRyYWdnZWRcbiAgICAgICAgLy8gd2hldGhlciBvciBub3QgdGhleSdyZSBzZWxlY3RlZCBhbmQgdGhlbiBob3BlZnVsbHkgdGhlIG9uTW91c2VEb3duXG4gICAgICAgIC8vIGhhbmRsZXIgd2lsbCB3b3JrIGFzIGV4cGVjdGVkLiBPdGhlcndpc2UsIGl0IG1heSBiZSBuZWNlc3NhcnkgdG9cbiAgICAgICAgLy8gc2VsZWN0IHRoZSBvcmdhbmlzbSAoaWYgaXQgaXNuJ3QgYWxyZWFkeSBzZWxlY3RlZCkgaW4gYmVnaW5EcmFnLlxuICAgICAgICBpc0ZpcmVmb3ggPSAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+PSAwKSxcbiAgICAgICAgaGFuZGxlTW91c2VEb3duID0gaXNGaXJlZm94ID8gdW5kZWZpbmVkIDogaGFuZGxlQ2xpY2ssXG4gICAgICAgIGRpdldyYXBwZXIgPSB3cmFwcGVyIHx8IGZ1bmN0aW9uKGVsdCkgeyByZXR1cm4gZWx0OyB9O1xuXG4gIGxldCBjbGFzc2VzID0gXCJnZW5pYmxvY2tzIG9yZ2FuaXNtXCIgKyAoY2xhc3NOYW1lID8gXCIgXCIgKyBjbGFzc05hbWUgOiBcIlwiKTtcbiAgaWYgKGZsaXBwZWQpIHtcbiAgICBjbGFzc2VzICs9IFwiIGZsaXBwZWRcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGlkLCBvcmcpO1xuICB9XG5cbiAgcmV0dXJuIGRpdldyYXBwZXIoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IGlkPXtpZH0gc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIG9uTW91c2VEb3duPXtvbkNsaWNrID8gaGFuZGxlTW91c2VEb3duIDogbnVsbH1cbiAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrID8gaGFuZGxlQ2xpY2sgOiBudWxsfT5cbiAgICAgIHt1cmwgPyA8aW1nIHNyYz17dXJsfSB3aWR0aD17d2lkdGh9IC8+IDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgd3JhcHBlcjogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFBlblZpZXcgZnJvbSAnLi9wZW4nO1xuaW1wb3J0IFN0YXRzVmlldyBmcm9tICcuL3N0YXRzJztcbmltcG9ydCBUYWJzIGZyb20gJ3JlYWN0LXNpbXBsZXRhYnMnO1xuXG5jbGFzcyBQZW5TdGF0c1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb3JnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICBsYXN0Q2x1dGNoU2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvcmdzLCBsYXN0Q2x1dGNoU2l6ZSwgc2VsZWN0ZWRJbmRleCwgb25TZWxlY3Rpb25DaGFuZ2UsIC4uLm90aGVycyB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBsYXN0Q2x1dGNoID0gb3Jncy5zbGljZSgtbGFzdENsdXRjaFNpemUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUYWJzPlxuICAgICAgICA8VGFicy5QYW5lbCB0aXRsZT1cIkJyZWVkaW5nIFBlblwiIGtleT1cIkJyZWVkaW5nIFBlblwiPlxuICAgICAgICAgIDxQZW5WaWV3IG9yZ3M9e2xhc3RDbHV0Y2h9IHsuLi5vdGhlcnN9XG4gICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4PXtzZWxlY3RlZEluZGV4fVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17ZnVuY3Rpb24oaVNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uU2VsZWN0aW9uQ2hhbmdlKVxuICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlKGlTZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvVGFicy5QYW5lbD5cbiAgICAgICAgPFRhYnMuUGFuZWwgdGl0bGU9XCJTdGF0c1wiIGtleT1cIlN0YXRzXCI+XG4gICAgICAgICAgPFN0YXRzVmlldyBvcmdzPXtvcmdzfSBsYXN0Q2x1dGNoU2l6ZT17bGFzdENsdXRjaFNpemV9IC8+XG4gICAgICAgIDwvVGFicy5QYW5lbD5cbiAgICAgIDwvVGFicz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBlblN0YXRzVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gcm93cyAtIE9wdGlvbiBudW1iZXIgb2Ygcm93cy4gSWYgZGVmaW5lZCwgaXQgd2lsbCBiZSBmaXhlZCBhdCB0aGF0LiBPdGhlcndpc2UsIGl0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgIHdpbGwgZGVmYXVsdCB0byAxIHdoZW4gdGhlcmUgYXJlIG5vIG9yZ3MsIGFuZCBncm93cyBhcyBtb3JlIHJvd3MgYXJlIG5lZWRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB0aWdodGVuUm93cyAtIElmIGdpdmVuLCB3aWxsIHNocmluayB0aGUgdmVydGljYWwgaGVpZ2h0IG9mIHRoZSBwZW4gYnkgdGhpcyBhbW91bnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgcGVyIHJvdywgY3Jvd2RpbmcgdGhlIG9yZyBpbWFnZXMgYXMgbmVlZGVkLlxuICovXG5jb25zdCBQZW5WaWV3ID0gKHtvcmdzLCBpZFByZWZpeD0nb3JnYW5pc20tJywgd2lkdGg9NDAwLCBjb2x1bW5zPTUsIHJvd3MsIHRpZ2h0ZW5Sb3dzPTAsIHRpZ2h0ZW5Db2x1bW5zPTAsIFNlbGVjdGVkT3JnYW5pc21WaWV3PU9yZ2FuaXNtVmlldywgc2VsZWN0ZWRJbmRleCwgb25DbGlja30pID0+IHtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhpZCwgb3JnKSB7XG4gICAgY29uc3QgcHJlZml4SW5kZXggPSBpZC5pbmRleE9mKGlkUHJlZml4KSxcbiAgICAgICAgICBpbmRleCA9IE51bWJlcihpZC5zdWJzdHIocHJlZml4SW5kZXggKyBpZFByZWZpeC5sZW5ndGgpKTtcbiAgICBpZiAob25DbGljaykgb25DbGljayhpbmRleCwgaWQsIG9yZyk7XG4gIH1cblxuICBsZXQgb3JnU3R5bGUgPSB7XG4gICAgbWFyZ2luOiBgJHstdGlnaHRlblJvd3MvMn1weCAkey10aWdodGVuQ29sdW1ucy8yfXB4YFxuICB9O1xuXG4gIGxldCBvcmdXaWR0aCA9IHdpZHRoL2NvbHVtbnMsXG4gICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKChvcmcsIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBpbmRleCA9PT0gc2VsZWN0ZWRJbmRleFxuICAgICAgICAgICAgICAgID8gPFNlbGVjdGVkT3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I9XCIjRkZGRkFBXCIgc2l6ZT17b3JnV2lkdGh9IHN0eWxlPXtvcmdTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9Lz5cbiAgICAgICAgICAgICAgICA6IDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZFByZWZpeCArIGluZGV4fSBpbmRleD17aW5kZXh9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPXtvcmdXaWR0aH0gc3R5bGU9e29yZ1N0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30gLz47XG4gICAgICB9KTtcblxuICByb3dzID0gcm93cyB8fCBNYXRoLmNlaWwob3JnVmlld3MubGVuZ3RoIC8gY29sdW1ucykgfHwgMTtcblxuICBsZXQgaGVpZ2h0ID0gb3JnV2lkdGggKiByb3dzO1xuXG4gIHdpZHRoICA9IHdpZHRoICAtICh0aWdodGVuQ29sdW1ucyAqIGNvbHVtbnMpO1xuICBoZWlnaHQgPSBoZWlnaHQgLSAodGlnaHRlblJvd3MgKiByb3dzKTtcblxuICBsZXQgc3R5bGUgPSB7IHdpZHRoLCBoZWlnaHQgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBwZW5cIiBzdHlsZT17c3R5bGV9PlxuICAgICAgeyBvcmdWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5QZW5WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaWRQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICByb3dzOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0aWdodGVuQ29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgdGlnaHRlblJvd3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIFNlbGVjdGVkT3JnYW5pc21WaWV3OiBQcm9wVHlwZXMuZnVuYyxcbiAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBlblZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uR2xvd1ZpZXcgPSAoe2dsb3dDb2xvciwgc2l6ZT0yMDB9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgZ2xvd1N0eWxlID0ge3Bvc2l0aW9uOiAnYWJzb2x1dGUnfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBxdWVzdGlvbi1nbG93XCIgc3R5bGU9e2NvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGNvbG9yPXtnbG93Q29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtnbG93U3R5bGV9Lz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBxdWVzdGlvbi1nbG93IHF1ZXN0aW9uLW1hcmtcIlxuICAgICAgICAgICAgc3R5bGU9e3twb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfX0+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbiAgLy8gSFRNTCB0ZXh0IG5vZGVcbiAgLy88ZGl2IHN0eWxlPXt0U3R5bGV9Pnt0ZXh0fTwvZGl2PlxuXG4gIC8vIFNWRyB0ZXh0IG5vZGVcbiAgLy88c3ZnIHdpZHRoPXtzaXplKzJ9IGhlaWdodD17c2l6ZSsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gIC8vICA8dGV4dCB4PSc1MCcgeT0nMTc1JyBmaWxsPScjMEQwRDhDJyBzdHlsZT17dFN0eWxlfT5cbiAgLy8gICAge3RleHR9XG4gIC8vICA8L3RleHQ+XG4gIC8vPC9zdmc+XG59O1xuXG5RdWVzdGlvbkdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2xvd0NvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXN0aW9uR2xvd1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBPcmdhbmlzbUdsb3dWaWV3IGZyb20gJy4vb3JnYW5pc20tZ2xvdyc7XG5pbXBvcnQgUXVlc3Rpb25HbG93VmlldyBmcm9tICcuL3F1ZXN0aW9uLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2hpZGRlbiwgY29sb3IsIHNpemUsIC4uLm90aGVyfSkgPT4ge1xuICBjb25zdCBvcmdWaWV3ID0gPE9yZ2FuaXNtR2xvd1ZpZXcgY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSB7Li4ub3RoZXJ9IC8+LFxuICAgICAgICBxdWVzdGlvblZpZXcgPSA8UXVlc3Rpb25HbG93VmlldyBnbG93Q29sb3I9e2NvbG9yfSB3aWR0aD17c2l6ZX0gLz4sXG4gICAgICAgIGZpbmFsVmlldyA9IGhpZGRlbiA/IHF1ZXN0aW9uVmlldyA6IG9yZ1ZpZXc7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tb3JnYW5pc20tZ2xvd1wiPlxuICAgICAge2ZpbmFsVmlld31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblF1ZXN0aW9uT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGhpZGRlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYnJlZWRpbmcgc3RhdGlzdGljcyBmb3IgYSBzZXQgb2YgQmlvbG9naWNhIG9yZ2FuaXNtc1xuICogQHBhcmFtIHtPYmplY3RbXX0gb3JncyAtIGFycmF5IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXMgZm9yIHdoaWNoIHN0YXRpc3RpY3MgYXJlIHRvIGJlIGRpc3BsYXllZFxuICogQHBhcmFtIHtPYmplY3R9IG9yZ3NbXS5waGVub3R5cGUgLSB0aGUgcGhlbm90eXBlIG9mIHRoZSBCaW9sb2dpY2Egb3JnYW5pc21cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGFzdENsdXRjaFNpemU9b3Jncy5sZW5ndGhdIC0gdGhlIG51bWJlciBvZiBvcmdhbmlzbXMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkgdGhhdCBjb21wcmlzZSB0aGUgbW9zdCByZWNlbnQgY2x1dGNoXG4gKi9cbmNvbnN0IFN0YXRzVmlldyA9ICh7b3JncywgbGFzdENsdXRjaFNpemV9KSA9PiB7XG5cbiAgbGV0IHRyYWl0cyA9IEdlbmV0aWNzVXRpbHMuY29tcHV0ZVRyYWl0Q291bnRzRm9yT3JnYW5pc21zKG9yZ3MsIGxhc3RDbHV0Y2hTaXplKSxcbiAgICAgIGNsdXRjaFNpemUgPSBsYXN0Q2x1dGNoU2l6ZSB8fCBvcmdzLmxlbmd0aCxcbiAgICAgIHJvd3MgPSBbXTtcblxuICAvLyBidWlsZCBjdW11bGF0aXZlIHN0YXRzIGZvciB0YWJsZSByb3dzXG4gIGxldCB0cmFpdE51bSA9IDA7XG4gIGZvciAoY29uc3QgW3RyYWl0LCB2YWx1ZXNdIG9mIHRyYWl0cykge1xuICAgIGZvciAoY29uc3QgW3ZhbHVlLCBjb3VudHNdIG9mIHZhbHVlcykge1xuICAgICAgY29uc3QgY01hbGVzID0gY291bnRzLmNsdXRjaFtCaW9Mb2dpY2EuTUFMRV0sXG4gICAgICAgICAgICBjRmVtYWxlcyA9IGNvdW50cy5jbHV0Y2hbQmlvTG9naWNhLkZFTUFMRV0sXG4gICAgICAgICAgICBjVG90YWwgPSBjTWFsZXMgKyBjRmVtYWxlcyxcbiAgICAgICAgICAgIGNQY3QgPSBNYXRoLnJvdW5kKDEwMCAqIGNUb3RhbCAvIGNsdXRjaFNpemUpLFxuICAgICAgICAgICAgdE1hbGVzID0gY291bnRzLnRvdGFsW0Jpb0xvZ2ljYS5NQUxFXSxcbiAgICAgICAgICAgIHRGZW1hbGVzID0gY291bnRzLnRvdGFsW0Jpb0xvZ2ljYS5GRU1BTEVdLFxuICAgICAgICAgICAgdFRvdGFsID0gdE1hbGVzICsgdEZlbWFsZXMsXG4gICAgICAgICAgICB0UGN0ID0gTWF0aC5yb3VuZCgxMDAgKiB0VG90YWwgLyBvcmdzLmxlbmd0aCk7XG4gICAgICByb3dzLnB1c2goeyB0cmFpdCwgdHJhaXROdW0sIHZhbHVlLCBjTWFsZXMsIGNGZW1hbGVzLCBjVG90YWwsIGNQY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TWFsZXMsIHRGZW1hbGVzLCB0VG90YWwsIHRQY3QgfSk7XG4gICAgfVxuICAgICsrIHRyYWl0TnVtO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgc3RhdHNcIj5cbiAgICAgIDx0YWJsZSBpZD1cInN0YXRzLXRhYmxlXCIgY2xhc3NOYW1lPXtvcmdzLmxlbmd0aCA+IDAgPyBcImhhcy1kYXRhXCIgOiBcIm5vLWRhdGFcIn0+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+VHJhaXQgVmFsdWU8L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+Q2x1dGNoPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgICAgPHRoIGNvbFNwYW49XCIyXCI+VG90YWw8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7XG4gICAgICAgICAgcm93cy5tYXAoZnVuY3Rpb24ocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPHRyIGtleT17aW5kZXh9IGNsYXNzTmFtZT17cm93LnRyYWl0TnVtICYgMSA/IFwib2RkLXRyYWl0XCIgOiBcImV2ZW4tdHJhaXRcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdHJhaXQtdmFsdWU9e3Jvdy52YWx1ZX0+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImxhYmVsXCI+e3Jvdy52YWx1ZX08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jVG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1BjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY0ZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY01hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50UGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50RmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50TWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblN0YXRzVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGxhc3RDbHV0Y2hTaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0c1ZpZXc7XG4iLCIvKlxuICogU2VlIGh0dHBzOi8vbWVkaXVtLmNvbS9Aa2VudGNkb2Rkcy9taXN1bmRlcnN0YW5kaW5nLWVzNi1tb2R1bGVzLXVwZ3JhZGluZy1iYWJlbC10ZWFycy1hbmQtYS1zb2x1dGlvbi1hZDJkNWFiOTNjZTAjLnExdmNrZmZpd1xuICogKEtlbnQgQy4gRG9kZHMsIFwiTWlzdW5kZXJzdGFuZGluZyBFUzYgTW9kdWxlcywgVXBncmFkaW5nIEJhYmVsLCBUZWFycywgYW5kIGEgU29sdXRpb25cIilcbiAqIGZvciBkZXNjcmlwdGlvbiBvZiBzb21lIG9mIHRoZSBkZXRhaWxzIGludm9sdmVkIGluIG1peGluZyBFUzYgZXhwb3J0IHdpdGggcmVxdWlyZSgpLlxuICovXG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWxsZWxlRmlsdGVyc1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FsbGVsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbmltYXRlZE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJhc2tldFNldFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYmFza2V0LXNldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFuZ2VTZXhCdXR0b25zIH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVJbWFnZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaXJjdWxhckdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFZ2dDbHV0Y2hWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2VnZy1jbHV0Y2gnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZWVkYmFja1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVlZGJhY2snO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2FtZXRlUG9vbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmVMYWJlbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbm9tZVRlc3RWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZS10ZXN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5vbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHbG93QmFja2dyb3VuZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTW9kYWxBbGVydCB9IGZyb20gJy4vY29tcG9uZW50cy9tb2RhbC1hbGVydCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZGluYWxPcmdhbmlzbVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JkaW5hbC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBlblZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3Blbi1zdGF0cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hhbGxlbmdlQXdhcmRWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYWxsZW5nZS1hd2FyZCc7XG5cbi8vIHV0aWxpdGllc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5ldGljc1V0aWxzIH0gZnJvbSAnLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuIiwiLyoqXG4gKiBDbGFzcyBwcm92aWRpbmcgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIEJpb0xvZ2ljYSBnZW5ldGljcyBvcGVyYXRpb25zLlxuICogSW4gc29tZSBjYXNlcyB0aGVzZSBhcmUgYWRhcHRlZCBmcm9tIGNvcnJlc3BvbmRpbmcgY29kZSBpbiBHZW5pdmVyc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmV0aWNzVXRpbHMge1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbGxlbGUgc3RyaW5ncyBpbiB0aGUgbmV3IGRhc2ggZm9ybSAoZS5nLiBcIlctdywgVC0sIC1hXCIpIHRvIHRoZSBvcmlnaW5hbFxuICAgKiBCaW9Mb2dpY2EgYTpiOiBmb3JtIChlLmcuIFwiYTpXLGI6dyxhOlQsYjphXCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgZGFzaEFsbGVsZVN0cmluZyAtIHRoZSBhbGxlbGUgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAgdGhlIGNvbnZlcnRlZCBhbGxlbGUgc3RyaW5nXG4gICAqL1xuICBzdGF0aWMgY29udmVydERhc2hBbGxlbGVzVG9BQkFsbGVsZXMoZGFzaEFsbGVsZVN0cmluZykge1xuICAgIGlmICghZGFzaEFsbGVsZVN0cmluZyB8fCAoZGFzaEFsbGVsZVN0cmluZy5pbmRleE9mKCc6JykgPj0gMCkgfHwgKGRhc2hBbGxlbGVTdHJpbmcuaW5kZXhPZignLScpIDwgMCkpXG4gICAgICByZXR1cm4gZGFzaEFsbGVsZVN0cmluZztcbiAgICBjb25zdCBkYXNoQWxsZWxlcyA9IGRhc2hBbGxlbGVTdHJpbmcuc3BsaXQoJywnKTtcbiAgICByZXR1cm4gZGFzaEFsbGVsZXMucmVkdWNlKChwcmV2LCBwYWlyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxlbGVzID0gcGFpci50cmltKCkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxlbGVzWzBdKSBwcmV2ICs9IGAke3ByZXYgPyAnLCcgOiAnJ31hOiR7YWxsZWxlc1swXS50cmltKCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxlbGVzWzFdKSBwcmV2ICs9IGAke3ByZXYgPyAnLCcgOiAnJ31iOiR7YWxsZWxlc1sxXS50cmltKCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFsbGVsZSBzdHJpbmdzIGluIHRoZSBuZXcgZGFzaCBmb3JtIChlLmcuIFwiVy13LCBULSwgLWFcIikgdG8gdGhlIG9yaWdpbmFsXG4gICAqIEJpb0xvZ2ljYSBhOmI6IGZvcm0gKGUuZy4gXCJhOlcsYjp3LGE6VCxiOmFcIikgd2l0aGluIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICpcbiAgICogUmVjdXJzZXMgdGhyb3VnaCBuZXN0ZWQgb2JqZWN0cy9hcnJheXMgY29udmVydGluZyBkYXNoIGFsbGVsZSBzdHJpbmdzIGluIHByb3BlcnRpZXNcbiAgICogd2hvc2UgbmFtZXMgYXJlIHdoaXRlLWxpc3RlZCBpbiB0aGUgcHJvcE5hbWVzIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gIG9iamVjdCAtIHRoZSBvYmplY3QgdG8gYmUgY29udmVydGVkXG4gICAqIEByZXR1cm5zIHtvYmplY3R9ICB0aGUgc2FtZSBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGZpZWxkcyBtb2RpZmllZFxuICAgKi9cbiAgc3RhdGljIGNvbnZlcnREYXNoQWxsZWxlc09iamVjdFRvQUJBbGxlbGVzKG9iamVjdCwgcHJvcE5hbWVzKSB7XG4gICAgaWYgKCFvYmplY3QgfHwgIXByb3BOYW1lcyB8fCAocHJvcE5hbWVzLmxlbmd0aCA9PSBudWxsKSkgcmV0dXJuIG9iamVjdDtcblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG4gICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHJldHVybiAoIWtleSB8fCAocHJvcE5hbWVzLmluZGV4T2Yoa2V5KSA+PSAwKSlcbiAgICAgICAgICAgICAgICAgICAgPyBHZW5ldGljc1V0aWxzLmNvbnZlcnREYXNoQWxsZWxlc1RvQUJBbGxlbGVzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gbm90ZSB0aGF0IHRoZSBrZXkgZm9yIHN0cmluZ3MgaW4gYXJyYXlzIGlzIHRoZSBrZXkgZm9yIHRoZSBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLm1hcCgoaXRlbSkgPT4gY29udmVydFZhbHVlKGtleSwgaXRlbSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IG9iaktleSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICB2YWx1ZVtvYmpLZXldID0gY29udmVydFZhbHVlKG9iaktleSwgdmFsdWVbb2JqS2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRWYWx1ZShudWxsLCBvYmplY3QpO1xuICB9XG5cbiAgc3RhdGljIGVuc3VyZVZhbGlkT3JnYW5pc20ob3JnT3JEZWYsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAob3JnT3JEZWYuZ2V0QWxsZWxlU3RyaW5nKSB7XG4gICAgICByZXR1cm4gb3JnT3JEZWY7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKHNwZWNpZXMsIG9yZ09yRGVmLmFsbGVsZVN0cmluZywgb3JnT3JEZWYuc2V4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBhbGxlbGVzIGFyZSBwcmVzZW50IGluIHRoZSBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gIGFsbGVsZVN0cmluZyAtIG9yZ2FuaXNtIGFsbGVsZSBzdHJpbmdcbiAgICogQHBhcmFtIChzdHJpbmcpICBhbGxlbGVzIC0gYWxsZWxlcyB0byBtYXRjaCBhZ2FpbnN0IHRoZSBvcmdhbmlzbSBhbGxlbGVzXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBhbGxlbGVzIGFyZSBwcmVzZW50IGluIHRoZSBhbGxlbGVTdHJpbmcsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGFsbGVsZVN0cmluZ0NvbnRhaW5zQWxsZWxlcyhhbGxlbGVTdHJpbmcsIGFsbGVsZXMpIHtcbiAgICAvLyBlbXB0eSBzdHJpbmdzIGRvbid0IG1hdGNoXG4gICAgaWYgKCFhbGxlbGVTdHJpbmcgfHwgIWFsbGVsZXMpIHJldHVybiBmYWxzZTtcbiAgICAvLyBtdXN0IG1hdGNoIGV2ZXJ5IG9uZSBvZiB0aGUgYWxsZWxlcyAuLi5cbiAgICByZXR1cm4gYWxsZWxlcy5zcGxpdCgnLCcpLmV2ZXJ5KChhbGxlbGUpID0+IHtcbiAgICAgIC8vIC4uLiB0byB0aGUgYWxsZWxlcyBvZiB0aGUgYWxsZWxlU3RyaW5nXG4gICAgICByZXR1cm4gYWxsZWxlU3RyaW5nLnNlYXJjaChgJHthbGxlbGV9KCx8JClgKSA+PSAwO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGFsbGVsZSBzdHJpbmcgY29udGFpbnMgb25seSB2YWxpZCBhbGxlbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgKGluIGE6YjogZm9ybSkgdG8gYmUgdmFsaWRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgW3NwZWNpZXNdIC0gdGhlIHNwZWNpZXMgd2hvc2UgZ2Vub21lIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGNvbXBsZXRlbmVzc1xuICAgKiBAcmV0dXJucyAgICAgICAgIHRydWUgaWYgdGhlIGFsbGVsZSBzdHJpbmcgaXMgdmFsaWQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzVmFsaWRBbGxlbGVTdHJpbmcoYWxsZWxlU3RyaW5nLCBzcGVjaWVzPUJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlKSB7XG4gICAgaWYgKCFzcGVjaWVzIHx8ICFhbGxlbGVTdHJpbmcpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBhbGxlbGVUb0dlbmVNYXAgPSBPYmplY3Qua2V5cyhzcGVjaWVzLmdlbmVMaXN0KS5yZWR1Y2UoKHByZXYsIGdlbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNpZXMuZ2VuZUxpc3RbZ2VuZV0uYWxsZWxlcy5mb3JFYWNoKChhbGxlbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlthbGxlbGVdID0gZ2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge30pO1xuICAgIHJldHVybiBhbGxlbGVTdHJpbmcuc3BsaXQoJywnKS5ldmVyeSgoYWxsZWxlU2lkZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTaWRlLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgICByZXR1cm4gKChzaWRlLnRyaW0oKSA9PT0gJ2EnKSB8fCAoc2lkZS50cmltKCkgPT09ICdiJykpICYmXG4gICAgICAgICAgICAgICAgICAgIChhbGxlbGVUb0dlbmVNYXBbYWxsZWxlLnRyaW0oKV0gIT0gbnVsbCk7XG4gICAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgYWxsZWxlIHN0cmluZyBjb21wbGV0ZWx5IHNwZWNpZmllcyBhbGwgYWxsZWxlc1xuICAgKlxuICAgKiBUbyBiZSBjb21wbGV0ZSwgZXZlcnkgZ2VuZSBtdXN0IGJlIHNwZWNpZmllZCB3aXRoIGEgdmFsaWQgYWxsZWxlIGZvciBlYWNoXG4gICAqIHNpZGUgKGV4Y2VwdCBzZXgtbGlua2VkIGdlbmVzLCB3aGljaCBuZWVkIG9ubHkgYmUgb24gb25lIHNpZGUpLCBhbmQgbm9cbiAgICogaW52YWxpZCBhbGxlbGVzIG9yIGdlbmVzIGNhbiBiZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgKGluIGE6YjogZm9ybSkgdG8gYmUgdmFsaWRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgW3NwZWNpZXNdIC0gdGhlIHNwZWNpZXMgd2hvc2UgZ2Vub21lIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGNvbXBsZXRlbmVzc1xuICAgKiBAcmV0dXJucyAgICAgICAgIHRydWUgaWYgdGhlIGFsbGVsZSBzdHJpbmcgaXMgY29tcGxldGUsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzQ29tcGxldGVBbGxlbGVTdHJpbmcoYWxsZWxlU3RyaW5nLCBzcGVjaWVzPUJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlKSB7XG4gICAgaWYgKCFzcGVjaWVzIHx8ICFhbGxlbGVTdHJpbmcpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBrVW5rbm93bkdlbmUgPSBcIl9fVU5LTk9XTl9fXCIsXG4gICAgICAgICAgYWxsZWxlVG9HZW5lTWFwID0gT2JqZWN0LmtleXMoc3BlY2llcy5nZW5lTGlzdCkucmVkdWNlKChwcmV2LCBnZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMuZm9yRWFjaCgoYWxsZWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZbYWxsZWxlXSA9IGdlbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KSxcbiAgICAgICAgICBzcGVjaWVzR2VuZUNvdW50ID0gT2JqZWN0LmtleXMoc3BlY2llcy5nZW5lTGlzdCkubGVuZ3RoLFxuICAgICAgICAgIGdlbmVTaWRlTWFwID0gYWxsZWxlU3RyaW5nLnNwbGl0KCcsJykucmVkdWNlKChwcmV2LCBhbGxlbGVTaWRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzaWRlLCBhbGxlbGVdID0gYWxsZWxlU2lkZS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZ2VuZSA9IGFsbGVsZVRvR2VuZU1hcFthbGxlbGUudHJpbSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lKSBnZW5lID0ga1Vua25vd25HZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZ2VuZUVudHJ5ID0gcHJldltnZW5lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lRW50cnkpIGdlbmVFbnRyeSA9IHByZXZbZ2VuZV0gPSB7IGE6IDAsIGI6IDAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKysgZ2VuZUVudHJ5W3NpZGUudHJpbSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSksXG4gICAgICAgICAgYWxsZWxlU3RyaW5nR2VuZUNvdW50ID0gT2JqZWN0LmtleXMoZ2VuZVNpZGVNYXApLmxlbmd0aCxcbiAgICAgICAgICBpc0V2ZXJ5R2VuZUNvbXBsZXRlID0gT2JqZWN0LmtleXMoZ2VuZVNpZGVNYXApLmV2ZXJ5KChnZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZUVudHJ5ID0gZ2VuZVNpZGVNYXBbZ2VuZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNYWUdlbmUgPSBzcGVjaWVzLmNocm9tb3NvbWVHZW5lTWFwLlhZLnNvbWUoKGFsbGVsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lID09PSBhbGxlbGVUb0dlbmVNYXBbYWxsZWxlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVFbnRyeSAmJiAoKGdlbmVFbnRyeS5hID09PSAxKSAmJiAoZ2VuZUVudHJ5LmIgPT09IDEpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlzWFlHZW5lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZW5lRW50cnkuYSArIGdlbmVFbnRyeS5iID49IDEpICYmIChnZW5lRW50cnkuYSArIGdlbmVFbnRyeS5iIDw9IDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gbXVzdCBoYXZlIHRoZSBjb3JyZWN0IG51bWJlciBvZiBnZW5lcywgYWxsIGdlbmVzIG11c3QgYmUgY29tcGxldGUsIGFuZCBubyB1bmtub3duIGdlbmVzXG4gICAgcmV0dXJuIChzcGVjaWVzR2VuZUNvdW50ID09PSBhbGxlbGVTdHJpbmdHZW5lQ291bnQpICYmIGlzRXZlcnlHZW5lQ29tcGxldGUgJiZcbiAgICAgICAgICAgIChnZW5lU2lkZU1hcFtrVW5rbm93bkdlbmVdID09IG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgb3V0IGhpZGRlbiBhbGxlbGVzIGZyb20gYW4gb3JpZ2luYWwgbGlzdCBvZiBhbGxlbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFsbGVsZXMgLSB0aGUgc2V0IG9mIGFsbGVsZXMgdG8gYmUgZmlsdGVyZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIHRoZSBhbGxlbGVzIGlkZW50aWZ5aW5nIHRoZSBoaWRkZW4gZ2VuZXNcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2Euc3BlY2llc30gc3BlY2llcyAtIHRoZSBzcGVjaWVzIHRoYXQgZGVmaW5lcyB0aGUgZ2Vub3R5cGVcbiAgICogQHJldHVybiB7c3RyaW5nW119IC0gdGhlIGZpbHRlcmVkIGFsbGVsZXNcbiAgICovXG4gIHN0YXRpYyBmaWx0ZXJBbGxlbGVzKGFsbGVsZXMsIGhpZGRlbkFsbGVsZXMsIHNwZWNpZXMpIHtcbiAgICBjb25zdCBoaWRkZW5HZW5lcyA9IGhpZGRlbkFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSk7XG4gICAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKGEgPT4ge1xuICAgICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSk7XG4gICAgICByZXR1cm4gaGlkZGVuR2VuZXMuaW5kZXhPZihnZW5lKSA9PT0gLTE7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZSBhIG1hcCBvZiB0cmFpdHMgLT4gdHJhaXRWYWx1ZXMgLT4gdHJhaXRDb3VudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtW119IG9yZ2FuaXNtcyAtIHRoZSBzZXQgb2Ygb3JnYW5pc21zIHRvIGNvbXB1dGUgc3RhdHMgZm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjbHV0Y2hTaXplIC0gdGhlIGxhc3QgJ2NsdXRjaFNpemUnIG9yZ2FuaXNtcyBhcmUgYXNzdW1lZCB0byBiZSB0aGUgbGFzdCBjbHV0Y2hcbiAgICogQHJldHVybiB7TWFwfSAtIGUuZy4geyBcInRhaWxcIjogeyBcImxvbmcgdGFpbFwiOiB7IFwiY2x1dGNoXCI6IFs5LCAxMV0sIFwidG90YWxcIjogWzUzLCA0N10gfX19XG4gICAqL1xuICBzdGF0aWMgY29tcHV0ZVRyYWl0Q291bnRzRm9yT3JnYW5pc21zKG9yZ2FuaXNtcywgbGFzdENsdXRjaFNpemUpIHtcbiAgICBsZXQgdHJhaXRzID0gbmV3IE1hcCxcbiAgICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ2FuaXNtcy5sZW5ndGg7XG5cbiAgICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gICAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3JnYW5pc21zLmVudHJpZXMoKSkge1xuICAgICAgZm9yIChjb25zdCB0cmFpdCBvZiBPYmplY3Qua2V5cyhvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcykpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgICAgdmFsdWVDb3VudHMgPSB0cmFpdFZhbHVlcy5nZXQodmFsdWUpIHx8IHsgY2x1dGNoOiBbMCwgMF0sIHRvdGFsOiBbMCwgMF0gfTtcbiAgICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgICBpZiAoIXRyYWl0VmFsdWVzLmhhcyh2YWx1ZSkpIHRyYWl0VmFsdWVzLnNldCh2YWx1ZSwgdmFsdWVDb3VudHMpO1xuICAgICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICAgIGlmIChpbmRleCA+PSBvcmdhbmlzbXMubGVuZ3RoIC0gY2x1dGNoU2l6ZSlcbiAgICAgICAgICArKyB2YWx1ZUNvdW50cy5jbHV0Y2hbb3JnLnNleF07XG4gICAgICAgICsrIHZhbHVlQ291bnRzLnRvdGFsW29yZy5zZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhaXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGFsbGVsZSBzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IG1hcHMgZ2VuZXMgdG8gYWxsZWxlcy5cbiAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBjb21wYXJpc29uIHB1cnBvc2VzLCBmb3IgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHJldHVybiB7b2JqZWN0fSAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3Juczoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqL1xuICBzdGF0aWMgYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKSB7XG4gICAgbGV0IGdlbmVNYXAgPSB7fSxcbiAgICAgICAgYWxsZWxlU3Vic3RyaW5ncyA9IGFsbGVsZVN0cmluZy5zcGxpdChcIixcIik7XG4gICAgZm9yIChjb25zdCBhbGxlbGVTdWJzdHIgb2YgYWxsZWxlU3Vic3RyaW5ncykge1xuICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTdWJzdHIuc3BsaXQoXCI6XCIpLFxuICAgICAgICAgICAgZ2VuZSA9IGdlbmV0aWNzLmdlbmVGb3JBbGxlbGUoYWxsZWxlKTtcbiAgICAgIGlmIChzaWRlICYmIGFsbGVsZSAmJiBnZW5lKSB7XG4gICAgICAgIGlmICghZ2VuZU1hcFtnZW5lXSkgZ2VuZU1hcFtnZW5lXSA9IHt9O1xuICAgICAgICBnZW5lTWFwW2dlbmVdW3NpZGVdID0gYWxsZWxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2VuZU1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBhbGxlbGUgc3RyaW5nIGFuZCBhIGdlbmUgbWFwIGRlZmluaW5nIGEgc2V0IG9mIGJhc2UgKGRlZmF1bHQpIGFsbGVsZXMsXG4gICAqIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyB3aXRoIG1pc3NpbmcgYWxsZWxlcyByZXBsYWNlZCBieSB0aGVpciBkZWZhdWx0cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge29iamVjdH0gYmFzZUdlbmVNYXAgLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybjoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCkge1xuICAgIGNvbnN0IGRzdEdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZyk7XG4gICAgbGV0ICAgZHN0QWxsZWxlU3RyaW5nID0gYWxsZWxlU3RyaW5nO1xuICAgIGZvciAoY29uc3QgZ2VuZSBpbiBkc3RHZW5lTWFwKSB7XG4gICAgICBjb25zdCBnZW5lVmFsdWUgPSBkc3RHZW5lTWFwW2dlbmVdO1xuICAgICAgLy8gcmVwbGFjZSBhIG1pc3NpbmcgJ2EnIHNpZGUgYWxsZWxlIHdpdGggdGhlIGRlZmF1bHQgaWYgYXBwcm9wcmlhdGVcbiAgICAgIGlmICghZ2VuZVZhbHVlLmEgJiYgYmFzZUdlbmVNYXBbZ2VuZV0gJiYgYmFzZUdlbmVNYXBbZ2VuZV0uYSkge1xuICAgICAgICBkc3RBbGxlbGVTdHJpbmcgPSBkc3RBbGxlbGVTdHJpbmcucmVwbGFjZShgYjoke2dlbmVWYWx1ZS5ifWAsIGBhOiR7YmFzZUdlbmVNYXBbZ2VuZV0uYX0sJCZgKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlcGxhY2UgYSBtaXNzaW5nICdiJyBzaWRlIGFsbGVsZSB3aXRoIHRoZSBkZWZhdWx0IGlmIGFwcHJvcHJpYXRlXG4gICAgICBpZiAoIWdlbmVWYWx1ZS5iICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmIpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGE6JHtnZW5lVmFsdWUuYX1gLCBgJCYsYjoke2Jhc2VHZW5lTWFwW2dlbmVdLmJ9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkc3RBbGxlbGVTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdHdvIGFsbGVsZSBzdHJpbmdzLCByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgaW4gd2hpY2ggbWlzc2luZyBhbGxlbGVzXG4gICAqIGluIHRoZSBmaXJzdCBhcmUgcmVwbGFjZWQgYnkgZGVmYXVsdHMgcHJvdmlkZWQgYnkgdGhlIHNlY29uZCBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlQWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gdXNlIGFzIGRlZmF1bHRzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VBbGxlbGVTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlR2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYmFzZUFsbGVsZVN0cmluZyk7XG4gICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCk7XG4gIH1cblxuICBzdGF0aWMgbnVtYmVyT2ZCcmVlZGluZ01vdmVzVG9SZWFjaERyYWtlKG9yZ2FuaXNtMSwgb3JnYW5pc20yLCBjaGFuZ2VhYmxlQWxsZWxlczEsIGNoYW5nZWFibGVBbGxlbGVzMiwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB2YXIgbW92ZXMgPSAwLFxuICAgICAgICBvcmcxQWxsZWxlcyA9IG9yZ2FuaXNtMS5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIG9yZzJBbGxlbGVzID0gb3JnYW5pc20yLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KCcsJykubWFwKGEgPT4gYS5zcGxpdCgnOicpWzFdKSxcbiAgICAgICAgdGFyZ2V0Y2hhcnMgPSB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICB0cmFpdFJ1bGVzID0gb3JnYW5pc20xLnNwZWNpZXMudHJhaXRSdWxlcztcblxuICAgIGZvciAodmFyIHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICAgIGlmICh0cmFpdFJ1bGVzLmhhc093blByb3BlcnR5KHRyYWl0KSkge1xuICAgICAgICB2YXIgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRjaGFyc1t0cmFpdF1dLFxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gSW5maW5pdHk7XG4gICAgICAgIGlmIChwb3NzaWJsZVNvbHV0aW9ucyAmJiBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGk8aWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0sXG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgPSAwLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24yID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHNvbHV0aW9uLmxlbmd0aDsgajxqajsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBhbGxlbGUxID0gc29sdXRpb25bal0sXG4gICAgICAgICAgICAgICAgICBhbGxlbGUyID0gaiUyID09PSAwID8gc29sdXRpb25baisxXSA6IHNvbHV0aW9uW2otMV0sXG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gMDtcbiAgICAgICAgICAgICAgaWYgKG9yZzFBbGxlbGVzLmluZGV4T2YoYWxsZWxlMSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTEgJiYgKGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMxLmluZGV4T2YoYWxsZWxlMS50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG9yZzJBbGxlbGVzLmluZGV4T2YoYWxsZWxlMikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTIgJiYgKGNoYW5nZWFibGVBbGxlbGVzMi5pbmRleE9mKGFsbGVsZTIpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoaiUyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiArPSBzb2x1dGlvbk1vdmVzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGggPSBNYXRoLm1pbihzaG9ydGVzdFBhdGgsIE1hdGgubWluKG1vdmVzRm9yU29sdXRpb24xLCBtb3Zlc0ZvclNvbHV0aW9uMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGNoYW5nZXMsIGluY2x1ZGluZyBhbGxlbGUgY2hhbmdlcyBhbmQgc2V4IGNoYW5nZXMsXG4gICAqIHJlcXVpcmVkIHRvIG1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhlICd0ZXN0T3JnYW5pc20nIHRvIHRoYXQgb2YgdGhlICd0YXJnZXRPcmdhbmlzbScuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0ZXN0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gd2hpY2ggY2hhbmdlcyB3b3VsZCBhcHBseVxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGFyZ2V0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdGhhdCBzZXJ2ZXMgYXMgZGVzdGluYXRpb25cbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RPcmdhbmlzbSwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB0ZXN0T3JnYW5pc20gPSB0aGlzLmVuc3VyZVZhbGlkT3JnYW5pc20odGVzdE9yZ2FuaXNtKTtcbiAgICB0YXJnZXRPcmdhbmlzbSA9IHRoaXMuZW5zdXJlVmFsaWRPcmdhbmlzbSh0YXJnZXRPcmdhbmlzbSk7XG5cbiAgICBsZXQgcmVxdWlyZWRDaGFuZ2VDb3VudCA9IEdlbmV0aWNzVXRpbHMubnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5nZW5ldGljcy5nZW5vdHlwZS5hbGxBbGxlbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5zcGVjaWVzLnRyYWl0UnVsZXMpO1xuICAgIGlmICh0ZXN0T3JnYW5pc20uc2V4ICE9PSB0YXJnZXRPcmdhbmlzbS5zZXgpXG4gICAgICArK3JlcXVpcmVkQ2hhbmdlQ291bnQ7XG5cbiAgICByZXR1cm4gcmVxdWlyZWRDaGFuZ2VDb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgdG8gbWFrZSB0aGUgcGhlbm90eXBlIG9mXG4gICAqIHRoZSBvcmdhbmlzbSBjaGFyYWN0ZXJpemVkIGJ5ICd0ZXN0Q2hhcmFjdGVyc3RpY3MnIG1hdGNoIHRoYXQgb2YgdGhlIG9yZ2FuaXNtXG4gICAqIGNoYXJhY3Rlcml6ZWQgYnkgJ3RhcmdldENoYXJhY3RlcmlzdGljcycuIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0ZXN0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGFyZ2V0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRlc3RBbGxlbGVzIC0gdGhlIGFycmF5IG9mIGFsbGVsZXMgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgb2YgdGhlIG9yZ2FuaXNtc1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIG51bWJlciBvZiBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RDaGFyYWN0ZXJpc3RpY3MsIHRhcmdldENoYXJhY3RlcmlzdGljcywgdGVzdEFsbGVsZXMsIHRyYWl0UnVsZXMpIHtcbiAgICBjb25zdCBhbGxlbGVzID0gdGVzdEFsbGVsZXM7XG4gICAgbGV0ICAgbW92ZXMgPSAwO1xuXG4gICAgZm9yIChjb25zdCB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgaWYgKHRlc3RDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdICE9PSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdKSB7XG4gICAgICAgICAgLy8gZmlyc3Qgd2UgaGF2ZSB0byB3b3JrIG91dCB3aGF0IGFsbGVsZXMgdGhlIG9yaWdpbmFsIGRyYWtlIGhhcyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICAgICAgICAvLyB0aGVpciBub24tbWF0Y2hpbmcgdHJhaXRcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVRyYWl0QWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcyk7XG4gICAgICAgICAgbGV0ICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVUcmFpdEFsbGVsZXMuaW5kZXhPZihhbGxlbGVzW2ldKSA+PSAwKXtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzLnB1c2goYWxsZWxlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyB3b3JrIG91dCB0aGUgc21hbGxlc3QgbnVtYmVyIG9mIHN0ZXBzIHRvIGdldCBmcm9tIHRoZXJlIHRvIHRoZSBkZXNpcmVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAgICAgY29uc3QgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdXTtcbiAgICAgICAgICBsZXQgICBzaG9ydGVzdFBhdGhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gY2hhcmFjdGVyaXN0aWNBbGxlbGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspe1xuICAgICAgICAgICAgICBpZiAoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uLnNwbGljZShzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSksIDEpOyAvLyBhbHJlYWR5IG1hdGNoZWQgdGhpcyBvbmUsIGNhbid0IG1hdGNoIGl0IGFnYWluXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IChwYXRoTGVuZ3RoIDwgc2hvcnRlc3RQYXRoTGVuZ3RoKSA/IHBhdGhMZW5ndGggOiBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogR29lcyB0aHJvdWdoIHRoZSB0cmFpdFJ1bGVzIHRvIGZpbmQgb3V0IHdoYXQgdW5pcXVlIGFsbGVsZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHRyYWl0XG4gICAqIGUuZy4gRm9yIFwidGFpbFwiIGl0IHdpbGwgcmV0dXJuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl0uIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFpdCAtIG5hbWUgb2YgdHJhaXQsIGUuZy4gXCJ0YWlsXCJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgd2hvc2UgdHJhaXRzIGFyZSBvZiBpbnRlcmVzdFxuICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSBhcnJheSBvZiBhbGxlbGUgc3RyaW5ncywgZS5nLiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdXG4gICAqL1xuICBzdGF0aWMgX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0ID0ge307XG4gIHN0YXRpYyBjb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKSB7XG4gICAgaWYgKEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSkge1xuICAgICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XTtcbiAgICB9XG5cbiAgICBsZXQgYWxsZWxlc0hhc2ggPSB7fSxcbiAgICAgICAgYWxsZWxlcyAgICAgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNoYXJhY3RlcmlzdGljIGluIHRyYWl0UnVsZXNbdHJhaXRdKXtcbiAgICAgICAgZm9yIChjb25zdCBwb3NzaWJpbGVBbGxlbGVzQ29tYm8gaW4gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdKSB7XG4gICAgICAgICAgaWYgKHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXS5oYXNPd25Qcm9wZXJ0eShwb3NzaWJpbGVBbGxlbGVzQ29tYm8pKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgYWxsZWxlc0hhc2hbdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib11baV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGFsbGVsZSBpbiBhbGxlbGVzSGFzaCl7XG4gICAgICBhbGxlbGVzLnB1c2goYWxsZWxlKTtcbiAgICB9XG5cbiAgICBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0gPSBhbGxlbGVzOyAgLy8gc3RvcmUgc28gd2UgZG9uJ3QgbmVlZCB0byByZWNhbGN1bGF0ZSBpdFxuICAgIHJldHVybiBhbGxlbGVzO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIC8vIENoYWxsZW5nZSBpbnN0cnVjdGlvbnNcbiAgXCJ+RUdHX0dBTUVfMy5DSFJPTU9TT01FU19USVRMRVwiOiBcIkNocm9tb3NvbWVzXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJVQ1RJT05TX1RJVExFXCI6IFwiSW5zdHJ1Y3Rpb25zXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSEVBRElOR1wiOiBcIlNvcnQgdGhlc2UgZWdncyFcIixcbiAgXCJ+RUdHX0dBTUVfMy5JTlNUUl9JVEVNMVwiOiBcIlNjb3BlIGFuIGVnZyB0byBzZWUgYSBiYWJ5J3MgY2hyb21vc29tZXMuXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSVRFTTJcIjogXCJDbGljayB0aGUgY29ycmVjdCBiYXNrZXQgZm9yIHRoZSBlZ2cuXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIHBvcHVwIGFsZXJ0c1xuICBcIn5BTEVSVC5USVRMRS5HT09EX1dPUktcIjogXCJHb29kIHdvcmshXCIsXG4gIFwifkFMRVJULlRJVExFLklOQ09SUkVDVF9EUkFLRVwiOiBcIlRoYXQncyBub3QgdGhlIGRyYWtlIVwiLFxuICBcIn5BTEVSVC5USVRMRS5FR0dfTUlTTUFUQ0hcIjogXCJUaGF0IGVnZyBkb2Vzbid0IGJlbG9uZyFcIixcbiAgXCJ+QUxFUlQuVElUTEUuTUlTVEFLRVwiOiBcIlVoIG9oIVwiLFxuICBcIn5BTEVSVC5ORVdfUElFQ0VfT0ZfQ09JTlwiOiBcIllvdSBlYXJuZWQgYSAkezB9IHBpZWNlIG9mIHRoZSBjb2luIVwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9HT0xEXCI6IFwiZ29sZFwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9TSUxWRVJcIjogXCJzaWx2ZXJcIixcbiAgXCJ+QUxFUlQuQVdBUkRfTEVWRUxfQlJPTlpFXCI6IFwiYnJvbnplXCIsXG4gIFwifkFMRVJULkNPTVBMRVRFX0NPSU5cIjogXCJZb3UgaGF2ZSBlYXJuZWQgYWxsIHRoZSBwaWVjZXMgb2YgdGhpcyBjb2luIVwiLFxuICBcIn5BTEVSVC5DT1JSRUNUX0RSQUtFXCI6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICBcIn5BTEVSVC5JTkNPUlJFQ1RfRFJBS0VcIjogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBkb2Vzbid0IG1hdGNoIHRoZSB0YXJnZXQgZHJha2UuXFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBiZWxvbmdzIGluIHRoYXQgYmFza2V0LlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01JU01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBkb2Vzbid0IGJlbG9uZyBpbiB0aGF0IGJhc2tldC5cIixcbiAgXCJ+QUxFUlQuRFVQTElDQVRFX0RSQUtFXCI6IFwiWW91IGFscmVhZHkgaGF2ZSBhIGRyYWtlIHRoYXQgbG9va3MganVzdCBsaWtlIHRoYXQhXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIGJ1dHRvbnNcbiAgXCJ+QlVUVE9OLk9LXCI6IFwiT0tcIixcbiAgXCJ+QlVUVE9OLlRSWV9BR0FJTlwiOiBcIlRyeSBhZ2FpblwiLFxuICBcIn5CVVRUT04uVFJZX0FOT1RIRVJfRUdHXCI6IFwiVHJ5IGFub3RoZXIgZWdnIVwiLFxuICBcIn5CVVRUT04uQ09OVElOVUVcIjogXCJDb250aW51ZVwiLFxuICBcIn5CVVRUT04uTkVYVF9UUklBTFwiOiBcIk5leHQgdHJpYWxcIixcbiAgXCJ+QlVUVE9OLk5FWFRfQ0hBTExFTkdFXCI6IFwiTmV4dCBjaGFsbGVuZ2VcIixcbiAgXCJ+QlVUVE9OLkVORF9DQVNFXCI6IFwiRW5kIGNhc2VcIixcbiAgXCJ+QlVUVE9OLk5FWFRfQ0FTRVwiOiBcIk5leHQgY2FzZVwiLFxuICBcIn5CVVRUT04uUExBWUdST1VORF9NT1ZFX0ZPUldBUkRcIjogXCJCcmluZyBJdCBPbiFcIixcbiAgXCJ+QlVUVE9OLkNIRUNLX0RSQUtFXCI6IFwiQ2hlY2sgRHJha2VcIixcbiAgXCJ+QlVUVE9OLlNBVkVfRFJBS0VcIjogXCJTYXZlIHRoaXNcIixcbiAgXCJ+QlVUVE9OLlNVQk1JVFwiOiBcIlN1Ym1pdFwiLFxuICBcIn5CVVRUT04uUkVTRVRcIjogXCJSZXNldFwiLFxuICBcIn5CVVRUT04uRkVSVElMSVpFX0RJU0FCTEVEXCI6IFwiTWFrZSBhIGJhYnlcIixcbiAgXCJ+QlVUVE9OLkZFUlRJTElaRVwiOiBcIk1ha2UgYSBiYWJ5ISDinaTvuI9cIixcblxuICAvLyBNZXNzYWdlcyBmcm9tIElUU1xuICBcIn5JVFMuR1JFRVRJTkdcIjogXCJIaSB0aGVyZSB1c2VyIVwiXG59O1xuIiwiaW1wb3J0IGVuX3VzIGZyb20gJy4vZW4tdXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGVuX3VzXG59O1xuIiwiaW1wb3J0IHRyYW5zbGF0aW9ucyBmcm9tICcuL2xhbmcnO1xuXG5jb25zdCBkZWZhdWx0TGFuZyA9IFwiZW5fdXNcIixcbiAgICAgIHZhclJlZ0V4cCA9IC9cXCRcXHtcXHMqKFxcZCspXFxzKlxcfS9nLFxuICAgICAgZXJyb3IgPSBcIioqIFRSQU5TTEFUSU9OIEVSUk9SICoqXCI7XG5cbmNvbnN0IHRyYW5zbGF0ZVN0cmluZyA9IChrZXksIGxhbmcpID0+IHRyYW5zbGF0aW9uc1tsYW5nXSAmJiB0cmFuc2xhdGlvbnNbbGFuZ11ba2V5XSB8fCBrZXk7XG5cbi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIGlmIHRoZXkgZXhpc3QgaW4gdGhlIGxhbmd1YWdlIGZpbGUuIE90aGVyd2lzZSwgcGFzc2VzIGJhY2tcbiAqIHN0cmluZyB1bmNoYW5nZWQuXG4gKiBZb3UgY2FuIGFsc28gcGFzcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB3aGVyZSB0aGUgZmlyc3QgaXMgdGhlIG1haW4gdGV4dCwgYW5kXG4gKiB0aGUgb3RoZXJzIGFyZSB2YXJpYWJsZXMgdG8gYmUgcGxhY2VkIGluIHRoZSBzdHJpbmc6XG4gKiAgIFtcIkdvb2QgJHswfSwgJHsxfVwiLCBcImV2ZW5pbmdcIiwgXCJVc2VyXCJdXG4gKiB3aWxsIHJldHVybiBcIkdvb2QgZXZlbmluZywgVXNlclwiLiBFYWNoIHN0cmluZyBpbiB0aGUgYXJyYXkgbWF5IG9wdGlvbmFsbHkgYmVcbiAqIGluIHRoZSBsYW5ndWFnZSBmaWxlOlxuICogICBbXCJ+VElNRV9TRU5TSVRJVkVfR1JFRVRJTkdcIiwgXCJ+VElNRS5FVkVOSU5HXCIsIFwiVXNlclwiXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2xhdGUoa2V5LCBsYW5nPWRlZmF1bHRMYW5nKSB7XG4gIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIHRyYW5zbGF0ZVN0cmluZyhrZXksIGxhbmcpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgIGxldCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0ZVN0cmluZyhrZXlbMF0sIGxhbmcpO1xuICAgIHJldHVybiB0cmFuc2xhdGlvbi5yZXBsYWNlKHZhclJlZ0V4cCwgKG1hdGNoLCBpZCkgPT5cbiAgICAgIGtleVsrK2lkXSA/IHRyYW5zbGF0ZVN0cmluZyhrZXlbaWRdLCBsYW5nKSA6IGVycm9yKTtcbiAgfSBlbHNlIGlmIChrZXkgIT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IHRyYW5zbGF0ZTogXCIsIGtleSk7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuIl19
