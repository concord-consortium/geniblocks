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
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
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
    var timeout = setTimeout(cleanUpNextTick);
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
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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
/*eslint-disable react/prop-types */
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _reactPropTypesLibMountable = require('react-prop-types/lib/mountable');

var _reactPropTypesLibMountable2 = _interopRequireDefault(_reactPropTypesLibMountable);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _Portal = require('./Portal');

var _Portal2 = _interopRequireDefault(_Portal);

var _ModalManager = require('./ModalManager');

var _ModalManager2 = _interopRequireDefault(_ModalManager);

var _utilsOwnerDocument = require('./utils/ownerDocument');

var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);

var _utilsAddEventListener = require('./utils/addEventListener');

var _utilsAddEventListener2 = _interopRequireDefault(_utilsAddEventListener);

var _utilsAddFocusListener = require('./utils/addFocusListener');

var _utilsAddFocusListener2 = _interopRequireDefault(_utilsAddFocusListener);

var _domHelpersUtilInDOM = require('dom-helpers/util/inDOM');

var _domHelpersUtilInDOM2 = _interopRequireDefault(_domHelpersUtilInDOM);

var _domHelpersActiveElement = require('dom-helpers/activeElement');

var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);

var _domHelpersQueryContains = require('dom-helpers/query/contains');

var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

var _utilsGetContainer = require('./utils/getContainer');

var _utilsGetContainer2 = _interopRequireDefault(_utilsGetContainer);

var modalManager = new _ModalManager2['default']();

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
var Modal = _react2['default'].createClass({
  displayName: 'Modal',

  propTypes: _extends({}, _Portal2['default'].propTypes, {

    /**
     * Set the visibility of the Modal
     */
    show: _react2['default'].PropTypes.bool,

    /**
     * A Node, Component instance, or function that returns either. The Modal is appended to it's container element.
     *
     * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
     * page content can be placed behind a virtual backdrop as well as a visual one.
     */
    container: _react2['default'].PropTypes.oneOfType([_reactPropTypesLibMountable2['default'], _react2['default'].PropTypes.func]),

    /**
     * A callback fired when the Modal is opening.
     */
    onShow: _react2['default'].PropTypes.func,

    /**
     * A callback fired when either the backdrop is clicked, or the escape key is pressed.
     *
     * The `onHide` callback only signals intent from the Modal,
     * you must actually set the `show` prop to `false` for the Modal to close.
     */
    onHide: _react2['default'].PropTypes.func,

    /**
     * Include a backdrop component.
     */
    backdrop: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.oneOf(['static'])]),

    /**
     * A callback fired when the escape key, if specified in `keyboard`, is pressed.
     */
    onEscapeKeyUp: _react2['default'].PropTypes.func,

    /**
     * A callback fired when the backdrop, if specified, is clicked.
     */
    onBackdropClick: _react2['default'].PropTypes.func,

    /**
     * A style object for the backdrop component.
     */
    backdropStyle: _react2['default'].PropTypes.object,

    /**
     * A css class or classes for the backdrop component.
     */
    backdropClassName: _react2['default'].PropTypes.string,

    /**
     * A css class or set of classes applied to the modal container when the modal is open,
     * and removed when it is closed.
     */
    containerClassName: _react2['default'].PropTypes.string,

    /**
     * Close the modal when escape key is pressed
     */
    keyboard: _react2['default'].PropTypes.bool,

    /**
     * A `<Transition/>` component to use for the dialog and backdrop components.
     */
    transition: _reactPropTypesLibElementType2['default'],

    /**
     * The `timeout` of the dialog transition if specified. This number is used to ensure that
     * transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    dialogTransitionTimeout: _react2['default'].PropTypes.number,

    /**
     * The `timeout` of the backdrop transition if specified. This number is used to
     * ensure that transition callbacks are always fired, even if browser transition events are canceled.
     *
     * See the Transition `timeout` prop for more infomation.
     */
    backdropTransitionTimeout: _react2['default'].PropTypes.number,

    /**
     * When `true` The modal will automatically shift focus to itself when it opens, and
     * replace it to the last focused element when it closes. This also
     * works correctly with any Modal children that have the `autoFocus` prop.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    autoFocus: _react2['default'].PropTypes.bool,

    /**
     * When `true` The modal will prevent focus from leaving the Modal while open.
     *
     * Generally this should never be set to `false` as it makes the Modal less
     * accessible to assistive technologies, like screen readers.
     */
    enforceFocus: _react2['default'].PropTypes.bool,

    /**
     * Callback fired before the Modal transitions in
     */
    onEnter: _react2['default'].PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition in
     */
    onEntering: _react2['default'].PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning in
     */
    onEntered: _react2['default'].PropTypes.func,

    /**
     * Callback fired right before the Modal transitions out
     */
    onExit: _react2['default'].PropTypes.func,

    /**
     * Callback fired as the Modal begins to transition out
     */
    onExiting: _react2['default'].PropTypes.func,

    /**
     * Callback fired after the Modal finishes transitioning out
     */
    onExited: _react2['default'].PropTypes.func

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
    var children = _props.children;
    var Transition = _props.transition;
    var backdrop = _props.backdrop;
    var dialogTransitionTimeout = _props.dialogTransitionTimeout;

    var props = _objectWithoutProperties(_props, ['children', 'transition', 'backdrop', 'dialogTransitionTimeout']);

    var onExit = props.onExit;
    var onExiting = props.onExiting;
    var onEnter = props.onEnter;
    var onEntering = props.onEntering;
    var onEntered = props.onEntered;

    var show = !!props.show;
    var dialog = _react2['default'].Children.only(this.props.children);

    var mountModal = show || Transition && !this.state.exited;

    if (!mountModal) {
      return null;
    }

    var _dialog$props = dialog.props;
    var role = _dialog$props.role;
    var tabIndex = _dialog$props.tabIndex;

    if (role === undefined || tabIndex === undefined) {
      dialog = _react.cloneElement(dialog, {
        role: role === undefined ? 'document' : role,
        tabIndex: tabIndex == null ? '-1' : tabIndex
      });
    }

    if (Transition) {
      dialog = _react2['default'].createElement(
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

    return _react2['default'].createElement(
      _Portal2['default'],
      {
        ref: this.setMountNode,
        container: props.container
      },
      _react2['default'].createElement(
        'div',
        {
          ref: 'modal',
          role: props.role || 'dialog',
          style: props.style,
          className: props.className
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

    var backdrop = _react2['default'].createElement('div', { ref: 'backdrop',
      style: this.props.backdropStyle,
      className: this.props.backdropClassName,
      onClick: this.handleBackdropClick
    });

    if (Transition) {
      backdrop = _react2['default'].createElement(
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
    if (nextProps.show) {
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
    var doc = _utilsOwnerDocument2['default'](this);
    var container = _utilsGetContainer2['default'](this.props.container, doc.body);

    modalManager.add(this, container, this.props.containerClassName);

    this._onDocumentKeyupListener = _utilsAddEventListener2['default'](doc, 'keyup', this.handleDocumentKeyUp);

    this._onFocusinListener = _utilsAddFocusListener2['default'](this.enforceFocus);

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
    if (_domHelpersUtilInDOM2['default']) {
      this.lastFocus = _domHelpersActiveElement2['default']();
    }
  },

  focus: function focus() {
    var autoFocus = this.props.autoFocus;
    var modalContent = this.getDialogElement();
    var current = _domHelpersActiveElement2['default'](_utilsOwnerDocument2['default'](this));
    var focusInModal = current && _domHelpersQueryContains2['default'](modalContent, current);

    if (modalContent && autoFocus && !focusInModal) {
      this.lastFocus = current;

      if (!modalContent.hasAttribute('tabIndex')) {
        modalContent.setAttribute('tabIndex', -1);
        _warning2['default'](false, 'The modal content node does not accept focus. ' + 'For the benefit of assistive technologies, the tabIndex of the node is being set to "-1".');
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

    var active = _domHelpersActiveElement2['default'](_utilsOwnerDocument2['default'](this));
    var modal = this.getDialogElement();

    if (modal && modal !== active && !_domHelpersQueryContains2['default'](modal, active)) {
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

exports['default'] = Modal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ModalManager":37,"./Portal":38,"./utils/addEventListener":39,"./utils/addFocusListener":40,"./utils/getContainer":41,"./utils/ownerDocument":44,"dom-helpers/activeElement":1,"dom-helpers/query/contains":9,"dom-helpers/util/inDOM":19,"react-prop-types/lib/elementType":46,"react-prop-types/lib/mountable":47,"warning":49}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _domHelpersStyle = require('dom-helpers/style');

var _domHelpersStyle2 = _interopRequireDefault(_domHelpersStyle);

var _domHelpersClass = require('dom-helpers/class');

var _domHelpersClass2 = _interopRequireDefault(_domHelpersClass);

var _domHelpersUtilScrollbarSize = require('dom-helpers/util/scrollbarSize');

var _domHelpersUtilScrollbarSize2 = _interopRequireDefault(_domHelpersUtilScrollbarSize);

var _utilsIsOverflowing = require('./utils/isOverflowing');

var _utilsIsOverflowing2 = _interopRequireDefault(_utilsIsOverflowing);

var _utilsManageAriaHidden = require('./utils/manageAriaHidden');

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

var ModalManager = (function () {
  function ModalManager() {
    var hideSiblingNodes = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    _classCallCheck(this, ModalManager);

    this.hideSiblingNodes = hideSiblingNodes;
    this.modals = [];
    this.containers = [];
    this.data = [];
  }

  ModalManager.prototype.add = function add(modal, container, className) {
    var modalIdx = this.modals.indexOf(modal);
    var containerIdx = this.containers.indexOf(container);

    if (modalIdx !== -1) {
      return modalIdx;
    }

    modalIdx = this.modals.length;
    this.modals.push(modal);

    if (this.hideSiblingNodes) {
      _utilsManageAriaHidden.hideSiblings(container, modal.mountNode);
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

    data.overflowing = _utilsIsOverflowing2['default'](container);

    if (data.overflowing) {
      // use computed style, here to get the real padding
      // to add our scrollbar width
      style.paddingRight = parseInt(_domHelpersStyle2['default'](container, 'paddingRight') || 0, 10) + _domHelpersUtilScrollbarSize2['default']() + 'px';
    }

    _domHelpersStyle2['default'](container, style);

    data.classes.forEach(_domHelpersClass2['default'].addClass.bind(null, container));

    this.containers.push(container);
    this.data.push(data);

    return modalIdx;
  };

  ModalManager.prototype.remove = function remove(modal) {
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

      data.classes.forEach(_domHelpersClass2['default'].removeClass.bind(null, container));

      if (this.hideSiblingNodes) {
        _utilsManageAriaHidden.showSiblings(container, modal.mountNode);
      }
      this.containers.splice(containerIdx, 1);
      this.data.splice(containerIdx, 1);
    } else if (this.hideSiblingNodes) {
      //otherwise make sure the next top modal is visible to a SR
      _utilsManageAriaHidden.ariaHidden(false, data.modals[data.modals.length - 1].mountNode);
    }
  };

  ModalManager.prototype.isTopModal = function isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  };

  return ModalManager;
})();

exports['default'] = ModalManager;
module.exports = exports['default'];
},{"./utils/isOverflowing":42,"./utils/manageAriaHidden":43,"dom-helpers/class":4,"dom-helpers/style":12,"dom-helpers/util/scrollbarSize":20}],38:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactPropTypesLibMountable = require('react-prop-types/lib/mountable');

var _reactPropTypesLibMountable2 = _interopRequireDefault(_reactPropTypesLibMountable);

var _utilsOwnerDocument = require('./utils/ownerDocument');

var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);

var _utilsGetContainer = require('./utils/getContainer');

var _utilsGetContainer2 = _interopRequireDefault(_utilsGetContainer);

/**
 * The `<Portal/>` component renders its children into a new "subtree" outside of current component hierarchy.
 * You can think of it as a declarative `appendChild()`, or jQuery's `$.fn.appendTo()`.
 * The children of `<Portal/>` component will be appended to the `container` specified.
 */
var Portal = _react2['default'].createClass({

  displayName: 'Portal',

  propTypes: {
    /**
     * A Node, Component instance, or function that returns either. The `container` will have the Portal children
     * appended to it.
     */
    container: _react2['default'].PropTypes.oneOfType([_reactPropTypesLibMountable2['default'], _react2['default'].PropTypes.func])
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
      this._portalContainerNode = _utilsGetContainer2['default'](nextProps.container, _utilsOwnerDocument2['default'](this).body);
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
      this._portalContainerNode = _utilsGetContainer2['default'](this.props.container, _utilsOwnerDocument2['default'](this).body);
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

    var overlay = !this.props.children ? null : _react2['default'].Children.only(this.props.children);

    // Save reference for future access.
    if (overlay !== null) {
      this._mountOverlayTarget();
      this._overlayInstance = _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, overlay, this._overlayTarget);
    } else {
      // Unrender if the component is null for transitions to null
      this._unrenderOverlay();
      this._unmountOverlayTarget();
    }
  },

  _unrenderOverlay: function _unrenderOverlay() {
    if (this._overlayTarget) {
      _reactDom2['default'].unmountComponentAtNode(this._overlayTarget);
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
        return _reactDom2['default'].findDOMNode(this._overlayInstance);
      }
    }

    return null;
  }

});

exports['default'] = Portal;
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/getContainer":41,"./utils/ownerDocument":44,"react-prop-types/lib/mountable":47}],39:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domHelpersEventsOn = require('dom-helpers/events/on');

var _domHelpersEventsOn2 = _interopRequireDefault(_domHelpersEventsOn);

var _domHelpersEventsOff = require('dom-helpers/events/off');

var _domHelpersEventsOff2 = _interopRequireDefault(_domHelpersEventsOff);

exports['default'] = function (node, event, handler) {
  _domHelpersEventsOn2['default'](node, event, handler);
  return {
    remove: function remove() {
      _domHelpersEventsOff2['default'](node, event, handler);
    }
  };
};

module.exports = exports['default'];
},{"dom-helpers/events/off":6,"dom-helpers/events/on":7}],40:[function(require,module,exports){
/**
 * Firefox doesn't have a focusin event so using capture is easiest way to get bubbling
 * IE8 can't do addEventListener, but does have onfocusin, so we use that in ie8
 *
 * We only allow one Listener at a time to avoid stack overflows
 */
'use strict';

exports.__esModule = true;
exports['default'] = addFocusListener;

function addFocusListener(handler) {
  var useFocusin = !document.addEventListener;
  var remove = undefined;

  if (useFocusin) {
    document.attachEvent('onfocusin', handler);
    remove = function () {
      return document.detachEvent('onfocusin', handler);
    };
  } else {
    document.addEventListener('focus', handler, true);
    remove = function () {
      return document.removeEventListener('focus', handler, true);
    };
  }

  return { remove: remove };
}

module.exports = exports['default'];
},{}],41:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
exports['default'] = getContainer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

function getContainer(container, defaultContainer) {
  container = typeof container === 'function' ? container() : container;
  return _reactDom2['default'].findDOMNode(container) || defaultContainer;
}

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],42:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = isOverflowing;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _domHelpersQueryIsWindow = require('dom-helpers/query/isWindow');

var _domHelpersQueryIsWindow2 = _interopRequireDefault(_domHelpersQueryIsWindow);

var _domHelpersOwnerDocument = require('dom-helpers/ownerDocument');

var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

function isBody(node) {
  return node && node.tagName.toLowerCase() === 'body';
}

function bodyIsOverflowing(node) {
  var doc = _domHelpersOwnerDocument2['default'](node);
  var win = _domHelpersQueryIsWindow2['default'](doc);
  var fullWidth = win.innerWidth;

  // Support: ie8, no innerWidth
  if (!fullWidth) {
    var documentElementRect = doc.documentElement.getBoundingClientRect();
    fullWidth = documentElementRect.right - Math.abs(documentElementRect.left);
  }

  return doc.body.clientWidth < fullWidth;
}

function isOverflowing(container) {
  var win = _domHelpersQueryIsWindow2['default'](container);

  return win || isBody(container) ? bodyIsOverflowing(container) : container.scrollHeight > container.clientHeight;
}

module.exports = exports['default'];
},{"dom-helpers/ownerDocument":8,"dom-helpers/query/isWindow":10}],43:[function(require,module,exports){
'use strict';

exports.__esModule = true;
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

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _domHelpersOwnerDocument = require('dom-helpers/ownerDocument');

var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

exports['default'] = function (componentOrElement) {
  return _domHelpersOwnerDocument2['default'](_reactDom2['default'].findDOMNode(componentOrElement));
};

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"dom-helpers/ownerDocument":8}],45:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.errMsg = errMsg;
exports.createChainableTypeChecker = createChainableTypeChecker;

function errMsg(props, propName, componentName, msgContinuation) {
  return 'Invalid prop \'' + propName + '\' of value \'' + props[propName] + '\'' + (' supplied to \'' + componentName + '\'' + msgContinuation);
}

/**
 * Create chain-able isRequired validator
 *
 * Largely copied directly from:
 *  https://github.com/facebook/react/blob/0.11-stable/src/core/ReactPropTypes.js#L94
 */

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName) {
    componentName = componentName || '<<anonymous>>';
    if (props[propName] == null) {
      if (isRequired) {
        return new Error('Required prop \'' + propName + '\' was not specified in \'' + componentName + '\'.');
      }
    } else {
      return validate(props, propName, componentName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}
},{}],46:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _common = require('./common');

/**
 * Checks whether a prop provides a type of element.
 *
 * The type of element can be provided in two forms:
 * - tag name (string)
 * - a return value of React.createClass(...)
 *
 * @param props
 * @param propName
 * @param componentName
 * @returns {Error|undefined}
 */

function validate(props, propName, componentName) {
  var errBeginning = _common.errMsg(props, propName, componentName, '. Expected an Element `type`');

  if (typeof props[propName] !== 'function') {
    if (_react2['default'].isValidElement(props[propName])) {
      return new Error(errBeginning + ', not an actual Element');
    }

    if (typeof props[propName] !== 'string') {
      return new Error(errBeginning + ' such as a tag name or return value of React.createClass(...)');
    }
  }
}

exports['default'] = _common.createChainableTypeChecker(validate);
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./common":45}],47:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _common = require('./common');

/**
 * Checks whether a prop provides a DOM element
 *
 * The element can be provided in two forms:
 * - Directly passed
 * - Or passed an object that has a `render` method
 *
 * @param props
 * @param propName
 * @param componentName
 * @returns {Error|undefined}
 */

function validate(props, propName, componentName) {
  if (typeof props[propName] !== 'object' || typeof props[propName].render !== 'function' && props[propName].nodeType !== 1) {
    return new Error(_common.errMsg(props, propName, componentName, ', expected a DOM element or an object that has a `render` method'));
  }
}

exports['default'] = _common.createChainableTypeChecker(validate);
module.exports = exports['default'];
},{"./common":45}],48:[function(require,module,exports){
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
        return React.createElement(
          "label",
          { key: name },
          React.createElement("input", { type: "checkbox", key: name, value: allele,
            style: { "marginLeft": "8px" },
            defaultChecked: checked, onChange: handleChange }),
          name
        );
      });
      geneInputs.push(React.createElement(
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

  return React.createElement(
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
    svgShape = React.createElement("circle", { r: radius, cy: radius + 1, cx: radius + 1, strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  } else {
    svgShape = React.createElement("rect", { width: radius * 2, height: radius * 2, x: "1", y: "1", strokeWidth: strokeWidth, stroke: stroke, strokeDasharray: strokeDasharray, fill: fill });
  }

  return React.createElement(
    "svg",
    { width: width + 2, height: width + 2, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement(
      "g",
      null,
      svgShape,
      React.createElement(
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
  return React.createElement(
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
      return React.createElement(_gamete2.default, _extends({ id: id, display: interpolatedStyle }, others));
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

},{"./gamete":62,"react-motion":30}],53:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  return React.createElement(
    _reactMotion.Motion,
    { className: 'geniblocks animated-organism-view',
      defaultStyle: { opacity: opacityStart }, style: { opacity: opacityEnd }, onRest: onRest },
    function (interpolatedStyle) {
      var tStyle = _extends({}, style, interpolatedStyle);
      return React.createElement(_organism2.default, { org: org, id: id, width: width, style: tStyle, onClick: onClick });
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

},{"./organism":69,"react-motion":30}],54:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Button);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Button)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.suppressButtonFocusHighlight = function () {
      var noFocusHighlight = 'no-focus-highlight',
          button = _this.refs.button;
      if (button && button.className.indexOf(noFocusHighlight) < 0) button.className += ' ' + noFocusHighlight;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var label = _props.label;
      var others = _objectWithoutProperties(_props, ['className', 'label']);
      var classes = (className ? className + ' ' : '') + 'gb-button';

      var handleMouseEvent = function () {
        this.suppressButtonFocusHighlight();
      }.bind(this);

      return React.createElement(
        'button',
        _extends({ className: classes, ref: 'button' }, others, {
          onMouseEnter: handleMouseEvent,
          onMouseDown: handleMouseEvent }),
        label
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
}(React.Component);

Button.propTypes = {
  className: _react.PropTypes.string,
  label: _react.PropTypes.string.isRequired
};
exports.default = Button;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],55:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  var capSex = sex.substr(0, 1).toUpperCase() + sex.substr(1),
      selectedSexClass = sex === 'male' ? 'male-selected' : 'female-selected',
      BUTTON_IMAGE_WIDTH = 100,
      BUTTON_IMAGE_MIDPOINT_X = BUTTON_IMAGE_WIDTH / 2,
      imageStyle = _extends({ position: 'absolute' }, style),
      label = showLabel ? capSex + ' ' + species : '',
      labelElement = showLabel ? React.createElement(
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
    if (sex === 'male' !== clickX > BUTTON_IMAGE_MIDPOINT_X) onChange(sex === 'male' ? 'female' : 'male');
  }

  return React.createElement(
    'div',
    { id: id, style: { position: 'relative' } },
    React.createElement('div', { className: 'geniblocks change-sex-buttons ' + selectedSexClass,
      style: imageStyle, onClick: handleClick }),
    labelElement
  );
};

ChangeSexButtons.propTypes = {
  id: _react.PropTypes.string,
  sex: _react.PropTypes.oneOf(['male', 'female']).isRequired,
  species: _react.PropTypes.string,
  showLabel: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  onChange: _react.PropTypes.func.isRequired
};

exports.default = ChangeSexButtons;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],56:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var ChromosomeImageView = function ChromosomeImageView(_ref) {
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 23 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 126 : _ref$height;
  var _ref$color = _ref.color;
  var color = _ref$color === undefined ? '#FF9999' : _ref$color;

  var split = 45,
      radius = width / 2,
      imageWidth = width + 4,
      halfImageWidth = imageWidth / 2,
      imageHeight = height + 4;

  return React.createElement(
    'svg',
    { width: imageWidth, height: imageHeight, xmlns: 'http://www.w3.org/2000/svg' },
    React.createElement(
      'g',
      null,
      React.createElement('circle', { r: radius, cy: radius + 2, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('circle', { r: radius, cy: split - radius, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('circle', { r: radius, cy: split + radius, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('circle', { r: radius, cy: height - radius, cx: halfImageWidth, strokeWidth: '2', stroke: '#000000', fill: color }),
      React.createElement('rect', { height: split - radius - (radius + 2), width: width, y: radius + 2, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
      React.createElement('rect', { height: height - radius - (split + radius), width: width, y: split + radius, x: '2', strokeWidth: '0', stroke: '#000000', fill: color }),
      React.createElement('line', { y1: radius + 2, x1: '2', y2: split - radius + 2, x2: '2', strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' }),
      React.createElement('line', { y1: radius + 2, x1: width + 2, y2: split - radius + 2, x2: width + 2, strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' }),
      React.createElement('line', { y1: split + radius, x1: '2', y2: height - radius, x2: '2', strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' }),
      React.createElement('line', { y1: split + radius, x1: width + 2, y2: height - radius, x2: width + 2, strokeLinecap: 'null', strokeLinejoin: 'null', strokeWidth: '2', stroke: '#000000', fill: 'none' })
    )
  );
};

ChromosomeImageView.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  color: _react.PropTypes.string
};

exports.default = ChromosomeImageView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],57:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _geneLabel = require('./gene-label');

var _geneLabel2 = _interopRequireDefault(_geneLabel);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChromosomeView = function ChromosomeView(_ref) {
  var org = _ref.org;
  var chromosomeName = _ref.chromosomeName;
  var side = _ref.side;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var _onAlleleChange = _ref.onAlleleChange;
  var _ref$labelsOnRight = _ref.labelsOnRight;
  var labelsOnRight = _ref$labelsOnRight === undefined ? true : _ref$labelsOnRight;

  var alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
      visibleAlleles = _geneticsUtils2.default.filterAlleles(alleles, hiddenAlleles, org.species),
      labels = visibleAlleles.map(function (a) {
    return React.createElement(_geneLabel2.default, { key: a, species: org.species, allele: a, editable: editable,
      onAlleleChange: function onAlleleChange(event) {
        _onAlleleChange(a, event.target.value);
      } });
  }),
      containerClass = "items";

  if (!labelsOnRight) {
    containerClass += " rtl";
  }

  return React.createElement(
    'div',
    { className: 'geniblocks chromosome-container' },
    React.createElement(
      'div',
      { className: containerClass },
      React.createElement(_chromosomeImage2.default, null),
      React.createElement(
        'div',
        { className: 'labels' },
        labels
      )
    )
  );
};

ChromosomeView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  chromosomeName: _react.PropTypes.string.isRequired,
  side: _react.PropTypes.string.isRequired,
  hiddenAlleles: _react.PropTypes.array,
  editable: _react.PropTypes.bool,
  onAlleleChange: _react.PropTypes.func,
  labelsOnRight: _react.PropTypes.bool
};

exports.default = ChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":76,"./chromosome-image":56,"./gene-label":63}],58:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  return React.createElement(
    'div',
    { className: 'geniblocks circular-glow', style: style },
    React.createElement(
      'svg',
      { width: size + 2, height: size + 2, xmlns: 'http://www.w3.org/2000/svg' },
      React.createElement(
        'defs',
        null,
        React.createElement(
          'radialGradient',
          { id: gradientID },
          React.createElement('stop', { offset: '0%', stopColor: color, stopOpacity: '1.0' }),
          React.createElement('stop', { offset: '100%', stopColor: color, stopOpacity: '0.0' })
        )
      ),
      React.createElement('circle', { fill: gradientIDUrl, cx: radius, cy: radius, r: radius })
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

},{}],59:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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
    return React.createElement(
      "div",
      { className: "geniblocks feedback text-line", key: index },
      iText
    );
  });

  return React.createElement(
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

},{}],60:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GAMETE_TYPE = undefined;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FertilizingGameteView).call(this, props));

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

      return React.createElement(_animatedGamete2.default, { gamete: gamete, id: id, hiddenAlleles: hiddenAlleles,
        initialDisplay: initial, display: tFinal,
        animStiffness: animStiffness, onRest: onRest });
    };

    return _this;
  }

  return FertilizingGameteView;
}(React.Component);

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

},{"./animated-gamete":52}],61:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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
    return React.createElement(_animatedGamete2.default, { gamete: gamete, id: index + 1, key: index,
      hiddenAlleles: hiddenAlleles,
      initialDisplay: { x: Math.round(width / 2), y: -Math.round(ySpacing) },
      display: { x: Math.round(x), y: Math.round(y) },
      animStiffness: animStiffness,
      isSelected: index + 1 === selectedId,
      isDisabled: isDisabled,
      onClick: onGameteSelected });
  });

  return React.createElement(
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

},{"./animated-gamete":52}],62:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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
  return React.createElement('div', { className: classes, title: tooltip,
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

},{}],63:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var GeneLabelView = function GeneLabelView(_ref) {
  var species = _ref.species;
  var allele = _ref.allele;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? false : _ref$editable;
  var onAlleleChange = _ref.onAlleleChange;

  if (!editable) {
    var alleleName = species.alleleLabelMap[allele];
    return React.createElement(
      "div",
      { className: "geniblocks gene-label allele noneditable" },
      React.createElement(
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
        return React.createElement(
          "option",
          { key: name, value: alleles[i] },
          name
        );
      });
      return {
        v: React.createElement(
          "div",
          { className: "geniblocks gene-label allele editable" },
          React.createElement(
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

},{}],64:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  possibleCombos.push(React.createElement(
    'option',
    { key: 'placeholder', value: 'placeholder', disabled: 'disabled' },
    'Select a Genotype'
  ));

  for (i = 0; i < numAlleles; i++) {
    for (j = i; j < numAlleles; j++) {
      var key = i + " " + j,
          string = alleleNames[i] + " / " + alleleNames[j];
      possibleCombos.push(React.createElement(
        'option',
        { key: key, value: key },
        string
      ));
    }
  }

  return React.createElement(
    'div',
    { className: 'select-wrapper' },
    React.createElement(
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
        return React.createElement(TestPulldownView, {
          key: g.name,
          species: org.species,
          gene: g,
          selection: selection[g.name],
          onSelectionChange: function onSelectionChange(event) {
            _onSelectionChange(g, event.target.value);
          }
        });
      });

      pairWrappers.push(React.createElement(
        'div',
        { className: 'items', key: chromosomeName },
        React.createElement(_chromosomeImage2.default, null),
        React.createElement(_chromosomeImage2.default, null),
        React.createElement(
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

  return React.createElement(
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

},{"../utilities/genetics-utils":76,"./chromosome-image":56}],65:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _chromosome = require('./chromosome');

var _chromosome2 = _interopRequireDefault(_chromosome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GenomeView = function GenomeView(_ref) {
  var org = _ref.org;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$editable = _ref.editable;
  var editable = _ref$editable === undefined ? true : _ref$editable;
  var _onAlleleChange = _ref.onAlleleChange;

  var pairWrappers = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var chromosomeName = _step.value;

      var chrom = org.genetics.genotype.chromosomes[chromosomeName],
          pairs = [];

      var _loop2 = function _loop2(side) {
        pairs.push(React.createElement(_chromosome2.default, {
          org: org,
          key: pairs.length + 1,
          chromosomeName: chromosomeName,
          side: side,
          hiddenAlleles: hiddenAlleles,
          labelsOnRight: pairs.length > 0,
          editable: editable,
          onAlleleChange: function onAlleleChange(prevAllele, newAllele) {
            _onAlleleChange(chromosomeName, side, prevAllele, newAllele);
          } }));
      };

      for (var side in chrom) {
        _loop2(side);
      }
      pairWrappers.push(React.createElement(
        'div',
        { className: 'geniblocks chromosome-pair', key: pairWrappers.length + 1 },
        pairs
      ));
    };

    for (var _iterator = org.species.chromosomeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

  return React.createElement(
    'div',
    { className: 'geniblocks genome' },
    pairWrappers
  );
};

GenomeView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  hiddenAlleles: _react.PropTypes.array,
  onAlleleChange: _react.PropTypes.func,
  editable: _react.PropTypes.bool
};

exports.default = GenomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./chromosome":57}],66:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  return React.createElement(
    'div',
    { className: 'geniblocks glow-background', style: tContainerStyle },
    React.createElement(_circularGlow2.default, { id: 'glow-' + id, color: color, size: size, style: tGlowStyle }),
    React.createElement(ChildComponent, _extends({ id: 'child-' + id, style: tChildStyle, width: size }, others))
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

},{"./circular-glow":58}],67:[function(require,module,exports){
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

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  var top = 50;
  var left = 50;

  return {
    position: 'absolute',
    width: 400,
    top: top + '%', left: left + '%',
    transform: 'translate(-' + top + '%, -' + left + '%)',
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20
  };
};

var ModalAlert = function (_React$Component) {
  _inherits(ModalAlert, _React$Component);

  function ModalAlert() {
    _classCallCheck(this, ModalAlert);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ModalAlert).apply(this, arguments));
  }

  _createClass(ModalAlert, [{
    key: 'render',
    value: function render() {
      /* eslint react/jsx-handler-names: 0 */
      var leftProps = this.props.leftButton,
          leftButton = leftProps ? React.createElement(_button2.default, { label: leftProps.label,
        onClick: leftProps.onClick }) : null,
          rightProps = this.props.rightButton,
          rightButton = React.createElement(_button2.default, { label: rightProps.label,
        onClick: rightProps.onClick });

      return React.createElement(
        _Modal2.default,
        { 'aria-labelledby': 'modal-label',
          style: modalStyle,
          backdropStyle: backdropStyle,
          show: this.props.show,
          onHide: this.props.onHide },
        React.createElement(
          'div',
          { style: dialogStyle() },
          React.createElement(
            'h4',
            { id: 'modal-label' },
            this.props.message
          ),
          React.createElement(
            'p',
            null,
            this.props.explanation
          ),
          leftButton,
          ' ',
          rightButton
        )
      );
    }
  }]);

  return ModalAlert;
}(React.Component);

ModalAlert.propTypes = {
  show: _react.PropTypes.bool.isRequired,
  message: _react.PropTypes.string.isRequired,
  explanation: _react.PropTypes.string,
  leftButton: _react.PropTypes.shape({
    label: _react.PropTypes.string.isRequired,
    onClick: _react.PropTypes.func.isRequired
  }),
  rightButton: _react.PropTypes.shape({
    label: _react.PropTypes.string.isRequired,
    onClick: _react.PropTypes.func.isRequired
  }).isRequired,
  onHide: _react.PropTypes.func
};
exports.default = ModalAlert;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./button":54,"react-overlays/lib/Modal":36}],68:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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
  var id = _ref.id;
  var className = _ref.className;
  var color = _ref.color;
  var size = _ref.size;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var other = _objectWithoutProperties(_ref, ['id', 'className', 'color', 'size', 'style']);

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' },
      orgStyle = _extends({ position: 'absolute' }, style);

  return React.createElement(
    'div',
    { id: id, className: 'geniblocks organism-glow ' + className, style: containerStyle },
    React.createElement(_circularGlow2.default, { id: id + '-glow', color: color, size: size, style: glowStyle }),
    React.createElement(_organism2.default, _extends({ id: id + '-organism', width: size, style: orgStyle }, other))
  );
};

OrganismGlowView.propTypes = {
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  color: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.number.isRequired,
  style: _react.PropTypes.object
};

exports.default = OrganismGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":58,"./organism":69}],69:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onClick = _ref.onClick;
  var wrapper = _ref.wrapper;

  var baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url = baseUrl + org.getImageName(),

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

  function handleClick() {
    if (onClick) onClick(id, org);
  }

  return divWrapper(React.createElement(
    'div',
    { className: 'geniblocks organism', id: id, style: style,
      onMouseDown: handleMouseDown, onClick: handleClick },
    React.createElement('img', { src: url, width: width })
  ));
};

OrganismView.propTypes = {
  org: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string,
  width: _react.PropTypes.number,
  style: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  wrapper: _react.PropTypes.func
};

exports.default = OrganismView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],70:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PenStatsView).apply(this, arguments));
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

      return React.createElement(
        _reactSimpletabs2.default,
        null,
        React.createElement(
          _reactSimpletabs2.default.Panel,
          { title: 'Breeding Pen', key: 'Breeding Pen' },
          React.createElement(_pen2.default, _extends({ orgs: lastClutch }, others, {
            selectedIndex: selectedIndex,
            onClick: function onClick(iSelectedIndex) {
              if (onSelectionChange) onSelectionChange(iSelectedIndex);
            } }))
        ),
        React.createElement(
          _reactSimpletabs2.default.Panel,
          { title: 'Stats', key: 'Stats' },
          React.createElement(_stats2.default, { orgs: orgs, lastClutchSize: lastClutchSize })
        )
      );
    }
  }]);

  return PenStatsView;
}(React.Component);

PenStatsView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  lastClutchSize: _react.PropTypes.number.isRequired,
  selectedIndex: _react.PropTypes.number,
  onSelectionChange: _react.PropTypes.func
};
exports.default = PenStatsView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./pen":71,"./stats":74,"react-simpletabs":48}],71:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _organism = require('./organism');

var _organism2 = _interopRequireDefault(_organism);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PenView = function PenView(_ref) {
  var orgs = _ref.orgs;
  var _ref$idPrefix = _ref.idPrefix;
  var idPrefix = _ref$idPrefix === undefined ? 'organism-' : _ref$idPrefix;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 400 : _ref$width;
  var _ref$columns = _ref.columns;
  var columns = _ref$columns === undefined ? 5 : _ref$columns;
  var _ref$SelectedOrganism = _ref.SelectedOrganismView;
  var SelectedOrganismView = _ref$SelectedOrganism === undefined ? _organism2.default : _ref$SelectedOrganism;
  var selectedIndex = _ref.selectedIndex;
  var onClick = _ref.onClick;


  function handleClick(id, org) {
    var prefixIndex = id.indexOf(idPrefix),
        index = Number(id.substr(prefixIndex + idPrefix.length));
    if (onClick) onClick(index, id, org);
  }

  var orgWidth = width / columns,
      orgViews = orgs.map(function (org, index) {
    return index === selectedIndex ? React.createElement(SelectedOrganismView, { org: org, id: idPrefix + index, index: index, key: index,
      color: '#FFFFAA', size: orgWidth, onClick: handleClick }) : React.createElement(_organism2.default, { org: org, id: idPrefix + index, index: index, key: index,
      width: orgWidth, onClick: handleClick });
  });

  return React.createElement(
    'div',
    { className: 'geniblocks pen' },
    orgViews
  );
};

PenView.propTypes = {
  orgs: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  idPrefix: _react.PropTypes.string,
  width: _react.PropTypes.number,
  columns: _react.PropTypes.number,
  SelectedOrganismView: _react.PropTypes.func,
  selectedIndex: _react.PropTypes.number,
  onClick: _react.PropTypes.func
};

exports.default = PenView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organism":69}],72:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _circularGlow = require('./circular-glow');

var _circularGlow2 = _interopRequireDefault(_circularGlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestionGlowView = function QuestionGlowView(_ref) {
  var glowColor = _ref.glowColor;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 200 : _ref$size;

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' };

  return React.createElement(
    'div',
    { className: 'geniblocks question-glow', style: containerStyle },
    React.createElement(_circularGlow2.default, { color: glowColor, size: size, style: glowStyle }),
    React.createElement('div', { className: 'geniblocks question-glow question-mark',
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

},{"./circular-glow":58}],73:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  var orgView = React.createElement(_organismGlow2.default, _extends({ color: color, size: size }, other)),
      questionView = React.createElement(_questionGlow2.default, { glowColor: color, width: size }),
      finalView = hidden ? questionView : orgView;

  return React.createElement(
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

},{"./organism-glow":68,"./question-glow":72}],74:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

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

  return React.createElement(
    'div',
    { className: 'geniblocks stats' },
    React.createElement(
      'table',
      { id: 'stats-table', className: orgs.length > 0 ? "has-data" : "no-data" },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Trait Value'
          ),
          React.createElement(
            'th',
            { colSpan: '2' },
            'Clutch'
          ),
          React.createElement(
            'th',
            null,
            'F'
          ),
          React.createElement(
            'th',
            null,
            'M'
          ),
          React.createElement(
            'th',
            { colSpan: '2' },
            'Total'
          ),
          React.createElement(
            'th',
            null,
            'F'
          ),
          React.createElement(
            'th',
            null,
            'M'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        rows.map(function (row, index) {
          return React.createElement(
            'tr',
            { key: index, className: row.traitNum & 1 ? "odd-trait" : "even-trait",
              'data-trait-value': row.value },
            React.createElement(
              'td',
              { className: 'label' },
              row.value
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cTotal
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cPct,
              '%'
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cFemales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.cMales
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tTotal
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tPct,
              '%'
            ),
            React.createElement(
              'td',
              { className: 'numeric' },
              row.tFemales
            ),
            React.createElement(
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

},{"../utilities/genetics-utils":76}],75:[function(require,module,exports){
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

var _geneticsUtils = require('./utilities/genetics-utils');

Object.defineProperty(exports, 'GeneticsUtils', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_geneticsUtils).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./components/allele":51,"./components/allele-filters":50,"./components/animated-gamete":52,"./components/animated-organism":53,"./components/button":54,"./components/change-sex-buttons":55,"./components/chromosome":57,"./components/chromosome-image":56,"./components/circular-glow":58,"./components/feedback":59,"./components/fertilizing-gamete":60,"./components/gamete":62,"./components/gamete-pool":61,"./components/gene-label":63,"./components/genome":65,"./components/genome-test":64,"./components/glow-background":66,"./components/modal-alert":67,"./components/organism":69,"./components/organism-glow":68,"./components/pen":71,"./components/pen-stats":70,"./components/question-glow":72,"./components/question-organism-glow":73,"./components/stats":74,"./utilities/genetics-utils":76}],76:[function(require,module,exports){
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
    key: "filterAlleles",


    /**
     * Filters out hidden alleles from an original list of alleles
     *
     * @param {string[]} alleles - the set of alleles to be filtered
     * @param {string[]} hiddenAlleles - the alleles identifying the hidden genes
     * @param {BioLogica.species} species - the species that defines the genotype
     * @return {string[]} - the filtered alleles
     */
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

},{}]},{},[75])(75)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tbW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL21vdW50YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1zaW1wbGV0YWJzL2Rpc3QvcmVhY3Qtc2ltcGxldGFicy5qcyIsIm5vZGVfbW9kdWxlcy93YXJuaW5nL2Jyb3dzZXIuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2J1dHRvbi5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaHJvbW9zb21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaXJjdWxhci1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZWVkYmFjay5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZmVydGlsaXppbmctZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUtcG9vbC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2FtZXRlLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5lLWxhYmVsLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUtdGVzdC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvZ2Vub21lLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL21vZGFsLWFsZXJ0LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS1nbG93LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9vcmdhbmlzbS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcGVuLXN0YXRzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9wZW4uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3N0YXRzLmpzIiwic3JjL2NvZGUvZ2VuaWJsb2Nrcy5qcyIsInNyYy9jb2RlL3V0aWxpdGllcy9nZW5ldGljcy11dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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MkIsRTtrQkFqUGYsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYWJlbEhlbHBlcnMgPSByZXF1aXJlKCcuL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKlxyXG4gKiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gYWN0aXZlRWxlbWVudDtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gYWN0aXZlRWxlbWVudCgpIHtcbiAgdmFyIGRvYyA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMF07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcbnZhciBoYXNDbGFzcyA9IHJlcXVpcmUoJy4vaGFzQ2xhc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtlbHNlIGlmICghaGFzQ2xhc3MoZWxlbWVudCkpIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgcmV0dXJuICEhY2xhc3NOYW1lICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7ZWxzZSByZXR1cm4gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIGNsYXNzTmFtZSArICcgJykgIT09IC0xO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRDbGFzczogcmVxdWlyZSgnLi9hZGRDbGFzcycpLFxuICByZW1vdmVDbGFzczogcmVxdWlyZSgnLi9yZW1vdmVDbGFzcycpLFxuICBoYXNDbGFzczogcmVxdWlyZSgnLi9oYXNDbGFzcycpXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtlbHNlIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NOYW1lICsgJyg/OlxcXFxzfCQpJywgJ2cnKSwgJyQxJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvZmYgPSBmdW5jdGlvbiBvZmYoKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuXG4gIG9mZiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmY7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvbiA9IGZ1bmN0aW9uIG9uKCkge307XG5cbmlmIChjYW5Vc2VET00pIHtcbiAgb24gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICByZXR1cm4gbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfTtlbHNlIGlmIChkb2N1bWVudC5hdHRhY2hFdmVudCkgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBub2RlLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG93bmVyRG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIG93bmVyRG9jdW1lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcblxudmFyIGNvbnRhaW5zID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJvb3QgPSBjYW5Vc2VET00gJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMgPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0LmNvbnRhaW5zKG5vZGUpO1xuICB9IDogcm9vdCAmJiByb290LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dCA9PT0gbm9kZSB8fCAhIShjb250ZXh0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGUpICYgMTYpO1xuICB9IDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICBpZiAobm9kZSkgZG8ge1xuICAgICAgaWYgKG5vZGUgPT09IGNvbnRleHQpIHJldHVybiB0cnVlO1xuICAgIH0gd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IG5vZGUud2luZG93ID8gbm9kZSA6IG5vZGUubm9kZVR5cGUgPT09IDkgPyBub2RlLmRlZmF1bHRWaWV3IHx8IG5vZGUucGFyZW50V2luZG93IDogZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4uL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbnZhciBfdXRpbENhbWVsaXplU3R5bGUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZTIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsQ2FtZWxpemVTdHlsZSk7XG5cbnZhciBycG9zaXRpb24gPSAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC87XG52YXIgcm51bW5vbnB4ID0gL14oWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpKSg/IXB4KVthLXolXSskL2k7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2dldENvbXB1dGVkU3R5bGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIEVsZW1lbnQgcGFzc2VkIHRvIGBnZXRDb21wdXRlZFN0eWxlKClgJyk7XG4gIHZhciBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgcmV0dXJuICdkZWZhdWx0VmlldycgaW4gZG9jID8gZG9jLmRlZmF1bHRWaWV3Lm9wZW5lciA/IG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB7IC8vaWUgOCBcIm1hZ2ljXCIgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8xLjExLXN0YWJsZS9zcmMvY3NzL2N1ckNTUy5qcyNMNzJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlKHByb3ApIHtcbiAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG5cbiAgICAgIHByb3AgPSAoMCwgX3V0aWxDYW1lbGl6ZVN0eWxlMlsnZGVmYXVsdCddKShwcm9wKTtcblxuICAgICAgaWYgKHByb3AgPT0gJ2Zsb2F0JykgcHJvcCA9ICdzdHlsZUZsb2F0JztcblxuICAgICAgdmFyIGN1cnJlbnQgPSBub2RlLmN1cnJlbnRTdHlsZVtwcm9wXSB8fCBudWxsO1xuXG4gICAgICBpZiAoY3VycmVudCA9PSBudWxsICYmIHN0eWxlICYmIHN0eWxlW3Byb3BdKSBjdXJyZW50ID0gc3R5bGVbcHJvcF07XG5cbiAgICAgIGlmIChybnVtbm9ucHgudGVzdChjdXJyZW50KSAmJiAhcnBvc2l0aW9uLnRlc3QocHJvcCkpIHtcbiAgICAgICAgLy8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xuICAgICAgICB2YXIgbGVmdCA9IHN0eWxlLmxlZnQ7XG4gICAgICAgIHZhciBydW5TdHlsZSA9IG5vZGUucnVudGltZVN0eWxlO1xuICAgICAgICB2YXIgcnNMZWZ0ID0gcnVuU3R5bGUgJiYgcnVuU3R5bGUubGVmdDtcblxuICAgICAgICAvLyBQdXQgaW4gdGhlIG5ldyB2YWx1ZXMgdG8gZ2V0IGEgY29tcHV0ZWQgdmFsdWUgb3V0XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSBub2RlLmN1cnJlbnRTdHlsZS5sZWZ0O1xuXG4gICAgICAgIHN0eWxlLmxlZnQgPSBwcm9wID09PSAnZm9udFNpemUnID8gJzFlbScgOiBjdXJyZW50O1xuICAgICAgICBjdXJyZW50ID0gc3R5bGUucGl4ZWxMZWZ0ICsgJ3B4JztcblxuICAgICAgICAvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG4gICAgICAgIHN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgICAgICBpZiAocnNMZWZ0KSBydW5TdHlsZS5sZWZ0ID0gcnNMZWZ0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi4vdXRpbC9jYW1lbGl6ZVN0eWxlJyksXG4gICAgaHlwaGVuYXRlID0gcmVxdWlyZSgnLi4vdXRpbC9oeXBoZW5hdGVTdHlsZScpLFxuICAgIF9nZXRDb21wdXRlZFN0eWxlID0gcmVxdWlyZSgnLi9nZXRDb21wdXRlZFN0eWxlJyksXG4gICAgcmVtb3ZlU3R5bGUgPSByZXF1aXJlKCcuL3JlbW92ZVN0eWxlJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlKG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICB2YXIgY3NzID0gJycsXG4gICAgICBwcm9wcyA9IHByb3BlcnR5O1xuXG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vZGUuc3R5bGVbY2FtZWxpemUocHJvcGVydHkpXSB8fCBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5nZXRQcm9wZXJ0eVZhbHVlKGh5cGhlbmF0ZShwcm9wZXJ0eSkpO2Vsc2UgKHByb3BzID0ge30pW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSBpZiAoaGFzLmNhbGwocHJvcHMsIGtleSkpIHtcbiAgICAhcHJvcHNba2V5XSAmJiBwcm9wc1trZXldICE9PSAwID8gcmVtb3ZlU3R5bGUobm9kZSwgaHlwaGVuYXRlKGtleSkpIDogY3NzICs9IGh5cGhlbmF0ZShrZXkpICsgJzonICsgcHJvcHNba2V5XSArICc7JztcbiAgfVxuXG4gIG5vZGUuc3R5bGUuY3NzVGV4dCArPSAnOycgKyBjc3M7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVTdHlsZShub2RlLCBrZXkpIHtcbiAgcmV0dXJuICdyZW1vdmVQcm9wZXJ0eScgaW4gbm9kZS5zdHlsZSA/IG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KSA6IG5vZGUuc3R5bGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59OyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW1wiZXhwb3J0c1wiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2Uge1xuICAgIGZhY3Rvcnkocm9vdC5iYWJlbEhlbHBlcnMgPSB7fSk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIGJhYmVsSGVscGVycyA9IGdsb2JhbDtcblxuICBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICBcImRlZmF1bHRcIjogb2JqXG4gICAgfTtcbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHJIeXBoZW4gPSAvLSguKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uockh5cGhlbiwgZnVuY3Rpb24gKF8sIGNocikge1xuICAgIHJldHVybiBjaHIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59OyIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yYWViOGEyYTZiZWIwMDYxN2E0MjE3ZjdmODI4NDkyNGZhMmFkODE5L3NyYy92ZW5kb3IvY29yZS9jYW1lbGl6ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi9jYW1lbGl6ZScpO1xudmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBjYW1lbGl6ZShzdHJpbmcucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJVcHBlciA9IC8oW0EtWl0pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoclVwcGVyLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2h5cGhlbmF0ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoeXBoZW5hdGUgPSByZXF1aXJlKFwiLi9oeXBoZW5hdGVcIik7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCBcIi1tcy1cIik7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuL2luRE9NJyk7XG5cbnZhciBzaXplO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNhbGMpIHtcbiAgaWYgKCFzaXplIHx8IHJlY2FsYykge1xuICAgIGlmIChjYW5Vc2VET00pIHtcbiAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgIHNpemUgPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNpemU7XG59OyIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgdmFyIGdldE5hbm9TZWNvbmRzLCBocnRpbWUsIGxvYWRUaW1lO1xuXG4gIGlmICgodHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsKSAmJiBwZXJmb3JtYW5jZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwpICYmIHByb2Nlc3MuaHJ0aW1lKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoZ2V0TmFub1NlY29uZHMoKSAtIGxvYWRUaW1lKSAvIDFlNjtcbiAgICB9O1xuICAgIGhydGltZSA9IHByb2Nlc3MuaHJ0aW1lO1xuICAgIGdldE5hbm9TZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaHI7XG4gICAgICBociA9IGhydGltZSgpO1xuICAgICAgcmV0dXJuIGhyWzBdICogMWU5ICsgaHJbMV07XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IGdldE5hbm9TZWNvbmRzKCk7XG4gIH0gZWxzZSBpZiAoRGF0ZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIHJvb3QgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSByb290WydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSByb290WydjYW5jZWwnICsgc3VmZml4XSB8fCByb290WydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cblxuZm9yKHZhciBpID0gMDsgIXJhZiAmJiBpIDwgdmVuZG9ycy5sZW5ndGg7IGkrKykge1xuICByYWYgPSByb290W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdDYW5jZWwnICsgc3VmZml4XVxuICAgICAgfHwgcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgdmFyIGxhc3QgPSAwXG4gICAgLCBpZCA9IDBcbiAgICAsIHF1ZXVlID0gW11cbiAgICAsIGZyYW1lRHVyYXRpb24gPSAxMDAwIC8gNjBcblxuICByYWYgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKVxuICAgICAgICAsIG5leHQgPSBNYXRoLm1heCgwLCBmcmFtZUR1cmF0aW9uIC0gKF9ub3cgLSBsYXN0KSlcbiAgICAgIGxhc3QgPSBuZXh0ICsgX25vd1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNwID0gcXVldWUuc2xpY2UoMClcbiAgICAgICAgLy8gQ2xlYXIgcXVldWUgaGVyZSB0byBwcmV2ZW50XG4gICAgICAgIC8vIGNhbGxiYWNrcyBmcm9tIGFwcGVuZGluZyBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgZnJhbWUncyBxdWV1ZVxuICAgICAgICBxdWV1ZS5sZW5ndGggPSAwXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmKCFjcFtpXS5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgY3BbaV0uY2FsbGJhY2sobGFzdClcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBNYXRoLnJvdW5kKG5leHQpKVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKHtcbiAgICAgIGhhbmRsZTogKytpZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNhbmNlbGxlZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiBpZFxuICB9XG5cbiAgY2FmID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihxdWV1ZVtpXS5oYW5kbGUgPT09IGhhbmRsZSkge1xuICAgICAgICBxdWV1ZVtpXS5jYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4pIHtcbiAgLy8gV3JhcCBpbiBhIG5ldyBmdW5jdGlvbiB0byBwcmV2ZW50XG4gIC8vIGBjYW5jZWxgIHBvdGVudGlhbGx5IGJlaW5nIGFzc2lnbmVkXG4gIC8vIHRvIHRoZSBuYXRpdmUgckFGIGZ1bmN0aW9uXG4gIHJldHVybiByYWYuY2FsbChyb290LCBmbilcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkocm9vdCwgYXJndW1lbnRzKVxufVxubW9kdWxlLmV4cG9ydHMucG9seWZpbGwgPSBmdW5jdGlvbigpIHtcbiAgcm9vdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByYWZcbiAgcm9vdC5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhZlxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxudmFyIE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKSxcbiAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uUmVzdDogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZSA9IF9wcm9wcy5kZWZhdWx0U3R5bGU7XG4gICAgdmFyIHN0eWxlID0gX3Byb3BzLnN0eWxlO1xuXG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IGRlZmF1bHRTdHlsZSB8fCBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZSk7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10oY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSxcbiAgICAgIGxhc3RJZGVhbFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5XG4gICAgfTtcbiAgfSxcblxuICB3YXNBbmltYXRpbmc6IGZhbHNlLFxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGU6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKGRlc3RTdHlsZSkge1xuICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuICAgIHZhciBfc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBjdXJyZW50U3R5bGUgPSBfc3RhdGUuY3VycmVudFN0eWxlO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdHkgPSBfc3RhdGUuY3VycmVudFZlbG9jaXR5O1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZSA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdHkgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdHk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICBpZiAoIWRlc3RTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnRTdHlsZSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGUpO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdHkpO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlKTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgbGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZTogY3VycmVudFN0eWxlLCBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSwgbGFzdElkZWFsU3R5bGU6IGxhc3RJZGVhbFN0eWxlLCBsYXN0SWRlYWxWZWxvY2l0eTogbGFzdElkZWFsVmVsb2NpdHkgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgdmFyIHByb3BzU3R5bGUgPSBfdGhpcy5wcm9wcy5zdHlsZTtcbiAgICAgIGlmIChfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGUsIHByb3BzU3R5bGUsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0eSkpIHtcbiAgICAgICAgaWYgKF90aGlzLndhc0FuaW1hdGluZyAmJiBfdGhpcy5wcm9wcy5vblJlc3QpIHtcbiAgICAgICAgICBfdGhpcy5wcm9wcy5vblJlc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIF90aGlzLnByZXZUaW1lO1xuICAgICAgX3RoaXMucHJldlRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IF90aGlzLmFjY3VtdWxhdGVkVGltZSArIHRpbWVEZWx0YTtcbiAgICAgIC8vIG1vcmUgdGhhbiAxMCBmcmFtZXM/IHByb2xseSBzd2l0Y2hlZCBicm93c2VyIHRhYi4gUmVzdGFydFxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA+IG1zUGVyRnJhbWUgKiAxMCkge1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID09PSAwKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRGcmFtZUNvbXBsZXRpb24gPSAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKSAqIG1zUGVyRnJhbWUpIC8gbXNQZXJGcmFtZTtcbiAgICAgIHZhciBmcmFtZXNUb0NhdGNoVXAgPSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpO1xuXG4gICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGUgPSB7fTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0eSA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNTdHlsZSkge1xuICAgICAgICBpZiAoIXByb3BzU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBwcm9wc1N0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVba2V5XTtcbiAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXR5W2tleV07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZXNUb0NhdGNoVXA7IGkrKykge1xuICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfc3RlcHBlclsxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICB2YXIgbmV4dElkZWFsWCA9IF9zdGVwcGVyMlswXTtcbiAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSArIChuZXh0SWRlYWxWIC0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZTogbmV3Q3VycmVudFN0eWxlLFxuICAgICAgICBjdXJyZW50VmVsb2NpdHk6IG5ld0N1cnJlbnRWZWxvY2l0eSxcbiAgICAgICAgbGFzdElkZWFsU3R5bGU6IG5ld0xhc3RJZGVhbFN0eWxlLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eTogbmV3TGFzdElkZWFsVmVsb2NpdHlcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZSk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBwcm9wcy5zdHlsZTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG5mdW5jdGlvbiBzaG91bGRTdG9wQW5pbWF0aW9uQWxsKGN1cnJlbnRTdHlsZXMsIHN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBzdHlsZXNbaV0sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFN0YWdnZXJlZE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU3RhZ2dlcmVkTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpKSxcbiAgICBzdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgfHwgc3R5bGVzKCkubWFwKF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBjdXJyZW50U3R5bGVzLm1hcChmdW5jdGlvbiAoY3VycmVudFN0eWxlKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXNcbiAgICB9O1xuICB9LFxuXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfc3RhdGUuY3VycmVudFN0eWxlcztcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfc3RhdGUuY3VycmVudFZlbG9jaXRpZXM7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlcyA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZXM7XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcztcblxuICAgIHZhciBzb21lRGlydHkgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1bnJlYWRQcm9wU3R5bGUgPSB1bnJlYWRQcm9wU3R5bGVzW2ldO1xuICAgICAgdmFyIGRpcnR5ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB1bnJlYWRQcm9wU3R5bGUpIHtcbiAgICAgICAgaWYgKCF1bnJlYWRQcm9wU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSB1bnJlYWRQcm9wU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNvbWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNvbWVEaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcywgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSBfdGhpcy5wcm9wcy5zdHlsZXMoX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcblxuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgaWYgKHNob3VsZFN0b3BBbmltYXRpb25BbGwoX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzdFN0eWxlID0gZGVzdFN0eWxlc1tpXTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICAgICAgaWYgKCFkZXN0U3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBkZXN0U3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBuZXdMYXN0SWRlYWxTdHlsZTtcbiAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudW5yZWFkUHJvcFN0eWxlcyA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGVzICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHByb3BzLnN0eWxlcyh0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcyk7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4odGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFN0YWdnZXJlZE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9tZXJnZURpZmYgPSByZXF1aXJlKCcuL21lcmdlRGlmZicpO1xuXG52YXIgX21lcmdlRGlmZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZXJnZURpZmYpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxuLy8gdGhlIGNoaWxkcmVuIGZ1bmN0aW9uICYgKHBvdGVudGlhbCkgc3R5bGVzIGZ1bmN0aW9uIGFza3MgYXMgcGFyYW0gYW5cbi8vIEFycmF5PFRyYW5zaXRpb25QbGFpblN0eWxlPiwgd2hlcmUgZWFjaCBUcmFuc2l0aW9uUGxhaW5TdHlsZSBpcyBvZiB0aGUgZm9ybWF0XG4vLyB7a2V5OiBzdHJpbmcsIGRhdGE/OiBhbnksIHN0eWxlOiBQbGFpblN0eWxlfS4gSG93ZXZlciwgdGhlIHdheSB3ZSBrZWVwXG4vLyBpbnRlcm5hbCBzdGF0ZXMgZG9lc24ndCBjb250YWluIHN1Y2ggYSBkYXRhIHN0cnVjdHVyZSAoY2hlY2sgdGhlIHN0YXRlIGFuZFxuLy8gVHJhbnNpdGlvbk1vdGlvblN0YXRlKS4gU28gd2hlbiBjaGlsZHJlbiBmdW5jdGlvbiBhbmQgb3RoZXJzIGFzayBmb3Igc3VjaFxuLy8gZGF0YSB3ZSBuZWVkIHRvIGdlbmVyYXRlIHRoZW0gb24gdGhlIGZseSBieSBjb21iaW5pbmcgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4vLyBjdXJyZW50U3R5bGVzL2xhc3RJZGVhbFN0eWxlc1xuZnVuY3Rpb24gcmVoeWRyYXRlU3R5bGVzKG1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCBwbGFpblN0eWxlcykge1xuICBpZiAodW5yZWFkUHJvcFN0eWxlcyA9PSBudWxsKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZS5rZXksXG4gICAgICAgIGRhdGE6IG1lcmdlZFByb3BzU3R5bGUuZGF0YSxcbiAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBpZiAodW5yZWFkUHJvcFN0eWxlc1tqXS5rZXkgPT09IG1lcmdlZFByb3BzU3R5bGUua2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICAgIGtleTogdW5yZWFkUHJvcFN0eWxlc1tqXS5rZXksXG4gICAgICAgICAgZGF0YTogdW5yZWFkUHJvcFN0eWxlc1tqXS5kYXRhLFxuICAgICAgICAgIHN0eWxlOiBwbGFpblN0eWxlc1tpXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuIHsga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLCBzdHlsZTogcGxhaW5TdHlsZXNbaV0gfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMsIG1lcmdlZFByb3BzU3R5bGVzKSB7XG4gIGlmIChtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGggIT09IGRlc3RTdHlsZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtZXJnZWRQcm9wc1N0eWxlc1tpXS5rZXkgIT09IGRlc3RTdHlsZXNbaV0ua2V5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gd2UgaGF2ZSB0aGUgaW52YXJpYW50IHRoYXQgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4gIC8vIGN1cnJlbnRTdHlsZXMvY3VycmVudFZlbG9jaXRpZXMvbGFzdCogYXJlIHN5bmNlZCBpbiB0ZXJtcyBvZiBjZWxscywgc2VlXG4gIC8vIG1lcmdlQW5kU3luYyBjb21tZW50IGZvciBtb3JlIGluZm9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10oY3VycmVudFN0eWxlc1tpXSwgZGVzdFN0eWxlc1tpXS5zdHlsZSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvcmUga2V5IG1lcmdpbmcgbG9naWNcblxuLy8gdGhpbmdzIHRvIGRvOiBzYXkgcHJldmlvdXNseSBtZXJnZWQgc3R5bGUgaXMge2EsIGJ9LCBkZXN0IHN0eWxlIChwcm9wKSBpcyB7Yixcbi8vIGN9LCBwcmV2aW91cyBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBpcyB7YSwgYn1cbi8vICoqaW52YXJpYW50Kio6IGN1cnJlbnRbaV0gY29ycmVzcG9uZHMgdG8gbWVyZ2VkW2ldIGluIHRlcm1zIG9mIGtleVxuXG4vLyBzdGVwczpcbi8vIHR1cm4gbWVyZ2VkIHN0eWxlIGludG8ge2E/LCBiLCBjfVxuLy8gICAgYWRkIGMsIHZhbHVlIG9mIGMgaXMgZGVzdFN0eWxlcy5jXG4vLyAgICBtYXliZSByZW1vdmUgYSwgYWthIGNhbGwgd2lsbExlYXZlKGEpLCB0aGVuIG1lcmdlZCBpcyBlaXRoZXIge2IsIGN9IG9yIHthLCBiLCBjfVxuLy8gdHVybiBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBmcm9tIHthLCBifSBpbnRvIHthPywgYiwgY31cbi8vICAgIG1heWJlIHJlbW92ZSBhXG4vLyAgICBjZXJ0YWlubHkgYWRkIGMsIHZhbHVlIG9mIGMgaXMgd2lsbEVudGVyKGMpXG4vLyBsb29wIG92ZXIgbWVyZ2VkIGFuZCBjb25zdHJ1Y3QgbmV3IGN1cnJlbnRcbi8vIGRlc3QgZG9lc24ndCBjaGFuZ2UsIHRoYXQncyBvd25lcidzXG5mdW5jdGlvbiBtZXJnZUFuZFN5bmMod2lsbEVudGVyLCB3aWxsTGVhdmUsIG9sZE1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBvbGRDdXJyZW50U3R5bGVzLCBvbGRDdXJyZW50VmVsb2NpdGllcywgb2xkTGFzdElkZWFsU3R5bGVzLCBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzKSB7XG4gIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZURpZmYyWydkZWZhdWx0J10ob2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIGZ1bmN0aW9uIChvbGRJbmRleCwgb2xkTWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgIHZhciBsZWF2aW5nU3R5bGUgPSB3aWxsTGVhdmUob2xkTWVyZ2VkUHJvcHNTdHlsZSk7XG4gICAgaWYgKGxlYXZpbmdTdHlsZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKG9sZEN1cnJlbnRTdHlsZXNbb2xkSW5kZXhdLCBsZWF2aW5nU3R5bGUsIG9sZEN1cnJlbnRWZWxvY2l0aWVzW29sZEluZGV4XSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IG9sZE1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBvbGRNZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBsZWF2aW5nU3R5bGUgfTtcbiAgfSk7XG5cbiAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG4gIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldO1xuICAgIHZhciBmb3VuZE9sZEluZGV4ID0gbnVsbDtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9sZE1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAob2xkTWVyZ2VkUHJvcHNTdHlsZXNbal0ua2V5ID09PSBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgZm91bmRPbGRJbmRleCA9IGo7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICBpZiAoZm91bmRPbGRJbmRleCA9PSBudWxsKSB7XG4gICAgICB2YXIgcGxhaW5TdHlsZSA9IHdpbGxFbnRlcihuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCk7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IHBsYWluU3R5bGU7XG5cbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHZhciB2ZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10obmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwuc3R5bGUpO1xuICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG9sZEN1cnJlbnRTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBvbGRMYXN0SWRlYWxTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IG9sZEN1cnJlbnRWZWxvY2l0aWVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG9sZExhc3RJZGVhbFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtuZXdNZXJnZWRQcm9wc1N0eWxlcywgbmV3Q3VycmVudFN0eWxlcywgbmV3Q3VycmVudFZlbG9jaXRpZXMsIG5ld0xhc3RJZGVhbFN0eWxlcywgbmV3TGFzdElkZWFsVmVsb2NpdGllc107XG59XG5cbnZhciBUcmFuc2l0aW9uTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUcmFuc2l0aW9uTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdC5Qcm9wVHlwZXMuZnVuYywgX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAga2V5OiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGF0YTogX3JlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWRcbiAgICB9KSldKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB3aWxsTGVhdmU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB3aWxsRW50ZXI6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWxsRW50ZXI6IGZ1bmN0aW9uIHdpbGxFbnRlcihzdHlsZVRoYXRFbnRlcmVkKSB7XG4gICAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZVRoYXRFbnRlcmVkLnN0eWxlKTtcbiAgICAgIH0sXG4gICAgICAvLyByZWNhbGw6IHJldHVybmluZyBudWxsIG1ha2VzIHRoZSBjdXJyZW50IHVubW91bnRpbmcgVHJhbnNpdGlvblN0eWxlXG4gICAgICAvLyBkaXNhcHBlYXIgaW1tZWRpYXRlbHlcbiAgICAgIHdpbGxMZWF2ZTogZnVuY3Rpb24gd2lsbExlYXZlKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG4gICAgdmFyIHdpbGxFbnRlciA9IF9wcm9wcy53aWxsRW50ZXI7XG4gICAgdmFyIHdpbGxMZWF2ZSA9IF9wcm9wcy53aWxsTGVhdmU7XG5cbiAgICB2YXIgZGVzdFN0eWxlcyA9IHR5cGVvZiBzdHlsZXMgPT09ICdmdW5jdGlvbicgPyBzdHlsZXMoZGVmYXVsdFN0eWxlcykgOiBzdHlsZXM7XG5cbiAgICAvLyB0aGlzIGlzIHNwZWNpYWwuIGZvciB0aGUgZmlyc3QgdGltZSBhcm91bmQsIHdlIGRvbid0IGhhdmUgYSBjb21wYXJpc29uXG4gICAgLy8gYmV0d2VlbiBsYXN0IChubyBsYXN0KSBhbmQgY3VycmVudCBtZXJnZWQgcHJvcHMuIHdlJ2xsIGNvbXB1dGUgbGFzdCBzbzpcbiAgICAvLyBzYXkgZGVmYXVsdCBpcyB7YSwgYn0gYW5kIHN0eWxlcyAoZGVzdCBzdHlsZSkgaXMge2IsIGN9LCB3ZSdsbFxuICAgIC8vIGZhYnJpY2F0ZSBsYXN0IGFzIHthLCBifVxuICAgIHZhciBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZGVmYXVsdFN0eWxlcyA9PSBudWxsKSB7XG4gICAgICBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IGRlc3RTdHlsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKGRlZmF1bHRTdHlsZUNlbGwpIHtcbiAgICAgICAgLy8gVE9ETzoga2V5IHNlYXJjaCBjb2RlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChkZXN0U3R5bGVzW2ldLmtleSA9PT0gZGVmYXVsdFN0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0U3R5bGVzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFN0eWxlQ2VsbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgb2xkQ3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSkgOiBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuICAgIHZhciBvbGRDdXJyZW50VmVsb2NpdGllcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KTtcblxuICAgIHZhciBfbWVyZ2VBbmRTeW5jID0gbWVyZ2VBbmRTeW5jKFxuICAgIC8vICRGbG93Rml4TWVcbiAgICB3aWxsRW50ZXIsXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHdpbGxMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRDdXJyZW50U3R5bGVzLCAvLyBvbGRMYXN0SWRlYWxTdHlsZXMgcmVhbGx5XG4gICAgb2xkQ3VycmVudFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luY1swXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmNbMV07XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1syXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luY1szXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmNbNF07XG4gICAgLy8gb2xkTGFzdElkZWFsVmVsb2NpdGllcyByZWFsbHlcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzXG4gICAgfTtcbiAgfSxcblxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGVzOiBudWxsLFxuICAvLyBhZnRlciBjaGVja2luZyBmb3IgdW5yZWFkUHJvcFN0eWxlcyAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUodW5yZWFkUHJvcFN0eWxlcykge1xuICAgIHZhciBfbWVyZ2VBbmRTeW5jMiA9IG1lcmdlQW5kU3luYyhcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy5wcm9wcy53aWxsRW50ZXIsXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHRoaXMucHJvcHMud2lsbExlYXZlLCB0aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luYzJbMF07XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlsxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMlsyXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luYzJbM107XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMls0XTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV0uc3R5bGU7XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIXVucmVhZFByb3BTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgY3VycmVudFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxTdHlsZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIG1lcmdlZFByb3BzU3R5bGVzW2ldID0ge1xuICAgICAgICAgICAgICBrZXk6IG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSxcbiAgICAgICAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0uZGF0YSxcbiAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0uc3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bmxpa2UgdGhlIG90aGVyIDIgY29tcG9uZW50cywgd2UgY2FuJ3QgZGV0ZWN0IHN0YWxlbmVzcyBhbmQgb3B0aW9uYWxseVxuICAgIC8vIG9wdCBvdXQgb2Ygc2V0U3RhdGUgaGVyZS4gZWFjaCBzdHlsZSBvYmplY3QncyBkYXRhIG1pZ2h0IGNvbnRhaW4gbmV3XG4gICAgLy8gc3R1ZmYgd2UncmUgbm90L2Nhbm5vdCBjb21wYXJlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgfSk7XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcHJvcFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcztcbiAgICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHByb3BTdHlsZXMgPT09ICdmdW5jdGlvbicgPyBwcm9wU3R5bGVzKHJlaHlkcmF0ZVN0eWxlcyhfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgX3RoaXMudW5yZWFkUHJvcFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKSkgOiBwcm9wU3R5bGVzO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBfbWVyZ2VBbmRTeW5jMyA9IG1lcmdlQW5kU3luYyhcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIF90aGlzLnByb3BzLndpbGxFbnRlcixcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIF90aGlzLnByb3BzLndpbGxMZWF2ZSwgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1swXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luYzNbMV07XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1syXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1szXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzNbNF07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3TWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGUgPSBuZXdNZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3TWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgICAgICAgIGlmICghbmV3TWVyZ2VkUHJvcHNTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IG5ld01lcmdlZFByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IG5ld0xhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgICBtZXJnZWRQcm9wc1N0eWxlczogbmV3TWVyZ2VkUHJvcHNTdHlsZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcHMuc3R5bGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBwcm9wcy5zdHlsZXMocmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gcHJvcHMuc3R5bGVzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGh5ZHJhdGVkU3R5bGVzID0gcmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4oaHlkcmF0ZWRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVHJhbnNpdGlvbk1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vLyBsaXN0IG9mIHN0eWxlcywgZWFjaCBjb250YWluaW5nIGludGVycG9sYXRpbmcgdmFsdWVzLiBQYXJ0IG9mIHdoYXQncyBwYXNzZWRcbi8vIHRvIGNoaWxkcmVuIGZ1bmN0aW9uLiBOb3RpY2UgdGhhdCB0aGlzIGlzXG4vLyBBcnJheTxBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3Q+LCB3aXRob3V0IHRoZSB3cmFwcGVyIHRoYXQgaXMge2tleTogLi4uLFxuLy8gZGF0YTogLi4uIHN0eWxlOiBBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3R9LiBPbmx5IG1lcmdlZFByb3BzU3R5bGVzXG4vLyBjb250YWlucyB0aGUga2V5ICYgZGF0YSBpbmZvIChzbyB0aGF0IHdlIG9ubHkgaGF2ZSBhIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcbi8vIGZvciB0aGVzZSwgYW5kIHRvIHNhdmUgc3BhY2UpLiBDaGVjayB0aGUgY29tbWVudCBmb3IgYHJlaHlkcmF0ZVN0eWxlc2AgdG9cbi8vIHNlZSBob3cgd2UgcmVnZW5lcmF0ZSB0aGUgZW50aXJldHkgb2Ygd2hhdCdzIHBhc3NlZCB0byBjaGlsZHJlbiBmdW5jdGlvblxuXG4vLyB0aGUgYXJyYXkgdGhhdCBrZWVwcyB0cmFjayBvZiBjdXJyZW50bHkgcmVuZGVyZWQgc3R1ZmYhIEluY2x1ZGluZyBzdHVmZlxuLy8gdGhhdCB5b3UndmUgdW5tb3VudGVkIGJ1dCB0aGF0J3Mgc3RpbGwgYW5pbWF0aW5nLiBUaGlzIGlzIHdoZXJlIGl0IGxpdmVzIiwiXG5cbi8vIGN1cnJlbnRseSB1c2VkIHRvIGluaXRpYXRlIHRoZSB2ZWxvY2l0eSBzdHlsZSBvYmplY3QgdG8gMFxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWFwVG9aZXJvO1xuXG5mdW5jdGlvbiBtYXBUb1plcm8ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0W2tleV0gPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gY29yZSBrZXlzIG1lcmdpbmcgYWxnb3JpdGhtLiBJZiBwcmV2aW91cyByZW5kZXIncyBrZXlzIGFyZSBbYSwgYl0sIGFuZCB0aGVcbi8vIG5leHQgcmVuZGVyJ3MgW2MsIGIsIGRdLCB3aGF0J3MgdGhlIGZpbmFsIG1lcmdlZCBrZXlzIGFuZCBvcmRlcmluZz9cblxuLy8gLSBjIGFuZCBhIG11c3QgYm90aCBiZSBiZWZvcmUgYlxuLy8gLSBiIGJlZm9yZSBkXG4vLyAtIG9yZGVyaW5nIGJldHdlZW4gYSBhbmQgYyBhbWJpZ3VvdXNcblxuLy8gdGhpcyByZWR1Y2VzIHRvIG1lcmdpbmcgdHdvIHBhcnRpYWxseSBvcmRlcmVkIGxpc3RzIChlLmcuIGxpc3RzIHdoZXJlIG5vdFxuLy8gZXZlcnkgaXRlbSBoYXMgYSBkZWZpbml0ZSBvcmRlcmluZywgbGlrZSBjb21wYXJpbmcgYSBhbmQgYyBhYm92ZSkuIEZvciB0aGVcbi8vIGFtYmlndW91cyBvcmRlcmluZyB3ZSBkZXRlcm1pbmlzdGljYWxseSBjaG9vc2UgdG8gcGxhY2UgdGhlIG5leHQgcmVuZGVyJ3Ncbi8vIGl0ZW0gYWZ0ZXIgdGhlIHByZXZpb3VzJzsgc28gYyBhZnRlciBhXG5cbi8vIHRoaXMgaXMgY2FsbGVkIGEgdG9wb2xvZ2ljYWwgc29ydGluZy4gRXhjZXB0IHRoZSBleGlzdGluZyBhbGdvcml0aG1zIGRvbid0XG4vLyB3b3JrIHdlbGwgd2l0aCBqcyBiYyBvZiB0aGUgYW1vdW50IG9mIGFsbG9jYXRpb24sIGFuZCBpc24ndCBvcHRpbWl6ZWQgZm9yIG91clxuLy8gY3VycmVudCB1c2UtY2FzZSBiYyB0aGUgcnVudGltZSBpcyBsaW5lYXIgaW4gdGVybXMgb2YgZWRnZXMgKHNlZSB3aWtpIGZvclxuLy8gbWVhbmluZyksIHdoaWNoIGlzIGh1Z2Ugd2hlbiB0d28gbGlzdHMgaGF2ZSBtYW55IGNvbW1vbiBlbGVtZW50c1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWVyZ2VEaWZmO1xuXG5mdW5jdGlvbiBtZXJnZURpZmYocHJldiwgbmV4dCwgb25SZW1vdmUpIHtcbiAgLy8gYm9va2tlZXBpbmcgZm9yIGVhc2llciBhY2Nlc3Mgb2YgYSBrZXkncyBpbmRleCBiZWxvdy4gVGhpcyBpcyAyIGFsbG9jYXRpb25zICtcbiAgLy8gcG90ZW50aWFsbHkgdHJpZ2dlcmluZyBjaHJvbWUgaGFzaCBtYXAgbW9kZSBmb3Igb2JqcyAoc28gaXQgbWlnaHQgYmUgZmFzdGVyXG5cbiAgdmFyIHByZXZLZXlJbmRleCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBwcmV2S2V5SW5kZXhbcHJldltpXS5rZXldID0gaTtcbiAgfVxuICB2YXIgbmV4dEtleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIG5leHRLZXlJbmRleFtuZXh0W2ldLmtleV0gPSBpO1xuICB9XG5cbiAgLy8gZmlyc3QsIGFuIG92ZXJseSBlbGFib3JhdGUgd2F5IG9mIG1lcmdpbmcgcHJldiBhbmQgbmV4dCwgZWxpbWluYXRpbmdcbiAgLy8gZHVwbGljYXRlcyAoaW4gdGVybXMgb2Yga2V5cykuIElmIHRoZXJlJ3MgZHVwZSwga2VlcCB0aGUgaXRlbSBpbiBuZXh0KS5cbiAgLy8gVGhpcyB3YXkgb2Ygd3JpdGluZyBpdCBzYXZlcyBhbGxvY2F0aW9uc1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIHJldFtpXSA9IG5leHRbaV07XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFuZXh0S2V5SW5kZXguaGFzT3duUHJvcGVydHkocHJldltpXS5rZXkpKSB7XG4gICAgICAvLyB0aGlzIGlzIGNhbGxlZCBteSBUTSdzIGBtZXJnZUFuZFN5bmNgLCB3aGljaCBjYWxscyB3aWxsTGVhdmUuIFdlIGRvbid0XG4gICAgICAvLyBtZXJnZSBpbiBrZXlzIHRoYXQgdGhlIHVzZXIgZGVzaXJlcyB0byBraWxsXG4gICAgICB2YXIgZmlsbCA9IG9uUmVtb3ZlKGksIHByZXZbaV0pO1xuICAgICAgaWYgKGZpbGwgIT0gbnVsbCkge1xuICAgICAgICByZXQucHVzaChmaWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgYWxsIHRoZSBpdGVtcyBhbGwgcHJlc2VudC4gQ29yZSBzb3J0aW5nIGxvZ2ljIHRvIGhhdmUgdGhlIHJpZ2h0IG9yZGVyXG4gIHJldHVybiByZXQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHZhciBuZXh0T3JkZXJBID0gbmV4dEtleUluZGV4W2Eua2V5XTtcbiAgICB2YXIgbmV4dE9yZGVyQiA9IG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgdmFyIHByZXZPcmRlckEgPSBwcmV2S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBwcmV2T3JkZXJCID0gcHJldktleUluZGV4W2Iua2V5XTtcblxuICAgIGlmIChuZXh0T3JkZXJBICE9IG51bGwgJiYgbmV4dE9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gbmV4dFxuICAgICAgcmV0dXJuIG5leHRLZXlJbmRleFthLmtleV0gLSBuZXh0S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAocHJldk9yZGVyQSAhPSBudWxsICYmIHByZXZPcmRlckIgIT0gbnVsbCkge1xuICAgICAgLy8gYm90aCBrZXlzIGluIHByZXZcbiAgICAgIHJldHVybiBwcmV2S2V5SW5kZXhbYS5rZXldIC0gcHJldktleUluZGV4W2Iua2V5XTtcbiAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgIT0gbnVsbCkge1xuICAgICAgLy8ga2V5IGEgaW4gbmV4dCwga2V5IGIgaW4gcHJldlxuXG4gICAgICAvLyBob3cgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBiZXR3ZWVuIGEgYW5kIGI/IFdlIGZpbmQgYSBcInBpdm90XCIgKHRlcm1cbiAgICAgIC8vIGFidXNlKSwgYSBrZXkgcHJlc2VudCBpbiBib3RoIHByZXYgYW5kIG5leHQsIHRoYXQgaXMgc2FuZHdpY2hlZCBiZXR3ZWVuXG4gICAgICAvLyBhIGFuZCBiLiBJbiB0aGUgY29udGV4dCBvZiBvdXIgYWJvdmUgZXhhbXBsZSwgaWYgd2UncmUgY29tcGFyaW5nIGEgYW5kXG4gICAgICAvLyBkLCBiJ3MgKHRoZSBvbmx5KSBwaXZvdFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgICBpZiAoIXByZXZLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwaXZvdCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0T3JkZXJBIDwgbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCID4gcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJBID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBwbHVnZ2FibGUuIGRlZmF1bHQgdG86IG5leHQgYmlnZ2VyIHRoYW4gcHJldlxuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8vIHByZXZPcmRlckEsIG5leHRPcmRlckJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgaWYgKCFwcmV2S2V5SW5kZXguaGFzT3duUHJvcGVydHkocGl2b3QpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRPcmRlckIgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJCID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJBIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgcmV0dXJuIC0xO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyB0byBsb29wIHRocm91Z2ggYW5kIGZpbmQgYSBrZXkncyBpbmRleCBlYWNoIHRpbWUpLCBidXQgSSBubyBsb25nZXIgY2FyZSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIG5vV29iYmxlOiB7IHN0aWZmbmVzczogMTcwLCBkYW1waW5nOiAyNiB9LCAvLyB0aGUgZGVmYXVsdCwgaWYgbm90aGluZyBwcm92aWRlZFxuICBnZW50bGU6IHsgc3RpZmZuZXNzOiAxMjAsIGRhbXBpbmc6IDE0IH0sXG4gIHdvYmJseTogeyBzdGlmZm5lc3M6IDE4MCwgZGFtcGluZzogMTIgfSxcbiAgc3RpZmY6IHsgc3RpZmZuZXNzOiAyMTAsIGRhbXBpbmc6IDIwIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqWydkZWZhdWx0J10gOiBvYmo7IH1cblxudmFyIF9Nb3Rpb24gPSByZXF1aXJlKCcuL01vdGlvbicpO1xuXG5leHBvcnRzLk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfTW90aW9uKTtcblxudmFyIF9TdGFnZ2VyZWRNb3Rpb24gPSByZXF1aXJlKCcuL1N0YWdnZXJlZE1vdGlvbicpO1xuXG5leHBvcnRzLlN0YWdnZXJlZE1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfU3RhZ2dlcmVkTW90aW9uKTtcblxudmFyIF9UcmFuc2l0aW9uTW90aW9uID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9uTW90aW9uJyk7XG5cbmV4cG9ydHMuVHJhbnNpdGlvbk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfVHJhbnNpdGlvbk1vdGlvbik7XG5cbnZhciBfc3ByaW5nID0gcmVxdWlyZSgnLi9zcHJpbmcnKTtcblxuZXhwb3J0cy5zcHJpbmcgPSBfaW50ZXJvcFJlcXVpcmUoX3NwcmluZyk7XG5cbnZhciBfcHJlc2V0cyA9IHJlcXVpcmUoJy4vcHJlc2V0cycpO1xuXG5leHBvcnRzLnByZXNldHMgPSBfaW50ZXJvcFJlcXVpcmUoX3ByZXNldHMpO1xuXG4vLyBkZXByZWNhdGVkLCBkdW1teSB3YXJuaW5nIGZ1bmN0aW9uXG5cbnZhciBfcmVvcmRlcktleXMgPSByZXF1aXJlKCcuL3Jlb3JkZXJLZXlzJyk7XG5cbmV4cG9ydHMucmVvcmRlcktleXMgPSBfaW50ZXJvcFJlcXVpcmUoX3Jlb3JkZXJLZXlzKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSByZW9yZGVyS2V5cztcblxudmFyIGhhc1dhcm5lZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiByZW9yZGVyS2V5cygpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgaWYgKCFoYXNXYXJuZWQpIHtcbiAgICAgIGhhc1dhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCdgcmVvcmRlcktleXNgIGhhcyBiZWVuIHJlbW92ZWQsIHNpbmNlIGl0IGlzIG5vIGxvbmdlciBuZWVkZWQgZm9yIFRyYW5zaXRpb25Nb3Rpb25cXCdzIG5ldyBzdHlsZXMgYXJyYXkgQVBJLicpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gdXNhZ2UgYXNzdW1wdGlvbjogY3VycmVudFN0eWxlIHZhbHVlcyBoYXZlIGFscmVhZHkgYmVlbiByZW5kZXJlZCBidXQgaXQgc2F5c1xuLy8gbm90aGluZyBvZiB3aGV0aGVyIGN1cnJlbnRTdHlsZSBpcyBzdGFsZSAoc2VlIHVucmVhZFByb3BTdHlsZSlcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNob3VsZFN0b3BBbmltYXRpb247XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb24oY3VycmVudFN0eWxlLCBzdHlsZSwgY3VycmVudFZlbG9jaXR5KSB7XG4gIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIGlmICghc3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRWZWxvY2l0eVtrZXldICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlVmFsdWUgPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gICAgLy8gc3RlcHBlciB3aWxsIGhhdmUgYWxyZWFkeSB0YWtlbiBjYXJlIG9mIHJvdW5kaW5nIHByZWNpc2lvbiBlcnJvcnMsIHNvXG4gICAgLy8gd29uJ3QgaGF2ZSBzdWNoIHRoaW5nIGFzIDAuOTk5OSAhPT09IDFcbiAgICBpZiAoY3VycmVudFN0eWxlW2tleV0gIT09IHN0eWxlVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBzcHJpbmc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbnZhciBfcHJlc2V0czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVzZXRzKTtcblxudmFyIGRlZmF1bHRDb25maWcgPSBfZXh0ZW5kcyh7fSwgX3ByZXNldHMyWydkZWZhdWx0J10ubm9Xb2JibGUsIHtcbiAgcHJlY2lzaW9uOiAwLjAxXG59KTtcblxuZnVuY3Rpb24gc3ByaW5nKHZhbCwgY29uZmlnKSB7XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnLCB7IHZhbDogdmFsIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gc3RlcHBlciBpcyB1c2VkIGEgbG90LiBTYXZlcyBhbGxvY2F0aW9uIHRvIHJldHVybiB0aGUgc2FtZSBhcnJheSB3cmFwcGVyLlxuLy8gVGhpcyBpcyBmaW5lIGFuZCBkYW5nZXItZnJlZSBhZ2FpbnN0IG11dGF0aW9ucyBiZWNhdXNlIHRoZSBjYWxsc2l0ZVxuLy8gaW1tZWRpYXRlbHkgZGVzdHJ1Y3R1cmVzIGl0IGFuZCBnZXRzIHRoZSBudW1iZXJzIGluc2lkZSB3aXRob3V0IHBhc3NpbmcgdGhlXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc3RlcHBlcjtcblxudmFyIHJldXNlZFR1cGxlID0gW107XG5cbmZ1bmN0aW9uIHN0ZXBwZXIoc2Vjb25kUGVyRnJhbWUsIHgsIHYsIGRlc3RYLCBrLCBiLCBwcmVjaXNpb24pIHtcbiAgLy8gU3ByaW5nIHN0aWZmbmVzcywgaW4ga2cgLyBzXjJcblxuICAvLyBmb3IgYW5pbWF0aW9ucywgZGVzdFggaXMgcmVhbGx5IHNwcmluZyBsZW5ndGggKHNwcmluZyBhdCByZXN0KS4gaW5pdGlhbFxuICAvLyBwb3NpdGlvbiBpcyBjb25zaWRlcmVkIGFzIHRoZSBzdHJldGNoZWQvY29tcHJlc3NlZCBwb3NpdGlvbiBvZiBhIHNwcmluZ1xuICB2YXIgRnNwcmluZyA9IC1rICogKHggLSBkZXN0WCk7XG5cbiAgLy8gRGFtcGluZywgaW4ga2cgLyBzXG4gIHZhciBGZGFtcGVyID0gLWIgKiB2O1xuXG4gIC8vIHVzdWFsbHkgd2UgcHV0IG1hc3MgaGVyZSwgYnV0IGZvciBhbmltYXRpb24gcHVycG9zZXMsIHNwZWNpZnlpbmcgbWFzcyBpcyBhXG4gIC8vIGJpdCByZWR1bmRhbnQuIHlvdSBjb3VsZCBzaW1wbHkgYWRqdXN0IGsgYW5kIGIgYWNjb3JkaW5nbHlcbiAgLy8gbGV0IGEgPSAoRnNwcmluZyArIEZkYW1wZXIpIC8gbWFzcztcbiAgdmFyIGEgPSBGc3ByaW5nICsgRmRhbXBlcjtcblxuICB2YXIgbmV3ViA9IHYgKyBhICogc2Vjb25kUGVyRnJhbWU7XG4gIHZhciBuZXdYID0geCArIG5ld1YgKiBzZWNvbmRQZXJGcmFtZTtcblxuICBpZiAoTWF0aC5hYnMobmV3VikgPCBwcmVjaXNpb24gJiYgTWF0aC5hYnMobmV3WCAtIGRlc3RYKSA8IHByZWNpc2lvbikge1xuICAgIHJldXNlZFR1cGxlWzBdID0gZGVzdFg7XG4gICAgcmV1c2VkVHVwbGVbMV0gPSAwO1xuICAgIHJldHVybiByZXVzZWRUdXBsZTtcbiAgfVxuXG4gIHJldXNlZFR1cGxlWzBdID0gbmV3WDtcbiAgcmV1c2VkVHVwbGVbMV0gPSBuZXdWO1xuICByZXR1cm4gcmV1c2VkVHVwbGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG4vLyBhcnJheSByZWZlcmVuY2UgYXJvdW5kLiIsIlxuLy8gdHVybiB7eDoge3ZhbDogMSwgc3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSwgeTogMn0gZ2VuZXJhdGVkIGJ5XG4vLyBge3g6IHNwcmluZygxLCB7c3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSksIHk6IDJ9YCBpbnRvIHt4OiAxLCB5OiAyfVxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzdHJpcFN0eWxlO1xuXG5mdW5jdGlvbiBzdHJpcFN0eWxlKHN0eWxlKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLyplc2xpbnQtZGlzYWJsZSByZWFjdC9wcm9wLXR5cGVzICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYk1vdW50YWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL21vdW50YWJsZScpO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYkVsZW1lbnRUeXBlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvZWxlbWVudFR5cGUnKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYkVsZW1lbnRUeXBlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0UHJvcFR5cGVzTGliRWxlbWVudFR5cGUpO1xuXG52YXIgX1BvcnRhbCA9IHJlcXVpcmUoJy4vUG9ydGFsJyk7XG5cbnZhciBfUG9ydGFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BvcnRhbCk7XG5cbnZhciBfTW9kYWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9Nb2RhbE1hbmFnZXInKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTW9kYWxNYW5hZ2VyKTtcblxudmFyIF91dGlsc093bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF91dGlsc093bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNPd25lckRvY3VtZW50KTtcblxudmFyIF91dGlsc0FkZEV2ZW50TGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEV2ZW50TGlzdGVuZXInKTtcblxudmFyIF91dGlsc0FkZEV2ZW50TGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNBZGRFdmVudExpc3RlbmVyKTtcblxudmFyIF91dGlsc0FkZEZvY3VzTGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEZvY3VzTGlzdGVuZXInKTtcblxudmFyIF91dGlsc0FkZEZvY3VzTGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNBZGRGb2N1c0xpc3RlbmVyKTtcblxudmFyIF9kb21IZWxwZXJzVXRpbEluRE9NID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9pbkRPTScpO1xuXG52YXIgX2RvbUhlbHBlcnNVdGlsSW5ET00yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc1V0aWxJbkRPTSk7XG5cbnZhciBfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9hY3RpdmVFbGVtZW50Jyk7XG5cbnZhciBfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQpO1xuXG52YXIgX2RvbUhlbHBlcnNRdWVyeUNvbnRhaW5zID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvcXVlcnkvY29udGFpbnMnKTtcblxudmFyIF9kb21IZWxwZXJzUXVlcnlDb250YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzUXVlcnlDb250YWlucyk7XG5cbnZhciBfdXRpbHNHZXRDb250YWluZXIgPSByZXF1aXJlKCcuL3V0aWxzL2dldENvbnRhaW5lcicpO1xuXG52YXIgX3V0aWxzR2V0Q29udGFpbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzR2V0Q29udGFpbmVyKTtcblxudmFyIG1vZGFsTWFuYWdlciA9IG5ldyBfTW9kYWxNYW5hZ2VyMlsnZGVmYXVsdCddKCk7XG5cbi8qKlxuICogTG92ZSB0aGVtIG9yIGhhdGUgdGhlbSwgYDxNb2RhbC8+YCBwcm92aWRlcyBhIHNvbGlkIGZvdW5kYXRpb24gZm9yIGNyZWF0aW5nIGRpYWxvZ3MsIGxpZ2h0Ym94ZXMsIG9yIHdoYXRldmVyIGVsc2UuXG4gKiBUaGUgTW9kYWwgY29tcG9uZW50IHJlbmRlcnMgaXRzIGBjaGlsZHJlbmAgbm9kZSBpbiBmcm9udCBvZiBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAqXG4gKiBUaGUgTW9kYWwgb2ZmZXJzIGEgZmV3IGhlbHBmdWwgZmVhdHVyZXMgb3ZlciB1c2luZyBqdXN0IGEgYDxQb3J0YWwvPmAgY29tcG9uZW50IGFuZCBzb21lIHN0eWxlczpcbiAqXG4gKiAtIE1hbmFnZXMgZGlhbG9nIHN0YWNraW5nIHdoZW4gb25lLWF0LWEtdGltZSBqdXN0IGlzbid0IGVub3VnaC5cbiAqIC0gQ3JlYXRlcyBhIGJhY2tkcm9wLCBmb3IgZGlzYWJsaW5nIGludGVyYWN0aW9uIGJlbG93IHRoZSBtb2RhbC5cbiAqIC0gSXQgcHJvcGVybHkgbWFuYWdlcyBmb2N1czsgbW92aW5nIHRvIHRoZSBtb2RhbCBjb250ZW50LCBhbmQga2VlcGluZyBpdCB0aGVyZSB1bnRpbCB0aGUgbW9kYWwgaXMgY2xvc2VkLlxuICogLSBJdCBkaXNhYmxlcyBzY3JvbGxpbmcgb2YgdGhlIHBhZ2UgY29udGVudCB3aGlsZSBvcGVuLlxuICogLSBBZGRzIHRoZSBhcHByb3ByaWF0ZSBBUklBIHJvbGVzIGFyZSBhdXRvbWF0aWNhbGx5LlxuICogLSBFYXNpbHkgcGx1Z2dhYmxlIGFuaW1hdGlvbnMgdmlhIGEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudC5cbiAqXG4gKiBOb3RlIHRoYXQsIGluIHRoZSBzYW1lIHdheSB0aGUgYmFja2Ryb3AgZWxlbWVudCBwcmV2ZW50cyB1c2VycyBmcm9tIGNsaWNraW5nIG9yIGludGVyYWN0aW5nXG4gKiB3aXRoIHRoZSBwYWdlIGNvbnRlbnQgdW5kZXJuZWF0aCB0aGUgTW9kYWwsIFNjcmVlbiByZWFkZXJzIGFsc28gbmVlZCB0byBiZSBzaWduYWxlZCB0byBub3QgdG9cbiAqIGludGVyYWN0IHdpdGggcGFnZSBjb250ZW50IHdoaWxlIHRoZSBNb2RhbCBpcyBvcGVuLiBUbyBkbyB0aGlzLCB3ZSB1c2UgYSBjb21tb24gdGVjaG5pcXVlIG9mIGFwcGx5aW5nXG4gKiB0aGUgYGFyaWEtaGlkZGVuPSd0cnVlJ2AgYXR0cmlidXRlIHRvIHRoZSBub24tTW9kYWwgZWxlbWVudHMgaW4gdGhlIE1vZGFsIGBjb250YWluZXJgLiBUaGlzIG1lYW5zIHRoYXQgZm9yXG4gKiBhIE1vZGFsIHRvIGJlIHRydWx5IG1vZGFsLCBpdCBzaG91bGQgaGF2ZSBhIGBjb250YWluZXJgIHRoYXQgaXMgX291dHNpZGVfIHlvdXIgYXBwJ3NcbiAqIFJlYWN0IGhpZXJhcmNoeSAoc3VjaCBhcyB0aGUgZGVmYXVsdDogZG9jdW1lbnQuYm9keSkuXG4gKi9cbnZhciBNb2RhbCA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW9kYWwnLFxuXG4gIHByb3BUeXBlczogX2V4dGVuZHMoe30sIF9Qb3J0YWwyWydkZWZhdWx0J10ucHJvcFR5cGVzLCB7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIE1vZGFsXG4gICAgICovXG4gICAgc2hvdzogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogQSBOb2RlLCBDb21wb25lbnQgaW5zdGFuY2UsIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBlaXRoZXIuIFRoZSBNb2RhbCBpcyBhcHBlbmRlZCB0byBpdCdzIGNvbnRhaW5lciBlbGVtZW50LlxuICAgICAqXG4gICAgICogRm9yIHRoZSBzYWtlIG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSBjb250YWluZXIgc2hvdWxkIHVzdWFsbHkgYmUgdGhlIGRvY3VtZW50IGJvZHksIHNvIHRoYXQgdGhlIHJlc3Qgb2YgdGhlXG4gICAgICogcGFnZSBjb250ZW50IGNhbiBiZSBwbGFjZWQgYmVoaW5kIGEgdmlydHVhbCBiYWNrZHJvcCBhcyB3ZWxsIGFzIGEgdmlzdWFsIG9uZS5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyWydkZWZhdWx0J10sIF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuY10pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBNb2RhbCBpcyBvcGVuaW5nLlxuICAgICAqL1xuICAgIG9uU2hvdzogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIGVpdGhlciB0aGUgYmFja2Ryb3AgaXMgY2xpY2tlZCwgb3IgdGhlIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAgICAgKlxuICAgICAqIFRoZSBgb25IaWRlYCBjYWxsYmFjayBvbmx5IHNpZ25hbHMgaW50ZW50IGZyb20gdGhlIE1vZGFsLFxuICAgICAqIHlvdSBtdXN0IGFjdHVhbGx5IHNldCB0aGUgYHNob3dgIHByb3AgdG8gYGZhbHNlYCBmb3IgdGhlIE1vZGFsIHRvIGNsb3NlLlxuICAgICAqL1xuICAgIG9uSGlkZTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogSW5jbHVkZSBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCwgX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZihbJ3N0YXRpYyddKV0pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBlc2NhcGUga2V5LCBpZiBzcGVjaWZpZWQgaW4gYGtleWJvYXJkYCwgaXMgcHJlc3NlZC5cbiAgICAgKi9cbiAgICBvbkVzY2FwZUtleVVwOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGJhY2tkcm9wLCBpZiBzcGVjaWZpZWQsIGlzIGNsaWNrZWQuXG4gICAgICovXG4gICAgb25CYWNrZHJvcENsaWNrOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIHN0eWxlIG9iamVjdCBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcFN0eWxlOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8qKlxuICAgICAqIEEgY3NzIGNsYXNzIG9yIGNsYXNzZXMgZm9yIHRoZSBiYWNrZHJvcCBjb21wb25lbnQuXG4gICAgICovXG4gICAgYmFja2Ryb3BDbGFzc05hbWU6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3Igc2V0IG9mIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgbW9kYWwgY29udGFpbmVyIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4sXG4gICAgICogYW5kIHJlbW92ZWQgd2hlbiBpdCBpcyBjbG9zZWQuXG4gICAgICovXG4gICAgY29udGFpbmVyQ2xhc3NOYW1lOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZFxuICAgICAqL1xuICAgIGtleWJvYXJkOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIGA8VHJhbnNpdGlvbi8+YCBjb21wb25lbnQgdG8gdXNlIGZvciB0aGUgZGlhbG9nIGFuZCBiYWNrZHJvcCBjb21wb25lbnRzLlxuICAgICAqL1xuICAgIHRyYW5zaXRpb246IF9yZWFjdFByb3BUeXBlc0xpYkVsZW1lbnRUeXBlMlsnZGVmYXVsdCddLFxuXG4gICAgLyoqXG4gICAgICogVGhlIGB0aW1lb3V0YCBvZiB0aGUgZGlhbG9nIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0XG4gICAgICogdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8qKlxuICAgICAqIFRoZSBgdGltZW91dGAgb2YgdGhlIGJhY2tkcm9wIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvXG4gICAgICogZW5zdXJlIHRoYXQgdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBgdHJ1ZWAgVGhlIG1vZGFsIHdpbGwgYXV0b21hdGljYWxseSBzaGlmdCBmb2N1cyB0byBpdHNlbGYgd2hlbiBpdCBvcGVucywgYW5kXG4gICAgICogcmVwbGFjZSBpdCB0byB0aGUgbGFzdCBmb2N1c2VkIGVsZW1lbnQgd2hlbiBpdCBjbG9zZXMuIFRoaXMgYWxzb1xuICAgICAqIHdvcmtzIGNvcnJlY3RseSB3aXRoIGFueSBNb2RhbCBjaGlsZHJlbiB0aGF0IGhhdmUgdGhlIGBhdXRvRm9jdXNgIHByb3AuXG4gICAgICpcbiAgICAgKiBHZW5lcmFsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgc2V0IHRvIGBmYWxzZWAgYXMgaXQgbWFrZXMgdGhlIE1vZGFsIGxlc3NcbiAgICAgKiBhY2Nlc3NpYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGxpa2Ugc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgYXV0b0ZvY3VzOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGB0cnVlYCBUaGUgbW9kYWwgd2lsbCBwcmV2ZW50IGZvY3VzIGZyb20gbGVhdmluZyB0aGUgTW9kYWwgd2hpbGUgb3Blbi5cbiAgICAgKlxuICAgICAqIEdlbmVyYWxseSB0aGlzIHNob3VsZCBuZXZlciBiZSBzZXQgdG8gYGZhbHNlYCBhcyBpdCBtYWtlcyB0aGUgTW9kYWwgbGVzc1xuICAgICAqIGFjY2Vzc2libGUgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgbGlrZSBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBlbmZvcmNlRm9jdXM6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGJlZm9yZSB0aGUgTW9kYWwgdHJhbnNpdGlvbnMgaW5cbiAgICAgKi9cbiAgICBvbkVudGVyOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhcyB0aGUgTW9kYWwgYmVnaW5zIHRvIHRyYW5zaXRpb24gaW5cbiAgICAgKi9cbiAgICBvbkVudGVyaW5nOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgTW9kYWwgZmluaXNoZXMgdHJhbnNpdGlvbmluZyBpblxuICAgICAqL1xuICAgIG9uRW50ZXJlZDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSBNb2RhbCB0cmFuc2l0aW9ucyBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFzIHRoZSBNb2RhbCBiZWdpbnMgdG8gdHJhbnNpdGlvbiBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXRpbmc6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBNb2RhbCBmaW5pc2hlcyB0cmFuc2l0aW9uaW5nIG91dFxuICAgICAqL1xuICAgIG9uRXhpdGVkOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmNcblxuICB9KSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICBhdXRvRm9jdXM6IHRydWUsXG4gICAgICBlbmZvcmNlRm9jdXM6IHRydWUsXG4gICAgICBvbkhpZGU6IG5vb3BcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGV4aXRlZDogIXRoaXMucHJvcHMuc2hvdyB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBjaGlsZHJlbiA9IF9wcm9wcy5jaGlsZHJlbjtcbiAgICB2YXIgVHJhbnNpdGlvbiA9IF9wcm9wcy50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcCA9IF9wcm9wcy5iYWNrZHJvcDtcbiAgICB2YXIgZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQgPSBfcHJvcHMuZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQ7XG5cbiAgICB2YXIgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3Byb3BzLCBbJ2NoaWxkcmVuJywgJ3RyYW5zaXRpb24nLCAnYmFja2Ryb3AnLCAnZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQnXSk7XG5cbiAgICB2YXIgb25FeGl0ID0gcHJvcHMub25FeGl0O1xuICAgIHZhciBvbkV4aXRpbmcgPSBwcm9wcy5vbkV4aXRpbmc7XG4gICAgdmFyIG9uRW50ZXIgPSBwcm9wcy5vbkVudGVyO1xuICAgIHZhciBvbkVudGVyaW5nID0gcHJvcHMub25FbnRlcmluZztcbiAgICB2YXIgb25FbnRlcmVkID0gcHJvcHMub25FbnRlcmVkO1xuXG4gICAgdmFyIHNob3cgPSAhIXByb3BzLnNob3c7XG4gICAgdmFyIGRpYWxvZyA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgdmFyIG1vdW50TW9kYWwgPSBzaG93IHx8IFRyYW5zaXRpb24gJiYgIXRoaXMuc3RhdGUuZXhpdGVkO1xuXG4gICAgaWYgKCFtb3VudE1vZGFsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgX2RpYWxvZyRwcm9wcyA9IGRpYWxvZy5wcm9wcztcbiAgICB2YXIgcm9sZSA9IF9kaWFsb2ckcHJvcHMucm9sZTtcbiAgICB2YXIgdGFiSW5kZXggPSBfZGlhbG9nJHByb3BzLnRhYkluZGV4O1xuXG4gICAgaWYgKHJvbGUgPT09IHVuZGVmaW5lZCB8fCB0YWJJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkaWFsb2cgPSBfcmVhY3QuY2xvbmVFbGVtZW50KGRpYWxvZywge1xuICAgICAgICByb2xlOiByb2xlID09PSB1bmRlZmluZWQgPyAnZG9jdW1lbnQnIDogcm9sZSxcbiAgICAgICAgdGFiSW5kZXg6IHRhYkluZGV4ID09IG51bGwgPyAnLTEnIDogdGFiSW5kZXhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChUcmFuc2l0aW9uKSB7XG4gICAgICBkaWFsb2cgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgVHJhbnNpdGlvbixcbiAgICAgICAge1xuICAgICAgICAgIHRyYW5zaXRpb25BcHBlYXI6IHRydWUsXG4gICAgICAgICAgdW5tb3VudE9uRXhpdDogdHJ1ZSxcbiAgICAgICAgICAnaW4nOiBzaG93LFxuICAgICAgICAgIHRpbWVvdXQ6IGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0LFxuICAgICAgICAgIG9uRXhpdDogb25FeGl0LFxuICAgICAgICAgIG9uRXhpdGluZzogb25FeGl0aW5nLFxuICAgICAgICAgIG9uRXhpdGVkOiB0aGlzLmhhbmRsZUhpZGRlbixcbiAgICAgICAgICBvbkVudGVyOiBvbkVudGVyLFxuICAgICAgICAgIG9uRW50ZXJpbmc6IG9uRW50ZXJpbmcsXG4gICAgICAgICAgb25FbnRlcmVkOiBvbkVudGVyZWRcbiAgICAgICAgfSxcbiAgICAgICAgZGlhbG9nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgIF9Qb3J0YWwyWydkZWZhdWx0J10sXG4gICAgICB7XG4gICAgICAgIHJlZjogdGhpcy5zZXRNb3VudE5vZGUsXG4gICAgICAgIGNvbnRhaW5lcjogcHJvcHMuY29udGFpbmVyXG4gICAgICB9LFxuICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgcmVmOiAnbW9kYWwnLFxuICAgICAgICAgIHJvbGU6IHByb3BzLnJvbGUgfHwgJ2RpYWxvZycsXG4gICAgICAgICAgc3R5bGU6IHByb3BzLnN0eWxlLFxuICAgICAgICAgIGNsYXNzTmFtZTogcHJvcHMuY2xhc3NOYW1lXG4gICAgICAgIH0sXG4gICAgICAgIGJhY2tkcm9wICYmIHRoaXMucmVuZGVyQmFja2Ryb3AoKSxcbiAgICAgICAgZGlhbG9nXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXJCYWNrZHJvcDogZnVuY3Rpb24gcmVuZGVyQmFja2Ryb3AoKSB7XG4gICAgdmFyIF9wcm9wczIgPSB0aGlzLnByb3BzO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzMi50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0ID0gX3Byb3BzMi5iYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0O1xuXG4gICAgdmFyIGJhY2tkcm9wID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgcmVmOiAnYmFja2Ryb3AnLFxuICAgICAgc3R5bGU6IHRoaXMucHJvcHMuYmFja2Ryb3BTdHlsZSxcbiAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5iYWNrZHJvcENsYXNzTmFtZSxcbiAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQmFja2Ryb3BDbGlja1xuICAgIH0pO1xuXG4gICAgaWYgKFRyYW5zaXRpb24pIHtcbiAgICAgIGJhY2tkcm9wID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFRyYW5zaXRpb24sXG4gICAgICAgIHsgdHJhbnNpdGlvbkFwcGVhcjogdHJ1ZSxcbiAgICAgICAgICAnaW4nOiB0aGlzLnByb3BzLnNob3csXG4gICAgICAgICAgdGltZW91dDogYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dFxuICAgICAgICB9LFxuICAgICAgICBiYWNrZHJvcFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFja2Ryb3A7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IGZhbHNlIH0pO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy50cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgbGV0IGhhbmRsZUhpZGRlbiB0YWtlIGNhcmUgb2YgbWFya2luZyBleGl0ZWQuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiB0cnVlIH0pO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5jaGVja0ZvckZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICB2YXIgdHJhbnNpdGlvbiA9IHRoaXMucHJvcHMudHJhbnNpdGlvbjtcblxuICAgIGlmIChwcmV2UHJvcHMuc2hvdyAmJiAhdGhpcy5wcm9wcy5zaG93ICYmICF0cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgaGFuZGxlSGlkZGVuIHdpbGwgY2FsbCB0aGlzLlxuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2UgaWYgKCFwcmV2UHJvcHMuc2hvdyAmJiB0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB2YXIgX3Byb3BzMyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHNob3cgPSBfcHJvcHMzLnNob3c7XG4gICAgdmFyIHRyYW5zaXRpb24gPSBfcHJvcHMzLnRyYW5zaXRpb247XG5cbiAgICBpZiAoc2hvdyB8fCB0cmFuc2l0aW9uICYmICF0aGlzLnN0YXRlLmV4aXRlZCkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgb25TaG93OiBmdW5jdGlvbiBvblNob3coKSB7XG4gICAgdmFyIGRvYyA9IF91dGlsc093bmVyRG9jdW1lbnQyWydkZWZhdWx0J10odGhpcyk7XG4gICAgdmFyIGNvbnRhaW5lciA9IF91dGlsc0dldENvbnRhaW5lcjJbJ2RlZmF1bHQnXSh0aGlzLnByb3BzLmNvbnRhaW5lciwgZG9jLmJvZHkpO1xuXG4gICAgbW9kYWxNYW5hZ2VyLmFkZCh0aGlzLCBjb250YWluZXIsIHRoaXMucHJvcHMuY29udGFpbmVyQ2xhc3NOYW1lKTtcblxuICAgIHRoaXMuX29uRG9jdW1lbnRLZXl1cExpc3RlbmVyID0gX3V0aWxzQWRkRXZlbnRMaXN0ZW5lcjJbJ2RlZmF1bHQnXShkb2MsICdrZXl1cCcsIHRoaXMuaGFuZGxlRG9jdW1lbnRLZXlVcCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lciA9IF91dGlsc0FkZEZvY3VzTGlzdGVuZXIyWydkZWZhdWx0J10odGhpcy5lbmZvcmNlRm9jdXMpO1xuXG4gICAgdGhpcy5mb2N1cygpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25TaG93KSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcblxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHtcbiAgICBtb2RhbE1hbmFnZXIucmVtb3ZlKHRoaXMpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMucmVzdG9yZUxhc3RGb2N1cygpO1xuICB9LFxuXG4gIHNldE1vdW50Tm9kZTogZnVuY3Rpb24gc2V0TW91bnROb2RlKHJlZikge1xuICAgIHRoaXMubW91bnROb2RlID0gcmVmID8gcmVmLmdldE1vdW50Tm9kZSgpIDogcmVmO1xuICB9LFxuXG4gIGhhbmRsZUhpZGRlbjogZnVuY3Rpb24gaGFuZGxlSGlkZGVuKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IHRydWUgfSk7XG4gICAgdGhpcy5vbkhpZGUoKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uRXhpdGVkKSB7XG4gICAgICB2YXIgX3Byb3BzNDtcblxuICAgICAgKF9wcm9wczQgPSB0aGlzLnByb3BzKS5vbkV4aXRlZC5hcHBseShfcHJvcHM0LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVCYWNrZHJvcENsaWNrOiBmdW5jdGlvbiBoYW5kbGVCYWNrZHJvcENsaWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5vbkJhY2tkcm9wQ2xpY2soZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYmFja2Ryb3AgPT09IHRydWUpIHtcbiAgICAgIHRoaXMucHJvcHMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZURvY3VtZW50S2V5VXA6IGZ1bmN0aW9uIGhhbmRsZURvY3VtZW50S2V5VXAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmtleWJvYXJkICYmIGUua2V5Q29kZSA9PT0gMjcgJiYgdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm9uRXNjYXBlS2V5VXApIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkVzY2FwZUtleVVwKGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgY2hlY2tGb3JGb2N1czogZnVuY3Rpb24gY2hlY2tGb3JGb2N1cygpIHtcbiAgICBpZiAoX2RvbUhlbHBlcnNVdGlsSW5ET00yWydkZWZhdWx0J10pIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gX2RvbUhlbHBlcnNBY3RpdmVFbGVtZW50MlsnZGVmYXVsdCddKCk7XG4gICAgfVxuICB9LFxuXG4gIGZvY3VzOiBmdW5jdGlvbiBmb2N1cygpIHtcbiAgICB2YXIgYXV0b0ZvY3VzID0gdGhpcy5wcm9wcy5hdXRvRm9jdXM7XG4gICAgdmFyIG1vZGFsQ29udGVudCA9IHRoaXMuZ2V0RGlhbG9nRWxlbWVudCgpO1xuICAgIHZhciBjdXJyZW50ID0gX2RvbUhlbHBlcnNBY3RpdmVFbGVtZW50MlsnZGVmYXVsdCddKF91dGlsc093bmVyRG9jdW1lbnQyWydkZWZhdWx0J10odGhpcykpO1xuICAgIHZhciBmb2N1c0luTW9kYWwgPSBjdXJyZW50ICYmIF9kb21IZWxwZXJzUXVlcnlDb250YWluczJbJ2RlZmF1bHQnXShtb2RhbENvbnRlbnQsIGN1cnJlbnQpO1xuXG4gICAgaWYgKG1vZGFsQ29udGVudCAmJiBhdXRvRm9jdXMgJiYgIWZvY3VzSW5Nb2RhbCkge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBjdXJyZW50O1xuXG4gICAgICBpZiAoIW1vZGFsQ29udGVudC5oYXNBdHRyaWJ1dGUoJ3RhYkluZGV4JykpIHtcbiAgICAgICAgbW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAtMSk7XG4gICAgICAgIF93YXJuaW5nMlsnZGVmYXVsdCddKGZhbHNlLCAnVGhlIG1vZGFsIGNvbnRlbnQgbm9kZSBkb2VzIG5vdCBhY2NlcHQgZm9jdXMuICcgKyAnRm9yIHRoZSBiZW5lZml0IG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSB0YWJJbmRleCBvZiB0aGUgbm9kZSBpcyBiZWluZyBzZXQgdG8gXCItMVwiLicpO1xuICAgICAgfVxuXG4gICAgICBtb2RhbENvbnRlbnQuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVzdG9yZUxhc3RGb2N1czogZnVuY3Rpb24gcmVzdG9yZUxhc3RGb2N1cygpIHtcbiAgICAvLyBTdXBwb3J0OiA8PUlFMTEgZG9lc24ndCBzdXBwb3J0IGBmb2N1cygpYCBvbiBzdmcgZWxlbWVudHMgKFJCOiAjOTE3KVxuICAgIGlmICh0aGlzLmxhc3RGb2N1cyAmJiB0aGlzLmxhc3RGb2N1cy5mb2N1cykge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMuZm9jdXMoKTtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgZW5mb3JjZUZvY3VzOiBmdW5jdGlvbiBlbmZvcmNlRm9jdXMoKSB7XG4gICAgdmFyIGVuZm9yY2VGb2N1cyA9IHRoaXMucHJvcHMuZW5mb3JjZUZvY3VzO1xuXG4gICAgaWYgKCFlbmZvcmNlRm9jdXMgfHwgIXRoaXMuaXNNb3VudGVkKCkgfHwgIXRoaXMuaXNUb3BNb2RhbCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjdGl2ZSA9IF9kb21IZWxwZXJzQWN0aXZlRWxlbWVudDJbJ2RlZmF1bHQnXShfdXRpbHNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKHRoaXMpKTtcbiAgICB2YXIgbW9kYWwgPSB0aGlzLmdldERpYWxvZ0VsZW1lbnQoKTtcblxuICAgIGlmIChtb2RhbCAmJiBtb2RhbCAhPT0gYWN0aXZlICYmICFfZG9tSGVscGVyc1F1ZXJ5Q29udGFpbnMyWydkZWZhdWx0J10obW9kYWwsIGFjdGl2ZSkpIHtcbiAgICAgIG1vZGFsLmZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG4gIC8vaW5zdGVhZCBvZiBhIHJlZiwgd2hpY2ggbWlnaHQgY29uZmxpY3Qgd2l0aCBvbmUgdGhlIHBhcmVudCBhcHBsaWVkLlxuICBnZXREaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBnZXREaWFsb2dFbGVtZW50KCkge1xuICAgIHZhciBub2RlID0gdGhpcy5yZWZzLm1vZGFsO1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubGFzdENoaWxkO1xuICB9LFxuXG4gIGlzVG9wTW9kYWw6IGZ1bmN0aW9uIGlzVG9wTW9kYWwoKSB7XG4gICAgcmV0dXJuIG1vZGFsTWFuYWdlci5pc1RvcE1vZGFsKHRoaXMpO1xuICB9XG5cbn0pO1xuXG5Nb2RhbC5tYW5hZ2VyID0gbW9kYWxNYW5hZ2VyO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb2RhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIF9kb21IZWxwZXJzU3R5bGUgPSByZXF1aXJlKCdkb20taGVscGVycy9zdHlsZScpO1xuXG52YXIgX2RvbUhlbHBlcnNTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzU3R5bGUpO1xuXG52YXIgX2RvbUhlbHBlcnNDbGFzcyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2NsYXNzJyk7XG5cbnZhciBfZG9tSGVscGVyc0NsYXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNDbGFzcyk7XG5cbnZhciBfZG9tSGVscGVyc1V0aWxTY3JvbGxiYXJTaXplID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9zY3JvbGxiYXJTaXplJyk7XG5cbnZhciBfZG9tSGVscGVyc1V0aWxTY3JvbGxiYXJTaXplMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNVdGlsU2Nyb2xsYmFyU2l6ZSk7XG5cbnZhciBfdXRpbHNJc092ZXJmbG93aW5nID0gcmVxdWlyZSgnLi91dGlscy9pc092ZXJmbG93aW5nJyk7XG5cbnZhciBfdXRpbHNJc092ZXJmbG93aW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzSXNPdmVyZmxvd2luZyk7XG5cbnZhciBfdXRpbHNNYW5hZ2VBcmlhSGlkZGVuID0gcmVxdWlyZSgnLi91dGlscy9tYW5hZ2VBcmlhSGlkZGVuJyk7XG5cbmZ1bmN0aW9uIGZpbmRJbmRleE9mKGFyciwgY2IpIHtcbiAgdmFyIGlkeCA9IC0xO1xuICBhcnIuc29tZShmdW5jdGlvbiAoZCwgaSkge1xuICAgIGlmIChjYihkLCBpKSkge1xuICAgICAgaWR4ID0gaTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBpZHg7XG59XG5cbmZ1bmN0aW9uIGZpbmRDb250YWluZXIoZGF0YSwgbW9kYWwpIHtcbiAgcmV0dXJuIGZpbmRJbmRleE9mKGRhdGEsIGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQubW9kYWxzLmluZGV4T2YobW9kYWwpICE9PSAtMTtcbiAgfSk7XG59XG5cbi8qKlxuICogUHJvcGVyIHN0YXRlIG1hbmFnbWVudCBmb3IgY29udGFpbmVycyBhbmQgdGhlIG1vZGFscyBpbiB0aG9zZSBjb250YWluZXJzLlxuICpcbiAqIEBpbnRlcm5hbCBVc2VkIGJ5IHRoZSBNb2RhbCB0byBlbnN1cmUgcHJvcGVyIHN0eWxpbmcgb2YgY29udGFpbmVycy5cbiAqL1xuXG52YXIgTW9kYWxNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTW9kYWxNYW5hZ2VyKCkge1xuICAgIHZhciBoaWRlU2libGluZ05vZGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1swXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNb2RhbE1hbmFnZXIpO1xuXG4gICAgdGhpcy5oaWRlU2libGluZ05vZGVzID0gaGlkZVNpYmxpbmdOb2RlcztcbiAgICB0aGlzLm1vZGFscyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IFtdO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICB9XG5cbiAgTW9kYWxNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQobW9kYWwsIGNvbnRhaW5lciwgY2xhc3NOYW1lKSB7XG4gICAgdmFyIG1vZGFsSWR4ID0gdGhpcy5tb2RhbHMuaW5kZXhPZihtb2RhbCk7XG4gICAgdmFyIGNvbnRhaW5lcklkeCA9IHRoaXMuY29udGFpbmVycy5pbmRleE9mKGNvbnRhaW5lcik7XG5cbiAgICBpZiAobW9kYWxJZHggIT09IC0xKSB7XG4gICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgfVxuXG4gICAgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5sZW5ndGg7XG4gICAgdGhpcy5tb2RhbHMucHVzaChtb2RhbCk7XG5cbiAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICBfdXRpbHNNYW5hZ2VBcmlhSGlkZGVuLmhpZGVTaWJsaW5ncyhjb250YWluZXIsIG1vZGFsLm1vdW50Tm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRhaW5lcklkeCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZGF0YVtjb250YWluZXJJZHhdLm1vZGFscy5wdXNoKG1vZGFsKTtcbiAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIG1vZGFsczogW21vZGFsXSxcbiAgICAgIC8vcmlnaHQgbm93IG9ubHkgdGhlIGZpcnN0IG1vZGFsIG9mIGEgY29udGFpbmVyIHdpbGwgaGF2ZSBpdHMgY2xhc3NlcyBhcHBsaWVkXG4gICAgICBjbGFzc2VzOiBjbGFzc05hbWUgPyBjbGFzc05hbWUuc3BsaXQoL1xccysvKSA6IFtdLFxuICAgICAgLy93ZSBhcmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSBhY3R1YWwgYHN0eWxlYCBoZXJlIGJlY2FzdWUgd2Ugd2lsbCBvdmVycmlkZSBpdFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgb3ZlcmZsb3c6IGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvdyxcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiBjb250YWluZXIuc3R5bGUucGFkZGluZ1JpZ2h0XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzdHlsZSA9IHsgb3ZlcmZsb3c6ICdoaWRkZW4nIH07XG5cbiAgICBkYXRhLm92ZXJmbG93aW5nID0gX3V0aWxzSXNPdmVyZmxvd2luZzJbJ2RlZmF1bHQnXShjb250YWluZXIpO1xuXG4gICAgaWYgKGRhdGEub3ZlcmZsb3dpbmcpIHtcbiAgICAgIC8vIHVzZSBjb21wdXRlZCBzdHlsZSwgaGVyZSB0byBnZXQgdGhlIHJlYWwgcGFkZGluZ1xuICAgICAgLy8gdG8gYWRkIG91ciBzY3JvbGxiYXIgd2lkdGhcbiAgICAgIHN0eWxlLnBhZGRpbmdSaWdodCA9IHBhcnNlSW50KF9kb21IZWxwZXJzU3R5bGUyWydkZWZhdWx0J10oY29udGFpbmVyLCAncGFkZGluZ1JpZ2h0JykgfHwgMCwgMTApICsgX2RvbUhlbHBlcnNVdGlsU2Nyb2xsYmFyU2l6ZTJbJ2RlZmF1bHQnXSgpICsgJ3B4JztcbiAgICB9XG5cbiAgICBfZG9tSGVscGVyc1N0eWxlMlsnZGVmYXVsdCddKGNvbnRhaW5lciwgc3R5bGUpO1xuXG4gICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2RvbUhlbHBlcnNDbGFzczJbJ2RlZmF1bHQnXS5hZGRDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgdGhpcy5jb250YWluZXJzLnB1c2goY29udGFpbmVyKTtcbiAgICB0aGlzLmRhdGEucHVzaChkYXRhKTtcblxuICAgIHJldHVybiBtb2RhbElkeDtcbiAgfTtcblxuICBNb2RhbE1hbmFnZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShtb2RhbCkge1xuICAgIHZhciBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmluZGV4T2YobW9kYWwpO1xuXG4gICAgaWYgKG1vZGFsSWR4ID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjb250YWluZXJJZHggPSBmaW5kQ29udGFpbmVyKHRoaXMuZGF0YSwgbW9kYWwpO1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhW2NvbnRhaW5lcklkeF07XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZHhdO1xuXG4gICAgZGF0YS5tb2RhbHMuc3BsaWNlKGRhdGEubW9kYWxzLmluZGV4T2YobW9kYWwpLCAxKTtcblxuICAgIHRoaXMubW9kYWxzLnNwbGljZShtb2RhbElkeCwgMSk7XG5cbiAgICAvLyBpZiB0aGF0IHdhcyB0aGUgbGFzdCBtb2RhbCBpbiBhIGNvbnRhaW5lcixcbiAgICAvLyBjbGVhbiB1cCB0aGUgY29udGFpbmVyIHN0eWxpbmhnLlxuICAgIGlmIChkYXRhLm1vZGFscy5sZW5ndGggPT09IDApIHtcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEuc3R5bGUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyLnN0eWxlW2tleV0gPSBkYXRhLnN0eWxlW2tleV07XG4gICAgICB9KTtcblxuICAgICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2RvbUhlbHBlcnNDbGFzczJbJ2RlZmF1bHQnXS5yZW1vdmVDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgIF91dGlsc01hbmFnZUFyaWFIaWRkZW4uc2hvd1NpYmxpbmdzKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGFpbmVycy5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICAgIHRoaXMuZGF0YS5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgLy9vdGhlcndpc2UgbWFrZSBzdXJlIHRoZSBuZXh0IHRvcCBtb2RhbCBpcyB2aXNpYmxlIHRvIGEgU1JcbiAgICAgIF91dGlsc01hbmFnZUFyaWFIaWRkZW4uYXJpYUhpZGRlbihmYWxzZSwgZGF0YS5tb2RhbHNbZGF0YS5tb2RhbHMubGVuZ3RoIC0gMV0ubW91bnROb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgTW9kYWxNYW5hZ2VyLnByb3RvdHlwZS5pc1RvcE1vZGFsID0gZnVuY3Rpb24gaXNUb3BNb2RhbChtb2RhbCkge1xuICAgIHJldHVybiAhIXRoaXMubW9kYWxzLmxlbmd0aCAmJiB0aGlzLm1vZGFsc1t0aGlzLm1vZGFscy5sZW5ndGggLSAxXSA9PT0gbW9kYWw7XG4gIH07XG5cbiAgcmV0dXJuIE1vZGFsTWFuYWdlcjtcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1vZGFsTWFuYWdlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvbW91bnRhYmxlJyk7XG5cbnZhciBfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUpO1xuXG52YXIgX3V0aWxzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vdXRpbHMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX3V0aWxzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc093bmVyRG9jdW1lbnQpO1xuXG52YXIgX3V0aWxzR2V0Q29udGFpbmVyID0gcmVxdWlyZSgnLi91dGlscy9nZXRDb250YWluZXInKTtcblxudmFyIF91dGlsc0dldENvbnRhaW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0dldENvbnRhaW5lcik7XG5cbi8qKlxuICogVGhlIGA8UG9ydGFsLz5gIGNvbXBvbmVudCByZW5kZXJzIGl0cyBjaGlsZHJlbiBpbnRvIGEgbmV3IFwic3VidHJlZVwiIG91dHNpZGUgb2YgY3VycmVudCBjb21wb25lbnQgaGllcmFyY2h5LlxuICogWW91IGNhbiB0aGluayBvZiBpdCBhcyBhIGRlY2xhcmF0aXZlIGBhcHBlbmRDaGlsZCgpYCwgb3IgalF1ZXJ5J3MgYCQuZm4uYXBwZW5kVG8oKWAuXG4gKiBUaGUgY2hpbGRyZW4gb2YgYDxQb3J0YWwvPmAgY29tcG9uZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIGBjb250YWluZXJgIHNwZWNpZmllZC5cbiAqL1xudmFyIFBvcnRhbCA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG5cbiAgZGlzcGxheU5hbWU6ICdQb3J0YWwnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8qKlxuICAgICAqIEEgTm9kZSwgQ29tcG9uZW50IGluc3RhbmNlLCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWl0aGVyLiBUaGUgYGNvbnRhaW5lcmAgd2lsbCBoYXZlIHRoZSBQb3J0YWwgY2hpbGRyZW5cbiAgICAgKiBhcHBlbmRlZCB0byBpdC5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyWydkZWZhdWx0J10sIF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuY10pXG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZW5kZXJPdmVybGF5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCAmJiBuZXh0UHJvcHMuY29udGFpbmVyICE9PSB0aGlzLnByb3BzLmNvbnRhaW5lcikge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSBfdXRpbHNHZXRDb250YWluZXIyWydkZWZhdWx0J10obmV4dFByb3BzLmNvbnRhaW5lciwgX3V0aWxzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXSh0aGlzKS5ib2R5KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICB0aGlzLl91bm1vdW50T3ZlcmxheVRhcmdldCgpO1xuICB9LFxuXG4gIF9tb3VudE92ZXJsYXlUYXJnZXQ6IGZ1bmN0aW9uIF9tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5VGFyZ2V0KSB7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gX3V0aWxzR2V0Q29udGFpbmVyMlsnZGVmYXVsdCddKHRoaXMucHJvcHMuY29udGFpbmVyLCBfdXRpbHNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKHRoaXMpLmJvZHkpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9XG4gIH0sXG5cbiAgX3VubW91bnRPdmVybGF5VGFyZ2V0OiBmdW5jdGlvbiBfdW5tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9IG51bGw7XG4gIH0sXG5cbiAgX3JlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF9yZW5kZXJPdmVybGF5KCkge1xuXG4gICAgdmFyIG92ZXJsYXkgPSAhdGhpcy5wcm9wcy5jaGlsZHJlbiA/IG51bGwgOiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblxuICAgIC8vIFNhdmUgcmVmZXJlbmNlIGZvciBmdXR1cmUgYWNjZXNzLlxuICAgIGlmIChvdmVybGF5ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlJbnN0YW5jZSA9IF9yZWFjdERvbTJbJ2RlZmF1bHQnXS51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcih0aGlzLCBvdmVybGF5LCB0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVW5yZW5kZXIgaWYgdGhlIGNvbXBvbmVudCBpcyBudWxsIGZvciB0cmFuc2l0aW9ucyB0byBudWxsXG4gICAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX3VubW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gICAgfVxuICB9LFxuXG4gIF91bnJlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF91bnJlbmRlck92ZXJsYXkoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIF9yZWFjdERvbTJbJ2RlZmF1bHQnXS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fb3ZlcmxheUluc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgZ2V0TW91bnROb2RlOiBmdW5jdGlvbiBnZXRNb3VudE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlUYXJnZXQ7XG4gIH0sXG5cbiAgZ2V0T3ZlcmxheURPTU5vZGU6IGZ1bmN0aW9uIGdldE92ZXJsYXlET01Ob2RlKCkge1xuICAgIGlmICghdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRPdmVybGF5RE9NTm9kZSgpOiBBIGNvbXBvbmVudCBtdXN0IGJlIG1vdW50ZWQgdG8gaGF2ZSBhIERPTSBub2RlLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vdmVybGF5SW5zdGFuY2UpIHtcbiAgICAgIGlmICh0aGlzLl9vdmVybGF5SW5zdGFuY2UuZ2V0V3JhcHBlZERPTU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXlJbnN0YW5jZS5nZXRXcmFwcGVkRE9NTm9kZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9yZWFjdERvbTJbJ2RlZmF1bHQnXS5maW5kRE9NTm9kZSh0aGlzLl9vdmVybGF5SW5zdGFuY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBQb3J0YWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9kb21IZWxwZXJzRXZlbnRzT24gPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb24nKTtcblxudmFyIF9kb21IZWxwZXJzRXZlbnRzT24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0V2ZW50c09uKTtcblxudmFyIF9kb21IZWxwZXJzRXZlbnRzT2ZmID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvZXZlbnRzL29mZicpO1xuXG52YXIgX2RvbUhlbHBlcnNFdmVudHNPZmYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0V2ZW50c09mZik7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChub2RlLCBldmVudCwgaGFuZGxlcikge1xuICBfZG9tSGVscGVyc0V2ZW50c09uMlsnZGVmYXVsdCddKG5vZGUsIGV2ZW50LCBoYW5kbGVyKTtcbiAgcmV0dXJuIHtcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIF9kb21IZWxwZXJzRXZlbnRzT2ZmMlsnZGVmYXVsdCddKG5vZGUsIGV2ZW50LCBoYW5kbGVyKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKipcbiAqIEZpcmVmb3ggZG9lc24ndCBoYXZlIGEgZm9jdXNpbiBldmVudCBzbyB1c2luZyBjYXB0dXJlIGlzIGVhc2llc3Qgd2F5IHRvIGdldCBidWJibGluZ1xuICogSUU4IGNhbid0IGRvIGFkZEV2ZW50TGlzdGVuZXIsIGJ1dCBkb2VzIGhhdmUgb25mb2N1c2luLCBzbyB3ZSB1c2UgdGhhdCBpbiBpZThcbiAqXG4gKiBXZSBvbmx5IGFsbG93IG9uZSBMaXN0ZW5lciBhdCBhIHRpbWUgdG8gYXZvaWQgc3RhY2sgb3ZlcmZsb3dzXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGFkZEZvY3VzTGlzdGVuZXI7XG5cbmZ1bmN0aW9uIGFkZEZvY3VzTGlzdGVuZXIoaGFuZGxlcikge1xuICB2YXIgdXNlRm9jdXNpbiA9ICFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyO1xuICB2YXIgcmVtb3ZlID0gdW5kZWZpbmVkO1xuXG4gIGlmICh1c2VGb2N1c2luKSB7XG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29uZm9jdXNpbicsIGhhbmRsZXIpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kZXRhY2hFdmVudCgnb25mb2N1c2luJywgaGFuZGxlcik7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4geyByZW1vdmU6IHJlbW92ZSB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRDb250YWluZXI7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyKGNvbnRhaW5lciwgZGVmYXVsdENvbnRhaW5lcikge1xuICBjb250YWluZXIgPSB0eXBlb2YgY29udGFpbmVyID09PSAnZnVuY3Rpb24nID8gY29udGFpbmVyKCkgOiBjb250YWluZXI7XG4gIHJldHVybiBfcmVhY3REb20yWydkZWZhdWx0J10uZmluZERPTU5vZGUoY29udGFpbmVyKSB8fCBkZWZhdWx0Q29udGFpbmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBpc092ZXJmbG93aW5nO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZG9tSGVscGVyc1F1ZXJ5SXNXaW5kb3cgPSByZXF1aXJlKCdkb20taGVscGVycy9xdWVyeS9pc1dpbmRvdycpO1xuXG52YXIgX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93KTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCk7XG5cbmZ1bmN0aW9uIGlzQm9keShub2RlKSB7XG4gIHJldHVybiBub2RlICYmIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYm9keSc7XG59XG5cbmZ1bmN0aW9uIGJvZHlJc092ZXJmbG93aW5nKG5vZGUpIHtcbiAgdmFyIGRvYyA9IF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXShub2RlKTtcbiAgdmFyIHdpbiA9IF9kb21IZWxwZXJzUXVlcnlJc1dpbmRvdzJbJ2RlZmF1bHQnXShkb2MpO1xuICB2YXIgZnVsbFdpZHRoID0gd2luLmlubmVyV2lkdGg7XG5cbiAgLy8gU3VwcG9ydDogaWU4LCBubyBpbm5lcldpZHRoXG4gIGlmICghZnVsbFdpZHRoKSB7XG4gICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGZ1bGxXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpO1xuICB9XG5cbiAgcmV0dXJuIGRvYy5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpZHRoO1xufVxuXG5mdW5jdGlvbiBpc092ZXJmbG93aW5nKGNvbnRhaW5lcikge1xuICB2YXIgd2luID0gX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93MlsnZGVmYXVsdCddKGNvbnRhaW5lcik7XG5cbiAgcmV0dXJuIHdpbiB8fCBpc0JvZHkoY29udGFpbmVyKSA/IGJvZHlJc092ZXJmbG93aW5nKGNvbnRhaW5lcikgOiBjb250YWluZXIuc2Nyb2xsSGVpZ2h0ID4gY29udGFpbmVyLmNsaWVudEhlaWdodDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hcmlhSGlkZGVuID0gYXJpYUhpZGRlbjtcbmV4cG9ydHMuaGlkZVNpYmxpbmdzID0gaGlkZVNpYmxpbmdzO1xuZXhwb3J0cy5zaG93U2libGluZ3MgPSBzaG93U2libGluZ3M7XG5cbnZhciBCTEFDS0xJU1QgPSBbJ3RlbXBsYXRlJywgJ3NjcmlwdCcsICdzdHlsZSddO1xuXG52YXIgaXNIaWRhYmxlID0gZnVuY3Rpb24gaXNIaWRhYmxlKF9yZWYpIHtcbiAgdmFyIG5vZGVUeXBlID0gX3JlZi5ub2RlVHlwZTtcbiAgdmFyIHRhZ05hbWUgPSBfcmVmLnRhZ05hbWU7XG4gIHJldHVybiBub2RlVHlwZSA9PT0gMSAmJiBCTEFDS0xJU1QuaW5kZXhPZih0YWdOYW1lLnRvTG93ZXJDYXNlKCkpID09PSAtMTtcbn07XG5cbnZhciBzaWJsaW5ncyA9IGZ1bmN0aW9uIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnQsIGNiKSB7XG4gIG1vdW50ID0gW10uY29uY2F0KG1vdW50KTtcblxuICBbXS5mb3JFYWNoLmNhbGwoY29udGFpbmVyLmNoaWxkcmVuLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChtb3VudC5pbmRleE9mKG5vZGUpID09PSAtMSAmJiBpc0hpZGFibGUobm9kZSkpIHtcbiAgICAgIGNiKG5vZGUpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBhcmlhSGlkZGVuKHNob3csIG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChzaG93KSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoaWRlU2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUpIHtcbiAgc2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFyaWFIaWRkZW4odHJ1ZSwgbm9kZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93U2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUpIHtcbiAgc2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFyaWFIaWRkZW4oZmFsc2UsIG5vZGUpO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChjb21wb25lbnRPckVsZW1lbnQpIHtcbiAgcmV0dXJuIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXShfcmVhY3REb20yWydkZWZhdWx0J10uZmluZERPTU5vZGUoY29tcG9uZW50T3JFbGVtZW50KSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmVyck1zZyA9IGVyck1zZztcbmV4cG9ydHMuY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIgPSBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjtcblxuZnVuY3Rpb24gZXJyTXNnKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbXNnQ29udGludWF0aW9uKSB7XG4gIHJldHVybiAnSW52YWxpZCBwcm9wIFxcJycgKyBwcm9wTmFtZSArICdcXCcgb2YgdmFsdWUgXFwnJyArIHByb3BzW3Byb3BOYW1lXSArICdcXCcnICsgKCcgc3VwcGxpZWQgdG8gXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnJyArIG1zZ0NvbnRpbnVhdGlvbik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGNoYWluLWFibGUgaXNSZXF1aXJlZCB2YWxpZGF0b3JcbiAqXG4gKiBMYXJnZWx5IGNvcGllZCBkaXJlY3RseSBmcm9tOlxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzAuMTEtc3RhYmxlL3NyYy9jb3JlL1JlYWN0UHJvcFR5cGVzLmpzI0w5NFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCAnPDxhbm9ueW1vdXM+Pic7XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXF1aXJlZCBwcm9wIFxcJycgKyBwcm9wTmFtZSArICdcXCcgd2FzIG5vdCBzcGVjaWZpZWQgaW4gXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIHByb3AgcHJvdmlkZXMgYSB0eXBlIG9mIGVsZW1lbnQuXG4gKlxuICogVGhlIHR5cGUgb2YgZWxlbWVudCBjYW4gYmUgcHJvdmlkZWQgaW4gdHdvIGZvcm1zOlxuICogLSB0YWcgbmFtZSAoc3RyaW5nKVxuICogLSBhIHJldHVybiB2YWx1ZSBvZiBSZWFjdC5jcmVhdGVDbGFzcyguLi4pXG4gKlxuICogQHBhcmFtIHByb3BzXG4gKiBAcGFyYW0gcHJvcE5hbWVcbiAqIEBwYXJhbSBjb21wb25lbnROYW1lXG4gKiBAcmV0dXJucyB7RXJyb3J8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICB2YXIgZXJyQmVnaW5uaW5nID0gX2NvbW1vbi5lcnJNc2cocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCAnLiBFeHBlY3RlZCBhbiBFbGVtZW50IGB0eXBlYCcpO1xuXG4gIGlmICh0eXBlb2YgcHJvcHNbcHJvcE5hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKF9yZWFjdDJbJ2RlZmF1bHQnXS5pc1ZhbGlkRWxlbWVudChwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGVyckJlZ2lubmluZyArICcsIG5vdCBhbiBhY3R1YWwgRWxlbWVudCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcHNbcHJvcE5hbWVdICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihlcnJCZWdpbm5pbmcgKyAnIHN1Y2ggYXMgYSB0YWcgbmFtZSBvciByZXR1cm4gdmFsdWUgb2YgUmVhY3QuY3JlYXRlQ2xhc3MoLi4uKScpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBfY29tbW9uLmNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgcHJvcCBwcm92aWRlcyBhIERPTSBlbGVtZW50XG4gKlxuICogVGhlIGVsZW1lbnQgY2FuIGJlIHByb3ZpZGVkIGluIHR3byBmb3JtczpcbiAqIC0gRGlyZWN0bHkgcGFzc2VkXG4gKiAtIE9yIHBhc3NlZCBhbiBvYmplY3QgdGhhdCBoYXMgYSBgcmVuZGVyYCBtZXRob2RcbiAqXG4gKiBAcGFyYW0gcHJvcHNcbiAqIEBwYXJhbSBwcm9wTmFtZVxuICogQHBhcmFtIGNvbXBvbmVudE5hbWVcbiAqIEByZXR1cm5zIHtFcnJvcnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gIGlmICh0eXBlb2YgcHJvcHNbcHJvcE5hbWVdICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgcHJvcHNbcHJvcE5hbWVdLnJlbmRlciAhPT0gJ2Z1bmN0aW9uJyAmJiBwcm9wc1twcm9wTmFtZV0ubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKF9jb21tb24uZXJyTXNnKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgJywgZXhwZWN0ZWQgYSBET00gZWxlbWVudCBvciBhbiBvYmplY3QgdGhhdCBoYXMgYSBgcmVuZGVyYCBtZXRob2QnKSk7XG4gIH1cbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gX2NvbW1vbi5jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKiFcbiAqIFxuICogIFJlYWN0IFNpbXBsZXRhYnMgLSBKdXN0IGEgc2ltcGxlIHRhYnMgY29tcG9uZW50IGJ1aWx0IHdpdGggUmVhY3RcbiAqICBAdmVyc2lvbiB2MC43LjBcbiAqICBAbGluayBodHRwczovL2dpdGh1Yi5jb20vcGVkcm9uYXVjay9yZWFjdC1zaW1wbGV0YWJzXG4gKiAgQGxpY2Vuc2UgTUlUXG4gKiAgQGF1dGhvciBQZWRybyBOYXVjayAoaHR0cHM6Ly9naXRodWIuY29tL3BlZHJvbmF1Y2spXG4gKiBcbiAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJyZWFjdFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXykge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyoqIEBqc3ggUmVhY3QuRE9NICovJ3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBjbGFzc05hbWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblxuXHRpZiAodHJ1ZSkge1xuXHQgIF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdH1cblxuXHR2YXIgVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ICBkaXNwbGF5TmFtZTogJ1RhYnMnLFxuXHQgIHByb3BUeXBlczoge1xuXHQgICAgY2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cdCAgICBdKSxcblx0ICAgIHRhYkFjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0ICAgIG9uTW91bnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25CZWZvcmVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25BZnRlckNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmVsZW1lbnRcblx0ICAgIF0pLmlzUmVxdWlyZWRcblx0ICB9LFxuXHQgIGdldERlZmF1bHRQcm9wczpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4geyB0YWJBY3RpdmU6IDEgfTtcblx0ICB9LFxuXHQgIGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB0YWJBY3RpdmU6IHRoaXMucHJvcHMudGFiQWN0aXZlXG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgY29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgaW5kZXggPSB0aGlzLnN0YXRlLnRhYkFjdGl2ZTtcblx0ICAgIHZhciAkc2VsZWN0ZWRQYW5lbCA9IHRoaXMucmVmc1sndGFiLXBhbmVsJ107XG5cdCAgICB2YXIgJHNlbGVjdGVkTWVudSA9IHRoaXMucmVmc1soXCJ0YWItbWVudS1cIiArIGluZGV4KV07XG5cblx0ICAgIGlmICh0aGlzLnByb3BzLm9uTW91bnQpIHtcblx0ICAgICAgdGhpcy5wcm9wcy5vbk1vdW50KGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkTWVudSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdCAgICBpZihuZXdQcm9wcy50YWJBY3RpdmUgJiYgbmV3UHJvcHMudGFiQWN0aXZlICE9PSB0aGlzLnByb3BzLnRhYkFjdGl2ZSl7XG5cdCAgICAgIHRoaXMuc2V0U3RhdGUoe3RhYkFjdGl2ZTogbmV3UHJvcHMudGFiQWN0aXZlfSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ3RhYnMnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIFxuXHQgICAgICAgIHRoaXMuX2dldE1lbnVJdGVtcygpLCBcblx0ICAgICAgICB0aGlzLl9nZXRTZWxlY3RlZFBhbmVsKClcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9LFxuXHQgIHNldEFjdGl2ZTpmdW5jdGlvbihpbmRleCwgZSkge1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCAgICB2YXIgb25BZnRlckNoYW5nZSA9IHRoaXMucHJvcHMub25BZnRlckNoYW5nZTtcblx0ICAgIHZhciBvbkJlZm9yZUNoYW5nZSA9IHRoaXMucHJvcHMub25CZWZvcmVDaGFuZ2U7XG5cdCAgICB2YXIgJHNlbGVjdGVkUGFuZWwgPSB0aGlzLnJlZnNbJ3RhYi1wYW5lbCddO1xuXHQgICAgdmFyICRzZWxlY3RlZFRhYk1lbnUgPSB0aGlzLnJlZnNbKFwidGFiLW1lbnUtXCIgKyBpbmRleCldO1xuXG5cdCAgICBpZiAob25CZWZvcmVDaGFuZ2UpIHtcblx0ICAgICAgdmFyIGNhbmNlbCA9IG9uQmVmb3JlQ2hhbmdlKGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkVGFiTWVudSk7XG5cdCAgICAgIGlmKGNhbmNlbCA9PT0gZmFsc2UpeyByZXR1cm4gfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNldFN0YXRlKHsgdGFiQWN0aXZlOiBpbmRleCB9LCBmdW5jdGlvbigpICB7XG5cdCAgICAgIGlmIChvbkFmdGVyQ2hhbmdlKSB7XG5cdCAgICAgICAgb25BZnRlckNoYW5nZShpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZFRhYk1lbnUpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIF9nZXRNZW51SXRlbXM6ZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVGFicyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIFRhYnMuUGFuZWwnKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuY2hpbGRyZW4pKSB7XG5cdCAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4gPSBbdGhpcy5wcm9wcy5jaGlsZHJlbl07XG5cdCAgICB9XG5cblx0ICAgIHZhciAkbWVudUl0ZW1zID0gdGhpcy5wcm9wcy5jaGlsZHJlblxuXHQgICAgICAubWFwKGZ1bmN0aW9uKCRwYW5lbCkgIHtyZXR1cm4gdHlwZW9mICRwYW5lbCA9PT0gJ2Z1bmN0aW9uJyA/ICRwYW5lbCgpIDogJHBhbmVsO30pXG5cdCAgICAgIC5maWx0ZXIoZnVuY3Rpb24oJHBhbmVsKSAge3JldHVybiAkcGFuZWw7fSlcblx0ICAgICAgLm1hcChmdW5jdGlvbigkcGFuZWwsIGluZGV4KSAge1xuXHQgICAgICAgIHZhciByZWYgPSAoXCJ0YWItbWVudS1cIiArIChpbmRleCArIDEpKTtcblx0ICAgICAgICB2YXIgdGl0bGUgPSAkcGFuZWwucHJvcHMudGl0bGU7XG5cdCAgICAgICAgdmFyIGNsYXNzZXMgPSBjbGFzc05hbWVzKFxuXHQgICAgICAgICAgJ3RhYnMtbWVudS1pdGVtJyxcblx0ICAgICAgICAgIHRoaXMuc3RhdGUudGFiQWN0aXZlID09PSAoaW5kZXggKyAxKSAmJiAnaXMtYWN0aXZlJ1xuXHQgICAgICAgICk7XG5cblx0ICAgICAgICByZXR1cm4gKFxuXHQgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtyZWY6IHJlZiwga2V5OiBpbmRleCwgY2xhc3NOYW1lOiBjbGFzc2VzfSwgXG5cdCAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNldEFjdGl2ZS5iaW5kKHRoaXMsIGluZGV4ICsgMSl9LCBcblx0ICAgICAgICAgICAgICB0aXRsZVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgICApXG5cdCAgICAgICAgKTtcblx0ICAgICAgfS5iaW5kKHRoaXMpKTtcblxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCB7Y2xhc3NOYW1lOiBcInRhYnMtbmF2aWdhdGlvblwifSwgXG5cdCAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwidGFicy1tZW51XCJ9LCAkbWVudUl0ZW1zKVxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH0sXG5cdCAgX2dldFNlbGVjdGVkUGFuZWw6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS50YWJBY3RpdmUgLSAxO1xuXHQgICAgdmFyICRwYW5lbCA9IHRoaXMucHJvcHMuY2hpbGRyZW5baW5kZXhdO1xuXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXJ0aWNsZVwiLCB7cmVmOiBcInRhYi1wYW5lbFwiLCBjbGFzc05hbWU6IFwidGFiLXBhbmVsXCJ9LCBcblx0ICAgICAgICAkcGFuZWxcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9XG5cdH0pO1xuXG5cdFRhYnMuUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdCAgZGlzcGxheU5hbWU6ICdQYW5lbCcsXG5cdCAgcHJvcFR5cGVzOiB7XG5cdCAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXHQgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5lbGVtZW50XG5cdCAgICBdKS5pc1JlcXVpcmVkXG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdCAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX187XG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiogQGpzeCBSZWFjdC5ET00gKi9mdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cdFx0dmFyIGFyZztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCdzdHJpbmcnID09PSB0eXBlb2YgYXJnIHx8ICdudW1iZXInID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmICghYXJnLmhhc093blByb3BlcnR5KGtleSkgfHwgIWFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0Ly8gc2FmZWx5IGV4cG9ydCBjbGFzc05hbWVzIGluIGNhc2UgdGhlIHNjcmlwdCBpcyBpbmNsdWRlZCBkaXJlY3RseSBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9XG5cblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQWxsZWxlRmlsdGVyc1ZpZXcgPSAoe3NwZWNpZXMsIGhpZGRlbkFsbGVsZXM9W10sIGRpc2FibGVkQWxsZWxlcyA9IFtdLCBvbkZpbHRlckNoYW5nZX0pID0+IHtcbiAgbGV0IGhpZGRlbkdlbmVzID0gbmV3IFNldCxcbiAgICAgIGdlbmVJbnB1dHMgPSBbXTtcblxuICBmb3IgKGNvbnN0IGFsbGVsZSBvZiBoaWRkZW5BbGxlbGVzKSB7XG4gICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYWxsZWxlKTtcbiAgICBpZiAoZ2VuZSlcbiAgICAgIGhpZGRlbkdlbmVzLmFkZChnZW5lLm5hbWUpO1xuICB9XG5cbiAgZm9yIChjb25zdCBnZW5lIGluIHNwZWNpZXMuZ2VuZUxpc3QpIHtcbiAgICBpZiAoIWhpZGRlbkdlbmVzLmhhcyhnZW5lKSkge1xuICAgICAgY29uc3QgYWxsZWxlcyA9IHNwZWNpZXMuZ2VuZUxpc3RbZ2VuZV0uYWxsZWxlcyxcbiAgICAgICAgICAgIGFsbGVsZUl0ZW1zID0gYWxsZWxlcy5tYXAoYWxsZWxlID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXSxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA9ICEoZGlzYWJsZWRBbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA+PSAwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGFiZWwga2V5PXtuYW1lfT5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBrZXk9e25hbWV9IHZhbHVlPXthbGxlbGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IFwibWFyZ2luTGVmdFwiOiBcIjhweFwiIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXtjaGVja2VkfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfS8+XG4gICAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICBnZW5lSW5wdXRzLnB1c2goXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuZS1hbGxlbGUtbGlzdFwiIGtleT17Z2VuZX0+e2FsbGVsZUl0ZW1zfTwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiBcbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgYWxsZWxlID0gZWx0ICYmIGVsdC52YWx1ZSxcbiAgICAgICAgICBpc0NoZWNrZWQgPSBlbHQgJiYgZWx0LmNoZWNrZWQ7XG4gICAgaWYgKG9uRmlsdGVyQ2hhbmdlICYmIGFsbGVsZSlcbiAgICAgIG9uRmlsdGVyQ2hhbmdlKGV2dCwgYWxsZWxlLCBpc0NoZWNrZWQpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlLWZpbHRlcnNcIlxuICAgICAgICAgIHN0eWxlPXt7IFwibWFyZ2luVG9wXCI6IFwiNXB4XCIsIFwibWFyZ2luQm90dG9tXCI6IFwiNXB4XCIgfX0+XG4gICAgICB7IGdlbmVJbnB1dHMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQWxsZWxlRmlsdGVyc1ZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNhYmxlZEFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBvbkZpbHRlckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlRmlsdGVyc1ZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBBbGxlbGVWaWV3ID0gKHthbGxlbGUsIHdpZHRoPTIxLCB0YXJnZXQsIGNvbG9yLCBzaGFwZSwgaG92ZXJpbmd9KSA9PiB7XG4gIGxldCByYWRpdXMgPSB3aWR0aC8yLFxuICAgICAgc3Ryb2tlID0gdGFyZ2V0ID8gXCIjMDAwMDAwXCIgOiBcIm5vbmVcIixcbiAgICAgIGZpbGwgPSBhbGxlbGUgPyBjb2xvciA6IFwid2hpdGVcIixcbiAgICAgIHN0cm9rZVdpZHRoID0gaG92ZXJpbmcgPyAzIDogMSxcbiAgICAgIHN0cm9rZURhc2hhcnJheT0gYWxsZWxlID8gXCIwXCIgOiBcIjFcIixcbiAgICAgIHN2Z1NoYXBlID0gbnVsbDtcblxuICBpZiAoc2hhcGUgPT09IFwiY2lyY2xlXCIpIHtcbiAgICBzdmdTaGFwZSA9IDxjaXJjbGUgcj17cmFkaXVzfSBjeT17cmFkaXVzKzF9IGN4PXtyYWRpdXMrMX0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH0gZWxzZSB7XG4gICAgc3ZnU2hhcGUgPSA8cmVjdCB3aWR0aD17KHJhZGl1cyoyKX0gaGVpZ2h0PXsocmFkaXVzKjIpfSB4PVwiMVwiIHk9XCIxXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlRGFzaGFycmF5PXtzdHJva2VEYXNoYXJyYXl9IGZpbGw9e2ZpbGx9Lz47XG4gIH1cblxuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17d2lkdGgrMn0gaGVpZ2h0PXt3aWR0aCsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICA8Zz5cbiAgICAgICAgeyBzdmdTaGFwZSB9XG4gICAgICAgIDx0ZXh0IHg9e3JhZGl1cysxfSB5PXtyYWRpdXMrN30gdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZpbGw9XCJ3aGl0ZVwiPnthbGxlbGV9PC90ZXh0PlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuQWxsZWxlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGFsbGVsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRhcmdldDogUHJvcFR5cGVzLmJvb2wsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaGFwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaG92ZXJpbmc6IFByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbGxlbGVWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5pbXBvcnQgR2FtZXRlVmlldyBmcm9tICcuL2dhbWV0ZSc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZSB0aGF0IGFuaW1hdGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IFtpbml0aWFsRGlzcGxheV0gLSBpbml0aWFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnhdIC0gaW5pdGlhbCBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS55XSAtIGluaXRpYWwgbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS5zaXplPTMwXSAtIGluaXRpYWwgc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkucm90YXRpb249MF0gLSBpbml0aWFsIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkub3BhY2l0eT0xXSAtIGluaXRpYWwgb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGlzcGxheSAtIGZpbmFsIGRpc3BsYXkgcGFyYW1ldGVycyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS54IC0gZmluYWwgbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnkgLSBmaW5hbCBsb2NhdGlvbiAodG9wKSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkuc2l6ZT0zMF0gLSBmaW5hbCBzaXplICh3aWR0aCAmIGhlaWdodCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnJvdGF0aW9uPTBdIC0gZmluYWwgcm90YXRpb24gb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5Lm9wYWNpdHk9MV0gLSBmaW5hbCBvcGFjaXR5IG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW5pbVN0aWZmbmVzcz0xMDBdIC0gc3ByaW5nIHN0aWZmbmVzcyB1c2VkIHRvIGNvbnRyb2wgYW5pbWF0aW9uIHNwZWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvblJlY3QoKV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGF0IHJlc3RcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgQW5pbWF0ZWRHYW1ldGVWaWV3ID0gKHtpZCwgaW5pdGlhbERpc3BsYXksIGRpc3BsYXksIGFuaW1TdGlmZm5lc3M9MTAwLCBvblJlc3QsIC4uLm90aGVyc30pID0+IHtcblxuICBjb25zdCBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGluaXRpYWwgPSBpbml0aWFsRGlzcGxheSB8fCBkaXNwbGF5LFxuICAgICAgICBpbml0aWFsU2l6ZSA9IGluaXRpYWwuc2l6ZSB8fCAzMCxcbiAgICAgICAgaW5pdGlhbFJvdGF0aW9uID0gaW5pdGlhbC5yb3RhdGlvbiAhPSBudWxsID8gaW5pdGlhbC5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIGluaXRpYWxPcGFjaXR5ID0gaW5pdGlhbC5vcGFjaXR5ICE9IG51bGwgPyBpbml0aWFsLm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIGZpbmFsU2l6ZSA9IGRpc3BsYXkuc2l6ZSB8fCAzMCxcbiAgICAgICAgZmluYWxSb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBmaW5hbE9wYWNpdHkgPSBkaXNwbGF5Lm9wYWNpdHkgIT0gbnVsbCA/IGRpc3BsYXkub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgc3ByaW5nQ29uZmlnID0geyBzdGlmZm5lc3M6IGFuaW1TdGlmZm5lc3MgfTtcbiAgcmV0dXJuIChcbiAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1nYW1ldGUnXG4gICAgICAgICAgZGVmYXVsdFN0eWxlPXt7XG4gICAgICAgICAgICB4OiBpbml0aWFsLngsIHk6IGluaXRpYWwueSwgc2l6ZTogaW5pdGlhbFNpemUsXG4gICAgICAgICAgICByb3RhdGlvbjogaW5pdGlhbFJvdGF0aW9uLCBvcGFjaXR5OiBpbml0aWFsT3BhY2l0eVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHg6IHNwcmluZyhkaXNwbGF5LngsIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICB5OiBzcHJpbmcoZGlzcGxheS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgc2l6ZTogc3ByaW5nKGZpbmFsU2l6ZSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiBzcHJpbmcoZmluYWxSb3RhdGlvbiwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIG9wYWNpdHk6IHNwcmluZyhmaW5hbE9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uUmVzdD17b25SZXN0fSA+XG4gICAgICB7XG4gICAgICAgIGludGVycG9sYXRlZFN0eWxlID0+XG4gICAgICAgICAgPEdhbWV0ZVZpZXcgaWQ9e2lkfSBkaXNwbGF5PXtpbnRlcnBvbGF0ZWRTdHlsZX0gey4uLm90aGVyc30gLz5cbiAgICAgIH1cbiAgICA8L01vdGlvbj5cbiAgKTtcbn07XG5cbkFuaW1hdGVkR2FtZXRlVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgaW5pdGlhbERpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7IC8vIGluaXRpYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSksXG4gIGRpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7ICAgICAgICAvLyBmaW5hbCBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KS5pc1JlcXVpcmVkLFxuICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gIGlzU2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Rpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVkR2FtZXRlVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01vdGlvbiwgc3ByaW5nfSBmcm9tICdyZWFjdC1tb3Rpb24nO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgQW5pbWF0ZWRPcmdhbmlzbVZpZXcgPSAoe29yZywgaWQsIHdpZHRoPTIwMCwgc3R5bGU9e30sIGluaXRpYWxPcGFjaXR5PTEuMCwgb3BhY2l0eT0xLjAsIHN0aWZmbmVzcz02MCwgb25SZXN0LCBvbkNsaWNrIH0pID0+IHtcbiAgY29uc3Qgb3BhY2l0eVN0YXJ0ID0gaW5pdGlhbE9wYWNpdHkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBpbml0aWFsT3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAob3BhY2l0eSAhPT0gdW5kZWZpbmVkID8gb3BhY2l0eSA6IDEuMCk7XG4gIGxldCAgIG9wYWNpdHlFbmQgPSBvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogb3BhY2l0eVN0YXJ0O1xuXG4gIGlmIChvcGFjaXR5RW5kICE9PSBvcGFjaXR5U3RhcnQpXG4gICAgb3BhY2l0eUVuZCA9IHNwcmluZyhvcGFjaXR5RW5kLCB7IHN0aWZmbmVzczogc3RpZmZuZXNzIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtb3JnYW5pc20tdmlldycgXG4gICAgICAgICAgICBkZWZhdWx0U3R5bGU9e3tvcGFjaXR5OiBvcGFjaXR5U3RhcnR9fSBzdHlsZT17e29wYWNpdHk6IG9wYWNpdHlFbmR9fSBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgY29uc3QgdFN0eWxlID0geyAuLi5zdHlsZSwgLi4uaW50ZXJwb2xhdGVkU3R5bGUgfTtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkfSB3aWR0aD17d2lkdGh9IHN0eWxlPXt0U3R5bGV9IG9uQ2xpY2s9e29uQ2xpY2t9IC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIDwvTW90aW9uPlxuICApO1xufTtcblxuQW5pbWF0ZWRPcmdhbmlzbVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgaW5pdGlhbE9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlcixcbiAgb25SZXN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGVkT3JnYW5pc21WaWV3O1xuIiwiLypcbiAqIFRoaXMgY29tcG9uZW50IGlzIGEgdmVyeSB0aGluIHdyYXBwZXIgYXJvdW5kIGEgc3RhbmRhcmQgYnV0dG9uIGRlc2lnbmVkIHRvIHByZXZlbnRcbiAqIGV4dHJhbmVvdXMgZm9jdXMgaGlnaGxpZ2h0aW5nIGFkZGVkIGJ5IGJyb3dzZXJzIHdoZW4gY2xpY2tpbmcgb24gYSBidXR0b24gd2hpbGVcbiAqIG1haW50YWluaW5nIGtleWJvYXJkIGFjY2Vzc2liaWxpdHkuIFNlZSBcbiAqIGh0dHBzOi8vd3d3LnBhY2llbGxvZ3JvdXAuY29tL2Jsb2cvMjAxMi8wNC9ob3ctdG8tcmVtb3ZlLWNzcy1vdXRsaW5lcy1pbi1hbi1hY2Nlc3NpYmxlLW1hbm5lci9cbiAqIGZvciBkZXRhaWxzLiBUaGUgdXBzaG90IGlzIHRoYXQgd2UgdXNlIG1vdXNlIGV2ZW50cyBvbiB0aGUgYnV0dG9uIHRvIGRpc2FibGUgdGhlXG4gKiBmb2N1cyBoaWdobGlnaHQgLS0gbW91c2luZy9jbGlja2luZyBvbiBhIHB1c2ggYnV0dG9uIHNob3VsZCBub3QgYmUgdXNlZCBhcyBhblxuICogaW5jaWRhdG9yIHRoYXQgdGhlIHVzZXIgd291bGQgbGlrZSB0byBrZXlib2FyZC1pbnRlcmFjdCB3aXRoIHRoYXQgYnV0dG9uLCB3aGljaFxuICogaXMgd2hhdCBmb2N1c2luZyBhIGNsaWNrZWQgYnV0dG9uIGltcGxpZXMuXG4gKiBJTVBPUlRBTlQ6IFRvIG1haW50YWluIGFjY2Vzc2liaWxpdHksIHRoZXJlIG11c3QgYmUgY29kZSBzb21ld2hlcmUgdG8gcmVlbmFibGVcbiAqIHRoZSBmb2N1cyBoaWdobGlnaHQgd2hlbiBhcHByb3ByaWF0ZS4gVGhpcyBjYW4gYmUgZG9uZSBmb3IgJ2tleWRvd24nIGJ5IGNhbGxpbmdcbiAqIEJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpIGR1cmluZyBhcHBsaWNhdGlvbi9wYWdlIGluaXRpYWxpemF0aW9uLFxuICogb3IgYnkgYWRkaW5nIHlvdXIgb3duIGV2ZW50IGhhbmRsZXIgdGhhdCBjYWxscyBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKS5cbiAqL1xuaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY2xhc3MgQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG4gIH1cblxuICAvLyBJbnN0YWxscyBhIGtleWRvd24gaGFuZGxlciBvbiB0aGUgZG9jdW1lbnQgd2hpY2ggd2lsbCBlbmFibGUgYnV0dG9uIGZvY3VzIGhpZ2hsaWdodGluZy5cbiAgLy8gU2hvdWxkIGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBpbml0aWFsaXphdGlvbi5cbiAgc3RhdGljIGVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0T25LZXlEb3duKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoKSA9PiBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSk7XG4gIH1cblxuICAvLyBFbmFibGVzIGJ1dHRvbiBmb2N1cyBoaWdobGlnaHRpbmc7IGRlc2lnbmVkIHRvIGJlIGNhbGxlZCBmcm9tIHRoZSBrZXlkb3duIGhhbmRsZXIgYWJvdmVcbiAgLy8gYnV0IGF2YWlsYWJsZSBzZXBhcmF0ZWx5IGZvciBpbXBsZW1lbnRhdGlvbnMgdGhhdCByZXF1aXJlIGl0LlxuICBzdGF0aWMgZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5nYi1idXR0b24nKSxcbiAgICAgICAgICBjb3VudCA9IGJ1dHRvbnMubGVuZ3RoO1xuICAgIC8vIGNmLiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZUxpc3QjRXhhbXBsZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgY29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGlmIChidXR0b24gJiYgYnV0dG9uLmNsYXNzTmFtZSkge1xuICAgICAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTU5NTEvY2hhbmdlLWFuLWVsZW1lbnRzLWNsYXNzLXdpdGgtamF2YXNjcmlwdFxuICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gYnV0dG9uLmNsYXNzTmFtZS5yZXBsYWNlKC8oPzpefFxccyluby1mb2N1cy1oaWdobGlnaHQoPyFcXFMpL2cgLCAnJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcHJldmVudCBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodCBvbiBjbGljayB3aGlsZSBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5XG4gIC8vIHNlZSBodHRwczovL3d3dy5wYWNpZWxsb2dyb3VwLmNvbS9ibG9nLzIwMTIvMDQvaG93LXRvLXJlbW92ZS1jc3Mtb3V0bGluZXMtaW4tYW4tYWNjZXNzaWJsZS1tYW5uZXIvXG4gIHN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm9Gb2N1c0hpZ2hsaWdodCA9ICduby1mb2N1cy1oaWdobGlnaHQnLFxuICAgICAgICAgIGJ1dHRvbiA9IHRoaXMucmVmcy5idXR0b247XG4gICAgaWYgKGJ1dHRvbiAmJiBidXR0b24uY2xhc3NOYW1lLmluZGV4T2Yobm9Gb2N1c0hpZ2hsaWdodCkgPCAwKVxuICAgICAgYnV0dG9uLmNsYXNzTmFtZSArPSAnICcgKyBub0ZvY3VzSGlnaGxpZ2h0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBsYWJlbCwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGNsYXNzZXMgPSAoY2xhc3NOYW1lID8gY2xhc3NOYW1lICsgJyAnIDogJycpICsgJ2diLWJ1dHRvbic7XG5cbiAgICBjb25zdCBoYW5kbGVNb3VzZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN1cHByZXNzQnV0dG9uRm9jdXNIaWdobGlnaHQoKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2NsYXNzZXN9IHJlZj0nYnV0dG9uJyB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2hhbmRsZU1vdXNlRXZlbnR9XG4gICAgICAgICAgICAgIG9uTW91c2VEb3duPXtoYW5kbGVNb3VzZUV2ZW50fT5cbiAgICAgICAge2xhYmVsfVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBtYWxlL2ZlbWFsZSBjaGFuZ2UgYnV0dG9uc1xuICogVGhlIGFwcGVhcmFuY2Ugb2YgdGhlIGJ1dHRvbnMgaXMgY3VycmVudGx5IGVudGlyZWx5IGNvbnRyb2xsZWQgdmlhIGV4dGVybmFsIENTUy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXggLSBbJ21hbGUnIHwgJ2ZlbWFsZSddIGN1cnJlbnRseSBzZWxlY3RlZCBidXR0b25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ2hhbmdlKGV2dCwgc2V4KSAtIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHVzZSBjbGlja3MgdG8gY2hhbmdlIHNleFxuICovXG5jb25zdCBDaGFuZ2VTZXhCdXR0b25zID0gKHtpZCwgc2V4LCBzcGVjaWVzLCBzaG93TGFiZWwsIHN0eWxlPXt9LCBvbkNoYW5nZX0pID0+IHtcbiAgY29uc3QgY2FwU2V4ID0gc2V4LnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgc2V4LnN1YnN0cigxKSxcbiAgICAgICAgc2VsZWN0ZWRTZXhDbGFzcyA9IHNleCA9PT0gJ21hbGUnID8gJ21hbGUtc2VsZWN0ZWQnIDogJ2ZlbWFsZS1zZWxlY3RlZCcsXG4gICAgICAgIEJVVFRPTl9JTUFHRV9XSURUSCA9IDEwMCxcbiAgICAgICAgQlVUVE9OX0lNQUdFX01JRFBPSU5UX1ggPSBCVVRUT05fSU1BR0VfV0lEVEggLyAyLFxuICAgICAgICBpbWFnZVN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uc3R5bGUgfSxcbiAgICAgICAgbGFiZWwgPSBzaG93TGFiZWwgPyBgJHtjYXBTZXh9ICR7c3BlY2llc31gIDogJycsXG4gICAgICAgIGxhYmVsRWxlbWVudCA9IHNob3dMYWJlbCA/IDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IEJVVFRPTl9JTUFHRV9XSURUSCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTB9fT57bGFiZWx9PC9kaXY+IDogJyc7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0UmVjdCA9IGV2dC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgY2xpY2tYID0gZXZ0LmNsaWVudFggLSBlbHRSZWN0LmxlZnQ7XG4gICAgaWYgKChzZXggPT09ICdtYWxlJykgIT09IChjbGlja1ggPiBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCkpXG4gICAgICBvbkNoYW5nZShzZXggPT09ICdtYWxlJyA/ICdmZW1hbGUnIDogJ21hbGUnKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBpZD17aWR9IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgIDxkaXYgIGNsYXNzTmFtZT17YGdlbmlibG9ja3MgY2hhbmdlLXNleC1idXR0b25zICR7c2VsZWN0ZWRTZXhDbGFzc31gfVxuICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSA+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtsYWJlbEVsZW1lbnR9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaGFuZ2VTZXhCdXR0b25zLnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNleDogUHJvcFR5cGVzLm9uZU9mKFsnbWFsZScsICdmZW1hbGUnXSkuaXNSZXF1aXJlZCxcbiAgc3BlY2llczogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2hvd0xhYmVsOiBQcm9wVHlwZXMuYm9vbCxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VTZXhCdXR0b25zO1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQ2hyb21vc29tZUltYWdlVmlldyA9ICh7d2lkdGg9MjMsIGhlaWdodD0xMjYsIGNvbG9yPScjRkY5OTk5J30pID0+IHtcbiAgY29uc3Qgc3BsaXQ9NDUsXG4gICAgICAgIHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICAgIGltYWdlV2lkdGggPSB3aWR0aCs0LFxuICAgICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgICAgaW1hZ2VIZWlnaHQgPSBoZWlnaHQrNDtcblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e2ltYWdlV2lkdGh9IGhlaWdodD17aW1hZ2VIZWlnaHR9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgIDxnPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysyfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdCtyYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17aGVpZ2h0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgPHJlY3QgaGVpZ2h0PXsoc3BsaXQtcmFkaXVzKS0ocmFkaXVzKzIpfSB3aWR0aD17d2lkdGh9IHk9e3JhZGl1cysyfSB4PVwiMlwiIHN0cm9rZVdpZHRoPVwiMFwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICA8cmVjdCBoZWlnaHQ9eyhoZWlnaHQtcmFkaXVzKS0oc3BsaXQrcmFkaXVzKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgIDxsaW5lIHkxPXtyYWRpdXMrMn0gICAgIHgxPVwiMlwiICAgICAgIHkyPXtzcGxpdC1yYWRpdXMrMn0gIHgyPVwiMlwiICAgICAgIHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT1cIjJcIiAgICAgICB5Mj17aGVpZ2h0LXJhZGl1c30gICB4Mj1cIjJcIiAgICAgICBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9e3dpZHRoKzJ9IHkyPXtoZWlnaHQtcmFkaXVzfSAgIHgyPXt3aWR0aCsyfSBzdHJva2VMaW5lY2FwPVwibnVsbFwiIHN0cm9rZUxpbmVqb2luPVwibnVsbFwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbkNocm9tb3NvbWVJbWFnZVZpZXcucHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hyb21vc29tZUltYWdlVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZUltYWdlVmlldyBmcm9tICcuL2Nocm9tb3NvbWUtaW1hZ2UnO1xuaW1wb3J0IEdlbmVMYWJlbFZpZXcgZnJvbSAnLi9nZW5lLWxhYmVsJztcbmltcG9ydCBHZW5ldGljc1V0aWxzIGZyb20gJy4uL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG5cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBlZGl0YWJsZT10cnVlLCBvbkFsbGVsZUNoYW5nZSwgbGFiZWxzT25SaWdodD10cnVlfSkgPT4ge1xuICBsZXQgYWxsZWxlcyA9IG9yZy5nZXRHZW5vdHlwZSgpLmNocm9tb3NvbWVzW2Nocm9tb3NvbWVOYW1lXVtzaWRlXS5hbGxlbGVzLFxuICAgICAgdmlzaWJsZUFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpLFxuICAgICAgbGFiZWxzICA9IHZpc2libGVBbGxlbGVzLm1hcChhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8R2VuZUxhYmVsVmlldyBrZXk9e2F9IHNwZWNpZXM9e29yZy5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXtlZGl0YWJsZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlKGEsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgICApO1xuICAgICAgfSksXG5cbiAgICAgIGNvbnRhaW5lckNsYXNzID0gXCJpdGVtc1wiO1xuXG4gIGlmICghbGFiZWxzT25SaWdodCkge1xuICAgIGNvbnRhaW5lckNsYXNzICs9IFwiIHJ0bFwiO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY29udGFpbmVyQ2xhc3MgfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYWJlbHNcIj5cbiAgICAgICAgICB7IGxhYmVscyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaHJvbW9zb21lVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjaHJvbW9zb21lTmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaWRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgZWRpdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGxhYmVsc09uUmlnaHQ6IFByb3BUeXBlcy5ib29sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogVXNlcyBhbiBTVkcgY2lyY3VsYXIgZ3JhZGllbnQgdG8gaW1wbGVtZW50IGEgZmFkaW5nIGdsb3cgYmFja2dyb3VuZC5cbiAqIEltcGxlbWVudGVkIGFzIGEgc3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIHRoZSBjb2xvciBvZiB0aGUgY2lyY3VsYXIgZ3JhZGllbnQgXCJnbG93XCJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gdGhlIGRpYW1ldGVyIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudFxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gc3R5bGVzIGFwcGxpZWQgdG8gdGhlIG91dGVyIGRpdlxuICovXG5jb25zdCBDaXJjdWxhckdsb3dWaWV3ID0gKHtpZCwgY29sb3IsIHNpemUsIHN0eWxlfSkgPT4ge1xuICBsZXQgcmFkaXVzID0gc2l6ZS8yLFxuICAgICAgY29sb3JOb0hhc2ggPSBjb2xvci5yZXBsYWNlKCcjJywgJycpLFxuICAgICAgZ3JhZGllbnRJRCA9IGBDaXJjdWxhckdsb3dWaWV3XyR7aWQgfHwgY29sb3JOb0hhc2h9YCxcbiAgICAgIGdyYWRpZW50SURVcmwgPSBgdXJsKCMke2dyYWRpZW50SUR9KWA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2lyY3VsYXItZ2xvd1wiIHN0eWxlPXtzdHlsZX0+XG4gICAgICA8c3ZnIHdpZHRoPXtzaXplKzJ9IGhlaWdodD17c2l6ZSsyfSB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgIDxkZWZzPlxuICAgICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD17Z3JhZGllbnRJRH0+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMS4wXCIvPlxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3BDb2xvcj17Y29sb3J9IHN0b3BPcGFjaXR5PVwiMC4wXCIvPlxuICAgICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+XG4gICAgICAgIDwvZGVmcz5cbiAgICAgICAgPGNpcmNsZSBmaWxsPXtncmFkaWVudElEVXJsfSBjeD17cmFkaXVzfSBjeT17cmFkaXVzfSByPXtyYWRpdXN9IC8+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNpcmN1bGFyR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2lyY3VsYXJHbG93VmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogSW1wbGVtZW50cyBhIHJlY3Rhbmd1bGFyIHRleHQgYXJlYSBmb3IgcHJvdmlkaW5nIGZlZWRiYWNrIHRvIHVzZXJzLCBzdWNoIGFzXG4gKiB0aGF0IHVzZWQgaW4gR2VuaXZlcnNlJ3MgY2hhbGxlbmdlcyBmb3IgcHJvdmlkaW5nIHRyaWFsIGFuZCBnb2FsIGZlZWRiYWNrLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHRleHQgLSBhIHNpbmdsZSBvciBtdWx0aXBsZSBsaW5lcyBvZiB0ZXh0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIGlubGluZSBzdHlsZXMgYXBwbGllZCB0byB0aGUgPGRpdj4gY29udGFpbmluZyBlYWNoIGxpbmUgb2YgdGV4dFxuICovXG5jb25zdCBGZWVkYmFja1ZpZXcgPSAoe3RleHQsIHN0eWxlPXt9fSkgPT4ge1xuICBjb25zdCB0VGV4dCA9IEFycmF5LmlzQXJyYXkodGV4dCkgPyB0ZXh0IDogW3RleHRdLFxuICAgICAgICBsaW5lQ291bnQgPSB0VGV4dC5sZW5ndGgsXG4gICAgICAgIGhlaWdodCA9IDIwICogbGluZUNvdW50ICsgMixcbiAgICAgICAgZGVmYXVsdFN0eWxlID0geyBoZWlnaHQ6IGhlaWdodCwgLi4uc3R5bGUgfSxcbiAgICAgICAgdGV4dExpbmVzID0gdFRleHQubWFwKChpVGV4dCwgaW5kZXgpID0+IFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjayB0ZXh0LWxpbmVcIiBrZXk9e2luZGV4fT57aVRleHR9PC9kaXY+KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBmZWVkYmFjay12aWV3XCIgc3R5bGU9e2RlZmF1bHRTdHlsZX0+XG4gICAgICB7dGV4dExpbmVzfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuRmVlZGJhY2tWaWV3LnByb3BUeXBlcyA9IHtcbiAgdGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKVxuICAgICAgICBdKS5pc1JlcXVpcmVkLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRmVlZGJhY2tWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBbmltYXRlZEdhbWV0ZVZpZXcgZnJvbSAnLi9hbmltYXRlZC1nYW1ldGUnO1xuXG5jb25zdCBJTklUSUFMX0dBTUVURV9TSVpFID0gMzAsXG4gICAgICBGSU5BTF9HQU1FVEVfU0laRSA9IDE0MCxcbiAgICAgIFJFU1RJTkdfTU9USEVSX0dBTUVURV9YID0gMCxcbiAgICAgIFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YID0gMTUwLFxuICAgICAgRkVSVElMSVpJTkdfTU9USEVSX0dBTUVURV9YID0gNzAsXG4gICAgICBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1ggPSA4MCxcbiAgICAgIEZJTkFMX1pZR09URV9ZID0gLTE1MDtcblxuZXhwb3J0IGNvbnN0IEdBTUVURV9UWVBFID0geyBNT1RIRVI6ICdtb3RoZXInLCBGQVRIRVI6ICdmYXRoZXInIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWyBHQU1FVEVfVFlQRS5NT1RIRVIsIEdBTUVURV9UWVBFLkZBVEhFUiBdKS5pc1JlcXVpcmVkLFxuICAgIGdhbWV0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgZmVydGlsaXphdGlvblN0YXRlOiBQcm9wVHlwZXMub25lT2YoWydub25lJywgJ2ZlcnRpbGl6aW5nJywgJ2ZlcnRpbGl6ZWQnLCAnY29tcGxldGUnXSkuaXNSZXF1aXJlZCxcbiAgICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICBzcmNSZWN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBkc3RSZWN0OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgdG9wOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLCAgLy8gc3RpZmZuZXNzIG9mIHNwcmluZyBmb3IgYW5pbWF0aW9uIChkZWZhdWx0OiAxMDApXG4gICAgb25SZXN0OiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoaWRkZW5BbGxlbGVzOiBbXSxcbiAgICBhbmltU3RpZmZuZXNzOiAxMDBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyID0gKCkgPT4ge1xuICAgIGxldCB7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcywgYW5pbVN0aWZmbmVzcywgb25SZXN0fSA9IHRoaXMucHJvcHMsXG4gICAgICAgIHhPZmZzZXQgPSB0aGlzLnByb3BzLnNyY1JlY3QgPyB0aGlzLnByb3BzLnNyY1JlY3QubGVmdCAtIHRoaXMucHJvcHMuZHN0UmVjdC5sZWZ0IDogMCxcbiAgICAgICAgeU9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC50b3AgLSB0aGlzLnByb3BzLmRzdFJlY3QudG9wIDogMCxcbiAgICAgICAgeFJlc3RpbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBSRVNUSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgeEZlcnRpbGl6aW5nID0gdGhpcy5wcm9wcy50eXBlID09PSBHQU1FVEVfVFlQRS5GQVRIRVIgPyBGRVJUSUxJWklOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1gsXG4gICAgICAgIGluaXRpYWwsIHRGaW5hbDtcblxuICAgIGlmICghZ2FtZXRlIHx8IChpZCA9PSBudWxsKSkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnbm9uZScpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUilcbiAgICAgICAgeE9mZnNldCArPSBSRVNUSU5HX0ZBVEhFUl9HQU1FVEVfWDtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhPZmZzZXQsIHk6IHlPZmZzZXQsIHNpemU6IElOSVRJQUxfR0FNRVRFX1NJWkUgfTtcbiAgICAgIHRGaW5hbCA9IHsgeDogeFJlc3RpbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMucHJvcHMuZmVydGlsaXphdGlvblN0YXRlID09PSAnZmVydGlsaXppbmcnKSB7XG4gICAgICBpbml0aWFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaW5pdGlhbCA9IHsgeDogeEZlcnRpbGl6aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDEuMCB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IEZJTkFMX1pZR09URV9ZLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgcm90YXRpb246IDAsIG9wYWNpdHk6IDAuMCB9O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8QW5pbWF0ZWRHYW1ldGVWaWV3IGdhbWV0ZT17Z2FtZXRlfSBpZD17aWR9IGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEaXNwbGF5PXtpbml0aWFsfSBkaXNwbGF5PXt0RmluYWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1TdGlmZm5lc3M9e2FuaW1TdGlmZm5lc3N9IG9uUmVzdD17b25SZXN0fSAvPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgR2FtZXRlUG9vbFZpZXcgPSAoe2dhbWV0ZXMsIGhpZGRlbkFsbGVsZXM9W10sIHdpZHRoPTMwMCwgaGVpZ2h0PTIwMCwgYW5pbVN0aWZmbmVzcz02MCwgc2VsZWN0ZWRJZCwgaXNHYW1ldGVEaXNhYmxlZCwgb25HYW1ldGVTZWxlY3RlZH0pID0+IHtcbiAgbGV0IGdhbWV0ZUNvdW50ID0gZ2FtZXRlcy5sZW5ndGgsXG4gICAgICBnYW1ldGVTaXplID0gMzAsXG4gICAgICBtYXJnaW4gPSA1LFxuICAgICAgc3BhY2luZ0RlZmF1bHQgPSBnYW1ldGVTaXplICsgMiAqIG1hcmdpbixcbiAgICAgIHhTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB5U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgY29sRGVmYXVsdCA9IE1hdGguZmxvb3Iod2lkdGggLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICByb3dEZWZhdWx0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICBlbmFibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZEZsYWdzID0gaXNHYW1ldGVEaXNhYmxlZCA/IGdhbWV0ZXMubWFwKGcgPT4gaXNHYW1ldGVEaXNhYmxlZChnKSkgOiBbXSxcbiAgICAgIHRvdGFsRGlzYWJsZWRDb3VudCA9IGRpc2FibGVkRmxhZ3MucmVkdWNlKCh0b3RhbCxmbGFnKSA9PiB0b3RhbCArIGZsYWcsIDApLFxuICAgICAgLy8gbGVhdmUgcm9vbSBmb3IgdGhlIGRpc2FibGVkIGdhbWV0ZSByb3cgaWYgdGhlcmUgYXJlIGRpc2FibGVkIGdhbWV0ZXNcbiAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGhlaWdodCAtICh0b3RhbERpc2FibGVkQ291bnQgPyBzcGFjaW5nRGVmYXVsdCA6IDApIC0gNCAqIG1hcmdpbixcbiAgICAgIC8vIHBhY2sgdGhlIGRpc2FibGVkIGdhbWV0ZXMgaW50byB0aGUgZGlzYWJsZWQgcm93XG4gICAgICB4RGlzYWJsZWRTcGFjaW5nID0gTWF0aC5taW4oeFNwYWNpbmcgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aWR0aCAtIDcgKiBtYXJnaW4pIC8gdG90YWxEaXNhYmxlZENvdW50KSxcbiAgICAgIHlEaXNhYmxlZFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHRvdGFsRW5hYmxlZENvdW50ID0gZ2FtZXRlQ291bnQgLSB0b3RhbERpc2FibGVkQ291bnQsXG4gICAgICBnYW1ldGVWaWV3cztcblxuICAvLyBzcXVlZXplIGluIHRvIG1ha2Ugcm9vbSBmb3IgYWRkaXRpb25hbCBnYW1ldGVzIGlmIG5lY2Vzc2FyeVxuICB2YXIgY29sQ291bnQgPSBjb2xEZWZhdWx0LFxuICAgICAgcm93Q291bnQgPSByb3dEZWZhdWx0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA+IDApO1xuICB3aGlsZSAoY29sQ291bnQgKiByb3dDb3VudCA8IHRvdGFsRW5hYmxlZENvdW50KSB7XG4gICAgaWYgKHlTcGFjaW5nID4geFNwYWNpbmcpIHtcbiAgICAgIHlTcGFjaW5nID0gYXZhaWxhYmxlSGVpZ2h0IC8gKytyb3dDb3VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB4U3BhY2luZyA9ICh3aWR0aCAtIDQgKiBtYXJnaW4pIC8gKytjb2xDb3VudDtcbiAgICB9XG4gIH1cblxuICBnYW1ldGVWaWV3cyA9IGdhbWV0ZXMubWFwKChnYW1ldGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkRmxhZ3NbaW5kZXhdLFxuICAgICAgICAgIGxheW91dEluZGV4ID0gaXNEaXNhYmxlZCA/IGRpc2FibGVkQ291bnQrKyA6IGVuYWJsZWRDb3VudCsrLFxuICAgICAgICAgIHJvdyA9IGlzRGlzYWJsZWQgPyByb3dEZWZhdWx0IC0gMSA6IE1hdGguZmxvb3IobGF5b3V0SW5kZXggLyBjb2xDb3VudCksXG4gICAgICAgICAgY29sID0gaXNEaXNhYmxlZCA/IGxheW91dEluZGV4IDogbGF5b3V0SW5kZXggJSBjb2xDb3VudCxcbiAgICAgICAgICB5ID0gaXNEaXNhYmxlZCA/IHJvdyAqIHlEaXNhYmxlZFNwYWNpbmcgOiByb3cgKiB5U3BhY2luZyxcbiAgICAgICAgICB4ID0gaXNEaXNhYmxlZCA/IGNvbCAqIHhEaXNhYmxlZFNwYWNpbmcgOiBjb2wgKiB4U3BhY2luZztcbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2luZGV4ICsgMX0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh3aWR0aC8yKSwgeTogLU1hdGgucm91bmQoeVNwYWNpbmcpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpbmRleCArIDEgPT09IHNlbGVjdGVkSWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uR2FtZXRlU2VsZWN0ZWR9IC8+XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2FtZXRlLXBvb2xcIiBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH19PlxuICAgICAgeyBnYW1ldGVWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVQb29sVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzZWxlY3RlZElkOiBQcm9wVHlwZXMubnVtYmVyLFxuICBpc0dhbWV0ZURpc2FibGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25HYW1ldGVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVBvb2xWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBTdGF0ZWxlc3MgZnVuY3Rpb25hbCBSZWFjdCBjb21wb25lbnQgZm9yIGRpc3BsYXlpbmcgYSBCaW9sb2dpY2EgZ2FtZXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGdhbWV0ZSAtIEJpb2xvZ2ljYSBnYW1ldGUgKG1hcCBvZiBjaHJvbW9zb21lIG5hbWVzIHRvIGNocm9tb3NvbWVzKVxuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIHVuaXF1ZSBpZCBvZiB0aGlzIGdhbWV0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gaGlkZGVuQWxsZWxlcyAtIGluZGl2aWR1YWwgYWxsZWxlcyBvZiBnZW5lcyBmb3Igd2hpY2ggYWxsIGFsbGVsZXMgc2hvdWxkIGJlIGhpZGRlblxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NlbGVjdGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ3NlbGVjdGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Rpc2FibGVkPWZhbHNlXSAtIHdoZXRoZXIgdGhlIGdhbWV0ZSBzaG91bGQgaGF2ZSB0aGUgJ2Rpc2FibGVkJyBjbGFzcyBhcHBsaWVkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25DbGljayhldnQsIGlkLCByZWN0KV0gLSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZ2FtZXRlIGlzIGNsaWNrZWRcbiAqXG4gKiBOb3RlOiBBcyB0aGluZ3Mgc3RhbmQgY3VycmVudGx5LCB0aGVyZSBpcyBfbm9fIHBhcnRpY3VsYXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBkZWZpbmVkXG4gKiBieSB0aGlzIHZpZXcuIFRoZSBjbGllbnQgY2FuIHN0eWxlIHRoZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2FtZXRlIGJ5IHN0eWxpbmcgdGhlXG4gKiAnLmdlbmlibG9ja3MuZ2FtZXRlJyBjbGFzcyBpbiBDU1MsIGUuZy4gYnkgYXNzaWduaW5nIGEgYmFja2dyb3VuZC1pbWFnZS5cbiAqL1xuY29uc3QgR2FtZXRlVmlldyA9ICh7Z2FtZXRlLCBpZCwgaGlkZGVuQWxsZWxlcz1bXSwgZGlzcGxheSwgaXNTZWxlY3RlZD1mYWxzZSwgaXNEaXNhYmxlZD1mYWxzZSwgb25DbGlja30pID0+IHtcblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhldnQpIHtcbiAgICBjb25zdCBlbHQgPSBldnQudGFyZ2V0LFxuICAgICAgICAgIHJlY3QgPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKCFpc0Rpc2FibGVkICYmIG9uQ2xpY2spIHtcbiAgICAgIG9uQ2xpY2soZXZ0LCBpZCwgcmVjdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRUb29sdGlwRm9yR2FtZXRlKGdhbWV0ZSkge1xuICAgIGxldCB0b29sdGlwID0gXCJcIixcbiAgICAgICAgYWxsSGlkZGVuQWxsZWxlcztcbiAgICAvLyBOb3RlOiBpdCB3b3VsZCBiZSBtb3JlIGVmZmljaWVudCBmb3IgdGhlIGNhbGxlciB0byBwYXNzIGluIHRoZVxuICAgIC8vIGFsbEhpZGRlbkFsbGVsZXMgYXJyYXkgcmF0aGVyIHRoYW4gY29tcHV0aW5nIGl0IGVhY2ggdGltZSBoZXJlLlxuICAgIC8vIEJ1dCBpZiB3ZSBtb3ZlZCBpdCBvdXQgcmlnaHQgbm93IHdlJ2QgaGF2ZSB0byBlbGltaW5hdGUgdGhlIEVTNiBzcGxhdC5cbiAgICBmdW5jdGlvbiBjb25jYXRIaWRkZW5BbGxlbGVzKGlTcGVjaWVzLCBpSGlkZGVuQWxsZWxlcykge1xuICAgICAgYWxsSGlkZGVuQWxsZWxlcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCBhbGxlbGUgb2YgaUhpZGRlbkFsbGVsZXMpIHtcbiAgICAgICAgY29uc3QgZ2VuZSA9IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoaVNwZWNpZXMsIGFsbGVsZSk7XG4gICAgICAgIGFsbEhpZGRlbkFsbGVsZXMucHVzaCguLi5nZW5lLmFsbGVsZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGNoIGluIGdhbWV0ZSkge1xuICAgICAgdmFyIGNocm9tb3NvbWUgPSBnYW1ldGVbY2hdO1xuICAgICAgaWYgKGFsbEhpZGRlbkFsbGVsZXMgPT0gbnVsbClcbiAgICAgICAgY29uY2F0SGlkZGVuQWxsZWxlcyhjaHJvbW9zb21lLnNwZWNpZXMsIGhpZGRlbkFsbGVsZXMpO1xuICAgICAgZm9yIChjb25zdCBhbGxlbGUgb2YgY2hyb21vc29tZS5hbGxlbGVzKSB7XG4gICAgICAgIGlmIChhbGxIaWRkZW5BbGxlbGVzLmluZGV4T2YoYWxsZWxlKSA8IDApIHtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IGNocm9tb3NvbWUuc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIGxhYmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2ggPT09ICdYWScpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjaHJvbW9zb21lLnNpZGUgPT09ICd5JyA/ICd5JyA6ICd4JztcbiAgICAgICAgdG9vbHRpcCArPSAodG9vbHRpcCA/ICdcXG4nIDogJycpICsgY2ggKyAnOiAnICsgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b29sdGlwO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWRDbGFzcyA9IGlzU2VsZWN0ZWQgJiYgIWlzRGlzYWJsZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwiLFxuICAgICAgICBkaXNhYmxlZENsYXNzID0gaXNEaXNhYmxlZCA/IFwiZGlzYWJsZWRcIiA6IFwiXCIsXG4gICAgICAgIGdyb3VwID0gaWQgJSA0LFxuICAgICAgICByb3RhdGlvbkZvckdyb3VwID0gZ3JvdXAgKiA5MCxcbiAgICAgICAgY2xhc3NlcyA9IGBnZW5pYmxvY2tzIGdhbWV0ZSAke3NlbGVjdGVkQ2xhc3N9ICR7ZGlzYWJsZWRDbGFzc30gZ3JvdXAke2dyb3VwfWAsXG4gICAgICAgIHNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIHJvdGF0aW9uID0gZGlzcGxheS5yb3RhdGlvbiAhPSBudWxsID8gZGlzcGxheS5yb3RhdGlvbiA6IHJvdGF0aW9uRm9yR3JvdXAsXG4gICAgICAgIHRyYW5zZm9ybSA9IHJvdGF0aW9uID8gYHJvdGF0ZSgke3JvdGF0aW9ufWRlZylgIDogJycsXG4gICAgICAgIG9wYWNpdHkgPSBkaXNwbGF5Lm9wYWNpdHkgIT0gbnVsbCA/IGRpc3BsYXkub3BhY2l0eSA6IDEuMCxcbiAgICAgICAgdG9vbHRpcCA9IGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB0aXRsZT17dG9vbHRpcH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgbGVmdDogZGlzcGxheS54LCB0b3A6IGRpc3BsYXkueSxcbiAgICAgICAgICAgIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICB0cmFuc2Zvcm0sIG9wYWNpdHlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGRpc3BsYXk6IFByb3BUeXBlcy5zaGFwZSh7ICAgICAgICAvLyBkaXNwbGF5IHByb3BlcnRpZXNcbiAgICB4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uIChsZWZ0KSBvZiBnYW1ldGUgaW1hZ2VcbiAgICB5OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIGxvY2F0aW9uICh0b3ApIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgLy8gc2l6ZSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDMwKVxuICAgIHJvdGF0aW9uOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8gcm90YXRpb24gKGRlZykgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAwfDkwfDE4MHwyNzApXG4gICAgb3BhY2l0eTogUHJvcFR5cGVzLm51bWJlciAgICAgICAvLyBvcGFjaXR5IG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMS4wKVxuICB9KS5pc1JlcXVpcmVkLFxuICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1ldGVWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgR2VuZUxhYmVsVmlldyA9ICh7c3BlY2llcywgYWxsZWxlLCBlZGl0YWJsZT1mYWxzZSwgb25BbGxlbGVDaGFuZ2V9KSA9PiB7XG4gIGlmICghZWRpdGFibGUpIHtcbiAgICBjb25zdCBhbGxlbGVOYW1lID0gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthbGxlbGVdO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2VuZS1sYWJlbCBhbGxlbGUgbm9uZWRpdGFibGVcIj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgeyBhbGxlbGVOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhbGxlbGVzID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhbGxlbGUpLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIGFsbGVsZU9wdGlvbnMgPSBhbGxlbGVOYW1lcy5tYXAoKG5hbWUsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17bmFtZX0gdmFsdWU9e2FsbGVsZXNbaV19PntuYW1lfTwvb3B0aW9uPilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGdlbmUtbGFiZWwgYWxsZWxlIGVkaXRhYmxlXCI+XG4gICAgICAgIDxzZWxlY3QgdmFsdWU9eyBhbGxlbGUgfSBvbkNoYW5nZT17IG9uQWxsZWxlQ2hhbmdlIH0+XG4gICAgICAgICAgeyBhbGxlbGVPcHRpb25zIH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5HZW5lTGFiZWxWaWV3LnByb3BUeXBlcyA9IHtcbiAgc3BlY2llczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBhbGxlbGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZWRpdGFibGU6IFByb3BUeXBlcy5ib29sLFxuICBvbkFsbGVsZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVMYWJlbFZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENocm9tb3NvbWVJbWFnZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lLWltYWdlJztcbmltcG9ydCBHZW5ldGljc1V0aWxzIGZyb20gJy4uL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG5cbmxldCBUZXN0UHVsbGRvd25WaWV3ID0gKHtzcGVjaWVzLCBnZW5lLCBzZWxlY3Rpb24sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICAgICAgbGV0IGFsbGVsZXMgPSBnZW5lLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIG51bUFsbGVsZXMgPSBhbGxlbGVOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgcG9zc2libGVDb21ib3MgPSBbXSxcbiAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uIHx8IFwicGxhY2Vob2xkZXJcIixcbiAgICAgICAgICBpLCBqO1xuXG4gICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PVwicGxhY2Vob2xkZXJcIiB2YWx1ZT1cInBsYWNlaG9sZGVyXCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNlbGVjdCBhIEdlbm90eXBlPC9vcHRpb24+KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG51bUFsbGVsZXM7IGkrKykge1xuICAgICAgICBmb3IgKGogPSBpOyBqIDwgbnVtQWxsZWxlczsgaisrKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGkgKyBcIiBcIiArIGosXG4gICAgICAgICAgICAgIHN0cmluZyA9IGFsbGVsZU5hbWVzW2ldICsgXCIgLyBcIiArIGFsbGVsZU5hbWVzW2pdO1xuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2tleX0+e3N0cmluZ308L29wdGlvbj4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0LXdyYXBwZXJcIj5cbiAgICAgICAgICA8c2VsZWN0IHZhbHVlPXsgY3VycmVudFNlbGVjdGlvbiB9IG9uQ2hhbmdlPXsgb25TZWxlY3Rpb25DaGFuZ2UgfT5cbiAgICAgICAgICAgIHsgcG9zc2libGVDb21ib3MgfVxuICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfTtcblxuY29uc3QgR2Vub21lVGVzdFZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcz1bXSwgc2VsZWN0aW9uPXt9LCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBhbGxlbGVzID0gY2hyb21bT2JqZWN0LmtleXMoY2hyb20pWzBdXS5hbGxlbGVzLFxuICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBvcmcuc3BlY2llcyksXG4gICAgICAgIGdlbmVzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYSkpLFxuICAgICAgICBwdWxsZG93bnMgPSBnZW5lcy5tYXAoZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXN0UHVsbGRvd25WaWV3XG4gICAgICAgICAgICAgIGtleSAgICAgICA9IHsgZy5uYW1lIH1cbiAgICAgICAgICAgICAgc3BlY2llcyAgID0geyBvcmcuc3BlY2llcyB9XG4gICAgICAgICAgICAgIGdlbmUgICAgICA9IHsgZyB9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbiA9IHsgc2VsZWN0aW9uW2cubmFtZV0gfVxuICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZSA9IHsgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICB9IH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIiBrZXk9e2Nocm9tb3NvbWVOYW1lfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5vbWUtdGVzdC1vcHRpb25zXCI+XG4gICAgICAgICAgeyBwdWxsZG93bnMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lLXRlc3RcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblRlc3RQdWxsZG93blZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGdlbmU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgc2VsZWN0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuR2Vub21lVGVzdFZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBzZWxlY3Rpb246IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVUZXN0VmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hyb21vc29tZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lJztcblxuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBoaWRkZW5BbGxlbGVzID0gW10sIGVkaXRhYmxlPXRydWUsIG9uQWxsZWxlQ2hhbmdlfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGZvciAobGV0IGNocm9tb3NvbWVOYW1lIG9mIG9yZy5zcGVjaWVzLmNocm9tb3NvbWVOYW1lcykge1xuICAgIGxldCBjaHJvbSA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgcGFpcnMucHVzaChcbiAgICAgICAgPENocm9tb3NvbWVWaWV3XG4gICAgICAgICAgb3JnPXtvcmd9XG4gICAgICAgICAga2V5PXtwYWlycy5sZW5ndGggKyAxfVxuICAgICAgICAgIGNocm9tb3NvbWVOYW1lPXtjaHJvbW9zb21lTmFtZX1cbiAgICAgICAgICBzaWRlPXtzaWRlfVxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgbGFiZWxzT25SaWdodD17cGFpcnMubGVuZ3RoPjB9XG4gICAgICAgICAgZWRpdGFibGU9e2VkaXRhYmxlfVxuICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlPXtmdW5jdGlvbihwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlKGNocm9tb3NvbWVOYW1lLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgICAgICAgIH19Lz5cbiAgICAgICk7XG4gICAgfVxuICAgIHBhaXJXcmFwcGVycy5wdXNoKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNocm9tb3NvbWUtcGFpclwiIGtleT17cGFpcldyYXBwZXJzLmxlbmd0aCArIDF9PlxuICAgICAgICB7IHBhaXJzIH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lXCI+XG4gICAgICB7IHBhaXJXcmFwcGVycyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HZW5vbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgb25BbGxlbGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdlbm9tZVZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcblxuY29uc3QgR2xvd0JhY2tncm91bmRWaWV3ID0gKHtpZCwgY29sb3IsIHNpemUsIGNvbnRhaW5lclN0eWxlPXt9LCBnbG93U3R5bGU9e30sIENoaWxkQ29tcG9uZW50LCBjaGlsZFN0eWxlPXt9LCAuLi5vdGhlcnN9KSA9PiB7XG4gIGNvbnN0IHRDb250YWluZXJTdHlsZSA9IHsgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemUsIC4uLmNvbnRhaW5lclN0eWxlIH0sXG4gICAgICAgIHRHbG93U3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5nbG93U3R5bGUgfSxcbiAgICAgICAgdENoaWxkU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5jaGlsZFN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2xvdy1iYWNrZ3JvdW5kXCIgc3R5bGU9e3RDb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17J2dsb3ctJytpZH0gY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17dEdsb3dTdHlsZX0vPlxuICAgICAgPENoaWxkQ29tcG9uZW50IGlkPXsnY2hpbGQtJytpZH0gc3R5bGU9e3RDaGlsZFN0eWxlfSB3aWR0aD17c2l6ZX0gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdsb3dCYWNrZ3JvdW5kVmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgY29udGFpbmVyU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGdsb3dTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgQ2hpbGRDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGNoaWxkU3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdsb3dCYWNrZ3JvdW5kVmlldztcbiIsIi8qXG4gKiBCYXNlZCBvbiBSZWFjdE92ZXJsYXlzIGRlbW8gYXQgaHR0cDovL3JlYWN0LWJvb3RzdHJhcC5naXRodWIuaW8vcmVhY3Qtb3ZlcmxheXMvZXhhbXBsZXMvI21vZGFsc1xuICovXG5pbXBvcnQgTW9kYWwgZnJvbSAncmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBtb2RhbFN0eWxlID0ge1xuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiAxMDQwLFxuICB0b3A6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDBcbn07XG5cbmNvbnN0IGJhY2tkcm9wU3R5bGUgPSB7XG4gIC4uLm1vZGFsU3R5bGUsXG4gIHpJbmRleDogJ2F1dG8nLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJyxcbiAgb3BhY2l0eTogMC4xXG59O1xuXG5jb25zdCBkaWFsb2dTdHlsZSA9IGZ1bmN0aW9uKCkge1xuICAvLyB3ZSB1c2Ugc29tZSBwc3VlZG8gcmFuZG9tIGNvb3JkcyBzbyBuZXN0ZWQgbW9kYWxzXG4gIC8vIGRvbid0IHNpdCByaWdodCBvbiB0b3Agb2YgZWFjaCBvdGhlci5cbiAgbGV0IHRvcCA9IDUwO1xuICBsZXQgbGVmdCA9IDUwO1xuXG4gIHJldHVybiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgd2lkdGg6IDQwMCxcbiAgICB0b3A6IHRvcCArICclJywgbGVmdDogbGVmdCArICclJyxcbiAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoLSR7dG9wfSUsIC0ke2xlZnR9JSlgLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZTVlNWU1JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgYm94U2hhZG93OiAnMCA1cHggMTVweCByZ2JhKDAsMCwwLC41KScsXG4gICAgcGFkZGluZzogMjBcbiAgfTtcbn07XG5cblxuY2xhc3MgTW9kYWxBbGVydCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBzaG93OiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBleHBsYW5hdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsZWZ0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgICB9KSxcbiAgICByaWdodEJ1dHRvbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICBvbkhpZGU6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLyogZXNsaW50IHJlYWN0L2pzeC1oYW5kbGVyLW5hbWVzOiAwICovXG4gICAgY29uc3QgbGVmdFByb3BzID0gdGhpcy5wcm9wcy5sZWZ0QnV0dG9uLFxuICAgICAgICAgIGxlZnRCdXR0b24gPSBsZWZ0UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPEJ1dHRvbiBsYWJlbD17bGVmdFByb3BzLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2xlZnRQcm9wcy5vbkNsaWNrfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgcmlnaHRQcm9wcyA9IHRoaXMucHJvcHMucmlnaHRCdXR0b24sXG4gICAgICAgICAgcmlnaHRCdXR0b24gPSA8QnV0dG9uIGxhYmVsPXtyaWdodFByb3BzLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtyaWdodFByb3BzLm9uQ2xpY2t9Lz47XG5cbiAgICByZXR1cm4gKFxuICAgICAgPE1vZGFsICBhcmlhLWxhYmVsbGVkYnk9J21vZGFsLWxhYmVsJ1xuICAgICAgICAgICAgICBzdHlsZT17bW9kYWxTdHlsZX1cbiAgICAgICAgICAgICAgYmFja2Ryb3BTdHlsZT17YmFja2Ryb3BTdHlsZX1cbiAgICAgICAgICAgICAgc2hvdz17dGhpcy5wcm9wcy5zaG93fVxuICAgICAgICAgICAgICBvbkhpZGU9e3RoaXMucHJvcHMub25IaWRlfSA+XG4gICAgICAgIDxkaXYgc3R5bGU9e2RpYWxvZ1N0eWxlKCl9ID5cbiAgICAgICAgICA8aDQgaWQ9J21vZGFsLWxhYmVsJz57dGhpcy5wcm9wcy5tZXNzYWdlfTwvaDQ+XG4gICAgICAgICAgPHA+e3RoaXMucHJvcHMuZXhwbGFuYXRpb259PC9wPlxuICAgICAgICAgIHtsZWZ0QnV0dG9ufSB7cmlnaHRCdXR0b259XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Nb2RhbD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsQWxlcnQ7XG5cbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQmlvTG9naWNhIG9yZ2FuaXNtIGFzIGFuIGltYWdlIG9uIHRvcCBvZiBhIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQuXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gb3JnIC0gdGhlIG9yZ2FuaXNtIHRvIGJlIHJlcHJlc2VudGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB0aGUgY29sb3Igb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiIGJhY2tncm91bmQgdmlldy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gKi9cbmNvbnN0IE9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2lkLCBjbGFzc05hbWUsIGNvbG9yLCBzaXplLCBzdHlsZT17fSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplfSxcbiAgICAgICAgZ2xvd1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJyB9LFxuICAgICAgICBvcmdTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLnN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGlkPXtpZH0gY2xhc3NOYW1lPXtgZ2VuaWJsb2NrcyBvcmdhbmlzbS1nbG93ICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17YCR7aWR9LWdsb3dgfSBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHN0eWxlPXtnbG93U3R5bGV9Lz5cbiAgICAgIDxPcmdhbmlzbVZpZXcgaWQ9e2Ake2lkfS1vcmdhbmlzbWB9IHdpZHRoPXtzaXplfSBzdHlsZT17b3JnU3R5bGV9IHsuLi5vdGhlcn0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9yZ2FuaXNtR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5leHBvcnQgZGVmYXVsdCBPcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgT3JnYW5pc21WaWV3ID0gKHtvcmcsIGlkLCB3aWR0aD0yMDAsIHN0eWxlPXt9LCBvbkNsaWNrLCB3cmFwcGVyIH0pID0+IHtcbiAgY29uc3QgYmFzZVVybCA9IFwiaHR0cHM6Ly9nZW5pdmVyc2UtcmVzb3VyY2VzLmNvbmNvcmQub3JnL3Jlc291cmNlcy9kcmFrZXMvaW1hZ2VzL1wiLFxuICAgICAgICB1cmwgICAgID0gYmFzZVVybCArIG9yZy5nZXRJbWFnZU5hbWUoKSxcbiAgICAgICAgLy8gVGhlIGdvYWwgaGVyZSB3YXMgdG8gaGF2ZSB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBzZWxlY3QgdGhlIG9yZ2FuaXNtLFxuICAgICAgICAvLyBzbyB0aGF0IG1vdXNlZG93bi1kcmFnIHdpbGwgYm90aCBzZWxlY3QgdGhlIG9yZ2FuaXNtIGFuZCBiZWdpbiB0aGVcbiAgICAgICAgLy8gZHJhZy4gVGhpcyB3b3JrcyBvbiBDaHJvbWUgYW5kIFNhZmFyaSwgYnV0IG9uIEZpcmVmb3ggaXQgZGlzYWJsZXNcbiAgICAgICAgLy8gZHJhZ2dpbmcuIERpc2FibGluZyB0aGUgb25Nb3VzZURvd24gaGFuZGxlciBtZWFucyB0aGF0IEZpcmVmb3ggdXNlcnNcbiAgICAgICAgLy8gbXVzdCBjbGljayB0byBzZWxlY3QgYW5kIHRoZW4gY2xpY2sgdG8gZHJhZywgYnV0IGF0IGxlYXN0IHRoZXkgY2FuXG4gICAgICAgIC8vIGRyYWcuIFRoZSByaWdodCBzb2x1dGlvbiBpcyBwcm9iYWJseSB0byBhbGxvdyBvcmdhbmlzbXMgdG8gYmUgZHJhZ2dlZFxuICAgICAgICAvLyB3aGV0aGVyIG9yIG5vdCB0aGV5J3JlIHNlbGVjdGVkIGFuZCB0aGVuIGhvcGVmdWxseSB0aGUgb25Nb3VzZURvd25cbiAgICAgICAgLy8gaGFuZGxlciB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQuIE90aGVyd2lzZSwgaXQgbWF5IGJlIG5lY2Vzc2FyeSB0b1xuICAgICAgICAvLyBzZWxlY3QgdGhlIG9yZ2FuaXNtIChpZiBpdCBpc24ndCBhbHJlYWR5IHNlbGVjdGVkKSBpbiBiZWdpbkRyYWcuXG4gICAgICAgIGlzRmlyZWZveCA9IChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID49IDApLFxuICAgICAgICBoYW5kbGVNb3VzZURvd24gPSBpc0ZpcmVmb3ggPyB1bmRlZmluZWQgOiBoYW5kbGVDbGljayxcbiAgICAgICAgZGl2V3JhcHBlciA9IHdyYXBwZXIgfHwgZnVuY3Rpb24oZWx0KSB7IHJldHVybiBlbHQ7IH07XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaWQsIG9yZyk7XG4gIH1cblxuICByZXR1cm4gZGl2V3JhcHBlcihcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3Mgb3JnYW5pc21cIiBpZD17aWR9IHN0eWxlPXtzdHlsZX0gXG4gICAgICAgICAgb25Nb3VzZURvd249e2hhbmRsZU1vdXNlRG93bn0gb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgICAgPGltZyBzcmM9e3VybH0gd2lkdGg9e3dpZHRofSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICB3cmFwcGVyOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQZW5WaWV3IGZyb20gJy4vcGVuJztcbmltcG9ydCBTdGF0c1ZpZXcgZnJvbSAnLi9zdGF0cyc7XG5pbXBvcnQgVGFicyBmcm9tICdyZWFjdC1zaW1wbGV0YWJzJztcblxuY2xhc3MgUGVuU3RhdHNWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgb3JncywgbGFzdENsdXRjaFNpemUsIHNlbGVjdGVkSW5kZXgsIG9uU2VsZWN0aW9uQ2hhbmdlLCAuLi5vdGhlcnMgfSA9IHRoaXMucHJvcHMsXG4gICAgICAgICAgbGFzdENsdXRjaCA9IG9yZ3Muc2xpY2UoLWxhc3RDbHV0Y2hTaXplKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8VGFicz5cbiAgICAgICAgPFRhYnMuUGFuZWwgdGl0bGU9XCJCcmVlZGluZyBQZW5cIiBrZXk9XCJCcmVlZGluZyBQZW5cIj5cbiAgICAgICAgICA8UGVuVmlldyBvcmdzPXtsYXN0Q2x1dGNofSB7Li4ub3RoZXJzfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbmRleD17c2VsZWN0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Z1bmN0aW9uKGlTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvblNlbGVjdGlvbkNoYW5nZSlcbiAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShpU2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L1RhYnMuUGFuZWw+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiU3RhdHNcIiBrZXk9XCJTdGF0c1wiPlxuICAgICAgICAgIDxTdGF0c1ZpZXcgb3Jncz17b3Jnc30gbGFzdENsdXRjaFNpemU9e2xhc3RDbHV0Y2hTaXplfSAvPlxuICAgICAgICA8L1RhYnMuUGFuZWw+XG4gICAgICA8L1RhYnM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQZW5TdGF0c1ZpZXc7XG4iLCJpbXBvcnQge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtVmlldyBmcm9tICcuL29yZ2FuaXNtJztcblxuY29uc3QgUGVuVmlldyA9ICh7b3JncywgaWRQcmVmaXg9J29yZ2FuaXNtLScsIHdpZHRoPTQwMCwgY29sdW1ucz01LCBTZWxlY3RlZE9yZ2FuaXNtVmlldz1PcmdhbmlzbVZpZXcsIHNlbGVjdGVkSW5kZXgsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soaWQsIG9yZykge1xuICAgIGNvbnN0IHByZWZpeEluZGV4ID0gaWQuaW5kZXhPZihpZFByZWZpeCksXG4gICAgICAgICAgaW5kZXggPSBOdW1iZXIoaWQuc3Vic3RyKHByZWZpeEluZGV4ICsgaWRQcmVmaXgubGVuZ3RoKSk7XG4gICAgaWYgKG9uQ2xpY2spIG9uQ2xpY2soaW5kZXgsIGlkLCBvcmcpO1xuICB9XG5cbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZywgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09PSBzZWxlY3RlZEluZGV4XG4gICAgICAgICAgICAgICAgPyA8U2VsZWN0ZWRPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZFByZWZpeCArIGluZGV4fSBpbmRleD17aW5kZXh9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cIiNGRkZGQUFcIiBzaXplPXtvcmdXaWR0aH0gb25DbGljaz17aGFuZGxlQ2xpY2t9Lz5cbiAgICAgICAgICAgICAgICA6IDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZFByZWZpeCArIGluZGV4fSBpbmRleD17aW5kZXh9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPXtvcmdXaWR0aH0gb25DbGljaz17aGFuZGxlQ2xpY2t9Lz47XG4gICAgICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBwZW5cIj5cbiAgICAgIHsgb3JnVmlld3MgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUGVuVmlldy5wcm9wVHlwZXMgPSB7XG4gIG9yZ3M6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGlkUHJlZml4OiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgY29sdW1uczogUHJvcFR5cGVzLm51bWJlcixcbiAgU2VsZWN0ZWRPcmdhbmlzbVZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2lyY3VsYXJHbG93VmlldyBmcm9tICcuL2NpcmN1bGFyLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbkdsb3dWaWV3ID0gKHtnbG93Q29sb3IsIHNpemU9MjAwfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJTdHlsZSA9IHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX0sXG4gICAgICAgIGdsb3dTdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJ307XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvd1wiIHN0eWxlPXtjb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBjb2xvcj17Z2xvd0NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17Z2xvd1N0eWxlfS8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tZ2xvdyBxdWVzdGlvbi1tYXJrXCJcbiAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246IFwiYWJzb2x1dGVcIiwgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZX19PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG4gIC8vIEhUTUwgdGV4dCBub2RlXG4gIC8vPGRpdiBzdHlsZT17dFN0eWxlfT57dGV4dH08L2Rpdj5cblxuICAvLyBTVkcgdGV4dCBub2RlXG4gIC8vPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAvLyAgPHRleHQgeD0nNTAnIHk9JzE3NScgZmlsbD0nIzBEMEQ4Qycgc3R5bGU9e3RTdHlsZX0+XG4gIC8vICAgIHt0ZXh0fVxuICAvLyAgPC90ZXh0PlxuICAvLzwvc3ZnPlxufTtcblxuUXVlc3Rpb25HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGdsb3dDb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRdWVzdGlvbkdsb3dWaWV3O1xuIiwiaW1wb3J0IHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBPcmdhbmlzbUdsb3dWaWV3IGZyb20gJy4vb3JnYW5pc20tZ2xvdyc7XG5pbXBvcnQgUXVlc3Rpb25HbG93VmlldyBmcm9tICcuL3F1ZXN0aW9uLWdsb3cnO1xuXG5jb25zdCBRdWVzdGlvbk9yZ2FuaXNtR2xvd1ZpZXcgPSAoe2hpZGRlbiwgY29sb3IsIHNpemUsIC4uLm90aGVyfSkgPT4ge1xuICBjb25zdCBvcmdWaWV3ID0gPE9yZ2FuaXNtR2xvd1ZpZXcgY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSB7Li4ub3RoZXJ9IC8+LFxuICAgICAgICBxdWVzdGlvblZpZXcgPSA8UXVlc3Rpb25HbG93VmlldyBnbG93Q29sb3I9e2NvbG9yfSB3aWR0aD17c2l6ZX0gLz4sXG4gICAgICAgIGZpbmFsVmlldyA9IGhpZGRlbiA/IHF1ZXN0aW9uVmlldyA6IG9yZ1ZpZXc7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgcXVlc3Rpb24tb3JnYW5pc20tZ2xvd1wiPlxuICAgICAge2ZpbmFsVmlld31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblF1ZXN0aW9uT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGhpZGRlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldztcbiIsImltcG9ydCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBicmVlZGluZyBzdGF0aXN0aWNzIGZvciBhIHNldCBvZiBCaW9sb2dpY2Egb3JnYW5pc21zXG4gKiBAcGFyYW0ge09iamVjdFtdfSBvcmdzIC0gYXJyYXkgb2YgQmlvbG9naWNhIG9yZ2FuaXNtcyBmb3Igd2hpY2ggc3RhdGlzdGljcyBhcmUgdG8gYmUgZGlzcGxheWVkXG4gKiBAcGFyYW0ge09iamVjdH0gb3Jnc1tdLnBoZW5vdHlwZSAtIHRoZSBwaGVub3R5cGUgb2YgdGhlIEJpb2xvZ2ljYSBvcmdhbmlzbVxuICogQHBhcmFtIHtudW1iZXJ9IFtsYXN0Q2x1dGNoU2l6ZT1vcmdzLmxlbmd0aF0gLSB0aGUgbnVtYmVyIG9mIG9yZ2FuaXNtcyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSB0aGF0IGNvbXByaXNlIHRoZSBtb3N0IHJlY2VudCBjbHV0Y2hcbiAqL1xuY29uc3QgU3RhdHNWaWV3ID0gKHtvcmdzLCBsYXN0Q2x1dGNoU2l6ZX0pID0+IHtcblxuICBsZXQgdHJhaXRzID0gR2VuZXRpY3NVdGlscy5jb21wdXRlVHJhaXRDb3VudHNGb3JPcmdhbmlzbXMob3JncywgbGFzdENsdXRjaFNpemUpLFxuICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ3MubGVuZ3RoLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuY2x1dGNoW0Jpb0xvZ2ljYS5NQUxFXSxcbiAgICAgICAgICAgIGNGZW1hbGVzID0gY291bnRzLmNsdXRjaFtCaW9Mb2dpY2EuRkVNQUxFXSxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoMTAwICogY1RvdGFsIC8gY2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLk1BTEVdLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLkZFTUFMRV0sXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10cmFpdC12YWx1ZT17cm93LnZhbHVlfT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiIsIi8qXG4gKiBTZWUgaHR0cHM6Ly9tZWRpdW0uY29tL0BrZW50Y2RvZGRzL21pc3VuZGVyc3RhbmRpbmctZXM2LW1vZHVsZXMtdXBncmFkaW5nLWJhYmVsLXRlYXJzLWFuZC1hLXNvbHV0aW9uLWFkMmQ1YWI5M2NlMCMucTF2Y2tmZml3XG4gKiAoS2VudCBDLiBEb2RkcywgXCJNaXN1bmRlcnN0YW5kaW5nIEVTNiBNb2R1bGVzLCBVcGdyYWRpbmcgQmFiZWwsIFRlYXJzLCBhbmQgYSBTb2x1dGlvblwiKVxuICogZm9yIGRlc2NyaXB0aW9uIG9mIHNvbWUgb2YgdGhlIGRldGFpbHMgaW52b2x2ZWQgaW4gbWl4aW5nIEVTNiBleHBvcnQgd2l0aCByZXF1aXJlKCkuXG4gKi9cblxuLy8gY29tcG9uZW50c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVGaWx0ZXJzVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbGxlbGUtZmlsdGVycyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFsbGVsZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQW5pbWF0ZWRHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLW9yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoYW5nZVNleEJ1dHRvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZUltYWdlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENpcmN1bGFyR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlZWRiYWNrVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZWVkYmFjayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVQb29sVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nYW1ldGUtcG9vbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VuZUxhYmVsVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVGVzdFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5vbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdsb3dCYWNrZ3JvdW5kVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb2RhbEFsZXJ0IH0gZnJvbSAnLi9jb21wb25lbnRzL21vZGFsLWFsZXJ0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL29yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9wZW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQZW5TdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuLXN0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdHMnO1xuXG4vLyB1dGlsaXRpZXNcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VuZXRpY3NVdGlscyB9IGZyb20gJy4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcbiIsIi8qKlxuICogQ2xhc3MgcHJvdmlkaW5nIHV0aWxpdHkgZnVuY3Rpb25zIGZvciBCaW9Mb2dpY2EgZ2VuZXRpY3Mgb3BlcmF0aW9ucy5cbiAqIEluIHNvbWUgY2FzZXMgdGhlc2UgYXJlIGFkYXB0ZWQgZnJvbSBjb3JyZXNwb25kaW5nIGNvZGUgaW4gR2VuaXZlcnNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5ldGljc1V0aWxzIHtcblxuICAvKipcbiAgICogRmlsdGVycyBvdXQgaGlkZGVuIGFsbGVsZXMgZnJvbSBhbiBvcmlnaW5hbCBsaXN0IG9mIGFsbGVsZXNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gYWxsZWxlcyAtIHRoZSBzZXQgb2YgYWxsZWxlcyB0byBiZSBmaWx0ZXJlZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBoaWRkZW5BbGxlbGVzIC0gdGhlIGFsbGVsZXMgaWRlbnRpZnlpbmcgdGhlIGhpZGRlbiBnZW5lc1xuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5zcGVjaWVzfSBzcGVjaWVzIC0gdGhlIHNwZWNpZXMgdGhhdCBkZWZpbmVzIHRoZSBnZW5vdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gLSB0aGUgZmlsdGVyZWQgYWxsZWxlc1xuICAgKi9cbiAgc3RhdGljIGZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgc3BlY2llcykge1xuICAgIGNvbnN0IGhpZGRlbkdlbmVzID0gaGlkZGVuQWxsZWxlcy5tYXAoYSA9PiBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpKTtcbiAgICByZXR1cm4gYWxsZWxlcy5maWx0ZXIoYSA9PiB7XG4gICAgICBjb25zdCBnZW5lID0gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShzcGVjaWVzLCBhKTtcbiAgICAgIHJldHVybiBoaWRkZW5HZW5lcy5pbmRleE9mKGdlbmUpID09PSAtMTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlIGEgbWFwIG9mIHRyYWl0cyAtPiB0cmFpdFZhbHVlcyAtPiB0cmFpdENvdW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc21bXX0gb3JnYW5pc21zIC0gdGhlIHNldCBvZiBvcmdhbmlzbXMgdG8gY29tcHV0ZSBzdGF0cyBmb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNsdXRjaFNpemUgLSB0aGUgbGFzdCAnY2x1dGNoU2l6ZScgb3JnYW5pc21zIGFyZSBhc3N1bWVkIHRvIGJlIHRoZSBsYXN0IGNsdXRjaFxuICAgKiBAcmV0dXJuIHtNYXB9IC0gZS5nLiB7IFwidGFpbFwiOiB7IFwibG9uZyB0YWlsXCI6IHsgXCJjbHV0Y2hcIjogWzksIDExXSwgXCJ0b3RhbFwiOiBbNTMsIDQ3XSB9fX1cbiAgICovXG4gIHN0YXRpYyBjb21wdXRlVHJhaXRDb3VudHNGb3JPcmdhbmlzbXMob3JnYW5pc21zLCBsYXN0Q2x1dGNoU2l6ZSkge1xuICAgIGxldCB0cmFpdHMgPSBuZXcgTWFwLFxuICAgICAgICBjbHV0Y2hTaXplID0gbGFzdENsdXRjaFNpemUgfHwgb3JnYW5pc21zLmxlbmd0aDtcblxuICAgIC8vIGFjY3VtdWxhdGUgc3RhdHMgZm9yIGVhY2ggdHJhaXQvdmFsdWUgY29tYmluYXRpb25cbiAgICBmb3IgKGNvbnN0IFtpbmRleCwgb3JnXSBvZiBvcmdhbmlzbXMuZW50cmllcygpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRyYWl0IG9mIE9iamVjdC5rZXlzKG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzKSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBvcmcucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljc1t0cmFpdF0sXG4gICAgICAgICAgICB0cmFpdFZhbHVlcyA9IHRyYWl0cy5nZXQodHJhaXQpIHx8IG5ldyBNYXAsXG4gICAgICAgICAgICB2YWx1ZUNvdW50cyA9IHRyYWl0VmFsdWVzLmdldCh2YWx1ZSkgfHwgeyBjbHV0Y2g6IFswLCAwXSwgdG90YWw6IFswLCAwXSB9O1xuICAgICAgICBpZiAoIXRyYWl0cy5oYXModHJhaXQpKSB0cmFpdHMuc2V0KHRyYWl0LCB0cmFpdFZhbHVlcyk7XG4gICAgICAgIGlmICghdHJhaXRWYWx1ZXMuaGFzKHZhbHVlKSkgdHJhaXRWYWx1ZXMuc2V0KHZhbHVlLCB2YWx1ZUNvdW50cyk7XG4gICAgICAgIC8vIG1vc3QgcmVjZW50IGNsdXRjaCBhc3N1bWVkIHRvIGJlIGF0IGVuZCBvZiBvcmdhbmlzbXMgYXJyYXlcbiAgICAgICAgaWYgKGluZGV4ID49IG9yZ2FuaXNtcy5sZW5ndGggLSBjbHV0Y2hTaXplKVxuICAgICAgICAgICsrIHZhbHVlQ291bnRzLmNsdXRjaFtvcmcuc2V4XTtcbiAgICAgICAgKysgdmFsdWVDb3VudHMudG90YWxbb3JnLnNleF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cmFpdHM7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYW4gYWxsZWxlIHN0cmluZyB0byBhIEphdmFTY3JpcHQgb2JqZWN0IHRoYXQgbWFwcyBnZW5lcyB0byBhbGxlbGVzLlxuICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgZm9yIGNvbXBhcmlzb24gcHVycG9zZXMsIGZvciBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcmV0dXJuIHtvYmplY3R9IC0gZ2VuZSBtYXAgb2YgZm9ybSB7IGhvcm5zOiB7YTpcImhcIiwgYjpcImhcIn0sIGFybW9yOiB7YTpcImFcIiwgYjpcImFcIn0sIC4uLn1cbiAgICovXG4gIHN0YXRpYyBidWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcpIHtcbiAgICBsZXQgZ2VuZU1hcCA9IHt9LFxuICAgICAgICBhbGxlbGVTdWJzdHJpbmdzID0gYWxsZWxlU3RyaW5nLnNwbGl0KFwiLFwiKTtcbiAgICBmb3IgKGNvbnN0IGFsbGVsZVN1YnN0ciBvZiBhbGxlbGVTdWJzdHJpbmdzKSB7XG4gICAgICBjb25zdCBbc2lkZSwgYWxsZWxlXSA9IGFsbGVsZVN1YnN0ci5zcGxpdChcIjpcIiksXG4gICAgICAgICAgICBnZW5lID0gZ2VuZXRpY3MuZ2VuZUZvckFsbGVsZShhbGxlbGUpO1xuICAgICAgaWYgKHNpZGUgJiYgYWxsZWxlICYmIGdlbmUpIHtcbiAgICAgICAgaWYgKCFnZW5lTWFwW2dlbmVdKSBnZW5lTWFwW2dlbmVdID0ge307XG4gICAgICAgIGdlbmVNYXBbZ2VuZV1bc2lkZV0gPSBhbGxlbGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnZW5lTWFwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIGFuIGFsbGVsZSBzdHJpbmcgYW5kIGEgZ2VuZSBtYXAgZGVmaW5pbmcgYSBzZXQgb2YgYmFzZSAoZGVmYXVsdCkgYWxsZWxlcyxcbiAgICogcmV0dXJucyBhIG5ldyBhbGxlbGUgc3RyaW5nIHdpdGggbWlzc2luZyBhbGxlbGVzIHJlcGxhY2VkIGJ5IHRoZWlyIGRlZmF1bHRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBiYXNlR2VuZU1hcCAtIGdlbmUgbWFwIG9mIGZvcm0geyBob3JuOiB7YTpcImhcIiwgYjpcImhcIn0sIGFybW9yOiB7YTpcImFcIiwgYjpcImFcIn0sIC4uLn1cbiAgICogQHJldHVybiB7c3RyaW5nfSAtIHVwZGF0ZWQgYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCJcbiAgICovXG4gIHN0YXRpYyBmaWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21HZW5lTWFwKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VHZW5lTWFwKSB7XG4gICAgY29uc3QgZHN0R2VuZU1hcCA9IEdlbmV0aWNzVXRpbHMuYnVpbGRHZW5lTWFwRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nKTtcbiAgICBsZXQgICBkc3RBbGxlbGVTdHJpbmcgPSBhbGxlbGVTdHJpbmc7XG4gICAgZm9yIChjb25zdCBnZW5lIGluIGRzdEdlbmVNYXApIHtcbiAgICAgIGNvbnN0IGdlbmVWYWx1ZSA9IGRzdEdlbmVNYXBbZ2VuZV07XG4gICAgICAvLyByZXBsYWNlIGEgbWlzc2luZyAnYScgc2lkZSBhbGxlbGUgd2l0aCB0aGUgZGVmYXVsdCBpZiBhcHByb3ByaWF0ZVxuICAgICAgaWYgKCFnZW5lVmFsdWUuYSAmJiBiYXNlR2VuZU1hcFtnZW5lXSAmJiBiYXNlR2VuZU1hcFtnZW5lXS5hKSB7XG4gICAgICAgIGRzdEFsbGVsZVN0cmluZyA9IGRzdEFsbGVsZVN0cmluZy5yZXBsYWNlKGBiOiR7Z2VuZVZhbHVlLmJ9YCwgYGE6JHtiYXNlR2VuZU1hcFtnZW5lXS5hfSwkJmApO1xuICAgICAgfVxuICAgICAgLy8gcmVwbGFjZSBhIG1pc3NpbmcgJ2InIHNpZGUgYWxsZWxlIHdpdGggdGhlIGRlZmF1bHQgaWYgYXBwcm9wcmlhdGVcbiAgICAgIGlmICghZ2VuZVZhbHVlLmIgJiYgYmFzZUdlbmVNYXBbZ2VuZV0gJiYgYmFzZUdlbmVNYXBbZ2VuZV0uYikge1xuICAgICAgICBkc3RBbGxlbGVTdHJpbmcgPSBkc3RBbGxlbGVTdHJpbmcucmVwbGFjZShgYToke2dlbmVWYWx1ZS5hfWAsIGAkJixiOiR7YmFzZUdlbmVNYXBbZ2VuZV0uYn1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRzdEFsbGVsZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0d28gYWxsZWxlIHN0cmluZ3MsIHJldHVybnMgYSBuZXcgYWxsZWxlIHN0cmluZyBpbiB3aGljaCBtaXNzaW5nIGFsbGVsZXNcbiAgICogaW4gdGhlIGZpcnN0IGFyZSByZXBsYWNlZCBieSBkZWZhdWx0cyBwcm92aWRlZCBieSB0aGUgc2Vjb25kIGFsbGVsZSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2VBbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byB1c2UgYXMgZGVmYXVsdHNcbiAgICogQHJldHVybiB7c3RyaW5nfSAtIHVwZGF0ZWQgYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCJcbiAgICovXG4gIHN0YXRpYyBmaWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUFsbGVsZVN0cmluZykge1xuICAgIGNvbnN0IGJhc2VHZW5lTWFwID0gR2VuZXRpY3NVdGlscy5idWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBiYXNlQWxsZWxlU3RyaW5nKTtcbiAgICByZXR1cm4gR2VuZXRpY3NVdGlscy5maWxsSW5NaXNzaW5nQWxsZWxlc0Zyb21HZW5lTWFwKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcsIGJhc2VHZW5lTWFwKTtcbiAgfVxuXG4gIHN0YXRpYyBudW1iZXJPZkJyZWVkaW5nTW92ZXNUb1JlYWNoRHJha2Uob3JnYW5pc20xLCBvcmdhbmlzbTIsIGNoYW5nZWFibGVBbGxlbGVzMSwgY2hhbmdlYWJsZUFsbGVsZXMyLCB0YXJnZXRPcmdhbmlzbSkge1xuICAgIHZhciBtb3ZlcyA9IDAsXG4gICAgICAgIG9yZzFBbGxlbGVzID0gb3JnYW5pc20xLmdldEFsbGVsZVN0cmluZygpLnNwbGl0KCcsJykubWFwKGEgPT4gYS5zcGxpdCgnOicpWzFdKSxcbiAgICAgICAgb3JnMkFsbGVsZXMgPSBvcmdhbmlzbTIuZ2V0QWxsZWxlU3RyaW5nKCkuc3BsaXQoJywnKS5tYXAoYSA9PiBhLnNwbGl0KCc6JylbMV0pLFxuICAgICAgICB0YXJnZXRjaGFycyA9IHRhcmdldE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgIHRyYWl0UnVsZXMgPSBvcmdhbmlzbTEuc3BlY2llcy50cmFpdFJ1bGVzO1xuXG4gICAgZm9yICh2YXIgdHJhaXQgaW4gdHJhaXRSdWxlcykge1xuICAgICAgaWYgKHRyYWl0UnVsZXMuaGFzT3duUHJvcGVydHkodHJhaXQpKSB7XG4gICAgICAgIHZhciBwb3NzaWJsZVNvbHV0aW9ucyA9IHRyYWl0UnVsZXNbdHJhaXRdW3RhcmdldGNoYXJzW3RyYWl0XV0sXG4gICAgICAgICAgICBzaG9ydGVzdFBhdGggPSBJbmZpbml0eTtcbiAgICAgICAgaWYgKHBvc3NpYmxlU29sdXRpb25zICYmIHBvc3NpYmxlU29sdXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHBvc3NpYmxlU29sdXRpb25zLmxlbmd0aDsgaTxpaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc29sdXRpb24gPSBwb3NzaWJsZVNvbHV0aW9uc1tpXSxcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMSA9IDAsXG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjIgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpqID0gc29sdXRpb24ubGVuZ3RoOyBqPGpqOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIGFsbGVsZTEgPSBzb2x1dGlvbltqXSxcbiAgICAgICAgICAgICAgICAgIGFsbGVsZTIgPSBqJTIgPT09IDAgPyBzb2x1dGlvbltqKzFdIDogc29sdXRpb25bai0xXSxcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSAwO1xuICAgICAgICAgICAgICBpZiAob3JnMUFsbGVsZXMuaW5kZXhPZihhbGxlbGUxKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsZWxlMSAmJiAoY2hhbmdlYWJsZUFsbGVsZXMxLmluZGV4T2YoYWxsZWxlMSkgPiAtMSB8fFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VhYmxlQWxsZWxlczEuaW5kZXhPZihhbGxlbGUxLnRvTG93ZXJDYXNlKCkpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMgPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAob3JnMkFsbGVsZXMuaW5kZXhPZihhbGxlbGUyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsZWxlMiAmJiAoY2hhbmdlYWJsZUFsbGVsZXMyLmluZGV4T2YoYWxsZWxlMikgPiAtMSB8fFxuICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWFibGVBbGxlbGVzMi5pbmRleE9mKGFsbGVsZTIudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChqJTIgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMSArPSBzb2x1dGlvbk1vdmVzO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24yICs9IHNvbHV0aW9uTW92ZXM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IE1hdGgubWluKHNob3J0ZXN0UGF0aCwgTWF0aC5taW4obW92ZXNGb3JTb2x1dGlvbjEsIG1vdmVzRm9yU29sdXRpb24yKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vdmVzICs9IHNob3J0ZXN0UGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb3ZlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc2VwYXJhdGUgY2hhbmdlcywgaW5jbHVkaW5nIGFsbGVsZSBjaGFuZ2VzIGFuZCBzZXggY2hhbmdlcyxcbiAgICogcmVxdWlyZWQgdG8gbWF0Y2ggdGhlIHBoZW5vdHlwZSBvZiB0aGUgJ3Rlc3RPcmdhbmlzbScgdG8gdGhhdCBvZiB0aGUgJ3RhcmdldE9yZ2FuaXNtJy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IHRlc3RPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0byB3aGljaCBjaGFuZ2VzIHdvdWxkIGFwcGx5XG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLk9yZ2FuaXNtfSB0YXJnZXRPcmdhbmlzbSAtIHRoZSBvcmdhbmlzbSB0aGF0IHNlcnZlcyBhcyBkZXN0aW5hdGlvblxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gdGhlIHRvdGFsIG51bWJlciBvZiBjaGFuZ2VzIHJlcXVpcmVkIGZvciB0aGUgcGhlbm90eXBlcyB0byBtYXRjaFxuICAgKi9cbiAgc3RhdGljIG51bWJlck9mQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUodGVzdE9yZ2FuaXNtLCB0YXJnZXRPcmdhbmlzbSkge1xuICAgIGxldCByZXF1aXJlZENoYW5nZUNvdW50ID0gR2VuZXRpY3NVdGlscy5udW1iZXJPZkFsbGVsZUNoYW5nZXNUb1JlYWNoUGhlbm90eXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RPcmdhbmlzbS5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLmdlbmV0aWNzLmdlbm90eXBlLmFsbEFsbGVsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLnNwZWNpZXMudHJhaXRSdWxlcyk7XG4gICAgaWYgKHRlc3RPcmdhbmlzbS5zZXggIT09IHRhcmdldE9yZ2FuaXNtLnNleClcbiAgICAgICsrcmVxdWlyZWRDaGFuZ2VDb3VudDtcblxuICAgIHJldHVybiByZXF1aXJlZENoYW5nZUNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZXBhcmF0ZSBhbGxlbGUgY2hhbmdlcyByZXF1aXJlZCB0byBtYWtlIHRoZSBwaGVub3R5cGUgb2ZcbiAgICogdGhlIG9yZ2FuaXNtIGNoYXJhY3Rlcml6ZWQgYnkgJ3Rlc3RDaGFyYWN0ZXJzdGljcycgbWF0Y2ggdGhhdCBvZiB0aGUgb3JnYW5pc21cbiAgICogY2hhcmFjdGVyaXplZCBieSAndGFyZ2V0Q2hhcmFjdGVyaXN0aWNzJy4gQWRhcHRlZCBmcm9tOlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jb25jb3JkLWNvbnNvcnRpdW0vR2VuaXZlcnNlLVNwcm91dENvcmUvYmxvYi9tYXN0ZXIvZnJhbWV3b3Jrcy9nZW5pdmVyc2UvY29udHJvbGxlcnMvbWF0Y2guanNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHRlc3RDaGFyYWN0ZXJpc3RpY3MgLSB0aGUgY2hhcmFjdGVyaXN0aWNzIG9mIHRoZSB0ZXN0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRDaGFyYWN0ZXJpc3RpY3MgLSB0aGUgY2hhcmFjdGVyaXN0aWNzIG9mIHRoZSB0YXJnZXQgb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdGVzdEFsbGVsZXMgLSB0aGUgYXJyYXkgb2YgYWxsZWxlcyBvZiB0aGUgdGVzdCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge29iamVjdH0gdHJhaXRSdWxlcyAtIHRoZSB0cmFpdFJ1bGVzIG9mIHRoZSBCaW9Mb2dpY2EuU3BlY2llcyBvZiB0aGUgb3JnYW5pc21zXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSB0aGUgbnVtYmVyIG9mIGFsbGVsZSBjaGFuZ2VzIHJlcXVpcmVkIGZvciB0aGUgcGhlbm90eXBlcyB0byBtYXRjaFxuICAgKi9cbiAgc3RhdGljIG51bWJlck9mQWxsZWxlQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUodGVzdENoYXJhY3RlcmlzdGljcywgdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzLCB0ZXN0QWxsZWxlcywgdHJhaXRSdWxlcykge1xuICAgIGNvbnN0IGFsbGVsZXMgPSB0ZXN0QWxsZWxlcztcbiAgICBsZXQgICBtb3ZlcyA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IHRyYWl0IGluIHRyYWl0UnVsZXMpIHtcbiAgICAgIGlmICh0cmFpdFJ1bGVzLmhhc093blByb3BlcnR5KHRyYWl0KSkge1xuICAgICAgICBpZiAodGVzdENoYXJhY3RlcmlzdGljc1t0cmFpdF0gIT09IHRhcmdldENoYXJhY3RlcmlzdGljc1t0cmFpdF0pIHtcbiAgICAgICAgICAvLyBmaXJzdCB3ZSBoYXZlIHRvIHdvcmsgb3V0IHdoYXQgYWxsZWxlcyB0aGUgb3JpZ2luYWwgZHJha2UgaGFzIHRoYXQgY29ycmVzcG9uZCB0b1xuICAgICAgICAgIC8vIHRoZWlyIG5vbi1tYXRjaGluZyB0cmFpdFxuICAgICAgICAgIGNvbnN0IHBvc3NpYmxlVHJhaXRBbGxlbGVzID0gR2VuZXRpY3NVdGlscy5jb2xsZWN0QWxsQWxsZWxlc0ZvclRyYWl0KHRyYWl0LCB0cmFpdFJ1bGVzKTtcbiAgICAgICAgICBsZXQgICBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMgPSBbXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhbGxlbGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZVRyYWl0QWxsZWxlcy5pbmRleE9mKGFsbGVsZXNbaV0pID49IDApe1xuICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMucHVzaChhbGxlbGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbm93IHdvcmsgb3V0IHRoZSBzbWFsbGVzdCBudW1iZXIgb2Ygc3RlcHMgdG8gZ2V0IGZyb20gdGhlcmUgdG8gdGhlIGRlc2lyZWQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgICBjb25zdCBwb3NzaWJsZVNvbHV0aW9ucyA9IHRyYWl0UnVsZXNbdHJhaXRdW3RhcmdldENoYXJhY3RlcmlzdGljc1t0cmFpdF1dO1xuICAgICAgICAgIGxldCAgIHNob3J0ZXN0UGF0aExlbmd0aCA9IEluZmluaXR5O1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHBvc3NpYmxlU29sdXRpb25zLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzb2x1dGlvbiA9IHBvc3NpYmxlU29sdXRpb25zW2ldLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgcGF0aExlbmd0aCA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSBjaGFyYWN0ZXJpc3RpY0FsbGVsZXMubGVuZ3RoOyBqIDwgamo7IGorKyl7XG4gICAgICAgICAgICAgIGlmIChzb2x1dGlvbi5pbmRleE9mKGNoYXJhY3RlcmlzdGljQWxsZWxlc1tqXSkgPT09IC0xKXtcbiAgICAgICAgICAgICAgICBwYXRoTGVuZ3RoKys7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc29sdXRpb24uc3BsaWNlKHNvbHV0aW9uLmluZGV4T2YoY2hhcmFjdGVyaXN0aWNBbGxlbGVzW2pdKSwgMSk7IC8vIGFscmVhZHkgbWF0Y2hlZCB0aGlzIG9uZSwgY2FuJ3QgbWF0Y2ggaXQgYWdhaW5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoTGVuZ3RoID0gKHBhdGhMZW5ndGggPCBzaG9ydGVzdFBhdGhMZW5ndGgpID8gcGF0aExlbmd0aCA6IHNob3J0ZXN0UGF0aExlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZXMgKz0gc2hvcnRlc3RQYXRoTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb3ZlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHb2VzIHRocm91Z2ggdGhlIHRyYWl0UnVsZXMgdG8gZmluZCBvdXQgd2hhdCB1bmlxdWUgYWxsZWxlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGVhY2ggdHJhaXRcbiAgICogZS5nLiBGb3IgXCJ0YWlsXCIgaXQgd2lsbCByZXR1cm4gW1wiVFwiLCBcIlRrXCIsIFwidFwiXS4gQWRhcHRlZCBmcm9tOlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jb25jb3JkLWNvbnNvcnRpdW0vR2VuaXZlcnNlLVNwcm91dENvcmUvYmxvYi9tYXN0ZXIvZnJhbWV3b3Jrcy9nZW5pdmVyc2UvY29udHJvbGxlcnMvbWF0Y2guanNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYWl0IC0gbmFtZSBvZiB0cmFpdCwgZS5nLiBcInRhaWxcIlxuICAgKiBAcGFyYW0ge29iamVjdH0gdHJhaXRSdWxlcyAtIHRoZSB0cmFpdFJ1bGVzIG9mIHRoZSBCaW9Mb2dpY2EuU3BlY2llcyB3aG9zZSB0cmFpdHMgYXJlIG9mIGludGVyZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ1tdfSAtIGFycmF5IG9mIGFsbGVsZSBzdHJpbmdzLCBlLmcuIFtcIlRcIiwgXCJUa1wiLCBcInRcIl1cbiAgICovXG4gIHN0YXRpYyBfcG9zc2libGVBbGxlbGVzRm9yVHJhaXQgPSB7fTtcbiAgc3RhdGljIGNvbGxlY3RBbGxBbGxlbGVzRm9yVHJhaXQodHJhaXQsIHRyYWl0UnVsZXMpIHtcbiAgICBpZiAoR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdKSB7XG4gICAgICByZXR1cm4gR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdO1xuICAgIH1cblxuICAgIGxldCBhbGxlbGVzSGFzaCA9IHt9LFxuICAgICAgICBhbGxlbGVzICAgICA9IFtdO1xuICAgIGZvciAoY29uc3QgY2hhcmFjdGVyaXN0aWMgaW4gdHJhaXRSdWxlc1t0cmFpdF0pe1xuICAgICAgICBmb3IgKGNvbnN0IHBvc3NpYmlsZUFsbGVsZXNDb21ibyBpbiB0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY10pIHtcbiAgICAgICAgICBpZiAodHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdLmhhc093blByb3BlcnR5KHBvc3NpYmlsZUFsbGVsZXNDb21ibykpe1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdHJhaXRSdWxlc1t0cmFpdF1bY2hhcmFjdGVyaXN0aWNdW3Bvc3NpYmlsZUFsbGVsZXNDb21ib10ubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICBhbGxlbGVzSGFzaFt0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY11bcG9zc2liaWxlQWxsZWxlc0NvbWJvXVtpXV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgYWxsZWxlIGluIGFsbGVsZXNIYXNoKXtcbiAgICAgIGFsbGVsZXMucHVzaChhbGxlbGUpO1xuICAgIH1cblxuICAgIEdlbmV0aWNzVXRpbHMuX3Bvc3NpYmxlQWxsZWxlc0ZvclRyYWl0W3RyYWl0XSA9IGFsbGVsZXM7ICAvLyBzdG9yZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHJlY2FsY3VsYXRlIGl0XG4gICAgcmV0dXJuIGFsbGVsZXM7XG4gIH1cbn1cbiJdfQ==
