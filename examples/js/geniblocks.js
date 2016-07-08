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

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _chromosomeImage = require('./chromosome-image');

var _chromosomeImage2 = _interopRequireDefault(_chromosomeImage);

var _allele = require('./allele');

var _allele2 = _interopRequireDefault(_allele);

var _geneticsUtils = require('../utilities/genetics-utils');

var _geneticsUtils2 = _interopRequireDefault(_geneticsUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnimatedChromosomeView = function AnimatedChromosomeView(_ref) {
  var org = _ref.org;
  var chromosomeName = _ref.chromosomeName;
  var side = _ref.side;
  var _ref$hiddenAlleles = _ref.hiddenAlleles;
  var hiddenAlleles = _ref$hiddenAlleles === undefined ? [] : _ref$hiddenAlleles;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;
  var onRest = _ref.onRest;
  var selected = _ref.selected;
  var small = _ref.small;
  var startPositionId = _ref.startPositionId;
  var targetPositionId = _ref.targetPositionId;

  if (!selected) return null;
  var allelesContainer = {},
      empty = false;
  if (org && chromosomeName && side) {

    var alleles = org.getGenotype().chromosomes[chromosomeName][side].alleles,
        visibleAlleles = _geneticsUtils2.default.filterAlleles(alleles, hiddenAlleles, org.species);
    var alleleSymbols = visibleAlleles.map(function (a) {
      return _react2.default.createElement(_allele2.default, { key: a, allele: a });
    });

    allelesContainer = _react2.default.createElement(
      'div',
      { className: 'alleles' },
      alleleSymbols
    );
  } else {
    empty = true;
  }

  var sourceRects = {},
      targetRects = {};

  var source = document.getElementById(startPositionId);
  if (!source) source = document.getElementById("target" + targetPositionId + chromosomeName);

  if (source) {
    sourceRects = source.getClientRects()[0];
  } else {
    console.log("no rects!", source, startPositionId);
    return null;
  }

  var target = document.getElementById("target" + targetPositionId);
  if (!target) target = document.getElementById("target" + targetPositionId + chromosomeName);

  if (target) {
    targetRects = target.getClientRects()[0];
  } else {
    console.log("no rects!", target, "target" + targetPositionId);
    return null;
  }

  var startStyle = {},
      endStyle = {};
  startStyle.x = sourceRects.left;
  startStyle.y = sourceRects.top;
  startStyle.opacity = 1;

  endStyle.x = targetRects.left;
  endStyle.y = sourceRects.top; // can't yet get to the exact chromosome target
  endStyle.opacity = 0;

  var springConfig = { stiffness: 100, damping: 30 };

  var onAnimationFinished = function onAnimationFinished() {
    onRest();
  };

  return _react2.default.createElement(
    _reactMotion.Motion,
    { className: 'geniblocks animated-chromosome-view',
      defaultStyle: {
        x: startStyle.x, y: startStyle.y,
        opacity: startStyle.opacity
      },
      style: {
        x: (0, _reactMotion.spring)(endStyle.x, springConfig),
        y: (0, _reactMotion.spring)(endStyle.y, springConfig),
        opacity: (0, _reactMotion.spring)(endStyle.opacity, springConfig)
      },
      onRest: onAnimationFinished },
    function (interpolatedStyle) {
      return _react2.default.createElement(_chromosomeImage2.default, { empty: empty, small: small, className: 'animated-chromosome-allele-container', display: interpolatedStyle });
    }
  );
};

AnimatedChromosomeView.propTypes = {
  org: _react.PropTypes.object,
  id: _react.PropTypes.string,
  width: _react.PropTypes.number,
  style: _react.PropTypes.object,
  stiffness: _react.PropTypes.number,
  onRest: _react.PropTypes.func,
  selected: _react.PropTypes.bool,
  chromosomeName: _react.PropTypes.string,
  side: _react.PropTypes.string,
  startPositionId: _react.PropTypes.string,
  targetPositionId: _react.PropTypes.string,
  hiddenAlleles: _react.PropTypes.array
};

exports.default = AnimatedChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":78,"./allele":51,"./chromosome-image":58,"react-motion":30}],53:[function(require,module,exports){
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

},{"./gamete":64,"react-motion":30}],54:[function(require,module,exports){
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

},{"./organism":71,"react-motion":30}],55:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

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

      return _react2.default.createElement(
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
}(_react2.default.Component);

Button.propTypes = {
  className: _react.PropTypes.string,
  label: _react.PropTypes.string.isRequired
};
exports.default = Button;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],56:[function(require,module,exports){
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
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, ChallengeAwardView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ChallengeAwardView)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.addAwardImage = function (progressImages, pieces, pieceNum, score, pieceStyle) {
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
            var currentScore = challengeScore[i];
            if (!currentScore) {
              challengeScore[i] = score;
            } else {
              currentScore = currentScore + score;
              challengeScore[i] = score;
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
          { className: 'geniblocks animated-organism-view',
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
  var display = _ref.display;

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

  var strokeWidth = 2;

  if (bold) {
    color = '#FF6666';
    strokeWidth = 3;
  }
  if (empty) {
    color = '#FFF';
    strokeWidth = 1;
  }
  var positionStyling = {};
  if (display) {
    positionStyling = {
      position: 'fixed', left: display.x, top: display.y, opacity: display.opacity
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
  color: _react.PropTypes.string,
  empty: _react.PropTypes.bool
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

var _animatedChromosome = require('./animated-chromosome');

var _animatedChromosome2 = _interopRequireDefault(_animatedChromosome);

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
  var handleSelect = function handleSelect() {
    if (onChromosomeSelected) {
      onChromosomeSelected();
    }
  };
  var animatedChromosome = void 0;
  var onRest = function onRest() {
    console.log("on rest");
  };

  animatedChromosome = _react2.default.createElement(_animatedChromosome2.default, { org: org, id: chromosomeName, hiddenAlleles: hiddenAlleles,
    onRest: onRest, selected: selected, small: small, startPositionId: chromId, targetPositionId: orgName });

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks chromosome-container', onClick: handleSelect },
    _react2.default.createElement(
      'div',
      { className: containerClass },
      _react2.default.createElement(
        'div',
        { className: 'chromosome-allele-container', id: chromId },
        _react2.default.createElement(_chromosomeImage2.default, { small: small, empty: empty, bold: selected, yChromosome: yChromosome }),
        allelesContainer
      ),
      labelsContainer,
      animatedChromosome
    )
  );
};

ChromosomeView.propTypes = {
  org: _react.PropTypes.object,
  chromosomeName: _react.PropTypes.string,
  side: _react.PropTypes.string,
  chromosome: _react.PropTypes.object,
  hiddenAlleles: _react.PropTypes.array,
  editable: _react.PropTypes.bool,
  showLabels: _react.PropTypes.bool,
  showAlleles: _react.PropTypes.bool,
  labelsOnRight: _react.PropTypes.bool,
  onAlleleChange: _react.PropTypes.func,
  onChromosomeSelected: _react.PropTypes.func
};

exports.default = ChromosomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../utilities/genetics-utils":78,"./allele":51,"./animated-chromosome":52,"./chromosome-image":58,"./gene-label":65}],60:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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

},{"./animated-gamete":53}],63:[function(require,module,exports){
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

},{"./animated-gamete":53}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _allele = require('./allele');

var _allele2 = _interopRequireDefault(_allele);

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
      'div',
      { className: 'geniblocks gene-label allele noneditable' },
      _react2.default.createElement(
        'span',
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
          'option',
          { key: name, value: alleles[i] },
          name
        );
      });
      return {
        v: _react2.default.createElement(
          'div',
          { className: 'geniblocks gene-label allele editable' },
          _react2.default.createElement(
            'select',
            { value: allele, onChange: onAlleleChange },
            alleleOptions
          )
        )
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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

},{"./allele":51}],66:[function(require,module,exports){
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

},{"../utilities/genetics-utils":78,"./chromosome-image":58}],67:[function(require,module,exports){
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
          onAlleleChange: function onAlleleChange(prevAllele, newAllele) {
            _onAlleleChange(chromosomeName, side, prevAllele, newAllele);
          },
          onChromosomeSelected: function onChromosomeSelected() {
            if (_onChromosomeSelected) _onChromosomeSelected(org, chromosomeName, side);
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

  return _react2.default.createElement(
    'div',
    { className: 'geniblocks genome' },
    pairWrappers
  );
};

GenomeView.propTypes = {
  org: _react.PropTypes.object,
  chromosomes: _react.PropTypes.object,
  species: _react.PropTypes.object,
  hiddenAlleles: _react.PropTypes.array,
  onAlleleChange: _react.PropTypes.func.isRequired,
  editable: _react.PropTypes.bool,
  onChromosomeSelected: _react.PropTypes.func,
  orgName: _react.PropTypes.string
};

exports.default = GenomeView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./chromosome":59}],68:[function(require,module,exports){
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

},{"./circular-glow":60}],69:[function(require,module,exports){
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

  // we use some psuedo random coords so nested modals
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

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ModalAlert).apply(this, arguments));
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
      var awardView;

      if (this.props.challengeAwards) {
        awardView = _react2.default.createElement(_challengeAward2.default, { challengeAwards: this.props.challengeAwards });
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
            this.props.message
          ),
          awardView,
          _react2.default.createElement(
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
}(_react2.default.Component);

ModalAlert.propTypes = {
  show: _react.PropTypes.bool,
  message: _react.PropTypes.string,
  explanation: _react.PropTypes.string,
  leftButton: _react.PropTypes.shape({
    label: _react.PropTypes.string,
    onClick: _react.PropTypes.func
  }),
  rightButton: _react.PropTypes.shape({
    label: _react.PropTypes.string,
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

},{"./button":55,"./challenge-award":56,"react-overlays/lib/Modal":36}],70:[function(require,module,exports){
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
  var id = _ref.id;
  var className = _ref.className;
  var _ref$color = _ref.color;
  var color = _ref$color === undefined ? "#FFFFAA" : _ref$color;
  var _ref$size = _ref.size;
  var size = _ref$size === undefined ? 200 : _ref$size;
  var _ref$style = _ref.style;
  var style = _ref$style === undefined ? {} : _ref$style;

  var other = _objectWithoutProperties(_ref, ['id', 'className', 'color', 'size', 'style']);

  var containerStyle = { position: 'relative', width: size, height: size },
      glowStyle = { position: 'absolute' },
      orgStyle = _extends({ position: 'absolute' }, style);

  return _react2.default.createElement(
    'div',
    { id: id, className: 'geniblocks organism-glow ' + className, style: containerStyle },
    _react2.default.createElement(_circularGlow2.default, { id: id + '-glow', color: color, size: size, style: glowStyle }),
    _react2.default.createElement(_organism2.default, _extends({ id: id + '-organism', width: size, style: orgStyle }, other))
  );
};

OrganismGlowView.propTypes = {
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  color: _react.PropTypes.string,
  size: _react.PropTypes.number,
  style: _react.PropTypes.object
};

exports.default = OrganismGlowView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./circular-glow":60,"./organism":71}],71:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrganismView = function OrganismView(_ref) {
  var org = _ref.org;
  var id = _ref.id;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 200 : _ref$width;
  var _ref$flipped = _ref.flipped;
  var flipped = _ref$flipped === undefined ? false : _ref$flipped;
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

  var className = "geniblocks organism";
  if (flipped) {
    className += " flipped";
  }

  function handleClick() {
    if (onClick) onClick(id, org);
  }

  return divWrapper(_react2.default.createElement(
    'div',
    { className: className, id: id, style: style,
      onMouseDown: handleMouseDown, onClick: handleClick },
    _react2.default.createElement('img', { src: url, width: width })
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

},{}],72:[function(require,module,exports){
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

},{"./pen":73,"./stats":76,"react-simpletabs":48}],73:[function(require,module,exports){
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

},{"./organism":71}],74:[function(require,module,exports){
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

},{"./circular-glow":60}],75:[function(require,module,exports){
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

},{"./organism-glow":70,"./question-glow":74}],76:[function(require,module,exports){
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

},{"../utilities/genetics-utils":78}],77:[function(require,module,exports){
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

},{"./components/allele":51,"./components/allele-filters":50,"./components/animated-gamete":53,"./components/animated-organism":54,"./components/button":55,"./components/challenge-award":56,"./components/change-sex-buttons":57,"./components/chromosome":59,"./components/chromosome-image":58,"./components/circular-glow":60,"./components/feedback":61,"./components/fertilizing-gamete":62,"./components/gamete":64,"./components/gamete-pool":63,"./components/gene-label":65,"./components/genome":67,"./components/genome-test":66,"./components/glow-background":68,"./components/modal-alert":69,"./components/organism":71,"./components/organism-glow":70,"./components/pen":73,"./components/pen-stats":72,"./components/question-glow":74,"./components/question-organism-glow":75,"./components/stats":76,"./utilities/genetics-utils":78}],78:[function(require,module,exports){
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

},{}]},{},[77])(77)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvYWN0aXZlRWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9hZGRDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9oYXNDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9jbGFzcy9yZW1vdmVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9ldmVudHMvb2ZmLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL2V2ZW50cy9vbi5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy9vd25lckRvY3VtZW50LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2NvbnRhaW5zLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3F1ZXJ5L2lzV2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3N0eWxlL2dldENvbXB1dGVkU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvc3R5bGUvcmVtb3ZlU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9iYWJlbEhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9jYW1lbGl6ZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2NhbWVsaXplU3R5bGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGUuanMiLCJub2RlX21vZHVsZXMvZG9tLWhlbHBlcnMvdXRpbC9oeXBoZW5hdGVTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb20taGVscGVycy91dGlsL2luRE9NLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1oZWxwZXJzL3V0aWwvc2Nyb2xsYmFyU2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmFmL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvU3RhZ2dlcmVkTW90aW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvVHJhbnNpdGlvbk1vdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21hcFRvWmVyby5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL21lcmdlRGlmZi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3ByZXNldHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZWFjdC1tb3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9yZW9yZGVyS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1tb3Rpb24vbGliL3Nob3VsZFN0b3BBbmltYXRpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zcHJpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtbW90aW9uL2xpYi9zdGVwcGVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW1vdGlvbi9saWIvc3RyaXBTdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvTW9kYWwuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsTWFuYWdlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1vdmVybGF5cy9saWIvUG9ydGFsLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRFdmVudExpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9hZGRGb2N1c0xpc3RlbmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LW92ZXJsYXlzL2xpYi91dGlscy9nZXRDb250YWluZXIuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL2lzT3ZlcmZsb3dpbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL21hbmFnZUFyaWFIaWRkZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qtb3ZlcmxheXMvbGliL3V0aWxzL293bmVyRG9jdW1lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QtcHJvcC10eXBlcy9saWIvY29tbW9uLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL2VsZW1lbnRUeXBlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0LXByb3AtdHlwZXMvbGliL21vdW50YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1zaW1wbGV0YWJzL2Rpc3QvcmVhY3Qtc2ltcGxldGFicy5qcyIsIm5vZGVfbW9kdWxlcy93YXJuaW5nL2Jyb3dzZXIuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FsbGVsZS1maWx0ZXJzLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9hbGxlbGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWNocm9tb3NvbWUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZS5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvYW5pbWF0ZWQtb3JnYW5pc20uanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2J1dHRvbi5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvY2hhbGxlbmdlLWF3YXJkLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9jaGFuZ2Utc2V4LWJ1dHRvbnMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUtaW1hZ2UuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2Nocm9tb3NvbWUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2NpcmN1bGFyLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2ZlZWRiYWNrLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dhbWV0ZS1wb29sLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nYW1ldGUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbmUtbGFiZWwuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dlbm9tZS10ZXN0LmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9nZW5vbWUuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL2dsb3ctYmFja2dyb3VuZC5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvbW9kYWwtYWxlcnQuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL29yZ2FuaXNtLWdsb3cuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL29yZ2FuaXNtLmpzIiwic3JjL2NvZGUvY29tcG9uZW50cy9wZW4tc3RhdHMuanMiLCJzcmMvY29kZS9jb21wb25lbnRzL3Blbi5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcXVlc3Rpb24tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvcXVlc3Rpb24tb3JnYW5pc20tZ2xvdy5qcyIsInNyYy9jb2RlL2NvbXBvbmVudHMvc3RhdHMuanMiLCJzcmMvY29kZS9nZW5pYmxvY2tzLmpzIiwic3JjL2NvZGUvdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LFVBQWMsRUFEbEI7QUFFQSxXQUFLLElBQU0sY0FBWCxJQUE2QixXQUFXLEtBQVgsQ0FBN0IsRUFBK0M7QUFDM0MsYUFBSyxJQUFNLHFCQUFYLElBQW9DLFdBQVcsS0FBWCxFQUFrQixjQUFsQixDQUFwQyxFQUF1RTtBQUNyRSxjQUFJLFdBQVcsS0FBWCxFQUFrQixjQUFsQixFQUFrQyxjQUFsQyxDQUFpRCxxQkFBakQsQ0FBSixFQUE0RTtBQUMxRSxpQkFBSyxJQUFJLElBQUksQ0FBUixFQUFXLEtBQUssV0FBVyxLQUFYLEVBQWtCLGNBQWxCLEVBQWtDLHFCQUFsQyxFQUF5RCxNQUE5RSxFQUFzRixJQUFJLEVBQTFGLEVBQThGLEdBQTlGLEVBQW1HO0FBQ2pHLDBCQUFZLFdBQVcsS0FBWCxFQUFrQixjQUFsQixFQUFrQyxxQkFBbEMsRUFBeUQsQ0FBekQsQ0FBWixJQUEyRSxDQUEzRTtBQUNEO0FBQ0Y7QUFDRjtBQUNKOztBQUVELFdBQUssSUFBTSxNQUFYLElBQXFCLFdBQXJCLEVBQWlDO0FBQy9CLGdCQUFRLElBQVIsQ0FBYSxNQUFiO0FBQ0Q7O0FBRUQsb0JBQWMsd0JBQWQsQ0FBdUMsS0FBdkMsSUFBZ0QsT0FBaEQsQztBQUNBLGFBQU8sT0FBUDtBQUNEOzs7Ozs7QUFuUmtCLGEsQ0EyUFosd0IsR0FBMkIsRTtrQkEzUGYsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBiYWJlbEhlbHBlcnMgPSByZXF1aXJlKCcuL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbi8qKlxyXG4gKiBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcbiAqL1xuZXhwb3J0c1snZGVmYXVsdCddID0gYWN0aXZlRWxlbWVudDtcblxudmFyIF9vd25lckRvY3VtZW50ID0gcmVxdWlyZSgnLi9vd25lckRvY3VtZW50Jyk7XG5cbnZhciBfb3duZXJEb2N1bWVudDIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vd25lckRvY3VtZW50KTtcblxuZnVuY3Rpb24gYWN0aXZlRWxlbWVudCgpIHtcbiAgdmFyIGRvYyA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMF07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcbnZhciBoYXNDbGFzcyA9IHJlcXVpcmUoJy4vaGFzQ2xhc3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtlbHNlIGlmICghaGFzQ2xhc3MoZWxlbWVudCkpIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUgKyAnICcgKyBjbGFzc05hbWU7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkgcmV0dXJuICEhY2xhc3NOYW1lICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7ZWxzZSByZXR1cm4gKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIGNsYXNzTmFtZSArICcgJykgIT09IC0xO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRDbGFzczogcmVxdWlyZSgnLi9hZGRDbGFzcycpLFxuICByZW1vdmVDbGFzczogcmVxdWlyZSgnLi9yZW1vdmVDbGFzcycpLFxuICBoYXNDbGFzczogcmVxdWlyZSgnLi9oYXNDbGFzcycpXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtlbHNlIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NOYW1lICsgJyg/OlxcXFxzfCQpJywgJ2cnKSwgJyQxJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvZmYgPSBmdW5jdGlvbiBvZmYoKSB7fTtcblxuaWYgKGNhblVzZURPTSkge1xuXG4gIG9mZiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgIHJldHVybiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlIHx8IGZhbHNlKTtcbiAgICB9O2Vsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSByZXR1cm4gZnVuY3Rpb24gKG5vZGUsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG5vZGUuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvZmY7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcbnZhciBvbiA9IGZ1bmN0aW9uIG9uKCkge307XG5cbmlmIChjYW5Vc2VET00pIHtcbiAgb24gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHJldHVybiBmdW5jdGlvbiAobm9kZSwgZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICByZXR1cm4gbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfTtlbHNlIGlmIChkb2N1bWVudC5hdHRhY2hFdmVudCkgcmV0dXJuIGZ1bmN0aW9uIChub2RlLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBub2RlLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH0pKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG93bmVyRG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIG93bmVyRG9jdW1lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJiBub2RlLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNhblVzZURPTSA9IHJlcXVpcmUoJy4uL3V0aWwvaW5ET00nKTtcblxudmFyIGNvbnRhaW5zID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJvb3QgPSBjYW5Vc2VET00gJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gIHJldHVybiByb290ICYmIHJvb3QuY29udGFpbnMgPyBmdW5jdGlvbiAoY29udGV4dCwgbm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0LmNvbnRhaW5zKG5vZGUpO1xuICB9IDogcm9vdCAmJiByb290LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dCA9PT0gbm9kZSB8fCAhIShjb250ZXh0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGUpICYgMTYpO1xuICB9IDogZnVuY3Rpb24gKGNvbnRleHQsIG5vZGUpIHtcbiAgICBpZiAobm9kZSkgZG8ge1xuICAgICAgaWYgKG5vZGUgPT09IGNvbnRleHQpIHJldHVybiB0cnVlO1xuICAgIH0gd2hpbGUgKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgPT09IG5vZGUud2luZG93ID8gbm9kZSA6IG5vZGUubm9kZVR5cGUgPT09IDkgPyBub2RlLmRlZmF1bHRWaWV3IHx8IG5vZGUucGFyZW50V2luZG93IDogZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJhYmVsSGVscGVycyA9IHJlcXVpcmUoJy4uL3V0aWwvYmFiZWxIZWxwZXJzLmpzJyk7XG5cbnZhciBfdXRpbENhbWVsaXplU3R5bGUgPSByZXF1aXJlKCcuLi91dGlsL2NhbWVsaXplU3R5bGUnKTtcblxudmFyIF91dGlsQ2FtZWxpemVTdHlsZTIgPSBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsQ2FtZWxpemVTdHlsZSk7XG5cbnZhciBycG9zaXRpb24gPSAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC87XG52YXIgcm51bW5vbnB4ID0gL14oWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpKSg/IXB4KVthLXolXSskL2k7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2dldENvbXB1dGVkU3R5bGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIEVsZW1lbnQgcGFzc2VkIHRvIGBnZXRDb21wdXRlZFN0eWxlKClgJyk7XG4gIHZhciBkb2MgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG5cbiAgcmV0dXJuICdkZWZhdWx0VmlldycgaW4gZG9jID8gZG9jLmRlZmF1bHRWaWV3Lm9wZW5lciA/IG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpIDogd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOiB7IC8vaWUgOCBcIm1hZ2ljXCIgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8xLjExLXN0YWJsZS9zcmMvY3NzL2N1ckNTUy5qcyNMNzJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlKHByb3ApIHtcbiAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGU7XG5cbiAgICAgIHByb3AgPSAoMCwgX3V0aWxDYW1lbGl6ZVN0eWxlMlsnZGVmYXVsdCddKShwcm9wKTtcblxuICAgICAgaWYgKHByb3AgPT0gJ2Zsb2F0JykgcHJvcCA9ICdzdHlsZUZsb2F0JztcblxuICAgICAgdmFyIGN1cnJlbnQgPSBub2RlLmN1cnJlbnRTdHlsZVtwcm9wXSB8fCBudWxsO1xuXG4gICAgICBpZiAoY3VycmVudCA9PSBudWxsICYmIHN0eWxlICYmIHN0eWxlW3Byb3BdKSBjdXJyZW50ID0gc3R5bGVbcHJvcF07XG5cbiAgICAgIGlmIChybnVtbm9ucHgudGVzdChjdXJyZW50KSAmJiAhcnBvc2l0aW9uLnRlc3QocHJvcCkpIHtcbiAgICAgICAgLy8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xuICAgICAgICB2YXIgbGVmdCA9IHN0eWxlLmxlZnQ7XG4gICAgICAgIHZhciBydW5TdHlsZSA9IG5vZGUucnVudGltZVN0eWxlO1xuICAgICAgICB2YXIgcnNMZWZ0ID0gcnVuU3R5bGUgJiYgcnVuU3R5bGUubGVmdDtcblxuICAgICAgICAvLyBQdXQgaW4gdGhlIG5ldyB2YWx1ZXMgdG8gZ2V0IGEgY29tcHV0ZWQgdmFsdWUgb3V0XG4gICAgICAgIGlmIChyc0xlZnQpIHJ1blN0eWxlLmxlZnQgPSBub2RlLmN1cnJlbnRTdHlsZS5sZWZ0O1xuXG4gICAgICAgIHN0eWxlLmxlZnQgPSBwcm9wID09PSAnZm9udFNpemUnID8gJzFlbScgOiBjdXJyZW50O1xuICAgICAgICBjdXJyZW50ID0gc3R5bGUucGl4ZWxMZWZ0ICsgJ3B4JztcblxuICAgICAgICAvLyBSZXZlcnQgdGhlIGNoYW5nZWQgdmFsdWVzXG4gICAgICAgIHN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgICAgICBpZiAocnNMZWZ0KSBydW5TdHlsZS5sZWZ0ID0gcnNMZWZ0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi4vdXRpbC9jYW1lbGl6ZVN0eWxlJyksXG4gICAgaHlwaGVuYXRlID0gcmVxdWlyZSgnLi4vdXRpbC9oeXBoZW5hdGVTdHlsZScpLFxuICAgIF9nZXRDb21wdXRlZFN0eWxlID0gcmVxdWlyZSgnLi9nZXRDb21wdXRlZFN0eWxlJyksXG4gICAgcmVtb3ZlU3R5bGUgPSByZXF1aXJlKCcuL3JlbW92ZVN0eWxlJyk7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0eWxlKG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICB2YXIgY3NzID0gJycsXG4gICAgICBwcm9wcyA9IHByb3BlcnR5O1xuXG4gIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnKSB7XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIG5vZGUuc3R5bGVbY2FtZWxpemUocHJvcGVydHkpXSB8fCBfZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5nZXRQcm9wZXJ0eVZhbHVlKGh5cGhlbmF0ZShwcm9wZXJ0eSkpO2Vsc2UgKHByb3BzID0ge30pW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIHByb3BzKSBpZiAoaGFzLmNhbGwocHJvcHMsIGtleSkpIHtcbiAgICAhcHJvcHNba2V5XSAmJiBwcm9wc1trZXldICE9PSAwID8gcmVtb3ZlU3R5bGUobm9kZSwgaHlwaGVuYXRlKGtleSkpIDogY3NzICs9IGh5cGhlbmF0ZShrZXkpICsgJzonICsgcHJvcHNba2V5XSArICc7JztcbiAgfVxuXG4gIG5vZGUuc3R5bGUuY3NzVGV4dCArPSAnOycgKyBjc3M7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVTdHlsZShub2RlLCBrZXkpIHtcbiAgcmV0dXJuICdyZW1vdmVQcm9wZXJ0eScgaW4gbm9kZS5zdHlsZSA/IG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KSA6IG5vZGUuc3R5bGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59OyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW1wiZXhwb3J0c1wiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2Uge1xuICAgIGZhY3Rvcnkocm9vdC5iYWJlbEhlbHBlcnMgPSB7fSk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgdmFyIGJhYmVsSGVscGVycyA9IGdsb2JhbDtcblxuICBiYWJlbEhlbHBlcnMuaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgICBcImRlZmF1bHRcIjogb2JqXG4gICAgfTtcbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xufSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHJIeXBoZW4gPSAvLSguKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbWVsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uockh5cGhlbiwgZnVuY3Rpb24gKF8sIGNocikge1xuICAgIHJldHVybiBjaHIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59OyIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi8yYWViOGEyYTZiZWIwMDYxN2E0MjE3ZjdmODI4NDkyNGZhMmFkODE5L3NyYy92ZW5kb3IvY29yZS9jYW1lbGl6ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xudmFyIGNhbWVsaXplID0gcmVxdWlyZSgnLi9jYW1lbGl6ZScpO1xudmFyIG1zUGF0dGVybiA9IC9eLW1zLS87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2FtZWxpemVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gIHJldHVybiBjYW1lbGl6ZShzdHJpbmcucmVwbGFjZShtc1BhdHRlcm4sICdtcy0nKSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJVcHBlciA9IC8oW0EtWl0pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHlwaGVuYXRlKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoclVwcGVyLCAnLSQxJykudG9Mb3dlckNhc2UoKTtcbn07IiwiLyoqXHJcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzJhZWI4YTJhNmJlYjAwNjE3YTQyMTdmN2Y4Mjg0OTI0ZmEyYWQ4MTkvc3JjL3ZlbmRvci9jb3JlL2h5cGhlbmF0ZVN0eWxlTmFtZS5qc1xyXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoeXBoZW5hdGUgPSByZXF1aXJlKFwiLi9oeXBoZW5hdGVcIik7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgcmV0dXJuIGh5cGhlbmF0ZShzdHJpbmcpLnJlcGxhY2UobXNQYXR0ZXJuLCBcIi1tcy1cIik7XG59OyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYW5Vc2VET00gPSByZXF1aXJlKCcuL2luRE9NJyk7XG5cbnZhciBzaXplO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyZWNhbGMpIHtcbiAgaWYgKCFzaXplIHx8IHJlY2FsYykge1xuICAgIGlmIChjYW5Vc2VET00pIHtcbiAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHNjcm9sbERpdi5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gICAgICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICAgICAgc2Nyb2xsRGl2LnN0eWxlLm92ZXJmbG93ID0gJ3Njcm9sbCc7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgIHNpemUgPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNpemU7XG59OyIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS43LjFcbihmdW5jdGlvbigpIHtcbiAgdmFyIGdldE5hbm9TZWNvbmRzLCBocnRpbWUsIGxvYWRUaW1lO1xuXG4gIGlmICgodHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsKSAmJiBwZXJmb3JtYW5jZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAoKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwpICYmIHByb2Nlc3MuaHJ0aW1lKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoZ2V0TmFub1NlY29uZHMoKSAtIGxvYWRUaW1lKSAvIDFlNjtcbiAgICB9O1xuICAgIGhydGltZSA9IHByb2Nlc3MuaHJ0aW1lO1xuICAgIGdldE5hbm9TZWNvbmRzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaHI7XG4gICAgICBociA9IGhydGltZSgpO1xuICAgICAgcmV0dXJuIGhyWzBdICogMWU5ICsgaHJbMV07XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IGdldE5hbm9TZWNvbmRzKCk7XG4gIH0gZWxzZSBpZiAoRGF0ZS5ub3cpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBsb2FkVGltZTtcbiAgICB9O1xuICAgIGxvYWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIHJvb3QgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvd1xuICAsIHZlbmRvcnMgPSBbJ21veicsICd3ZWJraXQnXVxuICAsIHN1ZmZpeCA9ICdBbmltYXRpb25GcmFtZSdcbiAgLCByYWYgPSByb290WydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSByb290WydjYW5jZWwnICsgc3VmZml4XSB8fCByb290WydjYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cblxuZm9yKHZhciBpID0gMDsgIXJhZiAmJiBpIDwgdmVuZG9ycy5sZW5ndGg7IGkrKykge1xuICByYWYgPSByb290W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IHJvb3RbdmVuZG9yc1tpXSArICdDYW5jZWwnICsgc3VmZml4XVxuICAgICAgfHwgcm9vdFt2ZW5kb3JzW2ldICsgJ0NhbmNlbFJlcXVlc3QnICsgc3VmZml4XVxufVxuXG4vLyBTb21lIHZlcnNpb25zIG9mIEZGIGhhdmUgckFGIGJ1dCBub3QgY0FGXG5pZighcmFmIHx8ICFjYWYpIHtcbiAgdmFyIGxhc3QgPSAwXG4gICAgLCBpZCA9IDBcbiAgICAsIHF1ZXVlID0gW11cbiAgICAsIGZyYW1lRHVyYXRpb24gPSAxMDAwIC8gNjBcblxuICByYWYgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGlmKHF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIF9ub3cgPSBub3coKVxuICAgICAgICAsIG5leHQgPSBNYXRoLm1heCgwLCBmcmFtZUR1cmF0aW9uIC0gKF9ub3cgLSBsYXN0KSlcbiAgICAgIGxhc3QgPSBuZXh0ICsgX25vd1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNwID0gcXVldWUuc2xpY2UoMClcbiAgICAgICAgLy8gQ2xlYXIgcXVldWUgaGVyZSB0byBwcmV2ZW50XG4gICAgICAgIC8vIGNhbGxiYWNrcyBmcm9tIGFwcGVuZGluZyBsaXN0ZW5lcnNcbiAgICAgICAgLy8gdG8gdGhlIGN1cnJlbnQgZnJhbWUncyBxdWV1ZVxuICAgICAgICBxdWV1ZS5sZW5ndGggPSAwXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmKCFjcFtpXS5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgY3BbaV0uY2FsbGJhY2sobGFzdClcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlIH0sIDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBNYXRoLnJvdW5kKG5leHQpKVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKHtcbiAgICAgIGhhbmRsZTogKytpZCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIGNhbmNlbGxlZDogZmFsc2VcbiAgICB9KVxuICAgIHJldHVybiBpZFxuICB9XG5cbiAgY2FmID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZihxdWV1ZVtpXS5oYW5kbGUgPT09IGhhbmRsZSkge1xuICAgICAgICBxdWV1ZVtpXS5jYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4pIHtcbiAgLy8gV3JhcCBpbiBhIG5ldyBmdW5jdGlvbiB0byBwcmV2ZW50XG4gIC8vIGBjYW5jZWxgIHBvdGVudGlhbGx5IGJlaW5nIGFzc2lnbmVkXG4gIC8vIHRvIHRoZSBuYXRpdmUgckFGIGZ1bmN0aW9uXG4gIHJldHVybiByYWYuY2FsbChyb290LCBmbilcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkocm9vdCwgYXJndW1lbnRzKVxufVxubW9kdWxlLmV4cG9ydHMucG9seWZpbGwgPSBmdW5jdGlvbigpIHtcbiAgcm9vdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByYWZcbiAgcm9vdC5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhZlxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbWFwVG9aZXJvID0gcmVxdWlyZSgnLi9tYXBUb1plcm8nKTtcblxudmFyIF9tYXBUb1plcm8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwVG9aZXJvKTtcblxudmFyIF9zdHJpcFN0eWxlID0gcmVxdWlyZSgnLi9zdHJpcFN0eWxlJyk7XG5cbnZhciBfc3RyaXBTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpcFN0eWxlKTtcblxudmFyIF9zdGVwcGVyMyA9IHJlcXVpcmUoJy4vc3RlcHBlcicpO1xuXG52YXIgX3N0ZXBwZXI0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RlcHBlcjMpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxudmFyIE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKSxcbiAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9uUmVzdDogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIGRlZmF1bHRTdHlsZSA9IF9wcm9wcy5kZWZhdWx0U3R5bGU7XG4gICAgdmFyIHN0eWxlID0gX3Byb3BzLnN0eWxlO1xuXG4gICAgdmFyIGN1cnJlbnRTdHlsZSA9IGRlZmF1bHRTdHlsZSB8fCBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZSk7XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10oY3VycmVudFN0eWxlKTtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSxcbiAgICAgIGxhc3RJZGVhbFN0eWxlOiBjdXJyZW50U3R5bGUsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0eTogY3VycmVudFZlbG9jaXR5XG4gICAgfTtcbiAgfSxcblxuICB3YXNBbmltYXRpbmc6IGZhbHNlLFxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGU6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGUgIT0gbnVsbCwgd2UgbWFudWFsbHkgZ28gc2V0IHRoZVxuICAvLyBub24taW50ZXJwb2xhdGluZyB2YWx1ZXMgKHRob3NlIHRoYXQgYXJlIGEgbnVtYmVyLCB3aXRob3V0IGEgc3ByaW5nXG4gIC8vIGNvbmZpZylcbiAgY2xlYXJVbnJlYWRQcm9wU3R5bGU6IGZ1bmN0aW9uIGNsZWFyVW5yZWFkUHJvcFN0eWxlKGRlc3RTdHlsZSkge1xuICAgIHZhciBkaXJ0eSA9IGZhbHNlO1xuICAgIHZhciBfc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBjdXJyZW50U3R5bGUgPSBfc3RhdGUuY3VycmVudFN0eWxlO1xuICAgIHZhciBjdXJyZW50VmVsb2NpdHkgPSBfc3RhdGUuY3VycmVudFZlbG9jaXR5O1xuICAgIHZhciBsYXN0SWRlYWxTdHlsZSA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdHkgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdHk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICBpZiAoIWRlc3RTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3R5bGVWYWx1ZSA9IGRlc3RTdHlsZVtrZXldO1xuICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoIWRpcnR5KSB7XG4gICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgIGN1cnJlbnRTdHlsZSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGUpO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBjdXJyZW50VmVsb2NpdHkpO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlKTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0eSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGN1cnJlbnRWZWxvY2l0eVtrZXldID0gMDtcbiAgICAgICAgbGFzdElkZWFsU3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIGxhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZTogY3VycmVudFN0eWxlLCBjdXJyZW50VmVsb2NpdHk6IGN1cnJlbnRWZWxvY2l0eSwgbGFzdElkZWFsU3R5bGU6IGxhc3RJZGVhbFN0eWxlLCBsYXN0SWRlYWxWZWxvY2l0eTogbGFzdElkZWFsVmVsb2NpdHkgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgdmFyIHByb3BzU3R5bGUgPSBfdGhpcy5wcm9wcy5zdHlsZTtcbiAgICAgIGlmIChfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGUsIHByb3BzU3R5bGUsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0eSkpIHtcbiAgICAgICAgaWYgKF90aGlzLndhc0FuaW1hdGluZyAmJiBfdGhpcy5wcm9wcy5vblJlc3QpIHtcbiAgICAgICAgICBfdGhpcy5wcm9wcy5vblJlc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy53YXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHZhciB0aW1lRGVsdGEgPSBjdXJyZW50VGltZSAtIF90aGlzLnByZXZUaW1lO1xuICAgICAgX3RoaXMucHJldlRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IF90aGlzLmFjY3VtdWxhdGVkVGltZSArIHRpbWVEZWx0YTtcbiAgICAgIC8vIG1vcmUgdGhhbiAxMCBmcmFtZXM/IHByb2xseSBzd2l0Y2hlZCBicm93c2VyIHRhYi4gUmVzdGFydFxuICAgICAgaWYgKF90aGlzLmFjY3VtdWxhdGVkVGltZSA+IG1zUGVyRnJhbWUgKiAxMCkge1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID09PSAwKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRGcmFtZUNvbXBsZXRpb24gPSAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC0gTWF0aC5mbG9vcihfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLyBtc1BlckZyYW1lKSAqIG1zUGVyRnJhbWUpIC8gbXNQZXJGcmFtZTtcbiAgICAgIHZhciBmcmFtZXNUb0NhdGNoVXAgPSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpO1xuXG4gICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGUgPSB7fTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0eSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0eSA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNTdHlsZSkge1xuICAgICAgICBpZiAoIXByb3BzU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBwcm9wc1N0eWxlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlID0gX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVba2V5XTtcbiAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXR5W2tleV07XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZXNUb0NhdGNoVXA7IGkrKykge1xuICAgICAgICAgICAgdmFyIF9zdGVwcGVyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfc3RlcHBlclsxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICB2YXIgbmV4dElkZWFsWCA9IF9zdGVwcGVyMlswXTtcbiAgICAgICAgICB2YXIgbmV4dElkZWFsViA9IF9zdGVwcGVyMlsxXTtcblxuICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0eVtrZXldID0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSArIChuZXh0SWRlYWxWIC0gbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlW2tleV0gPSBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlO1xuICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICAgIC8vIHRoZSBhbW91bnQgd2UncmUgbG9vcGVkIG92ZXIgYWJvdmVcbiAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSAtPSBmcmFtZXNUb0NhdGNoVXAgKiBtc1BlckZyYW1lO1xuXG4gICAgICBfdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGN1cnJlbnRTdHlsZTogbmV3Q3VycmVudFN0eWxlLFxuICAgICAgICBjdXJyZW50VmVsb2NpdHk6IG5ld0N1cnJlbnRWZWxvY2l0eSxcbiAgICAgICAgbGFzdElkZWFsU3R5bGU6IG5ld0xhc3RJZGVhbFN0eWxlLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0eTogbmV3TGFzdElkZWFsVmVsb2NpdHlcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBudWxsO1xuXG4gICAgICBfdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMudW5yZWFkUHJvcFN0eWxlICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZSk7XG4gICAgfVxuXG4gICAgdGhpcy51bnJlYWRQcm9wU3R5bGUgPSBwcm9wcy5zdHlsZTtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEICE9IG51bGwpIHtcbiAgICAgIF9yYWYyWydkZWZhdWx0J10uY2FuY2VsKHRoaXMuYW5pbWF0aW9uSUQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciByZW5kZXJlZENoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZSk7XG4gICAgcmV0dXJuIHJlbmRlcmVkQ2hpbGRyZW4gJiYgX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLm9ubHkocmVuZGVyZWRDaGlsZHJlbik7XG4gIH1cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb3Rpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9tYXBUb1plcm8gPSByZXF1aXJlKCcuL21hcFRvWmVybycpO1xuXG52YXIgX21hcFRvWmVybzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBUb1plcm8pO1xuXG52YXIgX3N0cmlwU3R5bGUgPSByZXF1aXJlKCcuL3N0cmlwU3R5bGUnKTtcblxudmFyIF9zdHJpcFN0eWxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmlwU3R5bGUpO1xuXG52YXIgX3N0ZXBwZXIzID0gcmVxdWlyZSgnLi9zdGVwcGVyJyk7XG5cbnZhciBfc3RlcHBlcjQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdGVwcGVyMyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKTtcblxudmFyIF9wZXJmb3JtYW5jZU5vdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wZXJmb3JtYW5jZU5vdyk7XG5cbnZhciBfcmFmID0gcmVxdWlyZSgncmFmJyk7XG5cbnZhciBfcmFmMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JhZik7XG5cbnZhciBfc2hvdWxkU3RvcEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vc2hvdWxkU3RvcEFuaW1hdGlvbicpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2hvdWxkU3RvcEFuaW1hdGlvbik7XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBtc1BlckZyYW1lID0gMTAwMCAvIDYwO1xuXG5mdW5jdGlvbiBzaG91bGRTdG9wQW5pbWF0aW9uQWxsKGN1cnJlbnRTdHlsZXMsIHN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50U3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFfc2hvdWxkU3RvcEFuaW1hdGlvbjJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGVzW2ldLCBzdHlsZXNbaV0sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFN0YWdnZXJlZE1vdGlvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU3RhZ2dlcmVkTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvLyBUT09EOiB3YXJuIGFnYWluc3QgcHV0dGluZyBhIGNvbmZpZyBpbiBoZXJlXG4gICAgZGVmYXVsdFN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0T2YoX3JlYWN0LlByb3BUeXBlcy5udW1iZXIpKSxcbiAgICBzdHlsZXM6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG5cbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgfHwgc3R5bGVzKCkubWFwKF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBjdXJyZW50U3R5bGVzLm1hcChmdW5jdGlvbiAoY3VycmVudFN0eWxlKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShjdXJyZW50U3R5bGUpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgbGFzdElkZWFsVmVsb2NpdGllczogY3VycmVudFZlbG9jaXRpZXNcbiAgICB9O1xuICB9LFxuXG4gIGFuaW1hdGlvbklEOiBudWxsLFxuICBwcmV2VGltZTogMCxcbiAgYWNjdW11bGF0ZWRUaW1lOiAwLFxuICAvLyBpdCdzIHBvc3NpYmxlIHRoYXQgY3VycmVudFN0eWxlJ3MgdmFsdWUgaXMgc3RhbGU6IGlmIHByb3BzIGlzIGltbWVkaWF0ZWx5XG4gIC8vIGNoYW5nZWQgZnJvbSAwIHRvIDQwMCB0byBzcHJpbmcoMCkgYWdhaW4sIHRoZSBhc3luYyBjdXJyZW50U3R5bGUgaXMgc3RpbGxcbiAgLy8gYXQgMCAoZGlkbid0IGhhdmUgdGltZSB0byB0aWNrIGFuZCBpbnRlcnBvbGF0ZSBldmVuIG9uY2UpLiBJZiB3ZSBuYWl2ZWx5XG4gIC8vIGNvbXBhcmUgY3VycmVudFN0eWxlIHdpdGggZGVzdFZhbCBpdCdsbCBiZSAwID09PSAwIChubyBhbmltYXRpb24sIHN0b3ApLlxuICAvLyBJbiByZWFsaXR5IGN1cnJlbnRTdHlsZSBzaG91bGQgYmUgNDAwXG4gIHVucmVhZFByb3BTdHlsZXM6IG51bGwsXG4gIC8vIGFmdGVyIGNoZWNraW5nIGZvciB1bnJlYWRQcm9wU3R5bGVzICE9IG51bGwsIHdlIG1hbnVhbGx5IGdvIHNldCB0aGVcbiAgLy8gbm9uLWludGVycG9sYXRpbmcgdmFsdWVzICh0aG9zZSB0aGF0IGFyZSBhIG51bWJlciwgd2l0aG91dCBhIHNwcmluZ1xuICAvLyBjb25maWcpXG4gIGNsZWFyVW5yZWFkUHJvcFN0eWxlOiBmdW5jdGlvbiBjbGVhclVucmVhZFByb3BTdHlsZSh1bnJlYWRQcm9wU3R5bGVzKSB7XG4gICAgdmFyIF9zdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfc3RhdGUuY3VycmVudFN0eWxlcztcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfc3RhdGUuY3VycmVudFZlbG9jaXRpZXM7XG4gICAgdmFyIGxhc3RJZGVhbFN0eWxlcyA9IF9zdGF0ZS5sYXN0SWRlYWxTdHlsZXM7XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfc3RhdGUubGFzdElkZWFsVmVsb2NpdGllcztcblxuICAgIHZhciBzb21lRGlydHkgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVucmVhZFByb3BTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB1bnJlYWRQcm9wU3R5bGUgPSB1bnJlYWRQcm9wU3R5bGVzW2ldO1xuICAgICAgdmFyIGRpcnR5ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB1bnJlYWRQcm9wU3R5bGUpIHtcbiAgICAgICAgaWYgKCF1bnJlYWRQcm9wU3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSB1bnJlYWRQcm9wU3R5bGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGlmICghZGlydHkpIHtcbiAgICAgICAgICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNvbWVEaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRTdHlsZXNbaV0pO1xuICAgICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV0gPSBfZXh0ZW5kcyh7fSwgY3VycmVudFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFN0eWxlc1tpXSk7XG4gICAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50U3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNvbWVEaXJ0eSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRTdHlsZXM6IGN1cnJlbnRTdHlsZXMsIGN1cnJlbnRWZWxvY2l0aWVzOiBjdXJyZW50VmVsb2NpdGllcywgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsIGxhc3RJZGVhbFZlbG9jaXRpZXM6IGxhc3RJZGVhbFZlbG9jaXRpZXMgfSk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHdoZW4gY29uZmlnIGlzIHthOiAxMH0gYW5kIGRlc3QgaXMge2E6IDEwfSBkbyB3ZSByYWYgb25jZSBhbmRcbiAgICAvLyBjYWxsIGNiPyBObywgb3RoZXJ3aXNlIGFjY2lkZW50YWwgcGFyZW50IHJlcmVuZGVyIGNhdXNlcyBjYiB0cmlnZ2VyXG4gICAgdGhpcy5hbmltYXRpb25JRCA9IF9yYWYyWydkZWZhdWx0J10oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRlc3RTdHlsZXMgPSBfdGhpcy5wcm9wcy5zdHlsZXMoX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKTtcblxuICAgICAgLy8gY2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIGluIHRoZSBmaXJzdCBwbGFjZVxuICAgICAgaWYgKHNob3VsZFN0b3BBbmltYXRpb25BbGwoX3RoaXMuc3RhdGUuY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgX3RoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gW107XG4gICAgICB2YXIgbmV3Q3VycmVudFN0eWxlcyA9IFtdO1xuICAgICAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzdFN0eWxlID0gZGVzdFN0eWxlc1tpXTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGVzdFN0eWxlKSB7XG4gICAgICAgICAgaWYgKCFkZXN0U3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBkZXN0U3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IF90aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBuZXdMYXN0SWRlYWxTdHlsZTtcbiAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG5ld0xhc3RJZGVhbFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudW5yZWFkUHJvcFN0eWxlcyA9IG51bGw7XG5cbiAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy51bnJlYWRQcm9wU3R5bGVzICE9IG51bGwpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIHRoaXMudW5yZWFkUHJvcFN0eWxlcyA9IHByb3BzLnN0eWxlcyh0aGlzLnN0YXRlLmxhc3RJZGVhbFN0eWxlcyk7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5wcmV2VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JRCAhPSBudWxsKSB7XG4gICAgICBfcmFmMlsnZGVmYXVsdCddLmNhbmNlbCh0aGlzLmFuaW1hdGlvbklEKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4odGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICByZXR1cm4gcmVuZGVyZWRDaGlsZHJlbiAmJiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seShyZW5kZXJlZENoaWxkcmVuKTtcbiAgfVxufSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFN0YWdnZXJlZE1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX21hcFRvWmVybyA9IHJlcXVpcmUoJy4vbWFwVG9aZXJvJyk7XG5cbnZhciBfbWFwVG9aZXJvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcFRvWmVybyk7XG5cbnZhciBfc3RyaXBTdHlsZSA9IHJlcXVpcmUoJy4vc3RyaXBTdHlsZScpO1xuXG52YXIgX3N0cmlwU3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaXBTdHlsZSk7XG5cbnZhciBfc3RlcHBlcjMgPSByZXF1aXJlKCcuL3N0ZXBwZXInKTtcblxudmFyIF9zdGVwcGVyNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0ZXBwZXIzKTtcblxudmFyIF9tZXJnZURpZmYgPSByZXF1aXJlKCcuL21lcmdlRGlmZicpO1xuXG52YXIgX21lcmdlRGlmZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZXJnZURpZmYpO1xuXG52YXIgX3BlcmZvcm1hbmNlTm93ID0gcmVxdWlyZSgncGVyZm9ybWFuY2Utbm93Jyk7XG5cbnZhciBfcGVyZm9ybWFuY2VOb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGVyZm9ybWFuY2VOb3cpO1xuXG52YXIgX3JhZiA9IHJlcXVpcmUoJ3JhZicpO1xuXG52YXIgX3JhZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yYWYpO1xuXG52YXIgX3Nob3VsZFN0b3BBbmltYXRpb24gPSByZXF1aXJlKCcuL3Nob3VsZFN0b3BBbmltYXRpb24nKTtcblxudmFyIF9zaG91bGRTdG9wQW5pbWF0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Nob3VsZFN0b3BBbmltYXRpb24pO1xuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgbXNQZXJGcmFtZSA9IDEwMDAgLyA2MDtcblxuLy8gdGhlIGNoaWxkcmVuIGZ1bmN0aW9uICYgKHBvdGVudGlhbCkgc3R5bGVzIGZ1bmN0aW9uIGFza3MgYXMgcGFyYW0gYW5cbi8vIEFycmF5PFRyYW5zaXRpb25QbGFpblN0eWxlPiwgd2hlcmUgZWFjaCBUcmFuc2l0aW9uUGxhaW5TdHlsZSBpcyBvZiB0aGUgZm9ybWF0XG4vLyB7a2V5OiBzdHJpbmcsIGRhdGE/OiBhbnksIHN0eWxlOiBQbGFpblN0eWxlfS4gSG93ZXZlciwgdGhlIHdheSB3ZSBrZWVwXG4vLyBpbnRlcm5hbCBzdGF0ZXMgZG9lc24ndCBjb250YWluIHN1Y2ggYSBkYXRhIHN0cnVjdHVyZSAoY2hlY2sgdGhlIHN0YXRlIGFuZFxuLy8gVHJhbnNpdGlvbk1vdGlvblN0YXRlKS4gU28gd2hlbiBjaGlsZHJlbiBmdW5jdGlvbiBhbmQgb3RoZXJzIGFzayBmb3Igc3VjaFxuLy8gZGF0YSB3ZSBuZWVkIHRvIGdlbmVyYXRlIHRoZW0gb24gdGhlIGZseSBieSBjb21iaW5pbmcgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4vLyBjdXJyZW50U3R5bGVzL2xhc3RJZGVhbFN0eWxlc1xuZnVuY3Rpb24gcmVoeWRyYXRlU3R5bGVzKG1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCBwbGFpblN0eWxlcykge1xuICBpZiAodW5yZWFkUHJvcFN0eWxlcyA9PSBudWxsKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogbWVyZ2VkUHJvcHNTdHlsZS5rZXksXG4gICAgICAgIGRhdGE6IG1lcmdlZFByb3BzU3R5bGUuZGF0YSxcbiAgICAgICAgc3R5bGU6IHBsYWluU3R5bGVzW2ldXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBtZXJnZWRQcm9wc1N0eWxlcy5tYXAoZnVuY3Rpb24gKG1lcmdlZFByb3BzU3R5bGUsIGkpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB1bnJlYWRQcm9wU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBpZiAodW5yZWFkUHJvcFN0eWxlc1tqXS5rZXkgPT09IG1lcmdlZFByb3BzU3R5bGUua2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICAgIGtleTogdW5yZWFkUHJvcFN0eWxlc1tqXS5rZXksXG4gICAgICAgICAgZGF0YTogdW5yZWFkUHJvcFN0eWxlc1tqXS5kYXRhLFxuICAgICAgICAgIHN0eWxlOiBwbGFpblN0eWxlc1tpXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgcmV0dXJuIHsga2V5OiBtZXJnZWRQcm9wc1N0eWxlLmtleSwgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZS5kYXRhLCBzdHlsZTogcGxhaW5TdHlsZXNbaV0gfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb25BbGwoY3VycmVudFN0eWxlcywgZGVzdFN0eWxlcywgY3VycmVudFZlbG9jaXRpZXMsIG1lcmdlZFByb3BzU3R5bGVzKSB7XG4gIGlmIChtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGggIT09IGRlc3RTdHlsZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtZXJnZWRQcm9wc1N0eWxlc1tpXS5rZXkgIT09IGRlc3RTdHlsZXNbaV0ua2V5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gd2UgaGF2ZSB0aGUgaW52YXJpYW50IHRoYXQgbWVyZ2VkUHJvcHNTdHlsZXMgYW5kXG4gIC8vIGN1cnJlbnRTdHlsZXMvY3VycmVudFZlbG9jaXRpZXMvbGFzdCogYXJlIHN5bmNlZCBpbiB0ZXJtcyBvZiBjZWxscywgc2VlXG4gIC8vIG1lcmdlQW5kU3luYyBjb21tZW50IGZvciBtb3JlIGluZm9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghX3Nob3VsZFN0b3BBbmltYXRpb24yWydkZWZhdWx0J10oY3VycmVudFN0eWxlc1tpXSwgZGVzdFN0eWxlc1tpXS5zdHlsZSwgY3VycmVudFZlbG9jaXRpZXNbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvcmUga2V5IG1lcmdpbmcgbG9naWNcblxuLy8gdGhpbmdzIHRvIGRvOiBzYXkgcHJldmlvdXNseSBtZXJnZWQgc3R5bGUgaXMge2EsIGJ9LCBkZXN0IHN0eWxlIChwcm9wKSBpcyB7Yixcbi8vIGN9LCBwcmV2aW91cyBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBpcyB7YSwgYn1cbi8vICoqaW52YXJpYW50Kio6IGN1cnJlbnRbaV0gY29ycmVzcG9uZHMgdG8gbWVyZ2VkW2ldIGluIHRlcm1zIG9mIGtleVxuXG4vLyBzdGVwczpcbi8vIHR1cm4gbWVyZ2VkIHN0eWxlIGludG8ge2E/LCBiLCBjfVxuLy8gICAgYWRkIGMsIHZhbHVlIG9mIGMgaXMgZGVzdFN0eWxlcy5jXG4vLyAgICBtYXliZSByZW1vdmUgYSwgYWthIGNhbGwgd2lsbExlYXZlKGEpLCB0aGVuIG1lcmdlZCBpcyBlaXRoZXIge2IsIGN9IG9yIHthLCBiLCBjfVxuLy8gdHVybiBjdXJyZW50IChpbnRlcnBvbGF0aW5nKSBzdHlsZSBmcm9tIHthLCBifSBpbnRvIHthPywgYiwgY31cbi8vICAgIG1heWJlIHJlbW92ZSBhXG4vLyAgICBjZXJ0YWlubHkgYWRkIGMsIHZhbHVlIG9mIGMgaXMgd2lsbEVudGVyKGMpXG4vLyBsb29wIG92ZXIgbWVyZ2VkIGFuZCBjb25zdHJ1Y3QgbmV3IGN1cnJlbnRcbi8vIGRlc3QgZG9lc24ndCBjaGFuZ2UsIHRoYXQncyBvd25lcidzXG5mdW5jdGlvbiBtZXJnZUFuZFN5bmMod2lsbEVudGVyLCB3aWxsTGVhdmUsIG9sZE1lcmdlZFByb3BzU3R5bGVzLCBkZXN0U3R5bGVzLCBvbGRDdXJyZW50U3R5bGVzLCBvbGRDdXJyZW50VmVsb2NpdGllcywgb2xkTGFzdElkZWFsU3R5bGVzLCBvbGRMYXN0SWRlYWxWZWxvY2l0aWVzKSB7XG4gIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlcyA9IF9tZXJnZURpZmYyWydkZWZhdWx0J10ob2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIGZ1bmN0aW9uIChvbGRJbmRleCwgb2xkTWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgIHZhciBsZWF2aW5nU3R5bGUgPSB3aWxsTGVhdmUob2xkTWVyZ2VkUHJvcHNTdHlsZSk7XG4gICAgaWYgKGxlYXZpbmdTdHlsZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKF9zaG91bGRTdG9wQW5pbWF0aW9uMlsnZGVmYXVsdCddKG9sZEN1cnJlbnRTdHlsZXNbb2xkSW5kZXhdLCBsZWF2aW5nU3R5bGUsIG9sZEN1cnJlbnRWZWxvY2l0aWVzW29sZEluZGV4XSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IG9sZE1lcmdlZFByb3BzU3R5bGUua2V5LCBkYXRhOiBvbGRNZXJnZWRQcm9wc1N0eWxlLmRhdGEsIHN0eWxlOiBsZWF2aW5nU3R5bGUgfTtcbiAgfSk7XG5cbiAgdmFyIG5ld0N1cnJlbnRTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0N1cnJlbnRWZWxvY2l0aWVzID0gW107XG4gIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBbXTtcbiAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdNZXJnZWRQcm9wc1N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCA9IG5ld01lcmdlZFByb3BzU3R5bGVzW2ldO1xuICAgIHZhciBmb3VuZE9sZEluZGV4ID0gbnVsbDtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9sZE1lcmdlZFByb3BzU3R5bGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAob2xkTWVyZ2VkUHJvcHNTdHlsZXNbal0ua2V5ID09PSBuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgZm91bmRPbGRJbmRleCA9IGo7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPOiBrZXkgc2VhcmNoIGNvZGVcbiAgICBpZiAoZm91bmRPbGRJbmRleCA9PSBudWxsKSB7XG4gICAgICB2YXIgcGxhaW5TdHlsZSA9IHdpbGxFbnRlcihuZXdNZXJnZWRQcm9wc1N0eWxlQ2VsbCk7XG4gICAgICBuZXdDdXJyZW50U3R5bGVzW2ldID0gcGxhaW5TdHlsZTtcbiAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IHBsYWluU3R5bGU7XG5cbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIHZhciB2ZWxvY2l0eSA9IF9tYXBUb1plcm8yWydkZWZhdWx0J10obmV3TWVyZ2VkUHJvcHNTdHlsZUNlbGwuc3R5bGUpO1xuICAgICAgbmV3Q3VycmVudFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXRpZXNbaV0gPSB2ZWxvY2l0eTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q3VycmVudFN0eWxlc1tpXSA9IG9sZEN1cnJlbnRTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdMYXN0SWRlYWxTdHlsZXNbaV0gPSBvbGRMYXN0SWRlYWxTdHlsZXNbZm91bmRPbGRJbmRleF07XG4gICAgICBuZXdDdXJyZW50VmVsb2NpdGllc1tpXSA9IG9sZEN1cnJlbnRWZWxvY2l0aWVzW2ZvdW5kT2xkSW5kZXhdO1xuICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IG9sZExhc3RJZGVhbFZlbG9jaXRpZXNbZm91bmRPbGRJbmRleF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtuZXdNZXJnZWRQcm9wc1N0eWxlcywgbmV3Q3VycmVudFN0eWxlcywgbmV3Q3VycmVudFZlbG9jaXRpZXMsIG5ld0xhc3RJZGVhbFN0eWxlcywgbmV3TGFzdElkZWFsVmVsb2NpdGllc107XG59XG5cbnZhciBUcmFuc2l0aW9uTW90aW9uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUcmFuc2l0aW9uTW90aW9uJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBkZWZhdWx0U3R5bGVzOiBfcmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoX3JlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBrZXk6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBkYXRhOiBfcmVhY3QuUHJvcFR5cGVzLmFueSxcbiAgICAgIHN0eWxlOiBfcmVhY3QuUHJvcFR5cGVzLm9iamVjdE9mKF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkXG4gICAgfSkpLFxuICAgIHN0eWxlczogX3JlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdC5Qcm9wVHlwZXMuZnVuYywgX3JlYWN0LlByb3BUeXBlcy5hcnJheU9mKF9yZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAga2V5OiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGF0YTogX3JlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgICBzdHlsZTogX3JlYWN0LlByb3BUeXBlcy5vYmplY3RPZihfcmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbX3JlYWN0LlByb3BUeXBlcy5udW1iZXIsIF9yZWFjdC5Qcm9wVHlwZXMub2JqZWN0XSkpLmlzUmVxdWlyZWRcbiAgICB9KSldKS5pc1JlcXVpcmVkLFxuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB3aWxsTGVhdmU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB3aWxsRW50ZXI6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3aWxsRW50ZXI6IGZ1bmN0aW9uIHdpbGxFbnRlcihzdHlsZVRoYXRFbnRlcmVkKSB7XG4gICAgICAgIHJldHVybiBfc3RyaXBTdHlsZTJbJ2RlZmF1bHQnXShzdHlsZVRoYXRFbnRlcmVkLnN0eWxlKTtcbiAgICAgIH0sXG4gICAgICAvLyByZWNhbGw6IHJldHVybmluZyBudWxsIG1ha2VzIHRoZSBjdXJyZW50IHVubW91bnRpbmcgVHJhbnNpdGlvblN0eWxlXG4gICAgICAvLyBkaXNhcHBlYXIgaW1tZWRpYXRlbHlcbiAgICAgIHdpbGxMZWF2ZTogZnVuY3Rpb24gd2lsbExlYXZlKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBkZWZhdWx0U3R5bGVzID0gX3Byb3BzLmRlZmF1bHRTdHlsZXM7XG4gICAgdmFyIHN0eWxlcyA9IF9wcm9wcy5zdHlsZXM7XG4gICAgdmFyIHdpbGxFbnRlciA9IF9wcm9wcy53aWxsRW50ZXI7XG4gICAgdmFyIHdpbGxMZWF2ZSA9IF9wcm9wcy53aWxsTGVhdmU7XG5cbiAgICB2YXIgZGVzdFN0eWxlcyA9IHR5cGVvZiBzdHlsZXMgPT09ICdmdW5jdGlvbicgPyBzdHlsZXMoZGVmYXVsdFN0eWxlcykgOiBzdHlsZXM7XG5cbiAgICAvLyB0aGlzIGlzIHNwZWNpYWwuIGZvciB0aGUgZmlyc3QgdGltZSBhcm91bmQsIHdlIGRvbid0IGhhdmUgYSBjb21wYXJpc29uXG4gICAgLy8gYmV0d2VlbiBsYXN0IChubyBsYXN0KSBhbmQgY3VycmVudCBtZXJnZWQgcHJvcHMuIHdlJ2xsIGNvbXB1dGUgbGFzdCBzbzpcbiAgICAvLyBzYXkgZGVmYXVsdCBpcyB7YSwgYn0gYW5kIHN0eWxlcyAoZGVzdCBzdHlsZSkgaXMge2IsIGN9LCB3ZSdsbFxuICAgIC8vIGZhYnJpY2F0ZSBsYXN0IGFzIHthLCBifVxuICAgIHZhciBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZGVmYXVsdFN0eWxlcyA9PSBudWxsKSB7XG4gICAgICBvbGRNZXJnZWRQcm9wc1N0eWxlcyA9IGRlc3RTdHlsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIG9sZE1lcmdlZFByb3BzU3R5bGVzID0gZGVmYXVsdFN0eWxlcy5tYXAoZnVuY3Rpb24gKGRlZmF1bHRTdHlsZUNlbGwpIHtcbiAgICAgICAgLy8gVE9ETzoga2V5IHNlYXJjaCBjb2RlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzdFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChkZXN0U3R5bGVzW2ldLmtleSA9PT0gZGVmYXVsdFN0eWxlQ2VsbC5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0U3R5bGVzW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFN0eWxlQ2VsbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgb2xkQ3VycmVudFN0eWxlcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX3N0cmlwU3R5bGUyWydkZWZhdWx0J10ocy5zdHlsZSk7XG4gICAgfSkgOiBkZWZhdWx0U3R5bGVzLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9zdHJpcFN0eWxlMlsnZGVmYXVsdCddKHMuc3R5bGUpO1xuICAgIH0pO1xuICAgIHZhciBvbGRDdXJyZW50VmVsb2NpdGllcyA9IGRlZmF1bHRTdHlsZXMgPT0gbnVsbCA/IGRlc3RTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KSA6IGRlZmF1bHRTdHlsZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gX21hcFRvWmVybzJbJ2RlZmF1bHQnXShzLnN0eWxlKTtcbiAgICB9KTtcblxuICAgIHZhciBfbWVyZ2VBbmRTeW5jID0gbWVyZ2VBbmRTeW5jKFxuICAgIC8vICRGbG93Rml4TWVcbiAgICB3aWxsRW50ZXIsXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHdpbGxMZWF2ZSwgb2xkTWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIG9sZEN1cnJlbnRTdHlsZXMsIG9sZEN1cnJlbnRWZWxvY2l0aWVzLCBvbGRDdXJyZW50U3R5bGVzLCAvLyBvbGRMYXN0SWRlYWxTdHlsZXMgcmVhbGx5XG4gICAgb2xkQ3VycmVudFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luY1swXTtcbiAgICB2YXIgY3VycmVudFN0eWxlcyA9IF9tZXJnZUFuZFN5bmNbMV07XG4gICAgdmFyIGN1cnJlbnRWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luY1syXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luY1szXTtcbiAgICB2YXIgbGFzdElkZWFsVmVsb2NpdGllcyA9IF9tZXJnZUFuZFN5bmNbNF07XG4gICAgLy8gb2xkTGFzdElkZWFsVmVsb2NpdGllcyByZWFsbHlcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzXG4gICAgfTtcbiAgfSxcblxuICBhbmltYXRpb25JRDogbnVsbCxcbiAgcHJldlRpbWU6IDAsXG4gIGFjY3VtdWxhdGVkVGltZTogMCxcbiAgLy8gaXQncyBwb3NzaWJsZSB0aGF0IGN1cnJlbnRTdHlsZSdzIHZhbHVlIGlzIHN0YWxlOiBpZiBwcm9wcyBpcyBpbW1lZGlhdGVseVxuICAvLyBjaGFuZ2VkIGZyb20gMCB0byA0MDAgdG8gc3ByaW5nKDApIGFnYWluLCB0aGUgYXN5bmMgY3VycmVudFN0eWxlIGlzIHN0aWxsXG4gIC8vIGF0IDAgKGRpZG4ndCBoYXZlIHRpbWUgdG8gdGljayBhbmQgaW50ZXJwb2xhdGUgZXZlbiBvbmNlKS4gSWYgd2UgbmFpdmVseVxuICAvLyBjb21wYXJlIGN1cnJlbnRTdHlsZSB3aXRoIGRlc3RWYWwgaXQnbGwgYmUgMCA9PT0gMCAobm8gYW5pbWF0aW9uLCBzdG9wKS5cbiAgLy8gSW4gcmVhbGl0eSBjdXJyZW50U3R5bGUgc2hvdWxkIGJlIDQwMFxuICB1bnJlYWRQcm9wU3R5bGVzOiBudWxsLFxuICAvLyBhZnRlciBjaGVja2luZyBmb3IgdW5yZWFkUHJvcFN0eWxlcyAhPSBudWxsLCB3ZSBtYW51YWxseSBnbyBzZXQgdGhlXG4gIC8vIG5vbi1pbnRlcnBvbGF0aW5nIHZhbHVlcyAodGhvc2UgdGhhdCBhcmUgYSBudW1iZXIsIHdpdGhvdXQgYSBzcHJpbmdcbiAgLy8gY29uZmlnKVxuICBjbGVhclVucmVhZFByb3BTdHlsZTogZnVuY3Rpb24gY2xlYXJVbnJlYWRQcm9wU3R5bGUodW5yZWFkUHJvcFN0eWxlcykge1xuICAgIHZhciBfbWVyZ2VBbmRTeW5jMiA9IG1lcmdlQW5kU3luYyhcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgdGhpcy5wcm9wcy53aWxsRW50ZXIsXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHRoaXMucHJvcHMud2lsbExlYXZlLCB0aGlzLnN0YXRlLm1lcmdlZFByb3BzU3R5bGVzLCB1bnJlYWRQcm9wU3R5bGVzLCB0aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIHRoaXMuc3RhdGUuY3VycmVudFZlbG9jaXRpZXMsIHRoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzLCB0aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgdmFyIG1lcmdlZFByb3BzU3R5bGVzID0gX21lcmdlQW5kU3luYzJbMF07XG4gICAgdmFyIGN1cnJlbnRTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jMlsxXTtcbiAgICB2YXIgY3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMlsyXTtcbiAgICB2YXIgbGFzdElkZWFsU3R5bGVzID0gX21lcmdlQW5kU3luYzJbM107XG4gICAgdmFyIGxhc3RJZGVhbFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jMls0XTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5yZWFkUHJvcFN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHVucmVhZFByb3BTdHlsZSA9IHVucmVhZFByb3BTdHlsZXNbaV0uc3R5bGU7XG4gICAgICB2YXIgZGlydHkgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHVucmVhZFByb3BTdHlsZSkge1xuICAgICAgICBpZiAoIXVucmVhZFByb3BTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHVucmVhZFByb3BTdHlsZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgaWYgKCFkaXJ0eSkge1xuICAgICAgICAgICAgZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgY3VycmVudFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBjdXJyZW50U3R5bGVzW2ldKTtcbiAgICAgICAgICAgIGN1cnJlbnRWZWxvY2l0aWVzW2ldID0gX2V4dGVuZHMoe30sIGN1cnJlbnRWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIGxhc3RJZGVhbFN0eWxlc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxTdHlsZXNbaV0pO1xuICAgICAgICAgICAgbGFzdElkZWFsVmVsb2NpdGllc1tpXSA9IF9leHRlbmRzKHt9LCBsYXN0SWRlYWxWZWxvY2l0aWVzW2ldKTtcbiAgICAgICAgICAgIG1lcmdlZFByb3BzU3R5bGVzW2ldID0ge1xuICAgICAgICAgICAgICBrZXk6IG1lcmdlZFByb3BzU3R5bGVzW2ldLmtleSxcbiAgICAgICAgICAgICAgZGF0YTogbWVyZ2VkUHJvcHNTdHlsZXNbaV0uZGF0YSxcbiAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBtZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRTdHlsZXNbaV1ba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgY3VycmVudFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbGFzdElkZWFsU3R5bGVzW2ldW2tleV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICAgIGxhc3RJZGVhbFZlbG9jaXRpZXNbaV1ba2V5XSA9IDA7XG4gICAgICAgICAgbWVyZ2VkUHJvcHNTdHlsZXNbaV0uc3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bmxpa2UgdGhlIG90aGVyIDIgY29tcG9uZW50cywgd2UgY2FuJ3QgZGV0ZWN0IHN0YWxlbmVzcyBhbmQgb3B0aW9uYWxseVxuICAgIC8vIG9wdCBvdXQgb2Ygc2V0U3RhdGUgaGVyZS4gZWFjaCBzdHlsZSBvYmplY3QncyBkYXRhIG1pZ2h0IGNvbnRhaW4gbmV3XG4gICAgLy8gc3R1ZmYgd2UncmUgbm90L2Nhbm5vdCBjb21wYXJlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50U3R5bGVzOiBjdXJyZW50U3R5bGVzLFxuICAgICAgY3VycmVudFZlbG9jaXRpZXM6IGN1cnJlbnRWZWxvY2l0aWVzLFxuICAgICAgbWVyZ2VkUHJvcHNTdHlsZXM6IG1lcmdlZFByb3BzU3R5bGVzLFxuICAgICAgbGFzdElkZWFsU3R5bGVzOiBsYXN0SWRlYWxTdHlsZXMsXG4gICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBsYXN0SWRlYWxWZWxvY2l0aWVzXG4gICAgfSk7XG4gIH0sXG5cbiAgc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeTogZnVuY3Rpb24gc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogd2hlbiBjb25maWcgaXMge2E6IDEwfSBhbmQgZGVzdCBpcyB7YTogMTB9IGRvIHdlIHJhZiBvbmNlIGFuZFxuICAgIC8vIGNhbGwgY2I/IE5vLCBvdGhlcndpc2UgYWNjaWRlbnRhbCBwYXJlbnQgcmVyZW5kZXIgY2F1c2VzIGNiIHRyaWdnZXJcbiAgICB0aGlzLmFuaW1hdGlvbklEID0gX3JhZjJbJ2RlZmF1bHQnXShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcHJvcFN0eWxlcyA9IF90aGlzLnByb3BzLnN0eWxlcztcbiAgICAgIHZhciBkZXN0U3R5bGVzID0gdHlwZW9mIHByb3BTdHlsZXMgPT09ICdmdW5jdGlvbicgPyBwcm9wU3R5bGVzKHJlaHlkcmF0ZVN0eWxlcyhfdGhpcy5zdGF0ZS5tZXJnZWRQcm9wc1N0eWxlcywgX3RoaXMudW5yZWFkUHJvcFN0eWxlcywgX3RoaXMuc3RhdGUubGFzdElkZWFsU3R5bGVzKSkgOiBwcm9wU3R5bGVzO1xuXG4gICAgICAvLyBjaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgaW4gdGhlIGZpcnN0IHBsYWNlXG4gICAgICBpZiAoc2hvdWxkU3RvcEFuaW1hdGlvbkFsbChfdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzLCBkZXN0U3R5bGVzLCBfdGhpcy5zdGF0ZS5jdXJyZW50VmVsb2NpdGllcywgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMpKSB7XG4gICAgICAgIC8vIG5vIG5lZWQgdG8gY2FuY2VsIGFuaW1hdGlvbklEIGhlcmU7IHNob3VsZG4ndCBoYXZlIGFueSBpbiBmbGlnaHRcbiAgICAgICAgX3RoaXMuYW5pbWF0aW9uSUQgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50VGltZSA9IF9wZXJmb3JtYW5jZU5vdzJbJ2RlZmF1bHQnXSgpO1xuICAgICAgdmFyIHRpbWVEZWx0YSA9IGN1cnJlbnRUaW1lIC0gX3RoaXMucHJldlRpbWU7XG4gICAgICBfdGhpcy5wcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgX3RoaXMuYWNjdW11bGF0ZWRUaW1lID0gX3RoaXMuYWNjdW11bGF0ZWRUaW1lICsgdGltZURlbHRhO1xuICAgICAgLy8gbW9yZSB0aGFuIDEwIGZyYW1lcz8gcHJvbGx5IHN3aXRjaGVkIGJyb3dzZXIgdGFiLiBSZXN0YXJ0XG4gICAgICBpZiAoX3RoaXMuYWNjdW11bGF0ZWRUaW1lID4gbXNQZXJGcmFtZSAqIDEwKSB7XG4gICAgICAgIF90aGlzLmFjY3VtdWxhdGVkVGltZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgPT09IDApIHtcbiAgICAgICAgLy8gbm8gbmVlZCB0byBjYW5jZWwgYW5pbWF0aW9uSUQgaGVyZTsgc2hvdWxkbid0IGhhdmUgYW55IGluIGZsaWdodFxuICAgICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0QW5pbWF0aW9uSWZOZWNlc3NhcnkoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudEZyYW1lQ29tcGxldGlvbiA9IChfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLSBNYXRoLmZsb29yKF90aGlzLmFjY3VtdWxhdGVkVGltZSAvIG1zUGVyRnJhbWUpICogbXNQZXJGcmFtZSkgLyBtc1BlckZyYW1lO1xuICAgICAgdmFyIGZyYW1lc1RvQ2F0Y2hVcCA9IE1hdGguZmxvb3IoX3RoaXMuYWNjdW11bGF0ZWRUaW1lIC8gbXNQZXJGcmFtZSk7XG5cbiAgICAgIHZhciBfbWVyZ2VBbmRTeW5jMyA9IG1lcmdlQW5kU3luYyhcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIF90aGlzLnByb3BzLndpbGxFbnRlcixcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIF90aGlzLnByb3BzLndpbGxMZWF2ZSwgX3RoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIGRlc3RTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRTdHlsZXMsIF90aGlzLnN0YXRlLmN1cnJlbnRWZWxvY2l0aWVzLCBfdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMsIF90aGlzLnN0YXRlLmxhc3RJZGVhbFZlbG9jaXRpZXMpO1xuXG4gICAgICB2YXIgbmV3TWVyZ2VkUHJvcHNTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1swXTtcbiAgICAgIHZhciBuZXdDdXJyZW50U3R5bGVzID0gX21lcmdlQW5kU3luYzNbMV07XG4gICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXRpZXMgPSBfbWVyZ2VBbmRTeW5jM1syXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZXMgPSBfbWVyZ2VBbmRTeW5jM1szXTtcbiAgICAgIHZhciBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzID0gX21lcmdlQW5kU3luYzNbNF07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3TWVyZ2VkUHJvcHNTdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5ld01lcmdlZFByb3BzU3R5bGUgPSBuZXdNZXJnZWRQcm9wc1N0eWxlc1tpXS5zdHlsZTtcbiAgICAgICAgdmFyIG5ld0N1cnJlbnRTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3Q3VycmVudFZlbG9jaXR5ID0ge307XG4gICAgICAgIHZhciBuZXdMYXN0SWRlYWxTdHlsZSA9IHt9O1xuICAgICAgICB2YXIgbmV3TGFzdElkZWFsVmVsb2NpdHkgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3TWVyZ2VkUHJvcHNTdHlsZSkge1xuICAgICAgICAgIGlmICghbmV3TWVyZ2VkUHJvcHNTdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IG5ld01lcmdlZFByb3BzU3R5bGVba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHN0eWxlVmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdDdXJyZW50U3R5bGVba2V5XSA9IHN0eWxlVmFsdWU7XG4gICAgICAgICAgICBuZXdDdXJyZW50VmVsb2NpdHlba2V5XSA9IDA7XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSA9IG5ld0xhc3RJZGVhbFN0eWxlc1tpXVtrZXldO1xuICAgICAgICAgICAgdmFyIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUgPSBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldW2tleV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGZyYW1lc1RvQ2F0Y2hVcDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBfc3RlcHBlciA9IF9zdGVwcGVyNFsnZGVmYXVsdCddKG1zUGVyRnJhbWUgLyAxMDAwLCBuZXdMYXN0SWRlYWxTdHlsZVZhbHVlLCBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlLCBzdHlsZVZhbHVlLnZhbCwgc3R5bGVWYWx1ZS5zdGlmZm5lc3MsIHN0eWxlVmFsdWUuZGFtcGluZywgc3R5bGVWYWx1ZS5wcmVjaXNpb24pO1xuXG4gICAgICAgICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUgPSBfc3RlcHBlclswXTtcbiAgICAgICAgICAgICAgbmV3TGFzdElkZWFsVmVsb2NpdHlWYWx1ZSA9IF9zdGVwcGVyWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3N0ZXBwZXIyID0gX3N0ZXBwZXI0WydkZWZhdWx0J10obXNQZXJGcmFtZSAvIDEwMDAsIG5ld0xhc3RJZGVhbFN0eWxlVmFsdWUsIG5ld0xhc3RJZGVhbFZlbG9jaXR5VmFsdWUsIHN0eWxlVmFsdWUudmFsLCBzdHlsZVZhbHVlLnN0aWZmbmVzcywgc3R5bGVWYWx1ZS5kYW1waW5nLCBzdHlsZVZhbHVlLnByZWNpc2lvbik7XG5cbiAgICAgICAgICAgIHZhciBuZXh0SWRlYWxYID0gX3N0ZXBwZXIyWzBdO1xuICAgICAgICAgICAgdmFyIG5leHRJZGVhbFYgPSBfc3RlcHBlcjJbMV07XG5cbiAgICAgICAgICAgIG5ld0N1cnJlbnRTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSArIChuZXh0SWRlYWxYIC0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZSkgKiBjdXJyZW50RnJhbWVDb21wbGV0aW9uO1xuICAgICAgICAgICAgbmV3Q3VycmVudFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlICsgKG5leHRJZGVhbFYgLSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlKSAqIGN1cnJlbnRGcmFtZUNvbXBsZXRpb247XG4gICAgICAgICAgICBuZXdMYXN0SWRlYWxTdHlsZVtrZXldID0gbmV3TGFzdElkZWFsU3R5bGVWYWx1ZTtcbiAgICAgICAgICAgIG5ld0xhc3RJZGVhbFZlbG9jaXR5W2tleV0gPSBuZXdMYXN0SWRlYWxWZWxvY2l0eVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0xhc3RJZGVhbFN0eWxlc1tpXSA9IG5ld0xhc3RJZGVhbFN0eWxlO1xuICAgICAgICBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzW2ldID0gbmV3TGFzdElkZWFsVmVsb2NpdHk7XG4gICAgICAgIG5ld0N1cnJlbnRTdHlsZXNbaV0gPSBuZXdDdXJyZW50U3R5bGU7XG4gICAgICAgIG5ld0N1cnJlbnRWZWxvY2l0aWVzW2ldID0gbmV3Q3VycmVudFZlbG9jaXR5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5hbmltYXRpb25JRCA9IG51bGw7XG4gICAgICAvLyB0aGUgYW1vdW50IHdlJ3JlIGxvb3BlZCBvdmVyIGFib3ZlXG4gICAgICBfdGhpcy5hY2N1bXVsYXRlZFRpbWUgLT0gZnJhbWVzVG9DYXRjaFVwICogbXNQZXJGcmFtZTtcblxuICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50U3R5bGVzOiBuZXdDdXJyZW50U3R5bGVzLFxuICAgICAgICBjdXJyZW50VmVsb2NpdGllczogbmV3Q3VycmVudFZlbG9jaXRpZXMsXG4gICAgICAgIGxhc3RJZGVhbFN0eWxlczogbmV3TGFzdElkZWFsU3R5bGVzLFxuICAgICAgICBsYXN0SWRlYWxWZWxvY2l0aWVzOiBuZXdMYXN0SWRlYWxWZWxvY2l0aWVzLFxuICAgICAgICBtZXJnZWRQcm9wc1N0eWxlczogbmV3TWVyZ2VkUHJvcHNTdHlsZXNcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gbnVsbDtcblxuICAgICAgX3RoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByZXZUaW1lID0gX3BlcmZvcm1hbmNlTm93MlsnZGVmYXVsdCddKCk7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbklmTmVjZXNzYXJ5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnVucmVhZFByb3BTdHlsZXMpIHtcbiAgICAgIC8vIHByZXZpb3VzIHByb3BzIGhhdmVuJ3QgaGFkIHRoZSBjaGFuY2UgdG8gYmUgc2V0IHlldDsgc2V0IHRoZW0gaGVyZVxuICAgICAgdGhpcy5jbGVhclVucmVhZFByb3BTdHlsZSh0aGlzLnVucmVhZFByb3BTdHlsZXMpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcHMuc3R5bGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICB0aGlzLnVucmVhZFByb3BTdHlsZXMgPSBwcm9wcy5zdHlsZXMocmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5sYXN0SWRlYWxTdHlsZXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bnJlYWRQcm9wU3R5bGVzID0gcHJvcHMuc3R5bGVzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFuaW1hdGlvbklEID09IG51bGwpIHtcbiAgICAgIHRoaXMucHJldlRpbWUgPSBfcGVyZm9ybWFuY2VOb3cyWydkZWZhdWx0J10oKTtcbiAgICAgIHRoaXMuc3RhcnRBbmltYXRpb25JZk5lY2Vzc2FyeSgpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSUQgIT0gbnVsbCkge1xuICAgICAgX3JhZjJbJ2RlZmF1bHQnXS5jYW5jZWwodGhpcy5hbmltYXRpb25JRCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklEID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGh5ZHJhdGVkU3R5bGVzID0gcmVoeWRyYXRlU3R5bGVzKHRoaXMuc3RhdGUubWVyZ2VkUHJvcHNTdHlsZXMsIHRoaXMudW5yZWFkUHJvcFN0eWxlcywgdGhpcy5zdGF0ZS5jdXJyZW50U3R5bGVzKTtcbiAgICB2YXIgcmVuZGVyZWRDaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW4oaHlkcmF0ZWRTdHlsZXMpO1xuICAgIHJldHVybiByZW5kZXJlZENoaWxkcmVuICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHJlbmRlcmVkQ2hpbGRyZW4pO1xuICB9XG59KTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gVHJhbnNpdGlvbk1vdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG4vLyBsaXN0IG9mIHN0eWxlcywgZWFjaCBjb250YWluaW5nIGludGVycG9sYXRpbmcgdmFsdWVzLiBQYXJ0IG9mIHdoYXQncyBwYXNzZWRcbi8vIHRvIGNoaWxkcmVuIGZ1bmN0aW9uLiBOb3RpY2UgdGhhdCB0aGlzIGlzXG4vLyBBcnJheTxBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3Q+LCB3aXRob3V0IHRoZSB3cmFwcGVyIHRoYXQgaXMge2tleTogLi4uLFxuLy8gZGF0YTogLi4uIHN0eWxlOiBBY3R1YWxJbnRlcnBvbGF0aW5nU3R5bGVPYmplY3R9LiBPbmx5IG1lcmdlZFByb3BzU3R5bGVzXG4vLyBjb250YWlucyB0aGUga2V5ICYgZGF0YSBpbmZvIChzbyB0aGF0IHdlIG9ubHkgaGF2ZSBhIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGhcbi8vIGZvciB0aGVzZSwgYW5kIHRvIHNhdmUgc3BhY2UpLiBDaGVjayB0aGUgY29tbWVudCBmb3IgYHJlaHlkcmF0ZVN0eWxlc2AgdG9cbi8vIHNlZSBob3cgd2UgcmVnZW5lcmF0ZSB0aGUgZW50aXJldHkgb2Ygd2hhdCdzIHBhc3NlZCB0byBjaGlsZHJlbiBmdW5jdGlvblxuXG4vLyB0aGUgYXJyYXkgdGhhdCBrZWVwcyB0cmFjayBvZiBjdXJyZW50bHkgcmVuZGVyZWQgc3R1ZmYhIEluY2x1ZGluZyBzdHVmZlxuLy8gdGhhdCB5b3UndmUgdW5tb3VudGVkIGJ1dCB0aGF0J3Mgc3RpbGwgYW5pbWF0aW5nLiBUaGlzIGlzIHdoZXJlIGl0IGxpdmVzIiwiXG5cbi8vIGN1cnJlbnRseSB1c2VkIHRvIGluaXRpYXRlIHRoZSB2ZWxvY2l0eSBzdHlsZSBvYmplY3QgdG8gMFxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWFwVG9aZXJvO1xuXG5mdW5jdGlvbiBtYXBUb1plcm8ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0W2tleV0gPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gY29yZSBrZXlzIG1lcmdpbmcgYWxnb3JpdGhtLiBJZiBwcmV2aW91cyByZW5kZXIncyBrZXlzIGFyZSBbYSwgYl0sIGFuZCB0aGVcbi8vIG5leHQgcmVuZGVyJ3MgW2MsIGIsIGRdLCB3aGF0J3MgdGhlIGZpbmFsIG1lcmdlZCBrZXlzIGFuZCBvcmRlcmluZz9cblxuLy8gLSBjIGFuZCBhIG11c3QgYm90aCBiZSBiZWZvcmUgYlxuLy8gLSBiIGJlZm9yZSBkXG4vLyAtIG9yZGVyaW5nIGJldHdlZW4gYSBhbmQgYyBhbWJpZ3VvdXNcblxuLy8gdGhpcyByZWR1Y2VzIHRvIG1lcmdpbmcgdHdvIHBhcnRpYWxseSBvcmRlcmVkIGxpc3RzIChlLmcuIGxpc3RzIHdoZXJlIG5vdFxuLy8gZXZlcnkgaXRlbSBoYXMgYSBkZWZpbml0ZSBvcmRlcmluZywgbGlrZSBjb21wYXJpbmcgYSBhbmQgYyBhYm92ZSkuIEZvciB0aGVcbi8vIGFtYmlndW91cyBvcmRlcmluZyB3ZSBkZXRlcm1pbmlzdGljYWxseSBjaG9vc2UgdG8gcGxhY2UgdGhlIG5leHQgcmVuZGVyJ3Ncbi8vIGl0ZW0gYWZ0ZXIgdGhlIHByZXZpb3VzJzsgc28gYyBhZnRlciBhXG5cbi8vIHRoaXMgaXMgY2FsbGVkIGEgdG9wb2xvZ2ljYWwgc29ydGluZy4gRXhjZXB0IHRoZSBleGlzdGluZyBhbGdvcml0aG1zIGRvbid0XG4vLyB3b3JrIHdlbGwgd2l0aCBqcyBiYyBvZiB0aGUgYW1vdW50IG9mIGFsbG9jYXRpb24sIGFuZCBpc24ndCBvcHRpbWl6ZWQgZm9yIG91clxuLy8gY3VycmVudCB1c2UtY2FzZSBiYyB0aGUgcnVudGltZSBpcyBsaW5lYXIgaW4gdGVybXMgb2YgZWRnZXMgKHNlZSB3aWtpIGZvclxuLy8gbWVhbmluZyksIHdoaWNoIGlzIGh1Z2Ugd2hlbiB0d28gbGlzdHMgaGF2ZSBtYW55IGNvbW1vbiBlbGVtZW50c1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gbWVyZ2VEaWZmO1xuXG5mdW5jdGlvbiBtZXJnZURpZmYocHJldiwgbmV4dCwgb25SZW1vdmUpIHtcbiAgLy8gYm9va2tlZXBpbmcgZm9yIGVhc2llciBhY2Nlc3Mgb2YgYSBrZXkncyBpbmRleCBiZWxvdy4gVGhpcyBpcyAyIGFsbG9jYXRpb25zICtcbiAgLy8gcG90ZW50aWFsbHkgdHJpZ2dlcmluZyBjaHJvbWUgaGFzaCBtYXAgbW9kZSBmb3Igb2JqcyAoc28gaXQgbWlnaHQgYmUgZmFzdGVyXG5cbiAgdmFyIHByZXZLZXlJbmRleCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZXYubGVuZ3RoOyBpKyspIHtcbiAgICBwcmV2S2V5SW5kZXhbcHJldltpXS5rZXldID0gaTtcbiAgfVxuICB2YXIgbmV4dEtleUluZGV4ID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIG5leHRLZXlJbmRleFtuZXh0W2ldLmtleV0gPSBpO1xuICB9XG5cbiAgLy8gZmlyc3QsIGFuIG92ZXJseSBlbGFib3JhdGUgd2F5IG9mIG1lcmdpbmcgcHJldiBhbmQgbmV4dCwgZWxpbWluYXRpbmdcbiAgLy8gZHVwbGljYXRlcyAoaW4gdGVybXMgb2Yga2V5cykuIElmIHRoZXJlJ3MgZHVwZSwga2VlcCB0aGUgaXRlbSBpbiBuZXh0KS5cbiAgLy8gVGhpcyB3YXkgb2Ygd3JpdGluZyBpdCBzYXZlcyBhbGxvY2F0aW9uc1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIHJldFtpXSA9IG5leHRbaV07XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFuZXh0S2V5SW5kZXguaGFzT3duUHJvcGVydHkocHJldltpXS5rZXkpKSB7XG4gICAgICAvLyB0aGlzIGlzIGNhbGxlZCBteSBUTSdzIGBtZXJnZUFuZFN5bmNgLCB3aGljaCBjYWxscyB3aWxsTGVhdmUuIFdlIGRvbid0XG4gICAgICAvLyBtZXJnZSBpbiBrZXlzIHRoYXQgdGhlIHVzZXIgZGVzaXJlcyB0byBraWxsXG4gICAgICB2YXIgZmlsbCA9IG9uUmVtb3ZlKGksIHByZXZbaV0pO1xuICAgICAgaWYgKGZpbGwgIT0gbnVsbCkge1xuICAgICAgICByZXQucHVzaChmaWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgYWxsIHRoZSBpdGVtcyBhbGwgcHJlc2VudC4gQ29yZSBzb3J0aW5nIGxvZ2ljIHRvIGhhdmUgdGhlIHJpZ2h0IG9yZGVyXG4gIHJldHVybiByZXQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHZhciBuZXh0T3JkZXJBID0gbmV4dEtleUluZGV4W2Eua2V5XTtcbiAgICB2YXIgbmV4dE9yZGVyQiA9IG5leHRLZXlJbmRleFtiLmtleV07XG4gICAgdmFyIHByZXZPcmRlckEgPSBwcmV2S2V5SW5kZXhbYS5rZXldO1xuICAgIHZhciBwcmV2T3JkZXJCID0gcHJldktleUluZGV4W2Iua2V5XTtcblxuICAgIGlmIChuZXh0T3JkZXJBICE9IG51bGwgJiYgbmV4dE9yZGVyQiAhPSBudWxsKSB7XG4gICAgICAvLyBib3RoIGtleXMgaW4gbmV4dFxuICAgICAgcmV0dXJuIG5leHRLZXlJbmRleFthLmtleV0gLSBuZXh0S2V5SW5kZXhbYi5rZXldO1xuICAgIH0gZWxzZSBpZiAocHJldk9yZGVyQSAhPSBudWxsICYmIHByZXZPcmRlckIgIT0gbnVsbCkge1xuICAgICAgLy8gYm90aCBrZXlzIGluIHByZXZcbiAgICAgIHJldHVybiBwcmV2S2V5SW5kZXhbYS5rZXldIC0gcHJldktleUluZGV4W2Iua2V5XTtcbiAgICB9IGVsc2UgaWYgKG5leHRPcmRlckEgIT0gbnVsbCkge1xuICAgICAgLy8ga2V5IGEgaW4gbmV4dCwga2V5IGIgaW4gcHJldlxuXG4gICAgICAvLyBob3cgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBiZXR3ZWVuIGEgYW5kIGI/IFdlIGZpbmQgYSBcInBpdm90XCIgKHRlcm1cbiAgICAgIC8vIGFidXNlKSwgYSBrZXkgcHJlc2VudCBpbiBib3RoIHByZXYgYW5kIG5leHQsIHRoYXQgaXMgc2FuZHdpY2hlZCBiZXR3ZWVuXG4gICAgICAvLyBhIGFuZCBiLiBJbiB0aGUgY29udGV4dCBvZiBvdXIgYWJvdmUgZXhhbXBsZSwgaWYgd2UncmUgY29tcGFyaW5nIGEgYW5kXG4gICAgICAvLyBkLCBiJ3MgKHRoZSBvbmx5KSBwaXZvdFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgICBpZiAoIXByZXZLZXlJbmRleC5oYXNPd25Qcm9wZXJ0eShwaXZvdCkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXh0T3JkZXJBIDwgbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCID4gcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJBID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJCIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBwbHVnZ2FibGUuIGRlZmF1bHQgdG86IG5leHQgYmlnZ2VyIHRoYW4gcHJldlxuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIC8vIHByZXZPcmRlckEsIG5leHRPcmRlckJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwaXZvdCA9IG5leHRbaV0ua2V5O1xuICAgICAgaWYgKCFwcmV2S2V5SW5kZXguaGFzT3duUHJvcGVydHkocGl2b3QpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKG5leHRPcmRlckIgPCBuZXh0S2V5SW5kZXhbcGl2b3RdICYmIHByZXZPcmRlckEgPiBwcmV2S2V5SW5kZXhbcGl2b3RdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmIChuZXh0T3JkZXJCID4gbmV4dEtleUluZGV4W3Bpdm90XSAmJiBwcmV2T3JkZXJBIDwgcHJldktleUluZGV4W3Bpdm90XSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHBsdWdnYWJsZS4gZGVmYXVsdCB0bzogbmV4dCBiaWdnZXIgdGhhbiBwcmV2XG4gICAgcmV0dXJuIC0xO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4vLyB0byBsb29wIHRocm91Z2ggYW5kIGZpbmQgYSBrZXkncyBpbmRleCBlYWNoIHRpbWUpLCBidXQgSSBubyBsb25nZXIgY2FyZSIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB7XG4gIG5vV29iYmxlOiB7IHN0aWZmbmVzczogMTcwLCBkYW1waW5nOiAyNiB9LCAvLyB0aGUgZGVmYXVsdCwgaWYgbm90aGluZyBwcm92aWRlZFxuICBnZW50bGU6IHsgc3RpZmZuZXNzOiAxMjAsIGRhbXBpbmc6IDE0IH0sXG4gIHdvYmJseTogeyBzdGlmZm5lc3M6IDE4MCwgZGFtcGluZzogMTIgfSxcbiAgc3RpZmY6IHsgc3RpZmZuZXNzOiAyMTAsIGRhbXBpbmc6IDIwIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqWydkZWZhdWx0J10gOiBvYmo7IH1cblxudmFyIF9Nb3Rpb24gPSByZXF1aXJlKCcuL01vdGlvbicpO1xuXG5leHBvcnRzLk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfTW90aW9uKTtcblxudmFyIF9TdGFnZ2VyZWRNb3Rpb24gPSByZXF1aXJlKCcuL1N0YWdnZXJlZE1vdGlvbicpO1xuXG5leHBvcnRzLlN0YWdnZXJlZE1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfU3RhZ2dlcmVkTW90aW9uKTtcblxudmFyIF9UcmFuc2l0aW9uTW90aW9uID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9uTW90aW9uJyk7XG5cbmV4cG9ydHMuVHJhbnNpdGlvbk1vdGlvbiA9IF9pbnRlcm9wUmVxdWlyZShfVHJhbnNpdGlvbk1vdGlvbik7XG5cbnZhciBfc3ByaW5nID0gcmVxdWlyZSgnLi9zcHJpbmcnKTtcblxuZXhwb3J0cy5zcHJpbmcgPSBfaW50ZXJvcFJlcXVpcmUoX3NwcmluZyk7XG5cbnZhciBfcHJlc2V0cyA9IHJlcXVpcmUoJy4vcHJlc2V0cycpO1xuXG5leHBvcnRzLnByZXNldHMgPSBfaW50ZXJvcFJlcXVpcmUoX3ByZXNldHMpO1xuXG4vLyBkZXByZWNhdGVkLCBkdW1teSB3YXJuaW5nIGZ1bmN0aW9uXG5cbnZhciBfcmVvcmRlcktleXMgPSByZXF1aXJlKCcuL3Jlb3JkZXJLZXlzJyk7XG5cbmV4cG9ydHMucmVvcmRlcktleXMgPSBfaW50ZXJvcFJlcXVpcmUoX3Jlb3JkZXJLZXlzKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSByZW9yZGVyS2V5cztcblxudmFyIGhhc1dhcm5lZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiByZW9yZGVyS2V5cygpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgaWYgKCFoYXNXYXJuZWQpIHtcbiAgICAgIGhhc1dhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCdgcmVvcmRlcktleXNgIGhhcyBiZWVuIHJlbW92ZWQsIHNpbmNlIGl0IGlzIG5vIGxvbmdlciBuZWVkZWQgZm9yIFRyYW5zaXRpb25Nb3Rpb25cXCdzIG5ldyBzdHlsZXMgYXJyYXkgQVBJLicpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gdXNhZ2UgYXNzdW1wdGlvbjogY3VycmVudFN0eWxlIHZhbHVlcyBoYXZlIGFscmVhZHkgYmVlbiByZW5kZXJlZCBidXQgaXQgc2F5c1xuLy8gbm90aGluZyBvZiB3aGV0aGVyIGN1cnJlbnRTdHlsZSBpcyBzdGFsZSAoc2VlIHVucmVhZFByb3BTdHlsZSlcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHNob3VsZFN0b3BBbmltYXRpb247XG5cbmZ1bmN0aW9uIHNob3VsZFN0b3BBbmltYXRpb24oY3VycmVudFN0eWxlLCBzdHlsZSwgY3VycmVudFZlbG9jaXR5KSB7XG4gIGZvciAodmFyIGtleSBpbiBzdHlsZSkge1xuICAgIGlmICghc3R5bGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRWZWxvY2l0eVtrZXldICE9PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHN0eWxlVmFsdWUgPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gICAgLy8gc3RlcHBlciB3aWxsIGhhdmUgYWxyZWFkeSB0YWtlbiBjYXJlIG9mIHJvdW5kaW5nIHByZWNpc2lvbiBlcnJvcnMsIHNvXG4gICAgLy8gd29uJ3QgaGF2ZSBzdWNoIHRoaW5nIGFzIDAuOTk5OSAhPT09IDFcbiAgICBpZiAoY3VycmVudFN0eWxlW2tleV0gIT09IHN0eWxlVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBzcHJpbmc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9wcmVzZXRzID0gcmVxdWlyZSgnLi9wcmVzZXRzJyk7XG5cbnZhciBfcHJlc2V0czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVzZXRzKTtcblxudmFyIGRlZmF1bHRDb25maWcgPSBfZXh0ZW5kcyh7fSwgX3ByZXNldHMyWydkZWZhdWx0J10ubm9Xb2JibGUsIHtcbiAgcHJlY2lzaW9uOiAwLjAxXG59KTtcblxuZnVuY3Rpb24gc3ByaW5nKHZhbCwgY29uZmlnKSB7XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnLCB7IHZhbDogdmFsIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcblxuLy8gc3RlcHBlciBpcyB1c2VkIGEgbG90LiBTYXZlcyBhbGxvY2F0aW9uIHRvIHJldHVybiB0aGUgc2FtZSBhcnJheSB3cmFwcGVyLlxuLy8gVGhpcyBpcyBmaW5lIGFuZCBkYW5nZXItZnJlZSBhZ2FpbnN0IG11dGF0aW9ucyBiZWNhdXNlIHRoZSBjYWxsc2l0ZVxuLy8gaW1tZWRpYXRlbHkgZGVzdHJ1Y3R1cmVzIGl0IGFuZCBnZXRzIHRoZSBudW1iZXJzIGluc2lkZSB3aXRob3V0IHBhc3NpbmcgdGhlXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc3RlcHBlcjtcblxudmFyIHJldXNlZFR1cGxlID0gW107XG5cbmZ1bmN0aW9uIHN0ZXBwZXIoc2Vjb25kUGVyRnJhbWUsIHgsIHYsIGRlc3RYLCBrLCBiLCBwcmVjaXNpb24pIHtcbiAgLy8gU3ByaW5nIHN0aWZmbmVzcywgaW4ga2cgLyBzXjJcblxuICAvLyBmb3IgYW5pbWF0aW9ucywgZGVzdFggaXMgcmVhbGx5IHNwcmluZyBsZW5ndGggKHNwcmluZyBhdCByZXN0KS4gaW5pdGlhbFxuICAvLyBwb3NpdGlvbiBpcyBjb25zaWRlcmVkIGFzIHRoZSBzdHJldGNoZWQvY29tcHJlc3NlZCBwb3NpdGlvbiBvZiBhIHNwcmluZ1xuICB2YXIgRnNwcmluZyA9IC1rICogKHggLSBkZXN0WCk7XG5cbiAgLy8gRGFtcGluZywgaW4ga2cgLyBzXG4gIHZhciBGZGFtcGVyID0gLWIgKiB2O1xuXG4gIC8vIHVzdWFsbHkgd2UgcHV0IG1hc3MgaGVyZSwgYnV0IGZvciBhbmltYXRpb24gcHVycG9zZXMsIHNwZWNpZnlpbmcgbWFzcyBpcyBhXG4gIC8vIGJpdCByZWR1bmRhbnQuIHlvdSBjb3VsZCBzaW1wbHkgYWRqdXN0IGsgYW5kIGIgYWNjb3JkaW5nbHlcbiAgLy8gbGV0IGEgPSAoRnNwcmluZyArIEZkYW1wZXIpIC8gbWFzcztcbiAgdmFyIGEgPSBGc3ByaW5nICsgRmRhbXBlcjtcblxuICB2YXIgbmV3ViA9IHYgKyBhICogc2Vjb25kUGVyRnJhbWU7XG4gIHZhciBuZXdYID0geCArIG5ld1YgKiBzZWNvbmRQZXJGcmFtZTtcblxuICBpZiAoTWF0aC5hYnMobmV3VikgPCBwcmVjaXNpb24gJiYgTWF0aC5hYnMobmV3WCAtIGRlc3RYKSA8IHByZWNpc2lvbikge1xuICAgIHJldXNlZFR1cGxlWzBdID0gZGVzdFg7XG4gICAgcmV1c2VkVHVwbGVbMV0gPSAwO1xuICAgIHJldHVybiByZXVzZWRUdXBsZTtcbiAgfVxuXG4gIHJldXNlZFR1cGxlWzBdID0gbmV3WDtcbiAgcmV1c2VkVHVwbGVbMV0gPSBuZXdWO1xuICByZXR1cm4gcmV1c2VkVHVwbGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG4vLyBhcnJheSByZWZlcmVuY2UgYXJvdW5kLiIsIlxuLy8gdHVybiB7eDoge3ZhbDogMSwgc3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSwgeTogMn0gZ2VuZXJhdGVkIGJ5XG4vLyBge3g6IHNwcmluZygxLCB7c3RpZmZuZXNzOiAxLCBkYW1waW5nOiAyfSksIHk6IDJ9YCBpbnRvIHt4OiAxLCB5OiAyfVxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBzdHJpcFN0eWxlO1xuXG5mdW5jdGlvbiBzdHJpcFN0eWxlKHN0eWxlKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgaWYgKCFzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSB0eXBlb2Ygc3R5bGVba2V5XSA9PT0gJ251bWJlcicgPyBzdHlsZVtrZXldIDogc3R5bGVba2V5XS52YWw7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLyplc2xpbnQtZGlzYWJsZSByZWFjdC9wcm9wLXR5cGVzICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3dhcm5pbmcgPSByZXF1aXJlKCd3YXJuaW5nJyk7XG5cbnZhciBfd2FybmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93YXJuaW5nKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYk1vdW50YWJsZSA9IHJlcXVpcmUoJ3JlYWN0LXByb3AtdHlwZXMvbGliL21vdW50YWJsZScpO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYkVsZW1lbnRUeXBlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvZWxlbWVudFR5cGUnKTtcblxudmFyIF9yZWFjdFByb3BUeXBlc0xpYkVsZW1lbnRUeXBlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0UHJvcFR5cGVzTGliRWxlbWVudFR5cGUpO1xuXG52YXIgX1BvcnRhbCA9IHJlcXVpcmUoJy4vUG9ydGFsJyk7XG5cbnZhciBfUG9ydGFsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BvcnRhbCk7XG5cbnZhciBfTW9kYWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9Nb2RhbE1hbmFnZXInKTtcblxudmFyIF9Nb2RhbE1hbmFnZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTW9kYWxNYW5hZ2VyKTtcblxudmFyIF91dGlsc093bmVyRG9jdW1lbnQgPSByZXF1aXJlKCcuL3V0aWxzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF91dGlsc093bmVyRG9jdW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNPd25lckRvY3VtZW50KTtcblxudmFyIF91dGlsc0FkZEV2ZW50TGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEV2ZW50TGlzdGVuZXInKTtcblxudmFyIF91dGlsc0FkZEV2ZW50TGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNBZGRFdmVudExpc3RlbmVyKTtcblxudmFyIF91dGlsc0FkZEZvY3VzTGlzdGVuZXIgPSByZXF1aXJlKCcuL3V0aWxzL2FkZEZvY3VzTGlzdGVuZXInKTtcblxudmFyIF91dGlsc0FkZEZvY3VzTGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNBZGRGb2N1c0xpc3RlbmVyKTtcblxudmFyIF9kb21IZWxwZXJzVXRpbEluRE9NID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9pbkRPTScpO1xuXG52YXIgX2RvbUhlbHBlcnNVdGlsSW5ET00yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc1V0aWxJbkRPTSk7XG5cbnZhciBfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKCdkb20taGVscGVycy9hY3RpdmVFbGVtZW50Jyk7XG5cbnZhciBfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0FjdGl2ZUVsZW1lbnQpO1xuXG52YXIgX2RvbUhlbHBlcnNRdWVyeUNvbnRhaW5zID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvcXVlcnkvY29udGFpbnMnKTtcblxudmFyIF9kb21IZWxwZXJzUXVlcnlDb250YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzUXVlcnlDb250YWlucyk7XG5cbnZhciBfdXRpbHNHZXRDb250YWluZXIgPSByZXF1aXJlKCcuL3V0aWxzL2dldENvbnRhaW5lcicpO1xuXG52YXIgX3V0aWxzR2V0Q29udGFpbmVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzR2V0Q29udGFpbmVyKTtcblxudmFyIG1vZGFsTWFuYWdlciA9IG5ldyBfTW9kYWxNYW5hZ2VyMlsnZGVmYXVsdCddKCk7XG5cbi8qKlxuICogTG92ZSB0aGVtIG9yIGhhdGUgdGhlbSwgYDxNb2RhbC8+YCBwcm92aWRlcyBhIHNvbGlkIGZvdW5kYXRpb24gZm9yIGNyZWF0aW5nIGRpYWxvZ3MsIGxpZ2h0Ym94ZXMsIG9yIHdoYXRldmVyIGVsc2UuXG4gKiBUaGUgTW9kYWwgY29tcG9uZW50IHJlbmRlcnMgaXRzIGBjaGlsZHJlbmAgbm9kZSBpbiBmcm9udCBvZiBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAqXG4gKiBUaGUgTW9kYWwgb2ZmZXJzIGEgZmV3IGhlbHBmdWwgZmVhdHVyZXMgb3ZlciB1c2luZyBqdXN0IGEgYDxQb3J0YWwvPmAgY29tcG9uZW50IGFuZCBzb21lIHN0eWxlczpcbiAqXG4gKiAtIE1hbmFnZXMgZGlhbG9nIHN0YWNraW5nIHdoZW4gb25lLWF0LWEtdGltZSBqdXN0IGlzbid0IGVub3VnaC5cbiAqIC0gQ3JlYXRlcyBhIGJhY2tkcm9wLCBmb3IgZGlzYWJsaW5nIGludGVyYWN0aW9uIGJlbG93IHRoZSBtb2RhbC5cbiAqIC0gSXQgcHJvcGVybHkgbWFuYWdlcyBmb2N1czsgbW92aW5nIHRvIHRoZSBtb2RhbCBjb250ZW50LCBhbmQga2VlcGluZyBpdCB0aGVyZSB1bnRpbCB0aGUgbW9kYWwgaXMgY2xvc2VkLlxuICogLSBJdCBkaXNhYmxlcyBzY3JvbGxpbmcgb2YgdGhlIHBhZ2UgY29udGVudCB3aGlsZSBvcGVuLlxuICogLSBBZGRzIHRoZSBhcHByb3ByaWF0ZSBBUklBIHJvbGVzIGFyZSBhdXRvbWF0aWNhbGx5LlxuICogLSBFYXNpbHkgcGx1Z2dhYmxlIGFuaW1hdGlvbnMgdmlhIGEgYDxUcmFuc2l0aW9uLz5gIGNvbXBvbmVudC5cbiAqXG4gKiBOb3RlIHRoYXQsIGluIHRoZSBzYW1lIHdheSB0aGUgYmFja2Ryb3AgZWxlbWVudCBwcmV2ZW50cyB1c2VycyBmcm9tIGNsaWNraW5nIG9yIGludGVyYWN0aW5nXG4gKiB3aXRoIHRoZSBwYWdlIGNvbnRlbnQgdW5kZXJuZWF0aCB0aGUgTW9kYWwsIFNjcmVlbiByZWFkZXJzIGFsc28gbmVlZCB0byBiZSBzaWduYWxlZCB0byBub3QgdG9cbiAqIGludGVyYWN0IHdpdGggcGFnZSBjb250ZW50IHdoaWxlIHRoZSBNb2RhbCBpcyBvcGVuLiBUbyBkbyB0aGlzLCB3ZSB1c2UgYSBjb21tb24gdGVjaG5pcXVlIG9mIGFwcGx5aW5nXG4gKiB0aGUgYGFyaWEtaGlkZGVuPSd0cnVlJ2AgYXR0cmlidXRlIHRvIHRoZSBub24tTW9kYWwgZWxlbWVudHMgaW4gdGhlIE1vZGFsIGBjb250YWluZXJgLiBUaGlzIG1lYW5zIHRoYXQgZm9yXG4gKiBhIE1vZGFsIHRvIGJlIHRydWx5IG1vZGFsLCBpdCBzaG91bGQgaGF2ZSBhIGBjb250YWluZXJgIHRoYXQgaXMgX291dHNpZGVfIHlvdXIgYXBwJ3NcbiAqIFJlYWN0IGhpZXJhcmNoeSAoc3VjaCBhcyB0aGUgZGVmYXVsdDogZG9jdW1lbnQuYm9keSkuXG4gKi9cbnZhciBNb2RhbCA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTW9kYWwnLFxuXG4gIHByb3BUeXBlczogX2V4dGVuZHMoe30sIF9Qb3J0YWwyWydkZWZhdWx0J10ucHJvcFR5cGVzLCB7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIE1vZGFsXG4gICAgICovXG4gICAgc2hvdzogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5ib29sLFxuXG4gICAgLyoqXG4gICAgICogQSBOb2RlLCBDb21wb25lbnQgaW5zdGFuY2UsIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBlaXRoZXIuIFRoZSBNb2RhbCBpcyBhcHBlbmRlZCB0byBpdCdzIGNvbnRhaW5lciBlbGVtZW50LlxuICAgICAqXG4gICAgICogRm9yIHRoZSBzYWtlIG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSBjb250YWluZXIgc2hvdWxkIHVzdWFsbHkgYmUgdGhlIGRvY3VtZW50IGJvZHksIHNvIHRoYXQgdGhlIHJlc3Qgb2YgdGhlXG4gICAgICogcGFnZSBjb250ZW50IGNhbiBiZSBwbGFjZWQgYmVoaW5kIGEgdmlydHVhbCBiYWNrZHJvcCBhcyB3ZWxsIGFzIGEgdmlzdWFsIG9uZS5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyWydkZWZhdWx0J10sIF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuY10pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBNb2RhbCBpcyBvcGVuaW5nLlxuICAgICAqL1xuICAgIG9uU2hvdzogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIGVpdGhlciB0aGUgYmFja2Ryb3AgaXMgY2xpY2tlZCwgb3IgdGhlIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAgICAgKlxuICAgICAqIFRoZSBgb25IaWRlYCBjYWxsYmFjayBvbmx5IHNpZ25hbHMgaW50ZW50IGZyb20gdGhlIE1vZGFsLFxuICAgICAqIHlvdSBtdXN0IGFjdHVhbGx5IHNldCB0aGUgYHNob3dgIHByb3AgdG8gYGZhbHNlYCBmb3IgdGhlIE1vZGFsIHRvIGNsb3NlLlxuICAgICAqL1xuICAgIG9uSGlkZTogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogSW5jbHVkZSBhIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZlR5cGUoW19yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCwgX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5vbmVPZihbJ3N0YXRpYyddKV0pLFxuXG4gICAgLyoqXG4gICAgICogQSBjYWxsYmFjayBmaXJlZCB3aGVuIHRoZSBlc2NhcGUga2V5LCBpZiBzcGVjaWZpZWQgaW4gYGtleWJvYXJkYCwgaXMgcHJlc3NlZC5cbiAgICAgKi9cbiAgICBvbkVzY2FwZUtleVVwOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIGNhbGxiYWNrIGZpcmVkIHdoZW4gdGhlIGJhY2tkcm9wLCBpZiBzcGVjaWZpZWQsIGlzIGNsaWNrZWQuXG4gICAgICovXG4gICAgb25CYWNrZHJvcENsaWNrOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBBIHN0eWxlIG9iamVjdCBmb3IgdGhlIGJhY2tkcm9wIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBiYWNrZHJvcFN0eWxlOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8qKlxuICAgICAqIEEgY3NzIGNsYXNzIG9yIGNsYXNzZXMgZm9yIHRoZSBiYWNrZHJvcCBjb21wb25lbnQuXG4gICAgICovXG4gICAgYmFja2Ryb3BDbGFzc05hbWU6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQSBjc3MgY2xhc3Mgb3Igc2V0IG9mIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgbW9kYWwgY29udGFpbmVyIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4sXG4gICAgICogYW5kIHJlbW92ZWQgd2hlbiBpdCBpcyBjbG9zZWQuXG4gICAgICovXG4gICAgY29udGFpbmVyQ2xhc3NOYW1lOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLnN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZFxuICAgICAqL1xuICAgIGtleWJvYXJkOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBBIGA8VHJhbnNpdGlvbi8+YCBjb21wb25lbnQgdG8gdXNlIGZvciB0aGUgZGlhbG9nIGFuZCBiYWNrZHJvcCBjb21wb25lbnRzLlxuICAgICAqL1xuICAgIHRyYW5zaXRpb246IF9yZWFjdFByb3BUeXBlc0xpYkVsZW1lbnRUeXBlMlsnZGVmYXVsdCddLFxuXG4gICAgLyoqXG4gICAgICogVGhlIGB0aW1lb3V0YCBvZiB0aGUgZGlhbG9nIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0XG4gICAgICogdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0OiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLm51bWJlcixcblxuICAgIC8qKlxuICAgICAqIFRoZSBgdGltZW91dGAgb2YgdGhlIGJhY2tkcm9wIHRyYW5zaXRpb24gaWYgc3BlY2lmaWVkLiBUaGlzIG51bWJlciBpcyB1c2VkIHRvXG4gICAgICogZW5zdXJlIHRoYXQgdHJhbnNpdGlvbiBjYWxsYmFja3MgYXJlIGFsd2F5cyBmaXJlZCwgZXZlbiBpZiBicm93c2VyIHRyYW5zaXRpb24gZXZlbnRzIGFyZSBjYW5jZWxlZC5cbiAgICAgKlxuICAgICAqIFNlZSB0aGUgVHJhbnNpdGlvbiBgdGltZW91dGAgcHJvcCBmb3IgbW9yZSBpbmZvbWF0aW9uLlxuICAgICAqL1xuICAgIGJhY2tkcm9wVHJhbnNpdGlvblRpbWVvdXQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMubnVtYmVyLFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBgdHJ1ZWAgVGhlIG1vZGFsIHdpbGwgYXV0b21hdGljYWxseSBzaGlmdCBmb2N1cyB0byBpdHNlbGYgd2hlbiBpdCBvcGVucywgYW5kXG4gICAgICogcmVwbGFjZSBpdCB0byB0aGUgbGFzdCBmb2N1c2VkIGVsZW1lbnQgd2hlbiBpdCBjbG9zZXMuIFRoaXMgYWxzb1xuICAgICAqIHdvcmtzIGNvcnJlY3RseSB3aXRoIGFueSBNb2RhbCBjaGlsZHJlbiB0aGF0IGhhdmUgdGhlIGBhdXRvRm9jdXNgIHByb3AuXG4gICAgICpcbiAgICAgKiBHZW5lcmFsbHkgdGhpcyBzaG91bGQgbmV2ZXIgYmUgc2V0IHRvIGBmYWxzZWAgYXMgaXQgbWFrZXMgdGhlIE1vZGFsIGxlc3NcbiAgICAgKiBhY2Nlc3NpYmxlIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIGxpa2Ugc2NyZWVuIHJlYWRlcnMuXG4gICAgICovXG4gICAgYXV0b0ZvY3VzOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmJvb2wsXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGB0cnVlYCBUaGUgbW9kYWwgd2lsbCBwcmV2ZW50IGZvY3VzIGZyb20gbGVhdmluZyB0aGUgTW9kYWwgd2hpbGUgb3Blbi5cbiAgICAgKlxuICAgICAqIEdlbmVyYWxseSB0aGlzIHNob3VsZCBuZXZlciBiZSBzZXQgdG8gYGZhbHNlYCBhcyBpdCBtYWtlcyB0aGUgTW9kYWwgbGVzc1xuICAgICAqIGFjY2Vzc2libGUgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ2llcywgbGlrZSBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBlbmZvcmNlRm9jdXM6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuYm9vbCxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGJlZm9yZSB0aGUgTW9kYWwgdHJhbnNpdGlvbnMgaW5cbiAgICAgKi9cbiAgICBvbkVudGVyOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhcyB0aGUgTW9kYWwgYmVnaW5zIHRvIHRyYW5zaXRpb24gaW5cbiAgICAgKi9cbiAgICBvbkVudGVyaW5nOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmMsXG5cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgTW9kYWwgZmluaXNoZXMgdHJhbnNpdGlvbmluZyBpblxuICAgICAqL1xuICAgIG9uRW50ZXJlZDogX3JlYWN0MlsnZGVmYXVsdCddLlByb3BUeXBlcy5mdW5jLFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSBNb2RhbCB0cmFuc2l0aW9ucyBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXQ6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFzIHRoZSBNb2RhbCBiZWdpbnMgdG8gdHJhbnNpdGlvbiBvdXRcbiAgICAgKi9cbiAgICBvbkV4aXRpbmc6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuYyxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBNb2RhbCBmaW5pc2hlcyB0cmFuc2l0aW9uaW5nIG91dFxuICAgICAqL1xuICAgIG9uRXhpdGVkOiBfcmVhY3QyWydkZWZhdWx0J10uUHJvcFR5cGVzLmZ1bmNcblxuICB9KSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBzaG93OiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICBhdXRvRm9jdXM6IHRydWUsXG4gICAgICBlbmZvcmNlRm9jdXM6IHRydWUsXG4gICAgICBvbkhpZGU6IG5vb3BcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IGV4aXRlZDogIXRoaXMucHJvcHMuc2hvdyB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciBjaGlsZHJlbiA9IF9wcm9wcy5jaGlsZHJlbjtcbiAgICB2YXIgVHJhbnNpdGlvbiA9IF9wcm9wcy50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcCA9IF9wcm9wcy5iYWNrZHJvcDtcbiAgICB2YXIgZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQgPSBfcHJvcHMuZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQ7XG5cbiAgICB2YXIgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3Byb3BzLCBbJ2NoaWxkcmVuJywgJ3RyYW5zaXRpb24nLCAnYmFja2Ryb3AnLCAnZGlhbG9nVHJhbnNpdGlvblRpbWVvdXQnXSk7XG5cbiAgICB2YXIgb25FeGl0ID0gcHJvcHMub25FeGl0O1xuICAgIHZhciBvbkV4aXRpbmcgPSBwcm9wcy5vbkV4aXRpbmc7XG4gICAgdmFyIG9uRW50ZXIgPSBwcm9wcy5vbkVudGVyO1xuICAgIHZhciBvbkVudGVyaW5nID0gcHJvcHMub25FbnRlcmluZztcbiAgICB2YXIgb25FbnRlcmVkID0gcHJvcHMub25FbnRlcmVkO1xuXG4gICAgdmFyIHNob3cgPSAhIXByb3BzLnNob3c7XG4gICAgdmFyIGRpYWxvZyA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgdmFyIG1vdW50TW9kYWwgPSBzaG93IHx8IFRyYW5zaXRpb24gJiYgIXRoaXMuc3RhdGUuZXhpdGVkO1xuXG4gICAgaWYgKCFtb3VudE1vZGFsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgX2RpYWxvZyRwcm9wcyA9IGRpYWxvZy5wcm9wcztcbiAgICB2YXIgcm9sZSA9IF9kaWFsb2ckcHJvcHMucm9sZTtcbiAgICB2YXIgdGFiSW5kZXggPSBfZGlhbG9nJHByb3BzLnRhYkluZGV4O1xuXG4gICAgaWYgKHJvbGUgPT09IHVuZGVmaW5lZCB8fCB0YWJJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkaWFsb2cgPSBfcmVhY3QuY2xvbmVFbGVtZW50KGRpYWxvZywge1xuICAgICAgICByb2xlOiByb2xlID09PSB1bmRlZmluZWQgPyAnZG9jdW1lbnQnIDogcm9sZSxcbiAgICAgICAgdGFiSW5kZXg6IHRhYkluZGV4ID09IG51bGwgPyAnLTEnIDogdGFiSW5kZXhcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChUcmFuc2l0aW9uKSB7XG4gICAgICBkaWFsb2cgPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgVHJhbnNpdGlvbixcbiAgICAgICAge1xuICAgICAgICAgIHRyYW5zaXRpb25BcHBlYXI6IHRydWUsXG4gICAgICAgICAgdW5tb3VudE9uRXhpdDogdHJ1ZSxcbiAgICAgICAgICAnaW4nOiBzaG93LFxuICAgICAgICAgIHRpbWVvdXQ6IGRpYWxvZ1RyYW5zaXRpb25UaW1lb3V0LFxuICAgICAgICAgIG9uRXhpdDogb25FeGl0LFxuICAgICAgICAgIG9uRXhpdGluZzogb25FeGl0aW5nLFxuICAgICAgICAgIG9uRXhpdGVkOiB0aGlzLmhhbmRsZUhpZGRlbixcbiAgICAgICAgICBvbkVudGVyOiBvbkVudGVyLFxuICAgICAgICAgIG9uRW50ZXJpbmc6IG9uRW50ZXJpbmcsXG4gICAgICAgICAgb25FbnRlcmVkOiBvbkVudGVyZWRcbiAgICAgICAgfSxcbiAgICAgICAgZGlhbG9nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgIF9Qb3J0YWwyWydkZWZhdWx0J10sXG4gICAgICB7XG4gICAgICAgIHJlZjogdGhpcy5zZXRNb3VudE5vZGUsXG4gICAgICAgIGNvbnRhaW5lcjogcHJvcHMuY29udGFpbmVyXG4gICAgICB9LFxuICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgcmVmOiAnbW9kYWwnLFxuICAgICAgICAgIHJvbGU6IHByb3BzLnJvbGUgfHwgJ2RpYWxvZycsXG4gICAgICAgICAgc3R5bGU6IHByb3BzLnN0eWxlLFxuICAgICAgICAgIGNsYXNzTmFtZTogcHJvcHMuY2xhc3NOYW1lXG4gICAgICAgIH0sXG4gICAgICAgIGJhY2tkcm9wICYmIHRoaXMucmVuZGVyQmFja2Ryb3AoKSxcbiAgICAgICAgZGlhbG9nXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICByZW5kZXJCYWNrZHJvcDogZnVuY3Rpb24gcmVuZGVyQmFja2Ryb3AoKSB7XG4gICAgdmFyIF9wcm9wczIgPSB0aGlzLnByb3BzO1xuICAgIHZhciBUcmFuc2l0aW9uID0gX3Byb3BzMi50cmFuc2l0aW9uO1xuICAgIHZhciBiYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0ID0gX3Byb3BzMi5iYWNrZHJvcFRyYW5zaXRpb25UaW1lb3V0O1xuXG4gICAgdmFyIGJhY2tkcm9wID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgcmVmOiAnYmFja2Ryb3AnLFxuICAgICAgc3R5bGU6IHRoaXMucHJvcHMuYmFja2Ryb3BTdHlsZSxcbiAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5iYWNrZHJvcENsYXNzTmFtZSxcbiAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQmFja2Ryb3BDbGlja1xuICAgIH0pO1xuXG4gICAgaWYgKFRyYW5zaXRpb24pIHtcbiAgICAgIGJhY2tkcm9wID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFRyYW5zaXRpb24sXG4gICAgICAgIHsgdHJhbnNpdGlvbkFwcGVhcjogdHJ1ZSxcbiAgICAgICAgICAnaW4nOiB0aGlzLnByb3BzLnNob3csXG4gICAgICAgICAgdGltZW91dDogYmFja2Ryb3BUcmFuc2l0aW9uVGltZW91dFxuICAgICAgICB9LFxuICAgICAgICBiYWNrZHJvcFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFja2Ryb3A7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IGZhbHNlIH0pO1xuICAgIH0gZWxzZSBpZiAoIW5leHRQcm9wcy50cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgbGV0IGhhbmRsZUhpZGRlbiB0YWtlIGNhcmUgb2YgbWFya2luZyBleGl0ZWQuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXhpdGVkOiB0cnVlIH0pO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgIGlmIChuZXh0UHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5jaGVja0ZvckZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICB2YXIgdHJhbnNpdGlvbiA9IHRoaXMucHJvcHMudHJhbnNpdGlvbjtcblxuICAgIGlmIChwcmV2UHJvcHMuc2hvdyAmJiAhdGhpcy5wcm9wcy5zaG93ICYmICF0cmFuc2l0aW9uKSB7XG4gICAgICAvLyBPdGhlcndpc2UgaGFuZGxlSGlkZGVuIHdpbGwgY2FsbCB0aGlzLlxuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2UgaWYgKCFwcmV2UHJvcHMuc2hvdyAmJiB0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB2YXIgX3Byb3BzMyA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHNob3cgPSBfcHJvcHMzLnNob3c7XG4gICAgdmFyIHRyYW5zaXRpb24gPSBfcHJvcHMzLnRyYW5zaXRpb247XG5cbiAgICBpZiAoc2hvdyB8fCB0cmFuc2l0aW9uICYmICF0aGlzLnN0YXRlLmV4aXRlZCkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgb25TaG93OiBmdW5jdGlvbiBvblNob3coKSB7XG4gICAgdmFyIGRvYyA9IF91dGlsc093bmVyRG9jdW1lbnQyWydkZWZhdWx0J10odGhpcyk7XG4gICAgdmFyIGNvbnRhaW5lciA9IF91dGlsc0dldENvbnRhaW5lcjJbJ2RlZmF1bHQnXSh0aGlzLnByb3BzLmNvbnRhaW5lciwgZG9jLmJvZHkpO1xuXG4gICAgbW9kYWxNYW5hZ2VyLmFkZCh0aGlzLCBjb250YWluZXIsIHRoaXMucHJvcHMuY29udGFpbmVyQ2xhc3NOYW1lKTtcblxuICAgIHRoaXMuX29uRG9jdW1lbnRLZXl1cExpc3RlbmVyID0gX3V0aWxzQWRkRXZlbnRMaXN0ZW5lcjJbJ2RlZmF1bHQnXShkb2MsICdrZXl1cCcsIHRoaXMuaGFuZGxlRG9jdW1lbnRLZXlVcCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lciA9IF91dGlsc0FkZEZvY3VzTGlzdGVuZXIyWydkZWZhdWx0J10odGhpcy5lbmZvcmNlRm9jdXMpO1xuXG4gICAgdGhpcy5mb2N1cygpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25TaG93KSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcblxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHtcbiAgICBtb2RhbE1hbmFnZXIucmVtb3ZlKHRoaXMpO1xuXG4gICAgdGhpcy5fb25Eb2N1bWVudEtleXVwTGlzdGVuZXIucmVtb3ZlKCk7XG5cbiAgICB0aGlzLl9vbkZvY3VzaW5MaXN0ZW5lci5yZW1vdmUoKTtcblxuICAgIHRoaXMucmVzdG9yZUxhc3RGb2N1cygpO1xuICB9LFxuXG4gIHNldE1vdW50Tm9kZTogZnVuY3Rpb24gc2V0TW91bnROb2RlKHJlZikge1xuICAgIHRoaXMubW91bnROb2RlID0gcmVmID8gcmVmLmdldE1vdW50Tm9kZSgpIDogcmVmO1xuICB9LFxuXG4gIGhhbmRsZUhpZGRlbjogZnVuY3Rpb24gaGFuZGxlSGlkZGVuKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBleGl0ZWQ6IHRydWUgfSk7XG4gICAgdGhpcy5vbkhpZGUoKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uRXhpdGVkKSB7XG4gICAgICB2YXIgX3Byb3BzNDtcblxuICAgICAgKF9wcm9wczQgPSB0aGlzLnByb3BzKS5vbkV4aXRlZC5hcHBseShfcHJvcHM0LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVCYWNrZHJvcENsaWNrOiBmdW5jdGlvbiBoYW5kbGVCYWNrZHJvcENsaWNrKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm9uQmFja2Ryb3BDbGljaykge1xuICAgICAgdGhpcy5wcm9wcy5vbkJhY2tkcm9wQ2xpY2soZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYmFja2Ryb3AgPT09IHRydWUpIHtcbiAgICAgIHRoaXMucHJvcHMub25IaWRlKCk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZURvY3VtZW50S2V5VXA6IGZ1bmN0aW9uIGhhbmRsZURvY3VtZW50S2V5VXAoZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmtleWJvYXJkICYmIGUua2V5Q29kZSA9PT0gMjcgJiYgdGhpcy5pc1RvcE1vZGFsKCkpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm9uRXNjYXBlS2V5VXApIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkVzY2FwZUtleVVwKGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgY2hlY2tGb3JGb2N1czogZnVuY3Rpb24gY2hlY2tGb3JGb2N1cygpIHtcbiAgICBpZiAoX2RvbUhlbHBlcnNVdGlsSW5ET00yWydkZWZhdWx0J10pIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gX2RvbUhlbHBlcnNBY3RpdmVFbGVtZW50MlsnZGVmYXVsdCddKCk7XG4gICAgfVxuICB9LFxuXG4gIGZvY3VzOiBmdW5jdGlvbiBmb2N1cygpIHtcbiAgICB2YXIgYXV0b0ZvY3VzID0gdGhpcy5wcm9wcy5hdXRvRm9jdXM7XG4gICAgdmFyIG1vZGFsQ29udGVudCA9IHRoaXMuZ2V0RGlhbG9nRWxlbWVudCgpO1xuICAgIHZhciBjdXJyZW50ID0gX2RvbUhlbHBlcnNBY3RpdmVFbGVtZW50MlsnZGVmYXVsdCddKF91dGlsc093bmVyRG9jdW1lbnQyWydkZWZhdWx0J10odGhpcykpO1xuICAgIHZhciBmb2N1c0luTW9kYWwgPSBjdXJyZW50ICYmIF9kb21IZWxwZXJzUXVlcnlDb250YWluczJbJ2RlZmF1bHQnXShtb2RhbENvbnRlbnQsIGN1cnJlbnQpO1xuXG4gICAgaWYgKG1vZGFsQ29udGVudCAmJiBhdXRvRm9jdXMgJiYgIWZvY3VzSW5Nb2RhbCkge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMgPSBjdXJyZW50O1xuXG4gICAgICBpZiAoIW1vZGFsQ29udGVudC5oYXNBdHRyaWJ1dGUoJ3RhYkluZGV4JykpIHtcbiAgICAgICAgbW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAtMSk7XG4gICAgICAgIF93YXJuaW5nMlsnZGVmYXVsdCddKGZhbHNlLCAnVGhlIG1vZGFsIGNvbnRlbnQgbm9kZSBkb2VzIG5vdCBhY2NlcHQgZm9jdXMuICcgKyAnRm9yIHRoZSBiZW5lZml0IG9mIGFzc2lzdGl2ZSB0ZWNobm9sb2dpZXMsIHRoZSB0YWJJbmRleCBvZiB0aGUgbm9kZSBpcyBiZWluZyBzZXQgdG8gXCItMVwiLicpO1xuICAgICAgfVxuXG4gICAgICBtb2RhbENvbnRlbnQuZm9jdXMoKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVzdG9yZUxhc3RGb2N1czogZnVuY3Rpb24gcmVzdG9yZUxhc3RGb2N1cygpIHtcbiAgICAvLyBTdXBwb3J0OiA8PUlFMTEgZG9lc24ndCBzdXBwb3J0IGBmb2N1cygpYCBvbiBzdmcgZWxlbWVudHMgKFJCOiAjOTE3KVxuICAgIGlmICh0aGlzLmxhc3RGb2N1cyAmJiB0aGlzLmxhc3RGb2N1cy5mb2N1cykge1xuICAgICAgdGhpcy5sYXN0Rm9jdXMuZm9jdXMoKTtcbiAgICAgIHRoaXMubGFzdEZvY3VzID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgZW5mb3JjZUZvY3VzOiBmdW5jdGlvbiBlbmZvcmNlRm9jdXMoKSB7XG4gICAgdmFyIGVuZm9yY2VGb2N1cyA9IHRoaXMucHJvcHMuZW5mb3JjZUZvY3VzO1xuXG4gICAgaWYgKCFlbmZvcmNlRm9jdXMgfHwgIXRoaXMuaXNNb3VudGVkKCkgfHwgIXRoaXMuaXNUb3BNb2RhbCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGFjdGl2ZSA9IF9kb21IZWxwZXJzQWN0aXZlRWxlbWVudDJbJ2RlZmF1bHQnXShfdXRpbHNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKHRoaXMpKTtcbiAgICB2YXIgbW9kYWwgPSB0aGlzLmdldERpYWxvZ0VsZW1lbnQoKTtcblxuICAgIGlmIChtb2RhbCAmJiBtb2RhbCAhPT0gYWN0aXZlICYmICFfZG9tSGVscGVyc1F1ZXJ5Q29udGFpbnMyWydkZWZhdWx0J10obW9kYWwsIGFjdGl2ZSkpIHtcbiAgICAgIG1vZGFsLmZvY3VzKCk7XG4gICAgfVxuICB9LFxuXG4gIC8vaW5zdGVhZCBvZiBhIHJlZiwgd2hpY2ggbWlnaHQgY29uZmxpY3Qgd2l0aCBvbmUgdGhlIHBhcmVudCBhcHBsaWVkLlxuICBnZXREaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBnZXREaWFsb2dFbGVtZW50KCkge1xuICAgIHZhciBub2RlID0gdGhpcy5yZWZzLm1vZGFsO1xuICAgIHJldHVybiBub2RlICYmIG5vZGUubGFzdENoaWxkO1xuICB9LFxuXG4gIGlzVG9wTW9kYWw6IGZ1bmN0aW9uIGlzVG9wTW9kYWwoKSB7XG4gICAgcmV0dXJuIG1vZGFsTWFuYWdlci5pc1RvcE1vZGFsKHRoaXMpO1xuICB9XG5cbn0pO1xuXG5Nb2RhbC5tYW5hZ2VyID0gbW9kYWxNYW5hZ2VyO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb2RhbDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIF9kb21IZWxwZXJzU3R5bGUgPSByZXF1aXJlKCdkb20taGVscGVycy9zdHlsZScpO1xuXG52YXIgX2RvbUhlbHBlcnNTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzU3R5bGUpO1xuXG52YXIgX2RvbUhlbHBlcnNDbGFzcyA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL2NsYXNzJyk7XG5cbnZhciBfZG9tSGVscGVyc0NsYXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNDbGFzcyk7XG5cbnZhciBfZG9tSGVscGVyc1V0aWxTY3JvbGxiYXJTaXplID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvdXRpbC9zY3JvbGxiYXJTaXplJyk7XG5cbnZhciBfZG9tSGVscGVyc1V0aWxTY3JvbGxiYXJTaXplMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNVdGlsU2Nyb2xsYmFyU2l6ZSk7XG5cbnZhciBfdXRpbHNJc092ZXJmbG93aW5nID0gcmVxdWlyZSgnLi91dGlscy9pc092ZXJmbG93aW5nJyk7XG5cbnZhciBfdXRpbHNJc092ZXJmbG93aW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzSXNPdmVyZmxvd2luZyk7XG5cbnZhciBfdXRpbHNNYW5hZ2VBcmlhSGlkZGVuID0gcmVxdWlyZSgnLi91dGlscy9tYW5hZ2VBcmlhSGlkZGVuJyk7XG5cbmZ1bmN0aW9uIGZpbmRJbmRleE9mKGFyciwgY2IpIHtcbiAgdmFyIGlkeCA9IC0xO1xuICBhcnIuc29tZShmdW5jdGlvbiAoZCwgaSkge1xuICAgIGlmIChjYihkLCBpKSkge1xuICAgICAgaWR4ID0gaTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBpZHg7XG59XG5cbmZ1bmN0aW9uIGZpbmRDb250YWluZXIoZGF0YSwgbW9kYWwpIHtcbiAgcmV0dXJuIGZpbmRJbmRleE9mKGRhdGEsIGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQubW9kYWxzLmluZGV4T2YobW9kYWwpICE9PSAtMTtcbiAgfSk7XG59XG5cbi8qKlxuICogUHJvcGVyIHN0YXRlIG1hbmFnbWVudCBmb3IgY29udGFpbmVycyBhbmQgdGhlIG1vZGFscyBpbiB0aG9zZSBjb250YWluZXJzLlxuICpcbiAqIEBpbnRlcm5hbCBVc2VkIGJ5IHRoZSBNb2RhbCB0byBlbnN1cmUgcHJvcGVyIHN0eWxpbmcgb2YgY29udGFpbmVycy5cbiAqL1xuXG52YXIgTW9kYWxNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTW9kYWxNYW5hZ2VyKCkge1xuICAgIHZhciBoaWRlU2libGluZ05vZGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1swXTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNb2RhbE1hbmFnZXIpO1xuXG4gICAgdGhpcy5oaWRlU2libGluZ05vZGVzID0gaGlkZVNpYmxpbmdOb2RlcztcbiAgICB0aGlzLm1vZGFscyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IFtdO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICB9XG5cbiAgTW9kYWxNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQobW9kYWwsIGNvbnRhaW5lciwgY2xhc3NOYW1lKSB7XG4gICAgdmFyIG1vZGFsSWR4ID0gdGhpcy5tb2RhbHMuaW5kZXhPZihtb2RhbCk7XG4gICAgdmFyIGNvbnRhaW5lcklkeCA9IHRoaXMuY29udGFpbmVycy5pbmRleE9mKGNvbnRhaW5lcik7XG5cbiAgICBpZiAobW9kYWxJZHggIT09IC0xKSB7XG4gICAgICByZXR1cm4gbW9kYWxJZHg7XG4gICAgfVxuXG4gICAgbW9kYWxJZHggPSB0aGlzLm1vZGFscy5sZW5ndGg7XG4gICAgdGhpcy5tb2RhbHMucHVzaChtb2RhbCk7XG5cbiAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICBfdXRpbHNNYW5hZ2VBcmlhSGlkZGVuLmhpZGVTaWJsaW5ncyhjb250YWluZXIsIG1vZGFsLm1vdW50Tm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRhaW5lcklkeCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZGF0YVtjb250YWluZXJJZHhdLm1vZGFscy5wdXNoKG1vZGFsKTtcbiAgICAgIHJldHVybiBtb2RhbElkeDtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIG1vZGFsczogW21vZGFsXSxcbiAgICAgIC8vcmlnaHQgbm93IG9ubHkgdGhlIGZpcnN0IG1vZGFsIG9mIGEgY29udGFpbmVyIHdpbGwgaGF2ZSBpdHMgY2xhc3NlcyBhcHBsaWVkXG4gICAgICBjbGFzc2VzOiBjbGFzc05hbWUgPyBjbGFzc05hbWUuc3BsaXQoL1xccysvKSA6IFtdLFxuICAgICAgLy93ZSBhcmUgb25seSBpbnRlcmVzdGVkIGluIHRoZSBhY3R1YWwgYHN0eWxlYCBoZXJlIGJlY2FzdWUgd2Ugd2lsbCBvdmVycmlkZSBpdFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgb3ZlcmZsb3c6IGNvbnRhaW5lci5zdHlsZS5vdmVyZmxvdyxcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiBjb250YWluZXIuc3R5bGUucGFkZGluZ1JpZ2h0XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzdHlsZSA9IHsgb3ZlcmZsb3c6ICdoaWRkZW4nIH07XG5cbiAgICBkYXRhLm92ZXJmbG93aW5nID0gX3V0aWxzSXNPdmVyZmxvd2luZzJbJ2RlZmF1bHQnXShjb250YWluZXIpO1xuXG4gICAgaWYgKGRhdGEub3ZlcmZsb3dpbmcpIHtcbiAgICAgIC8vIHVzZSBjb21wdXRlZCBzdHlsZSwgaGVyZSB0byBnZXQgdGhlIHJlYWwgcGFkZGluZ1xuICAgICAgLy8gdG8gYWRkIG91ciBzY3JvbGxiYXIgd2lkdGhcbiAgICAgIHN0eWxlLnBhZGRpbmdSaWdodCA9IHBhcnNlSW50KF9kb21IZWxwZXJzU3R5bGUyWydkZWZhdWx0J10oY29udGFpbmVyLCAncGFkZGluZ1JpZ2h0JykgfHwgMCwgMTApICsgX2RvbUhlbHBlcnNVdGlsU2Nyb2xsYmFyU2l6ZTJbJ2RlZmF1bHQnXSgpICsgJ3B4JztcbiAgICB9XG5cbiAgICBfZG9tSGVscGVyc1N0eWxlMlsnZGVmYXVsdCddKGNvbnRhaW5lciwgc3R5bGUpO1xuXG4gICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2RvbUhlbHBlcnNDbGFzczJbJ2RlZmF1bHQnXS5hZGRDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgdGhpcy5jb250YWluZXJzLnB1c2goY29udGFpbmVyKTtcbiAgICB0aGlzLmRhdGEucHVzaChkYXRhKTtcblxuICAgIHJldHVybiBtb2RhbElkeDtcbiAgfTtcblxuICBNb2RhbE1hbmFnZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShtb2RhbCkge1xuICAgIHZhciBtb2RhbElkeCA9IHRoaXMubW9kYWxzLmluZGV4T2YobW9kYWwpO1xuXG4gICAgaWYgKG1vZGFsSWR4ID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjb250YWluZXJJZHggPSBmaW5kQ29udGFpbmVyKHRoaXMuZGF0YSwgbW9kYWwpO1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhW2NvbnRhaW5lcklkeF07XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZHhdO1xuXG4gICAgZGF0YS5tb2RhbHMuc3BsaWNlKGRhdGEubW9kYWxzLmluZGV4T2YobW9kYWwpLCAxKTtcblxuICAgIHRoaXMubW9kYWxzLnNwbGljZShtb2RhbElkeCwgMSk7XG5cbiAgICAvLyBpZiB0aGF0IHdhcyB0aGUgbGFzdCBtb2RhbCBpbiBhIGNvbnRhaW5lcixcbiAgICAvLyBjbGVhbiB1cCB0aGUgY29udGFpbmVyIHN0eWxpbmhnLlxuICAgIGlmIChkYXRhLm1vZGFscy5sZW5ndGggPT09IDApIHtcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEuc3R5bGUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyLnN0eWxlW2tleV0gPSBkYXRhLnN0eWxlW2tleV07XG4gICAgICB9KTtcblxuICAgICAgZGF0YS5jbGFzc2VzLmZvckVhY2goX2RvbUhlbHBlcnNDbGFzczJbJ2RlZmF1bHQnXS5yZW1vdmVDbGFzcy5iaW5kKG51bGwsIGNvbnRhaW5lcikpO1xuXG4gICAgICBpZiAodGhpcy5oaWRlU2libGluZ05vZGVzKSB7XG4gICAgICAgIF91dGlsc01hbmFnZUFyaWFIaWRkZW4uc2hvd1NpYmxpbmdzKGNvbnRhaW5lciwgbW9kYWwubW91bnROb2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGFpbmVycy5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICAgIHRoaXMuZGF0YS5zcGxpY2UoY29udGFpbmVySWR4LCAxKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGlkZVNpYmxpbmdOb2Rlcykge1xuICAgICAgLy9vdGhlcndpc2UgbWFrZSBzdXJlIHRoZSBuZXh0IHRvcCBtb2RhbCBpcyB2aXNpYmxlIHRvIGEgU1JcbiAgICAgIF91dGlsc01hbmFnZUFyaWFIaWRkZW4uYXJpYUhpZGRlbihmYWxzZSwgZGF0YS5tb2RhbHNbZGF0YS5tb2RhbHMubGVuZ3RoIC0gMV0ubW91bnROb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgTW9kYWxNYW5hZ2VyLnByb3RvdHlwZS5pc1RvcE1vZGFsID0gZnVuY3Rpb24gaXNUb3BNb2RhbChtb2RhbCkge1xuICAgIHJldHVybiAhIXRoaXMubW9kYWxzLmxlbmd0aCAmJiB0aGlzLm1vZGFsc1t0aGlzLm1vZGFscy5sZW5ndGggLSAxXSA9PT0gbW9kYWw7XG4gIH07XG5cbiAgcmV0dXJuIE1vZGFsTWFuYWdlcjtcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE1vZGFsTWFuYWdlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdCddIDogbnVsbCk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1JlYWN0RE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydSZWFjdERPTSddIDogbnVsbCk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX3JlYWN0UHJvcFR5cGVzTGliTW91bnRhYmxlID0gcmVxdWlyZSgncmVhY3QtcHJvcC10eXBlcy9saWIvbW91bnRhYmxlJyk7XG5cbnZhciBfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUpO1xuXG52YXIgX3V0aWxzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJy4vdXRpbHMvb3duZXJEb2N1bWVudCcpO1xuXG52YXIgX3V0aWxzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc093bmVyRG9jdW1lbnQpO1xuXG52YXIgX3V0aWxzR2V0Q29udGFpbmVyID0gcmVxdWlyZSgnLi91dGlscy9nZXRDb250YWluZXInKTtcblxudmFyIF91dGlsc0dldENvbnRhaW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0dldENvbnRhaW5lcik7XG5cbi8qKlxuICogVGhlIGA8UG9ydGFsLz5gIGNvbXBvbmVudCByZW5kZXJzIGl0cyBjaGlsZHJlbiBpbnRvIGEgbmV3IFwic3VidHJlZVwiIG91dHNpZGUgb2YgY3VycmVudCBjb21wb25lbnQgaGllcmFyY2h5LlxuICogWW91IGNhbiB0aGluayBvZiBpdCBhcyBhIGRlY2xhcmF0aXZlIGBhcHBlbmRDaGlsZCgpYCwgb3IgalF1ZXJ5J3MgYCQuZm4uYXBwZW5kVG8oKWAuXG4gKiBUaGUgY2hpbGRyZW4gb2YgYDxQb3J0YWwvPmAgY29tcG9uZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8gdGhlIGBjb250YWluZXJgIHNwZWNpZmllZC5cbiAqL1xudmFyIFBvcnRhbCA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVDbGFzcyh7XG5cbiAgZGlzcGxheU5hbWU6ICdQb3J0YWwnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIC8qKlxuICAgICAqIEEgTm9kZSwgQ29tcG9uZW50IGluc3RhbmNlLCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWl0aGVyLiBUaGUgYGNvbnRhaW5lcmAgd2lsbCBoYXZlIHRoZSBQb3J0YWwgY2hpbGRyZW5cbiAgICAgKiBhcHBlbmRlZCB0byBpdC5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMub25lT2ZUeXBlKFtfcmVhY3RQcm9wVHlwZXNMaWJNb3VudGFibGUyWydkZWZhdWx0J10sIF9yZWFjdDJbJ2RlZmF1bHQnXS5Qcm9wVHlwZXMuZnVuY10pXG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3JlbmRlck92ZXJsYXkoKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9yZW5kZXJPdmVybGF5KCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVRhcmdldCAmJiBuZXh0UHJvcHMuY29udGFpbmVyICE9PSB0aGlzLnByb3BzLmNvbnRhaW5lcikge1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUgPSBfdXRpbHNHZXRDb250YWluZXIyWydkZWZhdWx0J10obmV4dFByb3BzLmNvbnRhaW5lciwgX3V0aWxzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXSh0aGlzKS5ib2R5KTtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICB0aGlzLl91bm1vdW50T3ZlcmxheVRhcmdldCgpO1xuICB9LFxuXG4gIF9tb3VudE92ZXJsYXlUYXJnZXQ6IGZ1bmN0aW9uIF9tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5VGFyZ2V0KSB7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLl9wb3J0YWxDb250YWluZXJOb2RlID0gX3V0aWxzR2V0Q29udGFpbmVyMlsnZGVmYXVsdCddKHRoaXMucHJvcHMuY29udGFpbmVyLCBfdXRpbHNPd25lckRvY3VtZW50MlsnZGVmYXVsdCddKHRoaXMpLmJvZHkpO1xuICAgICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9XG4gIH0sXG5cbiAgX3VubW91bnRPdmVybGF5VGFyZ2V0OiBmdW5jdGlvbiBfdW5tb3VudE92ZXJsYXlUYXJnZXQoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIHRoaXMuX3BvcnRhbENvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQodGhpcy5fb3ZlcmxheVRhcmdldCk7XG4gICAgICB0aGlzLl9vdmVybGF5VGFyZ2V0ID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fcG9ydGFsQ29udGFpbmVyTm9kZSA9IG51bGw7XG4gIH0sXG5cbiAgX3JlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF9yZW5kZXJPdmVybGF5KCkge1xuXG4gICAgdmFyIG92ZXJsYXkgPSAhdGhpcy5wcm9wcy5jaGlsZHJlbiA/IG51bGwgOiBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblxuICAgIC8vIFNhdmUgcmVmZXJlbmNlIGZvciBmdXR1cmUgYWNjZXNzLlxuICAgIGlmIChvdmVybGF5ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9tb3VudE92ZXJsYXlUYXJnZXQoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlJbnN0YW5jZSA9IF9yZWFjdERvbTJbJ2RlZmF1bHQnXS51bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lcih0aGlzLCBvdmVybGF5LCB0aGlzLl9vdmVybGF5VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVW5yZW5kZXIgaWYgdGhlIGNvbXBvbmVudCBpcyBudWxsIGZvciB0cmFuc2l0aW9ucyB0byBudWxsXG4gICAgICB0aGlzLl91bnJlbmRlck92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX3VubW91bnRPdmVybGF5VGFyZ2V0KCk7XG4gICAgfVxuICB9LFxuXG4gIF91bnJlbmRlck92ZXJsYXk6IGZ1bmN0aW9uIF91bnJlbmRlck92ZXJsYXkoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlUYXJnZXQpIHtcbiAgICAgIF9yZWFjdERvbTJbJ2RlZmF1bHQnXS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMuX292ZXJsYXlUYXJnZXQpO1xuICAgICAgdGhpcy5fb3ZlcmxheUluc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgZ2V0TW91bnROb2RlOiBmdW5jdGlvbiBnZXRNb3VudE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlUYXJnZXQ7XG4gIH0sXG5cbiAgZ2V0T3ZlcmxheURPTU5vZGU6IGZ1bmN0aW9uIGdldE92ZXJsYXlET01Ob2RlKCkge1xuICAgIGlmICghdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRPdmVybGF5RE9NTm9kZSgpOiBBIGNvbXBvbmVudCBtdXN0IGJlIG1vdW50ZWQgdG8gaGF2ZSBhIERPTSBub2RlLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vdmVybGF5SW5zdGFuY2UpIHtcbiAgICAgIGlmICh0aGlzLl9vdmVybGF5SW5zdGFuY2UuZ2V0V3JhcHBlZERPTU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXlJbnN0YW5jZS5nZXRXcmFwcGVkRE9NTm9kZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9yZWFjdERvbTJbJ2RlZmF1bHQnXS5maW5kRE9NTm9kZSh0aGlzLl9vdmVybGF5SW5zdGFuY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbn0pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBQb3J0YWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9kb21IZWxwZXJzRXZlbnRzT24gPSByZXF1aXJlKCdkb20taGVscGVycy9ldmVudHMvb24nKTtcblxudmFyIF9kb21IZWxwZXJzRXZlbnRzT24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0V2ZW50c09uKTtcblxudmFyIF9kb21IZWxwZXJzRXZlbnRzT2ZmID0gcmVxdWlyZSgnZG9tLWhlbHBlcnMvZXZlbnRzL29mZicpO1xuXG52YXIgX2RvbUhlbHBlcnNFdmVudHNPZmYyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZG9tSGVscGVyc0V2ZW50c09mZik7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChub2RlLCBldmVudCwgaGFuZGxlcikge1xuICBfZG9tSGVscGVyc0V2ZW50c09uMlsnZGVmYXVsdCddKG5vZGUsIGV2ZW50LCBoYW5kbGVyKTtcbiAgcmV0dXJuIHtcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIF9kb21IZWxwZXJzRXZlbnRzT2ZmMlsnZGVmYXVsdCddKG5vZGUsIGV2ZW50LCBoYW5kbGVyKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKipcbiAqIEZpcmVmb3ggZG9lc24ndCBoYXZlIGEgZm9jdXNpbiBldmVudCBzbyB1c2luZyBjYXB0dXJlIGlzIGVhc2llc3Qgd2F5IHRvIGdldCBidWJibGluZ1xuICogSUU4IGNhbid0IGRvIGFkZEV2ZW50TGlzdGVuZXIsIGJ1dCBkb2VzIGhhdmUgb25mb2N1c2luLCBzbyB3ZSB1c2UgdGhhdCBpbiBpZThcbiAqXG4gKiBXZSBvbmx5IGFsbG93IG9uZSBMaXN0ZW5lciBhdCBhIHRpbWUgdG8gYXZvaWQgc3RhY2sgb3ZlcmZsb3dzXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGFkZEZvY3VzTGlzdGVuZXI7XG5cbmZ1bmN0aW9uIGFkZEZvY3VzTGlzdGVuZXIoaGFuZGxlcikge1xuICB2YXIgdXNlRm9jdXNpbiA9ICFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyO1xuICB2YXIgcmVtb3ZlID0gdW5kZWZpbmVkO1xuXG4gIGlmICh1c2VGb2N1c2luKSB7XG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29uZm9jdXNpbicsIGhhbmRsZXIpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kZXRhY2hFdmVudCgnb25mb2N1c2luJywgaGFuZGxlcik7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZXIsIHRydWUpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4geyByZW1vdmU6IHJlbW92ZSB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRDb250YWluZXI7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyKGNvbnRhaW5lciwgZGVmYXVsdENvbnRhaW5lcikge1xuICBjb250YWluZXIgPSB0eXBlb2YgY29udGFpbmVyID09PSAnZnVuY3Rpb24nID8gY29udGFpbmVyKCkgOiBjb250YWluZXI7XG4gIHJldHVybiBfcmVhY3REb20yWydkZWZhdWx0J10uZmluZERPTU5vZGUoY29udGFpbmVyKSB8fCBkZWZhdWx0Q29udGFpbmVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBpc092ZXJmbG93aW5nO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZG9tSGVscGVyc1F1ZXJ5SXNXaW5kb3cgPSByZXF1aXJlKCdkb20taGVscGVycy9xdWVyeS9pc1dpbmRvdycpO1xuXG52YXIgX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93KTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCk7XG5cbmZ1bmN0aW9uIGlzQm9keShub2RlKSB7XG4gIHJldHVybiBub2RlICYmIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYm9keSc7XG59XG5cbmZ1bmN0aW9uIGJvZHlJc092ZXJmbG93aW5nKG5vZGUpIHtcbiAgdmFyIGRvYyA9IF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXShub2RlKTtcbiAgdmFyIHdpbiA9IF9kb21IZWxwZXJzUXVlcnlJc1dpbmRvdzJbJ2RlZmF1bHQnXShkb2MpO1xuICB2YXIgZnVsbFdpZHRoID0gd2luLmlubmVyV2lkdGg7XG5cbiAgLy8gU3VwcG9ydDogaWU4LCBubyBpbm5lcldpZHRoXG4gIGlmICghZnVsbFdpZHRoKSB7XG4gICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGZ1bGxXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpO1xuICB9XG5cbiAgcmV0dXJuIGRvYy5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpZHRoO1xufVxuXG5mdW5jdGlvbiBpc092ZXJmbG93aW5nKGNvbnRhaW5lcikge1xuICB2YXIgd2luID0gX2RvbUhlbHBlcnNRdWVyeUlzV2luZG93MlsnZGVmYXVsdCddKGNvbnRhaW5lcik7XG5cbiAgcmV0dXJuIHdpbiB8fCBpc0JvZHkoY29udGFpbmVyKSA/IGJvZHlJc092ZXJmbG93aW5nKGNvbnRhaW5lcikgOiBjb250YWluZXIuc2Nyb2xsSGVpZ2h0ID4gY29udGFpbmVyLmNsaWVudEhlaWdodDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5hcmlhSGlkZGVuID0gYXJpYUhpZGRlbjtcbmV4cG9ydHMuaGlkZVNpYmxpbmdzID0gaGlkZVNpYmxpbmdzO1xuZXhwb3J0cy5zaG93U2libGluZ3MgPSBzaG93U2libGluZ3M7XG5cbnZhciBCTEFDS0xJU1QgPSBbJ3RlbXBsYXRlJywgJ3NjcmlwdCcsICdzdHlsZSddO1xuXG52YXIgaXNIaWRhYmxlID0gZnVuY3Rpb24gaXNIaWRhYmxlKF9yZWYpIHtcbiAgdmFyIG5vZGVUeXBlID0gX3JlZi5ub2RlVHlwZTtcbiAgdmFyIHRhZ05hbWUgPSBfcmVmLnRhZ05hbWU7XG4gIHJldHVybiBub2RlVHlwZSA9PT0gMSAmJiBCTEFDS0xJU1QuaW5kZXhPZih0YWdOYW1lLnRvTG93ZXJDYXNlKCkpID09PSAtMTtcbn07XG5cbnZhciBzaWJsaW5ncyA9IGZ1bmN0aW9uIHNpYmxpbmdzKGNvbnRhaW5lciwgbW91bnQsIGNiKSB7XG4gIG1vdW50ID0gW10uY29uY2F0KG1vdW50KTtcblxuICBbXS5mb3JFYWNoLmNhbGwoY29udGFpbmVyLmNoaWxkcmVuLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChtb3VudC5pbmRleE9mKG5vZGUpID09PSAtMSAmJiBpc0hpZGFibGUobm9kZSkpIHtcbiAgICAgIGNiKG5vZGUpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBhcmlhSGlkZGVuKHNob3csIG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChzaG93KSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoaWRlU2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUpIHtcbiAgc2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFyaWFIaWRkZW4odHJ1ZSwgbm9kZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93U2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUpIHtcbiAgc2libGluZ3MoY29udGFpbmVyLCBtb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgcmV0dXJuIGFyaWFIaWRkZW4oZmFsc2UsIG5vZGUpO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9yZWFjdERvbSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdERPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3RET00nXSA6IG51bGwpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCA9IHJlcXVpcmUoJ2RvbS1oZWxwZXJzL293bmVyRG9jdW1lbnQnKTtcblxudmFyIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21IZWxwZXJzT3duZXJEb2N1bWVudCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uIChjb21wb25lbnRPckVsZW1lbnQpIHtcbiAgcmV0dXJuIF9kb21IZWxwZXJzT3duZXJEb2N1bWVudDJbJ2RlZmF1bHQnXShfcmVhY3REb20yWydkZWZhdWx0J10uZmluZERPTU5vZGUoY29tcG9uZW50T3JFbGVtZW50KSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmVyck1zZyA9IGVyck1zZztcbmV4cG9ydHMuY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIgPSBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcjtcblxuZnVuY3Rpb24gZXJyTXNnKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbXNnQ29udGludWF0aW9uKSB7XG4gIHJldHVybiAnSW52YWxpZCBwcm9wIFxcJycgKyBwcm9wTmFtZSArICdcXCcgb2YgdmFsdWUgXFwnJyArIHByb3BzW3Byb3BOYW1lXSArICdcXCcnICsgKCcgc3VwcGxpZWQgdG8gXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnJyArIG1zZ0NvbnRpbnVhdGlvbik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGNoYWluLWFibGUgaXNSZXF1aXJlZCB2YWxpZGF0b3JcbiAqXG4gKiBMYXJnZWx5IGNvcGllZCBkaXJlY3RseSBmcm9tOlxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iLzAuMTEtc3RhYmxlL3NyYy9jb3JlL1JlYWN0UHJvcFR5cGVzLmpzI0w5NFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCAnPDxhbm9ueW1vdXM+Pic7XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXF1aXJlZCBwcm9wIFxcJycgKyBwcm9wTmFtZSArICdcXCcgd2FzIG5vdCBzcGVjaWZpZWQgaW4gXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfcmVhY3QgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIHByb3AgcHJvdmlkZXMgYSB0eXBlIG9mIGVsZW1lbnQuXG4gKlxuICogVGhlIHR5cGUgb2YgZWxlbWVudCBjYW4gYmUgcHJvdmlkZWQgaW4gdHdvIGZvcm1zOlxuICogLSB0YWcgbmFtZSAoc3RyaW5nKVxuICogLSBhIHJldHVybiB2YWx1ZSBvZiBSZWFjdC5jcmVhdGVDbGFzcyguLi4pXG4gKlxuICogQHBhcmFtIHByb3BzXG4gKiBAcGFyYW0gcHJvcE5hbWVcbiAqIEBwYXJhbSBjb21wb25lbnROYW1lXG4gKiBAcmV0dXJucyB7RXJyb3J8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICB2YXIgZXJyQmVnaW5uaW5nID0gX2NvbW1vbi5lcnJNc2cocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCAnLiBFeHBlY3RlZCBhbiBFbGVtZW50IGB0eXBlYCcpO1xuXG4gIGlmICh0eXBlb2YgcHJvcHNbcHJvcE5hbWVdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKF9yZWFjdDJbJ2RlZmF1bHQnXS5pc1ZhbGlkRWxlbWVudChwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGVyckJlZ2lubmluZyArICcsIG5vdCBhbiBhY3R1YWwgRWxlbWVudCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcHNbcHJvcE5hbWVdICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihlcnJCZWdpbm5pbmcgKyAnIHN1Y2ggYXMgYSB0YWcgbmFtZSBvciByZXR1cm4gdmFsdWUgb2YgUmVhY3QuY3JlYXRlQ2xhc3MoLi4uKScpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzWydkZWZhdWx0J10gPSBfY29tbW9uLmNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9jb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgcHJvcCBwcm92aWRlcyBhIERPTSBlbGVtZW50XG4gKlxuICogVGhlIGVsZW1lbnQgY2FuIGJlIHByb3ZpZGVkIGluIHR3byBmb3JtczpcbiAqIC0gRGlyZWN0bHkgcGFzc2VkXG4gKiAtIE9yIHBhc3NlZCBhbiBvYmplY3QgdGhhdCBoYXMgYSBgcmVuZGVyYCBtZXRob2RcbiAqXG4gKiBAcGFyYW0gcHJvcHNcbiAqIEBwYXJhbSBwcm9wTmFtZVxuICogQHBhcmFtIGNvbXBvbmVudE5hbWVcbiAqIEByZXR1cm5zIHtFcnJvcnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gIGlmICh0eXBlb2YgcHJvcHNbcHJvcE5hbWVdICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgcHJvcHNbcHJvcE5hbWVdLnJlbmRlciAhPT0gJ2Z1bmN0aW9uJyAmJiBwcm9wc1twcm9wTmFtZV0ubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKF9jb21tb24uZXJyTXNnKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgJywgZXhwZWN0ZWQgYSBET00gZWxlbWVudCBvciBhbiBvYmplY3QgdGhhdCBoYXMgYSBgcmVuZGVyYCBtZXRob2QnKSk7XG4gIH1cbn1cblxuZXhwb3J0c1snZGVmYXVsdCddID0gX2NvbW1vbi5jcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKiFcbiAqIFxuICogIFJlYWN0IFNpbXBsZXRhYnMgLSBKdXN0IGEgc2ltcGxlIHRhYnMgY29tcG9uZW50IGJ1aWx0IHdpdGggUmVhY3RcbiAqICBAdmVyc2lvbiB2MC43LjBcbiAqICBAbGluayBodHRwczovL2dpdGh1Yi5jb20vcGVkcm9uYXVjay9yZWFjdC1zaW1wbGV0YWJzXG4gKiAgQGxpY2Vuc2UgTUlUXG4gKiAgQGF1dGhvciBQZWRybyBOYXVjayAoaHR0cHM6Ly9naXRodWIuY29tL3BlZHJvbmF1Y2spXG4gKiBcbiAqL1xuKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUmVhY3QnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1JlYWN0J10gOiBudWxsKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJyZWFjdFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KCh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydSZWFjdCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUmVhY3QnXSA6IG51bGwpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJSZWFjdFNpbXBsZVRhYnNcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXykge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG4vKioqKioqL1xuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG4vKioqKioqL1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0LyoqIEBqc3ggUmVhY3QuRE9NICovJ3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZWFjdCA9IF9fd2VicGFja19yZXF1aXJlX18oMSk7XG5cdHZhciBjbGFzc05hbWVzID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcblxuXHRpZiAodHJ1ZSkge1xuXHQgIF9fd2VicGFja19yZXF1aXJlX18oMyk7XG5cdH1cblxuXHR2YXIgVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ICBkaXNwbGF5TmFtZTogJ1RhYnMnLFxuXHQgIHByb3BUeXBlczoge1xuXHQgICAgY2xhc3NOYW1lOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cdCAgICBdKSxcblx0ICAgIHRhYkFjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcblx0ICAgIG9uTW91bnQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25CZWZvcmVDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXHQgICAgb25BZnRlckNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cdCAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcblx0ICAgICAgUmVhY3QuUHJvcFR5cGVzLmVsZW1lbnRcblx0ICAgIF0pLmlzUmVxdWlyZWRcblx0ICB9LFxuXHQgIGdldERlZmF1bHRQcm9wczpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4geyB0YWJBY3RpdmU6IDEgfTtcblx0ICB9LFxuXHQgIGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICB0YWJBY3RpdmU6IHRoaXMucHJvcHMudGFiQWN0aXZlXG5cdCAgICB9O1xuXHQgIH0sXG5cdCAgY29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdCAgICB2YXIgaW5kZXggPSB0aGlzLnN0YXRlLnRhYkFjdGl2ZTtcblx0ICAgIHZhciAkc2VsZWN0ZWRQYW5lbCA9IHRoaXMucmVmc1sndGFiLXBhbmVsJ107XG5cdCAgICB2YXIgJHNlbGVjdGVkTWVudSA9IHRoaXMucmVmc1soXCJ0YWItbWVudS1cIiArIGluZGV4KV07XG5cblx0ICAgIGlmICh0aGlzLnByb3BzLm9uTW91bnQpIHtcblx0ICAgICAgdGhpcy5wcm9wcy5vbk1vdW50KGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkTWVudSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXdQcm9wcyl7XG5cdCAgICBpZihuZXdQcm9wcy50YWJBY3RpdmUgJiYgbmV3UHJvcHMudGFiQWN0aXZlICE9PSB0aGlzLnByb3BzLnRhYkFjdGl2ZSl7XG5cdCAgICAgIHRoaXMuc2V0U3RhdGUoe3RhYkFjdGl2ZTogbmV3UHJvcHMudGFiQWN0aXZlfSk7XG5cdCAgICB9XG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ3RhYnMnLCB0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IGNsYXNzTmFtZX0sIFxuXHQgICAgICAgIHRoaXMuX2dldE1lbnVJdGVtcygpLCBcblx0ICAgICAgICB0aGlzLl9nZXRTZWxlY3RlZFBhbmVsKClcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9LFxuXHQgIHNldEFjdGl2ZTpmdW5jdGlvbihpbmRleCwgZSkge1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdCAgICB2YXIgb25BZnRlckNoYW5nZSA9IHRoaXMucHJvcHMub25BZnRlckNoYW5nZTtcblx0ICAgIHZhciBvbkJlZm9yZUNoYW5nZSA9IHRoaXMucHJvcHMub25CZWZvcmVDaGFuZ2U7XG5cdCAgICB2YXIgJHNlbGVjdGVkUGFuZWwgPSB0aGlzLnJlZnNbJ3RhYi1wYW5lbCddO1xuXHQgICAgdmFyICRzZWxlY3RlZFRhYk1lbnUgPSB0aGlzLnJlZnNbKFwidGFiLW1lbnUtXCIgKyBpbmRleCldO1xuXG5cdCAgICBpZiAob25CZWZvcmVDaGFuZ2UpIHtcblx0ICAgICAgdmFyIGNhbmNlbCA9IG9uQmVmb3JlQ2hhbmdlKGluZGV4LCAkc2VsZWN0ZWRQYW5lbCwgJHNlbGVjdGVkVGFiTWVudSk7XG5cdCAgICAgIGlmKGNhbmNlbCA9PT0gZmFsc2UpeyByZXR1cm4gfVxuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNldFN0YXRlKHsgdGFiQWN0aXZlOiBpbmRleCB9LCBmdW5jdGlvbigpICB7XG5cdCAgICAgIGlmIChvbkFmdGVyQ2hhbmdlKSB7XG5cdCAgICAgICAgb25BZnRlckNoYW5nZShpbmRleCwgJHNlbGVjdGVkUGFuZWwsICRzZWxlY3RlZFRhYk1lbnUpO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9LFxuXHQgIF9nZXRNZW51SXRlbXM6ZnVuY3Rpb24gKCkge1xuXHQgICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVGFicyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIFRhYnMuUGFuZWwnKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuY2hpbGRyZW4pKSB7XG5cdCAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4gPSBbdGhpcy5wcm9wcy5jaGlsZHJlbl07XG5cdCAgICB9XG5cblx0ICAgIHZhciAkbWVudUl0ZW1zID0gdGhpcy5wcm9wcy5jaGlsZHJlblxuXHQgICAgICAubWFwKGZ1bmN0aW9uKCRwYW5lbCkgIHtyZXR1cm4gdHlwZW9mICRwYW5lbCA9PT0gJ2Z1bmN0aW9uJyA/ICRwYW5lbCgpIDogJHBhbmVsO30pXG5cdCAgICAgIC5maWx0ZXIoZnVuY3Rpb24oJHBhbmVsKSAge3JldHVybiAkcGFuZWw7fSlcblx0ICAgICAgLm1hcChmdW5jdGlvbigkcGFuZWwsIGluZGV4KSAge1xuXHQgICAgICAgIHZhciByZWYgPSAoXCJ0YWItbWVudS1cIiArIChpbmRleCArIDEpKTtcblx0ICAgICAgICB2YXIgdGl0bGUgPSAkcGFuZWwucHJvcHMudGl0bGU7XG5cdCAgICAgICAgdmFyIGNsYXNzZXMgPSBjbGFzc05hbWVzKFxuXHQgICAgICAgICAgJ3RhYnMtbWVudS1pdGVtJyxcblx0ICAgICAgICAgIHRoaXMuc3RhdGUudGFiQWN0aXZlID09PSAoaW5kZXggKyAxKSAmJiAnaXMtYWN0aXZlJ1xuXHQgICAgICAgICk7XG5cblx0ICAgICAgICByZXR1cm4gKFxuXHQgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtyZWY6IHJlZiwga2V5OiBpbmRleCwgY2xhc3NOYW1lOiBjbGFzc2VzfSwgXG5cdCAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNldEFjdGl2ZS5iaW5kKHRoaXMsIGluZGV4ICsgMSl9LCBcblx0ICAgICAgICAgICAgICB0aXRsZVxuXHQgICAgICAgICAgICApXG5cdCAgICAgICAgICApXG5cdCAgICAgICAgKTtcblx0ICAgICAgfS5iaW5kKHRoaXMpKTtcblxuXHQgICAgcmV0dXJuIChcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCB7Y2xhc3NOYW1lOiBcInRhYnMtbmF2aWdhdGlvblwifSwgXG5cdCAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwidGFicy1tZW51XCJ9LCAkbWVudUl0ZW1zKVxuXHQgICAgICApXG5cdCAgICApO1xuXHQgIH0sXG5cdCAgX2dldFNlbGVjdGVkUGFuZWw6ZnVuY3Rpb24gKCkge1xuXHQgICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS50YWJBY3RpdmUgLSAxO1xuXHQgICAgdmFyICRwYW5lbCA9IHRoaXMucHJvcHMuY2hpbGRyZW5baW5kZXhdO1xuXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXJ0aWNsZVwiLCB7cmVmOiBcInRhYi1wYW5lbFwiLCBjbGFzc05hbWU6IFwidGFiLXBhbmVsXCJ9LCBcblx0ICAgICAgICAkcGFuZWxcblx0ICAgICAgKVxuXHQgICAgKTtcblx0ICB9XG5cdH0pO1xuXG5cdFRhYnMuUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdCAgZGlzcGxheU5hbWU6ICdQYW5lbCcsXG5cdCAgcHJvcFR5cGVzOiB7XG5cdCAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXHQgICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuXHQgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG5cdCAgICAgIFJlYWN0LlByb3BUeXBlcy5lbGVtZW50XG5cdCAgICBdKS5pc1JlcXVpcmVkXG5cdCAgfSxcblx0ICByZW5kZXI6ZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgdGhpcy5wcm9wcy5jaGlsZHJlbik7XG5cdCAgfVxuXHR9KTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdG1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX187XG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHQvKiogQGpzeCBSZWFjdC5ET00gKi9mdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cdFx0dmFyIGFyZztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCdzdHJpbmcnID09PSB0eXBlb2YgYXJnIHx8ICdudW1iZXInID09PSB0eXBlb2YgYXJnKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBhcmcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmICghYXJnLmhhc093blByb3BlcnR5KGtleSkgfHwgIWFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0Ly8gc2FmZWx5IGV4cG9ydCBjbGFzc05hbWVzIGluIGNhc2UgdGhlIHNjcmlwdCBpcyBpbmNsdWRlZCBkaXJlY3RseSBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9XG5cblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB3YXJuaW5nID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGFyZ3MpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiA+IDIgPyBsZW4gLSAyIDogMCk7XG4gICAgZm9yICh2YXIga2V5ID0gMjsga2V5IDwgbGVuOyBrZXkrKykge1xuICAgICAgYXJnc1trZXkgLSAyXSA9IGFyZ3VtZW50c1trZXldO1xuICAgIH1cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgK1xuICAgICAgICAnbWVzc2FnZSBhcmd1bWVudCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1hdC5sZW5ndGggPCAxMCB8fCAoL15bc1xcV10qJC8pLnRlc3QoZm9ybWF0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhcm5pbmcgZm9ybWF0IHNob3VsZCBiZSBhYmxlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IHRoaXMgJyArXG4gICAgICAgICd3YXJuaW5nLiBQbGVhc2UsIHVzZSBhIG1vcmUgZGVzY3JpcHRpdmUgZm9ybWF0IHRoYW46ICcgKyBmb3JtYXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfSBjYXRjaCh4KSB7fVxuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nO1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEFsbGVsZUZpbHRlcnNWaWV3ID0gKHtzcGVjaWVzLCBoaWRkZW5BbGxlbGVzPVtdLCBkaXNhYmxlZEFsbGVsZXMgPSBbXSwgb25GaWx0ZXJDaGFuZ2V9KSA9PiB7XG4gIGxldCBoaWRkZW5HZW5lcyA9IG5ldyBTZXQsXG4gICAgICBnZW5lSW5wdXRzID0gW107XG5cbiAgZm9yIChjb25zdCBhbGxlbGUgb2YgaGlkZGVuQWxsZWxlcykge1xuICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSk7XG4gICAgaWYgKGdlbmUpXG4gICAgICBoaWRkZW5HZW5lcy5hZGQoZ2VuZS5uYW1lKTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZ2VuZSBpbiBzcGVjaWVzLmdlbmVMaXN0KSB7XG4gICAgaWYgKCFoaWRkZW5HZW5lcy5oYXMoZ2VuZSkpIHtcbiAgICAgIGNvbnN0IGFsbGVsZXMgPSBzcGVjaWVzLmdlbmVMaXN0W2dlbmVdLmFsbGVsZXMsXG4gICAgICAgICAgICBhbGxlbGVJdGVtcyA9IGFsbGVsZXMubWFwKGFsbGVsZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV0sXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAhKGRpc2FibGVkQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPj0gMCk7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBcIm1hcmdpbkxlZnRcIjogXCI4cHhcIiB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17Y2hlY2tlZH0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0vPlxuICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgZ2VuZUlucHV0cy5wdXNoKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmUtYWxsZWxlLWxpc3RcIiBrZXk9e2dlbmV9PnthbGxlbGVJdGVtc308L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGV2dC50YXJnZXQsXG4gICAgICAgICAgYWxsZWxlID0gZWx0ICYmIGVsdC52YWx1ZSxcbiAgICAgICAgICBpc0NoZWNrZWQgPSBlbHQgJiYgZWx0LmNoZWNrZWQ7XG4gICAgaWYgKG9uRmlsdGVyQ2hhbmdlICYmIGFsbGVsZSlcbiAgICAgIG9uRmlsdGVyQ2hhbmdlKGV2dCwgYWxsZWxlLCBpc0NoZWNrZWQpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgYWxsZWxlLWZpbHRlcnNcIlxuICAgICAgICAgIHN0eWxlPXt7IFwibWFyZ2luVG9wXCI6IFwiNXB4XCIsIFwibWFyZ2luQm90dG9tXCI6IFwiNXB4XCIgfX0+XG4gICAgICB7IGdlbmVJbnB1dHMgfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQWxsZWxlRmlsdGVyc1ZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNhYmxlZEFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBvbkZpbHRlckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlRmlsdGVyc1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQWxsZWxlVmlldyA9ICh7YWxsZWxlLCB3aWR0aD0yMSwgdGFyZ2V0LCBjb2xvciwgc2hhcGUsIGhvdmVyaW5nfSkgPT4ge1xuICBsZXQgcmFkaXVzID0gd2lkdGgvMixcbiAgICAgIHN0cm9rZSA9IHRhcmdldCA/IFwiIzAwMDAwMFwiIDogXCJub25lXCIsXG4gICAgICBmaWxsID0gYWxsZWxlID8gY29sb3IgOiBcIndoaXRlXCIsXG4gICAgICBzdHJva2VXaWR0aCA9IGhvdmVyaW5nID8gMyA6IDEsXG4gICAgICBzdHJva2VEYXNoYXJyYXk9IGFsbGVsZSA/IFwiMFwiIDogXCIxXCIsXG4gICAgICBzdmdTaGFwZSA9IG51bGw7XG5cbiAgaWYgKHNoYXBlID09PSBcImNpcmNsZVwiKSB7XG4gICAgc3ZnU2hhcGUgPSA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysxfSBjeD17cmFkaXVzKzF9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPXtzdHJva2V9IHN0cm9rZURhc2hhcnJheT17c3Ryb2tlRGFzaGFycmF5fSBmaWxsPXtmaWxsfS8+O1xuICB9IGVsc2Uge1xuICAgIHN2Z1NoYXBlID0gPHJlY3Qgd2lkdGg9eyhyYWRpdXMqMil9IGhlaWdodD17KHJhZGl1cyoyKX0geD1cIjFcIiB5PVwiMVwiIHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPXtzdHJva2V9IHN0cm9rZURhc2hhcnJheT17c3Ryb2tlRGFzaGFycmF5fSBmaWxsPXtmaWxsfS8+O1xuICB9XG5cblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e3dpZHRoKzJ9IGhlaWdodD17d2lkdGgrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgPGc+XG4gICAgICAgIHsgc3ZnU2hhcGUgfVxuICAgICAgICA8dGV4dCB4PXtyYWRpdXMrMX0geT17cmFkaXVzKzd9IHRleHRBbmNob3I9XCJtaWRkbGVcIiBmaWxsPVwid2hpdGVcIj57YWxsZWxlfTwvdGV4dD5cbiAgICAgIDwvZz5cbiAgICA8L3N2Zz5cbiAgKTtcbn07XG5cbkFsbGVsZVZpZXcucHJvcFR5cGVzID0ge1xuICBhbGxlbGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0YXJnZXQ6IFByb3BUeXBlcy5ib29sLFxuICBjb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2hhcGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGhvdmVyaW5nOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWxsZWxlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtNb3Rpb24sIHNwcmluZ30gZnJvbSAncmVhY3QtbW90aW9uJztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgQWxsZWxlVmlldyBmcm9tICcuL2FsbGVsZSc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG5jb25zdCBBbmltYXRlZENocm9tb3NvbWVWaWV3ID0gKHtvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBzdHlsZT17fSwgb25SZXN0LCBzZWxlY3RlZCwgc21hbGwsIHN0YXJ0UG9zaXRpb25JZCwgdGFyZ2V0UG9zaXRpb25JZCB9KSA9PiB7XG4gIGlmICghc2VsZWN0ZWQpIHJldHVybihudWxsKTtcbiAgbGV0IGFsbGVsZXNDb250YWluZXIgPSB7fSwgZW1wdHk9IGZhbHNlO1xuICBpZiAob3JnICYmIGNocm9tb3NvbWVOYW1lICYmIHNpZGUpIHsgIFxuXG4gICAgbGV0IGFsbGVsZXMgPSBvcmcuZ2V0R2Vub3R5cGUoKS5jaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV1bc2lkZV0uYWxsZWxlcyxcbiAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgb3JnLnNwZWNpZXMpO1xuICAgIGxldCBhbGxlbGVTeW1ib2xzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEFsbGVsZVZpZXcga2V5PXthfSBhbGxlbGU9e2F9IC8+XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgYWxsZWxlc0NvbnRhaW5lciA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxsZWxlc1wiPlxuICAgICAgICB7IGFsbGVsZVN5bWJvbHMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH1cbiAgXG4gIGxldCBzb3VyY2VSZWN0cyA9IHt9LCB0YXJnZXRSZWN0cyA9IHt9O1xuICBcbiAgbGV0IHNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0YXJ0UG9zaXRpb25JZCk7XG4gIGlmICghc291cmNlKSBzb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhcmdldFwiICsgdGFyZ2V0UG9zaXRpb25JZCArIGNocm9tb3NvbWVOYW1lKTtcbiAgXG4gIGlmIChzb3VyY2Upe1xuICAgIHNvdXJjZVJlY3RzID0gc291cmNlLmdldENsaWVudFJlY3RzKClbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJubyByZWN0cyFcIiwgc291cmNlLCBzdGFydFBvc2l0aW9uSWQpO1xuICAgIHJldHVybiAobnVsbCk7XG4gIH1cblxuICBsZXQgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YXJnZXRcIiArIHRhcmdldFBvc2l0aW9uSWQpO1xuICBpZiAoIXRhcmdldCkgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YXJnZXRcIiArIHRhcmdldFBvc2l0aW9uSWQgKyBjaHJvbW9zb21lTmFtZSk7XG4gIFxuICBpZiAodGFyZ2V0KXtcbiAgICB0YXJnZXRSZWN0cyA9IHRhcmdldC5nZXRDbGllbnRSZWN0cygpWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwibm8gcmVjdHMhXCIsIHRhcmdldCwgXCJ0YXJnZXRcIiArIHRhcmdldFBvc2l0aW9uSWQpO1xuICAgIHJldHVybiAobnVsbCk7XG4gIH1cbiAgXG4gIGxldCBzdGFydFN0eWxlID0ge30sIGVuZFN0eWxlID0ge307XG4gIHN0YXJ0U3R5bGUueCA9IHNvdXJjZVJlY3RzLmxlZnQ7XG4gIHN0YXJ0U3R5bGUueSA9IHNvdXJjZVJlY3RzLnRvcDtcbiAgc3RhcnRTdHlsZS5vcGFjaXR5ID0gMTtcbiAgXG4gIGVuZFN0eWxlLnggPSB0YXJnZXRSZWN0cy5sZWZ0O1xuICBlbmRTdHlsZS55ID0gc291cmNlUmVjdHMudG9wOyAvLyBjYW4ndCB5ZXQgZ2V0IHRvIHRoZSBleGFjdCBjaHJvbW9zb21lIHRhcmdldFxuICBlbmRTdHlsZS5vcGFjaXR5ID0gMDtcblxuXG4gIGNvbnN0IFxuICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiAxMDAsIGRhbXBpbmc6IDMwIH07XG5cbiAgY29uc3Qgb25BbmltYXRpb25GaW5pc2hlZCA9ICgpID0+IHtcbiAgICBvblJlc3QoKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxNb3Rpb24gY2xhc3NOYW1lPSdnZW5pYmxvY2tzIGFuaW1hdGVkLWNocm9tb3NvbWUtdmlldydcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZT17e1xuICAgICAgICAgICAgeDogc3RhcnRTdHlsZS54LCB5OiBzdGFydFN0eWxlLnksXG4gICAgICAgICAgICBvcGFjaXR5OiBzdGFydFN0eWxlLm9wYWNpdHlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICB4OiBzcHJpbmcoZW5kU3R5bGUueCwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHk6IHNwcmluZyhlbmRTdHlsZS55LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgb3BhY2l0eTogc3ByaW5nKGVuZFN0eWxlLm9wYWNpdHksIHNwcmluZ0NvbmZpZylcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uUmVzdD17b25BbmltYXRpb25GaW5pc2hlZH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxDaHJvbW9zb21lSW1hZ2VWaWV3IGVtcHR5PXtlbXB0eX0gc21hbGw9e3NtYWxsfSBjbGFzc05hbWU9XCJhbmltYXRlZC1jaHJvbW9zb21lLWFsbGVsZS1jb250YWluZXJcIiBkaXNwbGF5PXtpbnRlcnBvbGF0ZWRTdHlsZX0gLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgPC9Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZENocm9tb3NvbWVWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmMsXG4gIHNlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2hyb21vc29tZU5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNpZGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHN0YXJ0UG9zaXRpb25JZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdGFyZ2V0UG9zaXRpb25JZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZENocm9tb3NvbWVWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01vdGlvbiwgc3ByaW5nfSBmcm9tICdyZWFjdC1tb3Rpb24nO1xuaW1wb3J0IEdhbWV0ZVZpZXcgZnJvbSAnLi9nYW1ldGUnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBhIEJpb2xvZ2ljYSBnYW1ldGUgdGhhdCBhbmltYXRlc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnYW1ldGUgLSBCaW9sb2dpY2EgZ2FtZXRlIChtYXAgb2YgY2hyb21vc29tZSBuYW1lcyB0byBjaHJvbW9zb21lcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1ldGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IGhpZGRlbkFsbGVsZXMgLSBpbmRpdmlkdWFsIGFsbGVsZXMgb2YgZ2VuZXMgZm9yIHdoaWNoIGFsbCBhbGxlbGVzIHNob3VsZCBiZSBoaWRkZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbaW5pdGlhbERpc3BsYXldIC0gaW5pdGlhbCBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtpbml0aWFsRGlzcGxheS54XSAtIGluaXRpYWwgbG9jYXRpb24gKGxlZnQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkueV0gLSBpbml0aWFsIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbERpc3BsYXkuc2l6ZT0zMF0gLSBpbml0aWFsIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5LnJvdGF0aW9uPTBdIC0gaW5pdGlhbCByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxEaXNwbGF5Lm9wYWNpdHk9MV0gLSBpbml0aWFsIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRpc3BsYXkgLSBmaW5hbCBkaXNwbGF5IHBhcmFtZXRlcnMgdXNlZCB0byByZXByZXNlbnQgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueCAtIGZpbmFsIGxvY2F0aW9uIChsZWZ0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzcGxheS55IC0gZmluYWwgbG9jYXRpb24gKHRvcCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IFtkaXNwbGF5LnNpemU9MzBdIC0gZmluYWwgc2l6ZSAod2lkdGggJiBoZWlnaHQpIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5yb3RhdGlvbj0wXSAtIGZpbmFsIHJvdGF0aW9uIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5vcGFjaXR5PTFdIC0gZmluYWwgb3BhY2l0eSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2FuaW1TdGlmZm5lc3M9MTAwXSAtIHNwcmluZyBzdGlmZm5lc3MgdXNlZCB0byBjb250cm9sIGFuaW1hdGlvbiBzcGVlZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNTZWxlY3RlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdzZWxlY3RlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNEaXNhYmxlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdkaXNhYmxlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uQ2xpY2soZXZ0LCBpZCwgcmVjdCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGdhbWV0ZSBpcyBjbGlja2VkXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb25SZWN0KCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBhdCByZXN0XG4gKlxuICogTm90ZTogQXMgdGhpbmdzIHN0YW5kIGN1cnJlbnRseSwgdGhlcmUgaXMgX25vXyBwYXJ0aWN1bGFyIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgZGVmaW5lZFxuICogYnkgdGhpcyB2aWV3LiBUaGUgY2xpZW50IGNhbiBzdHlsZSB0aGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBieSBzdHlsaW5nIHRoZVxuICogJy5nZW5pYmxvY2tzLmdhbWV0ZScgY2xhc3MgaW4gQ1NTLCBlLmcuIGJ5IGFzc2lnbmluZyBhIGJhY2tncm91bmQtaW1hZ2UuXG4gKi9cbmNvbnN0IEFuaW1hdGVkR2FtZXRlVmlldyA9ICh7aWQsIGluaXRpYWxEaXNwbGF5LCBkaXNwbGF5LCBhbmltU3RpZmZuZXNzPTEwMCwgb25SZXN0LCAuLi5vdGhlcnN9KSA9PiB7XG5cbiAgY29uc3QgZ3JvdXAgPSBpZCAlIDQsXG4gICAgICAgIHJvdGF0aW9uRm9yR3JvdXAgPSBncm91cCAqIDkwLFxuICAgICAgICBpbml0aWFsID0gaW5pdGlhbERpc3BsYXkgfHwgZGlzcGxheSxcbiAgICAgICAgaW5pdGlhbFNpemUgPSBpbml0aWFsLnNpemUgfHwgMzAsXG4gICAgICAgIGluaXRpYWxSb3RhdGlvbiA9IGluaXRpYWwucm90YXRpb24gIT0gbnVsbCA/IGluaXRpYWwucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICBpbml0aWFsT3BhY2l0eSA9IGluaXRpYWwub3BhY2l0eSAhPSBudWxsID8gaW5pdGlhbC5vcGFjaXR5IDogMS4wLFxuICAgICAgICBmaW5hbFNpemUgPSBkaXNwbGF5LnNpemUgfHwgMzAsXG4gICAgICAgIGZpbmFsUm90YXRpb24gPSBkaXNwbGF5LnJvdGF0aW9uICE9IG51bGwgPyBkaXNwbGF5LnJvdGF0aW9uIDogcm90YXRpb25Gb3JHcm91cCxcbiAgICAgICAgZmluYWxPcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHNwcmluZ0NvbmZpZyA9IHsgc3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzIH07XG4gIHJldHVybiAoXG4gICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtZ2FtZXRlJ1xuICAgICAgICAgIGRlZmF1bHRTdHlsZT17e1xuICAgICAgICAgICAgeDogaW5pdGlhbC54LCB5OiBpbml0aWFsLnksIHNpemU6IGluaXRpYWxTaXplLFxuICAgICAgICAgICAgcm90YXRpb246IGluaXRpYWxSb3RhdGlvbiwgb3BhY2l0eTogaW5pdGlhbE9wYWNpdHlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICB4OiBzcHJpbmcoZGlzcGxheS54LCBzcHJpbmdDb25maWcpLFxuICAgICAgICAgICAgeTogc3ByaW5nKGRpc3BsYXkueSwgc3ByaW5nQ29uZmlnKSxcbiAgICAgICAgICAgIHNpemU6IHNwcmluZyhmaW5hbFNpemUsIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICByb3RhdGlvbjogc3ByaW5nKGZpbmFsUm90YXRpb24sIHNwcmluZ0NvbmZpZyksXG4gICAgICAgICAgICBvcGFjaXR5OiBzcHJpbmcoZmluYWxPcGFjaXR5LCBzcHJpbmdDb25maWcpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAge1xuICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PlxuICAgICAgICAgIDxHYW1ldGVWaWV3IGlkPXtpZH0gZGlzcGxheT17aW50ZXJwb2xhdGVkU3R5bGV9IHsuLi5vdGhlcnN9IC8+XG4gICAgICB9XG4gICAgPC9Nb3Rpb24+XG4gICk7XG59O1xuXG5BbmltYXRlZEdhbWV0ZVZpZXcucHJvcFR5cGVzID0ge1xuICBnYW1ldGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIGluaXRpYWxEaXNwbGF5OiBQcm9wVHlwZXMuc2hhcGUoeyAvLyBpbml0aWFsIGRpc3BsYXkgcHJvcGVydGllc1xuICAgIHg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKGxlZnQpIG9mIGdhbWV0ZSBpbWFnZVxuICAgIHk6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCwgLy8gbG9jYXRpb24gKHRvcCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgc2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBzaXplIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMzApXG4gICAgcm90YXRpb246IFByb3BUeXBlcy5udW1iZXIsICAgICAvLyByb3RhdGlvbiAoZGVnKSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDB8OTB8MTgwfDI3MClcbiAgICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyICAgICAgIC8vIG9wYWNpdHkgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAxLjApXG4gIH0pLFxuICBkaXNwbGF5OiBQcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZmluYWwgZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgYW5pbVN0aWZmbmVzczogUHJvcFR5cGVzLm51bWJlciwgIC8vIHN0aWZmbmVzcyBvZiBzcHJpbmcgZm9yIGFuaW1hdGlvbiAoZGVmYXVsdDogMTAwKVxuICBpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNEaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZEdhbWV0ZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TW90aW9uLCBzcHJpbmd9IGZyb20gJ3JlYWN0LW1vdGlvbic7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG5jb25zdCBBbmltYXRlZE9yZ2FuaXNtVmlldyA9ICh7b3JnLCBpZCwgd2lkdGg9MjAwLCBzdHlsZT17fSwgaW5pdGlhbE9wYWNpdHk9MS4wLCBvcGFjaXR5PTEuMCwgc3RpZmZuZXNzPTYwLCBvblJlc3QsIG9uQ2xpY2sgfSkgPT4ge1xuICBjb25zdCBvcGFjaXR5U3RhcnQgPSBpbml0aWFsT3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGluaXRpYWxPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICA6IChvcGFjaXR5ICE9PSB1bmRlZmluZWQgPyBvcGFjaXR5IDogMS4wKTtcbiAgbGV0ICAgb3BhY2l0eUVuZCA9IG9wYWNpdHkgIT09IHVuZGVmaW5lZCA/IG9wYWNpdHkgOiBvcGFjaXR5U3RhcnQ7XG5cbiAgaWYgKG9wYWNpdHlFbmQgIT09IG9wYWNpdHlTdGFydClcbiAgICBvcGFjaXR5RW5kID0gc3ByaW5nKG9wYWNpdHlFbmQsIHsgc3RpZmZuZXNzOiBzdGlmZm5lc3MgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8TW90aW9uIGNsYXNzTmFtZT0nZ2VuaWJsb2NrcyBhbmltYXRlZC1vcmdhbmlzbS12aWV3J1xuICAgICAgICAgICAgZGVmYXVsdFN0eWxlPXt7b3BhY2l0eTogb3BhY2l0eVN0YXJ0fX0gc3R5bGU9e3tvcGFjaXR5OiBvcGFjaXR5RW5kfX0gb25SZXN0PXtvblJlc3R9ID5cbiAgICAgIHtcbiAgICAgICAgaW50ZXJwb2xhdGVkU3R5bGUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRTdHlsZSA9IHsgLi4uc3R5bGUsIC4uLmludGVycG9sYXRlZFN0eWxlIH07XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZH0gd2lkdGg9e3dpZHRofSBzdHlsZT17dFN0eWxlfSBvbkNsaWNrPXtvbkNsaWNrfSAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L01vdGlvbj5cbiAgKTtcbn07XG5cbkFuaW1hdGVkT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGluaXRpYWxPcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvcGFjaXR5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uUmVzdDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRlZE9yZ2FuaXNtVmlldztcbiIsIi8qXG4gKiBUaGlzIGNvbXBvbmVudCBpcyBhIHZlcnkgdGhpbiB3cmFwcGVyIGFyb3VuZCBhIHN0YW5kYXJkIGJ1dHRvbiBkZXNpZ25lZCB0byBwcmV2ZW50XG4gKiBleHRyYW5lb3VzIGZvY3VzIGhpZ2hsaWdodGluZyBhZGRlZCBieSBicm93c2VycyB3aGVuIGNsaWNraW5nIG9uIGEgYnV0dG9uIHdoaWxlXG4gKiBtYWludGFpbmluZyBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5LiBTZWVcbiAqIGh0dHBzOi8vd3d3LnBhY2llbGxvZ3JvdXAuY29tL2Jsb2cvMjAxMi8wNC9ob3ctdG8tcmVtb3ZlLWNzcy1vdXRsaW5lcy1pbi1hbi1hY2Nlc3NpYmxlLW1hbm5lci9cbiAqIGZvciBkZXRhaWxzLiBUaGUgdXBzaG90IGlzIHRoYXQgd2UgdXNlIG1vdXNlIGV2ZW50cyBvbiB0aGUgYnV0dG9uIHRvIGRpc2FibGUgdGhlXG4gKiBmb2N1cyBoaWdobGlnaHQgLS0gbW91c2luZy9jbGlja2luZyBvbiBhIHB1c2ggYnV0dG9uIHNob3VsZCBub3QgYmUgdXNlZCBhcyBhblxuICogaW5jaWRhdG9yIHRoYXQgdGhlIHVzZXIgd291bGQgbGlrZSB0byBrZXlib2FyZC1pbnRlcmFjdCB3aXRoIHRoYXQgYnV0dG9uLCB3aGljaFxuICogaXMgd2hhdCBmb2N1c2luZyBhIGNsaWNrZWQgYnV0dG9uIGltcGxpZXMuXG4gKiBJTVBPUlRBTlQ6IFRvIG1haW50YWluIGFjY2Vzc2liaWxpdHksIHRoZXJlIG11c3QgYmUgY29kZSBzb21ld2hlcmUgdG8gcmVlbmFibGVcbiAqIHRoZSBmb2N1cyBoaWdobGlnaHQgd2hlbiBhcHByb3ByaWF0ZS4gVGhpcyBjYW4gYmUgZG9uZSBmb3IgJ2tleWRvd24nIGJ5IGNhbGxpbmdcbiAqIEJ1dHRvbi5lbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpIGR1cmluZyBhcHBsaWNhdGlvbi9wYWdlIGluaXRpYWxpemF0aW9uLFxuICogb3IgYnkgYWRkaW5nIHlvdXIgb3duIGV2ZW50IGhhbmRsZXIgdGhhdCBjYWxscyBCdXR0b24uZW5hYmxlQnV0dG9uRm9jdXNIaWdobGlnaHQoKS5cbiAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICB9XG5cbiAgLy8gSW5zdGFsbHMgYSBrZXlkb3duIGhhbmRsZXIgb24gdGhlIGRvY3VtZW50IHdoaWNoIHdpbGwgZW5hYmxlIGJ1dHRvbiBmb2N1cyBoaWdobGlnaHRpbmcuXG4gIC8vIFNob3VsZCBiZSBjYWxsZWQgb25jZSBkdXJpbmcgYXBwbGljYXRpb24gaW5pdGlhbGl6YXRpb24uXG4gIHN0YXRpYyBlbmFibGVCdXR0b25Gb2N1c0hpZ2hsaWdodE9uS2V5RG93bigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKCkgPT4gQnV0dG9uLmVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0KCkpO1xuICB9XG5cbiAgLy8gRW5hYmxlcyBidXR0b24gZm9jdXMgaGlnaGxpZ2h0aW5nOyBkZXNpZ25lZCB0byBiZSBjYWxsZWQgZnJvbSB0aGUga2V5ZG93biBoYW5kbGVyIGFib3ZlXG4gIC8vIGJ1dCBhdmFpbGFibGUgc2VwYXJhdGVseSBmb3IgaW1wbGVtZW50YXRpb25zIHRoYXQgcmVxdWlyZSBpdC5cbiAgc3RhdGljIGVuYWJsZUJ1dHRvbkZvY3VzSGlnaGxpZ2h0KCkge1xuICAgIGNvbnN0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ2ItYnV0dG9uJyksXG4gICAgICAgICAgY291bnQgPSBidXR0b25zLmxlbmd0aDtcbiAgICAvLyBjZi4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGVMaXN0I0V4YW1wbGVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG4gICAgICBpZiAoYnV0dG9uICYmIGJ1dHRvbi5jbGFzc05hbWUpIHtcbiAgICAgICAgLy8gY2YuIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTk1OTUxL2NoYW5nZS1hbi1lbGVtZW50cy1jbGFzcy13aXRoLWphdmFzY3JpcHRcbiAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9IGJ1dHRvbi5jbGFzc05hbWUucmVwbGFjZSgvKD86XnxcXHMpbm8tZm9jdXMtaGlnaGxpZ2h0KD8hXFxTKS9nICwgJycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHByZXZlbnQgZXh0cmFuZW91cyBmb2N1cyBoaWdobGlnaHQgb24gY2xpY2sgd2hpbGUgbWFpbnRhaW5pbmcga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eVxuICAvLyBzZWUgaHR0cHM6Ly93d3cucGFjaWVsbG9ncm91cC5jb20vYmxvZy8yMDEyLzA0L2hvdy10by1yZW1vdmUtY3NzLW91dGxpbmVzLWluLWFuLWFjY2Vzc2libGUtbWFubmVyL1xuICBzdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0ID0gKCkgPT4ge1xuICAgIGNvbnN0IG5vRm9jdXNIaWdobGlnaHQgPSAnbm8tZm9jdXMtaGlnaGxpZ2h0JyxcbiAgICAgICAgICBidXR0b24gPSB0aGlzLnJlZnMuYnV0dG9uO1xuICAgIGlmIChidXR0b24gJiYgYnV0dG9uLmNsYXNzTmFtZS5pbmRleE9mKG5vRm9jdXNIaWdobGlnaHQpIDwgMClcbiAgICAgIGJ1dHRvbi5jbGFzc05hbWUgKz0gJyAnICsgbm9Gb2N1c0hpZ2hsaWdodDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNsYXNzTmFtZSwgbGFiZWwsIC4uLm90aGVycyB9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICBjbGFzc2VzID0gKGNsYXNzTmFtZSA/IGNsYXNzTmFtZSArICcgJyA6ICcnKSArICdnYi1idXR0b24nO1xuXG4gICAgY29uc3QgaGFuZGxlTW91c2VFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zdXBwcmVzc0J1dHRvbkZvY3VzSGlnaGxpZ2h0KCk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtjbGFzc2VzfSByZWY9J2J1dHRvbicgey4uLm90aGVyc31cbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtoYW5kbGVNb3VzZUV2ZW50fVxuICAgICAgICAgICAgICBvbk1vdXNlRG93bj17aGFuZGxlTW91c2VFdmVudH0+XG4gICAgICAgIHtsYWJlbH1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV0dG9uO1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01vdGlvbiwgc3ByaW5nfSBmcm9tICdyZWFjdC1tb3Rpb24nO1xuXG5jbGFzcyBDaGFsbGVuZ2VBd2FyZFZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2hhbGxlbmdlQXdhcmRzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHNpemU6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgY29pblBhcnRzOiBQcm9wVHlwZXMubnVtYmVyXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgY2hhbGxlbmdlQXdhcmRzOiB7XCJjYXNlSWRcIjowLCBcImNoYWxsZW5nZUlkXCI6MCwgXCJjaGFsbGVuZ2VDb3VudFwiOjAsIFwicHJvZ3Jlc3NcIjpbXX0sXG4gICAgIHNpemU6IDI1NixcbiAgICAgY29pblBhcnRzOiAzXG4gIH07XG5cbiAgYWRkQXdhcmRJbWFnZSA9IChwcm9ncmVzc0ltYWdlcywgcGllY2VzLCBwaWVjZU51bSwgc2NvcmUsIHBpZWNlU3R5bGUpID0+IHtcbiAgICBsZXQgYXdhcmRMZXZlbCA9IHRoaXMuZ2V0QXdhcmRTdHlsZShzY29yZSk7XG4gICAgaWYgKHNjb3JlID4gLTEpe1xuICAgICAgbGV0IHBpZWNlTmFtZSA9IGBjb2luIHBpZWNlIHBpZWNlcyR7cGllY2VzfSBwaWVjZSR7cGllY2VOdW19ICR7cGllY2VTdHlsZX0gJHthd2FyZExldmVsfWA7XG4gICAgICBwcm9ncmVzc0ltYWdlcy5wdXNoKDxkaXYga2V5PXtwaWVjZU51bX0gY2xhc3NOYW1lPXtwaWVjZU5hbWV9IC8+KTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2dyZXNzSW1hZ2VzO1xuICB9O1xuICBcbiAgZ2V0QXdhcmRTdHlsZSA9IChzY29yZSkgPT4ge1xuICAgIGxldCBhd2FyZExldmVsID0gXCJnb2xkXCI7XG4gICAgaWYgKHNjb3JlID09PSAxKSBhd2FyZExldmVsID0gXCJzaWx2ZXJcIjtcbiAgICBpZiAoc2NvcmUgPj0gMikgYXdhcmRMZXZlbCA9IFwiYnJvbnplXCI7XG4gICAgcmV0dXJuIGF3YXJkTGV2ZWw7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBjYXNlSWQgPSAwLCBjaGFsbGVuZ2VJZCA9IDAsIGNoYWxsZW5nZUNvdW50ID0gMCwgcHJvZ3Jlc3MgPSBbXSwgY2hhbGxlbmdlQmFja2dyb3VuZEltYWdlLCBwcm9ncmVzc0ltYWdlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUlkICE9IG51bGwpIHtcbiAgICAgIGNhc2VJZCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNhc2VJZCxcbiAgICAgIGNoYWxsZW5nZUlkID0gdGhpcy5wcm9wcy5jaGFsbGVuZ2VBd2FyZHMuY2hhbGxlbmdlSWQsXG4gICAgICBjaGFsbGVuZ2VDb3VudCA9IHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzLmNoYWxsZW5nZUNvdW50O1xuICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkcy5wcm9ncmVzcztcbiAgICAgIGNoYWxsZW5nZUJhY2tncm91bmRJbWFnZSA9IDxkaXYgY2xhc3NOYW1lPVwiY29pbiBiYWNrZ3JvdW5kXCIgLz47XG4gICAgfSBlbHNlIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCFwcm9ncmVzcyB8fCBwcm9ncmVzcyA9PT0gW10pXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBsZXQgc2l6ZSA9IHRoaXMucHJvcHMuc2l6ZSB8fCAyNTY7XG4gICAgbGV0IHNpemVTdHlsZSA9IHtcbiAgICAgIHdpZHRoOiBzaXplICsgXCJweFwiLFxuICAgICAgaGVpZ2h0OiBzaXplICsgXCJweFwiXG4gICAgfTtcblxuICAgIGxldCBwaWVjZUtleSA9IGNhc2VJZCArIFwiOlwiO1xuICAgIGxldCBjaGFsbGVuZ2VTY29yZSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFsbGVuZ2VDb3VudDsgaSsrKXtcbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9ncmVzcyl7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwaWVjZUtleSArIGkpKXtcbiAgICAgICAgICBsZXQgc2NvcmUgPSBwcm9ncmVzc1trZXldO1xuICAgICAgICAgIGxldCBjdXJyZW50U2NvcmUgPSBjaGFsbGVuZ2VTY29yZVtpXTtcbiAgICAgICAgICBpZiAoIWN1cnJlbnRTY29yZSkge1xuICAgICAgICAgICAgIGNoYWxsZW5nZVNjb3JlW2ldID0gc2NvcmU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IGN1cnJlbnRTY29yZSArIHNjb3JlO1xuICAgICAgICAgICAgY2hhbGxlbmdlU2NvcmVbaV0gPSBzY29yZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IHBpZWNlTnVtID0gY2hhbGxlbmdlSWQgKyAxO1xuICAgIGxldCBjdXJyZW50UGllY2VTdHlsZSA9IGBjb2luIHBpZWNlIHBpZWNlcyR7Y2hhbGxlbmdlQ291bnR9IHBpZWNlJHtwaWVjZU51bX0gc2luZ2xlICR7dGhpcy5nZXRBd2FyZFN0eWxlKGNoYWxsZW5nZVNjb3JlW2NoYWxsZW5nZUlkXSl9YDtcblxuICAgIGZvciAodmFyIGNoYWxsZW5nZSBpbiBjaGFsbGVuZ2VTY29yZSl7XG4gICAgICBwaWVjZU51bSA9IHBhcnNlSW50KGNoYWxsZW5nZSkgKyAxO1xuICAgICAgcHJvZ3Jlc3NJbWFnZXMgPSB0aGlzLmFkZEF3YXJkSW1hZ2UocHJvZ3Jlc3NJbWFnZXMsIGNoYWxsZW5nZUNvdW50LCBwaWVjZU51bSwgY2hhbGxlbmdlU2NvcmVbY2hhbGxlbmdlXSwgXCJ3aG9sZVwiKTtcbiAgICB9XG5cbiAgICBsZXQgc2luZ2xlUGllY2VPcGFjaXR5U3RhcnQgPSAxLCBzaW5nbGVQaWVjZU9wYWNpdHlFbmQgPSAwLCBzdHlsZSA9IHt9LCBvblJlc3Q7XG4gICAgc2luZ2xlUGllY2VPcGFjaXR5RW5kID0gc3ByaW5nKHNpbmdsZVBpZWNlT3BhY2l0eUVuZCwgeyBzdGlmZm5lc3M6IDMwLCBkYW1waW5nOjIwIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBjaGFsbGVuZ2UtYXdhcmRcIiBzdHlsZT17c2l6ZVN0eWxlfSA+XG4gICAgICAgIHtjaGFsbGVuZ2VCYWNrZ3JvdW5kSW1hZ2V9XG4gICAgICAgIHtwcm9ncmVzc0ltYWdlc31cbiAgICAgICAgPE1vdGlvbiBjbGFzc05hbWU9J2dlbmlibG9ja3MgYW5pbWF0ZWQtb3JnYW5pc20tdmlldydcbiAgICAgICAgICAgIGRlZmF1bHRTdHlsZT17e29wYWNpdHk6IHNpbmdsZVBpZWNlT3BhY2l0eVN0YXJ0fX0gc3R5bGU9e3tvcGFjaXR5OiBzaW5nbGVQaWVjZU9wYWNpdHlFbmR9fSBvblJlc3Q9e29uUmVzdH0gPlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpbnRlcnBvbGF0ZWRTdHlsZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdFN0eWxlID0geyAuLi5zdHlsZSwgLi4uaW50ZXJwb2xhdGVkU3R5bGUgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3BpZWNlTnVtfSBzdHlsZT17dFN0eWxlfSBjbGFzc05hbWU9e2N1cnJlbnRQaWVjZVN0eWxlfSAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgPC9Nb3Rpb24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYWxsZW5nZUF3YXJkVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBtYWxlL2ZlbWFsZSBjaGFuZ2UgYnV0dG9uc1xuICogVGhlIGFwcGVhcmFuY2Ugb2YgdGhlIGJ1dHRvbnMgaXMgY3VycmVudGx5IGVudGlyZWx5IGNvbnRyb2xsZWQgdmlhIGV4dGVybmFsIENTUy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXggLSBbJ21hbGUnIHwgJ2ZlbWFsZSddIGN1cnJlbnRseSBzZWxlY3RlZCBidXR0b25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ2hhbmdlKGV2dCwgc2V4KSAtIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHVzZSBjbGlja3MgdG8gY2hhbmdlIHNleFxuICovXG5jb25zdCBDaGFuZ2VTZXhCdXR0b25zID0gKHtpZCwgc2V4LCBzcGVjaWVzLCBzaG93TGFiZWwsIHN0eWxlPXt9LCBvbkNoYW5nZX0pID0+IHtcbiAgY29uc3QgY2FwU2V4ID0gc2V4ID09PSBCaW9Mb2dpY2EuTUFMRSA/ICdNYWxlJyA6ICdGZW1hbGUnLFxuICAgICAgICBzZWxlY3RlZFNleENsYXNzID0gc2V4ID09PSBCaW9Mb2dpY2EuTUFMRSA/ICdtYWxlLXNlbGVjdGVkJyA6ICdmZW1hbGUtc2VsZWN0ZWQnLFxuICAgICAgICBCVVRUT05fSU1BR0VfV0lEVEggPSAxMDAsXG4gICAgICAgIEJVVFRPTl9JTUFHRV9NSURQT0lOVF9YID0gQlVUVE9OX0lNQUdFX1dJRFRIIC8gMixcbiAgICAgICAgaW1hZ2VTdHlsZSA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIC4uLnN0eWxlIH0sXG4gICAgICAgIGxhYmVsID0gc2hvd0xhYmVsID8gYCR7Y2FwU2V4fSAke3NwZWNpZXN9YCA6ICcnLFxuICAgICAgICBsYWJlbEVsZW1lbnQgPSBzaG93TGFiZWwgPyA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBCVVRUT05fSU1BR0VfV0lEVEgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwfX0+e2xhYmVsfTwvZGl2PiA6ICcnO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGV2dCkge1xuICAgIGNvbnN0IGVsdFJlY3QgPSBldnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIGNsaWNrWCA9IGV2dC5jbGllbnRYIC0gZWx0UmVjdC5sZWZ0O1xuXG4gICAgaWYgKHNleCA9PT0gQmlvTG9naWNhLkZFTUFMRSAmJiBjbGlja1ggPiBCVVRUT05fSU1BR0VfTUlEUE9JTlRfWCl7IC8vIHVzZXIgY2xpY2tlZCBvbiBSaWdodCAobWFsZSkgaWNvbiB3aGlsZSBmZW1hbGUgd2FzIHNlbGVjdGVkXG4gICAgICBvbkNoYW5nZShCaW9Mb2dpY2EuTUFMRSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNleCA9PT0gQmlvTG9naWNhLk1BTEUgJiYgY2xpY2tYIDwgQlVUVE9OX0lNQUdFX01JRFBPSU5UX1gpeyAvLyB1c2VyIGNsaWNrZWQgb24gTGVmdCAoZmVtYWxlKSBpY29uIHdoaWxlIG1hbGUgd2FzIHNlbGVjdGVkXG4gICAgICBvbkNoYW5nZShCaW9Mb2dpY2EuRkVNQUxFKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9e2lkfSBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICA8ZGl2ICBjbGFzc05hbWU9e2BnZW5pYmxvY2tzIGNoYW5nZS1zZXgtYnV0dG9ucyAke3NlbGVjdGVkU2V4Q2xhc3N9YH1cbiAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30gPlxuICAgICAgPC9kaXY+XG4gICAgICB7bGFiZWxFbGVtZW50fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hhbmdlU2V4QnV0dG9ucy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZXg6IFByb3BUeXBlcy5vbmVPZihbQmlvTG9naWNhLk1BTEUsIEJpb0xvZ2ljYS5GRU1BTEVdKSxcbiAgc3BlY2llczogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2hvd0xhYmVsOiBQcm9wVHlwZXMuYm9vbCxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaGFuZ2VTZXhCdXR0b25zO1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBub3JtYWw6IHtcbiAgICB3aWR0aDogMjMsXG4gICAgaGVpZ2h0OiAxMjAsXG4gICAgc3BsaXQ6IDQ1XG4gIH0sXG4gIHNtYWxsOiB7XG4gICAgd2lkdGg6IDE5LFxuICAgIGhlaWdodDogOTAsXG4gICAgc3BsaXQ6IDM0XG4gIH1cbn07XG5cbmNvbnN0IGRlZmF1bHRzWSA9IHtcbiAgbm9ybWFsOiB7XG4gICAgd2lkdGg6IDIzLFxuICAgIGhlaWdodDogNzUsXG4gICAgc3BsaXQ6IDM4XG4gIH0sXG4gIHNtYWxsOiB7XG4gICAgd2lkdGg6IDE5LFxuICAgIGhlaWdodDogNjIsXG4gICAgc3BsaXQ6IDMyXG4gIH1cbn07XG5cbmNvbnN0IENocm9tb3NvbWVJbWFnZVZpZXcgPSAoe3dpZHRoLCBoZWlnaHQsIHNwbGl0PTQ1LCBjb2xvcj0nI0ZGOTk5OScsIHNtYWxsPWZhbHNlLCBib2xkPWZhbHNlLCBlbXB0eT1mYWxzZSwgeUNocm9tb3NvbWU9ZmFsc2UsIGRpc3BsYXl9KSA9PiB7XG4gIGlmICghd2lkdGggfHwgIWhlaWdodCkge1xuICAgIGxldCBkZWZhdWx0RGltcyA9IHlDaHJvbW9zb21lID8gZGVmYXVsdHNZIDogZGVmYXVsdHM7XG4gICAgKHt3aWR0aCwgaGVpZ2h0LCBzcGxpdH0gPSBzbWFsbCA/IGRlZmF1bHREaW1zLnNtYWxsIDogZGVmYXVsdERpbXMubm9ybWFsKTtcbiAgfVxuXG4gIGNvbnN0IHJhZGl1cyA9IHdpZHRoLzIsXG4gICAgICAgIGltYWdlV2lkdGggPSB3aWR0aCs0LFxuICAgICAgICBoYWxmSW1hZ2VXaWR0aCA9IGltYWdlV2lkdGgvMixcbiAgICAgICAgaW1hZ2VIZWlnaHQgPSBoZWlnaHQrNDtcblxuICBsZXQgc3Ryb2tlV2lkdGggPSAyO1xuXG4gIGlmIChib2xkKSB7XG4gICAgY29sb3IgPSAnI0ZGNjY2Nic7XG4gICAgc3Ryb2tlV2lkdGggPSAzO1xuICB9XG4gIGlmIChlbXB0eSkge1xuICAgIGNvbG9yID0gJyNGRkYnO1xuICAgIHN0cm9rZVdpZHRoID0gMTtcbiAgfVxuICBsZXQgcG9zaXRpb25TdHlsaW5nID0ge307XG4gIGlmIChkaXNwbGF5KXtcbiAgICBwb3NpdGlvblN0eWxpbmcgPSB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJywgbGVmdDogZGlzcGxheS54LCB0b3A6IGRpc3BsYXkueSwgb3BhY2l0eTogZGlzcGxheS5vcGFjaXR5XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hyb21vc29tZS1pbWFnZVwiIHN0eWxlPXtwb3NpdGlvblN0eWxpbmd9PlxuICAgICAgPHN2ZyB3aWR0aD17aW1hZ2VXaWR0aH0gaGVpZ2h0PXtpbWFnZUhlaWdodH0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8Zz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3JhZGl1cysyfSBjeD17aGFsZkltYWdlV2lkdGh9IHN0cm9rZVdpZHRoPXtzdHJva2VXaWR0aH0gc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGNpcmNsZSByPXtyYWRpdXN9IGN5PXtzcGxpdC1yYWRpdXN9IGN4PXtoYWxmSW1hZ2VXaWR0aH0gc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8Y2lyY2xlIHI9e3JhZGl1c30gY3k9e3NwbGl0K3JhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxjaXJjbGUgcj17cmFkaXVzfSBjeT17aGVpZ2h0LXJhZGl1c30gY3g9e2hhbGZJbWFnZVdpZHRofSBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPXtjb2xvcn0vPlxuICAgICAgICAgIDxyZWN0IGhlaWdodD17KHNwbGl0LXJhZGl1cyktKHJhZGl1cysyKX0gd2lkdGg9e3dpZHRofSB5PXtyYWRpdXMrMn0geD1cIjJcIiBzdHJva2VXaWR0aD1cIjBcIiBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD17Y29sb3J9Lz5cbiAgICAgICAgICA8cmVjdCBoZWlnaHQ9eyhoZWlnaHQtcmFkaXVzKS0oc3BsaXQrcmFkaXVzKX0gd2lkdGg9e3dpZHRofSB5PXtzcGxpdCtyYWRpdXN9IHg9XCIyXCIgc3Ryb2tlV2lkdGg9XCIwXCIgc3Ryb2tlPVwiIzAwMDAwMFwiIGZpbGw9e2NvbG9yfS8+XG4gICAgICAgICAgPGxpbmUgeTE9e3JhZGl1cysyfSAgICAgeDE9XCIyXCIgICAgICAgeTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17cmFkaXVzKzJ9ICAgICB4MT17d2lkdGgrMn0geTI9e3NwbGl0LXJhZGl1cysyfSAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgICAgPGxpbmUgeTE9e3NwbGl0K3JhZGl1c30geDE9XCIyXCIgICAgICAgeTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9XCIyXCIgICAgICAgc3Ryb2tlTGluZWNhcD1cIm51bGxcIiBzdHJva2VMaW5lam9pbj1cIm51bGxcIiBzdHJva2VXaWR0aD17c3Ryb2tlV2lkdGh9IHN0cm9rZT1cIiMwMDAwMDBcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICA8bGluZSB5MT17c3BsaXQrcmFkaXVzfSB4MT17d2lkdGgrMn0geTI9e2hlaWdodC1yYWRpdXN9ICAgeDI9e3dpZHRoKzJ9IHN0cm9rZUxpbmVjYXA9XCJudWxsXCIgc3Ryb2tlTGluZWpvaW49XCJudWxsXCIgc3Ryb2tlV2lkdGg9e3N0cm9rZVdpZHRofSBzdHJva2U9XCIjMDAwMDAwXCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZUltYWdlVmlldy5wcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBlbXB0eTogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENocm9tb3NvbWVJbWFnZVZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDaHJvbW9zb21lSW1hZ2VWaWV3IGZyb20gJy4vY2hyb21vc29tZS1pbWFnZSc7XG5pbXBvcnQgR2VuZUxhYmVsVmlldyBmcm9tICcuL2dlbmUtbGFiZWwnO1xuaW1wb3J0IEFsbGVsZVZpZXcgZnJvbSAnLi9hbGxlbGUnO1xuaW1wb3J0IEdlbmV0aWNzVXRpbHMgZnJvbSAnLi4vdXRpbGl0aWVzL2dlbmV0aWNzLXV0aWxzJztcbmltcG9ydCBBbmltYXRlZENocm9tb3NvbWVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtY2hyb21vc29tZSc7XG4vKipcbiAqIFZpZXcgb2YgYSBzaW5nbGUgY2hyb21vc29tZSwgd2l0aCBvcHRpb25hbCBsYWJlbHMsIHB1bGxkb3ducywgYW5kIGVtYmVkZGVkIGFsbGVsZXMuXG4gKlxuICogRGVmaW5lZCBFSVRIRVIgdXNpbmcgYSBCaW9sb2dpY2EgQ2hyb21vc29tZSBvYmplY3QsIE9SIHdpdGggYSBCaW9sb2dpY2Egb3JnYW5pc20sXG4gKiBjaHJvbW9zb21lIG5hbWUgYW5kIHNpZGUuXG4gKi9cbmNvbnN0IENocm9tb3NvbWVWaWV3ID0gKHtjaHJvbW9zb21lLCBvcmcsIGNocm9tb3NvbWVOYW1lLCBzaWRlLCBoaWRkZW5BbGxlbGVzPVtdLCBzbWFsbD1mYWxzZSwgZWRpdGFibGU9dHJ1ZSwgc2VsZWN0ZWQ9ZmFsc2UsIG9uQWxsZWxlQ2hhbmdlLCBvbkNocm9tb3NvbWVTZWxlY3RlZCwgc2hvd0xhYmVscz10cnVlLCBzaG93QWxsZWxlcz1mYWxzZSwgbGFiZWxzT25SaWdodD10cnVlLCBvcmdOYW1lfSkgPT4ge1xuICB2YXIgY29udGFpbmVyQ2xhc3MgPSBcIml0ZW1zXCIsXG4gICAgICBlbXB0eSA9IGZhbHNlLFxuICAgICAgeUNocm9tb3NvbWUgPSBmYWxzZSxcbiAgICAgIGxhYmVsc0NvbnRhaW5lciwgYWxsZWxlc0NvbnRhaW5lciwgY2hyb21JZDtcblxuICBpZiAob3JnICYmIGNocm9tb3NvbWVOYW1lICYmIHNpZGUpIHtcbiAgICBjaHJvbW9zb21lID0gb3JnLmdldEdlbm90eXBlKCkuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdW3NpZGVdO1xuICB9XG5cbiAgaWYgKGNocm9tb3NvbWUpIHtcbiAgICBsZXQgYWxsZWxlcyA9IGNocm9tb3NvbWUuYWxsZWxlcyxcbiAgICAgICAgdmlzaWJsZUFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmZpbHRlckFsbGVsZXMoYWxsZWxlcywgaGlkZGVuQWxsZWxlcywgY2hyb21vc29tZS5zcGVjaWVzKTtcblxuICAgIGlmIChzaG93TGFiZWxzKSB7XG4gICAgICBsZXQgbGFiZWxzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxHZW5lTGFiZWxWaWV3IGtleT17YX0gc3BlY2llcz17Y2hyb21vc29tZS5zcGVjaWVzfSBhbGxlbGU9e2F9IGVkaXRhYmxlPXtlZGl0YWJsZX1cbiAgICAgICAgICBvbkFsbGVsZUNoYW5nZT17ZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIG9uQWxsZWxlQ2hhbmdlKGEsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgICApO1xuICAgICAgfSk7XG5cbiAgICAgIGxhYmVsc0NvbnRhaW5lciA9IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYWJlbHNcIj5cbiAgICAgICAgICB7IGxhYmVscyB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcblxuICAgICAgaWYgKCFsYWJlbHNPblJpZ2h0KSB7XG4gICAgICAgIGNvbnRhaW5lckNsYXNzICs9IFwiIHJ0bFwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG93QWxsZWxlcykge1xuICAgICAgbGV0IGFsbGVsZVN5bWJvbHMgPSB2aXNpYmxlQWxsZWxlcy5tYXAoYSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEFsbGVsZVZpZXcga2V5PXthfSBhbGxlbGU9e2F9IC8+XG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgYWxsZWxlc0NvbnRhaW5lciA9IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGxlbGVzXCI+XG4gICAgICAgICAgeyBhbGxlbGVTeW1ib2xzIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChjaHJvbW9zb21lLnNpZGUgPT09IFwieVwiKSB7XG4gICAgICB5Q2hyb21vc29tZSA9IHRydWU7XG4gICAgfVxuXG4gICAgY2hyb21JZCA9IG9yZ05hbWUgKyBjaHJvbW9zb21lLmNocm9tb3NvbWUgKyBjaHJvbW9zb21lLnNpZGU7XG4gIH0gZWxzZSB7XG4gICAgY2hyb21JZCA9IG9yZ05hbWU7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9XG4gIGNvbnN0IGhhbmRsZVNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChvbkNocm9tb3NvbWVTZWxlY3RlZCkge1xuICAgICAgb25DaHJvbW9zb21lU2VsZWN0ZWQoKTtcbiAgICB9XG4gIH07XG4gIGxldCBhbmltYXRlZENocm9tb3NvbWU7XG4gIGNvbnN0IG9uUmVzdCA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coXCJvbiByZXN0XCIpO1xuICB9O1xuXG5cbiAgYW5pbWF0ZWRDaHJvbW9zb21lID0gPEFuaW1hdGVkQ2hyb21vc29tZVZpZXcgb3JnPXtvcmd9IGlkPXtjaHJvbW9zb21lTmFtZX0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25SZXN0PXtvblJlc3R9IHNlbGVjdGVkPXtzZWxlY3RlZH0gc21hbGw9e3NtYWxsfSBzdGFydFBvc2l0aW9uSWQ9e2Nocm9tSWR9IHRhcmdldFBvc2l0aW9uSWQ9e29yZ05hbWV9Lz47XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1jb250YWluZXJcIiBvbkNsaWNrPXsgaGFuZGxlU2VsZWN0IH0gPlxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjb250YWluZXJDbGFzcyB9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNocm9tb3NvbWUtYWxsZWxlLWNvbnRhaW5lclwiIGlkPXtjaHJvbUlkfT5cbiAgICAgICAgICA8Q2hyb21vc29tZUltYWdlVmlldyBzbWFsbD17c21hbGx9IGVtcHR5PXtlbXB0eX0gYm9sZD17c2VsZWN0ZWR9IHlDaHJvbW9zb21lPXt5Q2hyb21vc29tZX0vPlxuICAgICAgICAgIHsgYWxsZWxlc0NvbnRhaW5lciB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7IGxhYmVsc0NvbnRhaW5lciB9XG4gICAgICAgIHsgYW5pbWF0ZWRDaHJvbW9zb21lIH1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuQ2hyb21vc29tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QsXG4gIGNocm9tb3NvbWVOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaWRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjaHJvbW9zb21lOiBQcm9wVHlwZXMub2JqZWN0LFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGVkaXRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2hvd0xhYmVsczogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dBbGxlbGVzOiBQcm9wVHlwZXMuYm9vbCxcbiAgbGFiZWxzT25SaWdodDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DaHJvbW9zb21lU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDaHJvbW9zb21lVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIFVzZXMgYW4gU1ZHIGNpcmN1bGFyIGdyYWRpZW50IHRvIGltcGxlbWVudCBhIGZhZGluZyBnbG93IGJhY2tncm91bmQuXG4gKiBJbXBsZW1lbnRlZCBhcyBhIHN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB0aGUgY29sb3Igb2YgdGhlIGNpcmN1bGFyIGdyYWRpZW50IFwiZ2xvd1wiXG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZSAtIHRoZSBkaWFtZXRlciBvZiB0aGUgY2lyY3VsYXIgZ3JhZGllbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIHN0eWxlcyBhcHBsaWVkIHRvIHRoZSBvdXRlciBkaXZcbiAqL1xuY29uc3QgQ2lyY3VsYXJHbG93VmlldyA9ICh7aWQsIGNvbG9yLCBzaXplLCBzdHlsZX0pID0+IHtcbiAgbGV0IHJhZGl1cyA9IHNpemUvMixcbiAgICAgIGNvbG9yTm9IYXNoID0gY29sb3IucmVwbGFjZSgnIycsICcnKSxcbiAgICAgIGdyYWRpZW50SUQgPSBgQ2lyY3VsYXJHbG93Vmlld18ke2lkIHx8IGNvbG9yTm9IYXNofWAsXG4gICAgICBncmFkaWVudElEVXJsID0gYHVybCgjJHtncmFkaWVudElEfSlgO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIGNpcmN1bGFyLWdsb3dcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgPHN2ZyB3aWR0aD17c2l6ZSsyfSBoZWlnaHQ9e3NpemUrMn0geG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICA8ZGVmcz5cbiAgICAgICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9e2dyYWRpZW50SUR9PlxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wQ29sb3I9e2NvbG9yfSBzdG9wT3BhY2l0eT1cIjEuMFwiLz5cbiAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wQ29sb3I9e2NvbG9yfSBzdG9wT3BhY2l0eT1cIjAuMFwiLz5cbiAgICAgICAgICA8L3JhZGlhbEdyYWRpZW50PlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxjaXJjbGUgZmlsbD17Z3JhZGllbnRJRFVybH0gY3g9e3JhZGl1c30gY3k9e3JhZGl1c30gcj17cmFkaXVzfSAvPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5DaXJjdWxhckdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENpcmN1bGFyR2xvd1ZpZXc7XG4iLCJpbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIGEgcmVjdGFuZ3VsYXIgdGV4dCBhcmVhIGZvciBwcm92aWRpbmcgZmVlZGJhY2sgdG8gdXNlcnMsIHN1Y2ggYXNcbiAqIHRoYXQgdXNlZCBpbiBHZW5pdmVyc2UncyBjaGFsbGVuZ2VzIGZvciBwcm92aWRpbmcgdHJpYWwgYW5kIGdvYWwgZmVlZGJhY2suXG4gKiBJbXBsZW1lbnRlZCBhcyBhIFJlYWN0IHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gdGV4dCAtIGEgc2luZ2xlIG9yIG11bHRpcGxlIGxpbmVzIG9mIHRleHQgdG8gZGlzcGxheVxuICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gaW5saW5lIHN0eWxlcyBhcHBsaWVkIHRvIHRoZSA8ZGl2PiBjb250YWluaW5nIGVhY2ggbGluZSBvZiB0ZXh0XG4gKi9cbmNvbnN0IEZlZWRiYWNrVmlldyA9ICh7dGV4dCwgc3R5bGU9e319KSA9PiB7XG4gIGNvbnN0IHRUZXh0ID0gQXJyYXkuaXNBcnJheSh0ZXh0KSA/IHRleHQgOiBbdGV4dF0sXG4gICAgICAgIGxpbmVDb3VudCA9IHRUZXh0Lmxlbmd0aCxcbiAgICAgICAgaGVpZ2h0ID0gMjAgKiBsaW5lQ291bnQgKyAyLFxuICAgICAgICBkZWZhdWx0U3R5bGUgPSB7IGhlaWdodDogaGVpZ2h0LCAuLi5zdHlsZSB9LFxuICAgICAgICB0ZXh0TGluZXMgPSB0VGV4dC5tYXAoKGlUZXh0LCBpbmRleCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2sgdGV4dC1saW5lXCIga2V5PXtpbmRleH0+e2lUZXh0fTwvZGl2Pik7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZmVlZGJhY2stdmlld1wiIHN0eWxlPXtkZWZhdWx0U3R5bGV9PlxuICAgICAge3RleHRMaW5lc31cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkZlZWRiYWNrVmlldy5wcm9wVHlwZXMgPSB7XG4gIHRleHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZlZWRiYWNrVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFuaW1hdGVkR2FtZXRlVmlldyBmcm9tICcuL2FuaW1hdGVkLWdhbWV0ZSc7XG5cbmNvbnN0IElOSVRJQUxfR0FNRVRFX1NJWkUgPSAzMCxcbiAgICAgIEZJTkFMX0dBTUVURV9TSVpFID0gMTQwLFxuICAgICAgUkVTVElOR19NT1RIRVJfR0FNRVRFX1ggPSAwLFxuICAgICAgUkVTVElOR19GQVRIRVJfR0FNRVRFX1ggPSAxNTAsXG4gICAgICBGRVJUSUxJWklOR19NT1RIRVJfR0FNRVRFX1ggPSA3MCxcbiAgICAgIEZFUlRJTElaSU5HX0ZBVEhFUl9HQU1FVEVfWCA9IDgwLFxuICAgICAgRklOQUxfWllHT1RFX1kgPSAtMTUwO1xuXG5leHBvcnQgY29uc3QgR0FNRVRFX1RZUEUgPSB7IE1PVEhFUjogJ21vdGhlcicsIEZBVEhFUjogJ2ZhdGhlcicgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmVydGlsaXppbmdHYW1ldGVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHR5cGU6IFByb3BUeXBlcy5vbmVPZihbIEdBTUVURV9UWVBFLk1PVEhFUiwgR0FNRVRFX1RZUEUuRkFUSEVSIF0pLmlzUmVxdWlyZWQsXG4gICAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaWQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBmZXJ0aWxpemF0aW9uU3RhdGU6IFByb3BUeXBlcy5vbmVPZihbJ25vbmUnLCAnZmVydGlsaXppbmcnLCAnZmVydGlsaXplZCcsICdjb21wbGV0ZSddKS5pc1JlcXVpcmVkLFxuICAgIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHNyY1JlY3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGRzdFJlY3Q6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBsZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICAgIH0pLFxuICAgIGFuaW1TdGlmZm5lc3M6IFByb3BUeXBlcy5udW1iZXIsICAvLyBzdGlmZm5lc3Mgb2Ygc3ByaW5nIGZvciBhbmltYXRpb24gKGRlZmF1bHQ6IDEwMClcbiAgICBvblJlc3Q6IFByb3BUeXBlcy5mdW5jXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhpZGRlbkFsbGVsZXM6IFtdLFxuICAgIGFuaW1TdGlmZm5lc3M6IDEwMFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIgPSAoKSA9PiB7XG4gICAgbGV0IHtnYW1ldGUsIGlkLCBoaWRkZW5BbGxlbGVzLCBhbmltU3RpZmZuZXNzLCBvblJlc3R9ID0gdGhpcy5wcm9wcyxcbiAgICAgICAgeE9mZnNldCA9IHRoaXMucHJvcHMuc3JjUmVjdCA/IHRoaXMucHJvcHMuc3JjUmVjdC5sZWZ0IC0gdGhpcy5wcm9wcy5kc3RSZWN0LmxlZnQgOiAwLFxuICAgICAgICB5T2Zmc2V0ID0gdGhpcy5wcm9wcy5zcmNSZWN0ID8gdGhpcy5wcm9wcy5zcmNSZWN0LnRvcCAtIHRoaXMucHJvcHMuZHN0UmVjdC50b3AgOiAwLFxuICAgICAgICB4UmVzdGluZyA9IHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSID8gUkVTVElOR19GQVRIRVJfR0FNRVRFX1hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFJFU1RJTkdfTU9USEVSX0dBTUVURV9YLFxuICAgICAgICB4RmVydGlsaXppbmcgPSB0aGlzLnByb3BzLnR5cGUgPT09IEdBTUVURV9UWVBFLkZBVEhFUiA/IEZFUlRJTElaSU5HX0ZBVEhFUl9HQU1FVEVfWFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IEZFUlRJTElaSU5HX01PVEhFUl9HQU1FVEVfWCxcbiAgICAgICAgaW5pdGlhbCwgdEZpbmFsO1xuXG4gICAgaWYgKCFnYW1ldGUgfHwgKGlkID09IG51bGwpKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdub25lJykge1xuICAgICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gR0FNRVRFX1RZUEUuRkFUSEVSKVxuICAgICAgICB4T2Zmc2V0ICs9IFJFU1RJTkdfRkFUSEVSX0dBTUVURV9YO1xuICAgICAgaW5pdGlhbCA9IHsgeDogeE9mZnNldCwgeTogeU9mZnNldCwgc2l6ZTogSU5JVElBTF9HQU1FVEVfU0laRSB9O1xuICAgICAgdEZpbmFsID0geyB4OiB4UmVzdGluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5wcm9wcy5mZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdmZXJ0aWxpemluZycpIHtcbiAgICAgIGluaXRpYWwgPSB7IHg6IHhSZXN0aW5nLCB5OiAwLCBzaXplOiBGSU5BTF9HQU1FVEVfU0laRSwgb3BhY2l0eTogMS4wIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogMCwgc2l6ZTogRklOQUxfR0FNRVRFX1NJWkUsIHJvdGF0aW9uOiAwLCBvcGFjaXR5OiAxLjAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbml0aWFsID0geyB4OiB4RmVydGlsaXppbmcsIHk6IDAsIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMS4wIH07XG4gICAgICB0RmluYWwgPSB7IHg6IHhGZXJ0aWxpemluZywgeTogRklOQUxfWllHT1RFX1ksIHNpemU6IEZJTkFMX0dBTUVURV9TSVpFLCByb3RhdGlvbjogMCwgb3BhY2l0eTogMC4wIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBbmltYXRlZEdhbWV0ZVZpZXcgZ2FtZXRlPXtnYW1ldGV9IGlkPXtpZH0gaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e2luaXRpYWx9IGRpc3BsYXk9e3RGaW5hbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVN0aWZmbmVzcz17YW5pbVN0aWZmbmVzc30gb25SZXN0PXtvblJlc3R9IC8+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQW5pbWF0ZWRHYW1ldGVWaWV3IGZyb20gJy4vYW5pbWF0ZWQtZ2FtZXRlJztcblxuY29uc3QgR2FtZXRlUG9vbFZpZXcgPSAoe2dhbWV0ZXMsIGhpZGRlbkFsbGVsZXM9W10sIHdpZHRoPTMwMCwgaGVpZ2h0PTIwMCwgYW5pbVN0aWZmbmVzcz02MCwgc2VsZWN0ZWRJZCwgaXNHYW1ldGVEaXNhYmxlZCwgb25HYW1ldGVTZWxlY3RlZH0pID0+IHtcbiAgbGV0IGdhbWV0ZUNvdW50ID0gZ2FtZXRlcy5sZW5ndGgsXG4gICAgICBnYW1ldGVTaXplID0gMzAsXG4gICAgICBtYXJnaW4gPSA1LFxuICAgICAgc3BhY2luZ0RlZmF1bHQgPSBnYW1ldGVTaXplICsgMiAqIG1hcmdpbixcbiAgICAgIHhTcGFjaW5nID0gc3BhY2luZ0RlZmF1bHQsXG4gICAgICB5U3BhY2luZyA9IHNwYWNpbmdEZWZhdWx0LFxuICAgICAgY29sRGVmYXVsdCA9IE1hdGguZmxvb3Iod2lkdGggLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICByb3dEZWZhdWx0ID0gTWF0aC5mbG9vcihoZWlnaHQgLyBzcGFjaW5nRGVmYXVsdCksXG4gICAgICBlbmFibGVkQ291bnQgPSAwLFxuICAgICAgZGlzYWJsZWRDb3VudCA9IDAsXG4gICAgICBkaXNhYmxlZEZsYWdzID0gaXNHYW1ldGVEaXNhYmxlZCA/IGdhbWV0ZXMubWFwKGcgPT4gaXNHYW1ldGVEaXNhYmxlZChnKSkgOiBbXSxcbiAgICAgIHRvdGFsRGlzYWJsZWRDb3VudCA9IGRpc2FibGVkRmxhZ3MucmVkdWNlKCh0b3RhbCxmbGFnKSA9PiB0b3RhbCArIGZsYWcsIDApLFxuICAgICAgLy8gbGVhdmUgcm9vbSBmb3IgdGhlIGRpc2FibGVkIGdhbWV0ZSByb3cgaWYgdGhlcmUgYXJlIGRpc2FibGVkIGdhbWV0ZXNcbiAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGhlaWdodCAtICh0b3RhbERpc2FibGVkQ291bnQgPyBzcGFjaW5nRGVmYXVsdCA6IDApIC0gNCAqIG1hcmdpbixcbiAgICAgIC8vIHBhY2sgdGhlIGRpc2FibGVkIGdhbWV0ZXMgaW50byB0aGUgZGlzYWJsZWQgcm93XG4gICAgICB4RGlzYWJsZWRTcGFjaW5nID0gTWF0aC5taW4oeFNwYWNpbmcgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aWR0aCAtIDcgKiBtYXJnaW4pIC8gdG90YWxEaXNhYmxlZENvdW50KSxcbiAgICAgIHlEaXNhYmxlZFNwYWNpbmcgPSBzcGFjaW5nRGVmYXVsdCxcbiAgICAgIHRvdGFsRW5hYmxlZENvdW50ID0gZ2FtZXRlQ291bnQgLSB0b3RhbERpc2FibGVkQ291bnQsXG4gICAgICBnYW1ldGVWaWV3cztcblxuICAvLyBzcXVlZXplIGluIHRvIG1ha2Ugcm9vbSBmb3IgYWRkaXRpb25hbCBnYW1ldGVzIGlmIG5lY2Vzc2FyeVxuICB2YXIgY29sQ291bnQgPSBjb2xEZWZhdWx0LFxuICAgICAgcm93Q291bnQgPSByb3dEZWZhdWx0IC0gKHRvdGFsRGlzYWJsZWRDb3VudCA+IDApO1xuICB3aGlsZSAoY29sQ291bnQgKiByb3dDb3VudCA8IHRvdGFsRW5hYmxlZENvdW50KSB7XG4gICAgaWYgKHlTcGFjaW5nID4geFNwYWNpbmcpIHtcbiAgICAgIHlTcGFjaW5nID0gYXZhaWxhYmxlSGVpZ2h0IC8gKytyb3dDb3VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB4U3BhY2luZyA9ICh3aWR0aCAtIDQgKiBtYXJnaW4pIC8gKytjb2xDb3VudDtcbiAgICB9XG4gIH1cblxuICBnYW1ldGVWaWV3cyA9IGdhbWV0ZXMubWFwKChnYW1ldGUsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkRmxhZ3NbaW5kZXhdLFxuICAgICAgICAgIGxheW91dEluZGV4ID0gaXNEaXNhYmxlZCA/IGRpc2FibGVkQ291bnQrKyA6IGVuYWJsZWRDb3VudCsrLFxuICAgICAgICAgIHJvdyA9IGlzRGlzYWJsZWQgPyByb3dEZWZhdWx0IC0gMSA6IE1hdGguZmxvb3IobGF5b3V0SW5kZXggLyBjb2xDb3VudCksXG4gICAgICAgICAgY29sID0gaXNEaXNhYmxlZCA/IGxheW91dEluZGV4IDogbGF5b3V0SW5kZXggJSBjb2xDb3VudCxcbiAgICAgICAgICB5ID0gaXNEaXNhYmxlZCA/IHJvdyAqIHlEaXNhYmxlZFNwYWNpbmcgOiByb3cgKiB5U3BhY2luZyxcbiAgICAgICAgICB4ID0gaXNEaXNhYmxlZCA/IGNvbCAqIHhEaXNhYmxlZFNwYWNpbmcgOiBjb2wgKiB4U3BhY2luZztcbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdGVkR2FtZXRlVmlldyBnYW1ldGU9e2dhbWV0ZX0gaWQ9e2luZGV4ICsgMX0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuQWxsZWxlcz17aGlkZGVuQWxsZWxlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh3aWR0aC8yKSwgeTogLU1hdGgucm91bmQoeVNwYWNpbmcpIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9e3sgeDogTWF0aC5yb3VuZCh4KSwgeTogTWF0aC5yb3VuZCh5KSB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltU3RpZmZuZXNzPXthbmltU3RpZmZuZXNzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtpbmRleCArIDEgPT09IHNlbGVjdGVkSWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uR2FtZXRlU2VsZWN0ZWR9IC8+XG4gICAgKTtcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2FtZXRlLXBvb2xcIiBzdHlsZT17eyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH19PlxuICAgICAgeyBnYW1ldGVWaWV3cyB9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVQb29sVmlldy5wcm9wVHlwZXMgPSB7XG4gIGdhbWV0ZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBhbmltU3RpZmZuZXNzOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzZWxlY3RlZElkOiBQcm9wVHlwZXMubnVtYmVyLFxuICBpc0dhbWV0ZURpc2FibGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25HYW1ldGVTZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWV0ZVBvb2xWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogU3RhdGVsZXNzIGZ1bmN0aW9uYWwgUmVhY3QgY29tcG9uZW50IGZvciBkaXNwbGF5aW5nIGEgQmlvbG9naWNhIGdhbWV0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBnYW1ldGUgLSBCaW9sb2dpY2EgZ2FtZXRlIChtYXAgb2YgY2hyb21vc29tZSBuYW1lcyB0byBjaHJvbW9zb21lcylcbiAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSB1bmlxdWUgaWQgb2YgdGhpcyBnYW1ldGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IGhpZGRlbkFsbGVsZXMgLSBpbmRpdmlkdWFsIGFsbGVsZXMgb2YgZ2VuZXMgZm9yIHdoaWNoIGFsbCBhbGxlbGVzIHNob3VsZCBiZSBoaWRkZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkaXNwbGF5IC0gZGlzcGxheSBwYXJhbWV0ZXJzIHVzZWQgdG8gcmVwcmVzZW50IHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXNwbGF5LnggLSBsb2NhdGlvbiAobGVmdCkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3BsYXkueSAtIGxvY2F0aW9uICh0b3ApIG9mIHRoZSBnYW1ldGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGlzcGxheS5zaXplPTMwXSAtIHNpemUgKHdpZHRoICYgaGVpZ2h0KSBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkucm90YXRpb249MF0gLSByb3RhdGlvbiBvZiB0aGUgZ2FtZXRlXG4gKiBAcGFyYW0ge251bWJlcn0gW2Rpc3BsYXkub3BhY2l0eT0xXSAtIG9wYWNpdHkgb2YgdGhlIGdhbWV0ZVxuICogQHBhcmFtIHtib29sZWFufSBbaXNTZWxlY3RlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdzZWxlY3RlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtib29sZWFufSBbaXNEaXNhYmxlZD1mYWxzZV0gLSB3aGV0aGVyIHRoZSBnYW1ldGUgc2hvdWxkIGhhdmUgdGhlICdkaXNhYmxlZCcgY2xhc3MgYXBwbGllZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29uQ2xpY2soZXZ0LCBpZCwgcmVjdCldIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGdhbWV0ZSBpcyBjbGlja2VkXG4gKlxuICogTm90ZTogQXMgdGhpbmdzIHN0YW5kIGN1cnJlbnRseSwgdGhlcmUgaXMgX25vXyBwYXJ0aWN1bGFyIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnYW1ldGUgZGVmaW5lZFxuICogYnkgdGhpcyB2aWV3LiBUaGUgY2xpZW50IGNhbiBzdHlsZSB0aGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWV0ZSBieSBzdHlsaW5nIHRoZVxuICogJy5nZW5pYmxvY2tzLmdhbWV0ZScgY2xhc3MgaW4gQ1NTLCBlLmcuIGJ5IGFzc2lnbmluZyBhIGJhY2tncm91bmQtaW1hZ2UuXG4gKi9cbmNvbnN0IEdhbWV0ZVZpZXcgPSAoe2dhbWV0ZSwgaWQsIGhpZGRlbkFsbGVsZXM9W10sIGRpc3BsYXksIGlzU2VsZWN0ZWQ9ZmFsc2UsIGlzRGlzYWJsZWQ9ZmFsc2UsIG9uQ2xpY2t9KSA9PiB7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZXZ0KSB7XG4gICAgY29uc3QgZWx0ID0gZXZ0LnRhcmdldCxcbiAgICAgICAgICByZWN0ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICghaXNEaXNhYmxlZCAmJiBvbkNsaWNrKSB7XG4gICAgICBvbkNsaWNrKGV2dCwgaWQsIHJlY3QpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkVG9vbHRpcEZvckdhbWV0ZShnYW1ldGUpIHtcbiAgICBsZXQgdG9vbHRpcCA9IFwiXCIsXG4gICAgICAgIGFsbEhpZGRlbkFsbGVsZXM7XG4gICAgLy8gTm90ZTogaXQgd291bGQgYmUgbW9yZSBlZmZpY2llbnQgZm9yIHRoZSBjYWxsZXIgdG8gcGFzcyBpbiB0aGVcbiAgICAvLyBhbGxIaWRkZW5BbGxlbGVzIGFycmF5IHJhdGhlciB0aGFuIGNvbXB1dGluZyBpdCBlYWNoIHRpbWUgaGVyZS5cbiAgICAvLyBCdXQgaWYgd2UgbW92ZWQgaXQgb3V0IHJpZ2h0IG5vdyB3ZSdkIGhhdmUgdG8gZWxpbWluYXRlIHRoZSBFUzYgc3BsYXQuXG4gICAgZnVuY3Rpb24gY29uY2F0SGlkZGVuQWxsZWxlcyhpU3BlY2llcywgaUhpZGRlbkFsbGVsZXMpIHtcbiAgICAgIGFsbEhpZGRlbkFsbGVsZXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIGlIaWRkZW5BbGxlbGVzKSB7XG4gICAgICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKGlTcGVjaWVzLCBhbGxlbGUpO1xuICAgICAgICBhbGxIaWRkZW5BbGxlbGVzLnB1c2goLi4uZ2VuZS5hbGxlbGVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBjaCBpbiBnYW1ldGUpIHtcbiAgICAgIHZhciBjaHJvbW9zb21lID0gZ2FtZXRlW2NoXTtcbiAgICAgIGlmIChhbGxIaWRkZW5BbGxlbGVzID09IG51bGwpXG4gICAgICAgIGNvbmNhdEhpZGRlbkFsbGVsZXMoY2hyb21vc29tZS5zcGVjaWVzLCBoaWRkZW5BbGxlbGVzKTtcbiAgICAgIGZvciAoY29uc3QgYWxsZWxlIG9mIGNocm9tb3NvbWUuYWxsZWxlcykge1xuICAgICAgICBpZiAoYWxsSGlkZGVuQWxsZWxlcy5pbmRleE9mKGFsbGVsZSkgPCAwKSB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBjaHJvbW9zb21lLnNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYWxsZWxlXTtcbiAgICAgICAgICB0b29sdGlwICs9ICh0b29sdGlwID8gJ1xcbicgOiAnJykgKyBjaCArICc6ICcgKyBsYWJlbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoID09PSAnWFknKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gY2hyb21vc29tZS5zaWRlID09PSAneScgPyAneScgOiAneCc7XG4gICAgICAgIHRvb2x0aXAgKz0gKHRvb2x0aXAgPyAnXFxuJyA6ICcnKSArIGNoICsgJzogJyArIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9vbHRpcDtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGVkQ2xhc3MgPSBpc1NlbGVjdGVkICYmICFpc0Rpc2FibGVkID8gXCJzZWxlY3RlZFwiIDogXCJcIixcbiAgICAgICAgZGlzYWJsZWRDbGFzcyA9IGlzRGlzYWJsZWQgPyBcImRpc2FibGVkXCIgOiBcIlwiLFxuICAgICAgICBncm91cCA9IGlkICUgNCxcbiAgICAgICAgcm90YXRpb25Gb3JHcm91cCA9IGdyb3VwICogOTAsXG4gICAgICAgIGNsYXNzZXMgPSBgZ2VuaWJsb2NrcyBnYW1ldGUgJHtzZWxlY3RlZENsYXNzfSAke2Rpc2FibGVkQ2xhc3N9IGdyb3VwJHtncm91cH1gLFxuICAgICAgICBzaXplID0gZGlzcGxheS5zaXplIHx8IDMwLFxuICAgICAgICByb3RhdGlvbiA9IGRpc3BsYXkucm90YXRpb24gIT0gbnVsbCA/IGRpc3BsYXkucm90YXRpb24gOiByb3RhdGlvbkZvckdyb3VwLFxuICAgICAgICB0cmFuc2Zvcm0gPSByb3RhdGlvbiA/IGByb3RhdGUoJHtyb3RhdGlvbn1kZWcpYCA6ICcnLFxuICAgICAgICBvcGFjaXR5ID0gZGlzcGxheS5vcGFjaXR5ICE9IG51bGwgPyBkaXNwbGF5Lm9wYWNpdHkgOiAxLjAsXG4gICAgICAgIHRvb2x0aXAgPSBidWlsZFRvb2x0aXBGb3JHYW1ldGUoZ2FtZXRlKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gdGl0bGU9e3Rvb2x0aXB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkueCwgdG9wOiBkaXNwbGF5LnksXG4gICAgICAgICAgICB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgdHJhbnNmb3JtLCBvcGFjaXR5XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja30+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5HYW1ldGVWaWV3LnByb3BUeXBlcyA9IHtcbiAgZ2FtZXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhpZGRlbkFsbGVsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBkaXNwbGF5OiBQcm9wVHlwZXMuc2hhcGUoeyAgICAgICAgLy8gZGlzcGxheSBwcm9wZXJ0aWVzXG4gICAgeDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAobGVmdCkgb2YgZ2FtZXRlIGltYWdlXG4gICAgeTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyBsb2NhdGlvbiAodG9wKSBvZiBnYW1ldGUgaW1hZ2VcbiAgICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgIC8vIHNpemUgb2YgZ2FtZXRlIGltYWdlIChkZWZhdWx0OiAzMClcbiAgICByb3RhdGlvbjogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIHJvdGF0aW9uIChkZWcpIG9mIGdhbWV0ZSBpbWFnZSAoZGVmYXVsdDogMHw5MHwxODB8MjcwKVxuICAgIG9wYWNpdHk6IFByb3BUeXBlcy5udW1iZXIgICAgICAgLy8gb3BhY2l0eSBvZiBnYW1ldGUgaW1hZ2UgKGRlZmF1bHQ6IDEuMClcbiAgfSkuaXNSZXF1aXJlZCxcbiAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZXRlVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFsbGVsZVZpZXcgZnJvbSAnLi9hbGxlbGUnO1xuXG5jb25zdCBHZW5lTGFiZWxWaWV3ID0gKHtzcGVjaWVzLCBhbGxlbGUsIGVkaXRhYmxlPWZhbHNlLCBvbkFsbGVsZUNoYW5nZX0pID0+IHtcbiAgaWYgKCFlZGl0YWJsZSkge1xuICAgIGNvbnN0IGFsbGVsZU5hbWUgPSBzcGVjaWVzLmFsbGVsZUxhYmVsTWFwW2FsbGVsZV07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5lLWxhYmVsIGFsbGVsZSBub25lZGl0YWJsZVwiPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7IGFsbGVsZU5hbWUgfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGFsbGVsZXMgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGFsbGVsZSkuYWxsZWxlcyxcbiAgICAgICAgICBhbGxlbGVOYW1lcyA9IGFsbGVsZXMubWFwKGEgPT4gc3BlY2llcy5hbGxlbGVMYWJlbE1hcFthXSksXG4gICAgICAgICAgYWxsZWxlT3B0aW9ucyA9IGFsbGVsZU5hbWVzLm1hcCgobmFtZSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtuYW1lfSB2YWx1ZT17YWxsZWxlc1tpXX0+e25hbWV9PC9vcHRpb24+KVxuICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2VuZS1sYWJlbCBhbGxlbGUgZWRpdGFibGVcIj5cbiAgICAgICAgPHNlbGVjdCB2YWx1ZT17IGFsbGVsZSB9IG9uQ2hhbmdlPXsgb25BbGxlbGVDaGFuZ2UgfT5cbiAgICAgICAgICB7IGFsbGVsZU9wdGlvbnMgfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbkdlbmVMYWJlbFZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGFsbGVsZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2VuZUxhYmVsVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENocm9tb3NvbWVJbWFnZVZpZXcgZnJvbSAnLi9jaHJvbW9zb21lLWltYWdlJztcbmltcG9ydCBHZW5ldGljc1V0aWxzIGZyb20gJy4uL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG5cbmxldCBUZXN0UHVsbGRvd25WaWV3ID0gKHtzcGVjaWVzLCBnZW5lLCBzZWxlY3Rpb24sIG9uU2VsZWN0aW9uQ2hhbmdlfSkgPT4ge1xuICAgICAgbGV0IGFsbGVsZXMgPSBnZW5lLmFsbGVsZXMsXG4gICAgICAgICAgYWxsZWxlTmFtZXMgPSBhbGxlbGVzLm1hcChhID0+IHNwZWNpZXMuYWxsZWxlTGFiZWxNYXBbYV0pLFxuICAgICAgICAgIG51bUFsbGVsZXMgPSBhbGxlbGVOYW1lcy5sZW5ndGgsXG4gICAgICAgICAgcG9zc2libGVDb21ib3MgPSBbXSxcbiAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gc2VsZWN0aW9uIHx8IFwicGxhY2Vob2xkZXJcIixcbiAgICAgICAgICBpLCBqO1xuXG4gICAgICBwb3NzaWJsZUNvbWJvcy5wdXNoKDxvcHRpb24ga2V5PVwicGxhY2Vob2xkZXJcIiB2YWx1ZT1cInBsYWNlaG9sZGVyXCIgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiPlNlbGVjdCBhIEdlbm90eXBlPC9vcHRpb24+KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG51bUFsbGVsZXM7IGkrKykge1xuICAgICAgICBmb3IgKGogPSBpOyBqIDwgbnVtQWxsZWxlczsgaisrKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGkgKyBcIiBcIiArIGosXG4gICAgICAgICAgICAgIHN0cmluZyA9IGFsbGVsZU5hbWVzW2ldICsgXCIgLyBcIiArIGFsbGVsZU5hbWVzW2pdO1xuICAgICAgICAgIHBvc3NpYmxlQ29tYm9zLnB1c2goPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2tleX0+e3N0cmluZ308L29wdGlvbj4pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0LXdyYXBwZXJcIj5cbiAgICAgICAgICA8c2VsZWN0IHZhbHVlPXsgY3VycmVudFNlbGVjdGlvbiB9IG9uQ2hhbmdlPXsgb25TZWxlY3Rpb25DaGFuZ2UgfT5cbiAgICAgICAgICAgIHsgcG9zc2libGVDb21ib3MgfVxuICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfTtcblxuY29uc3QgR2Vub21lVGVzdFZpZXcgPSAoe29yZywgaGlkZGVuQWxsZWxlcz1bXSwgc2VsZWN0aW9uPXt9LCBvblNlbGVjdGlvbkNoYW5nZX0pID0+IHtcbiAgbGV0IHBhaXJXcmFwcGVycyA9IFtdO1xuICBmb3IgKGxldCBjaHJvbW9zb21lTmFtZSBvZiBvcmcuc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBvcmcuZ2VuZXRpY3MuZ2Vub3R5cGUuY2hyb21vc29tZXNbY2hyb21vc29tZU5hbWVdLFxuICAgICAgICBhbGxlbGVzID0gY2hyb21bT2JqZWN0LmtleXMoY2hyb20pWzBdXS5hbGxlbGVzLFxuICAgICAgICB2aXNpYmxlQWxsZWxlcyA9IEdlbmV0aWNzVXRpbHMuZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBvcmcuc3BlY2llcyksXG4gICAgICAgIGdlbmVzID0gdmlzaWJsZUFsbGVsZXMubWFwKGEgPT4gQmlvTG9naWNhLkdlbmV0aWNzLmdldEdlbmVPZkFsbGVsZShvcmcuc3BlY2llcywgYSkpLFxuICAgICAgICBwdWxsZG93bnMgPSBnZW5lcy5tYXAoZyA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXN0UHVsbGRvd25WaWV3XG4gICAgICAgICAgICAgIGtleSAgICAgICA9IHsgZy5uYW1lIH1cbiAgICAgICAgICAgICAgc3BlY2llcyAgID0geyBvcmcuc3BlY2llcyB9XG4gICAgICAgICAgICAgIGdlbmUgICAgICA9IHsgZyB9XG4gICAgICAgICAgICAgIHNlbGVjdGlvbiA9IHsgc2VsZWN0aW9uW2cubmFtZV0gfVxuICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZSA9IHsgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBvblNlbGVjdGlvbkNoYW5nZShnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICB9IH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICBwYWlyV3JhcHBlcnMucHVzaChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbXNcIiBrZXk9e2Nocm9tb3NvbWVOYW1lfT5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPENocm9tb3NvbWVJbWFnZVZpZXcgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5vbWUtdGVzdC1vcHRpb25zXCI+XG4gICAgICAgICAgeyBwdWxsZG93bnMgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2Vub21lLXRlc3RcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblRlc3RQdWxsZG93blZpZXcucHJvcFR5cGVzID0ge1xuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGdlbmU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgc2VsZWN0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuR2Vub21lVGVzdFZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaGlkZGVuQWxsZWxlczogUHJvcFR5cGVzLmFycmF5LFxuICBzZWxlY3Rpb246IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uU2VsZWN0aW9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHZW5vbWVUZXN0VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENocm9tb3NvbWVWaWV3IGZyb20gJy4vY2hyb21vc29tZSc7XG5cbi8qKlxuICogVmlldyBvZiB0aGUgc2V0IG9mIGNocm9tb3NvbWVzIG9mIGFuIG9yZ2FuaXNtLCBvcmRlcmVkIGFzIG1hdGNoZWQgcGFpcnMuXG4gKlxuICogVXN1YWxseSBkZWZpbmVkIGJ5IHBhc3NpbmcgaW4gYSBCaW9sb2dpY2EgT3JnYW5pc20sIGJ1dCBtYXkgYWxzbyBiZSBkZWZpbmVkIGJ5XG4gKiBwYXNzaW5nIGluIGEgbWFwIG9mIEJpb2xvZ2ljYSBDaHJvbW9zb21lcyBhbmQgYSBCaW9sb2dpY2EgU3BlY2llcy5cbiAqL1xuY29uc3QgR2Vub21lVmlldyA9ICh7b3JnLCBjaHJvbW9zb21lcywgc3BlY2llcywgaGlkZGVuQWxsZWxlcyA9IFtdLCBlZGl0YWJsZT10cnVlLCBzaG93TGFiZWxzPXRydWUsIHNob3dBbGxlbGVzPWZhbHNlLCBzZWxlY3RlZENocm9tb3NvbWVzPXt9LCBzbWFsbD1mYWxzZSwgb3JnTmFtZSwgb25BbGxlbGVDaGFuZ2UsIG9uQ2hyb21vc29tZVNlbGVjdGVkfSkgPT4ge1xuICBsZXQgcGFpcldyYXBwZXJzID0gW107XG4gIGlmIChvcmcpIHtcbiAgICBjaHJvbW9zb21lcyA9IG9yZy5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lcztcbiAgICBzcGVjaWVzID0gb3JnLnNwZWNpZXM7XG4gIH1cbiAgZm9yIChsZXQgY2hyb21vc29tZU5hbWUgb2Ygc3BlY2llcy5jaHJvbW9zb21lTmFtZXMpIHtcbiAgICBsZXQgY2hyb20gPSBjaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0sXG4gICAgICAgIHBhaXJzID0gW107XG4gICAgZm9yIChsZXQgc2lkZSBpbiBjaHJvbSkge1xuICAgICAgbGV0IGNocm9tb3NvbWUgPSBjaHJvbVtzaWRlXTtcbiAgICAgIHBhaXJzLnB1c2goXG4gICAgICAgIDxDaHJvbW9zb21lVmlld1xuICAgICAgICAgIGNocm9tb3NvbWU9e2Nocm9tb3NvbWV9XG4gICAgICAgICAga2V5PXtwYWlycy5sZW5ndGggKyAxfVxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM9e2hpZGRlbkFsbGVsZXN9XG4gICAgICAgICAgbGFiZWxzT25SaWdodD17cGFpcnMubGVuZ3RoPjAgfHwgc2lkZT09PVwiYlwifVxuICAgICAgICAgIGVkaXRhYmxlPXtlZGl0YWJsZX1cbiAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWRDaHJvbW9zb21lc1tjaHJvbW9zb21lTmFtZV0gPT09IHNpZGV9XG4gICAgICAgICAgc2hvd0xhYmVscz17c2hvd0xhYmVsc31cbiAgICAgICAgICBzaG93QWxsZWxlcz17c2hvd0FsbGVsZXN9XG4gICAgICAgICAgc21hbGw9e3NtYWxsfVxuICAgICAgICAgIG9yZ05hbWU9e29yZ05hbWV9XG4gICAgICAgICAgb25BbGxlbGVDaGFuZ2U9e2Z1bmN0aW9uKHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICAgICAgb25BbGxlbGVDaGFuZ2UoY2hyb21vc29tZU5hbWUsIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNocm9tb3NvbWVTZWxlY3RlZD17ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmIChvbkNocm9tb3NvbWVTZWxlY3RlZClcbiAgICAgICAgICAgICAgb25DaHJvbW9zb21lU2VsZWN0ZWQob3JnLCBjaHJvbW9zb21lTmFtZSwgc2lkZSk7XG4gICAgICAgICAgfX0vPlxuICAgICAgKTtcbiAgICB9XG4gICAgcGFpcldyYXBwZXJzLnB1c2goXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgY2hyb21vc29tZS1wYWlyXCIga2V5PXtwYWlyV3JhcHBlcnMubGVuZ3RoICsgMX0+XG4gICAgICAgIHsgcGFpcnMgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBnZW5vbWVcIj5cbiAgICAgIHsgcGFpcldyYXBwZXJzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdlbm9tZVZpZXcucHJvcFR5cGVzID0ge1xuICBvcmc6IFByb3BUeXBlcy5vYmplY3QsXG4gIGNocm9tb3NvbWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBzcGVjaWVzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBoaWRkZW5BbGxlbGVzOiBQcm9wVHlwZXMuYXJyYXksXG4gIG9uQWxsZWxlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBlZGl0YWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQ2hyb21vc29tZVNlbGVjdGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb3JnTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2Vub21lVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcblxuY29uc3QgR2xvd0JhY2tncm91bmRWaWV3ID0gKHtpZCwgY29sb3IsIHNpemUsIGNvbnRhaW5lclN0eWxlPXt9LCBnbG93U3R5bGU9e30sIENoaWxkQ29tcG9uZW50LCBjaGlsZFN0eWxlPXt9LCAuLi5vdGhlcnN9KSA9PiB7XG4gIGNvbnN0IHRDb250YWluZXJTdHlsZSA9IHsgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemUsIC4uLmNvbnRhaW5lclN0eWxlIH0sXG4gICAgICAgIHRHbG93U3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5nbG93U3R5bGUgfSxcbiAgICAgICAgdENoaWxkU3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCAuLi5jaGlsZFN0eWxlIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImdlbmlibG9ja3MgZ2xvdy1iYWNrZ3JvdW5kXCIgc3R5bGU9e3RDb250YWluZXJTdHlsZX0+XG4gICAgICA8Q2lyY3VsYXJHbG93VmlldyBpZD17J2dsb3ctJytpZH0gY29sb3I9e2NvbG9yfSBzaXplPXtzaXplfSBzdHlsZT17dEdsb3dTdHlsZX0vPlxuICAgICAgPENoaWxkQ29tcG9uZW50IGlkPXsnY2hpbGQtJytpZH0gc3R5bGU9e3RDaGlsZFN0eWxlfSB3aWR0aD17c2l6ZX0gey4uLm90aGVyc30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkdsb3dCYWNrZ3JvdW5kVmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgY29udGFpbmVyU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIGdsb3dTdHlsZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgQ2hpbGRDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGNoaWxkU3R5bGU6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdsb3dCYWNrZ3JvdW5kVmlldztcbiIsIi8qXG4gKiBCYXNlZCBvbiBSZWFjdE92ZXJsYXlzIGRlbW8gYXQgaHR0cDovL3JlYWN0LWJvb3RzdHJhcC5naXRodWIuaW8vcmVhY3Qtb3ZlcmxheXMvZXhhbXBsZXMvI21vZGFsc1xuICovXG5pbXBvcnQgTW9kYWwgZnJvbSAncmVhY3Qtb3ZlcmxheXMvbGliL01vZGFsJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IENoYWxsZW5nZUF3YXJkVmlldyBmcm9tICcuL2NoYWxsZW5nZS1hd2FyZCc7XG5pbXBvcnQgUmVhY3QsIHsgUHJvcFR5cGVzIH0gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBtb2RhbFN0eWxlID0ge1xuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiAxMDQwLFxuICB0b3A6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDBcbn07XG5cbmNvbnN0IGJhY2tkcm9wU3R5bGUgPSB7XG4gIC4uLm1vZGFsU3R5bGUsXG4gIHpJbmRleDogJ2F1dG8nLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJyxcbiAgb3BhY2l0eTogMC4xXG59O1xuXG5jb25zdCBkaWFsb2dTdHlsZSA9IGZ1bmN0aW9uKHRvcD1cIjUwJVwiKSB7XG4gIC8vIHdlIHVzZSBzb21lIHBzdWVkbyByYW5kb20gY29vcmRzIHNvIG5lc3RlZCBtb2RhbHNcbiAgLy8gZG9uJ3Qgc2l0IHJpZ2h0IG9uIHRvcCBvZiBlYWNoIG90aGVyLlxuICBsZXQgbGVmdCA9IDUwO1xuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAzODUsXG4gICAgdG9wOiB0b3AsIGxlZnQ6IGxlZnQgKyAnJScsXG4gICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKC01MCUsIC0ke2xlZnR9JSlgLFxuICAgIGJhY2tncm91bmRJbWFnZTogJ3VybChyZXNvdXJjZXMvaW1hZ2VzL3BhcmNobWVudC5qcGcpJyxcbiAgICBiYWNrZ3JvdW5kUmVwZWF0OiAnbm8tcmVwZWF0JyxcbiAgICBiYWNrZ3JvdW5kT3JpZ2luOiAnYm9yZGVyLWJveCcsXG4gICAgYm94U2hhZG93OiAnMCAxMHB4IDVweCByZ2JhKDAsMCwwLC41KScsXG4gICAgcGFkZGluZzogMjAsXG4gICAgb3V0bGluZTogJ25vbmUnXG4gIH07XG59O1xuXG5cbmNsYXNzIE1vZGFsQWxlcnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgc2hvdzogUHJvcFR5cGVzLmJvb2wsXG4gICAgbWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBleHBsYW5hdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsZWZ0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0pLFxuICAgIHJpZ2h0QnV0dG9uOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0pLFxuICAgIG9uSGlkZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25MZWZ0QnV0dG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gb3B0aW9uYWwgY2xpY2sgaGFuZGxlcnMgaWYgbm90IGRlZmluZWRcbiAgICBvblJpZ2h0QnV0dG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLCAgICAgICAvLyBpbiBidXR0b24gcHJvcHMuIChCZXR0ZXIgZm9yIGBtYXBEaXNwYXRjaFRvUHJvcHNgKVxuICAgIGNoYWxsZW5nZUF3YXJkczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICB0b3A6IFByb3BUeXBlcy5zdHJpbmdcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc2hvdzogZmFsc2UsXG4gICAgY2hhbGxlbmdlQXdhcmRzOiB7IGlkOjAsIHByb2dyZXNzOiBbXSB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLyogZXNsaW50IHJlYWN0L2pzeC1oYW5kbGVyLW5hbWVzOiAwICovXG4gICAgY29uc3QgbGVmdFByb3BzID0gdGhpcy5wcm9wcy5sZWZ0QnV0dG9uIHx8IHt9LFxuICAgICAgICAgIGxlZnRCdXR0b24gPSBsZWZ0UHJvcHMubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPEJ1dHRvbiBsYWJlbD17bGVmdFByb3BzLmxhYmVsIHx8IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWxlcnQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtsZWZ0UHJvcHMub25DbGljayB8fCB0aGlzLnByb3BzLm9uTGVmdEJ1dHRvbkNsaWNrfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgcmlnaHRQcm9wcyA9IHRoaXMucHJvcHMucmlnaHRCdXR0b24gfHwge30sXG4gICAgICAgICAgcmlnaHRCdXR0b24gPSA8QnV0dG9uIGxhYmVsPXtyaWdodFByb3BzLmxhYmVsIHx8IFwiXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFsZXJ0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3JpZ2h0UHJvcHMub25DbGljayB8fCB0aGlzLnByb3BzLm9uUmlnaHRCdXR0b25DbGlja30vPjtcbiAgICB2YXIgYXdhcmRWaWV3O1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2hhbGxlbmdlQXdhcmRzKXtcbiAgICAgIGF3YXJkVmlldyA9IDxDaGFsbGVuZ2VBd2FyZFZpZXcgY2hhbGxlbmdlQXdhcmRzPXt0aGlzLnByb3BzLmNoYWxsZW5nZUF3YXJkc30gLz47XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8TW9kYWwgIGFyaWEtbGFiZWxsZWRieT0nbW9kYWwtbGFiZWwnXG4gICAgICAgICAgICAgIHN0eWxlPXttb2RhbFN0eWxlfVxuICAgICAgICAgICAgICBiYWNrZHJvcFN0eWxlPXtiYWNrZHJvcFN0eWxlfVxuICAgICAgICAgICAgICBzaG93PXt0aGlzLnByb3BzLnNob3d9XG4gICAgICAgICAgICAgIG9uSGlkZT17dGhpcy5wcm9wcy5vbkhpZGV9ID5cbiAgICAgICAgPGRpdiBzdHlsZT17ZGlhbG9nU3R5bGUodGhpcy5wcm9wcy50b3ApfSA+XG4gICAgICAgICAgPGg0IGlkPSdtb2RhbC1sYWJlbCc+e3RoaXMucHJvcHMubWVzc2FnZX08L2g0PlxuICAgICAgICAgIHthd2FyZFZpZXd9XG4gICAgICAgICAgPHA+e3RoaXMucHJvcHMuZXhwbGFuYXRpb259PC9wPlxuICAgICAgICAgIHtsZWZ0QnV0dG9ufSB7cmlnaHRCdXR0b259XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Nb2RhbD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsQWxlcnQ7XG5cbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcbmltcG9ydCBPcmdhbmlzbVZpZXcgZnJvbSAnLi9vcmdhbmlzbSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIEJpb0xvZ2ljYSBvcmdhbmlzbSBhcyBhbiBpbWFnZSBvbiB0b3Agb2YgYSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kLlxuICogSW1wbGVtZW50ZWQgYXMgYSBSZWFjdCBzdGF0ZWxlc3MgZnVuY3Rpb25hbCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IG9yZyAtIHRoZSBvcmdhbmlzbSB0byBiZSByZXByZXNlbnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdGhlIGNvbG9yIG9mIHRoZSBjaXJjdWxhciBncmFkaWVudCBcImdsb3dcIiBiYWNrZ3JvdW5kIHZpZXcuXG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICovXG5jb25zdCBPcmdhbmlzbUdsb3dWaWV3ID0gKHtpZCwgY2xhc3NOYW1lLCBjb2xvcj1cIiNGRkZGQUFcIiwgc2l6ZT0yMDAsIHN0eWxlPXt9LCAuLi5vdGhlcn0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBnbG93U3R5bGUgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnIH0sXG4gICAgICAgIG9yZ1N0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgLi4uc3R5bGUgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9e2lkfSBjbGFzc05hbWU9e2BnZW5pYmxvY2tzIG9yZ2FuaXNtLWdsb3cgJHtjbGFzc05hbWV9YH0gc3R5bGU9e2NvbnRhaW5lclN0eWxlfT5cbiAgICAgIDxDaXJjdWxhckdsb3dWaWV3IGlkPXtgJHtpZH0tZ2xvd2B9IGNvbG9yPXtjb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e2dsb3dTdHlsZX0vPlxuICAgICAgPE9yZ2FuaXNtVmlldyBpZD17YCR7aWR9LW9yZ2FuaXNtYH0gd2lkdGg9e3NpemV9IHN0eWxlPXtvcmdTdHlsZX0gey4uLm90aGVyfSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21HbG93Vmlldy5wcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzdHlsZTogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBPcmdhbmlzbVZpZXcgPSAoe29yZywgaWQsIHdpZHRoPTIwMCwgZmxpcHBlZD1mYWxzZSwgc3R5bGU9e30sIG9uQ2xpY2ssIHdyYXBwZXIgfSkgPT4ge1xuICBjb25zdCBiYXNlVXJsID0gXCJodHRwczovL2dlbml2ZXJzZS1yZXNvdXJjZXMuY29uY29yZC5vcmcvcmVzb3VyY2VzL2RyYWtlcy9pbWFnZXMvXCIsXG4gICAgICAgIHVybCAgICAgPSBiYXNlVXJsICsgb3JnLmdldEltYWdlTmFtZSgpLFxuICAgICAgICAvLyBUaGUgZ29hbCBoZXJlIHdhcyB0byBoYXZlIHRoZSBvbk1vdXNlRG93biBoYW5kbGVyIHNlbGVjdCB0aGUgb3JnYW5pc20sXG4gICAgICAgIC8vIHNvIHRoYXQgbW91c2Vkb3duLWRyYWcgd2lsbCBib3RoIHNlbGVjdCB0aGUgb3JnYW5pc20gYW5kIGJlZ2luIHRoZVxuICAgICAgICAvLyBkcmFnLiBUaGlzIHdvcmtzIG9uIENocm9tZSBhbmQgU2FmYXJpLCBidXQgb24gRmlyZWZveCBpdCBkaXNhYmxlc1xuICAgICAgICAvLyBkcmFnZ2luZy4gRGlzYWJsaW5nIHRoZSBvbk1vdXNlRG93biBoYW5kbGVyIG1lYW5zIHRoYXQgRmlyZWZveCB1c2Vyc1xuICAgICAgICAvLyBtdXN0IGNsaWNrIHRvIHNlbGVjdCBhbmQgdGhlbiBjbGljayB0byBkcmFnLCBidXQgYXQgbGVhc3QgdGhleSBjYW5cbiAgICAgICAgLy8gZHJhZy4gVGhlIHJpZ2h0IHNvbHV0aW9uIGlzIHByb2JhYmx5IHRvIGFsbG93IG9yZ2FuaXNtcyB0byBiZSBkcmFnZ2VkXG4gICAgICAgIC8vIHdoZXRoZXIgb3Igbm90IHRoZXkncmUgc2VsZWN0ZWQgYW5kIHRoZW4gaG9wZWZ1bGx5IHRoZSBvbk1vdXNlRG93blxuICAgICAgICAvLyBoYW5kbGVyIHdpbGwgd29yayBhcyBleHBlY3RlZC4gT3RoZXJ3aXNlLCBpdCBtYXkgYmUgbmVjZXNzYXJ5IHRvXG4gICAgICAgIC8vIHNlbGVjdCB0aGUgb3JnYW5pc20gKGlmIGl0IGlzbid0IGFscmVhZHkgc2VsZWN0ZWQpIGluIGJlZ2luRHJhZy5cbiAgICAgICAgaXNGaXJlZm94ID0gKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdmaXJlZm94JykgPj0gMCksXG4gICAgICAgIGhhbmRsZU1vdXNlRG93biA9IGlzRmlyZWZveCA/IHVuZGVmaW5lZCA6IGhhbmRsZUNsaWNrLFxuICAgICAgICBkaXZXcmFwcGVyID0gd3JhcHBlciB8fCBmdW5jdGlvbihlbHQpIHsgcmV0dXJuIGVsdDsgfTtcblxuICBsZXQgY2xhc3NOYW1lID0gXCJnZW5pYmxvY2tzIG9yZ2FuaXNtXCI7XG4gIGlmIChmbGlwcGVkKSB7XG4gICAgY2xhc3NOYW1lICs9IFwiIGZsaXBwZWRcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGlkLCBvcmcpO1xuICB9XG5cbiAgcmV0dXJuIGRpdldyYXBwZXIoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gaWQ9e2lkfSBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgb25Nb3VzZURvd249e2hhbmRsZU1vdXNlRG93bn0gb25DbGljaz17aGFuZGxlQ2xpY2t9PlxuICAgICAgPGltZyBzcmM9e3VybH0gd2lkdGg9e3dpZHRofSAvPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT3JnYW5pc21WaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICB3cmFwcGVyOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JnYW5pc21WaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUGVuVmlldyBmcm9tICcuL3Blbic7XG5pbXBvcnQgU3RhdHNWaWV3IGZyb20gJy4vc3RhdHMnO1xuaW1wb3J0IFRhYnMgZnJvbSAncmVhY3Qtc2ltcGxldGFicyc7XG5cbmNsYXNzIFBlblN0YXRzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIGxhc3RDbHV0Y2hTaXplOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBvblNlbGVjdGlvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG9yZ3MsIGxhc3RDbHV0Y2hTaXplLCBzZWxlY3RlZEluZGV4LCBvblNlbGVjdGlvbkNoYW5nZSwgLi4ub3RoZXJzIH0gPSB0aGlzLnByb3BzLFxuICAgICAgICAgIGxhc3RDbHV0Y2ggPSBvcmdzLnNsaWNlKC1sYXN0Q2x1dGNoU2l6ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRhYnM+XG4gICAgICAgIDxUYWJzLlBhbmVsIHRpdGxlPVwiQnJlZWRpbmcgUGVuXCIga2V5PVwiQnJlZWRpbmcgUGVuXCI+XG4gICAgICAgICAgPFBlblZpZXcgb3Jncz17bGFzdENsdXRjaH0gey4uLm90aGVyc31cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXg9e3NlbGVjdGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtmdW5jdGlvbihpU2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob25TZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Rpb25DaGFuZ2UoaVNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgICA8VGFicy5QYW5lbCB0aXRsZT1cIlN0YXRzXCIga2V5PVwiU3RhdHNcIj5cbiAgICAgICAgICA8U3RhdHNWaWV3IG9yZ3M9e29yZ3N9IGxhc3RDbHV0Y2hTaXplPXtsYXN0Q2x1dGNoU2l6ZX0gLz5cbiAgICAgICAgPC9UYWJzLlBhbmVsPlxuICAgICAgPC9UYWJzPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVuU3RhdHNWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgT3JnYW5pc21WaWV3IGZyb20gJy4vb3JnYW5pc20nO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dzIC0gT3B0aW9uIG51bWJlciBvZiByb3dzLiBJZiBkZWZpbmVkLCBpdCB3aWxsIGJlIGZpeGVkIGF0IHRoYXQuIE90aGVyd2lzZSwgaXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCBkZWZhdWx0IHRvIDEgd2hlbiB0aGVyZSBhcmUgbm8gb3JncywgYW5kIGdyb3dzIGFzIG1vcmUgcm93cyBhcmUgbmVlZGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IHRpZ2h0ZW5Sb3dzIC0gSWYgZ2l2ZW4sIHdpbGwgc2hyaW5rIHRoZSB2ZXJ0aWNhbCBoZWlnaHQgb2YgdGhlIHBlbiBieSB0aGlzIGFtb3VudFxuICogICAgICAgICAgICAgICAgICAgICAgICBwZXIgcm93LCBjcm93ZGluZyB0aGUgb3JnIGltYWdlcyBhcyBuZWVkZWQuXG4gKi9cbmNvbnN0IFBlblZpZXcgPSAoe29yZ3MsIGlkUHJlZml4PSdvcmdhbmlzbS0nLCB3aWR0aD00MDAsIGNvbHVtbnM9NSwgcm93cywgdGlnaHRlblJvd3M9MCwgdGlnaHRlbkNvbHVtbnM9MCwgU2VsZWN0ZWRPcmdhbmlzbVZpZXc9T3JnYW5pc21WaWV3LCBzZWxlY3RlZEluZGV4LCBvbkNsaWNrfSkgPT4ge1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGlkLCBvcmcpIHtcbiAgICBjb25zdCBwcmVmaXhJbmRleCA9IGlkLmluZGV4T2YoaWRQcmVmaXgpLFxuICAgICAgICAgIGluZGV4ID0gTnVtYmVyKGlkLnN1YnN0cihwcmVmaXhJbmRleCArIGlkUHJlZml4Lmxlbmd0aCkpO1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGluZGV4LCBpZCwgb3JnKTtcbiAgfVxuXG4gIGxldCBvcmdTdHlsZSA9IHtcbiAgICBtYXJnaW46IGAkey10aWdodGVuUm93cy8yfXB4ICR7LXRpZ2h0ZW5Db2x1bW5zLzJ9cHhgXG4gIH07XG5cbiAgbGV0IG9yZ1dpZHRoID0gd2lkdGgvY29sdW1ucyxcbiAgICAgIG9yZ1ZpZXdzID0gb3Jncy5tYXAoKG9yZywgaW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGluZGV4ID09PSBzZWxlY3RlZEluZGV4XG4gICAgICAgICAgICAgICAgPyA8U2VsZWN0ZWRPcmdhbmlzbVZpZXcgb3JnPXtvcmd9IGlkPXtpZFByZWZpeCArIGluZGV4fSBpbmRleD17aW5kZXh9IGtleT17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cIiNGRkZGQUFcIiBzaXplPXtvcmdXaWR0aH0gc3R5bGU9e29yZ1N0eWxlfSBvbkNsaWNrPXtoYW5kbGVDbGlja30vPlxuICAgICAgICAgICAgICAgIDogPE9yZ2FuaXNtVmlldyBvcmc9e29yZ30gaWQ9e2lkUHJlZml4ICsgaW5kZXh9IGluZGV4PXtpbmRleH0ga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e29yZ1dpZHRofSBzdHlsZT17b3JnU3R5bGV9IG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSAvPjtcbiAgICAgIH0pO1xuXG4gIHJvd3MgPSByb3dzIHx8IE1hdGguY2VpbChvcmdWaWV3cy5sZW5ndGggLyBjb2x1bW5zKSB8fCAxO1xuXG4gIGxldCBoZWlnaHQgPSBvcmdXaWR0aCAqIHJvd3M7XG5cbiAgd2lkdGggID0gd2lkdGggIC0gKHRpZ2h0ZW5Db2x1bW5zICogY29sdW1ucyk7XG4gIGhlaWdodCA9IGhlaWdodCAtICh0aWdodGVuUm93cyAqIHJvd3MpO1xuXG4gIGxldCBzdHlsZSA9IHsgd2lkdGgsIGhlaWdodCB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHBlblwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICB7IG9yZ1ZpZXdzIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBlblZpZXcucHJvcFR5cGVzID0ge1xuICBvcmdzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICBpZFByZWZpeDogUHJvcFR5cGVzLnN0cmluZyxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNvbHVtbnM6IFByb3BUeXBlcy5udW1iZXIsXG4gIHJvd3M6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRpZ2h0ZW5Db2x1bW5zOiBQcm9wVHlwZXMubnVtYmVyLFxuICB0aWdodGVuUm93czogUHJvcFR5cGVzLm51bWJlcixcbiAgU2VsZWN0ZWRPcmdhbmlzbVZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICBzZWxlY3RlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGVuVmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENpcmN1bGFyR2xvd1ZpZXcgZnJvbSAnLi9jaXJjdWxhci1nbG93JztcblxuY29uc3QgUXVlc3Rpb25HbG93VmlldyA9ICh7Z2xvd0NvbG9yLCBzaXplPTIwMH0pID0+IHtcbiAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9LFxuICAgICAgICBnbG93U3R5bGUgPSB7cG9zaXRpb246ICdhYnNvbHV0ZSd9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3dcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgPENpcmN1bGFyR2xvd1ZpZXcgY29sb3I9e2dsb3dDb2xvcn0gc2l6ZT17c2l6ZX0gc3R5bGU9e2dsb3dTdHlsZX0vPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW5pYmxvY2tzIHF1ZXN0aW9uLWdsb3cgcXVlc3Rpb24tbWFya1wiXG4gICAgICAgICAgICBzdHlsZT17e3Bvc2l0aW9uOiBcImFic29sdXRlXCIsIHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemV9fT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuICAvLyBIVE1MIHRleHQgbm9kZVxuICAvLzxkaXYgc3R5bGU9e3RTdHlsZX0+e3RleHR9PC9kaXY+XG5cbiAgLy8gU1ZHIHRleHQgbm9kZVxuICAvLzxzdmcgd2lkdGg9e3NpemUrMn0gaGVpZ2h0PXtzaXplKzJ9IHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgLy8gIDx0ZXh0IHg9JzUwJyB5PScxNzUnIGZpbGw9JyMwRDBEOEMnIHN0eWxlPXt0U3R5bGV9PlxuICAvLyAgICB7dGV4dH1cbiAgLy8gIDwvdGV4dD5cbiAgLy88L3N2Zz5cbn07XG5cblF1ZXN0aW9uR2xvd1ZpZXcucHJvcFR5cGVzID0ge1xuICBnbG93Q29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25HbG93VmlldztcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IE9yZ2FuaXNtR2xvd1ZpZXcgZnJvbSAnLi9vcmdhbmlzbS1nbG93JztcbmltcG9ydCBRdWVzdGlvbkdsb3dWaWV3IGZyb20gJy4vcXVlc3Rpb24tZ2xvdyc7XG5cbmNvbnN0IFF1ZXN0aW9uT3JnYW5pc21HbG93VmlldyA9ICh7aGlkZGVuLCBjb2xvciwgc2l6ZSwgLi4ub3RoZXJ9KSA9PiB7XG4gIGNvbnN0IG9yZ1ZpZXcgPSA8T3JnYW5pc21HbG93VmlldyBjb2xvcj17Y29sb3J9IHNpemU9e3NpemV9IHsuLi5vdGhlcn0gLz4sXG4gICAgICAgIHF1ZXN0aW9uVmlldyA9IDxRdWVzdGlvbkdsb3dWaWV3IGdsb3dDb2xvcj17Y29sb3J9IHdpZHRoPXtzaXplfSAvPixcbiAgICAgICAgZmluYWxWaWV3ID0gaGlkZGVuID8gcXVlc3Rpb25WaWV3IDogb3JnVmlldztcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBxdWVzdGlvbi1vcmdhbmlzbS1nbG93XCI+XG4gICAgICB7ZmluYWxWaWV3fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3LnByb3BUeXBlcyA9IHtcbiAgaGlkZGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgY29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgc2l6ZTogUHJvcFR5cGVzLm51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR2VuZXRpY3NVdGlscyBmcm9tICcuLi91dGlsaXRpZXMvZ2VuZXRpY3MtdXRpbHMnO1xuXG4vKipcbiAqIFN0YXRlbGVzcyBmdW5jdGlvbmFsIFJlYWN0IGNvbXBvbmVudCBmb3IgZGlzcGxheWluZyBicmVlZGluZyBzdGF0aXN0aWNzIGZvciBhIHNldCBvZiBCaW9sb2dpY2Egb3JnYW5pc21zXG4gKiBAcGFyYW0ge09iamVjdFtdfSBvcmdzIC0gYXJyYXkgb2YgQmlvbG9naWNhIG9yZ2FuaXNtcyBmb3Igd2hpY2ggc3RhdGlzdGljcyBhcmUgdG8gYmUgZGlzcGxheWVkXG4gKiBAcGFyYW0ge09iamVjdH0gb3Jnc1tdLnBoZW5vdHlwZSAtIHRoZSBwaGVub3R5cGUgb2YgdGhlIEJpb2xvZ2ljYSBvcmdhbmlzbVxuICogQHBhcmFtIHtudW1iZXJ9IFtsYXN0Q2x1dGNoU2l6ZT1vcmdzLmxlbmd0aF0gLSB0aGUgbnVtYmVyIG9mIG9yZ2FuaXNtcyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSB0aGF0IGNvbXByaXNlIHRoZSBtb3N0IHJlY2VudCBjbHV0Y2hcbiAqL1xuY29uc3QgU3RhdHNWaWV3ID0gKHtvcmdzLCBsYXN0Q2x1dGNoU2l6ZX0pID0+IHtcblxuICBsZXQgdHJhaXRzID0gR2VuZXRpY3NVdGlscy5jb21wdXRlVHJhaXRDb3VudHNGb3JPcmdhbmlzbXMob3JncywgbGFzdENsdXRjaFNpemUpLFxuICAgICAgY2x1dGNoU2l6ZSA9IGxhc3RDbHV0Y2hTaXplIHx8IG9yZ3MubGVuZ3RoLFxuICAgICAgcm93cyA9IFtdO1xuXG4gIC8vIGJ1aWxkIGN1bXVsYXRpdmUgc3RhdHMgZm9yIHRhYmxlIHJvd3NcbiAgbGV0IHRyYWl0TnVtID0gMDtcbiAgZm9yIChjb25zdCBbdHJhaXQsIHZhbHVlc10gb2YgdHJhaXRzKSB7XG4gICAgZm9yIChjb25zdCBbdmFsdWUsIGNvdW50c10gb2YgdmFsdWVzKSB7XG4gICAgICBjb25zdCBjTWFsZXMgPSBjb3VudHMuY2x1dGNoW0Jpb0xvZ2ljYS5NQUxFXSxcbiAgICAgICAgICAgIGNGZW1hbGVzID0gY291bnRzLmNsdXRjaFtCaW9Mb2dpY2EuRkVNQUxFXSxcbiAgICAgICAgICAgIGNUb3RhbCA9IGNNYWxlcyArIGNGZW1hbGVzLFxuICAgICAgICAgICAgY1BjdCA9IE1hdGgucm91bmQoMTAwICogY1RvdGFsIC8gY2x1dGNoU2l6ZSksXG4gICAgICAgICAgICB0TWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLk1BTEVdLFxuICAgICAgICAgICAgdEZlbWFsZXMgPSBjb3VudHMudG90YWxbQmlvTG9naWNhLkZFTUFMRV0sXG4gICAgICAgICAgICB0VG90YWwgPSB0TWFsZXMgKyB0RmVtYWxlcyxcbiAgICAgICAgICAgIHRQY3QgPSBNYXRoLnJvdW5kKDEwMCAqIHRUb3RhbCAvIG9yZ3MubGVuZ3RoKTtcbiAgICAgIHJvd3MucHVzaCh7IHRyYWl0LCB0cmFpdE51bSwgdmFsdWUsIGNNYWxlcywgY0ZlbWFsZXMsIGNUb3RhbCwgY1BjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRNYWxlcywgdEZlbWFsZXMsIHRUb3RhbCwgdFBjdCB9KTtcbiAgICB9XG4gICAgKysgdHJhaXROdW07XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VuaWJsb2NrcyBzdGF0c1wiPlxuICAgICAgPHRhYmxlIGlkPVwic3RhdHMtdGFibGVcIiBjbGFzc05hbWU9e29yZ3MubGVuZ3RoID4gMCA/IFwiaGFzLWRhdGFcIiA6IFwibm8tZGF0YVwifT5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5UcmFpdCBWYWx1ZTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5DbHV0Y2g8L3RoPjx0aD5GPC90aD48dGg+TTwvdGg+XG4gICAgICAgICAgICA8dGggY29sU3Bhbj1cIjJcIj5Ub3RhbDwvdGg+PHRoPkY8L3RoPjx0aD5NPC90aD5cbiAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtcbiAgICAgICAgICByb3dzLm1hcChmdW5jdGlvbihyb3csIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8dHIga2V5PXtpbmRleH0gY2xhc3NOYW1lPXtyb3cudHJhaXROdW0gJiAxID8gXCJvZGQtdHJhaXRcIiA6IFwiZXZlbi10cmFpdFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10cmFpdC12YWx1ZT17cm93LnZhbHVlfT5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibGFiZWxcIj57cm93LnZhbHVlfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LmNUb3RhbH08L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jUGN0fSU8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jRmVtYWxlc308L3RkPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJudW1lcmljXCI+e3Jvdy5jTWFsZXN9PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwibnVtZXJpY1wiPntyb3cudFRvdGFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRQY3R9JTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRGZW1hbGVzfTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm51bWVyaWNcIj57cm93LnRNYWxlc308L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU3RhdHNWaWV3LnByb3BUeXBlcyA9IHtcbiAgb3JnczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgbGFzdENsdXRjaFNpemU6IFByb3BUeXBlcy5udW1iZXJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXRzVmlldztcbiIsIi8qXG4gKiBTZWUgaHR0cHM6Ly9tZWRpdW0uY29tL0BrZW50Y2RvZGRzL21pc3VuZGVyc3RhbmRpbmctZXM2LW1vZHVsZXMtdXBncmFkaW5nLWJhYmVsLXRlYXJzLWFuZC1hLXNvbHV0aW9uLWFkMmQ1YWI5M2NlMCMucTF2Y2tmZml3XG4gKiAoS2VudCBDLiBEb2RkcywgXCJNaXN1bmRlcnN0YW5kaW5nIEVTNiBNb2R1bGVzLCBVcGdyYWRpbmcgQmFiZWwsIFRlYXJzLCBhbmQgYSBTb2x1dGlvblwiKVxuICogZm9yIGRlc2NyaXB0aW9uIG9mIHNvbWUgb2YgdGhlIGRldGFpbHMgaW52b2x2ZWQgaW4gbWl4aW5nIEVTNiBleHBvcnQgd2l0aCByZXF1aXJlKCkuXG4gKi9cblxuLy8gY29tcG9uZW50c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBbGxlbGVGaWx0ZXJzVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9hbGxlbGUtZmlsdGVycyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFsbGVsZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvYWxsZWxlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQW5pbWF0ZWRHYW1ldGVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLWdhbWV0ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEFuaW1hdGVkT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2FuaW1hdGVkLW9yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENoYW5nZVNleEJ1dHRvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbmdlLXNleC1idXR0b25zJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZUltYWdlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9jaHJvbW9zb21lLWltYWdlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ2hyb21vc29tZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hyb21vc29tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIENpcmN1bGFyR2xvd1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2lyY3VsYXItZ2xvdyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlZWRiYWNrVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZWVkYmFjayc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEZlcnRpbGl6aW5nR2FtZXRlVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9mZXJ0aWxpemluZy1nYW1ldGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHYW1ldGVQb29sVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nYW1ldGUtcG9vbCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdhbWV0ZVZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2FtZXRlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2VuZUxhYmVsVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nZW5lLWxhYmVsJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgR2Vub21lVGVzdFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvZ2Vub21lLXRlc3QnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHZW5vbWVWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL2dlbm9tZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdsb3dCYWNrZ3JvdW5kVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9nbG93LWJhY2tncm91bmQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNb2RhbEFsZXJ0IH0gZnJvbSAnLi9jb21wb25lbnRzL21vZGFsLWFsZXJ0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21WaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL29yZ2FuaXNtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT3JnYW5pc21HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9vcmdhbmlzbS1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGVuVmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9wZW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQZW5TdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvcGVuLXN0YXRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25HbG93VmlldyB9IGZyb20gJy4vY29tcG9uZW50cy9xdWVzdGlvbi1nbG93JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUXVlc3Rpb25PcmdhbmlzbUdsb3dWaWV3IH0gZnJvbSAnLi9jb21wb25lbnRzL3F1ZXN0aW9uLW9yZ2FuaXNtLWdsb3cnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTdGF0c1ZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdHMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGFsbGVuZ2VBd2FyZFZpZXcgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhbGxlbmdlLWF3YXJkJztcblxuLy8gdXRpbGl0aWVzXG5leHBvcnQgeyBkZWZhdWx0IGFzIEdlbmV0aWNzVXRpbHMgfSBmcm9tICcuL3V0aWxpdGllcy9nZW5ldGljcy11dGlscyc7XG4iLCIvKipcbiAqIENsYXNzIHByb3ZpZGluZyB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgQmlvTG9naWNhIGdlbmV0aWNzIG9wZXJhdGlvbnMuXG4gKiBJbiBzb21lIGNhc2VzIHRoZXNlIGFyZSBhZGFwdGVkIGZyb20gY29ycmVzcG9uZGluZyBjb2RlIGluIEdlbml2ZXJzZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXRpY3NVdGlscyB7XG5cbiAgc3RhdGljIGVuc3VyZVZhbGlkT3JnYW5pc20ob3JnT3JEZWYsIHNwZWNpZXM9QmlvTG9naWNhLlNwZWNpZXMuRHJha2UpIHtcbiAgICBpZiAob3JnT3JEZWYuZ2V0QWxsZWxlU3RyaW5nKSB7XG4gICAgICByZXR1cm4gb3JnT3JEZWY7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKHNwZWNpZXMsIG9yZ09yRGVmLmFsbGVsZVN0cmluZywgb3JnT3JEZWYuc2V4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXJzIG91dCBoaWRkZW4gYWxsZWxlcyBmcm9tIGFuIG9yaWdpbmFsIGxpc3Qgb2YgYWxsZWxlc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhbGxlbGVzIC0gdGhlIHNldCBvZiBhbGxlbGVzIHRvIGJlIGZpbHRlcmVkXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGhpZGRlbkFsbGVsZXMgLSB0aGUgYWxsZWxlcyBpZGVudGlmeWluZyB0aGUgaGlkZGVuIGdlbmVzXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLnNwZWNpZXN9IHNwZWNpZXMgLSB0aGUgc3BlY2llcyB0aGF0IGRlZmluZXMgdGhlIGdlbm90eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ1tdfSAtIHRoZSBmaWx0ZXJlZCBhbGxlbGVzXG4gICAqL1xuICBzdGF0aWMgZmlsdGVyQWxsZWxlcyhhbGxlbGVzLCBoaWRkZW5BbGxlbGVzLCBzcGVjaWVzKSB7XG4gICAgY29uc3QgaGlkZGVuR2VuZXMgPSBoaWRkZW5BbGxlbGVzLm1hcChhID0+IEJpb0xvZ2ljYS5HZW5ldGljcy5nZXRHZW5lT2ZBbGxlbGUoc3BlY2llcywgYSkpO1xuICAgIHJldHVybiBhbGxlbGVzLmZpbHRlcihhID0+IHtcbiAgICAgIGNvbnN0IGdlbmUgPSBCaW9Mb2dpY2EuR2VuZXRpY3MuZ2V0R2VuZU9mQWxsZWxlKHNwZWNpZXMsIGEpO1xuICAgICAgcmV0dXJuIGhpZGRlbkdlbmVzLmluZGV4T2YoZ2VuZSkgPT09IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgYSBtYXAgb2YgdHJhaXRzIC0+IHRyYWl0VmFsdWVzIC0+IHRyYWl0Q291bnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbVtdfSBvcmdhbmlzbXMgLSB0aGUgc2V0IG9mIG9yZ2FuaXNtcyB0byBjb21wdXRlIHN0YXRzIGZvclxuICAgKiBAcGFyYW0ge251bWJlcn0gY2x1dGNoU2l6ZSAtIHRoZSBsYXN0ICdjbHV0Y2hTaXplJyBvcmdhbmlzbXMgYXJlIGFzc3VtZWQgdG8gYmUgdGhlIGxhc3QgY2x1dGNoXG4gICAqIEByZXR1cm4ge01hcH0gLSBlLmcuIHsgXCJ0YWlsXCI6IHsgXCJsb25nIHRhaWxcIjogeyBcImNsdXRjaFwiOiBbOSwgMTFdLCBcInRvdGFsXCI6IFs1MywgNDddIH19fVxuICAgKi9cbiAgc3RhdGljIGNvbXB1dGVUcmFpdENvdW50c0Zvck9yZ2FuaXNtcyhvcmdhbmlzbXMsIGxhc3RDbHV0Y2hTaXplKSB7XG4gICAgbGV0IHRyYWl0cyA9IG5ldyBNYXAsXG4gICAgICAgIGNsdXRjaFNpemUgPSBsYXN0Q2x1dGNoU2l6ZSB8fCBvcmdhbmlzbXMubGVuZ3RoO1xuXG4gICAgLy8gYWNjdW11bGF0ZSBzdGF0cyBmb3IgZWFjaCB0cmFpdC92YWx1ZSBjb21iaW5hdGlvblxuICAgIGZvciAoY29uc3QgW2luZGV4LCBvcmddIG9mIG9yZ2FuaXNtcy5lbnRyaWVzKCkpIHtcbiAgICAgIGZvciAoY29uc3QgdHJhaXQgb2YgT2JqZWN0LmtleXMob3JnLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MpKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IG9yZy5waGVub3R5cGUuY2hhcmFjdGVyaXN0aWNzW3RyYWl0XSxcbiAgICAgICAgICAgIHRyYWl0VmFsdWVzID0gdHJhaXRzLmdldCh0cmFpdCkgfHwgbmV3IE1hcCxcbiAgICAgICAgICAgIHZhbHVlQ291bnRzID0gdHJhaXRWYWx1ZXMuZ2V0KHZhbHVlKSB8fCB7IGNsdXRjaDogWzAsIDBdLCB0b3RhbDogWzAsIDBdIH07XG4gICAgICAgIGlmICghdHJhaXRzLmhhcyh0cmFpdCkpIHRyYWl0cy5zZXQodHJhaXQsIHRyYWl0VmFsdWVzKTtcbiAgICAgICAgaWYgKCF0cmFpdFZhbHVlcy5oYXModmFsdWUpKSB0cmFpdFZhbHVlcy5zZXQodmFsdWUsIHZhbHVlQ291bnRzKTtcbiAgICAgICAgLy8gbW9zdCByZWNlbnQgY2x1dGNoIGFzc3VtZWQgdG8gYmUgYXQgZW5kIG9mIG9yZ2FuaXNtcyBhcnJheVxuICAgICAgICBpZiAoaW5kZXggPj0gb3JnYW5pc21zLmxlbmd0aCAtIGNsdXRjaFNpemUpXG4gICAgICAgICAgKysgdmFsdWVDb3VudHMuY2x1dGNoW29yZy5zZXhdO1xuICAgICAgICArKyB2YWx1ZUNvdW50cy50b3RhbFtvcmcuc2V4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRyYWl0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbiBhbGxlbGUgc3RyaW5nIHRvIGEgSmF2YVNjcmlwdCBvYmplY3QgdGhhdCBtYXBzIGdlbmVzIHRvIGFsbGVsZXMuXG4gICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCBmb3IgY29tcGFyaXNvbiBwdXJwb3NlcywgZm9yIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5HZW5ldGljc30gZ2VuZXRpY3MgLSBnZW5ldGljcyBvYmplY3QgdG8gdXNlIGZvciBnZW5lIG1hcHBpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIGJlIG1vZGlmaWVkXG4gICAqIEByZXR1cm4ge29iamVjdH0gLSBnZW5lIG1hcCBvZiBmb3JtIHsgaG9ybnM6IHthOlwiaFwiLCBiOlwiaFwifSwgYXJtb3I6IHthOlwiYVwiLCBiOlwiYVwifSwgLi4ufVxuICAgKi9cbiAgc3RhdGljIGJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZykge1xuICAgIGxldCBnZW5lTWFwID0ge30sXG4gICAgICAgIGFsbGVsZVN1YnN0cmluZ3MgPSBhbGxlbGVTdHJpbmcuc3BsaXQoXCIsXCIpO1xuICAgIGZvciAoY29uc3QgYWxsZWxlU3Vic3RyIG9mIGFsbGVsZVN1YnN0cmluZ3MpIHtcbiAgICAgIGNvbnN0IFtzaWRlLCBhbGxlbGVdID0gYWxsZWxlU3Vic3RyLnNwbGl0KFwiOlwiKSxcbiAgICAgICAgICAgIGdlbmUgPSBnZW5ldGljcy5nZW5lRm9yQWxsZWxlKGFsbGVsZSk7XG4gICAgICBpZiAoc2lkZSAmJiBhbGxlbGUgJiYgZ2VuZSkge1xuICAgICAgICBpZiAoIWdlbmVNYXBbZ2VuZV0pIGdlbmVNYXBbZ2VuZV0gPSB7fTtcbiAgICAgICAgZ2VuZU1hcFtnZW5lXVtzaWRlXSA9IGFsbGVsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdlbmVNYXA7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gYW4gYWxsZWxlIHN0cmluZyBhbmQgYSBnZW5lIG1hcCBkZWZpbmluZyBhIHNldCBvZiBiYXNlIChkZWZhdWx0KSBhbGxlbGVzLFxuICAgKiByZXR1cm5zIGEgbmV3IGFsbGVsZSBzdHJpbmcgd2l0aCBtaXNzaW5nIGFsbGVsZXMgcmVwbGFjZWQgYnkgdGhlaXIgZGVmYXVsdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QmlvTG9naWNhLkdlbmV0aWNzfSBnZW5ldGljcyAtIGdlbmV0aWNzIG9iamVjdCB0byB1c2UgZm9yIGdlbmUgbWFwcGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWxsZWxlU3RyaW5nIC0gYWxsZWxlIHN0cmluZyBvZiBmb3JtIFwiYTpoLGI6aCxhOmEsYjphLi4uXCIgdG8gYmUgbW9kaWZpZWRcbiAgICogQHBhcmFtIHtvYmplY3R9IGJhc2VHZW5lTWFwIC0gZ2VuZSBtYXAgb2YgZm9ybSB7IGhvcm46IHthOlwiaFwiLCBiOlwiaFwifSwgYXJtb3I6IHthOlwiYVwiLCBiOlwiYVwifSwgLi4ufVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gdXBkYXRlZCBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIlxuICAgKi9cbiAgc3RhdGljIGZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUdlbmVNYXAoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUdlbmVNYXApIHtcbiAgICBjb25zdCBkc3RHZW5lTWFwID0gR2VuZXRpY3NVdGlscy5idWlsZEdlbmVNYXBGcm9tQWxsZWxlU3RyaW5nKGdlbmV0aWNzLCBhbGxlbGVTdHJpbmcpO1xuICAgIGxldCAgIGRzdEFsbGVsZVN0cmluZyA9IGFsbGVsZVN0cmluZztcbiAgICBmb3IgKGNvbnN0IGdlbmUgaW4gZHN0R2VuZU1hcCkge1xuICAgICAgY29uc3QgZ2VuZVZhbHVlID0gZHN0R2VuZU1hcFtnZW5lXTtcbiAgICAgIC8vIHJlcGxhY2UgYSBtaXNzaW5nICdhJyBzaWRlIGFsbGVsZSB3aXRoIHRoZSBkZWZhdWx0IGlmIGFwcHJvcHJpYXRlXG4gICAgICBpZiAoIWdlbmVWYWx1ZS5hICYmIGJhc2VHZW5lTWFwW2dlbmVdICYmIGJhc2VHZW5lTWFwW2dlbmVdLmEpIHtcbiAgICAgICAgZHN0QWxsZWxlU3RyaW5nID0gZHN0QWxsZWxlU3RyaW5nLnJlcGxhY2UoYGI6JHtnZW5lVmFsdWUuYn1gLCBgYToke2Jhc2VHZW5lTWFwW2dlbmVdLmF9LCQmYCk7XG4gICAgICB9XG4gICAgICAvLyByZXBsYWNlIGEgbWlzc2luZyAnYicgc2lkZSBhbGxlbGUgd2l0aCB0aGUgZGVmYXVsdCBpZiBhcHByb3ByaWF0ZVxuICAgICAgaWYgKCFnZW5lVmFsdWUuYiAmJiBiYXNlR2VuZU1hcFtnZW5lXSAmJiBiYXNlR2VuZU1hcFtnZW5lXS5iKSB7XG4gICAgICAgIGRzdEFsbGVsZVN0cmluZyA9IGRzdEFsbGVsZVN0cmluZy5yZXBsYWNlKGBhOiR7Z2VuZVZhbHVlLmF9YCwgYCQmLGI6JHtiYXNlR2VuZU1hcFtnZW5lXS5ifWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZHN0QWxsZWxlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHR3byBhbGxlbGUgc3RyaW5ncywgcmV0dXJucyBhIG5ldyBhbGxlbGUgc3RyaW5nIGluIHdoaWNoIG1pc3NpbmcgYWxsZWxlc1xuICAgKiBpbiB0aGUgZmlyc3QgYXJlIHJlcGxhY2VkIGJ5IGRlZmF1bHRzIHByb3ZpZGVkIGJ5IHRoZSBzZWNvbmQgYWxsZWxlIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuR2VuZXRpY3N9IGdlbmV0aWNzIC0gZ2VuZXRpY3Mgb2JqZWN0IHRvIHVzZSBmb3IgZ2VuZSBtYXBwaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhbGxlbGVTdHJpbmcgLSBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIiB0byBiZSBtb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZUFsbGVsZVN0cmluZyAtIGFsbGVsZSBzdHJpbmcgb2YgZm9ybSBcImE6aCxiOmgsYTphLGI6YS4uLlwiIHRvIHVzZSBhcyBkZWZhdWx0c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gdXBkYXRlZCBhbGxlbGUgc3RyaW5nIG9mIGZvcm0gXCJhOmgsYjpoLGE6YSxiOmEuLi5cIlxuICAgKi9cbiAgc3RhdGljIGZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUFsbGVsZVN0cmluZyhnZW5ldGljcywgYWxsZWxlU3RyaW5nLCBiYXNlQWxsZWxlU3RyaW5nKSB7XG4gICAgY29uc3QgYmFzZUdlbmVNYXAgPSBHZW5ldGljc1V0aWxzLmJ1aWxkR2VuZU1hcEZyb21BbGxlbGVTdHJpbmcoZ2VuZXRpY3MsIGJhc2VBbGxlbGVTdHJpbmcpO1xuICAgIHJldHVybiBHZW5ldGljc1V0aWxzLmZpbGxJbk1pc3NpbmdBbGxlbGVzRnJvbUdlbmVNYXAoZ2VuZXRpY3MsIGFsbGVsZVN0cmluZywgYmFzZUdlbmVNYXApO1xuICB9XG5cbiAgc3RhdGljIG51bWJlck9mQnJlZWRpbmdNb3Zlc1RvUmVhY2hEcmFrZShvcmdhbmlzbTEsIG9yZ2FuaXNtMiwgY2hhbmdlYWJsZUFsbGVsZXMxLCBjaGFuZ2VhYmxlQWxsZWxlczIsIHRhcmdldE9yZ2FuaXNtKSB7XG4gICAgdmFyIG1vdmVzID0gMCxcbiAgICAgICAgb3JnMUFsbGVsZXMgPSBvcmdhbmlzbTEuZ2V0QWxsZWxlU3RyaW5nKCkuc3BsaXQoJywnKS5tYXAoYSA9PiBhLnNwbGl0KCc6JylbMV0pLFxuICAgICAgICBvcmcyQWxsZWxlcyA9IG9yZ2FuaXNtMi5nZXRBbGxlbGVTdHJpbmcoKS5zcGxpdCgnLCcpLm1hcChhID0+IGEuc3BsaXQoJzonKVsxXSksXG4gICAgICAgIHRhcmdldGNoYXJzID0gdGFyZ2V0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgdHJhaXRSdWxlcyA9IG9yZ2FuaXNtMS5zcGVjaWVzLnRyYWl0UnVsZXM7XG5cbiAgICBmb3IgKHZhciB0cmFpdCBpbiB0cmFpdFJ1bGVzKSB7XG4gICAgICBpZiAodHJhaXRSdWxlcy5oYXNPd25Qcm9wZXJ0eSh0cmFpdCkpIHtcbiAgICAgICAgdmFyIHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Y2hhcnNbdHJhaXRdXSxcbiAgICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IEluZmluaXR5O1xuICAgICAgICBpZiAocG9zc2libGVTb2x1dGlvbnMgJiYgcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoOyBpPGlpOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb2x1dGlvbiA9IHBvc3NpYmxlU29sdXRpb25zW2ldLFxuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24xID0gMCxcbiAgICAgICAgICAgICAgICBtb3Zlc0ZvclNvbHV0aW9uMiA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamogPSBzb2x1dGlvbi5sZW5ndGg7IGo8amo7IGorKykge1xuICAgICAgICAgICAgICB2YXIgYWxsZWxlMSA9IHNvbHV0aW9uW2pdLFxuICAgICAgICAgICAgICAgICAgYWxsZWxlMiA9IGolMiA9PT0gMCA/IHNvbHV0aW9uW2orMV0gOiBzb2x1dGlvbltqLTFdLFxuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IDA7XG4gICAgICAgICAgICAgIGlmIChvcmcxQWxsZWxlcy5pbmRleE9mKGFsbGVsZTEpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxlbGUxICYmIChjaGFuZ2VhYmxlQWxsZWxlczEuaW5kZXhPZihhbGxlbGUxKSA+IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWFibGVBbGxlbGVzMS5pbmRleE9mKGFsbGVsZTEudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgIHNvbHV0aW9uTW92ZXMrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcyA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChvcmcyQWxsZWxlcy5pbmRleE9mKGFsbGVsZTIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxlbGUyICYmIChjaGFuZ2VhYmxlQWxsZWxlczIuaW5kZXhPZihhbGxlbGUyKSA+IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgICAgY2hhbmdlYWJsZUFsbGVsZXMyLmluZGV4T2YoYWxsZWxlMi50b0xvd2VyQ2FzZSgpKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgc29sdXRpb25Nb3ZlcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzb2x1dGlvbk1vdmVzID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGolMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1vdmVzRm9yU29sdXRpb24xICs9IHNvbHV0aW9uTW92ZXM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW92ZXNGb3JTb2x1dGlvbjIgKz0gc29sdXRpb25Nb3ZlcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvcnRlc3RQYXRoID0gTWF0aC5taW4oc2hvcnRlc3RQYXRoLCBNYXRoLm1pbihtb3Zlc0ZvclNvbHV0aW9uMSwgbW92ZXNGb3JTb2x1dGlvbjIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW92ZXMgKz0gc2hvcnRlc3RQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzZXBhcmF0ZSBjaGFuZ2VzLCBpbmNsdWRpbmcgYWxsZWxlIGNoYW5nZXMgYW5kIHNleCBjaGFuZ2VzLFxuICAgKiByZXF1aXJlZCB0byBtYXRjaCB0aGUgcGhlbm90eXBlIG9mIHRoZSAndGVzdE9yZ2FuaXNtJyB0byB0aGF0IG9mIHRoZSAndGFyZ2V0T3JnYW5pc20nLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jpb0xvZ2ljYS5PcmdhbmlzbX0gdGVzdE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIHRvIHdoaWNoIGNoYW5nZXMgd291bGQgYXBwbHlcbiAgICogQHBhcmFtIHtCaW9Mb2dpY2EuT3JnYW5pc219IHRhcmdldE9yZ2FuaXNtIC0gdGhlIG9yZ2FuaXNtIHRoYXQgc2VydmVzIGFzIGRlc3RpbmF0aW9uXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSB0aGUgdG90YWwgbnVtYmVyIG9mIGNoYW5nZXMgcmVxdWlyZWQgZm9yIHRoZSBwaGVub3R5cGVzIHRvIG1hdGNoXG4gICAqL1xuICBzdGF0aWMgbnVtYmVyT2ZDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0T3JnYW5pc20sIHRhcmdldE9yZ2FuaXNtKSB7XG4gICAgdGVzdE9yZ2FuaXNtID0gdGhpcy5lbnN1cmVWYWxpZE9yZ2FuaXNtKHRlc3RPcmdhbmlzbSk7XG4gICAgdGFyZ2V0T3JnYW5pc20gPSB0aGlzLmVuc3VyZVZhbGlkT3JnYW5pc20odGFyZ2V0T3JnYW5pc20pO1xuXG4gICAgbGV0IHJlcXVpcmVkQ2hhbmdlQ291bnQgPSBHZW5ldGljc1V0aWxzLm51bWJlck9mQWxsZWxlQ2hhbmdlc1RvUmVhY2hQaGVub3R5cGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdE9yZ2FuaXNtLnBoZW5vdHlwZS5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0T3JnYW5pc20ucGhlbm90eXBlLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20uZ2VuZXRpY3MuZ2Vub3R5cGUuYWxsQWxsZWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0T3JnYW5pc20uc3BlY2llcy50cmFpdFJ1bGVzKTtcbiAgICBpZiAodGVzdE9yZ2FuaXNtLnNleCAhPT0gdGFyZ2V0T3JnYW5pc20uc2V4KVxuICAgICAgKytyZXF1aXJlZENoYW5nZUNvdW50O1xuXG4gICAgcmV0dXJuIHJlcXVpcmVkQ2hhbmdlQ291bnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHNlcGFyYXRlIGFsbGVsZSBjaGFuZ2VzIHJlcXVpcmVkIHRvIG1ha2UgdGhlIHBoZW5vdHlwZSBvZlxuICAgKiB0aGUgb3JnYW5pc20gY2hhcmFjdGVyaXplZCBieSAndGVzdENoYXJhY3RlcnN0aWNzJyBtYXRjaCB0aGF0IG9mIHRoZSBvcmdhbmlzbVxuICAgKiBjaGFyYWN0ZXJpemVkIGJ5ICd0YXJnZXRDaGFyYWN0ZXJpc3RpY3MnLiBBZGFwdGVkIGZyb206XG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvbmNvcmQtY29uc29ydGl1bS9HZW5pdmVyc2UtU3Byb3V0Q29yZS9ibG9iL21hc3Rlci9mcmFtZXdvcmtzL2dlbml2ZXJzZS9jb250cm9sbGVycy9tYXRjaC5qc1xuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gdGVzdENoYXJhY3RlcmlzdGljcyAtIHRoZSBjaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHRlc3Qgb3JnYW5pc21cbiAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldENoYXJhY3RlcmlzdGljcyAtIHRoZSBjaGFyYWN0ZXJpc3RpY3Mgb2YgdGhlIHRhcmdldCBvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0ZXN0QWxsZWxlcyAtIHRoZSBhcnJheSBvZiBhbGxlbGVzIG9mIHRoZSB0ZXN0IG9yZ2FuaXNtXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0cmFpdFJ1bGVzIC0gdGhlIHRyYWl0UnVsZXMgb2YgdGhlIEJpb0xvZ2ljYS5TcGVjaWVzIG9mIHRoZSBvcmdhbmlzbXNcbiAgICogQHJldHVybiB7bnVtYmVyfSAtIHRoZSBudW1iZXIgb2YgYWxsZWxlIGNoYW5nZXMgcmVxdWlyZWQgZm9yIHRoZSBwaGVub3R5cGVzIHRvIG1hdGNoXG4gICAqL1xuICBzdGF0aWMgbnVtYmVyT2ZBbGxlbGVDaGFuZ2VzVG9SZWFjaFBoZW5vdHlwZSh0ZXN0Q2hhcmFjdGVyaXN0aWNzLCB0YXJnZXRDaGFyYWN0ZXJpc3RpY3MsIHRlc3RBbGxlbGVzLCB0cmFpdFJ1bGVzKSB7XG4gICAgY29uc3QgYWxsZWxlcyA9IHRlc3RBbGxlbGVzO1xuICAgIGxldCAgIG1vdmVzID0gMDtcblxuICAgIGZvciAoY29uc3QgdHJhaXQgaW4gdHJhaXRSdWxlcykge1xuICAgICAgaWYgKHRyYWl0UnVsZXMuaGFzT3duUHJvcGVydHkodHJhaXQpKSB7XG4gICAgICAgIGlmICh0ZXN0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSAhPT0gdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XSkge1xuICAgICAgICAgIC8vIGZpcnN0IHdlIGhhdmUgdG8gd29yayBvdXQgd2hhdCBhbGxlbGVzIHRoZSBvcmlnaW5hbCBkcmFrZSBoYXMgdGhhdCBjb3JyZXNwb25kIHRvXG4gICAgICAgICAgLy8gdGhlaXIgbm9uLW1hdGNoaW5nIHRyYWl0XG4gICAgICAgICAgY29uc3QgcG9zc2libGVUcmFpdEFsbGVsZXMgPSBHZW5ldGljc1V0aWxzLmNvbGxlY3RBbGxBbGxlbGVzRm9yVHJhaXQodHJhaXQsIHRyYWl0UnVsZXMpO1xuICAgICAgICAgIGxldCAgIGNoYXJhY3RlcmlzdGljQWxsZWxlcyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGFsbGVsZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlVHJhaXRBbGxlbGVzLmluZGV4T2YoYWxsZWxlc1tpXSkgPj0gMCl7XG4gICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljQWxsZWxlcy5wdXNoKGFsbGVsZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBub3cgd29yayBvdXQgdGhlIHNtYWxsZXN0IG51bWJlciBvZiBzdGVwcyB0byBnZXQgZnJvbSB0aGVyZSB0byB0aGUgZGVzaXJlZCBjaGFyYWN0ZXJpc3RpY1xuICAgICAgICAgIGNvbnN0IHBvc3NpYmxlU29sdXRpb25zID0gdHJhaXRSdWxlc1t0cmFpdF1bdGFyZ2V0Q2hhcmFjdGVyaXN0aWNzW3RyYWl0XV07XG4gICAgICAgICAgbGV0ICAgc2hvcnRlc3RQYXRoTGVuZ3RoID0gSW5maW5pdHk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gcG9zc2libGVTb2x1dGlvbnMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgbGV0IHNvbHV0aW9uID0gcG9zc2libGVTb2x1dGlvbnNbaV0uc2xpY2UoKSxcbiAgICAgICAgICAgICAgICBwYXRoTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IGNoYXJhY3RlcmlzdGljQWxsZWxlcy5sZW5ndGg7IGogPCBqajsgaisrKXtcbiAgICAgICAgICAgICAgaWYgKHNvbHV0aW9uLmluZGV4T2YoY2hhcmFjdGVyaXN0aWNBbGxlbGVzW2pdKSA9PT0gLTEpe1xuICAgICAgICAgICAgICAgIHBhdGhMZW5ndGgrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb2x1dGlvbi5zcGxpY2Uoc29sdXRpb24uaW5kZXhPZihjaGFyYWN0ZXJpc3RpY0FsbGVsZXNbal0pLCAxKTsgLy8gYWxyZWFkeSBtYXRjaGVkIHRoaXMgb25lLCBjYW4ndCBtYXRjaCBpdCBhZ2FpblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaG9ydGVzdFBhdGhMZW5ndGggPSAocGF0aExlbmd0aCA8IHNob3J0ZXN0UGF0aExlbmd0aCkgPyBwYXRoTGVuZ3RoIDogc2hvcnRlc3RQYXRoTGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtb3ZlcyArPSBzaG9ydGVzdFBhdGhMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vdmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvZXMgdGhyb3VnaCB0aGUgdHJhaXRSdWxlcyB0byBmaW5kIG91dCB3aGF0IHVuaXF1ZSBhbGxlbGVzIGFyZSBhc3NvY2lhdGVkIHdpdGggZWFjaCB0cmFpdFxuICAgKiBlLmcuIEZvciBcInRhaWxcIiBpdCB3aWxsIHJldHVybiBbXCJUXCIsIFwiVGtcIiwgXCJ0XCJdLiBBZGFwdGVkIGZyb206XG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NvbmNvcmQtY29uc29ydGl1bS9HZW5pdmVyc2UtU3Byb3V0Q29yZS9ibG9iL21hc3Rlci9mcmFtZXdvcmtzL2dlbml2ZXJzZS9jb250cm9sbGVycy9tYXRjaC5qc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJhaXQgLSBuYW1lIG9mIHRyYWl0LCBlLmcuIFwidGFpbFwiXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0cmFpdFJ1bGVzIC0gdGhlIHRyYWl0UnVsZXMgb2YgdGhlIEJpb0xvZ2ljYS5TcGVjaWVzIHdob3NlIHRyYWl0cyBhcmUgb2YgaW50ZXJlc3RcbiAgICogQHJldHVybiB7c3RyaW5nW119IC0gYXJyYXkgb2YgYWxsZWxlIHN0cmluZ3MsIGUuZy4gW1wiVFwiLCBcIlRrXCIsIFwidFwiXVxuICAgKi9cbiAgc3RhdGljIF9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdCA9IHt9O1xuICBzdGF0aWMgY29sbGVjdEFsbEFsbGVsZXNGb3JUcmFpdCh0cmFpdCwgdHJhaXRSdWxlcykge1xuICAgIGlmIChHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF0pIHtcbiAgICAgIHJldHVybiBHZW5ldGljc1V0aWxzLl9wb3NzaWJsZUFsbGVsZXNGb3JUcmFpdFt0cmFpdF07XG4gICAgfVxuXG4gICAgbGV0IGFsbGVsZXNIYXNoID0ge30sXG4gICAgICAgIGFsbGVsZXMgICAgID0gW107XG4gICAgZm9yIChjb25zdCBjaGFyYWN0ZXJpc3RpYyBpbiB0cmFpdFJ1bGVzW3RyYWl0XSl7XG4gICAgICAgIGZvciAoY29uc3QgcG9zc2liaWxlQWxsZWxlc0NvbWJvIGluIHRyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXSkge1xuICAgICAgICAgIGlmICh0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY10uaGFzT3duUHJvcGVydHkocG9zc2liaWxlQWxsZWxlc0NvbWJvKSl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0cmFpdFJ1bGVzW3RyYWl0XVtjaGFyYWN0ZXJpc3RpY11bcG9zc2liaWxlQWxsZWxlc0NvbWJvXS5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgIGFsbGVsZXNIYXNoW3RyYWl0UnVsZXNbdHJhaXRdW2NoYXJhY3RlcmlzdGljXVtwb3NzaWJpbGVBbGxlbGVzQ29tYm9dW2ldXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhbGxlbGUgaW4gYWxsZWxlc0hhc2gpe1xuICAgICAgYWxsZWxlcy5wdXNoKGFsbGVsZSk7XG4gICAgfVxuXG4gICAgR2VuZXRpY3NVdGlscy5fcG9zc2libGVBbGxlbGVzRm9yVHJhaXRbdHJhaXRdID0gYWxsZWxlczsgIC8vIHN0b3JlIHNvIHdlIGRvbid0IG5lZWQgdG8gcmVjYWxjdWxhdGUgaXRcbiAgICByZXR1cm4gYWxsZWxlcztcbiAgfVxufVxuIl19
