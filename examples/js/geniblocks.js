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

},{"./gamete":66,"react-motion":30}],53:[function(require,module,exports){
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

},{"./organism":74,"react-motion":30}],54:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _egg = require('./egg');

var _egg2 = _interopRequireDefault(_egg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EGG_IMAGE_WIDTH_SMALL = _egg.EGG_IMAGE_WIDTH / 3;

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
          return _react2.default.createElement(_egg2.default, { egg: egg, key: 'basket-egg-' + index, isSelected: true,
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

},{"./egg":62}],55:[function(require,module,exports){
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
  orgName: _react.PropTypes.string
};

exports.default = ChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":81,"./allele":51,"./chromosome-image":58,"./gene-label":67}],60:[function(require,module,exports){
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

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _egg = require('./egg.js');

var _egg2 = _interopRequireDefault(_egg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EggClutchView = function EggClutchView(_ref) {
  var eggs = _ref.eggs,
      _ref$idPrefix = _ref.idPrefix,
      idPrefix = _ref$idPrefix === undefined ? 'egg-' : _ref$idPrefix,
      selectedIndex = _ref.selectedIndex,
      onClick = _ref.onClick;


  var ODD_EGG_MARGIN = 8,
      EVEN_EGG_MARGIN = 0;
  var orgViews = void 0;

  function eggViewForIndex(egg, index, margin) {
    var id = '' + idPrefix + index,
        visibilityStyle = egg && egg.basket == null ? {} : { visibility: 'hidden' },
        eggStyle = Object.assign({ marginLeft: margin, marginRight: margin }, visibilityStyle);
    return _react2.default.createElement(_egg2.default, { egg: egg, id: id, key: id, index: index, displayStyle: eggStyle,
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
          spacer = _react2.default.createElement(_egg2.default, { egg: null, key: spacerID, displayStyle: spacerStyle });
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
      prev.push(_react2.default.createElement(_egg2.default, { egg: null, key: spacerID, displayStyle: spacerStyle }));
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

},{"./egg.js":62}],62:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EGG_IMAGE_HEIGHT = exports.EGG_IMAGE_WIDTH = undefined;

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

var EggView = function (_React$Component) {
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
exports.default = EggView;

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

},{"./animated-gamete":52}],65:[function(require,module,exports){
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

},{"./animated-gamete":52}],66:[function(require,module,exports){
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

},{"./chromosome-image":58}],69:[function(require,module,exports){
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

},{"./chromosome":59}],70:[function(require,module,exports){
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

},{"./circular-glow":60}],71:[function(require,module,exports){
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

},{"../utilities/translate":84,"./button":55,"./challenge-award":56,"react-overlays/lib/Modal":36}],72:[function(require,module,exports){
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

},{"./circular-glow":60,"./organism":74}],74:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDrakeImageUrl = getDrakeImageUrl;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDrakeImageUrl(org) {
  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/";
  return org ? baseUrl + org.getImageName() : null;
}

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

  var url = getDrakeImageUrl(org),

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

},{"./pen":76,"./stats":79,"react-simpletabs":48}],76:[function(require,module,exports){
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

},{"./circular-glow":60}],78:[function(require,module,exports){
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

},{"./components/allele":51,"./components/allele-filters":50,"./components/animated-gamete":52,"./components/animated-organism":53,"./components/basket-set":54,"./components/button":55,"./components/challenge-award":56,"./components/change-sex-buttons":57,"./components/chromosome":59,"./components/chromosome-image":58,"./components/circular-glow":60,"./components/egg-clutch":61,"./components/feedback":63,"./components/fertilizing-gamete":64,"./components/gamete":66,"./components/gamete-pool":65,"./components/gene-label":67,"./components/genome":69,"./components/genome-test":68,"./components/glow-background":70,"./components/modal-alert":71,"./components/ordinal-organism":72,"./components/organism":74,"./components/organism-glow":73,"./components/pen":76,"./components/pen-stats":75,"./components/question-glow":77,"./components/question-organism-glow":78,"./components/stats":79,"./utilities/genetics-utils":81}],81:[function(require,module,exports){
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
  "~BUTTON.HATCH_DRAKE": "Hatch Drake",
  "~BUTTON.SAVE_DRAKE": "Save this",
  "~BUTTON.SUBMIT": "Submit",
  "~BUTTON.RESET": "Reset",
  "~BUTTON.FERTILIZE_DISABLED": "Make a baby",
  "~BUTTON.FERTILIZE": "Make a baby! ❤️",
  "~BUTTON.MALE": "Male",
  "~BUTTON.FEMALE": "Female",

  "~LABEL.YOUR_DRAKE": "Your Drake",
  "~LABEL.TARGET_DRAKE": "Target Drake",

  "~LEVEL_INDICATOR.LEVEL_LABEL": "LEVEL",

  "~COUNTER.TRIAL_LABEL": "TRIAL",
  "~COUNTER.SCORE_LABEL": "SCORE",
  "~COUNTER.n_OF_N": "${0}\xA0\xA0of\xA0\xA0${1}",

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL3V0aWxzL2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXNpbXBsZXRhYnMvZGlzdC9yZWFjdC1zaW1wbGV0YWJzLmpzIiwibm9kZV9tb2R1bGVzL3dhcm5pbmcvYnJvd3Nlci5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYWxsZWxlLWZpbHRlcnMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbmltYXRlZC1vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYmFza2V0LXNldC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYnV0dG9uLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaGFsbGVuZ2UtYXdhcmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NoYW5nZS1zZXgtYnV0dG9ucy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS1pbWFnZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hyb21vc29tZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZWdnLWNsdXRjaC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZWdnLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZWVkYmFjay5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUtcG9vbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUtdGVzdC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL21vZGFsLWFsZXJ0LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmRpbmFsLW9yZ2FuaXNtLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLXN0YXRzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIiwic3JjL2NvZGUvZ2VuaWJsb2Nrcy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9nZW5ldGljcy11dGlscy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9sYW5nL2VuLXVzLmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL2xhbmcvaW5kZXguanMiLCJzcmMvY29kZS91dGlsaXRpZXMvdHJhbnNsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYWJlbEhlbHBlcnMgPSByZXF1aXJlKCcuL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKlxyXG4gKiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gYWN0aXZlRWxlbWVudDtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gYWN0aXZlRWxlbWVudCgpIHtcbiAgdmFyIGRvYyA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMF07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcbnZhciBoYXNDbGFzcyA9IHJlcXVpcmUoJy4vaGFzQ2xhc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtlbHNlIGlmICghaGFzQ2xhc3MoZWxlbWVudCkpIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgcmV0dXJuICEhY2xhc3NOYW1lICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7ZWxzZSByZXR1cm4gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIGNsYXNzTmFtZSArICcgJykgIT09IC0xO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRDbGFzczogcmVxdWlyZSgnLi9hZGRDbGFzcycpLFxuICByZW1vdmVDbGFzczogcmVxdWlyZSgnLi9yZW1vdmVDbGFzcycpLFxuICBoYXNDbGFzczogcmVxdWlyZSgnLi9oYXNDbGFzcycpXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtlbHNlIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NOYW1lICsgJyg/OlxcXFxzfCQpJywgJ2cnKSwgJyQxJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvZmYgPSBmdW5jdGlvbiBvZmYoKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuXG4gIG9mZiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmY7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvbiA9IGZ1bmN0aW9uIG9uKCkge307XG5cbmlmIChjYW5Vc2VET00pIHtcbiAgb24gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICByZXR1cm4gbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfTtlbHNlIGlmIChkb2N1bWVudC5hdHRhY2hFdmVudCkgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBub2RlLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG93bmVyRG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIG93bmVyRG9jdW1lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcblxudmFyIGNvbnRhaW5zID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJvb3QgPSBjYW5Vc2VET00gJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMgPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0LmNvbnRhaW5zKG5vZGUpO1xuICB9IDogcm9vdCAmJiByb290LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dCA9PT0gbm9kZSB8fCAhIShjb250ZXh0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGUpICYgMTYpO1xuICB9IDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICBpZiAobm9kZSkgZG8ge1xuICAgICAgaWYgKG5vZGUgPT09IGNvbnRleHQpIHJldHVybiB0cnVlO1xuICAgIH0gd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IG5vZGUud2luZG93ID8gbm9kZSA6IG5vZGUubm9kZVR5cGUgPT09IDkgPyBub2RlLmRlZmF1bHRWaWV3IHx8IG5vZGUucGFyZW50V2luZG93IDogZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4uL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbnZhciBfdXRpbENhbWVsaXplU3R5bGUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZTIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsQ2FtZWxpemVTdHlsZSk7XG5cbnZhciBycG9zaXRpb24gPSAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC87XG52YXIgcm51bW5vbnB4ID0gL14oWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpKSg/IXB4KVthLXolXSskL2k7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2dldENvbXB1dGVkU3R5bGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIEVsZW1lbnQgcGFzc2VkIHRvIGBnZXRDb21wdXRlZFN0eWxlKClgJyk7XG4gIHZhciBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgcmV0dXJuICdkZWZhdWx0VmlldycgaW4gZG9jID8gZG9jLmRlZmF1bHRWaWV3Lm9wZW5lciA/IG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB7IC8vaWUgOCBcIm1hZ2ljXCIgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8xLjExLXN0YWJsZS9zcmMvY3NzL2N1ckNTUy5qcyNMNzJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlKHByb3ApIHtcbiAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG5cbiAgICAgIHByb3AgPSAoMCwgX3V0aWxDYW1lbGl6ZVN0eWxlMlsnZGVmYXVsdCddKShwcm9wKTtcblxuICAgICAgaWYgKHByb3AgPT0gJ2Zsb2F0JykgcHJvcCA9ICdzdHlsZUZsb2F0JztcblxuICAgICAgdmFyIGN1cnJlbnQgPSBub2RlLmN1cnJlbnRTdHlsZVtwcm9wXSB8fCBudWxsO1xuXG4gICAgICBpZiAoY3VycmVudCA9PSBudWxsICYmIHN0eWxlICYmIHN0eWxlW3Byb3BdKSBjdXJyZW50ID0gc3R5bGVbcHJvcF07XG5cbiAgICAgIGlmIChybnVtbm9ucHgudGVzdChjdXJyZW50KSAmJiAhcnBvc2l0aW9uLnRlc3QocHJvcCkpIHtcbiAgICAgICAgLy8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xuICAgICAgICB2YXIgbGVmdCA9IHN0eWxlLmxlZnQ7XG4gICAgICAgIHZhciBydW5TdHlsZSA9IG5vZGUucnVudGltZVN0eWxlO1xuICAgICAgICB2YXIgcnNMZWZ0ID0gcnVuU3R5bGUgJiYgcnVuU3R5bGUubGVmdDtcblxuICAgICAgICAvLyBQdXQgaW4gdGhlIG5ldyB2YWx1ZXMgdG8gZ2V0IGEgY29tcHV0ZWQgdmFsdWUgb3V0XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSBub2RlLmN1cnJlbnRTdHlsZS5sZWZ0O1xuXG4gICAgICAgIHN0eWxlLmxlZnQgPSBwcm9wID09PSAnZm9udFNpemUnID8gJzFlbScgOiBjdXJyZW50O1xuICAgICAgICBjdXJyZW50ID0gc3R5bGUucGl4ZWxMZWZ0ICsgJ3B4JztcblxuICAgICAgICAvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG4gICAgICAgIHN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgICAgICBpZiAocnNMZWZ0KSBydW5TdHlsZS5sZWZ0ID0gcnNMZWZ0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi4vdXRpbC9jYW1lbGl6ZVN0eWxlJyksXG4gICAgaHlwaGVuYXRlID0gcmVxdWlyZSgnLi4vdXRpbC9oeXBoZW5hdGVTdHlsZScpLFxuICAgIF9nZXRDb21wdXRlZFN0eWxlID0gcmVxdWlyZSgnLi9nZXRDb21wdXRlZFN0eWxlJyksXG4gICAgcmVtb3ZlU3R5bGUgPSByZXF1aXJlKCcuL3JlbW92ZVN0eWxlJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlKG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICB2YXIgY3NzID0gJycsXG4gICAgICBwcm9wcyA9IHByb3BlcnR5O1xuXG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vZGUuc3R5bGVbY2FtZWxpemUocHJvcGVydHkpXSB8fCBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5nZXRQcm9wZXJ0eVZhbHVlKGh5cGhlbmF0ZShwcm9wZXJ0eSkpO2Vsc2UgKHByb3BzID0ge30pW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSBpZiAoaGFzLmNhbGwocHJvcHMsIGtleSkpIHtcbiAgICAhcHJvcHNba2V5XSAmJiBwcm9wc1trZXldICE9PSAwID8gcmVtb3ZlU3R5bGUobm9kZSwgaHlwaGVuYXRlKGtleSkpIDogY3NzICs9IGh5cGhlbmF0ZShrZXkpICsgJzonICsgcHJvcHNba2V5XSArICc7JztcbiAgfVxuXG4gIG5vZGUuc3R5bGUuY3NzVGV4dCArPSAnOycgKyBjc3M7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVTdHlsZShub2RlLCBrZXkpIHtcbiAgcmV0dXJuICdyZW1vdmVQcm9wZXJ0eScgaW4gbm9kZS5zdHlsZSA/IG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KSA6IG5vZGUuc3R5bGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59OyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW1wiZXhwb3J0c1wiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2Uge1xuICAgIGZhY3Rvcnkocm9vdC5iYWJlbEhlbHBlcnMgPSB7fSk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIGJhYmVsSGVscGVycyA9IGdsb2JhbDtcblxuICBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICBcImRlZmF1bHRcIjogb2JqXG4gICAgfTtcbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHJIeXBoZW4gPSAvLSguKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uockh5cGhlbiwgZnVuY3Rpb24gKF8sIGNocikge1xuICAgIHJldHVybiBjaHIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59OyIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yYWViOGEyYTZiZWIwMDYxN2E0MjE3ZjdmODI4NDkyNGZhMmFkODE5L3NyYy92ZW5kb3IvY29yZS9jYW1lbGl6ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi9jYW1lbGl6ZScpO1xudmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBjYW1lbGl6ZShzdHJpbmcucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJVcHBlciA9IC8oW0EtWl0pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoclVwcGVyLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2h5cGhlbmF0ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoeXBoZW5hdGUgPSByZXF1aXJlKFwiLi9oeXBoZW5hdGVcIik7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCBcIi1tcy1cIik7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuL2luRE9NJyk7XG5cbnZhciBzaXplO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNhbGMpIHtcbiAgaWYgKCFzaXplIHx8IHJlY2FsYykge1xuICAgIGlmIChjYW5Vc2VET00pIHtcbiAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgIHNpemUgPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNpemU7XG59OyIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgdmFyIGdldE5hbm9TZWNvbmRzLCBocnRpbWUsIGxvYWRUaW1lO1xuXG4gIGlmICgodHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsKSAmJiBwZXJmb3JtYW5jZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwpICYmIHByb2Nlc3MuaHJ0aW1lKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoZ2V0TmFub1NlY29uZHMoKSAtIGxvYWRUaW1lKSAvIDFlNjtcbiAgICB9O1xuICAgIGhydGltZSA9IHByb2Nlc3MuaHJ0aW1lO1xuICAgIGdldE5hbm9TZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaHI7XG4gICAgICBociA9IGhydGltZSgpO1xuICAgICAgcmV0dXJuIGhyWzBdICogMWU5ICsgaHJbMV07XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IGdldE5hbm9TZWNvbmRzKCk7XG4gIH0gZWxzZSBpZiAoRGF0ZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIG5vdyA9IHJlcXVpcmUoJ3BlcmZvcm1hbmNlLW5vdycpXG4gICwgcm9vdCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93XG4gICwgdmVuZG9ycyA9IFsnbW96JywgJ3dlYmtpdCddXG4gICwgc3VmZml4ID0gJ0FuaW1hdGlvbkZyYW1lJ1xuICAsIHJhZiA9IHJvb3RbJ3JlcXVlc3QnICsgc3VmZml4XVxuICAsIGNhZiA9IHJvb3RbJ2NhbmNlbCcgKyBzdWZmaXhdIHx8IHJvb3RbJ2NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxuXG5mb3IodmFyIGkgPSAwOyAhcmFmICYmIGkgPCB2ZW5kb3JzLmxlbmd0aDsgaSsrKSB7XG4gIHJhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdSZXF1ZXN0JyArIHN1ZmZpeF1cbiAgY2FmID0gcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbCcgKyBzdWZmaXhdXG4gICAgICB8fCByb290W3ZlbmRvcnNbaV0gKyAnQ2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG59XG5cbi8vIFNvbWUgdmVyc2lvbnMgb2YgRkYgaGF2ZSByQUYgYnV0IG5vdCBjQUZcbmlmKCFyYWYgfHwgIWNhZikge1xuICB2YXIgbGFzdCA9IDBcbiAgICAsIGlkID0gMFxuICAgICwgcXVldWUgPSBbXVxuICAgICwgZnJhbWVEdXJhdGlvbiA9IDEwMDAgLyA2MFxuXG4gIHJhZiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgX25vdyA9IG5vdygpXG4gICAgICAgICwgbmV4dCA9IE1hdGgubWF4KDAsIGZyYW1lRHVyYXRpb24gLSAoX25vdyAtIGxhc3QpKVxuICAgICAgbGFzdCA9IG5leHQgKyBfbm93XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3AgPSBxdWV1ZS5zbGljZSgwKVxuICAgICAgICAvLyBDbGVhciBxdWV1ZSBoZXJlIHRvIHByZXZlbnRcbiAgICAgICAgLy8gY2FsbGJhY2tzIGZyb20gYXBwZW5kaW5nIGxpc3RlbmVyc1xuICAgICAgICAvLyB0byB0aGUgY3VycmVudCBmcmFtZSdzIHF1ZXVlXG4gICAgICAgIHF1ZXVlLmxlbmd0aCA9IDBcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoIWNwW2ldLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICBjcFtpXS5jYWxsYmFjayhsYXN0KVxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGUgfSwgMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIE1hdGgucm91bmQobmV4dCkpXG4gICAgfVxuICAgIHF1ZXVlLnB1c2goe1xuICAgICAgaGFuZGxlOiArK2lkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY2FuY2VsbGVkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIGlkXG4gIH1cblxuICBjYWYgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKHF1ZXVlW2ldLmhhbmRsZSA9PT0gaGFuZGxlKSB7XG4gICAgICAgIHF1ZXVlW2ldLmNhbmNlbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbikge1xuICAvLyBXcmFwIGluIGEgbmV3IGZ1bmN0aW9uIHRvIHByZXZlbnRcbiAgLy8gYGNhbmNlbGAgcG90ZW50aWFsbHkgYmVpbmcgYXNzaWduZWRcbiAgLy8gdG8gdGhlIG5hdGl2ZSByQUYgZnVuY3Rpb25cbiAgcmV0dXJuIHJhZi5jYWxsKHJvb3QsIGZuKVxufVxubW9kdWxlLmV4cG9ydHMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gIGNhZi5hcHBseShyb290LCBhcmd1bWVudHMpXG59XG5tb2R1bGUuZXhwb3J0cy5wb2x5ZmlsbCA9IGZ1bmN0aW9uKCkge1xuICByb290LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJhZlxuICByb290LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FmXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG52YXIgTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNb3Rpb24nLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8vIFRPT0Q6IHdhcm4gYWdhaW5zdCBwdXR0aW5nIGEgY29uZmlnIGluIGhlcmVcbiAgICBkZWZhdWx0U3R5bGU6IF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpLFxuICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QuUHJvcFR5cGVzLm51bWJlciwgX3JlYWN0LlByb3BUeXBlcy5vYmplY3RdKSkuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25SZXN0OiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgZGVmYXVsdFN0eWxlID0gX3Byb3BzLmRlZmF1bHRTdHlsZTtcbiAgICB2YXIgc3R5bGUgPSBfcHJvcHMuc3R5bGU7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlID0gZGVmYXVsdFN0eWxlIHx8IF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHN0eWxlKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXR5ID0gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGU6IGN1cnJlbnRTdHlsZSxcbiAgICAgIGN1cnJlbnRWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5LFxuICAgICAgbGFzdElkZWFsU3R5bGU6IGN1cnJlbnRTdHlsZSxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXR5OiBjdXJyZW50VmVsb2NpdHlcbiAgICB9O1xuICB9LFxuXG4gIHdhc0FuaW1hdGluZzogZmFsc2UsXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZTogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZSAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUoZGVzdFN0eWxlKSB7XG4gICAgdmFyIGRpcnR5ID0gZmFsc2U7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IF9zdGF0ZS5jdXJyZW50U3R5bGU7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9zdGF0ZS5jdXJyZW50VmVsb2NpdHk7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlID0gX3N0YXRlLmxhc3RJZGVhbFN0eWxlO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0eSA9IF9zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0eTtcblxuICAgIGZvciAodmFyIGtleSBpbiBkZXN0U3R5bGUpIHtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc3RTdHlsZSwga2V5KSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN0eWxlVmFsdWUgPSBkZXN0U3R5bGVba2V5XTtcbiAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICBjdXJyZW50U3R5bGUgPSBfZXh0ZW5kcyh7fSwgY3VycmVudFN0eWxlKTtcbiAgICAgICAgICBjdXJyZW50VmVsb2NpdHkgPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXR5KTtcbiAgICAgICAgICBsYXN0SWRlYWxTdHlsZSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxTdHlsZSk7XG4gICAgICAgICAgbGFzdElkZWFsVmVsb2NpdHkgPSBfZXh0ZW5kcyh7fSwgbGFzdElkZWFsVmVsb2NpdHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICBjdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgIGxhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGlydHkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50U3R5bGU6IGN1cnJlbnRTdHlsZSwgY3VycmVudFZlbG9jaXR5OiBjdXJyZW50VmVsb2NpdHksIGxhc3RJZGVhbFN0eWxlOiBsYXN0SWRlYWxTdHlsZSwgbGFzdElkZWFsVmVsb2NpdHk6IGxhc3RJZGVhbFZlbG9jaXR5IH0pO1xuICAgIH1cbiAgfSxcblxuICBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5OiBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBUT0RPOiB3aGVuIGNvbmZpZyBpcyB7YTogMTB9IGFuZCBkZXN0IGlzIHthOiAxMH0gZG8gd2UgcmFmIG9uY2UgYW5kXG4gICAgLy8gY2FsbCBjYj8gTm8sIG90aGVyd2lzZSBhY2NpZGVudGFsIHBhcmVudCByZXJlbmRlciBjYXVzZXMgY2IgdHJpZ2dlclxuICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBfcmFmMlsnZGVmYXVsdCddKGZ1bmN0aW9uICh0aW1lc3RhbXApIHtcbiAgICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gYW5pbWF0ZSBpbiB0aGUgZmlyc3QgcGxhY2VcbiAgICAgIHZhciBwcm9wc1N0eWxlID0gX3RoaXMucHJvcHMuc3R5bGU7XG4gICAgICBpZiAoX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10oX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlLCBwcm9wc1N0eWxlLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdHkpKSB7XG4gICAgICAgIGlmIChfdGhpcy53YXNBbmltYXRpbmcgJiYgX3RoaXMucHJvcHMub25SZXN0KSB7XG4gICAgICAgICAgX3RoaXMucHJvcHMub25SZXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMud2FzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMud2FzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgdmFyIGN1cnJlbnRUaW1lID0gdGltZXN0YW1wIHx8IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5ID0ge307XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlID0ge307XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1N0eWxlKSB7XG4gICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzU3R5bGUsIGtleSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHlsZVZhbHVlID0gcHJvcHNTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlW2tleV07XG4gICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0eVtrZXldO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVzVG9DYXRjaFVwOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3N0ZXBwZXJbMF07XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9zdGVwcGVyMiA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgKyAobmV4dElkZWFsWCAtIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGU6IG5ld0N1cnJlbnRTdHlsZSxcbiAgICAgICAgY3VycmVudFZlbG9jaXR5OiBuZXdDdXJyZW50VmVsb2NpdHksXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlOiBuZXdMYXN0SWRlYWxTdHlsZSxcbiAgICAgICAgbGFzdElkZWFsVmVsb2NpdHk6IG5ld0xhc3RJZGVhbFZlbG9jaXR5XG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudW5yZWFkUHJvcFN0eWxlID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZSAhPSBudWxsKSB7XG4gICAgICAvLyBwcmV2aW91cyBwcm9wcyBoYXZlbid0IGhhZCB0aGUgY2hhbmNlIHRvIGJlIHNldCB5ZXQ7IHNldCB0aGVtIGhlcmVcbiAgICAgIHRoaXMuY2xlYXJVbnJlYWRQcm9wU3R5bGUodGhpcy51bnJlYWRQcm9wU3R5bGUpO1xuICAgIH1cblxuICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlID0gcHJvcHMuc3R5bGU7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4odGhpcy5zdGF0ZS5jdXJyZW50U3R5bGUpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTW90aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChjdXJyZW50U3R5bGVzLCBzdHlsZXMsIGN1cnJlbnRWZWxvY2l0aWVzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10oY3VycmVudFN0eWxlc1tpXSwgc3R5bGVzW2ldLCBjdXJyZW50VmVsb2NpdGllc1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBTdGFnZ2VyZWRNb3Rpb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1N0YWdnZXJlZE1vdGlvbicsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgLy8gVE9PRDogd2FybiBhZ2FpbnN0IHB1dHRpbmcgYSBjb25maWcgaW4gaGVyZVxuICAgIGRlZmF1bHRTdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKSksXG4gICAgc3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgZGVmYXVsdFN0eWxlcyA9IF9wcm9wcy5kZWZhdWx0U3R5bGVzO1xuICAgIHZhciBzdHlsZXMgPSBfcHJvcHMuc3R5bGVzO1xuXG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBkZWZhdWx0U3R5bGVzIHx8IHN0eWxlcygpLm1hcChfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXSk7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gY3VycmVudFN0eWxlcy5tYXAoZnVuY3Rpb24gKGN1cnJlbnRTdHlsZSkge1xuICAgICAgcmV0dXJuIF9tYXBUb1plcm8yWydkZWZhdWx0J10oY3VycmVudFN0eWxlKTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFN0eWxlczogY3VycmVudFN0eWxlcyxcbiAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcyxcbiAgICAgIGxhc3RJZGVhbFN0eWxlczogY3VycmVudFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzXG4gICAgfTtcbiAgfSxcblxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGVzOiBudWxsLFxuICAvLyBhZnRlciBjaGVja2luZyBmb3IgdW5yZWFkUHJvcFN0eWxlcyAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUodW5yZWFkUHJvcFN0eWxlcykge1xuICAgIHZhciBfc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBjdXJyZW50U3R5bGVzID0gX3N0YXRlLmN1cnJlbnRTdHlsZXM7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gX3N0YXRlLmN1cnJlbnRWZWxvY2l0aWVzO1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZXMgPSBfc3RhdGUubGFzdElkZWFsU3R5bGVzO1xuICAgIHZhciBsYXN0SWRlYWxWZWxvY2l0aWVzID0gX3N0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXM7XG5cbiAgICB2YXIgc29tZURpcnR5ID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdW5yZWFkUHJvcFN0eWxlID0gdW5yZWFkUHJvcFN0eWxlc1tpXTtcbiAgICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gdW5yZWFkUHJvcFN0eWxlKSB7XG4gICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHVucmVhZFByb3BTdHlsZSwga2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSB1bnJlYWRQcm9wU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNvbWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNvbWVEaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcywgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSBfdGhpcy5wcm9wcy5zdHlsZXMoX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcblxuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgaWYgKHNob3VsZFN0b3BBbmltYXRpb25BbGwoX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IHRpbWVzdGFtcCB8fCBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIF90aGlzLnByZXZUaW1lO1xuICAgICAgX3RoaXMucHJldlRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IF90aGlzLmFjY3VtdWxhdGVkVGltZSArIHRpbWVEZWx0YTtcbiAgICAgIC8vIG1vcmUgdGhhbiAxMCBmcmFtZXM/IHByb2xseSBzd2l0Y2hlZCBicm93c2VyIHRhYi4gUmVzdGFydFxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA+IG1zUGVyRnJhbWUgKiAxMCkge1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID09PSAwKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRGcmFtZUNvbXBsZXRpb24gPSAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKSAqIG1zUGVyRnJhbWUpIC8gbXNQZXJGcmFtZTtcbiAgICAgIHZhciBmcmFtZXNUb0NhdGNoVXAgPSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpO1xuXG4gICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVzID0gW107XG4gICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdGllcyA9IFtdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBbXTtcbiAgICAgIHZhciBuZXdDdXJyZW50VmVsb2NpdGllcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlc3RTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGRlc3RTdHlsZSA9IGRlc3RTdHlsZXNbaV07XG4gICAgICAgIHZhciBuZXdDdXJyZW50U3R5bGUgPSB7fTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0eSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGUgPSB7fTtcbiAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5ID0ge307XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIGRlc3RTdHlsZSkge1xuICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc3RTdHlsZSwga2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBkZXN0U3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBuZXdMYXN0SWRlYWxTdHlsZTtcbiAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudW5yZWFkUHJvcFN0eWxlcyA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGVzICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHByb3BzLnN0eWxlcyh0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcyk7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4odGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFN0YWdnZXJlZE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9tZXJnZURpZmYgPSByZXF1aXJlKCcuL21lcmdlRGlmZicpO1xuXG52YXIgX21lcmdlRGlmZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZXJnZURpZmYpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxuLy8gdGhlIGNoaWxkcmVuIGZ1bmN0aW9uICYgKHBvdGVudGlhbCkgc3R5bGVzIGZ1bmN0aW9uIGFza3MgYXMgcGFyYW0gYW5cbi8vIEFycmF5PFRyYW5zaXRpb25QbGFpblN0eWxlPiwgd2hlcmUgZWFjaCBUcmFuc2l0aW9uUGxhaW5TdHlsZSBpcyBvZiB0aGUgZm9ybWF0XG4vLyB7a2V5OiBzdHJpbmcsIGRhdGE/OiBhbnksIHN0eWxlOiBQbGFpblN0eWxlfS4gSG93ZXZlciwgdGhlIHdheSB3ZSBrZWVwXG4vLyBpbnRlcm5hbCBzdGF0ZXMgZG9lc24ndCBjb250YWluIHN1Y2ggYSBkYXRhIHN0cnVjdHVyZSAoY2hlY2sgdGhlIHN0YXRlIGFuZFxuLy8gVHJhbnNpdGlvbk1vdGlvblN0YXRlKS4gU28gd2hlbiBjaGlsZHJlbiBmdW5jdGlvbiBhbmQgb3RoZXJzIGFzayBmb3Igc3VjaFxuLy8gZGF0YSB3ZSBuZWVkIHRvIGdlbmVyYXRlIHRoZW0gb24gdGhlIGZseSBieSBjb21iaW5pbmcgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4vLyBjdXJyZW50U3R5bGVzL2xhc3RJZGVhbFN0eWxlc1xuZnVuY3Rpb24gcmVoeWRyYXRlU3R5bGVzKG1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCBwbGFpblN0eWxlcykge1xuICAvLyBDb3B5IHRoZSB2YWx1ZSB0byBhIGBjb25zdGAgc28gdGhhdCBGbG93IHVuZGVyc3RhbmRzIHRoYXQgdGhlIGNvbnN0IHdvbid0XG4gIC8vIGNoYW5nZSBhbmQgd2lsbCBiZSBub24tbnVsbGFibGUgaW4gdGhlIGNhbGxiYWNrIGJlbG93LlxuICB2YXIgY1VucmVhZFByb3BTdHlsZXMgPSB1bnJlYWRQcm9wU3R5bGVzO1xuICBpZiAoY1VucmVhZFByb3BTdHlsZXMgPT0gbnVsbCkge1xuICAgIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZS5rZXksXG4gICAgICAgIGRhdGE6IG1lcmdlZFByb3BzU3R5bGUuZGF0YSxcbiAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNVbnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoY1VucmVhZFByb3BTdHlsZXNbal0ua2V5ID09PSBtZXJnZWRQcm9wc1N0eWxlLmtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleTogY1VucmVhZFByb3BTdHlsZXNbal0ua2V5LFxuICAgICAgICAgIGRhdGE6IGNVbnJlYWRQcm9wU3R5bGVzW2pdLmRhdGEsXG4gICAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IGtleTogbWVyZ2VkUHJvcHNTdHlsZS5rZXksIGRhdGE6IG1lcmdlZFByb3BzU3R5bGUuZGF0YSwgc3R5bGU6IHBsYWluU3R5bGVzW2ldIH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG91bGRTdG9wQW5pbWF0aW9uQWxsKGN1cnJlbnRTdHlsZXMsIGRlc3RTdHlsZXMsIGN1cnJlbnRWZWxvY2l0aWVzLCBtZXJnZWRQcm9wc1N0eWxlcykge1xuICBpZiAobWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoICE9PSBkZXN0U3R5bGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobWVyZ2VkUHJvcHNTdHlsZXNbaV0ua2V5ICE9PSBkZXN0U3R5bGVzW2ldLmtleSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIHdlIGhhdmUgdGhlIGludmFyaWFudCB0aGF0IG1lcmdlZFByb3BzU3R5bGVzIGFuZFxuICAvLyBjdXJyZW50U3R5bGVzL2N1cnJlbnRWZWxvY2l0aWVzL2xhc3QqIGFyZSBzeW5jZWQgaW4gdGVybXMgb2YgY2VsbHMsIHNlZVxuICAvLyBtZXJnZUFuZFN5bmMgY29tbWVudCBmb3IgbW9yZSBpbmZvXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIV9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKGN1cnJlbnRTdHlsZXNbaV0sIGRlc3RTdHlsZXNbaV0uc3R5bGUsIGN1cnJlbnRWZWxvY2l0aWVzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBjb3JlIGtleSBtZXJnaW5nIGxvZ2ljXG5cbi8vIHRoaW5ncyB0byBkbzogc2F5IHByZXZpb3VzbHkgbWVyZ2VkIHN0eWxlIGlzIHthLCBifSwgZGVzdCBzdHlsZSAocHJvcCkgaXMge2IsXG4vLyBjfSwgcHJldmlvdXMgY3VycmVudCAoaW50ZXJwb2xhdGluZykgc3R5bGUgaXMge2EsIGJ9XG4vLyAqKmludmFyaWFudCoqOiBjdXJyZW50W2ldIGNvcnJlc3BvbmRzIHRvIG1lcmdlZFtpXSBpbiB0ZXJtcyBvZiBrZXlcblxuLy8gc3RlcHM6XG4vLyB0dXJuIG1lcmdlZCBzdHlsZSBpbnRvIHthPywgYiwgY31cbi8vICAgIGFkZCBjLCB2YWx1ZSBvZiBjIGlzIGRlc3RTdHlsZXMuY1xuLy8gICAgbWF5YmUgcmVtb3ZlIGEsIGFrYSBjYWxsIHdpbGxMZWF2ZShhKSwgdGhlbiBtZXJnZWQgaXMgZWl0aGVyIHtiLCBjfSBvciB7YSwgYiwgY31cbi8vIHR1cm4gY3VycmVudCAoaW50ZXJwb2xhdGluZykgc3R5bGUgZnJvbSB7YSwgYn0gaW50byB7YT8sIGIsIGN9XG4vLyAgICBtYXliZSByZW1vdmUgYVxuLy8gICAgY2VydGFpbmx5IGFkZCBjLCB2YWx1ZSBvZiBjIGlzIHdpbGxFbnRlcihjKVxuLy8gbG9vcCBvdmVyIG1lcmdlZCBhbmQgY29uc3RydWN0IG5ldyBjdXJyZW50XG4vLyBkZXN0IGRvZXNuJ3QgY2hhbmdlLCB0aGF0J3Mgb3duZXInc1xuZnVuY3Rpb24gbWVyZ2VBbmRTeW5jKHdpbGxFbnRlciwgd2lsbExlYXZlLCBkaWRMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRMYXN0SWRlYWxTdHlsZXMsIG9sZExhc3RJZGVhbFZlbG9jaXRpZXMpIHtcbiAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlRGlmZjJbJ2RlZmF1bHQnXShvbGRNZXJnZWRQcm9wc1N0eWxlcywgZGVzdFN0eWxlcywgZnVuY3Rpb24gKG9sZEluZGV4LCBvbGRNZXJnZWRQcm9wc1N0eWxlKSB7XG4gICAgdmFyIGxlYXZpbmdTdHlsZSA9IHdpbGxMZWF2ZShvbGRNZXJnZWRQcm9wc1N0eWxlKTtcbiAgICBpZiAobGVhdmluZ1N0eWxlID09IG51bGwpIHtcbiAgICAgIGRpZExlYXZlKHsga2V5OiBvbGRNZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5kYXRhIH0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShvbGRDdXJyZW50U3R5bGVzW29sZEluZGV4XSwgbGVhdmluZ1N0eWxlLCBvbGRDdXJyZW50VmVsb2NpdGllc1tvbGRJbmRleF0pKSB7XG4gICAgICBkaWRMZWF2ZSh7IGtleTogb2xkTWVyZ2VkUHJvcHNTdHlsZS5rZXksIGRhdGE6IG9sZE1lcmdlZFByb3BzU3R5bGUuZGF0YSB9KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IG9sZE1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBvbGRNZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBsZWF2aW5nU3R5bGUgfTtcbiAgfSk7XG5cbiAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG4gIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldO1xuICAgIHZhciBmb3VuZE9sZEluZGV4ID0gbnVsbDtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9sZE1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAob2xkTWVyZ2VkUHJvcHNTdHlsZXNbal0ua2V5ID09PSBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgZm91bmRPbGRJbmRleCA9IGo7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICBpZiAoZm91bmRPbGRJbmRleCA9PSBudWxsKSB7XG4gICAgICB2YXIgcGxhaW5TdHlsZSA9IHdpbGxFbnRlcihuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCk7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IHBsYWluU3R5bGU7XG5cbiAgICAgIHZhciB2ZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10obmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwuc3R5bGUpO1xuICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG9sZEN1cnJlbnRTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBvbGRMYXN0SWRlYWxTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IG9sZEN1cnJlbnRWZWxvY2l0aWVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG9sZExhc3RJZGVhbFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtuZXdNZXJnZWRQcm9wc1N0eWxlcywgbmV3Q3VycmVudFN0eWxlcywgbmV3Q3VycmVudFZlbG9jaXRpZXMsIG5ld0xhc3RJZGVhbFN0eWxlcywgbmV3TGFzdElkZWFsVmVsb2NpdGllc107XG59XG5cbnZhciBUcmFuc2l0aW9uTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUcmFuc2l0aW9uTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdC5Qcm9wVHlwZXMuZnVuYywgX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAga2V5OiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGF0YTogX3JlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWRcbiAgICB9KSldKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB3aWxsRW50ZXI6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB3aWxsTGVhdmU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBkaWRMZWF2ZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpbGxFbnRlcjogZnVuY3Rpb24gd2lsbEVudGVyKHN0eWxlVGhhdEVudGVyZWQpIHtcbiAgICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHN0eWxlVGhhdEVudGVyZWQuc3R5bGUpO1xuICAgICAgfSxcbiAgICAgIC8vIHJlY2FsbDogcmV0dXJuaW5nIG51bGwgbWFrZXMgdGhlIGN1cnJlbnQgdW5tb3VudGluZyBUcmFuc2l0aW9uU3R5bGVcbiAgICAgIC8vIGRpc2FwcGVhciBpbW1lZGlhdGVseVxuICAgICAgd2lsbExlYXZlOiBmdW5jdGlvbiB3aWxsTGVhdmUoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIGRpZExlYXZlOiBmdW5jdGlvbiBkaWRMZWF2ZSgpIHt9XG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgZGVmYXVsdFN0eWxlcyA9IF9wcm9wcy5kZWZhdWx0U3R5bGVzO1xuICAgIHZhciBzdHlsZXMgPSBfcHJvcHMuc3R5bGVzO1xuICAgIHZhciB3aWxsRW50ZXIgPSBfcHJvcHMud2lsbEVudGVyO1xuICAgIHZhciB3aWxsTGVhdmUgPSBfcHJvcHMud2lsbExlYXZlO1xuICAgIHZhciBkaWRMZWF2ZSA9IF9wcm9wcy5kaWRMZWF2ZTtcblxuICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHN0eWxlcyA9PT0gJ2Z1bmN0aW9uJyA/IHN0eWxlcyhkZWZhdWx0U3R5bGVzKSA6IHN0eWxlcztcblxuICAgIC8vIHRoaXMgaXMgc3BlY2lhbC4gZm9yIHRoZSBmaXJzdCB0aW1lIGFyb3VuZCwgd2UgZG9uJ3QgaGF2ZSBhIGNvbXBhcmlzb25cbiAgICAvLyBiZXR3ZWVuIGxhc3QgKG5vIGxhc3QpIGFuZCBjdXJyZW50IG1lcmdlZCBwcm9wcy4gd2UnbGwgY29tcHV0ZSBsYXN0IHNvOlxuICAgIC8vIHNheSBkZWZhdWx0IGlzIHthLCBifSBhbmQgc3R5bGVzIChkZXN0IHN0eWxlKSBpcyB7YiwgY30sIHdlJ2xsXG4gICAgLy8gZmFicmljYXRlIGxhc3QgYXMge2EsIGJ9XG4gICAgdmFyIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gdW5kZWZpbmVkO1xuICAgIGlmIChkZWZhdWx0U3R5bGVzID09IG51bGwpIHtcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVzdFN0eWxlcztcbiAgICB9IGVsc2Uge1xuICAgICAgb2xkTWVyZ2VkUHJvcHNTdHlsZXMgPSBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAoZGVmYXVsdFN0eWxlQ2VsbCkge1xuICAgICAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRlc3RTdHlsZXNbaV0ua2V5ID09PSBkZWZhdWx0U3R5bGVDZWxsLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlc3RTdHlsZXNbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0U3R5bGVDZWxsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBvbGRDdXJyZW50U3R5bGVzID0gZGVmYXVsdFN0eWxlcyA9PSBudWxsID8gZGVzdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSk7XG4gICAgdmFyIG9sZEN1cnJlbnRWZWxvY2l0aWVzID0gZGVmYXVsdFN0eWxlcyA9PSBudWxsID8gZGVzdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pIDogZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfbWFwVG9aZXJvMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuXG4gICAgdmFyIF9tZXJnZUFuZFN5bmMgPSBtZXJnZUFuZFN5bmMoXG4gICAgLy8gQmVjYXVzZSB0aGlzIGlzIGFuIG9sZC1zdHlsZSBSZWFjdC5jcmVhdGVDbGFzcyBjb21wb25lbnQsIEZsb3cgZG9lc24ndFxuICAgIC8vIHVuZGVyc3RhbmQgdGhhdCB0aGUgd2lsbEVudGVyIGFuZCB3aWxsTGVhdmUgcHJvcHMgaGF2ZSBkZWZhdWx0IHZhbHVlc1xuICAgIC8vIGFuZCB3aWxsIGFsd2F5cyBiZSBwcmVzZW50LlxuICAgIHdpbGxFbnRlciwgd2lsbExlYXZlLCBkaWRMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRDdXJyZW50U3R5bGVzLCAvLyBvbGRMYXN0SWRlYWxTdHlsZXMgcmVhbGx5XG4gICAgb2xkQ3VycmVudFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luY1swXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmNbMV07XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1syXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luY1szXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmNbNF07XG4gICAgLy8gb2xkTGFzdElkZWFsVmVsb2NpdGllcyByZWFsbHlcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzXG4gICAgfTtcbiAgfSxcblxuICB1bm1vdW50aW5nOiBmYWxzZSxcbiAgYW5pbWF0aW9uSUQ6IG51bGwsXG4gIHByZXZUaW1lOiAwLFxuICBhY2N1bXVsYXRlZFRpbWU6IDAsXG4gIC8vIGl0J3MgcG9zc2libGUgdGhhdCBjdXJyZW50U3R5bGUncyB2YWx1ZSBpcyBzdGFsZTogaWYgcHJvcHMgaXMgaW1tZWRpYXRlbHlcbiAgLy8gY2hhbmdlZCBmcm9tIDAgdG8gNDAwIHRvIHNwcmluZygwKSBhZ2FpbiwgdGhlIGFzeW5jIGN1cnJlbnRTdHlsZSBpcyBzdGlsbFxuICAvLyBhdCAwIChkaWRuJ3QgaGF2ZSB0aW1lIHRvIHRpY2sgYW5kIGludGVycG9sYXRlIGV2ZW4gb25jZSkuIElmIHdlIG5haXZlbHlcbiAgLy8gY29tcGFyZSBjdXJyZW50U3R5bGUgd2l0aCBkZXN0VmFsIGl0J2xsIGJlIDAgPT09IDAgKG5vIGFuaW1hdGlvbiwgc3RvcCkuXG4gIC8vIEluIHJlYWxpdHkgY3VycmVudFN0eWxlIHNob3VsZCBiZSA0MDBcbiAgdW5yZWFkUHJvcFN0eWxlczogbnVsbCxcbiAgLy8gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVucmVhZFByb3BTdHlsZXMgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKHVucmVhZFByb3BTdHlsZXMpIHtcbiAgICB2YXIgX21lcmdlQW5kU3luYzIgPSBtZXJnZUFuZFN5bmModGhpcy5wcm9wcy53aWxsRW50ZXIsIHRoaXMucHJvcHMud2lsbExlYXZlLCB0aGlzLnByb3BzLmRpZExlYXZlLCB0aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luYzJbMF07XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlsxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMlsyXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luYzJbM107XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMls0XTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV0uc3R5bGU7XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh1bnJlYWRQcm9wU3R5bGUsIGtleSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHlsZVZhbHVlID0gdW5yZWFkUHJvcFN0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgICBkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0gPSB7XG4gICAgICAgICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0ua2V5LFxuICAgICAgICAgICAgICBkYXRhOiBtZXJnZWRQcm9wc1N0eWxlc1tpXS5kYXRhLFxuICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoe30sIG1lcmdlZFByb3BzU3R5bGVzW2ldLnN0eWxlKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBjdXJyZW50VmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBsYXN0SWRlYWxTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXVtrZXldID0gMDtcbiAgICAgICAgICBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVubGlrZSB0aGUgb3RoZXIgMiBjb21wb25lbnRzLCB3ZSBjYW4ndCBkZXRlY3Qgc3RhbGVuZXNzIGFuZCBvcHRpb25hbGx5XG4gICAgLy8gb3B0IG91dCBvZiBzZXRTdGF0ZSBoZXJlLiBlYWNoIHN0eWxlIG9iamVjdCdzIGRhdGEgbWlnaHQgY29udGFpbiBuZXdcbiAgICAvLyBzdHVmZiB3ZSdyZSBub3QvY2Fubm90IGNvbXBhcmVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsXG4gICAgICBjdXJyZW50VmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXMsXG4gICAgICBtZXJnZWRQcm9wc1N0eWxlczogbWVyZ2VkUHJvcHNTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxTdHlsZXM6IGxhc3RJZGVhbFN0eWxlcyxcbiAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXNcbiAgICB9KTtcbiAgfSxcblxuICBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5OiBmdW5jdGlvbiBzdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy51bm1vdW50aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgICAgdmFyIHByb3BTdHlsZXMgPSBfdGhpcy5wcm9wcy5zdHlsZXM7XG4gICAgICB2YXIgZGVzdFN0eWxlcyA9IHR5cGVvZiBwcm9wU3R5bGVzID09PSAnZnVuY3Rpb24nID8gcHJvcFN0eWxlcyhyZWh5ZHJhdGVTdHlsZXMoX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIF90aGlzLnVucmVhZFByb3BTdHlsZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcykpIDogcHJvcFN0eWxlcztcblxuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgaWYgKHNob3VsZFN0b3BBbmltYXRpb25BbGwoX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIF90aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzKSkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSB0aW1lc3RhbXAgfHwgX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB2YXIgdGltZURlbHRhID0gY3VycmVudFRpbWUgLSBfdGhpcy5wcmV2VGltZTtcbiAgICAgIF90aGlzLnByZXZUaW1lID0gY3VycmVudFRpbWU7XG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgKyB0aW1lRGVsdGE7XG4gICAgICAvLyBtb3JlIHRoYW4gMTAgZnJhbWVzPyBwcm9sbHkgc3dpdGNoZWQgYnJvd3NlciB0YWIuIFJlc3RhcnRcbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPiBtc1BlckZyYW1lICogMTApIHtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA9PT0gMCkge1xuICAgICAgICAvLyBubyBuZWVkIHRvIGNhbmNlbCBhbmltYXRpb25JRCBoZXJlOyBzaG91bGRuJ3QgaGF2ZSBhbnkgaW4gZmxpZ2h0XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50RnJhbWVDb21wbGV0aW9uID0gKF90aGlzLmFjY3VtdWxhdGVkVGltZSAtIE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSkgKiBtc1BlckZyYW1lKSAvIG1zUGVyRnJhbWU7XG4gICAgICB2YXIgZnJhbWVzVG9DYXRjaFVwID0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKTtcblxuICAgICAgdmFyIF9tZXJnZUFuZFN5bmMzID0gbWVyZ2VBbmRTeW5jKF90aGlzLnByb3BzLndpbGxFbnRlciwgX3RoaXMucHJvcHMud2lsbExlYXZlLCBfdGhpcy5wcm9wcy5kaWRMZWF2ZSwgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1swXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luYzNbMV07XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1syXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1szXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzNbNF07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3TWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGUgPSBuZXdNZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3TWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5ld01lcmdlZFByb3BzU3R5bGUsIGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdHlsZVZhbHVlID0gbmV3TWVyZ2VkUHJvcHNTdHlsZVtrZXldO1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gbmV3TGFzdElkZWFsU3R5bGVzW2ldW2tleV07XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZnJhbWVzVG9DYXRjaFVwOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF9zdGVwcGVyWzBdO1xuICAgICAgICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlID0gX3N0ZXBwZXJbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfc3RlcHBlcjIgPSBfc3RlcHBlcjRbJ2RlZmF1bHQnXShtc1BlckZyYW1lIC8gMTAwMCwgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSwgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSwgc3R5bGVWYWx1ZS52YWwsIHN0eWxlVmFsdWUuc3RpZmZuZXNzLCBzdHlsZVZhbHVlLmRhbXBpbmcsIHN0eWxlVmFsdWUucHJlY2lzaW9uKTtcblxuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFggPSBfc3RlcHBlcjJbMF07XG4gICAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgICAgbmV3Q3VycmVudFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlICsgKG5leHRJZGVhbFggLSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgKyAobmV4dElkZWFsViAtIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUpICogY3VycmVudEZyYW1lQ29tcGxldGlvbjtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlba2V5XSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3TGFzdElkZWFsU3R5bGVzW2ldID0gbmV3TGFzdElkZWFsU3R5bGU7XG4gICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eTtcbiAgICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG5ld0N1cnJlbnRTdHlsZTtcbiAgICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSBuZXdDdXJyZW50VmVsb2NpdHk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZXM6IG5ld0N1cnJlbnRTdHlsZXMsXG4gICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzOiBuZXdDdXJyZW50VmVsb2NpdGllcyxcbiAgICAgICAgbGFzdElkZWFsU3R5bGVzOiBuZXdMYXN0SWRlYWxTdHlsZXMsXG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXM6IG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMsXG4gICAgICAgIG1lcmdlZFByb3BzU3R5bGVzOiBuZXdNZXJnZWRQcm9wc1N0eWxlc1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVucmVhZFByb3BTdHlsZXMgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlcykge1xuICAgICAgLy8gcHJldmlvdXMgcHJvcHMgaGF2ZW4ndCBoYWQgdGhlIGNoYW5jZSB0byBiZSBzZXQgeWV0OyBzZXQgdGhlbSBoZXJlXG4gICAgICB0aGlzLmNsZWFyVW5yZWFkUHJvcFN0eWxlKHRoaXMudW5yZWFkUHJvcFN0eWxlcyk7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlcyA9IHByb3BzLnN0eWxlcztcbiAgICBpZiAodHlwZW9mIHN0eWxlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gc3R5bGVzKHJlaHlkcmF0ZVN0eWxlcyh0aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCB0aGlzLnVucmVhZFByb3BTdHlsZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHN0eWxlcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMudW5tb3VudGluZyA9IHRydWU7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGh5ZHJhdGVkU3R5bGVzID0gcmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4oaHlkcmF0ZWRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVHJhbnNpdGlvbk1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vLyBsaXN0IG9mIHN0eWxlcywgZWFjaCBjb250YWluaW5nIGludGVycG9sYXRpbmcgdmFsdWVzLiBQYXJ0IG9mIHdoYXQncyBwYXNzZWRcbi8vIHRvIGNoaWxkcmVuIGZ1bmN0aW9uLiBOb3RpY2UgdGhhdCB0aGlzIGlzXG4vLyBBcnJheTxBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3Q+LCB3aXRob3V0IHRoZSB3cmFwcGVyIHRoYXQgaXMge2tleTogLi4uLFxuLy8gZGF0YTogLi4uIHN0eWxlOiBBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3R9LiBPbmx5IG1lcmdlZFByb3BzU3R5bGVzXG4vLyBjb250YWlucyB0aGUga2V5ICYgZGF0YSBpbmZvIChzbyB0aGF0IHdlIG9ubHkgaGF2ZSBhIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcbi8vIGZvciB0aGVzZSwgYW5kIHRvIHNhdmUgc3BhY2UpLiBDaGVjayB0aGUgY29tbWVudCBmb3IgYHJlaHlkcmF0ZVN0eWxlc2AgdG9cbi8vIHNlZSBob3cgd2UgcmVnZW5lcmF0ZSB0aGUgZW50aXJldHkgb2Ygd2hhdCdzIHBhc3NlZCB0byBjaGlsZHJlbiBmdW5jdGlvblxuXG4vLyB0aGUgYXJyYXkgdGhhdCBrZWVwcyB0cmFjayBvZiBjdXJyZW50bHkgcmVuZGVyZWQgc3R1ZmYhIEluY2x1ZGluZyBzdHVmZlxuLy8gdGhhdCB5b3UndmUgdW5tb3VudGVkIGJ1dCB0aGF0J3Mgc3RpbGwgYW5pbWF0aW5nLiBUaGlzIGlzIHdoZXJlIGl0IGxpdmVzIiwiXG5cbi8vIGN1cnJlbnRseSB1c2VkIHRvIGluaXRpYXRlIHRoZSB2ZWxvY2l0eSBzdHlsZSBvYmplY3QgdG8gMFxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWFwVG9aZXJvO1xuXG5mdW5jdGlvbiBtYXBUb1plcm8ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyBjb3JlIGtleXMgbWVyZ2luZyBhbGdvcml0aG0uIElmIHByZXZpb3VzIHJlbmRlcidzIGtleXMgYXJlIFthLCBiXSwgYW5kIHRoZVxuLy8gbmV4dCByZW5kZXIncyBbYywgYiwgZF0sIHdoYXQncyB0aGUgZmluYWwgbWVyZ2VkIGtleXMgYW5kIG9yZGVyaW5nP1xuXG4vLyAtIGMgYW5kIGEgbXVzdCBib3RoIGJlIGJlZm9yZSBiXG4vLyAtIGIgYmVmb3JlIGRcbi8vIC0gb3JkZXJpbmcgYmV0d2VlbiBhIGFuZCBjIGFtYmlndW91c1xuXG4vLyB0aGlzIHJlZHVjZXMgdG8gbWVyZ2luZyB0d28gcGFydGlhbGx5IG9yZGVyZWQgbGlzdHMgKGUuZy4gbGlzdHMgd2hlcmUgbm90XG4vLyBldmVyeSBpdGVtIGhhcyBhIGRlZmluaXRlIG9yZGVyaW5nLCBsaWtlIGNvbXBhcmluZyBhIGFuZCBjIGFib3ZlKS4gRm9yIHRoZVxuLy8gYW1iaWd1b3VzIG9yZGVyaW5nIHdlIGRldGVybWluaXN0aWNhbGx5IGNob29zZSB0byBwbGFjZSB0aGUgbmV4dCByZW5kZXInc1xuLy8gaXRlbSBhZnRlciB0aGUgcHJldmlvdXMnOyBzbyBjIGFmdGVyIGFcblxuLy8gdGhpcyBpcyBjYWxsZWQgYSB0b3BvbG9naWNhbCBzb3J0aW5nLiBFeGNlcHQgdGhlIGV4aXN0aW5nIGFsZ29yaXRobXMgZG9uJ3Rcbi8vIHdvcmsgd2VsbCB3aXRoIGpzIGJjIG9mIHRoZSBhbW91bnQgb2YgYWxsb2NhdGlvbiwgYW5kIGlzbid0IG9wdGltaXplZCBmb3Igb3VyXG4vLyBjdXJyZW50IHVzZS1jYXNlIGJjIHRoZSBydW50aW1lIGlzIGxpbmVhciBpbiB0ZXJtcyBvZiBlZGdlcyAoc2VlIHdpa2kgZm9yXG4vLyBtZWFuaW5nKSwgd2hpY2ggaXMgaHVnZSB3aGVuIHR3byBsaXN0cyBoYXZlIG1hbnkgY29tbW9uIGVsZW1lbnRzXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBtZXJnZURpZmY7XG5cbmZ1bmN0aW9uIG1lcmdlRGlmZihwcmV2LCBuZXh0LCBvblJlbW92ZSkge1xuICAvLyBib29ra2VlcGluZyBmb3IgZWFzaWVyIGFjY2VzcyBvZiBhIGtleSdzIGluZGV4IGJlbG93LiBUaGlzIGlzIDIgYWxsb2NhdGlvbnMgK1xuICAvLyBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIGNocm9tZSBoYXNoIG1hcCBtb2RlIGZvciBvYmpzIChzbyBpdCBtaWdodCBiZSBmYXN0ZXJcblxuICB2YXIgcHJldktleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldi5sZW5ndGg7IGkrKykge1xuICAgIHByZXZLZXlJbmRleFtwcmV2W2ldLmtleV0gPSBpO1xuICB9XG4gIHZhciBuZXh0S2V5SW5kZXggPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbmV4dEtleUluZGV4W25leHRbaV0ua2V5XSA9IGk7XG4gIH1cblxuICAvLyBmaXJzdCwgYW4gb3Zlcmx5IGVsYWJvcmF0ZSB3YXkgb2YgbWVyZ2luZyBwcmV2IGFuZCBuZXh0LCBlbGltaW5hdGluZ1xuICAvLyBkdXBsaWNhdGVzIChpbiB0ZXJtcyBvZiBrZXlzKS4gSWYgdGhlcmUncyBkdXBlLCBrZWVwIHRoZSBpdGVtIGluIG5leHQpLlxuICAvLyBUaGlzIHdheSBvZiB3cml0aW5nIGl0IHNhdmVzIGFsbG9jYXRpb25zXG4gIHZhciByZXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgcmV0W2ldID0gbmV4dFtpXTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuZXh0S2V5SW5kZXgsIHByZXZbaV0ua2V5KSkge1xuICAgICAgLy8gdGhpcyBpcyBjYWxsZWQgbXkgVE0ncyBgbWVyZ2VBbmRTeW5jYCwgd2hpY2ggY2FsbHMgd2lsbExlYXZlLiBXZSBkb24ndFxuICAgICAgLy8gbWVyZ2UgaW4ga2V5cyB0aGF0IHRoZSB1c2VyIGRlc2lyZXMgdG8ga2lsbFxuICAgICAgdmFyIGZpbGwgPSBvblJlbW92ZShpLCBwcmV2W2ldKTtcbiAgICAgIGlmIChmaWxsICE9IG51bGwpIHtcbiAgICAgICAgcmV0LnB1c2goZmlsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gbm93IGFsbCB0aGUgaXRlbXMgYWxsIHByZXNlbnQuIENvcmUgc29ydGluZyBsb2dpYyB0byBoYXZlIHRoZSByaWdodCBvcmRlclxuICByZXR1cm4gcmV0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICB2YXIgbmV4dE9yZGVyQSA9IG5leHRLZXlJbmRleFthLmtleV07XG4gICAgdmFyIG5leHRPcmRlckIgPSBuZXh0S2V5SW5kZXhbYi5rZXldO1xuICAgIHZhciBwcmV2T3JkZXJBID0gcHJldktleUluZGV4W2Eua2V5XTtcbiAgICB2YXIgcHJldk9yZGVyQiA9IHByZXZLZXlJbmRleFtiLmtleV07XG5cbiAgICBpZiAobmV4dE9yZGVyQSAhPSBudWxsICYmIG5leHRPcmRlckIgIT0gbnVsbCkge1xuICAgICAgLy8gYm90aCBrZXlzIGluIG5leHRcbiAgICAgIHJldHVybiBuZXh0S2V5SW5kZXhbYS5rZXldIC0gbmV4dEtleUluZGV4W2Iua2V5XTtcbiAgICB9IGVsc2UgaWYgKHByZXZPcmRlckEgIT0gbnVsbCAmJiBwcmV2T3JkZXJCICE9IG51bGwpIHtcbiAgICAgIC8vIGJvdGgga2V5cyBpbiBwcmV2XG4gICAgICByZXR1cm4gcHJldktleUluZGV4W2Eua2V5XSAtIHByZXZLZXlJbmRleFtiLmtleV07XG4gICAgfSBlbHNlIGlmIChuZXh0T3JkZXJBICE9IG51bGwpIHtcbiAgICAgIC8vIGtleSBhIGluIG5leHQsIGtleSBiIGluIHByZXZcblxuICAgICAgLy8gaG93IHRvIGRldGVybWluZSB0aGUgb3JkZXIgYmV0d2VlbiBhIGFuZCBiPyBXZSBmaW5kIGEgXCJwaXZvdFwiICh0ZXJtXG4gICAgICAvLyBhYnVzZSksIGEga2V5IHByZXNlbnQgaW4gYm90aCBwcmV2IGFuZCBuZXh0LCB0aGF0IGlzIHNhbmR3aWNoZWQgYmV0d2VlblxuICAgICAgLy8gYSBhbmQgYi4gSW4gdGhlIGNvbnRleHQgb2Ygb3VyIGFib3ZlIGV4YW1wbGUsIGlmIHdlJ3JlIGNvbXBhcmluZyBhIGFuZFxuICAgICAgLy8gZCwgYidzICh0aGUgb25seSkgcGl2b3RcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGl2b3QgPSBuZXh0W2ldLmtleTtcbiAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJldktleUluZGV4LCBwaXZvdCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0T3JkZXJBIDwgbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCID4gcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJBID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBwbHVnZ2FibGUuIGRlZmF1bHQgdG86IG5leHQgYmlnZ2VyIHRoYW4gcHJldlxuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8vIHByZXZPcmRlckEsIG5leHRPcmRlckJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJldktleUluZGV4LCBwaXZvdCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAobmV4dE9yZGVyQiA8IG5leHRLZXlJbmRleFtwaXZvdF0gJiYgcHJldk9yZGVyQSA+IHByZXZLZXlJbmRleFtwaXZvdF0pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2UgaWYgKG5leHRPcmRlckIgPiBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPCBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcGx1Z2dhYmxlLiBkZWZhdWx0IHRvOiBuZXh0IGJpZ2dlciB0aGFuIHByZXZcbiAgICByZXR1cm4gLTE7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIHRvIGxvb3AgdGhyb3VnaCBhbmQgZmluZCBhIGtleSdzIGluZGV4IGVhY2ggdGltZSksIGJ1dCBJIG5vIGxvbmdlciBjYXJlIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHtcbiAgbm9Xb2JibGU6IHsgc3RpZmZuZXNzOiAxNzAsIGRhbXBpbmc6IDI2IH0sIC8vIHRoZSBkZWZhdWx0LCBpZiBub3RoaW5nIHByb3ZpZGVkXG4gIGdlbnRsZTogeyBzdGlmZm5lc3M6IDEyMCwgZGFtcGluZzogMTQgfSxcbiAgd29iYmx5OiB7IHN0aWZmbmVzczogMTgwLCBkYW1waW5nOiAxMiB9LFxuICBzdGlmZjogeyBzdGlmZm5lc3M6IDIxMCwgZGFtcGluZzogMjAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmUob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbJ2RlZmF1bHQnXSA6IG9iajsgfVxuXG52YXIgX01vdGlvbiA9IHJlcXVpcmUoJy4vTW90aW9uJyk7XG5cbmV4cG9ydHMuTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9Nb3Rpb24pO1xuXG52YXIgX1N0YWdnZXJlZE1vdGlvbiA9IHJlcXVpcmUoJy4vU3RhZ2dlcmVkTW90aW9uJyk7XG5cbmV4cG9ydHMuU3RhZ2dlcmVkTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9TdGFnZ2VyZWRNb3Rpb24pO1xuXG52YXIgX1RyYW5zaXRpb25Nb3Rpb24gPSByZXF1aXJlKCcuL1RyYW5zaXRpb25Nb3Rpb24nKTtcblxuZXhwb3J0cy5UcmFuc2l0aW9uTW90aW9uID0gX2ludGVyb3BSZXF1aXJlKF9UcmFuc2l0aW9uTW90aW9uKTtcblxudmFyIF9zcHJpbmcgPSByZXF1aXJlKCcuL3NwcmluZycpO1xuXG5leHBvcnRzLnNwcmluZyA9IF9pbnRlcm9wUmVxdWlyZShfc3ByaW5nKTtcblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbmV4cG9ydHMucHJlc2V0cyA9IF9pbnRlcm9wUmVxdWlyZShfcHJlc2V0cyk7XG5cbi8vIGRlcHJlY2F0ZWQsIGR1bW15IHdhcm5pbmcgZnVuY3Rpb25cblxudmFyIF9yZW9yZGVyS2V5cyA9IHJlcXVpcmUoJy4vcmVvcmRlcktleXMnKTtcblxuZXhwb3J0cy5yZW9yZGVyS2V5cyA9IF9pbnRlcm9wUmVxdWlyZShfcmVvcmRlcktleXMpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHJlb3JkZXJLZXlzO1xuXG52YXIgaGFzV2FybmVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHJlb3JkZXJLZXlzKCkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBpZiAoIWhhc1dhcm5lZCkge1xuICAgICAgaGFzV2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2ByZW9yZGVyS2V5c2AgaGFzIGJlZW4gcmVtb3ZlZCwgc2luY2UgaXQgaXMgbm8gbG9uZ2VyIG5lZWRlZCBmb3IgVHJhbnNpdGlvbk1vdGlvblxcJ3MgbmV3IHN0eWxlcyBhcnJheSBBUEkuJyk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlxuXG4vLyB1c2FnZSBhc3N1bXB0aW9uOiBjdXJyZW50U3R5bGUgdmFsdWVzIGhhdmUgYWxyZWFkeSBiZWVuIHJlbmRlcmVkIGJ1dCBpdCBzYXlzXG4vLyBub3RoaW5nIG9mIHdoZXRoZXIgY3VycmVudFN0eWxlIGlzIHN0YWxlIChzZWUgdW5yZWFkUHJvcFN0eWxlKVxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc2hvdWxkU3RvcEFuaW1hdGlvbjtcblxuZnVuY3Rpb24gc2hvdWxkU3RvcEFuaW1hdGlvbihjdXJyZW50U3R5bGUsIHN0eWxlLCBjdXJyZW50VmVsb2NpdHkpIHtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3R5bGUsIGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50VmVsb2NpdHlba2V5XSAhPT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBzdHlsZVZhbHVlID0gdHlwZW9mIHN0eWxlW2tleV0gPT09ICdudW1iZXInID8gc3R5bGVba2V5XSA6IHN0eWxlW2tleV0udmFsO1xuICAgIC8vIHN0ZXBwZXIgd2lsbCBoYXZlIGFscmVhZHkgdGFrZW4gY2FyZSBvZiByb3VuZGluZyBwcmVjaXNpb24gZXJyb3JzLCBzb1xuICAgIC8vIHdvbid0IGhhdmUgc3VjaCB0aGluZyBhcyAwLjk5OTkgIT09PSAxXG4gICAgaWYgKGN1cnJlbnRTdHlsZVtrZXldICE9PSBzdHlsZVZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gc3ByaW5nO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfcHJlc2V0cyA9IHJlcXVpcmUoJy4vcHJlc2V0cycpO1xuXG52YXIgX3ByZXNldHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJlc2V0cyk7XG5cbnZhciBkZWZhdWx0Q29uZmlnID0gX2V4dGVuZHMoe30sIF9wcmVzZXRzMlsnZGVmYXVsdCddLm5vV29iYmxlLCB7XG4gIHByZWNpc2lvbjogMC4wMVxufSk7XG5cbmZ1bmN0aW9uIHNwcmluZyh2YWwsIGNvbmZpZykge1xuICByZXR1cm4gX2V4dGVuZHMoe30sIGRlZmF1bHRDb25maWcsIGNvbmZpZywgeyB2YWw6IHZhbCB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXG5cbi8vIHN0ZXBwZXIgaXMgdXNlZCBhIGxvdC4gU2F2ZXMgYWxsb2NhdGlvbiB0byByZXR1cm4gdGhlIHNhbWUgYXJyYXkgd3JhcHBlci5cbi8vIFRoaXMgaXMgZmluZSBhbmQgZGFuZ2VyLWZyZWUgYWdhaW5zdCBtdXRhdGlvbnMgYmVjYXVzZSB0aGUgY2FsbHNpdGVcbi8vIGltbWVkaWF0ZWx5IGRlc3RydWN0dXJlcyBpdCBhbmQgZ2V0cyB0aGUgbnVtYmVycyBpbnNpZGUgd2l0aG91dCBwYXNzaW5nIHRoZVxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHN0ZXBwZXI7XG5cbnZhciByZXVzZWRUdXBsZSA9IFswLCAwXTtcblxuZnVuY3Rpb24gc3RlcHBlcihzZWNvbmRQZXJGcmFtZSwgeCwgdiwgZGVzdFgsIGssIGIsIHByZWNpc2lvbikge1xuICAvLyBTcHJpbmcgc3RpZmZuZXNzLCBpbiBrZyAvIHNeMlxuXG4gIC8vIGZvciBhbmltYXRpb25zLCBkZXN0WCBpcyByZWFsbHkgc3ByaW5nIGxlbmd0aCAoc3ByaW5nIGF0IHJlc3QpLiBpbml0aWFsXG4gIC8vIHBvc2l0aW9uIGlzIGNvbnNpZGVyZWQgYXMgdGhlIHN0cmV0Y2hlZC9jb21wcmVzc2VkIHBvc2l0aW9uIG9mIGEgc3ByaW5nXG4gIHZhciBGc3ByaW5nID0gLWsgKiAoeCAtIGRlc3RYKTtcblxuICAvLyBEYW1waW5nLCBpbiBrZyAvIHNcbiAgdmFyIEZkYW1wZXIgPSAtYiAqIHY7XG5cbiAgLy8gdXN1YWxseSB3ZSBwdXQgbWFzcyBoZXJlLCBidXQgZm9yIGFuaW1hdGlvbiBwdXJwb3Nlcywgc3BlY2lmeWluZyBtYXNzIGlzIGFcbiAgLy8gYml0IHJlZHVuZGFudC4geW91IGNvdWxkIHNpbXBseSBhZGp1c3QgayBhbmQgYiBhY2NvcmRpbmdseVxuICAvLyBsZXQgYSA9IChGc3ByaW5nICsgRmRhbXBlcikgLyBtYXNzO1xuICB2YXIgYSA9IEZzcHJpbmcgKyBGZGFtcGVyO1xuXG4gIHZhciBuZXdWID0gdiArIGEgKiBzZWNvbmRQZXJGcmFtZTtcbiAgdmFyIG5ld1ggPSB4ICsgbmV3ViAqIHNlY29uZFBlckZyYW1lO1xuXG4gIGlmIChNYXRoLmFicyhuZXdWKSA8IHByZWNpc2lvbiAmJiBNYXRoLmFicyhuZXdYIC0gZGVzdFgpIDwgcHJlY2lzaW9uKSB7XG4gICAgcmV1c2VkVHVwbGVbMF0gPSBkZXN0WDtcbiAgICByZXVzZWRUdXBsZVsxXSA9IDA7XG4gICAgcmV0dXJuIHJldXNlZFR1cGxlO1xuICB9XG5cbiAgcmV1c2VkVHVwbGVbMF0gPSBuZXdYO1xuICByZXVzZWRUdXBsZVsxXSA9IG5ld1Y7XG4gIHJldHVybiByZXVzZWRUdXBsZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbi8vIGFycmF5IHJlZmVyZW5jZSBhcm91bmQuIiwiXG4vLyB0dXJuIHt4OiB7dmFsOiAxLCBzdGlmZm5lc3M6IDEsIGRhbXBpbmc6IDJ9LCB5OiAyfSBnZW5lcmF0ZWQgYnlcbi8vIGB7eDogc3ByaW5nKDEsIHtzdGlmZm5lc3M6IDEsIGRhbXBpbmc6IDJ9KSwgeTogMn1gIGludG8ge3g6IDEsIHk6IDJ9XG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN0cmlwU3R5bGU7XG5cbmZ1bmN0aW9uIHN0cmlwU3R5bGUoc3R5bGUpIHtcbiAgdmFyIHJldCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdHlsZSwga2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0gdHlwZW9mIHN0eWxlW2tleV0gPT09ICdudW1iZXInID8gc3R5bGVba2V5XSA6IHN0eWxlW2tleV0udmFsO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgLyplc2xpbnQtZGlzYWJsZSByZWFjdC9wcm9wLXR5cGVzICovXG5cblxudmFyIF9yZWFjdCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF93YXJuaW5nID0gcmVxdWlyZSgnd2FybmluZycpO1xuXG52YXIgX3dhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd2FybmluZyk7XG5cbnZhciBfY29tcG9uZW50T3JFbGVtZW50ID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50Jyk7XG5cbnZhciBfY29tcG9uZW50T3JFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbXBvbmVudE9yRWxlbWVudCk7XG5cbnZhciBfZWxlbWVudFR5cGUgPSByZXF1aXJlKCdyZWFjdC1wcm9wLXR5cGVzL2xpYi9lbGVtZW50VHlwZScpO1xuXG52YXIgX2VsZW1lbnRUeXBlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VsZW1lbnRUeXBlKTtcblxudmFyIF9Qb3J0YWwgPSByZXF1aXJlKCcuL1BvcnRhbCcpO1xuXG52YXIgX1BvcnRhbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Qb3J0YWwpO1xuXG52YXIgX01vZGFsTWFuYWdlciA9IHJlcXVpcmUoJy4vTW9kYWxNYW5hZ2VyJyk7XG5cbnZhciBfTW9kYWxNYW5hZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01vZGFsTWFuYWdlcik7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vdXRpbHMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX293bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3duZXJEb2N1bWVudCk7XG5cbnZhciBfYWRkRXZlbnRMaXN0ZW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvYWRkRXZlbnRMaXN0ZW5lcicpO1xuXG52YXIgX2FkZEV2ZW50TGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWRkRXZlbnRMaXN0ZW5lcik7XG5cbnZhciBfYWRkRm9jdXNMaXN0ZW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvYWRkRm9jdXNMaXN0ZW5lcicpO1xuXG52YXIgX2FkZEZvY3VzTGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWRkRm9jdXNMaXN0ZW5lcik7XG5cbnZhciBfaW5ET00gPSByZXF1aXJlKCdkb20taGVscGVycy91dGlsL2luRE9NJyk7XG5cbnZhciBfaW5ET00yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5ET00pO1xuXG52YXIgX2FjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9hY3RpdmVFbGVtZW50Jyk7XG5cbnZhciBfYWN0aXZlRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hY3RpdmVFbGVtZW50KTtcblxudmFyIF9jb250YWlucyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zJyk7XG5cbnZhciBfY29udGFpbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29udGFpbnMpO1xuXG52YXIgX2dldENvbnRhaW5lciA9IHJlcXVpcmUoJy4vdXRpbHMvZ2V0Q29udGFpbmVyJyk7XG5cbnZhciBfZ2V0Q29udGFpbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldENvbnRhaW5lcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBtb2RhbE1hbmFnZXIgPSBuZXcgX01vZGFsTWFuYWdlcjIuZGVmYXVsdCgpO1xuXG4vKipcbiAqIExvdmUgdGhlbSBvciBoYXRlIHRoZW0sIGA8TW9kYWwvPmAgcHJvdmlkZXMgYSBzb2xpZCBmb3VuZGF0aW9uIGZvciBjcmVhdGluZyBkaWFsb2dzLCBsaWdodGJveGVzLCBvciB3aGF0ZXZlciBlbHNlLlxuICogVGhlIE1vZGFsIGNvbXBvbmVudCByZW5kZXJzIGl0cyBgY2hpbGRyZW5gIG5vZGUgaW4gZnJvbnQgb2YgYSBiYWNrZHJvcCBjb21wb25lbnQuXG4gKlxuICogVGhlIE1vZGFsIG9mZmVycyBhIGZldyBoZWxwZnVsIGZlYXR1cmVzIG92ZXIgdXNpbmcganVzdCBhIGA8UG9ydGFsLz5gIGNvbXBvbmVudCBhbmQgc29tZSBzdHlsZXM6XG4gKlxuICogLSBNYW5hZ2VzIGRpYWxvZyBzdGFja2luZyB3aGVuIG9uZS1hdC1hLXRpbWUganVzdCBpc24ndCBlbm91Z2guXG4gKiAtIENyZWF0ZXMgYSBiYWNrZHJvcCwgZm9yIGRpc2FibGluZyBpbnRlcmFjdGlvbiBiZWxvdyB0aGUgbW9kYWwuXG4gKiAtIEl0IHByb3Blcmx5IG1hbmFnZXMgZm9jdXM7IG1vdmluZyB0byB0aGUgbW9kYWwgY29udGVudCwgYW5kIGtlZXBpbmcgaXQgdGhlcmUgdW50aWwgdGhlIG1vZGFsIGlzIGNsb3NlZC5cbiAqIC0gSXQgZGlzYWJsZXMgc2Nyb2xsaW5nIG9mIHRoZSBwYWdlIGNvbnRlbnQgd2hpbGUgb3Blbi5cbiAqIC0gQWRkcyB0aGUgYXBwcm9wcmlhdGUgQVJJQSByb2xlcyBhcmUgYXV0b21hdGljYWxseS5cbiAqIC0gRWFzaWx5IHBsdWdnYWJsZSBhbmltYXRpb25zIHZpYSBhIGA8VHJhbnNpdGlvbi8+YCBjb21wb25lbnQuXG4gKlxuICogTm90ZSB0aGF0LCBpbiB0aGUgc2FtZSB3YXkgdGhlIGJhY2tkcm9wIGVsZW1lbnQgcHJldmVudHMgdXNlcnMgZnJvbSBjbGlja2luZyBvciBpbnRlcmFjdGluZ1xuICogd2l0aCB0aGUgcGFnZSBjb250ZW50IHVuZGVybmVhdGggdGhlIE1vZGFsLCBTY3JlZW4gcmVhZGVycyBhbHNvIG5lZWQgdG8gYmUgc2lnbmFsZWQgdG8gbm90IHRvXG4gKiBpbnRlcmFjdCB3aXRoIHBhZ2UgY29udGVudCB3aGlsZSB0aGUgTW9kYWwgaXMgb3Blbi4gVG8gZG8gdGhpcywgd2UgdXNlIGEgY29tbW9uIHRlY2huaXF1ZSBvZiBhcHBseWluZ1xuICogdGhlIGBhcmlhLWhpZGRlbj0ndHJ1ZSdgIGF0dHJpYnV0ZSB0byB0aGUgbm9uLU1vZGFsIGVsZW1lbnRzIGluIHRoZSBNb2RhbCBgY29udGFpbmVyYC4gVGhpcyBtZWFucyB0aGF0IGZvclxuICogYSBNb2RhbCB0byBiZSB0cnVseSBtb2RhbCwgaXQgc2hvdWxkIGhhdmUgYSBgY29udGFpbmVyYCB0aGF0IGlzIF9vdXRzaWRlXyB5b3VyIGFwcCdzXG4gKiBSZWFjdCBoaWVyYXJjaHkgKHN1Y2ggYXMgdGhlIGRlZmF1bHQ6IGRvY3VtZW50LmJvZHkpLlxuICovXG52YXIgTW9kYWwgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ01vZGFsJyxcblxuXG4gIHByb3BUeXBlczogX2V4dGVuZHMoe30sIF9Qb3J0YWwyLmRlZmF1bHQucHJvcFR5cGVzLCB7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIE1vZGFsXG4gICAgICovXG4gICAgc2hvdzogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogQSBOb2RlLCBDb21wb25lbnQgaW5zdGFuY2UsIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBlaXRoZXIuIFRoZSBNb2RhbCBpcyBhcHBlbmRlZCB0byBpdCdzIGNvbnRhaW5lciBlbGVtZW50LlxuICAgICAqXG4gICAgICogRm9yIHRoZSBzYWtlIG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSBjb250YWluZXIgc2hvdWxkIHVzdWFsbHkgYmUgdGhlIGRvY3VtZW50IGJvZHksIHNvIHRoYXQgdGhlIHJlc3Qgb2YgdGhlXG4gICAgICogcGFnZSBjb250ZW50IGNhbiBiZSBwbGFjZWQgYmVoaW5kIGEgdmlydHVhbCBiYWNrZHJvcCBhcyB3ZWxsIGFzIGEgdmlzdWFsIG9uZS5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfY29tcG9uZW50T3JFbGVtZW50Mi5kZWZhdWx0LCBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmNdKSxcblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgZmlyZWQgd2hlbiB0aGUgTW9kYWwgaXMgb3BlbmluZy5cbiAgICAgKi9cbiAgICBvblNob3c6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgZmlyZWQgd2hlbiBlaXRoZXIgdGhlIGJhY2tkcm9wIGlzIGNsaWNrZWQsIG9yIHRoZSBlc2NhcGUga2V5IGlzIHByZXNzZWQuXG4gICAgICpcbiAgICAgKiBUaGUgYG9uSGlkZWAgY2FsbGJhY2sgb25seSBzaWduYWxzIGludGVudCBmcm9tIHRoZSBNb2RhbCxcbiAgICAgKiB5b3UgbXVzdCBhY3R1YWxseSBzZXQgdGhlIGBzaG93YCBwcm9wIHRvIGBmYWxzZWAgZm9yIHRoZSBNb2RhbCB0byBjbG9zZS5cbiAgICAgKi9cbiAgICBvbkhpZGU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEluY2x1ZGUgYSBiYWNrZHJvcCBjb21wb25lbnQuXG4gICAgICovXG4gICAgYmFja2Ryb3A6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsIF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub25lT2YoWydzdGF0aWMnXSldKSxcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgYmFja2Ryb3AgY29tcG9uZW50LiBVc2VmdWwgZm9yIGN1c3RvbVxuICAgICAqIGJhY2tkcm9wIHJlbmRlcmluZy5cbiAgICAgKlxuICAgICAqIGBgYGpzXG4gICAgICogIHJlbmRlckJhY2tkcm9wPXtwcm9wcyA9PiA8TXlCYWNrZHJvcCB7Li4ucHJvcHN9IC8+fVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIHJlbmRlckJhY2tkcm9wOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGVzY2FwZSBrZXksIGlmIHNwZWNpZmllZCBpbiBga2V5Ym9hcmRgLCBpcyBwcmVzc2VkLlxuICAgICAqL1xuICAgIG9uRXNjYXBlS2V5VXA6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgZmlyZWQgd2hlbiB0aGUgYmFja2Ryb3AsIGlmIHNwZWNpZmllZCwgaXMgY2xpY2tlZC5cbiAgICAgKi9cbiAgICBvbkJhY2tkcm9wQ2xpY2s6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIEEgc3R5bGUgb2JqZWN0IGZvciB0aGUgYmFja2Ryb3AgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGJhY2tkcm9wU3R5bGU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3IgY2xhc3NlcyBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcENsYXNzTmFtZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5zdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBBIGNzcyBjbGFzcyBvciBzZXQgb2YgY2xhc3NlcyBhcHBsaWVkIHRvIHRoZSBtb2RhbCBjb250YWluZXIgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbixcbiAgICAgKiBhbmQgcmVtb3ZlZCB3aGVuIGl0IGlzIGNsb3NlZC5cbiAgICAgKi9cbiAgICBjb250YWluZXJDbGFzc05hbWU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIG1vZGFsIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkXG4gICAgICovXG4gICAga2V5Ym9hcmQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIEEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudCB0byB1c2UgZm9yIHRoZSBkaWFsb2cgYW5kIGJhY2tkcm9wIGNvbXBvbmVudHMuXG4gICAgICovXG4gICAgdHJhbnNpdGlvbjogX2VsZW1lbnRUeXBlMi5kZWZhdWx0LFxuXG4gICAgLyoqXG4gICAgICogVGhlIGB0aW1lb3V0YCBvZiB0aGUgZGlhbG9nIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0XG4gICAgICogdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8qKlxuICAgICAqIFRoZSBgdGltZW91dGAgb2YgdGhlIGJhY2tkcm9wIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvXG4gICAgICogZW5zdXJlIHRoYXQgdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBgdHJ1ZWAgVGhlIG1vZGFsIHdpbGwgYXV0b21hdGljYWxseSBzaGlmdCBmb2N1cyB0byBpdHNlbGYgd2hlbiBpdCBvcGVucywgYW5kXG4gICAgICogcmVwbGFjZSBpdCB0byB0aGUgbGFzdCBmb2N1c2VkIGVsZW1lbnQgd2hlbiBpdCBjbG9zZXMuIFRoaXMgYWxzb1xuICAgICAqIHdvcmtzIGNvcnJlY3RseSB3aXRoIGFueSBNb2RhbCBjaGlsZHJlbiB0aGF0IGhhdmUgdGhlIGBhdXRvRm9jdXNgIHByb3AuXG4gICAgICpcbiAgICAgKiBHZW5lcmFsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgc2V0IHRvIGBmYWxzZWAgYXMgaXQgbWFrZXMgdGhlIE1vZGFsIGxlc3NcbiAgICAgKiBhY2Nlc3NpYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGxpa2Ugc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgYXV0b0ZvY3VzOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGB0cnVlYCBUaGUgbW9kYWwgd2lsbCBwcmV2ZW50IGZvY3VzIGZyb20gbGVhdmluZyB0aGUgTW9kYWwgd2hpbGUgb3Blbi5cbiAgICAgKlxuICAgICAqIEdlbmVyYWxseSB0aGlzIHNob3VsZCBuZXZlciBiZSBzZXQgdG8gYGZhbHNlYCBhcyBpdCBtYWtlcyB0aGUgTW9kYWwgbGVzc1xuICAgICAqIGFjY2Vzc2libGUgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgbGlrZSBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBlbmZvcmNlRm9jdXM6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGJlZm9yZSB0aGUgTW9kYWwgdHJhbnNpdGlvbnMgaW5cbiAgICAgKi9cbiAgICBvbkVudGVyOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhcyB0aGUgTW9kYWwgYmVnaW5zIHRvIHRyYW5zaXRpb24gaW5cbiAgICAgKi9cbiAgICBvbkVudGVyaW5nOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgTW9kYWwgZmluaXNoZXMgdHJhbnNpdGlvbmluZyBpblxuICAgICAqL1xuICAgIG9uRW50ZXJlZDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSBNb2RhbCB0cmFuc2l0aW9ucyBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXQ6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFzIHRoZSBNb2RhbCBiZWdpbnMgdG8gdHJhbnNpdGlvbiBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXRpbmc6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBNb2RhbCBmaW5pc2hlcyB0cmFuc2l0aW9uaW5nIG91dFxuICAgICAqL1xuICAgIG9uRXhpdGVkOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIE1vZGFsTWFuYWdlciBpbnN0YW5jZSB1c2VkIHRvIHRyYWNrIGFuZCBtYW5hZ2UgdGhlIHN0YXRlIG9mIG9wZW5cbiAgICAgKiBNb2RhbHMuIFVzZWZ1bCB3aGVuIGN1c3RvbWl6aW5nIGhvdyBtb2RhbHMgaW50ZXJhY3Qgd2l0aGluIGEgY29udGFpbmVyXG4gICAgICovXG4gICAgbWFuYWdlcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuICB9KSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICBhdXRvRm9jdXM6IHRydWUsXG4gICAgICBlbmZvcmNlRm9jdXM6IHRydWUsXG4gICAgICBvbkhpZGU6IG5vb3AsXG4gICAgICBtYW5hZ2VyOiBtb2RhbE1hbmFnZXIsXG4gICAgICByZW5kZXJCYWNrZHJvcDogZnVuY3Rpb24gcmVuZGVyQmFja2Ryb3AocHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCBwcm9wcyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHsgZXhpdGVkOiAhdGhpcy5wcm9wcy5zaG93IH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBzaG93ID0gX3Byb3BzLnNob3c7XG4gICAgdmFyIGNvbnRhaW5lciA9IF9wcm9wcy5jb250YWluZXI7XG4gICAgdmFyIGNoaWxkcmVuID0gX3Byb3BzLmNoaWxkcmVuO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzLnRyYW5zaXRpb247XG4gICAgdmFyIGJhY2tkcm9wID0gX3Byb3BzLmJhY2tkcm9wO1xuICAgIHZhciBkaWFsb2dUcmFuc2l0aW9uVGltZW91dCA9IF9wcm9wcy5kaWFsb2dUcmFuc2l0aW9uVGltZW91dDtcbiAgICB2YXIgY2xhc3NOYW1lID0gX3Byb3BzLmNsYXNzTmFtZTtcbiAgICB2YXIgc3R5bGUgPSBfcHJvcHMuc3R5bGU7XG4gICAgdmFyIG9uRXhpdCA9IF9wcm9wcy5vbkV4aXQ7XG4gICAgdmFyIG9uRXhpdGluZyA9IF9wcm9wcy5vbkV4aXRpbmc7XG4gICAgdmFyIG9uRW50ZXIgPSBfcHJvcHMub25FbnRlcjtcbiAgICB2YXIgb25FbnRlcmluZyA9IF9wcm9wcy5vbkVudGVyaW5nO1xuICAgIHZhciBvbkVudGVyZWQgPSBfcHJvcHMub25FbnRlcmVkO1xuXG5cbiAgICB2YXIgZGlhbG9nID0gX3JlYWN0Mi5kZWZhdWx0LkNoaWxkcmVuLm9ubHkoY2hpbGRyZW4pO1xuXG4gICAgdmFyIG1vdW50TW9kYWwgPSBzaG93IHx8IFRyYW5zaXRpb24gJiYgIXRoaXMuc3RhdGUuZXhpdGVkO1xuICAgIGlmICghbW91bnRNb2RhbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIF9kaWFsb2ckcHJvcHMgPSBkaWFsb2cucHJvcHM7XG4gICAgdmFyIHJvbGUgPSBfZGlhbG9nJHByb3BzLnJvbGU7XG4gICAgdmFyIHRhYkluZGV4ID0gX2RpYWxvZyRwcm9wcy50YWJJbmRleDtcblxuXG4gICAgaWYgKHJvbGUgPT09IHVuZGVmaW5lZCB8fCB0YWJJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkaWFsb2cgPSAoMCwgX3JlYWN0LmNsb25lRWxlbWVudCkoZGlhbG9nLCB7XG4gICAgICAgIHJvbGU6IHJvbGUgPT09IHVuZGVmaW5lZCA/ICdkb2N1bWVudCcgOiByb2xlLFxuICAgICAgICB0YWJJbmRleDogdGFiSW5kZXggPT0gbnVsbCA/ICctMScgOiB0YWJJbmRleFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKFRyYW5zaXRpb24pIHtcbiAgICAgIGRpYWxvZyA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBUcmFuc2l0aW9uLFxuICAgICAgICB7XG4gICAgICAgICAgdHJhbnNpdGlvbkFwcGVhcjogdHJ1ZSxcbiAgICAgICAgICB1bm1vdW50T25FeGl0OiB0cnVlLFxuICAgICAgICAgICdpbic6IHNob3csXG4gICAgICAgICAgdGltZW91dDogZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQsXG4gICAgICAgICAgb25FeGl0OiBvbkV4aXQsXG4gICAgICAgICAgb25FeGl0aW5nOiBvbkV4aXRpbmcsXG4gICAgICAgICAgb25FeGl0ZWQ6IHRoaXMuaGFuZGxlSGlkZGVuLFxuICAgICAgICAgIG9uRW50ZXI6IG9uRW50ZXIsXG4gICAgICAgICAgb25FbnRlcmluZzogb25FbnRlcmluZyxcbiAgICAgICAgICBvbkVudGVyZWQ6IG9uRW50ZXJlZFxuICAgICAgICB9LFxuICAgICAgICBkaWFsb2dcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgX1BvcnRhbDIuZGVmYXVsdCxcbiAgICAgIHtcbiAgICAgICAgcmVmOiB0aGlzLnNldE1vdW50Tm9kZSxcbiAgICAgICAgY29udGFpbmVyOiBjb250YWluZXJcbiAgICAgIH0sXG4gICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICByZWY6ICdtb2RhbCcsXG4gICAgICAgICAgcm9sZTogcm9sZSB8fCAnZGlhbG9nJyxcbiAgICAgICAgICBzdHlsZTogc3R5bGUsXG4gICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWVcbiAgICAgICAgfSxcbiAgICAgICAgYmFja2Ryb3AgJiYgdGhpcy5yZW5kZXJCYWNrZHJvcCgpLFxuICAgICAgICBkaWFsb2dcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXJCYWNrZHJvcDogZnVuY3Rpb24gcmVuZGVyQmFja2Ryb3AoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfcHJvcHMyID0gdGhpcy5wcm9wcztcbiAgICB2YXIgYmFja2Ryb3BTdHlsZSA9IF9wcm9wczIuYmFja2Ryb3BTdHlsZTtcbiAgICB2YXIgYmFja2Ryb3BDbGFzc05hbWUgPSBfcHJvcHMyLmJhY2tkcm9wQ2xhc3NOYW1lO1xuICAgIHZhciByZW5kZXJCYWNrZHJvcCA9IF9wcm9wczIucmVuZGVyQmFja2Ryb3A7XG4gICAgdmFyIFRyYW5zaXRpb24gPSBfcHJvcHMyLnRyYW5zaXRpb247XG4gICAgdmFyIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQgPSBfcHJvcHMyLmJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ7XG5cblxuICAgIHZhciBiYWNrZHJvcFJlZiA9IGZ1bmN0aW9uIGJhY2tkcm9wUmVmKHJlZikge1xuICAgICAgcmV0dXJuIF90aGlzLmJhY2tkcm9wID0gcmVmO1xuICAgIH07XG5cbiAgICB2YXIgYmFja2Ryb3AgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgcmVmOiBiYWNrZHJvcFJlZixcbiAgICAgIHN0eWxlOiB0aGlzLnByb3BzLmJhY2tkcm9wU3R5bGUsXG4gICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuYmFja2Ryb3BDbGFzc05hbWUsXG4gICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZUJhY2tkcm9wQ2xpY2tcbiAgICB9KTtcblxuICAgIGlmIChUcmFuc2l0aW9uKSB7XG4gICAgICBiYWNrZHJvcCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBUcmFuc2l0aW9uLFxuICAgICAgICB7IHRyYW5zaXRpb25BcHBlYXI6IHRydWUsXG4gICAgICAgICAgJ2luJzogdGhpcy5wcm9wcy5zaG93LFxuICAgICAgICAgIHRpbWVvdXQ6IGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXRcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyQmFja2Ryb3Aoe1xuICAgICAgICAgIHJlZjogYmFja2Ryb3BSZWYsXG4gICAgICAgICAgc3R5bGU6IGJhY2tkcm9wU3R5bGUsXG4gICAgICAgICAgY2xhc3NOYW1lOiBiYWNrZHJvcENsYXNzTmFtZSxcbiAgICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZUJhY2tkcm9wQ2xpY2tcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhY2tkcm9wO1xuICB9LFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGV4aXRlZDogZmFsc2UgfSk7XG4gICAgfSBlbHNlIGlmICghbmV4dFByb3BzLnRyYW5zaXRpb24pIHtcbiAgICAgIC8vIE90aGVyd2lzZSBsZXQgaGFuZGxlSGlkZGVuIHRha2UgY2FyZSBvZiBtYXJraW5nIGV4aXRlZC5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IHRydWUgfSk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgIGlmICghdGhpcy5wcm9wcy5zaG93ICYmIG5leHRQcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLmNoZWNrRm9yRm9jdXMoKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgdmFyIHRyYW5zaXRpb24gPSB0aGlzLnByb3BzLnRyYW5zaXRpb247XG5cblxuICAgIGlmIChwcmV2UHJvcHMuc2hvdyAmJiAhdGhpcy5wcm9wcy5zaG93ICYmICF0cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgaGFuZGxlSGlkZGVuIHdpbGwgY2FsbCB0aGlzLlxuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2UgaWYgKCFwcmV2UHJvcHMuc2hvdyAmJiB0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdmFyIF9wcm9wczMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBzaG93ID0gX3Byb3BzMy5zaG93O1xuICAgIHZhciB0cmFuc2l0aW9uID0gX3Byb3BzMy50cmFuc2l0aW9uO1xuXG5cbiAgICBpZiAoc2hvdyB8fCB0cmFuc2l0aW9uICYmICF0aGlzLnN0YXRlLmV4aXRlZCkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIG9uU2hvdzogZnVuY3Rpb24gb25TaG93KCkge1xuICAgIHZhciBkb2MgPSAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpO1xuICAgIHZhciBjb250YWluZXIgPSAoMCwgX2dldENvbnRhaW5lcjIuZGVmYXVsdCkodGhpcy5wcm9wcy5jb250YWluZXIsIGRvYy5ib2R5KTtcblxuICAgIHRoaXMucHJvcHMubWFuYWdlci5hZGQodGhpcywgY29udGFpbmVyLCB0aGlzLnByb3BzLmNvbnRhaW5lckNsYXNzTmFtZSk7XG5cbiAgICB0aGlzLl9vbkRvY3VtZW50S2V5dXBMaXN0ZW5lciA9ICgwLCBfYWRkRXZlbnRMaXN0ZW5lcjIuZGVmYXVsdCkoZG9jLCAna2V5dXAnLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5VXApO1xuXG4gICAgdGhpcy5fb25Gb2N1c2luTGlzdGVuZXIgPSAoMCwgX2FkZEZvY3VzTGlzdGVuZXIyLmRlZmF1bHQpKHRoaXMuZW5mb3JjZUZvY3VzKTtcblxuICAgIHRoaXMuZm9jdXMoKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uU2hvdykge1xuICAgICAgdGhpcy5wcm9wcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIG9uSGlkZTogZnVuY3Rpb24gb25IaWRlKCkge1xuICAgIHRoaXMucHJvcHMubWFuYWdlci5yZW1vdmUodGhpcyk7XG5cbiAgICB0aGlzLl9vbkRvY3VtZW50S2V5dXBMaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMuX29uRm9jdXNpbkxpc3RlbmVyLnJlbW92ZSgpO1xuXG4gICAgdGhpcy5yZXN0b3JlTGFzdEZvY3VzKCk7XG4gIH0sXG4gIHNldE1vdW50Tm9kZTogZnVuY3Rpb24gc2V0TW91bnROb2RlKHJlZikge1xuICAgIHRoaXMubW91bnROb2RlID0gcmVmID8gcmVmLmdldE1vdW50Tm9kZSgpIDogcmVmO1xuICB9LFxuICBoYW5kbGVIaWRkZW46IGZ1bmN0aW9uIGhhbmRsZUhpZGRlbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiB0cnVlIH0pO1xuICAgIHRoaXMub25IaWRlKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkV4aXRlZCkge1xuICAgICAgdmFyIF9wcm9wczQ7XG5cbiAgICAgIChfcHJvcHM0ID0gdGhpcy5wcm9wcykub25FeGl0ZWQuYXBwbHkoX3Byb3BzNCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZUJhY2tkcm9wQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUJhY2tkcm9wQ2xpY2soZSkge1xuICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25CYWNrZHJvcENsaWNrKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljayhlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5iYWNrZHJvcCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZURvY3VtZW50S2V5VXA6IGZ1bmN0aW9uIGhhbmRsZURvY3VtZW50S2V5VXAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmtleWJvYXJkICYmIGUua2V5Q29kZSA9PT0gMjcgJiYgdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm9uRXNjYXBlS2V5VXApIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkVzY2FwZUtleVVwKGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIGNoZWNrRm9yRm9jdXM6IGZ1bmN0aW9uIGNoZWNrRm9yRm9jdXMoKSB7XG4gICAgaWYgKF9pbkRPTTIuZGVmYXVsdCkge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSAoMCwgX2FjdGl2ZUVsZW1lbnQyLmRlZmF1bHQpKCk7XG4gICAgfVxuICB9LFxuICBmb2N1czogZnVuY3Rpb24gZm9jdXMoKSB7XG4gICAgdmFyIGF1dG9Gb2N1cyA9IHRoaXMucHJvcHMuYXV0b0ZvY3VzO1xuICAgIHZhciBtb2RhbENvbnRlbnQgPSB0aGlzLmdldERpYWxvZ0VsZW1lbnQoKTtcbiAgICB2YXIgY3VycmVudCA9ICgwLCBfYWN0aXZlRWxlbWVudDIuZGVmYXVsdCkoKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKSk7XG4gICAgdmFyIGZvY3VzSW5Nb2RhbCA9IGN1cnJlbnQgJiYgKDAsIF9jb250YWluczIuZGVmYXVsdCkobW9kYWxDb250ZW50LCBjdXJyZW50KTtcblxuICAgIGlmIChtb2RhbENvbnRlbnQgJiYgYXV0b0ZvY3VzICYmICFmb2N1c0luTW9kYWwpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gY3VycmVudDtcblxuICAgICAgaWYgKCFtb2RhbENvbnRlbnQuaGFzQXR0cmlidXRlKCd0YWJJbmRleCcpKSB7XG4gICAgICAgIG1vZGFsQ29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JywgLTEpO1xuICAgICAgICAoMCwgX3dhcm5pbmcyLmRlZmF1bHQpKGZhbHNlLCAnVGhlIG1vZGFsIGNvbnRlbnQgbm9kZSBkb2VzIG5vdCBhY2NlcHQgZm9jdXMuICcgKyAnRm9yIHRoZSBiZW5lZml0IG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSB0YWJJbmRleCBvZiB0aGUgbm9kZSBpcyBiZWluZyBzZXQgdG8gXCItMVwiLicpO1xuICAgICAgfVxuXG4gICAgICBtb2RhbENvbnRlbnQuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG4gIHJlc3RvcmVMYXN0Rm9jdXM6IGZ1bmN0aW9uIHJlc3RvcmVMYXN0Rm9jdXMoKSB7XG4gICAgLy8gU3VwcG9ydDogPD1JRTExIGRvZXNuJ3Qgc3VwcG9ydCBgZm9jdXMoKWAgb24gc3ZnIGVsZW1lbnRzIChSQjogIzkxNylcbiAgICBpZiAodGhpcy5sYXN0Rm9jdXMgJiYgdGhpcy5sYXN0Rm9jdXMuZm9jdXMpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzLmZvY3VzKCk7XG4gICAgICB0aGlzLmxhc3RGb2N1cyA9IG51bGw7XG4gICAgfVxuICB9LFxuICBlbmZvcmNlRm9jdXM6IGZ1bmN0aW9uIGVuZm9yY2VGb2N1cygpIHtcbiAgICB2YXIgZW5mb3JjZUZvY3VzID0gdGhpcy5wcm9wcy5lbmZvcmNlRm9jdXM7XG5cblxuICAgIGlmICghZW5mb3JjZUZvY3VzIHx8ICF0aGlzLmlzTW91bnRlZCgpIHx8ICF0aGlzLmlzVG9wTW9kYWwoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhY3RpdmUgPSAoMCwgX2FjdGl2ZUVsZW1lbnQyLmRlZmF1bHQpKCgwLCBfb3duZXJEb2N1bWVudDIuZGVmYXVsdCkodGhpcykpO1xuICAgIHZhciBtb2RhbCA9IHRoaXMuZ2V0RGlhbG9nRWxlbWVudCgpO1xuXG4gICAgaWYgKG1vZGFsICYmIG1vZGFsICE9PSBhY3RpdmUgJiYgISgwLCBfY29udGFpbnMyLmRlZmF1bHQpKG1vZGFsLCBhY3RpdmUpKSB7XG4gICAgICBtb2RhbC5mb2N1cygpO1xuICAgIH1cbiAgfSxcblxuXG4gIC8vaW5zdGVhZCBvZiBhIHJlZiwgd2hpY2ggbWlnaHQgY29uZmxpY3Qgd2l0aCBvbmUgdGhlIHBhcmVudCBhcHBsaWVkLlxuICBnZXREaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBnZXREaWFsb2dFbGVtZW50KCkge1xuICAgIHZhciBub2RlID0gdGhpcy5yZWZzLm1vZGFsO1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubGFzdENoaWxkO1xuICB9LFxuICBpc1RvcE1vZGFsOiBmdW5jdGlvbiBpc1RvcE1vZGFsKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLm1hbmFnZXIuaXNUb3BNb2RhbCh0aGlzKTtcbiAgfVxufSk7XG5cbk1vZGFsLk1hbmFnZXIgPSBfTW9kYWxNYW5hZ2VyMi5kZWZhdWx0O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBNb2RhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9zdHlsZSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3N0eWxlJyk7XG5cbnZhciBfc3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3R5bGUpO1xuXG52YXIgX2NsYXNzID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvY2xhc3MnKTtcblxudmFyIF9jbGFzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzcyk7XG5cbnZhciBfc2Nyb2xsYmFyU2l6ZSA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZScpO1xuXG52YXIgX3Njcm9sbGJhclNpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2Nyb2xsYmFyU2l6ZSk7XG5cbnZhciBfaXNPdmVyZmxvd2luZyA9IHJlcXVpcmUoJy4vdXRpbHMvaXNPdmVyZmxvd2luZycpO1xuXG52YXIgX2lzT3ZlcmZsb3dpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNPdmVyZmxvd2luZyk7XG5cbnZhciBfbWFuYWdlQXJpYUhpZGRlbiA9IHJlcXVpcmUoJy4vdXRpbHMvbWFuYWdlQXJpYUhpZGRlbicpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBmaW5kSW5kZXhPZihhcnIsIGNiKSB7XG4gIHZhciBpZHggPSAtMTtcbiAgYXJyLnNvbWUoZnVuY3Rpb24gKGQsIGkpIHtcbiAgICBpZiAoY2IoZCwgaSkpIHtcbiAgICAgIGlkeCA9IGk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gaWR4O1xufVxuXG5mdW5jdGlvbiBmaW5kQ29udGFpbmVyKGRhdGEsIG1vZGFsKSB7XG4gIHJldHVybiBmaW5kSW5kZXhPZihkYXRhLCBmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkLm1vZGFscy5pbmRleE9mKG1vZGFsKSAhPT0gLTE7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRDb250YWluZXJTdHlsZShzdGF0ZSwgY29udGFpbmVyKSB7XG4gIHZhciBzdHlsZSA9IHsgb3ZlcmZsb3c6ICdoaWRkZW4nIH07XG5cbiAgLy8gd2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpbiB0aGUgYWN0dWFsIGBzdHlsZWAgaGVyZVxuICAvLyBiZWNhc3VlIHdlIHdpbGwgb3ZlcnJpZGUgaXRcbiAgc3RhdGUuc3R5bGUgPSB7XG4gICAgb3ZlcmZsb3c6IGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvdyxcbiAgICBwYWRkaW5nUmlnaHQ6IGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nUmlnaHRcbiAgfTtcblxuICBpZiAoc3RhdGUub3ZlcmZsb3dpbmcpIHtcbiAgICAvLyB1c2UgY29tcHV0ZWQgc3R5bGUsIGhlcmUgdG8gZ2V0IHRoZSByZWFsIHBhZGRpbmdcbiAgICAvLyB0byBhZGQgb3VyIHNjcm9sbGJhciB3aWR0aFxuICAgIHN0eWxlLnBhZGRpbmdSaWdodCA9IHBhcnNlSW50KCgwLCBfc3R5bGUyLmRlZmF1bHQpKGNvbnRhaW5lciwgJ3BhZGRpbmdSaWdodCcpIHx8IDAsIDEwKSArICgwLCBfc2Nyb2xsYmFyU2l6ZTIuZGVmYXVsdCkoKSArICdweCc7XG4gIH1cblxuICAoMCwgX3N0eWxlMi5kZWZhdWx0KShjb250YWluZXIsIHN0eWxlKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29udGFpbmVyU3R5bGUoX3JlZiwgY29udGFpbmVyKSB7XG4gIHZhciBzdHlsZSA9IF9yZWYuc3R5bGU7XG5cblxuICBPYmplY3Qua2V5cyhzdHlsZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5zdHlsZVtrZXldID0gc3R5bGVba2V5XTtcbiAgfSk7XG59XG4vKipcbiAqIFByb3BlciBzdGF0ZSBtYW5hZ21lbnQgZm9yIGNvbnRhaW5lcnMgYW5kIHRoZSBtb2RhbHMgaW4gdGhvc2UgY29udGFpbmVycy5cbiAqXG4gKiBAaW50ZXJuYWwgVXNlZCBieSB0aGUgTW9kYWwgdG8gZW5zdXJlIHByb3BlciBzdHlsaW5nIG9mIGNvbnRhaW5lcnMuXG4gKi9cblxudmFyIE1vZGFsTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTW9kYWxNYW5hZ2VyKCkge1xuICAgIHZhciBfcmVmMiA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICB2YXIgX3JlZjIkaGlkZVNpYmxpbmdOb2RlID0gX3JlZjIuaGlkZVNpYmxpbmdOb2RlcztcbiAgICB2YXIgaGlkZVNpYmxpbmdOb2RlcyA9IF9yZWYyJGhpZGVTaWJsaW5nTm9kZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9yZWYyJGhpZGVTaWJsaW5nTm9kZTtcbiAgICB2YXIgX3JlZjIkaGFuZGxlQ29udGFpbmVyID0gX3JlZjIuaGFuZGxlQ29udGFpbmVyT3ZlcmZsb3c7XG4gICAgdmFyIGhhbmRsZUNvbnRhaW5lck92ZXJmbG93ID0gX3JlZjIkaGFuZGxlQ29udGFpbmVyID09PSB1bmRlZmluZWQgPyB0cnVlIDogX3JlZjIkaGFuZGxlQ29udGFpbmVyO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZGFsTWFuYWdlcik7XG5cbiAgICB0aGlzLmhpZGVTaWJsaW5nTm9kZXMgPSBoaWRlU2libGluZ05vZGVzO1xuICAgIHRoaXMuaGFuZGxlQ29udGFpbmVyT3ZlcmZsb3cgPSBoYW5kbGVDb250YWluZXJPdmVyZmxvdztcbiAgICB0aGlzLm1vZGFscyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IFtdO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1vZGFsTWFuYWdlciwgW3tcbiAgICBrZXk6ICdhZGQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQobW9kYWwsIGNvbnRhaW5lciwgY2xhc3NOYW1lKSB7XG4gICAgICB2YXIgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5pbmRleE9mKG1vZGFsKTtcbiAgICAgIHZhciBjb250YWluZXJJZHggPSB0aGlzLmNvbnRhaW5lcnMuaW5kZXhPZihjb250YWluZXIpO1xuXG4gICAgICBpZiAobW9kYWxJZHggIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICAgIH1cblxuICAgICAgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5sZW5ndGg7XG4gICAgICB0aGlzLm1vZGFscy5wdXNoKG1vZGFsKTtcblxuICAgICAgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgICAoMCwgX21hbmFnZUFyaWFIaWRkZW4uaGlkZVNpYmxpbmdzKShjb250YWluZXIsIG1vZGFsLm1vdW50Tm9kZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250YWluZXJJZHggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuZGF0YVtjb250YWluZXJJZHhdLm1vZGFscy5wdXNoKG1vZGFsKTtcbiAgICAgICAgcmV0dXJuIG1vZGFsSWR4O1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbW9kYWxzOiBbbW9kYWxdLFxuICAgICAgICAvL3JpZ2h0IG5vdyBvbmx5IHRoZSBmaXJzdCBtb2RhbCBvZiBhIGNvbnRhaW5lciB3aWxsIGhhdmUgaXRzIGNsYXNzZXMgYXBwbGllZFxuICAgICAgICBjbGFzc2VzOiBjbGFzc05hbWUgPyBjbGFzc05hbWUuc3BsaXQoL1xccysvKSA6IFtdLFxuXG4gICAgICAgIG92ZXJmbG93aW5nOiAoMCwgX2lzT3ZlcmZsb3dpbmcyLmRlZmF1bHQpKGNvbnRhaW5lcilcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmhhbmRsZUNvbnRhaW5lck92ZXJmbG93KSB7XG4gICAgICAgIHNldENvbnRhaW5lclN0eWxlKGRhdGEsIGNvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKF9jbGFzczIuZGVmYXVsdC5hZGRDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgICB0aGlzLmNvbnRhaW5lcnMucHVzaChjb250YWluZXIpO1xuICAgICAgdGhpcy5kYXRhLnB1c2goZGF0YSk7XG5cbiAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZW1vdmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUobW9kYWwpIHtcbiAgICAgIHZhciBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmluZGV4T2YobW9kYWwpO1xuXG4gICAgICBpZiAobW9kYWxJZHggPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRhaW5lcklkeCA9IGZpbmRDb250YWluZXIodGhpcy5kYXRhLCBtb2RhbCk7XG4gICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YVtjb250YWluZXJJZHhdO1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZHhdO1xuXG4gICAgICBkYXRhLm1vZGFscy5zcGxpY2UoZGF0YS5tb2RhbHMuaW5kZXhPZihtb2RhbCksIDEpO1xuXG4gICAgICB0aGlzLm1vZGFscy5zcGxpY2UobW9kYWxJZHgsIDEpO1xuXG4gICAgICAvLyBpZiB0aGF0IHdhcyB0aGUgbGFzdCBtb2RhbCBpbiBhIGNvbnRhaW5lcixcbiAgICAgIC8vIGNsZWFuIHVwIHRoZSBjb250YWluZXJcbiAgICAgIGlmIChkYXRhLm1vZGFscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2NsYXNzMi5kZWZhdWx0LnJlbW92ZUNsYXNzLmJpbmQobnVsbCwgY29udGFpbmVyKSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlQ29udGFpbmVyT3ZlcmZsb3cpIHtcbiAgICAgICAgICByZW1vdmVDb250YWluZXJTdHlsZShkYXRhLCBjb250YWluZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgICAgICgwLCBfbWFuYWdlQXJpYUhpZGRlbi5zaG93U2libGluZ3MpKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lcnMuc3BsaWNlKGNvbnRhaW5lcklkeCwgMSk7XG4gICAgICAgIHRoaXMuZGF0YS5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgIC8vb3RoZXJ3aXNlIG1ha2Ugc3VyZSB0aGUgbmV4dCB0b3AgbW9kYWwgaXMgdmlzaWJsZSB0byBhIFNSXG4gICAgICAgICgwLCBfbWFuYWdlQXJpYUhpZGRlbi5hcmlhSGlkZGVuKShmYWxzZSwgZGF0YS5tb2RhbHNbZGF0YS5tb2RhbHMubGVuZ3RoIC0gMV0ubW91bnROb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdpc1RvcE1vZGFsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNUb3BNb2RhbChtb2RhbCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5tb2RhbHMubGVuZ3RoICYmIHRoaXMubW9kYWxzW3RoaXMubW9kYWxzLmxlbmd0aCAtIDFdID09PSBtb2RhbDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTW9kYWxNYW5hZ2VyO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBNb2RhbE1hbmFnZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3RET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0RE9NJ10gOiBudWxsKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfY29tcG9uZW50T3JFbGVtZW50ID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvY29tcG9uZW50T3JFbGVtZW50Jyk7XG5cbnZhciBfY29tcG9uZW50T3JFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbXBvbmVudE9yRWxlbWVudCk7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vdXRpbHMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX293bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3duZXJEb2N1bWVudCk7XG5cbnZhciBfZ2V0Q29udGFpbmVyID0gcmVxdWlyZSgnLi91dGlscy9nZXRDb250YWluZXInKTtcblxudmFyIF9nZXRDb250YWluZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0Q29udGFpbmVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBUaGUgYDxQb3J0YWwvPmAgY29tcG9uZW50IHJlbmRlcnMgaXRzIGNoaWxkcmVuIGludG8gYSBuZXcgXCJzdWJ0cmVlXCIgb3V0c2lkZSBvZiBjdXJyZW50IGNvbXBvbmVudCBoaWVyYXJjaHkuXG4gKiBZb3UgY2FuIHRoaW5rIG9mIGl0IGFzIGEgZGVjbGFyYXRpdmUgYGFwcGVuZENoaWxkKClgLCBvciBqUXVlcnkncyBgJC5mbi5hcHBlbmRUbygpYC5cbiAqIFRoZSBjaGlsZHJlbiBvZiBgPFBvcnRhbC8+YCBjb21wb25lbnQgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgYGNvbnRhaW5lcmAgc3BlY2lmaWVkLlxuICovXG52YXIgUG9ydGFsID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUNsYXNzKHtcblxuICBkaXNwbGF5TmFtZTogJ1BvcnRhbCcsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgLyoqXG4gICAgICogQSBOb2RlLCBDb21wb25lbnQgaW5zdGFuY2UsIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBlaXRoZXIuIFRoZSBgY29udGFpbmVyYCB3aWxsIGhhdmUgdGhlIFBvcnRhbCBjaGlsZHJlblxuICAgICAqIGFwcGVuZGVkIHRvIGl0LlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19jb21wb25lbnRPckVsZW1lbnQyLmRlZmF1bHQsIF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuZnVuY10pXG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fcmVuZGVyT3ZlcmxheSgpO1xuICB9LFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLl9vdmVybGF5VGFyZ2V0ICYmIG5leHRQcm9wcy5jb250YWluZXIgIT09IHRoaXMucHJvcHMuY29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlLnJlbW92ZUNoaWxkKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9ICgwLCBfZ2V0Q29udGFpbmVyMi5kZWZhdWx0KShuZXh0UHJvcHMuY29udGFpbmVyLCAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKHRoaXMpLmJvZHkpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICB0aGlzLl91bm1vdW50T3ZlcmxheVRhcmdldCgpO1xuICB9LFxuICBfbW91bnRPdmVybGF5VGFyZ2V0OiBmdW5jdGlvbiBfbW91bnRPdmVybGF5VGFyZ2V0KCkge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgdGhpcy5fb3ZlcmxheVRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9ICgwLCBfZ2V0Q29udGFpbmVyMi5kZWZhdWx0KSh0aGlzLnByb3BzLmNvbnRhaW5lciwgKDAsIF9vd25lckRvY3VtZW50Mi5kZWZhdWx0KSh0aGlzKS5ib2R5KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfVxuICB9LFxuICBfdW5tb3VudE92ZXJsYXlUYXJnZXQ6IGZ1bmN0aW9uIF91bm1vdW50T3ZlcmxheVRhcmdldCgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCkge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX292ZXJsYXlUYXJnZXQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gbnVsbDtcbiAgfSxcbiAgX3JlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF9yZW5kZXJPdmVybGF5KCkge1xuXG4gICAgdmFyIG92ZXJsYXkgPSAhdGhpcy5wcm9wcy5jaGlsZHJlbiA/IG51bGwgOiBfcmVhY3QyLmRlZmF1bHQuQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblxuICAgIC8vIFNhdmUgcmVmZXJlbmNlIGZvciBmdXR1cmUgYWNjZXNzLlxuICAgIGlmIChvdmVybGF5ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlJbnN0YW5jZSA9IF9yZWFjdERvbTIuZGVmYXVsdC51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcih0aGlzLCBvdmVybGF5LCB0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVW5yZW5kZXIgaWYgdGhlIGNvbXBvbmVudCBpcyBudWxsIGZvciB0cmFuc2l0aW9ucyB0byBudWxsXG4gICAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX3VubW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gICAgfVxuICB9LFxuICBfdW5yZW5kZXJPdmVybGF5OiBmdW5jdGlvbiBfdW5yZW5kZXJPdmVybGF5KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5VGFyZ2V0KSB7XG4gICAgICBfcmVhY3REb20yLmRlZmF1bHQudW5tb3VudENvbXBvbmVudEF0Tm9kZSh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX292ZXJsYXlJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgZ2V0TW91bnROb2RlOiBmdW5jdGlvbiBnZXRNb3VudE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlUYXJnZXQ7XG4gIH0sXG4gIGdldE92ZXJsYXlET01Ob2RlOiBmdW5jdGlvbiBnZXRPdmVybGF5RE9NTm9kZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZ2V0T3ZlcmxheURPTU5vZGUoKTogQSBjb21wb25lbnQgbXVzdCBiZSBtb3VudGVkIHRvIGhhdmUgYSBET00gbm9kZS4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheUluc3RhbmNlKSB7XG4gICAgICByZXR1cm4gX3JlYWN0RG9tMi5kZWZhdWx0LmZpbmRET01Ob2RlKHRoaXMuX292ZXJsYXlJbnN0YW5jZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQb3J0YWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChub2RlLCBldmVudCwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAoMCwgX29uMi5kZWZhdWx0KShub2RlLCBldmVudCwgaGFuZGxlciwgY2FwdHVyZSk7XG5cbiAgcmV0dXJuIHtcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICgwLCBfb2ZmMi5kZWZhdWx0KShub2RlLCBldmVudCwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgfVxuICB9O1xufTtcblxudmFyIF9vbiA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2V2ZW50cy9vbicpO1xuXG52YXIgX29uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29uKTtcblxudmFyIF9vZmYgPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb2ZmJyk7XG5cbnZhciBfb2ZmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29mZik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGFkZEZvY3VzTGlzdGVuZXI7XG4vKipcbiAqIEZpcmVmb3ggZG9lc24ndCBoYXZlIGEgZm9jdXNpbiBldmVudCBzbyB1c2luZyBjYXB0dXJlIGlzIGVhc2llc3Qgd2F5IHRvIGdldCBidWJibGluZ1xuICogSUU4IGNhbid0IGRvIGFkZEV2ZW50TGlzdGVuZXIsIGJ1dCBkb2VzIGhhdmUgb25mb2N1c2luLCBzbyB3ZSB1c2UgdGhhdCBpbiBpZThcbiAqXG4gKiBXZSBvbmx5IGFsbG93IG9uZSBMaXN0ZW5lciBhdCBhIHRpbWUgdG8gYXZvaWQgc3RhY2sgb3ZlcmZsb3dzXG4gKi9cbmZ1bmN0aW9uIGFkZEZvY3VzTGlzdGVuZXIoaGFuZGxlcikge1xuICB2YXIgdXNlRm9jdXNpbiA9ICFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyO1xuICB2YXIgcmVtb3ZlID0gdm9pZCAwO1xuXG4gIGlmICh1c2VGb2N1c2luKSB7XG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29uZm9jdXNpbicsIGhhbmRsZXIpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kZXRhY2hFdmVudCgnb25mb2N1c2luJywgaGFuZGxlcik7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4geyByZW1vdmU6IHJlbW92ZSB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0Q29udGFpbmVyO1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBnZXRDb250YWluZXIoY29udGFpbmVyLCBkZWZhdWx0Q29udGFpbmVyKSB7XG4gIGNvbnRhaW5lciA9IHR5cGVvZiBjb250YWluZXIgPT09ICdmdW5jdGlvbicgPyBjb250YWluZXIoKSA6IGNvbnRhaW5lcjtcbiAgcmV0dXJuIF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZShjb250YWluZXIpIHx8IGRlZmF1bHRDb250YWluZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBpc092ZXJmbG93aW5nO1xuXG52YXIgX2lzV2luZG93ID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvcXVlcnkvaXNXaW5kb3cnKTtcblxudmFyIF9pc1dpbmRvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1dpbmRvdyk7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBpc0JvZHkobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2JvZHknO1xufVxuXG5mdW5jdGlvbiBib2R5SXNPdmVyZmxvd2luZyhub2RlKSB7XG4gIHZhciBkb2MgPSAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKG5vZGUpO1xuICB2YXIgd2luID0gKDAsIF9pc1dpbmRvdzIuZGVmYXVsdCkoZG9jKTtcbiAgdmFyIGZ1bGxXaWR0aCA9IHdpbi5pbm5lcldpZHRoO1xuXG4gIC8vIFN1cHBvcnQ6IGllOCwgbm8gaW5uZXJXaWR0aFxuICBpZiAoIWZ1bGxXaWR0aCkge1xuICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBmdWxsV2lkdGggPSBkb2N1bWVudEVsZW1lbnRSZWN0LnJpZ2h0IC0gTWF0aC5hYnMoZG9jdW1lbnRFbGVtZW50UmVjdC5sZWZ0KTtcbiAgfVxuXG4gIHJldHVybiBkb2MuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaWR0aDtcbn1cblxuZnVuY3Rpb24gaXNPdmVyZmxvd2luZyhjb250YWluZXIpIHtcbiAgdmFyIHdpbiA9ICgwLCBfaXNXaW5kb3cyLmRlZmF1bHQpKGNvbnRhaW5lcik7XG5cbiAgcmV0dXJuIHdpbiB8fCBpc0JvZHkoY29udGFpbmVyKSA/IGJvZHlJc092ZXJmbG93aW5nKGNvbnRhaW5lcikgOiBjb250YWluZXIuc2Nyb2xsSGVpZ2h0ID4gY29udGFpbmVyLmNsaWVudEhlaWdodDtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYXJpYUhpZGRlbiA9IGFyaWFIaWRkZW47XG5leHBvcnRzLmhpZGVTaWJsaW5ncyA9IGhpZGVTaWJsaW5ncztcbmV4cG9ydHMuc2hvd1NpYmxpbmdzID0gc2hvd1NpYmxpbmdzO1xuXG52YXIgQkxBQ0tMSVNUID0gWyd0ZW1wbGF0ZScsICdzY3JpcHQnLCAnc3R5bGUnXTtcblxudmFyIGlzSGlkYWJsZSA9IGZ1bmN0aW9uIGlzSGlkYWJsZShfcmVmKSB7XG4gIHZhciBub2RlVHlwZSA9IF9yZWYubm9kZVR5cGU7XG4gIHZhciB0YWdOYW1lID0gX3JlZi50YWdOYW1lO1xuICByZXR1cm4gbm9kZVR5cGUgPT09IDEgJiYgQkxBQ0tMSVNULmluZGV4T2YodGFnTmFtZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTE7XG59O1xuXG52YXIgc2libGluZ3MgPSBmdW5jdGlvbiBzaWJsaW5ncyhjb250YWluZXIsIG1vdW50LCBjYikge1xuICBtb3VudCA9IFtdLmNvbmNhdChtb3VudCk7XG5cbiAgW10uZm9yRWFjaC5jYWxsKGNvbnRhaW5lci5jaGlsZHJlbiwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAobW91bnQuaW5kZXhPZihub2RlKSA9PT0gLTEgJiYgaXNIaWRhYmxlKG5vZGUpKSB7XG4gICAgICBjYihub2RlKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gYXJpYUhpZGRlbihzaG93LCBub2RlKSB7XG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoc2hvdykge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGlkZVNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlKSB7XG4gIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBhcmlhSGlkZGVuKHRydWUsIG5vZGUpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd1NpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlKSB7XG4gIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnROb2RlLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJldHVybiBhcmlhSGlkZGVuKGZhbHNlLCBub2RlKTtcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoY29tcG9uZW50T3JFbGVtZW50KSB7XG4gIHJldHVybiAoMCwgX293bmVyRG9jdW1lbnQyLmRlZmF1bHQpKF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZShjb21wb25lbnRPckVsZW1lbnQpKTtcbn07XG5cbnZhciBfcmVhY3REb20gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3RET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0RE9NJ10gOiBudWxsKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfb3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9vd25lckRvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX293bmVyRG9jdW1lbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyID0gcmVxdWlyZSgnLi91dGlscy9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcicpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHByb3BWYWx1ZSk7XG5cbiAgaWYgKF9yZWFjdDIuZGVmYXVsdC5pc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBSZWFjdEVsZW1lbnQgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3RDb21wb25lbnQgb3IgYSAnKSArICdET01FbGVtZW50LiBZb3UgY2FuIHVzdWFsbHkgb2J0YWluIGEgUmVhY3RDb21wb25lbnQgb3IgRE9NRWxlbWVudCAnICsgJ2Zyb20gYSBSZWFjdEVsZW1lbnQgYnkgYXR0YWNoaW5nIGEgcmVmIHRvIGl0LicpO1xuICB9XG5cbiAgaWYgKChwcm9wVHlwZSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHByb3BWYWx1ZS5yZW5kZXIgIT09ICdmdW5jdGlvbicpICYmIHByb3BWYWx1ZS5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3RDb21wb25lbnQgb3IgYSAnKSArICdET01FbGVtZW50LicpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIyLmRlZmF1bHQpKHZhbGlkYXRlKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyID0gcmVxdWlyZSgnLi91dGlscy9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcicpO1xuXG52YXIgX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZWxlbWVudFR5cGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHByb3BWYWx1ZSk7XG5cbiAgaWYgKF9yZWFjdDIuZGVmYXVsdC5pc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBSZWFjdEVsZW1lbnQgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGVsZW1lbnQgdHlwZSAoYSBzdHJpbmcgJykgKyAnb3IgYSBSZWFjdENsYXNzKS4nKTtcbiAgfVxuXG4gIGlmIChwcm9wVHlwZSAhPT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIHByb3BWYWx1ZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBlbGVtZW50IHR5cGUgKGEgc3RyaW5nICcpICsgJ29yIGEgUmVhY3RDbGFzcykuJyk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjIuZGVmYXVsdCkoZWxlbWVudFR5cGUpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyO1xuLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuLy8gTW9zdGx5IHRha2VuIGZyb20gUmVhY3RQcm9wVHlwZXMuXG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50TmFtZVNhZmUgPSBjb21wb25lbnROYW1lIHx8ICc8PGFub255bW91cz4+JztcbiAgICB2YXIgcHJvcEZ1bGxOYW1lU2FmZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmVxdWlyZWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZVNhZmUgKyAnYCB3YXMgbm90IHNwZWNpZmllZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWVTYWZlICsgJ2AuJykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiA2ID8gX2xlbiAtIDYgOiAwKSwgX2tleSA9IDY7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDZdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0ZS5hcHBseSh1bmRlZmluZWQsIFtwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWVTYWZlLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lU2FmZV0uY29uY2F0KGFyZ3MpKTtcbiAgfVxuXG4gIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbn0iLCIvKiFcbiAqIFxuICogIFJlYWN0IFNpbXBsZXRhYnMgLSBKdXN0IGEgc2ltcGxlIHRhYnMgY29tcG9uZW50IGJ1aWx0IHdpdGggUmVhY3RcbiAqICBAdmVyc2lvbiB2MC43LjBcbiAqICBAbGluayBodHRwczovL2dpdGh1Yi5jb20vcGVkcm9uYXVjay9yZWFjdC1zaW1wbGV0YWJzXG4gKiAgQGxpY2Vuc2UgTUlUXG4gKiAgQGF1dGhvciBQZWRybyBOYXVjayAoaHR0cHM6Ly9naXRodWIuY29tL3BlZHJvbmF1Y2spXG4gKiBcbiAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJyZWFjdFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXykge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyoqIEBqc3ggUmVhY3QuRE9NICovJ3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBjbGFzc05hbWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblxuXHRpZiAodHJ1ZSkge1xuXHQgIF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdH1cblxuXHR2YXIgVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ICBkaXNwbGF5TmFtZTogJ1RhYnMnLFxuXHQgIHByb3BUeXBlczoge1xuXHQgICAgY2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cdCAgICBdKSxcblx0ICAgIHRhYkFjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0ICAgIG9uTW91bnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25CZWZvcmVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25BZnRlckNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmVsZW1lbnRcblx0ICAgIF0pLmlzUmVxdWlyZWRcblx0ICB9LFxuXHQgIGdldERlZmF1bHRQcm9wczpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4geyB0YWJBY3RpdmU6IDEgfTtcblx0ICB9LFxuXHQgIGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB0YWJBY3RpdmU6IHRoaXMucHJvcHMudGFiQWN0aXZlXG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgY29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgaW5kZXggPSB0aGlzLnN0YXRlLnRhYkFjdGl2ZTtcblx0ICAgIHZhciAkc2VsZWN0ZWRQYW5lbCA9IHRoaXMucmVmc1sndGFiLXBhbmVsJ107XG5cdCAgICB2YXIgJHNlbGVjdGVkTWVudSA9IHRoaXMucmVmc1soXCJ0YWItbWVudS1cIiArIGluZGV4KV07XG5cblx0ICAgIGlmICh0aGlzLnByb3BzLm9uTW91bnQpIHtcblx0ICAgICAgdGhpcy5wcm9wcy5vbk1vdW50KGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkTWVudSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdCAgICBpZihuZXdQcm9wcy50YWJBY3RpdmUgJiYgbmV3UHJvcHMudGFiQWN0aXZlICE9PSB0aGlzLnByb3BzLnRhYkFjdGl2ZSl7XG5cdCAgICAgIHRoaXMuc2V0U3RhdGUoe3RhYkFjdGl2ZTogbmV3UHJvcHMudGFiQWN0aXZlfSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ3RhYnMnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIFxuXHQgICAgICAgIHRoaXMuX2dldE1lbnVJdGVtcygpLCBcblx0ICAgICAgICB0aGlzLl9nZXRTZWxlY3RlZFBhbmVsKClcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9LFxuXHQgIHNldEFjdGl2ZTpmdW5jdGlvbihpbmRleCwgZSkge1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCAgICB2YXIgb25BZnRlckNoYW5nZSA9IHRoaXMucHJvcHMub25BZnRlckNoYW5nZTtcblx0ICAgIHZhciBvbkJlZm9yZUNoYW5nZSA9IHRoaXMucHJvcHMub25CZWZvcmVDaGFuZ2U7XG5cdCAgICB2YXIgJHNlbGVjdGVkUGFuZWwgPSB0aGlzLnJlZnNbJ3RhYi1wYW5lbCddO1xuXHQgICAgdmFyICRzZWxlY3RlZFRhYk1lbnUgPSB0aGlzLnJlZnNbKFwidGFiLW1lbnUtXCIgKyBpbmRleCldO1xuXG5cdCAgICBpZiAob25CZWZvcmVDaGFuZ2UpIHtcblx0ICAgICAgdmFyIGNhbmNlbCA9IG9uQmVmb3JlQ2hhbmdlKGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkVGFiTWVudSk7XG5cdCAgICAgIGlmKGNhbmNlbCA9PT0gZmFsc2UpeyByZXR1cm4gfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNldFN0YXRlKHsgdGFiQWN0aXZlOiBpbmRleCB9LCBmdW5jdGlvbigpICB7XG5cdCAgICAgIGlmIChvbkFmdGVyQ2hhbmdlKSB7XG5cdCAgICAgICAgb25BZnRlckNoYW5nZShpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZFRhYk1lbnUpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIF9nZXRNZW51SXRlbXM6ZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVGFicyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIFRhYnMuUGFuZWwnKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuY2hpbGRyZW4pKSB7XG5cdCAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4gPSBbdGhpcy5wcm9wcy5jaGlsZHJlbl07XG5cdCAgICB9XG5cblx0ICAgIHZhciAkbWVudUl0ZW1zID0gdGhpcy5wcm9wcy5jaGlsZHJlblxuXHQgICAgICAubWFwKGZ1bmN0aW9uKCRwYW5lbCkgIHtyZXR1cm4gdHlwZW9mICRwYW5lbCA9PT0gJ2Z1bmN0aW9uJyA/ICRwYW5lbCgpIDogJHBhbmVsO30pXG5cdCAgICAgIC5maWx0ZXIoZnVuY3Rpb24oJHBhbmVsKSAge3JldHVybiAkcGFuZWw7fSlcblx0ICAgICAgLm1hcChmdW5jdGlvbigkcGFuZWwsIGluZGV4KSAge1xuXHQgICAgICAgIHZhciByZWYgPSAoXCJ0YWItbWVudS1cIiArIChpbmRleCArIDEpKTtcblx0ICAgICAgICB2YXIgdGl0bGUgPSAkcGFuZWwucHJvcHMudGl0bGU7XG5cdCAgICAgICAgdmFyIGNsYXNzZXMgPSBjbGFzc05hbWVzKFxuXHQgICAgICAgICAgJ3RhYnMtbWVudS1pdGVtJyxcblx0ICAgICAgICAgIHRoaXMuc3RhdGUudGFiQWN0aXZlID09PSAoaW5kZXggKyAxKSAmJiAnaXMtYWN0aXZlJ1xuXHQgICAgICAgICk7XG5cblx0ICAgICAgICByZXR1cm4gKFxuXHQgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtyZWY6IHJlZiwga2V5OiBpbmRleCwgY2xhc3NOYW1lOiBjbGFzc2VzfSwgXG5cdCAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNldEFjdGl2ZS5iaW5kKHRoaXMsIGluZGV4ICsgMSl9LCBcblx0ICAgICAgICAgICAgICB0aXRsZVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgICApXG5cdCAgICAgICAgKTtcblx0ICAgICAgfS5iaW5kKHRoaXMpKTtcblxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCB7Y2xhc3NOYW1lOiBcInRhYnMtbmF2aWdhdGlvblwifSwgXG5cdCAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwidGFicy1tZW51XCJ9LCAkbWVudUl0ZW1zKVxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH0sXG5cdCAgX2dldFNlbGVjdGVkUGFuZWw6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS50YWJBY3RpdmUgLSAxO1xuXHQgICAgdmFyICRwYW5lbCA9IHRoaXMucHJvcHMuY2hpbGRyZW5baW5kZXhdO1xuXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXJ0aWNsZVwiLCB7cmVmOiBcInRhYi1wYW5lbFwiLCBjbGFzc05hbWU6IFwidGFiLXBhbmVsXCJ9LCBcblx0ICAgICAgICAkcGFuZWxcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9XG5cdH0pO1xuXG5cdFRhYnMuUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdCAgZGlzcGxheU5hbWU6ICdQYW5lbCcsXG5cdCAgcHJvcFR5cGVzOiB7XG5cdCAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXHQgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5lbGVtZW50XG5cdCAgICBdKS5pc1JlcXVpcmVkXG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdCAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX187XG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiogQGpzeCBSZWFjdC5ET00gKi9mdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cdFx0dmFyIGFyZztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCdzdHJpbmcnID09PSB0eXBlb2YgYXJnIHx8ICdudW1iZXInID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmICghYXJnLmhhc093blByb3BlcnR5KGtleSkgfHwgIWFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0Ly8gc2FmZWx5IGV4cG9ydCBjbGFzc05hbWVzIGluIGNhc2UgdGhlIHNjcmlwdCBpcyBpbmNsdWRlZCBkaXJlY3RseSBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9XG5cblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEFsbGVsZUZpbHRlcnNWaWV3ID0gKHtzcGVjaWVzLCB2aXNpYmxlR2VuZXM9W10sIGRpc2FibGVkQWxsZWxlcz1bXSwgb25GaWx0ZXJDaGFuZ2V9KSA9PiB7XG4gIGxldCBnZW5lSW5wdXRzID0gW10sXG4gICAgICBhbGxWaXNpYmxlID0gdmlzaWJsZUdlbmVzLmxlbmd0aCA9PT0gMDtcblxuICBmb3IgKGNvbnN0IGdlbmUgaW4gc3BlY2llcy5nZW5lTGlzdCkge1xuICAgIGlmIChhbGxWaXNpYmxlIHx8IHZpc2libGVHZW5lcy5pbmRleE9mKGdlbmUpID4gLTEpIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMsXG4gICAgICAgICAgICBhbGxlbGVJdGVtcyA9IGFsbGVsZXMubWFwKGFsbGVsZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV0sXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAhKGRpc2FibGVkQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPj0gMCk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpbkxlZnRcIjogXCI4cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgZ2VuZUlucHV0cy5wdXNoKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmUtYWxsZWxlLWxpc3RcIiBrZXk9e2dlbmV9PnthbGxlbGVJdGVtc308L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgYWxsZWxlID0gZWx0ICYmIGVsdC52YWx1ZSxcbiAgICAgICAgICBpc0NoZWNrZWQgPSBlbHQgJiYgZWx0LmNoZWNrZWQ7XG4gICAgaWYgKG9uRmlsdGVyQ2hhbmdlICYmIGFsbGVsZSlcbiAgICAgIG9uRmlsdGVyQ2hhbmdlKGV2dCwgYWxsZWxlLCBpc0NoZWNrZWQpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlLWZpbHRlcnNcIlxuICAgICAgICAgIHN0eWxlPXt7IFwibWFyZ2luVG9wXCI6IFwiNXB4XCIsIFwibWFyZ2luQm90dG9tXCI6IFwiNXB4XCIgfX0+XG4gICAgICB7IGdlbmVJbnB1dHMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQWxsZWxlRmlsdGVyc1ZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHZpc2libGVHZW5lczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc2FibGVkQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIG9uRmlsdGVyQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVGaWx0ZXJzVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBBbGxlbGVWaWV3ID0gKHthbGxlbGUsIHdpZHRoPTIxLCB0YXJnZXQsIGNvbG9yLCBzaGFwZSwgaG92ZXJpbmd9KSA9PiB7XG4gIGxldCByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgc3Ryb2tlID0gdGFyZ2V0ID8gXCIjMDAwMDAwXCIgOiBcIm5vbmVcIixcbiAgICAgIGZpbGwgPSBhbGxlbGUgPyBjb2xvciA6IFwid2hpdGVcIixcbiAgICAgIHN0cm9rZVdpZHRoID0gaG92ZXJpbmcgPyAzIDogMSxcbiAgICAgIHN0cm9rZURhc2hhcnJheT0gYWxsZWxlID8gXCIwXCIgOiBcIjFcIixcbiAgICAgIHN2Z1NoYXBlID0gbnVsbDtcblxuICBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcbiAgICBzdmdTaGFwZSA9IDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzF9IGN4PXtyYWRpdXMrMX0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH0gZWxzZSB7XG4gICAgc3ZnU2hhcGUgPSA8cmVjdCB3aWR0aD17KHJhZGl1cyoyKX0gaGVpZ2h0PXsocmFkaXVzKjIpfSB4PVwiMVwiIHk9XCIxXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH1cblxuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17d2lkdGgrMn0gaGVpZ2h0PXt3aWR0aCsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgeyBzdmdTaGFwZSB9XG4gICAgICAgIDx0ZXh0IHg9e3JhZGl1cysxfSB5PXtyYWRpdXMrN30gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ3aGl0ZVwiPnthbGxlbGV9PC90ZXh0PlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuQWxsZWxlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGFsbGVsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRhcmdldDogUHJvcFR5cGVzLmJvb2wsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaGFwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaG92ZXJpbmc6IFByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01vdGlvbiwgc3ByaW5nfSBmcm9tICdyZWFjdC1tb3Rpb24nO1xuaW1wb3J0IEdhbWV0ZVZpZXcgZnJvbSAnLi9nYW1ldGUnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBhIEJpb2xvZ2ljYSBnYW1ldGUgdGhhdCBhbmltYXRlc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnYW1ldGUgLSBCaW9sb2dpY2EgZ2FtZXRlIChtYXAgb2YgY2hyb21vc29tZSBuYW1lcyB0byBjaHJvbW9zb21lcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1ldGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IHZpc2libGVHZW5lcyAtIGdlbmVzIHdoaWNoIHNob3VsZCBiZSB2aXNpYmxlXG4gKiBAcGFyYW0ge09iamVjdH0gW2luaXRpYWxEaXNwbGF5XSAtIGluaXRpYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueF0gLSBpbml0aWFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnldIC0gaW5pdGlhbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnNpemU9MzBdIC0gaW5pdGlhbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5yb3RhdGlvbj0wXSAtIGluaXRpYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5vcGFjaXR5PTFdIC0gaW5pdGlhbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZmluYWwgZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBmaW5hbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGZpbmFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIGZpbmFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSBmaW5hbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIGZpbmFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthbmltU3RpZmZuZXNzPTEwMF0gLSBzcHJpbmcgc3RpZmZuZXNzIHVzZWQgdG8gY29udHJvbCBhbmltYXRpb24gc3BlZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2VsZWN0ZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnc2VsZWN0ZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGlzYWJsZWQ9ZmFsc2VdIC0gd2hldGhlciB0aGUgZ2FtZXRlIHNob3VsZCBoYXZlIHRoZSAnZGlzYWJsZWQnIGNsYXNzIGFwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvbkNsaWNrKGV2dCwgaWQsIHJlY3QpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBnYW1ldGUgaXMgY2xpY2tlZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uUmVjdCgpXSAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgYXQgcmVzdFxuICpcbiAqIE5vdGU6IEFzIHRoaW5ncyBzdGFuZCBjdXJyZW50bHksIHRoZXJlIGlzIF9ub18gcGFydGljdWxhciByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGRlZmluZWRcbiAqIGJ5IHRoaXMgdmlldy4gVGhlIGNsaWVudCBjYW4gc3R5bGUgdGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgYnkgc3R5bGluZyB0aGVcbiAqICcuZ2VuaWJsb2Nrcy5nYW1ldGUnIGNsYXNzIGluIENTUywgZS5nLiBieSBhc3NpZ25pbmcgYSBiYWNrZ3JvdW5kLWltYWdlLlxuICovXG5jb25zdCBBbmltYXRlZEdhbWV0ZVZpZXcgPSAoe2lkLCBpbml0aWFsRGlzcGxheSwgZGlzcGxheSwgYW5pbVN0aWZmbmVzcz0xMDAsIG9uUmVzdCwgLi4ub3RoZXJzfSkgPT4ge1xuXG4gIGNvbnN0IGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgaW5pdGlhbCA9IGluaXRpYWxEaXNwbGF5IHx8IGRpc3BsYXksXG4gICAgICAgIGluaXRpYWxTaXplID0gaW5pdGlhbC5zaXplIHx8IDMwLFxuICAgICAgICBpbml0aWFsUm90YXRpb24gPSBpbml0aWFsLnJvdGF0aW9uICE9IG51bGwgPyBpbml0aWFsLnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgaW5pdGlhbE9wYWNpdHkgPSBpbml0aWFsLm9wYWNpdHkgIT0gbnVsbCA/IGluaXRpYWwub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgZmluYWxTaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICBmaW5hbFJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGZpbmFsT3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICBzcHJpbmdDb25maWcgPSB7IHN0aWZmbmVzczogYW5pbVN0aWZmbmVzcyB9O1xuICByZXR1cm4gKFxuICAgIDxNb3Rpb24gY2xhc3NOYW1lPSdnZW5pYmxvY2tzIGFuaW1hdGVkLWdhbWV0ZSdcbiAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tcbiAgICAgICAgICAgIHg6IGluaXRpYWwueCwgeTogaW5pdGlhbC55LCBzaXplOiBpbml0aWFsU2l6ZSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiBpbml0aWFsUm90YXRpb24sIG9wYWNpdHk6IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgeDogc3ByaW5nKGRpc3BsYXkueCwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHk6IHNwcmluZyhkaXNwbGF5LnksIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICBzaXplOiBzcHJpbmcoZmluYWxTaXplLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgcm90YXRpb246IHNwcmluZyhmaW5hbFJvdGF0aW9uLCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgb3BhY2l0eTogc3ByaW5nKGZpbmFsT3BhY2l0eSwgc3ByaW5nQ29uZmlnKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT5cbiAgICAgICAgICA8R2FtZXRlVmlldyBpZD17aWR9IGRpc3BsYXk9e2ludGVycG9sYXRlZFN0eWxlfSB7Li4ub3RoZXJzfSAvPlxuICAgICAgfVxuICAgIDwvTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRHYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHZpc2libGVHZW5lczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGluaXRpYWxEaXNwbGF5OiBQcm9wVHlwZXMuc2hhcGUoeyAvLyBpbml0aWFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLFxuICBkaXNwbGF5OiBQcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZmluYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgYW5pbVN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZEdhbWV0ZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG5jb25zdCBBbmltYXRlZE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgd2lkdGg9MjAwLCBzdHlsZT17fSwgaW5pdGlhbE9wYWNpdHk9MS4wLCBvcGFjaXR5PTEuMCwgc3RpZmZuZXNzPTYwLCBvblJlc3QsIG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBvcGFjaXR5U3RhcnQgPSBpbml0aWFsT3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICA6IChvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogMS4wKTtcbiAgbGV0ICAgb3BhY2l0eUVuZCA9IG9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG9wYWNpdHkgOiBvcGFjaXR5U3RhcnQ7XG5cbiAgaWYgKG9wYWNpdHlFbmQgIT09IG9wYWNpdHlTdGFydClcbiAgICBvcGFjaXR5RW5kID0gc3ByaW5nKG9wYWNpdHlFbmQsIHsgc3RpZmZuZXNzOiBzdGlmZm5lc3MgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1vcmdhbmlzbS12aWV3J1xuICAgICAgICAgICAgZGVmYXVsdFN0eWxlPXt7b3BhY2l0eTogb3BhY2l0eVN0YXJ0fX0gc3R5bGU9e3tvcGFjaXR5OiBvcGFjaXR5RW5kfX0gb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRTdHlsZSA9IHsgLi4uc3R5bGUsIC4uLmludGVycG9sYXRlZFN0eWxlIH07XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZH0gd2lkdGg9e3dpZHRofSBzdHlsZT17dFN0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfSAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L01vdGlvbj5cbiAgKTtcbn07XG5cbkFuaW1hdGVkT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGluaXRpYWxPcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEVnZ1ZpZXcsIHsgRUdHX0lNQUdFX1dJRFRIIH0gZnJvbSAnLi9lZ2cnO1xuXG5jb25zdCBFR0dfSU1BR0VfV0lEVEhfU01BTEwgPSBFR0dfSU1BR0VfV0lEVEggLyAzO1xuXG5jbGFzcyBCYXNrZXRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGJhc2tldDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgYWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgICBzZXg6IFByb3BUeXBlcy5udW1iZXJcbiAgICB9KSxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBlZ2dzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIGhhbmRsZUNsaWNrID0gKGV2dCkgPT4ge1xuICAgIGNvbnN0IHsgYmFza2V0LCBpbmRleCwgb25DbGljayB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAob25DbGljaylcbiAgICAgIG9uQ2xpY2soaW5kZXgsIGJhc2tldCk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgYmFza2V0LCBpZCwgZWdncywgaXNTZWxlY3RlZCB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBjbGFzc2VzID0gJ2Jhc2tldCcgKyAoaXNTZWxlY3RlZCA/ICcgc2VsZWN0ZWQnIDogJycpO1xuXG4gICAgZnVuY3Rpb24gZWdnc0RpdigpIHtcbiAgICAgIGlmICghZWdncyB8fCAhZWdncy5sZW5ndGgpIHJldHVybiBudWxsO1xuICAgICAgbGV0IGVnZ1ZpZXdzID0gZWdncy5tYXAoZnVuY3Rpb24oZWdnLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxFZ2dWaWV3IGVnZz17ZWdnfSBrZXk9e2BiYXNrZXQtZWdnLSR7aW5kZXh9YH0gaXNTZWxlY3RlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3R5bGU9e3tzaXplOiBFR0dfSU1BR0VfV0lEVEhfU01BTEx9fSAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWVnZ3MnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDMwLCB0b3A6IDEwLCB3aWR0aDogNzAgfX0+XG4gICAgICAgICAge2VnZ1ZpZXdzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSBpZD17aWR9IGtleT17aWR9IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH19IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWltYWdlJyByZWY9J2RvbU5vZGUnPjwvZGl2PlxuICAgICAgICB7ZWdnc0RpdigpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYmFza2V0LWxhYmVsIHVuc2VsZWN0YWJsZSc+e2Jhc2tldC5sYWJlbH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgQmFza2V0U2V0VmlldyA9ICh7YmFza2V0cywgaWRQcmVmaXg9J2Jhc2tldC0nLCBzZWxlY3RlZEluZGljZXM9W10sXG4gICAgICAgICAgICAgICAgICAgICAgICBlZ2dzLCBhbmltYXRpbmdFZ2dJbmRleCwgb25DbGlja30pID0+IHtcblxuICBsZXQgYmFza2V0Vmlld3MgPSBiYXNrZXRzLm1hcCgoYmFza2V0LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IGAke2lkUHJlZml4fSR7aW5kZXh9YCxcbiAgICAgICAgICAgICAgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kaWNlcy5pbmRleE9mKGluZGV4KSA+PSAwO1xuICAgICAgICBsZXQgZWdnSW5kaWNlcyA9IChiYXNrZXQgJiYgYmFza2V0LmVnZ3MpIHx8IFtdLFxuICAgICAgICAgICAgZGlzcGxheUVnZ3MgPSBbXTtcbiAgICAgICAgICAgIGVnZ0luZGljZXMuZm9yRWFjaCgoZWdnRHJha2VJbmRleCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBlZ2dJbmRleCA9IGVnZ0RyYWtlSW5kZXg7XG4gICAgICAgICAgICAgIGlmIChlZ2dEcmFrZUluZGV4ID09PSBhbmltYXRpbmdFZ2dJbmRleCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAoZWdncyAmJiBlZ2dzW2VnZ0luZGV4XSlcbiAgICAgICAgICAgICAgICBkaXNwbGF5RWdncy5wdXNoKGVnZ3NbZWdnSW5kZXhdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gPEJhc2tldFZpZXcgYmFza2V0PXtiYXNrZXR9IGlkPXtpZH0ga2V5PXtpZH0gaW5kZXg9e2luZGV4fSBlZ2dzPXtkaXNwbGF5RWdnc31cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2lzU2VsZWN0ZWR9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+O1xuICAgICAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYmFza2V0LXNldFwiPlxuICAgICAgeyBiYXNrZXRWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5CYXNrZXRTZXRWaWV3LnByb3BUeXBlcyA9IHtcbiAgYmFza2V0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgaWRQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNlbGVjdGVkSW5kaWNlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlciksXG4gIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICBhbmltYXRpbmdFZ2dJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2tldFNldFZpZXc7XG4iLCIvKlxuICogVGhpcyBjb21wb25lbnQgaXMgYSB2ZXJ5IHRoaW4gd3JhcHBlciBhcm91bmQgYSBzdGFuZGFyZCBidXR0b24gZGVzaWduZWQgdG8gcHJldmVudFxuICogZXh0cmFuZW91cyBmb2N1cyBoaWdobGlnaHRpbmcgYWRkZWQgYnkgYnJvd3NlcnMgd2hlbiBjbGlja2luZyBvbiBhIGJ1dHRvbiB3aGlsZVxuICogbWFpbnRhaW5pbmcga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eS4gU2VlXG4gKiBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gKiBmb3IgZGV0YWlscy4gVGhlIHVwc2hvdCBpcyB0aGF0IHdlIHVzZSBtb3VzZSBldmVudHMgb24gdGhlIGJ1dHRvbiB0byBkaXNhYmxlIHRoZVxuICogZm9jdXMgaGlnaGxpZ2h0IC0tIG1vdXNpbmcvY2xpY2tpbmcgb24gYSBwdXNoIGJ1dHRvbiBzaG91bGQgbm90IGJlIHVzZWQgYXMgYW5cbiAqIGluY2lkYXRvciB0aGF0IHRoZSB1c2VyIHdvdWxkIGxpa2UgdG8ga2V5Ym9hcmQtaW50ZXJhY3Qgd2l0aCB0aGF0IGJ1dHRvbiwgd2hpY2hcbiAqIGlzIHdoYXQgZm9jdXNpbmcgYSBjbGlja2VkIGJ1dHRvbiBpbXBsaWVzLlxuICogSU1QT1JUQU5UOiBUbyBtYWludGFpbiBhY2Nlc3NpYmlsaXR5LCB0aGVyZSBtdXN0IGJlIGNvZGUgc29tZXdoZXJlIHRvIHJlZW5hYmxlXG4gKiB0aGUgZm9jdXMgaGlnaGxpZ2h0IHdoZW4gYXBwcm9wcmlhdGUuIFRoaXMgY2FuIGJlIGRvbmUgZm9yICdrZXlkb3duJyBieSBjYWxsaW5nXG4gKiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHRPbktleURvd24oKSBkdXJpbmcgYXBwbGljYXRpb24vcGFnZSBpbml0aWFsaXphdGlvbixcbiAqIG9yIGJ5IGFkZGluZyB5b3VyIG93biBldmVudCBoYW5kbGVyIHRoYXQgY2FsbHMgQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0KCkuXG4gKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHQgZnJvbSAnLi4vdXRpbGl0aWVzL3RyYW5zbGF0ZSc7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pXG4gIH1cblxuICAvLyBJbnN0YWxscyBhIGtleWRvd24gaGFuZGxlciBvbiB0aGUgZG9jdW1lbnQgd2hpY2ggd2lsbCBlbmFibGUgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZy5cbiAgLy8gU2hvdWxkIGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBpbml0aWFsaXphdGlvbi5cbiAgc3RhdGljIGVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSk7XG4gIH1cblxuICAvLyBFbmFibGVzIGJ1dHRvbiBmb2N1cyBoaWdobGlnaHRpbmc7IGRlc2lnbmVkIHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBrZXlkb3duIGhhbmRsZXIgYWJvdmVcbiAgLy8gYnV0IGF2YWlsYWJsZSBzZXBhcmF0ZWx5IGZvciBpbXBsZW1lbnRhdGlvbnMgdGhhdCByZXF1aXJlIGl0LlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYi1idXR0b24nKSxcbiAgICAgICAgICBjb3VudCA9IGJ1dHRvbnMubGVuZ3RoO1xuICAgIC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZUxpc3QjRXhhbXBsZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGlmIChidXR0b24gJiYgYnV0dG9uLmNsYXNzTmFtZSkge1xuICAgICAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTU5NTEvY2hhbmdlLWFuLWVsZW1lbnRzLWNsYXNzLXdpdGgtamF2YXNjcmlwdFxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC8oPzpefFxccyluby1mb2N1cy1oaWdobGlnaHQoPyFcXFMpL2cgLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcHJldmVudCBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodCBvbiBjbGljayB3aGlsZSBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5XG4gIC8vIHNlZSBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gIHN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm9Gb2N1c0hpZ2hsaWdodCA9ICduby1mb2N1cy1oaWdobGlnaHQnLFxuICAgICAgICAgIGJ1dHRvbiA9IHRoaXMucmVmcy5idXR0b247XG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lLmluZGV4T2Yobm9Gb2N1c0hpZ2hsaWdodCkgPCAwKVxuICAgICAgYnV0dG9uLmNsYXNzTmFtZSArPSAnICcgKyBub0ZvY3VzSGlnaGxpZ2h0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBsYWJlbCwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAoY2xhc3NOYW1lID8gY2xhc3NOYW1lICsgJyAnIDogJycpICsgJ2diLWJ1dHRvbic7XG5cbiAgICBjb25zdCBoYW5kbGVNb3VzZUV2ZW50ID0gKCkgPT4gdGhpcy5zdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2NsYXNzZXN9IHJlZj0nYnV0dG9uJyB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2hhbmRsZU1vdXNlRXZlbnR9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVNb3VzZUV2ZW50fT5cbiAgICAgICAge3QobGFiZWwpfVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5cbmNsYXNzIENoYWxsZW5nZUF3YXJkVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBjb2luUGFydHM6IFByb3BUeXBlcy5udW1iZXJcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICBjaGFsbGVuZ2VBd2FyZHM6IHtyb3V0ZVNwZWM6IHtcImxldmVsXCI6IDAsIFwibWlzc2lvblwiOjAsIFwiY2hhbGxlbmdlXCI6MH0sIFwiY2hhbGxlbmdlQ291bnRcIjowLCBcInByb2dyZXNzXCI6W119LFxuICAgICBzaXplOiAyNTYsXG4gICAgIGNvaW5QYXJ0czogM1xuICB9O1xuXG4gIGFkZEF3YXJkSW1hZ2UgPSAocHJvZ3Jlc3NJbWFnZXMsIHBpZWNlcywgcGllY2VOdW0sIHNjb3JlLCBwaWVjZVN0eWxlKSA9PiB7XG4gICAgbGV0IGF3YXJkTGV2ZWwgPSB0aGlzLmdldEF3YXJkU3R5bGUoc2NvcmUpO1xuICAgIGlmIChzY29yZSA+IC0xKXtcbiAgICAgIGxldCBwaWVjZU5hbWUgPSBgY29pbiBwaWVjZSBwaWVjZXMke3BpZWNlc30gcGllY2Uke3BpZWNlTnVtfSAke3BpZWNlU3R5bGV9ICR7YXdhcmRMZXZlbH1gO1xuICAgICAgcHJvZ3Jlc3NJbWFnZXMucHVzaCg8ZGl2IGtleT17cGllY2VOdW19IGNsYXNzTmFtZT17cGllY2VOYW1lfSAvPik7XG4gICAgfVxuICAgIHJldHVybiBwcm9ncmVzc0ltYWdlcztcbiAgfTtcblxuICBnZXRBd2FyZFN0eWxlID0gKHNjb3JlKSA9PiB7XG4gICAgbGV0IGF3YXJkTGV2ZWwgPSBcImdvbGRcIjtcbiAgICBpZiAoc2NvcmUgPT09IDEpIGF3YXJkTGV2ZWwgPSBcInNpbHZlclwiO1xuICAgIGlmIChzY29yZSA+PSAyKSBhd2FyZExldmVsID0gXCJicm9uemVcIjtcbiAgICByZXR1cm4gYXdhcmRMZXZlbDtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGxldmVsID0gMCwgbWlzc2lvbiA9IDAsIGNoYWxsZW5nZSA9IDAsIGNoYWxsZW5nZUNvdW50ID0gMCwgcHJvZ3Jlc3MgPSBbXSwgY2hhbGxlbmdlQmFja2dyb3VuZEltYWdlLCBwcm9ncmVzc0ltYWdlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYyAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYy5sZXZlbCxcbiAgICAgIG1pc3Npb24gPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5yb3V0ZVNwZWMubWlzc2lvbixcbiAgICAgIGNoYWxsZW5nZSA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLnJvdXRlU3BlYy5jaGFsbGVuZ2UsXG4gICAgICBjaGFsbGVuZ2VDb3VudCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUNvdW50O1xuICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5wcm9ncmVzcztcbiAgICAgIGNoYWxsZW5nZUJhY2tncm91bmRJbWFnZSA9IDxkaXYgY2xhc3NOYW1lPVwiY29pbiBiYWNrZ3JvdW5kXCIgLz47XG4gICAgfSBlbHNlIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFwcm9ncmVzcyB8fCBwcm9ncmVzcyA9PT0gW10pXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGxldCBzaXplID0gdGhpcy5wcm9wcy5zaXplIHx8IDI1NjtcbiAgICBsZXQgc2l6ZVN0eWxlID0ge1xuICAgICAgd2lkdGg6IHNpemUgKyBcInB4XCIsXG4gICAgICBoZWlnaHQ6IHNpemUgKyBcInB4XCJcbiAgICB9O1xuXG4gICAgbGV0IHBpZWNlS2V5ID0gbGV2ZWwgKyBcIjpcIiArIG1pc3Npb24gKyBcIjpcIjtcbiAgICBsZXQgY2hhbGxlbmdlU2NvcmUgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbGxlbmdlQ291bnQ7IGkrKyl7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvZ3Jlc3Mpe1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgocGllY2VLZXkgKyBpKSl7XG4gICAgICAgICAgY29uc3Qgc2NvcmUgPSBwcm9ncmVzc1trZXldO1xuICAgICAgICAgIGlmIChjaGFsbGVuZ2VTY29yZVtpXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgY2hhbGxlbmdlU2NvcmVbaV0gPSBzY29yZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hhbGxlbmdlU2NvcmVbaV0gKz0gc2NvcmU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBwaWVjZU51bSA9IGNoYWxsZW5nZSArIDE7XG4gICAgbGV0IGN1cnJlbnRQaWVjZVN0eWxlID0gYGNvaW4gcGllY2UgcGllY2VzJHtjaGFsbGVuZ2VDb3VudH0gcGllY2Uke3BpZWNlTnVtfSBzaW5nbGUgJHt0aGlzLmdldEF3YXJkU3R5bGUoY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlXSl9YDtcblxuICAgIGZvciAodmFyIGNoYWxsZW5nZU51bSBpbiBjaGFsbGVuZ2VTY29yZSl7XG4gICAgICBwaWVjZU51bSA9IHBhcnNlSW50KGNoYWxsZW5nZU51bSkgKyAxO1xuICAgICAgcHJvZ3Jlc3NJbWFnZXMgPSB0aGlzLmFkZEF3YXJkSW1hZ2UocHJvZ3Jlc3NJbWFnZXMsIGNoYWxsZW5nZUNvdW50LCBwaWVjZU51bSwgY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlTnVtXSwgXCJ3aG9sZVwiKTtcbiAgICB9XG5cbiAgICBsZXQgc2luZ2xlUGllY2VPcGFjaXR5U3RhcnQgPSAxLCBzaW5nbGVQaWVjZU9wYWNpdHlFbmQgPSAwLCBzdHlsZSA9IHt9LCBvblJlc3Q7XG4gICAgc2luZ2xlUGllY2VPcGFjaXR5RW5kID0gc3ByaW5nKHNpbmdsZVBpZWNlT3BhY2l0eUVuZCwgeyBzdGlmZm5lc3M6IDMwLCBkYW1waW5nOjIwIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaGFsbGVuZ2UtYXdhcmRcIiBzdHlsZT17c2l6ZVN0eWxlfSA+XG4gICAgICAgIHtjaGFsbGVuZ2VCYWNrZ3JvdW5kSW1hZ2V9XG4gICAgICAgIHtwcm9ncmVzc0ltYWdlc31cbiAgICAgICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtY29pbi12aWV3J1xuICAgICAgICAgICAgZGVmYXVsdFN0eWxlPXt7b3BhY2l0eTogc2luZ2xlUGllY2VPcGFjaXR5U3RhcnR9fSBzdHlsZT17e29wYWNpdHk6IHNpbmdsZVBpZWNlT3BhY2l0eUVuZH19IG9uUmVzdD17b25SZXN0fSA+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0U3R5bGUgPSB7IC4uLnN0eWxlLCAuLi5pbnRlcnBvbGF0ZWRTdHlsZSB9O1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cGllY2VOdW19IHN0eWxlPXt0U3R5bGV9IGNsYXNzTmFtZT17Y3VycmVudFBpZWNlU3R5bGV9IC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICA8L01vdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhbGxlbmdlQXdhcmRWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIG1hbGUvZmVtYWxlIGNoYW5nZSBidXR0b25zXG4gKiBUaGUgYXBwZWFyYW5jZSBvZiB0aGUgYnV0dG9ucyBpcyBjdXJyZW50bHkgZW50aXJlbHkgY29udHJvbGxlZCB2aWEgZXh0ZXJuYWwgQ1NTLlxuICogQHBhcmFtIHtzdHJpbmd9IHNleCAtIFsnbWFsZScgfCAnZmVtYWxlJ10gY3VycmVudGx5IHNlbGVjdGVkIGJ1dHRvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gb25DaGFuZ2UoZXZ0LCBzZXgpIC0gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdXNlIGNsaWNrcyB0byBjaGFuZ2Ugc2V4XG4gKi9cbmNvbnN0IENoYW5nZVNleEJ1dHRvbnMgPSAoe2lkLCBzZXgsIHNwZWNpZXMsIHNob3dMYWJlbCwgc3R5bGU9e30sIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCBjYXBTZXggPSBzZXggPT09IEJpb0xvZ2ljYS5NQUxFID8gJ01hbGUnIDogJ0ZlbWFsZScsXG4gICAgICAgIHNlbGVjdGVkU2V4Q2xhc3MgPSBzZXggPT09IEJpb0xvZ2ljYS5NQUxFID8gJ21hbGUtc2VsZWN0ZWQnIDogJ2ZlbWFsZS1zZWxlY3RlZCcsXG4gICAgICAgIEJVVFRPTl9JTUFHRV9XSURUSCA9IDEwMCxcbiAgICAgICAgQlVUVE9OX0lNQUdFX01JRFBPSU5UX1ggPSBCVVRUT05fSU1BR0VfV0lEVEggLyAyLFxuICAgICAgICBpbWFnZVN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uc3R5bGUgfSxcbiAgICAgICAgbGFiZWwgPSBzaG93TGFiZWwgPyBgJHtjYXBTZXh9ICR7c3BlY2llc31gIDogJycsXG4gICAgICAgIGxhYmVsRWxlbWVudCA9IHNob3dMYWJlbCA/IDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IEJVVFRPTl9JTUFHRV9XSURUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTB9fT57bGFiZWx9PC9kaXY+IDogJyc7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0UmVjdCA9IGV2dC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgY2xpY2tYID0gZXZ0LmNsaWVudFggLSBlbHRSZWN0LmxlZnQ7XG5cbiAgICBpZiAoc2V4ID09PSBCaW9Mb2dpY2EuRkVNQUxFICYmIGNsaWNrWCA+IEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YKXsgLy8gdXNlciBjbGlja2VkIG9uIFJpZ2h0IChtYWxlKSBpY29uIHdoaWxlIGZlbWFsZSB3YXMgc2VsZWN0ZWRcbiAgICAgIG9uQ2hhbmdlKEJpb0xvZ2ljYS5NQUxFKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2V4ID09PSBCaW9Mb2dpY2EuTUFMRSAmJiBjbGlja1ggPCBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCl7IC8vIHVzZXIgY2xpY2tlZCBvbiBMZWZ0IChmZW1hbGUpIGljb24gd2hpbGUgbWFsZSB3YXMgc2VsZWN0ZWRcbiAgICAgIG9uQ2hhbmdlKEJpb0xvZ2ljYS5GRU1BTEUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxkaXYgIGNsYXNzTmFtZT17YGdlbmlibG9ja3MgY2hhbmdlLXNleC1idXR0b25zICR7c2VsZWN0ZWRTZXhDbGFzc31gfVxuICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSA+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtsYWJlbEVsZW1lbnR9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaGFuZ2VTZXhCdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNleDogUHJvcFR5cGVzLm9uZU9mKFtCaW9Mb2dpY2EuTUFMRSwgQmlvTG9naWNhLkZFTUFMRV0pLFxuICBzcGVjaWVzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaG93TGFiZWw6IFByb3BUeXBlcy5ib29sLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5nZVNleEJ1dHRvbnM7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIG5vcm1hbDoge1xuICAgIHdpZHRoOiAyMyxcbiAgICBoZWlnaHQ6IDEyMCxcbiAgICBzcGxpdDogNDVcbiAgfSxcbiAgc21hbGw6IHtcbiAgICB3aWR0aDogMTksXG4gICAgaGVpZ2h0OiA5MCxcbiAgICBzcGxpdDogMzRcbiAgfVxufTtcblxuY29uc3QgZGVmYXVsdHNZID0ge1xuICBub3JtYWw6IHtcbiAgICB3aWR0aDogMjMsXG4gICAgaGVpZ2h0OiA3NSxcbiAgICBzcGxpdDogMzhcbiAgfSxcbiAgc21hbGw6IHtcbiAgICB3aWR0aDogMTksXG4gICAgaGVpZ2h0OiA2MixcbiAgICBzcGxpdDogMzJcbiAgfVxufTtcblxuY29uc3QgQ2hyb21vc29tZUltYWdlVmlldyA9ICh7d2lkdGgsIGhlaWdodCwgc3BsaXQ9NDUsIGNvbG9yPScjRkY5OTk5Jywgc21hbGw9ZmFsc2UsIGJvbGQ9ZmFsc2UsIGVtcHR5PWZhbHNlLCB5Q2hyb21vc29tZT1mYWxzZSwgYW5pbWF0aW9uU3R5bGluZ30pID0+IHtcbiAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KSB7XG4gICAgbGV0IGRlZmF1bHREaW1zID0geUNocm9tb3NvbWUgPyBkZWZhdWx0c1kgOiBkZWZhdWx0cztcbiAgICAoe3dpZHRoLCBoZWlnaHQsIHNwbGl0fSA9IHNtYWxsID8gZGVmYXVsdERpbXMuc21hbGwgOiBkZWZhdWx0RGltcy5ub3JtYWwpO1xuICB9XG5cbiAgY29uc3QgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgICAgaW1hZ2VXaWR0aCA9IHdpZHRoKzQsXG4gICAgICAgIGhhbGZJbWFnZVdpZHRoID0gaW1hZ2VXaWR0aC8yLFxuICAgICAgICBpbWFnZUhlaWdodCA9IGhlaWdodCs0O1xuXG4gIGxldCBzdHJva2VXaWR0aCA9IHdpZHRoIDwgMTAgPyAxIDogMjtcblxuICBpZiAoYm9sZCkge1xuICAgIGNvbG9yID0gJyNGRjY2NjYnO1xuICAgIHN0cm9rZVdpZHRoID0gMztcbiAgfVxuICBpZiAoZW1wdHkpIHtcbiAgICBjb2xvciA9ICcjRkZGJztcbiAgICBzdHJva2VXaWR0aCA9IDE7XG4gIH1cbiAgbGV0IHBvc2l0aW9uU3R5bGluZyA9IHt9O1xuICBpZiAoYW5pbWF0aW9uU3R5bGluZyl7XG4gICAgcG9zaXRpb25TdHlsaW5nID0ge1xuICAgICAgcG9zaXRpb246ICdmaXhlZCcsIGxlZnQ6IGFuaW1hdGlvblN0eWxpbmcueCwgdG9wOiBhbmltYXRpb25TdHlsaW5nLnksIG9wYWNpdHk6IGFuaW1hdGlvblN0eWxpbmcub3BhY2l0eVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNocm9tb3NvbWUtaW1hZ2VcIiBzdHlsZT17cG9zaXRpb25TdHlsaW5nfT5cbiAgICAgIDxzdmcgd2lkdGg9e2ltYWdlV2lkdGh9IGhlaWdodD17aW1hZ2VIZWlnaHR9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGc+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtyYWRpdXMrMn0gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17c3BsaXQtcmFkaXVzfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdCtyYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e2hlaWdodC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8cmVjdCBoZWlnaHQ9e01hdGgubWF4KDAsIChzcGxpdC1yYWRpdXMpLShyYWRpdXMrMikpfSB3aWR0aD17d2lkdGh9IHk9e3JhZGl1cysyfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD17TWF0aC5tYXgoMCwgKGhlaWdodC1yYWRpdXMpLShzcGxpdCtyYWRpdXMpKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZUltYWdlVmlldy5wcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNwbGl0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc21hbGw6IFByb3BUeXBlcy5ib29sLFxuICBib2xkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZW1wdHk6IFByb3BUeXBlcy5ib29sLFxuICB5Q2hyb21vc29tZTogUHJvcFR5cGVzLmJvb2wsXG4gIGFuaW1hdGlvblN0eWxpbmc6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgICAgICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgICAgICAgICAgICAgfSlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuaW1wb3J0IEFsbGVsZVZpZXcgZnJvbSAnLi9hbGxlbGUnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcbi8qKlxuICogVmlldyBvZiBhIHNpbmdsZSBjaHJvbW9zb21lLCB3aXRoIG9wdGlvbmFsIGxhYmVscywgcHVsbGRvd25zLCBhbmQgZW1iZWRkZWQgYWxsZWxlcy5cbiAqXG4gKiBEZWZpbmVkIEVJVEhFUiB1c2luZyBhIEJpb2xvZ2ljYSBDaHJvbW9zb21lIG9iamVjdCwgT1Igd2l0aCBhIEJpb2xvZ2ljYSBvcmdhbmlzbSxcbiAqIGNocm9tb3NvbWUgbmFtZSBhbmQgc2lkZS5cbiAqL1xuXG5jb25zdCBDaHJvbW9zb21lVmlldyA9ICh7Y2hyb21vc29tZSwgb3JnLCBDaHJvbW9zb21lSW1hZ2VDbGFzcz1DaHJvbW9zb21lSW1hZ2VWaWV3LCBjaHJvbW9zb21lTmFtZSwgc2lkZSwgdXNlckNoYW5nZWFibGVHZW5lcyA9IFtdLCB2aXNpYmxlR2VuZXMgPSBbXSwgaGlkZGVuQWxsZWxlcyA9IFtdLCBzbWFsbCA9IGZhbHNlLCBlZGl0YWJsZSA9IHRydWUsIHNlbGVjdGVkID0gZmFsc2UsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZCwgc2hvd0xhYmVscyA9IHRydWUsIHNob3dBbGxlbGVzID0gZmFsc2UsIGxhYmVsc09uUmlnaHQgPSB0cnVlLCBvcmdOYW1lLCBkaXNwbGF5U3R5bGUgPSB7fX0pID0+IHtcblxuICB2YXIgY29udGFpbmVyQ2xhc3MgPSBcIml0ZW1zXCIsXG4gICAgICBlbXB0eSA9IGZhbHNlLFxuICAgICAgeUNocm9tb3NvbWUgPSBmYWxzZSxcbiAgICAgIHhDaHJvbW9zb21lID0gZmFsc2UsXG4gICAgICBsYWJlbHNDb250YWluZXIsIGFsbGVsZXNDb250YWluZXIsIGNocm9tSWQ7XG5cbiAgaWYgKG9yZyAmJiBjaHJvbW9zb21lTmFtZSAmJiBzaWRlKSB7XG4gICAgY2hyb21vc29tZSA9IG9yZy5nZXRHZW5vdHlwZSgpLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXVtzaWRlXTtcbiAgfVxuXG4gIGlmIChjaHJvbW9zb21lKSB7XG4gICAgbGV0IGFsbGVsZXMgPSBjaHJvbW9zb21lLmFsbGVsZXMsXG4gICAgICAgIHZpc2libGVBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5maWx0ZXJWaXNpYmxlQWxsZWxlcyhhbGxlbGVzLCB1c2VyQ2hhbmdlYWJsZUdlbmVzLCB2aXNpYmxlR2VuZXMsIGNocm9tb3NvbWUuc3BlY2llcyk7XG5cbiAgICBpZiAoc2hvd0xhYmVscykge1xuICAgICAgbGV0IGxhYmVscyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgaWYgKENocm9tb3NvbWVJbWFnZUNsYXNzID09PSBDaHJvbW9zb21lSW1hZ2VWaWV3KSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2EuYWxsZWxlfSBzcGVjaWVzPXtjaHJvbW9zb21lLnNwZWNpZXN9IGFsbGVsZT17YS5hbGxlbGV9IGVkaXRhYmxlPXtlZGl0YWJsZSAmJiBhLmVkaXRhYmxlfVxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM9eyBoaWRkZW5BbGxlbGVzIH1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlKGEuYWxsZWxlLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIH19Lz4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZnYtZ2VuZS1sYWJlbCBhbGxlbGUgbm9uZWRpdGFibGVcIiBrZXk9e2EuYWxsZWxlfT5cbiAgICAgICAgICAgICAge2Nocm9tb3NvbWUuc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthLmFsbGVsZV19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbGFiZWxzQ29udGFpbmVyID0gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsc1wiPlxuICAgICAgICAgIHsgbGFiZWxzIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuXG4gICAgICBpZiAoIWxhYmVsc09uUmlnaHQpIHtcbiAgICAgICAgY29udGFpbmVyQ2xhc3MgKz0gXCIgcnRsXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNob3dBbGxlbGVzKSB7XG4gICAgICBsZXQgYWxsZWxlU3ltYm9scyA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8QWxsZWxlVmlldyBrZXk9e2EuYWxsZWxlfSBhbGxlbGU9e2EuYWxsZWxlfSAvPlxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGFsbGVsZXNDb250YWluZXIgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxsZWxlc1wiPlxuICAgICAgICAgIHsgYWxsZWxlU3ltYm9scyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoY2hyb21vc29tZS5zaWRlID09PSBcInlcIikge1xuICAgICAgeUNocm9tb3NvbWUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoY2hyb21vc29tZS5zaWRlLmluZGV4T2YoXCJ4XCIpID4gLTEpIHtcbiAgICAgIHhDaHJvbW9zb21lID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjaHJvbUlkID0gb3JnTmFtZSArIGNocm9tb3NvbWUuY2hyb21vc29tZSArIGNocm9tb3NvbWUuc2lkZTtcbiAgfSBlbHNlIHtcbiAgICBjaHJvbUlkID0gb3JnTmFtZTtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH1cbiAgY29uc3QgaGFuZGxlU2VsZWN0ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKG9uQ2hyb21vc29tZVNlbGVjdGVkKSB7XG4gICAgICBvbkNocm9tb3NvbWVTZWxlY3RlZChldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtY29udGFpbmVyXCIgb25DbGljaz17IGhhbmRsZVNlbGVjdCB9ID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29udGFpbmVyQ2xhc3MgfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaHJvbW9zb21lLWFsbGVsZS1jb250YWluZXJcIiBpZD17Y2hyb21JZH0gc3R5bGU9e2Rpc3BsYXlTdHlsZX0+XG4gICAgICAgICAgPENocm9tb3NvbWVJbWFnZUNsYXNzIHNtYWxsPXtzbWFsbH0gZW1wdHk9e2VtcHR5fSBib2xkPXtzZWxlY3RlZH0geUNocm9tb3NvbWU9e3lDaHJvbW9zb21lfSB4Q2hyb21vc29tZT17eENocm9tb3NvbWV9Lz5cbiAgICAgICAgICB7IGFsbGVsZXNDb250YWluZXIgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyBsYWJlbHNDb250YWluZXIgfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaHJvbW9zb21lVmlldy5wcm9wVHlwZXMgPSB7XG4gIENocm9tb3NvbWVJbWFnZUNsYXNzOiBQcm9wVHlwZXMuZnVuYyxcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBjaHJvbW9zb21lTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2lkZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2hyb21vc29tZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgdXNlckNoYW5nZWFibGVHZW5lczogUHJvcFR5cGVzLmFycmF5LFxuICB2aXNpYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBzbWFsbDogUHJvcFR5cGVzLmJvb2wsXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBzaG93TGFiZWxzOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0FsbGVsZXM6IFByb3BUeXBlcy5ib29sLFxuICBsYWJlbHNPblJpZ2h0OiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2hyb21vc29tZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb3JnTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBVc2VzIGFuIFNWRyBjaXJjdWxhciBncmFkaWVudCB0byBpbXBsZW1lbnQgYSBmYWRpbmcgZ2xvdyBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIlxuICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSB0aGUgZGlhbWV0ZXIgb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50XG4gKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBzdHlsZXMgYXBwbGllZCB0byB0aGUgb3V0ZXIgZGl2XG4gKi9cbmNvbnN0IENpcmN1bGFyR2xvd1ZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgc3R5bGV9KSA9PiB7XG4gIGxldCByYWRpdXMgPSBzaXplLzIsXG4gICAgICBjb2xvck5vSGFzaCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyksXG4gICAgICBncmFkaWVudElEID0gYENpcmN1bGFyR2xvd1ZpZXdfJHtpZCB8fCBjb2xvck5vSGFzaH1gLFxuICAgICAgZ3JhZGllbnRJRFVybCA9IGB1cmwoIyR7Z3JhZGllbnRJRH0pYDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaXJjdWxhci1nbG93XCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPXtncmFkaWVudElEfT5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIxLjBcIi8+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcENvbG9yPXtjb2xvcn0gc3RvcE9wYWNpdHk9XCIwLjBcIi8+XG4gICAgICAgICAgPC9yYWRpYWxHcmFkaWVudD5cbiAgICAgICAgPC9kZWZzPlxuICAgICAgICA8Y2lyY2xlIGZpbGw9e2dyYWRpZW50SURVcmx9IGN4PXtyYWRpdXN9IGN5PXtyYWRpdXN9IHI9e3JhZGl1c30gLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2lyY3VsYXJHbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaXJjdWxhckdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRWdnVmlldyBmcm9tICcuL2VnZy5qcyc7XG5cbmNvbnN0IEVnZ0NsdXRjaFZpZXcgPSAoe2VnZ3MsIGlkUHJlZml4PSdlZ2ctJywgc2VsZWN0ZWRJbmRleCwgb25DbGlja30pID0+IHtcblxuICBjb25zdCBPRERfRUdHX01BUkdJTiA9IDgsXG4gICAgICAgIEVWRU5fRUdHX01BUkdJTiA9IDA7XG4gIGxldCBvcmdWaWV3cztcblxuICBmdW5jdGlvbiBlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgbWFyZ2luKSB7XG4gICAgY29uc3QgaWQgPSBgJHtpZFByZWZpeH0ke2luZGV4fWAsXG4gICAgICAgICAgdmlzaWJpbGl0eVN0eWxlID0gZWdnICYmIChlZ2cuYmFza2V0ID09IG51bGwpID8ge30gOiB7IHZpc2liaWxpdHk6ICdoaWRkZW4nIH0sXG4gICAgICAgICAgZWdnU3R5bGUgPSBPYmplY3QuYXNzaWduKHsgbWFyZ2luTGVmdDogbWFyZ2luLCBtYXJnaW5SaWdodDogbWFyZ2luIH0sIHZpc2liaWxpdHlTdHlsZSk7XG4gICAgcmV0dXJuIDxFZ2dWaWV3IGVnZz17ZWdnfSBpZD17aWR9IGtleT17aWR9IGluZGV4PXtpbmRleH0gZGlzcGxheVN0eWxlPXtlZ2dTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17aW5kZXggPT09IHNlbGVjdGVkSW5kZXh9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+O1xuICB9XG5cbiAgLy8gZXZlbiBudW1iZXIgb2YgZWdnc1xuICBpZiAoZWdncy5sZW5ndGggJSAyID09PSAwKSB7XG4gICAgb3JnVmlld3MgPSBlZ2dzLnJlZHVjZSgocHJldiwgZWdnLCBpbmRleCkgPT4ge1xuICAgICAgLy8gZm9yIGZsZXggbGF5b3V0IHB1cnBvc2VzLCB3aXRoIG9kZCBudW1iZXJzIG9mIGl0ZW1zXG4gICAgICAvLyB3ZSBhZGQgc3BhY2VyIGl0ZW1zIGJldHdlZW4gdGhlIGVnZ3NcbiAgICAgIGNvbnN0IHNwYWNlcklEID0gYCR7aWRQcmVmaXh9JHtpbmRleH0tc3BhY2VyYCxcbiAgICAgICAgICAgIHNwYWNlclN0eWxlID0geyBtYXJnaW5MZWZ0OiBFVkVOX0VHR19NQVJHSU4sIG1hcmdpblJpZ2h0OiBFVkVOX0VHR19NQVJHSU4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicgfSxcbiAgICAgICAgICAgIHNwYWNlciA9IDxFZ2dWaWV3IGVnZz17bnVsbH0ga2V5PXtzcGFjZXJJRH0gZGlzcGxheVN0eWxlPXtzcGFjZXJTdHlsZX0gLz47XG4gICAgICBpZiAoaW5kZXggPCBlZ2dzLmxlbmd0aC8yKVxuICAgICAgICBwcmV2LnB1c2goc3BhY2VyKTtcbiAgICAgIHByZXYucHVzaChlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgRVZFTl9FR0dfTUFSR0lOKSk7XG4gICAgICBpZiAoaW5kZXggPj0gZWdncy5sZW5ndGgvMilcbiAgICAgICAgcHJldi5wdXNoKHNwYWNlcik7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9LCBbXSk7XG4gICAgLy9vcmdWaWV3cyA9IGVnZ3MubWFwKChlZ2csIGluZGV4KSA9PiBlZ2dWaWV3Rm9ySW5kZXgoZWdnLCBpbmRleCwgRVZFTl9FR0dfTUFSR0lOKSk7XG4gIH1cblxuICBlbHNlIHtcbiAgICBvcmdWaWV3cyA9IGVnZ3MucmVkdWNlKChwcmV2LCBlZ2csIGluZGV4KSA9PiB7XG4gICAgICBwcmV2LnB1c2goZWdnVmlld0ZvckluZGV4KGVnZywgaW5kZXgsIE9ERF9FR0dfTUFSR0lOKSk7XG4gICAgICAvLyBmb3IgZmxleCBsYXlvdXQgcHVycG9zZXMsIHdpdGggb2RkIG51bWJlcnMgb2YgaXRlbXNcbiAgICAgIC8vIHdlIGFkZCBzcGFjZXIgaXRlbXMgYmV0d2VlbiB0aGUgZWdnc1xuICAgICAgY29uc3Qgc3BhY2VySUQgPSBgJHtpZFByZWZpeH0ke2luZGV4fS1zcGFjZXJgLFxuICAgICAgICAgICAgc3BhY2VyU3R5bGUgPSB7IG1hcmdpbkxlZnQ6IE9ERF9FR0dfTUFSR0lOLCBtYXJnaW5SaWdodDogT0REX0VHR19NQVJHSU4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicgfTtcbiAgICAgIHByZXYucHVzaCg8RWdnVmlldyBlZ2c9e251bGx9IGtleT17c3BhY2VySUR9IGRpc3BsYXlTdHlsZT17c3BhY2VyU3R5bGV9IC8+KTtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGVnZy1jbHV0Y2hcIj5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuRWdnQ2x1dGNoVmlldy5wcm9wVHlwZXMgPSB7XG4gIGVnZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRWdnQ2x1dGNoVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vLyBpbWFnZSBzcGVjaWZpZWQgYXMgQ1NTIGJhY2tncm91bmQtaW1hZ2UsIGJ1dCBzaXplIGNvbnN0YW50cyByZXF1aXJlZCBpbiBKYXZhU2NyaXB0XG5leHBvcnQgY29uc3QgIEVHR19JTUFHRV9XSURUSCA9IDc1LFxuICAgICAgICAgICAgICBFR0dfSU1BR0VfSEVJR0hUID0gMTA5O1xuXG5jbGFzcyBFZ2dWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVnZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNwbGF5U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBoYW5kbGVDbGljayA9IChldnQpID0+IHtcbiAgICBjb25zdCB7IGVnZywgaWQsIGluZGV4LCBvbkNsaWNrIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChvbkNsaWNrKVxuICAgICAgb25DbGljayhpZCwgaW5kZXgsIGVnZyk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZWdnLCBpZCwgZGlzcGxheVN0eWxlLCBpc1NlbGVjdGVkIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGVnZ1N0eWxlID0gT2JqZWN0LmFzc2lnbih7IGZsZXhTaHJpbms6IDAgfSwgZGlzcGxheVN0eWxlKSxcbiAgICAgICAgICBpc0hpZGRlbiA9IChlZ2cgPT0gbnVsbCksXG4gICAgICAgICAgY2xhc3NlcyA9ICdjbHV0Y2gtZWdnJyArIChpc1NlbGVjdGVkID8gJyBzZWxlY3RlZCcgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKGlzSGlkZGVuID8gJyBoaWRkZW4nIDogJycpO1xuICAgIGlmIChkaXNwbGF5U3R5bGUgJiYgKGRpc3BsYXlTdHlsZS5zaXplICE9IG51bGwpKSB7XG4gICAgICBlZ2dTdHlsZS53aWR0aCA9IGRpc3BsYXlTdHlsZS5zaXplO1xuICAgICAgZWdnU3R5bGUuaGVpZ2h0ID0gZWdnU3R5bGUud2lkdGggKiAoRUdHX0lNQUdFX0hFSUdIVCAvIEVHR19JTUFHRV9XSURUSCk7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtjbGFzc2VzfSBrZXk9e2lkfSByZWY9J2RvbU5vZGUnIHN0eWxlPXtlZ2dTdHlsZX0gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30gLz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVnZ1ZpZXc7IiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogSW1wbGVtZW50cyBhIHJlY3Rhbmd1bGFyIHRleHQgYXJlYSBmb3IgcHJvdmlkaW5nIGZlZWRiYWNrIHRvIHVzZXJzLCBzdWNoIGFzXG4gKiB0aGF0IHVzZWQgaW4gR2VuaXZlcnNlJ3MgY2hhbGxlbmdlcyBmb3IgcHJvdmlkaW5nIHRyaWFsIGFuZCBnb2FsIGZlZWRiYWNrLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHRleHQgLSBhIHNpbmdsZSBvciBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIGlubGluZSBzdHlsZXMgYXBwbGllZCB0byB0aGUgPGRpdj4gY29udGFpbmluZyBlYWNoIGxpbmUgb2YgdGV4dFxuICovXG5jb25zdCBGZWVkYmFja1ZpZXcgPSAoe3RleHQsIHN0eWxlPXt9fSkgPT4ge1xuICBjb25zdCB0VGV4dCA9IEFycmF5LmlzQXJyYXkodGV4dCkgPyB0ZXh0IDogW3RleHRdLFxuICAgICAgICBsaW5lQ291bnQgPSB0VGV4dC5sZW5ndGgsXG4gICAgICAgIGhlaWdodCA9IDIwICogbGluZUNvdW50ICsgMixcbiAgICAgICAgZGVmYXVsdFN0eWxlID0geyBoZWlnaHQ6IGhlaWdodCwgLi4uc3R5bGUgfSxcbiAgICAgICAgdGV4dExpbmVzID0gdFRleHQubWFwKChpVGV4dCwgaW5kZXgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZlZWRiYWNrIHRleHQtbGluZVwiIGtleT17aW5kZXh9PntpVGV4dH08L2Rpdj4pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGZlZWRiYWNrLXZpZXdcIiBzdHlsZT17ZGVmYXVsdFN0eWxlfT5cbiAgICAgIHt0ZXh0TGluZXN9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5GZWVkYmFja1ZpZXcucHJvcFR5cGVzID0ge1xuICB0ZXh0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpXG4gICAgICAgIF0pLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBGZWVkYmFja1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBJTklUSUFMX0dBTUVURV9TSVpFID0gMzAsXG4gICAgICBGSU5BTF9HQU1FVEVfU0laRSA9IDE0MCxcbiAgICAgIFJFU1RJTkdfTU9USEVSX0dBTUVURV9YID0gMCxcbiAgICAgIFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YID0gMTUwLFxuICAgICAgRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YID0gNzAsXG4gICAgICBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1ggPSA4MCxcbiAgICAgIEZJTkFMX1pZR09URV9ZID0gLTE1MDtcblxuZXhwb3J0IGNvbnN0IEdBTUVURV9UWVBFID0geyBNT1RIRVI6ICdtb3RoZXInLCBGQVRIRVI6ICdmYXRoZXInIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWyBHQU1FVEVfVFlQRS5NT1RIRVIsIEdBTUVURV9UWVBFLkZBVEhFUiBdKS5pc1JlcXVpcmVkLFxuICAgIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZmVydGlsaXphdGlvblN0YXRlOiBQcm9wVHlwZXMub25lT2YoWydub25lJywgJ2ZlcnRpbGl6aW5nJywgJ2ZlcnRpbGl6ZWQnLCAnY29tcGxldGUnXSkuaXNSZXF1aXJlZCxcbiAgICB2aXNpYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHNyY1JlY3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGRzdFJlY3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHZpc2libGVHZW5lczogW10sXG4gICAgYW5pbVN0aWZmbmVzczogMTAwXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlciA9ICgpID0+IHtcbiAgICBsZXQge2dhbWV0ZSwgaWQsIHZpc2libGVHZW5lcywgYW5pbVN0aWZmbmVzcywgb25SZXN0fSA9IHRoaXMucHJvcHMsXG4gICAgICAgIHhPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QubGVmdCAtIHRoaXMucHJvcHMuZHN0UmVjdC5sZWZ0IDogMCxcbiAgICAgICAgeU9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC50b3AgLSB0aGlzLnByb3BzLmRzdFJlY3QudG9wIDogMCxcbiAgICAgICAgeFJlc3RpbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgeEZlcnRpbGl6aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIGluaXRpYWwsIHRGaW5hbDtcblxuICAgIGlmICghZ2FtZXRlIHx8IChpZCA9PSBudWxsKSkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnbm9uZScpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUilcbiAgICAgICAgeE9mZnNldCArPSBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWDtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhPZmZzZXQsIHk6IHlPZmZzZXQsIHNpemU6IElOSVRJQUxfR0FNRVRFX1NJWkUgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnZmVydGlsaXppbmcnKSB7XG4gICAgICBpbml0aWFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IEZJTkFMX1pZR09URV9ZLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDAuMCB9O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IHZpc2libGVHZW5lcz17dmlzaWJsZUdlbmVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsRGlzcGxheT17aW5pdGlhbH0gZGlzcGxheT17dEZpbmFsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfSBvblJlc3Q9e29uUmVzdH0gLz5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBHYW1ldGVQb29sVmlldyA9ICh7Z2FtZXRlcywgdmlzaWJsZUdlbmVzPVtdLCB3aWR0aD0zMDAsIGhlaWdodD0yMDAsIGFuaW1TdGlmZm5lc3M9NjAsIHNlbGVjdGVkSWQsIGlzR2FtZXRlRGlzYWJsZWQsIG9uR2FtZXRlU2VsZWN0ZWR9KSA9PiB7XG4gIGxldCBnYW1ldGVDb3VudCA9IGdhbWV0ZXMubGVuZ3RoLFxuICAgICAgZ2FtZXRlU2l6ZSA9IDMwLFxuICAgICAgbWFyZ2luID0gNSxcbiAgICAgIHNwYWNpbmdEZWZhdWx0ID0gZ2FtZXRlU2l6ZSArIDIgKiBtYXJnaW4sXG4gICAgICB4U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgeVNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIGNvbERlZmF1bHQgPSBNYXRoLmZsb29yKHdpZHRoIC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgcm93RGVmYXVsdCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gc3BhY2luZ0RlZmF1bHQpLFxuICAgICAgZW5hYmxlZENvdW50ID0gMCxcbiAgICAgIGRpc2FibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRGbGFncyA9IGlzR2FtZXRlRGlzYWJsZWQgPyBnYW1ldGVzLm1hcChnID0+IGlzR2FtZXRlRGlzYWJsZWQoZykpIDogW10sXG4gICAgICB0b3RhbERpc2FibGVkQ291bnQgPSBkaXNhYmxlZEZsYWdzLnJlZHVjZSgodG90YWwsZmxhZykgPT4gdG90YWwgKyBmbGFnLCAwKSxcbiAgICAgIC8vIGxlYXZlIHJvb20gZm9yIHRoZSBkaXNhYmxlZCBnYW1ldGUgcm93IGlmIHRoZXJlIGFyZSBkaXNhYmxlZCBnYW1ldGVzXG4gICAgICBhdmFpbGFibGVIZWlnaHQgPSBoZWlnaHQgLSAodG90YWxEaXNhYmxlZENvdW50ID8gc3BhY2luZ0RlZmF1bHQgOiAwKSAtIDQgKiBtYXJnaW4sXG4gICAgICAvLyBwYWNrIHRoZSBkaXNhYmxlZCBnYW1ldGVzIGludG8gdGhlIGRpc2FibGVkIHJvd1xuICAgICAgeERpc2FibGVkU3BhY2luZyA9IE1hdGgubWluKHhTcGFjaW5nIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod2lkdGggLSA3ICogbWFyZ2luKSAvIHRvdGFsRGlzYWJsZWRDb3VudCksXG4gICAgICB5RGlzYWJsZWRTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB0b3RhbEVuYWJsZWRDb3VudCA9IGdhbWV0ZUNvdW50IC0gdG90YWxEaXNhYmxlZENvdW50LFxuICAgICAgZ2FtZXRlVmlld3M7XG5cbiAgLy8gc3F1ZWV6ZSBpbiB0byBtYWtlIHJvb20gZm9yIGFkZGl0aW9uYWwgZ2FtZXRlcyBpZiBuZWNlc3NhcnlcbiAgdmFyIGNvbENvdW50ID0gY29sRGVmYXVsdCxcbiAgICAgIHJvd0NvdW50ID0gcm93RGVmYXVsdCAtICh0b3RhbERpc2FibGVkQ291bnQgPiAwKTtcbiAgd2hpbGUgKGNvbENvdW50ICogcm93Q291bnQgPCB0b3RhbEVuYWJsZWRDb3VudCkge1xuICAgIGlmICh5U3BhY2luZyA+IHhTcGFjaW5nKSB7XG4gICAgICB5U3BhY2luZyA9IGF2YWlsYWJsZUhlaWdodCAvICsrcm93Q291bnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeFNwYWNpbmcgPSAod2lkdGggLSA0ICogbWFyZ2luKSAvICsrY29sQ291bnQ7XG4gICAgfVxuICB9XG5cbiAgZ2FtZXRlVmlld3MgPSBnYW1ldGVzLm1hcCgoZ2FtZXRlLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBkaXNhYmxlZEZsYWdzW2luZGV4XSxcbiAgICAgICAgICBsYXlvdXRJbmRleCA9IGlzRGlzYWJsZWQgPyBkaXNhYmxlZENvdW50KysgOiBlbmFibGVkQ291bnQrKyxcbiAgICAgICAgICByb3cgPSBpc0Rpc2FibGVkID8gcm93RGVmYXVsdCAtIDEgOiBNYXRoLmZsb29yKGxheW91dEluZGV4IC8gY29sQ291bnQpLFxuICAgICAgICAgIGNvbCA9IGlzRGlzYWJsZWQgPyBsYXlvdXRJbmRleCA6IGxheW91dEluZGV4ICUgY29sQ291bnQsXG4gICAgICAgICAgeSA9IGlzRGlzYWJsZWQgPyByb3cgKiB5RGlzYWJsZWRTcGFjaW5nIDogcm93ICogeVNwYWNpbmcsXG4gICAgICAgICAgeCA9IGlzRGlzYWJsZWQgPyBjb2wgKiB4RGlzYWJsZWRTcGFjaW5nIDogY29sICogeFNwYWNpbmc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpbmRleCArIDF9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGVHZW5lcz17dmlzaWJsZUdlbmVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsRGlzcGxheT17eyB4OiBNYXRoLnJvdW5kKHdpZHRoLzIpLCB5OiAtTWF0aC5yb3VuZCh5U3BhY2luZykgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT17eyB4OiBNYXRoLnJvdW5kKHgpLCB5OiBNYXRoLnJvdW5kKHkpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1TdGlmZm5lc3M9e2FuaW1TdGlmZm5lc3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2luZGV4ICsgMSA9PT0gc2VsZWN0ZWRJZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25HYW1ldGVTZWxlY3RlZH0gLz5cbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnYW1ldGUtcG9vbFwiIHN0eWxlPXt7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfX0+XG4gICAgICB7IGdhbWV0ZVZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVBvb2xWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgdmlzaWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgYW5pbVN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlcixcbiAgc2VsZWN0ZWRJZDogUHJvcFR5cGVzLm51bWJlcixcbiAgaXNHYW1ldGVEaXNhYmxlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uR2FtZXRlU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVQb29sVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gdmlzaWJsZUdlbmVzIC0gZ2VuZXMgd2hpY2ggc2hvdWxkIGJlIHZpc2libGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtib29sZWFufSBbaXNTZWxlY3RlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdzZWxlY3RlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNEaXNhYmxlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdkaXNhYmxlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uQ2xpY2soZXZ0LCBpZCwgcmVjdCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGdhbWV0ZSBpcyBjbGlja2VkXG4gKlxuICogTm90ZTogQXMgdGhpbmdzIHN0YW5kIGN1cnJlbnRseSwgdGhlcmUgaXMgX25vXyBwYXJ0aWN1bGFyIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgZGVmaW5lZFxuICogYnkgdGhpcyB2aWV3LiBUaGUgY2xpZW50IGNhbiBzdHlsZSB0aGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBieSBzdHlsaW5nIHRoZVxuICogJy5nZW5pYmxvY2tzLmdhbWV0ZScgY2xhc3MgaW4gQ1NTLCBlLmcuIGJ5IGFzc2lnbmluZyBhIGJhY2tncm91bmQtaW1hZ2UuXG4gKi9cbmNvbnN0IEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIHZpc2libGVHZW5lcz1bXSwgZGlzcGxheSwgaXNTZWxlY3RlZD1mYWxzZSwgaXNEaXNhYmxlZD1mYWxzZSwgb25DbGlja30pID0+IHtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIHJlY3QgPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKCFpc0Rpc2FibGVkICYmIG9uQ2xpY2spIHtcbiAgICAgIG9uQ2xpY2soZXZ0LCBpZCwgcmVjdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSkge1xuICAgIGxldCB0b29sdGlwID0gXCJcIjtcblxuICAgIGZvciAoY29uc3QgY2ggaW4gZ2FtZXRlKSB7XG4gICAgICB2YXIgY2hyb21vc29tZSA9IGdhbWV0ZVtjaF0sXG4gICAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmZpbHRlclZpc2libGVBbGxlbGVzKGNocm9tb3NvbWUuYWxsZWxlcywgW10sIHZpc2libGVHZW5lcywgY2hyb21vc29tZS5zcGVjaWVzKTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIHZpc2libGVBbGxlbGVzKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gY2hyb21vc29tZS5zcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZS5hbGxlbGVdO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyBsYWJlbDtcbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PT0gJ1hZJykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGNocm9tb3NvbWUuc2lkZSA9PT0gJ3knID8gJ3knIDogJ3gnO1xuICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBjb25zdCBzZWxlY3RlZENsYXNzID0gaXNTZWxlY3RlZCAmJiAhaXNEaXNhYmxlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkQ2xhc3MgPSBpc0Rpc2FibGVkID8gXCJkaXNhYmxlZFwiIDogXCJcIixcbiAgICAgICAgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBjbGFzc2VzID0gYGdlbmlibG9ja3MgZ2FtZXRlICR7c2VsZWN0ZWRDbGFzc30gJHtkaXNhYmxlZENsYXNzfSBncm91cCR7Z3JvdXB9YCxcbiAgICAgICAgc2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgcm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgdHJhbnNmb3JtID0gcm90YXRpb24gPyBgcm90YXRlKCR7cm90YXRpb259ZGVnKWAgOiAnJyxcbiAgICAgICAgb3BhY2l0eSA9IGRpc3BsYXkub3BhY2l0eSAhPSBudWxsID8gZGlzcGxheS5vcGFjaXR5IDogMS4wLFxuICAgICAgICB0b29sdGlwID0gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHRpdGxlPXt0b29sdGlwfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LngsIHRvcDogZGlzcGxheS55LFxuICAgICAgICAgICAgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybSwgb3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB2aXNpYmxlR2VuZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNwbGF5OiBQcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlPWZhbHNlLCBoaWRkZW5BbGxlbGVzPVtdLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGNvbnN0IGFsbGVsZU5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5lLWxhYmVsIGFsbGVsZSBub25lZGl0YWJsZVwiPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7IGFsbGVsZU5hbWUgfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IGFsbGVsZXMuZmlsdGVyKGEgPT4gaGlkZGVuQWxsZWxlcy5pbmRleE9mKGEpID09PSAtMSksXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgICBhbGxlbGVPcHRpb25zID0gYWxsZWxlTmFtZXMubWFwKChuYW1lLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e25hbWV9IHZhbHVlPXt2aXNpYmxlQWxsZWxlc1tpXX0+e25hbWV9PC9vcHRpb24+KVxuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2VuZS1sYWJlbCBhbGxlbGUgZWRpdGFibGVcIj5cbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGFsbGVsZSB9IG9uQ2hhbmdlPXsgb25BbGxlbGVDaGFuZ2UgfT5cbiAgICAgICAgICB7IGFsbGVsZU9wdGlvbnMgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbkdlbmVMYWJlbFZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGFsbGVsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5lTGFiZWxWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZUltYWdlVmlldyBmcm9tICcuL2Nocm9tb3NvbWUtaW1hZ2UnO1xuXG5sZXQgVGVzdFB1bGxkb3duVmlldyA9ICh7c3BlY2llcywgZ2VuZSwgc2VsZWN0aW9uLCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgICAgIGxldCBhbGxlbGVzID0gZ2VuZS5hbGxlbGVzLFxuICAgICAgICAgIGFsbGVsZU5hbWVzID0gYWxsZWxlcy5tYXAoYSA9PiBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FdKSxcbiAgICAgICAgICBudW1BbGxlbGVzID0gYWxsZWxlTmFtZXMubGVuZ3RoLFxuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zID0gW10sXG4gICAgICAgICAgY3VycmVudFNlbGVjdGlvbiA9IHNlbGVjdGlvbiB8fCBcInBsYWNlaG9sZGVyXCIsXG4gICAgICAgICAgaSwgajtcblxuICAgICAgcG9zc2libGVDb21ib3MucHVzaCg8b3B0aW9uIGtleT1cInBsYWNlaG9sZGVyXCIgdmFsdWU9XCJwbGFjZWhvbGRlclwiIGRpc2FibGVkPVwiZGlzYWJsZWRcIj5TZWxlY3QgYSBHZW5vdHlwZTwvb3B0aW9uPik7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBudW1BbGxlbGVzOyBpKyspIHtcbiAgICAgICAgZm9yIChqID0gaTsgaiA8IG51bUFsbGVsZXM7IGorKykge1xuICAgICAgICAgIGxldCBrZXkgPSBpICsgXCIgXCIgKyBqLFxuICAgICAgICAgICAgICBzdHJpbmcgPSBhbGxlbGVOYW1lc1tpXSArIFwiIC8gXCIgKyBhbGxlbGVOYW1lc1tqXTtcbiAgICAgICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtrZXl9PntzdHJpbmd9PC9vcHRpb24+KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdC13cmFwcGVyXCI+XG4gICAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGN1cnJlbnRTZWxlY3Rpb24gfSBvbkNoYW5nZT17IG9uU2VsZWN0aW9uQ2hhbmdlIH0+XG4gICAgICAgICAgICB7IHBvc3NpYmxlQ29tYm9zIH1cbiAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH07XG5cbmNvbnN0IEdlbm9tZVRlc3RWaWV3ID0gKHtvcmcsIHVzZXJDaGFuZ2VhYmxlR2VuZXM9W10sIHNlbGVjdGlvbj17fSwgb25TZWxlY3Rpb25DaGFuZ2V9KSA9PiB7XG4gIGxldCBwYWlyV3JhcHBlcnMgPSBbXSxcbiAgICAgIGFsbFZpc2libGUgPSB1c2VyQ2hhbmdlYWJsZUdlbmVzLmxlbmd0aCA9PT0gMDtcbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygb3JnLnNwZWNpZXMuY2hyb21vc29tZU5hbWVzKSB7XG4gICAgbGV0IGNocm9tID0gb3JnLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXSxcbiAgICAgICAgYWxsZWxlcyA9IGNocm9tW09iamVjdC5rZXlzKGNocm9tKVswXV0uYWxsZWxlcyxcbiAgICAgICAgZ2VuZXMgPSBhbGxlbGVzLm1hcChhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUob3JnLnNwZWNpZXMsIGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihnID0+IGFsbFZpc2libGUgfHwgdXNlckNoYW5nZWFibGVHZW5lcy5pbmRleE9mKGcubmFtZSkgPiAtMSksXG4gICAgICAgIHB1bGxkb3ducyA9IGdlbmVzLm1hcChnID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRlc3RQdWxsZG93blZpZXdcbiAgICAgICAgICAgICAga2V5ICAgICAgID0geyBnLm5hbWUgfVxuICAgICAgICAgICAgICBzcGVjaWVzICAgPSB7IG9yZy5zcGVjaWVzIH1cbiAgICAgICAgICAgICAgZ2VuZSAgICAgID0geyBnIH1cbiAgICAgICAgICAgICAgc2VsZWN0aW9uID0geyBzZWxlY3Rpb25bZy5uYW1lXSB9XG4gICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlID0geyBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIG9uU2VsZWN0aW9uQ2hhbmdlKGcsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGVtc1wiIGtleT17Y2hyb21vc29tZU5hbWV9PlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbm9tZS10ZXN0LW9wdGlvbnNcIj5cbiAgICAgICAgICB7IHB1bGxkb3ducyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWUtdGVzdFwiPlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuVGVzdFB1bGxkb3duVmlldy5wcm9wVHlwZXMgPSB7XG4gIHNwZWNpZXM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZ2VuZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZWxlY3Rpb246IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5HZW5vbWVUZXN0Vmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB1c2VyQ2hhbmdlYWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIHNlbGVjdGlvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25TZWxlY3Rpb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVRlc3RWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lJztcblxuLyoqXG4gKiBWaWV3IG9mIHRoZSBzZXQgb2YgY2hyb21vc29tZXMgb2YgYW4gb3JnYW5pc20sIG9yZGVyZWQgYXMgbWF0Y2hlZCBwYWlycy5cbiAqXG4gKiBVc3VhbGx5IGRlZmluZWQgYnkgcGFzc2luZyBpbiBhIEJpb2xvZ2ljYSBPcmdhbmlzbSwgYnV0IG1heSBhbHNvIGJlIGRlZmluZWQgYnlcbiAqIHBhc3NpbmcgaW4gYSBtYXAgb2YgQmlvbG9naWNhIENocm9tb3NvbWVzIGFuZCBhIEJpb2xvZ2ljYSBTcGVjaWVzLlxuICovXG5jb25zdCBHZW5vbWVWaWV3ID0gKHtvcmcsIGNsYXNzTmFtZT1cIlwiLCBDaHJvbW9zb21lSW1hZ2VDbGFzcywgY2hyb21vc29tZXMsIHNwZWNpZXMsIHVzZXJDaGFuZ2VhYmxlR2VuZXM9W10sIHZpc2libGVHZW5lcz1bXSwgaGlkZGVuQWxsZWxlcz1bXSwgZWRpdGFibGU9dHJ1ZSwgc2hvd0xhYmVscz10cnVlLCBzaG93QWxsZWxlcz1mYWxzZSwgc2VsZWN0ZWRDaHJvbW9zb21lcz17fSwgc21hbGw9ZmFsc2UsIG9yZ05hbWUsIGRpc3BsYXlTdHlsZSwgb25BbGxlbGVDaGFuZ2UsIG9uQ2hyb21vc29tZVNlbGVjdGVkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGlmIChvcmcpIHtcbiAgICBjaHJvbW9zb21lcyA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lcztcbiAgICBzcGVjaWVzID0gb3JnLnNwZWNpZXM7XG4gIH1cbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBjaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgbGV0IGNocm9tb3NvbWUgPSBjaHJvbVtzaWRlXTtcbiAgICAgIHBhaXJzLnB1c2goXG4gICAgICAgIDxDaHJvbW9zb21lVmlld1xuICAgICAgICAgIENocm9tb3NvbWVJbWFnZUNsYXNzPXtDaHJvbW9zb21lSW1hZ2VDbGFzc31cbiAgICAgICAgICBjaHJvbW9zb21lPXtjaHJvbW9zb21lfVxuICAgICAgICAgIGtleT17cGFpcnMubGVuZ3RoICsgMX1cbiAgICAgICAgICB1c2VyQ2hhbmdlYWJsZUdlbmVzPXt1c2VyQ2hhbmdlYWJsZUdlbmVzfVxuICAgICAgICAgIHZpc2libGVHZW5lcz17dmlzaWJsZUdlbmVzfVxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgbGFiZWxzT25SaWdodD17cGFpcnMubGVuZ3RoPjAgfHwgc2lkZT09PVwiYlwifVxuICAgICAgICAgIGVkaXRhYmxlPXtlZGl0YWJsZX1cbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRDaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0gPT09IHNpZGV9XG4gICAgICAgICAgc2hvd0xhYmVscz17c2hvd0xhYmVsc31cbiAgICAgICAgICBzaG93QWxsZWxlcz17c2hvd0FsbGVsZXN9XG4gICAgICAgICAgc21hbGw9e3NtYWxsfVxuICAgICAgICAgIG9yZ05hbWU9e29yZ05hbWV9XG4gICAgICAgICAgZGlzcGxheVN0eWxlPXtkaXNwbGF5U3R5bGV9XG4gICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2UoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNocm9tb3NvbWVTZWxlY3RlZD17ZnVuY3Rpb24oZWwpe1xuICAgICAgICAgICAgaWYgKG9uQ2hyb21vc29tZVNlbGVjdGVkKVxuICAgICAgICAgICAgICBvbkNocm9tb3NvbWVTZWxlY3RlZChvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBlbCk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1wYWlyXCIga2V5PXtwYWlyV3JhcHBlcnMubGVuZ3RoICsgMX0+XG4gICAgICAgIHsgcGFpcnMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICBjb25zdCBjbGFzc2VzID0gXCJnZW5pYmxvY2tzIGdlbm9tZVwiICsgKGNsYXNzTmFtZSA/IFwiIFwiICsgY2xhc3NOYW1lIDogXCJcIik7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9PlxuICAgICAgeyBwYWlyV3JhcHBlcnMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2Vub21lVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBDaHJvbW9zb21lSW1hZ2VDbGFzczogUHJvcFR5cGVzLmZ1bmMsXG4gIGNocm9tb3NvbWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICB1c2VyQ2hhbmdlYWJsZUdlbmVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIHZpc2libGVHZW5lczogUHJvcFR5cGVzLmFycmF5LFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgZWRpdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBzaG93TGFiZWxzOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0FsbGVsZXM6IFByb3BUeXBlcy5ib29sLFxuICBzZWxlY3RlZENocm9tb3NvbWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzbWFsbDogUHJvcFR5cGVzLmJvb2wsXG4gIGRpc3BsYXlTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgb25DaHJvbW9zb21lU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBvcmdOYW1lOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBHbG93QmFja2dyb3VuZFZpZXcgPSAoe2lkLCBjb2xvciwgc2l6ZSwgY29udGFpbmVyU3R5bGU9e30sIGdsb3dTdHlsZT17fSwgQ2hpbGRDb21wb25lbnQsIGNoaWxkU3R5bGU9e30sIC4uLm90aGVyc30pID0+IHtcbiAgY29uc3QgdENvbnRhaW5lclN0eWxlID0geyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSwgLi4uY29udGFpbmVyU3R5bGUgfSxcbiAgICAgICAgdEdsb3dTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmdsb3dTdHlsZSB9LFxuICAgICAgICB0Q2hpbGRTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLmNoaWxkU3R5bGUgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnbG93LWJhY2tncm91bmRcIiBzdHlsZT17dENvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGlkPXsnZ2xvdy0nK2lkfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXt0R2xvd1N0eWxlfS8+XG4gICAgICA8Q2hpbGRDb21wb25lbnQgaWQ9eydjaGlsZC0nK2lkfSBzdHlsZT17dENoaWxkU3R5bGV9IHdpZHRoPXtzaXplfSB7Li4ub3RoZXJzfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuR2xvd0JhY2tncm91bmRWaWV3LnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBjb250YWluZXJTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2xvd1N0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBDaGlsZENvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgY2hpbGRTdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR2xvd0JhY2tncm91bmRWaWV3O1xuIiwiLypcbiAqIEJhc2VkIG9uIFJlYWN0T3ZlcmxheXMgZGVtbyBhdCBodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9yZWFjdC1vdmVybGF5cy9leGFtcGxlcy8jbW9kYWxzXG4gKi9cbmltcG9ydCBNb2RhbCBmcm9tICdyZWFjdC1vdmVybGF5cy9saWIvTW9kYWwnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQgQ2hhbGxlbmdlQXdhcmRWaWV3IGZyb20gJy4vY2hhbGxlbmdlLWF3YXJkJztcbmltcG9ydCBSZWFjdCwgeyBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdCBmcm9tICcuLi91dGlsaXRpZXMvdHJhbnNsYXRlJztcblxuY29uc3QgbW9kYWxTdHlsZSA9IHtcbiAgcG9zaXRpb246ICdmaXhlZCcsXG4gIHpJbmRleDogMTA0MCxcbiAgdG9wOiAwLCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwXG59O1xuXG5jb25zdCBiYWNrZHJvcFN0eWxlID0ge1xuICAuLi5tb2RhbFN0eWxlLFxuICB6SW5kZXg6ICdhdXRvJyxcbiAgYmFja2dyb3VuZENvbG9yOiAnIzAwMCcsXG4gIG9wYWNpdHk6IDAuMVxufTtcblxuY29uc3QgZGlhbG9nU3R5bGUgPSBmdW5jdGlvbih0b3A9XCI1MCVcIikge1xuICAvLyB3ZSB1c2Ugc29tZSBwc2V1ZG8gcmFuZG9tIGNvb3JkcyBzbyBuZXN0ZWQgbW9kYWxzXG4gIC8vIGRvbid0IHNpdCByaWdodCBvbiB0b3Agb2YgZWFjaCBvdGhlci5cbiAgbGV0IGxlZnQgPSA1MDtcbiAgcmV0dXJuIHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogMzg1LFxuICAgIHRvcDogdG9wLCBsZWZ0OiBsZWZ0ICsgJyUnLFxuICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAtJHtsZWZ0fSUpYCxcbiAgICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwocmVzb3VyY2VzL2ltYWdlcy9wYXJjaG1lbnQuanBnKScsXG4gICAgYmFja2dyb3VuZFJlcGVhdDogJ25vLXJlcGVhdCcsXG4gICAgYmFja2dyb3VuZE9yaWdpbjogJ2JvcmRlci1ib3gnLFxuICAgIGJveFNoYWRvdzogJzAgMTBweCA1cHggcmdiYSgwLDAsMCwuNSknLFxuICAgIHBhZGRpbmdCb3R0b206ICcxNXB4JyxcbiAgICBwYWRkaW5nTGVmdDogJzE1cHgnLFxuICAgIG91dGxpbmU6ICdub25lJ1xuICB9O1xufTtcblxuXG5jbGFzcyBNb2RhbEFsZXJ0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHNob3c6IFByb3BUeXBlcy5ib29sLFxuICAgIG1lc3NhZ2U6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgIGV4cGxhbmF0aW9uOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuYXJyYXldKSxcbiAgICBsZWZ0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5hcnJheV0pLFxuICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbiAgICB9KSxcbiAgICByaWdodEJ1dHRvbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuYXJyYXldKSxcbiAgICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG4gICAgfSksXG4gICAgb25IaWRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkxlZnRCdXR0b25DbGljazogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyBvcHRpb25hbCBjbGljayBoYW5kbGVycyBpZiBub3QgZGVmaW5lZFxuICAgIG9uUmlnaHRCdXR0b25DbGljazogUHJvcFR5cGVzLmZ1bmMsICAgICAgIC8vIGluIGJ1dHRvbiBwcm9wcy4gKEJldHRlciBmb3IgYG1hcERpc3BhdGNoVG9Qcm9wc2ApXG4gICAgY2hhbGxlbmdlQXdhcmRzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHRvcDogUHJvcFR5cGVzLnN0cmluZ1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzaG93OiBmYWxzZSxcbiAgICBjaGFsbGVuZ2VBd2FyZHM6IHsgaWQ6MCwgcHJvZ3Jlc3M6IFtdIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvKiBlc2xpbnQgcmVhY3QvanN4LWhhbmRsZXItbmFtZXM6IDAgKi9cbiAgICBjb25zdCBsZWZ0UHJvcHMgPSB0aGlzLnByb3BzLmxlZnRCdXR0b24gfHwge30sXG4gICAgICAgICAgbGVmdEJ1dHRvbiA9IGxlZnRQcm9wcy5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgPyA8QnV0dG9uIGxhYmVsPXtsZWZ0UHJvcHMubGFiZWwgfHwgXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhbGVydC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2xlZnRQcm9wcy5vbkNsaWNrIHx8IHRoaXMucHJvcHMub25MZWZ0QnV0dG9uQ2xpY2t9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICByaWdodFByb3BzID0gdGhpcy5wcm9wcy5yaWdodEJ1dHRvbiB8fCB7fSxcbiAgICAgICAgICByaWdodEJ1dHRvbiA9IDxCdXR0b24gbGFiZWw9e3JpZ2h0UHJvcHMubGFiZWwgfHwgXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWxlcnQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17cmlnaHRQcm9wcy5vbkNsaWNrIHx8IHRoaXMucHJvcHMub25SaWdodEJ1dHRvbkNsaWNrfS8+O1xuICAgIHZhciBhd2FyZFZpZXcsIGV4cGxhbmF0aW9uVmlldztcblxuICAgIGlmICh0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcyl7XG4gICAgICBhd2FyZFZpZXcgPSA8Q2hhbGxlbmdlQXdhcmRWaWV3IGNoYWxsZW5nZUF3YXJkcz17dGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHN9IC8+O1xuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5leHBsYW5hdGlvbikge1xuICAgICAgZXhwbGFuYXRpb25WaWV3ID0gPHA+e3QodGhpcy5wcm9wcy5leHBsYW5hdGlvbil9PC9wPjtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxNb2RhbCAgYXJpYS1sYWJlbGxlZGJ5PSdtb2RhbC1sYWJlbCdcbiAgICAgICAgICAgICAgc3R5bGU9e21vZGFsU3R5bGV9XG4gICAgICAgICAgICAgIGJhY2tkcm9wU3R5bGU9e2JhY2tkcm9wU3R5bGV9XG4gICAgICAgICAgICAgIHNob3c9e3RoaXMucHJvcHMuc2hvd31cbiAgICAgICAgICAgICAgb25IaWRlPXt0aGlzLnByb3BzLm9uSGlkZX0gPlxuICAgICAgICA8ZGl2IHN0eWxlPXtkaWFsb2dTdHlsZSh0aGlzLnByb3BzLnRvcCl9ID5cbiAgICAgICAgICA8aDQgaWQ9J21vZGFsLWxhYmVsJz57dCh0aGlzLnByb3BzLm1lc3NhZ2UpfTwvaDQ+XG4gICAgICAgICAge2F3YXJkVmlld31cbiAgICAgICAgICB7ZXhwbGFuYXRpb25WaWV3fVxuICAgICAgICAgIHtsZWZ0QnV0dG9ufSB7cmlnaHRCdXR0b259XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Nb2RhbD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsQWxlcnQ7XG5cbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBQcmVzZW50cyBlaXRoZXIgYSBCaW9Mb2dpY2Egb3JnYW5pc20gb3IgYSBzaW1wbGUgbnVtYmVyIHdpdGhpbiBhIHNxdWFyZSBib3JkZXIuXG4gKiBEZXNpZ25lZCB0byBiZSB1c2VkIGFzIHRyaWFsIGZlZWRiYWNrIGluZGljYXRpbmcgdGhlIG51bWJlciBvZiB0cmlhbHMgc3VjY2Vzc2Z1bGx5XG4gKiBjb21wbGV0ZWQsIGZvciBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBhIHVuaXF1ZSBpZCBmb3IgQ1NTIHB1cnBvc2VzXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIC0gQ1NTIGNsYXNzIHRvIGJlIGFwcGxpZWRcbiAqIEBwYXJhbSB7bnVtYmVyfSBvcmRpbmFsIC0gdGhlIG51bWVyaWMgdmFsdWUgdG8gYmUgcmVwcmVzZW50ZWQgaWYgbm8gb3JnYW5pc20gc3BlY2lmaWVkXG4gKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gb3JnYW5pc20gLSB0aGUgb3JnYW5pc20gdG8gYmUgcmVwcmVzZW50ZWRcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHZpZXdcbiAqL1xuY29uc3QgT3JkaW5hbE9yZ2FuaXNtVmlldyA9ICh7aWQsIGNsYXNzTmFtZSwgb3JkaW5hbCwgb3JnYW5pc20sIHNpemU9MzIsIC4uLm90aGVyfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHsgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSB9LFxuICAgICAgICBvcmdWaWV3ID0gb3JnYW5pc20gIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICA/IDxPcmdhbmlzbVZpZXcgaWQ9e2Ake2lkfS1vcmdhbmlzbWB9IG9yZz17b3JnYW5pc219IHdpZHRoPXtzaXplfSB7Li4ub3RoZXJ9IC8+XG4gICAgICAgICAgICAgICAgICAgIDogPGRpdiBjbGFzc05hbWU9J29yZGluYWwnPlxuICAgICAgICAgICAgICAgICAgICAgICAge29yZGluYWx9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT17YGdlbmlibG9ja3Mgb3JkaW5hbC1vcmdhbmlzbSAke2NsYXNzTmFtZX1gfSBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgeyBvcmdWaWV3IH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZGluYWxPcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvcmRpbmFsOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvcmdhbmlzbTogUHJvcFR5cGVzLm9iamVjdCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JkaW5hbE9yZ2FuaXNtVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBhcyBhbiBpbWFnZSBvbiB0b3Agb2YgYSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IG9yZyAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kIHZpZXcuXG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICovXG5jb25zdCBPcmdhbmlzbUdsb3dWaWV3ID0gKHtpZD0nb3JnLWdsb3cnLCBjbGFzc05hbWU9JycsIGNvbG9yPVwiI0ZGRkZBQVwiLCBzaXplPTIwMCwgc3R5bGU9e30sIGdsb3dTdHlsZT17fSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgbG9jYWxHbG93U3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5nbG93U3R5bGUgfSxcbiAgICAgICAgb3JnU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5zdHlsZSB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IGNsYXNzTmFtZT17YGdlbmlibG9ja3Mgb3JnYW5pc20tZ2xvdyAke2NsYXNzTmFtZX1gfSBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgaWQ9e2Ake2lkfS1nbG93YH0gY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17bG9jYWxHbG93U3R5bGV9Lz5cbiAgICAgIDxPcmdhbmlzbVZpZXcgaWQ9e2Ake2lkfS1vcmdhbmlzbWB9IHdpZHRoPXtzaXplfSBzdHlsZT17b3JnU3R5bGV9IHsuLi5vdGhlcn0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGdsb3dTdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHJha2VJbWFnZVVybChvcmcpIHtcbiAgY29uc3QgYmFzZVVybCA9IFwiaHR0cHM6Ly9nZW5pdmVyc2UtcmVzb3VyY2VzLmNvbmNvcmQub3JnL3Jlc291cmNlcy9kcmFrZXMvaW1hZ2VzL1wiO1xuICByZXR1cm4gb3JnID8gYmFzZVVybCArIG9yZy5nZXRJbWFnZU5hbWUoKSA6IG51bGw7XG59XG5cbmNvbnN0IE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgY2xhc3NOYW1lPVwiXCIsIHdpZHRoPTIwMCwgZmxpcHBlZD1mYWxzZSwgc3R5bGU9e30sIG9uQ2xpY2ssIHdyYXBwZXIgfSkgPT4ge1xuICBjb25zdCB1cmwgPSBnZXREcmFrZUltYWdlVXJsKG9yZyksXG4gICAgICAgIC8vIFRoZSBnb2FsIGhlcmUgd2FzIHRvIGhhdmUgdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgc2VsZWN0IHRoZSBvcmdhbmlzbSxcbiAgICAgICAgLy8gc28gdGhhdCBtb3VzZWRvd24tZHJhZyB3aWxsIGJvdGggc2VsZWN0IHRoZSBvcmdhbmlzbSBhbmQgYmVnaW4gdGhlXG4gICAgICAgIC8vIGRyYWcuIFRoaXMgd29ya3Mgb24gQ2hyb21lIGFuZCBTYWZhcmksIGJ1dCBvbiBGaXJlZm94IGl0IGRpc2FibGVzXG4gICAgICAgIC8vIGRyYWdnaW5nLiBEaXNhYmxpbmcgdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgbWVhbnMgdGhhdCBGaXJlZm94IHVzZXJzXG4gICAgICAgIC8vIG11c3QgY2xpY2sgdG8gc2VsZWN0IGFuZCB0aGVuIGNsaWNrIHRvIGRyYWcsIGJ1dCBhdCBsZWFzdCB0aGV5IGNhblxuICAgICAgICAvLyBkcmFnLiBUaGUgcmlnaHQgc29sdXRpb24gaXMgcHJvYmFibHkgdG8gYWxsb3cgb3JnYW5pc21zIHRvIGJlIGRyYWdnZWRcbiAgICAgICAgLy8gd2hldGhlciBvciBub3QgdGhleSdyZSBzZWxlY3RlZCBhbmQgdGhlbiBob3BlZnVsbHkgdGhlIG9uTW91c2VEb3duXG4gICAgICAgIC8vIGhhbmRsZXIgd2lsbCB3b3JrIGFzIGV4cGVjdGVkLiBPdGhlcndpc2UsIGl0IG1heSBiZSBuZWNlc3NhcnkgdG9cbiAgICAgICAgLy8gc2VsZWN0IHRoZSBvcmdhbmlzbSAoaWYgaXQgaXNuJ3QgYWxyZWFkeSBzZWxlY3RlZCkgaW4gYmVnaW5EcmFnLlxuICAgICAgICBpc0ZpcmVmb3ggPSAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+PSAwKSxcbiAgICAgICAgaGFuZGxlTW91c2VEb3duID0gaXNGaXJlZm94ID8gdW5kZWZpbmVkIDogaGFuZGxlQ2xpY2ssXG4gICAgICAgIGRpdldyYXBwZXIgPSB3cmFwcGVyIHx8IGZ1bmN0aW9uKGVsdCkgeyByZXR1cm4gZWx0OyB9O1xuXG4gIGxldCBjbGFzc2VzID0gXCJnZW5pYmxvY2tzIG9yZ2FuaXNtXCIgKyAoY2xhc3NOYW1lID8gXCIgXCIgKyBjbGFzc05hbWUgOiBcIlwiKTtcbiAgaWYgKGZsaXBwZWQpIHtcbiAgICBjbGFzc2VzICs9IFwiIGZsaXBwZWRcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGlkLCBvcmcpO1xuICB9XG5cbiAgcmV0dXJuIGRpdldyYXBwZXIoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IGlkPXtpZH0gc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIG9uTW91c2VEb3duPXtvbkNsaWNrID8gaGFuZGxlTW91c2VEb3duIDogbnVsbH1cbiAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrID8gaGFuZGxlQ2xpY2sgOiBudWxsfT5cbiAgICAgIHt1cmwgPyA8aW1nIHNyYz17dXJsfSB3aWR0aD17d2lkdGh9IC8+IDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICB3cmFwcGVyOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUGVuVmlldyBmcm9tICcuL3Blbic7XG5pbXBvcnQgU3RhdHNWaWV3IGZyb20gJy4vc3RhdHMnO1xuaW1wb3J0IFRhYnMgZnJvbSAncmVhY3Qtc2ltcGxldGFicyc7XG5cbmNsYXNzIFBlblN0YXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGxhc3RDbHV0Y2hTaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG9yZ3MsIGxhc3RDbHV0Y2hTaXplLCBzZWxlY3RlZEluZGV4LCBvblNlbGVjdGlvbkNoYW5nZSwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGxhc3RDbHV0Y2ggPSBvcmdzLnNsaWNlKC1sYXN0Q2x1dGNoU2l6ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRhYnM+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiQnJlZWRpbmcgUGVuXCIga2V5PVwiQnJlZWRpbmcgUGVuXCI+XG4gICAgICAgICAgPFBlblZpZXcgb3Jncz17bGFzdENsdXRjaH0gey4uLm90aGVyc31cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg9e3NlbGVjdGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtmdW5jdGlvbihpU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob25TZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UoaVNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgICA8VGFicy5QYW5lbCB0aXRsZT1cIlN0YXRzXCIga2V5PVwiU3RhdHNcIj5cbiAgICAgICAgICA8U3RhdHNWaWV3IG9yZ3M9e29yZ3N9IGxhc3RDbHV0Y2hTaXplPXtsYXN0Q2x1dGNoU2l6ZX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVuU3RhdHNWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dzIC0gT3B0aW9uIG51bWJlciBvZiByb3dzLiBJZiBkZWZpbmVkLCBpdCB3aWxsIGJlIGZpeGVkIGF0IHRoYXQuIE90aGVyd2lzZSwgaXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCBkZWZhdWx0IHRvIDEgd2hlbiB0aGVyZSBhcmUgbm8gb3JncywgYW5kIGdyb3dzIGFzIG1vcmUgcm93cyBhcmUgbmVlZGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IHRpZ2h0ZW5Sb3dzIC0gSWYgZ2l2ZW4sIHdpbGwgc2hyaW5rIHRoZSB2ZXJ0aWNhbCBoZWlnaHQgb2YgdGhlIHBlbiBieSB0aGlzIGFtb3VudFxuICogICAgICAgICAgICAgICAgICAgICAgICBwZXIgcm93LCBjcm93ZGluZyB0aGUgb3JnIGltYWdlcyBhcyBuZWVkZWQuXG4gKi9cbmNvbnN0IFBlblZpZXcgPSAoe29yZ3MsIGlkUHJlZml4PSdvcmdhbmlzbS0nLCB3aWR0aD00MDAsIGNvbHVtbnM9NSwgcm93cywgdGlnaHRlblJvd3M9MCwgdGlnaHRlbkNvbHVtbnM9MCwgU2VsZWN0ZWRPcmdhbmlzbVZpZXc9T3JnYW5pc21WaWV3LCBzZWxlY3RlZEluZGV4LCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGlkLCBvcmcpIHtcbiAgICBjb25zdCBwcmVmaXhJbmRleCA9IGlkLmluZGV4T2YoaWRQcmVmaXgpLFxuICAgICAgICAgIGluZGV4ID0gTnVtYmVyKGlkLnN1YnN0cihwcmVmaXhJbmRleCArIGlkUHJlZml4Lmxlbmd0aCkpO1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGluZGV4LCBpZCwgb3JnKTtcbiAgfVxuXG4gIGxldCBvcmdTdHlsZSA9IHtcbiAgICBtYXJnaW46IGAkey10aWdodGVuUm93cy8yfXB4ICR7LXRpZ2h0ZW5Db2x1bW5zLzJ9cHhgXG4gIH07XG5cbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZywgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09PSBzZWxlY3RlZEluZGV4XG4gICAgICAgICAgICAgICAgPyA8U2VsZWN0ZWRPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZFByZWZpeCArIGluZGV4fSBpbmRleD17aW5kZXh9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cIiNGRkZGQUFcIiBzaXplPXtvcmdXaWR0aH0gc3R5bGU9e29yZ1N0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30vPlxuICAgICAgICAgICAgICAgIDogPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkUHJlZml4ICsgaW5kZXh9IGluZGV4PXtpbmRleH0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e29yZ1dpZHRofSBzdHlsZT17b3JnU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSAvPjtcbiAgICAgIH0pO1xuXG4gIHJvd3MgPSByb3dzIHx8IE1hdGguY2VpbChvcmdWaWV3cy5sZW5ndGggLyBjb2x1bW5zKSB8fCAxO1xuXG4gIGxldCBoZWlnaHQgPSBvcmdXaWR0aCAqIHJvd3M7XG5cbiAgd2lkdGggID0gd2lkdGggIC0gKHRpZ2h0ZW5Db2x1bW5zICogY29sdW1ucyk7XG4gIGhlaWdodCA9IGhlaWdodCAtICh0aWdodGVuUm93cyAqIHJvd3MpO1xuXG4gIGxldCBzdHlsZSA9IHsgd2lkdGgsIGhlaWdodCB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHBlblwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIHJvd3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRpZ2h0ZW5Db2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0aWdodGVuUm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgU2VsZWN0ZWRPcmdhbmlzbVZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcblxuY29uc3QgUXVlc3Rpb25HbG93VmlldyA9ICh7Z2xvd0NvbG9yLCBzaXplPTIwMH0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBnbG93U3R5bGUgPSB7cG9zaXRpb246ICdhYnNvbHV0ZSd9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3dcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgY29sb3I9e2dsb3dDb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e2dsb3dTdHlsZX0vPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3cgcXVlc3Rpb24tbWFya1wiXG4gICAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiBcImFic29sdXRlXCIsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9fT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuICAvLyBIVE1MIHRleHQgbm9kZVxuICAvLzxkaXYgc3R5bGU9e3RTdHlsZX0+e3RleHR9PC9kaXY+XG5cbiAgLy8gU1ZHIHRleHQgbm9kZVxuICAvLzxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgLy8gIDx0ZXh0IHg9JzUwJyB5PScxNzUnIGZpbGw9JyMwRDBEOEMnIHN0eWxlPXt0U3R5bGV9PlxuICAvLyAgICB7dGV4dH1cbiAgLy8gIDwvdGV4dD5cbiAgLy88L3N2Zz5cbn07XG5cblF1ZXN0aW9uR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBnbG93Q29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtR2xvd1ZpZXcgZnJvbSAnLi9vcmdhbmlzbS1nbG93JztcbmltcG9ydCBRdWVzdGlvbkdsb3dWaWV3IGZyb20gJy4vcXVlc3Rpb24tZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyA9ICh7aGlkZGVuLCBjb2xvciwgc2l6ZSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IG9yZ1ZpZXcgPSA8T3JnYW5pc21HbG93VmlldyBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHsuLi5vdGhlcn0gLz4sXG4gICAgICAgIHF1ZXN0aW9uVmlldyA9IDxRdWVzdGlvbkdsb3dWaWV3IGdsb3dDb2xvcj17Y29sb3J9IHdpZHRoPXtzaXplfSAvPixcbiAgICAgICAgZmluYWxWaWV3ID0gaGlkZGVuID8gcXVlc3Rpb25WaWV3IDogb3JnVmlldztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBxdWVzdGlvbi1vcmdhbmlzbS1nbG93XCI+XG4gICAgICB7ZmluYWxWaWV3fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaGlkZGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBicmVlZGluZyBzdGF0aXN0aWNzIGZvciBhIHNldCBvZiBCaW9sb2dpY2Egb3JnYW5pc21zXG4gKiBAcGFyYW0ge09iamVjdFtdfSBvcmdzIC0gYXJyYXkgb2YgQmlvbG9naWNhIG9yZ2FuaXNtcyBmb3Igd2hpY2ggc3RhdGlzdGljcyBhcmUgdG8gYmUgZGlzcGxheWVkXG4gKiBAcGFyYW0ge09iamVjdH0gb3Jnc1tdLnBoZW5vdHlwZSAtIHRoZSBwaGVub3R5cGUgb2YgdGhlIEJpb2xvZ2ljYSBvcmdhbmlzbVxuICogQHBhcmFtIHtudW1iZXJ9IFtsYXN0Q2x1dGNoU2l6ZT1vcmdzLmxlbmd0aF0gLSB0aGUgbnVtYmVyIG9mIG9yZ2FuaXNtcyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSB0aGF0IGNvbXByaXNlIHRoZSBtb3N0IHJlY2VudCBjbHV0Y2hcbiAqL1xuY29uc3QgU3RhdHNWaWV3ID0gKHtvcmdzLCBsYXN0Q2x1dGNoU2l6ZX0pID0+IHtcblxuICBsZXQgdHJhaXRzID0gR2VuZXRpY3NVdGlscy5jb21wdXRlVHJhaXRDb3VudHNGb3JPcmdhbmlzbXMob3JncywgbGFzdENsdXRjaFNpemUpLFxuICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ3MubGVuZ3RoLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuY2x1dGNoW0Jpb0xvZ2ljYS5NQUxFXSxcbiAgICAgICAgICAgIGNGZW1hbGVzID0gY291bnRzLmNsdXRjaFtCaW9Mb2dpY2EuRkVNQUxFXSxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoMTAwICogY1RvdGFsIC8gY2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLk1BTEVdLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLkZFTUFMRV0sXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10cmFpdC12YWx1ZT17cm93LnZhbHVlfT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiIsIi8qXG4gKiBTZWUgaHR0cHM6Ly9tZWRpdW0uY29tL0BrZW50Y2RvZGRzL21pc3VuZGVyc3RhbmRpbmctZXM2LW1vZHVsZXMtdXBncmFkaW5nLWJhYmVsLXRlYXJzLWFuZC1hLXNvbHV0aW9uLWFkMmQ1YWI5M2NlMCMucTF2Y2tmZml3XG4gKiAoS2VudCBDLiBEb2RkcywgXCJNaXN1bmRlcnN0YW5kaW5nIEVTNiBNb2R1bGVzLCBVcGdyYWRpbmcgQmFiZWwsIFRlYXJzLCBhbmQgYSBTb2x1dGlvblwiKVxuICogZm9yIGRlc2NyaXB0aW9uIG9mIHNvbWUgb2YgdGhlIGRldGFpbHMgaW52b2x2ZWQgaW4gbWl4aW5nIEVTNiBleHBvcnQgd2l0aCByZXF1aXJlKCkuXG4gKi9cblxuLy8gY29tcG9uZW50c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVGaWx0ZXJzVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbGxlbGUtZmlsdGVycyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFsbGVsZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQW5pbWF0ZWRHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLW9yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmFza2V0U2V0VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9iYXNrZXQtc2V0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoYW5nZVNleEJ1dHRvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZUltYWdlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENpcmN1bGFyR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVnZ0NsdXRjaFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZWdnLWNsdXRjaCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlZWRiYWNrVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZWVkYmFjayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVQb29sVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nYW1ldGUtcG9vbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VuZUxhYmVsVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVGVzdFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5vbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdsb3dCYWNrZ3JvdW5kVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb2RhbEFsZXJ0IH0gZnJvbSAnLi9jb21wb25lbnRzL21vZGFsLWFsZXJ0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JkaW5hbE9yZ2FuaXNtVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmRpbmFsLW9yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL29yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9wZW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQZW5TdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuLXN0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdHMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFsbGVuZ2VBd2FyZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbGxlbmdlLWF3YXJkJztcblxuLy8gdXRpbGl0aWVzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmV0aWNzVXRpbHMgfSBmcm9tICcuL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG4iLCIvKipcbiAqIENsYXNzIHByb3ZpZGluZyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgQmlvTG9naWNhIGdlbmV0aWNzIG9wZXJhdGlvbnMuXG4gKiBJbiBzb21lIGNhc2VzIHRoZXNlIGFyZSBhZGFwdGVkIGZyb20gY29ycmVzcG9uZGluZyBjb2RlIGluIEdlbml2ZXJzZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXRpY3NVdGlscyB7XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGFsbGVsZSBzdHJpbmdzIGluIHRoZSBuZXcgZGFzaCBmb3JtIChlLmcuIFwiVy13LCBULSwgLWFcIikgdG8gdGhlIG9yaWdpbmFsXG4gICAqIEJpb0xvZ2ljYSBhOmI6IGZvcm0gKGUuZy4gXCJhOlcsYjp3LGE6VCxiOmFcIilcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9ICBkYXNoQWxsZWxlU3RyaW5nIC0gdGhlIGFsbGVsZSBzdHJpbmcgdG8gYmUgY29udmVydGVkXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9ICB0aGUgY29udmVydGVkIGFsbGVsZSBzdHJpbmdcbiAgICovXG4gIHN0YXRpYyBjb252ZXJ0RGFzaEFsbGVsZXNUb0FCQWxsZWxlcyhkYXNoQWxsZWxlU3RyaW5nKSB7XG4gICAgaWYgKCFkYXNoQWxsZWxlU3RyaW5nIHx8IChkYXNoQWxsZWxlU3RyaW5nLmluZGV4T2YoJzonKSA+PSAwKSB8fCAoZGFzaEFsbGVsZVN0cmluZy5pbmRleE9mKCctJykgPCAwKSlcbiAgICAgIHJldHVybiBkYXNoQWxsZWxlU3RyaW5nO1xuICAgIGNvbnN0IGRhc2hBbGxlbGVzID0gZGFzaEFsbGVsZVN0cmluZy5zcGxpdCgnLCcpO1xuICAgIHJldHVybiBkYXNoQWxsZWxlcy5yZWR1Y2UoKHByZXYsIHBhaXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbGVsZXMgPSBwYWlyLnRyaW0oKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbGVsZXNbMF0pIHByZXYgKz0gYCR7cHJldiA/ICcsJyA6ICcnfWE6JHthbGxlbGVzWzBdLnRyaW0oKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbGVsZXNbMV0pIHByZXYgKz0gYCR7cHJldiA/ICcsJyA6ICcnfWI6JHthbGxlbGVzWzFdLnRyaW0oKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgfSwgXCJcIik7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYWxsZWxlIHN0cmluZ3MgaW4gdGhlIG5ldyBkYXNoIGZvcm0gKGUuZy4gXCJXLXcsIFQtLCAtYVwiKSB0byB0aGUgb3JpZ2luYWxcbiAgICogQmlvTG9naWNhIGE6YjogZm9ybSAoZS5nLiBcImE6VyxiOncsYTpULGI6YVwiKSB3aXRoaW4gb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgKlxuICAgKiBSZWN1cnNlcyB0aHJvdWdoIG5lc3RlZCBvYmplY3RzL2FycmF5cyBjb252ZXJ0aW5nIGRhc2ggYWxsZWxlIHN0cmluZ3MgaW4gcHJvcGVydGllc1xuICAgKiB3aG9zZSBuYW1lcyBhcmUgd2hpdGUtbGlzdGVkIGluIHRoZSBwcm9wTmFtZXMgYXJndW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSAgb2JqZWN0IC0gdGhlIG9iamVjdCB0byBiZSBjb252ZXJ0ZWRcbiAgICogQHJldHVybnMge29iamVjdH0gIHRoZSBzYW1lIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIHRoZSBzcGVjaWZpZWQgZmllbGRzIG1vZGlmaWVkXG4gICAqL1xuICBzdGF0aWMgY29udmVydERhc2hBbGxlbGVzT2JqZWN0VG9BQkFsbGVsZXMob2JqZWN0LCBwcm9wTmFtZXMpIHtcbiAgICBpZiAoIW9iamVjdCB8fCAhcHJvcE5hbWVzIHx8IChwcm9wTmFtZXMubGVuZ3RoID09IG51bGwpKSByZXR1cm4gb2JqZWN0O1xuXG4gICAgZnVuY3Rpb24gY29udmVydFZhbHVlKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcbiAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgcmV0dXJuICgha2V5IHx8IChwcm9wTmFtZXMuaW5kZXhPZihrZXkpID49IDApKVxuICAgICAgICAgICAgICAgICAgICA/IEdlbmV0aWNzVXRpbHMuY29udmVydERhc2hBbGxlbGVzVG9BQkFsbGVsZXModmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgdGhlIGtleSBmb3Igc3RyaW5ncyBpbiBhcnJheXMgaXMgdGhlIGtleSBmb3IgdGhlIGFycmF5XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubWFwKChpdGVtKSA9PiBjb252ZXJ0VmFsdWUoa2V5LCBpdGVtKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgb2JqS2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgIHZhbHVlW29iaktleV0gPSBjb252ZXJ0VmFsdWUob2JqS2V5LCB2YWx1ZVtvYmpLZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY29udmVydFZhbHVlKG51bGwsIG9iamVjdCk7XG4gIH1cblxuICBzdGF0aWMgZW5zdXJlVmFsaWRPcmdhbmlzbShvcmdPckRlZiwgc3BlY2llcz1CaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSkge1xuICAgIGlmIChvcmdPckRlZi5nZXRBbGxlbGVTdHJpbmcpIHtcbiAgICAgIHJldHVybiBvcmdPckRlZjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oc3BlY2llcywgb3JnT3JEZWYuYWxsZWxlU3RyaW5nLCBvcmdPckRlZi5zZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGFsbGVsZXMgYXJlIHByZXNlbnQgaW4gdGhlIGFsbGVsZSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgYWxsZWxlU3RyaW5nIC0gb3JnYW5pc20gYWxsZWxlIHN0cmluZ1xuICAgKiBAcGFyYW0gKHN0cmluZykgIGFsbGVsZXMgLSBhbGxlbGVzIHRvIG1hdGNoIGFnYWluc3QgdGhlIG9yZ2FuaXNtIGFsbGVsZXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGFsbGVsZXMgYXJlIHByZXNlbnQgaW4gdGhlIGFsbGVsZVN0cmluZywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBzdGF0aWMgYWxsZWxlU3RyaW5nQ29udGFpbnNBbGxlbGVzKGFsbGVsZVN0cmluZywgYWxsZWxlcykge1xuICAgIC8vIGVtcHR5IHN0cmluZ3MgZG9uJ3QgbWF0Y2hcbiAgICBpZiAoIWFsbGVsZVN0cmluZyB8fCAhYWxsZWxlcykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIG11c3QgbWF0Y2ggZXZlcnkgb25lIG9mIHRoZSBhbGxlbGVzIC4uLlxuICAgIHJldHVybiBhbGxlbGVzLnNwbGl0KCcsJykuZXZlcnkoKGFsbGVsZSkgPT4ge1xuICAgICAgLy8gLi4uIHRvIHRoZSBhbGxlbGVzIG9mIHRoZSBhbGxlbGVTdHJpbmdcbiAgICAgIHJldHVybiBhbGxlbGVTdHJpbmcuc2VhcmNoKGAke2FsbGVsZX0oLHwkKWApID49IDA7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgYWxsZWxlIHN0cmluZyBjb250YWlucyBvbmx5IHZhbGlkIGFsbGVsZXNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9ICBhbGxlbGVTdHJpbmcgLSB0aGUgYWxsZWxlIHN0cmluZyAoaW4gYTpiOiBmb3JtKSB0byBiZSB2YWxpZGF0ZWRcbiAgICogQHBhcmFtIHtvYmplY3R9ICBbc3BlY2llc10gLSB0aGUgc3BlY2llcyB3aG9zZSBnZW5vbWUgaXMgdXNlZCB0byBkZXRlcm1pbmUgY29tcGxldGVuZXNzXG4gICAqIEByZXR1cm5zICAgICAgICAgdHJ1ZSBpZiB0aGUgYWxsZWxlIHN0cmluZyBpcyB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBzdGF0aWMgaXNWYWxpZEFsbGVsZVN0cmluZyhhbGxlbGVTdHJpbmcsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAoIXNwZWNpZXMgfHwgIWFsbGVsZVN0cmluZykgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGFsbGVsZVRvR2VuZU1hcCA9IE9iamVjdC5rZXlzKHNwZWNpZXMuZ2VuZUxpc3QpLnJlZHVjZSgocHJldiwgZ2VuZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY2llcy5nZW5lTGlzdFtnZW5lXS5hbGxlbGVzLmZvckVhY2goKGFsbGVsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2FsbGVsZV0gPSBnZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7fSk7XG4gICAgcmV0dXJuIGFsbGVsZVN0cmluZy5zcGxpdCgnLCcpLmV2ZXJ5KChhbGxlbGVTaWRlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBbc2lkZSwgYWxsZWxlXSA9IGFsbGVsZVNpZGUuc3BsaXQoJzonKTtcbiAgICAgICAgICAgIHJldHVybiAoKHNpZGUudHJpbSgpID09PSAnYScpIHx8IChzaWRlLnRyaW0oKSA9PT0gJ2InKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgKGFsbGVsZVRvR2VuZU1hcFthbGxlbGUudHJpbSgpXSAhPSBudWxsKTtcbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBhbGxlbGUgc3RyaW5nIGNvbXBsZXRlbHkgc3BlY2lmaWVzIGFsbCBhbGxlbGVzXG4gICAqXG4gICAqIFRvIGJlIGNvbXBsZXRlLCBldmVyeSBnZW5lIG11c3QgYmUgc3BlY2lmaWVkIHdpdGggYSB2YWxpZCBhbGxlbGUgZm9yIGVhY2hcbiAgICogc2lkZSAoZXhjZXB0IHNleC1saW5rZWQgZ2VuZXMsIHdoaWNoIG5lZWQgb25seSBiZSBvbiBvbmUgc2lkZSksIGFuZCBub1xuICAgKiBpbnZhbGlkIGFsbGVsZXMgb3IgZ2VuZXMgY2FuIGJlIHNwZWNpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9ICBhbGxlbGVTdHJpbmcgLSB0aGUgYWxsZWxlIHN0cmluZyAoaW4gYTpiOiBmb3JtKSB0byBiZSB2YWxpZGF0ZWRcbiAgICogQHBhcmFtIHtvYmplY3R9ICBbc3BlY2llc10gLSB0aGUgc3BlY2llcyB3aG9zZSBnZW5vbWUgaXMgdXNlZCB0byBkZXRlcm1pbmUgY29tcGxldGVuZXNzXG4gICAqIEByZXR1cm5zICAgICAgICAgdHJ1ZSBpZiB0aGUgYWxsZWxlIHN0cmluZyBpcyBjb21wbGV0ZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBzdGF0aWMgaXNDb21wbGV0ZUFsbGVsZVN0cmluZyhhbGxlbGVTdHJpbmcsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAoIXNwZWNpZXMgfHwgIWFsbGVsZVN0cmluZykgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGtVbmtub3duR2VuZSA9IFwiX19VTktOT1dOX19cIixcbiAgICAgICAgICBhbGxlbGVUb0dlbmVNYXAgPSBPYmplY3Qua2V5cyhzcGVjaWVzLmdlbmVMaXN0KS5yZWR1Y2UoKHByZXYsIGdlbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNpZXMuZ2VuZUxpc3RbZ2VuZV0uYWxsZWxlcy5mb3JFYWNoKChhbGxlbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldlthbGxlbGVdID0gZ2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge30pLFxuICAgICAgICAgIHNwZWNpZXNHZW5lQ291bnQgPSBPYmplY3Qua2V5cyhzcGVjaWVzLmdlbmVMaXN0KS5sZW5ndGgsXG4gICAgICAgICAgZ2VuZVNpZGVNYXAgPSBhbGxlbGVTdHJpbmcuc3BsaXQoJywnKS5yZWR1Y2UoKHByZXYsIGFsbGVsZVNpZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW3NpZGUsIGFsbGVsZV0gPSBhbGxlbGVTaWRlLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBnZW5lID0gYWxsZWxlVG9HZW5lTWFwW2FsbGVsZS50cmltKCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdlbmUpIGdlbmUgPSBrVW5rbm93bkdlbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBnZW5lRW50cnkgPSBwcmV2W2dlbmVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdlbmVFbnRyeSkgZ2VuZUVudHJ5ID0gcHJldltnZW5lXSA9IHsgYTogMCwgYjogMCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICArKyBnZW5lRW50cnlbc2lkZS50cmltKCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHt9KSxcbiAgICAgICAgICBhbGxlbGVTdHJpbmdHZW5lQ291bnQgPSBPYmplY3Qua2V5cyhnZW5lU2lkZU1hcCkubGVuZ3RoLFxuICAgICAgICAgIGlzRXZlcnlHZW5lQ29tcGxldGUgPSBPYmplY3Qua2V5cyhnZW5lU2lkZU1hcCkuZXZlcnkoKGdlbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW5lRW50cnkgPSBnZW5lU2lkZU1hcFtnZW5lXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1hZR2VuZSA9IHNwZWNpZXMuY2hyb21vc29tZUdlbmVNYXAuWFkuc29tZSgoYWxsZWxlKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmUgPT09IGFsbGVsZVRvR2VuZU1hcFthbGxlbGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZUVudHJ5ICYmICgoZ2VuZUVudHJ5LmEgPT09IDEpICYmIChnZW5lRW50cnkuYiA9PT0gMSkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaXNYWUdlbmUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGdlbmVFbnRyeS5hICsgZ2VuZUVudHJ5LmIgPj0gMSkgJiYgKGdlbmVFbnRyeS5hICsgZ2VuZUVudHJ5LmIgPD0gMikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyBtdXN0IGhhdmUgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGdlbmVzLCBhbGwgZ2VuZXMgbXVzdCBiZSBjb21wbGV0ZSwgYW5kIG5vIHVua25vd24gZ2VuZXNcbiAgICByZXR1cm4gKHNwZWNpZXNHZW5lQ291bnQgPT09IGFsbGVsZVN0cmluZ0dlbmVDb3VudCkgJiYgaXNFdmVyeUdlbmVDb21wbGV0ZSAmJlxuICAgICAgICAgICAgKGdlbmVTaWRlTWFwW2tVbmtub3duR2VuZV0gPT0gbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVycyBvdXQgaGlkZGVuIGFsbGVsZXMsIGdpdmVuIGEgbGlzdCBvZiBjaGFuZ2VhYmxlIGFuZCB2aXNpYmxlIGdlbmVzLlxuICAgKiBSZXR1cm5zIGFycmF5IG9mIG9iamVjdHMgd2l0aCB0aGUgYWxsZWxlIGFuZCB0aGUgZWRpdGFiaWxpdHlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gYWxsZWxlcyAtIHRoZSBzZXQgb2YgYWxsZWxlcyB0byBiZSBmaWx0ZXJlZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB1c2VyQ2hhbmdlYWJsZUdlbmVzIC0gZ2VuZXMgdGhhdCB0aGUgdXNlciBjYW4gZWRpdCAoaWYgdGhlIHRlbXBsYXRlIGFsbG93cylcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdmlzaWJsZUdlbmVzIC0gZ2VuZXMgdGhhdCB0aGUgdXNlciBjYW4gdmlldyAoYWxyZWFkeSBpbmNsdWRlcyB0aGUgYWJvdmUgbGlzdClcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2Euc3BlY2llc30gc3BlY2llcyAtIHRoZSBzcGVjaWVzIHRoYXQgZGVmaW5lcyB0aGUgZ2Vub3R5cGVcbiAgICogQHJldHVybiB7b2JqW119IC0gdGhlIGZpbHRlcmVkIGFsbGVsZXMsIHdoZXJlIGVhY2ggaXMgYW4gb2JqZWN0IHdpdGggYSBuYW1lIGFuZCB3aGV0aGVyIGl0IGlzIGVkaXRhYmxlXG4gICAqL1xuICBzdGF0aWMgZmlsdGVyVmlzaWJsZUFsbGVsZXMoYWxsZWxlcywgdXNlckNoYW5nZWFibGVHZW5lcywgdmlzaWJsZUdlbmVzLCBzcGVjaWVzKSB7XG4gICAgbGV0IHNob3dBbGwgPSB1c2VyQ2hhbmdlYWJsZUdlbmVzLmxlbmd0aCArIHZpc2libGVHZW5lcy5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIGFsbGVsZXMuZmlsdGVyKGEgPT4ge1xuICAgICAgaWYgKHNob3dBbGwpIHJldHVybiB0cnVlO1xuXG4gICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKSxcbiAgICAgICAgICAgIGdlbmVOYW1lID0gZ2VuZSA/IGdlbmUubmFtZSA6IG51bGw7XG4gICAgICByZXR1cm4gdXNlckNoYW5nZWFibGVHZW5lcy5pbmRleE9mKGdlbmVOYW1lKSA+IC0xIHx8IHZpc2libGVHZW5lcy5pbmRleE9mKGdlbmVOYW1lKSA+IC0xO1xuICAgIH0pLm1hcChhID0+ICh7XG4gICAgICBhbGxlbGU6IGEsXG4gICAgICBlZGl0YWJsZTogdXNlckNoYW5nZWFibGVHZW5lcy5pbmRleE9mKEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSkubmFtZSkgPiAtMVxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlIGEgbWFwIG9mIHRyYWl0cyAtPiB0cmFpdFZhbHVlcyAtPiB0cmFpdENvdW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc21bXX0gb3JnYW5pc21zIC0gdGhlIHNldCBvZiBvcmdhbmlzbXMgdG8gY29tcHV0ZSBzdGF0cyBmb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNsdXRjaFNpemUgLSB0aGUgbGFzdCAnY2x1dGNoU2l6ZScgb3JnYW5pc21zIGFyZSBhc3N1bWVkIHRvIGJlIHRoZSBsYXN0IGNsdXRjaFxuICAgKiBAcmV0dXJuIHtNYXB9IC0gZS5nLiB7IFwidGFpbFwiOiB7IFwibG9uZyB0YWlsXCI6IHsgXCJjbHV0Y2hcIjogWzksIDExXSwgXCJ0b3RhbFwiOiBbNTMsIDQ3XSB9fX1cbiAgICovXG4gIHN0YXRpYyBjb21wdXRlVHJhaXRDb3VudHNGb3JPcmdhbmlzbXMob3JnYW5pc21zLCBsYXN0Q2x1dGNoU2l6ZSkge1xuICAgIGxldCB0cmFpdHMgPSBuZXcgTWFwLFxuICAgICAgICBjbHV0Y2hTaXplID0gbGFzdENsdXRjaFNpemUgfHwgb3JnYW5pc21zLmxlbmd0aDtcblxuICAgIC8vIGFjY3VtdWxhdGUgc3RhdHMgZm9yIGVhY2ggdHJhaXQvdmFsdWUgY29tYmluYXRpb25cbiAgICBmb3IgKGNvbnN0IFtpbmRleCwgb3JnXSBvZiBvcmdhbmlzbXMuZW50cmllcygpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIE9iamVjdC5rZXlzKG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljc1t0cmFpdF0sXG4gICAgICAgICAgICB0cmFpdFZhbHVlcyA9IHRyYWl0cy5nZXQodHJhaXQpIHx8IG5ldyBNYXAsXG4gICAgICAgICAgICB2YWx1ZUNvdW50cyA9IHRyYWl0VmFsdWVzLmdldCh2YWx1ZSkgfHwgeyBjbHV0Y2g6IFswLCAwXSwgdG90YWw6IFswLCAwXSB9O1xuICAgICAgICBpZiAoIXRyYWl0cy5oYXModHJhaXQpKSB0cmFpdHMuc2V0KHRyYWl0LCB0cmFpdFZhbHVlcyk7XG4gICAgICAgIGlmICghdHJhaXRWYWx1ZXMuaGFzKHZhbHVlKSkgdHJhaXRWYWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUNvdW50cyk7XG4gICAgICAgIC8vIG1vc3QgcmVjZW50IGNsdXRjaCBhc3N1bWVkIHRvIGJlIGF0IGVuZCBvZiBvcmdhbmlzbXMgYXJyYXlcbiAgICAgICAgaWYgKGluZGV4ID49IG9yZ2FuaXNtcy5sZW5ndGggLSBjbHV0Y2hTaXplKVxuICAgICAgICAgICsrIHZhbHVlQ291bnRzLmNsdXRjaFtvcmcuc2V4XTtcbiAgICAgICAgKysgdmFsdWVDb3VudHMudG90YWxbb3JnLnNleF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cmFpdHM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYW4gYWxsZWxlIHN0cmluZyB0byBhIEphdmFTY3JpcHQgb2JqZWN0IHRoYXQgbWFwcyBnZW5lcyB0byBhbGxlbGVzLlxuICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgZm9yIGNvbXBhcmlzb24gcHVycG9zZXMsIGZvciBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gZ2VuZSBtYXAgb2YgZm9ybSB7IGhvcm5zOiB7YTpcImhcIiwgYjpcImhcIn0sIGFybW9yOiB7YTpcImFcIiwgYjpcImFcIn0sIC4uLn1cbiAgICovXG4gIHN0YXRpYyBidWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcpIHtcbiAgICBsZXQgZ2VuZU1hcCA9IHt9LFxuICAgICAgICBhbGxlbGVTdWJzdHJpbmdzID0gYWxsZWxlU3RyaW5nLnNwbGl0KFwiLFwiKTtcbiAgICBmb3IgKGNvbnN0IGFsbGVsZVN1YnN0ciBvZiBhbGxlbGVTdWJzdHJpbmdzKSB7XG4gICAgICBjb25zdCBbc2lkZSwgYWxsZWxlXSA9IGFsbGVsZVN1YnN0ci5zcGxpdChcIjpcIiksXG4gICAgICAgICAgICBnZW5lID0gZ2VuZXRpY3MuZ2VuZUZvckFsbGVsZShhbGxlbGUpO1xuICAgICAgaWYgKHNpZGUgJiYgYWxsZWxlICYmIGdlbmUpIHtcbiAgICAgICAgaWYgKCFnZW5lTWFwW2dlbmVdKSBnZW5lTWFwW2dlbmVdID0ge307XG4gICAgICAgIGdlbmVNYXBbZ2VuZV1bc2lkZV0gPSBhbGxlbGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnZW5lTWFwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGFuIGFsbGVsZSBzdHJpbmcgYW5kIGEgZ2VuZSBtYXAgZGVmaW5pbmcgYSBzZXQgb2YgYmFzZSAoZGVmYXVsdCkgYWxsZWxlcyxcbiAgICogcmV0dXJucyBhIG5ldyBhbGxlbGUgc3RyaW5nIHdpdGggbWlzc2luZyBhbGxlbGVzIHJlcGxhY2VkIGJ5IHRoZWlyIGRlZmF1bHRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBiYXNlR2VuZU1hcCAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3JuOiB7YTpcImhcIiwgYjpcImhcIn0sIGFybW9yOiB7YTpcImFcIiwgYjpcImFcIn0sIC4uLn1cbiAgICogQHJldHVybiB7c3RyaW5nfSAtIHVwZGF0ZWQgYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCJcbiAgICovXG4gIHN0YXRpYyBmaWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21HZW5lTWFwKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VHZW5lTWFwKSB7XG4gICAgY29uc3QgZHN0R2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKTtcbiAgICBsZXQgICBkc3RBbGxlbGVTdHJpbmcgPSBhbGxlbGVTdHJpbmc7XG4gICAgZm9yIChjb25zdCBnZW5lIGluIGRzdEdlbmVNYXApIHtcbiAgICAgIGNvbnN0IGdlbmVWYWx1ZSA9IGRzdEdlbmVNYXBbZ2VuZV07XG4gICAgICAvLyByZXBsYWNlIGEgbWlzc2luZyAnYScgc2lkZSBhbGxlbGUgd2l0aCB0aGUgZGVmYXVsdCBpZiBhcHByb3ByaWF0ZVxuICAgICAgaWYgKCFnZW5lVmFsdWUuYSAmJiBiYXNlR2VuZU1hcFtnZW5lXSAmJiBiYXNlR2VuZU1hcFtnZW5lXS5hKSB7XG4gICAgICAgIGRzdEFsbGVsZVN0cmluZyA9IGRzdEFsbGVsZVN0cmluZy5yZXBsYWNlKGBiOiR7Z2VuZVZhbHVlLmJ9YCwgYGE6JHtiYXNlR2VuZU1hcFtnZW5lXS5hfSwkJmApO1xuICAgICAgfVxuICAgICAgLy8gcmVwbGFjZSBhIG1pc3NpbmcgJ2InIHNpZGUgYWxsZWxlIHdpdGggdGhlIGRlZmF1bHQgaWYgYXBwcm9wcmlhdGVcbiAgICAgIGlmICghZ2VuZVZhbHVlLmIgJiYgYmFzZUdlbmVNYXBbZ2VuZV0gJiYgYmFzZUdlbmVNYXBbZ2VuZV0uYikge1xuICAgICAgICBkc3RBbGxlbGVTdHJpbmcgPSBkc3RBbGxlbGVTdHJpbmcucmVwbGFjZShgYToke2dlbmVWYWx1ZS5hfWAsIGAkJixiOiR7YmFzZUdlbmVNYXBbZ2VuZV0uYn1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRzdEFsbGVsZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0d28gYWxsZWxlIHN0cmluZ3MsIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyBpbiB3aGljaCBtaXNzaW5nIGFsbGVsZXNcbiAgICogaW4gdGhlIGZpcnN0IGFyZSByZXBsYWNlZCBieSBkZWZhdWx0cyBwcm92aWRlZCBieSB0aGUgc2Vjb25kIGFsbGVsZSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2VBbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byB1c2UgYXMgZGVmYXVsdHNcbiAgICogQHJldHVybiB7c3RyaW5nfSAtIHVwZGF0ZWQgYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCJcbiAgICovXG4gIHN0YXRpYyBmaWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUFsbGVsZVN0cmluZykge1xuICAgIGNvbnN0IGJhc2VHZW5lTWFwID0gR2VuZXRpY3NVdGlscy5idWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBiYXNlQWxsZWxlU3RyaW5nKTtcbiAgICByZXR1cm4gR2VuZXRpY3NVdGlscy5maWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21HZW5lTWFwKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VHZW5lTWFwKTtcbiAgfVxuXG4gIHN0YXRpYyBudW1iZXJPZkJyZWVkaW5nTW92ZXNUb1JlYWNoRHJha2Uob3JnYW5pc20xLCBvcmdhbmlzbTIsIGNoYW5nZWFibGVBbGxlbGVzMSwgY2hhbmdlYWJsZUFsbGVsZXMyLCB0YXJnZXRPcmdhbmlzbSkge1xuICAgIHZhciBtb3ZlcyA9IDAsXG4gICAgICAgIG9yZzFBbGxlbGVzID0gb3JnYW5pc20xLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KCcsJykubWFwKGEgPT4gYS5zcGxpdCgnOicpWzFdKSxcbiAgICAgICAgb3JnMkFsbGVsZXMgPSBvcmdhbmlzbTIuZ2V0QWxsZWxlU3RyaW5nKCkuc3BsaXQoJywnKS5tYXAoYSA9PiBhLnNwbGl0KCc6JylbMV0pLFxuICAgICAgICB0YXJnZXRjaGFycyA9IHRhcmdldE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgIHRyYWl0UnVsZXMgPSBvcmdhbmlzbTEuc3BlY2llcy50cmFpdFJ1bGVzO1xuXG4gICAgZm9yICh2YXIgdHJhaXQgaW4gdHJhaXRSdWxlcykge1xuICAgICAgaWYgKHRyYWl0UnVsZXMuaGFzT3duUHJvcGVydHkodHJhaXQpKSB7XG4gICAgICAgIHZhciBwb3NzaWJsZVNvbHV0aW9ucyA9IHRyYWl0UnVsZXNbdHJhaXRdW3RhcmdldGNoYXJzW3RyYWl0XV0sXG4gICAgICAgICAgICBzaG9ydGVzdFBhdGggPSBJbmZpbml0eTtcbiAgICAgICAgaWYgKHBvc3NpYmxlU29sdXRpb25zICYmIHBvc3NpYmxlU29sdXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHBvc3NpYmxlU29sdXRpb25zLmxlbmd0aDsgaTxpaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXSxcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMSA9IDAsXG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjIgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpqID0gc29sdXRpb24ubGVuZ3RoOyBqPGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIGFsbGVsZTEgPSBzb2x1dGlvbltqXSxcbiAgICAgICAgICAgICAgICAgIGFsbGVsZTIgPSBqJTIgPT09IDAgPyBzb2x1dGlvbltqKzFdIDogc29sdXRpb25bai0xXSxcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSAwO1xuICAgICAgICAgICAgICBpZiAob3JnMUFsbGVsZXMuaW5kZXhPZihhbGxlbGUxKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsZWxlMSAmJiAoY2hhbmdlYWJsZUFsbGVsZXMxLmluZGV4T2YoYWxsZWxlMSkgPiAtMSB8fFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VhYmxlQWxsZWxlczEuaW5kZXhPZihhbGxlbGUxLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAob3JnMkFsbGVsZXMuaW5kZXhPZihhbGxlbGUyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsZWxlMiAmJiAoY2hhbmdlYWJsZUFsbGVsZXMyLmluZGV4T2YoYWxsZWxlMikgPiAtMSB8fFxuICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWFibGVBbGxlbGVzMi5pbmRleE9mKGFsbGVsZTIudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChqJTIgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMSArPSBzb2x1dGlvbk1vdmVzO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24yICs9IHNvbHV0aW9uTW92ZXM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IE1hdGgubWluKHNob3J0ZXN0UGF0aCwgTWF0aC5taW4obW92ZXNGb3JTb2x1dGlvbjEsIG1vdmVzRm9yU29sdXRpb24yKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb3ZlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgY2hhbmdlcywgaW5jbHVkaW5nIGFsbGVsZSBjaGFuZ2VzIGFuZCBzZXggY2hhbmdlcyxcbiAgICogcmVxdWlyZWQgdG8gbWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiB0aGUgJ3Rlc3RPcmdhbmlzbScgdG8gdGhhdCBvZiB0aGUgJ3RhcmdldE9yZ2FuaXNtJy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IHRlc3RPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0byB3aGljaCBjaGFuZ2VzIHdvdWxkIGFwcGx5XG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0YXJnZXRPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0aGF0IHNlcnZlcyBhcyBkZXN0aW5hdGlvblxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIHRvdGFsIG51bWJlciBvZiBjaGFuZ2VzIHJlcXVpcmVkIGZvciB0aGUgcGhlbm90eXBlcyB0byBtYXRjaFxuICAgKi9cbiAgc3RhdGljIG51bWJlck9mQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUodGVzdE9yZ2FuaXNtLCB0YXJnZXRPcmdhbmlzbSkge1xuICAgIHRlc3RPcmdhbmlzbSA9IHRoaXMuZW5zdXJlVmFsaWRPcmdhbmlzbSh0ZXN0T3JnYW5pc20pO1xuICAgIHRhcmdldE9yZ2FuaXNtID0gdGhpcy5lbnN1cmVWYWxpZE9yZ2FuaXNtKHRhcmdldE9yZ2FuaXNtKTtcblxuICAgIGxldCByZXF1aXJlZENoYW5nZUNvdW50ID0gR2VuZXRpY3NVdGlscy5udW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLmdlbmV0aWNzLmdlbm90eXBlLmFsbEFsbGVsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLnNwZWNpZXMudHJhaXRSdWxlcyk7XG4gICAgaWYgKHRlc3RPcmdhbmlzbS5zZXggIT09IHRhcmdldE9yZ2FuaXNtLnNleClcbiAgICAgICsrcmVxdWlyZWRDaGFuZ2VDb3VudDtcblxuICAgIHJldHVybiByZXF1aXJlZENoYW5nZUNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZXBhcmF0ZSBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCB0byBtYWtlIHRoZSBwaGVub3R5cGUgb2ZcbiAgICogdGhlIG9yZ2FuaXNtIGNoYXJhY3Rlcml6ZWQgYnkgJ3Rlc3RDaGFyYWN0ZXJzdGljcycgbWF0Y2ggdGhhdCBvZiB0aGUgb3JnYW5pc21cbiAgICogY2hhcmFjdGVyaXplZCBieSAndGFyZ2V0Q2hhcmFjdGVyaXN0aWNzJy4gQWRhcHRlZCBmcm9tOlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jb25jb3JkLWNvbnNvcnRpdW0vR2VuaXZlcnNlLVNwcm91dENvcmUvYmxvYi9tYXN0ZXIvZnJhbWV3b3Jrcy9nZW5pdmVyc2UvY29udHJvbGxlcnMvbWF0Y2guanNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHRlc3RDaGFyYWN0ZXJpc3RpY3MgLSB0aGUgY2hhcmFjdGVyaXN0aWNzIG9mIHRoZSB0ZXN0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3MgLSB0aGUgY2hhcmFjdGVyaXN0aWNzIG9mIHRoZSB0YXJnZXQgb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdGVzdEFsbGVsZXMgLSB0aGUgYXJyYXkgb2YgYWxsZWxlcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdHJhaXRSdWxlcyAtIHRoZSB0cmFpdFJ1bGVzIG9mIHRoZSBCaW9Mb2dpY2EuU3BlY2llcyBvZiB0aGUgb3JnYW5pc21zXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSB0aGUgbnVtYmVyIG9mIGFsbGVsZSBjaGFuZ2VzIHJlcXVpcmVkIGZvciB0aGUgcGhlbm90eXBlcyB0byBtYXRjaFxuICAgKi9cbiAgc3RhdGljIG51bWJlck9mQWxsZWxlQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUodGVzdENoYXJhY3RlcmlzdGljcywgdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzLCB0ZXN0QWxsZWxlcywgdHJhaXRSdWxlcykge1xuICAgIGNvbnN0IGFsbGVsZXMgPSB0ZXN0QWxsZWxlcztcbiAgICBsZXQgICBtb3ZlcyA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICAgIGlmICh0cmFpdFJ1bGVzLmhhc093blByb3BlcnR5KHRyYWl0KSkge1xuICAgICAgICBpZiAodGVzdENoYXJhY3RlcmlzdGljc1t0cmFpdF0gIT09IHRhcmdldENoYXJhY3RlcmlzdGljc1t0cmFpdF0pIHtcbiAgICAgICAgICAvLyBmaXJzdCB3ZSBoYXZlIHRvIHdvcmsgb3V0IHdoYXQgYWxsZWxlcyB0aGUgb3JpZ2luYWwgZHJha2UgaGFzIHRoYXQgY29ycmVzcG9uZCB0b1xuICAgICAgICAgIC8vIHRoZWlyIG5vbi1tYXRjaGluZyB0cmFpdFxuICAgICAgICAgIGNvbnN0IHBvc3NpYmxlVHJhaXRBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5jb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKTtcbiAgICAgICAgICBsZXQgICBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMgPSBbXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhbGxlbGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZVRyYWl0QWxsZWxlcy5pbmRleE9mKGFsbGVsZXNbaV0pID49IDApe1xuICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMucHVzaChhbGxlbGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbm93IHdvcmsgb3V0IHRoZSBzbWFsbGVzdCBudW1iZXIgb2Ygc3RlcHMgdG8gZ2V0IGZyb20gdGhlcmUgdG8gdGhlIGRlc2lyZWQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVNvbHV0aW9ucyA9IHRyYWl0UnVsZXNbdHJhaXRdW3RhcmdldENoYXJhY3RlcmlzdGljc1t0cmFpdF1dO1xuICAgICAgICAgIGxldCAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IEluZmluaXR5O1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHBvc3NpYmxlU29sdXRpb25zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzb2x1dGlvbiA9IHBvc3NpYmxlU29sdXRpb25zW2ldLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMubGVuZ3RoOyBqIDwgamo7IGorKyl7XG4gICAgICAgICAgICAgIGlmIChzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSkgPT09IC0xKXtcbiAgICAgICAgICAgICAgICBwYXRoTGVuZ3RoKys7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc29sdXRpb24uc3BsaWNlKHNvbHV0aW9uLmluZGV4T2YoY2hhcmFjdGVyaXN0aWNBbGxlbGVzW2pdKSwgMSk7IC8vIGFscmVhZHkgbWF0Y2hlZCB0aGlzIG9uZSwgY2FuJ3QgbWF0Y2ggaXQgYWdhaW5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoTGVuZ3RoID0gKHBhdGhMZW5ndGggPCBzaG9ydGVzdFBhdGhMZW5ndGgpID8gcGF0aExlbmd0aCA6IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZXMgKz0gc2hvcnRlc3RQYXRoTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb3ZlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGFsbGVsZXMgcHJlc2VudCBpbiB0aGUgZnVsbHkgc3BlY2lmaWVkIG9yZ2FuaXNtLCBidXQgbm90IGluXG4gICAqIHRoZSBwYXJ0aWFsbHkgc3BlY2lmaWVkIG9yZ2FuaXNtLiBGb3IgZXhhbXBsZSwgaWYgYSBmZW1hbGUgYW5kIG1hbGUgb3JnYW5pc20gYXJlIGdpdmVuLCB0aGUgcmV0dXJuZWQgc3RyaW5nXG4gICAqIHdpbGwgcmVwcmVzZW50IHRoZSBzZXgtbGlua2VkIGNocm9tb3NvbWVzIHRoYXQgdGhlIG1hbGUgb3JnYW5pc20gbGFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmdWxseVNwZWNpZmllZE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIGNvbnRhaW5pbmcgdGhlIGV4dHJhIGFsbGVsZXNcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcnRpYWxseVNwZWNpZmllZE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIGxhY2tpbmcgdGhlIGV4dHJhIGFsbGVsZXNcbiAgICogQHJldHVybiB7c3RyaW5nfSAtIGEgY29tbWEtc2VwYXJhdGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV4dHJhIGFsbGVsZXMsIGUuZy4gXCJiOkQsYjpCb2csYjpyaFwiXG4gICAqL1xuICBzdGF0aWMgY29tcHV0ZUV4dHJhQWxsZWxlcyhmdWxseVNwZWNpZmllZE9yZ2FuaXNtLCBwYXJ0aWFsbHlTcGVjaWZpZWRPcmdhbmlzbSkge1xuICAgIGxldCBmdWxsQWxsZWxlcyA9IGZ1bGx5U3BlY2lmaWVkT3JnYW5pc20uZ2V0QWxsZWxlU3RyaW5nKCkuc3BsaXQoXCIsXCIpO1xuICAgIGxldCBwYXJ0aWFsQWxsZWxlcyA9IHBhcnRpYWxseVNwZWNpZmllZE9yZ2FuaXNtLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KFwiLFwiKTtcbiAgICBsZXQgZXh0cmFBbGxlbGVzID0gZnVsbEFsbGVsZXMuZmlsdGVyKGZ1bmN0aW9uKGFsbGVsZSkgeyByZXR1cm4gcGFydGlhbEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID09PSAtMTsgfSk7XG4gICAgcmV0dXJuIGV4dHJhQWxsZWxlcy5qb2luKFwiLFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHb2VzIHRocm91Z2ggdGhlIHRyYWl0UnVsZXMgdG8gZmluZCBvdXQgd2hhdCB1bmlxdWUgYWxsZWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGVhY2ggdHJhaXRcbiAgICogZS5nLiBGb3IgXCJ0YWlsXCIgaXQgd2lsbCByZXR1cm4gW1wiVFwiLCBcIlRrXCIsIFwidFwiXS4gQWRhcHRlZCBmcm9tOlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jb25jb3JkLWNvbnNvcnRpdW0vR2VuaXZlcnNlLVNwcm91dENvcmUvYmxvYi9tYXN0ZXIvZnJhbWV3b3Jrcy9nZW5pdmVyc2UvY29udHJvbGxlcnMvbWF0Y2guanNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYWl0IC0gbmFtZSBvZiB0cmFpdCwgZS5nLiBcInRhaWxcIlxuICAgKiBAcGFyYW0ge29iamVjdH0gdHJhaXRSdWxlcyAtIHRoZSB0cmFpdFJ1bGVzIG9mIHRoZSBCaW9Mb2dpY2EuU3BlY2llcyB3aG9zZSB0cmFpdHMgYXJlIG9mIGludGVyZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ1tdfSAtIGFycmF5IG9mIGFsbGVsZSBzdHJpbmdzLCBlLmcuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl1cbiAgICovXG4gIHN0YXRpYyBfcG9zc2libGVBbGxlbGVzRm9yVHJhaXQgPSB7fTtcbiAgc3RhdGljIGNvbGxlY3RBbGxBbGxlbGVzRm9yVHJhaXQodHJhaXQsIHRyYWl0UnVsZXMpIHtcbiAgICBpZiAoR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdKSB7XG4gICAgICByZXR1cm4gR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdO1xuICAgIH1cblxuICAgIGxldCBhbGxlbGVzSGFzaCA9IHt9LFxuICAgICAgICBhbGxlbGVzICAgICA9IFtdO1xuICAgIGZvciAoY29uc3QgY2hhcmFjdGVyaXN0aWMgaW4gdHJhaXRSdWxlc1t0cmFpdF0pe1xuICAgICAgICBmb3IgKGNvbnN0IHBvc3NpYmlsZUFsbGVsZXNDb21ibyBpbiB0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY10pIHtcbiAgICAgICAgICBpZiAodHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdLmhhc093blByb3BlcnR5KHBvc3NpYmlsZUFsbGVsZXNDb21ibykpe1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib10ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICBhbGxlbGVzSGFzaFt0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY11bcG9zc2liaWxlQWxsZWxlc0NvbWJvXVtpXV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgYWxsZWxlIGluIGFsbGVsZXNIYXNoKXtcbiAgICAgIGFsbGVsZXMucHVzaChhbGxlbGUpO1xuICAgIH1cblxuICAgIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSA9IGFsbGVsZXM7ICAvLyBzdG9yZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHJlY2FsY3VsYXRlIGl0XG4gICAgcmV0dXJuIGFsbGVsZXM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBEcmFrZSBvYmplY3QgaW50byBhIEJpb2xvZ2ljYSBvcmdhbmlzbS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGRyYWtlIC0gdGhlIGRyYWtlIHRvIGNvbnZlcnRcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IHRoZSBkcmFrZSBhcyBhbiBPcmdhbmlzbVxuICAgKi9cbiAgc3RhdGljIGNvbnZlcnREcmFrZVRvT3JnKGRyYWtlKSB7XG4gICAgcmV0dXJuIG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGRyYWtlLmFsbGVsZVN0cmluZywgZHJha2Uuc2V4KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAvLyBDaGFsbGVuZ2UgaW5zdHJ1Y3Rpb25zXG4gIFwifkZWX0VHR19HQU1FLkJSRUVEX0JVVFRPTlwiOiBcIkJSRUVEXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIGluc3RydWN0aW9uc1xuICBcIn5FR0dfR0FNRV8zLkNIUk9NT1NPTUVTX1RJVExFXCI6IFwiQ2hyb21vc29tZXNcIixcbiAgXCJ+RUdHX0dBTUVfMy5JTlNUUlVDVElPTlNfVElUTEVcIjogXCJJbnN0cnVjdGlvbnNcIixcbiAgXCJ+RUdHX0dBTUVfMy5JTlNUUl9IRUFESU5HXCI6IFwiU29ydCB0aGVzZSBlZ2dzIVwiLFxuICBcIn5FR0dfR0FNRV8zLklOU1RSX0lURU0xXCI6IFwiU2NvcGUgYW4gZWdnIHRvIHNlZSBhIGJhYnkncyBjaHJvbW9zb21lcy5cIixcbiAgXCJ+RUdHX0dBTUVfMy5JTlNUUl9JVEVNMlwiOiBcIkNsaWNrIHRoZSBjb3JyZWN0IGJhc2tldCBmb3IgdGhlIGVnZy5cIixcblxuICAvLyBDaGFsbGVuZ2UgcG9wdXAgYWxlcnRzXG4gIFwifkFMRVJULlRJVExFLkdPT0RfV09SS1wiOiBcIkdvb2Qgd29yayFcIixcbiAgXCJ+QUxFUlQuVElUTEUuTUlTU0lPTl9BQ0NPTVBMSVNIRURcIjogXCJNaXNzaW9uIEFjY29tcGxpc2hlZCFcIixcbiAgXCJ+QUxFUlQuVElUTEUuSU5DT1JSRUNUX0RSQUtFXCI6IFwiVGhhdCdzIG5vdCB0aGUgZHJha2UhXCIsXG4gIFwifkFMRVJULlRJVExFLkVHR19NSVNNQVRDSFwiOiBcIlRoYXQgZWdnIGRvZXNuJ3QgYmVsb25nIVwiLFxuICBcIn5BTEVSVC5USVRMRS5NSVNUQUtFXCI6IFwiVWggb2ghXCIsXG4gIFwifkFMRVJULk5FV19QSUVDRV9PRl9DT0lOXCI6IFwiWW91IGVhcm5lZCBhICR7MH0gcGllY2Ugb2YgdGhlIGNvaW4hXCIsXG4gIFwifkFMRVJULkFXQVJEX0xFVkVMX0dPTERcIjogXCJnb2xkXCIsXG4gIFwifkFMRVJULkFXQVJEX0xFVkVMX1NJTFZFUlwiOiBcInNpbHZlclwiLFxuICBcIn5BTEVSVC5BV0FSRF9MRVZFTF9CUk9OWkVcIjogXCJicm9uemVcIixcbiAgXCJ+QUxFUlQuQ09NUExFVEVfQ09JTlwiOiBcIllvdSBoYXZlIGVhcm5lZCBhbGwgdGhlIHBpZWNlcyBvZiB0aGlzIGNvaW4hXCIsXG4gIFwifkFMRVJULkNPTVBMRVRFX0xBU1RfTUlTU0lPTlwiOiBcIllvdSBoYXZlIGNvbXBsZXRlZCB0aGUgbGFzdCBtaXNzaW9uIVwiLFxuICBcIn5BTEVSVC5DT1JSRUNUX0RSQUtFXCI6IFwiVGhlIGRyYWtlIHlvdSBoYXZlIGNyZWF0ZWQgbWF0Y2hlcyB0aGUgdGFyZ2V0IGRyYWtlLlwiLFxuICBcIn5BTEVSVC5JTkNPUlJFQ1RfRFJBS0VcIjogXCJUaGUgZHJha2UgeW91IGhhdmUgY3JlYXRlZCBkb2Vzbid0IG1hdGNoIHRoZSB0YXJnZXQgZHJha2UuXFxuXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBiZWxvbmdzIGluIHRoYXQgYmFza2V0LlwiLFxuICBcIn5BTEVSVC5FR0dfQkFTS0VUX01JU01BVENIXCI6IFwiVGhlIGVnZyB5b3UgaGF2ZSBzZWxlY3RlZCBkb2Vzbid0IGJlbG9uZyBpbiB0aGF0IGJhc2tldC5cIixcbiAgXCJ+QUxFUlQuRFVQTElDQVRFX0RSQUtFXCI6IFwiWW91IGFscmVhZHkgaGF2ZSBhIGRyYWtlIHRoYXQgbG9va3MganVzdCBsaWtlIHRoYXQhXCIsXG5cbiAgLy8gQ2hhbGxlbmdlIGJ1dHRvbnNcbiAgXCJ+QlVUVE9OLk9LXCI6IFwiT0tcIixcbiAgXCJ+QlVUVE9OLlRSWV9BR0FJTlwiOiBcIlRyeSBhZ2FpblwiLFxuICBcIn5CVVRUT04uVFJZX0FOT1RIRVJfRUdHXCI6IFwiVHJ5IGFub3RoZXIgZWdnIVwiLFxuICBcIn5CVVRUT04uUkVUUllfQ0hBTExFTkdFXCI6IFwiUmV0cnkgY2hhbGxlbmdlXCIsXG4gIFwifkJVVFRPTi5SRVRSWV9NSVNTSU9OXCI6IFwiUmV0cnkgbWlzc2lvblwiLFxuICBcIn5CVVRUT04uQ09OVElOVUVcIjogXCJDb250aW51ZVwiLFxuICBcIn5CVVRUT04uTkVYVF9UUklBTFwiOiBcIk5leHQgdHJpYWxcIixcbiAgXCJ+QlVUVE9OLk5FWFRfQ0hBTExFTkdFXCI6IFwiTmV4dCBjaGFsbGVuZ2VcIixcbiAgXCJ+QlVUVE9OLkVORF9NSVNTSU9OXCI6IFwiRW5kIG1pc3Npb25cIixcbiAgXCJ+QlVUVE9OLk5FWFRfTUlTU0lPTlwiOiBcIk5leHQgbWlzc2lvblwiLFxuICBcIn5CVVRUT04uUExBWUdST1VORF9NT1ZFX0ZPUldBUkRcIjogXCJCcmluZyBJdCBPbiFcIixcbiAgXCJ+QlVUVE9OLkNIRUNLX0RSQUtFXCI6IFwiQ2hlY2sgRHJha2VcIixcbiAgXCJ+QlVUVE9OLkhBVENIX0RSQUtFXCI6IFwiSGF0Y2ggRHJha2VcIixcbiAgXCJ+QlVUVE9OLlNBVkVfRFJBS0VcIjogXCJTYXZlIHRoaXNcIixcbiAgXCJ+QlVUVE9OLlNVQk1JVFwiOiBcIlN1Ym1pdFwiLFxuICBcIn5CVVRUT04uUkVTRVRcIjogXCJSZXNldFwiLFxuICBcIn5CVVRUT04uRkVSVElMSVpFX0RJU0FCTEVEXCI6IFwiTWFrZSBhIGJhYnlcIixcbiAgXCJ+QlVUVE9OLkZFUlRJTElaRVwiOiBcIk1ha2UgYSBiYWJ5ISDinaTvuI9cIixcbiAgXCJ+QlVUVE9OLk1BTEVcIjogXCJNYWxlXCIsXG4gIFwifkJVVFRPTi5GRU1BTEVcIjogXCJGZW1hbGVcIixcblxuICBcIn5MQUJFTC5ZT1VSX0RSQUtFXCI6IFwiWW91ciBEcmFrZVwiLFxuICBcIn5MQUJFTC5UQVJHRVRfRFJBS0VcIjogXCJUYXJnZXQgRHJha2VcIixcblxuICBcIn5MRVZFTF9JTkRJQ0FUT1IuTEVWRUxfTEFCRUxcIjogXCJMRVZFTFwiLFxuXG4gIFwifkNPVU5URVIuVFJJQUxfTEFCRUxcIjogXCJUUklBTFwiLFxuICBcIn5DT1VOVEVSLlNDT1JFX0xBQkVMXCI6IFwiU0NPUkVcIixcbiAgXCJ+Q09VTlRFUi5uX09GX05cIjogXCIkezB9XFx4QTBcXHhBMG9mXFx4QTBcXHhBMCR7MX1cIixcblxuICAvLyBNZXNzYWdlcyBmcm9tIElUU1xuICBcIn5JVFMuR1JFRVRJTkdcIjogXCJIaSB0aGVyZSB1c2VyIVwiXG59O1xuIiwiaW1wb3J0IGVuX3VzIGZyb20gJy4vZW4tdXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGVuX3VzXG59O1xuIiwiaW1wb3J0IHRyYW5zbGF0aW9ucyBmcm9tICcuL2xhbmcnO1xuXG5jb25zdCBkZWZhdWx0TGFuZyA9IFwiZW5fdXNcIixcbiAgICAgIHZhclJlZ0V4cCA9IC9cXCRcXHtcXHMqKFxcZCspXFxzKlxcfS9nLFxuICAgICAgZXJyb3IgPSBcIioqIFRSQU5TTEFUSU9OIEVSUk9SICoqXCI7XG5cbmNvbnN0IHRyYW5zbGF0ZVN0cmluZyA9IChrZXksIGxhbmcpID0+IHRyYW5zbGF0aW9uc1tsYW5nXSAmJiB0cmFuc2xhdGlvbnNbbGFuZ11ba2V5XSB8fCBrZXk7XG5cbi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIGlmIHRoZXkgZXhpc3QgaW4gdGhlIGxhbmd1YWdlIGZpbGUuIE90aGVyd2lzZSwgcGFzc2VzIGJhY2tcbiAqIHN0cmluZyB1bmNoYW5nZWQuXG4gKiBZb3UgY2FuIGFsc28gcGFzcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB3aGVyZSB0aGUgZmlyc3QgaXMgdGhlIG1haW4gdGV4dCwgYW5kXG4gKiB0aGUgb3RoZXJzIGFyZSB2YXJpYWJsZXMgdG8gYmUgcGxhY2VkIGluIHRoZSBzdHJpbmc6XG4gKiAgIFtcIkdvb2QgJHswfSwgJHsxfVwiLCBcImV2ZW5pbmdcIiwgXCJVc2VyXCJdXG4gKiB3aWxsIHJldHVybiBcIkdvb2QgZXZlbmluZywgVXNlclwiLiBFYWNoIHN0cmluZyBpbiB0aGUgYXJyYXkgbWF5IG9wdGlvbmFsbHkgYmVcbiAqIGluIHRoZSBsYW5ndWFnZSBmaWxlOlxuICogICBbXCJ+VElNRV9TRU5TSVRJVkVfR1JFRVRJTkdcIiwgXCJ+VElNRS5FVkVOSU5HXCIsIFwiVXNlclwiXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2xhdGUoa2V5LCBsYW5nPWRlZmF1bHRMYW5nKSB7XG4gIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIHRyYW5zbGF0ZVN0cmluZyhrZXksIGxhbmcpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgIGxldCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0ZVN0cmluZyhrZXlbMF0sIGxhbmcpO1xuICAgIHJldHVybiB0cmFuc2xhdGlvbi5yZXBsYWNlKHZhclJlZ0V4cCwgKG1hdGNoLCBpZCkgPT5cbiAgICAgIGtleVsrK2lkXSA/IHRyYW5zbGF0ZVN0cmluZyhrZXlbaWRdLCBsYW5nKSA6IGVycm9yKTtcbiAgfSBlbHNlIGlmIChrZXkgIT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IHRyYW5zbGF0ZTogXCIsIGtleSk7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuIl19
