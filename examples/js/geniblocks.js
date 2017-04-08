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

},{"./mapToZero":27,"./mergeDiff":28,"./shouldStopAnimation":32,"./stepper":34,"./stripStyle":35,"performance-now":21,"raf":23}],27:[function(require,module,exports){


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
},{}],35:[function(require,module,exports){

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
      return _reactDom2.default.findDOMNode(this._overlayInstance);
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

},{"../utilities/translate":84}],56:[function(require,module,exports){
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

var _fvGeneLabel = require('../fv-components/fv-gene-label');

var _fvGeneLabel2 = _interopRequireDefault(_fvGeneLabel);

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
      parentGenome = _ref.parentGenome,
      height = _ref.height,
      _ref$displayStyle = _ref.displayStyle,
      displayStyle = _ref$displayStyle === undefined ? {} : _ref$displayStyle;


  var containerClass = "items",
      empty = false,
      yChromosome = false,
      xChromosome = false,
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
          return selected && parentGenome ? null : _react2.default.createElement(_fvGeneLabel2.default, { chromosomeName: chromosomeName, chromosomeHeight: height, allele: a.allele, species: chromosome.species });
        }
      });
      var stripes = alleles.map(function (a) {
        if (ChromosomeImageClass !== _chromosomeImage2.default) {
          return selected && parentGenome ? null : _react2.default.createElement(_fvGeneLabel2.default, { stripe: true, chromosomeName: chromosomeName, chromosomeHeight: height, allele: a, species: chromosome.species });
        }
      });
      labels = labels.concat(stripes);

      labelsContainer = _react2.default.createElement(
        'div',
        { className: 'labels' },
        labels
      );

      if (!labelsOnRight) {
        containerClass += " rtl";
      } else {
        containerClass += " ltl";
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
    } else if (chromosome.side.indexOf("x") > -1) {
      xChromosome = true;
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
        _react2.default.createElement(ChromosomeImageClass, { small: small, empty: empty, bold: selected, yChromosome: yChromosome, xChromosome: xChromosome }),
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
  parentGenome: _react.PropTypes.bool,
  orgName: _react.PropTypes.string,
  height: _react.PropTypes.number
};

exports.default = ChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../fv-components/fv-gene-label":79,"../utilities/genetics-utils":81,"./allele":51,"./chromosome-image":58,"./gene-label":66}],60:[function(require,module,exports){
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

},{"./animated-gamete":52}],65:[function(require,module,exports){
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

},{"../utilities/genetics-utils":81}],66:[function(require,module,exports){
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

},{"./chromosome-image":58}],68:[function(require,module,exports){
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
      _onChromosomeSelected = _ref.onChromosomeSelected,
      chromosomeHeight = _ref.chromosomeHeight,
      _ref$parentGenome = _ref.parentGenome,
      parentGenome = _ref$parentGenome === undefined ? false : _ref$parentGenome;

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
          chromosomeName: chromosomeName,
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
          parentGenome: parentGenome,
          height: chromosomeHeight,
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
  chromosomeHeight: _react.PropTypes.number,
  displayStyle: _react.PropTypes.object,
  onChromosomeSelected: _react.PropTypes.func,
  orgName: _react.PropTypes.string,
  parentGenome: _react.PropTypes.bool
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

},{"../utilities/translate":84,"./button":55,"./challenge-award":56,"react-overlays/lib/Modal":36}],71:[function(require,module,exports){
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

},{"../utilities/genetics-utils":81}],79:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FVGeneLabelView = function FVGeneLabelView(_ref) {
  var allele = _ref.allele,
      species = _ref.species,
      chromosomeName = _ref.chromosomeName,
      _ref$chromosomeHeight = _ref.chromosomeHeight,
      chromosomeHeight = _ref$chromosomeHeight === undefined ? 122 : _ref$chromosomeHeight,
      stripe = _ref.stripe;

  var chromStart;
  Object.keys(BioLogica.Species.Drake.geneList).forEach(function (geneName) {
    var gene = BioLogica.Species.Drake.geneList[geneName];
    if (gene.alleles.indexOf(allele) > -1) {
      chromStart = gene.start;
      if (chromosomeName === 1) {
        console.log(allele + chromStart);
      }
    }
  });
  var bioChromHeight = BioLogica.Species.Drake.chromosomesLength[chromosomeName],
      stripeHeight = chromosomeHeight * .04,
      percentHeight = chromStart / bioChromHeight,
      style = { marginTop: percentHeight * chromosomeHeight - stripeHeight * 3 + "px" },
      stripeStyle = { height: stripeHeight + "px" },
      labelOffsetStyle = { marginTop: -stripeHeight * .6 },
      line = stripe ? null : _react2.default.createElement("div", { className: "line", style: labelOffsetStyle }),
      label = stripe ? null : species.alleleLabelMap[allele];

  return _react2.default.createElement(
    "div",
    { className: "geniblocks fv-gene-label allele noneditable " + allele.toLowerCase(), key: allele, style: style },
    line,
    _react2.default.createElement("div", { className: "stripe", style: stripeStyle }),
    _react2.default.createElement(
      "div",
      { style: labelOffsetStyle },
      label
    )
  );
};

FVGeneLabelView.propTypes = {
  species: _react.PropTypes.object.isRequired,
  allele: _react.PropTypes.string.isRequired,
  chromosomeHeight: _react.PropTypes.number,
  chromosomeName: _react.PropTypes.string,
  stripe: _react.PropTypes.bool
};

exports.default = FVGeneLabelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],80:[function(require,module,exports){
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

},{"./components/allele":51,"./components/allele-filters":50,"./components/animated-gamete":52,"./components/animated-organism":53,"./components/basket-set":54,"./components/button":55,"./components/challenge-award":56,"./components/change-sex-buttons":57,"./components/chromosome":59,"./components/chromosome-image":58,"./components/circular-glow":60,"./components/egg-clutch":61,"./components/feedback":62,"./components/fertilizing-gamete":63,"./components/gamete":65,"./components/gamete-pool":64,"./components/gene-label":66,"./components/genome":68,"./components/genome-test":67,"./components/glow-background":69,"./components/modal-alert":70,"./components/ordinal-organism":71,"./components/organism":73,"./components/organism-glow":72,"./components/pen":75,"./components/pen-stats":74,"./components/question-glow":76,"./components/question-organism-glow":77,"./components/stats":78,"./utilities/genetics-utils":81}],81:[function(require,module,exports){
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
  "~ALERT.TITLE.MISSION_ACCOMPLISHED": "Mission Accomplished!",
  "~ALERT.TITLE.INCORRECT_DRAKE": "That's not the drake!",
  "~ALERT.TITLE.EGG_MISMATCH": "That egg doesn't belong!",
  "~ALERT.TITLE.MISTAKE": "Uh oh!",
  "~ALERT.NEW_PIECE_OF_COIN": "You earned a ${0} piece of the coin!",
  "~ALERT.AWARD_LEVEL_GOLD": "gold",
  "~ALERT.AWARD_LEVEL_SILVER": "silver",
  "~ALERT.AWARD_LEVEL_BRONZE": "bronze",
  "~ALERT.COMPLETE_COIN": "You have earned all the pieces of this coin!",
  "~ALERT.COMPLETE_LAST_MISSION": "You have completed the last mission!",
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
  "~BUTTON.RETRY_CHALLENGE": "Retry challenge",
  "~BUTTON.RETRY_MISSION": "Retry mission",
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

  "~LEVEL_INDICATOR.LEVEL_LABEL": "LEVEL",
  "~TRIAL_COUNTER.TRIAL_LABEL": "TRIAL",
  "~TRIAL_COUNTER.TRIAL_n_OF_N": "${0}\xA0\xA0of\xA0\xA0${1}",

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL3V0aWxzL2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXNpbXBsZXRhYnMvZGlzdC9yZWFjdC1zaW1wbGV0YWJzLmpzIiwibm9kZV9tb2R1bGVzL3dhcm5pbmcvYnJvd3Nlci5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYmFza2V0LXNldC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYnV0dG9uLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaGFsbGVuZ2UtYXdhcmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZWdnLWNsdXRjaC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVlZGJhY2suanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2ZlcnRpbGl6aW5nLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2VuZS1sYWJlbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9tb2RhbC1hbGVydC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JkaW5hbC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3Blbi1zdGF0cy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9zdGF0cy5qcyIsInNyYy9jb2RlL2Z2LWNvbXBvbmVudHMvZnYtZ2VuZS1sYWJlbC5qcyIsInNyYy9jb2RlL2dlbmlibG9ja3MuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMuanMiLCJzcmMvY29kZS91dGlsaXRpZXMvbGFuZy9lbi11cy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9sYW5nL2luZGV4LmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL3RyYW5zbGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDclFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDamhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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dGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4vdXRpbC9iYWJlbEhlbHBlcnMuanMnKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuLyoqXHJcbiAqIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcclxuICovXG5leHBvcnRzWydkZWZhdWx0J10gPSBhY3RpdmVFbGVtZW50O1xuXG52YXIgX293bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IGJhYmVsSGVscGVycy5pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG5mdW5jdGlvbiBhY3RpdmVFbGVtZW50KCkge1xuICB2YXIgZG9jID0gYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBkb2N1bWVudCA6IGFyZ3VtZW50c1swXTtcblxuICB0cnkge1xuICAgIHJldHVybiBkb2MuYWN0aXZlRWxlbWVudDtcbiAgfSBjYXRjaCAoZSkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGhhc0NsYXNzID0gcmVxdWlyZSgnLi9oYXNDbGFzcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFkZENsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO2Vsc2UgaWYgKCFoYXNDbGFzcyhlbGVtZW50KSkgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZSArICcgJyArIGNsYXNzTmFtZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSByZXR1cm4gISFjbGFzc05hbWUgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtlbHNlIHJldHVybiAoJyAnICsgZWxlbWVudC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJyAnICsgY2xhc3NOYW1lICsgJyAnKSAhPT0gLTE7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZENsYXNzOiByZXF1aXJlKCcuL2FkZENsYXNzJyksXG4gIHJlbW92ZUNsYXNzOiByZXF1aXJlKCcuL3JlbW92ZUNsYXNzJyksXG4gIGhhc0NsYXNzOiByZXF1aXJlKCcuL2hhc0NsYXNzJylcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO2Vsc2UgZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBjbGFzc05hbWUgKyAnKD86XFxcXHN8JCknLCAnZycpLCAnJDEnKS5yZXBsYWNlKC9cXHMrL2csICcgJykucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi4vdXRpbC9pbkRPTScpO1xudmFyIG9mZiA9IGZ1bmN0aW9uIG9mZigpIHt9O1xuXG5pZiAoY2FuVXNlRE9NKSB7XG5cbiAgb2ZmID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAgICAgcmV0dXJuIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUgfHwgZmFsc2UpO1xuICAgIH07ZWxzZSBpZiAoZG9jdW1lbnQuYXR0YWNoRXZlbnQpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICByZXR1cm4gbm9kZS5kZXRhY2hFdmVudCgnb24nICsgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB9O1xuICB9KSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9mZjsiLCIndXNlIHN0cmljdCc7XG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi4vdXRpbC9pbkRPTScpO1xudmFyIG9uID0gZnVuY3Rpb24gb24oKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuICBvbiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvbjsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gb3duZXJEb2N1bWVudDtcblxuZnVuY3Rpb24gb3duZXJEb2N1bWVudChub2RlKSB7XG4gIHJldHVybiBub2RlICYmIG5vZGUub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG52YXIgY2FuVXNlRE9NID0gcmVxdWlyZSgnLi4vdXRpbC9pbkRPTScpO1xuXG52YXIgY29udGFpbnMgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcm9vdCA9IGNhblVzZURPTSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgcmV0dXJuIHJvb3QgJiYgcm9vdC5jb250YWlucyA/IGZ1bmN0aW9uIChjb250ZXh0LCBub2RlKSB7XG4gICAgcmV0dXJuIGNvbnRleHQuY29udGFpbnMobm9kZSk7XG4gIH0gOiByb290ICYmIHJvb3QuY29tcGFyZURvY3VtZW50UG9zaXRpb24gPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0ID09PSBub2RlIHx8ICEhKGNvbnRleHQuY29tcGFyZURvY3VtZW50UG9zaXRpb24obm9kZSkgJiAxNik7XG4gIH0gOiBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIGlmIChub2RlKSBkbyB7XG4gICAgICBpZiAobm9kZSA9PT0gY29udGV4dCkgcmV0dXJuIHRydWU7XG4gICAgfSB3aGlsZSAobm9kZSA9IG5vZGUucGFyZW50Tm9kZSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICByZXR1cm4gbm9kZSA9PT0gbm9kZS53aW5kb3cgPyBub2RlIDogbm9kZS5ub2RlVHlwZSA9PT0gOSA/IG5vZGUuZGVmYXVsdFZpZXcgfHwgbm9kZS5wYXJlbnRXaW5kb3cgOiBmYWxzZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmFiZWxIZWxwZXJzID0gcmVxdWlyZSgnLi4vdXRpbC9iYWJlbEhlbHBlcnMuanMnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZSA9IHJlcXVpcmUoJy4uL3V0aWwvY2FtZWxpemVTdHlsZScpO1xuXG52YXIgX3V0aWxDYW1lbGl6ZVN0eWxlMiA9IGJhYmVsSGVscGVycy5pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxDYW1lbGl6ZVN0eWxlKTtcblxudmFyIHJwb3NpdGlvbiA9IC9eKHRvcHxyaWdodHxib3R0b218bGVmdCkkLztcbnZhciBybnVtbm9ucHggPSAvXihbKy1dPyg/OlxcZCpcXC58KVxcZCsoPzpbZUVdWystXT9cXGQrfCkpKD8hcHgpW2EteiVdKyQvaTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKSB7XG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignTm8gRWxlbWVudCBwYXNzZWQgdG8gYGdldENvbXB1dGVkU3R5bGUoKWAnKTtcbiAgdmFyIGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcblxuICByZXR1cm4gJ2RlZmF1bHRWaWV3JyBpbiBkb2MgPyBkb2MuZGVmYXVsdFZpZXcub3BlbmVyID8gbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKSA6IHsgLy9pZSA4IFwibWFnaWNcIiBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzEuMTEtc3RhYmxlL3NyYy9jc3MvY3VyQ1NTLmpzI0w3MlxuICAgIGdldFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uIGdldFByb3BlcnR5VmFsdWUocHJvcCkge1xuICAgICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZTtcblxuICAgICAgcHJvcCA9ICgwLCBfdXRpbENhbWVsaXplU3R5bGUyWydkZWZhdWx0J10pKHByb3ApO1xuXG4gICAgICBpZiAocHJvcCA9PSAnZmxvYXQnKSBwcm9wID0gJ3N0eWxlRmxvYXQnO1xuXG4gICAgICB2YXIgY3VycmVudCA9IG5vZGUuY3VycmVudFN0eWxlW3Byb3BdIHx8IG51bGw7XG5cbiAgICAgIGlmIChjdXJyZW50ID09IG51bGwgJiYgc3R5bGUgJiYgc3R5bGVbcHJvcF0pIGN1cnJlbnQgPSBzdHlsZVtwcm9wXTtcblxuICAgICAgaWYgKHJudW1ub25weC50ZXN0KGN1cnJlbnQpICYmICFycG9zaXRpb24udGVzdChwcm9wKSkge1xuICAgICAgICAvLyBSZW1lbWJlciB0aGUgb3JpZ2luYWwgdmFsdWVzXG4gICAgICAgIHZhciBsZWZ0ID0gc3R5bGUubGVmdDtcbiAgICAgICAgdmFyIHJ1blN0eWxlID0gbm9kZS5ydW50aW1lU3R5bGU7XG4gICAgICAgIHZhciByc0xlZnQgPSBydW5TdHlsZSAmJiBydW5TdHlsZS5sZWZ0O1xuXG4gICAgICAgIC8vIFB1dCBpbiB0aGUgbmV3IHZhbHVlcyB0byBnZXQgYSBjb21wdXRlZCB2YWx1ZSBvdXRcbiAgICAgICAgaWYgKHJzTGVmdCkgcnVuU3R5bGUubGVmdCA9IG5vZGUuY3VycmVudFN0eWxlLmxlZnQ7XG5cbiAgICAgICAgc3R5bGUubGVmdCA9IHByb3AgPT09ICdmb250U2l6ZScgPyAnMWVtJyA6IGN1cnJlbnQ7XG4gICAgICAgIGN1cnJlbnQgPSBzdHlsZS5waXhlbExlZnQgKyAncHgnO1xuXG4gICAgICAgIC8vIFJldmVydCB0aGUgY2hhbmdlZCB2YWx1ZXNcbiAgICAgICAgc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSByc0xlZnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKSxcbiAgICBoeXBoZW5hdGUgPSByZXF1aXJlKCcuLi91dGlsL2h5cGhlbmF0ZVN0eWxlJyksXG4gICAgX2dldENvbXB1dGVkU3R5bGUgPSByZXF1aXJlKCcuL2dldENvbXB1dGVkU3R5bGUnKSxcbiAgICByZW1vdmVTdHlsZSA9IHJlcXVpcmUoJy4vcmVtb3ZlU3R5bGUnKTtcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3R5bGUobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gIHZhciBjc3MgPSAnJyxcbiAgICAgIHByb3BzID0gcHJvcGVydHk7XG5cbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ3N0cmluZycpIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gbm9kZS5zdHlsZVtjYW1lbGl6ZShwcm9wZXJ0eSldIHx8IF9nZXRDb21wdXRlZFN0eWxlKG5vZGUpLmdldFByb3BlcnR5VmFsdWUoaHlwaGVuYXRlKHByb3BlcnR5KSk7ZWxzZSAocHJvcHMgPSB7fSlbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIGlmIChoYXMuY2FsbChwcm9wcywga2V5KSkge1xuICAgICFwcm9wc1trZXldICYmIHByb3BzW2tleV0gIT09IDAgPyByZW1vdmVTdHlsZShub2RlLCBoeXBoZW5hdGUoa2V5KSkgOiBjc3MgKz0gaHlwaGVuYXRlKGtleSkgKyAnOicgKyBwcm9wc1trZXldICsgJzsnO1xuICB9XG5cbiAgbm9kZS5zdHlsZS5jc3NUZXh0ICs9ICc7JyArIGNzcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlbW92ZVN0eWxlKG5vZGUsIGtleSkge1xuICByZXR1cm4gJ3JlbW92ZVByb3BlcnR5JyBpbiBub2RlLnN0eWxlID8gbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShrZXkpIDogbm9kZS5zdHlsZS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbn07IiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXCJleHBvcnRzXCJdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gIH0gZWxzZSB7XG4gICAgZmFjdG9yeShyb290LmJhYmVsSGVscGVycyA9IHt9KTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKGdsb2JhbCkge1xuICB2YXIgYmFiZWxIZWxwZXJzID0gZ2xvYmFsO1xuXG4gIGJhYmVsSGVscGVycy5pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgICB9O1xuICB9O1xuXG4gIGJhYmVsSGVscGVycy5fZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG59KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgckh5cGhlbiA9IC8tKC4pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShySHlwaGVuLCBmdW5jdGlvbiAoXywgY2hyKSB7XG4gICAgcmV0dXJuIGNoci50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2NhbWVsaXplU3R5bGVOYW1lLmpzXHJcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG52YXIgY2FtZWxpemUgPSByZXF1aXJlKCcuL2NhbWVsaXplJyk7XG52YXIgbXNQYXR0ZXJuID0gL14tbXMtLztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYW1lbGl6ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGNhbWVsaXplKHN0cmluZy5yZXBsYWNlKG1zUGF0dGVybiwgJ21zLScpKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgclVwcGVyID0gLyhbQS1aXSkvZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoeXBoZW5hdGUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShyVXBwZXIsICctJDEnKS50b0xvd2VyQ2FzZSgpO1xufTsiLCIvKipcclxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvMmFlYjhhMmE2YmViMDA2MTdhNDIxN2Y3ZjgyODQ5MjRmYTJhZDgxOS9zcmMvdmVuZG9yL2NvcmUvaHlwaGVuYXRlU3R5bGVOYW1lLmpzXHJcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGh5cGhlbmF0ZSA9IHJlcXVpcmUoXCIuL2h5cGhlbmF0ZVwiKTtcbnZhciBtc1BhdHRlcm4gPSAvXm1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlU3R5bGVOYW1lKHN0cmluZykge1xuICByZXR1cm4gaHlwaGVuYXRlKHN0cmluZykucmVwbGFjZShtc1BhdHRlcm4sIFwiLW1zLVwiKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZG9jdW1lbnQgJiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4vaW5ET00nKTtcblxudmFyIHNpemU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlY2FsYykge1xuICBpZiAoIXNpemUgfHwgcmVjYWxjKSB7XG4gICAgaWYgKGNhblVzZURPTSkge1xuICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICBzY3JvbGxEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS53aWR0aCA9ICc1MHB4JztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS5oZWlnaHQgPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICAgICAgc2l6ZSA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2l6ZTtcbn07IiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgZ2V0TmFub1NlY29uZHMsIGhydGltZSwgbG9hZFRpbWU7XG5cbiAgaWYgKCh0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwpICYmIHBlcmZvcm1hbmNlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfTtcbiAgfSBlbHNlIGlmICgodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2VzcyAhPT0gbnVsbCkgJiYgcHJvY2Vzcy5ocnRpbWUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChnZXROYW5vU2Vjb25kcygpIC0gbG9hZFRpbWUpIC8gMWU2O1xuICAgIH07XG4gICAgaHJ0aW1lID0gcHJvY2Vzcy5ocnRpbWU7XG4gICAgZ2V0TmFub1NlY29uZHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBocjtcbiAgICAgIGhyID0gaHJ0aW1lKCk7XG4gICAgICByZXR1cm4gaHJbMF0gKiAxZTkgKyBoclsxXTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gZ2V0TmFub1NlY29uZHMoKTtcbiAgfSBlbHNlIGlmIChEYXRlLm5vdykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBEYXRlLm5vdygpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJ2YXIgbm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93JylcbiAgLCByb290ID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3dcbiAgLCB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0J11cbiAgLCBzdWZmaXggPSAnQW5pbWF0aW9uRnJhbWUnXG4gICwgcmFmID0gcm9vdFsncmVxdWVzdCcgKyBzdWZmaXhdXG4gICwgY2FmID0gcm9vdFsnY2FuY2VsJyArIHN1ZmZpeF0gfHwgcm9vdFsnY2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG5cbmZvcih2YXIgaSA9IDA7ICFyYWYgJiYgaSA8IHZlbmRvcnMubGVuZ3RoOyBpKyspIHtcbiAgcmFmID0gcm9vdFt2ZW5kb3JzW2ldICsgJ1JlcXVlc3QnICsgc3VmZml4XVxuICBjYWYgPSByb290W3ZlbmRvcnNbaV0gKyAnQ2FuY2VsJyArIHN1ZmZpeF1cbiAgICAgIHx8IHJvb3RbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cbn1cblxuLy8gU29tZSB2ZXJzaW9ucyBvZiBGRiBoYXZlIHJBRiBidXQgbm90IGNBRlxuaWYoIXJhZiB8fCAhY2FmKSB7XG4gIHZhciBsYXN0ID0gMFxuICAgICwgaWQgPSAwXG4gICAgLCBxdWV1ZSA9IFtdXG4gICAgLCBmcmFtZUR1cmF0aW9uID0gMTAwMCAvIDYwXG5cbiAgcmFmID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZihxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBfbm93ID0gbm93KClcbiAgICAgICAgLCBuZXh0ID0gTWF0aC5tYXgoMCwgZnJhbWVEdXJhdGlvbiAtIChfbm93IC0gbGFzdCkpXG4gICAgICBsYXN0ID0gbmV4dCArIF9ub3dcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjcCA9IHF1ZXVlLnNsaWNlKDApXG4gICAgICAgIC8vIENsZWFyIHF1ZXVlIGhlcmUgdG8gcHJldmVudFxuICAgICAgICAvLyBjYWxsYmFja3MgZnJvbSBhcHBlbmRpbmcgbGlzdGVuZXJzXG4gICAgICAgIC8vIHRvIHRoZSBjdXJyZW50IGZyYW1lJ3MgcXVldWVcbiAgICAgICAgcXVldWUubGVuZ3RoID0gMFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZighY3BbaV0uY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgIGNwW2ldLmNhbGxiYWNrKGxhc3QpXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZSB9LCAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgTWF0aC5yb3VuZChuZXh0KSlcbiAgICB9XG4gICAgcXVldWUucHVzaCh7XG4gICAgICBoYW5kbGU6ICsraWQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjYW5jZWxsZWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGNhZiA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYocXVldWVbaV0uaGFuZGxlID09PSBoYW5kbGUpIHtcbiAgICAgICAgcXVldWVbaV0uY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuKSB7XG4gIC8vIFdyYXAgaW4gYSBuZXcgZnVuY3Rpb24gdG8gcHJldmVudFxuICAvLyBgY2FuY2VsYCBwb3RlbnRpYWxseSBiZWluZyBhc3NpZ25lZFxuICAvLyB0byB0aGUgbmF0aXZlIHJBRiBmdW5jdGlvblxuICByZXR1cm4gcmFmLmNhbGwocm9vdCwgZm4pXG59XG5tb2R1bGUuZXhwb3J0cy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgY2FmLmFwcGx5KHJvb3QsIGFyZ3VtZW50cylcbn1cbm1vZHVsZS5leHBvcnRzLnBvbHlmaWxsID0gZnVuY3Rpb24oKSB7XG4gIHJvb3QucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmFmXG4gIHJvb3QuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBjYWZcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BlcmZvcm1hbmNlTm93KTtcblxudmFyIF9yYWYgPSByZXF1aXJlKCdyYWYnKTtcblxudmFyIF9yYWYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmFmKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9zaG91bGRTdG9wQW5pbWF0aW9uJyk7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaG91bGRTdG9wQW5pbWF0aW9uKTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIG1zUGVyRnJhbWUgPSAxMDAwIC8gNjA7XG5cbnZhciBNb3Rpb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ01vdGlvbicsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgLy8gVE9PRDogd2FybiBhZ2FpbnN0IHB1dHRpbmcgYSBjb25maWcgaW4gaGVyZVxuICAgIGRlZmF1bHRTdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm51bWJlciksXG4gICAgc3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdF0pKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvblJlc3Q6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGUgPSBfcHJvcHMuZGVmYXVsdFN0eWxlO1xuICAgIHZhciBzdHlsZSA9IF9wcm9wcy5zdHlsZTtcblxuICAgIHZhciBjdXJyZW50U3R5bGUgPSBkZWZhdWx0U3R5bGUgfHwgX3N0cmlwU3R5bGUyWydkZWZhdWx0J10oc3R5bGUpO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdHkgPSBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZTogY3VycmVudFN0eWxlLFxuICAgICAgY3VycmVudFZlbG9jaXR5OiBjdXJyZW50VmVsb2NpdHksXG4gICAgICBsYXN0SWRlYWxTdHlsZTogY3VycmVudFN0eWxlLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eVxuICAgIH07XG4gIH0sXG5cbiAgd2FzQW5pbWF0aW5nOiBmYWxzZSxcbiAgYW5pbWF0aW9uSUQ6IG51bGwsXG4gIHByZXZUaW1lOiAwLFxuICBhY2N1bXVsYXRlZFRpbWU6IDAsXG4gIC8vIGl0J3MgcG9zc2libGUgdGhhdCBjdXJyZW50U3R5bGUncyB2YWx1ZSBpcyBzdGFsZTogaWYgcHJvcHMgaXMgaW1tZWRpYXRlbHlcbiAgLy8gY2hhbmdlZCBmcm9tIDAgdG8gNDAwIHRvIHNwcmluZygwKSBhZ2FpbiwgdGhlIGFzeW5jIGN1cnJlbnRTdHlsZSBpcyBzdGlsbFxuICAvLyBhdCAwIChkaWRuJ3QgaGF2ZSB0aW1lIHRvIHRpY2sgYW5kIGludGVycG9sYXRlIGV2ZW4gb25jZSkuIElmIHdlIG5haXZlbHlcbiAgLy8gY29tcGFyZSBjdXJyZW50U3R5bGUgd2l0aCBkZXN0VmFsIGl0J2xsIGJlIDAgPT09IDAgKG5vIGFuaW1hdGlvbiwgc3RvcCkuXG4gIC8vIEluIHJlYWxpdHkgY3VycmVudFN0eWxlIHNob3VsZCBiZSA0MDBcbiAgdW5yZWFkUHJvcFN0eWxlOiBudWxsLFxuICAvLyBhZnRlciBjaGVja2luZyBmb3IgdW5yZWFkUHJvcFN0eWxlICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZShkZXN0U3R5bGUpIHtcbiAgICB2YXIgZGlydHkgPSBmYWxzZTtcbiAgICB2YXIgX3N0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB2YXIgY3VycmVudFN0eWxlID0gX3N0YXRlLmN1cnJlbnRTdHlsZTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXR5ID0gX3N0YXRlLmN1cnJlbnRWZWxvY2l0eTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGUgPSBfc3RhdGUubGFzdElkZWFsU3R5bGU7XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXR5ID0gX3N0YXRlLmxhc3RJZGVhbFZlbG9jaXR5O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGRlc3RTdHlsZSkge1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzdFN0eWxlLCBrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnRTdHlsZSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGUpO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdHkpO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlKTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgbGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZTogY3VycmVudFN0eWxlLCBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSwgbGFzdElkZWFsU3R5bGU6IGxhc3RJZGVhbFN0eWxlLCBsYXN0SWRlYWxWZWxvY2l0eTogbGFzdElkZWFsVmVsb2NpdHkgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgdmFyIHByb3BzU3R5bGUgPSBfdGhpcy5wcm9wcy5zdHlsZTtcbiAgICAgIGlmIChfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGUsIHByb3BzU3R5bGUsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0eSkpIHtcbiAgICAgICAgaWYgKF90aGlzLndhc0FuaW1hdGluZyAmJiBfdGhpcy5wcm9wcy5vblJlc3QpIHtcbiAgICAgICAgICBfdGhpcy5wcm9wcy5vblJlc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSB0aW1lc3RhbXAgfHwgX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGUgPSB7fTtcbiAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzU3R5bGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJvcHNTdHlsZSwga2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBwcm9wc1N0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVba2V5XTtcbiAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXR5W2tleV07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZXNUb0NhdGNoVXA7IGkrKykge1xuICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfc3RlcHBlclsxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICB2YXIgbmV4dElkZWFsWCA9IF9zdGVwcGVyMlswXTtcbiAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSArIChuZXh0SWRlYWxWIC0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZTogbmV3Q3VycmVudFN0eWxlLFxuICAgICAgICBjdXJyZW50VmVsb2NpdHk6IG5ld0N1cnJlbnRWZWxvY2l0eSxcbiAgICAgICAgbGFzdElkZWFsU3R5bGU6IG5ld0xhc3RJZGVhbFN0eWxlLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eTogbmV3TGFzdElkZWFsVmVsb2NpdHlcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZSk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBwcm9wcy5zdHlsZTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG5mdW5jdGlvbiBzaG91bGRTdG9wQW5pbWF0aW9uQWxsKGN1cnJlbnRTdHlsZXMsIHN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBzdHlsZXNbaV0sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFN0YWdnZXJlZE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU3RhZ2dlcmVkTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpKSxcbiAgICBzdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgfHwgc3R5bGVzKCkubWFwKF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBjdXJyZW50U3R5bGVzLm1hcChmdW5jdGlvbiAoY3VycmVudFN0eWxlKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXNcbiAgICB9O1xuICB9LFxuXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfc3RhdGUuY3VycmVudFN0eWxlcztcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfc3RhdGUuY3VycmVudFZlbG9jaXRpZXM7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlcyA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZXM7XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcztcblxuICAgIHZhciBzb21lRGlydHkgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1bnJlYWRQcm9wU3R5bGUgPSB1bnJlYWRQcm9wU3R5bGVzW2ldO1xuICAgICAgdmFyIGRpcnR5ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB1bnJlYWRQcm9wU3R5bGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodW5yZWFkUHJvcFN0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgc29tZURpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsVmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc29tZURpcnR5KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFN0eWxlczogY3VycmVudFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLCBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcywgbGFzdElkZWFsVmVsb2NpdGllczogbGFzdElkZWFsVmVsb2NpdGllcyB9KTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAodGltZXN0YW1wKSB7XG4gICAgICB2YXIgZGVzdFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcyhfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcykpIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gdGltZXN0YW1wIHx8IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzdFN0eWxlID0gZGVzdFN0eWxlc1tpXTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGVzdFN0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzW2ldW2tleV07XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZnJhbWVzVG9DYXRjaFVwOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG5ld0N1cnJlbnRTdHlsZTtcbiAgICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBuZXdDdXJyZW50VmVsb2NpdHk7XG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZXM6IG5ld0N1cnJlbnRTdHlsZXMsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBuZXdDdXJyZW50VmVsb2NpdGllcyxcbiAgICAgICAgbGFzdElkZWFsU3R5bGVzOiBuZXdMYXN0SWRlYWxTdHlsZXMsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCkge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlcyk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gcHJvcHMuc3R5bGVzKHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gU3RhZ2dlcmVkTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX21lcmdlRGlmZiA9IHJlcXVpcmUoJy4vbWVyZ2VEaWZmJyk7XG5cbnZhciBfbWVyZ2VEaWZmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lcmdlRGlmZik7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG4vLyB0aGUgY2hpbGRyZW4gZnVuY3Rpb24gJiAocG90ZW50aWFsKSBzdHlsZXMgZnVuY3Rpb24gYXNrcyBhcyBwYXJhbSBhblxuLy8gQXJyYXk8VHJhbnNpdGlvblBsYWluU3R5bGU+LCB3aGVyZSBlYWNoIFRyYW5zaXRpb25QbGFpblN0eWxlIGlzIG9mIHRoZSBmb3JtYXRcbi8vIHtrZXk6IHN0cmluZywgZGF0YT86IGFueSwgc3R5bGU6IFBsYWluU3R5bGV9LiBIb3dldmVyLCB0aGUgd2F5IHdlIGtlZXBcbi8vIGludGVybmFsIHN0YXRlcyBkb2Vzbid0IGNvbnRhaW4gc3VjaCBhIGRhdGEgc3RydWN0dXJlIChjaGVjayB0aGUgc3RhdGUgYW5kXG4vLyBUcmFuc2l0aW9uTW90aW9uU3RhdGUpLiBTbyB3aGVuIGNoaWxkcmVuIGZ1bmN0aW9uIGFuZCBvdGhlcnMgYXNrIGZvciBzdWNoXG4vLyBkYXRhIHdlIG5lZWQgdG8gZ2VuZXJhdGUgdGhlbSBvbiB0aGUgZmx5IGJ5IGNvbWJpbmluZyBtZXJnZWRQcm9wc1N0eWxlcyBhbmRcbi8vIGN1cnJlbnRTdHlsZXMvbGFzdElkZWFsU3R5bGVzXG5mdW5jdGlvbiByZWh5ZHJhdGVTdHlsZXMobWVyZ2VkUHJvcHNTdHlsZXMsIHVucmVhZFByb3BTdHlsZXMsIHBsYWluU3R5bGVzKSB7XG4gIC8vIENvcHkgdGhlIHZhbHVlIHRvIGEgYGNvbnN0YCBzbyB0aGF0IEZsb3cgdW5kZXJzdGFuZHMgdGhhdCB0aGUgY29uc3Qgd29uJ3RcbiAgLy8gY2hhbmdlIGFuZCB3aWxsIGJlIG5vbi1udWxsYWJsZSBpbiB0aGUgY2FsbGJhY2sgYmVsb3cuXG4gIHZhciBjVW5yZWFkUHJvcFN0eWxlcyA9IHVucmVhZFByb3BTdHlsZXM7XG4gIGlmIChjVW5yZWFkUHJvcFN0eWxlcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG1lcmdlZFByb3BzU3R5bGVzLm1hcChmdW5jdGlvbiAobWVyZ2VkUHJvcHNTdHlsZSwgaSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSxcbiAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLFxuICAgICAgICBzdHlsZTogcGxhaW5TdHlsZXNbaV1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG1lcmdlZFByb3BzU3R5bGVzLm1hcChmdW5jdGlvbiAobWVyZ2VkUHJvcHNTdHlsZSwgaSkge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgY1VucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChjVW5yZWFkUHJvcFN0eWxlc1tqXS5rZXkgPT09IG1lcmdlZFByb3BzU3R5bGUua2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2V5OiBjVW5yZWFkUHJvcFN0eWxlc1tqXS5rZXksXG4gICAgICAgICAgZGF0YTogY1VucmVhZFByb3BTdHlsZXNbal0uZGF0YSxcbiAgICAgICAgICBzdHlsZTogcGxhaW5TdHlsZXNbaV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLCBzdHlsZTogcGxhaW5TdHlsZXNbaV0gfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMsIG1lcmdlZFByb3BzU3R5bGVzKSB7XG4gIGlmIChtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGggIT09IGRlc3RTdHlsZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtZXJnZWRQcm9wc1N0eWxlc1tpXS5rZXkgIT09IGRlc3RTdHlsZXNbaV0ua2V5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gd2UgaGF2ZSB0aGUgaW52YXJpYW50IHRoYXQgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4gIC8vIGN1cnJlbnRTdHlsZXMvY3VycmVudFZlbG9jaXRpZXMvbGFzdCogYXJlIHN5bmNlZCBpbiB0ZXJtcyBvZiBjZWxscywgc2VlXG4gIC8vIG1lcmdlQW5kU3luYyBjb21tZW50IGZvciBtb3JlIGluZm9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10oY3VycmVudFN0eWxlc1tpXSwgZGVzdFN0eWxlc1tpXS5zdHlsZSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvcmUga2V5IG1lcmdpbmcgbG9naWNcblxuLy8gdGhpbmdzIHRvIGRvOiBzYXkgcHJldmlvdXNseSBtZXJnZWQgc3R5bGUgaXMge2EsIGJ9LCBkZXN0IHN0eWxlIChwcm9wKSBpcyB7Yixcbi8vIGN9LCBwcmV2aW91cyBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBpcyB7YSwgYn1cbi8vICoqaW52YXJpYW50Kio6IGN1cnJlbnRbaV0gY29ycmVzcG9uZHMgdG8gbWVyZ2VkW2ldIGluIHRlcm1zIG9mIGtleVxuXG4vLyBzdGVwczpcbi8vIHR1cm4gbWVyZ2VkIHN0eWxlIGludG8ge2E/LCBiLCBjfVxuLy8gICAgYWRkIGMsIHZhbHVlIG9mIGMgaXMgZGVzdFN0eWxlcy5jXG4vLyAgICBtYXliZSByZW1vdmUgYSwgYWthIGNhbGwgd2lsbExlYXZlKGEpLCB0aGVuIG1lcmdlZCBpcyBlaXRoZXIge2IsIGN9IG9yIHthLCBiLCBjfVxuLy8gdHVybiBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBmcm9tIHthLCBifSBpbnRvIHthPywgYiwgY31cbi8vICAgIG1heWJlIHJlbW92ZSBhXG4vLyAgICBjZXJ0YWlubHkgYWRkIGMsIHZhbHVlIG9mIGMgaXMgd2lsbEVudGVyKGMpXG4vLyBsb29wIG92ZXIgbWVyZ2VkIGFuZCBjb25zdHJ1Y3QgbmV3IGN1cnJlbnRcbi8vIGRlc3QgZG9lc24ndCBjaGFuZ2UsIHRoYXQncyBvd25lcidzXG5mdW5jdGlvbiBtZXJnZUFuZFN5bmMod2lsbEVudGVyLCB3aWxsTGVhdmUsIGRpZExlYXZlLCBvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgb2xkQ3VycmVudFN0eWxlcywgb2xkQ3VycmVudFZlbG9jaXRpZXMsIG9sZExhc3RJZGVhbFN0eWxlcywgb2xkTGFzdElkZWFsVmVsb2NpdGllcykge1xuICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VEaWZmMlsnZGVmYXVsdCddKG9sZE1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBmdW5jdGlvbiAob2xkSW5kZXgsIG9sZE1lcmdlZFByb3BzU3R5bGUpIHtcbiAgICB2YXIgbGVhdmluZ1N0eWxlID0gd2lsbExlYXZlKG9sZE1lcmdlZFByb3BzU3R5bGUpO1xuICAgIGlmIChsZWF2aW5nU3R5bGUgPT0gbnVsbCkge1xuICAgICAgZGlkTGVhdmUoeyBrZXk6IG9sZE1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBvbGRNZXJnZWRQcm9wc1N0eWxlLmRhdGEgfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKG9sZEN1cnJlbnRTdHlsZXNbb2xkSW5kZXhdLCBsZWF2aW5nU3R5bGUsIG9sZEN1cnJlbnRWZWxvY2l0aWVzW29sZEluZGV4XSkpIHtcbiAgICAgIGRpZExlYXZlKHsga2V5OiBvbGRNZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5kYXRhIH0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7IGtleTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5rZXksIGRhdGE6IG9sZE1lcmdlZFByb3BzU3R5bGUuZGF0YSwgc3R5bGU6IGxlYXZpbmdTdHlsZSB9O1xuICB9KTtcblxuICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IFtdO1xuICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdGllcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld01lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVDZWxsID0gbmV3TWVyZ2VkUHJvcHNTdHlsZXNbaV07XG4gICAgdmFyIGZvdW5kT2xkSW5kZXggPSBudWxsO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChvbGRNZXJnZWRQcm9wc1N0eWxlc1tqXS5rZXkgPT09IG5ld01lcmdlZFByb3BzU3R5bGVDZWxsLmtleSkge1xuICAgICAgICBmb3VuZE9sZEluZGV4ID0gajtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE86IGtleSBzZWFyY2ggY29kZVxuICAgIGlmIChmb3VuZE9sZEluZGV4ID09IG51bGwpIHtcbiAgICAgIHZhciBwbGFpblN0eWxlID0gd2lsbEVudGVyKG5ld01lcmdlZFByb3BzU3R5bGVDZWxsKTtcbiAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBwbGFpblN0eWxlO1xuICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcblxuICAgICAgdmFyIHZlbG9jaXR5ID0gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5zdHlsZSk7XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IHZlbG9jaXR5O1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IHZlbG9jaXR5O1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gb2xkQ3VycmVudFN0eWxlc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG9sZExhc3RJZGVhbFN0eWxlc1tmb3VuZE9sZEluZGV4XTtcbiAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gb2xkQ3VycmVudFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gb2xkTGFzdElkZWFsVmVsb2NpdGllc1tmb3VuZE9sZEluZGV4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW25ld01lcmdlZFByb3BzU3R5bGVzLCBuZXdDdXJyZW50U3R5bGVzLCBuZXdDdXJyZW50VmVsb2NpdGllcywgbmV3TGFzdElkZWFsU3R5bGVzLCBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXTtcbn1cblxudmFyIFRyYW5zaXRpb25Nb3Rpb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RyYW5zaXRpb25Nb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIGRlZmF1bHRTdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihfcmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGtleTogX3JlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGE6IF9yZWFjdC5Qcm9wVHlwZXMuYW55LFxuICAgICAgc3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWRcbiAgICB9KSksXG4gICAgc3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5mdW5jLCBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLm51bWJlciwgX3JlYWN0LlByb3BUeXBlcy5vYmplY3RdKSkuaXNSZXF1aXJlZFxuICAgIH0pKV0pLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHdpbGxFbnRlcjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHdpbGxMZWF2ZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGRpZExlYXZlOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lsbEVudGVyOiBmdW5jdGlvbiB3aWxsRW50ZXIoc3R5bGVUaGF0RW50ZXJlZCkge1xuICAgICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10oc3R5bGVUaGF0RW50ZXJlZC5zdHlsZSk7XG4gICAgICB9LFxuICAgICAgLy8gcmVjYWxsOiByZXR1cm5pbmcgbnVsbCBtYWtlcyB0aGUgY3VycmVudCB1bm1vdW50aW5nIFRyYW5zaXRpb25TdHlsZVxuICAgICAgLy8gZGlzYXBwZWFyIGltbWVkaWF0ZWx5XG4gICAgICB3aWxsTGVhdmU6IGZ1bmN0aW9uIHdpbGxMZWF2ZSgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgZGlkTGVhdmU6IGZ1bmN0aW9uIGRpZExlYXZlKCkge31cbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG4gICAgdmFyIHdpbGxFbnRlciA9IF9wcm9wcy53aWxsRW50ZXI7XG4gICAgdmFyIHdpbGxMZWF2ZSA9IF9wcm9wcy53aWxsTGVhdmU7XG4gICAgdmFyIGRpZExlYXZlID0gX3Byb3BzLmRpZExlYXZlO1xuXG4gICAgdmFyIGRlc3RTdHlsZXMgPSB0eXBlb2Ygc3R5bGVzID09PSAnZnVuY3Rpb24nID8gc3R5bGVzKGRlZmF1bHRTdHlsZXMpIDogc3R5bGVzO1xuXG4gICAgLy8gdGhpcyBpcyBzcGVjaWFsLiBmb3IgdGhlIGZpcnN0IHRpbWUgYXJvdW5kLCB3ZSBkb24ndCBoYXZlIGEgY29tcGFyaXNvblxuICAgIC8vIGJldHdlZW4gbGFzdCAobm8gbGFzdCkgYW5kIGN1cnJlbnQgbWVyZ2VkIHByb3BzLiB3ZSdsbCBjb21wdXRlIGxhc3Qgc286XG4gICAgLy8gc2F5IGRlZmF1bHQgaXMge2EsIGJ9IGFuZCBzdHlsZXMgKGRlc3Qgc3R5bGUpIGlzIHtiLCBjfSwgd2UnbGxcbiAgICAvLyBmYWJyaWNhdGUgbGFzdCBhcyB7YSwgYn1cbiAgICB2YXIgb2xkTWVyZ2VkUHJvcHNTdHlsZXMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGRlZmF1bHRTdHlsZXMgPT0gbnVsbCkge1xuICAgICAgb2xkTWVyZ2VkUHJvcHNTdHlsZXMgPSBkZXN0U3R5bGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChkZWZhdWx0U3R5bGVDZWxsKSB7XG4gICAgICAgIC8vIFRPRE86IGtleSBzZWFyY2ggY29kZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlc3RTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGVzdFN0eWxlc1tpXS5rZXkgPT09IGRlZmF1bHRTdHlsZUNlbGwua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZGVzdFN0eWxlc1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRTdHlsZUNlbGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIG9sZEN1cnJlbnRTdHlsZXMgPSBkZWZhdWx0U3R5bGVzID09IG51bGwgPyBkZXN0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pIDogZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KTtcbiAgICB2YXIgb2xkQ3VycmVudFZlbG9jaXRpZXMgPSBkZWZhdWx0U3R5bGVzID09IG51bGwgPyBkZXN0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9tYXBUb1plcm8yWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSkgOiBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9tYXBUb1plcm8yWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgX21lcmdlQW5kU3luYyA9IG1lcmdlQW5kU3luYyhcbiAgICAvLyBCZWNhdXNlIHRoaXMgaXMgYW4gb2xkLXN0eWxlIFJlYWN0LmNyZWF0ZUNsYXNzIGNvbXBvbmVudCwgRmxvdyBkb2Vzbid0XG4gICAgLy8gdW5kZXJzdGFuZCB0aGF0IHRoZSB3aWxsRW50ZXIgYW5kIHdpbGxMZWF2ZSBwcm9wcyBoYXZlIGRlZmF1bHQgdmFsdWVzXG4gICAgLy8gYW5kIHdpbGwgYWx3YXlzIGJlIHByZXNlbnQuXG4gICAgd2lsbEVudGVyLCB3aWxsTGVhdmUsIGRpZExlYXZlLCBvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgb2xkQ3VycmVudFN0eWxlcywgb2xkQ3VycmVudFZlbG9jaXRpZXMsIG9sZEN1cnJlbnRTdHlsZXMsIC8vIG9sZExhc3RJZGVhbFN0eWxlcyByZWFsbHlcbiAgICBvbGRDdXJyZW50VmVsb2NpdGllcyk7XG5cbiAgICB2YXIgbWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzBdO1xuICAgIHZhciBjdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luY1sxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jWzJdO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jWzNdO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1s0XTtcbiAgICAvLyBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzIHJlYWxseVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMsXG4gICAgICBtZXJnZWRQcm9wc1N0eWxlczogbWVyZ2VkUHJvcHNTdHlsZXNcbiAgICB9O1xuICB9LFxuXG4gIHVubW91bnRpbmc6IGZhbHNlLFxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGVzOiBudWxsLFxuICAvLyBhZnRlciBjaGVja2luZyBmb3IgdW5yZWFkUHJvcFN0eWxlcyAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUodW5yZWFkUHJvcFN0eWxlcykge1xuICAgIHZhciBfbWVyZ2VBbmRTeW5jMiA9IG1lcmdlQW5kU3luYyh0aGlzLnByb3BzLndpbGxFbnRlciwgdGhpcy5wcm9wcy53aWxsTGVhdmUsIHRoaXMucHJvcHMuZGlkTGVhdmUsIHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHVucmVhZFByb3BTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcyk7XG5cbiAgICB2YXIgbWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlswXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMyWzFdO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMyWzJdO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlszXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMyWzRdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdW5yZWFkUHJvcFN0eWxlID0gdW5yZWFkUHJvcFN0eWxlc1tpXS5zdHlsZTtcbiAgICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gdW5yZWFkUHJvcFN0eWxlKSB7XG4gICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHVucmVhZFByb3BTdHlsZSwga2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSB1bnJlYWRQcm9wU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsU3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsVmVsb2NpdGllc1tpXSk7XG4gICAgICAgICAgICBtZXJnZWRQcm9wc1N0eWxlc1tpXSA9IHtcbiAgICAgICAgICAgICAga2V5OiBtZXJnZWRQcm9wc1N0eWxlc1tpXS5rZXksXG4gICAgICAgICAgICAgIGRhdGE6IG1lcmdlZFByb3BzU3R5bGVzW2ldLmRhdGEsXG4gICAgICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7fSwgbWVyZ2VkUHJvcHNTdHlsZXNbaV0uc3R5bGUpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICAgIG1lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdW5saWtlIHRoZSBvdGhlciAyIGNvbXBvbmVudHMsIHdlIGNhbid0IGRldGVjdCBzdGFsZW5lc3MgYW5kIG9wdGlvbmFsbHlcbiAgICAvLyBvcHQgb3V0IG9mIHNldFN0YXRlIGhlcmUuIGVhY2ggc3R5bGUgb2JqZWN0J3MgZGF0YSBtaWdodCBjb250YWluIG5ld1xuICAgIC8vIHN0dWZmIHdlJ3JlIG5vdC9jYW5ub3QgY29tcGFyZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFN0eWxlczogY3VycmVudFN0eWxlcyxcbiAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcyxcbiAgICAgIG1lcmdlZFByb3BzU3R5bGVzOiBtZXJnZWRQcm9wc1N0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFN0eWxlczogbGFzdElkZWFsU3R5bGVzLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogbGFzdElkZWFsVmVsb2NpdGllc1xuICAgIH0pO1xuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnVubW91bnRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAodGltZXN0YW1wKSB7XG4gICAgICB2YXIgcHJvcFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcztcbiAgICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHByb3BTdHlsZXMgPT09ICdmdW5jdGlvbicgPyBwcm9wU3R5bGVzKHJlaHlkcmF0ZVN0eWxlcyhfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgX3RoaXMudW5yZWFkUHJvcFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKSkgOiBwcm9wU3R5bGVzO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IHRpbWVzdGFtcCB8fCBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIF90aGlzLnByZXZUaW1lO1xuICAgICAgX3RoaXMucHJldlRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IF90aGlzLmFjY3VtdWxhdGVkVGltZSArIHRpbWVEZWx0YTtcbiAgICAgIC8vIG1vcmUgdGhhbiAxMCBmcmFtZXM/IHByb2xseSBzd2l0Y2hlZCBicm93c2VyIHRhYi4gUmVzdGFydFxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA+IG1zUGVyRnJhbWUgKiAxMCkge1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID09PSAwKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRGcmFtZUNvbXBsZXRpb24gPSAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKSAqIG1zUGVyRnJhbWUpIC8gbXNQZXJGcmFtZTtcbiAgICAgIHZhciBmcmFtZXNUb0NhdGNoVXAgPSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpO1xuXG4gICAgICB2YXIgX21lcmdlQW5kU3luYzMgPSBtZXJnZUFuZFN5bmMoX3RoaXMucHJvcHMud2lsbEVudGVyLCBfdGhpcy5wcm9wcy53aWxsTGVhdmUsIF90aGlzLnByb3BzLmRpZExlYXZlLCBfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcyk7XG5cbiAgICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzBdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1sxXTtcbiAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmMzWzJdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlcyA9IF9tZXJnZUFuZFN5bmMzWzNdO1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1s0XTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZSA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlO1xuICAgICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdHkgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBuZXdNZXJnZWRQcm9wc1N0eWxlKSB7XG4gICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV3TWVyZ2VkUHJvcHNTdHlsZSwga2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBuZXdNZXJnZWRQcm9wc1N0eWxlW2tleV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBuZXdMYXN0SWRlYWxTdHlsZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXVtrZXldO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBmcmFtZXNUb0NhdGNoVXA7IGorKykge1xuICAgICAgICAgICAgICB2YXIgX3N0ZXBwZXIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3N0ZXBwZXJbMF07XG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfc3RlcHBlclsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9zdGVwcGVyMiA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsWCA9IF9zdGVwcGVyMlswXTtcbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxWID0gX3N0ZXBwZXIyWzFdO1xuXG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgKyAobmV4dElkZWFsWCAtIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSArIChuZXh0SWRlYWxWIC0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBuZXdMYXN0SWRlYWxTdHlsZTtcbiAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5O1xuICAgICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gbmV3Q3VycmVudFN0eWxlO1xuICAgICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IG5ld0N1cnJlbnRWZWxvY2l0eTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgLy8gdGhlIGFtb3VudCB3ZSdyZSBsb29wZWQgb3ZlciBhYm92ZVxuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC09IGZyYW1lc1RvQ2F0Y2hVcCAqIG1zUGVyRnJhbWU7XG5cbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY3VycmVudFN0eWxlczogbmV3Q3VycmVudFN0eWxlcyxcbiAgICAgICAgY3VycmVudFZlbG9jaXRpZXM6IG5ld0N1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgICBsYXN0SWRlYWxTdHlsZXM6IG5ld0xhc3RJZGVhbFN0eWxlcyxcbiAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogbmV3TGFzdElkZWFsVmVsb2NpdGllcyxcbiAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG5ld01lcmdlZFByb3BzU3R5bGVzXG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudW5yZWFkUHJvcFN0eWxlcyA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgICAvLyBwcmV2aW91cyBwcm9wcyBoYXZlbid0IGhhZCB0aGUgY2hhbmNlIHRvIGJlIHNldCB5ZXQ7IHNldCB0aGVtIGhlcmVcbiAgICAgIHRoaXMuY2xlYXJVbnJlYWRQcm9wU3R5bGUodGhpcy51bnJlYWRQcm9wU3R5bGVzKTtcbiAgICB9XG5cbiAgICB2YXIgc3R5bGVzID0gcHJvcHMuc3R5bGVzO1xuICAgIGlmICh0eXBlb2Ygc3R5bGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBzdHlsZXMocmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gc3R5bGVzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy51bm1vdW50aW5nID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaHlkcmF0ZWRTdHlsZXMgPSByZWh5ZHJhdGVTdHlsZXModGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgdGhpcy51bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMpO1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbihoeWRyYXRlZFN0eWxlcyk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBUcmFuc2l0aW9uTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbi8vIGxpc3Qgb2Ygc3R5bGVzLCBlYWNoIGNvbnRhaW5pbmcgaW50ZXJwb2xhdGluZyB2YWx1ZXMuIFBhcnQgb2Ygd2hhdCdzIHBhc3NlZFxuLy8gdG8gY2hpbGRyZW4gZnVuY3Rpb24uIE5vdGljZSB0aGF0IHRoaXMgaXNcbi8vIEFycmF5PEFjdHVhbEludGVycG9sYXRpbmdTdHlsZU9iamVjdD4sIHdpdGhvdXQgdGhlIHdyYXBwZXIgdGhhdCBpcyB7a2V5OiAuLi4sXG4vLyBkYXRhOiAuLi4gc3R5bGU6IEFjdHVhbEludGVycG9sYXRpbmdTdHlsZU9iamVjdH0uIE9ubHkgbWVyZ2VkUHJvcHNTdHlsZXNcbi8vIGNvbnRhaW5zIHRoZSBrZXkgJiBkYXRhIGluZm8gKHNvIHRoYXQgd2Ugb25seSBoYXZlIGEgc2luZ2xlIHNvdXJjZSBvZiB0cnV0aFxuLy8gZm9yIHRoZXNlLCBhbmQgdG8gc2F2ZSBzcGFjZSkuIENoZWNrIHRoZSBjb21tZW50IGZvciBgcmVoeWRyYXRlU3R5bGVzYCB0b1xuLy8gc2VlIGhvdyB3ZSByZWdlbmVyYXRlIHRoZSBlbnRpcmV0eSBvZiB3aGF0J3MgcGFzc2VkIHRvIGNoaWxkcmVuIGZ1bmN0aW9uXG5cbi8vIHRoZSBhcnJheSB0aGF0IGtlZXBzIHRyYWNrIG9mIGN1cnJlbnRseSByZW5kZXJlZCBzdHVmZiEgSW5jbHVkaW5nIHN0dWZmXG4vLyB0aGF0IHlvdSd2ZSB1bm1vdW50ZWQgYnV0IHRoYXQncyBzdGlsbCBhbmltYXRpbmcuIFRoaXMgaXMgd2hlcmUgaXQgbGl2ZXMiLCJcblxuLy8gY3VycmVudGx5IHVzZWQgdG8gaW5pdGlhdGUgdGhlIHZlbG9jaXR5IHN0eWxlIG9iamVjdCB0byAwXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtYXBUb1plcm87XG5cbmZ1bmN0aW9uIG1hcFRvWmVybyhvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHJldFtrZXldID0gMDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXG5cbi8vIGNvcmUga2V5cyBtZXJnaW5nIGFsZ29yaXRobS4gSWYgcHJldmlvdXMgcmVuZGVyJ3Mga2V5cyBhcmUgW2EsIGJdLCBhbmQgdGhlXG4vLyBuZXh0IHJlbmRlcidzIFtjLCBiLCBkXSwgd2hhdCdzIHRoZSBmaW5hbCBtZXJnZWQga2V5cyBhbmQgb3JkZXJpbmc/XG5cbi8vIC0gYyBhbmQgYSBtdXN0IGJvdGggYmUgYmVmb3JlIGJcbi8vIC0gYiBiZWZvcmUgZFxuLy8gLSBvcmRlcmluZyBiZXR3ZWVuIGEgYW5kIGMgYW1iaWd1b3VzXG5cbi8vIHRoaXMgcmVkdWNlcyB0byBtZXJnaW5nIHR3byBwYXJ0aWFsbHkgb3JkZXJlZCBsaXN0cyAoZS5nLiBsaXN0cyB3aGVyZSBub3Rcbi8vIGV2ZXJ5IGl0ZW0gaGFzIGEgZGVmaW5pdGUgb3JkZXJpbmcsIGxpa2UgY29tcGFyaW5nIGEgYW5kIGMgYWJvdmUpLiBGb3IgdGhlXG4vLyBhbWJpZ3VvdXMgb3JkZXJpbmcgd2UgZGV0ZXJtaW5pc3RpY2FsbHkgY2hvb3NlIHRvIHBsYWNlIHRoZSBuZXh0IHJlbmRlcidzXG4vLyBpdGVtIGFmdGVyIHRoZSBwcmV2aW91cyc7IHNvIGMgYWZ0ZXIgYVxuXG4vLyB0aGlzIGlzIGNhbGxlZCBhIHRvcG9sb2dpY2FsIHNvcnRpbmcuIEV4Y2VwdCB0aGUgZXhpc3RpbmcgYWxnb3JpdGhtcyBkb24ndFxuLy8gd29yayB3ZWxsIHdpdGgganMgYmMgb2YgdGhlIGFtb3VudCBvZiBhbGxvY2F0aW9uLCBhbmQgaXNuJ3Qgb3B0aW1pemVkIGZvciBvdXJcbi8vIGN1cnJlbnQgdXNlLWNhc2UgYmMgdGhlIHJ1bnRpbWUgaXMgbGluZWFyIGluIHRlcm1zIG9mIGVkZ2VzIChzZWUgd2lraSBmb3Jcbi8vIG1lYW5pbmcpLCB3aGljaCBpcyBodWdlIHdoZW4gdHdvIGxpc3RzIGhhdmUgbWFueSBjb21tb24gZWxlbWVudHNcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IG1lcmdlRGlmZjtcblxuZnVuY3Rpb24gbWVyZ2VEaWZmKHByZXYsIG5leHQsIG9uUmVtb3ZlKSB7XG4gIC8vIGJvb2trZWVwaW5nIGZvciBlYXNpZXIgYWNjZXNzIG9mIGEga2V5J3MgaW5kZXggYmVsb3cuIFRoaXMgaXMgMiBhbGxvY2F0aW9ucyArXG4gIC8vIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgY2hyb21lIGhhc2ggbWFwIG1vZGUgZm9yIG9ianMgKHNvIGl0IG1pZ2h0IGJlIGZhc3RlclxuXG4gIHZhciBwcmV2S2V5SW5kZXggPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2Lmxlbmd0aDsgaSsrKSB7XG4gICAgcHJldktleUluZGV4W3ByZXZbaV0ua2V5XSA9IGk7XG4gIH1cbiAgdmFyIG5leHRLZXlJbmRleCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICBuZXh0S2V5SW5kZXhbbmV4dFtpXS5rZXldID0gaTtcbiAgfVxuXG4gIC8vIGZpcnN0LCBhbiBvdmVybHkgZWxhYm9yYXRlIHdheSBvZiBtZXJnaW5nIHByZXYgYW5kIG5leHQsIGVsaW1pbmF0aW5nXG4gIC8vIGR1cGxpY2F0ZXMgKGluIHRlcm1zIG9mIGtleXMpLiBJZiB0aGVyZSdzIGR1cGUsIGtlZXAgdGhlIGl0ZW0gaW4gbmV4dCkuXG4gIC8vIFRoaXMgd2F5IG9mIHdyaXRpbmcgaXQgc2F2ZXMgYWxsb2NhdGlvbnNcbiAgdmFyIHJldCA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICByZXRbaV0gPSBuZXh0W2ldO1xuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5leHRLZXlJbmRleCwgcHJldltpXS5rZXkpKSB7XG4gICAgICAvLyB0aGlzIGlzIGNhbGxlZCBteSBUTSdzIGBtZXJnZUFuZFN5bmNgLCB3aGljaCBjYWxscyB3aWxsTGVhdmUuIFdlIGRvbid0XG4gICAgICAvLyBtZXJnZSBpbiBrZXlzIHRoYXQgdGhlIHVzZXIgZGVzaXJlcyB0byBraWxsXG4gICAgICB2YXIgZmlsbCA9IG9uUmVtb3ZlKGksIHByZXZbaV0pO1xuICAgICAgaWYgKGZpbGwgIT0gbnVsbCkge1xuICAgICAgICByZXQucHVzaChmaWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgYWxsIHRoZSBpdGVtcyBhbGwgcHJlc2VudC4gQ29yZSBzb3J0aW5nIGxvZ2ljIHRvIGhhdmUgdGhlIHJpZ2h0IG9yZGVyXG4gIHJldHVybiByZXQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHZhciBuZXh0T3JkZXJBID0gbmV4dEtleUluZGV4W2Eua2V5XTtcbiAgICB2YXIgbmV4dE9yZGVyQiA9IG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgdmFyIHByZXZPcmRlckEgPSBwcmV2S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBwcmV2T3JkZXJCID0gcHJldktleUluZGV4W2Iua2V5XTtcblxuICAgIGlmIChuZXh0T3JkZXJBICE9IG51bGwgJiYgbmV4dE9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gbmV4dFxuICAgICAgcmV0dXJuIG5leHRLZXlJbmRleFthLmtleV0gLSBuZXh0S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAocHJldk9yZGVyQSAhPSBudWxsICYmIHByZXZPcmRlckIgIT0gbnVsbCkge1xuICAgICAgLy8gYm90aCBrZXlzIGluIHByZXZcbiAgICAgIHJldHVybiBwcmV2S2V5SW5kZXhbYS5rZXldIC0gcHJldktleUluZGV4W2Iua2V5XTtcbiAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgIT0gbnVsbCkge1xuICAgICAgLy8ga2V5IGEgaW4gbmV4dCwga2V5IGIgaW4gcHJldlxuXG4gICAgICAvLyBob3cgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBiZXR3ZWVuIGEgYW5kIGI/IFdlIGZpbmQgYSBcInBpdm90XCIgKHRlcm1cbiAgICAgIC8vIGFidXNlKSwgYSBrZXkgcHJlc2VudCBpbiBib3RoIHByZXYgYW5kIG5leHQsIHRoYXQgaXMgc2FuZHdpY2hlZCBiZXR3ZWVuXG4gICAgICAvLyBhIGFuZCBiLiBJbiB0aGUgY29udGV4dCBvZiBvdXIgYWJvdmUgZXhhbXBsZSwgaWYgd2UncmUgY29tcGFyaW5nIGEgYW5kXG4gICAgICAvLyBkLCBiJ3MgKHRoZSBvbmx5KSBwaXZvdFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwcmV2S2V5SW5kZXgsIHBpdm90KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHRPcmRlckEgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckIgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgPiBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckIgPCBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgLy8gcHJldk9yZGVyQSwgbmV4dE9yZGVyQlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBpdm90ID0gbmV4dFtpXS5rZXk7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwcmV2S2V5SW5kZXgsIHBpdm90KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0T3JkZXJCIDwgbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJBID4gcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dE9yZGVyQiA+IG5leHRLZXlJbmRleFtwaXZvdF0gJiYgcHJldk9yZGVyQSA8IHByZXZLZXlJbmRleFtwaXZvdF0pIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBwbHVnZ2FibGUuIGRlZmF1bHQgdG86IG5leHQgYmlnZ2VyIHRoYW4gcHJldlxuICAgIHJldHVybiAtMTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuLy8gdG8gbG9vcCB0aHJvdWdoIGFuZCBmaW5kIGEga2V5J3MgaW5kZXggZWFjaCB0aW1lKSwgYnV0IEkgbm8gbG9uZ2VyIGNhcmUiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0ge1xuICBub1dvYmJsZTogeyBzdGlmZm5lc3M6IDE3MCwgZGFtcGluZzogMjYgfSwgLy8gdGhlIGRlZmF1bHQsIGlmIG5vdGhpbmcgcHJvdmlkZWRcbiAgZ2VudGxlOiB7IHN0aWZmbmVzczogMTIwLCBkYW1waW5nOiAxNCB9LFxuICB3b2JibHk6IHsgc3RpZmZuZXNzOiAxODAsIGRhbXBpbmc6IDEyIH0sXG4gIHN0aWZmOiB7IHN0aWZmbmVzczogMjEwLCBkYW1waW5nOiAyMCB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZShvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialsnZGVmYXVsdCddIDogb2JqOyB9XG5cbnZhciBfTW90aW9uID0gcmVxdWlyZSgnLi9Nb3Rpb24nKTtcblxuZXhwb3J0cy5Nb3Rpb24gPSBfaW50ZXJvcFJlcXVpcmUoX01vdGlvbik7XG5cbnZhciBfU3RhZ2dlcmVkTW90aW9uID0gcmVxdWlyZSgnLi9TdGFnZ2VyZWRNb3Rpb24nKTtcblxuZXhwb3J0cy5TdGFnZ2VyZWRNb3Rpb24gPSBfaW50ZXJvcFJlcXVpcmUoX1N0YWdnZXJlZE1vdGlvbik7XG5cbnZhciBfVHJhbnNpdGlvbk1vdGlvbiA9IHJlcXVpcmUoJy4vVHJhbnNpdGlvbk1vdGlvbicpO1xuXG5leHBvcnRzLlRyYW5zaXRpb25Nb3Rpb24gPSBfaW50ZXJvcFJlcXVpcmUoX1RyYW5zaXRpb25Nb3Rpb24pO1xuXG52YXIgX3NwcmluZyA9IHJlcXVpcmUoJy4vc3ByaW5nJyk7XG5cbmV4cG9ydHMuc3ByaW5nID0gX2ludGVyb3BSZXF1aXJlKF9zcHJpbmcpO1xuXG52YXIgX3ByZXNldHMgPSByZXF1aXJlKCcuL3ByZXNldHMnKTtcblxuZXhwb3J0cy5wcmVzZXRzID0gX2ludGVyb3BSZXF1aXJlKF9wcmVzZXRzKTtcblxuLy8gZGVwcmVjYXRlZCwgZHVtbXkgd2FybmluZyBmdW5jdGlvblxuXG52YXIgX3Jlb3JkZXJLZXlzID0gcmVxdWlyZSgnLi9yZW9yZGVyS2V5cycpO1xuXG5leHBvcnRzLnJlb3JkZXJLZXlzID0gX2ludGVyb3BSZXF1aXJlKF9yZW9yZGVyS2V5cyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gcmVvcmRlcktleXM7XG5cbnZhciBoYXNXYXJuZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gcmVvcmRlcktleXMoKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGlmICghaGFzV2FybmVkKSB7XG4gICAgICBoYXNXYXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignYHJlb3JkZXJLZXlzYCBoYXMgYmVlbiByZW1vdmVkLCBzaW5jZSBpdCBpcyBubyBsb25nZXIgbmVlZGVkIGZvciBUcmFuc2l0aW9uTW90aW9uXFwncyBuZXcgc3R5bGVzIGFycmF5IEFQSS4nKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXG5cbi8vIHVzYWdlIGFzc3VtcHRpb246IGN1cnJlbnRTdHlsZSB2YWx1ZXMgaGF2ZSBhbHJlYWR5IGJlZW4gcmVuZGVyZWQgYnV0IGl0IHNheXNcbi8vIG5vdGhpbmcgb2Ygd2hldGhlciBjdXJyZW50U3R5bGUgaXMgc3RhbGUgKHNlZSB1bnJlYWRQcm9wU3R5bGUpXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzaG91bGRTdG9wQW5pbWF0aW9uO1xuXG5mdW5jdGlvbiBzaG91bGRTdG9wQW5pbWF0aW9uKGN1cnJlbnRTdHlsZSwgc3R5bGUsIGN1cnJlbnRWZWxvY2l0eSkge1xuICBmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdHlsZSwga2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRWZWxvY2l0eVtrZXldICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlVmFsdWUgPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gICAgLy8gc3RlcHBlciB3aWxsIGhhdmUgYWxyZWFkeSB0YWtlbiBjYXJlIG9mIHJvdW5kaW5nIHByZWNpc2lvbiBlcnJvcnMsIHNvXG4gICAgLy8gd29uJ3QgaGF2ZSBzdWNoIHRoaW5nIGFzIDAuOTk5OSAhPT09IDFcbiAgICBpZiAoY3VycmVudFN0eWxlW2tleV0gIT09IHN0eWxlVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBzcHJpbmc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbnZhciBfcHJlc2V0czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVzZXRzKTtcblxudmFyIGRlZmF1bHRDb25maWcgPSBfZXh0ZW5kcyh7fSwgX3ByZXNldHMyWydkZWZhdWx0J10ubm9Xb2JibGUsIHtcbiAgcHJlY2lzaW9uOiAwLjAxXG59KTtcblxuZnVuY3Rpb24gc3ByaW5nKHZhbCwgY29uZmlnKSB7XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnLCB7IHZhbDogdmFsIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gc3RlcHBlciBpcyB1c2VkIGEgbG90LiBTYXZlcyBhbGxvY2F0aW9uIHRvIHJldHVybiB0aGUgc2FtZSBhcnJheSB3cmFwcGVyLlxuLy8gVGhpcyBpcyBmaW5lIGFuZCBkYW5nZXItZnJlZSBhZ2FpbnN0IG11dGF0aW9ucyBiZWNhdXNlIHRoZSBjYWxsc2l0ZVxuLy8gaW1tZWRpYXRlbHkgZGVzdHJ1Y3R1cmVzIGl0IGFuZCBnZXRzIHRoZSBudW1iZXJzIGluc2lkZSB3aXRob3V0IHBhc3NpbmcgdGhlXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc3RlcHBlcjtcblxudmFyIHJldXNlZFR1cGxlID0gWzAsIDBdO1xuXG5mdW5jdGlvbiBzdGVwcGVyKHNlY29uZFBlckZyYW1lLCB4LCB2LCBkZXN0WCwgaywgYiwgcHJlY2lzaW9uKSB7XG4gIC8vIFNwcmluZyBzdGlmZm5lc3MsIGluIGtnIC8gc14yXG5cbiAgLy8gZm9yIGFuaW1hdGlvbnMsIGRlc3RYIGlzIHJlYWxseSBzcHJpbmcgbGVuZ3RoIChzcHJpbmcgYXQgcmVzdCkuIGluaXRpYWxcbiAgLy8gcG9zaXRpb24gaXMgY29uc2lkZXJlZCBhcyB0aGUgc3RyZXRjaGVkL2NvbXByZXNzZWQgcG9zaXRpb24gb2YgYSBzcHJpbmdcbiAgdmFyIEZzcHJpbmcgPSAtayAqICh4IC0gZGVzdFgpO1xuXG4gIC8vIERhbXBpbmcsIGluIGtnIC8gc1xuICB2YXIgRmRhbXBlciA9IC1iICogdjtcblxuICAvLyB1c3VhbGx5IHdlIHB1dCBtYXNzIGhlcmUsIGJ1dCBmb3IgYW5pbWF0aW9uIHB1cnBvc2VzLCBzcGVjaWZ5aW5nIG1hc3MgaXMgYVxuICAvLyBiaXQgcmVkdW5kYW50LiB5b3UgY291bGQgc2ltcGx5IGFkanVzdCBrIGFuZCBiIGFjY29yZGluZ2x5XG4gIC8vIGxldCBhID0gKEZzcHJpbmcgKyBGZGFtcGVyKSAvIG1hc3M7XG4gIHZhciBhID0gRnNwcmluZyArIEZkYW1wZXI7XG5cbiAgdmFyIG5ld1YgPSB2ICsgYSAqIHNlY29uZFBlckZyYW1lO1xuICB2YXIgbmV3WCA9IHggKyBuZXdWICogc2Vjb25kUGVyRnJhbWU7XG5cbiAgaWYgKE1hdGguYWJzKG5ld1YpIDwgcHJlY2lzaW9uICYmIE1hdGguYWJzKG5ld1ggLSBkZXN0WCkgPCBwcmVjaXNpb24pIHtcbiAgICByZXVzZWRUdXBsZVswXSA9IGRlc3RYO1xuICAgIHJldXNlZFR1cGxlWzFdID0gMDtcbiAgICByZXR1cm4gcmV1c2VkVHVwbGU7XG4gIH1cblxuICByZXVzZWRUdXBsZVswXSA9IG5ld1g7XG4gIHJldXNlZFR1cGxlWzFdID0gbmV3VjtcbiAgcmV0dXJuIHJldXNlZFR1cGxlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuLy8gYXJyYXkgcmVmZXJlbmNlIGFyb3VuZC4iLCJcbi8vIHR1cm4ge3g6IHt2YWw6IDEsIHN0aWZmbmVzczogMSwgZGFtcGluZzogMn0sIHk6IDJ9IGdlbmVyYXRlZCBieVxuLy8gYHt4OiBzcHJpbmcoMSwge3N0aWZmbmVzczogMSwgZGFtcGluZzogMn0pLCB5OiAyfWAgaW50byB7eDogMSwgeTogMn1cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc3RyaXBTdHlsZTtcblxuZnVuY3Rpb24gc3RyaXBTdHlsZShzdHlsZSkge1xuICB2YXIgcmV0ID0ge307XG4gIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0eWxlLCBrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyAvKmVzbGludC1kaXNhYmxlIHJlYWN0L3Byb3AtdHlwZXMgKi9cblxuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxudmFyIF9jb21wb25lbnRPckVsZW1lbnQgPSByZXF1aXJlKCdyZWFjdC1wcm9wLXR5cGVzL2xpYi9jb21wb25lbnRPckVsZW1lbnQnKTtcblxudmFyIF9jb21wb25lbnRPckVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9uZW50T3JFbGVtZW50KTtcblxudmFyIF9lbGVtZW50VHlwZSA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlJyk7XG5cbnZhciBfZWxlbWVudFR5cGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWxlbWVudFR5cGUpO1xuXG52YXIgX1BvcnRhbCA9IHJlcXVpcmUoJy4vUG9ydGFsJyk7XG5cbnZhciBfUG9ydGFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BvcnRhbCk7XG5cbnZhciBfTW9kYWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9Nb2RhbE1hbmFnZXInKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTW9kYWxNYW5hZ2VyKTtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi91dGlscy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxudmFyIF9hZGRFdmVudExpc3RlbmVyID0gcmVxdWlyZSgnLi91dGlscy9hZGRFdmVudExpc3RlbmVyJyk7XG5cbnZhciBfYWRkRXZlbnRMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hZGRFdmVudExpc3RlbmVyKTtcblxudmFyIF9hZGRGb2N1c0xpc3RlbmVyID0gcmVxdWlyZSgnLi91dGlscy9hZGRGb2N1c0xpc3RlbmVyJyk7XG5cbnZhciBfYWRkRm9jdXNMaXN0ZW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hZGRGb2N1c0xpc3RlbmVyKTtcblxudmFyIF9pbkRPTSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3V0aWwvaW5ET00nKTtcblxudmFyIF9pbkRPTTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbkRPTSk7XG5cbnZhciBfYWN0aXZlRWxlbWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2FjdGl2ZUVsZW1lbnQnKTtcblxudmFyIF9hY3RpdmVFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FjdGl2ZUVsZW1lbnQpO1xuXG52YXIgX2NvbnRhaW5zID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvcXVlcnkvY29udGFpbnMnKTtcblxudmFyIF9jb250YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb250YWlucyk7XG5cbnZhciBfZ2V0Q29udGFpbmVyID0gcmVxdWlyZSgnLi91dGlscy9nZXRDb250YWluZXInKTtcblxudmFyIF9nZXRDb250YWluZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0Q29udGFpbmVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIG1vZGFsTWFuYWdlciA9IG5ldyBfTW9kYWxNYW5hZ2VyMi5kZWZhdWx0KCk7XG5cbi8qKlxuICogTG92ZSB0aGVtIG9yIGhhdGUgdGhlbSwgYDxNb2RhbC8+YCBwcm92aWRlcyBhIHNvbGlkIGZvdW5kYXRpb24gZm9yIGNyZWF0aW5nIGRpYWxvZ3MsIGxpZ2h0Ym94ZXMsIG9yIHdoYXRldmVyIGVsc2UuXG4gKiBUaGUgTW9kYWwgY29tcG9uZW50IHJlbmRlcnMgaXRzIGBjaGlsZHJlbmAgbm9kZSBpbiBmcm9udCBvZiBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAqXG4gKiBUaGUgTW9kYWwgb2ZmZXJzIGEgZmV3IGhlbHBmdWwgZmVhdHVyZXMgb3ZlciB1c2luZyBqdXN0IGEgYDxQb3J0YWwvPmAgY29tcG9uZW50IGFuZCBzb21lIHN0eWxlczpcbiAqXG4gKiAtIE1hbmFnZXMgZGlhbG9nIHN0YWNraW5nIHdoZW4gb25lLWF0LWEtdGltZSBqdXN0IGlzbid0IGVub3VnaC5cbiAqIC0gQ3JlYXRlcyBhIGJhY2tkcm9wLCBmb3IgZGlzYWJsaW5nIGludGVyYWN0aW9uIGJlbG93IHRoZSBtb2RhbC5cbiAqIC0gSXQgcHJvcGVybHkgbWFuYWdlcyBmb2N1czsgbW92aW5nIHRvIHRoZSBtb2RhbCBjb250ZW50LCBhbmQga2VlcGluZyBpdCB0aGVyZSB1bnRpbCB0aGUgbW9kYWwgaXMgY2xvc2VkLlxuICogLSBJdCBkaXNhYmxlcyBzY3JvbGxpbmcgb2YgdGhlIHBhZ2UgY29udGVudCB3aGlsZSBvcGVuLlxuICogLSBBZGRzIHRoZSBhcHByb3ByaWF0ZSBBUklBIHJvbGVzIGFyZSBhdXRvbWF0aWNhbGx5LlxuICogLSBFYXNpbHkgcGx1Z2dhYmxlIGFuaW1hdGlvbnMgdmlhIGEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudC5cbiAqXG4gKiBOb3RlIHRoYXQsIGluIHRoZSBzYW1lIHdheSB0aGUgYmFja2Ryb3AgZWxlbWVudCBwcmV2ZW50cyB1c2VycyBmcm9tIGNsaWNraW5nIG9yIGludGVyYWN0aW5nXG4gKiB3aXRoIHRoZSBwYWdlIGNvbnRlbnQgdW5kZXJuZWF0aCB0aGUgTW9kYWwsIFNjcmVlbiByZWFkZXJzIGFsc28gbmVlZCB0byBiZSBzaWduYWxlZCB0byBub3QgdG9cbiAqIGludGVyYWN0IHdpdGggcGFnZSBjb250ZW50IHdoaWxlIHRoZSBNb2RhbCBpcyBvcGVuLiBUbyBkbyB0aGlzLCB3ZSB1c2UgYSBjb21tb24gdGVjaG5pcXVlIG9mIGFwcGx5aW5nXG4gKiB0aGUgYGFyaWEtaGlkZGVuPSd0cnVlJ2AgYXR0cmlidXRlIHRvIHRoZSBub24tTW9kYWwgZWxlbWVudHMgaW4gdGhlIE1vZGFsIGBjb250YWluZXJgLiBUaGlzIG1lYW5zIHRoYXQgZm9yXG4gKiBhIE1vZGFsIHRvIGJlIHRydWx5IG1vZGFsLCBpdCBzaG91bGQgaGF2ZSBhIGBjb250YWluZXJgIHRoYXQgaXMgX291dHNpZGVfIHlvdXIgYXBwJ3NcbiAqIFJlYWN0IGhpZXJhcmNoeSAoc3VjaCBhcyB0aGUgZGVmYXVsdDogZG9jdW1lbnQuYm9keSkuXG4gKi9cbnZhciBNb2RhbCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW9kYWwnLFxuXG5cbiAgcHJvcFR5cGVzOiBfZXh0ZW5kcyh7fSwgX1BvcnRhbDIuZGVmYXVsdC5wcm9wVHlwZXMsIHtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgTW9kYWxcbiAgICAgKi9cbiAgICBzaG93OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIE5vZGUsIENvbXBvbmVudCBpbnN0YW5jZSwgb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGVpdGhlci4gVGhlIE1vZGFsIGlzIGFwcGVuZGVkIHRvIGl0J3MgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBGb3IgdGhlIHNha2Ugb2YgYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgdGhlIGNvbnRhaW5lciBzaG91bGQgdXN1YWxseSBiZSB0aGUgZG9jdW1lbnQgYm9keSwgc28gdGhhdCB0aGUgcmVzdCBvZiB0aGVcbiAgICAgKiBwYWdlIGNvbnRlbnQgY2FuIGJlIHBsYWNlZCBiZWhpbmQgYSB2aXJ0dWFsIGJhY2tkcm9wIGFzIHdlbGwgYXMgYSB2aXN1YWwgb25lLlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19jb21wb25lbnRPckVsZW1lbnQyLmRlZmF1bHQsIF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuY10pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBNb2RhbCBpcyBvcGVuaW5nLlxuICAgICAqL1xuICAgIG9uU2hvdzogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIGVpdGhlciB0aGUgYmFja2Ryb3AgaXMgY2xpY2tlZCwgb3IgdGhlIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAgICAgKlxuICAgICAqIFRoZSBgb25IaWRlYCBjYWxsYmFjayBvbmx5IHNpZ25hbHMgaW50ZW50IGZyb20gdGhlIE1vZGFsLFxuICAgICAqIHlvdSBtdXN0IGFjdHVhbGx5IHNldCB0aGUgYHNob3dgIHByb3AgdG8gYGZhbHNlYCBmb3IgdGhlIE1vZGFsIHRvIGNsb3NlLlxuICAgICAqL1xuICAgIG9uSGlkZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogSW5jbHVkZSBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCwgX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZihbJ3N0YXRpYyddKV0pLFxuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBiYWNrZHJvcCBjb21wb25lbnQuIFVzZWZ1bCBmb3IgY3VzdG9tXG4gICAgICogYmFja2Ryb3AgcmVuZGVyaW5nLlxuICAgICAqXG4gICAgICogYGBganNcbiAgICAgKiAgcmVuZGVyQmFja2Ryb3A9e3Byb3BzID0+IDxNeUJhY2tkcm9wIHsuLi5wcm9wc30gLz59XG4gICAgICogYGBgXG4gICAgICovXG4gICAgcmVuZGVyQmFja2Ryb3A6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgZmlyZWQgd2hlbiB0aGUgZXNjYXBlIGtleSwgaWYgc3BlY2lmaWVkIGluIGBrZXlib2FyZGAsIGlzIHByZXNzZWQuXG4gICAgICovXG4gICAgb25Fc2NhcGVLZXlVcDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBiYWNrZHJvcCwgaWYgc3BlY2lmaWVkLCBpcyBjbGlja2VkLlxuICAgICAqL1xuICAgIG9uQmFja2Ryb3BDbGljazogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBzdHlsZSBvYmplY3QgZm9yIHRoZSBiYWNrZHJvcCBjb21wb25lbnQuXG4gICAgICovXG4gICAgYmFja2Ryb3BTdHlsZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vYmplY3QsXG5cbiAgICAvKipcbiAgICAgKiBBIGNzcyBjbGFzcyBvciBjbGFzc2VzIGZvciB0aGUgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wQ2xhc3NOYW1lOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIEEgY3NzIGNsYXNzIG9yIHNldCBvZiBjbGFzc2VzIGFwcGxpZWQgdG8gdGhlIG1vZGFsIGNvbnRhaW5lciB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuLFxuICAgICAqIGFuZCByZW1vdmVkIHdoZW4gaXQgaXMgY2xvc2VkLlxuICAgICAqL1xuICAgIGNvbnRhaW5lckNsYXNzTmFtZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgbW9kYWwgd2hlbiBlc2NhcGUga2V5IGlzIHByZXNzZWRcbiAgICAgKi9cbiAgICBrZXlib2FyZDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogQSBgPFRyYW5zaXRpb24vPmAgY29tcG9uZW50IHRvIHVzZSBmb3IgdGhlIGRpYWxvZyBhbmQgYmFja2Ryb3AgY29tcG9uZW50cy5cbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uOiBfZWxlbWVudFR5cGUyLmRlZmF1bHQsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgYHRpbWVvdXRgIG9mIHRoZSBkaWFsb2cgdHJhbnNpdGlvbiBpZiBzcGVjaWZpZWQuIFRoaXMgbnVtYmVyIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXRcbiAgICAgKiB0cmFuc2l0aW9uIGNhbGxiYWNrcyBhcmUgYWx3YXlzIGZpcmVkLCBldmVuIGlmIGJyb3dzZXIgdHJhbnNpdGlvbiBldmVudHMgYXJlIGNhbmNlbGVkLlxuICAgICAqXG4gICAgICogU2VlIHRoZSBUcmFuc2l0aW9uIGB0aW1lb3V0YCBwcm9wIGZvciBtb3JlIGluZm9tYXRpb24uXG4gICAgICovXG4gICAgZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLyoqXG4gICAgICogVGhlIGB0aW1lb3V0YCBvZiB0aGUgYmFja2Ryb3AgdHJhbnNpdGlvbiBpZiBzcGVjaWZpZWQuIFRoaXMgbnVtYmVyIGlzIHVzZWQgdG9cbiAgICAgKiBlbnN1cmUgdGhhdCB0cmFuc2l0aW9uIGNhbGxiYWNrcyBhcmUgYWx3YXlzIGZpcmVkLCBldmVuIGlmIGJyb3dzZXIgdHJhbnNpdGlvbiBldmVudHMgYXJlIGNhbmNlbGVkLlxuICAgICAqXG4gICAgICogU2VlIHRoZSBUcmFuc2l0aW9uIGB0aW1lb3V0YCBwcm9wIGZvciBtb3JlIGluZm9tYXRpb24uXG4gICAgICovXG4gICAgYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5udW1iZXIsXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGB0cnVlYCBUaGUgbW9kYWwgd2lsbCBhdXRvbWF0aWNhbGx5IHNoaWZ0IGZvY3VzIHRvIGl0c2VsZiB3aGVuIGl0IG9wZW5zLCBhbmRcbiAgICAgKiByZXBsYWNlIGl0IHRvIHRoZSBsYXN0IGZvY3VzZWQgZWxlbWVudCB3aGVuIGl0IGNsb3Nlcy4gVGhpcyBhbHNvXG4gICAgICogd29ya3MgY29ycmVjdGx5IHdpdGggYW55IE1vZGFsIGNoaWxkcmVuIHRoYXQgaGF2ZSB0aGUgYGF1dG9Gb2N1c2AgcHJvcC5cbiAgICAgKlxuICAgICAqIEdlbmVyYWxseSB0aGlzIHNob3VsZCBuZXZlciBiZSBzZXQgdG8gYGZhbHNlYCBhcyBpdCBtYWtlcyB0aGUgTW9kYWwgbGVzc1xuICAgICAqIGFjY2Vzc2libGUgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgbGlrZSBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBhdXRvRm9jdXM6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYHRydWVgIFRoZSBtb2RhbCB3aWxsIHByZXZlbnQgZm9jdXMgZnJvbSBsZWF2aW5nIHRoZSBNb2RhbCB3aGlsZSBvcGVuLlxuICAgICAqXG4gICAgICogR2VuZXJhbGx5IHRoaXMgc2hvdWxkIG5ldmVyIGJlIHNldCB0byBgZmFsc2VgIGFzIGl0IG1ha2VzIHRoZSBNb2RhbCBsZXNzXG4gICAgICogYWNjZXNzaWJsZSB0byBhc3Npc3RpdmUgdGVjaG5vbG9naWVzLCBsaWtlIHNjcmVlbiByZWFkZXJzLlxuICAgICAqL1xuICAgIGVuZm9yY2VGb2N1czogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYmVmb3JlIHRoZSBNb2RhbCB0cmFuc2l0aW9ucyBpblxuICAgICAqL1xuICAgIG9uRW50ZXI6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFzIHRoZSBNb2RhbCBiZWdpbnMgdG8gdHJhbnNpdGlvbiBpblxuICAgICAqL1xuICAgIG9uRW50ZXJpbmc6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBNb2RhbCBmaW5pc2hlcyB0cmFuc2l0aW9uaW5nIGluXG4gICAgICovXG4gICAgb25FbnRlcmVkOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCByaWdodCBiZWZvcmUgdGhlIE1vZGFsIHRyYW5zaXRpb25zIG91dFxuICAgICAqL1xuICAgIG9uRXhpdDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYXMgdGhlIE1vZGFsIGJlZ2lucyB0byB0cmFuc2l0aW9uIG91dFxuICAgICAqL1xuICAgIG9uRXhpdGluZzogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgYWZ0ZXIgdGhlIE1vZGFsIGZpbmlzaGVzIHRyYW5zaXRpb25pbmcgb3V0XG4gICAgICovXG4gICAgb25FeGl0ZWQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgTW9kYWxNYW5hZ2VyIGluc3RhbmNlIHVzZWQgdG8gdHJhY2sgYW5kIG1hbmFnZSB0aGUgc3RhdGUgb2Ygb3BlblxuICAgICAqIE1vZGFscy4gVXNlZnVsIHdoZW4gY3VzdG9taXppbmcgaG93IG1vZGFscyBpbnRlcmFjdCB3aXRoaW4gYSBjb250YWluZXJcbiAgICAgKi9cbiAgICBtYW5hZ2VyOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH0pLFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgYmFja2Ryb3A6IHRydWUsXG4gICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgIGF1dG9Gb2N1czogdHJ1ZSxcbiAgICAgIGVuZm9yY2VGb2N1czogdHJ1ZSxcbiAgICAgIG9uSGlkZTogbm9vcCxcbiAgICAgIG1hbmFnZXI6IG1vZGFsTWFuYWdlcixcbiAgICAgIHJlbmRlckJhY2tkcm9wOiBmdW5jdGlvbiByZW5kZXJCYWNrZHJvcChwcm9wcykge1xuICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHByb3BzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBleGl0ZWQ6ICF0aGlzLnByb3BzLnNob3cgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHNob3cgPSBfcHJvcHMuc2hvdztcbiAgICB2YXIgY29udGFpbmVyID0gX3Byb3BzLmNvbnRhaW5lcjtcbiAgICB2YXIgY2hpbGRyZW4gPSBfcHJvcHMuY2hpbGRyZW47XG4gICAgdmFyIFRyYW5zaXRpb24gPSBfcHJvcHMudHJhbnNpdGlvbjtcbiAgICB2YXIgYmFja2Ryb3AgPSBfcHJvcHMuYmFja2Ryb3A7XG4gICAgdmFyIGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0ID0gX3Byb3BzLmRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0O1xuICAgIHZhciBjbGFzc05hbWUgPSBfcHJvcHMuY2xhc3NOYW1lO1xuICAgIHZhciBzdHlsZSA9IF9wcm9wcy5zdHlsZTtcbiAgICB2YXIgb25FeGl0ID0gX3Byb3BzLm9uRXhpdDtcbiAgICB2YXIgb25FeGl0aW5nID0gX3Byb3BzLm9uRXhpdGluZztcbiAgICB2YXIgb25FbnRlciA9IF9wcm9wcy5vbkVudGVyO1xuICAgIHZhciBvbkVudGVyaW5nID0gX3Byb3BzLm9uRW50ZXJpbmc7XG4gICAgdmFyIG9uRW50ZXJlZCA9IF9wcm9wcy5vbkVudGVyZWQ7XG5cblxuICAgIHZhciBkaWFsb2cgPSBfcmVhY3QyLmRlZmF1bHQuQ2hpbGRyZW4ub25seShjaGlsZHJlbik7XG5cbiAgICB2YXIgbW91bnRNb2RhbCA9IHNob3cgfHwgVHJhbnNpdGlvbiAmJiAhdGhpcy5zdGF0ZS5leGl0ZWQ7XG4gICAgaWYgKCFtb3VudE1vZGFsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgX2RpYWxvZyRwcm9wcyA9IGRpYWxvZy5wcm9wcztcbiAgICB2YXIgcm9sZSA9IF9kaWFsb2ckcHJvcHMucm9sZTtcbiAgICB2YXIgdGFiSW5kZXggPSBfZGlhbG9nJHByb3BzLnRhYkluZGV4O1xuXG5cbiAgICBpZiAocm9sZSA9PT0gdW5kZWZpbmVkIHx8IHRhYkluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRpYWxvZyA9ICgwLCBfcmVhY3QuY2xvbmVFbGVtZW50KShkaWFsb2csIHtcbiAgICAgICAgcm9sZTogcm9sZSA9PT0gdW5kZWZpbmVkID8gJ2RvY3VtZW50JyA6IHJvbGUsXG4gICAgICAgIHRhYkluZGV4OiB0YWJJbmRleCA9PSBudWxsID8gJy0xJyA6IHRhYkluZGV4XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoVHJhbnNpdGlvbikge1xuICAgICAgZGlhbG9nID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFRyYW5zaXRpb24sXG4gICAgICAgIHtcbiAgICAgICAgICB0cmFuc2l0aW9uQXBwZWFyOiB0cnVlLFxuICAgICAgICAgIHVubW91bnRPbkV4aXQ6IHRydWUsXG4gICAgICAgICAgJ2luJzogc2hvdyxcbiAgICAgICAgICB0aW1lb3V0OiBkaWFsb2dUcmFuc2l0aW9uVGltZW91dCxcbiAgICAgICAgICBvbkV4aXQ6IG9uRXhpdCxcbiAgICAgICAgICBvbkV4aXRpbmc6IG9uRXhpdGluZyxcbiAgICAgICAgICBvbkV4aXRlZDogdGhpcy5oYW5kbGVIaWRkZW4sXG4gICAgICAgICAgb25FbnRlcjogb25FbnRlcixcbiAgICAgICAgICBvbkVudGVyaW5nOiBvbkVudGVyaW5nLFxuICAgICAgICAgIG9uRW50ZXJlZDogb25FbnRlcmVkXG4gICAgICAgIH0sXG4gICAgICAgIGRpYWxvZ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBfUG9ydGFsMi5kZWZhdWx0LFxuICAgICAge1xuICAgICAgICByZWY6IHRoaXMuc2V0TW91bnROb2RlLFxuICAgICAgICBjb250YWluZXI6IGNvbnRhaW5lclxuICAgICAgfSxcbiAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIHJlZjogJ21vZGFsJyxcbiAgICAgICAgICByb2xlOiByb2xlIHx8ICdkaWFsb2cnLFxuICAgICAgICAgIHN0eWxlOiBzdHlsZSxcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZVxuICAgICAgICB9LFxuICAgICAgICBiYWNrZHJvcCAmJiB0aGlzLnJlbmRlckJhY2tkcm9wKCksXG4gICAgICAgIGRpYWxvZ1xuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHJlbmRlckJhY2tkcm9wOiBmdW5jdGlvbiByZW5kZXJCYWNrZHJvcCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9wcm9wczIgPSB0aGlzLnByb3BzO1xuICAgIHZhciBiYWNrZHJvcFN0eWxlID0gX3Byb3BzMi5iYWNrZHJvcFN0eWxlO1xuICAgIHZhciBiYWNrZHJvcENsYXNzTmFtZSA9IF9wcm9wczIuYmFja2Ryb3BDbGFzc05hbWU7XG4gICAgdmFyIHJlbmRlckJhY2tkcm9wID0gX3Byb3BzMi5yZW5kZXJCYWNrZHJvcDtcbiAgICB2YXIgVHJhbnNpdGlvbiA9IF9wcm9wczIudHJhbnNpdGlvbjtcbiAgICB2YXIgYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dCA9IF9wcm9wczIuYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dDtcblxuXG4gICAgdmFyIGJhY2tkcm9wUmVmID0gZnVuY3Rpb24gYmFja2Ryb3BSZWYocmVmKSB7XG4gICAgICByZXR1cm4gX3RoaXMuYmFja2Ryb3AgPSByZWY7XG4gICAgfTtcblxuICAgIHZhciBiYWNrZHJvcCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICByZWY6IGJhY2tkcm9wUmVmLFxuICAgICAgc3R5bGU6IHRoaXMucHJvcHMuYmFja2Ryb3BTdHlsZSxcbiAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5iYWNrZHJvcENsYXNzTmFtZSxcbiAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQmFja2Ryb3BDbGlja1xuICAgIH0pO1xuXG4gICAgaWYgKFRyYW5zaXRpb24pIHtcbiAgICAgIGJhY2tkcm9wID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFRyYW5zaXRpb24sXG4gICAgICAgIHsgdHJhbnNpdGlvbkFwcGVhcjogdHJ1ZSxcbiAgICAgICAgICAnaW4nOiB0aGlzLnByb3BzLnNob3csXG4gICAgICAgICAgdGltZW91dDogYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dFxuICAgICAgICB9LFxuICAgICAgICByZW5kZXJCYWNrZHJvcCh7XG4gICAgICAgICAgcmVmOiBiYWNrZHJvcFJlZixcbiAgICAgICAgICBzdHlsZTogYmFja2Ryb3BTdHlsZSxcbiAgICAgICAgICBjbGFzc05hbWU6IGJhY2tkcm9wQ2xhc3NOYW1lLFxuICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQmFja2Ryb3BDbGlja1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFja2Ryb3A7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiBmYWxzZSB9KTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMudHJhbnNpdGlvbikge1xuICAgICAgLy8gT3RoZXJ3aXNlIGxldCBoYW5kbGVIaWRkZW4gdGFrZSBjYXJlIG9mIG1hcmtpbmcgZXhpdGVkLlxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogdHJ1ZSB9KTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnNob3cgJiYgbmV4dFByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuY2hlY2tGb3JGb2N1cygpO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICB2YXIgdHJhbnNpdGlvbiA9IHRoaXMucHJvcHMudHJhbnNpdGlvbjtcblxuXG4gICAgaWYgKHByZXZQcm9wcy5zaG93ICYmICF0aGlzLnByb3BzLnNob3cgJiYgIXRyYW5zaXRpb24pIHtcbiAgICAgIC8vIE90aGVyd2lzZSBoYW5kbGVIaWRkZW4gd2lsbCBjYWxsIHRoaXMuXG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH0gZWxzZSBpZiAoIXByZXZQcm9wcy5zaG93ICYmIHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB2YXIgX3Byb3BzMyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHNob3cgPSBfcHJvcHMzLnNob3c7XG4gICAgdmFyIHRyYW5zaXRpb24gPSBfcHJvcHMzLnRyYW5zaXRpb247XG5cblxuICAgIGlmIChzaG93IHx8IHRyYW5zaXRpb24gJiYgIXRoaXMuc3RhdGUuZXhpdGVkKSB7XG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH1cbiAgfSxcbiAgb25TaG93OiBmdW5jdGlvbiBvblNob3coKSB7XG4gICAgdmFyIGRvYyA9ICgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcyk7XG4gICAgdmFyIGNvbnRhaW5lciA9ICgwLCBfZ2V0Q29udGFpbmVyMi5kZWZhdWx0KSh0aGlzLnByb3BzLmNvbnRhaW5lciwgZG9jLmJvZHkpO1xuXG4gICAgdGhpcy5wcm9wcy5tYW5hZ2VyLmFkZCh0aGlzLCBjb250YWluZXIsIHRoaXMucHJvcHMuY29udGFpbmVyQ2xhc3NOYW1lKTtcblxuICAgIHRoaXMuX29uRG9jdW1lbnRLZXl1cExpc3RlbmVyID0gKDAsIF9hZGRFdmVudExpc3RlbmVyMi5kZWZhdWx0KShkb2MsICdrZXl1cCcsIHRoaXMuaGFuZGxlRG9jdW1lbnRLZXlVcCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lciA9ICgwLCBfYWRkRm9jdXNMaXN0ZW5lcjIuZGVmYXVsdCkodGhpcy5lbmZvcmNlRm9jdXMpO1xuXG4gICAgdGhpcy5mb2N1cygpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25TaG93KSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgb25IaWRlOiBmdW5jdGlvbiBvbkhpZGUoKSB7XG4gICAgdGhpcy5wcm9wcy5tYW5hZ2VyLnJlbW92ZSh0aGlzKTtcblxuICAgIHRoaXMuX29uRG9jdW1lbnRLZXl1cExpc3RlbmVyLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5fb25Gb2N1c2luTGlzdGVuZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLnJlc3RvcmVMYXN0Rm9jdXMoKTtcbiAgfSxcbiAgc2V0TW91bnROb2RlOiBmdW5jdGlvbiBzZXRNb3VudE5vZGUocmVmKSB7XG4gICAgdGhpcy5tb3VudE5vZGUgPSByZWYgPyByZWYuZ2V0TW91bnROb2RlKCkgOiByZWY7XG4gIH0sXG4gIGhhbmRsZUhpZGRlbjogZnVuY3Rpb24gaGFuZGxlSGlkZGVuKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IHRydWUgfSk7XG4gICAgdGhpcy5vbkhpZGUoKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uRXhpdGVkKSB7XG4gICAgICB2YXIgX3Byb3BzNDtcblxuICAgICAgKF9wcm9wczQgPSB0aGlzLnByb3BzKS5vbkV4aXRlZC5hcHBseShfcHJvcHM0LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcbiAgaGFuZGxlQmFja2Ryb3BDbGljazogZnVuY3Rpb24gaGFuZGxlQmFja2Ryb3BDbGljayhlKSB7XG4gICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkJhY2tkcm9wQ2xpY2spIHtcbiAgICAgIHRoaXMucHJvcHMub25CYWNrZHJvcENsaWNrKGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmJhY2tkcm9wID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uSGlkZSgpO1xuICAgIH1cbiAgfSxcbiAgaGFuZGxlRG9jdW1lbnRLZXlVcDogZnVuY3Rpb24gaGFuZGxlRG9jdW1lbnRLZXlVcChlKSB7XG4gICAgaWYgKHRoaXMucHJvcHMua2V5Ym9hcmQgJiYgZS5rZXlDb2RlID09PSAyNyAmJiB0aGlzLmlzVG9wTW9kYWwoKSkge1xuICAgICAgaWYgKHRoaXMucHJvcHMub25Fc2NhcGVLZXlVcCkge1xuICAgICAgICB0aGlzLnByb3BzLm9uRXNjYXBlS2V5VXAoZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnByb3BzLm9uSGlkZSgpO1xuICAgIH1cbiAgfSxcbiAgY2hlY2tGb3JGb2N1czogZnVuY3Rpb24gY2hlY2tGb3JGb2N1cygpIHtcbiAgICBpZiAoX2luRE9NMi5kZWZhdWx0KSB7XG4gICAgICB0aGlzLmxhc3RGb2N1cyA9ICgwLCBfYWN0aXZlRWxlbWVudDIuZGVmYXVsdCkoKTtcbiAgICB9XG4gIH0sXG4gIGZvY3VzOiBmdW5jdGlvbiBmb2N1cygpIHtcbiAgICB2YXIgYXV0b0ZvY3VzID0gdGhpcy5wcm9wcy5hdXRvRm9jdXM7XG4gICAgdmFyIG1vZGFsQ29udGVudCA9IHRoaXMuZ2V0RGlhbG9nRWxlbWVudCgpO1xuICAgIHZhciBjdXJyZW50ID0gKDAsIF9hY3RpdmVFbGVtZW50Mi5kZWZhdWx0KSgoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpKTtcbiAgICB2YXIgZm9jdXNJbk1vZGFsID0gY3VycmVudCAmJiAoMCwgX2NvbnRhaW5zMi5kZWZhdWx0KShtb2RhbENvbnRlbnQsIGN1cnJlbnQpO1xuXG4gICAgaWYgKG1vZGFsQ29udGVudCAmJiBhdXRvRm9jdXMgJiYgIWZvY3VzSW5Nb2RhbCkge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBjdXJyZW50O1xuXG4gICAgICBpZiAoIW1vZGFsQ29udGVudC5oYXNBdHRyaWJ1dGUoJ3RhYkluZGV4JykpIHtcbiAgICAgICAgbW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAtMSk7XG4gICAgICAgICgwLCBfd2FybmluZzIuZGVmYXVsdCkoZmFsc2UsICdUaGUgbW9kYWwgY29udGVudCBub2RlIGRvZXMgbm90IGFjY2VwdCBmb2N1cy4gJyArICdGb3IgdGhlIGJlbmVmaXQgb2YgYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgdGhlIHRhYkluZGV4IG9mIHRoZSBub2RlIGlzIGJlaW5nIHNldCB0byBcIi0xXCIuJyk7XG4gICAgICB9XG5cbiAgICAgIG1vZGFsQ29udGVudC5mb2N1cygpO1xuICAgIH1cbiAgfSxcbiAgcmVzdG9yZUxhc3RGb2N1czogZnVuY3Rpb24gcmVzdG9yZUxhc3RGb2N1cygpIHtcbiAgICAvLyBTdXBwb3J0OiA8PUlFMTEgZG9lc24ndCBzdXBwb3J0IGBmb2N1cygpYCBvbiBzdmcgZWxlbWVudHMgKFJCOiAjOTE3KVxuICAgIGlmICh0aGlzLmxhc3RGb2N1cyAmJiB0aGlzLmxhc3RGb2N1cy5mb2N1cykge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMuZm9jdXMoKTtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIGVuZm9yY2VGb2N1czogZnVuY3Rpb24gZW5mb3JjZUZvY3VzKCkge1xuICAgIHZhciBlbmZvcmNlRm9jdXMgPSB0aGlzLnByb3BzLmVuZm9yY2VGb2N1cztcblxuXG4gICAgaWYgKCFlbmZvcmNlRm9jdXMgfHwgIXRoaXMuaXNNb3VudGVkKCkgfHwgIXRoaXMuaXNUb3BNb2RhbCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjdGl2ZSA9ICgwLCBfYWN0aXZlRWxlbWVudDIuZGVmYXVsdCkoKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKSk7XG4gICAgdmFyIG1vZGFsID0gdGhpcy5nZXREaWFsb2dFbGVtZW50KCk7XG5cbiAgICBpZiAobW9kYWwgJiYgbW9kYWwgIT09IGFjdGl2ZSAmJiAhKDAsIF9jb250YWluczIuZGVmYXVsdCkobW9kYWwsIGFjdGl2ZSkpIHtcbiAgICAgIG1vZGFsLmZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG5cbiAgLy9pbnN0ZWFkIG9mIGEgcmVmLCB3aGljaCBtaWdodCBjb25mbGljdCB3aXRoIG9uZSB0aGUgcGFyZW50IGFwcGxpZWQuXG4gIGdldERpYWxvZ0VsZW1lbnQ6IGZ1bmN0aW9uIGdldERpYWxvZ0VsZW1lbnQoKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLnJlZnMubW9kYWw7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGlzVG9wTW9kYWw6IGZ1bmN0aW9uIGlzVG9wTW9kYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubWFuYWdlci5pc1RvcE1vZGFsKHRoaXMpO1xuICB9XG59KTtcblxuTW9kYWwuTWFuYWdlciA9IF9Nb2RhbE1hbmFnZXIyLmRlZmF1bHQ7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE1vZGFsO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3N0eWxlID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvc3R5bGUnKTtcblxudmFyIF9zdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHlsZSk7XG5cbnZhciBfY2xhc3MgPSByZXF1aXJlKCdkb20taGVscGVycy9jbGFzcycpO1xuXG52YXIgX2NsYXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzKTtcblxudmFyIF9zY3JvbGxiYXJTaXplID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9zY3JvbGxiYXJTaXplJyk7XG5cbnZhciBfc2Nyb2xsYmFyU2l6ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zY3JvbGxiYXJTaXplKTtcblxudmFyIF9pc092ZXJmbG93aW5nID0gcmVxdWlyZSgnLi91dGlscy9pc092ZXJmbG93aW5nJyk7XG5cbnZhciBfaXNPdmVyZmxvd2luZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc092ZXJmbG93aW5nKTtcblxudmFyIF9tYW5hZ2VBcmlhSGlkZGVuID0gcmVxdWlyZSgnLi91dGlscy9tYW5hZ2VBcmlhSGlkZGVuJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIGZpbmRJbmRleE9mKGFyciwgY2IpIHtcbiAgdmFyIGlkeCA9IC0xO1xuICBhcnIuc29tZShmdW5jdGlvbiAoZCwgaSkge1xuICAgIGlmIChjYihkLCBpKSkge1xuICAgICAgaWR4ID0gaTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBpZHg7XG59XG5cbmZ1bmN0aW9uIGZpbmRDb250YWluZXIoZGF0YSwgbW9kYWwpIHtcbiAgcmV0dXJuIGZpbmRJbmRleE9mKGRhdGEsIGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQubW9kYWxzLmluZGV4T2YobW9kYWwpICE9PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldENvbnRhaW5lclN0eWxlKHN0YXRlLCBjb250YWluZXIpIHtcbiAgdmFyIHN0eWxlID0geyBvdmVyZmxvdzogJ2hpZGRlbicgfTtcblxuICAvLyB3ZSBhcmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSBhY3R1YWwgYHN0eWxlYCBoZXJlXG4gIC8vIGJlY2FzdWUgd2Ugd2lsbCBvdmVycmlkZSBpdFxuICBzdGF0ZS5zdHlsZSA9IHtcbiAgICBvdmVyZmxvdzogY29udGFpbmVyLnN0eWxlLm92ZXJmbG93LFxuICAgIHBhZGRpbmdSaWdodDogY29udGFpbmVyLnN0eWxlLnBhZGRpbmdSaWdodFxuICB9O1xuXG4gIGlmIChzdGF0ZS5vdmVyZmxvd2luZykge1xuICAgIC8vIHVzZSBjb21wdXRlZCBzdHlsZSwgaGVyZSB0byBnZXQgdGhlIHJlYWwgcGFkZGluZ1xuICAgIC8vIHRvIGFkZCBvdXIgc2Nyb2xsYmFyIHdpZHRoXG4gICAgc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFyc2VJbnQoKDAsIF9zdHlsZTIuZGVmYXVsdCkoY29udGFpbmVyLCAncGFkZGluZ1JpZ2h0JykgfHwgMCwgMTApICsgKDAsIF9zY3JvbGxiYXJTaXplMi5kZWZhdWx0KSgpICsgJ3B4JztcbiAgfVxuXG4gICgwLCBfc3R5bGUyLmRlZmF1bHQpKGNvbnRhaW5lciwgc3R5bGUpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDb250YWluZXJTdHlsZShfcmVmLCBjb250YWluZXIpIHtcbiAgdmFyIHN0eWxlID0gX3JlZi5zdHlsZTtcblxuXG4gIE9iamVjdC5rZXlzKHN0eWxlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLnN0eWxlW2tleV0gPSBzdHlsZVtrZXldO1xuICB9KTtcbn1cbi8qKlxuICogUHJvcGVyIHN0YXRlIG1hbmFnbWVudCBmb3IgY29udGFpbmVycyBhbmQgdGhlIG1vZGFscyBpbiB0aG9zZSBjb250YWluZXJzLlxuICpcbiAqIEBpbnRlcm5hbCBVc2VkIGJ5IHRoZSBNb2RhbCB0byBlbnN1cmUgcHJvcGVyIHN0eWxpbmcgb2YgY29udGFpbmVycy5cbiAqL1xuXG52YXIgTW9kYWxNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNb2RhbE1hbmFnZXIoKSB7XG4gICAgdmFyIF9yZWYyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgIHZhciBfcmVmMiRoaWRlU2libGluZ05vZGUgPSBfcmVmMi5oaWRlU2libGluZ05vZGVzO1xuICAgIHZhciBoaWRlU2libGluZ05vZGVzID0gX3JlZjIkaGlkZVNpYmxpbmdOb2RlID09PSB1bmRlZmluZWQgPyB0cnVlIDogX3JlZjIkaGlkZVNpYmxpbmdOb2RlO1xuICAgIHZhciBfcmVmMiRoYW5kbGVDb250YWluZXIgPSBfcmVmMi5oYW5kbGVDb250YWluZXJPdmVyZmxvdztcbiAgICB2YXIgaGFuZGxlQ29udGFpbmVyT3ZlcmZsb3cgPSBfcmVmMiRoYW5kbGVDb250YWluZXIgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfcmVmMiRoYW5kbGVDb250YWluZXI7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTW9kYWxNYW5hZ2VyKTtcblxuICAgIHRoaXMuaGlkZVNpYmxpbmdOb2RlcyA9IGhpZGVTaWJsaW5nTm9kZXM7XG4gICAgdGhpcy5oYW5kbGVDb250YWluZXJPdmVyZmxvdyA9IGhhbmRsZUNvbnRhaW5lck92ZXJmbG93O1xuICAgIHRoaXMubW9kYWxzID0gW107XG4gICAgdGhpcy5jb250YWluZXJzID0gW107XG4gICAgdGhpcy5kYXRhID0gW107XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTW9kYWxNYW5hZ2VyLCBbe1xuICAgIGtleTogJ2FkZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChtb2RhbCwgY29udGFpbmVyLCBjbGFzc05hbWUpIHtcbiAgICAgIHZhciBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmluZGV4T2YobW9kYWwpO1xuICAgICAgdmFyIGNvbnRhaW5lcklkeCA9IHRoaXMuY29udGFpbmVycy5pbmRleE9mKGNvbnRhaW5lcik7XG5cbiAgICAgIGlmIChtb2RhbElkeCAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIG1vZGFsSWR4O1xuICAgICAgfVxuXG4gICAgICBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmxlbmd0aDtcbiAgICAgIHRoaXMubW9kYWxzLnB1c2gobW9kYWwpO1xuXG4gICAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgICgwLCBfbWFuYWdlQXJpYUhpZGRlbi5oaWRlU2libGluZ3MpKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRhaW5lcklkeCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5kYXRhW2NvbnRhaW5lcklkeF0ubW9kYWxzLnB1c2gobW9kYWwpO1xuICAgICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBtb2RhbHM6IFttb2RhbF0sXG4gICAgICAgIC8vcmlnaHQgbm93IG9ubHkgdGhlIGZpcnN0IG1vZGFsIG9mIGEgY29udGFpbmVyIHdpbGwgaGF2ZSBpdHMgY2xhc3NlcyBhcHBsaWVkXG4gICAgICAgIGNsYXNzZXM6IGNsYXNzTmFtZSA/IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pIDogW10sXG5cbiAgICAgICAgb3ZlcmZsb3dpbmc6ICgwLCBfaXNPdmVyZmxvd2luZzIuZGVmYXVsdCkoY29udGFpbmVyKVxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaGFuZGxlQ29udGFpbmVyT3ZlcmZsb3cpIHtcbiAgICAgICAgc2V0Q29udGFpbmVyU3R5bGUoZGF0YSwgY29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2NsYXNzMi5kZWZhdWx0LmFkZENsYXNzLmJpbmQobnVsbCwgY29udGFpbmVyKSk7XG5cbiAgICAgIHRoaXMuY29udGFpbmVycy5wdXNoKGNvbnRhaW5lcik7XG4gICAgICB0aGlzLmRhdGEucHVzaChkYXRhKTtcblxuICAgICAgcmV0dXJuIG1vZGFsSWR4O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlbW92ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShtb2RhbCkge1xuICAgICAgdmFyIG1vZGFsSWR4ID0gdGhpcy5tb2RhbHMuaW5kZXhPZihtb2RhbCk7XG5cbiAgICAgIGlmIChtb2RhbElkeCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGFpbmVySWR4ID0gZmluZENvbnRhaW5lcih0aGlzLmRhdGEsIG1vZGFsKTtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhW2NvbnRhaW5lcklkeF07XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2NvbnRhaW5lcklkeF07XG5cbiAgICAgIGRhdGEubW9kYWxzLnNwbGljZShkYXRhLm1vZGFscy5pbmRleE9mKG1vZGFsKSwgMSk7XG5cbiAgICAgIHRoaXMubW9kYWxzLnNwbGljZShtb2RhbElkeCwgMSk7XG5cbiAgICAgIC8vIGlmIHRoYXQgd2FzIHRoZSBsYXN0IG1vZGFsIGluIGEgY29udGFpbmVyLFxuICAgICAgLy8gY2xlYW4gdXAgdGhlIGNvbnRhaW5lclxuICAgICAgaWYgKGRhdGEubW9kYWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaChfY2xhc3MyLmRlZmF1bHQucmVtb3ZlQ2xhc3MuYmluZChudWxsLCBjb250YWluZXIpKTtcblxuICAgICAgICBpZiAodGhpcy5oYW5kbGVDb250YWluZXJPdmVyZmxvdykge1xuICAgICAgICAgIHJlbW92ZUNvbnRhaW5lclN0eWxlKGRhdGEsIGNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgICAgKDAsIF9tYW5hZ2VBcmlhSGlkZGVuLnNob3dTaWJsaW5ncykoY29udGFpbmVyLCBtb2RhbC5tb3VudE5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVycy5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICAgICAgdGhpcy5kYXRhLnNwbGljZShjb250YWluZXJJZHgsIDEpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmhpZGVTaWJsaW5nTm9kZXMpIHtcbiAgICAgICAgLy9vdGhlcndpc2UgbWFrZSBzdXJlIHRoZSBuZXh0IHRvcCBtb2RhbCBpcyB2aXNpYmxlIHRvIGEgU1JcbiAgICAgICAgKDAsIF9tYW5hZ2VBcmlhSGlkZGVuLmFyaWFIaWRkZW4pKGZhbHNlLCBkYXRhLm1vZGFsc1tkYXRhLm1vZGFscy5sZW5ndGggLSAxXS5tb3VudE5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2lzVG9wTW9kYWwnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc1RvcE1vZGFsKG1vZGFsKSB7XG4gICAgICByZXR1cm4gISF0aGlzLm1vZGFscy5sZW5ndGggJiYgdGhpcy5tb2RhbHNbdGhpcy5tb2RhbHMubGVuZ3RoIC0gMV0gPT09IG1vZGFsO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNb2RhbE1hbmFnZXI7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE1vZGFsTWFuYWdlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxudmFyIF9jb21wb25lbnRPckVsZW1lbnQgPSByZXF1aXJlKCdyZWFjdC1wcm9wLXR5cGVzL2xpYi9jb21wb25lbnRPckVsZW1lbnQnKTtcblxudmFyIF9jb21wb25lbnRPckVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9uZW50T3JFbGVtZW50KTtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi91dGlscy9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxudmFyIF9nZXRDb250YWluZXIgPSByZXF1aXJlKCcuL3V0aWxzL2dldENvbnRhaW5lcicpO1xuXG52YXIgX2dldENvbnRhaW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRDb250YWluZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIFRoZSBgPFBvcnRhbC8+YCBjb21wb25lbnQgcmVuZGVycyBpdHMgY2hpbGRyZW4gaW50byBhIG5ldyBcInN1YnRyZWVcIiBvdXRzaWRlIG9mIGN1cnJlbnQgY29tcG9uZW50IGhpZXJhcmNoeS5cbiAqIFlvdSBjYW4gdGhpbmsgb2YgaXQgYXMgYSBkZWNsYXJhdGl2ZSBgYXBwZW5kQ2hpbGQoKWAsIG9yIGpRdWVyeSdzIGAkLmZuLmFwcGVuZFRvKClgLlxuICogVGhlIGNoaWxkcmVuIG9mIGA8UG9ydGFsLz5gIGNvbXBvbmVudCB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSBgY29udGFpbmVyYCBzcGVjaWZpZWQuXG4gKi9cbnZhciBQb3J0YWwgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlQ2xhc3Moe1xuXG4gIGRpc3BsYXlOYW1lOiAnUG9ydGFsJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvKipcbiAgICAgKiBBIE5vZGUsIENvbXBvbmVudCBpbnN0YW5jZSwgb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGVpdGhlci4gVGhlIGBjb250YWluZXJgIHdpbGwgaGF2ZSB0aGUgUG9ydGFsIGNoaWxkcmVuXG4gICAgICogYXBwZW5kZWQgdG8gaXQuXG4gICAgICovXG4gICAgY29udGFpbmVyOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm9uZU9mVHlwZShbX2NvbXBvbmVudE9yRWxlbWVudDIuZGVmYXVsdCwgX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jXSlcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fcmVuZGVyT3ZlcmxheSgpO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZW5kZXJPdmVybGF5KCk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQgJiYgbmV4dFByb3BzLmNvbnRhaW5lciAhPT0gdGhpcy5wcm9wcy5jb250YWluZXIpIHtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gKDAsIF9nZXRDb250YWluZXIyLmRlZmF1bHQpKG5leHRQcm9wcy5jb250YWluZXIsICgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykuYm9keSk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLmFwcGVuZENoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX3VucmVuZGVyT3ZlcmxheSgpO1xuICAgIHRoaXMuX3VubW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gIH0sXG4gIF9tb3VudE92ZXJsYXlUYXJnZXQ6IGZ1bmN0aW9uIF9tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5VGFyZ2V0KSB7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gKDAsIF9nZXRDb250YWluZXIyLmRlZmF1bHQpKHRoaXMucHJvcHMuY29udGFpbmVyLCAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpLmJvZHkpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9XG4gIH0sXG4gIF91bm1vdW50T3ZlcmxheVRhcmdldDogZnVuY3Rpb24gX3VubW91bnRPdmVybGF5VGFyZ2V0KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5VGFyZ2V0KSB7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLnJlbW92ZUNoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fb3ZlcmxheVRhcmdldCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSBudWxsO1xuICB9LFxuICBfcmVuZGVyT3ZlcmxheTogZnVuY3Rpb24gX3JlbmRlck92ZXJsYXkoKSB7XG5cbiAgICB2YXIgb3ZlcmxheSA9ICF0aGlzLnByb3BzLmNoaWxkcmVuID8gbnVsbCA6IF9yZWFjdDIuZGVmYXVsdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgLy8gU2F2ZSByZWZlcmVuY2UgZm9yIGZ1dHVyZSBhY2Nlc3MuXG4gICAgaWYgKG92ZXJsYXkgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX21vdW50T3ZlcmxheVRhcmdldCgpO1xuICAgICAgdGhpcy5fb3ZlcmxheUluc3RhbmNlID0gX3JlYWN0RG9tMi5kZWZhdWx0LnVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyKHRoaXMsIG92ZXJsYXksIHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbnJlbmRlciBpZiB0aGUgY29tcG9uZW50IGlzIG51bGwgZm9yIHRyYW5zaXRpb25zIHRvIG51bGxcbiAgICAgIHRoaXMuX3VucmVuZGVyT3ZlcmxheSgpO1xuICAgICAgdGhpcy5fdW5tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgICB9XG4gIH0sXG4gIF91bnJlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF91bnJlbmRlck92ZXJsYXkoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIF9yZWFjdERvbTIuZGVmYXVsdC51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fb3ZlcmxheUluc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBnZXRNb3VudE5vZGU6IGZ1bmN0aW9uIGdldE1vdW50Tm9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVRhcmdldDtcbiAgfSxcbiAgZ2V0T3ZlcmxheURPTU5vZGU6IGZ1bmN0aW9uIGdldE92ZXJsYXlET01Ob2RlKCkge1xuICAgIGlmICghdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRPdmVybGF5RE9NTm9kZSgpOiBBIGNvbXBvbmVudCBtdXN0IGJlIG1vdW50ZWQgdG8gaGF2ZSBhIERPTSBub2RlLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vdmVybGF5SW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiBfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUodGhpcy5fb3ZlcmxheUluc3RhbmNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFBvcnRhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICgwLCBfb24yLmRlZmF1bHQpKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKTtcblxuICByZXR1cm4ge1xuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgKDAsIF9vZmYyLmRlZmF1bHQpKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKTtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgX29uID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvZXZlbnRzL29uJyk7XG5cbnZhciBfb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb24pO1xuXG52YXIgX29mZiA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2V2ZW50cy9vZmYnKTtcblxudmFyIF9vZmYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb2ZmKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gYWRkRm9jdXNMaXN0ZW5lcjtcbi8qKlxuICogRmlyZWZveCBkb2Vzbid0IGhhdmUgYSBmb2N1c2luIGV2ZW50IHNvIHVzaW5nIGNhcHR1cmUgaXMgZWFzaWVzdCB3YXkgdG8gZ2V0IGJ1YmJsaW5nXG4gKiBJRTggY2FuJ3QgZG8gYWRkRXZlbnRMaXN0ZW5lciwgYnV0IGRvZXMgaGF2ZSBvbmZvY3VzaW4sIHNvIHdlIHVzZSB0aGF0IGluIGllOFxuICpcbiAqIFdlIG9ubHkgYWxsb3cgb25lIExpc3RlbmVyIGF0IGEgdGltZSB0byBhdm9pZCBzdGFjayBvdmVyZmxvd3NcbiAqL1xuZnVuY3Rpb24gYWRkRm9jdXNMaXN0ZW5lcihoYW5kbGVyKSB7XG4gIHZhciB1c2VGb2N1c2luID0gIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI7XG4gIHZhciByZW1vdmUgPSB2b2lkIDA7XG5cbiAgaWYgKHVzZUZvY3VzaW4pIHtcbiAgICBkb2N1bWVudC5hdHRhY2hFdmVudCgnb25mb2N1c2luJywgaGFuZGxlcik7XG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmRldGFjaEV2ZW50KCdvbmZvY3VzaW4nLCBoYW5kbGVyKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlciwgdHJ1ZSk7XG4gICAgcmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlciwgdHJ1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7IHJlbW92ZTogcmVtb3ZlIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBnZXRDb250YWluZXI7XG5cbnZhciBfcmVhY3REb20gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3RET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0RE9NJ10gOiBudWxsKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGdldENvbnRhaW5lcihjb250YWluZXIsIGRlZmF1bHRDb250YWluZXIpIHtcbiAgY29udGFpbmVyID0gdHlwZW9mIGNvbnRhaW5lciA9PT0gJ2Z1bmN0aW9uJyA/IGNvbnRhaW5lcigpIDogY29udGFpbmVyO1xuICByZXR1cm4gX3JlYWN0RG9tMi5kZWZhdWx0LmZpbmRET01Ob2RlKGNvbnRhaW5lcikgfHwgZGVmYXVsdENvbnRhaW5lcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGlzT3ZlcmZsb3dpbmc7XG5cbnZhciBfaXNXaW5kb3cgPSByZXF1aXJlKCdkb20taGVscGVycy9xdWVyeS9pc1dpbmRvdycpO1xuXG52YXIgX2lzV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzV2luZG93KTtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX293bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3duZXJEb2N1bWVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGlzQm9keShub2RlKSB7XG4gIHJldHVybiBub2RlICYmIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYm9keSc7XG59XG5cbmZ1bmN0aW9uIGJvZHlJc092ZXJmbG93aW5nKG5vZGUpIHtcbiAgdmFyIGRvYyA9ICgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkobm9kZSk7XG4gIHZhciB3aW4gPSAoMCwgX2lzV2luZG93Mi5kZWZhdWx0KShkb2MpO1xuICB2YXIgZnVsbFdpZHRoID0gd2luLmlubmVyV2lkdGg7XG5cbiAgLy8gU3VwcG9ydDogaWU4LCBubyBpbm5lcldpZHRoXG4gIGlmICghZnVsbFdpZHRoKSB7XG4gICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGZ1bGxXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpO1xuICB9XG5cbiAgcmV0dXJuIGRvYy5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpZHRoO1xufVxuXG5mdW5jdGlvbiBpc092ZXJmbG93aW5nKGNvbnRhaW5lcikge1xuICB2YXIgd2luID0gKDAsIF9pc1dpbmRvdzIuZGVmYXVsdCkoY29udGFpbmVyKTtcblxuICByZXR1cm4gd2luIHx8IGlzQm9keShjb250YWluZXIpID8gYm9keUlzT3ZlcmZsb3dpbmcoY29udGFpbmVyKSA6IGNvbnRhaW5lci5zY3JvbGxIZWlnaHQgPiBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5hcmlhSGlkZGVuID0gYXJpYUhpZGRlbjtcbmV4cG9ydHMuaGlkZVNpYmxpbmdzID0gaGlkZVNpYmxpbmdzO1xuZXhwb3J0cy5zaG93U2libGluZ3MgPSBzaG93U2libGluZ3M7XG5cbnZhciBCTEFDS0xJU1QgPSBbJ3RlbXBsYXRlJywgJ3NjcmlwdCcsICdzdHlsZSddO1xuXG52YXIgaXNIaWRhYmxlID0gZnVuY3Rpb24gaXNIaWRhYmxlKF9yZWYpIHtcbiAgdmFyIG5vZGVUeXBlID0gX3JlZi5ub2RlVHlwZTtcbiAgdmFyIHRhZ05hbWUgPSBfcmVmLnRhZ05hbWU7XG4gIHJldHVybiBub2RlVHlwZSA9PT0gMSAmJiBCTEFDS0xJU1QuaW5kZXhPZih0YWdOYW1lLnRvTG93ZXJDYXNlKCkpID09PSAtMTtcbn07XG5cbnZhciBzaWJsaW5ncyA9IGZ1bmN0aW9uIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnQsIGNiKSB7XG4gIG1vdW50ID0gW10uY29uY2F0KG1vdW50KTtcblxuICBbXS5mb3JFYWNoLmNhbGwoY29udGFpbmVyLmNoaWxkcmVuLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChtb3VudC5pbmRleE9mKG5vZGUpID09PSAtMSAmJiBpc0hpZGFibGUobm9kZSkpIHtcbiAgICAgIGNiKG5vZGUpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBhcmlhSGlkZGVuKHNob3csIG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChzaG93KSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoaWRlU2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUpIHtcbiAgc2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFyaWFIaWRkZW4odHJ1ZSwgbm9kZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93U2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUpIHtcbiAgc2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFyaWFIaWRkZW4oZmFsc2UsIG5vZGUpO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChjb21wb25lbnRPckVsZW1lbnQpIHtcbiAgcmV0dXJuICgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkoX3JlYWN0RG9tMi5kZWZhdWx0LmZpbmRET01Ob2RlKGNvbXBvbmVudE9yRWxlbWVudCkpO1xufTtcblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX293bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3duZXJEb2N1bWVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIgPSByZXF1aXJlKCcuL3V0aWxzL2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyJyk7XG5cbnZhciBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocHJvcFZhbHVlKTtcblxuICBpZiAoX3JlYWN0Mi5kZWZhdWx0LmlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIFJlYWN0RWxlbWVudCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdENvbXBvbmVudCBvciBhICcpICsgJ0RPTUVsZW1lbnQuIFlvdSBjYW4gdXN1YWxseSBvYnRhaW4gYSBSZWFjdENvbXBvbmVudCBvciBET01FbGVtZW50ICcgKyAnZnJvbSBhIFJlYWN0RWxlbWVudCBieSBhdHRhY2hpbmcgYSByZWYgdG8gaXQuJyk7XG4gIH1cblxuICBpZiAoKHByb3BUeXBlICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgcHJvcFZhbHVlLnJlbmRlciAhPT0gJ2Z1bmN0aW9uJykgJiYgcHJvcFZhbHVlLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdENvbXBvbmVudCBvciBhICcpICsgJ0RPTUVsZW1lbnQuJyk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIuZGVmYXVsdCkodmFsaWRhdGUpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIgPSByZXF1aXJlKCcuL3V0aWxzL2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyJyk7XG5cbnZhciBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBlbGVtZW50VHlwZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocHJvcFZhbHVlKTtcblxuICBpZiAoX3JlYWN0Mi5kZWZhdWx0LmlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIFJlYWN0RWxlbWVudCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gZWxlbWVudCB0eXBlIChhIHN0cmluZyAnKSArICdvciBhIFJlYWN0Q2xhc3MpLicpO1xuICB9XG5cbiAgaWYgKHByb3BUeXBlICE9PSAnZnVuY3Rpb24nICYmIHByb3BUeXBlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGVsZW1lbnQgdHlwZSAoYSBzdHJpbmcgJykgKyAnb3IgYSBSZWFjdENsYXNzKS4nKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMi5kZWZhdWx0KShlbGVtZW50VHlwZSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXI7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4vLyBNb3N0bHkgdGFrZW4gZnJvbSBSZWFjdFByb3BUeXBlcy5cblxuZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIHZhciBjb21wb25lbnROYW1lU2FmZSA9IGNvbXBvbmVudE5hbWUgfHwgJzw8YW5vbnltb3VzPj4nO1xuICAgIHZhciBwcm9wRnVsbE5hbWVTYWZlID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXF1aXJlZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lU2FmZSArICdgIHdhcyBub3Qgc3BlY2lmaWVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZVNhZmUgKyAnYC4nKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDYgPyBfbGVuIC0gNiA6IDApLCBfa2V5ID0gNjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gNl0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRlLmFwcGx5KHVuZGVmaW5lZCwgW3Byb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZVNhZmUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWVTYWZlXS5jb25jYXQoYXJncykpO1xuICB9XG5cbiAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xufSIsIi8qIVxuICogXG4gKiAgUmVhY3QgU2ltcGxldGFicyAtIEp1c3QgYSBzaW1wbGUgdGFicyBjb21wb25lbnQgYnVpbHQgd2l0aCBSZWFjdFxuICogIEB2ZXJzaW9uIHYwLjcuMFxuICogIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9wZWRyb25hdWNrL3JlYWN0LXNpbXBsZXRhYnNcbiAqICBAbGljZW5zZSBNSVRcbiAqICBAYXV0aG9yIFBlZHJvIE5hdWNrIChodHRwczovL2dpdGh1Yi5jb20vcGVkcm9uYXVjaylcbiAqIFxuICovXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInJlYWN0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlJlYWN0U2ltcGxlVGFic1wiXSA9IGZhY3RvcnkoKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCkpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlJlYWN0U2ltcGxlVGFic1wiXSA9IGZhY3Rvcnkocm9vdFtcIlJlYWN0XCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMV9fKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cbi8qKioqKiovXG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiogQGpzeCBSZWFjdC5ET00gKi8ndXNlIHN0cmljdCc7XG5cblx0dmFyIFJlYWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKTtcblx0dmFyIGNsYXNzTmFtZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xuXG5cdGlmICh0cnVlKSB7XG5cdCAgX193ZWJwYWNrX3JlcXVpcmVfXygzKTtcblx0fVxuXG5cdHZhciBUYWJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHQgIGRpc3BsYXlOYW1lOiAnVGFicycsXG5cdCAgcHJvcFR5cGVzOiB7XG5cdCAgICBjbGFzc05hbWU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5vYmplY3Rcblx0ICAgIF0pLFxuXHQgICAgdGFiQWN0aXZlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuXHQgICAgb25Nb3VudDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBvbkJlZm9yZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBvbkFmdGVyQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblx0ICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuZWxlbWVudFxuXHQgICAgXSkuaXNSZXF1aXJlZFxuXHQgIH0sXG5cdCAgZ2V0RGVmYXVsdFByb3BzOmZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB7IHRhYkFjdGl2ZTogMSB9O1xuXHQgIH0sXG5cdCAgZ2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiB7XG5cdCAgICAgIHRhYkFjdGl2ZTogdGhpcy5wcm9wcy50YWJBY3RpdmVcblx0ICAgIH07XG5cdCAgfSxcblx0ICBjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcblx0ICAgIHZhciBpbmRleCA9IHRoaXMuc3RhdGUudGFiQWN0aXZlO1xuXHQgICAgdmFyICRzZWxlY3RlZFBhbmVsID0gdGhpcy5yZWZzWyd0YWItcGFuZWwnXTtcblx0ICAgIHZhciAkc2VsZWN0ZWRNZW51ID0gdGhpcy5yZWZzWyhcInRhYi1tZW51LVwiICsgaW5kZXgpXTtcblxuXHQgICAgaWYgKHRoaXMucHJvcHMub25Nb3VudCkge1xuXHQgICAgICB0aGlzLnByb3BzLm9uTW91bnQoaW5kZXgsICRzZWxlY3RlZFBhbmVsLCAkc2VsZWN0ZWRNZW51KTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5ld1Byb3BzKXtcblx0ICAgIGlmKG5ld1Byb3BzLnRhYkFjdGl2ZSAmJiBuZXdQcm9wcy50YWJBY3RpdmUgIT09IHRoaXMucHJvcHMudGFiQWN0aXZlKXtcblx0ICAgICAgdGhpcy5zZXRTdGF0ZSh7dGFiQWN0aXZlOiBuZXdQcm9wcy50YWJBY3RpdmV9KTtcblx0ICAgIH1cblx0ICB9LFxuXHQgIHJlbmRlcjpmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcygndGFicycsIHRoaXMucHJvcHMuY2xhc3NOYW1lKTtcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogY2xhc3NOYW1lfSwgXG5cdCAgICAgICAgdGhpcy5fZ2V0TWVudUl0ZW1zKCksIFxuXHQgICAgICAgIHRoaXMuX2dldFNlbGVjdGVkUGFuZWwoKVxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH0sXG5cdCAgc2V0QWN0aXZlOmZ1bmN0aW9uKGluZGV4LCBlKSB7XG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0ICAgIHZhciBvbkFmdGVyQ2hhbmdlID0gdGhpcy5wcm9wcy5vbkFmdGVyQ2hhbmdlO1xuXHQgICAgdmFyIG9uQmVmb3JlQ2hhbmdlID0gdGhpcy5wcm9wcy5vbkJlZm9yZUNoYW5nZTtcblx0ICAgIHZhciAkc2VsZWN0ZWRQYW5lbCA9IHRoaXMucmVmc1sndGFiLXBhbmVsJ107XG5cdCAgICB2YXIgJHNlbGVjdGVkVGFiTWVudSA9IHRoaXMucmVmc1soXCJ0YWItbWVudS1cIiArIGluZGV4KV07XG5cblx0ICAgIGlmIChvbkJlZm9yZUNoYW5nZSkge1xuXHQgICAgICB2YXIgY2FuY2VsID0gb25CZWZvcmVDaGFuZ2UoaW5kZXgsICRzZWxlY3RlZFBhbmVsLCAkc2VsZWN0ZWRUYWJNZW51KTtcblx0ICAgICAgaWYoY2FuY2VsID09PSBmYWxzZSl7IHJldHVybiB9XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc2V0U3RhdGUoeyB0YWJBY3RpdmU6IGluZGV4IH0sIGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgaWYgKG9uQWZ0ZXJDaGFuZ2UpIHtcblx0ICAgICAgICBvbkFmdGVyQ2hhbmdlKGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkVGFiTWVudSk7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXHQgIH0sXG5cdCAgX2dldE1lbnVJdGVtczpmdW5jdGlvbiAoKSB7XG5cdCAgICBpZiAoIXRoaXMucHJvcHMuY2hpbGRyZW4pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWJzIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgVGFicy5QYW5lbCcpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5wcm9wcy5jaGlsZHJlbikpIHtcblx0ICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlbiA9IFt0aGlzLnByb3BzLmNoaWxkcmVuXTtcblx0ICAgIH1cblxuXHQgICAgdmFyICRtZW51SXRlbXMgPSB0aGlzLnByb3BzLmNoaWxkcmVuXG5cdCAgICAgIC5tYXAoZnVuY3Rpb24oJHBhbmVsKSAge3JldHVybiB0eXBlb2YgJHBhbmVsID09PSAnZnVuY3Rpb24nID8gJHBhbmVsKCkgOiAkcGFuZWw7fSlcblx0ICAgICAgLmZpbHRlcihmdW5jdGlvbigkcGFuZWwpICB7cmV0dXJuICRwYW5lbDt9KVxuXHQgICAgICAubWFwKGZ1bmN0aW9uKCRwYW5lbCwgaW5kZXgpICB7XG5cdCAgICAgICAgdmFyIHJlZiA9IChcInRhYi1tZW51LVwiICsgKGluZGV4ICsgMSkpO1xuXHQgICAgICAgIHZhciB0aXRsZSA9ICRwYW5lbC5wcm9wcy50aXRsZTtcblx0ICAgICAgICB2YXIgY2xhc3NlcyA9IGNsYXNzTmFtZXMoXG5cdCAgICAgICAgICAndGFicy1tZW51LWl0ZW0nLFxuXHQgICAgICAgICAgdGhpcy5zdGF0ZS50YWJBY3RpdmUgPT09IChpbmRleCArIDEpICYmICdpcy1hY3RpdmUnXG5cdCAgICAgICAgKTtcblxuXHQgICAgICAgIHJldHVybiAoXG5cdCAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge3JlZjogcmVmLCBrZXk6IGluZGV4LCBjbGFzc05hbWU6IGNsYXNzZXN9LCBcblx0ICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuc2V0QWN0aXZlLmJpbmQodGhpcywgaW5kZXggKyAxKX0sIFxuXHQgICAgICAgICAgICAgIHRpdGxlXG5cdCAgICAgICAgICAgIClcblx0ICAgICAgICAgIClcblx0ICAgICAgICApO1xuXHQgICAgICB9LmJpbmQodGhpcykpO1xuXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibmF2XCIsIHtjbGFzc05hbWU6IFwidGFicy1uYXZpZ2F0aW9uXCJ9LCBcblx0ICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJ0YWJzLW1lbnVcIn0sICRtZW51SXRlbXMpXG5cdCAgICAgIClcblx0ICAgICk7XG5cdCAgfSxcblx0ICBfZ2V0U2VsZWN0ZWRQYW5lbDpmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgaW5kZXggPSB0aGlzLnN0YXRlLnRhYkFjdGl2ZSAtIDE7XG5cdCAgICB2YXIgJHBhbmVsID0gdGhpcy5wcm9wcy5jaGlsZHJlbltpbmRleF07XG5cblx0ICAgIHJldHVybiAoXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhcnRpY2xlXCIsIHtyZWY6IFwidGFiLXBhbmVsXCIsIGNsYXNzTmFtZTogXCJ0YWItcGFuZWxcIn0sIFxuXHQgICAgICAgICRwYW5lbFxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH1cblx0fSk7XG5cblx0VGFicy5QYW5lbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ICBkaXNwbGF5TmFtZTogJ1BhbmVsJyxcblx0ICBwcm9wVHlwZXM6IHtcblx0ICAgIHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cdCAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmVsZW1lbnRcblx0ICAgIF0pLmlzUmVxdWlyZWRcblx0ICB9LFxuXHQgIHJlbmRlcjpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKTtcblx0ICB9XG5cdH0pO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gVGFicztcblxuXG4vKioqLyB9LFxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXztcblxuLyoqKi8gfSxcbi8qIDIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qKiBAanN4IFJlYWN0LkRPTSAqL2Z1bmN0aW9uIGNsYXNzTmFtZXMoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblx0XHR2YXIgYXJnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBhcmcgfHwgJ251bWJlcicgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdFx0fSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIGFyZykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKCFhcmcuaGFzT3duUHJvcGVydHkoa2V5KSB8fCAhYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHQvLyBzYWZlbHkgZXhwb3J0IGNsYXNzTmFtZXMgaW4gY2FzZSB0aGUgc2NyaXB0IGlzIGluY2x1ZGVkIGRpcmVjdGx5IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH1cblxuXG4vKioqLyB9LFxuLyogMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0Ly8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHdhcm5pbmcgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYXJncykge1xuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuID4gMiA/IGxlbiAtIDIgOiAwKTtcbiAgICBmb3IgKHZhciBrZXkgPSAyOyBrZXkgPCBsZW47IGtleSsrKSB7XG4gICAgICBhcmdzW2tleSAtIDJdID0gYXJndW1lbnRzW2tleV07XG4gICAgfVxuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArXG4gICAgICAgICdtZXNzYWdlIGFyZ3VtZW50J1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybWF0Lmxlbmd0aCA8IDEwIHx8ICgvXltzXFxXXSokLykudGVzdChmb3JtYXQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgd2FybmluZyBmb3JtYXQgc2hvdWxkIGJlIGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyAnICtcbiAgICAgICAgJ3dhcm5pbmcuIFBsZWFzZSwgdXNlIGEgbW9yZSBkZXNjcmlwdGl2ZSBmb3JtYXQgdGhhbjogJyArIGZvcm1hdFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9IGNhdGNoKHgpIHt9XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQWxsZWxlRmlsdGVyc1ZpZXcgPSAoe3NwZWNpZXMsIHZpc2libGVHZW5lcz1bXSwgZGlzYWJsZWRBbGxlbGVzPVtdLCBvbkZpbHRlckNoYW5nZX0pID0+IHtcbiAgbGV0IGdlbmVJbnB1dHMgPSBbXSxcbiAgICAgIGFsbFZpc2libGUgPSB2aXNpYmxlR2VuZXMubGVuZ3RoID09PSAwO1xuXG4gIGZvciAoY29uc3QgZ2VuZSBpbiBzcGVjaWVzLmdlbmVMaXN0KSB7XG4gICAgaWYgKGFsbFZpc2libGUgfHwgdmlzaWJsZUdlbmVzLmluZGV4T2YoZ2VuZSkgPiAtMSkge1xuICAgICAgY29uc3QgYWxsZWxlcyA9IHNwZWNpZXMuZ2VuZUxpc3RbZ2VuZV0uYWxsZWxlcyxcbiAgICAgICAgICAgIGFsbGVsZUl0ZW1zID0gYWxsZWxlcy5tYXAoYWxsZWxlID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXSxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA9ICEoZGlzYWJsZWRBbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA+PSAwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtuYW1lfT5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IFwibWFyZ2luTGVmdFwiOiBcIjhweFwiIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfS8+XG4gICAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICBnZW5lSW5wdXRzLnB1c2goXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuZS1hbGxlbGUtbGlzdFwiIGtleT17Z2VuZX0+e2FsbGVsZUl0ZW1zfTwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICBhbGxlbGUgPSBlbHQgJiYgZWx0LnZhbHVlLFxuICAgICAgICAgIGlzQ2hlY2tlZCA9IGVsdCAmJiBlbHQuY2hlY2tlZDtcbiAgICBpZiAob25GaWx0ZXJDaGFuZ2UgJiYgYWxsZWxlKVxuICAgICAgb25GaWx0ZXJDaGFuZ2UoZXZ0LCBhbGxlbGUsIGlzQ2hlY2tlZCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBhbGxlbGUtZmlsdGVyc1wiXG4gICAgICAgICAgc3R5bGU9e3sgXCJtYXJnaW5Ub3BcIjogXCI1cHhcIiwgXCJtYXJnaW5Cb3R0b21cIjogXCI1cHhcIiB9fT5cbiAgICAgIHsgZ2VuZUlucHV0cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5BbGxlbGVGaWx0ZXJzVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzYWJsZWRBbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgb25GaWx0ZXJDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZUZpbHRlcnNWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEFsbGVsZVZpZXcgPSAoe2FsbGVsZSwgd2lkdGg9MjEsIHRhcmdldCwgY29sb3IsIHNoYXBlLCBob3ZlcmluZ30pID0+IHtcbiAgbGV0IHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICBzdHJva2UgPSB0YXJnZXQgPyBcIiMwMDAwMDBcIiA6IFwibm9uZVwiLFxuICAgICAgZmlsbCA9IGFsbGVsZSA/IGNvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgc3Ryb2tlV2lkdGggPSBob3ZlcmluZyA/IDMgOiAxLFxuICAgICAgc3Ryb2tlRGFzaGFycmF5PSBhbGxlbGUgPyBcIjBcIiA6IFwiMVwiLFxuICAgICAgc3ZnU2hhcGUgPSBudWxsO1xuXG4gIGlmIChzaGFwZSA9PT0gXCJjaXJjbGVcIikge1xuICAgIHN2Z1NoYXBlID0gPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMX0gY3g9e3JhZGl1cysxfSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfSBlbHNlIHtcbiAgICBzdmdTaGFwZSA9IDxyZWN0IHdpZHRoPXsocmFkaXVzKjIpfSBoZWlnaHQ9eyhyYWRpdXMqMil9IHg9XCIxXCIgeT1cIjFcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT17c3Ryb2tlfSBzdHJva2VEYXNoYXJyYXk9e3N0cm9rZURhc2hhcnJheX0gZmlsbD17ZmlsbH0vPjtcbiAgfVxuXG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aCsyfSBoZWlnaHQ9e3dpZHRoKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICB7IHN2Z1NoYXBlIH1cbiAgICAgICAgPHRleHQgeD17cmFkaXVzKzF9IHk9e3JhZGl1cys3fSB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZmlsbD1cIndoaXRlXCI+e2FsbGVsZX08L3RleHQ+XG4gICAgICA8L2c+XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5BbGxlbGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgYWxsZWxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgdGFyZ2V0OiBQcm9wVHlwZXMuYm9vbCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNoYXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBob3ZlcmluZzogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFsbGVsZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5pbXBvcnQgR2FtZXRlVmlldyBmcm9tICcuL2dhbWV0ZSc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZSB0aGF0IGFuaW1hdGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gdmlzaWJsZUdlbmVzIC0gZ2VuZXMgd2hpY2ggc2hvdWxkIGJlIHZpc2libGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbaW5pdGlhbERpc3BsYXldIC0gaW5pdGlhbCBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS54XSAtIGluaXRpYWwgbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueV0gLSBpbml0aWFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkuc2l6ZT0zMF0gLSBpbml0aWFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnJvdGF0aW9uPTBdIC0gaW5pdGlhbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5Lm9wYWNpdHk9MV0gLSBpbml0aWFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBmaW5hbCBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGZpbmFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gZmluYWwgbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gZmluYWwgc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIGZpbmFsIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gZmluYWwgb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2FuaW1TdGlmZm5lc3M9MTAwXSAtIHNwcmluZyBzdGlmZm5lc3MgdXNlZCB0byBjb250cm9sIGFuaW1hdGlvbiBzcGVlZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNTZWxlY3RlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdzZWxlY3RlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNEaXNhYmxlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdkaXNhYmxlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uQ2xpY2soZXZ0LCBpZCwgcmVjdCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGdhbWV0ZSBpcyBjbGlja2VkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25SZWN0KCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBhdCByZXN0XG4gKlxuICogTm90ZTogQXMgdGhpbmdzIHN0YW5kIGN1cnJlbnRseSwgdGhlcmUgaXMgX25vXyBwYXJ0aWN1bGFyIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgZGVmaW5lZFxuICogYnkgdGhpcyB2aWV3LiBUaGUgY2xpZW50IGNhbiBzdHlsZSB0aGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBieSBzdHlsaW5nIHRoZVxuICogJy5nZW5pYmxvY2tzLmdhbWV0ZScgY2xhc3MgaW4gQ1NTLCBlLmcuIGJ5IGFzc2lnbmluZyBhIGJhY2tncm91bmQtaW1hZ2UuXG4gKi9cbmNvbnN0IEFuaW1hdGVkR2FtZXRlVmlldyA9ICh7aWQsIGluaXRpYWxEaXNwbGF5LCBkaXNwbGF5LCBhbmltU3RpZmZuZXNzPTEwMCwgb25SZXN0LCAuLi5vdGhlcnN9KSA9PiB7XG5cbiAgY29uc3QgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBpbml0aWFsID0gaW5pdGlhbERpc3BsYXkgfHwgZGlzcGxheSxcbiAgICAgICAgaW5pdGlhbFNpemUgPSBpbml0aWFsLnNpemUgfHwgMzAsXG4gICAgICAgIGluaXRpYWxSb3RhdGlvbiA9IGluaXRpYWwucm90YXRpb24gIT0gbnVsbCA/IGluaXRpYWwucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWwub3BhY2l0eSAhPSBudWxsID8gaW5pdGlhbC5vcGFjaXR5IDogMS4wLFxuICAgICAgICBmaW5hbFNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIGZpbmFsUm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgZmluYWxPcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzIH07XG4gIHJldHVybiAoXG4gICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtZ2FtZXRlJ1xuICAgICAgICAgIGRlZmF1bHRTdHlsZT17e1xuICAgICAgICAgICAgeDogaW5pdGlhbC54LCB5OiBpbml0aWFsLnksIHNpemU6IGluaXRpYWxTaXplLFxuICAgICAgICAgICAgcm90YXRpb246IGluaXRpYWxSb3RhdGlvbiwgb3BhY2l0eTogaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICB4OiBzcHJpbmcoZGlzcGxheS54LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgeTogc3ByaW5nKGRpc3BsYXkueSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHNpemU6IHNwcmluZyhmaW5hbFNpemUsIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICByb3RhdGlvbjogc3ByaW5nKGZpbmFsUm90YXRpb24sIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICBvcGFjaXR5OiBzcHJpbmcoZmluYWxPcGFjaXR5LCBzcHJpbmdDb25maWcpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PlxuICAgICAgICAgIDxHYW1ldGVWaWV3IGlkPXtpZH0gZGlzcGxheT17aW50ZXJwb2xhdGVkU3R5bGV9IHsuLi5vdGhlcnN9IC8+XG4gICAgICB9XG4gICAgPC9Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZEdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgaW5pdGlhbERpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7IC8vIGluaXRpYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSksXG4gIGRpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7ICAgICAgICAvLyBmaW5hbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KS5pc1JlcXVpcmVkLFxuICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVkR2FtZXRlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbmNvbnN0IEFuaW1hdGVkT3JnYW5pc21WaWV3ID0gKHtvcmcsIGlkLCB3aWR0aD0yMDAsIHN0eWxlPXt9LCBpbml0aWFsT3BhY2l0eT0xLjAsIG9wYWNpdHk9MS4wLCBzdGlmZm5lc3M9NjAsIG9uUmVzdCwgb25DbGljayB9KSA9PiB7XG4gIGNvbnN0IG9wYWNpdHlTdGFydCA9IGluaXRpYWxPcGFjaXR5ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKG9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG9wYWNpdHkgOiAxLjApO1xuICBsZXQgICBvcGFjaXR5RW5kID0gb3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gb3BhY2l0eSA6IG9wYWNpdHlTdGFydDtcblxuICBpZiAob3BhY2l0eUVuZCAhPT0gb3BhY2l0eVN0YXJ0KVxuICAgIG9wYWNpdHlFbmQgPSBzcHJpbmcob3BhY2l0eUVuZCwgeyBzdGlmZm5lc3M6IHN0aWZmbmVzcyB9KTtcblxuICByZXR1cm4gKFxuICAgIDxNb3Rpb24gY2xhc3NOYW1lPSdnZW5pYmxvY2tzIGFuaW1hdGVkLW9yZ2FuaXNtLXZpZXcnXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tvcGFjaXR5OiBvcGFjaXR5U3RhcnR9fSBzdHlsZT17e29wYWNpdHk6IG9wYWNpdHlFbmR9fSBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgY29uc3QgdFN0eWxlID0geyAuLi5zdHlsZSwgLi4uaW50ZXJwb2xhdGVkU3R5bGUgfTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkfSB3aWR0aD17d2lkdGh9IHN0eWxlPXt0U3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIDwvTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRPcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgaW5pdGlhbE9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlcixcbiAgb25SZXN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVkT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBFZ2dWaWV3LCBFR0dfSU1BR0VfV0lEVEggfSBmcm9tICcuL2VnZy1jbHV0Y2gnO1xuXG5jb25zdCBFR0dfSU1BR0VfV0lEVEhfU01BTEwgPSBFR0dfSU1BR0VfV0lEVEggLyAzO1xuXG5jbGFzcyBCYXNrZXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJhc2tldDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgYWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgICBzZXg6IFByb3BUeXBlcy5udW1iZXJcbiAgICB9KSxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBlZ2dzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIGhhbmRsZUNsaWNrID0gKGV2dCkgPT4ge1xuICAgIGNvbnN0IHsgYmFza2V0LCBpbmRleCwgb25DbGljayB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAob25DbGljaylcbiAgICAgIG9uQ2xpY2soaW5kZXgsIGJhc2tldCk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgYmFza2V0LCBpZCwgZWdncywgaXNTZWxlY3RlZCB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBjbGFzc2VzID0gJ2Jhc2tldCcgKyAoaXNTZWxlY3RlZCA/ICcgc2VsZWN0ZWQnIDogJycpO1xuXG4gICAgZnVuY3Rpb24gZWdnc0RpdigpIHtcbiAgICAgIGlmICghZWdncyB8fCAhZWdncy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgICAgbGV0IGVnZ1ZpZXdzID0gZWdncy5tYXAoZnVuY3Rpb24oZWdnLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxFZ2dWaWV3IGVnZz17ZWdnfSBrZXk9e2BiYXNrZXQtZWdnLSR7aW5kZXh9YH0gaXNTZWxlY3RlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3R5bGU9e3tzaXplOiBFR0dfSU1BR0VfV0lEVEhfU01BTEx9fSAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWVnZ3MnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDMwLCB0b3A6IDEwLCB3aWR0aDogNzAgfX0+XG4gICAgICAgICAge2VnZ1ZpZXdzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSBpZD17aWR9IGtleT17aWR9IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWltYWdlJyByZWY9J2RvbU5vZGUnPjwvZGl2PlxuICAgICAgICB7ZWdnc0RpdigpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWxhYmVsIHVuc2VsZWN0YWJsZSc+e2Jhc2tldC5sYWJlbH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgQmFza2V0U2V0VmlldyA9ICh7YmFza2V0cywgaWRQcmVmaXg9J2Jhc2tldC0nLCBzZWxlY3RlZEluZGljZXM9W10sXG4gICAgICAgICAgICAgICAgICAgICAgICBlZ2dzLCBhbmltYXRpbmdFZ2dJbmRleCwgb25DbGlja30pID0+IHtcblxuICBsZXQgYmFza2V0Vmlld3MgPSBiYXNrZXRzLm1hcCgoYmFza2V0LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IGAke2lkUHJlZml4fSR7aW5kZXh9YCxcbiAgICAgICAgICAgICAgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kaWNlcy5pbmRleE9mKGluZGV4KSA+PSAwO1xuICAgICAgICBsZXQgZWdnSW5kaWNlcyA9IChiYXNrZXQgJiYgYmFza2V0LmVnZ3MpIHx8IFtdLFxuICAgICAgICAgICAgZGlzcGxheUVnZ3MgPSBbXTtcbiAgICAgICAgICAgIGVnZ0luZGljZXMuZm9yRWFjaCgoZWdnRHJha2VJbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlZ2dJbmRleCA9IGVnZ0RyYWtlSW5kZXg7XG4gICAgICAgICAgICAgIGlmIChlZ2dEcmFrZUluZGV4ID09PSBhbmltYXRpbmdFZ2dJbmRleCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoZWdncyAmJiBlZ2dzW2VnZ0luZGV4XSlcbiAgICAgICAgICAgICAgICBkaXNwbGF5RWdncy5wdXNoKGVnZ3NbZWdnSW5kZXhdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gPEJhc2tldFZpZXcgYmFza2V0PXtiYXNrZXR9IGlkPXtpZH0ga2V5PXtpZH0gaW5kZXg9e2luZGV4fSBlZ2dzPXtkaXNwbGF5RWdnc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+O1xuICAgICAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYmFza2V0LXNldFwiPlxuICAgICAgeyBiYXNrZXRWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5CYXNrZXRTZXRWaWV3LnByb3BUeXBlcyA9IHtcbiAgYmFza2V0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaWRQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNlbGVjdGVkSW5kaWNlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICBhbmltYXRpbmdFZ2dJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2tldFNldFZpZXc7XG4iLCIvKlxuICogVGhpcyBjb21wb25lbnQgaXMgYSB2ZXJ5IHRoaW4gd3JhcHBlciBhcm91bmQgYSBzdGFuZGFyZCBidXR0b24gZGVzaWduZWQgdG8gcHJldmVudFxuICogZXh0cmFuZW91cyBmb2N1cyBoaWdobGlnaHRpbmcgYWRkZWQgYnkgYnJvd3NlcnMgd2hlbiBjbGlja2luZyBvbiBhIGJ1dHRvbiB3aGlsZVxuICogbWFpbnRhaW5pbmcga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eS4gU2VlXG4gKiBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gKiBmb3IgZGV0YWlscy4gVGhlIHVwc2hvdCBpcyB0aGF0IHdlIHVzZSBtb3VzZSBldmVudHMgb24gdGhlIGJ1dHRvbiB0byBkaXNhYmxlIHRoZVxuICogZm9jdXMgaGlnaGxpZ2h0IC0tIG1vdXNpbmcvY2xpY2tpbmcgb24gYSBwdXNoIGJ1dHRvbiBzaG91bGQgbm90IGJlIHVzZWQgYXMgYW5cbiAqIGluY2lkYXRvciB0aGF0IHRoZSB1c2VyIHdvdWxkIGxpa2UgdG8ga2V5Ym9hcmQtaW50ZXJhY3Qgd2l0aCB0aGF0IGJ1dHRvbiwgd2hpY2hcbiAqIGlzIHdoYXQgZm9jdXNpbmcgYSBjbGlja2VkIGJ1dHRvbiBpbXBsaWVzLlxuICogSU1QT1JUQU5UOiBUbyBtYWludGFpbiBhY2Nlc3NpYmlsaXR5LCB0aGVyZSBtdXN0IGJlIGNvZGUgc29tZXdoZXJlIHRvIHJlZW5hYmxlXG4gKiB0aGUgZm9jdXMgaGlnaGxpZ2h0IHdoZW4gYXBwcm9wcmlhdGUuIFRoaXMgY2FuIGJlIGRvbmUgZm9yICdrZXlkb3duJyBieSBjYWxsaW5nXG4gKiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHRPbktleURvd24oKSBkdXJpbmcgYXBwbGljYXRpb24vcGFnZSBpbml0aWFsaXphdGlvbixcbiAqIG9yIGJ5IGFkZGluZyB5b3VyIG93biBldmVudCBoYW5kbGVyIHRoYXQgY2FsbHMgQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0KCkuXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHQgZnJvbSAnLi4vdXRpbGl0aWVzL3RyYW5zbGF0ZSc7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pXG4gIH1cblxuICAvLyBJbnN0YWxscyBhIGtleWRvd24gaGFuZGxlciBvbiB0aGUgZG9jdW1lbnQgd2hpY2ggd2lsbCBlbmFibGUgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZy5cbiAgLy8gU2hvdWxkIGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBpbml0aWFsaXphdGlvbi5cbiAgc3RhdGljIGVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSk7XG4gIH1cblxuICAvLyBFbmFibGVzIGJ1dHRvbiBmb2N1cyBoaWdobGlnaHRpbmc7IGRlc2lnbmVkIHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBrZXlkb3duIGhhbmRsZXIgYWJvdmVcbiAgLy8gYnV0IGF2YWlsYWJsZSBzZXBhcmF0ZWx5IGZvciBpbXBsZW1lbnRhdGlvbnMgdGhhdCByZXF1aXJlIGl0LlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYi1idXR0b24nKSxcbiAgICAgICAgICBjb3VudCA9IGJ1dHRvbnMubGVuZ3RoO1xuICAgIC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZUxpc3QjRXhhbXBsZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGlmIChidXR0b24gJiYgYnV0dG9uLmNsYXNzTmFtZSkge1xuICAgICAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTU5NTEvY2hhbmdlLWFuLWVsZW1lbnRzLWNsYXNzLXdpdGgtamF2YXNjcmlwdFxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC8oPzpefFxccyluby1mb2N1cy1oaWdobGlnaHQoPyFcXFMpL2cgLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcHJldmVudCBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodCBvbiBjbGljayB3aGlsZSBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5XG4gIC8vIHNlZSBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gIHN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm9Gb2N1c0hpZ2hsaWdodCA9ICduby1mb2N1cy1oaWdobGlnaHQnLFxuICAgICAgICAgIGJ1dHRvbiA9IHRoaXMucmVmcy5idXR0b247XG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lLmluZGV4T2Yobm9Gb2N1c0hpZ2hsaWdodCkgPCAwKVxuICAgICAgYnV0dG9uLmNsYXNzTmFtZSArPSAnICcgKyBub0ZvY3VzSGlnaGxpZ2h0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBsYWJlbCwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAoY2xhc3NOYW1lID8gY2xhc3NOYW1lICsgJyAnIDogJycpICsgJ2diLWJ1dHRvbic7XG5cbiAgICBjb25zdCBoYW5kbGVNb3VzZUV2ZW50ID0gKCkgPT4gdGhpcy5zdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2NsYXNzZXN9IHJlZj0nYnV0dG9uJyB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2hhbmRsZU1vdXNlRXZlbnR9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVNb3VzZUV2ZW50fT5cbiAgICAgICAge3QobGFiZWwpfVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5cbmNsYXNzIENoYWxsZW5nZUF3YXJkVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBjb2luUGFydHM6IFByb3BUeXBlcy5udW1iZXJcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICBjaGFsbGVuZ2VBd2FyZHM6IHtyb3V0ZVNwZWM6IHtcImxldmVsXCI6IDAsIFwibWlzc2lvblwiOjAsIFwiY2hhbGxlbmdlXCI6MH0sIFwiY2hhbGxlbmdlQ291bnRcIjowLCBcInByb2dyZXNzXCI6W119LFxuICAgICBzaXplOiAyNTYsXG4gICAgIGNvaW5QYXJ0czogM1xuICB9O1xuXG4gIGFkZEF3YXJkSW1hZ2UgPSAocHJvZ3Jlc3NJbWFnZXMsIHBpZWNlcywgcGllY2VOdW0sIHNjb3JlLCBwaWVjZVN0eWxlKSA9PiB7XG4gICAgbGV0IGF3YXJkTGV2ZWwgPSB0aGlzLmdldEF3YXJkU3R5bGUoc2NvcmUpO1xuICAgIGlmIChzY29yZSA+IC0xKXtcbiAgICAgIGxldCBwaWVjZU5hbWUgPSBgY29pbiBwaWVjZSBwaWVjZXMke3BpZWNlc30gcGllY2Uke3BpZWNlTnVtfSAke3BpZWNlU3R5bGV9ICR7YXdhcmRMZXZlbH1gO1xuICAgICAgcHJvZ3Jlc3NJbWFnZXMucHVzaCg8ZGl2IGtleT17cGllY2VOdW19IGNsYXNzTmFtZT17cGllY2VOYW1lfSAvPik7XG4gICAgfVxuICAgIHJldHVybiBwcm9ncmVzc0ltYWdlcztcbiAgfTtcblxuICBnZXRBd2FyZFN0eWxlID0gKHNjb3JlKSA9PiB7XG4gICAgbGV0IGF3YXJkTGV2ZWwgPSBcImdvbGRcIjtcbiAgICBpZiAoc2NvcmUgPT09IDEpIGF3YXJkTGV2ZWwgPSBcInNpbHZlclwiO1xuICAgIGlmIChzY29yZSA+PSAyKSBhd2FyZExldmVsID0gXCJicm9uemVcIjtcbiAgICByZXR1cm4gYXdhcmRMZXZlbDtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGxldmVsID0gMCwgbWlzc2lvbiA9IDAsIGNoYWxsZW5nZSA9IDAsIGNoYWxsZW5nZUNvdW50ID0gMCwgcHJvZ3Jlc3MgPSBbXSwgY2hhbGxlbmdlQmFja2dyb3VuZEltYWdlLCBwcm9ncmVzc0ltYWdlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYyAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYy5sZXZlbCxcbiAgICAgIG1pc3Npb24gPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5yb3V0ZVNwZWMubWlzc2lvbixcbiAgICAgIGNoYWxsZW5nZSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYy5jaGFsbGVuZ2UsXG4gICAgICBjaGFsbGVuZ2VDb3VudCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUNvdW50O1xuICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5wcm9ncmVzcztcbiAgICAgIGNoYWxsZW5nZUJhY2tncm91bmRJbWFnZSA9IDxkaXYgY2xhc3NOYW1lPVwiY29pbiBiYWNrZ3JvdW5kXCIgLz47XG4gICAgfSBlbHNlIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFwcm9ncmVzcyB8fCBwcm9ncmVzcyA9PT0gW10pXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGxldCBzaXplID0gdGhpcy5wcm9wcy5zaXplIHx8IDI1NjtcbiAgICBsZXQgc2l6ZVN0eWxlID0ge1xuICAgICAgd2lkdGg6IHNpemUgKyBcInB4XCIsXG4gICAgICBoZWlnaHQ6IHNpemUgKyBcInB4XCJcbiAgICB9O1xuXG4gICAgbGV0IHBpZWNlS2V5ID0gbGV2ZWwgKyBcIjpcIiArIG1pc3Npb24gKyBcIjpcIjtcbiAgICBsZXQgY2hhbGxlbmdlU2NvcmUgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbGxlbmdlQ291bnQ7IGkrKyl7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvZ3Jlc3Mpe1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgocGllY2VLZXkgKyBpKSl7XG4gICAgICAgICAgY29uc3Qgc2NvcmUgPSBwcm9ncmVzc1trZXldO1xuICAgICAgICAgIGlmIChjaGFsbGVuZ2VTY29yZVtpXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgY2hhbGxlbmdlU2NvcmVbaV0gPSBzY29yZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hhbGxlbmdlU2NvcmVbaV0gKz0gc2NvcmU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBwaWVjZU51bSA9IGNoYWxsZW5nZSArIDE7XG4gICAgbGV0IGN1cnJlbnRQaWVjZVN0eWxlID0gYGNvaW4gcGllY2UgcGllY2VzJHtjaGFsbGVuZ2VDb3VudH0gcGllY2Uke3BpZWNlTnVtfSBzaW5nbGUgJHt0aGlzLmdldEF3YXJkU3R5bGUoY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlXSl9YDtcblxuICAgIGZvciAodmFyIGNoYWxsZW5nZU51bSBpbiBjaGFsbGVuZ2VTY29yZSl7XG4gICAgICBwaWVjZU51bSA9IHBhcnNlSW50KGNoYWxsZW5nZU51bSkgKyAxO1xuICAgICAgcHJvZ3Jlc3NJbWFnZXMgPSB0aGlzLmFkZEF3YXJkSW1hZ2UocHJvZ3Jlc3NJbWFnZXMsIGNoYWxsZW5nZUNvdW50LCBwaWVjZU51bSwgY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlTnVtXSwgXCJ3aG9sZVwiKTtcbiAgICB9XG5cbiAgICBsZXQgc2luZ2xlUGllY2VPcGFjaXR5U3RhcnQgPSAxLCBzaW5nbGVQaWVjZU9wYWNpdHlFbmQgPSAwLCBzdHlsZSA9IHt9LCBvblJlc3Q7XG4gICAgc2luZ2xlUGllY2VPcGFjaXR5RW5kID0gc3ByaW5nKHNpbmdsZVBpZWNlT3BhY2l0eUVuZCwgeyBzdGlmZm5lc3M6IDMwLCBkYW1waW5nOjIwIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaGFsbGVuZ2UtYXdhcmRcIiBzdHlsZT17c2l6ZVN0eWxlfSA+XG4gICAgICAgIHtjaGFsbGVuZ2VCYWNrZ3JvdW5kSW1hZ2V9XG4gICAgICAgIHtwcm9ncmVzc0ltYWdlc31cbiAgICAgICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtY29pbi12aWV3J1xuICAgICAgICAgICAgZGVmYXVsdFN0eWxlPXt7b3BhY2l0eTogc2luZ2xlUGllY2VPcGFjaXR5U3RhcnR9fSBzdHlsZT17e29wYWNpdHk6IHNpbmdsZVBpZWNlT3BhY2l0eUVuZH19IG9uUmVzdD17b25SZXN0fSA+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0U3R5bGUgPSB7IC4uLnN0eWxlLCAuLi5pbnRlcnBvbGF0ZWRTdHlsZSB9O1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cGllY2VOdW19IHN0eWxlPXt0U3R5bGV9IGNsYXNzTmFtZT17Y3VycmVudFBpZWNlU3R5bGV9IC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICA8L01vdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhbGxlbmdlQXdhcmRWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIG1hbGUvZmVtYWxlIGNoYW5nZSBidXR0b25zXG4gKiBUaGUgYXBwZWFyYW5jZSBvZiB0aGUgYnV0dG9ucyBpcyBjdXJyZW50bHkgZW50aXJlbHkgY29udHJvbGxlZCB2aWEgZXh0ZXJuYWwgQ1NTLlxuICogQHBhcmFtIHtzdHJpbmd9IHNleCAtIFsnbWFsZScgfCAnZmVtYWxlJ10gY3VycmVudGx5IHNlbGVjdGVkIGJ1dHRvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25DaGFuZ2UoZXZ0LCBzZXgpIC0gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdXNlIGNsaWNrcyB0byBjaGFuZ2Ugc2V4XG4gKi9cbmNvbnN0IENoYW5nZVNleEJ1dHRvbnMgPSAoe2lkLCBzZXgsIHNwZWNpZXMsIHNob3dMYWJlbCwgc3R5bGU9e30sIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCBjYXBTZXggPSBzZXggPT09IEJpb0xvZ2ljYS5NQUxFID8gJ01hbGUnIDogJ0ZlbWFsZScsXG4gICAgICAgIHNlbGVjdGVkU2V4Q2xhc3MgPSBzZXggPT09IEJpb0xvZ2ljYS5NQUxFID8gJ21hbGUtc2VsZWN0ZWQnIDogJ2ZlbWFsZS1zZWxlY3RlZCcsXG4gICAgICAgIEJVVFRPTl9JTUFHRV9XSURUSCA9IDEwMCxcbiAgICAgICAgQlVUVE9OX0lNQUdFX01JRFBPSU5UX1ggPSBCVVRUT05fSU1BR0VfV0lEVEggLyAyLFxuICAgICAgICBpbWFnZVN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uc3R5bGUgfSxcbiAgICAgICAgbGFiZWwgPSBzaG93TGFiZWwgPyBgJHtjYXBTZXh9ICR7c3BlY2llc31gIDogJycsXG4gICAgICAgIGxhYmVsRWxlbWVudCA9IHNob3dMYWJlbCA/IDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IEJVVFRPTl9JTUFHRV9XSURUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTB9fT57bGFiZWx9PC9kaXY+IDogJyc7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0UmVjdCA9IGV2dC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgY2xpY2tYID0gZXZ0LmNsaWVudFggLSBlbHRSZWN0LmxlZnQ7XG5cbiAgICBpZiAoc2V4ID09PSBCaW9Mb2dpY2EuRkVNQUxFICYmIGNsaWNrWCA+IEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YKXsgLy8gdXNlciBjbGlja2VkIG9uIFJpZ2h0IChtYWxlKSBpY29uIHdoaWxlIGZlbWFsZSB3YXMgc2VsZWN0ZWRcbiAgICAgIG9uQ2hhbmdlKEJpb0xvZ2ljYS5NQUxFKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2V4ID09PSBCaW9Mb2dpY2EuTUFMRSAmJiBjbGlja1ggPCBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCl7IC8vIHVzZXIgY2xpY2tlZCBvbiBMZWZ0IChmZW1hbGUpIGljb24gd2hpbGUgbWFsZSB3YXMgc2VsZWN0ZWRcbiAgICAgIG9uQ2hhbmdlKEJpb0xvZ2ljYS5GRU1BTEUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxkaXYgIGNsYXNzTmFtZT17YGdlbmlibG9ja3MgY2hhbmdlLXNleC1idXR0b25zICR7c2VsZWN0ZWRTZXhDbGFzc31gfVxuICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSA+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtsYWJlbEVsZW1lbnR9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaGFuZ2VTZXhCdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNleDogUHJvcFR5cGVzLm9uZU9mKFtCaW9Mb2dpY2EuTUFMRSwgQmlvTG9naWNhLkZFTUFMRV0pLFxuICBzcGVjaWVzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaG93TGFiZWw6IFByb3BUeXBlcy5ib29sLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVNleEJ1dHRvbnM7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIG5vcm1hbDoge1xuICAgIHdpZHRoOiAyMyxcbiAgICBoZWlnaHQ6IDEyMCxcbiAgICBzcGxpdDogNDVcbiAgfSxcbiAgc21hbGw6IHtcbiAgICB3aWR0aDogMTksXG4gICAgaGVpZ2h0OiA5MCxcbiAgICBzcGxpdDogMzRcbiAgfVxufTtcblxuY29uc3QgZGVmYXVsdHNZID0ge1xuICBub3JtYWw6IHtcbiAgICB3aWR0aDogMjMsXG4gICAgaGVpZ2h0OiA3NSxcbiAgICBzcGxpdDogMzhcbiAgfSxcbiAgc21hbGw6IHtcbiAgICB3aWR0aDogMTksXG4gICAgaGVpZ2h0OiA2MixcbiAgICBzcGxpdDogMzJcbiAgfVxufTtcblxuY29uc3QgQ2hyb21vc29tZUltYWdlVmlldyA9ICh7d2lkdGgsIGhlaWdodCwgc3BsaXQ9NDUsIGNvbG9yPScjRkY5OTk5Jywgc21hbGw9ZmFsc2UsIGJvbGQ9ZmFsc2UsIGVtcHR5PWZhbHNlLCB5Q2hyb21vc29tZT1mYWxzZSwgYW5pbWF0aW9uU3R5bGluZ30pID0+IHtcbiAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KSB7XG4gICAgbGV0IGRlZmF1bHREaW1zID0geUNocm9tb3NvbWUgPyBkZWZhdWx0c1kgOiBkZWZhdWx0cztcbiAgICAoe3dpZHRoLCBoZWlnaHQsIHNwbGl0fSA9IHNtYWxsID8gZGVmYXVsdERpbXMuc21hbGwgOiBkZWZhdWx0RGltcy5ub3JtYWwpO1xuICB9XG5cbiAgY29uc3QgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICAgIGhhbGZJbWFnZVdpZHRoID0gaW1hZ2VXaWR0aC8yLFxuICAgICAgICBpbWFnZUhlaWdodCA9IGhlaWdodCs0O1xuXG4gIGxldCBzdHJva2VXaWR0aCA9IHdpZHRoIDwgMTAgPyAxIDogMjtcblxuICBpZiAoYm9sZCkge1xuICAgIGNvbG9yID0gJyNGRjY2NjYnO1xuICAgIHN0cm9rZVdpZHRoID0gMztcbiAgfVxuICBpZiAoZW1wdHkpIHtcbiAgICBjb2xvciA9ICcjRkZGJztcbiAgICBzdHJva2VXaWR0aCA9IDE7XG4gIH1cbiAgbGV0IHBvc2l0aW9uU3R5bGluZyA9IHt9O1xuICBpZiAoYW5pbWF0aW9uU3R5bGluZyl7XG4gICAgcG9zaXRpb25TdHlsaW5nID0ge1xuICAgICAgcG9zaXRpb246ICdmaXhlZCcsIGxlZnQ6IGFuaW1hdGlvblN0eWxpbmcueCwgdG9wOiBhbmltYXRpb25TdHlsaW5nLnksIG9wYWNpdHk6IGFuaW1hdGlvblN0eWxpbmcub3BhY2l0eVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNocm9tb3NvbWUtaW1hZ2VcIiBzdHlsZT17cG9zaXRpb25TdHlsaW5nfT5cbiAgICAgIDxzdmcgd2lkdGg9e2ltYWdlV2lkdGh9IGhlaWdodD17aW1hZ2VIZWlnaHR9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGc+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMn0gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdCtyYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e2hlaWdodC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8cmVjdCBoZWlnaHQ9e01hdGgubWF4KDAsIChzcGxpdC1yYWRpdXMpLShyYWRpdXMrMikpfSB3aWR0aD17d2lkdGh9IHk9e3JhZGl1cysyfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD17TWF0aC5tYXgoMCwgKGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZUltYWdlVmlldy5wcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNwbGl0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc21hbGw6IFByb3BUeXBlcy5ib29sLFxuICBib2xkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZW1wdHk6IFByb3BUeXBlcy5ib29sLFxuICB5Q2hyb21vc29tZTogUHJvcFR5cGVzLmJvb2wsXG4gIGFuaW1hdGlvblN0eWxpbmc6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgICAgICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuaW1wb3J0IEZWR2VuZUxhYmVsVmlldyBmcm9tICcuLi9mdi1jb21wb25lbnRzL2Z2LWdlbmUtbGFiZWwnO1xuaW1wb3J0IEFsbGVsZVZpZXcgZnJvbSAnLi9hbGxlbGUnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcbi8qKlxuICogVmlldyBvZiBhIHNpbmdsZSBjaHJvbW9zb21lLCB3aXRoIG9wdGlvbmFsIGxhYmVscywgcHVsbGRvd25zLCBhbmQgZW1iZWRkZWQgYWxsZWxlcy5cbiAqXG4gKiBEZWZpbmVkIEVJVEhFUiB1c2luZyBhIEJpb2xvZ2ljYSBDaHJvbW9zb21lIG9iamVjdCwgT1Igd2l0aCBhIEJpb2xvZ2ljYSBvcmdhbmlzbSxcbiAqIGNocm9tb3NvbWUgbmFtZSBhbmQgc2lkZS5cbiAqL1xuXG5jb25zdCBDaHJvbW9zb21lVmlldyA9ICh7Y2hyb21vc29tZSwgb3JnLCBDaHJvbW9zb21lSW1hZ2VDbGFzcz1DaHJvbW9zb21lSW1hZ2VWaWV3LCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgdXNlckNoYW5nZWFibGVHZW5lcyA9IFtdLCB2aXNpYmxlR2VuZXMgPSBbXSwgaGlkZGVuQWxsZWxlcyA9IFtdLCBzbWFsbCA9IGZhbHNlLCBlZGl0YWJsZSA9IHRydWUsIHNlbGVjdGVkID0gZmFsc2UsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZCwgc2hvd0xhYmVscyA9IHRydWUsIHNob3dBbGxlbGVzID0gZmFsc2UsIGxhYmVsc09uUmlnaHQgPSB0cnVlLCBvcmdOYW1lLCBwYXJlbnRHZW5vbWUsIGhlaWdodCwgZGlzcGxheVN0eWxlID0ge319KSA9PiB7XG5cbiAgdmFyIGNvbnRhaW5lckNsYXNzID0gXCJpdGVtc1wiLFxuICAgICAgZW1wdHkgPSBmYWxzZSxcbiAgICAgIHlDaHJvbW9zb21lID0gZmFsc2UsXG4gICAgICB4Q2hyb21vc29tZSA9IGZhbHNlLFxuICAgICAgbGFiZWxzQ29udGFpbmVyLCBhbGxlbGVzQ29udGFpbmVyLCBjaHJvbUlkO1xuXG4gIGlmIChvcmcgJiYgY2hyb21vc29tZU5hbWUgJiYgc2lkZSkge1xuICAgIGNocm9tb3NvbWUgPSBvcmcuZ2V0R2Vub3R5cGUoKS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV1bc2lkZV07XG4gIH1cblxuICBpZiAoY2hyb21vc29tZSkge1xuICAgIGxldCBhbGxlbGVzID0gY2hyb21vc29tZS5hbGxlbGVzLFxuICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuZmlsdGVyVmlzaWJsZUFsbGVsZXMoYWxsZWxlcywgdXNlckNoYW5nZWFibGVHZW5lcywgdmlzaWJsZUdlbmVzLCBjaHJvbW9zb21lLnNwZWNpZXMpO1xuXG4gICAgaWYgKHNob3dMYWJlbHMpIHtcbiAgICAgIGxldCBsYWJlbHMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIGlmIChDaHJvbW9zb21lSW1hZ2VDbGFzcyA9PT0gQ2hyb21vc29tZUltYWdlVmlldykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2EuYWxsZWxlfSBzcGVjaWVzPXtjaHJvbW9zb21lLnNwZWNpZXN9IGFsbGVsZT17YS5hbGxlbGV9IGVkaXRhYmxlPXtlZGl0YWJsZSAmJiBhLmVkaXRhYmxlfVxuICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17IGhpZGRlbkFsbGVsZXMgfVxuICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlKGEuYWxsZWxlLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgfX0vPlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHNlbGVjdGVkICYmIHBhcmVudEdlbm9tZSA/IG51bGwgOiA8RlZHZW5lTGFiZWxWaWV3IGNocm9tb3NvbWVOYW1lPXtjaHJvbW9zb21lTmFtZX0gY2hyb21vc29tZUhlaWdodD17aGVpZ2h0fSBhbGxlbGU9e2EuYWxsZWxlfSBzcGVjaWVzPXtjaHJvbW9zb21lLnNwZWNpZXN9IC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsZXQgc3RyaXBlcyA9IGFsbGVsZXMubWFwKGEgPT4ge1xuICAgICAgICBpZiAoQ2hyb21vc29tZUltYWdlQ2xhc3MgIT09IENocm9tb3NvbWVJbWFnZVZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgc2VsZWN0ZWQgJiYgcGFyZW50R2Vub21lID8gbnVsbCA6IDxGVkdlbmVMYWJlbFZpZXcgc3RyaXBlPXt0cnVlfSBjaHJvbW9zb21lTmFtZT17Y2hyb21vc29tZU5hbWV9IGNocm9tb3NvbWVIZWlnaHQ9e2hlaWdodH0gYWxsZWxlPXthfSBzcGVjaWVzPXtjaHJvbW9zb21lLnNwZWNpZXN9IC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsYWJlbHMgPSBsYWJlbHMuY29uY2F0KHN0cmlwZXMpO1xuXG4gICAgICBsYWJlbHNDb250YWluZXIgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxzXCI+XG4gICAgICAgICAgeyBsYWJlbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG5cbiAgICAgIGlmICghbGFiZWxzT25SaWdodCkge1xuICAgICAgICBjb250YWluZXJDbGFzcyArPSBcIiBydGxcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRhaW5lckNsYXNzICs9IFwiIGx0bFwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG93QWxsZWxlcykge1xuICAgICAgbGV0IGFsbGVsZVN5bWJvbHMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEFsbGVsZVZpZXcga2V5PXthLmFsbGVsZX0gYWxsZWxlPXthLmFsbGVsZX0gLz5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBhbGxlbGVzQ29udGFpbmVyID0gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFsbGVsZXNcIj5cbiAgICAgICAgICB7IGFsbGVsZVN5bWJvbHMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGNocm9tb3NvbWUuc2lkZSA9PT0gXCJ5XCIpIHtcbiAgICAgIHlDaHJvbW9zb21lID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGNocm9tb3NvbWUuc2lkZS5pbmRleE9mKFwieFwiKSA+IC0xKSB7XG4gICAgICB4Q2hyb21vc29tZSA9IHRydWU7XG4gICAgfVxuXG4gICAgY2hyb21JZCA9IG9yZ05hbWUgKyBjaHJvbW9zb21lLmNocm9tb3NvbWUgKyBjaHJvbW9zb21lLnNpZGU7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21JZCA9IG9yZ05hbWU7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9XG4gIGNvbnN0IGhhbmRsZVNlbGVjdCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChvbkNocm9tb3NvbWVTZWxlY3RlZCkge1xuICAgICAgb25DaHJvbW9zb21lU2VsZWN0ZWQoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLWNvbnRhaW5lclwiIG9uQ2xpY2s9eyBoYW5kbGVTZWxlY3QgfSA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNvbnRhaW5lckNsYXNzIH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hyb21vc29tZS1hbGxlbGUtY29udGFpbmVyXCIgaWQ9e2Nocm9tSWR9IHN0eWxlPXtkaXNwbGF5U3R5bGV9PlxuICAgICAgICAgIDxDaHJvbW9zb21lSW1hZ2VDbGFzcyBzbWFsbD17c21hbGx9IGVtcHR5PXtlbXB0eX0gYm9sZD17c2VsZWN0ZWR9IHlDaHJvbW9zb21lPXt5Q2hyb21vc29tZX0geENocm9tb3NvbWU9e3hDaHJvbW9zb21lfS8+XG4gICAgICAgICAgeyBhbGxlbGVzQ29udGFpbmVyIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsgbGFiZWxzQ29udGFpbmVyIH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBDaHJvbW9zb21lSW1hZ2VDbGFzczogUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgY2hyb21vc29tZU5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNpZGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNocm9tb3NvbWU6IFByb3BUeXBlcy5vYmplY3QsXG4gIHVzZXJDaGFuZ2VhYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgc21hbGw6IFByb3BUeXBlcy5ib29sLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHNlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0xhYmVsczogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dBbGxlbGVzOiBQcm9wVHlwZXMuYm9vbCxcbiAgbGFiZWxzT25SaWdodDogUHJvcFR5cGVzLmJvb2wsXG4gIGRpc3BsYXlTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNocm9tb3NvbWVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIHBhcmVudEdlbm9tZTogUHJvcFR5cGVzLmJvb2wsXG4gIG9yZ05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBVc2VzIGFuIFNWRyBjaXJjdWxhciBncmFkaWVudCB0byBpbXBsZW1lbnQgYSBmYWRpbmcgZ2xvdyBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIlxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgZGlhbWV0ZXIgb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBzdHlsZXMgYXBwbGllZCB0byB0aGUgb3V0ZXIgZGl2XG4gKi9cbmNvbnN0IENpcmN1bGFyR2xvd1ZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgc3R5bGV9KSA9PiB7XG4gIGxldCByYWRpdXMgPSBzaXplLzIsXG4gICAgICBjb2xvck5vSGFzaCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBncmFkaWVudElEID0gYENpcmN1bGFyR2xvd1ZpZXdfJHtpZCB8fCBjb2xvck5vSGFzaH1gLFxuICAgICAgZ3JhZGllbnRJRFVybCA9IGB1cmwoIyR7Z3JhZGllbnRJRH0pYDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaXJjdWxhci1nbG93XCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPXtncmFkaWVudElEfT5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIxLjBcIi8+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjBcIi8+XG4gICAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8Y2lyY2xlIGZpbGw9e2dyYWRpZW50SURVcmx9IGN4PXtyYWRpdXN9IGN5PXtyYWRpdXN9IHI9e3JhZGl1c30gLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2lyY3VsYXJHbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8vIGltYWdlIHNwZWNpZmllZCBhcyBDU1MgYmFja2dyb3VuZC1pbWFnZSwgYnV0IHNpemUgY29uc3RhbnRzIHJlcXVpcmVkIGluIEphdmFTY3JpcHRcbmV4cG9ydCBjb25zdCAgRUdHX0lNQUdFX1dJRFRIID0gNzUsXG4gICAgICAgICAgICAgIEVHR19JTUFHRV9IRUlHSFQgPSAxMDk7XG5cbmV4cG9ydCBjbGFzcyBFZ2dWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVnZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNwbGF5U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBoYW5kbGVDbGljayA9IChldnQpID0+IHtcbiAgICBjb25zdCB7IGVnZywgaWQsIGluZGV4LCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhpZCwgaW5kZXgsIGVnZyk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZWdnLCBpZCwgZGlzcGxheVN0eWxlLCBpc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGVnZ1N0eWxlID0gT2JqZWN0LmFzc2lnbih7IGZsZXhTaHJpbms6IDAgfSwgZGlzcGxheVN0eWxlKSxcbiAgICAgICAgICBpc0hpZGRlbiA9IChlZ2cgPT0gbnVsbCksXG4gICAgICAgICAgY2xhc3NlcyA9ICdjbHV0Y2gtZWdnJyArIChpc1NlbGVjdGVkID8gJyBzZWxlY3RlZCcgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKGlzSGlkZGVuID8gJyBoaWRkZW4nIDogJycpO1xuICAgIGlmIChkaXNwbGF5U3R5bGUgJiYgKGRpc3BsYXlTdHlsZS5zaXplICE9IG51bGwpKSB7XG4gICAgICBlZ2dTdHlsZS53aWR0aCA9IGRpc3BsYXlTdHlsZS5zaXplO1xuICAgICAgZWdnU3R5bGUuaGVpZ2h0ID0gZWdnU3R5bGUud2lkdGggKiAoRUdHX0lNQUdFX0hFSUdIVCAvIEVHR19JTUFHRV9XSURUSCk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtjbGFzc2VzfSBrZXk9e2lkfSByZWY9J2RvbU5vZGUnIHN0eWxlPXtlZ2dTdHlsZX0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30gLz5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IEVnZ0NsdXRjaFZpZXcgPSAoe2VnZ3MsIGlkUHJlZml4PSdlZ2ctJywgc2VsZWN0ZWRJbmRleCwgb25DbGlja30pID0+IHtcblxuICBjb25zdCBPRERfRUdHX01BUkdJTiA9IDgsXG4gICAgICAgIEVWRU5fRUdHX01BUkdJTiA9IDA7XG4gIGxldCBvcmdWaWV3cztcblxuICBmdW5jdGlvbiBlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgbWFyZ2luKSB7XG4gICAgY29uc3QgaWQgPSBgJHtpZFByZWZpeH0ke2luZGV4fWAsXG4gICAgICAgICAgdmlzaWJpbGl0eVN0eWxlID0gZWdnICYmIChlZ2cuYmFza2V0ID09IG51bGwpID8ge30gOiB7IHZpc2liaWxpdHk6ICdoaWRkZW4nIH0sXG4gICAgICAgICAgZWdnU3R5bGUgPSBPYmplY3QuYXNzaWduKHsgbWFyZ2luTGVmdDogbWFyZ2luLCBtYXJnaW5SaWdodDogbWFyZ2luIH0sIHZpc2liaWxpdHlTdHlsZSk7XG4gICAgcmV0dXJuIDxFZ2dWaWV3IGVnZz17ZWdnfSBpZD17aWR9IGtleT17aWR9IGluZGV4PXtpbmRleH0gZGlzcGxheVN0eWxlPXtlZ2dTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggPT09IHNlbGVjdGVkSW5kZXh9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+O1xuICB9XG5cbiAgLy8gZXZlbiBudW1iZXIgb2YgZWdnc1xuICBpZiAoZWdncy5sZW5ndGggJSAyID09PSAwKSB7XG4gICAgb3JnVmlld3MgPSBlZ2dzLnJlZHVjZSgocHJldiwgZWdnLCBpbmRleCkgPT4ge1xuICAgICAgLy8gZm9yIGZsZXggbGF5b3V0IHB1cnBvc2VzLCB3aXRoIG9kZCBudW1iZXJzIG9mIGl0ZW1zXG4gICAgICAvLyB3ZSBhZGQgc3BhY2VyIGl0ZW1zIGJldHdlZW4gdGhlIGVnZ3NcbiAgICAgIGNvbnN0IHNwYWNlcklEID0gYCR7aWRQcmVmaXh9JHtpbmRleH0tc3BhY2VyYCxcbiAgICAgICAgICAgIHNwYWNlclN0eWxlID0geyBtYXJnaW5MZWZ0OiBFVkVOX0VHR19NQVJHSU4sIG1hcmdpblJpZ2h0OiBFVkVOX0VHR19NQVJHSU4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicgfSxcbiAgICAgICAgICAgIHNwYWNlciA9IDxFZ2dWaWV3IGVnZz17bnVsbH0ga2V5PXtzcGFjZXJJRH0gZGlzcGxheVN0eWxlPXtzcGFjZXJTdHlsZX0gLz47XG4gICAgICBpZiAoaW5kZXggPCBlZ2dzLmxlbmd0aC8yKVxuICAgICAgICBwcmV2LnB1c2goc3BhY2VyKTtcbiAgICAgIHByZXYucHVzaChlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgRVZFTl9FR0dfTUFSR0lOKSk7XG4gICAgICBpZiAoaW5kZXggPj0gZWdncy5sZW5ndGgvMilcbiAgICAgICAgcHJldi5wdXNoKHNwYWNlcik7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9LCBbXSk7XG4gICAgLy9vcmdWaWV3cyA9IGVnZ3MubWFwKChlZ2csIGluZGV4KSA9PiBlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgRVZFTl9FR0dfTUFSR0lOKSk7XG4gIH1cblxuICBlbHNlIHtcbiAgICBvcmdWaWV3cyA9IGVnZ3MucmVkdWNlKChwcmV2LCBlZ2csIGluZGV4KSA9PiB7XG4gICAgICBwcmV2LnB1c2goZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIE9ERF9FR0dfTUFSR0lOKSk7XG4gICAgICAvLyBmb3IgZmxleCBsYXlvdXQgcHVycG9zZXMsIHdpdGggb2RkIG51bWJlcnMgb2YgaXRlbXNcbiAgICAgIC8vIHdlIGFkZCBzcGFjZXIgaXRlbXMgYmV0d2VlbiB0aGUgZWdnc1xuICAgICAgY29uc3Qgc3BhY2VySUQgPSBgJHtpZFByZWZpeH0ke2luZGV4fS1zcGFjZXJgLFxuICAgICAgICAgICAgc3BhY2VyU3R5bGUgPSB7IG1hcmdpbkxlZnQ6IE9ERF9FR0dfTUFSR0lOLCBtYXJnaW5SaWdodDogT0REX0VHR19NQVJHSU4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicgfTtcbiAgICAgIHByZXYucHVzaCg8RWdnVmlldyBlZ2c9e251bGx9IGtleT17c3BhY2VySUR9IGRpc3BsYXlTdHlsZT17c3BhY2VyU3R5bGV9IC8+KTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGVnZy1jbHV0Y2hcIj5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuRWdnQ2x1dGNoVmlldy5wcm9wVHlwZXMgPSB7XG4gIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWdnQ2x1dGNoVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgYSByZWN0YW5ndWxhciB0ZXh0IGFyZWEgZm9yIHByb3ZpZGluZyBmZWVkYmFjayB0byB1c2Vycywgc3VjaCBhc1xuICogdGhhdCB1c2VkIGluIEdlbml2ZXJzZSdzIGNoYWxsZW5nZXMgZm9yIHByb3ZpZGluZyB0cmlhbCBhbmQgZ29hbCBmZWVkYmFjay5cbiAqIEltcGxlbWVudGVkIGFzIGEgUmVhY3Qgc3RhdGVsZXNzIGZ1bmN0aW9uYWwgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSB0ZXh0IC0gYSBzaW5nbGUgb3IgbXVsdGlwbGUgbGluZXMgb2YgdGV4dCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBpbmxpbmUgc3R5bGVzIGFwcGxpZWQgdG8gdGhlIDxkaXY+IGNvbnRhaW5pbmcgZWFjaCBsaW5lIG9mIHRleHRcbiAqL1xuY29uc3QgRmVlZGJhY2tWaWV3ID0gKHt0ZXh0LCBzdHlsZT17fX0pID0+IHtcbiAgY29uc3QgdFRleHQgPSBBcnJheS5pc0FycmF5KHRleHQpID8gdGV4dCA6IFt0ZXh0XSxcbiAgICAgICAgbGluZUNvdW50ID0gdFRleHQubGVuZ3RoLFxuICAgICAgICBoZWlnaHQgPSAyMCAqIGxpbmVDb3VudCArIDIsXG4gICAgICAgIGRlZmF1bHRTdHlsZSA9IHsgaGVpZ2h0OiBoZWlnaHQsIC4uLnN0eWxlIH0sXG4gICAgICAgIHRleHRMaW5lcyA9IHRUZXh0Lm1hcCgoaVRleHQsIGluZGV4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjayB0ZXh0LWxpbmVcIiBrZXk9e2luZGV4fT57aVRleHR9PC9kaXY+KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjay12aWV3XCIgc3R5bGU9e2RlZmF1bHRTdHlsZX0+XG4gICAgICB7dGV4dExpbmVzfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuRmVlZGJhY2tWaWV3LnByb3BUeXBlcyA9IHtcbiAgdGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICAgICAgICBdKS5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmVlZGJhY2tWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgSU5JVElBTF9HQU1FVEVfU0laRSA9IDMwLFxuICAgICAgRklOQUxfR0FNRVRFX1NJWkUgPSAxNDAsXG4gICAgICBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCA9IDAsXG4gICAgICBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDE1MCxcbiAgICAgIEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCA9IDcwLFxuICAgICAgRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YID0gODAsXG4gICAgICBGSU5BTF9aWUdPVEVfWSA9IC0xNTA7XG5cbmV4cG9ydCBjb25zdCBHQU1FVEVfVFlQRSA9IHsgTU9USEVSOiAnbW90aGVyJywgRkFUSEVSOiAnZmF0aGVyJyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdHlwZTogUHJvcFR5cGVzLm9uZU9mKFsgR0FNRVRFX1RZUEUuTU9USEVSLCBHQU1FVEVfVFlQRS5GQVRIRVIgXSkuaXNSZXF1aXJlZCxcbiAgICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGZlcnRpbGl6YXRpb25TdGF0ZTogUHJvcFR5cGVzLm9uZU9mKFsnbm9uZScsICdmZXJ0aWxpemluZycsICdmZXJ0aWxpemVkJywgJ2NvbXBsZXRlJ10pLmlzUmVxdWlyZWQsXG4gICAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBzcmNSZWN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBkc3RSZWN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gICAgb25SZXN0OiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB2aXNpYmxlR2VuZXM6IFtdLFxuICAgIGFuaW1TdGlmZm5lc3M6IDEwMFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIgPSAoKSA9PiB7XG4gICAgbGV0IHtnYW1ldGUsIGlkLCB2aXNpYmxlR2VuZXMsIGFuaW1TdGlmZm5lc3MsIG9uUmVzdH0gPSB0aGlzLnByb3BzLFxuICAgICAgICB4T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LmxlZnQgLSB0aGlzLnByb3BzLmRzdFJlY3QubGVmdCA6IDAsXG4gICAgICAgIHlPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QudG9wIC0gdGhpcy5wcm9wcy5kc3RSZWN0LnRvcCA6IDAsXG4gICAgICAgIHhSZXN0aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogUkVTVElOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIHhGZXJ0aWxpemluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gRkVSVElMSVpJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICBpbml0aWFsLCB0RmluYWw7XG5cbiAgICBpZiAoIWdhbWV0ZSB8fCAoaWQgPT0gbnVsbCkpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnByb3BzLmZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ25vbmUnKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIpXG4gICAgICAgIHhPZmZzZXQgKz0gUkVTVElOR19GQVRIRVJfR0FNRVRFX1g7XG4gICAgICBpbml0aWFsID0geyB4OiB4T2Zmc2V0LCB5OiB5T2Zmc2V0LCBzaXplOiBJTklUSUFMX0dBTUVURV9TSVpFIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSB9O1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnByb3BzLmZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ2ZlcnRpbGl6aW5nJykge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiBGSU5BTF9aWUdPVEVfWSwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAwLjAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2lkfSB2aXNpYmxlR2VuZXM9e3Zpc2libGVHZW5lc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e2luaXRpYWx9IGRpc3BsYXk9e3RGaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc30gb25SZXN0PXtvblJlc3R9IC8+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgR2FtZXRlUG9vbFZpZXcgPSAoe2dhbWV0ZXMsIHZpc2libGVHZW5lcz1bXSwgd2lkdGg9MzAwLCBoZWlnaHQ9MjAwLCBhbmltU3RpZmZuZXNzPTYwLCBzZWxlY3RlZElkLCBpc0dhbWV0ZURpc2FibGVkLCBvbkdhbWV0ZVNlbGVjdGVkfSkgPT4ge1xuICBsZXQgZ2FtZXRlQ291bnQgPSBnYW1ldGVzLmxlbmd0aCxcbiAgICAgIGdhbWV0ZVNpemUgPSAzMCxcbiAgICAgIG1hcmdpbiA9IDUsXG4gICAgICBzcGFjaW5nRGVmYXVsdCA9IGdhbWV0ZVNpemUgKyAyICogbWFyZ2luLFxuICAgICAgeFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHlTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICBjb2xEZWZhdWx0ID0gTWF0aC5mbG9vcih3aWR0aCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIHJvd0RlZmF1bHQgPSBNYXRoLmZsb29yKGhlaWdodCAvIHNwYWNpbmdEZWZhdWx0KSxcbiAgICAgIGVuYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkRmxhZ3MgPSBpc0dhbWV0ZURpc2FibGVkID8gZ2FtZXRlcy5tYXAoZyA9PiBpc0dhbWV0ZURpc2FibGVkKGcpKSA6IFtdLFxuICAgICAgdG90YWxEaXNhYmxlZENvdW50ID0gZGlzYWJsZWRGbGFncy5yZWR1Y2UoKHRvdGFsLGZsYWcpID0+IHRvdGFsICsgZmxhZywgMCksXG4gICAgICAvLyBsZWF2ZSByb29tIGZvciB0aGUgZGlzYWJsZWQgZ2FtZXRlIHJvdyBpZiB0aGVyZSBhcmUgZGlzYWJsZWQgZ2FtZXRlc1xuICAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gaGVpZ2h0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA/IHNwYWNpbmdEZWZhdWx0IDogMCkgLSA0ICogbWFyZ2luLFxuICAgICAgLy8gcGFjayB0aGUgZGlzYWJsZWQgZ2FtZXRlcyBpbnRvIHRoZSBkaXNhYmxlZCByb3dcbiAgICAgIHhEaXNhYmxlZFNwYWNpbmcgPSBNYXRoLm1pbih4U3BhY2luZyAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpZHRoIC0gNyAqIG1hcmdpbikgLyB0b3RhbERpc2FibGVkQ291bnQpLFxuICAgICAgeURpc2FibGVkU3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgdG90YWxFbmFibGVkQ291bnQgPSBnYW1ldGVDb3VudCAtIHRvdGFsRGlzYWJsZWRDb3VudCxcbiAgICAgIGdhbWV0ZVZpZXdzO1xuXG4gIC8vIHNxdWVlemUgaW4gdG8gbWFrZSByb29tIGZvciBhZGRpdGlvbmFsIGdhbWV0ZXMgaWYgbmVjZXNzYXJ5XG4gIHZhciBjb2xDb3VudCA9IGNvbERlZmF1bHQsXG4gICAgICByb3dDb3VudCA9IHJvd0RlZmF1bHQgLSAodG90YWxEaXNhYmxlZENvdW50ID4gMCk7XG4gIHdoaWxlIChjb2xDb3VudCAqIHJvd0NvdW50IDwgdG90YWxFbmFibGVkQ291bnQpIHtcbiAgICBpZiAoeVNwYWNpbmcgPiB4U3BhY2luZykge1xuICAgICAgeVNwYWNpbmcgPSBhdmFpbGFibGVIZWlnaHQgLyArK3Jvd0NvdW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHhTcGFjaW5nID0gKHdpZHRoIC0gNCAqIG1hcmdpbikgLyArK2NvbENvdW50O1xuICAgIH1cbiAgfVxuXG4gIGdhbWV0ZVZpZXdzID0gZ2FtZXRlcy5tYXAoKGdhbWV0ZSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gZGlzYWJsZWRGbGFnc1tpbmRleF0sXG4gICAgICAgICAgbGF5b3V0SW5kZXggPSBpc0Rpc2FibGVkID8gZGlzYWJsZWRDb3VudCsrIDogZW5hYmxlZENvdW50KyssXG4gICAgICAgICAgcm93ID0gaXNEaXNhYmxlZCA/IHJvd0RlZmF1bHQgLSAxIDogTWF0aC5mbG9vcihsYXlvdXRJbmRleCAvIGNvbENvdW50KSxcbiAgICAgICAgICBjb2wgPSBpc0Rpc2FibGVkID8gbGF5b3V0SW5kZXggOiBsYXlvdXRJbmRleCAlIGNvbENvdW50LFxuICAgICAgICAgIHkgPSBpc0Rpc2FibGVkID8gcm93ICogeURpc2FibGVkU3BhY2luZyA6IHJvdyAqIHlTcGFjaW5nLFxuICAgICAgICAgIHggPSBpc0Rpc2FibGVkID8gY29sICogeERpc2FibGVkU3BhY2luZyA6IGNvbCAqIHhTcGFjaW5nO1xuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aW5kZXggKyAxfSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlR2VuZXM9e3Zpc2libGVHZW5lc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh3aWR0aC8yKSwgeTogLU1hdGgucm91bmQoeVNwYWNpbmcpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpbmRleCArIDEgPT09IHNlbGVjdGVkSWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uR2FtZXRlU2VsZWN0ZWR9IC8+XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2FtZXRlLXBvb2xcIiBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH19PlxuICAgICAgeyBnYW1ldGVWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVQb29sVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIHZpc2libGVHZW5lczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNlbGVjdGVkSWQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzR2FtZXRlRGlzYWJsZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvbkdhbWV0ZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlUG9vbFZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHZW5ldGljc1V0aWxzIGZyb20gJy4uL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnYW1ldGUgLSBCaW9sb2dpY2EgZ2FtZXRlIChtYXAgb2YgY2hyb21vc29tZSBuYW1lcyB0byBjaHJvbW9zb21lcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1ldGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IHZpc2libGVHZW5lcyAtIGdlbmVzIHdoaWNoIHNob3VsZCBiZSB2aXNpYmxlXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5jb25zdCBHYW1ldGVWaWV3ID0gKHtnYW1ldGUsIGlkLCB2aXNpYmxlR2VuZXM9W10sIGRpc3BsYXksIGlzU2VsZWN0ZWQ9ZmFsc2UsIGlzRGlzYWJsZWQ9ZmFsc2UsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICByZWN0ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICghaXNEaXNhYmxlZCAmJiBvbkNsaWNrKSB7XG4gICAgICBvbkNsaWNrKGV2dCwgaWQsIHJlY3QpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpIHtcbiAgICBsZXQgdG9vbHRpcCA9IFwiXCI7XG5cbiAgICBmb3IgKGNvbnN0IGNoIGluIGdhbWV0ZSkge1xuICAgICAgdmFyIGNocm9tb3NvbWUgPSBnYW1ldGVbY2hdLFxuICAgICAgICAgIHZpc2libGVBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5maWx0ZXJWaXNpYmxlQWxsZWxlcyhjaHJvbW9zb21lLmFsbGVsZXMsIFtdLCB2aXNpYmxlR2VuZXMsIGNocm9tb3NvbWUuc3BlY2llcyk7XG4gICAgICBmb3IgKGNvbnN0IGFsbGVsZSBvZiB2aXNpYmxlQWxsZWxlcykge1xuICAgICAgICBjb25zdCBsYWJlbCA9IGNocm9tb3NvbWUuc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGUuYWxsZWxlXTtcbiAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgbGFiZWw7XG4gICAgICB9XG4gICAgICBpZiAoY2ggPT09ICdYWScpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjaHJvbW9zb21lLnNpZGUgPT09ICd5JyA/ICd5JyA6ICd4JztcbiAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b29sdGlwO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWRDbGFzcyA9IGlzU2VsZWN0ZWQgJiYgIWlzRGlzYWJsZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwiLFxuICAgICAgICBkaXNhYmxlZENsYXNzID0gaXNEaXNhYmxlZCA/IFwiZGlzYWJsZWRcIiA6IFwiXCIsXG4gICAgICAgIGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgY2xhc3NlcyA9IGBnZW5pYmxvY2tzIGdhbWV0ZSAke3NlbGVjdGVkQ2xhc3N9ICR7ZGlzYWJsZWRDbGFzc30gZ3JvdXAke2dyb3VwfWAsXG4gICAgICAgIHNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIHJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIHRyYW5zZm9ybSA9IHJvdGF0aW9uID8gYHJvdGF0ZSgke3JvdGF0aW9ufWRlZylgIDogJycsXG4gICAgICAgIG9wYWNpdHkgPSBkaXNwbGF5Lm9wYWNpdHkgIT0gbnVsbCA/IGRpc3BsYXkub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgdG9vbHRpcCA9IGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB0aXRsZT17dG9vbHRpcH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgbGVmdDogZGlzcGxheS54LCB0b3A6IGRpc3BsYXkueSxcbiAgICAgICAgICAgIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICB0cmFuc2Zvcm0sIG9wYWNpdHlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgZGlzcGxheTogUHJvcFR5cGVzLnNoYXBlKHsgICAgICAgIC8vIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLmlzUmVxdWlyZWQsXG4gIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgR2VuZUxhYmVsVmlldyA9ICh7c3BlY2llcywgYWxsZWxlLCBlZGl0YWJsZT1mYWxzZSwgaGlkZGVuQWxsZWxlcz1bXSwgb25BbGxlbGVDaGFuZ2V9KSA9PiB7XG4gIGlmICghZWRpdGFibGUpIHtcbiAgICBjb25zdCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2VuZS1sYWJlbCBhbGxlbGUgbm9uZWRpdGFibGVcIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgeyBhbGxlbGVOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhbGxlbGVzID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpLmFsbGVsZXMsXG4gICAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBhbGxlbGVzLmZpbHRlcihhID0+IGhpZGRlbkFsbGVsZXMuaW5kZXhPZihhKSA9PT0gLTEpLFxuICAgICAgICAgIGFsbGVsZU5hbWVzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgYWxsZWxlT3B0aW9ucyA9IGFsbGVsZU5hbWVzLm1hcCgobmFtZSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtuYW1lfSB2YWx1ZT17dmlzaWJsZUFsbGVsZXNbaV19PntuYW1lfTwvb3B0aW9uPilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbmUtbGFiZWwgYWxsZWxlIGVkaXRhYmxlXCI+XG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBhbGxlbGUgfSBvbkNoYW5nZT17IG9uQWxsZWxlQ2hhbmdlIH0+XG4gICAgICAgICAgeyBhbGxlbGVPcHRpb25zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5HZW5lTGFiZWxWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBhbGxlbGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZWRpdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENocm9tb3NvbWVJbWFnZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lLWltYWdlJztcblxubGV0IFRlc3RQdWxsZG93blZpZXcgPSAoe3NwZWNpZXMsIGdlbmUsIHNlbGVjdGlvbiwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gICAgICBsZXQgYWxsZWxlcyA9IGdlbmUuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgbnVtQWxsZWxlcyA9IGFsbGVsZU5hbWVzLmxlbmd0aCxcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcyA9IFtdLFxuICAgICAgICAgIGN1cnJlbnRTZWxlY3Rpb24gPSBzZWxlY3Rpb24gfHwgXCJwbGFjZWhvbGRlclwiLFxuICAgICAgICAgIGksIGo7XG5cbiAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9XCJwbGFjZWhvbGRlclwiIHZhbHVlPVwicGxhY2Vob2xkZXJcIiBkaXNhYmxlZD1cImRpc2FibGVkXCI+U2VsZWN0IGEgR2Vub3R5cGU8L29wdGlvbj4pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtQWxsZWxlczsgaSsrKSB7XG4gICAgICAgIGZvciAoaiA9IGk7IGogPCBudW1BbGxlbGVzOyBqKyspIHtcbiAgICAgICAgICBsZXQga2V5ID0gaSArIFwiIFwiICsgaixcbiAgICAgICAgICAgICAgc3RyaW5nID0gYWxsZWxlTmFtZXNbaV0gKyBcIiAvIFwiICsgYWxsZWxlTmFtZXNbal07XG4gICAgICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT17a2V5fSB2YWx1ZT17a2V5fT57c3RyaW5nfTwvb3B0aW9uPik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Qtd3JhcHBlclwiPlxuICAgICAgICAgIDxzZWxlY3QgdmFsdWU9eyBjdXJyZW50U2VsZWN0aW9uIH0gb25DaGFuZ2U9eyBvblNlbGVjdGlvbkNoYW5nZSB9PlxuICAgICAgICAgICAgeyBwb3NzaWJsZUNvbWJvcyB9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9O1xuXG5jb25zdCBHZW5vbWVUZXN0VmlldyA9ICh7b3JnLCB1c2VyQ2hhbmdlYWJsZUdlbmVzPVtdLCBzZWxlY3Rpb249e30sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW10sXG4gICAgICBhbGxWaXNpYmxlID0gdXNlckNoYW5nZWFibGVHZW5lcy5sZW5ndGggPT09IDA7XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIGFsbGVsZXMgPSBjaHJvbVtPYmplY3Qua2V5cyhjaHJvbSlbMF1dLmFsbGVsZXMsXG4gICAgICAgIGdlbmVzID0gYWxsZWxlcy5tYXAoYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKG9yZy5zcGVjaWVzLCBhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZyA9PiBhbGxWaXNpYmxlIHx8IHVzZXJDaGFuZ2VhYmxlR2VuZXMuaW5kZXhPZihnLm5hbWUpID4gLTEpLFxuICAgICAgICBwdWxsZG93bnMgPSBnZW5lcy5tYXAoZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXN0UHVsbGRvd25WaWV3XG4gICAgICAgICAgICAgIGtleSAgICAgICA9IHsgZy5uYW1lIH1cbiAgICAgICAgICAgICAgc3BlY2llcyAgID0geyBvcmcuc3BlY2llcyB9XG4gICAgICAgICAgICAgIGdlbmUgICAgICA9IHsgZyB9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbiA9IHsgc2VsZWN0aW9uW2cubmFtZV0gfVxuICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZSA9IHsgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICB9IH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIiBrZXk9e2Nocm9tb3NvbWVOYW1lfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5vbWUtdGVzdC1vcHRpb25zXCI+XG4gICAgICAgICAgeyBwdWxsZG93bnMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lLXRlc3RcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblRlc3RQdWxsZG93blZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGdlbmU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgc2VsZWN0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuR2Vub21lVGVzdFZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdXNlckNoYW5nZWFibGVHZW5lczogUHJvcFR5cGVzLmFycmF5LFxuICBzZWxlY3Rpb246IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVUZXN0VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENocm9tb3NvbWVWaWV3IGZyb20gJy4vY2hyb21vc29tZSc7XG5cbi8qKlxuICogVmlldyBvZiB0aGUgc2V0IG9mIGNocm9tb3NvbWVzIG9mIGFuIG9yZ2FuaXNtLCBvcmRlcmVkIGFzIG1hdGNoZWQgcGFpcnMuXG4gKlxuICogVXN1YWxseSBkZWZpbmVkIGJ5IHBhc3NpbmcgaW4gYSBCaW9sb2dpY2EgT3JnYW5pc20sIGJ1dCBtYXkgYWxzbyBiZSBkZWZpbmVkIGJ5XG4gKiBwYXNzaW5nIGluIGEgbWFwIG9mIEJpb2xvZ2ljYSBDaHJvbW9zb21lcyBhbmQgYSBCaW9sb2dpY2EgU3BlY2llcy5cbiAqL1xuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBjbGFzc05hbWU9XCJcIiwgQ2hyb21vc29tZUltYWdlQ2xhc3MsIGNocm9tb3NvbWVzLCBzcGVjaWVzLCB1c2VyQ2hhbmdlYWJsZUdlbmVzPVtdLCB2aXNpYmxlR2VuZXM9W10sIGhpZGRlbkFsbGVsZXM9W10sIGVkaXRhYmxlPXRydWUsIHNob3dMYWJlbHM9dHJ1ZSwgc2hvd0FsbGVsZXM9ZmFsc2UsIHNlbGVjdGVkQ2hyb21vc29tZXM9e30sIHNtYWxsPWZhbHNlLCBvcmdOYW1lLCBkaXNwbGF5U3R5bGUsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZCwgY2hyb21vc29tZUhlaWdodCwgcGFyZW50R2Vub21lPWZhbHNlfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGlmIChvcmcpIHtcbiAgICBjaHJvbW9zb21lcyA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lcztcbiAgICBzcGVjaWVzID0gb3JnLnNwZWNpZXM7XG4gIH1cbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBjaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgbGV0IGNocm9tb3NvbWUgPSBjaHJvbVtzaWRlXTtcbiAgICAgIHBhaXJzLnB1c2goXG4gICAgICAgIDxDaHJvbW9zb21lVmlld1xuICAgICAgICAgIENocm9tb3NvbWVJbWFnZUNsYXNzPXtDaHJvbW9zb21lSW1hZ2VDbGFzc31cbiAgICAgICAgICBjaHJvbW9zb21lPXtjaHJvbW9zb21lfVxuICAgICAgICAgIGNocm9tb3NvbWVOYW1lPXtjaHJvbW9zb21lTmFtZX1cbiAgICAgICAgICBrZXk9e3BhaXJzLmxlbmd0aCArIDF9XG4gICAgICAgICAgdXNlckNoYW5nZWFibGVHZW5lcz17dXNlckNoYW5nZWFibGVHZW5lc31cbiAgICAgICAgICB2aXNpYmxlR2VuZXM9e3Zpc2libGVHZW5lc31cbiAgICAgICAgICBoaWRkZW5BbGxlbGVzPXtoaWRkZW5BbGxlbGVzfVxuICAgICAgICAgIGxhYmVsc09uUmlnaHQ9e3BhaXJzLmxlbmd0aD4wIHx8IHNpZGU9PT1cImJcIn1cbiAgICAgICAgICBlZGl0YWJsZT17ZWRpdGFibGV9XG4gICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkQ2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdID09PSBzaWRlfVxuICAgICAgICAgIHNob3dMYWJlbHM9e3Nob3dMYWJlbHN9XG4gICAgICAgICAgc2hvd0FsbGVsZXM9e3Nob3dBbGxlbGVzfVxuICAgICAgICAgIHNtYWxsPXtzbWFsbH1cbiAgICAgICAgICBvcmdOYW1lPXtvcmdOYW1lfVxuICAgICAgICAgIGRpc3BsYXlTdHlsZT17ZGlzcGxheVN0eWxlfVxuICAgICAgICAgIHBhcmVudEdlbm9tZT17cGFyZW50R2Vub21lfVxuICAgICAgICAgIGhlaWdodD17Y2hyb21vc29tZUhlaWdodH1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24ocHJldkFsbGVsZSwgbmV3QWxsZWxlKSB7XG4gICAgICAgICAgICBvbkFsbGVsZUNoYW5nZShjaHJvbW9zb21lTmFtZSwgc2lkZSwgcHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkPXtmdW5jdGlvbihlbCl7XG4gICAgICAgICAgICBpZiAob25DaHJvbW9zb21lU2VsZWN0ZWQpXG4gICAgICAgICAgICAgIG9uQ2hyb21vc29tZVNlbGVjdGVkKG9yZywgY2hyb21vc29tZU5hbWUsIHNpZGUsIGVsKTtcbiAgICAgICAgICB9fS8+XG4gICAgICApO1xuICAgIH1cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaHJvbW9zb21lLXBhaXJcIiBrZXk9e3BhaXJXcmFwcGVycy5sZW5ndGggKyAxfT5cbiAgICAgICAgeyBwYWlycyB9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4gIGNvbnN0IGNsYXNzZXMgPSBcImdlbmlibG9ja3MgZ2Vub21lXCIgKyAoY2xhc3NOYW1lID8gXCIgXCIgKyBjbGFzc05hbWUgOiBcIlwiKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIENocm9tb3NvbWVJbWFnZUNsYXNzOiBQcm9wVHlwZXMuZnVuYyxcbiAgY2hyb21vc29tZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHVzZXJDaGFuZ2VhYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dMYWJlbHM6IFByb3BUeXBlcy5ib29sLFxuICBzaG93QWxsZWxlczogUHJvcFR5cGVzLmJvb2wsXG4gIHNlbGVjdGVkQ2hyb21vc29tZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIHNtYWxsOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2hyb21vc29tZUhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkNocm9tb3NvbWVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZ05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHBhcmVudEdlbm9tZTogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaXJjdWxhckdsb3dWaWV3IGZyb20gJy4vY2lyY3VsYXItZ2xvdyc7XG5cbmNvbnN0IEdsb3dCYWNrZ3JvdW5kVmlldyA9ICh7aWQsIGNvbG9yLCBzaXplLCBjb250YWluZXJTdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCBDaGlsZENvbXBvbmVudCwgY2hpbGRTdHlsZT17fSwgLi4ub3RoZXJzfSkgPT4ge1xuICBjb25zdCB0Q29udGFpbmVyU3R5bGUgPSB7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLCAuLi5jb250YWluZXJTdHlsZSB9LFxuICAgICAgICB0R2xvd1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uZ2xvd1N0eWxlIH0sXG4gICAgICAgIHRDaGlsZFN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uY2hpbGRTdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdsb3ctYmFja2dyb3VuZFwiIHN0eWxlPXt0Q29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgaWQ9eydnbG93LScraWR9IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e3RHbG93U3R5bGV9Lz5cbiAgICAgIDxDaGlsZENvbXBvbmVudCBpZD17J2NoaWxkLScraWR9IHN0eWxlPXt0Q2hpbGRTdHlsZX0gd2lkdGg9e3NpemV9IHsuLi5vdGhlcnN9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HbG93QmFja2dyb3VuZFZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGNvbnRhaW5lclN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBnbG93U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIENoaWxkQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBjaGlsZFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbG93QmFja2dyb3VuZFZpZXc7XG4iLCIvKlxuICogQmFzZWQgb24gUmVhY3RPdmVybGF5cyBkZW1vIGF0IGh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL3JlYWN0LW92ZXJsYXlzL2V4YW1wbGVzLyNtb2RhbHNcbiAqL1xuaW1wb3J0IE1vZGFsIGZyb20gJ3JlYWN0LW92ZXJsYXlzL2xpYi9Nb2RhbCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCBDaGFsbGVuZ2VBd2FyZFZpZXcgZnJvbSAnLi9jaGFsbGVuZ2UtYXdhcmQnO1xuaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0IGZyb20gJy4uL3V0aWxpdGllcy90cmFuc2xhdGUnO1xuXG5jb25zdCBtb2RhbFN0eWxlID0ge1xuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiAxMDQwLFxuICB0b3A6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDBcbn07XG5cbmNvbnN0IGJhY2tkcm9wU3R5bGUgPSB7XG4gIC4uLm1vZGFsU3R5bGUsXG4gIHpJbmRleDogJ2F1dG8nLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJyxcbiAgb3BhY2l0eTogMC4xXG59O1xuXG5jb25zdCBkaWFsb2dTdHlsZSA9IGZ1bmN0aW9uKHRvcD1cIjUwJVwiKSB7XG4gIC8vIHdlIHVzZSBzb21lIHBzZXVkbyByYW5kb20gY29vcmRzIHNvIG5lc3RlZCBtb2RhbHNcbiAgLy8gZG9uJ3Qgc2l0IHJpZ2h0IG9uIHRvcCBvZiBlYWNoIG90aGVyLlxuICBsZXQgbGVmdCA9IDUwO1xuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAzODUsXG4gICAgdG9wOiB0b3AsIGxlZnQ6IGxlZnQgKyAnJScsXG4gICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC0ke2xlZnR9JSlgLFxuICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChyZXNvdXJjZXMvaW1hZ2VzL3BhcmNobWVudC5qcGcpJyxcbiAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcbiAgICBiYWNrZ3JvdW5kT3JpZ2luOiAnYm9yZGVyLWJveCcsXG4gICAgYm94U2hhZG93OiAnMCAxMHB4IDVweCByZ2JhKDAsMCwwLC41KScsXG4gICAgcGFkZGluZ0JvdHRvbTogJzE1cHgnLFxuICAgIHBhZGRpbmdMZWZ0OiAnMTVweCcsXG4gICAgb3V0bGluZTogJ25vbmUnXG4gIH07XG59O1xuXG5cbmNsYXNzIE1vZGFsQWxlcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2hvdzogUHJvcFR5cGVzLmJvb2wsXG4gICAgbWVzc2FnZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSksXG4gICAgZXhwbGFuYXRpb246IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgIGxlZnRCdXR0b246IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmFycmF5XSksXG4gICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0pLFxuICAgIHJpZ2h0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICBvbkhpZGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uTGVmdEJ1dHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIG9wdGlvbmFsIGNsaWNrIGhhbmRsZXJzIGlmIG5vdCBkZWZpbmVkXG4gICAgb25SaWdodEJ1dHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgLy8gaW4gYnV0dG9uIHByb3BzLiAoQmV0dGVyIGZvciBgbWFwRGlzcGF0Y2hUb1Byb3BzYClcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdG9wOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNob3c6IGZhbHNlLFxuICAgIGNoYWxsZW5nZUF3YXJkczogeyBpZDowLCBwcm9ncmVzczogW10gfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8qIGVzbGludCByZWFjdC9qc3gtaGFuZGxlci1uYW1lczogMCAqL1xuICAgIGNvbnN0IGxlZnRQcm9wcyA9IHRoaXMucHJvcHMubGVmdEJ1dHRvbiB8fCB7fSxcbiAgICAgICAgICBsZWZ0QnV0dG9uID0gbGVmdFByb3BzLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxCdXR0b24gbGFiZWw9e2xlZnRQcm9wcy5sYWJlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFsZXJ0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17bGVmdFByb3BzLm9uQ2xpY2sgfHwgdGhpcy5wcm9wcy5vbkxlZnRCdXR0b25DbGlja30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgIHJpZ2h0UHJvcHMgPSB0aGlzLnByb3BzLnJpZ2h0QnV0dG9uIHx8IHt9LFxuICAgICAgICAgIHJpZ2h0QnV0dG9uID0gPEJ1dHRvbiBsYWJlbD17cmlnaHRQcm9wcy5sYWJlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhbGVydC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtyaWdodFByb3BzLm9uQ2xpY2sgfHwgdGhpcy5wcm9wcy5vblJpZ2h0QnV0dG9uQ2xpY2t9Lz47XG4gICAgdmFyIGF3YXJkVmlldywgZXhwbGFuYXRpb25WaWV3O1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzKXtcbiAgICAgIGF3YXJkVmlldyA9IDxDaGFsbGVuZ2VBd2FyZFZpZXcgY2hhbGxlbmdlQXdhcmRzPXt0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkc30gLz47XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLmV4cGxhbmF0aW9uKSB7XG4gICAgICBleHBsYW5hdGlvblZpZXcgPSA8cD57dCh0aGlzLnByb3BzLmV4cGxhbmF0aW9uKX08L3A+O1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPE1vZGFsICBhcmlhLWxhYmVsbGVkYnk9J21vZGFsLWxhYmVsJ1xuICAgICAgICAgICAgICBzdHlsZT17bW9kYWxTdHlsZX1cbiAgICAgICAgICAgICAgYmFja2Ryb3BTdHlsZT17YmFja2Ryb3BTdHlsZX1cbiAgICAgICAgICAgICAgc2hvdz17dGhpcy5wcm9wcy5zaG93fVxuICAgICAgICAgICAgICBvbkhpZGU9e3RoaXMucHJvcHMub25IaWRlfSA+XG4gICAgICAgIDxkaXYgc3R5bGU9e2RpYWxvZ1N0eWxlKHRoaXMucHJvcHMudG9wKX0gPlxuICAgICAgICAgIDxoNCBpZD0nbW9kYWwtbGFiZWwnPnt0KHRoaXMucHJvcHMubWVzc2FnZSl9PC9oND5cbiAgICAgICAgICB7YXdhcmRWaWV3fVxuICAgICAgICAgIHtleHBsYW5hdGlvblZpZXd9XG4gICAgICAgICAge2xlZnRCdXR0b259IHtyaWdodEJ1dHRvbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L01vZGFsPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kYWxBbGVydDtcblxuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG4vKipcbiAqIFByZXNlbnRzIGVpdGhlciBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBvciBhIHNpbXBsZSBudW1iZXIgd2l0aGluIGEgc3F1YXJlIGJvcmRlci5cbiAqIERlc2lnbmVkIHRvIGJlIHVzZWQgYXMgdHJpYWwgZmVlZGJhY2sgaW5kaWNhdGluZyB0aGUgbnVtYmVyIG9mIHRyaWFscyBzdWNjZXNzZnVsbHlcbiAqIGNvbXBsZXRlZCwgZm9yIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIGEgdW5pcXVlIGlkIGZvciBDU1MgcHVycG9zZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWUgLSBDU1MgY2xhc3MgdG8gYmUgYXBwbGllZFxuICogQHBhcmFtIHtudW1iZXJ9IG9yZGluYWwgLSB0aGUgbnVtZXJpYyB2YWx1ZSB0byBiZSByZXByZXNlbnRlZCBpZiBubyBvcmdhbmlzbSBzcGVjaWZpZWRcbiAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSBvcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdmlld1xuICovXG5jb25zdCBPcmRpbmFsT3JnYW5pc21WaWV3ID0gKHtpZCwgY2xhc3NOYW1lLCBvcmRpbmFsLCBvcmdhbmlzbSwgc2l6ZT0zMiwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0geyB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplIH0sXG4gICAgICAgIG9yZ1ZpZXcgPSBvcmdhbmlzbSAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgID8gPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gb3JnPXtvcmdhbmlzbX0gd2lkdGg9e3NpemV9IHsuLi5vdGhlcn0gLz5cbiAgICAgICAgICAgICAgICAgICAgOiA8ZGl2IGNsYXNzTmFtZT0nb3JkaW5hbCc+XG4gICAgICAgICAgICAgICAgICAgICAgICB7b3JkaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj47XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmRpbmFsLW9yZ2FuaXNtICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICB7IG9yZ1ZpZXcgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JkaW5hbE9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9yZGluYWw6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9yZ2FuaXNtOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmRpbmFsT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQmlvTG9naWNhIG9yZ2FuaXNtIGFzIGFuIGltYWdlIG9uIHRvcCBvZiBhIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQuXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gb3JnIC0gdGhlIG9yZ2FuaXNtIHRvIGJlIHJlcHJlc2VudGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB0aGUgY29sb3Igb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQgdmlldy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gKi9cbmNvbnN0IE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2lkPSdvcmctZ2xvdycsIGNsYXNzTmFtZT0nJywgY29sb3I9XCIjRkZGRkFBXCIsIHNpemU9MjAwLCBzdHlsZT17fSwgZ2xvd1N0eWxlPXt9LCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBsb2NhbEdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmdsb3dTdHlsZSB9LFxuICAgICAgICBvcmdTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLnN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmdhbmlzbS1nbG93ICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17YCR7aWR9LWdsb3dgfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtsb2NhbEdsb3dTdHlsZX0vPlxuICAgICAgPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gd2lkdGg9e3NpemV9IHN0eWxlPXtvcmdTdHlsZX0gey4uLm90aGVyfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2xvd1N0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgY2xhc3NOYW1lPVwiXCIsIHdpZHRoPTIwMCwgZmxpcHBlZD1mYWxzZSwgc3R5bGU9e30sIG9uQ2xpY2ssIHdyYXBwZXIgfSkgPT4ge1xuICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL2dlbml2ZXJzZS1yZXNvdXJjZXMuY29uY29yZC5vcmcvcmVzb3VyY2VzL2RyYWtlcy9pbWFnZXMvXCIsXG4gICAgICAgIHVybCAgICAgPSBvcmcgPyBiYXNlVXJsICsgb3JnLmdldEltYWdlTmFtZSgpIDogbnVsbCxcbiAgICAgICAgLy8gVGhlIGdvYWwgaGVyZSB3YXMgdG8gaGF2ZSB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBzZWxlY3QgdGhlIG9yZ2FuaXNtLFxuICAgICAgICAvLyBzbyB0aGF0IG1vdXNlZG93bi1kcmFnIHdpbGwgYm90aCBzZWxlY3QgdGhlIG9yZ2FuaXNtIGFuZCBiZWdpbiB0aGVcbiAgICAgICAgLy8gZHJhZy4gVGhpcyB3b3JrcyBvbiBDaHJvbWUgYW5kIFNhZmFyaSwgYnV0IG9uIEZpcmVmb3ggaXQgZGlzYWJsZXNcbiAgICAgICAgLy8gZHJhZ2dpbmcuIERpc2FibGluZyB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBtZWFucyB0aGF0IEZpcmVmb3ggdXNlcnNcbiAgICAgICAgLy8gbXVzdCBjbGljayB0byBzZWxlY3QgYW5kIHRoZW4gY2xpY2sgdG8gZHJhZywgYnV0IGF0IGxlYXN0IHRoZXkgY2FuXG4gICAgICAgIC8vIGRyYWcuIFRoZSByaWdodCBzb2x1dGlvbiBpcyBwcm9iYWJseSB0byBhbGxvdyBvcmdhbmlzbXMgdG8gYmUgZHJhZ2dlZFxuICAgICAgICAvLyB3aGV0aGVyIG9yIG5vdCB0aGV5J3JlIHNlbGVjdGVkIGFuZCB0aGVuIGhvcGVmdWxseSB0aGUgb25Nb3VzZURvd25cbiAgICAgICAgLy8gaGFuZGxlciB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQuIE90aGVyd2lzZSwgaXQgbWF5IGJlIG5lY2Vzc2FyeSB0b1xuICAgICAgICAvLyBzZWxlY3QgdGhlIG9yZ2FuaXNtIChpZiBpdCBpc24ndCBhbHJlYWR5IHNlbGVjdGVkKSBpbiBiZWdpbkRyYWcuXG4gICAgICAgIGlzRmlyZWZveCA9IChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID49IDApLFxuICAgICAgICBoYW5kbGVNb3VzZURvd24gPSBpc0ZpcmVmb3ggPyB1bmRlZmluZWQgOiBoYW5kbGVDbGljayxcbiAgICAgICAgZGl2V3JhcHBlciA9IHdyYXBwZXIgfHwgZnVuY3Rpb24oZWx0KSB7IHJldHVybiBlbHQ7IH07XG5cbiAgbGV0IGNsYXNzZXMgPSBcImdlbmlibG9ja3Mgb3JnYW5pc21cIiArIChjbGFzc05hbWUgPyBcIiBcIiArIGNsYXNzTmFtZSA6IFwiXCIpO1xuICBpZiAoZmxpcHBlZCkge1xuICAgIGNsYXNzZXMgKz0gXCIgZmxpcHBlZFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaWQsIG9yZyk7XG4gIH1cblxuICByZXR1cm4gZGl2V3JhcHBlcihcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gaWQ9e2lkfSBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgb25Nb3VzZURvd249e29uQ2xpY2sgPyBoYW5kbGVNb3VzZURvd24gOiBudWxsfVxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2sgPyBoYW5kbGVDbGljayA6IG51bGx9PlxuICAgICAge3VybCA/IDxpbWcgc3JjPXt1cmx9IHdpZHRoPXt3aWR0aH0gLz4gOiBudWxsfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIHdyYXBwZXI6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQZW5WaWV3IGZyb20gJy4vcGVuJztcbmltcG9ydCBTdGF0c1ZpZXcgZnJvbSAnLi9zdGF0cyc7XG5pbXBvcnQgVGFicyBmcm9tICdyZWFjdC1zaW1wbGV0YWJzJztcblxuY2xhc3MgUGVuU3RhdHNWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgb3JncywgbGFzdENsdXRjaFNpemUsIHNlbGVjdGVkSW5kZXgsIG9uU2VsZWN0aW9uQ2hhbmdlLCAuLi5vdGhlcnMgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgbGFzdENsdXRjaCA9IG9yZ3Muc2xpY2UoLWxhc3RDbHV0Y2hTaXplKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8VGFicz5cbiAgICAgICAgPFRhYnMuUGFuZWwgdGl0bGU9XCJCcmVlZGluZyBQZW5cIiBrZXk9XCJCcmVlZGluZyBQZW5cIj5cbiAgICAgICAgICA8UGVuVmlldyBvcmdzPXtsYXN0Q2x1dGNofSB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleD17c2VsZWN0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Z1bmN0aW9uKGlTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvblNlbGVjdGlvbkNoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShpU2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L1RhYnMuUGFuZWw+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiU3RhdHNcIiBrZXk9XCJTdGF0c1wiPlxuICAgICAgICAgIDxTdGF0c1ZpZXcgb3Jncz17b3Jnc30gbGFzdENsdXRjaFNpemU9e2xhc3RDbHV0Y2hTaXplfSAvPlxuICAgICAgICA8L1RhYnMuUGFuZWw+XG4gICAgICA8L1RhYnM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQZW5TdGF0c1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHJvd3MgLSBPcHRpb24gbnVtYmVyIG9mIHJvd3MuIElmIGRlZmluZWQsIGl0IHdpbGwgYmUgZml4ZWQgYXQgdGhhdC4gT3RoZXJ3aXNlLCBpdFxuICogICAgICAgICAgICAgICAgICAgICAgICB3aWxsIGRlZmF1bHQgdG8gMSB3aGVuIHRoZXJlIGFyZSBubyBvcmdzLCBhbmQgZ3Jvd3MgYXMgbW9yZSByb3dzIGFyZSBuZWVkZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gdGlnaHRlblJvd3MgLSBJZiBnaXZlbiwgd2lsbCBzaHJpbmsgdGhlIHZlcnRpY2FsIGhlaWdodCBvZiB0aGUgcGVuIGJ5IHRoaXMgYW1vdW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgIHBlciByb3csIGNyb3dkaW5nIHRoZSBvcmcgaW1hZ2VzIGFzIG5lZWRlZC5cbiAqL1xuY29uc3QgUGVuVmlldyA9ICh7b3JncywgaWRQcmVmaXg9J29yZ2FuaXNtLScsIHdpZHRoPTQwMCwgY29sdW1ucz01LCByb3dzLCB0aWdodGVuUm93cz0wLCB0aWdodGVuQ29sdW1ucz0wLCBTZWxlY3RlZE9yZ2FuaXNtVmlldz1PcmdhbmlzbVZpZXcsIHNlbGVjdGVkSW5kZXgsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soaWQsIG9yZykge1xuICAgIGNvbnN0IHByZWZpeEluZGV4ID0gaWQuaW5kZXhPZihpZFByZWZpeCksXG4gICAgICAgICAgaW5kZXggPSBOdW1iZXIoaWQuc3Vic3RyKHByZWZpeEluZGV4ICsgaWRQcmVmaXgubGVuZ3RoKSk7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaW5kZXgsIGlkLCBvcmcpO1xuICB9XG5cbiAgbGV0IG9yZ1N0eWxlID0ge1xuICAgIG1hcmdpbjogYCR7LXRpZ2h0ZW5Sb3dzLzJ9cHggJHstdGlnaHRlbkNvbHVtbnMvMn1weGBcbiAgfTtcblxuICBsZXQgb3JnV2lkdGggPSB3aWR0aC9jb2x1bW5zLFxuICAgICAgb3JnVmlld3MgPSBvcmdzLm1hcCgob3JnLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gaW5kZXggPT09IHNlbGVjdGVkSW5kZXhcbiAgICAgICAgICAgICAgICA/IDxTZWxlY3RlZE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkUHJlZml4ICsgaW5kZXh9IGluZGV4PXtpbmRleH0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPVwiI0ZGRkZBQVwiIHNpemU9e29yZ1dpZHRofSBzdHlsZT17b3JnU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfS8+XG4gICAgICAgICAgICAgICAgOiA8T3JnYW5pc21WaWV3IG9yZz17b3JnfSBpZD17aWRQcmVmaXggKyBpbmRleH0gaW5kZXg9e2luZGV4fSBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD17b3JnV2lkdGh9IHN0eWxlPXtvcmdTdHlsZX0gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+O1xuICAgICAgfSk7XG5cbiAgcm93cyA9IHJvd3MgfHwgTWF0aC5jZWlsKG9yZ1ZpZXdzLmxlbmd0aCAvIGNvbHVtbnMpIHx8IDE7XG5cbiAgbGV0IGhlaWdodCA9IG9yZ1dpZHRoICogcm93cztcblxuICB3aWR0aCAgPSB3aWR0aCAgLSAodGlnaHRlbkNvbHVtbnMgKiBjb2x1bW5zKTtcbiAgaGVpZ2h0ID0gaGVpZ2h0IC0gKHRpZ2h0ZW5Sb3dzICogcm93cyk7XG5cbiAgbGV0IHN0eWxlID0geyB3aWR0aCwgaGVpZ2h0IH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcGVuXCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUGVuVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgcm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgdGlnaHRlbkNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRpZ2h0ZW5Sb3dzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBTZWxlY3RlZE9yZ2FuaXNtVmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQZW5WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbkdsb3dWaWV3ID0gKHtnbG93Q29sb3IsIHNpemU9MjAwfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJ307XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvd1wiIHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBjb2xvcj17Z2xvd0NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17Z2xvd1N0eWxlfS8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvdyBxdWVzdGlvbi1tYXJrXCJcbiAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246IFwiYWJzb2x1dGVcIiwgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX19PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG4gIC8vIEhUTUwgdGV4dCBub2RlXG4gIC8vPGRpdiBzdHlsZT17dFN0eWxlfT57dGV4dH08L2Rpdj5cblxuICAvLyBTVkcgdGV4dCBub2RlXG4gIC8vPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAvLyAgPHRleHQgeD0nNTAnIHk9JzE3NScgZmlsbD0nIzBEMEQ4Qycgc3R5bGU9e3RTdHlsZX0+XG4gIC8vICAgIHt0ZXh0fVxuICAvLyAgPC90ZXh0PlxuICAvLzwvc3ZnPlxufTtcblxuUXVlc3Rpb25HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGdsb3dDb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbkdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21HbG93VmlldyBmcm9tICcuL29yZ2FuaXNtLWdsb3cnO1xuaW1wb3J0IFF1ZXN0aW9uR2xvd1ZpZXcgZnJvbSAnLi9xdWVzdGlvbi1nbG93JztcblxuY29uc3QgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3ID0gKHtoaWRkZW4sIGNvbG9yLCBzaXplLCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3Qgb3JnVmlldyA9IDxPcmdhbmlzbUdsb3dWaWV3IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gey4uLm90aGVyfSAvPixcbiAgICAgICAgcXVlc3Rpb25WaWV3ID0gPFF1ZXN0aW9uR2xvd1ZpZXcgZ2xvd0NvbG9yPXtjb2xvcn0gd2lkdGg9e3NpemV9IC8+LFxuICAgICAgICBmaW5hbFZpZXcgPSBoaWRkZW4gPyBxdWVzdGlvblZpZXcgOiBvcmdWaWV3O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLW9yZ2FuaXNtLWdsb3dcIj5cbiAgICAgIHtmaW5hbFZpZXd9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5RdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBoaWRkZW46IFByb3BUeXBlcy5ib29sLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBHZW5ldGljc1V0aWxzIGZyb20gJy4uL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGJyZWVkaW5nIHN0YXRpc3RpY3MgZm9yIGEgc2V0IG9mIEJpb2xvZ2ljYSBvcmdhbmlzbXNcbiAqIEBwYXJhbSB7T2JqZWN0W119IG9yZ3MgLSBhcnJheSBvZiBCaW9sb2dpY2Egb3JnYW5pc21zIGZvciB3aGljaCBzdGF0aXN0aWNzIGFyZSB0byBiZSBkaXNwbGF5ZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcmdzW10ucGhlbm90eXBlIC0gdGhlIHBoZW5vdHlwZSBvZiB0aGUgQmlvbG9naWNhIG9yZ2FuaXNtXG4gKiBAcGFyYW0ge251bWJlcn0gW2xhc3RDbHV0Y2hTaXplPW9yZ3MubGVuZ3RoXSAtIHRoZSBudW1iZXIgb2Ygb3JnYW5pc21zIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IHRoYXQgY29tcHJpc2UgdGhlIG1vc3QgcmVjZW50IGNsdXRjaFxuICovXG5jb25zdCBTdGF0c1ZpZXcgPSAoe29yZ3MsIGxhc3RDbHV0Y2hTaXplfSkgPT4ge1xuXG4gIGxldCB0cmFpdHMgPSBHZW5ldGljc1V0aWxzLmNvbXB1dGVUcmFpdENvdW50c0Zvck9yZ2FuaXNtcyhvcmdzLCBsYXN0Q2x1dGNoU2l6ZSksXG4gICAgICBjbHV0Y2hTaXplID0gbGFzdENsdXRjaFNpemUgfHwgb3Jncy5sZW5ndGgsXG4gICAgICByb3dzID0gW107XG5cbiAgLy8gYnVpbGQgY3VtdWxhdGl2ZSBzdGF0cyBmb3IgdGFibGUgcm93c1xuICBsZXQgdHJhaXROdW0gPSAwO1xuICBmb3IgKGNvbnN0IFt0cmFpdCwgdmFsdWVzXSBvZiB0cmFpdHMpIHtcbiAgICBmb3IgKGNvbnN0IFt2YWx1ZSwgY291bnRzXSBvZiB2YWx1ZXMpIHtcbiAgICAgIGNvbnN0IGNNYWxlcyA9IGNvdW50cy5jbHV0Y2hbQmlvTG9naWNhLk1BTEVdLFxuICAgICAgICAgICAgY0ZlbWFsZXMgPSBjb3VudHMuY2x1dGNoW0Jpb0xvZ2ljYS5GRU1BTEVdLFxuICAgICAgICAgICAgY1RvdGFsID0gY01hbGVzICsgY0ZlbWFsZXMsXG4gICAgICAgICAgICBjUGN0ID0gTWF0aC5yb3VuZCgxMDAgKiBjVG90YWwgLyBjbHV0Y2hTaXplKSxcbiAgICAgICAgICAgIHRNYWxlcyA9IGNvdW50cy50b3RhbFtCaW9Mb2dpY2EuTUFMRV0sXG4gICAgICAgICAgICB0RmVtYWxlcyA9IGNvdW50cy50b3RhbFtCaW9Mb2dpY2EuRkVNQUxFXSxcbiAgICAgICAgICAgIHRUb3RhbCA9IHRNYWxlcyArIHRGZW1hbGVzLFxuICAgICAgICAgICAgdFBjdCA9IE1hdGgucm91bmQoMTAwICogdFRvdGFsIC8gb3Jncy5sZW5ndGgpO1xuICAgICAgcm93cy5wdXNoKHsgdHJhaXQsIHRyYWl0TnVtLCB2YWx1ZSwgY01hbGVzLCBjRmVtYWxlcywgY1RvdGFsLCBjUGN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdE1hbGVzLCB0RmVtYWxlcywgdFRvdGFsLCB0UGN0IH0pO1xuICAgIH1cbiAgICArKyB0cmFpdE51bTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHN0YXRzXCI+XG4gICAgICA8dGFibGUgaWQ9XCJzdGF0cy10YWJsZVwiIGNsYXNzTmFtZT17b3Jncy5sZW5ndGggPiAwID8gXCJoYXMtZGF0YVwiIDogXCJuby1kYXRhXCJ9PlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRoPlRyYWl0IFZhbHVlPC90aD5cbiAgICAgICAgICAgIDx0aCBjb2xTcGFuPVwiMlwiPkNsdXRjaDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICAgIDx0aCBjb2xTcGFuPVwiMlwiPlRvdGFsPC90aD48dGg+RjwvdGg+PHRoPk08L3RoPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge1xuICAgICAgICAgIHJvd3MubWFwKGZ1bmN0aW9uKHJvdywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDx0ciBrZXk9e2luZGV4fSBjbGFzc05hbWU9e3Jvdy50cmFpdE51bSAmIDEgPyBcIm9kZC10cmFpdFwiIDogXCJldmVuLXRyYWl0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRyYWl0LXZhbHVlPXtyb3cudmFsdWV9PlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJsYWJlbFwiPntyb3cudmFsdWV9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cuY1RvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNNYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy50VG90YWx9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFBjdH0lPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudEZlbWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudE1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5TdGF0c1ZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBsYXN0Q2x1dGNoU2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3RhdHNWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEZWR2VuZUxhYmVsVmlldyA9ICh7YWxsZWxlLCBzcGVjaWVzLCBjaHJvbW9zb21lTmFtZSwgY2hyb21vc29tZUhlaWdodD0xMjIsIHN0cmlwZX0pID0+IHtcbiAgICB2YXIgY2hyb21TdGFydDtcbiAgICBPYmplY3Qua2V5cyhCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZS5nZW5lTGlzdCkuZm9yRWFjaCgoZ2VuZU5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZS5nZW5lTGlzdFtnZW5lTmFtZV07XG4gICAgICBpZiAoZ2VuZS5hbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA+IC0xKSB7XG4gICAgICAgIGNocm9tU3RhcnQgPSBnZW5lLnN0YXJ0O1xuICAgICAgICBpZiAoY2hyb21vc29tZU5hbWU9PT0xKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYWxsZWxlICsgY2hyb21TdGFydCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBiaW9DaHJvbUhlaWdodCA9IEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLmNocm9tb3NvbWVzTGVuZ3RoW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgICBzdHJpcGVIZWlnaHQgPSBjaHJvbW9zb21lSGVpZ2h0ICogLjA0LFxuICAgICAgICAgIHBlcmNlbnRIZWlnaHQgPSBjaHJvbVN0YXJ0L2Jpb0Nocm9tSGVpZ2h0LFxuICAgICAgICAgIHN0eWxlID0ge21hcmdpblRvcDogcGVyY2VudEhlaWdodCAqIGNocm9tb3NvbWVIZWlnaHQgLSBzdHJpcGVIZWlnaHQgKiAzICsgXCJweFwifSxcbiAgICAgICAgICBzdHJpcGVTdHlsZSA9IHtoZWlnaHQ6IHN0cmlwZUhlaWdodCArIFwicHhcIn0sXG4gICAgICAgICAgbGFiZWxPZmZzZXRTdHlsZSA9IHttYXJnaW5Ub3A6IC1zdHJpcGVIZWlnaHQgKiAuNn0sXG4gICAgICAgICAgbGluZSA9IHN0cmlwZSA/IG51bGwgOiA8ZGl2IGNsYXNzTmFtZT1cImxpbmVcIiBzdHlsZT17bGFiZWxPZmZzZXRTdHlsZX0+PC9kaXY+LFxuICAgICAgICAgIGxhYmVsID0gc3RyaXBlID8gbnVsbCA6IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICAgICAgICBcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e1wiZ2VuaWJsb2NrcyBmdi1nZW5lLWxhYmVsIGFsbGVsZSBub25lZGl0YWJsZSBcIiArIGFsbGVsZS50b0xvd2VyQ2FzZSgpfSBrZXk9e2FsbGVsZX0gc3R5bGU9e3N0eWxlfT5cbiAgICAgICAge2xpbmV9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RyaXBlXCIgc3R5bGU9e3N0cmlwZVN0eWxlfT48L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17bGFiZWxPZmZzZXRTdHlsZX0+e2xhYmVsfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbkZWR2VuZUxhYmVsVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWxsZWxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNocm9tb3NvbWVIZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNocm9tb3NvbWVOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzdHJpcGU6IFByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBGVkdlbmVMYWJlbFZpZXc7XG4iLCIvKlxuICogU2VlIGh0dHBzOi8vbWVkaXVtLmNvbS9Aa2VudGNkb2Rkcy9taXN1bmRlcnN0YW5kaW5nLWVzNi1tb2R1bGVzLXVwZ3JhZGluZy1iYWJlbC10ZWFycy1hbmQtYS1zb2x1dGlvbi1hZDJkNWFiOTNjZTAjLnExdmNrZmZpd1xuICogKEtlbnQgQy4gRG9kZHMsIFwiTWlzdW5kZXJzdGFuZGluZyBFUzYgTW9kdWxlcywgVXBncmFkaW5nIEJhYmVsLCBUZWFycywgYW5kIGEgU29sdXRpb25cIilcbiAqIGZvciBkZXNjcmlwdGlvbiBvZiBzb21lIG9mIHRoZSBkZXRhaWxzIGludm9sdmVkIGluIG1peGluZyBFUzYgZXhwb3J0IHdpdGggcmVxdWlyZSgpLlxuICovXG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWxsZWxlRmlsdGVyc1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FsbGVsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbmltYXRlZE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJhc2tldFNldFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYmFza2V0LXNldCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFuZ2VTZXhCdXR0b25zIH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVJbWFnZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENocm9tb3NvbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2Nocm9tb3NvbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaXJjdWxhckdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFZ2dDbHV0Y2hWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2VnZy1jbHV0Y2gnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZWVkYmFja1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVlZGJhY2snO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGZXJ0aWxpemluZ0dhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2FtZXRlUG9vbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlLXBvb2wnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmVMYWJlbFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2VuZS1sYWJlbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbm9tZVRlc3RWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZS10ZXN0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5vbWUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHbG93QmFja2dyb3VuZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2xvdy1iYWNrZ3JvdW5kJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTW9kYWxBbGVydCB9IGZyb20gJy4vY29tcG9uZW50cy9tb2RhbC1hbGVydCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZGluYWxPcmdhbmlzbVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JkaW5hbC1vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9yZ2FuaXNtR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvb3JnYW5pc20tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBlblZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3Blbi1zdGF0cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3RhdHNWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hhbGxlbmdlQXdhcmRWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYWxsZW5nZS1hd2FyZCc7XG5cbi8vIHV0aWxpdGllc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5ldGljc1V0aWxzIH0gZnJvbSAnLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuIiwiLyoqXG4gKiBDbGFzcyBwcm92aWRpbmcgdXRpbGl0eSBmdW5jdGlvbnMgZm9yIEJpb0xvZ2ljYSBnZW5ldGljcyBvcGVyYXRpb25zLlxuICogSW4gc29tZSBjYXNlcyB0aGVzZSBhcmUgYWRhcHRlZCBmcm9tIGNvcnJlc3BvbmRpbmcgY29kZSBpbiBHZW5pdmVyc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmV0aWNzVXRpbHMge1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbGxlbGUgc3RyaW5ncyBpbiB0aGUgbmV3IGRhc2ggZm9ybSAoZS5nLiBcIlctdywgVC0sIC1hXCIpIHRvIHRoZSBvcmlnaW5hbFxuICAgKiBCaW9Mb2dpY2EgYTpiOiBmb3JtIChlLmcuIFwiYTpXLGI6dyxhOlQsYjphXCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgZGFzaEFsbGVsZVN0cmluZyAtIHRoZSBhbGxlbGUgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAgdGhlIGNvbnZlcnRlZCBhbGxlbGUgc3RyaW5nXG4gICAqL1xuICBzdGF0aWMgY29udmVydERhc2hBbGxlbGVzVG9BQkFsbGVsZXMoZGFzaEFsbGVsZVN0cmluZykge1xuICAgIGlmICghZGFzaEFsbGVsZVN0cmluZyB8fCAoZGFzaEFsbGVsZVN0cmluZy5pbmRleE9mKCc6JykgPj0gMCkgfHwgKGRhc2hBbGxlbGVTdHJpbmcuaW5kZXhPZignLScpIDwgMCkpXG4gICAgICByZXR1cm4gZGFzaEFsbGVsZVN0cmluZztcbiAgICBjb25zdCBkYXNoQWxsZWxlcyA9IGRhc2hBbGxlbGVTdHJpbmcuc3BsaXQoJywnKTtcbiAgICByZXR1cm4gZGFzaEFsbGVsZXMucmVkdWNlKChwcmV2LCBwYWlyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxlbGVzID0gcGFpci50cmltKCkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxlbGVzWzBdKSBwcmV2ICs9IGAke3ByZXYgPyAnLCcgOiAnJ31hOiR7YWxsZWxlc1swXS50cmltKCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxlbGVzWzFdKSBwcmV2ICs9IGAke3ByZXYgPyAnLCcgOiAnJ31iOiR7YWxsZWxlc1sxXS50cmltKCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgIH0sIFwiXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFsbGVsZSBzdHJpbmdzIGluIHRoZSBuZXcgZGFzaCBmb3JtIChlLmcuIFwiVy13LCBULSwgLWFcIikgdG8gdGhlIG9yaWdpbmFsXG4gICAqIEJpb0xvZ2ljYSBhOmI6IGZvcm0gKGUuZy4gXCJhOlcsYjp3LGE6VCxiOmFcIikgd2l0aGluIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICpcbiAgICogUmVjdXJzZXMgdGhyb3VnaCBuZXN0ZWQgb2JqZWN0cy9hcnJheXMgY29udmVydGluZyBkYXNoIGFsbGVsZSBzdHJpbmdzIGluIHByb3BlcnRpZXNcbiAgICogd2hvc2UgbmFtZXMgYXJlIHdoaXRlLWxpc3RlZCBpbiB0aGUgcHJvcE5hbWVzIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gIG9iamVjdCAtIHRoZSBvYmplY3QgdG8gYmUgY29udmVydGVkXG4gICAqIEByZXR1cm5zIHtvYmplY3R9ICB0aGUgc2FtZSBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGZpZWxkcyBtb2RpZmllZFxuICAgKi9cbiAgc3RhdGljIGNvbnZlcnREYXNoQWxsZWxlc09iamVjdFRvQUJBbGxlbGVzKG9iamVjdCwgcHJvcE5hbWVzKSB7XG4gICAgaWYgKCFvYmplY3QgfHwgIXByb3BOYW1lcyB8fCAocHJvcE5hbWVzLmxlbmd0aCA9PSBudWxsKSkgcmV0dXJuIG9iamVjdDtcblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG4gICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHJldHVybiAoIWtleSB8fCAocHJvcE5hbWVzLmluZGV4T2Yoa2V5KSA+PSAwKSlcbiAgICAgICAgICAgICAgICAgICAgPyBHZW5ldGljc1V0aWxzLmNvbnZlcnREYXNoQWxsZWxlc1RvQUJBbGxlbGVzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gbm90ZSB0aGF0IHRoZSBrZXkgZm9yIHN0cmluZ3MgaW4gYXJyYXlzIGlzIHRoZSBrZXkgZm9yIHRoZSBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLm1hcCgoaXRlbSkgPT4gY29udmVydFZhbHVlKGtleSwgaXRlbSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IG9iaktleSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICB2YWx1ZVtvYmpLZXldID0gY29udmVydFZhbHVlKG9iaktleSwgdmFsdWVbb2JqS2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRWYWx1ZShudWxsLCBvYmplY3QpO1xuICB9XG5cbiAgc3RhdGljIGVuc3VyZVZhbGlkT3JnYW5pc20ob3JnT3JEZWYsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAob3JnT3JEZWYuZ2V0QWxsZWxlU3RyaW5nKSB7XG4gICAgICByZXR1cm4gb3JnT3JEZWY7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKHNwZWNpZXMsIG9yZ09yRGVmLmFsbGVsZVN0cmluZywgb3JnT3JEZWYuc2V4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBhbGxlbGVzIGFyZSBwcmVzZW50IGluIHRoZSBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gIGFsbGVsZVN0cmluZyAtIG9yZ2FuaXNtIGFsbGVsZSBzdHJpbmdcbiAgICogQHBhcmFtIChzdHJpbmcpICBhbGxlbGVzIC0gYWxsZWxlcyB0byBtYXRjaCBhZ2FpbnN0IHRoZSBvcmdhbmlzbSBhbGxlbGVzXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBhbGxlbGVzIGFyZSBwcmVzZW50IGluIHRoZSBhbGxlbGVTdHJpbmcsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGFsbGVsZVN0cmluZ0NvbnRhaW5zQWxsZWxlcyhhbGxlbGVTdHJpbmcsIGFsbGVsZXMpIHtcbiAgICAvLyBlbXB0eSBzdHJpbmdzIGRvbid0IG1hdGNoXG4gICAgaWYgKCFhbGxlbGVTdHJpbmcgfHwgIWFsbGVsZXMpIHJldHVybiBmYWxzZTtcbiAgICAvLyBtdXN0IG1hdGNoIGV2ZXJ5IG9uZSBvZiB0aGUgYWxsZWxlcyAuLi5cbiAgICByZXR1cm4gYWxsZWxlcy5zcGxpdCgnLCcpLmV2ZXJ5KChhbGxlbGUpID0+IHtcbiAgICAgIC8vIC4uLiB0byB0aGUgYWxsZWxlcyBvZiB0aGUgYWxsZWxlU3RyaW5nXG4gICAgICByZXR1cm4gYWxsZWxlU3RyaW5nLnNlYXJjaChgJHthbGxlbGV9KCx8JClgKSA+PSAwO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGFsbGVsZSBzdHJpbmcgY29udGFpbnMgb25seSB2YWxpZCBhbGxlbGVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgKGluIGE6YjogZm9ybSkgdG8gYmUgdmFsaWRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgW3NwZWNpZXNdIC0gdGhlIHNwZWNpZXMgd2hvc2UgZ2Vub21lIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGNvbXBsZXRlbmVzc1xuICAgKiBAcmV0dXJucyAgICAgICAgIHRydWUgaWYgdGhlIGFsbGVsZSBzdHJpbmcgaXMgdmFsaWQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzVmFsaWRBbGxlbGVTdHJpbmcoYWxsZWxlU3RyaW5nLCBzcGVjaWVzPUJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlKSB7XG4gICAgaWYgKCFzcGVjaWVzIHx8ICFhbGxlbGVTdHJpbmcpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBhbGxlbGVUb0dlbmVNYXAgPSBPYmplY3Qua2V5cyhzcGVjaWVzLmdlbmVMaXN0KS5yZWR1Y2UoKHByZXYsIGdlbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNpZXMuZ2VuZUxpc3RbZ2VuZV0uYWxsZWxlcy5mb3JFYWNoKChhbGxlbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlthbGxlbGVdID0gZ2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge30pO1xuICAgIHJldHVybiBhbGxlbGVTdHJpbmcuc3BsaXQoJywnKS5ldmVyeSgoYWxsZWxlU2lkZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTaWRlLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgICByZXR1cm4gKChzaWRlLnRyaW0oKSA9PT0gJ2EnKSB8fCAoc2lkZS50cmltKCkgPT09ICdiJykpICYmXG4gICAgICAgICAgICAgICAgICAgIChhbGxlbGVUb0dlbmVNYXBbYWxsZWxlLnRyaW0oKV0gIT0gbnVsbCk7XG4gICAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgYWxsZWxlIHN0cmluZyBjb21wbGV0ZWx5IHNwZWNpZmllcyBhbGwgYWxsZWxlc1xuICAgKlxuICAgKiBUbyBiZSBjb21wbGV0ZSwgZXZlcnkgZ2VuZSBtdXN0IGJlIHNwZWNpZmllZCB3aXRoIGEgdmFsaWQgYWxsZWxlIGZvciBlYWNoXG4gICAqIHNpZGUgKGV4Y2VwdCBzZXgtbGlua2VkIGdlbmVzLCB3aGljaCBuZWVkIG9ubHkgYmUgb24gb25lIHNpZGUpLCBhbmQgbm9cbiAgICogaW52YWxpZCBhbGxlbGVzIG9yIGdlbmVzIGNhbiBiZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgKGluIGE6YjogZm9ybSkgdG8gYmUgdmFsaWRhdGVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgW3NwZWNpZXNdIC0gdGhlIHNwZWNpZXMgd2hvc2UgZ2Vub21lIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGNvbXBsZXRlbmVzc1xuICAgKiBAcmV0dXJucyAgICAgICAgIHRydWUgaWYgdGhlIGFsbGVsZSBzdHJpbmcgaXMgY29tcGxldGUsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzQ29tcGxldGVBbGxlbGVTdHJpbmcoYWxsZWxlU3RyaW5nLCBzcGVjaWVzPUJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlKSB7XG4gICAgaWYgKCFzcGVjaWVzIHx8ICFhbGxlbGVTdHJpbmcpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBrVW5rbm93bkdlbmUgPSBcIl9fVU5LTk9XTl9fXCIsXG4gICAgICAgICAgYWxsZWxlVG9HZW5lTWFwID0gT2JqZWN0LmtleXMoc3BlY2llcy5nZW5lTGlzdCkucmVkdWNlKChwcmV2LCBnZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMuZm9yRWFjaCgoYWxsZWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZbYWxsZWxlXSA9IGdlbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KSxcbiAgICAgICAgICBzcGVjaWVzR2VuZUNvdW50ID0gT2JqZWN0LmtleXMoc3BlY2llcy5nZW5lTGlzdCkubGVuZ3RoLFxuICAgICAgICAgIGdlbmVTaWRlTWFwID0gYWxsZWxlU3RyaW5nLnNwbGl0KCcsJykucmVkdWNlKChwcmV2LCBhbGxlbGVTaWRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtzaWRlLCBhbGxlbGVdID0gYWxsZWxlU2lkZS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZ2VuZSA9IGFsbGVsZVRvR2VuZU1hcFthbGxlbGUudHJpbSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lKSBnZW5lID0ga1Vua25vd25HZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZ2VuZUVudHJ5ID0gcHJldltnZW5lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lRW50cnkpIGdlbmVFbnRyeSA9IHByZXZbZ2VuZV0gPSB7IGE6IDAsIGI6IDAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKysgZ2VuZUVudHJ5W3NpZGUudHJpbSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSksXG4gICAgICAgICAgYWxsZWxlU3RyaW5nR2VuZUNvdW50ID0gT2JqZWN0LmtleXMoZ2VuZVNpZGVNYXApLmxlbmd0aCxcbiAgICAgICAgICBpc0V2ZXJ5R2VuZUNvbXBsZXRlID0gT2JqZWN0LmtleXMoZ2VuZVNpZGVNYXApLmV2ZXJ5KChnZW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZUVudHJ5ID0gZ2VuZVNpZGVNYXBbZ2VuZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNYWUdlbmUgPSBzcGVjaWVzLmNocm9tb3NvbWVHZW5lTWFwLlhZLnNvbWUoKGFsbGVsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lID09PSBhbGxlbGVUb0dlbmVNYXBbYWxsZWxlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVFbnRyeSAmJiAoKGdlbmVFbnRyeS5hID09PSAxKSAmJiAoZ2VuZUVudHJ5LmIgPT09IDEpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlzWFlHZW5lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZW5lRW50cnkuYSArIGdlbmVFbnRyeS5iID49IDEpICYmIChnZW5lRW50cnkuYSArIGdlbmVFbnRyeS5iIDw9IDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gbXVzdCBoYXZlIHRoZSBjb3JyZWN0IG51bWJlciBvZiBnZW5lcywgYWxsIGdlbmVzIG11c3QgYmUgY29tcGxldGUsIGFuZCBubyB1bmtub3duIGdlbmVzXG4gICAgcmV0dXJuIChzcGVjaWVzR2VuZUNvdW50ID09PSBhbGxlbGVTdHJpbmdHZW5lQ291bnQpICYmIGlzRXZlcnlHZW5lQ29tcGxldGUgJiZcbiAgICAgICAgICAgIChnZW5lU2lkZU1hcFtrVW5rbm93bkdlbmVdID09IG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgb3V0IGhpZGRlbiBhbGxlbGVzLCBnaXZlbiBhIGxpc3Qgb2YgY2hhbmdlYWJsZSBhbmQgdmlzaWJsZSBnZW5lcy5cbiAgICogUmV0dXJucyBhcnJheSBvZiBvYmplY3RzIHdpdGggdGhlIGFsbGVsZSBhbmQgdGhlIGVkaXRhYmlsaXR5XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGFsbGVsZXMgLSB0aGUgc2V0IG9mIGFsbGVsZXMgdG8gYmUgZmlsdGVyZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdXNlckNoYW5nZWFibGVHZW5lcyAtIGdlbmVzIHRoYXQgdGhlIHVzZXIgY2FuIGVkaXQgKGlmIHRoZSB0ZW1wbGF0ZSBhbGxvd3MpXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHZpc2libGVHZW5lcyAtIGdlbmVzIHRoYXQgdGhlIHVzZXIgY2FuIHZpZXcgKGFscmVhZHkgaW5jbHVkZXMgdGhlIGFib3ZlIGxpc3QpXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLnNwZWNpZXN9IHNwZWNpZXMgLSB0aGUgc3BlY2llcyB0aGF0IGRlZmluZXMgdGhlIGdlbm90eXBlXG4gICAqIEByZXR1cm4ge29ialtdfSAtIHRoZSBmaWx0ZXJlZCBhbGxlbGVzLCB3aGVyZSBlYWNoIGlzIGFuIG9iamVjdCB3aXRoIGEgbmFtZSBhbmQgd2hldGhlciBpdCBpcyBlZGl0YWJsZVxuICAgKi9cbiAgc3RhdGljIGZpbHRlclZpc2libGVBbGxlbGVzKGFsbGVsZXMsIHVzZXJDaGFuZ2VhYmxlR2VuZXMsIHZpc2libGVHZW5lcywgc3BlY2llcykge1xuICAgIGxldCBzaG93QWxsID0gdXNlckNoYW5nZWFibGVHZW5lcy5sZW5ndGggKyB2aXNpYmxlR2VuZXMubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBhbGxlbGVzLmZpbHRlcihhID0+IHtcbiAgICAgIGlmIChzaG93QWxsKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSksXG4gICAgICAgICAgICBnZW5lTmFtZSA9IGdlbmUgPyBnZW5lLm5hbWUgOiBudWxsO1xuICAgICAgcmV0dXJuIHVzZXJDaGFuZ2VhYmxlR2VuZXMuaW5kZXhPZihnZW5lTmFtZSkgPiAtMSB8fCB2aXNpYmxlR2VuZXMuaW5kZXhPZihnZW5lTmFtZSkgPiAtMTtcbiAgICB9KS5tYXAoYSA9PiAoe1xuICAgICAgYWxsZWxlOiBhLFxuICAgICAgZWRpdGFibGU6IHVzZXJDaGFuZ2VhYmxlR2VuZXMuaW5kZXhPZihCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpLm5hbWUpID4gLTFcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZSBhIG1hcCBvZiB0cmFpdHMgLT4gdHJhaXRWYWx1ZXMgLT4gdHJhaXRDb3VudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtW119IG9yZ2FuaXNtcyAtIHRoZSBzZXQgb2Ygb3JnYW5pc21zIHRvIGNvbXB1dGUgc3RhdHMgZm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjbHV0Y2hTaXplIC0gdGhlIGxhc3QgJ2NsdXRjaFNpemUnIG9yZ2FuaXNtcyBhcmUgYXNzdW1lZCB0byBiZSB0aGUgbGFzdCBjbHV0Y2hcbiAgICogQHJldHVybiB7TWFwfSAtIGUuZy4geyBcInRhaWxcIjogeyBcImxvbmcgdGFpbFwiOiB7IFwiY2x1dGNoXCI6IFs5LCAxMV0sIFwidG90YWxcIjogWzUzLCA0N10gfX19XG4gICAqL1xuICBzdGF0aWMgY29tcHV0ZVRyYWl0Q291bnRzRm9yT3JnYW5pc21zKG9yZ2FuaXNtcywgbGFzdENsdXRjaFNpemUpIHtcbiAgICBsZXQgdHJhaXRzID0gbmV3IE1hcCxcbiAgICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ2FuaXNtcy5sZW5ndGg7XG5cbiAgICAvLyBhY2N1bXVsYXRlIHN0YXRzIGZvciBlYWNoIHRyYWl0L3ZhbHVlIGNvbWJpbmF0aW9uXG4gICAgZm9yIChjb25zdCBbaW5kZXgsIG9yZ10gb2Ygb3JnYW5pc21zLmVudHJpZXMoKSkge1xuICAgICAgZm9yIChjb25zdCB0cmFpdCBvZiBPYmplY3Qua2V5cyhvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcykpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gb3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3NbdHJhaXRdLFxuICAgICAgICAgICAgdHJhaXRWYWx1ZXMgPSB0cmFpdHMuZ2V0KHRyYWl0KSB8fCBuZXcgTWFwLFxuICAgICAgICAgICAgdmFsdWVDb3VudHMgPSB0cmFpdFZhbHVlcy5nZXQodmFsdWUpIHx8IHsgY2x1dGNoOiBbMCwgMF0sIHRvdGFsOiBbMCwgMF0gfTtcbiAgICAgICAgaWYgKCF0cmFpdHMuaGFzKHRyYWl0KSkgdHJhaXRzLnNldCh0cmFpdCwgdHJhaXRWYWx1ZXMpO1xuICAgICAgICBpZiAoIXRyYWl0VmFsdWVzLmhhcyh2YWx1ZSkpIHRyYWl0VmFsdWVzLnNldCh2YWx1ZSwgdmFsdWVDb3VudHMpO1xuICAgICAgICAvLyBtb3N0IHJlY2VudCBjbHV0Y2ggYXNzdW1lZCB0byBiZSBhdCBlbmQgb2Ygb3JnYW5pc21zIGFycmF5XG4gICAgICAgIGlmIChpbmRleCA+PSBvcmdhbmlzbXMubGVuZ3RoIC0gY2x1dGNoU2l6ZSlcbiAgICAgICAgICArKyB2YWx1ZUNvdW50cy5jbHV0Y2hbb3JnLnNleF07XG4gICAgICAgICsrIHZhbHVlQ291bnRzLnRvdGFsW29yZy5zZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhaXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFuIGFsbGVsZSBzdHJpbmcgdG8gYSBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IG1hcHMgZ2VuZXMgdG8gYWxsZWxlcy5cbiAgICogVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBjb21wYXJpc29uIHB1cnBvc2VzLCBmb3IgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHJldHVybiB7b2JqZWN0fSAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3Juczoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqL1xuICBzdGF0aWMgYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKSB7XG4gICAgbGV0IGdlbmVNYXAgPSB7fSxcbiAgICAgICAgYWxsZWxlU3Vic3RyaW5ncyA9IGFsbGVsZVN0cmluZy5zcGxpdChcIixcIik7XG4gICAgZm9yIChjb25zdCBhbGxlbGVTdWJzdHIgb2YgYWxsZWxlU3Vic3RyaW5ncykge1xuICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTdWJzdHIuc3BsaXQoXCI6XCIpLFxuICAgICAgICAgICAgZ2VuZSA9IGdlbmV0aWNzLmdlbmVGb3JBbGxlbGUoYWxsZWxlKTtcbiAgICAgIGlmIChzaWRlICYmIGFsbGVsZSAmJiBnZW5lKSB7XG4gICAgICAgIGlmICghZ2VuZU1hcFtnZW5lXSkgZ2VuZU1hcFtnZW5lXSA9IHt9O1xuICAgICAgICBnZW5lTWFwW2dlbmVdW3NpZGVdID0gYWxsZWxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ2VuZU1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhbiBhbGxlbGUgc3RyaW5nIGFuZCBhIGdlbmUgbWFwIGRlZmluaW5nIGEgc2V0IG9mIGJhc2UgKGRlZmF1bHQpIGFsbGVsZXMsXG4gICAqIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyB3aXRoIG1pc3NpbmcgYWxsZWxlcyByZXBsYWNlZCBieSB0aGVpciBkZWZhdWx0cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge29iamVjdH0gYmFzZUdlbmVNYXAgLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybjoge2E6XCJoXCIsIGI6XCJoXCJ9LCBhcm1vcjoge2E6XCJhXCIsIGI6XCJhXCJ9LCAuLi59XG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCkge1xuICAgIGNvbnN0IGRzdEdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZyk7XG4gICAgbGV0ICAgZHN0QWxsZWxlU3RyaW5nID0gYWxsZWxlU3RyaW5nO1xuICAgIGZvciAoY29uc3QgZ2VuZSBpbiBkc3RHZW5lTWFwKSB7XG4gICAgICBjb25zdCBnZW5lVmFsdWUgPSBkc3RHZW5lTWFwW2dlbmVdO1xuICAgICAgLy8gcmVwbGFjZSBhIG1pc3NpbmcgJ2EnIHNpZGUgYWxsZWxlIHdpdGggdGhlIGRlZmF1bHQgaWYgYXBwcm9wcmlhdGVcbiAgICAgIGlmICghZ2VuZVZhbHVlLmEgJiYgYmFzZUdlbmVNYXBbZ2VuZV0gJiYgYmFzZUdlbmVNYXBbZ2VuZV0uYSkge1xuICAgICAgICBkc3RBbGxlbGVTdHJpbmcgPSBkc3RBbGxlbGVTdHJpbmcucmVwbGFjZShgYjoke2dlbmVWYWx1ZS5ifWAsIGBhOiR7YmFzZUdlbmVNYXBbZ2VuZV0uYX0sJCZgKTtcbiAgICAgIH1cbiAgICAgIC8vIHJlcGxhY2UgYSBtaXNzaW5nICdiJyBzaWRlIGFsbGVsZSB3aXRoIHRoZSBkZWZhdWx0IGlmIGFwcHJvcHJpYXRlXG4gICAgICBpZiAoIWdlbmVWYWx1ZS5iICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmIpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGE6JHtnZW5lVmFsdWUuYX1gLCBgJCYsYjoke2Jhc2VHZW5lTWFwW2dlbmVdLmJ9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkc3RBbGxlbGVTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdHdvIGFsbGVsZSBzdHJpbmdzLCByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgaW4gd2hpY2ggbWlzc2luZyBhbGxlbGVzXG4gICAqIGluIHRoZSBmaXJzdCBhcmUgcmVwbGFjZWQgYnkgZGVmYXVsdHMgcHJvdmlkZWQgYnkgdGhlIHNlY29uZCBhbGxlbGUgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlQWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gdXNlIGFzIGRlZmF1bHRzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSB1cGRhdGVkIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiXG4gICAqL1xuICBzdGF0aWMgZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VBbGxlbGVTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlR2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYmFzZUFsbGVsZVN0cmluZyk7XG4gICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuZmlsbEluTWlzc2luZ0FsbGVsZXNGcm9tR2VuZU1hcChnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlR2VuZU1hcCk7XG4gIH1cblxuICBzdGF0aWMgbnVtYmVyT2ZCcmVlZGluZ01vdmVzVG9SZWFjaERyYWtlKG9yZ2FuaXNtMSwgb3JnYW5pc20yLCBjaGFuZ2VhYmxlQWxsZWxlczEsIGNoYW5nZWFibGVBbGxlbGVzMiwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB2YXIgbW92ZXMgPSAwLFxuICAgICAgICBvcmcxQWxsZWxlcyA9IG9yZ2FuaXNtMS5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIG9yZzJBbGxlbGVzID0gb3JnYW5pc20yLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KCcsJykubWFwKGEgPT4gYS5zcGxpdCgnOicpWzFdKSxcbiAgICAgICAgdGFyZ2V0Y2hhcnMgPSB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICB0cmFpdFJ1bGVzID0gb3JnYW5pc20xLnNwZWNpZXMudHJhaXRSdWxlcztcblxuICAgIGZvciAodmFyIHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICAgIGlmICh0cmFpdFJ1bGVzLmhhc093blByb3BlcnR5KHRyYWl0KSkge1xuICAgICAgICB2YXIgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRjaGFyc1t0cmFpdF1dLFxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gSW5maW5pdHk7XG4gICAgICAgIGlmIChwb3NzaWJsZVNvbHV0aW9ucyAmJiBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGk8aWk7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0sXG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgPSAwLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24yID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqaiA9IHNvbHV0aW9uLmxlbmd0aDsgajxqajsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBhbGxlbGUxID0gc29sdXRpb25bal0sXG4gICAgICAgICAgICAgICAgICBhbGxlbGUyID0gaiUyID09PSAwID8gc29sdXRpb25baisxXSA6IHNvbHV0aW9uW2otMV0sXG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gMDtcbiAgICAgICAgICAgICAgaWYgKG9yZzFBbGxlbGVzLmluZGV4T2YoYWxsZWxlMSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTEgJiYgKGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMxLmluZGV4T2YoYWxsZWxlMS50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG9yZzJBbGxlbGVzLmluZGV4T2YoYWxsZWxlMikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbGVsZTIgJiYgKGNoYW5nZWFibGVBbGxlbGVzMi5pbmRleE9mKGFsbGVsZTIpID4gLTEgfHxcbiAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoaiUyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjEgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiArPSBzb2x1dGlvbk1vdmVzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGggPSBNYXRoLm1pbihzaG9ydGVzdFBhdGgsIE1hdGgubWluKG1vdmVzRm9yU29sdXRpb24xLCBtb3Zlc0ZvclNvbHV0aW9uMikpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGNoYW5nZXMsIGluY2x1ZGluZyBhbGxlbGUgY2hhbmdlcyBhbmQgc2V4IGNoYW5nZXMsXG4gICAqIHJlcXVpcmVkIHRvIG1hdGNoIHRoZSBwaGVub3R5cGUgb2YgdGhlICd0ZXN0T3JnYW5pc20nIHRvIHRoYXQgb2YgdGhlICd0YXJnZXRPcmdhbmlzbScuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0ZXN0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gd2hpY2ggY2hhbmdlcyB3b3VsZCBhcHBseVxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGFyZ2V0T3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdGhhdCBzZXJ2ZXMgYXMgZGVzdGluYXRpb25cbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RPcmdhbmlzbSwgdGFyZ2V0T3JnYW5pc20pIHtcbiAgICB0ZXN0T3JnYW5pc20gPSB0aGlzLmVuc3VyZVZhbGlkT3JnYW5pc20odGVzdE9yZ2FuaXNtKTtcbiAgICB0YXJnZXRPcmdhbmlzbSA9IHRoaXMuZW5zdXJlVmFsaWRPcmdhbmlzbSh0YXJnZXRPcmdhbmlzbSk7XG5cbiAgICBsZXQgcmVxdWlyZWRDaGFuZ2VDb3VudCA9IEdlbmV0aWNzVXRpbHMubnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5nZW5ldGljcy5nZW5vdHlwZS5hbGxBbGxlbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5zcGVjaWVzLnRyYWl0UnVsZXMpO1xuICAgIGlmICh0ZXN0T3JnYW5pc20uc2V4ICE9PSB0YXJnZXRPcmdhbmlzbS5zZXgpXG4gICAgICArK3JlcXVpcmVkQ2hhbmdlQ291bnQ7XG5cbiAgICByZXR1cm4gcmVxdWlyZWRDaGFuZ2VDb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgdG8gbWFrZSB0aGUgcGhlbm90eXBlIG9mXG4gICAqIHRoZSBvcmdhbmlzbSBjaGFyYWN0ZXJpemVkIGJ5ICd0ZXN0Q2hhcmFjdGVyc3RpY3MnIG1hdGNoIHRoYXQgb2YgdGhlIG9yZ2FuaXNtXG4gICAqIGNoYXJhY3Rlcml6ZWQgYnkgJ3RhcmdldENoYXJhY3RlcmlzdGljcycuIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0ZXN0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzIC0gdGhlIGNoYXJhY3RlcmlzdGljcyBvZiB0aGUgdGFyZ2V0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRlc3RBbGxlbGVzIC0gdGhlIGFycmF5IG9mIGFsbGVsZXMgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgb2YgdGhlIG9yZ2FuaXNtc1xuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIG51bWJlciBvZiBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCBmb3IgdGhlIHBoZW5vdHlwZXMgdG8gbWF0Y2hcbiAgICovXG4gIHN0YXRpYyBudW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKHRlc3RDaGFyYWN0ZXJpc3RpY3MsIHRhcmdldENoYXJhY3RlcmlzdGljcywgdGVzdEFsbGVsZXMsIHRyYWl0UnVsZXMpIHtcbiAgICBjb25zdCBhbGxlbGVzID0gdGVzdEFsbGVsZXM7XG4gICAgbGV0ICAgbW92ZXMgPSAwO1xuXG4gICAgZm9yIChjb25zdCB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgaWYgKHRlc3RDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdICE9PSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdKSB7XG4gICAgICAgICAgLy8gZmlyc3Qgd2UgaGF2ZSB0byB3b3JrIG91dCB3aGF0IGFsbGVsZXMgdGhlIG9yaWdpbmFsIGRyYWtlIGhhcyB0aGF0IGNvcnJlc3BvbmQgdG9cbiAgICAgICAgICAvLyB0aGVpciBub24tbWF0Y2hpbmcgdHJhaXRcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVRyYWl0QWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcyk7XG4gICAgICAgICAgbGV0ICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocG9zc2libGVUcmFpdEFsbGVsZXMuaW5kZXhPZihhbGxlbGVzW2ldKSA+PSAwKXtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNBbGxlbGVzLnB1c2goYWxsZWxlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG5vdyB3b3JrIG91dCB0aGUgc21hbGxlc3QgbnVtYmVyIG9mIHN0ZXBzIHRvIGdldCBmcm9tIHRoZXJlIHRvIHRoZSBkZXNpcmVkIGNoYXJhY3RlcmlzdGljXG4gICAgICAgICAgY29uc3QgcG9zc2libGVTb2x1dGlvbnMgPSB0cmFpdFJ1bGVzW3RyYWl0XVt0YXJnZXRDaGFyYWN0ZXJpc3RpY3NbdHJhaXRdXTtcbiAgICAgICAgICBsZXQgICBzaG9ydGVzdFBhdGhMZW5ndGggPSBJbmZpbml0eTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBwb3NzaWJsZVNvbHV0aW9ucy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXS5zbGljZSgpLFxuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIGpqID0gY2hhcmFjdGVyaXN0aWNBbGxlbGVzLmxlbmd0aDsgaiA8IGpqOyBqKyspe1xuICAgICAgICAgICAgICBpZiAoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pID09PSAtMSl7XG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uLnNwbGljZShzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSksIDEpOyAvLyBhbHJlYWR5IG1hdGNoZWQgdGhpcyBvbmUsIGNhbid0IG1hdGNoIGl0IGFnYWluXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IChwYXRoTGVuZ3RoIDwgc2hvcnRlc3RQYXRoTGVuZ3RoKSA/IHBhdGhMZW5ndGggOiBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW92ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSBhbGxlbGVzIHByZXNlbnQgaW4gdGhlIGZ1bGx5IHNwZWNpZmllZCBvcmdhbmlzbSwgYnV0IG5vdCBpblxuICAgKiB0aGUgcGFydGlhbGx5IHNwZWNpZmllZCBvcmdhbmlzbS4gRm9yIGV4YW1wbGUsIGlmIGEgZmVtYWxlIGFuZCBtYWxlIG9yZ2FuaXNtIGFyZSBnaXZlbiwgdGhlIHJldHVybmVkIHN0cmluZ1xuICAgKiB3aWxsIHJlcHJlc2VudCB0aGUgc2V4LWxpbmtlZCBjaHJvbW9zb21lcyB0aGF0IHRoZSBtYWxlIG9yZ2FuaXNtIGxhY2tzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gZnVsbHlTcGVjaWZpZWRPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSBjb250YWluaW5nIHRoZSBleHRyYSBhbGxlbGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsbHlTcGVjaWZpZWRPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSBsYWNraW5nIHRoZSBleHRyYSBhbGxlbGVzXG4gICAqIEByZXR1cm4ge3N0cmluZ30gLSBhIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBleHRyYSBhbGxlbGVzLCBlLmcuIFwiYjpELGI6Qm9nLGI6cmhcIlxuICAgKi9cbiAgc3RhdGljIGNvbXB1dGVFeHRyYUFsbGVsZXMoZnVsbHlTcGVjaWZpZWRPcmdhbmlzbSwgcGFydGlhbGx5U3BlY2lmaWVkT3JnYW5pc20pIHtcbiAgICBsZXQgZnVsbEFsbGVsZXMgPSBmdWxseVNwZWNpZmllZE9yZ2FuaXNtLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KFwiLFwiKTtcbiAgICBsZXQgcGFydGlhbEFsbGVsZXMgPSBwYXJ0aWFsbHlTcGVjaWZpZWRPcmdhbmlzbS5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdChcIixcIik7XG4gICAgbGV0IGV4dHJhQWxsZWxlcyA9IGZ1bGxBbGxlbGVzLmZpbHRlcihmdW5jdGlvbihhbGxlbGUpIHsgcmV0dXJuIHBhcnRpYWxBbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA9PT0gLTE7IH0pO1xuICAgIHJldHVybiBleHRyYUFsbGVsZXMuam9pbihcIixcIik7XG4gIH1cblxuICAvKipcbiAgICogR29lcyB0aHJvdWdoIHRoZSB0cmFpdFJ1bGVzIHRvIGZpbmQgb3V0IHdoYXQgdW5pcXVlIGFsbGVsZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHRyYWl0XG4gICAqIGUuZy4gRm9yIFwidGFpbFwiIGl0IHdpbGwgcmV0dXJuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl0uIEFkYXB0ZWQgZnJvbTpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vY29uY29yZC1jb25zb3J0aXVtL0dlbml2ZXJzZS1TcHJvdXRDb3JlL2Jsb2IvbWFzdGVyL2ZyYW1ld29ya3MvZ2VuaXZlcnNlL2NvbnRyb2xsZXJzL21hdGNoLmpzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFpdCAtIG5hbWUgb2YgdHJhaXQsIGUuZy4gXCJ0YWlsXCJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRyYWl0UnVsZXMgLSB0aGUgdHJhaXRSdWxlcyBvZiB0aGUgQmlvTG9naWNhLlNwZWNpZXMgd2hvc2UgdHJhaXRzIGFyZSBvZiBpbnRlcmVzdFxuICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSBhcnJheSBvZiBhbGxlbGUgc3RyaW5ncywgZS5nLiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdXG4gICAqL1xuICBzdGF0aWMgX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0ID0ge307XG4gIHN0YXRpYyBjb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKSB7XG4gICAgaWYgKEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSkge1xuICAgICAgcmV0dXJuIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XTtcbiAgICB9XG5cbiAgICBsZXQgYWxsZWxlc0hhc2ggPSB7fSxcbiAgICAgICAgYWxsZWxlcyAgICAgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNoYXJhY3RlcmlzdGljIGluIHRyYWl0UnVsZXNbdHJhaXRdKXtcbiAgICAgICAgZm9yIChjb25zdCBwb3NzaWJpbGVBbGxlbGVzQ29tYm8gaW4gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdKSB7XG4gICAgICAgICAgaWYgKHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXS5oYXNPd25Qcm9wZXJ0eShwb3NzaWJpbGVBbGxlbGVzQ29tYm8pKXtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgYWxsZWxlc0hhc2hbdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib11baV1dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGFsbGVsZSBpbiBhbGxlbGVzSGFzaCl7XG4gICAgICBhbGxlbGVzLnB1c2goYWxsZWxlKTtcbiAgICB9XG5cbiAgICBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0gPSBhbGxlbGVzOyAgLy8gc3RvcmUgc28gd2UgZG9uJ3QgbmVlZCB0byByZWNhbGN1bGF0ZSBpdFxuICAgIHJldHVybiBhbGxlbGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgRHJha2Ugb2JqZWN0IGludG8gYSBCaW9sb2dpY2Egb3JnYW5pc20uXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkcmFrZSAtIHRoZSBkcmFrZSB0byBjb252ZXJ0XG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0aGUgZHJha2UgYXMgYW4gT3JnYW5pc21cbiAgICovXG4gIHN0YXRpYyBjb252ZXJ0RHJha2VUb09yZyhkcmFrZSkge1xuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBkcmFrZS5hbGxlbGVTdHJpbmcsIGRyYWtlLnNleCk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gQ2hhbGxlbmdlIGluc3RydWN0aW9uc1xuICBcIn5GVl9FR0dfR0FNRS5CUkVFRF9CVVRUT05cIjogXCJCUkVFRFwiLFxuXG4gIC8vIENoYWxsZW5nZSBpbnN0cnVjdGlvbnNcbiAgXCJ+RUdHX0dBTUVfMy5DSFJPTU9TT01FU19USVRMRVwiOiBcIkNocm9tb3NvbWVzXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJVQ1RJT05TX1RJVExFXCI6IFwiSW5zdHJ1Y3Rpb25zXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSEVBRElOR1wiOiBcIlNvcnQgdGhlc2UgZWdncyFcIixcbiAgXCJ+RUdHX0dBTUVfMy5JTlNUUl9JVEVNMVwiOiBcIlNjb3BlIGFuIGVnZyB0byBzZWUgYSBiYWJ5J3MgY2hyb21vc29tZXMuXCIsXG4gIFwifkVHR19HQU1FXzMuSU5TVFJfSVRFTTJcIjogXCJDbGljayB0aGUgY29ycmVjdCBiYXNrZXQgZm9yIHRoZSBlZ2cuXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIHBvcHVwIGFsZXJ0c1xuICBcIn5BTEVSVC5USVRMRS5HT09EX1dPUktcIjogXCJHb29kIHdvcmshXCIsXG4gIFwifkFMRVJULlRJVExFLk1JU1NJT05fQUNDT01QTElTSEVEXCI6IFwiTWlzc2lvbiBBY2NvbXBsaXNoZWQhXCIsXG4gIFwifkFMRVJULlRJVExFLklOQ09SUkVDVF9EUkFLRVwiOiBcIlRoYXQncyBub3QgdGhlIGRyYWtlIVwiLFxuICBcIn5BTEVSVC5USVRMRS5FR0dfTUlTTUFUQ0hcIjogXCJUaGF0IGVnZyBkb2Vzbid0IGJlbG9uZyFcIixcbiAgXCJ+QUxFUlQuVElUTEUuTUlTVEFLRVwiOiBcIlVoIG9oIVwiLFxuICBcIn5BTEVSVC5ORVdfUElFQ0VfT0ZfQ09JTlwiOiBcIllvdSBlYXJuZWQgYSAkezB9IHBpZWNlIG9mIHRoZSBjb2luIVwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9HT0xEXCI6IFwiZ29sZFwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9TSUxWRVJcIjogXCJzaWx2ZXJcIixcbiAgXCJ+QUxFUlQuQVdBUkRfTEVWRUxfQlJPTlpFXCI6IFwiYnJvbnplXCIsXG4gIFwifkFMRVJULkNPTVBMRVRFX0NPSU5cIjogXCJZb3UgaGF2ZSBlYXJuZWQgYWxsIHRoZSBwaWVjZXMgb2YgdGhpcyBjb2luIVwiLFxuICBcIn5BTEVSVC5DT01QTEVURV9MQVNUX01JU1NJT05cIjogXCJZb3UgaGF2ZSBjb21wbGV0ZWQgdGhlIGxhc3QgbWlzc2lvbiFcIixcbiAgXCJ+QUxFUlQuQ09SUkVDVF9EUkFLRVwiOiBcIlRoZSBkcmFrZSB5b3UgaGF2ZSBjcmVhdGVkIG1hdGNoZXMgdGhlIHRhcmdldCBkcmFrZS5cIixcbiAgXCJ+QUxFUlQuSU5DT1JSRUNUX0RSQUtFXCI6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgZG9lc24ndCBtYXRjaCB0aGUgdGFyZ2V0IGRyYWtlLlxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgXCJ+QUxFUlQuRUdHX0JBU0tFVF9NQVRDSFwiOiBcIlRoZSBlZ2cgeW91IGhhdmUgc2VsZWN0ZWQgYmVsb25ncyBpbiB0aGF0IGJhc2tldC5cIixcbiAgXCJ+QUxFUlQuRUdHX0JBU0tFVF9NSVNNQVRDSFwiOiBcIlRoZSBlZ2cgeW91IGhhdmUgc2VsZWN0ZWQgZG9lc24ndCBiZWxvbmcgaW4gdGhhdCBiYXNrZXQuXCIsXG4gIFwifkFMRVJULkRVUExJQ0FURV9EUkFLRVwiOiBcIllvdSBhbHJlYWR5IGhhdmUgYSBkcmFrZSB0aGF0IGxvb2tzIGp1c3QgbGlrZSB0aGF0IVwiLFxuXG4gIC8vIENoYWxsZW5nZSBidXR0b25zXG4gIFwifkJVVFRPTi5PS1wiOiBcIk9LXCIsXG4gIFwifkJVVFRPTi5UUllfQUdBSU5cIjogXCJUcnkgYWdhaW5cIixcbiAgXCJ+QlVUVE9OLlRSWV9BTk9USEVSX0VHR1wiOiBcIlRyeSBhbm90aGVyIGVnZyFcIixcbiAgXCJ+QlVUVE9OLlJFVFJZX0NIQUxMRU5HRVwiOiBcIlJldHJ5IGNoYWxsZW5nZVwiLFxuICBcIn5CVVRUT04uUkVUUllfTUlTU0lPTlwiOiBcIlJldHJ5IG1pc3Npb25cIixcbiAgXCJ+QlVUVE9OLkNPTlRJTlVFXCI6IFwiQ29udGludWVcIixcbiAgXCJ+QlVUVE9OLk5FWFRfVFJJQUxcIjogXCJOZXh0IHRyaWFsXCIsXG4gIFwifkJVVFRPTi5ORVhUX0NIQUxMRU5HRVwiOiBcIk5leHQgY2hhbGxlbmdlXCIsXG4gIFwifkJVVFRPTi5FTkRfTUlTU0lPTlwiOiBcIkVuZCBtaXNzaW9uXCIsXG4gIFwifkJVVFRPTi5ORVhUX01JU1NJT05cIjogXCJOZXh0IG1pc3Npb25cIixcbiAgXCJ+QlVUVE9OLlBMQVlHUk9VTkRfTU9WRV9GT1JXQVJEXCI6IFwiQnJpbmcgSXQgT24hXCIsXG4gIFwifkJVVFRPTi5DSEVDS19EUkFLRVwiOiBcIkNoZWNrIERyYWtlXCIsXG4gIFwifkJVVFRPTi5TQVZFX0RSQUtFXCI6IFwiU2F2ZSB0aGlzXCIsXG4gIFwifkJVVFRPTi5TVUJNSVRcIjogXCJTdWJtaXRcIixcbiAgXCJ+QlVUVE9OLlJFU0VUXCI6IFwiUmVzZXRcIixcbiAgXCJ+QlVUVE9OLkZFUlRJTElaRV9ESVNBQkxFRFwiOiBcIk1ha2UgYSBiYWJ5XCIsXG4gIFwifkJVVFRPTi5GRVJUSUxJWkVcIjogXCJNYWtlIGEgYmFieSEg4p2k77iPXCIsXG5cbiAgXCJ+TEVWRUxfSU5ESUNBVE9SLkxFVkVMX0xBQkVMXCI6IFwiTEVWRUxcIixcbiAgXCJ+VFJJQUxfQ09VTlRFUi5UUklBTF9MQUJFTFwiOiBcIlRSSUFMXCIsXG4gIFwiflRSSUFMX0NPVU5URVIuVFJJQUxfbl9PRl9OXCI6IFwiJHswfVxceEEwXFx4QTBvZlxceEEwXFx4QTAkezF9XCIsXG5cbiAgLy8gTWVzc2FnZXMgZnJvbSBJVFNcbiAgXCJ+SVRTLkdSRUVUSU5HXCI6IFwiSGkgdGhlcmUgdXNlciFcIlxufTtcbiIsImltcG9ydCBlbl91cyBmcm9tICcuL2VuLXVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBlbl91c1xufTtcbiIsImltcG9ydCB0cmFuc2xhdGlvbnMgZnJvbSAnLi9sYW5nJztcblxuY29uc3QgZGVmYXVsdExhbmcgPSBcImVuX3VzXCIsXG4gICAgICB2YXJSZWdFeHAgPSAvXFwkXFx7XFxzKihcXGQrKVxccypcXH0vZyxcbiAgICAgIGVycm9yID0gXCIqKiBUUkFOU0xBVElPTiBFUlJPUiAqKlwiO1xuXG5jb25zdCB0cmFuc2xhdGVTdHJpbmcgPSAoa2V5LCBsYW5nKSA9PiB0cmFuc2xhdGlvbnNbbGFuZ10gJiYgdHJhbnNsYXRpb25zW2xhbmddW2tleV0gfHwga2V5O1xuXG4vKipcbiAqIFRyYW5zbGF0ZXMgc3RyaW5ncyBpZiB0aGV5IGV4aXN0IGluIHRoZSBsYW5ndWFnZSBmaWxlLiBPdGhlcndpc2UsIHBhc3NlcyBiYWNrXG4gKiBzdHJpbmcgdW5jaGFuZ2VkLlxuICogWW91IGNhbiBhbHNvIHBhc3MgYW4gYXJyYXkgb2Ygc3RyaW5ncywgd2hlcmUgdGhlIGZpcnN0IGlzIHRoZSBtYWluIHRleHQsIGFuZFxuICogdGhlIG90aGVycyBhcmUgdmFyaWFibGVzIHRvIGJlIHBsYWNlZCBpbiB0aGUgc3RyaW5nOlxuICogICBbXCJHb29kICR7MH0sICR7MX1cIiwgXCJldmVuaW5nXCIsIFwiVXNlclwiXVxuICogd2lsbCByZXR1cm4gXCJHb29kIGV2ZW5pbmcsIFVzZXJcIi4gRWFjaCBzdHJpbmcgaW4gdGhlIGFycmF5IG1heSBvcHRpb25hbGx5IGJlXG4gKiBpbiB0aGUgbGFuZ3VhZ2UgZmlsZTpcbiAqICAgW1wiflRJTUVfU0VOU0lUSVZFX0dSRUVUSU5HXCIsIFwiflRJTUUuRVZFTklOR1wiLCBcIlVzZXJcIl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNsYXRlKGtleSwgbGFuZz1kZWZhdWx0TGFuZykge1xuICBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiB0cmFuc2xhdGVTdHJpbmcoa2V5LCBsYW5nKTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICBsZXQgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGVTdHJpbmcoa2V5WzBdLCBsYW5nKTtcbiAgICByZXR1cm4gdHJhbnNsYXRpb24ucmVwbGFjZSh2YXJSZWdFeHAsIChtYXRjaCwgaWQpID0+XG4gICAgICBrZXlbKytpZF0gPyB0cmFuc2xhdGVTdHJpbmcoa2V5W2lkXSwgbGFuZykgOiBlcnJvcik7XG4gIH0gZWxzZSBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZyhcIkNvdWxkIG5vdCB0cmFuc2xhdGU6IFwiLCBrZXkpO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cbiJdfQ==
